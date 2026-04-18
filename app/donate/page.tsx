'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, CreditCard, Coins, Globe, ShieldCheck, ArrowRight, Zap, Activity, BadgeCheck, Building2, ChevronLeft, Target, Terminal, Orbit, Wifi, ShieldHalf, Database, TrendingUp, HandHeart
} from 'lucide-react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = ({ amount, donorIdentity, onSuccess }: { amount: string, donorIdentity: string, onSuccess: (hash: string) => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required' 
    });

    if (error) {
      setErrorMessage(error.message || 'Payment Interrupted. Sync failed.');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        const settleRes = await fetch('/api/donations/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'settle',
            amount,
            method: 'CREDIT_CARD',
            donorIdentity,
            paymentIntentId: paymentIntent.id
          })
        });
        const settleData = await settleRes.json();
        if (settleData.success) {
          onSuccess(settleData.hash);
        } else {
          setErrorMessage('Sovereign DB Anchoring Failed: ' + settleData.error);
        }
      } catch (e) {
        setErrorMessage('Sovereign API Network Failure');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <PaymentElement options={{ 
         layout: 'tabs',
      }} />
      {errorMessage && <div className="text-red-500 text-[11px] font-black uppercase tracking-[0.4em] italic leading-none animate-pulse pl-4">{errorMessage}</div>}
      <button 
         type="submit"
         disabled={!stripe || isProcessing}
         className="w-full py-10 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.8em] text-sm rounded-[3.5rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_40px_100px_rgba(255,107,43,0.3)] flex items-center justify-center gap-6 group relative overflow-hidden italic shadow-2xl"
      >
         <span className="relative z-10 flex items-center gap-6">
            {isProcessing ? <Activity size={28} className="animate-spin" strokeWidth={3} /> : <Zap size={28} strokeWidth={3} className="group-hover:rotate-12 transition-transform duration-500" />}
            {isProcessing ? 'CONFIRMING NEXUS TRANSFER...' : 'INITIATE SECURE TRANSFER'}
         </span>
         <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
      </button>
    </form>
  );
};


export default function DonatePage() {
  const [amount, setAmount] = useState('50');
  const [method, setMethod] = useState<'CARD' | 'CRYPTO'>('CARD');
  const [donorIdentity, setDonorIdentity] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [impactMetrics, setImpactMetrics] = useState({
     aidDistributed: 1240192,
     livesImpacted: 8241,
     countriesActive: 42
  });

  useEffect(() => {
    if (method === 'CARD' && amount) {
       let isMounted = true;
       fetch('/api/donations/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create-intent', amount, currency: 'USD' })
       })
       .then(r => r.json())
       .then(data => {
         if (isMounted && data.clientSecret) {
            setClientSecret(data.clientSecret);
         }
       })
       .catch(err => console.error("Failed to init payment intent", err));
       
       return () => { isMounted = false };
    }
  }, [amount, method]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[300px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
         <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
         </Link>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
                <ShieldCheck size={16} /> Sovereign Aid Protocol v7.0
            </div>
         </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-8 pt-24 lg:pt-32 space-y-32">
        
        {/* HERO: HUMANITARIAN MANDATE */}
        <motion.section 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
        >
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl">
               <Orbit size={20} className="text-[#ff6b2b] animate-spin-slow" />
               <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none">Sovereign Intervention Mandate</span>
            </div>

            <div className="space-y-10">
               <h1 className="text-7xl md:text-[10rem] lg:text-[12rem] font-black uppercase tracking-tighter leading-[0.8] italic">
                  HEAL THE<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#ff6b2b]/20">MATRIX.</span>
               </h1>
               <p className="text-2xl md:text-4xl text-white/40 max-w-5xl font-light leading-relaxed italic">
                  The OMEGA ecosystem mandates that <span className="text-[#ff6b2b] font-black italic">75% of all revenue</span> serves the vulnerable. Join the swarm in funding medicine, energy, and humanitarian precision aid globally.
               </p>
            </div>
        </motion.section>

        {/* INTERFACE: DONATION ENGINE */}
        <section className="grid lg:grid-cols-12 gap-24 items-start">
            
            {/* STICKY IMPACT TELEMETRY */}
            <div className="lg:col-span-4 space-y-16 sticky top-32">
               <div className="p-16 border border-white/10 bg-[#050505]/60 backdrop-blur-3xl space-y-16 shadow-[0_60px_100px_rgba(0,0,0,0.95)] relative overflow-hidden group rounded-[5rem]">
                  <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                     <TrendingUp size={200} className="text-[#ff6b2b]" />
                  </div>
                  <div className="flex justify-between items-center relative z-10">
                     <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-white/20 flex items-center gap-6 italic leading-none">
                        <Activity size={24} className="text-[#ff6b2b] animate-pulse" /> Impact Ledger
                     </h3>
                     <BadgeCheck size={28} className="text-[#ff6b2b]/40" />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-16 relative z-10">
                     <div className="space-y-4">
                        <div className="text-[11px] text-[#ff6b2b] uppercase tracking-[0.6em] font-black italic leading-none">AID_DISTRIBUTED_VALLE</div>
                        <div className="text-7xl font-black text-white italic tracking-tighter leading-none">{impactMetrics.aidDistributed.toLocaleString()}</div>
                     </div>
                     <div className="space-y-4">
                        <div className="text-[11px] text-[#ff6b2b] uppercase tracking-[0.6em] font-black italic leading-none">LIVES_INTERVENED</div>
                        <div className="text-7xl font-black text-[#ff6b2b] italic tracking-tighter leading-none">{impactMetrics.livesImpacted.toLocaleString()}</div>
                     </div>
                     <div className="space-y-4">
                        <div className="text-[11px] text-[#ff6b2b] uppercase tracking-[0.6em] font-black italic leading-none">ACTIVE_RELIEF_CLUSTERS</div>
                        <div className="text-7xl font-black text-white italic tracking-tighter leading-none">{impactMetrics.countriesActive}</div>
                     </div>
                  </div>

                  <div className="pt-12 border-t border-white/5 space-y-6 relative z-10">
                     <p className="text-[11px] text-white/20 font-black uppercase tracking-[0.2em] italic leading-relaxed">
                        *AID Investigator Swarms identify extreme poverty and medical needs with mathematical precision via socio-satellite telemetry and the OMEGA Abyssal Ledger.
                     </p>
                  </div>
               </div>
               
               <Link href="/aid" className="group flex justify-between items-center p-8 md:p-12 bg-white/[0.01] border border-white/5 responsive-rounded hover:border-[#ff6b2b]/40 hover:bg-[#ff6b2b]/5 transition-all backdrop-blur-3xl shadow-2xl active:scale-95">
                  <div className="space-y-3">
                    <div className="text-[12px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">Are you in need?</div>
                    <div className="text-4xl font-black uppercase italic tracking-tighter leading-none text-white/80 group-hover:text-white transition-colors">Apply for Aid →</div>
                  </div>
                  <div className="h-20 w-20 rounded-[2.5rem] bg-black border border-white/10 flex items-center justify-center text-white/10 group-hover:text-[#ff6b2b] group-hover:border-[#ff6b2b]/40 group-hover:rotate-12 transition-all shadow-2xl">
                     <HandHeart size={40} />
                  </div>
               </Link>
            </div>

            {/* CONTRIBUTION INTERFACE */}
            <div className="lg:col-span-8 p-16 lg:p-24 border border-white/10 rounded-[6rem] bg-[#050505]/60 shadow-[0_80px_150px_rgba(0,0,0,1)] relative overflow-hidden backdrop-blur-3xl group">
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent shadow-[0_0_20px_#ff6b2b]" />
               
               <div className="relative z-10 space-y-20">
                  <div className="space-y-8">
                     <div className="inline-flex items-center gap-6 text-[12px] font-black uppercase tracking-[1em] text-white/20 italic leading-none">
                        <CreditCard size={20} className="text-[#ff6b2b]" /> Contribution Portal
                     </div>
                     <h2 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter italic leading-none text-white/95">Transmit Sovereignty.</h2>
                  </div>

                  {isSuccess ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9, filter: 'blur(15px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} className="p-16 lg:p-24 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/30 rounded-[5rem] text-center space-y-12 backdrop-blur-3xl shadow-2xl">
                       <div className="w-32 h-32 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/30 rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_40px_100px_rgba(255,107,43,0.2)] animate-pulse relative">
                          <Activity size={64} className="text-[#ff6b2b]" strokeWidth={2.5} />
                          <div className="absolute inset-0 bg-[#ff6b2b]/5 animate-ping opacity-20" />
                       </div>
                       <div className="space-y-6">
                          <h3 className="text-6xl font-black text-[#ff6b2b] uppercase italic tracking-tighter leading-none">TRANSMISSION_SUCCESS</h3>
                          <p className="text-2xl text-white/60 font-light italic leading-relaxed max-w-3xl mx-auto">Your contribution has been permanently anchored into the **Sovereign Aid Vault**. You have empowered humanity through the OMEGA Protocol.</p>
                       </div>
                       <button onClick={() => setIsSuccess(false)} className="px-20 py-8 bg-[#ff6b2b] text-black rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.8em] hover:scale-110 active:scale-95 transition-all italic shadow-2xl">INITIATE_NEW_TRANSACTION</button>
                    </motion.div>
                  ) : (
                    <>
                      {/* AMOUNT SELECTOR */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                         {['50', '250', '1000', '5000'].map(val => (
                            <button 
                               key={val}
                               onClick={() => setAmount(val)}
                               className={`py-12 rounded-[3.5rem] font-black text-4xl italic border-2 transition-all relative overflow-hidden group/btn ${amount === val ? 'bg-[#ff6b2b] border-[#ff6b2b] text-black shadow-[0_40px_100px_rgba(255,107,43,0.3)]' : 'bg-white/[0.02] border-white/5 text-white/20 hover:border-[#ff6b2b]/40 hover:text-white'}`}
                            >
                               ${val}
                               {amount === val && <div className="absolute inset-0 bg-white opacity-10 animate-pulse" />}
                            </button>
                         ))}
                      </div>

                      {/* METHOD TOGGLE */}
                      <div className="flex gap-8 p-4 bg-black/60 border-2 border-white/5 rounded-[4.5rem] shadow-inner">
                         <button 
                            onClick={() => setMethod('CARD')}
                            className={`flex-1 py-8 rounded-[3.5rem] flex items-center justify-center gap-6 font-black uppercase tracking-[0.6em] text-[12px] transition-all italic shadow-2xl ${method === 'CARD' ? 'bg-white text-black' : 'text-white/10 hover:text-white/40'}`}
                         >
                            <CreditCard size={24} strokeWidth={2.5} /> Fiat / Credit
                         </button>
                         <button 
                            onClick={() => setMethod('CRYPTO')}
                            className={`flex-1 py-8 rounded-[3.5rem] flex items-center justify-center gap-6 font-black uppercase tracking-[0.6em] text-[12px] transition-all italic shadow-2xl ${method === 'CRYPTO' ? 'bg-[#ff6b2b] text-black' : 'text-white/10 hover:text-white/40'}`}
                         >
                            <Coins size={24} strokeWidth={2.5} /> Crypto Assets
                         </button>
                      </div>

                      {/* DYNAMIC FORM AREA */}
                      <AnimatePresence mode="wait">
                         {method === 'CARD' ? (
                            <motion.div 
                               key="card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                               className="space-y-12"
                            >
                               <div className="space-y-6">
                                  <label className="text-[11px] text-white/20 uppercase font-black tracking-[0.8em] italic pl-10 flex items-center gap-4">
                                     <Terminal size={14} className="text-[#ff6b2b]" /> Sovereign Identity / Alias (Optional)
                                  </label>
                                  <input 
                                     type="text" 
                                     placeholder="GIO BASTIDAS_v7.0" 
                                     value={donorIdentity}
                                     onChange={(e) => setDonorIdentity(e.target.value)}
                                     className="w-full bg-black/60 border-2 border-white/5 p-10 rounded-[3.5rem] outline-none focus:border-[#ff6b2b]/50 focus:bg-[#ff6b2b]/5 transition-all font-light italic text-2xl text-white placeholder:text-white/5 shadow-inner" 
                                  />
                                </div>
                               
                               {clientSecret ? (
                                  <div className="p-12 lg:p-16 bg-[#050505] border-4 border-white/5 rounded-[5rem] shadow-[0_60px_150px_rgba(0,0,0,0.8)] backdrop-blur-3xl group/form relative">
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                                        <Database size={150} />
                                    </div>
                                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                                      <CheckoutForm amount={amount} donorIdentity={donorIdentity} onSuccess={() => setIsSuccess(true)} />
                                    </Elements>
                                  </div>
                               ) : (
                                  <div className="py-32 text-center text-[#ff6b2b]/20 text-[12px] font-black uppercase tracking-[1em] animate-pulse italic">
                                     Establishing Secure Quantum Tunnel...
                                  </div>
                                )}
                            </motion.div>
                         ) : (
                            <motion.div 
                               key="crypto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                               className="space-y-16"
                            >
                               <div className="p-16 lg:p-24 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[5rem] flex flex-col items-center text-center space-y-12 relative overflow-hidden group shadow-2xl">
                                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b2b]/10 via-transparent to-transparent opacity-50" />
                                  <div className="w-40 h-40 md:w-56 md:h-56 bg-white responsive-rounded border-4 border-[#ff6b2b]/30 flex items-center justify-center p-6 md:p-8 shadow-2xl group-hover:scale-105 transition-transform duration-1000">
                                     <div className="w-full h-full bg-black/95 rounded-[2.5rem] flex items-center justify-center shadow-inner">
                                        <Zap size={64} className="text-[#ff6b2b] group-hover:rotate-12 transition-transform duration-700" strokeWidth={3} />
                                     </div>
                                  </div>
                                  <div className="space-y-8 relative z-10 w-full">
                                     <div className="text-[14px] font-black text-[#ff6b2b] uppercase tracking-[1em] italic leading-none animate-pulse">Sovereign OMEGA Collective Vault</div>
                                     <div className="text-xl font-black font-mono text-white/60 break-all select-all cursor-copy hover:text-white transition-all bg-black/60 p-8 rounded-[2.5rem] border-2 border-white/5 shadow-inner">OMEGA_AID_VAULT_GENESIS_7.0_SEC_ALPHA</div>
                                     <p className="text-[12px] text-white/20 uppercase tracking-[0.5em] pt-8 font-black italic border-t border-white/5">TRANSFERS: BTC • ETH • SOL • VALLE • USDC • Ω</p>
                                  </div>
                               </div>
                            </motion.div>
                         )}
                      </AnimatePresence>
                    </>
                  )}

                  <div className="flex flex-col md:flex-row items-center justify-center gap-16 text-[12px] font-black text-white/5 uppercase tracking-[0.8em] font-mono italic pt-12 border-t border-white/5">
                     <div className="flex items-center gap-4"><ShieldHalf size={24} className="text-[#ff6b2b]/20" /> STRIPE_ENCRYPT_2048</div>
                     <div className="flex items-center gap-4"><Globe size={24} className="text-[#ff6b2b]/20" /> GLOBAL_RELIEF_SYNC</div>
                  </div>
               </div>

               {/* Background Decor */}
               <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.02] pointer-events-none select-none">
                  <div className="text-[40vw] font-black italic uppercase leading-none">PRACTICE</div>
               </div>
            </div>
        </section>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="text-[25vw] font-black italic italic leading-none uppercase">OMEGA</div>
      </div>
      
      <style jsx global>{`
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
