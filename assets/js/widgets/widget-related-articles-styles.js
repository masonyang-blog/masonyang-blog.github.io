/**
 * Related Articles Widget - Shadow DOM Style Module
 * @class RelatedArticlesStyles
 * @description Encapsulates all Shadow DOM CSS styles and badge color definitions for
 * both Grid (cards) and List (minimal) layouts, including Dark Mode support.
 */
(function (global) {
    "use strict";

    const COLORS = {
        slate900: '#0f172a',
        slate800: '#1e293b',
        slate700: '#334155',
        slate500: '#64748b',
        slate400: '#94a3b8',
        slate200: '#e2e8f0',
        blue500: '#3b82f6'
    };

    const RelatedArticlesStyles = {
        COLORS: COLORS,

        /**
         * Get badge theme colors based on badge category
         * @param {String} badgeType
         * @param {String} [fallbackHex]
         * @returns {{ hex: String, bg: String }}
         */
        getBadgeColor(badgeType, fallbackHex) {
            if (badgeType === '跨領域導讀') return { hex: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' };
            if (badgeType === '同專題') return { hex: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' };
            if (badgeType === '同分類') return { hex: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' };
            if (badgeType === '最新研報') return { hex: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
            if (badgeType === '專題賽道') return { hex: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)' };
            if (badgeType === '深度專案') return { hex: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)' };
            return { hex: fallbackHex || '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' };
        },

        /**
         * Generate Shadow DOM CSS string
         * @param {Boolean} isList True for compact list layout, false for card grid
         * @returns {String} CSS stylesheet text
         */
        getStyles(isList) {
            if (isList) {
                return `
                    :host { display: block; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                    .link-list { display: flex; flex-direction: column; }
                    .list-item {
                        display: flex;
                        align-items: flex-start;
                        gap: 0.5rem;
                        padding: 0.75rem 1rem;
                        text-decoration: none;
                        color: #475569;
                        font-size: 0.8rem;
                        font-weight: 400;
                        transition: all 0.2s ease;
                        border-bottom: 1px solid rgba(226, 232, 240, 0.5);
                        line-height: 1.5;
                    }
                    .list-item:last-child { border-bottom: none; }
                    .list-item:hover {
                        background-color: #f8fafc;
                        color: ${COLORS.blue500};
                    }
                    .dot {
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        margin-top: 0.4rem;
                        flex-shrink: 0;
                    }
                    .link-title { 
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        flex: 1;
                        font-weight: 600;
                    }
                    .list-meta {
                        display: flex;
                        flex-direction: column;
                        gap: 0.2rem;
                        width: 100%;
                    }
                    .list-badge-row {
                        display: flex;
                        align-items: center;
                        gap: 0.4rem;
                    }
                    .list-category {
                        font-size: 0.65rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                    .list-badge {
                        font-size: 0.6rem;
                        font-weight: 600;
                        padding: 0.05rem 0.35rem;
                        border-radius: 0.25rem;
                        letter-spacing: 0.02em;
                    }

                    :host-context(html.dark) .list-item {
                        color: #cbd5e1;
                        border-color: rgba(51, 65, 85, 0.4);
                    }
                    :host-context(html.dark) .list-item:hover {
                        background-color: rgba(51, 65, 85, 0.3);
                        color: #60a5fa;
                    }
                `;
            }

            return `
                :host { display: block; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-top: 2.5rem; }
                .section-title { 
                    font-size: 1.15rem; 
                    font-weight: 700; 
                    color: var(--c-text-primary, ${COLORS.slate900}); 
                    margin-bottom: 1.25rem; 
                    padding-bottom: 0.6rem; 
                    border-bottom: 1px solid var(--c-border, ${COLORS.slate200});
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .card-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
                    gap: 1.25rem; 
                }
                @media (min-width: 1024px) {
                    .card-grid { grid-template-columns: repeat(3, 1fr); }
                }
                .card { 
                    position: relative;
                    background: var(--c-bg-card, #ffffff); 
                    border: 1px solid var(--c-border, ${COLORS.slate200}); 
                    border-radius: 0.85rem; 
                    overflow: hidden;
                    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); 
                    text-decoration: none; 
                    display: flex; 
                    flex-direction: column; 
                    box-sizing: border-box; 
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
                }
                .card:hover { 
                    transform: translateY(-3px); 
                    box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.12); 
                    border-color: rgba(59, 130, 246, 0.4); 
                }
                .card-accent-bar {
                    height: 3px;
                    width: 100%;
                    opacity: 0.85;
                }
                .card-body {
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }
                .card-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 0.75rem; 
                }
                .tag-badge { 
                    font-size: 0.68rem;
                    font-weight: 700; 
                    letter-spacing: 0.04em; 
                    padding: 0.2rem 0.55rem;
                    border-radius: 0.375rem;
                    text-transform: uppercase;
                }
                .recommend-badge {
                    font-size: 0.65rem;
                    font-weight: 600;
                    padding: 0.15rem 0.45rem;
                    border-radius: 0.3rem;
                }
                .title { 
                    font-size: 0.95rem; 
                    font-weight: 700; 
                    color: var(--c-text-primary, ${COLORS.slate900}); 
                    margin-bottom: 0.6rem; 
                    line-height: 1.45; 
                    display: -webkit-box; 
                    -webkit-line-clamp: 2; 
                    -webkit-box-orient: vertical; 
                    overflow: hidden; 
                }
                .desc { 
                    font-size: 0.8rem; 
                    color: var(--c-text-secondary, ${COLORS.slate500}); 
                    line-height: 1.55; 
                    display: -webkit-box; 
                    -webkit-line-clamp: 2; 
                    -webkit-box-orient: vertical; 
                    overflow: hidden; 
                    margin-bottom: 1.25rem; 
                    flex-grow: 1; 
                }
                .meta { 
                    font-size: 0.8rem; 
                    font-weight: 600; 
                    color: #3b82f6; 
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between;
                    margin-top: auto;
                }
                .arrow-icon { 
                    transition: transform 0.2s ease; 
                }
                .card:hover .arrow-icon { 
                    transform: translateX(4px); 
                }

                :host-context(html.dark) .card { 
                    background: var(--c-bg-card, ${COLORS.slate800}); 
                    border-color: var(--c-border, ${COLORS.slate700}); 
                }
                :host-context(html.dark) .card:hover {
                    box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.4);
                }
            `;
        }
    };

    global.RelatedArticlesStyles = RelatedArticlesStyles;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
