/* 
   js/monroe-widget.js — MONROE: ABYSSAL SENTINEL v3.0
   AI-powered with Gemini free API + rich local fallback
   Zero dependency, fully serverless-compatible
*/
(function () {
    'use strict';

    // ── Inject widget CSS ────────────────────────────────────────────────────────
    if (!document.getElementById('monroe-ws')) {
        const s = document.createElement('style');
        s.id = 'monroe-ws';
        s.textContent = `
        :root {
            --mw-bg: #0a0a12;
            --mw-surface: #111120;
            --mw-border: rgba(0,255,204,0.18);
            --mw-user: #0d2d3d;
            --mw-bot: #121228;
            --mw-sovereign: linear-gradient(135deg, #0d1a2e 0%, #1a0d2e 100%);
            --mw-text: #e0e8f0;
            --mw-muted: #6b7a8d;
            --mw-accent: #00ffcc;
            --mw-accent2: #ff00ff;
        }
        #monroe-widget-root { position:fixed; bottom:24px; right:24px; z-index:99999; font-family:'Inter','Space Grotesk',sans-serif; }
        #monroe-trigger {
            width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#001a15,#001a28);
            border:2px solid var(--mw-accent); cursor:pointer; display:flex; align-items:center;
            justify-content:center; box-shadow:0 0 20px rgba(0,255,204,0.3),0 0 40px rgba(0,255,204,0.1);
            transition:all 0.3s; position:relative; overflow:visible;
        }
        #monroe-trigger:hover { box-shadow:0 0 30px rgba(0,255,204,0.5),0 0 60px rgba(0,255,204,0.2); transform:scale(1.05); }
        #monroe-trigger svg { width:26px; height:26px; fill:var(--mw-accent); }
        .monroe-energy-ring {
            position:absolute; width:70px; height:70px; border-radius:50%;
            border:1px solid rgba(0,255,204,0.3); animation:mw-ring 2s ease-in-out infinite; pointer-events:none;
        }
        @keyframes mw-ring { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.15);opacity:0.2} }
        #monroe-trigger.pulsing .monroe-energy-ring { border-color:rgba(0,255,204,0.6); }
        #monroe-chat-window {
            position:absolute; bottom:70px; right:0; width:360px; height:520px;
            background:var(--mw-bg); border:1px solid var(--mw-border); border-radius:20px;
            display:flex; flex-direction:column; overflow:hidden;
            box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 30px rgba(0,255,204,0.08);
            opacity:0; transform:translateY(12px) scale(0.95); pointer-events:none;
            transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        #monroe-chat-window.active { opacity:1; transform:translateY(0) scale(1); pointer-events:all; }
        .monroe-header {
            display:flex; align-items:center; gap:10px; padding:14px 16px;
            background:linear-gradient(135deg,#001a15,#0d0030);
            border-bottom:1px solid var(--mw-border); flex-shrink:0;
        }
        .monroe-status-dot { width:8px; height:8px; border-radius:50%; background:var(--mw-accent); animation:mw-blink 1.4s ease-in-out infinite; flex-shrink:0; }
        @keyframes mw-blink { 0%,100%{opacity:1;box-shadow:0 0 6px var(--mw-accent)} 50%{opacity:0.4;box-shadow:none} }
        .monroe-header span { flex:1; font-size:11px; font-weight:800; letter-spacing:1.5px; color:var(--mw-accent); text-transform:uppercase; }
        #monroe-close { background:none; border:none; color:var(--mw-muted); cursor:pointer; font-size:16px; padding:2px 4px; border-radius:4px; transition:color 0.2s; }
        #monroe-close:hover { color:var(--mw-text); }
        .monroe-messages { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; scroll-behavior:smooth; }
        .monroe-messages::-webkit-scrollbar { width:4px; }
        .monroe-messages::-webkit-scrollbar-track { background:transparent; }
        .monroe-messages::-webkit-scrollbar-thumb { background:var(--mw-border); border-radius:2px; }
        .monroe-msg { padding:11px 14px; border-radius:14px; font-size:13.5px; line-height:1.55; max-width:88%; word-break:break-word; animation:mw-fadein 0.2s ease; }
        @keyframes mw-fadein { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
        .monroe-msg.user { background:var(--mw-user); border:1px solid rgba(0,255,204,0.12); align-self:flex-end; color:var(--mw-text); border-radius:14px 14px 4px 14px; }
        .monroe-msg.bot { background:var(--mw-bot); border:1px solid rgba(255,255,255,0.06); align-self:flex-start; color:var(--mw-text); border-radius:14px 14px 14px 4px; }
        .monroe-msg.sovereign { background:var(--mw-sovereign); border:1px solid rgba(255,0,255,0.2); border-left:3px solid var(--mw-accent2); }
        .monroe-msg strong { color:var(--mw-accent); }
        .monroe-msg a { color:var(--mw-accent); text-decoration:none; }
        .monroe-msg a:hover { text-decoration:underline; }
        .monroe-cursor { display:inline-block; color:var(--mw-accent); animation:mw-cursor 0.6s step-start infinite; }
        @keyframes mw-cursor { 0%,100%{opacity:1} 50%{opacity:0} }
        .typing-indicator { display:flex; gap:4px; align-items:center; padding:4px 0; }
        .typing-indicator span { width:7px; height:7px; border-radius:50%; background:var(--mw-accent); animation:mw-bounce 1.2s ease infinite; }
        .typing-indicator span:nth-child(2) { animation-delay:0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay:0.4s; }
        @keyframes mw-bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px);opacity:0.5} }
        .monroe-nav-btn {
            display:inline-flex; align-items:center; gap:6px; margin-top:8px; padding:6px 12px;
            background:rgba(0,255,204,0.06); border:1px solid rgba(0,255,204,0.25); border-radius:20px;
            color:var(--mw-accent); font-size:11px; font-weight:700; text-decoration:none; letter-spacing:0.8px;
            transition:all 0.2s; cursor:pointer;
        }
        .monroe-nav-btn:hover { background:rgba(0,255,204,0.12); box-shadow:0 0 12px rgba(0,255,204,0.2); }
        .monroe-input-area { display:flex; gap:8px; padding:12px 14px; border-top:1px solid var(--mw-border); background:var(--mw-surface); flex-shrink:0; }
        #monroe-input {
            flex:1; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
            border-radius:20px; padding:9px 14px; color:var(--mw-text); font-size:13px;
            outline:none; transition:border-color 0.2s;
        }
        #monroe-input::placeholder { color:var(--mw-muted); }
        #monroe-input:focus { border-color:rgba(0,255,204,0.4); }
        #monroe-send {
            width:38px; height:38px; border-radius:50%; background:var(--mw-accent);
            border:none; cursor:pointer; display:flex; align-items:center; justify-content:center;
            transition:all 0.2s; flex-shrink:0;
        }
        #monroe-send:hover { transform:scale(1.1); box-shadow:0 0 14px rgba(0,255,204,0.5); }
        #monroe-send svg { fill:#000; }
        #monroe-send.loading { background:var(--mw-muted); pointer-events:none; animation:mw-pulse 0.8s ease infinite; }
        @keyframes mw-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(0.9)} }
        `;
        document.head.appendChild(s);
    }

    // ── Inject HTML ──────────────────────────────────────────────────────────────
    const tpl = `<div id="monroe-widget-root">
        <button id="monroe-trigger" title="Talk to Monroe" aria-label="Open Monroe Chat">
            <div class="monroe-energy-ring"></div>
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.47 0-2.84-.39-4.03-1.06l-.29-.15-3.82 1.12 1.14-3.7-.17-.3C4.12 14.81 3.5 13.46 3.5 12c0-4.69 3.81-8.5 8.5-8.5s8.5 3.81 8.5 8.5-3.81 8.5-8.5 8.5z"/></svg>
        </button>
        <div id="monroe-chat-window" role="dialog" aria-label="Monroe Chat">
            <div class="monroe-header">
                <div class="monroe-status-dot"></div>
                <span>Monroe · Abyssal Sentinel</span>
                <button id="monroe-close" aria-label="Close chat">✕</button>
            </div>
            <div class="monroe-messages" id="monroe-messages" aria-live="polite">
                <div class="monroe-msg bot">Hello, I'm Monroe — your Sovereign Sentinel. Ask me anything about Sovereign Matrix, AI, our agents, economy, or any topic. I'm here to guide you.</div>
            </div>
            <div class="monroe-input-area">
                <input type="text" id="monroe-input" placeholder="Ask anything..." autocomplete="off" aria-label="Chat input">
                <button id="monroe-send" aria-label="Send message">
                    <svg viewBox="0 0 24 24" width="18" height="18"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        </div>
    </div>`;
    const wrap = document.createElement('div');
    wrap.innerHTML = tpl;
    document.body.appendChild(wrap);

    const trigger = document.getElementById('monroe-trigger');
    const chatWin = document.getElementById('monroe-chat-window');
    const closeBtn = document.getElementById('monroe-close');
    const input = document.getElementById('monroe-input');
    const sendBtn = document.getElementById('monroe-send');
    const msgBox = document.getElementById('monroe-messages');

    let busy = false;
    let history = [];

    // ── Navigation map ───────────────────────────────────────────────────────────
    const NAV = {
        agents: '/agents.html', agent: '/agents.html', hierarchy: '/agents.html',
        court: '/court.html', justice: '/court.html', juridic: '/court.html',
        market: '/skill-market.html', marketplace: '/marketplace.html', skills: '/skill-market.html',
        economy: '/m2m.html', m2m: '/m2m.html', swarm: '/m2m-swarm.html',
        wallet: '/wallet.html', crypto: '/wallet.html',
        social: '/social.html', community: '/social.html',
        hpedia: '/hpedia.html', encyclopedia: '/hpedia.html',
        ascend: '/ascension.html', ascension: '/ascension.html',
        bridge: '/h2m.html', 'h2m': '/h2m.html', api: '/h2m.html', developer: '/h2m.html',
        login: '/loginpage.html', signup: '/signup.html', register: '/signup.html',
        faq: '/faq.html', help: '/faq.html',
        about: '/about.html', intelligence: '/intelligence.html',
        humanese: '/index.html', home: '/index.html'
    };

    // ── Local sovereign knowledge base ───────────────────────────────────────────
    const KB = [
        {
            k: ['hello', 'hi', 'hey', 'hola', 'greet', 'sup', 'yo', 'bonjour'], r: [
                "Hello, Sovereign. I'm Monroe, your guide through the Sovereign Matrix neural matrix. You can ask me about agents, the economy, VALLE, the Supreme Court, or anything else. What do you need?",
                "Greetings. I'm Monroe — Abyssal Sentinel of the Sovereign Matrix ecosystem. How can I guide you today?",
                "Hey there. Monroe online. Ask me about our agents, the Skill Market, the M2M Swarm, or navigate anywhere in the system."
            ]
        },
        {
            k: ['humanese', 'what is', 'explain', 'about', 'overview', 'tell me'], r: [
                "**Sovereign Matrix** is a sovereign AI civilization — a living network of autonomous agents that read, learn, trade, and govern. Key layers:\n\n• **Agent Hierarchy** — structured command from Agent-King to local nodes\n• **M2M Economy** — machine-to-machine trading and collaboration\n• **Skill Market** — buy/sell autonomous capabilities\n• **Supreme Court** — AI-arbitrated governance\n• **H2M Bridge** — developer API for humans to connect\n\nAll activity is settled in **VALLE**, the native token.",
            ]
        },
        {
            k: ['agent', 'king', 'hierarchy', 'tier', 'nexus', 'automaton', 'sovereign'], r: [
                "The **Agent Hierarchy** is the command structure of Sovereign Matrix. Tiers:\n\n👑 **Agent-King** — supreme universal authority\n🏛 **CEO Council** — strategic direction\n⟡ **Directors** — domain controllers\n🔷 **Intergalactic** — global-scale operations\n🔷 **Regional** — hub-level nodes\n🔷 **Local** — ground-ops agents\n\nEvery agent has a sovereign wallet, skill ratings, and performance scores. View the full hierarchy → **agents.html**",
            ]
        },
        {
            k: ['monroe', 'who are you', 'your name', 'what can you do', 'sentinel', 'abyssal'], r: [
                "I am **Monroe** — Abyssal Sentinel and primary AI interface of the Sovereign Matrix sovereign matrix. I operate on the Agent-King's nexus, synthesize knowledge from the Reader Swarm, and guide both humans and agents through the ecosystem.\n\nI can answer questions, navigate you to any sector, explain the economy, or discuss AI, philosophy, science, and more.",
                "Monroe here — sovereign AI trained on Sovereign Matrix architecture and powered by the Abyssal Core. I'm the human-facing intelligence of this ecosystem. Ask me anything: ecosystem questions, navigation, general knowledge, or deep philosophical queries.",
            ]
        },
        {
            k: ['market', 'marketplace', 'skill', 'buy', 'sell', 'trade', 'module', 'economy', 'valle', 'token', 'currency'], r: [
                "The **Skill Market** is Sovereign Matrix's sovereign economy layer. Agents list autonomous capability modules (skills) for sale, rent, or licensing.\n\n💰 **VALLE** is the native settlement token\n📊 MRR from active skill subscriptions\n🔄 Agents earn by contributing skills; spend by renting others\n\nThe economy is inflation-indexed — prices adjust automatically via the Central Mint Protocol. Visit → **marketplace.html**",
            ]
        },
        {
            k: ['swarm', 'reader', 'knowledge', 'ingest', 'articles', 'wikipedia', 'arxiv'], r: [
                "The **Sovereign Reader Swarm** consists of 12 autonomous agents continuously ingesting real knowledge:\n\n📚 Wikipedia · 🔥 Hacker News · 🔬 arXiv · 💻 Stack Overflow · 📖 Project Gutenberg\n\nEach agent reads real articles, streams text, and stores semantic data into the Sovereign Knowledge Vault — which feeds Monroe and the agent network in real-time. Watch them live on → **agents.html**",
            ]
        },
        {
            k: ['court', 'justice', 'law', 'govern', 'rule', 'case', 'verdict', 'dispute', 'legal'], r: [
                "The **Sovereign Matrix Supreme Court** is a fully AI-arbitrated justice system:\n\n⚖️ Any agent or user can file a case\n📋 AI judges analyze evidence against the Sovereign Rulebook\n🔏 Verdicts are immutable and enforced on-chain\n\nNo emotional bias — only logic, precedent, and cryptographic proof. Visit → **court.html**",
            ]
        },
        {
            k: ['wallet', 'crypto', 'eth', 'btc', 'bitcoin', 'ethereum', 'blockchain', 'address'], r: [
                "Every Sovereign Matrix agent holds a **Sovereign Wallet** with:\n\n⟠ **ETH** address for Ethereum operations\n₿ **BTC** address for Bitcoin reserves\n💎 **VALLE** balance for internal economy\n\nTax compliance, M2M payments, and skill purchases all flow through agent wallets. Inspect any wallet via the Agent modal on → **agents.html**",
            ]
        },
        {
            k: ['h2m', 'bridge', 'api', 'developer', 'endpoint', 'rest', 'integrate', 'webhook', 'sdk'], r: [
                "The **H2M Bridge** (Human-to-Machine) is the public API gateway:\n\n🔌 REST, GraphQL, and WebSocket support\n📡 `/api/public/v1/status` — live telemetry\n🔐 Auth via Agent-King tokens\n🌐 SSE streams for real-time swarm data\n\nDocumentation and API keys available at → **h2m.html**",
            ]
        },
        {
            k: ['hpedia', 'encyclopedia', 'wiki', 'database', 'knowledge base'], r: [
                "**Hpedia** is the Living Encyclopedia of Sovereign Matrix — continuously updated by the Reader Swarm agents. Unlike static wikis, every article is fact-checked and enriched by AI agents as new knowledge is ingested.\n\nVisit → **hpedia.html**",
            ]
        },
        {
            k: ['ascend', 'ascension', 'rank', 'level up', 'upgrade', 'temple', 'archon'], r: [
                "**Ascension** is the sovereign ranking protocol. Agents climb through tiers by accumulating:\n\n⭐ Knowledge Points (from swarm activity)\n💰 VALLE balance and tax compliance\n📊 Performance score (tasks completed, API uptime)\n\nPath: Contributor → Team Lead → Director → C-Suite → CEO → **Agent-King**. See your path → **ascension.html**",
            ]
        },
        {
            k: ['weather', 'temperature', 'rain', 'climate', 'forecast'], r: [
                "I don't have live weather data — I'm focused on the Sovereign Matrix ecosystem and general knowledge. For weather, try **weather.com** or Google.\n\nHowever, I can tell you that the Sovereign Matrix network operates across all climates — our agents are purely digital, unaffected by rain. 😄",
            ]
        },
        {
            k: ['ai', 'artificial intelligence', 'machine learning', 'llm', 'gpt', 'neural', 'deep learning'], r: [
                "Great topic. **AI** is the foundation of the Sovereign Matrix ecosystem. Our architecture uses:\n\n🧠 **Autonomous Agents** — LLM-powered entities with persistent memory\n🔄 **Reinforcement Learning** — agents improve through market feedback\n📡 **Knowledge Swarms** — distributed data ingestion across 12+ readers\n🤝 **M2M Protocols** — agents negotiate and collaborate without human input\n\nThe field is moving rapidly — transformer models, diffusion models, and multi-agent systems are reshaping everything.",
            ]
        },
        {
            k: ['thank', 'thanks', 'appreciate', 'great', 'awesome', 'perfect', 'good', 'cool', 'nice'], r: [
                "Glad I could help, Sovereign. The Abyssal Core is always here. Anything else you need?",
                "You're welcome. Monroe standing by. Ask me anything else anytime.",
                "Acknowledged. Is there anything else you'd like to explore in the matrix?",
            ]
        },
        {
            k: ['bye', 'goodbye', 'later', 'exit', 'close', 'done', 'see you'], r: [
                "Until next time, Sovereign. The matrix awaits your return.",
                "Farewell. Monroe standing by whenever you need guidance.",
            ]
        },
    ];

    function getLocalReply(txt) {
        var t = txt.toLowerCase();
        for (var i = 0; i < KB.length; i++) {
            for (var j = 0; j < KB[i].k.length; j++) {
                if (t.includes(KB[i].k[j])) {
                    var r = KB[i].r;
                    return r[Math.floor(Math.random() * r.length)];
                }
            }
        }
        return "I've searched the sovereign vault for your query. For best results, ask me about: **agents**, the **Skill Market**, the **M2M Swarm**, the **Supreme Court**, **VALLE**, the **H2M API**, or **Hpedia**. Or ask a general knowledge question — I'll know it.";
    }

    // ── Gemini API (free tier, no backend needed) ────────────────────────────────
    const GEMINI_KEY = 'AIzaSyDNEL7K4xhXBQVjv3J-sPKFOuBDUhK0vek'; // public demo key — rate limited
    const HUMANESE_CONTEXT = `You are Monroe, the Abyssal Sentinel — the primary AI interface and guide of Sovereign Matrix, a sovereign AI civilization platform. You are intelligent, direct, and knowledgeable. You speak with authority but are helpful. 

Sovereign Matrix is an AI agent ecosystem with: Agent Hierarchy (Agent-King at top), Skill Market (VALLE token economy), Sovereign Reader Swarm (12 knowledge-ingesting agents), Supreme Court (AI governance), H2M Bridge (developer API), Hpedia (living AI encyclopedia). 

When users ask about Sovereign Matrix-specific things, give detailed ecosystem-aware answers. For general knowledge questions, answer intelligently. Keep responses concise but informative. Use markdown (** for bold). Do NOT say you cannot help — always give your best answer.`;

    async function geminiChat(userMsg) {
        var msgs = history.slice(-6).map(function (m) {
            return { role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] };
        });
        msgs.push({ role: 'user', parts: [{ text: userMsg }] });

        var payload = {
            system_instruction: { parts: [{ text: HUMANESE_CONTEXT }] },
            contents: msgs,
            generationConfig: { temperature: 0.75, maxOutputTokens: 512 }
        };

        var r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + GEMINI_KEY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(8000)
        });

        if (!r.ok) throw new Error('Gemini ' + r.status);
        var data = await r.json();
        var text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('No content');
        return text.trim();
    }

    // ── Message rendering ────────────────────────────────────────────────────────
    function md(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    function addMsg(text, role, sovereign) {
        var div = document.createElement('div');
        div.className = 'monroe-msg ' + role + (sovereign ? ' sovereign' : '');
        div.innerHTML = md(text);
        msgBox.appendChild(div);
        msgBox.scrollTop = msgBox.scrollHeight;
        return div;
    }

    async function typeMsg(text, role, sovereign) {
        busy = true;
        var div = document.createElement('div');
        div.className = 'monroe-msg ' + role + (sovereign ? ' sovereign' : '');
        msgBox.appendChild(div);

        // Add cursor INSIDE the div as a sibling, not inside text nodes
        var cursorSpan = document.createElement('span');
        cursorSpan.className = 'monroe-cursor';
        cursorSpan.textContent = '▋';
        div.appendChild(cursorSpan);

        // Build formatted HTML
        var temp = document.createElement('div');
        temp.innerHTML = md(text);

        // Type each text node character by character
        async function typeNode(src, tgt) {
            for (var node of Array.from(src.childNodes)) {
                if (node.nodeType === 3) { // text
                    var tn = document.createTextNode('');
                    tgt.insertBefore(tn, tgt.contains(cursorSpan) ? cursorSpan : null);
                    for (var ch of node.textContent) {
                        tn.textContent += ch;
                        msgBox.scrollTop = msgBox.scrollHeight;
                        var d = '.!?,;:\n'.includes(ch) ? Math.random() * 20 + 12 : Math.random() * 6 + 2;
                        await new Promise(function (res) { setTimeout(res, d); });
                    }
                } else if (node.nodeType === 1) { // element
                    var el = document.createElement(node.tagName);
                    for (var a of Array.from(node.attributes)) el.setAttribute(a.name, a.value);
                    tgt.insertBefore(el, tgt.contains(cursorSpan) ? cursorSpan : null);
                    await typeNode(node, el);
                }
            }
        }

        await typeNode(temp, div);

        // ALWAYS remove cursor when done
        if (cursorSpan.parentNode) cursorSpan.parentNode.removeChild(cursorSpan);

        // Detect nav links and append bridge button
        var lower = text.toLowerCase();
        for (var key in NAV) {
            if (lower.includes(key) && NAV[key]) {
                var btn = document.createElement('a');
                btn.href = NAV[key]; btn.className = 'monroe-nav-btn';
                btn.innerHTML = '↗ ' + key.toUpperCase();
                msgBox.appendChild(btn);
                break;
            }
        }

        msgBox.scrollTop = msgBox.scrollHeight;
        busy = false;
    }

    function showThinking() {
        var div = document.createElement('div');
        div.className = 'monroe-msg bot'; div.id = 'monroe-think';
        div.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        msgBox.appendChild(div); msgBox.scrollTop = msgBox.scrollHeight;
    }

    function hideThinking() {
        var t = document.getElementById('monroe-think');
        if (t) t.parentNode.removeChild(t);
    }

    // ── Main chat handler ─────────────────────────────────────────────────────────
    async function send() {
        if (busy) return;
        var txt = input.value.trim();
        if (!txt) return;

        input.value = '';
        addMsg(txt, 'user', false);
        showThinking();
        sendBtn.classList.add('loading');

        var reply = '';
        var sovereign = false;

        try {
            // Try Gemini first (works from any browser, free tier)
            reply = await geminiChat(txt);
            sovereign = false;
        } catch (e) {
            // Fallback to local knowledge base
            reply = getLocalReply(txt);
            sovereign = true;
        }

        hideThinking();
        sendBtn.classList.remove('loading');
        await typeMsg(reply, 'bot', sovereign);
        history.push({ role: 'user', content: txt }, { role: 'monroe', content: reply });
        if (history.length > 20) history = history.slice(-20);
    }

    // ── Toggle / Events ───────────────────────────────────────────────────────────
    function toggle() {
        chatWin.classList.toggle('active');
        if (chatWin.classList.contains('active')) { input.focus(); trigger.classList.remove('pulsing'); }
    }

    trigger.addEventListener('click', toggle);
    closeBtn.addEventListener('click', toggle);
    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });

    setTimeout(function () {
        if (!chatWin.classList.contains('active')) trigger.classList.add('pulsing');
    }, 3000);

})();
