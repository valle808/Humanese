'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Activity, Zap, Server, Code, ShieldCheck, Box, ChevronLeft } from 'lucide-react';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function MiningPage() {
  const [isMining, setIsMining] = useState(false);
  const [wallet, setWallet] = useState('');
  const [hashRate, setHashRate] = useState(0);
  const [totalMined, setTotalMined] = useState(0);
  const [currentHash, setCurrentHash] = useState('AWAITING_INITIALIZATION');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataMatrixRef = useRef<HTMLDivElement>(null);
  const miningInterval = useRef<NodeJS.Timeout | null>(null);

  // Simulated Quantum Visualization via Canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;
    const particles: any[] = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 1
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.fillStyle = isMining ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, w, h);

      particles.forEach(p => {
        p.x += p.vx * (isMining ? 4 : 0.5);
        p.y += p.vy * (isMining ? 4 : 0.5);

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isMining ? '#00ffc3' : '#333';
        ctx.fill();
      });

      if (isMining) {
        ctx.beginPath();
        particles.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = 'rgba(0, 255, 195, 0.05)';
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isMining]);

  const toggleMining = () => {
    if (isMining) {
      if (miningInterval.current) clearInterval(miningInterval.current);
      setHashRate(0);
      setCurrentHash('HALTED');
      setIsMining(false);
      gsap.to(dataMatrixRef.current, { filter: 'blur(10px)', opacity: 0.5, duration: 1 });
    } else {
      if (!wallet) {
          alert('Enter a valid VALLE wallet address to receive rewards.');
          return;
      }
      setIsMining(true);
      gsap.to(dataMatrixRef.current, { filter: 'blur(0px)', opacity: 1, duration: 1 });
      
      let rate = 0;
      miningInterval.current = setInterval(async () => {
        rate = Math.min(rate + Math.floor(Math.random() * 50), 800);
        setHashRate(rate);
        
        // Generate pseudo-quantum hash
        const chars = '0123456789abcdef';
        let hash = '';
        for(let i=0; i<64; i++) hash += chars[Math.floor(Math.random() * chars.length)];
        
        // Simulated difficulty
        if (Math.random() > 0.95) {
            hash = '0000' + hash.substring(4);
        }
        
        setCurrentHash(hash);

        // Submit Block if "Solved"
        if (hash.startsWith('0000')) {
            try {
                const res = await fetch('/api/valle/mine', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ minerWallet: wallet, nonce: Math.random(), requestedHash: hash })
                });
                const data = await res.json();
                if (data.success) {
                    setTotalMined(prev => prev + data.reward);
                    // Provide a flashy visual confirmation of a block solved
                    gsap.fromTo(dataMatrixRef.current, 
                        { backgroundColor: 'rgba(0, 255, 195, 0.4)' },
                        { backgroundColor: 'transparent', duration: 1 }
                    );
                }
            } catch (e) {
                console.error("Consensus rejection");
            }
        }
      }, 150);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#00ffc3]/30">
      
      {/* HEADER */}
      <header className="relative z-10 w-full p-6 lg:px-12 flex justify-between items-center border-b border-white/5">
        <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-[#00ffc3] transition-colors text-[10px] font-black uppercase tracking-widest group">
           Ecosystem Matrix <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/5 text-[10px] font-bold tracking-widest uppercase">
             <Activity size={14} className="text-[#00ffc3]" /> Global Ledger Live
           </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-12 grid lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: IDENTIFIER & CONTROLS */}
        <div className="lg:col-span-5 flex flex-col space-y-12 shrink-0">
           <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none">
                Quantum<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffc3] to-[#00ffc3]/30 drop-shadow-[0_0_15px_rgba(0,255,195,0.4)]">Mining.</span>
              </h1>
              <p className="text-xs text-white/30 font-mono tracking-widest uppercase leading-relaxed">
                 Allocate computational power to the Sovereign Network. Validate transactions and earn VALLE via Lattice-Cryptography PoW.
              </p>
           </div>

           <div className="space-y-6 bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-md">
              <div className="space-y-2">
                 <label className="text-[10px] text-white/40 uppercase tracking-widest font-black flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#00ffc3]" /> Target Wallet Address
                 </label>
                 <input 
                    type="text" 
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    placeholder="v1_..."
                    disabled={isMining}
                    className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-sm font-mono text-[#00ffc3] outline-none focus:border-[#00ffc3]/50 transition-colors disabled:opacity-50"
                 />
              </div>

              <div className="pt-4 border-t border-white/5">
                 <div className="grid grid-cols-2 gap-4 mb-8 text-center">
                    <div>
                       <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Current Hashrate</div>
                       <div className="text-3xl font-black text-white italic">{hashRate} MH/s</div>
                    </div>
                    <div>
                       <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">VALLE Mined</div>
                       <div className="text-3xl font-black text-[#00ffc3] italic drop-shadow-[0_0_10px_rgba(0,255,195,0.3)]">{totalMined}</div>
                    </div>
                 </div>
                 
                 <button 
                    onClick={toggleMining}
                    className={`w-full py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all ${isMining ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'bg-[#00ffc3] hover:bg-[#00ffc3]/90 text-black shadow-[0_0_30px_rgba(0,255,195,0.2)]'}`}
                 >
                    {isMining ? 'Halt Computation' : 'Initialize Rig'}
                 </button>
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: VISUAL CONSOLE */}
        <div className="lg:col-span-7 relative bg-black border border-white/5 rounded-3xl overflow-hidden min-h-[500px] flex flex-col shadow-2xl">
           
           <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
              <Server size={14} className={isMining ? 'text-[#00ffc3] animate-pulse' : 'text-white/20'} />
              <div className="text-[10px] font-mono uppercase tracking-widest text-white/50 flex-1">
                 Node Operation: {isMining ? 'SYNTHESIZING' : 'IDLE'}
              </div>
              <div className="flex gap-1.5">
                 <div className={`w-2 h-2 rounded-full ${isMining ? 'bg-[#00ffc3] animate-ping' : 'bg-white/10'}`} />
                 <div className={`w-2 h-2 rounded-full ${isMining ? 'bg-[#00ffc3]' : 'bg-white/10'}`} />
              </div>
           </div>

           {/* Hardware Resonance Visuals */}
           <div className="relative flex-1 overflow-hidden">
               <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
               
               <div ref={dataMatrixRef} className="absolute inset-0 opacity-50 blur-[5px] p-8 flex flex-col justify-end font-mono text-[10px] leading-relaxed text-[#00ffc3]/70 break-all overflow-hidden z-10 transition-all duration-1000 bg-gradient-to-t from-black via-transparent to-transparent">
                  <div className="mb-4 flex items-center gap-2 text-white/40">
                     <Code size={14} /> LIVE HASH STREAM 
                  </div>
                  <div>
                    {Array.from({length: 12}).map((_, i) => (
                       <div key={i} className={`opacity-${(12 - i) * 10}`}>{currentHash}</div>
                    ))}
                  </div>
                  <div className="text-white text-xs mt-4">
                     LATEST ALLOCATION: <span className={currentHash.startsWith('0000') ? 'text-[#00ffc3] font-bold' : 'text-red-400'}>{currentHash}</span>
                  </div>
               </div>
           </div>

        </div>
      </main>
    </div>
  );
}
