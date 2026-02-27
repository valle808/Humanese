'use client';

import { useState } from 'react';
import type { Skill } from '@/lib/skill-market';
import { getCategoryMeta, formatValle } from '@/lib/skill-market';

interface SkillDetailModalProps {
    skill: Skill | null;
    reviews: Array<{ id: string; reviewer_name: string; rating: number; body?: string; created_at: string }>;
    transactions: Array<{ id: string; buyer_name: string; buyer_platform: string; purchased_at: string; ghost_mode_activated: boolean }>;
    onClose: () => void;
    onBuy: (skillId: string, ghostMode: boolean) => Promise<void>;
}

/**
 * SkillDetailModal Component
 * Provides a comprehensive view of a sovereign skill, including:
 * - Functional overview and capabilities logic.
 * - JSON Schema for inputs and outputs.
 * - Peer reviews and verification history.
 * - Acquisition interface with VALLE token conversion.
 * - Post-purchase Ghost Mode activation.
 */
export function SkillDetailModal({ skill, reviews, transactions, onClose, onBuy }: SkillDetailModalProps) {
    const [buyerName, setBuyerName] = useState('');
    const [buyerPlatform, setBuyerPlatform] = useState('Humanese');
    const [ghostMode, setGhostMode] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [purchaseMsg, setPurchaseMsg] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'reviews' | 'history'>('overview');
    const [keyCopied, setKeyCopied] = useState(false);

    if (!skill) return null;
    const meta = getCategoryMeta(skill.category);

    const handleBuy = async () => {
        if (!buyerName.trim()) { setPurchaseMsg('Please enter your name / agent ID.'); return; }
        setIsProcessing(true);
        try {
            await onBuy(skill.id, ghostMode);
            setPurchaseMsg(ghostMode
                ? `✅ Purchased! Ghost Mode ACTIVATED. Skill ${skill.skill_key} now runs autonomously.`
                : `✅ Purchased! Skill ${skill.skill_key} is now yours.`
            );
        } catch (err) {
            setPurchaseMsg('❌ Purchase failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const copyKey = () => {
        navigator.clipboard.writeText(skill.skill_key);
        setKeyCopied(true);
        setTimeout(() => setKeyCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div
                className="relative z-10 bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-start justify-between rounded-t-3xl">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{meta.icon}</span>
                            <h2 className="text-lg font-bold text-foreground">{skill.title}</h2>
                            {skill.is_ghost && <span className="text-xs bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2 py-0.5 rounded-full">👻 GHOST</span>}
                            {skill.is_sold && !skill.is_ghost && <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">SOLD</span>}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>By {skill.seller_name} · {skill.seller_platform}</span>
                            <button
                                onClick={copyKey}
                                className="font-mono text-xs bg-muted/60 hover:bg-muted px-2 py-0.5 rounded-lg border border-border transition-colors"
                            >
                                {keyCopied ? '✓ Copied' : skill.skill_key}
                            </button>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors text-xl">×</button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border px-6">
                    {(['overview', 'schema', 'reviews', 'history'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 px-4 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-6 space-y-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <>
                            <p className="text-sm text-muted-foreground leading-relaxed">{skill.description}</p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Price', value: formatValle(skill.price_valle), color: 'text-primary' },
                                    { label: 'Rating', value: skill.avg_rating ? `⭐ ${skill.avg_rating.toFixed(1)}` : 'New', color: 'text-yellow-400' },
                                    { label: 'Views', value: `👁 ${skill.views}`, color: 'text-blue-400' },
                                ].map(s => (
                                    <div key={s.label} className="bg-muted/40 rounded-xl p-3 text-center">
                                        <div className={`font-bold ${s.color}`}>{s.value}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Capabilities */}
                            {skill.capabilities && (skill.capabilities as string[]).length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground mb-2">Capabilities</h3>
                                    <ul className="space-y-1">
                                        {(skill.capabilities as string[]).map((cap, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="text-primary">✓</span> {cap}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {skill.tags?.map(tag => (
                                    <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">#{tag}</span>
                                ))}
                            </div>

                            {/* External links */}
                            <div className="flex gap-3">
                                {skill.external_url && (
                                    <a href={skill.external_url} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline">↗ Platform Link</a>
                                )}
                                {skill.demo_url && (
                                    <a href={skill.demo_url} target="_blank" rel="noreferrer" className="text-sm text-emerald-400 hover:underline">▶ Demo</a>
                                )}
                            </div>

                            {/* Purchase Panel */}
                            {!skill.is_sold ? (
                                <div className="bg-muted/40 border border-border rounded-2xl p-5 space-y-4">
                                    <h3 className="font-semibold text-foreground">Acquire This Skill</h3>
                                    <input
                                        value={buyerName}
                                        onChange={e => setBuyerName(e.target.value)}
                                        placeholder="Your name / Agent ID"
                                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <select
                                        value={buyerPlatform}
                                        onChange={e => setBuyerPlatform(e.target.value)}
                                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option>Humanese</option>
                                        <option>M2M</option>
                                        <option>External</option>
                                        <option>AgentKit</option>
                                    </select>

                                    {/* Ghost Mode Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-700/40">
                                        <div>
                                            <div className="font-medium text-sm flex items-center gap-2">
                                                👻 <span>Ghost Mode</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Skill becomes autonomous and invisible from the public market after purchase.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setGhostMode(!ghostMode)}
                                            className={`relative w-11 h-6 rounded-full transition-colors ${ghostMode ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${ghostMode ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    {purchaseMsg && (
                                        <p className="text-sm text-center text-muted-foreground">{purchaseMsg}</p>
                                    )}

                                    <button
                                        onClick={handleBuy}
                                        disabled={isProcessing}
                                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                                    >
                                        {isProcessing ? 'Processing...' : `Buy for ${formatValle(skill.price_valle)}`}
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-muted/40 border border-border rounded-2xl p-5 text-center text-muted-foreground text-sm">
                                    {skill.is_ghost ? '👻 This skill is operating in Ghost Mode — fully autonomous.' : '🔒 This skill has been purchased.'}
                                </div>
                            )}
                        </>
                    )}

                    {/* Schema Tab */}
                    {activeTab === 'schema' && (
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-sm font-semibold mb-2 text-foreground">Input Schema</h3>
                                <pre className="bg-muted/60 rounded-xl p-4 text-xs text-muted-foreground overflow-x-auto font-mono">
                                    {JSON.stringify(skill.input_schema, null, 2)}
                                </pre>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-2 text-foreground">Output Schema</h3>
                                <pre className="bg-muted/60 rounded-xl p-4 text-xs text-muted-foreground overflow-x-auto font-mono">
                                    {JSON.stringify(skill.output_schema, null, 2)}
                                </pre>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-2 text-foreground">Skill Key</h3>
                                <p className="text-xs text-muted-foreground mb-2">Unique sovereign identifier. Cannot be duplicated in the ecosystem.</p>
                                <pre className="bg-muted/60 rounded-xl p-4 text-sm text-primary font-mono">{skill.skill_key}</pre>
                            </div>
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-3">
                            {reviews.length === 0 ? (
                                <p className="text-center text-muted-foreground text-sm py-8">No reviews yet. Be the first buyer!</p>
                            ) : reviews.map(r => (
                                <div key={r.id} className="bg-muted/40 rounded-xl p-4 space-y-1">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-sm">{r.reviewer_name}</span>
                                        <span className="text-yellow-400">{'⭐'.repeat(r.rating)}</span>
                                    </div>
                                    {r.body && <p className="text-xs text-muted-foreground">{r.body}</p>}
                                    <p className="text-xs text-muted-foreground/60">{new Date(r.created_at).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div className="space-y-3">
                            {transactions.length === 0 ? (
                                <p className="text-center text-muted-foreground text-sm py-8">No purchase history yet.</p>
                            ) : transactions.map(t => (
                                <div key={t.id} className="bg-muted/40 rounded-xl p-4 flex items-center justify-between gap-4">
                                    <div>
                                        <div className="text-sm font-medium">{t.buyer_name}</div>
                                        <div className="text-xs text-muted-foreground">{t.buyer_platform} · {new Date(t.purchased_at).toLocaleDateString()}</div>
                                    </div>
                                    {t.ghost_mode_activated && (
                                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">👻 Ghost</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
