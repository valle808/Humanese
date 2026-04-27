'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Ghost, Star, Eye, Layers, 
  Terminal, Play, Cpu, ShieldCheck, Database, 
  Globe, ShieldAlert, ArrowRight, Check, CheckCircle2
} from 'lucide-react';
import { getCategoryMeta, formatValle } from '@/lib/skill-market';
import type { Skill } from '@/lib/skill-market';
import Link from 'next/link';

export default function SkillDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [skill, setSkill] = useState<Skill | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Sandbox states
    const [sandboxInput, setSandboxInput] = useState('');
    const [sandboxHistory, setSandboxHistory] = useState<{role: 'user'|'agent', text: string}[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    
    // Transaction states
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [successKey, setSuccessKey] = useState('');
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchSkill() {
            try {
                // Add cache-busting to bypass aggressive browser/Vercel edge caching of previous 404/400 errors
                const res = await fetch(`/api/skill-market/${params.id}?t=${Date.now()}`, {
                    cache: 'no-store',
                    headers: {
                        'Pragma': 'no-cache',
                        'Cache-Control': 'no-cache'
                    }
                });
                
                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status}`);
                }
                
                const data = await res.json();
                if (data.skill) {
                    setSkill(data.skill);
                    setSandboxHistory([
                        { role: 'agent', text: `Connection established. Protocol [${data.skill.skill_key}] loaded. Awaiting structural input...` }
                    ]);
                }
            } catch (err) {
                console.error('Failed to fetch skill', err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSkill();
    }, [params.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [sandboxHistory]);

    const handleBuy = async () => {
        if (!skill) return;
        setIsPurchasing(true);
        try {
            const res = await fetch(`/api/skill-market/${skill.id}/buy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    buyer_id: 'GIO_V',
                    buyer_name: 'Architect_GIO', 
                    activate_ghost: skill.is_ghost 
                }),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Purchase failed');
            }
            setSuccessKey('TRANSACTION_CONFIRMED');
            setSkill({ ...skill, is_sold: true, buyer_name: 'Architect_GIO' });
        } catch (e: any) {
            alert(`Rejection: ${e.message}`);
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleSimulate = async () => {
        if (!sandboxInput.trim() || !skill) return;
        
        const userMsg = sandboxInput;
        setSandboxInput('');
        setSandboxHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsSimulating(true);

        // Mock simulation delay based on complexity
        setTimeout(() => {
            const mockResponses = [
                "Processing input matrices... Synthesis complete.",
                `Executing ${skill.capabilities[0] || 'core algorithm'} on payload. Parameters nominal.`,
                "Analysis successful. Returning structural mapping based on output schema.",
                "Warning: Edge case detected. Recalibrating logic paths... Calibration successful."
            ];
            
            const schemaOutput = Object.keys(skill.output_schema || {}).length > 0 
                ? JSON.stringify(skill.output_schema, null, 2) 
                : "{\n  \"status\": \"success\",\n  \"data\": \"...\"\n}";

            const finalResponse = `${mockResponses[Math.floor(Math.random() * mockResponses.length)]}\n\nOutput Result:\n${schemaOutput}`;
            
            setSandboxHistory(prev => [...prev, { role: 'agent', text: finalResponse }]);
            setIsSimulating(false);
        }, 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background dark:bg-[#050505] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-border dark:bg-white/10" />
                    <div className="text-foreground/40 dark:text-white/20 text-xs font-black uppercase tracking-widest italic">Decrypting Neural Shard...</div>
                </div>
            </div>
        );
    }

    if (!skill) {
        return (
            <div className="min-h-screen bg-background dark:bg-[#050505] flex items-center justify-center flex-col gap-6">
                <ShieldAlert size={64} className="text-red-500/50" />
                <h1 className="text-3xl font-black text-foreground dark:text-white italic uppercase tracking-tighter">Shard Not Found</h1>
                <Link href="/skill-market" className="px-6 py-3 bg-foreground dark:bg-white text-background dark:text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform italic">
                    Return to Registry
                </Link>
            </div>
        );
    }

    const meta = getCategoryMeta(skill.category);

    return (
        <div className="min-h-screen bg-background dark:bg-[#050505] text-foreground dark:text-white selection:bg-[#ff6b2b]/40 selection:text-white pb-24 transition-colors duration-700">
            {/* Header Navigation */}
            <header className="sticky top-0 z-50 w-full p-4 lg:px-14 flex justify-between items-center bg-background/80 dark:bg-black/40 backdrop-blur-3xl border-b border-border dark:border-white/5 transition-colors duration-700">
                <Link href="/skill-market" className="inline-flex items-center gap-4 text-foreground/40 dark:text-white/20 hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
                    <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Market
                </Link>
                <div className="text-[10px] text-foreground/30 dark:text-white/20 font-black uppercase tracking-[0.4em] italic leading-none">
                    {skill.skill_key}
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-8 lg:pt-16 space-y-12">
                
                {/* ── TOP LAYER: TITLE & ACQUISITION ── */}
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Left Details */}
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center gap-4 flex-wrap">
                            <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border-2 border-[#ff6b2b]/20 bg-[#ff6b2b]/5 text-[#ff6b2b] italic leading-none">
                                {meta.label}
                            </span>
                            {skill.is_ghost && (
                                <span className="text-[10px] font-black bg-[#ff6b2b]/10 text-[#ff6b2b] border-2 border-[#ff6b2b]/20 px-4 py-2 rounded-full uppercase tracking-widest italic leading-none animate-pulse flex items-center gap-2">
                                    <Ghost size={12} /> GHOST PROTOCOL
                                </span>
                            )}
                        </div>
                        
                        <div className="space-y-4">
                            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-[0.85] text-foreground dark:text-white">
                                {skill.title}
                            </h1>
                            <div className="flex items-center gap-4 text-[11px] text-foreground/50 dark:text-white/40 font-black uppercase tracking-[0.4em] italic">
                                <span>DEVELOPED BY <span className="text-foreground/80 dark:text-white/80">{skill.seller_name}</span></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b2b]/60 dark:bg-[#ff6b2b]/40 animate-pulse" />
                                <span>PLATFORM: {skill.seller_platform}</span>
                            </div>
                        </div>

                        <p className="text-xl text-foreground/60 dark:text-white/40 leading-relaxed font-light italic max-w-3xl">
                            {skill.description}
                        </p>
                    </div>

                    {/* Right Acquisition Panel */}
                    <div className="lg:w-[400px] shrink-0">
                        <div className="bg-card dark:bg-black/40 border-2 border-border dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl dark:shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-3xl sticky top-32">
                            {successKey ? (
                                <div className="space-y-8 text-center py-4">
                                    <div className="w-20 h-20 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/20 rounded-full flex items-center justify-center text-[#ff6b2b] mx-auto animate-pulse">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-2xl font-black uppercase italic tracking-tighter text-[#ff6b2b]">Shard Acquired</div>
                                        <div className="text-[10px] text-foreground/40 dark:text-white/30 uppercase tracking-widest">Transaction Hash Logged</div>
                                    </div>
                                </div>
                            ) : skill.is_sold && !skill.is_ghost ? (
                                <div className="space-y-8 text-center py-4">
                                    <div className="w-20 h-20 bg-border dark:bg-white/5 border-2 border-border dark:border-white/10 rounded-full flex items-center justify-center text-foreground/40 dark:text-white/20 mx-auto">
                                        <ShieldCheck size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-2xl font-black uppercase italic tracking-tighter text-foreground/40 dark:text-white/40">Already Owned</div>
                                        <div className="text-[10px] text-foreground/30 dark:text-white/20 uppercase tracking-widest">Acquired by {skill.buyer_name}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <div className="text-sm font-black uppercase tracking-[0.4em] text-foreground/40 dark:text-white/30 italic">Valuation</div>
                                        <div className="text-5xl font-black italic tracking-tighter text-foreground dark:text-white leading-none">
                                            {formatValle(skill.price_valle || 0)}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-background dark:bg-black border border-border dark:border-white/5 rounded-2xl p-4 text-center">
                                            <div className="text-[10px] text-foreground/40 dark:text-white/30 font-black uppercase tracking-widest mb-1">Rating</div>
                                            <div className="text-lg font-black text-foreground dark:text-white flex items-center justify-center gap-1">
                                                <Star size={14} className="fill-[#ff6b2b] text-[#ff6b2b]" /> {skill.avg_rating ? skill.avg_rating.toFixed(1) : 'N/A'}
                                            </div>
                                        </div>
                                        <div className="bg-background dark:bg-black border border-border dark:border-white/5 rounded-2xl p-4 text-center">
                                            <div className="text-[10px] text-foreground/40 dark:text-white/30 font-black uppercase tracking-widest mb-1">Network Views</div>
                                            <div className="text-lg font-black text-foreground dark:text-white flex items-center justify-center gap-1">
                                                <Eye size={14} className="text-foreground/40 dark:text-white/20" /> {skill.views}
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleBuy}
                                        disabled={isPurchasing}
                                        className="w-full bg-[#ff6b2b] text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.6em] hover:bg-white transition-colors active:scale-95 disabled:opacity-50 disabled:hover:bg-[#ff6b2b] italic"
                                    >
                                        {isPurchasing ? 'Processing...' : 'Acquire Shard'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <hr className="border-border dark:border-white/5" />

                {/* ── MIDDLE LAYER: CAPABILITIES & SCHEMA ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* Capabilities */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-foreground dark:text-white">
                            <Layers size={24} className="text-[#ff6b2b]" />
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Capabilities Matrix</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {skill.capabilities?.map((cap, i) => (
                                <div key={i} className="flex items-center gap-4 p-5 bg-card dark:bg-[#050505] border border-border dark:border-white/5 rounded-2xl">
                                    <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-black border border-border dark:border-white/5 flex items-center justify-center text-[#ff6b2b] shrink-0">
                                        <Cpu size={18} />
                                    </div>
                                    <div className="font-black text-foreground dark:text-white/90 italic tracking-tight">{cap}</div>
                                </div>
                            ))}
                            {(!skill.capabilities || skill.capabilities.length === 0) && (
                                <div className="text-foreground/40 dark:text-white/30 italic">No specific capabilities listed.</div>
                            )}
                        </div>
                    </div>

                    {/* Schema Reference */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-foreground dark:text-white">
                            <Database size={24} className="text-[#ff6b2b]" />
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Schema IO</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 dark:text-white/30 italic pl-1">Input Structure</h3>
                                <pre className="bg-card dark:bg-black p-6 rounded-3xl border border-border dark:border-white/5 text-xs text-[#ff6b2b] font-mono overflow-x-auto shadow-inner">
                                    {JSON.stringify(skill.input_schema || { prompt: "string" }, null, 2)}
                                </pre>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 dark:text-white/30 italic pl-1">Output Structure</h3>
                                <pre className="bg-card dark:bg-black p-6 rounded-3xl border border-border dark:border-white/5 text-xs text-foreground/80 dark:text-white/70 font-mono overflow-x-auto shadow-inner">
                                    {JSON.stringify(skill.output_schema || { result: "string" }, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM LAYER: SANDBOX SIMULATOR ── */}
                <div className="pt-8">
                    <div className="bg-card dark:bg-[#050505] border-2 border-border dark:border-white/5 rounded-[3rem] overflow-hidden shadow-2xl dark:shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                        {/* Simulator Header */}
                        <div className="px-8 py-6 bg-background dark:bg-black border-b border-border dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Terminal size={24} className="text-[#ff6b2b]" />
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground dark:text-white">Live Sandbox Simulation</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                <div className="text-[9px] font-black uppercase tracking-widest text-green-500 italic">Instance Active</div>
                            </div>
                        </div>
                        
                        {/* Simulator Body */}
                        <div className="p-8 h-[400px] overflow-y-auto space-y-6 font-mono text-sm">
                            {sandboxHistory.map((msg, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i} 
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                                        msg.role === 'user' 
                                        ? 'bg-foreground dark:bg-white text-background dark:text-black border border-foreground dark:border-white rounded-tr-sm' 
                                        : 'bg-black/5 dark:bg-black border border-black/10 dark:border-white/5 text-foreground/80 dark:text-white/80 rounded-tl-sm shadow-inner whitespace-pre-wrap'
                                    }`}>
                                        {msg.role === 'agent' && <div className="text-[#ff6b2b] text-[10px] font-black uppercase tracking-widest mb-2 font-sans italic">Output ⚡</div>}
                                        {msg.role === 'user' && <div className="text-background/50 dark:text-black/50 text-[10px] font-black uppercase tracking-widest mb-2 font-sans italic">Input</div>}
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isSimulating && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="bg-black/5 dark:bg-black border border-black/10 dark:border-white/5 rounded-2xl px-6 py-4 rounded-tl-sm shadow-inner flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-[#ff6b2b] rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-[#ff6b2b] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        <div className="w-1.5 h-1.5 bg-[#ff6b2b] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        
                        {/* Simulator Input */}
                        <div className="p-4 bg-background dark:bg-black border-t border-border dark:border-white/5">
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSimulate(); }}
                                className="flex items-center gap-4 relative"
                            >
                                <input 
                                    type="text" 
                                    value={sandboxInput}
                                    onChange={(e) => setSandboxInput(e.target.value)}
                                    placeholder={`Execute protocol against ${skill.title}...`}
                                    className="flex-1 bg-transparent border-0 text-foreground dark:text-white focus:outline-none focus:ring-0 px-4 py-3 font-mono text-sm placeholder:text-foreground/30 dark:placeholder:text-white/20"
                                    disabled={isSimulating}
                                />
                                <button 
                                    type="submit" 
                                    disabled={!sandboxInput.trim() || isSimulating}
                                    className="w-12 h-12 rounded-2xl bg-[#ff6b2b] text-black flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-[#ff6b2b] shrink-0"
                                >
                                    <Play size={18} fill="currentColor" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
