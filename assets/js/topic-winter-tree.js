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

    // Generate Markdown for CoT export (v3.0 - 2026/10 覆核實證版)
    function buildMarkdown(data, mode) {
        const lines = [];
        const quarter = data.quarter || '2026-Q4';
        const generatedAt = data.generated_at || '2026-10-12';

        if (mode === 'stress_test') {
            lines.push('# 【凜冬將至 (Winter Is Coming) v3.0 深度邏輯壓力測試與極端宏觀推演指令 (2026/10 覆核版)】');
            lines.push('> **角色設定**：你是一位兼具全球宏觀對沖基金首席策略師、主權財富基金首席風控官與極端情境量化推演專家角色的反駁推演審查長（Red Team Chief Reviewer）。');
            lines.push('> **任務目標**：針對以下 Mason Yang Blog《凜冬將至 (Winter Is Coming)》全系列 7 篇研報之思考鏈架構與 2026 年 10 月最新清算實證數據，進行極致嚴苛的因果邏輯審查、跨市場傳導矛盾排查與黑天鵝流動性踩踏壓力測試。');
            lines.push('> **溯源查證指引**：各論點標題均附帶原始研報內文之【段落直達連結】。當審查具體量化模型（如 30Y UST 5.66%、聯邦負債 40.25 兆、淨利息支出 1.052 兆、GLI -$450B、科技前瞻 PE 28.5x 負 ERP、DRAM 跌價 18%、SaaS 估值暴跌至 12x-15x、實體金現貨溢價與 Q3 淨流入 310 億）時，請點擊超連結前往原始研報對應章節進行事實查核 (Fact-Checking)。\n');
            lines.push('## 核心宏觀錨與 2026/10 覆核實證基準：');
            lines.push('- **無風險定價錨失控**：美國聯邦債務突破 40.25 兆美元，年度淨利息支出年化突破 1.052 兆美元；30 年期美債殖利率突破 5.66%，10 年期美債站穩 5.0%+；債券市場波動率指數 (MOVE) 突破 113，無風險定價錨失控引發跨資產深層解耦。');
            lines.push('- **公共滯脹成本轉嫁**：CPI 3.4% 使底層家庭實質所得連兩季負增長 (-0.3%)，工資物價螺旋失靈，由全體納稅人承擔公共滯脹代價。');
            lines.push('- **全球流動性收縮 (GLI)**：單周全球流動性淨流出突破 4,500 億美元，標普等權重與加權指數背離 1,200 基點，新低/新高股比達 4:1，股債金幣面臨無差別去槓桿抽水。');
            lines.push('- **產業兩極化與 AI 資本開支反噬**：科技前瞻 PE 回落至 19.0x 但巨頭獲利仍達 28.5x；AI 能源供電剛需使核電 (CEG +12.25%) 與公用事業 (XLU +2.98%) 享 20 年 PPA 特許溢價；然而 HBM3E 對晶圓產能 3:1 物理排擠，通用 DRAM/NAND 跌價 12%-18%（板塊遠期 PE 壓縮至 17.1x 創撕裂新低）。');
            lines.push('- **一級市場與 SaaS 估值雪崩**：Forge 數據確認前 10 大獨角獸中位數折價 -79.4%；AI 席位替代效應致 SaaS ARR 倍數由 45x 崩至 12x-15x（未盈利軟體僅 6.5x-8.2x）；SpaceX 400 億美元融資形成嚴重流動性抽血。');
            lines.push('- **實體黃金現貨溢價與主權自保**：現貨金於 4,121 美元築底，Q3 實體黃金 ETF 單季淨流入創紀錄 310 億美元（持倉達 4,256 噸）；全球央行前三季購金破 680 噸，89% 儲備經理看增黃金，代幣化黃金 RWA 突破 50 億美元。\n');
            lines.push('## 紅隊反駁與審查指引：');
            lines.push('1. **美債定價中樞 vs 科技高估值**：檢驗當十年期美債收益率站穩 5.0%、30 年期美債達 5.66% 且隱含股權風險溢價 (ERP) 轉負時，巨頭擁擠交易瓦解與 AI 資本開支 ROI 遞減的傳導速度與幅度。');
            lines.push('2. **股債金幣四殺與被動去槓桿**：在單周全球流動性淨流出 4,500 億美元的極端踩踏情境下，避險資產（黃金、美債）與風險資產同遭保證金追加清洗的臨界閾值判定。');
            lines.push('3. **半導體做空週期與記憶體崩盤**：AI 基礎設施天價資本支出能否有效延緩通用存儲庫存出清與終端需求萎縮？半導體結構性分化週期中做空時點是否存在反向擠壓風險？');
            lines.push('4. **一二級估值嚴重倒掛與流動性抽水**：Pre-IPO 獨角獸中位數 -79.4% 折價拋售對一級 VC/PE 的資本召回 (Capital Call) 枯竭傳導鏈與最後逃命窗口期判定。');
            lines.push('5. **實體黃金主權定價與貨幣信用重構**：央行不計價購金與現貨溢價是否能在全球貨幣體系再通膨或主權信用受損時提供超越傳統宏觀週期的抗脆弱保護？\n');
            lines.push('---');
        } else if (mode === 'detailed') {
            lines.push(`# 【凜冬將至 (Winter Is Coming)】全系列研報階層樹思考鏈 (${quarter} / 10月覆核版)`);
            lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-winter-is-coming.html)');
            lines.push(`> 匯出時間：${generatedAt} | 模式：完整階層樹模式 (含章節直達鏈接與 10 月覆核實證)\n`);
        } else {
            lines.push(`# 【凜冬將至 (Winter Is Coming)】季度核心論點思考鏈 (${quarter} / 10月覆核版)`);
            lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-winter-is-coming.html)');
            lines.push(`> 匯出時間：${generatedAt} | 模式：精簡論點模式 (含核心結論與 10 月覆核實證)\n`);
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
                if (art.oct_evidence) {
                    lines.push(`- **2026/10 覆核實證**：${art.oct_evidence}`);
                }

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
            lines.push('請基於嚴苛的宏觀邏輯與 2026/10 實證數據直接輸出：');
            lines.push('1. **【最核心致命盲點 (Top 3 Blindspots)】**：針對以上 7 篇研報核心論點，指出作者未充分考量之反向宏觀力量或潛在偽證假設。');
            lines.push('2. **【跨市場傳導矛盾對照表 (Transmission Discrepancy Matrix)】**：檢驗美債利率、黃金現貨溢價、半導體庫存、SaaS 折價與流動性抽水之間的推論衝突。');
            lines.push('3. **【2026-2027 年最具殺傷力的黑天鵝流動性踩踏情境推演】**：具體模擬觸發點、傳導骨牌、流動性清算規模與時序路徑。');
            lines.push('4. **【逃命與資產重構非對稱避險策略優化建議】**：針對公共滯脹常態化情境，提出具備極高凸性 (High Convexity) 的防禦配置方案。');
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
                    'concise': '精簡論點模式 (v3.0)',
                    'detailed': '完整階層樹模式 (v3.0)',
                    'stress_test': '紅隊壓力測試 Prompt (v3.0)'
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
            document.getElementById('section-macro-dashboard'),
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
