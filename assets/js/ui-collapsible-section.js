/**
 * Collapsible Section Component
 * @class CollapsibleSection
 * @description Provides a collapsible container with a premium header and Shadow DOM encapsulation for the 2026 Macro Report.
 */
(function (global) {
    "use strict";

    class CollapsibleSection extends HTMLElement {
        constructor() {
            super();

            // Config & State
            this._config = {
                title: this.getAttribute('title') || this.getAttribute('data-title') || '章節內容',
                id: this.getAttribute('chapter-id') || this.getAttribute('data-id') || '',
                expanded: this.hasAttribute('expanded'),
                debug: false
            };

            this._isExpanded = this._config.expanded;
            
            this.attachShadow({ mode: 'open' });
        }

        static get observedAttributes() {
            return ['title', 'chapter-id', 'expanded'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) return;
            if (name === 'title') this._config.title = newValue;
            if (name === 'chapter-id') this._config.id = newValue;
            if (name === 'expanded') this._isExpanded = (newValue !== null);
            this.render();
        }

        connectedCallback() {
            this.render();
            // Initial check for hash if this is the target
            setTimeout(() => this._handleInitialHash(), 100);
        }

        _handleInitialHash() {
            const hash = window.location.hash.substring(1);
            if (!hash) return;
            
            // If the hash matches this section's ID or an element inside it
            if (hash === this._config.id || this.querySelector(`#${hash}`)) {
                this._log('info', `Auto-expanding for initial hash: #${hash}`);
                this.expand();
            }
        }

        /**
         * Render the component structure
         */
        render() {
            const title = this.getAttribute('title') || this.getAttribute('data-title') || this._config.title;
            const id = this.getAttribute('chapter-id') || this.getAttribute('data-id') || this._config.id;
            const expanded = this.hasAttribute('expanded');

            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        margin-bottom: 2rem;
                        font-family: 'Inter', 'Noto Sans TC', system-ui, sans-serif;
                    }

                    .collapsible-host {
                        border-radius: 1.25rem;
                        overflow: hidden;
                        background: var(--bg-card, #ffffff);
                        border: 1px solid var(--border-color, #e2e8f0);
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    :host([expanded]) .collapsible-host {
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                        border-color: var(--primary-color, #3b82f6);
                    }

                    /* Header Styling - Advanced HSL Gradients */
                    .header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 1.25rem 1.5rem;
                        cursor: pointer;
                        user-select: none;
                        background: linear-gradient(135deg, hsla(217, 91%, 60%, 0.05) 0%, hsla(215, 25%, 27%, 0) 100%);
                        transition: background 0.2s ease;
                    }

                    .header:hover {
                        background: linear-gradient(135deg, hsla(217, 91%, 60%, 0.08) 0%, hsla(215, 25%, 27%, 0.02) 100%);
                    }

                    .title-wrapper {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                    }

                    .status-dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background-color: #cbd5e1;
                        transition: all 0.3s ease;
                    }

                    :host([expanded]) .status-dot {
                        background-color: #3b82f6;
                        box-shadow: 0 0 8px #3b82f6;
                    }

                    .title {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: #1e293b;
                        margin: 0;
                        transition: color 0.3s ease;
                    }

                    :host([expanded]) .title {
                        color: #1e293b; /* Keep it dark for clarity or switch to primary if desired */
                    }

                    /* Toggle Icon */
                    .toggle-icon {
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        background: #f1f5f9;
                        color: #64748b;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    :host([expanded]) .toggle-icon {
                        transform: rotate(180deg);
                        background: #3b82f6;
                        color: #ffffff;
                    }

                    /* Content Wrapper with Animation - Using Grid Trick for smooth auto-height */
                    .content-wrapper {
                        display: grid;
                        grid-template-rows: 0fr;
                        transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    :host([expanded]) .content-wrapper {
                        grid-template-rows: 1fr;
                    }

                    .content-inner {
                        overflow: hidden;
                        padding: 0 1.5rem;
                        transition: padding 0.4s ease, opacity 0.3s ease;
                        opacity: 0;
                    }

                    :host([expanded]) .content-inner {
                        padding: 0 1.5rem 2rem 1.5rem;
                        opacity: 1;
                    }

                    /* Dark Mode Support (Host Context) */
                    :host-context(html.dark) .collapsible-host {
                        background: #1e293b;
                        border-color: #334155;
                    }

                    :host-context(html.dark) .header {
                        background: linear-gradient(135deg, hsla(217, 91%, 60%, 0.1) 0%, hsla(215, 25%, 27%, 0) 100%);
                    }

                    :host-context(html.dark) .title {
                        color: #f1f5f9;
                    }

                    :host-context(html.dark) .toggle-icon {
                        background: #334155;
                        color: #94a3b8;
                    }

                    :host-context(html.dark) .content-inner {
                        color: #cbd5e1;
                    }
                </style>
                <div class="collapsible-host" id="${id}">
                    <div class="header" role="button" aria-expanded="${expanded}">
                        <div class="title-wrapper">
                            <div class="status-dot"></div>
                            <h3 class="title">${title}</h3>
                        </div>
                        <div class="toggle-icon">
                            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="currentColor">
                                <path d="M1 1L7 7L13 1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div class="content-wrapper">
                        <div class="content-inner">
                            <slot></slot>
                        </div>
                    </div>
                </div>
            `;

            // Re-attach listeners
            this.shadowRoot.querySelector('.header').addEventListener('click', () => this.toggle());
        }

        // --- Public API ---
        
        toggle() {
            this._isExpanded ? this.collapse() : this.expand();
            return this;
        }

        expand() {
            if (this._isExpanded) return this;
            this._isExpanded = true;
            this.setAttribute('expanded', '');
            this._dispatchEvent('expand');
            this._log('info', `Expanded: ${this._config.title}`);
            return this;
        }

        collapse() {
            if (!this._isExpanded) return this;
            this._isExpanded = false;
            this.removeAttribute('expanded');
            this._dispatchEvent('collapse');
            this._log('info', `Collapsed: ${this._config.title}`);
            return this;
        }

        _dispatchEvent(name) {
            this.dispatchEvent(new CustomEvent(`section-${name}`, {
                detail: { id: this._config.id, title: this._config.title },
                bubbles: true,
                composed: true
            }));
        }

        // --- Chainable Setters ---

        setDebug(enabled) {
            this._config.debug = !!enabled;
            this._log('info', `Debug mode: ${this._config.debug}`);
            return this;
        }

        _log(level, msg) {
            if (this._config.debug) {
                console[level](`[CollapsibleSection] ${msg}`);
            }
        }
    }

    // Register Custom Element
    if (!customElements.get('collapsible-section')) {
        customElements.define('collapsible-section', CollapsibleSection);
    }

    // --- Global Hash Control ---
    const handleHashChange = () => {
        const hash = window.location.hash.substring(1);
        if (!hash) return;

        // Find the target element in Light DOM
        const target = document.getElementById(hash);
        if (target) {
            const section = target.closest('collapsible-section');
            if (section) {
                if (section._config.debug) console.log(`[CollapsibleSection] Auto-expanding for hash: #${hash}`);
                section.expand();
            }
        }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('DOMContentLoaded', handleHashChange);
    // Extra check for dynamic content or slow loads
    window.addEventListener('load', () => setTimeout(handleHashChange, 500));

    global.CollapsibleSection = CollapsibleSection;

})(window);
