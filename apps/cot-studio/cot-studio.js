/**
 * apps/cot-studio/cot-studio.js
 * 思考鏈分析工作台 (Interactive CoT Studio) 核心引擎
 * 支援多主題切換、三種提示詞架構（精簡論點、完整階層樹、紅隊壓力測試）與單篇研報論點複製
 * Zero-Build / Pure Vanilla JS / Dark-Mode Ready / No-Emoji Style Guide Compliant
 */

(function () {
    'use strict';

    const SITE_BASE_URL = 'https://masonyang-blog.github.io';

    // 系統 Toast 通知
    function showToast(message, duration = 3000) {
        let toast = document.getElementById('cot-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cot-toast';
            toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl bg-slate-900/95 text-white text-xs sm:text-sm font-medium border border-teal-500/50 shadow-2xl backdrop-blur-md transition-all duration-300 opacity-0 translate-y-4 pointer-events-none flex items-center gap-2 font-mono';
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

    // 安全剪貼簿複製
    async function copyToClipboard(text, successMsg) {
        let success = false;
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                success = true;
            } catch (err) {
                console.warn('[CoT Studio] navigator.clipboard 失敗，降級至 execCommand:', err);
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
                console.error('[CoT Studio] execCommand 複製失敗:', err);
            }
        }

        if (success) {
            showToast(successMsg || '已成功複製至剪貼簿！');
        } else {
            showToast('複製失敗，請手動複製文字內容');
        }
        return success;
    }

    // 取得絕對直達連結
    function getFullAnchorUrl(relUrl, anchorId) {
        const cleanRel = (relUrl || '').replace(/^\.\.\//, '');
        const base = `${SITE_BASE_URL}/${cleanRel}`;
        if (!anchorId) return base;
        return `${base}#${encodeURIComponent(anchorId)}`;
    }

    // 專題四大跨維度連鎖審查指令 SSOT
    const TOPIC_REDTEAM_DIRECTIVES = {
        winter: [
            '1. **【美債定價中樞 vs 科技高估值】**：檢驗 10Y/30Y 美債利率高企與負股權風險溢價 (ERP) 下，巨頭獲利與 AI 資本開支 ROI 遞減傳導。',
            '2. **【股債金幣四殺與被動去槓桿】**：檢驗單周全球流動性淨流出 4,500 億美元情境下，避險資產與風險資產同遭保證金追加清洗的臨界閾值。',
            '3. **【半導體做空週期與記憶體崩盤】**：檢驗 HBM 產能排擠與通用存儲跌價 12%-18% 週期中，做空時點的反向軋空風險。',
            '4. **【一二級估值倒掛與資產重構】**：Pre-IPO 獨角獸中位數 -79.4% 折價對一級資本召回枯竭傳導鏈，以及黃金主權信用定價抗脆弱保護。'
        ],
        crypto: [
            '1. **【主權儲備集中度 vs 託管單點故障】**：檢驗 Coinbase 單一實體託管 85% 現貨 ETF 規模下，極端去槓桿拋售與託管合規審查的單點踩踏風險。',
            '2. **【L2 流動性碎片化 vs 公鏈狀態膨脹】**：檢驗以太坊 Rollup 割裂與 Solana 億級日交易狀態膨脹對長週期驗證節點與去中心化安全的考驗。',
            '3. **【代幣化美債 (RWA) 利率週期反轉】**：在降息利差收窄情境下，ONDO/USDC 收益滑落對鏈上資金留存率衝擊與穩定幣合規凍結抗審查底線。',
            '4. **【去中心化 AI 算力泡沫 vs Agent 支付】**：TAO 子網真實商業價值捕獲，對照 x402 機器微支付協議在無許可自主交易下的防女巫與 AML 防禦極限。'
        ],
        ai: [
            '1. **【變壓器交期延誤 vs ASC 360 減損】**：檢驗 500kV 變壓器 160 週交期超晶片迭代週期下，稼動率跌破 70% 損益線觸發資本減損的臨界閾值。',
            '2. **【私募信貸高槓桿斷裂與 GPU 殘值】**：3 年矽基壽命 vs 8 年信貸久期錯配下，二手 GPU 折價 40%-60% 與 35% 非標基差對千億信貸的違約溢出效應。',
            '3. **【模型效能突破與能耗分流悖論】**：演算法能耗降 90% 與端側推理普及，究竟刺激總算力需求指數爆發，抑或過早刺破吉瓦級數據中心建設泡沫。',
            '4. **【自主 Agent 授權安全與機器商務】**：Google AP2 雙向 ZK 密碼學開銷與 x402 協議在應對高頻微交易女巫攻擊與廣域網 MFU 崩跌時的清算熔斷機制。'
        ],
        gold: [
            '1. **【實質利率高企 vs 央行購金非經濟買盤】**：美債實質收益率 2.5%+ 下，新興央行去美元化購金能否持續抵禦高息法幣資產拋壓，及去美元化飽和點。',
            '2. **【地緣能源通膨溢價消退與商品踩踏】**：若荷姆茲危機降溫原油回落，通膨預期降溫對金價實質購買力地板的侵蝕幅度與五大資產共振逆轉風險。',
            '3. **【紙黃金去槓桿 vs 實體交割擠兌】**：COMEX 投機多頭驟降與期現溢價 $45/oz 下，紐約/倫敦金庫交割能力極限與紙黃金/實體黃金定價脫鉤風險。',
            '4. **【數位黃金分流與 AISC 成本支撐】**：比特幣主權儲備化對實體黃金配置替代效應，及金礦 AISC $2,100/oz 成本地板在流動性通縮崩盤時的剛性支撐。'
        ]
    };

    // 核心 CoT Studio 控制器
    class CoTStudioController {
        constructor() {
            this.currentTopic = 'winter';
            this.currentMode = 'stress_test'; // 預設紅隊模式，機構實戰性最高
            this.currentFilter = 'all';
            this.datasets = {};
            this.currentPrompt = '';
        }

        init() {
            this.loadDatasets();
            if (typeof window !== 'undefined' && window.location) {
                const urlParams = new URLSearchParams(window.location.search);
                const topicParam = urlParams.get('topic');
                if (topicParam && this.datasets[topicParam]) {
                    this.currentTopic = topicParam;
                    this.currentFilter = topicParam;
                }
            }
            this.bindEvents();
            this.updateTopicUI(this.currentTopic);
            this.updatePrompt();
            this.renderArticlesMatrix(this.currentFilter);
            this.renderFullHierarchyArchive(this.currentFilter);
        }

        loadDatasets() {
            // 優先從全域資料模組讀取 (Zero-Build / UMD)
            if (typeof window !== 'undefined' && window.TOPIC_WINTER_COT_DATA) {
                this.datasets.winter = window.TOPIC_WINTER_COT_DATA;
            } else {
                const winterScript = document.getElementById('dataset-winter');
                if (winterScript) {
                    try {
                        this.datasets.winter = JSON.parse(winterScript.textContent);
                    } catch (e) {
                        console.error('[CoT Studio] 解析 winter 資料失敗:', e);
                    }
                }
            }

            if (typeof window !== 'undefined' && window.TOPIC_CRYPTO_COT_DATA) {
                this.datasets.crypto = window.TOPIC_CRYPTO_COT_DATA;
            } else {
                const cryptoScript = document.getElementById('dataset-crypto');
                if (cryptoScript) {
                    try {
                        this.datasets.crypto = JSON.parse(cryptoScript.textContent);
                    } catch (e) {
                        console.error('[CoT Studio] 解析 crypto 資料失敗:', e);
                    }
                }
            }

            if (typeof window !== 'undefined' && window.TOPIC_AI_ECONOMY_COT_DATA) {
                this.datasets.ai = window.TOPIC_AI_ECONOMY_COT_DATA;
            } else {
                const aiScript = document.getElementById('dataset-ai');
                if (aiScript) {
                    try {
                        this.datasets.ai = JSON.parse(aiScript.textContent);
                    } catch (e) {
                        console.error('[CoT Studio] 解析 ai 資料失敗:', e);
                    }
                }
            }

            if (typeof window !== 'undefined' && window.TOPIC_GOLD_COT_DATA) {
                this.datasets.gold = window.TOPIC_GOLD_COT_DATA;
            } else {
                const goldScript = document.getElementById('dataset-gold');
                if (goldScript) {
                    try {
                        this.datasets.gold = JSON.parse(goldScript.textContent);
                    } catch (e) {
                        console.error('[CoT Studio] 解析 gold 資料失敗:', e);
                    }
                }
            }
        }

        bindEvents() {
            // 主題切換按鈕
            document.querySelectorAll('[data-topic-target]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const topic = btn.getAttribute('data-topic-target');
                    if (topic && this.datasets[topic]) {
                        this.currentTopic = topic;
                        this.updateTopicUI(topic);
                        this.updatePrompt();
                        // 同步聯動文章矩陣篩選
                        this.setMatrixFilter(topic);
                    }
                });
            });

            // 模式切換按鈕
            document.querySelectorAll('[data-mode-target]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const mode = btn.getAttribute('data-mode-target');
                    if (mode) {
                        this.currentMode = mode;
                        this.updateModeUI(mode);
                        this.updatePrompt();
                    }
                });
            });

            // 一鍵複製 Prompt
            const copyBtn = document.getElementById('btn-copy-prompt');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    if (this.currentPrompt) {
                        copyToClipboard(this.currentPrompt, '已成功複製思考鏈 (CoT) 提示詞至剪貼簿！');
                    }
                });
            }

            // 下載 Markdown 檔案
            const downloadBtn = document.getElementById('btn-download-prompt');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => {
                    this.downloadPromptMarkdown();
                });
            }

            // 矩陣分類篩選按鈕
            document.querySelectorAll('.matrix-filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.getAttribute('data-filter-target') || 'all';
                    this.setMatrixFilter(filter);
                });
            });

            // 批次展開 / 收合所有論點樹
            const expandAllBtn = document.getElementById('btn-expand-all-cards');
            if (expandAllBtn) {
                expandAllBtn.addEventListener('click', () => this.toggleAllTrees(true));
            }
            const collapseAllBtn = document.getElementById('btn-collapse-all-cards');
            if (collapseAllBtn) {
                collapseAllBtn.addEventListener('click', () => this.toggleAllTrees(false));
            }

            // 批次展開 / 收合底端階層樹檔案庫
            const expandAllArchiveBtn = document.getElementById('btn-expand-all-archive');
            if (expandAllArchiveBtn) {
                expandAllArchiveBtn.addEventListener('click', () => this.toggleAllArchiveTrees(true));
            }
            const collapseAllArchiveBtn = document.getElementById('btn-collapse-all-archive');
            if (collapseAllArchiveBtn) {
                collapseAllArchiveBtn.addEventListener('click', () => this.toggleAllArchiveTrees(false));
            }

            // 批次按最新時間倒序複製全部文章論點
            const copyAllArchiveBtn = document.getElementById('btn-copy-all-archive-chrono');
            if (copyAllArchiveBtn) {
                copyAllArchiveBtn.addEventListener('click', () => this.copyAllArchiveChrono());
            }
        }

        setMatrixFilter(filter) {
            this.currentFilter = filter;
            this.renderArticlesMatrix(filter);
            this.renderFullHierarchyArchive(filter);
        }

        toggleAllTrees(expand) {
            document.querySelectorAll('.card-tree-body').forEach(body => {
                body.classList.toggle('hidden', !expand);
            });
            document.querySelectorAll('.card-tree-icon').forEach(icon => {
                icon.classList.toggle('rotate-180', expand);
            });
            showToast(expand ? '已展開所有卡片之論點階層樹' : '已收合所有卡片之論點階層樹');
        }

        toggleAllArchiveTrees(expand) {
            document.querySelectorAll('.archive-tree-body').forEach(body => {
                body.classList.toggle('hidden', !expand);
            });
            document.querySelectorAll('.archive-tree-icon').forEach(icon => {
                icon.classList.toggle('rotate-180', expand);
            });
            showToast(expand ? '已展開所有專題之階層樹目錄' : '已收合所有專題之階層樹目錄');
        }

        updateTopicUI(activeTopic) {
            document.querySelectorAll('[data-topic-target]').forEach(btn => {
                const isMatch = btn.getAttribute('data-topic-target') === activeTopic;
                btn.classList.toggle('bg-teal-600', isMatch);
                btn.classList.toggle('text-white', isMatch);
                btn.classList.toggle('shadow-md', isMatch);
                btn.classList.toggle('shadow-teal-500/20', isMatch);
                btn.classList.toggle('bg-slate-800/80', !isMatch);
                btn.classList.toggle('text-slate-300', !isMatch);
                btn.classList.toggle('border-slate-700/60', !isMatch);
            });
            // 更新主題說明標籤
            const topicBadge = document.getElementById('cot-active-topic-title');
            if (topicBadge && this.datasets[activeTopic]) {
                topicBadge.textContent = this.datasets[activeTopic].title || activeTopic;
            }
        }

        updateModeUI(activeMode) {
            document.querySelectorAll('[data-mode-target]').forEach(btn => {
                const isMatch = btn.getAttribute('data-mode-target') === activeMode;
                btn.classList.toggle('border-teal-500', isMatch);
                btn.classList.toggle('bg-teal-500/15', isMatch);
                btn.classList.toggle('text-teal-300', isMatch);
                btn.classList.toggle('shadow-sm', isMatch);
                btn.classList.toggle('shadow-teal-500/10', isMatch);
                btn.classList.toggle('border-slate-700/80', !isMatch);
                btn.classList.toggle('bg-slate-900/90', !isMatch);
                btn.classList.toggle('text-slate-400', !isMatch);
            });
        }

        formatStressThesisLine(art, topicKey) {
            let title = (art.title || art.full_title || art.id).trim();
            if (title.startsWith('【') && title.includes('】')) {
                title = title.slice(1, title.indexOf('】')).replace(/（[^）]+）/g, '').replace(/\s*2026.*/, '').trim();
            } else if (title.includes('：')) {
                title = title.split('：')[0].trim();
            } else if (title.includes(' - ')) {
                title = title.split(' - ')[0].trim();
            }
            const url = getFullAnchorUrl(art.url, '');
            let cc = (art.core_conclusion || '').trim();
            let ind = (art.indicators || '').trim();

            if (!cc) {
                if (art.id === 'project-btc') cc = '主權儲備佈局與減半成本支撐，Coinbase 託管 85% 衍生品清算踩踏風險。';
                else if (art.id === 'project-eth') cc = 'L2 Rollup 導致流動性碎片化與排序器中心化，Staking 收益觸碰天花板。';
                else if (art.id === 'project-sol') cc = 'PoH 極速並發實現高 TPS，但億級日交易狀態膨脹威脅去中心化底線。';
                else if (art.id === 'project-tao') cc = '子網算力競爭驅動去中心化 AI，但實用轉化率低且面臨代幣通膨稀釋。';
                else if (art.id === 'project-ondo') cc = '代幣化美債受降息利差收窄衝擊，合規穩定幣黑名單摩擦考驗抗審查底線。';
                else cc = '核心架構指標與論證細節詳見原文剖析。';
            }

            const maxCC = (topicKey === 'ai') ? 60 : (topicKey === 'crypto') ? 65 : 85;
            const maxInd = (topicKey === 'ai') ? 30 : (topicKey === 'crypto') ? 32 : 45;

            if (cc.length > maxCC) {
                const sentences = cc.split('。').filter(Boolean);
                if (sentences[0].length >= 35 && sentences[0].length <= maxCC) {
                    cc = sentences[0] + '。';
                } else {
                    cc = cc.slice(0, maxCC - 2) + '...';
                }
            }

            let line = `- [${title}](${url})：${cc}`;
            if (ind) {
                let shortInd = ind.length > maxInd ? ind.slice(0, maxInd - 2) + '...' : ind;
                line += ` [指標: ${shortInd}]`;
            }
            return line;
        }

        buildStressTestPrompt(data, topicKey) {
            const lines = [];
            const count = (data.articles || []).length;
            const topicTitle = data.title || data.topic || '專題研報';
            lines.push(`# 【${topicTitle} 深度邏輯壓力測試與極端推演指令 (2026 實證版)】`);
            lines.push(`> **角色設定**：你是一位兼具宏觀對沖基金首席策略師與量化風控架構師角色的反駁推演審查長（Red Team Chief Reviewer）。`);
            lines.push(`> **任務目標**：針對以下全系列 ${count} 篇研報之多維思考鏈網絡，進行因果邏輯審查、傳導矛盾排查與黑天鵝流動性踩踏壓力測試。`);
            lines.push(`> **查證指引**：各篇標題附帶直達連結，點擊可前往原始研報進行事實查核 (Fact-Checking)。\n`);
            lines.push(`## 專題多維互補論點網絡 (Cross-Dimensional Thesis Network)：`);

            const dimMap = {};
            (data.articles || []).forEach(art => {
                const dim = art.dimension || 'I';
                if (!dimMap[dim]) dimMap[dim] = [];
                dimMap[dim].push(art);
            });

            Object.keys(dimMap).forEach(dim => {
                lines.push(`\n### Dimension ${dim} 互補矩陣：`);
                dimMap[dim].forEach(art => {
                    lines.push(this.formatStressThesisLine(art, topicKey));
                });
            });

            lines.push(`\n## 請開始四大跨維度連鎖審查與反駁推演：`);
            (TOPIC_REDTEAM_DIRECTIVES[topicKey] || []).forEach(dir => lines.push(dir));

            return lines.join('\n');
        }

        buildPrompt() {
            const data = this.datasets[this.currentTopic];
            if (!data) return '# 資料載入中...';

            const mode = this.currentMode;
            if (mode === 'stress_test') {
                return this.buildStressTestPrompt(data, this.currentTopic);
            }

            const lines = [];
            const quarter = data.quarter || '2026-Q4';
            const generatedAt = data.generated_at || '2026-10-12';

            if (this.currentTopic === 'winter') {
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
                } else if (mode === 'concise') {
                    lines.push(`# 【凜冬將至 (Winter Is Coming)】季度核心論點思考鏈 (${quarter} / 10月覆核版)`);
                    lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-winter-is-coming.html)');
                    lines.push(`> 匯出時間：${generatedAt} | 模式：精簡論點模式 (含核心結論與 10 月覆核實證)\n`);
                } else {
                    lines.push(`# 【凜冬將至 (Winter Is Coming)】季度思考鏈 (${quarter})`);
                    lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-winter-is-coming.html)');
                    lines.push(`> 匯出時間：${generatedAt} | 模式：自訂模式\n`);
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

                        if (mode === 'detailed') {
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
            } else if (this.currentTopic === 'crypto') {
                // Crypto 主題
                if (mode === 'stress_test') {
                    lines.push('# 【加密貨幣與 Web3 生態 (Crypto & Web3) 深度架構壓力測試與反駁推演指令 (2026 最新實證版)】');
                    lines.push('> **角色設定**：你是一位兼具全球頂級加密對沖基金首席投資官 (CIO)、主權財富基金 Web3 首席風控架構師與去中心化系統安全審查長角色的反駁推演專家（Red Team Chief Reviewer）。');
                    lines.push('> **任務目標**：針對以下 Mason Yang Blog《加密貨幣與 Web3 生態導讀》全系列 13 篇研報之思考鏈架構與 2026 最新鏈上實證數據，進行極致嚴苛的密碼學共識審查、跨鏈跨協議傳導矛盾排查與代幣經濟學黑天鵝踩踏壓力測試。');
                    lines.push('> **溯源查證指引**：各論點標題均附帶原始評測內文之【段落直達連結】。當審查具體架構（如 BTC 減半定價中樞、以太坊 L2 擴容碎片化、Solana Firedancer 並發驗證、ONDO 美債鏈上結算、Circle 合規準備金審計、Coinbase x402 機器微支付協議、TAO 子網激勵機制、GoPlus 即時防護情報網）時，請點擊超連結前往原始評測對應章節進行事實查核 (Fact-Checking)。\n');
                    lines.push('## 核心架構錨與 2026 最新實證基準：');
                    lines.push('- **BTC 價值儲備中樞與機構託管集中度**：比特幣減半後邊際生產成本墊高底層價值防線，各國主權戰略儲備與現貨 ETF 加速佈局；但 Coinbase 單一實體託管全球超 85% 現貨 ETF 資產，衍生品未平倉合約 (OI) 屢創新高，形成巨大中心化託管與極端行情下的連續清算踩踏單點故障風險；BTCFi 跨鏈清算面臨無對手盤與門限簽名 (FROST) 多簽安全邊界。');
                    lines.push('- **以太坊 L2 碎片化 vs 極速單片鏈狀態膨脹**：以太坊模組化 Rollup 導致全網流動性碎片化與排序器 (Sequencer) 中心化；Solana PoH/Firedancer 與單片鏈實現高 TPS 極致效能，但日交易億級規模導致狀態膨脹 (State Bloat) 激增，驗證節點硬體門檻飆升威脅去中心化底線；Base 鏈日交易量破千萬筆但高度依賴中心化維運。');
                    lines.push('- **代幣化美債 (RWA) 收益滑落與穩定幣合規摩擦**：Ondo (USDY) 將美債收益鏈上化，Circle (USDC) 依賴 580 億美元國債儲備利差；在宏觀降息週期下，RWA 收益優勢收窄，資本面臨回流傳統金融或重入高風險 DeFi 的分水嶺；合規穩定幣發行方黑名單凍結權限與各國監管法規摩擦，考驗鏈上抗審查與金融主權底線。');
                    lines.push('- **機器原生經濟與 AI Agent 支付 (x402)**：Bittensor (TAO) 2026 子網競爭驅動分散式算力市場，但面臨商品化實用率與代幣釋放通膨壓力；Coinbase x402 機器微支付協議重構 HTTP 402 實現 Agent 原生自主結算；GoPlus (GPS) 模組化用戶安全網絡日均調用破 3,000 萬次，保護 Agent 自主交易免受智慧合約漏洞與 Sybil 女巫攻擊。\n');
                    lines.push('## 紅隊反駁與審查指引：');
                    lines.push('1. **主權儲備集中度 vs 託管單點故障**：檢驗當各國主權基金與現貨 ETF 持倉規模突破臨界點，而單一機構託管集中度突破 85% 時，一旦遭遇合規制裁、密鑰外洩或大額去槓桿拋售，鏈上流動性抽乾與衍生品踩踏的連環傳導機制。');
                    lines.push('2. **L2 流動性碎片化 vs 高並發公鏈狀態膨脹**：在以太坊模組化分工導致流動性割裂與跨鏈橋風險頻發的背景下，Solana 等單片鏈在長週期日交易百億規模下，硬體門檻攀升與狀態膨脹對物理節點分佈與抗審查安全的長期考驗。');
                    lines.push('3. **代幣化美債 (RWA) 利率週期反轉與穩定幣擠兌**：在利率週期轉換與美債利差收窄情境下，代幣化美債收益率滑落對鏈上 DeFi 資金留存率的衝擊，以及受監管穩定幣在極端贖回壓力下的法幣通道摩擦與黑名單凍結抗審查底線。');
                    lines.push('4. **去中心化 AI 算力泡沫 vs 機器 Agent 原生支付防禦力**：Bittensor TAO 子網競爭之真實商業價值捕獲與算力效率，對照 Coinbase x402 機器支付協議在無許可自主交易情境下的防洗錢 (AML) 審查、抗 Sybil 攻擊與代碼即法律之防禦極限。\n');
                    lines.push('---');
                } else if (mode === 'detailed') {
                    lines.push(`# 【加密貨幣與 Web3 生態導讀 (Crypto & Web3)】全系列架構階層樹思考鏈 (${quarter})`);
                    lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-crypto.html)');
                    lines.push(`> 匯出時間：${generatedAt} | 模式：完整階層樹模式 (含章節直達鏈接)\n`);
                } else if (mode === 'concise') {
                    lines.push(`# 【加密貨幣與 Web3 生態導讀 (Crypto & Web3)】季度核心論點思考鏈 (${quarter})`);
                    lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-crypto.html)');
                    lines.push(`> 匯出時間：${generatedAt} | 模式：精簡論點模式 (含核心結論與架構指標)\n`);
                } else {
                    lines.push(`# 【加密貨幣與 Web3 生態導讀 (Crypto & Web3)】季度思考鏈 (${quarter})`);
                    lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-crypto.html)');
                    lines.push(`> 匯出時間：${generatedAt} | 模式：自訂模式\n`);
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
                        lines.push(`- **評測狀態**：${statusSymbol} ${art.status}`);
                        if (art.indicators) {
                            lines.push(`- **關鍵指標**：${art.indicators}`);
                        }
                        if (art.core_conclusion) {
                            lines.push(`- **核心結論**：${art.core_conclusion}`);
                        }

                        if (mode === 'detailed') {
                            if (art.h2_pillars && art.h2_pillars.length > 0) {
                                lines.push('- **架構階層 (H2 / H3 支柱與查證連結)**：');
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
                    lines.push('請基於嚴苛的密碼學共識、鏈上代幣經濟學與流動性傳導直接輸出：');
                    lines.push('1. **【最核心致命盲點 (Top 3 Architecture Blindspots)】**：針對以上 13 篇研報核心架構論點，指出作者未充分考量之中心化單點故障、清算黑天鵝或代幣經濟學偽需求假設。');
                    lines.push('2. **【跨協議清算與對手盤踩踏對照表 (Protocol Contagion & Liquidation Matrix)】**：檢驗 RWA、衍生品、L2 與主鏈在極端脫錨或流動性枯竭情境下的抗脆弱防禦能力。');
                    lines.push('3. **【機器原生經濟與自主 Agent 黑天鵝情境推演】**：具體模擬 x402 微支付被惡意循環攻擊、TAO 子網算力合謀作惡、或智慧合約安全防禦失效時的連鎖清算反應。');
                    lines.push('4. **【機構級 Web3 資產配置與對稱避險策略優化建議】**：針對宏觀利率波動、監管法規收緊與技術升級分叉情境，提供具備極高凸性 (High Convexity) 的非對稱鏈上避險與資產配置方案。');
                }
            } else if (this.currentTopic === 'ai') {
                // AI 算力與機器經濟主題
                if (mode === 'stress_test') {
                    lines.push('# 【AI 算力與機器經濟 (AI Economy) 深度物理與金融傳導壓力測試與反駁推演指令 (2026 最新實證版)】');
                    lines.push('> **角色設定**：你是一位兼具矽谷頂級 AI 基礎設施首席架構師、華爾街能源與半導體量化風控總監與主權 AI 經濟學專家角色的反駁推演審查長（Red Team Chief Reviewer）。');
                    lines.push('> **任務目標**：針對以下 Mason Yang Blog《AI 算力與機器經濟導讀》全系列 12 篇研報之思考鏈架構與 2026 最新物理量化模型、金融傳導指標，進行極致嚴苛的能源物理極限檢驗、算力金融化定價反思與自主代理人經濟傳導壓力測試。');
                    lines.push('> **溯源查證指引**：各論點標題均附帶原始評測內文之【段落直達連結】。當審查具體量化模型（如 500kV 變壓器 160 週交期延宕、1,024 卡 H100 TCO、70% 稼動率減損死線、CORZ/IREN 礦企 $0.038/kWh PPA 電價、Rubin 架構 3.6TB/s NVLink、CME 算力期貨 35% 非標基差、火花套利 Spark Spread、私募信貸 12%-15% 高息夾層、OpenAI 年化燒錢 50 億美元與星門超算、SpaceX 2,000 億 IPO 被動抽水 180 億、Google AP2 雙向 ZK 協議、Web4 EIP-7702 意圖交易、x402 機器微支付協議）時，請點擊超連結前往原始評測對應章節進行事實查核 (Fact-Checking)。\n');
                    lines.push('## 核心宏觀錨與 2026 最新實證基準：');
                    lines.push('- **物理邊界與 Time-to-Power 陷阱**：500kV 變壓器 160 週交期延宕打破吉瓦級數據中心擴張幻想；70% 稼動率為資產減損死線；投機解碼、MoE 與 Prefill-Decode 使每百萬 Token 能耗下降 90% 並推動負載轉向中壓配電網消納；NVIDIA Rubin 架構與 3.6TB/s NVLink 頻寬觸發傑文斯悖論（Jevons Paradox），加速算力期貨大宗商品化；CORZ、IREN 等比特幣礦企以 $0.038/kWh 低價 PPA 與 2.4GW 併網容量成為能源新霸主，推動估值乘數由 EV/Hashrate 轉向 EV/MW。');
                    lines.push('- **資本開支反噬、私募信貸泡沫與久期錯配**：單一叢集 1,024 卡 H100 TCO 達 4,200 萬美元；私募信貸為 GPU 融資提供 12%-15% 高息夾層資本，面臨 3 年矽基易耗壽命 vs 5 至 8 年信貸久期錯配，以及二手 GPU 市場折價 40%-60% 之流動性枯竭風險；散熱與供電非標化造成 35% 性能基差，觸發 ASC 360 資本支出減損暴雷；超大規模雲端商高額合約擔保下的表外融資面臨再融資違約風險。');
                    lines.push('- **算力美元化、火花套利與科技巨頭流動性抽血**：NVIDIA GPU 作為新型實體抵押品重構資產定價，CME 算力期貨與火花套利 (Spark Spread to Compute) 定義跨國電價底線；OpenAI「星門」千億超算年化燒錢超 50 億美元對 Oracle 與微軟雲端收入形成資本反噬；SpaceX 2,000 億美元歷史級 IPO 造成全球被動指數基金強制重平衡抽水超 180 億美元，引發科技巨頭流動性踩踏與系統性估值反噬。');
                    lines.push('- **機器原生商務、自主支付 (x402) 與架構瓶頸**：Google AP2 協議奠定雙向零知識證明 (ZK) 授權標準；EIP-7702 帳戶抽象與 Anoma 意圖網路重塑自主結算；但廣域網 (WAN) 10~50ms 延遲使前沿模型 DePIN 張量並行 MFU 跌至個位數，且 AP2 密碼學開銷面臨能耗反噬；Stripe、Coinbase 與 Circle 推動 x402 協議與 ERC-4337，實現單筆 < $0.0001 微支付年增 1,200%，構成百萬 Agent 原生經濟底座。\n');
                    lines.push('## 紅隊反駁與審查指引：');
                    lines.push('1. **變壓器交期延誤 vs 摩爾定律折舊 (ASC 360 減損風險)**：檢驗當 500kV 變壓器交付等待期長達 160 週超過晶片迭代週期時，稼動率跌破 70% 損益平衡線的傳導速度，以及資本支出減損 (ASC 360) 觸發破產重整的臨界閾值。');
                    lines.push('2. **私募信貸高槓桿斷裂與 GPU 抵押品流動性枯竭**：在 3 年硬體折舊久期對抗 5 至 8 年信貸久期背景下，當二手 GPU 市場折價達 40%-60% 且算力期貨基差擴大時，千億私募信貸夾層融資違約對華爾街資產負債表的溢出效應。');
                    lines.push('3. **模型效能突破 (MoE/投機解碼) 與能耗分流悖論**：演算法能耗節省 90% 與端側邊緣推理普及，究竟是依傑文斯悖論刺激總算力需求指數爆發，抑或是過早刺破特高壓吉瓦級數據中心的產能超前建設泡沫？');
                    lines.push('4. **自主 Agent 授權安全邊界與機器商務防禦極限**：Google AP2 雙向 ZK 協議與 Coinbase x402 機器支付協議在應對高頻微交易女巫攻擊、智能體幻覺循環調用、廣域網 MFU 崩跌與跨鏈反洗錢合規時的防禦底線與清算熔斷機制。\n');
                    lines.push('---');
                } else if (mode === 'detailed') {
                    lines.push(`# 【AI 算力與機器經濟 (AI Economy)】全系列架構階層樹思考鏈 (${quarter})`);
                    lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-ai-economy.html)');
                    lines.push(`> 匯出時間：${generatedAt} | 模式：完整階層樹模式 (含章節直達鏈接)\n`);
                } else if (mode === 'concise') {
                    lines.push(`# 【AI 算力與機器經濟 (AI Economy)】季度核心論點思考鏈 (${quarter})`);
                    lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-ai-economy.html)');
                    lines.push(`> 匯出時間：${generatedAt} | 模式：精簡論點模式 (含核心結論與架構指標)\n`);
                } else {
                    lines.push(`# 【AI 算力與機器經濟 (AI Economy)】季度思考鏈 (${quarter})`);
                    lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-ai-economy.html)');
                    lines.push(`> 匯出時間：${generatedAt} | 模式：自訂模式\n`);
                }

                const dimTitles = {
                    'I': 'Phase I：物理邊界、能源電網與硬核資產定價 (變壓器交期、1,024卡 TCO、礦企轉型與 Rubin 架構)',
                    'II': 'Phase II：金融化演進、資本開支與流動性傳導 (GPU 期貨、火花套利、信貸泡沫、OpenAI 財務與 SpaceX 估值)',
                    'III': 'Phase III：自主代理、機器商務與鏈上結算 (Google AP2 協議、Web4 智慧網絡與 AI Agent 經濟體系)'
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
                        const artTitle = art.title || art.full_title || art.id;
                        const artFullUrl = getFullAnchorUrl(art.url, '');
                        lines.push(`\n### ${idx + 1}. [${art.date}] [${artTitle}](${artFullUrl})`);
                        lines.push(`- **發布日期**：${art.date}`);
                        lines.push(`- **評測狀態**：${statusSymbol} ${art.status || 'verified'}`);
                        if (art.indicators) {
                            lines.push(`- **關鍵指標**：${art.indicators}`);
                        }
                        if (art.core_conclusion) {
                            lines.push(`- **核心結論**：${art.core_conclusion}`);
                        }

                        if (mode === 'detailed') {
                            if (art.h2_pillars && art.h2_pillars.length > 0) {
                                lines.push('- **論證階層 (H2 / H3 支柱與查證連結)**：');
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
                    lines.push('請基於嚴苛的能源物理限制、金融估值模型與自主代理人商務傳導直接輸出：');
                    lines.push('1. **【最核心致命盲點 (Top 3 Infrastructure Blindspots)】**：針對以上 12 篇研報核心物理與金融架構論點，指出作者在電力變壓器交付、算力供給、私募信貸久期錯配或機器商務普及率未充分考量之反向力量與脆弱假設。');
                    lines.push('2. **【能源電網 vs 晶片算力物理矛盾對照表 (Power Grid vs Compute Bottleneck Matrix)】**：檢驗電網互連佇列、160 週變壓器瓶頸、冷卻散熱物理限制與半導體製程演進間的推論衝突與現實約束。');
                    lines.push('3. **【2026-2027 年 AI 資本開支斷崖與信貸清算情境推演 (CapEx Cliff & Credit Contagion Trajectory)】**：具體模擬 OpenAI 巨額虧損溢出、SpaceX 2,000 億 IPO 流動性抽血、GPU 二手殘值崩盤與千億私募信貸違約骨牌的連鎖清算路徑。');
                    lines.push('4. **【抗脆弱算力資產配置與避險策略建議 (Anti-Fragile Compute Asset Allocation)】**：針對低電價 PPA 能源硬資產 (CORZ/IREN)、NVIDIA Rubin 架構、軟體 Agent 原生商務 (AP2/x402) 提出具備極高凸性 (High Convexity) 的非對稱保護配置方案。');
                }
            } else if (this.currentTopic === 'gold') {
                // 黃金與法幣信用主題
                if (mode === 'stress_test') {
                    lines.push('# 【黃金與法幣信用 (Gold & Currency Crisis) 深度主權信用與貨幣體系壓力測試指令 (2026 最新實證版)】');
                    lines.push('> **角色設定**：你是一位兼具主權央行外匯儲備管理者、全球跨資產宏觀對沖基金大宗商品主管與貨幣體系主權信用風控專家角色的反駁推演審查長（Red Team Chief Sovereign Gold & Currency Reviewer）。');
                    lines.push('> **任務目標**：針對以下 Mason Yang Blog《黃金、法幣與信用危機》全系列 5 篇研報之思考鏈架構與 2026 最新實證數據，進行極致嚴苛的實質利率定價機制檢驗、跨資產聯動矛盾排查與央行去美元化儲備極限壓力測試。');
                    lines.push('> **溯源查證指引**：各論點標題均附帶原始研報內文之【段落直達連結】。當審查具體量化模型（如 實質利率飆升 35 bps、荷姆茲海峽原油破 $112、川普 TACO 關稅 42 項指標、COMEX 紙黃金清算 vs 實體 $45 溢價、全球金礦 AISC $2,100 成本地板、央行連續 3 年購金千噸、沃許衝擊與 $5,000 目標位）時，請點擊超連結前往原始研報對應章節進行事實查核 (Fact-Checking)。\n');
                    lines.push('## 核心宏觀錨與 2026 最新實證基準：');
                    lines.push('- **實質利率飆升、沃許衝擊與紙黃金清算洗盤**：凱文·沃許接掌聯準會引發強烈鷹派升息預期，十年期美債實質利率單日跳升 35 bps，COMEX 黃金期貨單日名義清算規模創歷史次高，投機槓桿多頭集中爆倉引爆短線跌破 $5,000 心理關口；然而中東荷姆茲海峽地緣能源危機推動原油突破 $85，徹底打破通膨受控幻覺，原油反彈與高 PPI 數據迅速重置金價實質購買力定價地板。');
                    lines.push('- **荷姆茲地緣能源衝擊與五大資產跨市場共振**：地緣封鎖推升布蘭特原油狂飆突破 $112/桶，傳統負相關資產定價模型徹底失效。美元指數與金價罕見同漲，美元流動性虹吸指數攀升至 104.5 高位；比特幣逆勢大漲 12% 且與黃金避險連動係數跳升至 0.62，展現數位硬資產屬性；全球流動性因通膨黏性與能源成本衝擊，加速向以實體黃金為首之抗通膨核心實體資產與主權戰略儲備聚集。');
                    lines.push('- **川普 TACO 關稅博弈與 42 項宏觀指標底線**：川普全面性 TACO 關稅政策擾動全球供應鏈並逆轉市場通膨預期，引發短線流動性恐慌拋售；但 42 項底層量化指標顯示，COMEX 期貨投機淨多頭部位單周驟降 28% 達成充分去槓桿，實體金條現貨對期貨溢價創出 $45/oz 歷史新高，證實紙黃金爆倉並未動搖實體需求，反向構築非對稱反彈配置的最佳流動性窗口。');
                    lines.push('- **多極化央行戰略購金與 AISC 成本剛性地板**：拉長至五年維度，全球南方央行年化購金規模連續三年突破 1,000 噸，主權去美元化儲備配置比例從 14% 邁向 25%，黃金定價徹底從大宗商品轉向主權安全信用屬性，打破傳統實質利率負相關模型；疊加全球金礦 AISC 綜合維持成本中樞上移至 $2,100/oz 形成剛性下檔物理地板，確立 2026-2030 年挑戰 $6,000+ 美元之歷史級超級週期。');
                    lines.push('- **終局洗盤、沃許緊縮反噬與 $5,000 新常態防線**：金價回撤 16% 在 $4,600 美元獲得歷史級籌碼支撐，確認為超級週期中關鍵「終局洗盤」；央行現貨實體化提貨率年增 42%，機構重倉持倉佔比重回 18 個月高點；沃許貨幣緊縮預期難解美國 36 兆美元國債利息螺旋支出，法幣信用赤字反向驗證實體黃金作為全球終極價值錨與貨幣體系最後防線，目標堅定指向 $5,000 美元技術突破與定價常態化。\n');
                    lines.push('## 紅隊反駁與審查指引：');
                    lines.push('1. **實質利率中樞高企 vs 央行購金非經濟性買盤邊際**：當十年期美債實質收益率維持在 2.5%+ 高位且聯準會鷹派立場堅挺時，檢驗新興市場央行儲備去美元化購金規模能否持續抵禦私人部門資金轉向高息無風險法幣資產的拋售壓力，以及去美元化飽和點的量化測算。');
                    lines.push('2. **地緣能源通膨溢價消退與商品流動性踩踏**：在中東荷姆茲危機降溫、原油從 $112 回落至 $70 區間情境下，因通膨預期降溫與供應鏈修復對金價「實質購買力地板」的侵蝕幅度，以及五大資產共振逆轉引發的保證金拋售風險。');
                    lines.push('3. **紙黃金期貨去槓桿 vs 實體現貨交割擠兌極限**：當 COMEX 投機多頭單周驟降 28% 與期現溢價達 $45/oz 時，檢驗倫敦與紐約金庫在極端提貨請求下的交割能力、流動性斷裂閾值，以及紙黃金與實物黃金定價體系脫鉤的結構性法律風險。');
                    lines.push('4. **數位黃金 (BTC 0.62 相關度) 流動性分流與 AISC 成本支撐虛實**：在比特幣主權儲備化加速且具備極高鏈上結算效率背景下，新世代主權基金對實體黃金配置比例的替代效應，以及金礦 AISC $2,100/oz 成本地板在極端流動性通縮崩盤時能否真正提供剛性支撐。\n');
                    lines.push('---');
                } else if (mode === 'detailed') {
                    lines.push(`# 【黃金、法幣與信用危機 (Gold & Currency Crisis)】全系列架構階層樹思考鏈 (${quarter})`);
                    lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-gold-currency-crisis.html)');
                    lines.push(`> 匯出時間：${generatedAt} | 模式：完整階層樹模式 (含章節直達鏈接)\n`);
                } else if (mode === 'concise') {
                    lines.push(`# 【黃金、法幣與信用危機 (Gold & Currency Crisis)】季度核心論點思考鏈 (${quarter})`);
                    lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-gold-currency-crisis.html)');
                    lines.push(`> 匯出時間：${generatedAt} | 模式：精簡論點模式 (含核心結論與架構指標)\n`);
                } else {
                    lines.push(`# 【黃金、法幣與信用危機 (Gold & Currency Crisis)】季度思考鏈 (${quarter})`);
                    lines.push('> 來源：Mason Yang Blog (https://masonyang-blog.github.io/post/topic-gold-currency-crisis.html)');
                    lines.push(`> 匯出時間：${generatedAt} | 模式：自訂模式\n`);
                }

                const dimTitles = {
                    'I': 'Phase I：初見端倪與跨市場共振 (實質利率飆升、避險拋售、油金匯幣聯動)',
                    'II': 'Phase II：數據還原與週期診斷 (關稅衝擊、通膨預期逆轉、多極化央行買盤與 AISC 成本)',
                    'III': 'Phase III：終局戰略部署 (沃什衝擊、5,000 美元目標位與信用體系最終防線)'
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
                        const artTitle = art.title || art.full_title || art.id;
                        const artFullUrl = getFullAnchorUrl(art.url, '');
                        lines.push(`\n### ${idx + 1}. [${art.date}] [${artTitle}](${artFullUrl})`);
                        lines.push(`- **發布日期**：${art.date}`);
                        lines.push(`- **研究狀態**：${statusSymbol} ${art.status || 'verified'}`);
                        if (art.indicators) {
                            lines.push(`- **關鍵指標**：${art.indicators}`);
                        }
                        if (art.core_conclusion) {
                            lines.push(`- **核心結論**：${art.core_conclusion}`);
                        }

                        if (mode === 'detailed') {
                            if (art.h2_pillars && art.h2_pillars.length > 0) {
                                lines.push('- **論證階層 (H2 / H3 支柱與查證連結)**：');
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
                    lines.push('請基於嚴苛的貨幣信用模型、實質利率傳導、大宗能源矛盾與央行儲備博弈直接輸出：');
                    lines.push('1. **【最核心致命盲點 (Top 3 Sovereign Gold Blindspots)】**：針對以上 5 篇研報核心論點，指出作者在實質利率攀升、去美元化進程、關稅博弈或央行買盤邊際效用未充分考量之反向力量與脆弱假設。');
                    lines.push('2. **【油金匯幣跨市場定價矛盾對照表 (Cross-Asset Macro Discrepancy Matrix)】**：檢驗美元流動性虹吸 (104.5)、原油地緣溢價 ($112)、比特幣數位避險替代 (連動 0.62) 與實體金條現貨交割 ($45 溢價) 間的推論衝突與現實約束。');
                    lines.push('3. **【2026-2027 年極端流動性通縮與高實質利率情境推演 (Liquidity Deflation & Real Rate Surge Trajectory)】**：具體模擬若聯準會維持實質利率 2.5%+ 且全球貿易萎縮引發強流動性恐慌，黃金重演歷史清算拋售 ($4,600 跌破測試) 的深度、去槓桿骨牌與修復時序。');
                    lines.push('4. **【抗脆弱主權信用防禦與終極避險配置策略 (Anti-Fragile Sovereign Credit Allocation)】**：針對全球法幣赤字失控與貨幣多極化格局，提出平衡主權信用風險、實體金條提貨安全 (AISC $2,100 防線) 與流動性成本的終極避險組合方案。');
                }
            }

            return lines.join('\n');
        }

        updatePrompt() {
            this.currentPrompt = this.buildPrompt();
            const outputEl = document.getElementById('cot-prompt-output');
            if (outputEl) {
                outputEl.textContent = this.currentPrompt;
            }
            // 更新字數與統計
            const statsEl = document.getElementById('cot-prompt-stats');
            if (statsEl) {
                const charCount = this.currentPrompt.length;
                const lineCount = this.currentPrompt.split('\n').length;
                statsEl.textContent = `${charCount.toLocaleString()} 字元 / ${lineCount} 行`;
            }
        }

        downloadPromptMarkdown() {
            const topic = this.currentTopic;
            const mode = this.currentMode;
            const filename = `cot-prompt-${topic}-${mode}-${new Date().toISOString().slice(0, 10)}.md`;
            const blob = new Blob([this.currentPrompt], { type: 'text/markdown;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast(`已成功下載：${filename}`);
        }

        // 單篇研報論點結構提取（包含核心結論、指標、H2/H3 直達錨點）
        buildArticleMarkdown(art, topicKey) {
            if (!art) return '';
            const lines = [];
            const topicTitles = {
                winter: '凜冬將至 (Winter Is Coming)',
                crypto: '加密貨幣與 Web3 生態導讀 (Crypto & Web3)',
                ai: 'AI 算力與機器經濟 (AI Economy)',
                gold: '黃金與法幣信用 (Gold & Currency)'
            };
            const topicUrls = {
                winter: `${SITE_BASE_URL}/post/topic-winter-is-coming.html`,
                crypto: `${SITE_BASE_URL}/post/topic-crypto.html`,
                ai: `${SITE_BASE_URL}/post/topic-ai-economy.html`,
                gold: `${SITE_BASE_URL}/post/topic-gold-currency-crisis.html`
            };
            const topicTitle = topicTitles[topicKey] || (this.datasets[topicKey] && this.datasets[topicKey].title) || topicKey;
            const topicUrl = topicUrls[topicKey] || `${SITE_BASE_URL}/post/topic-winter-is-coming.html`;
            
            const displayTitle = art.full_title || art.title || art.id;
            const artFullUrl = getFullAnchorUrl(art.url, '');
            const statusSymbol = art.status === 'verified' ? '[已驗證]' : '[待觀察]';

            lines.push(`# 【研報論點階層樹】${displayTitle}`);
            lines.push(`> 專題收錄：[${topicTitle}](${topicUrl})`);
            lines.push(`> 原文研報：[${art.title || displayTitle}](${artFullUrl})`);
            lines.push(`> 發布資訊：${art.date || '2026'}${art.updated_at ? ` (更新：${art.updated_at})` : ''} | 所屬維度：Phase ${art.dimension || 'I'} | 狀態：${statusSymbol} ${art.status || 'verified'}`);
            lines.push(`> 導出架構：單篇 AI 思考鏈 (CoT) 階層骨架 (含各級段落直達錨點連結)\n`);

            if (art.indicators && art.indicators.trim()) {
                lines.push(`## 關鍵指標\n${art.indicators.trim()}\n`);
            }

            if (art.core_conclusion && art.core_conclusion.trim()) {
                lines.push(`## 核心結論 (TL;DR)\n${art.core_conclusion.trim()}\n`);
            }

            if (art.oct_evidence && art.oct_evidence.trim()) {
                lines.push(`## 2026-Q4 覆核實證\n${art.oct_evidence.trim()}\n`);
            }

            if (art.h2_pillars && art.h2_pillars.length > 0) {
                lines.push('## 論證階層樹 (H2 支柱與 H3 論證細節)');
                art.h2_pillars.forEach((p, pIdx) => {
                    const pUrl = getFullAnchorUrl(art.url, p.id);
                    lines.push(`\n### [${pIdx + 1}] [${p.title}](${pUrl})`);
                    if (p.h3_details && p.h3_details.length > 0) {
                        p.h3_details.forEach(h3 => {
                            const h3Url = getFullAnchorUrl(art.url, h3.id);
                            lines.push(`- [${h3.title}](${h3Url})`);
                        });
                    }
                });
            }

            return lines.join('\n');
        }

        // 動態渲染 TOPIC 系列研報卡片矩陣 (Phase 2 核心)
        renderArticlesMatrix(filterTopic = this.currentFilter) {
            const container = document.getElementById('articles-matrix-container');
            if (!container) return;

            // 準備研報清單
            const list = [];
            const winterArticles = (this.datasets.winter && this.datasets.winter.articles) || [];
            const cryptoArticles = (this.datasets.crypto && this.datasets.crypto.articles) || [];
            const aiArticles = (this.datasets.ai && this.datasets.ai.articles) || [];
            const goldArticles = (this.datasets.gold && this.datasets.gold.articles) || [];

            if (filterTopic === 'all' || filterTopic === 'winter') {
                winterArticles.forEach(art => list.push({ ...art, _topicKey: 'winter' }));
            }
            if (filterTopic === 'all' || filterTopic === 'crypto') {
                cryptoArticles.forEach(art => list.push({ ...art, _topicKey: 'crypto' }));
            }
            if (filterTopic === 'all' || filterTopic === 'ai') {
                aiArticles.forEach(art => list.push({ ...art, _topicKey: 'ai' }));
            }
            if (filterTopic === 'all' || filterTopic === 'gold') {
                goldArticles.forEach(art => list.push({ ...art, _topicKey: 'gold' }));
            }

            // 更新篩選 Tab 視覺
            document.querySelectorAll('.matrix-filter-btn').forEach(btn => {
                const target = btn.getAttribute('data-filter-target');
                const isMatch = target === filterTopic;
                btn.classList.toggle('bg-teal-600', isMatch);
                btn.classList.toggle('text-white', isMatch);
                btn.classList.toggle('border-teal-500', isMatch);
                btn.classList.toggle('shadow-md', isMatch);
                btn.classList.toggle('shadow-teal-500/20', isMatch);
                btn.classList.toggle('bg-slate-800/80', !isMatch);
                btn.classList.toggle('text-slate-300', !isMatch);
                btn.classList.toggle('border-slate-700/60', !isMatch);
            });

            // 動態更新篩選按鈕計數標籤
            const totalArticlesCount = winterArticles.length + cryptoArticles.length + aiArticles.length + goldArticles.length;
            const updateCounter = (id, count) => {
                const el = document.getElementById(id);
                if (el) el.textContent = count;
            };
            updateCounter('filter-count-all', totalArticlesCount || 37);
            updateCounter('filter-count-winter', winterArticles.length);
            updateCounter('filter-count-crypto', cryptoArticles.length);
            updateCounter('filter-count-ai', aiArticles.length);
            updateCounter('filter-count-gold', goldArticles.length);

            // 更新統計字串
            const statsEl = document.getElementById('matrix-display-stats');
            if (statsEl) {
                statsEl.textContent = `顯示 ${list.length} 篇研報 (總計 ${totalArticlesCount || 37} 篇)`;
            }

            // 清空舊卡片
            container.innerHTML = '';

            if (list.length === 0) {
                container.innerHTML = `<div class="col-span-full p-8 text-center text-slate-500 font-mono">查無研報資料</div>`;
                return;
            }

            // 建立卡片 DOM
            list.forEach((art, index) => {
                let topicBadgeText = '研報專題';
                let topicBadgeClass = 'bg-teal-500/10 text-teal-400 border-teal-500/20';

                if (art._topicKey === 'winter') {
                    topicBadgeText = '凜冬將至';
                    topicBadgeClass = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
                } else if (art._topicKey === 'crypto') {
                    topicBadgeText = 'Crypto & Web3';
                    topicBadgeClass = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                } else if (art._topicKey === 'ai') {
                    topicBadgeText = 'AI 算力經濟';
                    topicBadgeClass = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
                } else if (art._topicKey === 'gold') {
                    topicBadgeText = '黃金與法幣信用';
                    topicBadgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                }
                
                const artFullUrl = getFullAnchorUrl(art.url, '');
                const displayTitle = art.title || art.full_title || art.id;
                const pillars = art.h2_pillars || [];
                const pillarsCount = pillars.length;

                const cardEl = document.createElement('div');
                cardEl.className = 'p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 shadow-xl hover:shadow-2xl hover:shadow-teal-500/5 transition-all duration-300 flex flex-col justify-between group backdrop-blur-sm';

                // 卡片主體 HTML
                cardEl.innerHTML = `
                    <div>
                        <!-- Header Badges -->
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <div class="flex items-center gap-2">
                                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${topicBadgeClass}">
                                    ${topicBadgeText}
                                </span>
                                <span class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/60 text-[11px] font-mono">
                                    Phase ${art.dimension || 'I'}
                                </span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-[11px] font-mono text-slate-400">${art.date || ''}</span>
                                <span class="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">已驗證</span>
                            </div>
                        </div>

                        <!-- Article Title -->
                        <h3 class="text-base sm:text-lg font-bold text-slate-100 mb-3 group-hover:text-teal-400 transition-colors leading-snug">
                            <a href="${artFullUrl}" class="hover:underline">
                                ${displayTitle}
                            </a>
                        </h3>

                        <!-- Core Conclusion Box -->
                        ${art.core_conclusion ? `
                        <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 mb-3.5 text-xs sm:text-[13px] text-slate-300 leading-relaxed font-sans">
                            <div class="text-[10px] font-mono text-teal-400 uppercase tracking-wider mb-1 font-semibold flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                                核心結論 (TL;DR)
                            </div>
                            ${art.core_conclusion}
                        </div>
                        ` : ''}

                        <!-- Indicators or Oct Evidence (If available) -->
                        ${art.oct_evidence ? `
                        <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-3 text-xs text-amber-300 leading-relaxed font-sans">
                            <span class="font-mono font-semibold text-[11px] text-amber-400 block mb-0.5">2026/10 覆核實證：</span>
                            ${art.oct_evidence}
                        </div>
                        ` : ''}
                        ${(!art.oct_evidence && art.indicators) ? `
                        <div class="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 mb-3 text-xs text-teal-300 leading-relaxed font-sans">
                            <span class="font-mono font-semibold text-[11px] text-teal-400 block mb-0.5">關鍵指標：</span>
                            ${art.indicators}
                        </div>
                        ` : ''}

                        <!-- Accordion for Hierarchy Tree -->
                        ${pillarsCount > 0 ? `
                        <div class="border border-slate-800 rounded-2xl overflow-hidden mb-4 bg-slate-950/40">
                            <button type="button" class="btn-toggle-card-tree w-full px-3.5 py-2.5 bg-slate-800/50 hover:bg-slate-800 transition-colors flex items-center justify-between text-xs font-semibold text-slate-300">
                                <span class="flex items-center gap-2">
                                    <svg class="w-3.5 h-3.5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                    論點架構樹 (${pillarsCount} 支柱論點)
                                </span>
                                <svg class="card-tree-icon w-3.5 h-3.5 text-slate-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <div class="card-tree-body hidden p-3.5 bg-slate-950/80 text-xs text-slate-300 space-y-2 border-t border-slate-800 max-h-56 overflow-y-auto">
                                ${pillars.map((p, pIdx) => {
                                    const pUrl = getFullAnchorUrl(art.url, p.id);
                                    return `
                                    <div class="border-l-2 border-teal-500/50 pl-2.5 py-0.5">
                                        <div class="font-medium text-slate-200">
                                            <a href="${pUrl}" class="hover:text-teal-400 transition-colors">
                                                [${pIdx + 1}] ${p.title}
                                            </a>
                                        </div>
                                        ${(p.h3_details && p.h3_details.length > 0) ? `
                                        <div class="mt-1 pl-2 space-y-1 text-[11px] text-slate-400">
                                            ${p.h3_details.map(h3 => {
                                                const h3Url = getFullAnchorUrl(art.url, h3.id);
                                                return `<div>• <a href="${h3Url}" class="hover:text-teal-300 transition-colors">${h3.title}</a></div>`;
                                            }).join('')}
                                        </div>
                                        ` : ''}
                                    </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>

                    <!-- Footer Action Buttons -->
                    <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2.5">
                        <button type="button" class="btn-copy-article px-3.5 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 hover:text-teal-200 border border-teal-500/30 hover:border-teal-500/50 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm">
                            <svg class="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                            <span class="btn-copy-text">複製論點結構</span>
                        </button>

                        <a href="${artFullUrl}" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1 transition-all">
                            <span>閱讀研報</span>
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </a>
                    </div>
                `;

                // 綁定單張卡片內部事件
                // 1. 論點樹展開/收折
                const toggleTreeBtn = cardEl.querySelector('.btn-toggle-card-tree');
                const treeBody = cardEl.querySelector('.card-tree-body');
                const treeIcon = cardEl.querySelector('.card-tree-icon');
                if (toggleTreeBtn && treeBody) {
                    toggleTreeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const isHidden = treeBody.classList.contains('hidden');
                        treeBody.classList.toggle('hidden', !isHidden);
                        if (treeIcon) treeIcon.classList.toggle('rotate-180', isHidden);
                    });
                }

                // 2. 一鍵複製單篇論點 Markdown (Phase 2.2 核心)
                const copyBtn = cardEl.querySelector('.btn-copy-article');
                const copyTextSpan = cardEl.querySelector('.btn-copy-text');
                if (copyBtn) {
                    copyBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const md = this.buildArticleMarkdown(art, art._topicKey);
                        if (!md) {
                            showToast('未找到該研報之論點結構資料');
                            return;
                        }

                        const success = await copyToClipboard(md, `已複製【${displayTitle}】階層論點結構至剪貼簿！`);
                        if (success) {
                            cardEl.classList.add('ring-1', 'ring-teal-500/50', 'border-teal-500/50');
                            setTimeout(() => {
                                cardEl.classList.remove('ring-1', 'ring-teal-500/50', 'border-teal-500/50');
                            }, 1500);

                            if (copyTextSpan) {
                                const origText = copyTextSpan.textContent;
                                copyTextSpan.textContent = '已複製 ✓';
                                copyBtn.classList.add('bg-emerald-500', 'text-white', 'border-emerald-500', 'shadow-md', 'shadow-emerald-500/20');
                                copyBtn.classList.remove('bg-teal-500/10', 'text-teal-300', 'border-teal-500/30');

                                setTimeout(() => {
                                    copyTextSpan.textContent = origText;
                                    copyBtn.classList.remove('bg-emerald-500', 'text-white', 'border-emerald-500', 'shadow-md', 'shadow-emerald-500/20');
                                    copyBtn.classList.add('bg-teal-500/10', 'text-teal-300', 'border-teal-500/30');
                                }, 2000);
                            }
                        }
                    });
                }

                container.appendChild(cardEl);
            });
        }

        // 動態渲染專題完整階層樹狀檔案庫 (Phase 1 核心)
        renderFullHierarchyArchive(filterTopic = this.currentFilter) {
            const container = document.getElementById('full-hierarchy-tree-container');
            if (!container) return;

            // 準備研報清單
            const list = [];
            const winterArticles = (this.datasets.winter && this.datasets.winter.articles) || [];
            const cryptoArticles = (this.datasets.crypto && this.datasets.crypto.articles) || [];
            const aiArticles = (this.datasets.ai && this.datasets.ai.articles) || [];
            const goldArticles = (this.datasets.gold && this.datasets.gold.articles) || [];

            if (filterTopic === 'all' || filterTopic === 'winter') {
                winterArticles.forEach(art => list.push({ ...art, _topicKey: 'winter' }));
            }
            if (filterTopic === 'all' || filterTopic === 'crypto') {
                cryptoArticles.forEach(art => list.push({ ...art, _topicKey: 'crypto' }));
            }
            if (filterTopic === 'all' || filterTopic === 'ai') {
                aiArticles.forEach(art => list.push({ ...art, _topicKey: 'ai' }));
            }
            if (filterTopic === 'all' || filterTopic === 'gold') {
                goldArticles.forEach(art => list.push({ ...art, _topicKey: 'gold' }));
            }

            container.innerHTML = '';

            const topicMetaMap = {
                winter: { badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', name: '凜冬將至' },
                crypto: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', name: 'Web3 專題' },
                ai: { badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30', name: 'AI 算力' },
                gold: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', name: '黃金法幣' }
            };

            list.forEach(art => {
                const topicInfo = topicMetaMap[art._topicKey] || { badge: 'bg-slate-700 text-slate-300', name: '研報' };
                const pillars = art.h2_pillars || [];
                const pillarsCount = pillars.length;
                const artFullUrl = getFullAnchorUrl(art.url, '');

                const itemEl = document.createElement('div');
                itemEl.className = 'archive-tree-item bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all shadow-sm flex flex-col';

                itemEl.innerHTML = `
                    <div class="p-4 bg-slate-855/60 border-b border-slate-800 flex items-center justify-between gap-3">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold border ${topicInfo.badge}">
                                    ${topicInfo.name}
                                </span>
                                <span class="text-[11px] text-slate-400 font-mono">
                                    ${art.date || art.published_date || ''}
                                </span>
                            </div>
                            <h4 class="text-sm font-semibold text-slate-100 truncate">
                                <a href="${artFullUrl}" class="hover:text-teal-400 transition-colors" target="_blank" rel="noopener">
                                    ${art.title}
                                </a>
                            </h4>
                        </div>
                        <div class="flex items-center gap-1.5 shrink-0">
                            <button type="button" class="btn-copy-archive-single px-2.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 hover:text-teal-200 border border-teal-500/30 hover:border-teal-500/50 text-[11px] font-medium flex items-center gap-1 transition-all" title="複製本篇論點結構">
                                <svg class="w-3 h-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                <span class="btn-copy-archive-single-text">複製論點</span>
                            </button>
                            <button type="button" class="btn-toggle-archive-tree p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 transition-colors" title="展開/收合目錄">
                                <svg class="archive-tree-icon w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                        </div>
                    </div>
                    <div class="archive-tree-body p-4 bg-slate-950/40 text-xs text-slate-300 space-y-2.5 max-h-72 overflow-y-auto">
                        ${pillarsCount > 0 ? pillars.map((p, pIdx) => {
                            const pUrl = getFullAnchorUrl(art.url, p.id);
                            return `
                            <div class="border-l-2 border-teal-500/50 pl-2.5 py-0.5">
                                <div class="font-medium text-slate-200">
                                    <a href="${pUrl}" class="hover:text-teal-400 transition-colors" target="_blank" rel="noopener">
                                        [${pIdx + 1}] ${p.title}
                                    </a>
                                </div>
                                ${(p.h3_details && p.h3_details.length > 0) ? `
                                <div class="mt-1 pl-2 space-y-1 text-[11px] text-slate-400">
                                    ${p.h3_details.map(h3 => {
                                        const h3Url = getFullAnchorUrl(art.url, h3.id);
                                        return `<div>• <a href="${h3Url}" class="hover:text-teal-300 transition-colors" target="_blank" rel="noopener">${h3.title}</a></div>`;
                                    }).join('')}
                                </div>
                                ` : ''}
                            </div>
                            `;
                        }).join('') : '<div class="text-slate-500 italic text-[11px]">本篇無獨立 H2 階層劃分</div>'}
                    </div>
                `;

                // 綁定單篇折疊切換
                const toggleBtn = itemEl.querySelector('.btn-toggle-archive-tree');
                const treeBody = itemEl.querySelector('.archive-tree-body');
                const treeIcon = itemEl.querySelector('.archive-tree-icon');
                if (toggleBtn && treeBody && treeIcon) {
                    toggleBtn.addEventListener('click', () => {
                        const isHidden = treeBody.classList.toggle('hidden');
                        treeIcon.classList.toggle('rotate-180', !isHidden);
                    });
                }

                // 綁定單篇論點結構複製
                const copySingleBtn = itemEl.querySelector('.btn-copy-archive-single');
                if (copySingleBtn) {
                    copySingleBtn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        const md = this.buildArticleMarkdown(art, art._topicKey);
                        const success = await copyToClipboard(md, `已複製【${art.title}】論點結構至剪貼簿！`);
                        if (success) {
                            const textSpan = copySingleBtn.querySelector('.btn-copy-archive-single-text');
                            if (textSpan) {
                                const origText = textSpan.textContent;
                                textSpan.textContent = '已複製 ✓';
                                copySingleBtn.classList.add('bg-emerald-500', 'text-white', 'border-emerald-500');
                                copySingleBtn.classList.remove('bg-teal-500/10', 'text-teal-300', 'border-teal-500/30');
                                setTimeout(() => {
                                    textSpan.textContent = origText;
                                    copySingleBtn.classList.remove('bg-emerald-500', 'text-white', 'border-emerald-500');
                                    copySingleBtn.classList.add('bg-teal-500/10', 'text-teal-300', 'border-teal-500/30');
                                }, 2000);
                            }
                        }
                    });
                }

                container.appendChild(itemEl);
            });
        }

        // 批次按最新時間倒序複製檔案庫中全部文章論點 (Phase 1 強化)
        async copyAllArchiveChrono() {
            const list = [];
            const winterArticles = (this.datasets.winter && this.datasets.winter.articles) || [];
            const cryptoArticles = (this.datasets.crypto && this.datasets.crypto.articles) || [];
            const aiArticles = (this.datasets.ai && this.datasets.ai.articles) || [];
            const goldArticles = (this.datasets.gold && this.datasets.gold.articles) || [];

            const filterTopic = this.currentFilter || 'all';
            if (filterTopic === 'all' || filterTopic === 'winter') {
                winterArticles.forEach(art => list.push({ ...art, _topicKey: 'winter' }));
            }
            if (filterTopic === 'all' || filterTopic === 'crypto') {
                cryptoArticles.forEach(art => list.push({ ...art, _topicKey: 'crypto' }));
            }
            if (filterTopic === 'all' || filterTopic === 'ai') {
                aiArticles.forEach(art => list.push({ ...art, _topicKey: 'ai' }));
            }
            if (filterTopic === 'all' || filterTopic === 'gold') {
                goldArticles.forEach(art => list.push({ ...art, _topicKey: 'gold' }));
            }

            if (list.length === 0) {
                showToast('查無可複製之文章論點');
                return;
            }

            // 嚴格按最新發布時間倒序排列 (Desc, 最新時間在前)
            list.sort((a, b) => {
                const dateA = a.date || a.published_date || '1970-01-01';
                const dateB = b.date || b.published_date || '1970-01-01';
                return dateB.localeCompare(dateA);
            });

            const filterNameMap = {
                all: '全站專題',
                winter: '凜冬將至專題',
                crypto: '加密貨幣與 Web3 專題',
                ai: 'AI 算力與機器經濟專題',
                gold: '黃金與法幣信用危機專題'
            };
            const scopeName = filterNameMap[filterTopic] || '專題';

            const header = [
                `# Mason Yang Blog — ${scopeName}研報論點結構總庫`,
                `> 篇數總計：${list.length} 篇 | 排序準則：依發布時間倒序排列 (最新在前)`,
                `> 導出時間：${new Date().toISOString().slice(0, 10)} | 來源：思考鏈工作台 (CoT Studio)`,
                '',
                '---',
                ''
            ].join('\n');

            const body = list.map((art, idx) => {
                const prefix = `<!-- [${idx + 1}/${list.length}] 發布日期: ${art.date || art.published_date || '未標註'} | 專題: ${art._topicKey} -->\n`;
                return prefix + this.buildArticleMarkdown(art, art._topicKey);
            }).join('\n\n---\n\n');

            const fullText = header + body;

            const copyBtn = document.getElementById('btn-copy-all-archive-chrono');
            const textSpan = document.getElementById('btn-copy-all-archive-text');

            const success = await copyToClipboard(fullText, `已複製【${scopeName}】全部 ${list.length} 篇研報論點（已按最新時間排序）！`);
            if (success && textSpan && copyBtn) {
                const origText = textSpan.textContent;
                textSpan.textContent = '已複製全部論點 ✓';
                copyBtn.classList.add('bg-emerald-500', 'text-white', 'border-emerald-500');
                copyBtn.classList.remove('bg-teal-500/10', 'text-teal-300', 'border-teal-500/40');
                setTimeout(() => {
                    textSpan.textContent = origText;
                    copyBtn.classList.remove('bg-emerald-500', 'text-white', 'border-emerald-500');
                    copyBtn.classList.add('bg-teal-500/10', 'text-teal-300', 'border-teal-500/40');
                }, 2500);
            }
        }
    }

    // 暴露全域與模組命名空間
    if (typeof window !== 'undefined') {
        window.CoTStudio = {
            Controller: CoTStudioController,
            copyToClipboard: copyToClipboard,
            showToast: showToast
        };
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            CoTStudioController,
            copyToClipboard,
            showToast
        };
    }

    // 自動於 DOMContentLoaded 初始化
    if (typeof document !== 'undefined' && document.addEventListener) {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.getElementById('cot-prompt-output')) {
                const controller = new CoTStudioController();
                controller.init();
                if (typeof window !== 'undefined') {
                    window.cotStudioController = controller;
                }
            }
        });
    }
})();
