/**
 * News Data Repository
 * Centralized source of truth for all news and quick updates.
 * Follows strict project standards: Class encapsulation, IIFE, No global pollution (except the exposed instance).
 */
(function (global) {
    // Private Data Source
    const _news = [
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
