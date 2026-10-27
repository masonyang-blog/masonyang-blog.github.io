/**
 * topic-gold-currency-tree.js
 * 黃金與貨幣危機 (Gold & Currency Crisis) 研報階層矩陣與 AI 思考鏈研究工作台 (CoT Studio)
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
            toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs sm:text-sm font-medium border border-amber-500/50 shadow-2xl backdrop-blur-md transition-all duration-300 opacity-0 translate-y-4 pointer-events-none flex items-center gap-2 font-noto';
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
            lines.push('# 【黃金與貨幣危機 深度邏輯壓力測試與極端宏觀推演指令】');
            lines.push('> 角色設定：你是一位兼具主權基金外匯儲備首席架構師與大宗商品宏觀對沖基金負責人角色的反駁推演專家（Red Team Reviewer）。');
            lines.push('> 任務目標：針對以下 Mason Yang Blog《黃金與貨幣危機 (Gold & Currency Crisis)》2026 季度思考鏈架構，進行嚴苛的邏輯審查、跨市場傳導矛盾排查與黑天鵝流動性踩踏壓力測試。');
            lines.push('> **溯源查證指引**：各論點標題均附帶原始研報內文之【段落直達連結】。當審查具體量化模型（如 42 條量化數據、AISC $2,100 成本地板、沃許衝擊 35 bps、原油 $112 二次通膨、央行千噸購金）時，請點擊超連結前往原始研報對應章節進行事實查核 (Fact-Checking)。\n');
            lines.push('## 審查指引：');
            lines.push('1. **實質利率約束 vs 央行購金**：檢驗當美國十年期實質利率跳升時，央行去美元化戰略儲備購金是否足以完全脫鉤利率壓制？');
            lines.push('2. **紙黃金爆倉與基差風險**：在 COMEX 期貨單日名義清算劇震下，實體現貨高溢價能否有效隔絕流動性擠兌？');
            lines.push('3. **AISC 成本地板有效性**：全球金礦邊際成本 $2,100/oz 在極端強勢美元與通縮踩踏情境下，是否存在短期被擊穿的下行風險？\n');
            lines.push('---');
        } else {
            lines.push(`# 【黃金與貨幣危機 (Gold & Currency Crisis)】季度論點思考鏈 (${data.quarter || '2026-Q2'})`);
            lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-gold-currency-crisis.html)');
            lines.push(`> 匯出時間：${data.generated_at || '2026-09-08'} | 模式：${mode === 'concise' ? '精簡論點模式' : '完整階層樹模式 (含章節直達鏈接)'}\n`);
        }

        const dimTitles = {
            'I': 'Phase I：初見端倪與跨市場共振 (沃許衝擊、能源悖論與資產聯動)',
            'II': 'Phase II：數據還原與週期診斷 (42 項量化指標與 AISC 成本地板)',
            'III': 'Phase III：終局戰略部署 (大跌洗盤反向確認 5,000 美元目標位)'
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
            lines.push('3. **【2026-2030 年最具殺傷力的黑天鵝情境推演】**');
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
            if (textEl) textEl.textContent = expand ? '收折全部章節' : '展開全部章節';
            else toggleBtn.textContent = expand ? '收折全部章節' : '展開全部章節';
            const iconEl = document.getElementById('btn-tree-toggle-icon');
            if (iconEl) {
                if (expand) iconEl.classList.add('rotate-180');
                else iconEl.classList.remove('rotate-180');
            }
        }
    }

    // Expose global highlight jump helper
    window.ktreeHighlight = function (artId) {
        const targetCard = document.getElementById(`ktree-${artId}`);
        if (targetCard) {
            const body = targetCard.querySelector('.ktree-article-body');
            const icon = targetCard.querySelector('.ktree-icon');
            if (body && !body.classList.contains('is-open')) {
                body.classList.add('is-open');
                if (icon) icon.classList.add('rotate-180');
            }
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            targetCard.classList.add('ring-2', 'ring-amber-500', 'ring-offset-2', 'ring-offset-slate-900');
            setTimeout(() => {
                targetCard.classList.remove('ring-2', 'ring-amber-500', 'ring-offset-2', 'ring-offset-slate-900');
            }, 2400);
        }
    };

    // Update Live Markdown Preview Box
    function updatePreviewBox(mode, text) {
        const codeEl = document.getElementById('cot-preview-code');
        const metaEl = document.getElementById('cot-preview-meta');
        const fileEl = document.getElementById('cot-preview-filename');
        if (!codeEl) return;

        codeEl.textContent = text;
        const charCount = text.length;

        if (metaEl) {
            metaEl.textContent = `mode: ${mode} | chars: ${charCount.toLocaleString()}`;
        }
        if (fileEl) {
            const fileMap = {
                'concise': 'terminal: cot-gold-concise.md',
                'detailed': 'terminal: cot-gold-detailed.md',
                'stress_test': 'terminal: cot-gold-stress-test-prompt.md'
            };
            fileEl.textContent = fileMap[mode] || 'terminal: cot-preview.md';
        }
    }

    // Setup Export Buttons & Live Preview
    function setupExportButtons(data) {
        const btnConcise = document.getElementById('btn-copy-concise');
        const btnDetailed = document.getElementById('btn-copy-detailed');
        const btnStress = document.getElementById('btn-copy-stress');

        function setMode(mode, targetBtn) {
            [btnConcise, btnDetailed, btnStress].forEach(b => {
                if (b) b.classList.remove('ring-2', 'ring-amber-400', 'ring-offset-2', 'ring-offset-slate-950');
            });
            if (targetBtn) {
                targetBtn.classList.add('ring-2', 'ring-amber-400', 'ring-offset-2', 'ring-offset-slate-950');
            }
            const md = buildMarkdown(data, mode);
            updatePreviewBox(mode, md);
            return md;
        }

        if (btnConcise) {
            btnConcise.addEventListener('click', function () {
                const md = setMode('concise', this);
                copyToClipboard(md, '已複製【精簡論點模式】思考鏈 Markdown 至剪貼簿！');
            });
        }
        if (btnDetailed) {
            btnDetailed.addEventListener('click', function () {
                const md = setMode('detailed', this);
                copyToClipboard(md, '已複製【完整階層樹模式 (含查證連結)】思考鏈至剪貼簿！');
            });
        }
        if (btnStress) {
            btnStress.addEventListener('click', function () {
                const md = setMode('stress_test', this);
                copyToClipboard(md, '已複製【紅隊壓力測試 Prompt】至剪貼簿，可直接貼給 AI 進行嚴格審查！');
            });
        }

        // 初始化預設為 concise
        setMode('concise', btnConcise);
    }

    // Sticky Series Navigator Scrollspy
    function setupScrollspy() {
        const sections = [
            { id: 'section-macro-context', pillHref: '#section-macro-context' },
            { id: 'section-master-matrix', pillHref: '#section-master-matrix' },
            { id: 'section-actionable-strategy', pillHref: '#section-actionable-strategy' },
            { id: 'section-cot-studio', pillHref: '#section-cot-studio' }
        ];

        const navPills = document.querySelectorAll('#sticky-series-nav .nav-pill');
        if (!navPills.length) return;

        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 160;
            let currentId = sections[0].id;

            for (let i = 0; i < sections.length; i++) {
                const el = document.getElementById(sections[i].id);
                if (el && el.offsetTop <= scrollPos) {
                    currentId = sections[i].id;
                }
            }

            navPills.forEach(pill => {
                const href = pill.getAttribute('href');
                if (href === `#${currentId}`) {
                    pill.classList.add('active');
                } else {
                    pill.classList.remove('active');
                }
            });
        }, { passive: true });
    }

    document.addEventListener('DOMContentLoaded', function () {
        // 讀取內嵌資料庫
        const dataEl = document.getElementById('topic-tree-data');
        if (dataEl) {
            try {
                treeData = JSON.parse(dataEl.textContent);
            } catch (e) {
                console.error('[KTree] Failed to parse #topic-tree-data JSON:', e);
            }
        }

        // 初始化手風琴
        attachAccordionListeners();

        // 綁定全局展開按鈕
        const toggleAllBtn = document.getElementById('btn-tree-toggle-all');
        if (toggleAllBtn) {
            toggleAllBtn.addEventListener('click', () => {
                toggleAll(!isAllExpanded);
            });
        }

        // 綁定導出與即時預覽
        if (treeData) {
            setupExportButtons(treeData);
        }

        // 滾動監聽
        setupScrollspy();
    });
})();
