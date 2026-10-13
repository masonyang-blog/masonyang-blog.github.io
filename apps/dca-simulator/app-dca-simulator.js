/**
 * 情境式定投與回測模擬器 (Scenario-Based DCA & Backtesting Simulator)
 * 遵循 Shadow DOM (mode: closed) 規範開發
 */

(function (global) {
    'use strict';

    class DCASimulatorComponent {
        constructor(hostElement) {
            this.hostElement = hostElement;
            if (!this.hostElement) return;
            
            this.shadowRoot = this.hostElement.attachShadow({mode: 'closed'});
            this._config = { debug: false };
            this.klinesData = []; // { time, price, sma200, ath }
            this.chart = null;
            this.priceSeries = null;
            this.portfolioSeries = null;
        }

        init() {
            this.createStyles();
            this.createContent();
            this.attachEvents();
            this.fetchDataAndInit();
            return this;
        }

        createStyles() {
            const style = document.createElement('style');
            style.textContent = `
                :host { 
                    display: block; 
                    contain: content; 
                    font-family: 'Inter', 'Noto Sans TC', sans-serif;
                }
                /* 為了使用相同的設計系統，直接引入主站的樣式表 */
                @import url('../../assets/css/custom.css');
                
                .form-group { margin-bottom: 1rem; }
                .form-label { display: block; font-size: 0.875rem; font-weight: 500; color: #475569; margin-bottom: 0.5rem; }
                .form-select, .form-input { 
                    width: 100%; 
                    padding: 0.5rem 0.75rem; 
                    border-radius: 0.5rem; 
                    border: 1px solid #cbd5e1; 
                    background-color: #fff;
                    color: #0f172a;
                    font-size: 0.875rem;
                }
                .form-select:focus, .form-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 1px #3b82f6;
                }
                /* 深色模式適配 (繼承 body class 會比較難在 closed shadow DOM 抓到，所以用媒體查詢或 host-context) */
                :host-context(.dark) .form-label { color: #94a3b8; }
                :host-context(.dark) .form-select, :host-context(.dark) .form-input {
                    background-color: #1e293b;
                    border-color: #334155;
                    color: #f8fafc;
                }
                
                .stat-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 1rem;
                    padding: 1.5rem;
                }
                :host-context(.dark) .stat-card {
                    background: #1e293b;
                    border-color: #334155;
                }
                
                .chart-wrapper {
                    width: 100%;
                    height: 400px;
                    border-radius: 1rem;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                    background: #fff;
                }
                :host-context(.dark) .chart-wrapper {
                    border-color: #334155;
                    background: #0f172a;
                }
                
                .btn-primary {
                    background-color: #3b82f6;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    width: 100%;
                    transition: background-color 0.2s;
                    border: none;
                    cursor: pointer;
                }
                .btn-primary:hover { background-color: #2563eb; }
                .btn-primary:disabled { background-color: #94a3b8; cursor: not-allowed; }
                
                /* Layout & Typography Replacements for Tailwind */
                h3 { margin-top: 0; margin-bottom: 1.5rem; font-size: 1.125rem; font-weight: 700; color: #0f172a; }
                :host-context(.dark) h3 { color: #f1f5f9; }
                
                .layout-grid { display: flex; flex-direction: column; gap: 2rem; }
                @media (min-width: 1024px) {
                    .layout-grid { flex-direction: row; }
                    .control-panel { width: 33.333%; }
                    .data-panel { width: 66.666%; flex: 1; }
                }
                
                .panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
                :host-context(.dark) .panel { background: #1e293b; border-color: #334155; }
                
                .stats-grid { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }
                .stats-grid > div { flex: 1; min-width: 150px; }
                
                .text-sm { font-size: 0.875rem; }
                .text-2xl { font-size: 1.5rem; line-height: 2rem; }
                .font-medium { font-weight: 500; }
                .font-bold { font-weight: 700; }
                .mb-1 { margin-bottom: 0.25rem; }
                .mt-4 { margin-top: 1rem; }
                
                .text-slate-500 { color: #64748b; }
                .text-slate-900 { color: #0f172a; }
                :host-context(.dark) .text-slate-400 { color: #94a3b8; }
                :host-context(.dark) .text-slate-100 { color: #f1f5f9; }
                
                .text-emerald-500 { color: #10b981; }
                :host-context(.dark) .text-emerald-400 { color: #34d399; }
                .text-rose-500 { color: #f43f5e; }
                :host-context(.dark) .text-rose-400 { color: #fb7185; }
            `;
            this.shadowRoot.appendChild(style);
        }

        createContent() {
            this.container = document.createElement('div');
            this.container.innerHTML = `
                <div class="layout-grid">
                    <!-- 左側控制面板 -->
                    <div class="panel control-panel">
                        <h3>參數設定</h3>
                        
                        <div class="form-group">
                            <label class="form-label">投資標的 (MVP 僅限 BTC)</label>
                            <select id="asset" class="form-select" disabled>
                                <option value="BTCUSDT">Bitcoin (BTC)</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">定投頻率</label>
                            <select id="frequency" class="form-select">
                                <option value="1">每日 (Daily)</option>
                                <option value="7" selected>每週 (Weekly)</option>
                                <option value="30">每月 (Monthly)</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">單次扣款金額 (USD)</label>
                            <input type="number" id="amount" class="form-input" value="100" min="10" step="10">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">進場條件 (Strategy)</label>
                            <select id="strategy" class="form-select">
                                <option value="standard">無腦定期定額 (Standard DCA)</option>
                                <option value="sma200">跌破 200 日均線才買 (Below 200 SMA)</option>
                                <option value="dip20">較歷史高點回落 20% 才買 (Dip > 20%)</option>
                            </select>
                        </div>
                        
                        <button id="run-btn" class="btn-primary mt-4" disabled>資料載入中...</button>
                    </div>
                    
                    <!-- 右側數據與圖表 -->
                    <div class="data-panel">
                        <!-- 數據看板 -->
                        <div class="stats-grid">
                            <div class="stat-card">
                                <p class="text-sm font-medium text-slate-500 text-slate-400 mb-1">總投入本金</p>
                                <p class="text-2xl font-bold text-slate-900 text-slate-100" id="stat-invested">$0</p>
                            </div>
                            <div class="stat-card">
                                <p class="text-sm font-medium text-slate-500 text-slate-400 mb-1">當前總價值</p>
                                <p class="text-2xl font-bold text-slate-900 text-slate-100" id="stat-value">$0</p>
                            </div>
                            <div class="stat-card">
                                <p class="text-sm font-medium text-slate-500 text-slate-400 mb-1">總投資報酬率 (ROI)</p>
                                <p class="text-2xl font-bold" id="stat-roi">0%</p>
                            </div>
                        </div>
                        
                        <!-- 圖表區域 -->
                        <div class="chart-wrapper" id="chart-container"></div>
                    </div>
                </div>
            `;
            this.shadowRoot.appendChild(this.container);
        }

        attachEvents() {
            const runBtn = this.shadowRoot.getElementById('run-btn');
            runBtn.addEventListener('click', () => this.runSimulation());
            
            // 當表單改變時，自動重新計算
            const inputs = ['frequency', 'amount', 'strategy'];
            inputs.forEach(id => {
                this.shadowRoot.getElementById(id).addEventListener('change', () => {
                    if (this.klinesData.length > 0) this.runSimulation();
                });
            });
        }

        async fetchDataAndInit() {
            try {
                const btn = this.shadowRoot.getElementById('run-btn');
                btn.textContent = '獲取歷史數據中...';
                
                let rawData = null;
                
                // 嘗試 1: CryptoCompare API (穩定、有提供 High/Low、較無嚴格 CORS 阻擋)
                try {
                    const res1 = await fetch('https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=1000');
                    if (res1.ok) {
                        const json1 = await res1.json();
                        if (json1.Response === 'Success' && json1.Data && json1.Data.Data) {
                            rawData = json1.Data.Data.map(d => ({
                                time: d.time,
                                high: d.high,
                                close: d.close
                            }));
                        }
                    }
                } catch (e) {
                    console.warn("CryptoCompare API failed:", e);
                }
                
                // 嘗試 2: Yahoo Finance API (透過 allorigins CORS proxy 繞過加密貨幣網域阻擋)
                if (!rawData) {
                    try {
                        const yfUrl = encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/BTC-USD?interval=1d&range=3y');
                        const res2 = await fetch(`https://api.allorigins.win/raw?url=${yfUrl}`);
                        if (res2.ok) {
                            const json2 = await res2.json();
                            if (json2.chart && json2.chart.result && json2.chart.result[0]) {
                                const result = json2.chart.result[0];
                                const timestamps = result.timestamp;
                                const quotes = result.indicators.quote[0];
                                rawData = timestamps.map((t, i) => ({
                                    time: t,
                                    high: quotes.high[i] || quotes.close[i],
                                    close: quotes.close[i]
                                })).filter(d => d.close != null);
                            }
                        }
                    } catch (e) {
                        console.warn("Yahoo Finance API failed:", e);
                    }
                }

                // 嘗試 3: CoinGecko API (若第一種失敗則備援，無 High/Low 僅有 Close)
                if (!rawData) {
                    try {
                        const res3 = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1000&interval=daily');
                        if (res3.ok) {
                            const json3 = await res3.json();
                            if (json3.prices) {
                                rawData = json3.prices.map(d => ({
                                    time: Math.floor(d[0] / 1000 / 86400) * 86400,
                                    high: d[1],
                                    close: d[1]
                                }));
                            }
                        }
                    } catch (e) {
                        console.warn("CoinGecko API failed:", e);
                    }
                }
                
                // 嘗試 4: 終極防線 - 本地靜態備援資料 (Offline Fallback)
                if (!rawData && window.STATIC_BTC_DATA) {
                    console.log("Network blocked. Using offline fallback data.");
                    rawData = window.STATIC_BTC_DATA.map(d => ({
                        time: Math.floor(d[0] / 1000 / 86400) * 86400,
                        high: d[1],
                        close: d[1]
                    }));
                }
                
                if (!rawData) {
                    throw new Error("All data APIs failed to load or were blocked by the browser.");
                }
                
                let currentAth = 0;
                let closePrices = [];
                let lastTime = 0;
                this.klinesData = [];
                
                rawData.forEach(d => {
                    const time = d.time;
                    const close = d.close;
                    const high = d.high;
                    
                    // 防呆：過濾同一天的重複資料
                    if (time <= lastTime) return;
                    lastTime = time;
                    
                    if (high > currentAth) currentAth = high;
                    closePrices.push(close);
                    
                    // 計算 200 SMA
                    let sma200 = null;
                    if (closePrices.length >= 200) {
                        const sum = closePrices.slice(-200).reduce((a, b) => a + b, 0);
                        sma200 = sum / 200;
                    }
                    
                    this.klinesData.push({ time, price: close, ath: currentAth, sma200 });
                });
                
                this.initChart();
                
                btn.textContent = '開始回測';
                btn.disabled = false;
                
                // 初次載入自動執行
                this.runSimulation();
                
            } catch (error) {
                console.error("Failed to fetch klines or init chart:", error);
                const btn = this.shadowRoot.getElementById('run-btn');
                if (error instanceof ReferenceError) {
                    btn.textContent = '圖表核心庫載入失敗 (請檢查網路)';
                } else {
                    btn.textContent = '資料載入失敗 (請檢查網路或關閉擋廣告擴充)';
                }
                btn.style.backgroundColor = '#ef4444'; // 紅色警示
            }
        }

        initChart() {
            const chartContainer = this.shadowRoot.getElementById('chart-container');
            const isDark = document.documentElement.classList.contains('dark');
            
            const chartOptions = {
                layout: {
                    background: { type: 'solid', color: 'transparent' },
                    textColor: isDark ? '#94a3b8' : '#475569',
                },
                grid: {
                    vertLines: { color: isDark ? '#334155' : '#e2e8f0' },
                    horzLines: { color: isDark ? '#334155' : '#e2e8f0' },
                },
                rightPriceScale: {
                    borderVisible: false,
                },
                timeScale: {
                    borderVisible: false,
                },
                crosshair: {
                    mode: 1,
                }
            };

            this.chart = LightweightCharts.createChart(chartContainer, chartOptions);
            
            // Asset Price Series
            this.priceSeries = this.chart.addLineSeries({
                color: '#3b82f6',
                lineWidth: 2,
                title: 'BTC 價格'
            });
            
            // Portfolio Value Series
            this.portfolioSeries = this.chart.addAreaSeries({
                lineColor: '#10b981',
                topColor: 'rgba(16, 185, 129, 0.4)',
                bottomColor: 'rgba(16, 185, 129, 0.0)',
                lineWidth: 2,
                title: '投資組合價值 ($)'
            });
            
            // 設定價格序列資料
            const lineData = this.klinesData.map(d => ({ time: d.time, value: d.price }));
            this.priceSeries.setData(lineData);
            
            // 處理視窗縮放
            window.addEventListener('resize', () => {
                this.chart.applyOptions({
                    width: chartContainer.clientWidth,
                });
            });
        }

        runSimulation() {
            if (!this.klinesData || this.klinesData.length === 0) return;
            
            const frequency = parseInt(this.shadowRoot.getElementById('frequency').value);
            const amount = parseFloat(this.shadowRoot.getElementById('amount').value);
            const strategy = this.shadowRoot.getElementById('strategy').value;
            
            let totalInvested = 0;
            let totalCoins = 0;
            let daysSinceLastBuy = 0;
            
            const portfolioData = [];
            
            this.klinesData.forEach((day, index) => {
                let shouldBuy = false;
                
                // 檢查頻率
                if (daysSinceLastBuy >= frequency || index === 0) {
                    // 檢查策略條件
                    if (strategy === 'standard') {
                        shouldBuy = true;
                    } else if (strategy === 'sma200') {
                        shouldBuy = day.sma200 !== null && day.price < day.sma200;
                    } else if (strategy === 'dip20') {
                        shouldBuy = day.price < day.ath * 0.8;
                    }
                }
                
                if (shouldBuy) {
                    totalInvested += amount;
                    totalCoins += amount / day.price;
                    daysSinceLastBuy = 1;
                } else {
                    daysSinceLastBuy++;
                }
                
                const currentValue = totalCoins * day.price;
                portfolioData.push({ time: day.time, value: currentValue });
            });
            
            // 更新圖表
            this.portfolioSeries.setData(portfolioData);
            this.chart.timeScale().fitContent();
            
            // 更新數據看板
            const finalValue = totalCoins * this.klinesData[this.klinesData.length - 1].price;
            const roi = totalInvested > 0 ? ((finalValue - totalInvested) / totalInvested) * 100 : 0;
            
            this.shadowRoot.getElementById('stat-invested').textContent = `$${totalInvested.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            this.shadowRoot.getElementById('stat-value').textContent = `$${finalValue.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
            
            const roiEl = this.shadowRoot.getElementById('stat-roi');
            roiEl.textContent = `${roi.toFixed(2)}%`;
            if (roi >= 0) {
                roiEl.className = 'text-2xl font-bold text-emerald-500 text-emerald-400';
            } else {
                roiEl.className = 'text-2xl font-bold text-rose-500 text-rose-400';
            }
        }
    }

    global.DCASimulatorComponent = DCASimulatorComponent;
})(window);
