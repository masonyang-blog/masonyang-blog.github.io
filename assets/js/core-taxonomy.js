/**
 * Mason Yang 個人部落格分類與標籤規劃 (最終版)
 * 核心理念：分類符合使用者指定的「四大主題」，標籤定義「細分領域與研究方法」
 */
(function (global) {
    // 1. 分類規劃：精準對應五大主題分類，符合 MECE 原則
    const CATEGORIES = {
        'equity-research': { 
            text: '個股與企業研究', 
            displayTitle: 'Stock & Equity Research', 
            schemaType: 'Report' 
        },
        'macro-geopolitics': { 
            text: '宏觀戰略與地緣政治', 
            displayTitle: 'Macro Strategy & Geopolitics', 
            schemaType: 'AnalysisNewsArticle' 
        },
        'crypto-web3': { 
            text: '數位資產與 Web3', 
            displayTitle: 'Digital Assets & Web3', 
            schemaType: 'Report' 
        },
        'traditional-markets': { 
            text: '傳統金融與市場', 
            displayTitle: 'Traditional Finance & Markets', 
            schemaType: 'Report' 
        },
        'tech-ai': { 
            text: '科技趨勢與 AI', 
            displayTitle: 'Technology Trends & AI', 
            schemaType: 'Report' 
        },
        'research-tools': { 
            text: '投研方法與工具', 
            displayTitle: 'Research Methodology & Tools', 
            schemaType: 'WebApplication' 
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
        'coinbase': { text: 'Coinbase (COIN)', color: 'text-blue-600', hex: '#2563eb' }
    };

    // 3. 專題系列 (Series)：聚焦特定研究主題的長篇或連載內容
    const SERIES = {
        'macro-2026': { text: '2026 宏觀戰略預測', color: 'text-indigo-600', hex: '#4f46e5' },
        'bitcoin': { text: '比特幣與數位主權', color: 'text-orange-600', hex: '#ea580c' },
        'ai-economy': { text: 'AI 算力與機器經濟', color: 'text-blue-600', hex: '#2563eb' },
        'black-swan': { text: '黑天鵝預警系統', color: 'text-red-600', hex: '#dc2626' },
        'investment-sop': { text: '專業投研實戰方法論', color: 'text-violet-600', hex: '#7c3aed' },
        'tokenized-future': { text: '價值代幣化前沿', color: 'text-emerald-600', hex: '#059669' }
    };

    // 4. 焦點主題賽道 (Topic Tracks - 12 大核心研究賽道 SSOT)
    const TRACKS = {
        'track-macro-credit': {
            name: '總體經濟與私人信貸危機',
            domain: 'macro-economy',
            desc: '1.8 兆影子銀行壞帳、流動性收縮、實質利率與滯脹風險',
            color: 'text-rose-600',
            hex: '#e11d48'
        },
        'track-gold-supercycle': {
            name: '黃金超級週期與儲備重構',
            domain: 'macro-economy',
            desc: '央行信念買盤、AISC 成本地板、多極化儲備取代法幣信用',
            color: 'text-amber-500',
            hex: '#f59e0b'
        },
        'track-ai-semiconductor': {
            name: 'AI 晶片與記憶體超級週期',
            domain: 'us-stocks',
            desc: 'HBM 產能排擠傳統 DRAM、AI CapEx 過剩與融資風險',
            color: 'text-cyan-600',
            hex: '#0891b2'
        },
        'track-mining-ai-capex': {
            name: '比特幣礦企轉型 AI 與電力競賽',
            domain: 'hybrid',
            desc: '挖礦算力跨界 HPC、PPA 電價稀缺性、雙軌商業模式',
            color: 'text-orange-500',
            hex: '#f97316'
        },
        'track-compute-agent-energy': {
            name: '算力基礎設施、AI Agent 與能源邊界',
            domain: 'hybrid',
            desc: '電網整合極限、SMR 小型核能、AI Agent 機器支付經濟體系',
            color: 'text-purple-600',
            hex: '#9333ea'
        },
        'track-us-stocks-valuation': {
            name: '美股深度估值與 SaaS 重定價',
            domain: 'us-stocks',
            desc: 'Rule of 40 破滅、一二級市場倒掛、極端籌碼擁擠與軋空',
            color: 'text-emerald-600',
            hex: '#059669'
        },
        'track-btc-sovereign-liquidity': {
            name: '比特幣鏈上指標與主權流動性',
            domain: 'crypto',
            desc: '鏈上籌碼結構、機構範式轉移、Delta 中性對沖模型',
            color: 'text-orange-600',
            hex: '#ea580c'
        },
        'track-web3-defai-regulation': {
            name: 'Web3 協議、DeFAI 與代理支付',
            domain: 'crypto',
            desc: '密碼學信任框架、去中心化 AI 推理、監管法案博弈',
            color: 'text-indigo-500',
            hex: '#6366f1'
        },
        'track-jpy-carry-bonds': {
            name: '日圓套息交易與美債殖利率風暴',
            domain: 'macro-economy',
            desc: 'Carry Trade 平倉潮、美債實質利差、全球流動性逆流',
            color: 'text-blue-600',
            hex: '#2563eb'
        },
        'track-energy-geopolitics': {
            name: '能源大宗商品、荷莫茲海峽與地緣霸權',
            domain: 'macro-economy',
            desc: '能源門票論、護航權金融化、原油 100 美元情境推演',
            color: 'text-slate-700',
            hex: '#334155'
        },
        'track-politics-tda-future': {
            name: '政治週期、地緣情報與科技大趨勢',
            domain: 'macro-economy',
            desc: '川普期中危機、TDA 拓撲預警、未來五年康波週期',
            color: 'text-violet-600',
            hex: '#7c3aed'
        },
        'track-methodology-research': {
            name: '專業投研方法論與心智模型',
            domain: 'methodology',
            desc: '機構級研報標準、五力分析、情境推演與持有期校準',
            color: 'text-teal-600',
            hex: '#0d9488'
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
         * @returns {Object} { text, displayTitle, schemaType }
         */
        getCategory(id) {
            return CATEGORIES[id] || { text: id, displayTitle: id, schemaType: 'Article' };
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
         * Get series details by ID
         * @param {string} id 
         * @returns {Object} { text, color, hex }
         */
        getSeries(id) {
            return SERIES[id] || { text: id, color: 'text-slate-500', hex: '#64748b' };
        }

        /**
         * Get track details by ID
         * @param {string} id 
         * @returns {Object} { name, domain, desc, color, hex }
         */
        getTrack(id) {
            return TRACKS[id] || { name: id, domain: 'general', desc: '', color: 'text-slate-500', hex: '#64748b' };
        }

        /**
         * Get format details by ID
         * @param {string} id 
         * @returns {Object} { name, displayTitle, desc, schemaType, color, hex }
         */
        getFormat(id) {
            return CONTENT_FORMATS[id] || { name: id, displayTitle: id, desc: '', schemaType: 'Article', color: 'text-slate-500', hex: '#64748b' };
        }

        getAllCategories() {
            return CATEGORIES;
        }

        getAllTags() {
            return TAGS;
        }

        getAllSeries() {
            return SERIES;
        }

        getAllTracks() {
            return TRACKS;
        }

        getAllFormats() {
            return CONTENT_FORMATS;
        }
    }

    // Expose Single Instance for existing components
    global.TaxonomyConfig = new TaxonomyManager();
    
    // Expose as BLOG_CONFIG alias as requested
    global.BLOG_CONFIG = { CATEGORIES, TAGS, SERIES, TRACKS, CONTENT_FORMATS };

})(typeof window !== 'undefined' ? window : global);
