# -*- coding: utf-8 -*-
"""
tests/test_md_compiler.py — Unit tests for _generate_contract() in md_compiler.py
Ensures the contract file produced at compile time is complete, correct, and deterministic.
"""
import json
import os
import shutil
import tempfile

import pytest
from lib.md_compiler import _generate_contract


SAMPLE_MD = """---
title: "Test Article"
---

## Chapter One: Introduction
Private credit at $1.6T market size and 40% LTV ratio.
See 1,440萬 units across sectors.
SOFR 5.3 rate benchmark with EBITDA 12x leverage.
中文段落測試：本文分析安全架構升級計畫，涵蓋六大解決方案確保文章內容正確性。

## Chapter Two: Analysis
More content with 60% allocation and $500M fund target.
"""

SAMPLE_TOC = [
    {"level": 2, "text": "Chapter One: Introduction", "id": "chapter-one"},
    {"level": 3, "text": "Sub-section 1.1", "id": "sub-1-1"},
    {"level": 2, "text": "Chapter Two: Analysis", "id": "chapter-two"},
]

SAMPLE_META = {
    "article_id": "test-contract-article",
    "date": "2026-08-03",
    "title": "Test Article",
    "category": "test",
}


@pytest.fixture
def contract_path(tmp_path):
    """Generate a contract file and return its path for inspection."""
    html_file = tmp_path / "draft-20260803-test-contract-article.html"
    _generate_contract(
        md_path="doc/draft/test.md",
        html_path=str(html_file),
        meta=SAMPLE_META,
        md_content=SAMPLE_MD,
        toc_entries=SAMPLE_TOC,
    )
    contract = os.path.join("scratch", "tmp_draft-20260803-test-contract-article.contract.json")
    yield contract
    # Cleanup
    if os.path.exists(contract):
        os.remove(contract)


class TestContractFileGeneration:
    def test_contract_file_is_created(self, contract_path):
        assert os.path.exists(contract_path), f"Contract not found at {contract_path}"

    def test_contract_is_valid_json(self, contract_path):
        with open(contract_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        assert isinstance(data, dict)

    def test_schema_version_present(self, contract_path):
        with open(contract_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        assert data["schema_version"] == "1.0"

    def test_article_id_matches(self, contract_path):
        with open(contract_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        assert data["article_id"] == "test-contract-article"

    def test_source_md_hash_is_16_chars(self, contract_path):
        with open(contract_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        assert len(data["source_md_hash"]) == 16

    def test_source_md_hash_is_deterministic(self, tmp_path):
        """Same input content should always produce the same hash."""
        html_file = tmp_path / "draft-20260803-det-test.html"
        _generate_contract("x.md", str(html_file), SAMPLE_META, SAMPLE_MD, SAMPLE_TOC)
        c1 = "scratch/tmp_draft-20260803-det-test.contract.json"
        with open(c1, "r", encoding="utf-8") as f:
            hash1 = json.load(f)["source_md_hash"]
        os.remove(c1)

        _generate_contract("x.md", str(html_file), SAMPLE_META, SAMPLE_MD, SAMPLE_TOC)
        with open(c1, "r", encoding="utf-8") as f:
            hash2 = json.load(f)["source_md_hash"]
        os.remove(c1)

        assert hash1 == hash2

    def test_locked_sections_contains_known_human_nodes(self, contract_path):
        with open(contract_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        locked = data["locked_sections"]
        assert "mason-yang-observation" in locked
        assert "article-analysis-header" in locked
        assert "article-inference-logic" in locked

    def test_auto_sections_present(self, contract_path):
        with open(contract_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        auto = data["auto_sections"]
        assert "toc-desktop-host" in auto
        assert "content-references" in auto

    def test_key_metrics_extracted(self, contract_path):
        with open(contract_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        metrics = data["key_metrics"]
        assert len(metrics) > 0, "No key_metrics extracted from sample MD"
        # Should find at least percentage
        has_percentage = any("%" in m for m in metrics)
        assert has_percentage, f"No percentage found in metrics: {metrics}"

    def test_h2_h3_outline_matches_toc(self, contract_path):
        with open(contract_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        outline = data["h2_h3_outline"]
        assert len(outline) == 3  # 2 H2 + 1 H3
        assert any("Chapter One" in o for o in outline)
        assert any("Chapter Two" in o for o in outline)
        assert any("H3" in o for o in outline)

    def test_word_count_baseline_structure(self, contract_path):
        with open(contract_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        wc = data["word_count_baseline"]
        assert "zh" in wc
        assert "en_words" in wc
        assert "zh_90pct_threshold" in wc
        assert wc["zh_90pct_threshold"] == int(wc["zh"] * 0.9)

    def test_zh_count_detects_chinese_chars(self, contract_path):
        with open(contract_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        # SAMPLE_MD contains Chinese characters
        assert data["word_count_baseline"]["zh"] > 0


class TestCompileMarkdownMetadataAlignment:
    """Tests that compile_markdown_to_html correctly aligns Breadcrumb and JSON-LD metadata."""

    def test_category_chinese_name_alignment(self, tmp_path):
        from lib.md_compiler import compile_markdown_to_html
        
        md_file = tmp_path / "test_web3.md"
        md_file.write_text(
            '---\ntitle: "Web3 深度報告"\ndate: "2026-09-19"\narticle_id: "test-web3-art"\ncategory: "數位資產與 Web3"\n---\n\n## 導論\n測試內文。',
            encoding="utf-8"
        )
        
        success = compile_markdown_to_html(str(md_file))
        assert success is True
        
        expected_html = os.path.join("doc", "draft", "20260919-test-web3-art.html")
        assert os.path.exists(expected_html)
        
        try:
            with open(expected_html, "r", encoding="utf-8") as f:
                content = f.read()
            
            # 1. 驗證 HTML Breadcrumb
            assert 'href="../../post/archive.html?filter=crypto-web3"' in content
            assert '>數位資產與 Web3</a>' in content
            assert 'Web3 深度報告</li>' in content
            
            # 2. 驗證 JSON-LD
            assert '"articleSection": "數位資產與 Web3"' in content
            assert '"https://masonyang-blog.github.io/post/archive.html?filter=crypto-web3"' in content
            
            # 3. 驗證 Hero Header 分類
            assert '數位資產與 Web3' in content
        finally:
            if os.path.exists(expected_html):
                os.remove(expected_html)
            # 移除合約快取
            for p in [
                os.path.join("scratch", "tmp_20260919-test-web3-art.contract.json"),
                os.path.join("scratch", "tmp", "tmp_20260919-test-web3-art.contract.json")
            ]:
                if os.path.exists(p):
                    os.remove(p)

    def test_category_slug_and_series_inference(self, tmp_path):
        from lib.md_compiler import compile_markdown_to_html
        
        md_file = tmp_path / "test_ai.md"
        md_file.write_text(
            '---\ntitle: "AI 算力模型"\ndate: "2026-09-19"\narticle_id: "test-ai-art"\ncategory: "tech-ai"\n---\n\n## 導論\n測試內文。',
            encoding="utf-8"
        )
        
        success = compile_markdown_to_html(str(md_file))
        assert success is True
        
        expected_html = os.path.join("doc", "draft", "20260919-test-ai-art.html")
        assert os.path.exists(expected_html)
        
        try:
            with open(expected_html, "r", encoding="utf-8") as f:
                content = f.read()
            
            assert 'href="../../post/archive.html?filter=tech-ai"' in content
            assert '>科技趨勢與 AI</a>' in content
            assert '"articleSection": "科技趨勢與 AI"' in content
        finally:
            if os.path.exists(expected_html):
                os.remove(expected_html)
            for p in [
                os.path.join("scratch", "tmp_20260919-test-ai-art.contract.json"),
                os.path.join("scratch", "tmp", "tmp_20260919-test-ai-art.contract.json")
            ]:
                if os.path.exists(p):
                    os.remove(p)
