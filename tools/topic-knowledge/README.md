# Topic Knowledge Graph 工具與組件目錄 (`tools/topic-knowledge/`)

本目錄收納 [Mason Yang Blog](GEMINI.md) 中，與 `post/crypto-knowledge.html` 互動式知識圖譜相關的所有前端組件、AST 斷鏈校驗腳本與 Graphify 數據導出工具。

---

## 1. 目錄結構 (Directory Layout)

```
tools/topic-knowledge/
├── README.md                          # 本說明文檔
├── crypto-knowledge.html               # 現代化 2D 互動知識圖譜主頁面
├── app-knowledge-graph.js             # Zero-Build Custom Element (<mason-knowledge-graph>) Shadow DOM 引擎
└── build_knowledge_topology.py        # Graphify AST 實體網絡校驗與 JSON 拓撲匯出工具
```

---

## 2. 組件與工具說明

### 2.1 `app-knowledge-graph.js`
- **職責**：原生 Custom Element `<mason-knowledge-graph>`。
- **架構**：Shadow DOM (`mode: 'closed'`) 樣式隔離，採用 Vanilla JS 60fps Canvas 2D 力導向 (Force-Directed) 物理模擬器。
- **功能**：
  - 支援 `Topology View` (拓撲圖)、`Tree View` (階層樹狀圖) 二態切換。
  - 支援暗黑/亮色主題動態色盤切換、發光節點 (Glowing Nodes)、滾輪 Zoom/Pan 平移與拖曳。

### 2.2 `build_knowledge_topology.py`
- **職責**：將 `graphify extract . --code-only` 產出的 `graphify-out/graph.json` 與全站 JS 數據庫 (`assets/js/app-knowledge-data.js`) 進行雙向交叉對比。
- **功能**：
  - 檢查有無懸空/斷鏈之知識卡片 (Orphan Nodes Detection)。
  - 自動匯出標準化圖論 JSON 數據檔 `assets/data/knowledge-graph-topology.json`。

---

## 3. 使用方式 (Usage SOP)

```powershell
# 1. 執行 Graphify 本機 AST 解析
graphify extract . --code-only

# 2. 執行拓撲網絡校驗與 JSON 產出腳本
python tools/topic-knowledge/build_knowledge_topology.py
```
