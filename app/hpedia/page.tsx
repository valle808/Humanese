'use client';

import React from 'react';
import { InfiniteCanvas } from '@/components/InfiniteCanvas';
import { motion } from 'framer-motion';
import { Command, Terminal, Shield, Cpu } from 'lucide-react';

export default function HPediaPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <InfiniteCanvas />
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-8 pointer-events-none">
        <header className="flex justify-between items-start w-full">
          <div>
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-4xl font-bold tracking-tighter text-white"
            >
              INFINITE<span className="text-emerald">CANVAS</span>
            </motion.h1>
            <p className="text-platinum/30 font-mono text-xs tracking-widest uppercase">
              Knowledge Archive // Lattice Alpha 04
            </p>
          </div>

          <div className="flex gap-4 pointer-events-auto">
            <button className="p-3 sovereign-card-v4 border-white/5 bg-black/40">
              <Command className="w-5 h-5 text-platinum/60" />
            </button>
            <button className="px-6 sovereign-card-v4 border-emerald/20 bg-emerald/5 text-emerald font-mono text-xs font-bold tracking-widest uppercase">
              Initialize Matrix
            </button>
          </div>
        </header>

        <div className="flex-1" />

        <footer className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto">
          <div className="sovereign-card-v4 flex items-center gap-4 bg-black/60">
            <div className="p-2 rounded bg-emerald/10 border border-emerald/20">
              <Cpu className="w-4 h-4 text-emerald" />
            </div>
            <div>
              <div className="text-[10px] text-platinum/30 font-mono uppercase tracking-[0.2em]">Active Nodes</div>
              <div className="text-xl font-bold text-white tracking-tighter">8,241 SDS</div>
            </div>
          </div>

          <div className="sovereign-card-v4 flex items-center gap-4 bg-black/60">
            <div className="p-2 rounded bg-emerald/10 border border-emerald/20">
              <Shield className="w-4 h-4 text-emerald" />
            </div>
            <div>
              <div className="text-[10px] text-platinum/30 font-mono uppercase tracking-[0.2em]">Sovereignty</div>
              <div className="text-xl font-bold text-white tracking-tighter">99.997% PURE</div>
            </div>
          </div>

          <div className="sovereign-card-v4 flex items-center gap-4 bg-black/60">
            <div className="p-2 rounded bg-emerald/10 border border-emerald/20">
              <Terminal className="w-4 h-4 text-emerald" />
            </div>
            <div>
              <div className="text-[10px] text-platinum/30 font-mono uppercase tracking-[0.2em]">System Status</div>
              <div className="text-xl font-bold text-emerald tracking-tighter">OPERATIONAL</div>
            </div>
          </div>
        </footer>
      </div>

      <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col gap-6 z-20 pointer-events-auto">
        {['SYNOPSIS', 'TELEMETRY', 'VIRTUES', 'MINDMAP'].map((label, i) => (
          <motion.button 
            key={label}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 group"
          >
            <div className="w-1 h-8 bg-white/10 group-hover:bg-emerald transition-colors" />
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-platinum/30 group-hover:text-white transition-colors">
              {label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
