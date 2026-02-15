/**
 * Articles Data Repository
 * Centralized source of truth for all blog posts.
 * Follows strict project standards: Class encapsulation, IIFE, No global pollution (except the exposed instance).
 */
(function (global) {
    // Private Data Source
    const _articles = [
        {
            id: 'card-topic-stablecoin',
            category: 'core',
            published: '2025-10-15',
            modified: '2025-10-15',
            tag: '核心論述',
            tagColor: 'text-violet-500',
            title: '核心系列：穩定幣 (Stablecoin)',
            desc: '穩定幣是加密貨幣市場的基石。本篇指南將從零開始，深度解析法幣儲備型 (USDT, USDC) 與算法穩定幣的運作原理、風險與未來趨勢。',
            link: 'post/topic-stablecoin.html',
            keywords: '穩定幣, Stablecoin, USDT, USDC, DAI, 算法穩定幣, 法幣儲備, 加密貨幣, 美元穩定幣'
        },
        {
            id: 'card-bitcoin-mandala',
            category: 'core',
            published: '2026-02-13',
            modified: '2026-02-13',
            tag: '核心論述',
            tagColor: 'text-orange-500',
            title: '比特幣價格因素：深度展開曼陀羅 (Bitcoin Price Factors)',
            desc: '深入解析影響比特幣價格的8大核心因素與64個關鍵指標，透過互動式曼陀羅圖表，全方位掌握市場脈動。',
            link: 'post/bitcoin-price-factors.html',
            keywords: '比特幣, BTC, 價格, 影響因素, 曼陀羅, 投資分析, 宏觀經濟, 鏈上數據'
        },
        {
            id: 'card-why-crypto',
            category: 'core',
            published: '2025-10-14',
            modified: '2025-10-14',
            tag: '核心哲學',
            tagColor: 'text-violet-500',
            title: 'Why Crypto？一份關於數位資產所有權的深度心理學分析',
            desc: '本篇機構級分析報告將從心理學與行為金融學視角，深度解析五種典型的加密貨幣投資者心態，揭示在對抗通膨、追求主權與擁抱創新等動機背後，驅動這個萬億級市場的根本原因。',
            link: 'post/why-crypto.html',
            keywords: 'Why Crypto, 加密貨幣心理學, 投資心態, 數位黃金, 主權個人, 通貨膨脹, Web3, 投資'
        },
        {
            id: 'card-investment-guide',
            category: 'analysis',
            published: '2025-10-13',
            modified: '2025-10-13',
            tag: '投資策略',
            tagColor: 'text-amber-500',
            title: '加密貨幣市場進入策略：ETF、概念股與交易所之比較分析',
            desc: '本篇機構級分析報告將深度比較透過傳統股市（ETF、概念股）與加密貨幣交易所兩種市場進入路徑的優劣，為您的數位資產佈局提供專業決策框架。',
            link: 'post/investment-guide.html',
            keywords: '加密貨幣投資, 如何買比特幣, 比特幣ETF, 加密貨幣概念股, MicroStrategy, 加密貨幣交易所, 投資'
        },

        {
            id: 'card-2026-macro',
            category: 'analysis',
            published: '2025-10-18',
            modified: '2025-10-18',
            tag: '市場分析',
            tagColor: 'text-blue-500',
            title: '2026年宏觀展望：流動性週期與主權比特幣時代',
            desc: '2026年將是加密市場的「流動性大年」。本篇機構級報告深度解析全球降息循環後的市場效應、比特幣升級為國家戰略儲備的博弈，以及 AI Agent 經濟體系如何引爆下一輪增長。',
            link: 'post/topic-macro.html#2026-outlook',
            keywords: '2026 宏觀經濟, 降息循環, 比特幣戰略儲備, AI Agent, 加密貨幣投資'
        },
        {
            id: 'card-project-eth',
            category: 'core',
            published: '2025-10-12',
            modified: '2025-10-12',
            tag: '核心論述',
            tagColor: 'text-violet-500',
            title: '核心系列：以太坊與山寨幣 (ALT)',
            desc: '深入了解以太坊的智能合約功能，並探索山寨幣 (Altcoins) 的世界，尋找下一個投資機會。',
            link: 'project/eth.html',
            keywords: '以太坊, Ethereum, ETH, 山寨幣, Altcoin, 智能合約, DeFi, NFT'
        },
        {
            id: 'card-project-btc',
            category: 'core',
            published: '2025-10-12',
            modified: '2025-10-12',
            tag: '核心論述',
            tagColor: 'text-orange-500',
            title: '核心系列：比特幣',
            desc: '深入探討比特幣的核心技術、歷史與未來發展。',
            link: 'project/btc.html',
            keywords: '比特幣, Bitcoin, BTC, 核心系列, 加密貨幣'
        },
        {
            id: 'card-topic-rwa',
            category: 'core',
            published: '2025-10-20',
            modified: '2026-01-22',
            tag: '主題專題',
            tagColor: 'text-blue-500',
            title: '真實世界資產 (RWA) 終極指南',
            desc: '連接傳統金融與區塊鏈的橋樑，探索資產代幣化的未來與投資機遇。',
            link: 'post/topic-rwa.html',
            keywords: 'RWA, 代幣化, Real World Assets, Ondo'
        },
        {
            id: 'card-topic-meme',
            category: 'core',
            published: '2025-10-21',
            modified: '2026-01-22',
            tag: '主題專題',
            tagColor: 'text-pink-500',
            title: '迷因幣文化深度解析',
            desc: '迷因幣不只是玩笑，它是加密貨幣社群文化的極致體現。',
            link: 'post/topic-meme.html',
            keywords: 'Meme, DOGE, PEPE, 社群文化'
        },

        {
            id: 'card-chainlink',
            category: 'tech',
            published: '2024-05-22',
            modified: '2024-09-26',
            tag: '前沿技術',
            tagColor: 'text-green-500',
            title: 'Chainlink (LINK) 完整指南：驅動 DeFi 與 RWA 的 Web3 基礎設施',
            desc: 'Chainlink 作為一個去中心化的「預言機」網絡，充當了區塊鏈與現實世界數據之間的可信中介。沒有它，DeFi、鏈上遊戲等都無法實現。',
            link: 'project/chainlink.html',
            keywords: 'Chainlink, LINK, 預言機, Oracle, 智能合約, DeFi, RWA'
        },
        {
            id: 'card-layer2',
            category: 'tech',
            published: '2024-08-15',
            modified: '2026-01-25',
            tag: '技術敘事',
            tagColor: 'text-violet-600',
            title: '關鍵技術 (TECH)：區塊鏈創新技術與未來敘事',
            desc: '深入解析模組化區塊鏈 (Modular)、零知識證明 (ZK) 與預測市場 (Prediction Markets) 等核心技術，掌握 Web3 下一輪增長的底層邏輯。',
            link: 'post/topic-tech.html',
            keywords: 'Modular, ZK-Rollup, Prediction Markets, Polymarket, Tech Narrative'
        },
        {
            id: 'card-topic-knowledge',
            category: 'core',
            published: '2026-01-25',
            modified: '2026-01-25',
            tag: '知識庫',
            tagColor: 'text-emerald-500',
            title: '加密貨幣知識資料庫 (Knowledge Database)',
            desc: '彙整加密貨幣領域的核心名詞、技術術語與關鍵概念，助您快速掌握產業脈絡。',
            link: 'post/topic-knowledge.html',
            keywords: '知識庫, 術語表, 加密貨幣名詞, Glossary, Knowledge Base, CBDC, DeFi'
        },
        // --- Project Reviews ---
        {
            id: 'card-project-ondo',
            category: 'project',
            published: '2026-01-25',
            modified: '2026-01-25',
            tag: '項目評測',
            tagColor: 'text-orange-500',
            title: 'Ondo Finance (ONDO) 深度評測：RWA 賽道龍頭',
            desc: 'Ondo Finance 將美國國債帶入區塊鏈。本文解析 OUSG 與 USDY 的運作機制、代幣經濟與投資潛力。',
            link: 'project/ondo.html',
            keywords: 'Ondo, RWA, 項目評測, USDY, OUSG'
        },
        {
            id: 'card-project-pendle',
            category: 'project',
            published: '2026-01-25',
            modified: '2026-01-25',
            tag: '項目評測',
            tagColor: 'text-orange-500',
            title: 'Pendle Finance (PENDLE)：收益代幣化與 LSDFi 的未來',
            desc: 'Pendle 允許用戶將收益與本金分離。深入了解 PT/YT 機制、sPENDLE 升級與 2026 投資展望。',
            link: 'project/pendle.html',
            keywords: 'Pendle, LSDFi, 項目評測, 收益代幣化'
        },
        {
            id: 'card-project-tao',
            category: 'project',
            published: '2026-01-25',
            modified: '2026-01-25',
            tag: '項目評測',
            tagColor: 'text-orange-500',
            title: 'Bittensor (TAO)：去中心化 AI 的比特幣',
            desc: 'Bittensor 正在構建一個全球性的 AI 商品市場。本文解析其子網機制、Yuma 共識與減半效應。',
            link: 'project/tao.html',
            keywords: 'Bittensor, TAO, AI, 項目評測, DePIN'
        },
        {
            id: 'card-project-celestia',
            category: 'project',
            published: '2026-01-25',
            modified: '2026-01-25',
            tag: '項目評測',
            tagColor: 'text-orange-500',
            title: 'Celestia (TIA)：模組化區塊鏈的數據可用性層',
            desc: 'Celestia 是模組化區塊鏈的先驅。深入了解 DA 層的重要性、代幣解鎖時程與競爭優勢。',
            link: 'project/celestia.html',
            keywords: 'Celestia, TIA, Modular, 項目評測, DA Layer'
        },
        // --- News Section ---
        {
            id: 'news-20260124-tom-lee-2026',
            category: 'news',
            published: '2026-01-24',
            modified: '2026-01-24',
            tag: '時事點評',
            tagColor: 'text-blue-500',
            title: '關於修正與真正的長期主義：評 Tom Lee 的 2026 年預測',
            desc: 'Tom Lee 預測 2026 年將有 10% 回調，但他堅持比特幣將達 25 萬美元。本文深度解析「擇時的幻覺」與數位資產的世代財富轉移。',
            link: 'news/news-20260124-tom-lee-2026.html',
            keywords: 'Tom Lee, Bitcoin, 2026 預測, 市場回調, 長期主義'
        }
    ];

    class ArticleRepository {
        constructor() {
            this._debug = false;
        }

        /**
         * Get all articles
         * @returns {Array} List of all articles
         */
        get all() {
            if (this._debug) console.log('ArticleRepository: Fetching all articles');
            return _articles;
        }

        /**
         * Set debug mode
         * @param {boolean} value
         * @returns {ArticleRepository} Chainable
         */
        setDebug(value) {
            this._debug = value;
            return this;
        }
    }

    // Expose Single Instance
    global.ArticleRepository = new ArticleRepository();

})(window);
