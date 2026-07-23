/**
 * Articles Spreadsheet Component - Shadow DOM 封裝
 * @class ArticlesSpreadsheetComponent
 * @description 呈現全站結構化文章資訊的試算表與多維度過濾器，支援 URL 狀態記憶、行內關鍵字聯動、一鍵重設與三模匯出
 */
(function (global) {
    "use strict";

    class ArticlesSpreadsheetComponent {
        constructor(hostElement) {
            this.hostElement = hostElement || document.querySelector('#spreadsheet-host');
            if (!this.hostElement) {
                console.warn('ArticlesSpreadsheetComponent: Host element not found.');
                return;
            }
            this.shadowRoot = this.hostElement.attachShadow({ mode: "closed" });

            this._config = { debug: false };

            this._state = {
                articles: [],
                filtered: [],
                categories: {},
                tags: {},
                series: {},
                years: [],
                allKeywords: [],
                
                filter: {
                    category: 'all',
                    tag: 'all',
                    series: 'all',
                    year: 'all',
                    keyword: 'all',
                    query: ''
                },

                visibleColumns: {
                    id: false,
                    published: true,
                    category: true,
                    tag: true,
                    series: true,
                    title: true,
                    summary: true,
                    keywords: true
                },

                sort: {
                    field: 'published',
                    direction: 'DESC'
                }
            };

            this._debounceTimer = null;
        }

        init() {
            if (this._config.debug) console.log("ArticlesSpreadsheetComponent: Initializing...");
            this.createStyles();
            this.createContent();
            this.loadData();
            return this;
        }

        loadData() {
            if (this._config.debug) console.log("ArticlesSpreadsheetComponent: Loading data...");

            const config = window.BLOG_CONFIG || {};
            this._state.categories = config.CATEGORIES || {};
            this._state.tags = config.TAGS || {};
            this._state.series = config.SERIES || {};

            const getCategoryObj = (id) => (window.TaxonomyConfig && window.TaxonomyConfig.getCategory ? window.TaxonomyConfig.getCategory(id) : { text: this._state.categories[id]?.name || id || '-' });
            const getTagObj = (id) => (window.TaxonomyConfig && window.TaxonomyConfig.getTag ? window.TaxonomyConfig.getTag(id) : { text: this._state.tags[id]?.name || id || '-' });
            const getSeriesObj = (id) => (window.TaxonomyConfig && window.TaxonomyConfig.getSeries ? window.TaxonomyConfig.getSeries(id) : { text: this._state.series[id]?.title || id || '-' });

            const repoPromise = (window.ArticleRepository && window.ArticleRepository.loadAllDetails)
                ? window.ArticleRepository.loadAllDetails()
                : Promise.resolve(window.ArticleRepository && window.ArticleRepository.all ? window.ArticleRepository.all : []);

            repoPromise.then(repo => {
                if (!repo || repo.length === 0) {
                    console.warn("ArticlesSpreadsheetComponent: ArticleRepository.all is empty.");
                    this.container.innerHTML = `<div class="p-4 text-red-600 bg-red-50 rounded-lg font-semibold">無法載入文章資料庫。請確保 core-articles-data.js 與 core-taxonomy.js 已引入。</div>`;
                    return;
                }

                const yearsSet = new Set();
                const keywordsMap = {};

                const normalizedArticles = repo.map(item => {
                    const year = item.published ? item.published.substring(0, 4) : '未知';
                    if (year && year !== '未知') {
                        yearsSet.add(year);
                    }

                    const catObj = getCategoryObj(item.category);
                    
                    // 支援多標籤 tags
                    const tagsList = item.tags && Array.isArray(item.tags) ? item.tags : (item.tag ? [item.tag] : []);
                    const tagNames = tagsList.map(t => getTagObj(t).text || t);
                    const tagsDisplay = tagNames.join(', ');

                    const seriesObj = getSeriesObj(item.series);

                    const kws = [];
                    if (item.keywords) {
                        item.keywords.split(/[,\/、;；]/).forEach(w => {
                            const clean = w.trim();
                            if (clean && clean.length > 1) kws.push(clean);
                        });
                    }
                    if (item.mentions && Array.isArray(item.mentions)) {
                        item.mentions.forEach(m => {
                            if (m.name) {
                                const clean = m.name.replace(/\s*\(.*?\)\s*/g, '').trim();
                                if (clean && clean.length > 1) kws.push(clean);
                            }
                        });
                    }
                    const uniqueKws = Array.from(new Set(kws));
                    uniqueKws.forEach(kw => {
                        keywordsMap[kw] = (keywordsMap[kw] || 0) + 1;
                    });

                    return {
                        ...item,
                        year: year,
                        parsedKeywords: uniqueKws,
                        categoryName: catObj.text || item.category || '-',
                        tagName: tagsDisplay || '-',
                        tagsList: tagsList,
                        seriesName: seriesObj.text || item.series || '-'
                    };
                });

                this._state.years = Array.from(yearsSet).sort().reverse();
                this._state.allKeywords = Object.entries(keywordsMap)
                    .sort((a, b) => b[1] - a[1])
                    .map(e => ({ name: e[0], count: e[1] }));

                this._state.articles = normalizedArticles;
                this._state.filtered = [...normalizedArticles];

                if (this._config.debug) {
                    console.log(`ArticlesSpreadsheetComponent: Loaded ${normalizedArticles.length} articles.`);
                }

                this.readURLState();
                this.renderControls();
                this.filterData();
            });
        }

        getPathPrefix() {
            if (typeof window === 'undefined' || !window.location) return './';
            const path = window.location.pathname;
            if (path.includes('/post/') || path.includes('/knowledge/') || path.includes('/project/') || path.includes('/doc/') || path.includes('/news/')) {
                return '../';
            }
            return './';
        }

        readURLState() {
            if (typeof window === 'undefined' || !window.location) return;
            const params = new URLSearchParams(window.location.search);
            
            const q = params.get('q');
            const keyword = params.get('keyword');
            const year = params.get('year');
            const cat = params.get('cat');
            const tag = params.get('tag');
            const series = params.get('series');

            if (q !== null) this._state.filter.query = q;
            if (keyword !== null) this._state.filter.keyword = keyword;
            if (year !== null && this._state.years.includes(year)) this._state.filter.year = year;
            if (cat !== null && cat in this._state.categories) this._state.filter.category = cat;
            if (tag !== null && tag in this._state.tags) this._state.filter.tag = tag;
            if (series !== null && series in this._state.series) this._state.filter.series = series;
        }

        syncURLState() {
            if (typeof window === 'undefined' || !window.history || !window.location) return;
            const params = new URLSearchParams();
            const f = this._state.filter;

            if (f.query.trim()) params.set('q', f.query.trim());
            if (f.keyword !== 'all') params.set('keyword', f.keyword);
            if (f.year !== 'all') params.set('year', f.year);
            if (f.category !== 'all') params.set('cat', f.category);
            if (f.tag !== 'all') params.set('tag', f.tag);
            if (f.series !== 'all') params.set('series', f.series);

            const paramStr = params.toString();
            const newUrl = window.location.pathname + (paramStr ? '?' + paramStr : '');
            
            window.history.replaceState(null, '', newUrl);
        }

        filterData() {
            if (this._config.debug) console.log("ArticlesSpreadsheetComponent: Executing filter pipeline...");

            const { category, tag, series, year, keyword, query } = this._state.filter;
            const queryLower = query.toLowerCase().trim();

            this._state.filtered = this._state.articles.filter(item => {
                if (category !== 'all' && item.category !== category) return false;
                if (tag !== 'all' && !(item.tagsList && item.tagsList.includes(tag)) && item.tag !== tag) return false;
                if (series !== 'all' && item.series !== series) return false;
                if (year !== 'all' && item.year !== year) return false;
                if (keyword !== 'all' && !item.parsedKeywords.includes(keyword)) return false;

                if (queryLower) {
                    const title = (item.title || '').toLowerCase();
                    const desc = (item.desc || '').toLowerCase();
                    const keywordsStr = (item.keywords || '').toLowerCase();
                    const summary = (item.summary || '').toLowerCase();
                    if (!title.includes(queryLower) && !desc.includes(queryLower) && !keywordsStr.includes(queryLower) && !summary.includes(queryLower)) {
                        return false;
                    }
                }
                return true;
            });

            this.syncURLState();
            this.sortData();
        }

        sortData() {
            const { field, direction } = this._state.sort;
            const mult = direction === 'ASC' ? 1 : -1;

            this._state.filtered.sort((a, b) => {
                let valA = a[field] || '';
                let valB = b[field] || '';

                if (field === 'published') {
                    const timeA = valA ? new Date(valA).getTime() : 0;
                    const timeB = valB ? new Date(valB).getTime() : 0;
                    return (timeA - timeB) * mult;
                }

                return valA.toString().localeCompare(valB.toString(), 'zh-TC') * mult;
            });

            this.renderTable();
        }

        sortBy(field) {
            if (this._state.sort.field === field) {
                this._state.sort.direction = this._state.sort.direction === 'ASC' ? 'DESC' : 'ASC';
            } else {
                this._state.sort.field = field;
                this._state.sort.direction = field === 'published' ? 'DESC' : 'ASC';
            }
            this.sortData();
        }

        toggleColumn(colName) {
            if (colName in this._state.visibleColumns) {
                this._state.visibleColumns[colName] = !this._state.visibleColumns[colName];
                this.renderTableHeader();
                this.renderTable();
            }
        }

        selectKeywordFromPill(kw) {
            const selectEl = this.shadowRoot.querySelector('#filter-keyword');
            if (selectEl) {
                let exists = false;
                for (let opt of selectEl.options) {
                    if (opt.value === kw) { exists = true; break; }
                }
                if (!exists) {
                    const newOpt = document.createElement('option');
                    newOpt.value = kw;
                    newOpt.textContent = `${kw} (1)`;
                    selectEl.appendChild(newOpt);
                }
                selectEl.value = kw;
            }

            this._state.filter.keyword = kw;
            this.filterData();
            this.showToast(`🔍 知識圖譜導航：已鎖定「#${kw}」相關文章`);
        }

        resetFilters() {
            if (this._config.debug) console.log("ArticlesSpreadsheetComponent: Resetting filters...");
            this._state.filter = {
                category: 'all',
                tag: 'all',
                series: 'all',
                year: 'all',
                keyword: 'all',
                query: ''
            };

            const search = this.shadowRoot.querySelector('#filter-search');
            const keywordSelect = this.shadowRoot.querySelector('#filter-keyword');
            const yearSelect = this.shadowRoot.querySelector('#filter-year');
            const catSelect = this.shadowRoot.querySelector('#filter-cat');
            const tagSelect = this.shadowRoot.querySelector('#filter-tag');
            const seriesSelect = this.shadowRoot.querySelector('#filter-series');

            if (search) search.value = '';
            if (keywordSelect) keywordSelect.value = 'all';
            if (yearSelect) yearSelect.value = 'all';
            if (catSelect) catSelect.value = 'all';
            if (tagSelect) tagSelect.value = 'all';
            if (seriesSelect) seriesSelect.value = 'all';

            this.filterData();
            this.showToast('🔄 已清除所有篩選條件，還原初始清單。');
        }

        escapeField(str) {
            if (str === null || str === undefined) return '';
            str = str.toString().trim();
            if (str.includes('"') || str.includes('\n') || str.includes('\r') || str.includes(',') || str.includes('\t')) {
                str = '"' + str.replace(/"/g, '""') + '"';
            }
            return str;
        }

        exportTSV() {
            const cols = ['ID', '發布日期', '文章分類', '標籤領域', '專題系列', '文章標題', 'TL;DR 摘要', '連結', '關鍵字'];
            let tsv = cols.join('\t') + '\n';

            this._state.filtered.forEach(item => {
                const linkFull = `https://masonyang-blog.github.io/${item.link || ''}`;
                const row = [
                    this.escapeField(item.id),
                    this.escapeField(item.published || '-'),
                    this.escapeField(item.categoryName || item.category || '-'),
                    this.escapeField(item.tagName || item.tag || '-'),
                    this.escapeField(item.seriesName || item.series || '-'),
                    this.escapeField(item.title || '-'),
                    this.escapeField(item.desc || item.summary || '-'),
                    this.escapeField(linkFull),
                    this.escapeField(item.keywords || '-')
                ];
                tsv += row.join('\t') + '\n';
            });

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(tsv).then(() => {
                    this.showToast('✅ 試算表 (TSV) 已成功複製！請至 Google Sheet 或 Excel 的 A1 儲存格按 Ctrl+V 貼上。');
                }).catch(err => {
                    console.error("ArticlesSpreadsheetComponent: Clipboard write failed", err);
                    this.showToast('❌ 剪貼簿寫入失敗，請手動選取表格複製。');
                });
            } else {
                this.showToast('⚠️ 瀏覽器不支援剪貼簿寫入，請手動反白表格複製。');
            }
        }

        exportCSV() {
            const cols = ['ID', '發布日期', '文章分類', '標籤領域', '專題系列', '文章標題', 'TL;DR 摘要', '連結', '關鍵字'];
            let csv = cols.map(c => `"${c}"`).join(',') + '\n';

            this._state.filtered.forEach(item => {
                const linkFull = `https://masonyang-blog.github.io/${item.link || ''}`;
                const row = [
                    this.escapeField(item.id),
                    this.escapeField(item.published || '-'),
                    this.escapeField(item.categoryName || item.category || '-'),
                    this.escapeField(item.tagName || item.tag || '-'),
                    this.escapeField(item.seriesName || item.series || '-'),
                    this.escapeField(item.title || '-'),
                    this.escapeField(item.desc || item.summary || '-'),
                    this.escapeField(linkFull),
                    this.escapeField(item.keywords || '-')
                ];
                csv += row.join(',') + '\n';
            });

            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `mason_articles_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.showToast('📥 CSV 檔案已成功下載！');
        }

        exportMarkdown() {
            const cols = ['發布日期', '文章分類', '標籤領域', '專題系列', '文章標題', '連結'];
            const sep = cols.map(() => ':---').join(' | ');
            let md = `| ${cols.join(' | ')} |\n| ${sep} |\n`;

            this._state.filtered.forEach(item => {
                const linkFull = `https://masonyang-blog.github.io/${item.link || ''}`;
                const cleanTitle = (item.title || '-').replace(/\|/g, '&#124;');
                const row = [
                    item.published || '-',
                    item.categoryName || item.category || '-',
                    item.tagName || item.tag || '-',
                    item.seriesName || item.series || '-',
                    cleanTitle,
                    `[檢視](${linkFull})`
                ];
                md += `| ${row.join(' | ')} |\n`;
            });

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(md).then(() => {
                    this.showToast('📋 Markdown 表格已成功複製！可直接貼上至 Notion 或筆記軟體。');
                }).catch(err => {
                    console.error("ArticlesSpreadsheetComponent: Clipboard write failed", err);
                    this.showToast('❌ 剪貼簿寫入失敗，請手動反白表格複製。');
                });
            } else {
                this.showToast('⚠️ 瀏覽器不支援剪貼簿寫入，請手動選取表格。');
            }
        }

        showToast(msg) {
            let toast = this.shadowRoot.querySelector('#spreadsheet-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'spreadsheet-toast';
                toast.style.cssText = 'position: fixed; bottom: 2rem; right: 2rem; background: #0f172a; color: #f8fafc; padding: 1rem 1.5rem; border-radius: 0.5rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); z-index: 9999; font-size: 0.875rem; font-weight: 600; border: 1px solid #334155; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; transform: translateY(1rem); opacity: 0;';
                this.shadowRoot.appendChild(toast);
            }
            toast.textContent = msg;
            toast.getBoundingClientRect();
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
            setTimeout(() => { 
                toast.style.transform = 'translateY(1rem)';
                toast.style.opacity = '0'; 
            }, 3500);
        }

        renderControls() {
            if (!this.container) return;

            const catOptions = Object.keys(this._state.categories).map(k => `<option value="${k}" ${this._state.filter.category === k ? 'selected':''}>${this._state.categories[k].name || k}</option>`).join('');
            const tagOptions = Object.keys(this._state.tags).map(k => `<option value="${k}" ${this._state.filter.tag === k ? 'selected':''}>#${this._state.tags[k].name || k}</option>`).join('');
            const seriesOptions = Object.keys(this._state.series).map(k => `<option value="${k}" ${this._state.filter.series === k ? 'selected':''}>${this._state.series[k].title || k}</option>`).join('');
            const yearOptions = this._state.years.map(y => `<option value="${y}" ${this._state.filter.year === y ? 'selected':''}>${y} 年</option>`).join('');
            const keywordOptions = this._state.allKeywords.map(kw => `<option value="${kw.name}" ${this._state.filter.keyword === kw.name ? 'selected':''}>${kw.name} (${kw.count})</option>`).join('');

            this.container.innerHTML = `
                <div class="spreadsheet-card bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-colors duration-200">
                    
                    <!-- 頂部標題與操作列 -->
                    <div class="tv-header p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50/50">
                        <div>
                            <div class="flex items-center gap-3">
                                <h2 class="text-lg font-bold text-slate-900 dark:text-white">全站文章資料庫與試算表終端</h2>
                                <span id="count-badge" class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                    ${this._state.filtered.length} 篇
                                </span>
                            </div>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                結構化呈現全站 ${this._state.articles.length} 篇文章，支援 URL 狀態記憶、知識圖譜膠囊點擊、一鍵重設與三模匯出。
                            </p>
                        </div>

                        <div class="flex flex-wrap items-center gap-2">
                            <button id="btn-export-tsv" class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all hover:shadow">
                                📋 複製為試算表 (TSV)
                            </button>
                            <button id="btn-export-csv" class="btn-secondary px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-slate-100 font-semibold text-xs rounded-lg shadow-sm transition-all">
                                📥 下載 CSV
                            </button>
                            <button id="btn-export-md" class="btn-secondary px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors">
                                📝 Markdown 表格
                            </button>
                        </div>
                    </div>

                    <!-- 多維過濾控制列 -->
                    <div class="tv-filter-box p-4 bg-white border-b border-slate-200 space-y-3">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            
                            <!-- 關鍵字搜尋與一鍵重設按鈕 -->
                            <div class="relative lg:col-span-2 flex items-center gap-1.5">
                                <input type="text" id="filter-search" value="${this._state.filter.query}" placeholder="搜尋標題、摘要、關鍵字..." class="tv-input w-full pl-3 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all">
                                <button id="btn-reset-filters" title="一鍵清除所有過濾篩選" class="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 dark:bg-slate-800 dark:hover:bg-red-900/30 dark:text-slate-400 dark:hover:text-red-400 dark:border-slate-700 rounded-lg transition-all whitespace-nowrap cursor-pointer">
                                    重設
                                </button>
                            </div>

                            <!-- 關鍵字/標籤詞篩選 -->
                            <div>
                                <select id="filter-keyword" class="tv-input w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:border-orange-500 outline-none cursor-pointer">
                                    <option value="all">所有關鍵字詞 (Keywords)</option>
                                    ${keywordOptions}
                                </select>
                            </div>

                            <!-- 年份篩選 -->
                            <div>
                                <select id="filter-year" class="tv-input w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:border-orange-500 outline-none cursor-pointer">
                                    <option value="all">所有年份</option>
                                    ${yearOptions}
                                </select>
                            </div>

                            <!-- 文章分類篩選 -->
                            <div>
                                <select id="filter-cat" class="tv-input w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:border-orange-500 outline-none cursor-pointer">
                                    <option value="all">所有分類</option>
                                    ${catOptions}
                                </select>
                            </div>

                            <!-- 標籤領域篩選 -->
                            <div>
                                <select id="filter-tag" class="tv-input w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:border-orange-500 outline-none cursor-pointer">
                                    <option value="all">所有標籤 (#)</option>
                                    ${tagOptions}
                                </select>
                            </div>

                        </div>

                        <div class="flex flex-wrap items-center justify-between pt-1 text-xs text-slate-500 dark:text-slate-400 gap-2">
                            <!-- 系列篩選列 -->
                            <div class="flex items-center gap-2">
                                <span class="font-semibold text-slate-700 dark:text-slate-300">專題系列:</span>
                                <select id="filter-series" class="tv-input px-2 py-1 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700 focus:border-orange-500 outline-none cursor-pointer">
                                    <option value="all">所有專題系列</option>
                                    ${seriesOptions}
                                </select>
                            </div>

                            <!-- 欄位動態顯示 checkbox -->
                            <div class="flex items-center gap-4">
                                <span class="font-semibold text-slate-700 dark:text-slate-300">顯示欄位:</span>
                                <label class="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                                    <input type="checkbox" id="toggle-id" ${this._state.visibleColumns.id ? 'checked':''} class="rounded text-blue-600 focus:ring-blue-500">
                                    <span>文章 ID</span>
                                </label>
                                <label class="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                                    <input type="checkbox" id="toggle-keywords" ${this._state.visibleColumns.keywords ? 'checked':''} class="rounded text-blue-600 focus:ring-blue-500">
                                    <span>關鍵字膠囊 (Keywords)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- 資料表格視圖 -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead id="spreadsheet-thead">
                                <!-- 透過 renderTableHeader 動態生成 -->
                            </thead>
                            <tbody id="spreadsheet-tbody" class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                <!-- 透過 renderTable 動態生成 -->
                            </tbody>
                        </table>
                    </div>

                    <!-- 底部總覽 -->
                    <div class="tv-footer p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div id="footer-count">
                            顯示第 <span class="font-bold text-slate-700 dark:text-slate-200">${this._state.filtered.length > 0 ? 1 : 0}</span> 至 <span class="font-bold text-slate-700 dark:text-slate-200">${this._state.filtered.length}</span> 筆文章。
                        </div>
                        <div class="font-mono text-slate-400">
                            Mason Yang Blog System V2.0
                        </div>
                    </div>

                </div>
            `;

            this.renderTableHeader();
            this.attachDOMEvents();
        }

        renderTableHeader() {
            const thead = this.shadowRoot.querySelector('#spreadsheet-thead');
            if (!thead) return;

            const sortSign = (field) => {
                if (this._state.sort.field !== field) return '<span class="text-slate-300 dark:text-slate-600 ml-1">↕</span>';
                return this._state.sort.direction === 'ASC' ? '<span class="text-orange-600 ml-1 font-bold">↑</span>' : '<span class="text-orange-600 ml-1 font-bold">↓</span>';
            };

            thead.innerHTML = `
                <tr class="bg-slate-100/75 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    ${this._state.visibleColumns.id ? `<th class="p-3 cursor-pointer hover:bg-slate-200 select-none" data-sort="id">ID ${sortSign('id')}</th>` : ''}
                    <th class="p-3 cursor-pointer hover:bg-slate-200 select-none whitespace-nowrap" data-sort="published">發布日期 ${sortSign('published')}</th>
                    <th class="p-3 cursor-pointer hover:bg-slate-200 select-none whitespace-nowrap" data-sort="categoryName">文章分類 ${sortSign('categoryName')}</th>
                    <th class="p-3 cursor-pointer hover:bg-slate-200 select-none whitespace-nowrap" data-sort="tagName">標籤領域 ${sortSign('tagName')}</th>
                    <th class="p-3 cursor-pointer hover:bg-slate-200 select-none whitespace-nowrap" data-sort="seriesName">專題系列 ${sortSign('seriesName')}</th>
                    <th class="p-3 cursor-pointer hover:bg-slate-200 select-none" data-sort="title">文章標題 ${sortSign('title')}</th>
                    <th class="p-3 select-none">TL;DR 核心摘要</th>
                    ${this._state.visibleColumns.keywords ? `<th class="p-3 select-none">關鍵字知識圖譜膠囊</th>` : ''}
                    <th class="p-3 text-right select-none whitespace-nowrap">操作</th>
                </tr>
            `;

            const ths = thead.querySelectorAll('th[data-sort]');
            ths.forEach(th => {
                th.addEventListener('click', () => {
                    const field = th.getAttribute('data-sort');
                    this.sortBy(field);
                    this.renderTableHeader();
                });
            });
        }

        renderTable() {
            const tbody = this.shadowRoot.querySelector('#spreadsheet-tbody');
            const countBadge = this.shadowRoot.querySelector('#count-badge');
            const footerCount = this.shadowRoot.querySelector('#footer-count');
            if (!tbody) return;

            if (countBadge) countBadge.textContent = `${this._state.filtered.length} 篇`;
            if (footerCount) footerCount.innerHTML = `顯示第 <span class="font-bold text-slate-700 dark:text-slate-200">${this._state.filtered.length > 0 ? 1 : 0}</span> 至 <span class="font-bold text-slate-700 dark:text-slate-200">${this._state.filtered.length}</span> 筆文章。`;

            if (this._state.filtered.length === 0) {
                tbody.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-slate-500 font-medium">沒有符合過濾條件的文章。請重設搜尋條件。</td></tr>`;
                return;
            }

            const prefix = this.getPathPrefix();

            const tableRows = this._state.filtered.map(item => {
                const link = item.link ? (prefix + item.link) : '#';
                
                // 新五大分類高亮色彩對照表
                let catBadgeClass = 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
                if (item.category === 'macro-geopolitics') {
                    catBadgeClass = 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400';
                } else if (item.category === 'traditional-markets') {
                    catBadgeClass = 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400';
                } else if (item.category === 'crypto-web3') {
                    catBadgeClass = 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400';
                } else if (item.category === 'tech-ai') {
                    catBadgeClass = 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-400';
                } else if (item.category === 'research-tools') {
                    catBadgeClass = 'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200';
                }

                const kwsPills = item.parsedKeywords.map(kw => `
                    <button type="button" data-kw="${kw}" class="keyword-pill inline-block mr-1 mb-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 dark:bg-slate-800 dark:hover:bg-blue-900/40 dark:text-slate-300 dark:hover:text-blue-300 dark:border-slate-700 transition-all shadow-sm">
                        #${kw}
                    </button>
                `).join('');

                // 複數標籤 Pills 渲染
                const tagsList = item.tagsList || [];
                const tagsHtml = tagsList.map(t => {
                    const tagInfo = window.TaxonomyConfig ? window.TaxonomyConfig.getTag(t) : { text: t };
                    return `
                        <span class="inline-block mr-1 mb-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md">
                            #${tagInfo.text || t}
                        </span>
                    `;
                }).join('');

                return `
                    <tr class="table-row hover:bg-slate-50 transition-colors border-b border-slate-100 dark:border-slate-800">
                        ${this._state.visibleColumns.id ? `<td class="p-3 font-mono text-xs text-slate-500 dark:text-slate-500">${item.id}</td>` : ''}
                        <td class="p-3 font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">${item.published || '-'}</td>
                        <td class="p-3 whitespace-nowrap">
                            <span class="px-2 py-0.5 text-xs font-semibold rounded-md border ${catBadgeClass}">
                                ${item.categoryName}
                            </span>
                        </td>
                        <td class="p-3">
                            <div class="flex flex-wrap max-w-xs">
                                ${tagsHtml || '-'}
                            </div>
                        </td>
                        <td class="p-3 text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">${item.seriesName}</td>
                        <td class="p-3 max-w-md">
                            <div class="font-bold text-slate-900 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-500 transition-colors line-clamp-1">
                                <a href="${link}" target="_blank" rel="noopener noreferrer">${item.title || '-'}</a>
                            </div>
                        </td>
                        <td class="p-3 text-xs text-slate-600 dark:text-slate-400 max-w-md line-clamp-2">${item.desc || item.summary || '-'}</td>
                        ${this._state.visibleColumns.keywords ? `<td class="p-3 max-w-xs">${kwsPills || '-'}</td>` : ''}
                        <td class="p-3 whitespace-nowrap text-right">
                            <a href="${link}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">查看文章 ↗</a>
                        </td>
                    </tr>
                `;
            }).join('');

            tbody.innerHTML = tableRows;

            const pills = tbody.querySelectorAll('.keyword-pill');
            pills.forEach(pill => {
                pill.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const kw = pill.getAttribute('data-kw');
                    this.selectKeywordFromPill(kw);
                });
            });
        }

        attachDOMEvents() {
            const btnTsv = this.shadowRoot.querySelector('#btn-export-tsv');
            const btnCsv = this.shadowRoot.querySelector('#btn-export-csv');
            const btnMd = this.shadowRoot.querySelector('#btn-export-md');
            if (btnTsv) btnTsv.addEventListener('click', () => this.exportTSV());
            if (btnCsv) btnCsv.addEventListener('click', () => this.exportCSV());
            if (btnMd) btnMd.addEventListener('click', () => this.exportMarkdown());

            const search = this.shadowRoot.querySelector('#filter-search');
            const keywordSelect = this.shadowRoot.querySelector('#filter-keyword');
            const yearSelect = this.shadowRoot.querySelector('#filter-year');
            const catSelect = this.shadowRoot.querySelector('#filter-cat');
            const tagSelect = this.shadowRoot.querySelector('#filter-tag');
            const seriesSelect = this.shadowRoot.querySelector('#filter-series');
            const btnReset = this.shadowRoot.querySelector('#btn-reset-filters');

            if (search) {
                search.addEventListener('input', (e) => {
                    this._state.filter.query = e.target.value;
                    if (this._debounceTimer) clearTimeout(this._debounceTimer);
                    this._debounceTimer = setTimeout(() => {
                        this.filterData();
                    }, 100);
                });
            }
            if (keywordSelect) keywordSelect.addEventListener('change', (e) => { this._state.filter.keyword = e.target.value; this.filterData(); });
            if (yearSelect) yearSelect.addEventListener('change', (e) => { this._state.filter.year = e.target.value; this.filterData(); });
            if (catSelect) catSelect.addEventListener('change', (e) => { this._state.filter.category = e.target.value; this.filterData(); });
            if (tagSelect) tagSelect.addEventListener('change', (e) => { this._state.filter.tag = e.target.value; this.filterData(); });
            if (seriesSelect) seriesSelect.addEventListener('change', (e) => { this._state.filter.series = e.target.value; this.filterData(); });

            if (btnReset) btnReset.addEventListener('click', () => this.resetFilters());

            const toggleId = this.shadowRoot.querySelector('#toggle-id');
            const toggleKw = this.shadowRoot.querySelector('#toggle-keywords');
            if (toggleId) toggleId.addEventListener('change', () => this.toggleColumn('id'));
            if (toggleKw) toggleKw.addEventListener('change', () => this.toggleColumn('keywords'));
        }

        createStyles() {
            const style = document.createElement("style");
            style.textContent = `
                @import url("https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css");
                :host {
                    display: block;
                    width: 100%;
                    font-family: 'Inter', 'Noto Sans TC', sans-serif;
                }
                
                :host-context(html.dark) .spreadsheet-card {
                    background-color: #131722;
                    border-color: #2a2e39;
                    color: #d1d4dc;
                }
                
                :host-context(html.dark) .tv-header,
                :host-context(html.dark) .tv-filter-box,
                :host-context(html.dark) .tv-footer {
                    background-color: #181c27 !important;
                    border-color: #2a2e39 !important;
                }
                
                :host-context(html.dark) th {
                    background-color: #1e222d !important;
                    border-color: #2a2e39 !important;
                    color: #e2e8f0 !important;
                }
                :host-context(html.dark) th:hover {
                    background-color: #2a2e39 !important;
                }
                
                :host-context(html.dark) td {
                    border-color: #2a2e39 !important;
                }

                :host-context(html.dark) .table-row:nth-child(odd) {
                    background-color: #131722;
                }
                :host-context(html.dark) .table-row:nth-child(even) {
                    background-color: #181c27;
                }
                :host-context(html.dark) .table-row:hover {
                    background-color: #1e222d !important;
                }
                
                :host-context(html.dark) .tv-input {
                    background-color: #131722 !important;
                    border-color: #2a2e39 !important;
                    color: #e2e8f0 !important;
                }
                :host-context(html.dark) .tv-input:focus {
                    background-color: #181c27 !important;
                    border-color: #2962ff !important;
                    box-shadow: 0 0 0 1px #2962ff !important;
                }
                
                :host-context(html.dark) .btn-secondary {
                    background-color: #2a2e39 !important;
                    color: #d1d4dc !important;
                    border: 1px solid #363c4e !important;
                }
                :host-context(html.dark) .btn-secondary:hover {
                    background-color: #363c4e !important;
                    color: #ffffff !important;
                    border-color: #4a5165 !important;
                }
            `;
            this.shadowRoot.appendChild(style);
        }

        createContent() {
            const container = document.createElement("div");
            container.className = "spreadsheet-container";
            container.innerHTML = `<div>資料庫載入中...</div>`;
            this.shadowRoot.appendChild(container);
            this.container = container;
        }

        attachEvents() {}

        setDebug(debug) {
            this._config.debug = !!debug;
            return this;
        }
    }

    global.ArticlesSpreadsheetComponent = ArticlesSpreadsheetComponent;

})(typeof window !== 'undefined' ? window : global);
