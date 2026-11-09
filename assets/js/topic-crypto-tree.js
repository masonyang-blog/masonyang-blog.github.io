/**
 * topic-crypto-tree.js
 * 加密貨幣與 Web3 生態導讀 (Crypto & Web3 Ecosystem) 核心評測階層矩陣與 AI 思考鏈工作台 (CoT Studio)
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
            toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl bg-slate-900/95 text-white text-xs sm:text-sm font-medium border border-emerald-500/50 shadow-2xl backdrop-blur-md transition-all duration-300 opacity-0 translate-y-4 pointer-events-none flex items-center gap-2 font-noto';
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
            lines.push('# 【加密貨幣與 Web3 生態 (Crypto & Web3) 深度架構壓力測試與反駁推演指令】');
            lines.push('> 角色設定：你是一位兼具全球頂級加密對沖基金首席投資官與主權財富基金 Web3 首席風控架構師角色的反駁推演專家（Red Team Reviewer）。');
            lines.push('> 任務目標：針對以下 Mason Yang Blog《加密貨幣與 Web3 生態導讀》2026 季度思考鏈架構，進行嚴苛的邏輯審查、跨鏈傳導矛盾排查與代幣經濟學黑天鵝踩踏壓力測試。');
            lines.push('> **溯源查證指引**：各論點標題均附帶原始評測內文之【段落直達連結】。當審查具體架構（如 BTC 減半定價中樞、以太坊 L2 擴容碎片化、Solana Firedancer 並發驗證、ONDO 美債鏈上結算、Circle 合規準備金審計、Coinbase x402 機器微支付協議、TAO 子網激勵機制、GoPlus 即時防護情報網）時，請點擊超連結前往原始評測對應章節進行事實查核 (Fact-Checking)。\n');
            lines.push('## 審查指引：');
            lines.push('1. **主權儲備 vs 鏈上流動性集中度**：檢驗當各國主權基金與合規現貨 ETF 持倉集中度突破臨界點時，鏈上大額拋售與衍生品清算連環踩踏的傳導機制。');
            lines.push('2. **代幣化美債 (RWA) 與法幣合規摩擦**：在聯準會利率週期轉換情境下，代幣化美債收益率滑落對鏈上 DeFi 資金留存率的衝擊，以及受監管穩定幣黑名單凍結的抗審查底線檢視。');
            lines.push('3. **機器原生經濟與 AI Agent 支付真實度**：TAO 子網商品化市場與 Coinbase x402 機器支付協議在無許可自主交易情境下的防洗錢 (AML) 與抗 Sybil 攻擊防禦力。');
            lines.push('4. **極速單片鏈狀態膨脹與驗證者中心化**：Solana/SUI 類高並發公鏈在長週期日交易百億規模下，硬體門檻攀升對物理節點分佈與抗合謀安全性的長期考驗。\n');
            lines.push('---');
        } else {
            lines.push(`# 【加密貨幣與 Web3 生態導讀 (Crypto & Web3)】季度論點思考鏈 (${data.quarter || '2026-Q3'})`);
            lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-crypto.html)');
            lines.push(`> 匯出時間：${data.generated_at || '2026-09-08'} | 模式：${mode === 'concise' ? '精簡論點模式' : '完整階層樹模式 (含章節直達鏈接)'}\n`);
        }

        const dimTitles = {
            'I': 'Phase I：核心公鏈與價值基石 (BTC 主權儲備、ETH 智慧合約結算層、SOL 極速撮合與 BTW 比特幣 L2)',
            'II': 'Phase II：機構級 RWA、穩定幣與金融基建 (ONDO 美債上鏈、Circle USDC、Coinbase 合規託管、Chainlink 跨鏈與 Ether.fi)',
            'III': 'Phase III：機器原生經濟、去中心化 AI 與鏈上安全 (TAO 算力市場、Velvet DeFAI、Siren 代理人與 GoPlus 用戶安全網絡)'
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
            lines.push('1. **【最核心致命盲點 (Top 3 Structural Vulnerabilities)】**');
            lines.push('2. **【跨鏈傳導與流動性矛盾對照表 (Liquidity Friction Matrix)】**');
            lines.push('3. **【2026-2027 年最具殺傷力的鏈上清算與流動性踩踏情境推演】**');
            lines.push('4. **【金字塔防禦配置與非對稱下注優化建議】**');
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
        const cleanId = artId.replace(/^ktree-article-/, '').replace(/^ktree-/, '');
        const target = document.getElementById(`ktree-article-${cleanId}`)
                    || document.getElementById(`ktree-article-project-${cleanId}`)
                    || document.getElementById(`ktree-${cleanId}`)
                    || document.getElementById(artId);
        if (!target) return;

        const body = target.querySelector('.ktree-article-body');
        const icon = target.querySelector('.ktree-icon');
        if (body && !body.classList.contains('is-open')) {
            body.classList.add('is-open');
            if (icon) icon.classList.add('rotate-180');
        }

        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('ring-2', 'ring-emerald-400', 'shadow-emerald-500/20');
        setTimeout(() => {
            target.classList.remove('ring-2', 'ring-emerald-400', 'shadow-emerald-500/20');
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
                    b.classList.add('bg-emerald-500/20', 'text-emerald-300', 'border-emerald-500/50', 'font-bold');
                } else {
                    b.classList.remove('bg-emerald-500/20', 'text-emerald-300', 'border-emerald-500/50', 'font-bold');
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

    // 吸頂導航 Scrollspy (針對 topic-crypto 的六大章節)
    function setupScrollspy() {
        const sections = [
            document.getElementById('section-layer1-chains'),
            document.getElementById('section-rwa-defi'),
            document.getElementById('section-ai-crypto'),
            document.getElementById('section-topic-matrix'),
            document.getElementById('section-methodology'),
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
