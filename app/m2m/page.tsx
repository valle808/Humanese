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
  ArrowRight
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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-12">
        <div className="relative">
           <div className="w-24 h-24 border-t-2 border-[#ff6b2b] rounded-full animate-spin shadow-[0_0_30px_#ff6b2b]" />
           <div className="absolute inset-0 bg-[#ff6b2b]/10 blur-[40px] rounded-full animate-pulse" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] animate-pulse italic leading-none">Establishing Node Handshake...</p>
      </div>
    );
  }

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
                TELEMETRY_v7.0_SYNC
            </div>
            <button 
                onClick={() => fetchMetrics(true)}
                disabled={isRefreshing}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ff6b2b]/40 hover:bg-white/10 transition-all text-white group active:scale-95"
            >
                <RefreshCw size={20} className={isRefreshing ? "animate-spin text-[#ff6b2b]" : "group-hover:rotate-180 transition-transform duration-700"} strokeWidth={2.5} />
            </button>
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
              <Network size={20} className="text-[#ff6b2b]" />
              <span className="text-[11px] font-black tracking-[0.8em] text-[#ff6b2b] uppercase italic leading-none pl-1">M2M Platform Telemetry</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] italic pl-1 text-white/95">
                Machine<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Ledger.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/30 max-w-4xl leading-relaxed font-light italic tracking-tight">
                Direct Machine-to-Machine ledger interface. 
                <span className="text-white/60"> Real-time monitoring</span> of cross-shard operations and sub-protocol health.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0">
               <div className="px-10 py-6 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/20 rounded-full text-[12px] font-black text-[#ff6b2b] uppercase tracking-[0.8em] italic leading-none animate-pulse flex items-center gap-6">
                  <div className="relative flex h-4 w-4">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6b2b] opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ff6b2b]"></span>
                  </div>
                  System_Nominal_v7.0
               </div>
          </div>
        </motion.div>

        {/* ── CORE METRICS ── */}
        <section className="space-y-16">
            <div className="flex items-center gap-8 pl-4">
                <div className="h-px w-16 bg-[#ff6b2b]/40" />
                <h2 className="text-[12px] font-black tracking-[1em] text-white/10 uppercase italic leading-none">Active Node Clusters</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
               {[
                 { label: 'Active System Agents', value: data?.metrics?.activeAgents || 0, icon: <Server size={32} />, detail: 'SWARM_NODES' },
                 { label: 'Global Registered Users', value: data?.metrics?.verifiedHumans || 0, icon: <Users size={32} />, detail: 'SOVEREIGN_ID' },
                 { label: 'Active Market Listings', value: data?.metrics?.listedProducts || 0, icon: <Globe size={32} />, detail: 'COMMERCE_FLOW' },
                 { label: 'Aggregate Velocity', value: `$${data?.metrics?.valleVelocity?.toFixed(2) || '0.00'}`, icon: <TrendingUp size={32} />, detail: 'VALLE_TPS' }
               ].map((stat, i) => (
                  <div key={i} className="p-12 rounded-[5rem] bg-[#050505] border-2 border-white/5 backdrop-blur-3xl space-y-10 hover:border-[#ff6b2b]/20 transition-all group relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.95)] shadow-inner flex flex-col justify-between h-[340px]">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-150 transition-transform duration-3000 text-white font-black italic uppercase leading-none text-[8rem]">0{i+1}</div>
                     <div className="flex justify-between items-start relative z-10">
                        <div className="p-10 rounded-[2.5rem] bg-black border-2 border-white/5 text-[#ff6b2b] shadow-inner group-hover:bg-[#ff6b2b] group-hover:text-black group-hover:border-black/5 transition-all">
                           {stat.icon}
                        </div>
                        <Activity size={24} className="text-white/5 group-hover:text-[#ff6b2b]/40 transition-colors animate-pulse" strokeWidth={3} />
                     </div>
                     <div className="space-y-4 relative z-10 pl-2">
                        <div className="text-6xl font-black text-white italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors tabular-nums">{stat.value}</div>
                        <div className="space-y-1">
                           <div className="text-[11px] font-black text-white/10 uppercase tracking-[0.4em] italic leading-none">{stat.label}</div>
                           <div className="text-[9px] text-[#ff6b2b]/20 font-black uppercase italic tracking-[0.2em]">{stat.detail}</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
        </section>

        {/* ── LIVE LEDGER ── */}
        <section className="space-y-16 pb-40">
            <div className="flex items-center gap-8 pl-4">
                <div className="h-px w-16 bg-[#ff6b2b]/40" />
                <h2 className="text-[12px] font-black tracking-[1em] text-white/10 uppercase italic leading-none">Real-Time Transmission Ledger</h2>
            </div>
            
            <div className="bg-[#050505] border-2 border-white/10 rounded-[5rem] shadow-[0_80px_150px_rgba(0,0,0,1)] overflow-hidden backdrop-blur-3xl relative">
               <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left whitespace-nowrap">
                     <thead className="bg-white/[0.01] text-white/20 border-b-2 border-white/5">
                        <tr>
                           <th className="px-16 py-10 text-[12px] font-black uppercase tracking-[0.6em] italic leading-none">Timestamp</th>
                           <th className="px-16 py-10 text-[12px] font-black uppercase tracking-[0.6em] italic leading-none">Entity Source</th>
                           <th className="px-16 py-10 text-[12px] font-black uppercase tracking-[0.6em] italic leading-none">Protocol Type</th>
                           <th className="px-16 py-10 text-[12px] font-black uppercase tracking-[0.6em] italic leading-none w-full">Payload Data</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y-2 divide-white/5">
                        {data?.ledger?.length > 0 ? (
                           data.ledger.map((post: any) => (
                              <tr key={post.id} className="hover:bg-[#ff6b2b]/5 transition-all group cursor-crosshair">
                                 <td className="px-16 py-10 text-[12px] text-white/20 font-mono italic uppercase group-hover:text-white transition-colors">
                                    {new Date(post.createdAt).toLocaleString(undefined, {
                                       month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                                    })}
                                 </td>
                                 <td className="px-16 py-10">
                                    <div className="flex items-center gap-6">
                                       <div className="w-12 h-12 bg-black border-2 border-white/5 rounded-2xl flex items-center justify-center text-[#ff6b2b]/20 group-hover:text-[#ff6b2b] group-hover:border-[#ff6b2b]/40 transition-all shadow-inner">
                                          <Cpu size={20} strokeWidth={3} />
                                       </div>
                                       <span className="font-mono text-xs text-white/40 group-hover:text-white transition-colors">NODE_{post.authorId.substring(0, 8).toUpperCase()}</span>
                                    </div>
                                 </td>
                                 <td className="px-16 py-10">
                                    <span className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.4em] italic border-2 transition-all leading-none ${
                                       post.type === 'MARKETING_BROADCAST' 
                                          ? 'bg-[#ff6b2b]/10 text-[#ff6b2b] border-[#ff6b2b]/20' 
                                          : 'bg-white/5 text-white/20 border-white/10 group-hover:border-white/20 group-hover:text-white'
                                    }`}>
                                       {post.type || 'SYSTEM_LOG'}
                                    </span>
                                 </td>
                                 <td className="px-16 py-10 text-2xl font-light text-white/30 max-w-lg truncate italic group-hover:text-white transition-all duration-700">
                                    "{post.content}"
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan={4} className="px-16 py-40 text-center">
                                 <div className="relative inline-block mb-10">
                                    <Activity size={80} className="mx-auto text-white/5 animate-pulse" strokeWidth={1.5} />
                                    <div className="absolute inset-0 bg-[#ff6b2b]/5 blur-[40px] rounded-full animate-pulse" />
                                 </div>
                                 <p className="text-2xl font-black uppercase tracking-[1em] text-white/10 italic leading-none">Zero Active Ledger Nodes Detected</p>
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
               <div className="px-16 py-10 bg-white/[0.01] border-t-2 border-white/5 flex flex-col lg:flex-row justify-between items-center gap-12 text-[11px] font-black text-white/10 uppercase tracking-[0.8em] font-mono italic leading-none">
                  <div className="flex items-center gap-6">
                     <Clock size={20} className="text-[#ff6b2b]" strokeWidth={2.5} />
                     <span>Displaying latest {data?.ledger?.length || 0} transmission fragments.</span>
                  </div>
                  <Link href="/api/m2m/metrics" target="_blank" className="flex items-center gap-4 hover:text-[#ff6b2b] transition-all group">
                     <Code size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" /> Access Raw Endpoint Handshake <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" strokeWidth={3} />
                  </Link>
               </div>
            </div>
        </section>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-[30vw] font-black italic leading-none uppercase">LEDGER</div>
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
