/**
 * Article Recommendation Algorithm Module
 * @class ArticleRecommender
 * @description Pure calculation engine for 6-dimensional institutional article correlation,
 * exponential recency time-decay, and dual-track quota allocation (News vs Evergreen).
 * Completely decoupled from DOM, UI styling, and rendering pipelines.
 */
(function (global) {
    "use strict";

    const DEFAULT_WEIGHTS = {
        topic: 40,
        category: 15,
        tag: 20,
        mentions: 15,
        keywords: 10,
        recencyMax: 15
    };

    // Mapping from knowledge/* tag domains to core-articles-data.js categories & tags
    const KNOWLEDGE_TO_ARTICLE_MAP = {
        macro: { categories: ['macro-geopolitics', 'traditional-markets'], tags: ['macro-economy', 'fed', 'us-treasury', 'liquidity-crisis', 'gold'] },
        valuation: { categories: ['equity-research', 'crypto-web3'], tags: ['valuation-risk', 'financial-analysis', 'dcf-model', 'btc', 'us-stocks'] },
        fi: { categories: ['traditional-markets', 'macro-geopolitics'], tags: ['us-treasury', 'liquidity-crisis', 'valuation-risk', 'macro-economy', 'fed'] },
        reg: { categories: ['crypto-web3', 'macro-geopolitics'], tags: ['crypto', 'rwa', 'us', 'macro-economy'] },
        infra: { categories: ['tech-ai', 'crypto-web3'], tags: ['compute-infra', 'chip-analysis', 'depin', 'ai-agent', 'eth'] },
        onchain: { categories: ['crypto-web3'], tags: ['btc', 'eth', 'crypto', 'rwa'] },
        cycle: { categories: ['crypto-web3', 'macro-geopolitics'], tags: ['btc', 'macro-economy', 'liquidity-crisis', 'crypto'] },
        risk: { categories: ['traditional-markets', 'macro-geopolitics', 'equity-research'], tags: ['valuation-risk', 'liquidity-crisis', 'gold', 'macro-economy'] },
        trading: { categories: ['crypto-web3', 'traditional-markets'], tags: ['btc', 'arbitrage', 'factor-investing', 'crypto'] },
        security: { categories: ['crypto-web3', 'tech-ai'], tags: ['crypto', 'eth', 'ai-agent'] },
        scaling: { categories: ['crypto-web3'], tags: ['eth', 'crypto', 'depin'] },
        app: { categories: ['crypto-web3', 'tech-ai'], tags: ['rwa', 'ai-agent', 'crypto', 'depin'] },
        assets: { categories: ['crypto-web3', 'traditional-markets'], tags: ['btc', 'eth', 'gold', 'rwa', 'us-stocks'] },
        core: { categories: ['crypto-web3', 'tech-ai'], tags: ['btc', 'eth', 'crypto', 'compute-infra'] },
        culture: { categories: ['crypto-web3'], tags: ['crypto', 'btc', 'general'] }
    };

    // Interactive tools under apps/ eligible for reverse-lookup from knowledge pages
    const INTERACTIVE_APPS = [
        {
            id: 'app-dca-simulator',
            title: 'BTC & 資產定期定額 (DCA) 回測模擬器',
            desc: '互動式量化回測工具，實測不同市場週期與波動率下的定期定額與再平衡績效。',
            link: 'apps/dca-simulator/index.html',
            category: 'research-tools',
            tags: ['btc', 'crypto', 'factor-investing'],
            keywords: 'DCA, 定投, 減半週期, 四年週期, 比特幣, 回測, 估值, 資產配置, M2, 流動性',
            knowledgeTags: ['cycle', 'assets', 'trading', 'valuation', 'onchain', 'core'],
            published: '2026-03-01'
        },
        {
            id: 'app-cot-studio',
            title: 'CFTC COT 機構籌碼持倉分析儀',
            desc: '追蹤美國期貨市場大型投機者與商業機構淨部位變化，輔助判讀總經與避險情緒。',
            link: 'apps/cot-studio/index.html',
            category: 'research-tools',
            tags: ['macro-economy', 'gold', 'us-treasury', 'liquidity-crisis'],
            keywords: 'COT, 籌碼, 美債, 黃金, 避險, 聯準會, 利率, 美元, 流動性, 機構持倉, 信用風險',
            knowledgeTags: ['macro', 'fi', 'risk', 'trading'],
            published: '2026-03-01'
        },
        {
            id: 'app-ai-miners-sheet',
            title: 'AI 算力與礦企財務指標對標表',
            desc: '橫向拆解 AI 資料中心、能源基礎設施與上市礦企之電力成本、估值倍數與財務體質。',
            link: 'apps/ai-miners-sheet/index.html',
            category: 'research-tools',
            tags: ['compute-infra', 'chip-analysis', 'financial-analysis', 'valuation-risk'],
            keywords: 'AI, 算力, 礦企, 資料中心, 能源, 基礎設施, DePIN, 估值, 資本支出, HPC',
            knowledgeTags: ['infra', 'valuation', 'app', 'scaling'],
            published: '2026-03-01'
        },
        {
            id: 'app-topic-knowledge',
            title: '跨領域互動知識圖譜中樞',
            desc: '探索總經、鏈上估值、私募信貸與監管法規之間的實體拓撲與因果關聯。',
            link: 'apps/topic-knowledge/topic-knowledge.html',
            category: 'research-tools',
            tags: ['general', 'crypto', 'macro-economy'],
            keywords: '知識圖譜, 概念, 法規, 監管, 穩定幣, 安全, 架構, 治理',
            knowledgeTags: ['reg', 'security', 'culture'],
            published: '2026-03-01'
        }
    ];

    class ArticleRecommender {
        /**
         * @param {Object} [options]
         * @param {Object} [options.weights] Custom scoring weights
         * @param {Boolean} [options.debug] Enable verbose debug logging
         * @param {Function} [options.logger] Custom log handler
         */
        constructor(options = {}) {
            this.weights = Object.assign({}, DEFAULT_WEIGHTS, options.weights || {});
            this.debug = Boolean(options.debug);
            this.logger = typeof options.logger === 'function' ? options.logger : null;
        }

        /**
         * Main entry point to get recommended articles for a given article
         * @param {Object} params
         * @param {Array<Object>} params.dataSource All candidate articles
         * @param {String} params.currentArticleId Target article ID
         * @param {String} [params.entityName] Optional entity filter (legacy knowledge card support)
         * @param {Number} [params.maxItems=3] Maximum number of recommendations
         * @returns {Array<Object>} Ranked list of recommended article objects
         */
        getRelatedItems(params = {}) {
            const dataSource = params.dataSource || [];
            const currentId = params.currentArticleId || '';
            const entityName = params.entityName || '';
            const knowledgeItem = params.knowledgeItem || null;
            const maxItems = params.maxItems || 3;
            const weights = Object.assign({}, this.weights, params.weights || {});

            // 1. Filter out current article
            const others = dataSource.filter(a => a && a.id !== currentId);
            if (others.length === 0) return [];

            // 2. Knowledge Entity Reverse-Lookup Mode (knowledge/* -> post/, news/, project/, apps/)
            if (knowledgeItem) {
                return this.getKnowledgeRelatedItems({
                    dataSource: others,
                    knowledgeItem,
                    maxItems
                });
            }

            // 3. Filter by Entity if explicitly requested (Legacy Knowledge Card Support)
            if (entityName) {
                const needle = entityName.toLowerCase();
                const entityMatch = others.filter(a => {
                    const mentionsMatch = a.mentions && a.mentions.some(m => (m.name || '').toLowerCase() === needle);
                    const keywordsMatch = a.keywords && (typeof a.keywords === 'string' ? a.keywords : '').toLowerCase().includes(needle);
                    const titleMatch = a.title && a.title.toLowerCase().includes(needle);
                    const tagsMatch = Array.isArray(a.tags) && a.tags.some(t => t.toLowerCase().includes(needle));
                    return mentionsMatch || keywordsMatch || titleMatch || tagsMatch;
                });

                if (entityMatch.length > 0) {
                    return entityMatch.slice(0, maxItems).map(item => ({ ...item, _badgeType: '概念實戰' }));
                }
            }

            // 3. Dynamic Weighted Recommendation & Dual-Track Selection
            const currentArticle = dataSource.find(a => a && a.id === currentId);

            if (!currentArticle) {
                this._log('info', 'Current article not found, falling back to latest.');
                return this.getLatestFallback(others, maxItems);
            }

            // Enrich and score candidate articles
            const scoredItems = others.map(article => {
                const scoreObj = this.computeScore(article, currentArticle, weights);
                const link = article.link || '';
                const isNews = link.startsWith('news/');
                const isProject = link.startsWith('project/');
                const isPost = link.startsWith('post/');
                const type = isNews ? 'news' : (isProject ? 'project' : (isPost ? 'post' : 'other'));
                const pubDate = new Date(article.published || article.date || article.modified || 0);
                const timestamp = isNaN(pubDate.getTime()) ? 0 : pubDate.getTime();

                return {
                    ...article,
                    _score: scoreObj.score,
                    _type: type,
                    _timestamp: timestamp,
                    _isSameCategory: Boolean(article.category && currentArticle.category && article.category === currentArticle.category),
                    _isSameTopic: Boolean(article.topicId && currentArticle.topicId && article.topicId === currentArticle.topicId),
                    _reasons: scoreObj.reasons
                };
            });

            const isCurrentNews = (currentArticle.link || '').startsWith('news/');

            // Dual-Track Pools:
            // 1. News Pool: relevant items (score > 0) sorted primarily by Recency (timestamp desc), then score
            const newsPool = scoredItems
                .filter(a => a._type === 'news' && a._score > 0)
                .sort((a, b) => {
                    if (b._timestamp !== a._timestamp) return b._timestamp - a._timestamp;
                    return b._score - a._score;
                });

            // 2. Non-News Pool (project, post): relevant items (score > 0) sorted primarily by Relevance score, then recency
            const nonNewsPool = scoredItems
                .filter(a => a._type !== 'news' && a._score > 0)
                .sort((a, b) => {
                    if (b._score !== a._score) return b._score - a._score;
                    return b._timestamp - a._timestamp;
                });

            // Fallback pool: purely by latest date
            const latestFallbackPool = [...scoredItems]
                .sort((a, b) => b._timestamp - a._timestamp);

            // Quotas: For news pages, prioritize latest relevant news (e.g. 4 news + 1 evergreen post/project)
            let newsQuota = isCurrentNews ? Math.max(1, maxItems - 1) : Math.max(1, Math.floor(maxItems * 0.4));
            let nonNewsQuota = maxItems - newsQuota;

            const selected = [];
            const selectedIds = new Set();

            // 1. Fill News Slots
            newsPool.forEach(item => {
                if (selected.filter(x => x._type === 'news').length < newsQuota && !selectedIds.has(item.id)) {
                    item._badgeType = item._isSameTrack ? '專題賽道' : (item._isSameSeries ? '同專題' : (item._isSameCategory ? '最新研報' : '跨領域導讀'));
                    selected.push(item);
                    selectedIds.add(item.id);
                }
            });

            // 2. Fill Non-News Slots (Evergreen project / post)
            nonNewsPool.forEach(item => {
                if (selected.filter(x => x._type !== 'news').length < nonNewsQuota && !selectedIds.has(item.id)) {
                    item._badgeType = item._type === 'project' ? '深度專案' : (item._isSameSeries ? '同專題' : '專題導讀');
                    selected.push(item);
                    selectedIds.add(item.id);
                }
            });

            // 3. Backfill from News Pool if slots remaining
            if (selected.length < maxItems) {
                newsPool.forEach(item => {
                    if (selected.length < maxItems && !selectedIds.has(item.id)) {
                        item._badgeType = item._isSameCategory ? '最新研報' : '跨領域導讀';
                        selected.push(item);
                        selectedIds.add(item.id);
                    }
                });
            }

            // 4. Backfill from Non-News Pool if slots remaining
            if (selected.length < maxItems) {
                nonNewsPool.forEach(item => {
                    if (selected.length < maxItems && !selectedIds.has(item.id)) {
                        item._badgeType = item._type === 'project' ? '深度專案' : '專題導讀';
                        selected.push(item);
                        selectedIds.add(item.id);
                    }
                });
            }

            // 5. Final Backfill from Latest Items
            if (selected.length < maxItems) {
                latestFallbackPool.forEach(item => {
                    if (selected.length < maxItems && !selectedIds.has(item.id)) {
                        item._badgeType = '最新文章';
                        selected.push(item);
                        selectedIds.add(item.id);
                    }
                });
            }

            // Final Presentation Sorting:
            // News items are always placed on top sorted by recency desc;
            // Evergreen non-news items follow, sorted by relevance score.
            selected.sort((a, b) => {
                if (a._type === 'news' && b._type !== 'news') return -1;
                if (a._type !== 'news' && b._type === 'news') return 1;
                if (a._type === 'news' && b._type === 'news') {
                    return b._timestamp - a._timestamp;
                }
                return b._score - a._score;
            });

            if (this.debug) {
                this._log('info', 'Dual-Track Selected Items:');
                selected.forEach(item => {
                    console.log(`- [${item._badgeType} | Score: ${(item._score || 0).toFixed(1)}] ${item.title}`);
                });
            }

            return selected;
        }

        /**
         * Reverse-lookup relevant case studies (post/, news/, project/) and tools (apps/)
         * for a Knowledge Concept Entity.
         * @param {Object} params
         * @returns {Array<Object>}
         */
        getKnowledgeRelatedItems(params = {}) {
            const others = params.dataSource || [];
            const kItem = params.knowledgeItem || {};
            const maxItems = params.maxItems || 3;

            const terms = this._extractKnowledgeTerms(kItem);
            const domainProfile = KNOWLEDGE_TO_ARTICLE_MAP[kItem.tag] || { categories: [], tags: [] };

            // Combine articles with interactive apps
            const candidates = [
                ...others.map(a => ({ ...a, _isApp: false })),
                ...INTERACTIVE_APPS.map(app => ({ ...app, _isApp: true }))
            ];

            const scored = candidates.map(item => {
                let score = 0;
                let directConceptHits = 0;
                const titleLower = (item.title || '').toLowerCase();
                const idLower = (item.id || '').toLowerCase();
                const kwLower = (typeof item.keywords === 'string' ? item.keywords : '').toLowerCase();
                const itemTags = (Array.isArray(item.tags) ? item.tags : (item.tag ? [item.tag] : [])).map(t => t.toLowerCase());
                const link = item.link || '';
                const type = item._isApp ? 'app' : (link.startsWith('project/') ? 'project' : (link.startsWith('post/') ? 'post' : (link.startsWith('news/') ? 'news' : 'other')));

                // 1. Direct concept term matches (title, keywords, tags, id)
                terms.forEach(term => {
                    if (titleLower.includes(term) || kwLower.includes(term)) {
                        directConceptHits++;
                        score += (directConceptHits === 1 ? 45 : 15);
                    } else if (itemTags.some(t => t.includes(term) || term.includes(t)) || idLower.includes(term)) {
                        directConceptHits++;
                        score += 25;
                    }
                });
                if (score > 80) score = 80; // Cap direct hit accumulation

                // 2. Topic match
                if (kItem.topicId && item.topicId && kItem.topicId === item.topicId) {
                    score += 35;
                }

                // 3. Domain profile mapping (knowledge.tag -> article.tags & article.category)
                const tagHits = domainProfile.tags.filter(t => itemTags.includes(t));
                if (tagHits.length > 0) {
                    score += Math.min(36, tagHits.length * 18);
                }
                if (item.category && domainProfile.categories.includes(item.category)) {
                    score += 15;
                }

                // 4. App relevance boost
                if (item._isApp && Array.isArray(item.knowledgeTags) && item.knowledgeTags.includes(kItem.tag)) {
                    score += 32;
                }

                // 5. Mild recency tie-breaker (max 10 pts)
                const pubDate = new Date(item.published || item.date || item.modified || 0);
                const timestamp = isNaN(pubDate.getTime()) ? 0 : pubDate.getTime();
                if (!item._isApp && (item.published || item.date || item.modified)) {
                    score += this.calculateTimeDecay(item.published || item.date || item.modified, 10);
                }

                let badgeType = '領域研報';
                if (item._isApp) badgeType = '實戰工具';
                else if (directConceptHits > 0) badgeType = '概念實戰';
                else if (type === 'project') badgeType = '深度專案';
                else if (kItem.topicId && item.topicId === kItem.topicId) badgeType = '同主題';

                return {
                    ...item,
                    _score: score,
                    _directHits: directConceptHits,
                    _type: type,
                    _timestamp: timestamp,
                    _badgeType: badgeType
                };
            });

            // Sort by score desc, then recency desc
            scored.sort((a, b) => {
                if (Math.abs(b._score - a._score) > 0.01) return b._score - a._score;
                return b._timestamp - a._timestamp;
            });

            // Diversity selection: ensure mix of post/project/news + at most 1 relevant app
            const selected = [];
            const selectedIds = new Set();
            const pick = (item) => {
                if (selected.length < maxItems && !selectedIds.has(item.id)) {
                    selected.push(item);
                    selectedIds.add(item.id);
                    return true;
                }
                return false;
            };

            // A. Top direct-hit or highest scored non-app item first
            const topArticle = scored.find(x => !x._isApp && x._score > 0);
            if (topArticle) pick(topArticle);

            // B. Include at most 1 relevant evergreen post/project if available with solid score
            const topEvergreen = scored.find(x => (x._type === 'post' || x._type === 'project') && !selectedIds.has(x.id) && x._score >= 30);
            if (topEvergreen) pick(topEvergreen);

            // C. Include at most 1 relevant interactive app (when maxItems >= 3 and app has domain/concept match)
            if (maxItems >= 3) {
                const topApp = scored.find(x => x._isApp && x._score >= 32 && !selectedIds.has(x.id));
                if (topApp) pick(topApp);
            }

            // D. Fill remaining slots by highest score (excluding extra apps)
            for (const item of scored) {
                if (selected.length >= maxItems) break;
                if (item._isApp) continue;
                pick(item);
            }

            // E. Final fallback if still short
            if (selected.length < maxItems) {
                for (const item of scored) {
                    if (selected.length >= maxItems) break;
                    pick(item);
                }
            }

            return selected;
        }

        /**
         * Extract normalized search terms from a knowledge entity object
         * @param {Object} item
         * @returns {Array<String>}
         */
        _extractKnowledgeTerms(item) {
            const rawTerms = new Set();
            const stopWords = new Set(['the', 'and', 'for', 'with', 'risk', 'model', 'rate', 'index', 'analysis', 'overview']);

            if (item.title) {
                // Split "GENIUS Act (天才法案)" -> ["genius act", "天才法案"]
                const parts = item.title.split(/[()（）/:：\-—]+/);
                parts.forEach(p => {
                    const t = p.trim().toLowerCase();
                    if (t.length >= 2 && !stopWords.has(t)) rawTerms.add(t);
                });
            }

            if (item.keywords && typeof item.keywords === 'string') {
                item.keywords.split(/[,、|;]+/).forEach(k => {
                    const t = k.trim().toLowerCase();
                    if (t.length >= 2 && !stopWords.has(t)) rawTerms.add(t);
                });
            }

            if (item.id && typeof item.id === 'string') {
                const cleanId = item.id.replace(/^knl-/, '').replace(/-/g, ' ').trim().toLowerCase();
                if (cleanId.length >= 3 && !stopWords.has(cleanId)) rawTerms.add(cleanId);
            }

            return Array.from(rawTerms);
        }

        /**
         * Fallback mechanism to get latest articles
         * @param {Array<Object>} others Candidate articles
         * @param {Number} maxItems Maximum items
         * @returns {Array<Object>}
         */
        getLatestFallback(others, maxItems) {
            return others
                .sort((a, b) => new Date(b.published || b.date || 0) - new Date(a.published || a.date || 0))
                .slice(0, maxItems)
                .map(item => ({ ...item, _badgeType: '最新研報' }));
        }

        /**
         * Compute correlation score between candidate and current article
         * @param {Object} item Candidate article
         * @param {Object} current Current article
         * @param {Object} [customWeights] Optional weights override
         * @returns {{ score: Number, reasons: Array<String> }}
         */
        computeScore(item, current, customWeights) {
            const w = customWeights || this.weights || DEFAULT_WEIGHTS;
            let score = 0;
            const reasons = [];

            // 0. Core Topic Match (Highest Semantic Cohesion)
            if (item.topicId && current.topicId && item.topicId === current.topicId) {
                const topicWeight = w.topic || 40;
                score += topicWeight;
                reasons.push(`topic(${topicWeight})`);
                item._isSameTopic = true;
            }

            // 2. Category Match
            if (item.category && current.category && item.category === current.category) {
                score += w.category;
                reasons.push(`category(${w.category})`);
            }

            // 3. Tag Match
            const iTags = item.tags && Array.isArray(item.tags) ? item.tags : (item.tag ? [item.tag] : []);
            const cTags = current.tags && Array.isArray(current.tags) ? current.tags : (current.tag ? [current.tag] : []);
            const tagIntersection = iTags.filter(t => cTags.includes(t));
            if (tagIntersection.length > 0) {
                const tagScore = Math.min(w.tag * 1.5, tagIntersection.length * w.tag);
                score += tagScore;
                reasons.push(`tags:${tagIntersection.join('|')}(${tagScore.toFixed(1)})`);
            }

            // 4. Mentions Similarity (Wikidata / Entity URIs)
            if (item.mentions && current.mentions && Array.isArray(item.mentions) && Array.isArray(current.mentions)) {
                const currentMentionNames = current.mentions.map(m => m.name);
                const currentMentionURIs = current.mentions.filter(m => m.sameAs).map(m => m.sameAs);

                item.mentions.forEach(m => {
                    if (m.sameAs && currentMentionURIs.includes(m.sameAs)) {
                        score += w.mentions;
                        reasons.push(`mention:${m.name}(${w.mentions})`);
                    } else if (m.name && currentMentionNames.includes(m.name)) {
                        const s = w.mentions * 0.7;
                        score += s;
                        reasons.push(`mention:${m.name}(${s.toFixed(1)})`);
                    }
                });
            }

            // 5. Keywords Intersection
            if (item.keywords && current.keywords) {
                const iKeywords = (typeof item.keywords === 'string' ? item.keywords : '').split(/[,、|;\s]+/).map(k => k.trim());
                const cKeywords = (typeof current.keywords === 'string' ? current.keywords : '').split(/[,、|;\s]+/).map(k => k.trim());
                
                const intersection = iKeywords.filter(k => k.length > 1 && cKeywords.includes(k));
                if (intersection.length > 0) {
                    const s = Math.min(w.keywords * 2, intersection.length * w.keywords);
                    score += s;
                    reasons.push(`keywords:${intersection.join('|')}(${s})`);
                }
            }

            // 6. Exponential Time Decay Factor
            const publishedStr = item.published || item.date || item.modified;
            if (publishedStr) {
                const recencyScore = this.calculateTimeDecay(publishedStr, w.recencyMax);
                if (recencyScore > 0) {
                    score += recencyScore;
                    reasons.push(`recency(${recencyScore.toFixed(1)})`);
                }
            }

            return { score, reasons };
        }

        /**
         * Calculate Exponential Time Decay
         * @param {String} dateStr ISO date string
         * @param {Number} [recencyMax=15] Max bonus
         * @returns {Number} Score bonus (0 to recencyMax)
         */
        calculateTimeDecay(dateStr, recencyMax) {
            try {
                const pubDate = new Date(dateStr);
                if (isNaN(pubDate.getTime())) return 0;
                // Dynamic reference date: current time
                const refDate = new Date();
                const daysDiff = Math.max(0, (refDate.getTime() - pubDate.getTime()) / (1000 * 3600 * 24));
                const max = recencyMax !== undefined ? recencyMax : (this.weights.recencyMax || DEFAULT_WEIGHTS.recencyMax);
                // Half-life ~45 days (decay factor 0.015)
                return max * Math.exp(-0.015 * daysDiff);
            } catch (e) {
                return 0;
            }
        }

        _log(level, msg) {
            if (this.logger) {
                this.logger(level, msg);
            } else if (this.debug) {
                console[level](`[ArticleRecommender] ${msg}`);
            }
        }

        // Static facade helpers for convenience
        static getRelatedItems(params) {
            return new ArticleRecommender(params).getRelatedItems(params);
        }

        static computeScore(item, current, weights) {
            return new ArticleRecommender({ weights }).computeScore(item, current, weights);
        }

        static calculateTimeDecay(dateStr, recencyMax) {
            return new ArticleRecommender().calculateTimeDecay(dateStr, recencyMax);
        }
    }

    ArticleRecommender.DEFAULT_WEIGHTS = DEFAULT_WEIGHTS;

    // Export to global scope
    global.ArticleRecommender = ArticleRecommender;
    global.AlgoArticleRecommender = ArticleRecommender;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
