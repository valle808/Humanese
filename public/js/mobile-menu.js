/**
 * HUMANESE NEXUS NAV — v5.0 Controller
 * Premium Hybrid Navigation: Desktop Topbar + Mobile Drawer
 */
(function () {
    'use strict';

    function initNexusNav() {
        const sidebar = document.querySelector('.mobile-menu-sidebar');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const toggle = document.querySelector('.mobile-menu-toggle');
        const links = document.querySelectorAll('.mobile-menu-link');

        if (!sidebar) return;

        // ── Mobile Drawer Toggle ──────────────────────────────
        function openDrawer() {
            sidebar.classList.add('active');
            if (overlay) overlay.classList.add('active');
            if (toggle) toggle.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeDrawer() {
            sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            if (toggle) toggle.classList.remove('open');
            document.body.style.overflow = '';
        }

        if (toggle) {
            toggle.addEventListener('click', () => {
                sidebar.classList.contains('active') ? closeDrawer() : openDrawer();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', closeDrawer);
        }

        // Close drawer on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDrawer();
        });

        // ── Active Link Detection ─────────────────────────────
        const rawPath = window.location.pathname.split('/').pop() || 'index.html';
        const currentPage = rawPath === '' ? 'index.html' : rawPath;

        links.forEach(link => {
            const href = (link.getAttribute('href') || '').split('/').pop();

            if (href === currentPage) {
                link.classList.add('active');
            }

            // Mark omega links
            const text = link.textContent.trim().toLowerCase();
            const target = (link.getAttribute('href') || '').toLowerCase();
            if (text.includes('supreme') || target.includes('admin')) {
                link.classList.add('omega-link');
            }

            // Close drawer on nav link click (mobile only)
            link.addEventListener('click', () => {
                if (window.innerWidth <= 900) {
                    closeDrawer();
                }
            });
        });

        // ── Resize Handler ────────────────────────────────────
        // Ensure drawer is closed if user resizes from mobile → desktop
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 900) {
                    closeDrawer();
                }
            }, 150);
        });
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNexusNav);
    } else {
        initNexusNav();
    }

})();
