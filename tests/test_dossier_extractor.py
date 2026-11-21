# -*- coding: utf-8 -*-
"""
tests/test_dossier_extractor.py
=============================================================================
單元測試：驗證 scratch/lib/dossier_extractor.py 之案卷生成、章節切片、公式與表格抽取。
=============================================================================
"""
import os
import sys
import tempfile
from pathlib import Path
import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent
LIB_DIR = REPO_ROOT / "scratch" / "lib"
if str(LIB_DIR) not in sys.path:
    sys.path.insert(0, str(LIB_DIR))

from dossier_extractor import DossierExtractor

SYNTHETIC_MD = """---
title: "測試研究"
date: "2026-10-03"
article_id: "test-research"
---

前導引言第一段，敘述整體市場背景與研究動機。

## 一、宏觀經濟模型
本章節探討宏觀利率與流動性傳導機制。

$$
E = mc^2 \\times \\sqrt{1 - \\frac{v^2}{c^2}}
$$

| 指標名稱 | 2024 實際值 | 2026 預測值 | CAGR |
| :--- | :--- | :--- | :--- |
| 算力資本支出 | $50B | $120B | 55% |
| 模型訓練成本 | $10M | $45M | 112% |

### 1.1 算力資本支出估算
深入細節分析。

## 參考資料
1. Fed Reserve Report 2026
2. https://example.com/ai-report
"""

def test_dossier_extractor_synthetic():
    with tempfile.TemporaryDirectory() as td:
        sample_path = Path(td) / "sample_draft.md"
        sample_path.write_text(SYNTHETIC_MD, encoding="utf-8")
        
        dossier, output_path, json_size = DossierExtractor.generate_dossier(
            str(sample_path),
            output_dir=td,
            write_anchors_back=False
        )
        
        required_keys = ["version", "slug", "title", "outline", "brief", "key_metrics", "formulas", "tables", "references"]
        for k in required_keys:
            assert k in dossier, f"Missing key: {k}"
            
        assert len(dossier["outline"]) > 0, "Outline should not be empty"
        assert len(dossier["brief"]["lead"]) > 0, "Lead brief should not be empty"
        assert json_size < 10000, f"Dossier size too large: {json_size}"
        
        # 測試切片
        sec_info, sec_text = DossierExtractor.extract_section(str(sample_path), 1, max_lines=50)
        assert sec_info is not None, "Failed to get section 1"
        assert len(sec_text.splitlines()) > 0

        # 測試錨點注入
        updated_md, modified_count = DossierExtractor.inject_anchors(SYNTHETIC_MD)
        assert "<!-- @sec:" in updated_md, "Anchor tag was not injected"
        assert modified_count == 3, f"Expected 3 anchors injected, got {modified_count}"
        
        # 測試公式與表格提取
        ft = DossierExtractor.extract_formulas_and_tables(SYNTHETIC_MD)
        assert len(ft["formulas"]) == 1, f"Expected 1 formula, got {len(ft['formulas'])}"
        assert len(ft["tables"]) == 1, f"Expected 1 table, got {len(ft['tables'])}"
        assert ft["tables"][0]["rows_count"] == 2, f"Expected 2 rows in table, got {ft['tables'][0]['rows_count']}"
        
        # 測試指標提取
        metrics = DossierExtractor.extract_key_metrics(SYNTHETIC_MD)
        assert len(metrics) > 0, "Expected at least 1 key metric"

if __name__ == "__main__":
    test_dossier_extractor_synthetic()
    print("[PASS] test_dossier_extractor_synthetic passed.")
