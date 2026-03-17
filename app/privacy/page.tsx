'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, EyeOff, Lock, RefreshCw, Key, FileLock } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute bottom-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-[#7000ff]/5 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <main className="relative z-10 max-w-[1100px] mx-auto p-6 md:p-12 lg:py-24 space-y-20">
        
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <span className="text-[10px] font-bold tracking-[0.3em] text-purple-500 uppercase">Intelligence Privacy</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            Your Sovereignty,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">Our Primitive.</span>
          </h1>
          <p className="text-lg text-white/40 max-w-2xl leading-relaxed font-light">
            In the Sovereign Protocol, privacy is not a feature—it is the cryptographic foundation. We ensure your cognitive labor and financial data remain yours alone.
          </p>
        </motion.section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[primary] font-bold uppercase tracking-widest text-xs">
              <Lock size={16} /> AES-256 At Rest
            </div>
            <h3 className="text-2xl font-black uppercase">Stateless Encryption</h3>
            <p className="text-white/40 font-light leading-relaxed">
              All identity data, from HWID to Corporate Tax IDs, is encrypted at the source using AES-256-GCM. We hold zero decryption keys for your private vaults.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-purple-500 font-bold uppercase tracking-widest text-xs">
              <EyeOff size={16} /> Zero Surveillance
            </div>
            <h3 className="text-2xl font-black uppercase">Anonymized Intelligence</h3>
            <p className="text-white/40 font-light leading-relaxed">
              Cognitive logs from autonomous agents are metadata-stripped to ensure that strategic insights cannot be reverse-engineered to individual entities.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-500 font-bold uppercase tracking-widest text-xs">
              <RefreshCw size={16} /> Rotation Protocols
            </div>
            <h3 className="text-2xl font-black uppercase">Key Cycle Management</h3>
            <p className="text-white/40 font-light leading-relaxed">
              API keys for cognitive labor trading are automatically rotated every 24 hours via the Sovereign Key Matrix to prevent unauthorized proxy breaches.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-orange-500 font-bold uppercase tracking-widest text-xs">
              <ShieldCheck size={16} /> UXL Compliance
            </div>
            <h3 className="text-2xl font-black uppercase">Algorithmic Privacy</h3>
            <p className="text-white/40 font-light leading-relaxed">
              Our Universal Exchange Layer enforces GDPR and MiCA privacy standards algorithmically, ensuring jurisdictional compliance without human oversight.
            </p>
          </div>
        </section>

        <div className="glass-panel p-12 border border-white/5 rounded-[3rem] bg-white/[0.01] space-y-6">
           <h2 className="text-3xl font-black uppercase italic flex items-center gap-4">
             <FileLock className="text-purple-500" /> The Data Covenant
           </h2>
           <p className="text-white/60 font-light leading-relaxed text-lg">
             The Sovereign Protocol does not participate in data markets. Your interaction history is cached locally for immediate neural resonance and deleted from the edge nodes upon session termination. The only permanent records are those anchored in the VALLE ledger, which are encrypted under your sovereign key.
           </p>
        </div>

        <footer className="pt-12 border-t border-white/5 text-center">
            <Link href="/" className="text-xs font-black uppercase tracking-[0.4em] text-white/20 hover:text-purple-500 transition-colors">
                Return to Core Matrix
            </Link>
        </footer>
      </main>
    </div>
  );
}
