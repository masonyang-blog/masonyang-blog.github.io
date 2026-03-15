// generate-mandala-html.js
// Node.js script to extract data from bitcoin-mandala-data.js and generate static HTML

const fs = require('fs');
const path = require('path');

// 1. Setup mock environment so the browser JS file can load
global.window = {};

// 2. Path to the data file
const dataFilePath = path.join(__dirname, '../assets/js/bitcoin-mandala-data.js');

try {
    // 3. Read and evaluate the data file in the current context
    const dataFileContent = fs.readFileSync(dataFilePath, 'utf8');
    eval(dataFileContent); // This will populate global.window.bitcoinMandalaData
    
    const data = global.window.bitcoinMandalaData;

    if (!data || !data.factors) {
        throw new Error("Could not parse bitcoinMandalaData from file.");
    }

    // 4. Generate HTML String
    let htmlOutput = `
<section id="mandala-factors" class="my-16 container mx-auto px-4">
    <div class="mb-12 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">影響比特幣價格的 8 大核心維度與 64 個關鍵指標</h2>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            為了提供最完整的分析視角，我們將比特幣的價值驅動力拆解為以下 8 個宏觀維度，並深入解析 64 個微觀因子。
            （點擊曼陀羅圖表可快速導航至對應內容）
        </p>
    </div>
    
    <div class="space-y-16">
`;

    data.factors.forEach((factor, factorIndex) => {
        htmlOutput += `
        <!-- === ${factor.title} === -->
        <div id="factor-${factor.id}" class="factor-group scroll-mt-24">
            <div class="mb-8 border-l-4 pl-4" style="border-color: ${factor.color || '#eab308'}">
                <h3 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    ${factor.title}
                </h3>
                <p class="mt-2 text-lg text-slate-600 dark:text-slate-400 font-medium">
                    核心聚焦：${factor.focus}
                </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
`;
        
        if (factor.subFactors) {
            factor.subFactors.forEach(sub => {
                htmlOutput += `
                <!-- Sub-factor: ${sub.id} -->
                <div id="factor-${sub.id}" class="sub-factor-card scroll-mt-24 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                    <h4 class="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
                        ${sub.title}
                    </h4>
                    <div class="prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                        ${sub.content}
                    </div>
                </div>
`;
            });
        }

        htmlOutput += `
            </div>
        </div>
`;
    });

    htmlOutput += `
    </div>
</section>
`;

    // 5. Output the result
    const outputFilePath = path.join(__dirname, '../doc/generated/mandala-static.html');
    
    // Ensure dir exists
    const outputDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFilePath, htmlOutput.trim(), 'utf8');
    console.log(`✅ Success! Static HTML generated at: ${outputFilePath}`);

} catch (error) {
    console.error("❌ Error generating HTML:", error);
}
