/**
 * Mason Yang 個人部落格分類與標籤規劃 (最終版)
 * 核心理念：分類符合使用者指定的「四大主題」，標籤定義「細分領域與研究方法」
 */
(function (global) {
    // 1. 分類規劃：精準對應五大主題分類，符合 MECE 原則
    const CATEGORIES = {
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
     */
    const TAGS = {
        // --- 資產類別 (Asset Classes) ---
        'btc': { text: 'BTC', color: 'text-orange-500', hex: '#f97316' },
        'eth': { text: 'ETH', color: 'text-indigo-500', hex: '#6366f1' },
        'gold': { text: '黃金', color: 'text-amber-500', hex: '#f59e0b' },
        'crude-oil': { text: '原油', color: 'text-slate-700', hex: '#334155' },
        'us-treasury': { text: '美債', color: 'text-blue-500', hex: '#3b82f6' },
        'us-stocks': { text: '美股', color: 'text-emerald-600', hex: '#059669' },
        'macro-economy': { text: '總體經濟', color: 'text-indigo-600', hex: '#4f46e5' },

        // --- 主題概念 (Concepts & Sectors) ---
        'compute-infra': { text: '算力基礎設施', color: 'text-cyan-600', hex: '#0891b2' },
        'rwa': { text: 'RWA', color: 'text-teal-600', hex: '#0d9488' },
        'liquidity-crisis': { text: '流動性危機', color: 'text-rose-600', hex: '#e11d48' },
        'sec-inflation': { text: '二次通膨', color: 'text-red-500', hex: '#ef4444' },
        'ai-agent': { text: 'AI Agent', color: 'text-purple-600', hex: '#9333ea' },
        'depin': { text: 'DePIN', color: 'text-violet-500', hex: '#8b5cf6' },

        // --- 分析方法 (Methodologies) ---
        'factor-investing': { text: '因子投資', color: 'text-indigo-600', hex: '#4f46e5' },
        'dcf-model': { text: 'DCF 模型', color: 'text-pink-500', hex: '#ec4899' },
        'arbitrage': { text: '套利交易', color: 'text-sky-600', hex: '#0284c7' },
        'chip-analysis': { text: '籌碼分析', color: 'text-amber-700', hex: '#b45309' },

        // --- 特定機構/事件 (Entities & Events) ---
        'amd': { text: 'AMD', color: 'text-red-600', hex: '#dc2626' },
        'fed': { text: '聯準會 (Fed)', color: 'text-blue-600', hex: '#2563eb' },
        'irgc': { text: '伊朗革命衛隊', color: 'text-red-700', hex: '#b91c1c' },
        'palantir': { text: 'Palantir', color: 'text-stone-700', hex: '#44403c' },
        'mstr': { text: 'MicroStrategy (MSTR)', color: 'text-slate-600', hex: '#475569' }
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

        getAllCategories() {
            return CATEGORIES;
        }

        getAllTags() {
            return TAGS;
        }

        getAllSeries() {
            return SERIES;
        }
    }

    // Expose Single Instance for existing components
    global.TaxonomyConfig = new TaxonomyManager();
    
    // Expose as BLOG_CONFIG alias as requested
    global.BLOG_CONFIG = { CATEGORIES, TAGS, SERIES };

})(typeof window !== 'undefined' ? window : global);
