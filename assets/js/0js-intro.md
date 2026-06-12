# Front-end JavaScript Architecture & File Index

TL;DR: This document serves as the Single Source of Truth (SSOT) index for all front-end JavaScript files within this Zero-Build, Shadow DOM-encapsulated project. Every script in the `assets/js/` directory must be registered and documented here to ensure maintainability and modularity.

---

## 1. Architecture Overview

This project employs a Zero-Build engineering philosophy. All scripts are native JavaScript modules (ESM) or self-executing scripts that run directly in the browser without compilers (such as webpack or Vite). 

To prevent style pollution and class conflicts across dynamic templates, UI components are strictly encapsulated using Closed-mode Shadow DOM (`mode: 'closed'`).

---

## 2. Directory Index & Classification

All scripts are categorized into five functional namespaces according to their naming prefixes and runtime roles.

### 2.1. Core Modules (`core-`)
These files form the foundational engine of the blog, handling data stores, routing, navigation, and theme configurations.

| File Name | Description |
| :--- | :--- |
| [core-articles-data.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/core-articles-data.js) | Static database of all articles. Contains metadata (ID, title, taxonomy, tags, dates, description) acting as the SSOT for client-side queries. |
| [core-taxonomy.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/core-taxonomy.js) | Category and tag taxonomy structure definition. Configures parent-child relationships and metadata for all taxonomies. |
| [core-theme.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/core-theme.js) | Dark/Light mode state controller. Manages user preferences in LocalStorage and injects theme attributes before DOM rendering to prevent flashing. |
| [core-events.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/core-events.js) | Global Event Bus for cross-component communication. Allows isolated Shadow DOM components to publish and subscribe to custom events without tight coupling. |
| [core-header.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/core-header.js) | Global header component. Uses closed Shadow DOM to encapsulate the logo, main navigation, desktop/mobile menus, and responsive collapse logic. |
| [core-footer.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/core-footer.js) | Global footer component. Uses closed Shadow DOM to isolate copyright notices, legal disclaimers, and secondary navigation links. |

### 2.2. Standalone Applications (`app-`)
Heavy, stateful, or data-driven applications that occupy main content blocks and operate with complex user interactions.

| File Name | Description |
| :--- | :--- |
| [app-articles-spreadsheet.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/app-articles-spreadsheet.js) | Interactive multi-column article spreadsheet. Implements custom client-side searching, column sorting, and multi-tag filtering. |
| [app-dca-simulator.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/app-dca-simulator.js) | Dollar Cost Averaging (DCA) simulator application. Allows users to backtest and simulate crypto investment strategies dynamically. |
| [app-dcf-demo.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/app-dcf-demo.js) | Discounted Cash Flow (DCF) valuation model simulator. Computes financial metrics dynamically based on user-adjusted growth and discount rates. |
| [app-knowledge-core.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/app-knowledge-core.js) | Knowledge Base interactive hub core. Handles loading, filtering, searching, and network navigation within the Topic Knowledge system. |
| [app-knowledge-data.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/app-knowledge-data.js) | Database for the Knowledge Base. Stores nodes, links, and categorical metadata used by the knowledge visualization interfaces. |
| [app-mandala-core.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/app-mandala-core.js) | Mandala Thinking Method (3x3 grid) visual renderer. Manages viewport scaling, grid navigation, and detailed card presentation states. |
| [app-mandala-data.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/app-mandala-data.js) | Structured grid data for the Mandala tool. Stores hierarchical card text and relations. |

### 2.3. UI & Layout Control (`ui-`)
Visual utilities and structural components that manage micro-interactions, sidebars, and structural navigation layouts.

| File Name | Description |
| :--- | :--- |
| [ui-collapsible-section.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/ui-collapsible-section.js) | Custom collapsibility component. Implements smooth sliding transitions and toggle buttons inside an encapsulated Shadow DOM. |
| [ui-sidebar-control.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/ui-sidebar-control.js) | Slide-out panel coordinator. Resolves layout layout shifts and overlays when drawers open or close on mobile devices. |
| [ui-toc-desktop.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/ui-toc-desktop.js) | Desktop Table of Contents (TOC) generator. Automatically scrapes page headings, tracks scrolling position, and updates active state anchors. |
| [ui-toc-responsive.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/ui-toc-responsive.js) | Mobile-optimized floatable Table of Contents. Provides slide-in menus or overlays for reading progress tracking on small viewports. |

### 2.4. Widgets (`widget-`)
Embedded interactive cards and dynamic widgets injected into articles or specific page layouts.

| File Name | Description |
| :--- | :--- |
| [widget-article-series.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/widget-article-series.js) | Series navigation box. Groups related parts of a multi-post essay series, rendering previous/next links and current reading milestones. |
| [widget-crypto-data.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/widget-crypto-data.js) | Cryptocurrency price data parser. Manages calculations and numerical formatting for coins referenced in articles. |
| [widget-knowledge-graph.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/widget-knowledge-graph.js) | Inline knowledge connection graph. Renders lightweight node charts visually demonstrating concept linkages inside post contexts. |
| [widget-price-ticker.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/widget-price-ticker.js) | Asset price ticker bar. Scrolls prices horizontally across the viewport, handling DOM recycling for smooth marquee effects. |
| [widget-related-articles.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/widget-related-articles.js) | Smart recommended posts module. Processes articles' tags dynamically to recommend relevant write-ups based on overlapping categories. |
| [widget-related-coins.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/widget-related-coins.js) | Contextual tokens widget. Shows interactive profiles and basic specs of crypto tokens matching article themes. |
| [widget-related-pulse.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/widget-related-pulse.js) | Contextual pulse widget. Recommends bite-sized news and market pulse items related to the current context. |

### 2.5. Data Registry, Routing & Utilities
General routers, static databases, and registry mappings that do not carry standard architectural prefixes.

| File Name | Description |
| :--- | :--- |
| [data-dcf-registry.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/data-dcf-registry.js) | Static registration definitions for DCF models. Maps predefined sector growth rates and financial constants to target tickers. |
| [pulse-data.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/pulse-data.js) | Static database for market pulse items. Contains bite-sized updates and news used by pulse widgets. |
| [search-index.json](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/search-index.json) | Pre-compiled JSON full-text search index. Consumed by search functionalities for client-side fuzzy searching. |
| [docs-router.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/docs-router.js) | Client-side routing engine. Maps dynamic markdown URL paths to corresponding files and triggers structural HTML re-renders. |
| [vendor/instantpage.js](file:///c:/Users/G1/00.coding%20workspace/masonyang-blog/assets/js/vendor/instantpage.js) | High-performance page preloader. Listens to mouseover events on links to prefetch documents, minimizing client navigation latency. |

---

## 3. Maintenance Rules

1. **Explicit Prefixes**: New scripts must follow semantic naming conventions based on their domain:
   - `core-*`: Core architecture, theme, routing, global events, or global layout pieces.
   - `app-*`: Complex, standalone applications occupying main content areas.
   - `ui-*`: Reusable UI components handling structural layouts or micro-interactions.
   - `widget-*`: Embedded dynamic modules, often injected within content.
   - `util-*`: Pure utility functions and shared helpers (e.g., `util-math.js`, `util-format.js`).
   - `data-*` or `[namespace]-data.js`: Pure data registries or static DB files. If attached to a specific feature, append `-data.js` (e.g., `app-knowledge-data.js`).
   - **`vendor/`**: All third-party external libraries MUST be isolated within the `assets/js/vendor/` directory. Ad-hoc scripts must not be placed directly in `assets/js`.
2. **Data Formats (JS vs JSON)**: 
   - Use `*-data.js` (ESM) for structural core data that benefits from browser module caching and direct imports.
   - Use `*.json` for heavy, asynchronous, or rarely needed data (e.g., `search-index.json`) fetched via `fetch()`.
3. **Type Safety & Documentation (JSDoc)**: Because this project uses a Zero-Build architecture, all `core-*` and `util-*` modules MUST include JSDoc type annotations (e.g., `@param`, `@returns`, `@type`) to guarantee IDE autocomplete and maintainability.
4. **Registry Sync**: When creating a new script, it must be added to this index immediately.
5. **Shadow DOM Enforcement**: All scripts creating interactive visual blocks must use Shadow DOM (`mode: 'closed'`) to isolate styles.
