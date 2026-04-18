'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, EyeOff, Lock, RefreshCw, Key, FileLock, ChevronLeft, ShieldAlert, Target, Terminal, Orbit, Wifi, Zap } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[300px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
         <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
         </Link>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
                <ShieldCheck size={16} /> OMEGA_v7.0_SECURED
            </div>
         </div>
      </header>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32">
        
        {/* ── HERO SECTION ── */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl">
            <Orbit size={20} className="text-[#ff6b2b] animate-spin-slow" />
            <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none">Intelligence Privacy Protocol</span>
          </div>
          <div className="space-y-8">
            <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] italic">
              Your Sovereignty,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/20">Our Primitive.</span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/40 max-w-4xl mx-auto leading-relaxed font-light italic">
              In the OMEGA ecosystem, privacy isn't a feature—it's the cryptographic foundation. We ensure your cognitive labor and financial artifacts remain under your absolute control.
            </p>
          </div>
        </motion.section>

        {/* ── PILLARS OF PRIVACY ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { icon: <Lock size={32} />, label: 'AES-256 AT REST', title: 'Stateless Encryption', desc: 'All identity artifacts are encrypted at the source using AES-256-GCM. We hold zero decryption keys for your private OMEGA vaults.' },
            { icon: <EyeOff size={32} />, label: 'ZERO SURVEILLANCE', title: 'Anonymized Intel', desc: 'Cognitive logs from your investigator swarms are metadata-stripped to ensure that strategic insights cannot be reverse-engineered.' },
            { icon: <RefreshCw size={32} />, label: 'ROTATION PROTOCOLS', title: 'Key Cycle Flux', desc: 'API keys for cognitive labor are automatically rotated via the OMEGA Key Matrix, preventing unauthorized proxy breaches.' },
            { icon: <ShieldAlert size={32} />, label: 'UXL COMPLIANCE', title: 'Algorithmic Shield', desc: 'Our Universal Exchange Layer enforces global privacy standards algorithmically, ensuring jurisdictional immunity through decentralized nodes.' }
          ].map((item, i) => (
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               key={i} 
               className="p-8 md:p-12 bg-white/[0.01] border border-white/5 responsive-rounded backdrop-blur-3xl hover:border-[#ff6b2b]/40 transition-all group shadow-2xl relative overflow-hidden shadow-inner"
            >
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                 {item.icon}
              </div>
              <div className="flex items-center gap-6 text-[#ff6b2b] font-black uppercase tracking-[0.4em] text-[11px] italic mb-10">
                <div className="h-14 w-14 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    {item.icon}
                </div>
                <span>{item.label}</span>
              </div>
              <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white/90 group-hover:text-[#ff6b2b] transition-colors leading-tight">{item.title}</h3>
              <p className="text-white/30 font-light leading-relaxed italic text-xl mt-6">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </section>

        {/* ── THE COVENANT ── */}
        <div className="p-8 md:p-16 lg:p-24 border border-white/10 responsive-rounded bg-[#050505]/60 backdrop-blur-3xl space-y-12 shadow-[0_80px_150px_rgba(0,0,0,0.95)] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-24 opacity-[0.02] group-hover:scale-110 transition-transform duration-2000">
              <FileLock size={300} className="text-[#ff6b2b]" />
           </div>
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent shadow-[0_0_20px_#ff6b2b]" />
           
           <h2 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter flex items-center gap-8 relative z-10 leading-none">
             <div className="h-20 w-20 bg-[#ff6b2b] text-black rounded-[2rem] flex items-center justify-center shadow-2xl">
                <FileLock size={40} strokeWidth={3} />
             </div>
             The Data Covenant
           </h2>
           <p className="text-white/60 font-light leading-[1.6] text-2xl lg:text-4xl italic relative z-10 tracking-tight">
             The OMEGA Protocol does not participate in data markets. Your interaction history is cached locally for immediate neural resonance and purged upon session termination. The only permanent records are anchored in the sovereign ledger, encrypted under your definitive key.
           </p>
           
           <div className="pt-12 border-t border-white/5 flex items-center gap-6 text-[12px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] italic leading-none animate-pulse">
              <Wifi size={16} /> SOVEREIGN_ENCRYPTION_LAYER_ACTIVE
           </div>
        </div>

        <footer className="pt-24 border-t border-white/5 text-center">
            <Link href="/" className="text-[12px] font-black uppercase tracking-[1em] text-white/10 hover:text-[#ff6b2b] transition-all italic leading-none py-4 px-10 border border-transparent hover:border-[#ff6b2b]/20 rounded-full">
                EXIT_PRIVACY_MATRIX
            </Link>
        </footer>
      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="text-[25vw] font-black italic italic leading-none uppercase">PRIVACY</div>
      </div>
      
      <style jsx global>{`
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
