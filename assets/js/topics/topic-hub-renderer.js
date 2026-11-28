/**
 * assets/js/topics/topic-hub-renderer.js
 * Layer 1C 專題知識中樞共用渲染引擎 (Zero-Build / Pure Vanilla JS UMD)
 *
 * 負責渲染：
 * 1. Zone 1 首屏 KPI 監控條 (Macro Ledger)
 * 2. Zone 2 四維價值鏈分頁與動態 Bento 矩陣 (Pillar Tabs & Bento Matrix)
 * 3. Zone 3 核心概念膠囊與預覽抽屜 (Concept Pills & Preview Box)
 * 4. 關鍵字即時搜尋過濾與深淺色主題切換綁定
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.TopicHubRenderer = factory();
    }
}(typeof window !== 'undefined' ? window : this, function () {
    'use strict';

    const DEFAULT_PILLAR_STYLES = {
        // AI Economy Pillars
        silicon: { badge: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20', label: 'Pillar I · 矽基晶片' },
        power: { badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20', label: 'Pillar II · 電力礦企' },
        capital: { badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20', label: 'Pillar III · 資本週期' },
        agent: { badge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20', label: 'Pillar IV · Agent 工程' },
        // Crypto & Web3 Pillars
        btc: { badge: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20', label: 'Pillar I · 比特幣與流動性' },
        rwa: { badge: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20', label: 'Pillar II · RWA 與監管' },
        'l1-infra': { badge: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20', label: 'Pillar III · L1 與基建' },
        defai: { badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20', label: 'Pillar IV · DeFAI 與籌碼' },
        // Macro & Winter Pillars
        rates: { badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20', label: 'Pillar I · 利率與信貸' },
        'hard-assets': { badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20', label: 'Pillar II · 黃金與能源' },
        geopolitics: { badge: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20', label: 'Pillar III · 地緣與流動性' },
        // Gold & Currency Crisis Pillars
        supercycle: { badge: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/25', label: 'Pillar I · 央行與超級週期' },
        liquidity: { badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25', label: 'Pillar II · 清算與事件歸因' },
        'red-team': { badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25', label: 'Pillar III · 紅隊與量化配置' }
    };

    const FALLBACK_PILLAR_STYLE = {
        badge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
        label: 'CORE'
    };

    const DEFAULT_STATUS_STYLES = {
        triggered: { dot: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/30', label: 'TRIGGERED' },
        warning: { dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30', label: 'WARNING' },
        normal: { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30', label: 'NORMAL' }
    };

    const HTML_ESCAPE_MAP = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };

    function escapeHtml(str) {
        return String(str == null ? '' : str).replace(/[&<>\x22\x27]/g, function (ch) {
            return HTML_ESCAPE_MAP[ch];
        });
    }

    function normalizeIndicators(indicators) {
        if (Array.isArray(indicators)) {
            return indicators.filter(Boolean).map(function (item) {
                if (typeof item === 'string') {
                    return { label: '實證指標', value: item };
                }
                return {
                    label: item.label || '實證指標',
                    value: item.value || '待標註'
                };
            });
        }
        if (typeof indicators === 'string' && indicators.trim()) {
            return indicators.split(/[、,]/).map(function (part) {
                return { label: '關鍵指標', value: part.trim() };
            }).filter(function (item) { return Boolean(item.value); }).slice(0, 3);
        }
        return [];
    }

    class TopicHubRenderer {
        constructor(options) {
            const opts = options || {};
            this.data = opts.data || null;
            this.pillarStyles = Object.assign({}, DEFAULT_PILLAR_STYLES, opts.pillarStyles || {});
            this.statusStyles = Object.assign({}, DEFAULT_STATUS_STYLES, opts.statusStyles || {});
            this.ids = Object.assign({
                kpiStrip: 'topic-kpi-strip',
                articleCount: 'telemetry-article-count',
                pillarTabs: 'pillar-tabs',
                matrixContainer: 'topic-matrix-container',
                conceptPills: 'concept-pills-container',
                conceptBox: 'concept-preview-box',
                conceptCode: 'concept-preview-code',
                conceptTitle: 'concept-preview-title',
                conceptDesc: 'concept-preview-desc',
                conceptThreshold: 'concept-preview-threshold',
                conceptClose: 'concept-preview-close',
                searchInput: 'matrix-search-input',
                themeToggle: 'theme-toggle-btn'
            }, opts.ids || {});

            this.activePillar = 'all';
            this.searchQuery = '';
            this._bound = false;
        }

        setData(data) {
            this.data = data;
            return this;
        }

        _resolveData() {
            if (this.data) return this.data;
            if (typeof window !== 'undefined' && window.TOPIC_AI_COT_DATA) {
                this.data = window.TOPIC_AI_COT_DATA;
            }
            return this.data;
        }

        _getInitialPillar(pillars) {
            try {
                const params = new URLSearchParams(window.location.search);
                const p = params.get('pillar');
                if (p && pillars.some(function (x) { return x.id === p; })) return p;
            } catch (e) { /* sandbox fallback */ }
            return 'all';
        }

        _syncUrlParam(pillarId) {
            try {
                const url = new URL(window.location.href);
                if (pillarId === 'all') {
                    url.searchParams.delete('pillar');
                } else {
                    url.searchParams.set('pillar', pillarId);
                }
                window.history.replaceState({}, '', url.toString());
            } catch (e) { /* sandbox iframe safe ignore */ }
        }

        _getPillarStyle(pillarId, pillars) {
            if (this.pillarStyles[pillarId]) {
                return this.pillarStyles[pillarId];
            }
            const matched = (pillars || []).find(function (p) { return p.id === pillarId; });
            return {
                badge: FALLBACK_PILLAR_STYLE.badge,
                label: (matched && matched.label) || pillarId || FALLBACK_PILLAR_STYLE.label
            };
        }

        renderKpiStrip() {
            const data = this._resolveData();
            if (!data) return this;

            const articles = data.articles || [];
            const ledger = data.macro_ledger || [];
            const countEl = document.getElementById(this.ids.articleCount);
            if (countEl) countEl.textContent = articles.length + ' 篇';

            const container = document.getElementById(this.ids.kpiStrip);
            if (!container) return this;

            const statusStyles = this.statusStyles;
            container.innerHTML = ledger.map(function (item) {
                const st = statusStyles[item.status] || statusStyles.normal;
                return [
                    '<div class="p-4 rounded-xl bg-white/95 dark:bg-slate-900/90 border ' + st.border + ' shadow-sm flex flex-col justify-between">',
                    '  <div class="flex items-center justify-between gap-2 mb-1.5">',
                    '    <span class="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">' + escapeHtml(item.name) + '</span>',
                    '    <span class="inline-flex items-center gap-1 text-[10px] font-mono font-semibold ' + st.text + '">',
                    '      <span class="w-1.5 h-1.5 rounded-full ' + st.dot + '"></span>' + escapeHtml(st.label),
                    '    </span>',
                    '  </div>',
                    '  <div class="flex items-baseline gap-2">',
                    '    <span class="font-mono text-2xl font-bold text-slate-900 dark:text-white tracking-tight">' + escapeHtml(item.current) + '</span>',
                    '    <span class="text-[11px] font-mono text-slate-400 truncate">' + escapeHtml(item.baseline) + '</span>',
                    '  </div>',
                    '  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-snug">' + escapeHtml(item.note) + '</p>',
                    '</div>'
                ].join('\n');
            }).join('');

            return this;
        }

        renderTabs() {
            const data = this._resolveData();
            const tabsEl = document.getElementById(this.ids.pillarTabs);
            if (!data || !tabsEl) return this;

            const pillars = data.pillars || [];
            const articles = data.articles || [];
            const activePillar = this.activePillar;
            const self = this;

            tabsEl.innerHTML = pillars.map(function (p) {
                const count = p.id === 'all'
                    ? articles.length
                    : articles.filter(function (a) { return a.pillar === p.id; }).length;
                const isActive = p.id === activePillar;
                const cls = isActive
                    ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 border-cyan-600 dark:border-cyan-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-cyan-500/60';
                return [
                    '<button type="button" role="tab" aria-selected="' + isActive + '" data-pillar="' + escapeHtml(p.id) + '"',
                    '  class="shrink-0 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition flex items-center gap-2 ' + cls + '">',
                    '  <span>' + escapeHtml(p.label) + '</span>',
                    '  <span class="font-mono text-[11px] px-1.5 py-0.5 rounded-md ' + (isActive ? 'bg-black/15 dark:bg-black/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400') + '">' + count + '</span>',
                    '</button>'
                ].join('\n');
            }).join('');

            tabsEl.querySelectorAll('button[data-pillar]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    self.activePillar = btn.getAttribute('data-pillar') || 'all';
                    self._syncUrlParam(self.activePillar);
                    self.renderTabs();
                    self.renderMatrix();
                });
            });

            return this;
        }

        renderMatrix() {
            const data = this._resolveData();
            const container = document.getElementById(this.ids.matrixContainer);
            if (!data || !container) return this;

            const articles = data.articles || [];
            const pillars = data.pillars || [];
            const activePillar = this.activePillar;
            const q = this.searchQuery.trim().toLowerCase();
            const self = this;

            const filtered = articles.filter(function (art) {
                const matchPillar = activePillar === 'all' || art.pillar === activePillar;
                if (!matchPillar) return false;
                if (!q) return true;
                const indicators = normalizeIndicators(art.indicators);
                const haystack = [
                    art.title,
                    art.core_conclusion,
                    art.badge,
                    indicators.map(function (i) { return i.label + ' ' + i.value; }).join(' '),
                    (art.h2_pillars || []).map(function (h) { return h.title; }).join(' ')
                ].join(' ').toLowerCase();
                return haystack.includes(q);
            });

            if (filtered.length === 0) {
                container.innerHTML = [
                    '<div class="col-span-full py-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">',
                    '  <p class="text-sm text-slate-500 dark:text-slate-400 font-mono">找不到符合「' + escapeHtml(this.searchQuery) + '」的研報，請嘗試其他關鍵字或切換回全部維度。</p>',
                    '</div>'
                ].join('\n');
                return this;
            }

            container.innerHTML = filtered.map(function (art) {
                const pStyle = self._getPillarStyle(art.pillar, pillars);
                const indicators = normalizeIndicators(art.indicators);
                const indicatorsHtml = indicators.map(function (ind) {
                    return [
                        '<div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800/80">',
                        '  <div class="text-[10px] text-slate-500 dark:text-slate-400 truncate">' + escapeHtml(ind.label) + '</div>',
                        '  <div class="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate">' + escapeHtml(ind.value) + '</div>',
                        '</div>'
                    ].join('\n');
                }).join('');

                const h2List = art.h2_pillars || [];
                const anchorsHtml = h2List.map(function (h) {
                    return [
                        '<li>',
                        '  <a href="' + escapeHtml(art.url) + '#' + escapeHtml(h.id) + '" class="text-xs text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1.5 py-1 transition">',
                        '    <span class="font-mono text-cyan-500">#</span>',
                        '    <span class="truncate">' + escapeHtml(h.title) + '</span>',
                        '  </a>',
                        '</li>'
                    ].join('\n');
                }).join('');

                return [
                    '<article class="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 p-5 sm:p-6 shadow-sm transition flex flex-col justify-between">',
                    '  <div>',
                    '    <div class="flex items-center justify-between gap-2 mb-3">',
                    '      <div class="flex items-center gap-2 flex-wrap">',
                    '        <span class="text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ' + pStyle.badge + '">' + escapeHtml(pStyle.label) + '</span>',
                    (art.badge ? '        <span class="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">' + escapeHtml(art.badge) + '</span>' : ''),
                    '      </div>',
                    '      <time class="font-mono text-[11px] text-slate-400 shrink-0">' + escapeHtml(art.date) + '</time>',
                    '    </div>',
                    '    <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug font-noto mb-2.5">',
                    '      <a href="' + escapeHtml(art.url) + '" class="group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition">' + escapeHtml(art.title) + '</a>',
                    '    </h3>',
                    '    <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">' + escapeHtml(art.core_conclusion) + '</p>',
                    '    <div class="grid grid-cols-3 gap-2 mb-4">' + indicatorsHtml + '</div>',
                    '  </div>',
                    '  <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2.5">',
                    '    <details class="w-full">',
                    '      <summary class="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer select-none">',
                    '        <span>展開核心論點錨點 (' + h2List.length + ')</span>',
                    '        <span class="chevron-icon transition-transform text-[10px]">▼</span>',
                    '      </summary>',
                    '      <ul class="mt-2 p-2.5 rounded-lg bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800/70 space-y-0.5">' + anchorsHtml + '</ul>',
                    '    </details>',
                    '    <div class="flex justify-end">',
                    '      <a href="' + escapeHtml(art.url) + '" class="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-700 dark:text-cyan-400 hover:underline">閱讀完整深度研報 <span>→</span></a>',
                    '    </div>',
                    '  </div>',
                    '</article>'
                ].join('\n');
            }).join('');

            return this;
        }

        renderConceptPills() {
            const data = this._resolveData();
            const pillsEl = document.getElementById(this.ids.conceptPills);
            const box = document.getElementById(this.ids.conceptBox);
            if (!data || !pillsEl || !box) return this;

            const concepts = data.concepts || [];
            const codeEl = document.getElementById(this.ids.conceptCode);
            const titleEl = document.getElementById(this.ids.conceptTitle);
            const descEl = document.getElementById(this.ids.conceptDesc);
            const threshEl = document.getElementById(this.ids.conceptThreshold);
            const closeBtn = document.getElementById(this.ids.conceptClose);

            pillsEl.innerHTML = concepts.map(function (c) {
                return [
                    '<button type="button" data-concept-id="' + escapeHtml(c.id) + '"',
                    '  class="px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-300 transition flex items-center gap-1.5 shadow-sm">',
                    '  <span class="font-mono text-cyan-500">#</span>',
                    '  <span>' + escapeHtml(c.title) + '</span>',
                    '</button>'
                ].join('\n');
            }).join('');

            pillsEl.querySelectorAll('button[data-concept-id]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    const id = btn.getAttribute('data-concept-id');
                    const concept = concepts.find(function (c) { return c.id === id; });
                    if (!concept) return;
                    if (codeEl) codeEl.textContent = concept.code || '';
                    if (titleEl) titleEl.textContent = concept.title || '';
                    if (descEl) descEl.textContent = concept.desc || '';
                    if (threshEl) threshEl.textContent = concept.threshold || '';
                    box.classList.remove('hidden');
                });
            });

            if (closeBtn && !closeBtn.dataset.bound) {
                closeBtn.dataset.bound = '1';
                closeBtn.addEventListener('click', function () {
                    box.classList.add('hidden');
                });
            }

            return this;
        }

        bindControls() {
            if (this._bound) return this;
            this._bound = true;
            const self = this;

            const searchInput = document.getElementById(this.ids.searchInput);
            if (searchInput) {
                searchInput.addEventListener('input', function (e) {
                    self.searchQuery = e.target.value || '';
                    self.renderMatrix();
                });
            }

            const themeBtn = document.getElementById(this.ids.themeToggle);
            if (themeBtn) {
                themeBtn.addEventListener('click', function () {
                    const isDark = document.documentElement.classList.toggle('dark');
                    try {
                        localStorage.setItem('theme', isDark ? 'dark' : 'light');
                    } catch (e) { /* ignore */ }
                });
            }

            return this;
        }

        init() {
            const data = this._resolveData();
            if (!data) return this;

            this.activePillar = this._getInitialPillar(data.pillars || []);
            this.renderKpiStrip();
            this.renderTabs();
            this.renderMatrix();
            this.renderConceptPills();
            this.bindControls();
            return this;
        }
    }

    TopicHubRenderer.init = function (options) {
        return new TopicHubRenderer(options).init();
    };

    return TopicHubRenderer;
}));
