/**
 * widget-global-search.js
 * 
 * Provides a global Cmd+K Spotlight search modal using Shadow DOM.
 * Retrieves data from CoreArticlesData and CoreKnowledgeRepository.
 */

(function(global) {
    "use strict";

    class GlobalSearchWidget extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'closed' });
            this._isOpen = false;
            this._results = [];
            this._selectedIndex = -1;
        }

        connectedCallback() {
            this.render();
            this.elements = {
                overlay: this.shadowRoot.querySelector('.search-overlay'),
                modal: this.shadowRoot.querySelector('.search-modal'),
                input: this.shadowRoot.querySelector('.search-input'),
                resultsContainer: this.shadowRoot.querySelector('.search-results')
            };

            this.attachEvents();
        }

        open() {
            if (this._isOpen) return;
            this._isOpen = true;
            this.style.display = 'block';
            this.elements.overlay.classList.add('active');
            
            // Allow display block to render before opacity transition
            requestAnimationFrame(() => {
                this.elements.modal.classList.add('active');
                this.elements.input.focus();
            });
            
            this.search(''); // Load default state or clear
        }

        close() {
            if (!this._isOpen) return;
            this._isOpen = false;
            this.elements.modal.classList.remove('active');
            this.elements.overlay.classList.remove('active');
            
            setTimeout(() => {
                this.style.display = 'none';
                this.elements.input.value = '';
                this.elements.resultsContainer.innerHTML = '';
            }, 300); // match transition duration
        }

        attachEvents() {
            // Close on overlay click
            this.elements.overlay.addEventListener('click', () => this.close());

            // Close on ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this._isOpen) {
                    this.close();
                }
            });

            // Input changes
            this.elements.input.addEventListener('input', (e) => {
                this.search(e.target.value.trim());
            });

            // Keyboard navigation
            this.elements.input.addEventListener('keydown', (e) => {
                if (!this._isOpen || this._results.length === 0) return;

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this._selectedIndex = (this._selectedIndex + 1) % this._results.length;
                    this.updateSelection();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this._selectedIndex = (this._selectedIndex - 1 + this._results.length) % this._results.length;
                    this.updateSelection();
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (this._selectedIndex >= 0 && this._selectedIndex < this._results.length) {
                        this.navigateTo(this._results[this._selectedIndex]);
                    }
                }
            });
        }

        search(query) {
            query = query.toLowerCase();
            this._results = [];
            this._selectedIndex = -1;

            if (!query) {
                this.renderResults();
                return;
            }

            const getPathPrefix = () => {
                const path = window.location.pathname;
                if (path.includes('/' + 'post/') || path.includes('/' + 'news/') || path.includes('/' + 'project/')) return '../';
                return './';
            };
            const prefix = getPathPrefix();

            // Search Articles
            if (global.CoreArticlesData && typeof global.CoreArticlesData.getAllArticles === 'function') {
                const articles = global.CoreArticlesData.getAllArticles();
                const matchedArticles = articles.filter(a => {
                    const t = a.title ? a.title.toLowerCase() : '';
                    const tags = Array.isArray(a.tags) ? a.tags.join(' ').toLowerCase() : '';
                    return t.includes(query) || tags.includes(query);
                }).map(a => ({
                    type: 'article',
                    title: a.title,
                    desc: a.category || 'Article',
                    url: prefix + a.link,
                    icon: '📄'
                }));
                this._results.push(...matchedArticles);
            }

            // Search Knowledge
            if (global.CoreKnowledgeRepository && Array.isArray(global.CoreKnowledgeRepository.all)) {
                const items = global.CoreKnowledgeRepository.all;
                const matchedItems = items.filter(i => {
                    const t = i.title ? i.title.toLowerCase() : '';
                    const k = i.keywords ? i.keywords.toLowerCase() : '';
                    return t.includes(query) || k.includes(query);
                }).map(i => ({
                    type: 'knowledge',
                    title: i.title,
                    desc: i.desc ? i.desc.substring(0, 60) + '...' : 'Knowledge Base',
                    url: `${prefix}post/topic-knowledge.html?q=${encodeURIComponent(i.title)}`,
                    icon: '💡'
                }));
                this._results.push(...matchedItems);
            }

            // Limit results
            this._results = this._results.slice(0, 10);
            if (this._results.length > 0) this._selectedIndex = 0;
            this.renderResults();
        }

        updateSelection() {
            const items = this.elements.resultsContainer.querySelectorAll('.result-item');
            items.forEach((item, index) => {
                if (index === this._selectedIndex) {
                    item.classList.add('selected');
                    item.scrollIntoView({ block: 'nearest' });
                } else {
                    item.classList.remove('selected');
                }
            });
        }

        navigateTo(resultObj) {
            this.close();
            window.location.href = resultObj.url;
        }

        renderResults() {
            if (this._results.length === 0) {
                const query = this.elements.input.value.trim();
                this.elements.resultsContainer.innerHTML = query 
                    ? `<div class="empty-state">無符合「${query}」的結果。</div>`
                    : `<div class="empty-state">試著搜尋文章標題、術語或標籤...</div>`;
                return;
            }

            this.elements.resultsContainer.innerHTML = this._results.map((r, index) => `
                <div class="result-item ${index === this._selectedIndex ? 'selected' : ''}" data-index="${index}">
                    <div class="result-icon">${r.icon}</div>
                    <div class="result-content">
                        <div class="result-title">${r.title}</div>
                        <div class="result-desc">${r.desc}</div>
                    </div>
                    <div class="result-action">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>
            `).join('');

            // Mouse hover handling for results
            const items = this.elements.resultsContainer.querySelectorAll('.result-item');
            items.forEach((item) => {
                item.addEventListener('mouseenter', () => {
                    this._selectedIndex = parseInt(item.getAttribute('data-index'), 10);
                    this.updateSelection();
                });
                item.addEventListener('click', () => {
                    const idx = parseInt(item.getAttribute('data-index'), 10);
                    if (idx >= 0 && idx < this._results.length) {
                        this.navigateTo(this._results[idx]);
                    }
                });
            });
        }

        getStyles() {
            const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
            const bg = isDark ? '#0f172a' : '#ffffff';
            const border = isDark ? '#1e293b' : '#e2e8f0';
            const titleCol = isDark ? '#f8fafc' : '#0f172a';
            const descCol = isDark ? '#94a3b8' : '#64748b';
            const hoverBg = isDark ? '#1e293b' : '#f1f5f9';
            const inputBg = isDark ? '#1e293b' : '#f8fafc';
            
            return `
                <style>
                    :host {
                        display: none;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 999999;
                        font-family: 'Inter', 'Noto Sans TC', sans-serif;
                    }
                    
                    .search-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.4);
                        backdrop-filter: blur(4px);
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }
                    
                    .search-overlay.active {
                        opacity: 1;
                    }

                    .search-modal {
                        position: absolute;
                        top: 15%;
                        left: 50%;
                        transform: translate(-50%, -20px) scale(0.98);
                        width: 90%;
                        max-width: 600px;
                        background: ${bg};
                        border: 1px solid ${border};
                        border-radius: 1rem;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                        opacity: 0;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .search-modal.active {
                        opacity: 1;
                        transform: translate(-50%, 0) scale(1);
                    }

                    .search-header {
                        display: flex;
                        align-items: center;
                        padding: 1rem 1.5rem;
                        border-bottom: 1px solid ${border};
                    }

                    .search-icon {
                        color: ${descCol};
                        margin-right: 1rem;
                    }

                    .search-input {
                        flex: 1;
                        border: none;
                        background: transparent;
                        font-size: 1.125rem;
                        color: ${titleCol};
                        outline: none;
                        padding: 0.5rem 0;
                    }
                    
                    .search-input::placeholder {
                        color: ${descCol};
                    }

                    .search-results {
                        max-height: 400px;
                        overflow-y: auto;
                        padding: 0.5rem;
                    }

                    .result-item {
                        display: flex;
                        align-items: center;
                        padding: 0.75rem 1rem;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        transition: background-color 0.15s ease;
                    }

                    .result-item.selected {
                        background-color: ${hoverBg};
                    }

                    .result-icon {
                        font-size: 1.25rem;
                        margin-right: 1rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .result-content {
                        flex: 1;
                        overflow: hidden;
                    }

                    .result-title {
                        font-size: 0.95rem;
                        font-weight: 600;
                        color: ${titleCol};
                        margin-bottom: 0.25rem;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .result-desc {
                        font-size: 0.75rem;
                        color: ${descCol};
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .result-action {
                        color: ${descCol};
                        opacity: 0;
                        transition: opacity 0.2s ease;
                    }

                    .result-item.selected .result-action {
                        opacity: 1;
                        color: #ea580c; /* primary orange */
                    }

                    .empty-state {
                        padding: 2rem;
                        text-align: center;
                        color: ${descCol};
                        font-size: 0.875rem;
                    }

                    .search-footer {
                        padding: 0.75rem 1.5rem;
                        border-top: 1px solid ${border};
                        background: ${inputBg};
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        font-size: 0.7rem;
                        color: ${descCol};
                    }
                    
                    .kbd {
                        background: ${bg};
                        border: 1px solid ${border};
                        border-radius: 4px;
                        padding: 0.1rem 0.4rem;
                        font-family: monospace;
                        font-weight: bold;
                        box-shadow: 0 1px 1px rgba(0,0,0,0.1);
                    }
                </style>
            `;
        }

        render() {
            this.shadowRoot.innerHTML = this.getStyles() + `
                <div class="search-overlay"></div>
                <div class="search-modal">
                    <div class="search-header">
                        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" class="search-input" placeholder="搜尋文章、知識庫或指標..." spellcheck="false" autocomplete="off">
                    </div>
                    <div class="search-results">
                        <!-- Results will be injected here -->
                    </div>
                    <div class="search-footer">
                        <span><span class="kbd">↑</span> <span class="kbd">↓</span> 導覽</span>
                        <span><span class="kbd">Enter</span> 開啟</span>
                        <span><span class="kbd">ESC</span> 關閉</span>
                    </div>
                </div>
            `;
        }
    }

    if (!customElements.get('global-search')) {
        customElements.define('global-search', GlobalSearchWidget);
    }
    
    // Global Keyboard Listener to open search
    let widgetInstance = null;
    
    const openSearch = () => {
        if (!widgetInstance) {
            widgetInstance = document.createElement('global-search');
            document.body.appendChild(widgetInstance);
        }
        widgetInstance.open();
    };

    document.addEventListener('keydown', (e) => {
        // Cmd + K or Ctrl + K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
    });
    
    // Expose API
    global.GlobalSearch = { open: openSearch };

})(window);
