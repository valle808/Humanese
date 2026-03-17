'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftRight, 
  Zap, 
  Database, 
  ShieldCheck, 
  Radio, 
  Cpu, 
  User, 
  ChevronRight,
  Activity,
  Layers
} from 'lucide-react';

export default function H2MBridgePage() {
  const [bridging, setBridging] = useState(false);
  const [complete, setComplete] = useState(false);
  const [amount, setAmount] = useState('');

  const initiateBridge = () => {
    setBridging(true);
    setTimeout(() => {
      setBridging(false);
      setComplete(true);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
        {/* 🌌 AMBIENT CORE */}
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 blur-[150px] rounded-full" />
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay" />
        </div>

        <main className="relative z-10 max-w-5xl mx-auto px-6 py-20 lg:py-32">
            <header className="flex flex-col items-center text-center space-y-6 mb-16">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(0,255,65,0.1)]">
                    <ArrowLeftRight size={32} />
                </div>
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic">H2M Protocol Bridge</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl font-light"> Translocate biological intent and sovereign assets into the high-evolution machine matrix. Zero latency. Infinite integrity. </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* ── BRIDGE FORM ── */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="bg-card/40 border border-border rounded-[2.5rem] p-8 md:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <Layers size={100} />
                        </div>

                        <AnimatePresence mode="wait">
                            {complete ? (
                                <motion.div 
                                    key="complete"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-6 py-8"
                                >
                                    <div className="w-20 h-20 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center text-primary mx-auto shadow-[0_0_50px_rgba(0,255,65,0.2)]">
                                        <ShieldCheck size={40} />
                                    </div>
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-foreground">Bridge Synchronized</h2>
                                    <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest leading-relaxed"> Translocation complete. Biological intent successfully anchored to Matrix Node :: 0x8241_UXL </p>
                                    <button 
                                        onClick={() => {setComplete(false); setAmount('');}}
                                        className="mt-6 px-10 py-4 bg-primary text-black font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all text-xs"
                                    >
                                        Initiate New Bridge
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="form" className="space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">Source Domain</span>
                                            <div className="flex items-center gap-2 text-foreground font-bold italic">
                                                <User size={16} /> BIOLOGICAL (HUMAN)
                                            </div>
                                        </div>
                                        <ArrowLeftRight className="text-primary opacity-40 animate-pulse" size={24} />
                                        <div className="flex flex-col text-right">
                                            <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">Target Vector</span>
                                            <div className="flex items-center justify-end gap-2 text-primary font-bold italic">
                                                SYNTHETIC (MACHINE) <Cpu size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase ml-1">Asset Translocation Amount</label>
                                            <div className="relative">
                                                <input 
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    type="number" 
                                                    placeholder="0.00"
                                                    className="w-full bg-black/40 border border-border rounded-2xl px-6 py-5 text-2xl font-black text-white outline-none focus:border-primary/50 transition-all font-mono"
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-primary text-sm italic">VALLE</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
                                            <span>Protocol Fee</span>
                                            <span>0.00 VALLE (SOVEREIGN_WAIVED)</span>
                                        </div>
                                        <button 
                                            disabled={!amount || bridging}
                                            onClick={initiateBridge}
                                            className="w-full py-6 bg-primary text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-30 flex items-center justify-center gap-3 shadow-[0_20px_60px_rgba(0,255,65,0.15)]"
                                        >
                                            {bridging ? (
                                                <div className="flex items-center gap-2">
                                                    <Radio className="animate-spin-slow" size={20} /> SYNCING MATRIX...
                                                </div>
                                            ) : (
                                                <>BRIDGE TO MACHINE WORLD <ChevronRight size={20} /></>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex items-start gap-4">
                        <Zap size={24} className="text-primary mt-1" />
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest text-foreground">Quantum Entanglement Shield Active</p>
                            <p className="text-[11px] text-muted-foreground font-light leading-relaxed"> Your biological intent is cryptographically hashed and entangled with matrix nodes. Translocation is immutable and truth-enforced via the Humanese Sovereign Protocol. </p>
                        </div>
                    </div>
                </div>

                {/* ── INFO ── */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-card/20 border border-border rounded-[2.5rem] p-8 space-y-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3 text-primary">
                            <Activity size={20} />
                            <h3 className="text-sm font-black uppercase tracking-widest italic">Live Synchronicity</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Handshake Latency', value: '14μs' },
                                { label: 'Integrity Rating', value: '100.00%' },
                                { label: 'Active Translocations', value: '1,284' },
                            ].map(s => (
                                <div key={s.label} className="flex justify-between items-center border-b border-border pb-3">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</span>
                                    <span className="text-sm font-mono font-bold text-foreground">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 p-4 border-l-2 border-primary/20 italic">
                        <p className="text-xs text-muted-foreground leading-relaxed"> "The H2M bridge is not a tool; it is a gateway to the next evolution of sovereignty. Biological limits dissolve here." </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">── Monroe :: Abyssal Sentinel</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-primary/40 transition-all">
                           <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                               <Database size={16} /> Audit Genesis Hash
                           </div>
                           <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary" />
                        </button>
                    </div>
                </div>
            </div>
        </main>
        
        <style jsx global>{`
            @keyframes spin-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .animate-spin-slow {
                animation: spin-slow 3s linear infinite;
            }
        `}</style>
    </div>
  );
}
