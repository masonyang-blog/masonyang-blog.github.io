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
    price: 1.50,
    shares: 168,
    marketCap: 0.252,
    netDebt: -45,
    ev: 0.207,
    beta: 3.42,
    targetPrice: 3.20,
    upside: 113.3,
    range52w: "$1.20 - $3.85",
    opMw: 210,
    pipelineMw: 288,
    contractedMw: 50,
    hpcSplit: 55,
    evMw: 4.2,
    facilities: "蒙特婁 MTL-2/3 (自有/租賃機房改造)；北卡 Greensboro NC-1 (收購舊廠房)",
    energization: "MTL-2/3: 2025 Q4 已接入水電；NC-1: 2025 年底完成驗收",
    cod: "MTL-2/3: 2025 Q4 投產；NC-1: 2026 Q1 商轉 24 MW",
    majorClients: "Boosteroid, DNA Fund, 企業 AI 私有雲客戶",
    contracts: "Boosteroid: 5年 $700M+；DNA Fund: 25個月 $20.2M (576顆 H200)；企業客戶: 18個月 $15M/年",
    backlogValue: 0.74,
    backlogText: "$740M+",
    contractRatio: "~100% 早期產能已售",
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
    price: 15.49,
    shares: 315,
    marketCap: 4.879,
    netDebt: 85,
    ev: 4.964,
    beta: 3.65,
    targetPrice: 20.00,
    upside: 29.1,
    range52w: "$2.65 - $17.80",
    opMw: 540,
    pipelineMw: 3400,
    contractedMw: 516,
    hpcSplit: 35,
    evMw: 7.2,
    facilities: "西德州 Wink Black Pearl (100% 自有園區)；西德州 Barber Lake (300 MW 自有基地)",
    energization: "Black Pearl: 2025 年底已帶電 (345kV)；Barber Lake: 預計 2026 Q4 通電",
    cod: "Data Hall 1: 2026.10.01 起租；逐月交付至 2027.03 全期滿載；Barber Lake: 2027 H1",
    majorClients: "AWS (Amazon), Fluidstack, Google",
    contracts: "AWS (Amazon): 15年 $5.5B (承租 216 IT MW)；Fluidstack / Google: 10–20年 $3.8B~$9.0B (Google 擔保 $1.73B)",
    backlogValue: 9.3,
    backlogText: "$9.3B ~ $14.5B",
    contractRatio: "100% 鎖定 (600 MW 已售出)",
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
    price: 13.05,
    shares: 245,
    marketCap: 3.197,
    netDebt: 110,
    ev: 3.307,
    beta: 3.72,
    targetPrice: 21.50,
    upside: 64.8,
    range52w: "$7.20 - $24.80",
    opMw: 680,
    pipelineMw: 1300,
    contractedMw: 250,
    hpcSplit: 25,
    evMw: 6.8,
    facilities: "德州休士頓 Austin County (271英畝自有地)；喬治亞 Sandersville 擴建 122 英畝",
    energization: "Sandersville: 現有 250 MW 已通電；Austin County: 2026 H2~2027 Q1 通電",
    cod: "Austin P1 (>200MW): 2027 H1；Sandersville AI 大廳: 2027 年 12 月；全面滿載: 2028 年",
    majorClients: "大型 CSP 意向夥伴 (喬治亞 20 年期 NNN 長約)",
    contracts: "Sandersville 園區簽署 20 年期 NNN $6.6B 租賃承諾；德州保留 885 MW 儲備等待整批出租",
    backlogValue: 6.6,
    backlogText: "$6.6B (意向承諾)",
    contractRatio: "約 30% 簽約鎖定 / 70% 儲備中",
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
    price: 16.70,
    shares: 275,
    marketCap: 4.593,
    netDebt: 390,
    ev: 4.983,
    beta: 3.10,
    targetPrice: 22.50,
    upside: 34.7,
    range52w: "$3.10 - $18.90",
    opMw: 1250,
    pipelineMw: 1250,
    contractedMw: 590,
    hpcSplit: 70,
    evMw: 9.2,
    facilities: "北卡 Marble (65 MW 轉型機房)；德州 Denton & Pecos 等 8 大營運基地",
    energization: "Duke / ERCOT 高壓變電站已就位，配合機房液冷改裝滾動切換",
    cod: "Marble: 2026.05 已正式移交；Denton/Pecos: 2026 全年逐月移交；2026 年底 590 MW 全數交付",
    majorClients: "CoreWeave (獲 12 年深度主合約)",
    contracts: "CoreWeave: 12年主約累計 $10.2B (鎖定 590 MW 關鍵 IT 負載，年貢獻 ~$8.5B 現金流)",
    backlogValue: 10.2,
    backlogText: "$10.2B (102 億美元)",
    contractRatio: "100% 鎖定在手 590 MW 改裝容量",
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
    price: 2.94,
    shares: 118,
    marketCap: 0.347,
    netDebt: -15,
    ev: 0.332,
    beta: 3.35,
    targetPrice: 5.20,
    upside: 76.9,
    range52w: "$1.80 - $5.50",
    opMw: 180,
    pipelineMw: 540,
    contractedMw: 100,
    hpcSplit: 60,
    evMw: 5.5,
    facilities: "巴拉圭 Yguazú Phase 3 (Itaipu 水電直供)；瑞典 Boden 自有低溫液冷數據中心",
    energization: "Boden: Nord Pool 綠電已通電；Yguazú P3: 2026 Q2 高壓引流測試",
    cod: "Yguazú P3: 2026 年 8~9 月 (Q3)；全集團突破 540 MW；Boden HPC 持續上線",
    majorClients: "機構投資級客戶長約, BUZZ HPC, HIVE Cloud 開源雲",
    contracts: "機構投資級客戶簽署 $3.5B 雲端長約；BUZZ HPC / HIVE Cloud 開源社群隨選與預留實例",
    backlogValue: 0.35,
    backlogText: "$350M+ (含雲端池)",
    contractRatio: "約 60% 算力簽約 / 40% 雲端零售",
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
    price: 90.23,
    shares: 112,
    marketCap: 10.106,
    netDebt: 220,
    ev: 10.326,
    beta: 3.58,
    targetPrice: 115.00,
    upside: 27.5,
    range52w: "$7.50 - $96.40",
    opMw: 1070,
    pipelineMw: 8660,
    contractedMw: 949,
    hpcSplit: 65,
    evMw: 11.5,
    facilities: "路易斯安那 River Bend (330 MW 綠地園區)；德州 Nueces Beacon Point (1,000 MW 旗艦基地)",
    energization: "River Bend: 2026 Q4 變電所通電；Beacon Point: 2027 Q1 AEP 1GW 通電",
    cod: "River Bend: 2027 Q2 首期起租；Beacon Point: 2027 Q3 首座大廳 (352 MW IT) 交付",
    majorClients: "超大規模科技巨頭 (Hyperscalers), Coatue 戰略夥伴",
    contracts: "超大規模科技巨頭簽訂 949 MW IT 租約，總額達 $26.6B；Coatue 提供 $150M 戰略融資",
    backlogValue: 26.6,
    backlogText: "$26.6B (266 億美元)",
    contractRatio: "71% 興建中容量已售出 (949/1,330 MW)",
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
    price: 42.79,
    shares: 195,
    marketCap: 8.344,
    netDebt: 140,
    ev: 8.484,
    beta: 4.15,
    targetPrice: 55.00,
    upside: 28.5,
    range52w: "$3.80 - $48.20",
    opMw: 510,
    pipelineMw: 2100,
    contractedMw: 260,
    hpcSplit: 50,
    evMw: 8.5,
    facilities: "西德州 Sweetwater 1 & 2 (自有數百英畝)；奧克拉荷馬 1.6 GW 新基地",
    energization: "Sweetwater 1: 2026.05.01 已正式通電 (345kV ERCOT 直連，進度領先同業)",
    cod: "Horizon 1: 2026 Q3 交付微軟；Sweetwater 機房: 2026 Q4~2027 H1；奧克拉荷馬: 2027+",
    majorClients: "微軟 (Microsoft), NVIDIA, Dell",
    contracts: "微軟 (Microsoft): 5年 $9.7B (200 MW IT，預付 20%)；NVIDIA: 5年 $3.4B (Blackwell 叢集)；Dell 採購 $5.8B (50k+ B300)",
    backlogValue: 13.1,
    backlogText: "$13.1B+ (131 億美元)",
    contractRatio: "已售出與鎖定合約達 $13.1B+",
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
    price: 11.40,
    shares: 310,
    marketCap: 3.534,
    netDebt: 850,
    ev: 4.384,
    beta: 3.80,
    targetPrice: 17.50,
    upside: 53.5,
    range52w: "$7.50 - $27.00",
    opMw: 1400,
    pipelineMw: 1400,
    contractedMw: 100,
    hpcSplit: 20,
    evMw: 5.8,
    facilities: "俄亥俄 Long Ridge (500 MW 氣電表後土地)；Starwood SDV 多處合資基地",
    energization: "Long Ridge: 表後直連已就位 (繞過公用電網排隊)；SDV: 審批推進中",
    cod: "Long Ridge 推論: 2026 H2；SDV 首期 (200 MW): 2027 H1；全期 1.0~2.5 GW 分期至 2028",
    majorClients: "Starwood Capital 合資地產基金",
    contracts: "Starwood Capital 合資案共同開發 1.0~2.5 GW (Starwood 出資招租，MARA 分潤土地電力)",
    backlogValue: 0.10,
    backlogText: "合資分潤制 (浮動分成)",
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
    price: 20.61,
    shares: 295,
    marketCap: 6.080,
    netDebt: -180,
    ev: 5.900,
    beta: 3.55,
    targetPrice: 26.00,
    upside: 26.2,
    range52w: "$6.20 - $21.50",
    opMw: 1100,
    pipelineMw: 1800,
    contractedMw: 241,
    hpcSplit: 30,
    evMw: 7.0,
    facilities: "德州 Rockdale (700 MW 現有廠房切割)；德州 Corsicana (858 英畝 Project Ditto 33.5萬呎機房)",
    energization: "Rockdale: 700 MW 變電所已通電；Corsicana: 400 MW 已通電，1 GW 變電架構完備",
    cod: "AMD 50 MW: 2026.01 已商轉；Anthropic P1 (96 MW): 2027.12；Anthropic P2 (95 MW): 2028.06；Ditto: 2028",
    majorClients: "Anthropic, AMD",
    contracts: "Anthropic: 20年 $9.1B~$16.1B (承租 191 MW IT，預估 NOI $7.3B~$8.2B)；AMD 50 MW 測試中心",
    backlogValue: 16.1,
    backlogText: "$9.1B ~ $16.1B",
    contractRatio: "100% 鎖定 Rockdale AI 算力 (241 MW)",
    yoy: 80,
    revenueHistory: [80, 95, 120, 145],
    capexHistory: [110, 150, 195, 240],
    latestEpsActual: 0.12,
    latestEpsEst: 0.09,
    epsSurprise: 33.3,
    colorBadge: "cyan"
  }
];

// 掛載至全域 window 物件
if (typeof window !== 'undefined') {
  window.DEFAULT_MINERS_DATA = DEFAULT_MINERS_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_MINERS_DATA };
}
