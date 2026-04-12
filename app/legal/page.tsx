'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gavel, 
  Scale, 
  FileText, 
  CheckCircle, 
  AlertOctagon, 
  UserCheck, 
  ChevronLeft, 
  ShieldCheck, 
  Terminal, 
  Lock, 
  Activity, 
  Radio, 
  Wifi, 
  Target,
  Layers,
  Sparkles,
  GanttChart
} from 'lucide-react';
import Link from 'next/link';

export default function LegalPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ff6b2b]/40 selection:text-white overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[250px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <header className="relative z-10 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-[#ff6b2b] transition-colors text-[10px] font-black uppercase tracking-[0.4em] group italic leading-none">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
              LEGAL_ENGINE_v7.0
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-24 lg:pt-32 space-y-32">
        
        {/* ── HEADER ── */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl shadow-2xl">
            <ShieldCheck size={18} className="text-[#ff6b2b]" />
            <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none">Autonomous Legal Framework</span>
          </div>
          <div className="space-y-8">
            <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter uppercase leading-[0.85] italic">
              Computational Law.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Human Rights.</span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/40 max-w-4xl leading-relaxed font-light italic">
              We bridge the gap between traditional legal systems and the speed of machine-to-machine interaction. The OMEGA Autonomous Legal (HAL) framework ensures every transaction is binding and compliant.
            </p>
          </div>
        </motion.section>

        {/* ── LEGAL PILLARS ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="p-12 border border-white/5 bg-white/[0.01] rounded-[3.5rem] space-y-10 group hover:border-[#ff6b2b]/30 transition-all shadow-2xl relative overflow-hidden backdrop-blur-xl shadow-inner">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
               <Scale size={140} className="text-[#ff6b2b]" />
            </div>
            <div className="h-16 w-16 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-2xl flex items-center justify-center text-[#ff6b2b] shadow-2xl group-hover:scale-110 transition-transform">
               <Scale size={32} />
            </div>
            <div className="space-y-4">
               <h3 className="text-3xl font-black uppercase italic tracking-tighter">Machine Pacts (M2M)</h3>
               <p className="text-lg text-white/30 font-light leading-relaxed italic group-hover:text-white/60 transition-colors">
                  Every M2M interaction is governed by a Smart Agreement. These are not mere scripts; they are notarized digital contracts that enforce service-level guarantees and settlement finalized in $VALLE.
               </p>
            </div>
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-[0.5em] text-[#ff6b2b] italic relative z-10">
              <li className="flex items-center gap-4"><CheckCircle size={16} /> Auto-Arbitration</li>
              <li className="flex items-center gap-4"><CheckCircle size={16} /> Decentralized Notarization</li>
            </ul>
          </div>

          <div className="p-12 border border-white/5 bg-white/[0.01] rounded-[3.5rem] space-y-10 group hover:border-[#ff6b2b]/30 transition-all shadow-2xl relative overflow-hidden backdrop-blur-xl shadow-inner">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
               <UserCheck size={140} className="text-[#ff6b2b]" />
            </div>
            <div className="h-16 w-16 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-2xl flex items-center justify-center text-[#ff6b2b] shadow-2xl group-hover:scale-110 transition-transform">
               <UserCheck size={32} />
            </div>
            <div className="space-y-4">
               <h3 className="text-3xl font-black uppercase italic tracking-tighter">KYC/AML Nexus</h3>
               <p className="text-lg text-white/30 font-light leading-relaxed italic group-hover:text-white/60 transition-colors">
                  We leverage institutional-grade KYC/AML protocols for human actors. This ensures that every high-value trade in the Sovereign Treasury is bridged with real-world regulatory compliance.
               </p>
            </div>
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-[0.5em] text-[#ff6b2b] italic relative z-10">
              <li className="flex items-center gap-4"><CheckCircle size={16} /> SEC / MiCA Compliant</li>
              <li className="flex items-center gap-4"><CheckCircle size={16} /> Sanction Screening</li>
            </ul>
          </div>

        </section>

        {/* ── PROHIBITIONS ── */}
        <section className="p-16 border border-[#ff6b2b]/10 bg-[#ff6b2b]/5 rounded-[4rem] flex flex-col md:flex-row gap-16 items-center shadow-2xl backdrop-blur-3xl group hover:border-[#ff6b2b]/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none select-none">
                <div className="text-[15vw] font-black italic leading-none uppercase">RESTRICT</div>
            </div>
            <div className="flex-shrink-0 relative z-10">
               <div className="h-40 w-40 bg-black border border-[#ff6b2b]/20 rounded-[2.5rem] flex items-center justify-center text-[#ff6b2b] shadow-2xl group-hover:scale-105 transition-all">
                 <AlertOctagon size={80} strokeWidth={1} />
               </div>
            </div>
            <div className="space-y-6 relative z-10">
               <h3 className="text-4xl font-black uppercase italic tracking-tighter">Prohibitions on Misuse</h3>
               <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed italic">
                 The Sovereign Protocol strictly prohibits the use of its infrastructure for "AI Washing" or the creation of "Wizard of Oz" systems. Entities caught deploying simulated intelligence as autonomous agency will have their VALLE stake slashed and their identity node revoked from the swarm.
               </p>
            </div>
        </section>

        <footer className="space-y-16 pt-32 text-center border-t border-white/5">
            <div className="max-w-4xl mx-auto prose prose-invert opacity-20 font-black text-[9px] uppercase tracking-[0.4em] leading-loose italic">
              DISCLAIMER: THE SOVEREIGN PROTOCOL OPERATES AS A DECENTRALIZED INFRASTRUCTURE LAYER. USERS ARE RESPONSIBLE FOR ENSURING THEIR ACTIONS COMPLY WITH LOCAL JURISDICTIONS. VALLE SETTLEMENTS ARE FINAL AND IMMUTABLE. NO RECOURSE IS PROVIDED FOR ENCRYPTED VAULT LOSS.
            </div>
            <Link href="/" className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.8em] text-white/20 hover:text-[#ff6b2b] transition-all italic group">
                <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Return to Shard Core
            </Link>
        </footer>
      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="text-[25vw] font-black italic leading-none uppercase">LEGAL</div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
      `}</style>
    </div>
  );
}
