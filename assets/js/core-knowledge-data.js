/**
 * Core Knowledge Data Repository
 * Centralized source of truth for topic-core.html knowledge graph.
 */
(function (global) {
    const _knowledgeData = [
        // --- 核心概念 (Core Concepts) ---
        {
            id: 'btc',
            term: 'Bitcoin (BTC)',
            category: 'core',
            definition: '比特幣是世界上第一個去中心化的數位貨幣，由中本聰於 2008 年提出。它不依賴任何中央機構，而是通過區塊鏈技術和工作量證明（PoW）機制來確保交易的安全與紀錄的不可篡改。',
            importance: '被視為「數位黃金」，是加密貨幣市場的價值錨定物，亦是抵抗法幣通膨的最佳工具。',
            relatedLink: 'project/btc.html',
            relatedLinkText: '深入閱讀：比特幣投資全攻略'
        },
        {
            id: 'eth',
            term: 'Ethereum (ETH)',
            category: 'core',
            definition: '以太坊是一個具備「智能合約」功能的開源區塊鏈平台。如果說比特幣是計算機，以太坊就是世界電腦，允許開發者在其上構建各種去中心化應用程式 (DApps)。',
            importance: 'DeFi、NFT、GameFi 等生態的基石，推動了區塊鏈從「貨幣」走向「應用」的革命。',
            relatedLink: 'project/eth.html',
            relatedLinkText: '深入閱讀：以太坊生態系指南'
        },
        {
            id: 'stablecoin',
            term: 'Stablecoin (穩定幣)',
            category: 'core',
            definition: '穩定幣是一種價格與法幣（如美元）掛鉤的加密貨幣。它旨在解決加密貨幣價格波動劇烈的問題，同時保留了區塊鏈轉帳快速、低成本的特性。',
            importance: '連接法幣與加密世界的橋樑，是交易、借貸與支付結算最主要的媒介。',
            relatedLink: 'topic-stablecoin.html',
            relatedLinkText: '深入閱讀：穩定幣終極指南'
        },

        // --- 宏觀經濟 (Macro Economy) - NEW ---
        {
            id: 'us-exceptionalism',
            term: 'American Exceptionalism (美國例外論)',
            category: 'macro',
            definition: '指美國經濟在全球放緩的背景下，憑藉高科技創新（AI）與強勁的消費需求，展現出獨特的增長韌性。',
            importance: '解釋了美元資產（包括美股與加密資產）為何持續吸引全球資金。複雜的穩定性支撐了風險資產價格。',
            relatedLink: 'knowledge/us-exceptionalism.html',
            relatedLinkText: '深入閱讀：美國經濟韌性'
        },
        {
            id: 'neutral-rate',
            term: 'Neutral Rate (中性利率 R*)',
            category: 'macro',
            definition: '既不刺激也不抑制經濟增長的理論利率水平。2026 年的中性利率預計維持在 3.5% 左右，高於疫情前水平。',
            importance: '這意味著「低利率時代」一去不復返，資產定價必須適應更高的無風險利率與機會成本。',
            relatedLink: 'knowledge/neutral-rate.html',
            relatedLinkText: '深入閱讀：利率新常態'
        },
        {
            id: 'liquidity-sponge',
            term: 'Liquidity Sponge (流動性海綿)',
            category: 'macro',
            definition: '描述比特幣吸收全球過剩貨幣供應的能力。當 M2 貨幣供應量增加時，比特幣往往表現優於其他資產。',
            importance: '比特幣價格與全球 M2 增長率的耦合度越來越高，成為對沖貨幣貶值的工具。',
            relatedLink: 'knowledge/liquidity-sponge.html',
            relatedLinkText: '深入閱讀：M2 與比特幣'
        },
        {
            id: 'asset-correlation',
            term: 'Asset Correlation (資產相關性)',
            category: 'macro',
            definition: '2026 年比特幣與納斯達克指數維持高貝塔 (0.38) 相關，但與黃金相關性極低 (0.01)，顯示其風險屬性仍大於避險屬性。',
            importance: '構建投資組合時的關鍵參數，打破了「數位黃金」完全避險的迷思。',
            relatedLink: 'knowledge/asset-correlation.html',
            relatedLinkText: '深入閱讀：資產相關性分析'
        },

        // --- 市場週期 (Market Cycles) - NEW ---
        {
            id: 'four-year-cycle',
            term: 'Four Year Cycle (四年減半週期)',
            category: 'cycle',
            definition: '傳統觀點認為比特幣每四年的產量減半會導致供應衝擊並推動價格暴漲。然而，2026 年的數據顯示此模型受到 ETF 流動性與宏觀因素的強烈挑戰。',
            importance: '理解為什麼歷史規律可能會失效，是從新手進階到成熟投資者的必經之路。',
            relatedLink: 'knowledge/four-year-cycle.html',
            relatedLinkText: '深入閱讀：週期的失效'
        },
        {
            id: 'liquidity-cycle',
            term: 'Liquidity Cycle (流動性週期)',
            category: 'cycle',
            definition: '一個基於全球債務再融資與央行資產負債表擴張的三年週期，正逐漸取代比特幣傳統的四年減半週期。',
            importance: '投資者應更多關注宏觀流動性指標（如通膨、利率），而非單純等待「減半」帶來的供應衝擊。',
            relatedLink: 'knowledge/liquidity-cycle.html',
            relatedLinkText: '深入閱讀：三年與四年之爭'
        },
        {
            id: 'rainbow-chart',
            term: 'Rainbow Chart (彩虹圖)',
            category: 'cycle',
            definition: '一種對數回歸圖表，用不同顏色的帶狀區域來標示比特幣價格處於「低估（Fire Sale）」還是「泡沫（Bubble）」階段。',
            importance: '提供了長線投資者判斷進出場時機的視覺化工具，避免在情緒過熱時追高。',
            relatedLink: 'knowledge/rainbow-chart.html',
            relatedLinkText: '深入閱讀：彩虹圖解析'
        },

        // --- 基礎設施 (Infrastructure) ---
        {
            id: 'blockchain',
            term: 'Blockchain (區塊鏈)',
            category: 'infra',
            definition: '一種分散式的數位帳本技術，資料以「區塊」的形式串接，並透過密碼學確保不可篡改。每個節點都保存一份完整的帳本副本。',
            importance: '創造了「去信任化」的協作基礎，是 Web3 世界的底層操作系統。',
            relatedLink: null,
            relatedLinkText: null
        },
        {
            id: 'smart-contract',
            term: 'Smart Contract (智能合約)',
            category: 'infra',
            definition: '部署在區塊鏈上的自動執行程式碼。當滿足預設條件時，合約會自動執行相應的操作（如轉帳、發幣），無需人工干預。',
            importance: '實現了「程式碼即法律 (Code is Law)」，是 DeFi 與 DApps 運作的核心與靈魂。',
            relatedLink: null,
            relatedLinkText: null
        },
        {
            id: 'depin',
            term: 'DePIN (去中心化實體基礎設施)',
            category: 'infra',
            definition: 'Decentralized Physical Infrastructure Networks。利用代幣激勵，讓個人貢獻硬體資源（如 GPU、硬碟、基地台）構建基礎設施網絡。',
            importance: '解決了 AI 時代對算力與存儲的指數級需求，代表項目包括 Render (GPU) 與 Arweave (存儲)。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 5.2'
        },
        {
            id: 'layer2-base',
            term: 'Base (Coinbase L2)',
            category: 'infra',
            definition: '由 Coinbase 推出、基於 OP Stack 構建的以太坊 Layer 2。旨在將其龐大的 Web2 用戶群導入鏈上世界。',
            importance: '2026 年領先的 L2 之一，展示了中心化交易所如何構建去中心化生態系統的成功範例。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 5.3'
        },

        // --- 機構與監管 (Institutional & Reg) - NEW ---
        {
            id: 'genius-act',
            term: 'GENIUS Act',
            category: 'reg',
            definition: '指導穩定幣監管的關鍵法案。確立了銀行與持牌機構在穩定幣發行上的壟斷地位，並限制了無牌照穩定幣的收益率。',
            importance: '結束了「狂野西部」時代，雖然限制了創新，但為機構資金入場提供了必要的法律確定性。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 3.1'
        },
        {
            id: 'clarity-act',
            term: 'CLARITY Act',
            category: 'reg',
            definition: '解決 SEC 與 CFTC 管轄權爭議的法案。明確定義了哪些資產屬於「數位商品」而非證券。',
            importance: '為交易所合規鋪平道路，並允許傳統銀行開始提供加密資產託管服務。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 3.2'
        },
        {
            id: 'dats',
            term: 'DATs (數位資產財庫)',
            category: 'reg',
            definition: 'Digital Asset Treasuries。指上市公司（如 MicroStrategy）將比特幣納入資產負債表作為儲備資產的策略。',
            importance: '企業採納比特幣的里程碑，未來可能被納入 MSCI 等全球指數，帶來巨大的被動買盤。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 4.2'
        },
        {
            id: 'blackrock-buidl',
            term: 'BlackRock BUIDL',
            category: 'reg',
            definition: '貝萊德推出的代幣化基金。允許投資者在鏈上持有美國國債等傳統資產，並實現全天候即時結算。',
            importance: '傳統金融 (TradFi) 與去中心化金融 (DeFi) 融合的旗艦項目，推動 RWA 賽道爆發。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 4.4'
        },

        // --- 資產分類 (Assets) ---
        {
            id: 'coin-token',
            term: 'Coin vs. Token',
            category: 'assets',
            definition: 'Coin (原生代幣) 擁有獨立的區塊鏈 (如 BTC, SOL)；Token (應用代幣) 則寄生於現有區塊鏈上 (如 ERC-20 代幣, USDT)。',
            importance: '區分資產的技術屬性與價值來源的基礎概念。',
            relatedLink: null,
            relatedLinkText: null
        },
        {
            id: 'rwa-asset',
            term: 'RWA (現實世界資產)',
            category: 'assets',
            definition: 'Real World Assets。將房地產、國債、藝術品等線下資產通過代幣化引入區塊鏈市場。',
            importance: '2026 年核心投資敘事。Ondo Finance 等項目讓鏈上資金能無風險地獲取美債收益。',
            relatedLink: 'topic-rwa.html',
            relatedLinkText: '深入閱讀：RWA 賽道全景'
        },

        // --- 經濟模型 (DeFi) ---
        {
            id: 'defi',
            term: 'DeFi (去中心化金融)',
            category: 'fi',
            definition: '建立在區塊鏈上的金融體系，用智能合約取代銀行與券商，提供借貸、交易、衍生品等服務。',
            importance: '實現金融普惠，讓資金能無許可地在全球自由流動。',
            relatedLink: null,
            relatedLinkText: null
        },
        {
            id: 'sky-protocol',
            term: 'Sky Protocol (原 MakerDAO)',
            category: 'fi',
            definition: 'MakerDAO 的轉型升級版。推出了新的穩定幣 USDS 與治理代幣 SKY，並引入具備特定功能的 SubDAOs。',
            importance: 'DeFi 老牌龍頭為了適應監管（如凍結功能）與擴大採用而進行的重大戰略轉型。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 5.4'
        },

        // --- 交易與分析 (Trading) ---
        {
            id: 'ai-agent',
            term: 'AI Agent (AI 代理)',
            category: 'trading',
            definition: '具備自主決策能力的 AI 程式。能自動分析輿情、管理鏈上資產、執行複雜的 DeFi 策略。',
            importance: '例如 Fetch.ai 與 SingularityNET 組成的 ASI 聯盟，試圖去中心化 AI 的控制權。',
            relatedLink: 'post/topic-macro.html',
            relatedLinkText: '見報告 5.5'
        },

        // --- 安全與錢包 (Security) ---
        {
            id: 'wallet-types',
            term: 'Custodial vs. Non-Custodial',
            category: 'security',
            definition: '託管型 (交易所) 由平台保管私鑰；非託管型 (Metamask) 由用戶自己保管助記詞。',
            importance: '「Not Your Keys, Not Your Coins」。資產主權與便利性之間的權衡。',
            relatedLink: null,
            relatedLinkText: null
        },

        // --- 社群文化 (Culture) ---
        {
            id: 'meme-coin',
            term: 'Memecoin (迷因幣)',
            category: 'culture',
            definition: '源自網路文化，價值主要取決於社群共識與注意力。如 DOGE, PEPE。',
            importance: '展現了加密市場獨特的「注意力經濟」，風險極高但爆發力強。',
            relatedLink: 'topic-meme.html',
            relatedLinkText: '深入閱讀：迷因幣解析'
        },

        // --- 關鍵技術 (Emerging Tech) - NEW ---
        {
            id: 'modular-blockchain',
            term: 'Modular Blockchain (模組化區塊鏈)',
            category: 'infra',
            definition: '將執行、結算、共識與數據可用性解耦的區塊鏈架構。Celestia 是此領域的代表，專注於解決不可能三角。',
            importance: '區塊鏈從「單體黑莓機」走向「模組化iPhone」的架構革命，是擴展至 10 億用戶的基石。',
            relatedLink: 'knowledge/modular-blockchain.html',
            relatedLinkText: '深入閱讀：模組化革命'
        },
        {
            id: 'zk-rollup',
            term: 'ZK-Rollup (零知識證明)',
            category: 'scaling',
            definition: '利用數學證明實現即時確認 (Instant Finality) 的 Layer 2 擴容方案。兼具隱私保護與極高的吞吐量。',
            importance: '被 Vitalik 視為擴容的「聖杯」，長期來看將憑藉安全性與成本優勢取代 Optimistic Rollup。',
            relatedLink: 'knowledge/zk-rollup.html',
            relatedLinkText: '深入閱讀：ZK 終極指南'
        },
        {
            id: 'prediction-markets',
            term: 'Prediction Markets (預測市場)',
            category: 'app',
            definition: '去中心化的資訊發現平台 (如 Polymarket)。利用「真金白銀」的博弈來過濾雜訊，獲取真實世界的概率資訊。',
            importance: 'Web3 最成功的非金融應用場景 (Consumer App)，是 AI 獲取真實數據的潛在預言機。',
            relatedLink: 'knowledge/prediction-markets.html',
            relatedLinkText: '深入閱讀：預測市場分析'
        },
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
                'app': '應用與賽道 (Apps)'
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
