/**
 * assets/js/topics/topic-us-equities-cot-data.js
 * 專題知識階層樹與思考鏈核心資料庫 (Data SSOT)
 * 由 tools/sync_topic_cot.py 自動同步編譯，嚴禁破壞 JSON 結構。
 */
(function (root) {
    const TOPIC_US_EQUITIES_COT_DATA = {
        "topic": "topic-us-equities",
        "title": "美股個股與估值重定價",
        "generated_at": "2026-11-28",
        "pillars": [
            {
                "id": "all",
                "label": "全部研報",
                "short": "ALL"
            },
            {
                "id": "ai-saas",
                "label": "I. AI 軟體與 SaaS",
                "short": "AI & SAAS"
            },
            {
                "id": "space-frontier",
                "label": "II. 航太與前沿科技",
                "short": "FRONTIER"
            },
            {
                "id": "fintech-ugc",
                "label": "III. 金融科技與 UGC",
                "short": "FINTECH & UGC"
            },
            {
                "id": "valuation",
                "label": "IV. 流動性與估值重估",
                "short": "VALUATION"
            }
        ],
        "macro_ledger": [
            {
                "id": "metric-pltr-q3",
                "name": "Palantir Q3 營收 / Rule of 40",
                "current": "+96% YoY｜Rule of 40 158%",
                "baseline": "美國商業 +148% 首超政府",
                "status": "normal",
                "note": "Q3 營收 $23.13 億單季首破 20 億，全年指引上修至 $85.3 億 (+91%)",
                "updated_at": "2026-11-28",
                "source_url": "../project/palantir.html"
            },
            {
                "id": "metric-spacex-ipo",
                "name": "SpaceX 上市後估值區間",
                "current": "$129.10–$134.44 (破發)",
                "baseline": "發行價 $135｜市值 $1.81T",
                "status": "warning",
                "note": "高估值 Pre-IPO 掛牌後跌破發行價，驗證指數再平衡流動性衝擊劇本",
                "updated_at": "2026-11-27",
                "source_url": "../news/20260612-spacex-ipo-valuation-break-risk.html"
            },
            {
                "id": "metric-saas-rule40",
                "name": "上市 SaaS Rule of 40 達標率",
                "current": "FCF 口徑 45.5% (25/55)",
                "baseline": "EBITDA 口徑僅 14.5% (8/55)",
                "status": "warning",
                "note": "機構評價已演進為 Bessemer Rule of X 與 Rule of 50 雙軌篩選",
                "updated_at": "2026-11-28",
                "source_url": "../news/20260809-saas-rule-of-40-2026.html"
            },
            {
                "id": "metric-usdc-mcap",
                "name": "Circle USDC 流通市值",
                "current": "$754 億 (總穩定幣 $3,066 億)",
                "baseline": "損益平衡發行線 $580 億",
                "status": "normal",
                "note": "正式跨過損益平衡門檻，PNC 銀行攜手 Coinbase 試辦機構級支付",
                "updated_at": "2026-11-28",
                "source_url": "../project/circle.html"
            }
        ],
        "concepts": [
            {
                "id": "rule-of-40-x",
                "code": "SAAS VALUATION",
                "title": "Rule of 40 與 Bessemer Rule of X",
                "desc": "以營收成長率加上 FCF/EBITDA 利潤率衡量軟體公司體質；Rule of X 進一步賦予成長率更高權重，區分 AI 原生擴張與傳統席位 SaaS。",
                "threshold": "機構門檻：FCF 口徑 ≥ 40% 為基準，頂級 AI 軟體已邁向 Rule of 50+",
                "url": ""
            },
            {
                "id": "ipo-rebalance-shock",
                "code": "EQUITY FLOWS",
                "title": "兆元級 IPO 指數再平衡抽水",
                "desc": "當超大型獨角獸以兆元市值掛牌並納入主要指數時，被動基金須拋售既有權值股騰出權重，引發板塊級流動性重分配與破發測試。",
                "threshold": "實證觀察：掛牌首季對標發行價支撐與被動資金換手率",
                "url": ""
            }
        ],
        "articles": [
            {
                "id": "us-stock-ai-valuation-liquidity-guide",
                "pillar": "ai-saas",
                "badge": "方法指南",
                "date": "2026-11-27",
                "title": "【美股估值框架】AI 時代美股估值極限與流動性清算指南 - 從 P/S 泡沫、SaaS 定價權轉移到避險配置模型",
                "url": "../post/us-stock-ai-valuation-liquidity-guide.html",
                "core_conclusion": "報告核心摘要 (Executive Summary) 估值極限警戒線：科技股平均 P/S 突破 8.1 倍、CAPE 達 36.4 倍且 13F 機構集中度超過 70% 時，遠期自由現金流已被透支殆盡，高 Beta 標的隨時面臨均值回歸與 Short Float 暴力軋空的雙向絞殺。 一二級市場倒掛與指數排擠：總額 3.12 兆美元的 Pre-IPO 管道…",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "70%"
                    },
                    {
                        "label": "關鍵規模",
                        "value": "3.12 兆"
                    },
                    {
                        "label": "核心參數",
                        "value": "1 倍"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0-summary",
                        "title": "執行摘要 美股估值重定價的 5W1H 認知架構",
                        "h3_details": [
                            {
                                "id": "section-5w1h-core",
                                "title": "5W1H 深度邏輯總結"
                            }
                        ]
                    },
                    {
                        "id": "chapter-1",
                        "title": "美股估值何時算過熱？從 P/S 極值、36x 本益比到 Rule of 40 破滅的量化診斷",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-2",
                        "title": "什麼是一二級市場倒掛？Pre-IPO 估值泡沫與巨型 IPO 的流動性抽血機制",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-3",
                        "title": "AI 如何重塑美股定價權？從席位訂閱 (SaaS) 到雙向網絡與封閉清算生態",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-4",
                        "title": "面對高位閃崩與暴力軋空，如何建構美股非對稱防禦與估值邊界？",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-5",
                        "title": "歷史實證時間軸：美股估值重定價與流動性清算關鍵事件彙整",
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
                    }
                ]
            },
            {
                "id": "20261004-ai-ugc-equity-research",
                "pillar": "fintech-ugc",
                "badge": "深度研報",
                "date": "2026-10-04",
                "title": "【AI-UGC 產業價值鏈重構】- 雙向網絡平台如何捕獲超額報酬？從技術擴散到長尾商業化的股票投資研究",
                "url": "../news/20261004-ai-ugc-equity-research.html",
                "core_conclusion": "生成式 AI 使內容邊際生產成本歸零，模型層與工具層面臨劇烈商品化；產業超額報酬將由具備「雙向網絡效應、封閉清算系統與高粘性社交資本」的平台（如 Roblox、Meta）完全捕獲。",
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
                        "id": "一-投資假說與核心邏輯",
                        "title": "一、投資假說與核心邏輯",
                        "h3_details": [
                            {
                                "id": "核心命題與價值轉移規律",
                                "title": "核心命題與價值轉移規律"
                            },
                            {
                                "id": "ai-ugc-飛輪效應與動態反饋機制",
                                "title": "AI-UGC 飛輪效應與動態反饋機制"
                            },
                            {
                                "id": "結構性下行風險與防禦邊界",
                                "title": "結構性下行風險與防禦邊界"
                            }
                        ]
                    },
                    {
                        "id": "二-價值鏈分層與選股池評估",
                        "title": "二、價值鏈分層與選股池評估",
                        "h3_details": [
                            {
                                "id": "tier-1-雙向網絡平台的生態閉環與定價權限",
                                "title": "Tier 1：雙向網絡平台的生態閉環與定價權限"
                            },
                            {
                                "id": "tier-2-垂直生產力生態的工作流卡位與防禦脆弱性",
                                "title": "Tier 2：垂直生產力生態的工作流卡位與防禦脆弱性"
                            },
                            {
                                "id": "tier-3-底層算力與託管水電煤的算力通縮與邊緣溢價",
                                "title": "Tier 3：底層算力與託管水電煤的算力通縮與邊緣溢價"
                            }
                        ]
                    },
                    {
                        "id": "三-量化追蹤指標與單位經濟效益重構",
                        "title": "三、量化追蹤指標與單位經濟效益重構",
                        "h3_details": [
                            {
                                "id": "核心量化指標對照矩陣",
                                "title": "核心量化指標對照矩陣"
                            },
                            {
                                "id": "貨幣化效率與分成模型演化",
                                "title": "貨幣化效率與分成模型演化"
                            }
                        ]
                    },
                    {
                        "id": "四-質化護城河壓力測試與財務模型重構",
                        "title": "四、質化護城河壓力測試與財務模型重構",
                        "h3_details": [
                            {
                                "id": "質化護城河壓力測試-抵禦基礎模型降維打擊",
                                "title": "質化護城河壓力測試：抵禦基礎模型降維打擊"
                            },
                            {
                                "id": "財務模型與推理成本敏感度分析",
                                "title": "財務模型與推理成本敏感度分析"
                            },
                            {
                                "id": "反向折現模型-reverse-dcf-與估值校準",
                                "title": "反向折現模型（Reverse DCF）與估值校準"
                            }
                        ]
                    },
                    {
                        "id": "五-情境定價推演與催化劑路線圖",
                        "title": "五、情境定價推演與催化劑路線圖",
                        "h3_details": [
                            {
                                "id": "三行情境價值矩陣-2026-2028-預測週期",
                                "title": "三行情境價值矩陣（2026–2028 預測週期）"
                            },
                            {
                                "id": "催化劑事件路線圖",
                                "title": "催化劑事件路線圖"
                            }
                        ]
                    },
                    {
                        "id": "六-結論-投資研究聚焦與資產配置架構",
                        "title": "六、結論投資研究聚焦與資產配置架構",
                        "h3_details": [
                            {
                                "id": "核心勝負手總結",
                                "title": "核心勝負手總結"
                            },
                            {
                                "id": "投資組合配置策略",
                                "title": "投資組合配置策略"
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
                "id": "20261003-coinbase-tokenized-finance-ousd",
                "pillar": "fintech-ugc",
                "badge": "深度研報",
                "date": "2026-10-03",
                "title": "【Coinbase】代幣化金融如何顛覆傳統清算？為何 OUSD 催化 450 美元估值重估？解析 4 大流動性機制、38% 淨利率與 70% 週期回撤邊界",
                "url": "../news/20261003-coinbase-tokenized-finance-ousd.html",
                "core_conclusion": "本文深入剖析代幣化金融如何藉由 100% 短債儲備、鏈上即時滴灌與抵押信用乘數顛覆傳統清算網絡，並量化推演 Coinbase 在 38% 頂峰淨利率與 Base 生態爆發下催化 450 至 600 美元估值重估，同時揭示 70% 至 85% 週期回撤的嚴苛風險邊界。",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "38%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "70%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "100%"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": [
                            {
                                "id": "合規穩定幣流動性機制-宏觀資產定價-博弈動機與企業估值上限推演",
                                "title": "——合規穩定幣流動性機制、宏觀資產定價、博弈動機與企業估值上限推演"
                            }
                        ]
                    },
                    {
                        "id": "導言-底層金融管線的代幣化典範轉移",
                        "title": "導言底層金融管線的代幣化典範轉移",
                        "h3_details": []
                    },
                    {
                        "id": "第一章-穩定幣注入流動性與貨幣供給之四大機制",
                        "title": "第一章穩定幣注入流動性與貨幣供給之四大機制",
                        "h3_details": [
                            {
                                "id": "1-美債赤字融資的-全球吸水海綿",
                                "title": "1. 美債赤字融資的「全球吸水海綿」"
                            },
                            {
                                "id": "2-財政刺激的-點對點即時滴灌-programmable-liquidity",
                                "title": "2. 財政刺激的「點對點即時滴灌（Programmable Liquidity）」"
                            },
                            {
                                "id": "3-美元化-2-0-dollarization-2-0-擴大鑄幣稅與離岸貨幣外溢",
                                "title": "3.「美元化 2.0（Dollarization 2.0）」擴大鑄幣稅與離岸貨幣外溢"
                            },
                            {
                                "id": "4-鏈上分數準備金與信用乘數效應-defi-機構借貸",
                                "title": "4. 鏈上分數準備金與信用乘數效應（DeFi / 機構借貸）"
                            }
                        ]
                    },
                    {
                        "id": "第二章-硬資產重要性重估-比特幣與黃金的結構性分化",
                        "title": "第二章硬資產重要性重估比特幣與黃金的結構性分化",
                        "h3_details": [
                            {
                                "id": "1-比特幣-bitcoin-打通微摩擦的-法幣-硬資產-管線",
                                "title": "1. 比特幣（Bitcoin）：打通微摩擦的「法幣—硬資產」管線"
                            },
                            {
                                "id": "2-黃金-gold-去美元化與主權避險的壓艙石",
                                "title": "2. 黃金（Gold）：去美元化與主權避險的壓艙石"
                            }
                        ]
                    },
                    {
                        "id": "第三章-股市資產傳導-買多-加槓桿與定價反身性",
                        "title": "第三章股市資產傳導買多、加槓桿與定價反身性",
                        "h3_details": [
                            {
                                "id": "1-代幣化美股-rwa-equities-解鎖全球全天候買盤",
                                "title": "1. 代幣化美股（RWA Equities）解鎖全球全天候買盤"
                            },
                            {
                                "id": "2-極大化做市與套利資金的週轉速度",
                                "title": "2. 極大化做市與套利資金的週轉速度"
                            },
                            {
                                "id": "3-鏈上與影子銀行的-抵押品槓桿效應",
                                "title": "3. 鏈上與影子銀行的「抵押品槓桿效應」"
                            },
                            {
                                "id": "4-關鍵制約-無法違抗-無風險利率-與-基本面",
                                "title": "4. 關鍵制約：無法違抗「無風險利率」與「基本面」"
                            }
                        ]
                    },
                    {
                        "id": "第四章-完整推論邏輯路線-五層結構解構",
                        "title": "第四章完整推論邏輯路線五層結構解構",
                        "h3_details": [
                            {
                                "id": "第一層-微觀產品與產業破壞-起點",
                                "title": "第一層：微觀產品與產業破壞（起點）"
                            },
                            {
                                "id": "第二層-宏觀貨幣與主權機制-流動性傳導",
                                "title": "第二層：宏觀貨幣與主權機制（流動性傳導）"
                            },
                            {
                                "id": "第三層-硬資產價值定價-比特幣與黃金的分化",
                                "title": "第三層：硬資產價值定價（比特幣與黃金的分化）"
                            },
                            {
                                "id": "第四層-風險資產與股市傳導機制-槓桿與估值",
                                "title": "第四層：風險資產與股市傳導機制（槓桿與估值）"
                            }
                        ]
                    },
                    {
                        "id": "第五章-激勵因子與動機拆解-權力與資本的-共謀閉環",
                        "title": "第五章激勵因子與動機拆解權力與資本的「共謀閉環」",
                        "h3_details": [
                            {
                                "id": "一-美國政府為什麼會大力支持甚至主導這套架構",
                                "title": "一、美國政府為什麼會大力支持甚至主導這套架構？"
                            },
                            {
                                "id": "二-華爾街與金融市場是否有動機推高整體體系金額",
                                "title": "二、華爾街與金融市場是否有動機推高整體體系金額？"
                            }
                        ]
                    },
                    {
                        "id": "第六章-核心參與者命運分化-circle-vs-coinbase",
                        "title": "第六章核心參與者命運分化Circle vs. Coinbase",
                        "h3_details": [
                            {
                                "id": "一-circle-政策的頭號受益者-但產業利潤遭-降維打擊",
                                "title": "一、Circle：政策的頭號受益者，但產業利潤遭「降維打擊」"
                            },
                            {
                                "id": "二-coinbase-近乎無死角的-全方位收割者",
                                "title": "二、Coinbase：近乎無死角的「全方位收割者」"
                            },
                            {
                                "id": "三-綜合對比矩陣",
                                "title": "三、綜合對比矩陣"
                            }
                        ]
                    },
                    {
                        "id": "第七章-生態位競爭者與系統紅利受益者圖譜",
                        "title": "第七章生態位競爭者與系統紅利受益者圖譜",
                        "h3_details": [
                            {
                                "id": "一-與-coinbase-核心業務重疊的-直接競爭者",
                                "title": "一、與 Coinbase 核心業務重疊的「直接競爭者」"
                            },
                            {
                                "id": "二-與-coinbase-共享系統紅利的-超級受益者",
                                "title": "二、與 Coinbase 共享系統紅利的「超級受益者」"
                            }
                        ]
                    },
                    {
                        "id": "第八章-coinbase-投資分析-風險邊界與重倉條件",
                        "title": "第八章 Coinbase 投資分析風險邊界與重倉條件",
                        "h3_details": [
                            {
                                "id": "一-限制重倉的五大核心風險因子",
                                "title": "一、限制重倉的五大核心風險因子"
                            },
                            {
                                "id": "二-評估重倉條件的-決策矩陣",
                                "title": "二、評估重倉條件的「決策矩陣」"
                            },
                            {
                                "id": "三-專業配置與部位管理架構",
                                "title": "三、專業配置與部位管理架構"
                            }
                        ]
                    },
                    {
                        "id": "第九章-交易所典範轉移-coinbase-與傳統交易所-nasdaq-之博弈",
                        "title": "第九章交易所典範轉移Coinbase 與傳統交易所（Nasdaq）之博弈",
                        "h3_details": [
                            {
                                "id": "一-核心維度對比分析",
                                "title": "一、核心維度對比分析"
                            },
                            {
                                "id": "二-競爭優勢的具體改變-權力板塊挪移",
                                "title": "二、競爭優勢的具體改變（權力板塊挪移）"
                            },
                            {
                                "id": "三-未來格局推演-三層分工融合體系",
                                "title": "三、未來格局推演：三層分工融合體系"
                            }
                        ]
                    },
                    {
                        "id": "第十章-價格趨勢推論與發展支持上限模型",
                        "title": "第十章價格趨勢推論與發展支持上限模型",
                        "h3_details": [
                            {
                                "id": "一-核心營收解構-兩大定價引擎",
                                "title": "一、核心營收解構：兩大定價引擎"
                            },
                            {
                                "id": "二-估值上限推論模型-牛市頂峰情境推演",
                                "title": "二、估值上限推論模型：牛市頂峰情境推演"
                            },
                            {
                                "id": "三-限制-coinbase-估值向上突破的四大天花板",
                                "title": "三、限制 Coinbase 估值向上突破的四大天花板"
                            },
                            {
                                "id": "四-實戰跟蹤指標與趨勢判斷清單",
                                "title": "四、實戰跟蹤指標與趨勢判斷清單"
                            }
                        ]
                    },
                    {
                        "id": "第十一章-現狀估值剖析-為什麼當前股價在-190-美元震盪",
                        "title": "第十一章現狀估值剖析為什麼當前股價在 190 美元震盪？",
                        "h3_details": [
                            {
                                "id": "一-190-美元的隱含定價數學-分部加總估值-sotp",
                                "title": "一、190 美元的隱含定價數學（分部加總估值 SOTP）"
                            },
                            {
                                "id": "二-為什麼股價停在-190-而沒有往-300-突破",
                                "title": "二、為什麼股價停在，而沒有往 300+ 突破？"
                            },
                            {
                                "id": "三-為什麼-190-沒有跌回-80-以下-三大下檔支撐",
                                "title": "三、為什麼 190 沒有跌回 80 以下？（三大下檔支撐）"
                            }
                        ]
                    },
                    {
                        "id": "第十二章-政策利好催化劑-推動-coinbase-估值向上的五大路徑",
                        "title": "第十二章政策利好催化劑推動 Coinbase 估值向上的五大路徑",
                        "h3_details": [
                            {
                                "id": "一-五大政策利好面向與傳導",
                                "title": "一、五大政策利好面向與傳導"
                            },
                            {
                                "id": "二-估值重估之量化定價邏輯",
                                "title": "二、估值重估之量化定價邏輯"
                            }
                        ]
                    },
                    {
                        "id": "結論",
                        "title": "結論",
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
                "id": "saas-rule-of-40-2026",
                "pillar": "ai-saas",
                "badge": "深度研報",
                "date": "2026-08-09",
                "title": "【全球 SaaS Rule of 40 破滅】 - 僅 20% 企業達標如何重定估值？解構 EV/ARR 溢價與財務分化",
                "url": "../news/20260809-saas-rule-of-40-2026.html",
                "core_conclusion": "2026 年全球公募 SaaS 僅 20% 達標 Rule of 40；達標企業享有 74% 估值溢價 (EV/Rev 4.8x vs 2.7x)，得分每提升 10% 可帶來 +1.0x 至 +1.5x 之 EV/ARR 倍數擴張。",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "20%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "74%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "10%"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": []
                    },
                    {
                        "id": "rule-of-40-的底層運作邏輯與計算分歧",
                        "title": "為何 2026 年僅 20% 公募 SaaS 達標 Rule of 40？高利率與 AI 算力成本如何侵蝕利潤率？",
                        "h3_details": [
                            {
                                "id": "資金成本與-ai-基礎設施的雙重夾擊",
                                "title": "5%+ 無風險利率與 GPU 推論費用疊加：為何 AI Agent 部署引發 SaaS 利潤率淘汰賽？"
                            },
                            {
                                "id": "自由現金流-fcf-與-ebitda-的結構性差異",
                                "title": "FCF vs GAAP EBITDA 利潤率分歧：股票基礎薪酬 (SBC) 如何成為估值雙面刃？"
                            }
                        ]
                    },
                    {
                        "id": "估值溢價與-ev-arr-的連動效應",
                        "title": "達標企業為何能獲得 74% 估值溢價？Rule of 40 如何驅動 EV/ARR 階梯式倍數擴張？",
                        "h3_details": [
                            {
                                "id": "階梯式的估值倍數擴張",
                                "title": "Rule of 40 分數與 EV/ARR 矩陣：每提升 10% 得分如何換取 +1.0x 至 +1.5x 倍數擴張？"
                            },
                            {
                                "id": "淨營收留存率-nrr-的乘數效應",
                                "title": "NRR 130%+ 的乘數加成：為何低 CAC 擴張營收是 2026 年最珍貴的資本效率指標？"
                            }
                        ]
                    },
                    {
                        "id": "2026-年-rule-of-40-頂尖大中型-saas-企業深度解析",
                        "title": "2026 年哪些大中型軟體股突破 40% 門檻？五大領軍 SaaS 企業財務結構與 AI 戰略剖析",
                        "h3_details": [
                            {
                                "id": "1-clearwater-analytics-nasdaq-cwan",
                                "title": "Clearwater Analytics (CWAN)：部署 800+ GenAI Agents 降低 90% 對帳成本，73.7% EBITDA 登頂霸主"
                            },
                            {
                                "id": "2-servicenow-nyse-now",
                                "title": "ServiceNow (NOW)：以 Rule of 56~60 強勁軌跡邁進，AI 業務突破 10 億美元 ACV 突破口"
                            },
                            {
                                "id": "3-jfrog-nasdaq-frog",
                                "title": "JFrog (FROG)：得分 41.1% 卡位 AI 程式碼發布剛需，端到端卡位軟體供應鏈安全"
                            },
                            {
                                "id": "4-appfolio-nasdaq-appf",
                                "title": "AppFolio (APPF)：得分 40.6% 展現垂直房地產 SaaS 剛性定價權，生成式 AI 降低營運成本"
                            },
                            {
                                "id": "5-klaviyo-nyse-kvyo",
                                "title": "Klaviyo (KVYO)：得分 40% 轉型自主 B2C CRM，管理 90 億消費者輪廓與 109% NRR 護城河"
                            }
                        ]
                    },
                    {
                        "id": "併購市場動態與私募-saas-的估值模型",
                        "title": "併購市場如何對 Rule of 40 定價？高估值倍數背後的現金流折現與扣減機制",
                        "h3_details": [
                            {
                                "id": "併購出場的現金流折現與扣除機制",
                                "title": "交易結構與 Earnout 扣除分析：創辦人如何利用高 Rule of 40 在併購扣減下實現實質財富？"
                            }
                        ]
                    },
                    {
                        "id": "數據背後的深層洞察與成熟期演化",
                        "title": "人工智慧如何分化軟體產業？從營收狂熱回歸現金流本質與「加權 Rule of X」崛起",
                        "h3_details": [
                            {
                                "id": "洞察一-ai-基礎設施投入的-資本支出-與-營運支出-兩極化",
                                "title": "算力 CapEx vs 應用 OpEx 兩極化：龍頭 SaaS 如何將 AI 轉化為高利潤營運槓桿？"
                            },
                            {
                                "id": "洞察二-成熟期-saas-的演化與-rule-of-x-的崛起",
                                "title": "從增長至上到單位經濟效益：為何私募機構偏向 EBITDA 利潤率重加權的 Rule of X 模型？"
                            }
                        ]
                    },
                    {
                        "id": "結論與市場前瞻",
                        "title": "2026 年全球 SaaS 產業終極試金石：高資本效率與 AI 定價權的長期戰略路徑",
                        "h3_details": []
                    },
                    {
                        "id": "article-analysis-header",
                        "title": "文章推論邏輯與深度分析",
                        "h3_details": [
                            {
                                "id": "文章推論邏輯分析",
                                "title": "文章推論邏輯分析"
                            },
                            {
                                "id": "敘事邊界與關鍵變數補充",
                                "title": "敘事邊界與關鍵變數補充"
                            },
                            {
                                "id": "敘事邊界與關鍵變數補充-1",
                                "title": "敘事邊界與關鍵變數補充"
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
                "id": "20260807-unity-applovin-q2-2026-earnings",
                "pillar": "fintech-ugc",
                "badge": "深度研報",
                "date": "2026-08-07",
                "title": "【Unity vs AppLovin 財報對決】 - Vector AI 如何驅動暴漲 16%？解構手遊廣告定價權拐點",
                "url": "../news/20260807-unity-applovin-q2-2026-earnings.html",
                "core_conclusion": "2026 年 Q2 財報發布後，Unity (U) 受惠 Vector AI 強勢與 2026 Q3 提早轉盈爆漲 16.12%；AppLovin (APP) 則因自由現金流落後與監管陰霾單日急跌 23%。本文深度比對兩大雙雄財報、Playable Ads 試玩廣告技術壁壘，以及手遊廣告市場五大關鍵趨勢。",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "16%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "16.12%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "23%"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0",
                        "title": "Vector AI 如何重塑手遊廣告定價權？為何 Unity 與 AppLovin 走出相反軌跡？",
                        "h3_details": [
                            {
                                "id": "section-5w1h-core",
                                "title": "5W1H 深度邏輯總結"
                            }
                        ]
                    },
                    {
                        "id": "1-執行摘要",
                        "title": "Vector AI 如何重塑手遊廣告定價權？為何 Unity 與 AppLovin 走出相反軌跡？",
                        "h3_details": []
                    },
                    {
                        "id": "2-unity-與-applovin-財報表現與股價變動分析",
                        "title": "2. Unity 與 AppLovin 財報表現與股價變動分析",
                        "h3_details": [
                            {
                                "id": "2-1-股價走勢與數據概覽-2026-年-8-月-6-日財報發布前後",
                                "title": "2.1 股價走勢與數據概覽 (2026 年 8 月 6 日財報發布前後)"
                            },
                            {
                                "id": "2-2-unity-software-u-上漲核心驅動因素",
                                "title": "2.2 Unity Software (U) 上漲核心驅動因素"
                            },
                            {
                                "id": "2-3-applovin-app-下跌原因剖析",
                                "title": "2.3 AppLovin (APP) 下跌原因剖析"
                            }
                        ]
                    },
                    {
                        "id": "3-unity-vector-ai-技術優勢與下半年營運展望",
                        "title": "3. Unity Vector AI 技術優勢與下半年營運展望",
                        "h3_details": [
                            {
                                "id": "3-1-unity-vector-ai-四大核心技術優勢",
                                "title": "3.1 Unity Vector AI 四大核心技術優勢"
                            },
                            {
                                "id": "3-2-unity-2026-下半年獲利與-create-業務展望",
                                "title": "3.2 Unity 2026 下半年獲利與 Create 業務展望"
                            },
                            {
                                "id": "3-3-分析師評等與機構目標價-unity-nasdaq-u",
                                "title": "3.3 分析師評等與機構目標價 (Unity - NASDAQ: U)"
                            }
                        ]
                    },
                    {
                        "id": "4-2026-年全球手遊廣告市場五大未來趨勢",
                        "title": "4. 2026 年全球手遊廣告市場五大未來趨勢",
                        "h3_details": []
                    },
                    {
                        "id": "5-試玩廣告-playable-ads-技術競爭對比-applovin-vs-unity",
                        "title": "5. 試玩廣告（Playable Ads）技術競爭對比AppLovin vs. Unity",
                        "h3_details": []
                    },
                    {
                        "id": "6-總結",
                        "title": "6. 總結",
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
                "id": "20260721-unity-investment-analysis",
                "pillar": "fintech-ugc",
                "badge": "深度研報",
                "date": "2026-07-21",
                "title": "【Unity 股票深度投資分析】- Vector AI 引擎如何重塑遊戲廣告定價權？為何 Runtime Fee 撤回不足以修復信任？解構 Unity 困境反轉與競爭格局",
                "url": "../news/20260721-unity-investment-analysis.html",
                "core_conclusion": "本文分析指出「Unity股票投資分析：AI廣告科技Vector與Unity 6底層重置，如何驅動NYSE: U估值重估？」的核心邏輯在於市場供需失衡與產業結構演化。受制於資本開支門檻與總體流動性變化，領先企業透過技術護城河與長約機制鎖定資產溢價，驅動整體產業進行重估值。",
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
                        "id": "section-1",
                        "title": "核心投資論點與轉型評估",
                        "h3_details": []
                    },
                    {
                        "id": "section-2",
                        "title": "商業模式重塑與戰略轉型分析",
                        "h3_details": [
                            {
                                "id": "信任修復與-saas-訂閱模式的價值回歸",
                                "title": "信任修復與 SaaS 訂閱模式的價值回歸"
                            },
                            {
                                "id": "剝離非戰略性資產-以短期陣痛換取長期毛利擴張",
                                "title": "剝離非戰略性資產：以短期陣痛換取長期毛利擴張"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "產品技術壁壘與競爭格局深度解析",
                        "h3_details": [
                            {
                                "id": "遊戲引擎市場-unity-6-的技術躍進與防禦優勢",
                                "title": "遊戲引擎市場：Unity 6 的技術躍進與防禦優勢"
                            },
                            {
                                "id": "ai-對遊戲開發的顛覆-淘金熱中的賣鏟人效應",
                                "title": "AI 對遊戲開發的顛覆：淘金熱中的賣鏟人效應"
                            },
                            {
                                "id": "廣告科技競爭-unity-vector-與-applovin-axon-2-0-的對決",
                                "title": "廣告科技競爭：Unity Vector 與 AppLovin AXON 2.0 的對決"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "歷史財務表現與未來預測",
                        "h3_details": [
                            {
                                "id": "2026-年第一季度財務回顧",
                                "title": "2026 年第一季度財務回顧"
                            },
                            {
                                "id": "第二季度展望與-2026-2027-年共識預期",
                                "title": "第二季度展望與 2026-2027 年共識預期"
                            }
                        ]
                    },
                    {
                        "id": "section-5",
                        "title": "資產負債表與流動性風險分析",
                        "h3_details": []
                    },
                    {
                        "id": "section-6",
                        "title": "估值模型與情境分析",
                        "h3_details": [
                            {
                                "id": "同業估值比較-comps-analysis",
                                "title": "同業估值比較 (Comps Analysis)"
                            },
                            {
                                "id": "目標價情境建模",
                                "title": "目標價情境建模"
                            }
                        ]
                    },
                    {
                        "id": "section-7",
                        "title": "技術面與市場情緒指標",
                        "h3_details": []
                    },
                    {
                        "id": "section-8",
                        "title": "風險矩陣與潛在逆風",
                        "h3_details": []
                    },
                    {
                        "id": "section-9",
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
                    }
                ]
            },
            {
                "id": "20260612-spacex-ipo-valuation-break-risk",
                "pillar": "space-frontier",
                "badge": "深度研報",
                "date": "2026-06-12",
                "title": "【SpaceX IPO 估值破發風險】- 2000 億美元被動指數配置如何反噬大盤？為何短期債務與極端稀釋引發流動性踩踏？解構星鏈現金流與三大市場劇本",
                "url": "../news/20260612-spacex-ipo-valuation-break-risk.html",
                "core_conclusion": "本文分析指出「SpaceX 天價 IPO 破發引發的資本反噬：估值悖論、股權稀釋與三種市場劇本演進邏輯」的核心邏輯在於市場供需失衡與產業結構演化。受制於資本開支門檻與總體流動性變化，領先企業透過技術護城河與長約機制鎖定資產溢價，驅動整體產業進行重估值。",
                "indicators": [
                    {
                        "label": "關鍵規模",
                        "value": "2000 億"
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
                        "title": "執行摘要SpaceX IPO 估值為何與基本面警告斷裂？一級市場泡沫如何透過承銷機制轉嫁？其二級市場定價博弈是什麼？",
                        "h3_details": [
                            {
                                "id": "section-5w1h-core",
                                "title": "SpaceX 跨資產定價模型錨定 5W1H 核心架構以穿透 1.75 兆美元估值邊界"
                            }
                        ]
                    },
                    {
                        "id": "chapter-1",
                        "title": "資本市場的歷史性分水嶺與定價的極限SPCX 公開上市為何成為資本市場的歷史性分水嶺？一級市場的認購狂熱如何透支二級市場的流動性？承銷商的定價防線在真實供需面前將面臨怎樣的考驗？",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-2",
                        "title": "估值悖論與基本面的結構性裂痕高達 1.75 兆美元的天價估值為何與財務基本面產生結構性斷裂？三大業務板塊的資本消耗如何拖累自由現金流？極端股權稀釋與短期債務如何引爆融資鏈危機？",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "2.1三大業務板塊資本消耗失衡引發 Q1 淨虧損達 42.8 億美元"
                            },
                            {
                                "id": "section-2-2",
                                "title": "2.2Damodaran 估值模型揭示 SPCX 公允溢價高達 5,000 億美元"
                            },
                            {
                                "id": "section-2-3",
                                "title": "2.3200 億美元橋式貸款再融資壓力與 EchoStar 併購選擇權迫使潛在稀釋超 7.06 億股"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "被動指數機制與系統性流動性反噬SPCX 納入指數後如何機械性擠壓科技巨頭權重？被動資金的重平衡如何引發美股大盤的流動性反噬？一級市場的獨角獸生態系將如何面臨風險投資的流動性冰河期？",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "3.1S&P 500 指數重平衡機械性釋放 1.4% 權重迫使主流科技股面臨拋售壓力"
                            },
                            {
                                "id": "section-3-2",
                                "title": "3.2一級私募市場資金虹吸效應誘發獨角獸企業估值平均收縮 35%"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "三種不同深度之市場劇本推演SPCX 破發後將如何沿襲歷史巨頭的市場軌跡？臉書式陣痛、Uber式通縮與Rivian式崩潰將如何展開？不同劇本對美股系統性流動性產生的衝擊差異是什麼？",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "4.1臉書式劇本演進：綠鞋機制在 110 美元強行支撐以完成弱手籌碼出清"
                            },
                            {
                                "id": "section-4-2",
                                "title": "4.2Uber式劇本演進：二級市場估值長期壓制迫使一級私募創投溢價蒸發 50%"
                            },
                            {
                                "id": "section-4-3",
                                "title": "4.3Rivian式劇本演進：短期再融資失敗共振併購增發引爆 10 億股死亡稀釋螺旋"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "應對巨型獨角獸時代的資產配置戰略全球投資人應如何防禦巨型獨角獸泡沫破裂的系統性衝擊？槓鈴對沖配置策略如何具體部署？傳統避險資產與科技大盤權重的重平衡動態博弈如何開展？",
                        "h3_details": []
                    },
                    {
                        "id": "article-analysis-header",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "跨資產流動性傳導鏈：原油、美債與加密市場的因果推論邏輯",
                                "title": "跨資產流動性傳導鏈：原油、美債與加密市場的因果推論邏輯"
                            },
                            {
                                "id": "邊界條件審計：聯聯會利率路徑、AI 算力變現速度與增發比例限制",
                                "title": "邊界條件審計：聯聯會利率路徑、AI 算力變現速度與增發比例限制"
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
                "id": "20260528-stock-crash-risk",
                "pillar": "valuation",
                "badge": "深度研報",
                "date": "2026-05-28",
                "title": "【美股崩盤風險終局評估】- 宏觀背離如何加速流動性陷阱形成？為何信貸週期轉折點已越過臨界值？解構高位閃崩觸發條件與防禦性配置優先序",
                "url": "../news/20260528-stock-crash-risk.html",
                "core_conclusion": "本篇研究《【美股崩盤風險終局評估 2026】- 宏觀背離如何加速流動性陷阱形成？為何信貸週期轉折點已越過臨界值？解構高位閃崩觸發條件與防禦性配置優先序》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
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
                        "id": "section-1",
                        "title": "第一章：美股36倍本益比為何嚴重脫離宏觀基本面？AI敘事如何掩飾結構性脆弱？為何市場情緒陷入極度恐懼背離？",
                        "h3_details": [
                            {
                                "id": "section-1-3",
                                "title": "1.1 席勒本益比 (CAPE) 飆升至36.4倍：透支AI資本支出預期的極端高估"
                            },
                            {
                                "id": "section-1-7",
                                "title": "1.2 VIX波動率指數常態化突破20：機構資金全面轉向選擇權下行保護"
                            }
                        ]
                    },
                    {
                        "id": "section-2",
                        "title": "第二章：美國經濟為何陷入標準的停滯性通膨？能源外溢如何固化服務業薪資物價螺旋？聯準會的貨幣政策為何面臨無解兩難？",
                        "h3_details": [
                            {
                                "id": "section-2-17",
                                "title": "2.1 實質GDP增速放緩至2.0%：防禦性庫存重建透支未來需求的結構性衰退"
                            },
                            {
                                "id": "section-2-19",
                                "title": "2.2 第一季核心PCE飆升至4.3%：地緣政治與非住房服務通膨引發的工資物價螺旋"
                            }
                        ]
                    },
                    {
                        "id": "section-3",
                        "title": "第三章：殖利率曲線解除倒掛為何是最危險的衰退扳機？長天期利率失控如何引發熊市陡峭化？薩姆規則如何揭露勞動市場裂痕？",
                        "h3_details": [
                            {
                                "id": "section-3-25",
                                "title": "3.1 10年期公債殖利率飆升至4.39%：熊市陡峭化正式啟動流動性緊縮"
                            },
                            {
                                "id": "section-3-32",
                                "title": "3.2 薩姆規則 (Sahm Rule) 讀數攀升至0.13%：私營部門勞動收入軟化預示深度衰退"
                            }
                        ]
                    },
                    {
                        "id": "section-4",
                        "title": "第四章：破兆美元的CRE再融資懸崖為何無法逃避？辦公室資產減損如何傳導至區域銀行？信貸緊縮如何切斷實體經濟命脈？",
                        "h3_details": [
                            {
                                "id": "section-4-36",
                                "title": "4.1 CRE債務牆高達1.26兆美元：辦公室CMBS違約率突破12.34%創歷史新高"
                            },
                            {
                                "id": "section-4-40",
                                "title": "4.2 區域銀行資本緩衝枯竭：資產減損迫使金融體系實施極端信貸緊縮"
                            }
                        ]
                    },
                    {
                        "id": "section-5",
                        "title": "第五章：4兆美元的企業債務牆為何成為定時炸彈？高利率環境如何摧毀殭屍企業？高收益債違約率飆升如何引發跨資產踩踏？",
                        "h3_details": [
                            {
                                "id": "section-5-44",
                                "title": "5.1 企業再融資懸崖逼近4兆美元：3.75%基準利率導致利息保障倍數急遽惡化"
                            },
                            {
                                "id": "section-5-46",
                                "title": "5.2 投機級企業違約率預測攀升至4.75%：槓桿貸款爆發近8%不良債務重組潮"
                            }
                        ]
                    },
                    {
                        "id": "section-6",
                        "title": "第六章：聯準會為何失去貨幣政策獨立性與操作空間？通膨僵固如何摧毀降息預期？重啟量化緊縮 (QT) 如何二次抽乾市場流動性？",
                        "h3_details": [
                            {
                                "id": "section-6-56",
                                "title": "6.1 聯準會前瞻性指引公信力受損：政治極限施壓破壞央行抗通膨職責"
                            },
                            {
                                "id": "section-6-58",
                                "title": "6.2 聯邦基金利率被迫維持3.50%-3.75%：Higher for Longer 宣判高槓桿企業死刑"
                            },
                            {
                                "id": "section-6-60",
                                "title": "6.3 資產負債表的縮減（QT）與系統流動性的抽離：實體市場面臨二次抽乾"
                            }
                        ]
                    },
                    {
                        "id": "section-7",
                        "title": "第七章：擴張性財政法案為何引發聯邦赤字失控？關稅退稅如何向市場注入非理性流動性？貿易政策不確定性如何重創利潤率？",
                        "h3_details": [
                            {
                                "id": "section-7-64",
                                "title": "7.1 OBBBA 法案永久化減稅條款：國債供給氾濫惡化長期公債殖利率與再融資困境"
                            },
                            {
                                "id": "section-7-72",
                                "title": "7.2 IEEPA 判決引發1,750億美元關稅退稅：極端流動性注入與通膨壓抑目標背道而馳"
                            }
                        ]
                    },
                    {
                        "id": "section-8",
                        "title": "第八章：貨幣市場基金為何吸納破紀錄的7.77兆美元？場外資金觀望如何導致股市流動性枯竭？黃金為何成為法幣貶值終極避風港？",
                        "h3_details": [
                            {
                                "id": "section-8-76",
                                "title": "8.1 貨幣市場基金 (MMF) 總資產飆升至7.77兆美元：機構資金鎖定無風險收益拒絕承接股市"
                            },
                            {
                                "id": "section-8-82",
                                "title": "8.2 全球央行淨買入244噸實體黃金：避險資金對沖雙重宏觀風險推升金價目標至6,000美元"
                            }
                        ]
                    },
                    {
                        "id": "section-9",
                        "title": "第九章：結論：美股距離30%結構性崩盤的真實時間點為何？殖利率解除倒掛與債務牆如何啟動倒數計時？跨資產對沖為何是唯一生存法則？",
                        "h3_details": []
                    },
                    {
                        "id": "article-analysis",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "文章推論邏輯分析",
                                "title": "文章推論邏輯分析"
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
                "id": "20260517-us-pre-ipo-bubble-and-liquidity-flight",
                "pillar": "space-frontier",
                "badge": "深度研報",
                "date": "2026-05-17",
                "title": "【美股 Pre-IPO 泡沫與流動性逃命潮】- 二級市場兩極化如何反映 VC 退出壓力？為何一二級倒掛成系統性風險訊號？解構 Pre-IPO 流動性陷阱",
                "url": "../news/20260517-us-pre-ipo-bubble-and-liquidity-flight.html",
                "core_conclusion": "本文分析指出「美股 Pre-IPO 泡沫或逃命潮？2026 二級市場兩極化、VC 退出壓力與一二級倒掛真相」的核心邏輯在於市場供需失衡與產業結構演化。受制於資本開支門檻與總體流動性變化，領先企業透過技術護城河與長約機制鎖定資產溢價，驅動整體產業進行重估值。",
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
                        "title": "AI 獨角獸為何狂飆至 80 倍營收倍數？一二級市場倒掛如何引發 VC 套現潮？為何納指 100 快速入標新規會引爆存量科技巨擘的流動性抽水？",
                        "h3_details": [
                            {
                                "id": "section-5w1h-core",
                                "title": "一二級市場倒掛與流動性轉移：2026 年 Pre-IPO 管道累積總估值突破 3.12 兆美元的二極化分流矩陣"
                            }
                        ]
                    },
                    {
                        "id": "chapter-1",
                        "title": "為何 3.12 兆美元的 Pre-IPO 管道面臨二級市場接盤斷層？3.8% 黏性通膨如何壓制資產折現率？為何高利率環境成為 SaaS 獨角獸的流動性試煉場？",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-2",
                        "title": "少數頭部巨象如何壟斷兆元級別的未上市資金？SpaceX 1.75 兆美元體量如何造成二級市場排擠效應？為何 Databricks 憑藉 140% 留存率享有極度估值剛性？",
                        "h3_details": [
                            {
                                "id": "table-core-pre-ipo-valuation",
                                "title": "巨頭估值集中矩陣：SpaceX 預估市值達 1.75 兆美元與 OpenAI 衝破 1.0 兆美元的極端權重分佈"
                            },
                            {
                                "id": "valuation-logic-evolution",
                                "title": "淨收入留存率估值剛性：Databricks 憑藉 140% NRR 實現客戶群年化 40% 支出的基本面護城河"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "原油衝擊如何摧毀聯準會年內降息預期？39 兆美元天量聯邦國債如何推升期限溢價？為何 4.5% 無風險收益率會引發機構資金逃離一級半市場？",
                        "h3_details": [
                            {
                                "id": "inflation-and-oil-shock",
                                "title": "能源通膨年增率 17.9% 衝擊：原油大漲引發 4 月 CPI 攀升至 3.8% 迫使年內降息預期驟降至 1 次"
                            },
                            {
                                "id": "debt-crisis-and-term-premium",
                                "title": "39 兆美元國庫利息重壓：每日利息支出衝破 30 億美元帶動 10 年期美債收益率高位穩守 4.5% 防線"
                            },
                            {
                                "id": "table-macro-indicators-2026",
                                "title": "2026 年核心經濟指標動態對比表：聯邦預算赤字達 1.9 兆美元引發系統性金融尾部估值壓制"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "納斯達克 100 快速入標新規如何引爆千億被動基金調倉踩踏？強制買入新權重股為何導致微軟蘋果面臨無差別抽水？私募信貸 469 億美元困境債務如何引爆獨角獸流血拋售？",
                        "h3_details": [
                            {
                                "id": "nasdaq-fast-entry",
                                "title": "快速入標 15 日納入條款：追蹤 QQQ 等被動 ETF 必須騰出千億美元建倉水位觸發存量權重股踩踏抽水"
                            },
                            {
                                "id": "private-credit-mines",
                                "title": "私募信貸 469 億美元困境地雷：SaaS 企業在 2021 年以 30 倍 EBITDA 舉債導致轉讓折價逾 50%"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "美國中期選舉前夕財政刺激如何造成利率死結？OBBBA 法案研發抵免如何推升 AI 獨角獸遠期盈利？為何 SEC 阿特金斯時代放寬員工持股轉讓會加劇首日解鎖賣壓？",
                        "h3_details": [
                            {
                                "id": "obbba-act",
                                "title": "一個大美法案 470 億美元退稅雙刃劍：研發全額扣除永久化提振 AI 估值伴隨財政赤字推升長端美債收益率"
                            },
                            {
                                "id": "sec-deregulation",
                                "title": "阿特金斯去監管化協議：SEC 大幅縮減新興成長公司維持費用並放寬員工持股轉讓帶動首日龐大拋壓"
                            },
                            {
                                "id": "trump-vs-powell",
                                "title": "央行獨立性干預危機：特朗普強推降息施政目標引發資本市場對 1970 年代式二浪惡性通膨的極端戒備"
                            }
                        ]
                    },
                    {
                        "id": "chapter-6",
                        "title": "為何 AI 原生應用享有 80 倍 ARR 的盛宴狂歡？傳統席位計費模式如何被 AI Agent 徹底顛覆？為何存續期屆滿的創投基金面臨致命 DPI 壓力被迫推動流血上市？",
                        "h3_details": [
                            {
                                "id": "ai-infra-boom",
                                "title": "算力特權硬體狂飆效應：CoreWeave 上市飆升 149.74% 確立 Anthropic 與 OpenAI 衝破 30x 估值定價錨點"
                            },
                            {
                                "id": "saas-exodus",
                                "title": "席位訂閱模式崩潰大逃亡：Figma 營收成長 40% 但二級私人轉讓估值重挫 80% 揭露創投基金 DPI 套現焦慮"
                            },
                            {
                                "id": "table-ev-multiples-comparison",
                                "title": "Pre-IPO 賽道估值分化比較：AI 基礎設施 15-25x EV/Forward Revenue 與傳統 SaaS 崩至 4-6x 的割裂矩陣"
                            }
                        ]
                    },
                    {
                        "id": "chapter-7",
                        "title": "這波萬億 AI 熱潮與 2000 年網路泡沫有何本質差異？千億美元資本支出如何構建真實硬體營收？為何給予大模型十年獨佔軟體開支假設會形成致命透支風險？",
                        "h3_details": [
                            {
                                "id": "dotcom-vs-ai",
                                "title": "千億美元實體資本開支底座：輝達與微軟重金投入算力中心徹底擺脫 1999 年零營收純概念虛無泡沫"
                            },
                            {
                                "id": "oil-shocks-comparison",
                                "title": "伊朗原油衝擊對沖轉型：AI 演算法賦能壓低營運成本對抗 1970 年代式高通膨本益比壓縮效應"
                            }
                        ]
                    },
                    {
                        "id": "chapter-8",
                        "title": "特朗普看跌期權面對外部地緣通膨為何失靈？100% 關稅如何引發進口成本暴增反噬聯準會降息空間？為何第三季度的政治行情拉升成為二級投資人最後逃生門？",
                        "h3_details": [
                            {
                                "id": "policy-limits",
                                "title": "看跌期權政策邊際遞減效應：100% 中國關稅推升終端 CPI 與霍爾木茲海峽衝突高昂保費鎖死降息下限"
                            },
                            {
                                "id": "midterm-intervention",
                                "title": "第三季度大選護盤逃生出口：政府強制釋放短期流動性創造 7 至 10 月估值反彈視窗與機構出貨大潮"
                            }
                        ]
                    },
                    {
                        "id": "chapter-9",
                        "title": "宏觀避險交易員面對 Pre-IPO 兩極化分流該如何建構防禦組合？為何改盯自由現金流收益率成為高息紀元生存鐵律？如何配置能源與航太稀缺主權資產建立非對稱避險？",
                        "h3_details": [
                            {
                                "id": "final-verdict",
                                "title": "雙軌盛宴與逃亡分流界定：自由現金流 AI 原生企業加冕與背負 30 倍 EBITDA 負債 SaaS 孤注一擲流血掛牌"
                            },
                            {
                                "id": "investor-action-plan",
                                "title": "機構級打新與避險防禦守則：避開快速入標兩週調倉震盪期並將估值錨定切換至 FCF/EV 自由現金造血率"
                            },
                            {
                                "id": "table-macro-risk-factors",
                                "title": "2026 年宏觀尾部風險因子權重表：通膨與美債利息雙重 8-9 分壓制與 AI 生產力 10 分極致正向對衝"
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
                        "title": "Mason Yang 的戰略觀察 (Actionable Intelligence)",
                        "h3_details": []
                    },
                    {
                        "id": "專業投研機構引用的著作與原始數據文獻",
                        "title": "專業投研機構引用的著作與原始數據文獻",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "20260516-us-stock-valuation-extremes-and-short-squeeze-analysis",
                "pillar": "valuation",
                "badge": "深度研報",
                "date": "2026-05-16",
                "title": "【美股估值極端與軋空風險】 - AI 籌碼擁擠與高 P/S 溢價如何反轉？解構量化警戒閾值與崩跌訊號",
                "url": "../news/20260516-us-stock-valuation-extremes-and-short-squeeze-analysis.html",
                "core_conclusion": "2026 年 5 月美股標普 500 突破 7,400 點新高，但產業與明星股估值分化達到歷史極致。在 AI 資本開支狂潮與高通膨黏性擠壓下，13F 機構極度擁擠於少數科技巨頭，而市政債封閉式基金做空激增 450%，預示市場面臨流動性抽血與均值回歸的非對稱性風險。",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "450%"
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
                        "id": "chapter-0",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-1",
                        "title": "AI 資本開支與折現率壓制6700 億資本支出如何對抗 3.8% 高黏性通膨與能源溢價衝擊",
                        "h3_details": [
                            {
                                "id": "table-macro-indicators",
                                "title": "宏觀折現率定價壓制：10 年期美債殖利率攀升 4.47% 與原油突破 107 美元觸發估值乘數重估"
                            }
                        ]
                    },
                    {
                        "id": "chapter-2",
                        "title": "板塊極端估值與 K 型撕裂生物技術 8.4 倍市銷率與超微 62 倍遠期 PE 背後的存量博弈",
                        "h3_details": [
                            {
                                "id": "industry-valuation-extremes",
                                "title": "產業板塊估值光譜對比：科技股平均 P/S 狂飆 8.1 倍超越 2023 年中值 5.3 倍歷史極值"
                            },
                            {
                                "id": "tech-stars-perfect-pricing",
                                "title": "科技巨頭定價完美狂潮：美光 EPS 成長 610% 與超微遠期 PE 飆達 62.68 倍極端矩陣"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "生產力傳導延滯與營收斷層全要素生產力 1.4% 增速如何暴露 6000 億美元終端變現缺口",
                        "h3_details": [
                            {
                                "id": "tfp-growth-lag",
                                "title": "全要素生產力傳導延滯：算力伺服器資本開支躍升但 2026 TFP 僅微幅成長 1.4%"
                            },
                            {
                                "id": "ai-revenue-chasm",
                                "title": "終端軟體商業化斷層檢驗：紅杉資本模型測算揭露高達 6,000 億美元 SaaS 營收缺口"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "13F 機構擁擠度與防禦輪動微軟與輝達 78.4% 持股集中度引發的羊群效應與標普 493 避險",
                        "h3_details": [
                            {
                                "id": "table-institutional-herding",
                                "title": "頂級避險基金擁擠度矩陣：微軟與英偉達霸占超 70% 機構持股總量的羊群共振分佈"
                            },
                            {
                                "id": "sp-493-rotation",
                                "title": "主力資金高位切換輪動：避險資金流向公用事業與國防板塊構建大盤估值下跌緩衝墊"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "放空集中度與暴力軋空風險FCHL 278% 流通放空比與市政債基金空單激增 450% 的對沖傳導",
                        "h3_details": [
                            {
                                "id": "table-highest-short-float",
                                "title": "全市場空單集中度巔峰榜：Wolfspeed 賣空佔比 57.6% 隱含單日暴力軋空斷頭的極端風險"
                            },
                            {
                                "id": "table-short-change-funds",
                                "title": "賣空動能一階導數激增：封閉式基金做空餘額狂飆 454% 鎖定短借長貸高槓桿結構的定價脆性"
                            }
                        ]
                    },
                    {
                        "id": "chapter-6",
                        "title": "技術超買警報與市場寬度背離標普 RSI 74.5 與成分股守住 200 日線比率降至 68% 的內部撕裂",
                        "h3_details": [
                            {
                                "id": "table-rsi-overbought",
                                "title": "標普成分股 RSI 極端超買前十強：Vistra 與 Constellation 動能指標突破 86 的電網特許狂潮"
                            },
                            {
                                "id": "market-breadth-divergence",
                                "title": "市場寬度頂部深層背離：看漲期權總交易量狂飆至看跌期權 2 倍的極致情緒自滿陷阱"
                            }
                        ]
                    },
                    {
                        "id": "chapter-7",
                        "title": "流動性黑洞與主權避險重構SpaceX 首次公開募股抽水效應與美債 5% 確切回報的資金重配",
                        "h3_details": [
                            {
                                "id": "spacex-ipo-sink",
                                "title": "SpaceX 首次公開募股流動性黑洞：千億美元打新鎖定金引爆科技領袖板塊的短線抽血風暴"
                            },
                            {
                                "id": "midterm-elections",
                                "title": "中期選舉大考財政博弈：參眾兩院控制權爭奪牽動赤字擴張與科技補貼去向的估值重塑"
                            },
                            {
                                "id": "safe-haven-assets",
                                "title": "避險資產定價哲學劇變：黃金突破天價與美債鎖定 5% 確切回報構建主權信用對沖雙軌"
                            }
                        ]
                    },
                    {
                        "id": "chapter-8",
                        "title": "操盤手防禦架構與策略配置嚴格執行高估值移動止盈與分批轉向標普 493 價值資產",
                        "h3_details": [
                            {
                                "id": "avoid-high-ps",
                                "title": "1. 嚴格規避高估值市銷率與超買標的：實行移動止盈規避靜態 P/S 超 30 倍與 RSI 逾 85 個股"
                            },
                            {
                                "id": "alert-short-float",
                                "title": "2. 徹底防範做空部位密集雷區：嚴禁單邊操作 FCHL 等賣空佔比逾 100% 浮動籌碼標的"
                            },
                            {
                                "id": "defensive-rotation",
                                "title": "3. 戰略防守反擊轉向公允價值：拉升短期國庫券部位坐享年化 5% 息收並切換權益至 S&P 493"
                            }
                        ]
                    },
                    {
                        "id": "chapter-9",
                        "title": "多維決策模型與終局演化解構海外剛性避險沉澱與定價完美崩解下的非對稱性路徑",
                        "h3_details": [
                            {
                                "id": "2026年美股估值極端與流動性危機-5w1h-深度矩陣-算力定價與-6000-億-saas-營收現實的撕裂推演",
                                "title": "2026 年美股估值極端與流動性危機 5W1H 深度矩陣：算力定價與 6000 億 SaaS 營收現實的撕裂推演"
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
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "news-20260124-tom-lee-2026",
                "pillar": "valuation",
                "badge": "深度研報",
                "date": "2026-01-24",
                "title": "【Tom Lee 預測實測深度分析】- 比特幣 25 萬美元論點如何通過鏈上驗證？為何美股 20% 回調預警比市場預期更早觸發？解構多頭框架與反身性機制",
                "url": "../news/20260124-tom-lee-2026.html",
                "core_conclusion": "本篇研究《【Tom Lee 2026 預測實測深度分析】- 比特幣 25 萬美元論點如何通過鏈上驗證？為何美股 20% 回調預警比市場預期更早觸發？解構多頭框架與反身性機制》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "20%"
                    },
                    {
                        "label": "關鍵規模",
                        "value": "25 萬"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "tom-lee-報告結構化摘要",
                        "title": "Tom Lee 報告結構化摘要",
                        "h3_details": [
                            {
                                "id": "1-2026-市場總體展望",
                                "title": "2026 市場總體展望"
                            },
                            {
                                "id": "2-長期牛市的三大驅動力",
                                "title": "長期牛市的三大驅動力"
                            },
                            {
                                "id": "3-加密貨幣與商品資產",
                                "title": "加密貨幣與商品資產"
                            },
                            {
                                "id": "4-板塊配置與選股策略",
                                "title": "板塊配置與選股策略"
                            },
                            {
                                "id": "5-投資心法",
                                "title": "投資心法"
                            }
                        ]
                    },
                    {
                        "id": "文章分析",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "思考邏輯與推論方式分析歸納",
                                "title": "思考邏輯與推論方式分析歸納"
                            },
                            {
                                "id": "潛在盲點與批判性反思",
                                "title": "潛在盲點與批判性反思"
                            }
                        ]
                    },
                    {
                        "id": "mason-yang-observation",
                        "title": "Mason Yang 的觀察",
                        "h3_details": []
                    }
                ]
            }
        ]
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TOPIC_US_EQUITIES_COT_DATA;
    } else {
        root.TOPIC_US_EQUITIES_COT_DATA = TOPIC_US_EQUITIES_COT_DATA;
    }
})(typeof window !== 'undefined' ? window : this);
