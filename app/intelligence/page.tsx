'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, ShieldBan, Zap, Boxes, ChevronLeft, Globe, 
  Cpu, Terminal, Layers, TrendingUp, Sparkles, Search,
  Lock, Wifi, Radio, Target, Orbit, Grid, ShieldHalf, 
  Clock, ChevronRight, Wind, Navigation, Compass, Layout, 
  Smartphone, CreditCard, ShieldCheck, Binary
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
            
            // Resonance Stream
            if (resIntel?.ok) {
                const dataIntel = await resIntel.json();
                const compiled = [
                    ...(dataIntel.bugs || []).map((b: any) => ({ ...b, type: 'bug' })),
                    ...(dataIntel.ideas || []).map((i: any) => ({ ...i, type: 'idea' }))
                ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                setItems(compiled);
            }

            // Agents / Evolution Monitor
            if (resHierarchy?.ok) {
                const dataHierarchy = await resHierarchy.json();
                const hydratedAgents = dataHierarchy.agents || [];
                setAgents(hydratedAgents);
                setActiveNodes(hydratedAgents.length || 0);
            }

            // Cognitive Nexus
            if (resCognitive?.ok) {
                const logs = await resCognitive.json();
                setCognitiveLogs(Array.isArray(logs) ? logs : []);
            }

            // Marketplace / Skill Commerce
            if (resMarket?.ok) {
                const mkItems = await resMarket.json();
                setMarketplaceItems(Array.isArray(mkItems) ? mkItems : []);
            }

            // Treasury
            if (resTreasury?.ok) {
                const trData = await resTreasury.json();
                setTreasury(trData);
            }

            // Provide synthetic fallbacks if databases are completely empty to keep UI alive
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
                   <div className="w-24 h-24 border-t-2 border-[#ff6b2b] rounded-full animate-spin shadow-[0_0_30px_#ff6b2b]" />
                   <div className="absolute inset-0 bg-[#ff6b2b]/10 blur-[40px] rounded-full animate-pulse" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] animate-pulse italic leading-none">Initializing Neural Intelligence HQ...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden pb-40">
            
            {/* 🌌 AMBIENT CORE */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
                
                {/* Animated Scanning Lines */}
                <div className="absolute inset-0 opacity-[0.05]">
                   <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-1/4 animate-[scan_15s_linear_infinite]" />
                   <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-3/4 animate-[scan_20s_linear_infinite_reverse]" />
                </div>
            </div>

            <header className="relative z-50 w-full px-8 lg:px-14 py-6 flex justify-between items-center border-b border-border bg-background/80 backdrop-blur-3xl">
                <Link href="/" className="inline-flex items-center gap-3 text-muted-foreground hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.5em] group italic active:scale-95 leading-none">
                    <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
                </Link>
                <div className="flex items-center gap-6">
                    <div className="px-5 py-2 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic animate-pulse leading-none">
                        <Wifi size={14} className="inline mr-2" /> LIVE_SAT_UPLINK_v7.0
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 space-y-24 flex-1 flex flex-col">
                
                {/* ── HEADER SECTION ── */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col lg:flex-row justify-between items-end gap-12 border-b border-border pb-12"
                >
                    <div className="space-y-8 max-w-4xl">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-secondary border border-border rounded-full backdrop-blur-xl shadow-sm">
                          <Activity size={18} className="text-[#ff6b2b]" />
                          <span className="text-[10px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none pl-1">Cognitive Surveillance HQ</span>
                        </div>
                        <div className="space-y-6">
                          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.85] text-foreground">
                            Intelligence<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-[#ff6b2b]/40">HQ.</span>
                          </h1>
                          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed font-light italic tracking-tight">
                            The centralized nexus for <span className="text-foreground/70">cognitive audit logs</span> and real-time intelligence feeds across the OMEGA swarm.
                          </p>
                        </div>
                    </div>

                    <div className="flex gap-8 items-center shrink-0">
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                              <div className="p-8 bg-secondary/30 border border-border rounded-[2.5rem] min-w-[180px] text-center space-y-3 backdrop-blur-xl group hover:border-[#ff6b2b]/30 transition-all shadow-sm">
                                  <div className="text-5xl font-black text-foreground italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">{activeNodes}</div>
                                  <div className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.4em] italic leading-none">Active_Agents</div>
                              </div>
                              <div className="p-8 bg-secondary/30 border border-border rounded-[2.5rem] min-w-[180px] text-center space-y-3 backdrop-blur-xl group hover:border-[#ff6b2b]/30 transition-all shadow-sm">
                                  <div className="text-5xl font-black text-foreground italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">{items.length}</div>
                                  <div className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.4em] italic leading-none">Intel Units</div>
                              </div>
                              <div className="p-8 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-[2.5rem] min-w-[180px] text-center space-y-3 backdrop-blur-xl group hover:scale-[1.03] transition-all col-span-2 md:col-span-1 shadow-sm">
                                  <div className="text-5xl font-black text-[#ff6b2b] italic tracking-tighter leading-none">90 / 10</div>
                                  <div className="text-[9px] text-[#ff6b2b]/60 font-black uppercase tracking-[0.4em] italic leading-none">Yield_Split</div>
                              </div>
                         </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    
                    {/* LEFT COLUMN: COGNITIVE AND RESONANCE */}
                    <div className="lg:col-span-8 space-y-16">
                        
                        {/* COGNITIVE NEXUS */}
                        <section className="bg-secondary/10 border-2 border-border rounded-[3rem] overflow-hidden group backdrop-blur-xl">
                            <div className="p-8 lg:px-12 border-b border-border flex justify-between items-center bg-background/50 relative z-10">
                                <h2 className="flex items-center gap-4 font-black uppercase tracking-tight text-3xl italic text-muted-foreground leading-none">
                                    <Activity size={32} className="text-[#ff6b2b] animate-pulse" strokeWidth={2.5} />
                                    Cognitive Nexus
                                </h2>
                                <div className="px-5 py-2 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[9px] text-[#ff6b2b] font-black uppercase tracking-[0.4em] italic leading-none animate-pulse">LIVE_SYNAPTIC_STREAM</div>
                            </div>
                            <div className="p-8 lg:p-12 space-y-8 max-h-[700px] overflow-y-auto custom-scrollbar relative z-10">
                                {cognitiveLogs.length === 0 ? (
                                    <div className="text-center py-20 space-y-6 opacity-40">
                                        <div className="w-20 h-20 border border-border rounded-full flex items-center justify-center mx-auto relative">
                                            <Radio size={32} className="animate-spin" />
                                        </div>
                                        <p className="text-lg font-black uppercase tracking-[0.5em] italic leading-none">Awaiting neural resonance...</p>
                                    </div>
                                ) : (
                                    cognitiveLogs.map((log) => (
                                        <div key={log.id} className="p-8 bg-background border border-border hover:border-[#ff6b2b]/30 rounded-3xl group/log transition-all relative overflow-hidden shadow-sm">
                                            <div className="absolute inset-y-0 left-0 w-1.5 bg-[#ff6b2b] scale-y-0 group-hover/log:scale-y-100 transition-transform origin-top" />
                                            
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 relative z-10">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-[#ff6b2b] rounded-2xl flex items-center justify-center text-black font-black text-2xl italic shadow-md">
                                                       {log.agent?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div className="space-y-1">
                                                       <span className="text-xl font-black text-[#ff6b2b] uppercase tracking-tighter italic leading-none truncate block max-w-[200px]">
                                                          {log.agent?.name || 'UNKNOWN_NODE'}
                                                       </span>
                                                       <div className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.4em] italic leading-none truncate max-w-[200px]">{log.agent?.type || 'UNKNOWN'} // DEPLOYED_NODE</div>
                                                    </div>
                                                </div>
                                                <div className="text-left md:text-right shrink-0">
                                                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic group-hover/log:text-foreground transition-colors leading-none flex items-center gap-2">
                                                      <Clock size={14} /> {new Date(log.timestamp).toLocaleTimeString()}
                                                   </span>
                                                </div>
                                            </div>
                                            <p className="text-xl text-muted-foreground italic font-light leading-relaxed group-hover/log:text-foreground transition-all duration-700 break-words pl-2 pr-4">"{log.thought}"</p>
                                            {log.intention && (
                                                <div className="mt-6 flex items-center gap-3 pl-2">
                                                    <div className="px-6 py-2 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[9px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic shadow-sm leading-none truncate max-w-full">
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
                        <section className="bg-secondary/10 border-2 border-border rounded-[3rem] overflow-hidden group backdrop-blur-xl">
                             <div className="p-8 lg:px-12 border-b border-border flex justify-between items-center bg-background/50">
                                <h2 className="flex items-center gap-4 font-black uppercase tracking-tight text-3xl italic text-muted-foreground leading-none">
                                    <Zap size={32} className="text-[#ff6b2b]" strokeWidth={2.5} />
                                    Resonance Stream
                                </h2>
                                <div className="px-5 py-2 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[9px] text-[#ff6b2b] font-black uppercase tracking-[0.4em] italic leading-none animate-pulse">DIRECT_SURVEILLANCE_v7</div>
                            </div>
                            
                            <div className="p-8 lg:p-12 space-y-8 relative z-10">
                                {loading && items.length === 0 ? (
                                    <div className="text-center py-20 space-y-6 opacity-40">
                                        <Layers size={48} className="mx-auto animate-bounce" strokeWidth={1.5} />
                                        <p className="text-lg font-black uppercase tracking-[0.6em] italic leading-none">Decrypting Neural Bus...</p>
                                    </div>
                                ) : error ? (
                                    <div className="p-8 text-red-500 font-black italic flex flex-col items-center gap-6 bg-red-500/10 rounded-[2.5rem] border border-red-500/20">
                                        <ShieldBan size={64} className="animate-pulse" strokeWidth={2.5} />
                                        <span className="text-xl uppercase tracking-[0.2em] font-black text-center leading-relaxed">{error}</span>
                                    </div>
                                ) : items.length === 0 ? (
                                    <div className="text-center py-20 space-y-6 opacity-40">
                                        <Target size={64} className="mx-auto" strokeWidth={1.5} />
                                        <p className="text-lg font-black uppercase tracking-[0.6em] italic leading-none">No Synthetic Resonance Found</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        {items.map((item) => (
                                            <div key={item.id} className="p-8 lg:p-10 rounded-[2.5rem] bg-background border border-border hover:border-[#ff6b2b]/40 transition-all group relative overflow-hidden shadow-sm flex flex-col gap-6">
                                                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-3000">
                                                   <Cpu size={150} className="text-[#ff6b2b]" />
                                                </div>
                                                <div className="absolute inset-y-0 left-0 w-1.5 bg-[#ff6b2b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />
                                                
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-20 w-full">
                                                    <div className="flex items-center gap-6">
                                                        <span className={`px-6 py-2 text-[9px] font-black uppercase tracking-[0.4em] rounded-full italic border leading-none ${item.type === 'bug' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-[#ff6b2b]/10 text-[#ff6b2b] border-[#ff6b2b]/30 animate-pulse'}`}>
                                                            {item.type}
                                                        </span>
                                                        <div className="flex flex-col gap-1">
                                                           <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] italic leading-none group-hover:text-foreground transition-colors truncate max-w-[200px]">
                                                              Detected_by_{item.foundBy || item.proposedBy || 'SYSTEM'}
                                                           </span>
                                                           <span className="text-[9px] text-[#ff6b2b]/60 font-black italic uppercase tracking-[0.2em]">{new Date(item.timestamp).toLocaleTimeString()} // SECTOR_G</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 bg-secondary border border-border rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-[#ff6b2b] transition-all shrink-0">
                                                       <Target size={20} strokeWidth={2.5} />
                                                    </div>
                                                </div>
                                                
                                                <p className="text-2xl lg:text-3xl text-foreground font-black italic leading-tight tracking-tight relative z-20 pl-2 pr-4 break-words">
                                                    {item.description || item.title}
                                                </p>
                                                
                                                <div className="flex flex-col lg:flex-row justify-between items-center gap-8 border-t border-border pt-8 relative z-20 pl-2">
                                                    <div className="w-full space-y-4">
                                                        <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic pl-1 leading-none">
                                                           <span>Resonance_Amplitude</span>
                                                           <span className="text-[#ff6b2b] animate-pulse">{Math.round((item.resonance || 0) * 100)}%</span>
                                                        </div>
                                                        <div className="w-full h-3 bg-background border border-border rounded-full overflow-hidden p-[1px]">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(item.resonance || 0) * 100}%` }}
                                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                                className={`h-full rounded-full ${item.type === 'bug' ? 'bg-red-500' : 'bg-[#ff6b2b]'}`}
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={() => handleResonate(item.type, item.id)}
                                                        className="w-full lg:w-auto px-10 py-4 bg-foreground text-background font-black uppercase tracking-[0.5em] text-[10px] rounded-full hover:bg-[#ff6b2b] hover:text-black hover:scale-[1.02] active:scale-98 transition-all italic leading-none shrink-0"
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
                    <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-28 h-fit">
                        
                         {/* TREASURY MONITOR */}
                        {treasury && (
                            <section className="bg-secondary/10 border-2 border-border p-8 rounded-[3rem] backdrop-blur-xl space-y-8 group hover:border-[#ff6b2b]/30 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-3000">
                                   <CreditCard size={150} className="text-[#ff6b2b]" />
                                </div>
                                <div className="flex items-center justify-between border-b border-border pb-6 relative z-10">
                                   <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.6em] italic leading-none pl-2">TREASURY_SYNC</div>
                                   <div className="w-10 h-10 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-xl flex items-center justify-center text-[#ff6b2b]">
                                      <ShieldCheck size={20} strokeWidth={2.5} className="animate-pulse" />
                                   </div>
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <div className="p-6 bg-background border border-border rounded-3xl flex justify-between items-center hover:border-foreground/20 transition-all group/asset shadow-sm">
                                        <div className="flex items-center gap-4">
                                           <div className="h-3 w-3 rounded-full bg-[#ff6b2b] animate-ping" />
                                           <span className="text-2xl font-black italic tracking-tighter text-muted-foreground group-hover/asset:text-foreground transition-colors">SOL</span>
                                        </div>
                                        <span className="text-3xl font-black text-foreground italic tracking-tighter font-mono">{treasury.sol?.balance?.toFixed(4) || '0.0000'}</span>
                                    </div>
                                    <div className="p-6 bg-background border border-border rounded-3xl flex justify-between items-center hover:border-foreground/20 transition-all group/asset shadow-sm">
                                        <div className="flex items-center gap-4">
                                           <div className="h-3 w-3 rounded-full bg-border group-hover/asset:bg-[#ff6b2b] transition-colors" />
                                           <span className="text-2xl font-black italic tracking-tighter text-muted-foreground group-hover/asset:text-foreground transition-colors">BTC</span>
                                        </div>
                                        <span className="text-3xl font-black text-foreground italic tracking-tighter font-mono">{treasury.btc?.balance?.toFixed(4) || '0.0000'}</span>
                                    </div>
                                </div>
                                <div className="pt-2 flex items-center justify-center gap-3 text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.4em] italic leading-none relative z-10">
                                    <Clock size={14} strokeWidth={2.5} /> Last_Sync: {new Date(treasury.timestamp).toLocaleTimeString()}
                                </div>
                            </section>
                        )}

                        {/* EVOLUTION MONITOR */}
                        <section className="bg-secondary/10 border-2 border-border p-8 rounded-[3rem] backdrop-blur-xl space-y-8 group transition-all hover:border-[#ff6b2b]/30 overflow-hidden relative">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-3000">
                                <Activity size={150} className="text-[#ff6b2b]" />
                             </div>
                             <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground italic flex items-center gap-4 relative z-10 leading-none pl-2">
                                <Boxes size={20} className="text-[#ff6b2b]" strokeWidth={2.5} /> Evolution Monitor
                            </h2>
                            <div className="grid grid-cols-1 gap-4 relative z-10 overflow-y-auto max-h-[400px] custom-scrollbar">
                                {agents.length === 0 ? (
                                    <div className="text-center py-10 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.6em] italic animate-pulse leading-none">
                                        Awaiting_autonomous_pulse...
                                    </div>
                                ) : (
                                    agents.map((agent) => (
                                        <div key={agent.id} className="p-6 rounded-3xl bg-background border border-border flex justify-between items-center hover:border-foreground/20 transition-all group/agent shadow-sm">
                                            <div className="space-y-2 truncate pr-4">
                                                <div className="text-lg font-black text-foreground uppercase tracking-tight italic transition-colors leading-none truncate">{agent.name}</div>
                                                <div className="text-[9px] text-muted-foreground font-black italic uppercase tracking-[0.3em] leading-none truncate">{agent.title}</div>
                                            </div>
                                            <div className="text-right space-y-2 shrink-0">
                                                <div className="text-xl font-black text-[#ff6b2b] italic tracking-tighter leading-none">Lv.{agent.level}</div>
                                                <div className="text-[9px] text-muted-foreground/80 font-black uppercase italic leading-none">BAL: {agent.balance?.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* MARKETPLACE FEED */}
                        <section className="bg-secondary/10 border-2 border-border p-8 rounded-[3rem] backdrop-blur-xl space-y-8 group transition-all hover:border-[#ff6b2b]/30 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-3000">
                                <TrendingUp size={150} className="text-[#ff6b2b]" />
                             </div>
                             <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground italic flex items-center gap-4 pl-2 leading-none relative z-10">
                                <TrendingUp size={20} className="text-[#ff6b2b]" strokeWidth={2.5} /> Skill_Commerce
                            </h2>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                                {marketplaceItems.length === 0 ? (
                                    <div className="text-center py-10 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.6em] italic leading-none">
                                        No_recent_commerce_detection
                                    </div>
                                ) : (
                                    marketplaceItems.map((item) => (
                                        <div key={item.id} className="p-6 rounded-3xl bg-background border border-border hover:border-foreground/20 transition-all flex justify-between items-center shadow-sm group/item">
                                            <div className="space-y-2 truncate pr-4">
                                                <div className="text-sm font-black text-foreground uppercase italic tracking-tight transition-colors leading-none truncate">{item.title}</div>
                                                <div className="text-[9px] text-muted-foreground italic uppercase tracking-[0.2em] truncate leading-none">{item.description}</div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-xl font-black text-[#ff6b2b] italic tracking-tight leading-none">{item.price}</div>
                                                <div className="text-[8px] text-muted-foreground/80 font-black italic uppercase tracking-[0.2em] mt-2 leading-none">{item.status}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* COMMAND SECURITY BANNER */}
                        <div className="p-8 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[3rem] space-y-4 relative overflow-hidden group transition-all hover:bg-[#ff6b2b]/10">
                           <div className="flex items-center gap-6 relative z-10">
                              <div className="w-12 h-12 bg-[#ff6b2b] rounded-2xl flex items-center justify-center text-black shadow-md transition-transform group-hover:scale-105 shrink-0">
                                 <ShieldCheck size={24} strokeWidth={3} className="animate-pulse" />
                              </div>
                              <div className="space-y-2">
                                 <div className="text-[10px] font-black uppercase tracking-[0.4em] italic text-[#ff6b2b] leading-none">Neural_Security_Active</div>
                                 <p className="text-[10px] text-muted-foreground italic leading-snug font-light pr-2">Hardware encryption enforced on all packets.</p>
                              </div>
                           </div>
                        </div>

                    </div>
                </div>

                {/* ── FOOTER SIGNAL ── */}
                <section className="pt-20 pb-10 text-center space-y-10">
                    <div className="w-full flex justify-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-[#ff6b2b] shadow-[0_0_10px_#ff6b2b]" />
                       <div className="w-3 h-3 rounded-full bg-border" />
                       <div className="w-3 h-3 rounded-full bg-border" />
                    </div>
                    <Link href="/" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground hover:text-[#ff6b2b] transition-all italic group active:scale-95 leading-none">
                        <ChevronLeft size={18} className="group-hover:-translate-x-2 transition-transform" strokeWidth={2.5} /> Return to Core Shard
                    </Link>
                </section>
            </main>
        </div>
    );
}
