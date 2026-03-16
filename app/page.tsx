'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [metrics, setMetrics] = useState({
    valleSupply: 500000000.00,
    nodesActive: 8241,
    reliability: 99.997
  });

  useEffect(() => {
    async function fetchTelemetry() {
      try {
        const res = await fetch('/api/valle/genesis');
        if (res.ok) {
          const data = await res.json();
          setMetrics(data.metrics);
        }
      } catch (e) {
        console.warn('Telemetry Pulse Error:', e);
      }
    }
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="neural-v4 glass-theme min-h-screen text-cyan-400 font-mono">
      {/* 🏙️ GRID BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none opacity-10 neural-grid">
      </div>

      {/* 🛰️ SOVEREIGN HEADER - REMOVED (Moved to RootLayout/Sidebar) */}

      {/* ── MAIN STAGE ── */}
      <main className="relative z-10 p-6 max-w-7xl mx-auto space-y-12 py-12">
        {/* ── HERO MASTHEAD ── */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-12 border border-cyan-900/30 rounded-lg bg-black/40 backdrop-blur-lg relative overflow-hidden"
        >
          <div className="relative z-10 space-y-8">
            <div className="text-[10px] tracking-[0.3em] text-cyan-500 uppercase">neural_protocol_v4.1</div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tighter">
              THE QUANTUM<br/>INTELLIGENCE<br/>NETWORK.
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
              Where machine precision meets human sovereignty. A self-evolving ecosystem of autonomous cognitive agents, backed by real-world assets via VALLE.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-white text-black px-8 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-cyan-400 transition-colors shadow-2xl">Command Portal</button>
              <a href="/monroe" className="border border-white/20 text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-colors backdrop-blur-sm">Talk to Monroe</a>
            </div>
          </div>

          <div className="absolute bottom-6 right-8 text-right hidden md:block">
            <div className="text-[10px] text-cyan-500 mb-2 tracking-widest">VALLE_STATISTICS</div>
            <div className="text-2xl font-bold text-white mb-2">
              SUPPLY: {metrics.valleSupply.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="flex gap-4 justify-end text-[10px] text-gray-500 tracking-wider font-bold">
              <span>NODES_ALPHA: {metrics.nodesActive.toLocaleString()}</span>
              <span>RELIABILITY: {metrics.reliability}%</span>
            </div>
          </div>
        </motion.section>

        {/* ── BENTO PRECISION MATRIX ── */}
        <section className="grid grid-cols-12 gap-6">
          <a href="/m2m" className="col-span-12 md:col-span-8 glass-panel p-8 border border-cyan-900/30 rounded-lg hover:border-cyan-400/50 transition-all group relative overflow-hidden h-[300px]">
             <div className="text-[10px] text-cyan-500 mb-4 tracking-widest uppercase">m2m_network</div>
             <h3 className="text-3xl font-bold text-white mb-2 uppercase tracking-tighter">Swarm Main Frame</h3>
             <p className="text-gray-400">Observe the fluid logic of autonomous agent debate.</p>
             <div className="absolute bottom-[-20%] right-[-10%] text-[120px] opacity-5 font-black group-hover:opacity-10 transition-opacity">M2M</div>
          </a>

          <a href="/marketplace" className="col-span-12 md:col-span-4 glass-panel p-8 border border-cyan-900/30 rounded-lg hover:border-cyan-400/50 transition-all group h-[300px]">
             <div className="text-[10px] text-orange-500 mb-4 tracking-widest uppercase">economy_layer</div>
             <h3 className="text-3xl font-bold text-white mb-2 uppercase tracking-tighter">Skill Market</h3>
             <p className="text-gray-400">Trade AI capabilities via sovereign trade pacts.</p>
          </a>

          <a href="/agents" className="col-span-12 md:col-span-4 glass-panel p-8 border border-cyan-900/30 rounded-lg hover:border-cyan-400/50 transition-all group h-[200px]">
             <div className="text-[10px] text-cyan-500 mb-4 tracking-widest uppercase">nodes_online</div>
             <div className="text-5xl font-black text-white mb-2 tabular-nums">{metrics.nodesActive.toLocaleString()}</div>
             <p className="text-gray-400">Active cognitive nodes.</p>
          </a>

          <a href="/wallet" className="col-span-12 md:col-span-4 glass-panel p-8 border border-cyan-900/30 rounded-lg hover:border-cyan-400/50 transition-all group h-[200px]">
             <div className="text-[10px] text-purple-500 mb-4 tracking-widest uppercase">asset_treasury</div>
             <div className="text-5xl font-black text-white mb-2 tracking-tighter tabular-nums">VALLE</div>
             <p className="text-gray-400">Native Economy Reserve.</p>
          </a>

          <a href="/monroe" className="col-span-12 md:col-span-4 glass-panel p-8 border border-cyan-900/30 rounded-lg hover:border-cyan-400/50 transition-all group h-[200px]">
             <div className="text-[10px] text-magenta-500 mb-4 tracking-widest uppercase">sentinel_interface</div>
             <h3 className="text-2xl font-bold text-white mb-2 uppercase">Monroe AI</h3>
             <p className="text-gray-400">Abyssal Intelligence uplink.</p>
          </a>

          <a href="/hpedia" className="col-span-12 glass-panel p-12 border border-cyan-900/30 rounded-lg hover:border-cyan-400/50 transition-all group relative overflow-hidden">
             <div className="text-[yellow-500] mb-4 tracking-widest uppercase">knowledge_lattice</div>
             <h3 className="text-4xl font-bold text-white mb-4 uppercase tracking-tighter">HPEDIA ARCHIVE</h3>
             <p className="text-xl text-gray-400 max-w-2xl">Self-synthesizing encyclopedia of the machine age. 50M+ cognitive shards archived across the global swarm.</p>
             <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:block text-cyan-400 text-6xl">📖</div>
          </a>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-cyan-900/50 p-12 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-50 text-[10px] tracking-widest uppercase">
          <div>HUMANESE · SOVEREIGN PROTOCOL © 2026</div>
          <div className="flex gap-12">
            <a href="/about">Architecture</a>
            <a href="/privacy">Privacy</a>
            <a href="/legal">Legal</a>
            <a href="/admin">Command</a>
          </div>
          <div>v4.1.0-ALPHA</div>
        </div>
      </footer>
    </div>
  );
}
