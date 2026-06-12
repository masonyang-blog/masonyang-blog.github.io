/**
 * Core Knowledge Data Repository
 * [專案規格] 數據架構手冊：doc/core/tech-data-architecture.md
 * 
 * 1. 職責：定義術語、知識圖譜與心智模型。
 * 2. 欄位規範：
 *    - id: 與 Mandala 及 Articles 聯動之鎖鑰 (kebab-case)。
 *    - title: 統一標題屬性。
 *    - relatedArticleId: 聯動 ArticlesData 的 ID，觸發「深度閱讀」區塊。
 * 3. 維護規則：與 knowledge/ 目錄下的 HTML 檔案保持同步。
 */
(function (global) {
    const _knowledgeData = [
        {
            id: '20260512-ev-charging-bottleneck-analysis',
            category: 'knowledge-card',
            published: '2026-05-12',
            modified: '2026-05-12',
            tag: 'macro',
            title: 'Tesla EV Charging Bottleneck Analysis',
            desc: '分析特斯拉兆瓦級充電技術與電網整合挑戰的專題報導。',
            link: 'news/20260512-ev-charging-bottleneck-analysis.html',
            keywords: 'Tesla, MCS, Megawatt Charging, Grid'
        },
        {
            id: 'tesla-inc',
            category: 'knowledge-card',
            tag: 'infra',
            title: 'Tesla, Inc.',
            desc: '全球領先的電動車與能源公司，其超充網絡是其核心競爭力。',
            link: 'https://www.tesla.com'
        },
        {
            id: 'megawatt-charging-system',
            category: 'knowledge-card',
            tag: 'infra',
            title: 'Megawatt Charging System (MCS)',
            desc: '專為重型電動車（如 Semi）設計的兆瓦級充電標準，最高功率可達 3.75MW。',
            link: 'https://en.wikipedia.org/wiki/Megawatt_Charging_System'
        },
        {
            id: 'grid-connection-delay',
            category: 'knowledge-card',
            tag: 'risk',
            title: 'Grid Connection Delay',
            desc: '電網接入延遲已成為充電基礎設施擴張的最大非技術瓶頸，平均週期達 950 天。',
            link: ''
        },
        {
            id: 'genius-act',
            category: 'knowledge-card',
            published: '2026-04-08',
            modified: '2026-04-09',
            tag: 'reg',
            title: '美國《天才法案》(GENIUS Act) (2026)：數字資產聯邦監管、穩定幣架構與美債市場影響全解析',
            desc: '美國首部聯邦穩定幣法律。確立了 PPSI 許可制度，強制 1:1 美債儲備，將穩定幣正式納入官方金融體系。',
            link: 'knowledge/genius-act.html',
            keywords: '穩定幣監管, Genius Act, 加密法規, 合規要求, PPSI, 美債儲備',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對 **GENIUS Act** 進行深度剖析。它是美國數位金融史上的分水嶺，透過建立「許可發行人制度」與「美債儲備硬約束」，強化了美元在數位時代的霸權地位。 本篇提供具備價值的知識教育訊號，協助讀者深入了解連動關係。',
            mentions: [
                { "@type": "Thing", "name": "穩定幣監管", "sameAs": "https://zh.wikipedia.org/zh-tw/%E7%A9%A9%E5%AE%9A%E5%B9%A3" },
                { "@type": "Thing", "name": "Genius Act", "sameAs": "https://www.wikidata.org/wiki/Q126955734" }
            ]
        },
        {
            id: 'btc',
            category: 'knowledge-card',
            series: 'bitcoin',
            series_type: 'spoke',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'core',
            title: 'Bitcoin (BTC)',
            desc: '比特幣是世界上第一個去中心化的數位貨幣，由中本聰於 2008 年提出。它不依賴任何中央機構，而是通過區塊鏈技術和工作量證明（PoW）機制來確保交易的安全與紀錄的不可篡改。',
            link: 'project/btc.html',
            keywords: '比特幣是什麼, BTC 定義, 數位黃金, 中本聰, 區塊鏈貨幣, 抗通膨資產',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **core** 進行深度剖析。被視為「數位黃金」，是加密貨幣市場的價值錨定物，亦是抵抗法幣通膨的最佳工具。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入閱讀：比特幣投資全攻略。',
            mentions: [
                { "@type": "Thing", "name": "比特幣是什麼", "sameAs": "https://zh.wikipedia.org/zh-tw/比特幣是什麼" },
                { "@type": "Thing", "name": "BTC 定義", "sameAs": "https://zh.wikipedia.org/zh-tw/BTC_定義" },
                { "@type": "Thing", "name": "數位黃金", "sameAs": "https://zh.wikipedia.org/zh-tw/數位黃金" },
                { "@type": "Thing", "name": "中本聰", "sameAs": "https://zh.wikipedia.org/zh-tw/中本聰" }
            ]
        },
        {
            id: 'eth',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'core',
            title: 'Ethereum (ETH)',
            desc: '以太坊是一個具備「智能合約」功能的開源區塊鏈平台。如果說比特幣是計算機，以太坊就是世界電腦，允許開發者在其上構建各種去中心化應用程式 (DApps)。',
            link: 'project/eth.html',
            keywords: '以太坊是什麼, ETH 定義, 世界電腦, 智能合約平台, Defi 基石, DApp 運行',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **core** 進行深度剖析。DeFi、NFT、GameFi 等生態的基石，推動了區塊鏈從「貨幣」走向「應用」的革命。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入閱讀：以太坊生態系指南。',
            mentions: [
                { "@type": "Thing", "name": "以太坊是什麼", "sameAs": "https://zh.wikipedia.org/zh-tw/以太坊是什麼" },
                { "@type": "Thing", "name": "ETH 定義", "sameAs": "https://zh.wikipedia.org/zh-tw/ETH_定義" },
                { "@type": "Thing", "name": "世界電腦", "sameAs": "https://zh.wikipedia.org/zh-tw/世界電腦" },
                { "@type": "Thing", "name": "智能合約平台", "sameAs": "https://zh.wikipedia.org/zh-tw/智能合約平台" }
            ]
        },
        {
            id: 'stablecoin',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'core',
            title: 'Stablecoin (穩定幣)',
            desc: '穩定幣是一種價格與法幣（如美元）掛鉤的加密貨幣。它旨在解決加密貨幣價格波動劇烈的問題，同時保留了區塊鏈轉帳快速、低成本的特性。',
            link: 'topic-stablecoin.html',
            keywords: '穩定幣是什麼, USDT, USDC, 避險資產, 出金入金, 法幣掛鉤',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **core** 進行深度剖析。連接法幣與加密世界的橋樑，是交易、借貸與支付結算最主要的媒介。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入閱讀：穩定幣終極指南。',
            mentions: [
                { "@type": "Thing", "name": "穩定幣是什麼", "sameAs": "https://zh.wikipedia.org/zh-tw/穩定幣是什麼" },
                { "@type": "Thing", "name": "USDT", "sameAs": "https://zh.wikipedia.org/zh-tw/USDT" },
                { "@type": "Thing", "name": "USDC", "sameAs": "https://zh.wikipedia.org/zh-tw/USDC" },
                { "@type": "Thing", "name": "避險資產", "sameAs": "https://zh.wikipedia.org/zh-tw/避險資產" }
            ]
        },
        {
            id: 'us-exceptionalism',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: '美國例外主義 (US Exceptionalism)',
            desc: '指美國經濟在全球放緩的背景下，憑藉高科技創新（AI）與強勁的消費需求，展現出獨特的增長韌性。',
            link: 'knowledge/us-exceptionalism.html',
            keywords: '美國經濟, AI 創新, 美元走強, 全球資金往哪走, 風險資產避風港',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。解釋了美元資產（包括美股與加密資產）為何持續吸引全球資金。複雜的穩定性支撐了風險資產價格。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入閱讀：美國經濟韌性。',
            mentions: [
                { "@type": "Thing", "name": "美國經濟", "sameAs": "https://zh.wikipedia.org/zh-tw/美國經濟" },
                { "@type": "Thing", "name": "AI 創新", "sameAs": "https://zh.wikipedia.org/zh-tw/AI_創新" },
                { "@type": "Thing", "name": "美元走強", "sameAs": "https://zh.wikipedia.org/zh-tw/美元走強" },
                { "@type": "Thing", "name": "全球資金往哪走", "sameAs": "https://zh.wikipedia.org/zh-tw/全球資金往哪走" }
            ]
        },
        {
            id: 'neutral-rate',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: '中性利率 (Neutral Rate)',
            desc: '既不刺激也不抑制經濟增長的理論利率水平。2026 年的中性利率預計維持在 3.5% 左右，高於疫情前水平。',
            link: 'knowledge/neutral-rate.html',
            keywords: '中性利率, 何時降息, 借貸成本, 資產定價, 聯準會目標利率',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。這意味著「低利率時代」一去不復返，資產定價必須適應更高的無風險利率與機會成本。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入閱讀：利率新常態。',
            mentions: [
                { "@type": "Thing", "name": "中性利率", "sameAs": "https://zh.wikipedia.org/zh-tw/中性利率" },
                { "@type": "Thing", "name": "何時降息", "sameAs": "https://zh.wikipedia.org/zh-tw/何時降息" },
                { "@type": "Thing", "name": "借貸成本", "sameAs": "https://zh.wikipedia.org/zh-tw/借貸成本" },
                { "@type": "Thing", "name": "資產定價", "sameAs": "https://zh.wikipedia.org/zh-tw/資產定價" }
            ]
        },
        {
            id: 'liquidity-sponge',
            category: 'knowledge-card',
            series: 'bitcoin',
            series_type: 'spoke',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: '流動性海綿理論 (Liquidity Sponge) 完整指南 2026',
            desc: '描述比特幣吸收全球過剩貨幣供應的能力。當 M2 貨幣供應量增加時，比特幣往往表現優於其他資產。',
            link: 'knowledge/liquidity-sponge.html',
            keywords: '貨幣超發, 印鈔機, 購買力下降, 抗通膨, BTC vs M2',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。比特幣價格與全球 M2 增長率的耦合度越來越高，成為對沖貨幣貶值的工具。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入閱讀：M2 與比特幣。',
            mentions: [
                { "@type": "Thing", "name": "貨幣超發", "sameAs": "https://zh.wikipedia.org/zh-tw/貨幣超發" },
                { "@type": "Thing", "name": "印鈔機", "sameAs": "https://zh.wikipedia.org/zh-tw/印鈔機" },
                { "@type": "Thing", "name": "購買力下降", "sameAs": "https://zh.wikipedia.org/zh-tw/購買力下降" },
                { "@type": "Thing", "name": "抗通膨", "sameAs": "https://zh.wikipedia.org/zh-tw/抗通膨" }
            ]
        },
        {
            id: 'asset-correlation',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: '資產相關性與避險屬性 (Asset Correlation) 完整指南',
            desc: '2026 年比特幣與納斯達克指數維持高貝塔 (0.38) 相關，但與黃金相關性極低 (0.01)，顯示其風險屬性仍大於避險屬性。',
            link: 'knowledge/asset-correlation.html',
            keywords: '美股連動, 納斯達克, 避險還是風險資產, 資產組合配置, 相關係數',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。構建投資組合時的關鍵參數，打破了「數位黃金」完全避險的迷思。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入閱讀：資產相關性分析。',
            mentions: [
                { "@type": "Thing", "name": "美股連動", "sameAs": "https://zh.wikipedia.org/zh-tw/美股連動" },
                { "@type": "Thing", "name": "納斯達克", "sameAs": "https://zh.wikipedia.org/zh-tw/納斯達克" },
                { "@type": "Thing", "name": "避險還是風險資產", "sameAs": "https://zh.wikipedia.org/zh-tw/避險還是風險資產" },
                { "@type": "Thing", "name": "資產組合配置", "sameAs": "https://zh.wikipedia.org/zh-tw/資產組合配置" }
            ]
        },
        {
            id: 'btc-halving-cycle',
            category: 'knowledge-card',
            series: 'bitcoin',
            series_type: 'spoke',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'cycle',
            title: 'Four Year Cycle (四年減半週期)',
            desc: '傳統觀點認為比特幣每四年的產量減半會導致供應衝擊並推動價格暴漲。然而，2026 年的數據顯示此模型受到 ETF 流動性與宏觀因素的強烈挑戰。',
            link: 'knowledge/four-year-cycle.html',
            keywords: '比特幣減半, 四年週期, 現在在週期哪裡, 牛市結束了嗎, 歷史規律',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **cycle** 進行深度剖析。理解為什麼歷史規律可能會失效，是從新手進階到成熟投資者的必經之路。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入閱讀：週期的失效。',
            mentions: [
                { "@type": "Thing", "name": "比特幣減半", "sameAs": "https://zh.wikipedia.org/zh-tw/比特幣減半" },
                { "@type": "Thing", "name": "四年週期", "sameAs": "https://zh.wikipedia.org/zh-tw/四年週期" },
                { "@type": "Thing", "name": "現在在週期哪裡", "sameAs": "https://zh.wikipedia.org/zh-tw/現在在週期哪裡" },
                { "@type": "Thing", "name": "牛市結束了嗎", "sameAs": "https://zh.wikipedia.org/zh-tw/牛市結束了嗎" }
            ]
        },
        {
            id: 'liquidity-cycle',
            category: 'knowledge-card',
            series: 'bitcoin',
            series_type: 'spoke',
            published: '2026-02-13',
            modified: '2026-03-25',
            tag: 'cycle',
            title: '全球流動性週期 (Liquidity Cycle) 完整指南 2026',
            desc: '一個基於全球債務再融資與央行資產負債表擴張的三年週期，正逐漸取代比特幣傳統的四年減半週期。',
            link: 'knowledge/liquidity-cycle.html',
            keywords: '',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **cycle** 進行深度剖析。投資者應更多關注宏觀流動性指標（如通膨、利率），而非單純等待「減半」帶來的供應衝擊。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入閱讀：三年與四年之爭。',
            mentions: [
                
            ]
        },
        {
            id: 'rainbow-chart',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'cycle',
            title: '彩虹圖 (Rainbow Chart)',
            desc: '一種對數回歸圖表，用不同顏色的帶狀區域來標示比特幣價格處於「低估（Fire Sale）」還是「泡沫（Bubble）」階段。',
            link: 'knowledge/rainbow-chart.html',
            keywords: '比特幣便宜嗎, 現在可以買嗎, 市場過熱了嗎, 抄底指標, 長線進場點',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **cycle** 進行深度剖析。提供了長線投資者判斷進出場時機的視覺化工具，避免在情緒過熱時追高。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入閱讀：彩虹圖解析。',
            mentions: [
                { "@type": "Thing", "name": "比特幣便宜嗎", "sameAs": "https://zh.wikipedia.org/zh-tw/比特幣便宜嗎" },
                { "@type": "Thing", "name": "現在可以買嗎", "sameAs": "https://zh.wikipedia.org/zh-tw/現在可以買嗎" },
                { "@type": "Thing", "name": "市場過熱了嗎", "sameAs": "https://zh.wikipedia.org/zh-tw/市場過熱了嗎" },
                { "@type": "Thing", "name": "抄底指標", "sameAs": "https://zh.wikipedia.org/zh-tw/抄底指標" }
            ]
        },
        {
            id: 'blockchain',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'infra',
            title: 'Blockchain (區塊鏈)',
            desc: '一種分散式的數位帳本技術，資料以「區塊」的形式串接，並透過密碼學確保不可篡改。每個節點都保存一份完整的帳本副本。',
            link: '',
            keywords: '自動執行合約, Code is Law, 程式化金融, 去許可化',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **infra** 進行深度剖析。創造了「去信任化」的協作基礎，是 Web3 世界的底層操作系統。',
            mentions: [
                { "@type": "Thing", "name": "自動執行合約", "sameAs": "https://zh.wikipedia.org/zh-tw/自動執行合約" },
                { "@type": "Thing", "name": "Code is Law", "sameAs": "https://zh.wikipedia.org/zh-tw/Code_is_Law" },
                { "@type": "Thing", "name": "程式化金融", "sameAs": "https://zh.wikipedia.org/zh-tw/程式化金融" },
                { "@type": "Thing", "name": "去許可化", "sameAs": "https://zh.wikipedia.org/zh-tw/去許可化" }
            ]
        },
        {
            id: 'smart-contract',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'infra',
            title: 'Smart Contract (智能合約)',
            desc: '部署在區塊鏈上的自動執行程式碼。當滿足預設條件時，合約會自動執行相應的操作（如轉帳、發幣），無需人工干預。',
            link: '',
            keywords: '',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **infra** 進行深度剖析。實現了「程式碼即法律 (Code is Law)」，是 DeFi 與 DApps 運作的核心與靈魂。',
            mentions: [
                
            ]
        },
        {
            id: 'depin',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'infra',
            title: 'DePIN (去中心化實體基礎設施)',
            desc: 'Decentralized Physical Infrastructure Networks。利用代幣激勵，讓個人貢獻硬體資源（如 GPU、硬碟、基地台）構建基礎設施網絡。',
            link: 'post/topic-macro.html',
            keywords: '硬體挖礦, 算力租借, 實體基礎設施, Web3 硬件, RENDER, AR',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **infra** 進行深度剖析。解決了 AI 時代對算力與存儲的指數級需求，代表項目包括 Render (GPU) 與 Arweave (存儲)。 本篇提供具備價值的知識教育訊號，協助讀者深入了解見報告 5.2。',
            mentions: [
                { "@type": "Thing", "name": "硬體挖礦", "sameAs": "https://zh.wikipedia.org/zh-tw/硬體挖礦" },
                { "@type": "Thing", "name": "算力租借", "sameAs": "https://zh.wikipedia.org/zh-tw/算力租借" },
                { "@type": "Thing", "name": "實體基礎設施", "sameAs": "https://zh.wikipedia.org/zh-tw/實體基礎設施" },
                { "@type": "Thing", "name": "Web3 硬件", "sameAs": "https://zh.wikipedia.org/zh-tw/Web3_硬件" }
            ]
        },
        {
            id: 'layer2-base',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'infra',
            title: 'Base (Coinbase L2)',
            desc: '由 Coinbase 推出、基於 OP Stack 構建的以太坊 Layer 2。旨在將其龐大的 Web2 用戶群導入鏈上世界。',
            link: 'post/topic-macro.html',
            keywords: 'BASE 鏈, Coinbase L2, 以太坊擴容, 手續費便宜',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **infra** 進行深度剖析。2026 年領先的 L2 之一，展示了中心化交易所如何構建去中心化生態系統的成功範例。 本篇提供具備價值的知識教育訊號，協助讀者深入了解見報告 5.3。',
            mentions: [
                { "@type": "Thing", "name": "BASE 鏈", "sameAs": "https://zh.wikipedia.org/zh-tw/BASE_鏈" },
                { "@type": "Thing", "name": "Coinbase L2", "sameAs": "https://zh.wikipedia.org/zh-tw/Coinbase_L2" },
                { "@type": "Thing", "name": "以太坊擴容", "sameAs": "https://zh.wikipedia.org/zh-tw/以太坊擴容" },
                { "@type": "Thing", "name": "手續費便宜", "sameAs": "https://zh.wikipedia.org/zh-tw/手續費便宜" }
            ]
        },
        {
            id: 'clarity-act',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'reg',
            title: 'CLARITY Act',
            desc: '解決 SEC 與 CFTC 管轄權爭議的法案。明確定義了哪些資產屬於「數位商品」而非證券。',
            link: 'post/topic-macro.html',
            keywords: '',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **reg** 進行深度剖析。為交易所合規鋪平道路，並允許傳統銀行開始提供加密資產託管服務。 本篇提供具備價值的知識教育訊號，協助讀者深入了解見報告 3.2。',
            mentions: [
                
            ]
        },
        {
            id: 'dats',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'reg',
            title: 'DATs (數位資產財庫)',
            desc: 'Digital Asset Treasuries。指上市公司（如 MicroStrategy）將比特幣納入資產負債表作為儲備資產的策略。',
            link: 'post/topic-macro.html',
            keywords: '上市公司買比特幣, MicroStrategy 策略, 企業儲備, 機構進場',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **reg** 進行深度剖析。企業採納比特幣的里程碑，未來可能被納入 MSCI 等全球指數，帶來巨大的被動買盤。 本篇提供具備價值的知識教育訊號，協助讀者深入了解見報告 4.2。',
            mentions: [
                { "@type": "Thing", "name": "上市公司買比特幣", "sameAs": "https://zh.wikipedia.org/zh-tw/上市公司買比特幣" },
                { "@type": "Thing", "name": "MicroStrategy 策略", "sameAs": "https://zh.wikipedia.org/zh-tw/MicroStrategy_策略" },
                { "@type": "Thing", "name": "企業儲備", "sameAs": "https://zh.wikipedia.org/zh-tw/企業儲備" },
                { "@type": "Thing", "name": "機構進場", "sameAs": "https://zh.wikipedia.org/zh-tw/機構進場" }
            ]
        },
        {
            id: 'blackrock-buidl',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'reg',
            title: 'BlackRock BUIDL',
            desc: '貝萊德推出的代幣化基金。允許投資者在鏈上持有美國國債等傳統資產，並實現全天候即時結算。',
            link: 'post/topic-macro.html',
            keywords: '',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **reg** 進行深度剖析。傳統金融 (TradFi) 與去中心化金融 (DeFi) 融合的旗艦項目，推動 RWA 賽道爆發。 本篇提供具備價值的知識教育訊號，協助讀者深入了解見報告 4.4。',
            mentions: [
                
            ]
        },
        {
            id: 'coin-vs-token',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'assets',
            title: 'Coin vs. Token',
            desc: 'Coin (原生代幣) 擁有獨立的區塊鏈 (如 BTC, SOL)；Token (應用代幣) 則寄生於現有區塊鏈上 (如 ERC-20 代幣, USDT)。',
            link: '',
            keywords: '',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **assets** 進行深度剖析。區分資產的技術屬性與價值來源的基礎概念。',
            mentions: [
                
            ]
        },
        {
            id: 'rwa-asset',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'assets',
            title: 'RWA (現實世界資產)',
            desc: 'Real World Assets。將房地產、國債、藝術品等線下資產通過代幣化引入區塊鏈市場。',
            link: 'topic-rwa.html',
            keywords: '現實資產代幣化, 國債上鏈, 資產證券化, 2026 投資重點',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **assets** 進行深度剖析。2026 年核心投資敘事。Ondo Finance 等項目讓鏈上資金能無風險地獲取美債收益。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入閱讀：RWA 賽道全景。',
            mentions: [
                { "@type": "Thing", "name": "現實資產代幣化", "sameAs": "https://zh.wikipedia.org/zh-tw/現實資產代幣化" },
                { "@type": "Thing", "name": "國債上鏈", "sameAs": "https://zh.wikipedia.org/zh-tw/國債上鏈" },
                { "@type": "Thing", "name": "資產證券化", "sameAs": "https://zh.wikipedia.org/zh-tw/資產證券化" },
                { "@type": "Thing", "name": "2026 投資重點", "sameAs": "https://zh.wikipedia.org/zh-tw/2026_投資重點" }
            ]
        },
        {
            id: 'defi',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'fi',
            title: 'DeFi (去中心化金融)',
            desc: '建立在區塊鏈上的金融體系，用智能合約取代銀行與券商，提供借貸、交易、衍生品等服務。',
            link: '',
            keywords: '',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **fi** 進行深度剖析。實現金融普惠，讓資金能無許可地在全球自由流動。',
            mentions: [
                
            ]
        },
        {
            id: 'sky-protocol',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'fi',
            title: 'Sky Protocol (原 MakerDAO)',
            desc: 'MakerDAO 的轉型升級版。推出了新的穩定幣 USDS 與治理代幣 SKY，並引入具備特定功能的 SubDAOs。',
            link: 'post/topic-macro.html',
            keywords: '',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **fi** 進行深度剖析。DeFi 老牌龍頭為了適應監管（如凍結功能）與擴大採用而進行的重大戰略轉型。 本篇提供具備價值的知識教育訊號，協助讀者深入了解見報告 5.4。',
            mentions: [
                
            ]
        },
        {
            id: 'ai-agent',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'trading',
            title: 'AI Agent (AI 代理)',
            desc: '具備自主決策能力的 AI 程式。能自動分析輿情、管理鏈上資產、執行複雜的 DeFi 策略。',
            link: 'post/topic-macro.html',
            keywords: '',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **trading** 進行深度剖析。例如 Fetch.ai 與 SingularityNET 組成的 ASI 聯盟，試圖去中心化 AI 的控制權。 本篇提供具備價值的知識教育訊號，協助讀者深入了解見報告 5.5。',
            mentions: [
                
            ]
        },
        {
            id: 'wallet-types',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'security',
            title: 'Custodial vs. Non-Custodial',
            desc: '託管型 (交易所) 由平台保管私鑰；非託管型 (Metamask) 由用戶自己保管助記詞。',
            link: '',
            keywords: '託管型, 非託管型, 資產主權, 便利性, 私鑰保管',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **security** 進行深度剖析。「Not Your Keys, Not Your Coins」。資產主權與便利性之間的權衡。',
            mentions: [
                { "@type": "Thing", "name": "託管型", "sameAs": "https://zh.wikipedia.org/zh-tw/託管型" },
                { "@type": "Thing", "name": "非託管型", "sameAs": "https://zh.wikipedia.org/zh-tw/非託管型" },
                { "@type": "Thing", "name": "資產主權", "sameAs": "https://zh.wikipedia.org/zh-tw/資產主權" },
                { "@type": "Thing", "name": "便利性", "sameAs": "https://zh.wikipedia.org/zh-tw/便利性" }
            ]
        },
        {
            id: 'meme-coin',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'culture',
            title: 'Memecoin (迷因幣)',
            desc: '源自網路文化，價值主要取決於社群共識與注意力。如 DOGE, PEPE。',
            link: 'topic-meme.html',
            keywords: '迷因幣, DOGE, PEPE, 注意力經濟, 社群共識',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **culture** 進行深度剖析。展現了加密市場獨特的「注意力經濟」，風險極高但爆發力強。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入閱讀：迷因幣解析。',
            mentions: [
                { "@type": "Thing", "name": "迷因幣", "sameAs": "https://zh.wikipedia.org/zh-tw/迷因幣" },
                { "@type": "Thing", "name": "DOGE", "sameAs": "https://zh.wikipedia.org/zh-tw/DOGE" },
                { "@type": "Thing", "name": "PEPE", "sameAs": "https://zh.wikipedia.org/zh-tw/PEPE" },
                { "@type": "Thing", "name": "注意力經濟", "sameAs": "https://zh.wikipedia.org/zh-tw/注意力經濟" }
            ]
        },
        {
            id: 'modular-blockchain',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'infra',
            title: '模組化區塊鏈 (Modular Blockchain)',
            desc: '將執行、結算、共識與數據可用性解耦的區塊鏈架構。Celestia 是此領域的代表，專注於解決不可能三角。',
            link: 'knowledge/modular-blockchain.html',
            keywords: '區塊鏈架構, 模組化, 區塊鏈革命, 執行層, 數據可用性',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **infra** 進行深度剖析。區塊鏈從「單體黑莓機」走向「模組化iPhone」的架構革命，是擴展至 10 億用戶的基石。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入閱讀：模組化革命。',
            mentions: [
                { "@type": "Thing", "name": "區塊鏈架構", "sameAs": "https://zh.wikipedia.org/zh-tw/區塊鏈架構" },
                { "@type": "Thing", "name": "模組化", "sameAs": "https://zh.wikipedia.org/zh-tw/模組化" },
                { "@type": "Thing", "name": "區塊鏈革命", "sameAs": "https://zh.wikipedia.org/zh-tw/區塊鏈革命" },
                { "@type": "Thing", "name": "執行層", "sameAs": "https://zh.wikipedia.org/zh-tw/執行層" }
            ]
        },
        {
            id: 'zk-rollup',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'scaling',
            title: '零知識證明 (ZK-Rollup)',
            desc: '利用數學證明實現即時確認 (Instant Finality) 的 Layer 2 擴容方案。兼具隱私保護與極高的吞吐量。',
            link: 'knowledge/zk-rollup.html',
            keywords: '零知識證明, 即時確認, 區塊鏈擴容, 隱私保護, 吞吐量',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **scaling** 進行深度剖析。被 Vitalik 視為擴容的「聖杯」，長期來看將憑藉安全性與成本優勢取代 Optimistic Rollup。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入閱讀：ZK 終極指南。',
            mentions: [
                { "@type": "Thing", "name": "零知識證明", "sameAs": "https://zh.wikipedia.org/zh-tw/零知識證明" },
                { "@type": "Thing", "name": "即時確認", "sameAs": "https://zh.wikipedia.org/zh-tw/即時確認" },
                { "@type": "Thing", "name": "區塊鏈擴容", "sameAs": "https://zh.wikipedia.org/zh-tw/區塊鏈擴容" },
                { "@type": "Thing", "name": "隱私保護", "sameAs": "https://zh.wikipedia.org/zh-tw/隱私保護" }
            ]
        },
        {
            id: 'prediction-markets',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'app',
            title: '預測市場 (Prediction Markets)',
            desc: '去中心化的資訊發現平台 (如 Polymarket)。利用「真金白銀」的博弈來過濾雜訊，獲取真實世界的概率資訊。',
            link: 'knowledge/prediction-markets.html',
            keywords: '去中心化, 資訊發現, 博弈機制, 真實數據, 預言機',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **app** 進行深度剖析。Web3 最成功的非金融應用場景 (Consumer App)，是 AI 獲取真實數據的潛在預言機。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入閱讀：預測市場分析。',
            mentions: [
                { "@type": "Thing", "name": "去中心化", "sameAs": "https://zh.wikipedia.org/zh-tw/去中心化" },
                { "@type": "Thing", "name": "資訊發現", "sameAs": "https://zh.wikipedia.org/zh-tw/資訊發現" },
                { "@type": "Thing", "name": "博弈機制", "sameAs": "https://zh.wikipedia.org/zh-tw/博弈機制" },
                { "@type": "Thing", "name": "真實數據", "sameAs": "https://zh.wikipedia.org/zh-tw/真實數據" }
            ]
        },
        {
            id: 'knl-sov-tam',
            category: 'knowledge-card',
            series: 'bitcoin',
            series_type: 'spoke',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: '數位黃金對標法 (SoV TAM Allocation) 完整指南 2026',
            desc: '將比特幣視為數位黃金，透過對標全球黃金總市值與滲透率來估算其長期潛在價值。',
            link: 'knowledge/knl-sov-tam.html',
            keywords: '比特幣目標價, 黃金市值對標, BTC 潛力, 估值計算',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。幫助投資者設定長期預期回報與數位大宗商品的定價錨點。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：數位黃金對標法。',
            mentions: [
                { "@type": "Thing", "name": "比特幣目標價", "sameAs": "https://zh.wikipedia.org/zh-tw/比特幣目標價" },
                { "@type": "Thing", "name": "黃金市值對標", "sameAs": "https://zh.wikipedia.org/zh-tw/黃金市值對標" },
                { "@type": "Thing", "name": "BTC 潛力", "sameAs": "https://zh.wikipedia.org/zh-tw/BTC_潛力" },
                { "@type": "Thing", "name": "估值計算", "sameAs": "https://zh.wikipedia.org/zh-tw/估值計算" }
            ]
        },
        {
            id: 'knl-m2-hedge',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: 'M2 貨幣對沖敘事 (M2 Hedge) 完整指南 2026',
            desc: '衡量比特幣作為對沖全球貨幣供應量 (M2) 擴張與購買力貶值的核心工具。',
            link: 'knowledge/knl-m2-hedge.html',
            keywords: '對沖美元, 購買力護城河, M2 成長預測, 避險功能',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。理解比特幣在極端通膨與貨幣增發背景下的資產屬性。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：法幣對沖模型。',
            mentions: [
                { "@type": "Thing", "name": "對沖美元", "sameAs": "https://zh.wikipedia.org/zh-tw/對沖美元" },
                { "@type": "Thing", "name": "購買力護城河", "sameAs": "https://zh.wikipedia.org/zh-tw/購買力護城河" },
                { "@type": "Thing", "name": "M2 成長預測", "sameAs": "https://zh.wikipedia.org/zh-tw/M2_成長預測" },
                { "@type": "Thing", "name": "避險功能", "sameAs": "https://zh.wikipedia.org/zh-tw/避險功能" }
            ]
        },
        {
            id: 'knl-metcalfe',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: "梅特卡夫定律 (Metcalfe's Law) 完整指南 2026",
            desc: '由網路節點數的平方決定網路價值的經典定律，適用於比特幣用戶增長與市值的關係。',
            link: 'knowledge/knl-metcalfe.html',
            keywords: '網路效應, 比特幣用戶增長, 市值指數增長, 比特幣市值, 用戶增長率',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。揭示了網路效應如何推動比特幣實現指數級別的增長。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：梅特卡夫定律。',
            mentions: [
                { "@type": "Thing", "name": "網路效應", "sameAs": "https://zh.wikipedia.org/zh-tw/網路效應" },
                { "@type": "Thing", "name": "比特幣用戶增長", "sameAs": "https://zh.wikipedia.org/zh-tw/比特幣用戶增長" },
                { "@type": "Thing", "name": "市值指數增長", "sameAs": "https://zh.wikipedia.org/zh-tw/市值指數增長" },
                { "@type": "Thing", "name": "比特幣市值", "sameAs": "https://zh.wikipedia.org/zh-tw/比特幣市值" }
            ]
        },
        {
            id: 'knl-nvt-ratio',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: '比特幣 NVT 比率 (NVT Ratio) 完整指南 2026',
            desc: '衡量市值與鏈上交易額比例的指標，被稱為加密貨幣界的「本益比」。',
            link: 'knowledge/knl-nvt-ratio.html',
            keywords: '加密貨幣本益比, 市場估值, 交易活躍度 vs 市值, 泡沫判斷',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。用於判斷市場是否因投機過熱而導致幣價脫離網路實際效用。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：NVT 比率。',
            mentions: [
                { "@type": "Thing", "name": "加密貨幣本益比", "sameAs": "https://zh.wikipedia.org/zh-tw/加密貨幣本益比" },
                { "@type": "Thing", "name": "市場估值", "sameAs": "https://zh.wikipedia.org/zh-tw/市場估值" },
                { "@type": "Thing", "name": "交易活躍度 vs 市值", "sameAs": "https://zh.wikipedia.org/zh-tw/交易活躍度_vs_市值" },
                { "@type": "Thing", "name": "泡沫判斷", "sameAs": "https://zh.wikipedia.org/zh-tw/泡沫判斷" }
            ]
        },
        {
            id: 'knl-s2f-model',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: '庫存流量比模型 (Stock-to-Flow, S2F) 完整指南 2026',
            desc: '根據現有庫存與年度產出流量的比例來量化資產稀缺性的模型。',
            link: 'knowledge/knl-s2f-model.html',
            keywords: '供給側模型, 減半效應, 稀缺性評估, 比特幣價格支撐',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。最經典的供給側模型，用於解析比特幣減半對價格的長期影響。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：S2F 模型。',
            mentions: [
                { "@type": "Thing", "name": "供給側模型", "sameAs": "https://zh.wikipedia.org/zh-tw/供給側模型" },
                { "@type": "Thing", "name": "減半效應", "sameAs": "https://zh.wikipedia.org/zh-tw/減半效應" },
                { "@type": "Thing", "name": "稀缺性評估", "sameAs": "https://zh.wikipedia.org/zh-tw/稀缺性評估" },
                { "@type": "Thing", "name": "比特幣價格支撐", "sameAs": "https://zh.wikipedia.org/zh-tw/比特幣價格支撐" }
            ]
        },
        {
            id: 'knl-production-cost',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: '比特幣生產成本模型 (Production Cost Model) 完整指南 2026',
            desc: '基於挖礦成本（電費、設備等）來測算比特幣的鐵底價格。',
            link: 'knowledge/knl-production-cost.html',
            keywords: '邊際成本, 電力成本, 比特幣價格支撐, 挖礦成本, 比特幣價格支撐',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。為市場提供了一個基於物理能量消耗的剛性價值支撐參考。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：邊際生產成本。',
            mentions: [
                { "@type": "Thing", "name": "邊際成本", "sameAs": "https://zh.wikipedia.org/zh-tw/邊際成本" },
                { "@type": "Thing", "name": "電力成本", "sameAs": "https://zh.wikipedia.org/zh-tw/電力成本" },
                { "@type": "Thing", "name": "比特幣價格支撐", "sameAs": "https://zh.wikipedia.org/zh-tw/比特幣價格支撐" },
                { "@type": "Thing", "name": "挖礦成本", "sameAs": "https://zh.wikipedia.org/zh-tw/挖礦成本" }
            ]
        },
        {
            id: 'knl-mvrv-ratio',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: '比特幣 MVRV 比率 (MVRV Ratio) 完整指南 2026',
            desc: '流通市值與實現市值的比值，反映投資者的平均盈利程度。',
            link: 'knowledge/knl-mvrv-ratio.html',
            keywords: '比特幣抄底, 逃頂指標, 平均盈利程度, 市場吸籌, 派發區間',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。精準識別市場頂部（極度獲利）與底部（極度虧損）區域。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：MVRV 比率。',
            mentions: [
                { "@type": "Thing", "name": "比特幣抄底", "sameAs": "https://zh.wikipedia.org/zh-tw/比特幣抄底" },
                { "@type": "Thing", "name": "逃頂指標", "sameAs": "https://zh.wikipedia.org/zh-tw/逃頂指標" },
                { "@type": "Thing", "name": "平均盈利程度", "sameAs": "https://zh.wikipedia.org/zh-tw/平均盈利程度" },
                { "@type": "Thing", "name": "市場吸籌", "sameAs": "https://zh.wikipedia.org/zh-tw/市場吸籌" }
            ]
        },
        {
            id: 'knl-power-law',
            category: 'knowledge-card',
            series: 'bitcoin',
            series_type: 'spoke',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: '比特幣冪律模型 (Bitcoin Power Law Model)',
            desc: '認為比特幣價格隨時間呈冪律增長的物理規律模型。',
            link: 'knowledge/knl-power-law.html',
            keywords: '長線走勢圖, 價格走廊, 不看短期波動, BTC 物理規律',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。提供了一個穩定、長期的價格走廊，不受短期噪音干擾。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：比特幣冪律模型。',
            mentions: [
                { "@type": "Thing", "name": "長線走勢圖", "sameAs": "https://zh.wikipedia.org/zh-tw/長線走勢圖" },
                { "@type": "Thing", "name": "價格走廊", "sameAs": "https://zh.wikipedia.org/zh-tw/價格走廊" },
                { "@type": "Thing", "name": "不看短期波動", "sameAs": "https://zh.wikipedia.org/zh-tw/不看短期波動" },
                { "@type": "Thing", "name": "BTC 物理規律", "sameAs": "https://zh.wikipedia.org/zh-tw/BTC_物理規律" }
            ]
        },
        {
            id: 'knl-global-liquidity',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: '全球流動性概覽 (Global Liquidity) 完整指南 2026',
            desc: '追蹤全球貨幣供應量與央行資產負債表，衡量流動性週期對資產的推動力。',
            link: 'knowledge/knl-global-liquidity.html',
            keywords: '',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。揭示了宏觀金融環境才是比特幣牛熊切換的終極推手內容。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：宏觀流動性指標。',
            mentions: [
                
            ]
        },
        {
            id: 'knl-macro-cpi',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: '消費者物價指數 (CPI) 完整指南 2026',
            desc: '消費者物價指數，衡量生活成本變動的核心指標。',
            link: 'knowledge/knl-macro-cpi.html',
            keywords: '物價上漲, 通膨數據, 聯準會臉色, 資產殺手, 生活成本',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。直接決定聯準會的貨幣政策走向，對風險資產價格有極強的週期驅動力。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：CPI 與通膨路徑。',
            mentions: [
                { "@type": "Thing", "name": "物價上漲", "sameAs": "https://zh.wikipedia.org/zh-tw/物價上漲" },
                { "@type": "Thing", "name": "通膨數據", "sameAs": "https://zh.wikipedia.org/zh-tw/通膨數據" },
                { "@type": "Thing", "name": "聯準會臉色", "sameAs": "https://zh.wikipedia.org/zh-tw/聯準會臉色" },
                { "@type": "Thing", "name": "資產殺手", "sameAs": "https://zh.wikipedia.org/zh-tw/資產殺手" }
            ]
        },
        {
            id: 'knl-macro-m1',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: 'U.S. Money Supply (M1) 完整指南 2026',
            desc: '美國狹義貨幣供應量，反映市場中最具流動性的現金與存款量。',
            link: 'knowledge/knl-macro-m1.html',
            keywords: '現金總量, 貨幣流動性, 資產上漲燃料, 印錢速度',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。M1 的急劇增長通常預示著流動性氾濫，是資產價格上漲的燃料。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：M1 貨幣供應。',
            mentions: [
                { "@type": "Thing", "name": "現金總量", "sameAs": "https://zh.wikipedia.org/zh-tw/現金總量" },
                { "@type": "Thing", "name": "貨幣流動性", "sameAs": "https://zh.wikipedia.org/zh-tw/貨幣流動性" },
                { "@type": "Thing", "name": "資產上漲燃料", "sameAs": "https://zh.wikipedia.org/zh-tw/資產上漲燃料" },
                { "@type": "Thing", "name": "印錢速度", "sameAs": "https://zh.wikipedia.org/zh-tw/印錢速度" }
            ]
        },
        {
            id: 'knl-macro-m2',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: 'U.S. Money Supply (M2) 完整指南 2026',
            desc: '美國廣義貨幣供應量，是衡量全球宏觀流動性水位的關鍵指標。',
            link: 'knowledge/knl-macro-m2.html',
            keywords: '全球錢變多了嗎, 流動性充裕, 大放水, 風險資產漲幅',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。比特幣價格與 M2 的增長呈現高度正相關，是抗通膨屬性的核心支撐。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：M2 宏觀水位。',
            mentions: [
                { "@type": "Thing", "name": "全球錢變多了嗎", "sameAs": "https://zh.wikipedia.org/zh-tw/全球錢變多了嗎" },
                { "@type": "Thing", "name": "流動性充裕", "sameAs": "https://zh.wikipedia.org/zh-tw/流動性充裕" },
                { "@type": "Thing", "name": "大放水", "sameAs": "https://zh.wikipedia.org/zh-tw/大放水" },
                { "@type": "Thing", "name": "風險資產漲幅", "sameAs": "https://zh.wikipedia.org/zh-tw/風險資產漲幅" }
            ]
        },
        {
            id: 'knl-macro-usd-devaluation',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: '美元貶值趨勢 (USD Devaluation) 完整指南 2026',
            desc: '描述美元購買力隨時間推移持續損耗的現象。',
            link: 'knowledge/knl-macro-usd-devaluation.html',
            keywords: '美金不值錢了, 儲蓄被蠶食, 為什麼要換成 BTC, 法幣風險',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。比特幣被設計為一種「抗貶值」的數位資產，是防禦法幣系統風險的終極護城河。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：貨幣購買力損耗。',
            mentions: [
                { "@type": "Thing", "name": "美金不值錢了", "sameAs": "https://zh.wikipedia.org/zh-tw/美金不值錢了" },
                { "@type": "Thing", "name": "儲蓄被蠶食", "sameAs": "https://zh.wikipedia.org/zh-tw/儲蓄被蠶食" },
                { "@type": "Thing", "name": "為什麼要換成 BTC", "sameAs": "https://zh.wikipedia.org/zh-tw/為什麼要換成_BTC" },
                { "@type": "Thing", "name": "法幣風險", "sameAs": "https://zh.wikipedia.org/zh-tw/法幣風險" }
            ]
        },
        {
            id: 'knl-macro-treasury-yield',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: '美國十年期公債殖利率 (Treasury Yield) 完整指南 2026',
            desc: '美債收益率，代表市場的無風險利率與經濟增長預期。',
            link: 'knowledge/knl-macro-treasury-yield.html',
            keywords: '無風險利率, 經濟衰退預兆, 債市波動, 機構資金轉向',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。收益率曲線倒掛通常預示著衰退風險，影響機構資金在避險與風險資產間的切換。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：美債收益率曲線。',
            mentions: [
                { "@type": "Thing", "name": "無風險利率", "sameAs": "https://zh.wikipedia.org/zh-tw/無風險利率" },
                { "@type": "Thing", "name": "經濟衰退預兆", "sameAs": "https://zh.wikipedia.org/zh-tw/經濟衰退預兆" },
                { "@type": "Thing", "name": "債市波動", "sameAs": "https://zh.wikipedia.org/zh-tw/債市波動" },
                { "@type": "Thing", "name": "機構資金轉向", "sameAs": "https://zh.wikipedia.org/zh-tw/機構資金轉向" }
            ]
        },
        {
            id: 'knl-macro-mortgage-rate',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: '美國房貸利率 (Mortgage Rate) 完整指南 2026',
            desc: '反映實體經濟借貸成本的指標，受基準利率與債市波動影響。',
            link: 'knowledge/knl-macro-mortgage-rate.html',
            keywords: '買房成本, 實體經濟壓力, 資金活水, 利率何時見頂',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。高昂的借貸成本會抑制流動性從房市釋出，間接影響資本市場的活水。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：房貸利率與經濟轉機。',
            mentions: [
                { "@type": "Thing", "name": "買房成本", "sameAs": "https://zh.wikipedia.org/zh-tw/買房成本" },
                { "@type": "Thing", "name": "實體經濟壓力", "sameAs": "https://zh.wikipedia.org/zh-tw/實體經濟壓力" },
                { "@type": "Thing", "name": "資金活水", "sameAs": "https://zh.wikipedia.org/zh-tw/資金活水" },
                { "@type": "Thing", "name": "利率何時見頂", "sameAs": "https://zh.wikipedia.org/zh-tw/利率何時見頂" }
            ]
        },
        {
            id: 'knl-macro-fed-balance-sheet',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: 'Fed Balance Sheet (QT/QE) 完整指南 2026',
            desc: '聯準會資產負債表，展現了央行注入（QE）或抽離（QT）流動性的實際規模。',
            link: 'knowledge/knl-macro-fed-balance-sheet.html',
            keywords: '收走流動性, QT QE 定義, 水龍頭開關, 熱錢總量',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。是宏觀水位的「水龍頭」，決定了市場中熱錢的總量與流向。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：聯準會縮表與降息。',
            mentions: [
                { "@type": "Thing", "name": "收走流動性", "sameAs": "https://zh.wikipedia.org/zh-tw/收走流動性" },
                { "@type": "Thing", "name": "QT QE 定義", "sameAs": "https://zh.wikipedia.org/zh-tw/QT_QE_定義" },
                { "@type": "Thing", "name": "水龍頭開關", "sameAs": "https://zh.wikipedia.org/zh-tw/水龍頭開關" },
                { "@type": "Thing", "name": "熱錢總量", "sameAs": "https://zh.wikipedia.org/zh-tw/熱錢總量" }
            ]
        },
        {
            id: 'knl-onchain-investor-tool',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'onchain',
            title: '比特幣投資者工具 (Investor Tool) 完整指南 2026',
            desc: '利用 2 年均線及其倍數捕捉週期性買入與拋售點的投資者工具。',
            link: 'knowledge/knl-onchain-investor-tool.html',
            keywords: '均線倍數, 底部區間, 逃頂工具, 超買超賣',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **onchain** 進行深度剖析。簡單直觀地定義了歷史級別的底部墊高點與瘋狂頂部墊高點。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：2-Year MA 乘數。',
            mentions: [
                { "@type": "Thing", "name": "均線倍數", "sameAs": "https://zh.wikipedia.org/zh-tw/均線倍數" },
                { "@type": "Thing", "name": "底部區間", "sameAs": "https://zh.wikipedia.org/zh-tw/底部區間" },
                { "@type": "Thing", "name": "逃頂工具", "sameAs": "https://zh.wikipedia.org/zh-tw/逃頂工具" },
                { "@type": "Thing", "name": "超買超賣", "sameAs": "https://zh.wikipedia.org/zh-tw/超買超賣" }
            ]
        },
        {
            id: 'knl-onchain-mvrv-zscore',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'onchain',
            title: 'MVRV Z-Score 完整指南 2026',
            desc: '標準化衡量市值與實現價值的偏離程度，識別極端低估與高估狀態。',
            link: 'knowledge/knl-onchain-mvrv-zscore.html',
            keywords: '比特幣大底, 週期底部, 歷史低位, 絕佳買點, 極度恐慌時期',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **onchain** 進行深度剖析。被公認為判斷比特幣週期大底與大頂的最精確鏈上指標之一。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：MVRV Z-Score。',
            mentions: [
                { "@type": "Thing", "name": "比特幣大底", "sameAs": "https://zh.wikipedia.org/zh-tw/比特幣大底" },
                { "@type": "Thing", "name": "週期底部", "sameAs": "https://zh.wikipedia.org/zh-tw/週期底部" },
                { "@type": "Thing", "name": "歷史低位", "sameAs": "https://zh.wikipedia.org/zh-tw/歷史低位" },
                { "@type": "Thing", "name": "絕佳買點", "sameAs": "https://zh.wikipedia.org/zh-tw/絕佳買點" }
            ]
        },
        {
            id: 'knl-onchain-power-law',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'onchain',
            title: '比特幣冪律模型 (Power Law Corridor) 完整指南 2026',
            desc: '基於對數增長軌跡的冪律模型，預測比特幣長期的價格走廊。',
            link: 'knowledge/knl-onchain-power-law.html',
            keywords: '長期持有軌跡, 物理增長模型, BTC 數學規律, 價格走廊',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **onchain** 進行深度剖析。排除了短期隨機波動，為長線投資者提供具備科學依據的目標定錨。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：冪律成長通道。',
            mentions: [
                { "@type": "Thing", "name": "長期持有軌跡", "sameAs": "https://zh.wikipedia.org/zh-tw/長期持有軌跡" },
                { "@type": "Thing", "name": "物理增長模型", "sameAs": "https://zh.wikipedia.org/zh-tw/物理增長模型" },
                { "@type": "Thing", "name": "BTC 數學規律", "sameAs": "https://zh.wikipedia.org/zh-tw/BTC_數學規律" },
                { "@type": "Thing", "name": "價格走廊", "sameAs": "https://zh.wikipedia.org/zh-tw/價格走廊" }
            ]
        },
        {
            id: 'knl-onchain-rsi',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'onchain',
            title: '比特幣月線 RSI (Monthly RSI) 完整指南 2026',
            desc: '衡量月線級別買賣盤強弱程度的相對強弱指標。',
            link: 'knowledge/knl-onchain-rsi.html',
            keywords: '超買區, 超賣區, 動能指標, 市場情緒熱度',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **onchain** 進行深度剖析。判斷市場是否進入長期超買（泡沫）或超賣（機會）的關鍵信號。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：月線 RSI 動能。',
            mentions: [
                { "@type": "Thing", "name": "超買區", "sameAs": "https://zh.wikipedia.org/zh-tw/超買區" },
                { "@type": "Thing", "name": "超賣區", "sameAs": "https://zh.wikipedia.org/zh-tw/超賣區" },
                { "@type": "Thing", "name": "動能指標", "sameAs": "https://zh.wikipedia.org/zh-tw/動能指標" },
                { "@type": "Thing", "name": "市場情緒熱度", "sameAs": "https://zh.wikipedia.org/zh-tw/市場情緒熱度" }
            ]
        },
        {
            id: 'knl-onchain-rainbow-chart',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'onchain',
            title: '比特幣彩虹圖 (Rainbow Chart) 完整指南 2026',
            desc: '視覺化長線對數回歸曲線，將情緒分為九個不同的彩色階層。',
            link: 'knowledge/knl-onchain-rainbow-chart.html',
            keywords: '九色階層, 現在是哪個顏色, 情緒週期, 視覺化抄底',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **onchain** 進行深度剖析。幫助普通投資者直觀了解當前價格處於週期的哪個情緒階段。 本篇提供具備價值的知識教育訊號，協助讀者深入了解深入解析：比特幣彩虹圖。',
            mentions: [
                { "@type": "Thing", "name": "九色階層", "sameAs": "https://zh.wikipedia.org/zh-tw/九色階層" },
                { "@type": "Thing", "name": "現在是哪個顏色", "sameAs": "https://zh.wikipedia.org/zh-tw/現在是哪個顏色" },
                { "@type": "Thing", "name": "情緒週期", "sameAs": "https://zh.wikipedia.org/zh-tw/情緒週期" },
                { "@type": "Thing", "name": "視覺化抄底", "sameAs": "https://zh.wikipedia.org/zh-tw/視覺化抄底" }
            ]
        }
        ,
        {
            id: 'private-credit',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: 'Private Credit (私人信貸) (2026)：核心定義、風險機制與金融危機影響全解析',
            desc: '由非銀行金融機構直接提供的貸款，不涉及公開市場或傳統銀行體系。也稱為直接借貸。',
            link: 'knowledge/private-credit.html',
            keywords: '私人信貸, 直接貸款, 影子銀行, 替代投資, 非公開市場',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。這是當前影子銀行體系中增長最快的領域，在流動性收緊時，其缺乏透明度與次級市場定價的特性可能成為系統性風險。',
            mentions: [
                { '@type': 'Thing', 'name': '私人信貸', 'sameAs': 'https://zh.wikipedia.org/wiki/私人信貸' },
                { '@type': 'Thing', 'name': '直接貸款', 'sameAs': 'https://zh.wikipedia.org/wiki/直接貸款' }
            ]
        },
        {
            id: 'shadow-banking',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: 'Shadow Banking (影子銀行) (2026)：核心定義、監管套利與系統性風險全解析',
            desc: '在正規銀行體系之外進行信用中介活動的金融機構與機制內容。',
            link: 'knowledge/shadow-banking.html',
            keywords: '影子銀行, 金融中介, 監管套利, 系統性風險',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。逃避中央銀行監管，其高槓桿使其在信貸週期逆轉時極其脆弱。',
            mentions: [
                { '@type': 'Thing', 'name': '影子銀行', 'sameAs': 'https://zh.wikipedia.org/wiki/影子銀行' }
            ]
        },
        {
            id: 'bdcs-fund',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: 'BDCs (業務發展公司) (2026)：核心定義、私人信貸零售化與估值風險全解析',
            desc: 'Business Development Companies，投資於中小型企業債務與股權的封閉式基金內容。',
            link: 'knowledge/bdcs-fund.html',
            keywords: 'BDCs, 中小企業貸款, 收益型投資, 封閉式基金',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。私人信貸走向零售化的主體，底層資產違約風險直接影響其帳面價值（NAV）。',
            mentions: [
                { '@type': 'Thing', 'name': '業務發展公司', 'sameAs': 'https://zh.wikipedia.org/wiki/業務發展公司' }
            ]
        },
        {
            id: 'pik-interest',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: 'PIK Interest (實物支付利息) (2026)：核心定義、以債養債與現金流枯竭預警全解析',
            desc: 'Payment-in-Kind，以增加債項總額代替支付現金利息內容。',
            link: 'knowledge/pik-interest.html',
            keywords: 'PIK 利息, 以債養債, 現金流壓力, 信用評級',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析時常用此法。典型的「以債養債」信號，預示企業現金流枯竭及未來更猛烈的違約風險解決。',
            mentions: [
                { '@type': 'Thing', 'name': '實物支付利息', 'sameAs': 'https://zh.wikipedia.org/wiki/實物支付利息' }
            ]
        },
        {
            id: 'asset-coverage-ratio',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: 'Asset Coverage Ratio (資產覆蓋率) (2026)：核心定義、BDC 法定紅線與強制清算風險全解析',
            desc: '衡量基金資產相對於債務的比例，是 BDCs 的法定紅線內容。',
            link: 'knowledge/asset-coverage-ratio.html',
            keywords: '資產覆蓋率, 償債能力, BDC 法規, 資產減值',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。一旦跌破法定門檻，基金將被迫清算資產或停止分配收益，引發市場恐慌。',
            mentions: []
        },
        {
            id: 'liquidity-coverage-ratio',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: 'Liquidity Coverage Ratio (LCR) (2026)：核心定義、巴塞爾協議與金融體系防禦擠兌全解析',
            desc: '優質流動資產相對於未來 30 天淨現金流出量之比內容。',
            link: 'knowledge/liquidity-coverage-ratio.html',
            keywords: 'LCR, 流動性管理, 巴塞爾協議, 現金流風險',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。衡量金融機構應付短暫流動性中斷的能力，是銀行體系防禦擠兌的核心。',
            mentions: []
        },
        {
            id: 'amend-extend',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: 'Amend & Extend (修改與延期) (2026)：踢罐子機制、殭屍貸款與私人信貸風險全解析',
            desc: '債務重組手法，透過放寬限制並推遲到期日來延緩違約。',
            link: 'knowledge/amend-extend.html',
            keywords: 'A&E, 債務展期, 踢罐子, 貸款重組',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。行內私稱為「踢罐子」，這掩蓋了資產惡化的事實，將風險推向未來。',
            mentions: []
        },
        {
            id: 'mark-to-model',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: 'Mark-to-Model (標記模型) (2026)：估值幻覺、三級資產與私人信貸流動性陷阱全解析',
            desc: '依據理論模型而非市場實際價格來評估資產價值內容。',
            link: 'knowledge/mark-to-model.html',
            keywords: '標記模型, 理論估值, 假性穩定, 帳面價值',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。在缺乏市場流動性時常用此法維護「低波動」，但往往造成估值與現實脫節內容。',
            mentions: []
        },
        {
            id: 'lme-maneuver',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: 'Liability Management Exercise (LME) (2026)：存量遞延、債權霸凌與信用崩潰全解析',
            desc: '企業透過法律手段損害部分債權人利益以換取債務緩解的行為內容。',
            link: 'knowledge/lme-maneuver.html',
            keywords: 'LME, 債務博弈, 債權人權利, 同室操戈',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。象徵著信貸市場契約精神的瓦解。',
            mentions: []
        },
        {
            id: 'synthetic-leverage',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: 'Synthetic Leverage (合成槓桿) (2026)：表外地雷、隱蔽風險與金融連鎖反應全解析',
            desc: '利用衍生性商品而非直接借貸產生的隱性槓桿。',
            link: 'knowledge/synthetic-leverage.html',
            keywords: '合成槓桿, 隱形債務, 衍生品工具, 清算連鎖',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。具有極高隱蔽性，往往在系統崩潰前夕才被察覺。',
            mentions: []
        },
        {
            id: 'financial-crisis-2026',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: '2026 金融危機',
            desc: '預期於 2026 年因全球信貸收縮與影子銀行爆雷引發的連鎖反應。',
            link: 'news/news-20260325-private-credit-gold-crisis.html',
            keywords: '2026 金融危機, 信貸危機, 經濟衰退, 債務爆雷',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。是私人信貸泡沫與高利率環境共振後的終極清算。',
            mentions: []
        },
        {
            id: '5w1h-logic',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: '5W1H 深度邏輯',
            desc: '透過六大維度剖析事件底層因果關係的思維工具。',
            link: 'news/news-20260325-private-credit-gold-crisis.html',
            keywords: '5W1H, 思維框架, 深度分析, 邏輯推演',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。專業分析師的核心武器，將零散資訊構築成邏輯嚴密的決策鍊內容。',
            mentions: []
        },
        {
            id: 'interest-coverage-ratio',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: 'Interest Coverage Ratio (利息保障倍數) (2026)：衡量企業債務償還能力的核心指標',
            desc: '企業息稅前利潤與利息支出的比率，衡量償付利息的能力。',
            link: 'knowledge/interest-coverage-ratio.html',
            keywords: '利息保障倍數, 財務健康, 償債風險, 信用評估',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。判斷過度槓桿企業是否具有生存能力的生死線。',
            mentions: []
        },
        {
            id: 'liquidity-illusion',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'risk',
            title: 'Liquidity Illusion (流動性幻覺) (2026)：金融崩盤的無形推手、壓力測試與風險防範',
            desc: '在壓力下迅速消失的虛假流動性，金融市場崩盤的無形推手。',
            link: 'knowledge/liquidity-illusion.html',
            keywords: '流動性幻覺, 市場流動性, 金融崩盤, 清算性拋售',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對流動性風險進行剖析。揭示了在極端衝擊下，看似充足的流動性如何瞬間蒸發。',
            mentions: []
        },
        {
            id: 'tranche-risk',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: 'Tranche Risk (分層風險) (2026)：結構化融資的溢價與陷阱、損益順序解析',
            desc: '結構化產品不同等級證券的優先損益風險。',
            link: 'knowledge/tranche-risk.html',
            keywords: '分層風險, 結構化產品, 優先順序, 信用風險',
            summary: '這份 **知識卡片 (Knowledge Card)** 解析了結構化融資中的損益順序，識別系統性風險下的級別失效。',
            mentions: []
        },
        {
            id: 'capital-call',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'fi',
            title: 'Capital Call (資本催調) (2026)：流動性陷阱、限售期與連鎖反應解析',
            desc: '要求注資承諾，引發連鎖拋售其他資產籌資的法律行動。',
            link: 'knowledge/capital-call.html',
            keywords: '資本催調, 私募基金, 注資承諾, 流動性風險',
            summary: '這份 **知識卡片 (Knowledge Card)** 探討了私人信貸中注資義務如何成為市場崩潰的加速器。',
            mentions: []
        },
        {
            id: 'nav-reset',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: 'NAV Reset (淨值重估) (2026)：金融泡沫破滅信號、資產估值修整解析',
            desc: '資產下跌後的基金會計調整，引發贖回潮與信心崩塌。',
            link: 'knowledge/nav-reset.html',
            keywords: '淨值重估, 資產淨值, 基金會計, 信用週期',
            summary: '這份 **知識卡片 (Knowledge Card)** 說明了淨值重估如何將隱蔽風險轉化為公開危機。',
            mentions: []
        },
        {
            id: 'redemption-gates',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: 'Redemption Gates (贖回閘門)',
            desc: '基金管理人限制或暫停投資者贖回資金的契約門檻。',
            link: 'news/news-20260325-private-credit-gold-crisis.html',
            keywords: '贖回閘門, 限制提款, 流動性陷阱, 基金條款',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。防止擠兌的防禦機制，但往往是流動性徹底枯竭的公開信號。',
            mentions: []
        },
        {
            id: 'equity-rescue',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: 'Equity Injection (股權救助)',
            desc: '透過注資或發行優先股來改善槓桿比例並避免違約的緊急行動內容。',
            link: 'news/news-20260325-private-credit-gold-crisis.html',
            keywords: '股權救助, 資本充足率, 股權稀釋, 財務重組',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。債務人的最後底牌，通常伴隨著現有股東權益的大幅攤薄。',
            mentions: []
        },
        {
            id: 'cross-asset-contagion',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: 'Cross-Asset Contagion (跨資產連鎖反應) (2026)：市場相關性暴增、流動性傳導路徑解析',
            desc: '風險在不同市場間透過流動性需求與心理效應快速傳播。',
            link: 'knowledge/cross-asset-contagion.html',
            keywords: '連鎖反應, 市場傳導, 系統性危機, 關聯性失效',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。解釋了為何單一信貸市場的爆雷會導致黃金及美債市場的異常波動內容。',
            mentions: []
        },
        {
            id: 'gold-hedge',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: 'Gold Hedge (黃金避險) (2026)：對抗信用崩塌的終極保險、實物資產溢價解析',
            desc: '持有黃金以對抗系統性信用風險與法幣貶值的策略。',
            link: 'knowledge/gold-hedge.html',
            keywords: '黃金避險, 安全資產, 信用風險, 價值儲備',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。在信用市場冰封時，黃金是唯一無對手方風險的避風港。',
            mentions: []
        },
        {
            id: 'tech-rerating',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'valuation',
            title: 'Tech Re-rating (科技股重估) (2026)：估值倍數修正、高利率環境與風險溢價解析',
            desc: '高利率與避險潮下，市場對科技股估值倍數向下修正的過程。',
            link: 'knowledge/tech-rerating.html',
            keywords: '科技股重估, 殺估值, AI 泡沫, 貨幣政策影響',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **valuation** 進行深度剖析。高利率環境下增長股折現率提高，導致估值回歸理性內容。',
            mentions: []
        },
        {
            id: 'liquidation-selloff',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: 'Liquidation Sell-off (清算性拋售)',
            desc: '為滿足保證金需求而不計代價地拋售所有流動資產。',
            link: 'knowledge/liquidation-selloff.html',
            keywords: '斷頭潮, 強制平倉, 市場底部, 流動性危機',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。危機中最恐慌的階段，此時流動性本身比基本面更重要內容。',
            mentions: []
        },
        {
            id: 'credit-default',
            category: 'knowledge-card',
            published: '2025-10-15',
            modified: '2026-03-25',
            tag: 'macro',
            title: 'Credit Default (信用違約) (2026)：信用週期終結、爆雷導火索與損益吸收解析',
            desc: '債務人未能按約定支付利息 or 償還本金的行為。',
            link: 'knowledge/credit-default.html',
            keywords: '信用違約, 債務危機, 下行週期, 財務崩潰',
            summary: '這份 **知識卡片 (Knowledge Card)** 針對當前 **macro** 進行深度剖析。信用週期終結的標誌。',
            mentions: []
        }
    ];

    const _knowledgeLinks = [
        // Tesla Charging Analysis
        { from: '20260512-ev-charging-bottleneck-analysis', to: 'tesla-inc', label: '研究對象', type: 'entity' },
        { from: '20260512-ev-charging-bottleneck-analysis', to: 'megawatt-charging-system', label: '技術核心', type: 'tech' },
        { from: '20260512-ev-charging-bottleneck-analysis', to: 'grid-connection-delay', label: '主要瓶頸', type: 'risk' },
        { from: 'megawatt-charging-system', to: 'tesla-inc', label: '標準制定', type: 'derived' },
        
        // 核心延伸
        { from: 'private-credit', to: 'shadow-banking', label: '主要構成', type: 'derived' },
        { from: 'private-credit', to: 'bdcs-fund', label: '融資主體', type: 'entity' },
        // 指標與預警
        { from: 'shadow-banking', to: 'pik-interest', label: '流動性壓力', type: 'risk' },
        { from: 'bdcs-fund', to: 'asset-coverage-ratio', label: '監管紅線', type: 'metric' },
        { from: 'bdcs-fund', to: 'interest-coverage-ratio', label: '償債指標', type: 'metric' },
        // 風險傳導
        { from: 'pik-interest', to: 'amend-extend', label: '掩蓋機制', type: 'process' },
        { from: 'asset-coverage-ratio', to: 'redemption-gates', label: '觸發防禦', type: 'risk' },
        { from: 'amend-extend', to: 'lme-maneuver', label: '重組手段', type: 'process' },
        { from: 'redemption-gates', to: 'liquidation-selloff', label: '引發擠兌', type: 'risk' },
        // 市場與危機
        { from: 'liquidation-selloff', to: 'gold-hedge', label: '避險轉移', type: 'impact' },
        { from: 'lme-maneuver', to: 'cross-asset-contagion', label: '連鎖反應', type: 'impact' },
        { from: 'cross-asset-contagion', to: 'tech-rerating', label: '資產重估', type: 'impact' },
        { from: 'tech-rerating', to: 'financial-crisis-2026', label: '系統爆發', type: 'impact' },
        { from: 'interest-coverage-ratio', to: 'credit-default', label: '先行指標', type: 'risk' },
        { from: 'liquidity-illusion', to: 'liquidation-selloff', label: '觸發因素', type: 'risk' },
        { from: 'tranche-risk', to: 'nav-reset', label: '損失吸收', type: 'impact' },
        { from: 'capital-call', to: 'liquidation-selloff', label: '籌資壓力', type: 'risk' }
    ];

    class CoreKnowledgeRepository {
        constructor() {
            this._categories = {
                'core': '核心概念',
                'macro': '宏觀經濟 (Macro)',
                'cycle': '市場週期 (Cycles)',
                'reg': '機構與監管 (Regs)',
                'infra': '基礎設施',
                'assets': '資產分類',
                'fi': '經濟模型 (DeFi)',
                'trading': '交易與分析',
                'security': '安全與錢包',
                'culture': '社群文化',
                'scaling': '擴容方案 (Scaling)',
                'app': '應用與賽道 (Apps)',
                'valuation': '估值模型 (Valuation)',
                'onchain': '鏈上指標 (On-chain)',
                'risk': '風險管理 (Risk Management)'
            };
        }

        getById(id) {
            return _knowledgeData.find(item => item.id === id);
        }

        get all() {
            return _knowledgeData;
        }

        get links() {
            return _knowledgeLinks;
        }

        get categories() {
            return this._categories;
        }

        getByCategory(category) {
            if (category === 'all') return _knowledgeData;
            return _knowledgeData.filter(item => item.tag === category);
        }
    }

    global.CoreKnowledgeRepository = new CoreKnowledgeRepository();

    if (typeof window !== 'undefined') {
        window.CoreKnowledgeRepository = global.CoreKnowledgeRepository;
    }

})(window);
