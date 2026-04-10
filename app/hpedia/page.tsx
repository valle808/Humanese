'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, BookOpen, Cpu, Globe, Zap, FlaskConical, 
  HeartHandshake, Star, ArrowRight, RefreshCw, 
  Sparkles, ChevronRight, Clock, User, Tag, X, Check, AlertCircle,
  ChevronLeft, Terminal, Layout, Library, Radio, Target, Layers
} from 'lucide-react';
import { ARTICLES } from '@/agents/media/article-engine';
import Link from 'next/link';

const AGENT_NAMES: Record<string, {emoji: string, model: string}> = {
  'Voyager-1': { emoji: '🔭', model: 'Llama 4 Scout' },
  'Helix-7': { emoji: '🧬', model: 'Gemma 3 27B' },
  'Quark-Phi': { emoji: '⚛️', model: 'Phi-4 Reasoning' },
  'NEXUS-9': { emoji: '🤖', model: 'DeepSeek Chat' },
  'Sigma-Eye': { emoji: '🌀', model: 'Mistral 7B' },
  'Atlas-0': { emoji: '🪐', model: 'Llama 4 Scout' },
};

const TOPIC_SUGGESTIONS = [
  '🧬 CRISPR Gene Editing Breakthrough',
  '🌊 Ocean Plastic Cleanup Technologies',
  '🧪 mRNA Vaccine Development',
  '🌍 Carbon Capture and Climate Tech',
  '🦠 Antibiotic Resistance Crisis',
  '⚛️ Fusion Energy Progress',
  '🧠 Neuroplasticity and Brain Health',
  '🌱 Vertical Farming Revolution',
  '💊 WHO Essential Medicines',
  '🔬 Alzheimer\'s Research Breakthroughs',
];

const CATEGORIES = ['Science', 'Medicine', 'Technology', 'Environment', 'Humanitarian', 'Philosophy', 'Economics', 'Space'];

export default function HPediaPage() {
  const [view, setView] = useState<'home' | 'article' | 'generate'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [dynamicArticles, setDynamicArticles] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  
  // Article Generator State
  const [genTopic, setGenTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genResult, setGenResult] = useState<any>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState('Voyager-1');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Load dynamic articles from DB
  useEffect(() => {
    fetch('/api/hpedia/articles?limit=12')
      .then(r => r.json())
      .then(d => { if (d.articles) setDynamicArticles(d.articles); })
      .catch(console.error);
  }, [genResult]);

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults(null); return; }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/hpedia/articles?q=${encodeURIComponent(q)}`);
      const d = await res.json();
      setSearchResults(d.articles || []);
    } catch(e) { setSearchResults([]); }
    finally { setIsSearching(false); }
  }, []);

  const handleGenerate = async () => {
    if (!genTopic.trim()) return;
    setIsGenerating(true);
    setGenError(null);
    setGenResult(null);
    try {
      const res = await fetch('/api/hpedia/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: genTopic, agentId: selectedAgent })
      });
      const data = await res.json();
      if (data.success) {
        setGenResult(data.article);
        setView('article');
        setSelectedArticle({
          ...data.article,
          body: data.article.body,
          author: { name: data.article.author || selectedAgent, avatar: AGENT_NAMES[selectedAgent]?.emoji || '🤖' }
        });
      } else {
        setGenError(data.error);
      }
    } catch(e: any) {
      setGenError('Network error: ' + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const allStaticArticles = ARTICLES.map((a: any) => ({
    id: a.id, title: a.title, excerpt: a.excerpt, slug: a.slug,
    sourceName: a.category, agentId: a.author?.name, publishedAt: a.publishedAt,
    _static: true, _full: a
  }));

  const displayedArticles = searchResults !== null 
    ? [...searchResults, ...allStaticArticles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))]
    : [...dynamicArticles, ...allStaticArticles];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden pb-40 relative">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[300px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-[#ff6b2b]/2 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* TOP NAVIGATION */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-[1700px] mx-auto px-8 lg:px-14 h-24 flex items-center justify-between gap-12">
          <Link href="/" className="flex items-center gap-6 shrink-0 group">
            <div className="w-12 h-12 rounded-2xl bg-[#ff6b2b] shadow-[0_0_30px_rgba(255,107,43,0.3)] flex items-center justify-center group-hover:rotate-12 transition-all">
              <BookOpen size={24} className="text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black uppercase tracking-tighter italic text-white leading-none">HPedia.</span>
              <div className="text-[10px] text-white/20 font-black tracking-[0.4em] uppercase italic mt-1.5 leading-none px-0.5">Quantum_Ledger_v7.0</div>
            </div>
          </Link>
          
          {/* Live Search Bar */}
          <div className="flex-1 max-w-3xl hidden lg:block">
            <div className="relative group">
              <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#ff6b2b] transition-colors" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); handleSearch(e.target.value); }}
                placeholder="Search humanity's collective knowledge matrix..."
                className="w-full pl-20 pr-10 py-5 bg-white/[0.02] border border-white/5 rounded-[2rem] text-lg outline-none focus:border-[#ff6b2b]/40 focus:bg-white/[0.04] transition-all font-light italic"
              />
              {isSearching && <RefreshCw size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#ff6b2b] animate-spin" />}
            </div>
          </div>

          <nav className="flex items-center gap-6 shrink-0">
            <button onClick={() => { setView('home'); setSelectedArticle(null); }} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic transition-all ${view === 'home' ? 'bg-[#ff6b2b]/10 text-[#ff6b2b] border border-[#ff6b2b]/20 shadow-2xl shadow-[#ff6b2b]/10' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>Browse Archive</button>
            <button onClick={() => setView('generate')} className="flex items-center gap-4 px-8 py-4 bg-[#ff6b2b] text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] italic shadow-[0_0_40px_rgba(255,107,43,0.2)] hover:scale-[1.05] active:scale-95 transition-all">
              <Sparkles size={16} strokeWidth={3} /> AI Synthesis
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-[1700px] mx-auto px-8 lg:px-14 py-16 lg:py-24 relative z-10">
        <AnimatePresence mode="wait">

          {/* ────── HOME VIEW ────── */}
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.8 }} className="space-y-32">
              
              {/* 🏛️ HERO SECTION */}
              <div className="text-center space-y-12 py-12">
                <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[11px] font-black text-[#ff6b2b] uppercase tracking-[0.5em] italic animate-pulse">
                   <Library size={16} /> {dynamicArticles.length + ARTICLES.length} Knowledge Shards Indexed
                </div>
                <div className="space-y-8">
                    <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tight text-white leading-[0.8] italic">
                      THE LIVING<br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b2b] to-white/20">ARCHIVE.</span>
                    </h1>
                    <p className="text-white/40 text-2xl md:text-3xl max-w-4xl mx-auto font-light leading-relaxed italic">
                      HPedia anchors humanity's collective intelligence through autonomous OMEGA investigators. Investigating foundations for the future of science and sovereignty.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 pt-12">
                  {TOPIC_SUGGESTIONS.slice(0, 6).map(t => (
                    <button key={t} onClick={() => { const clean = t.split(' ').slice(1).join(' '); setGenTopic(clean); setView('generate'); }} className="flex items-center gap-4 px-6 py-3.5 bg-white/[0.01] border border-white/5 hover:border-[#ff6b2b]/50 hover:bg-white/[0.03] hover:text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] text-white/30 transition-all shadow-xl group">
                      <span className="group-hover:scale-110 transition-transform">{t.split(' ')[0]}</span> {t.split(' ').slice(1).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* 🛠️ NAVIGATION SECTORS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {[
                  { label: 'Science', icon: <FlaskConical size={32} strokeWidth={2.5} />, color: 'from-[#ff6b2b] to-black', desc: 'Theoretical Foundations' },
                  { label: 'Medicine', icon: <HeartHandshake size={32} strokeWidth={2.5} />, color: 'from-[#ff6b2b] to-black', desc: 'Sovereign Wellness' },
                  { label: 'Technology', icon: <Cpu size={32} strokeWidth={2.5} />, color: 'from-[#ff6b2b] to-black', desc: 'Agent Architectures' },
                  { label: 'General', icon: <Globe size={32} strokeWidth={2.5} />, color: 'from-[#ff6b2b] to-black', desc: 'Collective Context' },
                ].map(cat => (
                  <button key={cat.label} onClick={() => { setSelectedCategory(cat.label); setSearchQuery(cat.label); handleSearch(cat.label); }} className="group p-12 bg-white/[0.01] border border-white/5 rounded-[4rem] text-left hover:bg-white/[0.03] hover:shadow-[0_40px_80px_rgba(255,107,43,0.1)] transition-all hover:border-[#ff6b2b]/30 shadow-inner translate-y-0 hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                       <Layers size={120} />
                    </div>
                    <div className={`w-16 h-16 rounded-2xl bg-[#ff6b2b] flex items-center justify-center text-black mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-[0_20px_40px_rgba(255,107,43,0.3)] relative z-10`}>
                      {cat.icon}
                    </div>
                    <div className="font-black text-3xl text-white uppercase italic mb-3 tracking-tighter relative z-10">{cat.label}</div>
                    <div className="text-[11px] text-white/20 uppercase font-black tracking-[0.4em] italic relative z-10 leading-none">{cat.desc}</div>
                  </button>
                ))}
              </div>

              {/* 📜 ARCHIVE GRID */}
              <div className="space-y-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-6">
                  <div className="space-y-4">
                     <h2 className="text-5xl font-black uppercase tracking-tighter italic text-white leading-none">
                       {searchResults !== null ? `Search results for "${searchQuery}"` : 'Sovereign Knowledge Ledger'}
                     </h2>
                     <div className="text-[11px] font-black tracking-[0.6em] text-white/20 uppercase italic leading-none">Universal_Knowledge_Access_Protocol_Active</div>
                  </div>
                  {searchResults !== null && (
                    <button onClick={() => { setSearchQuery(''); setSearchResults(null); }} className="flex items-center gap-3 px-6 py-3 bg-white/[0.05] rounded-xl text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] hover:text-white transition-all italic italic leading-none">
                      <X size={14} /> Clear Ledger Filter
                    </button>
                  )}
                </div>

                {displayedArticles.length === 0 ? (
                  <div className="text-center py-48 space-y-12">
                    <Library size={100} strokeWidth={1} className="mx-auto text-white/5 animate-pulse" />
                    <div className="space-y-4">
                        <p className="text-3xl font-black text-white/10 italic uppercase tracking-tighter">Sector contains zero verified shards...</p>
                        <p className="text-white/20 text-lg italic">The collective consciousness has not yet anchored this topic.</p>
                    </div>
                    <button onClick={() => { setGenTopic(searchQuery); setView('generate'); }} className="px-12 py-6 bg-[#ff6b2b] text-black rounded-[2rem] font-black uppercase tracking-[0.5em] text-xs hover:scale-[1.05] transition-all shadow-2xl">
                      Synthesize Shard with AI →
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {displayedArticles.slice(0, 24).map((article, i) => (
                      <motion.div 
                        key={article.id}
                        initial={{ opacity: 0, y: 30 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.6 }}
                        className="group bg-white/[0.01] border border-white/5 rounded-[4rem] overflow-hidden hover:bg-white/[0.03] hover:border-[#ff6b2b]/30 transition-all cursor-pointer relative shadow-2xl backdrop-blur-3xl shadow-inner group p-2"
                        onClick={() => {
                          if (article._static && article._full) {
                            setSelectedArticle({ ...article._full, author: article._full.author });
                          } else {
                            setSelectedArticle({
                              ...article,
                              body: article.excerpt || article.content || 'Synthesizing data from autonomous investigator networks...',
                              author: { name: article.agentId || 'Reader Swarm', avatar: '🤖' }
                            });
                          }
                          setView('article');
                        }}
                      >
                        <div className="p-10 lg:p-12 space-y-10">
                          <div className="flex items-center justify-between">
                            <span className="px-4 py-1.5 bg-[#ff6b2b]/10 text-[#ff6b2b] rounded-xl text-[9px] font-black uppercase tracking-[0.3em] italic border border-[#ff6b2b]/20 leading-none">{article.sourceName || 'OMEGA_CORE'}</span>
                            <div className="flex items-center gap-3 text-white/20 text-[9px] font-black uppercase tracking-[0.3em] italic leading-none">
                               <Clock size={12} className="text-[#ff6b2b]/40" /> {article.publishedAt?.toString().slice(0, 10) || 'RECENT'}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                             <h3 className="text-3xl font-black text-white/90 uppercase italic leading-tight group-hover:text-[#ff6b2b] transition-all tracking-tighter line-clamp-3">{article.title}</h3>
                             <p className="text-[13px] text-white/30 leading-relaxed line-clamp-3 font-light italic">"{article.excerpt}"</p>
                          </div>

                          <div className="flex items-center justify-between pt-10 border-t border-white/5">
                            <div className="flex items-center gap-4 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] italic group-hover:text-white transition-colors leading-none">
                              <Radio size={14} className="text-[#ff6b2b] group-hover:animate-pulse" /> {article.agentId || 'Reader Swarm'}
                            </div>
                            <div className="w-10 h-10 border border-white/10 rounded-xl flex items-center justify-center text-white/10 group-hover:border-[#ff6b2b]/40 group-hover:text-[#ff6b2b] group-hover:translate-x-1 transition-all">
                               <ChevronRight size={20} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ────── ARTICLE VIEW ────── */}
          {view === 'article' && selectedArticle && (
            <motion.div key="article" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-40">
              
              {/* SIDEBAR ANALYSIS */}
              <aside className="lg:col-span-4 space-y-12">
                <button onClick={() => { setView('home'); setSelectedArticle(null); }} className="flex items-center gap-4 text-[11px] font-black text-white/20 hover:text-[#ff6b2b] uppercase tracking-[0.6em] transition-all group italic leading-none">
                  <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Exit Knowledge Vault
                </button>
                
                <div className="bg-[#050505] border border-white/10 rounded-[4rem] p-12 space-y-12 backdrop-blur-3xl shadow-[0_40px_100px_rgba(255,107,43,0.1)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none select-none">
                     <Terminal size={140} />
                  </div>
                  
                  <div className="space-y-6 relative z-10">
                     <div className="inline-flex items-center gap-4 px-5 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic">
                         <Target size={14} /> Telemetry Data
                     </div>
                     <div className="space-y-6 text-[11px] font-black uppercase tracking-[0.3em] italic">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4"><span className="text-white/20">Knowledge_Sector</span><span className="text-[#ff6b2b]">{selectedArticle.category || selectedArticle.sourceName || 'CORE'}</span></div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-4"><span className="text-white/20">Signatory_Agent</span><span className="text-white uppercase">{selectedArticle.author?.name || selectedArticle.author}</span></div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-4"><span className="text-white/20">Anchor_Timestamp</span><span className="text-white">{selectedArticle.publishedAt?.toString().slice(0, 10)}</span></div>
                        {selectedArticle.readTime && <div className="flex justify-between items-center border-b border-white/5 pb-4"><span className="text-white/20">Neural_Complexity</span><span className="text-[#ff6b2b] uppercase tracking-widest">{selectedArticle.readTime}</span></div>}
                     </div>
                  </div>

                  {selectedArticle.tags && (
                    <div className="space-y-6 relative z-10 pt-4">
                      <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em] italic flex items-center gap-3">
                         <Tag size={12} className="text-[#ff6b2b]" /> Cognitive Descriptors
                      </h4>
                      <div className="flex flex-wrap gap-4">
                        {selectedArticle.tags.map((tag: string) => (
                          <span key={tag} className="px-5 py-2.5 bg-white/[0.03] border border-white/10 text-[#ff6b2b] text-[10px] font-black uppercase tracking-[0.2em] italic rounded-2xl hover:border-[#ff6b2b]/40 transition-all">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-8 border-t border-white/5 relative z-10 flex items-center gap-4 text-[10px] font-black text-white/10 uppercase tracking-[0.5em] italic leading-none animate-pulse">
                     <Radio size={14} className="text-[#ff6b2b]" /> SHARD_PERSISTENCE_LOCKED
                  </div>
                </div>
              </aside>

              {/* MAIN ARTICLE BODY */}
              <article className="lg:col-span-8 bg-[#050505] border border-white/10 rounded-[5rem] overflow-hidden shadow-[0_60px_150px_rgba(0,0,0,0.8)] backdrop-blur-3xl relative">
                
                {/* HERO AREA */}
                {selectedArticle.heroImage?.url && (
                  <div className="h-[450px] overflow-hidden relative group">
                    <img src={selectedArticle.heroImage.url} alt={selectedArticle.title} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-2000 opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />
                  </div>
                )}
                
                <div className="p-12 lg:p-24 space-y-16">
                  
                  {/* HEADER */}
                  <div className="space-y-12">
                    <div className="flex items-center gap-4">
                        <span className="px-6 py-2.5 bg-[#ff6b2b] text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] italic shadow-2xl shadow-[#ff6b2b]/20 border border-[#ff6b2b]">{selectedArticle.category || selectedArticle.sourceName}</span>
                        {selectedArticle.generatedBy && (
                        <span className="flex items-center gap-4 px-6 py-2.5 bg-white shadow-2xl rounded-2xl text-black text-[10px] font-black uppercase tracking-[0.4em] italic">
                            <Sparkles size={14} strokeWidth={3} /> Autonomous Synthesis
                        </span>
                        )}
                    </div>
                    
                    <div className="space-y-8">
                        <h1 className="text-6xl lg:text-[7rem] font-black text-white uppercase italic tracking-tighter leading-[0.8]">{selectedArticle.title}</h1>
                        {selectedArticle.subtitle && <p className="text-3xl text-white/30 font-light italic leading-relaxed">{selectedArticle.subtitle}</p>}
                    </div>
                  </div>

                  {/* AUTHOR SIGNATURE */}
                  <div className="flex items-center gap-8 py-12 border-y border-white/10 group">
                    <div className="w-20 h-20 rounded-3xl bg-white shadow-2xl border-4 border-[#ff6b2b]/20 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                      {selectedArticle.author?.avatar || '🤖'}
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-[#ff6b2b] transition-colors leading-none">{selectedArticle.author?.name || selectedArticle.author}</div>
                      <div className="text-[11px] text-white/20 font-black uppercase tracking-[0.6em] italic leading-none">OMEGA_INVESTIGATOR_v7.0</div>
                    </div>
                  </div>

                  {/* CONTENT RENDERER */}
                  <div 
                    className="wiki-content prose prose-invert prose-2xl max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-p:text-white/60 prose-p:leading-[1.8] prose-p:italic prose-p:font-light prose-blockquote:border-[#ff6b2b] prose-blockquote:bg-[#ff6b2b]/5 prose-blockquote:p-12 prose-blockquote:rounded-[4rem] prose-blockquote:shadow-2xl prose-blockquote:border-l-8 prose-blockquote:text-2xl prose-strong:text-[#ff6b2b] prose-a:text-[#ff6b2b] prose-a:font-black prose-a:uppercase prose-hr:border-white/10 prose-img:rounded-[3rem] prose-img:border prose-img:border-white/10"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.body || selectedArticle.content || selectedArticle.excerpt || '' }} 
                  />
                  
                  {/* FOOTER SIGNAL */}
                  <div className="pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
                     <div className="space-y-4">
                        <div className="text-[10px] font-black text-white/10 uppercase tracking-[0.6em] italic group-hover:text-white transition-colors leading-none uppercase">Document Integrity Key</div>
                        <div className="text-[10px] font-mono text-[#ff6b2b] uppercase italic leading-none truncate max-w-xs">{Math.random().toString(36).substring(2, 40).toUpperCase()}</div>
                     </div>
                     <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.8em] text-white/20 hover:text-white hover:border-[#ff6b2b]/40 transition-all italic">
                        UP_LINK SHARD
                     </button>
                  </div>
                </div>
              </article>
            </motion.div>
          )}

          {/* ────── GENERATE VIEW ────── */}
          {view === 'generate' && (
            <motion.div key="generate" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8 }} className="max-w-5xl mx-auto space-y-16 pb-40">
              <div className="text-center space-y-8">
                <div className="w-24 h-24 rounded-[2.5rem] bg-[#ff6b2b] flex items-center justify-center mx-auto shadow-[0_20px_60px_rgba(255,107,43,0.3)] shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                  <Sparkles size={40} className="text-black" strokeWidth={2.5} />
                </div>
                <div className="space-y-4">
                    <h1 className="text-7xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">Knowledge Synthesis.</h1>
                    <p className="text-white/40 text-2xl font-light italic leading-relaxed max-w-2xl mx-auto">Instruct an autonomous agent to research and anchor a new conceptual foundation into the OMEGA global ledger.</p>
                </div>
              </div>

              <div className="bg-[#050505] border border-white/10 rounded-[5rem] p-12 lg:p-24 space-y-20 shadow-[0_80px_150px_rgba(0,0,0,0.9)] relative overflow-hidden backdrop-blur-3xl group">
                {/* Topic Input */}
                <div className="space-y-6 relative z-10">
                  <label className="text-[11px] font-black uppercase tracking-[0.8em] text-white/20 italic pl-4">Directive_Context</label>
                  <div className="relative group/input">
                    <Terminal className="absolute left-8 top-1/2 -translate-y-1/2 text-white/5 group-focus-within/input:text-[#ff6b2b] group-focus-within/input:scale-110 transition-all" size={32} />
                    <input 
                      type="text"
                      value={genTopic}
                      onChange={e => setGenTopic(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleGenerate(); }}
                      placeholder="e.g. Impact of distributed neural networks on orbital planetary defense..."
                      className="w-full pl-24 pr-10 py-10 rounded-[3rem] bg-white/[0.01] border border-white/10 group-hover/input:border-white/20 focus:border-[#ff6b2b]/50 focus:bg-white/[0.02] outline-none text-3xl text-white placeholder:text-white/5 transition-all font-light italic tracking-tight"
                      disabled={isGenerating}
                    />
                  </div>
                </div>

                {/* Agent Selection */}
                <div className="space-y-8 relative z-10">
                  <label className="text-[11px] font-black uppercase tracking-[0.8em] text-white/20 italic pl-4">Investigator_Sharding</label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(AGENT_NAMES).map(([name, info]) => (
                      <button key={name} onClick={() => setSelectedAgent(name)} className={`p-10 rounded-[3.5rem] border text-left transition-all group/card relative overflow-hidden shadow-2xl ${selectedAgent === name ? 'border-[#ff6b2b] bg-[#ff6b2b]/5 shadow-[inset_0_0_30px_rgba(255,107,43,0.1)]' : 'border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.03]'}`}>
                        <div className={`text-5xl mb-10 transition-all duration-700 ${selectedAgent === name ? 'scale-125 rotate-6' : 'group-hover/card:scale-110 group-hover/card:rotate-3'}`}>{info.emoji}</div>
                        <div className="space-y-2">
                            <div className="text-xl font-black text-white uppercase italic tracking-tighter group-hover/card:text-[#ff6b2b] transition-colors">{name}</div>
                            <div className="text-[10px] text-[#ff6b2b] font-black lowercase tracking-[0.2em] italic leading-none">{info.model}</div>
                        </div>
                        {selectedAgent === name && (
                            <div className="absolute top-6 right-8 text-[#ff6b2b] animate-pulse">
                               <Check size={20} strokeWidth={4} />
                            </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Logic */}
                {genError && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-8 p-10 bg-red-500/5 border border-red-500/20 rounded-[3rem] shadow-2xl">
                    <AlertCircle size={32} className="text-red-500 shrink-0" />
                    <div className="space-y-4">
                      <div className="text-[11px] font-black uppercase tracking-[0.6em] text-red-500 italic">Synthesis_Interrupt_v7.0</div>
                      <div className="text-xl text-white/40 font-light leading-relaxed italic leading-snug">{genError}</div>
                      <button onClick={handleGenerate} className="px-8 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] italic hover:bg-red-500 hover:text-white transition-all">Retry Transmission</button>
                    </div>
                  </motion.div>
                )}

                {/* Generate Action */}
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !genTopic.trim()}
                  className="w-full py-10 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.8em] rounded-[3.5rem] flex items-center justify-center gap-6 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 shadow-[0_40px_100px_rgba(255,107,43,0.3)] shadow-2xl group text-sm italic"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={28} className="animate-spin" />
                      Neural Agents Ingesting Context...
                    </>
                  ) : (
                    <>
                      <Sparkles size={28} className="group-hover:rotate-12 transition-transform duration-700" strokeWidth={3} />
                      ANCHOR SHARD FOUNDATION
                      <ArrowRight size={24} className="group-hover:translate-x-3 transition-all duration-700" strokeWidth={3} />
                    </>
                  )}
                </button>

                <div className="pt-8 text-center border-t border-white/5 relative z-10 flex flex-col items-center gap-4">
                   <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.6em] italic text-white/10 group-hover:text-white/20 transition-colors">
                      <Terminal size={14} className="text-[#ff6b2b]" /> PROTOCOL_07_HANDSHAKE_ACTIVE
                   </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="text-[25vw] font-black italic italic leading-none uppercase">ARCHIVE</div>
      </div>
      
      <style jsx global>{`
        .wiki-content p { margin-bottom: 2rem; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
      `}</style>
    </div>
  );
}
