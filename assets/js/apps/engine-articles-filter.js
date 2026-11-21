/**
 * Articles Spreadsheet Filter & Sorting Engine
 * @class ArticlesFilterEngine
 * @description Decoupled calculation and state management engine for multi-dimensional 
 * article filtering, text search, dynamic column sorting, and URL search parameter synchronization.
 * Completely independent of DOM rendering and UI components.
 */
(function (global) {
    "use strict";

    class ArticlesFilterEngine {
        /**
         * @param {Object} [options]
         * @param {Object} [options.tracks]
         * @param {Object} [options.categories]
         * @param {Object} [options.tags]
         * @param {Object} [options.series]
         * @param {Object} [options.taxonomyConfig]
         */
        constructor(options = {}) {
            this.tracks = options.tracks || {};
            this.categories = options.categories || {};
            this.tags = options.tags || {};
            this.series = options.series || {};
            this.taxonomyConfig = options.taxonomyConfig || (global.TaxonomyConfig || null);
        }

        /**
         * Normalize raw article database items into structured tabular schema
         * @param {Array<Object>} rawArticles 
         * @returns {{ articles: Array<Object>, years: Array<String>, allKeywords: Array<{name: String, count: Number}> }}
         */
        normalizeArticles(rawArticles = []) {
            if (!Array.isArray(rawArticles)) return { articles: [], years: [], allKeywords: [] };

            const tax = this.taxonomyConfig;
            const getTrackObj = (id) => (tax && tax.getTrack ? tax.getTrack(id) : (this.tracks[id] || null));
            const getCategoryObj = (id) => (tax && tax.getCategory ? tax.getCategory(id) : { text: this.categories[id]?.name || id || '-' });
            const getTagObj = (id) => (tax && tax.getTag ? tax.getTag(id) : { text: this.tags[id]?.name || id || '-' });
            const getSeriesObj = (id) => (tax && tax.getSeries ? tax.getSeries(id) : { text: this.series[id]?.title || id || '-' });

            const yearsSet = new Set();
            const keywordsMap = {};

            const normalized = rawArticles.map(item => {
                const year = item.published ? item.published.substring(0, 4) : '未知';
                if (year && year !== '未知') {
                    yearsSet.add(year);
                }

                const catObj = getCategoryObj(item.category);

                // Multi-tag support
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
                        if (m && m.name) {
                            const clean = m.name.replace(/\s*\(.*?\)\s*/g, '').trim();
                            if (clean && clean.length > 1) kws.push(clean);
                        }
                    });
                }
                const uniqueKws = Array.from(new Set(kws));
                uniqueKws.forEach(kw => {
                    keywordsMap[kw] = (keywordsMap[kw] || 0) + 1;
                });

                // Resolve track: use explicit item.trackId if available, or deduce via TaxonomyConfig.resolveTrack()
                let trackObj = item.trackId ? getTrackObj(item.trackId) : null;
                let resolvedTrackId = item.trackId || '';

                if (!trackObj && global.TaxonomyConfig && typeof global.TaxonomyConfig.resolveTrack === 'function') {
                    const deduced = global.TaxonomyConfig.resolveTrack(item);
                    if (deduced) {
                        trackObj = deduced;
                        resolvedTrackId = deduced.id || '';
                    }
                }

                const trackName = trackObj ? trackObj.name : (resolvedTrackId || '-');
                const trackHex = trackObj ? trackObj.hex : '#64748b';

                return {
                    ...item,
                    year: year,
                    parsedKeywords: uniqueKws,
                    trackId: resolvedTrackId,
                    trackName: trackName,
                    trackHex: trackHex,
                    categoryName: catObj.text || item.category || '-',
                    tagName: tagsDisplay || '-',
                    tagsList: tagsList,
                    seriesName: seriesObj.text || item.series || '-'
                };
            });

            const years = Array.from(yearsSet).sort().reverse();
            const allKeywords = Object.entries(keywordsMap)
                .sort((a, b) => b[1] - a[1])
                .map(e => ({ name: e[0], count: e[1] }));

            return {
                articles: normalized,
                years: years,
                allKeywords: allKeywords
            };
        }

        /**
         * Filter articles against multi-dimensional criteria
         * @param {Array<Object>} articles 
         * @param {Object} filterState 
         * @returns {Array<Object>}
         */
        filterArticles(articles = [], filterState = {}) {
            const {
                track = 'all',
                category = 'all',
                tag = 'all',
                series = 'all',
                year = 'all',
                keyword = 'all',
                query = ''
            } = filterState;

            const queryLower = (query || '').toLowerCase().trim();

            return articles.filter(item => {
                if (track !== 'all' && item.trackId !== track) return false;
                if (category !== 'all' && item.category !== category) return false;
                if (tag !== 'all' && !(item.tagsList && item.tagsList.includes(tag)) && item.tag !== tag) return false;
                if (series !== 'all' && item.series !== series) return false;
                if (year !== 'all' && item.year !== year) return false;
                if (keyword !== 'all' && (!item.parsedKeywords || !item.parsedKeywords.includes(keyword))) return false;

                if (queryLower) {
                    const title = (item.title || '').toLowerCase();
                    const desc = (item.desc || '').toLowerCase();
                    const keywordsStr = (item.keywords || '').toLowerCase();
                    const summary = (item.summary || '').toLowerCase();
                    const trackStr = (item.trackName || '').toLowerCase();
                    if (!title.includes(queryLower) &&
                        !desc.includes(queryLower) &&
                        !keywordsStr.includes(queryLower) &&
                        !summary.includes(queryLower) &&
                        !trackStr.includes(queryLower)) {
                        return false;
                    }
                }
                return true;
            });
        }

        /**
         * Sort articles by field and direction
         * @param {Array<Object>} articles 
         * @param {String} field 
         * @param {String} direction 'ASC' | 'DESC'
         * @returns {Array<Object>}
         */
        sortArticles(articles = [], field = 'published', direction = 'DESC') {
            const mult = direction === 'ASC' ? 1 : -1;
            const cloned = [...articles];

            cloned.sort((a, b) => {
                let valA = a[field] || '';
                let valB = b[field] || '';

                if (field === 'published') {
                    const timeA = valA ? new Date(valA).getTime() : 0;
                    const timeB = valB ? new Date(valB).getTime() : 0;
                    return (timeA - timeB) * mult;
                }

                return valA.toString().localeCompare(valB.toString(), 'zh-TC') * mult;
            });

            return cloned;
        }

        /**
         * Parse filter state from URL search params
         * @param {URLSearchParams|String} searchParams 
         * @param {Object} validDomains 
         * @returns {Object}
         */
        readURLState(searchParams, validDomains = {}) {
            const params = typeof searchParams === 'string'
                ? new URLSearchParams(searchParams)
                : (searchParams || (typeof window !== 'undefined' && window.location ? new URLSearchParams(window.location.search) : new URLSearchParams()));

            const state = {
                query: '',
                keyword: 'all',
                year: 'all',
                track: 'all',
                category: 'all',
                tag: 'all',
                series: 'all'
            };

            const q = params.get('q');
            const keyword = params.get('keyword');
            const year = params.get('year');
            const track = params.get('track');
            const cat = params.get('cat');
            const tag = params.get('tag');
            const series = params.get('series');

            const years = validDomains.years || [];
            const tracks = validDomains.tracks || this.tracks || {};
            const categories = validDomains.categories || this.categories || {};
            const tags = validDomains.tags || this.tags || {};
            const seriesMap = validDomains.series || this.series || {};

            if (q !== null) state.query = q;
            if (keyword !== null) state.keyword = keyword;
            if (year !== null && years.includes(year)) state.year = year;
            if (track !== null && (track in tracks || track === 'all')) state.track = track;
            if (cat !== null && cat in categories) state.category = cat;
            if (tag !== null && tag in tags) state.tag = tag;
            if (series !== null && series in seriesMap) state.series = series;

            return state;
        }

        /**
         * Synchronize filter state into browser URL bar (replaceState)
         * @param {Object} filterState 
         */
        syncURLState(filterState = {}) {
            if (typeof window === 'undefined' || !window.history || !window.location) return;

            const params = new URLSearchParams();
            const f = filterState;

            if (f.query && f.query.trim()) params.set('q', f.query.trim());
            if (f.keyword && f.keyword !== 'all') params.set('keyword', f.keyword);
            if (f.year && f.year !== 'all') params.set('year', f.year);
            if (f.track && f.track !== 'all') params.set('track', f.track);
            if (f.category && f.category !== 'all') params.set('cat', f.category);
            if (f.tag && f.tag !== 'all') params.set('tag', f.tag);
            if (f.series && f.series !== 'all') params.set('series', f.series);

            const paramStr = params.toString();
            const newUrl = window.location.pathname + (paramStr ? '?' + paramStr : '');
            window.history.replaceState(null, '', newUrl);
        }
    }

    // Static facade helpers
    ArticlesFilterEngine.normalize = (rawArticles, options) => new ArticlesFilterEngine(options).normalizeArticles(rawArticles);
    ArticlesFilterEngine.filter = (articles, filterState) => new ArticlesFilterEngine().filterArticles(articles, filterState);
    ArticlesFilterEngine.sort = (articles, field, dir) => new ArticlesFilterEngine().sortArticles(articles, field, dir);

    global.ArticlesFilterEngine = ArticlesFilterEngine;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
