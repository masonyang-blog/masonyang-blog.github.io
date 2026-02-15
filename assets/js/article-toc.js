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
            ul.className = 'space-y-2 border-l-2 border-slate-100 pl-4';

            this.headings.forEach(h => {
                const li = document.createElement('li');
                const a = document.createElement('a');

                a.href = `#${h.id}`;
                a.textContent = h.text;
                a.className = `block text-sm text-slate-500 hover:text-slate-900 transition-colors duration-200 py-1 ${h.level === 'h3' ? 'pl-4 text-xs' : ''}`;
                a.dataset.targetId = h.id;

                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById(h.id).scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
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
                rootMargin: '-100px 0px -66% 0px',
                threshold: 0
            };

            this.observer = new IntersectionObserver((entries) => {
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
