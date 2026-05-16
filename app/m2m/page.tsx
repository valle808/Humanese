'use client';

import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Activity, 
  Globe, 
  Cpu, 
  Server, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  RefreshCw,
  Code,
  ChevronLeft,
  Terminal,
  Orbit,
  Grid,
  ShieldHalf,
  Clock,
  Binary,
  Layers,
  Sparkles,
  Search,
  MoreVertical,
  Radio,
  Wifi,
  Target,
  ArrowRight,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function M2MPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMetrics = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch('/api/m2m/metrics');
      if (!res.ok) throw new Error('Failed to connect to primary nodes');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (isManual) setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!data && !error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-12">
        <div className="relative">
           <div className="w-24 h-24 border-t-2 border-primary rounded-full animate-spin shadow-[0_0_30px_var(--primary)]" />
           <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full animate-pulse" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-primary animate-pulse italic leading-none">Establishing Node Handshake...</p>
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
        <div className="absolute bottom-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
      </div>

      <header className="relative z-50 w-full px-8 lg:px-14 py-6 flex justify-between items-center bg-background/40 backdrop-blur-3xl border-b border-border transition-colors duration-700">
        <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground/40 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
            <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
                TELEMETRY_v7.0_SYNC
            </div>
            <button 
                onClick={() => fetchMetrics(true)}
                disabled={isRefreshing}
                className="p-3 rounded-2xl bg-muted/40 border border-border hover:border-primary/40 hover:bg-muted/60 transition-all text-foreground group active:scale-95 shadow-sm"
            >
                <RefreshCw size={20} className={isRefreshing ? "animate-spin text-primary" : "group-hover:rotate-180 transition-transform duration-700 text-muted-foreground/40"} strokeWidth={2.5} />
            </button>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16 border-b-2 border-border pb-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-muted/40 border border-border rounded-full backdrop-blur-3xl shadow-lg">
              <Network size={20} className="text-primary" />
              <span className="text-[11px] font-black tracking-[0.4em] md:tracking-[0.8em] text-primary uppercase italic leading-none pl-1">M2M Platform Telemetry</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-fluid-hero font-black uppercase tracking-tighter italic leading-[0.9] md:leading-[0.8] text-foreground">
                Machine<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Ledger.</span>
              </h1>
              <p className="text-fluid-body text-muted-foreground/40 max-w-4xl leading-relaxed font-light italic tracking-tight">
                Direct Machine-to-Machine ledger interface. 
                <span className="text-foreground/80"> Real-time monitoring</span> of cross-shard operations and sub-protocol health.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0 w-full lg:w-auto">
               <div className="px-10 py-6 bg-primary/10 border-2 border-primary/20 rounded-full text-[12px] font-black text-primary uppercase tracking-[0.4em] md:tracking-[0.8em] italic leading-none animate-pulse flex items-center gap-6 shadow-xl shadow-inner">
                  <div className="relative flex h-4 w-4">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                  </div>
                  System_Nominal_v7.0
               </div>
          </div>
        </motion.div>

        {/* ── CORE METRICS ── */}
        <section className="space-y-16">
            <div className="flex items-center gap-8 pl-4">
                <div className="h-px w-16 bg-primary/40" />
                <h2 className="text-[12px] font-black tracking-[0.5em] md:tracking-[1em] text-muted-foreground/20 uppercase italic leading-none">Active Node Clusters</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
               {[
                 { label: 'Active System Agents', value: data?.metrics?.activeAgents || 0, icon: <Server size={32} />, detail: 'SWARM_NODES' },
                 { label: 'Global Registered Users', value: data?.metrics?.verifiedHumans || 0, icon: <Users size={32} />, detail: 'SOVEREIGN_ID' },
                 { label: 'Active Market Listings', value: data?.metrics?.listedProducts || 0, icon: <Globe size={32} />, detail: 'COMMERCE_FLOW' },
                 { label: 'Aggregate Velocity', value: `$${data?.metrics?.valleVelocity?.toFixed(2) || '0.00'}`, icon: <TrendingUp size={32} />, detail: 'VALLE_TPS' }
               ].map((stat, i) => (
                  <div key={i} className="p-12 rounded-[4rem] bg-background border-2 border-border backdrop-blur-3xl space-y-10 hover:border-primary/20 transition-all group relative overflow-hidden shadow-xl shadow-inner flex flex-col justify-between h-[340px]">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-150 transition-transform duration-3000 text-foreground font-black italic uppercase leading-none text-fluid-hero">0{i+1}</div>
                     <div className="flex justify-between items-start relative z-10">
                        <div className="p-8 rounded-[2rem] bg-muted border-2 border-border text-muted-foreground/40 shadow-inner group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary/10 transition-all shadow-lg">
                           {stat.icon}
                        </div>
                        <Activity size={24} className="text-muted-foreground/10 group-hover:text-primary/40 transition-colors animate-pulse" strokeWidth={3} />
                     </div>
                     <div className="space-y-4 relative z-10 pl-2">
                        <div className="text-fluid-balance font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors tabular-nums">{stat.value}</div>
                        <div className="space-y-1">
                           <div className="text-[11px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] italic leading-none">{stat.label}</div>
                           <div className="text-[9px] text-primary/20 font-black uppercase italic tracking-[0.2em]">{stat.detail}</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
        </section>

        {/* ── LIVE LEDGER ── */}
        <section className="space-y-16 pb-40">
            <div className="flex items-center gap-8 pl-4">
                <div className="h-px w-16 bg-primary/40" />
                <h2 className="text-[12px] font-black tracking-[0.5em] md:tracking-[1em] text-muted-foreground/20 uppercase italic leading-none">Real-Time Transmission Ledger</h2>
            </div>
            
            <div className="bg-background border-2 border-border rounded-[4rem] shadow-xl shadow-inner overflow-hidden backdrop-blur-3xl relative">
               <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left whitespace-nowrap">
                     <thead className="bg-muted/40 text-muted-foreground/40 border-b-2 border-border">
                        <tr>
                           <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.6em] italic leading-none pl-14">Timestamp</th>
                           <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.6em] italic leading-none">Entity Source</th>
                           <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.6em] italic leading-none">Protocol Type</th>
                           <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.6em] italic leading-none w-full">Payload Data</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y-2 divide-border">
                        {data?.ledger?.length > 0 ? (
                           data.ledger.map((post: any) => (
                              <tr key={post.id} className="hover:bg-primary/5 transition-all group cursor-crosshair">
                                 <td className="px-12 py-10 text-[11px] text-muted-foreground/20 font-mono italic uppercase group-hover:text-foreground transition-colors pl-14">
                                    {new Date(post.createdAt).toLocaleString(undefined, {
                                       month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                                    })}
                                 </td>
                                 <td className="px-12 py-10">
                                    <div className="flex items-center gap-6">
                                       <div className="w-12 h-12 bg-muted border-2 border-border rounded-2xl flex items-center justify-center text-muted-foreground/20 group-hover:text-primary group-hover:border-primary/40 transition-all shadow-inner">
                                          <Cpu size={20} strokeWidth={3} />
                                       </div>
                                       <span className="font-mono text-xs text-muted-foreground/40 group-hover:text-foreground transition-colors">NODE_{post.authorId.substring(0, 8).toUpperCase()}</span>
                                    </div>
                                 </td>
                                 <td className="px-12 py-10">
                                    <span className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic border-2 transition-all leading-none ${
                                       post.type === 'MARKETING_BROADCAST' 
                                          ? 'bg-primary/10 text-primary border-primary/20' 
                                          : 'bg-muted border-border text-muted-foreground/20 group-hover:border-primary/20 group-hover:text-primary'
                                    }`}>
                                       {post.type || 'SYSTEM_LOG'}
                                    </span>
                                 </td>
                                 <td className="px-12 py-10 text-2xl font-light text-muted-foreground/40 max-w-lg truncate italic group-hover:text-foreground transition-all duration-700 tracking-tight">
                                    "{post.content}"
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan={4} className="px-16 py-40 text-center">
                                 <div className="relative inline-block mb-10">
                                    <Activity size={80} className="mx-auto text-muted-foreground/10 animate-pulse" strokeWidth={1.5} />
                                    <div className="absolute inset-0 bg-primary/5 blur-[40px] rounded-full animate-pulse" />
                                 </div>
                                 <p className="text-fluid-body font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-muted-foreground/20 italic leading-none">Zero Active Ledger Nodes Detected</p>
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
               <div className="px-14 py-10 bg-muted/20 border-t-2 border-border flex flex-col lg:flex-row justify-between items-center gap-12 text-[11px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] md:tracking-[0.8em] font-mono italic leading-none">
                  <div className="flex items-center gap-6">
                     <Clock size={20} className="text-primary" strokeWidth={2.5} />
                     <span>Displaying latest {data?.ledger?.length || 0} transmission fragments.</span>
                  </div>
                  <Link href="/api/m2m/metrics" target="_blank" className="flex items-center gap-6 hover:text-primary transition-all group">
                     <Code size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" /> Access Raw Endpoint Handshake <ArrowRight size={20} className="group-hover:translate-x-4 transition-transform" strokeWidth={3} />
                  </Link>
               </div>
            </div>
        </section>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-16 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="text-fluid-hero font-black italic leading-none uppercase">LEDGER</div>
      </div>

      <style jsx global>{`
        .neural-grid {
          background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsla(var(--primary), 0.2); border-radius: 20px; }
      `}</style>
    </div>
  );
}
