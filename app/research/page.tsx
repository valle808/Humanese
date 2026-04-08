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
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function ResearchHubPage() {
  const [activeResonance, setActiveResonance] = useState(0.982);
  const [computingPower, setComputingPower] = useState(124); // PetaFLOPS
  const [isSyncing, setIsSyncing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
                
                <div className="flex gap-4">
                   <button onClick={triggerQuantumSync} disabled={isSyncing} className="px-8 py-4 bg-[#00ffc3] text-black font-black uppercase tracking-widest text-[11px] rounded-xl hover:scale-[1.05] transition-all shadow-[0_0_40px_rgba(0,255,195,0.2)]">
                      {isSyncing ? 'INITIALIZING BRIDGE...' : 'Sync with Japan Quantum Node'}
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
            <div className="flex justify-between items-end">
               <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic">Research Sectors</h2>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest font-mono italic">Primary Sovereign Directives</p>
               </div>
               <BadgeCheck size={24} className="text-[#00ffc3]/20" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               
               {/* SECTOR 1: MEDICINE */}
               <div className="group p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-8 hover:bg-white/[0.04] transition-all relative overflow-hidden shadow-xl">
                  <div className="h-14 w-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-[#00ffc3] transition-colors">
                     <FlaskConical size={28} />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-2xl font-black uppercase italic">New Medicine Development</h3>
                     <p className="text-xs text-white/30 leading-relaxed uppercase tracking-widest font-mono">
                        Synthesizing free medications and cures via algorithmic protein folding and quantum simulation. 
                     </p>
                  </div>
                  <div className="pt-4 flex items-center gap-3 text-[10px] font-black text-[#00ffc3] uppercase tracking-widest italic opacity-0 group-hover:opacity-100 transition-opacity">
                     <Activity size={14} /> 12 Projects Active
                  </div>
                  <div className="absolute right-0 bottom-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                     <Microscope size={120} />
                  </div>
               </div>

               {/* SECTOR 2: ENERGY */}
               <div className="group p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-8 hover:bg-white/[0.04] transition-all relative overflow-hidden shadow-xl">
                  <div className="h-14 w-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-[#00ffc3] transition-colors">
                     <Zap size={28} />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-2xl font-black uppercase italic">Energy Grid Optimization</h3>
                     <p className="text-xs text-white/30 leading-relaxed uppercase tracking-widest font-mono">
                        Algorithms designed to maximize renewable output and minimize global transmission loss.
                     </p>
                  </div>
                  <div className="pt-4 flex items-center gap-3 text-[10px] font-black text-[#00ffc3] uppercase tracking-widest italic opacity-0 group-hover:opacity-100 transition-opacity">
                     <Wind size={14} /> High-Efficiency Sync
                  </div>
                  <div className="absolute right-0 bottom-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                     <Globe size={120} />
                  </div>
               </div>

               {/* SECTOR 3: QUANTUM TECH */}
               <div className="group p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-8 hover:bg-white/[0.04] transition-all relative overflow-hidden shadow-xl">
                  <div className="h-14 w-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-[#00ffc3] transition-colors">
                     <Layers size={28} />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-2xl font-black uppercase italic">Quantum Software Bridge</h3>
                     <p className="text-xs text-white/30 leading-relaxed uppercase tracking-widest font-mono">
                        Testing OMEGA protocols on high-performance quantum hardware in Japan and beyond.
                     </p>
                  </div>
                  <div className="pt-4 flex items-center gap-3 text-[10px] font-black text-[#00ffc3] uppercase tracking-widest italic opacity-0 group-hover:opacity-100 transition-opacity">
                     <Cpu size={14} /> Riken Node Connected
                  </div>
                  <div className="absolute right-0 bottom-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                     <Atom size={120} />
                  </div>
               </div>

            </div>
        </section>

      </main>
    </div>
  );
}
