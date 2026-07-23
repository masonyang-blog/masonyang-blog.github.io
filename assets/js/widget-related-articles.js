/**
 * Related Articles Component
 * @class RelatedArticlesComponent
 * @description Renders a list of related blog posts with support for 'grid' and 'list' layouts.
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
                    series: 50,
                    tag: 20,
                    category: 15,
                    mentions: 10,
                    keywords: 5,
                    recencyBase: 10
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

            // 3. Setup Shadow DOM (Always use 'open' to allow presence check)
            if (!this.hostElement.shadowRoot) {
                this.shadowRoot = this.hostElement.attachShadow({ mode: 'open' });
            } else {
                this.shadowRoot = this.hostElement.shadowRoot;
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
         * Recommendation logic
         * @returns {Array} List of filtered article objects
         */
        _getRelatedItems() {
            const dataSource = this.dataSource;
            const currentId = this._config.currentArticleId;
            const entityName = this._config.entityName;

            // 1. Filter out current article
            const others = dataSource.filter(a => a.id !== currentId);

            // 2. Filter by Entity if provided (Legacy Knowledge Card Support)
            if (entityName) {
                const entityMatch = others.filter(a => {
                    const mentionsMatch = a.mentions && a.mentions.some(m => m.name === entityName);
                    const keywordsMatch = a.keywords && (typeof a.keywords === 'string' ? a.keywords : '').includes(entityName);
                    const titleMatch = a.title && a.title.includes(entityName);
                    return mentionsMatch || keywordsMatch || titleMatch;
                });

                if (entityMatch.length > 0) {
                    return entityMatch.slice(0, this._config.maxItems);
                }
            }

            // 3. Dynamic Weighted Recommendation
            const currentArticle = dataSource.find(a => a.id === currentId);
            
            if (!currentArticle) {
                this._log('info', 'Current article not found, falling back to latest.');
                return others.slice(-this._config.maxItems).reverse();
            }

            // Map articles to scores
            const scoredItems = others.map(article => {
                const score = this._computeScore(article, currentArticle);
                return { ...article, _score: score };
            });

            // Sort by score descending
            scoredItems.sort((a, b) => b._score - a._score);

            if (this._config.debug) {
                this._log('info', 'Scored related items:');
                scoredItems.slice(0, this._config.maxItems).forEach(item => {
                    console.log(`- [${item._score.toFixed(1)}] ${item.title} (ID: ${item.id}) | Reasons: ${item._reasons.join(', ')}`);
                });
            }

            return scoredItems.slice(0, this._config.maxItems);
        }

        /**
         * Compute correlation score between two articles
         * @param {Object} item Candidate article
         * @param {Object} current Current article
         * @returns {Number} Calculated score
         */
        _computeScore(item, current) {
            const w = this._config.weights;
            let score = 0;
            const reasons = [];

            // 1. Series Match (Highest Priority)
            if (item.series && current.series && item.series === current.series) {
                score += w.series;
                reasons.push(`series(${w.series})`);
            }

            // 2. Category & Tag Match
            if (item.category === current.category) {
                score += w.category;
                reasons.push(`category(${w.category})`);
            }
            // 支援複數標籤交集計分
            const iTags = item.tags && Array.isArray(item.tags) ? item.tags : (item.tag ? [item.tag] : []);
            const cTags = current.tags && Array.isArray(current.tags) ? current.tags : (current.tag ? [current.tag] : []);
            const tagIntersection = iTags.filter(t => cTags.includes(t));
            if (tagIntersection.length > 0) {
                const tagScore = Math.min(w.tag * 1.5, tagIntersection.length * w.tag);
                score += tagScore;
                reasons.push(`tags:${tagIntersection.join('|')}(${tagScore.toFixed(1)})`);
            } else if (item.tag === current.tag) {
                score += w.tag;
                reasons.push(`tag(${w.tag})`);
            }

            // 3. Mentions Similarity (Semantic)
            if (item.mentions && current.mentions) {
                const currentMentionNames = current.mentions.map(m => m.name);
                const currentMentionURIs = current.mentions.filter(m => m.sameAs).map(m => m.sameAs);

                item.mentions.forEach(m => {
                    if (currentMentionURIs.includes(m.sameAs)) {
                        score += w.mentions;
                        reasons.push(`mention:${m.name}(${w.mentions})`);
                    } else if (currentMentionNames.includes(m.name)) {
                        const s = (w.mentions * 0.7);
                        score += s;
                        reasons.push(`mention:${m.name}(${s.toFixed(1)})`);
                    }
                });
            }

            // 4. Keywords Intersection
            if (item.keywords && current.keywords) {
                const iKeywords = (typeof item.keywords === 'string' ? item.keywords : '').split(',').map(k => k.trim());
                const cKeywords = (typeof current.keywords === 'string' ? current.keywords : '').split(',').map(k => k.trim());
                
                const intersection = iKeywords.filter(k => k.length > 1 && cKeywords.includes(k));
                if (intersection.length > 0) {
                    const s = (intersection.length * w.keywords);
                    score += s;
                    reasons.push(`keywords:${intersection.join('|')}(${s})`);
                }
            }

            // 5. Recency Bonus (Index-based decay)
            score += 0.01; 

            // Save details for debug if needed
            item._reasons = reasons;
            return score;
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

                // 優先使用新標籤陣列的第一個標籤作為主要展示
                const primaryTag = (item.tags && Array.isArray(item.tags) && item.tags.length > 0) ? item.tags[0] : item.tag;
                let tagInfo = global.TaxonomyConfig ? global.TaxonomyConfig.getTag(primaryTag) : { text: primaryTag || '專業文章', hex: '#64748b' };

                if (isList) {
                    link.innerHTML = `
                        <span class="dot" style="background-color: ${tagInfo.hex};"></span>
                        <div class="list-meta">
                            <span class="list-category" style="color: ${tagInfo.hex};">${tagInfo.text}</span>
                            <span class="link-title">${item.title}</span>
                        </div>
                    `;
                } else {
                    link.innerHTML = `
                        <div class="card-header">
                            <span class="tag" style="color: ${tagInfo.hex};">${tagInfo.text}</span>
                            <span class="date">${item.published || ''}</span>
                        </div>
                        <div class="title">${item.title}</div>
                        <div class="desc">${item.desc || ''}</div>
                        <div class="meta">深入解析 <span>&rarr;</span></div>
                    `;
                }
                wrapper.appendChild(link);
            });

            container.appendChild(wrapper);
            this.shadowRoot.appendChild(container);
        }

        _getStyles(isList) {
            const colors = {
                slate900: '#0f172a',
                slate800: '#1e293b',
                slate700: '#334155',
                slate500: '#64748b',
                slate400: '#94a3b8',
                slate200: '#e2e8f0',
                blue500: '#3b82f6',
                orange500: '#f97316'
            };

            if (isList) {
                return `
                    :host { display: block; font-family: 'Inter', system-ui, sans-serif; }
                    .link-list { display: flex; flex-direction: column; }
                    .list-item {
                        display: flex;
                        align-items: flex-start;
                        gap: 0.5rem;
                        padding: 0.75rem 1rem;
                        text-decoration: none;
                        color: #475569; /* slate-600 */
                        font-size: 0.75rem; /* text-xs */
                        font-weight: 400;
                        transition: all 0.2s ease;
                        border-bottom: 1px solid rgba(226, 232, 240, 0.5); /* slate-200 with transparency */
                        line-height: 1.5;
                    }
                    .list-item:last-child { border-bottom: none; }
                    .list-item:hover {
                        background-color: #f8fafc; /* slate-50 */
                        color: ${colors.blue500};
                    }
                    .dot {
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        margin-top: 0.35rem;
                        flex-shrink: 0;
                    }
                    .link-title { 
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        flex: 1;
                    }
                    .list-meta {
                        display: flex;
                        flex-direction: column;
                        gap: 0.125rem;
                    }
                    .list-category {
                        font-size: 0.6rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        opacity: 0.6;
                        margin-bottom: 0.1rem;
                    }
 
                    :host-context(html.dark) .list-item {
                        color: #cbd5e1; /* slate-300 */
                        border-color: rgba(51, 65, 85, 0.4); /* slate-700 with transparency */
                    }
                    :host-context(html.dark) .list-item:hover {
                        background-color: rgba(51, 65, 85, 0.3); /* slate-700/30 */
                        color: #60a5fa; /* blue-400 */
                    }
                `;
            }

            return `
                :host { display: block; font-family: 'Inter', system-ui, sans-serif; margin-top: 2rem; }
                .section-title { font-size: 1.125rem; font-weight: 700; color: ${colors.slate900}; margin-bottom: 1.25rem; padding-bottom: 0.5rem; border-bottom: 2px solid ${colors.slate200}; }
                .card-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
                @media (min-width: 768px) { .card-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (min-width: 1200px) { .card-grid { grid-template-columns: repeat(3, 1fr); } }
                .card { background: white; border: 1px solid ${colors.slate200}; border-radius: 0.75rem; padding: 1rem; transition: all 0.2s ease; text-decoration: none; display: flex; flex-direction: column; height: 100%; box-sizing: border-box; }
                .card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border-color: ${colors.slate400}; }
                .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; font-size: 0.7rem; }
                .tag { font-weight: 700; letter-spacing: 0.05em; }
                .date { color: ${colors.slate400}; }
                .title { font-size: 1rem; font-weight: 700; color: ${colors.slate900}; margin-bottom: 0.5rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .desc { font-size: 0.8rem; color: ${colors.slate500}; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 1rem; flex-grow: 1; }
                .meta { font-size: 0.8rem; font-weight: 600; color: ${colors.blue500}; display: flex; align-items: center; }
                .meta span { margin-left: 0.25rem; transition: transform 0.2s ease; }
                .card:hover .meta span { transform: translateX(4px); }

                :host-context(html.dark) .section-title { color: #f1f5f9; border-color: ${colors.slate700}; }
                :host-context(html.dark) .card { background-color: ${colors.slate800}; border-color: ${colors.slate700}; }
                :host-context(html.dark) .title { color: #f1f5f9; }
                :host-context(html.dark) .desc { color: ${colors.slate400}; }
            `;
        }

        _getTagColor(tagColor) {
            if (!tagColor) return "#3b82f6";
            if (tagColor.includes('violet')) return '#8b5cf6';
            if (tagColor.includes('orange')) return '#f97316';
            if (tagColor.includes('amber')) return '#f59e0b';
            if (tagColor.includes('green')) return '#22c55e';
            if (tagColor.includes('pink')) return '#ec4899';
            if (tagColor.includes('emerald')) return '#10b981';
            return "#3b82f6";
        }

        /**
         * Path resolver
         */
        _getBasePath() {
            const path = window.location.pathname;
            if (path.includes('/post/') || path.includes('/project/') || path.includes('/news/') || path.includes('/knowledge/')) {
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

