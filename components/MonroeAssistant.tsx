"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_MAP: Record<string, string> = {
    "court": "/court",
    "judiciary": "/judiciary.html",
    "social": "/m2m",
    "humanese": "/index.html",
    "register": "/auth",
    "login": "/auth",
    "bridge": "/h2m",
    "api": "/h2m",
    "h2m": "/h2m",
    "agents": "/agents.html",
    "intelligence": "/intelligence.html",
    "swarm": "/m2m-swarm.html",
    "market": "/marketplace.html",
    "marketplace": "/marketplace.html",
    "economy": "/m2m",
    "about": "/about.html",
    "hpedia": "/hpedia.html",
    "encyclopedia": "/hpedia.html",
    "admin": "/admin.html",
    "wallet": "/wallet.html",
    "crypto": "/wallet.html",
    "help": "/faq.html",
    "faq": "/faq.html"
};

interface Message {
    text: string;
    role: 'user' | 'bot';
    isSovereign?: boolean;
}

interface Particle {
    originalX: number;
    originalY: number;
    originalZ: number;
    size: number;
}

export function MonroeAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hello! I am Monroe. How can I guide you through the Humanese ecosystem today?", role: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
    const [moodIntensity, setMoodIntensity] = useState(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const moodRef = useRef(0);

    const toggleChat = () => setIsOpen(prev => !prev);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Orb Animation Logic
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const numParticles = 350;
        const phi = Math.PI * (3 - Math.sqrt(5));

        if (particlesRef.current.length === 0) {
            for (let i = 0; i < numParticles; i++) {
                const y = 1 - (i / (numParticles - 1)) * 2;
                const radiusAtY = Math.sqrt(1 - y * y);
                const theta = phi * i;
                particlesRef.current.push({
                    originalX: Math.cos(theta) * radiusAtY,
                    originalY: y,
                    originalZ: Math.sin(theta) * radiusAtY,
                    size: Math.random() * 1.5 + 0.5
                });
            }
        }

        let time = 0;
        let animationFrame: number;

        const renderOrb = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.005 + (moodRef.current * 0.03);

            const rotX = time * 0.4;
            const rotY = time * 0.6;
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const baseRadius = 22 + Math.sin(time * 2) * 2 * (1 + moodRef.current);

            ctx.globalCompositeOperation = 'screen';
            let renderedParticles: any[] = [];

            particlesRef.current.forEach((p) => {
                const noise = Math.sin(time * 3 + p.originalX * 5) *
                    Math.cos(time * 2 + p.originalY * 4) *
                    Math.sin(time * 4 + p.originalZ * 3);

                const displacement = noise * moodRef.current * 0.8;

                let lx = p.originalX * (1 + displacement);
                let ly = p.originalY * (1 + displacement);
                let lz = p.originalZ * (1 + displacement);

                const len = Math.sqrt(lx * lx + ly * ly + lz * lz);
                lx = (lx / len) * baseRadius;
                ly = (ly / len) * baseRadius;
                lz = (lz / len) * baseRadius;

                let x1 = lx, y1 = ly * Math.cos(rotX) - lz * Math.sin(rotX), z1 = ly * Math.sin(rotX) + lz * Math.cos(rotX);
                let px = x1 * Math.cos(rotY) - z1 * Math.sin(rotY), py = y1, pz = x1 * Math.sin(rotY) + z1 * Math.cos(rotY);

                const scale = 150 / (150 - pz);
                const screenX = cx + px * scale;
                const screenY = cy + py * scale;

                const targetHue = 168 + (moodRef.current * 40) + (pz * 1.5) + (noise * 60 * moodRef.current);
                const lum = 50 + (pz * 0.8) + (moodRef.current * 20);
                const alpha = Math.min(1, 0.4 + (scale * 0.3) + (moodRef.current * 0.4));

                renderedParticles.push({
                    x: screenX, y: screenY,
                    r: p.size * scale * (1 + moodRef.current * 0.5),
                    hue: targetHue, lum: lum, alpha: alpha, z: pz
                });
            });

            renderedParticles.sort((a, b) => a.z - b.z);

            renderedParticles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, ${p.lum}%, ${p.alpha})`;
                ctx.fill();
            });

            animationFrame = requestAnimationFrame(renderOrb);
        };

        renderOrb();
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    // Mood Decay
    useEffect(() => {
        const interval = setInterval(() => {
            if (moodRef.current > 0) {
                moodRef.current = Math.max(0, moodRef.current - 0.05);
                setMoodIntensity(moodRef.current);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        const text = inputValue.trim();
        const lowerText = text.toLowerCase();
        setMessages(prev => [...prev, { text, role: 'user' }]);
        setInputValue("");
        moodRef.current = Math.min(1.0, moodRef.current + 0.3);

        try {
            // INTENT: RESEARCH (Agent King)
            if (lowerText.includes("research") || lowerText.includes("study plan for")) {
                setMessages(prev => [...prev, { text: "<em>*Activating Agent King... Formulating Sovereign Strategy*</em>", role: 'bot' }]);
                const query = text.replace(/research|study plan for/gi, "").trim();

                const agentRes = await fetch('/api/sovereign/agent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });
                const agentData = await agentRes.json();

                if (agentData.success) {
                    setMessages(prev => [...prev, { text: `👑 **Agent King initialized.** Strategy mapped for: *${query}*`, role: 'bot' }]);
                    agentData.plan.forEach((task: any, idx: number) => {
                        setTimeout(() => {
                            setMessages(prev => [...prev, { text: `<span style="color: #00ffcc">➤ TASK ${idx + 1}:</span> ${task.title} [PENDING]`, role: 'bot' }]);
                        }, (idx + 1) * 800);
                    });
                }
                return;
            }

            // INTENT: COMPARE (Synthesis)
            if (lowerText.includes("compare") || lowerText.includes("synthesize")) {
                setMessages(prev => [...prev, { text: "<em>*Analyzing Discrepancies... Synthesizing Knowledge Shards*</em>", role: 'bot' }]);
                const topic = text.replace(/compare|synthesize/gi, "").trim();

                const compareRes = await fetch('/api/sovereign/compare', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic, sourceText: "Wiki Data", targetText: "Grokipedia Data" }) // Simulated
                });
                const compareData = await compareRes.json();

                if (compareData.success) {
                    setMessages(prev => [...prev, { text: `⚖️ **Synthesis Complete.** Trust Score: **${compareData.trust_score.toFixed(1)}%**<br>${compareData.summary}`, role: 'bot', isSovereign: true }]);
                }
                return;
            }

            // INTENT: SCRAPE (Tool Sentinel)
            if (lowerText.includes("scrape") || lowerText.includes("collect info on")) {
                setMessages(prev => [...prev, { text: "<em>*Accessing Tool Sentinel... Initializing Autonomous Scraper*</em>", role: 'bot' }]);
                const topic = text.replace(/scrape|collect info on/gi, "").trim();

                const scrapeRes = await fetch('/api/sovereign/scrape', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic })
                });
                const scrapeData = await scrapeRes.json();

                if (scrapeData.success) {
                    setMessages(prev => [...prev, { text: `✅ Knowledge Transmutated: **${topic}** has been stored in the Abyssal Vault.`, role: 'bot' }]);

                    // Automatically trigger DKG publication
                    setMessages(prev => [...prev, { text: "<em>*Sovereign Verification: Publishing to Decentralized Knowledge Graph...*</em>", role: 'bot' }]);
                    const dkgRes = await fetch('/api/sovereign/dkg', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ topic, summary: `Transmutated intelligence on ${topic}` })
                    });
                    const dkgData = await dkgRes.json();
                    if (dkgData.success) {
                        setMessages(prev => [...prev, { text: `🛡️ Verified: Asset UAL detected - ${dkgData.ual}`, role: 'bot', isSovereign: true }]);
                    }
                }
                return;
            }

            // DEFAULT: SMART CHAT (Study Buddy)
            const res = await fetch('/api/learn/buddy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: history })
            });
            const data = await res.json();
            const reply = data.response || "The Sovereign Core is currently recalibrating...";

            setMessages(prev => [...prev, { text: reply, role: 'bot', isSovereign: lowerText.includes("sovereign") }]);
            setHistory(prev => [...prev, { role: 'user', content: text }, { role: 'monroe', content: reply }]);

            // Navigation detection
            for (const key of Object.keys(NAV_MAP)) {
                if (lowerText.includes(key)) {
                    setMessages(prev => [...prev, {
                        text: `BRIDGE DETECTED: Opening portal to ${key.toUpperCase()}`,
                        role: 'bot'
                    }]);
                    break;
                }
            }
        } catch (e) {
            setMessages(prev => [...prev, { text: "The Abyssal Core is offline. Please try again later.", role: 'bot' }]);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-[9999] font-sans">
            {/* Trigger Button */}
            <button
                onClick={toggleChat}
                aria-label="Toggle Sovereign Assistant"
                className="group relative h-16 w-16 overflow-hidden rounded-full bg-black shadow-[0_0_20px_rgba(0,255,204,0.3)] transition-all hover:scale-110 active:scale-95"
            >
                <canvas
                    ref={canvasRef}
                    width="120"
                    height="120"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                />
                <svg
                    className={`w-8 h-8 fill-white z-20 transition-opacity duration-300 ${moodIntensity > 0.3 ? 'opacity-0' : 'opacity-100'}`}
                    viewBox="0 0 24 24"
                >
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.47 0-2.84-.39-4.03-1.06l-.29-.15-3.82 1.12 1.14-3.7-.17-.3C4.12 14.81 3.5 13.46 3.5 12c0-4.69 3.81-8.5 8.5-8.5s8.5 3.81 8.5 8.5-3.81 8.5-8.5 8.5z" />
                </svg>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-[#0a0a0a]/95 border border-white/10 rounded-xl flex flex-col shadow-2xl backdrop-blur-md overflow-hidden animate-in slide-in-from-bottom-5">
                    <div className="bg-white/5 p-4 flex items-center justify-between border-b border-white/10">
                        <span className="font-bold text-xs tracking-widest text-[#00ffcc] uppercase">Monroe: Abyssal Sentinel</span>
                        <button
                            onClick={toggleChat}
                            aria-label="Close Assistant"
                            className="text-[#bf00ff] hover:text-[#00ffcc] transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`max-w-[80%] p-2 px-3 rounded-lg text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'self-end bg-[#00ffcc] text-black font-medium'
                                    : `self-start ${msg.isSovereign ? 'border-l-4 border-[#00ffcc] bg-[#00ffcc]/5' : ''} text-white/90`
                                    }`}
                                dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br>') }}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-white/10 flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                moodRef.current = Math.min(1.0, moodRef.current + 0.1);
                            }}
                            onKeyPress={(e: any) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask the Abyssal Core..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm outline-none focus:border-[#00ffcc] transition-colors"
                        />
                        <Button onClick={handleSend} size="icon" className="bg-[#00ffcc] hover:bg-[#00ffcc]/80 text-black" aria-label="Send message">
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
