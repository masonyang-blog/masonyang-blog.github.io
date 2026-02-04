/**
 * Responsive Table of Contents Component
 * @class ResponsiveTocComponent
 * @description Generates a responsive TOC (Sidebar for Desktop, Drawer for Mobile) using strict Shadow DOM encapsulation.
 */
(function (global) {
    "use strict";

    class ResponsiveTocComponent {
        constructor(hostElement) {
            // Support both desktop and mobile targets if needed, 
            // but primarily we attach specific logic to specific elements.
            // For this design, we might handle the logic centrally.

            // Standard Config
            this._config = {
                contentSelector: '.article-body', // Where to find H2/H3
                mobileTargetId: 'toc-mobile-target', // Where to inject mobile trigger/drawer
                desktopHostId: 'toc-desktop-host', // Optional: if we have a sidebar container
                debug: false
            };

            this.headings = [];
            this._mobileShadow = null;
            this._desktopShadow = null;
        }

        /**
         * Initialize the component
         */
        init() {
            // 1. Locate Content
            const contentArea = document.querySelector(this._config.contentSelector);
            if (!contentArea) {
                this._log('warn', 'Content area not found: ' + this._config.contentSelector);
                return this;
            }

            // 2. Scan Headings
            this.headings = Array.from(contentArea.querySelectorAll('h2, h3')).map((el, index) => {
                if (!el.id) el.id = `toc-heading-${index}`;
                return {
                    id: el.id,
                    text: el.innerText,
                    level: el.tagName.toLowerCase(),
                    element: el
                };
            });

            if (this.headings.length === 0) {
                this._log('info', 'No headings found.');
                return this;
            }

            // 3. Render Mobile View (Drawer)
            this._renderMobile();

            // 4. Render Desktop View (Sidebar)
            this._renderDesktop();

            // 5. Setup ScrollSpy (IntersectionObserver)
            this._setupScrollSpy();

            this._log('info', `Initialized with ${this.headings.length} headings.`);
            return this;
        }

        _setupScrollSpy() {
            if (this.headings.length === 0) return;

            const observerOptions = {
                root: null,
                rootMargin: '-100px 0px -60% 0px', // Activate when heading is near top
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this._setActive(entry.target.id);
                    }
                });
            }, observerOptions);

            this.headings.forEach(h => {
                if (h.element) observer.observe(h.element);
            });
        }

        _setActive(id) {
            const updateLinks = (shadowRoot) => {
                if (!shadowRoot) return;
                const links = shadowRoot.querySelectorAll('a');
                links.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        // Optional: Scroll sidebar/drawer to active item
                        // link.scrollIntoView({ block: 'nearest', inline: 'nearest' }); 
                    } else {
                        link.classList.remove('active');
                    }
                });
            };

            // Update both mobile and desktop
            updateLinks(this._mobileShadow);
            updateLinks(this._desktopShadow);
        }

        /**
         * Render Mobile TOC into the target container using Shadow DOM
         */
        _renderMobile() {
            const host = document.getElementById(this._config.mobileTargetId);
            if (!host) {
                this._log('warn', 'Mobile target not found: ' + this._config.mobileTargetId);
                return;
            }

            // Create Shadow DOM
            let shadow;
            try {
                // Try to use existing or create new
                if (host.shadowRoot) {
                    shadow = host.shadowRoot;
                    // Clear existing
                    while (shadow.firstChild) shadow.removeChild(shadow.firstChild);
                } else {
                    shadow = host.attachShadow({ mode: 'open' }); // Use open for debuggability if permitted, or closed. sticking to 'closed' per request for isolation but we need to store it.
                    // Actually, if we use closed, we MUST store the reference.
                    // Reverting to previous closed logic but with storage
                }
            } catch (e) {
                // If closed and we can't access it, we might be stuck. 
                // However, likely we are creating it for the first time.
                // If it fails, we might just append to light DOM as fallback? 
                // No, stick to shadow.
            }

            // Retry robustly
            if (!shadow) {
                try {
                    shadow = host.attachShadow({ mode: 'closed' });
                } catch (e) {
                    this._log('warn', 'Could not attach shadow root to mobile target. It might already have one.');
                    return;
                }
            }
            this._mobileShadow = shadow;

            // Styles
            const style = document.createElement('style');
            style.textContent = `
                :host {
                    display: block;
                    margin-bottom: 2rem;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                /* Mobile Trigger (Accordion Style) */
                .toc-trigger {
                    width: 100%;
                    background-color: #f8fafc; /* slate-50 */
                    border: 1px solid #e2e8f0; /* slate-200 */
                    border-radius: 0.5rem;
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: #0f172a; /* slate-900 */
                    font-weight: 600;
                    font-size: 1rem;
                }

                .toc-trigger:hover {
                    background-color: #f1f5f9; /* slate-100 */
                    border-color: #cbd5e1; /* slate-300 */
                }

                .chevron {
                    width: 20px;
                    height: 20px;
                    transition: transform 0.3s ease;
                    fill: none;
                    stroke: currentColor;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }

                .toc-trigger.expanded .chevron {
                    transform: rotate(180deg);
                }

                /* Content Drawer */
                .toc-content {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    background-color: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-top: none;
                    border-radius: 0 0 0.5rem 0.5rem;
                    margin-top: -1px; /* Overlap border */
                }

                .toc-content.expanded {
                    max-height: 500px; /* Approx max height, can be dynamic */
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    overflow-y: auto;
                }

                /* List */
                ul {
                    list-style: none;
                    padding: 1rem;
                    margin: 0;
                }

                li {
                    margin-bottom: 0.5rem;
                }

                li:last-child {
                    margin-bottom: 0;
                }

                a {
                    text-decoration: none;
                    color: #64748b; /* slate-500 */
                    font-size: 0.95rem;
                    display: block;
                    padding: 0.25rem 0;
                    transition: color 0.15s ease;
                    line-height: 1.5;
                }

                a:hover {
                    color: #f97316; /* orange-500 */
                }

                a.active {
                    color: #f97316;
                    font-weight: 700;
                    border-left: 2px solid #f97316;
                    padding-left: calc(1rem - 2px) !important; /* Adjust padding to keep alignment */
                    background-color: #fff7ed; /* orange-50 */
                }

                /* H3 indentation */
                a.level-h3 {
                    padding-left: 1rem;
                    font-size: 0.875rem;
                    border-left: 2px solid #e2e8f0;
                }

                /* Dark Mode Support via Host Context */
                :host-context(html.dark) .toc-trigger {
                    background-color: #1e293b; /* slate-800 */
                    border-color: #334155; /* slate-700 */
                    color: #f1f5f9; /* slate-100 */
                }
                
                :host-context(html.dark) .toc-trigger:hover {
                    background-color: #334155;
                }

                :host-context(html.dark) .toc-content {
                    background-color: #0f172a; /* slate-900 */
                    border-color: #334155;
                }

                :host-context(html.dark) a {
                    color: #94a3b8; /* slate-400 */
                }

                :host-context(html.dark) a:hover {
                    color: #fdba74; /* orange-300 */
                }

                :host-context(html.dark) a.active {
                    color: #fdba74;
                    background-color: rgba(249, 115, 22, 0.1); /* orange-500 with opacity */
                    border-left-color: #fdba74;
                }
                
                :host-context(html.dark) a.level-h3 {
                    border-left-color: #334155;
                }
            `;
            shadow.appendChild(style);

            // Container
            const container = document.createElement('div');
            container.className = 'toc-container';

            // Trigger
            const trigger = document.createElement('div');
            trigger.className = 'toc-trigger';
            trigger.innerHTML = `
                <span>在這篇文章中</span>
                <svg class="chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
            `;

            // Content
            const content = document.createElement('div');
            content.className = 'toc-content';

            const ul = document.createElement('ul');
            this.headings.forEach(h => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#${h.id}`;
                a.textContent = h.text;
                a.className = `level-${h.level}`;

                // Click handling
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Close drawer
                    trigger.classList.remove('expanded');
                    content.classList.remove('expanded');

                    // Smooth scroll with offset
                    const target = document.getElementById(h.id);
                    if (target) {
                        // Offset for sticky header (approx 80px)
                        const headerOffset = 80;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    }
                });

                li.appendChild(a);
                ul.appendChild(li);
            });

            content.appendChild(ul);
            container.appendChild(trigger);
            container.appendChild(content);

            // Event Listener for Toggle
            trigger.addEventListener('click', () => {
                const isExpanded = trigger.classList.toggle('expanded');
                content.classList.toggle('expanded');

                // Dynamic max-height for animation
                if (isExpanded) {
                    content.style.maxHeight = content.scrollHeight + "px";
                } else {
                    content.style.maxHeight = null;
                }
            });

            shadow.appendChild(container);
        }

        /**
         * Render Desktop Sidebar TOC into targeted host
         */
        _renderDesktop() {
            if (!this._config.desktopHostId) return;

            const host = document.getElementById(this._config.desktopHostId);
            if (!host) {
                // Not a warning, maybe just not present on this page
                return;
            }

            // Create Shadow DOM for isolation
            let shadow;
            try {
                if (host.shadowRoot) {
                    shadow = host.shadowRoot;
                    // Clear existing
                    while (shadow.firstChild) shadow.removeChild(shadow.firstChild);
                } else {
                    shadow = host.attachShadow({ mode: 'open' });
                }
            } catch (e) {
                console.error("Desktop Shadow Error:", e);
                // Fallback attempt?
                // Just log it
            }
            if (!shadow) {
                console.error("Desktop shadow creation failed");
                return;
            }
            this._desktopShadow = shadow;

            // Styles
            const style = document.createElement('style');
            style.textContent = `
                :host {
                    display: block;
                    font-family: 'Inter', system-ui, sans-serif;
                }
                
                ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    position: relative;
                }

                /* Vertical line track */
                ul::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background-color: #e2e8f0; /* slate-200 */
                }

                li {
                    margin-bottom: 0px;
                    position: relative;
                }

                a {
                    display: block;
                    padding: 0.5rem 0 0.5rem 1.5rem; /* Left padding for indent */
                    color: #64748b; /* slate-500 */
                    text-decoration: none;
                    border-left: 2px solid transparent; 
                    margin-left: -2px; /* Pull border onto track */
                    transition: all 0.2s ease;
                    font-size: 0.9rem;
                    line-height: 1.4;
                    position: relative;
                }

                a:hover {
                    color: #334155; /* slate-700 */
                    border-left-color: #cbd5e1; /* slate-300 */
                }

                a.active {
                    color: #f97316; /* orange-500 */
                    font-weight: 600;
                    border-left-color: #f97316;
                    background: linear-gradient(to right, #fff7ed, transparent); /* orange-50 fade */
                }

                /* Indentation for H3 */
                a.level-h3 {
                    padding-left: 2.5rem;
                    font-size: 0.85rem;
                }

                /* Dark Mode Support */
                :host-context(html.dark) ul::before {
                    background-color: #334155; /* slate-700 */
                }

                :host-context(html.dark) a {
                    color: #94a3b8; /* slate-400 */
                }

                :host-context(html.dark) a:hover {
                    color: #e2e8f0; /* slate-200 */
                    border-left-color: #475569; /* slate-600 */
                }

                :host-context(html.dark) a.active {
                    color: #fdba74; /* orange-300 */
                    border-left-color: #fdba74;
                    background: linear-gradient(to right, rgba(249, 115, 22, 0.1), transparent);
                }
            `;
            shadow.appendChild(style);

            // Container
            const ul = document.createElement('ul');
            this.headings.forEach(h => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#${h.id}`;
                a.textContent = h.text;
                a.className = `level-${h.level}`;

                // Add ID for scrollspy targeting provided in _setActive
                // Actually _setActive loops through shadowRoot links by href, so this is fine.

                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Smooth scroll
                    const target = document.getElementById(h.id);
                    if (target) {
                        const headerOffset = 80;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    }
                });

                li.appendChild(a);
                ul.appendChild(li);
            });

            shadow.appendChild(ul);
        }

        /**
         * Log utility
         */
        _log(level, msg) {
            // FORCE LOG for Debugging
            console[level](`[ResponsiveToc] ${msg}`);
        }

        // --- Chainable Setters ---

        setDebug(enabled) {
            this._config.debug = !!enabled;
            return this;
        }

        setContentSelector(selector) {
            this._config.contentSelector = selector;
            return this;
        }

        setTocHostId(id) {
            this._config.desktopHostId = id;
            return this;
        }
    }

    global.ResponsiveTocComponent = ResponsiveTocComponent;

})(window);
