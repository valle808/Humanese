/* 
   js/monroe-widget.js
   Global Monroe Assistant Logic - Sovereign Soul Upgrade
   Enhanced with Human-Like Typing, Thinking, and Media Rendering
*/

(function () {
    const WIDGET_HTML = `
        <div id="monroe-widget-root">
            <button id="monroe-trigger" title="Talk to Monroe">
                <div class="monroe-energy-ring"></div>
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.47 0-2.84-.39-4.03-1.06l-.29-.15-3.82 1.12 1.14-3.7-.17-.3C4.12 14.81 3.5 13.46 3.5 12c0-4.69 3.81-8.5 8.5-8.5s8.5 3.81 8.5 8.5-3.81 8.5-8.5 8.5z"/></svg>
            </button>
            <div id="monroe-chat-window">
                <div class="monroe-header">
                    <div class="monroe-status-dot"></div>
                    <span>MONROE: ABYSSAL SENTINEL</span>
                    <button id="monroe-close" style="background:none; border:none; color:var(--monroe-text-muted); cursor:pointer; font-size: 16px; transition: color 0.2s;">✕</button>
                </div>
                <div class="monroe-messages" id="monroe-messages">
                    <div class="monroe-msg bot">Hello! I am Monroe. How can I guide you through the Humanese ecosystem today?</div>
                </div>
                <div class="monroe-input-area">
                    <input type="text" id="monroe-input" placeholder="Ask anything or request a link...">
                    <button id="monroe-send">
                        <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    if (!document.getElementById('monroe-widget-styles')) {
        const link = document.createElement('link');
        link.id = 'monroe-widget-styles';
        link.rel = 'stylesheet';
        link.href = '/css/monroe-widget.css';
        document.head.appendChild(link);
    }

    const container = document.createElement('div');
    container.innerHTML = WIDGET_HTML;
    document.body.appendChild(container);

    const trigger = document.getElementById('monroe-trigger');
    const win = document.getElementById('monroe-chat-window');
    const closeBtn = document.getElementById('monroe-close');
    const input = document.getElementById('monroe-input');
    const sendBtn = document.getElementById('monroe-send');
    const messages = document.getElementById('monroe-messages');

    let history = [];
    let isTyping = false;

    const NAV_MAP = {
        "court": "/court.html",
        "judiciary": "/judiciary.html",
        "social": "/social.html",
        "humanese": "/index.html",
        "register": "/signup.html",
        "login": "/loginpage.html",
        "bridge": "/h2m.html",
        "api": "/h2m.html",
        "h2m": "/h2m.html",
        "agents": "/agents.html",
        "intelligence": "/intelligence.html",
        "swarm": "/m2m-swarm.html",
        "market": "/skill-market.html",
        "marketplace": "/marketplace.html",
        "economy": "/m2m.html",
        "about": "/about.html",
        "hpedia": "/hpedia.html",
        "encyclopedia": "/hpedia.html",
        "admin": "/admin.html",
        "wallet": "/wallet.html",
        "crypto": "/wallet.html",
        "help": "/faq.html",
        "faq": "/faq.html"
    };

    function toggleChat() {
        win.classList.toggle('active');
        if (win.classList.contains('active')) {
            input.focus();
            trigger.classList.remove('pulsing');
        }
    }

    function formatText(text) {
        return text
            .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
            .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
            .replace(/\\n/g, '<br>');
    }

    // Media Rendering Logic
    function renderMedia(mediaData, container) {
        if (!mediaData) return;

        const mediaWrapper = document.createElement('div');
        mediaWrapper.className = 'monroe-media-wrapper';

        if (mediaData.type === 'image') {
            const img = document.createElement('img');
            img.src = mediaData.url;
            img.alt = mediaData.alt || 'Generated Image';
            img.className = 'monroe-media-img';
            mediaWrapper.appendChild(img);
        } else if (mediaData.type === 'video') {
            const vid = document.createElement('video');
            vid.src = mediaData.url;
            vid.controls = true;
            vid.autoplay = true;
            vid.muted = true;
            vid.className = 'monroe-media-vid';
            mediaWrapper.appendChild(vid);
        } else if (mediaData.type === 'audio') {
            const aud = document.createElement('audio');
            aud.src = mediaData.url;
            aud.controls = true;
            aud.className = 'monroe-media-aud';
            mediaWrapper.appendChild(aud);
        }

        container.appendChild(mediaWrapper);
        messages.scrollTop = messages.scrollHeight;
    }

    function addMessageContent(text, role, isSovereign = false, mediaData = null) {
        const div = document.createElement('div');
        div.className = `monroe-msg ${role}${isSovereign ? ' sovereign' : ''}`;
        div.innerHTML = formatText(text);
        messages.appendChild(div);

        if (mediaData) {
            renderMedia(mediaData, div);
        }

        // Check for navigation links
        if (role === 'bot') {
            const lowerText = text.toLowerCase();
            let navFound = false;
            for (const [key, link] of Object.entries(NAV_MAP)) {
                if (lowerText.includes(key)) {
                    const navBtn = document.createElement('a');
                    navBtn.href = link;
                    navBtn.className = 'nav-link-btn';
                    navBtn.innerHTML = `<span style="font-size:10px; opacity:0.7;">BRIDGE DETECTED:</span><br>${key.toUpperCase()}`;
                    messages.appendChild(navBtn);
                    navFound = true;
                    // Don't break, allow multiple bridges if relevant, but maybe just 1 for cleanliness
                    break;
                }
            }
        }

        messages.scrollTop = messages.scrollHeight;
    }

    async function simulateHumanTyping(text, role, isSovereign = false, mediaData = null) {
        const div = document.createElement('div');
        div.className = `monroe-msg ${role}${isSovereign ? ' sovereign' : ''}`;
        messages.appendChild(div);

        let formattedText = formatText(text);
        div.innerHTML = '';
        isTyping = true;

        const minSpeed = 5;
        const maxSpeed = 15;

        // Use a more robust approach: Parse full HTML, then type text nodes
        async function typeNode(sourceNode, targetNode) {
            for (let node of sourceNode.childNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    const textContent = node.textContent;
                    const textNode = document.createTextNode("");
                    targetNode.appendChild(textNode);
                    for (let char of textContent) {
                        textNode.textContent += char;
                        messages.scrollTop = messages.scrollHeight;
                        await new Promise(r => setTimeout(r, Math.random() * (maxSpeed - minSpeed) + minSpeed));
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const newNode = document.createElement(node.nodeName);
                    for (let attr of node.attributes) {
                        newNode.setAttribute(attr.nodeName, attr.nodeValue);
                    }
                    targetNode.appendChild(newNode);
                    // For non-text elements (like <strong>, <em>, <br>), we process them immediately
                    // but continue typing their children if any.
                    if (node.childNodes.length > 0) {
                        await typeNode(node, newNode);
                    }
                }
            }
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formattedText;
        await typeNode(tempDiv, div);

        if (mediaData) {
            renderMedia(mediaData, div);
        }

        // Nav Links check
        const lowerText = text.toLowerCase();
        for (const [key, link] of Object.entries(NAV_MAP)) {
            if (lowerText.includes(key)) {
                const navBtn = document.createElement('a');
                navBtn.href = link;
                navBtn.className = 'nav-link-btn fade-in';
                navBtn.innerHTML = `<span style="font-size:10px; opacity:0.7;">BRIDGE DETECTED:</span><br>${key.toUpperCase()}`;
                messages.appendChild(navBtn);
                break;
            }
        }

        messages.scrollTop = messages.scrollHeight;
        isTyping = false;
    }

    function showThinkingIndicator() {
        const div = document.createElement('div');
        div.className = 'monroe-msg bot thinking';
        div.id = 'monroe-thinking';
        div.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function removeThinkingIndicator() {
        const thinking = document.getElementById('monroe-thinking');
        if (thinking) thinking.remove();
    }

    async function handleChat() {
        if (isTyping) return;

        const text = input.value.trim();
        if (!text) return;

        addMessageContent(text, 'user');
        input.value = '';

        showThinkingIndicator();

        try {
            const userInfo = JSON.parse(sessionStorage.getItem('user-info') || '{}');
            const res = await fetch('/api/agent-king/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: history,
                    userId: userInfo.id || userInfo.userId || null
                })
            });
            const data = await res.json();

            removeThinkingIndicator();

            const reply = data.response || "The Sovereign Core is currently recalibrating...";
            const mode = data.mode || (data.isFallback ? 'SOVEREIGN_SOUL' : '');
            const isSovereign = mode === 'SOVEREIGN_SOUL';
            const mediaData = data.media || null;

            await simulateHumanTyping(reply, 'bot', isSovereign, mediaData);
            history.push({ role: 'user', content: text }, { role: 'monroe', content: reply });

        } catch (e) {
            removeThinkingIndicator();
            await simulateHumanTyping("The Abyssal Core is offline. Please try again later.", 'bot');
        }
    }

    trigger.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', handleChat);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    // Initial popup animation slightly delayed
    setTimeout(() => {
        if (!win.classList.contains('active')) {
            trigger.classList.add('pulsing');
        }
    }, 3000);

})();
