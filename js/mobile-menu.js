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
        const savedState = localStorage.getItem('sovereign_sidebar_expanded');
        let isExpanded = savedState === 'true';

        function applyState() {
            if (window.innerWidth > 900) {
                if (isExpanded) {
                    sidebar.classList.add('active');
                    document.body.classList.add('sidebar-expanded');
                } else {
                    sidebar.classList.remove('active');
                    document.body.classList.remove('sidebar-expanded');
                }
            }
        }

        function toggleState() {
            isExpanded = !isExpanded;
            localStorage.setItem('sovereign_sidebar_expanded', isExpanded);
            applyState();
        }

        // ── Desktop Hover/Click Logic ──
        sidebar.addEventListener('mouseenter', () => {
            if (!isExpanded && window.innerWidth > 900) {
                sidebar.classList.add('active');
            }
        });

        sidebar.addEventListener('mouseleave', () => {
            if (!isExpanded && window.innerWidth > 900) {
                sidebar.classList.remove('active');
            }
        });

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

        // Initialize state
        applyState();

        // Handle resize
        window.addEventListener('resize', applyState);

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
})();
