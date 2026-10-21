/**
 * AI Compute Data Center Financial Charts Widget
 * Encapsulated interactive Chart.js visualizations for AI Data Center Financial Model.
 * 
 * Features:
 * - Shadow DOM (mode: 'closed') style & DOM isolation.
 * - Dynamic asynchronous Chart.js loader.
 * - Theme-aware styling (Light/Dark mode auto-switch via MutationObserver).
 * - High-density responsive Canvas rendering.
 * - Zero-build architecture adhering to Mason Yang Blog Dev Standards.
 */
(function (global) {
    'use strict';

    class DatacenterChartsWidget {
        constructor() {
            this._charts = new Map();
            this._shadowRoots = new Map();
            this._isDark = document.documentElement.classList.contains('dark');
            this._observer = null;
            this._chartJsLoaded = false;
        }

        /**
         * Load Chart.js CDN asynchronously
         */
        static loadChartJs() {
            if (window.Chart) return Promise.resolve();
            if (DatacenterChartsWidget._loaderPromise) return DatacenterChartsWidget._loaderPromise;

            DatacenterChartsWidget._loaderPromise = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
                script.async = true;
                script.onload = () => {
                    resolve();
                };
                script.onerror = () => reject(new Error('Failed to load Chart.js CDN'));
                document.head.appendChild(script);
            });
            return DatacenterChartsWidget._loaderPromise;
        }

        /**
         * Initialize all charts present in document
         */
        async initAll() {
            try {
                await DatacenterChartsWidget.loadChartJs();
                this._initThemeObserver();
                this._configureChartDefaults();

                this.renderHardwarePricing('#chart-hardware-pricing');
                this.renderTcoBreakdown('#chart-tco-breakdown');
                this.renderFinancialReturns('#chart-financial-returns');
                this.renderSensitivityAnalysis('#chart-sensitivity-analysis');
            } catch (err) {
                console.error('[DatacenterChartsWidget] Init error:', err);
            }
            return this;
        }

        _initThemeObserver() {
            if (this._observer) return;
            this._observer = new MutationObserver(() => {
                const isNowDark = document.documentElement.classList.contains('dark');
                if (isNowDark !== this._isDark) {
                    this._isDark = isNowDark;
                    this._configureChartDefaults();
                    this._updateAllChartsTheme();
                }
            });
            this._observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class']
            });
        }

        _configureChartDefaults() {
            if (!window.Chart) return;
            Chart.defaults.color = this._isDark ? '#94a3b8' : '#475569';
            Chart.defaults.font.family = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif';
        }

        _updateAllChartsTheme() {
            this._charts.forEach((chart, key) => {
                const gridColor = this._isDark ? '#334155' : '#e2e8f0';
                if (chart.options.scales) {
                    Object.keys(chart.options.scales).forEach(scaleKey => {
                        const scale = chart.options.scales[scaleKey];
                        if (scale.grid) {
                            scale.grid.color = gridColor;
                        }
                    });
                }
                chart.update();
            });

            // Update Shadow DOM custom properties
            this._shadowRoots.forEach(shadow => {
                this._applyThemeVars(shadow);
            });
        }

        _applyThemeVars(shadow) {
            const hostStyle = shadow.querySelector('style#theme-vars');
            const vars = this._isDark ? `
                :host {
                    --card-bg: #1e293b;
                    --card-border: #334155;
                    --title-color: #f8fafc;
                    --desc-color: #94a3b8;
                    --footer-bg: rgba(15, 23, 42, 0.6);
                    --footer-border: rgba(51, 65, 85, 0.6);
                    --footer-color: #cbd5e1;
                    --highlight-color: #22d3ee;
                    --grid-line: #334155;
                }
            ` : `
                :host {
                    --card-bg: #ffffff;
                    --card-border: #e2e8f0;
                    --title-color: #0f172a;
                    --desc-color: #64748b;
                    --footer-bg: #f8fafc;
                    --footer-border: #e2e8f0;
                    --footer-color: #334155;
                    --highlight-color: #0891b2;
                    --grid-line: #e2e8f0;
                }
            `;
            if (hostStyle) {
                hostStyle.textContent = vars;
            }
        }

        _formatLabel(str, maxLen = 16) {
            if (typeof str !== 'string') return str;
            if (str.length <= maxLen) return str;
            const words = str.split(' ');
            const lines = [];
            let currentLine = '';

            words.forEach(word => {
                if ((currentLine + word).length > maxLen) {
                    if (currentLine.trim().length > 0) lines.push(currentLine.trim());
                    currentLine = word + ' ';
                } else {
                    currentLine += word + ' ';
                }
            });
            if (currentLine.trim().length > 0) lines.push(currentLine.trim());
            return lines;
        }

        _getCommonStyles() {
            return `
                :host {
                    display: block;
                    width: 100%;
                    box-sizing: border-box;
                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif;
                }
                *, *::before, *::after {
                    box-sizing: border-box;
                }
                .chart-card {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
                    margin: 1.5rem 0;
                    transition: border-color 0.2s ease, background 0.2s ease;
                }
                .chart-header {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    margin-bottom: 1.25rem;
                }
                .header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                .chart-title {
                    font-size: 1.0625rem;
                    font-weight: 700;
                    color: var(--title-color);
                    margin: 0;
                }
                .badge {
                    font-size: 0.6875rem;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                    padding: 0.2rem 0.6rem;
                    border-radius: 9999px;
                    background: rgba(6, 182, 212, 0.12);
                    color: var(--highlight-color);
                    border: 1px solid rgba(6, 182, 212, 0.3);
                    font-weight: 600;
                }
                .chart-desc {
                    font-size: 0.8125rem;
                    color: var(--desc-color);
                    margin: 0;
                    line-height: 1.5;
                }
                .canvas-wrapper {
                    position: relative;
                    width: 100%;
                    height: 340px;
                }
                .chart-footer {
                    margin-top: 1.25rem;
                    padding: 0.75rem 1rem;
                    background: var(--footer-bg);
                    border: 1px solid var(--footer-border);
                    border-radius: 0.625rem;
                    font-size: 0.75rem;
                    color: var(--footer-color);
                    line-height: 1.6;
                }
                .highlight-text {
                    font-weight: 700;
                    color: var(--highlight-color);
                }
                .grid-2col {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }
                @media (min-width: 992px) {
                    .grid-2col {
                        grid-template-columns: 1fr 1fr;
                    }
                }
            `;
        }

        _createShadowContainer(hostElement) {
            const container = document.createElement('div');
            container.className = 'dc-chart-host-wrapper';
            hostElement.innerHTML = '';
            hostElement.appendChild(container);

            const shadow = container.attachShadow({ mode: 'closed' });
            
            const themeStyle = document.createElement('style');
            themeStyle.id = 'theme-vars';
            shadow.appendChild(themeStyle);
            this._applyThemeVars(shadow);

            const commonStyle = document.createElement('style');
            commonStyle.textContent = this._getCommonStyles();
            shadow.appendChild(commonStyle);

            return shadow;
        }

        /**
         * Chart 1: Hardware Price Comparison (H2 2)
         */
        renderHardwarePricing(targetSelector) {
            const host = document.querySelector(targetSelector);
            if (!host) return;

            const shadow = this._createShadowContainer(host);
            this._shadowRoots.set('hardwarePricing', shadow);

            const card = document.createElement('div');
            card.className = 'chart-card';
            card.innerHTML = `
                <div class="chart-header">
                    <div class="header-top">
                        <h3 class="chart-title">主流 GPU 每小時隨選租金對比 ($/GPU-hr)</h3>
                        <span class="badge">Neocloud vs Hyperscaler</span>
                    </div>
                    <p class="chart-desc">對比專業 AI 算力雲 (Neocloud) 與超大規模雲端巨頭 (Hyperscaler) 隨選牌價之結構性階梯落差。</p>
                </div>
                <div class="canvas-wrapper">
                    <canvas id="hardwarePriceCanvas"></canvas>
                </div>
                <div class="chart-footer">
                    <span class="highlight-text">數據解析：</span>
                    H100 價格已由 2023 高點回落至 $2.00-$3.50 區間；H200 憑藉 141GB HBM3e 顯存有效降低跨節點通訊延遲，租金表現抗跌；Blackwell 世代（B200/GB200）則因 CoWoS 產能稀缺維持高度溢價。
                </div>
            `;
            shadow.appendChild(card);

            const ctx = shadow.getElementById('hardwarePriceCanvas').getContext('2d');
            const labels = [
                'NVIDIA H100 SXM5 (80GB)',
                'NVIDIA H200 SXM5 (141GB)',
                'NVIDIA B200 SXM6 (192GB)',
                'NVIDIA GB200 NVL72 (單卡等效)'
            ].map(l => this._formatLabel(l, 18));

            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'AI 算力雲隨選價 (Neocloud $/hr)',
                            data: [2.75, 3.82, 5.75, 12.92],
                            backgroundColor: '#06b6d4',
                            borderRadius: 6
                        },
                        {
                            label: '超級雲端商隨選牌價 (Hyperscaler $/hr)',
                            data: [6.95, 7.65, 9.75, 16.50],
                            backgroundColor: '#8b5cf6',
                            borderRadius: 6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top', labels: { boxWidth: 12 } },
                        tooltip: {
                            callbacks: {
                                title: (items) => {
                                    const raw = items[0].chart.data.labels[items[0].dataIndex];
                                    return Array.isArray(raw) ? raw.join(' ') : raw;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: '美元 / GPU 小時 ($/GPU-hr)' },
                            grid: { color: this._isDark ? '#334155' : '#e2e8f0' }
                        },
                        x: { grid: { display: false } }
                    }
                }
            });
            this._charts.set('hardwarePricing', chart);
        }

        /**
         * Chart 2 & 3: TCO Breakdown (CapEx Donut + OpEx Stacked Bar) (H2 3)
         */
        renderTcoBreakdown(targetSelector) {
            const host = document.querySelector(targetSelector);
            if (!host) return;

            const shadow = this._createShadowContainer(host);
            this._shadowRoots.set('tcoBreakdown', shadow);

            const wrapper = document.createElement('div');
            wrapper.className = 'grid-2col';
            wrapper.innerHTML = `
                <!-- CapEx Donut -->
                <div class="chart-card">
                    <div class="chart-header">
                        <div class="header-top">
                            <h3 class="chart-title">資本支出 (CapEx) 構成 — 總額 $4,500 萬美元</h3>
                            <span class="badge">單卡 ~$43,945</span>
                        </div>
                        <p class="chart-desc">1,024 卡 H100 叢集之運算節點、高速 InfiniBand 網路與儲存配電開支占比。</p>
                    </div>
                    <div class="canvas-wrapper">
                        <canvas id="capexCanvas"></canvas>
                    </div>
                    <div class="chart-footer">
                        <span class="highlight-text">關鍵洞察：</span>
                        GPU 伺服器主體占 79.6% ($35.84M)；400G NDR InfiniBand 雙層 Fat-Tree 網路占 14.4% ($6.5M)，光模組與線纜採購額常超越交換機本體。
                    </div>
                </div>

                <!-- OpEx Stacked Bar -->
                <div class="chart-card">
                    <div class="chart-header">
                        <div class="header-top">
                            <h3 class="chart-title">年度運營支出 (OpEx) 構成 — 年化 $1,772 萬美元</h3>
                            <span class="badge">含非現金折舊</span>
                        </div>
                        <p class="chart-desc">折舊攤銷佔比超過六成，高壓電力託管與軟體維運構成主要剛性現金負擔。</p>
                    </div>
                    <div class="canvas-wrapper">
                        <canvas id="opexCanvas"></canvas>
                    </div>
                    <div class="chart-footer">
                        <span class="highlight-text">關鍵洞察：</span>
                        4 年直線折舊年化達 $11.25M (63.5%)，折合每月 $93.75 萬美元。通電後每天一睜眼即面臨超過 3 萬美元的剛性折舊侵蝕。
                    </div>
                </div>
            `;
            shadow.appendChild(wrapper);

            // CapEx Chart
            const ctxCapEx = shadow.getElementById('capexCanvas').getContext('2d');
            const capexLabels = [
                'GPU 運算節點伺服器 (128台 8卡HGX)',
                '極速網路互聯 (NDR 400G IB / 光模組)',
                '高密度機櫃配電與 NVMe 儲存層'
            ].map(l => this._formatLabel(l, 18));

            const capexChart = new Chart(ctxCapEx, {
                type: 'doughnut',
                data: {
                    labels: capexLabels,
                    datasets: [{
                        data: [35.84, 6.50, 2.66],
                        backgroundColor: ['#06b6d4', '#8b5cf6', '#10b981'],
                        borderWidth: 2,
                        borderColor: this._isDark ? '#1e293b' : '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
                        tooltip: {
                            callbacks: {
                                title: (items) => {
                                    const raw = items[0].chart.data.labels[items[0].dataIndex];
                                    return Array.isArray(raw) ? raw.join(' ') : raw;
                                },
                                label: (ctx) => {
                                    const val = ctx.raw;
                                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                    const pct = ((val / total) * 100).toFixed(1);
                                    return ` $${val}M 美元 (${pct}%)`;
                                }
                            }
                        }
                    },
                    cutout: '65%'
                }
            });
            this._charts.set('capexChart', capexChart);

            // OpEx Chart
            const ctxOpEx = shadow.getElementById('opexCanvas').getContext('2d');
            const opexChart = new Chart(ctxOpEx, {
                type: 'bar',
                data: {
                    labels: ['1,024卡 叢集年度 OpEx 結構'],
                    datasets: [
                        { label: '設備直線折舊攤銷 (4年期)', data: [11.25], backgroundColor: '#f43f5e' },
                        { label: '機房空間與電力託管合約', data: [3.37], backgroundColor: '#06b6d4' },
                        { label: '軟體授權與備品維護', data: [1.35], backgroundColor: '#8b5cf6' },
                        { label: '動態電力消耗 (PUE 1.2)', data: [0.95], backgroundColor: '#10b981' },
                        { label: 'SRE 專用工程運維人力', data: [0.80], backgroundColor: '#f59e0b' }
                    ]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } },
                        tooltip: {
                            callbacks: {
                                title: (items) => {
                                    const raw = items[0].chart.data.labels[items[0].dataIndex];
                                    return Array.isArray(raw) ? raw.join(' ') : raw;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: true,
                            title: { display: true, text: '年度金額 (百萬美元 $M)' },
                            grid: { color: this._isDark ? '#334155' : '#e2e8f0' }
                        },
                        y: { stacked: true, grid: { display: false } }
                    }
                }
            });
            this._charts.set('opexChart', opexChart);
        }

        /**
         * Chart 4: Financial Returns & Breakeven (H2 4)
         */
        renderFinancialReturns(targetSelector) {
            const host = document.querySelector(targetSelector);
            if (!host) return;

            const shadow = this._createShadowContainer(host);
            this._shadowRoots.set('financialReturns', shadow);

            const card = document.createElement('div');
            card.className = 'chart-card';
            card.innerHTML = `
                <div class="chart-header">
                    <div class="header-top">
                        <h3 class="chart-title">不同租金與稼動率下之 EBITDA 與現金回收期</h3>
                        <span class="badge">70% Breakeven 拐點</span>
                    </div>
                    <p class="chart-desc">1,024 卡 H100 叢集在 $2.00, $2.50, $3.00/hr 租金情境之收益模擬（柱狀：EBITDA，折線：回收期）。</p>
                </div>
                <div class="canvas-wrapper">
                    <canvas id="financialReturnsCanvas"></canvas>
                </div>
                <div class="chart-footer">
                    <span class="highlight-text">財務分水嶺：</span>
                    稼動率自 55% 爬升至 70%，年度 EBITDA 由 $5.97M 暴增 54.4% 至 $9.22M，現金回收期由 7.53 年驟降至 4.88 年。70% 稼動率為算力中心覆蓋折舊與融資利息的生死線。
                </div>
            `;
            shadow.appendChild(card);

            const ctx = shadow.getElementById('financialReturnsCanvas').getContext('2d');
            const returnLabels = ['55% 稼動率 (低迷)', '70% 稼動率 (盈虧平衡門檻)', '85% 稼動率 (優良)'];

            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: returnLabels,
                    datasets: [
                        {
                            type: 'bar',
                            label: 'EBITDA - $2.00/hr (百萬美元)',
                            data: [3.51, 6.08, 8.66],
                            backgroundColor: 'rgba(100, 116, 139, 0.45)',
                            borderRadius: 4
                        },
                        {
                            type: 'bar',
                            label: 'EBITDA - $2.50/hr 基準 (百萬美元)',
                            data: [5.97, 9.22, 12.47],
                            backgroundColor: '#06b6d4',
                            borderRadius: 4
                        },
                        {
                            type: 'bar',
                            label: 'EBITDA - $3.00/hr (百萬美元)',
                            data: [8.44, 12.36, 16.28],
                            backgroundColor: '#8b5cf6',
                            borderRadius: 4
                        },
                        {
                            type: 'line',
                            label: '現金回收期 - $2.50/hr (年)',
                            data: [7.53, 4.88, 3.61],
                            borderColor: '#f59e0b',
                            backgroundColor: '#f59e0b',
                            borderWidth: 3,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top', labels: { boxWidth: 12 } },
                        tooltip: {
                            callbacks: {
                                title: (items) => {
                                    const raw = items[0].chart.data.labels[items[0].dataIndex];
                                    return Array.isArray(raw) ? raw.join(' ') : raw;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: '年度 EBITDA (百萬美元 $M)' },
                            grid: { color: this._isDark ? '#334155' : '#e2e8f0' }
                        },
                        y1: {
                            position: 'right',
                            title: { display: true, text: '現金回收期 (年)' },
                            grid: { display: false },
                            min: 0,
                            max: 10
                        },
                        x: { grid: { display: false } }
                    }
                }
            });
            this._charts.set('financialReturns', chart);
        }

        /**
         * Chart 5: Sensitivity Analysis (H2 6)
         */
        renderSensitivityAnalysis(targetSelector) {
            const host = document.querySelector(targetSelector);
            if (!host) return;

            const shadow = this._createShadowContainer(host);
            this._shadowRoots.set('sensitivityAnalysis', shadow);

            const card = document.createElement('div');
            card.className = 'chart-card';
            card.innerHTML = `
                <div class="chart-header">
                    <div class="header-top">
                        <h3 class="chart-title">四大運營風險因子利潤侵蝕敏感度排行</h3>
                        <span class="badge">Risk Impact Radar</span>
                    </div>
                    <p class="chart-desc">衡量電價攀升、空置率上揚、租金價格戰與通電延遲對年度現金流的實質衝擊（金額愈負代表侵蝕愈劇烈）。</p>
                </div>
                <div class="canvas-wrapper">
                    <canvas id="sensitivityCanvas"></canvas>
                </div>
                <div class="chart-footer">
                    <span class="highlight-text">風險排序：</span>
                    租金價格下跌 20% (-$3.14M) 與通電延遲無效折舊 (-$2.49M) 是最具破壞性的利潤殺手；電價波動 (-$47.5 萬) 相較之下多可藉由電力直通協議 (Pass-through) 化解。
                </div>
            `;
            shadow.appendChild(card);

            const ctx = shadow.getElementById('sensitivityCanvas').getContext('2d');
            const sensLabels = [
                '電價上漲 50% ($0.08 -> $0.12/kWh)',
                '稼動率下滑 10% (80% -> 70% @ $2.50)',
                'H100 租金下跌 20% ($2.50 -> $2.00 @ 70%U)',
                '通電延遲 3 個月 (B200叢集無效折舊)'
            ].map(l => this._formatLabel(l, 20));

            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sensLabels,
                    datasets: [{
                        label: '年度利潤侵蝕金額 (萬美元)',
                        data: [-47.5, -224.3, -314.0, -249.0],
                        backgroundColor: ['#f59e0b', '#f43f5e', '#e11d48', '#881337'],
                        borderRadius: 6
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                title: (items) => {
                                    const raw = items[0].chart.data.labels[items[0].dataIndex];
                                    return Array.isArray(raw) ? raw.join(' ') : raw;
                                },
                                label: (ctx) => ` 年化利潤侵蝕: $${Math.abs(ctx.raw)} 萬美元`
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: { display: true, text: '利潤衝擊 (萬美元 $K)' },
                            grid: { color: this._isDark ? '#334155' : '#e2e8f0' }
                        },
                        y: { grid: { display: false } }
                    }
                }
            });
            this._charts.set('sensitivityAnalysis', chart);
        }
    }

    // Expose to global scope
    global.DatacenterChartsWidget = DatacenterChartsWidget;

})(typeof window !== 'undefined' ? window : this);
