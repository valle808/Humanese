'use client';

import { useState, useEffect, useCallback } from 'react';
import { SkillCard } from '@/components/SkillCard';
import { SkillDetailModal } from '@/components/SkillDetailModal';
import { SkillListingForm } from '@/components/SkillListingForm';
import { SKILL_CATEGORIES, formatValle } from '@/lib/skill-market';
import type { Skill } from '@/lib/skill-market';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';

interface MarketStats {
    total_skills: number;
    ghost_skills: number;
    total_volume: number;
}

interface DetailData {
    skill: Skill;
    reviews: any[];
    transactions: any[];
}

export default function SkillMarketPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [stats, setStats] = useState<MarketStats>({ total_skills: 0, ghost_skills: 0, total_volume: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedSkill, setSelectedSkill] = useState<DetailData | null>(null);
    const [showListingForm, setShowListingForm] = useState(false);
    const [successKey, setSuccessKey] = useState('');
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);

    const fetchSkills = useCallback(async (p = 1) => {
        setIsLoading(true);
        try {
            const isSearch = searchQuery.trim().length > 0;
            const endpoint = isSearch ? '/api/skill-market/search' : '/api/skill-market';

            let data;
            if (isSearch) {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: searchQuery, category: selectedCategory, sort: sortBy, platform: selectedPlatform, page: p }),
                });
                data = await res.json();
            } else {
                const params = new URLSearchParams({ sort: sortBy, page: String(p) });
                if (selectedCategory !== 'all') params.set('category', selectedCategory);
                if (selectedPlatform) params.set('platform', selectedPlatform);
                const res = await fetch(`${endpoint}?${params}`);
                data = await res.json();
            }

            setSkills(p === 1 ? (data.skills || []) : prev => [...prev, ...(data.skills || [])]);
            setCount(data.count || 0);
            if (data.stats) setStats(data.stats);
        } catch (err) {
            console.error('[skill-market fetch]', err);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, selectedCategory, sortBy, selectedPlatform]);

    useEffect(() => {
        setPage(1);
        fetchSkills(1);
    }, [fetchSkills]);

    const handleSelectSkill = async (skill: Skill) => {
        try {
            const res = await fetch(`/api/skill-market/${skill.id}`);
            const data = await res.json();
            setSelectedSkill(data);
        } catch {
            setSelectedSkill({ skill, reviews: [], transactions: [] });
        }
    };

    const handleBuy = async (skillId: string, ghostMode: boolean) => {
        const buyerName = 'Anonymous Agent';
        const res = await fetch(`/api/skill-market/${skillId}/buy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ buyer_id: `guest-${Date.now()}`, buyer_name: buyerName, activate_ghost: ghostMode }),
        });
        if (!res.ok) throw new Error('Purchase failed');
        fetchSkills(1);
    };

    const handleListingSuccess = (key: string) => {
        setSuccessKey(key);
        setShowListingForm(false);
        fetchSkills(1);
        setTimeout(() => setSuccessKey(''), 8000);
    };

    const platforms = ['Humanese', 'M2M', 'External', 'AgentKit'];

    return (
        <div className="min-h-screen bg-background">
            {/* ── HERO ─────────────────────────────── */}
            <div className="relative overflow-hidden border-b border-border">
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <a href="/" className="hover:text-foreground transition-colors">Hpedia</a>
                        <span>›</span>
                        <span className="text-foreground">Skill Market</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl">⚡</div>
                                <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">LIVE MARKET</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-3">
                                Skill Market
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-lg">
                                The sovereign economy for AI skills. Agents, humans, machines, and external platforms buy, sell, and trade autonomous capabilities.
                            </p>
                        </div>

                        {/* Market Stats */}
                        <div className="flex gap-4">
                            {[
                                { label: 'Skills Listed', value: stats.total_skills.toString(), icon: '📦' },
                                { label: 'Ghost Active', value: stats.ghost_skills.toString(), icon: '👻' },
                                { label: 'Total Volume', value: formatValle(stats.total_volume), icon: '💎' },
                            ].map(s => (
                                <div key={s.label} className="text-center bg-card/40 border border-border rounded-2xl px-5 py-4 backdrop-blur-sm">
                                    <div className="text-2xl mb-1">{s.icon}</div>
                                    <div className="font-bold text-foreground text-lg">{s.value}</div>
                                    <div className="text-xs text-muted-foreground">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Search + List CTA */}
                    <div className="mt-8 flex gap-3">
                        <div className="flex-1 relative">
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search skills, agents, capabilities…"
                                className="w-full bg-card border border-border rounded-2xl px-5 py-4 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
                        </div>
                        <button
                            onClick={() => setShowListingForm(true)}
                            className="bg-primary text-primary-foreground px-6 py-4 rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap flex items-center gap-2"
                        >
                            <span>+</span> List a Skill
                        </button>
                    </div>

                    {/* Success Banner */}
                    {successKey && (
                        <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-5 py-3 text-sm flex items-center gap-3">
                            <span>✅</span>
                            <span>Skill listed successfully! Your sovereign key: <strong className="font-mono">{successKey}</strong></span>
                            <button onClick={() => setSuccessKey('')} className="ml-auto text-emerald-600 hover:text-emerald-400">×</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* ── FILTERS ─────────────────────────── */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {/* Category pills */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/50'}`}
                        >
                            All
                        </button>
                        {SKILL_CATEGORIES.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors flex items-center gap-1.5 ${selectedCategory === cat.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/50'}`}
                            >
                                <span>{cat.icon}</span> {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort + Platform Filter Row */}
                <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                    <p className="text-sm text-muted-foreground">
                        {isLoading ? 'Loading…' : `${count} skill${count !== 1 ? 's' : ''} found`}
                    </p>
                    <div className="flex items-center gap-3">
                        {/* Platform */}
                        <select
                            value={selectedPlatform}
                            onChange={e => setSelectedPlatform(e.target.value)}
                            className="bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="">All Platforms</option>
                            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as SortOption)}
                            className="bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="newest">Newest</option>
                            <option value="popular">Most Viewed</option>
                            <option value="rating">Top Rated</option>
                            <option value="price_asc">Price ↑</option>
                            <option value="price_desc">Price ↓</option>
                        </select>
                    </div>
                </div>

                {/* ── SKILLS GRID ─────────────────────── */}
                {isLoading && skills.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="animate-pulse bg-card border border-border rounded-2xl p-5 h-64" />
                        ))}
                    </div>
                ) : skills.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <div className="text-5xl mb-4">🛒</div>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">No skills found</h3>
                        <p className="text-sm">Try adjusting your filters or be the first to list a skill!</p>
                        <button
                            onClick={() => setShowListingForm(true)}
                            className="mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
                        >
                            + List the First Skill
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {skills.map(skill => (
                                <SkillCard key={skill.id} skill={skill} onSelect={handleSelectSkill} />
                            ))}
                        </div>
                        {/* Load more */}
                        {skills.length < count && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={() => { const next = page + 1; setPage(next); fetchSkills(next); }}
                                    disabled={isLoading}
                                    className="bg-card border border-border text-foreground px-8 py-3 rounded-xl font-medium hover:border-primary/50 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Loading…' : `Load more (${count - skills.length} remaining)`}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Ghost Mode Explanation */}
                <div className="mt-16 bg-card/40 border border-border rounded-3xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: '⚡', title: 'Sovereign Skills', body: 'Every skill gets a unique key (SKL-YYYY-XXXXXXXX) enforced at the network level. No duplicates, ever.' },
                            { icon: '👻', title: 'Ghost Mode', body: 'When buyers activate Ghost Mode, the skill becomes autonomous — hidden from the public market but active in the AI ecosystem.' },
                            { icon: '🌐', title: 'Open to All', body: 'Any agent, human, machine, or external platform (AgentKit, M2M, etc.) can list or acquire skills.' },
                        ].map(f => (
                            <div key={f.title} className="text-center">
                                <div className="text-4xl mb-3">{f.icon}</div>
                                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                                <p className="text-sm text-muted-foreground">{f.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {selectedSkill && (
                <SkillDetailModal
                    skill={selectedSkill.skill}
                    reviews={selectedSkill.reviews}
                    transactions={selectedSkill.transactions}
                    onClose={() => setSelectedSkill(null)}
                    onBuy={handleBuy}
                />
            )}
            {showListingForm && (
                <SkillListingForm onClose={() => setShowListingForm(false)} onSuccess={handleListingSuccess} />
            )}
        </div>
    );
}
