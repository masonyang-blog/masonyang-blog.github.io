/**
 * widget-knowledge-tooltip.js
 * 
 * Auto-links text in the document matching Knowledge Repository terms,
 * and provides a hover Tooltip using Shadow DOM to avoid CSS leaks.
 */

(function(global) {
    "use strict";

    class KnowledgeTooltipWidget extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'closed' });
            this._hideTimeout = null;
            this._isHovering = false;
        }

        connectedCallback() {
            // Listen for global events triggered by the span hover
            window.addEventListener('show-knowledge-tooltip', this.handleShow.bind(this));
            window.addEventListener('hide-knowledge-tooltip', this.handleHide.bind(this));
            
            // Allow hovering the tooltip itself
            this.shadowRoot.addEventListener('mouseenter', () => {
                this._isHovering = true;
                if (this._hideTimeout) clearTimeout(this._hideTimeout);
            });
            this.shadowRoot.addEventListener('mouseleave', () => {
                this._isHovering = false;
                this.handleHide();
            });
        }

        handleShow(e) {
            const { item, rect } = e.detail;
            if (this._hideTimeout) clearTimeout(this._hideTimeout);
            
            this.shadowRoot.innerHTML = this.getStyles() + this.getTemplate(item);
            
            const tooltip = this.shadowRoot.querySelector('.tooltip-container');
            if (!tooltip) return;

            // Compute position
            tooltip.style.display = 'block';
            
            // Assume 10px gap
            const gap = 12;
            let top = rect.top - tooltip.offsetHeight - gap + window.scrollY;
            let left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + window.scrollX;
            
            // Bottom fallback
            if (rect.top - tooltip.offsetHeight - gap < 0) {
                top = rect.bottom + gap + window.scrollY;
                tooltip.classList.add('tooltip-bottom');
            } else {
                tooltip.classList.add('tooltip-top');
            }

            // Screen boundaries for X
            if (left < 10) left = 10;
            if (left + tooltip.offsetWidth > window.innerWidth - 10) {
                left = window.innerWidth - tooltip.offsetWidth - 10;
            }

            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;

            // trigger animation
            requestAnimationFrame(() => {
                tooltip.classList.add('visible');
            });
            
            // Add click listener for 'Save to Notebook' if possible
            const saveBtn = this.shadowRoot.querySelector('.save-btn');
            if(saveBtn) {
                saveBtn.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    this.saveToNotebook(item);
                    saveBtn.textContent = '已存入';
                    saveBtn.style.opacity = '0.5';
                    saveBtn.style.pointerEvents = 'none';
                });
            }
        }

        handleHide() {
            this._hideTimeout = setTimeout(() => {
                if (this._isHovering) return;
                const tooltip = this.shadowRoot.querySelector('.tooltip-container');
                if (tooltip) {
                    tooltip.classList.remove('visible');
                    setTimeout(() => {
                        tooltip.style.display = 'none';
                    }, 200);
                }
            }, 250);
        }

        saveToNotebook(item) {
            const notebook = JSON.parse(localStorage.getItem('knowledge_notebook') || '[]');
            if (!notebook.some(n => n.id === item.id)) {
                notebook.push({
                    id: item.id,
                    title: item.title,
                    category: item.category,
                    timestamp: new Date().getTime()
                });
                localStorage.setItem('knowledge_notebook', JSON.stringify(notebook));
                window.dispatchEvent(new CustomEvent('notebook-updated', { detail: notebook }));
            }
        }

        getCategoryBadge(catKey) {
            const map = {
                'core': { label: 'Core', bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' },
                'macro': { label: 'Macro', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
                'cycle': { label: 'Cycle', bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
                'valuation': { label: 'Valuation', bg: '#fef9c3', color: '#854d0e', border: '#fef08a' },
                'onchain': { label: 'On-chain', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
                'infra': { label: 'Infra', bg: '#f3e8ff', color: '#6b21a8', border: '#e9d5ff' },
                'reg': { label: 'Regulation', bg: '#ffe4e6', color: '#be123c', border: '#fecdd3' }
            };
            const m = map[catKey] || { label: 'Concept', bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
            return `<span class="badge" style="background:${m.bg}; color:${m.color}; border: 1px solid ${m.border}">${m.label}</span>`;
        }

        getTemplate(item) {
            const tags = (item.keywords || '').split(',').slice(0,2).map(k => `<span class="tag">#${k.trim()}</span>`).join('');
            
            return `
                <div class="tooltip-container">
                    <div class="tooltip-header">
                        <h4 class="title">${item.title}</h4>
                        ${this.getCategoryBadge(item.tag || item.category)}
                    </div>
                    <div class="tooltip-body">
                        <p class="desc">${item.desc}</p>
                    </div>
                    ${tags ? `<div class="tooltip-tags">${tags}</div>` : ''}
                    <div class="tooltip-footer">
                        <a href="../post/topic-knowledge.html" class="link-btn">前往百科 &rarr;</a>
                        <button class="save-btn">📥 存入收納盒</button>
                    </div>
                </div>
            `;
        }

        getStyles() {
            // Check for dark mode from parent
            const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
            const bg = isDark ? '#0f172a' : '#ffffff';
            const border = isDark ? '#1e293b' : '#e2e8f0';
            const titleCol = isDark ? '#f8fafc' : '#0f172a';
            const descCol = isDark ? '#94a3b8' : '#475569';
            const shadow = isDark ? '0 20px 25px -5px rgba(0,0,0,0.5)' : '0 20px 25px -5px rgba(0,0,0,0.1)';
            const footerBorder = isDark ? '#1e293b' : '#f1f5f9';
            const btnBg = isDark ? '#1e293b' : '#f8fafc';
            const btnHover = isDark ? '#334155' : '#e2e8f0';

            return `
                <style>
                    .tooltip-container {
                        display: none;
                        position: absolute;
                        z-index: 99999;
                        width: 320px;
                        background: ${bg};
                        border: 1px solid ${border};
                        border-radius: 1rem;
                        box-shadow: ${shadow};
                        padding: 1.25rem;
                        font-family: 'Outfit', 'Noto Sans TC', sans-serif;
                        opacity: 0;
                        transform: translateY(5px);
                        transition: opacity 0.2s ease, transform 0.2s ease;
                        pointer-events: auto;
                    }
                    
                    .tooltip-container.visible {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    
                    .tooltip-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 0.75rem;
                        gap: 0.5rem;
                    }
                    
                    .title {
                        margin: 0;
                        font-size: 1.05rem;
                        font-weight: 800;
                        color: ${titleCol};
                        line-height: 1.3;
                    }
                    
                    .badge {
                        font-size: 0.65rem;
                        font-weight: 800;
                        padding: 0.15rem 0.5rem;
                        border-radius: 9999px;
                        text-transform: uppercase;
                        white-space: nowrap;
                    }
                    
                    .desc {
                        margin: 0;
                        font-size: 0.85rem;
                        color: ${descCol};
                        line-height: 1.6;
                        display: -webkit-box;
                        -webkit-line-clamp: 3;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                    
                    .tooltip-tags {
                        margin-top: 0.75rem;
                        display: flex;
                        gap: 0.4rem;
                        flex-wrap: wrap;
                    }
                    .tag {
                        font-size: 0.7rem;
                        color: #64748b;
                        font-weight: 600;
                    }
                    
                    .tooltip-footer {
                        margin-top: 1rem;
                        padding-top: 0.75rem;
                        border-top: 1px solid ${footerBorder};
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    
                    .link-btn {
                        font-size: 0.75rem;
                        font-weight: 700;
                        color: #ea580c;
                        text-decoration: none;
                    }
                    .link-btn:hover { text-decoration: underline; }
                    
                    .save-btn {
                        background: ${btnBg};
                        border: 1px solid ${border};
                        border-radius: 0.5rem;
                        padding: 0.35rem 0.6rem;
                        font-size: 0.75rem;
                        font-weight: 700;
                        color: ${titleCol};
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    .save-btn:hover {
                        background: ${btnHover};
                    }
                </style>
            `;
        }
    }

    if (!customElements.get('knowledge-tooltip')) {
        customElements.define('knowledge-tooltip', KnowledgeTooltipWidget);
    }

    // Auto-Scanner Logic
    class KnowledgeScanner {
        constructor() {
            this.termsMap = new Map();
            this.buildTermsMap();
            if (this.termsMap.size > 0) {
                this.scanDocument();
                this.injectTooltipElement();
            }
        }

        buildTermsMap() {
            if (!global.CoreKnowledgeRepository) return;
            const items = global.CoreKnowledgeRepository.all;
            items.forEach(item => {
                // Ignore general broad words if needed, but for now map everything
                if (item.title) {
                    const cleanTitle = item.title.replace(/\(.*?\)/g, '').trim(); 
                    if (cleanTitle.length >= 2) this.termsMap.set(cleanTitle.toLowerCase(), item);
                }
                if (item.keywords) {
                    item.keywords.split(',').forEach(k => {
                        const kw = k.trim();
                        if (kw.length >= 2) this.termsMap.set(kw.toLowerCase(), item);
                    });
                }
            });
            // Sort keys by length descending to match longest first
            this.termKeys = Array.from(this.termsMap.keys()).sort((a, b) => b.length - a.length);
        }

        scanDocument() {
            const container = document.querySelector('main');
            if (!container) return;

            const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
            const nodesToReplace = [];

            let node;
            while (node = walker.nextNode()) {
                if (node.parentNode) {
                    const parentTag = node.parentNode.tagName.toLowerCase();
                    // Don't replace inside links, headings, or already replaced terms
                    if (['script', 'style', 'a', 'code', 'pre', 'h1', 'h2', 'h3'].includes(parentTag)) continue;
                    if (node.parentNode.classList.contains('knowledge-term')) continue;
                    // Ignore things inside Shadow DOM or specific widgets
                    if (node.parentNode.closest('knowledge-tooltip') || node.parentNode.closest('related-pulse-widget')) continue;
                }
                
                const text = node.nodeValue;
                if (!text.trim()) continue;

                // Match exactly one term per text node for simplicity
                for (let key of this.termKeys) {
                    // Use case-insensitive match, but ensure word boundaries for English words
                    let regex;
                    if (/^[a-zA-Z0-9]+$/.test(key)) {
                        regex = new RegExp(`\\b(${this.escapeRegExp(key)})\\b`, 'i');
                    } else {
                        // For Chinese characters, word boundaries don't work the same
                        regex = new RegExp(`(${this.escapeRegExp(key)})`, 'i');
                    }

                    if (regex.test(text)) {
                        nodesToReplace.push({ node, key, regex });
                        break;
                    }
                }
            }

            nodesToReplace.forEach(({ node, key, regex }) => {
                const item = this.termsMap.get(key);
                if (!item) return;

                const parent = node.parentNode;
                const matchObj = node.nodeValue.match(regex);
                if (!matchObj) return;

                const parts = node.nodeValue.split(regex);
                const fragment = document.createDocumentFragment();

                parts.forEach((part) => {
                    if (part.toLowerCase() === key) {
                        const span = document.createElement('span');
                        span.className = 'knowledge-term';
                        // Add Tailwind classes dynamically since we don't know if CSS is built
                        span.style.cursor = 'help';
                        span.style.borderBottom = '1px dashed #ea580c';
                        span.style.color = '#ea580c';
                        span.style.fontWeight = 'bold';
                        span.textContent = part;
                        
                        span.addEventListener('mouseenter', () => {
                            const rect = span.getBoundingClientRect();
                            window.dispatchEvent(new CustomEvent('show-knowledge-tooltip', {
                                detail: { item, rect }
                            }));
                        });
                        span.addEventListener('mouseleave', () => {
                            window.dispatchEvent(new CustomEvent('hide-knowledge-tooltip'));
                        });

                        fragment.appendChild(span);
                    } else if (part) {
                        fragment.appendChild(document.createTextNode(part));
                    }
                });

                parent.replaceChild(fragment, node);
            });
        }

        escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        injectTooltipElement() {
            if (!document.querySelector('knowledge-tooltip')) {
                const el = document.createElement('knowledge-tooltip');
                el.style.position = 'absolute';
                el.style.top = '0';
                el.style.left = '0';
                el.style.width = '100%';
                el.style.height = '100%';
                el.style.pointerEvents = 'none'; 
                el.style.zIndex = '99999';
                document.body.appendChild(el);
            }
        }
    }

    // Initialize when DOM and dependencies are ready
    window.addEventListener('DOMContentLoaded', () => {
        const checkRepo = setInterval(() => {
            if (global.CoreKnowledgeRepository) {
                clearInterval(checkRepo);
                new KnowledgeScanner();
            }
        }, 100);
        setTimeout(() => clearInterval(checkRepo), 5000);
    });

})(window);
