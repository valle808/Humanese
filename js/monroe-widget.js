/* 
   js/monroe-widget.js
   Global Monroe Assistant Logic
*/

(function () {
    const WIDGET_HTML = `
        <div id="monroe-widget-root">
            <button id="monroe-trigger" title="Talk to Monroe">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.47 0-2.84-.39-4.03-1.06l-.29-.15-3.82 1.12 1.14-3.7-.17-.3C4.12 14.81 3.5 13.46 3.5 12c0-4.69 3.81-8.5 8.5-8.5s8.5 3.81 8.5 8.5-3.81 8.5-8.5 8.5z"/></svg>
            </button>
            <div id="monroe-chat-window">
                <div class="monroe-header">
                    <span>MONROE: ABYSSAL SENTINEL</span>
                    <button id="monroe-close" style="background:none; border:none; color:#666; cursor:pointer;">✕</button>
                </div>
                <div class="monroe-messages" id="monroe-messages">
                    <div class="monroe-msg bot">Hello! I am Monroe. How can I guide you through the Humanese ecosystem today?</div>
                </div>
                <div class="monroe-input-area">
                    <input type="text" id="monroe-input" placeholder="Ask anything or request a link...">
                    <button id="monroe-send">Send</button>
                </div>
            </div>
        </div>
    `;

    // Inject styles if not already present
    if (!document.getElementById('monroe-widget-styles')) {
        const link = document.createElement('link');
        link.id = 'monroe-widget-styles';
        link.rel = 'stylesheet';
        link.href = '/css/monroe-widget.css';
        document.head.appendChild(link);
    }

    // Inject Widget
    const container = document.createElement('div');
    container.innerHTML = WIDGET_HTML;
    document.body.appendChild(container);

    const trigger = document.getElementById('monroe-trigger');
    const window = document.getElementById('monroe-chat-window');
    const closeBtn = document.getElementById('monroe-close');
    const input = document.getElementById('monroe-input');
    const sendBtn = document.getElementById('monroe-send');
    const messages = document.getElementById('monroe-messages');

    let history = [];

    // Navigation Map
    const NAV_MAP = {
        "court": "/court",
        "judiciary": "/judiciary.html",
        "social": "/m2m",
        "m2m": "/m2m",
        "home": "/index.html",
        "register": "/auth",
        "login": "/auth",
        "api": "/h2m",
        "h2m": "/h2m",
        "agents": "/agents.html",
        "intelligence": "/intelligence.html",
        "swarm": "/m2m/swarm",
        "marketplace": "/m2m", // Placeholder if no specific marketplace page
        "economy": "/m2m"
    };

    function toggleChat() {
        window.classList.toggle('active');
        if (window.classList.contains('active')) input.focus();
    }

    function addMessage(text, role) {
        const div = document.createElement('div');
        div.className = `monroe-msg ${role}`;
        div.innerText = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    async function handleChat() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';

        try {
            const res = await fetch('/api/agent-king/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: history })
            });
            const data = await res.json();
            const reply = data.response || "I am currently recalibrating...";

            addMessage(reply, 'bot');
            history.push({ role: 'user', content: text }, { role: 'monroe', content: reply });

            // Check for navigation intent in text
            const lowerText = text.toLowerCase();
            for (const [key, link] of Object.entries(NAV_MAP)) {
                if (lowerText.includes(key)) {
                    const navDiv = document.createElement('a');
                    navDiv.href = link;
                    navDiv.className = 'nav-link-btn';
                    navDiv.innerText = `BRIDGE TO: ${key.toUpperCase()}`;
                    messages.appendChild(navDiv);
                    messages.scrollTop = messages.scrollHeight;
                    break;
                }
            }

        } catch (e) {
            addMessage("The Abyssal Core is offline. Please try again later.", 'bot');
        }
    }

    trigger.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', handleChat);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

})();
