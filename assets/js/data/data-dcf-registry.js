/**
 * 靜態 DCF 預設口徑註冊表 (Static SSOT Baseline Registry)
 * 註：自動化 yfinance 同步工作流已安全下線。本表轉為全域不可變靜態基準資料，
 * 供 Zero-Build 估值終端無縫讀取與運作。
 * 封存基準時間: 2026-05-18
 */
window.DCF_AUTOMATED_PRESETS = {
    "updatedAt": "靜態基準封存 (2026-05-18)",
    "presets": {
        "NVDA": {
            "name": "NVIDIA (NVDA) 算力霸主 [靜態基準口徑]",
            "fcf0": 96676,
            "shares": 24221,
            "netCash": 51144,
            "marketPrice": 225.32,
            "wacc": 0.1,
            "cagr": 0.3,
            "termGrowth": 0.03,
            "exitMultiple": 35,
            "useExitMultiple": false
        },
        "AAPL": {
            "name": "Apple (AAPL) 終端生態 [靜態基準口徑]",
            "fcf0": 98767,
            "shares": 14687,
            "netCash": -16204,
            "marketPrice": 300.23,
            "wacc": 0.085,
            "cagr": 0.08,
            "termGrowth": 0.02,
            "exitMultiple": 25,
            "useExitMultiple": false
        },
        "MSFT": {
            "name": "Microsoft (MSFT) 雲端帝國 [靜態基準口徑]",
            "fcf0": 71611,
            "shares": 7428,
            "netCash": -47204,
            "marketPrice": 421.92,
            "wacc": 0.09,
            "cagr": 0.16,
            "termGrowth": 0.025,
            "exitMultiple": 30,
            "useExitMultiple": false
        },
        "TSLA": {
            "name": "Tesla (TSLA) 自駕算力 [靜態基準口徑]",
            "fcf0": 6220,
            "shares": 3756,
            "netCash": 28853,
            "marketPrice": 422.24,
            "wacc": 0.11,
            "cagr": 0.25,
            "termGrowth": 0.035,
            "exitMultiple": 40,
            "useExitMultiple": true
        }
    }
};
