/**
 * Article TOC Utilities (Light DOM Version)
 * Fixed Sidebar Layout (Reverted from Accordion)
 */
(function (global) {
    "use strict";

    class ArticleTOC {
        constructor() {
            this.tocHost = document.getElementById('toc-desktop-host');
            this.contentArea = document.querySelector('.article-body-content') || document.querySelector('.prose');
            this.headings = [];
            this.observer = null;
            this._ignoreScrollSpy = false;
            this._scrollSpyTimeout = null;
            this._mode = 'static'; // 預設為靜態模式
            this._headingSelector = 'h2, h3, h4'; // 預設掃描層級
        }

        /**
         * 設定掃描標題層級
         * @param {string} selector - CSS Selector (e.g. 'h2, h3, h4')
         */
        setHeadingSelector(selector) {
            this._headingSelector = selector;
            return this;
        }

        /**
         * 設定顯示模式
         * @param {string} mode - 'static' | 'accordion'
         */
        setMode(mode) {
            this._mode = mode;
            return this;
        }

        init() {
            // Re-query hosts to ensure we have the latest DOM references
            this.tocHost = document.getElementById('toc-desktop-host');
            this.contentArea = document.querySelector('.article-body-content') || document.querySelector('.prose') || document.querySelector('.article-body');
            
            if (!this.tocHost || !this.contentArea) return;

            // Reset state
            this.headings = [];
            if (this.observer) this.observer.disconnect();
            // 1. Collect Headings
            this.headings = Array.from(this.contentArea.querySelectorAll(this._headingSelector)).map((el, index) => {
                if (!el.id) el.id = `toc-auto-${index}`;
                
                // Optimized text extraction: Exclude number-circle & sub-titles to avoid layout crowding in TOC
                let text = el.innerText;
                if (el.querySelector('.title-main')) {
                    text = el.querySelector('.title-main').innerText;
                } else if (el.querySelector('.number-circle')) {
                    const cloned = el.cloneNode(true);
                    cloned.querySelectorAll('.number-circle').forEach(n => n.remove());
                    text = cloned.innerText;
                }
                
                return {
                    id: el.id,
                    text: text.replace(/\s+/g, ' ').trim(),
                    level: el.tagName.toLowerCase(),
                    element: el
                };
            });

            if (this.headings.length === 0) return;

            // 2. Render HTML
            this.render();

            // 3. Setup Scroll Spy
            this.setupScrollSpy();

            // 4. Sync with Section Expansion
            document.addEventListener('section-expand', (e) => {
                const targetId = e.detail.id; // This is the chapter-id (e.g., 'part-4')
                const section = document.querySelector(`collapsible-section[chapter-id="${targetId}"]`);
                if (section) {
                    const h2 = section.querySelector('h2');
                    if (h2 && h2.id) {
                        this.setActive(h2.id);
                    }
                }
            });

            return this;
        }

        render() {
            const container = document.createElement('div');
            container.className = `toc-navigation-groups ${this._mode === 'accordion' ? 'mode-accordion' : 'mode-static'}`;

            this._injectTOCStyles();

            // 1. Build hierarchical tree: H2 -> H3 -> H4
            const tree = [];
            let currentH2 = null;
            let currentH3 = null;

            this.headings.forEach(h => {
                if (h.level === 'h2') {
                    currentH2 = { ...h, children: [] };
                    tree.push(currentH2);
                    currentH3 = null;
                } else if (h.level === 'h3') {
                    const h3Item = { ...h, children: [] };
                    if (currentH2) {
                        currentH2.children.push(h3Item);
                        currentH3 = h3Item;
                    } else {
                        // Orphan H3
                        tree.push(h3Item);
                        currentH3 = h3Item;
                    }
                } else if (h.level === 'h4') {
                    if (currentH3) {
                        currentH3.children.push(h);
                    } else if (currentH2) {
                        currentH2.children.push(h);
                    } else {
                        // Orphan H4
                        tree.push(h);
                    }
                }
            });

            // 2. Recursive Render Function
            const renderItem = (item, levelClass) => {
                const li = document.createElement('li');
                li.className = 'relative';

                const a = document.createElement('a');
                a.href = `#${item.id}`;
                a.textContent = item.text;
                a.dataset.targetId = item.id;
                a.className = `toc-link ${levelClass} block transition-all duration-200`;

                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    this._handleAnchorClick(item.id);
                });

                li.appendChild(a);

                if (item.children && item.children.length > 0) {
                    const subUl = document.createElement('ul');
                    subUl.className = 'toc-nested-list ml-4 mt-1 mb-2';
                    item.children.forEach(child => {
                        const childLevel = child.level === 'h3' ? 'toc-level-h3' : 'toc-level-h4';
                        subUl.appendChild(renderItem(child, childLevel));
                    });
                    li.appendChild(subUl);
                }

                return li;
            };

            // 3. Main Loop
            tree.forEach(h2 => {
                const sectionGroup = document.createElement('div');
                sectionGroup.className = 'toc-section-group mb-6';
                sectionGroup.dataset.groupId = h2.id;

                const a = document.createElement('a');
                a.href = `#${h2.id}`;
                a.textContent = h2.text;
                a.dataset.targetId = h2.id;
                a.className = 'toc-level-h2 toc-link block text-[13px] font-extrabold uppercase tracking-tight text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-all py-3 border-b border-slate-50 dark:border-slate-800/50 mb-2';

                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    this._handleAnchorClick(h2.id);
                    if (this._mode === 'accordion') {
                        this._toggleGroup(sectionGroup, true);
                    }
                });

                sectionGroup.appendChild(a);

                if (h2.children && h2.children.length > 0) {
                    const subList = document.createElement('ul');
                    subList.className = 'toc-sublist ml-1 mt-1 overflow-hidden transition-all duration-300 ease-in-out';
                    
                    h2.children.forEach(child => {
                        const childLevel = child.level === 'h3' ? 'toc-level-h3' : 'toc-level-h4';
                        subList.appendChild(renderItem(child, childLevel));
                    });

                    sectionGroup.appendChild(subList);
                }
                
                container.appendChild(sectionGroup);
            });

            this.tocHost.innerHTML = '';
            this.tocHost.appendChild(container);
        }

        setupScrollSpy() {
            if (this.observer) this.observer.disconnect();

            const options = {
                root: null,
                rootMargin: '-10% 0px -70% 0px',
                threshold: 0
            };

            this.observer = new IntersectionObserver((entries) => {
                if (this._ignoreScrollSpy) return;

                const visibleEntries = entries.filter(e => e.isIntersecting);
                if (visibleEntries.length > 0) {
                    const sorted = visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                    this.setActive(sorted[0].target.id);
                }
            }, options);

            this.headings.forEach(h => {
                if (h.element) this.observer.observe(h.element);
            });
        }

        _handleAnchorClick(id) {
            this.setActive(id);
            this._ignoreScrollSpy = true;
            if (this._scrollSpyTimeout) clearTimeout(this._scrollSpyTimeout);
            this._scrollSpyTimeout = setTimeout(() => {
                this._ignoreScrollSpy = false;
            }, 1000);

            const target = document.getElementById(id);
            if (!target) return;
            
            const section = target.closest('collapsible-section');
            if (section && typeof section.expand === 'function') {
                section.expand();
            }

            // Using requestAnimationFrame to ensure the expansion has started and layout might have shifted
            requestAnimationFrame(() => {
                const headerOffset = 120; // Increased for better clearance
                
                // For main section headers (H2), we prefer scrolling to the component itself
                const scrollTarget = (target.tagName.toLowerCase() === 'h2' && section) ? section : target;
                
                const targetTop = scrollTarget.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: targetTop, behavior: 'smooth' });
                
                history.pushState(null, null, `#${id}`);
            });
        }

        _toggleGroup(group, expand) {
            const sublist = group.querySelector('.toc-sublist');
            if (!sublist) return;

            if (expand) {
                group.classList.add('is-expanded');
                sublist.style.maxHeight = sublist.scrollHeight + 'px';
                sublist.style.opacity = '1';
                sublist.style.marginTop = '4px';
            } else {
                group.classList.remove('is-expanded');
                sublist.style.maxHeight = '0px';
                sublist.style.opacity = '0';
                sublist.style.marginTop = '0px';
            }
        }

        _injectTOCStyles() {
            if (document.getElementById('toc-desktop-styles')) return;
            const style = document.createElement('style');
            style.id = 'toc-desktop-styles';
            style.textContent = `
                 /* 基礎連結樣式 */
                .toc-link {
                    padding-left: 1rem;
                    color: var(--c-text-secondary, #475569);
                    font-size: 0.8125rem;
                    line-height: 1.6;
                    border-left: 2px solid transparent;
                }
                
                .toc-link:hover {
                    color: var(--c-primary, #f97316);
                    background: var(--c-bg-soft-blue, rgba(37, 99, 235, 0.03));
                }

                /* 活動連結樣式：使用品牌橘色 */
                .toc-link.active-link {
                    color: var(--c-primary, #f97316) !important;
                    font-weight: 700;
                    background: var(--c-bg-soft-orange, rgba(249, 115, 22, 0.05));
                    border-left: 3px solid var(--c-primary, #f97316) !important;
                    padding-left: calc(1rem - 3px);
                }
                
                /* 特殊層級調整 */
                .toc-level-h2 {
                    padding-left: 0 !important;
                }
                
                .toc-level-h4 {
                    font-size: 11px;
                    opacity: 0.8;
                }
                
                /* 嵌套列表縮排：移除邊框 */
                .toc-nested-list {
                    margin-left: 1rem;
                    padding-left: 0;
                }

                /* Accordion Mode Styles */
                .mode-accordion .toc-sublist {
                    max-height: 0;
                    opacity: 0;
                    margin-top: 0;
                    pointer-events: none;
                    overflow: hidden;
                }
                .mode-accordion .toc-section-group.is-expanded .toc-sublist {
                    max-height: 2000px;
                    opacity: 1;
                    margin-top: 4px;
                    pointer-events: auto;
                }
            `;
            document.head.appendChild(style);
        }

        setActive(id) {
            const allLinks = this.tocHost.querySelectorAll('a');
            allLinks.forEach(a => {
                a.classList.remove('active-link');
            });

            const activeLink = this.tocHost.querySelector(`a[data-target-id="${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active-link');
                
                if (this._mode === 'accordion') {
                    const parentGroup = activeLink.closest('.toc-section-group');
                    if (parentGroup) {
                        // Collapse others
                        this.tocHost.querySelectorAll('.toc-section-group').forEach(group => {
                            if (group !== parentGroup) this._toggleGroup(group, false);
                        });
                        // Expand current
                        this._toggleGroup(parentGroup, true);
                    }
                }

                activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    global.ArticleTOC = ArticleTOC;

})(window);
