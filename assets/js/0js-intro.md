# Front-end JavaScript Architecture & File Index

TL;DR: This document serves as the Single Source of Truth (SSOT) index for all front-end JavaScript files within this Zero-Build, Shadow DOM-encapsulated project. Every script in the `assets/js/` directory must be registered and documented here to ensure maintainability, token efficiency, and modularity.

---

## 1. Architecture Overview

This project employs a Zero-Build engineering philosophy. All scripts are native JavaScript modules (ESM) or self-executing scripts that run directly in the browser without compilers (such as webpack or Vite). 

To prevent style pollution and class conflicts across dynamic templates, UI components are strictly encapsulated using Closed-mode Shadow DOM (`mode: 'closed'`).

All scripts are strictly categorized into semantic subdirectories under `assets/js/`:
- `core/`: Foundational engine, navigation, layout shells, routing, and theme state.
- `data/`: Pure static databases, full-text indexes, and static registries (400KB+ boundary).
- `apps/`: Complex standalone interactive applications occupying main page content.
- `topics/`: Thematic interactive research trees and knowledge matrices.
- `ui/`: Reusable layout utilities, table of contents (TOC), and micro-interaction controllers.
- `widgets/`: Embedded cards, charts, search modals, and dynamic article widgets.
- `components/`: Auto-probing renderers and utility components (e.g., LaTeX Math).
- `vendor/`: Isolated third-party external libraries.

---

## 2. Directory Index & Classification

### 2.1. Core Modules (`assets/js/core/` & `components/`)
These files form the foundational engine of the blog, handling data stores, routing, navigation, theme configurations, and core mathematical typography.

| File Name | Description |
| :--- | :--- |
| [core/core-articles-data.js](./data/core-articles-data.js) | Static database of all articles (Mirrored/Migrated to `data/`). |
| [core/core-taxonomy.js](./core/core-taxonomy.js) | Category and tag taxonomy structure definition. Configures parent-child relationships and metadata for all taxonomies. |
| [core/core-theme.js](./core/core-theme.js) | Dark/Light mode state controller. Manages user preferences in LocalStorage and injects theme attributes before DOM rendering to prevent flashing. |
| [core/core-events.js](./core/core-events.js) | Global Event Bus for cross-component communication. Allows isolated Shadow DOM components to publish and subscribe to custom events without tight coupling. |
| [core/core-header.js](./core/core-header.js) | Global header component. Uses closed Shadow DOM to encapsulate the logo, main navigation, desktop/mobile menus, and responsive collapse logic. |
| [core/core-footer.js](./core/core-footer.js) | Global footer component. Uses closed Shadow DOM to isolate copyright notices, legal disclaimers, and secondary navigation links. |
| [core/docs-router.js](./core/docs-router.js) | Client-side routing engine. Maps dynamic markdown URL paths to corresponding files and triggers structural HTML re-renders. |
| [components/smart-math-renderer.js](./components/smart-math-renderer.js) | Smart on-demand LaTeX math formula rendering engine. Features zero-overhead feature probing, anti-collision regex barriers for currencies/brackets, and markdown escape self-healing. |

### 2.2. Standalone Applications (`assets/js/apps/` & `assets/js/topics/`)
Heavy, stateful, or data-driven applications that occupy main content blocks and operate with complex user interactions or thematic knowledge trees.

| File Name | Description |
| :--- | :--- |
| [apps/app-articles-spreadsheet.js](./apps/app-articles-spreadsheet.js) | Interactive multi-column article spreadsheet (`ArticlesSpreadsheetComponent`). Encapsulates closed Shadow DOM for client-side search, column sorting, and multi-tag filtering. |
| [apps/engine-articles-filter.js](./apps/engine-articles-filter.js) | Multi-dimensional article filtering, dynamic sorting, and URL search parameter management engine (`ArticlesFilterEngine`). Completely decoupled from DOM. |
| [apps/app-dcf-demo.js](./apps/app-dcf-demo.js) | Discounted Cash Flow (DCF) valuation model simulator. Computes financial metrics dynamically based on user-adjusted growth and discount rates. |
| [apps/app-knowledge-core.js](./apps/app-knowledge-core.js) | Knowledge Base interactive hub core. Handles loading, filtering, searching, and network navigation within the Topic Knowledge system. |
| [apps/app-knowledge-graph.js](./apps/app-knowledge-graph.js) | `<mason-knowledge-graph>` Custom Element. Implements a 2D force-directed knowledge graph visualization engine with topology and tree modes. |
| [apps/app-mandala-core.js](./apps/app-mandala-core.js) | Mandala Thinking Method (3x3 grid) visual renderer. Manages viewport scaling, grid navigation, and detailed card presentation states. |
| [topics/topic-ai-economy-tree.js](./topics/topic-ai-economy-tree.js) | AI Economy & Compute Capital Cycle Master Matrix and CoT Research Studio interactive knowledge tree. |
| [topics/topic-crypto-tree.js](./topics/topic-crypto-tree.js) | Cryptocurrency & Blockchain Architecture interactive knowledge tree and research matrix. |
| [topics/topic-gold-currency-tree.js](./topics/topic-gold-currency-tree.js) | Gold & Monetary System Evolution Master Matrix and CoT Research Studio interactive knowledge tree. |
| [topics/topic-winter-tree.js](./topics/topic-winter-tree.js) | Nuclear Winter & Geopolitical Catastrophe Risk Scenarios interactive knowledge tree. |

*Note: [app-dca-simulator.js](../../tools/dca-simulator/app-dca-simulator.js) is physically located under `tools/dca-simulator/` for specialized tool isolation.*

### 2.3. UI & Layout Control (`assets/js/ui/`)
Visual utilities and structural components that manage micro-interactions, sidebars, and structural navigation layouts.

| File Name | Description |
| :--- | :--- |
| [ui/ui-collapsible-section.js](./ui/ui-collapsible-section.js) | Custom collapsibility component (`<collapsible-section>`). Implements smooth sliding transitions and toggle buttons inside an encapsulated Shadow DOM. |
| [ui/ui-section-wrapper.js](./ui/ui-section-wrapper.js) | Article section wrapper utility. Automatically groups `<h2>` content blocks into cardified container sections within `#main-content-area`. |
| [ui/ui-sidebar-control.js](./ui/ui-sidebar-control.js) | Slide-out panel coordinator. Resolves layout shifts and overlays when drawers open or close on mobile devices. |
| [ui/ui-toc-desktop.js](./ui/ui-toc-desktop.js) | Desktop Table of Contents (TOC) generator (`ArticleTOC`). Automatically scrapes page headings, tracks scrolling position, and updates active state anchors. |
| [ui/ui-toc-responsive.js](./ui/ui-toc-responsive.js) | Mobile-optimized floatable Table of Contents (`ResponsiveTocComponent`). Provides slide-in menus or overlays for reading progress tracking on small viewports. |

### 2.4. Widgets (`assets/js/widgets/`)
Embedded interactive cards and dynamic widgets injected into articles or specific page layouts.

| File Name | Description |
| :--- | :--- |
| [widgets/algo-article-recommender.js](./widgets/algo-article-recommender.js) | Pure algorithmic calculation engine (`ArticleRecommender`) for 6-dimensional institutional correlation, exponential time decay, and dual-track quota allocation. Decoupled from DOM. |
| [widgets/widget-article-series.js](./widgets/widget-article-series.js) | Series navigation box (`ArticleSeriesComponent`). Groups related parts of a multi-post essay series, rendering previous/next links and current reading milestones. |
| [widgets/widget-compute-investment-charts.js](./widgets/widget-compute-investment-charts.js) | AI Compute Infrastructure Investment Interactive Charts Widget (`ComputeInvestmentChartsWidget`). Encapsulated interactive Chart.js visualizations in closed Shadow DOM. |
| [widgets/widget-crypto-data.js](./widgets/widget-crypto-data.js) | Cryptocurrency price data parser. Manages calculations and numerical formatting for coins referenced in articles. |
| [widgets/widget-datacenter-charts.js](./widgets/widget-datacenter-charts.js) | Data Center Power & Energy Infrastructure interactive Chart.js visualizations (`DatacenterChartsWidget`) encapsulated in closed Shadow DOM. |
| [widgets/widget-global-search.js](./widgets/widget-global-search.js) | `<widget-global-search>` Custom Element. Provides global Cmd+K / Ctrl+K Spotlight search modal using Shadow DOM encapsulation. |
| [widgets/widget-knowledge-graph.js](./widgets/widget-knowledge-graph.js) | Inline knowledge connection graph. Renders lightweight node charts visually demonstrating concept linkages inside post contexts. |
| [widgets/widget-knowledge-tooltip.js](./widgets/widget-knowledge-tooltip.js) | `<widget-knowledge-tooltip>` Custom Element. Automatically scans text for knowledge repository terms and provides hover cards with Shadow DOM isolation. |
| [widgets/widget-lightbox.js](./widgets/widget-lightbox.js) | Article image lightbox component (`LightboxComponent`). Provides click-to-zoom modal with ESC dismissal and closed Shadow DOM isolation. |
| [widgets/widget-price-ticker.js](./widgets/widget-price-ticker.js) | Asset price ticker bar (`RealTimePriceComponent`). Scrolls prices horizontally across the viewport, handling DOM recycling for smooth marquee effects. |
| [widgets/widget-related-articles.js](./widgets/widget-related-articles.js) | Smart recommended posts module (`RelatedArticlesComponent`). Orchestrates `ArticleRecommender` and `RelatedArticlesStyles` to render correlation cards in closed Shadow DOM. |
| [widgets/widget-related-articles-styles.js](./widgets/widget-related-articles-styles.js) | Shadow DOM style provider (`RelatedArticlesStyles`) for Related Articles widget. Generates Grid/List layout CSS and dark mode theme rules. |
| [widgets/widget-related-coins.js](./widgets/widget-related-coins.js) | Contextual tokens widget (`RelatedCoinsComponent`). Shows interactive profiles and basic specs of crypto tokens matching article themes. |
| [widgets/widget-related-pulse.js](./widgets/widget-related-pulse.js) | Contextual pulse widget (`<related-pulse-widget>`). Recommends bite-sized news and market pulse items related to the current context. |
| [widgets/widget-track-navigator.js](./widgets/widget-track-navigator.js) | Topic Track Series Navigator Component (`TrackNavigatorComponent`). Adapts to sidebar and article body with previous/next bidirectional navigation. |

### 2.5. Data Registry & Vendor Libraries (`assets/js/data/` & `assets/js/vendor/`)
Pure static databases, registry mappings, and isolated vendor libraries.

| File Name | Description |
| :--- | :--- |
| [data/core-articles-data.js](./data/core-articles-data.js) | Static database of all articles. Contains metadata acting as the SSOT for client-side queries. |
| [data/pulse-data.js](./data/pulse-data.js) | Static database for market pulse items. Contains bite-sized updates and news used by pulse widgets. |
| [data/app-knowledge-data.js](./data/app-knowledge-data.js) | Database for the Knowledge Base. Stores nodes, links, and categorical metadata. |
| [data/app-mandala-data.js](./data/app-mandala-data.js) | Structured grid data for the Mandala tool. Stores hierarchical card text and relations. |
| [data/data-dcf-registry.js](./data/data-dcf-registry.js) | Static registration definitions for DCF models. Maps predefined sector growth rates. |
| [data/search-index.json](./data/search-index.json) | Pre-compiled JSON full-text search index consumed by client-side search. |
| [vendor/instantpage.js](./vendor/instantpage.js) | High-performance page preloader. Pre-fetches links on mouse hover to minimize latency. |

---

## 3. AI Quick Reference: Components & Mounting API

> [!TIP]
> **Token Conservation Notice for AI Agents**:
> Do NOT read the entire 20KB~100KB JavaScript source file when integrating standard components.
> Use this high-density Quick Reference table below to obtain the Mount ID, Class / Tag, and Init snippet immediately.

| Component / Subdir Path | Class / Element Tag | Mount Target (DOM) | Init Snippet / Syntax | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **Header** (`core/core-header.js`) | `HeaderComponent` | `#header-host` | `new HeaderComponent().init();` | None (Auto-loads Lightbox) |
| **Footer** (`core/core-footer.js`) | `FooterComponent` | `#footer-host` | `new FooterComponent().init();` | None |
| **Desktop TOC** (`ui/ui-toc-desktop.js`) | `ArticleTOC` | `#toc-desktop-host` | `new ArticleTOC().init();` | Scans `.prose` or `.article-body` |
| **Mobile TOC** (`ui/ui-toc-responsive.js`) | `ResponsiveTocComponent` | `#toc-mobile-target` | `new ResponsiveTocComponent().init();` | Scans `h2, h3` |
| **Lightbox** (`widgets/widget-lightbox.js`) | `LightboxComponent` | Scans `.prose img` | `new LightboxComponent().init();` | None |
| **Related Articles** (`widgets/widget-related-articles.js`) | `RelatedArticlesComponent` | `#related-articles-container` | `new RelatedArticlesComponent().init();` | `widgets/algo-article-recommender.js`, `widgets/widget-related-articles-styles.js`, `data/core-articles-data.js`, `body[data-article-id]` |
| **Article Recommender Engine** (`widgets/algo-article-recommender.js`) | `ArticleRecommender` | Standalone Engine | `new ArticleRecommender().getRelatedItems({ dataSource, currentArticleId, maxItems: 3 });` | Pure calculation (Zero DOM dependency) |
| **Related Pulse** (`widgets/widget-related-pulse.js`) | `<related-pulse-widget>` | Self-mounting tag | `<related-pulse-widget tags='["ai", "crypto"]'></related-pulse-widget>` | `data/pulse-data.js` |
| **Track Navigator** (`widgets/widget-track-navigator.js`) | `TrackNavigatorComponent` | `#track-navigator-container` | `new TrackNavigatorComponent().init();` | `data/core-articles-data.js`, `body[data-article-id]` |
| **Global Search** (`widgets/widget-global-search.js`) | `<widget-global-search>` | Self-mounting tag | `<widget-global-search></widget-global-search>` (Cmd+K) | `data/core-articles-data.js` |
| **Knowledge Tooltip** (`widgets/widget-knowledge-tooltip.js`) | `<widget-knowledge-tooltip>` | Self-mounting tag | `<widget-knowledge-tooltip></widget-knowledge-tooltip>` | `data/app-knowledge-data.js` |
| **Article Series** (`widgets/widget-article-series.js`) | `ArticleSeriesComponent` | Auto / Target | `new ArticleSeriesComponent().setSeriesName('Series Name').init();` | `data/core-articles-data.js` |
| **Collapsible Section** (`ui/ui-collapsible-section.js`) | `<collapsible-section>` | Self-mounting tag | `<collapsible-section title="..." chapter-id="sec-1" expanded></collapsible-section>` | None |
| **Math Renderer** (`components/smart-math-renderer.js`) | Auto-Probe IIFE | Automatic scan | Self-executing on `DOMContentLoaded` (Zero overhead if no LaTeX) | None (Auto-fetches KaTeX CDN) |
| **Knowledge Graph** (`apps/app-knowledge-graph.js`) | `<mason-knowledge-graph>` | Self-mounting tag | `<mason-knowledge-graph></mason-knowledge-graph>` | `data/app-knowledge-data.js` |
| **RealTime Price Ticker** (`widgets/widget-price-ticker.js`) | `RealTimePriceComponent` | `#crypto-ticker-target` | `new RealTimePriceComponent().init();` | Binance WebSocket |
| **Related Coins** (`widgets/widget-related-coins.js`) | `RelatedCoinsComponent` | Container Element | `new RelatedCoinsComponent(hostEl, assetId, cryptoAssetsData).init();` | `widgets/widget-crypto-data.js` |
| **Articles Spreadsheet** (`apps/app-articles-spreadsheet.js`) | `ArticlesSpreadsheetComponent` | `#spreadsheet-host` | `new ArticlesSpreadsheetComponent().init();` | `apps/engine-articles-filter.js`, `data/core-articles-data.js`, `core/core-taxonomy.js` |
| **Articles Filter Engine** (`apps/engine-articles-filter.js`) | `ArticlesFilterEngine` | Standalone Engine | `new ArticlesFilterEngine().filterArticles(articles, filterState);` | Pure calculation (Zero DOM dependency) |
| **DCF Calculator** (`apps/app-dcf-demo.js`) | `DcfDemoComponent` | `#dcf-demo-host` | `new DcfDemoComponent().init();` | `data/data-dcf-registry.js` |
| **Bitcoin Mandala** (`apps/app-mandala-core.js`) | `MandalaComponent` | `#mandala-host` | `new MandalaComponent().init();` | `data/app-mandala-data.js` |
| **Core Knowledge Hub** (`apps/app-knowledge-core.js`) | `CoreKnowledgeComponent` | Host ID string | `new CoreKnowledgeComponent('knowledge-host').init();` | `data/app-knowledge-data.js` |

---

## 4. Pure Data Stores & Schemas (400KB+ Data Boundary)

> [!IMPORTANT]
> **Data Inspection Policy**:
> These files are static databases storing historical content and indexes under `assets/js/data/`. 
> **AI Agents MUST NEVER read these full files** during routine UI development or page publishing. Use the schemas below to craft queries or records.

### 4.1. `data/core-articles-data.js` (~106 KB)
Global static database of articles. Exposes `window.articlesData` or array of records.
```javascript
// Record Schema
{
    id: "20260328-tech-trends-2026-2031", // Corresponds to HTML filename without extension
    title: "AI 晶片與記憶體超級週期展望 (2026-2031)",
    category: "tech-industry",            // Key in core-taxonomy.js
    track: "track-ai-semiconductor",      // One of 12 thematic tracks
    series: "算力資本週期系列",             // Optional series grouping
    seriesOrder: 1,                       // Reading order within series
    date: "2026-03-28",                   // YYYY-MM-DD
    tags: ["AI", "TSMC", "Semiconductor", "HBM"],
    description: "深入分析先進製程與 HBM 記憶體架構升級...",
    url: "../post/20260328-tech-trends-2026-2031.html"
}
```

### 4.2. `data/pulse-data.js` (~126 KB)
Market pulse updates and micro-insights. Exposes `window.pulseData`.
```javascript
// Record Schema
{
    id: "pulse-20260525-amd-helios",
    title: "AMD 發布 Helios 算力架構應戰，雲端資本支出預期上調",
    date: "2026-05-25",
    tags: ["amd", "ai", "capex", "semiconductor"],
    summary: "AMD 於最新技術日展示 Helios 機櫃級架構...",
    category: "market-pulse",
    link: "../pulse.html#pulse-20260525-amd-helios"
}
```

### 4.3. `data/app-knowledge-data.js` (~92 KB) & `data/app-mandala-data.js` (~78 KB)
Structured hierarchical knowledge maps and Mandala grids.
```javascript
// Knowledge Node Schema (app-knowledge-data.js)
{
    id: "concept-asic-vs-gpu",
    name: "ASIC vs GPU 算力權衡",
    category: "hardware",
    relations: ["concept-cuda-moat", "concept-tpu-efficiency"],
    description: "專用積體電路與通用繪圖處理器在推論工作負載上的成本結構對比..."
}
```

### 4.4. `topics/topic-*-tree.js` Series (~76 KB total)
Thematic interactive knowledge trees for in-depth research topics (AI Economy, Crypto, Gold, Nuclear Risk).

---

## 5. Maintenance Rules

1. **Subdirectory Enforcement & Prefixes**: All new scripts MUST be placed within their corresponding semantic subdirectory:
   - `core/`: Core architecture, theme, routing, global events, or global layout pieces.
   - `data/`: Pure data registries, article databases, pulse records, or static JSON indexes.
   - `apps/`: Complex standalone applications occupying main content areas.
   - `topics/`: Topic interactive knowledge matrices and research trees.
   - `ui/`: Reusable UI components handling structural layouts or micro-interactions.
   - `widgets/`: Embedded dynamic modules and cards injected within content.
   - `components/`: Self-contained, auto-probing renderers or utility components (e.g., `smart-math-renderer.js`).
   - `vendor/`: All third-party external libraries MUST be isolated within `assets/js/vendor/`.
2. **Data Formats (JS vs JSON)**: 
   - Use `data/*.js` (ESM / Native Global) for structural core data that benefits from browser module caching and direct imports.
   - Use `data/*.json` for heavy, asynchronous, or rarely needed data (e.g., `search-index.json`) fetched via `fetch()`.
3. **Token & AI Context Guardrail**:
   - AI Agents MUST consult Section 3 (AI Quick Reference) and Section 4 (Schemas) rather than inspecting full source code for component calls.
   - Searching or viewing `data/pulse-data.js` or `data/core-articles-data.js` in their entirety is strictly prohibited unless modifying data schema definitions.
4. **Type Safety & Documentation (JSDoc)**: Because this project uses a Zero-Build architecture, all `core/*` and shared utility modules MUST include JSDoc type annotations (e.g., `@param`, `@returns`, `@type`) to guarantee IDE autocomplete and maintainability.
5. **Registry Sync**: When creating a new script, it must be added to this index immediately under its respective subdirectory.
6. **Shadow DOM Enforcement**: All scripts creating interactive visual blocks must use Shadow DOM (`mode: 'closed'`) to isolate styles.
