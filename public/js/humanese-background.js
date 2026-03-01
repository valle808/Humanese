// HUMANESE DIMENSION: GREEN NEON (Adapted from AgentKin Alien Mode)

(function () {
    let animId;
    let canvas, ctx, width, height;
    let nodes = [];
    let mouse = { x: -100, y: -100, active: false };
    let time = 0;
    let cursor; // Custom cursor element

    const CONFIG = {
        nodeCount: 150,
        connectionDist: 100,
        speed: 0.5,
        mouseForce: 300
    };

    // CSS INJECTION
    const styleId = 'humanese-bg-styles';
    function injectStyles() {
        if (document.getElementById(styleId)) return;
        const css = `
            #humanese-canvas {
                position: fixed; inset: 0; z-index: 0; opacity: 1; pointer-events: none; display: block;
            }
            #custom-cursor {
                position: fixed; top: 0; left: 0;
                width: 20px; height: 20px;
                background: rgba(255, 110, 0, 0.6);
                border: 2px solid #FFF;
                border-radius: 50%;
                pointer-events: none; z-index: 9999;
                margin-left: -10px; margin-top: -10px;
                box-shadow: 0 0 15px #FF6E00, inset 0 0 10px #FFF;
                transition: width 0.1s, height 0.1s, background 0.2s, box-shadow 0.2s;
                mix-blend-mode: multiply; display: block;
            }
            #custom-cursor.active { transform: scale(0.8); background: #CC5500; box-shadow: 0 0 20px #CC5500; }
            #custom-cursor.hover { width: 50px; height: 50px; margin-left: -25px; margin-top: -25px; background: rgba(255, 153, 19, 0.1); border-color: #FF6E00; box-shadow: 0 0 30px rgba(255, 110, 0, 0.4); }
        `;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    function init() {
        injectStyles();

        // Create Canvas if missing
        if (!document.getElementById('humanese-canvas')) {
            canvas = document.createElement('canvas');
            canvas.id = 'humanese-canvas';
            document.body.prepend(canvas);
        } else {
            canvas = document.getElementById('humanese-canvas');
        }
        ctx = canvas.getContext('2d');

        // Create Cursor if missing
        if (!document.getElementById('custom-cursor')) {
            cursor = document.createElement('div');
            cursor.id = 'custom-cursor';
            document.body.appendChild(cursor);
        } else {
            cursor = document.getElementById('custom-cursor');
        }

        window.addEventListener('resize', resize);
        resize();
    }

    function resize() {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * CONFIG.speed;
            this.vy = (Math.random() - 0.5) * CONFIG.speed;
            this.size = Math.random() * 2 + 1;
            this.hue = 25 + Math.random() * 15; // Orange hue (25-40)
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (mouse.active) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONFIG.mouseForce) {
                    const force = (CONFIG.mouseForce - dist) / CONFIG.mouseForce;
                    const angle = Math.atan2(dy, dx);
                    const swirl = 1.5;
                    this.x += Math.cos(angle + swirl) * force * 5;
                    this.y += Math.sin(angle + swirl) * force * 5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            const color = `hsla(${this.hue}, 100%, 50%, 0.8)`;
            ctx.fillStyle = color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function animate() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; // White background
        ctx.fillRect(0, 0, width, height);

        time += 0.5;

        nodes.forEach(node => { node.update(); node.draw(); });

        nodes.forEach((n1, i) => {
            for (let j = i + 1; j < nodes.length; j++) {
                const n2 = nodes[j];
                const dx = n1.x - n2.x;
                const dy = n1.y - n2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.connectionDist) {
                    const alpha = 1 - dist / CONFIG.connectionDist;
                    ctx.beginPath();
                    ctx.moveTo(n1.x, n1.y);
                    ctx.lineTo(n2.x, n2.y);
                    const midHue = (n1.hue + n2.hue) / 2;
                    ctx.strokeStyle = `hsla(${midHue}, 80%, 50%, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        });

        if (mouse.active) {
            const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
            grad.addColorStop(0, 'rgba(255, 110, 0, 0.1)'); // Orange glow
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
        }

        animId = requestAnimationFrame(animate);
    }

    // EVENT HANDLERS
    const onMouseMove = e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;

        if (cursor) {
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        }
    };

    const onMouseDown = () => { if (cursor) cursor.classList.add('active'); };
    const onMouseUp = () => { if (cursor) cursor.classList.remove('active'); };

    const onMouseEnter = () => { if (cursor) cursor.classList.add('hover'); };
    const onMouseLeave = () => { if (cursor) cursor.classList.remove('hover'); };

    function attachCursorEvents() {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);

        document.querySelectorAll('a, button, input, .interactive').forEach(el => {
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });

        document.documentElement.style.cursor = 'none';
        document.body.style.cursor = 'none';
    }

    // EXPORT & AUTOSTART
    window.HumaneseBG = {
        start: function () {
            init();
            canvas.style.display = 'block';
            cursor.style.display = 'block';
            nodes = [];
            const count = window.innerWidth < 768 ? Math.floor(CONFIG.nodeCount / 3) : CONFIG.nodeCount;
            for (let i = 0; i < count; i++) nodes.push(new Node());
            animate();
            attachCursorEvents();
        }
    };

    // Auto-start on load
    window.addEventListener('load', () => window.HumaneseBG.start());

})();
