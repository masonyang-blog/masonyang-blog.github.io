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

            // V3.1 6 大核心主題 Fallback (與 core-taxonomy.js 同步)
            const fallbackTopics = {
                'topic-macro': { name: '宏觀經濟、地緣與硬資產', shortName: 'Macro & Hard Assets', hubUrl: 'post/topic-winter-is-coming.html', hex: '#e11d48' },
                'topic-ai': { name: 'AI 全景：算力、基建與工程', shortName: 'AI Ecosystem & Ops', hubUrl: 'post/topic-ai-economy.html', hex: '#0891b2' },
                'topic-us-equities': { name: '美股個股與估值重定價', shortName: 'US Equities', hubUrl: 'post/topic-us-equities.html', hex: '#059669' },
                'topic-crypto-web3': { name: '比特幣、加密資產與 Web3', shortName: 'Bitcoin & Web3', hubUrl: 'post/topic-crypto.html', hex: '#ea580c' },
                'topic-strategies-tools': { name: '投研策略與實戰工具', shortName: 'Strategies & Tools', hubUrl: 'post/topic-strategies-tools.html', hex: '#6366f1' },
                'topic-personal': { name: '個人心得與跨界觀察', shortName: 'Personal & Essays', hubUrl: 'apps/archive/index.html?topic=topic-personal', hex: '#64748b' }
            };

            // V3.1 6 大研究視角 Fallback (與 core-taxonomy.js 同步)
            const fallbackCategories = {
                'asset-deep-dive': { text: '標的與協議拆解', displayTitle: 'Asset & Protocol Deep Dive', hex: '#059669' },
                'sector-thesis': { text: '產業結構與週期', displayTitle: 'Sector Thesis & Cycles', hex: '#0891b2' },
                'event-attribution': { text: '事件歸因與市場追蹤', displayTitle: 'Event Attribution & Pulse', hex: '#2563eb' },
                'red-team-risk': { text: '紅隊審查與風控預警', displayTitle: 'Red-Team & Risk Audit', hex: '#e11d48' },
                'playbook-engineering': { text: '方法論、工具與工程', displayTitle: 'Playbooks, Tools & Ops', hex: '#6366f1' },
                'essay-notes': { text: '隨筆與跨界觀察', displayTitle: 'Essays & Field Notes', hex: '#64748b' }
            };

            // 優先讀取全站 Taxonomy SSOT (window.TaxonomyConfig)，未載入時自動降級 Fallback
            const taxonomy = global.TaxonomyConfig || global.BlogTaxonomy;
            const rawTopics = (taxonomy && typeof taxonomy.getAllTopics === 'function')
                ? taxonomy.getAllTopics()
                : fallbackTopics;
            const rawCategories = (taxonomy && typeof taxonomy.getAllCategories === 'function')
                ? taxonomy.getAllCategories()
                : fallbackCategories;

            const topicLinks = Object.entries(rawTopics).map(([id, t]) => {
                const hubPath = t.hubUrl || `apps/archive/index.html?topic=${id}`;
                return {
                    id,
                    text: t.name,
                    shortName: t.shortName || '',
                    href: `${prefix}${hubPath}`,
                    hex: t.hex || '#64748b',
                    kindLabel: hubPath.includes('archive/index.html') ? '存檔' : '專題'
                };
            });

            const categoryLinks = Object.entries(rawCategories).map(([id, c]) => ({
                id,
                text: c.text,
                displayTitle: c.displayTitle || '',
                href: `${prefix}apps/archive/index.html?filter=${id}`,
                hex: c.hex || '#64748b'
            }));

            // 投研工具分組清單 (Interactive Tools SSOT)
            const toolGroups = [
                {
                    label: "估值與決策模型",
                    items: [
                        { text: "思考鏈分析工作台 (CoT Studio)", href: `${prefix}apps/cot-studio/index.html` },
                        { text: "動態雙軌制 DCF 估值終端", href: `${prefix}post/trading-strategies-dcf-valuation-model.html` },
                        { text: "比特幣曼陀羅 (Mandala)", href: `${prefix}post/crypto-btc-02-price-factors.html` }
                    ]
                },
                {
                    label: "數據對標與研究表",
                    items: [
                        { text: "動態文章研究資料表", href: `${prefix}apps/articles-spreadsheet/index.html` },
                        { text: "AI 礦企核心數據對標總表", href: `${prefix}apps/ai-miners-sheet/` }
                    ]
                }
            ];

            // Default Configuration (方案 A：市場瞬息 / 深度研究 Mega Menu / 知識百科 / 投研工具)
            this._config = {
                debug: false,
                siteName: "Mason Yang",
                homeUrl: `${prefix}index.html`,
                hideOnScroll: true,
                navLinks: [
                    { text: "市場瞬息", href: `${prefix}pulse.html` },
                    {
                        id: "research",
                        text: "深度研究",
                        href: `${prefix}apps/archive/index.html`,
                        isDropdown: true,
                        isMegaMenu: true,
                        topics: topicLinks,
                        categories: categoryLinks,
                        cta: { text: "全部研究存檔 & 多維篩選", href: `${prefix}apps/archive/index.html` },
                        children: [
                            ...topicLinks,
                            { text: "全部研究存檔", href: `${prefix}apps/archive/index.html` }
                        ]
                    },
                    { text: "知識百科", href: `${prefix}apps/topic-knowledge/topic-knowledge.html` },
                    {
                        id: "tools",
                        text: "投研工具",
                        href: `${prefix}index.html#interactive-tools`,
                        isDropdown: true,
                        isGrouped: true,
                        groups: toolGroups,
                        cta: { text: "全部分析工具總覽", href: `${prefix}index.html#interactive-tools` },
                        children: [
                            { text: "全部分析工具", href: `${prefix}index.html#interactive-tools` },
                            ...toolGroups.flatMap(g => g.items)
                        ]
                    }
                ]
            };
        }

        getPathPrefix() {
            // Determine relative path prefix based on current page depth.
            const path = window.location.pathname;

            // Depth-2 pages (e.g. /apps/..., /tools/...)
            // These are 2 levels deep and need '../../' to reach root.
            if (path.includes('/' + 'apps/') || path.includes('/' + 'tools/')) {
                return '../../';
            }

            // Depth-1 pages (e.g. /post/, /news/, /project/, /knowledge/, /doc/)
            if (
                path.includes('/' + 'post/') ||
                path.includes('/' + 'knowledge/') ||
                path.includes('/' + 'project/') ||
                path.includes('/' + 'doc/') ||
                path.includes('/' + 'news/')
            ) {
                return '../';
            }

            // Root level (index.html, pulse.html, etc.)
            return './';
        }


        init(options) {
            if (options && typeof options === 'object') {
                Object.assign(this._config, options);
            }
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

                :host(.menu-open) {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 50;
                }

                :host(.menu-open) header {
                    transform: none;
                }
                
                header {
                    background-color: var(--c-bg-header);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    border-bottom: 1px solid var(--c-border-header);
                    transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                header.header-hidden {
                    transform: translateY(-100%);
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



                /* Mobile Menu Button */
                .mobile-menu-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 44px;
                    min-height: 44px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    box-sizing: border-box;
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

                .mobile-menu-btn .icon-close {
                    display: none;
                }

                .mobile-menu-btn.active .icon-hamburger {
                    display: none;
                }

                .mobile-menu-btn.active .icon-close {
                    display: block;
                }

                /* Mobile Menu Fixed Drawer */
                .mobile-menu {
                    display: none;
                    position: fixed;
                    top: 4rem;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    height: calc(100vh - 4rem);
                    height: calc(100dvh - 4rem);
                    background-color: var(--c-bg-card);
                    border-top: 1px solid var(--c-border);
                    padding: 0.75rem 1rem 0 1rem;
                    overflow: hidden;
                    box-sizing: border-box;
                    z-index: 99;
                    transition: background-color 0.3s ease, border-color 0.3s ease;
                }

                .mobile-menu.active {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .mobile-nav-list {
                    list-style: none;
                    padding: 0 0 calc(2rem + env(safe-area-inset-bottom, 0px)) 0;
                    margin: 0;
                    flex: 1;
                    min-height: 0;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                    overscroll-behavior: contain;
                    touch-action: pan-y;
                    display: flex;
                    flex-direction: column;
                    gap: 0.375rem;
                }

                .mobile-nav-list::-webkit-scrollbar {
                    width: 4px;
                }

                .mobile-nav-list::-webkit-scrollbar-thumb {
                    background-color: var(--c-border);
                    border-radius: 9999px;
                }

                .mobile-nav-list::-webkit-scrollbar-track {
                    background: transparent;
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
                    padding: 0.5625rem 0.5rem;
                    border-radius: 0.375rem;
                    transition: color 0.2s ease, background-color 0.2s ease;
                }
                
                .mobile-nav-link:hover {
                    color: var(--c-primary);
                    background-color: rgba(249, 115, 22, 0.05);
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
                    flex-shrink: 0;
                    margin-bottom: 0.75rem;
                    padding: 0 0.25rem;
                }
                
                .mobile-search-input {
                    width: 100%;
                    min-height: 44px;
                    box-sizing: border-box;
                    background-color: var(--c-bg-body);
                    border: 1px solid var(--c-border);
                    border-radius: 0.75rem;
                    padding: 0.625rem 1rem;
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

                /* Dropdown & Mega Menu CSS */
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
                
                .nav-item-dropdown:hover .dropdown-caret,
                .nav-item-dropdown.is-open .dropdown-caret {
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
                    box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.12), 0 8px 12px -6px rgba(0, 0, 0, 0.05);
                    padding: 0.5rem 0;
                    min-width: 180px;
                    max-width: calc(100vw - 2rem);
                    list-style: none;
                    margin: 0;
                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;
                    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.2s;
                    z-index: 100;
                    box-sizing: border-box;
                }

                /* Hover 緩衝透明橋接區，防止滑鼠移過縫隙時閃退 */
                .dropdown-menu::before {
                    content: "";
                    position: absolute;
                    top: -12px;
                    left: 0;
                    right: 0;
                    height: 12px;
                }
                
                .nav-item-dropdown:hover .dropdown-menu,
                .nav-item-dropdown.is-open .dropdown-menu {
                    opacity: 1;
                    visibility: visible;
                    pointer-events: auto;
                    transform: translateX(-50%) translateY(6px);
                }
                
                .dropdown-menu.dropdown-wide {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(180px, 1fr));
                    min-width: 380px;
                    padding: 0.5rem;
                    gap: 2px;
                }

                /* 雙欄 Mega Menu (深度研究) */
                .dropdown-menu.dropdown-mega {
                    width: min(600px, calc(100vw - 2rem));
                    padding: 1rem;
                }

                .mega-grid {
                    display: grid;
                    grid-template-columns: 1.35fr 1fr;
                    gap: 1.25rem;
                }

                .mega-col {
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }

                .mega-col-title {
                    font-size: 0.6875rem;
                    font-weight: 700;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    color: var(--c-text-secondary);
                    opacity: 0.75;
                    padding: 0 0.5rem 0.5rem;
                    margin-bottom: 0.25rem;
                    border-bottom: 1px solid var(--c-border);
                }

                .mega-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .mega-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.5rem;
                    padding: 0.45rem 0.5rem;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: var(--c-text-secondary);
                    text-decoration: none;
                    border-radius: 0.4375rem;
                    transition: background-color 0.15s ease, color 0.15s ease;
                }

                .mega-item:hover,
                .mega-item:focus-visible {
                    background-color: rgba(249, 115, 22, 0.08);
                    color: var(--c-primary);
                    outline: none;
                }

                .mega-item-left {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    min-width: 0;
                }

                .mega-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 9999px;
                    flex-shrink: 0;
                }

                .mega-item-text {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .mega-badge {
                    flex-shrink: 0;
                    font-size: 0.6875rem;
                    font-weight: 600;
                    padding: 0.1rem 0.4rem;
                    border-radius: 9999px;
                    border: 1px solid var(--c-border);
                    color: var(--c-text-secondary);
                    opacity: 0.85;
                }

                .mega-footer {
                    margin-top: 0.75rem;
                    padding-top: 0.625rem;
                    border-top: 1px solid var(--c-border);
                    display: flex;
                    justify-content: flex-end;
                }

                .mega-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.375rem;
                    padding: 0.375rem 0.75rem;
                    font-size: 0.8125rem;
                    font-weight: 700;
                    color: var(--c-primary);
                    text-decoration: none;
                    border-radius: 0.375rem;
                    transition: background-color 0.15s ease;
                }

                .mega-cta:hover,
                .mega-cta:focus-visible {
                    background-color: rgba(249, 115, 22, 0.1);
                    outline: none;
                }

                /* 分組下拉選單 (投研工具) */
                .dropdown-menu.dropdown-grouped {
                    min-width: 260px;
                    padding: 0.625rem;
                }

                .dropdown-group + .dropdown-group {
                    margin-top: 0.5rem;
                    padding-top: 0.5rem;
                    border-top: 1px solid var(--c-border);
                }

                .dropdown-group-label {
                    padding: 0.25rem 0.75rem;
                    font-size: 0.6875rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    color: var(--c-text-secondary);
                    opacity: 0.75;
                }

                .dropdown-group-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .dropdown-group-footer {
                    margin-top: 0.5rem;
                    padding-top: 0.5rem;
                    border-top: 1px solid var(--c-border);
                }

                .dropdown-item {
                    display: block;
                    padding: 0.5rem 0.75rem;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: var(--c-text-secondary);
                    text-decoration: none;
                    border-radius: 0.375rem;
                    transition: background-color 0.15s ease, color 0.15s ease;
                    white-space: nowrap;
                    text-align: left;
                }
                
                .dropdown-item:hover,
                .dropdown-item:focus-visible {
                    background-color: rgba(249, 115, 22, 0.08);
                    color: var(--c-primary);
                    outline: none;
                }

                /* 768px–1024px 平板 / 窄桌機防水平溢位微調 */
                @media (min-width: 768px) and (max-width: 1024px) {
                    .nav-list {
                        gap: 1.125rem;
                    }
                    .dropdown-menu.dropdown-mega {
                        width: min(520px, calc(100vw - 2rem));
                        padding: 0.75rem;
                    }
                    .mega-grid {
                        grid-template-columns: 1.25fr 1fr;
                        gap: 0.75rem;
                    }
                }

                /* Mobile Quick Grid & Structured Accordion */
                .mobile-quick-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 0.625rem;
                    margin-bottom: 0.75rem;
                    padding: 0 0.25rem;
                    flex-shrink: 0;
                }

                .mobile-quick-tile {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.375rem;
                    min-height: 44px;
                    padding: 0.625rem 0.875rem;
                    border-radius: 0.75rem;
                    border: 1px solid var(--c-border);
                    background-color: var(--c-bg-body);
                    font-size: 0.9375rem;
                    font-weight: 700;
                    color: var(--c-text-primary);
                    text-decoration: none;
                    box-sizing: border-box;
                    transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
                }

                .mobile-quick-tile:hover,
                .mobile-quick-tile:focus-visible {
                    border-color: var(--c-primary);
                    color: var(--c-primary);
                    background-color: rgba(249, 115, 22, 0.06);
                    outline: none;
                }

                .mobile-quick-arrow {
                    font-size: 0.875rem;
                    opacity: 0.65;
                    flex-shrink: 0;
                }

                .mobile-nav-item-group {
                    display: flex;
                    flex-direction: column;
                }
                
                .mobile-accordion-toggle {
                    width: 100%;
                    min-height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.5rem;
                    padding: 0.625rem 0.75rem;
                    background: transparent;
                    border: 1px solid transparent;
                    cursor: pointer;
                    text-align: left;
                    font-family: inherit;
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--c-text-primary);
                    border-radius: 0.625rem;
                    transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
                    box-sizing: border-box;
                }
                
                .mobile-accordion-toggle:hover,
                .mobile-accordion-toggle:focus-visible {
                    background-color: rgba(249, 115, 22, 0.05);
                    color: var(--c-primary);
                    outline: none;
                }
                
                .mobile-accordion-toggle[aria-expanded="true"] {
                    color: var(--c-primary);
                    background-color: rgba(249, 115, 22, 0.08);
                    border-color: rgba(249, 115, 22, 0.35);
                }

                .mobile-accordion-caret {
                    width: 1rem;
                    height: 1rem;
                    flex-shrink: 0;
                    opacity: 0.65;
                    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
                }

                .mobile-accordion-toggle[aria-expanded="true"] .mobile-accordion-caret {
                    transform: rotate(180deg);
                    opacity: 1;
                }

                .mobile-accordion-panel {
                    display: grid;
                    grid-template-rows: 0fr;
                    transition: grid-template-rows 0.25s ease-out, opacity 0.2s ease;
                    opacity: 0;
                    overflow: hidden;
                }

                .mobile-accordion-panel.is-expanded {
                    grid-template-rows: 1fr;
                    opacity: 1;
                }

                .mobile-accordion-body {
                    min-height: 0;
                    padding: 0.375rem 0.25rem 0.625rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.375rem;
                }

                .mobile-section-label {
                    font-size: 0.6875rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    color: var(--c-text-secondary);
                    opacity: 0.75;
                    padding: 0.375rem 0.5rem 0.125rem;
                }
                
                .mobile-dropdown-menu {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                
                .mobile-dropdown-item,
                .mobile-topic-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.5rem;
                    min-height: 44px;
                    font-size: 0.9375rem;
                    font-weight: 500;
                    color: var(--c-text-secondary);
                    text-decoration: none;
                    padding: 0.5rem 0.75rem;
                    border-radius: 0.5rem;
                    border: 1px solid transparent;
                    box-sizing: border-box;
                    transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
                }
                
                .mobile-dropdown-item:hover,
                .mobile-dropdown-item:focus-visible,
                .mobile-topic-item:hover,
                .mobile-topic-item:focus-visible {
                    color: var(--c-primary);
                    border-color: rgba(249, 115, 22, 0.25);
                    background-color: rgba(249, 115, 22, 0.05);
                    outline: none;
                }

                .mobile-perspective-pills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    padding: 0.25rem 0.25rem 0.375rem;
                }

                .mobile-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.375rem;
                    min-height: 44px;
                    padding: 0.5rem 0.875rem;
                    border-radius: 9999px;
                    border: 1px solid var(--c-border);
                    background-color: var(--c-bg-body);
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: var(--c-text-secondary);
                    text-decoration: none;
                    box-sizing: border-box;
                    transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
                }

                .mobile-pill:hover,
                .mobile-pill:focus-visible {
                    color: var(--c-primary);
                    border-color: var(--c-primary);
                    background-color: rgba(249, 115, 22, 0.06);
                    outline: none;
                }

                .mobile-drawer-cta {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.375rem;
                    min-height: 44px;
                    margin-top: 0.25rem;
                    padding: 0.5rem 0.875rem;
                    border-radius: 0.625rem;
                    border: 1px solid rgba(249, 115, 22, 0.35);
                    background-color: rgba(249, 115, 22, 0.06);
                    color: var(--c-primary);
                    font-size: 0.875rem;
                    font-weight: 700;
                    text-decoration: none;
                    box-sizing: border-box;
                    transition: background-color 0.15s ease;
                }

                .mobile-drawer-cta:hover,
                .mobile-drawer-cta:focus-visible {
                    background-color: rgba(249, 115, 22, 0.12);
                    outline: none;
                }
            `;
            this.shadowRoot.appendChild(style);
        }

        createContent() {
            const header = document.createElement("header");

            // Build Nav Links with Mega Menu, Grouped Dropdown & Fallback Support
            const navItems = this._config.navLinks.map(link => {
                if (link.isMegaMenu && link.topics && link.categories) {
                    return `
                        <li class="nav-item-dropdown" data-dropdown>
                            <a href="${link.href}" class="nav-link dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                                ${link.text}<span class="dropdown-caret"></span>
                            </a>
                            <div class="dropdown-menu dropdown-mega" role="menu">
                                <div class="mega-grid">
                                    <div class="mega-col">
                                        <div class="mega-col-title">核心主題 (Topics)</div>
                                        <ul class="mega-list">
                                            ${link.topics.map(t => `
                                                <li>
                                                    <a href="${t.href}" class="mega-item" role="menuitem">
                                                        <span class="mega-item-left">
                                                            <span class="mega-dot" style="background-color: ${t.hex};"></span>
                                                            <span class="mega-item-text">${t.text}</span>
                                                        </span>
                                                        <span class="mega-badge">${t.kindLabel}</span>
                                                    </a>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                    <div class="mega-col">
                                        <div class="mega-col-title">研究視角 (Perspectives)</div>
                                        <ul class="mega-list">
                                            ${link.categories.map(c => `
                                                <li>
                                                    <a href="${c.href}" class="mega-item" role="menuitem">
                                                        <span class="mega-item-left">
                                                            <span class="mega-dot" style="background-color: ${c.hex};"></span>
                                                            <span class="mega-item-text">${c.text}</span>
                                                        </span>
                                                    </a>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                </div>
                                ${link.cta ? `
                                    <div class="mega-footer">
                                        <a href="${link.cta.href}" class="mega-cta" role="menuitem">${link.cta.text} →</a>
                                    </div>
                                ` : ''}
                            </div>
                        </li>
                    `;
                }
                if (link.isGrouped && link.groups) {
                    return `
                        <li class="nav-item-dropdown" data-dropdown>
                            <a href="${link.href}" class="nav-link dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                                ${link.text}<span class="dropdown-caret"></span>
                            </a>
                            <div class="dropdown-menu dropdown-grouped" role="menu">
                                ${link.groups.map(group => `
                                    <div class="dropdown-group">
                                        <div class="dropdown-group-label">${group.label}</div>
                                        <ul class="dropdown-group-list">
                                            ${group.items.map(item => `
                                                <li><a href="${item.href}" class="dropdown-item" role="menuitem">${item.text}</a></li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                `).join('')}
                                ${link.cta ? `
                                    <div class="dropdown-group-footer">
                                        <a href="${link.cta.href}" class="dropdown-item" role="menuitem" style="color: var(--c-primary); font-weight: 700;">${link.cta.text} →</a>
                                    </div>
                                ` : ''}
                            </div>
                        </li>
                    `;
                }
                if (link.isDropdown) {
                    const wideClass = link.isWide ? ' dropdown-wide' : '';
                    return `
                        <li class="nav-item-dropdown" data-dropdown>
                            <a href="${link.href}" class="nav-link dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                                ${link.text}<span class="dropdown-caret"></span>
                            </a>
                            <ul class="dropdown-menu${wideClass}" role="menu">
                                ${(link.children || []).map(child => `
                                    <li><a href="${child.href}" class="dropdown-item" role="menuitem">${child.text}</a></li>
                                `).join('')}
                            </ul>
                        </li>
                    `;
                }
                return `<li><a href="${link.href}" class="nav-link">${link.text}</a></li>`;
            }).join('');

            const flatMobileLinks = this._config.navLinks.filter(link => !link.isDropdown);
            const mobileQuickGrid = flatMobileLinks.length > 0 ? `
                <div class="mobile-quick-grid">
                    ${flatMobileLinks.map(link => `
                        <a href="${link.href}" class="mobile-quick-tile">
                            <span>${link.text}</span>
                            <span class="mobile-quick-arrow" aria-hidden="true">→</span>
                        </a>
                    `).join('')}
                </div>
            ` : '';

            const accordionCaretSvg = `<svg class="mobile-accordion-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

            const mobileNavItems = this._config.navLinks.filter(link => link.isDropdown).map(link => {
                let panelContent = '';
                if (link.isMegaMenu && link.topics && link.categories) {
                    panelContent = `
                        <div class="mobile-accordion-body">
                            <div class="mobile-section-label">核心主題 (Topics)</div>
                            <ul class="mobile-dropdown-menu">
                                ${link.topics.map(t => `
                                    <li>
                                        <a href="${t.href}" class="mobile-topic-item">
                                            <span class="mega-item-left">
                                                <span class="mega-dot" style="background-color: ${t.hex};"></span>
                                                <span class="mega-item-text">${t.text}</span>
                                            </span>
                                            <span class="mega-badge">${t.kindLabel}</span>
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                            <div class="mobile-section-label">研究視角 (Perspectives)</div>
                            <div class="mobile-perspective-pills">
                                ${link.categories.map(c => `
                                    <a href="${c.href}" class="mobile-pill">
                                        <span class="mega-dot" style="background-color: ${c.hex};"></span>
                                        <span>${c.text}</span>
                                    </a>
                                `).join('')}
                            </div>
                            ${link.cta ? `<a href="${link.cta.href}" class="mobile-drawer-cta">${link.cta.text} →</a>` : ''}
                        </div>
                    `;
                } else if (link.isGrouped && link.groups) {
                    panelContent = `
                        <div class="mobile-accordion-body">
                            ${link.groups.map(group => `
                                <div class="mobile-section-label">${group.label}</div>
                                <ul class="mobile-dropdown-menu">
                                    ${group.items.map(item => `
                                        <li><a href="${item.href}" class="mobile-dropdown-item">${item.text}</a></li>
                                    `).join('')}
                                </ul>
                            `).join('')}
                            ${link.cta ? `<a href="${link.cta.href}" class="mobile-drawer-cta">${link.cta.text} →</a>` : ''}
                        </div>
                    `;
                } else {
                    panelContent = `
                        <div class="mobile-accordion-body">
                            <ul class="mobile-dropdown-menu">
                                ${(link.children || []).map(child => `
                                    <li><a href="${child.href}" class="mobile-dropdown-item">${child.text}</a></li>
                                `).join('')}
                            </ul>
                        </div>
                    `;
                }

                return `
                    <li class="mobile-nav-item-group">
                        <button type="button" class="mobile-accordion-toggle" aria-expanded="false" data-accordion-trigger>
                            <span>${link.text}</span>
                            ${accordionCaretSvg}
                        </button>
                        <div class="mobile-accordion-panel">
                            ${panelContent}
                        </div>
                    </li>
                `;
            }).join('');

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
                            </ul>
                        </nav>

                        <div class="nav-group-right">
                            <button class="mobile-menu-btn" aria-label="Toggle menu" aria-expanded="false">
                                <svg class="menu-icon icon-hamburger" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                                <svg class="menu-icon icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const mobileMenu = document.createElement("div");
            mobileMenu.className = "mobile-menu";
            mobileMenu.innerHTML = `
                <div class="mobile-search-wrapper">
                    <input type="text" class="mobile-search-input" placeholder="全站搜尋 (Cmd+K)..." aria-label="Search">
                </div>
                ${mobileQuickGrid}
                <ul class="mobile-nav-list">
                    ${mobileNavItems}
                </ul>
            `;

            this.shadowRoot.appendChild(header);
            this.shadowRoot.appendChild(mobileMenu);

            // Store references
            this.elements = {
                mobileMenuBtn: this.shadowRoot.querySelector('.mobile-menu-btn'),
                mobileMenu: this.shadowRoot.querySelector('.mobile-menu'),
                searchInputs: this.shadowRoot.querySelectorAll('.header-search-input, .mobile-search-input')
            };
        }

        attachEvents() {
            let lockedScrollY = 0;

            const setBodyScrollLock = (lock) => {
                if (lock) {
                    lockedScrollY = window.scrollY || window.pageYOffset || 0;
                    document.documentElement.style.overflow = 'hidden';
                    document.body.style.overflow = 'hidden';
                    document.body.style.position = 'fixed';
                    document.body.style.top = `-${lockedScrollY}px`;
                    document.body.style.left = '0';
                    document.body.style.right = '0';
                    document.body.style.width = '100%';
                } else {
                    document.documentElement.style.overflow = '';
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.left = '';
                    document.body.style.right = '';
                    document.body.style.width = '';
                    window.scrollTo(0, lockedScrollY);
                }
            };

            const closeMobileMenu = () => {
                if (this.elements.mobileMenu.classList.contains('active')) {
                    this.elements.mobileMenu.classList.remove('active');
                    this.elements.mobileMenuBtn.classList.remove('active');
                    this.elements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    if (this.hostElement) this.hostElement.classList.remove('menu-open');
                    setBodyScrollLock(false);
                }
            };

            // Mobile Menu Toggle with Body Scroll Lock
            this.elements.mobileMenuBtn.addEventListener('click', () => {
                const isActive = this.elements.mobileMenu.classList.toggle('active');
                this.elements.mobileMenuBtn.classList.toggle('active', isActive);
                this.elements.mobileMenuBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
                if (this.hostElement) this.hostElement.classList.toggle('menu-open', isActive);
                setBodyScrollLock(isActive);
            });

            // Mobile Accordion Toggle (Zero ICON, Mutually Exclusive)
            const accordionToggles = this.elements.mobileMenu.querySelectorAll('[data-accordion-trigger]');
            accordionToggles.forEach(toggle => {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

                    accordionToggles.forEach(other => {
                        if (other !== toggle) {
                            other.setAttribute('aria-expanded', 'false');
                            const otherPanel = other.nextElementSibling;
                            if (otherPanel) otherPanel.classList.remove('is-expanded');
                        }
                    });

                    toggle.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
                    const panel = toggle.nextElementSibling;
                    if (panel) {
                        panel.classList.toggle('is-expanded', !isExpanded);
                    }
                });
            });

            // Auto-close mobile menu and release scroll lock on link click
            this.elements.mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    closeMobileMenu();
                });
            });

            // Desktop Dropdown / Mega Menu: Hover Buffer & Keyboard Accessibility
            const desktopDropdowns = this.shadowRoot.querySelectorAll('[data-dropdown]');
            const closeAllDesktopDropdowns = (except = null) => {
                desktopDropdowns.forEach(dd => {
                    if (dd !== except) {
                        dd.classList.remove('is-open');
                        const t = dd.querySelector('.dropdown-toggle');
                        if (t) t.setAttribute('aria-expanded', 'false');
                    }
                });
            };

            desktopDropdowns.forEach(dropdown => {
                const toggle = dropdown.querySelector('.dropdown-toggle');
                const menu = dropdown.querySelector('.dropdown-menu');
                if (!toggle || !menu) return;

                let closeTimer = null;
                const openMenu = () => {
                    if (closeTimer) {
                        clearTimeout(closeTimer);
                        closeTimer = null;
                    }
                    closeAllDesktopDropdowns(dropdown);
                    dropdown.classList.add('is-open');
                    toggle.setAttribute('aria-expanded', 'true');
                };

                const closeMenu = (immediate = false) => {
                    if (closeTimer) clearTimeout(closeTimer);
                    if (immediate) {
                        dropdown.classList.remove('is-open');
                        toggle.setAttribute('aria-expanded', 'false');
                        return;
                    }
                    closeTimer = setTimeout(() => {
                        dropdown.classList.remove('is-open');
                        toggle.setAttribute('aria-expanded', 'false');
                    }, 120);
                };

                dropdown.addEventListener('mouseenter', openMenu);
                dropdown.addEventListener('mouseleave', () => closeMenu(false));

                toggle.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        openMenu();
                        const firstItem = menu.querySelector('a[href]');
                        if (firstItem) firstItem.focus();
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        closeMenu(true);
                        toggle.focus();
                    }
                });

                menu.addEventListener('keydown', (e) => {
                    const items = Array.from(menu.querySelectorAll('a[href]'));
                    const currentIndex = items.indexOf(this.shadowRoot.activeElement);
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        closeMenu(true);
                        toggle.focus();
                    } else if (e.key === 'ArrowDown' && items.length > 0) {
                        e.preventDefault();
                        const next = items[(currentIndex + 1) % items.length];
                        if (next) next.focus();
                    } else if (e.key === 'ArrowUp' && items.length > 0) {
                        e.preventDefault();
                        const prev = items[(currentIndex - 1 + items.length) % items.length];
                        if (prev) prev.focus();
                    }
                });

                dropdown.addEventListener('focusout', (e) => {
                    if (!e.relatedTarget || !dropdown.contains(e.relatedTarget)) {
                        closeMenu(true);
                    }
                });
            });

            document.addEventListener('click', (e) => {
                const path = e.composedPath ? e.composedPath() : [];
                const insideDropdown = Array.from(desktopDropdowns).some(dd => path.includes(dd));
                if (!insideDropdown) closeAllDesktopDropdowns();
            });

            // Auto-close mobile menu & desktop dropdowns on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeAllDesktopDropdowns();
                    if (this.elements.mobileMenu.classList.contains('active')) {
                        closeMobileMenu();
                    }
                }
            });

            // Auto-close on viewport resize to desktop
            window.addEventListener('resize', () => {
                if (window.innerWidth >= 768 && this.elements.mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });

            // Search Logic: redirect to apps/archive/index.html with ?q= query param
            const archiveUrl = `${this.getPathPrefix()}apps/archive/index.html`;

            const goToSearch = (query) => {
                const url = query
                    ? `${archiveUrl}?q=${encodeURIComponent(query.trim())}`
                    : archiveUrl;
                window.location.href = url;
            };

            const openSearchModal = (e) => {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                goToSearch('');
            };

            // Global Cmd+K / Ctrl+K shortcut: focus the header search input
            document.addEventListener('keydown', (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    e.preventDefault();
                    const firstInput = this.elements.searchInputs[0];
                    if (firstInput) firstInput.focus();
                }
            });

            this.elements.searchInputs.forEach(input => {
                // Remove readonly so users can type directly in the header search box
                input.removeAttribute('readonly');

                // Click: focus input (already focused by browser, no nav needed yet)
                // Enter key: navigate with typed query
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        goToSearch(input.value);
                    } else if (e.key === 'Escape') {
                        input.value = '';
                        input.blur();
                    }
                });

                // Click on the search icon (parent .search-container) or the placeholder
                // If user clicks but hasn't typed anything, still navigate to archive
                input.addEventListener('click', () => {
                    // Select all text for easy replacement
                    input.select();
                });
            });

            // Headroom (Smart Header Hide on Scroll)
            let lastScrollY = window.scrollY;
            let ticking = false;
            const headerEl = this.shadowRoot.querySelector('header');

            window.addEventListener('scroll', () => {
                const isMobileMenuOpen = this.elements.mobileMenu && this.elements.mobileMenu.classList.contains('active');
                const isScrollHideDisabled = isMobileMenuOpen || this._config.hideOnScroll === false ||
                    (this.hostElement && (this.hostElement.dataset.disableScrollHide === 'true' || this.hostElement.hasAttribute('data-disable-scroll-hide')));

                if (isScrollHideDisabled) {
                    headerEl.classList.remove('header-hidden');
                    return;
                }

                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const currentScrollY = window.scrollY;
                        const delta = currentScrollY - lastScrollY;

                        if (this.elements.mobileMenu && this.elements.mobileMenu.classList.contains('active')) {
                            headerEl.classList.remove('header-hidden');
                            lastScrollY = currentScrollY;
                            ticking = false;
                            return;
                        }

                        if (currentScrollY > 100) {
                            if (delta > 10) {
                                // Scroll Down - Hide
                                headerEl.classList.add('header-hidden');
                            } else if (delta < -10) {
                                // Scroll Up - Show
                                headerEl.classList.remove('header-hidden');
                            }
                        } else {
                            // At top - Show
                            headerEl.classList.remove('header-hidden');
                        }

                        lastScrollY = currentScrollY;
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });

            // Lightbox Lazy Load
            if (document.querySelector('.prose img:not(.no-lightbox)')) {
                const prefix = this.getPathPrefix();
                const loadScript = (src) => {
                    return new Promise((resolve) => {
                        if (document.querySelector(`script[src="${src}"]`)) return resolve();
                        const script = document.createElement('script');
                        script.src = src;
                        script.onload = resolve;
                        script.onerror = resolve;
                        document.body.appendChild(script);
                    });
                };
                loadScript(`${prefix}assets/js/widgets/widget-lightbox.js`);
            }
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
