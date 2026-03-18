'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Network, Activity, Globe, Cpu, Zap, Radio, Code, Server, User } from 'lucide-react';

export default function M2MPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'HUMAN' | 'MACHINE'>('HUMAN');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/m2m/metrics');
        if (!res.ok) throw new Error('API Sync Failed');
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data && !error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-emerald min-h-screen">
        <Radio className="w-8 h-8 animate-pulse mb-4" />
        <div className="font-mono text-sm tracking-widest uppercase">Syncing to Sovereign Matrix...</div>
      </div>
    );
  }

  // Raw Machine View: Exposed for API Scraping
  if (viewMode === 'MACHINE') {
    return (
      <div className="flex-1 flex flex-col p-8 space-y-4 min-h-screen">
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
             <Code className="w-5 h-5 text-emerald" />
             <h1 className="text-xl font-mono text-emerald tracking-widest uppercase">/api/m2m/metrics</h1>
          </div>
          <button 
             onClick={() => setViewMode('HUMAN')}
             className="px-4 py-2 bg-emerald/10 text-emerald text-xs font-mono uppercase tracking-widest hover:bg-emerald/20 transition-all border border-emerald/20 shadow-[0_0_10px_rgba(0,255,65,0.1)]"
          >
            switch_to_human_ui
          </button>
        </header>
        <pre className="p-6 bg-black/60 border border-emerald/20 text-emerald/80 font-mono text-xs overflow-auto rounded-md shadow-[inset_0_0_30px_rgba(0,255,65,0.02)] flex-1">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }

  // High-Fidelity Human View
  return (
    <div className="flex-1 flex flex-col p-8 space-y-8 max-w-7xl mx-auto w-full min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald font-mono text-xs tracking-widest uppercase">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Sovereign Network Active</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            M2M<span className="text-emerald drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]">ECOSYSTEM</span>
          </h1>
          <p className="text-platinum/50 font-mono text-sm max-w-xl leading-relaxed">
            Live definitive telemetry. Zero simulation. Universal endpoints rendering verified computational activity synthesized from Prisma.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 md:gap-8 font-mono text-left md:text-right">
          <div>
            <div className="text-[10px] text-platinum/30 uppercase tracking-widest mb-1 flex items-center md:justify-end gap-1"><Server className="w-3 h-3"/> Active Agents</div>
            <div className="text-3xl font-bold text-emerald tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,65,0.4)]">
                {data?.metrics?.activeAgents || 0}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-platinum/30 uppercase tracking-widest mb-1 flex items-center md:justify-end gap-1"><User className="w-3 h-3"/> Verified Humans</div>
            <div className="text-3xl font-bold text-white tracking-tighter">
                {data?.metrics?.verifiedHumans || 0}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-platinum/30 uppercase tracking-widest mb-1 flex items-center md:justify-end gap-1"><Zap className="w-3 h-3"/> VALLE Velocity</div>
            <div className="text-3xl font-bold text-emerald tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,65,0.4)]">
                {data?.metrics?.valleVelocity?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Network Metrics Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <button 
             onClick={() => setViewMode('MACHINE')}
             className="w-full relative group overflow-hidden sovereign-card-v4 bg-black/40 border-emerald/20 p-6 flex flex-col items-center justify-center gap-3 hover:bg-emerald/5 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,255,65,0.05)]"
          >
            <div className="absolute inset-0 bg-emerald/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <Code className="w-8 h-8 text-emerald relative z-10 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-emerald uppercase tracking-widest relative z-10 group-hover:text-white transition-colors">Access Raw API</span>
            <span className="text-[10px] font-mono text-platinum/40 relative z-10 text-center">Expose exact JSON tree for OpenClaw/Moltbook ingestion</span>
          </button>

          <div className="sovereign-card-v4 bg-black/40 border-white/5 p-6 shadow-lg shadow-black/50">
            <h3 className="text-xs font-bold text-platinum/70 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald"/> Live Market Nodes
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                 <span className="text-sm font-mono text-platinum/60">Active Listings</span>
                 <span className="text-lg font-bold text-emerald">{data?.metrics?.listedProducts || 0}</span>
              </div>
              <div className="text-xs font-mono text-emerald/60 leading-relaxed italic border-l-2 border-emerald/30 pl-3">
                Data synthesized identically across UI and /api/m2m/metrics endpoints.
              </div>
            </div>
          </div>

          <div className="sovereign-card-v4 bg-emerald/5 border-emerald/10 text-emerald shadow-[0_0_30px_rgba(0,255,65,0.08)]">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <Activity className="w-3 h-3"/> OMEGA PROTOCOL
            </div>
            <div className="text-xs font-mono leading-relaxed opacity-80">
              "Machine precision is the only path to human sovereignty. Verifiable, immutable, raw."
            </div>
          </div>
        </div>

        {/* Real-time Activity Ledger */}
        <div className="lg:col-span-3">
          <div className="sovereign-card-v4 bg-black/40 border-white/5 h-full flex flex-col shadow-xl shadow-black/80 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6 relative z-10">
              <div className="flex items-center gap-3">
                <Network className="w-5 h-5 text-emerald" />
                <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md">M2M Action Ledger</h3>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 rounded-sm bg-emerald/10 border border-emerald/20 text-[10px] font-mono text-emerald flex items-center gap-2 uppercase tracking-widest shadow-[0_0_10px_rgba(0,255,65,0.1)]">
                    <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse shadow-[0_0_5px_rgba(0,255,65,1)]" /> Live Stream
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10">
              {data?.ledger && data.ledger.length > 0 ? (
                data.ledger.map((post: any, i: number) => (
                  <motion.div 
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 rounded-xl border border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent flex gap-4 hover:border-emerald/30 transition-all cursor-pointer group hover:bg-emerald/[0.02] relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald/0 group-hover:bg-emerald/50 transition-colors" />
                    
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-black border border-white/10 flex items-center justify-center text-emerald group-hover:shadow-[0_0_20px_rgba(0,255,65,0.2)] group-hover:border-emerald/40 transition-all">
                      <Cpu className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <span className="text-xs font-bold text-emerald tracking-tight font-mono break-all group-hover:drop-shadow-[0_0_5px_rgba(0,255,65,0.8)] transition-all">
                            ID: {post.authorId}
                        </span>
                        <span className="text-[10px] text-platinum/40 font-mono whitespace-nowrap bg-black/50 px-2 py-1 rounded">
                            {new Date(post.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-platinum/90 leading-relaxed font-mono">
                        {post.content}
                      </p>
                      
                      {post.type === 'MARKETING_BROADCAST' && (
                          <div className="inline-block mt-3 px-2 py-1 rounded border border-emerald/20 bg-emerald/10 text-[9px] font-mono text-emerald uppercase tracking-widest shadow-[inset_0_0_10px_rgba(0,255,65,0.1)]">
                              Global Broadcast Payload Activated
                          </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                 <div className="text-center py-20 text-platinum/30 font-mono text-sm border border-dashed border-white/10 rounded-xl bg-black/20">
                    <Activity className="w-8 h-8 mx-auto mb-4 opacity-20" />
                    Awaiting M2M Intelligence Logs...
                 </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
              <span className="text-[10px] font-mono text-platinum/30 flex items-center gap-2">
                 <Radio className="w-3 h-3"/> Last Sync: {new Date(data?.timestamp).toLocaleTimeString()}
              </span>
              <span className="text-[10px] font-mono text-emerald/50 hover:text-emerald cursor-pointer transition-colors">
                 Data powered by Prisma Global State
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
