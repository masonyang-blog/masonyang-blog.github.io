/**
 * Articles Spreadsheet Component - Facade Shim
 * @class ArticlesSpreadsheetComponent
 * @description Proxy/Mirror for assets/js/apps/app-articles-spreadsheet.js
 */
(function (global) {
    "use strict";

    // If loaded from root, dynamically reference or mirror apps/app-articles-spreadsheet.js
    if (global.ArticlesSpreadsheetComponent) {
        return;
    }

    // Mirror full class implementation
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
                tracks: {},
                categories: {},
                tags: {},
                series: {},
                years: [],
                allKeywords: [],
                filter: { track: 'all', category: 'all', tag: 'all', series: 'all', year: 'all', keyword: 'all', query: '' },
                visibleColumns: { id: false, published: true, track: true, category: true, tag: true, series: true, title: true, summary: true, keywords: true },
                sort: { field: 'published', direction: 'DESC' }
            };
            this._debounceTimer = null;
            this.engine = null;
        }

        init() {
            if (this._config.debug) console.log("ArticlesSpreadsheetComponent: Initializing...");
            this.createStyles();
            this.createContent();
            this.loadData();
            return this;
        }

        loadData() {
            const config = window.BLOG_CONFIG || {};
            this._state.tracks = (window.TaxonomyConfig && typeof window.TaxonomyConfig.getAllTracks === 'function') ? window.TaxonomyConfig.getAllTracks() : (config.TRACKS || {});
            this._state.categories = config.CATEGORIES || {};
            this._state.tags = config.TAGS || {};
            this._state.series = config.SERIES || {};

            const EngineClass = global.ArticlesFilterEngine;
            if (EngineClass) {
                this.engine = new EngineClass({
                    tracks: this._state.tracks,
                    categories: this._state.categories,
                    tags: this._state.tags,
                    series: this._state.series,
                    taxonomyConfig: window.TaxonomyConfig
                });
            }

            const repoPromise = (window.ArticleRepository && window.ArticleRepository.loadAllDetails)
                ? window.ArticleRepository.loadAllDetails()
                : Promise.resolve(window.ArticleRepository && window.ArticleRepository.all ? window.ArticleRepository.all : []);

            repoPromise.then(repo => {
                if (!repo || repo.length === 0) return;
                if (this.engine) {
                    const normalizedResult = this.engine.normalizeArticles(repo);
                    this._state.years = normalizedResult.years;
                    this._state.allKeywords = normalizedResult.allKeywords;
                    this._state.articles = normalizedResult.articles;
                    this._state.filtered = [...normalizedResult.articles];
                } else {
                    this._state.articles = repo;
                    this._state.filtered = [...repo];
                }
                this.readURLState();
                this.renderControls();
                this.filterData();
            });
        }

        getPathPrefix() {
            if (typeof window === 'undefined' || !window.location) return './';
            const segments = window.location.pathname.split('/').filter(Boolean);
            const subDirs = ['post', 'knowledge', 'project', 'doc', 'news'];
            if (segments.some(seg => subDirs.includes(seg))) return '../';
            return './';
        }

        readURLState() {
            if (this.engine && typeof this.engine.readURLState === 'function') {
                this._state.filter = this.engine.readURLState(window.location.search, {
                    years: this._state.years,
                    tracks: this._state.tracks,
                    categories: this._state.categories,
                    tags: this._state.tags,
                    series: this._state.series
                });
            }
        }

        syncURLState() {
            if (this.engine && typeof this.engine.syncURLState === 'function') {
                this.engine.syncURLState(this._state.filter);
            }
        }

        filterData() {
            if (this.engine && typeof this.engine.filterArticles === 'function') {
                this._state.filtered = this.engine.filterArticles(this._state.articles, this._state.filter);
            }
            this.syncURLState();
            this.sortData();
        }

        sortData() {
            const { field, direction } = this._state.sort;
            if (this.engine && typeof this.engine.sortArticles === 'function') {
                this._state.filtered = this.engine.sortArticles(this._state.filtered, field, direction);
            }
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
            this.showToast(`知識圖譜導航：已鎖定「#${kw}」相關文章`);
        }

        resetFilters() {
            this._state.filter = { track: 'all', category: 'all', tag: 'all', series: 'all', year: 'all', keyword: 'all', query: '' };
            const search = this.shadowRoot.querySelector('#filter-search');
            const keywordSelect = this.shadowRoot.querySelector('#filter-keyword');
            const yearSelect = this.shadowRoot.querySelector('#filter-year');
            const trackSelect = this.shadowRoot.querySelector('#filter-track');
            const catSelect = this.shadowRoot.querySelector('#filter-cat');
            const tagSelect = this.shadowRoot.querySelector('#filter-tag');
            const seriesSelect = this.shadowRoot.querySelector('#filter-series');
            if (search) search.value = '';
            if (keywordSelect) keywordSelect.value = 'all';
            if (yearSelect) yearSelect.value = 'all';
            if (trackSelect) trackSelect.value = 'all';
            if (catSelect) catSelect.value = 'all';
            if (tagSelect) tagSelect.value = 'all';
            if (seriesSelect) seriesSelect.value = 'all';
            this.filterData();
            this.showToast('已清除所有篩選條件，還原初始清單。');
        }

        escapeField(str) {
            if (str === null || str === undefined) return '';
            str = str.toString().trim();
            if (str.includes('"') || str.includes('\n') || str.includes('\r') || str.includes(',') || str.includes('\t')) {
                str = '"' + str.replaceAll('"', '""') + '"';
            }
            return str;
        }

        exportTSV() {
            const cols = ['ID', '發布日期', '主題賽道', '文章分類', '標籤領域', '專題系列', '文章標題', 'TL;DR 摘要', '連結', '關鍵字'];
            let tsv = cols.join('\t') + '\n';
            this._state.filtered.forEach(item => {
                const linkFull = `https://masonyang-blog.github.io/${item.link || ''}`;
                tsv += [
                    this.escapeField(item.id),
                    this.escapeField(item.published || '-'),
                    this.escapeField(item.trackName || '-'),
                    this.escapeField(item.categoryName || item.category || '-'),
                    this.escapeField(item.tagName || item.tag || '-'),
                    this.escapeField(item.seriesName || item.series || '-'),
                    this.escapeField(item.title || '-'),
                    this.escapeField(item.desc || item.summary || '-'),
                    this.escapeField(linkFull),
                    this.escapeField(item.keywords || '-')
                ].join('\t') + '\n';
            });
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(tsv).then(() => this.showToast('試算表 (TSV) 已成功複製！'));
            }
        }

        exportCSV() {
            const cols = ['ID', '發布日期', '主題賽道', '文章分類', '標籤領域', '專題系列', '文章標題', 'TL;DR 摘要', '連結', '關鍵字'];
            let csv = cols.map(c => `"${c}"`).join(',') + '\n';
            this._state.filtered.forEach(item => {
                const linkFull = `https://masonyang-blog.github.io/${item.link || ''}`;
                csv += [
                    this.escapeField(item.id),
                    this.escapeField(item.published || '-'),
                    this.escapeField(item.trackName || '-'),
                    this.escapeField(item.categoryName || item.category || '-'),
                    this.escapeField(item.tagName || item.tag || '-'),
                    this.escapeField(item.seriesName || item.series || '-'),
                    this.escapeField(item.title || '-'),
                    this.escapeField(item.desc || item.summary || '-'),
                    this.escapeField(linkFull),
                    this.escapeField(item.keywords || '-')
                ].join(',') + '\n';
            });
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `mason_articles_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.showToast('CSV 檔案已成功下載！');
        }

        exportMarkdown() {
            const cols = ['發布日期', '主題賽道', '文章分類', '標籤領域', '專題系列', '文章標題', '連結'];
            const sep = cols.map(() => ':---').join(' | ');
            let md = `| ${cols.join(' | ')} |\n| ${sep} |\n`;
            this._state.filtered.forEach(item => {
                const linkFull = `https://masonyang-blog.github.io/${item.link || ''}`;
                const cleanTitle = (item.title || '-').replace(/\|/g, '&#124;');
                md += `| ${[item.published || '-', item.trackName || '-', item.categoryName || item.category || '-', item.tagName || item.tag || '-', item.seriesName || item.series || '-', cleanTitle, `[檢視](${linkFull})`].join(' | ')} |\n`;
            });
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(md).then(() => this.showToast('Markdown 表格已成功複製！'));
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
            setTimeout(() => { toast.style.transform = 'translateY(1rem)'; toast.style.opacity = '0'; }, 3500);
        }

        renderControls() {
            if (!this.container) return;
            const trackOptions = Object.keys(this._state.tracks).map(k => `<option value="${k}" ${this._state.filter.track === k ? 'selected':''}>${this._state.tracks[k].name || k}</option>`).join('');
            const catOptions = Object.keys(this._state.categories).map(k => `<option value="${k}" ${this._state.filter.category === k ? 'selected':''}>${this._state.categories[k].name || k}</option>`).join('');
            const tagOptions = Object.keys(this._state.tags).map(k => `<option value="${k}" ${this._state.filter.tag === k ? 'selected':''}>#${this._state.tags[k].name || k}</option>`).join('');
            const seriesOptions = Object.keys(this._state.series).map(k => `<option value="${k}" ${this._state.filter.series === k ? 'selected':''}>${this._state.series[k].title || k}</option>`).join('');
            const yearOptions = this._state.years.map(y => `<option value="${y}" ${this._state.filter.year === y ? 'selected':''}>${y} 年</option>`).join('');
            const keywordOptions = this._state.allKeywords.map(kw => `<option value="${kw.name}" ${this._state.filter.keyword === kw.name ? 'selected':''}>${kw.name} (${kw.count})</option>`).join('');

            this.container.innerHTML = `
                <div class="spreadsheet-card bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-colors duration-200">
                    <div class="tv-header p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50/50">
                        <div>
                            <div class="flex items-center gap-3">
                                <h2 class="text-lg font-bold text-slate-900 dark:text-white">全站文章資料庫與試算表終端</h2>
                                <span id="count-badge" class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                    ${this._state.filtered.length} 篇
                                </span>
                            </div>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                結構化呈現全站 ${this._state.articles.length} 篇文章，支援 URL 狀態記憶、主題賽道、知識圖譜膠囊點擊、一鍵重設與三模匯出。
                            </p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <button id="btn-export-tsv" class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all hover:shadow">複製為試算表 (TSV)</button>
                            <button id="btn-export-csv" class="btn-secondary px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-slate-100 font-semibold text-xs rounded-lg shadow-sm transition-all">下載 CSV</button>
                            <button id="btn-export-md" class="btn-secondary px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors">Markdown 表格</button>
                        </div>
                    </div>
                    <div class="tv-filter-box p-4 bg-white border-b border-slate-200 space-y-3">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            <div class="relative lg:col-span-2 flex items-center gap-1.5">
                                <input type="text" id="filter-search" value="${this._state.filter.query}" placeholder="搜尋標題、摘要、賽道、關鍵字..." class="tv-input w-full pl-3 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all">
                                <button id="btn-reset-filters" class="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-lg cursor-pointer">重設</button>
                            </div>
                            <div><select id="filter-track" class="tv-input w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-medium"><option value="all">所有主題賽道 (Tracks)</option>${trackOptions}</select></div>
                            <div><select id="filter-keyword" class="tv-input w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-medium"><option value="all">所有關鍵字詞 (Keywords)</option>${keywordOptions}</select></div>
                            <div><select id="filter-year" class="tv-input w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-medium"><option value="all">所有年份</option>${yearOptions}</select></div>
                            <div><select id="filter-cat" class="tv-input w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-medium"><option value="all">所有分類</option>${catOptions}</select></div>
                        </div>
                        <div class="flex flex-wrap items-center justify-between pt-1 text-xs text-slate-500 dark:text-slate-400 gap-2">
                            <div class="flex flex-wrap items-center gap-3">
                                <div class="flex items-center gap-1.5"><span class="font-semibold text-slate-700 dark:text-slate-300">標籤:</span><select id="filter-tag" class="tv-input px-2 py-1 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700"><option value="all">所有標籤 (#)</option>${tagOptions}</select></div>
                                <div class="flex items-center gap-1.5"><span class="font-semibold text-slate-700 dark:text-slate-300">專題系列:</span><select id="filter-series" class="tv-input px-2 py-1 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-700"><option value="all">所有專題系列</option>${seriesOptions}</select></div>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="font-semibold text-slate-700 dark:text-slate-300">顯示欄位:</span>
                                <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" id="toggle-track" ${this._state.visibleColumns.track ? 'checked':''} class="rounded text-blue-600"><span>主題賽道 (Track)</span></label>
                                <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" id="toggle-id" ${this._state.visibleColumns.id ? 'checked':''} class="rounded text-blue-600"><span>文章 ID</span></label>
                                <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" id="toggle-keywords" ${this._state.visibleColumns.keywords ? 'checked':''} class="rounded text-blue-600"><span>關鍵字膠囊 (Keywords)</span></label>
                            </div>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead id="spreadsheet-thead"></thead>
                            <tbody id="spreadsheet-tbody" class="divide-y divide-slate-100 dark:divide-slate-800 text-xs"></tbody>
                        </table>
                    </div>
                    <div class="tv-footer p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div id="footer-count">顯示第 <span class="font-bold text-slate-700 dark:text-slate-200">${this._state.filtered.length > 0 ? 1 : 0}</span> 至 <span class="font-bold text-slate-700 dark:text-slate-200">${this._state.filtered.length}</span> 筆文章。</div>
                        <div class="font-mono text-slate-400">Mason Yang Blog System V2.0</div>
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
                    ${this._state.visibleColumns.track ? `<th class="p-3 cursor-pointer hover:bg-slate-200 select-none whitespace-nowrap" data-sort="trackName">主題賽道 ${sortSign('trackName')}</th>` : ''}
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
                    this.sortBy(th.getAttribute('data-sort'));
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
                tbody.innerHTML = `<tr><td colspan="10" class="p-8 text-center text-slate-500 font-medium">沒有符合過濾條件的文章。請重設搜尋條件。</td></tr>`;
                return;
            }

            const prefix = this.getPathPrefix();
            tbody.innerHTML = this._state.filtered.map(item => {
                const link = item.link ? (prefix + item.link) : '#';
                const catSlug = item.category || 'default';
                const catBadgeClass = `cat-badge cat-${catSlug}`;
                const kwsPills = (item.parsedKeywords || []).map(kw => `<button type="button" data-kw="${kw}" class="keyword-pill">#${kw}</button>`).join('');
                const tagsList = item.tagsList || [];
                const tagsHtml = tagsList.map(t => {
                    const tagInfo = window.TaxonomyConfig ? window.TaxonomyConfig.getTag(t) : { text: t };
                    return `<span class="tag-pill">#${tagInfo.text || t}</span>`;
                }).join('');

                return `
                    <tr class="table-row hover:bg-slate-50 transition-colors border-b border-slate-100 dark:border-slate-800">
                        ${this._state.visibleColumns.id ? `<td class="p-3 font-mono text-xs text-slate-500 dark:text-slate-500">${item.id}</td>` : ''}
                        <td class="p-3 font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">${item.published || '-'}</td>
                        ${this._state.visibleColumns.track ? `<td class="p-3 whitespace-nowrap">${item.trackId ? `<span class="px-2 py-0.5 rounded text-[11px] font-bold border" style="background-color: ${item.trackHex}15; color: ${item.trackHex}; border-color: ${item.trackHex}35;">${item.trackName}</span>` : '<span class="text-slate-400">-</span>'}</td>` : ''}
                        <td class="p-3 whitespace-nowrap"><span class="${catBadgeClass}">${item.categoryName}</span></td>
                        <td class="p-3"><div class="flex flex-wrap max-w-xs">${tagsHtml || '-'}</div></td>
                        <td class="p-3 text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">${item.seriesName}</td>
                        <td class="p-3 max-w-md"><div class="font-bold text-slate-900 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-500 transition-colors line-clamp-1"><a href="${link}" target="_blank" rel="noopener noreferrer">${item.title || '-'}</a></div></td>
                        <td class="p-3 text-xs text-slate-600 dark:text-slate-400 max-w-md line-clamp-2">${item.desc || item.summary || '-'}</td>
                        ${this._state.visibleColumns.keywords ? `<td class="p-3 max-w-xs">${kwsPills || '-'}</td>` : ''}
                        <td class="p-3 whitespace-nowrap text-right"><a href="${link}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">查看文章 ↗</a></td>
                    </tr>
                `;
            }).join('');

            tbody.querySelectorAll('.keyword-pill').forEach(pill => {
                pill.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.selectKeywordFromPill(pill.getAttribute('data-kw'));
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
            const trackSelect = this.shadowRoot.querySelector('#filter-track');
            const catSelect = this.shadowRoot.querySelector('#filter-cat');
            const tagSelect = this.shadowRoot.querySelector('#filter-tag');
            const seriesSelect = this.shadowRoot.querySelector('#filter-series');
            const btnReset = this.shadowRoot.querySelector('#btn-reset-filters');

            if (search) {
                search.addEventListener('input', (e) => {
                    this._state.filter.query = e.target.value;
                    if (this._debounceTimer) clearTimeout(this._debounceTimer);
                    this._debounceTimer = setTimeout(() => this.filterData(), 100);
                });
            }
            if (keywordSelect) keywordSelect.addEventListener('change', (e) => { this._state.filter.keyword = e.target.value; this.filterData(); });
            if (yearSelect) yearSelect.addEventListener('change', (e) => { this._state.filter.year = e.target.value; this.filterData(); });
            if (trackSelect) trackSelect.addEventListener('change', (e) => { this._state.filter.track = e.target.value; this.filterData(); });
            if (catSelect) catSelect.addEventListener('change', (e) => { this._state.filter.category = e.target.value; this.filterData(); });
            if (tagSelect) tagSelect.addEventListener('change', (e) => { this._state.filter.tag = e.target.value; this.filterData(); });
            if (seriesSelect) seriesSelect.addEventListener('change', (e) => { this._state.filter.series = e.target.value; this.filterData(); });
            if (btnReset) btnReset.addEventListener('click', () => this.resetFilters());

            const toggleTrack = this.shadowRoot.querySelector('#toggle-track');
            const toggleId = this.shadowRoot.querySelector('#toggle-id');
            const toggleKw = this.shadowRoot.querySelector('#toggle-keywords');
            if (toggleTrack) toggleTrack.addEventListener('change', () => this.toggleColumn('track'));
            if (toggleId) toggleId.addEventListener('change', () => this.toggleColumn('id'));
            if (toggleKw) toggleKw.addEventListener('change', () => this.toggleColumn('keywords'));
        }

        createStyles() {
            const style = document.createElement("style");
            style.textContent = `
                @import url("https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css");
                :host { display: block; width: 100%; font-family: 'Inter', 'Noto Sans TC', sans-serif; }
                .cat-badge { display: inline-flex; align-items: center; padding: 2px 8px; font-size: 11px; font-weight: 500; line-height: 1.25rem; border-radius: 6px; border: 1px solid #cbd5e1; background-color: transparent; color: #334155; white-space: nowrap; transition: all 0.2s ease; }
                :host-context(html.dark) .cat-badge, :host-context(.dark) .cat-badge { border-color: #334155 !important; background-color: transparent !important; color: #f1f5f9 !important; }
                .tag-pill { display: inline-block; margin-right: 4px; margin-bottom: 4px; font-size: 11px; font-weight: 500; color: #2563eb; background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0; transition: all 0.2s ease; }
                :host-context(html.dark) .tag-pill, :host-context(.dark) .tag-pill { color: #60a5fa !important; background-color: rgba(30, 41, 59, 0.7) !important; border-color: #334155 !important; }
                .keyword-pill { display: inline-block; margin-right: 4px; margin-bottom: 4px; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 500; background-color: #f8fafc; color: #475569; border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.15s ease; }
                .keyword-pill:hover { background-color: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
                :host-context(html.dark) .keyword-pill, :host-context(.dark) .keyword-pill { background-color: #181c27 !important; color: #94a3b8 !important; border-color: #2a2e39 !important; }
                :host-context(html.dark) .keyword-pill:hover, :host-context(.dark) .keyword-pill:hover { background-color: rgba(37, 99, 235, 0.2) !important; color: #93c5fd !important; border-color: rgba(59, 130, 246, 0.4) !important; }
                :host-context(html.dark) .spreadsheet-card { background-color: #131722; border-color: #2a2e39; color: #d1d4dc; }
                :host-context(html.dark) .tv-header, :host-context(html.dark) .tv-filter-box, :host-context(html.dark) .tv-footer { background-color: #181c27 !important; border-color: #2a2e39 !important; }
                :host-context(html.dark) th { background-color: #1e222d !important; border-color: #2a2e39 !important; color: #e2e8f0 !important; }
                :host-context(html.dark) th:hover { background-color: #2a2e39 !important; }
                :host-context(html.dark) td { border-color: #2a2e39 !important; }
                :host-context(html.dark) .table-row:nth-child(odd) { background-color: #131722; }
                :host-context(html.dark) .table-row:nth-child(even) { background-color: #181c27; }
                :host-context(html.dark) .table-row:hover { background-color: #1e222d !important; }
                :host-context(html.dark) .tv-input { background-color: #131722 !important; border-color: #2a2e39 !important; color: #e2e8f0 !important; }
                :host-context(html.dark) .tv-input:focus { background-color: #181c27 !important; border-color: #2962ff !important; box-shadow: 0 0 0 1px #2962ff !important; }
                :host-context(html.dark) .btn-secondary { background-color: #2a2e39 !important; color: #d1d4dc !important; border: 1px solid #363c4e !important; }
                :host-context(html.dark) .btn-secondary:hover { background-color: #363c4e !important; color: #ffffff !important; border-color: #4a5165 !important; }
                :host-context(html.dark) #count-badge { background-color: rgba(37, 99, 235, 0.2) !important; color: #93c5fd !important; border-color: rgba(59, 130, 246, 0.3) !important; }
                :host-context(html.dark) #btn-reset-filters { background-color: #1e222d !important; color: #94a3b8 !important; border-color: #2a2e39 !important; }
                :host-context(html.dark) #btn-reset-filters:hover { background-color: rgba(239, 68, 68, 0.15) !important; color: #fca5a5 !important; border-color: rgba(239, 68, 68, 0.3) !important; }
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
