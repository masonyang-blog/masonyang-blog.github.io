/**
 * Article Series Widget Component (V3)
 * Provides a structured navigation system for article series in the sidebar.
 * 
 * Features:
 * - Shadow DOM isolated styles.
 * - Zero-build architecture.
 * - Chainable API.
 * - Responsive compact design.
 */
(function (global) {
    'use strict';

    class ArticleSeriesComponent {
        constructor() {
            this._seriesName = '';
            this._target = 'body';
            this._config = {
                title: '相關研究系列',
                guideLabel: '專題研究',
                spokeLabel: '知識單元'
            };
            this._groups = { guide: [], spoke: [] };
            this._debug = false;
            this._retryCount = 0;
            this._isInitializing = false;
        }

        // Chainable setters
        setSeriesName(name) { this._seriesName = name; return this; }
        setTarget(selector) { this._target = selector; return this; }
        setConfig(config) { this._config = { ...this._config, ...config }; return this; }
        setDebug(enabled) { this._debug = enabled; return this; }
        setOnNavigate(callback) { this._onNavigate = callback; return this; }

        updateActiveItem(id) {
            if (!this._shadow) return;
            const items = this._shadow.querySelectorAll('.series-item');
            items.forEach(li => {
                const link = li.querySelector('.series-link');
                const articleId = link ? link.getAttribute('data-id') : null;
                if (articleId === id) {
                    li.classList.add('active');
                } else {
                    li.classList.remove('active');
                }
            });
            return this;
        }

        _log(...args) {
            if (this._debug) console.log('[ArticleSeriesComponent]', ...args);
        }

        init() {
            if (this._isInitializing) {
                this._log('Already initializing, skipping redundant call.');
                return this;
            }

            this._isInitializing = true;
            this._log('Initializing widget for series:', this._seriesName);
            
            // Handle race conditions where repositories might not be loaded yet
            const isReady = window.ArticleRepository && window.CoreKnowledgeRepository;
            
            if (!isReady && this._retryCount < 5) {
                this._log(`Repositories not ready (retry ${this._retryCount + 1}/5), waiting 100ms...`);
                this._retryCount++;
                setTimeout(() => {
                    this._isInitializing = false;
                    this.init();
                }, 100);
                return this;
            }

            try {
                this._fetchData();
                
                // Even if repositories exist, they might be empty if data is still being parsed
                if (this._groups.guide.length === 0 && this._groups.spoke.length === 0 && this._retryCount < 10) {
                    this._log(`No data found (retry ${this._retryCount + 1}/10), waiting 200ms...`);
                    this._retryCount++;
                    setTimeout(() => {
                        this._isInitializing = false;
                        this.init();
                    }, 200);
                    return this;
                }

                this._render();
            } catch (error) {
                console.error('[ArticleSeriesComponent] Initialization failed:', error);
            } finally {
                this._isInitializing = false;
            }

            return this;
        }

        _fetchData() {
            this._log('Fetching data from repositories...');
            
            const artRepo = window.ArticleRepository;
            const knlRepo = window.CoreKnowledgeRepository;
            
            const articles = (artRepo && artRepo.all) || [];
            const knowledge = (knlRepo && knlRepo.all) || [];
            
            this._log('Diagnostic:', {
                hasArtRepo: !!artRepo,
                artCount: articles.length,
                hasKnlRepo: !!knlRepo,
                knlCount: knowledge.length
            });

            const combined = [...articles, ...knowledge];
            
            // Detailed debug for first matching item
            if (this._debug && combined.length > 0) {
                const btcItem = combined.find(i => i.id === '20260410-btc-investment-opportunity-prediction' || i.id === 'btc');
                if (btcItem) {
                    this._log('Found BTC item for verification:', {
                        id: btcItem.id,
                        series: btcItem.series,
                        series_type: btcItem.series_type,
                        keys: Object.keys(btcItem)
                    });
                } else {
                    this._log('Sample item id/keys:', combined[0].id, Object.keys(combined[0]));
                }
            }

            const filtered = combined.filter(item => {
                const match = item.series === this._seriesName;
                return match;
            });
            
            this._log('Filtered count for', this._seriesName, ':', filtered.length);

            // Sort by date descending
            filtered.sort((a, b) => {
                const dateA = new Date(b.published || '2000-01-01');
                const dateB = new Date(a.published || '2000-01-01');
                return dateA - dateB;
            });

            // Grouping
            this._groups = {
                guide: filtered.filter(item => item.series_type === 'guide'),
                spoke: filtered.filter(item => item.series_type === 'spoke' || item.series_type === 'report')
            };

            this._log('Grouped data:', {
                guides: this._groups.guide.length,
                spokes: this._groups.spoke.length
            });
        }

        _render() {
            const host = document.querySelector(this._target);
            if (!host) {
                console.error('[ArticleSeriesComponent] Target element not found:', this._target);
                return;
            }

            // Create host and shadow root (Always use 'open')
            this._container = document.createElement('div');
            this._container.id = `widget-series-${this._seriesName}`;
            
            // Check if host already exists or clear it
            host.innerHTML = '';
            host.appendChild(this._container);

            if (!this._container.shadowRoot) {
                this._shadow = this._container.attachShadow({ mode: 'open' });
            } else {
                this._shadow = this._container.shadowRoot;
                this._shadow.innerHTML = '';
            }

            // Trigger actual rendering
            this._updateShadowContent();
        }

        _updateShadowContent() {
            const hasData = this._groups && (this._groups.guide.length > 0 || this._groups.spoke.length > 0);
            
            this._shadow.innerHTML = `
                <style>${this._getStyles()}</style>
                <div class="series-widget">
                    <h3 class="series-title">${this._config.title}</h3>
                    <div id="series-content">
                        ${!hasData ? '<p style="font-size: 0.75rem; opacity: 0.5;">暫無相關內容</p>' : ''}
                        
                        <div id="guides-container">
                            ${this._groups ? this._renderGroup('guide', this._config.guideLabel) : ''}
                        </div>

                        <div id="spokes-container">
                            ${this._groups ? this._renderGroup('spoke', this._config.spokeLabel) : ''}
                        </div>
                    </div>
                </div>
            `;

            // Attach navigation listeners
            this._shadow.querySelectorAll('.series-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    if (this._onNavigate) {
                        e.preventDefault();
                        const href = link.getAttribute('href');
                        const id = link.getAttribute('data-id');
                        this._onNavigate({ href, id, event: e });
                    }
                });
            });
        }

        _renderGroup(type, label) {
            const items = this._groups[type] || [];
            if (items.length === 0) return '';

            return `
                <div class="section-label">${label}</div>
                <ul class="series-list">
                    ${items.map(item => this._renderItem(item)).join('')}
                </ul>
            `;
        }

        _renderItem(item) {
            const basePath = this._getBasePath();
            const isGuide = item.series_type === 'guide';
            const currentId = document.body.dataset.articleId;
            const isActive = item.id === currentId;
            
            const dimension = item.series_dimension ? `<span class="dimension-tag">D${item.series_dimension}</span>` : '';
            const guideTag = isGuide ? '<span class="dimension-tag" style="background: var(--primary-light, #eff6ff); color: var(--primary-color, #2563eb);">導讀</span>' : '';

            return `
                <li class="series-item ${isActive ? 'active' : ''}">
                    <a href="${basePath + (item.link || '#')}" class="series-link" data-id="${item.id}">
                        <span class="item-title">${item.title}</span>
                        ${guideTag}
                        ${dimension}
                    </a>
                </li>
            `;
        }

        /**
         * Path resolver to handle subdirectory hosting
         * Detects if current page is in a subdirectory and returns correct relative prefix.
         * @private
         */
        _getBasePath() {
            const path = window.location.pathname;
            if (path.includes('/post/') || path.includes('/project/') || path.includes('/news/') || path.includes('/knowledge/')) {
                return '../';
            }
            return './';
        }

        _getStyles() {
            return `
                :host {
                    display: block;
                    font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
                    color: var(--text-main, #374151);
                }
                .series-widget {
                    margin-bottom: 2rem;
                }
                .series-title {
                    font-size: 0.875rem; /* text-sm */
                    font-weight: 700;
                    margin: 0 0 1rem 0;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid var(--border-color, #f3f4f6);
                    color: var(--text-title, #111827);
                }
                .section-label {
                    font-size: 0.75rem; /* text-xs */
                    font-weight: 600;
                    color: var(--text-muted, #6b7280);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin: 1.5rem 0 0.75rem 0;
                }
                .series-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .series-item {
                    margin-bottom: 0.25rem;
                    border-left: 3px solid transparent;
                    transition: all 0.2s ease;
                }
                .series-item.active {
                    border-left-color: var(--c-primary, #f97316);
                    background: var(--c-bg-soft-orange, rgba(249, 115, 22, 0.05));
                }
                .series-link {
                    display: flex;
                    align-items: flex-start;
                    text-decoration: none;
                    font-size: 0.8125rem; /* text-xs+ */
                    line-height: 1.4;
                    color: var(--text-main, #4b5563);
                    transition: all 0.2s ease;
                    padding: 0.5rem 0.75rem;
                }
                .series-item.active .series-link {
                    color: var(--c-text-primary, #0f172a);
                    font-weight: 700;
                }
                .series-link:hover {
                    color: var(--primary-color, #2563eb);
                    background: var(--c-bg-soft-blue, rgba(37, 99, 235, 0.05));
                }
                .item-title {
                    flex: 1;
                    min-width: 0;
                }
                .dimension-tag {
                    display: inline-flex;
                    align-items: center;
                    padding: 0 0.375rem;
                    height: 1.125rem;
                    border-radius: 9999px;
                    background: var(--bg-tag, #f3f4f6);
                    font-size: 10px;
                    font-weight: 500;
                    margin-left: 0.5rem;
                    white-space: nowrap;
                }

                /* Dark Mode Adaptation (Site uses [data-theme="dark"] or prefers-color-scheme) */
                @media (prefers-color-scheme: dark) {
                    :host-context([data-theme="dark"]) .series-title { border-bottom-color: #1f2937; color: #f9fafb; }
                    :host-context([data-theme="dark"]) .series-link { color: #9ca3af; }
                    :host-context([data-theme="dark"]) .series-link:hover { color: #60a5fa; }
                    :host-context([data-theme="dark"]) .section-label { color: #9ca3af; }
                }
                /* Explicit dark theme support if parent has .dark or [data-theme="dark"] */
                :host-context(.dark) .series-title { border-bottom-color: #1f2937; color: #f9fafb; }
                :host-context(.dark) .series-link { color: #9ca3af; }
                :host-context(.dark) .series-link:hover { color: #60a5fa; }
                :host-context(.dark) .section-label { color: #9ca3af; }

                :host-context([data-theme="dark"]) .series-title { border-bottom-color: #1f2937; color: #f9fafb; }
                :host-context([data-theme="dark"]) .series-link { color: #9ca3af; }
                :host-context([data-theme="dark"]) .series-link:hover { color: #60a5fa; }
                :host-context([data-theme="dark"]) .section-label { color: #9ca3af; }
            `;
        }
    }

    // Export to global scope
    global.ArticleSeriesComponent = ArticleSeriesComponent;

})(window);
