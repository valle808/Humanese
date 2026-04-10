"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, Send, Sparkles, Download, FileJson, FileText, ChevronRight, Activity, Terminal, Brain, Radio, Wifi, Zap, Orbit, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const NAV_MAP: Record<string, string> = {
    court: "/court",
    judiciary: "/judiciary",
    social: "/m2m",
    humanese: "/",
    register: "/auth",
    login: "/auth",
    bridge: "/h2m",
    api: "/h2m",
    hpedia: "/hpedia",
    encyclopedia: "/hpedia",
    admin: "/admin",
    wallet: "/wallet",
    help: "/faq",
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

function downloadSession(messages: Message[]) {
    const content = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n\n---\n\n');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Monroe_Session_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
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
                const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
                setTimeout(() => {
                    setMessages([{ text: greeting, role: "bot", emotion: "happy" }]);
                }, 300);
            }
            return !prev;
        });
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
                
                // FLAGSHIP ORANGE HUE (approx 20-30 HSLA)
                const targetHue = 20 + moodRef.current * 20 + pz * 0.5 + noise * 30 * moodRef.current;
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
                                    text: `<span style="color:#ff6b2b">➤ Step ${idx + 1}:</span> ${task.title}`,
                                    role: "bot",
                                },
                            ]);
                        }, (idx + 1) * 800);
                    });
                }
                return;
            }

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

            saveToMemory("user", text, mood);
            saveToMemory("monroe", reply, mood);

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
        <div className="fixed bottom-10 right-10 z-[10000] font-sans selection:bg-[#ff6b2b]/40 selection:text-white">
            {/* ── TRIGGER BUTTON ── */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                aria-label="Toggle Monroe OMNI Assistant"
                className="relative h-20 w-20 bg-black border-2 border-white/10 rounded-full shadow-[0_0_50px_rgba(255,107,43,0.3)] transition-all flex items-center justify-center overflow-hidden group"
            >
                <div className="absolute inset-0 bg-[#ff6b2b]/5 group-hover:bg-[#ff6b2b]/15 transition-all duration-1000" />
                <canvas
                    ref={canvasRef}
                    width="140"
                    height="140"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                />
                <Sparkles 
                    size={32} 
                    className={`text-white transition-opacity duration-500 z-20 ${moodIntensity > 0.4 ? "opacity-0" : "opacity-30 group-hover:opacity-100"}`}
                    strokeWidth={2.5}
                />
            </motion.button>

            {/* ── CHAT WINDOW ── */}
            <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(20px)' }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(20px)' }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="absolute bottom-24 right-0 w-[450px] h-[650px] bg-[#050505] border-2 border-white/10 rounded-[3rem] flex flex-col shadow-[0_80px_150px_rgba(0,0,0,1)] shadow-inner backdrop-blur-3xl overflow-hidden z-50"
                >
                    <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
                    
                    {/* Header */}
                    <div className="relative p-10 flex items-center justify-between border-b-2 border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-6">
                            <div className="relative h-14 w-14 rounded-2xl bg-black border-2 border-[#ff6b2b]/40 flex items-center justify-center shadow-inner">
                                <Brain className="w-8 h-8 text-[#ff6b2b] animate-pulse" strokeWidth={2.5} />
                                <div className={`absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-black transition-colors ${isTyping ? "bg-white animate-pulse" : "bg-[#ff6b2b]"}`} />
                            </div>
                            <div className="space-y-1">
                                <span className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Monroe.</span>
                                <div className="flex items-center gap-3">
                                   <div className={`text-[10px] font-black uppercase tracking-[0.4em] italic leading-none flex items-center gap-3 ${isTyping ? "text-white animate-pulse" : "text-[#ff6b2b]/60"}`}>
                                       {isTyping ? "PROCESSING_NEURAL_BUS" : "Sovereign_Omni_Intel"}
                                   </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => downloadSession(messages)}
                                title="Export Neural Log (MD)"
                                className="text-white/10 hover:text-[#ff6b2b] transition-all p-3 bg-white/5 border border-white/10 rounded-xl hover:scale-110"
                            >
                                <Download className="w-5 h-5" strokeWidth={3} />
                            </button>
                            <button
                                onClick={toggleChat}
                                aria-label="Abort Interaction"
                                className="text-white/10 hover:text-[#ff6b2b] transition-all p-3 bg-white/5 border border-white/10 rounded-xl hover:scale-110"
                            >
                                <X className="w-5 h-5" strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-8 custom-scrollbar relative z-10">
                        {messages.map((msg, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={i}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[90%] px-8 py-5 rounded-[2.5rem] text-lg leading-relaxed shadow-inner ${msg.role === "user"
                                        ? "bg-[#ff6b2b] text-black font-black italic tracking-tight rounded-br-lg"
                                        : `bg-white/[0.03] border-2 border-white/5 text-white/40 italic font-light tracking-tight rounded-bl-lg backdrop-blur-3xl group ${msg.isSovereign ? "border-[#ff6b2b]/40 bg-[#ff6b2b]/5" : ""}`
                                        }`}
                                    dangerouslySetInnerHTML={{
                                        __html: msg.text.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>"),
                                    }}
                                />
                            </motion.div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border-2 border-white/5 rounded-[2.5rem] rounded-bl-lg px-8 py-5">
                                    <div className="flex gap-2 items-center">
                                        <div className="w-2 h-2 bg-[#ff6b2b] rounded-full animate-bounce [animation-delay:0ms]" />
                                        <div className="w-2 h-2 bg-[#ff6b2b] rounded-full animate-bounce [animation-delay:150ms]" />
                                        <div className="w-2 h-2 bg-[#ff6b2b] rounded-full animate-bounce [animation-delay:300ms]" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer / Input */}
                    <div className="relative p-10 border-t-2 border-white/5 space-y-8 bg-white/[0.01]">
                        {/* Quick Prompts */}
                        {messages.length <= 1 && !isTyping && (
                            <div className="flex flex-wrap gap-3 pb-2">
                                {["Tell me a joke 😂", "System Status", "Research OMEGA", "Identity Hash"].map((chip) => (
                                    <button
                                        key={chip}
                                        onClick={() => {
                                            setInputValue(chip);
                                            setTimeout(() => handleSend(), 50);
                                        }}
                                        className="text-[10px] px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-white/20 hover:text-white hover:border-[#ff6b2b] hover:bg-[#ff6b2b]/10 transition-all font-black uppercase tracking-[0.4em] italic active:scale-95 leading-none"
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <div className="flex-1 relative group">
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
                                    className="w-full bg-black border-2 border-white/5 rounded-[2rem] px-8 py-5 text-xl text-white outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all placeholder:text-white/5 disabled:opacity-50 italic font-light shadow-inner"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/5 group-focus-within:text-[#ff6b2b] transition-all">
                                   <Terminal size={18} strokeWidth={3} />
                                </div>
                            </div>
                            <Button
                                onClick={handleSend}
                                disabled={isTyping || !inputValue.trim()}
                                className="h-[68px] w-[68px] bg-[#ff6b2b] hover:bg-[#ff6b2b]/80 text-black rounded-full shadow-[0_20px_40px_rgba(255,107,43,0.3)] transition-all hover:scale-105 active:scale-95"
                                aria-label="Send Directive"
                            >
                                <Send className="w-6 h-6" strokeWidth={3} />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
            `}</style>
        </div>
    );
}
