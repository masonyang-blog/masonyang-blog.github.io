/**
 * Responsive Table of Contents Component
 * @class ResponsiveTocComponent
 * @description Generates a responsive TOC (Sidebar for Desktop, Drawer for Mobile) using strict Shadow DOM encapsulation.
 * Now featuring Nested Tree Hierarchy (H2 -> H3 -> H4).
 */
(function (global) {
    "use strict";

    class ResponsiveTocComponent {
        constructor() {
            // Standard Config
            this._config = {
                contentSelector: '.article-body-content' || '.prose',
                mobileTargetId: 'toc-mobile-target',
                desktopHostId: 'toc-desktop-host',
                headingSelector: 'h2, h3, h4',
                debug: false
            };

            this.headings = [];
            this.tree = [];
            this._mobileShadow = null;
            this._desktopShadow = null;
            this._observer = null; // Store observer for cleanup
            this._ignoreScrollSpy = false;
            this._scrollSpyTimeout = null;
        }

        init() {
            // 1. Locate Content
            const contentArea = document.querySelector(this._config.contentSelector) || document.querySelector('.article-body-content') || document.querySelector('.prose');
            if (!contentArea) {
                this._log('warn', 'Content area not found.');
                return this;
            }

            // 2. Scan Headings
            this.headings = Array.from(contentArea.querySelectorAll(this._config.headingSelector)).map((el, index) => {
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

            if (this.headings.length === 0) return this;

            // 3. Build Tree Structure
            this._buildTree();

            // 4. Render
            this._renderMobile();
            this._renderDesktop();

            // 5. Setup ScrollSpy
            this._setupScrollSpy();

            return this;
        }

        _buildTree() {
            this.tree = [];
            let currentH2 = null;
            let currentH3 = null;

            this.headings.forEach(h => {
                const node = { ...h, children: [] };
                if (h.level === 'h2') {
                    currentH2 = node;
                    this.tree.push(currentH2);
                    currentH3 = null;
                } else if (h.level === 'h3') {
                    if (currentH2) {
                        currentH2.children.push(node);
                        currentH3 = node;
                    } else {
                        this.tree.push(node);
                        currentH3 = node;
                    }
                } else if (h.level === 'h4') {
                    if (currentH3) {
                        currentH3.children.push(node);
                    } else if (currentH2) {
                        currentH2.children.push(node);
                    } else {
                        this.tree.push(node);
                    }
                }
            });
        }

        _setupScrollSpy() {
            // Cleanup existing observer to prevent memory leaks and double-firing
            if (this._observer) {
                this._observer.disconnect();
            }

            const options = {
                root: null,
                rootMargin: '-10% 0px -70% 0px',
                threshold: 0
            };

            this._observer = new IntersectionObserver((entries) => {
                if (this._ignoreScrollSpy) return;
                const visible = entries.filter(e => e.isIntersecting);
                if (visible.length > 0) {
                    const sorted = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                    this._setActive(sorted[0].target.id);
                }
            }, options);

            this.headings.forEach(h => this._observer.observe(h.element));
        }

        _setActive(id) {
            const update = (shadow) => {
                if (!shadow) return;
                shadow.querySelectorAll('a').forEach(a => {
                    if (a.getAttribute('href') === `#${id}`) {
                        a.classList.add('active');
                        // Expand parents if in mobile drawer and closed? (Optional)
                    } else {
                        a.classList.remove('active');
                    }
                });
            };
            update(this._mobileShadow);
            update(this._desktopShadow);
        }

        _renderMobile() {
            const host = document.getElementById(this._config.mobileTargetId);
            if (!host) return;

            // Idempotent Shadow Attachment (Using closed mode with custom property reference)
            if (!host.__mobileShadowRoot) {
                host.__mobileShadowRoot = host.attachShadow({ mode: 'closed' });
            } else {
                host.__mobileShadowRoot.innerHTML = ''; // Clear previous content
            }
            this._mobileShadow = host.__mobileShadowRoot;
            const shadow = this._mobileShadow;

            const style = document.createElement('style');
            style.textContent = `
                :host { display: block; margin-bottom: 2rem; font-family: system-ui, sans-serif; }
                .trigger { 
                    width: 100%; border: 1px solid #e2e8f0; border-left: 4px solid #f97316; 
                    background: #fff; padding: 1rem; border-radius: 0.5rem; display: flex; 
                    justify-content: space-between; align-items: center; cursor: pointer;
                    font-weight: 700; color: #0f172a;
                }
                .trigger.expanded .chevron { transform: rotate(180deg); }
                .chevron { transition: transform 0.3s; width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 2; }
                .content { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; background: #fff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 0.5rem 0.5rem; }
                .content.expanded { max-height: 70vh; overflow-y: auto; }
                ul { list-style: none; padding: 0.5rem 1rem; margin: 0; }
                li { margin: 0.25rem 0; position: relative; }
                a { display: block; padding: 0.4rem 0.75rem; color: #64748b; text-decoration: none; font-size: 0.9rem; border-left: 2px solid transparent; transition: all 0.2s; }
                a:hover { color: #f97316; background: #fff7ed; }
                a.active { color: #f97316; font-weight: 700; border-left-color: #f97316; background: #fff7ed; }
                .nested { margin-left: 1rem; border-left: 1px solid #f1f5f9; }
                :host-context(html.dark) .trigger { background: #1e293b; border-color: #334155; color: #f1f5f9; }
                :host-context(html.dark) .content { background: #1e293b; border-color: #334155; }
                :host-context(html.dark) a { color: #94a3b8; }
                :host-context(html.dark) a.active { background: rgba(249, 115, 22, 0.1); color: #fdba74; }
                :host-context(html.dark) .nested { border-left-color: #334155; }
            `;
            shadow.appendChild(style);

            const container = document.createElement('div');
            const trigger = document.createElement('div');
            trigger.className = 'trigger';
            trigger.innerHTML = `<span>在這篇文章中</span><svg class="chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
            
            const content = document.createElement('div');
            content.className = 'content';

            const renderTree = (items) => {
                if (!items || items.length === 0) return null;
                const ul = document.createElement('ul');
                items.forEach(item => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = `#${item.id}`;
                    a.textContent = item.text;
                    a.className = `level-${item.level}`;
                    a.onclick = (e) => {
                        e.preventDefault();
                        trigger.click();
                        this._handleAnchorClick(item.id);
                    };
                    li.appendChild(a);
                    if (item.children && item.children.length > 0) {
                        const subUl = renderTree(item.children);
                        subUl.className = 'nested';
                        li.appendChild(subUl);
                    }
                    ul.appendChild(li);
                });
                return ul;
            };

            content.appendChild(renderTree(this.tree));
            trigger.onclick = () => {
                const exp = trigger.classList.toggle('expanded');
                content.classList.toggle('expanded');
                content.style.maxHeight = exp ? content.scrollHeight + "px" : "0";
            };

            container.appendChild(trigger);
            container.appendChild(content);
            shadow.appendChild(container);
        }

        _renderDesktop() {
            const host = document.getElementById(this._config.desktopHostId);
            if (!host) return;

            // Idempotent Shadow Attachment (Using closed mode with custom property reference)
            if (!host.__desktopShadowRoot) {
                host.__desktopShadowRoot = host.attachShadow({ mode: 'closed' });
            } else {
                host.__desktopShadowRoot.innerHTML = ''; // Clear previous content
            }
            this._desktopShadow = host.__desktopShadowRoot;
            const shadow = this._desktopShadow;

            const style = document.createElement('style');
            style.textContent = `
                :host { display: block; font-family: system-ui, sans-serif; }
                ul { list-style: none; padding: 0; margin: 0; position: relative; }
                li { position: relative; }
                a { display: block; padding: 0.5rem 1rem 0.5rem 1rem; color: #64748b; text-decoration: none; font-size: 0.85rem; transition: all 0.2s; line-height: 1.4; border-left: 3px solid transparent; }
                a:hover { color: #334155; }
                a.active { color: #f97316; font-weight: 700; background: hsla(217, 91%, 60%, 0.05); border-left-color: #f97316; }
                .level-h2 { font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: -0.01em; color: #64748b; padding-left: 0; border-left: none; margin-left: 0; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9; }
                .nested { margin-left: 1rem; }
                :host-context(html.dark) .level-h2 { color: #94a3b8; border-bottom-color: #334155; }
                :host-context(html.dark) a { color: #94a3b8; }
                :host-context(html.dark) a:hover { color: #f1f5f9; }
                :host-context(html.dark) a.active { color: #fdba74; border-left-color: #fdba74; background: linear-gradient(to right, rgba(249, 115, 22, 0.1), transparent); }
                :host-context(html.dark) .nested { border-left-color: #334155; }
            `;
            shadow.appendChild(style);

            const renderTree = (items, isRoot = false) => {
                if (!items || items.length === 0) return null;
                const ul = document.createElement('ul');
                if (!isRoot) ul.className = 'nested';
                items.forEach(item => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = `#${item.id}`;
                    a.textContent = item.text;
                    a.className = `level-${item.level}`;
                    a.onclick = (e) => {
                        e.preventDefault();
                        this._handleAnchorClick(item.id);
                    };
                    li.appendChild(a);
                    if (item.children && item.children.length > 0) {
                        li.appendChild(renderTree(item.children));
                    }
                    ul.appendChild(li);
                });
                return ul;
            };

            shadow.appendChild(renderTree(this.tree, true));
        }

        _handleAnchorClick(id) {
            this._setActive(id);
            this._ignoreScrollSpy = true;
            if (this._scrollSpyTimeout) clearTimeout(this._scrollSpyTimeout);
            this._scrollSpyTimeout = setTimeout(() => this._ignoreScrollSpy = false, 1000);

            const target = document.getElementById(id);
            if (!target) return;

            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            history.pushState(null, null, `#${id}`);
        }

        _log(level, msg) {
            if (this._config.debug) console[level](`[ResponsiveToc] ${msg}`);
        }

        setHeadingSelector(s) { this._config.headingSelector = s; return this; }
        setTocHostId(id) { this._config.desktopHostId = id; return this; }
    }

    global.ResponsiveTocComponent = ResponsiveTocComponent;

})(window);
