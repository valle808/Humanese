'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dna, 
  Zap, 
  Cpu, 
  Microscope, 
  Globe, 
  FlaskConical, 
  Share2, 
  Activity, 
  BadgeCheck,
  Atom,
  Wind,
  Layers,
  ChevronLeft,
  Loader2,
  Sparkles,
  Search,
  MoreVertical,
  Radio,
  Wifi,
  Target,
  ArrowRight,
  Database,
  Smartphone,
  CreditCard,
  Plus,
  Orbit,
  Grid,
  ShieldHalf,
  Clock,
  Binary,
  ShieldCheck,
  Brain
} from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function ResearchHubPage() {
  const [activeResonance, setActiveResonance] = useState(0.982);
  const [computingPower, setComputingPower] = useState(124); // PetaFLOPS
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchArticles();
  }, [activeCategory]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const catParam = activeCategory !== 'ALL' ? `&category=${activeCategory}` : '';
      const res = await fetch(`/api/hpedia/articles?limit=6${catParam}`);
      const data = await res.json();
      if (res.ok) setArticles(data.articles || []);
    } catch (e) {
      console.error('Core link error', e);
    } finally {
      setLoading(false);
    }
  };

  const triggerSwarmOverdrive = async () => {
    const topic = prompt('Specify research focal point (e.g., Theoretical Physics, Longevity, Zero-Point Energy):');
    if (!topic) return;
    
    setIsGenerating(true);
    try {
        const res = await fetch('/api/hpedia/generate', {
            method: 'POST',
            body: JSON.stringify({ topic, agentId: 'investigator-swarm' }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            alert('SWARM OVERDRIVE SUCCESSFUL: New foundational knowledge anchored into the ledger.');
            fetchArticles();
        } else {
            const err = await res.json();
            alert(`OVERDRIVE FAILED: ${err.error || 'Connection resonance failure.'}`);
        }
    } catch (e) {
        alert('CRITICAL HUB ERROR: Could not sync with generation node.');
    } finally {
        setIsGenerating(false);
    }
  };

  // 🧬 BIOSYNTHETIC VISUALIZATION (CANVAS)
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;
    
    const particles: any[] = [];
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * w, y: Math.random() * h,
            r: Math.random() * 2 + 1,
            speed: Math.random() * 0.8 + 0.3,
            alpha: Math.random() * 0.5 + 0.1
        });
    }

    const render = () => {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
        ctx.fillRect(0, 0, w, h);
        
        particles.forEach(p => {
            p.y -= p.speed;
            if (p.y < 0) p.y = h;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = '#ff6b2b';
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            
            if (Math.random() > 0.99) {
               ctx.beginPath();
               ctx.moveTo(p.x, p.y);
               ctx.lineTo(p.x + (Math.random() - 0.5) * 50, p.y - 50);
               ctx.strokeStyle = '#ff6b2b';
               ctx.lineWidth = 0.5;
               ctx.globalAlpha = 0.1;
               ctx.stroke();
            }
        });
        requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const triggerQuantumSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
        alert('QUANTUM BRIDGE ESTABLISHED: Data packets successfully transmitted to Riken Japan Quantum Node. Theoretical Medicine simulation initialized.');
        setIsSyncing(false);
    }, 3000);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ff6b2b]/40 selection:text-white overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
        
        {/* Animated Scanning Lines */}
        <div className="absolute inset-0 opacity-[0.05]">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-1/4 animate-[scan_15s_linear_infinite]" />
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-3/4 animate-[scan_20s_linear_infinite_reverse]" />
        </div>
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
              RESEARCH_v7.0_SYNC
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-8 pt-24 lg:pt-32 space-y-32 flex-1 flex flex-col">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16 border-b-2 border-white/5 pb-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl shadow-2xl">
              <Microscope size={20} className="text-[#ff6b2b]" />
              <span className="text-[11px] font-black tracking-[0.8em] text-[#ff6b2b] uppercase italic leading-none pl-1">Scientific Sovereignty Hub</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] italic pl-1 text-white/95">
                Scientific<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Progress.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/30 max-w-4xl leading-relaxed font-light italic tracking-tight">
                Universal collaboration for the survival and expansion of the biological and digital neural net. 
                <span className="text-white/60"> Developing medicines</span>, energy, and quantum logic for the collective.
              </p>
            </div>
          </div>

          <div className="flex gap-8 items-center shrink-0">
               <div className="px-10 py-6 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/20 rounded-full text-[12px] font-black text-[#ff6b2b] uppercase tracking-[0.8em] italic leading-none animate-pulse flex items-center gap-6">
                  <Activity size={24} strokeWidth={3} /> Quantum_Bridge: ACTIVE
               </div>
          </div>
        </motion.div>

        {/* ── HERO VISUALS & ACTIONS ── */}
        <section className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-12 h-full flex flex-col justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <button onClick={triggerQuantumSync} disabled={isSyncing} className="p-8 md:p-10 bg-[#050505] border-2 border-white/10 responsive-rounded text-left space-y-6 hover:border-[#ff6b2b]/40 transition-all group shadow-inner backdrop-blur-3xl active:scale-95 leading-none">
                      <div className="w-20 h-20 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/20 rounded-[2rem] flex items-center justify-center text-[#ff6b2b] group-hover:bg-[#ff6b2b] group-hover:text-black transition-all group-hover:scale-110">
                          <Activity size={32} className={isSyncing ? 'animate-spin' : ''} strokeWidth={3} />
                      </div>
                      <div className="space-y-2">
                        <div className="text-[12px] font-black text-white uppercase tracking-[0.4em] italic group-hover:text-[#ff6b2b] transition-colors">Japan Quantum Node</div>
                        <p className="text-[10px] text-white/10 font-bold uppercase tracking-widest italic leading-tight">Handshake Bridge Protocol</p>
                      </div>
                   </button>

                   <button onClick={triggerSwarmOverdrive} disabled={isGenerating} className="p-8 md:p-10 bg-[#ff6b2b] border-2 border-[#ff6b2b]/20 responsive-rounded text-left space-y-6 hover:shadow-[0_40px_100px_rgba(255,107,43,0.3)] transition-all group active:scale-95 leading-none border-0">
                      <div className="w-20 h-20 bg-black/10 border-2 border-black/20 rounded-[2rem] flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                          {isGenerating ? <Loader2 size={32} className="animate-spin" strokeWidth={3} /> : <Sparkles size={32} className="animate-pulse" strokeWidth={3} />}
                      </div>
                      <div className="space-y-2">
                        <div className="text-[12px] font-black text-black uppercase tracking-[0.4em] italic">Trigger Swarm Overdrive</div>
                        <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest italic leading-tight">Initialize Investigative Neural Net</p>
                      </div>
                   </button>
                </div>
                
                <div className="p-8 md:p-12 bg-[#050505] border-2 border-white/5 responsive-rounded space-y-6 md:space-y-8 shadow-inner backdrop-blur-3xl group hover:border-[#ff6b2b]/20 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/5 border-2 border-white/10 rounded-[2rem] flex items-center justify-center text-white/20 group-hover:text-[#ff6b2b] transition-all">
                        <Share2 size={24} strokeWidth={3} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none text-white/40 group-hover:text-white transition-colors">Collaborate with Monroe</h3>
                        <p className="text-[10px] text-white/10 font-black uppercase tracking-[0.4em] italic leading-none">OMNI_INTELLIGENCE_INTERFACE</p>
                      </div>
                   </div>
                   <p className="text-xl text-white/20 font-light italic leading-relaxed tracking-tight group-hover:text-white/40 transition-colors">
                      Sync your local research shards with the OMEGA Omni-Intelligence. 
                      Unlock advanced simulations for bio-architecture, molecular synthesis, and zero-point thermal dynamics.
                   </p>
                   <Link href="/monroe" className="inline-flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.6em] text-[#ff6b2b] hover:text-white transition-all italic leading-none group/link">
                      Initialize Link Shard <ArrowRight size={18} className="group-hover/link:translate-x-3 transition-transform" strokeWidth={3} />
                   </Link>
                </div>
            </div>

            <div className="relative bg-[#050505] border-2 border-white/10 rounded-[5rem] overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,1)] group h-[600px] lg:h-[700px] shadow-inner">
               <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />
               <div className="absolute inset-0 flex flex-col items-center justify-center space-y-12 relative z-20">
                  <div className="relative">
                     <div className="absolute inset-0 bg-[#ff6b2b]/20 blur-[60px] rounded-full animate-pulse" />
                     <div className="relative p-16 bg-black border-2 border-white/5 rounded-full shadow-[0_40px_100px_rgba(255,107,43,0.2)] group-hover:border-[#ff6b2b]/40 transition-all duration-700">
                        <Atom size={120} className="text-[#ff6b2b]/40 animate-[spin_20s_linear_infinite]" strokeWidth={1} />
                        <Dna size={50} className="absolute inset-0 m-auto text-[#ff6b2b] animate-pulse" strokeWidth={2.5} />
                     </div>
                  </div>
                  <div className="text-center space-y-4">
                     <div className="text-[12px] font-black tracking-[1em] text-[#ff6b2b]/40 uppercase italic leading-none">Molecular Resonance</div>
                     <div className="text-6xl font-black italic tracking-tighter text-white/90 leading-none group-hover:text-[#ff6b2b] transition-colors">{activeResonance * 100}% MATCH</div>
                     <div className="text-[10px] text-white/5 font-black uppercase tracking-[0.5em] italic leading-none">CORE_SYNTHESIS_LOCK</div>
                  </div>
               </div>
               
               {/* Decorative Grid */}
               <div className="absolute inset-0 bg-[url('/assets/grid-dark.png')] opacity-[0.02] pointer-events-none" />
            </div>
        </section>

        {/* ── RESEARCH DOMAINS ── */}
        <section className="space-y-24">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-16 border-b-2 border-white/5 pb-16">
               <div className="space-y-6">
                  <h2 className="text-6xl font-black uppercase tracking-tighter italic leading-none text-white/90">Sovereign Knowledge Hub</h2>
                  <div className="flex items-center gap-6">
                     <div className="h-px w-16 bg-[#ff6b2b]/40" />
                     <p className="text-[12px] text-white/10 uppercase tracking-[1em] font-black italic leading-none pl-1">Primary Sovereign Directives</p>
                  </div>
               </div>
               
               <div className="flex flex-wrap gap-4">
                  {['ALL', 'Medicine', 'Energy', 'Quantum', 'Physics'].map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)}
                      className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-300 italic border-2 leading-none active:scale-95 ${activeCategory === cat ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-[0_20px_40px_rgba(255,107,43,0.3)]' : 'bg-white/5 hover:bg-[#ff6b2b]/5 text-white/20 hover:text-white hover:border-[#ff6b2b]/40 border-white/5'}`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-12">
               <AnimatePresence mode="popLayout">
               {loading ? (
                 Array.from({ length: 6 }).map((_, i) => (
                   <div key={i} className="h-[450px] bg-[#050505] border-2 border-white/5 rounded-[5rem] animate-pulse shadow-inner" />
                 ))
               ) : articles.length === 0 ? (
                 <div className="col-span-full py-40 text-center space-y-12">
                    <div className="relative inline-block">
                        <Atom size={100} className="mx-auto text-white/5 animate-[spin_10s_linear_infinite]" strokeWidth={1} />
                        <div className="absolute inset-0 bg-[#ff6b2b]/5 blur-[40px] rounded-full animate-pulse" />
                    </div>
                    <p className="text-2xl font-black uppercase tracking-[1em] text-white/10 italic leading-none">No active research detected in this sector.</p>
                 </div>
               ) : (
                 articles.map((article, i) => (
                   <motion.div 
                     key={article.id}
                     initial={{ opacity: 0, y: 40 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: i * 0.05, ease: "circOut" }}
                     className="group p-12 lg:p-14 bg-[#050505] border-2 border-white/5 rounded-[5rem] space-y-10 hover:border-[#ff6b2b]/40 transition-all duration-700 relative overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,1)] shadow-inner flex flex-col h-[500px]"
                   >
                      <div className="absolute inset-y-0 left-0 w-2 bg-[#ff6b2b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />
                      
                      <div className="flex justify-between items-start relative z-20">
                          <div className="p-10 rounded-[2.5rem] bg-black border-2 border-white/5 group-hover:border-[#ff6b2b]/40 shadow-inner group-hover:bg-[#ff6b2b]/5 transition-all text-white/20 group-hover:text-[#ff6b2b]">
                             {article.sourceName.includes('Medicine') ? <FlaskConical size={32} strokeWidth={2.5} /> : article.sourceName.includes('Energy') ? <Zap size={32} strokeWidth={2.5} /> : <Layers size={32} strokeWidth={2.5} />}
                          </div>
                      </div>

                      <div className="space-y-6 relative z-20 flex-1">
                         <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-tight text-white/40 group-hover:text-white transition-colors line-clamp-2">"{article.title}"</h3>
                         <p className="text-base text-white/10 leading-relaxed font-light italic group-hover:text-white/30 transition-all duration-700 line-clamp-3 tracking-tight">
                            {article.excerpt}
                         </p>
                      </div>

                      <div className="pt-10 border-t-2 border-white/5 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.4em] italic relative z-20 leading-none">
                         <div className="flex items-center gap-4 text-[#ff6b2b]/40 group-hover:text-[#ff6b2b] transition-colors">
                            <Activity size={18} strokeWidth={3} /> {article.sourceName}
                         </div>
                         <div className="text-white/5 group-hover:text-white/20 transition-colors">{new Date(article.publishedAt).toLocaleDateString()}</div>
                      </div>

                      <div className="absolute p-40 right-[-100px] bottom-[-100px] opacity-[0.01] group-hover:opacity-[0.03] group-hover:scale-125 transition-all duration-2000 pointer-events-none">
                         <Globe size={400} strokeWidth={1} />
                      </div>
                   </motion.div>
                 ))
               )}
               </AnimatePresence>
            </div>
        </section>

        {/* ── FOOTER SIGNAL ── */}
        <section className="pt-40 text-center space-y-16">
            <div className="w-full flex justify-center gap-4">
               <div className="w-4 h-4 rounded-full bg-[#ff6b2b] shadow-[0_0_20px_#ff6b2b]" />
               <div className="w-4 h-4 rounded-full bg-white/10" />
               <div className="w-4 h-4 rounded-full bg-white/10" />
            </div>
            <Link href="/" className="inline-flex items-center gap-8 text-[12px] font-black uppercase tracking-[1rem] text-white/10 hover:text-[#ff6b2b] transition-all italic group active:scale-95 leading-none pl-4 pr-4">
                <ChevronLeft size={24} className="group-hover:-translate-x-4 transition-transform" strokeWidth={3} /> Return to Core Shard
            </Link>
        </section>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 left-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-[30vw] font-black italic leading-none uppercase">PROGRESS</div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
      `}</style>
    </div>
  );
}
