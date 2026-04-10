'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Stethoscope, 
  Droplets, 
  Lightbulb, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Users,
  Building2,
  ChevronLeft,
  Target,
  FlaskConical,
  Zap,
  Globe,
  Radio,
  Wifi,
  Terminal,
  ShieldHalf,
  Database
} from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function AidApplicationPage() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
     identity: '',
     location: '',
     description: '',
     urgency: 'MEDIUM',
     email: '',
     phone: '',
     payoutAddress: '',
     payoutCurrency: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'HEALTH', label: 'Medical & New Medicine', icon: <Stethoscope size={32} />, description: 'Emergency treatment or funding for revolutionary drug research.' },
    { id: 'POVERTY', label: 'Extreme Poverty Relief', icon: <Droplets size={32} />, description: 'Food security, clean water, and foundational shelter support.' },
    { id: 'ENERGY', label: 'Energy Grid Optimization', icon: <Lightbulb size={32} />, description: 'Developing cost-efficient, sustainable power for communities.' },
    { id: 'SOCIETY', label: 'Civil Associations', icon: <Users size={32} />, description: 'Supporting non-profits and groups dedicated to human progress.' }
  ];

  const handleApply = async () => {
    if (!formData.identity || !formData.description) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/agents/aid-investigator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setStep(3);
      } else {
        alert('Nexus Sync Failure (API rejection). Please check parameters.');
      }
    } catch (e) {
      console.error('Sovereign Bridge Failure:', e);
      alert('Total Sync Collapse. Check your neural connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden pb-40 relative">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[300px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-3xl">
         <Link href="/donate" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic leading-none active:scale-95">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Back to Donations
         </Link>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
                <ShieldCheck size={16} /> Sovereign Aid Protocol v7.0 OMEGA
            </div>
         </div>
      </header>

      <main className="relative z-10 max-w-[1400px] mx-auto px-8 py-24 lg:py-32 space-y-32">
        
        {/* ── PROGRESS MATRIX ── */}
        <div className="flex justify-between items-center max-w-xl mx-auto relative px-10">
           <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: `${(step / 3) * 100}%` }}
                    className="h-full bg-gradient-to-r from-[#ff6b2b] to-white/40 shadow-[0_0_20px_#ff6b2b]"
                />
           </div>
           {[1, 2, 3].map(s => (
             <div key={s} className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center font-black text-lg z-10 transition-all duration-700 border-2 ${step >= s ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-[0_0_40px_rgba(255,107,43,0.4)]' : 'bg-[#050505] text-white/10 border-white/5'}`}>
                {s}
                {step === s && <div className="absolute -inset-4 bg-[#ff6b2b]/20 blur-xl rounded-full -z-10 animate-pulse" />}
             </div>
           ))}
        </div>

        <section className="space-y-24">
            <AnimatePresence mode="wait">
               {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.8 }} className="space-y-24">
                     <div className="text-center space-y-10">
                        <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl">
                            <Target size={20} className="text-[#ff6b2b]" />
                            <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none">Directive Extraction</span>
                        </div>
                        <h1 className="text-7xl lg:text-[10rem] font-black uppercase italic tracking-tighter leading-[0.8] italic">Define <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">Need.</span></h1>
                        <p className="text-white/40 text-2xl font-light max-w-2xl mx-auto italic leading-relaxed">Select the fundamental sector of intervention required for the OMEGA swarm to investigate.</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {categories.map((cat, i) => (
                           <motion.button 
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              key={cat.id}
                              onClick={() => { setCategory(cat.id); setStep(2); }}
                              className="group p-12 bg-white/[0.01] border border-white/5 rounded-[4rem] text-left hover:border-[#ff6b2b]/40 transition-all shadow-2xl hover:bg-white/[0.03] backdrop-blur-3xl relative overflow-hidden shadow-inner translate-y-0 hover:-translate-y-2"
                           >
                              <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
                                 {cat.icon}
                              </div>
                              <div className="h-20 w-20 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-[2rem] flex items-center justify-center text-[#ff6b2b] mb-12 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                                 {cat.icon}
                              </div>
                              <h3 className="text-3xl font-black uppercase italic group-hover:text-[#ff6b2b] transition-colors tracking-tighter leading-tight">{cat.label}</h3>
                              <p className="mt-6 text-white/30 text-[11px] leading-relaxed uppercase tracking-[0.2em] font-black italic">{cat.description}</p>
                           </motion.button>
                        ))}
                     </div>
                  </motion.div>
               )}

               {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.8 }} className="space-y-24">
                     <div className="text-center space-y-10">
                        <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl">
                            <Terminal size={20} className="text-[#ff6b2b]" />
                            <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none">Neural Data Entry</span>
                        </div>
                        <h1 className="text-7xl lg:text-[10rem] font-black uppercase italic tracking-tighter leading-[0.8] italic">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">Docket.</span></h1>
                        <p className="text-white/40 text-2xl font-light max-w-2xl mx-auto italic leading-relaxed">Provide the raw environmental and logistical data for our autonomous investigator swarm to analyze.</p>
                     </div>

                     <div className="p-12 lg:p-24 border border-white/10 rounded-[5rem] bg-[#050505]/60 backdrop-blur-3xl space-y-16 shadow-[0_80px_150px_rgba(0,0,0,0.95)] max-w-6xl mx-auto relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent shadow-[0_0_20px_#ff6b2b]" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="space-y-4">
                              <label className="text-[11px] text-white/20 uppercase font-black tracking-[0.6em] italic pl-6 flex items-center gap-3">
                                 <Users size={14} className="text-[#ff6b2b]" /> Target Identity / Entity
                              </label>
                              <input 
                                 value={formData.identity} onChange={(e) => setFormData({...formData, identity: e.target.value})}
                                 type="text" placeholder="Individual or Institution Name" 
                                 className="w-full bg-black/60 border border-white/10 p-10 rounded-[2.5rem] outline-none focus:border-[#ff6b2b]/50 focus:bg-[#ff6b2b]/5 transition-all text-2xl font-light italic text-white placeholder:text-white/5" />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[11px] text-white/20 uppercase font-black tracking-[0.6em] italic pl-6 flex items-center gap-3">
                                 <Globe size={14} className="text-[#ff6b2b]" /> Global Coordinates
                              </label>
                              <input 
                                 value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                                 type="text" placeholder="Country, City, or Neural Node" 
                                 className="w-full bg-black/60 border border-white/10 p-10 rounded-[2.5rem] outline-none focus:border-[#ff6b2b]/50 focus:bg-[#ff6b2b]/5 transition-all text-2xl font-light italic text-white placeholder:text-white/5" />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="space-y-4">
                              <label className="text-[11px] text-white/20 uppercase font-black tracking-[0.6em] italic pl-6 flex items-center gap-3">
                                 <Wifi size={14} className="text-[#ff6b2b]" /> Transmission Email
                              </label>
                              <input 
                                 value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                                 type="email" placeholder="contact@omega.network" 
                                 className="w-full bg-black/60 border border-white/10 p-10 rounded-[2.5rem] outline-none focus:border-[#ff6b2b]/50 focus:bg-[#ff6b2b]/5 transition-all text-2xl font-light italic text-white placeholder:text-white/5" />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[11px] text-white/20 uppercase font-black tracking-[0.6em] italic pl-6 flex items-center gap-3">
                                 <Radio size={14} className="text-[#ff6b2b]" /> Neural Link (Phone)
                              </label>
                              <input 
                                 value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                 type="tel" placeholder="+ (Ω) - HIGH_SECURE" 
                                 className="w-full bg-black/60 border border-white/10 p-10 rounded-[2.5rem] outline-none focus:border-[#ff6b2b]/50 focus:bg-[#ff6b2b]/5 transition-all text-2xl font-light italic text-white placeholder:text-white/5" />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="space-y-4">
                              <label className="text-[11px] text-white/20 uppercase font-black tracking-[0.6em] italic pl-6 flex items-center gap-3">
                                 <Database size={14} className="text-[#ff6b2b]" /> Payout Handshake
                              </label>
                              <input 
                                 value={formData.payoutAddress} onChange={(e) => setFormData({...formData, payoutAddress: e.target.value})}
                                 type="text" placeholder="Wallet or IBAN Cipher" 
                                 className="w-full bg-black/60 border border-white/10 p-10 rounded-[2.5rem] outline-none focus:border-[#ff6b2b]/50 focus:bg-[#ff6b2b]/5 transition-all text-2xl font-light italic text-white placeholder:text-white/5" />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[11px] text-white/20 uppercase font-black tracking-[0.6em] italic pl-6 flex items-center gap-3">
                                 <Zap size={14} className="text-[#ff6b2b]" /> Settlement Asset
                              </label>
                              <input 
                                 value={formData.payoutCurrency} onChange={(e) => setFormData({...formData, payoutCurrency: e.target.value})}
                                 type="text" placeholder="USD, SOL, OMEGA, BTC..." 
                                 className="w-full bg-black/60 border border-white/10 p-10 rounded-[2.5rem] outline-none focus:border-[#ff6b2b]/50 focus:bg-[#ff6b2b]/5 transition-all text-2xl font-light italic text-white placeholder:text-white/5" />
                           </div>
                        </div>

                        <div className="space-y-4">
                           <label className="text-[11px] text-white/20 uppercase font-black tracking-[0.6em] italic pl-10 flex items-center gap-4">
                              <Activity size={18} className="text-[#ff6b2b] animate-pulse" /> Detailed Situation Protocol
                           </label>
                           <textarea 
                              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                              rows={8} placeholder="Define the crisis, scope, and objective of this intervention in full detail for investigator agents..." 
                              className="w-full bg-black/60 border border-white/10 p-12 rounded-[3.5rem] outline-none focus:border-[#ff6b2b]/50 focus:bg-[#ff6b2b]/5 transition-all resize-none text-2xl font-light leading-relaxed italic text-white placeholder:text-white/5 scrollbar-hide" />
                        </div>

                        <button 
                           onClick={handleApply}
                           disabled={isSubmitting || !formData.identity || !formData.description}
                           className="w-full py-12 bg-[#ff6b2b] text-black font-black uppercase tracking-[1em] text-sm rounded-[3.5rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_40px_100px_rgba(255,107,43,0.3)] flex items-center justify-center gap-8 group relative overflow-hidden italic shadow-2xl"
                        >
                           {isSubmitting ? (
                              <div className="flex items-center gap-6">
                                <Activity size={32} className="animate-spin" strokeWidth={3} />
                                INVESTIGATION_LIVE_CALIBRATION...
                              </div>
                           ) : (
                              <>
                                 SUBMIT_FOR_SWARM_INVESTIGATION <ArrowRight size={32} className="group-hover:translate-x-3 transition-transform duration-500" strokeWidth={3} />
                              </>
                           )}
                           <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                        </button>
                     </div>
                  </motion.div>
               )}

               {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1 }} className="text-center space-y-24 py-32">
                     <div className="w-56 h-56 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/30 rounded-[5rem] flex items-center justify-center mx-auto text-[#ff6b2b] shadow-[0_0_120px_rgba(255,107,43,0.2)] relative overflow-hidden group">
                        <Activity size={96} strokeWidth={1} className="animate-pulse relative z-10" />
                        <div className="absolute inset-0 bg-[#ff6b2b]/5 animate-ping opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-[1px] bg-[#ff6b2b]/40 animate-scan" />
                        </div>
                     </div>
                     <div className="space-y-12">
                        <h2 className="text-8xl lg:text-[12rem] font-black uppercase italic tracking-tighter leading-none italic">Synced.</h2>
                        <p className="text-white/40 text-3xl font-light max-w-4xl mx-auto leading-relaxed italic">
                           Your application is being processed by the autonomous **OMEGA Aid Swarm**. <br/> Calculating Need Resonance across 14,000+ data nodes.
                        </p>
                        <div className="text-[12px] text-[#ff6b2b] font-black uppercase tracking-[1em] pt-16 animate-pulse italic">
                           DECODING_GLOBAL_IMPACT_VECTORS...
                        </div>
                     </div>
                     <div className="pt-24 flex justify-center gap-10">
                        <Link href="/" className="px-20 py-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] font-black uppercase tracking-[0.6em] text-xs hover:bg-[#ff6b2b] hover:text-black hover:border-[#ff6b2b] transition-all italic text-white/20 shadow-2xl">
                           Return to Matrix Root
                        </Link>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
        </section>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="text-[25vw] font-black italic italic leading-none uppercase">SOVEREIGN</div>
      </div>
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { 0% { transform: translateY(-100px); } 100% { transform: translateY(100px); } }
        .animate-scan { animation: scan 3s ease-in-out infinite alternate; }
      `}</style>
    </div>
  );
}
