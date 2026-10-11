# -*- coding: utf-8 -*-
"""
tools/compiler/batch_marker_processor.py — 批次標記引擎與雙重門禁驗證器 (Batch-Marker & Formula Engine)
=============================================================================================
職責：
1. 分桶抽取 (extract-marked)：
   - 將龐大 Markdown 依章節切塊，包裝為 <<<TARGET_BLOCK: id>>> ... <<<END_TARGET>>> 協議格式。
   - 支援語意預算分桶 (--bucket-size 3)，杜絕長文本注意力稀釋與模型疲勞截斷。
2. 雙重門禁驗證與容錯回填 (apply-marked)：
   - 字數縮水審計 (Length Degradation Guard): 比對純字數，縮水 > 15% (ratio < 0.85) 即時警報或攔截。
   - 數值與實體守恆 (Entity Guard): 抽取百分比、金額大數、年份與關鍵統計指標，遺失即刻報警。
   - 零列點硬語法過濾 (Zero-Bullet Filter): 嚴格掃描改寫區塊，攔截退化出現之 - / * / 數字列點。
   - 容錯與部分回填 (Partial Apply): 標記 ID 大小寫與符號模糊相容；損壞區塊隔離，合規區塊無痛回填。
3. 嚴守靜音契約 (Silent Contract)：--json / --quiet 模式輸出簡潔結構化 JSON。
"""

import os
import sys
import re
import json
import argparse
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional, Set

# 解決 Windows 終端輸出中文編碼
if sys.platform.startswith("win"):
    try:
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


def slugify_id(title: str, index: int) -> str:
    """生成合規且易讀的 block id"""
    clean_title = re.sub(r'[^\w\u4e00-\u9fff\-]+', '_', title.strip()).strip('_')
    if not clean_title:
        clean_title = f"section_{index:02d}"
    return f"sec_{index:02d}_{clean_title[:30]}"


def normalize_id(block_id: str) -> str:
    """正規化 block id 以利模糊比對（小寫、去除前後空白與底線/連字符號）"""
    return re.sub(r'[^a-z0-9\u4e00-\u9fff]', '', block_id.lower())


def count_substantive_chars(text: str) -> int:
    """計算實質字元數（包含漢字、英數單詞，過濾空白與純 markdown 標記）"""
    # 移除 HTML 註解、TARGET 標記
    t = re.sub(r'<<<[^>]+>>>', '', text)
    t = re.sub(r'<!--[\s\S]*?-->', '', t)
    # 移除多餘空白
    t = re.sub(r'\s+', '', t)
    return len(t)


def extract_entities(text: str) -> Set[str]:
    """
    抽取關鍵數值與實體集合：
    1. 百分比 (e.g. 45%, 12.5%)
    2. 幣值與大數 (e.g. $1.5B, $300M, NT$500, 100萬, 50億)
    3. 四位數年份 (e.g. 2024, 2025, 2026)
    4. 關鍵小數與千分位數值 (e.g. 1,250, 3.1415, 0.05)
    """
    entities = set()

    # 1. 百分比
    for m in re.finditer(r'\b\d+(?:\.\d+)?%', text):
        entities.add(m.group(0))

    # 2. 貨幣與大數
    for m in re.finditer(r'(?:\$|NT\$|US\$|¥|€)\s*\d+(?:\.\d+)?(?:\s*[BMTk萬億兆])?', text, re.IGNORECASE):
        clean_curr = re.sub(r'\s+', '', m.group(0))
        entities.add(clean_curr)

    # 3. 中文計量大數 (e.g. 500萬, 12.8億)
    for m in re.finditer(r'\b\d+(?:\.\d+)?\s*(?:萬|億|兆)', text):
        clean_num = re.sub(r'\s+', '', m.group(0))
        entities.add(clean_num)

    # 4. 年份 (1900-2099)
    for m in re.finditer(r'\b(?:19|20)\d{2}\b', text):
        entities.add(m.group(0))

    # 5. 千分位大數或顯著小數 (長度 >= 3)
    for m in re.finditer(r'\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b|\b\d+\.\d{2,}\b', text):
        clean_val = m.group(0).replace(',', '')
        entities.add(m.group(0))
        entities.add(clean_val)

    return entities


def check_zero_bullets(text: str) -> List[str]:
    """
    檢查文本中是否殘留列點語法。
    排除掉可能處於 $$ ... $$ 塊級公式內部的符號。
    回傳所有發現的列點行內容。
    """
    # 先將公式塊暫時替換
    clean_text = re.sub(r'\$\$[\s\S]*?\$\$', '', text)
    lines = clean_text.splitlines()
    bullet_violations = []

    bullet_pattern = re.compile(r'^\s*(?:[-*+]|\d+\.)\s+\S+')

    for idx, line in enumerate(lines, 1):
        stripped = line.strip()
        if not stripped:
            continue
        # 排除分隔線 (---, ***, ___)
        if re.match(r'^(?:-{3,}|\*{3,}|_{3,})$', stripped):
            continue
        if bullet_pattern.match(line):
            bullet_violations.append(f"Line {idx}: {stripped[:60]}")

    return bullet_violations


# =============================================================================
# 子命令 1: extract-marked
# =============================================================================

def parse_markdown_sections(content: str, header_level: int = 2) -> List[Dict[str, Any]]:
    """
    依據指定的標題層級（預設 2 即 ##）將 Markdown 切塊。
    """
    # 搜尋所有標題行
    header_pattern = re.compile(r'^(#{1,6})\s+(.+)$', re.MULTILINE)
    matches = list(header_pattern.finditer(content))

    # 若指定層級找不到，自動尋找最高層級 (例如全篇最高只有 ###)
    actual_level = header_level
    if not any(len(m.group(1)) == header_level for m in matches):
        available_levels = [len(m.group(1)) for m in matches if len(m.group(1)) > 1]
        if available_levels:
            actual_level = min(available_levels)

    sections = []
    
    # 處理第一個標題之前的導言 (preface)
    if matches:
        first_match = matches[0]
        if first_match.start() > 0:
            preface_content = content[:first_match.start()].strip()
            if preface_content:
                sections.append({
                    "id": "sec_00_preface",
                    "title": "前導引言與元數據",
                    "level": 1,
                    "content": preface_content,
                    "is_preface": True
                })

    # 切割各標題區間
    level_matches = [m for m in matches if len(m.group(1)) == actual_level]
    
    for i, m in enumerate(level_matches):
        start_pos = m.start()
        end_pos = level_matches[i + 1].start() if i + 1 < len(level_matches) else len(content)
        sec_content = content[start_pos:end_pos].strip()
        sec_title = m.group(2).strip()
        sec_id = slugify_id(sec_title, i + 1)

        sections.append({
            "id": sec_id,
            "title": sec_title,
            "level": actual_level,
            "content": sec_content,
            "is_preface": False
        })

    return sections


def run_extract(
    input_file: str,
    output_dir: Optional[str] = None,
    output_file: Optional[str] = None,
    bucket_size: int = 3,
    header_level: int = 2,
    as_json: bool = False
) -> Dict[str, Any]:
    in_path = Path(input_file).resolve()
    if not in_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_file}")

    content = in_path.read_text(encoding="utf-8", errors="replace")
    sections = parse_markdown_sections(content, header_level=header_level)

    # 封裝為 TARGET_BLOCK
    for sec in sections:
        sec["marked_block"] = (
            f"<<<TARGET_BLOCK: {sec['id']}>>>\n"
            f"{sec['content']}\n"
            f"<<<END_TARGET>>>"
        )
        sec["char_count"] = count_substantive_chars(sec["content"])
        sec["tokens_approx"] = int(sec["char_count"] / 2.0)

    # 依 bucket-size 分桶
    buckets = []
    # 若有 preface，通常 preface 單獨一桶或與第一桶合併
    main_sections = [s for s in sections if not s.get("is_preface", False)]
    preface_section = next((s for s in sections if s.get("is_preface", False)), None)

    for b_idx in range(0, len(main_sections), bucket_size):
        b_chunk = main_sections[b_idx: b_idx + bucket_size]
        # 若是第一桶且有 preface，納入第一桶
        if b_idx == 0 and preface_section:
            b_chunk = [preface_section] + b_chunk

        b_num = (b_idx // bucket_size) + 1
        b_content = "\n\n".join(s["marked_block"] for s in b_chunk)
        b_total_chars = sum(s["char_count"] for s in b_chunk)
        b_total_tokens = sum(s["tokens_approx"] for s in b_chunk)

        prompt_header = (
            f"<!-- BUCKET {b_num:02d} | Sections: {len(b_chunk)} | Approx Tokens: ~{b_total_tokens} -->\n"
            f"<!-- 寫作協議：請將每個 TARGET_BLOCK 轉譯為無列點的流暢連貫散文 (Unpack-and-Weave)，保持關鍵數據守恆。 -->\n"
            f"<!-- 輸出格式規範：\n"
            f"<<<REVISED_BLOCK: section_id>>>\n"
            f"[改寫之散文內容]\n"
            f"<<<END_REVISED>>>\n"
            f"-->\n\n"
        )

        buckets.append({
            "bucket_index": b_num,
            "sections_count": len(b_chunk),
            "section_ids": [s["id"] for s in b_chunk],
            "total_chars": b_total_chars,
            "tokens_approx": b_total_tokens,
            "full_text": prompt_header + b_content
        })

    # 輸出至目錄
    output_files = []
    if output_dir:
        out_d = Path(output_dir).resolve()
        out_d.mkdir(parents=True, exist_ok=True)
        for b in buckets:
            b_path = out_d / f"bucket_{b['bucket_index']:02d}.md"
            b_path.write_text(b["full_text"], encoding="utf-8")
            output_files.append(str(b_path))
        
        manifest_path = out_d / "manifest.json"
        manifest_data = {
            "source_file": str(in_path),
            "total_sections": len(sections),
            "total_buckets": len(buckets),
            "bucket_size": bucket_size,
            "buckets": [
                {
                    "index": b["bucket_index"],
                    "file": f"bucket_{b['bucket_index']:02d}.md",
                    "section_ids": b["section_ids"],
                    "tokens_approx": b["tokens_approx"]
                }
                for b in buckets
            ]
        }
        manifest_path.write_text(json.dumps(manifest_data, ensure_ascii=False, indent=2), encoding="utf-8")

    # 輸出至單檔
    if output_file:
        out_f = Path(output_file).resolve()
        out_f.parent.mkdir(parents=True, exist_ok=True)
        full_marked = "\n\n".join(s["marked_block"] for s in sections)
        out_f.write_text(full_marked, encoding="utf-8")
        output_files.append(str(out_f))

    result = {
        "status": "ok",
        "input": str(in_path),
        "total_sections": len(sections),
        "total_buckets": len(buckets),
        "bucket_size": bucket_size,
        "output_files": output_files,
        "buckets_summary": [
            {
                "bucket": b["bucket_index"],
                "sections": len(b["section_ids"]),
                "tokens_approx": b["tokens_approx"]
            }
            for b in buckets
        ]
    }
    return result


# =============================================================================
# 子命令 2: apply-marked
# =============================================================================

def parse_revised_blocks(text: str) -> Dict[str, str]:
    """
    從文本中提取所有 <<<REVISED_BLOCK: id>>> ... <<<END_REVISED>>>
    具備大小寫與空格容錯能力。
    """
    pattern = re.compile(
        r'<<<REVISED_BLOCK:\s*([^\s>]+)\s*>>>([\s\S]*?)<<<END_REVISED(?::\s*[^\s>]+)?\s*>>>',
        re.IGNORECASE
    )
    blocks = {}
    for match in pattern.finditer(text):
        b_id = match.group(1).strip()
        b_content = match.group(2).strip()
        blocks[b_id] = b_content
    return blocks


def parse_target_blocks_from_draft(content: str) -> Dict[str, Tuple[int, int, str]]:
    """
    從 draft 內容中抽取 <<<TARGET_BLOCK: id>>> 的位置與內容。
    回傳: { normalized_id: (start_index, end_index, raw_content, original_id) }
    """
    pattern = re.compile(
        r'<<<TARGET_BLOCK:\s*([^\s>]+)\s*>>>([\s\S]*?)<<<END_TARGET(?::\s*[^\s>]+)?\s*>>>',
        re.IGNORECASE
    )
    targets = {}
    for match in pattern.finditer(content):
        orig_id = match.group(1).strip()
        norm_id = normalize_id(orig_id)
        targets[norm_id] = {
            "start": match.start(),
            "end": match.end(),
            "raw_content": match.group(2).strip(),
            "original_id": orig_id
        }
    return targets


def run_apply(
    original_file: str,
    revised_sources: List[str],
    output_file: Optional[str] = None,
    min_ratio: float = 0.85,
    entity_guard: bool = True,
    zero_bullet: bool = True,
    allow_partial: bool = True,
    force: bool = False,
    as_json: bool = False
) -> Dict[str, Any]:
    orig_path = Path(original_file).resolve()
    if not orig_path.exists():
        raise FileNotFoundError(f"Original file not found: {original_file}")

    original_content = orig_path.read_text(encoding="utf-8", errors="replace")

    # 1. 蒐集所有 revised blocks
    all_revised: Dict[str, str] = {}
    for src in revised_sources:
        p = Path(src).resolve()
        if p.is_file():
            txt = p.read_text(encoding="utf-8", errors="replace")
            all_revised.update(parse_revised_blocks(txt))
        elif p.is_dir():
            for f in p.glob("*.md"):
                txt = f.read_text(encoding="utf-8", errors="replace")
                all_revised.update(parse_revised_blocks(txt))

    if not all_revised:
        raise ValueError("No <<<REVISED_BLOCK: ...>>> found in provided revised sources.")

    # 2. 探測原始文本是含有 TARGET_BLOCK 標記，還是乾淨的 Markdown
    target_blocks_map = parse_target_blocks_from_draft(original_content)
    has_target_tags = len(target_blocks_map) > 0

    # 若無標記 tags，將原始 Markdown 即時切塊以便按章節比對
    raw_sections_map = {}
    if not has_target_tags:
        sections = parse_markdown_sections(original_content)
        for s in sections:
            norm_id = normalize_id(s["id"])
            raw_sections_map[norm_id] = s

    # 3. 執行雙重門禁驗證
    audit_results = []
    replacement_plan = []  # [(start, end, new_text, sec_id)]

    for rev_id, rev_text in all_revised.items():
        norm_rev_id = normalize_id(rev_id)
        
        orig_sec_text = ""
        target_info = None

        if has_target_tags and norm_rev_id in target_blocks_map:
            target_info = target_blocks_map[norm_rev_id]
            orig_sec_text = target_info["raw_content"]
        elif not has_target_tags and norm_rev_id in raw_sections_map:
            target_info = raw_sections_map[norm_rev_id]
            orig_sec_text = target_info["content"]
        else:
            # 支援部分模糊匹配 (例如 rev_id 為 "sec_01", target 為 "sec_01_title")
            matched_key = None
            search_pool = target_blocks_map if has_target_tags else raw_sections_map
            for k in search_pool.keys():
                if norm_rev_id in k or k in norm_rev_id:
                    matched_key = k
                    break
            if matched_key:
                target_info = search_pool[matched_key]
                orig_sec_text = target_info["raw_content"] if has_target_tags else target_info["content"]

        if not target_info:
            audit_results.append({
                "block_id": rev_id,
                "status": "error",
                "reason": f"Target section not found in original document for ID: {rev_id}"
            })
            continue

        # 計算指標
        orig_chars = count_substantive_chars(orig_sec_text)
        rev_chars = count_substantive_chars(rev_text)
        ratio = round(rev_chars / float(orig_chars), 3) if orig_chars > 0 else 1.0

        # --- Guard 1: Length Degradation Guard ---
        length_passed = True
        length_issue = None
        if ratio < min_ratio:
            length_passed = False
            length_issue = f"Length ratio {ratio:.3f} < min_ratio {min_ratio:.2f} (shrunk by {(1 - ratio) * 100:.1f}%)"

        # --- Guard 2: Entity Guard ---
        entity_passed = True
        missing_entities = []
        if entity_guard:
            orig_entities = extract_entities(orig_sec_text)
            # 比對 revised 是否包含實體
            for ent in orig_entities:
                # 簡單清理實體以利寬鬆比對 (如 $1.5B vs $1.5 B)
                ent_clean = re.sub(r'\s+', '', ent)
                rev_clean = re.sub(r'\s+', '', rev_text)
                if ent not in rev_text and ent_clean not in rev_clean:
                    missing_entities.append(ent)
            if missing_entities:
                entity_passed = False

        # --- Guard 3: Zero-Bullet Filter ---
        bullet_passed = True
        bullet_violations = []
        if zero_bullet:
            bullet_violations = check_zero_bullets(rev_text)
            if bullet_violations:
                bullet_passed = False

        # 判定是否放行
        all_passed = length_passed and entity_passed and bullet_passed
        decision_status = "passed" if all_passed else ("forced" if force else "rejected")

        audit_entry = {
            "block_id": rev_id,
            "status": decision_status,
            "orig_chars": orig_chars,
            "rev_chars": rev_chars,
            "length_ratio": ratio,
            "length_guard": {"passed": length_passed, "issue": length_issue},
            "entity_guard": {"passed": entity_passed, "missing": missing_entities},
            "zero_bullet_guard": {"passed": bullet_passed, "violations_count": len(bullet_violations)}
        }
        audit_results.append(audit_entry)

        if decision_status in ("passed", "forced"):
            if has_target_tags:
                replacement_plan.append((
                    target_info["start"],
                    target_info["end"],
                    rev_text,
                    rev_id
                ))
            else:
                # 在標準 Markdown 中，搜尋原始內容並替換
                raw_to_replace = target_info["content"]
                replacement_plan.append((raw_to_replace, rev_text, rev_id))

    # 4. 執行安全回填
    rejected_count = sum(1 for a in audit_results if a["status"] == "rejected")
    if rejected_count > 0 and not allow_partial and not force:
        raise ValueError(f"Gate validation failed for {rejected_count} blocks. Aborted (use --allow-partial or --force).")

    new_content = original_content

    if has_target_tags:
        # 從後往前替換避免 offset 偏移
        replacement_plan.sort(key=lambda x: x[0], reverse=True)
        for start_idx, end_idx, new_text, _ in replacement_plan:
            new_content = new_content[:start_idx] + new_text + new_content[end_idx:]
    else:
        for orig_str, new_text, _ in replacement_plan:
            new_content = new_content.replace(orig_str, new_text, 1)

    # 寫入目標
    out_target = Path(output_file).resolve() if output_file else orig_path
    out_target.parent.mkdir(parents=True, exist_ok=True)
    out_target.write_text(new_content, encoding="utf-8")

    applied_count = sum(1 for a in audit_results if a["status"] in ("passed", "forced"))

    summary = {
        "status": "ok" if rejected_count == 0 else "partial_applied",
        "output_file": str(out_target),
        "total_revised_blocks": len(all_revised),
        "applied_blocks": applied_count,
        "rejected_blocks": rejected_count,
        "blocks": audit_results
    }
    return summary


# =============================================================================
# CLI 進入點
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Batch-Marker & Formula Engine: Resilient delimited protocol with double guardrails."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # 1. extract-marked
    p_extract = subparsers.add_parser("extract-marked", help="Extract draft sections into delimited TARGET_BLOCKs with token buckets.")
    p_extract.add_argument("--input", "-i", required=True, help="Path to input Markdown draft")
    p_extract.add_argument("--output-dir", "-o", default=None, help="Directory to output bucketed Markdown files")
    p_extract.add_argument("--output-file", "-f", default=None, help="Path to output single marked Markdown file")
    p_extract.add_argument("--bucket-size", "-b", type=int, default=3, help="Sections per bucket (default: 3)")
    p_extract.add_argument("--level", "-l", type=int, default=2, help="Header level to split (default: 2 for ##)")
    p_extract.add_argument("--json", action="store_true", help="Output compact JSON summary (Silent Contract)")
    p_extract.add_argument("--quiet", "-q", action="store_true", help="Minimal silent execution")

    # 2. apply-marked
    p_apply = subparsers.add_parser("apply-marked", help="Validate and apply REVISED_BLOCKs back to draft with Length, Entity, and Bullet guardrails.")
    p_apply.add_argument("--original", "-i", required=True, help="Original draft file path")
    p_apply.add_argument("--revised", "-r", required=True, nargs="+", help="Revised file(s) or directory containing REVISED_BLOCKs")
    p_apply.add_argument("--output", "-o", default=None, help="Path to write applied Markdown (defaults to overwriting --original)")
    p_apply.add_argument("--min-ratio", type=float, default=0.85, help="Length degradation guard minimum ratio (default: 0.85)")
    p_apply.add_argument("--no-entity-guard", action="store_true", help="Disable Entity Guard check")
    p_apply.add_argument("--no-zero-bullet", action="store_true", help="Disable Zero-Bullet filter check")
    p_apply.add_argument("--no-partial", action="store_true", help="Disallow partial apply (abort on any failure)")
    p_apply.add_argument("--force", action="store_true", help="Force apply even if guardrails fail")
    p_apply.add_argument("--json", action="store_true", help="Output compact JSON summary (Silent Contract)")
    p_apply.add_argument("--quiet", "-q", action="store_true", help="Minimal silent execution")

    args = parser.parse_args()

    try:
        if args.command == "extract-marked":
            res = run_extract(
                input_file=args.input,
                output_dir=args.output_dir,
                output_file=args.output_file,
                bucket_size=args.bucket_size,
                header_level=args.level,
                as_json=args.json or args.quiet
            )
        elif args.command == "apply-marked":
            res = run_apply(
                original_file=args.original,
                revised_sources=args.revised,
                output_file=args.output,
                min_ratio=args.min_ratio,
                entity_guard=not args.no_entity_guard,
                zero_bullet=not args.no_zero_bullet,
                allow_partial=not args.no_partial,
                force=args.force,
                as_json=args.json or args.quiet
            )
        else:
            parser.print_help()
            sys.exit(1)

        if args.json or args.quiet:
            print(json.dumps(res, ensure_ascii=False, separators=(',', ':')))
        else:
            print("==================================================")
            print(f"Batch-Marker Operation [{args.command}] Completed Successfully")
            for k, v in res.items():
                if k not in ("blocks", "buckets_summary"):
                    print(f"- {k}: {v}")
            if "blocks" in res:
                print("\n[Guardrails Verification Details]")
                for b in res["blocks"]:
                    status_flag = "[PASS]" if b["status"] in ("passed", "forced") else "[REJECT]"
                    print(f"  {status_flag} Block: {b['block_id']} | Status: {b['status']} | Ratio: {b.get('length_ratio', 'N/A')}")
                    if b.get("entity_guard", {}).get("missing"):
                        print(f"         Missing entities: {b['entity_guard']['missing']}")
                    if b.get("zero_bullet_guard", {}).get("violations_count", 0) > 0:
                        print(f"         Bullet violations: {b['zero_bullet_guard']['violations_count']}")
            print("==================================================")
        sys.exit(0)

    except Exception as e:
        err_obj = {"status": "error", "message": str(e)}
        if getattr(args, 'json', False) or getattr(args, 'quiet', False):
            print(json.dumps(err_obj, ensure_ascii=False, separators=(',', ':')), file=sys.stderr)
        else:
            print(f"[Error] Operation failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
