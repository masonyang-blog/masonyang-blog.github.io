/**
 * Related Coins Component
 * @class RelatedCoinsComponent
 * @description Renders a list of related crypto assets based on the current asset's sector.
 * Uses Shadow DOM for encapsulation.
 */
(function (global) {
    "use strict";

    class RelatedCoinsComponent {
        /**
         * @param {HTMLElement} hostElement - The DOM element to attach to
         * @param {string} currentAssetId - ID of the current page's asset (to exclude)
         * @param {Array} dataSource - Array of asset objects (cryptoAssetsData)
         */
        constructor(hostElement, currentAssetId, dataSource) {
            this.hostElement = hostElement;
            this.currentAssetId = currentAssetId;
            this.dataSource = dataSource || [];

            // Configuration
            this._config = {
                debug: false,
                maxItems: 3,
                showHeader: true,
                layout: 'grid' // 'grid' | 'list'
            };

            if (!this.hostElement) {
                console.warn('RelatedCoinsComponent: Host element provided is null');
                return;
            }

            // Create Shadow DOM (Always use 'open')
            if (!this.hostElement.shadowRoot) {
                this.shadowRoot = this.hostElement.attachShadow({ mode: 'open' });
            } else {
                this.shadowRoot = this.hostElement.shadowRoot;
                this.shadowRoot.innerHTML = '';
            }
        }

        /**
         * Initialize the component
         */
        init() {
            if (!this.dataSource.length) {
                this._log('warn', 'No data source provided');
                return this;
            }

            const currentAsset = this.dataSource.find(a => a.id === this.currentAssetId);
            if (!currentAsset) {
                this._log('warn', `Current asset ID '${this.currentAssetId}' not found in database`);
                return this;
            }

            // Filter related items: Same sector, not current ID
            const relatedItems = this.dataSource.filter(asset =>
                asset.sector === currentAsset.sector && asset.id !== this.currentAssetId
            ).slice(0, this._config.maxItems);

            if (relatedItems.length === 0) {
                this._log('info', 'No related items found');
                return this;
            }

            this._render(relatedItems);
            return this;
        }

        _render(items) {
            const isList = this._config.layout === 'list';
            const hasHeader = this._config.showHeader;

            // Styles
            const style = document.createElement('style');
            style.textContent = `
                :host {
                    display: block;
                    font-family: 'Inter', system-ui, sans-serif;
                    margin-top: ${hasHeader ? '3rem' : '0'};
                }
                
                .section-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid #e2e8f0;
                    display: ${hasHeader ? 'block' : 'none'};
                }

                .container {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: ${isList ? '0' : '1.5rem'};
                }

                @media (min-width: 640px) {
                    .container { grid-template-columns: repeat(${isList ? '1' : '2'}, 1fr); }
                }

                @media (min-width: 1024px) {
                    .container { grid-template-columns: repeat(${isList ? '1' : '3'}, 1fr); }
                }

                /* GRID LAYOUT STYLES */
                .card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.75rem;
                    padding: 1.5rem;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    display: ${isList ? 'none' : 'flex'};
                    flex-direction: column;
                    height: 100%;
                }

                .card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    border-color: #cbd5e1;
                }

                /* LIST LAYOUT STYLES */
                .list-item {
                    display: ${isList ? 'flex' : 'none'};
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    text-decoration: none;
                    font-size: 0.8125rem;
                    color: #475569;
                    border-bottom: 1px solid #f1f5f9;
                    transition: all 0.2s ease;
                }

                .list-item:last-child {
                    border-bottom: none;
                }

                .list-item:hover {
                    background-color: #f8fafc;
                    color: #3b82f6;
                }

                .list-item svg {
                    width: 0.875rem;
                    height: 0.875rem;
                    color: #cbd5e1;
                    shrink: 0;
                }

                .symbol {
                    font-size: 0.7rem;
                    font-weight: 700;
                    background-color: #f1f5f9;
                    color: #475569;
                    padding: 0.15rem 0.4rem;
                    border-radius: 0.25rem;
                    margin-left: auto;
                }

                .title {
                    font-size: ${isList ? '0.8125rem' : '1.125rem'};
                    font-weight: ${isList ? '500' : '700'};
                    color: inherit;
                }

                .desc {
                    font-size: 0.8rem;
                    color: #64748b;
                    line-height: 1.5;
                    display: ${isList ? 'none' : '-webkit-box'};
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    margin-bottom: 1rem;
                    flex-grow: 1;
                }

                .meta {
                    display: ${isList ? 'none' : 'flex'};
                    font-size: 0.75rem;
                    color: #3b82f6;
                    font-weight: 600;
                }

                /* Dark Mode Support */
                :host-context(html.dark) .section-title { color: #f1f5f9; border-color: #334155; }
                :host-context(html.dark) .card { background-color: #1e293b; border-color: #334155; }
                :host-context(html.dark) .list-item { color: #cbd5e1; border-color: #334155; }
                :host-context(html.dark) .list-item:hover { background-color: #33415550; color: #60a5fa; }
                :host-context(html.dark) .symbol { background-color: #334155; color: #cbd5e1; }
                :host-context(html.dark) .list-item svg { color: #475569; }
            `;
            this.shadowRoot.appendChild(style);

            const wrapper = document.createElement('div');

            if (hasHeader) {
                const title = document.createElement('h3');
                title.className = 'section-title';
                title.textContent = '相關項目推薦';
                wrapper.appendChild(title);
            }

            const container = document.createElement('div');
            container.className = 'container';

            items.forEach(item => {
                const link = document.createElement('a');
                // Path resolver: if in project/ link directly to id.html, else link to project/id.html
                const isProjectDir = window.location.pathname.includes('/project/');
                const fileName = item.id === 'bittensor' ? 'tao' : item.id;
                link.href = isProjectDir ? `${fileName}.html` : `project/${fileName}.html`;
                
                if (isList) {
                    link.className = 'list-item';
                    link.innerHTML = `
                        <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                        <span class="title">${item.name}</span>
                        <span class="symbol">${item.symbol}</span>
                    `;
                } else {
                    link.className = 'card';
                    link.innerHTML = `
                        <div class="card-header">
                            <span class="title">${item.name}</span>
                            <span class="symbol">${item.symbol}</span>
                        </div>
                        <div class="desc">${item.description}</div>
                        <div class="meta">深入解析 &rarr;</div>
                    `;
                }
                container.appendChild(link);
            });

            wrapper.appendChild(container);
            this.shadowRoot.appendChild(wrapper);
        }

        _log(level, msg) {
            if (this._config.debug) {
                console[level](`[RelatedCoins] ${msg}`);
            }
        }

        // --- Chainable Setters ---

        setLayout(type) {
            this._config.layout = type; // 'grid' | 'list'
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

        setMaxItems(count) {
            this._config.maxItems = parseInt(count) || 3;
            return this;
        }
    }

    global.RelatedCoinsComponent = RelatedCoinsComponent;

})(window);
