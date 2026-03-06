/**
 * Bitcoin Mandala Chart Component
 * Renders a full 9x9 (81 units) interactive grid.
 * 
 * Layout Structure:
 * - Central 3x3 block: Root topic (center) surrounded by 8 main categories.
 * - Surrounding 3x3 blocks: Each category title (center) surrounded by its 8 sub-factors.
 */
(function (global) {
    "use strict";

    class MandalaComponent {
        constructor(hostElement) {
            this.hostElement = hostElement || document.querySelector('#mandala-host');
            if (!this.hostElement) {
                console.warn('MandalaComponent: Host element not found');
                return;
            }
            this.shadowRoot = this.hostElement.attachShadow({ mode: "open" });
            this.data = global.bitcoinMandalaData;

            this.state = {
                view: 'full', // Always full view for 81-grid
                activeSubFactorId: null
            };

            this.posToCoord = {
                'NW': [0, 0], 'N': [0, 1], 'NE': [0, 2],
                'W': [1, 0], 'center': [1, 1], 'E': [1, 2],
                'SW': [2, 0], 'S': [2, 1], 'SE': [2, 2]
            };
        }

        init() {
            if (!this.data) {
                console.error("Mandala data not found.");
                return;
            }
            this.createStyles();
            this.createStructure();
            this.render9x9Grid();
            this.attachEvents();
        }

        createStyles() {
            const style = document.createElement("style");
            style.textContent = `
                :host {
                    display: block;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
                    --grid-gap: 4px;
                    --color-bg: #ffffff;
                    --color-surface: #f8fafc;
                    --color-border: #e2e8f0;
                    --color-text-primary: #1e293b;
                    --color-text-secondary: #64748b;
                    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                }

                :host-context(html.dark) {
                    --color-bg: #131722;
                    --color-surface: #1e222d;
                    --color-border: #2a2e39;
                    --color-text-primary: #d1d4dc;
                    --color-text-secondary: #787b86;
                }

                * { box-sizing: border-box; }

                .wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    background: var(--color-bg);
                    border: 1px solid var(--color-border);
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                }

                .main-content {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    width: 100%;
                }

                .header {
                    margin-bottom: 16px;
                    text-align: center;
                    border-bottom: 1px solid var(--color-border);
                    padding-bottom: 16px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }

                #viewTitle {
                    font-size: 1.4rem;
                    font-weight: 800;
                    color: var(--color-text-primary);
                    margin: 0;
                }

                .mandala-controls {
                    display: flex;
                    gap: 16px;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    width: 100%;
                }

                .search-input {
                    padding: 8px 16px;
                    border: 1px solid var(--color-border);
                    border-radius: 20px;
                    width: 100%;
                    max-width: 250px;
                    font-size: 0.9rem;
                    background: var(--color-surface);
                    color: var(--color-text-primary);
                    outline: none;
                    transition: 0.2s;
                }

                .search-input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                }

                .heatmap-toggle {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--color-text-secondary);
                    cursor: pointer;
                    user-select: none;
                    background: var(--color-surface);
                    padding: 6px 12px;
                    border-radius: 20px;
                    border: 1px solid var(--color-border);
                    transition: 0.2s;
                }
                
                .heatmap-toggle:hover {
                    background: var(--color-border);
                }

                .heatmap-toggle input {
                    cursor: pointer;
                    accent-color: #ef4444;
                    width: 16px;
                    height: 16px;
                }

                .timeframe-group {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .timeframe-btn {
                    padding: 6px 14px;
                    border-radius: 20px;
                    border: 1px solid var(--color-border);
                    background: var(--color-surface);
                    color: var(--color-text-secondary);
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: 0.2s;
                    user-select: none;
                }

                .timeframe-btn:hover {
                    border-color: #3b82f6;
                    color: var(--color-text-primary);
                }

                .timeframe-btn.active {
                    background: #3b82f6;
                    border-color: #3b82f6;
                    color: white;
                }

                .heatmap-legend {
                    display: none;
                    margin-top: 12px;
                    font-size: 0.85rem;
                    color: var(--color-text-secondary);
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                    animation: fadeIn 0.3s ease forwards;
                }

                .heatmap-legend.active {
                    display: flex;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .legend-color {
                    width: 12px;
                    height: 12px;
                    border-radius: 2px;
                }

                .cell.dimmed {
                    opacity: 0.15;
                    filter: grayscale(100%);
                    pointer-events: none;
                }

                /* Heatmap Colors (1 to 5) */
                .cell.heatmap-1 { background: rgba(239, 68, 68, 0.05) !important; border-color: rgba(239, 68, 68, 0.2) !important; color: var(--color-text-primary) !important; }
                .cell.heatmap-2 { background: rgba(239, 68, 68, 0.2) !important; border-color: rgba(239, 68, 68, 0.4) !important; color: var(--color-text-primary) !important; }
                .cell.heatmap-3 { background: rgba(239, 68, 68, 0.5) !important; border-color: rgba(239, 68, 68, 0.6) !important; color: white !important; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
                .cell.heatmap-4 { background: rgba(239, 68, 68, 0.8) !important; border-color: rgba(239, 68, 68, 0.9) !important; color: white !important; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
                .cell.heatmap-5 { background: rgba(239, 68, 68, 1) !important; border-color: #b91c1c !important; color: white !important; font-weight: 800; text-shadow: 0 1px 2px rgba(0,0,0,0.8); }

                .mandala-grid {
                    display: grid;
                    grid-template-columns: repeat(9, 1fr);
                    grid-template-rows: repeat(9, 1fr);
                    gap: var(--grid-gap);
                    aspect-ratio: 1 / 1;
                    width: 100%;
                    margin: 0 auto;
                }

                .cell {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 4px;
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 0.65rem;
                    font-weight: 500;
                    color: var(--color-text-primary);
                    line-height: 1.2;
                    overflow: hidden;
                }

                .cell:hover {
                    background: var(--color-border);
                    transform: scale(1.05);
                    z-index: 10;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                /* Center 3x3 Area Highlight */
                .cell.meta-center {
                    background: rgba(41, 98, 255, 0.05);
                    border-color: rgba(41, 98, 255, 0.2);
                }

                /* Specific Cells */
                .cell.root-node {
                    background: #2962FF !important;
                    color: white !important;
                    font-weight: 800;
                    font-size: 0.75rem;
                }

                .cell.factor-label {
                    background: var(--color-bg);
                    border: 2px solid var(--color-border);
                    font-weight: 700;
                    color: var(--color-text-primary);
                }

                .cell.is-active {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    border-color: var(--color-text-primary);
                    background: var(--color-surface);
                    z-index: 10 !important;
                }
                
                .cell.sub-factor:hover {
                    transform: scale(1.05);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    z-index: 5;
                }

                /* Detail Panel */
                .detail-panel {
                    margin-top: 24px;
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: 12px;
                    display: none;
                    animation: fadeIn 0.3s ease forwards;
                    z-index: 100;
                }

                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }

                .detail-panel.open {
                    display: block;
                }

                .panel-container {
                    padding: 24px;
                    position: relative;
                }

                @media (min-width: 1024px) {
                    .main-content {
                        flex-direction: row;
                        align-items: flex-start;
                        justify-content: center;
                    }

                    .mandala-grid {
                        flex: 0 0 800px;
                        max-width: 800px;
                    }

                    .detail-panel {
                        position: fixed;
                        top: 0;
                        right: 0;
                        width: 450px;
                        height: 100vh;
                        margin-top: 0;
                        border-radius: 0;
                        border-top: none;
                        border-bottom: none;
                        border-right: none;
                        border-left: 1px solid var(--color-border);
                        box-shadow: -10px 0 50px rgba(0,0,0,0.1);
                        z-index: 9999;
                        background: var(--color-bg);
                        display: none;
                        animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }

                    .detail-panel.open {
                        display: block;
                    }

                    .panel-container {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        padding: 32px;
                    }

                    .panel-content {
                        flex: 1;
                        overflow-y: auto;
                    }
                }

                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 1px solid var(--color-border);
                    padding-bottom: 12px;
                }

                .panel-title { font-size: 1.4rem; font-weight: 700; margin: 0; color: var(--color-text-primary); }

                .panel-close {
                    background: none; border: none; cursor: pointer; color: var(--color-text-secondary);
                }

                .panel-content { font-size: 1rem; line-height: 1.6; color: var(--color-text-secondary); }

                .panel-content h4 { color: var(--color-text-primary); margin-top: 0; font-size: 1.2rem; }

                /* Action Buttons */
                .action-container {
                    margin-top: 24px;
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }

                .action-btn {
                    display: flex; align-items: center; gap: 8px;
                    padding: 8px 16px; border-radius: 6px; font-size: 0.9rem; font-weight: 600;
                    cursor: pointer; text-decoration: none; border: none; transition: 0.2s;
                }

                .ai-copy-btn { background: #10b981; color: white; }
                .ai-copy-btn:hover { background: #059669; }

                .chart-link-btn { background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text-primary); }
                .chart-link-btn:hover { background: var(--color-border); }

                @media (max-width: 768px) {
                    .mandala-grid { grid-template-columns: repeat(9, 1fr); }
                    .cell { font-size: 0.5rem; padding: 2px; }
                    .panel-container { padding: 20px; }
                }
            `;
            this.shadowRoot.appendChild(style);
        }

        createStructure() {
            const wrapper = document.createElement("div");
            wrapper.classList.add("wrapper");
            wrapper.innerHTML = `
                <div class="header">
                    <h2 id="viewTitle"></h2>
                    <div class="mandala-controls">
                        <input type="search" id="searchInput" class="search-input" placeholder="🔍 搜尋因子關鍵字...">
                        <label class="heatmap-toggle" title="顯示因子影響力權重">
                            <input type="checkbox" id="heatmapToggle">
                            🔥 熱力圖
                        </label>
                        <div class="timeframe-group" id="timeframeGroup">
                            <button class="timeframe-btn active" data-value="all">⏳ 全部</button>
                            <button class="timeframe-btn" data-value="短期">短期</button>
                            <button class="timeframe-btn" data-value="中期">中期</button>
                            <button class="timeframe-btn" data-value="長期">長期</button>
                        </div>
                    </div>
                    <div class="heatmap-legend" id="heatmapLegend">
                        <span style="font-weight:600; margin-right:4px;">影響力權重：</span>
                        <div class="legend-item"><div class="legend-color" style="background: rgba(239, 68, 68, 0.1);"></div><span>1 (低)</span></div>
                        <div class="legend-item"><div class="legend-color" style="background: rgba(239, 68, 68, 0.3);"></div><span>2</span></div>
                        <div class="legend-item"><div class="legend-color" style="background: rgba(239, 68, 68, 0.5);"></div><span>3 (中)</span></div>
                        <div class="legend-item"><div class="legend-color" style="background: rgba(239, 68, 68, 0.8);"></div><span>4</span></div>
                        <div class="legend-item"><div class="legend-color" style="background: rgba(239, 68, 68, 1);"></div><span>5 (高)</span></div>
                    </div>
                </div>
                <div class="main-content">
                    <div class="mandala-grid" id="grid"></div>
                    <div class="detail-panel" id="detailPanel">
                        <div class="panel-container">
                            <div class="panel-header">
                                <h2 class="panel-title" id="panelTitle"></h2>
                                <button class="panel-close" id="closePanel">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                            <div id="panelContent" class="panel-content"></div>
                        </div>
                    </div>
                </div>
            `;
            this.shadowRoot.appendChild(wrapper);

            this.ui = {
                grid: this.shadowRoot.getElementById('grid'),
                viewTitle: this.shadowRoot.getElementById('viewTitle'),
                searchInput: this.shadowRoot.getElementById('searchInput'),
                heatmapToggle: this.shadowRoot.getElementById('heatmapToggle'),
                timeframeGroup: this.shadowRoot.getElementById('timeframeGroup'),
                heatmapLegend: this.shadowRoot.getElementById('heatmapLegend'),
                detailPanel: this.shadowRoot.getElementById('detailPanel'),
                panelTitle: this.shadowRoot.getElementById('panelTitle'),
                panelContent: this.shadowRoot.getElementById('panelContent'),
                closePanel: this.shadowRoot.getElementById('closePanel')
            };

            this.ui.viewTitle.textContent = this.data.core.title;
        }

        render9x9Grid() {
            this.ui.grid.innerHTML = '';

            // 2D Array for 9x9 grid to make placement intuitive [y][x]
            const grid2D = Array(9).fill(null).map(() => Array(9).fill(null));

            // Map data to coordinates
            const [myC, mxC] = [1, 1]; // Center meta-block is at (1,1) in a 3x3 meta-grid

            // 1. Place Root Node
            grid2D[myC * 3 + 1][mxC * 3 + 1] = this.createCell(this.data.core, 'root-node');

            // 2. Place Main Factors around Root & Setup their Meta-blocks
            this.data.factors.forEach(factor => {
                const [sy, sx] = this.posToCoord[factor.position];

                // Place Factor label in the Center Block
                grid2D[myC * 3 + sy][mxC * 3 + sx] = this.createCell({ title: factor.title.split('. ')[1] || factor.title, color: factor.color }, 'factor-label');

                // Place Factor label in its own Meta-block center
                const fBlockY = sy;
                const fBlockX = sx;
                grid2D[fBlockY * 3 + 1][fBlockX * 3 + 1] = this.createCell({ title: factor.title.split('. ')[1] || factor.title, color: factor.color }, 'factor-label meta-center');

                // Place Subfactors around it
                if (factor.subFactors) {
                    factor.subFactors.forEach(sub => {
                        const [ssy, ssx] = this.posToCoord[sub.position];
                        const sCell = this.createCell({ ...sub, color: factor.color }, 'sub-factor');
                        sCell.onclick = () => {
                            this.shadowRoot.querySelectorAll('.cell').forEach(c => c.classList.remove('is-active'));
                            sCell.classList.add('is-active');
                            this.openDetail(sub);

                            // Scroll panel into view smoothly for mobile only
                            if (window.innerWidth < 1024) {
                                setTimeout(() => {
                                    const panelTop = this.ui.detailPanel.getBoundingClientRect().top + window.scrollY;
                                    const offset = 100; // Leave some space above the panel
                                    window.scrollTo({ top: panelTop - offset, behavior: 'smooth' });
                                }, 50);
                            }
                        };
                        grid2D[fBlockY * 3 + ssy][fBlockX * 3 + ssx] = sCell;
                    });
                }
            });

            // Flatten 2D array and append to grid
            for (let y = 0; y < 9; y++) {
                for (let x = 0; x < 9; x++) {
                    const el = grid2D[y][x] || document.createElement('div');
                    if (!grid2D[y][x]) {
                        el.className = 'cell empty';
                        // Optional: slightly dim the background of the 3x3 center block to distinguish it
                        if (y >= 3 && y <= 5 && x >= 3 && x <= 5) {
                            el.classList.add('meta-center');
                        }
                    }

                    // Add thick borders to the outer edges of the 3x3 macro blocks
                    // This creates the "thick outside, thin inside" visual hierarchy
                    if (y % 3 === 0) el.style.borderTopWidth = '3px';
                    if (y % 3 === 2) el.style.borderBottomWidth = '3px';
                    if (x % 3 === 0) el.style.borderLeftWidth = '3px';
                    if (x % 3 === 2) el.style.borderRightWidth = '3px';

                    this.ui.grid.appendChild(el);
                }
            }
        }

        createCell(data, type) {
            const el = document.createElement('div');
            el.className = `cell ${type}`;

            const title = data.title ? (data.title.includes('. ') ? data.title.split('. ')[1] : data.title) : '';
            el.innerHTML = `<span>${title}</span>`;

            if (type.includes('factor-label') && data.color) {
                el.style.borderColor = data.color;
                // High contrast UI: Dark text for light background in light theme, white text in dark theme
                el.style.color = 'var(--color-text-primary)';
                // Richer fill for the background (hex '33' is 20% opacity, '40' is 25%)
                el.style.backgroundColor = `${data.color}33`;
                // Emphasize the typography for labels
                el.style.fontWeight = '800';
                el.style.fontSize = '0.75rem';
                // Add a subtle inner shadow to make it feel like a filled block
                el.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.05)';
            }

            if (type === 'sub-factor') {
                if (data.color) {
                    el.style.borderColor = data.color;
                    el.style.borderWidth = '1.5px'; // slightly thicker to show the color better
                }
                el.title = data.title;
                const weight = data.weight || (Math.floor(Math.random() * 5) + 1); // Mock random weight if missing
                el.setAttribute('data-weight', weight);
                el.setAttribute('data-timeframe', data.timeframe || '中期');

                const searchContent = (data.title + ' ' + (data.content || '')).replace(/<[^>]+>/g, '').toLowerCase();
                el.setAttribute('data-fulltext', searchContent);
            } else {
                el.setAttribute('data-fulltext', title.toLowerCase());
            }

            return el;
        }

        openDetail(subFactor) {
            this.ui.panelTitle.textContent = subFactor.title;

            const detailHtml = this.renderSubFactorContent(subFactor);

            this.ui.panelContent.innerHTML = `
                <div class="content-body">
                    <div class="factor-meta" style="margin-bottom: 24px; display: flex; gap: 8px; flex-wrap: wrap;">
                        <span style="background: rgba(239,68,68,0.1); color: #ef4444; padding: 6px 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; border: 1px solid rgba(239,68,68,0.2);">🔥 影響力: ${subFactor.weight || '3'} / 5</span>
                        <span style="background: rgba(59,130,246,0.1); color: #3b82f6; padding: 6px 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; border: 1px solid rgba(59,130,246,0.2);">⏳ 週期: ${subFactor.timeframe || '中期'}</span>
                    </div>
                    <div class="detail-body-text" style="color: var(--color-text-primary);">
                       ${detailHtml}
                    </div>
                </div>
                <div class="action-container" style="margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--color-border); flex-wrap: wrap;">
                    ${subFactor.chartUrl ? `
                        <a href="${subFactor.chartUrl}" target="_blank" class="action-btn chart-link-btn" style="flex: 1; min-width: 140px; justify-content: center;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                            即時圖表
                        </a>
                    ` : ''}
                    <button class="action-btn ai-copy-btn" id="aiCopyBtn" style="flex: 1; min-width: 140px; justify-content: center;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        AI 指令
                    </button>
                </div>
            `;

            this.ui.detailPanel.classList.add('open');

            const aiBtn = this.shadowRoot.getElementById('aiCopyBtn');
            if (aiBtn) aiBtn.onclick = () => this.copyToAI(subFactor);
        }

        renderSubFactorContent(subFactor) {
            // If it already has HTML content, use it (backward compatibility)
            if (subFactor.content && subFactor.content.includes('<')) {
                return subFactor.content;
            }

            // If it has structured logic data, render it in PSMA style
            if (subFactor.logic) {
                return `
                    <div class="psma-content">
                        <p><strong>💡 核心邏輯</strong>：${subFactor.logic}</p>
                        <p><strong>👉 推導邏輯</strong>：${subFactor.deduction}</p>
                        <ul>
                            <li><strong>🟢 利多判斷</strong>：${subFactor.bullish}</li>
                            <li><strong>🔴 利空判斷</strong>：${subFactor.bearish}</li>
                            <li><strong>📊 觀察重點</strong>：${subFactor.observation}</li>
                        </ul>
                    </div>
                `;
            }

            return subFactor.content || '暫無詳細資料。';
        }

        async copyToAI(subFactor) {
            let text = '';

            if (subFactor.logic) {
                text = `💡 核心邏輯：${subFactor.logic}\n👉 推導邏輯：${subFactor.deduction}\n🟢 利多判斷：${subFactor.bullish}\n🔴 利空判斷：${subFactor.bearish}\n📊 觀察重點：${subFactor.observation}`;
            } else {
                const temp = document.createElement('div');
                temp.innerHTML = subFactor.content || '';
                text = temp.innerText.trim();
            }

            const prompt = `請以比特幣專業分析師的角度，針對以下因素進行深度的「即時新聞分析」。\n\n### 1. 因素背景與判斷標準：\n${text}\n\n### 2. 當前市場快訊：\n[貼入新聞內容]\n\n### 3. 分析任務：\n1. 訊號性質 (多/空/中立)？\n2. 影響權重？\n3. 具體建議？`;

            try {
                await navigator.clipboard.writeText(prompt);
                const btn = this.shadowRoot.getElementById('aiCopyBtn');
                btn.textContent = '✅ 已複製';
                setTimeout(() => { btn.innerHTML = '複製 AI 指令'; }, 2000);
            } catch (e) { alert('複製失敗'); }
        }

        closeDetail() {
            this.ui.detailPanel.classList.remove('open');
            this.shadowRoot.querySelectorAll('.cell').forEach(c => c.classList.remove('is-active'));
        }

        attachEvents() {
            this.ui.closePanel.onclick = () => this.closeDetail();

            // Search Functionality
            if (this.ui.searchInput) {
                this.ui.searchInput.addEventListener('input', (e) => this.handleFilters());
            }

            // Timeframe Filter Buttons
            if (this.ui.timeframeGroup) {
                this.ui.timeframeGroup.addEventListener('click', (e) => {
                    const btn = e.target.closest('.timeframe-btn');
                    if (!btn) return;

                    this.shadowRoot.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.handleFilters(btn.getAttribute('data-value'));
                });
            }

            // Heatmap Toggle
            if (this.ui.heatmapToggle) {
                this.ui.heatmapToggle.addEventListener('change', (e) => this.toggleHeatmap(e.target.checked));
            }
        }

        handleFilters(timeframeValue) {
            const query = this.ui.searchInput ? this.ui.searchInput.value.toLowerCase().trim() : '';

            // Get active timeframe if not provided
            let timeframe = timeframeValue;
            if (!timeframe) {
                const activeBtn = this.shadowRoot.querySelector('.timeframe-btn.active');
                timeframe = activeBtn ? activeBtn.getAttribute('data-value') : 'all';
            }

            const cells = this.shadowRoot.querySelectorAll('.cell.sub-factor, .cell.factor-label:not(.meta-center)');

            cells.forEach(cell => {
                let show = true;

                // 1. Keyword search check
                if (query) {
                    const fullText = cell.getAttribute('data-fulltext') || '';
                    if (!fullText.includes(query)) show = false;
                }

                // 2. Timeframe check (only applies to sub-factors that have the timeframe attribute)
                if (show && timeframe !== 'all' && cell.classList.contains('sub-factor')) {
                    const cellTimeframe = cell.getAttribute('data-timeframe');
                    if (cellTimeframe !== timeframe) show = false;
                }

                // Apply dimming
                if (show) {
                    cell.classList.remove('dimmed');
                } else {
                    cell.classList.add('dimmed');
                }
            });
        }

        toggleHeatmap(isActive) {
            const cells = this.shadowRoot.querySelectorAll('.cell.sub-factor');

            if (isActive) {
                this.ui.heatmapLegend.classList.add('active');
            } else {
                this.ui.heatmapLegend.classList.remove('active');
            }

            cells.forEach(cell => {
                if (isActive) {
                    const weight = cell.getAttribute('data-weight') || 3;
                    cell.classList.add(`heatmap-${weight}`);
                } else {
                    for (let i = 1; i <= 5; i++) {
                        cell.classList.remove(`heatmap-${i}`);
                    }
                }
            });
        }
    }

    global.MandalaComponent = MandalaComponent;

})(window);
