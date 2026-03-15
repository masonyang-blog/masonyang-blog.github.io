/**
 * Article TOC Utilities (Light DOM Version)
 * Replaces the complex Shadow DOM component with a simple, direct DOM manipulation script.
 */
(function (global) {
    "use strict";

    class ArticleTOC {
        constructor() {
            this.tocHost = document.getElementById('toc-desktop-host');
            // Fallback to .prose if specific class not found
            this.contentArea = document.querySelector('.article-body-content') || document.querySelector('.prose');
            this.headings = [];
            this.observer = null;
            this._ignoreScrollSpy = false;
            this._scrollSpyTimeout = null;
        }

        init() {
            console.log('[ArticleTOC] Init started');
            if (!this.tocHost) {
                console.warn('[ArticleTOC] Missing host: #toc-desktop-host');
                return;
            }
            if (!this.contentArea) {
                console.warn('[ArticleTOC] Missing content area: .article-body-content or .prose');
                return;
            }

            console.log('[ArticleTOC] Host and Content found');

            // 1. Collect Headings
            this.headings = Array.from(this.contentArea.querySelectorAll('h2, h3')).map((el, index) => {
                if (!el.id) el.id = `section-${index}`;
                return {
                    id: el.id,
                    text: el.innerText,
                    level: el.tagName.toLowerCase(),
                    element: el
                };
            });

            console.log(`[ArticleTOC] Found ${this.headings.length} headings`);

            if (this.headings.length === 0) return;

            // 2. Render HTML
            this.render();

            // 3. Setup Scroll Spy
            this.setupScrollSpy();
        }

        render() {
            const ul = document.createElement('ul');
            ul.className = 'border-l-2 border-slate-100 pl-3';

            let lastWasH2 = false;
            this.headings.forEach((h, index) => {
                const li = document.createElement('li');
                const a = document.createElement('a');

                a.href = `#${h.id}`;
                a.textContent = h.text;
                a.dataset.targetId = h.id;

                if (h.level === 'h2') {
                    // H2: 主要章節，有足夠的上下間距
                    li.className = index > 0 ? 'mt-4' : '';
                    a.className = 'block text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 py-1 leading-snug';
                    lastWasH2 = true;
                } else {
                    // H3: 子章節，縮排且字體更小
                    li.className = 'ml-3';
                    a.className = 'block text-xs text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200 py-0.5 leading-snug';
                    lastWasH2 = false;
                }

                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // 立即更新高亮，並暫時屏蔽 ScrollSpy
                    this.setActive(h.id);
                    this._ignoreScrollSpy = true;
                    if (this._scrollSpyTimeout) clearTimeout(this._scrollSpyTimeout);
                    this._scrollSpyTimeout = setTimeout(() => {
                        this._ignoreScrollSpy = false;
                    }, 1000);

                    const target = document.getElementById(h.id);
                    if (!target) return;
                    // 手動計算 offsetTop，確保 sticky header 的高度被扣除
                    const headerOffset = 80; // 固定 Header 高度 (px)
                    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: targetTop, behavior: 'smooth' });
                });

                li.appendChild(a);
                ul.appendChild(li);
            });

            this.tocHost.innerHTML = '';
            this.tocHost.appendChild(ul);
        }

        setupScrollSpy() {
            const options = {
                root: null,
                // 頂部排除 80px (Header 高度)，底部僅排除 40%，
                // 留出足夠空間讓 H2 在進入視窗後能被正確偵測，不會立即被 H3 搶走高亮
                rootMargin: '-80px 0px -40% 0px',
                threshold: 0
            };

            this.observer = new IntersectionObserver((entries) => {
                if (this._ignoreScrollSpy) return;
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.setActive(entry.target.id);
                    }
                });
            }, options);

            this.headings.forEach(h => this.observer.observe(h.element));
        }

        setActive(id) {
            // Remove active class from all
            const allLinks = this.tocHost.querySelectorAll('a');
            allLinks.forEach(a => {
                a.classList.remove('text-blue-600', 'font-bold', 'border-l-2', '-ml-[18px]', 'border-blue-600', 'pl-[14px]');
                a.classList.add('text-slate-500');
            });

            // Add to current
            const activeLink = this.tocHost.querySelector(`a[data-target-id="${id}"]`);
            if (activeLink) {
                activeLink.classList.remove('text-slate-500');
                // Simple active style
                activeLink.classList.add('text-blue-600', 'font-bold');

                // Optional: visual marker on the border
                // We are rendering inside a parent UL with border, so maybe just text color is enough.
                // Or we can add a transform.
            }
        }
    }

    global.ArticleTOC = ArticleTOC;

})(window);
