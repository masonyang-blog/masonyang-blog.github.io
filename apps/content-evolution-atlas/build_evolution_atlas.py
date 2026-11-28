#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
apps/content-evolution-atlas/build_evolution_atlas.py
Mason Yang Blog — Content Evolution Atlas 薄轉接資料產生器 (Zero-Dependency, Idempotent)

單一掃描器原則：
- 透過 in-process 匯入 tools.analyze_content_evolution.run_analysis() 取得演化指標與全站 link_map。
- 本腳本嚴禁自行解析 HTML，嚴禁透過 subprocess 呼叫外部腳本再讀 JSON。
- 輸出決定性 (deterministic) JS 檔：assets/data/content-evolution-atlas.js (window.__EVOLUTION_ATLAS__)。

使用範例：
    py apps/content-evolution-atlas/build_evolution_atlas.py
    py apps/content-evolution-atlas/build_evolution_atlas.py --gsc Pages.csv
    py apps/content-evolution-atlas/build_evolution_atlas.py --quiet
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from tools.analyze_content_evolution import (  # noqa: E402
    DEFAULT_BASE_URL,
    _normalize_internal_href,
    run_analysis,
)
from tools.propagate_metrics import (  # noqa: E402
    DEFAULT_REGISTRY_PATH,
    audit_freshness_cli,
    extract_latest_news_date,
)

DEFAULT_ATLAS_OUT = ROOT_DIR / "assets" / "data" / "content-evolution-atlas.js"

TOPIC_FRESHNESS_ORDER: Tuple[str, ...] = (
    "topic-macro",
    "topic-ai",
    "topic-crypto-web3",
    "topic-gold-currency-crisis",
    "topic-mental-health-rehab",
    "topic-core",
)

LAYER_ORDER: Tuple[str, ...] = (
    "L1A_POINT_PROJECT",
    "L1B_POINT_KNOWLEDGE",
    "L1C_PLANE_TOPIC",
    "L2_LINE_POST",
    "L2_LINE_NEWS",
    "L2_LINE_AI_WORKFLOW",
    "L0_PULSE",
)

EDGE_TYPE_ORDER: Dict[str, int] = {
    "callout_backfill": 0,
    "timeline_cite": 1,
    "hub_aggregate": 2,
    "body_link": 3,
    "entity_link": 4,
    "pulse_ref": 5,
    "gap_suggest": 6,
}


def classify_layer(node_key: str) -> Optional[str]:
    """依路徑規則判定節點所屬「點／線／面／脈衝」層級。"""
    if node_key.startswith("pulse:"):
        return "L0_PULSE"
    if node_key.startswith("project/"):
        return "L1A_POINT_PROJECT"
    if node_key.startswith("knowledge/"):
        return "L1B_POINT_KNOWLEDGE"
    if node_key.startswith("post/topic-"):
        return "L1C_PLANE_TOPIC"
    if node_key.startswith("post/"):
        return "L2_LINE_POST"
    if node_key.startswith("news/"):
        return "L2_LINE_NEWS"
    if node_key.startswith("ai-workflow/"):
        return "L2_LINE_AI_WORKFLOW"
    return None


def _is_entity_target(target: str) -> bool:
    return target.startswith("project/") or target.startswith("knowledge/")


def build_atlas_payload(
    gsc_path: Optional[Path] = None,
    gsc_base_url: str = DEFAULT_BASE_URL,
) -> Dict[str, Any]:
    """透過 in-process run_analysis() 組裝 Content Evolution Atlas 資料契約。"""
    report = run_analysis(
        gsc_path=gsc_path,
        gsc_base_url=gsc_base_url,
        quiet=True,
        include_link_map=True,
        write_outputs=False,
    )

    link_map: Dict[str, Dict[str, Set[str]]] = report.get("link_map", {})
    aux: Dict[str, Any] = report.get("_atlas_aux", {})
    pulse_list: List[Dict[str, Any]] = aux.get("pulse_list", [])
    gsc_impressions: Dict[str, int] = aux.get("gsc_impressions", {})

    # 1. 蒐集全站節點與層級映射
    layers: Dict[str, str] = {}
    for link in sorted(link_map.keys()):
        layer = classify_layer(link)
        if layer:
            layers[link] = layer

    pulse_nodes: List[Tuple[str, Optional[str]]] = []
    for p in pulse_list:
        pid = str(p.get("id", "")).strip()
        if not pid:
            continue
        p_key = f"pulse:{pid}"
        layers[p_key] = "L0_PULSE"
        rel_url = str(p.get("related_post_url", "") or "").strip()
        norm_target = _normalize_internal_href(rel_url, "") if rel_url else None
        pulse_nodes.append((p_key, norm_target))

    # 2. 組裝真實連結邊（排除重複與自連結）
    real_edge_set: Set[Tuple[str, str, str]] = set()
    real_pair_seen: Set[Tuple[str, str]] = set()

    for source in sorted(link_map.keys()):
        entry = link_map[source]
        targets = sorted(entry.get("targets", set()))
        callout_targets = entry.get("callout_targets", set())
        timeline_targets = entry.get("timeline_targets", set())
        source_layer = layers.get(source)

        for target in targets:
            if target == source or target not in layers:
                continue

            if source_layer == "L2_LINE_NEWS" and target in callout_targets and target.startswith("post/"):
                etype = "callout_backfill"
            elif source.startswith("post/") and target in timeline_targets and target.startswith("news/"):
                etype = "timeline_cite"
            elif source_layer == "L1C_PLANE_TOPIC" and (target.startswith("post/") or target.startswith("news/")):
                etype = "hub_aggregate"
            elif _is_entity_target(target):
                etype = "entity_link"
            else:
                etype = "body_link"

            real_edge_set.add((source, target, etype))
            real_pair_seen.add((source, target))

    # Pulse -> related_post_url
    for p_key, norm_target in sorted(pulse_nodes):
        if norm_target and norm_target in layers:
            real_edge_set.add((p_key, norm_target, "pulse_ref"))
            real_pair_seen.add((p_key, norm_target))

    # 3. 純衍生 gap_suggest 邊（僅來自既有 analyzer 輸出，不另寫推論邏輯）
    gap_edge_set: Set[Tuple[str, str, str]] = set()

    for cand in report.get("backfill_candidates", []):
        src = cand.get("news_link", "")
        if src not in layers:
            continue
        for dst in cand.get("target_posts", []):
            if dst in layers and src != dst and (src, dst) not in real_pair_seen:
                gap_edge_set.add((src, dst, "gap_suggest"))

    for gap in report.get("freshness_gaps", []):
        src = gap.get("post_link", "")
        if src not in layers:
            continue
        for item in gap.get("uncited_newer_news", []):
            dst = item.get("link", "")
            if dst in layers and src != dst and (src, dst) not in real_pair_seen:
                gap_edge_set.add((src, dst, "gap_suggest"))

    for wave in report.get("same_wave_clusters", []):
        if wave.get("consolidated"):
            continue
        src = wave.get("earlier_link", "")
        dst = wave.get("later_link", "")
        if src in layers and dst in layers and src != dst and (src, dst) not in real_pair_seen:
            gap_edge_set.add((src, dst, "gap_suggest"))

    all_edges_sorted = sorted(
        real_edge_set | gap_edge_set,
        key=lambda e: (EDGE_TYPE_ORDER.get(e[2], 99), e[0], e[1]),
    )
    edges: List[Dict[str, str]] = [
        {"source": s, "target": t, "type": et} for (s, t, et) in all_edges_sorted
    ]

    # 4. 計算節點指標 metrics（僅以真實連結計算出入度）
    in_deg: Counter[str] = Counter()
    out_deg: Counter[str] = Counter()
    for s, t, _ in real_edge_set:
        out_deg[s] += 1
        in_deg[t] += 1

    has_timeline_map: Dict[str, bool] = {}
    for p in report.get("evergreen_posts", []):
        has_timeline_map[p["link"]] = bool(p.get("has_timeline", False))
    for h in report.get("topic_hubs", []):
        has_timeline_map[h["link"]] = bool(h.get("has_timeline", False))

    uncited_map: Dict[str, int] = {
        g["post_link"]: int(g.get("uncited_newer_news_count", 0))
        for g in report.get("freshness_gaps", [])
        if g.get("post_link")
    }

    metrics: Dict[str, Dict[str, Any]] = {}
    for node_key in sorted(layers.keys()):
        lm_entry = link_map.get(node_key)
        has_callout = bool(lm_entry and lm_entry.get("callout_targets"))
        m_rec: Dict[str, Any] = {
            "inDegree": int(in_deg.get(node_key, 0)),
            "outDegree": int(out_deg.get(node_key, 0)),
            "hasCallout": has_callout,
            "hasTimeline": bool(has_timeline_map.get(node_key, False)),
            "uncitedNewerNewsCount": int(uncited_map.get(node_key, 0)),
        }
        if node_key in gsc_impressions:
            m_rec["gscImpressions"] = int(gsc_impressions[node_key])
        metrics[node_key] = m_rec

    # 5. 統計 meta（UI 數字唯一來源；使用決定性日期確保同日連跑冪等）
    layer_counts: Dict[str, int] = {k: 0 for k in LAYER_ORDER}
    for layer_name in layers.values():
        layer_counts[layer_name] = layer_counts.get(layer_name, 0) + 1

    edge_type_counts: Counter[str] = Counter(e["type"] for e in edges)
    orphan_count = sum(
        1 for k, m in metrics.items()
        if not k.startswith("pulse:") and m["inDegree"] == 0
    )

    evolution = {
        "overview": report.get("overview", {}),
        "topics": report.get("topics", []),
        "tags": report.get("tags", []),
        "action_queue": report.get("action_queue", []),
        "freshness_gaps": report.get("freshness_gaps", []),
        "backfill_candidates": report.get("backfill_candidates", []),
        "same_wave_clusters": report.get("same_wave_clusters", []),
        "metrics_freshness": _build_metrics_freshness(report),
    }

    payload: Dict[str, Any] = {
        "meta": {
            "generated": {
                "date": dt.date.today().isoformat(),
                "gsc_source": str(gsc_path) if gsc_path else None,
            },
            "counts": {
                "layers": layer_counts,
                "total_nodes": len(layers),
                "total_edges": len(edges),
                "real_edges": len(real_edge_set),
                "gap_edges": len(gap_edge_set),
                "orphan_nodes": orphan_count,
                "edge_types": {k: int(edge_type_counts.get(k, 0)) for k in sorted(EDGE_TYPE_ORDER.keys())},
            },
        },
        "layers": dict(sorted(layers.items())),
        "metrics": metrics,
        "edges": edges,
        "evolution": evolution,
    }
    return payload


def _build_metrics_freshness(
    report: Dict[str, Any],
    registry_path: Path = DEFAULT_REGISTRY_PATH,
) -> Dict[str, Any]:
    """透過 in-process audit_freshness_cli 與中央帳本組裝全站 6 大主題指標新鮮度。"""
    if not registry_path.exists():
        return {
            "available": False,
            "registry_updated_at": "",
            "summary": {
                "total_topics": 0,
                "fresh_count": 0,
                "stale_count": 0,
                "static_count": 0,
                "evergreen_gap_count": 0,
            },
            "topics": [],
            "evergreen_gaps_top10": [],
        }

    registry = json.loads(registry_path.read_text(encoding="utf-8"))
    audit = audit_freshness_cli(registry, report, topic_filter=None)
    alert_by_topic = {
        a.get("topic"): a
        for a in audit.get("topic_ledger_alerts", [])
        if isinstance(a, dict) and a.get("topic")
    }
    hub_by_link = {
        h.get("link"): h
        for h in report.get("topic_hubs", [])
        if isinstance(h, dict) and h.get("link")
    }

    topic_map: Dict[str, Dict[str, Any]] = {}
    for topic_id, t_cfg in sorted(registry.get("topics", {}).items()):
        hub_page = str(t_cfg.get("hub_page", ""))
        ledger = t_cfg.get("macro_ledger", []) or []
        ledger_max = max([str(item.get("updated_at", "")) for item in ledger] or [""])
        hub_info = hub_by_link.get(hub_page, {})
        latest_news_date = extract_latest_news_date(hub_info.get("cited_news", []))
        alert = alert_by_topic.get(topic_id)
        status = "STALE" if alert else "FRESH"
        message = (
            str(alert.get("message", ""))
            if alert
            else "帳本指標已與 Hub 最新引用研報同步"
        )
        topic_map[topic_id] = {
            "topic": topic_id,
            "hub_page": hub_page,
            "mode": "dynamic",
            "status": status,
            "metric_count": len(ledger),
            "ledger_max_updated_at": ledger_max,
            "latest_cited_news_date": latest_news_date,
            "message": message,
        }

    core_cfg = registry.get("entities", {}).get("topic_core")
    if isinstance(core_cfg, dict):
        core_hub = str(core_cfg.get("target_page", "post/topic-core.html"))
        core_metrics = core_cfg.get("metrics", {}) or {}
        core_max = max(
            [
                str(m.get("updated_at", ""))
                for m in core_metrics.values()
                if isinstance(m, dict)
            ]
            or [""]
        )
        core_hub_info = hub_by_link.get(core_hub, {})
        core_latest_news = extract_latest_news_date(core_hub_info.get("cited_news", []))
        topic_map["topic-core"] = {
            "topic": "topic-core",
            "hub_page": core_hub,
            "mode": "static_anchor",
            "status": "STATIC",
            "metric_count": len(core_metrics),
            "ledger_max_updated_at": core_max,
            "latest_cited_news_date": core_latest_news,
            "message": "靜態戰略專題錨點（由 entities.topic_core 受管）",
        }

    ordered_keys = [k for k in TOPIC_FRESHNESS_ORDER if k in topic_map]
    ordered_keys.extend(sorted(k for k in topic_map if k not in TOPIC_FRESHNESS_ORDER))
    topic_items = [topic_map[k] for k in ordered_keys]

    evergreen_gaps = list(audit.get("evergreen_freshness_gaps", []))
    evergreen_gaps.sort(
        key=lambda g: (-int(g.get("uncited_newer_news_count", 0)), str(g.get("post_link", "")))
    )

    return {
        "available": True,
        "registry_updated_at": str(registry.get("updated_at", "")),
        "summary": {
            "total_topics": len(topic_items),
            "fresh_count": sum(1 for item in topic_items if item["status"] == "FRESH"),
            "stale_count": sum(1 for item in topic_items if item["status"] == "STALE"),
            "static_count": sum(1 for item in topic_items if item["status"] == "STATIC"),
            "evergreen_gap_count": len(evergreen_gaps),
        },
        "topics": topic_items,
        "evergreen_gaps_top10": evergreen_gaps[:10],
    }


def write_atlas_js(payload: Dict[str, Any], out_path: Path = DEFAULT_ATLAS_OUT) -> None:
    """輸出決定性格式的 window.__EVOLUTION_ATLAS__ JS 檔案。"""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    serialized = json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=True)
    content = (
        "// Auto-generated by apps/content-evolution-atlas/build_evolution_atlas.py\n"
        "// Do not edit manually.\n"
        f"window.__EVOLUTION_ATLAS__ = {serialized};\n"
    )
    out_path.write_text(content, encoding="utf-8", newline="\n")


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Mason Yang Blog — Content Evolution Atlas 薄轉接資料產生器"
    )
    parser.add_argument("--gsc", type=Path, default=None, help="選配 GSC Pages CSV/TSV 檔案路徑（透傳至 analyzer）")
    parser.add_argument("--gsc-base-url", default=DEFAULT_BASE_URL, help=f"網站根網址 (預設: {DEFAULT_BASE_URL})")
    parser.add_argument("--out", type=Path, default=DEFAULT_ATLAS_OUT, help="輸出 JS 檔案路徑")
    parser.add_argument("--quiet", action="store_true", help="僅寫入檔案，不輸出終端摘要")
    return parser


def main() -> int:
    parser = build_arg_parser()
    args = parser.parse_args()
    payload = build_atlas_payload(gsc_path=args.gsc, gsc_base_url=args.gsc_base_url)
    write_atlas_js(payload, out_path=args.out)

    if not args.quiet:
        c = payload["meta"]["counts"]
        print(
            f"[OK] Evolution Atlas Built -> {args.out} | "
            f"Nodes={c['total_nodes']}, RealEdges={c['real_edges']}, "
            f"GapEdges={c['gap_edges']}, Orphans={c['orphan_nodes']}"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
