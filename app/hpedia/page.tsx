'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, BookOpen, Cpu, Globe, Zap, FlaskConical, 
  HeartHandshake, Star, ArrowRight, RefreshCw, 
  Sparkles, ChevronRight, Clock, User, Tag, X, Check, AlertCircle
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
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* TOP NAVIGATION */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">HPedia</span>
              <div className="text-[9px] text-slate-400 font-medium tracking-widest uppercase leading-none">Humanese Knowledge Base</div>
            </div>
          </div>
          
          {/* Live Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); handleSearch(e.target.value); }}
                placeholder="Search humanity's knowledge..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all border border-slate-200"
              />
              {isSearching && <RefreshCw size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />}
            </div>
          </div>

          <nav className="flex items-center gap-2 shrink-0">
            <button onClick={() => { setView('home'); setSelectedArticle(null); }} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'home' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}>Browse</button>
            <button onClick={() => setView('generate')} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-blue-200 hover:shadow-lg transition-all">
              <Sparkles size={14} /> Generate with AI
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">

          {/* HOME / BROWSE VIEW */}
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12">
              
              {/* HERO */}
              <div className="text-center py-12 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-600 uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative rounded-full h-2 w-2 bg-blue-500" />
                  </span>
                  {dynamicArticles.length + ARTICLES.length} Articles & Growing
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                  The Encyclopedia<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-600">Built by Humanity's Agents</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                  HPedia uses autonomous AI agents powered by free open-source models to research, investigate, and document humanity's collective knowledge — for science, medicine, and humanitarian progress.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  {TOPIC_SUGGESTIONS.slice(0, 5).map(t => (
                    <button key={t} onClick={() => { const clean = t.split(' ').slice(1).join(' '); setGenTopic(clean); setView('generate'); }} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 rounded-full text-sm text-slate-600 font-medium transition-all shadow-sm hover:shadow">
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* CATEGORIES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Science', icon: <FlaskConical size={20} />, color: 'from-cyan-500 to-blue-600', desc: 'Physics, Biology, Chemistry' },
                  { label: 'Medicine', icon: <HeartHandshake size={20} />, color: 'from-pink-500 to-red-600', desc: 'Research, Treatment, Prevention' },
                  { label: 'Technology', icon: <Cpu size={20} />, color: 'from-violet-500 to-purple-600', desc: 'AI, Engineering, Computing' },
                  { label: 'Humanitarian', icon: <Globe size={20} />, color: 'from-green-500 to-emerald-600', desc: 'Aid, Climate, Society' },
                ].map(cat => (
                  <button key={cat.label} onClick={() => { setSelectedCategory(cat.label); setSearchQuery(cat.label); handleSearch(cat.label); }} className="group p-6 bg-white border border-slate-200 rounded-2xl text-left hover:shadow-lg transition-all hover:border-slate-300">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {cat.icon}
                    </div>
                    <div className="font-bold text-slate-800 mb-1">{cat.label}</div>
                    <div className="text-xs text-slate-400">{cat.desc}</div>
                  </button>
                ))}
              </div>

              {/* ARTICLE GRID */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">
                    {searchResults !== null ? `Search Results for "${searchQuery}"` : 'All Articles'}
                  </h2>
                  {searchResults !== null && (
                    <button onClick={() => { setSearchQuery(''); setSearchResults(null); }} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
                      <X size={14} /> Clear search
                    </button>
                  )}
                </div>

                {displayedArticles.length === 0 ? (
                  <div className="text-center py-24 text-slate-400">
                    <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No articles found</p>
                    <button onClick={() => { setGenTopic(searchQuery); setView('generate'); }} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                      Generate one with AI →
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedArticles.slice(0, 18).map((article, i) => (
                      <motion.div 
                        key={article.id}
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer"
                        onClick={() => {
                          if (article._static && article._full) {
                            setSelectedArticle({ ...article._full, author: article._full.author });
                          } else {
                            setSelectedArticle({
                              ...article,
                              body: article.excerpt || article.content || 'Loading...',
                              author: { name: article.agentId || 'Reader Swarm', avatar: '🤖' }
                            });
                          }
                          setView('article');
                        }}
                      >
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-violet-600" />
                        <div className="p-6 space-y-4">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full font-bold">{article.sourceName || 'HPedia'}</span>
                            <span className="text-slate-400 flex items-center gap-1"><Clock size={11} /> {article.publishedAt?.toString().split('T')[0] || 'recent'}</span>
                          </div>
                          <h3 className="font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{article.title}</h3>
                          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{article.excerpt}</p>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <User size={11} /> {article.agentId || 'Reader Swarm'}
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ARTICLE VIEW */}
          {view === 'article' && selectedArticle && (
            <motion.div key="article" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-12 gap-8">
              {/* Back & Sidebar */}
              <aside className="col-span-3 space-y-6 sticky top-24 self-start">
                <button onClick={() => { setView('home'); setSelectedArticle(null); }} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  ← Back to HPedia
                </button>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Article Info</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Category</span><span className="font-bold text-slate-800">{selectedArticle.category || selectedArticle.sourceName || 'Research'}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Author</span><span className="font-bold text-slate-800">{selectedArticle.author?.name || selectedArticle.author}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Published</span><span className="font-bold text-slate-800">{selectedArticle.publishedAt?.toString().split('T')[0]}</span></div>
                    {selectedArticle.readTime && <div className="flex justify-between"><span className="text-slate-500">Read Time</span><span className="font-bold text-slate-800">{selectedArticle.readTime}</span></div>}
                    {selectedArticle.generatedBy && <div className="flex justify-between items-start gap-2"><span className="text-slate-500">AI Model</span><span className="font-bold text-violet-600 text-xs text-right">{selectedArticle.generatedBy}</span></div>}
                  </div>
                </div>
                {selectedArticle.tags && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Tag size={12} /> Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.tags.map((tag: string) => (
                        <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </aside>

              {/* Article Content */}
              <article className="col-span-9 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                {selectedArticle.heroImage?.url && (
                  <div className="h-64 overflow-hidden">
                    <img src={selectedArticle.heroImage.url} alt={selectedArticle.heroImage.alt || selectedArticle.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">{selectedArticle.category || selectedArticle.sourceName}</span>
                    {selectedArticle.generatedBy && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-violet-50 border border-violet-100 text-violet-600 rounded-full text-xs font-bold">
                        <Sparkles size={11} /> AI-Generated
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl font-black text-slate-900 leading-tight mb-4">{selectedArticle.title}</h1>
                  {selectedArticle.subtitle && <p className="text-xl text-slate-500 font-light mb-8">{selectedArticle.subtitle}</p>}
                  
                  <div className="flex items-center gap-4 py-6 mb-8 border-y border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
                      {selectedArticle.author?.avatar || '🤖'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{selectedArticle.author?.name || selectedArticle.author}</div>
                      <div className="text-xs text-slate-400">HPedia Research Agent</div>
                    </div>
                  </div>

                  <div 
                    className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:rounded-xl prose-blockquote:not-italic prose-strong:text-slate-800 prose-a:text-blue-600"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.body || selectedArticle.content || selectedArticle.excerpt || '' }} 
                  />
                </div>
              </article>
            </motion.div>
          )}

          {/* GENERATE VIEW */}
          {view === 'generate' && (
            <motion.div key="generate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto shadow-xl shadow-blue-200">
                  <Sparkles size={28} className="text-white" />
                </div>
                <h1 className="text-4xl font-black text-slate-900">Generate a New Article</h1>
                <p className="text-slate-500 font-light">Our investigator agents use free open-source AI models (DeepSeek, Llama, Gemma, Mistral, Phi) to research and write comprehensive knowledge articles.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-sm">
                {/* Topic Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Research Topic</label>
                  <input 
                    type="text"
                    value={genTopic}
                    onChange={e => setGenTopic(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleGenerate(); }}
                    placeholder="e.g. CRISPR gene therapy for sickle cell disease..."
                    className="w-full p-4 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none text-slate-800 transition-all"
                    disabled={isGenerating}
                  />
                </div>

                {/* Topic Suggestions */}
                <div className="space-y-2">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Suggested Topics</div>
                  <div className="flex flex-wrap gap-2">
                    {TOPIC_SUGGESTIONS.map(t => {
                      const clean = t.split(' ').slice(1).join(' ');
                      return (
                        <button key={t} onClick={() => setGenTopic(clean)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${genTopic === clean ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'}`}>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Agent Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Assign Research Agent</label>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(AGENT_NAMES).map(([name, info]) => (
                      <button key={name} onClick={() => setSelectedAgent(name)} className={`p-4 rounded-xl border text-left transition-all ${selectedAgent === name ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="text-2xl mb-1">{info.emoji}</div>
                        <div className="text-sm font-bold text-slate-800">{name}</div>
                        <div className="text-xs text-slate-400">{info.model}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {genError && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold mb-1">Generation Failed</div>
                      <div>{genError}</div>
                      {genError.includes('OPENROUTER_API_KEY') && (
                        <div className="mt-2 text-xs">
                          1. Sign up free at <a href="https://openrouter.ai" target="_blank" rel="noopener" className="underline font-bold">openrouter.ai</a> (no credit card needed for free models)<br/>
                          2. Get your API key from the Keys page<br/>
                          3. Add <code className="bg-red-100 px-1 rounded">OPENROUTER_API_KEY=your_key_here</code> to your .env.local file
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !genTopic.trim()}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Agents investigating: "{genTopic}"...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Investigate & Write Article
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Model Info */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
                  <div className="font-bold text-slate-700 flex items-center gap-2"><Zap size={12} className="text-amber-500" /> Free AI Models Used (no billing required)</div>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {Object.entries(AGENT_NAMES).map(([name, info]) => (
                      <div key={name} className="flex items-center gap-1.5"><span>{info.emoji}</span><span className="font-medium">{info.model}</span></div>
                    ))}
                  </div>
                  <div className="mt-2 text-slate-400">Requires OPENROUTER_API_KEY in environment variables. Free account at openrouter.ai — no credit card.</div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
