/**
 * HUMANESE THEME ORCHESTRATOR
 * Consolidated Museum Day theme — Permanent default.
 */
(function () {
    'use strict';

    const DAY = 'day';

    // ── Apply theme immediately (before paint) ──
    document.documentElement.setAttribute('data-theme', DAY);

    // ── Update meta theme-color for mobile chrome ──
    function updateMetaThemeColor() {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute('content', '#f5f2ed');
        } else {
            const newMeta = document.createElement('meta');
            newMeta.name = 'theme-color';
            newMeta.content = '#f5f2ed';
            document.head.appendChild(newMeta);
        }
    }

    // ── Main init ──
    function init() {
        updateMetaThemeColor();

        // Remove any existing toggles found in the DOM (legacy cleanup)
        document.querySelectorAll('[data-theme-toggle], [data-theme-toggle-host]').forEach(el => {
            el.remove();
        });

        // Expose global API (minimal for backward compatibility)
        window.Humanese = window.Humanese || {};
        window.Humanese.theme = {
            toggle: () => console.warn('Theme toggle is disabled. Museum Day is permanent.'),
            set: () => console.warn('Theme set is disabled. Museum Day is permanent.'),
            get: () => DAY,
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
