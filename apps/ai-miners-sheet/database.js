/**
 * AI 礦企核心數據對標總表 - 專屬獨立資料庫 (SSOT)
 * 
 * 檔案說明：
 * 本檔案為「AI 礦企核心數據對標總表工作站」的唯一核心數據源。
 * 格式為標準 JavaScript 物件陣列，支援直接在瀏覽器以 <script src="database.js"> 零編譯載入。
 * 
 * 欄位定義說明 (Schema):
 * - ticker: 股票代號 (例: "BTBT")
 * - name: 公司全名與品牌別稱
 * - exchange: 上市交易所 (例: "NASDAQ")
 * - modelCategory: 商業模式分類代碼 ("Neocloud" | "Wholesale" | "Turnkey" | "PowerReserve")
 * - businessModel: 轉型商業模式詳細說明
 * - price: 當前現價 (USD)
 * - shares: 發行股數 (單位: 百萬股, M)
 * - marketCap: 總市值 (單位: 10億美元, $B)
 * - netDebt: 淨負債 (單位: 百萬美元, $M，負值代表淨現金)
 * - ev: 企業價值 Enterprise Value (單位: 10億美元, $B)
 * - beta: 貝他值 (6個月/1年市場波動敏感度)
 * - targetPrice: 法人共識目標價 (USD)
 * - upside: 隱含潛在漲幅 (百分比 %)
 * - range52w: 52週股價區間 (字串)
 * - opMw: 目前已營運帶電容量 (單位: MW)
 * - pipelineMw: 總規劃儲備管線電力 (單位: MW)
 * - contractedMw: 已簽訂 HPC/AI 租賃或專用容量 (單位: MW)
 * - hpcSplit: HPC/AI 業務佔比 (百分比 %)
 * - evMw: 企業價值除以營運電力倍數 (單位: $M / MW)
 * - facilities: 核心數據中心園區與地理位置
 * - energization: 變電站接入與通電進度時程
 * - cod: 商轉投產預計日期 (Commercial Operation Date)
 * - majorClients: 主要合作夥伴與科技巨頭租戶
 * - contracts: 標誌性在手合約與租賃協議細節
 * - backlogValue: 在手合約確定總價值 (單位: 10億美元, $B)
 * - backlogText: 在手合約顯示字串 (例: "$9.3B ~ $14.5B")
 * - contractRatio: 產能或在手合約鎖定比例
 * - yoy: 營收年增率 (百分比 %)
 * - revenueHistory: 近四季季度營收趨勢 [Q-3, Q-2, Q-1, 最新季] (單位: $M)
 * - capexHistory: 近四季資本支出 CapEx 趨勢 [Q-3, Q-2, Q-1, 最新季] (單位: $M)
 * - latestEpsActual: 最新季度實際 EPS (USD)
 * - latestEpsEst: 最新季度市場預估 EPS (USD)
 * - epsSurprise: EPS 驚喜率 (百分比 %)
 * - colorBadge: 標籤視覺識別色彩 ("teal" | "cyan" | "amber" | "indigo" | "emerald" | "purple" | "rose")
 */

const DEFAULT_MINERS_DATA = [
  {
    ticker: "BTBT",
    name: "Bit Digital, Inc. / WhiteFiber",
    exchange: "NASDAQ",
    modelCategory: "Neocloud",
    businessModel: "自營 Neocloud (自購 GPU 承受折舊)",
    price: 0.73,
    shares: 168,
    marketCap: 0.263,
    netDebt: -45,
    ev: 0.218,
    beta: 3.54,
    targetPrice: 3.20,
    upside: 338.4,
    range52w: "$0.71 - $3.31",
    opMw: 210,
    pipelineMw: 302,
    contractedMw: 40,
    hpcSplit: 60,
    evMw: 1.0,
    facilities: "蒙特婁 MTL-2/3 (自有/租賃 16 MW)；北卡 Greensboro NC-1 (76 MW 工業改裝)；紐約州與冰島 (210 MW)",
    energization: "MTL-2/3: 高壓改造已完成通電；NC-1: 首期 24 MW 電力驗收就緒；紐約與冰島: 已全面通電",
    cod: "MTL-2/3: 已商轉營運；NC-1: 576 顆 H200 部署就緒，預計 2026 Q3 起貢獻營收 (導入 B200/GB200)",
    majorClients: "Boosteroid, DNA AI Compute Fund, WhiteFiber 企業客戶",
    contracts: "WhiteFiber NC-1: 10年期 ~$865M 服務協議；DNA Fund: 25個月 $20.2M；獲 $1.0 億 DDTL 融資",
    backlogValue: 0.89,
    backlogText: "$885M+",
    contractRatio: "~100% 早期產能已售 (WhiteFiber 獨立 IPO)",
    yoy: 180,
    revenueHistory: [28, 35, 52, 68],
    capexHistory: [22, 38, 48, 55],
    latestEpsActual: 0.06,
    latestEpsEst: 0.04,
    epsSurprise: 50.0,
    colorBadge: "teal"
  },
  {
    ticker: "CIFR",
    name: "Cipher Mining Inc.",
    exchange: "NASDAQ",
    modelCategory: "Wholesale",
    businessModel: "批發機房地主 (客戶自備晶片，零折舊)",
    price: 6.55,
    shares: 315,
    marketCap: 2.987,
    netDebt: 85,
    ev: 3.072,
    beta: 3.53,
    targetPrice: 7.50,
    upside: 14.5,
    range52w: "$5.65 - $30.14",
    opMw: 540,
    pipelineMw: 3400,
    contractedMw: 454,
    hpcSplit: 40,
    evMw: 5.7,
    facilities: "西德州 Wink Black Pearl (100% 自有園區)；西德州 Barber Lake (300 MW 自有基地)；西德州 Stingray (250 英畝新站點)",
    energization: "Black Pearl: 345 kV 直連已帶電；Barber Lake & Stingray: 預計 2026 Q4 通電",
    cod: "Black Pearl: 2026.08 起租、2027.03 滿載 (216 IT MW)；Barber Lake: 2027 H1 (168 IT MW)；Stingray: 2027 正式起租 (70 IT MW)",
    majorClients: "AWS (Amazon), Fluidstack (Google 信用擔保)",
    contracts: "AWS: 15年約 $5.5B (Black Pearl 216 IT MW) + Stingray 70 IT MW 預租；Fluidstack: 10年 ~$3.0B (展期至 $9.0B，Google 信用擔保)",
    backlogValue: 11.5,
    backlogText: "$11.5B ~ $17.5B",
    contractRatio: "100% 鎖定在手 454 MW 關鍵 IT 負載",
    yoy: 105,
    revenueHistory: [38, 46, 62, 85],
    capexHistory: [45, 68, 92, 120],
    latestEpsActual: 0.09,
    latestEpsEst: 0.07,
    epsSurprise: 28.6,
    colorBadge: "cyan"
  },
  {
    ticker: "CLSK",
    name: "CleanSpark Inc.",
    exchange: "NASDAQ",
    modelCategory: "PowerReserve",
    businessModel: "自研微電網調控，等待高溢價 CSP 整批出租",
    price: 6.16,
    shares: 245,
    marketCap: 1.582,
    netDebt: 110,
    ev: 1.692,
    beta: 3.66,
    targetPrice: 18.00,
    upside: 192.2,
    range52w: "$5.66 - $19.17",
    opMw: 680,
    pipelineMw: 1800,
    contractedMw: 175,
    hpcSplit: 25,
    evMw: 2.5,
    facilities: "喬治亞 Sandersville (122 英畝自有地 250 MW / 175 IT MW)；德州大休士頓 Austin County (271 英畝 285 MW / >200 IT MW)",
    energization: "Sandersville: 250 MW 變電所已通電運作；Austin County: 預計 2027 H1 實現通電",
    cod: "Sandersville: 預計 2027 Q4 起分期交付；Austin County: 預計 2027 H2~2028 分期投產",
    majorClients: "全球高投資級科技巨頭 (未具名 Hyperscaler)",
    contracts: "Sandersville: 20年期 NNN $6.6B (展期可達 $11.6B，年化 NOI 達 $3.3 億)；獲 $22.76 億專案融資覆蓋工程",
    backlogValue: 6.6,
    backlogText: "$6.6B ~ $11.6B (20年期 NNN)",
    contractRatio: "Sandersville 100% 鎖定 (175 IT MW) / 全美儲備管線逾 1.8 GW",
    yoy: 130,
    revenueHistory: [74, 98, 128, 162],
    capexHistory: [85, 130, 175, 210],
    latestEpsActual: 0.13,
    latestEpsEst: 0.09,
    epsSurprise: 44.4,
    colorBadge: "amber"
  },
  {
    ticker: "CORZ",
    name: "Core Scientific, Inc.",
    exchange: "NASDAQ",
    modelCategory: "Turnkey",
    businessModel: "代工託管 Turnkey (CoreWeave 出資補貼 CapEx)",
    price: 11.76,
    shares: 275,
    marketCap: 3.779,
    netDebt: 390,
    ev: 4.169,
    beta: 3.10,
    targetPrice: 24.00,
    upside: 104.1,
    range52w: "$11.20 - $30.46",
    opMw: 1250,
    pipelineMw: 1250,
    contractedMw: 590,
    hpcSplit: 75,
    evMw: 3.3,
    facilities: "北卡 Marble (65 MW IT 已全數計費)；德州 Denton、Pecos、Austin 及奧克拉荷馬 Muskogee 五大基地",
    energization: "590 MW 變電所均已就緒 (Duke Energy 併網 100% 就位，ERCOT 滾動切換)",
    cod: "Marble: 65 MW 已全數點交計費；Denton 等: 485 MW 已計費，剩餘 100 MW 調試中 (Pecos 2027 H1 交付)；2026 Q4 比特幣完全退場",
    majorClients: "CoreWeave (獲 12 年深度主約), AMD",
    contracts: "CoreWeave: 12年期累計 $10.2B (每 MW 獲 CoreWeave 大幅出資補貼)；AMD 增約；2026 Q3 主機代管營收達 $2.154 億",
    backlogValue: 10.2,
    backlogText: "$10.2B (102 億美元)",
    contractRatio: "100% 鎖定在手 590 MW 關鍵 IT 容量 (550 MW 已計費/調試)",
    yoy: 95,
    revenueHistory: [115, 138, 165, 198],
    capexHistory: [60, 95, 140, 190],
    latestEpsActual: 0.16,
    latestEpsEst: 0.14,
    epsSurprise: 14.3,
    colorBadge: "indigo"
  },
  {
    ticker: "HIVE",
    name: "HIVE Digital Technologies Ltd.",
    exchange: "NASDAQ",
    modelCategory: "Neocloud",
    businessModel: "綠能 Neocloud (自購 GPU，毛利 60%+)",
    price: 1.78,
    shares: 118,
    marketCap: 0.695,
    netDebt: -15,
    ev: 0.680,
    beta: 3.76,
    targetPrice: 6.00,
    upside: 237.1,
    range52w: "$1.58 - $5.34",
    opMw: 240,
    pipelineMw: 578,
    contractedMw: 100,
    hpcSplit: 60,
    evMw: 2.8,
    facilities: "巴拉圭 Yguazú Phase 3 (400 MW Itaipu 水電直連)；瑞典 Boden (38 MW) 及加拿大 (蒙特婁/新布藍茲維/多倫多 140 MW)",
    energization: "Boden & 加拿大: 178 MW 全部通電運作；Yguazú P3: 240 MW 已具備 (三組 80 MW 變壓器)",
    cod: "Yguazú P3: 2026 Q3 全面商轉驗收 (全網目標 >35 EH/s 保留 AI 彈性)；多倫多 7.2 MW Tier 3 機房已納入；Boden 主權 AI 持續擴充",
    majorClients: "Bell Canada, BUZZ HPC, LLM 開發社群, 機構投資級客戶",
    contracts: "聯手 Bell Canada 推動主權 AI；多倫多收購 7.2 MW 機房加速 HPC 業務營收 5 倍擴張；自建與託管 H100/H200 叢集",
    backlogValue: 0.35,
    backlogText: "$350M+ (含主權雲與 HPC 長約池)",
    contractRatio: "靈活算力合約與自營 HPC 雙軌驅動",
    yoy: 75,
    revenueHistory: [22, 28, 36, 44],
    capexHistory: [18, 25, 34, 42],
    latestEpsActual: 0.06,
    latestEpsEst: 0.04,
    epsSurprise: 50.0,
    colorBadge: "emerald"
  },
  {
    ticker: "HUT",
    name: "Hut 8 Corp.",
    exchange: "NASDAQ",
    modelCategory: "Wholesale",
    businessModel: "獲 $7.5B 項目融資，超大型 AI 機房批發",
    price: 52.65,
    shares: 112,
    marketCap: 6.444,
    netDebt: 220,
    ev: 6.664,
    beta: 3.58,
    targetPrice: 28.00,
    upside: -46.8,
    range52w: "$31.67 - $140.80",
    opMw: 1070,
    pipelineMw: 8660,
    contractedMw: 949,
    hpcSplit: 65,
    evMw: 6.2,
    facilities: "德州 Nueces Beacon Point (1,000 MW Gross / 704 IT MW)；路易斯安那 River Bend (330 MW Gross / 245 IT MW，可擴至 1 GW)",
    energization: "Beacon Point: AEP 1 GW 併網審批就位；River Bend: Entergy LA 專案變電所建設中 (330 MW 供電配額)",
    cod: "River Bend: 預計 2026 年底~2027 年投產交付；Beacon Point: 2027 Q3 首批交付 (雙份 352 MW 租約)，2028 年全期滿載",
    majorClients: "超大規模雲端巨頭 (Hyperscalers), Fluidstack / Anthropic (Google 擔保)",
    contracts: "Beacon Point: 雙份 352 MW 租約基礎總值 $19.6B；River Bend: 15 年期 $7.0B 長約 (Google 信用擔保)；在手合約總額達 $26.6B",
    backlogValue: 26.6,
    backlogText: "$26.6B (266 億美元)",
    contractRatio: "興建中 949 MW 關鍵 IT 全數售罄 (無晶片折舊風險)",
    yoy: 160,
    revenueHistory: [55, 75, 110, 156],
    capexHistory: [40, 75, 120, 175],
    latestEpsActual: 0.31,
    latestEpsEst: 0.22,
    epsSurprise: 40.9,
    colorBadge: "emerald"
  },
  {
    ticker: "IREN",
    name: "Iris Energy Limited",
    exchange: "NASDAQ",
    modelCategory: "Neocloud",
    businessModel: "垂直整合 Neocloud (自購 GPU + 超大租賃)",
    price: 21.64,
    shares: 195,
    marketCap: 8.756,
    netDebt: 140,
    ev: 8.896,
    beta: 4.33,
    targetPrice: 55.00,
    upside: 154.2,
    range52w: "$17.16 - $70.71",
    opMw: 560,
    pipelineMw: 3400,
    contractedMw: 260,
    hpcSplit: 51,
    evMw: 15.9,
    facilities: "西德州 Sweetwater 1 & 2 / Horizon 1 (1.4 GW Gross / 2 GW ERCOT Hub)；德州 Childress (規劃高達 5 GW，首期 260 MW IT)",
    energization: "Sweetwater 1 & 2: 提前併網完成 (Batch Zero, 345 kV 直連)；Childress: 變電所全面運作中",
    cod: "Childress: 2026.08 已交付微軟首座 50 MW 機房，後續陸續交接；Sweetwater / Horizon 1: 2026 Q3~Q4 逐期交付",
    majorClients: "微軟 (Microsoft), NVIDIA, Dell",
    contracts: "微軟: 5年 $9.7B (獲 20% 預付款)；NVIDIA: 5年 $3.4B (Blackwell 叢集，附 $21億 認股權)；Dell 採購 $5.8B GB300",
    backlogValue: 13.1,
    backlogText: "$13.1B (微軟 $9.7B + 輝達 $3.4B)",
    contractRatio: "微軟 200 MW + NVIDIA 60 MW 全面鎖定 (AI 營收佔比過半 51%)",
    yoy: 155,
    revenueHistory: [52, 78, 118, 168],
    capexHistory: [70, 110, 165, 230],
    latestEpsActual: 0.25,
    latestEpsEst: 0.18,
    epsSurprise: 38.9,
    colorBadge: "purple",
    // 深度微觀財務指標與估值拆解 (Deep Valuation & Unit Economics)
    deepValuation: {
      reportSource: "doc/draft/IREN Financial Valuation Metrics.md",
      unitEconomics: {
        msftRevenuePerMwYear: 9.70, // $M/MW/yr
        msftUnitPricePerKwMonth: 808.33, // $/kW/month
        nvdaRevenuePerMwYear: 11.33, // $M/MW/yr
        nvdaUnitPricePerKwMonth: 944.44, // $/kW/month
        wholesaleBenchmarkMwYear: "1.80 - 2.10", // $M/MW/yr (市場基準)
        contractStructure: "Take-or-Pay 固定費率算力服務 (GPU Cloud Fixed ARR)，無單方面終止權",
        rentEscalator: "5年期平攤固定年費 (Straight-line Fixed Fee)；儲備管線批發意向具 2.0%~3.0% 年遞增條款",
        btcDirectElectricityCostPerBtc: "20,000 - 26,259", // $/BTC
        btcAllInCashCostPerBtc: "29,000 - 31,000", // $/BTC
        btcAllInGaapCostPerBtc: "41,000 - 45,000", // $/BTC
        btcPowerTariff: "Childress 實質淨電價 0.031 - 0.033 $/kWh；能效比 15.0 J/TH",
        btcHodlStrategy: "嚴格執行 No-HODL 當日 100% 變現，資產負債表零持幣"
      },
      capexBreakdown: {
        tier3DlcBuildCostPerMw: "6.00 - 7.00", // $M/MW (中值 6.50)
        tier3DlcTotalInvestment: "1.2 - 1.4", // $B (200 MW Horizon 1-4)
        gpuServerHardwareCostPerMw: 29.05, // $M/MW (NVIDIA GB300)
        gpuHardwareTotalDeal: 5.81, // $B (Dell Technologies 採購協議)
        asicRetrofitCostPerMw: "1.50 - 2.50", // $M/MW (礦場改裝低階/空冷)
        msftCashPrepaymentPct: 20.0, // % ($1.94B 現金預付款)
        msftPrepaymentAmount: 1.94, // $B
        projectDebtFinancing: 3.65, // $B (高盛/摩根大通牽頭，投資級評等)
        externalNonDilutivePct: 96.2, // % (預付款+專案債涵蓋硬體 96.2%)
        irenSelfFundedHardwarePct: 3.8, // % ($2.2 億美元)
        future12To24mTotalCapexGuidance: "6.5 - 7.5", // $B
        prepaymentAccounting: "ASC 606 記入合約負債 (遞延收入)，商轉日起 5 年 (60 個月) 直線均勻確認為 GAAP 營收"
      },
      marginsAndOpex: {
        aiCloudProjectEbitdaMargin: 85.0, // % (NOI 利潤率)
        aiCloudAnnualCashEbitda: 1.65, // $B (微軟合約全功率投產後)
        aiCloudGaapOperatingMargin: "22% - 28%", // % (扣除約 60% 折舊後)
        realPowerCost: "3.1 - 3.3 ¢/kWh (ERCOT 長期購電 PPA + 負載響應 ERS 回售電網利潤對沖)",
        powerPassThroughMechanics: "非純託管，採 AI Cloud 全包模式，電費內含於算力收費並由長期 PPA 鎖定",
        quarterlyCashSga: "2,500 萬 - 3,000 萬美元 (年化 1.0 - 1.2 億美元)",
        quarterlySbc: "800 萬 - 1,200 萬美元 (非現金股權激勵)",
        btcCashGrossMargin: "52% - 56% (BTC $60k-$68k) / 68%+ (BTC >$90k)",
        btcGaapGrossMargin: "-15% 至 10% (ASIC 3 年加速折舊與轉型減損)"
      },
      depreciationPolicy: {
        land: "不折舊 (永久持有，100% 殘值)",
        buildings: "20 年直線法 (0% 殘值)",
        substationsAndGrid: "10 至 20 年直線法 (廠房及附屬電力設施)",
        coolingAndPowerEquipment: "3 至 10 年直線法 (UPS、冰水機組、DLC)",
        gpuHardware: "5 年直線法 (配合微軟 5 年合約週期，每年折舊 ~$1.16B)",
        asicMiners: "3 至 4 年直線法 (淘汰時一次性認列減損)",
        annualProjectDnaImpact: ">12.3 億美元/年 (Horizon 1-4 硬體 + 機房折舊合計)",
        accountingImpactSummary: "典型資本密集型特徵：營運現金流 (OCF) 極度充沛，但帳面因巨額硬體折舊而壓低 GAAP 淨利潤"
      },
      capitalStructure: {
        convertibleNotes2029: "$5.50 億 (票面 3.50%，到期 2029.06，轉換溢價 30%，Capped Call 上限 $20.98)",
        convertibleNotes2030: "$4.00 億 (票面 3.25%，到期 2030.12，轉換溢價 30%，Capped Call 上限 $25.86)",
        convertibleNotes2033: "$30.00 億 (票面 1.00%，到期 2033.12，轉換價 $73.07，Capped Call 上限 $110.30 消除翻倍內稀釋)",
        microsoftUsPrivatePlacement: "$21.00 億 (固定利率 SOFR+2.13%，Fitch A / DBRS A(low) 投資級，微軟合約質押)",
        microsoftDdtlLoan: "$15.50 億 (浮動利率 SOFR+2.25%，利率交換避險綜合借貸成本 6.00%)",
        blendedProjectCapitalCost: "3.31% (結合微軟預付款後專案全包加權資金成本)",
        hardwareLtc: "62.8% 專案貸款 / 計入預付款達 96.2%",
        lockboxWaterfall: "受託銀行控制閉鎖帳戶 (Cash Sweep Lockbox)，依瀑布優先支應現場電費、3-6 個月 DSRA 準備金與本息，超額 FCF 始回流母公司",
        cashAndLiquidity: "$18 億 - $26 億美元 (母公司現金與受限現金)",
        undrawnCreditLine: "$15.5 億美元 (DDTL 未提領額度)",
        fullyDilutedShares: "4.232 億股 (普通股 3.318 億 + 可轉債及股權激勵稀釋)",
        nvdaWarrant: "3,000 萬股認股權證 (5年期，行權價 $70.00/股，潛在權益資金 $21 億)",
        atmRemainingCapacity: "約 5 億美元未執行額度"
      },
      codMilestones: [
        { period: "2025 年底", billableMw: "380 - 510 MW", sites: "Childress 早期 + 加拿大 (160 MW)", category: "BTC 挖礦 (23-31 EH/s) + 早期 GPU", note: "啟動 ASIC 機架清退騰挪" },
        { period: "2026 Q2", billableMw: "560 MW", sites: "Horizon 1 (50 MW 液冷) + Mackenzie", category: "首批 50 MW AI 雲端商轉", note: "Sweetwater 1 號 1.4 GW 變電站通電" },
        { period: "2026 Q3", billableMw: "610 MW", sites: "Horizon 2 (50 MW 液冷) 交付", category: "AI 雲端營收佔比跨越 50%", note: "微軟第二批 GB300 集群驗收；ARR 突破 $1.2B - $1.5B" },
        { period: "2026 Q4", billableMw: "710 MW", sites: "Horizon 3 & 4 (各 50 MW) 交付", category: "微軟 200 MW 全面商轉，480 MW AI 專用", note: "淘汰最後 ASIC；鎖定 $1.94B ARR，全公司簽約 ARR 達 $3.7B - $4.4B" },
        { period: "2027 H1", billableMw: "950 MW", sites: "Childress Horizon 5-6 + Sweetwater 1 號初期", category: "AI Cloud (GB300 / B200 / Vera Rubin)", note: "啟動 NVIDIA 60 MW 氣冷合約及後續批發租賃" },
        { period: "2027 年底", billableMw: "1,210 MW", sites: "Sweetwater 1 號擴建投產", category: "超大規模 AI 運算中心群", note: "總營運容量突破 1.2 GW，年化營收挑戰 $8B - $10.7B" }
      ],
      fcfBreakevenPoint: "預估於 CY2027 Q3~Q4 迎來全包自由現金流 (FCF) 實質轉正拐點 (受惠於 200 MW 全功率運轉每年 ~$1.65B 淨現金流入與外部硬體墊付告一段落)",
      dcfDrivers: {
        wacc: { base: "8.5% - 9.2%", bull: "7.8%", bear: "10.5%", source: "投資級專案債降低總體加權資本成本" },
        gpuCloudNetRevenuePerMw: { base: "$9.70M / MW / 年", bull: "$11.33M", bear: "$8.50M", source: "微軟 / NVIDIA 合約換算" },
        tier3DlcBuildCapEx: { base: "$6.50M / MW", bull: "$6.00M", bear: "$7.00M", source: "Childress 官方指引 ($6-7M/MW)" },
        gb300HardwarePerMw: { base: "$29.05M / MW", bull: "$27.00M", bear: "$31.00M", source: "Dell 58.1 億美元採購合約" },
        msftCustomerPrepaymentRate: { base: "20.0% ($1.94B)", bull: "20.0%", bear: "15.0%", source: "合約條款明定" },
        aiCloudEbitdaMargin: { base: "85.0%", bull: "88.0%", bear: "80.0%", source: "華爾街共識與 PPA 電費鎖定模型" },
        quarterlyCashSga: { base: "$2,500 萬", bull: "$2,000 萬", bear: "$3,500 萬", source: "除外非現金 SBC 歷史申報" },
        btcDirectPowerCost: { base: "$26,000 / BTC", bull: "$20,000", bear: "$32,000", source: "Childress 3.3¢/kWh 淨電價" },
        buildingDepreciationYears: { base: "20 年 (直線法)", bull: "25 年", bear: "15 年", source: "SEC 10-K 會計政策" },
        gpuHardwareDepreciationYears: { base: "5 年 (直線法)", bull: "5 年", bear: "3 年", source: "配合合約週期與晶片迭代" },
        projectDebtInterestRate: { base: "6.00%", bull: "5.50%", bear: "6.50%", source: "Fitch A / DBRS A(low) 私募定價" },
        convertibleDebtCoupon: { base: "1.35% (加權)", bull: "1.00%", bear: "2.50%", source: "$30 億 1% 債券主導" },
        fullyDilutedSharesCount: { base: "4.23 億股", bull: "3.90 億股", bear: "4.60 億股", source: "含 NVDA 30M 認股權證與可轉債" }
      }
    }
  },
  {
    ticker: "MARA",
    name: "MARA Holdings, Inc.",
    exchange: "NASDAQ",
    modelCategory: "PowerReserve",
    businessModel: "合資共擔 (出地出電，零 GPU 折舊負擔)",
    price: 6.35,
    shares: 310,
    marketCap: 2.451,
    netDebt: 850,
    ev: 3.301,
    beta: 5.23,
    targetPrice: 28.00,
    upside: 340.9,
    range52w: "$5.81 - $16.62",
    opMw: 1400,
    pipelineMw: 4500,
    contractedMw: 100,
    hpcSplit: 20,
    evMw: 2.4,
    facilities: "俄亥俄 Long Ridge (505 MW 燃氣發電廠表後)；Starwood SDV 合資基地 (1.0~2.5 GW)；德州 Matagorda (1,200 英畝 2 GW 管道)",
    energization: "Long Ridge: 表後直連已就緒 (FERC 已核准 505 MW 電廠併購)；SDV/Matagorda: 陸續進行電網升級",
    cod: "Long Ridge: 2026 H2 完成交割開工，首期 200 MW AI 於 2027~2028 投產；Starwood SDV: 預計 2027 H1 啟動首座專案交付",
    majorClients: "Starwood Digital Ventures (SDV) / Hyperscalers, 自營 HPC 用戶",
    contracts: "FERC 核准 Long Ridge 505 MW 電廠併購 ($1.5B)；Starwood SDV 合資開發 1.0~2.5 GW (持股 10%-50%，出清 1.5 萬枚 BTC 充實資本)",
    backlogValue: 0.10,
    backlogText: "合資利潤拆分制 (1.0~2.5 GW JV)",
    contractRatio: "初期合約由 Starwood 招商中",
    yoy: 90,
    revenueHistory: [110, 135, 158, 185],
    capexHistory: [90, 140, 180, 220],
    latestEpsActual: 0.14,
    latestEpsEst: 0.12,
    epsSurprise: 16.7,
    colorBadge: "rose",
    // 深度微觀財務指標與估值拆解 (Deep Valuation & Unit Economics)
    deepValuation: {
      reportSource: "doc/draft/MARA Holdings Financial Modeling Research.md",
      unitEconomics: {
        wholesaleRevenuePerMwYear: "1.68 - 1.92", // $M/MW/yr (Starwood JV 批發託管產值，中值 1.80)
        wholesaleUnitPricePerKwMonth: "140 - 160", // $/kW/month
        gpuCloudRatePerGpuHour: "$1.80 - $2.40 / GPU-hour (Exaion 8卡伺服器年產值 $126k~$168k)",
        contractStructure: "10~15 年 Take-or-Pay 批發託管 (NNN)；Exaion 推進主權雲與企業 AI 推論平台",
        rentEscalator: "每年固定遞增 2.5% ~ 3.0% (或與 CPI-U 掛鉤上限 4.0%)",
        btcDirectElectricityCostPerBtc: "38,690 - 40,047", // $/BTC (Q2 為 $38,690)
        btcAllInCashCostPerBtc: "69,616", // $/BTC (含電力 $38,690 + 現場 O&M $11,108 + 現金 SG&A $19,818)
        btcAllInGaapCostPerBtc: "136,396", // $/BTC (含 Q2 D&A $161.74M 折合每顆 $66,780)
        btcPowerTariff: "自有站點加權電價 $0.04/kWh；Long Ridge 燃氣電廠表後直供成本 <$0.015/kWh (<$15/MWh)",
        btcHodlStrategy: "持幣 35,577 顆 (市值 ~$2.1B-$2.4B，其中 9,270 顆抵押)；處分約 1.5-2.0 萬顆比特幣買回可轉債"
      },
      capexBreakdown: {
        greenfieldDlcBuildCostPerMw: "8.50 - 10.50", // $M/MW (Tier-3 DLC 綠地新建)
        retrofitDlcBuildCostPerMw: "6.50 - 8.00", // $M/MW (既有礦場改裝)
        landAndPowerValuationPerMw: "1.50 - 2.00", // $M/MW (土地變電站作價折抵股權)
        starwoodJvEquityContribution: "以土地變電站實物注資獲 50% 股權，外部工程 CapEx 由專案債與 SDV 支應",
        maraSelfFundedCapexPct: "~0%", // % (合資機房建置母公司額外自籌現金接近 0%)
        tenantImprovementAccounting: "ASC 842 規範：TI 補貼記入遞延收入直線折抵租金；客戶端專屬硬體採淨額沖銷不計入 PP&E",
        future12To24mTotalCapexGuidance: "3.50 - 5.00", // 億美元 (母公司自身預算：Long Ridge 電廠交割、Hannibal 擴建與礦機迭代)
        projectDebtFinancing: "60% - 70% LTC 專案層級非追索權融資"
      },
      marginsAndOpex: {
        starwoodJvNoiMargin: "75% - 85%", // % (合約現金毛利率 / NOI 利潤率)
        starwoodJvAnnualNetNoi: "5,000 萬 - 1.0 億美元", // 200 MW 專案穩定後歸屬 MARA 50% 股權
        yieldOnCost: "9% - 15%", // %
        realPowerCost: "<1.5 ¢/kWh (Long Ridge 505 MW 燃氣發電廠表後發電)；批發託管採 100% Pass-Through 代收代付",
        quarterlyCashSga: "4,500 萬 - 4,800 萬美元 (年化約 1.8 億 - 1.9 億美元，反映裁員 15% 節省)",
        quarterlySbc: "5,500 萬 - 6,500 萬美元 (非現金股權激勵)",
        btcCashGrossMargin: "56.7% (2026 Q2 總營收 $174.9M，扣除電力 $48.75M 與 O&M $26.91M)",
        btcGaapGrossMargin: "-35.7% (計入 Q2 不動產與設備折舊 $161.74M 後營業毛利轉負)"
      },
      depreciationPolicy: {
        land: "不折舊 (永久持有，100% 殘值)",
        buildings: "15 至 25 年直線法 (資料中心外殼與開關站，0% 殘值)",
        substationsAndGrid: "10 至 15 年直線法 (機房電力與冷卻設備，0% 殘值)",
        powerPlantAsset: "25 至 30 年直線法 (Long Ridge CCGT 505 MW 燃氣機組，5%-10% 殘值)",
        asicMiners: "3 年直線法 (自 5 年壓縮至 3 年，0% 殘值，單季巨額折舊主因)",
        gpuHardware: "3 至 4 年直線法 (Exaion 雲端 H100/H200，0% 殘值)",
        annualProjectDnaImpact: "6.5 億 - 7.5 億美元/年 (單季 D&A 長年達 $160M - $192M)",
        accountingImpactSummary: "礦機 3 年加速折舊造成單季 $1.6 億+ 帳面折舊，壓低 GAAP 淨利；建構 DCF 現金流加回但自營挖礦需按 3 年扣除置換 CapEx"
      },
      capitalStructure: {
        convertibleNotes2026: "$4,808 萬 (票面 1.00%，經買回後流通在外僅剩小額，2026 年內完全到期清償)",
        convertibleNotes2031Fixed: "2.125% 票面利率，每半年付息一次，屬主要固定現金利息債務",
        convertibleNotes2031Zero: "初始發行 $8.5 億 - $10 億 (0.00% 票息)，2026 Q1 折價買回後剩餘面額約 $3.5 億 - $4.5 億",
        convertibleNotes2032Zero: "$9.5 億 - $10.25 億 (0.00% 零息，溢價 40%)",
        lineOfCredit: "短期循環信貸餘額自 $300M 降至 $150M",
        projectDebtTerms: "合資 SPV 目標 LTC 60%-70%；DSCR 底線 1.25x；維持 6 個月 DSRA；DSCR <1.15x 啟動 Cash Sweep Lockbox",
        cashAndLiquidity: "$3.0 億 - $5.1 億美元現金；持有 35,577 顆比特幣 (總流動性 >$25 億)",
        fullyDilutedShares: "4.363 億股 (基本加權 3.485 億 + 可轉債完全稀釋)",
        atmRemainingCapacity: "$20 億 ATM 增發計畫已用約 $3.5 億，剩餘近 $16.8 億額度 (模型建議 5%-10% 稀釋折價)"
      },
      codMilestones: [
        { period: "2026 H2", billableMw: "505 MW", sites: "Long Ridge CCGT 燃氣發電廠交割", category: "電網銷售 (76% 長約覆蓋)", note: "即刻為集團挹注每年約 $144M 年化調整後 EBITDA" },
        { period: "2027 H1", billableMw: "505 MW", sites: "Hannibal 園區首期 200 MW AI 機房破土動工", category: "AI / Critical IT 專屬機房工程", note: "基樁工程與長交期變壓器進場；Starwood JV 推進專案債與招租" },
        { period: "2028 年中", billableMw: "705 MW", sites: "Hannibal 首批 200 MW AI 機房通電商轉", category: "AI / Critical IT 計費容量", note: "基礎設施年化營收 Run-Rate 達 $340M-$400M，增加 $180M-$220M EBITDA" },
        { period: "2029-2030", billableMw: "1,105 MW", sites: "Hannibal 擴建至 600 MW AI 負載", category: "超大規模 AI 園區 (累積破 1 GW)", note: "基建年化營收突破 $850M-$1.0B，NOI 正式超越自營比特幣挖礦" },
        { period: "2031+", billableMw: "1,500+ MW", sites: "全球算力與數位能源基地滿載", category: "數位能源垂直整合運算群", note: "年化基建營收規模挑戰 $1.7B - $2.0B" }
      ],
      fcfBreakevenPoint: "預估營運自由現金流 (FCF) 於 2028 年 Q2~Q3 迎來結構性轉正 (受惠於首批 200 MW AI 託管容量通電起租，Starwood JV 現金股利常態回流覆蓋母公司費用與票息)",
      dcfDrivers: {
        wacc: { base: "7.5% - 8.5% (AI基建) / 13.0% - 16.0% (挖礦)", bull: "7.0% / 12.0%", bear: "9.0% / 18.0%", source: "SOTP 分部估值：AI 基建貼近 REITs，自營挖礦高貝塔" },
        terminalMultiple: { base: "16.0x - 20.0x (基建) / 3.0x - 4.5x (挖礦)", bull: "22.0x / 5.0x", bear: "14.0x / 2.5x", source: "反映受電權稀缺性溢價 vs 礦機折舊耗損" },
        starwoodJvNoiMargin: { base: "80.0%", bull: "85.0%", bear: "75.0%", source: "Starwood JV 指引與市場共識" },
        wholesaleLeaseRatePerKw: { base: "$150 / kW / 月 ($1.80M/MW/yr)", bull: "$160", bear: "$140", source: "市場共識同業基準 (Core Scientific / IREN)" },
        longRidgeEbitdaContribution: { base: "$144M / 年", bull: "$155M", bear: "$135M", source: "505 MW 複循環電廠 76% 長期合約保證" },
        quarterlyCashSga: { base: "$4,650 萬", bull: "$4,500 萬", bear: "$5,000 萬", source: "反映 15% 人力精簡後常態規模" },
        btcDirectPowerCost: { base: "$38,690 / BTC", bull: "$35,000", bear: "$42,000", source: "2026 Q2 申報加權電價 $0.04/kWh" },
        btcAllInCashCost: { base: "$69,616 / BTC", bull: "$62,000", bear: "$75,000", source: "含直接電費、現場 O&M 與常態現金 SG&A" },
        asicDepreciationYears: { base: "3 年 (直線法)", bull: "4 年", bear: "3 年", source: "SEC 10-K 會計政策 (原 5 年壓縮至 3 年)" },
        buildingDepreciationYears: { base: "20 年 (直線法)", bull: "25 年", bear: "15 年", source: "SEC 10-K 資料中心大廳與變電站" },
        fullyDilutedSharesCount: { base: "4.36 億股", bull: "3.90 億股", bear: "4.80 億股", source: "完全稀釋 436,271,805 股" },
        atmDilutionDiscount: { base: "5.0% - 10.0%", bull: "0.0%", bear: "15.0%", source: "$16.8 億未動用增發配額潛在折價" }
      }
    }
  },
  {
    ticker: "RIOT",
    name: "Riot Platforms, Inc.",
    exchange: "NASDAQ",
    modelCategory: "Wholesale",
    businessModel: "批發機房地主 (零 GPU 折舊，純收高額 NOI)",
    price: 16.71,
    shares: 295,
    marketCap: 6.271,
    netDebt: -180,
    ev: 6.091,
    beta: 3.91,
    targetPrice: 17.50,
    upside: 4.7,
    range52w: "$11.50 - $30.32",
    opMw: 1100,
    pipelineMw: 2500,
    contractedMw: 1151,
    hpcSplit: 45,
    evMw: 5.5,
    facilities: "德州 Rockdale AI 園區 (700 MW Gross / 241 IT MW)；德州 Corsicana (Project Ditto 1 GW 架構 / 910 IT MW 專用園區)",
    energization: "Rockdale: 700 MW 變電所全面運作；Corsicana: 400 MW 變電已通電，擴建推進中",
    cod: "Rockdale: AMD 25 MW 已商轉 (2026.11 點交 10 MW，2027.05 點交 15 MW)，Anthropic 2027 年底；Corsicana: 400 MW 於 2027.09、200 MW 於 2028.01、310 MW 於 2028.07",
    majorClients: "Anthropic (Frontier AI Lab), AMD",
    contracts: "Corsicana Ditto: 15年期 $28.0B (展期可達 $54.0B，年租金 $18 億，NOI 99%)；Rockdale: Anthropic 20年期 $9.1B (展期至 $16.1B) + AMD 50 MW",
    backlogValue: 37.1,
    backlogText: "$37.1B ~ $70.1B (Corsicana $28B + Rockdale $9.1B)",
    contractRatio: "1,151 MW 關鍵 IT 負載 100% 簽約售罄 (獲大摩 $5.73 億過渡融資)",
    yoy: 80,
    revenueHistory: [80, 95, 120, 145],
    capexHistory: [110, 150, 195, 240],
    latestEpsActual: 0.12,
    latestEpsEst: 0.09,
    epsSurprise: 33.3,
    colorBadge: "cyan"
  },
  {
    ticker: "WULF",
    name: "TeraWulf Inc.",
    exchange: "NASDAQ",
    modelCategory: "Wholesale",
    businessModel: "零碳水電/核電批發託管 (Google 信用支持，客戶自備晶片)",
    price: 11.37,
    shares: 395,
    marketCap: 4.491,
    netDebt: 210,
    ev: 4.701,
    beta: 3.25,
    targetPrice: 29.50,
    upside: 159.5,
    range52w: "$9.51 - $29.84",
    opMw: 340,
    pipelineMw: 1200,
    contractedMw: 360,
    hpcSplit: 83,
    evMw: 13.8,
    facilities: "紐約州 Lake Mariner (500 MW 零碳水電/核電直連園區)；肯塔基州 Muskie (規劃 200 MW)；Justified 基地 (401 MW 擴建)",
    energization: "Lake Mariner: 變電所 345 kV 直連運作中 (CB-1~3 滿載運作，CB-4/5 DLC 液冷擴建中)；Muskie: 推進電網併網審批",
    cod: "Lake Mariner: CB-3 (102 MW IT) 已商轉投產；CB-4/5 (258 MW IT) 預計 2026 Q4 至 2027 H1 陸續分期交付商轉",
    majorClients: "Fluidstack (獲 Google 信用擔保與認股支持), Anthropic",
    contracts: "Fluidstack: 15年期累計約 $6.7B 批發託管服務協議 (鎖定 360 MW IT 負載，Google 擔保 $1.73B 租金履約並持認股權)；Anthropic 401 MW 租賃意向協議",
    backlogValue: 6.7,
    backlogText: "$6.7B ~ $11.0B (Fluidstack $6.7B)",
    contractRatio: "100% 鎖定 Lake Mariner 360 MW 關鍵 IT 負載 (AI 營收佔比達 83%)",
    yoy: 145,
    revenueHistory: [42, 58, 85, 125],
    capexHistory: [55, 80, 115, 160],
    latestEpsActual: 0.12,
    latestEpsEst: 0.08,
    epsSurprise: 50.0,
    colorBadge: "emerald",
    // 深度微觀財務指標與估值拆解 (Deep Valuation & Unit Economics)
    deepValuation: {
      reportSource: "doc/draft/AI Data Center Project Updates.md",
      unitEconomics: {
        fluidstackRevenuePerMwYear: 1.86, // $M/MW/yr
        fluidstackUnitPricePerKwMonth: 155.00, // $/kW/month
        wholesaleBenchmarkMwYear: "1.80 - 2.10", // $M/MW/yr (市場基準)
        contractStructure: "15年期 Take-or-Pay 批發租賃 (Triple-Net / NNN)，由 Google 提供 $1.73B 信用擔保 (Credit Backstop)",
        rentEscalator: "固定 15 年期，具備年化 2.5% 通膨與營運成本指數化遞增條款",
        btcDirectElectricityCostPerBtc: "19,500 - 23,000", // $/BTC
        btcAllInCashCostPerBtc: "27,500 - 30,000", // $/BTC
        btcPowerTariff: "Lake Mariner 零碳水電/核電實質淨電價 0.032 - 0.035 $/kWh",
        btcHodlStrategy: "逐步壓降比特幣算力佔比，全面轉向高確定性 AI 機房租金現金流"
      },
      capexBreakdown: {
        tier3DlcBuildCostPerMw: "4.50 - 5.50", // $M/MW
        tier3DlcTotalInvestment: "1.6 - 2.0", // $B (Lake Mariner 全期 DLC 機房建設)
        retrofitDlcBuildCostPerMw: "2.20 - 3.00", // $M/MW (既有建物改造)
        googleCreditBackstop: 1.73, // $B (Google 信用履約擔保額度)
        projectDebtFinancing: 3.20, // $B (2025 年發行 7.75% 綠色專案優先債)
        externalNonDilutivePct: 90.0, // % (專案債+客戶信用覆蓋率)
        terawulfSelfFundedPct: 10.0 // %
      },
      marginsAndOpex: {
        wholesaleColocationNoiMargin: 88.5, // %
        aiCloudProjectEbitdaMargin: 82.0, // %
        realPowerCost: "0.034 $/kWh (91% 零碳水電與核電混合)",
        annualizedNoiContribution: "$670M / 年 (滿載 360 MW IT 規模)"
      },
      depreciationPolicy: {
        buildingDepreciationYears: 30,
        coolingAndPowerYears: 20,
        miningRigDepreciationYears: 3
      },
      capitalStructure: {
        cashAndEquivalents: 0.18, // $B
        totalDebt: 0.39, // $B
        convertibleNotesCoupon: "2.75%",
        marketCap: 4.49, // $B
        dilutedShares: 395 // M
      },
      codMilestones: [
        { period: "2025 Q4", billableMw: "102 MW", sites: "Lake Mariner CB-3", category: "Commercial", note: "首期 102 MW IT 負載正式通電商轉，交付 Fluidstack" },
        { period: "2026 Q2", billableMw: "128 MW", sites: "Lake Mariner CB-4", category: "Testing", note: "第二期 128 MW DLC 高密度機房調試並啟動分期點交" },
        { period: "2026 Q4", billableMw: "130 MW", sites: "Lake Mariner CB-5", category: "Construction", note: "第三期 130 MW 液冷擴建滿載交付，達成 360 MW 全面商轉" },
        { period: "2027 H1", billableMw: "401 MW", sites: "Justified 園區", category: "Planning", note: "Anthropic 401 MW 超大型園區首期工程破土開工" }
      ],
      dcfDrivers: {
        wacc: { base: "8.5%", bull: "7.8%", bear: "9.8%", source: "Google 信用擔保顯著壓降折現率與融資成本" },
        terminalMultiple: { base: "18.0x", bull: "22.0x", bear: "14.0x", source: "對標數位基礎設施 REIT 退出倍數 (Equinix / Digital Realty)" },
        fluidstackLeaseRatePerKw: { base: "$155", bull: "$175", bear: "$135", source: "15 年期 NNN 長期批發託管平均月租金" },
        googleCreditGuaranteeAmount: { base: "$1.73B", bull: "$2.50B", bear: "$1.20B", source: "Google 提供之流動性與最低租金收繳法定擔保額度" }
      }
    }
  },
  {
    ticker: "APLD",
    name: "Applied Digital Corporation",
    exchange: "NASDAQ",
    modelCategory: "Turnkey",
    businessModel: "代工託管 Turnkey (Macquarie $5B 融資支持，CoreWeave 旗艦租戶)",
    price: 15.73,
    shares: 298,
    marketCap: 4.688,
    netDebt: 320,
    ev: 5.008,
    beta: 3.40,
    targetPrice: 58.00,
    upside: 268.7,
    range52w: "$13.12 - $50.73",
    opMw: 500,
    pipelineMw: 1400,
    contractedMw: 400,
    hpcSplit: 70,
    evMw: 10.0,
    facilities: "北達科他州 Ellendale (Polaris Forge 1 旗艦 AI 園區 1 GW)；北達科他 Jamestown (100 MW)；德州與猶他州儲備基地",
    energization: "Jamestown: 100 MW 變電所全面運作中；Ellendale: 變電所分期帶電完成，400 MW 專用輸電架構就位",
    cod: "Ellendale: 首期 100 MW 已點交調試，2026 年逐季交付 300 MW 至 400 MW 全面商轉投產",
    majorClients: "CoreWeave (AI Hyperscaler 獨家旗艦), NVIDIA (戰略注資), Macquarie Asset Management",
    contracts: "CoreWeave: 15年期雙合約累計高達 $11.0B (承租 400 MW 關鍵 IT 負載)；Macquarie: $5.0 億永續特別股融資機制",
    backlogValue: 11.0,
    backlogText: "$11.0B (CoreWeave 400 MW)",
    contractRatio: "100% 鎖定 Ellendale 400 MW 產能 (獲 CoreWeave 預付與租金保障)",
    yoy: 135,
    revenueHistory: [48, 62, 88, 130],
    capexHistory: [65, 95, 140, 210],
    latestEpsActual: 0.10,
    latestEpsEst: 0.06,
    epsSurprise: 66.7,
    colorBadge: "indigo",
    // 深度微觀財務指標與估值拆解 (Deep Valuation & Unit Economics)
    deepValuation: {
      reportSource: "doc/draft/AI Data Center Project Updates.md",
      unitEconomics: {
        coreweaveRevenuePerMwYear: 1.83, // $M/MW/yr
        coreweaveUnitPricePerKwMonth: 152.78, // $/kW/month
        wholesaleBenchmarkMwYear: "1.80 - 2.10", // $M/MW/yr (市場基準)
        contractStructure: "15年期 Take-or-Pay 託管代工合約 (Turnkey Colocation)，CoreWeave 負責伺服器硬體投入",
        rentEscalator: "15年固定基礎租金，附帶每 3 年 3.0% 之階梯式調升條款",
        btcDirectElectricityCostPerBtc: "21,000 - 24,500", // $/BTC
        btcAllInCashCostPerBtc: "29,000 - 32,000", // $/BTC
        btcPowerTariff: "北達科他州風力與電網低成本混合電價 0.035 - 0.038 $/kWh",
        btcHodlStrategy: "全面將傳統託管礦場升級為高效能 HPC 機房，徹底脫離加密貨幣波動"
      },
      capexBreakdown: {
        tier3DlcBuildCostPerMw: "5.50 - 6.50", // $M/MW
        tier3DlcTotalInvestment: "2.2 - 2.6", // $B (Ellendale 400 MW DLC 總機房投資)
        macquarieFacilityAmount: 5.0, // $B (Macquarie 永續特別股融資額度)
        projectDebtFinancing: 2.20, // $B (資產層級專案抵押貸款)
        externalNonDilutivePct: 95.0, // % (Macquarie 融資大幅免除母公司股權稀釋)
        apldSelfFundedPct: 5.0 // %
      },
      marginsAndOpex: {
        wholesaleColocationNoiMargin: 85.0, // %
        aiCloudProjectEbitdaMargin: 80.5, // %
        realPowerCost: "0.036 $/kWh (低溫極寒氣候具備自然冷卻 PUE 1.15 優勢)",
        annualizedNoiContribution: "$730M / 年 (400 MW CoreWeave 滿載)"
      },
      depreciationPolicy: {
        buildingDepreciationYears: 30,
        coolingAndPowerYears: 20,
        miningRigDepreciationYears: 3
      },
      capitalStructure: {
        cashAndEquivalents: 0.15, // $B
        totalDebt: 0.47, // $B
        macquariePreferredEquity: 0.50, // $B
        marketCap: 4.69, // $B
        dilutedShares: 298 // M
      },
      codMilestones: [
        { period: "2025 Q4", billableMw: "100 MW", sites: "Ellendale Building 1", category: "Commercial", note: "首座 100 MW 機房完成電力測試並點交予 CoreWeave" },
        { period: "2026 Q2", billableMw: "150 MW", sites: "Ellendale Building 2", category: "Testing", note: "第二座 150 MW DLC 機房完成高壓變電驗收並開始部署" },
        { period: "2026 Q4", billableMw: "150 MW", sites: "Ellendale Building 3", category: "Construction", note: "第三期 150 MW 擴建交付，達成 CoreWeave 400 MW 全部履約" },
        { period: "2027 H1", billableMw: "600 MW", sites: "Polaris Forge 擴建", category: "Planning", note: "啟動 Polaris Forge 1 GW 後續 600 MW 新期別規劃與招商" }
      ],
      dcfDrivers: {
        wacc: { base: "8.8%", bull: "8.0%", bear: "10.2%", source: "Macquarie 特別股注資降低財務槓桿壓力" },
        terminalMultiple: { base: "17.5x", bull: "21.0x", bear: "13.5x", source: "對標北美超大規模數據中心運營商 (Wholesale Data Center Multiples)" },
        coreweaveLeaseRatePerKw: { base: "$152", bull: "$170", bear: "$130", source: "CoreWeave 15 年期 400 MW 批發託管綜合月租金" },
        macquariePreferredFinancing: { base: "$5.0B", bull: "$5.0B", bear: "$3.5B", source: "Macquarie Asset Management 承諾之專案級別永續融資" }
      }
    }
  }
];

// 掛載至全域 window 物件
if (typeof window !== 'undefined') {
  window.DEFAULT_MINERS_DATA = DEFAULT_MINERS_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_MINERS_DATA };
}
