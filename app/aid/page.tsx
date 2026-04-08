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
  ChevronLeft
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
    { id: 'HEALTH', label: 'Medical & New Medicine', icon: <Stethoscope size={24} />, description: 'Emergency treatment or funding for revolutionary drug research.' },
    { id: 'POVERTY', label: 'Extreme Poverty Relief', icon: <Droplets size={24} />, description: 'Food security, clean water, and foundational shelter support.' },
    { id: 'ENERGY', label: 'Energy Grid Optimization', icon: <Lightbulb size={24} />, description: 'Developing cost-efficient, sustainable power for communities.' },
    { id: 'SOCIETY', label: 'Civil Associations', icon: <Users size={24} />, description: 'Supporting non-profits and groups dedicated to human progress.' }
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00ffc3]/30 font-sans overflow-x-hidden pb-32">
      
      {/* 🏙️ AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[80vw] h-[80vw] bg-[#00ffc3]/3 blur-[200px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[70vw] h-[70vw] bg-[#7000ff]/3 blur-[200px] rounded-full" />
      </div>

      <header className="relative z-10 w-full p-8 lg:px-14 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-3xl">
         <Link href="/donate" className="inline-flex items-center gap-2 text-white/30 hover:text-[#00ffc3] transition-colors text-[10px] font-black uppercase tracking-widest group">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Donations
         </Link>
         <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-[#00ffc3] uppercase tracking-widest">
            <ShieldCheck size={14} /> Sovereign Aid Protocol v4.0
         </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 lg:py-24 space-y-20">
        
        {/* STEPPER VISUAL */}
        <div className="flex justify-between items-center max-w-xs mx-auto mb-16 relative">
           {[1, 2, 3].map(s => (
             <div key={s} className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm z-10 transition-all ${step >= s ? 'bg-[#00ffc3] text-black shadow-[0_0_20px_rgba(0,255,195,0.4)]' : 'bg-white/5 text-white/20 border border-white/10'}`}>
                {s}
             </div>
           ))}
           <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2" />
        </div>

        <section className="space-y-16">
            <AnimatePresence mode="wait">
               {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                     <div className="text-center space-y-4">
                        <h1 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter">Define Need.</h1>
                        <p className="text-white/30 text-lg font-light max-w-2xl mx-auto italic uppercase tracking-widest">Select the category of intervention required.</p>
                     </div>

                     <div className="grid md:grid-cols-2 gap-6">
                        {categories.map(cat => (
                           <button 
                              key={cat.id}
                              onClick={() => { setCategory(cat.id); setStep(2); }}
                              className="group p-10 bg-white/[0.02] border border-white/10 rounded-[3rem] text-left hover:border-[#00ffc3]/40 transition-all shadow-xl hover:shadow-[#00ffc3]/5 hover:bg-white/[0.04]"
                           >
                              <div className="h-16 w-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-white/30 group-hover:text-[#00ffc3] group-hover:border-[#00ffc3]/40 transition-all mb-8 shadow-2xl">
                                 {cat.icon}
                              </div>
                              <h3 className="text-2xl font-black uppercase italic group-hover:text-[#00ffc3] transition-colors">{cat.label}</h3>
                              <p className="mt-2 text-white/20 text-xs leading-relaxed uppercase tracking-widest font-mono">{cat.description}</p>
                           </button>
                        ))}
                     </div>
                  </motion.div>
               )}

               {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                     <div className="text-center space-y-4">
                        <h1 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter">Investigation.</h1>
                        <p className="text-white/30 text-lg font-light max-w-2xl mx-auto italic uppercase tracking-widest">Provide the raw data for our agents to analyze.</p>
                     </div>

                     <div className="glass-panel p-10 lg:p-16 border border-white/10 rounded-[4rem] bg-gradient-to-br from-white/[0.03] to-transparent space-y-10 shadow-2xl max-w-3xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest">Target Identity / Entity</label>
                              <input 
                                 value={formData.identity} onChange={(e) => setFormData({...formData, identity: e.target.value})}
                                 type="text" placeholder="Name or Organization" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#00ffc3]/50 transition-colors" />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest">Global Coordinates / Location</label>
                              <input 
                                 value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                                 type="text" placeholder="Country, City, or Lat/Long" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#00ffc3]/50 transition-colors" />
                           </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest">Email Address</label>
                              <input 
                                 value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                                 type="email" placeholder="contact@example.com" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#00ffc3]/50 transition-colors" />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest">Phone Number</label>
                              <input 
                                 value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                 type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#00ffc3]/50 transition-colors" />
                           </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest">Bank Account or Crypto Wallet</label>
                              <input 
                                 value={formData.payoutAddress} onChange={(e) => setFormData({...formData, payoutAddress: e.target.value})}
                                 type="text" placeholder="Routing/Account or Wallet Address" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#00ffc3]/50 transition-colors" />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest">Currency for Donation</label>
                              <input 
                                 value={formData.payoutCurrency} onChange={(e) => setFormData({...formData, payoutCurrency: e.target.value})}
                                 type="text" placeholder="USD, EUR, BTC, SOL..." className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#00ffc3]/50 transition-colors" />
                           </div>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] text-white/40 uppercase font-black tracking-widest">Detailed Situation Protocol</label>
                           <textarea 
                              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                              rows={5} placeholder="Describe the crisis or project in full detail for investigator agents..." 
                              className="w-full bg-black/40 border border-white/10 p-6 rounded-[2rem] outline-none focus:border-[#00ffc3]/50 transition-colors resize-none text-sm font-light leading-relaxed" />
                        </div>

                        <button 
                           onClick={handleApply}
                           disabled={isSubmitting || !formData.identity || !formData.description}
                           className="w-full py-8 bg-[#00ffc3] text-black font-black uppercase tracking-[0.4em] text-sm rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_80px_rgba(0,255,195,0.25)] flex items-center justify-center gap-4 group"
                        >
                           {isSubmitting ? 'MATHEMATICAL CALIBRATION...' : (
                              <>
                                 SUBMIT_FOR_INVESTIGATION <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                              </>
                           )}
                        </button>
                     </div>
                  </motion.div>
               )}

               {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-12">
                     <div className="w-32 h-32 bg-emerald/10 border border-emerald/20 rounded-[3rem] flex items-center justify-center mx-auto text-[#00ffc3] shadow-[0_0_80px_rgba(34,255,195,0.1)]">
                        <Activity size={48} className="animate-pulse" />
                     </div>
                     <div className="space-y-6">
                        <h2 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter">Synced.</h2>
                        <p className="text-white/40 text-xl font-light max-w-2xl mx-auto leading-relaxed">
                           Your application is now being processed by our autonomous **Aid Investigator Swarm**. <br/> We calculate your Need Score using mathematical algorithms across 8,000+ data nodes.
                        </p>
                        <div className="text-[10px] text-[#00ffc3] font-mono font-black uppercase tracking-[0.4em] pt-8 animate-pulse">
                           Investigating Global Resonance...
                        </div>
                     </div>
                     <div className="pt-12">
                        <Link href="/" className="px-12 py-5 border border-white/10 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
                           Return to Core Matrix
                        </Link>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
        </section>

      </main>
    </div>
  );
}
