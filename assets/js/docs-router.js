/**
 * Docs Seamless Router (V1.1)
 * Provides SPA-like navigation for documentation series without full page reloads.
 * V1.1: Robustness against concurrent clicks and recursive initializations.
 */
(function (global) {
    'use strict';

    class DocsRouter {
        constructor() {
            this._seriesComponent = null;
            this._tocComponent = null;
            this._currentId = '';
            this._isTransitioning = false;
            this._isInitialized = false;
            this._abortController = null;
        }

        /**
         * Initialize the router and bind components
         * @param {Object} components { series, toc }
         */
        init({ series, toc }) {
            this._seriesComponent = series;
            this._tocComponent = toc;

            if (this._isInitialized) {
                console.log('[DocsRouter] Already initialized, components updated.');
                return this;
            }

            this._currentId = document.body.dataset.articleId;

            // 1. Intercept Sidebar Clicks
            if (this._seriesComponent) {
                this._seriesComponent.setOnNavigate(({ href, id }) => {
                    this.navigate(href, id);
                });
            }

            // 2. Handle Browser Back/Forward
            window.addEventListener('popstate', this._handlePopState.bind(this));

            // Initial State
            if (!window.history.state) {
                window.history.replaceState({ id: this._currentId }, '', window.location.href);
            }

            this._isInitialized = true;
            console.log('[DocsRouter] Initialized for:', this._currentId);
            return this;
        }

        /**
         * Main navigation logic
         * @param {string} url 
         * @param {string} id 
         * @param {boolean} pushHistory 
         */
        async navigate(url, id, pushHistory = true) {
            if (id === this._currentId) return;

            // Abort previous transition if any
            if (this._abortController) {
                this._abortController.abort();
            }
            this._abortController = new AbortController();
            const signal = this._abortController.signal;

            this._isTransitioning = true;
            const currentUrl = window.location.href;
            console.log('[DocsRouter] Navigating from', currentUrl, 'to', url);
            this._showProgress(30);

            try {
                // 1. Fetch content
                const response = await fetch(url, { signal });
                if (!response.ok) throw new Error('Fetch failed');
                const html = await response.text();
                
                // 2. Parse content
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                const newArticle = doc.querySelector('.article-body');
                if (!newArticle) throw new Error('Invalid target page: .article-body not found');

                this._showProgress(70);

                // 3. Swap Content with Animation
                const currentArticle = document.querySelector('.article-body');
                if (currentArticle) {
                    currentArticle.style.opacity = '0';
                    currentArticle.style.transform = 'translateY(10px)';
                    currentArticle.style.transition = 'all 0.3s ease';

                    setTimeout(() => {
                        if (signal.aborted) return;

                        // Update Title & Meta
                        document.title = doc.title;
                        
                        // Fix Relative Paths in the new content
                        const processedHtml = this._fixRelativePaths(newArticle.innerHTML, url);
                        
                        // Update main content
                        currentArticle.innerHTML = processedHtml;
                        
                        // Reset opacity & transform
                        currentArticle.style.opacity = '1';
                        currentArticle.style.transform = 'translateY(0)';
                        
                        // Reset Scroll
                        window.scrollTo({ top: 0, behavior: 'smooth' });

                        // 4. Sync State
                        this._currentId = id;
                        document.body.dataset.articleId = id;
                        
                        if (pushHistory) {
                            window.history.pushState({ id }, '', url);
                        }

                        // 5. Refresh Components
                        if (this._seriesComponent) {
                            this._seriesComponent.updateActiveItem(id);
                        }
                        
                        if (this._tocComponent) {
                            // Ensure the DOM has fully reflowed before scanning headings
                            requestAnimationFrame(() => {
                                setTimeout(() => {
                                    if (signal.aborted) return;
                                    console.log('[DocsRouter] Re-initializing TOC...');
                                    this._tocComponent.init();
                                }, 100);
                            });
                        }
                        
                        this._showProgress(100);
                    }, 350);
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('[DocsRouter] Navigation aborted:', url);
                } else {
                    console.error('[DocsRouter] Navigation failed:', error);
                    if (pushHistory) window.location.href = url;
                }
            } finally {
                // Not ideal but works for basic debounce
                setTimeout(() => { this._isTransitioning = false; }, 300);
            }
        }

        /**
         * Resolves relative paths in HTML content based on the target page's location.
         * @private
         */
        _fixRelativePaths(html, targetUrl) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            return tempDiv.innerHTML;
        }

        _handlePopState(e) {
            if (e.state && e.state.id) {
                this.navigate(window.location.href, e.state.id, false);
            } else {
                window.location.reload();
            }
        }

        _showProgress(percent) {
            const bar = document.getElementById('scroll-progress-bar');
            if (bar) {
                bar.style.transition = 'width 0.3s ease-out';
                bar.style.width = percent + '%';
                if (percent >= 100) {
                    setTimeout(() => {
                        bar.style.width = '0%';
                        bar.style.transition = 'none';
                    }, 500);
                }
            }
        }
    }

    // Export to global scope
    global.DocsRouter = new DocsRouter();

})(window);
