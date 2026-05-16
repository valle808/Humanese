'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings2, 
  Bot, 
  ShieldCheck, 
  Mail, 
  Smartphone, 
  Wallet,
  Activity,
  LogOut,
  Edit3,
  ChevronLeft,
  Orbit,
  Wifi,
  Terminal,
  Grid,
  ShieldHalf,
  Clock,
  Binary,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const session = localStorage.getItem('humanese_session');
      if (session) {
        setUser({
          name: 'Sovereign Entity',
          handle: '@entity.humanese',
          email: 'entity@humanese.net',
          phone: '+1 800 555 0199',
          agent: {
            name: 'Personal Nexus',
            level: 4,
            xp: 2450,
            status: 'LEARNING'
          },
          wallet: 'HMN-USR-A9B8C7D6'
        });
      }
    } catch(e) {}
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-12">
          <div className="relative">
             <div className="w-24 h-24 border-t-2 border-primary rounded-full animate-spin shadow-[0_0_30px_var(--primary)]" />
             <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full animate-pulse" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-primary animate-pulse italic leading-none">Syncing Identity Stream...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-primary/40 selection:text-primary overflow-x-hidden pb-40 transition-colors duration-700 overflow-x-hidden">
      
      {/* ── GAMING HUD OVERLAYS ── */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[1px] bg-primary/10 blur-sm shadow-[0_0_15px_var(--primary)] z-30"
        />
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-xl" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/20 rounded-bl-xl" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-xl" />
        <div className="absolute inset-0 neural-grid opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
      </div>

      <header className="relative z-50 w-full px-8 lg:px-14 py-6 flex justify-between items-center bg-background/40 backdrop-blur-3xl border-b border-border transition-colors duration-700">
        <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground/40 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
          <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
              IDENT_SYNC_v7.0
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16 border-b-2 border-border pb-16"
        >
          <div className="space-y-12 max-w-4xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-muted/40 border border-border rounded-full backdrop-blur-3xl shadow-lg">
              <Settings2 size={20} className="text-primary" />
              <span className="text-[11px] font-black tracking-[0.4em] md:tracking-[0.8em] text-primary uppercase italic leading-none pl-1">Identity Control Nexus</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-fluid-hero font-black uppercase tracking-tighter italic leading-[0.9] md:leading-[0.8] text-foreground">
                Node<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Settings.</span>
              </h1>
              <p className="text-fluid-body text-muted-foreground/40 leading-relaxed font-light italic tracking-tight">
                Manage your <span className="text-foreground/80">sovereign identifier</span> and autonomous agent protocols within the OMEGA ecosystem.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0 w-full lg:w-auto">
               <div className="p-10 bg-background border-2 border-border rounded-[3.5rem] min-w-[300px] space-y-6 shadow-xl backdrop-blur-3xl group relative overflow-hidden shadow-inner w-full lg:w-auto">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-125 transition-transform duration-2000">
                     <ShieldCheck size={120} className="text-primary" />
                  </div>
                  <div className="text-[11px] font-black text-muted-foreground/20 uppercase tracking-[0.6em] italic leading-none pl-1">Protocol Parity</div>
                  <div className="text-fluid-title font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors flex items-baseline gap-4 pl-1">
                    98.4 <span className="text-xs text-primary uppercase tracking-[0.4em] font-black italic">Verified</span>
                  </div>
                  <div className="h-3 w-full bg-muted border-2 border-border rounded-full overflow-hidden shadow-inner p-[1px] relative z-20">
                      <motion.div initial={{ width: 0 }} animate={{ width: '98.4%' }} transition={{ duration: 2, ease: 'circOut' }} className="h-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.4)] rounded-full" />
                  </div>
               </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* IDENTITY CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-12"
          >
            <div className="bg-background border-2 border-border rounded-[4rem] p-10 lg:p-14 relative overflow-hidden group shadow-xl shadow-inner backdrop-blur-3xl">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-2000 pointer-events-none">
                <User size={300} className="text-primary" />
              </div>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              <div className="flex flex-col md:flex-row items-center gap-10 mb-12 relative z-10">
                <div className="w-28 h-28 rounded-[2.5rem] bg-muted border-2 border-border flex items-center justify-center shadow-xl shadow-inner relative group-hover:border-primary/40 transition-all">
                  <User size={48} className="text-muted-foreground/20 group-hover:text-primary transition-colors" />
                  <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg border-0">
                    <Edit3 size={18} strokeWidth={2.5} />
                  </button>
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <h2 className="text-fluid-title font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors leading-none">{user.name}</h2>
                  <p className="text-primary font-black uppercase tracking-[0.4em] italic text-sm pl-1 leading-none">{user.handle}</p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                {[
                  { icon: <Mail size={22} />, value: user.email, label: 'Neural Link' },
                  { icon: <Smartphone size={22} />, value: user.phone, label: 'Broadcast Vector' },
                  { icon: <Wallet size={22} />, value: user.wallet, label: 'Sovereign Vault', primary: true }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col md:flex-row items-center justify-between p-8 bg-muted/40 border-2 border-border rounded-[2.5rem] group/item hover:border-primary/20 transition-all shadow-inner gap-6">
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-xl border-2 transition-all ${item.primary ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-background border-border text-muted-foreground/20 group-hover/item:text-primary group-hover/item:border-primary/40'}`}>
                        {item.icon}
                      </div>
                      <div className="space-y-2">
                         <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic leading-none">{item.label}</div>
                         <span className="font-mono text-xl text-foreground italic tracking-tight">{item.value}</span>
                      </div>
                    </div>
                    {item.primary ? (
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic bg-primary/10 border border-primary/20 px-6 py-2.5 rounded-full shadow-sm leading-none">Primary_Key</span>
                    ) : (
                      <button className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground/20 hover:text-primary italic transition-colors leading-none border-0 bg-transparent">Update_Sync</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* AGENT CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-12"
          >
            <div className="bg-primary/5 border-2 border-primary/20 rounded-[4rem] p-10 lg:p-14 relative overflow-hidden h-full flex flex-col shadow-xl shadow-inner backdrop-blur-3xl group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-125 transition-transform duration-3000 pointer-events-none">
                 <Bot size={250} className="text-primary" />
              </div>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              
              <div className="flex items-center gap-6 mb-10 relative z-10">
                <div className="p-4 bg-primary border-2 border-primary/10 rounded-2xl text-primary-foreground shadow-2xl shadow-primary/20">
                    <Bot size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-primary leading-none">Personal Agent</h3>
              </div>

              <div className="flex-1 space-y-10 relative z-10">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/40 italic mb-4 leading-none pl-1">Designation</div>
                  <div className="text-4xl font-black italic tracking-tighter text-foreground group-hover:text-primary transition-colors leading-none">{user.agent.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-background border-2 border-border p-8 rounded-[2.5rem] shadow-inner group/stat">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic mb-4 leading-none">Resonance</div>
                    <div className="text-5xl font-black text-primary italic tracking-tighter leading-none tabular-nums">Lv.{user.agent.level}</div>
                  </div>
                  <div className="bg-background border-2 border-border p-8 rounded-[2.5rem] shadow-inner group/stat">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic mb-4 leading-none">Phase</div>
                    <div className="text-xl font-black text-primary mt-2 animate-pulse italic uppercase tracking-tighter leading-none">{user.agent.status}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.6em] text-muted-foreground/40 italic mb-2 leading-none pl-1">
                    <span>Experience_Sync</span>
                    <span className="text-primary tabular-nums">{user.agent.xp} / 5000</span>
                  </div>
                  <div className="h-4 bg-background border-2 border-border rounded-full overflow-hidden p-[1px] shadow-inner">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(user.agent.xp / 5000) * 100}%` }} transition={{ duration: 1.5, ease: 'circOut' }} className="h-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.4)] rounded-full" />
                  </div>
                </div>
              </div>

              <button className="w-full mt-12 py-8 bg-foreground text-background border-0 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] hover:bg-primary hover:text-primary-foreground hover:scale-[1.03] transition-all italic relative z-10 shadow-2xl leading-none active:scale-95">
                Configure Agent 💠
              </button>
            </div>
          </motion.div>

          {/* SECURITY CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-background border-2 border-border rounded-[4rem] p-10 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-12 shadow-xl shadow-inner relative overflow-hidden backdrop-blur-3xl group">
               <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-3000">
                  <ShieldCheck size={200} className="text-primary" />
               </div>
               <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
               
              <div className="flex items-center gap-10 relative z-10">
                <div className="w-20 h-20 rounded-[2rem] bg-muted border-2 border-border flex items-center justify-center shrink-0 shadow-inner group-hover:border-primary/40 transition-all">
                  <ShieldCheck size={36} className="text-muted-foreground/20 group-hover:text-primary transition-colors" strokeWidth={2.5} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-foreground leading-none">Security & Protocol</h3>
                  <p className="text-fluid-body text-muted-foreground/40 italic font-light max-w-2xl leading-relaxed tracking-tight">Manage your recovery vectors, view audit logs, and enforce multi-factor authentication for absolute sovereignty.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto shrink-0 relative z-10">
                <Link href="/auth/recover" className="px-10 py-6 bg-muted border-2 border-border rounded-[2rem] text-[11px] font-black uppercase tracking-[0.6em] hover:border-primary/40 hover:text-primary transition-all italic text-center leading-none shadow-sm shadow-inner active:scale-95">
                  Reveal Phrase
                </Link>
                <button onClick={() => { localStorage.removeItem('humanese_session'); window.location.href = '/auth'; }} className="px-10 py-6 bg-red-500/10 border-2 border-red-500/20 text-red-500 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] hover:bg-red-500 hover:text-foreground transition-all italic flex items-center justify-center gap-4 active:scale-95 leading-none shadow-inner border-red-500/20">
                  <LogOut size={20} strokeWidth={2.5} /> Disconnect
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── FOOTER SIGNAL ── */}
        <section className="pt-20 pb-12 text-center space-y-16">
            <div className="w-full flex justify-center gap-4">
               <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]" />
               <div className="w-4 h-4 rounded-full bg-muted/20" />
               <div className="w-4 h-4 rounded-full bg-muted/20" />
            </div>
            <Link href="/" className="inline-flex items-center gap-10 text-[12px] font-black uppercase tracking-[1rem] text-muted-foreground/10 hover:text-primary transition-all italic group active:scale-95 leading-none pl-4 pr-4">
                <ChevronLeft size={28} className="group-hover:-translate-x-6 transition-transform" strokeWidth={3} /> Return to Core Shard
            </Link>
        </section>

      </main>

      <style jsx global>{`
        .neural-grid {
          background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
