/**
 * Theme Core Script
 * Handles initial theme detection and provides global toggle functionality.
 * Should be loaded in <head> to prevent FOUC.
 */
(function () {
    "use strict";

    // Enforce Pure Dark Mode across the entire site
    document.documentElement.classList.add('dark');

    // Compatibility shim in case any legacy component calls toggleTheme
    window.toggleTheme = function () {
        document.documentElement.classList.add('dark');
        return true;
    };
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            // Check if we are in subfolder to register relative to root
            const depth = (window.location.pathname.match(/[^/]+/g) || []).length;
            const swPath = depth > 1 ? '../sw.js' : './sw.js';
            navigator.serviceWorker.register(swPath).catch(err => {
                console.warn('Service Worker registration failed:', err);
            });
        });
    }

})();
