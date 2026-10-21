/**
 * Guide Table of Contents Controller (Hierarchical Accordion & ScrollSpy)
 * Exclusively designed for multi-part flagship omnibus guides.
 * Follows Zero-Build and standard CSS tokens.
 */
(function (global) {
    "use strict";

    class GuideTocController {
        constructor(navSelector = '.guide-toc-nav') {
            this.nav = document.querySelector(navSelector);
            this.groups = [];
            this.allSubLinks = [];
            this.isUserClicking = false;
            this.clickTimeout = null;
            this.observer = null;
        }

        init() {
            if (!this.nav) {
                this.nav = document.querySelector('.guide-toc-nav');
            }
            if (!this.nav) return this;

            this._injectStyles();
            this.groups = Array.from(this.nav.querySelectorAll('.toc-chapter-group'));
            this.allSubLinks = Array.from(this.nav.querySelectorAll('.toc-sub-link'));

            this.bindEvents();
            this.setupScrollSpy();
            return this;
        }

        _injectStyles() {
            if (document.getElementById('guide-toc-styles')) return;
            const style = document.createElement('style');
            style.id = 'guide-toc-styles';
            style.textContent = `
                .guide-toc-nav .toc-chapter-group.is-active > .toc-chapter-header {
                    background-color: rgba(59, 130, 246, 0.06);
                }
                .guide-toc-nav .toc-chapter-group.is-active > .toc-chapter-header .toc-badge {
                    background-color: #3b82f6;
                    color: #ffffff;
                    border-color: #3b82f6;
                }
                html.dark .guide-toc-nav .toc-chapter-group.is-active > .toc-chapter-header {
                    background-color: rgba(59, 130, 246, 0.12);
                }
                html.dark .guide-toc-nav .toc-chapter-group.is-active > .toc-chapter-header .toc-badge {
                    background-color: #2563eb;
                    color: #ffffff;
                    border-color: #3b82f6;
                }
                .guide-toc-nav .toc-sub-link {
                    border-left: 2px solid transparent;
                    transition: all 0.15s ease-in-out;
                }
                .guide-toc-nav .toc-sub-link:hover {
                    color: #2563eb;
                    background-color: rgba(59, 130, 246, 0.04);
                }
                html.dark .guide-toc-nav .toc-sub-link:hover {
                    color: #93c5fd;
                    background-color: rgba(59, 130, 246, 0.08);
                }
                .guide-toc-nav .toc-sub-link.is-active {
                    color: #2563eb !important;
                    font-weight: 600 !important;
                    background-color: rgba(59, 130, 246, 0.08) !important;
                    border-left: 2px solid #3b82f6 !important;
                    padding-left: 0.625rem !important;
                }
                html.dark .guide-toc-nav .toc-sub-link.is-active {
                    color: #60a5fa !important;
                    font-weight: 600 !important;
                    background-color: rgba(59, 130, 246, 0.15) !important;
                    border-left: 2px solid #60a5fa !important;
                    padding-left: 0.625rem !important;
                }
            `;
            document.head.appendChild(style);
        }

        toggleGroup(group, forceOpen) {
            if (!group) return;
            const btn = group.querySelector('.toc-chapter-header');
            const sublist = group.querySelector('.toc-sublist');
            const chevron = group.querySelector('.toc-chevron');
            const isOpen = sublist && !sublist.classList.contains('hidden');
            const shouldOpen = (forceOpen !== undefined) ? forceOpen : !isOpen;

            if (shouldOpen) {
                // Collapse all other groups (Single-accordion mode for pristine readability)
                this.groups.forEach(g => {
                    if (g !== group) {
                        const gList = g.querySelector('.toc-sublist');
                        const gChevron = g.querySelector('.toc-chevron');
                        const gBtn = g.querySelector('.toc-chapter-header');
                        if (gList) gList.classList.add('hidden');
                        if (gChevron) gChevron.classList.remove('rotate-180');
                        if (gBtn) {
                            gBtn.setAttribute('aria-expanded', 'false');
                            gBtn.classList.remove('text-blue-600', 'dark:text-blue-400', 'font-bold');
                        }
                        g.classList.remove('is-active');
                    }
                });

                if (sublist) sublist.classList.remove('hidden');
                if (chevron) chevron.classList.add('rotate-180');
                if (btn) {
                    btn.setAttribute('aria-expanded', 'true');
                    btn.classList.add('text-blue-600', 'dark:text-blue-400', 'font-bold');
                }
                group.classList.add('is-active');
            } else {
                if (sublist) sublist.classList.add('hidden');
                if (chevron) chevron.classList.remove('rotate-180');
                if (btn) {
                    btn.setAttribute('aria-expanded', 'false');
                    btn.classList.remove('text-blue-600', 'dark:text-blue-400', 'font-bold');
                }
                group.classList.remove('is-active');
            }
        }

        setActiveLink(activeLink) {
            this.allSubLinks.forEach(l => {
                l.classList.remove('is-active');
            });
            if (activeLink) {
                activeLink.classList.add('is-active');
                // Keep active element in visible viewport of TOC sidebar
                activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }

        bindEvents() {
            // 1. Chapter Header Clicks
            this.groups.forEach(group => {
                const btn = group.querySelector('.toc-chapter-header');
                if (!btn) return;
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = btn.dataset.target;
                    this.toggleGroup(group);

                    if (targetId) {
                        const targetEl = document.getElementById(targetId);
                        if (targetEl) {
                            this.isUserClicking = true;
                            clearTimeout(this.clickTimeout);
                            const topOffset = targetEl.getBoundingClientRect().top + window.pageYOffset - 85;
                            window.scrollTo({ top: topOffset, behavior: 'smooth' });
                            this.clickTimeout = setTimeout(() => { this.isUserClicking = false; }, 800);
                            history.pushState(null, null, `#${targetId}`);
                        }
                    }
                });
            });

            // 2. Sub-link Clicks
            this.allSubLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const anchorId = link.dataset.anchor || (link.getAttribute('href') ? link.getAttribute('href').slice(1) : null);
                    if (!anchorId) return;

                    const targetEl = document.getElementById(anchorId);
                    if (targetEl) {
                        this.isUserClicking = true;
                        clearTimeout(this.clickTimeout);

                        const parentGroup = link.closest('.toc-chapter-group');
                        if (parentGroup) this.toggleGroup(parentGroup, true);

                        this.setActiveLink(link);

                        const topOffset = targetEl.getBoundingClientRect().top + window.pageYOffset - 85;
                        window.scrollTo({ top: topOffset, behavior: 'smooth' });
                        this.clickTimeout = setTimeout(() => { this.isUserClicking = false; }, 800);
                        history.pushState(null, null, `#${anchorId}`);
                    }
                });
            });
        }

        setupScrollSpy() {
            if (this.observer) this.observer.disconnect();

            const targetMap = new Map();
            this.groups.forEach(g => {
                const tid = g.dataset.chapter;
                const el = document.getElementById(tid);
                if (el) targetMap.set(el, { type: 'chapter', group: g });
            });
            this.allSubLinks.forEach(l => {
                const aid = l.dataset.anchor;
                const el = document.getElementById(aid);
                if (el) targetMap.set(el, { type: 'sub', link: l });
            });

            const elements = Array.from(targetMap.keys());
            if (elements.length === 0) return;

            this.observer = new IntersectionObserver((entries) => {
                if (this.isUserClicking) return;

                const visible = entries.filter(e => e.isIntersecting);
                if (visible.length === 0) return;

                // Sort by distance to top of viewport
                visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                const activeEl = visible[0].target;
                const meta = targetMap.get(activeEl);

                if (meta) {
                    if (meta.type === 'sub') {
                        const parentGroup = meta.link.closest('.toc-chapter-group');
                        if (parentGroup) this.toggleGroup(parentGroup, true);
                        this.setActiveLink(meta.link);
                    } else if (meta.type === 'chapter') {
                        this.toggleGroup(meta.group, true);
                    }
                }
            }, {
                root: null,
                rootMargin: '-10% 0px -70% 0px',
                threshold: 0
            });

            elements.forEach(el => this.observer.observe(el));
        }
    }

    global.GuideTocController = GuideTocController;

})(window);
