# -*- coding: utf-8 -*-
"""
Tests for Article Hygiene & TOC Tool (tools/article_hygiene.py)
"""

import pytest
import subprocess
import sys
from pathlib import Path

from tools.article_hygiene import (
    clean_cjk_whitespace,
    extract_headings,
    build_toc_html,
    generate_dual_toc,
    validate_toc_anchors,
    check_tag_balance,
    check_h2_compression,
    fix_h2_compression,
    detect_aeo_templates,
    calculate_article_stats,
    update_article_stats,
    audit_outer_shell,
    check_exposed_placeholders,
    process_file
)


def test_clean_cjk_whitespace_basic():
    # 測試漢字間多餘半形空格消除
    raw = "<p>這是一段 繁體中文 內容，含有 硬折行\n產生的 空格。</p>"
    cleaned = clean_cjk_whitespace(raw)
    assert cleaned == "<p>這是一段繁體中文內容，含有硬折行產生的空格。</p>"


def test_clean_cjk_whitespace_preserves_code_and_pangu():
    # 測試保護 <code>, <pre>, <script>, 標籤屬性，並保留中英空格
    raw = (
        '<div class="box p-4" data-info="test value">'
        '<p>Apple 與 Unity 在 2026 年 達成 戰略 合作。</p>'
        '<code>const msg = "hello world";</code>'
        '<pre>\n  function add(a, b) { return a + b; }\n</pre>'
        '</div>'
    )
    cleaned = clean_cjk_whitespace(raw)
    # 標籤屬性保留
    assert 'class="box p-4"' in cleaned
    assert 'data-info="test value"' in cleaned
    # 中英空格保留 (盤古之白)
    assert "Apple 與 Unity" in cleaned
    assert "在 2026 年" in cleaned
    # 中文間空格消除
    assert "達成戰略合作" in cleaned
    # code 與 pre 內部完全不受影響
    assert 'const msg = "hello world";' in cleaned
    assert "function add(a, b) { return a + b; }" in cleaned


def test_clean_cjk_duplicate_units():
    # 測試重複單位清理
    raw = "<p>閱讀時間 約 15 分鐘 分鐘 ，年成長率達 25% % ，耗時 3 個月 個月 。</p>"
    cleaned = clean_cjk_whitespace(raw)
    assert "約 15 分鐘，" in cleaned
    assert "25%，" in cleaned
    assert "3 個月。" in cleaned


def test_toc_extraction_and_generation():
    html = """
    <main>
        <h2 id="chap-1">1 核心論點</h2>
        <h3 id="sec-1-1">1.1 技術架構</h3>
        <h2 id="chap-2">2 財務模型</h2>
    </main>
    """
    headings = extract_headings(html)
    assert len(headings) == 3
    assert headings[0] == {"level": 2, "title": "1 核心論點", "id": "chap-1"}
    assert headings[1] == {"level": 3, "title": "1.1 技術架構", "id": "sec-1-1"}
    assert headings[2] == {"level": 2, "title": "2 財務模型", "id": "chap-2"}

    toc_html = build_toc_html(headings)
    assert '<!-- static_toc_start -->' in toc_html
    assert '<!-- static_toc_end -->' in toc_html
    assert 'href="#chap-1"' in toc_html
    assert 'href="#sec-1-1"' in toc_html
    assert 'href="#chap-2"' in toc_html


def test_generate_dual_toc():
    html = """
    <div id="toc-desktop-host">
      <!-- static_toc_start -->
      <nav>old toc</nav>
      <!-- static_toc_end -->
    </div>
    <div id="toc-mobile-target">
      <!-- static_toc_start -->
      <nav>old mobile toc</nav>
      <!-- static_toc_end -->
    </div>
    <main>
      <h2 id="h2-sec1">第一章</h2>
      <h3 id="h3-sub1">第一節</h3>
    </main>
    """
    new_html, report = generate_dual_toc(html)
    assert report["desktop_updated"] is True
    assert report["mobile_updated"] is True
    assert report["headings_found"] == 2
    assert 'href="#h2-sec1"' in new_html
    assert 'href="#h3-sub1"' in new_html
    # 舊內容應被覆蓋
    assert "old toc" not in new_html


def test_validate_toc_anchors():
    # 有效與無效錨點校驗
    html_with_broken_anchor = """
    <nav class="static-toc-container">
      <ul class="static-toc">
        <li><a href="#existing-anchor">存在</a></li>
        <li><a href="#broken-anchor">不存在</a></li>
      </ul>
    </nav>
    <div id="existing-anchor">內容</div>
    """
    invalid = validate_toc_anchors(html_with_broken_anchor)
    assert len(invalid) == 1
    assert invalid[0]["anchor"] == "#broken-anchor"


def test_check_tag_balance():
    balanced_html = "<div><section><p>Test</p></section></div>"
    res1 = check_tag_balance(balanced_html)
    assert res1["all_balanced"] is True

    unbalanced_html = "<div><section><p>Test</div>"
    res2 = check_tag_balance(unbalanced_html)
    assert res2["all_balanced"] is False
    assert "section" in res2["unbalanced"]
    assert "p" in res2["unbalanced"]


def test_h2_compression_check_and_fix():
    compressed = '<div><h2 id="sec1">標題</h2><div class="lead-in-questions"><p>問句</p></div></div>'
    issues = check_h2_compression(compressed)
    assert len(issues) == 1
    assert issues[0]["line"] == 1

    fixed = fix_h2_compression(compressed)
    assert "\n" in fixed
    assert len(check_h2_compression(fixed)) == 0


def test_detect_aeo_templates():
    sample_with_aeo = """
    <div class="lead-in-questions">
        <p>對於 遊戲引擎市場，核心驅動機制為何？</p>
        <p>為什麼 次世代 3D 技術 如此重要？</p>
    </div>
    """
    templates = detect_aeo_templates(sample_with_aeo)
    assert len(templates) >= 2

    clean_sample = """
    <div class="lead-in-questions">
        <p>Vector 廣告引擎在導入 Transformer 架構後，如何提高 eCPM 轉化率？</p>
    </div>
    """
    clean_templates = detect_aeo_templates(clean_sample)
    assert len(clean_templates) == 0


def test_calculate_article_stats():
    sample = """
    <aside>側邊欄不要算進去</aside>
    <main>
        <p>這是一篇關於 Unity 股票分析的研究報告，深入解構 2026 年商業模式反轉與技術突破。</p>
        <p>Unity Vector AI and AppLovin AXON 2.0 competition overview.</p>
    </main>
    <div class="meta">約 15 分鐘</div>
    """
    stats = calculate_article_stats(sample)
    assert stats["cjk_chars"] > 30
    assert stats["english_words"] >= 6
    assert stats["displayed_read_minutes"] == 15
    assert stats["duplicate_minute_unit"] is False


def test_cli_end_to_end(tmp_path):
    # 建立臨時測試文章 HTML
    test_file = tmp_path / "test_post.html"
    content = """
    <!DOCTYPE html>
    <html>
    <head><title>測試文章</title></head>
    <body>
      <div id="toc-desktop-host"></div>
      <div id="toc-mobile-target"></div>
      <main>
        <h2 id="chap-1">章節 一</h2>
        <p>這是 一篇 繁體中文 測試 報告，約 5 分鐘 分鐘。</p>
      </main>
    </body>
    </html>
    """
    test_file.write_text(content, encoding="utf-8")

    # 執行 CLI --all
    cmd = [sys.executable, "tools/article_hygiene.py", str(test_file), "--all"]
    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    assert result.returncode == 0

    # 驗證檔案已被修復
    updated_content = test_file.read_text(encoding="utf-8")
    assert "這是一篇繁體中文測試報告" in updated_content
    assert "約 5 分鐘。" in updated_content
    assert '<!-- static_toc_start -->' in updated_content
    assert 'href="#chap-1"' in updated_content


def test_check_tag_balance_ignores_comments_and_code():
    # 測試 HTML 註解與代碼塊中的標籤不會導致假性不平衡
    html = """
    <div>
      <!-- 這裡是注釋: <p>未閉合段落</p> <ul>未閉合清單 -->
      <code><div>未閉合</div></code>
      <pre><ul><li>code block</li></pre>
      <p>這是真實的段落。</p>
    </div>
    """
    res = check_tag_balance(html)
    assert res["all_balanced"] is True
    assert len(res["unbalanced"]) == 0


def test_update_article_stats():
    # 測試自動校正字數與閱讀時間
    html = """
    <main>
      <p>這是一篇標準文章內容，用以測試統計數據自動更新機制。包含中英文字與技術分析。</p>
      <p>Trading strategies and market microstructure alpha.</p>
    </main>
    <div class="sidebar">
      <dt>本文字數</dt>
      <dd data-meta="word-count">約 100 字</dd>
      <dt>閱讀時間</dt>
      <dd data-meta="reading-time">約 1 分鐘 分鐘</dd>
    </div>
    """
    updated, report = update_article_stats(html)
    assert report["changed"] is True
    assert "分鐘 分鐘" not in updated
    assert "約" in updated
    assert "字" in updated
    assert "分鐘" in updated


def test_extract_headings_purifies_dsr_labels():
    # 測試 extract_headings 排除 .dsr-label 元素與中括號結構標籤
    html = """
    <main>
      <h2 id="chap-1"><span class="dsr-label">[Direct Answer]</span>市場結構與核心論點</h2>
      <h3 id="sec-1-1">[Support Details] 流動性指標深度分析</h3>
      <h2 id="chap-2">【TL;DR】 結論與行動指引</h2>
      <h3 id="sec-2-1">正常無前綴章節標題</h3>
    </main>
    """
    headings = extract_headings(html)
    assert len(headings) == 4
    assert headings[0]["title"] == "市場結構與核心論點"
    assert headings[1]["title"] == "流動性指標深度分析"
    assert headings[2]["title"] == "結論與行動指引"
    assert headings[3]["title"] == "正常無前綴章節標題"


def test_check_exposed_placeholders_detects_all_five_categories():
    # 測試 5 大類佔位符與外露問題檢測
    html_with_issues = """
    <main>
      <!-- 類別 1: 殘留標籤 -->
      <p>關鍵觀察：[描述觀察到的數據或現象] 以及 [不可忽視變數 1]。</p>
      <!-- 類別 2: TOC 污染 -->
      <a href="#chap-1">[Direct Answer] 核心論點</a>
      <!-- 類別 3: 死模板假字 -->
      <p>報告推論起點建立於資產供需架構的結構性變革，產業供給限制與籌碼集中度共同決定了邊際定價權。</p>
      <!-- 類別 4: 畸形 AEO 標題 -->
      <h3>文章推論邏輯分析...的具體實體運作路徑為何</h3>
      <!-- 類別 5: 裸露 DSR (未包裹 strong.dsr-label) -->
      <span>[Direct Answer] 這是裸露的回答</span>
      <!-- 合法 DSR (應忽略) -->
      <strong class="dsr-label">[Direct Answer]</strong>
      <!-- 註解內的標籤 (應忽略) -->
      <!-- [不可忽視變數 2] -->
    </main>
    """
    findings = check_exposed_placeholders(html_with_issues)
    assert len(findings) >= 5

    rules = [f["rule"] for f in findings]
    assert any("類別 1" in r for r in rules)
    assert any("類別 2" in r for r in rules)
    assert any("類別 3" in r for r in rules)
    assert any("類別 4" in r for r in rules)
    assert any("類別 5" in r for r in rules)


def test_audit_outer_shell_blocks_on_placeholders():
    # 測試當包含佔位符時 audit_outer_shell 判定未通過
    clean_html = """
    <div>
      <h2 id="chap-1">章節一</h2>
      <p>純淨正文段落，無任何模板佔位符。</p>
    </div>
    """
    clean_audit = audit_outer_shell(clean_html)
    assert clean_audit["exposed_placeholders_count"] == 0

    dirty_html = """
    <div>
      <h2 id="chap-1">章節一</h2>
      <p>[不可忽視變數 1] 導致模型失效。</p>
    </div>
    """
    dirty_audit = audit_outer_shell(dirty_html)
    assert dirty_audit["exposed_placeholders_count"] == 1
    assert dirty_audit["passed"] is False

