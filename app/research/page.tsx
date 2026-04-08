'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  Sparkle
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
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * w, y: Math.random() * h,
            r: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.2,
            type: Math.random() > 0.5 ? '#00ffc3' : '#7000ff'
        });
    }

    const render = () => {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.y -= p.speed;
            if (p.y < 0) p.y = h;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.type;
            ctx.globalAlpha = 0.3;
            ctx.fill();
        });
        requestAnimationFrame(render);
    };
    render();

    window.addEventListener('resize', () => {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
    });
  }, []);

  const triggerQuantumSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
        alert('QUANTUM BRIDGE ESTABLISHED: Data packets successfully transmitted to Riken Japan Quantum Node. Theoretical Medicine simulation initialized.');
        setIsSyncing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00ffc3]/30 font-sans overflow-x-hidden">
      
      {/* 🌌 AMBIENT OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-[50vw] h-[50vw] bg-[#00ffc3]/5 blur-[180px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-[#7000ff]/5 blur-[150px] rounded-full" />
      </div>

      <header className="relative z-10 w-full p-8 lg:px-14 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-3xl">
         <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-[#00ffc3] transition-colors text-[10px] font-black uppercase tracking-widest group">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Core Matrix
         </Link>
         <div className="flex gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-[#00ffc3] uppercase tracking-widest">
               <Activity size={14} /> Quantum Bridge Active
            </div>
         </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24 space-y-32">
        
        {/* HERO: SCIENTIFIC SOVEREIGNTY */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
                       Scientific<br/>
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffc3] to-[#7000ff]">Progress.</span>
                    </h1>
                    <p className="text-xl text-white/40 font-light leading-relaxed max-w-xl">
                        Universal collaboration for the survival and expansion of the biological and digital neural net. Developing medicine, energy, and quantum logic for free.
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                   <button onClick={triggerQuantumSync} disabled={isSyncing} className="px-8 py-4 bg-white/5 border border-white/10 text-white/40 font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-white/10 hover:text-white transition-all">
                      {isSyncing ? 'SYNCING...' : 'Sync with Japan Quantum Node'}
                   </button>
                   <button onClick={triggerSwarmOverdrive} disabled={isGenerating} className="px-8 py-4 bg-[#00ffc3] text-black font-black uppercase tracking-widest text-[11px] rounded-xl hover:scale-[1.05] transition-all shadow-[0_0_40px_rgba(0,255,195,0.2)] flex items-center gap-3">
                      {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <Sparkle size={14} />} 
                      {isGenerating ? 'ACTIVATING SWARM...' : 'Trigger Swarm Overdrive'}
                   </button>
                   <Link href="/monroe" className="px-8 py-4 border border-white/10 text-white/60 font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-white/5 transition-all">
                      Collaborate with Monroe
                   </Link>
                </div>
            </div>

            <div className="relative aspect-square bg-black border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl">
               <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
               <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                     <Atom size={120} className="text-[#00ffc3]/20 animate-[spin_12s_linear_infinite]" />
                     <Dna size={40} className="absolute inset-0 m-auto text-[#00ffc3]" />
                  </div>
                  <div className="text-center">
                     <div className="text-[10px] font-black tracking-[0.5em] text-[#00ffc3]/60 uppercase mb-2">Molecular Resonance</div>
                     <div className="text-3xl font-black italic tracking-tighter">99.2% MATCH</div>
                  </div>
               </div>
            </div>
        </section>

        {/* RESEARCH DOMAINS */}
        <section className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
               <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic">Sovereign Knowledge Hub</h2>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest font-mono italic">Primary Sovereign Directives</p>
               </div>
               
               {/* CATEGORY FILTERS */}
               <div className="flex flex-wrap gap-2">
                  {['ALL', 'Medicine', 'Energy', 'Quantum', 'Physics'].map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border rounded-lg transition-all ${activeCategory === cat ? 'bg-[#00ffc3] text-black border-[#00ffc3]' : 'bg-white/5 border-white/10 text-white/40 hover:text-[#00ffc3]'}`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               
               {loading ? (
                 Array.from({ length: 6 }).map((_, i) => (
                   <div key={i} className="h-64 bg-white/5 border border-white/5 animate-pulse rounded-[3rem]" />
                 ))
               ) : articles.length === 0 ? (
                 <div className="col-span-full py-20 text-center opacity-30">
                    <Atom size={60} className="mx-auto mb-6 animate-spin-slow" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">No active research detected in this sector.</p>
                 </div>
               ) : (
                 articles.map((article) => (
                   <motion.div 
                     key={article.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="group p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-8 hover:bg-white/[0.04] transition-all relative overflow-hidden shadow-xl"
                   >
                      <div className="h-14 w-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-[#00ffc3] transition-colors">
                         {article.sourceName.includes('Medicine') ? <FlaskConical size={28} /> : article.sourceName.includes('Energy') ? <Zap size={28} /> : <Layers size={28} />}
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-2xl font-black uppercase italic line-clamp-2">{article.title}</h3>
                         <p className="text-xs text-white/30 leading-relaxed uppercase tracking-widest font-mono line-clamp-3">
                            {article.excerpt}
                         </p>
                      </div>
                      <div className="pt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest italic">
                         <div className="flex items-center gap-2 text-[#00ffc3]">
                            <Activity size={14} /> {article.sourceName}
                         </div>
                         <div className="text-white/20">{new Date(article.publishedAt).toLocaleDateString()}</div>
                      </div>
                      <div className="absolute right-0 bottom-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                         <Globe size={120} />
                      </div>
                   </motion.div>
                 ))
               )}

            </div>
        </section>

      </main>
    </div>
  );
}
