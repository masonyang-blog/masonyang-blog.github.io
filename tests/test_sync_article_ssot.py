# -*- coding: utf-8 -*-
"""
Tests for SSOT Synchronization Tool (tools/sync_article_ssot.py)
"""

import os
import json
import pytest
import subprocess
import sys
from pathlib import Path

from tools.sync_article_ssot import (
    extract_meta_tag,
    extract_canonical_url,
    extract_json_ld,
    extract_article_metadata,
    strip_html_tags,
    update_search_index_dual,
    check_ssot_status,
    scan_all_articles,
    REPO_ROOT
)


def test_strip_html_tags():
    html = """
    <div>
        <!-- This is a comment -->
        <script>const x = 10;</script>
        <style>.box { color: red; }</style>
        <h1>這是 標題</h1>
        <p>這是一段 <b>測試</b> 正文內容。</p>
    </div>
    """
    text = strip_html_tags(html)
    assert text == "這是 標題 這是一段 測試 正文內容。"
    assert "comment" not in text
    assert "const x" not in text
    assert "color: red" not in text


def test_extract_article_metadata_basic():
    sample_html = """<!DOCTYPE html>
    <html lang="zh-Hant">
    <head>
        <meta charset="utf-8"/>
        <title>【測試文章】 - 深度分析架構與未來展望 | Mason Yang Blog</title>
        <meta name="description" content="這是一篇測試文章的 SEO 描述內容。"/>
        <meta name="keywords" content="測試, AI, 深度學習, 投研"/>
        <meta name="category" content="tech-ai"/>
        <meta name="format" content="deep-report"/>
        <meta name="publish-date" content="2026-10-27"/>
        <meta name="modified-date" content="2026-10-28"/>
        <link rel="canonical" href="https://masonyang-blog.github.io/post/test-article.html"/>
    </head>
    <body>
        <h1>測試主標題</h1>
        <p>測試內文第一段落，深入探討技術前沿與投資策略。</p>
    </body>
    </html>"""

    meta = extract_article_metadata(sample_html, rel_path="post/test-article.html")
    assert meta["id"] == "test-article"
    assert meta["title"] == "【測試文章】 - 深度分析架構與未來展望"
    assert meta["desc"] == "這是一篇測試文章的 SEO 描述內容。"
    assert meta["category"] == "tech-ai"
    assert meta["category_name"] == "科技趨勢與 AI"
    assert meta["format"] == "deep-report"
    assert meta["published"] == "2026-10-27"
    assert meta["modified"] == "2026-10-28"
    assert meta["tags"] == ["測試", "AI", "深度學習", "投研"]
    assert meta["tag"] == "測試"
    assert meta["link"] == "post/test-article.html"
    assert meta["canonical"] == "https://masonyang-blog.github.io/post/test-article.html"
    assert "測試內文第一段落" in meta["pure_content"]
    assert meta["word_count"] > 10


def test_extract_article_metadata_with_json_ld():
    sample_html = """<!DOCTYPE html>
    <html>
    <head>
        <title>JSON-LD 測試文章</title>
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": "結構化資料標題",
            "description": "JSON-LD 提供的精準描述摘要",
            "datePublished": "2026-10-25T08:00:00+08:00",
            "dateModified": "2026-10-26T12:00:00+08:00",
            "articleSection": "crypto-web3",
            "keywords": ["Web3", "Solana", "DeFi"]
        }
        </script>
        <link rel="canonical" href="https://masonyang-blog.github.io/news/20261025-web3-solana.html"/>
    </head>
    <body>
        <p>正文內容</p>
    </body>
    </html>"""

    meta = extract_article_metadata(sample_html, rel_path="news/20261025-web3-solana.html")
    assert meta["id"] == "20261025-web3-solana"
    assert meta["desc"] == "JSON-LD 提供的精準描述摘要"
    assert meta["published"] == "2026-10-25"
    assert meta["modified"] == "2026-10-26"
    assert meta["category"] == "crypto-web3"
    assert meta["category_name"] == "數位資產與 Web3"
    assert meta["tags"] == ["Web3", "Solana", "DeFi"]


def test_update_search_index_dual_paths(tmp_path, monkeypatch):
    p1 = tmp_path / "search-index.json"
    p2 = tmp_path / "data" / "search-index.json"

    monkeypatch.setattr("tools.sync_article_ssot.SEARCH_INDEX_PATH", str(p1))
    monkeypatch.setattr("tools.sync_article_ssot.SEARCH_INDEX_DATA_PATH", str(p2))

    sample_entries = [
        {
            "id": "test-1",
            "title": "測試條目一",
            "category": "tech-ai",
            "published": "2026-10-27",
            "link": "post/test-1.html",
            "desc": "描述一",
            "content": "純文字樣本一"
        }
    ]

    # 初次寫入
    updated, has_drift = update_search_index_dual(sample_entries, dry_run=False, quiet=True)
    assert updated == 1
    assert has_drift is True
    assert p1.exists()
    assert p2.exists()

    d1 = json.loads(p1.read_text(encoding="utf-8"))
    d2 = json.loads(p2.read_text(encoding="utf-8"))
    assert d1 == d2
    assert d1[0]["id"] == "test-1"

    # 二次執行（無漂移）
    updated2, has_drift2 = update_search_index_dual(sample_entries, dry_run=False, quiet=True)
    assert updated2 == 0
    assert has_drift2 is False


def test_scan_all_articles_and_zero_drift():
    # 測試全站 144 篇文章掃描與資料完整性
    articles, details_map, search_entries = scan_all_articles(REPO_ROOT)
    assert len(articles) >= 144
    assert len(search_entries) >= 144
    assert len(details_map) >= 140

    # 驗證全站 SSOT 目前為 100% 同步 (0 資料漂移)
    res = check_ssot_status(REPO_ROOT, quiet=True)
    assert res["in_sync"] is True, f"Drifts detected: {res['diffs']}"
    assert len(res["diffs"]) == 0


def test_cli_help_execution():
    cmd = [sys.executable, "tools/sync_article_ssot.py", "--help"]
    result = subprocess.run(cmd, cwd=REPO_ROOT, capture_output=True, text=True, encoding="utf-8")
    assert result.returncode == 0
    assert "--sync" in result.stdout
    assert "--check" in result.stdout
    assert "--file" in result.stdout


def test_cli_file_inspection_existing_article():
    cmd = [sys.executable, "tools/sync_article_ssot.py", "--file", "project/unity.html"]
    result = subprocess.run(cmd, cwd=REPO_ROOT, capture_output=True, text=True, encoding="utf-8")
    assert result.returncode == 0
    assert "HTML Metadata Inspection: unity" in result.stdout
    assert "[REGISTERED]" in result.stdout
    assert "equity-research" in result.stdout
