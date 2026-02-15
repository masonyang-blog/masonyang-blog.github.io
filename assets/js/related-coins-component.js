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
                maxItems: 3
            };

            if (!this.hostElement) {
                console.warn('RelatedCoinsComponent: Host element provided is null');
                return;
            }

            // Create Shadow DOM
            this.shadowRoot = this.hostElement.attachShadow({ mode: 'closed' });
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
            // Styles
            const style = document.createElement('style');
            style.textContent = `
                :host {
                    display: block;
                    font-family: 'Inter', system-ui, sans-serif;
                    margin-top: 3rem;
                }
                
                .section-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #0f172a; /* slate-900 */
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid #e2e8f0;
                }

                .grid {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 1.5rem;
                }

                @media (min-width: 640px) {
                    .grid { grid-template-columns: repeat(2, 1fr); }
                }

                @media (min-width: 1024px) {
                    .grid { grid-template-columns: repeat(3, 1fr); }
                }

                .card {
                    background: white;
                    border: 1px solid #e2e8f0; /* slate-200 */
                    border-radius: 0.75rem;
                    padding: 1.5rem;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
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
                }

                .symbol {
                    font-size: 0.75rem;
                    font-weight: 700;
                    background-color: #f1f5f9; /* slate-100 */
                    color: #475569; /* slate-600 */
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                }

                .title {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: #0f172a; /* slate-900 */
                }

                .desc {
                    font-size: 0.875rem;
                    color: #64748b; /* slate-500 */
                    line-height: 1.5;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    margin-bottom: 1rem;
                    flex-grow: 1;
                }

                .meta {
                    font-size: 0.75rem;
                    color: #94a3b8; /* slate-400 */
                    display: flex;
                    align-items: center;
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

                :host-context(html.dark) .symbol {
                    background-color: #334155;
                    color: #cbd5e1;
                }
            `;
            this.shadowRoot.appendChild(style);

            // Container
            const container = document.createElement('div');

            // Title
            const title = document.createElement('h3');
            title.className = 'section-title';
            title.textContent = '相關項目推薦';
            container.appendChild(title);

            // Grid
            const grid = document.createElement('div');
            grid.className = 'grid';

            items.forEach(item => {
                const link = document.createElement('a');
                // Assume standard path structure: project/{id}.html
                // We might need a path resolver utility, but for now assuming we are in project/ or post/
                // which means we link to ../project/{id}.html or just project/{id}.html depending on where we are.
                // Safest is absolute path or checking current location. 
                // Let's assume relative to root if possible, or standard `../project/` if we are deep.
                // However, standard project pages are at `project/xxx.html`.
                // If we are in `project/`, link should be `${item.id}.html` or similar.
                // Let's use a simple heuristic: if item has a specific URL usage or standardized ID.
                // Writing Guide says URL is `project/{id}.html`.
                // If we are on a page `project/abc.html`, we need just `${item.id}.html`.

                link.href = `${item.id}.html`;
                link.className = 'card';
                link.innerHTML = `
                    <div class="card-header">
                        <span class="title">${item.name}</span>
                        <span class="symbol">${item.symbol}</span>
                    </div>
                    <div class="desc">${item.description}</div>
                    <div class="meta">See Review &rarr;</div>
                `;
                grid.appendChild(link);
            });

            container.appendChild(grid);
            this.shadowRoot.appendChild(container);
        }

        _log(level, msg) {
            if (this._config.debug) {
                console[level](`[RelatedCoins] ${msg}`);
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
    }

    global.RelatedCoinsComponent = RelatedCoinsComponent;

})(window);
