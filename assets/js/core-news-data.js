/**
 * News Data Repository
 * Centralized source of truth for all news and quick updates.
 * Follows strict project standards: Class encapsulation, IIFE, No global pollution (except the exposed instance).
 */
(function (global) {
    // Private Data Source
    const _news = [
        {
            id: 'news-20260313-bitwise-1m',
            category: 'news',
            published: '2026-03-13',
            modified: '2026-03-13',
            tag: '市場分析',
            tagColor: 'text-blue-500',
            title: '為什麼 Bitwise 的首席投資官 Matt Hougan 說比特幣注定衝擊百萬美元',
            desc: '深入探討 Bitwise 首席投資官 Matt Hougan 的觀點，解析為何比特幣在 SoV 市場擴張與機構配置比例提升的動能下，正朝向百萬美元目標邁進。',
            link: 'news/news-20260313-bitwise-1m.html',
            keywords: 'Bitwise, Matt Hougan, 比特幣, 百萬美元預測, 價值儲存, Store of Value, 數位黃金, Bitcoin ETF, 機構配置, 主權財富基金, 法幣貶值, 政府債務, 量化寬鬆, CAGR, 黃金市場, BlockBeats, 律動'
        },
        {
            id: 'news-20260311-btc-oil-macro-matrix',
            category: 'news',
            published: '2026-03-11',
            modified: '2026-03-11',
            tag: '宏觀分析',
            tagColor: 'text-blue-500',
            title: '比特幣與石油的真邏輯：全變量分析報告',
            desc: '在市場動盪時期，投資者渴求簡潔的因果關係。然而，「石油飆升必將導致比特幣大跌」的線性敘事隱藏了深層的邏輯斷裂。本報告將引導您打破舊有思維，建立精準的「矩陣式」宏觀決策框架。',
            link: 'news/news-20260311-btc-oil-macro-matrix.html',
            keywords: '比特幣, 石油, 宏觀經濟, 投資決策, 通膨, 美聯儲, 避險資產'
        },
        {
            id: 'news-20260305-btc-sovereign-liquidity',
            category: 'news',
            published: '2026-03-05',
            modified: '2026-03-05',
            tag: '時事點評',
            tagColor: 'text-blue-500',
            title: '五大鏈上指標共振：為什麼現在可能是比特幣的週期低點？',
            desc: '從 MVRV Z-Score、2年均線乘數、Power Law、RSI動能到彩虹圖，深度解析為何當前市場處於絕佳的低估買入區間。',
            link: 'news/news-20260305-btc-sovereign-liquidity.html',
            keywords: '比特幣, BTC, 戰略儲備, 流動性, 2026預測'
        },
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

    class NewsRepository {
        constructor() {
            this._debug = false;
        }

        /**
         * Get all news items
         * @returns {Array} List of all news items
         */
        get all() {
            if (this._debug) console.log('NewsRepository: Fetching all news items');
            return _news;
        }

        /**
         * Set debug mode
         * @param {boolean} value
         * @returns {NewsRepository} Chainable
         */
        setDebug(value) {
            this._debug = value;
            return this;
        }
    }

    // Expose Single Instance
    global.NewsRepository = new NewsRepository();

})(window);
