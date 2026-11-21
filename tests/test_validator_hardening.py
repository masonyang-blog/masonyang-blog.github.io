# -*- coding: utf-8 -*-
"""
tests/test_validator_hardening.py
=============================================================================
迴歸測試：驗證 scratch/lib/html_validator.py 對於排版、寬度、字數卡等規則的攔截有效性。
=============================================================================
"""
import os
import sys
import io
import pytest

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
LIB_DIR = os.path.join(REPO_ROOT, "scratch", "lib")
if LIB_DIR not in sys.path:
    sys.path.insert(0, LIB_DIR)

from html_validator import validate_html_file

TARGET_FILE = os.path.join(REPO_ROOT, "news", "20261004-manufacturing-shakeout-synthesis.html")

def run_test(tmp_test_file, name, modified_html, expected_error_substr):
    with open(tmp_test_file, "w", encoding="utf-8") as f:
        f.write(modified_html)
    
    old_stdout = sys.stdout
    sys.stdout = io.StringIO()
    try:
        success = validate_html_file(tmp_test_file)
        output = sys.stdout.getvalue()
    finally:
        sys.stdout = old_stdout

    if success:
        print(f"[FAIL] {name}: Expected failure, but validator PASSED!")
        return False
    
    if expected_error_substr not in output:
        print(f"[FAIL] {name}: Failed as expected, but missing expected error substring: '{expected_error_substr}'")
        return False

    print(f"[PASS] {name}: Successfully caught expected violation ('{expected_error_substr}')")
    return True

def test_validator_hardening(tmp_path):
    if not os.path.exists(TARGET_FILE):
        pytest.skip(f"Target sample {TARGET_FILE} not found")
        
    with open(TARGET_FILE, "r", encoding="utf-8") as f:
        base_html = f.read()

    # 路徑須包含 news/ 以被判定為正式文章 (is_formal_article)
    news_dir = tmp_path / "news"
    news_dir.mkdir(parents=True, exist_ok=True)
    tmp_test_file = str(news_dir / "test_sample.html")
    all_passed = True

    # Test 1: 缺失本文字數
    html_1 = base_html.replace('<dt class="text-xs text-slate-500 dark:text-slate-400">本文字數</dt>', '<dt>刪除字數</dt>')
    if not run_test(tmp_test_file, "Missing 本文字數", html_1, "Article Info Card is missing '本文字數' row"):
        all_passed = False

    # Test 2: 缺失 data-meta="word-count"
    html_2 = base_html.replace('data-meta="word-count"', '')
    if not run_test(tmp_test_file, "Missing data-meta=\"word-count\"", html_2, "Article Info Card '本文字數' is missing mandatory attribute 'data-meta=\"word-count\"'"):
        all_passed = False

    # Test 3: Aside 只有 xl:block 沒有 lg:block
    html_3 = base_html.replace('class="hidden lg:block w-56 xl:w-60 shrink-0"', 'class="hidden xl:block w-72 shrink-0"')
    if not run_test(tmp_test_file, "Aside uses xl:block without lg:block", html_3, "uses 'xl:block' without 'lg:block'"):
        all_passed = False

    # Test 4: Aside 缺少標準 Tailwind 寬度
    html_4 = base_html.replace('class="hidden lg:block w-56 xl:w-60 shrink-0"', 'class="hidden lg:block shrink-0"')
    if not run_test(tmp_test_file, "Aside missing standard widths", html_4, "Sidebar width violation"):
        all_passed = False

    assert all_passed, "Some validator hardening tests failed"

if __name__ == "__main__":
    import tempfile
    with tempfile.TemporaryDirectory() as td:
        from pathlib import Path
        test_validator_hardening(Path(td))
        print("[PASS] All validator hardening tests passed.")
