/**
 * UI Section Wrapper Component (Mason Yang Blog)
 * Automatically wraps h2 sections in #main-content-area into section cards
 * to match H1 hero header design without color discrepancy.
 */
(function () {
    "use strict";

    function wrapArticleSections() {
        const mainArea = document.getElementById('main-content-area');
        if (!mainArea || mainArea.dataset.sectionWrapped === 'true') return;
        mainArea.dataset.sectionWrapped = 'true';

        // 1. Ensure parent article body does not cause double-background or color discrepancies
        const parentArticle = mainArea.closest('article');
        if (parentArticle) {
            parentArticle.classList.remove('theme-bg-card', 'dark:bg-slate-800', 'shadow-sm', 'border', 'border-slate-100', 'dark:border-slate-700', 'p-6', 'md:p-10');
            parentArticle.classList.add('bg-transparent', 'border-0', 'p-0', 'shadow-none');
        }

        // 2. Wrap each H2 and its siblings into a unified card section
        const children = Array.from(mainArea.children);
        let currentSection = null;

        children.forEach(child => {
            if (child.tagName === 'H2') {
                currentSection = document.createElement('section');
                currentSection.className = 'article-section theme-bg-card dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-10 mb-6 font-sans';
                
                if (child.id) {
                    currentSection.id = child.id; // Maintain TOC anchor compatibility
                }

                // Refine H2 header spacing inside section card
                child.classList.add('!mt-0', '!mb-6', 'pb-4', 'border-b', 'border-slate-100', 'dark:border-slate-800');

                mainArea.insertBefore(currentSection, child);
                currentSection.appendChild(child);
            } else if (currentSection) {
                currentSection.appendChild(child);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wrapArticleSections);
    } else {
        wrapArticleSections();
    }
})();
