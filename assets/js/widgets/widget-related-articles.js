/**
 * Related Articles Component (Institutional Knowledge Discovery Engine)
 * @class RelatedArticlesComponent
 * @description Renders a dynamic list of related blog posts with hybrid quota allocation 
 * (Same Series/Category + Cross-Domain + Time Decay Factor).
 * Decoupled host component: delegates algorithm scoring to ArticleRecommender
 * and CSS generation to RelatedArticlesStyles.
 * Uses Shadow DOM (closed mode) for encapsulation and guarantees zero global CSS pollution.
 */
(function (global) {
    "use strict";

    class RelatedArticlesComponent {
        constructor() {
            // Configuration Options
            this._config = {
                containerId: 'related-articles-container',
                currentArticleId: (typeof document !== 'undefined' && document.body && document.body.dataset.articleId) || '',
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
            this.recommender = null;
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

            // 4. Find Related Items via Decoupled Recommender Engine
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
         * Recommendation logic delegated to ArticleRecommender
         * @returns {Array<Object>} List of ranked article objects
         */
        _getRelatedItems() {
            const RecommenderClass = global.ArticleRecommender || global.AlgoArticleRecommender;

            if (RecommenderClass) {
                const recommender = new RecommenderClass({
                    weights: this._config.weights,
                    debug: this._config.debug,
                    logger: (lvl, msg) => this._log(lvl, msg)
                });

                return recommender.getRelatedItems({
                    dataSource: this.dataSource,
                    currentArticleId: this._config.currentArticleId,
                    entityName: this._config.entityName,
                    maxItems: this._config.maxItems,
                    weights: this._config.weights
                });
            }

            // Fallback if algo-article-recommender.js is not loaded
            this._log('warn', 'ArticleRecommender not detected, using fallback latest items.');
            const currentId = this._config.currentArticleId;
            return this.dataSource
                .filter(a => a && a.id !== currentId)
                .sort((a, b) => new Date(b.published || b.date || 0) - new Date(a.published || a.date || 0))
                .slice(0, this._config.maxItems)
                .map(item => ({ ...item, _badgeType: '最新研報' }));
        }

        /**
         * Render the Shadow DOM content
         */
        _render(items) {
            const basePath = this._getBasePath();
            const isList = this._config.layout === 'list';

            // Styles Injection from Styles Module
            const style = document.createElement('style');
            if (global.RelatedArticlesStyles && typeof global.RelatedArticlesStyles.getStyles === 'function') {
                style.textContent = global.RelatedArticlesStyles.getStyles(isList);
            } else {
                // Inline minimalist fallback
                style.textContent = `:host { display: block; } .card-grid { display: grid; gap: 1rem; }`;
            }
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

        /**
         * Resolve badge colors using Styles module
         */
        _getBadgeColor(badgeType, fallbackHex) {
            if (global.RelatedArticlesStyles && typeof global.RelatedArticlesStyles.getBadgeColor === 'function') {
                return global.RelatedArticlesStyles.getBadgeColor(badgeType, fallbackHex);
            }
            return { hex: fallbackHex || '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' };
        }

        /**
         * Path resolver for cross-directory links
         */
        _getBasePath() {
            if (typeof window === 'undefined' || !window.location) return './';
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
            this._config.maxItems = parseInt(count, 10) || 3;
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

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
