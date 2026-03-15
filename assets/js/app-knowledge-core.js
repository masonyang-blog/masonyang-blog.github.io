/**
 * Core Knowledge Component (Sidebar Accordion Version)
 * Renders a nested collapsible knowledge graph: Category -> Topic -> Detail
 * Encapsulated in Closed Shadow DOM.
 */
(function (global) {
    "use strict";

    class CoreKnowledgeComponent {
        constructor(hostId) {
            this._hostId = hostId;
            this._hostElement = document.getElementById(hostId);
            this._debug = false;
            this._showSearch = true;
            this._frameless = false;
            this._searchTerm = '';
            
            if (!this._hostElement) {
                console.error(`CoreKnowledgeComponent: Host element #${hostId} not found`);
                return;
            }

            // Create Shadow DOM (Closed Mode)
            this._shadow = this._hostElement.attachShadow({ mode: 'closed' });
            
            // Dependencies
            this._repository = global.CoreKnowledgeRepository;
            this._contentWrapper = null;
        }

        // Setters (Chainable)
        setDebug(value) {
            this._debug = !!value;
            return this;
        }

        setShowSearch(value) {
            this._showSearch = !!value;
            return this;
        }

        setFrameless(value) {
            this._frameless = !!value;
            return this;
        }

        setSearchTerm(term) {
            this._searchTerm = (term || '').trim().toLowerCase();
            if (this._contentWrapper) {
                this._renderList(this._contentWrapper, this._searchTerm);
            }
            if (this._debug) console.log(`[KnowledgeHub] Search: ${this._searchTerm}`);
            return this;
        }

        // Getters
        get debug() { return this._debug; }
        get showSearch() { return this._showSearch; }
        get frameless() { return this._frameless; }
        get searchTerm() { return this._searchTerm; }

        init() {
            if (!this._repository) {
                if (this._debug) console.error('CoreKnowledgeComponent: Repository not found');
                return this;
            }
            this._render();
            if (this._debug) console.log('[KnowledgeHub] Initialized');
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
            container.className = `knowledge-container ${this._frameless ? 'frameless' : ''}`;

            // 3. Search Header (Conditional)
            if (this._showSearch) {
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

                // Event Listener for Search
                const searchInput = searchHeader.querySelector('.search-input');
                searchInput.addEventListener('input', (e) => {
                    this.setSearchTerm(e.target.value);
                });
            }

            // 4. Content Wrapper (for list items)
            this._contentWrapper = document.createElement('div');
            this._contentWrapper.className = 'content-wrapper';
            container.appendChild(this._contentWrapper);

            // Register instance for global scrolling
            window.activeKnowledgeComponent = this;

            // Initial Render of List
            this._renderList(this._contentWrapper, this._searchTerm);

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
            const matchedCategories = [];
            let hasResults = false;

            Object.entries(categories).forEach(([catKey, catLabel]) => {
                const items = this._repository.getByCategory(catKey);
                if (items.length === 0) return;

                // Filter items based on search term
                const filteredItems = searchTerm
                    ? items.filter(item =>
                        item.title.toLowerCase().includes(searchTerm) ||
                        item.definition.toLowerCase().includes(searchTerm) ||
                        item.importance.toLowerCase().includes(searchTerm) ||
                        (item.keywords && item.keywords.some(k => k.toLowerCase().includes(searchTerm)))
                    )
                    : items;

                if (filteredItems.length === 0) return;
                hasResults = true;
                matchedCategories.push(catKey);

                // Category Section
                const section = document.createElement('section');
                section.className = 'knowledge-section';
                section.setAttribute('data-cat-id', catKey);

                const sectionHeader = document.createElement('h3');
                sectionHeader.className = 'section-title';
                sectionHeader.innerHTML = `
                    <span class="section-icon">${this._getCategoryIcon(catKey)}</span>
                    ${catLabel}
                `;
                section.appendChild(sectionHeader);

                const topicGrid = document.createElement('div');
                topicGrid.className = 'topic-grid';

                filteredItems.forEach(item => {
                    // Topic Card
                    const card = document.createElement('div');
                    card.className = `topic-card card-type-${catKey}`;
                    
                    // Tags HTML
                    const tagsHtml = (item.keywords || []).slice(0, 3).map(tag => 
                        `<span class="card-tag">#${tag}</span>`
                    ).join('');

                    card.innerHTML = `
                        <div class="card-header">
                            <h4 class="card-title">${this._highlightText(item.title, searchTerm)}</h4>
                            <span class="card-type-badge">${this._getCategoryLabel(catKey)}</span>
                        </div>
                        <div class="card-body">
                            <p class="card-preview">${this._highlightText(item.definition.substring(0, 75), searchTerm)}...</p>
                            <div class="card-tags-row">${tagsHtml}</div>
                            <div class="card-expanded-content" style="display: none;">
                                <div class="expanded-inner">
                                    <p class="card-full-definition">${item.definition}</p>
                                    <div class="card-importance">
                                        <div class="importance-label">Why it matters</div>
                                        ${item.importance}
                                    </div>
                                    <div class="card-footer-actions">
                                        ${this._getDeepReadingLinksHtml(item)}
                                        <button class="save-note-btn">存入收納盒</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    card.addEventListener('click', (e) => {
                        if (e.target.closest('.save-note-btn')) {
                            this._saveToNotebook(item);
                            return;
                        }
                        this._toggleCardExpansion(card, item);
                    });

                    topicGrid.appendChild(card);
                });

                section.appendChild(topicGrid);
                container.appendChild(section);
            });
            if (!hasResults && searchTerm) {
                container.innerHTML = `
                    <div class="no-results">
                        <div class="no-results-icon">🔍</div>
                        <p>找不到符合 "${searchTerm}" 的結果</p>
                    </div>
                `;
            }

            // Phase 3.5: Notify navigation of search matches
            window.dispatchEvent(new CustomEvent('knowledge-search-results', {
                detail: {
                    searchTerm: searchTerm,
                    matchedCategories: matchedCategories
                }
            }));
        }

        _toggleCardExpansion(card, itemData) {
            const isExpanded = card.classList.toggle('expanded');
            const expandedContent = card.querySelector('.card-expanded-content');
            
            if (isExpanded) {
                expandedContent.style.display = 'block';
                // Simple slide down simulation for shadow DOM
                expandedContent.animate([
                    { opacity: 0, transform: 'translateY(-10px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ], { duration: 200, easing: 'ease-out' });

                // Phase 3: Notify Workspace of selection
                window.dispatchEvent(new CustomEvent('knowledge-card-selected', { 
                    detail: itemData 
                }));
            } else {
                expandedContent.style.display = 'none';
            }
        }

        _highlightText(text, searchTerm) {
            if (!searchTerm) return text;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        }

        _getCategoryLabel(catKey) {
            const labels = {
                'core': 'Core',
                'macro': 'Macro',
                'cycle': 'Cycle',
                'reg': 'Regulation',
                'infra': 'Infra',
                'valuation': 'Valuation',
                'onchain': 'On-chain'
            };
            return labels[catKey] || 'Concept';
        }

        _getCategoryIcon(catKey) {
            const icons = {
                'core': '💎',
                'macro': '🌍',
                'cycle': '🔄',
                'reg': '🛡️',
                'infra': '🏗️',
                'valuation': '📊',
                'onchain': '⛓️'
            };
            return icons[catKey] || '💡';
        }

        /**
         * Save item to Personal Notebook (localStorage)
         */
        _saveToNotebook(item) {
            const notebook = JSON.parse(localStorage.getItem('knowledge_notebook') || '[]');
            
            // Check if already exists
            if (notebook.some(n => n.id === item.id)) {
                alert('已存在於收納盒中');
                return;
            }

            notebook.push({
                id: item.id,
                title: item.title,
                category: item.category,
                timestamp: new Date().getTime()
            });

            localStorage.setItem('knowledge_notebook', JSON.stringify(notebook));
            
            // Dispatch event for topic-knowledge.html to listen to
            window.dispatchEvent(new CustomEvent('notebook-updated', { detail: notebook }));
            
            console.log('Saved to notebook:', item.title);
        }

        /**
         * Scroll to a specific category
         */
        scrollToCategory(catId) {
            const section = this._shadow.querySelector(`.knowledge-section[data-cat-id="${catId}"]`);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Flash effect
                section.classList.add('highlight-flash');
                setTimeout(() => section.classList.remove('highlight-flash'), 2000);
            }
        }

        /**
         * Get HTML for deep reading links (either from ArticleRepository or direct relatedLink)
         */
        _getDeepReadingLinksHtml(item) {
            let html = '';

            // 1. Direct Link from Knowledge Data (Prioritized)
            if (item.relatedLink) {
                html += `
                    <div class="related-article-box">
                        <div class="box-icon">📖</div>
                        <div class="box-content">
                            <a href="../${item.relatedLink}" class="box-link">${item.relatedLinkText || '閱讀完整文章'}</a>
                        </div>
                    </div>
                `;
            } 
            // 2. Fallback to ArticleRepository if available
            else if (item.relatedArticleId && global.ArticleRepository) {
                const article = global.ArticleRepository.all.find(a => a.id === item.relatedArticleId);
                if (article) {
                    html += `
                        <div class="related-article-box">
                            <div class="box-icon">📄</div>
                            <div class="box-content">
                                <p class="box-tag">${article.tag || '深度閱讀'}</p>
                                <a href="../${article.link}" class="box-link">${article.title}</a>
                            </div>
                        </div>
                    `;
                }
            }

            return html;
        }

        _getStyles() {
            return `
                :host {
                    display: block;
                    font-family: 'Outfit', 'Inter', sans-serif;
                    --slate-50: #f8fafc;
                    --slate-100: #f1f5f9;
                    --slate-200: #e2e8f0;
                    --slate-300: #cbd5e1;
                    --slate-400: #94a3b8;
                    --slate-500: #64748b;
                    --slate-600: #475569;
                    --slate-700: #334155;
                    --slate-800: #1e293b;
                    --slate-900: #0f172a;
                    --primary: #0ea5e9;
                    --primary-soft: rgba(14, 165, 233, 0.1);
                    --accent: #f59e0b; /* amber-500 */
                }

                .knowledge-container {
                    background: transparent;
                }

                /* Section Styles */
                .knowledge-section {
                    margin-bottom: 4rem;
                    scroll-margin-top: 6rem;
                }

                .section-title {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--slate-900);
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                :host-context(.dark) .section-title {
                    color: white;
                }

                .section-icon {
                    font-size: 1.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 2.5rem;
                    height: 2.5rem;
                    background: var(--slate-100);
                    border-radius: 0.75rem;
                }
                :host-context(.dark) .section-icon {
                    background: var(--slate-800);
                }

                /* Grid Layout */
                .topic-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                /* Card Styles */
                .topic-card {
                    background: white;
                    border: 1px solid var(--slate-200);
                    border-radius: 1.25rem;
                    padding: 1.5rem;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                :host-context(.dark) .topic-card {
                    background: #111827; /* gray-900 */
                    border-color: #1f2937;
                }

                .topic-card:hover {
                    border-color: var(--primary);
                    box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.1);
                }

                .card-header {
                    margin-bottom: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 1rem;
                }

                .card-title {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--slate-900);
                    line-height: 1.3;
                }
                :host-context(.dark) .card-title {
                    color: var(--slate-100);
                }

                .card-type-badge {
                    font-size: 0.65rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    padding: 0.2rem 0.6rem;
                    border-radius: 2rem;
                    background: var(--slate-100);
                    color: var(--slate-500);
                    border: 1px solid var(--slate-200);
                }
                :host-context(.dark) .card-type-badge {
                    background: var(--slate-800);
                    border-color: var(--slate-700);
                }

                /* Type Specific Styling */
                .card-type-onchain .card-type-badge { background: #dcfce7; color: #166534; border-color: #bbf7d0; }
                .card-type-macro .card-type-badge { background: #e0f2fe; color: #0369a1; border-color: #bae6fd; }
                .card-type-valuation .card-type-badge { background: #fef9c3; color: #854d0e; border-color: #fef08a; }

                .card-body {
                    font-size: 0.9rem;
                    color: var(--slate-600);
                    line-height: 1.6;
                }
                :host-context(.dark) .card-body {
                    color: var(--slate-400);
                }

                .card-tags-row {
                    margin-top: 1rem;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .card-tag {
                    font-size: 0.75rem;
                    color: var(--slate-400);
                    font-weight: 500;
                }

                /* Expanded Content */
                .topic-card.expanded {
                    grid-column: 1 / -1;
                    background: #fcfdfe;
                    border-color: var(--primary);
                    cursor: default;
                }
                :host-context(.dark) .topic-card.expanded {
                    background: #020617; /* slate-950 */
                }
                
                .topic-card.expanded .card-preview,
                .topic-card.expanded .card-tags-row {
                    display: none;
                }

                .card-expanded-content {
                    margin-top: 1.5rem;
                }

                .card-full-definition {
                    font-size: 1rem;
                    color: var(--slate-700);
                    background: white;
                    padding: 1.5rem;
                    border-radius: 1rem;
                    border: 1px solid var(--slate-100);
                    margin-bottom: 1.5rem;
                }
                :host-context(.dark) .card-full-definition {
                    background: var(--slate-900);
                    color: var(--slate-300);
                    border-color: var(--slate-800);
                }

                .card-importance {
                    background: var(--primary-soft);
                    color: var(--slate-800);
                    padding: 1.25rem;
                    border-radius: 1rem;
                    margin-bottom: 2rem;
                    position: relative;
                }
                :host-context(.dark) .card-importance {
                    color: var(--slate-200);
                }

                .importance-label {
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: var(--primary);
                    margin-bottom: 0.5rem;
                    letter-spacing: 0.05em;
                }

                .card-footer-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1.5rem;
                    margin-top: 1.5rem;
                }

                .save-note-btn {
                    background: var(--slate-100);
                    color: var(--slate-700);
                    border: none;
                    padding: 0.6rem 1.2rem;
                    border-radius: 0.75rem;
                    font-size: 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .save-note-btn:hover {
                    background: var(--slate-200);
                    color: var(--slate-900);
                }
                .save-note-btn::before { content: '📥'; }

                /* Related Article Inside Expanded Card */
                .related-article-box {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: white;
                    padding: 0.75rem 1.25rem;
                    border-radius: 0.75rem;
                    border: 1px solid var(--slate-200);
                }
                :host-context(.dark) .related-article-box {
                    background: var(--slate-800);
                    border-color: var(--slate-700);
                }

                .box-tag {
                    background: var(--primary);
                    color: white;
                    padding: 0.2rem 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.65rem;
                    font-weight: 800;
                }

                .box-link {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: var(--slate-800);
                    text-decoration: none;
                }
                :host-context(.dark) .box-link {
                    color: var(--slate-200);
                }

                /* Utils */
                .highlight {
                    background: #fef08a; /* yellow-200 */
                    color: #854d0e;
                    border-radius: 0.125rem;
                    padding: 0 0.1rem;
                }

                .highlight-flash {
                    animation: sectionFlash 2s ease-out;
                }
                @keyframes sectionFlash {
                    0% { background: rgba(14, 165, 233, 0.05); }
                    100% { background: transparent; }
                }

                .no-results {
                    padding: 5rem 1rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }
                .no-results-icon { font-size: 3rem; opacity: 0.5; }
            `;
        }

    }

    global.CoreKnowledgeComponent = CoreKnowledgeComponent;

})(window);
