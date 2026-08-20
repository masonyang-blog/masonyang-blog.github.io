// 相關文章關聯市場瞬息組件 (Related Pulse Component)
// Natively registers <related-pulse-widget> using closed Shadow DOM.
(function() {
    "use strict";

    class RelatedPulseWidget extends HTMLElement {
        constructor() {
            super();
            this._shadow = this.attachShadow({ mode: 'closed' });
        }

        connectedCallback() {
            // 確保組件基礎樣式，預設隱藏直到匹配成功
            this.style.display = 'none'; 
            
            const tagsStr = this.getAttribute('tags') || '[]';
            let tags = [];
            try {
                // 更強健的解析，處理可能存在的單引號並標準化為小寫
                tags = JSON.parse(tagsStr.replace(/'/g, '"')).map(t => t.toLowerCase().trim());
            } catch(e) {
                console.error('[RelatedPulse] Failed to parse tags:', tagsStr, e);
                return;
            }

            // 數據檢查與非同步重試邏輯 (Poll 機制)
            const tryInit = () => {
                const briefs = window.PULSE_DATA || [];
                if (briefs.length > 0) {
                    this.init(briefs, tags);
                    return true;
                }
                return false;
            };

            if (!tryInit()) {
                let attempts = 0;
                const interval = setInterval(() => {
                    attempts++;
                    if (tryInit() || attempts > 20) clearInterval(interval);
                }, 100);
            }
        }

        init(briefs, tags) {
            const matched = briefs.filter(b => {
                const bTags = (b.tags || []).map(t => t.toLowerCase().trim());
                // 強化篩選邏輯：必須包含組件要求的所有標籤 (AND 邏輯)
                // 這能確保精確度，例如要求 ["amd", "us-stocks"] 則不會顯示純 "us-stocks" 的總經短評
                return tags.every(t => bTags.includes(t));
            });

            // 排序：置頂優先，其後日期遞減
            matched.sort((a, b) => {
                const aPinned = a.pinned ? 1 : 0;
                const bPinned = b.pinned ? 1 : 0;
                if (aPinned !== bPinned) return bPinned - aPinned;
                return b.date.localeCompare(a.date);
            });

            const targetBriefs = matched.slice(0, 3);
            if (targetBriefs.length === 0) {
                this.style.display = 'none';
                return;
            }

            // 匹配成功，顯示組件
            this.style.display = 'block';
            this.render(targetBriefs);
        }

        getPulseUrl(briefId) {
            let href = window.location.href;
            const hashIdx = href.indexOf('#');
            if (hashIdx !== -1) href = href.substring(0, hashIdx);
            const queryIdx = href.indexOf('?');
            if (queryIdx !== -1) href = href.substring(0, queryIdx);
            
            // 相容 Windows 與 Unix 路徑分割符
            const dir = href.substring(0, Math.max(href.lastIndexOf('/'), href.lastIndexOf('\\')) + 1);
            
            // 更通用的路徑回退邏輯 (處理不同層級的目錄)
            if (href.toLowerCase().includes('/post/') || href.toLowerCase().includes('/news/')) {
                const parts = dir.split(/[/\\]/);
                // 移除結尾空字串與當前目錄名 (news/post)
                if (parts[parts.length - 1] === '') parts.pop();
                parts.pop(); 
                return parts.join('/') + '/pulse.html#' + briefId;
            } else {
                return dir + 'pulse.html#' + briefId;
            }
        }

        render(briefs) {
            // 清理舊內容，防止重複渲染
            while (this._shadow.firstChild) {
                this._shadow.removeChild(this._shadow.firstChild);
            }

            const isDark = document.documentElement.classList.contains('dark');
            const taxonomy = (window.BLOG_CONFIG && window.BLOG_CONFIG.TAGS) ? window.BLOG_CONFIG.TAGS : {};

            // 靜態 CSS
            const style = document.createElement('style');
            style.textContent = `
                :host {
                    display: block;
                    margin: 40px 0;
                    font-family: 'Inter', 'Noto Sans TC', sans-serif;
                }
                .widget-container {
                    padding: 24px 0;
                }
                .widget-title {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: ${isDark ? '#94a3b8' : '#64748b'};
                    margin-bottom: 20px;
                    border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'};
                    padding-bottom: 8px;
                }
                .briefs-timeline {
                    position: relative;
                    padding-left: 28px;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }
                .timeline-line {
                    position: absolute;
                    top: 8px;
                    bottom: 8px;
                    left: 5px;
                    width: 2px;
                    background-color: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'};
                }
                .brief-card {
                    position: relative;
                    background-color: ${isDark ? 'rgba(21, 32, 46, 0.65)' : 'rgba(255, 255, 255, 0.85)'};
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)'};
                    border-radius: 16px;
                    padding: 20px;
                    box-shadow: ${isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.03)'};
                    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .brief-card:hover {
                    transform: translateY(-2px);
                    box-shadow: ${isDark ? '0 12px 24px -10px rgba(0, 0, 0, 0.5)' : '0 12px 20px -8px rgba(0, 0, 0, 0.15)'};
                }
                .timeline-node {
                    position: absolute;
                    left: -29px;
                    top: 24px;
                    width: 10px;
                    height: 10px;
                    border-radius: 9999px;
                    background-color: ${isDark ? '#0f172a' : '#f8fafc'};
                    border: 3px solid #f97316;
                    z-index: 10;
                }
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .tags-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }
                .tag-badge {
                    font-size: 9px;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: ${isDark ? '#94a3b8' : '#475569'};
                    background-color: ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'};
                    padding: 2px 6px;
                    border-radius: 4px;
                    letter-spacing: 0.05em;
                }
                .meta-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: ${isDark ? '#64748b' : '#94a3b8'};
                }
                .date-text {
                    font-family: monospace;
                    font-size: 11px;
                }
                .btn-icon {
                    background: none;
                    border: none;
                    padding: 2px;
                    cursor: pointer;
                    color: ${isDark ? '#64748b' : '#94a3b8'};
                    transition: color 0.2s;
                    display: inline-flex;
                    align-items: center;
                }
                .btn-icon:hover {
                    color: #f97316;
                }
                .brief-title {
                    font-size: 15px;
                    font-weight: 700;
                    color: ${isDark ? '#f8fafc' : '#0f172a'};
                    margin: 0 0 10px 0;
                    line-height: 1.4;
                }
                .brief-body {
                    font-size: 13px;
                    line-height: 1.6;
                    color: ${isDark ? '#94a3b8' : '#475569'};
                }
                .brief-body p {
                    margin: 0 0 8px 0;
                }
                .brief-body p:last-child {
                    margin-bottom: 0;
                }
                .dsr-label {
                    font-weight: 700;
                    color: #f97316;
                }
                .hidden {
                    display: none !important;
                }
                .toast {
                    position: fixed;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%) translateY(1rem);
                    background-color: rgba(17, 24, 39, 0.95);
                    color: #ffffff;
                    padding: 10px 20px;
                    border-radius: 9999px;
                    font-size: 13px;
                    font-weight: 600;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.25s, transform 0.25s, visibility 0.25s;
                    z-index: 10000;
                    pointer-events: none;
                }
                .toast.show {
                    opacity: 1;
                    visibility: visible;
                    transform: translateX(-50%) translateY(0);
                }
            `;
            this._shadow.appendChild(style);

            const container = document.createElement('div');
            container.className = 'widget-container';

            const title = document.createElement('div');
            title.className = 'widget-title';
            title.textContent = '最新相關市場瞬息';
            container.appendChild(title);

            const timeline = document.createElement('div');
            timeline.className = 'briefs-timeline';

            const line = document.createElement('div');
            line.className = 'timeline-line';
            timeline.appendChild(line);

            // Toast element
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = '連結已複製到剪貼簿';
            container.appendChild(toast);

            briefs.forEach(b => {
                const card = document.createElement('div');
                card.className = 'brief-card';

                const node = document.createElement('div');
                node.className = 'timeline-node';
                card.appendChild(node);

                const header = document.createElement('div');
                header.className = 'card-header';

                const tagsDiv = document.createElement('div');
                tagsDiv.className = 'tags-container';
                b.tags.forEach(tagId => {
                    const tagSpan = document.createElement('span');
                    tagSpan.className = 'tag-badge';
                    tagSpan.textContent = '#' + (taxonomy[tagId] ? taxonomy[tagId].text : tagId);
                    tagsDiv.appendChild(tagSpan);
                });
                header.appendChild(tagsDiv);

                const meta = document.createElement('div');
                meta.className = 'meta-container';

                const dateSpan = document.createElement('span');
                dateSpan.className = 'date-text';
                dateSpan.textContent = b.date;
                meta.appendChild(dateSpan);

                // Copy button
                const copyBtn = document.createElement('button');
                copyBtn.className = 'btn-icon';
                copyBtn.setAttribute('aria-label', '複製此觀點連結');
                copyBtn.innerHTML = `<svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"></path></svg>`;
                copyBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetUrl = this.getPulseUrl(b.id);
                    navigator.clipboard.writeText(targetUrl).then(() => {
                        toast.classList.add('show');
                        setTimeout(() => {
                            toast.classList.remove('show');
                        }, 2000);
                    }).catch(err => {
                        console.error('Could not copy text: ', err);
                    });
                });
                meta.appendChild(copyBtn);

                // Share button
                if (navigator.share) {
                    const shareBtn = document.createElement('button');
                    shareBtn.className = 'btn-icon';
                    shareBtn.setAttribute('aria-label', '分享此觀點');
                    shareBtn.innerHTML = `<svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 10.742l5.051-2.525m-5.051 6.566l5.051 2.525M20 12a3 3 0 11-6 0 3 3 0 016 0zm-11 7a3 3 0 11-6 0 3 3 0 016 0zm0-14a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`;
                    shareBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetUrl = this.getPulseUrl(b.id);
                        navigator.share({
                            title: b.title + ' | Mason Yang Blog',
                            text: '閱讀 Mason Yang 關於「' + b.title + '」的市場短評：',
                            url: targetUrl
                        }).catch(err => {
                            if (err.name !== 'AbortError') {
                                console.error('Share failed:', err);
                            }
                        });
                    });
                    meta.appendChild(shareBtn);
                }

                header.appendChild(meta);
                card.appendChild(header);

                const titleH3 = document.createElement('h3');
                titleH3.className = 'brief-title';
                
                // Add link inside card title pointing to the pulse megapage
                const titleLink = document.createElement('a');
                titleLink.href = this.getPulseUrl(b.id);
                titleLink.style.color = 'inherit';
                titleLink.style.textDecoration = 'none';
                titleLink.textContent = b.title;
                titleH3.appendChild(titleLink);
                card.appendChild(titleH3);

                const bodyDiv = document.createElement('div');
                bodyDiv.className = 'brief-body';
                bodyDiv.innerHTML = b.compiled_html;
                card.appendChild(bodyDiv);

                timeline.appendChild(card);
            });

            container.appendChild(timeline);
            this._shadow.appendChild(container);
        }
    }

    // 同時註冊新舊自訂標籤，以支持舊文章的向下相容
    // 注意：Web Components 規範要求一個 constructor 只能對應一個標籤名
    if (!customElements.get('related-pulse-widget')) {
        customElements.define('related-pulse-widget', RelatedPulseWidget);
    }
    
    if (!customElements.get('related-briefs-widget')) {
        // 使用繼承來產生不同的 constructor
        customElements.define('related-briefs-widget', class extends RelatedPulseWidget {});
    }
})();
