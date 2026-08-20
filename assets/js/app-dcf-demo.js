/**
 * 雙軌制動態 DCF 估值計算機組件 - Shadow DOM 封裝
 * @class DcfDemoComponent
 * @description 實現正向折現與數值逼近反推雙向估值，支援一鍵匯入科技巨頭參數、蒙地卡羅機率分佈與 CSP 產能檢驗對比。
 */
(function (global) {
    "use strict";

    class DcfDemoComponent {
        constructor(hostElement) {
            this.hostElement = hostElement || document.querySelector('#dcf-demo-host');
            if (!this.hostElement) {
                console.warn('DcfDemoComponent: Host element not found.');
                return;
            }
            this.shadowRoot = this.hostElement.attachShadow({ mode: "closed" });

            this._config = { debug: false };

            // 預設科技股參數池 (靜態備用)
            this._presets = {
                NVDA: { name: "NVIDIA (NVDA) 算力霸主", fcf0: 55000, shares: 2450, netCash: 25000, marketPrice: 130.0, wacc: 0.10, cagr: 0.30, termGrowth: 0.03, exitMultiple: 35, useExitMultiple: false, cspCap: 0.35 },
                AAPL: { name: "Apple (AAPL) 終端生態", fcf0: 105000, shares: 15200, netCash: -5000, marketPrice: 220.0, wacc: 0.085, cagr: 0.08, termGrowth: 0.02, exitMultiple: 25, useExitMultiple: false, cspCap: 0.20 },
                MSFT: { name: "Microsoft (MSFT) 雲端帝國", fcf0: 74000, shares: 7430, netCash: 15000, marketPrice: 420.0, wacc: 0.09, cagr: 0.16, termGrowth: 0.025, exitMultiple: 30, useExitMultiple: false, cspCap: 0.30 },
                TSLA: { name: "Tesla (TSLA) 自駕算力", fcf0: 12000, shares: 3180, netCash: 20000, marketPrice: 250.0, wacc: 0.11, cagr: 0.25, termGrowth: 0.035, exitMultiple: 40, useExitMultiple: true, cspCap: 0.40 }
            };

            // 自動化數據源覆蓋機制 (SSOT Registry)
            if (global.DCF_AUTOMATED_PRESETS && global.DCF_AUTOMATED_PRESETS.presets) {
                if (this._config.debug) console.log("DcfDemoComponent: 成功載入自動化財報口徑", global.DCF_AUTOMATED_PRESETS.updatedAt);
                for (let key in global.DCF_AUTOMATED_PRESETS.presets) {
                    if (this._presets[key]) {
                        this._presets[key] = { ...this._presets[key], ...global.DCF_AUTOMATED_PRESETS.presets[key] };
                    }
                }
            }

            // 載入本地存儲之自訂口徑池
            this.loadCustomPresets();

            // 初始狀態以 NVDA 最新口徑為起點
            const nvdaPreset = this._presets.NVDA;
            this._state = {
                activeSymbol: "NVDA",
                updatedAt: (global.DCF_AUTOMATED_PRESETS && global.DCF_AUTOMATED_PRESETS.updatedAt) ? global.DCF_AUTOMATED_PRESETS.updatedAt : "手動基準值 (未連線)",
                fcf0: nvdaPreset.fcf0,
                shares: nvdaPreset.shares,
                netCash: nvdaPreset.netCash,
                marketPrice: nvdaPreset.marketPrice,
                wacc: nvdaPreset.wacc,
                cagr: nvdaPreset.cagr,
                termGrowth: nvdaPreset.termGrowth,
                exitMultiple: nvdaPreset.exitMultiple,
                useExitMultiple: nvdaPreset.useExitMultiple,
                cspCap: nvdaPreset.cspCap || 0.35,
                
                forwardIntrinsic: 0,
                impliedCagr: nvdaPreset.cagr,
                simulationResults: []
            };

            this._debounceTimer = null;
        }

        init() {
            if (this._config.debug) console.log("DcfDemoComponent: Initializing...");
            this.createStyles();
            this.createContent();
            this.renderPresetButtons();
            this.calculateAll();
            return this;
        }

        // ================= 本地存儲與自訂口徑中樞 =================

        loadCustomPresets() {
            try {
                const saved = localStorage.getItem('mason_dcf_custom_presets');
                if (saved) {
                    const customs = JSON.parse(saved);
                    for (let key in customs) {
                        this._presets[key] = { ...customs[key], isCustom: true };
                    }
                }
            } catch (e) {
                console.warn('DcfDemoComponent: Failed to load custom presets from localStorage.', e);
            }
        }

        saveCustomPreset(symbol, name, fcf0, shares, netCash, marketPrice) {
            symbol = symbol.toUpperCase().trim();
            if (!symbol) return false;

            const newPreset = {
                name: name || `${symbol} 自訂動態口徑`,
                fcf0: parseFloat(fcf0) || 0,
                shares: parseFloat(shares) || 0,
                netCash: parseFloat(netCash) || 0,
                marketPrice: parseFloat(marketPrice) || 0,
                wacc: 0.10,
                cagr: 0.20,
                termGrowth: 0.03,
                exitMultiple: 30,
                useExitMultiple: false,
                cspCap: 0.35,
                isCustom: true
            };

            this._presets[symbol] = newPreset;

            try {
                const customs = {};
                for (let key in this._presets) {
                    if (this._presets[key].isCustom) {
                        customs[key] = this._presets[key];
                    }
                }
                localStorage.setItem('mason_dcf_custom_presets', JSON.stringify(customs));
            } catch (e) {
                console.warn('DcfDemoComponent: Failed to save custom preset to localStorage.', e);
            }

            this.renderPresetButtons();
            this.loadPreset(symbol);
            return true;
        }

        deleteCustomPreset(symbol) {
            if (this._presets[symbol] && this._presets[symbol].isCustom) {
                delete this._presets[symbol];
                try {
                    const customs = {};
                    for (let key in this._presets) {
                        if (this._presets[key].isCustom) {
                            customs[key] = this._presets[key];
                        }
                    }
                    localStorage.setItem('mason_dcf_custom_presets', JSON.stringify(customs));
                } catch (e) {
                    console.warn('DcfDemoComponent: Failed to delete custom preset in localStorage.', e);
                }
                this.renderPresetButtons();
                if (this._state.activeSymbol === symbol) {
                    this.loadPreset('NVDA');
                }
            }
        }

        renderPresetButtons() {
            const container = this.shadowRoot.querySelector('#preset-buttons-container');
            if (!container) return;

            const html = Object.keys(this._presets).map(key => {
                const isCustom = this._presets[key].isCustom;
                const dotColor = isCustom ? 'bg-amber-400' : 'bg-emerald-400';
                const delBtn = isCustom ? `<span class="btn-del-custom" data-del="${key}" title="刪除自訂口徑">x</span>` : '';
                return `
                    <div class="preset-btn-group relative inline-flex items-center">
                        <button type="button" data-preset="${key}" class="tv-btn-preset px-3 py-1.5 text-xs font-mono font-bold rounded flex items-center gap-1.5 transition-all mr-1.5 mb-1.5">
                            <span class="w-1.5 h-1.5 rounded-full ${dotColor} inline-block"></span>
                            ${key}
                        </button>
                        ${delBtn}
                    </div>
                `;
            }).join('');

            container.innerHTML = html;

            const presetBtns = this.shadowRoot.querySelectorAll('.tv-btn-preset');
            presetBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.getAttribute('data-preset');
                    this.loadPreset(key);
                });
            });

            const delBtns = this.shadowRoot.querySelectorAll('.btn-del-custom');
            delBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const key = btn.getAttribute('data-del');
                    this.deleteCustomPreset(key);
                });
            });

            this.updatePresetButtonsUI();
        }

        updatePresetButtonsUI() {
            const activeKey = this._state.activeSymbol;
            const presetBtns = this.shadowRoot.querySelectorAll('.tv-btn-preset');
            presetBtns.forEach(btn => {
                const key = btn.getAttribute('data-preset');
                const isCustom = this._presets[key] && this._presets[key].isCustom;
                if (key === activeKey) {
                    btn.className = `tv-btn-preset px-3 py-1.5 text-xs font-mono font-bold rounded flex items-center gap-1.5 transition-all text-white shadow mr-1.5 mb-1.5 ${isCustom ? 'bg-amber-600 border border-amber-400' : 'bg-blue-600 border border-blue-400'}`;
                } else {
                    btn.className = `tv-btn-preset px-3 py-1.5 text-xs font-mono font-bold rounded flex items-center gap-1.5 transition-all bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white mr-1.5 mb-1.5`;
                }
            });
        }

        // ================= 核心數學演算法引擎 =================

        /**
         * 執行正向估值試算
         */
        calcForwardValuation(cagrVal) {
            const { fcf0, shares, netCash, wacc, termGrowth, exitMultiple, useExitMultiple } = this._state;
            const g = cagrVal !== undefined ? cagrVal : this._state.cagr;

            let pv = 0;
            let currentFcf = fcf0;
            
            // 5 年高速期折現
            for (let t = 1; t <= 5; t++) {
                currentFcf = currentFcf * (1 + g);
                pv += currentFcf / Math.pow(1 + wacc, t);
            }

            // 終值計算
            let terminalValue = 0;
            if (useExitMultiple) {
                terminalValue = currentFcf * exitMultiple;
            } else {
                terminalValue = (currentFcf * (1 + termGrowth)) / (wacc - termGrowth);
            }

            const pvTerminal = terminalValue / Math.pow(1 + wacc, 5);
            const enterpriseValue = pv + pvTerminal;
            const equityValue = enterpriseValue + netCash;
            const perShare = equityValue / shares;

            return {
                perShare: Math.max(0, perShare),
                enterpriseValue: enterpriseValue,
                fcf5: currentFcf
            };
        }

        /**
         * 執行二分法反向求解器 (Bisection Solver)
         */
        solveImpliedCagr() {
            const targetPrice = this._state.marketPrice;
            let low = -0.50; // -50%
            let high = 1.50; // +150%
            let mid = 0.0;
            let iter = 0;
            const maxIter = 100;
            const tolerance = 0.01;

            while (iter < maxIter) {
                mid = (low + high) / 2.0;
                const result = this.calcForwardValuation(mid);
                const diff = result.perShare - targetPrice;

                if (Math.abs(diff) < tolerance) {
                    break;
                }
                if (diff < 0) {
                    low = mid; // 增長率不足，提高下界
                } else {
                    high = mid; // 增長率過高，降低上界
                }
                iter++;
            }

            return mid;
        }

        /**
         * 執行蒙地卡羅隨機波動模擬
         */
        runMonteCarloSimulation() {
            const iterations = 1000;
            const results = [];
            const baseCagr = this._state.cagr;
            const baseWacc = this._state.wacc;

            // Box-Muller 轉換生成常態分佈隨機數
            const randNormal = (mean, stddev) => {
                let u = 1 - Math.random();
                let v = Math.random();
                let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
                return z * stddev + mean;
            };

            for (let i = 0; i < iterations; i++) {
                // CAGR 波動 stddev=5%，WACC 波動 stddev=0.5%
                const simCagr = Math.max(-0.20, randNormal(baseCagr, 0.05));
                const simWacc = Math.max(0.05, randNormal(baseWacc, 0.005));

                // 暫存修改狀態進行單次試算
                const origWacc = this._state.wacc;
                this._state.wacc = simWacc;
                const val = this._state.shares > 0 ? this.calcForwardValuation(simCagr).perShare : 0;
                this._state.wacc = origWacc;

                results.push(val);
            }

            this._state.simulationResults = results.sort((a, b) => a - b);
            this.renderHistogram();
        }

        // ================= 運算與渲染排程 =================

        calculateAll() {
            const forwardRes = this.calcForwardValuation();
            this._state.forwardIntrinsic = forwardRes.perShare;
            this._state.fcf5Cache = forwardRes.fcf5;
            this._state.evCache = forwardRes.enterpriseValue;
            this._state.impliedCagr = this.solveImpliedCagr();

            this.updateUI();
        }

        formatMoney(val) {
            return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        formatPercent(val) {
            return (val * 100).toFixed(2) + '%';
        }

        updateUI() {
            if (!this.container) return;

            // 1. 同步頂部標的即時看板 (Active Symbol Banner)
            const bannerSymbol = this.shadowRoot.querySelector('#banner-symbol');
            const bannerName = this.shadowRoot.querySelector('#banner-name');
            const inputMarket = this.shadowRoot.querySelector('#input-market');
            const inputFcf0 = this.shadowRoot.querySelector('#input-fcf0');
            const inputShares = this.shadowRoot.querySelector('#input-shares');
            const inputNetcash = this.shadowRoot.querySelector('#input-netcash');

            const activeKey = this._state.activeSymbol || "NVDA";
            const presetData = this._presets[activeKey] || this._presets.NVDA;

            if (bannerSymbol) bannerSymbol.textContent = activeKey;
            if (bannerName) bannerName.textContent = presetData.name;
            
            if (inputMarket && document.activeElement !== inputMarket) inputMarket.value = this._state.marketPrice;
            if (inputFcf0 && document.activeElement !== inputFcf0) inputFcf0.value = this._state.fcf0;
            if (inputShares && document.activeElement !== inputShares) inputShares.value = this._state.shares;
            if (inputNetcash && document.activeElement !== inputNetcash) inputNetcash.value = this._state.netCash;

            // 2. 同步一鍵匯入按鈕高光樣式
            this.updatePresetButtonsUI();

            const fVal = this._state.forwardIntrinsic;
            const mPrice = this._state.marketPrice;
            const diffPct = ((mPrice - fVal) / fVal) * 100;

            // 更新數值卡片
            const fValEl = this.shadowRoot.querySelector('#forward-val');
            const mPriceEl = this.shadowRoot.querySelector('#market-price-val');
            const diffEl = this.shadowRoot.querySelector('#valuation-diff');
            const badgeEl = this.shadowRoot.querySelector('#valuation-badge');
            const impCagrEl = this.shadowRoot.querySelector('#implied-cagr-val');

            if (fValEl) fValEl.textContent = this.formatMoney(fVal);
            if (mPriceEl) mPriceEl.textContent = this.formatMoney(mPrice);
            if (impCagrEl) impCagrEl.textContent = this.formatPercent(this._state.impliedCagr);

            if (diffEl && badgeEl) {
                let badgeHtml = '';
                if (diffPct > 30) {
                    diffEl.textContent = `溢價 +${diffPct.toFixed(1)}% (定價偏高)`;
                    diffEl.className = "text-xs font-bold text-red-500 dark:text-red-400";
                    badgeHtml = `<span class="px-2.5 py-1 text-xs font-bold rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800">⚠️ 泡沫高估預警</span>`;
                } else if (diffPct < -20) {
                    diffEl.textContent = `折價 ${diffPct.toFixed(1)}% (極度低估)`;
                    diffEl.className = "text-xs font-bold text-emerald-500 dark:text-emerald-400";
                    badgeHtml = `<span class="px-2.5 py-1 text-xs font-bold rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">💎 安全邊際極佳</span>`;
                } else {
                    diffEl.textContent = `公允貼合 (${diffPct > 0 ? '+':''}${diffPct.toFixed(1)}%)`;
                    diffEl.className = "text-xs font-bold text-slate-600 dark:text-slate-400";
                    badgeHtml = `<span class="px-2.5 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800">⚖️ 估值處於合理區間</span>`;
                }
                badgeEl.innerHTML = badgeHtml;
            }

            // 更新 Slider 即時顯示值
            const waccText = this.shadowRoot.querySelector('#wacc-text');
            const cagrText = this.shadowRoot.querySelector('#cagr-text');
            const termText = this.shadowRoot.querySelector('#term-text');
            const multText = this.shadowRoot.querySelector('#mult-text');

            if (waccText) waccText.textContent = this.formatPercent(this._state.wacc);
            if (cagrText) cagrText.textContent = this.formatPercent(this._state.cagr);
            if (termText) termText.textContent = this.formatPercent(this._state.termGrowth);
            if (multText) multText.textContent = `${this._state.exitMultiple}x`;

            // 更新產能檢驗對比條
            this.updateCspBar();
        }

        updateCspBar() {
            const bar = this.shadowRoot.querySelector('#csp-fill');
            const label = this.shadowRoot.querySelector('#csp-status');
            const inputCap = this.shadowRoot.querySelector('#input-csp-cap');
            if (!bar || !label) return;

            const implied = this._state.impliedCagr * 100;
            const threshold = (this._state.cspCap || 0.35) * 100;
            if (inputCap && !inputCap.matches(':focus')) {
                inputCap.value = Math.round(threshold);
            }

            // 以 threshold * 1.5 作為進度條 100% 的滿格標準公式 (最低不小於 30%)
            const maxCap = Math.max(30, threshold * 1.5);
            const pct = Math.min(100, Math.max(0, (implied / maxCap) * 100));

            bar.style.width = `${pct}%`;
            if (implied > threshold) {
                bar.className = "h-full bg-red-600 dark:bg-red-500 transition-all duration-300";
                label.textContent = `隱含增長率 (${implied.toFixed(1)}%) 已突破設定之產能擴張物理極限 (${threshold.toFixed(0)}%)，需求端存在下修考驗！`;
                label.className = "text-xs font-semibold text-red-600 dark:text-red-400";
            } else {
                bar.className = "h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300";
                label.textContent = `隱含增長率 (${implied.toFixed(1)}%) 處於算力產能指引可支撐之安全範圍 (${threshold.toFixed(0)}%) 內。`;
                label.className = "text-xs font-semibold text-emerald-600 dark:text-emerald-400";
            }
        }

        renderHistogram() {
            const canvas = this.shadowRoot.querySelector('#mc-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            const res = this._state.simulationResults;
            if (res.length === 0) return;

            const min = res[0];
            const max = res[res.length - 1];
            const binsCount = 30;
            const binWidth = (max - min) / binsCount;
            const bins = new Array(binsCount).fill(0);

            res.forEach(val => {
                let idx = Math.floor((val - min) / binWidth);
                if (idx >= binsCount) idx = binsCount - 1;
                if (idx < 0) idx = 0;
                bins[idx]++;
            });

            const maxBinFreq = Math.max(...bins);
            const currentPrice = this._state.marketPrice;

            // 繪製直方圖
            const barWidth = width / binsCount;
            for (let i = 0; i < binsCount; i++) {
                const binVal = min + i * binWidth;
                const barHeight = (bins[i] / maxBinFreq) * (height * 0.8);
                const x = i * barWidth;
                const y = height - barHeight;

                // 根據與市場即時股價的比較給予色彩
                if (binVal < currentPrice * 0.85) {
                    ctx.fillStyle = '#10b981'; // 綠色：極度低估區
                } else if (binVal > currentPrice * 1.25) {
                    ctx.fillStyle = '#ef4444'; // 紅色：泡沫高估區
                } else {
                    ctx.fillStyle = '#3b82f6'; // 藍色：合理估值區
                }

                ctx.fillRect(x, y, barWidth - 2, barHeight);
            }

            // 繪製當前股價虛線錨點
            const priceX = ((currentPrice - min) / (max - min)) * width;
            if (priceX >= 0 && priceX <= width) {
                ctx.beginPath();
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = '#f97316'; // 橘色警戒線
                ctx.lineWidth = 2;
                ctx.moveTo(priceX, 0);
                ctx.lineTo(priceX, height);
                ctx.stroke();
                ctx.setLineDash([]);

                ctx.fillStyle = '#f97316';
                ctx.font = 'bold 11px Inter';
                ctx.fillText(`當前股價 $${currentPrice}`, priceX + 5, 20);
            }
        }

        // ================= 介面架構與樣式 =================

        createStyles() {
            const style = document.createElement("style");
            style.textContent = `
                @import url("https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css");
                
                :host {
                    display: block;
                    width: 100%;
                    font-family: 'Inter', 'Noto Sans TC', sans-serif;
                }

                /* 專業硬體工程卡片美學：杜絕圓潤，專注硬核邊框 */
                .dcf-wrapper {
                    background-color: #0f172a; /* slate-900 */
                    color: #f8fafc;            /* slate-50 */
                    border: 1px solid #334155; /* slate-700 */
                }

                .tv-card {
                    background-color: #1e293b; /* slate-800 */
                    border: 1px solid #334155;
                    border-radius: 4px;
                }

                .tv-input-box {
                    background-color: #0f172a;
                    border: 1px solid #475569;
                    color: #f1f5f9;
                    border-radius: 2px;
                    outline: none;
                }
                .tv-input-box:focus {
                    border-color: #f97316;
                    box-shadow: 0 0 0 1px #f97316;
                }

                /* 頂部財務中樞輸入框專屬硬核樣式 */
                .banner-input {
                    background-color: #0f172a !important; /* 極深岩灰 */
                    border: 1px solid #334155 !important;
                    border-radius: 4px !important;
                    padding-top: 0.25rem;
                    padding-bottom: 0.25rem;
                    outline: none;
                    width: 100%;
                    font-family: monospace;
                    font-size: 1.125rem;
                    transition: all 0.2s;
                }
                .banner-input:focus {
                    border-color: #3b82f6 !important;
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
                }
                #input-market { color: #f97316 !important; font-weight: 800 !important; } /* 高光橙 */
                #input-fcf0 { color: #34d399 !important; font-weight: 800 !important; }   /* 翡翠綠 */
                #input-shares { color: #60a5fa !important; font-weight: 800 !important; } /* 科技藍 */
                #input-netcash { color: #c084fc !important; font-weight: 800 !important; } /* 霓虹紫 */
                
                #input-csp-cap::-webkit-outer-spin-button,
                #input-csp-cap::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                #input-csp-cap {
                    -moz-appearance: textfield;
                    appearance: textfield;
                    background-color: #0f172a !important; /* 極深岩灰 */
                    color: #fbbf24 !important; /* 琥珀金 */
                    border: 1px solid #475569 !important;
                    border-radius: 4px !important;
                    color-scheme: dark;
                }
                #input-csp-cap:focus {
                    border-color: #f97316 !important;
                    box-shadow: 0 0 0 1px #f97316 !important;
                }

                .tv-slider {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 6px;
                    background: #334155;
                    border-radius: 2px;
                    outline: none;
                }
                .tv-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: #f97316;
                    border-radius: 2px;
                    cursor: pointer;
                    transition: background .15s ease-in-out;
                }
                .tv-slider::-webkit-slider-thumb:hover {
                    background: #ea580c;
                }

                .tv-btn {
                    background-color: #2563eb;
                    color: #ffffff;
                    font-weight: 600;
                    border-radius: 2px;
                    transition: all 0.2s;
                }
                .tv-btn:hover {
                    background-color: #1d4ed8;
                }

                .tv-btn-preset {
                    background-color: #1e293b;
                    color: #cbd5e1;
                    border: 1px solid #475569;
                    border-radius: 2px;
                    transition: all 0.2s;
                }
                .tv-btn-preset:hover, .tv-btn-preset.active {
                    background-color: #334155;
                    color: #ffffff;
                    border-color: #64748b;
                }

                /* 自訂口徑 Modal 與按鈕群樣式 */
                .modal-backdrop {
                    background-color: rgba(15, 23, 42, 0.85); /* 85% opacity slate-900 */
                    backdrop-filter: blur(4px);
                }
                .modal-card {
                    background-color: #1e293b; /* slate-800 */
                    border: 1px solid #3b82f6; /* blue-500 highlight border */
                }
                .modal-input {
                    width: 100%;
                    background-color: #0f172a;
                    border: 1px solid #475569;
                    color: #f8fafc;
                    border-radius: 4px;
                    padding: 0.5rem 0.75rem;
                    outline: none;
                    transition: border 0.2s;
                }
                .modal-input:focus {
                    border-color: #f97316;
                    box-shadow: 0 0 0 1px #f97316;
                }
                .btn-del-custom {
                    position: absolute;
                    top: -6px;
                    right: 0px;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background-color: #ef4444;
                    color: white;
                    font-size: 9px;
                    line-height: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .preset-btn-group:hover .btn-del-custom {
                    opacity: 1;
                }
            `;
            this.shadowRoot.appendChild(style);
        }

        createContent() {
            const container = document.createElement("div");
            container.className = "dcf-wrapper p-6 rounded-lg shadow-2xl space-y-6";

            // 建立一鍵匯入按鈕
            const presetButtons = Object.keys(this._presets).map(key => `
                <button type="button" data-preset="${key}" class="tv-btn-preset px-3 py-1.5 text-xs font-mono font-bold rounded flex items-center gap-1.5 transition-all">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                    ${key}
                </button>
            `).join('');

            container.innerHTML = `
                <!-- 頂部標題列 -->
                <div class="border-b border-slate-700 pb-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <h2 class="text-xl font-bold tracking-tight text-white font-mono font-noto">Mason Yang 觀察｜動態雙軌制 DCF 估值計算機 (v2.5 旗艦版)</h2>
                        <span class="px-2 py-0.5 text-xs font-mono bg-blue-900/80 text-blue-300 border border-blue-700 rounded">Zero-Build Engine</span>
                    </div>
                </div>

                <!-- 頂部標的即時資訊看板 (Active Symbol Banner) -->
                <div id="active-symbol-banner" class="bg-slate-900 border border-slate-700 p-6 rounded-lg shadow-inner space-y-5">
                    <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-700/80 pb-4 gap-4">
                        <div class="flex items-center gap-4">
                            <div id="banner-symbol" class="px-3.5 py-2 bg-blue-600 text-white font-mono text-2xl font-extrabold rounded tracking-wider shadow">
                                ${this._state.activeSymbol}
                            </div>
                            <div>
                                <h2 id="banner-name" class="text-xl font-bold text-white tracking-tight">${this._presets[this._state.activeSymbol].name}</h2>
                                <div class="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                    <span class="font-mono text-orange-400">● 數據同步:</span>
                                    <span id="banner-updated" class="font-mono">${this._state.updatedAt}</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-xs font-mono font-bold text-slate-300 mr-1">一鍵載入基準口徑:</span>
                            <div id="preset-buttons-container" class="flex items-center flex-wrap pt-1">
                                <!-- 動態按鈕列容器 -->
                            </div>
                            <button type="button" id="btn-open-custom" class="px-3 py-1.5 text-xs font-mono font-bold rounded flex items-center gap-1 transition-all border border-amber-500/50 text-amber-400 bg-amber-950/30 hover:bg-amber-900/50 mb-1.5">
                                [+ 新增自訂]
                            </button>
                        </div>
                    </div>

                    <!-- 財務指標手動輸入與回顯卡片群 (4 欄) -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                        <div class="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded shadow-sm focus-within:border-blue-500 transition-all">
                            <label for="input-market" class="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1.5">1. 最新收盤定價 ($/股)</label>
                            <div class="relative flex items-center font-mono">
                                <span class="absolute left-3 text-slate-400 font-bold">$</span>
                                <input type="number" id="input-market" value="${this._state.marketPrice}" step="0.5" class="banner-input pl-7 pr-2">
                            </div>
                        </div>

                        <div class="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded shadow-sm focus-within:border-emerald-500 transition-all">
                            <label for="input-fcf0" class="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1.5">2. TTM 自由現金流 ($M)</label>
                            <div class="relative flex items-center font-mono">
                                <span class="absolute left-3 text-slate-400 font-bold">$</span>
                                <input type="number" id="input-fcf0" value="${this._state.fcf0}" class="banner-input pl-7 pr-2">
                            </div>
                        </div>

                        <div class="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded shadow-sm focus-within:border-blue-500 transition-all">
                            <label for="input-shares" class="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1.5">3. 總流通發行股數 ($M)</label>
                            <input type="number" id="input-shares" value="${this._state.shares}" class="banner-input px-3">
                        </div>

                        <div class="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded shadow-sm focus-within:border-purple-500 transition-all">
                            <label for="input-netcash" class="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1.5">4. 淨現金 / 總債務 ($M)</label>
                            <div class="relative flex items-center font-mono">
                                <span class="absolute left-3 text-slate-400 font-bold">$</span>
                                <input type="number" id="input-netcash" value="${this._state.netCash}" class="banner-input pl-7 pr-2">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 主控面板與雙向回顯區 -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                    
                    <!-- 左側主控滑桿與基本面輸入 (5 欄) -->
                    <div class="lg:col-span-5 tv-card p-5 space-y-6">
                        <div class="border-b border-slate-700 pb-3 flex justify-between items-center">
                            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-300">深水炸彈動態參數控制台</h3>
                            <button id="btn-reset" class="text-xs text-slate-400 hover:text-white underline">還原預設</button>
                        </div>

                        <!-- 深水炸彈 1: WACC -->
                        <div class="space-y-2">
                            <div class="flex justify-between text-xs tracking-wide">
                                <span class="font-bold text-slate-200 uppercase">1. 折現率 WACC (分母蒸發效應)</span>
                                <span id="wacc-text" class="font-mono text-orange-500 font-bold">10.00%</span>
                            </div>
                            <input type="range" id="slider-wacc" min="0.06" max="0.16" step="0.005" value="${this._state.wacc}" class="tv-slider">
                            <p class="text-xs leading-relaxed text-slate-400/90 pt-1.5 border-t border-slate-700/50 mt-1.5">折現率微升 1%，經過 5 年高次複利折現，估值直接蒸發 15%~20%。反映聯準會貨幣重力場與市場風險溢酬對資產定價的非線性打擊。</p>
                        </div>

                        <!-- 增長率 CAGR -->
                        <div class="space-y-2">
                            <div class="flex justify-between text-xs tracking-wide">
                                <span class="font-bold text-slate-200 uppercase">2. 第一階段自由現金流 CAGR</span>
                                <span id="cagr-text" class="font-mono text-orange-500 font-bold">30.00%</span>
                            </div>
                            <input type="range" id="slider-cagr" min="-0.20" max="1.00" step="0.01" value="${this._state.cagr}" class="tv-slider">
                            <p class="text-xs leading-relaxed text-slate-400/90 pt-1.5 border-t border-slate-700/50 mt-1.5">反映未來 5 年企業自由現金流的擴張斜率。這是檢驗算力壟斷、終端滲透率與 AI 營收轉化能力的絕對試金石。</p>
                        </div>

                        <!-- 終值模式與退出倍數 -->
                        <div class="border-t border-slate-700 pt-5 space-y-4">
                            <div class="flex justify-between items-center text-xs tracking-wide">
                                <span class="font-bold text-slate-200 uppercase">3. 終值計算開關 (長尾轉型風險)</span>
                                <label class="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-bold">
                                    <input type="checkbox" id="toggle-mult" ${this._state.useExitMultiple ? 'checked':''} class="rounded bg-slate-900 border-slate-700 text-blue-600">
                                    <span>切換為退出乘數法</span>
                                </label>
                            </div>

                            <div id="box-term" class="${this._state.useExitMultiple ? 'hidden':''} space-y-2 pt-1">
                                <div class="flex justify-between text-xs tracking-wide">
                                    <span class="text-slate-300 font-bold uppercase">永續成長率 (Terminal Growth)</span>
                                    <span id="term-text" class="font-mono text-blue-400 font-bold">3.00%</span>
                                </div>
                                <input type="range" id="slider-term" min="0.01" max="0.05" step="0.005" value="${this._state.termGrowth}" class="tv-slider">
                                <p class="text-xs leading-relaxed text-slate-400/90 pt-1.5 border-t border-slate-700/50 mt-1.5">假設企業在第 5 年後邁入穩態現金牛時期的長期成長極限。通常不可高於 GDP 長期增速 (2%~3.5%)，否則違反物理規律。</p>
                            </div>

                            <div id="box-mult" class="${!this._state.useExitMultiple ? 'hidden':''} space-y-2 pt-1">
                                <div class="flex justify-between text-xs tracking-wide">
                                    <span class="text-slate-300 font-bold uppercase">退出乘數 (Exit Multiple EV/FCF)</span>
                                    <span id="mult-text" class="font-mono text-blue-400 font-bold">35x</span>
                                </div>
                                <input type="range" id="slider-mult" min="10" max="60" step="1" value="${this._state.exitMultiple}" class="tv-slider">
                                <p class="text-xs leading-relaxed text-slate-400/90 pt-1.5 border-t border-slate-700/50 mt-1.5">假設重資本支出週期在第 5 年結束時的市場乘數共識。用於壓力測試當半導體或硬體景氣反轉時，終值雪崩的長尾風險。</p>
                            </div>
                        </div>

                    </div>

                    <!-- 右側雙軌回顯與驗證面板 (7 欄) -->
                    <div class="lg:col-span-7 space-y-6">
                        
                        <!-- 雙軌卡片並排 -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            <!-- 正向公允估值卡片 -->
                            <div class="tv-card p-5 border-l-4 border-blue-500 relative overflow-hidden flex flex-col justify-between">
                                <div>
                                    <div class="text-xs uppercase font-bold text-slate-400 tracking-wider">軌道一：正向試算合理內在價值</div>
                                    <div class="mt-2 text-3xl font-mono font-bold text-white tracking-tight" id="forward-val">$128.15</div>
                                    <div class="mt-2 flex items-center justify-between">
                                        <span id="valuation-diff" class="text-xs font-bold text-slate-400">公允貼合 (-1.4%)</span>
                                        <span id="valuation-badge"></span>
                                    </div>
                                </div>
                                <div class="mt-5 pt-3 border-t border-slate-700/60 text-xs text-slate-300 leading-relaxed font-mono">
                                    基於設定的 CAGR 與 WACC 折現出未來 5 年每一塊錢的現金流真實淨值。
                                </div>
                            </div>

                            <!-- 反向反推隱含成長率卡片 -->
                            <div class="tv-card p-5 border-l-4 border-orange-500 relative overflow-hidden flex flex-col justify-between">
                                <div>
                                    <div class="text-xs uppercase font-bold text-slate-400 tracking-wider">軌道二：反推定價隱含 FCF 成長率</div>
                                    <div class="mt-2 text-3xl font-mono font-bold text-orange-500 tracking-tight" id="implied-cagr-val">30.42%</div>
                                    <div class="mt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
                                        <span>市場定價錨定: <strong id="market-price-val" class="text-white">$130.00</strong></span>
                                        <span class="px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800 text-[11px]">Bisection Solver</span>
                                    </div>
                                </div>
                                <div class="mt-5 pt-3 border-t border-slate-700/60 text-xs text-slate-300 leading-relaxed font-mono">
                                    逆向推導：市場目前的股價正定價該企業未來 5 年必須維持的複合增速。
                                </div>
                            </div>

                        </div>

                        <!-- 雲端巨頭 CSP 資本支出門檻現實檢驗 -->
                        <div class="tv-card p-5 space-y-3.5">
                            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs font-bold text-slate-200 gap-2">
                                <span>🚀 隱含成長率現實產能檢驗條 (對照資本支出指引極限)</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-slate-400 font-mono text-[11px]">產能極限門檻:</span>
                                    <input type="number" id="input-csp-cap" min="5" max="80" step="1" value="${Math.round(this._state.cspCap * 100)}" class="tv-input-box w-16 px-1.5 py-0.5 text-center font-mono rounded font-bold text-xs">
                                    <span class="text-slate-400 font-mono text-xs">%</span>
                                </div>
                            </div>
                            <div class="w-full h-3 rounded overflow-hidden border border-slate-700" style="background-color: #0f172a;">
                                <div id="csp-fill" class="h-full bg-emerald-600 transition-all duration-300" style="width: 60%;"></div>
                            </div>
                            <div id="csp-status" class="text-xs text-emerald-400 font-medium leading-relaxed"></div>
                        </div>

                        <!-- 蒙地卡羅模擬與機率分佈區 -->
                        <div class="tv-card p-5 space-y-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h4 class="text-sm font-bold uppercase tracking-wider text-slate-200">📊 蒙地卡羅估值分佈區間 (1,000 次隨機矩陣試算)</h4>
                                    <p class="text-xs text-slate-400 mt-0.5">模擬 CAGR (stddev=5%) 與 WACC (stddev=0.5%) 的隨機波動，視覺化高低估機率。</p>
                                </div>
                                <button id="btn-mc" class="tv-btn px-3 py-1.5 text-xs font-mono">
                                    執行隨機波動模擬
                                </button>
                            </div>

                            <div class="bg-slate-900 p-4 rounded border border-slate-700/80 flex flex-col items-center justify-center">
                                <canvas id="mc-canvas" width="600" height="180" class="w-full max-w-full"></canvas>
                                <div class="flex justify-between w-full text-[11px] text-slate-400 mt-2 font-mono px-2">
                                    <span>← 安全折價區 (綠)</span>
                                    <span>公允貼合區 (藍)</span>
                                    <span>泡沫溢價區 (紅) →</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- 自訂口徑生成 Modal (預設隱藏) -->
                    <div id="custom-modal" class="modal-backdrop hidden fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div class="modal-card w-full max-w-lg rounded-lg border border-slate-700 p-6 space-y-6 shadow-2xl">
                            <div class="flex items-center justify-between border-b border-slate-700 pb-3">
                                <h3 class="text-lg font-bold font-mono text-white tracking-wide">新增自訂動態估值參數池</h3>
                                <button type="button" id="modal-close" class="text-slate-400 hover:text-white font-mono text-2xl">&times;</button>
                            </div>
                            <div class="space-y-4 font-mono text-sm text-left">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs text-slate-400 font-bold mb-1 uppercase">股票代號 (Symbol)</label>
                                        <input type="text" id="custom-symbol" placeholder="例如: TSLA / GOOG" maxlength="8" class="modal-input">
                                    </div>
                                    <div>
                                        <label class="block text-xs text-slate-400 font-bold mb-1 uppercase">標的名稱 (Company Name)</label>
                                        <input type="text" id="custom-name" placeholder="例如: Tesla 自駕算力" class="modal-input">
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs text-slate-400 font-bold mb-1 uppercase">最新收盤定價 ($)</label>
                                        <input type="number" step="0.01" id="custom-price" placeholder="例如: 250.00" class="modal-input">
                                    </div>
                                    <div>
                                        <label class="block text-xs text-slate-400 font-bold mb-1 uppercase">TTM 自由現金流 ($M)</label>
                                        <input type="number" step="1" id="custom-fcf" placeholder="例如: 12000" class="modal-input">
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs text-slate-400 font-bold mb-1 uppercase">總流通發行股數 ($M)</label>
                                        <input type="number" step="1" id="custom-shares" placeholder="例如: 3180" class="modal-input">
                                    </div>
                                    <div>
                                        <label class="block text-xs text-slate-400 font-bold mb-1 uppercase">淨現金 / 總債務 ($M)</label>
                                        <input type="number" step="1" id="custom-netcash" placeholder="例如: 20000" class="modal-input">
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
                                <button type="button" id="modal-cancel" class="px-4 py-2 text-xs font-mono font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 transition-all">取消</button>
                                <button type="button" id="modal-confirm" class="px-5 py-2 text-xs font-mono font-bold text-white bg-blue-600 hover:bg-blue-500 rounded border border-blue-500 transition-all shadow-lg">確認存入口徑池</button>
                            </div>
                        </div>
                    </div>

                </div>
            `;

            this.shadowRoot.appendChild(container);
            this.container = container;

            this.attachDOMEvents();
            // 初次載入執行一次蒙地卡羅
            setTimeout(() => this.runMonteCarloSimulation(), 300);
        }

        attachDOMEvents() {
            const root = this.shadowRoot;

            const bindInput = (id, key, isFloat=true) => {
                const el = root.querySelector('#' + id);
                if (el) el.addEventListener('input', (e) => {
                    this._state[key] = isFloat ? parseFloat(e.target.value) || 0 : parseInt(e.target.value) || 0;
                    if (this._debounceTimer) clearTimeout(this._debounceTimer);
                    this._debounceTimer = setTimeout(() => this.calculateAll(), 50);
                });
            };

            bindInput('slider-wacc', 'wacc');
            bindInput('slider-cagr', 'cagr');
            bindInput('slider-term', 'termGrowth');
            bindInput('slider-mult', 'exitMultiple', false);
            bindInput('input-fcf0', 'fcf0');
            bindInput('input-shares', 'shares');
            bindInput('input-netcash', 'netCash');
            bindInput('input-market', 'marketPrice');

            const inputCspCap = root.querySelector('#input-csp-cap');
            if (inputCspCap) {
                inputCspCap.addEventListener('input', (e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 5 && val <= 100) {
                        this._state.cspCap = val / 100.0;
                        if (this._debounceTimer) clearTimeout(this._debounceTimer);
                        this._debounceTimer = setTimeout(() => this.calculateAll(), 50);
                    }
                });
            }

            const toggleMult = root.querySelector('#toggle-mult');
            const boxTerm = root.querySelector('#box-term');
            const boxMult = root.querySelector('#box-mult');

            if (toggleMult) {
                toggleMult.addEventListener('change', (e) => {
                    this._state.useExitMultiple = e.target.checked;
                    if (e.target.checked) {
                        boxTerm.classList.add('hidden');
                        boxMult.classList.remove('hidden');
                    } else {
                        boxTerm.classList.remove('hidden');
                        boxMult.classList.add('hidden');
                    }
                    this.calculateAll();
                });
            }

            const btnReset = root.querySelector('#btn-reset');
            if (btnReset) btnReset.addEventListener('click', () => {
                this.loadPreset('NVDA');
            });

            // 基準口徑按鈕點擊與動態重繪已交由 renderPresetButtons 處理

            const btnOpenCustom = root.querySelector('#btn-open-custom');
            const customModal = root.querySelector('#custom-modal');
            const modalClose = root.querySelector('#modal-close');
            const modalCancel = root.querySelector('#modal-cancel');
            const modalConfirm = root.querySelector('#modal-confirm');

            const openModal = () => {
                if (customModal) customModal.classList.remove('hidden');
                const symInput = root.querySelector('#custom-symbol');
                if (symInput) symInput.focus();
            };
            const closeModal = () => {
                if (customModal) customModal.classList.add('hidden');
            };

            if (btnOpenCustom) btnOpenCustom.addEventListener('click', openModal);
            if (modalClose) modalClose.addEventListener('click', closeModal);
            if (modalCancel) modalCancel.addEventListener('click', closeModal);

            if (modalConfirm) modalConfirm.addEventListener('click', () => {
                const sym = root.querySelector('#custom-symbol')?.value;
                const name = root.querySelector('#custom-name')?.value;
                const price = root.querySelector('#custom-price')?.value;
                const fcf = root.querySelector('#custom-fcf')?.value;
                const shares = root.querySelector('#custom-shares')?.value;
                const netcash = root.querySelector('#custom-netcash')?.value;

                if (!sym || !sym.trim()) {
                    alert('請輸入有效的股票代號！');
                    return;
                }

                if (this.saveCustomPreset(sym, name, fcf, shares, netcash, price)) {
                    closeModal();
                    if (root.querySelector('#custom-symbol')) root.querySelector('#custom-symbol').value = '';
                    if (root.querySelector('#custom-name')) root.querySelector('#custom-name').value = '';
                    if (root.querySelector('#custom-price')) root.querySelector('#custom-price').value = '';
                    if (root.querySelector('#custom-fcf')) root.querySelector('#custom-fcf').value = '';
                    if (root.querySelector('#custom-shares')) root.querySelector('#custom-shares').value = '';
                    if (root.querySelector('#custom-netcash')) root.querySelector('#custom-netcash').value = '';
                }
            });

            const btnMc = root.querySelector('#btn-mc');
            if (btnMc) btnMc.addEventListener('click', () => {
                this.runMonteCarloSimulation();
            });
        }

        loadPreset(key) {
            const data = this._presets[key];
            if (!data) return;

            this._state = { ...this._state, ...data, activeSymbol: key, cspCap: data.cspCap || 0.35 };

            // 重新同步 UI inputs
            const syncVal = (id, val) => { const el = this.shadowRoot.querySelector('#' + id); if (el) el.value = val; };
            syncVal('slider-wacc', data.wacc);
            syncVal('slider-cagr', data.cagr);
            syncVal('slider-term', data.termGrowth);
            syncVal('slider-mult', data.exitMultiple);
            syncVal('input-fcf0', data.fcf0);
            syncVal('input-shares', data.shares);
            syncVal('input-netcash', data.netCash);
            syncVal('input-market', data.marketPrice);
            syncVal('input-csp-cap', Math.round(this._state.cspCap * 100));

            const toggleMult = this.shadowRoot.querySelector('#toggle-mult');
            const boxTerm = this.shadowRoot.querySelector('#box-term');
            const boxMult = this.shadowRoot.querySelector('#box-mult');
            if (toggleMult) toggleMult.checked = data.useExitMultiple;

            if (data.useExitMultiple) {
                if (boxTerm) boxTerm.classList.add('hidden');
                if (boxMult) boxMult.classList.remove('hidden');
            } else {
                if (boxTerm) boxTerm.classList.remove('hidden');
                if (boxMult) boxMult.classList.add('hidden');
            }

            this.calculateAll();
            this.runMonteCarloSimulation();
        }
    }

    global.DcfDemoComponent = DcfDemoComponent;

})(typeof window !== 'undefined' ? window : global);
