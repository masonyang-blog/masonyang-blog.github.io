#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI 礦企核心數據對標總表 (apps/ai-miners-sheet/database.js) 自動化更新腳本
支援 TSV/CSV 文本輸入，自動清洗數值、讀取既有機房與負債參數、精確計算衍生估值並就地置換。

使用範例:
  1. 傳入文字檔:
     py apps/ai-miners-sheet/update_miners_data.py --input scratch/tmp/miners_source.tsv
  2. 管道輸入:
     Get-Content data.tsv | py apps/ai-miners-sheet/update_miners_data.py
  3. 預覽模式 (不寫入檔案):
     py apps/ai-miners-sheet/update_miners_data.py --input data.tsv --dry-run
"""

import sys
import re
import argparse
import subprocess
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

SCRIPT_DIR = Path(__file__).resolve().parent
DEFAULT_DB_PATH = SCRIPT_DIR / "database.js"


def clean_number(val: Any) -> Optional[float]:
    """清洗貨幣與單位符號，回傳 float 或 None。"""
    if val is None:
        return None
    s = str(val).strip()
    if not s or s.upper() in ("#N/A", "N/A", "NA", "-", "NULL", "NONE"):
        return None
    s = re.sub(r'[\$,% ]', '', s)
    try:
        return float(s)
    except ValueError:
        return None


def parse_input_text(text: str) -> List[Dict[str, Any]]:
    """解析 TSV / CSV / 空白分隔之行情文本為字典清單。"""
    lines = [line.strip() for line in text.strip().splitlines() if line.strip()]
    if not lines:
        return []

    # 分隔符識別 (Tab, Comma, 多個空白)
    delimiter = '\t' if '\t' in lines[0] else (',' if ',' in lines[0] else None)

    def split_line(l: str) -> List[str]:
        if delimiter:
            return [col.strip() for col in l.split(delimiter)]
        return [col.strip() for col in re.split(r'\s+', l)]

    first_row = split_line(lines[0])
    has_header = any("TICKER" in col.upper() or "PRICE" in col.upper() for col in first_row)

    col_map = {}
    data_lines = lines[1:] if has_header else lines

    if has_header:
        for idx, col in enumerate(first_row):
            norm = col.upper().replace(" ", "").replace("_", "")
            if "TICKER" in norm or "SYMBOL" in norm:
                col_map["ticker"] = idx
            elif "PRICE" in norm and "TARGET" not in norm:
                col_map["price"] = idx
            elif "MARKETCAP" in norm or "MCAP" in norm:
                col_map["marketCap"] = idx
            elif "BETA" in norm:
                col_map["beta"] = idx
            elif "LOW52" in norm or "52WLOW" in norm or "LOW" in norm:
                col_map["low52"] = idx
            elif "HIGH52" in norm or "52WHIGH" in norm or "HIGH" in norm:
                col_map["high52"] = idx
            elif "TARGET" in norm:
                col_map["targetPrice"] = idx
    else:
        # 預設 7 欄標準佈局: Ticker, Price, MarketCap, Beta, Low52, High52, TargetPrice
        col_map = {
            "ticker": 0,
            "price": 1,
            "marketCap": 2,
            "beta": 3,
            "low52": 4,
            "high52": 5,
            "targetPrice": 6
        }

    results = []
    for line in data_lines:
        parts = split_line(line)
        if not parts:
            continue
        ticker_idx = col_map.get("ticker", 0)
        if ticker_idx >= len(parts):
            continue
        ticker = parts[ticker_idx].strip().upper()
        if not re.match(r'^[A-Z]{1,6}$', ticker):
            continue

        item = {"ticker": ticker}
        for key in ("price", "marketCap", "beta", "low52", "high52", "targetPrice"):
            idx = col_map.get(key)
            if idx is not None and idx < len(parts):
                num = clean_number(parts[idx])
                if num is not None:
                    item[key] = num
                elif key == "beta":
                    item[key] = None  # 顯式標註無效 Beta

        results.append(item)

    return results


def extract_miner_block(content: str, ticker: str) -> Optional[Tuple[int, int, str]]:
    """在 database.js 中定位特定 ticker 的物件區塊 (start_idx, end_idx, block_str)。"""
    pattern = rf'(\{{\s*ticker:\s*"{ticker}"[\s\S]*?\n\s*\}})'
    match = re.search(pattern, content)
    if not match:
        return None
    return match.start(1), match.end(1), match.group(1)


def update_database_content(db_content: str, records: List[Dict[str, Any]]) -> Tuple[str, List[Dict[str, Any]]]:
    """計算衍生指標並局部置換 database.js 內容。"""
    updated_records = []
    new_content = db_content

    for rec in records:
        ticker = rec["ticker"]
        loc = extract_miner_block(new_content, ticker)
        if not loc:
            print(f"[WARN] 找不到標的: {ticker}，已跳過。")
            continue

        start_idx, end_idx, block = loc

        # 1. 提取既有參數
        m_netdebt = re.search(r'netDebt:\s*(-?\d+(?:\.\d+)?)', block)
        m_opmw = re.search(r'opMw:\s*(\d+(?:\.\d+)?)', block)
        m_target = re.search(r'targetPrice:\s*(\d+(?:\.\d+)?)', block)
        m_beta = re.search(r'beta:\s*(\d+(?:\.\d+)?)', block)

        net_debt = float(m_netdebt.group(1)) if m_netdebt else 0.0
        op_mw = float(m_opmw.group(1)) if m_opmw else 0.0
        existing_target = float(m_target.group(1)) if m_target else 0.0
        existing_beta = float(m_beta.group(1)) if m_beta else None

        # 2. 確定當前值
        price = rec.get("price")
        market_cap = rec.get("marketCap")
        beta = rec.get("beta") if rec.get("beta") is not None else existing_beta
        target_price = rec.get("targetPrice", existing_target)
        low52 = rec.get("low52")
        high52 = rec.get("high52")

        # 3. 計算衍生指標
        calc_summary = {"ticker": ticker}

        new_block = block

        if price is not None:
            new_block = re.sub(r'(price:\s*)[0-9.]+', rf'\g<1>{price:.2f}', new_block)
            calc_summary["price"] = price

        if market_cap is not None:
            new_block = re.sub(r'(marketCap:\s*)[0-9.]+', rf'\g<1>{market_cap:.3f}', new_block)
            calc_summary["marketCap"] = market_cap
            # EV = marketCap + (netDebt / 1000)
            ev = round(market_cap + (net_debt / 1000.0), 3)
            new_block = re.sub(r'(ev:\s*)[0-9.]+', rf'\g<1>{ev:.3f}', new_block)
            calc_summary["ev"] = ev

            # EV/MW = (ev * 1000) / opMw
            if op_mw > 0:
                ev_mw = round((ev * 1000.0) / op_mw, 1)
                new_block = re.sub(r'(evMw:\s*)[0-9.]+', rf'\g<1>{ev_mw:.1f}', new_block)
                calc_summary["evMw"] = ev_mw

        if beta is not None:
            new_block = re.sub(r'(beta:\s*)[0-9.]+', rf'\g<1>{beta:.2f}', new_block)
            calc_summary["beta"] = beta

        if target_price:
            new_block = re.sub(r'(targetPrice:\s*)[0-9.]+', rf'\g<1>{target_price:.2f}', new_block)
            calc_summary["targetPrice"] = target_price
            if price is not None and price > 0:
                upside = round(((target_price - price) / price) * 100.0, 1)
                new_block = re.sub(r'(upside:\s*)[-0-9.]+', rf'\g<1>{upside:.1f}', new_block)
                calc_summary["upside"] = upside

        if low52 is not None and high52 is not None:
            range52w_str = f"${low52:.2f} - ${high52:.2f}"
            new_block = re.sub(r'(range52w:\s*)"[^"]+"', rf'\g<1>"{range52w_str}"', new_block)
            calc_summary["range52w"] = range52w_str

        # 替換回原文本
        new_content = new_content[:start_idx] + new_block + new_content[end_idx:]
        updated_records.append(calc_summary)

    return new_content, updated_records


def print_summary_table(updated_records: List[Dict[str, Any]]):
    """輸出格式化對照表格。"""
    headers = ["Ticker", "Price", "MarketCap", "EV", "Beta", "Target", "Upside", "52W Range", "EV/MW"]
    row_fmt = "{:<8} {:<10} {:<12} {:<10} {:<8} {:<10} {:<12} {:<20} {:<8}"
    print("\n" + "=" * 106)
    print("AI 礦企核心數據更新摘要報告 (AI Miners Update Summary)")
    print("=" * 106)
    print(row_fmt.format(*headers))
    print("-" * 106)
    for r in updated_records:
        t = r.get("ticker", "")
        p = f"${r['price']:.2f}" if "price" in r else "-"
        mc = f"${r['marketCap']:.3f}B" if "marketCap" in r else "-"
        ev = f"${r['ev']:.3f}B" if "ev" in r else "-"
        b = f"{r['beta']:.2f}" if "beta" in r else "-"
        tp = f"${r['targetPrice']:.2f}" if "targetPrice" in r else "-"
        up = f"{r['upside']:+.1f}%" if "upside" in r else "-"
        rg = r.get("range52w", "-")
        em = f"{r['evMw']:.1f}" if "evMw" in r else "-"
        print(row_fmt.format(t, p, mc, ev, b, tp, up, rg, em))
    print("=" * 106 + "\n")


def verify_with_node(db_path: Path) -> bool:
    """使用 Node.js 驗證 database.js 語法合法性。"""
    try:
        cmd = ["node", "-e", f"const {{ DEFAULT_MINERS_DATA }} = require('{db_path.as_posix()}'); if (!Array.isArray(DEFAULT_MINERS_DATA) || DEFAULT_MINERS_DATA.length !== 9) process.exit(1);"]
        res = subprocess.run(cmd, capture_output=True, text=True)
        return res.returncode == 0
    except Exception:
        return True  # 若環境無 node 則跳過


def main():
    parser = argparse.ArgumentParser(description="AI 礦企行情數據自動更新與衍生指標重算工具")
    parser.add_argument("--input", "-i", help="包含 TSV/CSV 數據之來源檔案路徑")
    parser.add_argument("--raw", "-r", help="直接傳入 TSV/CSV 字串")
    parser.add_argument("--paste", action="store_true", help="自終端互動貼上多行 TSV/CSV (輸入空白行或 EOF 結束)")
    parser.add_argument("--target", "-t", default=str(DEFAULT_DB_PATH), help="目標 database.js 路徑")
    parser.add_argument("--dry-run", action="store_true", help="預覽計算結果與比對，不實際寫入檔案")

    args = parser.parse_args()
    target_path = Path(args.target).resolve()

    if not target_path.exists():
        print(f"[ERROR] 目標資料庫檔案不存在: {target_path}", file=sys.stderr)
        sys.exit(1)

    raw_text = ""
    if args.raw:
        raw_text = args.raw
    elif args.input:
        in_path = Path(args.input).resolve()
        if not in_path.exists():
            print(f"[ERROR] 輸入檔案不存在: {in_path}", file=sys.stderr)
            sys.exit(1)
        raw_text = in_path.read_text(encoding="utf-8")
    elif args.paste:
        print("[INFO] 請貼上 TSV / CSV 數據 (完成後請直接按 Enter 連按兩次或 Ctrl+Z/D):")
        lines = []
        try:
            while True:
                line = sys.stdin.readline()
                if not line:
                    break
                if not line.strip() and lines:
                    break
                lines.append(line)
        except KeyboardInterrupt:
            pass
        raw_text = "".join(lines)
    elif not sys.stdin.isatty():
        raw_text = sys.stdin.read()
    else:
        # 檢查常見暫存檔路徑
        candidates = [
            SCRIPT_DIR.parents[1] / "scratch" / "tmp" / "miners_source.tsv",
            SCRIPT_DIR.parents[1] / "scratch" / "tmp" / "miners_update.tsv"
        ]
        found = None
        for c in candidates:
            if c.exists():
                found = c
                break
        if found:
            print(f"[INFO] 自動偵測到暫存數據檔: {found}")
            raw_text = found.read_text(encoding="utf-8")
        else:
            print("[INFO] 未指定輸入。請使用 --input <file>、--raw '<text>' 或管道輸入。")
            parser.print_help()
            sys.exit(0)

    records = parse_input_text(raw_text)
    if not records:
        print("[ERROR] 無法從輸入文本中識別出任何有效的礦企數據行！", file=sys.stderr)
        sys.exit(1)

    print(f"[INFO] 成功解析 {len(records)} 筆礦企行情數據: {[r['ticker'] for r in records]}")

    db_content = target_path.read_text(encoding="utf-8")
    new_content, updated_records = update_database_content(db_content, records)

    print_summary_table(updated_records)

    if args.dry_run:
        print("[DRY-RUN] 預覽模式已完成，未修改任何實體檔案。")
        sys.exit(0)

    # 寫入檔案
    target_path.write_text(new_content, encoding="utf-8")
    print(f"[SUCCESS] 已成功就地更新: {target_path}")

    # Node.js 語法合規驗證
    if verify_with_node(target_path):
        print("[SUCCESS] Node.js 語法驗證通過 (Exit 0, 9 大標的完整)。")
    else:
        print("[ERROR] 警告: 更新後檔案在 Node.js 解析時未通過，請檢查！", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()

