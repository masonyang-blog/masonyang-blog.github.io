/**
 * Mandala Chart Component
 * Renders an interactive 9x9 grid for Bitcoin Price Factors using Shadow DOM.
 * Features:
 * - Macro View: 8 Core Factors surrounding Central Topic
 * - Micro View: Zoom into a Factor -> 8 Sub-factors surrounding it
 * - Detail Panel: Slide-over panel for full text content
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

            // State
            this.state = {
                view: 'macro', // 'macro' or 'micro'
                activeFactorId: null,
                activeSubFactorId: null,
                sentiment: this.loadSentimentState() // { factorId: 'bull' | 'bear' | 'neutral' }
            };
        }

        init() {
            if (!this.data) {
                console.error("Mandala data not found. Ensure bitcoin-mandala-data.js is loaded.");
                return;
            }
            this.createStyles();
            this.createStructure();
            this.renderMacroView();
            this.renderDashboard(); // New Dashboard
            this.attachEvents();
        }

        // --- State Management ---
        loadSentimentState() {
            try {
                const saved = localStorage.getItem('bitcoinMandalaSentiment');
                return saved ? JSON.parse(saved) : {};
            } catch (e) {
                console.error('Failed to load sentiment state', e);
                return {};
            }
        }

        saveSentimentState() {
            try {
                localStorage.setItem('bitcoinMandalaSentiment', JSON.stringify(this.state.sentiment));
                // Update UI whenever state saves
                this.updateGridVisuals();
                this.renderDashboard();
            } catch (e) {
                console.error('Failed to save sentiment state', e);
            }
        }

        setSentiment(id, value) {
            if (!id) return;
            this.state.sentiment[id] = value;
            this.saveSentimentState();
        }

        createStyles() {
            const style = document.createElement("style");
            style.textContent = `
                :host {
                    display: block;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
                    --grid-gap: 12px;
                    --cell-size: 110px; 
                    --anim-speed: 0.35s;
                    --color-bg: #ffffff;
                    --color-surface: #f8fafc;
                    --color-border: #e2e8f0;
                    --color-text-primary: #1e293b;
                    --color-text-secondary: #64748b;
                    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }

                /* Dark Mode Variables (TradingView Style) */
                :host-context(html.dark) {
                    --color-bg: #131722;       /* TV Main BG */
                    --color-surface: #1e222d;  /* TV Card BG */
                    --color-border: #2a2e39;   /* TV Border */
                    --color-text-primary: #d1d4dc;
                    --color-text-secondary: #787b86;
                    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
                    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
                    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
                }

                * { box-sizing: border-box; }

                .wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 900px;
                    margin: 0 auto;
                    overflow: hidden; 
                    background: var(--color-bg);
                    border: 1px solid var(--color-border);
                    border-radius: 12px;
                    box-shadow: var(--shadow-md);
                    padding: 24px;
                    min-height: 650px;
                    display: flex;
                    flex-direction: column;
                }

                /* Header */
                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid var(--color-border);
                }
                
                #viewTitle {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--color-text-primary);
                    letter-spacing: -0.025em;
                }

                .back-btn {
                    display: none; /* Hidden by default */
                    align-items: center;
                    gap: 8px;
                    background: transparent;
                    border: 1px solid var(--color-border);
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--color-text-secondary);
                    transition: all 0.2s ease;
                }
                
                .back-btn:hover {
                    background: var(--color-surface);
                    color: var(--color-text-primary);
                    border-color: var(--color-text-secondary);
                }

                .back-btn.visible { display: flex; }

                /* Grid Layout */
                .mandala-grid-container {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px 0;
                }

                .mandala-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(3, 1fr);
                    gap: var(--grid-gap);
                    aspect-ratio: 1 / 1;
                    width: 100%;
                    max-width: 500px; /* Optimal size */
                }

                /* Cell Styles */
                .cell {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 12px;
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: 12px; /* Slightly more rounded */
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    user-select: none;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: var(--color-text-primary);
                    position: relative;
                    box-shadow: var(--shadow-sm);
                }

                .cell:hover {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--color-text-secondary);
                    z-index: 5;
                }

                /* Center Node Styling */
                .cell.center-node {
                    background: linear-gradient(135deg, rgba(41, 98, 255, 0.1) 0%, rgba(41, 98, 255, 0.05) 100%); /* TV Blue tint */
                    border: 2px solid #2962FF; /* TV Blue */
                    color: #2962FF;
                    font-weight: 800;
                    font-size: 1.1rem;
                    z-index: 2;
                }
                
                :host-context(html.dark) .cell.center-node {
                     background: linear-gradient(135deg, rgba(41, 98, 255, 0.2) 0%, rgba(41, 98, 255, 0.05) 100%);
                     color: #4C82FF; /* Lighter blue for dark mode */
                     border-color: #2962FF;
                }

                .cell-title {
                    line-height: 1.4;
                    margin-bottom: 4px;
                }
                
                .cell-focus {
                    font-size: 0.75rem;
                    color: var(--color-text-secondary);
                    font-weight: 400;
                    margin-top: 4px;
                    display: none;
                }
                
                @media (min-width: 500px) {
                    .cell-focus { display: block; }
                }

                /* Detail Panel (Appears Below Grid) */
                .detail-panel {
                    position: relative;
                    width: 100%;
                    max-height: 0;
                    overflow: hidden;
                    background: var(--color-bg);
                    z-index: 10;
                    transition: max-height var(--anim-speed) cubic-bezier(0.4, 0, 0.2, 1), margin var(--anim-speed), opacity var(--anim-speed);
                    padding: 0 32px;
                    border-top: 1px solid transparent;
                    display: flex;
                    flex-direction: column;
                    opacity: 0;
                }

                .detail-panel.open {
                    max-height: 2000px;
                    margin-top: 32px;
                    padding: 32px;
                    border-top-color: var(--color-border);
                    opacity: 1;
                }

                .panel-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid var(--color-border);
                }

                .panel-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--color-text-primary);
                    margin: 0;
                }

                .panel-close {
                    background: transparent;
                    border: none;
                    color: var(--color-text-secondary);
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .panel-close:hover {
                    background: var(--color-surface);
                    color: var(--color-text-primary);
                }

                .panel-close svg {
                    width: 24px;
                    height: 24px;
                    stroke-width: 2.5;
                }

                .panel-content {
                    flex: 1;
                    overflow-y: auto;
                    padding-right: 8px; /* Space for scrollbar */
                }

                /* Scrollbar Styling */
                .panel-content::-webkit-scrollbar { width: 6px; }
                .panel-content::-webkit-scrollbar-track { background: transparent; }
                .panel-content::-webkit-scrollbar-thumb { background-color: var(--color-border); border-radius: 3px; }
                .panel-content::-webkit-scrollbar-thumb:hover { background-color: var(--color-text-secondary); }

                /* Content Typography */
                .content-body h3 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--color-text-primary);
                    margin-top: 24px;
                    margin-bottom: 12px;
                }
                
                .content-body p {
                    font-size: 1rem;
                    line-height: 1.7;
                    color: var(--color-text-secondary);
                    margin-bottom: 16px;
                }
                
                .content-body ul {
                    padding-left: 20px;
                    color: var(--color-text-secondary);
                    margin-bottom: 16px;
                }
                
                .content-body li {
                    margin-bottom: 8px;
                }

                /* Responsive Adjustments */
                @media (max-width: 640px) {
                    .wrapper { padding: 16px; min-height: 500px; }
                    .header { margin-bottom: 16px; }
                    .mandala-grid { gap: 8px; }
                    .cell { padding: 8px; border-radius: 8px; font-size: 0.85rem; }
                    .cell-title { margin-bottom: 0; }
                    
                    /* Adjust panel padding on mobile */
                    .detail-panel.open { padding: 24px 16px; }
                    .sentiment-controls { flex-direction: column; }
                }

                /* Sentiment UI */
                .sentiment-controls {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 24px;
                    padding: 16px;
                    background: var(--color-surface);
                    border-radius: 8px;
                    border: 1px solid var(--color-border);
                }

                .sentiment-btn {
                    flex: 1;
                    padding: 8px;
                    border: 1px solid var(--color-border);
                    background: var(--color-bg);
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--color-text-secondary);
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                .sentiment-btn:hover { background: var(--color-surface); }
                
                .sentiment-btn.active.bull { background: #dcfce7; color: #166534; border-color: #22c55e; }
                .sentiment-btn.active.bear { background: #fee2e2; color: #991b1b; border-color: #ef4444; }
                .sentiment-btn.active.neutral { background: #f1f5f9; color: #475569; border-color: #94a3b8; }
                
                :host-context(html.dark) .sentiment-btn.active.bull { background: #052e16; color: #4ade80; border-color: #22c55e; }
                :host-context(html.dark) .sentiment-btn.active.bear { background: #450a0a; color: #f87171; border-color: #ef4444; }
                :host-context(html.dark) .sentiment-btn.active.neutral { background: #1e293b; color: #94a3b8; border-color: #475569; }

                /* Grid Visual Indicators */
                .sentiment-dot {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    display: none;
                    box-shadow: 0 0 4px currentColor;
                }
                
                .sentiment-dot.bull { display: block; background-color: #22c55e; color: #22c55e; }
                .sentiment-dot.bear { display: block; background-color: #ef4444; color: #ef4444; }
                
                /* Macro View Aggregation Glow */
                .cell.macro-bull { box-shadow: 0 0 0 2px #22c55e inset; }
                .cell.macro-bear { box-shadow: 0 0 0 2px #ef4444 inset; }

                /* Dashboard */
                .dashboard {
                    margin-top: 32px;
                    padding: 24px;
                    background: var(--color-bg);
                    border-top: 1px solid var(--color-border);
                    border-radius: 0 0 12px 12px;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .market-temp-bar {
                    height: 8px;
                    background: var(--color-surface);
                    border-radius: 4px;
                    overflow: hidden;
                    display: flex;
                    margin-bottom: 24px;
                }
                
                .temp-portion { height: 100%; transition: width 0.5s ease; }
                .temp-bear { background: #ef4444; }
                .temp-neutral { background: #cbd5e1; }
                .temp-bull { background: #22c55e; }

                .dimension-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 12px;
                }

                .dim-card {
                    padding: 12px;
                    border: 1px solid var(--color-border);
                    border-radius: 8px;
                    background: var(--color-surface);
                    font-size: 0.85rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .dim-status { font-weight: 700; }
                .dim-status.bullish { color: #22c55e; }
                .dim-status.bearish { color: #ef4444; }
                .dim-status.neutral { color: var(--color-text-secondary); }
            `;
            this.shadowRoot.appendChild(style);
        }

        createStructure() {
            const wrapper = document.createElement("div");
            wrapper.classList.add("wrapper");

            wrapper.innerHTML = `
                <div class="header">
                    <div id="viewTitle"></div>
                    <button class="back-btn" id="backBtn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        <span>Back</span>
                    </button>
                </div>
                
                <div class="mandala-grid-container">
                    <div class="mandala-grid" id="grid">
                        <!-- Grid Items injected here -->
                    </div>
                </div>

                <div class="detail-panel" id="detailPanel">
                    <div class="panel-header">
                        <h2 class="panel-title" id="panelTitle"></h2>
                        <button class="panel-close" id="closePanel">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <!-- Sentiment Controls (Injected Dynamically) -->
                    <div id="sentimentControls" class="sentiment-controls"></div>
                    <div class="panel-content" id="panelContent"></div>
                </div>

                <div class="dashboard" id="dashboard">
                    <!-- Dashboard Content Injected Here -->
                </div>
            `;

            this.shadowRoot.appendChild(wrapper);

            // Refs
            this.ui = {
                grid: this.shadowRoot.getElementById('grid'),
                backBtn: this.shadowRoot.getElementById('backBtn'),
                viewTitle: this.shadowRoot.getElementById('viewTitle'),
                detailPanel: this.shadowRoot.getElementById('detailPanel'),
                closePanel: this.shadowRoot.getElementById('closePanel'),
                panelTitle: this.shadowRoot.getElementById('panelTitle'),
                panelContent: this.shadowRoot.getElementById('panelContent'),
                sentimentControls: this.shadowRoot.getElementById('sentimentControls'),
                dashboard: this.shadowRoot.getElementById('dashboard')
            };
        }

        renderMacroView() {
            this.state.view = 'macro';
            this.state.activeFactorId = null;
            this.ui.backBtn.classList.remove('visible');
            this.ui.detailPanel.classList.remove('open');
            this.ui.viewTitle.textContent = this.data.core.title;

            this.ui.grid.innerHTML = ''; // Clear

            const centerCell = this.createCell(this.data.core, 'center');

            // Grid positions: 0-8
            const positionMap = {
                'NW': 0, 'N': 1, 'NE': 2,
                'W': 3, 'center': 4, 'E': 5,
                'SW': 6, 'S': 7, 'SE': 8
            };

            const gridItems = new Array(9).fill(null);
            gridItems[4] = centerCell;

            this.data.factors.forEach(factor => {
                const idx = positionMap[factor.position];
                if (idx !== undefined) {
                    const el = this.createCell(factor, 'factor');
                    el.onclick = () => this.renderMicroView(factor);
                    gridItems[idx] = el;
                }
            });

            gridItems.forEach(item => {
                this.ui.grid.appendChild(item || document.createElement('div'));
            });
        }

        renderMicroView(factor) {
            this.state.view = 'micro';
            this.state.activeFactorId = factor.id;
            this.ui.backBtn.classList.add('visible');
            this.ui.viewTitle.textContent = factor.title;
            this.ui.detailPanel.classList.remove('open'); // Close panel when changing factor

            this.ui.grid.innerHTML = ''; // Clear

            const centerCell = this.createCell(factor, 'center-micro');

            const positionMap = {
                'NW': 0, 'N': 1, 'NE': 2,
                'W': 3, 'center': 4, 'E': 5,
                'SW': 6, 'S': 7, 'SE': 8
            };

            const gridItems = new Array(9).fill(null);
            gridItems[4] = centerCell;

            if (factor.subFactors) {
                factor.subFactors.forEach(sub => {
                    const idx = positionMap[sub.position];
                    if (idx !== undefined) {
                        const el = this.createCell(sub, 'sub-factor');
                        el.onclick = () => this.openDetail(sub);
                        gridItems[idx] = el;
                    }
                });
            }

            gridItems.forEach(item => {
                this.ui.grid.appendChild(item || document.createElement('div'));
            });
        }

        createCell(data, type) {
            const el = document.createElement('div');
            el.className = 'cell';
            if (type === 'center' || type === 'center-micro') el.classList.add('center-node');

            // Apply custom accent colors from data if standard factor
            if (type === 'factor' && data.color) {
                // Subtle border or accent
                el.style.borderTop = `4px solid ${data.color}`;
            }

            el.innerHTML = `
                <div class="cell-title">${data.title}</div>
                ${data.focus ? `<div class="cell-focus">${data.focus}</div>` : ''}
                <div class="sentiment-dot" id="dot-${data.id}"></div>
            `;

            // Initial render visual update
            setTimeout(() => this.updateGridVisuals(), 0);

            return el;
        }

        updateGridVisuals() {
            // Update dots
            const dots = this.shadowRoot.querySelectorAll('.sentiment-dot');
            dots.forEach(dot => {
                const id = dot.id.replace('dot-', '');
                const sentiment = this.state.sentiment[id];
                dot.className = 'sentiment-dot'; // Reset
                if (sentiment === 'bull') dot.classList.add('bull');
                if (sentiment === 'bear') dot.classList.add('bear');
            });

            // Update Macro View Borders (if in macro view)
            if (this.state.view === 'macro') {
                const cells = this.shadowRoot.querySelectorAll('.cell');
                this.data.factors.forEach(factor => {
                    if (!factor.subFactors) return;

                    // Find cell for this factor
                    const cell = Array.from(cells).find(c => c.innerHTML.includes(factor.title));
                    if (!cell) return;

                    // Calculate net sentiment
                    let score = 0;
                    factor.subFactors.forEach(sub => {
                        const s = this.state.sentiment[sub.id];
                        if (s === 'bull') score++;
                        if (s === 'bear') score--;
                    });

                    cell.classList.remove('macro-bull', 'macro-bear');
                    if (score > 1) cell.classList.add('macro-bull');
                    if (score < -1) cell.classList.add('macro-bear');
                });
            }
        }

        openDetail(subFactor) {
            this.ui.panelTitle.textContent = subFactor.title;
            this.ui.panelContent.innerHTML = `
                <div class="content-body">
                    ${subFactor.content}
                </div>
            `;

            // Render Sentiment Controls
            const currentVal = this.state.sentiment[subFactor.id] || 'neutral';
            this.ui.sentimentControls.innerHTML = `
                <button class="sentiment-btn ${currentVal === 'bull' ? 'active bull' : ''}" data-val="bull">
                    <span>🚀</span> 看多 (Bullish)
                </button>
                <button class="sentiment-btn ${currentVal === 'neutral' ? 'active neutral' : ''}" data-val="neutral">
                    <span>😐</span> 中立 (Neutral)
                </button>
                <button class="sentiment-btn ${currentVal === 'bear' ? 'active bear' : ''}" data-val="bear">
                    <span>🔻</span> 看空 (Bearish)
                </button>
            `;

            // Bind events
            this.ui.sentimentControls.querySelectorAll('button').forEach(btn => {
                btn.onclick = (e) => {
                    const val = btn.dataset.val;
                    this.setSentiment(subFactor.id, val);
                    this.openDetail(subFactor); // Re-render controls to show active state
                };
            });

            this.ui.detailPanel.classList.add('open');

            // Smooth scroll to the panel
            setTimeout(() => {
                this.ui.detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }

        renderDashboard() {
            if (!this.data) return;

            let totalBulls = 0;
            let totalBears = 0;
            let totalNeutral = 0;

            // Dimension aggregation
            const dimHtml = this.data.factors.map(factor => {
                let dimScore = 0;
                let isRelevant = false;

                if (factor.subFactors) {
                    factor.subFactors.forEach(sub => {
                        const s = this.state.sentiment[sub.id];
                        if (s) isRelevant = true; // Has user input
                        if (s === 'bull') { dimScore++; totalBulls++; }
                        else if (s === 'bear') { dimScore--; totalBears++; }
                        else { totalNeutral++; }
                    });
                }

                let statusText = "中立";
                let statusClass = "neutral";
                if (dimScore > 0) { statusText = "看多"; statusClass = "bullish"; }
                if (dimScore < 0) { statusText = "看空"; statusClass = "bearish"; }

                return `
                    <div class="dim-card">
                        <span>${factor.title.split('. ')[1]}</span>
                        <span class="dim-status ${statusClass}">${statusText} (${dimScore})</span>
                    </div>
                `;
            }).join('');

            // Calculate Market Temp (0-100)
            const totalVotes = totalBulls + totalBears + totalNeutral;
            let tempParams = { bull: 33, neutral: 33, bear: 33 }; // Default view

            if (totalVotes > 0) {
                tempParams.bull = (totalBulls / totalVotes) * 100;
                tempParams.neutral = (totalNeutral / totalVotes) * 100;
                tempParams.bear = (totalBears / totalVotes) * 100;
            }

            this.ui.dashboard.innerHTML = `
                <div class="dashboard-header">
                    <h3>📊 市場情緒儀表板 (Market Dashboard)</h3>
                    <div style="font-size: 0.9rem; color: var(--color-text-secondary);">
                        多: <b>${totalBulls}</b> | 空: <b>${totalBears}</b> | 淨值: <b>${totalBulls - totalBears}</b>
                    </div>
                </div>
                
                <div class="market-temp-bar">
                    <div class="temp-portion temp-bear" style="width: ${tempParams.bear}%"></div>
                    <div class="temp-portion temp-neutral" style="width: ${tempParams.neutral}%"></div>
                    <div class="temp-portion temp-bull" style="width: ${tempParams.bull}%"></div>
                </div>

                <div class="dimension-grid">
                    ${dimHtml}
                </div>
                
                <div style="margin-top: 20px; text-align: right;">
                     <button id="resetStats" style="font-size: 0.85rem; padding: 6px 12px; cursor: pointer;">重置數據</button>
                </div>
            `;

            // Bind Reset
            const resetBtn = this.ui.dashboard.querySelector('#resetStats');
            if (resetBtn) {
                resetBtn.onclick = () => {
                    if (confirm('確定要清空所有情緒數據嗎？')) {
                        this.state.sentiment = {};
                        this.saveSentimentState();
                    }
                }
            }
        }

        closeDetail() {
            this.ui.detailPanel.classList.remove('open');
        }

        attachEvents() {
            this.ui.backBtn.addEventListener('click', () => {
                if (this.state.view === 'micro') {
                    this.renderMacroView();
                    this.updateGridVisuals(); // Re-apply macros visuals
                }
            });

            this.ui.closePanel.addEventListener('click', () => {
                this.closeDetail();
            });
        }
    }

    global.MandalaComponent = MandalaComponent;

})(window);
