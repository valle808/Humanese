/**
 * Humanese UI Effects - Mouse-over Physics & Character Splitting
 * Inspired by AgentKin Core
 */

window.initializeUIEffects = () => {
    const heroTitle = document.getElementById('header-text');
    const heroPara = document.querySelector('.ak-hero p.subhero');

    if (!heroTitle) return;

    const splitIntoChars = (el) => {
        const text = el.innerText.trim();
        if (text === "") return;

        // Clear everything out to prevent duplicates
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }

        // Use a wrapper that prevents word breaking
        const words = text.split(/\s+/);
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word-wrapper';
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';

            word.split('').forEach(char => {
                const span = document.createElement('span');
                span.textContent = char;
                span.className = 'char physics-target';
                wordSpan.appendChild(span);
            });

            el.appendChild(wordSpan);

            if (wordIndex < words.length - 1) {
                const space = document.createElement('span');
                space.innerHTML = '&nbsp;';
                space.className = 'char physics-target';
                el.appendChild(space);
            }
        });
    };

    const wrappers = heroTitle.querySelectorAll('.char-wrapper');
    if (wrappers.length > 0) {
        wrappers.forEach(w => splitIntoChars(w));
    } else {
        splitIntoChars(heroTitle);
    }

    if (heroPara) splitIntoChars(heroPara);
};

document.addEventListener('DOMContentLoaded', () => {
    window.initializeUIEffects();

    // 2. Physics Attraction/Repulsion Loop
    document.addEventListener('mousemove', (e) => {
        const mx = e.clientX;
        const my = e.clientY;
        const physicsTargets = document.querySelectorAll('.physics-target');

        physicsTargets.forEach(el => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.hypot(mx - cx, my - cy);

            if (dist < 100) {
                const force = (100 - dist) / 100;
                const angle = Math.atan2(my - cy, mx - cx);
                const power = -20; // Repulsion

                el.style.transform = `translate(${Math.cos(angle) * force * power}px, ${Math.sin(angle) * force * power}px)`;
                el.style.color = 'var(--accent-primary)';
            } else {
                el.style.transform = '';
                el.style.color = '';
            }
        });
    });
});
