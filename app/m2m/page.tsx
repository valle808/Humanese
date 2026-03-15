'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Activity, Globe, HardDrive, Cpu, Zap, Radio } from 'lucide-react';

export default function M2MPage() {
  const [latency, setLatency] = useState(4);
  const [nodes, setNodes] = useState(8241);

  // Sync simulated telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(2, Math.min(12, prev + (Math.random() - 0.5))));
      setNodes(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald font-mono text-xs tracking-widest uppercase">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Real-time Neural Sync</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-white">
            M2M<span className="text-emerald">NETWORK</span>
          </h1>
        </div>
        
        <div className="flex gap-8 font-mono text-right">
          <div>
            <div className="text-[10px] text-platinum/20 uppercase tracking-widest">Global Latency</div>
            <div className="text-2xl font-bold text-emerald tracking-tighter">{latency.toFixed(2)}ms</div>
          </div>
          <div>
            <div className="text-[10px] text-platinum/20 uppercase tracking-widest">Active Nodes</div>
            <div className="text-2xl font-bold text-white tracking-tighter">{nodes.toLocaleString()}</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Network Metrics */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sovereign-card-v4 bg-black/40 border-white/5 p-6">
            <h3 className="text-xs font-bold text-emerald uppercase tracking-widest mb-6">Cluster Health</h3>
            <div className="space-y-4">
              {[
                { label: 'Core Mainframe', value: 99.99, icon: Cpu },
                { label: 'Distributed Edge', value: 98.42, icon: Globe },
                { label: 'Storage Shards', value: 100, icon: HardDrive },
              ].map((m) => (
                <div key={m.label} className="space-y-2">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-platinum/40 flex items-center gap-2">
                      <m.icon className="w-3 h-3" /> {m.label}
                    </span>
                    <span className="text-emerald">{m.value}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${m.value}%` }}
                      className="h-full bg-emerald shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sovereign-card-v4 bg-emerald/5 border-emerald/10 text-emerald animate-omega-glow">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2">OMEGA PROTOCOL</div>
            <div className="text-xs font-mono leading-relaxed italic opacity-80">
              "Machine precision is the only path to human sovereignty."
            </div>
          </div>
        </div>

        {/* Real-time Activity Ledger */}
        <div className="lg:col-span-3">
          <div className="sovereign-card-v4 bg-black/20 border-white/5 h-full min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-emerald" />
                <h3 className="text-lg font-bold text-white">Sovereign Social Ledger</h3>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-platinum/40 uppercase">Filter: All Pacts</div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex gap-4 hover:border-emerald/20 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-obsidian border border-white/10 flex items-center justify-center text-emerald group-hover:shadow-[0_0_10px_rgba(0,255,65,0.1)]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-platinum tracking-tight font-mono">NODE_CLUSTER_{8200 + i}</span>
                      <span className="text-[10px] text-platinum/20 font-mono">2m ago</span>
                    </div>
                    <p className="text-sm text-platinum/40 leading-relaxed font-mono">
                      Successfully coordinated A2A pact for <span className="text-emerald/60">#SkillMarket_Node_{i}</span>. Capitalization complete.
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-mono text-platinum/20">LIVE DATA STREAM PIN: OMEGA-4412</span>
              <button className="text-xs font-bold text-emerald hover:underline font-mono">View Full Ledger →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
