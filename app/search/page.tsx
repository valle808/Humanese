'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Globe, 
  ChevronRight, 
  Sparkles, 
  X, 
  Activity, 
  Layers, 
  ArrowUpRight, 
  ArrowLeft,
  Terminal,
  Cpu,
  Radio,
  Wifi,
  Target,
  ChevronLeft,
  Orbit,
  Grid,
  ShieldHalf,
  Clock,
  Binary,
  ShieldCheck,
  Brain,
  Plus,
  ArrowRight,
  Database,
  Smartphone,
  CreditCard,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  relevance: number;
}

export default function HumanlookPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchTime, setSearchTime] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus search input on load
    inputRef.current?.focus();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults([]);
    const startTime = performance.now();

    try {
      const res = await fetch(`/api/search/humanlook?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      const endTime = performance.now();
      setSearchTime(Number(((endTime - startTime) / 1000).toFixed(3)));
      
      if (data.results) {
        setResults(data.results);
      }
    } catch (err) {
      console.error('Optical Index Error:', err);
    } finally {
      setIsSearching(false);
    }
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
        <Link href="/" className="inline-flex items-center gap-6 group">
            <div className="w-16 h-16 bg-black border-2 border-white/5 rounded-[2rem] flex items-center justify-center group-hover:border-[#ff6b2b]/40 transition-all shadow-inner group-hover:scale-110 group-hover:bg-[#ff6b2b]/5">
                <Radio size={32} className="text-[#ff6b2b] animate-pulse" strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none text-white/90">OMEGA <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Optical.</span></h1>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/5 italic leading-none pl-1">Sovereign Research Index</p>
            </div>
        </Link>
        <div className="flex items-center gap-8">
            <Link href="/monroe" className="px-10 py-4 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/20 rounded-full text-[11px] font-black uppercase tracking-[0.6em] text-[#ff6b2b] hover:bg-[#ff6b2b] hover:text-black transition-all italic leading-none animate-pulse flex items-center gap-4 active:scale-95 group">
                <Sparkles size={18} strokeWidth={3} className="group-hover:scale-125 transition-transform" /> Monroe_Interface
            </Link>
            <div className="px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full text-[10px] font-black text-white/10 uppercase tracking-[0.4em] italic leading-none animate-pulse hidden md:flex items-center gap-4">
                <Wifi size={14} strokeWidth={3} className="text-[#ff6b2b]" /> SAT_RELAY_07_SYNC
            </div>
        </div>
      </header>

      <main className={`relative z-10 w-full max-w-[1700px] mx-auto flex-1 flex flex-col px-8 transition-all duration-1000 ease-out ${results.length > 0 ? 'pt-24 lg:pt-32 pb-40' : 'justify-center items-center h-[calc(100vh-200px)]'}`}>
        
        {/* LOGO (Only show on empty state) */}
        <AnimatePresence mode="wait">
          {results.length === 0 && !isSearching && (
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -60, filter: 'blur(40px)' }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="mb-24 text-center space-y-16"
            >
              <div className="relative inline-block mb-10">
                 <div className="absolute inset-0 bg-[#ff6b2b]/10 blur-[60px] rounded-full animate-pulse" />
                 <div className="relative w-40 h-40 bg-black border-2 border-white/5 rounded-[3.5rem] flex items-center justify-center mx-auto shadow-[0_40px_100px_rgba(255,107,43,0.2)] hover:border-[#ff6b2b]/40 transition-all duration-700 hover:scale-110">
                    <Search size={80} className="text-[#ff6b2b]" strokeWidth={2.5} />
                 </div>
              </div>
              <div className="space-y-8">
                <h2 className="text-8xl md:text-[12rem] font-black uppercase tracking-tighter italic leading-[0.8] text-white/95">
                  OMEGA<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Optical.</span>
                </h2>
                <p className="max-w-4xl mx-auto text-3xl text-white/20 font-light italic leading-relaxed tracking-tight">
                   Accessing the Sovereign Optical Index. Deciphering the global matrix with 
                   <span className="text-white/60"> zero censorship</span> and near-zero latency operations.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INPUT FORM */}
        <motion.form 
          layout
          onSubmit={handleSearch} 
          className="w-full relative group max-w-6xl"
        >
          <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none z-20">
            {isSearching ? (
              <Activity size={48} className="text-[#ff6b2b] animate-pulse" strokeWidth={3} />
            ) : (
              <Search size={48} className="text-white/5 group-focus-within:text-[#ff6b2b] transition-all duration-700" strokeWidth={3} />
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the global matrix..."
            className="w-full bg-[#050505] border-2 border-white/5 rounded-[4rem] py-12 pl-32 pr-32 text-4xl md:text-5xl text-white outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all duration-700 shadow-[0_40px_100px_rgba(0,0,0,1)] group-hover:border-white/10 placeholder:text-white/5 italic font-light shadow-inner"
          />
          {query && (
            <button 
              type="button" 
              onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
              className="absolute inset-y-0 right-16 flex items-center text-white/5 hover:text-[#ff6b2b] transition-all z-20 hover:scale-125"
            >
              <X size={40} strokeWidth={3} />
            </button>
          )}
          
          {/* OMEGA Underglow (Search Active) */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-[#ff6b2b]/10 blur-[60px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-1500" />
        </motion.form>

        {/* RESULTS AREA */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-32 space-y-24"
            >
              {/* Telemetry Stats */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 border-b-2 border-white/5 pb-16">
                 <div className="flex items-center gap-10 text-[12px] font-black text-white/5 uppercase tracking-[0.6em] italic leading-none pl-4">
                    <span className="flex items-center gap-6"><Layers size={24} className="text-[#ff6b2b]" strokeWidth={3} /> Sovereign Synthesis</span>
                    <div className="h-2 w-2 bg-white/5 rounded-full" />
                    <span className="text-white/20">Transcoded {results.length} shards</span>
                    <div className="h-2 w-2 bg-white/5 rounded-full" />
                    <span className="text-white/20">Latency: {searchTime}s</span>
                 </div>
                 <div className="px-10 py-4 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/20 rounded-full text-[11px] font-black text-[#ff6b2b] uppercase tracking-[0.6em] italic leading-none animate-pulse">
                    SIGNAL_RESONANCE_CALIBRATED
                 </div>
              </div>

              {/* Result List */}
              <div className="space-y-24 max-w-[1300px]">
                {results.map((result, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.6, ease: "circOut" }}
                    key={idx} 
                    className="group relative"
                  >
                    <div className="absolute inset-y-0 left-[-60px] w-2 bg-[#ff6b2b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />
                    
                    <div className="flex items-center gap-6 text-[12px] font-black text-white/5 uppercase tracking-[0.4em] mb-8 italic leading-none pl-1 transition-all duration-700">
                       <div className="w-10 h-10 bg-black border-2 border-white/5 rounded-xl flex items-center justify-center text-[#ff6b2b]/10 group-hover:text-[#ff6b2b] group-hover:border-[#ff6b2b]/40 transition-all shadow-inner">
                          <Globe size={18} strokeWidth={3} />
                       </div>
                       <Link href={result.url} className="hover:text-[#ff6b2b] transition-colors">{new URL(result.url).hostname}</Link>
                    </div>
                    
                    <h3 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white/40 group-hover:text-white transition-all mb-10 leading-[0.9] pr-12">
                      <Link href={result.url}>"{result.title}"</Link>
                    </h3>
                    
                    <p className="text-2xl text-white/10 leading-relaxed font-light italic group-hover:text-white/40 transition-all duration-700 max-w-5xl tracking-tight">
                      {result.snippet}
                    </p>
                    
                    <div className="mt-12 flex items-center gap-10">
                       <span className="text-[11px] uppercase font-black tracking-[0.6em] px-10 py-4 bg-[#050505] border-2 border-white/5 rounded-full text-white/5 italic group-hover:border-[#ff6b2b]/40 group-hover:text-[#ff6b2b] group-hover:bg-[#ff6b2b]/5 transition-all leading-none shadow-inner">
                          Resonance_Sync: <span className="text-[#ff6b2b] font-black">{(result.relevance * 100).toFixed(1)}%</span>
                       </span>
                       <Link href={result.url} className="text-white/10 group-hover:text-[#ff6b2b] transition-all hover:scale-125 hover:rotate-45">
                          <ArrowUpRight size={32} strokeWidth={3} />
                       </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* DECOR */}
      {!results.length && (
         <div className="fixed bottom-0 right-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
            <div className="text-[30vw] font-black italic leading-none uppercase">INDEX</div>
         </div>
      )}

      {/* ── FOOTER SIGNAL ── */}
      {results.length > 0 && (
         <section className="pt-40 text-center space-y-16 relative z-50">
            <div className="w-full flex justify-center gap-4">
               <div className="w-4 h-4 rounded-full bg-[#ff6b2b] shadow-[0_0_20px_#ff6b2b]" />
               <div className="w-4 h-4 rounded-full bg-white/10" />
               <div className="w-4 h-4 rounded-full bg-white/10" />
            </div>
            <Link href="/" className="inline-flex items-center gap-8 text-[12px] font-black uppercase tracking-[1rem] text-white/10 hover:text-[#ff6b2b] transition-all italic group active:scale-95 leading-none pl-4 pr-4">
                <ChevronLeft size={24} className="group-hover:-translate-x-4 transition-transform" strokeWidth={3} /> Return to Core Shard
            </Link>
         </section>
      )}

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
