/**
 * Sovereign Sidebar Controller
 * Unified Logic for Next.js & Legacy HTML Nodes
 */
(function () {
    'use strict';

    function initSovereignSidebar() {
        const sidebar = document.querySelector('.mobile-menu-sidebar');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const toggle = document.querySelector('.mobile-menu-toggle');
        const links = document.querySelectorAll('.mobile-menu-link');

        if (!sidebar) return;

        // ── State Management ──
        // The desktop top-bar is now permanently visible.
        // We only need to manage state for the mobile slide drawer.
        let isExpandedMobile = false;

        // ── Desktop Hover/Click Logic ──
        // REMOVED: Desktop is now a static horizontal top-bar.

        // ── Mobile Toggle Logic ──
        if (toggle) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
                const isOpen = sidebar.classList.contains('active');
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // ── Active Link Detection ──
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.classList.add('active');
            }

            // Close menu on link click (mobile)
            link.addEventListener('click', () => {
                if (window.innerWidth <= 900) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

    });

    // ── OMEGA Awareness ──
    // Check if any link has OMEGA clearance requirement
    links.forEach(link => {
        if (link.textContent.includes('Supreme Command') || link.getAttribute('href').includes('admin')) {
            link.classList.add('omega-link');
        }
    });
}

    // Initialize on load
    if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSovereignSidebar);
} else {
    initSovereignSidebar();
}
}) ();
