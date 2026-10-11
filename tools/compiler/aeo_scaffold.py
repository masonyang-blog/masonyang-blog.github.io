# -*- coding: utf-8 -*-
"""
AEO Scaffold Generator (tools/compiler/aeo_scaffold.py)

從 Dossier JSON 案卷宣告式萃取核心關鍵詞、摘要與大綱結構，
自動產生符合 AEOInjector 規格的 5W1H、章節問答與三部曲鷹架 JSON 模板。
大幅節省 Agent 手工寫檔之 Token 消耗 (節省約 80%~90%)。
"""

import os
import sys
import json
import re
import argparse
from typing import Dict, Any, Optional

def clean_title(title_text: str) -> str:
    """清理標題標點符號與 markdown 強調標籤"""
    if not title_text:
        return ""
    t = re.sub(r'[*_#`]', '', title_text).strip()
    return t

def extract_keywords_from_dossier(dossier: Dict[str, Any]) -> str:
    """從 Dossier 萃取建議關鍵字"""
    keywords = set()
    category = dossier.get("meta", {}).get("category", "")
    if category:
        keywords.add(category)
        
    title = dossier.get("title", "")
    # 提取標題中的名詞/英文縮寫/關鍵詞
    words = re.findall(r'[A-Za-z0-9\u4e00-\u9fa5]{2,}', title)
    stop_words = {"深度", "研究", "報告", "驗證", "全景", "解析", "分析", "最新", "現狀"}
    for w in words:
        if w not in stop_words and len(w) >= 2:
            keywords.add(w)
            if len(keywords) >= 8:
                break

    # 若關鍵字不足，從 key_metrics 補足
    for m in dossier.get("key_metrics", []):
        matches = re.findall(r'[A-Z]{2,}|[0-9]+%|[0-9.]+[億兆]|\b[A-Za-z]{3,}\b', m)
        for match in matches:
            keywords.add(match)
            if len(keywords) >= 9:
                break
        if len(keywords) >= 9:
            break

    # 確保基本順序
    kw_list = sorted(list(keywords), key=lambda x: -len(x))[:8]
    return ", ".join(kw_list) if kw_list else "宏觀經濟, 資產配置, 市場分析"

def generate_five_w_one_h(dossier: Dict[str, Any]) -> Dict[str, str]:
    """生成 5W1H 核心結構鷹架"""
    title = dossier.get("title", "深度研究研報")
    date_str = dossier.get("date") or dossier.get("meta", {}).get("date", "2026年")
    brief = dossier.get("brief", {})
    lead = brief.get("lead", "")
    conclusion = brief.get("conclusion", "")
    
    # Who
    who_match = re.findall(r'聯準會|FOMC|央行|財政部|[A-Z][a-z]+|機構|投資人|科技巨頭', lead + conclusion)
    who = "、".join(list(dict.fromkeys(who_match))[:4]) if who_match else "全球主權央行、機構投資人與核心市場參與者"
    if not who.endswith("。"):
        who += "。"

    # What
    clean_t = clean_title(title)
    what = f"圍繞「{clean_t}」展開之跨市場結構性演變與資產重置。"

    # When
    when = f"{date_str}，面臨宏觀經濟週期轉折與關鍵指標實質驗證之際。"

    # Where
    where_match = re.findall(r'全球|美國|波斯灣|美債|二級市場|一級市場|半導體|能源市場', lead + conclusion)
    where = "、".join(list(dict.fromkeys(where_match))[:4]) if where_match else "全球宏觀市場、主權債券與實體產業鏈"
    if not where.endswith("。"):
        where += "。"

    # Why
    why = "實體經濟通膨黏性、貨幣政策限制性立場與流動性結構轉換共同驅動。"
    if lead:
        sentences = [s.strip() for s in re.split(r'[。！？]', lead) if len(s.strip()) > 10]
        if sentences:
            why = sentences[0][:80] + "。"

    # How
    how = "透過風險溢價重構、期限溢價位移與表外槓桿去化傳導至跨資產定價。"
    if conclusion:
        c_sentences = [s.strip() for s in re.split(r'[。！？]', conclusion) if len(s.strip()) > 10]
        if c_sentences:
            how = c_sentences[0][:80] + "。"

    return {
        "who": who,
        "what": what,
        "when": when,
        "where": where,
        "why": why,
        "how": how
    }

def generate_lead_in_questions(outline: list) -> Dict[str, list]:
    """為各章節產生引導性雙層/三層問答鷹架"""
    lead_ins = {}
    for item in outline:
        raw_title = item.get("title", "")
        clean_t = clean_title(raw_title)
        
        # 排除非內容標題
        if not clean_t or any(ex in clean_t for ex in ["目錄", "參考資料", "結語"]):
            continue
            
        # 取簡潔章節名（若含頓號或冒號，取代表性片段）
        short_name = re.split(r'[：:、]', clean_t)[0].strip()
        if len(short_name) > 16:
            short_name = short_name[:16]
            
        # 生成 3 個層遞問題
        q1 = f"{short_name} 在當前宏觀週期下的核心驅動因果為何？"
        q2 = f"指標實況與市場既有預期發生偏離時，傳導機制如何體現？"
        q3 = f"該結構性演變對投資組合與資產定價帶來何種不可逆位移？"
        
        lead_ins[short_name] = [q1, q2, q3]
        
    return lead_ins

def generate_triad(dossier: Dict[str, Any]) -> Dict[str, Any]:
    """生成文章分析三部曲 (Triad) 鷹架"""
    title = clean_title(dossier.get("title", ""))
    brief = dossier.get("brief", {})
    lead = brief.get("lead", "")
    conclusion = brief.get("conclusion", "")
    metrics = dossier.get("key_metrics", [])
    
    # 1. Inference Logic
    chains = []
    if len(metrics) >= 3:
        for idx in range(min(3, len(metrics))):
            m_text = metrics[idx]
            # 嘗試切分
            chains.append({
                "title": f"核心推論節點 {idx + 1}",
                "premise": m_text[:90] if len(m_text) > 90 else m_text,
                "conclusion": f"促使市場預期重置並加速資產定價之結構性收斂。"
            })
    else:
        chains = [
            {
                "title": "宏觀環境驅動 至 實質收益受損",
                "premise": lead[:80] if lead else "宏觀基本面指標持續偏離長期均衡線。",
                "conclusion": "實質所得與資產回報承壓，推動防禦性避險需求上升。"
            },
            {
                "title": "無風險利率錨定 至 跨資產定價重構",
                "premise": "基準公債殖利率與期限溢價重估，抬高全域貼現率防線。",
                "conclusion": "高估值資產與流動性脆弱環節面臨估值壓縮與出清考驗。"
            },
            {
                "title": "流動性結構轉換 至 非對稱市場分化",
                "premise": conclusion[:80] if conclusion else "市場廣度收窄，資金加速向具備高確定性定價權之板塊聚集。",
                "conclusion": "驅動跨資產表現二元分化，終結全面齊漲週期。"
            }
        ]
        
    inference_logic = {
        "subtitle": f"{title[:16]}市場結構與核心論點解析" if title else "市場結構與核心論點解析",
        "summary": (lead[:120] + "...") if lead else "本篇研報構建了從實體宏觀驅動到金融資產重置的跨市場傳導鏈條。",
        "chains": chains
    }
    
    # 2. Logic Blindspots
    variables = [
        {
            "name": "政策對沖的邊際效應遞減：",
            "desc": "市場可能過度依賴傳統政策工具之救市預期，卻忽視資產負債表約束下的實質緩衝空間。"
        },
        {
            "name": "資本開支回報率的久期風險：",
            "desc": "若高利率環境維持時間超預期，重資本投入之現金流折現與融資成本攀升將考驗供應鏈承受力。"
        },
        {
            "name": "表外槓桿與流動性錯配之隱性傳導：",
            "desc": "二級市場價格可能未能完全反映非銀行金融機構贖回壓力所導致的被動去槓桿外溢風險。"
        }
    ]
    logic_blindspots = {"variables": variables}
    
    # 3. Mason Observation
    mason_observation = {
        "core_proposition": f"當前市場本質上處於結構性重置與分化期，超越了傳統短線波動的範疇。",
        "scenarios": [
            {
                "type": "情境一：防禦性重置延續",
                "desc": "高利率與滯脹壓力維持，資源與高現金流資產持續享有確定性溢價。"
            },
            {
                "type": "情境二：流動性出清加速",
                "desc": "脆弱環節觸發被動降槓桿，促使全域風險溢價回歸歷史中樞。"
            }
        ]
    }
    
    return {
        "inference_logic": inference_logic,
        "logic_blindspots": logic_blindspots,
        "mason_observation": mason_observation
    }

def generate_aeo_scaffold(dossier: Dict[str, Any], existing_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """由 Dossier 產生完整 AEO 鷹架字典，若提供 existing_data 則執行安全合併"""
    title = clean_title(dossier.get("title", ""))
    lead = dossier.get("brief", {}).get("lead", "")
    conclusion = dossier.get("brief", {}).get("conclusion", "")
    
    # meta_description
    meta_desc = ""
    if lead:
        clean_lead = re.sub(r'[*_#`\d]+', '', lead).replace("  ", " ").strip()
        meta_desc = clean_lead[:140] + ("..." if len(clean_lead) > 140 else "")
    else:
        meta_desc = f"深度解構{title}：剖析市場結構、關鍵指標與宏觀傳導機制。"

    # above_fold_summary
    above_fold = ""
    if lead and conclusion:
        s1 = lead.split("。")[0] + "。"
        s2 = conclusion.split("。")[0] + "。"
        above_fold = (s1 + s2)[:120]
    elif lead:
        above_fold = lead[:100]
    else:
        above_fold = f"本報告全面檢視{title}之核心驅動邏輯，揭示跨資產風險溢價與結構性分化格局。"

    # key_findings
    key_findings = []
    if dossier.get("key_metrics"):
        for m in dossier["key_metrics"][:3]:
            # 清理 Markdown 表格線或多餘空格
            clean_m = re.sub(r'^[|\s\-]+|[|\s\-]+$', '', m).strip()
            if "|" in clean_m:
                parts = [p.strip() for p in clean_m.split("|") if p.strip()]
                clean_m = "：".join(parts[:2])
            if len(clean_m) > 12:
                key_findings.append(clean_m[:80] + ("。" if not clean_m.endswith("。") else ""))
    if len(key_findings) < 3:
        key_findings.extend([
            "資產定價錨發生結構性位移，傳統跨資產負相關避險機制面臨考驗。",
            "市場寬度持續收窄，二元分化取代全面繁榮成為新常態。",
            "機構投資人加速轉向實質回報與具備定價權之防禦性現金流標的。"
        ])
    key_findings = key_findings[:3]

    scaffold = {
        "title": title,
        "meta_description": meta_desc,
        "keywords": extract_keywords_from_dossier(dossier),
        "above_fold_summary": above_fold,
        "key_findings": key_findings,
        "five_w_one_h": generate_five_w_one_h(dossier),
        "lead_in_questions": generate_lead_in_questions(dossier.get("outline", [])),
        "article_triad": generate_triad(dossier)
    }

    # 若有 existing_data，以 existing 為優先保留人工調整值，缺失項以 scaffold 補足
    if existing_data and isinstance(existing_data, dict):
        merged = {}
        for k, v in scaffold.items():
            if k in existing_data and existing_data[k]:
                merged[k] = existing_data[k]
            else:
                merged[k] = v
        return merged

    return scaffold

def main():
    parser = argparse.ArgumentParser(description="AEO Scaffold Generator (Dossier -> aeo_data.json)")
    parser.add_argument("--dossier", type=str, required=True, help="Path to input Dossier JSON file")
    parser.add_argument("--output", type=str, default="scratch/tmp/aeo_data.json", help="Path to output aeo_data.json (default: scratch/tmp/aeo_data.json)")
    parser.add_argument("--merge", action="store_true", help="Merge with existing output file instead of full overwrite")
    parser.add_argument("--compact", action="store_true", help="Print compact single-line result")

    args = parser.parse_args()

    if not os.path.exists(args.dossier):
        print(f"[ERROR] [AEO_SCAFFOLD] Dossier file not found: {args.dossier}", file=sys.stderr)
        sys.exit(1)

    try:
        with open(args.dossier, "r", encoding="utf-8") as f:
            dossier_data = json.load(f)
    except Exception as e:
        print(f"[ERROR] [AEO_SCAFFOLD] Failed to parse dossier JSON: {e}", file=sys.stderr)
        sys.exit(1)

    existing_data = None
    if args.merge and os.path.exists(args.output):
        try:
            with open(args.output, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except Exception:
            existing_data = None

    result = generate_aeo_scaffold(dossier_data, existing_data)

    out_dir = os.path.dirname(os.path.abspath(args.output))
    os.makedirs(out_dir, exist_ok=True)

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    if args.compact:
        print(f"[AEO_SCAFFOLD] PASS: {args.output} (questions: {len(result.get('lead_in_questions', {}))}, triad: OK)")
    else:
        print(f"[SUCCESS] [AEO_SCAFFOLD] Generated AEO scaffold JSON at: {args.output}")
        print(f"  - Lead-in questions: {len(result.get('lead_in_questions', {}))} sections")
        print(f"  - Key findings: {len(result.get('key_findings', []))} bullets")
        print(f"  - 5W1H keys: {list(result.get('five_w_one_h', {}).keys())}")

    sys.exit(0)

if __name__ == "__main__":
    main()
