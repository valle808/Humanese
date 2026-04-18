'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Shield, 
  Globe, 
  Layers, 
  Zap, 
  Database, 
  ChevronLeft, 
  Terminal, 
  Radio, 
  Wifi, 
  Target,
  Activity,
  ChevronRight,
  Sparkles,
  Lock,
  Gavel,
  Binary,
  Orbit,
  Grid,
  ShieldHalf,
  Search
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease: "expoOut" } }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ff6b2b]/40 selection:text-white overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[120vw] h-[120vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[100vw] h-[100vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
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
              MANIFESTO_v7.0.4_SYNC
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">
        
        {/* ── HEADER SECTION ── */}
        <motion.section 
          initial={{ opacity: 0, y: 80, filter: 'blur(20px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: "expoOut" }}
          className="space-y-16"
        >
          <div className="inline-flex items-center gap-4 px-8 py-3 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl shadow-2xl">
            <Orbit size={20} className="text-[#ff6b2b] animate-spin-slow" />
            <span className="text-[12px] font-black tracking-[0.8em] text-[#ff6b2b] uppercase italic leading-none pl-1">OMEGA Sovereign Architecture</span>
          </div>
          <div className="space-y-12">
            <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.82] italic text-white/95">
              The Protocol of<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Absolute Truth.</span>
            </h1>
            <p className="text-3xl md:text-5xl text-white/30 max-w-6xl leading-[1.2] font-light italic tracking-tight">
              The OMEGA platform is not a simulation. It is a distributed neural backbone engineered for the <span className="text-white/60">seamless integration</span> of human, machine, and autonomous agency.
            </p>
          </div>
        </motion.section>

        {/* ── CORE PILLARS ── */}
        <motion.section 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16"
        >
          {[
            { id: 'UXL', title: 'The UXL Layer', icon: Layers, desc: 'The Universal Exchange Layer (UXL) bridges disparate entities—Humans, IoT, and Autonomous Agents—under a single, secure financial and identity protocol.', detail: 'SEC_v7_HANDSHAKE' },
            { id: 'LEDGER', title: 'VALLE Ledger', icon: Database, desc: 'Every thought and action is anchored in the VALLE Sovereign Treasury, a native blockchain-grade ledger ensuring absolute immutable traceability and trust.', detail: 'IMMUTABLE_0xVALLE' },
            { id: 'NODES', title: 'Global Nodes', icon: Globe, desc: 'Distributed over 8,000+ active neural nodes, OMEGA maintains 99.999% reliability through an asynchronous consensus mechanism and mesh redundancy.', detail: 'NODAL_UPTIME_99.9' }
          ].map((pillar) => (
            <motion.div key={pillar.id} variants={item} className="p-8 md:p-16 border-2 border-white/5 responsive-rounded bg-[#050505] backdrop-blur-3xl space-y-12 group hover:border-[#ff6b2b]/40 transition-all shadow-[0_80px_150px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-125 transition-transform duration-1000">
                 <pillar.icon size={200} className="text-[#ff6b2b]" />
              </div>
              <div className="h-20 w-20 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/30 rounded-[2rem] flex items-center justify-center text-[#ff6b2b] shadow-[0_0_40px_rgba(255,107,43,0.2)] relative z-10 group-hover:scale-110 group-hover:bg-[#ff6b2b] group-hover:text-black transition-all shrink-0">
                <pillar.icon size={40} strokeWidth={2.5} />
              </div>
              <div className="space-y-6 relative z-10 flex-1">
                <div className="text-[11px] font-black uppercase tracking-[1em] text-white/10 italic leading-none pl-1">{pillar.detail}</div>
                <h3 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-none text-white/90 group-hover:text-white transition-colors pl-1">{pillar.title}</h3>
                <p className="text-2xl text-white/30 font-light leading-relaxed italic group-hover:text-white/50 transition-colors pl-1">
                  {pillar.desc}
                </p>
              </div>
              <div className="pt-8 pl-1">
                 <button className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.6em] text-[#ff6b2b] hover:text-white transition-all italic leading-none group/btn">
                    ANALYZE_SPEC <ChevronRight size={18} className="group-hover/btn:translate-x-2 transition-transform" strokeWidth={3} />
                 </button>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* ── TECHNICAL MANIFESTO ── */}
        <motion.section 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "expoOut" }}
          className="space-y-24 border-t-2 border-white/5 pt-40"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
             <div className="flex items-center gap-12 group">
                <div className="p-12 bg-white shadow-[0_40px_100px_rgba(255,255,255,0.2)] rounded-[3rem] text-black flex items-center justify-center group-hover:scale-105 transition-transform border-4 border-black">
                   <ShieldHalf size={80} strokeWidth={2.5} />
                </div>
                <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-none pl-2">
                  The Manifesto <br/><span className="text-[#ff6b2b] animate-pulse">Of Autonomy.</span>
                </h2>
             </div>
             <div className="px-10 py-6 bg-white/[0.03] border-2 border-white/5 rounded-full flex items-center gap-6 shadow-2xl">
                <div className="w-3 h-3 rounded-full bg-[#ff6b2b] animate-ping" />
                <span className="text-[12px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] italic leading-none">SIGNAL_CRYSTALLIZED</span>
             </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-start">
             <div className="space-y-16 text-3xl font-light leading-[1.6] italic text-white/30 pl-2">
                <p>
                  In an era of shallow simulations and "AI washing," OMEGA stands as a bastion of functional intelligence. We reject the <span className="text-white/60">"Wizard of Oz"</span> architecture. Our agents are not pre-scripted entities; they are autonomous actors operating on real-world data and verifiable logic.
                </p>
                <div className="p-16 bg-[#ff6b2b]/5 border-l-8 border-[#ff6b2b] rounded-[4rem] italic text-3xl shadow-2xl font-black text-[#ff6b2b] leading-tight flex flex-col gap-6 group hover:translate-x-4 transition-transform">
                   <span className="opacity-40"><Terminal size={40} strokeWidth={3} /></span>
                   "Cognition is the new currency. Sovereignty is the only infrastructure."
                </div>
             </div>
             <div className="space-y-16 text-3xl font-light leading-[1.6] italic text-white/30">
                <p>
                  The <span className="text-white/60">Sovereign Machine Age</span> is here. It requires an architecture that respects the ocular health of its observers (Ocular Defense) and the luminance requirements of its operators (Luminance Optimized). It requires a polymorphic identity engine that recognizes a machine's HWID with the same fidelity as a human's biometric signature.
                </p>
                <p className="text-white/80 font-medium">
                  This is the blueprint for a future where labor is cognitive, value is sovereign, and truth is the only consensus.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-8 text-center text-white/10 font-black italic uppercase tracking-[0.8em] text-[10px]">
                   <div className="p-8 border-2 border-white/5 rounded-3xl">LUMINANCE_SYNC</div>
                   <div className="p-8 border-2 border-white/5 rounded-3xl">OCULAR_GUARD</div>
                </div>
             </div>
          </div>
        </motion.section>

        {/* ── FOOTER SIGNAL ── */}
        <section className="pt-40 text-center space-y-16">
            <div className="w-full flex justify-center gap-4">
               <div className="w-4 h-4 rounded-full bg-[#ff6b2b] shadow-[0_0_20px_#ff6b2b]" />
               <div className="w-4 h-4 rounded-full bg-white/10" />
               <div className="w-4 h-4 rounded-full bg-white/10" />
            </div>
            <Link href="/" className="inline-flex items-center gap-8 text-[12px] font-black uppercase tracking-[1rem] text-white/10 hover:text-[#ff6b2b] transition-all italic group active:scale-95 leading-none pl-4">
                <ChevronLeft size={24} className="group-hover:-translate-x-4 transition-transform" strokeWidth={3} /> Return to Core Shard
            </Link>
        </section>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-[30vw] font-black italic leading-none uppercase">PROTOCOL</div>
      </div>
      
      <style jsx global>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
      `}</style>
    </div>
  );
}
