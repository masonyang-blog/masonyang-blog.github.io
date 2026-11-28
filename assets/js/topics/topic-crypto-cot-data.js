/**
 * assets/js/topics/topic-crypto-cot-data.js
 * 專題知識階層樹與思考鏈核心資料庫 (Data SSOT)
 * 由 tools/sync_topic_cot.py 自動同步編譯，嚴禁破壞 JSON 結構。
 */
(function (root) {
    const TOPIC_CRYPTO_COT_DATA = {
        "topic": "topic-crypto-web3",
        "title": "比特幣、加密資產與 Web3 全景",
        "generated_at": "2026-11-28",
        "pillars": [
            {
                "id": "all",
                "label": "全部研報",
                "short": "ALL"
            },
            {
                "id": "btc",
                "label": "I. 比特幣與流動性",
                "short": "BTC MACRO"
            },
            {
                "id": "rwa",
                "label": "II. RWA 與監管",
                "short": "RWA & RULES"
            },
            {
                "id": "l1-infra",
                "label": "III. L1 與基建",
                "short": "L1 INFRA"
            },
            {
                "id": "defai",
                "label": "IV. DeFAI 與籌碼",
                "short": "DEFAI & CHIPS"
            }
        ],
        "macro_ledger": [
            {
                "id": "metric-tips-10y",
                "name": "10Y TIPS 實質殖利率",
                "current": "2.73%–2.79%",
                "baseline": "由 11/16–17 高點 2.91% 回落",
                "status": "triggered",
                "note": "實質利率高檔震盪疊加企業發債抽資，壓抑跨資產流動性",
                "updated_at": "2026-11-28",
                "source_url": "../news/20261119-gold-btc-november-selloff-attribution.html"
            },
            {
                "id": "metric-us-debt-rwa",
                "name": "美債總規模 / RWA 承接",
                "current": "$40 兆",
                "baseline": "年化淨利息 > $1.1T",
                "status": "warning",
                "note": "短債滾動壓力加速合規穩定幣與美債代幣化體外循環（USDC 市值達 $754 億）",
                "updated_at": "2026-11-28",
                "source_url": "../news/20261011-global-macro-cross-asset-liquidation.html"
            },
            {
                "id": "metric-clarity-act",
                "name": "美國合規監管框架",
                "current": "CLARITY Act 參院受阻 (49:50)",
                "baseline": "轉向聯邦行政監理替代路徑",
                "status": "warning",
                "note": "2026/9/15 參院否決關鍵條款致法案停滯，監管轉由 SEC 代幣化試行等行政路徑推進",
                "updated_at": "2026-11-28",
                "source_url": "../news/20260905-clarity-act-rwa-investment-research.html"
            },
            {
                "id": "metric-fdv-tvl",
                "name": "新興協議估值警訊",
                "current": "FDV/TVL > 15x",
                "baseline": "籌碼集中與解鎖懸崖",
                "status": "triggered",
                "note": "低流通高 FDV 易形成流動性蜃樓，需緊盯真實營收",
                "updated_at": "2026-08-17",
                "source_url": "../news/20260817-crypto-ai-vc-investment-strategy.html"
            }
        ],
        "concepts": [
            {
                "id": "clarity-act",
                "code": "REGULATION",
                "title": "CLARITY Act 監管框架",
                "desc": "美國國會劃清 SEC（證券）與 CFTC（數位商品）管轄邊界的核心法案，設立非託管開發者安全港，使 DeFi 協議得以合法開啟費用開關（Fee Switch）並導引機構合規資金入場。",
                "threshold": "關鍵催化：數位商品三類劃分、穩定幣儲備規範與 DeFi 開發者豁免",
                "url": ""
            },
            {
                "id": "mvrv-power-law",
                "code": "ON-CHAIN",
                "title": "MVRV Z-Score 與冪律走廊",
                "desc": "MVRV Z-Score 透過標準差衡量比特幣總市值與鏈上平均持倉成本（已實現市值）的偏離極值；結合 Power Law 冪律走廊可過濾短期雜訊，精準定錨長線週期底部區間。",
                "threshold": "歷史閾值：MVRV Z-Score < 0.1 進入機構級長期累積帶",
                "url": ""
            },
            {
                "id": "btc-yield-flywheel",
                "code": "TREASURY",
                "title": "BTC Yield 融資飛輪",
                "desc": "以 Strategy (MSTR) 為代表的數位資產國庫模型：在股價享有高於淨資產價值（NAV）溢價時，透過發行可轉債與優先股融資買入比特幣，持續推升每股比特幣含量（BTC Yield）形成反身性循環。",
                "threshold": "風險邊界：NAV 溢價收斂至 1.0x 以下或債市流動性凍結時飛輪反轉",
                "url": ""
            },
            {
                "id": "rwa-treasury",
                "code": "RWA",
                "title": "RWA 美債代幣化",
                "desc": "將美國國庫券等現實世界生息資產封裝為合規鏈上代幣（如 Ondo USDY/OUSG、BlackRock BUIDL），打通傳統債市與 DeFi 抵押品市場，成為承接美元短債的鏈上體外循環。",
                "threshold": "評估框架：T.R.U.S.T. 五維審計（託管隔離、贖回流動性與合規結構）",
                "url": ""
            },
            {
                "id": "delta-neutral",
                "code": "QUANT",
                "title": "Delta 中性資金費率套利",
                "desc": "利用現貨多頭搭配永續合約空頭鎖定市場方向性風險（Delta = 0），透過 Ornstein-Uhlenbeck 均值回歸模型與正向資金費率捕獲與大盤脫鉤的市場中立絕對報酬。",
                "threshold": "核心風控：防範極端負費率反轉與交易所保證金穿倉風險",
                "url": ""
            },
            {
                "id": "liquidity-mirage",
                "code": "CHIPS & RISK",
                "title": "流動性蜃樓 (Liquidity Mirage)",
                "desc": "低流通比例（Low Float）代幣在極薄的訂單簿與高籌碼集中度下，僅需少量資金即可拉抬出數十億美元帳面 FDV；一旦解鎖或主力撤離，散戶將面臨無買盤承接的踩踏式蒸發。",
                "threshold": "紅旗警訊：FDV/TVL > 15x 且前 100 地址持倉 > 90%",
                "url": ""
            }
        ],
        "articles": [
            {
                "id": "20261128-btc-value-capture-ic-memo",
                "pillar": "rwa",
                "badge": "深度研報",
                "date": "2026-11-28",
                "title": "【比特幣價值捕獲與配置評估】- AI 與穩定幣繁榮為何無法推升 BTC？數位黃金避險為何失效？解構 0.67% 手續費與 88.2% 期貨定價權",
                "url": "../news/20261128-btc-value-capture-ic-memo.html",
                "core_conclusion": "截至 2026 年 11 月底，IBIT 年初至今重挫 -31.38%、最大回撤 -53.68%，全面落後 QQQ（+3.55%）與實體黃金。因穩定幣零傳導、0.67% 手續費枯竭、AI 35 倍創投虹吸與 88.2% 期貨定價權壓制，投委會維持不予增配紀律。",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "0.67%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "88.2%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "31.38%"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": []
                    },
                    {
                        "id": "1-為何不建議將比特幣納入核心成長配置-實證報酬落差與投資委員會決議",
                        "title": "為何不建議將比特幣納入核心成長配置實證報酬落差與投資委員會決議",
                        "h3_details": []
                    },
                    {
                        "id": "2-為何比特幣無法捕獲加密產業紅利-穩定幣絕緣與-0-67-手續費枯竭機制",
                        "title": "為何比特幣無法捕獲加密產業紅利穩定幣絕緣與 0.67% 手續費枯竭機制",
                        "h3_details": [
                            {
                                "id": "2-1-穩定幣大餅與比特幣完全絕緣-價值捕獲為零",
                                "title": "2.1 穩定幣大餅與比特幣完全絕緣（價值捕獲為零）"
                            },
                            {
                                "id": "2-2-內生現金流缺乏與鏈上手續費枯竭",
                                "title": "2.2 內生現金流缺乏與鏈上手續費枯竭"
                            }
                        ]
                    },
                    {
                        "id": "3-ai-與穩定幣如何反向排擠比特幣-四大物理斷路器與能源-應用-資本失血鏈",
                        "title": "AI 與穩定幣如何反向排擠比特幣四大物理斷路器與能源、應用、資本失血鏈",
                        "h3_details": [
                            {
                                "id": "3-1-資金真實流向與四大結構性斷路器",
                                "title": "3.1 資金真實流向與四大結構性斷路器"
                            },
                            {
                                "id": "3-2-更殘酷的現實-能源-應用與資本的三大反向排擠",
                                "title": "3.2 更殘酷的現實：能源、應用與資本的三大反向排擠"
                            }
                        ]
                    },
                    {
                        "id": "4-華爾街如何主導比特幣邊際定價權-單一宏觀順風與-88-2-期貨槓桿清算結構",
                        "title": "華爾街如何主導比特幣邊際定價權單一宏觀順風與 88.2% 期貨槓桿清算結構",
                        "h3_details": [
                            {
                                "id": "4-1-單一宏觀順風-vs-多重結構壓制",
                                "title": "4.1 單一宏觀順風 vs. 多重結構壓制"
                            },
                            {
                                "id": "4-2-華爾街如何掌控交易量與邊際定價權",
                                "title": "4.2 華爾街如何掌控交易量與邊際定價權"
                            }
                        ]
                    },
                    {
                        "id": "5-為何數位黃金假說在危機中失效-跨資產機會成本對照與投委會防禦框架",
                        "title": "為何數位黃金假說在危機中失效跨資產機會成本對照與投委會防禦框架",
                        "h3_details": [
                            {
                                "id": "5-1-避險時脫鉤-下跌時與美股同步",
                                "title": "5.1 避險時脫鉤、下跌時與美股同步"
                            },
                            {
                                "id": "5-2-跨資產實證表現與投委會配置映射",
                                "title": "5.2 跨資產實證表現與投委會配置映射"
                            },
                            {
                                "id": "5-3-預判多頭反駁與投委會防禦話術",
                                "title": "5.3 預判多頭反駁與投委會防禦話術"
                            }
                        ]
                    },
                    {
                        "id": "6-如何驗證市場共識與實證數據落差-原始假設校準紀錄",
                        "title": "如何驗證市場共識與實證數據落差原始假設校準紀錄與實證核驗基準",
                        "h3_details": [
                            {
                                "id": "6-1-原始假設-vs-2026-年-11-月實證數據查核紀錄",
                                "title": "6.1 原始假設 vs. 2026 年 11 月實證數據查核紀錄"
                            }
                        ]
                    },
                    {
                        "id": "article-analysis-header",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "article-inference-logic",
                                "title": "01 文章推論邏輯分析"
                            },
                            {
                                "id": "logic-blindspots",
                                "title": "02 敘事邊界與關鍵變數補充"
                            },
                            {
                                "id": "mason-yang-observation",
                                "title": "03 Mason Yang 的觀察 (Actionable Intelligence)"
                            }
                        ]
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "20260912-bitcoin-endgame-hypotheses",
                "pillar": "btc",
                "badge": "深度研報",
                "date": "2026-09-12",
                "title": "【比特幣終局】- 矽基 AI 與生息穩定幣如何重塑貨幣本位？為何吸收態障礙與合規審查引爆雙軌撕裂？解構 2100 萬枚稀缺性、PoW 熱力學威懾與全網算力博弈",
                "url": "../news/20260912-bitcoin-endgame-hypotheses.html",
                "core_conclusion": "在全球總體經濟學、貨幣哲學與密碼學的既有論述中，關於比特幣終局（Endgame）的探討多聚焦於主流的五大基準假說：法幣崩潰推動的「惡性比特幣化」、明尼阿波利斯聯準會與歐洲央行所主張的「主權防禦性扼殺與平衡預算自衛」、佐爾坦·波扎爾構想的「布雷頓森林體系 III 外部中立儲備錨」、華爾街衍生品與託管壟斷造成的「金融去勢與紙比特幣化」，以及由區塊獎勵遞減引發的…",
                "indicators": [
                    {
                        "label": "關鍵規模",
                        "value": "2100 萬"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": []
                    },
                    {
                        "id": "緒論與研究邊界",
                        "title": "緒論與研究邊界",
                        "h3_details": []
                    },
                    {
                        "id": "矽基經濟結算層-人工智慧自主代理與機器原生貨幣假說",
                        "title": "矽基經濟結算層人工智慧自主代理與機器原生貨幣假說",
                        "h3_details": []
                    },
                    {
                        "id": "國防實體算力威懾-熱力學貨幣錨與網路空間權力投射假說",
                        "title": "國防實體算力威懾熱力學貨幣錨與網路空間權力投射假說",
                        "h3_details": []
                    },
                    {
                        "id": "吸收態障礙與零收益歸零-無內生現金流的-數位古董-假說",
                        "title": "吸收態障礙與零收益歸零無內生現金流的「數位古董」假說",
                        "h3_details": []
                    },
                    {
                        "id": "鏈上合規審查與可替代性破裂-雙軌化分裂假說",
                        "title": "鏈上合規審查與可替代性破裂雙軌化分裂假說",
                        "h3_details": []
                    },
                    {
                        "id": "協議僵局與治理巴爾幹化-硬分叉分裂與網絡效應稀釋假說",
                        "title": "協議僵局與治理巴爾幹化硬分叉分裂與網絡效應稀釋假說",
                        "h3_details": []
                    },
                    {
                        "id": "宏觀資本機會成本與生息穩定幣擠出假說",
                        "title": "宏觀資本機會成本與生息穩定幣擠出假說",
                        "h3_details": []
                    },
                    {
                        "id": "比特幣延伸終局假說綜合比較矩陣",
                        "title": "比特幣延伸終局假說綜合比較矩陣",
                        "h3_details": []
                    },
                    {
                        "id": "跨學科張力下的動態博弈與終局交織",
                        "title": "跨學科張力下的動態博弈與終局交織",
                        "h3_details": []
                    },
                    {
                        "id": "article-analysis-header",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "article-inference-logic",
                                "title": "01 文章推論邏輯分析"
                            },
                            {
                                "id": "logic-blindspots",
                                "title": "02 敘事邊界與關鍵變數補充"
                            },
                            {
                                "id": "mason-yang-observation",
                                "title": "03 Mason Yang 的觀察 (Actionable Intelligence)"
                            }
                        ]
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "dash-blockchain-research",
                "pillar": "rwa",
                "badge": "深度研報",
                "date": "2026-09-05",
                "title": "【達世幣 Dash 支付公鏈】- 雙層主節點如何免疫 51% 攻擊？為何面臨 SEC 匿名合規下架潮？解構 15 萬門市落地與穩定幣夾擊下的中庸困境",
                "url": "../news/20260905-dash-blockchain-research.html",
                "core_conclusion": "達世幣透過雙層主節點與 ChainLocks 實現秒級確定性結算並免疫 51% 算力攻擊；然而其支付賽道遭美元穩定幣與 Layer 2 擠壓，合規端深陷 AEC 匿名標籤下架潮，形成隱私與合規兩頭落空的中庸困境。",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "51%"
                    },
                    {
                        "label": "關鍵規模",
                        "value": "15 萬"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": []
                    },
                    {
                        "id": "項目起源與歷史演進-從匿名貨幣到數位現金的戰略重塑",
                        "title": "項目起源與歷史演進從匿名貨幣到數位現金的戰略重塑",
                        "h3_details": []
                    },
                    {
                        "id": "底層架構與技術機制-混合式雙層共識與確定性安全模型",
                        "title": "底層架構與技術機制混合式雙層共識與確定性安全模型",
                        "h3_details": [
                            {
                                "id": "第一層-x11-工作量證明與-dark-gravity-wave",
                                "title": "第一層：X11 工作量證明與 Dark Gravity Wave"
                            },
                            {
                                "id": "第二層-主節點服務證明與確定性名單",
                                "title": "第二層：主節點服務證明與確定性名單"
                            },
                            {
                                "id": "長效主節點仲裁委員會-llmq-與-chainlocks-安全防禦",
                                "title": "長效主節點仲裁委員會（LLMQ）與 ChainLocks 安全防禦"
                            }
                        ]
                    },
                    {
                        "id": "核心功能與-dash-platform-evolution-技術堆疊",
                        "title": "核心功能與 Dash Platform（Evolution）技術堆疊",
                        "h3_details": [
                            {
                                "id": "instantsend-秒級確認與即時防雙花機制",
                                "title": "InstantSend：秒級確認與即時防雙花機制"
                            },
                            {
                                "id": "privatesend-基於混幣協議的選擇性隱私",
                                "title": "PrivateSend：基於混幣協議的選擇性隱私"
                            },
                            {
                                "id": "dash-platform-evolution-去中心化應用與狀態儲存層",
                                "title": "Dash Platform（Evolution）：去中心化應用與狀態儲存層"
                            }
                        ]
                    },
                    {
                        "id": "代幣經濟學與去中心化治理-dao-體系",
                        "title": "代幣經濟學與去中心化治理（DAO）體系",
                        "h3_details": [
                            {
                                "id": "發行機制與平滑通縮曲線",
                                "title": "發行機制與平滑通縮曲線"
                            },
                            {
                                "id": "區塊獎勵分配權重的歷史性重構",
                                "title": "區塊獎勵分配權重的歷史性重構"
                            },
                            {
                                "id": "鏈上治理-dao-與去中心化實體法律工程",
                                "title": "鏈上治理（DAO）與去中心化實體法律工程"
                            }
                        ]
                    },
                    {
                        "id": "市場表現與鏈上生態數據指標",
                        "title": "市場表現與鏈上生態數據指標",
                        "h3_details": [
                            {
                                "id": "估值歷史週期與流動性結構",
                                "title": "估值歷史週期與流動性結構"
                            },
                            {
                                "id": "主節點持幣分佈與流動性抽離效應",
                                "title": "主節點持幣分佈與流動性抽離效應"
                            }
                        ]
                    },
                    {
                        "id": "實體支付落地與商業化拓展分析",
                        "title": "實體支付落地與商業化拓展分析",
                        "h3_details": [
                            {
                                "id": "拉丁美洲試驗場-法幣惡性通膨下的替代通道",
                                "title": "拉丁美洲試驗場：法幣惡性通膨下的替代通道"
                            },
                            {
                                "id": "零售網絡聚合-craypay-與-dashdirect-體系",
                                "title": "零售網絡聚合：CrayPay 與 DashDirect 體系"
                            }
                        ]
                    },
                    {
                        "id": "關鍵風險-監管合規壓力與競品博弈",
                        "title": "關鍵風險、監管合規壓力與競品博弈",
                        "h3_details": [
                            {
                                "id": "匿名標籤與全球交易所合規下架潮",
                                "title": "匿名標籤與全球交易所合規下架潮"
                            },
                            {
                                "id": "穩定幣與-layer-2-擴容方案的替代性衝擊",
                                "title": "穩定幣與 Layer 2 擴容方案的替代性衝擊"
                            },
                            {
                                "id": "產品定位的中庸困境-the-awkward-middle-ground",
                                "title": "產品定位的中庸困境（The \"Awkward Middle Ground\"）"
                            }
                        ]
                    },
                    {
                        "id": "綜合評估與未來展望",
                        "title": "綜合評估與未來展望",
                        "h3_details": []
                    },
                    {
                        "id": "長期投資價值解構-脈衝式暴漲背後的不可逆結構性阻礙",
                        "title": "長期投資價值解構 脈衝式暴漲背後的不可逆結構性阻礙",
                        "h3_details": [
                            {
                                "id": "核心商業模式已被穩定幣降維打擊",
                                "title": "一、核心商業模式已被「穩定幣」降維打擊（支付敘事瓦解）"
                            },
                            {
                                "id": "陷入進退維谷的中庸定位",
                                "title": "二、陷入「進退維谷」的中庸定位（兩頭不討好）"
                            },
                            {
                                "id": "週期高點逐級下移長線跑輸比特幣",
                                "title": "三、週期高點逐級下移（長線跑輸比特幣與大盤）"
                            },
                            {
                                "id": "暴漲背後的真實機制籌碼虛胖而非基本面反轉",
                                "title": "四、暴漲背後的真實機制：短線「籌碼虛胖」而非基本面反轉"
                            },
                            {
                                "id": "web3-生態發展遲緩缺乏網絡效應",
                                "title": "五、Web3 生態發展過於遲緩，缺乏開發者網絡效應"
                            }
                        ]
                    },
                    {
                        "id": "article-analysis-header",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "article-inference-logic",
                                "title": "01 文章推論邏輯分析"
                            },
                            {
                                "id": "logic-blindspots",
                                "title": "02 敘事邊界與關鍵變數補充"
                            },
                            {
                                "id": "mason-yang-observation",
                                "title": "03 Mason Yang 的觀察 (Actionable Intelligence)"
                            }
                        ]
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "20260905-clarity-act-rwa-investment-research",
                "pillar": "rwa",
                "badge": "深度研報",
                "date": "2026-09-05",
                "title": "【美債 RWA 與 CLARITY Act】- 40 兆主權債如何驅動鏈上體外循環？非託管安全港怎樣重塑 UNI 與 ONDO 估值？剖析 5 層資本矩陣與對沖策略",
                "url": "../news/20260905-clarity-act-rwa-investment-research.html",
                "core_conclusion": "美國聯邦國債逼近 40 兆美元與年利息突破 1.1 兆美元形成剛性財政死結，催生鏈上穩定幣與代幣化國債作為「體外循環」吸收中樞。《CLARITY Act》（H.R. 3633）透過客觀成熟度測試與第 604 條非託管安全港終結 SEC 執法式監管，清除 UNI 與 CRV 啟動費用開關（Fee Switch）的證券風險，並為 ONDO、PENDLE 與 R…",
                "indicators": [
                    {
                        "label": "關鍵規模",
                        "value": "40 兆"
                    },
                    {
                        "label": "關鍵規模",
                        "value": "1.1 兆"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "section-executive-summary",
                        "title": "執行摘要（Executive Summary）",
                        "h3_details": []
                    },
                    {
                        "id": "section-macro-crisis",
                        "title": "第一章總體結構危機：美債過高困局與「體外循環」需求",
                        "h3_details": [
                            {
                                "id": "sub-1-1-財政惡性螺旋與債務動態學模型",
                                "title": "1.1 財政惡性螺旋與債務動態學模型"
                            },
                            {
                                "id": "sub-1-2-傳統吸收池的邊際疲態與外匯儲備多元化",
                                "title": "1.2 傳統吸收池的邊際疲態與外匯儲備多元化"
                            },
                            {
                                "id": "sub-1-3-鏈上資本作為美債-體外循環-的吸收中樞",
                                "title": "1.3 鏈上資本作為美債「體外循環」的吸收中樞"
                            }
                        ]
                    },
                    {
                        "id": "section-clarity-act",
                        "title": "第二章政策催化劑：《CLARITY Act》（H.R. 3633）的立法重構",
                        "h3_details": [
                            {
                                "id": "sub-2-1-核心條款深度剖析",
                                "title": "2.1 核心條款深度剖析"
                            }
                        ]
                    },
                    {
                        "id": "section-defi-rwa",
                        "title": "第三章賽道深度解構：DeFi 與 RWA 核心標的分析",
                        "h3_details": [
                            {
                                "id": "sub-3-1-去中心化金融-DeFi-藍籌-Uniswap-UNI-與-Curve-Finance-CRV",
                                "title": "3.1 去中心化金融（DeFi）藍籌：Uniswap (UNI) 與 Curve Finance (CRV)"
                            },
                            {
                                "id": "sub-3-2-合規-RWA-發行中樞-Ondo-Finance-ONDO",
                                "title": "3.2 合規 RWA 發行中樞：Ondo Finance (ONDO)"
                            },
                            {
                                "id": "sub-3-3-利率衍生品樞紐-Pendle-Finance-PENDLE",
                                "title": "3.3 利率衍生品樞紐：Pendle Finance (PENDLE)"
                            }
                        ]
                    },
                    {
                        "id": "section-investment-matrix",
                        "title": "第四章美債 RWA 解決方案下的全景投資矩陣",
                        "h3_details": []
                    },
                    {
                        "id": "section-event-driven-playbook",
                        "title": "第五章《CLARITY Act》事件驅動交易策略構建（Institutional Playbook）",
                        "h3_details": [
                            {
                                "id": "sub-5-1-交易架構與多空配對設置",
                                "title": "5.1 交易架構與多空配對設置"
                            },
                            {
                                "id": "sub-5-2-階段化執行時間表與動態倉位調整",
                                "title": "5.2 階段化執行時間表與動態倉位調整"
                            }
                        ]
                    },
                    {
                        "id": "section-conclusion",
                        "title": "第六章結論與戰略建議",
                        "h3_details": []
                    },
                    {
                        "id": "article-analysis-header",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "article-inference-logic",
                                "title": "01 文章推論邏輯分析"
                            },
                            {
                                "id": "logic-blindspots",
                                "title": "02 敘事邊界與關鍵變數補充"
                            },
                            {
                                "id": "mason-yang-的觀察-美債體外循環本質-反身性激勵與多空終局",
                                "title": "Mason Yang 的觀察：美債體外循環本質、反身性激勵與多空終局"
                            }
                        ]
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "faq-hub",
                "pillar": "btc",
                "badge": "方法指南",
                "date": "2026-08-19",
                "title": "全站 FAQ Hub：比特幣投資、宏觀分析與鏈上指標常見問題",
                "url": "../post/crypto-faq-hub.html",
                "core_conclusion": "【Web3 & 加密貨幣 FAQ Hub】彙整投資人進入加密市場最常遇到的 10 大核心痛點：包含比特幣 S2F 與估值模型應用、現貨 ETF 與交易所稅務差異、鏈上 MVRV/NVT 指標解讀、RWA 美債違約風險防範以及冷錢包私鑰自託管安全指南，提供機構級的一站式解答。",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": []
            },
            {
                "id": "20260817-crypto-ai-vc-investment-strategy",
                "pillar": "defai",
                "badge": "深度研報",
                "date": "2026-08-17",
                "title": "【創投 Crypto 與 AI 投資策略】- 去中心化算力如何顛覆雲端巨頭？為何 40% 資金湧向 DePIN？解構 io.net 成本驟降 70% 與 x402 代理人支付協議",
                "url": "../news/20260817-crypto-ai-vc-investment-strategy.html",
                "core_conclusion": "2026年全球科技巨頭超過3000億美元AI資本支出引發嚴重中心化壟斷，驅動40%加密創投資金湧向Web3+AI融合領域。本報告解構a16z、Multicoin、Founders Fund等頂級VC在DePIN算力套利、Jolt zkVM密碼學驗證與x402代理人微支付等四大賽道的投資邏輯與混合代幣模型。",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "40%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "70%"
                    },
                    {
                        "label": "關鍵規模",
                        "value": "3000億"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": [
                            {
                                "id": "5w1h-核心認知框架",
                                "title": "5W1H 核心認知框架"
                            }
                        ]
                    },
                    {
                        "id": "產業宏觀背景與資本重構-去中心化架構對抗集中式壟斷",
                        "title": "產業宏觀背景與資本重構去中心化架構如何破解科技巨頭算力與營收壟斷？",
                        "h3_details": []
                    },
                    {
                        "id": "早期私募市場估值-融資結構與投資組合建構",
                        "title": "早期私募市場估值動態 AI 溢價 42% 下的融資結構與代幣混合模型解析",
                        "h3_details": [
                            {
                                "id": "2026年ai與web3新創的估值溢價與稀釋動態",
                                "title": "2026年 AI 與 Web3 新創估值：種子輪 24.3M 美元中位數背後的股權稀釋與成長壓力"
                            },
                            {
                                "id": "股權與代幣的混合融資模型-hybrid-deal-structures",
                                "title": "混合融資架構解析：代幣認股權 (Token Warrants) 與開曼基金會如何平衡長期價值？"
                            }
                        ]
                    },
                    {
                        "id": "知名區塊鏈創投的投資哲學-策略風格與核心標的",
                        "title": "五大頂級區塊鏈創投佈局 a16z、Multicoin、Polychain、Founders Fund 與 Framework 的核心論述",
                        "h3_details": [
                            {
                                "id": "1-a16z-crypto-去中心化驗證-密碼學基礎設施與代理人經濟",
                                "title": "1. a16z crypto 投資哲學：從 Jolt zkVM 密碼學突破到 Gensyn 分散式可驗證訓練"
                            },
                            {
                                "id": "2-multicoin-capital-depin-基礎設施與算力套利經濟學",
                                "title": "2. Multicoin Capital 算力套利策略：io.net 如何顛覆 AWS 雲端定價與消除資料鎖定"
                            },
                            {
                                "id": "3-polychain-capital-與-archetype-主權資料與-ai-執行層的基礎建設",
                                "title": "3. Polychain 與 Archetype 基礎設施佈局：Grass 頻寬資料採集與 Ritual 主權執行層"
                            },
                            {
                                "id": "4-founders-fund-與-pantera-capital-極端集中與開源-agi-的防禦性投資",
                                "title": "4. Founders Fund 冪次法則實踐：Sentient 8500 萬美元種子輪如何解決開源 AI 搭便車難題"
                            },
                            {
                                "id": "5-framework-ventures-從-defi-到自主代理人經濟的延伸",
                                "title": "5. Framework Ventures 代理人經濟學：機器對機器 (M2M) 鏈上金融與智能合約演化"
                            }
                        ]
                    },
                    {
                        "id": "核心技術賽道與生態系演進深度分析",
                        "title": "四大核心技術賽道深度解構 DePIN、AI 代理人、可驗證計算與非同步訓練演進",
                        "h3_details": [
                            {
                                "id": "賽道一-去中心化物理基礎設施網路-depin-與硬體資源配置",
                                "title": "賽道一：DePIN 算力賽道全景：Render、Aethir 與 Akash 的架構優勢與定價機制比較"
                            },
                            {
                                "id": "賽道二-人工智慧代理人-ai-agents-與-m2m-金融支付軌道",
                                "title": "賽道二：AI 代理人原生支付軌道：x402 協議、Coinbase AgentKit 與自主經濟系統"
                            },
                            {
                                "id": "賽道三-可驗證計算與非同步分散式訓練的突破",
                                "title": "賽道三：可驗證計算突破：Jolt zkVM 邊緣推論與 OpenDiLoCo 跨洲非同步強化學習"
                            }
                        ]
                    },
                    {
                        "id": "系統性風險與未來展望",
                        "title": "三大系統性風險檢驗鏈下依賴脆弱性、代理人安全威脅與 DePIN 代幣死亡螺旋",
                        "h3_details": [
                            {
                                "id": "總結",
                                "title": "2026 創投展望總結：代幣與股權混合設計下的基礎設施價值捕獲法則"
                            }
                        ]
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    },
                    {
                        "id": "article-analysis-header",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "article-inference-logic",
                                "title": "01 文章推論邏輯分析 (Institutional Framework)"
                            },
                            {
                                "id": "logic-blindspots",
                                "title": "02 敘事邊界與關鍵變數補充 (Blindspots & Variables)"
                            },
                            {
                                "id": "mason-yang-observation",
                                "title": "Mason Yang 的觀察 (Actionable Intelligence)"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "20260530-btc-hedge-strategy",
                "pillar": "btc",
                "badge": "深度研報",
                "date": "2026-05-30",
                "title": "【比特幣多空對沖與量化套利】 - 如何建構 Delta 中性組合？解構共整合配對與資金費率套利",
                "url": "../news/20260530-btc-hedge-strategy.html",
                "core_conclusion": "本文分析指出「比特幣對沖與多空策略探討：量化模型與對沖組合配置」的核心邏輯在於市場供需失衡與產業結構演化。受制於資本開支門檻與總體流動性變化，領先企業透過技術護城河與長約機制鎖定資產溢價，驅動整體產業進行重估值。",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": [
                            {
                                "id": "section-5w1h-core",
                                "title": "5W1H 深度邏輯總結"
                            }
                        ]
                    },
                    {
                        "id": "數量化交易與對沖策略之核心理論與數學框架",
                        "title": "數量化交易與對沖策略之核心理論與數學框架",
                        "h3_details": [
                            {
                                "id": "相關性與共整合性之本質差異與檢定",
                                "title": "相關性與共整合性之本質差異與檢定"
                            },
                            {
                                "id": "ornstein-uhlenbeck-隨機過程與半衰期之動態校準",
                                "title": "Ornstein-Uhlenbeck 隨機過程與半衰期之動態校準"
                            },
                            {
                                "id": "卡爾曼濾波器在動態避險比例與三元配對中之應用",
                                "title": "卡爾曼濾波器在動態避險比例與三元配對中之應用"
                            }
                        ]
                    },
                    {
                        "id": "適合與比特幣建構多空配對交易之核心標的深度解析",
                        "title": "適合與比特幣建構多空配對交易之核心標的深度解析",
                        "h3_details": [
                            {
                                "id": "以太幣-eth-與主流-layer-資產-高共整合性之-beta-中性策略",
                                "title": "以太幣 (ETH) 與主流 Layer 資產：高共整合性之 Beta 中性策略"
                            },
                            {
                                "id": "microstrategy-mstr-具備極端溢價特徵之槓桿比特幣代理",
                                "title": "MicroStrategy (MSTR)：具備極端溢價特徵之槓桿比特幣代理"
                            },
                            {
                                "id": "比特幣礦企股票-riot-mara-尾部風險傳遞與結構性脫鉤效應",
                                "title": "比特幣礦企股票 (RIOT, MARA)：尾部風險傳遞與結構性脫鉤效應"
                            },
                            {
                                "id": "傳統避險資產-黃金-與美元指數-dxy-之跨市場關聯性演變",
                                "title": "傳統避險資產（黃金）與美元指數 (DXY) 之跨市場關聯性演變"
                            }
                        ]
                    },
                    {
                        "id": "衍生品避險工具選擇與市場微觀機制深度解析",
                        "title": "衍生品避險工具選擇與市場微觀機制深度解析",
                        "h3_details": [
                            {
                                "id": "反向-etf-sbit-biti-在無衍生品帳戶中之戰術性應用",
                                "title": "反向 ETF (SBIT, BITI) 在無衍生品帳戶中之戰術性應用"
                            },
                            {
                                "id": "加密貨幣選擇權之-delta-中性避險與極端尾部跳躍風險",
                                "title": "加密貨幣選擇權之 Delta 中性避險與極端尾部跳躍風險"
                            },
                            {
                                "id": "永續合約-抵押品避險法則與資金費率無風險套利機制",
                                "title": "永續合約、抵押品避險法則與資金費率無風險套利機制"
                            }
                        ]
                    },
                    {
                        "id": "量化多空策略與配對交易之實務系統設置與程式碼架構指南",
                        "title": "量化多空策略與配對交易之實務系統設置與程式碼架構指南",
                        "h3_details": [
                            {
                                "id": "統計套利與配對交易之-python-系統化建置流程",
                                "title": "統計套利與配對交易之 Python 系統化建置流程"
                            },
                            {
                                "id": "資金費率套利之自動化操作與稅務考量",
                                "title": "資金費率套利之自動化操作與稅務考量"
                            }
                        ]
                    },
                    {
                        "id": "終極風險管理-動態再平衡閾值與黑天鵝事件防禦",
                        "title": "終極風險管理、動態再平衡閾值與黑天鵝事件防禦",
                        "h3_details": [
                            {
                                "id": "共整合性關係之永久崩潰與斷肢風險-legging-risk",
                                "title": "共整合性關係之永久崩潰與斷肢風險 (Legging Risk)"
                            },
                            {
                                "id": "動態再平衡閾值之數學最佳化與交易摩擦成本",
                                "title": "動態再平衡閾值之數學最佳化與交易摩擦成本"
                            },
                            {
                                "id": "槓桿-強制平倉機制與微觀流動性枯竭",
                                "title": "槓桿、強制平倉機制與微觀流動性枯竭"
                            }
                        ]
                    },
                    {
                        "id": "article-analysis",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "文章推論邏輯分析",
                                "title": "文章推論邏輯分析"
                            },
                            {
                                "id": "敘事邊界與關鍵變數補充",
                                "title": "敘事邊界與關鍵變數補充"
                            }
                        ]
                    },
                    {
                        "id": "mason-yang-observation",
                        "title": "Mason Yang 的觀察 (Actionable Intelligence)",
                        "h3_details": []
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "20260528-gold-btc-crash-analysis",
                "pillar": "btc",
                "badge": "深度研報",
                "date": "2026-05-29",
                "title": "【流動性危機下黃金與比特幣同步崩盤】- 資產定價權重塑如何導致避險資產無差別拋售？為何此次崩盤具結構必然性？解構範式轉移與長期配置意義",
                "url": "../news/20260528-gold-btc-crash-analysis.html",
                "core_conclusion": "本文分析指出「2026流動性危機下的資產定價權重塑：黃金與比特幣同步崩盤的結構必然性與範式轉移」的核心邏輯在於市場供需失衡與產業結構演化。受制於資本開支門檻與總體流動性變化，領先企業透過技術護城河與長約機制鎖定資產溢價，驅動整體產業進行重估值。 2026年5月28日黃金與比特幣的同步崩盤，標誌著全球流動性進入「無差別去槓桿」的新體制，所有無收益資產皆在美債…",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": [
                            {
                                "id": "section-5w1h-core",
                                "title": "5W1H 深度邏輯總結"
                            }
                        ]
                    },
                    {
                        "id": "geopolitical-furnace",
                        "title": "能源通膨如何重塑地緣溢價？ 史詩狂怒行動引發的流動性擠壓與其定價機制是什麼？",
                        "h3_details": [
                            {
                                "id": "epic-fury-escalation",
                                "title": "荷莫茲海峽封鎖：中東衝突升級引發布蘭特原油供應鏈斷裂與風險外溢"
                            },
                            {
                                "id": "energy-shock-repricing",
                                "title": "能源溢價重估：大宗商品急漲觸發核心 PCE 通膨數據上修 0.4%"
                            }
                        ]
                    },
                    {
                        "id": "macro-dilemma",
                        "title": "停滯性通膨如何鎖死貨幣政策？ 沃什體系下的聯準會鷹派轉向與國債折現率機制為何？",
                        "h3_details": [
                            {
                                "id": "gdp-pce-matrix",
                                "title": "總體數據錯置：Q1 GDP 衰退伴隨 4 月 PCE 數據攀升確立停滯性通膨"
                            },
                            {
                                "id": "fed-hawkish-pivot",
                                "title": "沃什衝擊 (Warsh Shock)：聯準會主席更替觸發鷹派前瞻指引與預期重置"
                            },
                            {
                                "id": "treasury-yield-surge",
                                "title": "長天期國債拋售：30 年期美債殖利率突破 5.1% 啟動無風險資產折現"
                            }
                        ]
                    },
                    {
                        "id": "gold-technical-breakdown",
                        "title": "避險資產為何在危機中失效？ 實質殖利率引力如何粉碎黃金防線與礦業的營運槓桿效應？",
                        "h3_details": [
                            {
                                "id": "price-action-support-collapse",
                                "title": "技術面清算：黃金現貨跌破 4,400 美元引發 CME 百分比保證金追加"
                            },
                            {
                                "id": "geopolitical-paradox-mining",
                                "title": "黃金悖論剝離：實質殖利率狂飆壓制避險情緒與 AISC 營運槓桿價值"
                            }
                        ]
                    },
                    {
                        "id": "crypto-liquidity-crisis",
                        "title": "比特幣為何淪為高貝塔風險代理？ 機構 ETF 資金撤退與 VaR 模型驅動的強制去槓桿邏輯是什麼？",
                        "h3_details": [
                            {
                                "id": "crypto-crash-anatomy",
                                "title": "衍生品市場崩潰：比特幣失守 7.3 萬美元觸發 9.3 億美元強制平倉"
                            },
                            {
                                "id": "institutional-etf-outflow",
                                "title": "現貨 ETF 擠兌：華爾街 VaR 模型指令強制抽離 26 億美元流動性"
                            }
                        ]
                    },
                    {
                        "id": "correlation-breakdown-barbell-failure",
                        "title": "雙核資產相關性為何趨近絕對值？ 槓鈴對沖策略的系統性失效與資本配置的結構重組為何發生？",
                        "h3_details": [
                            {
                                "id": "historical-decoupling",
                                "title": "資產關聯瓦解：比特幣與黃金 30 天滾動相關係數暴跌至 -0.88"
                            },
                            {
                                "id": "convergence-anomaly-strategy-failure",
                                "title": "流動性黑洞效應：無收益資產同步清算擊潰 15% 配置比之槓鈴策略"
                            }
                        ]
                    },
                    {
                        "id": "crypto-regulation-maturity",
                        "title": "監管融合如何創造流動性破口？ GENIUS 法案落地與 SEC 證券分類法對數位資產的機構化反噬是什麼？",
                        "h3_details": [
                            {
                                "id": "genius-act-impact",
                                "title": "GENIUS 法案合規：100% 穩定幣準備金制度推升產業反洗錢營運成本"
                            },
                            {
                                "id": "sec-taxonomy-implementation",
                                "title": "SEC 證券分類收網：質押與挖礦全面納管迫使創新資本流向合規基礎設施"
                            }
                        ]
                    },
                    {
                        "id": "conclusion-macro-reality",
                        "title": "結論 全球宏觀市場的殘酷新現實與避險典範的終極瓦解",
                        "h3_details": []
                    },
                    {
                        "id": "article-analysis-header",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "文章推論邏輯分析",
                                "title": "文章推論邏輯分析"
                            },
                            {
                                "id": "敘事邊界與關鍵變數補充",
                                "title": "敘事邊界與關鍵變數補充"
                            }
                        ]
                    },
                    {
                        "id": "mason-yang-observation",
                        "title": "Mason Yang 的觀察 (Actionable Intelligence)",
                        "h3_details": []
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "20260521-clarity-act-legislative-analysis",
                "pillar": "rwa",
                "badge": "深度研報",
                "date": "2026-05-21",
                "title": "【CLARITY Act 數位資產監管框架】- 美國金融監管重塑如何影響加密資產分類？為何地緣政治博弈滲透立法進程？解構商品與證券邊界重劃的市場衝擊",
                "url": "../news/20260521-clarity-act-legislative-analysis.html",
                "core_conclusion": "本篇研究《【CLARITY Act 數位資產監管框架 2026】- 美國金融監管重塑如何影響加密資產分類？為何地緣政治博弈滲透立法進程？解構商品與證券邊界重劃的市場衝擊》(CLARITY Act) 深度研究報告：2026年美國金融監管框架與國家安全地緣政治分析》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界…",
                "indicators": [
                    {
                        "label": "核心參數",
                        "value": "2026年"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要與 5W1H 核心認知架構",
                        "h3_details": [
                            {
                                "id": "section-5w1h-core",
                                "title": "《數位資產市場清晰法案》(CLARITY Act) 的 5W1H 核心認知架構"
                            }
                        ]
                    },
                    {
                        "id": "chapter-1",
                        "title": "監管混亂的終結：從執行監管到法定框架",
                        "h3_details": [
                            {
                                "id": "section-1-summary",
                                "title": "政策轉型：終結「訴訟監管」時代，確立三大資產分類"
                            },
                            {
                                "id": "section-1-table",
                                "title": "數位資產分類與監管權責對照表"
                            }
                        ]
                    },
                    {
                        "id": "chapter-2",
                        "title": "市場結構的專業化與體制化：第 404 與 406 條解析",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "中介機構合規：終結「野蠻生長」，數位商品交易所 (DCE) 制度化"
                            },
                            {
                                "id": "section-2-2",
                                "title": "經紀人與交易商：槓桿合法化與 FinCEN 的全面接管"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "國家安全防禦線：阻斷外國敵對勢力的技術滲透",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "技術冷戰：針對 BSN 與 Spartan Network 的「數位柏林圍牆」"
                            },
                            {
                                "id": "section-3-2",
                                "title": "國家安全執行架構與多部門協作"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "穩定幣的博弈：存款流失恐懼與銀行業的強烈遊說",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "利益分配之爭：穩定幣收益禁令 (Yield Ban) 的背後邏輯"
                            },
                            {
                                "id": "section-4-2",
                                "title": "2026 年 3 月至 4 月：立法關鍵節點與市場轉折"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "核心技術機制：區塊鏈成熟度認證與去中心化門檻",
                        "h3_details": [
                            {
                                "id": "section-5-1",
                                "title": "「畢業機制」：從證券到商品的法定過渡路徑"
                            },
                            {
                                "id": "section-5-2",
                                "title": "「成熟區塊鏈系統」的四項硬核門檻"
                            }
                        ]
                    },
                    {
                        "id": "chapter-6",
                        "title": "行業領袖與政治動向：2026 年的權力博弈",
                        "h3_details": [
                            {
                                "id": "section-6-1",
                                "title": "政治天平的傾斜：第 119 屆國會與「親加密」執政聯盟"
                            },
                            {
                                "id": "section-6-2",
                                "title": "反對派的戰線：退休金安全與「FTX 幽靈」"
                            }
                        ]
                    },
                    {
                        "id": "chapter-7",
                        "title": "對去中心化金融 (DeFi) 與開發者的保護條款",
                        "h3_details": [
                            {
                                "id": "section-7-1",
                                "title": "「代碼非金融」：為 Web3 創新劃定法律避風港"
                            },
                            {
                                "id": "section-7-2",
                                "title": "豁免範疇：驗證者、開發者與介面提供商"
                            }
                        ]
                    },
                    {
                        "id": "chapter-8",
                        "title": "實施時間表與機構投資的經濟影響",
                        "h3_details": [
                            {
                                "id": "section-8-1",
                                "title": "立法里程碑：邁向 2027 年的全面合規時代"
                            },
                            {
                                "id": "section-8-2",
                                "title": "經濟影響：機構資金的「第二次浪潮」"
                            }
                        ]
                    },
                    {
                        "id": "chapter-9",
                        "title": "結論：構建美國數位金融主權的基石",
                        "h3_details": []
                    },
                    {
                        "id": "文章分析",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "文章推論邏輯分析",
                                "title": "文章推論邏輯分析"
                            },
                            {
                                "id": "敘事邊界與關鍵變數補充",
                                "title": "敘事邊界與關鍵變數補充"
                            }
                        ]
                    },
                    {
                        "id": "mason-yang-observation",
                        "title": "Mason Yang 的觀察 (Actionable Intelligence)",
                        "h3_details": []
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "20260519-ap2-agent-payments-protocol",
                "pillar": "defai",
                "badge": "深度研報",
                "date": "2026-05-19",
                "title": "【AP2 代理支付協議架構】- 密碼學信任框架如何支撐 AI 代理商務自主交易？為何傳統支付基礎設施無法滿足代理人需求？解構全球代理支付標準演進路徑",
                "url": "../news/20260519-ap2-agent-payments-protocol.html",
                "core_conclusion": "本篇研究《【AP2 代理支付協議架構 2026】- 密碼學信任框架如何支撐 AI 代理商務自主交易？為何傳統支付基礎設施無法滿足代理人需求？解構全球代理支付標準演進路徑》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要與 5W1H 核心認知架構",
                        "h3_details": [
                            {
                                "id": "section-5w1h-core",
                                "title": "AP2 代理支付協議的 5W1H 核心認知架構"
                            }
                        ]
                    },
                    {
                        "id": "chapter-1",
                        "title": "代理商務的崛起與網路支付基礎設施的典範轉移",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-2",
                        "title": "代理支付協議（AP2）的設計哲學與核心架構原則",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-3",
                        "title": "AP2 的角色模型與資安邊界界定",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-4",
                        "title": "授權委託書（Mandates）的生命週期與密碼學機制",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-5",
                        "title": "代理身分驗證框架與信任模型分析",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-6",
                        "title": "AP2 與通用商務協議（UCP）的系統整合",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-7",
                        "title": "代理交易生命週期：人類在場與自主模式的運作機制",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-8",
                        "title": "Web3 與穩定幣的交匯：A2A x402 擴充與無許可結算",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-9",
                        "title": "代理支付協議生態系的多維度比較分析",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-10",
                        "title": "FIDO 聯盟的接管與全球標準化進程",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-11",
                        "title": "開發者生態系、開源實現與 AP2 v0.2 技術規格",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-12",
                        "title": "結論與代理經濟的未來展望",
                        "h3_details": []
                    },
                    {
                        "id": "文章分析",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "文章推論邏輯分析",
                                "title": "文章推論邏輯分析"
                            },
                            {
                                "id": "敘事邊界與關鍵變數補充",
                                "title": "敘事邊界與關鍵變數補充"
                            }
                        ]
                    },
                    {
                        "id": "mason-yang-observation",
                        "title": "Mason Yang 的觀察 (Actionable Intelligence)",
                        "h3_details": []
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "20260423-iran-irgc-btc-fees",
                "pillar": "btc",
                "badge": "深度研報",
                "date": "2026-04-23",
                "title": "【伊朗 IRGC 比特幣通道費深度研究】- 霍爾木茲海峽數位關卡如何收取能源過路費？為何制裁體系無法阻斷鏈上資金流？解構地緣政治與加密金融交叉風險",
                "url": "../news/20260423-iran-irgc-btc-fees.html",
                "core_conclusion": "本篇研究《【伊朗 IRGC 比特幣通道費深度研究 2026】- 霍爾木茲海峽數位關卡如何收取能源過路費？為何制裁體系無法阻斷鏈上資金流？解構地緣政治與加密金融交叉風險》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "section-1",
                        "title": "地緣政治背景與危機演變",
                        "h3_details": []
                    },
                    {
                        "id": "section-2",
                        "title": "數位通行費收費機制的技術與行政架構",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "嚴格的審查與申請程序"
                            },
                            {
                                "id": "section-2-2",
                                "title": "階梯式定價模型"
                            },
                            {
                                "id": "section-2-3",
                                "title": "支付技術與確認機制"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "加密貨幣在伊朗主權戰略中的地位",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "格什姆島：數位資產的「煉金工廠」"
                            },
                            {
                                "id": "section-3-2",
                                "title": "穩定幣與比特幣的戰略分工"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "國際法與航運監規的衝突分析",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "「過境通行」制度的崩塌"
                            }
                        ]
                    },
                    {
                        "id": "section-5",
                        "title": "安全威脅、詐騙與實體衝突",
                        "h3_details": []
                    },
                    {
                        "id": "section-6",
                        "title": "對全球能源市場與航運經濟的長遠衝擊",
                        "h3_details": []
                    },
                    {
                        "id": "section-7",
                        "title": "內部權力鬥爭與未來展望",
                        "h3_details": []
                    },
                    {
                        "id": "文章分析",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "part-2-1-5w1h-深度邏輯總結",
                                "title": "Part 2.1: 5W1H 深度邏輯總結"
                            },
                            {
                                "id": "文章推論邏輯分析",
                                "title": "文章推論邏輯分析"
                            },
                            {
                                "id": "邏輯盲點與風險預警",
                                "title": "邏輯盲點與風險預警"
                            }
                        ]
                    },
                    {
                        "id": "mason-yang-observation",
                        "title": "Mason Yang 的觀察",
                        "h3_details": []
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "20260418-bitcoin-rise-analysis",
                "pillar": "btc",
                "badge": "深度研報",
                "date": "2026-04-18",
                "title": "【比特幣突破 78,000 美元機制解構】- 地緣衝突與政策驅動如何啟動機構資產重估？為何沃什衝擊加速法幣信用逃逸？解構 CLARITY Act 與鏈上籌碼結構",
                "url": "../news/20260418-bitcoin-rise-analysis.html",
                "core_conclusion": "本篇研究《【比特幣突破 78,000 美元機制解構 2026】- 地緣衝突與政策驅動如何啟動機構資產重估？為何沃什衝擊加速法幣信用逃逸？解構 CLARITY Act 與鏈上籌碼結構》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "geopolitics-hormuz",
                        "title": "地緣政治局勢轉向與「霍爾木茲紅利」",
                        "h3_details": [
                            {
                                "id": "energy-price-collapse",
                                "title": "能源價格崩解–原因分析：荷姆茲海峽開放後的全球成本重估"
                            }
                        ]
                    },
                    {
                        "id": "fed-warsh-shock",
                        "title": "美聯儲領導層過渡與「沃什衝擊」的重新定價",
                        "h3_details": [
                            {
                                "id": "fed-transition-logic",
                                "title": "貨幣政策轉向–原因分析：凱文·沃什提名引發的「生產力優先」定價"
                            }
                        ]
                    },
                    {
                        "id": "clarity-act-regulation",
                        "title": "《克拉里蒂法案》與監管突破的催化作用",
                        "h3_details": [
                            {
                                "id": "regulatory-breakthrough",
                                "title": "監管政策清障–原因分析：穩定幣法案達成折衷與 CFTC 確權"
                            }
                        ]
                    },
                    {
                        "id": "institutional-infrastructure",
                        "title": "機構基礎設施的深化：從 ETF 到零售巨頭",
                        "h3_details": [
                            {
                                "id": "schwab-ms-linkage",
                                "title": "機構通路整合–原因分析：零售巨頭與現貨 ETF 的配置標準化"
                            }
                        ]
                    },
                    {
                        "id": "market-microstructure",
                        "title": "市場微觀結構：空頭擠壓與鏈上數據分析",
                        "h3_details": [
                            {
                                "id": "liquidity-cascade",
                                "title": "市場流動性清算–原因分析：60 億美元空頭瀑布引發的級聯效應"
                            },
                            {
                                "id": "whale-behavior",
                                "title": "籌碼結構沈澱–原因分析：鯨魚增持與長期持有者的極端鎖倉"
                            }
                        ]
                    },
                    {
                        "id": "halving-cycle-mature-asset",
                        "title": "比特幣減半週期的演變與「成熟資產」假說",
                        "h3_details": [
                            {
                                "id": "cycle-mutation",
                                "title": "減半週期變異–原因分析：從「供應驅動」轉型為「流動性定價」"
                            }
                        ]
                    },
                    {
                        "id": "future-prospects-risks",
                        "title": "未來展望與潛在風險分析",
                        "h3_details": [
                            {
                                "id": "technical-targets",
                                "title": "技術目標攻堅–原因分析：站穩 $78,000 後的六位數心理路徑"
                            },
                            {
                                "id": "key-risks",
                                "title": "風險變數控制–原因分析：地緣反覆與立法延遲的尾部威脅"
                            }
                        ]
                    },
                    {
                        "id": "conclusion",
                        "title": "結論",
                        "h3_details": []
                    },
                    {
                        "id": "文章分析",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "part-2-1-5w1h-深度邏輯總結",
                                "title": "Part 2.1: 5W1H 深度邏輯總結"
                            },
                            {
                                "id": "文章推論邏輯分析",
                                "title": "文章推論邏輯分析"
                            }
                        ]
                    },
                    {
                        "id": "mason-yang-observation",
                        "title": "Mason Yang 的觀察",
                        "h3_details": [
                            {
                                "id": "邏輯盲點與風險預警",
                                "title": "邏輯盲點與風險預警"
                            }
                        ]
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "20260414-ravedao-price-surge-analysis",
                "pillar": "defai",
                "badge": "深度研報",
                "date": "2026-04-14",
                "title": "【RaveDAO 2100% 暴漲真相解構】- 30 億市值如何在流動性蜃樓中瞬間蒸發？為何鏈上活躍度無法支撐極端估值？解構 RAVE 代幣機制與散戶踩踏路徑",
                "url": "../news/20260414-ravedao-price-surge-analysis.html",
                "core_conclusion": "本篇研究《【RaveDAO 2100% 暴漲真相解構 2026】- 30 億市值如何在流動性蜃樓中瞬間蒸發？為何鏈上活躍度無法支撐極端估值？解構 RAVE 代幣機制與散戶踩踏路徑》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "2100%"
                    },
                    {
                        "label": "關鍵規模",
                        "value": "30 億"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "section-1",
                        "title": "RaveDAO (RAVE) 分析摘要與觀察評論",
                        "h3_details": [
                            {
                                "id": "obs-mirage",
                                "title": "1. Naming the Phenomenon:「流動性蜃樓 (Liquidity Mirage)」"
                            },
                            {
                                "id": "obs-mktcap",
                                "title": "2. Deconstructing the Consensus: 糾正「市值 (Market Cap)」的迷思"
                            },
                            {
                                "id": "obs-fdv",
                                "title": "3. FDV 與現實的斷裂：110 億美金是什麼概念？"
                            },
                            {
                                "id": "obs-volume",
                                "title": "4. 24 小時交易量與換手率的警訊"
                            },
                            {
                                "id": "結語-關於野心的現實檢查",
                                "title": "結語：關於野心的現實檢查"
                            }
                        ]
                    },
                    {
                        "id": "section-2",
                        "title": "市場表現分析與估值基準 – 垂直噴發的 4,600%",
                        "h3_details": [
                            {
                                "id": "section-2-data",
                                "title": "2026年4月核心市場指標統計"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "空頭擠壓機制與衍生品市場壓力 – -4,800% 的負費率燃料",
                        "h3_details": [
                            {
                                "id": "section-3-funding",
                                "title": "負費率與清算級聯效應"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "鏈上法證：鯨魚活動與價格工程 – 精密調度的「獵殺」",
                        "h3_details": [
                            {
                                "id": "section-4-whales",
                                "title": "1,000 萬枚代幣錢包的戰略部署"
                            },
                            {
                                "id": "section-4-tactic",
                                "title": "「引誘空頭」的欺騙戰術 (Deception Tactic)"
                            }
                        ]
                    },
                    {
                        "id": "section-5",
                        "title": "代幣經濟學與結構性稀缺 –「低流通、高 FDV」的物理效應",
                        "h3_details": [
                            {
                                "id": "section-5-allocation",
                                "title": "供應量結構與稀釋風險"
                            },
                            {
                                "id": "section-5-deflation",
                                "title": "收入支持的通縮模型"
                            }
                        ]
                    },
                    {
                        "id": "section-6",
                        "title": "音樂金融 (Music-Fi) 敘事與實體價值鏈",
                        "h3_details": [
                            {
                                "id": "section-6-system",
                                "title": "參與型生態系統：從消費到所有權"
                            },
                            {
                                "id": "section-6-roadmap",
                                "title": "2026 年核心路線圖事件"
                            }
                        ]
                    },
                    {
                        "id": "section-7",
                        "title": "2026 年加密市場環境與板塊輪動 – 尋求「阿爾法」的轉身",
                        "h3_details": [
                            {
                                "id": "section-7-institutional",
                                "title": "機構採用與 Web3 基礎設施的成熟"
                            }
                        ]
                    },
                    {
                        "id": "section-8",
                        "title": "風險預警與可持續性評估 – 隱藏在狂熱下的結構性裂痕",
                        "h3_details": [
                            {
                                "id": "section-8-leverage",
                                "title": "高槓桿與清算反轉風險"
                            },
                            {
                                "id": "section-8-insider",
                                "title": "部署者與內幕交易嫌疑"
                            },
                            {
                                "id": "section-8-levels",
                                "title": "估值溢價與技術支撐位"
                            }
                        ]
                    },
                    {
                        "id": "section-9",
                        "title": "結論與市場展望 – 敘事溢價與實效主義的拉鋸",
                        "h3_details": []
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "20260410-btc-investment-opportunity-prediction",
                "pillar": "btc",
                "badge": "深度研報",
                "date": "2026-04-10",
                "title": "【比特幣 BTC 投資機會與支撐預測】 - 機構買盤如何守住 7 萬關口？解構空頭擠壓與突破訊號",
                "url": "../news/20260410-btc-investment-opportunity-prediction.html",
                "core_conclusion": "本文分析指出「2026 年 4 月比特幣 (BTC) 投資機會預測與上漲原因分析：地緣政治、機構範式與空頭擠壓預警」的核心邏輯在於市場供需失衡與產業結構演化。受制於資本開支門檻與總體流動性變化，領先企業透過技術護城河與長約機制鎖定資產溢價，驅動整體產業進行重估值。",
                "indicators": [
                    {
                        "label": "核心參數",
                        "value": "2026 年"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "section-1",
                        "title": "為什麼在 2026 應該重新檢視建立「BTC 投資診斷框架」(The BTC Diagnostic Framework)",
                        "h3_details": [
                            {
                                "id": "section-1-1",
                                "title": "診斷結論：解析跨越「預期差」與減半週期的結構性佈局"
                            }
                        ]
                    },
                    {
                        "id": "section-2",
                        "title": "如何在地緣政治博弈下，鎖定伊朗談判後的市場「預期差」溢價？(The Edge of Timing)",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "時機剖析：在極度恐懼情緒中尋找「時間維度套利」的 Alpha"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "為什麼傳統估值邏輯正在失效？重新定義比特幣的「生產性資產」範式 (The Art of Valuation)",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "價值解構：分析空頭擠壓的數學模型與 sBTC 息票化收益方案"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "如何在不確定性中做出科學決策？投資的「貝葉斯機率」更新 (Scientific Decision Making)",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "概率模型：權衡宏觀數據與市場證據的「看漲概率矩陣」拆解"
                            }
                        ]
                    },
                    {
                        "id": "section-5",
                        "title": "具體的操作關鍵在哪裡？鎖定 4 月下旬的位階觸發與法案進程 (Execution Excellence)",
                        "h3_details": [
                            {
                                "id": "section-5-1",
                                "title": "實務執行：擬定基於「價格位階」的連鎖動作清單與風險管理"
                            }
                        ]
                    },
                    {
                        "id": "section-supplementary",
                        "title": "為什麼監管轉型是 2026 年市場的基石？補充背景與動態回測 (Regulatory Transformation)",
                        "h3_details": [
                            {
                                "id": "section-regulatory",
                                "title": "6.1 監管里程碑：從「執法監管」到「法律框架」的轉向分析 (Regulatory Shift)"
                            },
                            {
                                "id": "section-mining",
                                "title": "網路安全與挖礦產業：結構性調整與 AI 轉型 (Mining vs. AI)"
                            },
                            {
                                "id": "section-references",
                                "title": "參考資訊"
                            }
                        ]
                    },
                    {
                        "id": "文章分析",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "文章推論邏輯分析",
                                "title": "文章推論邏輯分析"
                            },
                            {
                                "id": "敘事邊界與關鍵變數補充",
                                "title": "敘事邊界與關鍵變數補充"
                            }
                        ]
                    },
                    {
                        "id": "mason-yang-observation",
                        "title": "Mason Yang 的觀察 (Actionable Intelligence)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "topic-btc",
                "pillar": "btc",
                "badge": "方法指南",
                "date": "2026-03-29",
                "title": "比特幣高密度研報：從主權儲備到 BTCFi 的全景圖",
                "url": "../post/crypto-btc.html",
                "core_conclusion": "《2026 比特幣高密度研報》揭示比特幣已完成從「非對稱博弈資產」向「主權級戰略儲備」的根本範式轉移。核心定價由三大支柱支撐：① S2F 稀缺性定價與全球黃金市值對標（TAM 對標模型）；② 微策略 (MSTR) 等機構發行可轉債持續鎖定流動籌碼的資本飛輪；③ BTCFi 與 BitVM 智能合約帶來的比特幣原生金融生息能力。",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": []
            },
            {
                "id": "news-20260322-oil-gold-usd-btc-eth-global-macro-analysis",
                "pillar": "l1-infra",
                "badge": "深度研報",
                "date": "2026-03-22",
                "title": "【油金匯幣跨資產宏觀分析】 - 原油失衡如何傳導至金價？美元強勢壓制 BTC 與五大資產聯動",
                "url": "../news/20260322-oil-gold-usd-btc-eth-global-macro-analysis.html",
                "core_conclusion": "本篇研究《【油金匯幣跨資產宏觀分析】 - 原油失衡如何傳導至金價？美元強勢壓制 BTC 與五大資產聯動》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "section-1",
                        "title": "地緣政治催化劑 史詩憤怒行動與荷姆茲海峽危機",
                        "h3_details": []
                    },
                    {
                        "id": "section-2",
                        "title": "原油市場 實體桶的消失與現貨溢價的極致",
                        "h3_details": [
                            {
                                "id": "oil-summary",
                                "title": "原油市場顯著大幅上漲–原因分析：荷姆茲海峽封鎖引發 1,400 萬桶實體供應直接消失"
                            },
                            {
                                "id": "oil-prices",
                                "title": "價格走勢與市場分裂：期貨基準與現貨溢價的脫鉤"
                            },
                            {
                                "id": "oil-data",
                                "title": "原油市場核心數據概覽"
                            },
                            {
                                "id": "oil-drivers",
                                "title": "上漲原因分析：供應與物流的雙重打擊"
                            },
                            {
                                "id": "oil-outlook",
                                "title": "影響未來走勢的投資因子"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "黃金市場 避險資產的清算悖論",
                        "h3_details": [
                            {
                                "id": "gold-summary",
                                "title": "黃金市場意外高位回撤–原因分析：流動性清算情緒與美元強勢擠壓避險溢價"
                            },
                            {
                                "id": "gold-pullback",
                                "title": "異常的價格回撤：避險情緒下的結構性斷裂"
                            },
                            {
                                "id": "gold-drop-reasons",
                                "title": "價格下跌原因分析：流動性清算與利率衝擊"
                            },
                            {
                                "id": "gold-data",
                                "title": "黃金關鍵技術指標 (2026年3月22日)"
                            },
                            {
                                "id": "gold-outlook",
                                "title": "未來影響因子與走勢預測：通膨與關稅的角力"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "美元指數 混亂中的「唯一真神」",
                        "h3_details": [
                            {
                                "id": "usd-summary",
                                "title": "美元指數強勢單邊上漲–原因分析：美國利率與歐日息差優勢擴大及全球避險資金湧入"
                            },
                            {
                                "id": "usd-surge",
                                "title": "美元指數的強勢突破：全球資本的終極避風港"
                            },
                            {
                                "id": "usd-drivers",
                                "title": "價格上漲原因推論：息差優勢與避險溢價"
                            },
                            {
                                "id": "usd-data",
                                "title": "美元指數與主要貨幣對走勢"
                            },
                            {
                                "id": "usd-outlook",
                                "title": "接下來的影響因素：PMI 與點陣圖的指引"
                            }
                        ]
                    },
                    {
                        "id": "section-5",
                        "title": "比特幣 數字黃金的成年禮",
                        "h3_details": [
                            {
                                "id": "btc-summary",
                                "title": "比特幣強勁逆勢上漲 12%–原因分析：數字避險屬性確立與機構 ETF 流動性強力支撐"
                            },
                            {
                                "id": "btc-decoupling",
                                "title": "與傳統避險資產的脫鉤：數字黃金的成年禮"
                            },
                            {
                                "id": "btc-drivers",
                                "title": "價格上漲原因分析：機構護城河與全天候流動性"
                            },
                            {
                                "id": "btc-data",
                                "title": "比特幣關鍵數據與觀測點"
                            },
                            {
                                "id": "btc-threats",
                                "title": "未來影響因素：量子威脅與政治角力"
                            }
                        ]
                    },
                    {
                        "id": "section-6",
                        "title": "以太幣 技術陣痛與模組化未來的築底",
                        "h3_details": [
                            {
                                "id": "eth-summary",
                                "title": "以太幣價格相對低迷震盪–原因分析：模組化轉型期的通縮效應減弱與 L2 吸血效應"
                            },
                            {
                                "id": "eth-activity",
                                "title": "網絡活動與估值的暫時錯位：模組化轉型的代價"
                            },
                            {
                                "id": "eth-drop-reasons",
                                "title": "下跌與鞏固的原因分析：L2 轉型期的代價"
                            },
                            {
                                "id": "eth-data",
                                "title": "以太坊網絡技術現狀表"
                            },
                            {
                                "id": "eth-outlook",
                                "title": "投資因子與未來展望：價值回歸的引信"
                            }
                        ]
                    },
                    {
                        "id": "section-7",
                        "title": "跨資產關聯性剖析 強耦合與突發性脫鉤並存",
                        "h3_details": [
                            {
                                "id": "corr-oil-usd",
                                "title": "1. 原油與美元的聯動：新的「石油美元」循環"
                            },
                            {
                                "id": "corr-gold-btc",
                                "title": "2. 黃金與比特幣的競爭：安全邊界的重定義"
                            },
                            {
                                "id": "corr-eth-fi",
                                "title": "3. 以太幣與傳統金融的深層整合"
                            },
                            {
                                "id": "corr-matrix",
                                "title": "資產關聯性矩陣概覽 (2026年3月)"
                            }
                        ]
                    },
                    {
                        "id": "section-8",
                        "title": "未來局勢與策略 戰爭持久化與經濟再平衡的考驗",
                        "h3_details": [
                            {
                                "id": "scen-stagflation",
                                "title": "情景一：海峽長期封鎖與滯脹加劇 (機率 60%)"
                            },
                            {
                                "id": "scen-reversion",
                                "title": "情景二：技術性護航與價格均值回歸 (機率 40%)"
                            },
                            {
                                "id": "strat-advice",
                                "title": "戰略投資建議 (Mason Yang 的觀察)"
                            }
                        ]
                    },
                    {
                        "id": "mason-yang-observation",
                        "title": "Mason Yang 的觀察",
                        "h3_details": []
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "news-20260317-eth-surge-analysis",
                "pillar": "l1-infra",
                "badge": "深度研報",
                "date": "2026-03-17",
                "title": "【以太幣上漲動能與機構質押】 - 貝萊德 ETHB 與 Layer2 如何鎖定供給？解構 ETH 價格傳導與風險",
                "url": "../news/20260317-eth-surge-analysis.html",
                "core_conclusion": "本篇研究《【以太幣上漲動能與機構質押】 - 貝萊德 ETHB 與 Layer2 如何鎖定供給？解構 ETH 價格傳導與風險》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "conclusion",
                        "title": "為什麼上漲？ 2026年3月17日 ETH 5W1H 核心邏輯",
                        "h3_details": [
                            {
                                "id": "5w1h-深度邏輯總結",
                                "title": "5W1H 深度邏輯總結"
                            }
                        ]
                    },
                    {
                        "id": "bearish-scenarios",
                        "title": "上漲了然後呢？什麼情況下會下跌？ 趨勢轉折、風險預警與市場反轉觸發點",
                        "h3_details": [
                            {
                                "id": "1-宏觀經濟轉向-聯準會的-鷹派驚喜",
                                "title": "1. 宏觀經濟轉向：聯準會的「鷹派驚喜」"
                            },
                            {
                                "id": "2-監管利多落空-clarity-法案的立法僵局",
                                "title": "2. 監管利多落空：CLARITY 法案的立法僵局"
                            },
                            {
                                "id": "3-技術面回吐-關鍵阻力位的結構性排斥",
                                "title": "3. 技術面回吐：關鍵阻力位的結構性排斥"
                            },
                            {
                                "id": "4-協議升級風險-glamsterdam-的開發延遲",
                                "title": "4. 協議升級風險：Glamsterdam 的開發延遲"
                            },
                            {
                                "id": "5-籌碼面變動-大戶獲利了結與交易所流入",
                                "title": "5. 籌碼面變動：大戶獲利了結與交易所流入"
                            }
                        ]
                    },
                    {
                        "id": "institution-infrastructure",
                        "title": "機構基礎設施的範式轉移 貝萊德 ETHB 與質押經濟學",
                        "h3_details": [
                            {
                                "id": "解決質押劣勢與資本效率",
                                "title": "解決質押劣勢與資本效率"
                            },
                            {
                                "id": "貝萊德的市場主導地位與費率策略",
                                "title": "貝萊德的市場主導地位與費率策略"
                            }
                        ]
                    },
                    {
                        "id": "macro-economic",
                        "title": "宏觀經濟背景 聯準會會議前的「解脫交易」",
                        "h3_details": [
                            {
                                "id": "利率預期與流動性傳導",
                                "title": "利率預期與流動性傳導"
                            },
                            {
                                "id": "地緣政治風險下的數位對沖屬性",
                                "title": "地緣政治風險下的數位對沖屬性"
                            }
                        ]
                    },
                    {
                        "id": "protocol-evolution",
                        "title": "協議技術演進 Glamsterdam 升級與「超標量」預期",
                        "h3_details": [
                            {
                                "id": "glamsterdam-的核心創新與開發進度",
                                "title": "Glamsterdam 的核心創新與開發進度"
                            },
                            {
                                "id": "layer-2-的規模化效應與-blob-經濟學",
                                "title": "Layer 2 的規模化效應與 Blob 經濟學"
                            }
                        ]
                    },
                    {
                        "id": "market-microstructure",
                        "title": "市場微觀結構 空頭擠壓與交易所供應短缺",
                        "h3_details": [
                            {
                                "id": "衍生品市場的強制平倉",
                                "title": "衍生品市場的強制平倉"
                            },
                            {
                                "id": "歷史性的供應緊縮",
                                "title": "歷史性的供應緊縮"
                            }
                        ]
                    },
                    {
                        "id": "regulation-legislation",
                        "title": "監管與法制建設 CLARITY 法案與加密政治資本",
                        "h3_details": [
                            {
                                "id": "國會的博弈與時間表",
                                "title": "國會的博弈與時間表"
                            },
                            {
                                "id": "數位資產政治行動委員會-pac-的影響",
                                "title": "數位資產政治行動委員會（PAC）的影響"
                            }
                        ]
                    },
                    {
                        "id": "enterprise-adoption",
                        "title": "企業採用與代幣化趨勢 RWA 與機構級 DeFi",
                        "h3_details": [
                            {
                                "id": "摩根大通與-kinexys-的崛起",
                                "title": "摩根大通與「Kinexys」的崛起"
                            },
                            {
                                "id": "真實世界資產-rwa-的爆發",
                                "title": "真實世界資產（RWA）的爆發"
                            }
                        ]
                    },
                    {
                        "id": "technical-indicators",
                        "title": "技術指標與未來展望 通往新高之路",
                        "h3_details": [
                            {
                                "id": "移動平均線與相對強弱指數",
                                "title": "移動平均線與相對強弱指數"
                            },
                            {
                                "id": "未來展望與潛在風險",
                                "title": "未來展望與潛在風險"
                            }
                        ]
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "topic-tech",
                "pillar": "l1-infra",
                "badge": "方法指南",
                "date": "2026-03-14",
                "title": "區塊鏈關鍵技術 (TECH)：模組化、ZK 與預測市場深度解析",
                "url": "../post/crypto-tech.html",
                "core_conclusion": "區塊鏈前沿技術正經歷從「單體區塊鏈」向「模組化架構與零知識證明 (ZK)」的根本範式演進。核心架構拆解為：① 執行層、結算層、共識層與數據可用性層 (DA) 的解耦與專業化；② ZK-Rollup (ZK-EVM/ZK-VM) 的數學確定性證明與免信任擴容；③ 跨鏈通訊安全性（如 Chainlink CCIP）與 BitVM 在比特幣原生網路上的圖靈完備計…",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "blockchain-trilemma",
                        "title": "擴展性的聖杯戰爭",
                        "h3_details": [
                            {
                                "id": "模組化區塊鏈",
                                "title": "模組化區塊鏈"
                            },
                            {
                                "id": "零知識證明-zk",
                                "title": "零知識證明 (ZK)"
                            }
                        ]
                    },
                    {
                        "id": "prediction-markets",
                        "title": "應用層爆發：資訊發現",
                        "h3_details": [
                            {
                                "id": "預測市場-polymarket",
                                "title": "預測市場 (Polymarket)"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "topic-stablecoin",
                "pillar": "rwa",
                "badge": "方法指南",
                "date": "2026-03-14",
                "title": "核心系列：穩定幣 (Stablecoin)",
                "url": "../post/crypto-stablecoin.html",
                "core_conclusion": "2026 年全球穩定幣市值已突破 2,000 億美元，成為全球跨國結算與鏈上流動性的美元霸權新載體。核心機制涵蓋：① 法幣抵押型 (USDT, USDC) 的準備金透明度與合規監管（美國 GENIUS 法案）；② 去中心化超額抵押與算法機制（如 MakerDAO/Sky, Ethena USDe）的清算套利與收益來源；③ 應對極端流動性擠兌的系統性脫錨防禦…",
                "indicators": [
                    {
                        "label": "關鍵規模",
                        "value": "2,000 億"
                    },
                    {
                        "label": "核心參數",
                        "value": "2026 年"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "基本資訊-穩定幣是什麼",
                        "title": "基本資訊：穩定幣是什麼？",
                        "h3_details": []
                    },
                    {
                        "id": "核心價值-穩定幣解決了什麼問題",
                        "title": "核心價值：穩定幣解決了什麼問題？",
                        "h3_details": []
                    },
                    {
                        "id": "代幣經濟學與關鍵指標",
                        "title": "代幣經濟學與關鍵指標",
                        "h3_details": []
                    },
                    {
                        "id": "生態系發展-有哪些主要專案",
                        "title": "生態系發展：有哪些主要專案？",
                        "h3_details": []
                    },
                    {
                        "id": "目標客群與應用場景",
                        "title": "目標客群與應用場景",
                        "h3_details": []
                    },
                    {
                        "id": "如何評估與比較",
                        "title": "如何評估與比較？",
                        "h3_details": []
                    },
                    {
                        "id": "風險與挑戰-從野蠻生長到聯邦合規",
                        "title": "風險與挑戰：從野蠻生長到聯邦合規",
                        "h3_details": []
                    },
                    {
                        "id": "常見問題-faq",
                        "title": "常見問題 (FAQ)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "topic-rwa",
                "pillar": "rwa",
                "badge": "方法指南",
                "date": "2026-03-14",
                "title": "現實世界資產 (RWA) 深度指南：資產代幣化、Ondo 與 BlackRock 佈局",
                "url": "../post/crypto-rwa.html",
                "core_conclusion": "現實世界資產代幣化 (RWA) 是 2026 年 Web3 承接傳統機構資本的最主要橋樑。以美國短期國債上鏈（如 Ondo Finance OUSG/USDY、BlackRock BUIDL）為龍頭，總 TVL 已突破數十億美元。本指南透過獨創的 T.R.U.S.T. 評估框架，深度解析抵押品託管、破產隔離、預言機定價（Chainlink CCIP）與智能…",
                "indicators": [
                    {
                        "label": "核心參數",
                        "value": "2026 年"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "傳統金融與-defi-的巨大鴻溝",
                        "title": "傳統金融與 DeFi 的巨大鴻溝",
                        "h3_details": []
                    },
                    {
                        "id": "rwa-連接-tradfi-與-defi-的終極橋樑",
                        "title": "RWA，連接 TradFi 與 DeFi 的終極橋樑",
                        "h3_details": []
                    },
                    {
                        "id": "一張圖看懂-rwa-的運作流程",
                        "title": "一張圖看懂 RWA 的運作流程",
                        "h3_details": [
                            {
                                "id": "rwa-代幣化的五大步驟",
                                "title": "RWA 代幣化的五大步驟"
                            },
                            {
                                "id": "案例研究-tradfi-巨頭與-crypto-原生協議的雙向奔赴",
                                "title": "案例研究：TradFi 巨頭與 Crypto 原生協議的雙向奔赴"
                            },
                            {
                                "id": "技術關鍵-統一黃金紀錄-unified-golden-record",
                                "title": "技術關鍵：統一黃金紀錄 (Unified Golden Record)"
                            }
                        ]
                    },
                    {
                        "id": "如何評估一個-rwa-項目",
                        "title": "如何評估一個 RWA 項目？",
                        "h3_details": []
                    },
                    {
                        "id": "常見問題-faq",
                        "title": "常見問題 (FAQ)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "topic-meme",
                "pillar": "defai",
                "badge": "方法指南",
                "date": "2026-03-14",
                "title": "迷因幣 (Meme Coin) 生存指南：從狗狗幣到注意力經濟的投機框架",
                "url": "../post/crypto-meme.html",
                "core_conclusion": "迷因幣 (Meme) 是注意力經濟、社群文化共識與去中心化非對稱博弈的極致資本化產物。本專題剖析：① 從「純迷因」向「AI Agent 自主代理迷因（如 SIREN）」的範式升級；② 注意力生命週期曲線、社群傳播力與流動性池 (AMM) 的博弈機制；③ 如何透過鏈上數據指標穿透莊家拉高出貨 (Pump & Dump) 的陷阱。",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "為何基本面分析在某些角落失靈",
                        "title": "為何基本面分析在某些角落失靈？",
                        "h3_details": []
                    },
                    {
                        "id": "迷因幣-注意力經濟的終極體現",
                        "title": "迷因幣，注意力經濟的終極體現",
                        "h3_details": []
                    },
                    {
                        "id": "拆解迷因幣的成功密碼",
                        "title": "拆解迷因幣的成功密碼",
                        "h3_details": [
                            {
                                "id": "1-迷因-meme-病毒式傳播的核心",
                                "title": "1. 迷因 (Meme): 病毒式傳播的核心"
                            },
                            {
                                "id": "2-社群驅動與代幣經濟學",
                                "title": "2. 社群驅動與代幣經濟學"
                            },
                            {
                                "id": "案例研究-拆解迷因幣的崛起之路",
                                "title": "案例研究：拆解迷因幣的崛起之路"
                            }
                        ]
                    },
                    {
                        "id": "迷因幣賭場的終極生存法則",
                        "title": "迷因幣賭場的終極生存法則",
                        "h3_details": []
                    },
                    {
                        "id": "常見問題-faq",
                        "title": "常見問題 (FAQ)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "topic-macro",
                "pillar": "btc",
                "badge": "方法指南",
                "date": "2026-03-14",
                "title": "宏觀展望：流動性週期與主權比特幣時代",
                "url": "../post/crypto-macro.html",
                "core_conclusion": "加密市場的牛熊週期本質上是全球宏觀流動性（Global M2）的「高貝塔放大器」。本專題揭示：① 美國聯準會資產負債表擴縮與實際利率對加密資產估值的決定性影響；② 比特幣減半週期與主權流動性潮汐的共振規律；③ 機構配置資金（現貨 ETF、401k 退休金）如何重塑加密資產的波動率特徵與下行保護邊界。",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "執行摘要-executive-summary",
                        "title": "執行摘要 (Executive Summary)",
                        "h3_details": []
                    },
                    {
                        "id": "第一部分-2026-年宏觀經濟景觀與流動性傳導",
                        "title": "第一部分：2026 年宏觀經濟景觀與流動性傳導",
                        "h3_details": []
                    },
                    {
                        "id": "第二部分-市場週期理論的重構",
                        "title": "第二部分：市場週期理論的重構",
                        "h3_details": []
                    },
                    {
                        "id": "第三部分-監管海嘯-重塑市場結構",
                        "title": "第三部分：監管海嘯——重塑市場結構",
                        "h3_details": []
                    },
                    {
                        "id": "第四部分-機構化時代的全面降臨",
                        "title": "第四部分：機構化時代的全面降臨",
                        "h3_details": []
                    },
                    {
                        "id": "第五部分-關鍵投資敘事與板塊分析",
                        "title": "第五部分：關鍵投資敘事與板塊分析",
                        "h3_details": []
                    },
                    {
                        "id": "第六部分-結論與戰略展望",
                        "title": "第六部分：結論與戰略展望",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-timeline",
                        "title": "歷史實證時間軸：流動性週期與監管實證紀錄",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "topic-btc-02-price-factors",
                "pillar": "btc",
                "badge": "方法指南",
                "date": "2026-03-14",
                "title": "比特幣價格因素曼陀羅 (Mandala)：8 大核心維度與 64 個關鍵指標深度展開",
                "url": "../post/crypto-btc-02-price-factors.html",
                "core_conclusion": "比特幣定價因子與微觀結構專題：深入剖析長期持有者 (LTH) 籌碼集中度、交易所非流動性供應變化、衍生品合約持倉量 (OI) 與資金費率，建立捕捉市場階段性見頂與築底拐點的高敏感度因子矩陣。",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "如何使用此圖表",
                        "title": "如何使用此圖表？",
                        "h3_details": []
                    },
                    {
                        "id": "empirical-timeline",
                        "title": "實證時間軸：定價因子與市場驗證",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "topic-btc-01-valuation-models",
                "pillar": "btc",
                "badge": "方法指南",
                "date": "2026-03-14",
                "title": "比特幣估值模型：從數位黃金到網路效應的多元維度分析",
                "url": "../post/crypto-btc-01-valuation-models.html",
                "core_conclusion": "比特幣估值模型專題：系統性解構 ① S2F 存量產量稀缺性模型；② 梅特卡夫網路效應與活躍地址估值；③ 能源生產成本底線定價法；④ 全球黃金市值可觸及市場 (TAM) 對標法。為投資者提供穿透短期價格波動的長週期內在價值錨點。",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "asset-analogy",
                        "title": "資產對標與市場份額法 Asset Analogy & TAM Allocation",
                        "h3_details": [
                            {
                                "id": "數位黃金對標-tam-allocation",
                                "title": "數位黃金對標 (TAM Allocation)"
                            },
                            {
                                "id": "全球法幣對沖模型-m2-hedge",
                                "title": "全球法幣對沖模型 (M2 Hedge)"
                            }
                        ]
                    },
                    {
                        "id": "network-effects",
                        "title": "網路效應模型 Network Effect Models",
                        "h3_details": [
                            {
                                "id": "梅特卡夫定律-metcalfe-s-law",
                                "title": "梅特卡夫定律 (Metcalfe's Law)"
                            },
                            {
                                "id": "nvt-比率-network-value-to-transactions",
                                "title": "NVT 比率 (Network Value to Transactions)"
                            }
                        ]
                    },
                    {
                        "id": "supply-side",
                        "title": "供給側與生產成本模型 Supply-Side & Production Costs",
                        "h3_details": [
                            {
                                "id": "庫存流量比模型-stock-to-flow-s2f",
                                "title": "庫存流量比模型 (Stock-to-Flow, S2F)"
                            },
                            {
                                "id": "邊際生產成本模型-production-cost-model",
                                "title": "邊際生產成本模型 (Production Cost Model)"
                            }
                        ]
                    },
                    {
                        "id": "on-chain-models",
                        "title": "鏈上數據與進階量化模型 On-chain Data & Advanced Quant",
                        "h3_details": [
                            {
                                "id": "mvrv-模型-market-value-to-realized-value",
                                "title": "MVRV 模型 (Market Value to Realized Value)"
                            },
                            {
                                "id": "比特幣冪律模型-bitcoin-power-law",
                                "title": "比特幣冪律模型 (Bitcoin Power Law)"
                            },
                            {
                                "id": "宏觀流動性模型-global-liquidity-proxy",
                                "title": "宏觀流動性模型 (Global Liquidity Proxy)"
                            }
                        ]
                    },
                    {
                        "id": "comparison-table",
                        "title": "綜合模型評估表 Model Comparison & Summary",
                        "h3_details": []
                    },
                    {
                        "id": "interactive-dashboard",
                        "title": "2026 實戰估值預測 Interactive Forecast Dashboard",
                        "h3_details": []
                    },
                    {
                        "id": "empirical-timeline",
                        "title": "實證時間軸：市場預測與週期驗證 Empirical Timeline & Case Studies",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "news-20260313-bitwise-1m",
                "pillar": "btc",
                "badge": "深度研報",
                "date": "2026-03-13",
                "title": "【Bitwise 預測比特幣衝擊百萬美元】- 機構資產配置如何引爆流動性海嘯？為何主權財富基金入場改變 S2F 供需曲線？解構 Matt Hougan 論點機制",
                "url": "../news/20260313-bitwise-1m.html",
                "core_conclusion": "本篇研究《【Bitwise 預測比特幣衝擊百萬美元 2026】- 機構資產配置如何引爆流動性海嘯？為何主權財富基金入場改變 S2F 供需曲線？解構 Matt Hougan 論點機制》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "section-1",
                        "title": "如何估算比特幣的價值 從靜態容器到動態市場的認知轉向",
                        "h3_details": [
                            {
                                "id": "sov-formula",
                                "title": "估算公式：價值儲存市場總規模 ÷ 2100 萬枚 = 隱含價格"
                            },
                            {
                                "id": "market-status",
                                "title": "當前市場現狀：比特幣僅佔市場份額不到 4%"
                            }
                        ]
                    },
                    {
                        "id": "section-2",
                        "title": "黃金簡史與市場擴張 為何無視市場整體增長是核心錯誤",
                        "h3_details": [
                            {
                                "id": "critical-error",
                                "title": "核心錯誤：無視價值儲存市場的整體增長"
                            },
                            {
                                "id": "projection",
                                "title": "預測推演：10 年後規模將達 121 兆美元"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "支撐百萬美元的現實基礎 ETF 效應與機構配置比例的閾值跨越",
                        "h3_details": [
                            {
                                "id": "etf-institutional",
                                "title": "ETF 效應與機構配置：主權與捐贈基金的入場"
                            },
                            {
                                "id": "config-ratio",
                                "title": "波動率下降與配置比例提升：從 1% 轉向 5%"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "可能出現的風險 宏觀逆轉與競爭替代的挑戰",
                        "h3_details": [
                            {
                                "id": "macro-risk",
                                "title": "宏觀環境變化：量化寬鬆不再與利率重啟"
                            },
                            {
                                "id": "substitution-risk",
                                "title": "份額擴張受阻與技術替代"
                            }
                        ]
                    },
                    {
                        "id": "文章分析",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "一-認可與驗證-原作者正確的推論",
                                "title": "一、認可與驗證：原作者正確的推論"
                            },
                            {
                                "id": "二-邏輯跳躍與論點瑕疵",
                                "title": "二、邏輯跳躍與論點瑕疵"
                            },
                            {
                                "id": "三-潛在偏誤分析-biases-analysis",
                                "title": "三、潛在偏誤分析（Biases Analysis）"
                            },
                            {
                                "id": "四-關鍵缺失-未觸及的核心問題",
                                "title": "四、關鍵缺失：未觸及的核心問題"
                            },
                            {
                                "id": "五-綜合評判",
                                "title": "五、綜合評判"
                            }
                        ]
                    },
                    {
                        "id": "mason-yang-observation",
                        "title": "Mason Yang 的觀察",
                        "h3_details": []
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "news-20260311-btc-oil-macro-matrix",
                "pillar": "btc",
                "badge": "深度研報",
                "date": "2026-03-11",
                "title": "【比特幣與石油的全變量宏觀矩陣】- 地緣戰略如何重塑大宗商品與加密資產連動關係？為何能源價格成為 BTC 底部定價錨點？解構宏觀避險傳導",
                "url": "../news/20260311-btc-oil-macro-matrix.html",
                "core_conclusion": "本篇研究《【比特幣與石油的全變量宏觀矩陣 2026】- 地緣戰略如何重塑大宗商品與加密資產連動關係？為何能源價格成為 BTC 底部定價錨點？解構宏觀避險傳導》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "section-1",
                        "title": "為什麼「線性鏈條」是危險的陷阱？",
                        "h3_details": [
                            {
                                "id": "time-lag",
                                "title": "時滯效應 (Time Lag)"
                            },
                            {
                                "id": "demand-destruction",
                                "title": "需求破壞 (Demand Destruction)"
                            },
                            {
                                "id": "narrative-shift",
                                "title": "敘事漂移 (Narrative Shift)"
                            }
                        ]
                    },
                    {
                        "id": "section-2",
                        "title": "重構：全變量思考矩陣",
                        "h3_details": [
                            {
                                "id": "energy-supply",
                                "title": "A. 能源供給"
                            },
                            {
                                "id": "inflation-transmission",
                                "title": "B. 通膨傳導"
                            },
                            {
                                "id": "policy-response",
                                "title": "C. 政策反應"
                            },
                            {
                                "id": "asset-response",
                                "title": "D. 資產反應"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "四大核心資產的聯動關係網",
                        "h3_details": [
                            {
                                "id": "選擇分析情境",
                                "title": "選擇分析情境"
                            },
                            {
                                "id": "宏觀資產聯動深度解析-四大核心資產的博弈邏輯",
                                "title": "宏觀資產聯動深度解析：四大核心資產的博弈邏輯"
                            },
                            {
                                "id": "scenario-1",
                                "title": "情境一：惡性通膨與法幣危機模式 (Hyperinflation / Fiat Crisis)"
                            },
                            {
                                "id": "scenario-2",
                                "title": "情境二：經典緊縮模式 (Classic Tightening)"
                            },
                            {
                                "id": "scenario-3",
                                "title": "情境三：衰退避險模式 (Recession / Risk-Off)"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "邏輯反轉：關係發生「逆位」的特殊情境 避險屬性的切換",
                        "h3_details": [
                            {
                                "id": "reverse-1",
                                "title": "1. 「石油美元」瓦解敘事 (De-dollarization Reversal)"
                            },
                            {
                                "id": "reverse-2",
                                "title": "2. 「數位黃金」覺醒 (Identity Shift Reversal)"
                            }
                        ]
                    },
                    {
                        "id": "section-5",
                        "title": "實戰判斷準則 Checklist 打破單一變量分析",
                        "h3_details": [
                            {
                                "id": "最終結論",
                                "title": "最終結論"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "topic-btc-03-macro-analysis",
                "pillar": "btc",
                "badge": "方法指南",
                "date": "2026-03-09",
                "title": "比特幣與宏觀經濟分析：CPI、M2、美債與聯準會 7 大指標深度解析",
                "url": "../post/crypto-btc-03-macro-analysis.html",
                "core_conclusion": "比特幣宏觀關聯性專題：全景解析比特幣與美債殖利率（特別是 30 年期長端利率）、美元指數 (DXY)、全球黃金儲備及地緣危機（如中東荷姆茲海峽戰略對沖）的動態相關性演變，驗證比特幣作為主權級抗通膨硬資產的配置邏輯。",
                "indicators": [
                    {
                        "label": "核心參數",
                        "value": "30 年"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "section-1",
                        "title": "U.S. CPI vs Bitcoin 通膨預期與抗通膨屬性",
                        "h3_details": [
                            {
                                "id": "影響鏈邏輯-cpi-聯準會政策-流動性-btc-定價",
                                "title": "影響鏈邏輯：CPI → 聯準會政策 → 流動性 → BTC 定價"
                            }
                        ]
                    },
                    {
                        "id": "section-2",
                        "title": "US Money Supply (M1) 即時流動性的引擎",
                        "h3_details": [
                            {
                                "id": "機制解析-m1-擴張如何為比特幣點火",
                                "title": "機制解析：M1 擴張如何為比特幣點火？"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "US Money Supply (M2) 宏觀水位的「生死線」",
                        "h3_details": [
                            {
                                "id": "m2-是比特幣牛熊週期的-宏觀背景板",
                                "title": "M2 是比特幣牛熊週期的「宏觀背景板」"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "美元貶值：法幣購買力的終局 為什麼比特幣是必要的存在",
                        "h3_details": [
                            {
                                "id": "機制解析-貨幣如何失去購買力",
                                "title": "機制解析：貨幣如何失去購買力？"
                            }
                        ]
                    },
                    {
                        "id": "section-5",
                        "title": "美債收益率 vs 比特幣 對標「無風險利率」的超額回報",
                        "h3_details": [
                            {
                                "id": "競爭邏輯-美債收益率如何-搶奪-比特幣的資金",
                                "title": "競爭邏輯：美債收益率如何「搶奪」比特幣的資金？"
                            }
                        ]
                    },
                    {
                        "id": "section-6",
                        "title": "30 年期房貸利率 vs 比特幣 貨幣政策傳導的終端指標",
                        "h3_details": [
                            {
                                "id": "為何房貸利率是比特幣的領先指標",
                                "title": "為何房貸利率是比特幣的領先指標？"
                            }
                        ]
                    },
                    {
                        "id": "section-7",
                        "title": "聯準會資產負債表 vs 比特幣 央行資產規模與市場水位的共振",
                        "h3_details": [
                            {
                                "id": "qe-與-qt-如何直接影響資產價格",
                                "title": "QE 與 QT：如何直接影響資產價格？"
                            }
                        ]
                    },
                    {
                        "id": "chapter-timeline",
                        "title": "歷史實證時間軸 全球流動性與利率傳導實證紀錄",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "topic-btc-04-sovereign-liquidity",
                "pillar": "btc",
                "badge": "方法指南",
                "date": "2026-03-05",
                "title": "五大鏈上指標共振：為什麼現在可能是比特幣的週期低點？",
                "url": "../post/crypto-btc-04-sovereign-liquidity.html",
                "core_conclusion": "比特幣主權流動性專題：深度探討各國央行、主權財富基金與美國聯邦/州級戰略儲備立法（如 BITCOIN Act）的進展。比特幣已跨越純民間資產階段，成為主權國家博弈去美元化與全球儲備多元化的戰略博弈工具。",
                "indicators": [
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "section-1",
                        "title": "Bitcoin Investor Tool 觸底綠線的歷史機遇",
                        "h3_details": []
                    },
                    {
                        "id": "section-2",
                        "title": "MVRV Z-Score 距離泡沫狂熱仍有遙遠距離",
                        "h3_details": []
                    },
                    {
                        "id": "section-3",
                        "title": "Power Law 通道 緊貼紅色絕對支撐線",
                        "h3_details": []
                    },
                    {
                        "id": "section-4",
                        "title": "月線 RSI 動能指標 歷史級別的超賣冷卻區",
                        "h3_details": []
                    },
                    {
                        "id": "section-5",
                        "title": "比特幣彩虹圖 價格落入「深藍色」極度低估區",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "why-crypto",
                "pillar": "l1-infra",
                "badge": "方法指南",
                "date": "2025-10-14",
                "title": "Why Crypto？一份關於數位資產所有權的深度心理學分析",
                "url": "../post/crypto-why.html",
                "core_conclusion": "為什麼在 2026 年必須配置加密資產？從行為金融學與貨幣史來看，全球法幣體系正處於「主權債務擴張與實質購買力稀釋」的長週期轉折。比特幣作為具備嚴格 2,100 萬顆硬頂上限的「數位黃金」，為投資者提供了超越傳統金融體系對手方風險的「終極所有權與自託管主權」，是非對稱博弈下對沖全球流動性貶值的核心基石。",
                "indicators": [
                    {
                        "label": "關鍵規模",
                        "value": "2,100 萬"
                    },
                    {
                        "label": "核心參數",
                        "value": "2026 年"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "section-1",
                        "title": "傳統金融的挑戰 我們為何需要新的選擇？",
                        "h3_details": [
                            {
                                "id": "挑戰一-持續的貨幣貶值-通貨膨脹",
                                "title": "挑戰一：持續的貨幣貶值 (通貨膨脹)"
                            },
                            {
                                "id": "挑戰二-中心化的權力與審查風險",
                                "title": "挑戰二：中心化的權力與審查風險"
                            },
                            {
                                "id": "挑戰三-緩慢且昂貴的系統",
                                "title": "挑戰三：緩慢且昂貴的系統"
                            }
                        ]
                    },
                    {
                        "id": "section-2",
                        "title": "使用者原型概覽 動機矩陣與量化比較",
                        "h3_details": [
                            {
                                "id": "使用者動機綜合矩陣",
                                "title": "使用者動機綜合矩陣"
                            },
                            {
                                "id": "主流資產風險回報特徵比較-量化分析",
                                "title": "主流資產風險回報特徵比較 (量化分析)"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "動機的演進 從意識形態到全球現象",
                        "h3_details": [
                            {
                                "id": "最初的火種-密碼龐克理想",
                                "title": "最初的火種：密碼龐克理想"
                            },
                            {
                                "id": "轉向金融化-從支付工具到投機資產",
                                "title": "轉向金融化：從支付工具到投機資產"
                            },
                            {
                                "id": "現代的馬賽克-多元動機的共存",
                                "title": "現代的馬賽克：多元動機的共存"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "散戶投資者分析 人口統計與 S 曲線採用",
                        "h3_details": [
                            {
                                "id": "人口統計學深度剖析",
                                "title": "人口統計學深度剖析"
                            },
                            {
                                "id": "核心驅動力分析",
                                "title": "核心驅動力分析"
                            }
                        ]
                    },
                    {
                        "id": "section-5",
                        "title": "務實使用者 作為經濟生命線的加密貨幣",
                        "h3_details": [
                            {
                                "id": "通膨對沖的爭議",
                                "title": "通膨對沖的爭議"
                            },
                            {
                                "id": "新興經濟體的必要性",
                                "title": "新興經濟體的必要性"
                            }
                        ]
                    },
                    {
                        "id": "section-6",
                        "title": "生態系參與者 建設者、創造者與收藏家",
                        "h3_details": [
                            {
                                "id": "web3-建設者-被新數位意識形態所驅動",
                                "title": "Web3 建設者：被新數位意識形態所驅動"
                            },
                            {
                                "id": "數位收藏家-nft-所有權的心理學",
                                "title": "數位收藏家：NFT 所有權的心理學"
                            }
                        ]
                    },
                    {
                        "id": "section-7",
                        "title": "綜合分析與總結 Mason Yang Blog 深度洞察",
                        "h3_details": []
                    }
                ]
            }
        ]
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TOPIC_CRYPTO_COT_DATA;
    } else {
        root.TOPIC_CRYPTO_COT_DATA = TOPIC_CRYPTO_COT_DATA;
    }
})(typeof window !== 'undefined' ? window : this);
