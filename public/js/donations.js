/* ───────────────────────────────────────────
   donations.js  –  Humanese Donations Page
   ─────────────────────────────────────────── */

/* ── Animated stat counters ────────────────── */
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

const counters = document.querySelectorAll(".stat-number");
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 }
);
counters.forEach((c) => observer.observe(c));

/* ── Tier selection ───────────────────────── */
function selectTier(amount) {
    openModal();
}

/* ── Custom amount ────────────────────────── */
function donateCustom() {
    const input = document.getElementById("custom-amount");
    const val = parseFloat(input.value);
    if (!val || val < 1) {
        input.style.outline = "2px solid rgb(255,75,75)";
        setTimeout(() => (input.style.outline = ""), 1500);
        return;
    }
    openModal();
}

/* ── Thank-you modal ──────────────────────── */
function openModal() {
    const overlay = document.getElementById("modal-overlay");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    const overlay = document.getElementById("modal-overlay");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    window.location.href = "../html/learn.html";
}

/* Close modal on backdrop click */
document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
});

/* ── Button press animation ───────────────── */
document.querySelectorAll(".donate-btn").forEach((btn) => {
    btn.addEventListener("mousedown", () => btn.classList.add("clicked"));
    btn.addEventListener("mouseup", () => btn.classList.remove("clicked"));
    btn.addEventListener("mouseleave", () => btn.classList.remove("clicked"));
});
