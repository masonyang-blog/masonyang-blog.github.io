/**
 * Header 組件 - Shadow DOM 封裝
 * @class HeaderComponent
 * @description Crypto Compound 部落格的標準頁首組件
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
            this.shadowRoot = this.hostElement.attachShadow({ mode: "open" });

            const prefix = this.getPathPrefix();

            // Default Configuration
            this._config = {
                debug: false,
                siteName: "Crypto Compound",
                homeUrl: `${prefix}index.html`,
                navLinks: [
                    { text: "首頁", href: `${prefix}index.html` },
                    { text: "時事點評", href: `${prefix}post/topic-crypto-news.html` },
                    { text: "市場洞見", href: `${prefix}post/archive.html` },
                    { text: "知識資料庫", href: `${prefix}post/topic-knowledge.html` },
                    { text: "關於我", href: `${prefix}about.html` }
                ]
            };
        }

        getPathPrefix() {
            // Check if we are in a subfolder (depth=1) or root (depth=0)
            // Heuristic: check if URL contains /post/, /knowledge/, /project/, /doc/
            const path = window.location.pathname;

            // If running locally with file protocol, this simple check might need adjustment,
            // but for standard web server structure:
            if (path.includes('/post/') || path.includes('/knowledge/') || path.includes('/project/') || path.includes('/doc/')) {
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
                    background-color: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
                    transition: background-color 0.3s ease, border-color 0.3s ease;
                }

                /* Dark Mode Support for Header */
                :host-context(html.dark) header {
                    background-color: rgba(19, 23, 34, 0.9); /* TV Main BG #131722 */
                    border-bottom: 1px solid rgba(42, 46, 57, 0.8); /* TV Border #2A2E39 */
                }

                :host-context(html.dark) .logo a {
                    color: #D1D4DC; /* TV Primary */
                }

                :host-context(html.dark) .nav-link {
                    color: #787B86; /* TV Secondary */
                }

                :host-context(html.dark) .nav-link:hover {
                    color: #2962FF; /* TV Blue */
                }
                
                :host-context(html.dark) .menu-icon line {
                    stroke: #787B86; /* TV Secondary */
                }
                
                :host-context(html.dark) .mobile-menu {
                    background-color: #1E222D; /* TV Card BG */
                    border-top: 1px solid #2A2E39; /* TV Border */
                }
                
                :host-context(html.dark) .mobile-nav-link {
                    color: #D1D4DC; /* TV Primary */
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
                    color: #0f172a; /* slate-900 */
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
                    color: #475569; /* slate-600 */
                    text-decoration: none;
                    transition: color 0.15s ease;
                }

                .nav-link:hover {
                    color: #f97316; /* orange-500 */
                }

                /* Theme Toggle Button */
                .theme-toggle-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 9999px;
                    color: #475569;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .theme-toggle-btn:hover {
                    background-color: rgba(0, 0, 0, 0.05);
                    color: #0f172a;
                }

                :host-context(html.dark) .theme-toggle-btn {
                    color: #94a3b8;
                }

                :host-context(html.dark) .theme-toggle-btn:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: #f1f5f9;
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

                .sun-icon { display: none; }
                .moon-icon { display: block; }

                :host-context(html.dark) .sun-icon { display: block; }
                :host-context(html.dark) .moon-icon { display: none; }


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
                    stroke: #475569;
                    stroke-width: 2;
                }

                /* Mobile Menu Dropdown */
                .mobile-menu {
                    display: none;
                    background-color: white;
                    border-top: 1px solid #e2e8f0;
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
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                :host-context(html.dark) .mobile-actions {
                    border-top-color: #334155;
                }

                .mobile-nav-link {
                    display: block;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #475569;
                    text-decoration: none;
                    padding: 0.5rem 0;
                }
                
                .mobile-nav-link:hover {
                    color: #f97316;
                }
            `;
            this.shadowRoot.appendChild(style);
        }

        createContent() {
            const header = document.createElement("header");

            // Build Nav Links
            const navItems = this._config.navLinks.map(link => `
                <li><a href="${link.href}" class="nav-link">${link.text}</a></li>
            `).join('');

            const mobileNavItems = this._config.navLinks.map(link => `
                <li><a href="${link.href}" class="mobile-nav-link">${link.text}</a></li>
            `).join('');

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
                themeToggles: this.shadowRoot.querySelectorAll('.theme-toggle-btn')
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
