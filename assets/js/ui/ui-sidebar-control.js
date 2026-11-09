/**
 * Sidebar Control Component
 * @description Handles the collapsing/expanding of the TOC sidebar and layout expansion for immersive reading.
 */
(function (global) {
    "use strict";

    class SidebarControl {
        constructor() {
            this._config = {
                sidebarSelector: '#sidebar-container',
                mainContentSelector: '#main-content-area',
                collapsedClass: 'sidebar-collapsed',
                storageKey: 'masonyang_sidebar_state',
                debug: false
            };

            this._isCollapsed = localStorage.getItem(this._config.storageKey) === 'true';
        }

        /**
         * Chainable setter for sidebar selector
         */
        setSidebarSelector(selector) {
            this._config.sidebarSelector = selector;
            return this;
        }

        /**
         * Chainable setter for main content selector
         */
        setMainContentSelector(selector) {
            this._config.mainContentSelector = selector;
            return this;
        }

        /**
         * Chainable setter for debug mode
         */
        setDebug(enabled) {
            this._config.debug = !!enabled;
            return this;
        }

        init() {
            const sidebar = document.querySelector(this._config.sidebarSelector);
            if (!sidebar) {
                this._log('warn', `Sidebar not found: ${this._config.sidebarSelector}`);
                return this;
            }

            this._injectToggleButton(sidebar);
            this._applyInitialState();
            return this;
        }

        _injectToggleButton(sidebar) {
            // Check if button already exists
            if (sidebar.querySelector('.sidebar-toggle-btn')) return;

            const btn = document.createElement('button');
            btn.className = 'sidebar-toggle-btn';
            btn.setAttribute('aria-label', '切換側邊欄');
            btn.innerHTML = `
                <svg class="toggle-icon-sidebar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                    <path d="M11 19l-7-7 7-7M20 12H4" />
                </svg>
                <span class="btn-text">收起目錄</span>
            `;

            this._injectStyles();

            btn.addEventListener('click', () => this.toggle());
            sidebar.prepend(btn);
            this._toggleBtn = btn;
        }

        _injectStyles() {
            if (document.getElementById('sidebar-control-styles')) return;
            const style = document.createElement('style');
            style.id = 'sidebar-control-styles';
            style.textContent = `
                .sidebar-toggle-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    width: 100%;
                    padding: 0.625rem 0.875rem;
                    margin-bottom: 1.5rem;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.75rem;
                    color: #64748b;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .sidebar-toggle-btn:hover {
                    background: #f1f5f9;
                    color: #334155;
                    border-color: #cbd5e1;
                }
                .sidebar-toggle-btn .toggle-icon-sidebar {
                    transition: transform 0.3s ease;
                }
                
                html.dark .sidebar-toggle-btn {
                    background: #1e293b;
                    border-color: #334155;
                    color: #94a3b8;
                }
                html.dark .sidebar-toggle-btn:hover {
                    background: #334155;
                    color: #f1f5f9;
                }

                /* Sidebar Transition */
                #sidebar-container {
                    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin 0.3s ease, opacity 0.2s ease;
                }

                .sidebar-collapsed #sidebar-container {
                    width: 0 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    opacity: 0;
                    pointer-events: none;
                    overflow: hidden;
                }

                /* Floating Trigger */
                .sidebar-expand-trigger {
                    position: fixed;
                    left: 1.5rem;
                    top: 50%;
                    transform: translateY(-50%) translateX(-100px);
                    width: 42px;
                    height: 42px;
                    background: #3b82f6;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                    cursor: pointer;
                    z-index: 100;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    opacity: 0;
                }
                .sidebar-collapsed .sidebar-expand-trigger {
                    transform: translateY(-50%) translateX(0);
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }

        toggle() {
            this._isCollapsed = !this._isCollapsed;
            this._applyState();
            localStorage.setItem(this._config.storageKey, this._isCollapsed);
        }

        _applyInitialState() {
            if (this._isCollapsed) {
                this._applyState();
            }
        }

        _applyState() {
            const body = document.body;
            if (this._isCollapsed) {
                body.classList.add(this._config.collapsedClass);
                this._createFloatingTrigger();
                this._log('info', 'Sidebar collapsed');
            } else {
                body.classList.remove(this._config.collapsedClass);
                this._removeFloatingTrigger();
                this._log('info', 'Sidebar expanded');
            }
            
            this._updateButtonUI();
        }

        _createFloatingTrigger() {
            if (document.querySelector('.sidebar-expand-trigger')) return;
            const trigger = document.createElement('div');
            trigger.className = 'sidebar-expand-trigger';
            trigger.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M13 5l7 7-7 7M4 12h16" />
                </svg>
            `;
            trigger.addEventListener('click', () => this.toggle());
            document.body.appendChild(trigger);
        }

        _removeFloatingTrigger() {
            const trigger = document.querySelector('.sidebar-expand-trigger');
            if (trigger) trigger.remove();
        }

        _updateButtonUI() {
            if (!this._toggleBtn) return;
            const text = this._toggleBtn.querySelector('.btn-text');
            const icon = this._toggleBtn.querySelector('.toggle-icon-sidebar');
            if (!this._isCollapsed) {
                text.textContent = '收起目錄';
                icon.style.transform = 'rotate(0deg)';
            }
        }

        _log(level, msg) {
            if (this._config.debug) console[level](`[SidebarControl] ${msg}`);
        }
    }

    global.SidebarControl = SidebarControl;

})(window);
