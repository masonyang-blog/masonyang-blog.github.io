/**
 * Articles & Content Repository
 * Unified AI SEO architecture: Serves as the single source of truth for all content.
 */
(function (global) {
    const _articles = [
        {
            'id': '20260723-google-oracle-spillover',
            'category': 'market-analysis',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-07-23',
            'modified': '2026-07-23',
            'tag': 'macro-economy',
            'tags': ['macro-economy'],
            'title': 'Alphabet Q2 財報對 Oracle 溢出效應與 AI 基礎設施風險分析',
            'link': 'news/20260723-google-oracle-spillover.html'
        },
        {
            'id': '20260721-unity-investment-analysis',
            'category': 'market-analysis',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-07-21',
            'modified': '2026-07-21',
            'tag': 'macro-economy',
            'tags': ['macro-economy'],
            'title': 'Unity股票投資分析：AI廣告科技Vector與Unity 6底層重置，如何驅動NYSE: U估值重估？',
            'link': 'news/20260721-unity-investment-analysis.html'
        },
        {
            'id': '20260718-openai-finance-crisis',
            'category': 'market-analysis',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-07-18',
            'modified': '2026-07-18',
            'tag': 'macro-economy',
            'tags': ['macro-economy'],
            'title': 'OpenAI 財務危機與 Oracle 星門悖論：全球 AI 泡沫崩潰情境推演',
            'link': 'news/20260718-openai-finance-crisis.html'
        },
        {
            'id': '20260702-memory-short-selling-analysis',
            'category': 'market-analysis',
            'published': '2026-07-02',
            'modified': '2026-07-02',
            'tag': 'macro-analysis',
            'tags': ['macro-analysis'],
            'format': 'news',
            'title': '2026年記憶體產業崩跌：如何利用籌碼與現貨價背離進行放空？為何強制回補是致命軋空陷阱？',
            'link': 'news/20260702-memory-short-selling-analysis.html'
        },

        {
            'id': '20260702-oil-market-deep-dive',
            'category': 'market-analysis',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-07-02',
            'modified': '2026-07-02T12:00:00+08:00',
            'tag': 'macro-economy',
            'tags': ['macro-economy'],
            'title': '2026年全球原油價格深度分析：價格崩跌原因與100美元重返預測',
            'link': 'news/20260702-oil-market-deep-dive.html'
        },
        {
            'id': '20260612-spacex-ipo-valuation-break-risk',
            'category': 'market-analysis',
            'published': '2026-06-12',
            'modified': '2026-06-12',
            'tag': 'macro-analysis',
            'tags': ['macro-analysis'],
            'format': 'news',
            'title': 'SpaceX IPO估值泡沫如何透過被動指數反噬大盤？短期債務與極端稀釋會引發破發嗎？三種市場劇本演進邏輯深度分析 (2026年最新版)',
            'link': 'news/20260612-spacex-ipo-valuation-break-risk.html'
        },

        {
            'id': '20260531-us-debt-gold-btc-impact',
            'category': 'market-analysis',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-31',
            'modified': '2026-05-31',
            'tag': 'macro-economy',
            'tags': ['macro-economy'],
            'title': '美國國債危機對黃金與比特幣影響預測：2026 宏觀經濟與避險資產深度解析',
            'link': 'news/20260531-us-debt-gold-btc-impact.html'
        },
        {
            'id': '20260530-btc-hedge-strategy',
            'category': 'market-analysis',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-30',
            'modified': '2026-05-30',
            'tag': 'macro-economy',
            'tags': ['macro-economy'],
            'title': '比特幣對沖與多空策略：如何建構量化套利模型？高波動市場中的對沖組合配置',
            'link': 'news/20260530-btc-hedge-strategy.html'
        },
        {
            'id': '20260529-allora-crypto-research',
            'category': 'market-analysis',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-29',
            'modified': '2026-05-29',
            'tag': 'macro-economy',
            'tags': ['macro-economy'],
            'title': 'Allora (ALLO) 去中心化 AI 網路：模型協調架構如何解決資訊孤島？為什麼「遺憾最小化」是集體智慧的定價核心？',
            'link': 'news/20260529-allora-crypto-research.html'
        },
        {
            'id': '20260528-gold-btc-crash-analysis',
            'category': 'market-analysis',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-29',
            'modified': '2026-05-29',
            'tag': 'macro-economy',
            'tags': ['macro-economy'],
            'title': '2026流動性危機下的資產定價權重塑：黃金與比特幣同步崩盤的結構必然性與範式轉移',
            'link': 'news/20260528-gold-btc-crash-analysis.html'
        },
        {
            'id': '20260528-stock-crash-risk',
            'category': 'market-analysis',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-28',
            'modified': '2026-05-28',
            'tag': 'macro-economy',
            'tags': ['macro-economy'],
            'title': '美股崩盤風險評估：宏觀背離、流動性陷阱與信貸週期的終局',
            'link': 'news/20260528-stock-crash-risk.html'
        },
        {
            'id': '20260527-memory-supercycle-analysis',
            'category': 'tech-ai',
            'series': 'ai-economy',
            'series_type': 'report',
            'published': '2026-05-27',
            'modified': '2026-05-27',
            'tag': 'compute-infra',
            'tags': ['compute-infra'],
            'title': '2026 記憶體超級循環深度解析：AI 驅動 HBM 產能排擠與價格傳導邏輯',
            'link': 'news/20260527-memory-supercycle-analysis.html'
        },
        {
            'id': '20260526-web4-agent-driven-intelligent-network',
            'category': 'market-analysis',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-26',
            'modified': '2026-05-26',
            'tag': 'macro-economy',
            'tags': ['macro-economy'],
            'title': 'Web4：如何以 AI Agent 驅動全智能網路？剖析 EIP-7702、Anoma 意圖架構與 DePIN 算力變革',
            'link': 'news/20260526-web4-agent-driven-intelligent-network.html'
        },
        {
            'id': '20260526-spacex-ipo-valuation-methodology',
            'category': 'market-analysis',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-26',
            'modified': '2026-05-26',
            'tag': 'macro-economy',
            'tags': ['macro-economy'],
            'title': 'SpaceX IPO 估值方法論與財務招股書 (S-1) 深度研究報告 (2026)',
            'link': 'news/20260526-spacex-ipo-valuation-methodology.html'
        },
        {
            'id': '20260526-mara-ai-transition-valuation',
            'category': 'crypto-web3',
            'series': 'ai-economy',
            'series_type': 'report',
            'published': '2026-05-26',
            'modified': '2026-05-26',
            'tag': 'btc',
            'tags': ['btc', 'compute-infra'],
            'format': 'deep-dive',
            'title': '2026挖礦股估值重塑：MARA與IREN轉型AI算力與微策略(MSTR)資本困境對比',
            'link': 'news/20260526-mara-ai-transition-valuation.html'
        },
        {
            'id': '20260525-trump-midterm-crisis',
            'category': 'market-analysis',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-25',
            'modified': '2026-05-25',
            'tag': 'macro-economy',
            'tags': ['macro-economy'],
            'title': '2026川普期中選舉與金融危機推演：商業地產CRE爆雷、聯準會內鬥與資產防禦配置',
            'link': 'news/20260525-trump-midterm-crisis.html'
        },
        {
            'id': '20260524-global-macro-financial-crisis',
            'category': 'market-analysis',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-25',
            'modified': '2026-05-24',
            'tag': 'macro-economy',
            'tags': ['macro-economy'],
            'title': '2026年金融市場崩跌分析：為何美債收益率飆升？比特幣跌破75000、黃金回調與凸性對沖解析',
            'link': 'news/20260524-global-macro-financial-crisis.html'
        },
        {
            'id': '20260521-alternative-assets-trading-strategies',
            'category': 'market-analysis',
            'series': 'investment-sop',
            'series_type': 'spoke',
            'published': '2026-05-22',
            'modified': '2026-05-22',
            'tag': 'macro-economy',
            'tags': ['macro-economy'],
            'title': '投資策略｜2026 替代資產投資與跨市場交易策略：從 ETF 套利到宏觀對沖',
            'link': 'post/trading-strategies-alternative-assets.html'
        },
        {
            'id': 'trading-strategies-commodity-futures',
            'category': 'research-tools',
            'series': 'investment-sop',
            'series_type': 'spoke',
            'published': '2026-05-22',
            'modified': '2026-05-22',
            'tag': 'macro-economy',
            'tags': ['macro-economy'],
            'format': 'deep-dive',
            'title': '投資策略｜大宗商品期貨量化策略：期限結構與套利交易深度研究',
            'link': 'post/trading-strategies-commodity-futures.html'
        },
        {
            'id': '20260514-global-stagflation-crisis-analysis',
            'category': 'market-analysis',
            'published': '2026-05-14',
            'modified': '2026-05-14',
            'tag': 'macro-analysis',
            'tags': ['macro-analysis'],
            'format': 'news',
            'title': '2026 全球滯脹危機深度查核：地緣衝突、能源通膨與利率陷阱',
            'link': 'news/20260514-global-stagflation-crisis-analysis.html'
        },
        {
            'id': '20260521-amd-valuation-deception',
            'category': 'market-analysis',
            'series': 'winter-is-coming',
            'series_type': 'spoke',
            'published': '2026-05-21',
            'modified': '2026-05-21',
            'tag': 'macro-analysis',
            'tags': ['macro-analysis', 'tech-trends'],
            'format': 'news',
            'title': '華爾街的估值幻象：拆解投資銀行調高 AMD 目標價的敘事騙局與供需失衡真相',
            'link': 'news/20260521-amd-valuation-deception.html'
        },
        {
            'id': '20260521-clarity-act-legislative-analysis',
            'category': 'crypto-web3',
            'series': 'tokenized-future',
            'series_type': 'spoke',
            'published': '2026-05-21',
            'modified': '2026-05-21',
            'tag': 'arbitrage',
            'tags': ['arbitrage'],
            'format': 'news',
            'title': '《數位資產市場清晰法案》(CLARITY Act) 深度解析：2026年美國金融監管框架與地緣政治博弈',
            'link': 'news/20260521-clarity-act-legislative-analysis.html'
        },
        {
            'id': 'trading-strategies-fixed-income-interest-rate-strategies',
            'category': 'research-tools',
            'series': 'investment-sop',
            'series_type': 'spoke',
            'published': '2026-05-20',
            'modified': '2026-05-20',
            'tag': 'arbitrage',
            'tags': ['arbitrage', 'macro-analysis'],
            'format': 'deep-dive',
            'title': '投資策略｜2026固定收益投資策略深度解析（上）：殖利率曲線、國債基準與蝶式曲率交易',
            'link': 'post/trading-strategies-fixed-income-interest-rate-strategies.html'
        },
        {
            'id': 'trading-strategies-fixed-income-credit-structured-strategies',
            'category': 'research-tools',
            'series': 'investment-sop',
            'series_type': 'spoke',
            'published': '2026-05-20',
            'modified': '2026-05-20',
            'tag': 'arbitrage',
            'tags': ['arbitrage', 'macro-analysis'],
            'format': 'deep-dive',
            'title': '投資策略｜2026固定收益投資策略深度解析（下）：信用套利、MBS與結構化金融量化機制',
            'link': 'post/trading-strategies-fixed-income-credit-structured-strategies.html'
        },
        {
            'id': 'trading-strategies-options-yield-enhancement-strategies',
            'category': 'research-tools',
            'series': 'investment-sop',
            'series_type': 'spoke',
            'published': '2026-05-20',
            'modified': '2026-05-20',
            'tag': 'factor-investing',
            'tags': ['factor-investing', 'arbitrage'],
            'format': 'deep-dive',
            'title': '投資策略｜期權策略與波動率博弈 (上)：系統性收益增強、Greeks 動態管理與 Portfolio Margin 機構投研報告',
            'link': 'post/trading-strategies-options-yield-enhancement-strategies.html'
        },
        {
            'id': 'trading-strategies-options-volatility-strategies',
            'category': 'research-tools',
            'series': 'investment-sop',
            'series_type': 'spoke',
            'published': '2026-05-20',
            'modified': '2026-05-20',
            'tag': 'factor-investing',
            'tags': ['factor-investing', 'arbitrage'],
            'format': 'deep-dive',
            'title': '投資策略｜期權策略與波動率博弈 (下)：進階多腿組合、投資組合保證金與 Volmageddon 尾部風險復盤',
            'link': 'post/trading-strategies-options-volatility-strategies.html'
        },
        {
            'id': 'trading-strategies-fundamental-analysis',
            'category': 'research-tools',
            'series': 'investment-sop',
            'series_type': 'spoke',
            'published': '2026-05-19',
            'modified': '2026-05-20',
            'tag': 'factor-investing',
            'tags': ['factor-investing'],
            'format': 'deep-dive',
            'title': '投資策略｜基本面分析：量化多因子選股模型與風格因子實證研究 (2026年投研方法論)',
            'link': 'post/trading-strategies-fundamental-analysis.html'
        },
        {
            'id': '20260519-ap2-agent-payments-protocol',
            'category': 'tech-ai',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-19',
            'modified': '2026-05-19',
            'tag': 'ai-agent',
            'tags': ['ai-agent'],
            'format': 'deep-dive',
            'title': 'AP2 代理支付協議：人工智慧代理商務的密碼學信任框架與全球支付基礎設施演進',
            'link': 'news/20260519-ap2-agent-payments-protocol.html'
        },
        {
            'id': 'trading-strategies-technical-analysis-strategies',
            'category': 'research-tools',
            'series': 'investment-sop',
            'series_type': 'spoke',
            'published': '2026-05-19',
            'modified': '2026-05-20',
            'tag': 'factor-investing',
            'tags': ['factor-investing', 'arbitrage'],
            'format': 'deep-dive',
            'title': '投資策略｜技術分析與量化交易策略：系統性多因子與統計套利研究',
            'link': 'post/trading-strategies-technical-analysis-strategies.html'
        },
        {
            'id': 'trading-strategies-dcf-valuation-model-guide',
            'category': 'research-tools',
            'series': 'investment-sop',
            'series_type': 'spoke',
            'published': '2026-05-18',
            'modified': '2026-05-18',
            'tag': 'dcf-model',
            'tags': ['dcf-model'],
            'format': 'deep-dive',
            'title': '投資策略｜貼現現金流模型 (DCF) 估值實務：如何精密建構自由現金流與折現率？為何傳統模型極易失效？內在價值、WACC、終值評估',
            'link': 'post/trading-strategies-dcf-valuation-model-guide.html'
        },
        {
            'id': 'trading-strategies-dcf-valuation-model',
            'category': 'research-tools',
            'series': 'investment-sop',
            'series_type': 'spoke',
            'published': '2026-05-18',
            'modified': '2026-05-19',
            'tag': 'compute-infra',
            'tags': ['compute-infra', 'dcf-model'],
            'format': 'tools',
            'title': '投資策略｜動態雙軌制 DCF 估值計算機：NVDA 隱含預期反推',
            'link': 'post/trading-strategies-dcf-valuation-model.html'
        },
        {
            'id': '20260517-winter-is-coming-series-guide',
            'category': 'traditional-markets',
            'series': 'macro-2026',
            'series_type': 'guide',
            'published': '2026-05-17',
            'modified': '2026-05-19',
            'tag': 'gold',
            'tags': ['gold', 'us-stocks', 'dcf-model'],
            'format': 'deep-dive',
            'title': '【專題系列】凜冬將至 (Winter Is Coming)：2026年5月全球市場最後逃命窗口總覽與導讀',
            'link': 'post/20260517-winter-is-coming-series-guide.html'
        },
        {
            'id': '20260517-gold-valuation-and-risk-assessment',
            'category': 'macro-geopolitics',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-17',
            'modified': '2026-05-17',
            'tag': 'gold',
            'tags': ['gold', 'us-treasury', 'liquidity-crisis', 'sec-inflation'],
            'format': 'deep-dive',
            'title': '黃金戰略配置與風險評估：流動性枯竭、沃什休克療法與量子計算衝擊下的定價框架',
            'link': 'news/20260517-gold-valuation-and-risk-assessment.html'
        },
        {
            'id': '20260517-memory-semiconductor-short-analysis',
            'category': 'macro-geopolitics',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-17',
            'modified': '2026-05-17',
            'tag': 'sec-inflation',
            'tags': ['sec-inflation'],
            'format': 'deep-dive',
            'title': '記憶體半導體做空深度分析：AI超級週期下的結構性重估與軋空風險',
            'link': 'news/20260517-memory-semiconductor-short-analysis.html'
        },
        {
            'id': '20260517-us-pre-ipo-bubble-and-liquidity-flight',
            'category': 'traditional-markets',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-17',
            'modified': '2026-05-23',
            'tag': 'us-stocks',
            'tags': ['us-stocks', 'liquidity-crisis', 'dcf-model'],
            'format': 'deep-dive',
            'title': '美股 Pre-IPO 泡沫或逃命潮？2026 二級市場兩極化、VC 退出壓力與一二級倒掛真相',
            'link': 'news/20260517-us-pre-ipo-bubble-and-liquidity-flight.html'
        },
        {
            'id': '20260516-us-stock-valuation-extremes-and-short-squeeze-analysis',
            'category': 'traditional-markets',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-16',
            'modified': '2026-05-16',
            'tag': 'us-stocks',
            'tags': ['us-stocks', 'dcf-model', 'chip-analysis'],
            'format': 'deep-dive',
            'title': '2026美股市場估值極限與空頭部位深度分析：AI超級週期下的極端溢價與籌碼擁擠度',
            'link': 'news/20260516-us-stock-valuation-extremes-and-short-squeeze-analysis.html'
        },
        {
            'id': '20260516-global-market-selloff-and-investment-strategy',
            'category': 'research-tools',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-16',
            'modified': '2026-05-23',
            'tag': 'us-treasury',
            'tags': ['us-treasury', 'liquidity-crisis', 'dcf-model'],
            'format': 'deep-dive',
            'title': '2026全球金融市場潰敗深度研究：多重宏觀衝擊與美聯儲體制轉換的連鎖效應',
            'link': 'news/20260516-global-market-selloff-and-investment-strategy.html'
        },
        {
            'id': '20260515-gold-price-strategic-analysis',
            'category': 'crypto-web3',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-15',
            'modified': '2026-05-15',
            'tag': 'gold',
            'tags': ['gold', 'rwa', 'sec-inflation', 'fed'],
            'format': 'deep-dive',
            'title': '2026黃金價格深度分析：大跌原因剖析與5,000美元目標位預測',
            'link': 'news/20260515-gold-price-strategic-analysis.html'
        },
        {
            'id': '20260514-global-stagflation-crisis-analysis',
            'category': 'macro-geopolitics',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-14',
            'modified': '2026-05-14',
            'tag': 'gold',
            'tags': ['gold', 'sec-inflation', 'fed', 'irgc'],
            'format': 'deep-dive',
            'title': '2026 全球滯脹危機深度查核：地緣衝突、能源通膨與利率陷阱',
            'link': 'news/20260514-global-stagflation-crisis-analysis.html'
        },
        {
            'id': '20260514-china-new-energy-capacity-export-analysis',
            'category': 'traditional-markets',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-14',
            'modified': '2026-05-14',
            'tag': 'us-stocks',
            'tags': ['us-stocks'],
            'format': 'deep-dive',
            'title': '中國新能源產能過剩與全球出口路徑深度分析 (2026)',
            'link': 'news/20260514-china-new-energy-capacity-export-analysis.html'
        },
        {
            'id': '20260513-us-inflation-oil-rates-analysis',
            'category': 'traditional-markets',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-13',
            'modified': '2026-05-13',
            'tag': 'crude-oil',
            'tags': ['crude-oil', 'sec-inflation', 'fed'],
            'format': 'deep-dive',
            'title': '美國通膨 2026：CPI 3.8% 與 PPI 6% 觸發的二次燃燒分析',
            'link': 'news/20260513-us-inflation-oil-rates-analysis.html'
        },
        {
            'id': '20260513-china-ai-competitive-advantage-analysis',
            'category': 'traditional-markets',
            'series': 'ai-economy',
            'series_type': 'report',
            'published': '2026-05-13',
            'modified': '2026-05-13',
            'tag': 'us-stocks',
            'tags': ['us-stocks'],
            'format': 'deep-dive',
            'title': '中國 AI 產業競爭力架構：能源、硬體與產出效率分析 (2026)',
            'link': 'news/20260513-china-ai-competitive-advantage-analysis.html'
        },
        {
            'id': '20260512-ev-charging-bottleneck-analysis',
            'category': 'traditional-markets',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-12',
            'modified': '2026-05-23',
            'tag': 'us-stocks',
            'tags': ['us-stocks'],
            'format': 'deep-dive',
            'title': '特斯拉成長瓶頸分析：兆瓦級技術、自動駕駛能源規模與電網整合挑戰 (2026)',
            'link': 'news/20260512-ev-charging-bottleneck-analysis.html'
        },
        {
            'id': '20260511-china-energy-strategic-hedging',
            'category': 'macro-geopolitics',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-11',
            'modified': '2026-05-19',
            'tag': 'sec-inflation',
            'tags': ['sec-inflation', 'irgc'],
            'format': 'deep-dive',
            'title': '2026 能源封鎖下的圍牆突圍戰：解析中國如何利用非對稱成本與產能海嘯，徹底破解美國的「能源門票」霸權與地緣鎖喉',
            'link': 'news/20260511-china-energy-strategic-hedging.html'
        },
        {
            'id': '20260511-metalogic-hormuz-gate-of-power',
            'category': 'macro-geopolitics',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-05-11',
            'modified': '2026-05-11',
            'tag': 'irgc',
            'tags': ['irgc'],
            'format': 'deep-dive',
            'title': 'Metalogic 發布最新報告《Hormuz: The Gate of Power》論述全球能源新秩序。揭示美國如何將護航權轉化為全球金融租金',
            'link': 'news/20260511-metalogic-hormuz-gate-of-power.html'
        },
        {
            'id': '20260423-iran-irgc-btc-fees',
            'category': 'crypto-web3',
            'series': 'bitcoin',
            'series_type': 'report',
            'published': '2026-04-23',
            'modified': '2026-04-23',
            'tag': 'btc',
            'tags': ['btc', 'eth', 'irgc'],
            'format': 'deep-dive',
            'title': '伊朗革命衛隊比特幣通道費：霍爾木茲海峽數位關卡深度研究報告',
            'link': 'news/20260423-iran-irgc-btc-fees.html'
        },
        {
            'id': '20260420-151-trading-strategies-list',
            'category': 'research-tools',
            'series': 'investment-sop',
            'series_type': 'guide',
            'published': '2026-04-20',
            'modified': '2026-05-19',
            'tag': 'us-stocks',
            'tags': ['us-stocks', 'factor-investing'],
            'format': 'deep-dive',
            'title': '《151 種交易策略》完整詳細清單：量化交易員的策略百科全書',
            'link': 'post/trading-strategies-list-151.html'
        },
        {
            'id': 'topic-btc-synthesis-2026',
            'category': 'crypto-web3',
            'series': 'bitcoin',
            'series_type': 'guide',
            'published': '2026-04-21',
            'modified': '2026-05-19',
            'tag': 'btc',
            'tags': ['btc', 'gold', 'mstr'],
            'format': 'deep-dive',
            'title': '2026 比特幣高密度研報：從主權儲備到 BTCFi 的全景圖',
            'link': 'post/topic-btc.html'
        },
        {
            'id': '20260418-mstr-stock-growth-analysis',
            'category': 'crypto-web3',
            'series': 'bitcoin',
            'series_type': 'report',
            'published': '2026-04-18',
            'modified': '2026-04-18',
            'tag': 'btc',
            'tags': ['btc', 'dcf-model', 'mstr'],
            'format': 'deep-dive',
            'title': 'MSTR 股價成長因素：如何透過「比特幣收益率」飛輪驅動估值轉型？',
            'link': 'news/20260418-mstr-stock-growth-analysis.html'
        },
        {
            'id': '20260418-bitcoin-rise-analysis',
            'category': 'crypto-web3',
            'series': 'bitcoin',
            'series_type': 'report',
            'published': '2026-04-18',
            'modified': '2026-04-18',
            'tag': 'btc',
            'tags': ['btc', 'irgc'],
            'format': 'deep-dive',
            'title': '比特幣突破 $78,000 如何由地緣與政策驅動並啟動機構資產重估？沃什衝擊、克拉里蒂法案',
            'link': 'news/20260418-bitcoin-rise-analysis.html'
        },
        {
            'id': 'news-20260415-gray-rhino-market-crash-analysis',
            'category': 'research-tools',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-04-15',
            'modified': '2026-04-15',
            'tag': 'us-treasury',
            'tags': ['us-treasury', 'liquidity-crisis', 'sec-inflation', 'factor-investing', 'fed'],
            'format': 'deep-dive',
            'title': '2026 全球市場範式轉移：為什麼三大「灰犀牛」（通膨二次反潰、供應鏈癱瘓與私募信貸清算）並行將終結後流動性時代的資產狂歡？',
            'link': 'news/20260415-gray-rhino-market-crash-analysis.html'
        },
        {
            'id': 'post-20260414-tda-geopolitical-intelligence-dashboard',
            'category': 'macro-geopolitics',
            'series': 'black-swan',
            'series_type': 'guide',
            'published': '2026-04-14',
            'modified': '2026-05-19',
            'tag': 'irgc',
            'tags': ['irgc'],
            'format': 'deep-dive',
            'title': '地緣政治與拓撲數據分析 (TDA) 深度預警系統 (2026)：決策支援與衝突模擬',
            'link': 'post/20260414-tda-geopolitical-intelligence-dashboard.html'
        },
        {
            'id': 'topic-macro-report',
            'category': 'crypto-web3',
            'series': 'bitcoin',
            'series_type': 'report',
            'published': '2026-03-14',
            'modified': '2026-04-14',
            'tag': 'btc',
            'tags': ['btc', 'liquidity-crisis'],
            'format': 'deep-dive',
            'title': 'Messari Research: 2026 全球宏觀戰略深度報告 | 投資戰略報告',
            'link': 'post/topic-macro.html'
        },
        {
            'id': 'news-20260414-ravedao-price-surge-analysis',
            'category': 'macro-geopolitics',
            'series_type': 'report',
            'published': '2026-04-14',
            'modified': '2026-04-14',
            'tag': 'liquidity-crisis',
            'tags': ['liquidity-crisis'],
            'format': 'deep-dive',
            'title': 'RaveDAO (RAVE) 2100% 暴漲真相：為什麼 30 億市值只是場「流動性蜃樓」？ | 投資戰略報告',
            'link': 'news/20260414-ravedao-price-surge-analysis.html'
        },
        {
            'id': '20260413-compute-power-ai-mining-report',
            'category': 'crypto-web3',
            'series': 'ai-economy',
            'series_type': 'guide',
            'published': '2026-04-13',
            'modified': '2026-05-19',
            'tag': 'btc',
            'tags': ['btc', 'us-treasury', 'compute-infra'],
            'format': 'deep-dive',
            'title': '2026 算力產業報告：比特幣礦業與 AI 基礎設施轉型深度分析',
            'link': 'post/20260413-compute-power-ai-mining-report.html'
        },
        {
            'id': '20260413-mara-holdings-investment-analysis',
            'category': 'crypto-web3',
            'series': 'bitcoin',
            'series_type': 'report',
            'published': '2026-04-13',
            'modified': '2026-04-13',
            'tag': 'btc',
            'tags': ['btc', 'compute-infra'],
            'format': 'deep-dive',
            'title': 'MARA Holdings 2026 深度投資分析與 Q4 財報解析：數據增強版',
            'link': 'news/20260413-mara-holdings-investment-analysis.html'
        },
        {
            'id': 'card-project-solana',
            'category': 'crypto-web3',
            'published': '2026-03-09',
            'modified': '2026-05-19',
            'tag': 'eth',
            'tags': ['eth'],
            'format': 'deep-dive',
            'title': 'Solana (SOL) 完整分析：歷史證明 (PoH) 技術、Meme 幣生態與 2026 投資潛力',
            'link': 'project/solana.html'
        },
        {
            'id': '20260410-btc-investment-opportunity-prediction',
            'category': 'crypto-web3',
            'series': 'bitcoin',
            'series_type': 'guide',
            'published': '2026-04-10',
            'modified': '2026-04-13',
            'tag': 'btc',
            'tags': ['btc', 'compute-infra', 'irgc'],
            'format': 'deep-dive',
            'title': '2026年4月比特幣 (BTC) 投資機會預測與上漲原因分析：地緣政治、機構範式與空頭擠壓預警',
            'link': 'news/20260410-btc-investment-opportunity-prediction.html'
        },
        {
            'id': '20260403-stagflation-crisis-analysis',
            'category': 'macro-geopolitics',
            'series': 'black-swan',
            'series_type': 'report',
            'published': '2026-04-03',
            'modified': '2026-04-03',
            'tag': 'gold',
            'tags': ['gold', 'us-treasury', 'liquidity-crisis', 'sec-inflation', 'irgc'],
            'format': 'deep-dive',
            'title': '2026年全球經濟「三殺」劇本：地緣戰爭導向的滯脹危機與資產價格全面重估深度研究報告',
            'link': 'news/20260403-stagflation-crisis-analysis.html'
        },
        {
            'id': '20260401-jpy-systemic-risk-analysis',
            'category': 'research-tools',
            'series': 'black-swan',
            'series_type': 'report',
            'published': '2026-04-01',
            'modified': '2026-04-01',
            'tag': 'us-treasury',
            'tags': ['us-treasury', 'liquidity-crisis', 'arbitrage'],
            'format': 'deep-dive',
            'title': '2026 日圓系流動性危機深度研究：套利交易、美債共生與全球金融系統性破口',
            'link': 'news/20260401-jpy-systemic-risk-analysis.html'
        },
        {
            'id': '20260330-jpy-exchange-rate-analysis',
            'category': 'research-tools',
            'series': 'black-swan',
            'series_type': 'report',
            'published': '2026-03-30',
            'modified': '2026-03-30',
            'tag': 'arbitrage',
            'tags': ['arbitrage', 'fed'],
            'format': 'deep-dive',
            'title': '2026 日圓匯率走勢深度解析：中東衝突、實質利差與套利交易的系統性危機',
            'link': 'news/20260330-jpy-exchange-rate-analysis.html'
        },
        {
            'id': '20260329-2026Q2-gold-investment-price-analysis-2026-2030',
            'category': 'macro-geopolitics',
            'series': 'black-swan',
            'series_type': 'guide',
            'published': '2026-03-29',
            'modified': '2026-03-29',
            'tag': 'gold',
            'tags': ['gold'],
            'format': 'deep-dive',
            'title': '2026-Q2 黃金價格投資分析：為什麼暴漲暴跌的原因與 2026-2030 因素展望',
            'link': 'news/20260329-2026Q2-gold-investment-price-analysis-2026-2030.html'
        },
        {
            'id': '20260328-tech-trends-2026-2031',
            'category': 'tech-ai',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2026-03-28',
            'modified': '2026-05-19',
            'tag': 'compute-infra',
            'tags': ['compute-infra'],
            'format': 'deep-dive',
            'title': '2026-2031 未來五年科技大趨勢：邏輯推理與演繹分析',
            'link': 'news/20260328-tech-trends-2026-2031.html'
        },
        {
            'id': 'news-20260327-invest-research-handbook',
            'category': 'research-tools',
            'series': 'investment-sop',
            'series_type': 'guide',
            'published': '2026-03-27',
            'modified': '2026-03-27',
            'tag': 'factor-investing',
            'tags': ['factor-investing', 'arbitrage'],
            'format': 'deep-dive',
            'title': '投資研究專業知識：機構級深度操作與實戰手冊 (2026)',
            'link': 'news/news-20260327-invest-research-handbook.html'
        },
        {
            'id': 'news-20260326-investment-research-guide',
            'category': 'research-tools',
            'series': 'investment-sop',
            'series_type': 'guide',
            'published': '2026-03-26',
            'modified': '2026-05-19',
            'tag': 'dcf-model',
            'tags': ['dcf-model'],
            'format': 'deep-dive',
            'title': '[投資研究] (2026)：高價值投資研究操作指南：從思維邊界到決策執行',
            'link': 'news/news-20260326-investment-research-guide.html'
        },
        {
            'id': 'news-20260325-us-private-credit-crisis',
            'category': 'research-tools',
            'series': 'black-swan',
            'series_type': 'report',
            'published': '2026-03-25',
            'modified': '2026-03-29',
            'tag': 'gold',
            'tags': ['gold', 'liquidity-crisis', 'dcf-model'],
            'format': 'deep-dive',
            'title': '美國私人信貸危機的演變路徑 (2026)：先行指標、內部紅線與跨資產連鎖反應深度研究報告',
            'link': 'news/news-20260325-us-private-credit-crisis.html'
        },
        {
            'id': 'news-20260325-private-credit-gold-crisis',
            'category': 'macro-geopolitics',
            'series': 'black-swan',
            'series_type': 'report',
            'published': '2026-03-25',
            'modified': '2026-03-31',
            'tag': 'gold',
            'tags': ['gold', 'fed'],
            'format': 'deep-dive',
            'title': '私人信貸危機對黃金價格的影響分析：清算性下跌與避險性暴漲',
            'link': 'news/news-20260325-private-credit-gold-crisis.html'
        },
        {
            'id': 'news-20260323-gold-crash-analysis',
            'category': 'traditional-markets',
            'series': 'black-swan',
            'series_type': 'report',
            'published': '2026-03-23',
            'modified': '2026-03-29',
            'tag': 'gold',
            'tags': ['gold', 'crude-oil', 'us-treasury', 'liquidity-crisis', 'sec-inflation', 'fed', 'irgc'],
            'format': 'deep-dive',
            'title': '2026年3月23日全球黃金下跌最新分析報告：為什麼下跌？上漲轉機在哪裡？ (更新川普的TACO影響)',
            'link': 'news/news-20260323-gold-crash-analysis.html'
        },
        {
            'id': 'report-macro-2026',
            'category': 'crypto-web3',
            'series': 'bitcoin',
            'series_type': 'guide',
            'published': '2026-01-24',
            'modified': '2026-05-19',
            'tag': 'btc',
            'tags': ['btc', 'gold', 'rwa'],
            'format': 'deep-dive',
            'title': '2026 年全球加密資產宏觀戰略報告',
            'link': 'post/topic-core.html'
        },
        {
            'id': 'topic-btc-01-valuation-models',
            'category': 'research-tools',
            'series': 'bitcoin',
            'series_type': 'guide',
            'published': '2026-03-14',
            'modified': '2026-05-19',
            'tag': 'btc',
            'tags': ['btc', 'gold', 'dcf-model'],
            'format': 'deep-dive',
            'title': '比特幣估值模型：從數位黃金到網路效應的多元維度分析',
            'link': 'post/topic-btc-01-valuation-models.html'
        },
        {
            'id': 'card-topic-stablecoin',
            'category': 'crypto-web3',
            'series': 'tokenized-future',
            'series_type': 'guide',
            'published': '2025-10-15',
            'modified': '2026-05-19',
            'tag': 'btc',
            'tags': ['btc'],
            'format': 'deep-dive',
            'title': '核心系列：穩定幣 (Stablecoin)',
            'link': 'post/topic-stablecoin.html'
        },
        {
            'id': 'topic-btc-02-price-factors',
            'category': 'research-tools',
            'series': 'bitcoin',
            'series_type': 'guide',
            'published': '2026-02-13',
            'modified': '2026-05-19',
            'tag': 'btc',
            'tags': ['btc', 'factor-investing'],
            'format': 'deep-dive',
            'title': '比特幣價格因素曼陀羅 (Mandala)：8 大核心維度與 64 個關鍵指標深度展開',
            'link': 'post/topic-btc-02-price-factors.html'
        },
        {
            'id': 'card-why-crypto',
            'category': 'macro-geopolitics',
            'series': 'investment-sop',
            'series_type': 'guide',
            'published': '2025-10-14',
            'modified': '2026-05-19',
            'tag': 'gold',
            'tags': ['gold'],
            'format': 'deep-dive',
            'title': 'Why Crypto？一份關於數位資產所有權的深度心理學分析',
            'link': 'post/why-crypto.html'
        },
        {
            'id': 'card-investment-guide',
            'category': 'crypto-web3',
            'series': 'investment-sop',
            'series_type': 'guide',
            'published': '2025-10-13',
            'modified': '2026-05-19',
            'tag': 'btc',
            'tags': ['btc', 'mstr'],
            'format': 'deep-dive',
            'title': '加密貨幣市場進入策略：ETF、概念股與交易所深度比較',
            'link': 'post/investment-guide.html'
        },
        {
            'id': 'card-2026-macro',
            'category': 'crypto-web3',
            'series': 'macro-2026',
            'series_type': 'report',
            'published': '2025-10-18',
            'modified': '2025-10-18',
            'tag': 'btc',
            'tags': ['btc', 'liquidity-crisis', 'ai-agent', 'fed'],
            'format': 'deep-dive',
            'title': '2026年宏觀展望：流動性週期與主權比特幣時代 | 投資戰略報告',
            'link': 'post/topic-macro.html'
        },
        {
            'id': 'card-project-eth',
            'category': 'crypto-web3',
            'published': '2025-10-12',
            'modified': '2026-05-19',
            'tag': 'eth',
            'tags': ['eth'],
            'format': 'deep-dive',
            'title': '以太坊 (Ethereum) 完整指南：智能合約、PoS 機制與 2026 生態投資分析',
            'link': 'project/eth.html'
        },
        {
            'id': 'card-project-btc',
            'category': 'crypto-web3',
            'series': 'bitcoin',
            'series_type': 'core',
            'published': '2025-10-12',
            'modified': '2026-05-19',
            'tag': 'btc',
            'tags': ['btc', 'gold', 'compute-infra'],
            'format': 'deep-dive',
            'title': '比特幣 (Bitcoin) 完整介紹：數位黃金、區塊鏈原理與 2026 投資風險分析',
            'link': 'project/btc.html'
        },
        {
            'id': 'card-topic-rwa',
            'category': 'crypto-web3',
            'series': 'tokenized-future',
            'series_type': 'guide',
            'published': '2025-10-20',
            'modified': '2026-05-19',
            'tag': 'rwa',
            'tags': ['rwa'],
            'format': 'deep-dive',
            'title': '現實世界資產 (RWA) 深度指南：資產代幣化、Ondo 與 BlackRock 佈局',
            'link': 'post/topic-rwa.html'
        },
        {
            'id': 'card-topic-meme',
            'category': 'traditional-markets',
            'series_type': 'guide',
            'published': '2025-10-21',
            'modified': '2026-05-19',
            'tag': 'us-stocks',
            'tags': ['us-stocks'],
            'format': 'wiki',
            'title': '迷因幣 (Meme Coin) 生存指南：從狗狗幣到注意力經濟的投機框架',
            'link': 'post/topic-meme.html'
        },
        {
            'id': 'card-chainlink',
            'category': 'crypto-web3',
            'series': 'tokenized-future',
            'series_type': 'core',
            'published': '2026-01-25',
            'modified': '2026-05-19',
            'tag': 'rwa',
            'tags': ['rwa'],
            'format': 'deep-dive',
            'title': 'Chainlink (LINK) 完整分析：Web3 預言機龍頭、CCIP 協議與 RWA 基礎設施',
            'link': 'project/chainlink.html'
        },
        {
            'id': 'card-layer2',
            'category': 'tech-ai',
            'published': '2024-08-15',
            'modified': '2026-05-19',
            'tag': 'ai-agent',
            'tags': ['ai-agent'],
            'format': 'deep-dive',
            'title': '區塊鏈關鍵技術 (TECH)：模組化、ZK 與預測市場深度解析',
            'link': 'post/topic-tech.html'
        },
        {
            'id': 'card-topic-knowledge',
            'category': 'traditional-markets',
            'published': '2026-01-25',
            'modified': '2026-05-19',
            'tag': 'us-stocks',
            'tags': ['us-stocks'],
            'format': 'wiki',
            'title': '加密貨幣知識百科 (Knowledge Hub)：原子化術語與鏈上指標資料庫',
            'link': 'post/topic-knowledge.html'
        },
        {
            'id': 'card-project-siren',
            'category': 'tech-ai',
            'series_type': 'core',
            'published': '2026-03-23',
            'modified': '2026-05-19',
            'tag': 'ai-agent',
            'tags': ['ai-agent'],
            'format': 'deep-dive',
            'title': 'Siren AI (SIREN) 完整介紹：AI Agent 結合迷因文化與動態交易的新範式',
            'link': 'project/siren.html'
        },
        {
            'id': 'card-project-ondo',
            'category': 'crypto-web3',
            'series': 'tokenized-future',
            'series_type': 'core',
            'published': '2026-01-25',
            'modified': '2026-05-19',
            'tag': 'us-treasury',
            'tags': ['us-treasury', 'rwa'],
            'format': 'deep-dive',
            'title': 'Ondo Finance (ONDO) 完整評測：RWA 美債代幣化龍頭、USDY 機制與 2026 投資風險分析',
            'link': 'project/ondo.html'
        },
        {
            'id': 'card-project-tao',
            'category': 'crypto-web3',
            'series': 'ai-economy',
            'series_type': 'core',
            'published': '2026-01-25',
            'modified': '2026-05-19',
            'tag': 'compute-infra',
            'tags': ['compute-infra', 'depin'],
            'format': 'deep-dive',
            'title': 'Bittensor (TAO) 深度分析：去中心化 AI 網路、子網機制與 2026 算力市場前景',
            'link': 'project/tao.html'
        },
        {
            'id': 'topic-btc-04-sovereign-liquidity',
            'category': 'crypto-web3',
            'series': 'bitcoin',
            'series_type': 'report',
            'published': '2026-03-05',
            'modified': '2026-03-09',
            'tag': 'btc',
            'tags': ['btc', 'liquidity-crisis', 'dcf-model'],
            'format': 'deep-dive',
            'title': '五大鏈上指標共振：為什麼現在可能是比特幣的週期低點？',
            'link': 'post/topic-btc-04-sovereign-liquidity.html'
        },
        {
            'id': 'topic-btc-03-macro-analysis',
            'category': 'crypto-web3',
            'series': 'bitcoin',
            'series_type': 'report',
            'published': '2026-03-09',
            'modified': '2026-05-19',
            'tag': 'btc',
            'tags': ['btc', 'us-treasury', 'liquidity-crisis', 'sec-inflation', 'factor-investing', 'fed'],
            'format': 'deep-dive',
            'title': '比特幣與宏觀經濟分析 (2026)：CPI、M2、美債與聯準會 7 大指標深度解析',
            'link': 'post/topic-btc-03-macro-analysis.html'
        },
        {
            'id': 'news-20260306-us-computing-infrastructure-ai-transformation',
            'category': 'crypto-web3',
            'series': 'ai-economy',
            'series_type': 'report',
            'published': '2026-03-06',
            'modified': '2026-05-19',
            'tag': 'btc',
            'tags': ['btc', 'compute-infra', 'dcf-model'],
            'format': 'deep-dive',
            'title': '2026 美國算力基礎設施產業投資報告：從比特幣挖礦到 AI 電廠的價值重估',
            'link': 'news/news-20260306-us-computing-infrastructure-ai-transformation.html'
        },
        {
            'id': 'news-20260320-us-computing-infrastructure',
            'category': 'crypto-web3',
            'series': 'ai-economy',
            'series_type': 'report',
            'published': '2026-03-20',
            'modified': '2026-03-29',
            'tag': 'btc',
            'tags': ['btc', 'compute-infra'],
            'format': 'deep-dive',
            'title': '2026 美國算力基礎設施產業投資報告 (2026)：電力稀缺性與 AI 轉型的價值重估',
            'link': 'news/news-20260320-us-computing-infrastructure.html'
        },
        {
            'id': 'news-20260323-palantir-iran-war-commodities',
            'category': 'traditional-markets',
            'published': '2026-03-23',
            'modified': '2026-05-19',
            'tag': 'irgc',
            'tags': ['irgc', 'palantir'],
            'format': 'deep-dive',
            'title': '2026年 Palantir (PLTR) 策略深度研究報告：金融成長、伊朗戰爭與全球大宗商品架構影響',
            'link': 'news/news-20260323-palantir-iran-war-commodities.html'
        },
        {
            'id': 'news-20260322-oil-gold-usd-btc-eth-global-macro-analysis',
            'category': 'crypto-web3',
            'series': 'black-swan',
            'series_type': 'report',
            'published': '2026-03-22',
            'modified': '2026-03-29',
            'tag': 'btc',
            'tags': ['btc', 'eth', 'gold', 'crude-oil', 'rwa', 'liquidity-crisis', 'sec-inflation'],
            'format': 'deep-dive',
            'title': '2026年3月22日石油、黃金、美元、比特幣、以太幣｜全球跨資產宏觀分析報告',
            'link': 'news/news-20260322-oil-gold-usd-btc-eth-global-macro-analysis.html'
        },
        {
            'id': 'news-20260321-ai-computing-assets',
            'category': 'crypto-web3',
            'series': 'ai-economy',
            'series_type': 'report',
            'published': '2026-03-21',
            'modified': '2026-03-29',
            'tag': 'btc',
            'tags': ['btc', 'compute-infra', 'depin'],
            'format': 'deep-dive',
            'title': '2026年 AI 算力資產與未來應用深度分析報告：NVIDIA Rubin、DePIN 算力拓撲與「算力黑洞」探討',
            'link': 'news/news-20260321-ai-computing-assets.html'
        },
        {
            'id': 'news-20260320-ai-agent-economy',
            'category': 'tech-ai',
            'series': 'ai-economy',
            'series_type': 'report',
            'published': '2026-03-20',
            'modified': '2026-03-20',
            'tag': 'ai-agent',
            'tags': ['ai-agent'],
            'format': 'deep-dive',
            'title': 'AI Agent 經濟與機器支付 (2026)：未來金融與區塊鏈投資分析報告',
            'link': 'news/news-20260320-ai-agent-economy.html'
        },
        {
            'id': 'news-20260319-gold-crash-analysis',
            'category': 'macro-geopolitics',
            'series': 'black-swan',
            'series_type': 'report',
            'published': '2026-03-19',
            'modified': '2026-03-29',
            'tag': 'gold',
            'tags': ['gold', 'fed', 'irgc'],
            'format': 'deep-dive',
            'title': '2026年3月黃金暴跌原因深度分析：貨幣政策硬著陸預期與地緣政治能源悖論',
            'link': 'news/news-20260319-gold-crash-analysis.html'
        },
        {
            'id': 'news-20260317-eth-surge-analysis',
            'category': 'crypto-web3',
            'published': '2026-03-17',
            'modified': '2026-03-29',
            'tag': 'eth',
            'tags': ['eth'],
            'format': 'deep-dive',
            'title': '2026年3月17日以太幣上漲動能深度分析報告：機構性匯流、協議演進與宏觀經濟博弈',
            'link': 'news/news-20260317-eth-surge-analysis.html'
        },
        {
            'id': 'news-20260313-bitwise-1m',
            'category': 'crypto-web3',
            'series': 'bitcoin',
            'series_type': 'guide',
            'published': '2026-03-13',
            'modified': '2026-03-29',
            'tag': 'btc',
            'tags': ['btc', 'gold', 'factor-investing'],
            'format': 'deep-dive',
            'title': '為什麼 Bitwise 的首席投資官 Matt Hougan 說比特幣注定衝擊百萬美元',
            'link': 'news/news-20260313-bitwise-1m.html'
        },
        {
            'id': 'news-20260311-btc-oil-macro-matrix',
            'category': 'crypto-web3',
            'series': 'bitcoin',
            'series_type': 'guide',
            'published': '2026-03-11',
            'modified': '2026-03-29',
            'tag': 'btc',
            'tags': ['btc', 'crude-oil', 'sec-inflation'],
            'format': 'deep-dive',
            'title': '比特幣與石油的真邏輯：全變量分析報告',
            'link': 'news/news-20260311-btc-oil-macro-matrix.html'
        },
        {
            'id': 'news-20260124-tom-lee-2026',
            'category': 'crypto-web3',
            'series': 'bitcoin',
            'series_type': 'report',
            'published': '2026-01-24',
            'modified': '2026-03-26',
            'tag': 'btc',
            'tags': ['btc'],
            'format': 'deep-dive',
            'title': 'Tom Lee 2026 預測 (2025) ：比特幣 25 萬美元與股市 20% 回調實測分析',
            'link': 'news/news-20260124-tom-lee-2026.html'
        }
    ];

    class ArticleRepository {
        constructor() {
            this._debug = false;
            this._detailsLoaded = false;
            this._detailsPromise = null;
        }

        get all() {
            return _articles;
        }

        async loadAllDetails() {
            if (this._detailsLoaded) return _articles;
            if (this._detailsPromise) return this._detailsPromise;

            let pathPrefix = './';
            if (typeof window !== 'undefined' && window.location) {
                const path = window.location.pathname;
                if (path.includes('/' + 'post/') || path.includes('/' + 'knowledge/') || path.includes('/' + 'project/') || path.includes('/' + 'doc/') || path.includes('/' + 'news/')) {
                    pathPrefix = '../';
                }
            }

            this._detailsPromise = fetch(`${pathPrefix}assets/data/core-articles-details.json`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch articles details');
                    return response.json();
                })
                .then(details => {
                    _articles.forEach(article => {
                        const detail = details[article.id];
                        if (detail) {
                            article.desc = detail.desc || '';
                            article.keywords = detail.keywords || '';
                            article.summary = detail.summary || '';
                            article.mentions = detail.mentions || [];
                        }
                    });
                    this._detailsLoaded = true;
                    return _articles;
                })
                .catch(err => {
                    console.error('ArticleRepository: error loading details:', err);
                    return _articles;
                });

            return this._detailsPromise;
        }

        setDebug(value) {
            this._debug = value;
            return this;
        }
    }

    /**
     * News Repository (Specific for Latest News section)
     * Filters for 'market-analysis' category
     */
    class NewsRepository {
        constructor() {
            this._debug = false;
        }

        get all() {
            // Return articles in 'market-analysis' category
            return _articles.filter(article => article.category === 'market-analysis');
        }

        setDebug(value) {
            this._debug = value;
            return this;
        }
    }

    global.ArticleRepository = new ArticleRepository();
    global.NewsRepository = new NewsRepository();

    // Explicitly attach to window for more reliable access in browser
    if (typeof window !== 'undefined') {
        window.ArticleRepository = global.ArticleRepository;
        window.NewsRepository = global.NewsRepository;
    }

})(typeof window !== 'undefined' ? window : global);
