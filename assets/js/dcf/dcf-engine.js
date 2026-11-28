/**
 * DCF 純財務數學運算核心模組 (DcfEngine)
 * @description 封裝正向高速成長期現金流折現、終值計算、二分法數值逼近求解隱含增長率與蒙地卡羅隨機波動模擬。
 * 零 DOM 依賴，支援 Node.js 與瀏覽器原生運行。
 */
(function (global) {
    "use strict";

    class DcfEngine {
        /**
         * 執行正向估值試算
         * @param {Object} params 財務參數
         * @param {number} params.fcf0 基期自由現金流 (百萬)
         * @param {number} params.shares 流通在外股數 (百萬股)
         * @param {number} params.netCash 淨現金或淨負債 (百萬)
         * @param {number} params.wacc 加權平均資金成本 (例如 0.10)
         * @param {number} params.cagr 未來 5 年複合年增長率 (例如 0.20)
         * @param {number} params.termGrowth 永續增長率 (例如 0.03)
         * @param {number} params.exitMultiple 退出倍數 (例如 30)
         * @param {boolean} params.useExitMultiple 是否使用退出倍數法
         * @param {number} [customCagr] 覆蓋 cagr 進行單次計算
         * @returns {{ perShare: number, enterpriseValue: number, fcf5: number }}
         */
        static calcForwardValuation(params, customCagr) {
            const { fcf0, shares, netCash, wacc, termGrowth, exitMultiple, useExitMultiple } = params;
            const g = customCagr !== undefined ? customCagr : params.cagr;

            let pv = 0;
            let currentFcf = fcf0;

            // 5 年高速期折現
            for (let t = 1; t <= 5; t++) {
                currentFcf = currentFcf * (1 + g);
                pv += currentFcf / Math.pow(1 + wacc, t);
            }

            // 終值計算 (Terminal Value)
            let terminalValue = 0;
            if (useExitMultiple) {
                terminalValue = currentFcf * exitMultiple;
            } else {
                const denom = wacc - termGrowth;
                terminalValue = denom > 0 ? (currentFcf * (1 + termGrowth)) / denom : 0;
            }

            const pvTerminal = terminalValue / Math.pow(1 + wacc, 5);
            const enterpriseValue = pv + pvTerminal;
            const equityValue = enterpriseValue + netCash;
            const perShare = shares > 0 ? equityValue / shares : 0;

            return {
                perShare: Math.max(0, perShare),
                enterpriseValue: enterpriseValue,
                fcf5: currentFcf
            };
        }

        /**
         * 執行二分法反向求解器 (Bisection Method Solver)
         * 反推當前市場股價所隱含的 5 年自由現金流年複合增長率 (Implied CAGR)
         * @param {Object} params 財務參數
         * @param {number} targetPrice 當前市場股價
         * @param {number} [maxIter=100] 最大迭代次數
         * @param {number} [tolerance=0.01] 容許誤差 ($)
         * @returns {number} 隱含增長率數值 (例如 0.25 代表 25%)
         */
        static solveImpliedCagr(params, targetPrice, maxIter = 100, tolerance = 0.01) {
            let low = -0.50; // -50%
            let high = 1.50; // +150%
            let mid = 0.0;
            let iter = 0;

            while (iter < maxIter) {
                mid = (low + high) / 2.0;
                const result = DcfEngine.calcForwardValuation(params, mid);
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
         * 執行蒙地卡羅隨機波動模擬 (Monte Carlo Simulation)
         * 使用 Box-Muller 轉換生成常態分佈隨機數
         * @param {Object} params 財務參數
         * @param {number} [iterations=1000] 模擬次數
         * @returns {number[]} 排序後的每股公允價值試算分佈陣列
         */
        static runMonteCarloSimulation(params, iterations = 1000) {
            const results = [];
            const baseCagr = params.cagr;
            const baseWacc = params.wacc;

            // Box-Muller 轉換常態分佈產生器
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

                const tempParams = { ...params, wacc: simWacc };
                const val = params.shares > 0 ? DcfEngine.calcForwardValuation(tempParams, simCagr).perShare : 0;
                results.push(val);
            }

            return results.sort((a, b) => a - b);
        }
    }

    // 支援模組匯出與全域暴露
    if (typeof module !== "undefined" && module.exports) {
        module.exports = DcfEngine;
    }
    if (typeof global !== "undefined") {
        global.DcfEngine = DcfEngine;
    }
})(typeof window !== "undefined" ? window : globalThis);
