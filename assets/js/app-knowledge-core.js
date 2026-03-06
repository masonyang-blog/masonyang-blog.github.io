/**
 * Core Knowledge Component (Sidebar Accordion Version)
 * Renders a nested collapsible knowledge graph: Category -> Topic -> Detail
 * Encapsulated in Closed Shadow DOM.
 */
(function (global) {
    "use strict";

    class CoreKnowledgeComponent {
        constructor(hostId) {
            this.hostElement = document.getElementById(hostId);

            if (!this.hostElement) {
                console.error(`CoreKnowledgeComponent: Host element #${hostId} not found`);
                return;
            }

            // Create Shadow DOM (Closed Mode)
            this._shadow = this.hostElement.attachShadow({ mode: 'closed' });

            // Dependencies
            this._repository = global.CoreKnowledgeRepository;
        }

        init() {
            if (!this._repository) {
                console.error('CoreKnowledgeComponent: Repository not found');
                return;
            }
            this._render();
            return this;
        }

        _render() {
            this._shadow.innerHTML = '';

            // 1. Styles
            const style = document.createElement('style');
            style.textContent = this._getStyles();
            this._shadow.appendChild(style);

            // 2. Container
            const container = document.createElement('div');
            container.className = 'knowledge-sidebar';

            // 3. Search Header
            const searchHeader = document.createElement('div');
            searchHeader.className = 'search-header';
            searchHeader.innerHTML = `
                <div class="search-wrapper">
                    <svg class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" class="search-input" placeholder="搜尋關鍵字 (例如: RWA, DeFi)...">
                </div>
            `;
            container.appendChild(searchHeader);

            // 4. Content Wrapper (for list items)
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'content-wrapper';
            container.appendChild(contentWrapper);

            // Initial Render of List
            this._renderList(contentWrapper, '');

            // Event Listener for Search
            const searchInput = searchHeader.querySelector('.search-input');
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.trim().toLowerCase();
                this._renderList(contentWrapper, term);
            });

            // Keyboard Navigation
            container.addEventListener('keydown', (e) => this._handleKeydown(e));

            this._shadow.appendChild(container);
        }

        _handleKeydown(e) {
            const focusableItems = this._shadow.querySelectorAll('summary');
            const currentIndex = Array.from(focusableItems).indexOf(this._shadow.activeElement);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % focusableItems.length;
                focusableItems[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + focusableItems.length) % focusableItems.length;
                focusableItems[prevIndex].focus();
            }
        }

        _renderList(container, searchTerm) {
            container.innerHTML = ''; // Clear current list

            const categories = this._repository.categories;
            let hasResults = false;

            Object.entries(categories).forEach(([catKey, catLabel]) => {
                const items = this._repository.getByCategory(catKey);
                if (items.length === 0) return;

                // Filter items based on search term
                const filteredItems = searchTerm
                    ? items.filter(item =>
                        item.term.toLowerCase().includes(searchTerm) ||
                        item.definition.toLowerCase().includes(searchTerm) ||
                        item.importance.toLowerCase().includes(searchTerm)
                    )
                    : items;

                if (filteredItems.length === 0) return;
                hasResults = true;

                // Category Details (Level 1)
                const catDetails = document.createElement('details');
                catDetails.className = 'cat-details group';
                // Auto-expand if searching, otherwise collapsed by default
                if (searchTerm) catDetails.open = true;

                // Category Summary
                const catSummary = document.createElement('summary');
                catSummary.className = 'cat-summary';
                catSummary.innerHTML = `
                    <span class="cat-label">${catLabel}</span>
                    <svg class="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                `;
                catDetails.appendChild(catSummary);

                // Category Content (List of Topics)
                const catContent = document.createElement('div');
                catContent.className = 'cat-content';

                filteredItems.forEach(item => {
                    // Topic Details (Level 2)
                    const topicDetails = document.createElement('details');
                    topicDetails.className = 'topic-details';
                    // Auto-expand if searching
                    if (searchTerm) topicDetails.open = true;

                    // Topic Summary
                    const topicSummary = document.createElement('summary');
                    topicSummary.className = 'topic-summary';

                    // Highlight match in term if searching
                    let termHtml = item.term;
                    if (searchTerm) {
                        const regex = new RegExp(`(${searchTerm})`, 'gi');
                        termHtml = termHtml.replace(regex, '<span class="highlight">$1</span>');
                    }

                    topicSummary.innerHTML = termHtml;
                    topicDetails.appendChild(topicSummary);

                    // Topic Content (Level 3 - Detail Info)
                    const topicContent = document.createElement('div');
                    topicContent.className = 'topic-content';

                    let linkHtml = '';
                    if (item.relatedLink) {
                        linkHtml = `<a href="${item.relatedLink}" class="topic-link">${item.relatedLinkText || '閱讀更多'} →</a>`;
                    }

                    topicContent.innerHTML = `
                        <div class="topic-definition">${item.definition}</div>
                        <div class="topic-importance">
                            <strong>Why it matters:</strong> ${item.importance}
                        </div>
                        ${linkHtml}
                    `;

                    topicDetails.appendChild(topicContent);
                    catContent.appendChild(topicDetails);
                });

                catDetails.appendChild(catContent);
                container.appendChild(catDetails);
            });

            if (!hasResults && searchTerm) {
                container.innerHTML = `
                    <div class="no-results">
                        <p>找不到符合 "${searchTerm}" 的結果</p>
                    </div>
                `;
            }
        }

        _getStyles() {
            return `
                :host {
                    display: block;
                    font-family: 'Inter', sans-serif;
                    --slate-50: #f8fafc;
                    --slate-100: #f1f5f9;
                    --slate-200: #e2e8f0;
                    --slate-600: #475569;
                    --slate-700: #334155;
                    --slate-800: #1e293b;
                    --slate-900: #0f172a;
                    --primary: #0ea5e9; /* sky-500 */
                }

                .knowledge-sidebar {
                    background: white;
                    border: 1px solid var(--slate-200);
                    border-radius: 0.75rem;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
                }

                /* Category Level */
                .cat-details {
                    border-bottom: 1px solid var(--slate-200);
                }
                .cat-details:last-child {
                    border-bottom: none;
                }

                .cat-summary {
                    padding: 0.75rem 1rem;
                    background: var(--slate-50);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    list-style: none; /* Hide default triangle */
                    transition: background 0.2s;
                }
                .cat-summary:hover {
                    background: var(--slate-100);
                }
                .cat-summary::-webkit-details-marker {
                    display: none;
                }

                .cat-label {
                    font-weight: 700;
                    font-size: 0.875rem;
                    color: var(--slate-800);
                }
                
                .cat-summary svg {
                    width: 1rem;
                    height: 1rem;
                    color: var(--slate-600);
                    transition: transform 0.2s;
                }
                
                .cat-details[open] > .cat-summary svg {
                    transform: rotate(180deg);
                }

                .cat-content {
                    padding: 0 0 0.5rem 0;
                    background: white;
                }

                /* Topic Level */
                .topic-details {
                    border-bottom: 1px dashed var(--slate-200);
                }
                .topic-details:last-child {
                    border-bottom: none;
                }

                .topic-summary {
                    padding: 0.5rem 1rem 0.5rem 1.5rem;
                    cursor: pointer;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--slate-700);
                    list-style: none;
                    transition: color 0.2s;
                    position: relative;
                }
                .topic-summary:hover {
                    color: var(--primary);
                }
                /* Indication dot */
                .topic-summary::before {
                    content: '•';
                    position: absolute;
                    left: 0.75rem;
                    color: var(--slate-400);
                }
                .topic-summary::-webkit-details-marker {
                    display: none;
                }
                
                .topic-details[open] > .topic-summary {
                    color: var(--primary);
                }

                /* Content Level */
                .topic-content {
                    padding: 0.5rem 1rem 1rem 1.5rem;
                    font-size: 0.8rem;
                    color: var(--slate-600);
                    line-height: 1.5;
                    background: #f8fafc;
                    border-top: 1px solid var(--slate-100);
                }

                .topic-definition {
                    margin-bottom: 0.5rem;
                }

                .topic-importance {
                    margin-bottom: 0.5rem;
                    padding: 0.5rem;
                    background: #e0f2fe; /* sky-100 */
                    border-radius: 0.25rem;
                    color: #0c4a6e; /* sky-900 */
                }

                .topic-link {
                    display: inline-block;
                    font-weight: 600;
                    color: var(--primary);
                    text-decoration: none;
                }
                .topic-link:hover {
                    text-decoration: underline;
                }

                /* Search Styles */
                .search-header {
                    padding: 1rem;
                    border-bottom: 1px solid var(--slate-200);
                    background: #fff;
                }
                
                .search-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .search-icon {
                    position: absolute;
                    left: 0.75rem;
                    width: 1.25rem;
                    height: 1.25rem;
                    color: var(--slate-600);
                    pointer-events: none;
                }

                .search-input {
                    width: 100%;
                    padding: 0.6rem 1rem 0.6rem 2.5rem;
                    border: 1px solid var(--slate-200);
                    border-radius: 0.5rem;
                    font-size: 0.9rem;
                    color: var(--slate-800);
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    font-family: inherit;
                }

                .search-input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
                }

                .search-input::placeholder {
                    color: #94a3b8;
                }

                .highlight {
                    background-color: #fef08a; /* yellow-200 */
                    color: #854d0e; /* yellow-900 */
                    font-weight: 700;
                    border-radius: 0.125rem;
                    padding: 0 0.1rem;
                }

                .no-results {
                    padding: 2rem 1rem;
                    text-align: center;
                    color: var(--slate-600);
                    font-size: 0.9rem;
                }`;
        }
    }

    global.CoreKnowledgeComponent = CoreKnowledgeComponent;

})(window);
