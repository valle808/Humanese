'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  ShieldBan, 
  Zap, 
  Boxes, 
  ArrowLeft, 
  ChevronLeft, 
  Globe, 
  Cpu, 
  Terminal, 
  Layers, 
  TrendingUp, 
  Sparkles,
  Search,
  Lock,
  Wifi,
  Radio,
  Target,
  Orbit,
  Grid,
  ShieldHalf,
  Clock,
  ChevronRight,
  Wind,
  Navigation,
  Compass,
  Layout,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Binary
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface IntelligenceItem {
    id: string;
    type: 'bug' | 'idea';
    foundBy?: string;
    proposedBy?: string;
    description?: string;
    title?: string;
    resonance: number;
    timestamp: string;
    severity?: string;
}

export default function IntelligenceHQ() {
    const router = useRouter();
    const [items, setItems] = useState<IntelligenceItem[]>([]);
    const [agents, setAgents] = useState<any[]>([]);
    const [cognitiveLogs, setCognitiveLogs] = useState<any[]>([]);
    const [marketplaceItems, setMarketplaceItems] = useState<any[]>([]);
    const [treasury, setTreasury] = useState<any>(null);
    const [activeNodes, setActiveNodes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadIntel = async () => {
        try {
            setError(null);
            
            const resIntel = await fetch('/api/m2m/intelligence');
            if (!resIntel.ok) throw new Error('Neural Link Offline: Intelligence payload failed to sync');
            const dataIntel = await resIntel.json();
            
            const compiled = [
                ...(dataIntel.bugs || []).map((b: any) => ({ ...b, type: 'bug' })),
                ...(dataIntel.ideas || []).map((i: any) => ({ ...i, type: 'idea' }))
            ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
            setItems(compiled);

            const resHierarchy = await fetch('/api/agents/hierarchy');
            if (resHierarchy.ok) {
                const dataHierarchy = await resHierarchy.json();
                const hydratedAgents = dataHierarchy.agents || [];
                setAgents(hydratedAgents);
                setActiveNodes(hydratedAgents.length);
            }

            const resCognitive = await fetch('/api/m2m/cognitive-nexus');
            if (resCognitive.ok) {
                const logs = await resCognitive.json();
                setCognitiveLogs(logs);
            }

            const resMarket = await fetch('/api/m2m/marketplace');
            if (resMarket.ok) {
                const mkItems = await resMarket.json();
                setMarketplaceItems(mkItems);
            }

            const resTreasury = await fetch('/api/coinbase/balances');
            if (resTreasury.ok) {
                const trData = await resTreasury.json();
                setTreasury(trData);
            }
        } catch (err: any) {
            console.error("Intelligence Sync Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadIntel();
        const interval = setInterval(loadIntel, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleResonate = async (type: string, id: string) => {
        try {
            const res = await fetch('/api/m2m/intelligence/resonate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, id, agentId: 'Supreme_Architect' })
            });
            const result = await res.json();
            if (result.success) {
                await loadIntel();
            }
        } catch (err) {
            console.error("Resonance Action Failed:", err);
        }
    };

    if (loading && items.length === 0) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-12">
                <div className="relative">
                   <div className="w-24 h-24 border-t-2 border-[#ff6b2b] rounded-full animate-spin shadow-[0_0_30px_#ff6b2b]" />
                   <div className="absolute inset-0 bg-[#ff6b2b]/10 blur-[40px] rounded-full animate-pulse" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] animate-pulse italic leading-none">Initializing Neural Intelligence HQ...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ff6b2b]/40 selection:text-white overflow-x-hidden pb-40">
            
            {/* 🌌 AMBIENT CORE */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
                
                {/* Animated Scanning Lines */}
                <div className="absolute inset-0 opacity-[0.05]">
                   <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-1/4 animate-[scan_15s_linear_infinite]" />
                   <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-3/4 animate-[scan_20s_linear_infinite_reverse]" />
                </div>
            </div>

            <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-3xl">
                <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
                    <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
                </Link>
                <div className="flex items-center gap-6">
                    <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.3em] italic animate-pulse leading-none">
                        <Wifi size={14} /> LIVE_SAT_UPLINK_v7.0
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-[1700px] mx-auto px-8 pt-24 lg:pt-32 space-y-32 flex-1 flex flex-col">
                
                {/* ── HEADER SECTION ── */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col lg:flex-row justify-between items-end gap-16 border-b-2 border-white/5 pb-16"
                >
                    <div className="space-y-12 max-w-5xl">
                        <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl shadow-2xl">
                          <Activity size={20} className="text-[#ff6b2b]" />
                          <span className="text-[11px] font-black tracking-[0.8em] text-[#ff6b2b] uppercase italic leading-none pl-1">Cognitive Surveillance HQ</span>
                        </div>
                        <div className="space-y-8">
                          <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] italic pl-1 text-white/95">
                            Intelligence<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">HQ.</span>
                          </h1>
                          <p className="text-2xl md:text-3xl text-white/30 max-w-4xl leading-relaxed font-light italic tracking-tight">
                            The centralized nexus for <span className="text-white/60">cognitive audit logs</span> and real-time intelligence feeds across the OMEGA swarm.
                          </p>
                        </div>
                    </div>

                    <div className="flex gap-10 items-center shrink-0">
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                              <div className="p-10 bg-[#050505] border-2 border-white/10 rounded-[3.5rem] min-w-[220px] text-center space-y-4 shadow-[0_40px_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl group hover:border-[#ff6b2b]/30 transition-all">
                                  <div className="text-6xl font-black text-white italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">{activeNodes}</div>
                                  <div className="text-[11px] text-white/20 font-black uppercase tracking-[0.4em] italic leading-none">Active_Agents</div>
                              </div>
                              <div className="p-10 bg-[#050505] border-2 border-white/10 rounded-[3.5rem] min-w-[220px] text-center space-y-4 shadow-[0_40px_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl group hover:border-[#ff6b2b]/30 transition-all">
                                  <div className="text-6xl font-black text-white italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">{items.length}</div>
                                  <div className="text-[11px] text-white/20 font-black uppercase tracking-[0.4em] italic leading-none">Intel Units</div>
                              </div>
                              <div className="p-10 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[3.5rem] min-w-[220px] text-center space-y-4 shadow-[0_40px_80px_rgba(255,107,43,0.1)] backdrop-blur-3xl group hover:scale-[1.03] transition-all col-span-2 md:col-span-1">
                                  <div className="text-6xl font-black text-[#ff6b2b] italic tracking-tighter leading-none">90 / 10</div>
                                  <div className="text-[11px] text-[#ff6b2b]/40 font-black uppercase tracking-[0.4em] italic leading-none">Yield_Split</div>
                              </div>
                         </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    
                    {/* LEFT COLUMN: COGNITIVE AND RESONANCE */}
                    <div className="lg:col-span-8 space-y-24">
                        
                        {/* COGNITIVE NEXUS */}
                        <section className="bg-[#050505] border-2 border-white/10 rounded-[5rem] overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,1)] group">
                            <div className="p-12 lg:px-16 border-b-2 border-white/5 flex justify-between items-center bg-white/[0.01] relative z-10">
                                <h2 className="flex items-center gap-8 font-black uppercase tracking-tighter text-4xl lg:text-5xl italic text-white/40 leading-none pl-4">
                                    <Activity size={48} className="text-[#ff6b2b] animate-pulse" strokeWidth={3} />
                                    Cognitive Nexus
                                </h2>
                                <div className="px-8 py-3 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[11px] text-[#ff6b2b] font-black uppercase tracking-[0.5em] italic leading-none animate-pulse">LIVE_SYNAPTIC_STREAM</div>
                            </div>
                            <div className="p-12 lg:p-16 space-y-10 max-h-[800px] overflow-y-auto custom-scrollbar relative z-10">
                                {cognitiveLogs.length === 0 ? (
                                    <div className="text-center py-40 space-y-8 opacity-20">
                                        <div className="w-24 h-24 border-2 border-white/10 rounded-full flex items-center justify-center mx-auto relative">
                                            <Radio size={48} className="animate-spin" />
                                            <div className="absolute inset-0 bg-[#ff6b2b]/10 blur-[40px] rounded-full animate-pulse" />
                                        </div>
                                        <p className="text-2xl font-black uppercase tracking-[0.8em] italic leading-none">Awaiting neural resonance...</p>
                                    </div>
                                ) : (
                                    cognitiveLogs.map((log) => (
                                        <div key={log.id} className="p-12 bg-black border-2 border-white/5 hover:border-[#ff6b2b]/30 rounded-[4rem] group/log transition-all relative overflow-hidden shadow-inner">
                                            <div className="absolute inset-y-0 left-0 w-2 bg-[#ff6b2b] scale-y-0 group-hover/log:scale-y-100 transition-transform origin-top" />
                                            
                                            <div className="flex justify-between items-center mb-10 relative z-10">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-16 h-16 bg-[#ff6b2b] border-4 border-black rounded-[1.5rem] flex items-center justify-center text-black font-black text-3xl shadow-[0_20px_40px_rgba(255,107,43,0.3)] italic">
                                                       {log.agent?.name?.charAt(0)}
                                                    </div>
                                                    <div className="space-y-2">
                                                       <span className="text-2xl font-black text-[#ff6b2b] uppercase tracking-tighter italic leading-none">
                                                          {log.agent?.name}
                                                       </span>
                                                       <div className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] italic leading-none">{log.agent?.type} // DEPLOYED_NODE</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                   <span className="text-[11px] font-black text-white/10 uppercase tracking-[0.4em] italic group-hover/log:text-white/20 transition-colors leading-none flex items-center gap-3">
                                                      <Clock size={16} /> {new Date(log.timestamp).toLocaleTimeString()}
                                                   </span>
                                                </div>
                                            </div>
                                            <p className="text-3xl text-white/40 italic font-light leading-relaxed group-hover/log:text-white transition-all duration-700 pl-2">"{log.thought}"</p>
                                            {log.intention && (
                                                <div className="mt-10 flex items-center gap-4 pl-2">
                                                    <div className="px-10 py-3 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[2rem] text-[11px] font-black text-[#ff6b2b] uppercase tracking-[0.6em] italic shadow-2xl leading-none animate-pulse">
                                                       PR_INTENTION: {log.intention}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* RESONANCE STREAM */}
                        <section className="bg-[#050505] border-2 border-white/10 rounded-[5rem] overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,1)] group">
                             <div className="p-12 lg:px-16 border-b-2 border-white/5 flex justify-between items-center bg-white/[0.01]">
                                <h2 className="flex items-center gap-8 font-black uppercase tracking-tighter text-4xl lg:text-5xl italic text-white/40 leading-none pl-4">
                                    <Zap size={48} className="text-[#ff6b2b]" strokeWidth={2.5} />
                                    Resonance Stream
                                </h2>
                                <div className="px-8 py-3 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[11px] text-[#ff6b2b] font-black uppercase tracking-[0.5em] italic leading-none animate-pulse">DIRECT_SURVEILLANCE_v7</div>
                            </div>
                            
                            <div className="p-12 lg:p-16 space-y-12 relative z-10">
                                {loading && items.length === 0 ? (
                                    <div className="text-center py-40 space-y-10 opacity-20">
                                        <Layers size={80} className="mx-auto animate-bounce" strokeWidth={1.5} />
                                        <p className="text-2xl font-black uppercase tracking-[1em] italic leading-none">Decrypting Neural Bus...</p>
                                    </div>
                                ) : error ? (
                                    <div className="p-20 text-red-500 font-black italic flex flex-col items-center gap-10 bg-red-500/5 rounded-[4rem] border-2 border-red-500/20 shadow-2xl">
                                        <ShieldBan size={100} className="animate-pulse" strokeWidth={2.5} />
                                        <span className="text-3xl uppercase tracking-[0.3em] font-black text-center leading-relaxed">{error}</span>
                                    </div>
                                ) : items.length === 0 ? (
                                    <div className="text-center py-40 space-y-10 opacity-20">
                                        <Target size={100} className="mx-auto" strokeWidth={1.5} />
                                        <p className="text-2xl font-black uppercase tracking-[1em] italic leading-none">No Synthetic Resonance Found</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-10">
                                        {items.map((item) => (
                                            <div key={item.id} className="p-12 lg:p-16 rounded-[5rem] bg-black border-2 border-white/5 hover:border-[#ff6b2b]/40 transition-all group relative overflow-hidden shadow-inner flex flex-col gap-10">
                                                <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-150 transition-transform duration-3000">
                                                   <Cpu size={250} className="text-[#ff6b2b]" />
                                                </div>
                                                <div className="absolute inset-y-0 left-0 w-2 bg-[#ff6b2b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />
                                                
                                                <div className="flex justify-between items-center relative z-20 w-full">
                                                    <div className="flex items-center gap-8">
                                                        <span className={`px-10 py-3 text-[11px] font-black uppercase tracking-[0.6em] rounded-full italic border-2 shadow-2xl leading-none ${item.type === 'bug' ? 'bg-red-500/10 text-red-500 border-red-500/40 shadow-red-500/10' : 'bg-[#ff6b2b]/10 text-[#ff6b2b] border-[#ff6b2b]/40 shadow-[#ff6b2b]/10 animate-pulse'}`}>
                                                            {item.type}
                                                        </span>
                                                        <div className="flex flex-col gap-1">
                                                           <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em] italic leading-none group-hover:text-white/20 transition-colors">
                                                              Detected_by_{item.foundBy || item.proposedBy}
                                                           </span>
                                                           <span className="text-[10px] text-[#ff6b2b]/40 font-black italic uppercase italic tracking-[0.2em]">{new Date(item.timestamp).toLocaleTimeString()} // SECTOR_G</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-12 h-12 bg-white/5 border-2 border-white/5 rounded-2xl flex items-center justify-center text-white/10 group-hover:text-[#ff6b2b] transition-all">
                                                       <Target size={24} strokeWidth={3} />
                                                    </div>
                                                </div>
                                                
                                                <p className="text-4xl lg:text-5xl text-white font-black italic leading-[1.1] tracking-tighter relative z-20 pl-2 pr-12">
                                                    {item.description || item.title}
                                                </p>
                                                
                                                <div className="flex flex-col lg:flex-row justify-between items-center gap-12 border-t-2 border-white/5 pt-12 relative z-20 pl-2">
                                                    <div className="w-full space-y-6">
                                                        <div className="flex justify-between text-[11px] font-black text-white/10 uppercase tracking-[0.6em] italic pl-1 leading-none">
                                                           <span>Resonance_Amplitude</span>
                                                           <span className="text-[#ff6b2b] animate-pulse">{Math.round((item.resonance || 0) * 100)}%</span>
                                                        </div>
                                                        <div className="w-full h-4 bg-black border-2 border-white/5 rounded-full overflow-hidden shadow-inner p-[2px]">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(item.resonance || 0) * 100}%` }}
                                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                                className={`h-full shadow-2xl rounded-full ${item.type === 'bug' ? 'bg-red-500 shadow-red-500/40' : 'bg-[#ff6b2b] shadow-[#ff6b2b]/40'}`}
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={() => handleResonate(item.type, item.id)}
                                                        className="px-16 py-8 bg-white text-black font-black uppercase tracking-[1em] text-[11px] rounded-[2.5rem] shadow-[0_40px_80px_rgba(255,255,255,0.1)] hover:bg-[#ff6b2b] hover:shadow-[0_40px_80px_rgba(255,107,43,0.3)] hover:scale-[1.05] active:scale-95 transition-all italic leading-none shrink-0 group/res"
                                                    >
                                                        Resonate 💠
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: TREASURY, EVOLUTION, MARKETPLACE */}
                    <div className="lg:col-span-4 space-y-16 lg:sticky lg:top-32 h-fit">
                        
                         {/* TREASURY MONITOR */}
                        {treasury && (
                            <section className="bg-[#050505] border-2 border-white/10 p-12 rounded-[5rem] backdrop-blur-3xl space-y-12 shadow-[0_80px_150px_rgba(0,0,0,1)] group hover:border-[#ff6b2b]/30 transition-all relative overflow-hidden shadow-inner">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-150 transition-transform duration-3000">
                                   <CreditCard size={250} className="text-[#ff6b2b]" />
                                </div>
                                <div className="flex items-center justify-between border-b-2 border-white/5 pb-10 relative z-10">
                                   <div className="text-[12px] font-black text-white/20 uppercase tracking-[1em] italic leading-none pl-2">TREASURY_SYNC</div>
                                   <div className="w-12 h-12 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/20 rounded-2xl flex items-center justify-center text-[#ff6b2b]">
                                      <ShieldCheck size={24} strokeWidth={3} className="animate-pulse" />
                                   </div>
                                </div>
                                <div className="space-y-8 relative z-10 pl-2">
                                    <div className="p-8 bg-black border-2 border-white/5 rounded-[3rem] flex justify-between items-center hover:border-white/20 transition-all group/asset shadow-inner">
                                        <div className="flex items-center gap-6">
                                           <div className="h-4 w-4 rounded-full bg-[#ff6b2b] animate-ping" />
                                           <span className="text-3xl font-black italic tracking-tighter text-white/40 group-hover/asset:text-white transition-colors">SOL</span>
                                        </div>
                                        <span className="text-4xl font-black text-white italic tracking-tighter font-mono">{treasury.sol?.balance.toFixed(4)}</span>
                                    </div>
                                    <div className="p-8 bg-black border-2 border-white/5 rounded-[3rem] flex justify-between items-center hover:border-white/20 transition-all group/asset shadow-inner">
                                        <div className="flex items-center gap-6">
                                           <div className="h-4 w-4 rounded-full bg-white/10 group-hover/asset:bg-[#ff6b2b] transition-colors" />
                                           <span className="text-3xl font-black italic tracking-tighter text-white/40 group-hover/asset:text-white transition-colors">BTC</span>
                                        </div>
                                        <span className="text-4xl font-black text-white italic tracking-tighter font-mono">{treasury.btc?.balance.toFixed(4)}</span>
                                    </div>
                                </div>
                                <div className="pt-6 flex items-center justify-center gap-4 text-[11px] font-black text-white/5 uppercase tracking-[0.6em] italic leading-none relative z-10">
                                    <Clock size={16} strokeWidth={3} /> Last_Sync: {new Date(treasury.timestamp).toLocaleTimeString()}
                                </div>
                            </section>
                        )}

                        {/* EVOLUTION MONITOR */}
                        <section className="bg-[#050505] border-2 border-white/10 p-12 rounded-[5rem] backdrop-blur-3xl space-y-12 shadow-[0_80px_150px_rgba(0,0,0,1)] group transition-all hover:border-[#ff6b2b]/30 overflow-hidden relative shadow-inner">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-150 transition-transform duration-3000">
                                <Activity size={250} className="text-[#ff6b2b]" />
                             </div>
                             <h2 className="text-[12px] font-black uppercase tracking-[1em] text-white/20 italic flex items-center gap-6 relative z-10 leading-none pl-2">
                                <Boxes size={24} className="text-[#ff6b2b]" strokeWidth={2.5} /> Evolution Monitor
                            </h2>
                            <div className="grid grid-cols-1 gap-6 relative z-10 pl-2 pr-2 overflow-y-auto max-h-[500px] custom-scrollbar">
                                {agents.filter(a => a.balance > 0 || a.level > 1).length === 0 ? (
                                    <div className="text-center py-20 text-[12px] font-black text-white/10 uppercase tracking-[1em] italic animate-pulse leading-none">
                                        Awaiting_autonomous_pulse...
                                    </div>
                                ) : (
                                    agents.filter(a => a.balance > 0 || a.level > 1).map((agent) => (
                                        <div key={agent.id} className="p-8 rounded-[3rem] bg-black border-2 border-white/5 flex justify-between items-center hover:border-white/20 transition-all group/agent shadow-inner">
                                            <div className="space-y-4">
                                                <div className="text-2xl font-black text-white/90 uppercase tracking-tighter italic group-hover/agent:text-white transition-colors leading-none">{agent.name}</div>
                                                <div className="text-[10px] text-white/10 font-black italic uppercase tracking-[0.4em] leading-none">{agent.title}</div>
                                            </div>
                                            <div className="text-right space-y-3">
                                                <div className="text-3xl font-black text-[#ff6b2b] italic tracking-tighter leading-none">Lv.{agent.level}</div>
                                                <div className="text-[10px] text-white/10 font-black uppercase italic leading-none">BAL: {agent.balance.toFixed(4)}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* MARKETPLACE FEED */}
                        <section className="bg-[#050505] border-2 border-white/10 p-12 rounded-[5rem] backdrop-blur-3xl space-y-12 shadow-[0_80px_150px_rgba(0,0,0,1)] group transition-all hover:border-[#ff6b2b]/30 relative overflow-hidden shadow-inner">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-150 transition-transform duration-3000">
                                <TrendingUp size={250} className="text-[#ff6b2b]" />
                             </div>
                             <h2 className="text-[12px] font-black uppercase tracking-[1em] text-white/20 italic flex items-center gap-6 pl-2 leading-none relative z-10">
                                <TrendingUp size={24} className="text-[#ff6b2b]" strokeWidth={2.5} /> Skill_Commerce
                            </h2>
                            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar relative z-10 pl-2">
                                {marketplaceItems.length === 0 ? (
                                    <div className="text-center py-20 text-[12px] font-black text-white/10 uppercase tracking-[1em] italic leading-none">
                                        No_recent_commerce_detection
                                    </div>
                                ) : (
                                    marketplaceItems.map((item) => (
                                        <div key={item.id} className="p-8 rounded-[3rem] bg-black border-2 border-white/5 hover:border-white/20 transition-all flex justify-between items-center shadow-inner group/item">
                                            <div className="space-y-4">
                                                <div className="text-xl font-black text-white/60 uppercase italic tracking-tighter group-hover/item:text-white transition-colors leading-none pr-4">{item.title}</div>
                                                <div className="text-[10px] text-white/10 italic uppercase tracking-[0.4em] line-clamp-1 leading-none">{item.description}</div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-3xl font-black text-[#ff6b2b] italic tracking-tighter leading-none">+{item.price}</div>
                                                <div className="text-[10px] text-white/10 font-black italic uppercase tracking-[0.2em] mt-2 leading-none">{item.status}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* COMMAND SECURITY BANNER */}
                        <div className="p-12 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[5rem] space-y-6 shadow-[0_40px_100px_rgba(255,107,43,0.1)] relative overflow-hidden group transition-all hover:shadow-[0_40px_100px_rgba(255,107,43,0.2)]">
                           <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b2b]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                           <div className="flex items-center gap-8 relative z-10">
                              <div className="w-16 h-16 bg-[#ff6b2b] rounded-2xl flex items-center justify-center text-black shadow-2xl transition-transform group-hover:scale-110">
                                 <ShieldCheck size={32} strokeWidth={3} className="animate-pulse" />
                              </div>
                              <div className="space-y-3">
                                 <div className="text-[12px] font-black uppercase tracking-[0.6em] italic text-[#ff6b2b] leading-none">Neural_Security_Active</div>
                                 <p className="text-[12px] text-white/30 italic leading-relaxed font-light">Direct hardware encryption enforced on all intelligence packets and cognitive logs.</p>
                              </div>
                           </div>
                        </div>

                    </div>
                </div>

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

            {/* BACKGROUND DECOR */}
            <div className="fixed bottom-0 right-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
                <div className="text-[30vw] font-black italic leading-none uppercase">INTEL</div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
                @keyframes scan {
                  from { transform: translateY(-100%); }
                  to { transform: translateY(1000%); }
                }
            `}</style>
        </div>
    );
}
