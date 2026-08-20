/**
 * Related Articles Component (Institutional Knowledge Discovery Engine)
 * @class RelatedArticlesComponent
 * @description Renders a dynamic list of related blog posts with hybrid quota allocation 
 * (Same Series/Category + Cross-Domain + Time Decay Factor).
 * Uses Shadow DOM for encapsulation and guarantees no global CSS pollution.
 */
(function (global) {
    "use strict";

    class RelatedArticlesComponent {
        constructor() {
            // Configuration Options
            this._config = {
                containerId: 'related-articles-container',
                currentArticleId: document.body.dataset.articleId || '',
                entityName: '', // Optional: Filter by entity name (for knowledge cards)
                maxItems: 3,
                layout: 'grid', // 'grid' (cards) or 'list' (minimal)
                showHeader: true,
                debug: false,
                weights: {
                    series: 35,
                    category: 15,
                    tag: 20,
                    mentions: 15,
                    keywords: 10,
                    recencyMax: 15
                }
            };

            this.dataSource = [];
            this.hostElement = null;
            this.shadowRoot = null;
        }

        /**
         * Initialize and render the component
         */
        init() {
            // 1. Locate Host Element
            this.hostElement = document.getElementById(this._config.containerId);
            if (!this.hostElement) {
                this._log('warn', `Host element '#${this._config.containerId}' not found.`);
                return this;
            }

            // 2. Load Data from Repositories if not manually set
            if (!this.dataSource || this.dataSource.length === 0) {
                this.dataSource = (global.ArticleRepository && global.ArticleRepository.all) ? global.ArticleRepository.all : [];
            }

            if (this.dataSource.length === 0) {
                this._log('warn', 'No articles found in repositories.');
                return this;
            }

            // 3. Setup Shadow DOM (Closed mode for encapsulation compliance)
            if (!this.shadowRoot) {
                this.shadowRoot = this.hostElement.attachShadow({ mode: 'closed' });
            } else {
                while (this.shadowRoot.firstChild) this.shadowRoot.removeChild(this.shadowRoot.firstChild);
            }

            // 4. Find Related Items
            const relatedItems = this._getRelatedItems();
            if (relatedItems.length === 0) {
                this._log('info', 'No related items found to display.');
                return this;
            }

            // 5. Render
            this._render(relatedItems);
            return this;
        }

        /**
         * Dynamic Recommendation logic with Hybrid Quota Allocation
         * @returns {Array} List of filtered article objects
         */
        _getRelatedItems() {
            const dataSource = this.dataSource;
            const currentId = this._config.currentArticleId;
            const entityName = this._config.entityName;
            const maxItems = this._config.maxItems;

            // 1. Filter out current article
            const others = dataSource.filter(a => a.id !== currentId);
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

            // 3. Dynamic Weighted Recommendation & Hybrid Quota Selection
            const currentArticle = dataSource.find(a => a.id === currentId);
            
            if (!currentArticle) {
                this._log('info', 'Current article not found, falling back to latest.');
                return this._getLatestFallback(others, maxItems);
            }

            // Score candidate articles
            const scoredItems = others.map(article => {
                const scoreObj = this._computeScore(article, currentArticle);
                return {
                    ...article,
                    _score: scoreObj.score,
                    _isSameSeries: Boolean(article.series && currentArticle.series && article.series === currentArticle.series),
                    _isSameCategory: Boolean(article.category && currentArticle.category && article.category === currentArticle.category),
                    _reasons: scoreObj.reasons
                };
            });

            // Classify into candidate pools
            const highRelevancePool = scoredItems
                .filter(a => a._isSameSeries || a._isSameCategory)
                .sort((a, b) => b._score - a._score);

            const crossDomainPool = scoredItems
                .filter(a => !a._isSameSeries && !a._isSameCategory && a._score > 0)
                .sort((a, b) => b._score - a._score);

            const latestFallbackPool = [...others]
                .sort((a, b) => new Date(b.published || b.date || 0) - new Date(a.published || a.date || 0));

            // Determine Quotas (e.g., 3 items => 2 High Relevance, 1 Cross Domain)
            let highQuota = Math.max(1, Math.ceil(maxItems * 0.65));
            let crossQuota = Math.max(1, maxItems - highQuota);

            const selected = [];
            const selectedIds = new Set();

            // 1. Fill High Relevance Slots
            highRelevancePool.forEach(item => {
                if (selected.length < highQuota && !selectedIds.has(item.id)) {
                    item._badgeType = item._isSameTrack ? '專題賽道' : (item._isSameSeries ? '同專題' : '同分類');
                    selected.push(item);
                    selectedIds.add(item.id);
                }
            });

            // 2. Fill Cross-Domain Slots
            crossDomainPool.forEach(item => {
                if (selected.length < (highQuota + crossQuota) && !selectedIds.has(item.id)) {
                    item._badgeType = '跨領域導讀';
                    selected.push(item);
                    selectedIds.add(item.id);
                }
            });

            // 3. Backfill from High Relevance Pool if Cross-Domain pool was insufficient
            if (selected.length < maxItems) {
                highRelevancePool.forEach(item => {
                    if (selected.length < maxItems && !selectedIds.has(item.id)) {
                        item._badgeType = item._isSameTrack ? '專題賽道' : (item._isSameSeries ? '同專題' : '熱門導讀');
                        selected.push(item);
                        selectedIds.add(item.id);
                    }
                });
            }

            // 4. Final Backfill from Latest Items
            if (selected.length < maxItems) {
                latestFallbackPool.forEach(item => {
                    if (selected.length < maxItems && !selectedIds.has(item.id)) {
                        item._badgeType = '最新研報';
                        selected.push(item);
                        selectedIds.add(item.id);
                    }
                });
            }

            if (this._config.debug) {
                this._log('info', 'Hybrid Quota Selected Items:');
                selected.forEach(item => {
                    console.log(`- [${item._badgeType} | Score: ${(item._score || 0).toFixed(1)}] ${item.title}`);
                });
            }

            return selected;
        }

        /**
         * Fallback mechanism to get latest articles
         */
        _getLatestFallback(others, maxItems) {
            return others
                .sort((a, b) => new Date(b.published || b.date || 0) - new Date(a.published || a.date || 0))
                .slice(0, maxItems)
                .map(item => ({ ...item, _badgeType: '最新研報' }));
        }

        /**
         * Compute correlation score between candidate and current article
         * @param {Object} item Candidate article
         * @param {Object} current Current article
         * @returns {Object} { score, reasons }
         */
        _computeScore(item, current) {
            const w = this._config.weights;
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
            if (item.category === current.category) {
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
                const recencyScore = this._calculateTimeDecay(publishedStr);
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
         * @returns {Number} Score bonus (0 to recencyMax)
         */
        _calculateTimeDecay(dateStr) {
            try {
                const pubDate = new Date(dateStr);
                if (isNaN(pubDate.getTime())) return 0;
                // Reference relative date or now
                const refDate = new Date("2026-08-02T00:00:00Z");
                const daysDiff = Math.max(0, (refDate.getTime() - pubDate.getTime()) / (1000 * 3600 * 24));
                // Half-life ~45 days (decay factor 0.015)
                return this._config.weights.recencyMax * Math.exp(-0.015 * daysDiff);
            } catch (e) {
                return 0;
            }
        }

        /**
         * Render the Shadow DOM content
         */
        _render(items) {
            const basePath = this._getBasePath();
            const isList = this._config.layout === 'list';

            // Styles
            const style = document.createElement('style');
            style.textContent = this._getStyles(isList);
            this.shadowRoot.appendChild(style);

            // Container
            const container = document.createElement('div');
            container.className = isList ? 'list-layout' : 'grid-layout';

            // Optional Header
            if (this._config.showHeader) {
                const title = document.createElement('h3');
                title.className = 'section-title';
                title.textContent = '延伸閱讀';
                container.appendChild(title);
            }

            // Items Wrapper
            const wrapper = document.createElement('div');
            wrapper.className = isList ? 'link-list' : 'card-grid';

            items.forEach(item => {
                const link = document.createElement('a');
                link.href = basePath + (item.link || '#');
                link.className = isList ? 'list-item' : 'card';

                const primaryTag = (item.tags && Array.isArray(item.tags) && item.tags.length > 0) ? item.tags[0] : item.tag;
                let tagInfo = global.TaxonomyConfig ? global.TaxonomyConfig.getTag(primaryTag) : { text: primaryTag || '專業文章', hex: '#3b82f6' };

                const badgeText = item._badgeType || '延伸閱讀';
                const badgeColor = this._getBadgeColor(badgeText, tagInfo.hex);

                if (isList) {
                    link.innerHTML = `
                        <span class="dot" style="background-color: ${badgeColor.hex};"></span>
                        <div class="list-meta">
                            <div class="list-badge-row">
                                <span class="list-category" style="color: ${tagInfo.hex};">${tagInfo.text}</span>
                                <span class="list-badge" style="color: ${badgeColor.hex}; background-color: ${badgeColor.bg};">${badgeText}</span>
                            </div>
                            <span class="link-title">${item.title}</span>
                        </div>
                    `;
                } else {
                    const descText = item.desc || item.description || '';
                    link.innerHTML = `
                        <div class="card-accent-bar" style="background: linear-gradient(90deg, ${badgeColor.hex}, transparent);"></div>
                        <div class="card-body">
                            <div class="card-header">
                                <span class="tag-badge" style="color: ${tagInfo.hex}; background-color: ${tagInfo.hex}15; border: 1px solid ${tagInfo.hex}30;">${tagInfo.text}</span>
                                <span class="recommend-badge" style="color: ${badgeColor.hex}; background-color: ${badgeColor.bg}; border: 1px solid ${badgeColor.hex}40;">${badgeText}</span>
                            </div>
                            <div class="title">${item.title}</div>
                            ${descText ? `<div class="desc">${descText}</div>` : ''}
                            <div class="meta">
                                <span>${item.published || item.date || '深入解析'}</span>
                                <svg class="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                            </div>
                        </div>
                    `;
                }
                wrapper.appendChild(link);
            });

            container.appendChild(wrapper);
            this.shadowRoot.appendChild(container);
        }

        _getBadgeColor(badgeType, fallbackHex) {
            if (badgeType === '跨領域導讀') return { hex: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' };
            if (badgeType === '同專題') return { hex: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' };
            if (badgeType === '同分類') return { hex: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' };
            if (badgeType === '最新研報') return { hex: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
            return { hex: fallbackHex || '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' };
        }

        _getStyles(isList) {
            const colors = {
                slate900: '#0f172a',
                slate800: '#1e293b',
                slate700: '#334155',
                slate500: '#64748b',
                slate400: '#94a3b8',
                slate200: '#e2e8f0',
                blue500: '#3b82f6'
            };

            if (isList) {
                return `
                    :host { display: block; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                    .link-list { display: flex; flex-direction: column; }
                    .list-item {
                        display: flex;
                        align-items: flex-start;
                        gap: 0.5rem;
                        padding: 0.75rem 1rem;
                        text-decoration: none;
                        color: #475569;
                        font-size: 0.8rem;
                        font-weight: 400;
                        transition: all 0.2s ease;
                        border-bottom: 1px solid rgba(226, 232, 240, 0.5);
                        line-height: 1.5;
                    }
                    .list-item:last-child { border-bottom: none; }
                    .list-item:hover {
                        background-color: #f8fafc;
                        color: ${colors.blue500};
                    }
                    .dot {
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        margin-top: 0.4rem;
                        flex-shrink: 0;
                    }
                    .link-title { 
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        flex: 1;
                        font-weight: 600;
                    }
                    .list-meta {
                        display: flex;
                        flex-direction: column;
                        gap: 0.2rem;
                        width: 100%;
                    }
                    .list-badge-row {
                        display: flex;
                        align-items: center;
                        gap: 0.4rem;
                    }
                    .list-category {
                        font-size: 0.65rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                    .list-badge {
                        font-size: 0.6rem;
                        font-weight: 600;
                        padding: 0.05rem 0.35rem;
                        border-radius: 0.25rem;
                        letter-spacing: 0.02em;
                    }

                    :host-context(html.dark) .list-item {
                        color: #cbd5e1;
                        border-color: rgba(51, 65, 85, 0.4);
                    }
                    :host-context(html.dark) .list-item:hover {
                        background-color: rgba(51, 65, 85, 0.3);
                        color: #60a5fa;
                    }
                `;
            }

            return `
                :host { display: block; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-top: 2.5rem; }
                .section-title { 
                    font-size: 1.15rem; 
                    font-weight: 700; 
                    color: var(--c-text-primary, ${colors.slate900}); 
                    margin-bottom: 1.25rem; 
                    padding-bottom: 0.6rem; 
                    border-bottom: 1px solid var(--c-border, ${colors.slate200});
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .card-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
                    gap: 1.25rem; 
                }
                @media (min-width: 1024px) {
                    .card-grid { grid-template-columns: repeat(3, 1fr); }
                }
                .card { 
                    position: relative;
                    background: var(--c-bg-card, #ffffff); 
                    border: 1px solid var(--c-border, ${colors.slate200}); 
                    border-radius: 0.85rem; 
                    overflow: hidden;
                    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); 
                    text-decoration: none; 
                    display: flex; 
                    flex-direction: column; 
                    box-sizing: border-box; 
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
                }
                .card:hover { 
                    transform: translateY(-3px); 
                    box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.12); 
                    border-color: rgba(59, 130, 246, 0.4); 
                }
                .card-accent-bar {
                    height: 3px;
                    width: 100%;
                    opacity: 0.85;
                }
                .card-body {
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }
                .card-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 0.75rem; 
                }
                .tag-badge { 
                    font-size: 0.68rem;
                    font-weight: 700; 
                    letter-spacing: 0.04em; 
                    padding: 0.2rem 0.55rem;
                    border-radius: 0.375rem;
                    text-transform: uppercase;
                }
                .recommend-badge {
                    font-size: 0.65rem;
                    font-weight: 600;
                    padding: 0.15rem 0.45rem;
                    border-radius: 0.3rem;
                }
                .title { 
                    font-size: 0.95rem; 
                    font-weight: 700; 
                    color: var(--c-text-primary, ${colors.slate900}); 
                    margin-bottom: 0.6rem; 
                    line-height: 1.45; 
                    display: -webkit-box; 
                    -webkit-line-clamp: 2; 
                    -webkit-box-orient: vertical; 
                    overflow: hidden; 
                }
                .desc { 
                    font-size: 0.8rem; 
                    color: var(--c-text-secondary, ${colors.slate500}); 
                    line-height: 1.55; 
                    display: -webkit-box; 
                    -webkit-line-clamp: 2; 
                    -webkit-box-orient: vertical; 
                    overflow: hidden; 
                    margin-bottom: 1.25rem; 
                    flex-grow: 1; 
                }
                .meta { 
                    font-size: 0.8rem; 
                    font-weight: 600; 
                    color: #3b82f6; 
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between;
                    margin-top: auto;
                }
                .arrow-icon { 
                    transition: transform 0.2s ease; 
                }
                .card:hover .arrow-icon { 
                    transform: translateX(4px); 
                }

                :host-context(html.dark) .card { 
                    background: var(--c-bg-card, ${colors.slate800}); 
                    border-color: var(--c-border, ${colors.slate700}); 
                }
                :host-context(html.dark) .card:hover {
                    box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.4);
                }
            `;
        }

        /**
         * Path resolver
         */
        _getBasePath() {
            const path = window.location.pathname;
            if (['post/', 'project/', 'news/', 'knowledge/'].some(dir => path.includes(dir))) {
                return '../';
            }
            return './';
        }

        _log(level, msg) {
            if (this._config.debug) {
                console[level](`[RelatedArticles] ${msg}`);
            }
        }

        // --- Chainable Setters ---

        setContainerId(id) {
            this._config.containerId = id;
            return this;
        }

        setCurrentArticleId(id) {
            this._config.currentArticleId = id;
            return this;
        }

        setEntityName(name) {
            this._config.entityName = name;
            return this;
        }

        setLimit(count) {
            this._config.maxItems = parseInt(count) || 3;
            return this;
        }

        setLayout(layout) {
            this._config.layout = layout;
            return this;
        }

        setShowHeader(show) {
            this._config.showHeader = !!show;
            return this;
        }

        setDebug(enabled) {
            this._config.debug = !!enabled;
            return this;
        }
    }

    // Export both names for maximum compatibility
    global.RelatedArticlesComponent = RelatedArticlesComponent;
    global.WidgetRelatedArticles = RelatedArticlesComponent; // Alias

})(window);
