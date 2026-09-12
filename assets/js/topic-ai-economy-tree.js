/**
 * topic-ai-economy-tree.js
 * 一體化研報階層矩陣 (Unified Master Matrix) 與 AI 思考鏈研究工作台 (CoT Studio)
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
            toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs sm:text-sm font-medium border border-violet-500/50 shadow-2xl backdrop-blur-md transition-all duration-300 opacity-0 translate-y-4 pointer-events-none flex items-center gap-2 font-noto';
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

    // Generate Markdown for CoT export with Deep Anchor Links
    function buildMarkdown(data, mode) {
        const lines = [];
        if (mode === 'stress_test') {
            lines.push('# 【AI 經濟系列研報 深度邏輯壓力測試與矛盾推演指令】');
            lines.push('> 角色設定：你是一位兼具華爾街一級半導體/能源產業頂級分析師與頂尖分散式系統架構師角色的反駁推演專家（Red Team Reviewer）。');
            lines.push('> 任務目標：針對以下 Mason Yang Blog《AI 算力與機器經濟 (AI Economy)》2026 季度思考鏈架構，進行嚴苛的邏輯審查、跨維度矛盾點標記與極端黑天鵝假設壓力測試。');
            lines.push('> **溯源查證指引**：各論點標題均附帶原始研報內文之【段落直達連結】。當審查具體量化模型（如 160 週變壓器交期、70% 稼動率門檻、FERC 裁決、TCO 拆解）時，請點擊超連結前往原始研報對應章節進行事實查核 (Fact-Checking)。\n');
            lines.push('## 審查指引：');
            lines.push('1. **假設真實性**：檢驗 500kV 變壓器交期 (160週)、800+ TWh 電網缺口與 70% 稼動率門檻是否存在過度線性外推？');
            lines.push('2. **跨篇邏輯衝突**：比較『維度 I（實體電網硬約束）』與『維度 II（5,000億私募信貸擴張）』之間是否存在嚴重的履約與流動性錯配？');
            lines.push('3. **最脆弱假說**：指出系列報告中最容易被科技迭代（如超算架構突破或自研 ASIC 降本）推翻的 3 個核心立論，並給出最強反駁依據。\n');
            lines.push('---');
        } else {
            lines.push(`# 【AI 算力與機器經濟 (AI Economy)】季度論點思考鏈 (${data.quarter || '2026-Q3'})`);
            lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-ai-economy.html)');
            lines.push(`> 匯出時間：${data.generated_at || '2026-09-08'} | 模式：${mode === 'concise' ? '精簡論點模式' : '完整階層樹模式 (含章節直達鏈接)'}\n`);
        }

        const dimTitles = {
            'I': '維度 I：物理邊界、能源電網與硬核資產定價',
            'II': '維度 II：金融化演進、資本開支與流動性傳導',
            'III': '維度 III：機器自主經濟、支付協議與 Web4 架構'
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
                const dateLine = art.updated_at 
                    ? `- **發布日期**：${art.date} | **更新日期**：${art.updated_at}`
                    : `- **發布日期**：${art.date}`;
                lines.push(dateLine);
                lines.push(`- **論點狀態**：${statusSymbol} ${art.status}`);
                if (art.indicators) {
                    lines.push(`- **核心指標**：${art.indicators}`);
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
            lines.push('2. **【跨篇指標矛盾對照表 (Discrepancy Matrix)】**');
            lines.push('3. **【2026 下半年最具殺傷力的黑天鵝情境推演】**');
        }

        return lines.join('\n');
    }

    function attachAccordionListeners() {
        // 初始化時清理初始 HTML 的 hidden class，交由 CSS .ktree-article-body / .ktree-h3-container 的 max-height 驅動
        document.querySelectorAll('.ktree-article-body.hidden').forEach(el => {
            el.classList.remove('hidden');
        });
        document.querySelectorAll('.ktree-h3-container.hidden').forEach(el => {
            el.classList.remove('hidden');
        });

        // 1. 卡片層級展開/收折（header 容器統一委派）
        document.querySelectorAll('.ktree-article-card').forEach(card => {
            const header = card.querySelector('.ktree-article-header');
            const body = card.querySelector('.ktree-article-body');
            const icon = card.querySelector('.ktree-icon');

            if (!header || !body) return;

            header.addEventListener('click', function (e) {
                // 如果點擊的是全文跳轉鏈接或按鈕，不干擾
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

            // 確保 toggle 按鈕單獨點擊時也正常
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

        // 2. H2 支柱點擊展開/收折 H3 細節
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

        // 3. 複製段落連結按鈕
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
            targetCard.classList.add('ring-2', 'ring-violet-500');
            setTimeout(() => {
                targetCard.classList.remove('ring-2', 'ring-violet-500');
            }, 2400);
        }
    };

    // Setup Anchor Jump with Auto-Expand & Highlight
    function setupAnchorJump() {
        document.querySelectorAll('a[href^="#ktree-"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href').substring(1);
                const artId = targetId.replace('ktree-', '');
                e.preventDefault();
                window.ktreeHighlight(artId);
            });
        });
    }

    // Setup Exporter Buttons & Live Terminal Preview
    function setupExporters(data) {
        const btnConcise = document.getElementById('btn-copy-concise');
        const btnDetailed = document.getElementById('btn-copy-detailed');
        const btnStress = document.getElementById('btn-copy-stress');
        const btnToggleAll = document.getElementById('btn-tree-toggle-all');
        const previewCode = document.getElementById('cot-preview-code');
        const previewFilename = document.getElementById('cot-preview-filename');
        const previewMeta = document.getElementById('cot-preview-meta');

        const modeBtns = [
            { btn: btnConcise, mode: 'concise', file: 'cot-concise.md', name: '精簡論點模式' },
            { btn: btnDetailed, mode: 'detailed', file: 'cot-detailed-tree.md', name: '完整論點樹模式' },
            { btn: btnStress, mode: 'stress_test', file: 'cot-stress-prompt.md', name: '壓力測試 Prompt' }
        ];

        function activateMode(selectedMode, copy = true) {
            const currentItem = modeBtns.find(m => m.mode === selectedMode) || modeBtns[0];
            const md = buildMarkdown(data, currentItem.mode);

            // 更新按鈕樣式高亮
            modeBtns.forEach(item => {
                if (!item.btn) return;
                if (item.mode === selectedMode) {
                    item.btn.classList.add('ring-2', 'ring-cyan-400');
                } else {
                    item.btn.classList.remove('ring-2', 'ring-cyan-400');
                }
            });

            // 更新預覽視窗
            if (previewCode) {
                previewCode.textContent = md;
            }
            if (previewFilename) {
                previewFilename.textContent = `terminal: ${currentItem.file}`;
            }
            if (previewMeta) {
                previewMeta.textContent = `mode: ${currentItem.mode} | chars: ${md.length.toLocaleString()}`;
            }

            if (copy) {
                copyToClipboard(md, `已成功複製【${currentItem.name}】思考鏈（共 ${md.length.toLocaleString()} 字）至剪貼簿！`);
            }
        }

        modeBtns.forEach(item => {
            if (item.btn) {
                item.btn.addEventListener('click', () => {
                    activateMode(item.mode, true);
                });
            }
        });

        // 初始載入預覽
        activateMode('concise', false);

        if (btnToggleAll) {
            btnToggleAll.addEventListener('click', () => {
                toggleAll(!isAllExpanded);
            });
        }
    }

    // Setup Sticky Navigator Scrollspy & Smooth Scroll
    function setupStickyScrollspy() {
        const navContainer = document.getElementById('sticky-series-nav');
        if (!navContainer) return;
        const pills = navContainer.querySelectorAll('.nav-pill');
        if (!pills || pills.length === 0) return;

        const sectionIds = ['section-macro-context', 'section-master-matrix', 'section-actionable-strategy', 'section-cot-studio'];
        const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

        function updateActivePill() {
            const scrollY = window.scrollY || window.pageYOffset;
            const threshold = scrollY + 180;
            let currentId = '';

            for (let i = 0; i < sections.length; i++) {
                const sec = sections[i];
                const top = sec.offsetTop;
                if (top <= threshold) {
                    currentId = sec.id;
                }
            }

            if (currentId) {
                pills.forEach(pill => {
                    const href = pill.getAttribute('href') || '';
                    if (href === `#${currentId}`) {
                        pill.classList.add('active');
                    } else {
                        pill.classList.remove('active');
                    }
                });
            }
        }

        window.addEventListener('scroll', updateActivePill, { passive: true });
        updateActivePill();
    }

    // Init function
    function init() {
        const dataEl = document.getElementById('topic-tree-data');
        if (!dataEl) return;
        try {
            treeData = JSON.parse(dataEl.textContent);
        } catch (e) {
            console.error('[KTree] Failed to parse JSON data:', e);
            return;
        }

        attachAccordionListeners();
        setupAnchorJump();
        setupExporters(treeData);
        setupStickyScrollspy();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
