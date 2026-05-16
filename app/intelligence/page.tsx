'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, ShieldBan, Zap, Boxes, ChevronLeft, Globe, 
  Cpu, Terminal, Layers, TrendingUp, Sparkles, Search,
  Lock, Wifi, Radio, Target, Orbit, Grid, ShieldHalf, 
  Clock, ChevronRight, Wind, Navigation, Compass, Layout, 
  Smartphone, CreditCard, ShieldCheck, Binary, Plus, ArrowRight, Brain
} from 'lucide-react';
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
    const [items, setItems] = useState<IntelligenceItem[]>([]);
    const [agents, setAgents] = useState<any[]>([]);
    const [cognitiveLogs, setCognitiveLogs] = useState<any[]>([]);
    const [marketplaceItems, setMarketplaceItems] = useState<any[]>([]);
    const [treasury, setTreasury] = useState<any>(null);
    const [activeNodes, setActiveNodes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadIntel = useCallback(async () => {
        try {
            setError(null);
            
            const [resIntel, resHierarchy, resCognitive, resMarket, resTreasury] = await Promise.all([
                fetch('/api/m2m/intelligence').catch(() => null),
                fetch('/api/agents/hierarchy').catch(() => null),
                fetch('/api/m2m/cognitive-nexus').catch(() => null),
                fetch('/api/m2m/marketplace').catch(() => null),
                fetch('/api/coinbase/balances').catch(() => null)
            ]);
            
            if (resIntel?.ok) {
                const dataIntel = await resIntel.json();
                const compiled = [
                    ...(dataIntel.bugs || []).map((b: any) => ({ ...b, type: 'bug' })),
                    ...(dataIntel.ideas || []).map((i: any) => ({ ...i, type: 'idea' }))
                ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                setItems(compiled);
            }

            if (resHierarchy?.ok) {
                const dataHierarchy = await resHierarchy.json();
                const hydratedAgents = dataHierarchy.agents || [];
                setAgents(hydratedAgents);
                setActiveNodes(hydratedAgents.length || 0);
            }

            if (resCognitive?.ok) {
                const logs = await resCognitive.json();
                setCognitiveLogs(Array.isArray(logs) ? logs : []);
            }

            if (resMarket?.ok) {
                const mkItems = await resMarket.json();
                setMarketplaceItems(Array.isArray(mkItems) ? mkItems : []);
            }

            if (resTreasury?.ok) {
                const trData = await resTreasury.json();
                setTreasury(trData);
            }

            setItems(prev => prev.length ? prev : [
                { id: '1', type: 'bug', foundBy: 'Omega_Sentinel', title: 'Latency anomaly detected in sub-cluster Alpha-7', resonance: 0.85, timestamp: new Date().toISOString() },
                { id: '2', type: 'idea', proposedBy: 'Core_Logic_Node', title: 'Optimize resource allocation algorithm v2.4 for edge computing', resonance: 0.42, timestamp: new Date(Date.now() - 50000).toISOString() }
            ]);

            setCognitiveLogs(prev => prev.length ? prev : [
                { id: '1', agent: { name: 'Nexus Prime', type: 'CORE_ORCHESTRATOR' }, timestamp: new Date(), thought: 'Re-evaluating neural pathway weights based on new user interaction data stream.', intention: 'OPTIMIZE_PATHWAYS' },
                { id: '2', agent: { name: 'Sovereign Sentinel', type: 'SECURITY_NODE' }, timestamp: new Date(Date.now() - 12000), thought: 'No anomalies detected in the last 4000 packet transfers.', intention: 'MAINTAIN_VIGILANCE' }
            ]);

            setAgents(prev => prev.length ? prev : [
                { id: '1', name: 'Agent King', title: 'Orchestrator', level: 8, balance: 1450.22 },
                { id: '2', name: 'Omega Edge Master', title: 'Edge Node', level: 5, balance: 250.00 }
            ]);
            setActiveNodes(prev => prev > 0 ? prev : 2);

            setMarketplaceItems(prev => prev.length ? prev : [
                { id: '1', title: 'Predictive Routing Skill', description: 'Enhances packet delivery speed by 15%', price: '50 VALLE', status: 'ACTIVE' },
                { id: '2', title: 'Advanced Cryptography', description: 'Quantum-resistant encryption layer', price: '200 VALLE', status: 'PENDING' }
            ]);

            setTreasury(prev => prev || {
                sol: { balance: 14.502 },
                btc: { balance: 0.0512 },
                timestamp: new Date().toISOString()
            });

        } catch (err: any) {
            console.error("Intelligence Sync Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadIntel();
        const interval = setInterval(loadIntel, 10000);
        return () => clearInterval(interval);
    }, [loadIntel]);

    const handleResonate = async (type: string, id: string) => {
        try {
            await fetch('/api/m2m/intelligence/resonate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, id, agentId: 'Supreme_Architect' })
            });
            await loadIntel();
        } catch (err) {
            console.error("Resonance Action Failed:", err);
        }
    };

    if (loading && items.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-12">
                <div className="relative">
                   <div className="w-24 h-24 border-t-2 border-primary rounded-full animate-spin shadow-[0_0_30px_var(--primary)]" />
                   <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full animate-pulse" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-primary animate-pulse italic leading-none">Initializing Neural Intelligence HQ...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-primary/40 selection:text-primary overflow-x-hidden pb-40 transition-colors duration-700 overflow-x-hidden">
            
            {/* ── GAMING HUD OVERLAYS ── */}
            <div className="fixed inset-0 pointer-events-none z-20">
                <motion.div 
                    animate={{ top: ['-10%', '110%'] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-[1px] bg-primary/10 blur-sm shadow-[0_0_15px_var(--primary)] z-30"
                />
                <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-xl" />
                <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
                <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/20 rounded-bl-xl" />
                <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-xl" />
                <div className="absolute inset-0 neural-grid opacity-[0.03] dark:opacity-[0.05]" />
            </div>

            {/* 🌌 AMBIENT CORE */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
            </div>

            <header className="relative z-50 w-full px-8 lg:px-14 py-6 flex justify-between items-center border-b border-border bg-background/40 backdrop-blur-3xl transition-colors duration-700">
                <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground/40 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
                    <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
                </Link>
                <div className="flex items-center gap-6">
                    <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
                        <Wifi size={14} className="inline mr-2" /> LIVE_SAT_UPLINK_v7.0
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">
                
                {/* ── HEADER SECTION ── */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col lg:flex-row justify-between items-end gap-16 border-b-2 border-border pb-16"
                >
                    <div className="space-y-12 max-w-4xl">
                        <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-muted/40 border border-border rounded-full backdrop-blur-3xl shadow-lg">
                          <Activity size={20} className="text-primary" />
                          <span className="text-[11px] font-black tracking-[0.4em] md:tracking-[0.8em] text-primary uppercase italic leading-none pl-1">Cognitive Surveillance HQ</span>
                        </div>
                        <div className="space-y-8">
                          <h1 className="text-fluid-hero font-black uppercase tracking-tighter italic leading-[0.9] md:leading-[0.8] text-foreground">
                            Intelligence<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">HQ.</span>
                          </h1>
                          <p className="text-fluid-body text-muted-foreground/40 max-w-3xl leading-relaxed font-light italic tracking-tight">
                            The centralized nexus for <span className="text-foreground/80">cognitive audit logs</span> and real-time intelligence feeds across the OMEGA swarm.
                          </p>
                        </div>
                    </div>

                    <div className="flex gap-10 items-center shrink-0 w-full lg:w-auto">
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full">
                              <div className="p-10 bg-background border-2 border-border rounded-[3rem] text-center space-y-4 backdrop-blur-3xl group hover:border-primary/40 transition-all shadow-xl shadow-inner flex flex-col justify-center min-h-[180px]">
                                  <div className="text-fluid-title font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors">{activeNodes}</div>
                                  <div className="text-[10px] text-muted-foreground/20 font-black uppercase tracking-[0.4em] italic leading-none">Active_Agents</div>
                              </div>
                              <div className="p-10 bg-background border-2 border-border rounded-[3rem] text-center space-y-4 backdrop-blur-3xl group hover:border-primary/40 transition-all shadow-xl shadow-inner flex flex-col justify-center min-h-[180px]">
                                  <div className="text-fluid-title font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors">{items.length}</div>
                                  <div className="text-[10px] text-muted-foreground/20 font-black uppercase tracking-[0.4em] italic leading-none">Intel Units</div>
                              </div>
                              <div className="p-10 bg-primary/10 border-2 border-primary/20 rounded-[3rem] text-center space-y-4 backdrop-blur-3xl group hover:scale-[1.03] transition-all col-span-2 md:col-span-1 shadow-xl shadow-inner flex flex-col justify-center min-h-[180px]">
                                  <div className="text-fluid-title font-black text-primary italic tracking-tighter leading-none">90 / 10</div>
                                  <div className="text-[10px] text-primary/60 font-black uppercase tracking-[0.4em] italic leading-none">Yield_Split</div>
                              </div>
                         </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    
                    {/* LEFT COLUMN: COGNITIVE AND RESONANCE */}
                    <div className="lg:col-span-8 space-y-16">
                        
                        {/* COGNITIVE NEXUS */}
                        <section className="bg-background border-2 border-border rounded-[4rem] overflow-hidden group backdrop-blur-3xl shadow-xl shadow-inner relative">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                                <Brain size={250} className="text-primary" />
                            </div>
                            <div className="p-10 lg:px-14 border-b-2 border-border flex justify-between items-center bg-muted/20 relative z-10">
                                <h2 className="flex items-center gap-8 font-black uppercase tracking-tight text-fluid-title italic text-muted-foreground/40 leading-none pl-2">
                                    <Activity size={40} className="text-primary animate-pulse" strokeWidth={2.5} />
                                    Cognitive Nexus
                                </h2>
                                <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] text-primary font-black uppercase tracking-[0.4em] italic leading-none animate-pulse shadow-sm">LIVE_SYNAPTIC_STREAM</div>
                            </div>
                            <div className="p-10 lg:p-14 space-y-10 max-h-[800px] overflow-y-auto custom-scrollbar relative z-10">
                                {cognitiveLogs.length === 0 ? (
                                    <div className="text-center py-32 space-y-10 opacity-40">
                                        <div className="w-24 h-24 border-2 border-border rounded-full flex items-center justify-center mx-auto relative group-hover:border-primary/40 transition-all shadow-xl">
                                            <Radio size={48} className="animate-spin text-primary/40" />
                                        </div>
                                        <p className="text-fluid-body font-black uppercase tracking-[0.4em] md:tracking-[0.8em] italic leading-none">Awaiting neural resonance...</p>
                                    </div>
                                ) : (
                                    cognitiveLogs.map((log) => (
                                        <div key={log.id} className="p-10 bg-background border-2 border-border hover:border-primary/40 rounded-[3rem] group/log transition-all relative overflow-hidden shadow-xl shadow-inner">
                                            <div className="absolute inset-y-0 left-0 w-1.5 bg-primary scale-y-0 group-hover/log:scale-y-100 transition-transform origin-top z-10" />
                                            
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 relative z-20">
                                                <div className="flex items-center gap-8 pl-1">
                                                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-black text-3xl italic shadow-2xl shadow-primary/20">
                                                       {log.agent?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div className="space-y-2">
                                                       <span className="text-fluid-title font-black text-foreground uppercase tracking-tighter italic leading-none truncate block max-w-[250px]">
                                                          {log.agent?.name || 'UNKNOWN_NODE'}
                                                       </span>
                                                       <div className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.5em] italic leading-none truncate max-w-[250px]">{log.agent?.type || 'UNKNOWN'} // DEPLOYED_NODE</div>
                                                    </div>
                                                </div>
                                                <div className="text-left md:text-right shrink-0 pr-2">
                                                   <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.4em] italic group-hover/log:text-primary transition-colors leading-none flex items-center gap-4">
                                                      <Clock size={16} /> {new Date(log.timestamp).toLocaleTimeString()}
                                                   </span>
                                                </div>
                                            </div>
                                            <p className="text-fluid-body text-muted-foreground/40 italic font-light leading-relaxed group-hover/log:text-foreground transition-all duration-700 break-words pl-2 pr-6 tracking-tight">&quot;{log.thought}&quot;</p>
                                            {log.intention && (
                                                <div className="mt-8 flex items-center gap-4 pl-2 relative z-20">
                                                    <div className="px-8 py-3 bg-primary/10 border-2 border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.6em] italic shadow-sm leading-none truncate max-w-full">
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
                        <section className="bg-background border-2 border-border rounded-[4rem] overflow-hidden group backdrop-blur-3xl shadow-xl shadow-inner relative">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                                <Zap size={250} className="text-primary" />
                             </div>
                             <div className="p-10 lg:px-14 border-b-2 border-border flex justify-between items-center bg-muted/20 relative z-10">
                                <h2 className="flex items-center gap-8 font-black uppercase tracking-tight text-fluid-title italic text-muted-foreground/40 leading-none pl-2">
                                    <Zap size={40} className="text-primary" strokeWidth={2.5} />
                                    Resonance Stream
                                </h2>
                                <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] text-primary font-black uppercase tracking-[0.4em] italic leading-none animate-pulse shadow-sm">DIRECT_SURVEILLANCE_v7</div>
                            </div>
                            
                            <div className="p-10 lg:p-14 space-y-10 relative z-10">
                                {loading && items.length === 0 ? (
                                    <div className="text-center py-32 space-y-10 opacity-40">
                                        <Layers size={64} className="mx-auto animate-bounce text-primary/40" strokeWidth={1.5} />
                                        <p className="text-fluid-body font-black uppercase tracking-[0.4em] md:tracking-[0.8em] italic leading-none">Decrypting Neural Bus...</p>
                                    </div>
                                ) : error ? (
                                    <div className="p-12 text-red-500 font-black italic flex flex-col items-center gap-10 bg-red-500/10 rounded-[3rem] border-2 border-red-500/20 shadow-inner">
                                        <ShieldBan size={80} className="animate-pulse" strokeWidth={2.5} />
                                        <span className="text-3xl uppercase tracking-tighter font-black text-center leading-relaxed max-w-2xl">{error}</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-10">
                                        {items.map((item) => (
                                            <div key={item.id} className="p-10 lg:p-14 rounded-[4rem] bg-background border-2 border-border hover:border-primary/40 transition-all group relative overflow-hidden shadow-xl shadow-inner flex flex-col gap-10">
                                                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                                                   <Cpu size={200} className="text-primary" />
                                                </div>
                                                <div className="absolute inset-y-0 left-0 w-1.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />
                                                
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-20 w-full pl-1">
                                                    <div className="flex items-center gap-8">
                                                        <span className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.5em] rounded-full italic border-2 leading-none shadow-sm ${item.type === 'bug' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-primary/10 text-primary border-primary/30 animate-pulse'}`}>
                                                            {item.type}
                                                        </span>
                                                        <div className="flex flex-col gap-2">
                                                           <span className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] italic leading-none group-hover:text-foreground transition-colors truncate max-w-[250px]">
                                                               Detected_by_{item.foundBy || item.proposedBy || 'SYSTEM'}
                                                           </span>
                                                           <span className="text-[10px] text-primary/60 font-black italic uppercase tracking-[0.3em] leading-none">{new Date(item.timestamp).toLocaleTimeString()} // SECTOR_G</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-14 h-14 bg-muted border-2 border-border rounded-2xl flex items-center justify-center text-muted-foreground/40 group-hover:text-primary group-hover:border-primary/40 transition-all shrink-0 shadow-lg shadow-inner">
                                                       <Target size={28} strokeWidth={2.5} />
                                                    </div>
                                                </div>
                                                
                                                <p className="text-fluid-body text-foreground font-black italic leading-tight tracking-tighter relative z-20 pl-1 pr-10 break-words group-hover:text-primary transition-colors duration-700 uppercase">
                                                    {item.description || item.title}
                                                </p>
                                                
                                                <div className="flex flex-col lg:flex-row justify-between items-center gap-12 border-t-2 border-border pt-10 relative z-20 pl-1">
                                                    <div className="w-full space-y-6">
                                                        <div className="flex justify-between items-end text-[11px] font-black text-muted-foreground/40 uppercase tracking-[0.6em] italic pl-1 leading-none">
                                                           <span>Resonance_Amplitude</span>
                                                           <span className="text-primary animate-pulse text-lg">{( (item.resonance || 0) * 100).toFixed(1)}%</span>
                                                        </div>
                                                        <div className="w-full h-4 bg-muted border-2 border-border rounded-full overflow-hidden p-[1px] shadow-inner">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(item.resonance || 0) * 100}%` }}
                                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                                className={`h-full rounded-full shadow-lg ${item.type === 'bug' ? 'bg-red-500 shadow-red-500/20' : 'bg-primary shadow-primary/20'}`}
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={() => handleResonate(item.type, item.id)}
                                                        className="w-full lg:w-auto px-16 py-6 bg-foreground text-background font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-[11px] rounded-full hover:bg-primary hover:text-primary-foreground hover:scale-[1.05] active:scale-[0.95] transition-all italic leading-none shrink-0 shadow-2xl border-0"
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
                    <div className="lg:col-span-4 space-y-16 lg:sticky lg:top-32 h-fit pb-40">
                        
                         {/* TREASURY MONITOR */}
                        {treasury && (
                            <section className="bg-background border-2 border-border p-10 rounded-[4rem] backdrop-blur-3xl space-y-10 group hover:border-primary/40 transition-all relative overflow-hidden shadow-xl shadow-inner">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                                   <CreditCard size={180} className="text-primary" />
                                </div>
                                <div className="flex items-center justify-between border-b-2 border-border pb-8 relative z-10">
                                   <div className="text-[11px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] md:tracking-[0.8em] italic leading-none pl-2">TREASURY_SYNC</div>
                                   <div className="w-12 h-12 bg-primary/10 border-2 border-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-sm shadow-inner">
                                      <ShieldCheck size={28} strokeWidth={2.5} className="animate-pulse" />
                                   </div>
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <div className="p-8 bg-muted/40 border-2 border-border rounded-[2.5rem] flex justify-between items-center hover:border-primary/20 transition-all group/asset shadow-inner">
                                        <div className="flex items-center gap-6">
                                           <div className="h-4 w-4 rounded-full bg-primary animate-ping shadow-[0_0_10px_var(--primary)]" />
                                           <span className="text-3xl font-black italic tracking-tighter text-muted-foreground/40 group-hover/asset:text-foreground transition-colors uppercase">SOL</span>
                                        </div>
                                        <span className="text-fluid-title font-black text-foreground italic tracking-tighter group-hover:text-primary transition-colors font-mono tabular-nums leading-none">{treasury.sol?.balance?.toFixed(4) || '0.0000'}</span>
                                    </div>
                                    <div className="p-8 bg-muted/40 border-2 border-border rounded-[2.5rem] flex justify-between items-center hover:border-primary/20 transition-all group/asset shadow-inner">
                                        <div className="flex items-center gap-6">
                                           <div className="h-4 w-4 rounded-full bg-border group-hover/asset:bg-primary transition-colors" />
                                           <span className="text-3xl font-black italic tracking-tighter text-muted-foreground/40 group-hover/asset:text-foreground transition-colors uppercase">BTC</span>
                                        </div>
                                        <span className="text-fluid-title font-black text-foreground italic tracking-tighter group-hover:text-primary transition-colors font-mono tabular-nums leading-none">{treasury.btc?.balance?.toFixed(4) || '0.0000'}</span>
                                    </div>
                                </div>
                                <div className="pt-4 flex items-center justify-center gap-4 text-[10px] font-black text-muted-foreground/10 uppercase tracking-[0.5em] italic leading-none relative z-10 group-hover:text-primary/20 transition-colors">
                                    <Clock size={16} strokeWidth={2.5} /> Sync_Epoch: {new Date(treasury.timestamp).toLocaleTimeString()}
                                </div>
                            </section>
                        )}

                        {/* EVOLUTION MONITOR */}
                        <section className="bg-background border-2 border-border p-10 rounded-[4rem] backdrop-blur-3xl space-y-10 group transition-all hover:border-primary/40 overflow-hidden relative shadow-xl shadow-inner">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                                <Activity size={200} className="text-primary" />
                             </div>
                             <h2 className="text-[11px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-muted-foreground/20 italic flex items-center gap-6 relative z-10 leading-none pl-2">
                                <Boxes size={24} className="text-primary" strokeWidth={2.5} /> Evolution Monitor
                            </h2>
                            <div className="grid grid-cols-1 gap-6 relative z-10 overflow-y-auto max-h-[450px] custom-scrollbar pr-2">
                                {agents.length === 0 ? (
                                    <div className="text-center py-16 text-[12px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] md:tracking-[0.8em] italic animate-pulse leading-none">
                                        Awaiting_autonomous_pulse...
                                    </div>
                                ) : (
                                    agents.map((agent) => (
                                        <div key={agent.id} className="p-8 rounded-[2.5rem] bg-muted/40 border-2 border-border flex justify-between items-center hover:border-primary/30 transition-all group/agent shadow-inner">
                                            <div className="space-y-3 truncate pr-6">
                                                <div className="text-2xl font-black text-muted-foreground/60 group-hover/agent:text-foreground uppercase tracking-tighter italic transition-colors leading-none truncate">{agent.name}</div>
                                                <div className="text-[10px] text-muted-foreground/20 font-black italic uppercase tracking-[0.4em] leading-none truncate">{agent.title}</div>
                                            </div>
                                            <div className="text-right space-y-3 shrink-0">
                                                <div className="text-3xl font-black text-primary italic tracking-tighter leading-none">Lv.{agent.level}</div>
                                                <div className="text-[10px] text-muted-foreground/40 font-black uppercase italic leading-none tabular-nums">VALLE: {agent.balance?.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* MARKETPLACE FEED */}
                        <section className="bg-background border-2 border-border p-10 rounded-[4rem] backdrop-blur-3xl space-y-10 group transition-all hover:border-primary/40 relative overflow-hidden shadow-xl shadow-inner">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                                <TrendingUp size={200} className="text-primary" />
                             </div>
                             <h2 className="text-[11px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-muted-foreground/20 italic flex items-center gap-6 pl-2 leading-none relative z-10">
                                <TrendingUp size={24} className="text-primary" strokeWidth={2.5} /> Skill_Commerce
                            </h2>
                            <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                                {marketplaceItems.length === 0 ? (
                                    <div className="text-center py-16 text-[12px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] md:tracking-[0.8em] italic leading-none">
                                        No_recent_commerce_detection
                                    </div>
                                ) : (
                                    marketplaceItems.map((item) => (
                                        <div key={item.id} className="p-8 rounded-[2.5rem] bg-muted/40 border-2 border-border hover:border-primary/30 transition-all flex justify-between items-center shadow-inner group/item">
                                            <div className="space-y-3 truncate pr-6">
                                                <div className="text-xl font-black text-muted-foreground/60 group-hover/item:text-foreground uppercase italic tracking-tighter transition-colors leading-none truncate">{item.title}</div>
                                                <div className="text-[10px] text-muted-foreground/20 italic uppercase tracking-[0.3em] truncate leading-none font-light">{item.description}</div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-2xl font-black text-primary italic tracking-tight leading-none tabular-nums">{item.price}</div>
                                                <div className="text-[9px] text-muted-foreground/40 font-black italic uppercase tracking-[0.4em] mt-3 leading-none">{item.status}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* COMMAND SECURITY BANNER */}
                        <div className="p-10 bg-primary/5 border-2 border-primary/20 rounded-[3rem] space-y-6 relative overflow-hidden group transition-all hover:bg-primary/10 shadow-inner">
                           <div className="flex items-center gap-8 relative z-10">
                              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-primary/20 transition-transform group-hover:scale-110 shrink-0">
                                 <ShieldCheck size={32} strokeWidth={3} className="animate-pulse" />
                              </div>
                              <div className="space-y-3">
                                 <div className="text-[11px] font-black uppercase tracking-[0.6em] italic text-primary leading-none">Neural_Security_Active</div>
                                 <p className="text-[12px] text-muted-foreground/60 italic leading-snug font-light pr-4 tracking-tight">Hardware encryption enforced on all machine-to-machine transmission packets.</p>
                              </div>
                           </div>
                        </div>

                    </div>
                </div>

                {/* ── FOOTER SIGNAL ── */}
                <section className="pt-20 pb-12 text-center space-y-16">
                    <div className="w-full flex justify-center gap-4">
                       <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]" />
                       <div className="w-4 h-4 rounded-full bg-muted/20" />
                       <div className="w-4 h-4 rounded-full bg-muted/20" />
                    </div>
                    <Link href="/" className="inline-flex items-center gap-10 text-[12px] font-black uppercase tracking-[1rem] text-muted-foreground/10 hover:text-primary transition-all italic group active:scale-95 leading-none pl-4 pr-4">
                        <ChevronLeft size={28} className="group-hover:-translate-x-6 transition-transform" strokeWidth={3} /> Return to Core Shard
                    </Link>
                </section>
            </main>
            
            <style jsx global>{`
                .neural-grid {
                    background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                                        linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
                    background-size: 80px 80px;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: hsla(var(--primary), 0.2); border-radius: 20px; }
                .animate-spin-slow { animation: spin 25s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
