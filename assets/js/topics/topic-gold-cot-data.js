/**
 * assets/js/topics/topic-gold-cot-data.js
 * 黃金與貨幣危機專題階層樹與思考鏈核心資料庫 (Layer 1C + CoT Studio Data SSOT)
 * Zero-Build / Pure Vanilla JS UMD / SSOT Data Module
 */
(function (root) {
    const TOPIC_GOLD_COT_DATA = {
        topic: "topic-macro",
        sub_hub: "topic-gold-currency-crisis",
        title: "黃金超級週期與貨幣危機全景",
        quarter: "2026-Q4",
        generated_at: "2026-11-28",
        pillars: [
            { id: "all",        label: "全部研報",          short: "ALL" },
            { id: "supercycle", label: "I. 央行與超級週期", short: "SUPERCYCLE" },
            { id: "liquidity",  label: "II. 清算與事件歸因", short: "LIQUIDITY" },
            { id: "red-team",   label: "III. 紅隊與量化配置", short: "RED-TEAM & QUANT" }
        ],
        macro_ledger: [
            {
                "id": "metric-gold-peak",
                "name": "現貨黃金高點回撤區間",
                "current": "$3,631–$3,675 / oz",
                "baseline": "11/20 下探 14 個月低點 $3,502.49",
                "status": "warning",
                "note": "繼 11 月中旬再挫 8.9% 探底 $3,502.49 後反彈；高盛下修 2026/2027 年底目標至 $4,150/$4,650，瑞銀降至 $4,500/$5,000（AISC 約 $1,930/oz）",
                "updated_at": "2026-11-28",
                "source_url": "../news/20261119-gold-btc-november-selloff-attribution.html"
            },
            {
                "id": "metric-cb-buying",
                "name": "全球央行實體信念買盤",
                "current": "Q3 淨購金 321 噸 (+42% YoY)",
                "baseline": "前三季含未申報推估 675 噸",
                "status": "normal",
                "note": "WGC Q3 淨購金高於五年季均 227 噸；波蘭央行 11/5 達成 700 噸儲備目標，構築中長線結構地板",
                "updated_at": "2026-11-28",
                "source_url": "../news/20261013-gold-currency-stress-test.html"
            },
            {
                "id": "metric-tips-real-yield",
                "name": "10Y TIPS 實質殖利率",
                "current": "2.73%–2.79%",
                "baseline": "由 11/16–17 高點 2.91% 回落",
                "status": "triggered",
                "note": "高實質利率放大紙黃金持倉成本，為紅隊核心監控錨",
                "updated_at": "2026-11-28",
                "source_url": "../news/20261119-gold-btc-november-selloff-attribution.html"
            },
            {
                "id": "metric-gold-target",
                "name": "長期財政主導定價中樞",
                "current": "$6,000+",
                "baseline": "2026–2030 推演目標",
                "status": "warning",
                "note": "美債破 40 兆與 AISC 成本上移支撐長線主權信用溢價",
                "updated_at": "2026-08-03",
                "source_url": "../news/20260803-global-gold-investment-analysis-report.html"
            }
        ],
        concepts: [
            {
                id: "real-yield-decoupling",
                code: "PRICING REGIME",
                title: "實質利率脫鉤 (Real Yield Decoupling)",
                desc: "傳統模型認為黃金與 10 年期 TIPS 實質殖利率呈高度負相關；但在主權債務突破 40 兆美元的財政主導時代，市場開始定價法幣信用風險，使金價得以在高實質利率下維持結構性上行。",
                threshold: "觀察邊界：10Y TIPS 突破 3.0% 時是否仍能維持央行實體買盤淨流入"
            },
            {
                id: "aisc-floor",
                code: "SUPPLY COST",
                title: "AISC 實體開採成本地板",
                desc: "總維持開採成本（All-In Sustaining Costs）涵蓋礦場開採、能源、勞動力與資本維持支出。能源通膨推升全球金礦 AISC 曲線，為金價在極端洗盤時提供堅實的實體邊際成本支撐。",
                threshold: "結構意義：當金價逼近高分位礦企 AISC，將引發供給收縮與長線價值買盤"
            },
            {
                id: "first-72h-liquidation",
                code: "LIQUIDITY SHOCK",
                title: "首 72 小時變現拋售潮",
                desc: "系統性金融危機爆發初期，機構為補足跨市場保證金與應對美元現鈔枯竭（Dash for Cash），會率先拋售流動性最佳的紙黃金籌資，造成黃金「先暴跌、後避險暴漲」的兩階段走勢。",
                threshold: "實戰紀律：避開強制去槓桿首 72 小時接刀，待保證金清算尾聲再佈局"
            },
            {
                id: "comex-margin-deleveraging",
                code: "DERIVATIVES",
                title: "COMEX 期現溢價與保證金去槓桿",
                desc: "當期貨市場投機多單過度擁擠、CME 啟動百分比保證金機制改革時，會迫使高槓桿紙黃金倉位連環平倉；期現溢價快速收斂往往是判斷洗盤是否進入深水區的微觀指標。",
                threshold: "紅隊警訊：COMEX 註冊庫存急增疊加期現基差轉負"
            },
            {
                id: "cb-conviction-buying",
                code: "SOVEREIGN",
                title: "央行信念買盤 (Conviction Buying)",
                desc: "新興市場與多極化央行出於外匯儲備安全與抗制裁考量，對價格敏感度極低、以長期實體回流為目標的剛性購金需求，成為對沖華爾街短線量化賣壓的定海神針。",
                threshold: "實證數據：單季/年度逾 300 噸實體淨購入量作為趨勢續航指標"
            },
            {
                id: "gold-silver-copper-ratio",
                code: "QUANT RATIO",
                title: "金銀比與銅金比宏觀套利",
                desc: "銅金比衡量「工業成長 vs 避險防禦」，是領先美債殖利率拐點的經典宏觀溫度計；金銀比則衡量貴金屬內部的金融屬性與工業屬性溢價，極端值常伴隨跨品種配對套利機會。",
                threshold: "策略運用：結合 CTA 趨勢追蹤與期限結構展期收益進行動態對沖"
            }
        ],
        articles: [
            // --- Pillar I: 央行與超級週期 ---
            {
                id: "20260803-global-gold-investment-analysis-report",
                pillar: "supercycle",
                dimension: "I",
                category: "產業結構與週期",
                badge: "產業結構與週期",
                date: "2026-08-03",
                status: "verified",
                title: "全球黃金投資巨擘報告：20 份機構研報綜合解析央行信念買盤與 AISC 成本地板",
                url: "../news/20260803-global-gold-investment-analysis-report.html",
                core_conclusion: "綜合 20 份華爾街頂級機構研報，解析黃金自 $5,595 天價回調後的定價轉折：央行信念買盤、財政主導赤字與 AISC 成本地板正重塑實體黃金超級週期。",
                indicators: [
                    { label: "機構樣本", value: "20 份研報" },
                    { label: "歷史天價", value: "$5,595" },
                    { label: "長線支撐", value: "AISC + 央行" }
                ],
                h2_pillars: [
                    { id: "執行摘要與宏觀定價邏輯的根本重塑", title: "宏觀典範轉移如何重塑實體黃金定價權" },
                    { id: "央行-信念買盤-與隱蔽的去美元化狂潮", title: "全球央行儲備框架與隱蔽去美元化買盤訊號" }
                ]
            },
            {
                id: "20260515-gold-price-strategic-analysis",
                pillar: "supercycle",
                dimension: "I",
                category: "產業結構與週期",
                badge: "產業結構與週期",
                date: "2026-05-15",
                status: "verified",
                title: "黃金價格走勢與結構性牛市分析：劇烈回撤 16% 後的央行購金與技術撐壓拆解",
                url: "../news/20260515-gold-price-strategic-analysis.html",
                core_conclusion: "剖析聯準會鷹派人事預期與地緣降溫對金價造成 16% 洗盤的底層原因，揭示實體黃金回流、印度需求、黃金 RWA 代幣化與去美元化支撐下的長線買點。",
                indicators: [
                    { label: "洗盤回撤", value: "-16%" },
                    { label: "核心底盤", value: "實體回流/購金" },
                    { label: "長青焦點", value: "技術撐壓帶" }
                ],
                h2_pillars: [
                    { id: "chapter-1", title: "鷹派預期與地緣降溫下的 16% 籌碼清洗" },
                    { id: "chapter-3", title: "去美元化與 39 兆美債危機下的結構買點" }
                ]
            },
            {
                id: "20260329-2026Q2-gold-investment-price-analysis-2026-2030",
                pillar: "supercycle",
                dimension: "I",
                category: "產業結構與週期",
                badge: "產業結構與週期",
                date: "2026-03-29",
                status: "verified",
                title: "黃金超級週期長期定價模型：實質利率脫鉤、反身性機制與挑戰 $6,000 路徑",
                url: "../news/20260329-2026Q2-gold-investment-price-analysis-2026-2030.html",
                core_conclusion: "運用貝葉斯推斷、索羅斯反身性與摩賽克理論剖析黃金從商品轉向主權安全屬性的長期估值路徑，推演 2026–2030 年挑戰 $6,000 以上的核心條件。",
                indicators: [
                    { label: "五年展望", value: "$6,000+" },
                    { label: "核心推力", value: "實質利率脫鉤" },
                    { label: "分析模型", value: "貝葉斯 / 反身性" }
                ],
                h2_pillars: [
                    { id: "section-valuation", title: "為何多極化央行買盤逐步取代美元信用錨" },
                    { id: "section-timing", title: "時間框架匹配與中長線流動性拐點推演" }
                ]
            },
            {
                id: "20260531-us-debt-gold-btc-impact",
                pillar: "supercycle",
                dimension: "I",
                category: "產業結構與週期",
                badge: "產業結構與週期",
                date: "2026-05-31",
                status: "verified",
                title: "美債危機對黃金與比特幣的跨資產傳導：財政主導與法幣信用重估路徑",
                url: "../news/20260531-us-debt-gold-btc-impact.html",
                core_conclusion: "深入分析美國國債評級壓力與財政主導體制如何重構全球無風險定價基準，對比黃金挑戰 $6,000 與比特幣邁向 $150,000 的避險共振與分歧路徑。",
                indicators: [
                    { label: "宏觀體制", value: "財政主導" },
                    { label: "黃金推演", value: "$6,000" },
                    { label: "BTC 推演", value: "$150,000" }
                ],
                h2_pillars: [
                    { id: "chapter-1", title: "財政赤字如何加速法幣信用重估" },
                    { id: "chapter-4", title: "美債危機下實體黃金與比特幣的避險傳導對比" }
                ]
            },

            // --- Pillar II: 清算與事件歸因 ---
            {
                id: "20261119-gold-btc-november-selloff-attribution",
                pillar: "liquidity",
                dimension: "II",
                category: "事件歸因與市場追蹤",
                badge: "事件歸因與市場追蹤",
                date: "2026-11-19",
                status: "verified",
                title: "黃金與比特幣 11 月重挫歸因：Fed 升息預期、2.91% 實質利率與 1.88 兆發債抽資",
                url: "../news/20261119-gold-btc-november-selloff-attribution.html",
                core_conclusion: "10 年期 TIPS 實質殖利率飆升至 2.91%、美元指數觸及 103.70，疊加 1.88 兆投資級企業債抽乾流動性導致金價下探 $3,831；驗證央行 321 噸買盤與 ETF 流出的結構分歧。",
                indicators: [
                    { label: "金價回測", value: "$3,831" },
                    { label: "10Y TIPS", value: "2.91%" },
                    { label: "央行買盤", value: "321 噸支撐" }
                ],
                h2_pillars: [
                    { id: "五大市場假說逐一研究確認", title: "逐一驗證 11 月股金幣同步重挫五大市場假說" },
                    { id: "黃金與比特幣結構性差異與後續觀察指標", title: "央行實體買盤與金融 ETF 流出的結構背離" }
                ]
            },
            {
                id: "20260803-gold-macro-liquidity-crisis-review",
                pillar: "liquidity",
                dimension: "II",
                category: "事件歸因與市場追蹤",
                badge: "事件歸因與市場追蹤",
                date: "2026-08-03",
                status: "verified",
                title: "全球宏觀流動性危機與黃金定價重估：沃什休克療法與 $5,595 回調復盤",
                url: "../news/20260803-gold-macro-liquidity-crisis-review.html",
                core_conclusion: "事實驗證黃金自 $5,595 歷史天價回調至 $4,044 的雙重傳導機制：沃什休克療法推升 30 年期美債利率與私人信貸緊縮，釐清流動性收縮中黃金逆勢修復的關鍵條件。",
                indicators: [
                    { label: "回調區間", value: "$5,595 → $4,044" },
                    { label: "政策衝擊", value: "沃什休克療法" },
                    { label: "驗證類型", value: "事後復盤校準" }
                ],
                h2_pillars: [
                    { id: "核心論點與宏觀分析框架之深度解構", title: "沃什休克療法與 30 年期美債利率的雙重擠壓" },
                    { id: "事實查核與現實市場數據印證矩陣", title: "危機事實驗證後的黃金配置框架校準" }
                ]
            },
            {
                id: "20260528-gold-btc-crash-analysis",
                pillar: "liquidity",
                dimension: "II",
                category: "事件歸因與市場追蹤",
                badge: "事件歸因與市場追蹤",
                date: "2026-05-29",
                status: "verified",
                title: "流動性危機下黃金與比特幣同步崩盤：能源通膨、美債破 5.1% 與槓鈴策略失效",
                url: "../news/20260528-gold-btc-crash-analysis.html",
                core_conclusion: "剖析荷姆茲海峽危機引發能源通膨並迫使聯準會展現鷹派立場，帶動美債殖利率突破 5.1%，導致避險資產無差別拋售與傳統槓鈴配置短期失效的結構必然性。",
                indicators: [
                    { label: "美債殖利率", value: "> 5.1%" },
                    { label: "觸發源頭", value: "荷姆茲能源通膨" },
                    { label: "策略警示", value: "槓鈴策略失效" }
                ],
                h2_pillars: [
                    { id: "correlation-breakdown-barbell-failure", title: "資產定價權重塑與槓鈴對沖策略的系統性失效" },
                    { id: "conclusion-macro-reality", title: "結構性洗盤對長期避險配置的深層意義" }
                ]
            },
            {
                id: "20260325-private-credit-gold-crisis",
                pillar: "liquidity",
                dimension: "II",
                category: "事件歸因與市場追蹤",
                badge: "事件歸因與市場追蹤",
                date: "2026-03-25",
                status: "verified",
                title: "私人信貸危機與黃金兩階段博弈：1.8 兆影子銀行清算、PIK 陷阱與先跌後暴漲",
                url: "../news/20260325-private-credit-gold-crisis.html",
                core_conclusion: "深剖 1.8 兆美元美國私人信貸市場的 PIK 以債養債與 BDC 贖回閘門風險，推演影子銀行危機爆發時，黃金如何走出「初期變現下跌 ➔ 後期法幣重估暴漲」兩階段劇本。",
                indicators: [
                    { label: "影子銀行", value: "$1.8 兆" },
                    { label: "危機機制", value: "PIK + 贖回閘門" },
                    { label: "走勢結構", value: "先跌後漲兩階段" }
                ],
                h2_pillars: [
                    { id: "section-3", title: "1.8 兆影子銀行贖回潮如何引爆跨資產清算" },
                    { id: "section-4", title: "解構金價在信貸危機中先跌後暴漲的博弈節奏" }
                ]
            },
            {
                id: "20260323-gold-crash-analysis",
                pillar: "liquidity",
                dimension: "II",
                category: "事件歸因與市場追蹤",
                badge: "事件歸因與市場追蹤",
                date: "2026-03-23",
                status: "verified",
                title: "全球黃金大跌原因與轉機展望：TACO 關稅策略、CME 百分比保證金與強制去槓桿",
                url: "../news/20260323-gold-crash-analysis.html",
                core_conclusion: "拆解川普 TACO 關稅策略逆轉短線通膨預期，疊加 CME 百分比保證金改革觸發高槓桿多單強制平倉的洗盤路徑，鎖定清算結束後的關鍵支撐位。",
                indicators: [
                    { label: "衍生品觸發", value: "CME 保證金改革" },
                    { label: "政策變數", value: "TACO 關稅策略" },
                    { label: "焦點議題", value: "清算尾聲買點" }
                ],
                h2_pillars: [
                    { id: "chapter-4", title: "CME 百分比保證金改革如何加速多頭去槓桿" },
                    { id: "chapter-7", title: "清算賣壓出清後的支撐位與 TACO 反轉契機" }
                ]
            },

            // --- Pillar III: 紅隊與量化配置 ---
            {
                id: "20261013-gold-currency-stress-test",
                pillar: "red-team",
                dimension: "III",
                category: "紅隊審查與風控預警",
                badge: "紅隊審查與風控預警",
                date: "2026-10-13",
                status: "verified",
                title: "全球黃金超級週期與貨幣危機假說紅隊審查：極端流動性踩踏與反駁推演",
                url: "../news/20261013-gold-currency-stress-test.html",
                core_conclusion: "站上反方立場對「去美元化購金永久脫鉤實質利率」進行紅隊壓力測試：推演高實質利率放大零孳息資本成本、央行買盤飽和與 COMEX 紙黃金去槓桿的深層回撤情境。",
                indicators: [
                    { label: "審查視角", value: "反方紅隊證偽" },
                    { label: "核心脆弱點", value: "零孳息資本成本" },
                    { label: "風險觸發", value: "COMEX 溢價收斂" }
                ],
                h2_pillars: [
                    { id: "實質利率高企與央行購金極限-去美元化邊際效應遞減與外匯儲備機會成本壓力測試", title: "為何「去美元化永久脫鉤利率」可能面臨階段性反噬" },
                    { id: "紙黃金去槓桿與實體交割擠兌-comex-交割極限-efp-價差異動與制度性結算防線", title: "COMEX 期現溢價收斂與購買力中樞深層重估" }
                ]
            },
            {
                id: "20260517-gold-valuation-and-risk-assessment",
                pillar: "red-team",
                dimension: "III",
                category: "紅隊審查與風控預警",
                badge: "紅隊審查與風控預警",
                date: "2026-05-17",
                status: "verified",
                title: "黃金戰略配置與風險定價：首 72 小時變現拋售潮、量子威脅與實體溢價框架",
                url: "../news/20260517-gold-valuation-and-risk-assessment.html",
                core_conclusion: "建構機構級黃金估值與極端尾部風控框架：量化首 72 小時流動性變現衝擊、美債流動性指數警訊，以及後量子加密威脅下實體黃金相對於數位資產的極端溢價。",
                indicators: [
                    { label: "流動性窗口", value: "首 72 小時拋售" },
                    { label: "尾部變數", value: "量子計算威脅" },
                    { label: "產出交付", value: "防禦配置框架" }
                ],
                h2_pillars: [
                    { id: "chapter-1", title: "流動性枯竭首 72 小時如何扭曲避險溢價" },
                    { id: "chapter-3", title: "後量子時代實體黃金的終極信任錨定位" }
                ]
            },
            {
                id: "trading-strategies-commodity-futures",
                pillar: "red-team",
                dimension: "III",
                category: "方法論、工具與工程",
                badge: "方法論、工具與工程",
                date: "2026-05-22",
                status: "verified",
                title: "大宗商品期貨量化策略：CTA 管理期貨、期限結構與銅金比／金銀比套利法則",
                url: "../post/trading-strategies-commodity-futures.html",
                core_conclusion: "從單純持有黃金進階至機構級量化操作：完整拆解期限結構（正逆價差）、展期收益、波動率目標控制，以及銅金比與金銀比跨品種宏觀套利模型。",
                indicators: [
                    { label: "核心策略", value: "CTA + 期限結構" },
                    { label: "跨品種比值", value: "銅金比 / 金銀比" },
                    { label: "風控機制", value: "波動率目標控制" }
                ],
                h2_pillars: [
                    { id: "chapter-3", title: "正常逆價差理論與展期收益（Roll Yield）來源" },
                    { id: "chapter-5", title: "銅金比與金銀比在宏觀週期切換中的量化套利" }
                ]
            }
        ]
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TOPIC_GOLD_COT_DATA;
    } else {
        root.TOPIC_GOLD_COT_DATA = TOPIC_GOLD_COT_DATA;
    }
})(typeof self !== 'undefined' ? self : this);
