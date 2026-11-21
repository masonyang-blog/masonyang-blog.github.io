/**
 * topic-winter-tree.js
 * 凜冬將至 (Winter Is Coming) 研報階層矩陣與 AI 思考鏈研究工作台 (CoT Studio)
 * Zero-Build / Pure Vanilla JS / Dark-Mode Ready / No-Emoji Style Guide Compliant
 * 
 * v3.5 - 2026/10: 支援動態輕量渲染器、多維度篩選切換、75 支柱與 137 細節全量生成
 */
(function () {
    'use strict';

    let treeData = null;
    let isAllExpanded = false;
    let currentFilterDim = 'all';
    const SITE_BASE_URL = 'https://masonyang-blog.github.io';

    // HTML / Attribute 轉義保護
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function escapeAttr(str) {
        if (!str) return '';
        return String(str).replace(/"/g, '&quot;');
    }

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
            showToast(successMsg || '已複製至剪貼簿！');
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

    // 動態客戶端渲染器 (Phase 2 核心)
    function renderKtree(data, filterDim = 'all') {
        const container = document.getElementById('ktree-container');
        if (!container || !data || !data.articles) return;

        const dimMeta = {
            'I': {
                name: 'Phase I / 宏觀底層',
                title: '宏觀底層與定價錨重設',
                badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
            },
            'II': {
                name: 'Phase II / 估值清算',
                title: '估值崩解與極端擁擠清算',
                badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-400/40'
            },
            'III': {
                name: 'Phase III / 防守重構',
                title: '板塊狙擊與資產重構戰略',
                badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
            }
        };

        const articlesByDim = { 'I': [], 'II': [], 'III': [] };
        data.articles.forEach(art => {
            const dim = art.dimension || 'I';
            if (articlesByDim[dim]) {
                articlesByDim[dim].push(art);
            }
        });

        const activeDims = filterDim === 'all' ? ['I', 'II', 'III'] : [filterDim];
        let html = '';

        activeDims.forEach(dim => {
            const articles = articlesByDim[dim] || [];
            if (articles.length === 0) return;
            const meta = dimMeta[dim];

            html += `
            <div class="ktree-dim-group mb-10" data-dim="${dim}">
                <div class="flex items-center gap-3 mb-5">
                    <span class="px-3 py-1 font-mono font-black text-xs rounded-full border shadow-sm uppercase ${meta.badgeClass}">
                        ${meta.name}
                    </span>
                    <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight font-noto">
                        ${meta.title}
                    </h3>
                    <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                </div>
                <div class="space-y-4">
            `;

            articles.forEach(art => {
                const pillars = art.h2_pillars || [];
                const pillarsCount = pillars.length;
                const detailsCount = pillars.reduce((sum, p) => sum + (p.h3_details ? p.h3_details.length : 0), 0);
                const artFullUrl = getFullAnchorUrl(art.url, '');

                html += `
                <div id="ktree-article-${art.id}" class="ktree-article-card rounded-2xl border border-slate-800 bg-slate-900 shadow-md hover:shadow-xl transition-all overflow-hidden scroll-mt-28" data-dim="${dim}">
                    <div class="ktree-article-header p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none hover:bg-slate-800/40 transition-colors" data-target="ktree-body-${art.id}">
                        <div class="flex items-center gap-3">
                            <span class="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">${art.part || 'PART 01'}</span>
                            <div>
                                <h4 class="text-sm sm:text-base font-bold text-white font-noto hover:text-cyan-300 transition-colors">${escapeHtml(art.title)}</h4>
                                <div class="text-[11px] text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-2">
                                    <span>${escapeHtml(art.category || '深度研報')} | 發布日期：${art.date}</span>
                                    <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">5月歷史存檔</span>
                                    <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">10月實證已覆核</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 self-end sm:self-center">
                            <span class="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">${pillarsCount} 支柱 / ${detailsCount} 細節</span>
                            <button type="button" class="ktree-toggle-btn p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" aria-label="展開收折">
                                <svg class="w-4 h-4 transform transition-transform duration-300 ktree-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="ktree-article-body overflow-hidden transition-all duration-300 border-t border-slate-800/80" id="ktree-body-${art.id}">
                        <div class="p-4 sm:p-6 space-y-4">
                            <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-noto space-y-1.5">
                                <div class="text-slate-300"><strong class="text-cyan-400 font-bold">核心結論 (TL;DR)：</strong>${escapeHtml(art.core_conclusion)}</div>
                                ${art.indicators ? `<div class="text-slate-400"><strong class="text-slate-300 font-bold">關鍵指標支持：</strong>${escapeHtml(art.indicators)}</div>` : ''}
                                ${art.oct_evidence ? `<div class="text-cyan-300/90 pt-1 font-mono text-[11px]"><strong class="text-cyan-400 font-bold">2026/10 實證更新：</strong>${escapeHtml(art.oct_evidence)}</div>` : ''}
                            </div>
                            <div class="space-y-2 pt-2">
                                <div class="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                                    <span>論證骨幹 (H2 支柱與 H3 細節)</span>
                                    <a href="${artFullUrl}" class="text-cyan-400 hover:underline inline-flex items-center gap-1 text-[11px]">進入原文閱讀全文 →</a>
                                </div>
                                <div class="space-y-2">
                `;

                pillars.forEach((p, pIdx) => {
                    const h3List = p.h3_details || [];
                    const h3Count = h3List.length;
                    const pUrl = getFullAnchorUrl(art.url, p.id);

                    html += `
                    <div class="ktree-pillar-node rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 sm:p-4 hover:border-slate-700 transition-colors">
                        <div class="ktree-pillar-header flex items-center justify-between gap-3 cursor-pointer select-none">
                            <div class="flex items-center gap-2.5 min-w-0">
                                <span class="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60 shrink-0">${pIdx + 1}</span>
                                <h5 class="text-xs sm:text-sm font-bold text-slate-200 font-noto truncate hover:text-cyan-300 transition-colors">${escapeHtml(p.title)}</h5>
                            </div>
                            <div class="flex items-center gap-2 shrink-0 ktree-anchor-action">
                                ${h3Count > 0 ? `<span class="text-[11px] font-mono text-slate-400 hidden sm:inline-block">${h3Count} 細節</span>` : ''}
                                <button type="button" class="ktree-copy-anchor-btn text-[10px] font-mono text-cyan-400 hover:text-white px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50 hover:border-cyan-400 transition-all"
                                    data-url="${pUrl}" data-label="${escapeAttr(p.title)}">
                                    複製錨點
                                </button>
                                <a href="${pUrl}" class="text-[10px] font-mono text-slate-400 hover:text-cyan-300 transition-colors">原文 ↗</a>
                                ${h3Count > 0 ? `
                                <svg class="w-3.5 h-3.5 text-slate-400 transform transition-transform duration-300 ktree-subicon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                                ` : ''}
                            </div>
                        </div>
                        ${h3Count > 0 ? `
                        <div class="ktree-h3-container overflow-hidden space-y-1.5 pl-4 sm:pl-6 pt-2">
                            ${h3List.map(h3 => {
                                const h3Url = getFullAnchorUrl(art.url, h3.id);
                                return `
                                <div class="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/60 transition-colors">
                                    <span class="text-slate-300 font-noto truncate max-w-[85%]">${escapeHtml(h3.title)}</span>
                                    <div class="flex items-center gap-2 shrink-0">
                                        <button type="button" class="ktree-copy-anchor-btn text-[10px] font-mono text-cyan-400 hover:text-white px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50 hover:border-cyan-400 transition-all"
                                            data-url="${h3Url}" data-label="${escapeAttr(h3.title)}">
                                            複製錨點
                                        </button>
                                        <a href="${h3Url}" class="text-[10px] font-mono text-slate-400 hover:text-cyan-300 transition-colors">直達 ↗</a>
                                    </div>
                                </div>
                                `;
                            }).join('')}
                        </div>
                        ` : ''}
                    </div>
                    `;
                });

                html += `
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            });

            html += `
                </div>
            </div>
            `;
        });

        container.innerHTML = html;

        // 重新綁定事件
        attachAccordionListeners();

        // 若當前處於全局展開狀態，同步還原展開樣式
        if (isAllExpanded) {
            toggleAll(true);
        }
    }

    function attachAccordionListeners() {
        // 卡片層級展開/收折
        document.querySelectorAll('.ktree-article-card').forEach(card => {
            const header = card.querySelector('.ktree-article-header');
            const body = card.querySelector('.ktree-article-body');
            const icon = card.querySelector('.ktree-icon');

            if (!header || !body) return;

            // 避免重複綁定
            if (header._bound) return;
            header._bound = true;

            header.addEventListener('click', function (e) {
                if (e.target.closest('a') || e.target.closest('.ktree-toggle-btn') || e.target.closest('.ktree-copy-anchor-btn')) return;

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
            if (toggleBtn && !toggleBtn._bound) {
                toggleBtn._bound = true;
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

            if (pHeader && subContainer && !pHeader._bound) {
                pHeader._bound = true;
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
            if (btn._bound) return;
            btn._bound = true;
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

        // 若當前處於單一維度篩選且該文章被隱藏，自動重置為 'all'
        if (currentFilterDim !== 'all' && treeData && treeData.articles) {
            const targetArt = treeData.articles.find(a => a.id === artId);
            if (targetArt && targetArt.dimension !== currentFilterDim) {
                applyFilter('all');
            }
        }

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

    // 維度切換篩選管理
    function applyFilter(dim) {
        currentFilterDim = dim;
        document.querySelectorAll('.btn-ktree-filter').forEach(btn => {
            const bDim = btn.getAttribute('data-dim');
            const isActive = bDim === dim;
            if (isActive) {
                btn.className = 'btn-ktree-filter px-2.5 py-1 rounded text-xs font-mono transition-all bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm';
            } else {
                btn.className = 'btn-ktree-filter px-2.5 py-1 rounded text-xs font-mono transition-all text-slate-400 hover:text-slate-200';
            }
        });

        if (treeData) {
            renderKtree(treeData, dim);
        }
    }

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
        // 優先從外置資料庫模組載入 (Zero-Build SSOT)
        if (window.TOPIC_WINTER_COT_DATA) {
            treeData = window.TOPIC_WINTER_COT_DATA;
        } else {
            const dataScript = document.getElementById('topic-tree-data');
            if (dataScript) {
                try {
                    treeData = JSON.parse(dataScript.textContent);
                } catch (err) {
                    console.error('[KTree] Failed to parse #topic-tree-data JSON:', err);
                }
            }
        }

        // 綁定篩選按鈕
        document.querySelectorAll('.btn-ktree-filter').forEach(btn => {
            btn.addEventListener('click', function () {
                const dim = this.getAttribute('data-dim') || 'all';
                applyFilter(dim);
            });
        });

        // 綁定全局展開/收折
        const toggleAllBtn = document.getElementById('btn-tree-toggle-all');
        if (toggleAllBtn) {
            toggleAllBtn.addEventListener('click', () => {
                toggleAll(!isAllExpanded);
            });
        }

        // 渲染動態樹
        if (treeData) {
            renderKtree(treeData, 'all');
        }

        // 啟動工作台其他功能
        setupCotStudio();
        setupScrollspy();
    });
})();
