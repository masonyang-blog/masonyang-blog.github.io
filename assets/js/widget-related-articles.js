/**
 * Related Articles Component
 * @class WidgetRelatedArticles
 * @description Renders a list of related blog posts using core-articles-data.js.
 * Uses Shadow DOM for encapsulation and guarantees no global CSS pollution.
 */
(function (global) {
    "use strict";

    class WidgetRelatedArticles {
        /**
         * @param {HTMLElement} hostElement - The DOM element to attach to
         * @param {string} currentArticleId - ID of the current page's article (to exclude)
         * @param {Array} dataSource - Array of article objects (core-articles-data.js)
         * @param {Array} topicArticles - Optional separate list of topic articles (for backwards compatibility)
         */
        constructor(hostElement, currentArticleId, dataSource, topicArticles = []) {
            this.hostElement = hostElement;
            this.currentArticleId = currentArticleId;

            // Default to central repositories if undefined
            if (!dataSource) {
                const articleRepo = (global.ArticleRepository && global.ArticleRepository.all) ? global.ArticleRepository.all : [];
                const newsRepo = (global.NewsRepository && global.NewsRepository.all) ? global.NewsRepository.all : [];
                this.dataSource = [...articleRepo, ...newsRepo];
            } else {
                this.dataSource = dataSource;
            }

            // Configuration Options
            this._config = {
                debug: false,
                maxItems: 3
            };

            if (!this.hostElement) {
                console.warn('WidgetRelatedArticles: Host element provided is null');
                return;
            }

            // Create Shadow DOM
            this.shadowRoot = this.hostElement.attachShadow({ mode: 'closed' });
        }

        /**
         * Initialize and render the component
         */
        init() {
            if (!this.dataSource || this.dataSource.length === 0) {
                this._log('warn', 'No data source provided or empty');
                return this;
            }

            // Fallback for ID if not passed perfectly
            if (!this.currentArticleId && document.body.dataset) {
                this.currentArticleId = document.body.dataset.articleId || document.body.dataset.assetId || '';
            }

            // 1. Find the current article metadata
            const currentArticle = this.dataSource.find(a => a.id === this.currentArticleId);
            let relatedItems = [];

            // 2. Intelligent filtering algorithm
            if (currentArticle) {
                const others = this.dataSource.filter(a => a.id !== this.currentArticleId);

                // Check if this is a knowledge page with manually specified articles
                const knlRepo = global.CoreKnowledgeRepository;
                const knlItem = knlRepo ? knlRepo.all.find(k => k.id === this.currentArticleId || k.id === document.body.dataset.knowledgeId) : null;
                
                if (knlItem && knlItem.relatedPostIds && knlItem.relatedPostIds.length > 0) {
                    // Priority 0: Manually specified articles
                    relatedItems = knlItem.relatedPostIds.map(id => this.dataSource.find(a => a.id === id)).filter(Boolean);
                    
                    // Fill if less than maxItems
                    if (relatedItems.length < this._config.maxItems) {
                        const fill = others.filter(a => !knlItem.relatedPostIds.includes(a.id)).slice(0, this._config.maxItems - relatedItems.length);
                        relatedItems = [...relatedItems, ...fill];
                    }
                } else {
                    // Priority 1: Exact match on Category + Tag
                    const tier1 = others.filter(a => a.category === currentArticle.category && a.tag === currentArticle.tag);

                    // Priority 2: Match on Category only
                    const tier2 = others.filter(a => a.category === currentArticle.category && a.tag !== currentArticle.tag);

                    // Priority 3: Anything else (latest)
                    const tier3 = others.filter(a => a.category !== currentArticle.category);

                    relatedItems = [...tier1, ...tier2, ...tier3].slice(0, this._config.maxItems);
                }
            } else {
                // If the current article is not registered in core-articles-data, 
                // but might be a knowledge page
                const knlRepo = global.CoreKnowledgeRepository;
                const knowledgeId = document.body.dataset.knowledgeId;
                const knlItem = knlRepo ? knlRepo.all.find(k => k.id === knowledgeId) : null;

                if (knlItem && knlItem.relatedPostIds) {
                    relatedItems = knlItem.relatedPostIds.map(id => this.dataSource.find(a => a.id === id)).filter(Boolean);
                } else {
                    // General recommendations
                    this._log('info', `Current article ID '${this.currentArticleId}' not found, showing general recommendations.`);
                    relatedItems = this.dataSource.filter(a => a.id !== this.currentArticleId).slice(-this._config.maxItems).reverse();
                }
            }

            if (relatedItems.length === 0) {
                this._log('info', 'No related items found to display.');
                return this;
            }

            // 3. Render Shadow UI
            this._render(relatedItems);
            return this;
        }

        /**
         * Re-routing absolute/relative path based on the current URL
         * @returns {string} The relative prefix (e.g. '../' or './')
         */
        _getBasePath() {
            const path = window.location.pathname;
            // Typical folder structure: project/, post/, news/, knowledge/
            if (path.includes('/post/') || path.includes('/project/') || path.includes('/news/') || path.includes('/knowledge/')) {
                return '../';
            }
            return './';
        }

        /**
         * Render the Shadow DOM element
         * @param {Array} items
         */
        _render(items) {
            const basePath = this._getBasePath();

            // Styles specific for Related Articles (matching widget-related-coins but tailored)
            const style = document.createElement('style');
            style.textContent = `
                :host {
                    display: block;
                    font-family: 'Inter', system-ui, sans-serif;
                    margin-top: 2rem;
                }
                
                .section-title {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: #0f172a; /* slate-900 */
                    margin-bottom: 1.25rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid #e2e8f0;
                }

                .grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.25rem;
                }

                /* Responsive grid for main content areas (not sidebar) */
                @media (min-width: 768px) {
                    :host(:not([data-sidebar])) .grid { grid-template-columns: repeat(2, 1fr); }
                }

                @media (min-width: 1200px) {
                    :host(:not([data-sidebar])) .grid { grid-template-columns: repeat(3, 1fr); }
                }

                .card {
                    background: white;
                    border: 1px solid #e2e8f0; /* slate-200 */
                    border-radius: 0.75rem;
                    padding: 1rem;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    box-sizing: border-box;
                }

                .card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    border-color: #cbd5e1;
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                    font-size: 0.7rem;
                }

                .tag {
                    font-weight: 700;
                    letter-spacing: 0.05em;
                }

                .date {
                    color: #94a3b8; /* slate-400 */
                }

                .title {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #0f172a; /* slate-900 */
                    margin-bottom: 0.5rem;
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .desc {
                    font-size: 0.8rem;
                    color: #64748b; /* slate-500 */
                    line-height: 1.6;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    margin-bottom: 1rem;
                    flex-grow: 1;
                }

                .meta {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #3b82f6; /* blue-500 */
                    display: flex;
                    align-items: center;
                }

                .meta span {
                    margin-left: 0.25rem;
                    transition: transform 0.2s ease;
                }

                .card:hover .meta span {
                    transform: translateX(4px);
                }

                /* Dark Mode Support */
                :host-context(html.dark) .section-title {
                    color: #f1f5f9;
                    border-color: #334155;
                }

                :host-context(html.dark) .card {
                    background-color: #1e293b; /* slate-800 */
                    border-color: #334155;
                }

                :host-context(html.dark) .title {
                    color: #f1f5f9;
                }

                :host-context(html.dark) .desc {
                    color: #94a3b8;
                }
            `;
            this.shadowRoot.appendChild(style);

            // Container
            const container = document.createElement('div');

            // Title
            const title = document.createElement('h3');
            title.className = 'section-title';
            title.textContent = '延伸閱讀';
            container.appendChild(title);

            // Grid
            const grid = document.createElement('div');
            grid.className = 'grid';

            items.forEach(item => {
                const link = document.createElement('a');
                // Construct the full relative path safely
                link.href = basePath + (item.link || '#');
                link.className = 'card';

                // Reconstruct exact color classes
                let tagHex = "#3b82f6"; // Default Blue
                if (item.tagColor) {
                    if (item.tagColor.includes('violet')) tagHex = '#8b5cf6';
                    else if (item.tagColor.includes('orange')) tagHex = '#f97316';
                    else if (item.tagColor.includes('amber')) tagHex = '#f59e0b';
                    else if (item.tagColor.includes('green')) tagHex = '#22c55e';
                    else if (item.tagColor.includes('pink')) tagHex = '#ec4899';
                    else if (item.tagColor.includes('emerald')) tagHex = '#10b981';
                }

                link.innerHTML = `
                    <div class="card-header">
                        <span class="tag" style="color: ${tagHex};">${item.tag || '專案評測'}</span>
                        <span class="date">${item.published || ''}</span>
                    </div>
                    <div class="title">${item.title}</div>
                    <div class="desc">${item.desc}</div>
                    <div class="meta">深入解析 <span>&rarr;</span></div>
                `;
                grid.appendChild(link);
            });

            container.appendChild(grid);
            this.shadowRoot.appendChild(container);
        }

        _log(level, msg) {
            if (this._config.debug) {
                console[level](`[WidgetRelatedArticles] ${msg}`);
            }
        }

        // --- Chainable Setters ---

        setDebug(enabled) {
            this._config.debug = !!enabled;
            return this;
        }

        setMaxItems(count) {
            this._config.maxItems = parseInt(count) || 3;
            return this;
        }

        // For backwards compatibility with some calls
        initialize() {
            return this.init();
        }
    }

    global.WidgetRelatedArticles = WidgetRelatedArticles;

})(window);
