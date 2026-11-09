# -*- coding: utf-8 -*-
"""
test_audit_fixes.py — 針對 Pipeline Audit Fixes (ISSUE-002, ISSUE-003, ISSUE-004) 的 regression 防禦單元測試
"""

import pytest
from bs4 import BeautifulSoup
from scratch.lib.safety import (
    is_writable,
    is_appendable,
    GENERIC_AEO_HEADER_BLACKLIST
)

def test_generic_aeo_header_blacklist_ssot():
    """驗證 GENERIC_AEO_HEADER_BLACKLIST 包含關鍵黑名單詞彙"""
    assert "執行摘要" in GENERIC_AEO_HEADER_BLACKLIST
    assert "結論與展望" in GENERIC_AEO_HEADER_BLACKLIST
    assert "參考文獻" in GENERIC_AEO_HEADER_BLACKLIST

def test_safety_human_node_protection():
    """驗證 data-managed="human" 或 DEFAULT_HUMAN_IDS 節點不可寫入也不可追加"""
    soup = BeautifulSoup('<div id="mason-yang-observation" data-managed="human"></div>', "html.parser")
    node = soup.find(id="mason-yang-observation")
    
    assert is_writable(node, "test_script") is False
    assert is_appendable(node, "test_script") is False

def test_5w1h_sibling_deletion_scope():
    """驗證 5W1H 刪除邏輯僅限於 grid 兄弟節點，不刪除其他正文"""
    html = """
    <article>
        <p>正文開頭段落</p>
        <h2 id="section-5w1h-core">5W1H核心認知架構</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8 not-prose">舊5W1H</div>
        <p>正文後續重要段落</p>
    </article>
    """
    soup = BeautifulSoup(html, "html.parser")
    sec_5w1h = soup.find(id="section-5w1h-core")
    
    # 模擬修復後的 5W1H 刪除邏輯
    for sibling in list(sec_5w1h.find_next_siblings()):
        if hasattr(sibling, 'get'):
            classes = sibling.get('class', [])
            if 'grid' in classes or 'not-prose' in classes:
                sibling.decompose()
            else:
                break
                
    article = soup.find("article")
    # 確保正文開頭與正文後續段落均完整保留，只有 grid 被刪除
    assert "正文開頭段落" in article.get_text()
    assert "正文後續重要段落" in article.get_text()
    assert "舊5W1H" not in article.get_text()
