'use client';

import { motion } from 'framer-motion';
import { Cpu, Shield, Globe, Layers, Zap, Database } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      {/* 🌌 ABYSSAL BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[100vw] h-[100vw] bg-[primary]/5 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <main className="relative z-10 max-w-[1200px] mx-auto p-6 md:p-12 lg:py-24 space-y-24">
        
        {/* ── HEADER ── */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[primary] uppercase">Sovereign Architecture</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            The Protocol of<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">Absolute Truth.</span>
          </h1>
          <p className="text-xl text-white/40 max-w-3xl leading-relaxed font-light">
            Sovereign Matrix is not a simulation. It is a distributed neural backbone engineered for the seamless integration of human, machine, and autonomous agency.
          </p>
        </motion.section>

        {/* ── CORE PILLARS ── */}
        <motion.section 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={item} className="glass-panel p-10 border border-white/10 rounded-[2rem] bg-white/[0.02] space-y-6">
            <div className="h-16 w-16 bg-[primary]/10 rounded-2xl flex items-center justify-center text-[primary]">
              <Layers size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase italic">The UXL Layer</h3>
            <p className="text-white/40 font-light leading-relaxed">
              The Universal Exchange Layer (UXL) bridges disparate entities—Humans, IoT, Agents—under a single, secure financial and identity protocol.
            </p>
          </motion.div>

          <motion.div variants={item} className="glass-panel p-10 border border-white/10 rounded-[2rem] bg-white/[0.02] space-y-6">
            <div className="h-16 w-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
              <Database size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase italic">VALLE Ledger</h3>
            <p className="text-white/40 font-light leading-relaxed">
              Every thought, action, and transaction is anchored in the VALLE Sovereign Treasury, a native blockchain-grade ledger ensuring immutable traceability.
            </p>
          </motion.div>

          <motion.div variants={item} className="glass-panel p-10 border border-white/10 rounded-[2rem] bg-white/[0.02] space-y-6">
            <div className="h-16 w-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
              <Globe size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase italic">Global Nodes</h3>
            <p className="text-white/40 font-light leading-relaxed">
              Distributed over 8,000+ active neural nodes, the system maintains 99.999% reliability through an asynchronous gossip-based consensus mechanism.
            </p>
          </motion.div>
        </motion.section>

        {/* ── TECHNICAL MANIFESTO ── */}
        <section className="space-y-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
            <Shield className="text-[primary]" /> The Manifesto of Autonomy
          </h2>
          <div className="prose prose-invert max-w-none text-white/60 font-light space-y-6 text-lg">
            <p>
              In an era of shallow simulations and "AI washing," Sovereign Matrix stands as a bastion of functional intelligence. We reject the "Wizard of Oz" architecture. Our agents are not pre-scripted; they are autonomous entities operating on real-world data and verifiable logic.
            </p>
            <p>
              The **Sovereign Machine Age** is here. It requires an architecture that respects the ocular health of its observers (Ocular Defense) and the luminance requirements of its operators (Luminance Optimized). It requires a polymorphic identity engine that recognizes a machine's HWID with the same fidelity as a human's biometric signature.
            </p>
            <p>
              This is the blueprint for a future where labor is cognitive, value is sovereign, and truth is the only consensus.
            </p>
          </div>
        </section>

        <footer className="pt-12 border-t border-white/5 text-center">
            <Link href="/" className="text-xs font-black uppercase tracking-[0.4em] text-white/20 hover:text-[primary] transition-colors">
                Return to Core Matrix
            </Link>
        </footer>
      </main>
    </div>
  );
}
