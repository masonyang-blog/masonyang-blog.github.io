/**
 * Mason Yang 個人部落格分類與標籤規劃 (V3.1 正交二維架構)
 * 核心理念：核心主題 (TOPICS — What) 與研究視角 (CATEGORIES — How) 徹底正交解耦
 */
(function (global) {
    // 1. 研究視角分類 (CATEGORIES — How)：6 大互斥分析切角
    const CATEGORIES = {
        'asset-deep-dive': {
            text: '標的與協議拆解',
            displayTitle: 'Asset & Protocol Deep Dive',
            color: 'text-emerald-600',
            hex: '#059669'
        },
        'sector-thesis': {
            text: '產業結構與週期',
            displayTitle: 'Sector Thesis & Cycles',
            color: 'text-cyan-600',
            hex: '#0891b2'
        },
        'event-attribution': {
            text: '事件歸因與市場追蹤',
            displayTitle: 'Event Attribution & Pulse',
            color: 'text-blue-600',
            hex: '#2563eb'
        },
        'red-team-risk': {
            text: '紅隊審查與風控預警',
            displayTitle: 'Red-Team & Risk Audit',
            color: 'text-rose-600',
            hex: '#e11d48'
        },
        'playbook-engineering': {
            text: '方法論、工具與工程',
            displayTitle: 'Playbooks, Tools & Ops',
            color: 'text-indigo-600',
            hex: '#6366f1'
        },
        'essay-notes': {
            text: '隨筆與跨界觀察',
            displayTitle: 'Essays & Field Notes',
            color: 'text-slate-500',
            hex: '#64748b'
        }
    };

    /**
     * 2. 標籤規劃：定義內容的「細分領域與研究方法」
     * AI 分類公式：[1個資產/機構/個股/國家] + [1個主題概念] + [1個分析方法]
     */
    const TAGS = {
        // --- 資產類別 (Asset Classes) ---
        'btc': { text: 'BTC', color: 'text-orange-500', hex: '#f97316' },
        'eth': { text: 'ETH', color: 'text-indigo-500', hex: '#6366f1' },
        'crypto': { text: '加密貨幣', color: 'text-amber-500', hex: '#f59e0b' },
        'gold': { text: '黃金', color: 'text-amber-500', hex: '#f59e0b' },
        'crude-oil': { text: '原油', color: 'text-slate-700', hex: '#334155' },
        'us-treasury': { text: '美債', color: 'text-blue-500', hex: '#3b82f6' },
        'us-stocks': { text: '美股', color: 'text-emerald-600', hex: '#059669' },
        'macro-economy': { text: '總體經濟', color: 'text-indigo-600', hex: '#4f46e5' },

        // --- 地緣國家/地區 (Geographic Regions) ---
        'us': { text: '美國', color: 'text-blue-600', hex: '#2563eb' },
        'china': { text: '中國', color: 'text-red-600', hex: '#dc2626' },
        'japan': { text: '日本', color: 'text-rose-500', hex: '#f43f5e' },
        'tw': { text: '台灣', color: 'text-emerald-600', hex: '#059669' },

        // --- 主題概念 (Concepts & Sectors) ---
        'compute-infra': { text: '算力基礎設施', color: 'text-cyan-600', hex: '#0891b2' },
        'rwa': { text: 'RWA', color: 'text-teal-600', hex: '#0d9488' },
        'liquidity-crisis': { text: '流動性危機', color: 'text-rose-600', hex: '#e11d48' },
        'sec-inflation': { text: '二次通膨', color: 'text-red-500', hex: '#ef4444' },
        'ai-agent': { text: 'AI Agent', color: 'text-purple-600', hex: '#9333ea' },
        'multi-agent': { text: 'Multi-Agent', color: 'text-indigo-600', hex: '#4f46e5' },
        'e-commerce': { text: '電子商務', color: 'text-blue-600', hex: '#2563eb' },
        'depin': { text: 'DePIN', color: 'text-violet-500', hex: '#8b5cf6' },
        'valuation-risk': { text: '估值與 IPO 風險', color: 'text-amber-600', hex: '#d97706' },

        // --- 分析方法 (Methodologies) ---
        'factor-investing': { text: '因子投資', color: 'text-indigo-600', hex: '#4f46e5' },
        'dcf-model': { text: 'DCF 模型', color: 'text-pink-500', hex: '#ec4899' },
        'arbitrage': { text: '套利交易', color: 'text-sky-600', hex: '#0284c7' },
        'chip-analysis': { text: '籌碼分析', color: 'text-amber-700', hex: '#b45309' },
        'financial-analysis': { text: '財報分析', color: 'text-blue-700', hex: '#1d4ed8' },

        // --- 特定個股/機構/事件 (Entities & Companies) ---
        'googl': { text: 'Alphabet (GOOGL)', color: 'text-blue-500', hex: '#3b82f6' },
        'orcl': { text: 'Oracle (ORCL)', color: 'text-amber-600', hex: '#d97706' },
        'u': { text: 'Unity (U)', color: 'text-slate-800', hex: '#1e293b' },
        'openai': { text: 'OpenAI', color: 'text-emerald-700', hex: '#047857' },
        'spacex': { text: 'SpaceX', color: 'text-cyan-700', hex: '#0e7490' },
        'amd': { text: 'AMD', color: 'text-red-600', hex: '#dc2626' },
        'fed': { text: '聯準會 (Fed)', color: 'text-blue-600', hex: '#2563eb' },
        'irgc': { text: '伊朗革命衛隊', color: 'text-red-700', hex: '#b91c1c' },
        'palantir': { text: 'Palantir', color: 'text-stone-700', hex: '#44403c' },
        'mstr': { text: 'MicroStrategy (MSTR)', color: 'text-slate-600', hex: '#475569' },
        'gaw': { text: 'Games Workshop (GAW)', color: 'text-amber-600', hex: '#d97706' },
        'ethfi': { text: 'Ether.fi (ETHFI)', color: 'text-blue-600', hex: '#2563eb' },
        'eigenlayer': { text: 'EigenLayer', color: 'text-indigo-600', hex: '#4f46e5' },
        'coinbase': { text: 'Coinbase (COIN)', color: 'text-blue-600', hex: '#2563eb' },
        'iren': { text: 'IREN Ltd (IREN)', color: 'text-cyan-600', hex: '#0891b2' }
    };

    // 3. 舊制賽道映射表 (LEGACY_TRACK_MAP — 供 ?track= 網址參數與歷史資料向後相容解析)
    const LEGACY_TRACK_MAP = {
        'track-macro-credit': 'topic-macro',
        'track-jpy-carry-bonds': 'topic-macro',
        'track-politics-tda-future': 'topic-macro',
        'track-gold-supercycle': 'topic-macro',
        'track-energy-geopolitics': 'topic-macro',
        'track-ai-semiconductor': 'topic-ai',
        'track-mining-ai-capex': 'topic-ai',
        'track-compute-agent-energy': 'topic-ai',
        'track-us-stocks-valuation': 'topic-us-equities',
        'track-btc-sovereign-liquidity': 'topic-crypto-web3',
        'track-web3-defai-regulation': 'topic-crypto-web3',
        'track-methodology-research': 'topic-strategies-tools'
    };

    // 4. 6 大核心主題 (TOPICS — 全站單一真理源 SSOT)
    const TOPICS = {
        'topic-macro': {
            name: '宏觀經濟、地緣與硬資產',
            shortName: 'Macro & Hard Assets',
            domain: 'macro-economy',
            desc: 'Fed 利率、美債與私人信貸、日圓套息、黃金週期、能源霸權與地緣風險',
            hubUrl: 'post/topic-winter-is-coming.html',
            subHubs: ['post/topic-gold-currency-crisis.html'],
            color: 'text-rose-600',
            hex: '#e11d48'
        },
        'topic-ai': {
            name: 'AI 全景：算力、基建與工程',
            shortName: 'AI Ecosystem & Ops',
            domain: 'ai-tech',
            desc: 'AI 晶片與 HBM、礦企轉型算力電力、資料中心 CapEx、AI Agent 與工作流工程',
            hubUrl: 'post/topic-ai-economy.html',
            subHubs: [],
            color: 'text-cyan-600',
            hex: '#0891b2'
        },
        'topic-us-equities': {
            name: '美股個股與估值重定價',
            shortName: 'US Equities',
            domain: 'us-stocks',
            desc: '垂直美股財報拆解、護城河分析、Pre-IPO 估值與 SaaS 定價重估',
            hubUrl: 'post/topic-us-equities.html',
            subHubs: ['post/us-stock-ai-valuation-liquidity-guide.html'],
            color: 'text-emerald-600',
            hex: '#059669'
        },
        'topic-crypto-web3': {
            name: '比特幣、加密資產與 Web3',
            shortName: 'Bitcoin & Web3',
            domain: 'crypto',
            desc: '比特幣主權儲備與鏈上指標、L1 公鏈、RWA 美債代幣化、穩定幣法案與 DeFAI',
            hubUrl: 'post/topic-crypto.html',
            subHubs: ['post/crypto-btc.html'],
            color: 'text-orange-600',
            hex: '#ea580c'
        },
        'topic-strategies-tools': {
            name: '投研策略與實戰工具',
            shortName: 'Strategies & Tools',
            domain: 'strategies-tools',
            desc: '系統化交易策略百科、投研 SOP、Zero-Build 估值計算機、礦企對標表與量化監控管線',
            hubUrl: 'post/topic-strategies-tools.html',
            subHubs: [
                'post/trading-strategies-list-151.html',
                'apps/ai-miners-sheet/ai-miners-core-metrics-benchmark.html',
                'apps/cot-studio/index.html'
            ],
            color: 'text-indigo-600',
            hex: '#6366f1'
        },
        'topic-personal': {
            name: '個人心得與跨界觀察',
            shortName: 'Personal & Essays',
            domain: 'personal',
            desc: '心智模型、行為科學、在地制度觀察與其他不歸類之跨界思考隨筆',
            hubUrl: 'apps/archive/index.html?topic=topic-personal',
            subHubs: ['post/topic-mental-health-rehab.html'],
            color: 'text-slate-600',
            hex: '#64748b'
        }
    };

    // 5. 內容形式 (Content Formats - 內容載體維度 SSOT)
    const CONTENT_FORMATS = {
        'deep-report': {
            name: '深度研報',
            displayTitle: 'Institutional Deep Report',
            desc: '萬字長篇、完整財務模型、護城河拆解與情境推演的機構級研報',
            schemaType: 'Report',
            color: 'text-indigo-600',
            hex: '#4f46e5'
        },
        'market-pulse': {
            name: '市場速遞',
            displayTitle: 'Market Pulse & Flash',
            desc: '即時市場異動、數據脈動與事件驅動的快速洞察短報',
            schemaType: 'AnalysisNewsArticle',
            color: 'text-orange-600',
            hex: '#ea580c'
        },
        'wiki': {
            name: '實體百科',
            displayTitle: 'Knowledge Entity / Wiki',
            desc: '專有名詞、鏈上指標定義、機構與代幣專屬架構百科',
            schemaType: 'TechArticle',
            color: 'text-teal-600',
            hex: '#0d9488'
        },
        'interactive-tool': {
            name: '投研工具',
            displayTitle: 'Research Methodology & Tools',
            desc: '量化計算機、估值模型、資料庫試算表與互動式分析工具',
            schemaType: 'WebApplication',
            color: 'text-cyan-600',
            hex: '#0891b2'
        },
        'topic-hub': {
            name: '專題中心',
            displayTitle: 'Topic Hub & Dossier',
            desc: '匯總特定重大主題的所有研報與知識鏈路聚合入口',
            schemaType: 'CollectionPage',
            color: 'text-purple-600',
            hex: '#9333ea'
        }
    };

    class TaxonomyManager {
        /**
         * Get category details by ID
         * @param {string} id 
         * @returns {Object} { text, displayTitle, color, hex }
         */
        getCategory(id) {
            if (id === 'taiwan-observation' || id === 'mason-observation') {
                return CATEGORIES['essay-notes'];
            }
            return CATEGORIES[id] || { text: id, displayTitle: id, color: 'text-slate-500', hex: '#64748b' };
        }
        
        /**
         * Get tag details by ID
         * @param {string} id 
         * @returns {Object} { text, color, hex }
         */
        getTag(id) {
            return TAGS[id] || { text: id, color: 'text-slate-500', hex: '#64748b' };
        }

        /**
         * Get topic details by ID (supports legacy trackId fallback via LEGACY_TRACK_MAP)
         * @param {string} id 
         * @returns {Object} { name, shortName, domain, desc, hubUrl, subHubs, color, hex }
         */
        getTopic(id) {
            const resolvedId = LEGACY_TRACK_MAP[id] || id;
            return TOPICS[resolvedId] || {
                name: id,
                shortName: id,
                domain: 'general',
                desc: '',
                hubUrl: 'apps/archive/index.html',
                subHubs: [],
                color: 'text-slate-600',
                hex: '#64748b'
            };
        }

        /**
         * @deprecated 已由 getTopic(id) 取代，暫留別名供過渡期防斷鏈
         */
        getTrack(id) {
            return this.getTopic(id);
        }

        /**
         * @deprecated SERIES 已廢除
         */
        getSeries(id) {
            return { text: id, color: 'text-slate-500', hex: '#64748b' };
        }

        /**
         * Get format details by ID
         * @param {string} id 
         * @returns {Object} { name, displayTitle, desc, schemaType, color, hex }
         */
        getFormat(id) {
            return CONTENT_FORMATS[id] || { name: id, displayTitle: id, desc: '', schemaType: 'Article', color: 'text-slate-500', hex: '#64748b' };
        }

        /**
         * Resolve topic for an article (returns topic object with id, name, shortName, domain, desc, hubUrl, subHubs, color, hex)
         * Priority: article.topicId -> LEGACY_TRACK_MAP[article.trackId] -> Category/Tag/ID heuristics -> topic-personal
         * @param {Object} article 
         * @returns {Object|null}
         */
        resolveTopic(article) {
            if (!article) return null;

            if (article.topicId && TOPICS[article.topicId]) {
                return { id: article.topicId, ...TOPICS[article.topicId] };
            }
            if (article.trackId && LEGACY_TRACK_MAP[article.trackId]) {
                const mappedId = LEGACY_TRACK_MAP[article.trackId];
                return { id: mappedId, ...TOPICS[mappedId] };
            }

            const artTags = Array.isArray(article.tags) ? article.tags : (article.tag ? [article.tag] : []);
            const artId = (article.id || '').toLowerCase();
            const artCat = article.category || '';

            if (artCat === 'essay-notes') {
                return { id: 'topic-personal', ...TOPICS['topic-personal'] };
            }
            if (
                artTags.some(t => ['factor-investing', 'dcf-model', 'arbitrage', 'financial-analysis'].includes(t)) ||
                ['sop', 'handbook', 'research-guide', 'investment-guide', 'calculator', 'spreadsheet'].some(k => artId.includes(k))
            ) {
                return { id: 'topic-strategies-tools', ...TOPICS['topic-strategies-tools'] };
            }
            if (artTags.some(t => ['btc', 'eth', 'crypto', 'rwa', 'mstr', 'ethfi', 'eigenlayer', 'coinbase'].includes(t))) {
                return { id: 'topic-crypto-web3', ...TOPICS['topic-crypto-web3'] };
            }
            if (artTags.some(t => ['compute-infra', 'ai-agent', 'multi-agent', 'e-commerce', 'depin', 'amd', 'iren'].includes(t))) {
                return { id: 'topic-ai', ...TOPICS['topic-ai'] };
            }
            if (artTags.some(t => ['us-stocks', 'valuation-risk', 'palantir', 'u', 'gaw', 'openai', 'spacex', 'googl', 'orcl'].includes(t))) {
                return { id: 'topic-us-equities', ...TOPICS['topic-us-equities'] };
            }
            if (artTags.some(t => ['gold', 'crude-oil', 'us-treasury', 'macro-economy', 'japan', 'fed', 'irgc', 'liquidity-crisis', 'sec-inflation'].includes(t))) {
                return { id: 'topic-macro', ...TOPICS['topic-macro'] };
            }
            if (artCat === 'playbook-engineering') {
                return { id: 'topic-strategies-tools', ...TOPICS['topic-strategies-tools'] };
            }

            return { id: 'topic-personal', ...TOPICS['topic-personal'] };
        }

        /**
         * @deprecated 已由 resolveTopic(article) 取代，暫留別名供過渡期防斷鏈
         */
        resolveTrack(article) {
            return this.resolveTopic(article);
        }

        getAllCategories() {
            return CATEGORIES;
        }

        getAllTags() {
            return TAGS;
        }

        getAllTopics() {
            return TOPICS;
        }

        getLegacyTrackMap() {
            return LEGACY_TRACK_MAP;
        }

        /**
         * @deprecated SERIES 已廢除
         */
        getAllSeries() {
            return {};
        }

        /**
         * @deprecated 已由 getAllTopics() 取代，暫留別名供過渡期防斷鏈
         */
        getAllTracks() {
            return this.getAllTopics();
        }

        getAllFormats() {
            return CONTENT_FORMATS;
        }
    }

    // Expose Single Instance for existing components
    global.TaxonomyConfig = new TaxonomyManager();
    
    // Expose as BLOG_CONFIG alias
    global.BLOG_CONFIG = { CATEGORIES, TAGS, TOPICS, TRACKS: TOPICS, LEGACY_TRACK_MAP, CONTENT_FORMATS };

})(typeof window !== 'undefined' ? window : global);
