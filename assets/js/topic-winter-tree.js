/**
 * topic-winter-tree.js
 * 凜冬將至 (Winter Is Coming) 研報階層矩陣與 AI 思考鏈研究工作台 (CoT Studio)
 * Zero-Build / Pure Vanilla JS / Dark-Mode Ready / No-Emoji Style Guide Compliant
 */
(function () {
    let treeData = null;
    let isAllExpanded = false;
    const SITE_BASE_URL = 'https://masonyang-blog.github.io';

    // Toast Notification System
    function showToast(message, duration = 3200) {
        let toast = document.getElementById('ktree-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'ktree-toast';
            toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl bg-slate-900/95 text-white text-xs sm:text-sm font-medium border border-cyan-500/50 shadow-2xl backdrop-blur-md transition-all duration-300 opacity-0 translate-y-4 pointer-events-none flex items-center gap-2 font-noto';
            document.body.appendChild(toast);
        }
        toast.innerHTML = message;
        toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
        toast.classList.add('opacity-100', 'translate-y-0');

        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.classList.remove('opacity-100', 'translate-y-0');
            toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
        }, duration);
    }

    // Clipboard Copy with Fallback
    async function copyToClipboard(text, successMsg) {
        let success = false;
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                success = true;
            } catch (err) {
                console.warn('[KTree] navigator.clipboard failed, fallback to execCommand:', err);
            }
        }
        if (!success) {
            try {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                success = document.execCommand('copy');
                document.body.removeChild(textArea);
            } catch (err) {
                console.error('[KTree] ExecCommand copy failed:', err);
            }
        }

        if (success) {
            showToast(successMsg);
        } else {
            showToast('[提醒] 複製失敗，請手動選取文字');
        }
    }

    // Convert relative URL to full canonical URL with anchor
    function getFullAnchorUrl(relUrl, anchorId) {
        const cleanRel = (relUrl || '').replace(/^\.\.\//, '');
        const base = `${SITE_BASE_URL}/${cleanRel}`;
        if (!anchorId) return base;
        return `${base}#${encodeURIComponent(anchorId)}`;
    }

    // Generate Markdown for CoT export
    function buildMarkdown(data, mode) {
        const lines = [];
        if (mode === 'stress_test') {
            lines.push('# 【凜冬將至 (Winter Is Coming) 深度邏輯壓力測試與極端宏觀推演指令】');
            lines.push('> 角色設定：你是一位兼具全球宏觀對沖基金首席策略師與主權財富基金首席風控官角色的反駁推演專家（Red Team Reviewer）。');
            lines.push('> 任務目標：針對以下 Mason Yang Blog《凜冬將至 (Winter Is Coming)》2026 季度思考鏈架構，進行嚴苛的邏輯審查、跨市場傳導矛盾排查與黑天鵝流動性踩踏壓力測試。');
            lines.push('> **溯源查證指引**：各論點標題均附帶原始研報內文之【段落直達連結】。當審查具體量化模型（如 10Y UST 5.02%、核心 PCE 4.2%、GLI -$450B、科技前瞻 PE 38x 負 ERP、DRAM 雙季跌、SaaS 45x 崩至 15x ARR、實體金現貨溢價）時，請點擊超連結前往原始研報對應章節進行事實查核 (Fact-Checking)。\n');
            lines.push('## 審查指引：');
            lines.push('1. **美債定價中樞 vs 科技高估值**：檢驗當十年期美債收益率站穩 5.0% 且隱含股權風險溢價 (ERP) 轉負時，巨頭擁擠交易瓦解的傳導速度與幅度。');
            lines.push('2. **股債金幣四殺與被動去槓桿**：在單周全球流動性淨流出 4,500 億美元的極端踩踏情境下，避險與風險資產同跌的流動性枯竭傳導路徑是否存在反轉關鍵閥值？');
            lines.push('3. **半導體做空週期與記憶體崩盤**：AI 基礎設施資本開支能否有效延緩通用存儲庫存出清與終端需求萎縮？做空時點是否存在被擠壓風險？');
            lines.push('4. **一二級估值嚴重倒掛與流動性抽水**：Pre-IPO 獨角獸 50%-65% 二級折價拋售對一級 VC/PE 的資本召回 (Capital Call) 枯竭傳導鏈與最後逃命窗口期判定。\n');
            lines.push('---');
        } else {
            lines.push(`# 【凜冬將至 (Winter Is Coming)】季度論點思考鏈 (${data.quarter || '2026-Q2'})`);
            lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-winter-is-coming.html)');
            lines.push(`> 匯出時間：${data.generated_at || '2026-09-08'} | 模式：${mode === 'concise' ? '精簡論點模式' : '完整階層樹模式 (含章節直達鏈接)'}\n`);
        }

        const dimTitles = {
            'I': 'Phase I：宏觀底層與定價錨重設 (通膨陷阱、美債崩盤與金價洗盤博弈)',
            'II': 'Phase II：估值崩解與極端擁擠清算 (股債金幣四殺潰敗與美股估值極限)',
            'III': 'Phase III：板塊狙擊與資產重構戰略 (記憶體半導體做空、黃金終極防守與一級倒掛逃命)'
        };

        const articlesByDim = {};
        (data.articles || []).forEach(art => {
            const dim = art.dimension || 'I';
            if (!articlesByDim[dim]) articlesByDim[dim] = [];
            articlesByDim[dim].push(art);
        });

        Object.keys(dimTitles).forEach(dim => {
            const dimName = dimTitles[dim];
            const articles = articlesByDim[dim] || [];
            lines.push(`\n## ${dimName}`);

            articles.forEach((art, idx) => {
                const statusSymbol = art.status === 'verified' ? '[已驗證]' : '[待觀察]';
                const artFullUrl = getFullAnchorUrl(art.url, '');
                lines.push(`\n### ${idx + 1}. [${art.date}] [${art.title}](${artFullUrl})`);
                lines.push(`- **發布日期**：${art.date}`);
                lines.push(`- **論點狀態**：${statusSymbol} ${art.status}`);
                if (art.indicators) {
                    lines.push(`- **關鍵指標**：${art.indicators}`);
                }
                lines.push(`- **核心結論**：${art.core_conclusion}`);

                if (mode === 'detailed' || mode === 'stress_test') {
                    if (art.h2_pillars && art.h2_pillars.length > 0) {
                        lines.push('- **論證階層 (H2 / H3 骨幹與原文查證連結)**：');
                        art.h2_pillars.forEach((p, pIdx) => {
                            const pUrl = getFullAnchorUrl(art.url, p.id);
                            lines.push(`  - [${pIdx + 1}] [${p.title}](${pUrl})`);
                            (p.h3_details || []).forEach(h3 => {
                                const h3Url = getFullAnchorUrl(art.url, h3.id);
                                lines.push(`    - [${h3.title}](${h3Url})`);
                            });
                        });
                    }
                }
            });
        });

        if (mode === 'stress_test') {
            lines.push('\n---\n');
            lines.push('## 請開始你的審查與反駁推演：');
            lines.push('請直接輸出：');
            lines.push('1. **【最核心致命盲點 (Top 3 Blindspots)】**');
            lines.push('2. **【跨市場傳導矛盾對照表 (Transmission Discrepancy Matrix)】**');
            lines.push('3. **【2026-2027 年最具殺傷力的黑天鵝流動性踩踏情境推演】**');
            lines.push('4. **【逃命與資產重構非對稱避險策略優化建議】**');
        }

        return lines.join('\n');
    }

    function attachAccordionListeners() {
        // 卡片層級展開/收折
        document.querySelectorAll('.ktree-article-card').forEach(card => {
            const header = card.querySelector('.ktree-article-header');
            const body = card.querySelector('.ktree-article-body');
            const icon = card.querySelector('.ktree-icon');

            if (!header || !body) return;

            header.addEventListener('click', function (e) {
                if (e.target.closest('a') || e.target.closest('.ktree-toggle-btn')) return;

                const isOpen = body.classList.contains('is-open');
                if (!isOpen) {
                    body.classList.add('is-open');
                    if (icon) icon.classList.add('rotate-180');
                } else {
                    body.classList.remove('is-open');
                    if (icon) icon.classList.remove('rotate-180');
                }
            });

            const toggleBtn = card.querySelector('.ktree-toggle-btn');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const isOpen = body.classList.contains('is-open');
                    if (!isOpen) {
                        body.classList.add('is-open');
                        if (icon) icon.classList.add('rotate-180');
                    } else {
                        body.classList.remove('is-open');
                        if (icon) icon.classList.remove('rotate-180');
                    }
                });
            }
        });

        // H2 支柱點擊展開/收折 H3 細節
        document.querySelectorAll('.ktree-pillar-node').forEach(pNode => {
            const pHeader = pNode.querySelector('.ktree-pillar-header');
            const subContainer = pNode.querySelector('.ktree-h3-container');
            const subIcon = pNode.querySelector('.ktree-subicon');

            if (pHeader && subContainer) {
                pHeader.addEventListener('click', function (e) {
                    if (e.target.closest('a') || e.target.closest('.ktree-anchor-action')) return;
                    e.stopPropagation();
                    const isOpen = subContainer.classList.contains('is-open');
                    if (!isOpen) {
                        subContainer.classList.add('is-open');
                        if (subIcon) subIcon.classList.add('rotate-180');
                    } else {
                        subContainer.classList.remove('is-open');
                        if (subIcon) subIcon.classList.remove('rotate-180');
                    }
                });
            }
        });

        // 複製段落直達連結
        document.querySelectorAll('.ktree-copy-anchor-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const url = this.getAttribute('data-url');
                const label = this.getAttribute('data-label') || '章節段落';
                if (url) {
                    copyToClipboard(url, `已複製【${label}】直達連結至剪貼簿！`);
                }
            });
        });
    }

    // Toggle All Sections
    function toggleAll(expand) {
        const bodies = document.querySelectorAll('.ktree-article-body');
        const icons = document.querySelectorAll('.ktree-icon');
        const subContainers = document.querySelectorAll('.ktree-h3-container');
        const subIcons = document.querySelectorAll('.ktree-subicon');

        bodies.forEach(b => {
            if (expand) b.classList.add('is-open');
            else b.classList.remove('is-open');
        });
        icons.forEach(i => {
            if (expand) i.classList.add('rotate-180');
            else i.classList.remove('rotate-180');
        });
        subContainers.forEach(s => {
            if (expand) s.classList.add('is-open');
            else s.classList.remove('is-open');
        });
        subIcons.forEach(si => {
            if (expand) si.classList.add('rotate-180');
            else si.classList.remove('rotate-180');
        });

        isAllExpanded = expand;
        const toggleBtn = document.getElementById('btn-tree-toggle-all');
        if (toggleBtn) {
            const textEl = document.getElementById('btn-tree-toggle-text');
            if (textEl) {
                textEl.textContent = expand ? '收折全部章節' : '展開全部章節';
            }
        }
    }

    // 全域高亮跳轉
    window.ktreeHighlight = function (artId) {
        if (!artId) return;
        // 兼容 ktree-article-[id] 與 ktree-[id]
        const target = document.getElementById(`ktree-article-${artId}`) || document.getElementById(`ktree-${artId}`);
        if (!target) return;

        const body = target.querySelector('.ktree-article-body');
        const icon = target.querySelector('.ktree-icon');
        if (body && !body.classList.contains('is-open')) {
            body.classList.add('is-open');
            if (icon) icon.classList.add('rotate-180');
        }

        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('ring-2', 'ring-cyan-400', 'shadow-cyan-500/20');
        setTimeout(() => {
            target.classList.remove('ring-2', 'ring-cyan-400', 'shadow-cyan-500/20');
        }, 2400);
    };

    // CoT Studio 終端預覽視窗管理
    function setupCotStudio() {
        let currentMode = 'detailed';
        const codeEl = document.getElementById('cot-preview-code');
        const statsEl = document.getElementById('cot-preview-stats');
        const btnCopy = document.getElementById('btn-cot-copy');

        function updatePreview(mode) {
            currentMode = mode;
            if (!treeData) return;
            const md = buildMarkdown(treeData, mode);
            if (codeEl) {
                codeEl.textContent = md;
            }
            if (statsEl) {
                const lines = md.split('\n').length;
                const chars = md.length;
                statsEl.textContent = `${lines} 行 | ${chars.toLocaleString()} 字元 | 完整錨點相容`;
            }

            // 更新按鈕樣式
            document.querySelectorAll('.btn-cot-mode').forEach(b => {
                const bMode = b.getAttribute('data-mode');
                if (bMode === mode) {
                    b.classList.remove('bg-slate-800', 'text-slate-300', 'border-slate-700');
                    b.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/50', 'font-bold');
                } else {
                    b.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/50', 'font-bold');
                    b.classList.add('bg-slate-800', 'text-slate-300', 'border-slate-700');
                }
            });
        }

        document.querySelectorAll('.btn-cot-mode').forEach(btn => {
            btn.addEventListener('click', function () {
                const mode = this.getAttribute('data-mode');
                updatePreview(mode);
            });
        });

        if (btnCopy) {
            btnCopy.addEventListener('click', function () {
                if (!treeData) return;
                const md = buildMarkdown(treeData, currentMode);
                const modeNames = {
                    'concise': '精簡論點模式',
                    'detailed': '完整階層樹模式',
                    'stress_test': '紅隊壓力測試 Prompt'
                };
                copyToClipboard(md, `已成功複製【${modeNames[currentMode] || currentMode}】思考鏈至剪貼簿！`);
            });
        }

        // 初始化預設模式
        updatePreview('detailed');
    }

    // 吸頂導航 Scrollspy
    function setupScrollspy() {
        const sections = [
            document.getElementById('section-macro-context'),
            document.getElementById('section-master-matrix'),
            document.getElementById('section-actionable-strategy'),
            document.getElementById('section-cot-studio')
        ].filter(Boolean);

        const navPills = document.querySelectorAll('#sticky-series-nav .nav-pill');
        if (sections.length === 0 || navPills.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 180;
            let activeId = '';

            sections.forEach(sec => {
                if (sec.offsetTop <= scrollPos) {
                    activeId = sec.id;
                }
            });

            navPills.forEach(pill => {
                const href = pill.getAttribute('href') || '';
                if (href === `#${activeId}`) {
                    pill.classList.add('active');
                } else {
                    pill.classList.remove('active');
                }
            });
        }, { passive: true });
    }

    // 初始化流程
    document.addEventListener('DOMContentLoaded', function () {
        const dataScript = document.getElementById('topic-tree-data');
        if (dataScript) {
            try {
                treeData = JSON.parse(dataScript.textContent);
            } catch (err) {
                console.error('[KTree] Failed to parse #topic-tree-data JSON:', err);
            }
        }

        attachAccordionListeners();

        const toggleAllBtn = document.getElementById('btn-tree-toggle-all');
        if (toggleAllBtn) {
            toggleAllBtn.addEventListener('click', () => {
                toggleAll(!isAllExpanded);
            });
        }

        setupCotStudio();
        setupScrollspy();
    });
})();
