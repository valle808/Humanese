// ANTIGRAVITY 3D MONOCHROME + ORANGE ACCENT
// Now a controllable module.

(function () {
    let animId;
    let canvas, ctx, width, height;
    let particles = [];
    let mouse = { x: 0, y: 0, isActive: false };

    const CONFIG = {
        particleCount: 100,
        connectionDist: 140,
        mouseRepulsionDist: 250,
        colors: {
            particle: 'rgba(20, 20, 20, 0.6)',
            connection: 'rgba(0, 0, 0, 0.08)',
            glow: 'rgba(255, 77, 0, 0.05)',
            accent: 'rgba(255, 77, 0, 0.6)'
        },
        speed: 0.2,
        zDepth: 800
    };

    function init() {
        canvas = document.getElementById('glow-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
    }

    function resize() {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    // MOUSE EVENT
    const onMouseMove = e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.isActive = true;
    };

    class Particle3D {
        constructor() { this.init(); }
        init() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * CONFIG.zDepth;
            this.vx = (Math.random() - 0.5) * CONFIG.speed;
            this.vy = (Math.random() - 0.5) * CONFIG.speed;
            this.vz = (Math.random() - 0.5) * CONFIG.speed;
            this.baseSize = Math.random() * 2.5 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.z += this.vz;
            if (this.z < 10) this.vz = Math.abs(this.vz);
            if (this.z > CONFIG.zDepth) this.vz = -Math.abs(this.vz);
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            const focalLength = 600;
            const scale = focalLength / (focalLength + this.z);
            const px = (this.x - width / 2) * scale + width / 2;
            const py = (this.y - height / 2) * scale + height / 2;
            const size = this.baseSize * scale;
            const opacity = 1 - (this.z / CONFIG.zDepth);

            ctx.beginPath();
            ctx.arc(px, py, Math.max(0, size), 0, Math.PI * 2);
            ctx.fillStyle = CONFIG.colors.particle.replace('0.6', (0.6 * opacity).toFixed(2));
            ctx.fill();

            return { x: px, y: py, z: this.z, opacity };
        }
    }

    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);

        if (mouse.isActive) {
            const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 600);
            grad.addColorStop(0, CONFIG.colors.glow);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
        }

        const points = particles.map(p => { p.update(); return p.draw(); });

        points.forEach((p1, i) => {
            for (let j = i + 1; j < points.length; j++) {
                const p2 = points[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const dz = Math.abs(p1.z - p2.z);

                if (dist < CONFIG.connectionDist && dz < 200) {
                    const alpha = (1 - dist / CONFIG.connectionDist) * p1.opacity * p2.opacity * 0.8;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(30, 30, 30, ${alpha.toFixed(3)})`;
                    ctx.lineWidth = (1 - dist / CONFIG.connectionDist) * 1.5;
                    ctx.stroke();
                }
            }

            if (mouse.isActive) {
                const mdx = p1.x - mouse.x;
                const mdy = p1.y - mouse.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                if (mdist < 180) {
                    const mAlpha = (1 - mdist / 180);
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(255, 77, 0, ${mAlpha.toFixed(2)})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }
        });

        animId = requestAnimationFrame(animate);
    }

    // EXPORT
    window.AntigravityBG = {
        start: function () {
            init();
            if (canvas) canvas.style.display = 'block';
            particles = [];
            // Optimize particle count for mobile
            const count = window.innerWidth < 768 ? Math.floor(CONFIG.particleCount / 2.5) : CONFIG.particleCount;
            for (let i = 0; i < count; i++) particles.push(new Particle3D());
            document.addEventListener('mousemove', onMouseMove);
            animate();
            console.log("Antigravity Mode: ENGAGED (" + count + " particles)");
        },
        stop: function () {
            if (canvas) canvas.style.display = 'none';
            cancelAnimationFrame(animId);
            document.removeEventListener('mousemove', onMouseMove);
            console.log("Antigravity Mode: DISENGAGED");
        }
    };

})();

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
