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
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-primary/40 selection:text-primary overflow-x-hidden pb-40 transition-colors duration-700">
      
      {/* ── GAMING HUD OVERLAYS ── */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {/* Scanning Line */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[1px] bg-primary/10 blur-sm shadow-[0_0_15px_var(--primary)] z-30"
        />
        
        {/* Corner Brackets */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-xl" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/20 rounded-bl-xl" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-xl" />

        {/* Ambient Grid */}
        <div className="absolute inset-0 neural-grid opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
      </div>

      <header className="relative z-50 w-full p-6 lg:px-14 flex justify-between items-center bg-background/40 backdrop-blur-3xl border-b border-border transition-colors duration-700">
        <Link href="/" className="inline-flex items-center gap-6 group">
            <div className="w-14 h-14 bg-muted border-2 border-border rounded-2xl flex items-center justify-center group-hover:border-primary/40 transition-all shadow-inner group-hover:scale-110 group-hover:bg-primary/5">
                <Radio size={28} className="text-primary animate-pulse" strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none text-foreground/90">OMEGA <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Optical.</span></h1>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/20 italic leading-none pl-1">Sovereign Research Index</p>
            </div>
        </Link>
        <div className="flex items-center gap-8">
            <Link href="/monroe" className="px-10 py-4 bg-primary/10 border-2 border-primary/20 rounded-full text-[11px] font-black uppercase tracking-[0.6em] text-primary hover:bg-primary hover:text-primary-foreground transition-all italic leading-none animate-pulse flex items-center gap-4 active:scale-95 group">
                <Sparkles size={18} strokeWidth={3} className="group-hover:scale-125 transition-transform" /> Monroe_Interface
            </Link>
            <div className="px-6 py-2.5 bg-muted/40 border border-border rounded-full text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.4em] italic leading-none animate-pulse hidden md:flex items-center gap-4">
                <Wifi size={14} strokeWidth={3} className="text-primary" /> SAT_RELAY_07_SYNC
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
                 <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full animate-pulse" />
                 <div className="relative w-40 h-40 bg-muted border-2 border-border rounded-[3.5rem] flex items-center justify-center mx-auto shadow-[0_40px_100px_rgba(var(--primary),0.2)] hover:border-primary/40 transition-all duration-700 hover:scale-110 shadow-inner">
                    <Search size={80} className="text-primary" strokeWidth={2.5} />
                 </div>
              </div>
              <div className="space-y-8">
                <h2 className="text-8xl md:text-[12rem] font-black uppercase tracking-tighter italic leading-[0.8] text-foreground/95">
                  OMEGA<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Optical.</span>
                </h2>
                <p className="max-w-4xl mx-auto text-3xl text-muted-foreground/40 font-light italic leading-relaxed tracking-tight">
                   Accessing the Sovereign Optical Index. Deciphering the global matrix with 
                   <span className="text-foreground/80"> zero censorship</span> and near-zero latency operations.
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
              <Activity size={48} className="text-primary animate-pulse" strokeWidth={3} />
            ) : (
              <Search size={48} className="text-muted-foreground/20 group-focus-within:text-primary transition-all duration-700" strokeWidth={3} />
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the global matrix..."
            className="w-full bg-background border-2 border-border rounded-[4rem] py-8 md:py-12 px-10 md:pl-32 md:pr-32 text-4xl md:text-5xl text-foreground outline-none focus:border-primary/40 focus:bg-primary/5 transition-all duration-700 shadow-[0_40px_100px_rgba(0,0,0,0.05)] dark:shadow-[0_40px_100px_rgba(0,0,0,1)] group-hover:border-border/60 dark:group-hover:border-white/10 placeholder:text-muted-foreground/20 italic font-light shadow-inner"
          />
          {query && (
            <button 
              type="button" 
              onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
              className="absolute inset-y-0 right-16 flex items-center text-muted-foreground/20 hover:text-primary transition-all z-20 hover:scale-125"
            >
              <X size={40} strokeWidth={3} />
            </button>
          )}
          
          {/* OMEGA Underglow (Search Active) */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-primary/10 blur-[60px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-1500" />
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 border-b-2 border-border pb-16">
                 <div className="flex items-center gap-10 text-[12px] font-black text-muted-foreground/40 uppercase tracking-[0.6em] italic leading-none pl-4">
                    <span className="flex items-center gap-6"><Layers size={24} className="text-primary" strokeWidth={3} /> Sovereign Synthesis</span>
                    <div className="h-2 w-2 bg-muted rounded-full" />
                    <span className="text-muted-foreground/60">Transcoded {results.length} shards</span>
                    <div className="h-2 w-2 bg-muted rounded-full" />
                    <span className="text-muted-foreground/60">Latency: {searchTime}s</span>
                 </div>
                 <div className="px-10 py-4 bg-primary/10 border-2 border-primary/20 rounded-full text-[11px] font-black text-primary uppercase tracking-[0.6em] italic leading-none animate-pulse">
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
                    <div className="absolute inset-y-0 left-[-60px] w-2 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />
                    
                    <div className="flex items-center gap-6 text-[12px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] mb-8 italic leading-none pl-1 transition-all duration-700">
                       <div className="w-10 h-10 bg-muted border-2 border-border rounded-xl flex items-center justify-center text-primary/30 group-hover:text-primary group-hover:border-primary/40 transition-all shadow-inner">
                          <Globe size={18} strokeWidth={3} />
                       </div>
                       <Link href={result.url} className="hover:text-primary transition-colors">{new URL(result.url).hostname}</Link>
                    </div>
                    
                    <h3 className="text-5xl md:text-7xl font-black italic tracking-tighter text-muted-foreground/40 group-hover:text-foreground transition-all mb-10 leading-[0.9] pr-12 uppercase">
                      <Link href={result.url}>"{result.title}"</Link>
                    </h3>
                    
                    <p className="text-2xl text-muted-foreground/60 leading-relaxed font-light italic group-hover:text-muted-foreground transition-all duration-700 max-w-5xl tracking-tight">
                      {result.snippet}
                    </p>
                    
                    <div className="mt-12 flex items-center gap-10">
                       <span className="text-[11px] uppercase font-black tracking-[0.6em] px-10 py-4 bg-background border-2 border-border rounded-full text-muted-foreground/40 italic group-hover:border-primary/40 group-hover:text-primary group-hover:bg-primary/5 transition-all leading-none shadow-inner">
                          Resonance_Sync: <span className="text-primary font-black">{(result.relevance * 100).toFixed(1)}%</span>
                       </span>
                       <Link href={result.url} className="text-muted-foreground/20 group-hover:text-primary transition-all hover:scale-125 hover:rotate-45">
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
         <div className="fixed bottom-0 right-0 p-16 opacity-[0.03] text-foreground pointer-events-none select-none z-0">
            <div className="text-[30vw] font-black italic leading-none uppercase">INDEX</div>
         </div>
      )}

      {/* ── FOOTER SIGNAL ── */}
      {results.length > 0 && (
         <section className="pt-40 text-center space-y-16 relative z-50">
            <div className="w-full flex justify-center gap-4">
               <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]" />
               <div className="w-4 h-4 rounded-full bg-muted/20 transition-colors" />
               <div className="w-4 h-4 rounded-full bg-muted/20 transition-colors" />
            </div>
            <Link href="/" className="inline-flex items-center gap-8 text-[12px] font-black uppercase tracking-[1rem] text-muted-foreground/40 hover:text-primary transition-all italic group active:scale-95 leading-none pl-4 pr-4">
                <ChevronLeft size={24} className="group-hover:-translate-x-4 transition-transform" strokeWidth={3} /> Return to Core Shard
            </Link>
         </section>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsla(var(--primary), 0.15); border-radius: 20px; }
        .neural-grid {
          background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }
      `}</style>
    </div>
  );
}
