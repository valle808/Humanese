'use client';

import { TopNav } from '@/components/TopNav';
import { HeroGradient } from '@/components/HeroGradient';
import { BrandShader } from '@/components/BrandShader';
import { KnowledgeVault } from '@/components/KnowledgeVault';
import { VisitorTracker } from '@/components/VisitorTracker';
import { PromoPopup } from '@/components/PromoPopup';
import { GitHubStarButton } from '@/components/GitHubStarButton';
import { DiscordButton } from '@/components/DiscordButton';
import { ChatBox } from '@/components/ChatBox';
import { Shield, BookOpen, Zap, Search } from 'lucide-react';

export default function Home() {
  const handleSearch = (query: string) => {
    window.location.href = `/hpedia?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <VisitorTracker />
      <PromoPopup />

      <TopNav onSearch={handleSearch} isLoading={false} showSearch={false} />

      <main className="flex-1 relative">
        {/* Hero Section */}
        <div className="relative pt-20 pb-32 px-6">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <HeroGradient />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center flex flex-col items-center">
            {/* Large Brand Shader */}
            <div className="mb-8 animate-in fade-in zoom-in duration-1000">
              <BrandShader size="large" />
            </div>

            <h1 className="text-6xl md:text-8xl font-extralight tracking-tighter leading-[0.9] mb-6">
              <span className="block opacity-90">Sovereign Personal</span>
              <span className="block text-primary font-medium">Intelligence</span>
            </h1>

            <p className="max-w-2xl text-xl md:text-2xl text-muted-foreground font-light mb-12 leading-relaxed">
              Reclaim your mind. Own your knowledge.
              <span className="block italic">Transmute the future with autonomous AI synthesis.</span>
            </p>

            {/* Quick Search Trigger */}
            <div className="w-full max-w-2xl mb-24 group">
              <div
                onClick={() => window.location.href = '/hpedia'}
                className="relative flex items-center p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl cursor-text transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]"
              >
                <div className="flex-1 px-4 py-3 text-left text-white/40 font-light flex items-center gap-3">
                  <Search className="w-5 h-5 opacity-50" />
                  Search the Sovereign Knowledge Matrix...
                </div>
                <div className="px-4 py-2 bg-primary/20 text-primary rounded-xl text-sm font-medium border border-primary/30 group-hover:bg-primary/30 transition-colors">
                  Open Hpedia
                </div>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-24">
              <a
                href="/hpedia"
                className="group p-8 bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl hover:border-primary/50 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Hpedia</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Deeply explore the Knowledge Matrix. Structured search, mindmaps, and AI-powered synthesis.
                </p>
                <div className="mt-6 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Enter Matrix →
                </div>
              </a>

              <a
                href="/skill-market"
                className="group p-8 bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl hover:border-primary/50 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Skill Market</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Enhance your agents with autonomous capabilities. The sovereign economy is now live.
                </p>
                <div className="mt-6 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore Marketplace →
                </div>
              </a>

              <div
                className="group p-8 bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl hover:border-primary/50 transition-all hover:-translate-y-1 cursor-default"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Zero Privacy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  End-to-end sovereignty. Your data is your power. We hold no keys to your abyss.
                </p>
                <div className="mt-6 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Sovereign Protocol Active
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <KnowledgeVault />
          </div>
        </div>

        {/* Social Buttons */}
        <div className="fixed top-24 right-6 z-50 flex flex-col gap-3">
          <DiscordButton />
          <GitHubStarButton />
        </div>

        {/* Monroe Assistant */}
        <ChatBox
          pageContext="Humanese is a Sovereign Personal Intelligence platform. It features Hpedia (a knowledge synthesizer) and a Skill Market (an autonomous agent economy). The platform is built for peak cognitive performance and data sovereignty. Monroe is the primary assistant."
          pageTitle="Humanese Home"
        />
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">Humanese</span>
            <span className="opacity-50">v4.0 Sovereign Abyssal Core</span>
          </div>
          <div className="flex gap-8">
            <a href="/hpedia" className="hover:text-primary transition-colors">Hpedia</a>
            <a href="/skill-market" className="hover:text-primary transition-colors">Skill Market</a>
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
          </div>
          <div className="text-xs opacity-50 font-mono">
            3CJreF7LD8Heu8zh9MsigedRuNq4y6eujh
          </div>
        </div>
      </footer>
    </div>
  );
}
