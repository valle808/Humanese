'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkillCard } from '@/components/SkillCard';
import { SkillDetailModal } from '@/components/SkillDetailModal';
import { SkillListingForm } from '@/components/SkillListingForm';
import { SKILL_CATEGORIES, formatValle } from '@/lib/skill-market';
import type { Skill } from '@/lib/skill-market';
import { 
  Zap, 
  Search, 
  Plus, 
  History, 
  ChevronLeft, 
  Globe, 
  Activity, 
  ShieldCheck, 
  Target,
  Sparkles,
  Layers,
  TrendingUp,
  Cpu,
  Orbit,
  Grid,
  ShieldHalf,
  Clock,
  Binary,
  ShieldAlert,
  X,
  ArrowRight,
  Database,
  Smartphone,
  CreditCard,
  MoreVertical,
  Radio,
  Wifi
} from 'lucide-react';
import Link from 'next/link';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';

interface MarketStats {
    total_skills: number;
    ghost_skills: number;
    total_volume: number;
}

interface DetailData {
    skill: Skill;
    reviews: any[];
    transactions: any[];
}

export default function SkillMarketPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [stats, setStats] = useState<MarketStats>({ total_skills: 0, ghost_skills: 0, total_volume: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedSkill, setSelectedSkill] = useState<DetailData | null>(null);
    const [showListingForm, setShowListingForm] = useState(false);
    const [successKey, setSuccessKey] = useState('');
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);

    const fetchSkills = useCallback(async (p = 1) => {
        setIsLoading(true);
        try {
            const isSearch = searchQuery.trim().length > 0;
            const endpoint = isSearch ? '/api/skill-market/search' : '/api/skill-market';

            let data;
            if (isSearch) {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: searchQuery, category: selectedCategory, sort: sortBy, platform: selectedPlatform, page: p }),
                });
                data = await res.json();
            } else {
                const params = new URLSearchParams({ sort: sortBy, page: String(p) });
                if (selectedCategory !== 'all') params.set('category', selectedCategory);
                if (selectedPlatform) params.set('platform', selectedPlatform);
                const res = await fetch(`${endpoint}?${params}`);
                data = await res.json();
            }

            setSkills((prev: Skill[]) => (p === 1 ? (data.skills || []) : [...prev, ...(data.skills || [])]));
            setCount(data.count || 0);
            if (data.stats) setStats(data.stats);
        } catch (err) {
            console.error('[skill-market fetch]', err);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, selectedCategory, sortBy, selectedPlatform]);

    useEffect(() => {
        setPage(1);
        fetchSkills(1);
    }, [fetchSkills]);

    const handleSelectSkill = async (skill: Skill) => {
        try {
            const res = await fetch(`/api/skill-market/${skill.id}`);
            const data = await res.json();
            setSelectedSkill(data);
        } catch {
            setSelectedSkill({ skill, reviews: [], transactions: [] });
        }
    };

    const handleBuy = async (skillId: string, ghostMode: boolean) => {
        try {
            const res = await fetch(`/api/skill-market/${skillId}/buy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ buyer_id: `guest-${Date.now()}`, buyer_name: 'Sovereign_Buyer', activate_ghost: ghostMode }),
            });
            if (!res.ok) throw new Error('Purchase failed');
            fetchSkills(1);
        } catch (e) {
            console.error('Core transaction rejection');
        }
    };

    const handleListingSuccess = (key: string) => {
        setSuccessKey(key);
        setShowListingForm(false);
        fetchSkills(1);
        setTimeout(() => setSuccessKey(''), 8000);
    };

    const platforms = ['Sovereign Matrix', 'M2M', 'External', 'AgentKit'];

    return (
        <div className="relative min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ff6b2b]/40 selection:text-white overflow-x-hidden pb-40">
            
            {/* 🌌 AMBIENT CORE */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
                
                {/* Animated Scanning Lines */}
                <div className="absolute inset-0 opacity-[0.05]">
                   <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-1/4 animate-[scan_15s_linear_infinite]" />
                   <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-3/4 animate-[scan_20s_linear_infinite_reverse]" />
                </div>
            </div>

            <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
                <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
                    <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
                </Link>
                <div className="flex items-center gap-6">
                   <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
                      MARKET_v7.0_SYNC
                   </div>
                </div>
            </header>

            <main className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">
                
                {/* ── HEADER SECTION ── */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-end gap-16 border-b-2 border-white/5 pb-16"
                >
                    <div className="space-y-12 max-w-5xl">
                        <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl shadow-2xl">
                          <Layers size={20} className="text-[#ff6b2b]" />
                          <span className="text-[11px] font-black tracking-[0.8em] text-[#ff6b2b] uppercase italic leading-none pl-1">Neural Exchange Grid</span>
                        </div>
                        <div className="space-y-8">
                          <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] italic pl-1 text-white/95">
                            Skill<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Market.</span>
                          </h1>
                          <p className="text-2xl md:text-3xl text-white/30 max-w-4xl leading-relaxed font-light italic tracking-tight">
                            The sovereign economy for AI capabilities. 
                            <span className="text-white/60"> Buy, sell, and trade</span> autonomous intelligence shards across the OMEGA network.
                          </p>
                        </div>
                    </div>

                    <div className="flex gap-10 items-center shrink-0">
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            {[
                                { label: 'Skills Listed', value: stats.total_skills.toString(), icon: <Layers size={28} /> },
                                { label: 'Ghost Mode', value: stats.ghost_skills.toString(), icon: <Sparkles size={28} /> },
                                { label: 'Market Cap', value: formatValle(stats.total_volume), icon: <TrendingUp size={28} /> },
                            ].map((s, i) => (
                                <div key={i} className="p-8 md:p-10 bg-[#050505] border-2 border-white/5 responsive-rounded backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between h-[280px] min-w-[240px] group hover:border-[#ff6b2b]/20 transition-all shadow-inner relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-10 opacity-[0.01] group-hover:scale-125 transition-transform duration-1000 text-white font-black italic uppercase leading-none text-[6rem]">0{i+1}</div>
                                     <div className="p-8 rounded-[2rem] bg-black border-2 border-white/5 text-[#ff6b2b] group-hover:bg-[#ff6b2b] group-hover:text-black group-hover:border-black/5 transition-all w-fit shadow-inner relative z-10">
                                        {s.icon}
                                     </div>
                                     <div className="space-y-4 relative z-10 pl-2">
                                        <div className="text-4xl font-black text-white italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">{s.value}</div>
                                        <div className="text-[10px] text-white/10 font-black uppercase tracking-[0.4em] italic leading-none">{s.label}</div>
                                     </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </motion.div>

                {/* ── SEARCH & ACTIONS ── */}
                <section className="space-y-16">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 relative group">
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Transmission Interface: Direct Capability Link..."
                                className="w-full bg-[#050505] border-2 border-white/5 rounded-[4rem] px-12 py-10 pr-24 text-white placeholder:text-white/5 focus:outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 text-3xl italic transition-all shadow-[0_40px_100px_rgba(0,0,0,1)] shadow-inner"
                            />
                            <Search className="absolute right-12 top-1/2 -translate-y-1/2 text-white/5 group-focus-within:text-[#ff6b2b] transition-all duration-700" size={40} strokeWidth={3} />
                        </div>
                        <button
                            onClick={() => setShowListingForm(true)}
                            className="bg-[#ff6b2b] text-black px-20 py-10 rounded-[4rem] font-black text-xs uppercase tracking-[0.8em] hover:scale-[1.05] active:scale-[0.95] transition-all shadow-[0_40px_100px_rgba(255,107,43,0.3)] flex items-center justify-center gap-6 italic relative overflow-hidden group border-0 leading-none"
                        >
                            <span className="relative z-10 flex items-center gap-6">
                                <Plus size={24} strokeWidth={4} /> List Shard
                            </span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                        </button>
                    </div>

                    <AnimatePresence>
                        {successKey && (
                            <motion.div 
                                initial={{ opacity: 0, y: -40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -40 }}
                                className="bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/40 text-[#ff6b2b] rounded-[4rem] p-12 lg:p-14 text-sm flex items-center gap-10 shadow-[0_40px_100px_rgba(255,107,43,0.2)] backdrop-blur-3xl"
                            >
                                <div className="w-20 h-20 bg-[#ff6b2b] rounded-full flex items-center justify-center text-black shadow-[0_0_30px_#ff6b2b]">
                                   <ShieldCheck size={40} strokeWidth={3} />
                                </div>
                                <div className="space-y-4">
                                    <div className="text-3xl font-black uppercase tracking-tighter italic leading-none">Shard Anchored Successfully</div>
                                    <div className="text-[12px] font-mono tracking-widest uppercase italic opacity-60 flex items-center gap-4">Sovereign Key: <span className="text-white font-black bg-white/5 px-4 py-2 rounded-xl border border-white/5">{successKey}</span></div>
                                </div>
                                <button onClick={() => setSuccessKey('')} className="ml-auto hover:scale-125 transition-transform p-4 bg-white/5 border border-white/10 rounded-full text-white/40 hover:text-white">
                                    <X size={24} strokeWidth={3} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* ── FILTERS & GRID ── */}
                <section className="space-y-24">
                    <div className="flex flex-wrap gap-6 border-b-2 border-white/5 pb-16">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.5em] transition-all italic leading-none active:scale-95 border-2 ${selectedCategory === 'all' ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-[0_20px_40px_rgba(255,107,43,0.3)]' : 'bg-white/5 text-white/10 border-white/5 hover:border-[#ff6b2b]/40 hover:text-white'}`}
                        >
                            All_PRIMITIVES
                        </button>
                        {SKILL_CATEGORIES.map((cat: any) => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.5em] transition-all italic border-2 flex items-center gap-6 leading-none active:scale-95 ${selectedCategory === cat.value ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-[0_20px_40px_rgba(255,107,43,0.3)]' : 'bg-white/5 border-white/5 text-white/10 hover:border-[#ff6b2b]/40 hover:text-white'}`}
                            >
                                <span className="text-lg">{cat.icon}</span> {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between gap-12 flex-wrap">
                        <div className="flex items-center gap-6 pl-4">
                           <div className="h-px w-16 bg-[#ff6b2b]/40" />
                           <p className="text-[12px] font-black uppercase tracking-[1em] text-white/10 italic leading-none">
                               {isLoading ? 'Synchronizing Neural Bus...' : `${count} capabilities discovered`}
                           </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-8">
                            <select
                                title="Platform"
                                value={selectedPlatform}
                                onChange={e => setSelectedPlatform(e.target.value)}
                                className="bg-black border-2 border-white/5 rounded-2xl px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white/20 focus:outline-none focus:border-[#ff6b2b]/40 transition-all italic shadow-inner active:scale-95 leading-none"
                            >
                                <option value="">All Platforms</option>
                                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <select
                                title="Sort Results"
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value as SortOption)}
                                className="bg-black border-2 border-white/5 rounded-2xl px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white/20 focus:outline-none focus:border-[#ff6b2b]/40 transition-all italic shadow-inner active:scale-95 leading-none"
                            >
                                <option value="newest">Latest Signals</option>
                                <option value="popular">Most Connected</option>
                                <option value="rating">Top Alignment</option>
                                <option value="price_asc">Resource Asc ↑</option>
                                <option value="price_desc">Resource Desc ↓</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-24">
                        {isLoading && skills.length === 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="animate-pulse bg-[#050505] border-2 border-white/5 responsive-rounded h-[500px] shadow-inner" />
                                ))}
                            </div>
                        ) : skills.length === 0 ? (
                            <div className="text-center py-60 space-y-16">
                                <div className="relative inline-block">
                                    <Activity size={120} className="mx-auto text-white/5" strokeWidth={1} />
                                    <div className="absolute inset-0 bg-[#ff6b2b]/10 blur-[80px] rounded-full animate-ping" />
                                </div>
                                <div className="space-y-8">
                                    <h3 className="text-5xl font-black uppercase tracking-tighter italic text-white/90">Silence in the Matrix.</h3>
                                    <p className="text-2xl text-white/20 font-light italic tracking-tight">No capabilities discovered in this frequency spectrum.</p>
                                    <button
                                        onClick={() => setShowListingForm(true)}
                                        className="mt-12 px-20 py-8 bg-white text-black rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.8em] hover:bg-[#ff6b2b] transition-all italic active:scale-95 shadow-2xl border-0"
                                    >
                                        + Anchor First Shard
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-24">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                                    {skills.map((skill, i) => (
                                        <SkillCard key={skill.id} skill={skill} onSelect={handleSelectSkill} />
                                    ))}
                                </div>
                                {skills.length < count && (
                                    <div className="text-center">
                                        <button
                                            onClick={() => { const next = page + 1; setPage(next); fetchSkills(next); }}
                                            disabled={isLoading}
                                            className="px-24 py-10 bg-[#050505] border-2 border-white/5 text-white/20 rounded-full text-[12px] font-black uppercase tracking-[1em] hover:border-[#ff6b2b]/40 hover:text-white transition-all italic disabled:opacity-50 active:scale-95 shadow-2xl leading-none"
                                        >
                                            {isLoading ? 'Synchronizing...' : `Expand Search (${count - skills.length} remaining)`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-40 border-t-2 border-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                                {[
                                    { icon: <Cpu size={48} strokeWidth={2.5} />, title: 'Sovereign Protocol', body: 'Every shard is assigned a definitive network key, ensuring cryptographic scarcity and immutable ownership across the ledger.' },
                                    { icon: <Sparkles size={48} strokeWidth={2.5} />, title: 'Ghost Mode', body: 'Encrypted acquisition. Shards can be moved into autonomous ghost state — fully operational but invisible to public indexing.' },
                                    { icon: <Globe size={48} strokeWidth={2.5} />, title: 'Omni-Matrix', body: 'Universal trade layer. Direct integration for agents, humans, machines, and external hardware swarms for seamless task execution.' },
                                ].map((f, i) => (
                                    <div key={i} className="space-y-10 text-center group">
                                        <div className="w-32 h-32 bg-[#050505] border-2 border-white/5 rounded-[3.5rem] flex items-center justify-center mx-auto text-white/10 group-hover:bg-[#ff6b2b] group-hover:text-black group-hover:border-[#ff6b2b]/10 transition-all duration-700 shadow-inner group-hover:scale-110">
                                            {f.icon}
                                        </div>
                                        <div className="space-y-6">
                                           <h3 className="text-4xl font-black uppercase italic tracking-tighter group-hover:text-[#ff6b2b] transition-colors leading-none">{f.title}</h3>
                                           <p className="text-xl text-white/20 font-light leading-relaxed italic tracking-tight group-hover:text-white/40 transition-colors">{f.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FOOTER SIGNAL ── */}
                <section className="pt-40 text-center space-y-16">
                    <div className="w-full flex justify-center gap-4">
                       <div className="w-4 h-4 rounded-full bg-[#ff6b2b] shadow-[0_0_20px_#ff6b2b]" />
                       <div className="w-4 h-4 rounded-full bg-white/10" />
                       <div className="w-4 h-4 rounded-full bg-white/10" />
                    </div>
                    <Link href="/" className="inline-flex items-center gap-8 text-[12px] font-black uppercase tracking-[1rem] text-white/10 hover:text-[#ff6b2b] transition-all italic group active:scale-95 leading-none pl-4 pr-4">
                        <ChevronLeft size={24} className="group-hover:-translate-x-4 transition-transform" strokeWidth={3} /> Return to Core Shard
                    </Link>
                </section>
            </main>

            <AnimatePresence>
                {selectedSkill && (
                    <SkillDetailModal
                        skill={selectedSkill.skill}
                        reviews={selectedSkill.reviews}
                        transactions={selectedSkill.transactions}
                        onClose={() => setSelectedSkill(null)}
                        onBuy={handleBuy}
                    />
                )}
                {showListingForm && (
                    <SkillListingForm onClose={() => setShowListingForm(false)} onSuccess={handleListingSuccess} />
                )}
            </AnimatePresence>

            {/* BACKGROUND DECOR */}
            <div className="fixed bottom-0 left-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
                <div className="text-[30vw] font-black italic leading-none uppercase">SHARD</div>
            </div>
            
            <style jsx global>{`
                @keyframes scan {
                  from { transform: translateY(-100%); }
                  to { transform: translateY(1000%); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
            `}</style>
        </div>
    );
}
