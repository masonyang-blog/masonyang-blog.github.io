/**
 * Articles Repository - Business Logic Layer
 * Depends on: core-articles-data.js (must be loaded first)
 * Provides: window.ArticleRepository
 *
 * DO NOT modify article data here. Data is auto-generated in core-articles-data.js
 * by tools/sync_articles_db.py
 */
(function (global) {
    'use strict';

    var _articles = global._ARTICLES_RAW;
    if (!_articles) {
        console.error('ArticleRepository: window._ARTICLES_RAW not found. Make sure core-articles-data.js is loaded first.');
        _articles = [];
    }

    class ArticleRepository {
        constructor() {
            this._debug = false;
            this._detailsLoaded = false;
            this._detailsPromise = null;
        }

        get all() {
            return _articles;
        }

        async loadAllDetails() {
            if (this._detailsLoaded) return _articles;
            if (this._detailsPromise) return this._detailsPromise;

            let pathPrefix = './';
            if (typeof window !== 'undefined' && window.location) {
                const path = window.location.pathname;
                if (path.includes('/' + 'post/') || path.includes('/' + 'knowledge/') || path.includes('/' + 'project/') || path.includes('/' + 'doc/') || path.includes('/' + 'news/')) {
                    pathPrefix = '../';
                }
            }

            this._detailsPromise = fetch(`${pathPrefix}assets/data/core-articles-details.json`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch articles details');
                    return response.json();
                })
                .then(details => {
                    _articles.forEach(article => {
                        const detail = details[article.id];
                        if (detail) {
                            article.desc = detail.desc || '';
                            article.keywords = detail.keywords || '';
                            article.summary = detail.summary || '';
                            article.mentions = detail.mentions || [];
                        }
                    });
                    this._detailsLoaded = true;
                    return _articles;
                })
                .catch(err => {
                    console.error('ArticleRepository: error loading details:', err);
                    return _articles;
                });

            return this._detailsPromise;
        }

        getRelatedArticles(currentId, limit = 4) {
            const current = _articles.find(a => a.id === currentId);
            if (!current) return _articles.filter(a => a.format !== 'wiki').slice(0, limit);

            const currentTags = new Set(current.tags && Array.isArray(current.tags) ? current.tags : (current.tag ? [current.tag] : []));

            const scored = _articles
                .filter(a => a.id !== currentId && a.format !== 'wiki')
                .map(a => {
                    let score = 0;
                    // 同賽道專題優先度最高 (+40)
                    if (current.trackId && a.trackId && current.trackId === a.trackId) {
                        score += 40;
                    }
                    if (a.series && current.series && a.series === current.series) {
                        score += 5;
                    }
                    if (a.category && current.category && a.category === current.category) {
                        score += 3;
                    }
                    const aTags = a.tags && Array.isArray(a.tags) ? a.tags : (a.tag ? [a.tag] : []);
                    aTags.forEach(t => {
                        if (currentTags.has(t)) score += 2;
                    });
                    if (a.published && current.published) {
                        const daysDiff = Math.abs((new Date(current.published) - new Date(a.published)) / (1000 * 60 * 60 * 24));
                        if (daysDiff <= 45) score += 1;
                    }
                    return { article: a, score };
                });

            scored.sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return new Date(b.article.published) - new Date(a.article.published);
            });

            return scored.slice(0, limit).map(item => item.article);
        }
    }

    global.ArticleRepository = new ArticleRepository();
})(typeof window !== 'undefined' ? window : this);
