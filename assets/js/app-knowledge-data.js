/**
 * Core Knowledge Data Repository
 * [專案規格] 數據架構手冊：doc/doc_task/guide_data_architecture.md
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
        // --- 核心概念 (Core Concepts) ---
        {
            id: 'btc',
            title: 'Bitcoin (BTC)',
            category: 'core',
            definition: '比特幣是世界上第一個去中心化的數位貨幣，由中本聰於 2008 年提出。它不依賴任何中央機構，而是通過區塊鏈技術和工作量證明（PoW）機制來確保交易的安全與紀錄的不可篡改。',
            importance: '被視為「數位黃金」，是加密貨幣市場的價值錨定物，亦是抵抗法幣通膨的最佳工具。',
            relatedArticleId: 'card-project-btc',
            relatedLink: 'project/btc.html',
            relatedLinkText: '深入閱讀：比特幣投資全攻略',
            keywords: ['比特幣是什麼', 'BTC 定義', '數位黃金', '中本聰', '區塊鏈貨幣', '抗通膨資產']
        },
        {
            id: 'eth',
            title: 'Ethereum (ETH)',
            category: 'core',
            definition: '以太坊是一個具備「智能合約」功能的開源區塊鏈平台。如果說比特幣是計算機，以太坊就是世界電腦，允許開發者在其上構建各種去中心化應用程式 (DApps)。',
            importance: 'DeFi、NFT、GameFi 等生態的基石，推動了區塊鏈從「貨幣」走向「應用」的革命。',
            relatedArticleId: 'card-project-eth',
            relatedLink: 'project/eth.html',
            relatedLinkText: '深入閱讀：以太坊生態系指南',
            keywords: ['以太坊是什麼', 'ETH 定義', '世界電腦', '智能合約平台', 'Defi 基石', 'DApp 運行']
        },
        {
            id: 'stablecoin',
            title: 'Stablecoin (穩定幣)',
            category: 'core',
            definition: '穩定幣是一種價格與法幣（如美元）掛鉤的加密貨幣。它旨在解決加密貨幣價格波動劇烈的問題，同時保留了區塊鏈轉帳快速、低成本的特性。',
            importance: '連接法幣與加密世界的橋樑，是交易、借貸與支付結算最主要的媒介。',
            relatedArticleId: 'card-topic-stablecoin',
            relatedLink: 'topic-stablecoin.html',
            relatedLinkText: '深入閱讀：穩定幣終極指南',
            keywords: ['穩定幣是什麼', 'USDT', 'USDC', '避險資產', '出金入金', '法幣掛鉤']
        },

        // --- 宏觀經濟 (Macro Economy) - NEW ---
        {
            id: 'us-exceptionalism',
            title: 'American Exceptionalism (美國例外論)',
            category: 'macro',
            definition: '指美國經濟在全球放緩的背景下，憑藉高科技創新（AI）與強勁的消費需求，展現出獨特的增長韌性。',
            importance: '解釋了美元資產（包括美股與加密資產）為何持續吸引全球資金。複雜的穩定性支撐了風險資產價格。',
            relatedLink: 'knowledge/us-exceptionalism.html',
            relatedLinkText: '深入閱讀：美國經濟韌性',
            keywords: ['美國經濟', 'AI 創新', '美元走強', '全球資金往哪走', '風險資產避風港']
        },
        {
            id: 'neutral-rate',
            title: 'Neutral Rate (中性利率 R*)',
            category: 'macro',
            definition: '既不刺激也不抑制經濟增長的理論利率水平。2026 年的中性利率預計維持在 3.5% 左右，高於疫情前水平。',
            importance: '這意味著「低利率時代」一去不復返，資產定價必須適應更高的無風險利率與機會成本。',
            relatedLink: 'knowledge/neutral-rate.html',
            relatedLinkText: '深入閱讀：利率新常態',
            keywords: ['中性利率', '何時降息', '借貸成本', '資產定價', '聯準會目標利率']
        },
        {
            id: 'liquidity-sponge',
            title: 'Liquidity Sponge (流動性海綿)',
            category: 'macro',
            definition: '描述比特幣吸收全球過剩貨幣供應的能力。當 M2 貨幣供應量增加時，比特幣往往表現優於其他資產。',
            importance: '比特幣價格與全球 M2 增長率的耦合度越來越高，成為對沖貨幣貶值的工具。',
            relatedArticleId: 'topic-btc-macro-analysis',
            relatedLink: 'knowledge/liquidity-sponge.html',
            relatedLinkText: '深入閱讀：M2 與比特幣',
            keywords: ['貨幣超發', '印鈔機', '購買力下降', '抗通膨', 'BTC vs M2']
        },
        {
            id: 'asset-correlation',
            title: 'Asset Correlation (資產相關性)',
            category: 'macro',
            definition: '2026 年比特幣與納斯達克指數維持高貝塔 (0.38) 相關，但與黃金相關性極低 (0.01)，顯示其風險屬性仍大於避險屬性。',
            importance: '構建投資組合時的關鍵參數，打破了「數位黃金」完全避險的迷思。',
            relatedLink: 'knowledge/asset-correlation.html',
            relatedLinkText: '深入閱讀：資產相關性分析',
            keywords: ['美股連動', '納斯達克', '避險還是風險資產', '資產組合配置', '相關係數']
        },

        // --- 市場週期 (Market Cycles) - NEW ---
        {
            id: 'btc-halving-cycle',
            title: 'Four Year Cycle (四年減半週期)',
            category: 'cycle',
            definition: '傳統觀點認為比特幣每四年的產量減半會導致供應衝擊並推動價格暴漲。然而，2026 年的數據顯示此模型受到 ETF 流動性與宏觀因素的強烈挑戰。',
            importance: '理解為什麼歷史規律可能會失效，是從新手進階到成熟投資者的必經之路。',
            relatedLink: 'knowledge/four-year-cycle.html',
            relatedLinkText: '深入閱讀：週期的失效',
            keywords: ['比特幣減半', '四年週期', '現在在週期哪裡', '牛市結束了嗎', '歷史規律']
        },
        {
            id: 'liquidity-cycle',
            title: 'Liquidity Cycle (流動性週期)',
            category: 'cycle',
            definition: '一個基於全球債務再融資與央行資產負債表擴張的三年週期，正逐漸取代比特幣傳統的四年減半週期。',
            importance: '投資者應更多關注宏觀流動性指標（如通膨、利率），而非單純等待「減半」帶來的供應衝擊。',
            relatedLink: 'knowledge/liquidity-cycle.html',
            relatedLinkText: '深入閱讀：三年與四年之爭'
        },
        {
            id: 'rainbow-chart',
            title: 'Rainbow Chart (彩虹圖)',
            category: 'cycle',
            definition: '一種對數回歸圖表，用不同顏色的帶狀區域來標示比特幣價格處於「低估（Fire Sale）」還是「泡沫（Bubble）」階段。',
            importance: '提供了長線投資者判斷進出場時機的視覺化工具，避免在情緒過熱時追高。',
            relatedLink: 'knowledge/rainbow-chart.html',
            relatedLinkText: '深入閱讀：彩虹圖解析',
            keywords: ['比特幣便宜嗎', '現在可以買嗎', '市場過熱了嗎', '抄底指標', '長線進場點']
        },

        // --- 基礎設施 (Infrastructure) ---
        {
            id: 'blockchain',
            title: 'Blockchain (區塊鏈)',
            category: 'infra',
            definition: '一種分散式的數位帳本技術，資料以「區塊」的形式串接，並透過密碼學確保不可篡改。每個節點都保存一份完整的帳本副本。',
            importance: '創造了「去信任化」的協作基礎，是 Web3 世界的底層操作系統。',
            relatedLink: null,
            relatedLinkText: null,
            keywords: ['自動執行合約', 'Code is Law', '程式化金融', '去許可化']
        },
        {
            id: 'smart-contract',
            title: 'Smart Contract (智能合約)',
            category: 'infra',
            definition: '部署在區塊鏈上的自動執行程式碼。當滿足預設條件時，合約會自動執行相應的操作（如轉帳、發幣），無需人工干預。',
            importance: '實現了「程式碼即法律 (Code is Law)」，是 DeFi 與 DApps 運作的核心與靈魂。',
            relatedLink: null,
            relatedLinkText: null
        },
        {
            id: 'depin',
            title: 'DePIN (去中心化實體基礎設施)',
            category: 'infra',
            definition: 'Decentralized Physical Infrastructure Networks。利用代幣激勵，讓個人貢獻硬體資源（如 GPU、硬碟、基地台）構建基礎設施網絡。',
            importance: '解決了 AI 時代對算力與存儲的指數級需求，代表項目包括 Render (GPU) 與 Arweave (存儲)。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 5.2',
            keywords: ['硬體挖礦', '算力租借', '實體基礎設施', 'Web3 硬件', 'RENDER', 'AR']
        },
        {
            id: 'layer2-base',
            title: 'Base (Coinbase L2)',
            category: 'infra',
            definition: '由 Coinbase 推出、基於 OP Stack 構建的以太坊 Layer 2。旨在將其龐大的 Web2 用戶群導入鏈上世界。',
            importance: '2026 年領先的 L2 之一，展示了中心化交易所如何構建去中心化生態系統的成功範例。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 5.3',
            keywords: ['BASE 鏈', 'Coinbase L2', '以太坊擴容', '手續費便宜']
        },

        // --- 機構與監管 (Institutional & Reg) - NEW ---
        {
            id: 'genius-act',
            title: 'GENIUS Act',
            category: 'reg',
            definition: '指導穩定幣監管的關鍵法案。確立了銀行與持牌機構在穩定幣發行上的壟斷地位，並限制了無牌照穩定幣的收益率。',
            importance: '結束了「狂野西部」時代，雖然限制了創新，但為機構資金入場提供了必要的法律確定性。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 3.1',
            keywords: ['穩定幣監管', 'Genius Act', '加密法規', '合規要求']
        },
        {
            id: 'clarity-act',
            title: 'CLARITY Act',
            category: 'reg',
            definition: '解決 SEC 與 CFTC 管轄權爭議的法案。明確定義了哪些資產屬於「數位商品」而非證券。',
            importance: '為交易所合規鋪平道路，並允許傳統銀行開始提供加密資產託管服務。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 3.2'
        },
        {
            id: 'dats',
            title: 'DATs (數位資產財庫)',
            category: 'reg',
            definition: 'Digital Asset Treasuries。指上市公司（如 MicroStrategy）將比特幣納入資產負債表作為儲備資產的策略。',
            importance: '企業採納比特幣的里程碑，未來可能被納入 MSCI 等全球指數，帶來巨大的被動買盤。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 4.2',
            keywords: ['上市公司買比特幣', 'MicroStrategy 策略', '企業儲備', '機構進場']
        },
        {
            id: 'blackrock-buidl',
            title: 'BlackRock BUIDL',
            category: 'reg',
            definition: '貝萊德推出的代幣化基金。允許投資者在鏈上持有美國國債等傳統資產，並實現全天候即時結算。',
            importance: '傳統金融 (TradFi) 與去中心化金融 (DeFi) 融合的旗艦項目，推動 RWA 賽道爆發。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 4.4'
        },

        // --- 資產分類 (Assets) ---
        {
            id: 'coin-vs-token',
            title: 'Coin vs. Token',
            category: 'assets',
            definition: 'Coin (原生代幣) 擁有獨立的區塊鏈 (如 BTC, SOL)；Token (應用代幣) 則寄生於現有區塊鏈上 (如 ERC-20 代幣, USDT)。',
            importance: '區分資產的技術屬性與價值來源的基礎概念。',
            relatedLink: null,
            relatedLinkText: null
        },
        {
            id: 'rwa-asset',
            title: 'RWA (現實世界資產)',
            category: 'assets',
            definition: 'Real World Assets。將房地產、國債、藝術品等線下資產通過代幣化引入區塊鏈市場。',
            importance: '2026 年核心投資敘事。Ondo Finance 等項目讓鏈上資金能無風險地獲取美債收益。',
            relatedLink: 'topic-rwa.html',
            relatedLinkText: '深入閱讀：RWA 賽道全景',
            keywords: ['現實資產代幣化', '國債上鏈', '資產證券化', '2026 投資重點']
        },

        // --- 經濟模型 (DeFi) ---
        {
            id: 'defi',
            title: 'DeFi (去中心化金融)',
            category: 'fi',
            definition: '建立在區塊鏈上的金融體系，用智能合約取代銀行與券商，提供借貸、交易、衍生品等服務。',
            importance: '實現金融普惠，讓資金能無許可地在全球自由流動。',
            relatedLink: null,
            relatedLinkText: null
        },
        {
            id: 'sky-protocol',
            title: 'Sky Protocol (原 MakerDAO)',
            category: 'fi',
            definition: 'MakerDAO 的轉型升級版。推出了新的穩定幣 USDS 與治理代幣 SKY，並引入具備特定功能的 SubDAOs。',
            importance: 'DeFi 老牌龍頭為了適應監管（如凍結功能）與擴大採用而進行的重大戰略轉型。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 5.4'
        },

        // --- 交易與分析 (Trading) ---
        {
            id: 'ai-agent',
            title: 'AI Agent (AI 代理)',
            category: 'trading',
            definition: '具備自主決策能力的 AI 程式。能自動分析輿情、管理鏈上資產、執行複雜的 DeFi 策略。',
            importance: '例如 Fetch.ai 與 SingularityNET 組成的 ASI 聯盟，試圖去中心化 AI 的控制權。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 5.5'
        },

        // --- 安全與錢包 (Security) ---
        {
            id: 'wallet-types',
            title: 'Custodial vs. Non-Custodial',
            category: 'security',
            definition: '託管型 (交易所) 由平台保管私鑰；非託管型 (Metamask) 由用戶自己保管助記詞。',
            importance: '「Not Your Keys, Not Your Coins」。資產主權與便利性之間的權衡。',
            relatedLink: null,
            relatedLinkText: null,
            keywords: ['託管型', '非託管型', '資產主權', '便利性', '私鑰保管']
        },

        // --- 社群文化 (Culture) ---
        {
            id: 'meme-coin',
            title: 'Memecoin (迷因幣)',
            category: 'culture',
            definition: '源自網路文化，價值主要取決於社群共識與注意力。如 DOGE, PEPE。',
            importance: '展現了加密市場獨特的「注意力經濟」，風險極高但爆發力強。',
            relatedLink: 'topic-meme.html',
            relatedLinkText: '深入閱讀：迷因幣解析',
            keywords: ['迷因幣', 'DOGE', 'PEPE', '注意力經濟', '社群共識']
        },

        // --- 關鍵技術 (Emerging Tech) - NEW ---
        {
            id: 'modular-blockchain',
            title: 'Modular Blockchain (模組化區塊鏈)',
            category: 'infra',
            definition: '將執行、結算、共識與數據可用性解耦的區塊鏈架構。Celestia 是此領域的代表，專注於解決不可能三角。',
            importance: '區塊鏈從「單體黑莓機」走向「模組化iPhone」的架構革命，是擴展至 10 億用戶的基石。',
            relatedLink: 'knowledge/modular-blockchain.html',
            relatedLinkText: '深入閱讀：模組化革命',
            keywords: ['區塊鏈架構', '模組化', '區塊鏈革命', '執行層', '數據可用性']
        },
        {
            id: 'zk-rollup',
            title: 'ZK-Rollup (零知識證明)',
            category: 'scaling',
            definition: '利用數學證明實現即時確認 (Instant Finality) 的 Layer 2 擴容方案。兼具隱私保護與極高的吞吐量。',
            importance: '被 Vitalik 視為擴容的「聖杯」，長期來看將憑藉安全性與成本優勢取代 Optimistic Rollup。',
            relatedLink: 'knowledge/zk-rollup.html',
            relatedLinkText: '深入閱讀：ZK 終極指南',
            keywords: ['零知識證明', '即時確認', '區塊鏈擴容', '隱私保護', '吞吐量']
        },
        {
            id: 'prediction-markets',
            title: 'Prediction Markets (預測市場)',
            category: 'app',
            definition: '去中心化的資訊發現平台 (如 Polymarket)。利用「真金白銀」的博弈來過濾雜訊，獲取真實世界的概率資訊。',
            importance: 'Web3 最成功的非金融應用場景 (Consumer App)，是 AI 獲取真實數據的潛在預言機。',
            relatedLink: 'knowledge/prediction-markets.html',
            relatedLinkText: '深入閱讀：預測市場分析',
            keywords: ['去中心化', '資訊發現', '博弈機制', '真實數據', '預言機']
        },
        {
            id: 'knl-sov-tam',
            title: 'SoV TAM Allocation',
            category: 'valuation',
            definition: '將比特幣視為數位黃金，透過對標全球黃金總市值與滲透率來估算其長期潛在價值。',
            importance: '幫助投資者設定長期預期回報與數位大宗商品的定價錨點。',
            relatedLink: 'knowledge/knl-sov-tam.html',
            relatedLinkText: '深入解析：數位黃金對標法',
            keywords: ['比特幣目標價', '黃金市值對標', 'BTC 潛力', '估值計算']
        },
        {
            id: 'knl-m2-hedge',
            title: 'M2 Hedge Model',
            category: 'valuation',
            definition: '衡量比特幣作為對沖全球貨幣供應量 (M2) 擴張與購買力貶值的核心工具。',
            importance: '理解比特幣在極端通膨與貨幣增發背景下的資產屬性。',
            relatedLink: 'knowledge/knl-m2-hedge.html',
            relatedLinkText: '深入解析：法幣對沖模型',
            keywords: ['對沖美元', '購買力護城河', 'M2 成長預測', '避險功能']
        },
        {
            id: 'knl-metcalfe',
            title: "Metcalfe's Law",
            category: 'valuation',
            definition: '由網路節點數的平方決定網路價值的經典定律，適用於比特幣用戶增長與市值的關係。',
            importance: '揭示了網路效應如何推動比特幣實現指數級別的增長。',
            relatedLink: 'knowledge/knl-metcalfe.html',
            relatedLinkText: '深入解析：梅特卡夫定律',
            keywords: ['網路效應', '比特幣用戶增長', '市值指數增長', '比特幣市值', '用戶增長率']
        },
        {
            id: 'knl-nvt-ratio',
            title: 'NVT Ratio',
            category: 'valuation',
            definition: '衡量市值與鏈上交易額比例的指標，被稱為加密貨幣界的「本益比」。',
            importance: '用於判斷市場是否因投機過熱而導致幣價脫離網路實際效用。',
            relatedLink: 'knowledge/knl-nvt-ratio.html',
            relatedLinkText: '深入解析：NVT 比率',
            keywords: ['加密貨幣本益比', '市場估值', '交易活躍度 vs 市值', '泡沫判斷']
        },
        {
            id: 'knl-s2f-model',
            title: 'Stock-to-Flow (S2F)',
            category: 'valuation',
            definition: '根據現有庫存與年度產出流量的比例來量化資產稀缺性的模型。',
            importance: '最經典的供給側模型，用於解析比特幣減半對價格的長期影響。',
            relatedLink: 'knowledge/knl-s2f-model.html',
            relatedLinkText: '深入解析：S2F 模型',
            keywords: ['供給側模型', '減半效應', '稀缺性評估', '比特幣價格支撐']
        },
        {
            id: 'knl-production-cost',
            title: 'Production Cost',
            category: 'valuation',
            definition: '基於挖礦成本（電費、設備等）來測算比特幣的鐵底價格。',
            importance: '為市場提供了一個基於物理能量消耗的剛性價值支撐參考。',
            relatedLink: 'knowledge/knl-production-cost.html',
            relatedLinkText: '深入解析：邊際生產成本',
            keywords: ['邊際成本', '電力成本', '比特幣價格支撐', '挖礦成本', '比特幣價格支撐']
        },
        {
            id: 'knl-mvrv-ratio',
            title: 'MVRV Ratio',
            category: 'valuation',
            definition: '流通市值與實現市值的比值，反映投資者的平均盈利程度。',
            importance: '精準識別市場頂部（極度獲利）與底部（極度虧損）區域。',
            relatedPostIds: ['card-btc-valuation-models', 'card-bitcoin-mandala'],
            relatedLink: 'knowledge/knl-mvrv-ratio.html',
            relatedLinkText: '深入解析：MVRV 比率',
            keywords: ['比特幣抄底', '逃頂指標', '平均盈利程度', '市場吸籌', '派發區間']
        },
        {
            id: 'knl-power-law',
            title: 'Bitcoin Power Law',
            category: 'valuation',
            definition: '認為比特幣價格隨時間呈冪律增長的物理規律模型。',
            importance: '提供了一個穩定、長期的價格走廊，不受短期噪音干擾。',
            relatedLink: 'knowledge/knl-power-law.html',
            relatedLinkText: '深入解析：比特幣冪律模型',
            keywords: ['長線走勢圖', '價格走廊', '不看短期波動', 'BTC 物理規律']
        },
        {
            id: 'knl-global-liquidity',
            title: 'Global Liquidity Proxy',
            category: 'valuation',
            definition: '追蹤全球貨幣供應量與央行資產負債表，衡量流動性週期對資產的推動力。',
            importance: '揭示了宏觀金融環境才是比特幣牛熊切換的終極推手內容。',
            relatedLink: 'knowledge/knl-global-liquidity.html',
            relatedLinkText: '深入解析：宏觀流動性指標'
        },

        // --- 宏觀指標系列 (Macro Indicators) ---
        {
            id: 'knl-macro-cpi',
            title: 'Consumer Price Index (CPI)',
            category: 'macro',
            definition: '消費者物價指數，衡量生活成本變動的核心指標。',
            importance: '直接決定聯準會的貨幣政策走向，對風險資產價格有極強的週期驅動力。',
            relatedArticleId: 'topic-btc-macro-analysis',
            relatedLink: 'knowledge/knl-macro-cpi.html',
            relatedLinkText: '深入解析：CPI 與通膨路徑',
            keywords: ['物價上漲', '通膨數據', '聯準會臉色', '資產殺手', '生活成本']
        },
        {
            id: 'knl-macro-m1',
            title: 'US Money Supply (M1)',
            category: 'macro',
            definition: '美國狹義貨幣供應量，反映市場中最具流動性的現金與存款量。',
            importance: 'M1 的急劇增長通常預示著流動性氾濫，是資產價格上漲的燃料。',
            relatedArticleId: 'topic-btc-macro-analysis',
            relatedLink: 'knowledge/knl-macro-m1.html',
            relatedLinkText: '深入解析：M1 貨幣供應',
            keywords: ['現金總量', '貨幣流動性', '資產上漲燃料', '印錢速度']
        },
        {
            id: 'knl-macro-m2',
            title: 'US Money Supply (M2)',
            category: 'macro',
            definition: '美國廣義貨幣供應量，是衡量全球宏觀流動性水位的關鍵指標。',
            importance: '比特幣價格與 M2 的增長呈現高度正相關，是抗通膨屬性的核心支撐。',
            relatedArticleId: 'topic-btc-macro-analysis',
            relatedLink: 'knowledge/knl-macro-m2.html',
            relatedLinkText: '深入解析：M2 宏觀水位',
            keywords: ['全球錢變多了嗎', '流動性充裕', '大放水', '風險資產漲幅']
        },
        {
            id: 'knl-macro-usd-devaluation',
            title: 'USD Devaluation (美元貶值)',
            category: 'macro',
            definition: '描述美元購買力隨時間推移持續損耗的現象。',
            importance: '比特幣被設計為一種「抗貶值」的數位資產，是防禦法幣系統風險的終極護城河。',
            relatedArticleId: 'topic-btc-macro-analysis',
            relatedLink: 'knowledge/knl-macro-usd-devaluation.html',
            relatedLinkText: '深入解析：貨幣購買力損耗',
            keywords: ['美金不值錢了', '儲蓄被蠶食', '為什麼要換成 BTC', '法幣風險']
        },
        {
            id: 'knl-macro-treasury-yield',
            title: 'US Treasury Yield (10Y/2Y)',
            category: 'macro',
            definition: '美債收益率，代表市場的無風險利率與經濟增長預期。',
            importance: '收益率曲線倒掛通常預示著衰退風險，影響機構資金在避險與風險資產間的切換。',
            relatedArticleId: 'topic-btc-macro-analysis',
            relatedLink: 'knowledge/knl-macro-treasury-yield.html',
            relatedLinkText: '深入解析：美債收益率曲線',
            keywords: ['無風險利率', '經濟衰退預兆', '債市波動', '機構資金轉向']
        },
        {
            id: 'knl-macro-mortgage-rate',
            title: '30Y Mortgage Rate (房貸利率)',
            category: 'macro',
            definition: '反映實體經濟借貸成本的指標，受基準利率與債市波動影響。',
            importance: '高昂的借貸成本會抑制流動性從房市釋出，間接影響資本市場的活水。',
            relatedArticleId: 'topic-btc-macro-analysis',
            relatedLink: 'knowledge/knl-macro-mortgage-rate.html',
            relatedLinkText: '深入解析：房貸利率與經濟轉機',
            keywords: ['買房成本', '實體經濟壓力', '資金活水', '利率何時見頂']
        },
        {
            id: 'knl-macro-fed-balance-sheet',
            title: 'Fed Balance Sheet (QT/QE)',
            category: 'macro',
            definition: '聯準會資產負債表，展現了央行注入（QE）或抽離（QT）流動性的實際規模。',
            importance: '是宏觀水位的「水龍頭」，決定了市場中熱錢的總量與流向。',
            relatedArticleId: 'topic-btc-macro-analysis',
            relatedLink: 'knowledge/knl-macro-fed-balance-sheet.html',
            relatedLinkText: '深入解析：聯準會縮表與降息',
            keywords: ['收走流動性', 'QT QE 定義', '水龍頭開關', '熱錢總量']
        },

        // --- 鏈上指標系列 (On-chain Indicators) ---
        {
            id: 'knl-onchain-investor-tool',
            title: '2-Year MA Multiplier',
            category: 'onchain',
            definition: '利用 2 年均線及其倍數捕捉週期性買入與拋售點的投資者工具。',
            importance: '簡單直觀地定義了歷史級別的底部墊高點與瘋狂頂部墊高點。',
            relatedArticleId: 'topic-btc-sovereign-liquidity',
            relatedLink: 'knowledge/knl-onchain-investor-tool.html',
            relatedLinkText: '深入解析：2-Year MA 乘數',
            keywords: ['均線倍數', '底部區間', '逃頂工具', '超買超賣']
        },
        {
            id: 'knl-onchain-mvrv-zscore',
            title: 'MVRV Z-Score',
            category: 'onchain',
            definition: '標準化衡量市值與實現價值的偏離程度，識別極端低估與高估狀態。',
            importance: '被公認為判斷比特幣週期大底與大頂的最精確鏈上指標之一。',
            relatedArticleId: 'topic-btc-sovereign-liquidity',
            relatedLink: 'knowledge/knl-onchain-mvrv-zscore.html',
            relatedLinkText: '深入解析：MVRV Z-Score',
            keywords: ['比特幣大底', '週期底部', '歷史低位', '絕佳買點', '極度恐慌時期']
        },
        {
            id: 'knl-onchain-power-law',
            title: 'Bitcoin Power Law Corridor',
            category: 'onchain',
            definition: '基於對數增長軌跡的冪律模型，預測比特幣長期的價格走廊。',
            importance: '排除了短期隨機波動，為長線投資者提供具備科學依據的目標定錨。',
            relatedArticleId: 'topic-btc-sovereign-liquidity',
            relatedLink: 'knowledge/knl-onchain-power-law.html',
            relatedLinkText: '深入解析：冪律成長通道',
            keywords: ['長期持有軌跡', '物理增長模型', 'BTC 數學規律', '價格走廊']
        },
        {
            id: 'knl-onchain-rsi',
            title: 'Monthly RSI (動能指標)',
            category: 'onchain',
            definition: '衡量月線級別買賣盤強弱程度的相對強弱指標。',
            importance: '判斷市場是否進入長期超買（泡沫）或超賣（機會）的關鍵信號。',
            relatedArticleId: 'topic-btc-sovereign-liquidity',
            relatedLink: 'knowledge/knl-onchain-rsi.html',
            relatedLinkText: '深入解析：月線 RSI 動能',
            keywords: ['超買區', '超賣區', '動能指標', '市場情緒熱度']
        },
        {
            id: 'knl-onchain-rainbow-chart',
            title: 'Bitcoin Rainbow Chart',
            category: 'onchain',
            definition: '視覺化長線對數回歸曲線，將情緒分為九個不同的彩色階層。',
            importance: '幫助普通投資者直觀了解當前價格處於週期的哪個情緒階段。',
            relatedArticleId: 'topic-btc-sovereign-liquidity',
            relatedLink: 'knowledge/knl-onchain-rainbow-chart.html',
            relatedLinkText: '深入解析：比特幣彩虹圖',
            keywords: ['九色階層', '現在是哪個顏色', '情緒週期', '視覺化抄底']
        }
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
                'onchain': '鏈上指標 (On-chain)'
            };
        }

        get all() {
            return _knowledgeData;
        }

        get categories() {
            return this._categories;
        }

        getByCategory(category) {
            if (category === 'all') return _knowledgeData;
            return _knowledgeData.filter(item => item.category === category);
        }
    }

    global.CoreKnowledgeRepository = new CoreKnowledgeRepository();

})(window);
