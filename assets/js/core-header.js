/**
 * Header 組件 - Shadow DOM 封裝
 * @class HeaderComponent
 * @description Mason Yang Blog 部落格的標準頁首組件
 */
(function (global) {
    "use strict";

    class HeaderComponent {
        constructor(hostElement) {
            this.hostElement = hostElement || document.querySelector('#header-host');
            if (!this.hostElement) {
                console.warn('HeaderComponent: Host element not found');
                return;
            }
            this.shadowRoot = this.hostElement.attachShadow({ mode: "closed" });

            const prefix = this.getPathPrefix();

            // Default Configuration
            this._config = {
                debug: false,
                siteName: "Mason Yang",
                homeUrl: `${prefix}index.html`,
                navLinks: [
                    { text: "最新文章", href: `${prefix}index.html#recent-insights` },
                    { text: "市場瞬息", href: `${prefix}pulse.html` },
                    { text: "深度專題", href: `${prefix}index.html#series-themes` },
                    { text: "研究存檔", href: `${prefix}post/archive.html` },
                    { text: "分析工具", href: `${prefix}index.html#interactive-tools` },
                    {
                        text: "站內工具",
                        href: "#",
                        isDropdown: true,
                        children: [
                            { text: "文章資料表", href: `${prefix}post/articles-spreadsheet.html` },
                            { text: "知識資料庫", href: `${prefix}post/topic-knowledge.html` }
                        ]
                    }
                ]
            };
            }

            getPathPrefix() {
            // Check if we are in a subfolder (depth=1) or root (depth=0)
            // Heuristic: check if URL contains /post/, /knowledge/, /project/, /doc/
            const path = window.location.pathname;

            // If running locally with file protocol, this simple check might need adjustment,
            // but for standard web server structure:
            if (path.includes('/' + 'post/') || path.includes('/' + 'knowledge/') || path.includes('/' + 'project/') || path.includes('/' + 'doc/') || path.includes('/' + 'news/')) {
                return '../';
            }
            // Add more depth checks if needed (e.g. nested folders)
            // Default to root
            return './';
        }

        init() {
            this.createStyles();
            this.createContent();
            this.attachEvents();
            if (this._config.debug) console.log("Header initialized");
            return this;
        }

        createStyles() {
            const style = document.createElement("style");
            style.textContent = `
                :host {
                    display: block;
                    position: sticky;
                    top: 0;
                    z-index: 50;
                    width: 100%;
                    font-family: 'Inter', 'Noto Sans TC', sans-serif;
                }
                
                header {
                    background-color: var(--c-bg-header);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    border-bottom: 1px solid var(--c-border-header);
                    transition: background-color 0.3s ease, border-color 0.3s ease;
                }

                .container {
                    max-width: 80rem; /* 7xl */
                    margin: 0 auto;
                    padding: 0 1rem;
                }

                @media (min-width: 640px) { .container { padding: 0 1.5rem; } }
                @media (min-width: 1024px) { .container { padding: 0 2rem; } }

                .nav-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 4rem; /* 16 */
                }

                .nav-group-right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .logo {
                    flex-shrink: 0;
                }

                .logo a {
                    font-size: 1.5rem; /* 2xl */
                    font-weight: 700;
                    color: var(--c-text-primary);
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .desktop-nav {
                    display: none;
                }

                @media (min-width: 768px) {
                    .desktop-nav {
                        display: block;
                    }
                }

                .nav-list {
                    display: flex;
                    align-items: center;
                    gap: 2rem; /* space-x-8 */
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .nav-link {
                    font-size: 0.875rem; /* sm */
                    font-weight: 600;
                    color: var(--c-text-secondary);
                    text-decoration: none;
                    transition: color 0.15s ease;
                }

                .nav-link:hover {
                    color: var(--c-primary);
                }

                /* Theme Toggle Button */
                .theme-toggle-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 9999px;
                    color: var(--c-text-secondary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .theme-toggle-btn:hover {
                    background-color: var(--c-border);
                    color: var(--c-text-primary);
                }

                .theme-icon {
                    width: 20px;
                    height: 20px;
                    fill: none;
                    stroke: currentColor;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }

                .sun-icon { display: var(--c-display-sun); }
                .moon-icon { display: var(--c-display-moon); }

                /* Mobile Menu Button */
                .mobile-menu-btn {
                    display: block;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                }

                @media (min-width: 768px) {
                    .mobile-menu-btn {
                        display: none;
                    }
                }

                .menu-icon line {
                    stroke: var(--c-text-secondary);
                    stroke-width: 2;
                }

                /* Mobile Menu Dropdown */
                .mobile-menu {
                    display: none;
                    background-color: var(--c-bg-card);
                    border-top: 1px solid var(--c-border);
                    padding: 1rem;
                    transition: background-color 0.3s ease, border-color 0.3s ease;
                }

                .mobile-menu.active {
                    display: block;
                }

                .mobile-nav-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .mobile-actions {
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--c-border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .mobile-nav-link {
                    display: block;
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--c-text-primary);
                    text-decoration: none;
                    padding: 0.5rem 0;
                }
                
                .mobile-nav-link:hover {
                    color: var(--c-primary);
                }

                /* Search Bar Styles */
                .search-container {
                    position: relative;
                    margin-left: 1rem;
                    margin-right: 1.5rem;
                }
                
                .header-search-input {
                    background-color: var(--c-bg-body);
                    border: 1.5px solid var(--c-border);
                    border-radius: 0.75rem;
                    padding: 0.5rem 1rem 0.5rem 2.5rem;
                    font-size: 0.8125rem;
                    width: 180px;
                    color: var(--c-text-primary);
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    outline: none;
                }
                
                .header-search-input:focus {
                    background-color: var(--c-bg-card);
                    border-color: var(--c-primary);
                    width: 240px;
                    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.1);
                }
                
                .header-search-icon {
                    position: absolute;
                    left: 0.875rem;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 0.875rem;
                    height: 0.875rem;
                    color: var(--c-text-tertiary);
                    pointer-events: none;
                }

                /* Mobile Search Styles */
                .mobile-search-wrapper {
                    margin-bottom: 1.5rem;
                    padding: 0 0.5rem;
                }
                
                .mobile-search-input {
                    width: 100%;
                    background-color: var(--c-bg-body);
                    border: 1px solid var(--c-border);
                    border-radius: 0.75rem;
                    padding: 0.75rem 1rem;
                    font-size: 0.875rem;
                    color: var(--c-text-primary);
                    outline: none;
                    transition: border-color 0.2s;
                }
                
                .mobile-search-input:focus {
                    border-color: var(--c-primary);
                }

                @media (max-width: 1024px) {
                    .header-search-input { width: 140px; }
                    .header-search-input:focus { width: 180px; }
                }
                
                @media (max-width: 767px) {
                    .search-container { display: none; }
                }

                /* Dropdown Menu CSS */
                .nav-item-dropdown {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                
                .dropdown-toggle {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }
                
                .dropdown-caret {
                    display: inline-block;
                    width: 0;
                    height: 0;
                    margin-left: 6px;
                    vertical-align: middle;
                    border-top: 4px solid;
                    border-right: 4.5px solid transparent;
                    border-left: 4.5px solid transparent;
                    opacity: 0.7;
                    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .nav-item-dropdown:hover .dropdown-caret {
                    transform: rotate(180deg);
                    opacity: 1;
                }
                
                .dropdown-menu {
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%) translateY(12px);
                    background-color: var(--c-bg-card);
                    border: 1px solid var(--c-border);
                    border-radius: 0.75rem;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
                    padding: 0.5rem 0;
                    min-width: 140px;
                    list-style: none;
                    margin: 0;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.25s;
                    z-index: 100;
                }
                
                .nav-item-dropdown:hover .dropdown-menu {
                    opacity: 1;
                    visibility: visible;
                    transform: translateX(-50%) translateY(6px);
                }
                
                .dropdown-item {
                    display: block;
                    padding: 0.5rem 1.25rem;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: var(--c-text-secondary);
                    text-decoration: none;
                    transition: background-color 0.15s ease, color 0.15s ease;
                    white-space: nowrap;
                    text-align: left;
                }
                
                .dropdown-item:hover {
                    background-color: rgba(249, 115, 22, 0.08);
                    color: var(--c-primary);
                }

                /* Mobile Grouping CSS */
                .mobile-nav-item-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .mobile-nav-group-title {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--c-text-tertiary);
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    margin-top: 0.5rem;
                    margin-bottom: 0.25rem;
                    padding-left: 0.5rem;
                }
                
                .mobile-dropdown-menu {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .mobile-dropdown-item {
                    display: block;
                    font-size: 0.9375rem;
                    font-weight: 600;
                    color: var(--c-text-secondary);
                    text-decoration: none;
                    padding: 0.375rem 0 0.375rem 1.25rem; /* 左側縮排，提供視覺層級 */
                    border-left: 2px solid var(--c-border);
                    transition: color 0.15s ease, border-color 0.15s ease;
                }
                
                .mobile-dropdown-item:hover {
                    color: var(--c-primary);
                    border-left-color: var(--c-primary);
                }
            `;
            this.shadowRoot.appendChild(style);
        }

        createContent() {
            const header = document.createElement("header");

            // Build Nav Links with Dropdown Support
            const navItems = this._config.navLinks.map(link => {
                if (link.isDropdown) {
                    return `
                        <li class="nav-item-dropdown">
                            <a href="${link.href}" class="nav-link dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                                ${link.text}<span class="dropdown-caret"></span>
                            </a>
                            <ul class="dropdown-menu">
                                ${link.children.map(child => `
                                    <li><a href="${child.href}" class="dropdown-item">${child.text}</a></li>
                                `).join('')}
                            </ul>
                        </li>
                    `;
                }
                return `<li><a href="${link.href}" class="nav-link">${link.text}</a></li>`;
            }).join('');

            const mobileNavItems = this._config.navLinks.map(link => {
                if (link.isDropdown) {
                    return `
                        <li class="mobile-nav-item-group">
                            <div class="mobile-nav-group-title">${link.text}</div>
                            <ul class="mobile-dropdown-menu">
                                ${link.children.map(child => `
                                    <li><a href="${child.href}" class="mobile-dropdown-item">${child.text}</a></li>
                                `).join('')}
                            </ul>
                        </li>
                    `;
                }
                return `<li><a href="${link.href}" class="mobile-nav-link">${link.text}</a></li>`;
            }).join('');

            // Icons
            const moonIcon = `<svg class="theme-icon moon-icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
            const sunIcon = `<svg class="theme-icon sun-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

            header.innerHTML = `
                <div class="container">
                    <div class="nav-bar">
                        <div class="logo">
                            <a href="${this._config.homeUrl}">${this._config.siteName}</a>
                        </div>
                        
                        <nav class="desktop-nav">
                            <ul class="nav-list">
                                ${navItems}
                                <li>
                                    <div class="search-container">
                                        <svg class="header-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        <input type="text" class="header-search-input" placeholder="全站搜尋 (Cmd+K)..." aria-label="Search">
                                    </div>
                                </li>
                                <li>
                                    <button class="theme-toggle-btn" aria-label="Toggle Dark Mode">
                                        ${moonIcon}
                                        ${sunIcon}
                                    </button>
                                </li>
                            </ul>
                        </nav>

                        <div class="nav-group-right">
                            <button class="mobile-menu-btn" aria-label="Toggle menu">
                                <svg class="menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="mobile-menu">
                    <div class="mobile-search-wrapper">
                        <input type="text" class="mobile-search-input" placeholder="全站搜尋 (Cmd+K)..." aria-label="Search">
                    </div>
                    <ul class="mobile-nav-list">
                        ${mobileNavItems}
                    </ul>
                    <div class="mobile-actions">
                         <span class="mobile-nav-link" style="font-size: 0.875rem;">切換主題</span>
                         <button class="theme-toggle-btn" aria-label="Toggle Dark Mode">
                            ${moonIcon}
                            ${sunIcon}
                        </button>
                    </div>
                </div>
            `;

            this.shadowRoot.appendChild(header);

            // Store references
            this.elements = {
                mobileMenuBtn: this.shadowRoot.querySelector('.mobile-menu-btn'),
                mobileMenu: this.shadowRoot.querySelector('.mobile-menu'),
                themeToggles: this.shadowRoot.querySelectorAll('.theme-toggle-btn'),
                searchInputs: this.shadowRoot.querySelectorAll('.header-search-input, .mobile-search-input')
            };
        }

        attachEvents() {
            // Mobile Menu Toggle
            this.elements.mobileMenuBtn.addEventListener('click', () => {
                this.elements.mobileMenu.classList.toggle('active');
            });

            // Theme Toggle
            this.elements.themeToggles.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (window.toggleTheme) {
                        window.toggleTheme();
                    } else {
                        console.warn("theme-core.js not loaded");
                    }
                });
            });

            // Search Logic (Global Cmd+K Integration)
            const openSearchModal = (e) => {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                const prefix = this.getPathPrefix();
                
                const loadScript = (src) => {
                    return new Promise((resolve) => {
                        if (document.querySelector(`script[src="${src}"]`)) return resolve();
                        const script = document.createElement('script');
                        script.src = src;
                        script.onload = resolve;
                        // Avoid rejecting if one script fails, try to load others
                        script.onerror = resolve; 
                        document.body.appendChild(script);
                    });
                };

                // Lazy load dependencies and widget
                Promise.all([
                    loadScript(`${prefix}assets/js/core-articles-data.js`),
                    loadScript(`${prefix}assets/js/app-knowledge-data.js`),
                    loadScript(`${prefix}assets/js/widget-global-search.js`)
                ]).then(() => {
                    if (global.GlobalSearch) {
                        global.GlobalSearch.open();
                    }
                });
            };

            this.elements.searchInputs.forEach(input => {
                input.addEventListener('click', openSearchModal);
                input.addEventListener('focus', openSearchModal);
                input.setAttribute('readonly', 'readonly');
            });
        }

        // --- Chainable Setters ---

        setDebug(debug) {
            this._config.debug = !!debug;
            return this;
        }

        setSiteName(name) {
            this._config.siteName = name;
            // Re-render handled by init usually, but simple text updates can be direct if needed.
            // For simplicity in this static site context, we assume config is set before init().
            return this;
        }

        setHomeUrl(url) {
            this._config.homeUrl = url;
            return this;
        }

        setNavLinks(links) {
            this._config.navLinks = links;
            return this;
        }
    }

    global.HeaderComponent = HeaderComponent;

})(window);
