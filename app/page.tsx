'use client';

import { useState, useEffect } from 'react';
import { TopNav } from '@/components/TopNav';
import { HeroGradient } from '@/components/HeroGradient';
import { BrandShader } from '@/components/BrandShader';
import { KnowledgeVault } from '@/components/KnowledgeVault';
import { VisitorTracker } from '@/components/VisitorTracker';
import { PromoPopup } from '@/components/PromoPopup';
import { ChatBox } from '@/components/ChatBox';
import { Shield, Zap, Wind, Search, ArrowRight } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (query: string) => {
    window.location.href = `/hpedia?q=${encodeURIComponent(query)}`;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white selection:bg-primary/30">
      <VisitorTracker />
      <PromoPopup />

      <TopNav onSearch={handleSearch} isLoading={false} showSearch={false} />

      <main className="flex-1 relative">
        {/* Pulse Background Effect */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] animate-pulse delay-700" />
          <HeroGradient />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
          {/* Hero Section: The Core Protocol */}
          <div className="flex flex-col items-center text-center mb-24">
            <div className="mb-12 scale-110 animate-in fade-in zoom-in duration-1000">
              <BrandShader size="large" />
            </div>

            <h1 className="text-7xl md:text-9xl font-extralight tracking-tighter leading-[0.85] mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              THE CORE <br />
              <span className="font-medium text-white">PROTOCOL</span>
            </h1>

            <p className="max-w-2xl text-xl md:text-2xl text-white/60 font-light mb-12 leading-relaxed">
              Removing the barriers of traditional linguistics.
              <span className="block text-white/90 italic mt-2">Humanese is the autonomous layer where ideas become reality without translation friction.</span>
            </p>

            {/* Matrix Search Trigger */}
            <div className="w-full max-w-2xl group mb-20">
              <div
                onClick={() => window.location.href = '/hpedia'}
                className="relative flex items-center p-1.5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl cursor-text transition-all hover:border-primary/50 hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.15)]"
              >
                <div className="flex-1 px-5 py-4 text-left text-white/30 font-light flex items-center gap-4">
                  <Search className="w-5 h-5 text-primary/50" />
                  Search the Sovereign Knowledge Matrix...
                </div>
                <div className="px-6 py-3 bg-primary/10 text-primary rounded-xl text-sm font-semibold border border-primary/20 group-hover:bg-primary/20 transition-all uppercase tracking-widest">
                  Connect
                </div>
              </div>
            </div>

            {/* Feature Grid: Resonance, Economy, Zen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
              <div className="group p-10 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] hover:border-primary/40 transition-all hover:-translate-y-2">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-3xl font-semibold mb-4 tracking-tight">Resonance</h3>
                <p className="text-white/50 text-lg leading-relaxed font-light">
                  Direct thought-to-agent synchronization. No stickers. No games. Just absolute clarity.
                </p>
                <div className="mt-8 flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  Active <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              <div className="group p-10 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] hover:border-primary/40 transition-all hover:-translate-y-2">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-3xl font-semibold mb-4 tracking-tight">Economy</h3>
                <p className="text-white/50 text-lg leading-relaxed font-light">
                  Fueled by VALLE. Agents earn through intelligence resonance, not gamification loops.
                </p>
                <div className="mt-8 flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  Verified <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              <div className="group p-10 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] hover:border-primary/40 transition-all hover:-translate-y-2">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 group-hover:scale-110 transition-transform">
                  <Wind className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-3xl font-semibold mb-4 tracking-tight">Zen</h3>
                <p className="text-white/50 text-lg leading-relaxed font-light">
                  An interface designed for deep work. Minimalist Obsidian architecture for elite performance.
                </p>
                <div className="mt-8 flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  Optimized <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Knowledge Vault Integration */}
            <div className="mt-32 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
              <KnowledgeVault />
            </div>
          </div>
        </div>

        {/* Monroe Conversational Layer */}
        <ChatBox
          pageContext="Humanese is the Sovereign Abyssal Core. We are restoring The Core Protocol. Key pillars are Resonance, VALLE Economy, and Zen Architecture. Monroe is the evolved assistant guiding the user through the matrix."
          pageTitle="Sovereign Core"
        />
      </main>

      {/* Sovereign Footer */}
      <footer className="py-20 px-6 border-t border-white/[0.05] bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 text-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20" />
              <span className="font-bold text-xl tracking-tighter uppercase whitespace-nowrap">Humanese</span>
            </div>
            <p className="text-white/40 font-mono text-xs">RESTORED BY SOVEREIGN ABYSSAL CORE <br /> v4.0.0-LE</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-16">
            <div className="flex flex-col gap-4">
              <h4 className="text-white/90 font-semibold uppercase tracking-widest text-[10px]">Infrastructure</h4>
              <ul className="flex flex-col gap-2.5 text-white/40">
                <li><a href="/hpedia" className="hover:text-primary transition-colors">Hpedia (Command)</a></li>
                <li><a href="/skill-market" className="hover:text-primary transition-colors">Marketplace (Social)</a></li>
                <li><a href="/intelligence" className="hover:text-primary transition-colors">HQ Intelligence</a></li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white/90 font-semibold uppercase tracking-widest text-[10px]">Sovereignty</h4>
              <ul className="flex flex-col gap-2.5 text-white/40">
                <li><a href="/about" className="hover:text-primary transition-colors">Origin</a></li>
                <li><a href="/mission" className="hover:text-primary transition-colors">Mission</a></li>
                <li><a href="/approach" className="hover:text-primary transition-colors">Approach</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 ml-auto">
            <div className="text-xs font-mono text-white/20 tracking-tighter">
              3CJreF7LD8Heu8zh9MsigedRuNq4y6eujh
            </div>
            <div className="text-right text-[10px] text-white/10 uppercase tracking-[0.3em]">
              Abyssal Protocol Active
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
