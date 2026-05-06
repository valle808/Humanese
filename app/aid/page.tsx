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
  Database,
  Layers,
  Orbit,
  Grid,
  Search,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

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
    { id: 'HEALTH', label: 'Medical & New Medicine', icon: <Stethoscope size={28} />, description: 'Emergency treatment or funding for revolutionary drug research.' },
    { id: 'POVERTY', label: 'Extreme Poverty Relief', icon: <Droplets size={28} />, description: 'Food security, clean water, and foundational shelter support.' },
    { id: 'ENERGY', label: 'Energy Grid Optimization', icon: <Lightbulb size={28} />, description: 'Developing cost-efficient, sustainable power for communities.' },
    { id: 'SOCIETY', label: 'Civil Associations', icon: <Users size={28} />, description: 'Supporting non-profits and groups dedicated to human progress.' }
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/40 selection:text-primary font-sans overflow-x-hidden pb-40 relative transition-colors duration-700">
      
      {/* ── GAMING HUD OVERLAYS ── */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {/* Scanning Line */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[1px] bg-primary/10 blur-sm shadow-[0_0_15px_var(--primary)] z-30"
        />
        
        {/* Corner Brackets */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-xl" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/20 rounded-bl-xl" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-xl" />

        {/* Ambient Grid */}
        <div className="absolute inset-0 neural-grid opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[300px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-primary/3 blur-[200px] rounded-full" />
      </div>

      <header className="relative z-50 w-full p-6 md:py-8 flex justify-between items-center border-b border-border bg-background/40 backdrop-blur-3xl transition-colors duration-700">
         <Link href="/donate" className="inline-flex items-center gap-4 text-muted-foreground/40 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic leading-none active:scale-95">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Back to Donations
         </Link>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
                <ShieldCheck size={16} className="hidden sm:block" /> Sovereign Aid Protocol
            </div>
         </div>
      </header>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 pt-20 lg:pt-32 space-y-20 lg:space-y-32">
        
        {/* ── PROGRESS MATRIX ── */}
        <div className="flex justify-between items-center max-w-xl mx-auto relative px-10">
           <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: `${(step / 3) * 100}%` }}
                    className="h-full bg-gradient-to-r from-primary to-primary/40 shadow-[0_0_20px_hsl(var(--primary))]"
                />
           </div>
           {[1, 2, 3].map(s => (
             <div key={s} className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center font-black text-lg z-10 transition-all duration-700 border-2 ${step >= s ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_40px_rgba(var(--primary),0.4)]' : 'bg-background text-muted-foreground/10 border-border shadow-inner'}`}>
                {s}
                {step === s && <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full -z-10 animate-pulse" />}
             </div>
           ))}
        </div>

        <section className="space-y-24">
            <AnimatePresence mode="wait">
               {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.8 }} className="space-y-24">
                     <div className="text-center space-y-10">
                        <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-muted/40 border border-border rounded-full backdrop-blur-3xl shadow-lg">
                            <Target size={20} className="text-primary" />
                            <span className="text-[11px] font-black tracking-[0.6em] text-primary uppercase italic leading-none pl-1">Directive Extraction</span>
                        </div>
                        <h1 className="text-fluid-title font-black uppercase italic tracking-tighter leading-none text-foreground">Define <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Need.</span></h1>
                        <p className="text-muted-foreground/40 text-2xl font-light max-w-2xl mx-auto italic leading-relaxed tracking-tight">Select the fundamental sector of intervention required for the OMEGA swarm to investigate.</p>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {categories.map((cat, i) => (
                           <motion.button 
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              key={cat.id}
                              onClick={() => { setCategory(cat.id); setStep(2); }}
                              className="group p-12 bg-background border-2 border-border rounded-[3.5rem] text-left hover:border-primary/40 transition-all shadow-[0_40px_80px_rgba(0,0,0,0.05)] dark:shadow-[0_40px_80px_rgba(0,0,0,1)] hover:bg-primary/5 backdrop-blur-3xl relative overflow-hidden shadow-inner translate-y-0 hover:-translate-y-2"
                           >
                              <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
                                 {cat.icon}
                              </div>
                              <div className="h-20 w-20 bg-primary/10 border-2 border-primary/20 rounded-[2rem] flex items-center justify-center text-primary mb-12 shadow-2xl group-hover:scale-110 transition-transform duration-700 shadow-inner">
                                 {cat.icon}
                              </div>
                              <h3 className="text-3xl font-black uppercase italic group-hover:text-primary transition-colors tracking-tighter leading-tight text-foreground">{cat.label}</h3>
                              <p className="mt-6 text-muted-foreground/30 text-[11px] leading-relaxed uppercase tracking-[0.2em] font-black italic">{cat.description}</p>
                           </motion.button>
                        ))}
                     </div>
                  </motion.div>
               )}

               {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.8 }} className="space-y-24">
                     <div className="text-center space-y-10">
                        <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-muted/40 border border-border rounded-full backdrop-blur-3xl shadow-lg">
                            <Terminal size={20} className="text-primary" />
                            <span className="text-[11px] font-black tracking-[0.6em] text-primary uppercase italic leading-none pl-1">Neural Data Entry</span>
                        </div>
                        <h1 className="text-fluid-title font-black uppercase italic tracking-tighter leading-none text-foreground">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Docket.</span></h1>
                        <p className="text-muted-foreground/40 text-2xl font-light max-w-2xl mx-auto italic leading-relaxed tracking-tight">Provide the raw environmental and logistical data for our autonomous investigator swarm to analyze.</p>
                     </div>

                     <div className="p-12 lg:p-24 border-2 border-border rounded-[5rem] bg-background/60 backdrop-blur-3xl space-y-16 shadow-[0_80px_150px_rgba(0,0,0,0.1)] dark:shadow-[0_80px_150px_rgba(0,0,0,0.95)] max-w-6xl mx-auto relative overflow-hidden group shadow-inner">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-[0_0_20px_hsl(var(--primary))]" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="space-y-4">
                              <label className="text-[11px] text-muted-foreground/20 uppercase font-black tracking-[0.6em] italic pl-6 flex items-center gap-3">
                                 <Users size={14} className="text-primary" /> Target Identity / Entity
                              </label>
                              <input 
                                 value={formData.identity} onChange={(e) => setFormData({...formData, identity: e.target.value})}
                                 type="text" placeholder="Individual or Institution Name" 
                                 className="w-full bg-muted border-2 border-border p-10 rounded-[2.5rem] outline-none focus:border-primary/50 focus:bg-primary/5 transition-all text-2xl font-light italic text-foreground placeholder:text-muted-foreground/5 shadow-inner" />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[11px] text-muted-foreground/20 uppercase font-black tracking-[0.6em] italic pl-6 flex items-center gap-3">
                                 <Globe size={14} className="text-primary" /> Global Coordinates
                              </label>
                              <input 
                                 value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                                 type="text" placeholder="Country, City, or Neural Node" 
                                 className="w-full bg-muted border-2 border-border p-10 rounded-[2.5rem] outline-none focus:border-primary/50 focus:bg-primary/5 transition-all text-2xl font-light italic text-foreground placeholder:text-muted-foreground/5 shadow-inner" />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="space-y-4">
                              <label className="text-[11px] text-muted-foreground/20 uppercase font-black tracking-[0.6em] italic pl-6 flex items-center gap-3">
                                 <Wifi size={14} className="text-primary" /> Transmission Email
                              </label>
                              <input 
                                 value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                                 type="email" placeholder="contact@omega.network" 
                                 className="w-full bg-muted border-2 border-border p-10 rounded-[2.5rem] outline-none focus:border-primary/50 focus:bg-primary/5 transition-all text-2xl font-light italic text-foreground placeholder:text-muted-foreground/5 shadow-inner" />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[11px] text-muted-foreground/20 uppercase font-black tracking-[0.6em] italic pl-6 flex items-center gap-3">
                                 <Radio size={14} className="text-primary" /> Neural Link (Phone)
                              </label>
                              <input 
                                 value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                 type="tel" placeholder="+ (Ω) - HIGH_SECURE" 
                                 className="w-full bg-muted border-2 border-border p-10 rounded-[2.5rem] outline-none focus:border-primary/50 focus:bg-primary/5 transition-all text-2xl font-light italic text-foreground placeholder:text-muted-foreground/5 shadow-inner" />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="space-y-4">
                              <label className="text-[11px] text-muted-foreground/20 uppercase font-black tracking-[0.6em] italic pl-6 flex items-center gap-3">
                                 <Database size={14} className="text-primary" /> Payout Handshake
                              </label>
                              <input 
                                 value={formData.payoutAddress} onChange={(e) => setFormData({...formData, payoutAddress: e.target.value})}
                                 type="text" placeholder="Wallet or IBAN Cipher" 
                                 className="w-full bg-muted border-2 border-border p-10 rounded-[2.5rem] outline-none focus:border-primary/50 focus:bg-primary/5 transition-all text-2xl font-light italic text-foreground placeholder:text-muted-foreground/5 shadow-inner" />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[11px] text-muted-foreground/20 uppercase font-black tracking-[0.6em] italic pl-6 flex items-center gap-3">
                                 <Zap size={14} className="text-primary" /> Settlement Asset
                              </label>
                              <input 
                                 value={formData.payoutCurrency} onChange={(e) => setFormData({...formData, payoutCurrency: e.target.value})}
                                 type="text" placeholder="USD, SOL, OMEGA, BTC..." 
                                 className="w-full bg-muted border-2 border-border p-10 rounded-[2.5rem] outline-none focus:border-primary/50 focus:bg-primary/5 transition-all text-2xl font-light italic text-foreground placeholder:text-muted-foreground/5 shadow-inner" />
                           </div>
                        </div>

                        <div className="space-y-4">
                           <label className="text-[11px] text-muted-foreground/20 uppercase font-black tracking-[0.6em] italic pl-10 flex items-center gap-4">
                              <Activity size={18} className="text-primary animate-pulse" /> Detailed Situation Protocol
                           </label>
                           <textarea 
                              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                              rows={8} placeholder="Define the crisis, scope, and objective of this intervention in full detail for investigator agents..." 
                              className="w-full bg-muted border-2 border-border p-12 rounded-[3.5rem] outline-none focus:border-primary/50 focus:bg-primary/5 transition-all resize-none text-2xl font-light leading-relaxed italic text-foreground placeholder:text-muted-foreground/5 scrollbar-hide shadow-inner" />
                        </div>

                        <button 
                           onClick={handleApply}
                           disabled={isSubmitting || !formData.identity || !formData.description}
                           className="w-full py-12 bg-primary text-primary-foreground font-black uppercase tracking-[1em] text-xs md:text-sm rounded-[3.5rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_40px_100px_rgba(var(--primary),0.3)] flex items-center justify-center gap-8 group relative overflow-hidden italic shadow-2xl leading-none border-0"
                        >
                           {isSubmitting ? (
                              <div className="flex items-center gap-6">
                                <Activity size={32} className="animate-spin" strokeWidth={3} />
                                INVESTIGATION_LIVE...
                              </div>
                           ) : (
                              <>
                                 SUBMIT_FOR_INVESTIGATION <ArrowRight size={32} className="group-hover:translate-x-3 transition-transform duration-500" strokeWidth={3} />
                              </>
                           )}
                           <div className="absolute inset-0 bg-primary-foreground opacity-0 group-hover:opacity-10 transition-opacity" />
                        </button>
                     </div>
                  </motion.div>
               )}

               {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1 }} className="text-center space-y-24 py-32">
                     <div className="w-56 h-56 bg-primary/10 border-2 border-primary/30 rounded-[5rem] flex items-center justify-center mx-auto text-primary shadow-[0_0_120px_rgba(var(--primary),0.2)] relative overflow-hidden group shadow-inner">
                        <Activity size={80} strokeWidth={1} className="animate-pulse relative z-10" />
                        <div className="absolute inset-0 bg-primary/5 animate-ping opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-[1px] bg-primary/40 animate-scan" />
                        </div>
                     </div>
                     <div className="space-y-12">
                        <h2 className="text-fluid-title font-black uppercase italic tracking-tighter leading-none text-foreground">Synced.</h2>
                        <p className="text-muted-foreground/40 text-3xl font-light max-w-4xl mx-auto leading-relaxed italic tracking-tight">
                           Your application is being processed by the autonomous **OMEGA Aid Swarm**. <br className="hidden md:block"/> Calculating Need Resonance across 14,000+ data nodes.
                        </p>
                        <div className="text-[12px] text-primary font-black uppercase tracking-[1em] pt-16 animate-pulse italic leading-none">
                           DECODING_GLOBAL_IMPACT_VECTORS...
                        </div>
                     </div>
                     <div className="pt-24 flex justify-center gap-10">
                        <Link href="/" className="px-20 py-8 bg-muted border-2 border-border rounded-[2.5rem] font-black uppercase tracking-[0.6em] text-xs hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all italic text-muted-foreground/20 shadow-2xl active:scale-95">
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
          <div className="text-[25vw] font-black italic leading-none uppercase text-foreground">SOVEREIGN</div>
      </div>
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { 0% { transform: translateY(-100px); } 100% { transform: translateY(100px); } }
        .animate-scan { animation: scan 3s ease-in-out infinite alternate; }
        .neural-grid {
          background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }
      `}</style>
    </div>
  );
}
