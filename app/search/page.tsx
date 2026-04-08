'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, ChevronRight, Sparkles, X, Activity, Layers, ArrowUpRight } from 'lucide-react';
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
      console.error('Humanlook Search Error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white relative overflow-hidden">
      
      {/* 🌌 AMBIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-cyan-500/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/5 blur-[200px] rounded-full" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 w-full p-6 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-black border border-white/10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.15)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all">
            <Globe size={20} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="font-black tracking-tighter text-xl uppercase italic leading-none">Human<span className="text-cyan-400">look</span></h1>
            <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/40">Sovereign Index</p>
          </div>
        </Link>
        <div className="flex gap-4">
           <Link href="/monroe" className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
             <Sparkles size={14} className="text-cyan-400" /> Ask Nexus
           </Link>
        </div>
      </header>

      {/* SEARCH INTERFACE */}
      <main className={`relative z-10 w-full max-w-4xl mx-auto flex-1 flex flex-col transition-all duration-700 ease-out ${results.length > 0 ? 'pt-8 px-6' : 'justify-center items-center px-6 -mt-32'}`}>
        
        {/* LOGO (Only show on empty state) */}
        <AnimatePresence>
          {results.length === 0 && !isSearching && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-12 text-center"
            >
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic">
                Human<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">look.</span>
              </h2>
              <p className="mt-4 text-sm text-white/30 font-mono tracking-widest uppercase italic">The Sovereign Optical Index · Uncensored & Instant</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INPUT FORM */}
        <motion.form 
          layout
          onSubmit={handleSearch} 
          className="w-full relative group"
        >
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            {isSearching ? (
              <Activity size={24} className="text-cyan-400 animate-pulse" />
            ) : (
              <Search size={24} className="text-white/30 group-focus-within:text-cyan-400 transition-colors" />
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the global matrix..."
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-full py-5 pl-16 pr-20 text-lg md:text-xl text-white outline-none focus:border-cyan-400/50 focus:bg-white/[0.02] transition-all shadow-2xl placeholder:text-white/20 font-light"
          />
          {query && (
            <button 
              type="button" 
              onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
              className="absolute inset-y-0 right-6 flex items-center text-white/30 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
          
          {/* Neon Underglow */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-cyan-400/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
        </motion.form>

        {/* RESULTS AREA */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-12 space-y-8 pb-32"
            >
              {/* Telemetry Stats */}
              <div className="flex items-center gap-4 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] border-b border-white/5 pb-4">
                 <span>Loaded {results.length} results</span>
                 <span className="w-1 h-1 rounded-full bg-white/20" />
                 <span>Matrix Latency: {searchTime}s</span>
                 <span className="w-1 h-1 rounded-full bg-white/20" />
                 <span className="flex items-center gap-1 text-cyan-400/60"><Layers size={10} /> Sovereign Synthesis</span>
              </div>

              {/* Result List */}
              <div className="space-y-10">
                {results.map((result, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx} 
                    className="group"
                  >
                    <div className="flex items-center gap-2 text-xs font-mono text-white/40 mb-2">
                       <Globe size={12} className="text-cyan-400/50" />
                       <Link href={result.url} className="hover:underline">{new URL(result.url).hostname}</Link>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2 tracking-tight">
                      <Link href={result.url}>{result.title}</Link>
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed font-light">
                      {result.snippet}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                       <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-white/5 rounded text-white/30">Index Resonance: {(result.relevance * 100).toFixed(1)}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
