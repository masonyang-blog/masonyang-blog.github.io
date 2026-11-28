# Content Evolution Atlas — 全站「點線面」與文章關聯視覺化儀表板

> **定位**：BOSS 專用之內部內容治理工具（`<meta name="robots" content="noindex, nofollow">`、不進 `sitemap.xml`、不加 JSON-LD）。
> **核心問題**：**「下一步該補哪條線、哪個點缺權重、哪篇長青文該保鮮？」**

---

## 1. 架構與單一掃描器原則

本 App 採 Zero-Build 純原生靜態架構，資料層完全遵循「單一 HTML 掃描器原則」：

- **唯一掃描器**：`tools/analyze_content_evolution.py`（負責掃描 `post/`、`news/`、`project/`、`knowledge/`、`ai-workflow/` 實體 HTML 主體與時間軸 DOM，產出 `link_map` 與四級演化指標）。
- **薄轉接產生器**：`apps/content-evolution-atlas/build_evolution_atlas.py`（透過 in-process `run_analysis(include_link_map=True, write_outputs=False)` 與 `tools/propagate_metrics.py` 之 `audit_freshness_cli` 結合 `assets/data/metrics-registry.json`，組裝決定性 `assets/data/content-evolution-atlas.js`，含 `evolution.metrics_freshness`；不自行解析 HTML、不重複儲存 `title`/`topicId`/`tags`）。
- **前端協調層**：`assets/js/apps/app-evolution-atlas.js`（於瀏覽器端以 `link` Join `core-articles-data.js`、`pulse-data.js`、`app-knowledge-data.js`，並驅動共用引擎 `<mason-knowledge-graph>`）。
- **入口頁面**：`apps/content-evolution-atlas/index.html`。

> 所有節點數、邊數與覆蓋率皆由 `window.__EVOLUTION_ATLAS__.meta` 與 `evolution.overview` 動態渲染，本文件與 UI 均不寫死統計數字。

---

## 2. 資料更新與預覽方式

### 更新資料層

```powershell
# 1. 更新四級演化狀態庫 (JSON + Markdown Dashboard)
py tools/analyze_content_evolution.py

# 2. 更新 Atlas 前端資料檔 (assets/data/content-evolution-atlas.js)
py apps/content-evolution-atlas/build_evolution_atlas.py

# 選配：載入 GSC 匯出檔以排序 80/20 回灌曝光優先級
py apps/content-evolution-atlas/build_evolution_atlas.py --gsc Pages.csv
```

### 本地預覽

以本地 HTTP 伺服器開啟專案根目錄後瀏覽 `apps/content-evolution-atlas/index.html`（因 Tailwind CDN 與共用元件設計，以本地 HTTP 預覽為主）。

---

## 3. MVP 功能一覽

- **視圖 A｜演化總覽 Dashboard**
  - 四級演化漏斗 KPI（Pulse / News / Post / Topic Hub / 點實體庫 / 孤兒節點）與 Callout／時間軸覆蓋率。
  - Top 5 優先行動佇列卡片（點擊直接跳至視圖 C 鎖定節點並開啟 Inspector）。
  - 全站 6 大主題跨層指標新鮮度面板（5 大動態 `macro_ledger` + `topic-core` 靜態錨點狀態）與 Top 10 長青落後清單（點擊直接定位 Hub 或長青頁；嚴守內部專屬原則，前台 `post/topic-*.html` 不渲染任何站長警示燈）。
  - 核心主題演化矩陣（Topics）與細分賽道狀態熱圖（Tags）。
- **視圖 C｜點線面關聯網絡**
  - 共用 `<mason-knowledge-graph>` 支援 `Topology`（力導向）與 `Tree`（主題分類樹）切換。
  - 預設僅顯示 `L1C_PLANE_TOPIC` + `L2_*` 節點並隱藏 `entity_link`，避免毛線球；點擊節點自動展開 1-Hop 鄰居。
  - 支援層級勾選、Topic 篩選、異常診斷快篩（孤兒 / 缺 Callout / 缺時間軸）、`entity_link` 與 `gap_suggest` 虛線開關。
  - 頂部 Header 搜尋框與頁內搜尋框雙向同步即時過濾。
- **Inspector Drawer**
  - 顯示 In-Links / Out-Links 清單（可點擊跳轉鄰居）、GSC 曝光數（無值容錯顯示 `—`）、演化修補建議與「複製修補清單 (MD)」按鈕。

---

## 4. URL Query 參數（可書籤與分享）

| 參數 | 範例 | 說明 |
| :--- | :--- | :--- |
| `view` | `dashboard` / `graph` | 切換視圖 A / 視圖 C |
| `mode` | `topology` / `tree` | 圖譜佈局模式 |
| `topic` | `topic-ai` | 指定核心主題篩選 |
| `layer` | `L1C_PLANE_TOPIC,L2_LINE_POST` | 逗號分隔啟用層級 |
| `filter` | `orphan` / `no_callout` / `no_timeline` | 異常診斷快篩 |
| `entity` | `1` | 顯示 `entity_link` |
| `gap` | `1` | 顯示 `gap_suggest` 虛線 |
| `q` | `btc` | 關鍵字搜尋 |
| `node` | `post/topic-crypto.html` | 直接定位節點並開啟 Inspector |
