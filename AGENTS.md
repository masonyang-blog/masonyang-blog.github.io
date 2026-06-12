# Mason Yang Blog — Agent 入口 (AGENTS.md)

> **適用範圍（請先讀）**
>
> - **本檔僅供 [Cursor](https://cursor.com) IDE 使用**：作為 Cursor Agent 的專案級入口，說明在本 repo 內應遵循的讀取順序與協議摘要。
> - **其他 IDE（VS Code、JetBrains、Vim、Antigravity 等）可完全忽略本檔**：不必開啟、不必載入、不必把內容寫進該 IDE 的規則設定。
> - **共用規範不受本檔約束**：無論使用哪個 IDE，專案開發與 AI 協作仍以 [`GEMINI.md`](GEMINI.md)、[`.agents/rules.md`](.agents/rules.md)、[`doc/`](doc/) 為準。
> - 若使用 Cursor，可另搭配 [`.cursor/rules/`](.cursor/rules/)（Project Rules）；該目錄同樣僅 Cursor 會自動注入，其他 IDE 可忽略。

---

本 repo 在 **Cursor** 內的 AI 協作以 **引用式架構** 為準：規格只維護在 `doc/` 與 `.agents/`，本檔僅負責 **導航與強制讀取順序**。

## 強制讀取鏈 (每次實質開發前)

1. **[`GEMINI.md`](GEMINI.md)** — 專案憲法（Hard Rules、人格、任務協議底線）
2. **[`.agents/rules.md`](.agents/rules.md)** — 規則路由器（SSOT 路徑索引、技能觸發表）
3. **按需** — 依任務讀取 `.agents/rules.md` 表中對應的 `doc/*.md`，或啟動 `.agents/skills/*/SKILL.md`

架構說明見 [`doc/core/meta-skills-guide.md`](doc/core/meta-skills-guide.md)。

## 執行協議摘要

- **新任務**：非純調查類工作須先依 `doc/doc_task/task_template_v2.md` 建立或更新 `doc/doc_task/task_*.md`，再改程式。
- **完成定義**：須同步勾選實體任務檔；未勾選視為未完成。
- **技能**：意圖符合 `.agents/rules.md` 技能表時，**必須** 先讀取對應 `SKILL.md`，再執行工作流。
- **SSOT**：禁止在規則檔重複貼分類 ID、模板或長篇規格；一律讀取原始指南。

## Cursor 專案規則

持久化規則位於 [`.cursor/rules/`](.cursor/rules/)（`alwaysApply`），與本檔導航一致；僅 Cursor 會自動附加至對話上下文。
