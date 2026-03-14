/**
 * HUMANESE THEME ORCHESTRATOR
 * Consolidated Museum Day theme — Permanent default.
 */
(function () {
    'use strict';

    const NIGHT = 'night';

    // ── Apply theme immediately (before paint) ──
    document.documentElement.setAttribute('data-theme', NIGHT);

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
            toggle: () => console.warn('Theme toggle disabled.'),
            set: () => console.warn('Theme set disabled.'),
            get: () => NIGHT,
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
