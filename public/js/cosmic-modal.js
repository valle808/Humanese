/**
 * Cosmic Modal - Registration/Login Logic & Animation
 * Handles the glassmorphism modal UI and cosmic canvas background.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const modalOverlay = document.getElementById('auth-modal-overlay');
    const closeBtn = document.getElementById('auth-modal-close');
    const navBtn = document.getElementById('nav-enter-btn');
    const mainBtn = document.getElementById('open-signup-btn');
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = {
        'signup': document.getElementById('modal-signup-form'),
        'login': document.getElementById('modal-login-form')
    };

    // Open Model
    const openModal = (defaultTab = 'signup') => {
        switchTab(defaultTab);
        modalOverlay.classList.remove('auth-modal-hidden');
        // Slight delay to allow display to apply before fading in
        setTimeout(() => {
            modalOverlay.classList.add('open');
            startCosmicAnimation();
        }, 10);
    };

    // Close Modal
    const closeModal = () => {
        modalOverlay.classList.remove('open');
        setTimeout(() => {
            modalOverlay.classList.add('auth-modal-hidden');
            stopCosmicAnimation();
        }, 400); // Wait for CSS opacity transition
    };

    // Switch Tabs
    const switchTab = (tabId) => {
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        Object.keys(forms).forEach(id => {
            if (forms[id]) {
                forms[id].classList.toggle('active', id === tabId);
            }
        });
    };

    // Event Listeners
    if (navBtn) navBtn.addEventListener('click', (e) => { e.preventDefault(); openModal('login'); });
    if (mainBtn) mainBtn.addEventListener('click', (e) => { e.preventDefault(); openModal('signup'); });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // ==========================================
    // COSMIC CANVAS ANIMATION
    // ==========================================
    const canvas = document.getElementById('cosmic-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    let isActive = false;

    let width, height;
    let elements = [];

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Create cosmic elements
    class CosmicElement {
        constructor() {
            this.reset();
        }

        reset() {
            const types = ['star', 'star', 'star', 'meteorite', 'comet'];
            this.type = types[Math.floor(Math.random() * types.length)];

            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.length = Math.random() * 80 + 20;
            this.vx = (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1);
            this.vy = (Math.random() * 2 + 1);

            // Depth/Size
            if (this.type === 'star') {
                this.size = Math.random() * 1.5 + 0.5;
                this.vx *= 0.1;
                this.vy *= 0.1;
                this.alpha = Math.random() * 0.8 + 0.2;
                this.color = `rgba(255, 255, 255, ${this.alpha})`;
            } else if (this.type === 'meteorite') {
                this.size = Math.random() * 3 + 1;
                this.vx *= 3;
                this.vy *= 3;
                this.x = Math.random() * width;
                this.y = -50;
                this.alpha = Math.random() * 0.9 + 0.5;
                this.color = `rgba(220, 160, 100, ${this.alpha})`; // Fiery orange
            } else {
                // comet
                this.size = Math.random() * 4 + 2;
                this.vx *= 5;
                this.vy *= 4;
                this.x = -50;
                this.y = Math.random() * (height / 2);
                this.alpha = 1;
                this.color = `rgba(180, 200, 255, ${this.alpha})`; // Icy blue
            }
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around or Reset
            if (this.type === 'star') {
                if (this.y > height) this.y = 0;
                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                // Twinkle
                this.alpha += (Math.random() - 0.5) * 0.1;
                this.alpha = Math.max(0.1, Math.min(1, this.alpha));
                this.color = `rgba(255, 255, 255, ${this.alpha})`;
            } else {
                // Reset meteorites and comets once they leave screen
                if (this.y > height + 100 || this.x > width + 100 || this.x < -100) {
                    if (Math.random() > 0.98) { // Spawn rate
                        this.reset();
                    } else {
                        this.x = -1000; // Hide until reset
                    }
                }
            }
        }

        draw(ctx) {
            if (this.x === -1000) return;

            if (this.type === 'star') {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            } else if (this.type === 'meteorite') {
                // Meteorite with short fiery tail
                const grad = ctx.createLinearGradient(this.x, this.y, this.x - this.vx * 10, this.y - this.vy * 10);
                grad.addColorStop(0, this.color);
                grad.addColorStop(1, 'rgba(220, 80, 20, 0)');

                ctx.beginPath();
                ctx.strokeStyle = grad;
                ctx.lineWidth = this.size;
                ctx.lineCap = 'round';
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - this.vx * 10, this.y - this.vy * 10);
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
            } else if (this.type === 'comet') {
                // Comet with long icy tail
                const grad = ctx.createLinearGradient(this.x, this.y, this.x - this.vx * 20, this.y - this.vy * 20);
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.2, this.color);
                grad.addColorStop(1, 'rgba(100, 150, 255, 0)');

                ctx.beginPath();
                ctx.strokeStyle = grad;
                ctx.lineWidth = this.size;
                ctx.lineCap = 'round';
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - this.vx * 20, this.y - this.vy * 20);
                ctx.stroke();
            }
        }
    }

    // Init elements
    for (let i = 0; i < 150; i++) {
        elements.push(new CosmicElement());
    }

    const animate = () => {
        if (!isActive) return;

        // Clear canvas for transparent background
        ctx.clearRect(0, 0, width, height);

        elements.forEach(el => {
            el.update();
            el.draw(ctx);
        });

        animationFrameId = requestAnimationFrame(animate);
    };

    function startCosmicAnimation() {
        if (!isActive) {
            isActive = true;
            resize();
            animate();
        }
    }

    function stopCosmicAnimation() {
        isActive = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }
});
