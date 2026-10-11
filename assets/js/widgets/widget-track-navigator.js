/**
 * Topic Track Series Navigator Component (V1.2 - Rock Solid Theme & Sidebar Adaptive)
 * 專題賽道連載導航器 (Zero-Build & Shadow DOM Encapsulated)
 * 
 * Features:
 * - 專門適配右側邊欄 (Sidebar) 與文章內頁。
 * - 支援 DOM 狀態感知與主動 class.dark 雙軌渲染，徹底杜絕 :host-context 相容性問題。
 * - 自動感知當前文章所屬 trackId 並動態渲染同賽道文章。
 * - 支援上一篇 (Previous)、下一篇 (Next) 雙向快速導航。
 * - 支援可收合式「專題全篇章目錄 (Track Index)」。
 * - Shadow DOM Closed Mode，極致樣式隔離，零全域污染。
 */
(function (global) {
    'use strict';

    class TrackNavigatorComponent {
        constructor() {
            this._containerId = 'track-navigator-container';
            this._currentArticleId = document.body ? document.body.dataset.articleId : '';
            this._hostElement = null;
            this._shadowRoot = null;
            this._debug = false;
        }

        setContainerId(id) {
            this._containerId = id;
            return this;
        }

        setCurrentArticleId(id) {
            this._currentArticleId = id;
            return this;
        }

        setDebug(enabled) {
            this._debug = enabled;
            return this;
        }

        _log(...args) {
            if (this._debug) console.log('[TrackNavigatorComponent]', ...args);
        }

        _resolvePath(link) {
            let pathPrefix = '../';
            if (typeof window !== 'undefined' && window.location) {
                const parts = window.location.pathname.split('/').filter(Boolean);
                if (parts.length <= 1) {
                    pathPrefix = './';
                }
            }
            return `${pathPrefix}${link}`;
        }

        init() {
            this._hostElement = document.getElementById(this._containerId);
            if (!this._hostElement) {
                this._log(`Host container #${this._containerId} not found.`);
                return this;
            }

            const allArticles = (global.ArticleRepository && global.ArticleRepository.all) ? global.ArticleRepository.all : [];
            if (!allArticles || allArticles.length === 0) {
                this._log('No articles found in repository.');
                return this;
            }

            const currentId = this._currentArticleId || (document.body ? document.body.dataset.articleId : '') || '';
            
            // 尋找當前文章 (支援精準 id、前綴匹配、或是由 URL 檔名模糊反查)
            let currentArticle = allArticles.find(a => 
                a.id === currentId || 
                a.id === currentId.replace('news-', '') || 
                a.id === `news-${currentId}` ||
                (a.link && a.link.includes(currentId))
            );

            if (!currentArticle && typeof window !== 'undefined' && window.location) {
                const currentFileName = window.location.pathname.split('/').pop().replace('.html', '');
                currentArticle = allArticles.find(a => a.link && a.link.includes(currentFileName));
            }

            if (!currentArticle || !currentArticle.trackId) {
                this._log('Article has no trackId assigned. Hiding parent card.');
                const parentCard = this._hostElement.closest('.theme-bg-card');
                if (parentCard) parentCard.style.display = 'none';
                this._hostElement.style.display = 'none';
                return this;
            }

            // 篩選同賽道文章並排序
            const trackArticles = allArticles
                .filter(a => a.trackId === currentArticle.trackId)
                .sort((a, b) => (a.trackOrder || 0) - (b.trackOrder || 0));

            if (trackArticles.length <= 1) {
                this._log('Track has only 1 article, hiding parent card.');
                const parentCard = this._hostElement.closest('.theme-bg-card');
                if (parentCard) parentCard.style.display = 'none';
                this._hostElement.style.display = 'none';
                return this;
            }

            const currentIndex = trackArticles.findIndex(a => a.id === currentArticle.id);
            const prevArticle = currentIndex > 0 ? trackArticles[currentIndex - 1] : null;
            const nextArticle = currentIndex < trackArticles.length - 1 ? trackArticles[currentIndex + 1] : null;

            // 建立 Shadow DOM (Closed Mode 樣式隔離)
            if (!this._shadowRoot) {
                try {
                    this._shadowRoot = this._hostElement.attachShadow({ mode: 'closed' });
                } catch (e) {
                    this._shadowRoot = this._hostElement;
                }
            }

            if (!this._shadowRoot) {
                this._log('Failed to obtain shadow root.');
                return this;
            }

            this._render({
                trackName: currentArticle.trackName || '專題研究賽道',
                totalCount: trackArticles.length,
                currentIndex: currentIndex >= 0 ? currentIndex : 0,
                currentArticle,
                prevArticle,
                nextArticle,
                trackArticles
            });

            return this;
        }

        _render(data) {
            const isDark = (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
            const progressPct = Math.round(((data.currentIndex + 1) / data.totalCount) * 100);

            const cleanTitle = (t) => {
                if (!t) return '';
                return t.replace(/^【.*?】\s*-\s*/, '').replace(/^正在導向至.*?-\s*/, '').replace(/（.*?）/g, '');
            };

            // Prev Button HTML
            const prevHtml = data.prevArticle ? `
                <a href="${this._resolvePath(data.prevArticle.link)}" class="nav-btn">
                    <div class="nav-direction">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        上一篇研報
                    </div>
                    <div class="nav-title">${cleanTitle(data.prevArticle.title)}</div>
                </a>
            ` : `
                <div class="nav-btn nav-disabled">
                    <div class="nav-direction">上一篇研報</div>
                    <div class="nav-title">已是專題第一篇</div>
                </div>
            `;

            // Next Button HTML
            const nextHtml = data.nextArticle ? `
                <a href="${this._resolvePath(data.nextArticle.link)}" class="nav-btn">
                    <div class="nav-direction">
                        下一篇研報
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                    <div class="nav-title">${cleanTitle(data.nextArticle.title)}</div>
                </a>
            ` : `
                <div class="nav-btn nav-disabled">
                    <div class="nav-direction">下一篇研報</div>
                    <div class="nav-title">已是專題最新篇</div>
                </div>
            `;

            // Full List Items HTML
            const listItemsHtml = data.trackArticles.map((art, idx) => {
                const isActive = art.id === data.currentArticle.id;
                return `
                    <a href="${this._resolvePath(art.link)}" class="list-item ${isActive ? 'active' : ''}">
                        <span class="order-num">${art.trackOrder || idx + 1}</span>
                        <span class="item-title">${cleanTitle(art.title)}</span>
                    </a>
                `;
            }).join('');

            const styles = `
                :host {
                    display: block;
                    width: 100%;
                    box-sizing: border-box;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif;
                }
                * {
                    box-sizing: border-box;
                }
                .track-sidebar-body {
                    padding: 0.875rem 1rem 1rem 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .track-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .track-name-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.5rem;
                }
                .track-name {
                    font-size: 0.8125rem;
                    font-weight: 700;
                    color: #1e293b;
                    line-height: 1.35;
                }
                .dark .track-name {
                    color: #f1f5f9 !important;
                }
                .track-progress {
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: #2563eb;
                    background: rgba(59, 130, 246, 0.08);
                    padding: 0.15rem 0.45rem;
                    border-radius: 9999px;
                    white-space: nowrap;
                    border: 1px solid rgba(59, 130, 246, 0.2);
                }
                .dark .track-progress {
                    color: #60a5fa !important;
                    background: rgba(59, 130, 246, 0.18) !important;
                    border-color: rgba(96, 165, 250, 0.3) !important;
                }
                .progress-bar-bg {
                    width: 100%;
                    height: 3px;
                    background: #e2e8f0;
                    border-radius: 9999px;
                    overflow: hidden;
                    margin-top: 0.2rem;
                }
                .dark .progress-bar-bg {
                    background: #334155 !important;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #3b82f6, #60a5fa);
                    border-radius: 9999px;
                    transition: width 0.3s ease;
                }
                .nav-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .nav-btn {
                    display: flex;
                    flex-direction: column;
                    gap: 0.2rem;
                    padding: 0.625rem 0.75rem;
                    border-radius: 0.5rem;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    text-decoration: none;
                    color: inherit;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .dark .nav-btn {
                    background: rgba(15, 23, 42, 0.6) !important;
                    border-color: #334155 !important;
                }
                .nav-btn:hover {
                    border-color: #3b82f6;
                    background: #f8fafc;
                    transform: translateY(-1px);
                }
                .dark .nav-btn:hover {
                    border-color: #60a5fa !important;
                    background: rgba(30, 41, 59, 0.9) !important;
                }
                .nav-direction {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.6875rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    color: #2563eb;
                }
                .dark .nav-direction {
                    color: #60a5fa !important;
                }
                .nav-title {
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #334155;
                    line-height: 1.35;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .dark .nav-title {
                    color: #cbd5e1 !important;
                }
                .nav-disabled {
                    opacity: 0.45;
                    pointer-events: none;
                    background: transparent;
                    border: 1px dashed #cbd5e1;
                }
                .dark .nav-disabled {
                    border-color: #475569 !important;
                }
                .drawer-toggle {
                    width: 100%;
                    padding: 0.45rem 0.5rem;
                    background: transparent;
                    border: 1px dashed rgba(203, 213, 225, 0.8);
                    border-radius: 0.375rem;
                    color: #64748b;
                    font-size: 0.71875rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.35rem;
                    transition: all 0.2s ease;
                }
                .dark .drawer-toggle {
                    border-color: rgba(71, 85, 105, 0.8) !important;
                    color: #94a3b8 !important;
                }
                .drawer-toggle:hover {
                    background: #f1f5f9;
                    color: #0f172a;
                    border-color: #94a3b8;
                }
                .dark .drawer-toggle:hover {
                    background: rgba(30, 41, 59, 0.8) !important;
                    color: #f8fafc !important;
                    border-color: #64748b !important;
                }
                .track-list {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    display: none;
                    flex-direction: column;
                    gap: 0.35rem;
                    max-height: 220px;
                    overflow-y: auto;
                }
                .track-list.open {
                    display: flex;
                }
                .list-item {
                    display: flex;
                    align-items: center;
                    gap: 0.45rem;
                    padding: 0.4rem 0.5rem;
                    border-radius: 0.375rem;
                    font-size: 0.71875rem;
                    text-decoration: none;
                    color: #475569;
                    line-height: 1.3;
                    transition: all 0.15s ease;
                }
                .dark .list-item {
                    color: #94a3b8 !important;
                }
                .list-item:hover {
                    background: #f1f5f9;
                    color: #0f172a;
                }
                .dark .list-item:hover {
                    background: rgba(51, 65, 85, 0.6) !important;
                    color: #ffffff !important;
                }
                .list-item.active {
                    background: rgba(59, 130, 246, 0.1);
                    color: #2563eb;
                    font-weight: 600;
                    border-left: 2px solid #3b82f6;
                }
                .dark .list-item.active {
                    background: rgba(59, 130, 246, 0.2) !important;
                    color: #60a5fa !important;
                    border-left-color: #60a5fa !important;
                }
                .order-num {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.15rem;
                    height: 1.15rem;
                    border-radius: 9999px;
                    background: #e2e8f0;
                    color: #475569;
                    font-size: 0.65rem;
                    font-weight: 700;
                    flex-shrink: 0;
                }
                .dark .order-num {
                    background: #334155 !important;
                    color: #cbd5e1 !important;
                }
                .list-item.active .order-num {
                    background: #3b82f6 !important;
                    color: #ffffff !important;
                }
                .item-title {
                    flex: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            `;

            this._shadowRoot.innerHTML = `
                <style>${styles}</style>
                <div class="track-sidebar-body ${isDark ? 'dark' : ''}">
                    <div class="track-meta">
                        <div class="track-name-row">
                            <span class="track-name">${data.trackName}</span>
                            <span class="track-progress">${data.currentIndex + 1} / ${data.totalCount}</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${progressPct}%;"></div>
                        </div>
                    </div>

                    <div class="nav-buttons">
                        ${prevHtml}
                        ${nextHtml}
                    </div>

                    <button class="drawer-toggle" id="drawer-toggle-btn" type="button">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                        展開專題目錄 (${data.totalCount} 篇)
                    </button>

                    <div class="track-list" id="track-list-drawer">
                        ${listItemsHtml}
                    </div>
                </div>
            `;

            // 抽屜展開邏輯
            const toggleBtn = this._shadowRoot.getElementById('drawer-toggle-btn');
            const drawer = this._shadowRoot.getElementById('track-list-drawer');
            if (toggleBtn && drawer) {
                toggleBtn.addEventListener('click', () => {
                    const isOpen = drawer.classList.toggle('open');
                    toggleBtn.innerHTML = isOpen ? `
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>
                        收合專題目錄
                    ` : `
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                        展開專題目錄 (${data.totalCount} 篇)
                    `;
                });
            }
        }
    }

    global.TrackNavigatorComponent = TrackNavigatorComponent;
})(typeof window !== 'undefined' ? window : this);
