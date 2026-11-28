/**
 * assets/js/topics/topic-strategies-tools-cot-data.js
 * 專題知識階層樹與思考鏈核心資料庫 (Data SSOT)
 * 由 tools/sync_topic_cot.py 自動同步編譯，嚴禁破壞 JSON 結構。
 */
(function (root) {
    const TOPIC_STRATEGIES_TOOLS_COT_DATA = {
        "topic": "topic-strategies-tools",
        "title": "投研策略與實戰工具",
        "generated_at": "2026-11-28",
        "pillars": [
            {
                "id": "all",
                "label": "全部策略與工具",
                "short": "ALL"
            },
            {
                "id": "equities-dcf",
                "label": "I. 基本面與 DCF 估值",
                "short": "DCF & FUNDAMENTAL"
            },
            {
                "id": "options-vol",
                "label": "II. 期權與波動率微結構",
                "short": "OPTIONS & VOL"
            },
            {
                "id": "macro-futures",
                "label": "III. 固收、期貨與另類",
                "short": "MACRO & FUTURES"
            },
            {
                "id": "workstations",
                "label": "IV. 實戰工具與工作站",
                "short": "WORKSTATIONS"
            }
        ],
        "macro_ledger": [
            {
                "id": "metric-strategy-catalog",
                "name": "系統化策略百科收錄",
                "current": "151+ 實戰策略模型",
                "baseline": "橫跨技術/基本/固收/期權/期貨",
                "status": "normal",
                "note": "全系列長青策略指南已接軌實證時間軸與相關工具工作站",
                "updated_at": "2026-11-28",
                "source_url": "../post/trading-strategies-list-151.html"
            },
            {
                "id": "metric-ai-dc-mw",
                "name": "AI 資料中心併購估值錨",
                "current": "~$2,700 萬 / MW (北維吉尼亞)",
                "baseline": "IREN 靜態對齊 $42.79 基準",
                "status": "warning",
                "note": "AlphaVal Workstation 已同步修正靜態市價基準，反映已出租算力資產溢價",
                "updated_at": "2026-11-28",
                "source_url": "../post/tools-ai-valuation-workstation.html"
            },
            {
                "id": "metric-gex-regime",
                "name": "期權做市商 GEX 狀態監控",
                "current": "Negative Gamma 警戒",
                "baseline": "年終考核與 Vanna/Charm 效應",
                "status": "triggered",
                "note": "跌破 Gamma Flip 後造市商順週期對沖放大跨資產日內波動",
                "updated_at": "2026-11-28",
                "source_url": "../post/trading-strategies-options-volatility-strategies.html"
            },
            {
                "id": "metric-zero-build-apps",
                "name": "Zero-Build 互動投研終端",
                "current": "4 大互動工作台運行中",
                "baseline": "CoT / DCF / 礦企表 / 演化圖譜",
                "status": "normal",
                "note": "全站純原生 JS + Shadow DOM 封裝，支援離線與瀏覽器即時試算",
                "updated_at": "2026-11-28",
                "source_url": "../apps/cot-studio/index.html"
            }
        ],
        "concepts": [
            {
                "id": "dcf-sensitivity",
                "code": "VALUATION",
                "title": "WACC 與終端成長率雙維敏感度",
                "desc": "在無風險利率上移至 ~4.9%–5.3% 的高利率體制下，折現率微調 50 bps 即可對長存續期科技股估值造成 15%–25% 衝擊。",
                "threshold": "紀律：嚴格使用 10Y/30Y 美債實質殖利率作為無風險利率基準",
                "url": ""
            },
            {
                "id": "ev-mw-valuation",
                "code": "INFRASTRUCTURE",
                "title": "EV / MW 算力電力估值法",
                "desc": "針對轉型 AI HPC 的比特幣礦企與 Neocloud 業者，以企業價值除以已簽約或已通電之 MW 電力容量，剝離短期折舊雜訊。",
                "threshold": "市場對照：北維吉尼亞已出租資產基準已拉升至 ~$2,700 萬/MW",
                "url": ""
            }
        ],
        "articles": [
            {
                "id": "tools-ai-valuation-workstation",
                "pillar": "workstations",
                "badge": "方法指南",
                "date": "2026-11-28",
                "title": "AlphaVal Workstation — 法人級 AI 基本面估值與同業對標工作站",
                "url": "../post/tools-ai-valuation-workstation.html",
                "core_conclusion": "AlphaVal Workstation — 法人級 AI 基本面估值與同業對標工作站。整合 DCF 模型、EV/MW 乘數與同業對標分析，提供即時動態估值試算。",
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
                        "id": "activeTickerTitle",
                        "title": "IREN:NASDAQ",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "market-microstructure-chip-analysis-guide",
                "pillar": "options-vol",
                "badge": "方法指南",
                "date": "2026-11-24",
                "title": "【核心機制】市場微觀結構與籌碼分析框架 - 空頭擠壓、可轉債套利壓制與機構擁擠度實戰指南",
                "url": "../post/market-microstructure-chip-analysis-guide.html",
                "core_conclusion": "報告核心摘要 (Executive Summary) 強制回補與流動性真空：台股融券受制於停止過戶日前 6 個營業日強制回補，美股極端流通放空比（如 57.6% 至 278%）與借券召回同樣能引爆與基本面脫鉤的垂直軋空。 可轉債套利的 Gamma 天花板：高成長重資產企業大規模發行零息可轉債後，避險基金透過 Delta 中性動態放空對沖，在產能尚未兌現的空…",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "57.6%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "278%"
                    },
                    {
                        "label": "實證指標",
                        "value": "待標註"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "chapter-0-summary",
                        "title": "執行摘要 市場微觀籌碼結構的 5W1H 認知架構",
                        "h3_details": [
                            {
                                "id": "section-5w1h-core",
                                "title": "5W1H 深度邏輯總結"
                            }
                        ]
                    },
                    {
                        "id": "chapter-1",
                        "title": "空方雙軌機制 借券賣出、融券強制回補與軋空死亡螺旋",
                        "h3_details": [
                            {
                                "id": "section-1-1",
                                "title": "1.1 借券賣出 vs. 融券賣出：時間脆性與法人訊號解讀"
                            },
                            {
                                "id": "section-1-2",
                                "title": "1.2 融券回補力道公式與極端流通放空比警報"
                            }
                        ]
                    },
                    {
                        "id": "chapter-2",
                        "title": "衍生品壓制 可轉債套利 (Convertible Arbitrage) 與 ATM 融資稀釋",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "2.1 可轉債 Delta 動態放空與 Gamma 供給天花板"
                            },
                            {
                                "id": "section-2-2",
                                "title": "2.2 ATM 融資節奏與「散戶轉長線機構」的籌碼換手"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "擁擠度與鏈上結構 13F 機構羊群共振與鏈上空頭瀑布清算",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "3.1 13F 機構擁擠度臨界點與主動輪動防禦"
                            },
                            {
                                "id": "section-3-2",
                                "title": "3.2 鏈上長期鎖倉與永續合約空頭瀑布 (Short Cascade)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "跨市場微觀矩陣 四大籌碼異象之量化閾值與訊號對照",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-5",
                        "title": "實證時間軸 籌碼分析賽道關鍵實證與邊界檢驗 (Empirical Timeline)",
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
                        "title": "Mason Yang 的觀察 Actionable Intelligence 決策模型與風控準則",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "20261121-gex-quant-monitoring-pipeline",
                "pillar": "options-vol",
                "badge": "深度研報",
                "date": "2026-11-21",
                "title": "【GEX 量化監控管線】 - 造市商負 Gamma 如何引爆流動性踩踏？為何單看隱含波動率常失靈？拆解 TXO Vanna/Charm 與法人雙重驗證系統",
                "url": "../news/20261121-gex-quant-monitoring-pipeline.html",
                "core_conclusion": "衍生品造市商在負 Gamma 區間的機械性動態對沖，才是點燃市場流動性踩踏的微觀引擎。透過將美股 SPY GEX、台灣期交所 TXO 高階 Greeks（Vanna/Charm）與三大法人期貨淨未平倉封裝為零伺服器自動化管線，交易者得以在價格失控前精準定位造市商對沖壓力與防線臨界點。",
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
                        "id": "1-美股-spy-gex-核心計算與-python-實作-v1-原型",
                        "title": "1. 美股 SPY GEX 核心計算與 Python 實作（v1 原型）",
                        "h3_details": [
                            {
                                "id": "1-1-核心計算公式與造市商假設",
                                "title": "1.1 核心計算公式與造市商假設"
                            },
                            {
                                "id": "1-2-完整-python-實作程式碼",
                                "title": "1.2 完整 Python 實作程式碼"
                            },
                            {
                                "id": "1-3-實戰使用與擴充微調建議",
                                "title": "1.3 實戰使用與擴充微調建議"
                            }
                        ]
                    },
                    {
                        "id": "2-高階-greeks-vanna-charm-與台灣期交所-txo-自動化管線-v2",
                        "title": "2. 高階 Greeks（Vanna / Charm）與台灣期交所 TXO 自動化管線（v2）",
                        "h3_details": [
                            {
                                "id": "2-1-核心希臘字母與造市商對沖公式",
                                "title": "2.1 核心希臘字母與造市商對沖公式"
                            },
                            {
                                "id": "2-2-完整-python-自動化管線程式碼",
                                "title": "2.2 完整 Python 自動化管線程式碼"
                            },
                            {
                                "id": "2-3-自動化部署與-google-sheets-串接設定清單",
                                "title": "2.3 自動化部署與 Google Sheets 串接設定清單"
                            }
                        ]
                    },
                    {
                        "id": "3-三大法人台指期雙重驗證-v3-與-github-actions-每日排程",
                        "title": "3. 三大法人台指期雙重驗證（v3）與 GitHub Actions 每日排程",
                        "h3_details": [
                            {
                                "id": "3-1-為什麼要加入-三大法人台指期未平倉-做雙重驗證",
                                "title": "3.1 為什麼要加入「三大法人台指期未平倉」做雙重驗證？"
                            },
                            {
                                "id": "3-2-完整升級版-python-腳本-scripts-txo-gex-pipeline-py",
                                "title": "3.2 完整升級版 Python 腳本（`scripts/txo_gex_pipeline.py`）"
                            },
                            {
                                "id": "3-3-github-actions-零伺服器每日自動排程設定",
                                "title": "3.3 GitHub Actions 零伺服器每日自動排程設定"
                            },
                            {
                                "id": "3-4-部署前最後檢查清單-3-分鐘完成",
                                "title": "3.4 部署前最後檢查清單（3 分鐘完成）"
                            }
                        ]
                    },
                    {
                        "id": "4-擴充模組-pcr-vixtwn-指標與美股跨市場早晚報",
                        "title": "4. 擴充模組PCR / VIXTWN 指標與美股跨市場早晚報",
                        "h3_details": [
                            {
                                "id": "4-1-模組一-加入台灣期交所-pcr-put-call-ratio-與-vixtwn-波動率指標",
                                "title": "4.1 模組一：加入台灣期交所 PCR（Put/Call Ratio）與 VIXTWN 波動率指標"
                            },
                            {
                                "id": "4-2-模組二-美股-spy-qqq-跨市場早晚報與雙時段排程",
                                "title": "4.2 模組二：美股 SPY / QQQ 跨市場早晚報與雙時段排程"
                            }
                        ]
                    },
                    {
                        "id": "5-google-apps-script-自動異常警報與戰情儀表板",
                        "title": "5. Google Apps Script 自動異常警報與戰情儀表板",
                        "h3_details": [
                            {
                                "id": "5-1-apps-script-警報與看板腳本",
                                "title": "5.1 Apps Script 警報與看板腳本"
                            },
                            {
                                "id": "5-2-設定-apps-script-自動觸發器-2-步驟",
                                "title": "5.2 設定 Apps Script 自動觸發器（2 步驟）"
                            }
                        ]
                    },
                    {
                        "id": "6-雙軌視覺化升級-靜態網頁儀表板與-google-sheets-歷史趨勢圖",
                        "title": "6. 雙軌視覺化升級靜態網頁儀表板與 Google Sheets 歷史趨勢圖",
                        "h3_details": [
                            {
                                "id": "6-1-串接靜態網頁儀表板-github-pages-json-輸出與自動-commit",
                                "title": "6.1 串接靜態網頁儀表板（GitHub Pages JSON 輸出與自動 Commit）"
                            },
                            {
                                "id": "6-2-優化-google-sheets-歷史趨勢折線圖自動生成-apps-script",
                                "title": "6.2 優化 Google Sheets 歷史趨勢折線圖自動生成（Apps Script）"
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
                "id": "trading-strategies-ai-microstructure-edge",
                "pillar": "options-vol",
                "badge": "方法指南",
                "date": "2026-10-26",
                "title": "AI 時代的市場共識崩塌與微觀博弈優勢構建",
                "url": "../post/trading-strategies-ai-microstructure-edge.html",
                "core_conclusion": "AI 驅動的同質化資訊踩踏使傳統公開 Alpha 徹底衰竭，並引發流動性瞬間抽離。現代交易的真正優勢不在於預測宏觀走向，而是識別負 Gamma 做市商順週期拋售導致的流動性真空，在非自願踩踏的極限枯竭點提供非對稱流動性，博取斷層修復的統計溢價。",
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
                        "id": "從同質化信息踩踏到流動性斷層修復的交易範式轉變",
                        "title": "從同質化信息踩踏到流動性斷層修復的交易範式轉變",
                        "h3_details": []
                    },
                    {
                        "id": "一-執行摘要與核心指標矩陣-executive-summary",
                        "title": "一、執行摘要與核心指標矩陣（Executive Summary）",
                        "h3_details": []
                    },
                    {
                        "id": "二-背景與問題界定-ai-時代的-信息通脹-與共識陷阱",
                        "title": "二、背景與問題界定AI 時代的「信息通脹」與共識陷阱",
                        "h3_details": [
                            {
                                "id": "公開信息價值的邊際衰減",
                                "title": "公開信息價值的邊際衰減"
                            },
                            {
                                "id": "共識的形成機制與內在脆弱性",
                                "title": "共識的形成機制與內在脆弱性"
                            },
                            {
                                "id": "傳統交易邏輯的失效",
                                "title": "傳統交易邏輯的失效"
                            }
                        ]
                    },
                    {
                        "id": "三-微觀結構拆解-交易優勢的真正來源-the-edge",
                        "title": "三、微觀結構拆解交易優勢的真正來源（The Edge）",
                        "h3_details": [
                            {
                                "id": "優勢重新定義-零和博弈下的被動操作捕捉",
                                "title": "優勢重新定義：零和博弈下的被動操作捕捉"
                            },
                            {
                                "id": "對手盤畫像分析",
                                "title": "對手盤畫像分析"
                            },
                            {
                                "id": "分歧建立與小樣本統計檢驗",
                                "title": "分歧建立與小樣本統計檢驗"
                            }
                        ]
                    },
                    {
                        "id": "四-策略邏輯與執行架構-從枯竭點到斷層修復",
                        "title": "四、策略邏輯與執行架構從枯竭點到斷層修復",
                        "h3_details": [
                            {
                                "id": "市場斷層-liquidity-gaps-的形成機理",
                                "title": "市場斷層（Liquidity Gaps）的形成機理"
                            },
                            {
                                "id": "反轉信號識別-枯竭點-exhaustion-points-判定",
                                "title": "反轉信號識別：枯竭點（Exhaustion Points）判定"
                            },
                            {
                                "id": "交易架構設計-execution-roadmap",
                                "title": "交易架構設計（Execution Roadmap）"
                            }
                        ]
                    },
                    {
                        "id": "五-風險控制與量化驗證體系",
                        "title": "五、風險控制與量化驗證體系",
                        "h3_details": [
                            {
                                "id": "黑天鵝與極端尾部風險防護",
                                "title": "黑天鵝與極端尾部風險防護"
                            },
                            {
                                "id": "心理偏差校準與頭寸規模控制",
                                "title": "心理偏差校準與頭寸規模控制"
                            }
                        ]
                    },
                    {
                        "id": "六-結論與實務落地建議",
                        "title": "六、結論與實務落地建議",
                        "h3_details": []
                    },
                    {
                        "id": "附錄-核心術語與微觀結構指標矩陣",
                        "title": "附錄核心術語與微觀結構指標矩陣",
                        "h3_details": [
                            {
                                "id": "做市商-delta-gamma-對沖-mm-delta-gamma-hedging",
                                "title": "做市商 Delta/Gamma 對沖（MM Delta/Gamma Hedging）"
                            },
                            {
                                "id": "零-gamma-水平-gamma-翻轉線-zero-gamma-level-gamma-flip",
                                "title": "零 Gamma 水平 / Gamma 翻轉線（Zero Gamma Level / Gamma Flip）"
                            },
                            {
                                "id": "訂單流失衡-order-flow-imbalance-ofi",
                                "title": "訂單流失衡（Order Flow Imbalance, OFI）"
                            },
                            {
                                "id": "訂單簿失衡-order-book-imbalance-obi",
                                "title": "訂單簿失衡（Order Book Imbalance, OBI）"
                            },
                            {
                                "id": "流動性斷層-liquidity-gaps",
                                "title": "流動性斷層（Liquidity Gaps）"
                            },
                            {
                                "id": "擁擠度指標-crowding-metrics",
                                "title": "擁擠度指標（Crowding Metrics）"
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
                "id": "trading-strategies-dcf-valuation-model",
                "pillar": "equities-dcf",
                "badge": "方法指南",
                "date": "2026-08-19",
                "title": "投資策略｜動態雙軌制 DCF 估值計算機：NVDA 隱含預期反推",
                "url": "../post/trading-strategies-dcf-valuation-model.html",
                "core_conclusion": "零建置 (Zero-Build) 雙軌制估值系統：結合正向折現與 Bisection 數值逼近反向解題。調整滑桿即刻體驗 WACC 複利蒸發效應與市場隱含預期反推，支援蒙地卡羅波動模擬與 CSP 資本支出門檻檢驗。",
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
                        "id": "chapter-timeline",
                        "title": "歷史實證時間軸 估值反推與資本週期實證紀錄",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "trading-strategies-commodity-futures",
                "pillar": "macro-futures",
                "badge": "方法指南",
                "date": "2026-05-22",
                "title": "投資策略｜大宗商品期貨量化策略：解密 CTA 管理期貨與期限結構獲利法則",
                "url": "../post/trading-strategies-commodity-futures.html",
                "core_conclusion": "面對 2026 年通膨與地緣政治波動，如何透過量化模型獲利？深入解析大宗商品期貨的期限結構、展期收益，以及銅金比、金銀比等機構級宏觀套利策略。",
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
                        "id": "chapter-1",
                        "title": "引言：大宗商品市場的微觀結構與定價哲學",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-2",
                        "title": "5.1 與 5.2：管理期貨策略（CTA）與趨勢追隨的演進",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "危機Alpha與正偏態的收益特徵"
                            },
                            {
                                "id": "section-2-2",
                                "title": "迷失的十年與宏觀政經環境的更迭"
                            },
                            {
                                "id": "section-2-3",
                                "title": "波動率目標與部位規模管理（Volatility Targeting & Position Sizing）"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "5.3 與 5.4：期限結構、展期收益與日曆價差策略",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "展期收益（Roll Yield）的數學機制與拖累效應"
                            },
                            {
                                "id": "section-3-2",
                                "title": "日曆價差（Calendar Spreads）的交易邏輯"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "5.5 至 5.7：跨商品價差與產業鏈套利機制",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "裂解價差（Crack Spreads）：煉油廠利潤率的宏觀晴雨表"
                            },
                            {
                                "id": "section-4-2",
                                "title": "壓榨價差（Crush Spreads）：農產品加工的毛利率鎖定機制"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "5.8 基礎金屬與貴金屬宏觀套利策略",
                        "h3_details": [
                            {
                                "id": "section-5-1",
                                "title": "銅金比（Copper-Gold Ratio）：全球經濟與利率的終極領先指標"
                            },
                            {
                                "id": "section-5-2",
                                "title": "金銀比（Gold-Silver Ratio）與機器學習在動態套利的應用"
                            }
                        ]
                    },
                    {
                        "id": "chapter-6",
                        "title": "投資組合保證金與風險管理機制（SPAN Methodology）",
                        "h3_details": []
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    },
                    {
                        "id": "faq-section",
                        "title": "常見問題與深度解析",
                        "h3_details": [
                            {
                                "id": "什麼是大宗商品期貨的期限結構與展期收益-roll-yield",
                                "title": "什麼是大宗商品期貨的期限結構與展期收益 (Roll Yield)？"
                            },
                            {
                                "id": "為什麼-cta-策略被稱為-危機-alpha",
                                "title": "為什麼 CTA 策略被稱為「危機 Alpha」？"
                            },
                            {
                                "id": "實務上如何操作跨商品價差套利",
                                "title": "實務上如何操作跨商品價差套利？"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "trading-strategies-alternative-assets",
                "pillar": "macro-futures",
                "badge": "方法指南",
                "date": "2026-05-21",
                "title": "投資策略｜替代資產投資與跨市場交易策略：從 ETF 套利到宏觀對沖",
                "url": "../post/trading-strategies-alternative-assets.html",
                "core_conclusion": "2026 年 60/40 模型失效後如何獲利？本文深度解構替代資產（ETF, FX, 不良債務, 加密貨幣）的 10 大交易策略，分析跨市場套利機制、能源與天氣衍生品定價，及全球宏觀策略的前瞻部署。",
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
                        "id": "chapter-0-summary",
                        "title": "執行摘要 核心事件的 5W1H 認知架構",
                        "h3_details": [
                            {
                                "id": "section-5w1h-core",
                                "title": "5W1H 深度邏輯總結"
                            }
                        ]
                    },
                    {
                        "id": "chapter-1",
                        "title": "導言：2026 年全球資產定價環境之典範轉移",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-2",
                        "title": "交易所交易基金 (ETFs) 的動能與均值回歸策略",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "2.1 動能策略的學術基礎與行為金融學解釋"
                            },
                            {
                                "id": "section-2-2",
                                "title": "2.2 均值回歸的總體經濟驅動因素"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "股票指數套利 (Index Arbitrage) 的微觀結構",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "3.1 現金與持有套利機制的數學表達"
                            },
                            {
                                "id": "section-3-2",
                                "title": "3.2 ETFs 在高頻價格發現與套利中的角色"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "外匯策略 (Foreign Exchange)：利差交易與購買力平價",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "4.1 外匯利差交易與遠期升水之謎"
                            },
                            {
                                "id": "section-4-2",
                                "title": "4.2 匯率驅動的三大資產市場管道與宏觀衝擊"
                            },
                            {
                                "id": "section-4-3",
                                "title": "4.3 購買力平價的非線性均值回歸"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "房地產 (REITs) 與基礎設施 (Infrastructure)",
                        "h3_details": [
                            {
                                "id": "section-5-1",
                                "title": "5.1 房地產 (REITs) 的通膨避險機制與侷限"
                            },
                            {
                                "id": "section-5-2",
                                "title": "5.2 私募基礎設施的「全天候」韌性"
                            }
                        ]
                    },
                    {
                        "id": "chapter-6",
                        "title": "不良資產策略 (Distressed Assets)",
                        "h3_details": [
                            {
                                "id": "section-6-1",
                                "title": "6.1 不良債務市場結構與定價特徵"
                            },
                            {
                                "id": "section-6-2",
                                "title": "6.2 被動投資與主動「貸款轉股權」策略"
                            }
                        ]
                    },
                    {
                        "id": "chapter-7",
                        "title": "現金與貨幣市場 (Cash and Money Markets)",
                        "h3_details": [
                            {
                                "id": "section-7-1",
                                "title": "7.1 MMFs 成長驅動力與利率週期的互動"
                            },
                            {
                                "id": "section-7-2",
                                "title": "7.2 現金區隔與收益極大化策略"
                            }
                        ]
                    },
                    {
                        "id": "chapter-8",
                        "title": "加密貨幣 (Cryptocurrencies) 的系統性交易策略",
                        "h3_details": [
                            {
                                "id": "section-8-1",
                                "title": "8.1 趨勢跟蹤與動能模型：AdaptiveTrend 框架"
                            },
                            {
                                "id": "section-8-2",
                                "title": "8.2 相對價值與套利策略"
                            }
                        ]
                    },
                    {
                        "id": "chapter-9",
                        "title": "雜項策略：天氣衍生品、能源交易與通膨策略",
                        "h3_details": [
                            {
                                "id": "section-9-1",
                                "title": "9.1 天氣衍生品 (Weather Derivatives) 及其定價模型"
                            },
                            {
                                "id": "section-9-2",
                                "title": "9.2 能源交易的跨商品價差策略 (Cross-Commodity Spreads)"
                            },
                            {
                                "id": "section-9-3",
                                "title": "9.3 通膨環境下的動態對沖策略"
                            }
                        ]
                    },
                    {
                        "id": "chapter-10",
                        "title": "全球宏觀策略 (Global Macro) 的前瞻部署",
                        "h3_details": [
                            {
                                "id": "section-10-1",
                                "title": "10.1 2026 年的宏觀展望與地緣政治風險評估"
                            },
                            {
                                "id": "section-10-2",
                                "title": "10.2 波動率交易與資產配置轉向"
                            }
                        ]
                    },
                    {
                        "id": "chapter-11",
                        "title": "稅務套利 (Tax Arbitrage) 的機制與法律風險",
                        "h3_details": [
                            {
                                "id": "section-11-1",
                                "title": "11.1 股息剝奪 (Dividend Stripping)：Cum-Ex 與 Cum-Cum 爭議"
                            },
                            {
                                "id": "section-11-2",
                                "title": "11.2 市政債券套利 (Municipal Bond Arbitrage) 的槓桿結構"
                            }
                        ]
                    },
                    {
                        "id": "chapter-12",
                        "title": "結論",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-timeline",
                        "title": "歷史實證時間軸 跨市場策略與宏觀流動性實證紀錄",
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
                "id": "trading-strategies-options-yield-enhancement-strategies",
                "pillar": "options-vol",
                "badge": "方法指南",
                "date": "2026-05-20",
                "title": "投資策略｜期權策略與波動率博弈 (上)：系統性收益增強、Greeks 動態管理與 Portfolio Margin 機構投研報告",
                "url": "../post/trading-strategies-options-yield-enhancement-strategies.html",
                "core_conclusion": "本文實測剖析波動率風險溢價 (VRP) 理論，深度解析備兌買入 (Covered Call)、現金擔保賣出看跌 (Cash-Secured Put)、鐵鷹式等九大期權策略的 Greeks 動態博弈、組合保證金效率及波動率末日 (Volmageddon) 系統性風險防範。",
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
                        "id": "chapter-1",
                        "title": "全球總體經濟與信用週期環境背景 (2026年展望)",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-2",
                        "title": "4.2.1 信用利差套利 (Credit Spread Arbitrage)",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "利差的微觀解構與定價模型"
                            },
                            {
                                "id": "section-2-2",
                                "title": "策略執行路徑與風險特徵"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "4.2.2 CDS-現金基差交易 (CDS-Cash Basis)",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "理論公式與基差動態"
                            },
                            {
                                "id": "section-3-2",
                                "title": "負基差套利的實務運作與成本解構"
                            },
                            {
                                "id": "section-3-3",
                                "title": "監管資本與補充槓桿率 (SLR) 的衝擊"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "4.2.3 可轉換債券套利 (Convertible Arbitrage)",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "定價模型與Delta中立避險 (Delta-Neutral Hedging)"
                            },
                            {
                                "id": "section-4-2",
                                "title": "Gamma交易：波動率的貨幣化引擎"
                            },
                            {
                                "id": "section-4-3",
                                "title": "系統性風險與LTCM的歷史教訓"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "4.2.4 抵押貸款支持證券 (MBS)",
                        "h3_details": [
                            {
                                "id": "section-5-1",
                                "title": "Agency MBS與非機構MBS的本質差異"
                            },
                            {
                                "id": "section-5-2",
                                "title": "提前還款模型與負凸性的致命威脅"
                            },
                            {
                                "id": "section-5-3",
                                "title": "2024-2026年宏觀環境下的凸性異象 (Convexity Anomaly)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-6",
                        "title": "4.2.5 資產支持證券 (ABS)",
                        "h3_details": [
                            {
                                "id": "section-6-1",
                                "title": "基礎資產光譜與市場細分"
                            },
                            {
                                "id": "section-6-2",
                                "title": "內部信用增級 (Credit Enhancement) 與分層結構 (Tranching)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-7",
                        "title": "系統性風險 (Systemic Risk) 與危機時期的策略反饋",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-8",
                        "title": "總結與2026年戰略展望",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-timeline",
                        "title": "歷史實證時間軸 Greeks 微觀結構與負 Gamma 波動率實證紀錄",
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
                "id": "trading-strategies-options-volatility-strategies",
                "pillar": "options-vol",
                "badge": "方法指南",
                "date": "2026-05-20",
                "title": "投資策略｜期權策略與波動率博弈 (下)：進階多腿組合、投資組合保證金與 Volmageddon 尾部風險復盤",
                "url": "../post/trading-strategies-options-volatility-strategies.html",
                "core_conclusion": "本文深度復盤 2018 波動率末日 (Volmageddon) 死亡螺旋，並解析跨式 (Straddle)、勒式 (Strangle)、鐵鷹式等進階多腿期權組合的 Greeks 避險與 Portfolio Margin 投資組合保證金資本效率。",
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
                        "id": "chapter-1",
                        "title": "1\\. 波動率風險溢價 (VRP) 與期權收益增強的理論基石",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-2",
                        "title": "2\\. 收益增強與套利策略深度解析",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "3.1.1 備兌買入 (Covered Call)"
                            },
                            {
                                "id": "section-2-2",
                                "title": "3.1.2 現金擔保賣出看跌 (Cash-Secured Put)"
                            },
                            {
                                "id": "section-2-3",
                                "title": "3.1.3 牛市價差組合 (Bull Spread)"
                            },
                            {
                                "id": "section-2-4",
                                "title": "3.1.4 熊市價差組合 (Bear Spread)"
                            },
                            {
                                "id": "section-2-5",
                                "title": "3.1.5 蝶式價差 (Butterfly Spread)"
                            },
                            {
                                "id": "section-2-6",
                                "title": "3.1.6 跨式組合 (Straddle)"
                            },
                            {
                                "id": "section-2-7",
                                "title": "3.1.7 勒式組合 (Strangle)"
                            },
                            {
                                "id": "section-2-8",
                                "title": "3.1.8 鐵蝴蝶 (Iron Butterfly)"
                            },
                            {
                                "id": "section-2-9",
                                "title": "3.1.9 鐵鷹式 (Iron Condor)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "3\\. 期權定價參數 (Greeks) 在收益增強中的動態影響",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "Delta 與方向性暴露 (Directional Exposure)"
                            },
                            {
                                "id": "section-3-2",
                                "title": "Gamma 與加速度陷阱 (Acceleration Risk)"
                            },
                            {
                                "id": "section-3-3",
                                "title": "Theta 與時間價值的黃金窗口 (Time Decay)"
                            },
                            {
                                "id": "section-3-4",
                                "title": "Vega 與隱含波動率的敏感度 (Volatility Sensitivity)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "4\\. 資本效率與保證金制度 (Capital Efficiency & Margin Regimes)",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "基於策略的標準保證金 (Strategy-Based Margin)"
                            },
                            {
                                "id": "section-4-2",
                                "title": "投資組合保證金 (Portfolio Margining)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "5\\. 尾部風險與系統性崩盤：深度復盤「波動率末日 (Volmageddon)」",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-6",
                        "title": "6\\. 結論與機構級組合構建範式",
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
                "id": "trading-strategies-fixed-income-interest-rate-strategies",
                "pillar": "macro-futures",
                "badge": "方法指南",
                "date": "2026-05-20",
                "title": "投資策略｜固定收益投資策略深度解析（上）：殖利率曲線、國債基準與蝶式曲率交易",
                "url": "../post/trading-strategies-fixed-income-interest-rate-strategies.html",
                "core_conclusion": "從 PCA 三因子、新舊券流動性溢酬到基差交易與 SEC 2026 集中結算，本文解構子彈／槓鈴、蝶式曲率及 2026 空頭平坦化下的主動固定收益配置框架。",
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
                        "id": "chapter-1",
                        "title": "1\\. 國債基準交易與套利機制 (Treasury Benchmark Trading)",
                        "h3_details": [
                            {
                                "id": "section-1-1",
                                "title": "1.1 新券與舊券之流動性溢酬動態 (On-the-run vs. Off-the-run Premium)"
                            },
                            {
                                "id": "section-1-2",
                                "title": "1.2 國債現貨與期貨基差交易 (Treasury Cash-Futures Basis Trade)"
                            },
                            {
                                "id": "section-1-3",
                                "title": "1.3 槓桿機制、附買回市場融資與監管結構的演變"
                            }
                        ]
                    },
                    {
                        "id": "chapter-2",
                        "title": "2\\. 基礎殖利率曲線策略：子彈式與槓鈴式結構",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "2.1 結構定義、關鍵利率存續期間與凸性分析"
                            },
                            {
                                "id": "section-2-2",
                                "title": "2.2 靜態殖利率曲線環境下之策略運用"
                            },
                            {
                                "id": "section-2-3",
                                "title": "2.3 動態殖利率曲線變化情境下之績效表現"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "3\\. 曲率交易：蝶式與兀鷹式策略 (Butterfly & Condor Strategies)",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "3.1 蝶式策略的結構邏輯與曲率定義"
                            },
                            {
                                "id": "section-3-2",
                                "title": "3.2 投資組合權重配置的量化方法"
                            },
                            {
                                "id": "section-3-3",
                                "title": "3.3 兀鷹式策略與階梯式避險 (Condor & Ladder Strategies)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "4\\. 殖利率曲線斜率策略：陡峭化與平坦化交易",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "4.1 陡峭化交易 (Curve Steepeners)"
                            },
                            {
                                "id": "section-4-2",
                                "title": "4.2 平坦化交易 (Curve Flatteners)"
                            },
                            {
                                "id": "section-4-3",
                                "title": "4.3 斜率策略之衍生性商品執行實務"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "5\\. 2026年總體經濟環境與殖利率曲線實務應用分析",
                        "h3_details": [
                            {
                                "id": "section-5-1",
                                "title": "5.1 貨幣政策預期重塑與劇烈的空頭平坦化"
                            },
                            {
                                "id": "section-5-2",
                                "title": "5.2 總體環境變動對跨資產配置與股票市場的深遠影響"
                            }
                        ]
                    },
                    {
                        "id": "chapter-6",
                        "title": "6\\. 結論",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-timeline",
                        "title": "歷史實證時間軸 主權利率曲線、流動性定錨與跨市場傳導紀錄",
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
                "id": "trading-strategies-fixed-income-credit-structured-strategies",
                "pillar": "macro-futures",
                "badge": "方法指南",
                "date": "2026-05-20",
                "title": "投資策略｜固定收益投資策略深度解析（下）：掌握信用利差、CDS 基差與 MBS 結構化套利關鍵",
                "url": "../post/trading-strategies-fixed-income-credit-structured-strategies.html",
                "core_conclusion": "2026 年「Higher for Longer」利率環境下，固定收益市場正迎來巨大機遇。本文深度解密信用利差套利、CDS 負基差以及可轉債 Gamma 交易等機構級量化策略。",
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
                        "id": "chapter-1",
                        "title": "全球總體經濟與信用週期環境背景 (2026年展望)",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-2",
                        "title": "4.2.1 信用利差套利 (Credit Spread Arbitrage)",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "利差的微觀解構與定價模型"
                            },
                            {
                                "id": "section-2-2",
                                "title": "策略執行路徑與風險特徵"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "4.2.2 CDS-現金基差交易 (CDS-Cash Basis)",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "理論公式與基差動態"
                            },
                            {
                                "id": "section-3-2",
                                "title": "負基差套利的實務運作與成本解構"
                            },
                            {
                                "id": "section-3-3",
                                "title": "監管資本與補充槓桿率 (SLR) 的衝擊"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "4.2.3 可轉換債券套利 (Convertible Arbitrage)",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "定價模型與Delta中立避險 (Delta-Neutral Hedging)"
                            },
                            {
                                "id": "section-4-2",
                                "title": "Gamma交易：波動率的貨幣化引擎"
                            },
                            {
                                "id": "section-4-3",
                                "title": "系統性風險與LTCM的歷史教訓"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "4.2.4 抵押貸款支持證券 (MBS)",
                        "h3_details": [
                            {
                                "id": "section-5-1",
                                "title": "Agency MBS與非機構MBS的本質差異"
                            },
                            {
                                "id": "section-5-2",
                                "title": "提前還款模型與負凸性的致命威脅"
                            },
                            {
                                "id": "section-5-3",
                                "title": "2024-2026年宏觀環境下的凸性異象 (Convexity Anomaly)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-6",
                        "title": "4.2.5 資產支持證券 (ABS)",
                        "h3_details": [
                            {
                                "id": "section-6-1",
                                "title": "基礎資產光譜與市場細分"
                            },
                            {
                                "id": "section-6-2",
                                "title": "內部信用增級 (Credit Enhancement) 與分層結構 (Tranching)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-7",
                        "title": "系統性風險 (Systemic Risk) 與危機時期的策略反饋",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-8",
                        "title": "總結與2026年戰略展望",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-timeline",
                        "title": "歷史實證時間軸 信用週期、私募信貸錯配與流動性壓力測試紀錄",
                        "h3_details": []
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    },
                    {
                        "id": "faq-section",
                        "title": "常見問題與深度解析",
                        "h3_details": [
                            {
                                "id": "什麼是信用利差套利-credit-spread-arbitrage",
                                "title": "什麼是信用利差套利 (Credit Spread Arbitrage)？"
                            },
                            {
                                "id": "在-2026-高利率環境下-為什麼要關注-cds-現金基差交易",
                                "title": "在 2026 高利率環境下，為什麼要關注 CDS-現金基差交易？"
                            },
                            {
                                "id": "mbs-抵押貸款支持證券-的-負凸性-對投資人有何風險",
                                "title": "MBS (抵押貸款支持證券) 的「負凸性」對投資人有何風險？"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "trading-strategies-technical-analysis-strategies",
                "pillar": "equities-dcf",
                "badge": "方法指南",
                "date": "2026-05-19",
                "title": "投資策略｜技術分析與量化交易策略：系統性多因子與統計套利研究",
                "url": "../post/trading-strategies-technical-analysis-strategies.html",
                "core_conclusion": "本文全面解構系統性技術分析與現代量化交易架構：涵蓋多因子動能與行為金融機制、頻域濾波與布林帶體制切換、隱性背離與量價協同、OU過程與Copula統計套利、分數階差分與元標籤機器學習、通縮夏普比率（DSR）及凱利資金管理。",
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
                        "id": "chapter-1",
                        "title": "動能因子與風格輪動機制",
                        "h3_details": [
                            {
                                "id": "section-1-1",
                                "title": "1.1 個股動能策略之行為金融學基礎與實踐"
                            },
                            {
                                "id": "section-1-2",
                                "title": "1.2 指數/行業動能與風格輪動"
                            }
                        ]
                    },
                    {
                        "id": "chapter-2",
                        "title": "經典趨勢研判與波動率區間交易",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "2.1 移動平均交叉之數學結構與 Whipsaw 減緩機制"
                            },
                            {
                                "id": "section-2-2",
                                "title": "2.2 平均趨向指數（ADX）之趨勢強度量化評估"
                            },
                            {
                                "id": "section-2-3",
                                "title": "2.3 布林帶（Bollinger Bands）波動率區間交易與 Regime 切換"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "震盪指標與量價協同體系",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "3.1 相對強弱指標（RSI）超買超賣與常規/隱性背離"
                            },
                            {
                                "id": "section-3-2",
                                "title": "3.2 隨機指標（Stochastic Oscillator）架構與 George Lane 交易法則"
                            },
                            {
                                "id": "section-3-3",
                                "title": "3.3 MACD 趨勢動向指標與指標融合策略"
                            },
                            {
                                "id": "section-3-4",
                                "title": "3.4 價量趨勢（Price-Volume Trend, PVT）指標與量價配合"
                            },
                            {
                                "id": "section-3-5",
                                "title": "3.5 資金流向指標（Money Flow Index, MFI）與資金流分析"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "逆勢策略與 Whipsaw 減緩機制",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "4.1 均值回歸與心理反轉之運作機制"
                            },
                            {
                                "id": "section-4-2",
                                "title": "4.2 多重時間框架協同與指標非冗餘設計"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "配對交易與統計套利體系",
                        "h3_details": [
                            {
                                "id": "section-5-1",
                                "title": "5.1 協整關係與誤差修正模型之數學基礎"
                            },
                            {
                                "id": "section-5-2",
                                "title": "5.2 連續時間均值回歸與 Ornstein-Uhlenbeck 過程"
                            },
                            {
                                "id": "section-5-3",
                                "title": "5.3 距離法之標準化、公式與配對選擇"
                            },
                            {
                                "id": "section-5-4",
                                "title": "5.4 距離法、共整合法與 Copula 法之實證效能對比"
                            }
                        ]
                    },
                    {
                        "id": "chapter-6",
                        "title": "現代機器學習技術在技術分析策略中的工程整合",
                        "h3_details": [
                            {
                                "id": "section-6-1",
                                "title": "6.1 分數階差分：平衡長記憶性與定態特徵"
                            },
                            {
                                "id": "section-6-2",
                                "title": "6.2 三重屏障法與元標籤二階訊號過濾架構"
                            }
                        ]
                    },
                    {
                        "id": "chapter-7",
                        "title": "嚴格回測防護、多重測試偏差與統計績效度量",
                        "h3_details": [
                            {
                                "id": "section-7-1",
                                "title": "7.1 多重測試偏差與回測過度擬合危機"
                            },
                            {
                                "id": "section-7-2",
                                "title": "7.2 偏態與峰態修正之通縮夏普比率數學解析"
                            },
                            {
                                "id": "section-7-3",
                                "title": "7.3 髮夾式折扣與多重比較校正"
                            }
                        ]
                    },
                    {
                        "id": "chapter-8",
                        "title": "資金管理、動態倉位縮放與波動率追蹤止損機制",
                        "h3_details": [
                            {
                                "id": "section-8-1",
                                "title": "8.1 凱利公式與波動率目標化配置"
                            },
                            {
                                "id": "section-8-2",
                                "title": "8.2 恰德里爾通道止損與動態棘輪保護機制"
                            }
                        ]
                    },
                    {
                        "id": "chapter-9",
                        "title": "現代量化交易架構之演進結論與工程實踐準則",
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
                "id": "trading-strategies-fundamental-analysis",
                "pillar": "equities-dcf",
                "badge": "方法指南",
                "date": "2026-05-19",
                "title": "投資策略｜基本面分析：量化多因子選股模型與風格因子實證研究 (投研方法論)",
                "url": "../post/trading-strategies-fundamental-analysis.html",
                "core_conclusion": "系統性資產定價因子與模型建構實證報告。針對價值、質量、應計、資產負債表結構、風險及規模等十一項核心因子進行深度剖析，並推導基於應計項目去偏、CLI 週期輪動與不交易區間控制的動態配置策略。",
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
                        "id": "chapter-1",
                        "title": "價值與基本面估值因子",
                        "h3_details": [
                            {
                                "id": "section-1-1",
                                "title": "帳面市值比 (Value: Book-to-Market)"
                            },
                            {
                                "id": "section-1-2",
                                "title": "盈餘收益率 (Earnings Yield)"
                            },
                            {
                                "id": "section-1-3",
                                "title": "現金流收益率 (Cash Flow Yield)"
                            },
                            {
                                "id": "section-1-4",
                                "title": "股息收益率 (Dividend Yield)"
                            },
                            {
                                "id": "section-1-5",
                                "title": "銷售價格比 (Price-to-Sales)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-2",
                        "title": "質量因子與會計應計異常",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "質量因子：資產回報率與股東權益報酬率 (Quality: ROA/ROE)"
                            },
                            {
                                "id": "section-2-2",
                                "title": "應計項目 (Accruals)"
                            },
                            {
                                "id": "section-2-3",
                                "title": "應計項目建模與可自由裁量應計項目"
                            },
                            {
                                "id": "section-2-4",
                                "title": "應計項目計量偏差：Hribar and Collins (2002)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "資產負債表擴張與融資異常",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "淨股本發行 (Net Stock Issues)"
                            },
                            {
                                "id": "section-3-2",
                                "title": "資產增長 (Asset Growth)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "市場結構與風險因子",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "低波動性 (Low Volatility)"
                            },
                            {
                                "id": "section-4-2",
                                "title": "規模因子 (Size: Market Cap)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "系統性量化投資組合建構與動態調配",
                        "h3_details": [
                            {
                                "id": "section-5-1",
                                "title": "因子 Z-Score 標準化與離群值處理"
                            },
                            {
                                "id": "section-5-2",
                                "title": "權重配置策略"
                            },
                            {
                                "id": "section-5-3",
                                "title": "交易摩擦與「不交易區間」控制"
                            }
                        ]
                    },
                    {
                        "id": "chapter-6",
                        "title": "宏觀經濟週期與風格因子動態調配",
                        "h3_details": [
                            {
                                "id": "section-6-1",
                                "title": "復甦階段 (Recovery Phase)"
                            },
                            {
                                "id": "section-6-2",
                                "title": "擴張階段 (Expansion Phase)"
                            },
                            {
                                "id": "section-6-3",
                                "title": "放緩階段 (Slowdown Phase)"
                            },
                            {
                                "id": "section-6-4",
                                "title": "衰退階段 (Recession/Downturn Phase)"
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
                "id": "trading-strategies-dcf-valuation-model-guide",
                "pillar": "equities-dcf",
                "badge": "方法指南",
                "date": "2026-05-18",
                "title": "投資策略｜貼現現金流模型 (DCF) 估值實務：揭秘外資如何用貼現現金流尋找低估黑馬？",
                "url": "../post/trading-strategies-dcf-valuation-model-guide.html",
                "core_conclusion": "為什麼傳統 DCF 估值模型常常失效？本文帶你拆解外資投行的 7 大實務建模階段，從三表勾稽到 WACC 測算，手把手建構 2026 年最具防禦力的企業定價系統。",
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
                        "id": "chapter-0",
                        "title": "執行摘要與 5W1H 核心認知架構",
                        "h3_details": [
                            {
                                "id": "section-5w1h-core",
                                "title": "股票估值貼現現金流（DCF）模型的 5W1H 核心認知架構"
                            }
                        ]
                    },
                    {
                        "id": "chapter-1",
                        "title": "貼現現金流模型的理論體系與核心價值邏輯",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-2",
                        "title": "階段一：歷史財務分析與預報表（Pro Forma）的系統性建構",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "歷史數據蒐集與常態化清洗"
                            },
                            {
                                "id": "section-2-2",
                                "title": "預報表（Pro Forma）的系統化勾稽"
                            },
                            {
                                "id": "section-2-3",
                                "title": "自由現金流的精確提煉"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "階段二：加權平均資本成本（WACC）的精密估算技術",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "股權資本成本（K_e）的估算：資本資產定價模型（CAPM）與修正模型"
                            },
                            {
                                "id": "section-3-2",
                                "title": "債務資本成本（K_d）的估算：到期收益率與合成信用評級法"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "階段三：企業終值（Terminal Value）評估與價值驅動模型（Value Driver Method）",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "永續增長模型（Perpetuity Growth Method, PGM）"
                            },
                            {
                                "id": "section-4-2",
                                "title": "退出倍數法（Exit Multiple Method, EMM）"
                            },
                            {
                                "id": "section-4-3",
                                "title": "價值驅動模型（Value Driver Method）的優化導入"
                            },
                            {
                                "id": "section-4-4",
                                "title": "雙重方法的交叉檢驗（Cross-Checking）"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "階段四：自企業價值至股權價值每股目標價的精密橋接",
                        "h3_details": [
                            {
                                "id": "section-5-1",
                                "title": "估值精準度調整：半年度公約與不完整年度（Stub Period）處理"
                            }
                        ]
                    },
                    {
                        "id": "chapter-6",
                        "title": "階段五：Excel 專業建模規範、雙變數敏感性分析與數據表除錯",
                        "h3_details": [
                            {
                                "id": "section-6-1",
                                "title": "顏色編碼與格式化（Color Coding & Typography）產業標準"
                            },
                            {
                                "id": "section-6-2",
                                "title": "貼現函數的精準選擇：XNPV/XIRR 與常規 NPV/IRR 的對比"
                            }
                        ]
                    },
                    {
                        "id": "chapter-7",
                        "title": "貼現現金流模型的常規實務謬誤與學術審查限制",
                        "h3_details": [
                            {
                                "id": "damodaran-uncertainty-simplicity",
                                "title": "Aswath Damodaran 的不確定性與簡約原則"
                            },
                            {
                                "id": "alternative-framework-apv",
                                "title": "替代性估值架構：調整後現值模型（APV）"
                            }
                        ]
                    },
                    {
                        "id": "chapter-8",
                        "title": "結論與估值實務防禦性建議",
                        "h3_details": [
                            {
                                "id": "構建三情境定價防禦矩陣",
                                "title": "構建三情境定價防禦矩陣"
                            },
                            {
                                "id": "academic-references",
                                "title": "參考文獻（Academic References）"
                            }
                        ]
                    },
                    {
                        "id": "deep-logic-analysis",
                        "title": "文章分析：深度邏輯重構",
                        "h3_details": [
                            {
                                "id": "5w1h-summary-recap",
                                "title": "2.1 核心問句與定價論述對應表"
                            },
                            {
                                "id": "inference-logic-chain",
                                "title": "2.2 推論邏輯分析 (Inference Logic Chain)"
                            },
                            {
                                "id": "narrative-boundary-blindspots",
                                "title": "2.3 敘事邊界與關鍵變數補充"
                            }
                        ]
                    },
                    {
                        "id": "mason-yang-observation",
                        "title": "03 Mason Yang 的觀察 (Actionable Intelligence)",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-timeline",
                        "title": "歷史實證時間軸 資本週期與現金流折現實證紀錄",
                        "h3_details": []
                    },
                    {
                        "id": "參考資料",
                        "title": "參考資料 (References)",
                        "h3_details": []
                    },
                    {
                        "id": "faq-section",
                        "title": "常見問題與深度解析",
                        "h3_details": [
                            {
                                "id": "貼現現金流-dcf-模型在實務應用中最核心的原則是什麼",
                                "title": "貼現現金流 (DCF) 模型在實務應用中最核心的原則是什麼？"
                            },
                            {
                                "id": "傳統-dcf-估算終值時容易犯什麼錯誤-如何解決",
                                "title": "傳統 DCF 估算終值時容易犯什麼錯誤？如何解決？"
                            },
                            {
                                "id": "2026-年的高利率環境對-dcf-估值有何影響",
                                "title": "2026 年的高利率環境對 DCF 估值有何影響？"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "trading-strategies-list-151",
                "pillar": "workstations",
                "badge": "方法指南",
                "date": "2026-04-20",
                "title": "《151 種交易策略》完整詳細清單：量化交易員的策略百科全書",
                "url": "../post/trading-strategies-list-151.html",
                "core_conclusion": "本清單收錄了《151 Trading Strategies》書中完整的量化交易策略目錄，涵蓋股票、期權、固定收益、期貨及機器學習等八大領域，是量化交易研究與回測系統構建的核心參考索引。",
                "indicators": [
                    {
                        "label": "關鍵規模",
                        "value": "151 T"
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
                        "id": "chapter-1",
                        "title": "1\\. 導論 (Introduction)",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-2",
                        "title": "2\\. 股票策略 (Equities)",
                        "h3_details": [
                            {
                                "id": "section-2-1",
                                "title": "2.1 技術分析策略 (Technical Analysis)"
                            },
                            {
                                "id": "section-2-2",
                                "title": "2.2 基本面分析策略 (Fundamental Analysis)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-3",
                        "title": "3\\. 期權策略 (Options)",
                        "h3_details": [
                            {
                                "id": "section-3-1",
                                "title": "3.1 收益增強與套利策略"
                            },
                            {
                                "id": "section-3-2",
                                "title": "3.2 波動率策略 (Volatility Strategies)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-4",
                        "title": "4\\. 固定收益策略 (Fixed Income)",
                        "h3_details": [
                            {
                                "id": "section-4-1",
                                "title": "4.1 利率策略 (Interest Rate Strategies)"
                            },
                            {
                                "id": "section-4-2",
                                "title": "4.2 信用與結構化策略 (Credit and Structured)"
                            }
                        ]
                    },
                    {
                        "id": "chapter-5",
                        "title": "5\\. 期貨與大宗商品 (Futures and Commodities)",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-6",
                        "title": "6\\. 其他資產類別 (Other Asset Classes)",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-7",
                        "title": "7\\. 機器學習與人工智慧 (Machine Learning)",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-8",
                        "title": "8\\. Python 代碼與回測 (Python Code)",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-9",
                        "title": "9\\. 附錄與術語表 (Glossary & Appendices)",
                        "h3_details": []
                    },
                    {
                        "id": "chapter-10",
                        "title": "10\\. 重要術語與索引關鍵字 (Index Keywords)",
                        "h3_details": [
                            {
                                "id": "section-10-1",
                                "title": "0.1 關鍵字 \\- A 部分"
                            },
                            {
                                "id": "section-10-2",
                                "title": "0.2 關鍵字 \\- B 部分"
                            },
                            {
                                "id": "section-10-3",
                                "title": "0.3 關鍵字 \\- C 部分"
                            },
                            {
                                "id": "section-10-4",
                                "title": "0.4 關鍵字 \\- V, W, Y 部分"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "news-20260327-invest-research-handbook",
                "pillar": "equities-dcf",
                "badge": "深度研報",
                "date": "2026-03-27",
                "title": "【專業投資研究實戰手冊】- 機構級操作如何建立可重複的 Alpha 挖掘系統？為何心智模型庫決定長期超額收益？解構五力分析與情境模擬的深度實戰應用",
                "url": "../news/20260327-invest-research-handbook.html",
                "core_conclusion": "本篇研究《【專業投資研究實戰手冊 2026】- 機構級操作如何建立可重複的 Alpha 挖掘系統？為何心智模型庫決定長期超額收益？解構五力分析與情境模擬的深度實戰應用》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
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
                        "id": "section-diagnostic",
                        "title": "壹、研究前的診斷與自我校準 (The Diagnostic Framework)",
                        "h3_details": [
                            {
                                "id": "duration",
                                "title": "1. 持有期 (Duration)"
                            },
                            {
                                "id": "hypotheses",
                                "title": "2. 核心假設 (Hypotheses)"
                            },
                            {
                                "id": "risk-id",
                                "title": "3. 風險識別 (Risk ID)"
                            },
                            {
                                "id": "marginal-impact",
                                "title": "4. 邊際貢獻 (Marginal Impact)"
                            },
                            {
                                "id": "action-trigger",
                                "title": "5. 動作觸發 (Action Trigger)"
                            }
                        ]
                    },
                    {
                        "id": "section-timing",
                        "title": "貳、時間框架匹配與因子敏感度 (The Edge of Timing)",
                        "h3_details": [
                            {
                                "id": "temporal-arbitrage",
                                "title": "1. 時間維度套利 (Temporal Arbitrage)"
                            },
                            {
                                "id": "variable-sensitivity",
                                "title": "2. 因子敏感度 (Variable Sensitivity)"
                            }
                        ]
                    },
                    {
                        "id": "section-valuation",
                        "title": "參、估值體系與範式轉移 (The Art of Valuation)",
                        "h3_details": [
                            {
                                "id": "valuation-regime-shift",
                                "title": "1. 定價範式轉移 (Valuation Regime Shift)"
                            },
                            {
                                "id": "reflexivity-optionality",
                                "title": "2. 反身性與期權應用 (Reflexivity & Optionality)"
                            }
                        ]
                    },
                    {
                        "id": "section-decision-logic",
                        "title": "肆、決策邏輯與情境規劃 (Scientific Decision Making)",
                        "h3_details": [
                            {
                                "id": "bayesian-inference",
                                "title": "1. 貝葉斯概率更新 (Bayesian Inference)"
                            },
                            {
                                "id": "pre-mortem",
                                "title": "2. 事前驗屍與壓力測試 (Pre-mortem)"
                            }
                        ]
                    },
                    {
                        "id": "section-execution",
                        "title": "伍、實務執行與風險管理 (Execution Excellence)",
                        "h3_details": [
                            {
                                "id": "mosaic-theory",
                                "title": "1. 摩賽克理論 (Mosaic Theory)"
                            },
                            {
                                "id": "convexity",
                                "title": "2. 不對稱凸性 (Convexity)"
                            },
                            {
                                "id": "expectation-surprise",
                                "title": "3. 預期差與退出策略 (Expectation Surprise)"
                            }
                        ]
                    },
                    {
                        "id": "文章分析",
                        "title": "文章分析",
                        "h3_details": [
                            {
                                "id": "推論方式分析-系統性框架-vs-直覺判斷",
                                "title": "推論方式分析：系統性框架 vs 直覺判斷"
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
                "id": "news-20260326-investment-research-guide",
                "pillar": "equities-dcf",
                "badge": "深度研報",
                "date": "2026-03-26",
                "title": "【高價值投資研究操作指南】- 思維邊界如何決定分析深度上限？為何機構級研究框架優先於市場情緒追蹤？解構從洞察到決策執行的完整投研方法論",
                "url": "../news/20260326-investment-research-guide.html",
                "core_conclusion": "本篇研究《【高價值投資研究操作指南】- 思維邊界如何決定分析深度上限？為何機構級研究框架優先於市場情緒追蹤？解構從洞察到決策執行的完整投研方法論》針對當前市場核心機制進行量化拆解，透過機構級觀點與結構化邏輯，提供決策者高期望值的行動指南與邊界風險測算。",
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
                        "title": "5W1H 深度邏輯總結 核心研究架構",
                        "h3_details": []
                    },
                    {
                        "id": "diagnosis",
                        "title": "研究前的自我診斷（五力檢查表）",
                        "h3_details": []
                    },
                    {
                        "id": "core-workflow",
                        "title": "核心操作流程（三大模塊）",
                        "h3_details": [
                            {
                                "id": "module-1",
                                "title": "模塊一：匹配時間框架與變數權重"
                            },
                            {
                                "id": "module-2",
                                "title": "模塊二：動態估值與定價體系捕捉"
                            },
                            {
                                "id": "module-3",
                                "title": "模塊三：情境分析與動作規劃 (Context → Action)"
                            }
                        ]
                    },
                    {
                        "id": "horizontal-comparison",
                        "title": "橫向對比與風險收益比優化",
                        "h3_details": []
                    },
                    {
                        "id": "summary",
                        "title": "總結：研究員的思維進階",
                        "h3_details": []
                    }
                ]
            },
            {
                "id": "investment-guide",
                "pillar": "equities-dcf",
                "badge": "方法指南",
                "date": "2025-10-13",
                "title": "加密貨幣市場進入策略：ETF、概念股與交易所深度比較",
                "url": "../post/crypto-investment-guide.html",
                "core_conclusion": "2026 年進入加密貨幣市場主要有三大管道：① 比特幣現貨 ETF (IBIT, FBTC)——適合偏好既有券商帳戶、重視合規與退休金配置者，管理費低（約 0.15%~0.25%）但無鏈上治理與質押權；② 加密概念股 (MSTR, COIN, 礦企)——具備融資槓桿與美股高流動性，但承擔企業經營與溢價波動；③ 合規加密貨幣交易所 (CEX)——直接掌握私鑰…",
                "indicators": [
                    {
                        "label": "關鍵比率",
                        "value": "0.15%"
                    },
                    {
                        "label": "關鍵比率",
                        "value": "0.25%"
                    },
                    {
                        "label": "核心參數",
                        "value": "2026 年"
                    }
                ],
                "h2_pillars": [
                    {
                        "id": "市場進入路徑概覽-傳統金融市場與加密貨幣交易所",
                        "title": "市場進入路徑概覽：傳統金融市場與加密貨幣交易所",
                        "h3_details": []
                    },
                    {
                        "id": "路徑一-透過傳統金融市場之間接曝險",
                        "title": "路徑一：透過傳統金融市場之間接曝險",
                        "h3_details": [
                            {
                                "id": "1-加密貨幣現貨-etf-交易所交易基金",
                                "title": "1. 加密貨幣現貨 ETF (交易所交易基金)"
                            },
                            {
                                "id": "2-加密貨幣概念股",
                                "title": "2. 加密貨幣概念股"
                            }
                        ]
                    },
                    {
                        "id": "路徑二-透過加密貨幣交易所之直接所有權",
                        "title": "路徑二：透過加密貨幣交易所之直接所有權",
                        "h3_details": []
                    },
                    {
                        "id": "決策框架-選擇您的市場進入路徑",
                        "title": "決策框架：選擇您的市場進入路徑",
                        "h3_details": []
                    }
                ]
            }
        ]
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TOPIC_STRATEGIES_TOOLS_COT_DATA;
    } else {
        root.TOPIC_STRATEGIES_TOOLS_COT_DATA = TOPIC_STRATEGIES_TOOLS_COT_DATA;
    }
})(typeof window !== 'undefined' ? window : this);
