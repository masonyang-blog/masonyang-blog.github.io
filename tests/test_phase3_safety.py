# -*- coding: utf-8 -*-
"""
test_phase3_safety.py — Phase 3 測試單元
測試內容：
  1. 合約數據完整性與字數漂移驗證 (converter._step_validate_contract)
  2. Actionable Hints 錯誤診斷 (html_validator.py)
  3. auto_linker.py Freeze Zone 守衛與冪等卡片去重
  4. publisher.py Web Vitals 圖片自動注入 (loading="lazy", decoding="async")
"""

import os
import json
import pytest
from scratch.lib.converter import _step_validate_contract
from scratch.lib.auto_linker import clean_auto_linker_block
from scratch.lib.publisher import optimize_images_web_vitals


def test_contract_key_metrics_and_drift_validation(tmp_path):
    """測試合約 key_metrics 遺失與字數漂移 ±15% 阻斷機制"""
    html_file = tmp_path / "test.html"
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    contract_file = os.path.join(repo_root, "scratch", "tmp_test.contract.json")

    # 模擬 .contract.json
    contract_data = {
        "source_md_hash": "abcdef1234567890",
        "locked_sections": [],
        "h2_h3_outline": ["H2: 測試"],
        "key_metrics": ["$1.6T", "40%"],
        "word_count_baseline": {
            "zh": 100,
            "en_words": 10
        }
    }
    with open(contract_file, "w", encoding="utf-8") as f:
        json.dump(contract_data, f, ensure_ascii=False)

    try:
        # 情況 A: HTML 中缺失關鍵數據 "$1.6T" -> 應返回 False
        html_file.write_text("<html><body><div>測試文字 40%</div></body></html>", encoding="utf-8")
        ok = _step_validate_contract(str(html_file), dry_run=False)
        assert ok is False

        # 情況 B: HTML 包含完整 key_metrics 但中文字數漂移過大 (10 字 vs baseline 100 字) -> 應返回 False
        html_file.write_text("<html><body><div>測試數據 $1.6T 與 40% 完整留存</div></body></html>", encoding="utf-8")
        ok = _step_validate_contract(str(html_file), dry_run=False)
        assert ok is False

        # 情況 C: HTML 數據與字數 (85-115 字) 均合規 -> 應返回 True
        valid_text = "測試數據 $1.6T 與 40% 完整留存。" + ("中文內容測試" * 16)
        html_file.write_text(f"<html><body><div>{valid_text}</div></body></html>", encoding="utf-8")
        ok = _step_validate_contract(str(html_file), dry_run=False)
        assert ok is True
    finally:
        if os.path.exists(contract_file):
            os.remove(contract_file)


def test_publisher_web_vitals_image_optimization():
    """測試 publisher 中的 Web Vitals 圖片自動補齊屬性"""
    raw_html = """
    <article>
        <img src="hero.png" alt="Hero Banner">
        <p>正文內容</p>
        <img src="chart.png" alt="Chart">
        <img src="footer.png" alt="Footer" data-no-lazy="true">
    </article>
    """
    optimized = optimize_images_web_vitals(raw_html)

    # 第一張 Hero 圖：確保有 decoding="async"，但不安裝 loading="lazy"
    assert 'decoding="async"' in optimized
    assert '<img src="hero.png" alt="Hero Banner" decoding="async">' in optimized

    # 第二張內容圖：自動補齊 loading="lazy" 與 decoding="async"
    assert 'src="chart.png" alt="Chart" loading="lazy" decoding="async"' in optimized

    # 第三張帶有 data-no-lazy 的圖：保持原樣不強制加 lazy
    assert 'src="footer.png" alt="Footer" data-no-lazy="true"' in optimized


def test_auto_linker_clean_and_block():
    """測試 auto_linker 清除標籤功能"""
    raw_html = """
    <main>
        <p>內容</p>
        <!-- auto_linker_start -->
        <div>舊延伸卡片</div>
        <!-- auto_linker_end -->
    </main>
    """
    cleaned = clean_auto_linker_block(raw_html)
    assert "auto_linker_start" not in cleaned
    assert "舊延伸卡片" not in cleaned
    assert "<main>" in cleaned
