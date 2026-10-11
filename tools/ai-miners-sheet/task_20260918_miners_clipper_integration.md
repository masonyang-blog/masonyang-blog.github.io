---
title: "AI 礦企對標總表與 Finance Research Clipper 連動整合"
status: "已完成"
created: "2026-09-18"
appetite: "2h"
complexity_budget: "Max 3 Phases, 單一 Bug 最多重試 2 次 (熔斷)"
current_session: "Session 3 (All Phases Completed - First Principles Refactored)"
related_drafts: []
target_post: ""
---

## 1. 目標與驗證指標 (Objective & Metrics)

- **用戶原始需求 (True Intent)**：
  使用者在瀏覽 Google Finance 取得 AI 礦企（如 IREN, CIFR, CLSK, CORZ, HUT, HIVE, BTBT, MARA, RIOT）的新聞、財報與分析師行情時，希望能藉由現有的 Chrome 擴充功能 `finance-research-clipper-oss` 一鍵抓取最新市場行情、52週高低點、目標價與 EPS 營收表現，並將這些非結構化資料無縫且精確地同步或導入至 `tools/ai-miners-sheet`（AI 礦企核心數據對標總表工作站），免去手動查表、單位換算與手動貼值的耗時痛苦。

- **核心目標**：
  1. **建立端到端數據通道**：打通 `finance-research-clipper-oss`（採集端）與 `tools/ai-miners-sheet`（展示與分析端）的資料流。
  2. **自動清洗換算符合「純數字鐵律」**：將 Google Finance 爬到的帶符號字串（如 `"$42.79"`, `"8.34B"`, `"-0.05 USD"`）自動洗淨並換算為標準單位（$B, $M, MW, 純浮點數）。
  3. **雙重整合模式支援**：
     - **模式 A (本地極速剪藏)**：Clipper 擴充功能中新增「一鍵複製為 AI 礦企 JSON」按鈕，產出標準對標模板，可直接貼入工作站「資料庫管理」或交給 AI Agent 就地覆蓋 `database.js`。
     - **模式 B (Google Sheets 雲端自動同步)**：升級 Clipper 的 GAS 寫入腳本，支援依 Ticker 自動更新專屬工作表 `AI_Miners_Sync`，讓工作站前端點擊「即時同步」時自動拉取最新報價並重算 EV 與 EV/MW。

- **邊界與假設**：
  - **資料隔離與增量合併 (Upsert/Patch)**：Google Finance 僅能抓取市場公開行情與基本財報，無法取得 AI 礦企特有的產業指標（如 `opMw` 營運電力、`facilities` 機房園區、`majorClients` 客戶、`backlogValue` 在手合約）。因此連動整合時**必須維持增量合併**，嚴禁洗掉既有的電力與合約數據。
  - **跨工作區權限**：`finance-research-clipper-oss` 位於 `C:\Users\G1\00.coding workspace\chrome plus project\finance-research-clipper-oss\`，修改該專案程式碼需注意檔案路徑與 Chrome 擴充功能重新載入生效。

---

## 2. 上下文探索與依賴 (Context Grounding)

- **SSOT 規範查閱**：已查閱 `.agents/rules.md` 對應之 `task-protocol` 與 `dev-standards` 規範。
- **影響範圍地圖 (Entity Map)**：
  - **採集端模組** (`finance-research-clipper-oss`)：
    - `crawler.js`：Google Finance SPA 4合1 走訪與資料提取邏輯（需補齊 52w low/high、分析師目標價、EPS 與營收 YoY 欄位提取）。
    - `popup-export.js` / `dashboard-actions.js`：匯出模組（新增格式化函式 `formatToMinerJson()` 與複製剪貼簿按鈕）。
    - `sidepanel.html` / `dashboard.html`：使用者觸發按鈕介面。
    - `docs/google-apps-script.md`：GAS 部署範本腳本（支援多表/依 Ticker 更新列）。
  - **展示端模組** (`tools/ai-miners-sheet`)：
    - `README.md`：第 1 節 SSOT 欄位規格、第 7 節 Google Sheets 同步指南與第 8 節連動整合架構。
    - `app.js`：現有 `syncWithGoogleSheet` CSV 解析邏輯與 `dbModal` 匯入功能。
    - `database.js`：預設核心數據庫 `DEFAULT_MINERS_DATA`。
- **前置條件 (Prerequisites)**：
  - Chrome 瀏覽器具備開發者模式並載入 `finance-research-clipper-oss`。
  - 本地能正常開啟 `tools/ai-miners-sheet/ai-miners-core-metrics-benchmark.html`。

---

## 3. 策略與架構防護 (Strategy & Guardrails)

- **DRY 檢查**：
  - 充分重用 `ai-miners-sheet/app.js` 現有的 `parseCsv()` 與數值衍生重算邏輯（`target.upside`, `target.ev`, `target.evMw`）。
  - 充分重用 `finance-research-clipper-oss` 現有的 SPA 走訪機制與 `chrome.storage.local` 本地快取。

- **架構策略與 Tree of Thoughts (ToT) [第一性原理架構重構]**：
  - **架構審查結論 (2026-09-18)**：
    經第一性原理診斷，原「Clipper 爬蟲 -> GAS doPost Upsert -> Google Sheets -> 工作站」路徑存在嚴重的過度工程（DOM 爬蟲脆弱、跨專案耦合、9檔標的人工繁瑣操作）。
  - **新選定極簡架構：職責分層 (Layered Hybrid Architecture)**
    - **動態高頻報價 (95% 常態需求)**：採用 **Google Sheets 原生 `=GOOGLEFINANCE()` 公式** 作為雲端 Live Feed，免爬蟲、零維護、Google 官方伺服器自動刷新。工作站 `app.js` 零改動直接以 `syncWithGoogleSheet` 非同步拉取 CSV 增量 Patch。
    - **低頻/新標的快剪 (5% 輔助需求)**：已完成 Phase 1 之 Clipper 數值清洗器保留為「探索新標的時的一鍵快剪工具」，作為備用手動輔助。
    - **GAS doPost 複雜後端寫入**：判定為冗餘過度工程，正式**宣告廢除 (Deprecated)**。

- **硬性禁止動作 (Guardrails)**：
  - 嚴禁破壞 `ai-miners-sheet` 的純數字鐵律（匯入或覆蓋的數值欄位絕對不可包含 `$`, `M`, `B`, `%`, `MW` 等字串）。
  - 嚴禁整筆物件盲目覆蓋導致既有之 `modelCategory`, `facilities`, `opMw`, `contracts` 等礦企專屬欄位遺失。
  - 嚴禁重啟不必要的後端服務或 GAS 腳本，維持零建置 (Zero-Build) 與純靜態輕量架構。
  - 熔斷限制：單一錯誤修復嘗試最多 2 次，失敗即停步回報。

### 鎖定檔案 (Target Files)
- `c:\Users\G1\00.coding workspace\masonyang-blog\tools\ai-miners-sheet\README.md`
- `c:\Users\G1\00.coding workspace\masonyang-blog\tools\ai-miners-sheet\app.js`
- `c:\Users\G1\00.coding workspace\masonyang-blog\tools\ai-miners-sheet\task_20260918_miners_clipper_integration.md`

---

## 4. 任務拆解與連續驗證 (Atomic Execution & Continuous Validation)

### Phase 1: Clipper 採集資料正規化與數值清洗器實作 狀態：`[已完成]`
- 成果摘要：已於 `crawler.js` 補齊 52 週高低價、目標價中位數、EPS Actual/Est 與營收成長率提取，並建立 UMD/Node/Browser 相容之純數字鐵律清洗器 `sanitizeToMinerSchema`；同步將清洗器整合至 `popup-export.js` 與 `background.js`，經單元測試全數 Exit 0 通過。

> 🏁 **Phase 1 Checkpoint (狀態收斂區)**：
> - [x] 階段所有單元驗證已通過 (Exit 0)。
> - [x] 狀態標記為 `[已完成]`，將關鍵結果以單行緊湊摘要寫入「7. 狀態收斂歷程」。
> - [x] 清理本 Phase 細節任務，立即強制停步交回控制權，等待新會話或下一階段指令。

---

### Phase 2: (備用輔助) Clipper「一鍵複製為 AI 礦企 JSON」規格收斂 狀態：`[已收斂]`
- [x] 任務 2.1: 定義單標的快剪標準規格與 `formatToMinerJson` 介面（依賴 Phase 1 已完成之 `sanitizeToMinerSchema`）。
- [x] 任務 2.2: 定位為低頻探索工具，不作為常態報價更新通道，避免人肉搬運與 DOM 變更維護負擔。

> 🏁 **Phase 2 Checkpoint (狀態收斂區)**：
> - [x] 階段規格與職責邊界已收斂釐清。
> - [x] 狀態標記為 `[已收斂]`，將關鍵結果寫入歷程。

---

### Phase 3: Google Sheets 原生 Live Feed 整合與端到端驗收 狀態：`[已完成]`
- [x] 任務 3.1 `[Blocker]`: 驗證 `tools/ai-miners-sheet/README.md` 第 7 節之 9 大礦企 `=GOOGLEFINANCE()` 公式表與 CSV 格式相容性。
- [x] 任務 3.2 `[Independent]`: 驗證 `tools/ai-miners-sheet/app.js` CSV 解析模組（`parseCsv` 與增量 Patch），確保 `price`、`marketCap`、`range52w`、`beta` 正確更新，且 `opMw`、`facilities` 與合約完整保留。
- [x] 任務 3.3 `[Independent]`: 更新 `README.md` 第 8 節，將第一性原理審查結論與分層架構完整沉澱為專案 SSOT。

> 🏁 **Phase 3 Checkpoint (狀態收斂區)**：
> - [x] 階段所有單元驗證已通過 (Exit 0)。
> - [x] 狀態標記為 `[已完成]`，將關鍵結果以單行緊湊摘要寫入「7. 狀態收斂歷程」。
> - [x] 清理本 Phase 細節任務，立即強制停步交回控制權，等待新會話或下一階段指令。

---

## 5. 事前驗屍與降級方案 (Pre-Mortem & Fallback)

- **最可能失敗場景 (Pre-Mortem)**：
  1. **Google Finance 官方伺服器偶發延遲或公式傳回 `#N/A`**：
     - 防範：`app.js` 具備 `isNaN` 嚴格過濾，若數值為空或非有效數字，自動保留既有基準值，絕不覆蓋為 `NaN` 或清空。
  2. **CSV 發布網址未開啟「變更時自動發布」導致數據未刷新**：
     - 防範：在 `README.md` 第 7.2 節特別標注警示，並提供一鍵手動刷新機制。
- **降級/回滾方案 (Blast Radius Control)**：
  - 若 Google Sheets 同步異常，工作站可隨時一鍵「還原預設資料庫」，立即回復至 `database.js` 本地 SSOT 狀態。
- **熔斷機制 (Circuit Breaker)**：單一 Bug 連續嘗試 2 次失敗立即熔斷停步，禁止第 3 次盲試，立案至 Issue Tracker 並交由人類決策。

---

## 6. 驗收標準 (Acceptance Criteria)

- [x] **知識迴圈 (Gate 2)**: 已於 `tools/ai-miners-sheet/README.md` 追加「第 8 節 Finance Research Clipper 連動整合架構與第一性原理重構」，完成 SSOT 指南同步。
- [x] **狀態隔離與安全**: 零殘留臨時測試代碼；維持博客工作站之 Zero-Build 部署架構。
- [x] **[客觀驗證 1]**: 模擬 Google Sheets 9 檔礦企 `=GOOGLEFINANCE(...)` 產生之 CSV，經 `parseCsv` 與 `syncWithGoogleSheet` 增量比對，9 檔全部更新且 Exit 0 通過。
- [x] **[客觀驗證 2]**: 既有的電力數據 (`opMw`, `pipelineMw`)、機房園區 (`facilities`)、商業模式 (`modelCategory`) 與微觀估值 (`deepValuation`) 100% 完好保留，未被覆蓋。

---

## 7. 狀態收斂歷程 (Condensed History)

- [2026-09-18] 藍圖建立完成 (Session 1)
- [2026-09-18] [Phase 1] 完成 crawler.js 與 popup-export.js 欄位提取與純數字 Sanitizer (sanitizeToMinerSchema) 實作與 Exit 0 單元驗收 (Session 2)
- [2026-09-18] [架構重構] 經第一性原理審查，廢除過度工程之 GAS doPost 寫入，重構為 Google Sheets 原生公式 Live Feed + Clipper 單標的快剪輔助 (Session 3)
- [2026-09-18] [Phase 2] Clipper 快剪定位為低頻輔助工具，完成規格邊界收斂 (Session 3)
- [2026-09-18] [Phase 3] 完成 9 大礦企 CSV 端到端模擬增量驗收 (Exit 0)，更新 README 第 8 節 SSOT 指南，全案收斂完工 (Session 3)


