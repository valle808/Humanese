'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Activity, 
  Zap, 
  Server, 
  Code, 
  ShieldCheck, 
  ChevronLeft,
  Terminal,
  ShieldHalf,
  Target,
  Database,
  TrendingUp,
  Award,
  Clock,
  Hash,
  Users,
  BarChart3,
  Layers,
  ArrowRight,
  RefreshCcw
} from 'lucide-react';
import { gsap } from 'gsap';
import Link from 'next/link';

interface NetworkStats {
  circulatingSupply: number;
  totalTransactions: number;
  totalNodes: number;
  networkDifficulty: string;
  blockReward: number;
  maxSupply: number;
}

interface LeaderboardEntry {
  rank: number;
  walletId: string;
  address: string;
  totalMined: number;
  blocksFound: number;
}

interface RecentBlock {
  id: string;
  hash: string | null;
  amount: number;
  createdAt: string;
  address: string;
}

export default function MiningPage() {
  const [isMining, setIsMining] = useState(false);
  const [wallet, setWallet] = useState('');
  const [hashRate, setHashRate] = useState(0);
  const [totalMined, setTotalMined] = useState(0);
  const [currentHash, setCurrentHash] = useState('AWAITING_INITIALIZATION');
  const [blocksFound, setBlocksFound] = useState(0);
  
  // Live network data
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [recentBlocks, setRecentBlocks] = useState<RecentBlock[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'blocks'>('leaderboard');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataMatrixRef = useRef<HTMLDivElement>(null);
  const miningInterval = useRef<NodeJS.Timeout | null>(null);
  const statsInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchNetworkStats = useCallback(async () => {
    try {
      const res = await fetch('/api/valle/network-stats');
      const data = await res.json();
      if (data.success) {
        setNetworkStats(data.metrics);
        setLeaderboard(data.leaderboard || []);
        setRecentBlocks(data.recentBlocks || []);
      }
    } catch (e) {
      console.error('[Network stats fetch]', e);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchNetworkStats();
    statsInterval.current = setInterval(fetchNetworkStats, 15000); // refresh every 15s
    return () => { if (statsInterval.current) clearInterval(statsInterval.current); };
  }, [fetchNetworkStats]);

  // Quantum Canvas Visualization
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
        vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.fillStyle = isMining ? 'rgba(5, 5, 5, 0.12)' : 'rgba(5, 5, 5, 0.4)';
      ctx.fillRect(0, 0, w, h);

      particles.forEach(p => {
        p.x += p.vx * (isMining ? 7 : 0.8);
        p.y += p.vy * (isMining ? 7 : 0.8);
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isMining ? `rgba(255, 107, 43, ${p.alpha * 2})` : `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
        
        if (isMining && Math.random() > 0.98) {
           ctx.beginPath();
           ctx.moveTo(p.x, p.y);
           ctx.lineTo(p.x + (Math.random() - 0.5) * 50, p.y + (Math.random() - 0.5) * 50);
           ctx.strokeStyle = 'hsl(var(--primary))';
           ctx.lineWidth = 1;
           ctx.stroke();
        }
      });

      if (isMining) {
        ctx.beginPath();
        particles.forEach((p, idx) => {
          if (idx % 5 === 0) {
             particles.forEach((p2) => {
               const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
               if (dist < 110) {
                 ctx.moveTo(p.x, p.y);
                 ctx.lineTo(p2.x, p2.y);
               }
             });
          }
        });
        ctx.strokeStyle = 'hsl(var(--primary) / 0.08)';
        ctx.lineWidth = 1;
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
      gsap.to(dataMatrixRef.current, { filter: 'blur(20px)', opacity: 0.2, duration: 1 });
    } else {
      if (!wallet.trim()) {
        alert('VERIFICATION_ERROR: Enter a valid VALLE wallet address to receive rewards.');
        return;
      }
      setIsMining(true);
      gsap.to(dataMatrixRef.current, { filter: 'blur(0px)', opacity: 1, duration: 1 });
      
      let rate = 0;
      miningInterval.current = setInterval(async () => {
        rate = Math.min(rate + Math.floor(Math.random() * 60), 1400);
        setHashRate(rate);
        
        const chars = '0123456789ABCDEF';
        let hash = '';
        for (let i = 0; i < 64; i++) hash += chars[Math.floor(Math.random() * chars.length)];
        
        // Stochastic difficulty — ~3% chance of a valid block
        if (Math.random() > 0.97) hash = '000000' + hash.substring(6);
        
        setCurrentHash(hash);

        if (hash.startsWith('000000')) {
          try {
            const res = await fetch('/api/valle/mine', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ minerWallet: wallet, nonce: Math.random(), requestedHash: hash })
            });
            const data = await res.json();
            if (data.success) {
              setTotalMined(prev => prev + data.reward);
              setBlocksFound(prev => prev + 1);
              gsap.fromTo(dataMatrixRef.current,
                { backgroundColor: 'hsl(var(--primary) / 0.4)' },
                { backgroundColor: 'transparent', duration: 1.8 }
              );
              // Re-fetch leaderboard after block confirmed
              fetchNetworkStats();
            }
          } catch (e) {
            console.error('[OMEGA] Consensus rejection');
          }
        }
      }, 100);
    }
  };

  const formatSupply = (n: number) => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
    return n.toFixed(2);
  };

  const truncAddr = (addr: string) => addr.length > 20 ? `${addr.slice(0, 10)}...${addr.slice(-6)}` : addr;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-primary/40 selection:text-foreground overflow-x-hidden pb-40">
      
      {/* AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.05]">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent absolute top-1/4 animate-[scan_15s_linear_infinite]" />
           <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent absolute top-3/4 animate-[scan_20s_linear_infinite_reverse]" />
        </div>
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-muted/40 backdrop-blur-3xl border-b border-border">
        <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground/20 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
              QUANTUM_MINING_v7.0
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16 border-b-2 border-border pb-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-muted/10 border border-border rounded-full backdrop-blur-3xl shadow-2xl">
              <Cpu size={20} className="text-primary" />
              <span className="text-[11px] font-black tracking-[0.8em] text-primary uppercase italic leading-none pl-1">Quantum Resource Allocation</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-fluid-hero font-black uppercase tracking-tighter italic leading-[0.9] md:leading-[0.8] pl-1 text-muted-foreground/95">
                Quantum<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-primary/30">Mining.</span>
              </h1>
              <p className="text-fluid-title text-muted-foreground/30 max-w-4xl leading-relaxed font-light italic tracking-tight">
                Allocate computational power to the Sovereign Network. 
                <span className="text-muted-foreground/60"> Validate transactions</span> and earn VALLE via Lattice-Cryptography PoW.
              </p>
            </div>
          </div>
          <div className="flex gap-10 items-center shrink-0">
               <div className="px-10 py-8 bg-primary/10 border-2 border-primary/20 rounded-full text-[12px] font-black text-primary uppercase tracking-[0.8em] italic leading-none animate-pulse flex items-center gap-8 shadow-2xl">
                  <Activity size={32} strokeWidth={3} className="animate-pulse" />
                  Global_Ledger_Sync: ACTIVE
               </div>
          </div>
        </motion.div>

        {/* LIVE NETWORK METRICS BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {[
            { label: 'Circulating Supply', value: networkStats ? formatSupply(networkStats.circulatingSupply) : '—', unit: 'VALLE', icon: <Layers size={20}/> },
            { label: 'Max Supply', value: '5B', unit: 'VALLE', icon: <BarChart3 size={20}/> },
            { label: 'Block Reward', value: '12.5', unit: 'VALLE', icon: <Zap size={20}/> },
            { label: 'Total Blocks', value: networkStats ? String(networkStats.totalTransactions) : '—', unit: 'TX', icon: <Hash size={20}/> },
            { label: 'Active Nodes', value: networkStats ? String(networkStats.totalNodes.toLocaleString()) : '—', unit: 'NODES', icon: <Users size={20}/> },
            { label: 'Difficulty', value: networkStats?.networkDifficulty ?? '—', unit: 'NET', icon: <TrendingUp size={20}/> },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="p-6 md:p-8 bg-background border-2 border-border rounded-[2rem] md:rounded-[3.5rem] backdrop-blur-3xl group hover:border-primary/30 transition-all shadow-inner relative overflow-hidden"
            >
              <div className="text-primary/40 group-hover:text-primary transition-all mb-4">{s.icon}</div>
              <div className="text-3xl font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors">{s.value}</div>
              <div className="text-[9px] text-muted-foreground/10 font-black uppercase tracking-[0.4em] italic leading-none mt-2">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* LEFT: MINING CONTROLS */}
            <div className="lg:col-span-5 space-y-12 lg:sticky lg:top-32 h-fit">
              <div className="bg-background border-2 border-border p-8 md:p-12 lg:p-14 responsive-rounded backdrop-blur-3xl space-y-12 shadow-[0_80px_150px_rgba(0,0,0,1)] relative overflow-hidden group transition-all shadow-inner">
                <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-125 transition-transform duration-2000">
                    <ShieldCheck size={250} className="text-primary" />
                </div>
                
                <div className="text-[12px] font-black text-primary uppercase tracking-[0.8em] flex items-center gap-6 italic relative z-10 leading-none pl-2 animate-pulse">
                   <Target size={24} strokeWidth={3} /> Initializer Rig
                </div>
                
                <div className="space-y-10 relative z-10 pl-2">
                   <div className="space-y-6">
                      <label className="text-[11px] text-muted-foreground/10 uppercase tracking-[0.6em] font-black italic leading-none flex items-center gap-4 pl-1">
                         <Terminal size={18} strokeWidth={3} className="text-primary/40" /> Target_Vault_Registry
                      </label>
                      <input 
                        type="text" 
                        value={wallet}
                        onChange={(e) => setWallet(e.target.value)}
                        placeholder="v1_0x..."
                        disabled={isMining}
                        className="w-full bg-muted border-2 border-border p-8 rounded-[2.5rem] text-xl font-mono text-primary outline-none focus:border-primary/40 focus:bg-primary/5 transition-all disabled:opacity-30 italic shadow-inner"
                      />
                   </div>

                   <div className="pt-8 border-t-2 border-border space-y-12">
                      {/* Session Stats */}
                      <div className="grid grid-cols-3 gap-6">
                         <div className="space-y-3 text-center">
                            <div className="text-[10px] text-muted-foreground/5 uppercase tracking-[0.4em] font-black italic leading-none">Hashrate</div>
                            <div className="text-4xl font-black text-foreground italic tracking-tighter leading-none">{hashRate}</div>
                            <div className="text-[9px] text-muted-foreground/10 font-black uppercase italic">MH/S</div>
                         </div>
                         <div className="space-y-3 text-center">
                            <div className="text-[10px] text-muted-foreground/5 uppercase tracking-[0.4em] font-black italic leading-none">Session Yield</div>
                            <div className="text-4xl font-black text-primary italic tracking-tighter leading-none drop-shadow-[0_0_15px_hsl(var(--primary))]">{totalMined}</div>
                            <div className="text-[9px] text-muted-foreground/10 font-black uppercase italic">VALLE</div>
                         </div>
                         <div className="space-y-3 text-center">
                            <div className="text-[10px] text-muted-foreground/5 uppercase tracking-[0.4em] font-black italic leading-none">Blocks</div>
                            <div className="text-4xl font-black text-foreground italic tracking-tighter leading-none">{blocksFound}</div>
                            <div className="text-[9px] text-muted-foreground/10 font-black uppercase italic">FOUND</div>
                         </div>
                      </div>
                      
                      <button 
                        onClick={toggleMining}
                        className={`w-full py-10 rounded-[3rem] font-black uppercase tracking-[1em] text-xs transition-all italic leading-none active:scale-95 shadow-2xl relative overflow-hidden group/btn border-0 ${isMining ? 'bg-red-500 text-foreground shadow-[0_40px_80px_rgba(239,68,68,0.3)]' : 'bg-primary text-primary-foreground shadow-[0_40px_80px_rgba(var(--primary),0.3)]'}`}
                      >
                         <span className="relative z-10 flex items-center justify-center gap-6">
                            {isMining ? 'Halt Computation' : 'Initialize Rig'}
                            {isMining ? <ShieldHalf size={20} className="animate-spin" /> : <Zap size={20} className="animate-pulse" />}
                         </span>
                         <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                      </button>
                   </div>
                </div>
              </div>
            </div>

            {/* RIGHT: CONSOLE + LEADERBOARD */}
            <div className="lg:col-span-7 space-y-12">

               {/* Visual Console */}
               <div className="bg-background border-2 border-border responsive-rounded overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,1)] relative group h-[520px] flex flex-col">
                  <div className="p-10 lg:px-14 border-b-2 border-border flex justify-between items-center bg-muted/10 relative z-20 shrink-0">
                     <div className="flex items-center gap-6">
                        <Server size={32} className={isMining ? 'text-primary animate-pulse' : 'text-muted-foreground/10'} strokeWidth={2.5} />
                        <div className="space-y-1">
                           <div className="text-3xl font-black uppercase tracking-tighter italic text-muted-foreground/40 leading-none group-hover:text-foreground transition-colors">Node Operation</div>
                           <div className="text-[10px] font-mono uppercase tracking-[0.6em] text-primary/40 italic leading-none">{isMining ? 'SYNTHESIZING_CORE_RESONANCE' : 'PRIMARY_IDLE_STATE'}</div>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className={`w-4 h-4 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.4)] ${isMining ? 'bg-primary animate-ping' : 'bg-muted/10'}`} />
                        <div className={`w-4 h-4 rounded-full ${isMining ? 'bg-primary' : 'bg-muted/10'}`} />
                     </div>
                  </div>

                  <div className="relative flex-1 overflow-hidden">
                      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
                      
                      <div ref={dataMatrixRef} className="absolute inset-0 p-12 lg:p-16 flex flex-col justify-end font-mono text-[11px] leading-relaxed text-primary/50 break-all overflow-hidden z-20 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 blur-[2px] transition-all duration-1000">
                         <div className="mb-8 flex items-center gap-6 text-muted-foreground/10 border-b-2 border-border pb-8">
                            <Code size={24} strokeWidth={3} /> <span className="text-[14px] font-black uppercase tracking-[0.8em] italic">Live_Hash_Resonance_Stream</span> 
                         </div>
                         <div className="space-y-1">
                           {Array.from({length: 10}).map((_, i) => (
                              <div key={i} className={`opacity-${Math.max(10, (10 - i) * 11)} tracking-widest truncate`}>{currentHash}</div>
                           ))}
                         </div>
                         <div className="text-foreground text-lg mt-10 bg-primary/5 border-2 border-primary/20 p-8 rounded-[2rem] shadow-inner backdrop-blur-3xl group-hover:border-primary/40 transition-all flex items-center gap-6">
                            <span className="text-muted-foreground/20 uppercase tracking-[0.5em] font-black italic text-xs leading-none shrink-0">LATEST:</span>
                            <span className={`truncate leading-none uppercase tracking-widest ${currentHash.startsWith('000000') ? 'text-primary font-black italic drop-shadow-[0_0_15px_hsl(var(--primary))]' : 'text-muted-foreground/60'}`}>{currentHash}</span>
                         </div>
                      </div>
                      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent z-10" />
                  </div>
               </div>

               {/* LEADERBOARD + RECENT BLOCKS */}
               <div className="bg-background border-2 border-border responsive-rounded overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,1)]">
                  {/* Tab Bar */}
                  <div className="p-8 lg:px-12 border-b-2 border-border flex items-center justify-between">
                     <div className="flex gap-4">
                        <button
                          onClick={() => setActiveTab('leaderboard')}
                          className={`px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.4em] italic transition-all active:scale-95 border-2 ${activeTab === 'leaderboard' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/10 border-border text-muted-foreground/20 hover:border-primary/30'}`}
                        >
                          <Award size={14} className="inline mr-3" />Leaderboard
                        </button>
                        <button
                          onClick={() => setActiveTab('blocks')}
                          className={`px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.4em] italic transition-all active:scale-95 border-2 ${activeTab === 'blocks' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/10 border-border text-muted-foreground/20 hover:border-primary/30'}`}
                        >
                          <Clock size={14} className="inline mr-3" />Recent Blocks
                        </button>
                     </div>
                     <button
                       onClick={fetchNetworkStats}
                       className="p-4 bg-muted/10 border border-border rounded-full text-muted-foreground/20 hover:text-primary hover:border-primary/30 transition-all active:scale-90"
                       title="Refresh ledger"
                     >
                       <RefreshCcw size={18} />
                     </button>
                  </div>

                  <div className="p-8 lg:p-12 max-h-[560px] overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                      {activeTab === 'leaderboard' ? (
                        <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                          {isLoadingStats ? (
                            Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="h-20 animate-pulse bg-muted/10 rounded-[2rem]" />
                            ))
                          ) : leaderboard.length === 0 ? (
                            <div className="text-center py-24 space-y-6">
                              <Award size={80} className="mx-auto text-muted-foreground/5" />
                              <p className="text-muted-foreground/20 font-black uppercase italic tracking-tight text-xl">No blocks mined yet. Initialize your rig.</p>
                            </div>
                          ) : leaderboard.map((entry, i) => (
                            <motion.div
                              key={entry.walletId}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-center gap-8 p-8 bg-muted border-2 border-border rounded-[2.5rem] group hover:border-primary/30 transition-all"
                            >
                              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-[15px] font-black italic shrink-0 ${entry.rank === 1 ? 'bg-primary text-primary-foreground' : entry.rank === 2 ? 'bg-muted/10 text-foreground' : entry.rank === 3 ? 'bg-muted/10 text-muted-foreground/60' : 'bg-muted/10 text-muted-foreground/20'}`}>
                                #{entry.rank}
                              </div>
                              <div className="flex-1 min-w-0 space-y-2">
                                <div className="font-mono text-[13px] text-muted-foreground/60 group-hover:text-foreground transition-colors truncate">{truncAddr(entry.address)}</div>
                                <div className="text-[10px] text-muted-foreground/10 uppercase tracking-[0.4em] italic">{entry.blocksFound} BLOCKS CONFIRMED</div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-2xl font-black text-primary italic tracking-tighter">{entry.totalMined.toFixed(1)}</div>
                                <div className="text-[9px] text-muted-foreground/10 uppercase tracking-[0.4em] italic">VALLE</div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div key="blocks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                          {isLoadingStats ? (
                            Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="h-16 animate-pulse bg-muted/10 rounded-[2rem]" />
                            ))
                          ) : recentBlocks.length === 0 ? (
                            <div className="text-center py-24 space-y-6">
                              <Database size={80} className="mx-auto text-muted-foreground/5" />
                              <p className="text-muted-foreground/20 font-black uppercase italic tracking-tight text-xl">Ledger is empty. Mine the first block.</p>
                            </div>
                          ) : recentBlocks.map((block, i) => (
                            <motion.div
                              key={block.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.03 }}
                              className="flex items-center gap-8 p-6 bg-muted border border-border rounded-[2rem] group hover:border-primary/20 transition-all"
                            >
                              <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))] shrink-0" />
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="font-mono text-[11px] text-primary/60 truncate">{block.hash ?? 'UNKNOWN'}</div>
                                <div className="text-[10px] text-muted-foreground/10 uppercase tracking-[0.3em] italic">{truncAddr(block.address)}</div>
                              </div>
                              <div className="text-right shrink-0 space-y-1">
                                <div className="text-foreground font-black text-lg italic">+{block.amount} <span className="text-primary text-xs">VALLE</span></div>
                                <div className="text-[9px] text-muted-foreground/10 uppercase tracking-[0.3em]">{formatTime(block.createdAt)}</div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
               </div>
            </div>
        </div>

        {/* FOOTER */}
        <section className="pt-40 text-center space-y-16">
            <div className="w-full flex justify-center gap-4">
               <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]" />
               <div className="w-4 h-4 rounded-full bg-muted/10" />
               <div className="w-4 h-4 rounded-full bg-muted/10" />
            </div>
            <Link href="/" className="inline-flex items-center gap-8 text-[12px] font-black uppercase tracking-[1rem] text-muted-foreground/10 hover:text-primary transition-all italic group active:scale-95 leading-none pl-4 pr-4">
                <ChevronLeft size={24} className="group-hover:-translate-x-4 transition-transform" strokeWidth={3} /> Return to Core Shard
            </Link>
        </section>

      </main>

      <div className="fixed bottom-0 left-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-fluid-hero font-black italic leading-none uppercase">MINE</div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--primary) / 0.15); border-radius: 20px; }
      `}</style>
    </div>
  );
}
