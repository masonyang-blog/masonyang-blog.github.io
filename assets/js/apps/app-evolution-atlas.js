/**
 * Content Evolution Atlas 協調層 (Zero-Build)
 * 職責：
 * 1. Join window.__EVOLUTION_ATLAS__、ArticleRepository、PULSE_DATA 與 _knowledgeData
 * 2. 渲染視圖 A（四級演化漏斗、Top 5 行動佇列、Topic 狀態矩陣、Tag 賽道熱圖）
 * 3. 驅動視圖 C（<mason-knowledge-graph> Topology/Tree 切換、點線面色盤、濾鏡、1-Hop 展開）
 * 4. 驅動 Inspector Drawer（In/Out-Links、修補建議、複製 Markdown 修補清單）
 * 5. 雙向同步頂部 Header 搜尋框與 URL Query 參數
 */
(function (global) {
    'use strict';

    const SITE_ORIGIN = 'https://masonyang-blog.github.io';
    const LAYER_ORDER = ['L1C_PLANE_TOPIC', 'L2_LINE_POST', 'L2_LINE_NEWS', 'L2_LINE_AI_WORKFLOW', 'L1B_POINT_KNOWLEDGE', 'L1A_POINT_PROJECT', 'L0_PULSE'];

    const LAYER_CONFIG = {
        L1C_PLANE_TOPIC: { label: '面 · 專題中樞', short: 'Topic Hub', color: '#8b5cf6', dotClass: 'bg-violet-500', badgeClass: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300', defaultOn: true },
        L2_LINE_POST: { label: '線 · 長青文', short: 'Post', color: '#2563eb', dotClass: 'bg-blue-600', badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300', defaultOn: true },
        L2_LINE_NEWS: { label: '線 · 研報切片', short: 'News', color: '#06b6d4', dotClass: 'bg-cyan-500', badgeClass: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300', defaultOn: true },
        L2_LINE_AI_WORKFLOW: { label: '線 · AI 工作流', short: 'AI Workflow', color: '#14b8a6', dotClass: 'bg-teal-500', badgeClass: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300', defaultOn: true },
        L1B_POINT_KNOWLEDGE: { label: '點 · 知識卡片', short: 'Knowledge', color: '#f59e0b', dotClass: 'bg-amber-500', badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300', defaultOn: false },
        L1A_POINT_PROJECT: { label: '點 · 專案實體', short: 'Project', color: '#ec4899', dotClass: 'bg-pink-500', badgeClass: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300', defaultOn: false },
        L0_PULSE: { label: '脈衝 · Pulse', short: 'Pulse', color: '#64748b', dotClass: 'bg-slate-500', badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', defaultOn: false }
    };

    const EDGE_STYLE = {
        callout_backfill: { label: 'Callout 回灌', color: '#10b981', dashed: false, badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
        timeline_cite: { label: '時間軸引用', color: '#3b82f6', dashed: false, badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
        hub_aggregate: { label: '中樞聚合', color: '#8b5cf6', dashed: false, badgeClass: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300' },
        body_link: { label: '內文互連', color: '#94a3b8', dashed: false, badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
        entity_link: { label: '點實體連結', color: '#f59e0b', dashed: false, badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
        pulse_ref: { label: 'Pulse 導流', color: '#64748b', dashed: false, badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
        gap_suggest: { label: '缺口修補建議', color: '#ef4444', dashed: true, badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' }
    };

    const STATUS_BADGE = {
        POST_ACTIVE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        TOPIC_READY: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
        READY_FOR_POST: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
        ACCUMULATING: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
    };

    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\x22/g, '&quot;')
            .replace(/\x27/g, '&#39;');
    }

    function normalizeLink(raw) {
        if (!raw) return '';
        return String(raw).trim().replace(/^(\.\.\/)+/, '').replace(/^\.\//, '').replace(/^\//, '');
    }

    function slugToTitle(key) {
        const clean = String(key).replace(/^pulse:/, '').replace(/^[^/]+\//, '').replace(/\.html$/, '');
        return clean.replace(/[-_]+/g, ' ');
    }

    class EvolutionAtlasApp {
        constructor() {
            this.atlas = null;
            this.nodesMap = new Map();
            this.inEdgesMap = new Map();
            this.outEdgesMap = new Map();
            this.backfillMap = new Map();
            this.freshnessMap = new Map();
            this.sameWaveMap = new Map();
            this.graphEl = null;
            this.toastTimer = null;

            this.state = {
                view: 'dashboard', // 'dashboard' | 'graph'
                mode: 'topology',  // 'topology' | 'tree'
                topic: 'all',
                layers: new Set(Object.keys(LAYER_CONFIG).filter(k => LAYER_CONFIG[k].defaultOn)),
                filter: 'all',     // 'all' | 'orphan' | 'no_callout' | 'no_timeline'
                showEntity: false,
                showGap: false,
                search: '',
                selectedNodeId: null
            };
        }

        init() {
            this.atlas = global.__EVOLUTION_ATLAS__;
            if (!this.atlas || !this.atlas.meta || !this.atlas.layers) {
                this._showError('找不到全站演化資料 (window.__EVOLUTION_ATLAS__)，請先執行 `py apps/content-evolution-atlas/build_evolution_atlas.py`。');
                return this;
            }

            this.graphEl = document.getElementById('atlas-graph-engine');
            this._buildJoinedIndex();
            this._readUrlState();
            this._renderMetaHeader();
            this._renderFilterControls();
            this._bindUIEvents();
            this._bindHeaderSearchIntercept();
            this._renderDashboard();
            this._applyViewState(false);

            return this;
        }

        _showError(msg) {
            const el = document.getElementById('atlas-error-banner');
            if (!el) return;
            el.textContent = msg;
            el.classList.remove('hidden');
        }

        _showToast(msg) {
            const el = document.getElementById('atlas-toast');
            if (!el) return;
            el.textContent = msg;
            el.classList.remove('hidden');
            if (this.toastTimer) clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => el.classList.add('hidden'), 2400);
        }

        // =====================================================================
        // 1. Join SSOT 資料層（不重複儲存 title/topicId/tags）
        // =====================================================================
        _buildJoinedIndex() {
            const taxonomy = global.TaxonomyManager || null;
            const articles = (global.ArticleRepository && Array.isArray(global.ArticleRepository.all))
                ? global.ArticleRepository.all
                : (Array.isArray(global._ARTICLES_RAW) ? global._ARTICLES_RAW : []);
            const pulses = Array.isArray(global.PULSE_DATA) ? global.PULSE_DATA : [];
            const knowledgeList = Array.isArray(global._knowledgeData) ? global._knowledgeData : [];

            const articleByLink = new Map();
            articles.forEach(a => {
                const key = normalizeLink(a.link);
                if (key) articleByLink.set(key, a);
            });

            const pulseByKey = new Map();
            pulses.forEach(p => {
                if (p && p.id) pulseByKey.set(`pulse:${p.id}`, p);
            });

            const knowledgeByLink = new Map();
            knowledgeList.forEach(k => {
                const link = normalizeLink(k.link || (k.id ? `knowledge/${k.id}.html` : ''));
                if (link) knowledgeByLink.set(link, k);
            });

            const layers = this.atlas.layers || {};
            const metrics = this.atlas.metrics || {};

            Object.keys(layers).forEach(key => {
                const layer = layers[key];
                const cfg = LAYER_CONFIG[layer] || LAYER_CONFIG.L0_PULSE;
                const m = metrics[key] || { inDegree: 0, outDegree: 0, hasCallout: false, hasTimeline: false, uncitedNewerNewsCount: 0 };

                let title = slugToTitle(key);
                let topicId = 'topic-uncategorized';
                let tags = [];
                let date = '';
                let desc = '';
                let url = key.startsWith('pulse:') ? '../../pulse.html' : `../../${key}`;

                if (key.startsWith('pulse:')) {
                    const p = pulseByKey.get(key);
                    if (p) {
                        title = p.title || title;
                        tags = Array.isArray(p.tags) ? p.tags : [];
                        date = p.date || '';
                        desc = p.plain_text || '';
                        if (taxonomy && typeof taxonomy.resolveTopic === 'function') {
                            const resolved = taxonomy.resolveTopic({ tags });
                            if (resolved && resolved.id) topicId = resolved.id;
                        }
                    }
                } else {
                    const art = articleByLink.get(key);
                    const kn = knowledgeByLink.get(key);
                    if (art) {
                        title = art.title || title;
                        tags = Array.isArray(art.tags) ? art.tags : [];
                        date = art.date || '';
                        desc = art.desc || art.summary || '';
                        if (art.topicId) {
                            topicId = art.topicId;
                        } else if (taxonomy && typeof taxonomy.resolveTopic === 'function') {
                            const resolved = taxonomy.resolveTopic(art);
                            if (resolved && resolved.id) topicId = resolved.id;
                        }
                    } else if (kn) {
                        title = kn.title || kn.name || title;
                        desc = kn.summary || kn.desc || '';
                        if (kn.topicId) {
                            topicId = kn.topicId;
                        } else if (kn.category && taxonomy && typeof taxonomy.resolveTopic === 'function') {
                            const resolved = taxonomy.resolveTopic(kn);
                            if (resolved && resolved.id) topicId = resolved.id;
                        }
                    }
                }

                this.nodesMap.set(key, {
                    id: key,
                    label: title,
                    title,
                    layer,
                    type: cfg.short,
                    color: cfg.color,
                    topicId,
                    category: topicId,
                    tags,
                    date,
                    desc,
                    url,
                    metrics: m
                });
                this.inEdgesMap.set(key, []);
                this.outEdgesMap.set(key, []);
            });

            // 索引邊（In/Out）
            (this.atlas.edges || []).forEach(e => {
                if (!this.nodesMap.has(e.source) || !this.nodesMap.has(e.target)) return;
                this.outEdgesMap.get(e.source).push(e);
                this.inEdgesMap.get(e.target).push(e);
            });

            // 索引演化缺口以供 Inspector 快速查詢
            const evo = this.atlas.evolution || {};
            (evo.backfill_candidates || []).forEach(item => {
                if (item.news_link) this.backfillMap.set(item.news_link, item);
            });
            (evo.freshness_gaps || []).forEach(item => {
                if (item.post_link) this.freshnessMap.set(item.post_link, item);
            });
            (evo.same_wave_clusters || []).forEach(item => {
                if (!item.consolidated) {
                    [item.earlier_link, item.later_link].forEach(lk => {
                        if (!lk) return;
                        if (!this.sameWaveMap.has(lk)) this.sameWaveMap.set(lk, []);
                        this.sameWaveMap.get(lk).push(item);
                    });
                }
            });
        }

        // =====================================================================
        // 2. URL 參數同步
        // =====================================================================
        _readUrlState() {
            const params = new URLSearchParams(global.location.search);
            const view = params.get('view');
            if (view === 'dashboard' || view === 'graph') this.state.view = view;

            const mode = params.get('mode');
            if (mode === 'topology' || mode === 'tree') this.state.mode = mode;

            const topic = params.get('topic');
            if (topic) this.state.topic = topic;

            const layerParam = params.get('layer');
            if (layerParam) {
                const parsed = layerParam.split(',').filter(l => LAYER_CONFIG[l]);
                if (parsed.length > 0) this.state.layers = new Set(parsed);
            }

            const filter = params.get('filter');
            if (['all', 'orphan', 'no_callout', 'no_timeline'].includes(filter)) {
                this.state.filter = filter;
            }

            if (params.get('entity') === '1') this.state.showEntity = true;
            if (params.get('gap') === '1') this.state.showGap = true;

            const q = params.get('q');
            if (q) this.state.search = q.trim();

            const node = params.get('node');
            if (node && this.nodesMap.has(node)) {
                this.state.selectedNodeId = node;
                if (!view) this.state.view = 'graph';
            }
        }

        _syncUrlState() {
            if (!global.history || typeof global.history.replaceState !== 'function') return;
            const params = new URLSearchParams();
            if (this.state.view !== 'dashboard') params.set('view', this.state.view);
            if (this.state.mode !== 'topology') params.set('mode', this.state.mode);
            if (this.state.topic !== 'all') params.set('topic', this.state.topic);

            const defaultLayers = Object.keys(LAYER_CONFIG).filter(k => LAYER_CONFIG[k].defaultOn).sort().join(',');
            const currentLayers = Array.from(this.state.layers).sort().join(',');
            if (currentLayers !== defaultLayers) params.set('layer', currentLayers);

            if (this.state.filter !== 'all') params.set('filter', this.state.filter);
            if (this.state.showEntity) params.set('entity', '1');
            if (this.state.showGap) params.set('gap', '1');
            if (this.state.search) params.set('q', this.state.search);
            if (this.state.selectedNodeId) params.set('node', this.state.selectedNodeId);

            const qs = params.toString();
            const nextUrl = qs ? `${global.location.pathname}?${qs}` : global.location.pathname;
            global.history.replaceState(null, '', nextUrl);
        }

        // =====================================================================
        // 3. Header Meta & Filter Controls 渲染
        // =====================================================================
        _renderMetaHeader() {
            const meta = this.atlas.meta || {};
            const gen = meta.generated || {};
            const counts = meta.counts || {};

            const genEl = document.getElementById('atlas-meta-generated');
            if (genEl) {
                const gscTag = gen.gsc_source ? ` · GSC: ${gen.gsc_source}` : ' · GSC: 未載入';
                genEl.textContent = `資料基準日 ${gen.date || '—'} · 節點 ${counts.total_nodes ?? 0} · 真實邊 ${counts.real_edges ?? 0}${gscTag}`;
            }

            const edgeSummaryEl = document.getElementById('atlas-edge-summary');
            if (edgeSummaryEl) {
                edgeSummaryEl.textContent = `真實連結 ${counts.real_edges ?? 0} 條 / 缺口建議 ${counts.gap_edges ?? 0} 條 / 孤兒 ${counts.orphan_nodes ?? 0} 篇`;
            }
        }

        _renderFilterControls() {
            // Topic 下拉選單
            const topicSelect = document.getElementById('filter-topic-select');
            if (topicSelect) {
                const topics = (this.atlas.evolution && this.atlas.evolution.topics) || [];
                const optionsHtml = ['<option value="all">全部主題 (All Topics)</option>']
                    .concat(topics.map(t => `<option value="${escapeHtml(t.topicId)}">${escapeHtml(t.topicName || t.topicId)} (${t.news_count}N / ${t.post_count}P)</option>`))
                    .join('');
                topicSelect.innerHTML = optionsHtml;
                topicSelect.value = this.state.topic;
            }

            // 層級開關群組
            const layerGroup = document.getElementById('layer-filter-group');
            if (layerGroup) {
                const layerCounts = (this.atlas.meta && this.atlas.meta.counts && this.atlas.meta.counts.layers) || {};
                layerGroup.innerHTML = Object.keys(LAYER_CONFIG).map(layerKey => {
                    const cfg = LAYER_CONFIG[layerKey];
                    const checked = this.state.layers.has(layerKey) ? 'checked' : '';
                    const cnt = layerCounts[layerKey] ?? 0;
                    return `
                      <label class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs cursor-pointer select-none">
                        <input type="checkbox" data-layer="${layerKey}" ${checked} class="rounded text-blue-600 focus:ring-blue-500" />
                        <span class="w-2 h-2 rounded-full ${cfg.dotClass}"></span>
                        <span class="text-slate-700 dark:text-slate-200">${escapeHtml(cfg.short)}</span>
                        <span class="text-[11px] font-mono text-slate-400">${cnt}</span>
                      </label>
                    `;
                }).join('');
            }

            // 同步其他輸入控件
            const anomalySelect = document.getElementById('filter-anomaly-select');
            if (anomalySelect) anomalySelect.value = this.state.filter;

            const entityToggle = document.getElementById('toggle-entity-link');
            if (entityToggle) entityToggle.checked = this.state.showEntity;

            const gapToggle = document.getElementById('toggle-gap-suggest');
            if (gapToggle) gapToggle.checked = this.state.showGap;

            const searchInput = document.getElementById('atlas-search-input');
            if (searchInput) searchInput.value = this.state.search;
        }

        // =====================================================================
        // 4. 視圖 A：演化總覽 Dashboard
        // =====================================================================
        _renderDashboard() {
            this._renderKpiGrid();
            this._renderActionQueue();
            this._renderMetricsFreshness();
            this._renderTopicMatrix();
            this._renderTagHeatmap();
        }

        _renderKpiGrid() {
            const el = document.getElementById('atlas-kpi-grid');
            if (!el) return;
            const ov = (this.atlas.evolution && this.atlas.evolution.overview) || {};
            const counts = (this.atlas.meta && this.atlas.meta.counts) || {};
            const layerCounts = counts.layers || {};

            const newsCount = ov.news_count || 0;
            const calloutPct = newsCount > 0 ? Math.round(((ov.news_with_callout_count || 0) / newsCount) * 100) : 0;
            const postCount = ov.evergreen_post_count || 0;
            const timelinePct = postCount > 0 ? Math.round(((ov.posts_with_timeline_count || 0) / postCount) * 100) : 0;

            const cards = [
                { title: 'L0 脈衝快訊', value: ov.pulse_count ?? layerCounts.L0_PULSE ?? 0, sub: 'Pulse 訊號池', accent: 'text-slate-700 dark:text-slate-200', filterAction: () => this._jumpToLayer('L0_PULSE') },
                { title: 'L2 研報切片', value: newsCount, sub: `Callout 回灌 ${ov.news_with_callout_count ?? 0} (${calloutPct}%)`, accent: 'text-cyan-600 dark:text-cyan-400', filterAction: () => this._jumpToFilter('no_callout') },
                { title: 'L2 長青文', value: postCount, sub: `時間軸保鮮 ${ov.posts_with_timeline_count ?? 0} (${timelinePct}%)`, accent: 'text-blue-600 dark:text-blue-400', filterAction: () => this._jumpToFilter('no_timeline') },
                { title: 'L1C 專題中樞', value: ov.topic_hub_count ?? layerCounts.L1C_PLANE_TOPIC ?? 0, sub: '面級聚合頁', accent: 'text-violet-600 dark:text-violet-400', filterAction: () => this._jumpToLayer('L1C_PLANE_TOPIC') },
                { title: 'L1 點實體庫', value: (layerCounts.L1B_POINT_KNOWLEDGE ?? 0) + (layerCounts.L1A_POINT_PROJECT ?? 0), sub: `知識 ${layerCounts.L1B_POINT_KNOWLEDGE ?? 0} · 專案 ${layerCounts.L1A_POINT_PROJECT ?? 0}`, accent: 'text-amber-600 dark:text-amber-400', filterAction: () => this._jumpToLayer('L1B_POINT_KNOWLEDGE') },
                { title: '孤兒節點', value: counts.orphan_nodes ?? 0, sub: '站內連入 In=0', accent: 'text-rose-600 dark:text-rose-400', filterAction: () => this._jumpToFilter('orphan') }
            ];

            el.innerHTML = cards.map((c, idx) => `
              <button type="button" data-kpi-idx="${idx}" class="text-left bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 shadow-sm p-4 transition-all group">
                <div class="text-xs font-medium text-slate-500 dark:text-slate-400">${escapeHtml(c.title)}</div>
                <div class="text-2xl sm:text-3xl font-extrabold font-mono mt-1 ${c.accent}">${c.value}</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">${escapeHtml(c.sub)} ➔</div>
              </button>
            `).join('');

            el.querySelectorAll('[data-kpi-idx]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = Number(btn.getAttribute('data-kpi-idx'));
                    if (cards[idx] && cards[idx].filterAction) cards[idx].filterAction();
                });
            });
        }

        _renderActionQueue() {
            const el = document.getElementById('atlas-action-queue');
            if (!el) return;
            const queue = (this.atlas.evolution && this.atlas.evolution.action_queue) || [];
            if (queue.length === 0) {
                el.innerHTML = '<p class="text-xs text-slate-500 col-span-full">目前無待辦行動項目。</p>';
                return;
            }

            el.innerHTML = queue.map(item => {
                const node = this.nodesMap.get(item.target);
                const title = node ? node.title : item.target;
                const relatedNode = item.related ? this.nodesMap.get(item.related) : null;
                return `
                  <button type="button" data-action-target="${escapeHtml(item.target)}" class="text-left flex flex-col justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all">
                    <div>
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">P${escapeHtml(item.priority)}</span>
                        <span class="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">${escapeHtml(item.mode || item.category)}</span>
                      </div>
                      <div class="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug mb-1.5">${escapeHtml(title)}</div>
                      <div class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">${escapeHtml(item.reason || '')}</div>
                    </div>
                    ${relatedNode ? `<div class="mt-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-700/70 text-[11px] text-slate-500 dark:text-slate-400 truncate">關聯：${escapeHtml(relatedNode.title)}</div>` : ''}
                  </button>
                `;
            }).join('');

            el.querySelectorAll('[data-action-target]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const target = btn.getAttribute('data-action-target');
                    if (target) this.focusNodeInGraph(target, { showGap: true });
                });
            });
        }

        _renderMetricsFreshness() {
            const summaryEl = document.getElementById('atlas-metrics-freshness-summary');
            const gridEl = document.getElementById('atlas-metrics-freshness-grid');
            const gapsEl = document.getElementById('atlas-metrics-evergreen-gaps');
            if (!gridEl) return;

            const mf = this.atlas.evolution && this.atlas.evolution.metrics_freshness;
            if (!mf || !mf.available || !Array.isArray(mf.topics) || mf.topics.length === 0) {
                if (summaryEl) summaryEl.innerHTML = '';
                gridEl.innerHTML = '<p class="text-xs text-slate-500 col-span-full">尚無中央指標新鮮度資料，請重新執行 build_evolution_atlas.py。</p>';
                if (gapsEl) gapsEl.innerHTML = '';
                return;
            }

            const sum = mf.summary || {};
            if (summaryEl) {
                summaryEl.innerHTML = `
                  <span class="px-2 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">FRESH ${sum.fresh_count ?? 0}</span>
                  <span class="px-2 py-0.5 rounded-md font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">STALE ${sum.stale_count ?? 0}</span>
                  <span class="px-2 py-0.5 rounded-md font-bold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">STATIC ${sum.static_count ?? 0}</span>
                  <span class="px-2 py-0.5 rounded-md font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">長青落後 ${sum.evergreen_gap_count ?? 0}</span>
                  ${mf.registry_updated_at ? `<span class="font-mono text-slate-400 dark:text-slate-500 ml-1">帳本 ${escapeHtml(mf.registry_updated_at)}</span>` : ''}
                `;
            }

            const freshnessBadge = {
                FRESH: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
                STALE: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
                STATIC: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            };

            gridEl.innerHTML = mf.topics.map(item => {
                const hubNode = this.nodesMap.get(item.hub_page);
                const hubTitle = hubNode ? hubNode.title : item.topic;
                const badgeCls = freshnessBadge[item.status] || freshnessBadge.STATIC;
                const borderCls = item.status === 'STALE'
                    ? 'border-rose-300/90 dark:border-rose-800/80 hover:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-400';

                return `
                  <button type="button" data-freshness-hub="${escapeHtml(item.hub_page)}" class="text-left flex flex-col justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-slate-800 border ${borderCls} transition-all">
                    <div>
                      <div class="flex items-center justify-between gap-2 mb-1.5">
                        <span class="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 truncate">${escapeHtml(item.topic)}</span>
                        <span class="px-2 py-0.5 rounded-md text-[10px] font-bold flex-shrink-0 ${badgeCls}">${escapeHtml(item.status)}</span>
                      </div>
                      <div class="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mb-2">${escapeHtml(hubTitle)}</div>
                      <div class="grid grid-cols-2 gap-1.5 text-[11px] mb-2">
                        <div class="rounded-lg bg-white dark:bg-slate-900 px-2 py-1 border border-slate-200/70 dark:border-slate-700/70">
                          <div class="text-slate-400 text-[10px]">帳本最新指標</div>
                          <div class="font-mono font-bold text-slate-800 dark:text-slate-200">${escapeHtml(item.ledger_max_updated_at || '—')}</div>
                        </div>
                        <div class="rounded-lg bg-white dark:bg-slate-900 px-2 py-1 border border-slate-200/70 dark:border-slate-700/70">
                          <div class="text-slate-400 text-[10px]">Hub 最新引用</div>
                          <div class="font-mono font-bold ${item.status === 'STALE' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}">${escapeHtml(item.latest_cited_news_date || '—')}</div>
                        </div>
                      </div>
                    </div>
                    <div class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">${escapeHtml(item.message || '')}</div>
                  </button>
                `;
            }).join('');

            gridEl.querySelectorAll('[data-freshness-hub]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const hubPage = btn.getAttribute('data-freshness-hub');
                    if (hubPage) this.focusNodeInGraph(hubPage);
                });
            });

            if (gapsEl) {
                const gaps = Array.isArray(mf.evergreen_gaps_top10) ? mf.evergreen_gaps_top10 : [];
                if (gaps.length === 0) {
                    gapsEl.innerHTML = '<div class="text-xs text-emerald-600 dark:text-emerald-400">所有受管長青文皆無待收錄之新研報落差。</div>';
                    return;
                }
                gapsEl.innerHTML = `
                  <div class="flex items-center justify-between gap-2 mb-2.5">
                    <h3 class="text-xs font-bold text-slate-700 dark:text-slate-200">Top ${gaps.length} 長青文更新落後清單 (Evergreen Freshness Gaps)</h3>
                    <span class="text-[11px] font-mono text-slate-400 dark:text-slate-500">共 ${sum.evergreen_gap_count ?? gaps.length} 篇</span>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    ${gaps.map(g => {
                        const postNode = this.nodesMap.get(g.post_link);
                        const postTitle = postNode ? postNode.title : g.post_link;
                        return `
                          <button type="button" data-gap-post="${escapeHtml(g.post_link)}" class="text-left flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50/70 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-400 transition-all">
                            <div class="min-w-0">
                              <div class="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">${escapeHtml(postTitle)}</div>
                              <div class="text-[11px] font-mono text-slate-400 dark:text-slate-500">更新日 ${escapeHtml(g.date_modified || '—')}</div>
                            </div>
                            <span class="px-2 py-0.5 rounded-md text-[11px] font-bold font-mono flex-shrink-0 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">+${Number(g.uncited_newer_news_count || 0)} 篇</span>
                          </button>
                        `;
                    }).join('')}
                  </div>
                `;

                gapsEl.querySelectorAll('[data-gap-post]').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const postLink = btn.getAttribute('data-gap-post');
                        if (postLink) this.focusNodeInGraph(postLink, { showGap: true });
                    });
                });
            }
        }

        _renderTopicMatrix() {
            const el = document.getElementById('atlas-topic-matrix');
            if (!el) return;
            const topics = (this.atlas.evolution && this.atlas.evolution.topics) || [];
            if (topics.length === 0) {
                el.innerHTML = '<p class="text-xs text-slate-500">尚無主題資料。</p>';
                return;
            }

            el.innerHTML = topics.map(t => {
                const badgeCls = STATUS_BADGE[t.status] || STATUS_BADGE.ACCUMULATING;
                const calloutRate = t.news_count > 0 ? Math.round((t.callout_count / t.news_count) * 100) : 0;
                return `
                  <button type="button" data-topic-id="${escapeHtml(t.topicId)}" class="w-full text-left p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all">
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="text-sm font-bold text-slate-900 dark:text-white truncate">${escapeHtml(t.topicName || t.topicId)}</span>
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-bold flex-shrink-0 ${badgeCls}">${escapeHtml(t.status)}</span>
                    </div>
                    <div class="grid grid-cols-5 gap-1.5 text-center text-[11px]">
                      <div class="rounded-lg bg-white dark:bg-slate-900 py-1 border border-slate-200/70 dark:border-slate-700/70">
                        <div class="text-slate-400">Hub</div>
                        <div class="font-bold font-mono text-violet-600 dark:text-violet-400">${t.hub_count ?? 0}</div>
                      </div>
                      <div class="rounded-lg bg-white dark:bg-slate-900 py-1 border border-slate-200/70 dark:border-slate-700/70">
                        <div class="text-slate-400">Post</div>
                        <div class="font-bold font-mono text-blue-600 dark:text-blue-400">${t.post_count ?? 0}</div>
                      </div>
                      <div class="rounded-lg bg-white dark:bg-slate-900 py-1 border border-slate-200/70 dark:border-slate-700/70">
                        <div class="text-slate-400">News</div>
                        <div class="font-bold font-mono text-cyan-600 dark:text-cyan-400">${t.news_count ?? 0}</div>
                      </div>
                      <div class="rounded-lg bg-white dark:bg-slate-900 py-1 border border-slate-200/70 dark:border-slate-700/70">
                        <div class="text-slate-400">Pulse</div>
                        <div class="font-bold font-mono text-slate-600 dark:text-slate-300">${t.pulse_count ?? 0}</div>
                      </div>
                      <div class="rounded-lg bg-white dark:bg-slate-900 py-1 border border-slate-200/70 dark:border-slate-700/70">
                        <div class="text-slate-400">Callout</div>
                        <div class="font-bold font-mono text-emerald-600 dark:text-emerald-400">${calloutRate}%</div>
                      </div>
                    </div>
                  </button>
                `;
            }).join('');

            el.querySelectorAll('[data-topic-id]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const tid = btn.getAttribute('data-topic-id');
                    this.state.topic = tid || 'all';
                    this.state.filter = 'all';
                    this.state.search = '';
                    this.state.view = 'graph';
                    this._renderFilterControls();
                    this._applyViewState(true);
                });
            });
        }

        _renderTagHeatmap() {
            const el = document.getElementById('atlas-tag-heatmap');
            if (!el) return;
            const tags = (this.atlas.evolution && this.atlas.evolution.tags) || [];
            if (tags.length === 0) {
                el.innerHTML = '<p class="text-xs text-slate-500 col-span-full">尚無標籤賽道資料。</p>';
                return;
            }

            el.innerHTML = tags.map(tg => {
                const badgeCls = STATUS_BADGE[tg.status] || STATUS_BADGE.ACCUMULATING;
                return `
                  <button type="button" data-tag-id="${escapeHtml(tg.tag)}" class="text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all">
                    <div class="flex items-center justify-between gap-1.5 mb-1.5">
                      <span class="text-xs font-bold font-mono text-slate-800 dark:text-slate-100 truncate">#${escapeHtml(tg.tag)}</span>
                      <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold flex-shrink-0 ${badgeCls}">${escapeHtml(tg.status)}</span>
                    </div>
                    <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <span>N:${tg.news_count ?? 0}</span>
                      <span>P:${tg.post_count ?? 0}</span>
                      <span>C:${tg.callout_count ?? 0}</span>
                      <span>W:${tg.wave_months ?? 0}m</span>
                    </div>
                  </button>
                `;
            }).join('');

            el.querySelectorAll('[data-tag-id]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const tag = btn.getAttribute('data-tag-id') || '';
                    this.state.search = tag;
                    this.state.topic = 'all';
                    this.state.filter = 'all';
                    this.state.view = 'graph';
                    this._renderFilterControls();
                    this._applyViewState(true);
                });
            });
        }

        // =====================================================================
        // 5. 視圖 C：圖譜建構與濾鏡（含 1-Hop 自動展開與 Tree View 支援）
        // =====================================================================
        _buildFilteredTopology() {
            const q = this.state.search.toLowerCase();
            const baseNodeIds = new Set();

            this.nodesMap.forEach((node, id) => {
                if (!this.state.layers.has(node.layer)) return;
                if (this.state.topic !== 'all' && node.topicId !== this.state.topic) return;

                if (this.state.filter === 'orphan' && (node.metrics.inDegree || 0) !== 0) return;
                if (this.state.filter === 'no_callout' && !(node.layer === 'L2_LINE_NEWS' && !node.metrics.hasCallout)) return;
                if (this.state.filter === 'no_timeline' && !(node.layer === 'L2_LINE_POST' && (!node.metrics.hasTimeline || (node.metrics.uncitedNewerNewsCount || 0) > 0))) return;

                if (q) {
                    const hay = `${node.title} ${node.id} ${(node.tags || []).join(' ')}`.toLowerCase();
                    if (!hay.includes(q)) return;
                }

                baseNodeIds.add(id);
            });

            // 若有選中節點，確保該節點與其 1-Hop 鄰居一併展開顯示
            const visibleIds = new Set(baseNodeIds);
            let expandedHopCount = 0;
            if (this.state.selectedNodeId && this.nodesMap.has(this.state.selectedNodeId)) {
                const sid = this.state.selectedNodeId;
                visibleIds.add(sid);
                const considerEdge = (e) => {
                    if (e.type === 'gap_suggest' && !this.state.showGap) return false;
                    return true;
                };
                (this.inEdgesMap.get(sid) || []).forEach(e => {
                    if (considerEdge(e) && !visibleIds.has(e.source)) {
                        visibleIds.add(e.source);
                        expandedHopCount++;
                    }
                });
                (this.outEdgesMap.get(sid) || []).forEach(e => {
                    if (considerEdge(e) && !visibleIds.has(e.target)) {
                        visibleIds.add(e.target);
                        expandedHopCount++;
                    }
                });
            }

            const graphNodes = [];
            visibleIds.forEach(id => {
                const n = this.nodesMap.get(id);
                if (!n) return;
                graphNodes.push({
                    id: n.id,
                    label: n.label,
                    type: n.type,
                    category: n.topicId,
                    color: n.color,
                    desc: `${LAYER_CONFIG[n.layer]?.label || n.layer} · In:${n.metrics.inDegree} / Out:${n.metrics.outDegree}`
                });
            });

            const graphEdges = [];
            (this.atlas.edges || []).forEach(e => {
                if (!visibleIds.has(e.source) || !visibleIds.has(e.target)) return;
                if (e.type === 'entity_link' && !this.state.showEntity) {
                    // 選中節點的 1-Hop 實體連結仍可顯示，否則隱藏
                    const isSelectedEdge = this.state.selectedNodeId && (e.source === this.state.selectedNodeId || e.target === this.state.selectedNodeId);
                    if (!isSelectedEdge) return;
                }
                if (e.type === 'gap_suggest' && !this.state.showGap) return;

                const style = EDGE_STYLE[e.type] || EDGE_STYLE.body_link;
                graphEdges.push({
                    source: e.source,
                    target: e.target,
                    type: e.type,
                    color: style.color,
                    dashed: style.dashed
                });
            });

            // Tree View 需注入 Category 根節點 (cat-<topicId>)
            if (this.state.mode === 'tree') {
                const usedTopics = new Set(graphNodes.map(n => n.category));
                const topicNameMap = new Map();
                ((this.atlas.evolution && this.atlas.evolution.topics) || []).forEach(t => {
                    topicNameMap.set(t.topicId, t.topicName || t.topicId);
                });

                usedTopics.forEach(tid => {
                    const catId = `cat-${tid}`;
                    graphNodes.unshift({
                        id: catId,
                        label: topicNameMap.get(tid) || tid,
                        type: 'Category',
                        category: tid,
                        color: '#6366f1',
                        desc: '核心主題分類中樞'
                    });
                });

                graphNodes.forEach(n => {
                    if (n.type !== 'Category') {
                        graphEdges.push({
                            source: `cat-${n.category}`,
                            target: n.id,
                            type: 'tree_group',
                            color: '#cbd5e1',
                            dashed: false
                        });
                    }
                });
            }

            return { nodes: graphNodes, edges: graphEdges, expandedHopCount };
        }

        _renderGraph() {
            if (!this.graphEl || typeof this.graphEl.setData !== 'function') return;
            const { nodes, edges, expandedHopCount } = this._buildFilteredTopology();

            this.graphEl.setData({ nodes, edges });
            if (typeof this.graphEl.setViewMode === 'function') {
                this.graphEl.setViewMode(this.state.mode);
            }
            if (this.state.selectedNodeId && typeof this.graphEl.selectNode === 'function') {
                this.graphEl.selectNode(this.state.selectedNodeId);
            }

            const realNodeCount = nodes.filter(n => n.type !== 'Category').length;

            const statsEl = document.getElementById('graph-live-stats');
            if (statsEl) {
                const hopNote = expandedHopCount > 0 ? ` (+${expandedHopCount} 1-Hop)` : '';
                statsEl.textContent = `顯示 ${realNodeCount} 節點${hopNote} · ${edges.length} 條邊`;
            }

            // 同步一鍵複製按鈕狀態（若有選中節點則反映 1-Hop 聚焦範圍）
            const { realNodes: snapNodes, isFocused } = this._getSnapshotTopology({ nodes, edges });
            const copyBtn = document.getElementById('btn-copy-structure');
            const copyLabel = document.getElementById('copy-structure-label');
            if (copyBtn) {
                const snapCount = snapNodes.length;
                if (copyLabel) copyLabel.textContent = `AI 快照 (${isFocused ? '聚焦 ' : ''}${snapCount})`;
                copyBtn.disabled = snapCount === 0;
                copyBtn.classList.toggle('opacity-40', snapCount === 0);
                copyBtn.classList.toggle('cursor-not-allowed', snapCount === 0);
            }

            this._renderInspector();
        }

        // =====================================================================
        // 6. Inspector Drawer（In/Out-Links + 修補建議 + 複製 Markdown 清單）
        // =====================================================================
        _renderInspector() {
            const emptyEl = document.getElementById('inspector-empty');
            const contentEl = document.getElementById('inspector-content');
            if (!emptyEl || !contentEl) return;

            const sid = this.state.selectedNodeId;
            if (!sid || !this.nodesMap.has(sid)) {
                emptyEl.classList.remove('hidden');
                contentEl.classList.add('hidden');
                return;
            }

            const node = this.nodesMap.get(sid);
            const cfg = LAYER_CONFIG[node.layer] || LAYER_CONFIG.L0_PULSE;
            const m = node.metrics || {};
            const inEdges = this.inEdgesMap.get(sid) || [];
            const outEdges = this.outEdgesMap.get(sid) || [];
            const suggestions = this._buildRepairSuggestions(node);

            const gscText = (m.gscImpressions !== undefined && m.gscImpressions !== null)
                ? Number(m.gscImpressions).toLocaleString()
                : '—';

            const renderEdgeList = (edges, dir) => {
                if (edges.length === 0) {
                    return '<p class="text-xs text-slate-400 py-1">無</p>';
                }
                return `<ul class="space-y-1.5 max-h-44 overflow-y-auto pr-1">${edges.map(e => {
                    const peerId = dir === 'in' ? e.source : e.target;
                    const peer = this.nodesMap.get(peerId);
                    const estyle = EDGE_STYLE[e.type] || EDGE_STYLE.body_link;
                    return `
                      <li>
                        <button type="button" data-jump-node="${escapeHtml(peerId)}" class="w-full text-left flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 transition-colors">
                          <span class="text-xs text-slate-700 dark:text-slate-200 truncate">${escapeHtml(peer ? peer.title : peerId)}</span>
                          <span class="px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0 ${estyle.badgeClass}">${escapeHtml(estyle.label)}</span>
                        </button>
                      </li>
                    `;
                }).join('')}</ul>`;
            };

            contentEl.innerHTML = `
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span class="px-2 py-0.5 rounded-md text-[11px] font-semibold ${cfg.badgeClass}">${escapeHtml(cfg.label)}</span>
                    <span class="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">${escapeHtml(node.topicId)}</span>
                  </div>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug break-words">${escapeHtml(node.title)}</h3>
                  <div class="mt-1 flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span class="truncate">${escapeHtml(node.id)}</span>
                    <a href="${escapeHtml(node.url)}" target="_blank" rel="noopener" class="text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0">開啟頁面 ↗</a>
                  </div>
                </div>
                <button id="btn-close-inspector" type="button" aria-label="關閉 Inspector" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                  ✕
                </button>
              </div>

              <!-- Metrics Grid -->
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70">
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">In-Links</div>
                  <div class="text-lg font-bold font-mono ${m.inDegree === 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}">${m.inDegree ?? 0}</div>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70">
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">Out-Links</div>
                  <div class="text-lg font-bold font-mono text-slate-900 dark:text-white">${m.outDegree ?? 0}</div>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70">
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">GSC 曝光</div>
                  <div class="text-lg font-bold font-mono text-slate-900 dark:text-white">${gscText}</div>
                </div>
              </div>

              <!-- Evolution Flags -->
              <div class="flex flex-wrap gap-1.5 text-[11px]">
                ${node.layer === 'L2_LINE_NEWS' ? `<span class="px-2 py-0.5 rounded-md ${m.hasCallout ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'}">Callout: ${m.hasCallout ? '已有' : '缺漏'}</span>` : ''}
                ${node.layer === 'L2_LINE_POST' ? `<span class="px-2 py-0.5 rounded-md ${m.hasTimeline ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'}">時間軸: ${m.hasTimeline ? '已有' : '缺漏'}</span>` : ''}
                ${(m.uncitedNewerNewsCount || 0) > 0 ? `<span class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">待補錄新研報: ${m.uncitedNewerNewsCount}</span>` : ''}
                ${(node.tags || []).slice(0, 5).map(t => `<span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">#${escapeHtml(t)}</span>`).join('')}
              </div>

              <!-- Repair Suggestions + Copy Markdown -->
              <div class="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-2.5">
                <div class="flex items-center justify-between gap-2">
                  <h4 class="text-xs font-bold text-amber-900 dark:text-amber-200">修補與治理建議 (${suggestions.length})</h4>
                  <button id="btn-copy-repair-md" type="button" class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors">
                    複製修補清單 (MD)
                  </button>
                </div>
                ${suggestions.length === 0
                    ? '<p class="text-xs text-emerald-700 dark:text-emerald-300">此節點目前無明顯演化或孤兒缺口。</p>'
                    : `<ul class="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 list-disc pl-4">${suggestions.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>`
                }
              </div>

              <!-- In-Links -->
              <div class="space-y-1.5">
                <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300">連入清單 In-Links (${inEdges.length})</h4>
                ${renderEdgeList(inEdges, 'in')}
              </div>

              <!-- Out-Links -->
              <div class="space-y-1.5">
                <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300">連出清單 Out-Links (${outEdges.length})</h4>
                ${renderEdgeList(outEdges, 'out')}
              </div>
            `;

            emptyEl.classList.add('hidden');
            contentEl.classList.remove('hidden');

            const closeBtn = document.getElementById('btn-close-inspector');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.state.selectedNodeId = null;
                    this._syncUrlState();
                    this._renderGraph();
                });
            }

            const copyBtn = document.getElementById('btn-copy-repair-md');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => this._copyRepairMarkdown(node, suggestions));
            }

            contentEl.querySelectorAll('[data-jump-node]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const nextId = btn.getAttribute('data-jump-node');
                    if (nextId) this.focusNodeInGraph(nextId);
                });
            });
        }

        _buildRepairSuggestions(node) {
            const list = [];
            const m = node.metrics || {};

            if ((m.inDegree || 0) === 0 && node.layer !== 'L0_PULSE') {
                list.push('孤兒節點（In-Degree = 0）：建議自同主題專題中樞或相關長青文補入指向連結。');
            }

            const bf = this.backfillMap.get(node.id);
            if (bf) {
                const targets = (bf.target_posts || []).slice(0, 3).join('、');
                list.push(`補入 \`.evergreen-callout\` 向下回灌區塊，導流至長青文：${targets || '同主題長青文'}。`);
            } else if (node.layer === 'L2_LINE_NEWS' && !m.hasCallout) {
                list.push('尚未插入 `.evergreen-callout`：確認同主題是否已有長青文可承接權重。');
            }

            const fg = this.freshnessMap.get(node.id);
            if (fg) {
                if (!fg.has_timeline) {
                    list.push('缺「歷史實證時間軸」區塊：建議補建時間軸以承接後續 news/ 切片。');
                }
                if ((fg.uncited_newer_news_count || 0) > 0) {
                    const newer = (fg.uncited_newer_news || []).slice(0, 3).join('、');
                    list.push(`時間軸保鮮缺口：有 ${fg.uncited_newer_news_count} 篇較新研報尚未引用（${newer}）。`);
                }
            }

            const swList = this.sameWaveMap.get(node.id) || [];
            swList.slice(0, 2).forEach(sw => {
                const peer = sw.earlier_link === node.id ? sw.later_link : sw.earlier_link;
                list.push(`同波段 1–7 天切片未匯流（#${sw.tag}）：建議與 \`${peer}\` 建立單向匯流連結。`);
            });

            return list;
        }

        _copyRepairMarkdown(node, suggestions) {
            const items = suggestions.length > 0
                ? suggestions.map(s => `- [ ] ${s}`).join('\n')
                : '- [x] 目前無急迫演化缺口';
            const md = [
                `### 修補清單：${node.title}`,
                `- 路徑：\`${node.id}\``,
                `- 層級：\`${node.layer}\` | 主題：\`${node.topicId}\``,
                `- 連結度：In=${node.metrics.inDegree ?? 0} / Out=${node.metrics.outDegree ?? 0}`,
                '',
                items
            ].join('\n');
            this._copyTextToClipboard(md, '已複製 Markdown 修補清單至剪貼簿');
        }

        _copyTextToClipboard(text, successMsg) {
            if (global.isSecureContext && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                navigator.clipboard.writeText(text)
                    .then(() => this._showToast(successMsg))
                    .catch(() => {
                        if (!this._fallbackCopy(text, successMsg)) {
                            this._showToast('剪貼簿權限受限，請改用 localhost/HTTPS 開啟或手動複製');
                        }
                    });
            } else {
                this._fallbackCopy(text, successMsg);
            }
        }

        _fallbackCopy(text, successMsg) {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
            document.body.appendChild(ta);
            ta.focus({ preventScroll: true });
            ta.select();
            ta.setSelectionRange(0, text.length);
            let ok = false;
            try {
                ok = document.execCommand('copy');
            } catch (_) {
                ok = false;
            }
            document.body.removeChild(ta);
            if (ok) {
                this._showToast(successMsg || '已複製至剪貼簿');
            } else {
                this._showToast('剪貼簿權限受限，請改用 localhost/HTTPS 開啟或手動複製');
            }
            return ok;
        }

        // ---- AI 結構快照序列化 ----
        _toAbsoluteUrl(node) {
            const id = node.id;
            if (id.startsWith('pulse:')) {
                return `${SITE_ORIGIN}/pulse.html (Pulse ID: ${id.replace('pulse:', '')})`;
            }
            if (id.startsWith('http://') || id.startsWith('https://')) return id;
            const path = id.startsWith('/') ? id : `/${id}`;
            return `${SITE_ORIGIN}${path}`;
        }

        _getSnapshotTopology(topology) {
            const { nodes, edges } = topology || this._buildFilteredTopology();
            // 過濾虛擬節點與虛擬邊
            const realNodes = nodes.filter(n => n.type !== 'Category');
            const realEdges = edges.filter(e => e.type !== 'tree_group');

            const sid = this.state.selectedNodeId;
            if (sid && this.nodesMap.has(sid)) {
                const focusIds = new Set([sid]);
                realEdges.forEach(e => {
                    if (e.source === sid) focusIds.add(e.target);
                    else if (e.target === sid) focusIds.add(e.source);
                });
                return {
                    realNodes: realNodes.filter(n => focusIds.has(n.id)),
                    realEdges: realEdges.filter(e => focusIds.has(e.source) && focusIds.has(e.target)),
                    isFocused: true,
                    focusNode: this.nodesMap.get(sid)
                };
            }
            return { realNodes, realEdges, isFocused: false, focusNode: null };
        }

        _buildStructureMarkdown() {
            const { realNodes, realEdges, isFocused, focusNode } = this._getSnapshotTopology();

            if (realNodes.length === 0) return null;

            const lines = [];
            // AI 提示詞前綴
            lines.push('> **AI 掃描指令**：請逐一連網開啟下方「樹狀目錄」的所有網址，');
            lines.push('> 彙整各頁面的最新資訊與更新狀態，並根據「拓樸關聯」');
            lines.push('> 指出任何缺失連結或可強化的內容交叉引用。');
            lines.push('');

            // Context Header
            const now = new Date();
            const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            lines.push(`## Content Evolution Atlas — 結構快照`);
            lines.push(`- 匯出時間：${ts}`);
            lines.push(`- 篩選節點：${realNodes.length} 個 · 關聯邊：${realEdges.length} 條`);

            // 篩選條件語境
            const topicNames = new Map();
            ((this.atlas.evolution && this.atlas.evolution.topics) || []).forEach(t => {
                topicNames.set(t.topicId, t.topicName || t.topicId);
            });
            const curTopic = this.state.topic === 'all' ? '全部' : (topicNames.get(this.state.topic) || this.state.topic);
            const curLayers = Array.from(this.state.layers).map(k => LAYER_CONFIG[k]?.short || k).join(', ');
            const curFilter = this.state.filter === 'all' ? '無' : this.state.filter;
            const curSearch = this.state.search || '無';
            const focusSuffix = (isFocused && focusNode) ? ` · Focus=${focusNode.title}` : '';
            lines.push(`- 篩選條件：Topic=${curTopic} · Layer=[${curLayers}] · Filter=${curFilter} · Search=${curSearch}${focusSuffix}`);
            lines.push('');

            // 樹狀目錄：按 Topic → Layer 分群
            lines.push('## 樹狀目錄');
            lines.push('');
            const topicMap = new Map();
            realNodes.forEach(n => {
                const node = this.nodesMap.get(n.id);
                if (!node) return;
                const tid = node.topicId || '_ungrouped';
                if (!topicMap.has(tid)) topicMap.set(tid, []);
                topicMap.get(tid).push(node);
            });

            const topicNameMap = new Map();
            ((this.atlas.evolution && this.atlas.evolution.topics) || []).forEach(t => {
                topicNameMap.set(t.topicId, t.topicName || t.topicId);
            });

            topicMap.forEach((nodesInTopic, tid) => {
                const topicLabel = topicNameMap.get(tid) || tid;
                lines.push(`### ${topicLabel}`);
                // 依 LAYER_ORDER 排序
                nodesInTopic.sort((a, b) => {
                    const ai = LAYER_ORDER.indexOf(a.layer);
                    const bi = LAYER_ORDER.indexOf(b.layer);
                    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
                });
                nodesInTopic.forEach(node => {
                    const layerShort = LAYER_CONFIG[node.layer]?.short || node.layer;
                    const url = this._toAbsoluteUrl(node);
                    lines.push(`- **[${layerShort}]** ${node.title}  `);
                    lines.push(`  ${url}`);
                });
                lines.push('');
            });

            // 拓樸關聯鄰接表
            lines.push('## 拓樸關聯');
            lines.push('');
            const normalEdges = realEdges.filter(e => e.type !== 'gap_suggest');
            const gapEdges = realEdges.filter(e => e.type === 'gap_suggest');

            if (normalEdges.length > 0) {
                lines.push('### 既有連結');
                normalEdges.forEach(e => {
                    const srcNode = this.nodesMap.get(e.source);
                    const tgtNode = this.nodesMap.get(e.target);
                    const srcLabel = srcNode ? srcNode.title : e.source;
                    const tgtLabel = tgtNode ? tgtNode.title : e.target;
                    const edgeLabel = EDGE_STYLE[e.type]?.label || e.type;
                    lines.push(`- ${srcLabel} → ${tgtLabel}（${edgeLabel}）`);
                });
                lines.push('');
            }

            if (gapEdges.length > 0) {
                lines.push('### 缺口建議 (gap_suggest)');
                gapEdges.forEach(e => {
                    const srcNode = this.nodesMap.get(e.source);
                    const tgtNode = this.nodesMap.get(e.target);
                    const srcLabel = srcNode ? srcNode.title : e.source;
                    const tgtLabel = tgtNode ? tgtNode.title : e.target;
                    lines.push(`- ⚠️ ${srcLabel} → ${tgtLabel}（建議補連）`);
                });
                lines.push('');
            }

            return { markdown: lines.join('\n'), realCount: realNodes.length };
        }

        _copyCurrentStructure() {
            const result = this._buildStructureMarkdown();
            if (!result) {
                this._showToast('目前無可複製的節點，請調整篩選條件');
                return;
            }
            const { markdown, realCount } = result;
            const suffix = realCount > 100 ? '（範圍較大，建議分段掃描）' : '';
            this._copyTextToClipboard(markdown, `已複製 ${realCount} 節點的 AI 結構快照${suffix}`);
        }

        // =====================================================================
        // 7. 互動綁定、跳轉輔助與 Header 搜尋攔截
        // =====================================================================
        focusNodeInGraph(nodeId, opts = {}) {
            if (!this.nodesMap.has(nodeId)) return;
            const node = this.nodesMap.get(nodeId);
            this.state.view = 'graph';
            this.state.selectedNodeId = nodeId;
            this.state.layers.add(node.layer);
            if (opts.showGap) this.state.showGap = true;
            if (opts.showEntity) this.state.showEntity = true;

            this._renderFilterControls();
            this._applyViewState(true);
        }

        _jumpToLayer(layerKey) {
            this.state.view = 'graph';
            this.state.filter = 'all';
            this.state.topic = 'all';
            this.state.layers = new Set([layerKey]);
            if (layerKey === 'L1B_POINT_KNOWLEDGE' || layerKey === 'L1A_POINT_PROJECT') {
                this.state.showEntity = true;
            }
            this._renderFilterControls();
            this._applyViewState(true);
        }

        _jumpToFilter(filterKey) {
            this.state.view = 'graph';
            this.state.filter = filterKey;
            this.state.topic = 'all';
            if (filterKey === 'no_callout') {
                this.state.layers = new Set(['L2_LINE_NEWS', 'L2_LINE_POST']);
                this.state.showGap = true;
            } else if (filterKey === 'no_timeline') {
                this.state.layers = new Set(['L2_LINE_POST', 'L2_LINE_NEWS']);
                this.state.showGap = true;
            } else if (filterKey === 'orphan') {
                this.state.layers = new Set(Object.keys(LAYER_CONFIG).filter(k => k !== 'L0_PULSE'));
            }
            this._renderFilterControls();
            this._applyViewState(true);
        }

        _applyViewState(shouldSyncUrl) {
            const dashEl = document.getElementById('atlas-view-dashboard');
            const graphViewEl = document.getElementById('atlas-view-graph');
            const tabDash = document.getElementById('tab-btn-dashboard');
            const tabGraph = document.getElementById('tab-btn-graph');

            const isGraph = this.state.view === 'graph';
            if (dashEl) dashEl.classList.toggle('hidden', isGraph);
            if (graphViewEl) graphViewEl.classList.toggle('hidden', !isGraph);

            const activeCls = ['bg-white', 'dark:bg-slate-700', 'text-blue-600', 'dark:text-blue-300', 'shadow-sm'];
            const idleCls = ['text-slate-600', 'dark:text-slate-300'];

            if (tabDash && tabGraph) {
                tabDash.setAttribute('aria-selected', String(!isGraph));
                tabGraph.setAttribute('aria-selected', String(isGraph));
                activeCls.forEach(c => {
                    tabDash.classList.toggle(c, !isGraph);
                    tabGraph.classList.toggle(c, isGraph);
                });
                idleCls.forEach(c => {
                    tabDash.classList.toggle(c, isGraph);
                    tabGraph.classList.toggle(c, !isGraph);
                });
            }

            // 同步 Topology / Tree 按鈕外觀
            const btnTopo = document.getElementById('graph-mode-topology');
            const btnTree = document.getElementById('graph-mode-tree');
            if (btnTopo && btnTree) {
                const isTree = this.state.mode === 'tree';
                activeCls.forEach(c => {
                    btnTopo.classList.toggle(c, !isTree);
                    btnTree.classList.toggle(c, isTree);
                });
                idleCls.forEach(c => {
                    btnTopo.classList.toggle(c, isTree);
                    btnTree.classList.toggle(c, !isTree);
                });
            }

            if (shouldSyncUrl) this._syncUrlState();
            if (isGraph) {
                // 等待容器從 hidden 恢復寬高後再觸發渲染
                requestAnimationFrame(() => this._renderGraph());
            }
        }

        _bindUIEvents() {
            // 視圖切換
            document.querySelectorAll('[data-view]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const nextView = btn.getAttribute('data-view');
                    if (nextView && nextView !== this.state.view) {
                        this.state.view = nextView;
                        this._applyViewState(true);
                    }
                });
            });

            // Topology / Tree 切換
            document.querySelectorAll('[data-mode]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const nextMode = btn.getAttribute('data-mode');
                    if (nextMode && nextMode !== this.state.mode) {
                        this.state.mode = nextMode;
                        this._applyViewState(true);
                    }
                });
            });

            // Topic 篩選
            const topicSelect = document.getElementById('filter-topic-select');
            if (topicSelect) {
                topicSelect.addEventListener('change', (e) => {
                    this.state.topic = e.target.value || 'all';
                    this._syncUrlState();
                    this._renderGraph();
                });
            }

            // 異常篩選
            const anomalySelect = document.getElementById('filter-anomaly-select');
            if (anomalySelect) {
                anomalySelect.addEventListener('change', (e) => {
                    this.state.filter = e.target.value || 'all';
                    this._syncUrlState();
                    this._renderGraph();
                });
            }

            // 層級勾選
            const layerGroup = document.getElementById('layer-filter-group');
            if (layerGroup) {
                layerGroup.addEventListener('change', (e) => {
                    const cb = e.target;
                    const layerKey = cb && cb.getAttribute && cb.getAttribute('data-layer');
                    if (!layerKey) return;
                    if (cb.checked) this.state.layers.add(layerKey);
                    else this.state.layers.delete(layerKey);
                    this._syncUrlState();
                    this._renderGraph();
                });
            }

            // 邊開關
            const entityToggle = document.getElementById('toggle-entity-link');
            if (entityToggle) {
                entityToggle.addEventListener('change', (e) => {
                    this.state.showEntity = Boolean(e.target.checked);
                    this._syncUrlState();
                    this._renderGraph();
                });
            }

            const gapToggle = document.getElementById('toggle-gap-suggest');
            if (gapToggle) {
                gapToggle.addEventListener('change', (e) => {
                    this.state.showGap = Boolean(e.target.checked);
                    this._syncUrlState();
                    this._renderGraph();
                });
            }

            // 重置篩選
            const resetBtn = document.getElementById('btn-reset-filters');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    this.state.mode = 'topology';
                    this.state.topic = 'all';
                    this.state.layers = new Set(Object.keys(LAYER_CONFIG).filter(k => LAYER_CONFIG[k].defaultOn));
                    this.state.filter = 'all';
                    this.state.showEntity = false;
                    this.state.showGap = false;
                    this.state.search = '';
                    this.state.selectedNodeId = null;
                    this._renderFilterControls();
                    this._applyViewState(true);
                });
            }

            // 一鍵複製 AI 結構快照
            const copyStructBtn = document.getElementById('btn-copy-structure');
            if (copyStructBtn) {
                copyStructBtn.addEventListener('click', () => this._copyCurrentStructure());
            }

            // 頁內搜尋框
            const searchInput = document.getElementById('atlas-search-input');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.state.search = e.target.value.trim();
                    if (this.state.search && this.state.view !== 'graph') {
                        this.state.view = 'graph';
                        this._applyViewState(true);
                    } else {
                        this._syncUrlState();
                        if (this.state.view === 'graph') this._renderGraph();
                    }
                });
            }

            // 監聽圖譜節點選取事件
            if (this.graphEl) {
                this.graphEl.addEventListener('node-selected', (e) => {
                    const node = e && e.detail;
                    if (!node) return;
                    if (node.type === 'Category') {
                        const tid = node.category || String(node.id || '').replace(/^cat-/, '');
                        if (!tid) return;
                        this.state.topic = (this.state.topic === tid) ? 'all' : tid;
                        this.state.selectedNodeId = null;
                        const topicSelect = document.getElementById('filter-topic-select');
                        if (topicSelect) topicSelect.value = this.state.topic;
                        this._syncUrlState();
                        this._renderGraph();
                        return;
                    }
                    if (this.nodesMap.has(node.id)) {
                        this.state.selectedNodeId = node.id;
                        this._syncUrlState();
                        this._renderGraph();
                    }
                });
            }
        }

        // 複製自 apps/archive/index.html（依三次法則，第二次使用直接複用邏輯）
        _bindHeaderSearchIntercept() {
            const checkHeader = setInterval(() => {
                const headerHost = document.querySelector('#header-host');
                if (headerHost && headerHost.shadowRoot) {
                    const searchInputs = headerHost.shadowRoot.querySelectorAll('.header-search-input, .mobile-search-input');
                    if (searchInputs.length > 0) {
                        clearInterval(checkHeader);
                        searchInputs.forEach(input => {
                            if (this.state.search) input.value = this.state.search;

                            input.addEventListener('input', (e) => {
                                this.state.search = e.target.value.trim();
                                const pageSearch = document.getElementById('atlas-search-input');
                                if (pageSearch) pageSearch.value = this.state.search;
                                if (this.state.search && this.state.view !== 'graph') {
                                    this.state.view = 'graph';
                                    this._applyViewState(true);
                                } else {
                                    this._syncUrlState();
                                    if (this.state.view === 'graph') this._renderGraph();
                                }
                            });

                            input.addEventListener('keydown', (e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            });
                        });
                    }
                }
            }, 100);

            setTimeout(() => clearInterval(checkHeader), 10000);
        }
    }

    global.EvolutionAtlasApp = EvolutionAtlasApp;
})(window);
