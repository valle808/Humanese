'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, CreditCard, Coins, Globe, ShieldCheck, ArrowRight, Zap, Activity, BadgeCheck, Building2
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ 
         layout: 'tabs',
         theme: 'night', // Stripe night theme closely matches our dark aesthetic
         variables: {
            colorPrimary: '#00ffc3',
            colorBackground: '#0a0a0a',
            colorText: '#ffffff',
            colorDanger: '#ff0055',
            fontFamily: 'monospace',
         }
      }} />
      {errorMessage && <div className="text-red-500 text-xs font-mono">{errorMessage}</div>}
      <button 
         type="submit"
         disabled={!stripe || isProcessing}
         className="w-full py-6 bg-[#00ffc3] text-black font-black uppercase tracking-[0.4em] text-sm rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_80px_rgba(0,255,195,0.25)] flex items-center justify-center gap-4 group"
      >
         {isProcessing ? 'CONFIRMING NEXUS TRANSFER...' : (
            <>
               INITIATE SECURE TRANSFER <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </>
         )}
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

  // Fetch Payment Intent when amount or method changes to CARD
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00ffc3]/30 font-sans overflow-x-hidden pb-32">
      
      {/* 🏙️ AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[70vw] h-[70vw] bg-[#00ffc3]/5 blur-[250px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-[#7000ff]/5 blur-[200px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 lg:pt-24 space-y-24">
        
        {/* HERO: HUMANITARIAN MANDATE */}
        <section className="max-w-4xl space-y-12">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-2xl">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffc3] opacity-75" />
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffc3]" />
               </span>
               <span className="text-[10px] font-black tracking-[0.4em] text-[#00ffc3] uppercase italic">Sovereign Aid Protocol v4.0</span>
            </div>

            <div className="space-y-6">
               <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic">
                  HEAL THE<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/10">MATRIX.</span>
               </h1>
               <p className="text-xl md:text-2xl text-white/40 max-w-2xl font-light leading-relaxed">
                  The OMEGA ecosystem mandates that <span className="text-white font-bold">75% of all revenue</span> serves the vulnerable. Join the swarm in funding medicine, energy, and humanitarian precision aid.
               </p>
            </div>
        </section>

        {/* INTERFACE: DONATION ENGINE */}
        <section className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* STICKY IMPACT TELEMETRY */}
            <div className="lg:col-span-5 space-y-8 sticky top-24">
               <div className="glass-panel p-10 border border-white/10 rounded-[3rem] bg-black/40 space-y-10 shadow-2xl">
                  <div className="flex justify-between items-center mr-4">
                     <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-3 italic">
                        <Activity size={18} className="text-[#00ffc3]" /> Real-Time Impact
                     </h3>
                     <BadgeCheck size={20} className="text-[#00ffc3]/40" />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                     <div className="space-y-1">
                        <div className="text-[10px] text-white/20 uppercase tracking-widest font-mono">Distributed Aid (VALLE)</div>
                        <div className="text-5xl font-black text-white italic tracking-tighter">{impactMetrics.aidDistributed.toLocaleString()}</div>
                     </div>
                     <div className="space-y-1">
                        <div className="text-[10px] text-white/20 uppercase tracking-widest font-mono">Human Lives Impacted</div>
                        <div className="text-5xl font-black text-[#00ffc3] italic tracking-tighter">{impactMetrics.livesImpacted.toLocaleString()}</div>
                     </div>
                     <div className="space-y-1">
                        <div className="text-[10px] text-white/20 uppercase tracking-widest font-mono">Active Relief Zones</div>
                        <div className="text-5xl font-black text-white italic tracking-tighter">{impactMetrics.countriesActive}</div>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-4">
                     <div className="text-[9px] text-white/20 font-mono italic leading-loose">
                        *AID Investigator Agents identify extreme poverty and medical needs with mathematical precision using global satellite and social telemetry.
                     </div>
                  </div>
               </div>
               
               <Link href="/aid" className="group flex justify-between items-center p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-[#00ffc3]/40 transition-all">
                  <div>
                    <div className="text-[10px] font-black text-[#00ffc3] uppercase tracking-widest mb-1 italic">Are you in need?</div>
                    <div className="text-lg font-bold">Apply for Sovereign Aid →</div>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#00ffc3] transition-colors">
                     <Heart size={24} />
                  </div>
               </Link>
            </div>

            {/* CONTRIBUTION INTERFACE */}
            <div className="lg:col-span-7 glass-panel p-10 lg:p-16 border border-white/10 rounded-[4rem] bg-gradient-to-br from-white/[0.03] to-transparent shadow-2xl relative overflow-hidden">
               
               <div className="relative z-10 space-y-12">
                  <div className="space-y-4">
                     <h2 className="text-4xl font-black uppercase tracking-tighter italic">Contribution Portal</h2>
                     <p className="text-sm text-white/30 uppercase tracking-widest font-mono">Select your amount and transfer method.</p>
                  </div>

                  {isSuccess ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 bg-[#00ffc3]/10 border border-[#00ffc3]/20 rounded-[2rem] text-center space-y-6">
                       <Activity size={48} className="mx-auto text-[#00ffc3] animate-pulse" />
                       <h3 className="text-2xl font-black text-[#00ffc3] uppercase">Transmission Successful</h3>
                       <p className="text-sm text-white/60 font-mono">Your contribution has been permanently anchored into the Sovereign Aid Vault. You have empowered humanity.</p>
                       <button onClick={() => setIsSuccess(false)} className="mt-4 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase hover:bg-white/10">Make Another Transfer</button>
                    </motion.div>
                  ) : (
                    <>
                      {/* AMOUNT SELECTOR */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {['25', '50', '100', '500'].map(val => (
                            <button 
                               key={val}
                               onClick={() => setAmount(val)}
                               className={`py-6 rounded-3xl font-black text-xl border transition-all ${amount === val ? 'bg-[#00ffc3] border-[#00ffc3] text-black shadow-[0_0_40px_rgba(0,255,195,0.2)]' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}
                            >
                               ${val}
                            </button>
                         ))}
                      </div>

                      {/* METHOD TOGGLE */}
                      <div className="flex gap-4 p-2 bg-black border border-white/5 rounded-[3rem]">
                         <button 
                            onClick={() => setMethod('CARD')}
                            className={`flex-1 py-5 rounded-[2.5rem] flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] transition-all ${method === 'CARD' ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/40'}`}
                         >
                            <CreditCard size={16} /> Cash / Credit
                         </button>
                         <button 
                            onClick={() => setMethod('CRYPTO')}
                            className={`flex-1 py-5 rounded-[2.5rem] flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] transition-all ${method === 'CRYPTO' ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/40'}`}
                         >
                            <Coins size={16} /> All Crypto
                         </button>
                      </div>

                      {/* DYNAMIC FORM AREA */}
                      <AnimatePresence mode="wait">
                         {method === 'CARD' ? (
                            <motion.div 
                               key="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                               className="space-y-6"
                            >
                               <div className="space-y-2">
                                  <label className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Full Identity (Optional)</label>
                                  <input 
                                     type="text" 
                                     placeholder="GIO BASTIDAS" 
                                     value={donorIdentity}
                                     onChange={(e) => setDonorIdentity(e.target.value)}
                                     className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#00ffc3]/50 transition-colors" 
                                  />
                               </div>
                               
                               {clientSecret ? (
                                  <div className="p-6 bg-black/40 border border-white/5 rounded-3xl">
                                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                                      <CheckoutForm amount={amount} donorIdentity={donorIdentity} onSuccess={() => setIsSuccess(true)} />
                                    </Elements>
                                  </div>
                               ) : (
                                  <div className="py-8 text-center text-white/30 text-xs font-mono animate-pulse">Syncing Secure Payment Gateway...</div>
                               )}
                            </motion.div>
                         ) : (
                            <motion.div 
                               key="crypto" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                               className="space-y-6"
                            >
                               <div className="p-8 bg-[#00ffc3]/5 border border-[#00ffc3]/10 rounded-[2rem] flex flex-col items-center text-center space-y-6">
                                  <div className="w-24 h-24 bg-white rounded-3xl border border-[#00ffc3]/20 flex items-center justify-center p-4">
                                     <div className="w-full h-full bg-black/80 rounded-lg flex items-center justify-center">
                                        <Zap size={32} className="text-[#00ffc3]" />
                                     </div>
                                  </div>
                                  <div className="space-y-2">
                                     <div className="text-[10px] font-black text-[#00ffc3] uppercase tracking-widest">Universal Sovereign Wallet</div>
                                     <div className="text-xs font-mono text-white/40 break-all select-all cursor-copy hover:text-white transition-colors">v1_SOVEREIGN_AID_VAULT_2026_MASTER</div>
                                     <p className="text-[9px] text-white/20 uppercase tracking-widest pt-4">Direct transfers accepted in BTC, SOL, ETH, VALLE, USDC</p>
                                  </div>
                               </div>
                            </motion.div>
                         )}
                      </AnimatePresence>
                    </>
                  )}

                  <div className="flex items-center justify-center gap-6 text-[9px] font-black text-white/20 uppercase tracking-[0.3em] font-mono italic">
                     <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#00ffc3]/40" /> STRIPE 256-BIT ENCRYPTION</div>
                     <div className="flex items-center gap-2"><Globe size={14} className="text-[#00ffc3]/40" /> GLOBAL PROSPERITY SECURED</div>
                  </div>
               </div>

               {/* Background Decor */}
               <div className="absolute right-[-5%] bottom-[-10%] opacity-[0.03] pointer-events-none">
                  <div className="text-[300px] font-black italic uppercase leading-none">AID</div>
               </div>
            </div>
        </section>

      </main>
    </div>
  );
}
