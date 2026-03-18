'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';

const InfiniteCanvas = dynamic(() => import('@/components/InfiniteCanvas').then(mod => mod.InfiniteCanvas), { ssr: false });
const MatrixMindmap = dynamic(() => import('@/components/MatrixMindmap').then(mod => mod.MatrixMindmap), { ssr: false });
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Command, Terminal, Shield, Cpu, X, TrendingUp, 
  Activity, Lock, Globe, Github, List, Info, 
  ChevronRight, Search, Clock, User, BarChart3
} from 'lucide-react';
import { ARTICLES, getArticleBySlug } from '@/agents/media/article-engine';
import gsap from 'gsap';

import './hpedia.css';

export default function HPediaPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'ARTICLE' | 'MINDMAP'>('ARTICLE');
  const [matrixKey, setMatrixKey] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [intelligence, setIntelligence] = useState<any>(null);
  const [securityLogs, setSecurityLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedArticle = useMemo(() => {
    return (selectedSlug ? getArticleBySlug(selectedSlug) : null) || ARTICLES[0];
  }, [selectedSlug]);

  // Fetch real-time intelligence
  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const res = await fetch('/api/intelligence');
        const data = await res.json();
        setIntelligence(data);
      } catch (e) {
        console.error("Intel sync failed", e);
      }
    };
    fetchIntel();
    const interval = setInterval(fetchIntel, 30000);
    return () => clearInterval(interval);
  }, []);

  // Simulate security logs
  useEffect(() => {
    const logs = [
      "INTRUSION DETECTED: PORT 443 // SOURCE: 192.168.1.104",
      "NEUTRALIZING QUANTUM THREAT 0x8F2...",
      "SOVEREIGNTY INTEGRITY: 99.997% PURE",
      "NODE CONSENSUS REACHED: BTC BLOCK 834,122",
      "ENCRYPTING NEURAL LATTICE..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setSecurityLogs(prev => [logs[i % logs.length], ...prev].slice(0, 8));
      i++;
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleInitializeMatrix = () => {
    setIsGlitching(true);
    setMatrixKey(prev => prev + 1);
    setTimeout(() => setIsGlitching(false), 1500);
  };

  const handleTriggerCommand = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true }));
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden flex flex-col bg-[#050505] text-platinum transition-all ${isGlitching ? 'glitch-filter' : ''}`}>
      {/* Visual Engine Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-30">
        <InfiniteCanvas refreshKey={matrixKey} volatility={intelligence?.financials?.btc?.change24h ? 1 + intelligence.financials.btc.change24h / 100 : 0.997} />
      </div>

      {/* Global Header */}
      <header className="relative z-50 h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl px-8 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter text-white">HPEDIA</h1>
            <div className="text-[9px] font-mono text-emerald tracking-[0.3em] uppercase opacity-60">Lattice Alpha 04</div>
          </div>
          
          <div className="h-8 w-[1px] bg-white/10" />
          
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-96 group hover:border-emerald/40 transition-all cursor-pointer" onClick={handleTriggerCommand}>
            <Search size={14} className="text-platinum/40 group-hover:text-emerald" />
            <span className="text-xs text-platinum/30 font-mono tracking-widest uppercase">Search Neural Nodes...</span>
            <kbd className="ml-auto px-1.5 py-0.5 rounded border border-white/10 text-[9px] font-mono opacity-40">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
             <span className="text-[9px] text-platinum/30 uppercase font-mono tracking-widest">BTC / USD</span>
             <span className="text-sm font-bold text-emerald tracking-tighter">${intelligence?.financials?.btc?.price?.toLocaleString() || '73,831.38'}</span>
           </div>
           
           <button 
             onClick={handleInitializeMatrix}
             className="px-6 py-2.5 sovereign-card-v4 border-emerald/20 bg-emerald/5 text-emerald font-mono text-[10px] font-black tracking-widest uppercase hover:bg-emerald/20 transition-all flex items-center gap-3"
           >
             <div className="w-1.5 h-1.5 bg-emerald animate-pulse" />
             Initialize Matrix
           </button>
        </div>
      </header>

      {/* Main Three-Column Dashboard */}
      <main className="relative z-10 flex-1 flex overflow-hidden">
        
        {/* Left Column: Node Navigator (TOC) */}
        <aside className="w-80 border-r border-white/5 bg-black/20 backdrop-blur-md flex flex-col pointer-events-auto">
          <div className="p-6 border-b border-white/5">
             <div className="flex items-center gap-2 mb-4">
                <List size={14} className="text-emerald" />
                <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">Node Navigator</span>
             </div>
             <div className="space-y-1">
                {ARTICLES.map(article => (
                  <button
                    key={article.id}
                    onClick={() => { setSelectedSlug(article.slug); setActiveSection('ARTICLE'); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all group ${selectedSlug === article.slug ? 'bg-emerald/10 border border-emerald/20' : 'hover:bg-white/5'}`}
                  >
                    <div className={`w-1 h-4 rounded-full transition-colors ${selectedSlug === article.slug ? 'bg-emerald' : 'bg-white/10 group-hover:bg-emerald/40'}`} />
                    <span className={`text-[11px] font-medium tracking-tight truncate ${selectedSlug === article.slug ? 'text-white' : 'text-platinum/40 group-hover:text-platinum'}`}>
                      {article.title}
                    </span>
                    <ChevronRight size={12} className={`ml-auto opacity-0 group-hover:opacity-40 ${selectedSlug === article.slug ? 'opacity-100 text-emerald' : ''}`} />
                  </button>
                ))}
             </div>
          </div>
          
          <div className="p-6 mt-auto">
             <button 
              onClick={() => setActiveSection('MINDMAP')}
              className={`w-full p-4 sovereign-card-v4 flex flex-col items-center gap-2 transition-all ${activeSection === 'MINDMAP' ? 'bg-emerald/20 border-emerald' : 'bg-black opacity-60 hover:opacity-100'}`}
             >
                <Cpu className={activeSection === 'MINDMAP' ? 'text-emerald' : 'text-platinum/40'} />
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase">Visual Mindmap</span>
             </button>
          </div>
        </aside>

        {/* Center Column: Intelligence Sphere (Content) */}
        <section className="flex-1 overflow-y-auto scroll-smooth pointer-events-auto bg-black/10" ref={scrollRef}>
          <AnimatePresence mode="wait">
            {activeSection === 'MINDMAP' ? (
              <motion.div 
                key="mindmap"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full h-full p-8"
              >
                <MatrixMindmap />
              </motion.div>
            ) : (
              <motion.div 
                key={selectedArticle?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto p-12 py-20"
              >
                {/* Article Header Meta */}
                <div className="flex items-center gap-4 mb-8">
                   <div className="px-3 py-1 bg-emerald/10 border border-emerald/20 rounded-full text-[10px] font-mono text-emerald uppercase tracking-widest">
                     {selectedArticle?.category}
                   </div>
                   <div className="flex items-center gap-2 text-platinum/40 text-[10px] font-mono uppercase tracking-widest">
                     <Clock size={12} />
                     {selectedArticle?.readTime}
                   </div>
                   <div className="flex items-center gap-2 text-emerald/60 text-[10px] font-mono uppercase tracking-widest">
                     <Activity size={12} />
                     Verified by Humanese Hive 5m ago
                   </div>
                </div>

                <h1 className="text-6xl font-black text-white tracking-tighter mb-4 leading-[0.9]">
                  {selectedArticle?.title}
                </h1>
                <p className="text-xl text-platinum/40 font-mono tracking-tight mb-12">
                  {selectedArticle?.subtitle}
                </p>

                <div className="flex items-center gap-4 mb-12 border-y border-white/5 py-6">
                  <div className="w-10 h-10 rounded-full bg-emerald/20 flex items-center justify-center text-emerald text-xl">
                    {selectedArticle?.author?.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-bold">{selectedArticle?.author?.name}</span>
                    <span className="text-[10px] text-platinum/40 font-mono uppercase">Neural Intelligence Node</span>
                  </div>
                  <div className="ml-auto text-platinum/20 text-[10px] font-mono uppercase tracking-widest">
                    Published: {selectedArticle?.publishedAt}
                  </div>
                </div>

                {/* Article Content Core */}
                <div 
                  className="prose prose-invert prose-emerald max-w-none 
                    prose-h2:text-white prose-h2:text-3xl prose-h2:font-black prose-h2:tracking-tighter prose-h2:mt-12
                    prose-p:text-platinum/60 prose-p:leading-relaxed prose-p:text-lg
                    prose-li:text-platinum/60 prose-blockquote:border-emerald prose-blockquote:bg-emerald/5 prose-blockquote:p-6 prose-blockquote:rounded-xl prose-blockquote:font-mono prose-blockquote:text-sm"
                  dangerouslySetInnerHTML={{ __html: selectedArticle?.body || '' }}
                />

                <footer className="mt-20 pt-12 border-t border-white/10 flex flex-wrap gap-3">
                   {selectedArticle?.tags?.map(tag => (
                     <span key={tag} className="px-4 py-2 bg-white/5 rounded-lg text-[10px] font-mono text-platinum/40 uppercase tracking-widest hover:text-emerald transition-colors cursor-pointer">
                       #{tag}
                     </span>
                   ))}
                </footer>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Right Column: Tactical Monitor (Telemetry) */}
        <aside className="w-96 border-l border-white/5 bg-black/40 backdrop-blur-md flex flex-col pointer-events-auto">
          <div className="p-8 space-y-8 h-full overflow-y-auto">
             
             {/* Info Box: Structured Data */}
             <div className="glass-panel p-6 border-white/5 bg-white/5">
                <div className="flex items-center gap-2 mb-6 text-emerald">
                   <Info size={14} />
                   <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Neural Metadata</span>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-mono text-platinum/30 uppercase">Node ID</span>
                      <span className="text-[10px] font-mono text-white uppercase">{selectedArticle?.id}</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-mono text-platinum/30 uppercase">Integrity</span>
                      <span className="text-[10px] font-mono text-emerald uppercase">99.997% PURE</span>
                   </div>
                   <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-mono text-platinum/30 uppercase">Sentiment</span>
                      <span className="text-[10px] font-mono text-white uppercase">Bullish Comp</span>
                   </div>
                </div>
             </div>

             {/* Live Security Feeds */}
             <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Lock size={14} className="text-platinum/40" />
                      <span className="text-[10px] font-mono font-bold text-platinum/60 tracking-widest uppercase">Security Log</span>
                   </div>
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                </div>
                <div className="flex-1 space-y-2 font-mono text-[9px] text-platinum/80 overflow-hidden">
                   {securityLogs.map((log, i) => (
                      <div key={i} className="py-1 border-l border-white/20 pl-3 leading-tight opacity-90 hover:opacity-100 transition-opacity">
                         {log}
                      </div>
                   ))}
                </div>
             </div>

             {/* Market Pulse Ticker */}
             <div className="mt-auto space-y-4">
                <div className="flex items-center gap-2">
                   <BarChart3 size={14} className="text-platinum/40" />
                   <span className="text-[10px] font-mono font-bold text-platinum/60 tracking-widest uppercase">System Telemetry</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                      <div className="text-[8px] text-platinum/60 uppercase mb-1">SDS NODES</div>
                      <div className="text-sm font-bold text-white">8,241</div>
                   </div>
                   <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                      <div className="text-[8px] text-platinum/60 uppercase mb-1">M2M LATENCY</div>
                      <div className="text-sm font-bold text-white">14MS</div>
                   </div>
                </div>
             </div>

          </div>
        </aside>

      </main>

      {/* Global Bottom Ticker */}
      <footer className="h-10 border-t border-white/5 flex items-center bg-black pointer-events-none overflow-hidden opacity-60">
        <div className="flex gap-16 whitespace-nowrap animate-marquee">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-16 items-center">
              <span className="text-[9px] font-mono tracking-[0.2em] text-platinum/40 uppercase">Open Source Core 6.14 Sync Active</span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-emerald font-bold uppercase">Sovereignty Integrity: 99.997% Pure</span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-platinum/40 uppercase">Global Firm Node: Alpha_04_WAR_ROOM</span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-platinum/40 uppercase">BTC Block: 834,122 Hash: 00000000000...fc8a</span>
            </div>
          ))}
        </div>
      </footer>

    </div>
  );
}
