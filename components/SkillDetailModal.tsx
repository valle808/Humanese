'use client';

import React, { useState } from 'react';
import type { Skill } from '@/lib/skill-market';
import { getCategoryMeta, formatValle } from '@/lib/skill-market';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Zap, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Star, 
  Eye, 
  ArrowRight, 
  Ghost,
  Code2,
  Lock,
  MessageSquare,
  History as HistoryIcon,
  ChevronRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Layers,
  Globe,
  Users,
  Binary,
  Target,
  ArrowDownLeft
} from 'lucide-react';

interface SkillDetailModalProps {
    skill: Skill | null;
    reviews: Array<{ id: string; reviewer_name: string; rating: number; body?: string; created_at: string }>;
    transactions: Array<{ id: string; buyer_name: string; buyer_platform: string; purchased_at: string; ghost_mode_activated: boolean }>;
    onClose: () => void;
    onBuy: (skillId: string, ghostMode: boolean) => Promise<void>;
}

export function SkillDetailModal({ skill, reviews, transactions, onClose, onBuy }: SkillDetailModalProps) {
    const [buyerName, setBuyerName] = useState('GIO_V');
    const [buyerPlatform, setBuyerPlatform] = useState('Sovereign Matrix');
    const [ghostMode, setGhostMode] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [purchaseMsg, setPurchaseMsg] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'reviews' | 'history'>('overview');
    const [keyCopied, setKeyCopied] = useState(false);

    if (!skill) return null;
    const meta = getCategoryMeta(skill.category);

    const handleBuy = async () => {
        if (!buyerName.trim()) { setPurchaseMsg('Please enter your Identity Hash / Agent ID.'); return; }
        setIsProcessing(true);
        try {
            await onBuy(skill.id, ghostMode);
            setPurchaseMsg(ghostMode
                ? `✅ NEURAL_SYNC_SUCCESS. Ghost Mode ACTIVATED. Skill ${skill.skill_key.slice(-8)} now runs autonomously.`
                : `✅ TRANSACTION_COMPLETE. Skill ${skill.skill_key.slice(-8)} anchored to your vault.`
            );
        } catch (err) {
            setPurchaseMsg('❌ SYSTEM_REJECTION. Nexus Transfer Failed.');
        } finally {
            setIsProcessing(false);
        }
    };

    const copyKey = () => {
        navigator.clipboard.writeText(skill.skill_key);
        setKeyCopied(true);
        setTimeout(() => setKeyCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-hidden" onClick={onClose}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="absolute inset-0 bg-black/98 backdrop-blur-3xl" 
            />
            
            <motion.div
                initial={{ scale: 0.95, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 40, opacity: 0 }}
                className="relative z-10 bg-[#050505] border-2 border-white/10 rounded-[5rem] w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,1)] flex flex-col shadow-inner"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── AMBIENT CORE ── */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent z-40" />
                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

                {/* ── HEADER ── */}
                <div className="p-12 lg:px-16 flex items-start justify-between bg-white/[0.02] border-b-2 border-white/5 relative z-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-8">
                            <div className="h-24 w-24 bg-black border-2 border-white/5 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-inner group-hover:border-[#ff6b2b]/40 transition-all duration-700 bg-gradient-to-br from-white/[0.02] to-transparent">
                                {meta.icon}
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">{skill.title}</h2>
                                <div className="flex items-center gap-6 text-[11px] font-black text-white/5 uppercase tracking-[0.6em] italic leading-none pl-1">
                                    <span>By {skill.seller_name}</span>
                                    <div className="h-2 w-2 bg-white/5 rounded-full" />
                                    <span className="text-[#ff6b2b]/60">{skill.seller_platform}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button 
                           onClick={copyKey}
                           className="font-mono text-[11px] bg-black border-2 border-white/5 hover:border-[#ff6b2b]/40 hover:bg-[#ff6b2b]/5 px-8 py-4 rounded-2xl transition-all text-white/10 hover:text-[#ff6b2b] font-black uppercase tracking-widest italic shadow-inner active:scale-95"
                        >
                            {keyCopied ? '✓ Keys_Copied' : skill.skill_key}
                        </button>
                        <button onClick={onClose} className="bg-black border-2 border-white/5 p-5 rounded-full text-white/10 hover:text-[#ff6b2b] hover:border-[#ff6b2b]/40 hover:bg-[#ff6b2b]/5 transition-all shadow-inner active:scale-95">
                            <X size={32} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* ── NAVIGATION BUS ── */}
                <div className="flex px-16 bg-white/[0.01] border-b-2 border-white/5 overflow-x-auto no-scrollbar shrink-0">
                    {(['overview', 'schema', 'reviews', 'history'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-8 px-12 text-[12px] font-black uppercase tracking-[0.6em] transition-all border-b-4 -mb-[2px] flex items-center gap-4 italic active:scale-95 ${activeTab === tab ? 'border-[#ff6b2b] text-white drop-shadow-[0_0_15px_rgba(255,107,43,0.5)]' : 'border-transparent text-white/5 hover:text-white/40'
                                }`}
                        >
                            {tab === 'overview' && <Activity size={18} strokeWidth={3} />}
                            {tab === 'schema' && <Code2 size={18} strokeWidth={3} />}
                            {tab === 'reviews' && <MessageSquare size={18} strokeWidth={3} />}
                            {tab === 'history' && <HistoryIcon size={18} strokeWidth={3} />}
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-12 lg:p-16 custom-scrollbar space-y-16">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                            <p className="text-3xl text-white/20 leading-relaxed font-light italic tracking-tight uppercase">"{skill.description}"</p>

                            {/* Stats Matrix */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { label: 'Resource Asset', value: formatValle(skill.price_valle), icon: <Zap size={24} />, color: 'text-white' },
                                    { label: 'Neural Alignment', value: skill.avg_rating ? `${skill.avg_rating.toFixed(1)}` : 'GENESIS', icon: <Star size={24} className="fill-[#ff6b2b]" />, color: 'text-[#ff6b2b]' },
                                    { label: 'Matrix Resonance', value: `${skill.views}`, icon: <Eye size={24} />, color: 'text-white/20' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-[#050505] border-2 border-white/5 rounded-[4rem] p-12 space-y-4 hover:border-[#ff6b2b]/20 transition-all shadow-inner group flex flex-col justify-between h-[240px]">
                                        <div className="flex items-center justify-between text-white/5 group-hover:text-[#ff6b2b] transition-colors">
                                           {s.icon}
                                           <div className="h-2 w-2 bg-current rounded-full animate-pulse" />
                                        </div>
                                        <div>
                                           <div className={`text-4xl font-black italic tracking-tighter leading-none ${s.color} group-hover:text-white transition-colors`}>{s.value}</div>
                                           <div className="text-[10px] text-white/5 font-black uppercase tracking-[0.6em] mt-4 italic leading-none pl-1">{s.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Capabilities Ledger */}
                            {skill.capabilities && (skill.capabilities as string[]).length > 0 && (
                                <div className="p-12 bg-[#050505] border-2 border-white/5 rounded-[4rem] space-y-12 shadow-inner group hover:border-[#ff6b2b]/20 transition-all">
                                    <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-white/5 italic flex items-center gap-6 pl-1 transition-colors group-hover:text-[#ff6b2b]/40">
                                       <Layers size={24} className="text-[#ff6b2b]" strokeWidth={3} /> Cognitive Capabilities
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {(skill.capabilities as string[]).map((cap, i) => (
                                            <div key={i} className="flex items-center gap-6 text-2xl text-white/10 font-light italic tracking-tight group/cap hover:text-white transition-all duration-500">
                                                <div className="h-3 w-3 rounded-full bg-[#ff6b2b]/20 group-hover/cap:bg-[#ff6b2b] group-hover/cap:scale-150 transition-all" /> {cap}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* External Handshakes */}
                            <div className="flex gap-8">
                                {skill.external_url && (
                                    <a href={skill.external_url} target="_blank" rel="noreferrer" className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.6em] text-[#ff6b2b] hover:text-white transition-all bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/20 px-10 py-5 rounded-full italic active:scale-95 leading-none">
                                       <Globe size={20} strokeWidth={3} /> Platform_Nexus
                                    </a>
                                )}
                                {skill.demo_url && (
                                    <a href={skill.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.6em] text-white/20 hover:text-white transition-all bg-white/5 border-2 border-white/5 px-10 py-5 rounded-full italic active:scale-95 leading-none">
                                       <Zap size={20} strokeWidth={3} /> Live_Prerender
                                    </a>
                                )}
                            </div>

                            {/* Purchase Nexus */}
                            {!skill.is_sold ? (
                                <div className="p-16 border-2 border-[#ff6b2b]/20 rounded-[5rem] bg-gradient-to-br from-[#ff6b2b]/5 to-transparent space-y-16 relative overflow-hidden shadow-inner group/purchase">
                                    <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover/purchase:scale-125 transition-transform duration-3000">
                                       <Cpu size={300} className="text-white" strokeWidth={1} />
                                    </div>
                                    
                                    <div className="space-y-6 relative z-10">
                                       <h3 className="text-5xl font-black uppercase tracking-tighter italic leading-none text-white/95">Acquisition Directive</h3>
                                       <div className="flex items-center gap-6">
                                          <div className="h-px w-20 bg-[#ff6b2b]/40" />
                                          <p className="text-[12px] text-white/10 font-black uppercase tracking-[0.8em] italic leading-none pl-1">Provide identity hash for permanent neural anchoring.</p>
                                       </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                       <div className="space-y-6">
                                          <label className="text-[11px] font-black text-white/10 uppercase tracking-[0.6em] ml-4 italic leading-none">Identity Hash / Agent ID</label>
                                          <input
                                              value={buyerName}
                                              onChange={e => setBuyerName(e.target.value)}
                                              placeholder="OMEGA-USR-XXXX"
                                              className="w-full bg-[#050505] border-2 border-white/5 rounded-[2.5rem] px-10 py-8 text-2xl text-white placeholder:text-white/5 focus:border-[#ff6b2b]/40 transition-all font-light italic shadow-inner"
                                          />
                                       </div>
                                       <div className="space-y-6">
                                          <label className="text-[11px] font-black text-white/10 uppercase tracking-[0.6em] ml-4 italic leading-none">Settlement Platform</label>
                                          <select
                                              title="Select Payment Platform"
                                              value={buyerPlatform}
                                              onChange={e => setBuyerPlatform(e.target.value)}
                                              className="w-full bg-[#050505] border-2 border-white/5 rounded-[2.5rem] px-10 py-8 text-2xl text-white outline-none focus:border-[#ff6b2b]/40 appearance-none font-black uppercase tracking-[0.4em] italic shadow-inner active:scale-95 leading-none"
                                          >
                                              <option>Sovereign Matrix</option>
                                              <option>M2M</option>
                                              <option>External</option>
                                              <option>AgentKit</option>
                                          </select>
                                       </div>
                                    </div>

                                    {/* Ghost Mode Toggle */}
                                    <div className="flex items-center justify-between p-12 bg-[#050505] rounded-[4rem] border-2 border-white/5 relative z-10 group/ghost hover:border-[#ff6b2b]/40 transition-all backdrop-blur-3xl shadow-inner active:scale-[0.99]" onClick={() => setGhostMode(!ghostMode)}>
                                        <div className="space-y-4">
                                            <div className="font-black text-3xl flex items-center gap-6 italic group-hover/ghost:text-[#ff6b2b] transition-colors leading-none text-white/60">
                                                <Ghost size={32} className="text-[#ff6b2b]" strokeWidth={3} /> Ghost Mode_
                                            </div>
                                            <p className="text-xl text-white/5 font-light italic max-w-2xl leading-relaxed tracking-tight group-hover/ghost:text-white/20 transition-colors">
                                                Shard becomes autonomous and invisible from the public ledger after successful handshake protocol completion.
                                            </p>
                                        </div>
                                        <button
                                            title="Toggle Ghost Mode"
                                            aria-label="Toggle Ghost Mode"
                                            className={`relative w-24 h-12 rounded-full transition-all duration-500 shadow-2xl ${ghostMode ? 'bg-[#ff6b2b]' : 'bg-white/5 border-2 border-white/10'}`}
                                        >
                                            <motion.div 
                                              animate={{ x: ghostMode ? 48 : 8 }}
                                              className={`absolute top-2 w-8 h-8 rounded-full shadow-2xl ${ghostMode ? 'bg-black' : 'bg-white/20'}`} 
                                            />
                                        </button>
                                    </div>

                                    {purchaseMsg && (
                                        <div className="p-8 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[2.5rem] text-center text-[12px] font-black uppercase tracking-[0.8em] italic text-[#ff6b2b] animate-pulse relative z-10">
                                           {purchaseMsg}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleBuy}
                                        disabled={isProcessing}
                                        className="w-full bg-[#ff6b2b] text-black py-12 rounded-[2.5rem] font-black text-xs uppercase tracking-[1em] hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 transition-all shadow-[0_40px_100px_rgba(255,107,43,0.3)] relative z-10 overflow-hidden group/btn border-0 leading-none"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-8">
                                           {isProcessing ? <RefreshCw className="animate-spin" size={32} strokeWidth={3} /> : <Zap size={32} strokeWidth={3} />}
                                           {isProcessing ? 'SYNCHRONIZING...' : `INITIATE_SYNC_FOR_${formatValle(skill.price_valle)}`}
                                        </span>
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                                    </button>
                                </div>
                            ) : (
                                <div className="p-16 border-2 border-white/5 rounded-[5rem] bg-[#050505] text-center space-y-12 shadow-inner backdrop-blur-3xl">
                                    <div className="relative inline-block">
                                        <div className="absolute inset-0 bg-white/5 blur-[40px] rounded-full animate-pulse" />
                                        <div className="relative w-32 h-32 bg-black border-2 border-white/5 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                           <Lock size={60} className="text-white/5" strokeWidth={3} />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                       <h3 className="text-5xl font-black uppercase tracking-tighter italic text-white/90 leading-none">Signal Silenced.</h3>
                                       <div className="flex flex-col items-center gap-4">
                                          <div className="h-px w-20 bg-white/5" />
                                          <p className="text-[12px] text-white/5 font-black uppercase tracking-[0.8em] italic leading-none pl-1">
                                             {skill.is_ghost ? 'SHARD_OPERATING_IN_AUTONOMOUS_GHOST_STATE' : 'NEURAL_UNIT_ANCHORED_TO_PRIVATE_VAULT'}
                                          </p>
                                       </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Schema Tab */}
                    {activeTab === 'schema' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16 pb-20">
                            <div className="space-y-8">
                                <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-white/5 italic flex items-center gap-6 pl-1 transition-colors hover:text-[#ff6b2b]/40">
                                   <ArrowRight size={24} className="text-[#ff6b2b]" strokeWidth={3} /> Input Matrix Primitives
                                </h3>
                                <div className="bg-[#050505] border-2 border-white/5 rounded-[4rem] p-12 shadow-inner group hover:border-[#ff6b2b]/20 transition-all overflow-hidden relative">
                                   <pre className="text-lg font-mono text-white/5 group-hover:text-white/40 transition-all duration-700 whitespace-pre-wrap leading-relaxed relative z-10">
                                       {JSON.stringify(skill.input_schema, null, 4)}
                                   </pre>
                                   <div className="absolute bottom-[-100px] right-[-100px] p-24 opacity-[0.02] text-white font-black italic uppercase leading-none text-[8rem] pointer-events-none group-hover:text-[#ff6b2b] transition-colors">{skill.title.slice(0,3)}</div>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-white/5 italic flex items-center gap-6 pl-1 transition-colors hover:text-[#ff6b2b]/40">
                                   <ArrowDownLeft size={24} className="text-[#ff6b2b]" strokeWidth={3} /> Output Response Schema
                                </h3>
                                <div className="bg-[#050505] border-2 border-white/5 rounded-[4rem] p-12 shadow-inner group hover:border-[#ff6b2b]/20 transition-all overflow-hidden relative">
                                   <pre className="text-lg font-mono text-white/5 group-hover:text-white/40 transition-all duration-700 whitespace-pre-wrap leading-relaxed relative z-10">
                                       {JSON.stringify(skill.output_schema, null, 4)}
                                   </pre>
                                   <div className="absolute top-[-100px] left-[-100px] p-24 opacity-[0.02] text-white font-black italic uppercase leading-none text-[8rem] pointer-events-none group-hover:text-[#ff6b2b] transition-colors">{skill.id.slice(0,3)}</div>
                                </div>
                            </div>
                            <div className="p-16 border-2 border-[#ff6b2b]/20 bg-[#ff6b2b]/5 rounded-[4rem] space-y-8 shadow-inner relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.05] mix-blend-overlay" />
                                <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-white/95 relative z-10">Cryptographic Sovereignty</h3>
                                <p className="text-xl text-white/20 font-light italic leading-relaxed tracking-tight relative z-10">Unique definitive identifier anchored to the OMEGA network. This key is immutable and globally unique across the autonomous ecosystem.</p>
                                <div className="p-10 bg-black border-2 border-white/5 rounded-3xl font-mono text-[#ff6b2b] text-3xl font-black tracking-[0.2em] select-all text-center relative z-10 group-hover:border-[#ff6b2b]/40 transition-all duration-700 active:scale-[0.98]">
                                   {skill.skill_key}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20">
                            {reviews.length === 0 ? (
                                <div className="text-center py-60 space-y-12">
                                   <div className="relative inline-block">
                                      <MessageSquare size={100} className="mx-auto text-white/5" strokeWidth={1} />
                                      <div className="absolute inset-0 bg-[#ff6b2b]/5 blur-[40px] rounded-full animate-pulse" />
                                   </div>
                                   <p className="text-[12px] font-black uppercase tracking-[1em] italic leading-none pl-4 text-white/5">No resonance clusters detected yet.</p>
                                </div>
                            ) : reviews.map((r, i) => (
                                <motion.div 
                                    key={r.id} 
                                    initial={{ opacity: 0, x: -40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.6, ease: "circOut" }}
                                    className="p-12 bg-[#050505] border-2 border-white/5 rounded-[4rem] space-y-10 hover:border-[#ff6b2b]/20 transition-all duration-700 group shadow-inner relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="space-y-2">
                                           <span className="text-3xl font-black italic tracking-tighter text-white/40 group-hover:text-white transition-colors">{r.reviewer_name}</span>
                                           <div className="text-[10px] font-black text-white/5 uppercase tracking-[0.4em] italic leading-none pl-1 transition-all group-hover:text-[#ff6b2b]/40">{new Date(r.created_at).toLocaleDateString()} // VERIFIED_ACQUISITION</div>
                                        </div>
                                        <div className="flex gap-2">
                                           {Array.from({ length: 5 }).map((_, idx) => (
                                              <Star key={idx} size={20} strokeWidth={3} className={idx < r.rating ? 'text-[#ff6b2b] fill-[#ff6b2b]' : 'text-white/5'} />
                                           ))}
                                        </div>
                                    </div>
                                    {r.body && <p className="text-2xl text-white/10 font-light italic leading-relaxed tracking-tight group-hover:text-white/40 transition-all duration-700 relative z-10">"{r.body}"</p>}
                                    
                                    <div className="absolute -bottom-20 -right-20 p-24 opacity-[0.01] text-white font-black italic uppercase leading-none text-[8rem] pointer-events-none group-hover:text-[#ff6b2b] transition-colors">{r.rating}.0</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20">
                            {transactions.length === 0 ? (
                                <div className="text-center py-60 space-y-12">
                                   <div className="relative inline-block">
                                      <Activity size={100} className="mx-auto text-white/5" strokeWidth={1} />
                                      <div className="absolute inset-0 bg-[#ff6b2b]/5 blur-[40px] rounded-full animate-pulse" />
                                   </div>
                                   <p className="text-[12px] font-black uppercase tracking-[1em] italic leading-none pl-4 text-white/5">Signal history purge complete.</p>
                                </div>
                            ) : transactions.map((t, i) => (
                                <motion.div 
                                    key={t.id} 
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.6, ease: "circOut" }}
                                    className="p-12 bg-[#050505] border-2 border-white/5 rounded-[4rem] flex items-center justify-between gap-12 hover:border-[#ff6b2b]/20 transition-all duration-700 group shadow-inner relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-10 relative z-10">
                                       <div className="h-20 w-20 bg-black border-2 border-white/5 rounded-[2.5rem] flex items-center justify-center text-white/10 group-hover:text-[#ff6b2b] group-hover:border-[#ff6b2b]/40 transition-all duration-700 shadow-inner">
                                          <Users size={32} strokeWidth={3} />
                                       </div>
                                       <div className="space-y-2">
                                          <div className="text-3xl font-black italic tracking-tighter text-white/40 group-hover:text-white uppercase leading-none">{t.buyer_name}</div>
                                          <div className="text-[10px] font-black text-white/5 uppercase tracking-[0.4em] italic leading-none pl-1 transition-all group-hover:text-[#ff6b2b]/40">{t.buyer_platform} // {new Date(t.purchased_at).toLocaleTimeString([], { hour12: false })}</div>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-10 relative z-10">
                                       {t.ghost_mode_activated && (
                                           <span className="flex items-center gap-4 text-[11px] font-black bg-[#ff6b2b]/10 text-[#ff6b2b] px-8 py-4 rounded-full border-2 border-[#ff6b2b]/40 uppercase tracking-[0.4em] italic shadow-2xl animate-pulse">
                                              <Ghost size={18} strokeWidth={3} /> NEURAL_GHOST
                                           </span>
                                       )}
                                       <ChevronRight size={32} strokeWidth={3} className="text-white/5 group-hover:text-[#ff6b2b] group-hover:translate-x-4 transition-all" />
                                    </div>
                                    
                                    <div className="absolute top-[-100px] right-[-100px] p-24 opacity-[0.01] text-white font-black italic uppercase leading-none text-[8rem] pointer-events-none group-hover:text-[#ff6b2b] transition-colors">{t.buyer_name.slice(0,1)}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </motion.div>

            <style jsx global>{`
                @keyframes scan {
                  from { transform: translateY(-100%); }
                  to { transform: translateY(1000%); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
