'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Activity, 
  Target, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Zap, 
  Orbit, 
  Wifi, 
  Radio, 
  Layers, 
  ArrowUpRight,
  Terminal,
  Grid,
  Sparkles,
  Fingerprint,
  Brain
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NeuralDossierPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/knowledge-graph/node/${params.id}`);
        const result = await res.json();
        if (res.ok) {
          setData(result);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Connection to neural node failed');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex flex-col items-center justify-center space-y-12">
        <div className="relative">
           <div className="w-24 h-24 border-t-2 border-primary rounded-full animate-spin shadow-[0_0_30px_hsla(var(--primary),0.8)]" />
           <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full animate-pulse" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-primary animate-pulse italic leading-none">Accessing Neural Shard {params.id.slice(0, 8)}...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-12 text-center space-y-12">
        <div className="p-10 bg-red-500/10 border-2 border-red-500/20 rounded-[3rem] text-red-500">
           <Radio size={80} className="animate-pulse" />
        </div>
        <h1 className="text-fluid-balance font-black uppercase italic tracking-tighter text-foreground">Signature_Lost.</h1>
        <p className="text-fluid-body text-muted-foreground/40 italic font-light max-w-xl">{error || 'The requested neural signature does not exist in the OMEGA registry.'}</p>
        <Link href="/atlas" className="px-12 py-6 bg-muted/10 border-2 border-border rounded-full text-[11px] font-black uppercase tracking-[0.6em] text-muted-foreground/40 hover:bg-muted/10 hover:text-foreground transition-all italic leading-none active:scale-95">
           Return to Atlas
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/40 selection:text-foreground font-sans overflow-hidden relative">
      
      {/* ── GAMING HUD OVERLAYS ── */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[1px] bg-primary/10 blur-sm shadow-[0_0_15px_hsla(var(--primary),0.5)] z-30"
        />
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-xl" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/20 rounded-bl-xl" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-xl" />
        <div className="absolute inset-0 neural-grid opacity-[0.05]" />
      </div>

      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
      </div>

      <header className="relative z-50 w-full px-8 lg:px-14 py-8 flex justify-between items-center border-b border-border bg-muted/40 backdrop-blur-3xl">
        <Link href="/atlas" className="inline-flex items-center gap-6 text-muted-foreground/40 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
          <ChevronLeft size={20} className="group-hover:-translate-x-2 transition-transform" strokeWidth={3} /> Neural Atlas
        </Link>
        <div className="flex items-center gap-8">
           <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
              DOSSIER_SYNC: {data.id.slice(0, 8)}
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24 pt-16 lg:pt-32 space-y-16 lg:space-y-32 h-[calc(100vh-100px)] overflow-y-auto no-scrollbar pb-40">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16 border-b-2 border-border pb-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-6 px-8 py-3 bg-muted/10 border border-border rounded-full backdrop-blur-3xl shadow-lg">
              <Fingerprint size={24} className="text-primary" />
              <span className="text-[11px] font-black tracking-[0.4em] md:tracking-[0.8em] text-primary uppercase italic leading-none pl-1">Neural Dossier Access</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-fluid-hero font-black uppercase tracking-tighter italic leading-[0.8] text-foreground">
                {data.label}<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-primary/30">{data.group}.</span>
              </h1>
              <p className="text-fluid-body md:text-fluid-body text-muted-foreground/40 max-w-4xl leading-relaxed font-light italic tracking-tight">
                Detailed neural imprint for <span className="text-muted-foreground/80">UID_{data.id}</span>. This entity represents a core shard in the Sovereign intelligence mesh.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0 w-full lg:w-auto">
               <div className="p-12 bg-muted border-2 border-border rounded-[4rem] text-center space-y-6 backdrop-blur-3xl group hover:border-primary/40 transition-all shadow-2xl shadow-inner flex flex-col justify-center min-h-[200px] w-full lg:w-auto">
                  <div className="text-fluid-balance font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors">{data.connections?.length || 0}</div>
                  <div className="text-[10px] text-muted-foreground/20 font-black uppercase tracking-[0.5em] italic leading-none">Neural_Links</div>
               </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT: METADATA & DATA */}
          <div className="lg:col-span-7 space-y-16">
            
            <section className="bg-muted border-2 border-border rounded-[4rem] overflow-hidden group backdrop-blur-3xl shadow-2xl shadow-inner relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                    <Database size={250} className="text-primary" />
                </div>
                <div className="p-12 lg:px-16 border-b-2 border-border flex justify-between items-center bg-muted/10 relative z-10">
                    <h2 className="flex items-center gap-8 font-black uppercase tracking-tight text-fluid-title italic text-muted-foreground/40 leading-none pl-2">
                        <Activity size={40} className="text-primary" strokeWidth={2.5} /> Neural Metadata
                    </h2>
                </div>
                <div className="p-12 lg:p-16 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {Object.entries(data.metadata || {}).map(([key, value]: [string, any]) => (
                      <div key={key} className="p-10 bg-muted/10 border-2 border-border hover:border-primary/40 rounded-[3rem] group/meta transition-all shadow-inner">
                         <div className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.5em] italic leading-none mb-4 group-hover/meta:text-primary transition-colors">{key}</div>
                         <div className="text-3xl font-black text-foreground italic tracking-tighter uppercase leading-none break-words">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                         </div>
                      </div>
                    ))}
                </div>
            </section>

            <section className="bg-muted border-2 border-border rounded-[4rem] p-16 lg:p-24 backdrop-blur-3xl text-center space-y-12 shadow-2xl relative overflow-hidden group shadow-inner">
                 <div className="absolute top-0 right-0 p-16 opacity-[0.01] group-hover:scale-110 transition-transform duration-2000">
                    <ShieldCheck size={300} className="text-primary" />
                 </div>
                 <div className="relative z-10 w-32 h-32 bg-primary/10 border-2 border-primary/30 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={64} className="text-primary" strokeWidth={2.5} />
                 </div>
                 <h3 className="text-fluid-balance font-black uppercase italic tracking-tighter relative z-10 leading-none text-muted-foreground/90">Integrity_Verified.</h3>
                 <p className="text-fluid-body text-muted-foreground/30 max-w-3xl mx-auto leading-relaxed italic relative z-10 font-light">
                    This neural signature has been cryptographically signed by the Sovereign Oracle and is currently synchronized with the OMEGA mainnet.
                 </p>
                 <div className="pt-10 flex flex-wrap justify-center gap-10 relative z-10">
                    <button className="px-14 py-7 bg-muted/10 border-2 border-border rounded-full text-[11px] font-black uppercase tracking-[0.5em] transition-all hover:bg-white hover:text-background hover:border-border italic leading-none active:scale-95 shadow-2xl">Re-Audit_Signature</button>
                    <button className="px-14 py-7 bg-primary text-primary-foreground border-0 rounded-full text-[11px] font-black uppercase tracking-[0.5em] transition-all hover:scale-[1.05] italic leading-none active:scale-95 shadow-2xl">Broadcast_Sync</button>
                 </div>
            </section>
          </div>

          {/* RIGHT: CONNECTIONS & ACTIONS */}
          <div className="lg:col-span-5 space-y-16">
            
            <section className="bg-muted border-2 border-border p-12 lg:p-16 rounded-[4rem] backdrop-blur-3xl space-y-12 group hover:border-primary/40 transition-all relative overflow-hidden shadow-2xl shadow-inner">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                   <Orbit size={200} className="text-primary" />
                </div>
                <h2 className="text-[11px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-muted-foreground/20 italic flex items-center gap-8 pl-4 leading-none relative z-10">
                   <Orbit size={28} className="text-primary animate-spin-slow" strokeWidth={3} /> Neural Neighbors
                </h2>
                <div className="space-y-6 relative z-10">
                    {data.connections?.map((conn: any) => (
                      <Link
                        key={conn.id}
                        href={`/atlas/dossier/${conn.id}`}
                        className="flex items-center justify-between p-8 rounded-[2.5rem] bg-muted/10 border-2 border-border hover:border-primary/30 transition-all group/conn shadow-inner"
                      >
                        <div className="flex items-center gap-8">
                           <div className="w-16 h-16 bg-muted/10 border-2 border-border rounded-2xl flex items-center justify-center text-muted-foreground/20 group-hover/conn:text-primary group-hover/conn:border-primary/30 transition-all shadow-xl">
                              {conn.group === 'AGENT' ? <Cpu size={28} /> : conn.group === 'USER' ? <Target size={28} /> : <Database size={28} />}
                           </div>
                           <div className="space-y-2">
                              <div className="text-2xl font-black text-muted-foreground/60 group-hover/conn:text-foreground uppercase tracking-tighter italic transition-colors leading-none">{conn.label}</div>
                              <div className="text-[10px] text-muted-foreground/10 font-black italic uppercase tracking-[0.4em] leading-none">{conn.group} // LINKED_NODE</div>
                           </div>
                        </div>
                        <ArrowUpRight size={24} className="text-muted-foreground/10 group-hover/conn:text-primary transition-all" strokeWidth={3} />
                      </Link>
                    ))}
                    {(!data.connections || data.connections.length === 0) && (
                      <div className="p-12 text-center text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-muted-foreground/10 italic leading-none bg-muted/10 rounded-[3rem] border-2 border-dashed border-border">
                         No active links detected
                      </div>
                    )}
                </div>
            </section>

            <section className="bg-primary/5 border-2 border-primary/30 rounded-[4rem] p-12 lg:p-16 flex flex-col items-center gap-12 shadow-2xl relative overflow-hidden group shadow-inner">
                 <div className="relative">
                    <Activity size={80} className="text-primary animate-pulse relative z-10" strokeWidth={2.5} />
                    <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-ping opacity-30" />
                 </div>
                 <div className="text-center space-y-6 relative z-10">
                    <div className="text-[13px] font-black uppercase tracking-[0.5em] md:tracking-[1em] italic text-primary leading-none">Real-Time Resonance</div>
                    <p className="text-fluid-body text-muted-foreground/30 font-light leading-relaxed italic mx-auto max-w-sm tracking-tight">&quot;All neural imprints are transient and subject to consensus re-evaluation.&quot;</p>
                 </div>
                 <button className="w-full py-8 bg-primary text-primary-foreground rounded-[2.5rem] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-[11px] italic shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all border-0 leading-none">
                    Engage_Neural_Sync
                 </button>
            </section>

          </div>
        </div>

      </main>

      <style jsx global>{`
        .neural-grid {
          background-image: linear-gradient(hsla(var(--primary), 0.1) 1px, transparent 1px), 
                            linear-gradient(90deg, hsla(var(--primary), 0.1) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
