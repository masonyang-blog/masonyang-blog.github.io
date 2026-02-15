/**
 * Theme Core Script
 * Handles initial theme detection and provides global toggle functionality.
 * Should be loaded in <head> to prevent FOUC.
 */
(function () {
    "use strict";

    function getInitialTheme() {
        // 1. Check LocalStorage
        const persistedColorPreference = window.localStorage.getItem('theme');
        if (typeof persistedColorPreference === 'string') {
            return persistedColorPreference;
        }

        // 2. Default (Always Light unless user overrides)
        // We explicitly ignore system preference as per requirement
        return 'light';
    }

    const theme = getInitialTheme();
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Expose global toggle function
    window.toggleTheme = function () {
        const isDark = document.documentElement.classList.toggle('dark');
        const newTheme = isDark ? 'dark' : 'light';
        window.localStorage.setItem('theme', newTheme);

        // Dispatch event for components to sync updates
        window.dispatchEvent(new CustomEvent('theme-changed', {
            detail: { theme: newTheme, isDark: isDark }
        }));

        return isDark;
    };

    // System preference listener removed as we want to enforce manual toggle only
    // window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => { ... });

})();
