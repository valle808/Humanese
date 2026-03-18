/**
 * AgentKin Neural Assistant - Frontend Logic
 * Handles UI interactions, message sending, and remote control execution.
 */

(function () {
    // --- UI ELEMENTS ---
    const chatToggle = document.createElement('div');
    chatToggle.className = 'chat-toggle-btn';
    chatToggle.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M21,6H3C2.45,6 2,6.45 2,7V17A1,1 0 0,0 3,18H6L10,22V18H21A1,1 0 0,0 22,17V7A1,1 0 0,0 21,6M20,16H9.17L7.59,17.58V16H4V8H20V16M18,10H6V11H18V10M18,13H6V14H18V13Z" />
        </svg>`;
    document.body.appendChild(chatToggle);

    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    chatWindow.innerHTML = `
        <div class="chat-header">
            <div class="chat-header-title">
                <div class="chat-status-dot"></div>
                AgentKin Neural Core
            </div>
            <button class="chat-close" style="background:none; border:none; color:#AAA; cursor:pointer; font-size:1.2rem;">×</button>
        </div>
        <div class="chat-messages" id="chatMessages">
            <div class="message bot">Hello! I am the AgentKin Neural Assistant. How can I help you manage your autonomous workspace today?</div>
        </div>
        <div class="chat-input-area">
            <input type="text" class="chat-input" id="chatInput" placeholder="Ask anything..." autocomplete="off">
            <button class="chat-send-btn" id="chatSend">
                <svg viewBox="0 0 24 24"><path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" /></svg>
            </button>
        </div>`;
    document.body.appendChild(chatWindow);

    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatClose = chatWindow.querySelector('.chat-close');

    // --- STATE ---
    let isOpen = false;

    // --- FUNCTIONS ---
    function toggleChat() {
        isOpen = !isOpen;
        chatWindow.classList.toggle('active', isOpen);
    }

    function addMessage(text, role = 'bot') {
        const msg = document.createElement('div');
        msg.className = `message ${role}`;
        msg.innerText = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';

        try {
            const response = await fetch('http://localhost:8000/api/v1/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || "Server Error");
            }

            const data = await response.json();

            if (data.response) {
                addMessage(data.response, 'bot');
            }

            // Handle Remote Control Commands
            if (data.command) {
                executeCommand(data.command);
            }
        } catch (error) {
            console.error('Chat Error:', error);
            // If it's a motor error, display it gracefully
            if (error.message.includes("[MOTOR:")) {
                addMessage("Neural Core is currently optimizing logic gates. [Cognitive Fallback Engaged]: I am here, but my deep reasoning is temporarily syncing with the swarm. How else can I assist?", 'bot');
            } else {
                addMessage("Neural Core offline. Please ensure the backend engine is running on port 8000.", 'bot');
            }
        }
    }

    function executeCommand(cmd) {
        console.log("Executing Remote Command:", cmd);
        try {
            if (cmd.action === 'openWindow') {
                if (window.openWindow) window.openWindow();
            } else if (cmd.action === 'closeWindow') {
                if (window.closeWindow) window.closeWindow();
            } else if (cmd.action === 'maximizeWindow') {
                if (window.maximizeWindow) window.maximizeWindow();
            } else if (cmd.action === 'minimizeWindow') {
                if (window.minimizeWindow) window.minimizeWindow();
            } else if (cmd.action === 'triggerExplosion') {
                if (window.triggerOrbExplosion) window.triggerOrbExplosion();
            } else if (cmd.action === 'scrollTo') {
                const el = document.querySelector(cmd.target);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (e) {
            console.error("Command Execution Failed:", e);
        }
    }

    // --- LISTENERS ---
    chatToggle.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Handle incoming commands from other sources (Telegram/WhatsApp via WebSockets)
    if (typeof io !== 'undefined') {
        const socket = io('http://localhost:8000');
        socket.on('remote_command', (cmd) => {
            executeCommand(cmd);
            addMessage(`[Remote Command Executed: ${cmd.action}]`, 'bot');
        });
    }

})();
