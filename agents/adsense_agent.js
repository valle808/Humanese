/**
 * Humanese Smart AdSense Agent
 * Dynamically manages ad placements based on user engagement and "Hot Zones".
 */

class AdSenseAgent {
    constructor() {
        this.publisherId = 'ca-pub-8867340586657793';
        this.engagementThreshold = 3000; // 3 seconds in a zone
        this.zones = new Map();
        this.activeAds = 0;
        this.maxAds = 3;

        this.init();
    }

    init() {
        console.log('🤖 [AdSense Agent] Initialized. Monitoring Hot Zones...');
        this.observeZones();
        this.trackScroll();
    }

    observeZones() {
        // Targets sections, articles, and main content blocks
        const targetSelectors = 'section, article, .glass-panel, .eco-card, .matrix-card';
        const elements = document.querySelectorAll(targetSelectors);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id || entry.target.className + Math.random();
                if (entry.isIntersecting) {
                    this.zones.set(id, {
                        element: entry.target,
                        startTime: Date.now(),
                        inView: true
                    });
                } else {
                    const zone = this.zones.get(id);
                    if (zone && zone.inView) {
                        const duration = Date.now() - zone.startTime;
                        if (duration > this.engagementThreshold) {
                            this.injectAd(entry.target);
                        }
                        zone.inView = false;
                    }
                }
            });
        }, { threshold: 0.5 });

        elements.forEach(el => observer.observe(el));
    }

    trackScroll() {
        window.addEventListener('scroll', () => {
            const scrollDepth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            if (scrollDepth > 0.9 && this.activeAds < this.maxAds) {
                this.injectFooterAd();
            }
        }, { passive: true });
    }

    injectAd(targetElement) {
        if (this.activeAds >= this.maxAds) return;
        if (targetElement.querySelector('.adsbygoogle')) return;

        console.log('🤖 [AdSense Agent] High engagement detected. Injecting smart ad unit...');

        const adContainer = document.createElement('div');
        adContainer.className = 'smart-ad-container';
        adContainer.style.margin = '20px 0';
        adContainer.style.textAlign = 'center';
        adContainer.style.width = '100%';
        adContainer.style.minHeight = '90px';
        adContainer.style.overflow = 'hidden';

        adContainer.innerHTML = `
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${this.publisherId}"
                 data-ad-slot="dynamic"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        `;

        // Inject after the engaged element
        targetElement.after(adContainer);

        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
            this.activeAds++;
        } catch (e) {
            console.error('[AdSense Agent] Ad push failed:', e);
        }
    }

    injectFooterAd() {
        const footer = document.querySelector('footer');
        if (!footer || footer.querySelector('.adsbygoogle')) return;

        console.log('🤖 [AdSense Agent] End of page reached. Injecting footer ad...');
        this.injectAd(footer);
    }
}

// Initialize on load
window.addEventListener('load', () => {
    window.humaneseAdAgent = new AdSenseAgent();
});
