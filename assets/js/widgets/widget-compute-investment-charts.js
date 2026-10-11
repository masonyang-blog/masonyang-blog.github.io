/**
 * AI Compute Infrastructure Investment Interactive Charts Widget
 * Encapsulated interactive Chart.js visualizations for AI Compute Infrastructure Investment.
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

    class ComputeInvestmentChartsWidget {
        constructor() {
            this._charts = new Map();
            this._shadowRoots = new Map();
            this._isDark = document.documentElement.classList.contains('dark');
            this._observer = null;
        }

        /**
         * Load Chart.js CDN asynchronously if not present
         */
        static loadChartJs() {
            if (window.Chart) return Promise.resolve();
            if (ComputeInvestmentChartsWidget._loaderPromise) return ComputeInvestmentChartsWidget._loaderPromise;

            ComputeInvestmentChartsWidget._loaderPromise = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load Chart.js CDN'));
                document.head.appendChild(script);
            });
            return ComputeInvestmentChartsWidget._loaderPromise;
        }

        /**
         * Initialize all charts present in document
         */
        async initAll() {
            try {
                await ComputeInvestmentChartsWidget.loadChartJs();
                this._initThemeObserver();
                this._configureChartDefaults();

                this.renderCapexStructure('#chart-compute-capex-structure');
                this.renderOpexBreakdown('#chart-compute-opex-breakdown');
                this.renderSensitivityModel('#chart-compute-sensitivity');
                this.renderPueEfficiency('#chart-compute-pue');
                this.renderDeadDepreciation('#chart-compute-dead-depreciation');
                this.renderRentalDecay('#chart-compute-rental-decay');
            } catch (err) {
                console.error('[ComputeInvestmentChartsWidget] Init error:', err);
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
            this._charts.forEach((chart) => {
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
                    --highlight-color: #06b6d4;
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
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                    overflow: hidden;
                    margin: 2rem 0;
                    transition: background 0.3s ease, border-color 0.3s ease;
                }
                .chart-header {
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid var(--card-border);
                }
                .chart-badge {
                    display: inline-block;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--highlight-color);
                    background: rgba(6, 182, 212, 0.1);
                    padding: 0.2rem 0.6rem;
                    border-radius: 9999px;
                    margin-bottom: 0.5rem;
                }
                .chart-title {
                    margin: 0;
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: var(--title-color);
                    line-height: 1.4;
                }
                .chart-desc {
                    margin: 0.35rem 0 0 0;
                    font-size: 0.85rem;
                    color: var(--desc-color);
                    line-height: 1.5;
                }
                .chart-body {
                    position: relative;
                    padding: 1.25rem;
                    min-height: 320px;
                    height: 360px;
                }
                .chart-footer {
                    padding: 0.85rem 1.5rem;
                    background: var(--footer-bg);
                    border-top: 1px solid var(--footer-border);
                    font-size: 0.8rem;
                    color: var(--footer-color);
                    line-height: 1.5;
                }
                canvas {
                    display: block;
                    width: 100% !important;
                    height: 100% !important;
                }
            `;
        }

        _createShadowContainer(targetEl, { badge, title, desc, footer, minHeight = 360 }) {
            const shadow = targetEl.attachShadow({ mode: 'closed' });
            this._shadowRoots.set(targetEl, shadow);

            const themeStyle = document.createElement('style');
            themeStyle.id = 'theme-vars';
            shadow.appendChild(themeStyle);
            this._applyThemeVars(shadow);

            const style = document.createElement('style');
            style.textContent = this._getCommonStyles();
            shadow.appendChild(style);

            const card = document.createElement('div');
            card.className = 'chart-card';

            const header = document.createElement('div');
            header.className = 'chart-header';
            header.innerHTML = `
                <div class="chart-badge">${badge}</div>
                <h3 class="chart-title">${title}</h3>
                <p class="chart-desc">${desc}</p>
            `;
            card.appendChild(header);

            const body = document.createElement('div');
            body.className = 'chart-body';
            body.style.height = `${minHeight}px`;

            const canvas = document.createElement('canvas');
            body.appendChild(canvas);
            card.appendChild(body);

            if (footer) {
                const foot = document.createElement('div');
                foot.className = 'chart-footer';
                foot.innerHTML = footer;
                card.appendChild(foot);
            }

            shadow.appendChild(card);
            return { canvas, shadow };
        }

        /**
         * Chart 1: 1,024 卡 H100 叢集 CapEx 資本支出結構 (Doughnut)
         */
        renderCapexStructure(target) {
            const el = typeof target === 'string' ? document.querySelector(target) : target;
            if (!el || this._charts.has(el)) return;

            const { canvas } = this._createShadowContainer(el, {
                badge: 'CapEx Allocation Breakdown',
                title: '標竿 1,024 卡 H100 運算叢集初始資本支出結構 (總計 $4,500 萬美元)',
                desc: '運算伺服器占據近 74% 資本，高帶寬 InfiniBand 無損網絡與 PB 級平行儲存構成無收斂叢集的必要支撐。',
                footer: '<strong>數據來源：</strong>NVIDIA HGX H100 採購基準與 1,024 卡無損網絡工程實務拆解（4年期直線折舊）。',
                minHeight: 330
            });

            const ctx = canvas.getContext('2d');
            const labels = ['運算伺服器 (128台 HGX)', '高帶寬網絡 (800G IB)', '平行儲存 (PB級 NVMe)', '機電配電 (CDU/PDU)', '系統工程整合'];
            const dataVals = [33.28, 5.85, 2.70, 1.80, 1.37]; // Millions

            const chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: dataVals,
                        backgroundColor: ['#06b6d4', '#0284c7', '#10b981', '#f59e0b', '#64748b'],
                        borderWidth: 2,
                        borderColor: this._isDark ? '#1e293b' : '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: this._isDark ? '#94a3b8' : '#475569',
                                font: { size: 11 },
                                boxWidth: 12
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const val = context.parsed;
                                    const pct = ((val / 45.0) * 100).toFixed(1);
                                    return ` $${val.toFixed(2)}M (${pct}%)`;
                                }
                            }
                        }
                    }
                }
            });

            this._charts.set(el, chart);
        }

        /**
         * Chart 2: 1,024 卡叢集年化 OpEx 營運成本拆解 (Bar)
         */
        renderOpexBreakdown(target) {
            const el = typeof target === 'string' ? document.querySelector(target) : target;
            if (!el || this._charts.has(el)) return;

            const { canvas } = this._createShadowContainer(el, {
                badge: 'Annual OpEx Structure',
                title: '年化營運成本拆解 (基準模型 $1,772 萬美元 / 年)',
                desc: '非現金剛性折舊佔總 OpEx 高達 63.49% ($1,125 萬美元)，電力託管為最大的現金支出項目 ($352 萬美元)。',
                footer: '<strong>成本性態：</strong>折舊為剛性沉沒會計成本；電力合約通常具備 1.5MW 連續需量保底條款 (Take-or-Pay)。',
                minHeight: 330
            });

            const ctx = canvas.getContext('2d');
            const labels = ['固定資產折舊', '電力與機房託管', '軟體授權維護', '現場運維 RMA', '網絡線路傳輸', '財產保險 G&A'];
            const dataVals = [11.25, 3.52, 0.96, 0.85, 0.72, 0.42]; // Millions

            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels.map(l => this._formatLabel(l, 14)),
                    datasets: [{
                        label: '年化金額 ($M)',
                        data: dataVals,
                        backgroundColor: ['#e11d48', '#06b6d4', '#10b981', '#f59e0b', '#0284c7', '#64748b'],
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const val = context.parsed.y;
                                    const pct = ((val / 17.72) * 100).toFixed(1);
                                    return ` $${val.toFixed(2)}M (${pct}%)`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: this._isDark ? '#94a3b8' : '#475569', font: { size: 10 } },
                            grid: { display: false }
                        },
                        y: {
                            ticks: {
                                color: this._isDark ? '#94a3b8' : '#475569',
                                callback: v => '$' + v + 'M'
                            },
                            grid: { color: this._isDark ? '#334155' : '#e2e8f0' },
                            title: { display: true, text: 'USD Millions', color: this._isDark ? '#94a3b8' : '#475569' }
                        }
                    }
                }
            });

            this._charts.set(el, chart);
        }

        /**
         * Chart 3: 稼動率敏感度模型：EBIT 與 4年期單卡 IRR 走勢 (Combo Bar + Line)
         */
        renderSensitivityModel(target) {
            const el = typeof target === 'string' ? document.querySelector(target) : target;
            if (!el || this._charts.has(el)) return;

            const { canvas } = this._createShadowContainer(el, {
                badge: 'Operating Leverage & Sensitivity',
                title: '稼動率敏感度模型：EBIT 營業利潤與 4 年期單卡稅後 IRR 走勢',
                desc: '70% 為損益平衡死線 (EBIT $0, IRR 3.9%)；85% 稼動率推升 IRR 至 17.6%，而低於 55% 則引發每月 $43 萬現金失血之死亡螺旋。',
                footer: '<strong>情境指引：</strong>綠色代表安全獲利區間，黃色為損益平衡防禦線，紅色代表流動性危機區間。',
                minHeight: 380
            });

            const ctx = canvas.getContext('2d');
            const labels = ['55% (流動性危機)', '60% (顯著虧損)', '70% (損益平衡)', '75% (防禦底線)', '85% (優質常態)', '95% (超載運作)'];
            const ebitVals = [-3.80, -2.53, 0.00, 1.27, 3.80, 6.33];
            const irrVals = [-8.0, -2.0, 3.9, 9.8, 17.6, 25.4];

            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            type: 'bar',
                            label: 'GAAP EBIT ($M)',
                            data: ebitVals,
                            backgroundColor: function(context) {
                                const val = context.dataset.data[context.dataIndex];
                                return val < 0 ? '#e11d48' : val === 0 ? '#f59e0b' : '#10b981';
                            },
                            borderRadius: 4,
                            yAxisID: 'y'
                        },
                        {
                            type: 'line',
                            label: '4年期單卡 IRR (%)',
                            data: irrVals,
                            borderColor: '#06b6d4',
                            backgroundColor: '#06b6d4',
                            borderWidth: 3,
                            pointRadius: 5,
                            pointBackgroundColor: '#06b6d4',
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { color: this._isDark ? '#94a3b8' : '#475569' }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    if (context.dataset.yAxisID === 'y1') {
                                        return ` IRR: ${context.parsed.y}%`;
                                    }
                                    return ` EBIT: $${context.parsed.y}M`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: this._isDark ? '#94a3b8' : '#475569' },
                            grid: { color: this._isDark ? '#334155' : '#e2e8f0' }
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            ticks: {
                                color: this._isDark ? '#94a3b8' : '#475569',
                                callback: v => '$' + v + 'M'
                            },
                            grid: { color: this._isDark ? '#334155' : '#e2e8f0' },
                            title: { display: true, text: 'GAAP EBIT ($M)', color: this._isDark ? '#94a3b8' : '#475569' }
                        },
                        y1: {
                            type: 'linear',
                            position: 'right',
                            ticks: {
                                color: '#06b6d4',
                                callback: v => v + '%'
                            },
                            grid: { drawOnChartArea: false },
                            title: { display: true, text: '4年期 IRR (%)', color: '#06b6d4' }
                        }
                    }
                }
            });

            this._charts.set(el, chart);
        }

        /**
         * Chart 4: PUE 能效等級與有效算力承載放大比率 (Horizontal Bar)
         */
        renderPueEfficiency(target) {
            const el = typeof target === 'string' ? document.querySelector(target) : target;
            if (!el || this._charts.has(el)) return;

            const { canvas } = this._createShadowContainer(el, {
                badge: 'Power & Thermal Moats',
                title: 'PUE 散熱能效躍遷：相同電網容量下有效算力承載放大比率',
                desc: 'Blackwell NVL72 單機架功耗飆至 120kW 逼退傳統風冷。DLC 液冷將 PUE 壓降至 1.15，等同將晶片承載規模放大近 18%。',
                footer: '<strong>工程乘數效應：</strong>PUE 每降低 0.1，數據中心每年節省數十萬美元度電開支，並大幅攤薄度電折舊。',
                minHeight: 280
            });

            const ctx = canvas.getContext('2d');
            const labels = ['傳統風冷 (PUE 1.50)', '過渡液冷 (PUE 1.35)', '標準 DLC (PUE 1.25)', '極致 DLC (PUE 1.15)'];
            const dataVals = [100, 111, 120, 130]; // %

            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '相對有效算力承載 (%)',
                        data: dataVals,
                        backgroundColor: ['#64748b', '#0284c7', '#06b6d4', '#10b981'],
                        borderRadius: 4
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
                                label: function(context) {
                                    return ` 相對算力承載: ${context.parsed.x}% (基準風冷=100%)`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: this._isDark ? '#94a3b8' : '#475569',
                                callback: v => v + '%'
                            },
                            grid: { color: this._isDark ? '#334155' : '#e2e8f0' },
                            min: 80,
                            max: 140
                        },
                        y: {
                            ticks: { color: this._isDark ? '#94a3b8' : '#475569' },
                            grid: { display: false }
                        }
                    }
                }
            });

            this._charts.set(el, chart);
        }

        /**
         * Chart 5: 通電延遲引爆之「無效折舊」累計減損趨勢 (Area Line)
         */
        renderDeadDepreciation(target) {
            const el = typeof target === 'string' ? document.querySelector(target) : target;
            if (!el || this._charts.has(el)) return;

            const { canvas } = this._createShadowContainer(el, {
                badge: 'Dead Depreciation Risk',
                title: '通電時間脫節 (Time-to-Power Mismatch)：無效折舊累計減損趨勢',
                desc: '晶片交付完成即啟動會計折舊鐘擺。電網若延遲 6 個月送電，將造成 $562.5 萬美元純會計損失並侵蝕 12.5% 資產總值。',
                footer: '<strong>風控防禦條款：</strong>嚴格在採購合約中簽訂 Delivery-upon-Power 與覆蓋每日 $3 萬美元折舊的清償損害賠償 (LDs)。',
                minHeight: 330
            });

            const ctx = canvas.getContext('2d');
            const labels = ['Day 0 (交付驗收)', '延遲 3 個月', '延遲 6 個月', '延遲 9 個月', '延遲 12 個月'];
            const dataVals = [0.00, -2.81, -5.63, -8.44, -11.25]; // $M

            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '無效折舊累計減損 ($M)',
                        data: dataVals,
                        borderColor: '#e11d48',
                        backgroundColor: 'rgba(225, 29, 72, 0.15)',
                        fill: true,
                        borderWidth: 3,
                        pointRadius: 6,
                        pointBackgroundColor: '#e11d48'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { color: this._isDark ? '#94a3b8' : '#475569' }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return ` 累計損失: $${Math.abs(context.parsed.y).toFixed(2)}M`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: this._isDark ? '#94a3b8' : '#475569' },
                            grid: { color: this._isDark ? '#334155' : '#e2e8f0' }
                        },
                        y: {
                            ticks: {
                                color: this._isDark ? '#94a3b8' : '#475569',
                                callback: v => '$' + v + 'M'
                            },
                            grid: { color: this._isDark ? '#334155' : '#e2e8f0' },
                            title: { display: true, text: 'USD Millions', color: this._isDark ? '#94a3b8' : '#475569' }
                        }
                    }
                }
            });

            this._charts.set(el, chart);
        }

        /**
         * Chart 6: H100 雲端現貨租金崩跌 vs Take-or-Pay 長約保護價 (Multi-Line)
         */
        renderRentalDecay(target) {
            const el = typeof target === 'string' ? document.querySelector(target) : target;
            if (!el || this._charts.has(el)) return;

            const { canvas } = this._createShadowContainer(el, {
                badge: 'Secondary Market Price Decay',
                title: 'H100 雲端現貨租金衰減 S 曲線 vs. Take-or-Pay 長約保護價',
                desc: '受 Blackwell 架構與產能普及衝擊，H100 現貨租金自 $8.00 跌向 $1.20；唯有 $2.82 長約保護與梯級移轉能抵禦資產減損。',
                footer: '<strong>ASC 360 減損觸發：</strong>當二手租金逼近電力成本底線 ($0.65) 時，缺乏長約的裸金屬資產將被迫提列一次性巨額減損。',
                minHeight: 330
            });

            const ctx = canvas.getContext('2d');
            const labels = ['2023 (緊缺高峰)', '2024 (基準長約)', '2025 (B200量產)', '2026 (現貨承壓)', '底線 (度電邊際成本)'];
            const spotVals = [8.00, 2.82, 2.00, 1.20, 0.65];
            const contractVals = [4.50, 2.82, 2.82, 2.82, 2.82];

            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'H100 雲端現貨租金 ($/GPU-hr)',
                            data: spotVals,
                            borderColor: '#f59e0b',
                            backgroundColor: '#f59e0b',
                            borderWidth: 2.5,
                            pointRadius: 5
                        },
                        {
                            label: 'Take-or-Pay 3年期長約保護價 ($/GPU-hr)',
                            data: contractVals,
                            borderColor: '#10b981',
                            backgroundColor: '#10b981',
                            borderDash: [5, 5],
                            borderWidth: 2.5,
                            pointRadius: 5
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { color: this._isDark ? '#94a3b8' : '#475569' }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return ` ${context.dataset.label}: $${context.parsed.y.toFixed(2)}/hr`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: this._isDark ? '#94a3b8' : '#475569' },
                            grid: { color: this._isDark ? '#334155' : '#e2e8f0' }
                        },
                        y: {
                            ticks: {
                                color: this._isDark ? '#94a3b8' : '#475569',
                                callback: v => '$' + v
                            },
                            grid: { color: this._isDark ? '#334155' : '#e2e8f0' },
                            title: { display: true, text: 'USD / GPU-hour', color: this._isDark ? '#94a3b8' : '#475569' }
                        }
                    }
                }
            });

            this._charts.set(el, chart);
        }
    }

    // Export to global scope
    global.ComputeInvestmentChartsWidget = ComputeInvestmentChartsWidget;

})(typeof window !== 'undefined' ? window : this);
