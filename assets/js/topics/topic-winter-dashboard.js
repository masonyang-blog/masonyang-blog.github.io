/**
 * topic-winter-dashboard.js
 * 凜冬將至 (Winter Is Coming) 專題：全球宏觀流動性與資產定價動態監控看板
 * 包含：10 大核心指標互動台帳、三階因果傳導 Chart.js 圖表、宏觀情境壓力測試模擬器
 * 相容於 Zero-Build 與深色模式 (dark mode)
 */

(function () {
    // 1. 10 大核心指標數據庫 (Macro Dashboard Ledger)
    const macroData = [
        {
            name: "美國 10 年期國債殖利率",
            base: "5.02%",
            threshold: "衝破 5.0% 心理關口",
            latest: "5.23% ~ 5.31%",
            status: "觸發",
            source: "US 10Y Treasury yield marketwatch",
            detail: "站穩 5.2% 上方，創十餘年新高。反映通膨黏性與財政巨量發債供給衝擊，長端無風險折現率系統性上移。"
        },
        {
            name: "美國 30 年期國債殖利率",
            base: "5.10%",
            threshold: "> 5.10% (長期折現率重估)",
            latest: "5.60% (盤中 5.73%)",
            status: "觸發",
            source: "US 30Y Treasury yield FRED",
            detail: "顯著超標，長端期限溢價全面走闊，美債拍賣買盤邊際承壓，引發各類超長久期資產估值收縮。"
        },
        {
            name: "核心 PCE 年增率",
            base: "4.20%",
            threshold: "連續 3 個月反彈 / > 4.0%",
            latest: "3.00% (6個月年化 3.6%)",
            status: "警戒",
            source: "US Core PCE price index release BEA",
            detail: "名義同比有所回落，但 6 個月年化率仍達 3.6%，短期服務業通膨黏性與工資螺旋猶存。"
        },
        {
            name: "美國 CPI / PPI",
            base: "CPI 3.8% / PPI 6.0%",
            threshold: "能源通膨年增 > 15%",
            latest: "CPI 3.4% (能源年增 16.3%)",
            status: "觸發",
            source: "BLS CPI PPI report inflation",
            detail: "能源年增超標，原油與地緣溢價向終端物流滲透，二次通膨（Second Wave）風險顯著上升。"
        },
        {
            name: "全球流動性指標 (GLI)",
            base: "單周 -$4,500 億",
            threshold: "單周淨流出 > $3,000 億",
            latest: "處於 65 個月正弦週期下行區",
            status: "警戒",
            source: "Global Liquidity Index CrossBorder Capital",
            detail: "全球再融資滾動壓力加劇，主要央行資產負債表持續縮減，跨國貨幣流動性動能明顯放緩。"
        },
        {
            name: "VIX 恐慌指數",
            base: "+68.5% (約 28~32)",
            threshold: "> 20 (健康上限) / > 30 恐慌",
            latest: "14.84 ~ 15.41",
            status: "正常",
            source: "CBOE VIX index yahoo finance",
            detail: "股票市場表面平靜，期貨連續 129 天維持升水，與債券市場的劇烈波動形成罕見背離裂痕。"
        },
        {
            name: "MOVE 債券波動率指數",
            base: "高位跳升",
            threshold: "波動激增觸發避險品平倉",
            latest: "113.6 ~ 120.0",
            status: "觸發",
            source: "ICE BofA MOVE Index",
            detail: "固收市場隱含波動率高懸，顯示底層抵押品重估風險加劇，金融體系隱性槓桿平倉壓力聚集。"
        },
        {
            name: "TED 利差 / 信用利差 (HY OAS)",
            base: "顯著走闊",
            threshold: "偏離長期中樞 > 150 bps",
            latest: "HY OAS 3.03% (303 bps)",
            status: "正常",
            source: "TED spread FRED credit risk",
            detail: "高收益利差暫未失控，企業信用違約風險尚未大規模擴散，市場拋售主要由基準利率折現驅動。"
        },
        {
            name: "布蘭特原油 (Brent Crude)",
            base: "$109 ~ $119 / 桶",
            threshold: "站穩 $110 / 衝擊 $150",
            latest: "$102.82 ~ $104.28 / 桶",
            status: "警戒",
            source: "Brent crude oil price EIA",
            detail: "維持在百美元高位區間震盪，中東戰時航運保險與物流溢價為油價提供強支撐。"
        },
        {
            name: "荷姆茲海峽日通航船數",
            base: "19 艘/日 (降 85%)",
            threshold: "< 15 艘 (物理斷裂警報)",
            latest: "約 17.7 艘 / 日",
            status: "警戒",
            source: "Strait of Hormuz vessel traffic Lloyd's List",
            detail: "維持最低限度穿梭接駁運轉，但周邊襲擊事件頻傳，聯合航運評級維持嚴重警戒。"
        }
    ];

    let currentFilter = 'all';
    let chart1Instance = null;
    let chart2Instance = null;
    let chart3Instance = null;

    // 判斷是否為深色模式
    function isDarkMode() {
        return document.documentElement.classList.contains('dark');
    }

    // 2. 渲染台帳數據表格
    function renderTable() {
        const tbody = document.getElementById('macro-table-body');
        if (!tbody) return;
        const searchInputElem = document.getElementById('dashboard-search');
        const searchInput = searchInputElem ? searchInputElem.value.toLowerCase().trim() : '';
        tbody.innerHTML = '';

        let visible = 0;

        macroData.forEach((item, index) => {
            if (currentFilter !== 'all' && item.status !== currentFilter) return;

            const text = (item.name + item.threshold + item.latest + item.status + item.source + item.detail).toLowerCase();
            if (searchInput && !text.includes(searchInput)) return;

            visible++;

            let badgeClass = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
            let badgeIcon = "●";
            if (item.status === '觸發') {
                badgeClass = "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800";
                badgeIcon = "🚨";
            } else if (item.status === '警戒') {
                badgeClass = "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800";
                badgeIcon = "⚠️";
            } else if (item.status === '正常') {
                badgeClass = "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800";
                badgeIcon = "✅";
            }

            const tr = document.createElement('tr');
            tr.className = "hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border-b border-slate-100 dark:border-slate-800 cursor-pointer";
            tr.onclick = () => toggleRowDetail(index);

            tr.innerHTML = `
                <td class="p-3 sm:p-4 font-bold text-slate-900 dark:text-slate-100">
                    <div class="flex items-center gap-1.5">
                        <span>${item.name}</span>
                        <span class="text-xs text-slate-400 dark:text-slate-500 font-normal hover:text-cyan-500 transition-colors" title="點擊展開詳情">▾</span>
                    </div>
                    <div class="text-[10px] text-slate-400 dark:text-slate-500 font-normal hidden sm:block">${item.source}</div>
                </td>
                <td class="p-3 sm:p-4 text-slate-600 dark:text-slate-300 font-mono">${item.base}</td>
                <td class="p-3 sm:p-4 text-slate-500 dark:text-slate-400">${item.threshold}</td>
                <td class="p-3 sm:p-4 font-bold text-slate-900 dark:text-cyan-300 font-mono">${item.latest}</td>
                <td class="p-3 sm:p-4 text-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${badgeClass}">
                        <span>${badgeIcon}</span> ${item.status}
                    </span>
                </td>
                <td class="p-3 sm:p-4 font-mono text-[11px] text-slate-400 dark:text-slate-500 hidden md:table-cell">
                    <code>${item.source}</code>
                </td>
            `;

            // 展開的詳情列
            const trDetail = document.createElement('tr');
            trDetail.id = `detail-row-${index}`;
            trDetail.className = "hidden bg-amber-50/50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700 text-xs";
            trDetail.innerHTML = `
                <td colspan="6" class="p-4 text-slate-700 dark:text-slate-300">
                    <div class="flex items-start gap-2.5">
                        <span class="text-amber-600 dark:text-amber-400 font-bold shrink-0">🔍 深度解析：</span>
                        <div class="leading-relaxed font-noto">${item.detail}</div>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
            tbody.appendChild(trDetail);
        });

        const countElem = document.getElementById('visible-count');
        if (countElem) countElem.innerText = visible;
    }

    function toggleRowDetail(index) {
        const detailRow = document.getElementById(`detail-row-${index}`);
        if (detailRow) {
            detailRow.classList.toggle('hidden');
        }
    }

    function filterStatus(status) {
        currentFilter = status;

        const defaultClass = "px-3 py-1.5 rounded-lg font-medium transition-colors bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700";
        ['all', 'trigger', 'alert', 'normal'].forEach(id => {
            const btn = document.getElementById(`filter-${id}`);
            if (btn) btn.className = defaultClass;
        });

        if (status === 'all') {
            const b = document.getElementById('filter-all');
            if (b) b.className = "px-3 py-1.5 rounded-lg font-medium transition-colors bg-slate-800 dark:bg-cyan-600 text-white shadow-sm";
        } else if (status === '觸發') {
            const b = document.getElementById('filter-trigger');
            if (b) b.className = "px-3 py-1.5 rounded-lg font-medium bg-rose-600 text-white shadow-sm";
        } else if (status === '警戒') {
            const b = document.getElementById('filter-alert');
            if (b) b.className = "px-3 py-1.5 rounded-lg font-medium bg-amber-600 text-white shadow-sm";
        } else if (status === '正常') {
            const b = document.getElementById('filter-normal');
            if (b) b.className = "px-3 py-1.5 rounded-lg font-medium bg-emerald-600 text-white shadow-sm";
        }

        renderTable();
    }

    // 3. 切換三階傳導 Tab
    function switchPhase(phaseKey) {
        ['phase1', 'phase2', 'phase3'].forEach(p => {
            const content = document.getElementById(`content-${p}`);
            const tab = document.getElementById(`tab-${p}`);
            if (content && tab) {
                if (p === phaseKey) {
                    content.classList.remove('hidden');
                    tab.className = "phase-tab p-4 rounded-2xl border-2 border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 text-left transition-all shadow-md";
                } else {
                    content.classList.add('hidden');
                    tab.className = "phase-tab p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all shadow-sm";
                }
            }
        });
    }

    // 4. 壓力測試模擬器計算邏輯
    function updateSimulator() {
        const slider10y = document.getElementById('slider-10y');
        const sliderOil = document.getElementById('slider-oil');
        if (!slider10y || !sliderOil) return;

        const yieldVal = parseFloat(slider10y.value);
        const oilVal = parseFloat(sliderOil.value);

        const val10yElem = document.getElementById('slider-10y-val');
        const valOilElem = document.getElementById('slider-oil-val');
        if (val10yElem) val10yElem.innerText = yieldVal.toFixed(2) + '%';
        if (valOilElem) valOilElem.innerText = '$' + oilVal + ' / 桶';

        // 動態 ERP 估算 = S&P 盈利殖利率 (~4.8%) - 10Y Yield
        const estimatedERP = (4.80 - (yieldVal * 0.88)).toFixed(2);
        const erpElem = document.getElementById('sim-erp');
        const erpStatus = document.getElementById('sim-erp-status');
        if (erpElem) {
            erpElem.innerText = estimatedERP + '%';
            if (parseFloat(estimatedERP) < 0) {
                erpElem.className = "text-2xl font-black text-rose-500";
                if (erpStatus) erpStatus.innerText = "ERP 動態轉負 (極度危險/估值全面崩解)";
            } else if (parseFloat(estimatedERP) < 0.3) {
                erpElem.className = "text-2xl font-black text-rose-400";
                if (erpStatus) erpStatus.innerText = "估值保護趨零 (高危警戒區)";
            } else {
                erpElem.className = "text-2xl font-black text-amber-400";
                if (erpStatus) erpStatus.innerText = "估值保護弱化 (審慎防禦)";
            }
        }

        // 聯準會再緊縮機率模型
        const fedProb = Math.min(99, Math.max(15, Math.round((oilVal - 80) * 1.2 + (yieldVal - 4.5) * 25)));
        const fedElem = document.getElementById('sim-fed');
        if (fedElem) fedElem.innerText = fedProb + '%';

        // 板塊輪動偏好訊號
        const rotElem = document.getElementById('sim-rotation');
        if (rotElem) {
            if (oilVal > 110 || yieldVal > 5.4) {
                rotElem.innerText = "做空高估值科技 / 強力擁抱資源";
                rotElem.className = "text-lg font-bold text-rose-400";
            } else if (oilVal > 98 || yieldVal > 5.0) {
                rotElem.innerText = "能源與大宗強於科技";
                rotElem.className = "text-lg font-bold text-emerald-400";
            } else {
                rotElem.innerText = "均衡配置 / 觀望通膨黏性";
                rotElem.className = "text-lg font-bold text-amber-400";
            }
        }

        // 動態策略建議
        const adviceElem = document.getElementById('sim-advice');
        if (adviceElem) {
            if (yieldVal > 5.30 && oilVal > 105) {
                adviceElem.innerText = "⚠️ 極端警訊：美債殖利率衝破 5.3% 且原油衝擊 $105，通膨與折現率雙殺。建議大幅調降科技股頭寸，建構 15%~20% 實體黃金底倉，加碼超短期高息美債與石油特許防禦資產。";
            } else if (yieldVal > 5.0) {
                adviceElem.innerText = "當前條件下美債折現率嚴重壓制科技股 PE 倍數，且原油成本向服務業擴散，建議戰略性調降 60/40 組合槓桿，調高實體黃金、大宗商品與現金流充沛之公用事業配置比重。";
            } else {
                adviceElem.innerText = "宏觀衝擊暫緩，但仍需緊盯美債拍賣買盤與荷姆茲海峽通航量，維持充裕無風險現金流緩衝。";
            }
        }
    }

    // 5. 初始化 Chart.js 圖表
    function initCharts() {
        if (typeof Chart === 'undefined') return;

        const dark = isDarkMode();
        const textColor = dark ? '#94a3b8' : '#475569';
        const gridColor = dark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.06)';

        const formatLabel = (str) => {
            if (str.length > 14) {
                return [str.substring(0, 14), str.substring(14)];
            }
            return str;
        };

        // CHART 1: Phase 1 Yields & Debt Interest
        const el1 = document.getElementById('chartPhase1');
        if (el1) {
            if (chart1Instance) chart1Instance.destroy();
            chart1Instance = new Chart(el1.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['2024/01', '2024/07', '2025/01', '2025/07', '2026/01', '2026/05', '2026/10 (最新)'],
                    datasets: [
                        {
                            label: '美債 10Y 殖利率 (%)',
                            data: [4.10, 4.35, 4.65, 4.85, 5.02, 5.02, 5.28],
                            borderColor: '#f43f5e',
                            backgroundColor: 'rgba(244, 63, 94, 0.1)',
                            fill: true,
                            yAxisID: 'y',
                            tension: 0.3
                        },
                        {
                            label: '美債 30Y 殖利率 (%)',
                            data: [4.25, 4.50, 4.80, 4.95, 5.10, 5.10, 5.60],
                            borderColor: '#f59e0b',
                            borderDash: [5, 5],
                            yAxisID: 'y',
                            tension: 0.3
                        },
                        {
                            label: '年化債務利息 (兆美元)',
                            data: [0.88, 0.92, 0.98, 1.05, 1.10, 1.10, 1.20],
                            borderColor: dark ? '#38bdf8' : '#0f172a',
                            backgroundColor: dark ? '#0284c7' : '#1e293b',
                            type: 'bar',
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    scales: {
                        x: {
                            ticks: { color: textColor, font: { size: 10 } },
                            grid: { color: gridColor }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: { display: true, text: '殖利率 (%)', color: textColor, font: { size: 10 } },
                            ticks: { color: textColor },
                            grid: { color: gridColor },
                            min: 3.5,
                            max: 6.0
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: { display: true, text: '年化利息 ($T)', color: textColor, font: { size: 10 } },
                            ticks: { color: textColor },
                            grid: { drawOnChartArea: false },
                            min: 0.5,
                            max: 1.5
                        }
                    },
                    plugins: {
                        legend: {
                            labels: { color: textColor, font: { size: 11 } }
                        }
                    }
                }
            });
        }

        // CHART 2: Phase 2 MOVE vs VIX & ERP
        const el2 = document.getElementById('chartPhase2');
        if (el2) {
            if (chart2Instance) chart2Instance.destroy();
            chart2Instance = new Chart(el2.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['MOVE 債券波動率', 'VIX 恐慌指數', '股權風險溢價 ERP (%)', '股債價格相關性 (x100)'],
                    datasets: [{
                        label: '指標數值',
                        data: [113.6, 15.4, 0.19, 25],
                        backgroundColor: [
                            '#f43f5e', // MOVE (high)
                            '#10b981', // VIX (low)
                            '#f59e0b', // ERP (compressed)
                            dark ? '#38bdf8' : '#1e293b' // Correlation
                        ],
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            ticks: { color: textColor, font: { size: 10 } },
                            grid: { color: gridColor }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: { color: textColor },
                            grid: { color: gridColor },
                            title: { display: true, text: '數值 (點 / % / 相關係數*100)', color: textColor, font: { size: 10 } }
                        }
                    }
                }
            });
        }

        // CHART 3: Phase 3 Pre-IPO Discount vs Gold Inflow
        const el3 = document.getElementById('chartPhase3');
        if (el3) {
            if (chart3Instance) chart3Instance.destroy();
            chart3Instance = new Chart(el3.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: [
                        formatLabel('全體獨角獸二級折價'),
                        formatLabel('Top10超級獨角獸二級折價'),
                        formatLabel('2021融資輪獨角獸折價'),
                        formatLabel('Q3實體黃金ETF淨流入($B)')
                    ],
                    datasets: [{
                        label: '幅度和數值',
                        data: [-49, -79, -59.8, 310],
                        backgroundColor: [
                            '#f43f5e',
                            '#be123c',
                            '#f59e0b',
                            '#10b981'
                        ],
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
                                label: (ctx) => `${ctx.raw} ${ctx.dataIndex === 3 ? '億美元' : '%'}`
                            }
                        }
                    },
                    scales: {
                        y: {
                            ticks: { color: textColor, font: { size: 10 } },
                            grid: { color: gridColor }
                        },
                        x: {
                            ticks: { color: textColor },
                            grid: { color: gridColor },
                            title: { display: true, text: '折價百分比 (%) / 資金流入 (億美元)', color: textColor, font: { size: 10 } }
                        }
                    }
                }
            });
        }
    }

    // 暴露全域函數給 HTML 按鈕事件呼叫
    window.filterStatus = filterStatus;
    window.searchDashboard = renderTable;
    window.toggleRowDetail = toggleRowDetail;
    window.switchPhase = switchPhase;
    window.updateSimulator = updateSimulator;

    // DOM Ready 初始化
    document.addEventListener('DOMContentLoaded', () => {
        renderTable();
        initCharts();
        updateSimulator();

        // 監聽深色模式切換以重新渲染圖表
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    initCharts();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
    });
})();
