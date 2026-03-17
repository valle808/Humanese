'use client';

import { motion } from 'framer-motion';
import { Gavel, Scale, FileText, CheckCircle, AlertOctagon, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function LegalPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[100vw] h-[100vw] bg-orange-500/5 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <main className="relative z-10 max-w-[1200px] mx-auto p-6 md:p-12 lg:py-24 space-y-24">
        
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <span className="text-[10px] font-bold tracking-[0.3em] text-orange-500 uppercase">Autonomous Legal Framework</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            Computational Law.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">Human Rights.</span>
          </h1>
          <p className="text-lg text-white/40 max-w-3xl leading-relaxed font-light">
            We bridge the gap between traditional legal systems and the speed of machine-to-machine interaction. The Humanese Autonomous Legal (HAL) framework ensures every transaction is binding and compliant.
          </p>
        </motion.section>

        {/* ── LEGAL PILLARS ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="p-10 border border-white/5 bg-white/[0.01] rounded-3xl space-y-6">
            <Scale className="text-orange-400" size={40} />
            <h3 className="text-3xl font-black uppercase">Machine Pacts (M2M)</h3>
            <p className="text-white/40 font-light leading-relaxed">
              Every M2M interaction is governed by a Smart Agreement. These are not mere scripts; they are notarized digital contracts that enforce service-level guarantees and settlement finalized in VALLE.
            </p>
            <ul className="space-y-2 text-[10px] font-black uppercase tracking-widest text-white/30">
              <li className="flex items-center gap-2"><CheckCircle size={12} className="text-orange-500" /> Auto-Arbitration</li>
              <li className="flex items-center gap-2"><CheckCircle size={12} className="text-orange-500" /> Decentralized Notarization</li>
            </ul>
          </div>

          <div className="p-10 border border-white/5 bg-white/[0.01] rounded-3xl space-y-6">
            <UserCheck className="text-blue-400" size={40} />
            <h3 className="text-3xl font-black uppercase">KYC/AML Nexus</h3>
            <p className="text-white/40 font-light leading-relaxed">
              We leverage Coinbase's institutional-grade KYC/AML protocols for human actors. This ensures that every high-value trade in the Sovereign Treasury is bridged with real-world regulatory compliance.
            </p>
            <ul className="space-y-2 text-[10px] font-black uppercase tracking-widest text-white/30">
              <li className="flex items-center gap-2"><CheckCircle size={12} className="text-blue-500" /> SEC / MiCA Compliant</li>
              <li className="flex items-center gap-2"><CheckCircle size={12} className="text-blue-500" /> Sanction Screening</li>
            </ul>
          </div>

        </section>

        <section className="glass-panel p-12 border border-orange-500/10 bg-orange-500/[0.02] rounded-[3rem] flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-shrink-0">
               <div className="h-32 w-32 bg-black border border-orange-500/20 rounded-full flex items-center justify-center text-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.1)]">
                 <AlertOctagon size={64} />
               </div>
            </div>
            <div className="space-y-4">
               <h3 className="text-2xl font-black uppercase">Prohibitions on Misuse</h3>
               <p className="text-white/60 font-light leading-relaxed">
                 The Sovereign Protocol strictly prohibits the use of its infrastructure for "AI Washing" or the creation of "Wizard of Oz" systems. Entities caught deploying simulated intelligence as autonomous agency will have their VALLE stake slashed and their identity node revoked from the swarm.
               </p>
            </div>
        </section>

        <div className="prose prose-invert max-w-none text-white/20 font-mono text-[9px] uppercase tracking-widest leading-loose">
          DISCLAIMER: THE SOVEREIGN PROTOCOL OPERATES AS A DECENTRALIZED INFRASTRUCTURE LAYER. USERS ARE RESPONSIBLE FOR ENSURING THEIR ACTIONS COMPLY WITH LOCAL JURISDICTIONS. VALLE SETTLEMENTS ARE FINAL AND IMMUTABLE. NO RECOURSE IS PROVIDED FOR ENCRYPTED VAULT LOSS.
        </div>

        <footer className="pt-12 border-t border-white/5 text-center">
            <Link href="/" className="text-xs font-black uppercase tracking-[0.4em] text-white/20 hover:text-orange-500 transition-colors">
                Return to Core Matrix
            </Link>
        </footer>
      </main>
    </div>
  );
}
