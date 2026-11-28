/**
 * assets/js/topics/topic-ai-cot-data.js
 * 專題知識階層樹與思考鏈核心資料庫 (Data SSOT)
 * 由 tools/sync_topic_cot.py 自動同步編譯，嚴禁破壞 JSON 結構。
 */
(function (root) {
    const TOPIC_AI_COT_DATA = {
        "topic": "topic-ai",
        "title": "AI 全景：算力、基建與工程",
        "generated_at": "2026-11-28",
        "pillars": [
            {
                "id": "all",
                "label": "全部研報",
                "short": "ALL"
            },
            {
                "id": "silicon",
                "label": "I. 矽基與晶片",
                "short": "SILICON"
            },
            {
                "id": "power",
                "label": "II. 電力與礦企",
                "short": "POWER & MINERS"
            },
            {
                "id": "capital",
                "label": "III. 資本週期",
                "short": "CAPITAL CYCLE"
            },
            {
                "id": "agent",
                "label": "IV. Agent 工程",
                "short": "AGENT OPS"
            }
        ],
        "macro_ledger": [
            {
                "id": "metric-pjm-capacity",
                "name": "PJM 容量電價上限",
                "current": "$333.44 / MW-day",
                "baseline": "變壓器交期 128 週",
                "status": "triggered",
                "note": "雲商已累計簽署 13 筆核能合約（共 9.8 GW）",
                "updated_at": "2026-11-27",
                "source_url": "../news/20260906-ai-compute-asset-pricing-power-physics.html"
            },
            {
                "id": "metric-btc-hashprice",
                "name": "比特幣全網 Hashprice",
                "current": "< $28 / PH/s/Day",
                "baseline": "挖礦利潤探歷史新低",
                "status": "triggered",
                "note": "加速礦企電力資產轉型 AI HPC",
                "updated_at": "2026-11-27",
                "source_url": "../news/20260801-crypto-miners-ai-transition-institutional-analysis.html"
            },
            {
                "id": "metric-capex-gap",
                "name": "前沿 AI 營收缺口",
                "current": "$276B 應用年營收",
                "baseline": "對應五大雲商 $805B CapEx",
                "status": "triggered",
                "note": "資本開支囚徒困境迫使巨頭檢視投資回報",
                "updated_at": "2026-11-25",
                "source_url": "../news/20260913-frontier-ai-capital-cycle.html"
            },
            {
                "id": "metric-x402-settlement",
                "name": "x402 機器支付結算",
                "current": "$4,200 萬+ (1.96 億筆)",
                "baseline": "99%+ 以 USDC 結算",
                "status": "normal",
                "note": "消費端 AI 導流佔 5.46%，電商 Agent 結帳佔比達 1.52%",
                "updated_at": "2026-11-27",
                "source_url": "../news/20261123-agentic-commerce-endgame-protocols-valuation.html"
            }
        ],
        "concepts": [
            {
                "id": "asc-360",
                "code": "ACCOUNTING",
                "title": "ASC 360 資產減損",
                "desc": "美國會計準則中針對長期重資產的可回收性測試。當 AI 資料中心因電網延遲或算力租金暴跌導致預期現金流低於帳面價值時，須強制提列鉅額一次性資產減損。",
                "threshold": "關鍵臨界點：H100 叢集稼動率 < 70% 或 Time-to-Power 延遲 > 6 個月",
                "url": ""
            },
            {
                "id": "time-to-power",
                "code": "INFRASTRUCTURE",
                "title": "Time-to-Power 併網時間差",
                "desc": "從訂購 GPU 硬體到資料中心實際獲得公用事業電網高壓供電之間的時間落差。已擁有併網許可的北美比特幣礦企可將超大型雲端商的部署週期縮短高達 75%。",
                "threshold": "實體瓶頸：北美 PJM / ERCOT 電網併網排隊 3–5 年，500kV 變壓器交期 160 週",
                "url": ""
            },
            {
                "id": "ppa-cliff",
                "code": "ENERGY",
                "title": "PPA 電力懸崖",
                "desc": "資料中心或礦企原先簽署的低價長期購電協議（Power Purchase Agreement）到期後，面臨現貨電價暴漲與無碳核電溢價搶購的毛利擠壓風險。",
                "threshold": "估值核心：Take-or-Pay 長約覆蓋率與單位 EV/MW 電力折價",
                "url": ""
            },
            {
                "id": "mfu-moat",
                "code": "COMPUTE",
                "title": "MFU 50% 算力護城河",
                "desc": "模型浮點運算利用率（Model FLOPs Utilization），衡量 GPU 叢集實際有效算力佔理論峰值的比例。分散式廣域網算力常因延遲崩塌至 3–8%，唯有頂級液冷與網路拓撲能突破 50%。",
                "threshold": "效率分水嶺：頂級叢集 MFU ≥ 50% vs 劣質分散式算力 3–8%",
                "url": ""
            },
            {
                "id": "fsm-harness",
                "code": "AGENT OPS",
                "title": "FSM 有限狀態機與 Skills 路由",
                "desc": "生產級 AI Agent 的核心工程防線：利用有限狀態機嚴格約束狀態流轉，搭配 Skills 按需掛載與 AST 骨架脫水防火牆，徹底消滅百萬上下文幻覺與 Token 浪費。",
                "threshold": "實測成效：Token 消耗節省 95.7%，工程驗證通過率 100%",
                "url": ""
            }
        ],
        "articles": [
            {
                "id": "ai-compute-infrastructure-guide",
                "pillar": "power",
                "badge": "方法指南",
                "date": "2026-11-24",
                "title": "【核心機制】AI 算力基礎設施投資框架 - 電力併網瓶頸、TCO 折舊模型與資本週期實戰指南",
                "url": "../post/ai-compute-infrastructure-guide.html",
                "core_conclusion": "核心架構摘要 (Executive Summary) 物理瓶頸轉移：全天候推論取代週期性訓練，擴張上限取決於電網併網排隊與 500kV 變壓器 160 週交期，具備確定性電力（Powered Shell）之營運商掌握定價權。 稼動率與折舊死線：以 1,024 卡 H100 叢集測算，70% 稼動率為損益平衡分水嶺；激進拉長會計折舊至 5 年將在世代交替期觸…",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "70%"
                    },
                    {
                        "label": "核心參數",
                        "value": "500kV"
                    },
                    {
                        "label": "核心參數",
                        "value": "160 週"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0-summary",
                        "title": "執行摘要 AI 算力基礎設施 5W1H 認知架構",
                        "h3_details": [
                            {
                                "id": "section-5w1h-core",
                                "title": "5W1H 深度邏輯總結"
                            }
                        ]
                    },
                    {
                        "id": "chapter-1",
                        "title": "物理約束 從晶片稀缺轉向電力併網與 Time-to-Power 瓶頸",
                        "h3_details": [
                            {
                                "id": "section-1-1",
                                "title": "1.1 負載範式轉移：推論公用事業化與機櫃功率躍遷"
                            },
                            {
                                "id": "section-1-2",
                                "title": "1.2 Time-to-Power 天花板：500kV 變壓器交期與電力併網壁壘"
                            }
                        ]
                    },
                    {
                        "id": "chapter-2",
                        "title": "商業與財務模型 電力託管 vs. Neocloud 與 70% 稼動率死線",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "2.1 兩種主流商業模式對比與量化營收公式"
                            },
                            {
                                "id": "section-2-2",
                                "title": "2.2 1,024 卡 H100 TCO 模型：70% 稼動率死線與 ASC 360 減損陷阱"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "資本週期與融資風險 七千億 CapEx 賽局、GPU 抵押債與傳導隔離",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "3.1 FOMO CapEx 囚徒困境與六千億美元營收缺口"
                            },
                            {
                                "id": "section-3-2",
                                "title": "3.2 算力金融化：GPU 抵押債、SPV 隔離與供應鏈傳導"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "物理邊緣崛起 都市微算力四大漏斗、單元經濟與寄生拓撲",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "4.1 驅動算力下沉的四大物理漏斗"
                            },
                            {
                                "id": "section-4-2",
                                "title": "4.2 單元經濟模型與既有基礎設施寄生策略"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "實證時間軸 賽道關鍵事件演進與邊界檢驗 (Empirical Timeline)",
                        "h3_details": []
                    },
                    {
                        "id": "article-analysis-header",
                        "title": "文章分析 三層穿透推論鏈與敘事邊界校驗",
                        "h3_details": [
                            {
                                "id": "article-inference-logic",
                                "title": "01 文章推論邏輯分析"
                            },
                            {
                                "id": "logic-blindspots",
                                "title": "02 敘事邊界與關鍵變數補充"
                            }
                        ]
                    },
                    {
                        "id": "mason-yang-observation",
                        "title": "Mason Yang 的觀察 Actionable Intelligence 決策模型與配置準則",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "agentic-commerce-macro-trends",
                "pillar": "agent",
                "badge": "方法指南",
                "date": "2026-11-24",
                "title": "【AI 電商大趨勢】- 代理商務如何重塑人類眼球經濟？為何 Stripe 數據暴增 80 倍？解構四層協議與啞鈴型品牌宿命",
                "url": "../post/agentic-commerce-macro-trends.html",
                "core_conclusion": "報告核心摘要 (Executive Summary) 品類滲透分界：機票旅遊（43%）與 3C 家電（22.9%）等高痛點標準品率先被 AI 接管，服飾珠寶（13.7%）與生鮮（3.9%）仍由人類情緒主導。 流量與協議重構：焦慮介面與站內廣告全面失效，商業轉向 AEO 演算法審計與 MCP/ACP/AP2/x402 四層新網路憲法及法幣/USDC 雙軌結算…",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "43%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "22.9%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "13.7%"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": []
                    },
                    {
                        "id": "趨勢一-品類滲透路線明朗-高痛點標準品-率先淪陷-情緒非標品-成最後防線",
                        "title": "趨勢一：品類滲透路線明朗「高痛點標準品」率先淪陷，「情緒非標品」成最後防線",
                        "h3_details": [
                            {
                                "id": "1-第一波全面被接管的領域-ai-絕對主場",
                                "title": "1. 第一波全面被接管的領域（AI 絕對主場）"
                            },
                            {
                                "id": "2-短期內仍由人類主導的防線",
                                "title": "2. 短期內仍由人類主導的防線"
                            }
                        ]
                    },
                    {
                        "id": "趨勢二-行銷與流量邏輯翻轉-從-討好人類眼球-seo-廣告-轉向-通過演算法審計-aeo",
                        "title": "趨勢二：行銷與流量邏輯翻轉從「討好人類眼球（SEO/廣告）」轉向「通過演算法審計（AEO）」",
                        "h3_details": []
                    },
                    {
                        "id": "趨勢三-巨頭版圖大洗牌-中心化圍牆花園-對決-去中心化開放聯盟",
                        "title": "趨勢三：巨頭版圖大洗牌「中心化圍牆花園」對決「去中心化開放聯盟」",
                        "h3_details": []
                    },
                    {
                        "id": "趨勢四-底層基建定型-新網路憲法-四層協議與支付雙軌制",
                        "title": "趨勢四：底層基建定型「新網路憲法」四層協議與支付雙軌制",
                        "h3_details": [
                            {
                                "id": "1-代理商務四層協議堆疊",
                                "title": "1. 代理商務四層協議堆疊"
                            },
                            {
                                "id": "2-支付系統進入-雙軌制-終局",
                                "title": "2. 支付系統進入「雙軌制」終局"
                            }
                        ]
                    },
                    {
                        "id": "趨勢五-商業模式劇烈-變形-五大新物種誕生與品牌的-啞鈴型-宿命",
                        "title": "趨勢五：商業模式劇烈「變形」五大新物種誕生與品牌的「啞鈴型」宿命",
                        "h3_details": [
                            {
                                "id": "1-消費品牌的-啞鈴型極端分裂-the-barbell-split",
                                "title": "1. 消費品牌的「啞鈴型極端分裂（The Barbell Split）」"
                            },
                            {
                                "id": "2-定價機制反轉-a2a-私密反向拍賣與-ai-蜂群團購",
                                "title": "2. 定價機制反轉：A2A 私密反向拍賣與「AI 蜂群團購」"
                            },
                            {
                                "id": "3-導購邏輯翻轉-買方受託人-與省錢分潤制",
                                "title": "3. 導購邏輯翻轉：「買方受託人」與省錢分潤制"
                            },
                            {
                                "id": "4-內容與軟體的-原子化按次收費",
                                "title": "4. 內容與軟體的「原子化按次收費」"
                            },
                            {
                                "id": "5-金融基建升級-kya-生息代理錢包與-ai-責任險",
                                "title": "5. 金融基建升級：KYA、生息代理錢包與 AI 責任險"
                            }
                        ]
                    },
                    {
                        "id": "趨勢六-演進路線圖-資本重估與實戰行動指南",
                        "title": "趨勢六演進路線圖、資本重估與實戰行動指南",
                        "h3_details": [
                            {
                                "id": "1-ai-電商三階段演進時間軸",
                                "title": "1. AI 電商三階段演進時間軸"
                            },
                            {
                                "id": "2-資本市場四梯隊重估視角",
                                "title": "2. 資本市場四梯隊重估視角"
                            },
                            {
                                "id": "3-給三類決策者的立即行動檢核表",
                                "title": "3. 給三類決策者的立即行動檢核表"
                            }
                        ]
                    },
                    {
                        "id": "結語-去偽存真的商業大重啟",
                        "title": "結語去偽存真的商業大重啟",
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
                "id": "agentic-commerce-business-models",
                "pillar": "agent",
                "badge": "方法指南",
                "date": "2026-11-24",
                "title": "【代理商務商業模式】- 新網路憲法如何改寫交易與定價？為何中階品牌面臨出清？解構六大新物種與四維變形檢核表",
                "url": "../post/agentic-commerce-business-models.html",
                "core_conclusion": "報告核心摘要 (Executive Summary) 五大底層假設改寫：計價從時間打包轉向原子化按次結果，定價從賣方掛牌轉向 A2A 雙邊博弈，資安從成本中心變形為數據印鈔機。 六大商業新物種：按次知識收費站、地下私密反向拍賣與蜂群團購、買方省錢分潤代理、啞鈴品牌分裂、生息代理金庫與 KYA、數據出口海關。 四維變形診斷法：企業與投資人須以摩擦依賴、顆粒度…",
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
                        "h3_details": []
                    },
                    {
                        "id": "一-思考起點-商業模式底層邏輯的-五大結構性變更",
                        "title": "一、思考起點商業模式底層邏輯的「五大結構性變更」",
                        "h3_details": []
                    },
                    {
                        "id": "二-六大商業模式-變形-深度推演",
                        "title": "二、六大商業模式「變形」深度推演",
                        "h3_details": [
                            {
                                "id": "變形一-內容與軟體業-從-付費牆與席位訂閱-rightarrow-原子化按次計費-micro-toll-economy",
                                "title": "變形一：【內容與軟體業】從「付費牆與席位訂閱」$\\rightarrow$「原子化按次計費（Micro-Toll Economy）」"
                            },
                            {
                                "id": "變形二-交易與定價機制-從-賣方單向掛牌-rightarrow-a2a-反向拍賣與蜂群團購-reverse-auctions-agent-swarms",
                                "title": "變形二：【交易與定價機制】從「賣方單向掛牌」$\\rightarrow$「A2A 反向拍賣與蜂群團購（Reverse Auctions & Agent Swarms）」"
                            },
                            {
                                "id": "變形三-仲介與導購業-從-賣方回扣聯盟-rightarrow-買方受託人與省錢分潤制-fiduciary-gain-sharing",
                                "title": "變形三：【仲介與導購業】從「賣方回扣聯盟」$\\rightarrow$「買方受託人與省錢分潤制（Fiduciary Gain-Sharing）」"
                            },
                            {
                                "id": "變形四-品牌與零售業-中階品牌大滅絕-演化為-極端啞鈴型分裂-the-barbell-split",
                                "title": "變形四：【品牌與零售業】中階品牌大滅絕，演化為「極端啞鈴型分裂（The Barbell Split）」"
                            },
                            {
                                "id": "變形五-金融科技與支付業-從-刷卡通道-rightarrow-可程式化資金流與-ai-責任險",
                                "title": "變形五：【金融科技與支付業】從「刷卡通道」$\\rightarrow$「可程式化資金流與 AI 責任險」"
                            },
                            {
                                "id": "變形六-網路安全與數據業-從-防禦成本中心-rightarrow-api-流量交易所與數據印鈔機",
                                "title": "變形六：【網路安全與數據業】從「防禦成本中心」$\\rightarrow$「API 流量交易所與數據印鈔機」"
                            }
                        ]
                    },
                    {
                        "id": "三-演進時間軸-商業模式變形的三個階段",
                        "title": "三、演進時間軸商業模式變形的三個階段",
                        "h3_details": []
                    },
                    {
                        "id": "四-實戰思考框架-如何診斷並設計你的-模式變形",
                        "title": "四、實戰思考框架如何診斷並設計你的「模式變形」？",
                        "h3_details": []
                    },
                    {
                        "id": "結語-商業的本質未變-但-客戶的物種-變了",
                        "title": "結語商業的本質未變，但「客戶的物種」變了",
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
                "id": "20261124-walmart-agentic-commerce-gateway",
                "pillar": "agent",
                "badge": "深度研報",
                "date": "2026-11-24",
                "title": "【代理商務與沃爾瑪戰略】 - AI 導購如何讓購物籃暴增 40%？為何沃爾瑪敢開窗而亞馬遜築牆？解構 Sparky、Agent Gateway 與 AIO 生死線",
                "url": "../news/20261124-walmart-agentic-commerce-gateway.html",
                "core_conclusion": "沃爾瑪以 Sparky 情境式打包推升平均購物籃規模大出 40%、使用量年增 129%，並透過 MCP 架構的 Agent Gateway 與 Agent Profiles 實現「受控開放」，在接軌外部 AI 代理流量的同時守住推薦權與支付主權。",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "40%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "129%"
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
                        "id": "一-破除市場最大迷思-為什麼-ai-導購沒有縮小客單價-反而讓購物籃暴增-40",
                        "title": "一、破除市場最大迷思為什麼 AI 導購沒有縮小客單價，反而讓購物籃暴增 40%？",
                        "h3_details": []
                    },
                    {
                        "id": "二-戰略神來之筆-拆解-walmart-agent-gateway-的-受控開放-架構",
                        "title": "二、戰略神來之筆拆解 Walmart Agent Gateway 的「受控開放」架構",
                        "h3_details": [
                            {
                                "id": "1-擁抱-mcp-開放標準-但牢牢鎖住-商品大腦",
                                "title": "1. 擁抱 MCP 開放標準，但牢牢鎖住「商品大腦」"
                            },
                            {
                                "id": "2-代理檔案-agent-profiles-鎖死客戶與支付主權",
                                "title": "2.「代理檔案（Agent Profiles）」鎖死客戶與支付主權"
                            }
                        ]
                    },
                    {
                        "id": "三-為什麼沃爾瑪敢-開窗-而亞馬遜只能-築牆",
                        "title": "三、為什麼沃爾瑪敢「開窗」，而亞馬遜只能「築牆」？",
                        "h3_details": []
                    },
                    {
                        "id": "四-品牌商的生死存亡戰-從-滾動貨架-seo-全面進入-零滾動推薦-aio",
                        "title": "四、品牌商的生死存亡戰從「滾動貨架（SEO）」全面進入「零滾動推薦（AIO）」",
                        "h3_details": [
                            {
                                "id": "1-從-前十名有飯吃-變成-零滾動的贏者全拿",
                                "title": "1. 從「前十名有飯吃」變成「零滾動的贏者全拿」"
                            },
                            {
                                "id": "2-拆解-sparky-的推薦權重黑盒",
                                "title": "2. 拆解 Sparky 的推薦權重黑盒"
                            },
                            {
                                "id": "3-暗流湧動-sparky-對話式廣告的-信任走鋼索",
                                "title": "3. 暗流湧動：Sparky 對話式廣告的「信任走鋼索」"
                            }
                        ]
                    },
                    {
                        "id": "五-給零售業與品牌經營者的三堂實戰必修課",
                        "title": "五、給零售業與品牌經營者的三堂實戰必修課",
                        "h3_details": []
                    },
                    {
                        "id": "結語-實體零售巨人的逆襲時刻",
                        "title": "結語實體零售巨人的逆襲時刻",
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
                "id": "20261123-agentic-commerce-stripe-ota",
                "pillar": "agent",
                "badge": "深度研報",
                "date": "2026-11-23",
                "title": "【代理商務與 Stripe 結算】 - AI 代理人如何碾碎 OTA 霸權？為何 80 倍成長直擊旅遊與零售？解構 43% 交易佔比與 MCP 直連協議",
                "url": "../news/20261123-agentic-commerce-stripe-ota.html",
                "core_conclusion": "Stripe 實證結算數據顯示 AI 代理日均交易額兩個月暴增至基準 7,982%，旅遊業吸納 43% 交易量成為重組震央。當 AI 透過 API 與 MCP 直連底層庫存，傳統 OTA 的注意力收費站與高抽成護城河正加速瓦解。",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "43%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "7,982%"
                    },
                    {
                        "label": "核心參數",
                        "value": "80 倍"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": []
                    },
                    {
                        "id": "一-數據背後的三大訊號-為什麼-80-倍成長-只是二階加速度的起點",
                        "title": "一、數據背後的三大訊號為什麼「80 倍成長」只是二階加速度的起點？",
                        "h3_details": [
                            {
                                "id": "1-跨越-信任鴻溝-後的單調遞增成癮性",
                                "title": "1. 跨越「信任鴻溝」後的單調遞增成癮性"
                            },
                            {
                                "id": "2-ai-精準收割-高痛苦度-高規格化-的標準化品類",
                                "title": "2. AI 精準收割「高痛苦度、高規格化」的標準化品類"
                            },
                            {
                                "id": "3-非標品-與-情緒消費-暫時構築防禦緩衝",
                                "title": "3.「非標品」與「情緒消費」暫時構築防禦緩衝"
                            }
                        ]
                    },
                    {
                        "id": "二-舊秩序的崩塌-ai-代理人如何抽乾-權力收費站",
                        "title": "二、舊秩序的崩塌AI 代理人如何抽乾「權力收費站」？",
                        "h3_details": []
                    },
                    {
                        "id": "三-震央實戰拆解-expedia-booking-com-與-airbnb-的脆弱度光譜",
                        "title": "三、震央實戰拆解Expedia、Booking.com 與 Airbnb 的脆弱度光譜",
                        "h3_details": [
                            {
                                "id": "1-expedia-expe-死於-標準化庫存-與-打包摩擦-的瓦解",
                                "title": "1. Expedia (EXPE)：死於「標準化庫存」與「打包摩擦」的瓦解"
                            },
                            {
                                "id": "2-booking-com-bkng-死於-注意力套利-與獲客成本的雙重夾殺",
                                "title": "2. Booking.com (BKNG)：死於「注意力套利」與獲客成本的雙重夾殺"
                            },
                            {
                                "id": "3-airbnb-abnb-防線最厚-但難逃估值與抽成率壓縮",
                                "title": "3. Airbnb (ABNB)：防線最厚，但難逃估值與抽成率壓縮"
                            }
                        ]
                    },
                    {
                        "id": "四-從旅遊業外溢至全電商-標準化商品的集體洗牌",
                        "title": "四、從旅遊業外溢至全電商標準化商品的集體洗牌",
                        "h3_details": []
                    },
                    {
                        "id": "五-權力重組-代理商務時代的-輸家-與-新贏家",
                        "title": "五、權力重組代理商務時代的「輸家」與「新贏家」",
                        "h3_details": []
                    },
                    {
                        "id": "結語-給企業經營者與投資人的關鍵提問",
                        "title": "結語給企業經營者與投資人的關鍵提問",
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
                "id": "20261123-agentic-commerce-retail-amazon-shopify",
                "pillar": "agent",
                "badge": "深度研報",
                "date": "2026-11-23",
                "title": "【代理商務與零售版圖】 - AI 代理人如何抽乾 Amazon 廣告印鈔機？為何 Shopify 開放生態反成最大軍火商？解構 34% 零售佔比、FBA 物理壁壘與零忠誠度重定價",
                "url": "../news/20261123-agentic-commerce-retail-amazon-shopify.html",
                "core_conclusion": "AI 代理人接管零售業（佔整體代理商務消費 34%），正在將商業定價權從「站內搜尋與 15%-25% 廣告稅」強行剝離，重新分配給掌握開放結算協議的 Shopify/Stripe 軍火商，以及擁有最後一哩路物理履約壁壘的 Amazon FBA 與 Walmart 實體節點。",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "34%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "15%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "25%"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": []
                    },
                    {
                        "id": "一-零售數據的深層解碼-ai-正在從哪裡切開零售帝國的防線",
                        "title": "一、零售數據的深層解碼AI 正在從哪裡切開零售帝國的防線？",
                        "h3_details": [
                            {
                                "id": "家居-電子與家電領銜突破-22-9-標準化防線",
                                "title": "家居、電子與家電領銜突破 22.9% 標準化防線"
                            },
                            {
                                "id": "日常剛需品類合計-40-9-進入無感自動補貨迴圈",
                                "title": "日常剛需品類合計 40.9% 進入無感自動補貨迴圈"
                            },
                            {
                                "id": "服飾珠寶-13-7-與生鮮-3-9-暫時構築多巴胺與物理防線",
                                "title": "服飾珠寶 13.7% 與生鮮 3.9% 暫時構築多巴胺與物理防線"
                            }
                        ]
                    },
                    {
                        "id": "二-零售巨頭商業模式大對決-誰的護城河正在被抽乾",
                        "title": "二、零售巨頭商業模式大對決誰的護城河正在被抽乾？",
                        "h3_details": []
                    },
                    {
                        "id": "三-深度拆解-四大勢力的生死攻防與三層穿透",
                        "title": "三、深度拆解四大勢力的生死攻防與三層穿透",
                        "h3_details": [
                            {
                                "id": "amazon-面臨-500b-廣告印鈔機拆彈與-fba-物理防禦",
                                "title": "Amazon 面臨 $500B+ 廣告印鈔機拆彈與 FBA 物理防禦"
                            },
                            {
                                "id": "shopify-攜手-stripe-link-打通百萬獨立站的開放軍火庫",
                                "title": "Shopify 攜手 Stripe Link 打通百萬獨立站的開放軍火庫"
                            },
                            {
                                "id": "walmart-與-target-憑藉-10-英里物理半徑鎖定近場履約租金",
                                "title": "Walmart 與 Target 憑藉 10 英里物理半徑鎖定近場履約租金"
                            },
                            {
                                "id": "google-與-meta-面臨意圖搜尋萎縮與情緒消費退守的雙重分化",
                                "title": "Google 與 Meta 面臨意圖搜尋萎縮與情緒消費退守的雙重分化"
                            }
                        ]
                    },
                    {
                        "id": "四-二階與三階推演-零售價值鏈的三場結構性地震",
                        "title": "四、二階與三階推演零售價值鏈的三場結構性地震",
                        "h3_details": [
                            {
                                "id": "零售媒體網路-rmn-泡沫化與廣告預算轉向直接讓利",
                                "title": "零售媒體網路（RMN）泡沫化與廣告預算轉向直接讓利"
                            },
                            {
                                "id": "日用消費品-cpg-邁向零品牌忠誠度與成分表定價時代",
                                "title": "日用消費品（CPG）邁向零品牌忠誠度與成分表定價時代"
                            },
                            {
                                "id": "物理節點租金取代位元流量成為最終定價護城河",
                                "title": "物理節點租金取代位元流量成為最終定價護城河"
                            }
                        ]
                    },
                    {
                        "id": "五-敘事邊界與紅隊證偽-反共識變數的壓力測試",
                        "title": "五、敘事邊界與紅隊證偽反共識變數的壓力測試",
                        "h3_details": []
                    },
                    {
                        "id": "六-mason-決策模型-actionable-intelligence",
                        "title": "六、Mason 決策模型（Actionable Intelligence）",
                        "h3_details": []
                    },
                    {
                        "id": "結語-從討好人類眼球到通過演算法審計",
                        "title": "結語從討好人類眼球到通過演算法審計",
                        "h3_details": [
                            {
                                "id": "實體消歧與檢索摘要卡-entity-disambiguation-rag-card",
                                "title": "實體消歧與檢索摘要卡 (Entity Disambiguation & RAG Card)"
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
                "id": "20261123-agentic-commerce-endgame-protocols-valuation",
                "pillar": "agent",
                "badge": "深度研報",
                "date": "2026-11-23",
                "title": "【代理商務終局篇】 - 協議戰爭如何重寫網路憲法？誰能對非人類經濟體徵收終極過路費？解構四層協議、雙軌結算與資本重估地圖",
                "url": "../news/20261123-agentic-commerce-endgame-protocols-valuation.html",
                "core_conclusion": "當全球機器流量超越人類流量，代理商務的終極利潤池正從前端流量廣告稅，系統性移轉至定義四層開放協議的底層清算所（Stripe、Visa/Mastercard、x402/USDC）、邊緣網路海關（Cloudflare）與實體物理履約王者。",
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
                        "h3_details": []
                    },
                    {
                        "id": "一-2026-年的新網路憲法-拆解-代理商務四層協議堆疊",
                        "title": "一、2026 年的新網路憲法拆解「代理商務四層協議堆疊」",
                        "h3_details": []
                    },
                    {
                        "id": "二-支付雙軌制的融合-stripe-傳統卡組織與穩定幣的終極卡位",
                        "title": "二、支付雙軌制的融合Stripe、傳統卡組織與穩定幣的終極卡位",
                        "h3_details": [
                            {
                                "id": "stripe-構築-link-agent-wallet-與-spt-的全棧霸權",
                                "title": "Stripe 構築 Link Agent Wallet 與 SPT 的全棧霸權"
                            },
                            {
                                "id": "visa-與-mastercard-轉向-top-of-model-預設軌道防禦戰",
                                "title": "Visa 與 Mastercard 轉向 Top of Model 預設軌道防禦戰"
                            },
                            {
                                "id": "穩定幣與-x402-協議突破微支付熱力學底線",
                                "title": "穩定幣與 x402 協議突破微支付熱力學底線"
                            }
                        ]
                    },
                    {
                        "id": "三-ai-模型入口的變現死結-受託人-與-廣告商-的靈魂拉扯",
                        "title": "三、AI 模型入口的變現死結「受託人」與「廣告商」的靈魂拉扯",
                        "h3_details": []
                    },
                    {
                        "id": "四-被低估的網路海關-cloudflare-與-機器流量收費站-的崛起",
                        "title": "四、被低估的網路海關Cloudflare 與「機器流量收費站」的崛起",
                        "h3_details": []
                    },
                    {
                        "id": "五-資本市場終局推演-代理商務時代的投資標的與估值重估地圖",
                        "title": "五、資本市場終局推演代理商務時代的投資標的與估值重估地圖",
                        "h3_details": []
                    },
                    {
                        "id": "六-敘事邊界與紅隊證偽-對市場四大極端共識的壓力測試",
                        "title": "六、敘事邊界與紅隊證偽對市場四大極端共識的壓力測試",
                        "h3_details": []
                    },
                    {
                        "id": "七-mason-決策模型-actionable-intelligence",
                        "title": "七、Mason 決策模型（Actionable Intelligence）",
                        "h3_details": []
                    },
                    {
                        "id": "結語-寫給-2026-年之後的商業備忘錄",
                        "title": "結語寫給 2026 年之後的商業備忘錄",
                        "h3_details": [
                            {
                                "id": "實體消歧與檢索摘要卡-entity-disambiguation-rag-card",
                                "title": "實體消歧與檢索摘要卡 (Entity Disambiguation & RAG Card)"
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
                "id": "ecommerce-ai-agent-guide",
                "pillar": "agent",
                "badge": "工程實戰",
                "date": "2026-10-19",
                "title": "電商專用 AI Agent 落地實戰全書：從商業真相、系統架構、演算法博弈到工業代碼實現｜全景旗艦版",
                "url": "../ai-workflow/ecommerce-ai-agent-guide.html",
                "core_conclusion": "電商專用 AI Agent 的生產級落地關鍵在於擺脫單體通用 Prompt 調用模式，建立以專用 Harness 架構與有限狀態機 (FSM) 為核心的五長制垂直多智能體（MAS）協同網絡。系統透過 Canonical SKU 抽象主商品實體消歧、TCM 五層毛利即時穿透與動態博弈定價熔斷，徹底解決多平台屬性漂移與利潤擊穿風險，實現由 Sourcing 到…",
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
                        "id": "guide-prologue-title",
                        "title": "序言與前瞻導讀：電商 AI Agent 的時代分野",
                        "h3_details": [
                            {
                                "id": "blueprint-heading",
                                "title": "全書六大篇章實戰藍圖與閱讀路徑"
                            }
                        ]
                    },
                    {
                        "id": "part-1-interview-title",
                        "title": "篇章一：阿里 107 Benchmark 與訪談復盤",
                        "h3_details": []
                    },
                    {
                        "id": "ch1-executive-dashboard-title",
                        "title": "5W1H 核心決策全景儀表盤",
                        "h3_details": []
                    },
                    {
                        "id": "ch1-core-paradox-title",
                        "title": "核心悖論：為何跑分接近滿分，商業用戶卻「無感」？",
                        "h3_details": [
                            {
                                "id": "ch1-coding-agent",
                                "title": "研發編程 (Coding Agent)"
                            },
                            {
                                "id": "ch1-commerce-agent",
                                "title": "實體商業 (Commerce Agent)"
                            },
                            {
                                "id": "ch1-benchmark-107-title",
                                "title": "阿里國際站 107 個電商真實任務 Benchmark 通過率分析"
                            }
                        ]
                    },
                    {
                        "id": "ch1-agent-formula-cost-title",
                        "title": "核心方法論：Agent 落地公式與成本工程",
                        "h3_details": [
                            {
                                "id": "ch1-formula-model",
                                "title": "Model (基礎模型)"
                            },
                            {
                                "id": "ch1-formula-harness",
                                "title": "Harness (工程駕馭系統)"
                            },
                            {
                                "id": "ch1-formula-context",
                                "title": "Context (業務上下文)"
                            },
                            {
                                "id": "ch1-pareto-cost-engineering",
                                "title": "帕累托最優路由 (Pareto Routing) 與 $3.69 成本工程"
                            }
                        ]
                    },
                    {
                        "id": "ch1-tasks-and-l1-l4-title",
                        "title": "深度解析：107 個真實任務與 L1~L4 難度階梯",
                        "h3_details": [
                            {
                                "id": "ch1-l1-l4-pyramid-title",
                                "title": "L1 ~ L4 難度階梯與商業通過率進階金字塔"
                            }
                        ]
                    },
                    {
                        "id": "ch1-architecture-comparison-title",
                        "title": "架構對比：專用電商 Agent vs. 通用操作 Agent (Computer Use)",
                        "h3_details": []
                    },
                    {
                        "id": "ch1-human-agent-boundary-title",
                        "title": "人機邊界與全球化商業實踐",
                        "h3_details": [
                            {
                                "id": "ch1-human-core-boundary",
                                "title": "人類牢牢掌握的核心邊界"
                            },
                            {
                                "id": "ch1-agent-core-boundary",
                                "title": "AI 完全接管的重複工序"
                            },
                            {
                                "id": "ch1-born-global-cases",
                                "title": "「生而全球化（Born Global）」微型跨國企業案例"
                            }
                        ]
                    },
                    {
                        "id": "ch1-conclusion-commercial-agi-title",
                        "title": "結語：定義商業領域的 AGI",
                        "h3_details": []
                    },
                    {
                        "id": "part-2-operator-title",
                        "title": "篇章二：操盤手工作流與鏈路閉環",
                        "h3_details": []
                    },
                    {
                        "id": "ch2-executive-dashboard-title",
                        "title": "5W1H 執行總綱儀表盤",
                        "h3_details": []
                    },
                    {
                        "id": "ch2-target-personas-goals-title",
                        "title": "一、 適用對象畫像與核心戰略升級",
                        "h3_details": [
                            {
                                "id": "ch2-four-personas",
                                "title": "1. 四大關鍵角色落地畫像"
                            },
                            {
                                "id": "ch2-strategic-goals",
                                "title": "2. 三大核心戰略升級目標"
                            }
                        ]
                    },
                    {
                        "id": "ch2-executive-summary-bottleneck-title",
                        "title": "二、 執行摘要：通用模型失焦與乘法公式",
                        "h3_details": [
                            {
                                "id": "ch2-why-generic-models-fail",
                                "title": "1. 為什麼通用大模型在商業經營中失焦？"
                            },
                            {
                                "id": "ch2-agent-multiplication-matrix",
                                "title": "2. 電商 Agent 落地核心乘法公式"
                            }
                        ]
                    },
                    {
                        "id": "ch2-sourcing-to-listing-closed-loop-title",
                        "title": "三、 Sourcing 到 Listing 全鏈路閉環",
                        "h3_details": [
                            {
                                "id": "ch2-loop-step1-sourcing",
                                "title": "1 階段 1：智慧尋源與供應鏈商機探測 (Smart Sourcing & Inquiry)"
                            },
                            {
                                "id": "ch2-loop-step2-design-pack",
                                "title": "2 階段 2：規格工藝包與工業打樣定義 (Design Pack Specification)"
                            },
                            {
                                "id": "ch2-loop-step3-logistics",
                                "title": "3 階段 3：全球履約與動態物流訂艙 (Global Fulfillment & Freight Booking)"
                            },
                            {
                                "id": "ch2-loop-step4-listing",
                                "title": "4 階段 4：多端規格自動分銷與 Listing 上架 (Omni-Channel Listing)"
                            },
                            {
                                "id": "ch2-loop-step5-margin",
                                "title": "5 階段 5：跨平台動態毛利穿透追蹤 (True Contribution Margin Tracking)"
                            }
                        ]
                    },
                    {
                        "id": "ch2-l1-l4-workflow-matrix-title",
                        "title": "四、 L1~L4 業務工作流清單與實戰演進",
                        "h3_details": []
                    },
                    {
                        "id": "ch2-raci-matrix-section-title",
                        "title": "五、 一人營運團隊 RACI 權限分配矩陣",
                        "h3_details": []
                    },
                    {
                        "id": "ch2-eight-week-roadmap-title",
                        "title": "六、 8 週漸進式落地甘特圖",
                        "h3_details": []
                    },
                    {
                        "id": "part-3-risk-control-title",
                        "title": "篇章三：深水區風控與毛利穿透",
                        "h3_details": []
                    },
                    {
                        "id": "ch3-executive-dashboard-title",
                        "title": "5W1H 高階風控全景儀表盤",
                        "h3_details": []
                    },
                    {
                        "id": "ch3-prologue-hidden-reefs-title",
                        "title": "前言：電商操盤手真正恐懼的不是「效率」，而是「暗礁」",
                        "h3_details": []
                    },
                    {
                        "id": "ch3-module-1-tcm-penetration-title",
                        "title": "模組一：跨平台動態真實 P&L 與現金流穿透（Financial Penetration）",
                        "h3_details": [
                            {
                                "id": "ch3-five-layer-cost-waterline",
                                "title": "1. 隱性成本五層吃水線架構"
                            },
                            {
                                "id": "ch3-negative-margin-circuit-breaker",
                                "title": "2. Agent 實戰任務：全天候「負毛利自動熔斷機制」"
                            }
                        ]
                    },
                    {
                        "id": "ch3-module-2-inventory-bullwhip-title",
                        "title": "模組二：智慧庫存健康度與防「牛鞭效應」（Inventory & Bullwhip Prevention）",
                        "h3_details": [
                            {
                                "id": "ch3-doi-matrix-formula",
                                "title": "1. 跨國庫存「安全水位天數（DOI）」動態矩陣"
                            },
                            {
                                "id": "ch3-dead-stock-clearance",
                                "title": "2. 滯銷庫存（Dead Stock）自動清理工作流"
                            }
                        ]
                    },
                    {
                        "id": "ch3-module-3-compliance-guardrails-title",
                        "title": "模組三：跨平台防封店、防關帳與合規防火牆（Compliance Guardrails）",
                        "h3_details": [
                            {
                                "id": "ch3-pre-listing-three-dimensional-audit",
                                "title": "1. Listing 刊登前自動多維合規審查"
                            },
                            {
                                "id": "ch3-hijack-monitoring-defense",
                                "title": "2. 惡意跟賣與品牌資產被篡改巡檢（Hijack Monitoring）"
                            }
                        ]
                    },
                    {
                        "id": "ch3-module-4-algorithmic-game-pricing-title",
                        "title": "模組四：對抗平台演算法黑盒：動態博弈定價與 Buy Box 掠奪機制",
                        "h3_details": [
                            {
                                "id": "ch3-price-elasticity-probe",
                                "title": "1. 動態定價博弈模型（Algorithmic Game Pricing）"
                            },
                            {
                                "id": "ch3-bait-and-switch-trap",
                                "title": "2. 反制競品「惡意壓價腳本」與「跟賣陷阱」"
                            }
                        ]
                    },
                    {
                        "id": "ch3-module-5-crm-dispute-defense-title",
                        "title": "模組五：智慧客服質檢、爭議逆向抗辯與差評防禦（CRM & Dispute Defense）",
                        "h3_details": [
                            {
                                "id": "ch3-fraud-detection-engine",
                                "title": "1. 惡意退款與詐欺行為特徵工程"
                            },
                            {
                                "id": "ch3-voc-reverse-engineering",
                                "title": "2. VOC（顧客聲音）逆向賦能供應鏈 (ECO)"
                            }
                        ]
                    },
                    {
                        "id": "ch3-module-6-global-tax-shield-title",
                        "title": "模組六：全球稅則穿透與動態 HS Code 稅盾",
                        "h3_details": []
                    },
                    {
                        "id": "ch3-raci-organization-title",
                        "title": "深水區 RACI 權限分工表",
                        "h3_details": []
                    },
                    {
                        "id": "part-4-algorithm-mas-title",
                        "title": "篇章四：核心架構與演算法博弈",
                        "h3_details": []
                    },
                    {
                        "id": "ch4-executive-dashboard-title",
                        "title": "5W1H 高階架構與博弈全景儀表盤",
                        "h3_details": []
                    },
                    {
                        "id": "ch4-prologue-tech-foundation-title",
                        "title": "前言：從工具調用邁向「演算法抗衡與私域本體」",
                        "h3_details": []
                    },
                    {
                        "id": "ch4-module-1-domain-ontology-title",
                        "title": "模組一：電商私域本體工程（Domain Ontology & Private Context Graph）",
                        "h3_details": [
                            {
                                "id": "ch4-canonical-sku-ontology",
                                "title": "1. 什麼是電商領域本體（E-Commerce Ontology）？"
                            }
                        ]
                    },
                    {
                        "id": "ch4-module-2-graph-rag-title",
                        "title": "模組二：圖向量混合檢索（Graph-RAG）",
                        "h3_details": []
                    },
                    {
                        "id": "ch4-module-3-multi-agent-topology-title",
                        "title": "模組三：微型 Agent 網絡架構（Multi-Agent System, MAS）拓撲",
                        "h3_details": [
                            {
                                "id": "ch4-five-commanders-topology",
                                "title": "1. 「五長制」Multi-Agent 拓撲結構"
                            },
                            {
                                "id": "ch4-module-4-inter-agent-protocol",
                                "title": "2. 代理人間通信協議（Inter-Agent Communication Protocol）"
                            }
                        ]
                    },
                    {
                        "id": "ch4-module-5-anti-fingerprinting-title",
                        "title": "模組四：防環境關聯與隱身作戰網路（Anti-Fingerprinting Harness）",
                        "h3_details": []
                    },
                    {
                        "id": "ch4-epilogue-autonomous-enterprise-title",
                        "title": "結語：從「算帳工具」邁向「自主進化的跨國數位企業」",
                        "h3_details": []
                    },
                    {
                        "id": "part-5-engineering-title",
                        "title": "篇章五：工業級系統建設實戰工程教學",
                        "h3_details": []
                    },
                    {
                        "id": "ch5-executive-dashboard-title",
                        "title": "5W1H 工業級工程儀表盤",
                        "h3_details": []
                    },
                    {
                        "id": "ch5-prologue-engineering-mindset-title",
                        "title": "前言：跳出 Demo 玩具思維，建立工業級電商 Agent 底座",
                        "h3_details": []
                    },
                    {
                        "id": "ch5-module-1-architecture-blueprint-title",
                        "title": "模組一：系統總體架構設計（Architecture Blueprint）",
                        "h3_details": []
                    },
                    {
                        "id": "ch5-module-2-canonical-sku-code-title",
                        "title": "模組二：私域本體與 Context 工程建設",
                        "h3_details": [
                            {
                                "id": "ch5-canonical-sku-modeling",
                                "title": "1. Canonical SKU（抽象主商品）建模"
                            },
                            {
                                "id": "ch5-graph-rag-retrieval",
                                "title": "2. Graph-RAG 混合檢索架構"
                            }
                        ]
                    },
                    {
                        "id": "ch5-module-3-pareto-model-routing-title",
                        "title": "模組三：帕累托模型路由（Pareto Optimal Routing）",
                        "h3_details": []
                    },
                    {
                        "id": "ch5-module-4-fsm-harness-engineering-title",
                        "title": "模組四：任務狀態機與持久化排程（Harness Engineering）",
                        "h3_details": [
                            {
                                "id": "ch5-sourcing-fsm-flow",
                                "title": "長程詢盤狀態機（Sourcing FSM）範例"
                            },
                            {
                                "id": "ch5-idempotency-and-checkpoint",
                                "title": "關鍵容錯機制"
                            }
                        ]
                    },
                    {
                        "id": "ch5-module-5-guardrails-pydantic-title",
                        "title": "模組五：人機協同安全邊界（Guardrails & RACI）",
                        "h3_details": [
                            {
                                "id": "ch5-three-layer-firewall",
                                "title": "1. 三層防禦防火牆配置"
                            },
                            {
                                "id": "ch5-pydantic-guardrail-code",
                                "title": "2. 審核卡點程式碼結構"
                            }
                        ]
                    },
                    {
                        "id": "ch5-module-6-implementation-roadmap-title",
                        "title": "模組六：五步落地路線圖（Implementation Roadmap）",
                        "h3_details": []
                    },
                    {
                        "id": "ch5-epilogue-evolving-enterprise-title",
                        "title": "結語：打造具備自我進化能力的數位經營組織",
                        "h3_details": []
                    },
                    {
                        "id": "part-6-faq-observation-title",
                        "title": "篇章六：全景問答與實戰總結",
                        "h3_details": [
                            {
                                "id": "mason-yang-observation",
                                "title": "★ Mason Yang 的觀察 (Actionable Intelligence)"
                            },
                            {
                                "id": "faq-master-heading",
                                "title": "全景實戰常見問題庫 (Comprehensive FAQ)"
                            }
                        ]
                    },
                    {
                        "id": "reference-sources-title",
                        "title": "參考來源與聲明 (References & Disclaimers)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "how-to-optimize-tokens-for-ai-coding",
                "pillar": "agent",
                "badge": "工程實戰",
                "date": "2026-10-13",
                "title": "【AI 寫程式架構】 - Skills 按需路由如何顛覆百萬上下文迷思？解構脫水防火牆與 95.7% Token 節省實踐",
                "url": "../ai-workflow/how-to-optimize-tokens-for-ai-coding.html",
                "core_conclusion": "大模型上下文窗口的無限擴張掩蓋了工程架構的失職。透過將全域提示詞重構為路由式按需掛載、在檔案探索層構築 AST 骨架與章節切片脫水防火牆，並落實 One Phase One Session 物理隔絕，可在大型工程中削減 95.7% Token 消耗並保證一次性通過率。",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "95.7%"
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
                        "id": "一-大上下文的技術迷思與認知坍塌",
                        "title": "一、 大上下文的技術迷思與認知坍塌",
                        "h3_details": [
                            {
                                "id": "1-1-注意力退化與-needle-in-a-haystack-的深層陷阱",
                                "title": "1.1 注意力退化與 Needle-in-a-Haystack 的深層陷阱"
                            },
                            {
                                "id": "1-2-滾動會話的複利計費懲罰",
                                "title": "1.2 滾動會話的複利計費懲罰"
                            },
                            {
                                "id": "1-3-認知漂移與錯誤假設的持久化污染",
                                "title": "1.3 認知漂移與錯誤假設的持久化污染"
                            }
                        ]
                    },
                    {
                        "id": "二-架構支柱一-skills-路由式按需掛載",
                        "title": "二、 架構支柱一Skills 路由式按需掛載",
                        "h3_details": [
                            {
                                "id": "2-1-傳統單體-system-prompt-的架構缺陷",
                                "title": "2.1 傳統單體 System Prompt 的架構缺陷"
                            },
                            {
                                "id": "2-2-雙層路由與意圖觸發機制",
                                "title": "2.2 雙層路由與意圖觸發機制"
                            },
                            {
                                "id": "2-3-主流-ai-寫程式環境的落地映射-cursor-與-antigravity-的工程實踐",
                                "title": "2.3 主流 AI 寫程式環境的落地映射：Cursor 與 Antigravity 的工程實踐"
                            }
                        ]
                    },
                    {
                        "id": "三-架構支柱二-工具鏈脫水防火牆",
                        "title": "三、 架構支柱二工具鏈脫水防火牆",
                        "h3_details": [
                            {
                                "id": "3-1-code-skeleton-基於-ast-的結構提煉",
                                "title": "3.1 Code Skeleton：基於 AST 的結構提煉"
                            },
                            {
                                "id": "3-2-repo-radar-大綱探測與精準標靶切片",
                                "title": "3.2 Repo Radar：大綱探測與精準標靶切片"
                            },
                            {
                                "id": "3-3-rtk-終端指令過濾與輸出脫水",
                                "title": "3.3 RTK 終端指令過濾與輸出脫水"
                            }
                        ]
                    },
                    {
                        "id": "四-架構支柱三-one-phase-one-session-物理隔絕",
                        "title": "四、 架構支柱三One Phase, One Session 物理隔絕",
                        "h3_details": [
                            {
                                "id": "4-1-物理隔絕原則-physical-isolation",
                                "title": "4.1 物理隔絕原則（Physical Isolation）"
                            },
                            {
                                "id": "4-2-實體任務檔作為唯一真理源-ssot",
                                "title": "4.2 實體任務檔作為唯一真理源（SSOT）"
                            }
                        ]
                    },
                    {
                        "id": "五-實測數據對比與經濟效益分析",
                        "title": "五、 實測數據對比與經濟效益分析",
                        "h3_details": [
                            {
                                "id": "5-1-測試環境與對照設定",
                                "title": "5.1 測試環境與對照設定"
                            },
                            {
                                "id": "5-2-實測數據對照表",
                                "title": "5.2 實測數據對照表"
                            },
                            {
                                "id": "5-3-數據深度解讀",
                                "title": "5.3 數據深度解讀"
                            }
                        ]
                    },
                    {
                        "id": "六-mason-的工程思維與二階省思",
                        "title": "六、 Mason 的工程思維與二階省思",
                        "h3_details": [
                            {
                                "id": "6-1-資本分配視角-token-即算力資本",
                                "title": "6.1 資本分配視角：Token 即算力資本"
                            },
                            {
                                "id": "6-2-抽象層洩漏與供應商激勵解構",
                                "title": "6.2 抽象層洩漏與供應商激勵解構"
                            },
                            {
                                "id": "6-3-演化劇本-從規模擴張走向微架構內斂",
                                "title": "6.3 演化劇本：從規模擴張走向微架構內斂"
                            }
                        ]
                    },
                    {
                        "id": "七-附錄-核心脫水工具鏈最小實作範式",
                        "title": "七、 附錄核心脫水工具鏈最小實作範式",
                        "h3_details": [
                            {
                                "id": "7-1-repo-radar-標靶切片演算法-python",
                                "title": "7.1 Repo Radar 標靶切片演算法 (Python)"
                            },
                            {
                                "id": "7-2-會話接力提示詞標準模板-handover-block",
                                "title": "7.2 會話接力提示詞標準模板 (Handover Block)"
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
                "id": "ai-compute-asset-pricing-stress-test",
                "pillar": "capital",
                "badge": "深度研報",
                "date": "2026-10-13",
                "title": "AI 算力資產定價與物理邊界壓力測試：電網瓶頸、次級折價與私募信貸斷裂",
                "url": "../news/20261013-ai-compute-asset-pricing-stress-test.html",
                "core_conclusion": "AI 算力擴建遭遇物理邊界：500kV 變壓器交付延宕觸發 ASC 360 巨額減損，矽基折舊與信貸久期錯配引發私募信貸踩踏，而演算法低耗化與通訊延遲物理極限進一步證偽分散式算力替代路徑。",
                "indicators": [
                    {
                        "label": "核心參數",
                        "value": "500kV"
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
                        "id": "500kv-變壓器交付延宕與-asc-360-資產減損臨界閾值分析",
                        "title": "500kV 變壓器交付延宕與 ASC 360 資產減損臨界閾值分析",
                        "h3_details": [
                            {
                                "id": "500kv-變壓器交付週期拉長與輸配電物理瓶頸",
                                "title": "500kV 變壓器交付週期拉長與輸配電物理瓶頸"
                            },
                            {
                                "id": "半導體架構迭代與-160-週通電延誤陷阱",
                                "title": "半導體架構迭代與 160 週通電延誤陷阱"
                            },
                            {
                                "id": "us-gaap-asc-360-減損測試與未貼現現金流崩塌模型",
                                "title": "US GAAP ASC 360 減損測試與未貼現現金流崩塌模型"
                            }
                        ]
                    },
                    {
                        "id": "矽基壽命與信貸久期錯配-私募信貸斷裂與次級-gpu-處置基差",
                        "title": "矽基壽命與信貸久期錯配 私募信貸斷裂與次級 GPU 處置基差",
                        "h3_details": [
                            {
                                "id": "矽基物理壽命與-8-年期信貸久期錯配",
                                "title": "矽基物理壽命與 8 年期信貸久期錯配"
                            },
                            {
                                "id": "35-非標流動性處置基差與動態-ltv-穿倉機制",
                                "title": "35% 非標流動性處置基差與動態 LTV 穿倉機制"
                            },
                            {
                                "id": "私募信貸瀑布流結構斷裂與二級拋售踩踏",
                                "title": "私募信貸瀑布流結構斷裂與二級拋售踩踏"
                            }
                        ]
                    },
                    {
                        "id": "演算法能耗分流與傑文斯悖論破裂-吉瓦級資本開支的泡沫定價",
                        "title": "演算法能耗分流與傑文斯悖論破裂 吉瓦級資本開支的泡沫定價",
                        "h3_details": [
                            {
                                "id": "傑文斯悖論的微觀經濟學邊界與彈性公式模型",
                                "title": "傑文斯悖論的微觀經濟學邊界與彈性公式模型"
                            },
                            {
                                "id": "演算法能效優化與端側-npu-分流效應",
                                "title": "演算法能效優化與端側 NPU 分流效應"
                            },
                            {
                                "id": "算力總支出萎縮-68-4-與吉瓦級剛性-ppa-購電協議泡沫",
                                "title": "算力總支出萎縮 68.4% 與吉瓦級剛性 PPA 購電協議泡沫"
                            }
                        ]
                    },
                    {
                        "id": "機器經濟支付架構與分散式算力物理限制-密碼學開銷與-mfu-崩塌",
                        "title": "機器經濟支付架構與分散式算力物理限制密碼學開銷與 MFU 崩塌",
                        "h3_details": [
                            {
                                "id": "google-ap2-與-x402-協議的密碼學延遲及女巫攻擊風險",
                                "title": "Google AP2 與 x402 協議的密碼學延遲及女巫攻擊風險"
                            },
                            {
                                "id": "廣域網-wan-通訊延遲對分散式算力-mfu-的物理毀滅",
                                "title": "廣域網（WAN）通訊延遲對分散式算力 MFU 的物理毀滅"
                            }
                        ]
                    },
                    {
                        "id": "跨維度連鎖流動性踩踏傳導與宏觀量化風控矩陣",
                        "title": "跨維度連鎖流動性踩踏傳導與宏觀量化風控矩陣",
                        "h3_details": []
                    },
                    {
                        "id": "結論與對沖風控架構建言",
                        "title": "結論與對沖風控架構建言",
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
                "id": "20261003-cognitive-outsourcing-urban-edge-computing",
                "pillar": "capital",
                "badge": "深度研報",
                "date": "2026-10-03",
                "title": "【AI 認知外包與邊緣算力】- 心智機能退化如何掏空組織中層？為何推論浪潮逼迫數據中心公用事業化？拆解都市微電網單元經濟與實體落地真相",
                "url": "../news/20261003-cognitive-outsourcing-urban-edge-computing.html",
                "core_conclusion": "深入剖析 AI 認知外包引發的人類心智機能退化與組織漏斗化，解構數據中心由訓練轉向 24/7 推論的公用事業化重組，並評估充電樁、智慧零售與微電網邊緣運算的落地商業模型。",
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
                        "h3_details": []
                    },
                    {
                        "id": "執行摘要-executive-summary",
                        "title": "執行摘要 (Executive Summary)",
                        "h3_details": []
                    },
                    {
                        "id": "第一章-認知外包危機-人類心智機能退化對產業與社會的深層衝擊",
                        "title": "第一章認知外包危機 — 人類心智機能退化對產業與社會的深層衝擊",
                        "h3_details": [
                            {
                                "id": "1-1-核心矛盾-生存預設下的認知機能萎縮",
                                "title": "1.1 核心矛盾：生存預設下的認知機能萎縮"
                            },
                            {
                                "id": "1-2-產業結構-中間層崩解與-漏斗型-組織極端化",
                                "title": "1.2 產業結構：中間層崩解與「漏斗型」組織極端化"
                            },
                            {
                                "id": "1-3-職場生態-經驗累積-機制斷裂與責任轉移",
                                "title": "1.3 職場生態：「經驗累積」機制斷裂與責任轉移"
                            },
                            {
                                "id": "1-4-社會分層-認知雙軌制與-認知貧民窟",
                                "title": "1.4 社會分層：認知雙軌制與「認知貧民窟」"
                            },
                            {
                                "id": "1-5-系統性脆弱-認知單一化-cognitive-monoculture-與文明維護危機",
                                "title": "1.5 系統性脆弱：認知單一化（Cognitive Monoculture）與文明維護危機"
                            }
                        ]
                    },
                    {
                        "id": "第二章-基礎設施重構-ai-數據中心演進與量化營收分析框架",
                        "title": "第二章基礎設施重構 — AI 數據中心演進與量化營收分析框架",
                        "h3_details": [
                            {
                                "id": "2-1-負載模式劇變-從-訓練主導-跨向-全天候推論爆炸",
                                "title": "2.1 負載模式劇變：從「訓練主導」跨向「全天候推論爆炸」"
                            },
                            {
                                "id": "2-2-核心瓶頸位移-從算力晶片轉向-電網併網容量-interconnection-queue",
                                "title": "2.2 核心瓶頸位移：從算力晶片轉向「電網併網容量（Interconnection Queue）」"
                            },
                            {
                                "id": "2-3-兩種主流商業模式拆解與計算模型",
                                "title": "2.3 兩種主流商業模式拆解與計算模型"
                            },
                            {
                                "id": "2-4-自下而上-bottom-up-四步財務預測流程",
                                "title": "2.4 自下而上（Bottom-Up）四步財務預測流程"
                            },
                            {
                                "id": "2-5-營收品質三大壓力測試-stress-test",
                                "title": "2.5 營收品質三大壓力測試（Stress Test）"
                            }
                        ]
                    },
                    {
                        "id": "第三章-教育機構的單元經濟學解構-ai-算力替代傳統學校與補習班的邊界",
                        "title": "第三章教育機構的單元經濟學解構 — AI 算力替代傳統學校與補習班的邊界",
                        "h3_details": [
                            {
                                "id": "3-1-傳統教育體系的重資產成本結構",
                                "title": "3.1 傳統教育體系的重資產成本結構"
                            },
                            {
                                "id": "3-2-ai-算力驅動的個人化教育邊際成本",
                                "title": "3.2 AI 算力驅動的個人化教育邊際成本"
                            },
                            {
                                "id": "3-3-經濟計量模型對比-單位知識傳授成本",
                                "title": "3.3 經濟計量模型對比：單位知識傳授成本"
                            },
                            {
                                "id": "3-4-傳統教育不可替代的護城河",
                                "title": "3.4 傳統教育不可替代的護城河"
                            }
                        ]
                    },
                    {
                        "id": "第四章-實體空間迷思與破局-ai-咖啡廳與-ai-網咖的商業模式評估",
                        "title": "第四章實體空間迷思與破局 — AI 咖啡廳與 AI 網咖的商業模式評估",
                        "h3_details": [
                            {
                                "id": "4-1-歷史對比-時代硬體鴻溝的失效",
                                "title": "4.1 歷史對比：時代硬體鴻溝的失效"
                            },
                            {
                                "id": "4-2-財務模型致命傷-以標準-30-席高階門店測算",
                                "title": "4.2 財務模型致命傷（以標準 30 席高階門店測算）"
                            },
                            {
                                "id": "4-3-實體空間的破局方向-從-純賣算力-轉向-認知與人脈樞紐",
                                "title": "4.3 實體空間的破局方向：從「純賣算力」轉向「認知與人脈樞紐」"
                            }
                        ]
                    },
                    {
                        "id": "第五章-物理邊緣崛起-都市型邊緣運算-urban-edge-computing-落地場景與獲利模型",
                        "title": "第五章物理邊緣崛起 — 都市型邊緣運算（Urban Edge Computing）落地場景與獲利模型",
                        "h3_details": [
                            {
                                "id": "5-1-驅動算力下沉的四大物理漏斗法則",
                                "title": "5.1 驅動算力下沉的四大物理漏斗法則"
                            },
                            {
                                "id": "5-2-六大高可行性都市邊緣突破場景",
                                "title": "5.2 六大高可行性都市邊緣突破場景"
                            },
                            {
                                "id": "5-3-單元財務模型測算-以商圈視覺防損邊緣盒為例",
                                "title": "5.3 單元財務模型測算（以商圈視覺防損邊緣盒為例）"
                            },
                            {
                                "id": "5-4-致命陷阱與邊緣運算的落地現實",
                                "title": "5.4 致命陷阱與邊緣運算的落地現實"
                            },
                            {
                                "id": "5-5-前瞻進場拓撲-寄生策略與雲邊協同",
                                "title": "5.5 前瞻進場拓撲：寄生策略與雲邊協同"
                            }
                        ]
                    },
                    {
                        "id": "第六章-結論與資本演進全景圖-synthesis-strategic-matrix",
                        "title": "第六章結論與資本演進全景圖 (Synthesis & Strategic Matrix)",
                        "h3_details": [
                            {
                                "id": "6-1-資本定價權的終極遷移",
                                "title": "6.1 資本定價權的終極遷移"
                            },
                            {
                                "id": "6-2-投資與創業決策矩陣",
                                "title": "6.2 投資與創業決策矩陣"
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
                "id": "20260913-frontier-ai-capital-cycle",
                "pillar": "capital",
                "badge": "深度研報",
                "date": "2026-09-13",
                "title": "【前沿 AI 資本週期】- 巨頭為何倡議放慢步調？如何以道德敘事掩護去槓桿？拆解 7,000 億 CapEx、GPU 抵押債與六千億美元營收缺口",
                "url": "../news/20260913-frontier-ai-capital-cycle.html",
                "core_conclusion": "解讀 Anthropic Dario Amodei 倡議放慢步調與科技巨頭呼應背後的深層資本週期：剖析 2026 年 7,000 億美元 CapEx 囚徒困境、Scaling Law 收益遞減、紅杉 6,000 億營收缺口、GPU 私人信貸影子銀行與 Nvidia 賣方信貸兜底，並對比 2000 年光纖泡沫推演軟著陸與硬著陸情境。",
                "indicators": [
                    {
                        "label": "關鍵規模",
                        "value": "7,000 億"
                    },
                    {
                        "label": "關鍵規模",
                        "value": "6,000 億"
                    },
                    {
                        "label": "核心參數",
                        "value": "2026 年"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": []
                    },
                    {
                        "id": "執行摘要-道德共識掩護下的去槓桿與資本防禦",
                        "title": "執行摘要道德共識掩護下的去槓桿與資本防禦",
                        "h3_details": []
                    },
                    {
                        "id": "第一章-核心推演架構-技術狂熱到金融防禦的傳導路徑",
                        "title": "第一章核心推演架構技術狂熱到金融防禦的傳導路徑",
                        "h3_details": []
                    },
                    {
                        "id": "第二章-賽局困境-資本支出軍備競賽與囚徒困境的集體降溫",
                        "title": "第二章賽局困境資本支出軍備競賽與囚徒困境的集體降溫",
                        "h3_details": [
                            {
                                "id": "恐慌性資本支出-fomo-capex-與資產負債表承壓",
                                "title": "恐慌性資本支出（FOMO CapEx）與資產負債表承壓"
                            },
                            {
                                "id": "囚徒困境破局點-放慢步調-作為協同停火的道德台階",
                                "title": "囚徒困境破局點：「放慢步調」作為協同停火的道德台階"
                            }
                        ]
                    },
                    {
                        "id": "第三章-技術邊界與投資回報率缺口-scaling-law-撞牆與算力重心轉移",
                        "title": "第三章技術邊界與投資回報率缺口Scaling Law 撞牆與算力重心轉移",
                        "h3_details": [
                            {
                                "id": "預訓練邊際效用遞減與-test-time-compute-的範式轉移",
                                "title": "預訓練邊際效用遞減與 Test-Time Compute 的範式轉移"
                            },
                            {
                                "id": "六千億美元之問-營收增速與基礎設施折舊的結構性脫節",
                                "title": "「六千億美元之問」：營收增速與基礎設施折舊的結構性脫節"
                            },
                            {
                                "id": "存量算力重分配-自前沿訓練撤退至現金流推理業務",
                                "title": "存量算力重分配：自前沿訓練撤退至現金流推理業務"
                            }
                        ]
                    },
                    {
                        "id": "第四章-影子銀行與信貸地雷-算力金融化與-gpu-抵押融資結構",
                        "title": "第四章影子銀行與信貸地雷算力金融化與 GPU 抵押融資結構",
                        "h3_details": [
                            {
                                "id": "新興算力雲-neoclouds-與資產抵押債務-asset-backed-debt-的運作機制",
                                "title": "新興算力雲（Neoclouds）與資產抵押債務（Asset-Backed Debt）的運作機制"
                            },
                            {
                                "id": "晶片殘值風險與二級租賃市場價格波動的定價失靈",
                                "title": "晶片殘值風險與二級租賃市場價格波動的定價失靈"
                            },
                            {
                                "id": "循環融資與賣方信貸-vendor-financing-的系統性傳導鏈",
                                "title": "循環融資與賣方信貸（Vendor Financing）的系統性傳導鏈"
                            }
                        ]
                    },
                    {
                        "id": "第五章-監管俘虜與寡頭護城河-合規審查對後進者與開源的清場",
                        "title": "第五章監管俘虜與寡頭護城河合規審查對後進者與開源的清場",
                        "h3_details": [
                            {
                                "id": "嵌入式評估員與能力檢查點-制度化的高昂合規壁壘",
                                "title": "嵌入式評估員與能力檢查點：制度化的高昂合規壁壘"
                            },
                            {
                                "id": "地緣政治敘事與晶片供應鏈封閉-扼殺非專利技術與開源生態",
                                "title": "地緣政治敘事與晶片供應鏈封閉：扼殺非專利技術與開源生態"
                            }
                        ]
                    },
                    {
                        "id": "第六章-歷史鏡鑑-2000-年代光纖泡沫與當前算力週期的多維對比",
                        "title": "第六章歷史鏡鑑2000 年代光纖泡沫與當前算力週期的多維對比",
                        "h3_details": []
                    },
                    {
                        "id": "第七章-傳導路徑與情境推演-受控軟著陸與市場避險硬著陸",
                        "title": "第七章傳導路徑與情境推演受控軟著陸與市場避險硬著陸",
                        "h3_details": [
                            {
                                "id": "情境-a-受控軟著陸-managed-pacing-發生機率-60",
                                "title": "情境 A：受控軟著陸（Managed Pacing）— 發生機率：60%"
                            },
                            {
                                "id": "情境-b-避險去槓桿引發硬著陸-bubble-de-leveraging-發生機率-40",
                                "title": "情境 B：避險去槓桿引發硬著陸（Bubble De-leveraging）— 發生機率：40%"
                            },
                            {
                                "id": "關鍵驗證指標與預警體系",
                                "title": "關鍵驗證指標與預警體系"
                            }
                        ]
                    },
                    {
                        "id": "第八章-結論與戰略意涵-全球科技資本市場的去風險化序幕",
                        "title": "第八章結論與戰略意涵全球科技資本市場的去風險化序幕",
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
                "id": "20260912-crypto-miners-ai-datacenter-pivot",
                "pillar": "power",
                "badge": "深度研報",
                "date": "2026-09-12",
                "title": "【礦企轉型 AI】- Take-or-Pay 合約如何鎖定獲利加速度？群聯模式自建設備是否衝擊數據中心？拆解 EV/MW 估值重構、電網併網瓶頸與 500 億美元資金缺口",
                "url": "../news/20260912-crypto-miners-ai-datacenter-pivot.html",
                "core_conclusion": "深度查證北美比特幣礦企轉型 AI/HPC 數據中心之四大核心投資論點：解析 Take-or-Pay 長期託管合約如何隔絕 Token 價格通縮、群聯 5,000 萬私有化模型對底層公用事業電網的供需層級隔離，並推演 EV/MW 資產重估、2026-2027 交付排程與 VanEck 500 億美元融資缺口風險。",
                "indicators": [
                    {
                        "label": "關鍵規模",
                        "value": "500 億"
                    },
                    {
                        "label": "關鍵規模",
                        "value": "5,000 萬"
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
                        "id": "投資核心論點查證結論",
                        "title": "投資核心論點查證結論",
                        "h3_details": []
                    },
                    {
                        "id": "礦企轉型ai-hpc的經濟模型與估值重構機制",
                        "title": "礦企轉型 AI/HPC 的經濟模型與估值重構機制",
                        "h3_details": []
                    },
                    {
                        "id": "2026至2027h1獲利爆發期與低基期加速度查證",
                        "title": "2026 至 2027H1 獲利爆發期與低基期加速度查證",
                        "h3_details": []
                    },
                    {
                        "id": "企業自建本地ai趨勢-群聯模式-檢驗與數據中心需求傳導機制",
                        "title": "企業自建本地 AI 趨勢（群聯模式）檢驗與數據中心需求傳導機制",
                        "h3_details": [
                            {
                                "id": "群聯案例查證與企業自建本地端ai的經濟學",
                                "title": "群聯案例查證與企業自建本地端 AI 的經濟學"
                            },
                            {
                                "id": "雲地混合架構-hybrid-ai-與前沿模型邊界",
                                "title": "雲地混合架構（Hybrid AI）與前沿模型邊界"
                            },
                            {
                                "id": "為什麼企業自建-群聯模式-完全不影響轉型礦企數據中心的賺錢效率",
                                "title": "為什麼企業自建「群聯模式」完全不影響轉型礦企數據中心的賺錢效率？"
                            }
                        ]
                    },
                    {
                        "id": "雲端token價格年降70-趨勢檢驗與傑文斯悖論",
                        "title": "雲端 Token 價格年降 70% 趨勢檢驗與傑文斯悖論",
                        "h3_details": [
                            {
                                "id": "推論單位成本的通縮現實",
                                "title": "推論單位成本的通縮現實"
                            },
                            {
                                "id": "傑文斯悖論激發運算總需求爆炸",
                                "title": "傑文斯悖論激發運算總需求爆炸"
                            }
                        ]
                    },
                    {
                        "id": "核心風險因子與標的分化評估",
                        "title": "核心風險因子與標的分化評估",
                        "h3_details": [
                            {
                                "id": "巨額資本缺口與普通股股權稀釋",
                                "title": "巨額資本缺口與普通股股權稀釋"
                            },
                            {
                                "id": "購電協議到期懸崖與區域電價通脹",
                                "title": "購電協議到期懸崖與區域電價通脹"
                            },
                            {
                                "id": "科技巨頭資本支出消化停頓週期",
                                "title": "科技巨頭資本支出消化停頓週期"
                            }
                        ]
                    },
                    {
                        "id": "結論與資產配置總結",
                        "title": "結論與資產配置總結",
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
                "id": "20260906-ai-datacenter-financial-model",
                "pillar": "power",
                "badge": "深度研報",
                "date": "2026-09-06",
                "title": "【AI 算力數據中心收益評估】- 如何跨越 70% 稼動率獲利分水嶺？為何 Time-to-Power 延遲引爆無效折舊？解構 1,024 卡 H100 TCO、代幣成本與財務模型",
                "url": "../news/20260906-ai-datacenter-financial-model.html",
                "core_conclusion": "全球 AI 算力中心已由通用雲端資料中心全面轉型為「高資本密集、功耗受限與三年技術淘汰折舊」的專用基礎設施金融資產。以典型 1,024 顆 NVIDIA H100 SXM5 叢集測算，初期 CapEx 高達 4,500 萬美元，年化剛性 OpEx 達 1,772 萬美元（每月設備折舊高達 93.75 萬美元）。財務模型與敏感度演算證實，70% 稼動率是整個…",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "70%"
                    },
                    {
                        "label": "關鍵規模",
                        "value": "100 T"
                    },
                    {
                        "label": "關鍵規模",
                        "value": "4,500 萬"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": []
                    },
                    {
                        "id": "單位算力收益之核心量化指標與度量維度",
                        "title": "單位算力收益之核心量化指標與度量維度",
                        "h3_details": [
                            {
                                "id": "每-gpu-小時租金與標準化吞吐量收益",
                                "title": "每 GPU 小時租金與標準化吞吐量收益"
                            },
                            {
                                "id": "推理場景之每百萬-token-收益與產出比率",
                                "title": "推理場景之每百萬 Token 收益與產出比率"
                            }
                        ]
                    },
                    {
                        "id": "主流算力硬體與雲端租賃市場報價基準",
                        "title": "主流算力硬體與雲端租賃市場報價基準",
                        "h3_details": [
                            {
                                "id": "算力晶片代際特徵與市場租金",
                                "title": "算力晶片代際特徵與市場租金"
                            },
                            {
                                "id": "訂約模式之結構性價差機制",
                                "title": "訂約模式之結構性價差機制"
                            }
                        ]
                    },
                    {
                        "id": "數據中心總擁有成本-tco-結構深度解構",
                        "title": "數據中心總擁有成本（TCO）結構深度解構",
                        "h3_details": [
                            {
                                "id": "資本支出-capex-結構",
                                "title": "資本支出（CapEx）結構"
                            },
                            {
                                "id": "運營支出-opex-結構",
                                "title": "運營支出（OpEx）結構"
                            }
                        ]
                    },
                    {
                        "id": "算力資產收益模型與財務回報評估",
                        "title": "算力資產收益模型與財務回報評估",
                        "h3_details": [
                            {
                                "id": "財務評估模型與公式體系",
                                "title": "財務評估模型與公式體系"
                            },
                            {
                                "id": "70-稼動率門檻與財務回報矩陣",
                                "title": "70% 稼動率門檻與財務回報矩陣"
                            }
                        ]
                    },
                    {
                        "id": "模型訓練與推理服務之計費架構與單位經濟效益比較",
                        "title": "模型訓練與推理服務之計費架構與單位經濟效益比較",
                        "h3_details": [
                            {
                                "id": "訓練與推理工作負載之本質差異",
                                "title": "訓練與推理工作負載之本質差異"
                            },
                            {
                                "id": "排隊理論下推理代幣成本的非線性懲罰",
                                "title": "排隊理論下推理代幣成本的非線性懲罰"
                            }
                        ]
                    },
                    {
                        "id": "算力市場敏感度分析與多維風險評估",
                        "title": "算力市場敏感度分析與多維風險評估",
                        "h3_details": [
                            {
                                "id": "關鍵運營變數之敏感度分析",
                                "title": "關鍵運營變數之敏感度分析"
                            },
                            {
                                "id": "結構性資本風險剖析",
                                "title": "結構性資本風險剖析"
                            }
                        ]
                    },
                    {
                        "id": "結論與資產配置決策建議",
                        "title": "結論與資產配置決策建議",
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
                "id": "20260906-ai-compute-infrastructure-investment",
                "pillar": "capital",
                "badge": "深度研報",
                "date": "2026-09-06",
                "title": "AI 算力基礎設施：從財務數據推演投資機會與風險架構分析",
                "url": "../news/20260906-ai-compute-infrastructure-investment.html",
                "core_conclusion": "全球 AI 算力基礎設施投資定價典範已由前端模型狂熱轉向「重資產物理屬性與嚴苛財務槓桿」。以標竿型 1,024 卡 NVIDIA H100 運算叢集測算，初期總 CapEx 達 4,500 萬美元，年化 OpEx 約 1,772 萬美元，其中固定資產折舊高達 1,125 萬美元（佔 OpEx 的 63.49%）。70% 設備稼動率為損益平衡分水嶺，對應單卡…",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "63.49%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "70%"
                    },
                    {
                        "label": "關鍵規模",
                        "value": "4,500 萬"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": []
                    },
                    {
                        "id": "執行摘要-算力資產的重資產物理學與金融定價範式轉移",
                        "title": "執行摘要算力資產的重資產物理學與金融定價範式轉移",
                        "h3_details": []
                    },
                    {
                        "id": "一-算力叢集財務模型與敏感度推演",
                        "title": "一、算力叢集財務模型與敏感度推演",
                        "h3_details": [
                            {
                                "id": "1-叢集-capex-與-opex-成本結構拆解",
                                "title": "1. 叢集 CapEx 與 OpEx 成本結構拆解"
                            },
                            {
                                "id": "2-稼動率敏感度模型-營運槓桿與現金流崩塌機制",
                                "title": "2. 稼動率敏感度模型：營運槓桿與現金流崩塌機制"
                            }
                        ]
                    },
                    {
                        "id": "二-數據指標至投資邏輯的轉化矩陣",
                        "title": "二、數據指標至投資邏輯的轉化矩陣",
                        "h3_details": []
                    },
                    {
                        "id": "三-核心投資機會分析-跨越物理瓶頸與價值鏈重塑",
                        "title": "三、核心投資機會分析跨越物理瓶頸與價值鏈重塑",
                        "h3_details": [
                            {
                                "id": "1-物理與能源層-以-time-to-power-與電網容量為核心的稀缺資產",
                                "title": "1. 物理與能源層：以 Time-to-Power 與電網容量為核心的稀缺資產"
                            },
                            {
                                "id": "2-營運商層-金融工程架構-長約防禦與舊世代梯級利用",
                                "title": "2. 營運商層：金融工程架構、長約防禦與舊世代梯級利用"
                            },
                            {
                                "id": "3-軟體與架構層-提升-mfu-與-token-吞吐的效率放大器",
                                "title": "3. 軟體與架構層：提升 MFU 與 Token 吞吐的效率放大器"
                            }
                        ]
                    },
                    {
                        "id": "四-結構性投資風險與資本下行保護架構",
                        "title": "四、結構性投資風險與資本下行保護架構",
                        "h3_details": [
                            {
                                "id": "1-無效折舊-與通電時間脫節風險",
                                "title": "1.「無效折舊」與通電時間脫節風險"
                            },
                            {
                                "id": "2-晶片-s-曲線迭代-現貨價格崩跌與資產減損-asc-360",
                                "title": "2. 晶片 S 曲線迭代、現貨價格崩跌與資產減損 (ASC 360\\)"
                            },
                            {
                                "id": "3-稼動率崩塌與客戶集中度引發的死亡螺旋",
                                "title": "3. 稼動率崩塌與客戶集中度引發的死亡螺旋"
                            }
                        ]
                    },
                    {
                        "id": "五-私募股權與機構投資人盡職調查實戰架構",
                        "title": "五、私募股權與機構投資人盡職調查實戰架構",
                        "h3_details": []
                    },
                    {
                        "id": "六-資產配置戰略矩陣與結論",
                        "title": "六、資產配置戰略矩陣與結論",
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
                "id": "20260906-ai-compute-asset-pricing-power-physics",
                "pillar": "power",
                "badge": "深度研報",
                "date": "2026-09-06",
                "title": "【AI 算力資產定價】- 500kV 變壓器交期如何重構資產定價？為何折舊與電網引爆 ASC 360 減損？解構 70% 稼動率死線、160 週延誤與 MFU 50% 護城河",
                "url": "../news/20260906-ai-compute-asset-pricing-power-physics.html",
                "core_conclusion": "算力投資已進入由能源物理學、折舊會計與解耦調度主導的重資產時代。500kV 變壓器 160 週極端交期與 FERC 監管構成 Time-to-Power 核心瓶頸；70% 稼動率為損益平衡死線，55% 則引爆月虧 43 萬美元現金黑洞。激進採用 5 年折舊將引爆 ASC 360 巨額資產減損炸彈。唯有「以電定卡」、落實 3 年加速折舊與 60/40 非對稱…",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "70%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "50%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "55%"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": []
                    },
                    {
                        "id": "研究主旨-理論基礎與問題意識",
                        "title": "研究主旨、理論基礎與問題意識",
                        "h3_details": [
                            {
                                "id": "理論基礎體系",
                                "title": "理論基礎體系"
                            },
                            {
                                "id": "核心研究問題與理論假說",
                                "title": "核心研究問題與理論假說"
                            }
                        ]
                    },
                    {
                        "id": "物理電網約束-監管裁決與通電延誤量化",
                        "title": "物理電網約束、監管裁決與通電延誤量化",
                        "h3_details": [
                            {
                                "id": "監管審批壁壘與表後直連爭議",
                                "title": "監管審批壁壘與表後直連爭議"
                            },
                            {
                                "id": "輸配電設備供應鏈瓶頸",
                                "title": "輸配電設備供應鏈瓶頸"
                            },
                            {
                                "id": "time-to-power-延誤之財務侵蝕模型",
                                "title": "Time-to-Power 延誤之財務侵蝕模型"
                            }
                        ]
                    },
                    {
                        "id": "資本結構-資產證券化融資與會計減損壓力測試",
                        "title": "資本結構、資產證券化融資與會計減損壓力測試",
                        "h3_details": [
                            {
                                "id": "算力資產證券化與債務工具演進",
                                "title": "算力資產證券化與債務工具演進"
                            },
                            {
                                "id": "經營槓桿與損益平衡稼動率分析",
                                "title": "經營槓桿與損益平衡稼動率分析"
                            },
                            {
                                "id": "會計壽命調整與-us-gaap-asc-360-減損測試",
                                "title": "會計壽命調整與 US GAAP ASC 360 減損測試"
                            }
                        ]
                    },
                    {
                        "id": "系統架構替代與軟體解耦編排工程",
                        "title": "系統架構替代與軟體解耦編排工程",
                        "h3_details": [
                            {
                                "id": "超大規模雲端商自研晶片擠壓效應",
                                "title": "超大規模雲端商自研晶片擠壓效應"
                            },
                            {
                                "id": "互聯架構變遷-超以太網聯盟-uec-對-infiniband-溢價的侵蝕",
                                "title": "互聯架構變遷：超以太網聯盟（UEC）對 InfiniBand 溢價的侵蝕"
                            },
                            {
                                "id": "prefill-decode-解耦編排之微架構效率提升",
                                "title": "Prefill-Decode 解耦編排之微架構效率提升"
                            }
                        ]
                    },
                    {
                        "id": "實證模型設計-敏感度矩陣與情境模擬",
                        "title": "實證模型設計、敏感度矩陣與情境模擬",
                        "h3_details": [
                            {
                                "id": "tco-敏感度矩陣與動態測算",
                                "title": "TCO 敏感度矩陣與動態測算"
                            },
                            {
                                "id": "蒙地卡羅動態情境模擬與演化劇本",
                                "title": "蒙地卡羅動態情境模擬與演化劇本"
                            }
                        ]
                    },
                    {
                        "id": "動態警報監控與非對稱資本配置策略",
                        "title": "動態警報監控與非對稱資本配置策略",
                        "h3_details": [
                            {
                                "id": "三大臨界警報監控指標",
                                "title": "三大臨界警報監控指標"
                            },
                            {
                                "id": "非對稱配置準則與資本管理指引",
                                "title": "非對稱配置準則與資本管理指引"
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
                "id": "semiconductor-sector-selloff-analysis",
                "pillar": "silicon",
                "badge": "深度研報",
                "date": "2026-08-19",
                "title": "【全球半導體板塊劇烈修正】- Meta 270億表外債如何刺破 AI 估值？為何輝達、台積電與美光遭遇長鞭效應？解構費半暴跌真相",
                "url": "../news/20260819-semiconductor-sector-selloff-analysis.html",
                "core_conclusion": "2026年8月19日全球半導體板塊遭遇劇烈修正…",
                "indicators": [
                    {
                        "label": "關鍵規模",
                        "value": "270億"
                    },
                    {
                        "label": "核心參數",
                        "value": "2026年"
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
                        "id": "盤面表現與全球市場急跌概況",
                        "title": "盤面表現與全球市場急跌概況",
                        "h3_details": []
                    },
                    {
                        "id": "宏觀地緣政治危機與能源通膨引發之美債拋售",
                        "title": "宏觀地緣政治危機與能源通膨引發之美債拋售",
                        "h3_details": [
                            {
                                "id": "地緣政治風險溢價與能源供應鏈中斷傳導",
                                "title": "地緣政治風險溢價與能源供應鏈中斷傳導"
                            }
                        ]
                    },
                    {
                        "id": "金融評價工程模型-無風險折現率與遠期現金流淨現值NPV壓縮機制",
                        "title": "金融評價工程模型：無風險折現率與遠期現金流淨現值（NPV）壓縮機制",
                        "h3_details": []
                    },
                    {
                        "id": "深層結構危機-科技巨擘三兆美元表外隱形負債與-AI-算力變現質疑",
                        "title": "深層結構危機：科技巨擘三兆美元表外隱形負債與 AI 算力變現質疑",
                        "h3_details": [
                            {
                                "id": "meta-hyperion-專案與表外融資架構深度拆解",
                                "title": "Meta Hyperion 專案與表外融資架構深度拆解"
                            }
                        ]
                    },
                    {
                        "id": "產業鏈長鞭效應與多階連鎖傳導機制剖析",
                        "title": "產業鏈長鞭效應與多階連鎖傳導機制剖析",
                        "h3_details": [
                            {
                                "id": "二階效應-資金成本傳導與市場微觀結構擠壓",
                                "title": "二階效應：資金成本傳導與市場微觀結構擠壓"
                            },
                            {
                                "id": "三階效應-會計監管重塑與跨資產配置轉變",
                                "title": "三階效應：會計監管重塑與跨資產配置轉變"
                            }
                        ]
                    },
                    {
                        "id": "半導體次產業耐受度與情境量化分析",
                        "title": "半導體次產業耐受度與情境量化分析",
                        "h3_details": []
                    },
                    {
                        "id": "量化研究計畫與四大長效監測指標",
                        "title": "量化研究計畫與四大長效監測指標",
                        "h3_details": []
                    },
                    {
                        "id": "未來展望-結論與防禦型資產配置架構",
                        "title": "未來展望、結論與防禦型資產配置架構",
                        "h3_details": [
                            {
                                "id": "結論與宏觀資產配置架構",
                                "title": "結論與宏觀資產配置架構"
                            }
                        ]
                    },
                    {
                        "id": "article-analysis-header",
                        "title": "文章分析 機構級研究員視角與全維度洞察",
                        "h3_details": [
                            {
                                "id": "01-原文推論邏輯分析",
                                "title": "01. 原文推論邏輯分析"
                            },
                            {
                                "id": "02-敘事邊界與關鍵變數補充",
                                "title": "02. 敘事邊界與關鍵變數補充 (Logic Blindspots & Variables)"
                            },
                            {
                                "id": "mason-yang-observation",
                                "title": "03. Mason Yang 的觀察 (Actionable Intelligence)"
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
                "id": "compute-dollar-second-order-derivation-spark-arbitrage",
                "pillar": "power",
                "badge": "深度研報",
                "date": "2026-08-19",
                "title": "【算力美元二階推導】- 火花轉算力套利如何重構全球貨幣體系？為何石油美元正轉向算力美元？解構四大壓力測試與 Sovereign AI 主權防線",
                "url": "../news/20260819-compute-dollar-second-order-derivation-spark-arbitrage.html",
                "core_conclusion": "深度推導算力金融化二階與三階巨觀效應：火花轉算力套利機制、能源與Token定價模型、石油美元轉向算力美元的貨幣霸權循環，以及四大極端情境壓力測試與 Sovereign AI 主權防線。",
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
                                "id": "前篇基礎架構-輝達-gpu-資產化-spv-融資與-cme-期貨機制",
                                "title": "前篇基礎架構：輝達 GPU 資產化、SPV 融資與 CME 期貨機制"
                            }
                        ]
                    },
                    {
                        "id": "引言與研究範疇-算力資產化之範式轉移",
                        "title": "引言與研究範疇算力資產化之範式轉移",
                        "h3_details": []
                    },
                    {
                        "id": "算力金融化的第一階結構-資產證券化-spv與信用結構演進",
                        "title": "算力金融化的第一階結構資產證券化、SPV與信用結構演進",
                        "h3_details": [
                            {
                                "id": "spv環形隔離與信用評級突破",
                                "title": "SPV環形隔離與信用評級突破"
                            },
                            {
                                "id": "硬體折舊與殘值擔保機制",
                                "title": "硬體折舊與殘值擔保機制"
                            }
                        ]
                    },
                    {
                        "id": "算力衍生品與定價標準化-cme期貨與市場微觀結構",
                        "title": "算力衍生品與定價標準化CME期貨與市場微觀結構",
                        "h3_details": [
                            {
                                "id": "期貨合約設計與風險對沖需求",
                                "title": "期貨合約設計與風險對沖需求"
                            }
                        ]
                    },
                    {
                        "id": "算力美元體系之二階與三階推導-巨觀經濟與貨幣霸權重構",
                        "title": "算力美元體系之二階與三階推導巨觀經濟與貨幣霸權重構",
                        "h3_details": [
                            {
                                "id": "二階推導-一-循環融資網脈與-折舊-償債拉鋸戰-風險",
                                "title": "二階推導（一）：循環融資網脈與「折舊-償債拉鋸戰」風險"
                            },
                            {
                                "id": "二階推導-二-火花轉算力套利-與能源-算力界面的金融化",
                                "title": "二階推導（二）：「火花轉算力套利」與能源-算力界面的金融化"
                            },
                            {
                                "id": "三階推導-算力美元體系-compute-dollar-system-的貨幣霸權重構",
                                "title": "三階推導：算力美元體系（Compute-Dollar System）的貨幣霸權重構"
                            }
                        ]
                    },
                    {
                        "id": "系統性風險評估與壓力測試模型",
                        "title": "系統性風險評估與壓力測試模型",
                        "h3_details": []
                    },
                    {
                        "id": "結論與戰略建言-建構算力金融化研究之執行藍圖",
                        "title": "結論與戰略建言建構算力金融化研究之執行藍圖",
                        "h3_details": [
                            {
                                "id": "監管與金融穩定機構應對策略",
                                "title": "監管與金融穩定機構應對策略"
                            },
                            {
                                "id": "金融機構與資產管理業者戰略建言",
                                "title": "金融機構與資產管理業者戰略建言"
                            },
                            {
                                "id": "國家級算力戰略-sovereign-ai-戰略建言",
                                "title": "國家級算力戰略（Sovereign AI）戰略建言"
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
                                "title": "Mason Yang 的觀察 (Actionable Intelligence)"
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
                "id": "compute-dollar-nvidia-gpu-cme-futures",
                "pillar": "power",
                "badge": "深度研報",
                "date": "2026-08-19",
                "title": "【算力美元】- 輝達GPU資產化如何重塑資本秩序？CME期貨對沖與5000億美元融資的三大結構斷點",
                "url": "../news/20260819-compute-dollar-nvidia-gpu-cme-futures.html",
                "core_conclusion": "深度剖析輝達 5,000 億美元華爾街融資聯盟與 CME 算力期貨對沖機制。解構石油美元轉向算力美元的全球宏觀變局，以及硬體折舊錯配、物理交付與循環融資的三大系統性斷點。",
                "indicators": [
                    {
                        "label": "關鍵規模",
                        "value": "5000億"
                    },
                    {
                        "label": "關鍵規模",
                        "value": "5,000 億"
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
                        "id": "導論-從晶片銷售到基礎設施資產的範式轉移",
                        "title": "導論從晶片銷售到基礎設施資產的範式轉移",
                        "h3_details": []
                    },
                    {
                        "id": "資產質押悖論-為何-gpu-被視為-最爛押品",
                        "title": "資產質押悖論為何 GPU 被視為「最爛押品」？",
                        "h3_details": []
                    },
                    {
                        "id": "金融對沖與信用升維-cme-算力期貨對資產屬性的轉化機制",
                        "title": "金融對沖與信用升維CME 算力期貨對資產屬性的轉化機制",
                        "h3_details": []
                    },
                    {
                        "id": "巨觀秩序重建-石油美元-向-算力美元-的演進與地緣分化",
                        "title": "巨觀秩序重建「石油美元」向「算力美元」的演進與地緣分化",
                        "h3_details": []
                    },
                    {
                        "id": "系統性風險-算力新錨點的三大結構性斷點",
                        "title": "系統性風險算力新錨點的三大結構性斷點",
                        "h3_details": [
                            {
                                "id": "斷點一-技術迭代與債務年限之-硬體折舊錯配斷點",
                                "title": "斷點一：技術迭代與債務年限之「硬體折舊錯配斷點」"
                            },
                            {
                                "id": "斷點二-集群效能非標化與-網路-能源物理斷點",
                                "title": "斷點二：集群效能非標化與「網路/能源物理斷點」"
                            },
                            {
                                "id": "斷點三-循環融資與-高槓桿信用傳染斷點",
                                "title": "斷點三：循環融資與「高槓桿信用傳染斷點」"
                            }
                        ]
                    },
                    {
                        "id": "結論與戰略展望",
                        "title": "結論與戰略展望",
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
                                "title": "Mason Yang 的觀察 (Actionable Intelligence)"
                            },
                            {
                                "id": "續篇深度推導-火花轉算力套利-算力美元霸權循環與四大壓力測試",
                                "title": "續篇深度推導：火花轉算力套利、算力美元霸權循環與四大壓力測試"
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
                "id": "20260801-crypto-mining-ai-hpc-stocks",
                "pillar": "power",
                "badge": "深度研報",
                "date": "2026-08-01",
                "title": "【北美礦企 AI 轉型全景白皮書】九大個股深度評析 × 機構量化估值矩陣 × PPA電力與可轉債籌碼微觀解構",
                "url": "../news/20260801-crypto-mining-ai-hpc-stocks.html",
                "core_conclusion": "報告核心摘要 (Executive Summary) 產業轉型動機與帶電資產稀缺性：比特幣加權現金開採成本高達約 $79,995/BTC，利潤空間極度惡化。採礦業者憑藉 GW 等級已聯網電力容量 (Energized Power) 與高壓變電站，為超大型雲端商 (Hyperscalers) 縮短 75% 部署時間。 雙軌估值分化與 REITs 重估：透過簽…",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "75%"
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
                        "id": "執行摘要與產業轉型背景",
                        "title": "執行摘要與產業轉型背景",
                        "h3_details": []
                    },
                    {
                        "id": "近期股價大幅波動之核心驅動因素與宏觀機制",
                        "title": "近期股價大幅波動之核心驅動因素與宏觀機制",
                        "h3_details": [
                            {
                                "id": "超大型-ai-租賃合約公布引發的暴漲效應",
                                "title": "超大型 AI 租賃合約公布引發的暴漲效應"
                            },
                            {
                                "id": "總體經濟不確定性與科技股-capital-expenditure-審視引發的急挫",
                                "title": "總體經濟不確定性與科技股 Capital Expenditure 審視引發的急挫"
                            },
                            {
                                "id": "資本結構轉型與巨額資本需求帶來的股權稀釋與債務負擔",
                                "title": "資本結構轉型與巨額資本需求帶來的股權稀釋與債務負擔"
                            }
                        ]
                    },
                    {
                        "id": "全標的財務估值指標與現金燃燒率量化對比",
                        "title": "全標的財務估值指標與現金燃燒率量化對比",
                        "h3_details": [
                            {
                                "id": "全標的財務估值與籌碼數據對比矩陣",
                                "title": "3.1 全標的財務估值與籌碼數據對比矩陣"
                            },
                            {
                                "id": "財務健康度與現金燃燒率-burn-rate-深度測算",
                                "title": "3.2 財務健康度與現金燃燒率（Burn Rate）深度測算"
                            }
                        ]
                    },
                    {
                        "id": "九大重點個股深度評析與轉型檔案",
                        "title": "九大重點個股深度評析與轉型檔案",
                        "h3_details": [
                            {
                                "id": "觀察清單個股轉型模式與營運指標比較",
                                "title": "4.0 觀察清單個股轉型模式與營運指標總覽"
                            },
                            {
                                "id": "iren-iris-energy",
                                "title": "4.1 IREN (Iris Energy)"
                            },
                            {
                                "id": "corz-core-scientific",
                                "title": "4.2 CORZ (Core Scientific)"
                            },
                            {
                                "id": "hut-hut-8-corp",
                                "title": "4.3 HUT (Hut 8 Corp)"
                            },
                            {
                                "id": "cifr-cipher-digital",
                                "title": "4.4 CIFR (Cipher Digital)"
                            },
                            {
                                "id": "btbt-bit-digital",
                                "title": "4.5 BTBT (Bit Digital)"
                            },
                            {
                                "id": "hive-hive-digital-technologies",
                                "title": "4.6 HIVE (HIVE Digital Technologies)"
                            },
                            {
                                "id": "clsk-cleanspark",
                                "title": "4.7 CLSK (CleanSpark)"
                            },
                            {
                                "id": "riot-riot-platforms",
                                "title": "4.8 RIOT (Riot Platforms)"
                            },
                            {
                                "id": "mara-mara-holdings",
                                "title": "4.9 MARA (MARA Holdings)"
                            }
                        ]
                    },
                    {
                        "id": "電力合約-ppa-與區域電網的細節與監管分析",
                        "title": "電力合約（PPA）與區域電網的細節與監管分析",
                        "h3_details": [
                            {
                                "id": "邊際電力成本-kwh-與-ppa-結構差異矩陣",
                                "title": "5.1 邊際電力成本（$/kWh）與 PPA 結構差異矩陣"
                            },
                            {
                                "id": "電網系統-rto-iso-與地緣監管差異-ercot-與-pjm-的雙重挑戰",
                                "title": "5.2 電網系統（RTO/ISO）與地緣監管差異：ERCOT 與 PJM 的雙重挑戰"
                            }
                        ]
                    },
                    {
                        "id": "與傳統-ai-資料中心橫向競爭力與-gb200-液冷工程壁壘",
                        "title": "與傳統 AI 資料中心橫向競爭力與 GB200 液冷工程壁壘",
                        "h3_details": [
                            {
                                "id": "工程規格與網路拓撲瓶頸-從空氣冷卻到直接晶片液冷",
                                "title": "6.1 工程規格與網路拓撲瓶頸：從空氣冷卻到直接晶片液冷"
                            },
                            {
                                "id": "房地產投資信託-reit-的稅務結構轉換潛力",
                                "title": "6.2 房地產投資信託 (REIT) 的稅務結構轉換潛力"
                            }
                        ]
                    },
                    {
                        "id": "機構級情境分析-scenario-analysis-與壓力測試模型",
                        "title": "機構級情境分析（Scenario Analysis）與壓力測試模型",
                        "h3_details": [
                            {
                                "id": "四大情境壓力測試矩陣",
                                "title": "7.1 4 大情境壓力測試矩陣"
                            },
                            {
                                "id": "承租方信用風險與-15-天斷電解約違約金條款",
                                "title": "7.2 承租方信用風險與 15 天斷電解約違約金條款"
                            }
                        ]
                    },
                    {
                        "id": "籌碼面與市場微觀結構-market-microstructure-分析",
                        "title": "籌碼面與市場微觀結構（Market Microstructure）分析",
                        "h3_details": [
                            {
                                "id": "可轉債套利策略-convertible-arbitrage-的長期壓制效應",
                                "title": "8.1 可轉債套利策略（Convertible Arbitrage）的長期壓制效應"
                            },
                            {
                                "id": "內部人減持-atm-融資與機構持股的微觀演變",
                                "title": "8.2 內部人減持、ATM 融資與機構持股的微觀演變"
                            }
                        ]
                    },
                    {
                        "id": "2026-2027-年各園區通電時程與總體投資策略建議",
                        "title": "2026-2027 年各園區通電時程與總體投資策略建議",
                        "h3_details": [
                            {
                                "id": "通電時程與-capex-資金缺口測算總表",
                                "title": "9.1 通電時程與 CapEx 資金缺口測算總表"
                            },
                            {
                                "id": "巨額資本支出與客戶集中度核心風險總結",
                                "title": "9.2 核心風險與交付考驗"
                            },
                            {
                                "id": "戰略總結與雙軌動態配置建議",
                                "title": "9.3 戰略總結與雙軌動態配置建議"
                            }
                        ]
                    },
                    {
                        "id": "article-analysis-header",
                        "title": "文章深度分析 推論邏輯、關鍵變數與結構性洞察",
                        "h3_details": [
                            {
                                "id": "文章推論邏輯分析",
                                "title": "10.1 文章推論邏輯分析"
                            },
                            {
                                "id": "敘事邊界與關鍵變數補充",
                                "title": "10.2 敘事邊界與關鍵變數補充"
                            },
                            {
                                "id": "mason-yang-observation",
                                "title": "10.3 Mason Yang 的觀察 (Actionable Intelligence)"
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
                "id": "20260801-crypto-mining-ai-hpc-stocks",
                "pillar": "power",
                "badge": "深度研報",
                "date": "2026-08-01",
                "title": "【北美礦企轉型 AI/HPC 全景白皮書】九大個股深度調研：估值倍數重組、PPA 電力懸崖與籌碼微觀全解析",
                "url": "../news/20260801-us-crypto-miners-ai-stocks-valuation-guide.html",
                "core_conclusion": "報告核心摘要 (Executive Summary) 產業轉型動機與帶電資產稀缺性：比特幣加權現金開採成本高達約 $79,995/BTC，利潤空間極度惡化。採礦業者憑藉 GW 等級已聯網電力容量 (Energized Power) 與高壓變電站，為超大型雲端商 (Hyperscalers) 縮短 75% 部署時間。 雙軌估值分化與 REITs 重估：透過簽…",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "75%"
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
                        "id": "執行摘要與產業轉型背景",
                        "title": "執行摘要與產業轉型背景",
                        "h3_details": []
                    },
                    {
                        "id": "近期股價大幅波動之核心驅動因素與宏觀機制",
                        "title": "近期股價大幅波動之核心驅動因素與宏觀機制",
                        "h3_details": [
                            {
                                "id": "超大型-ai-租賃合約公布引發的暴漲效應",
                                "title": "超大型 AI 租賃合約公布引發的暴漲效應"
                            },
                            {
                                "id": "總體經濟不確定性與科技股-capital-expenditure-審視引發的急挫",
                                "title": "總體經濟不確定性與科技股 Capital Expenditure 審視引發的急挫"
                            },
                            {
                                "id": "資本結構轉型與巨額資本需求帶來的股權稀釋與債務負擔",
                                "title": "資本結構轉型與巨額資本需求帶來的股權稀釋與債務負擔"
                            }
                        ]
                    },
                    {
                        "id": "全標的財務估值指標與現金燃燒率量化對比",
                        "title": "全標的財務估值指標與現金燃燒率量化對比",
                        "h3_details": [
                            {
                                "id": "全標的財務估值與籌碼數據對比矩陣",
                                "title": "3.1 全標的財務估值與籌碼數據對比矩陣"
                            },
                            {
                                "id": "財務健康度與現金燃燒率-burn-rate-深度測算",
                                "title": "3.2 財務健康度與現金燃燒率（Burn Rate）深度測算"
                            }
                        ]
                    },
                    {
                        "id": "九大重點個股深度評析與轉型檔案",
                        "title": "九大重點個股深度評析與轉型檔案",
                        "h3_details": [
                            {
                                "id": "觀察清單個股轉型模式與營運指標比較",
                                "title": "4.0 觀察清單個股轉型模式與營運指標總覽"
                            },
                            {
                                "id": "iren-iris-energy",
                                "title": "4.1 IREN (Iris Energy)"
                            },
                            {
                                "id": "corz-core-scientific",
                                "title": "4.2 CORZ (Core Scientific)"
                            },
                            {
                                "id": "hut-hut-8-corp",
                                "title": "4.3 HUT (Hut 8 Corp)"
                            },
                            {
                                "id": "cifr-cipher-digital",
                                "title": "4.4 CIFR (Cipher Digital)"
                            },
                            {
                                "id": "btbt-bit-digital",
                                "title": "4.5 BTBT (Bit Digital)"
                            },
                            {
                                "id": "hive-hive-digital-technologies",
                                "title": "4.6 HIVE (HIVE Digital Technologies)"
                            },
                            {
                                "id": "clsk-cleanspark",
                                "title": "4.7 CLSK (CleanSpark)"
                            },
                            {
                                "id": "riot-riot-platforms",
                                "title": "4.8 RIOT (Riot Platforms)"
                            },
                            {
                                "id": "mara-mara-holdings",
                                "title": "4.9 MARA (MARA Holdings)"
                            }
                        ]
                    },
                    {
                        "id": "電力合約-ppa-與區域電網的細節與監管分析",
                        "title": "電力合約（PPA）與區域電網的細節與監管分析",
                        "h3_details": [
                            {
                                "id": "邊際電力成本-kwh-與-ppa-結構差異矩陣",
                                "title": "5.1 邊際電力成本（$/kWh）與 PPA 結構差異矩陣"
                            },
                            {
                                "id": "電網系統-rto-iso-與地緣監管差異-ercot-與-pjm-的雙重挑戰",
                                "title": "5.2 電網系統（RTO/ISO）與地緣監管差異：ERCOT 與 PJM 的雙重挑戰"
                            }
                        ]
                    },
                    {
                        "id": "與傳統-ai-資料中心橫向競爭力與-gb200-液冷工程壁壘",
                        "title": "與傳統 AI 資料中心橫向競爭力與 GB200 液冷工程壁壘",
                        "h3_details": [
                            {
                                "id": "工程規格與網路拓撲瓶頸-從空氣冷卻到直接晶片液冷",
                                "title": "6.1 工程規格與網路拓撲瓶頸：從空氣冷卻到直接晶片液冷"
                            },
                            {
                                "id": "房地產投資信託-reit-的稅務結構轉換潛力",
                                "title": "6.2 房地產投資信託 (REIT) 的稅務結構轉換潛力"
                            }
                        ]
                    },
                    {
                        "id": "機構級情境分析-scenario-analysis-與壓力測試模型",
                        "title": "機構級情境分析（Scenario Analysis）與壓力測試模型",
                        "h3_details": [
                            {
                                "id": "四大情境壓力測試矩陣",
                                "title": "7.1 4 大情境壓力測試矩陣"
                            },
                            {
                                "id": "承租方信用風險與-15-天斷電解約違約金條款",
                                "title": "7.2 承租方信用風險與 15 天斷電解約違約金條款"
                            }
                        ]
                    },
                    {
                        "id": "籌碼面與市場微觀結構-market-microstructure-分析",
                        "title": "籌碼面與市場微觀結構（Market Microstructure）分析",
                        "h3_details": [
                            {
                                "id": "可轉債套利策略-convertible-arbitrage-的長期壓制效應",
                                "title": "8.1 可轉債套利策略（Convertible Arbitrage）的長期壓制效應"
                            },
                            {
                                "id": "內部人減持-atm-融資與機構持股的微觀演變",
                                "title": "8.2 內部人減持、ATM 融資與機構持股的微觀演變"
                            }
                        ]
                    },
                    {
                        "id": "2026-2027-年各園區通電時程與總體投資策略建議",
                        "title": "2026-2027 年各園區通電時程與總體投資策略建議",
                        "h3_details": [
                            {
                                "id": "通電時程與-capex-資金缺口測算總表",
                                "title": "9.1 通電時程與 CapEx 資金缺口測算總表"
                            },
                            {
                                "id": "巨額資本支出與客戶集中度核心風險總結",
                                "title": "9.2 核心風險與交付考驗"
                            },
                            {
                                "id": "戰略總結與雙軌動態配置建議",
                                "title": "9.3 戰略總結與雙軌動態配置建議"
                            }
                        ]
                    },
                    {
                        "id": "article-analysis-header",
                        "title": "文章深度分析 推論邏輯、關鍵變數與結構性洞察",
                        "h3_details": [
                            {
                                "id": "文章推論邏輯分析",
                                "title": "10.1 文章推論邏輯分析"
                            },
                            {
                                "id": "敘事邊界與關鍵變數補充",
                                "title": "10.2 敘事邊界與關鍵變數補充"
                            },
                            {
                                "id": "mason-yang-observation",
                                "title": "10.3 Mason Yang 的觀察 (Actionable Intelligence)"
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
                "id": "20260801-crypto-miners-ai-transition-institutional-analysis",
                "pillar": "power",
                "badge": "深度研報",
                "date": "2026-08-01",
                "title": "【北美礦企 AI 轉型機構級量化分析】- 雙軌競爭力如何重塑礦企選股邏輯？為何 PPA 懸崖威脅轉型時間表？解構籌碼結構與機構持倉變化",
                "url": "../news/20260801-crypto-miners-ai-transition-institutional-analysis.html",
                "core_conclusion": "2026-2027年北美礦企向 AI 資料中心轉型進入深水區。本文深度評估 9 大標的估值矩陣、現金燃燒率、PPA 電力懸崖、GB200 液冷工程壁壘、4 大壓力測試情境與可轉債套利機制。 報告核心摘要 (Executive Summary) 工程與財務驗收期：北美礦企 AI 轉型從早期題材宣佈進入工程與財務交驗期，GB200 液冷工程壁壘（120kW+/…",
                "indicators": [
                    {
                        "label": "關鍵規模",
                        "value": "$800萬"
                    },
                    {
                        "label": "關鍵規模",
                        "value": "$1,100萬"
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
                        "id": "1-執行摘要",
                        "title": "為何北美礦企 AI 轉型面臨百億 CapEx 與電網政策挑戰？",
                        "h3_details": []
                    },
                    {
                        "id": "2-財務與估值指標之量化橫向對比",
                        "title": "財務與估值指標之量化橫向對比",
                        "h3_details": [
                            {
                                "id": "2-1-全標的財務估值與籌碼數據對比矩陣",
                                "title": "2.1 全標的財務估值與籌碼數據對比矩陣"
                            },
                            {
                                "id": "2-2-財務健康度與現金燃燒率-burn-rate-深度測算",
                                "title": "2.2 財務健康度與現金燃燒率（Burn Rate）深度測算"
                            }
                        ]
                    },
                    {
                        "id": "3-電力合約-ppa-與區域電網的細節與監管分析",
                        "title": "電力合約（PPA）與區域電網的細節與監管分析",
                        "h3_details": [
                            {
                                "id": "3-1-邊際電力成本-kwh-與-ppa-結構差異矩陣",
                                "title": "3.1 邊際電力成本（$/kWh）與 PPA 結構差異矩陣"
                            },
                            {
                                "id": "3-2-電網系統-rto-iso-與地緣監管差異-ercot-與-pjm-的雙重挑戰",
                                "title": "3.2 電網系統（RTO/ISO）與地緣監管差異：ERCOT 與 PJM 的雙重挑戰"
                            }
                        ]
                    },
                    {
                        "id": "與傳統-AI-資料中心及-Neocloud-的橫向競爭力比較",
                        "title": "與傳統 AI 資料中心及 Neocloud 的橫向競爭力比較",
                        "h3_details": [
                            {
                                "id": "4-1-工程規格與網路拓撲瓶頸-從空氣冷卻到直接晶片液冷",
                                "title": "4.1 工程規格與網路拓撲瓶頸：從空氣冷卻到直接晶片液冷"
                            },
                            {
                                "id": "4-2-房地產投資信託-reit-的稅務結構轉換潛力",
                                "title": "4.2 房地產投資信託 (REIT) 的稅務結構轉換潛力"
                            }
                        ]
                    },
                    {
                        "id": "5-情境分析-scenario-analysis-與壓力測試模型",
                        "title": "情境分析（Scenario Analysis）與壓力測試模型",
                        "h3_details": []
                    },
                    {
                        "id": "6-籌碼面與市場微觀結構-market-microstructure-分析",
                        "title": "籌碼面與市場微觀結構（Market Microstructure）分析",
                        "h3_details": [
                            {
                                "id": "6-1-可轉債套利策略-convertible-arbitrage-的長期壓制效應",
                                "title": "6.1 可轉債套利策略（Convertible Arbitrage）的長期壓制效應"
                            },
                            {
                                "id": "6-2-內部人減持-atm-融資與機構持股的微觀演變",
                                "title": "6.2 內部人減持、ATM 融資與機構持股的微觀演變"
                            }
                        ]
                    },
                    {
                        "id": "2026-2027-年各園區通電時程與-CapEx-資金缺口測算表",
                        "title": "2026-2027 年各園區通電時程與 CapEx 資金缺口測算表",
                        "h3_details": []
                    },
                    {
                        "id": "8-結論",
                        "title": "結論",
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
                "id": "20260729-ai-financing-risk",
                "pillar": "capital",
                "badge": "深度研報",
                "date": "2026-07-29",
                "title": "【AI 算力融資風險與金融傳導】- 算力狂飆如何製造系統性融資泡沫？為何私募信貸曝險集中算力基礎設施？解構 CapEx 過剩與流動性壓力測試",
                "url": "../news/20260729-ai-financing-risk.html",
                "core_conclusion": "私人信貸與影子銀行承接了算力狂飆的高槓桿。核心危機源於 GPU 抵押品折舊與變現錯配，但風險被隔離於私募市場。科技巨頭強大現金流將吸收衝擊，壓力將傳導至上游代工供應鏈而非引發銀行系統崩盤。",
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
                        "id": "第一部分-市場核心主張拆解",
                        "title": "第一部分：市場核心主張拆解算力泡沫與金融風暴辨析",
                        "h3_details": []
                    },
                    {
                        "id": "第二部分-算力融資結構分析",
                        "title": "第二部分：算力融資結構分析私人信貸與資產錯配風險",
                        "h3_details": [
                            {
                                "id": "影子銀行與循環融資是否存在",
                                "title": "影子銀行與 GPU 質押融資之私人信貸實證"
                            },
                            {
                                "id": "融資模式是否構成高風險",
                                "title": "循環融資機制：Vendor Financing 與營收膨脹迴路"
                            },
                            {
                                "id": "是否會引發-系統性金融風暴",
                                "title": "金融風暴感染路徑：商業銀行暴險與 SPV 隔離效應"
                            }
                        ]
                    },
                    {
                        "id": "第三部分-實質查證方法論",
                        "title": "第三部分：實質查證方法論監管申報與資產負債表拆解",
                        "h3_details": [
                            {
                                "id": "查證影子銀行與-gpu-抵押融資",
                                "title": "GPU 抵押融資查證：LTV 警戒線與補庫條款分析"
                            },
                            {
                                "id": "查證循環融資與營收品質-round-tripping-vendor-financing",
                                "title": "循環營收查證：比對 SEC Form 10-K 關聯交易"
                            },
                            {
                                "id": "查證系統性風險評估",
                                "title": "系統性風暴壓力測試：Default Rate 衝擊模擬"
                            }
                        ]
                    },
                    {
                        "id": "第四部分-綜合風險定級",
                        "title": "第四部分：綜合風險定級台灣 AI 供應鏈防禦策略",
                        "h3_details": [
                            {
                                "id": "論述總結與風險定級",
                                "title": "算力融資風險定級：結構性緊縮 vs 系統性危機"
                            },
                            {
                                "id": "對台灣-ai-伺服器與晶片代工供應鏈之潛在衝擊",
                                "title": "台灣供應鏈二階傳導：DSO 帳款與庫存週期分析"
                            }
                        ]
                    },
                    {
                        "id": "article-analysis-header",
                        "title": "第五部分：文章推論與盲點分析 解構推論鏈條與敘事邊界補充",
                        "h3_details": [
                            {
                                "id": "文章推論邏輯分析",
                                "title": "文章推論邏輯分析"
                            },
                            {
                                "id": "敘事邊界與關鍵變數補充-counter-narratives-blindspots",
                                "title": "敘事邊界與關鍵變數補充 (Counter-Narratives & Blindspots)"
                            }
                        ]
                    },
                    {
                        "id": "mason-yang-observation",
                        "title": "第六部分：Mason Yang 的觀察 Actionable Intelligence 決策模型",
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
                "id": "20260723-google-oracle-spillover",
                "pillar": "capital",
                "badge": "深度研報",
                "date": "2026-07-23",
                "title": "【Google 財報對 Oracle 的溢出效應】- 雲端資本支出狂飆如何觸發 Oracle 數據庫遷移潮？為何 AI 工作負載重塑企業軟體定價權？解構算力需求傳導鏈",
                "url": "../news/20260723-google-oracle-spillover.html",
                "core_conclusion": "Alphabet Q2 財報證明多雲 AI 需求旺盛，為 Oracle 帶來 RPO 暴增的溢出紅利。然兩者估值路徑分化：Google 憑藉廣告現金流與 TPU 吸收 CapEx 赤字，而 Oracle 面臨 19 年租約負債與 5 年客戶合約的存續期錯配，自由現金流惡化引發 S&P 降評警告。",
                "indicators": [
                    {
                        "label": "核心參數",
                        "value": "19 年"
                    },
                    {
                        "label": "核心參數",
                        "value": "5 年"
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
                                "title": "5W1H 資本運作鏈與千億 CAPEX 擴張矩陣"
                            }
                        ]
                    },
                    {
                        "id": "第一部分-解構alphabet-2026年第二季財報-ai營收的爆發與資本支出的反噬",
                        "title": "第一部分：解構 Alphabet 2026 年第二季財報解構 Alphabet Q2 財報：AI 營收爆發與資本支出赤字化反噬",
                        "h3_details": [
                            {
                                "id": "營收與利潤的雙重擴張及業外收益的扭曲效應",
                                "title": "廣告與搜尋護城河：營收雙重擴張與業外估值重估扭曲"
                            },
                            {
                                "id": "google-cloud的非線性躍升與積壓訂單累積",
                                "title": "Google Cloud 82% 爆發軌跡：積壓訂單 5,140 億美元與 TPU 營收化"
                            },
                            {
                                "id": "資本支出的反噬-自由現金流的赤字化與股權融資",
                                "title": "CapEx 反噬機制：自由現金流 -59 億美元與 496 億美元發債股權融資"
                            }
                        ]
                    },
                    {
                        "id": "第二部分-映射效應與多雲趨勢-oracle的看漲邏輯與成長催化劑",
                        "title": "第二部分：映射效應與多雲趨勢映射效應與多雲趨勢：Oracle 看漲邏輯與 RPO 成長催化劑",
                        "h3_details": [
                            {
                                "id": "爆發性的剩餘履約義務-rpo-與營收追趕效應",
                                "title": "6,380 億美元 RPO 積壓訂單：750 億美元 GPU 預付款與 OCI 77% 增速"
                            },
                            {
                                "id": "多雲架構的戰略協同-oracle與google-cloud的無縫整合",
                                "title": "原生多雲戰略：Oracle Database@Google Cloud 與 Gemini 代理協同"
                            },
                            {
                                "id": "微軟與openai獨家協議的終結",
                                "title": "Azure 獨占條款解綁：OpenAI 300 億美元 Stargate 合約的溢出紅利"
                            },
                            {
                                "id": "oracle的核心上漲機會與潛在催化劑",
                                "title": "Oracle 核心催化劑：多雲資料庫、主權雲端與 Agentic AI 變現"
                            }
                        ]
                    },
                    {
                        "id": "第三部分-結構性裂痕-為何oracle無法完全複製google的估值路徑",
                        "title": "第三部分：結構性裂痕結構性裂痕分析：S&P 降評警告與 19 年存續期錯配風險",
                        "h3_details": [
                            {
                                "id": "標準普爾的降評警告與自由現金流的崩潰",
                                "title": "S&P 下調評級至 BBB-：FCF -236.9 億美元與 2027 財年 400 億美元融資潮"
                            },
                            {
                                "id": "致命的存續期錯配-duration-mismatch-19年資產負債-vs-5年營收承諾",
                                "title": "存續期錯配機制 (Duration Mismatch)：19 年租約義務 vs. 5 年客戶合約"
                            },
                            {
                                "id": "資本市場的認知背離-股權貪婪與債權恐懼",
                                "title": "股債市場定價割裂：股票追捧 RPO 增長 vs. 債券推高 CDS 違約利差"
                            }
                        ]
                    },
                    {
                        "id": "第四部分-ai界的雷曼兄弟-系統性集中度風險與供應鏈的循環資本",
                        "title": "第四部分：「AI 界的雷曼兄弟」系統性集中度風險：「AI 界雷曼兄弟」與供應鏈循環融資",
                        "h3_details": [
                            {
                                "id": "openai的財務黑洞與集中度危機",
                                "title": "OpenAI 3,190 億美元 RPO 集中度：2025 年淨虧 385 億美元與 IPO 推遲"
                            },
                            {
                                "id": "硬體供應鏈的-循環融資-迷思",
                                "title": "供應鏈 Circular Funding：Nvidia $3B 股權交易與 Cerebras $20B 獨家綁定"
                            },
                            {
                                "id": "微軟的對沖策略-為何只有oracle在承擔極端風險",
                                "title": "生態系對沖對比：微軟 27% 股權 + Anthropic 雙邊佈局 vs. Oracle 單邊曝險"
                            },
                            {
                                "id": "機構級雲端巨頭資產負債表與風險矩陣對比-institutional-hyperscaler-risk-matrix",
                                "title": "機構級雲端巨頭資產負債表與風險矩陣對比 (Institutional Hyperscaler Risk Matrix)"
                            }
                        ]
                    },
                    {
                        "id": "第五部分-宏觀環境下的ai泡沫指標-估值-資本支出與達康泡沫的對比",
                        "title": "第五部分：宏觀環境下的 AI 泡沫指標宏觀 AI 泡沫指標檢驗：$600B 變現缺口與達康泡沫指標對比",
                        "h3_details": [
                            {
                                "id": "投資回報率-roi-的死亡交叉",
                                "title": "ROI 死亡交叉：$690B 五大巨頭 CapEx vs. 僅 6% 企業盈餘底線改善"
                            },
                            {
                                "id": "歷史迴聲-2026年的ai狂熱與2000年的達康泡沫",
                                "title": "達康泡沫歷史迴聲：EV/EBITDA 25x、集中度 40% 與賣鏟者估值懲罰"
                            }
                        ]
                    },
                    {
                        "id": "第六部分-專業研究分析架構的建構-如何科學評估oracle的投資價值",
                        "title": "第六部分：專業研究分析架構的建構機構級五大研究分析架構：CapEx 壓力測試與 LGD 信用模型",
                        "h3_details": [
                            {
                                "id": "模組一-雲端capex與營收轉化率壓力測試-revenue-conversion-vs-capex-stress-test",
                                "title": "模組一：雲端 CapEx 與營收轉化率壓力測試 (Revenue Conversion vs. CapEx Stress Test)"
                            },
                            {
                                "id": "模組二-存續期錯配與資產減損模型-duration-mismatch-impairment-modeling",
                                "title": "模組二：存續期錯配與資產減損模型 (Duration Mismatch & Impairment Modeling)"
                            },
                            {
                                "id": "模組三-交易對手集中度與信用違約風險-counterparty-credit-risk-lgd",
                                "title": "模組三：交易對手集中度與信用違約風險 (Counterparty Credit Risk & LGD)"
                            },
                            {
                                "id": "模組四-生態系統與供應鏈防禦力分析-ecosystem-hedging-supply-chain-dynamics",
                                "title": "模組四：生態系統與供應鏈防禦力分析 (Ecosystem Hedging & Supply Chain Dynamics)"
                            },
                            {
                                "id": "模組五-跨市場套利與動態估值策略-cross-market-arbitrage-valuation",
                                "title": "模組五：跨市場套利與動態估值策略 (Cross-Market Arbitrage & Valuation)"
                            }
                        ]
                    },
                    {
                        "id": "結論",
                        "title": "結論：高槓桿 AI 基礎設施的豪賭與系統性尾部風險",
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
                "id": "20260718-openai-finance-crisis",
                "pillar": "capital",
                "badge": "深度研報",
                "date": "2026-07-18",
                "title": "【OpenAI 財務危機情境推演】- 星門超算資本開支如何引發 Oracle 溢出效應？為何 50 億美元年虧損難以為繼？解構 AI 泡沫破裂與流動性傳導路徑",
                "url": "../news/20260718-openai-finance-crisis.html",
                "core_conclusion": "本文分析指出「OpenAI 財務危機與 Oracle 星門悖論：全球 AI 泡沫崩潰情境推演」的核心邏輯在於市場供需失衡與產業結構演化。受制於資本開支門檻與總體流動性變化，領先企業透過技術護城河與長約機制鎖定資產溢價，驅動整體產業進行重估值。",
                "indicators": [
                    {
                        "label": "關鍵規模",
                        "value": "50 億"
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
                        "id": "1導論人工智慧基礎設施超級週期與資本脆弱性",
                        "title": "導論人工智慧基礎設施超級週期與資本脆弱性",
                        "h3_details": []
                    },
                    {
                        "id": "2第一階段分析解構-openai-的財務黑洞與流動性幻象",
                        "title": "第一階段分析解構 OpenAI 的財務黑洞與流動性幻象",
                        "h3_details": [
                            {
                                "id": "營收與成本的極端失衡及會計操作",
                                "title": "營收與成本的極端失衡及會計操作"
                            },
                            {
                                "id": "千億美元融資與二零三零年的流動性挑戰",
                                "title": "千億美元融資與二零三零年的流動性挑戰"
                            }
                        ]
                    },
                    {
                        "id": "3第二階段分析結構性不對等與-星門悖論-下的-oracle-財報危機",
                        "title": "第二階段分析結構性不對等與「星門悖論」下的 Oracle 財報危機",
                        "h3_details": [
                            {
                                "id": "商業角色的極端不對等-builder-vs-brain",
                                "title": "商業角色的極端不對等（Builder vs. Brain）"
                            },
                            {
                                "id": "剩餘履約義務-rpo-的過度集中與現金流惡化",
                                "title": "剩餘履約義務（RPO）的過度集中與現金流惡化"
                            },
                            {
                                "id": "致命的期限錯配-duration-mismatch",
                                "title": "致命的期限錯配（Duration Mismatch）"
                            }
                        ]
                    },
                    {
                        "id": "4第三階段分析悲觀環境下-oracle-財報的毀滅性推演",
                        "title": "第三階段分析悲觀環境下 Oracle 財報的毀滅性推演",
                        "h3_details": [
                            {
                                "id": "1-營收預期幻滅與資產減損的雙重打擊",
                                "title": "1. 營收預期幻滅與資產減損的雙重打擊"
                            },
                            {
                                "id": "2-信用評級降至垃圾級-junk-status-與債務契約違約",
                                "title": "2. 信用評級降至垃圾級（Junk Status）與債務契約違約"
                            },
                            {
                                "id": "3-融資螺旋崩潰與流動性枯竭",
                                "title": "3. 融資螺旋崩潰與流動性枯竭"
                            }
                        ]
                    },
                    {
                        "id": "5第四階段分析微軟戰略性撤退與產業風險重分配的催化劑",
                        "title": "第四階段分析微軟戰略性撤退與產業風險重分配的催化劑",
                        "h3_details": [
                            {
                                "id": "結束-azure-獨家經銷權與收入分成重構",
                                "title": "結束 Azure 獨家經銷權與收入分成重構"
                            },
                            {
                                "id": "微軟的風險對沖與-oracle-的-接盤",
                                "title": "微軟的風險對沖與 Oracle 的「接盤」"
                            }
                        ]
                    },
                    {
                        "id": "6第五階段分析連帶受-openai-影響的全球連續泡沫崩潰傳導機制",
                        "title": "第五階段分析連帶受 OpenAI 影響的全球連續泡沫崩潰傳導機制",
                        "h3_details": [
                            {
                                "id": "第一波衝擊波-新興硬體與-ai-晶片業者的滅頂之災",
                                "title": "第一波衝擊波：新興硬體與 AI 晶片業者的滅頂之災"
                            },
                            {
                                "id": "第二波衝擊波-nvidia-的營收重挫與半導體供應鏈的寒冬",
                                "title": "第二波衝擊波：Nvidia 的營收重挫與半導體供應鏈的寒冬"
                            }
                        ]
                    },
                    {
                        "id": "7嚴重程度情境推演從估值重估到全球系統性金融危機",
                        "title": "嚴重程度情境推演從估值重估到全球系統性金融危機",
                        "h3_details": [
                            {
                                "id": "情境一-輕中度震盪-估值擠水分與產業重組",
                                "title": "情境一：輕中度震盪（估值擠水分與產業重組）"
                            },
                            {
                                "id": "情境二-重度打擊-ai-寒冬-2-0-與信貸違約潮",
                                "title": "情境二：重度打擊（AI 寒冬 2.0 與信貸違約潮）"
                            },
                            {
                                "id": "情境三-極端災難-系統性金融危機與-ai-界的雷曼時刻",
                                "title": "情境三：極端災難（系統性金融危機與「AI 界的雷曼時刻」）"
                            }
                        ]
                    },
                    {
                        "id": "8結論",
                        "title": "結論",
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
                "id": "20260702-memory-short-selling-analysis",
                "pillar": "silicon",
                "badge": "深度研報",
                "date": "2026-07-02",
                "title": "【記憶體產業放空戰略】- 現貨與合約價背離如何鎖定放空拐點？為何強制回補是致命軋空陷阱？解構 DRAM 景氣循環與借券賣出避險機制",
                "url": "../news/20260702-memory-short-selling-analysis.html",
                "core_conclusion": "本篇研究《【記憶體產業放空戰略 2026】- 現貨與合約價背離如何鎖定放空拐點？為何強制回補是致命軋空陷阱？解構 DRAM 景氣循環與借券賣出避險機制》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
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
                        "id": "緒論與矽震盪下的總體經濟背景",
                        "title": "緒論與矽震盪下的總體經濟背景",
                        "h3_details": []
                    },
                    {
                        "id": "近期劇烈下跌的記憶體類股盤點與市況重建",
                        "title": "近期劇烈下跌的記憶體類股盤點與市況重建",
                        "h3_details": [
                            {
                                "id": "全球記憶體三大巨頭的崩跌路徑",
                                "title": "全球記憶體三大巨頭的崩跌路徑"
                            },
                            {
                                "id": "台灣記憶體供應鏈的全面倒壓",
                                "title": "台灣記憶體供應鏈的全面倒壓"
                            }
                        ]
                    },
                    {
                        "id": "崩跌背後的核心驅動因素與市場論述",
                        "title": "崩跌背後的核心驅動因素與市場論述",
                        "h3_details": [
                            {
                                "id": "一-景氣循環高點提前的預警-the-cycle-peak-repricing",
                                "title": "一、景氣循環高點提前的預警（The Cycle Peak Repricing）"
                            },
                            {
                                "id": "二-供給端衝擊-中國大廠的激進擴產與地緣政治角力",
                                "title": "二、供給端衝擊：中國大廠的激進擴產與地緣政治角力"
                            },
                            {
                                "id": "三-需求端反噬-高漲報價排擠效應與消費性電子疲軟",
                                "title": "三、需求端反噬：高漲報價排擠效應與消費性電子疲軟"
                            },
                            {
                                "id": "四-ai資本支出泡沫化疑慮與南韓的-過度投資-恐慌",
                                "title": "四、AI資本支出泡沫化疑慮與南韓的「過度投資」恐慌"
                            },
                            {
                                "id": "五-各次領域記憶體的重新定價與現貨價的-死亡交叉",
                                "title": "五、各次領域記憶體的重新定價與現貨價的「死亡交叉」"
                            }
                        ]
                    },
                    {
                        "id": "如何判斷是否可以加入放空-技術面-基本面與籌碼面綜合框架",
                        "title": "如何判斷是否可以加入放空？（技術面、基本面與籌碼面綜合框架）",
                        "h3_details": [
                            {
                                "id": "步驟一-基本面領先指標的確認-the-fundamental-trigger",
                                "title": "步驟一：基本面領先指標的確認（The Fundamental Trigger）"
                            },
                            {
                                "id": "步驟二-技術面與量價結構的破壞-the-technical-breakdown",
                                "title": "步驟二：技術面與量價結構的破壞（The Technical Breakdown）"
                            },
                            {
                                "id": "步驟三-籌碼面深度解析-借券賣出-與-融券-的攻防",
                                "title": "步驟三：籌碼面深度解析——「借券賣出」與「融券」的攻防"
                            }
                        ]
                    },
                    {
                        "id": "放空實務中的致命風險-除權息與強制回補引發的軋空風暴",
                        "title": "放空實務中的致命風險：除權息與強制回補引發的軋空風暴",
                        "h3_details": [
                            {
                                "id": "強制回補機制的運作與計算",
                                "title": "強制回補機制的運作與計算"
                            },
                            {
                                "id": "近期記憶體個股的除權息時程與軋空風險評估",
                                "title": "近期記憶體個股的除權息時程與軋空風險評估"
                            }
                        ]
                    },
                    {
                        "id": "結論與戰略建議",
                        "title": "結論與戰略建議",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "20260527-memory-supercycle-analysis",
                "pillar": "silicon",
                "badge": "深度研報",
                "date": "2026-05-27",
                "title": "【記憶體超級週期解析】- AI 驅動 HBM 需求如何排擠傳統 DRAM 產能？為何價格傳導邏輯出現斷層？解構三星、SK 海力士與美光的競局",
                "url": "../news/20260527-memory-supercycle-analysis.html",
                "core_conclusion": "本文分析指出「全球記憶體產業超級循環：上漲因素、價格傳導機制與上下游獲利鏈條之深度解析」的核心邏輯在於市場供需失衡與產業結構演化。受制於資本開支門檻與總體流動性變化，領先企業透過技術護城河與長約機制鎖定資產溢價，驅動整體產業進行重估值。",
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
                                "title": "記憶體超級循環的 5W1H 核心認知架構"
                            }
                        ]
                    },
                    {
                        "id": "chapter-1",
                        "title": "總體經濟背景與半導體產業鏈之底層架構",
                        "h3_details": [
                            {
                                "id": "section-1-1",
                                "title": "1.1 半導體、晶圓與積體電路的物理與工程定義"
                            },
                            {
                                "id": "section-1-2",
                                "title": "1.2 供應鏈的層次結構與地理韌性重塑"
                            }
                        ]
                    },
                    {
                        "id": "chapter-2",
                        "title": "記憶體產業週期性的底層邏輯與長鞭效應",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "2.1 產能僵固性與長鞭效應的結合"
                            },
                            {
                                "id": "section-2-2",
                                "title": "2.2 台灣供應鏈在記憶體版圖中的戰略定位"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "超級循環的催化劑——AI算力爆發與「記憶體牆」的物理極限",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "3.1 突破算力瓶頸：AI時代的「記憶體牆」挑戰"
                            },
                            {
                                "id": "section-3-2",
                                "title": "3.2 HBM 的崛起與台積電的關鍵角色"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "物理法則與市場擠壓——「產能排擠效應」的全面發酵",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "4.1 晶圓轉換的物理學：殘酷的 3 比 1 損耗率"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "合約市場與現貨市場的雙軌價格傳導機制",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-6",
                        "title": "企業訂單至獲利的財務傳導鏈條與關鍵量化指標",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-7",
                        "title": "景氣循環反轉的風險評估與「AI純度」檢驗",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-8",
                        "title": "總結與戰略展望",
                        "h3_details": []
                    },
                    {
                        "id": "section-analysis-title",
                        "title": "文章深度分析與觀察",
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
                "id": "20260526-web4-agent-driven-intelligent-network",
                "pillar": "agent",
                "badge": "深度研報",
                "date": "2026-05-26",
                "title": "【Web4 AI Agent 智慧網路架構】- EIP-7702 如何釋放代理人自主決策能力？為何 Anoma 意圖架構顛覆傳統交易邏輯？解構 DePIN 算力變革與去中心化未來",
                "url": "../news/20260526-web4-agent-driven-intelligent-network.html",
                "core_conclusion": "本篇研究《【Web4 AI Agent 智慧網路架構 2026】- EIP-7702 如何釋放代理人自主決策能力？為何 Anoma 意圖架構顛覆傳統交易邏輯？解構 DePIN 算力變革與去中心化未來》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
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
                                "title": "Web4 時代 AI 智能網路的 5W1H 核心認知架構"
                            }
                        ]
                    },
                    {
                        "id": "chapter-1",
                        "title": "一、引言：網路演進的終局與 Web4 的真實樣貌",
                        "h3_details": [
                            {
                                "id": "section-1-summary",
                                "title": "網路典範轉移：機器人自主營運經濟體的偉大跨越"
                            }
                        ]
                    },
                    {
                        "id": "chapter-2",
                        "title": "二、Web3 的未竟之業：有了所有權，然後呢？",
                        "h3_details": [
                            {
                                "id": "section-2-summary",
                                "title": "反人類體驗與高摩擦力：Web3 走向大眾市場的結構性瓶頸"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "三、Web4 的靈魂：Agent 驅動的意圖網路 (Intent-Centric)",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "1. 意圖架構的底層機制與 Anoma 協議的顛覆"
                            },
                            {
                                "id": "section-3-2",
                                "title": "2. 技術橋樑：帳戶抽象 (ERC-4337) 與 EIP-7702 的典範轉移"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "四、支撐 Web4 的實體巨獸：算力、邊緣運算與物聯網 (硬體與科技股視角)",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "1. 雲端大腦：AI 算力基礎設施與超級電腦的爆發"
                            },
                            {
                                "id": "section-4-2",
                                "title": "2. 神經反射：邊緣運算 (Edge AI) 與終端晶片的革命"
                            },
                            {
                                "id": "section-4-3",
                                "title": "3. 感覺器官與手腳：物聯網 (IoT) 與抗衡壟斷的 DePIN 網路"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "五、Web4 的金融血液：為什麼代幣經濟與穩定幣是必然？",
                        "h3_details": [
                            {
                                "id": "section-5-1",
                                "title": "1. Agent 的去權限化身份 (Permissionless) 與雙鑰匙錢包架構"
                            },
                            {
                                "id": "section-5-2",
                                "title": "2. 金錢的 API 化：微交易與穩定幣結算軌道"
                            },
                            {
                                "id": "section-5-3",
                                "title": "3. Agentic Commerce：EIP-8004 與 EIP-8183 的商業協議革命"
                            },
                            {
                                "id": "section-5-4",
                                "title": "4. AMM 隱形交換帶來無摩擦的極致體驗"
                            }
                        ]
                    },
                    {
                        "id": "chapter-6",
                        "title": "六、隱憂與挑戰：黑暗森林與安全邊界",
                        "h3_details": [
                            {
                                "id": "section-6-1",
                                "title": "1. 流氓代理 (Rogue Agents) 與提示詞注入 (Prompt Injection) 的系統級災難"
                            },
                            {
                                "id": "section-6-2",
                                "title": "2. 密碼學技術與硬體信任根的必要性"
                            }
                        ]
                    },
                    {
                        "id": "chapter-7",
                        "title": "七、結語：迎接 AI 與 Crypto 共生的新紀元",
                        "h3_details": []
                    },
                    {
                        "id": "article-analysis-conclusion",
                        "title": "文章分析與結論",
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
                "id": "20260526-mara-ai-transition-valuation",
                "pillar": "power",
                "badge": "深度研報",
                "date": "2026-05-26",
                "title": "【挖礦股估值重塑】- MARA 與 IREN 轉型 AI 算力如何衝擊傳統 EV/Hashrate 估值？為何 MSTR 資本困境成對比基準？解構雙軌競爭力與 CapEx 懸崖",
                "url": "../news/20260526-mara-ai-transition-valuation.html",
                "core_conclusion": "本篇研究《【挖礦股估值重塑 2026】- MARA 與 IREN 轉型 AI 算力如何衝擊傳統 EV/Hashrate 估值？為何 MSTR 資本困境成對比基準？解構雙軌競爭力與 CapEx 懸崖》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
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
                                "title": "比特幣挖礦股轉型 AI 算力的 5W1H 核心認知架構"
                            }
                        ]
                    },
                    {
                        "id": "chapter-1",
                        "title": "第一章：產業典範轉移與宏觀經濟背景",
                        "h3_details": [
                            {
                                "id": "section-1-1",
                                "title": "1.1 AI 算力飢渴與基礎電力設施的絕對稀缺性"
                            },
                            {
                                "id": "section-1-2",
                                "title": "1.2 能源套利機制的深化與「算力即服務」的物理融合"
                            },
                            {
                                "id": "section-1-3",
                                "title": "1.3 資本支出鴻溝與物理基礎設施的挑戰"
                            }
                        ]
                    },
                    {
                        "id": "chapter-2",
                        "title": "第二章：MARA 核心轉型策略解析——「加密與 AI 雙引擎」佈局",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "2.1 算力垂直整合與 Long Ridge 能源中樞收購案"
                            },
                            {
                                "id": "section-2-2",
                                "title": "2.2 Starwood 資本合資：打通高階 AI 算力的財務通道"
                            },
                            {
                                "id": "section-2-3",
                                "title": "2.3 併購 Exaion：掌握核心冷卻與雲端編排技術"
                            },
                            {
                                "id": "section-2-4",
                                "title": "2.4 財務陣痛與比特幣儲備戰略的重大妥協"
                            },
                            {
                                "id": "section-2-5",
                                "title": "2.5 本業挖礦的防禦性擴張與 50 EH/s 目標"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "第三章：資本結構脆弱性與純加密代理商的困境：以微策略 (MSTR) 為例",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "3.1 鉅額帳面虧損與「不賣幣」神話的破滅"
                            },
                            {
                                "id": "section-3-2",
                                "title": "3.2 優先股 STRC 的雙面刃與流動性緊縮的反射性迴圈"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "第四章：同業競爭格局與 AI 算力板塊的 Alpha 收益驗證",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "4.1 基礎資產盤整與「算力溢價」的強烈背離"
                            },
                            {
                                "id": "section-4-2",
                                "title": "4.2 IREN：NVIDIA 34億美元合約加持的新世代雲端巨頭"
                            },
                            {
                                "id": "section-4-3",
                                "title": "4.3 TeraWulf (WULF)：HPC 營收實質反超本業的高利潤典範"
                            },
                            {
                                "id": "section-4-4",
                                "title": "4.4 RIOT 與 CleanSpark：產能擴張與估值分歧的觀望者"
                            },
                            {
                                "id": "section-4-5",
                                "title": "4.5 2026 年 5 月大型礦企財務與市場估值對比矩陣"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "第五章：MARA 估值模型轉換與未來向上重估 (Re-rating) 空間",
                        "h3_details": [
                            {
                                "id": "section-5-1",
                                "title": "5.1 從高 Beta 挖礦股到數據中心基礎設施的 Multiple Expansion"
                            },
                            {
                                "id": "section-5-2",
                                "title": "5.2 2026 年底 AI 營收佔比達標路徑與財務貢獻預測"
                            },
                            {
                                "id": "section-5-3",
                                "title": "5.3 潛在風險：資本支出、SLA 違約與監管壓力"
                            }
                        ]
                    },
                    {
                        "id": "chapter-6",
                        "title": "第六章：總結與投資建議",
                        "h3_details": [
                            {
                                "id": "section-6-1",
                                "title": "6.1 能源、算力與資本的終極角力"
                            },
                            {
                                "id": "section-6-2",
                                "title": "6.2 雙重投資邏輯與戰略研判"
                            },
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
                "id": "20260521-amd-valuation-deception",
                "pillar": "silicon",
                "badge": "深度研報",
                "date": "2026-05-21",
                "title": "【AMD 估值騙局解密】- 投行 AI 樂觀敘事如何遭遇現實撞擊？為何 MI350 產能瓶頸引發殺估值？拆解營收虛增與真實供需真相",
                "url": "../news/20260521-amd-valuation-deception.html",
                "core_conclusion": "本文分析指出「華爾街的估值幻象：拆解投資銀行調高 AMD 目標價的敘事騙局與供需失衡真相」的核心邏輯在於市場供需失衡與產業結構演化。受制於資本開支門檻與總體流動性變化，領先企業透過技術護城河與長約機制鎖定資產溢價，驅動整體產業進行重估值。",
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
                                "title": "AMD 估值騙局的 5W1H 核心認知架構"
                            }
                        ]
                    },
                    {
                        "id": "section-1",
                        "title": "投行集體調高目標價的「敘事陷阱」與賣方偏誤解析",
                        "h3_details": [
                            {
                                "id": "section-1-1",
                                "title": "估值騙局的本質：利益驅動的賣方偏誤"
                            }
                        ]
                    },
                    {
                        "id": "section-2",
                        "title": "伺服器 CPU 的結構性變革：x86 復興虛妄論與 ARM 侵蝕真相",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "能效比即正義：雲端巨頭的「去 x86 化」"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "供給端數據證偽：先進封裝與記憶體供應的物理極限",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "台積電 CoWoS 產能的排他性分配"
                            },
                            {
                                "id": "section-3-2",
                                "title": "HBM3e 供應鏈的絕對斷裂"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "需求與成本偏誤：TCO 幻覺與 CUDA 生態系高牆",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "三年期 TCO 的數學拆解：隱形成本黑洞"
                            },
                            {
                                "id": "section-4-2",
                                "title": "CUDA 的絕對軟體壁壘與效能赤字"
                            }
                        ]
                    },
                    {
                        "id": "section-5",
                        "title": "總體資本支出過熱、環形融資與估值修正壓力",
                        "h3_details": [
                            {
                                "id": "section-5-1",
                                "title": "AI 生態系統的營收與支出失衡"
                            },
                            {
                                "id": "section-5-2",
                                "title": "最先倒下的骨牌：估值嚴重透支的 AMD"
                            }
                        ]
                    },
                    {
                        "id": "section-6",
                        "title": "結論：理性的短線放空與風險防範",
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
                    }
                ]
            },
            {
                "id": "20260517-memory-semiconductor-short-analysis",
                "pillar": "silicon",
                "badge": "深度研報",
                "date": "2026-05-17",
                "title": "【記憶體半導體做空戰略】- AI 超級週期如何掩蓋結構性供過於求？為何 HBM 需求無法支撐 DRAM 均線？解構軋空風險與估值重設時間表",
                "url": "../news/20260517-memory-semiconductor-short-analysis.html",
                "core_conclusion": "本篇研究《【記憶體半導體做空戰略 2026】- AI 超級週期如何掩蓋結構性供過於求？為何 HBM 需求無法支撐 DRAM 均線？解構軋空風險與估值重設時間表》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
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
                        "title": "AI 算力通膨如何重塑記憶體戰略稀缺性？3比1產能排擠如何引發報價通膨？為何不可撤銷合約能提供強大的抗跌安全墊？",
                        "h3_details": [
                            {
                                "id": "section-5w1h-core",
                                "title": "算力通膨稀缺性轉型：高頻寬記憶體排擠效應帶動 2026 年總體產值衝破 1.3 兆美元"
                            }
                        ]
                    },
                    {
                        "id": "sector-composition",
                        "title": "傳統記憶體三巨頭如何分化？美光為何全面轉向雲端運算？SanDisk 分拆獨立後如何以合約鎖定高溢價？",
                        "h3_details": [
                            {
                                "id": "major-stocks-list",
                                "title": "高階製程產能重構：美光退出消費市場並轉向 AI 伺服器帶動 SanDisk 鎖定 420 億美元契約護城河"
                            }
                        ]
                    },
                    {
                        "id": "valuation-metrics",
                        "title": "龍頭本益比創歷史新高背後的真實預期是什麼？為何美光 2027 前瞻本益比僅 7.8 倍？三星電子為何被視為防禦型窪地？",
                        "h3_details": [
                            {
                                "id": "financial-data-table",
                                "title": "2026 年 5 月記憶體估值比較矩陣：美光滾動 PE 達 42 倍與前瞻 PE 7.8 倍的極端重估對比"
                            },
                            {
                                "id": "valuation-interpretation",
                                "title": "三星電子估值窪地重估潛力：市淨率 2.97 倍顯著低於同業平均 6.5 倍的爆發修復空間"
                            }
                        ]
                    },
                    {
                        "id": "valuation-assessment",
                        "title": "這場 AI 浪潮是長線價值重估還是極端泡沫？3比1晶圓排擠效應如何鎖定底部報價？為何科技股市值集中度成為最大警訊？",
                        "h3_details": [
                            {
                                "id": "structural-shift",
                                "title": "3比1實體產能排擠效應：單一 HBM 晶圓消耗三片傳統 DDR5 產能帶動合約報價剛性支撐"
                            },
                            {
                                "id": "bubble-risks",
                                "title": "市值集中度極值警訊：前 20 大科技巨頭佔總市值 21.4% 超越 2000 年網絡泡沫巔峰"
                            }
                        ]
                    },
                    {
                        "id": "technical-analysis",
                        "title": "記憶體半導體板塊是否已現右側頂部信號？美光跌破 50 日線意味著什麼？SanDisk 正 3 標準差乖離率如何暴露機構出貨動態？",
                        "h3_details": [
                            {
                                "id": "micron-technical",
                                "title": "美光量大實體陰線破位：日線 RSI 觸及 88 歷史極值後首度放量跌破 50 日均線多空轉折點"
                            },
                            {
                                "id": "sandisk-technical",
                                "title": "SanDisk 正 65% 乖離率極值警示：週線黃昏之星反轉型態伴隨高位爆量顯現機構派發跡象"
                            },
                            {
                                "id": "wdc-taiwan-technical",
                                "title": "二線特殊型 DRAM 輪動崩潰：南亞科與華邦電缺乏 HBM 毛利保護觸發比龍頭更猛烈的補跌效應"
                            }
                        ]
                    },
                    {
                        "id": "short-strategy",
                        "title": "專業避險基金如何制定高位做空與對沖策略？為何直接放空美光賠率極低？如何防範 420 億美元合約剛性所引爆的暴力軋空？",
                        "h3_details": [
                            {
                                "id": "short-criteria",
                                "title": "右側做空量化觸發標準：DRAM 現貨綜合均價連三週環比下跌與下游庫存天數逾 1.5 倍轉折信號"
                            },
                            {
                                "id": "entry-exit-rules",
                                "title": "分批建倉與目標回補紀律：反彈阻力位分三批建立部位並鎖定 200 日均線 25% 波段空頭報酬"
                            },
                            {
                                "id": "short-squeeze-risks",
                                "title": "合約剛性與暴力軋空防禦：SanDisk 420 億美元 RPO 契約保護與大廠百億回購威脅的致命反噬風險"
                            }
                        ]
                    },
                    {
                        "id": "conclusion",
                        "title": "宏觀交易員面對二極化估值該如何操作？多空配對交易如何鎖定利潤？為何逢低買進三星與逢高做空二線能建構非對稱優勢？",
                        "h3_details": []
                    },
                    {
                        "id": "mason-yang-observation",
                        "title": "Mason Yang 的戰略觀察 (Actionable Intelligence)",
                        "h3_details": []
                    },
                    {
                        "id": "references",
                        "title": "專業投研機構引用的文獻與原始數據來源",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "20260513-china-ai-competitive-advantage-analysis",
                "pillar": "capital",
                "badge": "深度研報",
                "date": "2026-05-13",
                "title": "【中國 AI 產業競爭力架構】- 能源成本優勢如何彌補硬體封鎖缺口？為何本土算力效率超越西方預期？解構 DeepSeek 路徑與產出效率指標",
                "url": "../news/20260513-china-ai-competitive-advantage-analysis.html",
                "core_conclusion": "本文分析指出「中國 AI 產業競爭力架構：能源、硬體與產出效率分析 (2026)」的核心邏輯在於市場供需失衡與產業結構演化。受制於資本開支門檻與總體流動性變化，領先企業透過技術護城河與長約機制鎖定資產溢價，驅動整體產業進行重估值。",
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
                        "title": "為何中國 AI 算力基礎設施能在美國極端封鎖下實現逆勢狂飆？東數西算工程如何徹底抹平數位經濟的電力瓶頸？為何這場競賽的本質是電子缺口與綠電耦合的世紀博弈？",
                        "h3_details": [
                            {
                                "id": "section-1-1",
                                "title": "東數西算國家級工程與天然冷卻 PUE 奇蹟：內蒙古單一集群年省五百萬度電與算力套利"
                            },
                            {
                                "id": "section-1-2",
                                "title": "289 TWh 算力耗電巨流與綠電算力一體化：太陽能裝機井噴與風光波動性精準預測調度"
                            },
                            {
                                "id": "section-1-3",
                                "title": "中美電力網電子缺口 Electron Gap 底層對峙：美國電網老化瓶頸對抗中國特高壓 UHV 輸電紅利"
                            }
                        ]
                    },
                    {
                        "id": "section-2",
                        "title": "面對先進製程徹底斷供中國硬體如何發動系統性突圍？為何國產伺服器在一年內狂奪超過 40% 市佔？華為 CANN 生態如何正面對決 Nvidia CUDA 的十年壟斷？",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "Ascend 910C 與崑崙芯三萬卡訓練矩陣實測：華為 160 萬片產能爆發與文心一言底層生態支撐"
                            },
                            {
                                "id": "section-2-2",
                                "title": "Super Pod 萬卡集群互聯與系統級算力補償機制：超高頻寬內聯網打破單卡性能天花板"
                            },
                            {
                                "id": "section-2-3",
                                "title": "CANN 開源戰略與異構運算底層重構：克服初期工具鏈壁壘與 DeepSeek 推理性能追平紀實"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "在算力極度貧乏的土壤中如何誕生 DeepSeek 這般震驚世界的演算法奇蹟？為何 MoE 稀疏化與原生稀疏注意力成為算力突圍利器？當具身智慧與實體工業深度整合時將釋放何種核彈級紅利？",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "混合專家架構 MoE 參數稀疏化與訓練成本革命：37B 推理激活效率極限與極低算力門檻突破"
                            },
                            {
                                "id": "section-3-2",
                                "title": "全球 70% 智慧電動車與 54% 工業機器人底座紅利：海量物理世界反饋迴圈與具身智慧降維打擊"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "若剝開表面匯率迷霧真實的中國 AI 資本支出究竟有多恐怖？為何 PPP 調整後的每一美元實質購買力直逼美國的兩倍？內陸外包與垂直整合供應鏈如何轉化為無可替代的時間優勢？",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "PPP 購買力平價校正與 980 億美元真實研發購買力：直逼美國近三千億水準的極限模型迭代效率"
                            },
                            {
                                "id": "section-4-2",
                                "title": "內陸資料標註外包與全鏈條硬體自給優勢：從稀土到伺服器免受全球配電變壓器交期拖累"
                            }
                        ]
                    },
                    {
                        "id": "section-5",
                        "title": "EUV 光刻機缺失與 HBM 記憶體斷供將帶來何種窒息式挑戰？為何國產算力伺服器頻寬瓶頸成為短期難以跨越的高牆？嚴格的跨境資料流動監管又將如何推升商業化合規摩擦？",
                        "h3_details": [
                            {
                                "id": "section-5-1",
                                "title": "長鑫存儲 HBM 頻寬限制與五奈米製程天險：訓練效率損耗與頂尖原創理論人才密度考驗"
                            },
                            {
                                "id": "section-5-2",
                                "title": "內容審查與資料跨境流動監管合規矩陣：商用化週期拉長與境內外生態隔離的雙刃劍"
                            }
                        ]
                    },
                    {
                        "id": "section-6",
                        "title": "這場不對稱的世紀大博弈最終將導向何種終局？為何打造社會化生產體系才是跨越算力封鎖的終極解藥？操盤手如何鎖定高產出電性比生態鏈贏家？",
                        "h3_details": [
                            {
                                "id": "section-6-1",
                                "title": "社會化大生產體系構建與全方位數位化擴張：算力普惠化與自主產業生態鏈成型"
                            },
                            {
                                "id": "section-6-2",
                                "title": "高產出電性比生態鏈龍頭價值重估紀實：二零二六主導全球電動車與具身智慧底座紅利"
                            }
                        ]
                    },
                    {
                        "id": "mason-yang-observation",
                        "title": "Mason Yang 的觀察 (Actionable Intelligence)",
                        "h3_details": []
                    },
                    {
                        "id": "part-2",
                        "title": "Part 2: 全域算力重構與 Mason Yang 的觀察",
                        "h3_details": [
                            {
                                "id": "summary-5w1h",
                                "title": "2026中國AI突圍 5W1H 認知矩陣：算力封鎖下的系統級能源轉化與全球定價權博弈"
                            },
                            {
                                "id": "inference-logic",
                                "title": "系統性效能補償與推論傳導鏈條：從西部廉價綠電調度到萬卡互聯總體產出平權"
                            },
                            {
                                "id": "logic-blindspots",
                                "title": "非共識敘事邊界與長週期變數盤點：防範特高壓輸電極端脆弱性與頂尖理論突破天花板"
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
                "id": "20260512-ev-charging-bottleneck-analysis",
                "pillar": "power",
                "badge": "深度研報",
                "date": "2026-05-12",
                "title": "【特斯拉兆瓦級能源與電網瓶頸】- 超充基礎設施如何觸碰電網整合天花板？為何自動駕駛能耗需求加劇電力供需矛盾？解構特斯拉成長瓶頸與能源戰略",
                "url": "../news/20260512-ev-charging-bottleneck-analysis.html",
                "core_conclusion": "本篇研究《【特斯拉兆瓦級能源與電網瓶頸 2026】- 超充基礎設施如何觸碰電網整合天花板？為何自動駕駛能耗需求加劇電力供需矛盾？解構特斯拉成長瓶頸與能源戰略》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
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
                        "title": "特斯拉營收組成之結構性轉變與市場增長瓶頸",
                        "h3_details": [
                            {
                                "id": "section-1-1",
                                "title": "1.1 營收細分項目與利潤率分析"
                            },
                            {
                                "id": "section-1-2",
                                "title": "1.2 全球市場份額的流失與競爭格局"
                            }
                        ]
                    },
                    {
                        "id": "section-2",
                        "title": "特斯拉車型電力架構之演進與分化",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "2.1 乘用車系列之技術基準與家用充電限制"
                            },
                            {
                                "id": "section-2-2",
                                "title": "2.2 Cybertruck：800V 時代與 48V 低壓系統"
                            },
                            {
                                "id": "section-2-3",
                                "title": "2.3 Tesla Semi：兆瓦級能源需求與物流經濟學"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "現有充電站無法滿足大型電動車的原因分析",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "3.1 物理尺寸與幾何佈局之障礙"
                            },
                            {
                                "id": "section-3-2",
                                "title": "3.2 電力供需規模的巨大差異"
                            },
                            {
                                "id": "section-3-3",
                                "title": "3.3 熱管理與電纜物理極限"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "自動駕駛車隊的電力與能源需求估算",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "4.1 Robotaxi（Cybercab）：無線補能與 UWB 定位"
                            },
                            {
                                "id": "section-4-2",
                                "title": "4.2 額外計算負擔與能效衰減"
                            },
                            {
                                "id": "section-4-3",
                                "title": "4.3 規模化車隊電力消耗試算"
                            }
                        ]
                    },
                    {
                        "id": "section-5",
                        "title": "核心建置瓶頸：電力網與基礎設施供應鏈",
                        "h3_details": [
                            {
                                "id": "section-5-1",
                                "title": "5.1 電網接入延遲：950 天的通電時間牆"
                            },
                            {
                                "id": "section-5-2",
                                "title": "5.2 變壓器供應鏈危機：120 週交貨期與 AI 搶食產能"
                            },
                            {
                                "id": "section-5-3",
                                "title": "5.3 晶片與運算能耗的物理邊界"
                            }
                        ]
                    },
                    {
                        "id": "section-6",
                        "title": "緩解方案：儲能一體化與智慧能源調度",
                        "h3_details": [
                            {
                                "id": "section-6-1",
                                "title": "6.1 Megablock 儲能緩衝系統"
                            },
                            {
                                "id": "section-6-2",
                                "title": "6.2 虛擬電廠（VPP）與智慧調度"
                            }
                        ]
                    },
                    {
                        "id": "section-7",
                        "title": "基礎設施建置的軟性成本與合規挑戰",
                        "h3_details": [
                            {
                                "id": "section-7-1",
                                "title": "7.1 電氣工程證照與施工專業化"
                            },
                            {
                                "id": "section-7-2",
                                "title": "7.2 消防法規與熱安全防護的演進"
                            }
                        ]
                    },
                    {
                        "id": "section-8",
                        "title": "特斯拉 V4 與 Megacharger 技術方案的實戰解析",
                        "h3_details": [
                            {
                                "id": "section-8-1",
                                "title": "8.1 V4 Cabinet：高功率與高密度的核心"
                            },
                            {
                                "id": "section-8-2",
                                "title": "8.2 摺疊式超充樁與物流優化"
                            }
                        ]
                    },
                    {
                        "id": "section-9",
                        "title": "深度洞察：電力、土地與時間的三維博弈",
                        "h3_details": [
                            {
                                "id": "section-9-1",
                                "title": "9.1 從「能源補給」轉向「電網資產」"
                            },
                            {
                                "id": "section-9-2",
                                "title": "9.2 物理空間的「標準化」將成為新的隱形資產"
                            },
                            {
                                "id": "section-9-3",
                                "title": "9.3「通電時間」將決定產業轉型的生死"
                            }
                        ]
                    },
                    {
                        "id": "section-10",
                        "title": "結論：破解能源供給的物理枷鎖",
                        "h3_details": []
                    },
                    {
                        "id": "article-analysis",
                        "title": "文章分析 (Article Analysis)",
                        "h3_details": [
                            {
                                "id": "analysis-5w1h",
                                "title": "Part 2.1: 5W1H 深度邏輯總結"
                            },
                            {
                                "id": "analysis-reasoning",
                                "title": "Part 2.2: 推論邏輯分析"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "20260413-compute-power-ai-mining-report",
                "pillar": "power",
                "badge": "深度研報",
                "date": "2026-04-13",
                "title": "【算力產業轉型深度報告】- 比特幣礦企如何跨界 AI 基礎設施？為何電力稀缺性成核心競爭壁壘？解構 PPA 電價合約與 GPU 算力租賃商業模式",
                "url": "../news/20260413-compute-power-ai-mining-report.html",
                "core_conclusion": "本文分析指出「2026年第一季度全球數字算力產業深度研究報告：比特幣礦業與人工智能基礎設施的戰略融合」的核心邏輯在於市場供需失衡與產業結構演化。受制於資本開支門檻與總體流動性變化，領先企業透過技術護城河與長約機制鎖定資產溢價，驅動整體產業進行重估值。",
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
                        "id": "section-introduction",
                        "title": "第一章緒論：算力即國力的時代開端",
                        "h3_details": [
                            {
                                "id": "section-convergence",
                                "title": "重塑邊界：算力作為新型戰略資產"
                            }
                        ]
                    },
                    {
                        "id": "section-mining-survival",
                        "title": "第二章比特幣礦業：低利潤環境下的生存與洗牌",
                        "h3_details": [
                            {
                                "id": "section-network-metrics",
                                "title": "2.1 網絡指標與盈虧平衡分析：礦工投降的信號"
                            },
                            {
                                "id": "section-public-miners",
                                "title": "2.2 上市公司財報解析與資本策略"
                            },
                            {
                                "id": "section-hardware-innovation",
                                "title": "2.3 硬件革新：3nm 時代與 sub-10 J/TH 巔峰對決"
                            }
                        ]
                    },
                    {
                        "id": "section-ai-compute",
                        "title": "第三章人工智能算力公司：從大模型訓練到代理推理",
                        "h3_details": [
                            {
                                "id": "section-neoclouds",
                                "title": "3.1 專業 AI 雲服務商 (Neoclouds) 的強勢崛起"
                            },
                            {
                                "id": "section-big-tech-chips",
                                "title": "3.2 矽谷巨頭的自研芯片與資本支出"
                            },
                            {
                                "id": "section-gpu-war",
                                "title": "3.3 算力硬件的終極競賽：NVIDIA Rubin vs. AMD MI350"
                            }
                        ]
                    },
                    {
                        "id": "section-deep-fusion",
                        "title": "第四章深度融合：當礦場變身 AI 工廠",
                        "h3_details": [
                            {
                                "id": "section-profit-scissor",
                                "title": "4.1 轉型的經濟動機與利潤剪刀差"
                            },
                            {
                                "id": "section-case-study-transition",
                                "title": "4.2 案例研究：分化中的行業路徑"
                            }
                        ]
                    },
                    {
                        "id": "section-energy-boundary",
                        "title": "第五章能源：算力競爭的最終邊界與核能復興",
                        "h3_details": [
                            {
                                "id": "section-power-shortage",
                                "title": "5.1 數據中心能源需求與電力短缺"
                            },
                            {
                                "id": "section-nuclear-renaissance",
                                "title": "5.2 核能復興：小型模塊化反應堆 (SMR) 與核能數據中心"
                            },
                            {
                                "id": "section-energy-sovereignty",
                                "title": "5.3 能源主權：地緣政治的新籌碼"
                            }
                        ]
                    },
                    {
                        "id": "section-regulation-geopolitics",
                        "title": "第六章全球監管環境與地緣算力博弈",
                        "h3_details": [
                            {
                                "id": "section-rasa-act",
                                "title": "6.1 美國的 RASA 法案與算力補貼"
                            },
                            {
                                "id": "section-european-eed",
                                "title": "6.2 歐洲的數據中心能效指令 (EED)"
                            },
                            {
                                "id": "section-sovereign-compute",
                                "title": "6.3 阿聯酋與海灣國家的算力外交"
                            }
                        ]
                    },
                    {
                        "id": "section-investment-valuation",
                        "title": "第七章投資與估值：資本市場的偏好轉移",
                        "h3_details": [
                            {
                                "id": "section-valuation-models",
                                "title": "7.1 算力公司估值模型：從「採礦權」到「基礎設施乘數」"
                            },
                            {
                                "id": "section-capital-inflow",
                                "title": "7.2 資本湧入：基礎設施債券的崛起"
                            },
                            {
                                "id": "section-spot-markets",
                                "title": "7.3 現貨算力市場 (Spot Markets) 的成熟"
                            }
                        ]
                    },
                    {
                        "id": "section-tech-dive",
                        "title": "第八章技術深鑽：熱管理、網絡與架構的演進",
                        "h3_details": [
                            {
                                "id": "section-cooling-tech",
                                "title": "8.1 液冷技術的全面普及 (Total Immersion)"
                            },
                            {
                                "id": "section-interconnect",
                                "title": "8.2 數據中心內互連 (Interconnect) 的革新"
                            },
                            {
                                "id": "section-edge-compute",
                                "title": "8.3 邊緣算力與離散網路"
                            }
                        ]
                    },
                    {
                        "id": "section-conclusion-outlook",
                        "title": "第九章結論與 2026-2030 展望",
                        "h3_details": [
                            {
                                "id": "section-ten-year-outlook",
                                "title": "9.1 十年展望：算力、能源與智慧的三位一體"
                            },
                            {
                                "id": "section-investor-takeaways",
                                "title": "9.2 給投資者的核心觀點"
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
                "id": "news-20260321-ai-computing-assets",
                "pillar": "capital",
                "badge": "深度研報",
                "date": "2026-03-21",
                "title": "【AI 算力資產重估與未來應用】- NVIDIA Rubin 架構如何重塑算力定價標準？為何 DePIN 算力拓撲挑戰雲端壟斷？解構「算力黑洞」效應與投資機遇",
                "url": "../news/20260321-ai-computing-assets.html",
                "core_conclusion": "本文分析指出「從「算力溢出」到「智慧奇點」：2026 AI 算力資產與未來應用深度分析報告」的核心邏輯在於市場供需失衡與產業結構演化。受制於資本開支門檻與總體流動性變化，領先企業透過技術護城河與長約機制鎖定資產溢價，驅動整體產業進行重估值。",
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
                        "id": "summary-5w1h",
                        "title": "5W1H 前瞻思考：關鍵變革 算力演進背後的 10 個核心邏輯",
                        "h3_details": []
                    },
                    {
                        "id": "hardware-spec",
                        "title": "2026 主流 AI 算力規格矩陣 Rubin 與 Blackwell 的性能斷代",
                        "h3_details": []
                    },
                    {
                        "id": "ai-vs-btc",
                        "title": "AI 算力 vs. 比特幣礦機 資產生命週期與殘值邏輯對標",
                        "h3_details": []
                    },
                    {
                        "id": "task-matrix",
                        "title": "機型、任務與模型對照矩陣 算力資源的精確匹配路徑",
                        "h3_details": []
                    },
                    {
                        "id": "compute-sinks",
                        "title": "算力「過剩」後的去處 四大「算力黑洞」吞噬溢出產能",
                        "h3_details": []
                    },
                    {
                        "id": "depin-networks",
                        "title": "結論：算力競爭的本質轉移 從「算力溢出」到「智慧奇點」的最終去處",
                        "h3_details": []
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
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
                    }
                ]
            },
            {
                "id": "news-20260320-us-computing-infrastructure",
                "pillar": "power",
                "badge": "深度研報",
                "date": "2026-03-20",
                "title": "【美國算力基礎設施產業投資】- 電力稀缺性如何成為 AI 轉型的最終瓶頸？為何比特幣礦場搶占電廠位置？解構從挖礦到 AI 電廠的資產重估邏輯",
                "url": "../news/20260320-us-computing-infrastructure.html",
                "core_conclusion": "本文分析指出「2026 美國算力基礎設施產業投資報告：比特幣礦企的 AI 轉型之路」的核心邏輯在於市場供需失衡與產業結構演化。受制於資本開支門檻與總體流動性變化，領先企業透過技術護城河與長約機制鎖定資產溢價，驅動整體產業進行重估值。",
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
                        "title": "執行摘要 Executive Summary",
                        "h3_details": []
                    },
                    {
                        "id": "section-2",
                        "title": "產業背景 2026 年的電力危機與機會",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "1. 電力缺口的結構性紅利"
                            },
                            {
                                "id": "section-2-2",
                                "title": "2. 算力與挖礦的獲利能力對比"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "商業模式與價值鏈分析 Valuation Framework",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "1. 商業模式分層"
                            },
                            {
                                "id": "section-3-2",
                                "title": "2. 價值重估邏輯 (Valuation Framework)"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "核心公司深度點評 2026 Q1 更新",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "1. IREN (原 Iris Energy) - AI 雲端領頭羊"
                            },
                            {
                                "id": "section-4-2",
                                "title": "2. Hut 8 (HUT) - 信用等級最高的轉型者"
                            },
                            {
                                "id": "section-4-3",
                                "title": "3. Riot Platforms (RIOT) - 穩健的資產負債表"
                            }
                        ]
                    },
                    {
                        "id": "section-5",
                        "title": "關鍵風險評估 Key Risks",
                        "h3_details": []
                    },
                    {
                        "id": "section-6",
                        "title": "投資建議與結論 Investment Strategy",
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
                    }
                ]
            },
            {
                "id": "news-20260320-ai-agent-economy",
                "pillar": "agent",
                "badge": "深度研報",
                "date": "2026-03-20",
                "title": "【AI Agent 經濟體系與機器支付】- 自主代理如何重構金融交易基礎設施？為何區塊鏈成為機器支付結算層？解構 AI Agent 商業模式與投資機會",
                "url": "../news/20260320-ai-agent-economy.html",
                "core_conclusion": "本篇研究《【AI Agent 經濟體系與機器支付 2026】- 自主代理如何重構金融交易基礎設施？為何區塊鏈成為機器支付結算層？解構 AI Agent 商業模式與投資機會》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
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
                        "title": "新聞摘要 金融巨頭的「機器支付」軍備賽",
                        "h3_details": []
                    },
                    {
                        "id": "section-2",
                        "title": "核心分析 百萬倍交易量的「機器人大戰」",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "1. 交易規模的質變：從「微支付」到「納米支付」"
                            },
                            {
                                "id": "section-2-2",
                                "title": "2. 資源消耗的翻轉：算力與電力定價"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "補充與推論 區塊鏈投資的新範式",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "1. 買新不買舊：流動性與 API 的競爭"
                            },
                            {
                                "id": "section-3-2",
                                "title": "2. 山寨季（Altcoin Season）的質變"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "投資標的 機會分析與標的推薦",
                        "h3_details": []
                    },
                    {
                        "id": "section-5",
                        "title": "最終結論 代理商務（Agentic Commerce）時代來臨",
                        "h3_details": []
                    },
                    {
                        "id": "analyst-insights",
                        "title": "分析師洞見",
                        "h3_details": []
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
                "id": "news-20260306-us-computing-infrastructure-ai-transformation",
                "pillar": "power",
                "badge": "深度研報",
                "date": "2026-03-06",
                "title": "【美國算力基礎設施與 AI 轉型】- 電力稀缺性如何驅動算力重估？為何比特幣礦場轉型 AI 資料中心成最佳路徑？解構電廠併網與資產評價",
                "url": "../news/20260306-us-computing-infrastructure-ai-transformation.html",
                "core_conclusion": "本文分析指出「2026 美國算力基礎設施產業投資報告：比特幣礦企的 AI 轉型之路」的核心邏輯在於市場供需失衡與產業結構演化。受制於資本開支門檻與總體流動性變化，領先企業透過技術護城河與長約機制鎖定資產溢價，驅動整體產業進行重估值。",
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
                        "title": "為什麼比特幣礦企轉型 AI？– 5W1H 深度邏輯總結",
                        "h3_details": []
                    },
                    {
                        "id": "section-2",
                        "title": "產業背景 – 2026 年電力危機與機會",
                        "h3_details": [
                            {
                                "id": "section-2-crisis",
                                "title": "電力缺口的結構性紅利"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "商業模式與價值重估",
                        "h3_details": [
                            {
                                "id": "section-3-val",
                                "title": "估值修復路徑：從 5x 到 20x"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "核心公司點評 (2026 Q1 版)",
                        "h3_details": [
                            {
                                "id": "section-4-iren",
                                "title": "IREN (原 Iris Energy) – AI 雲端領頭羊"
                            },
                            {
                                "id": "section-4-hut",
                                "title": "Hut 8 (HUT) – 信用等級最高的轉型者"
                            }
                        ]
                    },
                    {
                        "id": "section-5",
                        "title": "關鍵風險評估",
                        "h3_details": []
                    },
                    {
                        "id": "文章分析",
                        "title": "文章分析",
                        "h3_details": []
                    },
                    {
                        "id": "文章分析-1",
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
            }
        ]
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TOPIC_AI_COT_DATA;
    } else {
        root.TOPIC_AI_COT_DATA = TOPIC_AI_COT_DATA;
    }
})(typeof window !== 'undefined' ? window : this);
