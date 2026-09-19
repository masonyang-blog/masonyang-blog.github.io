# -*- coding: utf-8 -*-
"""
test_typography_linter.py
TypographyLinter 核心模組之單元測試套件
"""

import unittest
import sys
import os

# 加入 scratch 目錄至 sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
repo_root = os.path.abspath(os.path.join(current_dir, ".."))
scratch_lib = os.path.join(repo_root, "scratch", "lib")
if scratch_lib not in sys.path:
    sys.path.insert(0, scratch_lib)

from typography_linter import TypographyLinter
from typography_auditor import run_batch_typography_audit

class TestTypographyLinter(unittest.TestCase):
    """測試 TypographyLinter 的審計、修復與無損驗證能力"""

    def setUp(self):
        self.sample_flawed_html = (
            '<div class="article-body">\n'
            '  <ol class="list-decimal">\n'
            '    <li class="leading-relaxed"><strong class="text-slate-900 dark:text-slate-100 font-semibold">測試標題一：</strong></li>\n'
            '    <li class="leading-relaxed">這是分離的清單內文，提及 580 億美元與 80% 美債儲備。</li>\n'
            '  </ol>\n'
            '  <p class="mb-6">這裡有 **Markdown粗體殘留**，以及問號？？</p>\n'
            '  <p class="mb-6">立法賦權並非加密貨幣的勝利，而是美國主權債務擴張。</p>\n'
            '  <h3>📚 引用著作清單</h3>\n'
            '  <p class="empty"></p>\n'
            '</div>'
        )

    def test_audit_detects_all_flaws(self):
        """測試 audit 是否能精準偵測 5 大缺陷"""
        report = TypographyLinter.audit(self.sample_flawed_html)
        
        # 1. 偵測到分離清單
        self.assertGreaterEqual(len(report["split_lists"]), 1)
        self.assertIn("測試標題一", report["split_lists"][0]["title"])
        
        # 2. 偵測到 Markdown 粗體殘留
        self.assertGreaterEqual(len(report["markdown_bolds"]), 1)
        self.assertEqual(report["markdown_bolds"][0]["text"], "**Markdown粗體殘留**")
        
        # 3. 偵測到重複問號
        self.assertGreaterEqual(len(report["repeated_punctuations"]), 1)
        
        # 4. 偵測到違規 Emoji
        self.assertGreaterEqual(len(report["emojis"]), 1)
        self.assertEqual(report["emojis"][0]["emoji"], "📚")
        
        # 5. 偵測到「並非...而是...」否定句型
        self.assertGreaterEqual(len(report["negative_sentences"]), 1)
        self.assertIn("並非加密貨幣的勝利，而是", report["negative_sentences"][0]["sentence"])

    def test_fix_repairs_flaws_and_keeps_tag_balance(self):
        """測試 fix 是否能自動修復機械缺陷且保證 DOM 標籤平衡"""
        fixed_html, stats = TypographyLinter.fix(self.sample_flawed_html)
        
        # 驗證修復統計
        self.assertGreaterEqual(stats["split_lists_fixed"], 1)
        self.assertGreaterEqual(stats["markdown_bolds_fixed"], 1)
        self.assertGreaterEqual(stats["repeated_questions_fixed"], 1)
        self.assertGreaterEqual(stats["repeated_punctuations_fixed"], 1)
        self.assertGreaterEqual(stats["pangu_spacing_fixed"], 1)
        self.assertGreaterEqual(stats["emojis_cleaned"], 1)
        
        # 驗證修復後的文字內容 (包含 Pangu Spacing 注入空格)
        self.assertNotIn("**Markdown粗體殘留**", fixed_html)
        self.assertIn('<strong class="text-slate-900 dark:text-slate-100 font-semibold">Markdown 粗體殘留</strong>', fixed_html)
        self.assertNotIn("？？", fixed_html)
        self.assertIn("？", fixed_html)
        self.assertNotIn("📚", fixed_html)
        
        # 驗證清單項目已合併在同一個 li
        self.assertIn('<li class="leading-relaxed"><strong class="text-slate-900 dark:text-slate-100 font-semibold">測試標題一：</strong>這是分離的清單內文', fixed_html)
        
        # 驗證修復後的標籤平衡
        recheck = TypographyLinter.audit(fixed_html)
        self.assertEqual(len(recheck["tag_balance_errors"]), 0)
        self.assertEqual(len(recheck["split_lists"]), 0)
        self.assertEqual(len(recheck["markdown_bolds"]), 0)

    def test_verify_lossless_pass_on_clean_content(self):
        """測試修改前後無數值刪減時，verify_lossless 返回 True"""
        old_text = " Circle 儲備包含 80% 短期美債與 580 億美元發行量，對沖標的為 COIN 與 KRE。"
        new_text = " Circle 的儲備包含 80% 短期美債與 580 億美元發行量，對沖標的為 COIN 與 KRE，語句經過潤飾。"
        
        is_lossless, missing = TypographyLinter.verify_lossless(old_text, new_text)
        self.assertTrue(is_lossless)
        self.assertEqual(len(missing), 0)

    def test_verify_lossless_detects_data_omission(self):
        """測試若不慎刪減數值或代幣名稱時，verify_lossless 能精確攔截"""
        old_text = "基準利率下調引發 3.5 億美元減損，目標發行量 580 億美元，持倉 60% COIN。"
        # 刻意刪除 580 億美元 與 COIN
        new_text = "基準利率下調引發 3.5 億美元減損，持倉 60%。"
        
        is_lossless, missing = TypographyLinter.verify_lossless(old_text, new_text)
        self.assertFalse(is_lossless)
        self.assertIn("COIN", missing)

    def test_duplicate_section_detection(self):
        """測試重複章節段落檢測"""
        duplicate_html = (
            '<h2 id="chapter-1">章節一</h2>\n'
            '<p>這是一段長度超過四十個字元的首段文字敘述，用來檢測章節是否發生被不慎重複貼上的問題。</p>\n'
            '<h2 id="chapter-2">章節二</h2>\n'
            '<p>這是一段長度超過四十個字元的首段文字敘述，用來檢測章節是否發生被不慎重複貼上的問題。</p>'
        )
        report = TypographyLinter.audit(duplicate_html)
        self.assertGreaterEqual(len(report["duplicate_sections"]), 1)
        self.assertEqual(report["duplicate_sections"][0]["current_chapter"], "chapter-2")
        self.assertEqual(report["duplicate_sections"][0]["original_chapter"], "chapter-1")

    def test_isolated_brs_count_accuracy(self):
        """測試孤立換行計數準確度（無孤立 br 時為 0，有修復時精確累加，非固定 +1）"""
        clean_html = '<div><p>正常內容段落</p><h2>標題</h2></div>'
        _, stats_clean = TypographyLinter.fix(clean_html)
        self.assertEqual(stats_clean["isolated_brs_fixed"], 0)

        dirty_html = '<div>內容</div><br><h2>標題</h2><div>另一段</div> <br/> <h3>次標題</h3>'
        fixed_dirty, stats_dirty = TypographyLinter.fix(dirty_html)
        self.assertEqual(stats_dirty["isolated_brs_fixed"], 2)
        self.assertNotIn('<br><h2>', fixed_dirty)
        self.assertNotIn('<br/> <h3>', fixed_dirty)

    def test_split_lists_fix_without_standard_classes(self):
        """測試無標準 class 或純 HTML 的分離清單結構亦能成功修復，杜絕靜默失效"""
        plain_split_html = (
            '<ul>\n'
            '  <li><strong>項目一：</strong></li>\n'
            '  <li>這是沒有 class 的內文。</li>\n'
            '  <li class="custom-item"><strong class="custom-bold">項目二：</strong></li>\n'
            '  <li class="custom-item">這是自訂 class 的內文。</li>\n'
            '</ul>'
        )
        # 1. 審計應檢驗出 2 個分離清單
        report = TypographyLinter.audit(plain_split_html)
        self.assertEqual(len(report["split_lists"]), 2)

        # 2. 修復應合併 2 個分離清單且不破壞 DOM 平衡
        fixed_html, stats = TypographyLinter.fix(plain_split_html)
        self.assertEqual(stats["split_lists_fixed"], 2)

        # 3. 再次審計應不再存在任何分離清單
        recheck = TypographyLinter.audit(fixed_html)
        self.assertEqual(len(recheck["split_lists"]), 0)
        self.assertEqual(len(recheck["tag_balance_errors"]), 0)
        self.assertIn('<li class="leading-relaxed"><strong class="text-slate-900 dark:text-slate-100 font-semibold">項目一：</strong>這是沒有 class 的內文。</li>', fixed_html)
        self.assertIn('<li class="custom-item"><strong class="custom-bold">項目二：</strong>這是自訂 class 的內文。</li>', fixed_html)

    def test_masking_pangu_and_punctuation_fixes(self):
        """測試 DOM 遮罩保護、中英文盤古間距以及全標點符號收斂閉環"""
        html_input = (
            '<div class="text-sm p-4" data-metric="100%_SEC">\n'
            '  <p>這是Circle儲備80%美債！！。。</p>\n'
            '  <pre><code>const val = 100% != !!flag; // 這裡不應被誤傷或插入空格</code></pre>\n'
            '  <p>專案Token經濟學、、包含ETH與SOL。。</p>\n'
            '</div>'
        )
        fixed_html, stats = TypographyLinter.fix(html_input)

        # 1. 驗證 Pangu Spacing 正確注入
        self.assertIn('這是 Circle 儲備 80% 美債！。', fixed_html)
        self.assertIn('專案 Token 經濟學、包含 ETH 與 SOL。', fixed_html)

        # 2. 驗證 HTML 屬性未被誤加空格或破壞
        self.assertIn('<div class="text-sm p-4" data-metric="100%_SEC">', fixed_html)

        # 3. 驗證代碼區塊內容 100% 原樣保留無誤傷
        self.assertIn('const val = 100% != !!flag;', fixed_html)

        # 4. 驗證重複標點統計
        self.assertGreaterEqual(stats["repeated_punctuations_fixed"], 3)
        self.assertGreaterEqual(stats["pangu_spacing_fixed"], 4)

    def test_pangu_spacing_edge_cases(self):
        """測試中英數字間距的各類細節邊界案例"""
        # 測試英文接全形標點不加多餘空格、百分比接中文、貨幣符號
        test_html = '<p>持有$500萬美元的USDC，年化收益達4.5%區間，對沖標的為COIN。</p>'
        fixed, stats = TypographyLinter.fix(test_html)
        self.assertIn('持有 $500 萬美元的 USDC，年化收益達 4.5% 區間，對沖標的為 COIN。', fixed)

    def test_batch_typography_auditor(self):
        """測試批次巡檢模組 run_batch_typography_audit 是否能正常運算單篇或目錄"""
        sample_path = os.path.join(repo_root, "news", "20260905-clarity-act-rwa-investment-research.html")
        if os.path.exists(sample_path):
            result = run_batch_typography_audit(sample_path, auto_fix=False, dry_run=True)
            self.assertIsInstance(result, bool)

if __name__ == "__main__":
    unittest.main()
