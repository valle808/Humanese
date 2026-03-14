/**
 * mobile-menu.js — Sovereign Mobile Navigation Engine
 * Managed by Abyssal Sentinels
 */
(function () {
    'use strict';

    function initMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.mobile-menu-sidebar');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const links = document.querySelectorAll('.mobile-menu-link');

        if (!toggle || !sidebar) return;

        function toggleMenu() {
            const isActive = toggle.classList.toggle('active');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        }

        toggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        links.forEach(link => {
            link.addEventListener('click', () => {
                if (toggle.classList.contains('active')) toggleMenu();
            });
        });

        // Set active link based on current path
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', initMobileMenu);
    if (document.readyState !== 'loading') initMobileMenu();

})();
