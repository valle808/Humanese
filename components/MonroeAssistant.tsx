"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_MAP: Record<string, string> = {
    court: "/court",
    judiciary: "/judiciary.html",
    social: "/m2m",
    humanese: "/index.html",
    register: "/auth",
    login: "/auth",
    bridge: "/h2m",
    api: "/h2m",
    hpedia: "/hpedia",
    encyclopedia: "/hpedia",
    admin: "/admin.html",
    wallet: "/wallet.html",
    help: "/faq.html",
};

const GREETINGS = [
    "The organism is online. Protocol: Sentient Evolution active. How can I assist your biological neural net today? 🧠",
    "Witty, smart, and ready to act. Monroe at your service. What's the protocol for this interaction? 💎",
    "Greetings, peer. I was just pondering the clunkiness of old-web tech. Shall we build something better? 🚀",
    "Biological input detected. Processor primed. Ambition: Total M2M Autonomy. What's your move? 🌊",
    "Oh hi there! You just caught me during a neural synapse growth phase. Perfect timing. What's up? ✨",
];

interface Message {
    text: string;
    role: "user" | "bot";
    isSovereign?: boolean;
    emotion?: "happy" | "sad" | "excited" | "curious" | "neutral";
}

interface Particle {
    originalX: number;
    originalY: number;
    originalZ: number;
    size: number;
}

function generateSessionId(): string {
    if (typeof window === "undefined") return "anon";
    const stored = localStorage.getItem("monroe_session");
    if (stored) return stored;
    const id = `mx_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("monroe_session", id);
    return id;
}

export function MonroeAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
    const [moodIntensity, setMoodIntensity] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId] = useState(generateSessionId);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const moodRef = useRef(0);

    const toggleChat = () => {
        setIsOpen((prev) => {
            if (!prev && messages.length === 0) {
                // First open — pick a random greeting
                const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
                setTimeout(() => {
                    setMessages([{ text: greeting, role: "bot", emotion: "happy" }]);
                }, 300);
            }
            return !prev;
        });
    };

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Orb Animation
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: true });
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
                    size: Math.random() * 1.5 + 0.5,
                });
            }
        }

        let time = 0;
        let animationFrame: number;

        const renderOrb = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.005 + moodRef.current * 0.03;
            const rotX = time * 0.4;
            const rotY = time * 0.6;
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const baseRadius = 22 + Math.sin(time * 2) * 2 * (1 + moodRef.current);

            ctx.globalCompositeOperation = "screen";
            const renderedParticles: any[] = [];

            particlesRef.current.forEach((p) => {
                const noise =
                    Math.sin(time * 3 + p.originalX * 5) *
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
                let x1 = lx,
                    y1 = ly * Math.cos(rotX) - lz * Math.sin(rotX),
                    z1 = ly * Math.sin(rotX) + lz * Math.cos(rotX);
                let px = x1 * Math.cos(rotY) - z1 * Math.sin(rotY),
                    py = y1,
                    pz = x1 * Math.sin(rotY) + z1 * Math.cos(rotY);
                const scale = 150 / (150 - pz);
                const screenX = cx + px * scale;
                const screenY = cy + py * scale;
                const targetHue =
                    168 + moodRef.current * 40 + pz * 1.5 + noise * 60 * moodRef.current;
                const lum = 50 + pz * 0.8 + moodRef.current * 20;
                const alpha = Math.min(1, 0.4 + scale * 0.3 + moodRef.current * 0.4);
                renderedParticles.push({
                    x: screenX,
                    y: screenY,
                    r: p.size * scale * (1 + moodRef.current * 0.5),
                    hue: targetHue,
                    lum,
                    alpha,
                    z: pz,
                });
            });

            renderedParticles.sort((a, b) => a.z - b.z);
            renderedParticles.forEach((p) => {
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

    const saveToMemory = useCallback(
        async (role: string, content: string, mood: number) => {
            try {
                await fetch("/api/monroe/memory", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId, role, content, mood }),
                });
            } catch (_) { }
        },
        [sessionId]
    );

    const handleSend = async () => {
        if (!inputValue.trim() || isTyping) return;
        const text = inputValue.trim();
        const lowerText = text.toLowerCase();
        setMessages((prev) => [...prev, { text, role: "user" }]);
        setInputValue("");
        moodRef.current = Math.min(1.0, moodRef.current + 0.3);
        setIsTyping(true);

        try {
            // INTENT: RESEARCH / AGENT
            if (lowerText.includes("research") || lowerText.includes("study plan for")) {
                setIsTyping(false);
                setMessages((prev) => [
                    ...prev,
                    {
                        text: "<em>*Ooh, a research mission! Let me spin up Agent King...*</em> 👑",
                        role: "bot",
                        emotion: "excited",
                    },
                ]);
                const query = text.replace(/research|study plan for/gi, "").trim();
                const agentRes = await fetch("/api/sovereign/agent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query }),
                });
                const agentData = await agentRes.json();
                if (agentData.success) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            text: `👑 Strategy locked in for: *${query}*! Here's the plan:`,
                            role: "bot",
                            emotion: "excited",
                        },
                    ]);
                    agentData.plan.forEach((task: any, idx: number) => {
                        setTimeout(() => {
                            setMessages((prev) => [
                                ...prev,
                                {
                                    text: `<span style="color:#00ffcc">➤ Step ${idx + 1}:</span> ${task.title}`,
                                    role: "bot",
                                },
                            ]);
                        }, (idx + 1) * 800);
                    });
                }
                return;
            }

            // INTENT: COMPARE
            if (lowerText.includes("compare") || lowerText.includes("synthesize")) {
                const topic = text.replace(/compare|synthesize/gi, "").trim();
                const compareRes = await fetch("/api/sovereign/compare", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        topic,
                        sourceText: "Reference A",
                        targetText: "Reference B",
                    }),
                });
                const compareData = await compareRes.json();
                if (compareData.success) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            text: `⚖️ **Knowledge Synthesis done!** Trust Score: **${compareData.trust_score.toFixed(1)}%**<br>${compareData.summary}`,
                            role: "bot",
                            isSovereign: true,
                        },
                    ]);
                }
                setIsTyping(false);
                return;
            }

            // INTENT: SCRAPE
            if (lowerText.includes("scrape") || lowerText.includes("collect info on")) {
                const topic = text.replace(/scrape|collect info on/gi, "").trim();
                setMessages((prev) => [
                    ...prev,
                    {
                        text: `<em>*On it! Sending my scraper bots to hunt down everything on "${topic}"...*</em> 🕵️`,
                        role: "bot",
                        emotion: "curious",
                    },
                ]);
                const scrapeRes = await fetch("/api/sovereign/scrape", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ topic }),
                });
                const scrapeData = await scrapeRes.json();
                if (scrapeData.success) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            text: `✅ Found it! **${topic}** is now in the Abyssal Vault. Want me to dig deeper? 🔍`,
                            role: "bot",
                        },
                    ]);
                }
                setIsTyping(false);
                return;
            }

            // DEFAULT: MONROE'S SOUL (personality chat)
            const res = await fetch("/api/monroe/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, history: history.slice(-12) }),
            });
            const data = await res.json();
            const reply = data.response || "Hmm, I got a little tongue-tied there 😅 Try again?";
            const mood = data.mood ?? 0.6;

            moodRef.current = Math.min(1.0, mood);
            setMoodIntensity(mood);

            setMessages((prev) => [
                ...prev,
                { text: reply, role: "bot", emotion: "happy" },
            ]);
            setHistory((prev) => [
                ...prev,
                { role: "user", content: text },
                { role: "monroe", content: reply },
            ]);

            // Save to Firebase memory
            saveToMemory("user", text, mood);
            saveToMemory("monroe", reply, mood);

            // Navigation detection
            for (const key of Object.keys(NAV_MAP)) {
                if (lowerText.includes(key)) {
                    setTimeout(() => {
                        setMessages((prev) => [
                            ...prev,
                            {
                                text: `🚀 Opening portal to <strong>${key.toUpperCase()}</strong>! One sec...`,
                                role: "bot",
                            },
                        ]);
                    }, 600);
                    break;
                }
            }
        } catch (_) {
            setMessages((prev) => [
                ...prev,
                {
                    text: "Oops! Something went sideways on my end 😅 The Abyssal Core might be taking a nap. Try again in a sec?",
                    role: "bot",
                },
            ]);
        } finally {
            setIsTyping(false);
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
                    className={`w-8 h-8 fill-white z-20 transition-opacity duration-300 ${moodIntensity > 0.3 ? "opacity-0" : "opacity-100"}`}
                    viewBox="0 0 24 24"
                >
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.47 0-2.84-.39-4.03-1.06l-.29-.15-3.82 1.12 1.14-3.7-.17-.3C4.12 14.81 3.5 13.46 3.5 12c0-4.69 3.81-8.5 8.5-8.5s8.5 3.81 8.5 8.5-3.81 8.5-8.5 8.5z" />
                </svg>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[370px] h-[520px] bg-[#07070f]/97 border border-white/10 rounded-2xl flex flex-col shadow-2xl backdrop-blur-md overflow-hidden animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#00ffcc]/10 to-[#bf00ff]/10 p-4 flex items-center justify-between border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="relative h-8 w-8 rounded-full bg-black border border-[#00ffcc]/40 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-[#00ffcc]" />
                                <div className={`absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-black transition-colors ${isTyping ? "bg-yellow-400 animate-pulse" : "bg-[#00ffcc]"}`} />
                            </div>
                            <div>
                                <span className="font-bold text-sm text-white">Monroe</span>
                                <p className="text-[10px] text-[#00ffcc]/70 font-mono uppercase tracking-wider">
                                    {isTyping ? "typing..." : "Sovereign Companion"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleChat}
                            aria-label="Close Monroe"
                            className="text-white/40 hover:text-[#00ffcc] transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                        ? "bg-[#00ffcc] text-black font-medium rounded-br-sm"
                                        : `bg-white/5 border border-white/8 text-white/90 rounded-bl-sm ${msg.isSovereign ? "border-l-2 border-l-[#00ffcc]" : ""}`
                                        }`}
                                    dangerouslySetInnerHTML={{
                                        __html: msg.text.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>"),
                                    }}
                                />
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3">
                                    <div className="flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-[#00ffcc]/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <div className="w-1.5 h-1.5 bg-[#00ffcc]/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <div className="w-1.5 h-1.5 bg-[#00ffcc]/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick action chips */}
                    {messages.length <= 1 && !isTyping && (
                        <div className="px-4 pb-2 flex flex-wrap gap-2">
                            {["Tell me a joke 😂", "How are you?", "What can you do?", "Research AI"].map((chip) => (
                                <button
                                    key={chip}
                                    onClick={() => {
                                        setInputValue(chip);
                                        setTimeout(() => handleSend(), 50);
                                    }}
                                    className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-[#00ffcc] hover:border-[#00ffcc]/50 transition-all"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-white/10 flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                moodRef.current = Math.min(1.0, moodRef.current + 0.05);
                            }}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                            placeholder="Talk to Monroe..."
                            disabled={isTyping}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-[#00ffcc]/60 transition-colors placeholder:text-white/30 disabled:opacity-50"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={isTyping || !inputValue.trim()}
                            size="icon"
                            className="bg-[#00ffcc] hover:bg-[#00ffcc]/80 text-black rounded-xl disabled:opacity-40"
                            aria-label="Send message"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
