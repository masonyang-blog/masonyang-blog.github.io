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
        series: 35,
        category: 15,
        tag: 20,
        mentions: 15,
        keywords: 10,
        recencyMax: 15
    };

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
            const maxItems = params.maxItems || 3;
            const weights = Object.assign({}, this.weights, params.weights || {});

            // 1. Filter out current article
            const others = dataSource.filter(a => a && a.id !== currentId);
            if (others.length === 0) return [];

            // 2. Filter by Entity if explicitly requested (Legacy Knowledge Card Support)
            if (entityName) {
                const entityMatch = others.filter(a => {
                    const mentionsMatch = a.mentions && a.mentions.some(m => m.name === entityName);
                    const keywordsMatch = a.keywords && (typeof a.keywords === 'string' ? a.keywords : '').includes(entityName);
                    const titleMatch = a.title && a.title.includes(entityName);
                    return mentionsMatch || keywordsMatch || titleMatch;
                });

                if (entityMatch.length > 0) {
                    return entityMatch.slice(0, maxItems).map(item => ({ ...item, _badgeType: '實體關聯' }));
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
                    _isSameSeries: Boolean(article.series && currentArticle.series && article.series === currentArticle.series),
                    _isSameCategory: Boolean(article.category && currentArticle.category && article.category === currentArticle.category),
                    _isSameTrack: Boolean(article.trackId && currentArticle.trackId && article.trackId === currentArticle.trackId),
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

            // 0. Topic Track Match (Highest Semantic Cohesion)
            if (item.trackId && current.trackId && item.trackId === current.trackId) {
                const trackWeight = 40;
                score += trackWeight;
                reasons.push(`track(${trackWeight})`);
                item._isSameTrack = true;
            }

            // 1. Series Match
            if (item.series && current.series && item.series === current.series) {
                score += w.series;
                reasons.push(`series(${w.series})`);
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
