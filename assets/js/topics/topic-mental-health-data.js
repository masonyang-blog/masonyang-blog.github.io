/**
 * assets/js/topics/topic-mental-health-data.js
 * 高效工作者心理健康與大腦復健專題資料庫 (Layer 1C Sub-Hub SSOT)
 * Zero-Build / Pure Vanilla JS UMD / SSOT Data Module
 */
(function (root) {
    const TOPIC_MENTAL_HEALTH_DATA = {
        topic: "topic-personal",
        sub_hub: "topic-mental-health-rehab",
        title: "高效工作者、交易者與研究員的心理健康保健提醒全景",
        quarter: "2026-Q4",
        generated_at: "2026-11-28",
        pillars: [
            { id: "all",          label: "全部專題文章",     short: "ALL" },
            { id: "overview",     label: "總覽路線圖",       short: "OVERVIEW" },
            { id: "neurobiology", label: "I. 神經生物學",    short: "NEUROBIOLOGY" },
            { id: "hardware",     label: "II. 硬體復健",     short: "HARDWARE REHAB" },
            { id: "identity",     label: "III. 心智重塑",    short: "IDENTITY & JOY" }
        ],
        macro_ledger: [
            {
                "id": "metric-kynurenine",
                "name": "犬尿氨酸路徑劫持風險",
                "current": "IDO 酵素活化",
                "baseline": "慢性發炎 → 喹啉酸神經毒性",
                "status": "triggered",
                "note": "發炎細胞因子奪走色胺酸合成血清素原料，導致大腦能源破產與快感缺失",
                "updated_at": "2026-11-24",
                "source_url": "../news/20261124-depression-neurobiology-inflammation-anhedonia.html"
            },
            {
                "id": "metric-bdnf-rehab",
                "name": "BDNF 神經可塑性三階段",
                "current": "代謝滅火 → 突觸再生",
                "baseline": "高劑量 EPA + Zone 2 有氧",
                "status": "normal",
                "note": "骨骼肌吸收 70%–80% 餐後葡萄糖，配合全黑睡眠重啟神經膠淋巴排毒",
                "updated_at": "2026-11-24",
                "source_url": "../news/20261124-brain-hardware-rehab-bdnf-workflow.html"
            },
            {
                "id": "metric-workflow-load",
                "name": "高功能認知負荷閾值",
                "current": "25+3 嵌入式節律",
                "baseline": "前額葉執行控制保護區",
                "status": "warning",
                "note": "「微笑憂鬱」常掩蓋隱蔽性認知下滑，需以低耗能工作流避免斷崖失能",
                "updated_at": "2026-11-24",
                "source_url": "../news/20261124-depression-neuro-rehab-guide.html"
            },
            {
                "id": "metric-anhedonia-calibration",
                "name": "Anhedonia 四階段感官校準",
                "current": "掌握感行為激活",
                "baseline": "感官喚醒 → 微光存摺 → 無利害創造",
                "status": "normal",
                "note": "以問題外化打破疾病認同，透過可控微型任務重建多巴胺 D2 受體敏感度",
                "updated_at": "2026-11-24",
                "source_url": "../news/20261124-mental-identity-rehab-anhedonia-recovery.html"
            }
        ],
        concepts: [
            {
                id: "kynurenine-pathway",
                code: "NEUROBIOLOGY",
                title: "犬尿氨酸路徑與 IDO 酵素劫持",
                desc: "當身體長期處於慢性發炎或高皮質醇狀態時，發炎細胞因子會過度活化 IDO 酵素，將原本用於合成血清素的色胺酸轉向犬尿氨酸路徑並產生具神經毒性的喹啉酸（Quinolinic Acid），造成前額葉抑制力下降與快感缺失。",
                threshold: "臨床警訊：高壓工作者出現持續 2 週以上的情緒扁平、晨重暮輕或無端憤怒發作"
            },
            {
                id: "smiling-depression",
                code: "HIGH-FUNCTIONING",
                title: "演化失配與微笑憂鬱 (Smiling Depression)",
                desc: "高功能個體擅長以理性與責任感代償情緒耗竭，外在仍維持高產出與社交禮貌，但內在已陷入慢性能源破產，極易在某個臨界壓力點出現「斷崖式失能」。",
                threshold: "介入原則：停止要求「靠意志力撐過去」，優先啟動生理硬體減負"
            },
            {
                id: "bdnf-neuroplasticity",
                code: "HARDWARE REHAB",
                title: "BDNF 神經施肥與三階段硬體修復",
                desc: "修復憂鬱大腦須遵循「代謝滅火 → 神經新生 → 迴路重塑」的生物學次序：先透過進食順序控糖與零光害睡眠清除發炎廢物，再以 Zone 2 有氧與高劑量 EPA 提升 BDNF，逆轉海馬迴萎縮。",
                threshold: "執行次序：先處理血糖波動與睡眠剝奪，再進行高強度認知訓練"
            },
            {
                id: "glymphatic-system",
                code: "SLEEP ARCHITECTURE",
                title: "神經膠淋巴系統 (Glymphatic System)",
                desc: "大腦在深層睡眠期間透過腦脊髓液沖刷代謝廢物與神經毒性蛋白。夜間微弱藍光或皮質醇過高會直接阻斷此排毒窗口，加劇隔日的腦霧與情緒脆弱度。",
                threshold: "硬體規範：睡前 90 分鐘降溫降光、維持全黑無光害睡眠環境"
            },
            {
                id: "problem-externalization",
                code: "IDENTITY RESHAPING",
                title: "敘事治療問題外化與觀察者自我",
                desc: "將「我是個無能的憂鬱症患者」重構為「我正經歷神經發炎導致的迴路低谷」，把疾病與核心自我剝離，以兩分鐘微小習慣為新身份投票，終止自我攻擊的內耗迴圈。",
                threshold: "心智切換：從「成就導向」轉向「價值導向」，降低單一績效挫敗的毀滅感"
            },
            {
                id: "anhedonia-four-stages",
                code: "DOPAMINE CALIBRATION",
                title: "快感缺失 (Anhedonia) 四階段復健",
                desc: "當多巴胺獎賞迴路鈍化時，強迫追求快樂反而加劇挫敗。須依序進行：喚醒基礎感官體感（島葉活化）、建立微光存摺（Glimmers）、以掌握感代替愉悅感的行為激活，最終透過數位斷食與無利害關係的創造重設多巴胺基線。",
                threshold: "實戰檢核：不以「今天開不開心」評估進度，改以「是否完成一個可控微任務」為準"
            }
        ],
        articles: [
            {
                id: "20261124-depression-neuro-rehab-guide",
                pillar: "overview",
                dimension: "0",
                category: "隨筆與跨界觀察",
                badge: "隨筆與跨界觀察",
                date: "2026-11-24",
                status: "verified",
                title: "【心理健康與大腦復健路線圖】從神經生物學到快樂重建：高效工作者的系統性自癒全景指南（三部曲總覽）",
                url: "../news/20261124-depression-neuro-rehab-guide.html",
                core_conclusion: "整合高效工作者心理健康與大腦復健三部曲，建立「臨床鑑別 → 硬體代謝 → 心智重塑」的系統性自癒架構，協助讀者依自身狀態精準定位切入點。",
                indicators: [
                    { label: "系列定位", value: "三部曲總覽" },
                    { label: "核心架構", value: "鑑別→硬體→心智" },
                    { label: "篇幅規模", value: "11,442 字" }
                ],
                h2_pillars: [
                    { id: "第一章-基礎鑑別與臨床分級", title: "基礎鑑別：憂鬱情緒 vs. 臨床憂鬱症" },
                    { id: "第三章-大腦硬體復健與日常介入工程", title: "硬體復健與心智重塑分流導覽" }
                ]
            },
            {
                id: "20261124-depression-neurobiology-inflammation-anhedonia",
                pillar: "neurobiology",
                dimension: "I",
                category: "隨筆與跨界觀察",
                badge: "隨筆與跨界觀察",
                date: "2026-11-24",
                status: "verified",
                title: "【憂鬱症神經生物學解密】慢性發炎如何劫持大腦快樂迴路？解構犬尿氨酸路徑與三大病理循環",
                url: "../news/20261124-depression-neurobiology-inflammation-anhedonia.html",
                core_conclusion: "解構臨床憂鬱症並非抗壓性不足，而是發炎細胞因子活化 IDO 酵素、劫持色胺酸轉化為神經毒性喹啉酸的系統性失調，並剖析高功能者「微笑憂鬱」與斷崖失能機制。",
                indicators: [
                    { label: "核心機制", value: "犬尿氨酸路徑" },
                    { label: "病理模型", value: "三大病理循環" },
                    { label: "篇幅規模", value: "10,303 字" }
                ],
                h2_pillars: [
                    { id: "第一部-基礎鑑別與臨床分級", title: "憂鬱情緒 vs. 憂鬱症四道分水嶺與憤怒發作" },
                    { id: "第二部-生理與神經生物學底層機制", title: "IDO 酵素劫持、演化失配與微笑憂鬱" }
                ]
            },
            {
                id: "20261124-brain-hardware-rehab-bdnf-workflow",
                pillar: "hardware",
                dimension: "II",
                category: "隨筆與跨界觀察",
                badge: "隨筆與跨界觀察",
                date: "2026-11-24",
                status: "verified",
                title: "【大腦硬體復健工程】代謝滅火如何逆轉海馬迴萎縮？解構 BDNF 施肥三階段與嵌入式工作流",
                url: "../news/20261124-brain-hardware-rehab-bdnf-workflow.html",
                core_conclusion: "依循「先降發炎、再長突觸、最後鍛鍊控制力」生物學次序，結合進食順序控糖、全黑睡眠排毒、高劑量 EPA 與 Zone 2 有氧，以及 25+3 嵌入式低耗能工作流重建前額葉執行力。",
                indicators: [
                    { label: "修復次序", value: "代謝→新生→重塑" },
                    { label: "關鍵分子", value: "BDNF / GLUT4" },
                    { label: "篇幅規模", value: "10,808 字" }
                ],
                h2_pillars: [
                    { id: "第一部-代謝滅火-抗發炎飲食與神經膠淋巴睡眠重構", title: "進食控糖、抗發炎營養與神經膠淋巴睡眠" },
                    { id: "第三部-嵌入式工作流-低耗能高產出的認知防護網", title: "25+3 節律與辦公桌微循環微環境配置" }
                ]
            },
            {
                id: "20261124-mental-identity-rehab-anhedonia-recovery",
                pillar: "identity",
                dimension: "III",
                category: "隨筆與跨界觀察",
                badge: "隨筆與跨界觀察",
                date: "2026-11-24",
                status: "verified",
                title: "【心理身份重塑與快樂重建】問題外化如何打破疾病認同？解構高功能陪伴與四階段感官校準",
                url: "../news/20261124-mental-identity-rehab-anhedonia-recovery.html",
                core_conclusion: "當發炎平息後進入心智軟體重構：以問題外化與兩分鐘微習慣打破疾病認同，拆解高功能者安全陪伴對話原則，並依四階段感官校準與掌握感行為激活重啟多巴胺基線。",
                indicators: [
                    { label: "認知解離", value: "問題外化 + 微習慣" },
                    { label: "獎賞重建", value: "Anhedonia 四階段" },
                    { label: "篇幅規模", value: "10,804 字" }
                ],
                h2_pillars: [
                    { id: "第一部-心理身份重塑-打破-我等於疾病-的認知枷鎖", title: "問題外化、價值觀轉移與兩分鐘微習慣" },
                    { id: "第三部-重建獲得快樂的能力-anhedonia-四階段復健", title: "島葉喚醒、微光存摺與掌握感行為激活" }
                ]
            }
        ]
    };

    if (typeof module === 'object' && module.exports) {
        module.exports = TOPIC_MENTAL_HEALTH_DATA;
    } else {
        root.TOPIC_MENTAL_HEALTH_DATA = TOPIC_MENTAL_HEALTH_DATA;
    }
}(typeof window !== 'undefined' ? window : this));
