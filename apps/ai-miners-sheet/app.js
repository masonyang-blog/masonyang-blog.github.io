/**
 * AI 礦企核心數據對標總表 - 主應用邏輯 (app.js)
 * 
 * 包含：
 * 1. 數據庫持久化管理 (LocalStorage & database.js 協同)
 * 2. 資料匯入 (JSON 貼上 / 檔案上傳)、驗證防呆、匯出與還原
 * 3. 頂部 KPI 動態動態重算
 * 4. 多維度視圖、排序、搜尋、商業模式篩選
 * 5. Google Sheets (TSV)、CSV、Markdown 一鍵匯出
 * 6. 標的深度分析側邊抽屜 (Drawer) 與視覺柱狀圖
 */

// LocalStorage 儲存 Key
const STORAGE_KEY = 'AI_MINERS_CUSTOM_DB_V1';
const GSHEET_URL_STORAGE_KEY = 'AI_MINERS_GSHEET_CSV_URL_V1';

// 系統全域資料實例
let MASTER_DATA = [];

// 狀態控制
let currentView = "all";
let sortColumn = "marketCap";
let sortDirection = "desc";
let currentSearchTerm = "";
let selectedModelFilter = "ALL";

// View 欄位定義
const VIEW_COLUMNS = {
  "all": [
    { key: "ticker", label: "代號", type: "string" },
    { key: "name", label: "公司名稱", type: "string" },
    { key: "businessModel", label: "轉型商業模式", type: "string" },
    { key: "price", label: "股價 ($)", type: "number", format: val => `$${Number(val).toFixed(2)}` },
    { key: "marketCap", label: "市值 ($B)", type: "number", format: val => `$${Number(val).toFixed(2)}B` },
    { key: "netDebt", label: "淨負債 ($M)", type: "number", format: val => Number(val) < 0 ? `-$${Math.abs(Number(val))}M (現金)` : `+$${Number(val)}M` },
    { key: "ev", label: "EV ($B)", type: "number", format: val => `$${Number(val).toFixed(2)}B` },
    { key: "targetPrice", label: "目標價 ($)", type: "number", format: val => `$${Number(val).toFixed(2)}` },
    { key: "upside", label: "潛在漲幅", type: "number", format: val => `+${Number(val).toFixed(1)}%` },
    { key: "beta", label: "Beta", type: "number", format: val => Number(val).toFixed(2) },
    { key: "opMw", label: "營運電力 (MW)", type: "number", format: val => `${Number(val).toLocaleString()} MW` },
    { key: "pipelineMw", label: "總儲備 (MW)", type: "number", format: val => `${Number(val).toLocaleString()} MW` },
    { key: "contractedMw", label: "已簽約HPC (MW)", type: "number", format: val => `${Number(val)} MW` },
    { key: "hpcSplit", label: "HPC佔比", type: "number", format: val => `${Number(val)}%` },
    { key: "evMw", label: "EV/MW", type: "number", format: val => `$${Number(val).toFixed(1)}M` },
    { key: "backlogValue", label: "在手合約 ($B)", type: "number", format: (val, row) => row.backlogText || (val ? `$${val}B` : '-') },
    { key: "majorClients", label: "核心客戶夥伴", type: "string" },
    { key: "yoy", label: "營收YoY", type: "number", format: val => `+${Number(val)}%` },
  ],
  "market": [
    { key: "ticker", label: "代號", type: "string" },
    { key: "name", label: "公司名稱", type: "string" },
    { key: "price", label: "現價 (USD)", type: "number", format: val => `$${Number(val).toFixed(2)}` },
    { key: "shares", label: "股數 (M)", type: "number", format: val => `${Number(val)}M` },
    { key: "marketCap", label: "總市值 ($B)", type: "number", format: val => `$${Number(val).toFixed(2)}B` },
    { key: "netDebt", label: "淨負債/淨現金 ($M)", type: "number", format: val => Number(val) < 0 ? `淨現金 $${Math.abs(Number(val))}M` : `淨負債 $${Number(val)}M` },
    { key: "ev", label: "企業價值 EV ($B)", type: "number", format: val => `$${Number(val).toFixed(2)}B` },
    { key: "beta", label: "Beta (6M)", type: "number", format: val => Number(val).toFixed(2) },
    { key: "range52w", label: "52週區間", type: "string" },
    { key: "targetPrice", label: "目標價 (USD)", type: "number", format: val => `$${Number(val).toFixed(2)}` },
    { key: "upside", label: "隱含潛在漲幅", type: "number", format: val => `+${Number(val).toFixed(1)}%` },
  ],
  "power": [
    { key: "ticker", label: "代號", type: "string" },
    { key: "name", label: "公司名稱", type: "string" },
    { key: "opMw", label: "營運中電力 (MW)", type: "number", format: val => `${Number(val).toLocaleString()} MW` },
    { key: "pipelineMw", label: "總管線儲備 (MW)", type: "number", format: val => `${Number(val).toLocaleString()} MW` },
    { key: "contractedMw", label: "已簽約容量 (MW)", type: "number", format: val => `${Number(val)} MW` },
    { key: "evMw", label: "EV/MW 估值倍數", type: "number", format: val => `$${Number(val).toFixed(1)}M / MW` },
    { key: "facilities", label: "主要基地與設施", type: "string" },
    { key: "energization", label: "變電所通電進度", type: "string" },
    { key: "cod", label: "COD 商轉投產日", type: "string" },
  ],
  "contracts": [
    { key: "ticker", label: "代號", type: "string" },
    { key: "name", label: "公司名稱", type: "string" },
    { key: "businessModel", label: "轉型商業模式", type: "string" },
    { key: "hpcSplit", label: "HPC 營收佔比", type: "number", format: val => `${Number(val)}%` },
    { key: "majorClients", label: "核心合約客戶", type: "string" },
    { key: "contracts", label: "代表性合約細節", type: "string" },
    { key: "backlogValue", label: "在手訂單 ($B)", type: "number", format: (val, row) => row.backlogText || (val ? `$${val}B` : '-') },
    { key: "contractRatio", label: "合約鎖定率", type: "string" },
  ],
  "financials": [
    { key: "ticker", label: "代號", type: "string" },
    { key: "name", label: "公司名稱", type: "string" },
    { key: "yoy", label: "營收年增率 (YoY)", type: "number", format: val => `+${Number(val)}%` },
    { key: "revenueHistory", label: "近四季營收 ($M)", type: "string", format: val => Array.isArray(val) ? val.map(v => `$${v}M`).join(' → ') : '-' },
    { key: "capexHistory", label: "近四季 CapEx ($M)", type: "string", format: val => Array.isArray(val) ? val.map(v => `$${v}M`).join(' → ') : '-' },
    { key: "latestEpsActual", label: "最新季度 EPS", type: "number", format: val => `$${Number(val).toFixed(2)}` },
    { key: "latestEpsEst", label: "市場預估 EPS", type: "number", format: val => `$${Number(val).toFixed(2)}` },
    { key: "epsSurprise", label: "EPS 驚喜率", type: "number", format: val => `+${Number(val).toFixed(1)}% (Beat)` },
  ]
};

// 標籤樣式
const TICKER_BADGES = {
  BTBT: "bg-teal-500/10 text-teal-400 border-teal-500/30",
  CIFR: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  CLSK: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  CORZ: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  HIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  HUT: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  IREN: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  MARA: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  RIOT: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
};

// 初始化載入
window.addEventListener('DOMContentLoaded', () => {
  initDatabase();
  renderAllViews();
  initGoogleSheetSync();
});

// ============================================================================
// Google Sheets 即時自動同步模組 (Google Sheets CSV Auto-Sync Pipeline)
// ============================================================================

function getSavedGsheetUrl() {
  return localStorage.getItem(GSHEET_URL_STORAGE_KEY) || '';
}

function saveGsheetUrl(url) {
  if (url && typeof url === 'string' && url.trim()) {
    localStorage.setItem(GSHEET_URL_STORAGE_KEY, url.trim());
  } else {
    localStorage.removeItem(GSHEET_URL_STORAGE_KEY);
  }
}

function initGoogleSheetSync() {
  const savedUrl = getSavedGsheetUrl();
  updateGsheetSyncBadge(savedUrl ? 'configured' : 'idle');
  if (savedUrl) {
    // 背景靜默拉取最新 Google Sheets 報價
    setTimeout(() => {
      syncWithGoogleSheet(false);
    }, 300);
  }
}

// 狀態徽章 UI 更新
function updateGsheetSyncBadge(status, customMsg = '') {
  const badge = document.getElementById('gsheetSyncBadge');
  if (!badge) return;

  switch (status) {
    case 'syncing':
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span> 正在同步 Google Sheets...`;
      badge.className = "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px]";
      break;
    case 'success':
      const timeStr = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Google Sheets 已即時同步 (${timeStr})`;
      badge.className = "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]";
      break;
    case 'error':
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span> 同步失敗 (已保留基準數據)`;
      badge.className = "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-[11px]";
      break;
    case 'configured':
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 已綁定 Google Sheets`;
      badge.className = "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]";
      break;
    case 'idle':
    default:
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Google Sheets 未綁定`;
      badge.className = "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[11px]";
      break;
  }
}

// 簡易標準 CSV 解析器 (相容雙引號與逗號)
function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  function splitLine(line) {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim().replace(/^"|"$/g, ''));
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim().replace(/^"|"$/g, ''));
    return result;
  }

  const rawHeaders = splitLine(lines[0]);
  const headers = rawHeaders.map(h => h.toLowerCase().replace(/[\s_-]/g, ''));

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitLine(lines[i]);
    if (!cols || cols.length === 0 || !cols[0]) continue;
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cols[idx] !== undefined ? cols[idx] : '';
    });
    records.push(row);
  }
  return records;
}

// 執行 Google Sheets CSV 同步核心流程
async function syncWithGoogleSheet(isManual = true) {
  const url = getSavedGsheetUrl();
  if (!url) {
    if (isManual) {
      openDbModal();
      const msgEl = document.getElementById('dbModalMsg');
      if (msgEl) {
        msgEl.classList.remove('hidden');
        msgEl.innerHTML = '⚠️ 尚未設定 Google Sheets CSV 發布網址，請在下方「Google Sheets 自動同步設定」中填入網址！';
      }
      showToast('請先設定 Google Sheets CSV 網址！');
    }
    return false;
  }

  updateGsheetSyncBadge('syncing');

  try {
    const fetchUrl = url.includes('?') ? `${url}&_t=${Date.now()}` : `${url}?_t=${Date.now()}`;
    const response = await fetch(fetchUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP 錯誤碼: ${response.status}`);
    }

    const csvText = await response.text();
    const records = parseCsv(csvText);
    if (!records || records.length === 0) {
      throw new Error('CSV 未包含有效資料列');
    }

    let updatedCount = 0;

    records.forEach(rec => {
      const tickerKey = Object.keys(rec).find(k => k.includes('ticker') || k.includes('symbol') || k === 'code');
      const ticker = (tickerKey ? rec[tickerKey] : rec[Object.keys(rec)[0]])?.toUpperCase()?.trim();
      if (!ticker) return;

      const target = MASTER_DATA.find(item => item.ticker === ticker);
      if (!target) return;

      let changed = false;

      // 1. 現價 (Price)
      const priceKey = Object.keys(rec).find(k => k === 'price' || k.includes('currentprice') || k.includes('stockprice'));
      if (priceKey && rec[priceKey] !== '' && !isNaN(Number(rec[priceKey]))) {
        const val = parseFloat(rec[priceKey]);
        if (val > 0 && target.price !== val) {
          target.price = val;
          changed = true;
        }
      }

      // 2. 目標價 (Target Price)
      const targetKey = Object.keys(rec).find(k => k.includes('target') || k === 'tp');
      if (targetKey && rec[targetKey] !== '' && !isNaN(Number(rec[targetKey]))) {
        const val = parseFloat(rec[targetKey]);
        if (val > 0) {
          target.targetPrice = val;
          changed = true;
        }
      }

      // 3. Beta
      const betaKey = Object.keys(rec).find(k => k === 'beta');
      if (betaKey && rec[betaKey] !== '' && !isNaN(Number(rec[betaKey]))) {
        const val = parseFloat(rec[betaKey]);
        if (val > 0) {
          target.beta = parseFloat(val.toFixed(2));
          changed = true;
        }
      }

      // 4. 流通股數 (Shares)
      const sharesKey = Object.keys(rec).find(k => k.includes('shares'));
      if (sharesKey && rec[sharesKey] !== '' && !isNaN(Number(rec[sharesKey]))) {
        const val = parseFloat(rec[sharesKey]);
        if (val > 0) {
          target.shares = parseFloat(val.toFixed(1));
          changed = true;
        }
      }

      // 5. 52 週最高與最低
      const lowKey = Object.keys(rec).find(k => k.includes('low52') || k.includes('52low') || k.includes('weeklow'));
      const highKey = Object.keys(rec).find(k => k.includes('high52') || k.includes('52high') || k.includes('weekhigh'));
      if (lowKey && highKey && rec[lowKey] && rec[highKey]) {
        const l = parseFloat(rec[lowKey]);
        const h = parseFloat(rec[highKey]);
        if (!isNaN(l) && !isNaN(h) && l > 0 && h > 0) {
          target.range52w = `$${l.toFixed(2)} - $${h.toFixed(2)}`;
          changed = true;
        }
      }

      // 6. 市值 (Market Cap) - 若提供則更新，若無則以現價*股數重算
      const mcapKey = Object.keys(rec).find(k => k.includes('marketcap') || k.includes('mcap'));
      if (mcapKey && rec[mcapKey] !== '' && !isNaN(Number(rec[mcapKey]))) {
        target.marketCap = parseFloat(parseFloat(rec[mcapKey]).toFixed(3));
      } else if (target.price && target.shares) {
        target.marketCap = parseFloat(((target.price * target.shares) / 1000).toFixed(3));
      }

      // 7. 動態重算衍生指標：upside, ev, evMw
      if (target.targetPrice && target.price) {
        target.upside = parseFloat((((target.targetPrice - target.price) / target.price) * 100).toFixed(1));
      }
      target.ev = parseFloat((target.marketCap + ((target.netDebt || 0) / 1000)).toFixed(3));
      if (target.opMw && target.opMw > 0) {
        target.evMw = parseFloat(((target.ev * 1000) / target.opMw).toFixed(1));
      }

      if (changed) updatedCount++;
    });

    renderAllViews();
    updateGsheetSyncBadge('success');

    if (isManual) {
      showToast(`🎉 成功自 Google Sheets 即時同步 ${updatedCount} 家礦企最新報價！`);
    }
    return true;
  } catch (err) {
    console.error('Google Sheets 同步失敗:', err);
    updateGsheetSyncBadge('error');
    if (isManual) {
      showToast(`同步失敗: ${err.message} (已保留既有數據)`);
    }
    return false;
  }
}

// 儲存 Modal 中的 Google Sheets 網址設定
function saveGsheetConfigFromModal() {
  const input = document.getElementById('gsheetUrlInput');
  if (!input) return;
  const val = input.value.trim();
  saveGsheetUrl(val);
  updateGsheetSyncBadge(val ? 'configured' : 'idle');
  showToast(val ? '已成功儲存 Google Sheets 發布網址！' : '已清除 Google Sheets 網址設定');
  if (val) {
    syncWithGoogleSheet(true);
  }
}

// 清除 Google Sheets 網址設定
function clearGsheetConfig() {
  saveGsheetUrl('');
  const input = document.getElementById('gsheetUrlInput');
  if (input) input.value = '';
  updateGsheetSyncBadge('idle');
  showToast('已清除 Google Sheets 連動設定');
}

// 資料庫載入與初始化
function initDatabase() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // 若儲存的自訂資料庫中缺乏最新官方擴充之 deepValuation，自動同步補齊最新研報數據
        if (window.DEFAULT_MINERS_DATA && Array.isArray(window.DEFAULT_MINERS_DATA)) {
          window.DEFAULT_MINERS_DATA.forEach(def => {
            if (def.deepValuation) {
              const target = parsed.find(p => p.ticker === def.ticker);
              if (target && !target.deepValuation) {
                target.deepValuation = JSON.parse(JSON.stringify(def.deepValuation));
              }
            }
          });
        }
        MASTER_DATA = parsed;
        updateDbStatusBadge(true, parsed.length);
        return;
      }
    } catch (e) {
      console.warn('LocalStorage 解析失敗，改用預設資料庫', e);
    }
  }

  // 預設資料庫
  if (window.DEFAULT_MINERS_DATA && Array.isArray(window.DEFAULT_MINERS_DATA)) {
    MASTER_DATA = JSON.parse(JSON.stringify(window.DEFAULT_MINERS_DATA));
  } else {
    MASTER_DATA = [];
  }
  updateDbStatusBadge(false, MASTER_DATA.length);
}

// 更新資料庫狀態徽章
function updateDbStatusBadge(isCustom, count) {
  const badge = document.getElementById('dbSourceBadge');
  if (!badge) return;
  if (isCustom) {
    badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> 自訂資料庫 (${count} 筆)`;
    badge.className = "flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px]";
  } else {
    badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 官方預設庫 (${count} 筆)`;
    badge.className = "flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]";
  }
}

// 頂部 KPI 卡片動態計算渲染
function updateKpiRibbon() {
  const totalCount = MASTER_DATA.length;
  let totalPipelineMw = 0;
  let totalContractedMw = 0;
  let totalBacklogVal = 0;
  let highestUpside = 0;
  let highestUpsideTicker = '-';
  let totalEvMw = 0;
  let evMwCount = 0;

  MASTER_DATA.forEach(row => {
    if (row.pipelineMw) totalPipelineMw += Number(row.pipelineMw) || 0;
    if (row.contractedMw) totalContractedMw += Number(row.contractedMw) || 0;
    if (row.backlogValue) totalBacklogVal += Number(row.backlogValue) || 0;
    if (row.upside && Number(row.upside) > highestUpside) {
      highestUpside = Number(row.upside);
      highestUpsideTicker = row.ticker;
    }
    if (row.evMw) {
      totalEvMw += Number(row.evMw);
      evMwCount++;
    }
  });

  const avgEvMw = evMwCount > 0 ? (totalEvMw / evMwCount).toFixed(1) : '0.0';

  const elCount = document.getElementById('kpiTotalMiners');
  const elPipeline = document.getElementById('kpiTotalPipeline');
  const elContracted = document.getElementById('kpiTotalContracted');
  const elUpside = document.getElementById('kpiHighestUpside');
  const elEvMw = document.getElementById('kpiAvgEvMw');
  const elBacklog = document.getElementById('kpiTotalBacklog');

  if (elCount) elCount.innerHTML = `${totalCount} <span class="text-xs text-slate-500 font-normal">家核心標的</span>`;
  if (elPipeline) elPipeline.innerHTML = `${(totalPipelineMw / 1000).toFixed(1)} <span class="text-xs text-slate-500 font-normal">GW 電力儲備</span>`;
  if (elContracted) elContracted.innerHTML = `${totalContractedMw.toLocaleString()} <span class="text-xs text-slate-500 font-normal">MW 鎖定中</span>`;
  if (elUpside) elUpside.innerHTML = `+${highestUpside.toFixed(1)}% <span class="text-xs text-slate-500 font-normal font-sans">(${highestUpsideTicker})</span>`;
  if (elEvMw) elEvMw.innerHTML = `$${avgEvMw}M <span class="text-xs text-slate-500 font-normal">/ MW 均值</span>`;
  if (elBacklog) elBacklog.innerHTML = `$${totalBacklogVal.toFixed(1)}B+ <span class="text-xs text-slate-500 font-normal">確定訂單</span>`;
}

// 渲染所有視圖
function renderAllViews() {
  updateKpiRibbon();
  renderTable();
  renderFormulaTable();
}

// View 切換
function switchView(viewName) {
  currentView = viewName;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('tab-active');
    btn.classList.add('text-slate-400');
  });
  const activeBtn = document.getElementById(`tab-${viewName}`);
  if (activeBtn) {
    activeBtn.classList.add('tab-active');
    activeBtn.classList.remove('text-slate-400');
  }

  const tableSection = document.getElementById('tableSection');
  const formulaSection = document.getElementById('formulaSection');

  if (viewName === 'formulas') {
    tableSection.classList.add('hidden');
    formulaSection.classList.remove('hidden');
  } else {
    tableSection.classList.remove('hidden');
    formulaSection.classList.add('hidden');
    renderTable();
  }
}

// 商業模式標籤過濾
function filterByModel(modelKey) {
  selectedModelFilter = modelKey;
  document.querySelectorAll('.model-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-model') === modelKey) {
      btn.className = "model-filter-btn px-2 py-1 text-xs rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium active-filter";
    } else {
      btn.className = "model-filter-btn px-2 py-1 text-xs rounded bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700";
    }
  });
  renderTable();
}

// 搜尋
function handleSearch() {
  currentSearchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  renderTable();
}

// 重設過濾
function clearFilter() {
  document.getElementById('searchInput').value = "";
  currentSearchTerm = "";
  filterByModel('ALL');
}

// 欄位排序觸發
function handleSort(columnKey) {
  if (sortColumn === columnKey) {
    sortDirection = sortDirection === "asc" ? "desc" : "asc";
  } else {
    sortColumn = columnKey;
    sortDirection = "desc";
  }
  renderTable();
}

// 資料篩選與排序計算
function getProcessedData() {
  let filtered = MASTER_DATA.filter(item => {
    if (selectedModelFilter !== 'ALL') {
      if (item.modelCategory !== selectedModelFilter) return false;
    }
    if (currentSearchTerm) {
      const searchStr = `${item.ticker} ${item.name} ${item.businessModel} ${item.majorClients} ${item.facilities}`.toLowerCase();
      if (!searchStr.includes(currentSearchTerm)) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    let valA = a[sortColumn];
    let valB = b[sortColumn];

    if (valA === undefined) valA = 0;
    if (valB === undefined) valB = 0;

    if (typeof valA === "string") {
      return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else {
      return sortDirection === "asc" ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
    }
  });

  return filtered;
}

// 渲染核心表格
function renderTable() {
  if (currentView === 'formulas') return;

  const columns = VIEW_COLUMNS[currentView] || VIEW_COLUMNS['all'];
  const thead = document.getElementById('sheetTableHead');
  const tbody = document.getElementById('sheetTableBody');

  let headHtml = '<tr class="bg-slate-900 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">';
  columns.forEach(col => {
    const isSorted = sortColumn === col.key;
    const arrow = isSorted ? (sortDirection === 'asc' ? '▲' : '▼') : '↕';
    const activeClass = isSorted ? 'text-emerald-400 bg-slate-800/80 font-bold' : 'hover:text-slate-200 hover:bg-slate-800/40';

    headHtml += `
      <th onclick="handleSort('${col.key}')" class="py-3 px-3.5 cursor-pointer whitespace-nowrap transition-colors ${activeClass}">
        <div class="flex items-center gap-1.5">
          <span>${col.label}</span>
          <span class="text-[10px] font-mono opacity-75">${arrow}</span>
        </div>
      </th>
    `;
  });
  headHtml += '<th class="py-3 px-3 text-right">深度分析</th></tr>';
  thead.innerHTML = headHtml;

  const data = getProcessedData();
  const indicator = document.getElementById('rowCountIndicator');
  if (indicator) indicator.innerText = `顯示 ${data.length} / ${MASTER_DATA.length} 家公司`;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${columns.length + 1}" class="py-12 text-center text-slate-500 font-sans">查無相符的礦企標的，請調整搜尋關鍵字或分類篩選</td></tr>`;
    return;
  }

  let bodyHtml = '';
  data.forEach(row => {
    const badgeStyle = TICKER_BADGES[row.ticker] || "bg-slate-800 text-slate-300";
    bodyHtml += `<tr onclick="openDrawer('${row.ticker}')" class="hover:bg-slate-800/50 cursor-pointer transition-colors group">`;

    columns.forEach(col => {
      let rawVal = row[col.key];
      let formattedVal = col.format ? col.format(rawVal, row) : rawVal;

      if (col.key === 'ticker') {
        bodyHtml += `
          <td class="py-3 px-3.5 font-bold whitespace-nowrap">
            <span class="px-2 py-0.5 rounded border text-xs ${badgeStyle}">${rawVal}</span>
          </td>
        `;
      } else if (col.key === 'upside') {
        bodyHtml += `<td class="py-3 px-3.5 whitespace-nowrap text-emerald-400 font-bold">${formattedVal}</td>`;
      } else if (col.key === 'marketCap') {
        bodyHtml += `<td class="py-3 px-3.5 whitespace-nowrap text-white font-bold">${formattedVal}</td>`;
      } else if (col.key === 'price') {
        bodyHtml += `<td class="py-3 px-3.5 whitespace-nowrap font-medium text-slate-200">${formattedVal}</td>`;
      } else if (col.key === 'businessModel') {
        bodyHtml += `<td class="py-3 px-3.5 max-w-[220px] truncate text-slate-300" title="${rawVal}">${rawVal}</td>`;
      } else if (col.key === 'majorClients' || col.key === 'contracts' || col.key === 'facilities' || col.key === 'energization' || col.key === 'cod') {
        bodyHtml += `<td class="py-3 px-3.5 max-w-[260px] truncate text-slate-400" title="${rawVal}">${rawVal}</td>`;
      } else {
        bodyHtml += `<td class="py-3 px-3.5 whitespace-nowrap text-slate-300">${formattedVal !== undefined ? formattedVal : '-'}</td>`;
      }
    });

    bodyHtml += `
      <td class="py-3 px-3 text-right whitespace-nowrap">
        <button onclick="event.stopPropagation(); openDrawer('${row.ticker}')" class="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="查看深度分析">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </td>
    `;
    bodyHtml += `</tr>`;
  });

  tbody.innerHTML = bodyHtml;
}

// 渲染公式表
function renderFormulaTable() {
  const tbody = document.getElementById('formulaTableBody');
  if (!tbody) return;
  let html = '';
  MASTER_DATA.forEach(row => {
    const t = row.ticker;
    const ex = row.exchange || "NASDAQ";
    html += `
      <tr class="hover:bg-slate-800/40 transition-colors">
        <td class="py-2.5 px-3 font-bold text-emerald-400">${t}</td>
        <td class="py-2.5 px-3 text-slate-300">${row.name.split('/')[0]}</td>
        <td class="py-2.5 px-3">
          <code class="bg-slate-950 px-2 py-0.5 rounded text-cyan-300 select-all">=GOOGLEFINANCE("${ex}:${t}", "price")</code>
        </td>
        <td class="py-2.5 px-3">
          <code class="bg-slate-950 px-2 py-0.5 rounded text-indigo-300 select-all">=GOOGLEFINANCE("${ex}:${t}", "marketcap")</code>
        </td>
        <td class="py-2.5 px-3">
          <code class="bg-slate-950 px-2 py-0.5 rounded text-amber-300 select-all">=GOOGLEFINANCE("${ex}:${t}", "beta")</code>
        </td>
        <td class="py-2.5 px-3">
          <code class="bg-slate-950 px-2 py-0.5 rounded text-slate-300 select-all">=GOOGLEFINANCE("${ex}:${t}", "high52")</code>
        </td>
        <td class="py-2.5 px-3 text-right">
          <button onclick="copySingleTickerFormulas('${t}')" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition-colors">複製該行</button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

// 複製 TSV 至 Google Sheets
function copyGoogleSheetsTsv() {
  const columns = VIEW_COLUMNS[currentView] || VIEW_COLUMNS['all'];
  const data = getProcessedData();

  let tsv = columns.map(c => c.label).join('\t') + '\n';
  data.forEach(row => {
    let line = columns.map(c => {
      let v = row[c.key];
      if (c.format) v = c.format(v, row);
      if (typeof v === 'string') v = v.replace(/[\t\n\r]/g, ' ');
      return v !== undefined ? v : '';
    }).join('\t');
    tsv += line + '\n';
  });

  navigator.clipboard.writeText(tsv).then(() => {
    showToast(`已複製 ${data.length} 家公司試算表格式！可直接在 Google Sheets 按 Ctrl+V 貼上。`);
  });
}

// 匯出 CSV
function exportToCsv() {
  const columns = VIEW_COLUMNS[currentView] || VIEW_COLUMNS['all'];
  const data = getProcessedData();

  let csv = '\uFEFF';
  csv += columns.map(c => `"${c.label}"`).join(',') + '\n';

  data.forEach(row => {
    let line = columns.map(c => {
      let v = row[c.key];
      if (c.format) v = c.format(v, row);
      let str = String(v !== undefined ? v : '').replace(/"/g, '""');
      return `"${str}"`;
    }).join(',');
    csv += line + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `AI_Miners_Data_${currentView}_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("CSV 檔案下載完成！");
}

// 複製 Markdown
function copyMarkdownTable() {
  const columns = VIEW_COLUMNS[currentView] || VIEW_COLUMNS['all'];
  const data = getProcessedData();

  let md = '| ' + columns.map(c => c.label).join(' | ') + ' |\n';
  md += '| ' + columns.map(() => '---').join(' | ') + ' |\n';

  data.forEach(row => {
    let line = '| ' + columns.map(c => {
      let v = row[c.key];
      if (c.format) v = c.format(v, row);
      return String(v !== undefined ? v : '-').replace(/\|/g, '\\|');
    }).join(' | ') + ' |\n';
    md += line;
  });

  navigator.clipboard.writeText(md).then(() => {
    showToast("已複製 Markdown 格式表格！");
  });
}

// 複製全量公式
function copyAllFormulasBatch() {
  let tsv = "Ticker\tName\tPrice\tMarketCap\tBeta\t52W_High\t52W_Low\tEPS\n";
  MASTER_DATA.forEach(r => {
    tsv += `${r.ticker}\t${r.name}\t=GOOGLEFINANCE("${r.exchange || 'NASDAQ'}:${r.ticker}","price")\t=GOOGLEFINANCE("${r.exchange || 'NASDAQ'}:${r.ticker}","marketcap")/10^9\t=GOOGLEFINANCE("${r.exchange || 'NASDAQ'}:${r.ticker}","beta")\t=GOOGLEFINANCE("${r.exchange || 'NASDAQ'}:${r.ticker}","high52")\t=GOOGLEFINANCE("${r.exchange || 'NASDAQ'}:${r.ticker}","low52")\t=GOOGLEFINANCE("${r.exchange || 'NASDAQ'}:${r.ticker}","eps")\n`;
  });
  navigator.clipboard.writeText(tsv).then(() => {
    showToast("已複製完整 Google Sheets 函數集！");
  });
}

// 複製單一公司公式
function copySingleTickerFormulas(ticker) {
  const r = MASTER_DATA.find(x => x.ticker === ticker);
  if (!r) return;
  let text = `${r.ticker}\t${r.name}\t=GOOGLEFINANCE("${r.exchange || 'NASDAQ'}:${r.ticker}","price")\t=GOOGLEFINANCE("${r.exchange || 'NASDAQ'}:${r.ticker}","marketcap")/10^9\t=GOOGLEFINANCE("${r.exchange || 'NASDAQ'}:${r.ticker}","beta")`;
  navigator.clipboard.writeText(text).then(() => {
    showToast(`已複製 ${ticker} 的 Google Sheets 公式！`);
  });
}

// 標的深入分析 Drawer
function openDrawer(ticker) {
  const row = MASTER_DATA.find(x => x.ticker === ticker);
  if (!row) return;

  const container = document.getElementById('drawerContent');
  const badgeStyle = TICKER_BADGES[row.ticker] || "bg-slate-800 text-slate-300";

  let revTrendHtml = '';
  if (Array.isArray(row.revenueHistory)) {
    revTrendHtml = row.revenueHistory.map((r, i) => `
      <div class="flex-1 text-center">
        <div class="text-[10px] text-slate-500 font-mono">Q-${3-i === 0 ? '最新' : 3-i}</div>
        <div class="h-16 flex items-end justify-center my-1">
          <div class="w-7 bg-emerald-500/30 hover:bg-emerald-500/60 rounded-t transition-all flex items-center justify-center text-[10px] font-mono text-emerald-300" style="height: ${Math.max(18, (Number(r) / 200) * 64)}px">
            $${r}
          </div>
        </div>
        <div class="text-[10px] font-mono text-slate-400">$${r}M</div>
      </div>
    `).join('');
  } else {
    revTrendHtml = `<div class="text-xs text-slate-500 py-4 w-full text-center">暫無季度營收紀錄</div>`;
  }

  let capexTrendHtml = '';
  if (Array.isArray(row.capexHistory)) {
    capexTrendHtml = row.capexHistory.map((c, i) => `
      <div class="flex-1 text-center">
        <div class="text-[10px] text-slate-500 font-mono">Q-${3-i === 0 ? '最新' : 3-i}</div>
        <div class="h-16 flex items-end justify-center my-1">
          <div class="w-7 bg-amber-500/30 hover:bg-amber-500/60 rounded-t transition-all flex items-center justify-center text-[10px] font-mono text-amber-300" style="height: ${Math.max(18, (Number(c) / 250) * 64)}px">
            $${c}
          </div>
        </div>
        <div class="text-[10px] font-mono text-slate-400">$${c}M</div>
      </div>
    `).join('');
  } else {
    capexTrendHtml = `<div class="text-xs text-slate-500 py-4 w-full text-center">暫無資本支出紀錄</div>`;
  }

  container.innerHTML = `
    <div class="flex items-start justify-between border-b border-slate-800 pb-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded text-sm font-mono font-bold ${badgeStyle}">${row.ticker}</span>
          <span class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">${row.exchange || 'NASDAQ'}</span>
        </div>
        <h2 class="text-lg font-bold text-white mt-1.5">${row.name}</h2>
        <p class="text-xs text-emerald-400 mt-0.5 font-medium">${row.businessModel || '-'}</p>
      </div>
      <div class="text-right">
        <div class="text-xs text-slate-400">當前現價</div>
        <div class="text-2xl font-bold font-mono text-white">$${Number(row.price || 0).toFixed(2)}</div>
        <div class="text-xs font-mono text-emerald-400 font-semibold">目標價 $${Number(row.targetPrice || 0).toFixed(2)} (+${Number(row.upside || 0).toFixed(1)}%)</div>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-slate-950 p-3 rounded-lg border border-slate-800">
        <div class="text-[10px] text-slate-400 uppercase">總市值</div>
        <div class="text-base font-bold font-mono text-white mt-0.5">$${Number(row.marketCap || 0).toFixed(2)}B</div>
      </div>
      <div class="bg-slate-950 p-3 rounded-lg border border-slate-800">
        <div class="text-[10px] text-slate-400 uppercase">營運電力 / 儲備</div>
        <div class="text-base font-bold font-mono text-emerald-400 mt-0.5">${row.opMw || 0} / ${row.pipelineMw || 0} MW</div>
      </div>
      <div class="bg-slate-950 p-3 rounded-lg border border-slate-800">
        <div class="text-[10px] text-slate-400 uppercase">EV/MW 估值</div>
        <div class="text-base font-bold font-mono text-cyan-400 mt-0.5">$${Number(row.evMw || 0).toFixed(1)}M</div>
      </div>
      <div class="bg-slate-950 p-3 rounded-lg border border-slate-800">
        <div class="text-[10px] text-slate-400 uppercase">在手合約總量</div>
        <div class="text-base font-bold font-mono text-amber-400 mt-0.5">${row.backlogText || (row.backlogValue ? `$${row.backlogValue}B` : '-')}</div>
      </div>
    </div>

    <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
      <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        土地電力基地與投產時程 (Infrastructure Pipeline)
      </h3>
      <div class="text-xs space-y-1.5 text-slate-300">
        <p><strong class="text-slate-400">主要基地：</strong> ${row.facilities || '-'}</p>
        <p><strong class="text-slate-400">通電進度：</strong> ${row.energization || '-'}</p>
        <p><strong class="text-slate-400">商轉 (COD)：</strong> <span class="text-emerald-300 font-mono">${row.cod || '-'}</span></p>
      </div>
    </div>

    <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
      <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        核心客戶長約細節與鎖定比例
      </h3>
      <div class="text-xs space-y-1.5 text-slate-300">
        <p><strong class="text-slate-400">代表客戶：</strong> ${row.majorClients || '-'}</p>
        <p><strong class="text-slate-400">合約條款：</strong> ${row.contracts || '-'}</p>
        <p><strong class="text-slate-400">鎖定比率：</strong> <span class="text-cyan-300 font-mono">${row.contractRatio || '-'}</span></p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-bold text-slate-300">近四季營收趨勢 ($M)</span>
          <span class="text-[11px] font-mono text-emerald-400">+${Number(row.yoy || 0)}% YoY</span>
        </div>
        <div class="flex items-end justify-between pt-2">
          ${revTrendHtml}
        </div>
      </div>

      <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-bold text-slate-300">近四季 CapEx 趨勢 ($M)</span>
          <span class="text-[11px] font-mono text-amber-400">機房建設支出</span>
        </div>
        <div class="flex items-end justify-between pt-2">
          ${capexTrendHtml}
        </div>
      </div>
    </div>

    <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
      <div>
        <div class="text-slate-400">最新季度每股盈餘 (EPS)</div>
        <div class="font-mono text-sm font-bold text-white mt-0.5">實際 $${Number(row.latestEpsActual || 0).toFixed(2)} vs 預估 $${Number(row.latestEpsEst || 0).toFixed(2)}</div>
      </div>
      <div class="text-right">
        <div class="text-slate-400">驚喜率</div>
        <div class="font-mono text-sm font-bold text-emerald-400 mt-0.5">+${Number(row.epsSurprise || 0).toFixed(1)}% (Beat)</div>
      </div>
    </div>
  ` + (row.deepValuation ? renderDeepValuationSection(row.deepValuation) : `
    <div class="p-4 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500 font-mono">
      ⚡ 本標的微觀財務模型：即將擴充深度研究報告與 DCF 參數拆解
    </div>
  `);

  const drawer = document.getElementById('companyDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const panel = document.getElementById('drawerPanel');

  drawer.classList.remove('hidden');
  setTimeout(() => {
    backdrop.classList.remove('opacity-0');
    backdrop.classList.add('opacity-100');
    panel.classList.remove('translate-x-full');
    panel.classList.add('translate-x-0');
  }, 10);
}

function closeDrawer() {
  const backdrop = document.getElementById('drawerBackdrop');
  const panel = document.getElementById('drawerPanel');
  backdrop.classList.remove('opacity-100');
  backdrop.classList.add('opacity-0');
  panel.classList.remove('translate-x-0');
  panel.classList.add('translate-x-full');
  setTimeout(() => {
    document.getElementById('companyDrawer').classList.add('hidden');
  }, 300);
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrawer();
    closeDbModal();
  }
});

// ==========================================
// 數據庫管理與匯入/更新模態視窗 (DB Manager)
// ==========================================

function openDbModal() {
  const modal = document.getElementById('dbModal');
  const jsonText = document.getElementById('dbJsonEditor');
  const gsheetInput = document.getElementById('gsheetUrlInput');
  const msgEl = document.getElementById('dbModalMsg');
  
  if (msgEl) {
    msgEl.classList.add('hidden');
    msgEl.innerHTML = '';
  }

  // 填入目前已儲存的 Google Sheets CSV 網址
  if (gsheetInput) {
    gsheetInput.value = getSavedGsheetUrl();
  }

  // 填入目前最新的 JSON
  if (jsonText) {
    jsonText.value = JSON.stringify(MASTER_DATA, null, 2);
  }

  modal.classList.remove('hidden');
}

function closeDbModal() {
  const modal = document.getElementById('dbModal');
  if (modal) modal.classList.add('hidden');
}

// 複製最新 JSON 數據
function copyDatabaseJson() {
  const jsonStr = JSON.stringify(MASTER_DATA, null, 2);
  navigator.clipboard.writeText(jsonStr).then(() => {
    showToast("已成功複製最新完整資料庫 JSON 到剪貼簿！可直接貼回 database.js");
  });
}

// 下載 JSON 檔案
function downloadDatabaseJson() {
  const jsonStr = JSON.stringify(MASTER_DATA, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `miners_database_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("已下載 database.json 備份檔！");
}

// 觸發檔案上傳
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    document.getElementById('dbJsonEditor').value = content;
    showToast(`已成功讀取檔案 ${file.name}，請點擊「驗證並儲存匯入」！`);
  };
  reader.readAsText(file);
}

// 驗證並儲存匯入之 JSON
function applyImportedJson() {
  const jsonText = document.getElementById('dbJsonEditor').value.trim();
  const msgEl = document.getElementById('dbModalMsg');

  try {
    const parsed = JSON.parse(jsonText);

    if (!Array.isArray(parsed)) {
      throw new Error("數據格式錯誤：最外層必須是陣列 (Array)，例如 [ { ticker: 'BTBT', ... } ]");
    }

    if (parsed.length === 0) {
      throw new Error("陣列為空，請至少包含 1 家礦企數據！");
    }

    // 檢查關鍵欄位
    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      if (!item.ticker || typeof item.ticker !== 'string') {
        throw new Error(`第 ${i + 1} 筆資料缺少必填欄位 "ticker"！`);
      }
      if (!item.name) {
        throw new Error(`標的 ${item.ticker} 缺少必填欄位 "name"！`);
      }
    }

    // 驗證通過，寫入狀態與 LocalStorage
    MASTER_DATA = parsed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));

    updateDbStatusBadge(true, parsed.length);
    renderAllViews();

    closeDbModal();
    showToast(`🎉 成功匯入 ${parsed.length} 家礦企數據！總表已即時更新。`);

  } catch (err) {
    if (msgEl) {
      msgEl.classList.remove('hidden');
      msgEl.innerHTML = `<span class="font-bold">❌ 匯入失敗：</span> ${err.message}`;
    }
  }
}

// 還原官方預設資料庫
function resetToDefaultDatabase() {
  if (!confirm("確定要清除自訂匯入的數據，還原為 database.js 預設版本嗎？")) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);

  if (window.DEFAULT_MINERS_DATA && Array.isArray(window.DEFAULT_MINERS_DATA)) {
    MASTER_DATA = JSON.parse(JSON.stringify(window.DEFAULT_MINERS_DATA));
  } else {
    MASTER_DATA = [];
  }

  updateDbStatusBadge(false, MASTER_DATA.length);
  renderAllViews();

  const jsonText = document.getElementById('dbJsonEditor');
  if (jsonText) {
    jsonText.value = JSON.stringify(MASTER_DATA, null, 2);
  }

  closeDbModal();
  showToast("已成功還原為官方預設資料庫！");
}

// 切換色彩模式
function toggleTheme() {
  const html = document.documentElement;
  html.classList.toggle('dark');
  const isDark = html.classList.contains('dark');
  document.body.className = isDark 
    ? "bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300"
    : "bg-slate-100 text-slate-900 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-700";
}

// 提示訊息
let toastTimeout = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.innerText = msg;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3200);
}

// ==========================================
// 深度微觀財務指標與估值模型渲染器 (Deep Valuation Renderer)
// ==========================================

function renderDeepValuationSection(dv) {
  if (!dv) return '';

  const ue = dv.unitEconomics || {};
  const capex = dv.capexBreakdown || {};
  const margin = dv.marginsAndOpex || {};
  const dna = dv.depreciationPolicy || {};
  const cap = dv.capitalStructure || {};
  const cod = dv.codMilestones || [];
  const dcf = dv.dcfDrivers || {};

  // 1. COD 時程表 HTML
  let codRowsHtml = '';
  if (Array.isArray(cod) && cod.length > 0) {
    codRowsHtml = cod.map(item => `
      <tr class="hover:bg-slate-900/60 transition-colors">
        <td class="py-2 px-2.5 font-mono text-emerald-400 font-bold whitespace-nowrap">${item.period}</td>
        <td class="py-2 px-2.5 font-mono text-white whitespace-nowrap">${item.billableMw}</td>
        <td class="py-2 px-2.5 text-slate-300 text-[11px]">${item.sites}</td>
        <td class="py-2 px-2.5 text-cyan-300 text-[11px] whitespace-nowrap">${item.category}</td>
        <td class="py-2 px-2.5 text-slate-400 text-[11px]">${item.note}</td>
      </tr>
    `).join('');
  }

  // 2. DCF 矩陣 HTML (支援標籤字典動態匹配)
  const dcfLabelMap = {
    wacc: '加權平均資本成本 (WACC)',
    terminalMultiple: '終值退出倍數 (Terminal Multiple)',
    gpuCloudNetRevenuePerMw: 'GPU Cloud 淨產值 ($/MW/yr)',
    wholesaleLeaseRatePerKw: '批發託管月租金 ($/kW/month)',
    starwoodJvNoiMargin: 'Starwood JV NOI 利潤率',
    tier3DlcBuildCapEx: 'Tier-3 DLC 機房建設 CapEx',
    gb300HardwarePerMw: 'GB300 伺服器硬體投入',
    msftCustomerPrepaymentRate: '微軟客戶現金預付款率',
    aiCloudEbitdaMargin: 'AI 雲端專案 EBITDA 利潤率',
    longRidgeEbitdaContribution: 'Long Ridge 電廠年化 EBITDA',
    quarterlyCashSga: '每季常態性現金 SG&A 費用',
    btcDirectPowerCost: '比特幣直接開採電費 ($/BTC)',
    btcAllInCashCost: 'BTC 全包開採現金成本 ($/BTC)',
    buildingDepreciationYears: '機房設施折舊年限 (直線法)',
    gpuHardwareDepreciationYears: 'GPU 伺服器硬體折舊年限',
    asicDepreciationYears: 'ASIC 礦機折舊年限 (直線法)',
    projectDebtInterestRate: '專案融資利率 (Blended Debt)',
    convertibleDebtCoupon: '可轉換公司債加權票息',
    fullyDilutedSharesCount: '完全稀釋普通股股數',
    atmDilutionDiscount: 'ATM 增發潛在股權稀釋折價'
  };

  let dcfRowsHtml = '';
  // 先依 labelMap 順序，若 dcf 有則印出
  Object.keys(dcfLabelMap).forEach(key => {
    const data = dcf[key];
    if (data) {
      dcfRowsHtml += `
        <tr class="hover:bg-slate-900/60 transition-colors">
          <td class="py-2 px-2.5 font-medium text-slate-200 whitespace-nowrap">${dcfLabelMap[key]}</td>
          <td class="py-2 px-2.5 font-mono text-emerald-400 font-bold whitespace-nowrap">${data.base}</td>
          <td class="py-2 px-2.5 font-mono text-cyan-400 whitespace-nowrap">${data.bull}</td>
          <td class="py-2 px-2.5 font-mono text-amber-400 whitespace-nowrap">${data.bear}</td>
          <td class="py-2 px-2.5 text-slate-400 text-[11px]">${data.source}</td>
        </tr>
      `;
    }
  });

  // 3. 單價營收卡 (動態卡片)
  const ueCards = [];
  if (ue.msftRevenuePerMwYear) {
    ueCards.push({ title: '微軟 AI Cloud 隱含產值', main: `$${ue.msftRevenuePerMwYear}M /MW/yr`, sub: `$${ue.msftUnitPricePerKwMonth} /kW/月`, color: 'text-emerald-400' });
  }
  if (ue.wholesaleRevenuePerMwYear) {
    ueCards.push({ title: 'Starwood JV 批發託管產值', main: `$${ue.wholesaleRevenuePerMwYear}M /MW/yr`, sub: `$${ue.wholesaleUnitPricePerKwMonth} /kW/月`, color: 'text-emerald-400' });
  }
  if (ue.nvdaRevenuePerMwYear) {
    ueCards.push({ title: 'NVIDIA 合作案隱含產值', main: `$${ue.nvdaRevenuePerMwYear}M /MW/yr`, sub: `$${ue.nvdaUnitPricePerKwMonth} /kW/月`, color: 'text-cyan-400' });
  }
  if (ue.gpuCloudRatePerGpuHour) {
    ueCards.push({ title: '私有雲 GPU 算力報價', main: `${ue.gpuCloudRatePerGpuHour.split(' ')[0]}`, sub: 'Exaion 主權雲集群', color: 'text-cyan-400' });
  }
  if (ue.btcAllInCashCostPerBtc) {
    ueCards.push({ title: 'BTC 全包開採現金成本', main: `$${Number(ue.btcAllInCashCostPerBtc).toLocaleString()}`, sub: '含電費+O&M+SG&A', color: 'text-amber-400' });
  }
  if (ue.wholesaleBenchmarkMwYear) {
    ueCards.push({ title: '批發託管市場基準', main: `$${ue.wholesaleBenchmarkMwYear}M`, sub: '純機房/Shell 代工', color: 'text-slate-300' });
  }

  const ueCardsHtml = ueCards.slice(0, 3).map(c => `
    <div class="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
      <div class="text-[10px] text-slate-400">${c.title}</div>
      <div class="font-mono text-sm font-bold ${c.color} mt-0.5">${c.main}</div>
      <div class="text-[10px] text-slate-400 mt-0.5 font-mono">${c.sub}</div>
    </div>
  `).join('');

  // 4. CapEx 卡 (動態卡片)
  const capexCards = [];
  if (capex.tier3DlcBuildCostPerMw) {
    capexCards.push({ title: 'DLC 機房建設 CapEx', main: `$${capex.tier3DlcBuildCostPerMw}M / MW`, sub: `200MW 總計 $${capex.tier3DlcTotalInvestment}B`, color: 'text-white' });
  }
  if (capex.greenfieldDlcBuildCostPerMw) {
    capexCards.push({ title: 'Tier-3 DLC 綠地新建', main: `$${capex.greenfieldDlcBuildCostPerMw}M / MW`, sub: `改裝約 $${capex.retrofitDlcBuildCostPerMw}M`, color: 'text-white' });
  }
  if (capex.gpuServerHardwareCostPerMw) {
    capexCards.push({ title: 'GB300 硬體投入', main: `$${capex.gpuServerHardwareCostPerMw}M / MW`, sub: `Dell 合約 $${capex.gpuHardwareTotalDeal}B`, color: 'text-cyan-400' });
  }
  if (capex.landAndPowerValuationPerMw) {
    capexCards.push({ title: '土地變電站作價折抵', main: `$${capex.landAndPowerValuationPerMw}M / MW`, sub: '注入 SPV 換 50% 股權', color: 'text-cyan-400' });
  }
  if (capex.msftPrepaymentAmount) {
    capexCards.push({ title: '微軟 20% 現金預付款', main: `$${capex.msftPrepaymentAmount}B`, sub: `${capex.msftCashPrepaymentPct}% 前期到帳`, color: 'text-emerald-400' });
  }
  if (capex.externalNonDilutivePct) {
    capexCards.push({ title: '外部無稀釋資金比率', main: `${capex.externalNonDilutivePct}%`, sub: `公司自籌 ${capex.irenSelfFundedHardwarePct}%`, color: 'text-purple-400' });
  }
  if (capex.maraSelfFundedCapexPct) {
    capexCards.push({ title: '母公司額外自籌現金', main: `${capex.maraSelfFundedCapexPct}`, sub: '由專案債與 SDV 支應', color: 'text-purple-400' });
  }

  const capexCardsHtml = capexCards.slice(0, 4).map(c => `
    <div class="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
      <div class="text-[10px] text-slate-400">${c.title}</div>
      <div class="font-mono text-xs font-bold ${c.color} mt-0.5">${c.main}</div>
      <div class="text-[10px] text-slate-500">${c.sub}</div>
    </div>
  `).join('');

  // 5. 毛利率卡 (動態卡片)
  const marginCards = [];
  if (margin.aiCloudProjectEbitdaMargin) {
    marginCards.push({ title: 'AI 雲端專案 EBITDA 利潤率', main: `${margin.aiCloudProjectEbitdaMargin}%`, sub: `年化貢獻 ~$${margin.aiCloudAnnualCashEbitda}B 現金`, color: 'text-emerald-400' });
  }
  if (margin.starwoodJvNoiMargin) {
    marginCards.push({ title: 'Starwood JV NOI 利潤率', main: `${margin.starwoodJvNoiMargin}`, sub: `歸屬年化 NOI ${margin.starwoodJvAnnualNetNoi}`, color: 'text-emerald-400' });
  }
  if (margin.aiCloudGaapOperatingMargin) {
    marginCards.push({ title: 'AI 雲端 GAAP 營業利益率', main: `${margin.aiCloudGaapOperatingMargin}`, sub: '扣除約 60% 折舊後', color: 'text-slate-300' });
  }
  if (margin.yieldOnCost) {
    marginCards.push({ title: '全案成本收益率 (Yield)', main: `${margin.yieldOnCost}`, sub: '合資專案商轉預期', color: 'text-cyan-400' });
  }
  if (margin.realPowerCost) {
    marginCards.push({ title: '實質淨電力成本', main: `${margin.realPowerCost.split(' ')[0]}`, sub: 'ERCOT長約或發電廠直供', color: 'text-amber-400' });
  }

  const marginCardsHtml = marginCards.slice(0, 3).map(c => `
    <div class="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
      <div class="text-[10px] text-slate-400">${c.title}</div>
      <div class="font-mono text-sm font-bold ${c.color} mt-0.5">${c.main}</div>
      <div class="text-[10px] text-slate-500 mt-0.5">${c.sub}</div>
    </div>
  `).join('');

  // 6. 折舊政策卡
  const dnaCards = [];
  if (dna.buildings) dnaCards.push({ title: '機房廠房建築', main: dna.buildings, color: 'text-white' });
  if (dna.substationsAndGrid) dnaCards.push({ title: '變電站與電力設施', main: dna.substationsAndGrid, color: 'text-white' });
  if (dna.powerPlantAsset) dnaCards.push({ title: '大型發電資產 (CCGT)', main: dna.powerPlantAsset, color: 'text-cyan-400' });
  if (dna.gpuHardware) dnaCards.push({ title: 'GPU 伺服器與加速卡', main: dna.gpuHardware, color: 'text-purple-400' });
  if (dna.asicMiners) dnaCards.push({ title: 'ASIC 專用礦機', main: dna.asicMiners, color: 'text-amber-400' });
  if (dna.annualProjectDnaImpact) dnaCards.push({ title: '年度折舊衝擊 (D&A)', main: dna.annualProjectDnaImpact, color: 'text-rose-400' });

  const dnaCardsHtml = dnaCards.slice(0, 4).map(c => `
    <div class="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
      <div class="text-[10px] text-slate-400">${c.title}</div>
      <div class="font-mono text-xs font-bold ${c.color} mt-0.5">${c.main}</div>
    </div>
  `).join('');

  // 7. 資本結構細節列表
  const capLabelMap = {
    convertibleNotes2033: '2033 可轉債',
    convertibleNotes2029: '2029 可轉債',
    convertibleNotes2030: '2030 可轉債',
    convertibleNotes2026: '2026 可轉債',
    convertibleNotes2031Fixed: '2031 固定利率可轉債',
    convertibleNotes2031Zero: '2031 零息可轉債',
    convertibleNotes2032Zero: '2032 零息可轉債',
    microsoftUsPrivatePlacement: '微軟專案私募債',
    microsoftDdtlLoan: '微軟專案 DDTL 信貸',
    lineOfCredit: '短期循環信貸額度',
    projectDebtTerms: '合資專案融資與閉鎖準備金',
    lockboxWaterfall: '現金流瀑布閉鎖機制',
    cashAndLiquidity: '現金與流動性部位',
    fullyDilutedShares: '完全稀釋普通股股數',
    atmRemainingCapacity: 'ATM 市價增發計畫額度',
    nvdaWarrant: 'NVIDIA 認股權證'
  };

  const capLinesHtml = Object.keys(capLabelMap)
    .filter(k => cap[k])
    .map(k => `<p><strong class="text-slate-400">• ${capLabelMap[k]}：</strong> ${cap[k]}</p>`)
    .join('');

  const fcfYearBadge = dv.fcfBreakevenPoint && dv.fcfBreakevenPoint.includes('2028') ? 'FCF 轉正: CY2028 Q2-Q3' : 'FCF 轉正: CY2027 Q3-Q4';

  return `
    <!-- Deep Valuation Container -->
    <div class="space-y-4 pt-3 border-t border-slate-800/80">
      
      <!-- Section Header -->
      <div class="flex items-center justify-between bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-950 p-3.5 rounded-xl border border-purple-500/30">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm border border-purple-500/30">
            💎
          </div>
          <div>
            <h3 class="text-xs font-bold text-white uppercase tracking-wider">法人級微觀財務指標與經濟學拆解</h3>
            <p class="text-[10px] text-purple-300/80 font-mono mt-0.5">來源報告：${dv.reportSource || '研報深度解析'}</p>
          </div>
        </div>
        <span class="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono text-[10px]">
          Buy-Side DCF Model
        </span>
      </div>

      <!-- 1. Unit Economics Card -->
      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
        <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          1. 單價營收經濟學 (Unit Economics & Power Yield)
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          ${ueCardsHtml}
        </div>
        <div class="text-[11px] space-y-1 text-slate-300 bg-slate-900/30 p-2.5 rounded-lg">
          <p><strong class="text-slate-400">合約計價架構：</strong> ${ue.contractStructure || '-'}</p>
          <p><strong class="text-slate-400">租金調漲機制：</strong> ${ue.rentEscalator || '-'}</p>
          <p><strong class="text-slate-400">BTC 直接電費 / 全包現金成本：</strong> <span class="font-mono text-amber-400">$${ue.btcDirectElectricityCostPerBtc || '-'}</span> / <span class="font-mono text-white">$${ue.btcAllInCashCostPerBtc || '-'} / BTC</span></p>
          <p><strong class="text-slate-400">電價費率與策略：</strong> ${ue.btcPowerTariff || '-'}；${ue.btcHodlStrategy || '-'}</p>
        </div>
      </div>

      <!-- 2. CapEx Breakdown Card -->
      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
        <h4 class="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          2. 資本開支與出資責任分配 (CapEx Breakdown & Funding)
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          ${capexCardsHtml}
        </div>
        <div class="text-[11px] text-slate-300 space-y-1 bg-slate-900/30 p-2.5 rounded-lg">
          <p><strong class="text-slate-400">專案融資信貸：</strong> ${capex.projectDebtFinancing || '-'}</p>
          <p><strong class="text-slate-400">未來 12～24 個月總 CapEx 指引：</strong> <span class="font-mono text-amber-300">$${capex.future12To24mTotalCapexGuidance || '-'} 億美元</span></p>
          <p><strong class="text-slate-400">出資與會計處理：</strong> ${capex.prepaymentAccounting || capex.tenantImprovementAccounting || capex.starwoodJvEquityContribution || '-'}</p>
        </div>
      </div>

      <!-- 3. Margins & Opex Card -->
      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
        <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          3. 毛利率與費用結構 (Margins & Operating Expenses)
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          ${marginCardsHtml}
        </div>
        <div class="text-[11px] text-slate-300 space-y-1 bg-slate-900/30 p-2.5 rounded-lg">
          <p><strong class="text-slate-400">常態性每季現金 SG&A：</strong> ${margin.quarterlyCashSga || '-'} (非現金 SBC 每季 ${margin.quarterlySbc || '-'})</p>
          <p><strong class="text-slate-400">比特幣挖礦現金毛利 / GAAP 毛利：</strong> ${margin.btcCashGrossMargin || '-'} vs <span class="text-rose-400">${margin.btcGaapGrossMargin || '-'}</span></p>
        </div>
      </div>

      <!-- 4. Depreciation Card -->
      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
        <h4 class="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          4. 資產折舊會計衝擊 (Depreciation & Useful Life)
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          ${dnaCardsHtml}
        </div>
        <p class="text-[11px] text-slate-400 bg-slate-900/30 p-2 rounded">${dna.accountingImpactSummary || '-'}</p>
      </div>

      <!-- 5. Capital Structure & Liquidity -->
      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
        <h4 class="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
          5. 資本結構、債務清償與流動性 (Capital Structure & Liquidity)
        </h4>
        <div class="text-[11px] text-slate-300 space-y-1.5 bg-slate-900/40 p-3 rounded-lg">
          ${capLinesHtml}
        </div>
      </div>

      <!-- 6. COD Milestones Table -->
      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            6. 商轉投產進度表 (COD Schedule) 與 ARR 躍升階梯
          </h4>
          <span class="text-[10px] font-mono text-emerald-400">${fcfYearBadge}</span>
        </div>
        <div class="overflow-x-auto border border-slate-800 rounded-lg">
          <table class="w-full text-left text-xs divide-y divide-slate-800/80">
            <thead class="bg-slate-900 text-slate-400 text-[10px] uppercase font-mono">
              <tr>
                <th class="py-2 px-2.5">時間軸</th>
                <th class="py-2 px-2.5">計費容量</th>
                <th class="py-2 px-2.5">站點與負載分配</th>
                <th class="py-2 px-2.5">業務類別</th>
                <th class="py-2 px-2.5">交付里程碑</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/40 text-[11px]">
              ${codRowsHtml}
            </tbody>
          </table>
        </div>
        <p class="text-[11px] text-emerald-300 font-mono bg-emerald-950/20 p-2 rounded border border-emerald-500/20">${dv.fcfBreakevenPoint || '-'}</p>
      </div>

      <!-- 7. DCF Driver Matrix -->
      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
        <h4 class="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          7. 買方 DCF / SOTP 估值核心假設矩陣 (Base / Bull / Bear Case)
        </h4>
        <div class="overflow-x-auto border border-slate-800 rounded-lg">
          <table class="w-full text-left text-xs divide-y divide-slate-800/80">
            <thead class="bg-slate-900 text-slate-400 text-[10px] uppercase font-mono">
              <tr>
                <th class="py-2 px-2.5">模型輸入變數</th>
                <th class="py-2 px-2.5 text-emerald-400 font-bold">基準情境 (Base)</th>
                <th class="py-2 px-2.5 text-cyan-400">樂觀 (Bull)</th>
                <th class="py-2 px-2.5 text-amber-400">保守 (Bear)</th>
                <th class="py-2 px-2.5">資料核實依據</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/40 text-[11px]">
              ${dcfRowsHtml}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}


