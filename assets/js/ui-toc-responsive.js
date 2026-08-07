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
                contentSelector: '.article-body-content, .article-body, .prose, article, main',
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
            // 1. Locate Content with multi-fallback queries
            let contentArea = document.querySelector(this._config.contentSelector);
            if (!contentArea) {
                contentArea = document.querySelector('.article-body') || 
                              document.querySelector('.article-body-content') || 
                              document.querySelector('.prose') || 
                              document.querySelector('article') || 
                              document.querySelector('main');
            }

            if (!contentArea) {
                this._log('warn', 'Content area not found.');
                return this;
            }

            // 2. Scan Headings
            this.headings = Array.from(contentArea.querySelectorAll(this._config.headingSelector)).map((el, index) => {
                if (!el.id) el.id = `toc-auto-${index}`;

                // Optimized text extraction: Exclude number-circle and combine title-main & title-sub if available
                let text = el.innerText;
                const titleMain = el.querySelector('.title-main');
                const titleSub = el.querySelector('.title-sub');

                if (titleMain && titleSub) {
                    const mainText = titleMain.innerText.trim();
                    const subText = titleSub.innerText.trim();
                    if (subText.startsWith(mainText) || subText.includes(mainText)) {
                        text = subText;
                    } else {
                        text = `${mainText} ${subText}`;
                    }
                } else if (titleMain) {
                    text = titleMain.innerText.trim();
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
                        // If element is in mobile drawer and drawer is open, auto scroll into view center
                        const drawer = shadow.querySelector('.drawer-panel.open');
                        if (drawer && a) {
                            a.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
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

            // Idempotent Shadow Attachment
            if (!host.__mobileShadowRoot) {
                host.__mobileShadowRoot = host.attachShadow({ mode: 'closed' });
            } else {
                host.__mobileShadowRoot.innerHTML = ''; // Clear previous content
            }
            this._mobileShadow = host.__mobileShadowRoot;
            const shadow = this._mobileShadow;

            const style = document.createElement('style');
            style.textContent = `
                :host { display: block; margin-bottom: 1.5rem; font-family: system-ui, -apple-system, sans-serif; }
                
                /* Inline trigger bar (Top of article) */
                .inline-trigger { 
                    width: 100%; border: 1px solid #e2e8f0; border-left: 4px solid #f97316; 
                    background: #ffffff; padding: 0.875rem 1rem; border-radius: 0.75rem; display: flex; 
                    justify-content: space-between; align-items: center; cursor: pointer;
                    font-weight: 700; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    transition: all 0.2s ease;
                }
                .inline-trigger:hover { border-color: #cbd5e1; border-left-color: #ea580c; background: #fafafa; }
                .inline-trigger .icon-wrap { display: flex; align-items: center; gap: 0.5rem; }
                .inline-trigger svg { width: 18px; height: 18px; stroke: #f97316; fill: none; stroke-width: 2.2; }

                /* Left Edge Handle Bar (Attached to left boundary) */
                .edge-handle-trigger {
                    position: fixed;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 9998;
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    padding: 0.75rem 0.45rem 0.75rem 0.35rem;
                    background: rgba(255, 255, 255, 0.92);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(249, 115, 22, 0.35);
                    border-left: none;
                    border-radius: 0 0.85rem 0.85rem 0;
                    color: #0f172a;
                    font-weight: 700;
                    font-size: 0.8rem;
                    box-shadow: 4px 0 15px rgba(249, 115, 22, 0.15), 2px 0 6px rgba(0, 0, 0, 0.08);
                    cursor: pointer;
                    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                    writing-mode: vertical-lr;
                    text-orientation: mixed;
                    letter-spacing: 0.12em;
                    user-select: none;
                    -webkit-user-select: none;
                }
                .edge-handle-trigger:hover, .edge-handle-trigger:active {
                    padding-right: 0.65rem;
                    background: rgba(255, 255, 255, 0.98);
                    border-color: rgba(249, 115, 22, 0.6);
                    box-shadow: 6px 0 20px rgba(249, 115, 22, 0.25);
                }
                .edge-handle-trigger.hidden {
                    opacity: 0;
                    pointer-events: none;
                    transform: translateY(-50%) translateX(-100%);
                }
                .edge-handle-trigger svg { 
                    width: 15px; 
                    height: 15px; 
                    stroke: #f97316; 
                    fill: none; 
                    stroke-width: 2.2; 
                    transform: rotate(-90deg);
                }
                .edge-handle-trigger .arrow-icon {
                    width: 12px;
                    height: 12px;
                    stroke: #94a3b8;
                    transform: rotate(0deg);
                }

                /* Drawer Backdrop Overlay */
                .backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.45);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                    z-index: 99990;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .backdrop.open {
                    opacity: 1;
                    pointer-events: auto;
                }

                /* Slide-Over Drawer Panel (Left) */
                .drawer-panel {
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    width: 85vw;
                    max-width: 320px;
                    background: #ffffff;
                    z-index: 99999;
                    transform: translate3d(-100%, 0, 0);
                    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex;
                    flex-direction: column;
                    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.15);
                }
                .drawer-panel.open {
                    transform: translate3d(0, 0, 0);
                }

                /* Drawer Header */
                .drawer-header {
                    padding: 1.25rem 1.25rem 1rem 1.25rem;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #fafafa;
                }
                .drawer-header .title {
                    font-size: 1rem;
                    font-weight: 800;
                    color: #0f172a;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .drawer-header .title svg { width: 20px; height: 20px; stroke: #f97316; fill: none; stroke-width: 2.2; }
                .drawer-header .close-btn {
                    background: #f1f5f9;
                    border: none;
                    border-radius: 9999px;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #64748b;
                    transition: all 0.2s ease;
                }
                .drawer-header .close-btn:hover { background: #e2e8f0; color: #0f172a; }
                .drawer-header .close-btn svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2.5; }

                /* Drawer Body Content */
                .drawer-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                    -webkit-overflow-scrolling: touch;
                }
                ul { list-style: none; padding: 0; margin: 0; }
                li { margin: 0.35rem 0; position: relative; }
                a { 
                    display: block; 
                    padding: 0.5rem 0.75rem; 
                    color: #475569; 
                    text-decoration: none; 
                    font-size: 0.875rem; 
                    border-left: 3px solid transparent; 
                    border-radius: 0.375rem;
                    transition: all 0.2s ease; 
                    line-height: 1.4;
                }
                a:hover { color: #f97316; background: #fff7ed; }
                a.active { 
                    color: #ea580c; 
                    font-weight: 700; 
                    border-left-color: #f97316; 
                    background: #fff7ed; 
                }
                .level-h2 { font-weight: 700; font-size: 0.9rem; }
                .level-h3 { font-size: 0.835rem; color: #64748b; }
                .level-h4 { font-size: 0.785rem; color: #94a3b8; }
                .nested { margin-left: 0.75rem; padding-left: 0.5rem; border-left: 1px solid #f1f5f9; }

                /* Dark Mode Styling */
                :host-context(html.dark) .inline-trigger { background: #1e293b; border-color: #334155; color: #f1f5f9; }
                :host-context(html.dark) .edge-handle-trigger { 
                    background: rgba(30, 41, 59, 0.92); 
                    border-color: rgba(249, 115, 22, 0.45); 
                    color: #f1f5f9;
                    box-shadow: 4px 0 18px rgba(0, 0, 0, 0.4);
                }
                :host-context(html.dark) .edge-handle-trigger:hover,
                :host-context(html.dark) .edge-handle-trigger:active {
                    background: rgba(30, 41, 59, 0.98);
                }
                :host-context(html.dark) .backdrop { background: rgba(15, 23, 42, 0.75); }
                :host-context(html.dark) .drawer-panel { background: #0f172a; border-right: 1px solid #1e293b; }
                :host-context(html.dark) .drawer-header { background: #1e293b; border-bottom-color: #334155; }
                :host-context(html.dark) .drawer-header .title { color: #f1f5f9; }
                :host-context(html.dark) .drawer-header .close-btn { background: #334155; color: #94a3b8; }
                :host-context(html.dark) .drawer-header .close-btn:hover { background: #475569; color: #f1f5f9; }
                :host-context(html.dark) a { color: #94a3b8; }
                :host-context(html.dark) a:hover { color: #fdba74; background: rgba(249, 115, 22, 0.1); }
                :host-context(html.dark) a.active { background: rgba(249, 115, 22, 0.15); color: #fdba74; border-left-color: #f97316; }
                :host-context(html.dark) .nested { border-left-color: #1e293b; }

                /* Hide Edge Handle & Drawer on Desktop Screens */
                @media (min-width: 1024px) {
                    .edge-handle-trigger, .inline-trigger, .backdrop, .drawer-panel { display: none !important; }
                }
            `;
            shadow.appendChild(style);

            // Create Backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'backdrop';

            // Create Drawer Panel
            const drawer = document.createElement('div');
            drawer.className = 'drawer-panel';

            // Drawer Header
            const drawerHeader = document.createElement('div');
            drawerHeader.className = 'drawer-header';
            drawerHeader.innerHTML = `
                <div class="title">
                    <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    <span>文章目錄</span>
                </div>
                <button class="close-btn" aria-label="關閉目錄">
                    <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </button>
            `;

            // Drawer Body
            const drawerBody = document.createElement('div');
            drawerBody.className = 'drawer-body';

            // Left Edge Handle Trigger
            const edgeHandleTrigger = document.createElement('div');
            edgeHandleTrigger.className = 'edge-handle-trigger';
            edgeHandleTrigger.innerHTML = `
                <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                <span>目錄</span>
                <svg class="arrow-icon" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" stroke-linecap="round" stroke-linejoin="round"></polyline></svg>
            `;

            const openDrawer = () => {
                backdrop.classList.add('open');
                drawer.classList.add('open');
                edgeHandleTrigger.classList.add('hidden');
                document.body.style.overflow = 'hidden'; // Lock body scroll
                
                // Auto scroll active item to center
                setTimeout(() => {
                    const active = drawerBody.querySelector('a.active');
                    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            };

            const closeDrawer = () => {
                backdrop.classList.remove('open');
                drawer.classList.remove('open');
                edgeHandleTrigger.classList.remove('hidden');
                document.body.style.overflow = ''; // Unlock body scroll
            };

            edgeHandleTrigger.onclick = openDrawer;

            // Gesture Swipe Listeners (Swipe Right from Left Edge to Open, Swipe Left to Close)
            let touchStartX = 0;
            let touchStartY = 0;

            document.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches.length === 1) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                }
            }, { passive: true });

            document.addEventListener('touchend', (e) => {
                if (!e.changedTouches || e.changedTouches.length === 0) return;
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;

                // 1. Edge Swipe Right to Open (Touch start within left edge 35px)
                if (!drawer.classList.contains('open')) {
                    if (touchStartX < 35 && deltaX > 45 && Math.abs(deltaY) < deltaX * 0.85) {
                        openDrawer();
                    }
                } else {
                    // 2. Swipe Left to Close Drawer
                    if (deltaX < -50 && Math.abs(deltaY) < Math.abs(deltaX) * 0.85) {
                        closeDrawer();
                    }
                }
            }, { passive: true });

            // Event Listeners for Closing
            backdrop.onclick = closeDrawer;
            drawerHeader.querySelector('.close-btn').onclick = closeDrawer;

            // Render Tree for Drawer
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
                        this._handleAnchorClick(item.id);
                        setTimeout(closeDrawer, 150); // Close drawer smoothly
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

            drawerBody.appendChild(renderTree(this.tree));
            drawer.appendChild(drawerHeader);
            drawer.appendChild(drawerBody);

            // Inline Trigger Bar at the top of article
            const inlineTrigger = document.createElement('div');
            inlineTrigger.className = 'inline-trigger';
            inlineTrigger.innerHTML = `
                <div class="icon-wrap">
                    <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    <span>在這篇文章中 (點擊打開側欄目錄)</span>
                </div>
                <svg style="width: 16px; height: 16px; stroke: #94a3b8;" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" stroke-linecap="round" stroke-linejoin="round"></polyline></svg>
            `;
            inlineTrigger.onclick = openDrawer;

            // Keyboard Escape listener
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && drawer.classList.contains('open')) {
                    closeDrawer();
                }
            });

            shadow.appendChild(inlineTrigger);
            shadow.appendChild(edgeHandleTrigger);
            shadow.appendChild(backdrop);
            shadow.appendChild(drawer);
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
        setContentSelector(s) { this._config.contentSelector = s; return this; }
        setTocHostId(id) { this._config.desktopHostId = id; return this; }
    }

    global.ResponsiveTocComponent = ResponsiveTocComponent;

})(window);
