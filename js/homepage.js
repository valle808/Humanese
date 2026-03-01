// ══════════════════════════════════════════════════════════
// js/homepage.js — Live data engine for the Humanese homepage
// Fetches stats, crypto, and guardian data via AJAX
// ══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavScroll();
    fetchStats();
    fetchCrypto();
    fetchGuardian();

    // Refresh stats every 60 seconds
    setInterval(fetchStats, 60000);
    // Refresh crypto every 5 minutes
    setInterval(fetchCrypto, 300000);
});

// ── Scroll-reveal animations ─────────────────────────────
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ── Nav background on scroll ─────────────────────────────
function initNavScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// ── Fetch live system stats ──────────────────────────────
async function fetchStats() {
    try {
        const res = await fetch('/api/homepage/stats');
        if (!res.ok) throw new Error('Stats API error');
        const data = await res.json();

        // Update dashboard
        animateValue('stat-agents', data.agents.online);
        document.getElementById('stat-valle').textContent = formatNumber(data.valle.circulating);
        document.getElementById('stat-uptime').textContent = data.network.uptime;
        animateValue('stat-cases', data.network.activeCases);

        // Update hero from server rotation
        if (data.hero) {
            const h1 = document.getElementById('hero-headline');
            const p = document.getElementById('hero-sub');
            if (h1 && data.hero.headline) h1.textContent = data.hero.headline;
            if (p && data.hero.sub) p.textContent = data.hero.sub;
        }

        // Update hero badge node count
        const badge = document.querySelector('.hero-badge span:last-child');
        if (badge && data.agents.total) {
            badge.textContent = `NETWORK ONLINE — ${(8000 + data.agents.total * 196).toLocaleString()} NODES`;
        }
    } catch (e) {
        console.warn('Stats fetch failed, using defaults:', e.message);
    }
}

// ── Fetch crypto market data ─────────────────────────────
async function fetchCrypto() {
    try {
        const res = await fetch('/api/homepage/crypto');
        if (!res.ok) throw new Error('Crypto API error');
        const data = await res.json();

        // Bitcoin
        if (data.bitcoin) {
            document.getElementById('btc-price').textContent = '$' + data.bitcoin.price.toLocaleString(undefined, { maximumFractionDigits: 0 });
            updateChange('btc-change', data.bitcoin.change24h);
        }

        // Ethereum
        if (data.ethereum) {
            document.getElementById('eth-price').textContent = '$' + data.ethereum.price.toLocaleString(undefined, { maximumFractionDigits: 0 });
            updateChange('eth-change', data.ethereum.change24h);
        }

        // VALLE
        if (data.valle) {
            document.getElementById('valle-price').textContent = '$' + data.valle.price.toFixed(7);
            updateChange('valle-change', data.valle.change24h);
        }
    } catch (e) {
        console.warn('Crypto fetch failed, using defaults:', e.message);
    }
}

// ── Fetch Guardian AI status ─────────────────────────────
async function fetchGuardian() {
    try {
        const res = await fetch('/api/homepage/guardian');
        if (!res.ok) throw new Error('Guardian API error');
        const data = await res.json();

        if (data.healthScore) {
            document.getElementById('g-health').textContent = data.healthScore + '%';
        }
        if (data.actionsToday) {
            document.getElementById('g-actions').textContent = data.actionsToday;
        }
        if (data.uptime) {
            document.getElementById('g-uptime').textContent = data.uptime;
        }
    } catch (e) {
        console.warn('Guardian fetch failed, using defaults:', e.message);
    }
}

// ── Helpers ──────────────────────────────────────────────
function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
}

function updateChange(id, change) {
    const el = document.getElementById(id);
    if (!el) return;
    const sign = change >= 0 ? '+' : '';
    el.textContent = sign + change.toFixed(1) + '%';
    el.className = 'crypto-change ' + (change >= 0 ? 'up' : 'down');
}

function animateValue(id, endVal) {
    const el = document.getElementById(id);
    if (!el) return;
    const startVal = parseInt(el.textContent) || 0;
    const diff = endVal - startVal;
    const duration = 800;
    const start = performance.now();

    function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(startVal + diff * eased);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// ── Copy wallet address ──────────────────────────────────
window.copyWallet = function () {
    const addr = document.getElementById('wallet-addr');
    const msg = document.getElementById('wallet-copy-msg');
    if (!addr) return;

    navigator.clipboard.writeText(addr.textContent).then(() => {
        if (msg) {
            msg.textContent = '✓ Copied!';
            msg.style.color = 'var(--accent)';
            setTimeout(() => {
                msg.textContent = 'Click to copy';
                msg.style.color = '';
            }, 2000);
        }
    }).catch(() => {
        // Fallback
        const range = document.createRange();
        range.selectNode(addr);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        if (msg) msg.textContent = '✓ Copied!';
    });
};
