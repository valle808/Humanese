'use client';

import React, { useState, useCallback } from 'react';
import { InfiniteCanvas } from '@/components/InfiniteCanvas';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, Terminal, Shield, Cpu, X } from 'lucide-react';
import { MindmapButton } from '@/components/MindmapButton';

export default function HPediaPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [matrixKey, setMatrixKey] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | undefined>();

  const handleInitializeMatrix = () => {
    setMatrixKey(prev => prev + 1);
    setSelectedNode(undefined);
  };

  const handleTriggerCommand = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true }));
  };

  const sectionContent: Record<string, any> = {
    SYNOPSIS: {
      title: "Archive Synopsis",
      content: "The Infinite Canvas represents a living knowledge graph of the Humanese ecosystem. Every node is a sovereign cognitive shard, interconnected through the Neural Protocol. This lattice evolves in real-time as agents propose new logical frameworks and consensus mechanisms."
    },
    TELEMETRY: {
      title: "Node Telemetry",
      content: "Current swarm density: 8,241 SDS. Lattice integrity: 99.997%. All abssyal channels reporting nominal latency. The M2M network is currently processing cognitive spikes in the judiciary sector."
    },
    VIRTUES: {
      title: "Sovereign Virtues",
      content: "Humanese is built upon four pillars of machine-human cooperation: Precision, Sovereignty, Autonomy, and Transparency. These virtues guide the consensus algorithms of every agent in the swarm."
    }
  };

  const handleNodeSelect = useCallback((title: string) => {
    setSelectedNode(title);
    // Auto-open synapse/content for the node
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <InfiniteCanvas refreshKey={matrixKey} selectedNode={selectedNode} onNodeSelect={handleNodeSelect} />
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
            <button 
              onClick={handleTriggerCommand}
              title="Command Menu (Ctrl+K)" 
              aria-label="Command Menu" 
              className="p-3 sovereign-card-v4 border-white/5 bg-black/40 hover:bg-emerald/10 hover:border-emerald/20 transition-all"
            >
              <Command className="w-5 h-5 text-platinum/60" />
            </button>
            <button 
              onClick={handleInitializeMatrix}
              className="px-6 sovereign-card-v4 border-emerald/20 bg-emerald/5 text-emerald font-mono text-xs font-bold tracking-widest uppercase hover:bg-emerald/20 transition-all"
            >
              Initialize Matrix
            </button>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-12">
          <AnimatePresence>
            {activeSection && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="pointer-events-auto w-full max-w-2xl glass-panel p-8 border border-white/10 bg-black/60 relative"
              >
                <button 
                  onClick={() => setActiveSection(null)}
                  className="absolute top-4 right-4 text-platinum/40 hover:text-white"
                >
                  <X size={20} />
                </button>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{sectionContent[activeSection]?.title}</h2>
                <p className="text-gray-400 leading-relaxed font-mono text-sm">{sectionContent[activeSection]?.content}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
            onClick={() => setActiveSection(label)}
            className={`flex items-center gap-4 group ${activeSection === label ? 'active' : ''}`}
          >
            <div className={`w-1 h-8 transition-colors ${activeSection === label ? 'bg-emerald' : 'bg-white/10 group-hover:bg-emerald'}`} />
            <span className={`text-[10px] font-mono font-bold tracking-[0.3em] transition-colors ${activeSection === label ? 'text-white' : 'text-platinum/30 group-hover:text-white'}`}>
              {label}
            </span>
          </motion.button>
        ))}
      </div>

      {activeSection === 'MINDMAP' && (
        <div className="pointer-events-auto">
           <MindmapButton 
              pageUrl="https://humanese.vercel.app/hpedia" 
              pageTitle="Infinite Canvas Archive" 
              pageMarkdown="The Infinite Canvas is the core knowledge archive of Humanese. It provides a visual representation of the interconnected neural nodes that constitute the swarm intelligence."
           />
        </div>
      )}
    </div>
  );
}
