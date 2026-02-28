'use client';

import { useState } from 'react';
import type { Skill } from '@/lib/skill-market';
import { getCategoryMeta, formatValle } from '@/lib/skill-market';

interface SkillCardProps {
    skill: Skill;
    onSelect: (skill: Skill) => void;
}

export function SkillCard({ skill, onSelect }: SkillCardProps) {
    const [copied, setCopied] = useState(false);
    const meta = getCategoryMeta(skill.category);

    const handleCopyKey = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(skill.skill_key);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const platformBadge: Record<string, string> = {
        'Humanese': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'M2M': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        'External': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'AgentKit': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onSelect(skill)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(skill); } }}
            aria-label={`View details for ${skill.title}`}
            className="group relative bg-card border border-border rounded-2xl p-5 cursor-pointer hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col gap-3"
        >
            {/* Ghost Mode Overlay */}
            {skill.is_ghost && (
                <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-3xl">👻</span>
                    <span className="text-xs text-white/60 font-mono">GHOST MODE ACTIVE</span>
                    <span className="text-xs text-white/40">Autonomous — not for sale</span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{meta.icon}</span>
                    <div>
                        <div className="font-semibold text-sm text-foreground leading-tight line-clamp-1">{skill.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{skill.seller_name}</div>
                    </div>
                </div>
                {skill.is_sold && !skill.is_ghost && (
                    <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full flex-shrink-0">SOLD</span>
                )}
                {skill.is_ghost && (
                    <span className="text-xs bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2 py-0.5 rounded-full flex-shrink-0">👻 GHOST</span>
                )}
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{skill.description}</p>

            {/* Capabilities preview */}
            {skill.capabilities && skill.capabilities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {(skill.capabilities as string[]).slice(0, 2).map((cap, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            {cap.length > 30 ? cap.slice(0, 27) + '...' : cap}
                        </span>
                    ))}
                    {skill.capabilities.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{(skill.capabilities as string[]).length - 2}</span>
                    )}
                </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
                <span
                    className="text-xs px-2 py-0.5 rounded-full border"
                    style={{ background: `${meta.color}15`, color: meta.color, borderColor: `${meta.color}30` }}
                >
                    {meta.label}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${platformBadge[skill.seller_platform] ?? 'bg-muted text-muted-foreground border-border'}`}>
                    {skill.seller_platform}
                </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                <div>
                    <div className="text-base font-bold text-primary">{formatValle(skill.price_valle)}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {skill.avg_rating ? (
                            <span>⭐ {skill.avg_rating.toFixed(1)}</span>
                        ) : null}
                        <span>👁 {skill.views}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Copy skill key */}
                    <button
                        onClick={handleCopyKey}
                        aria-label={`Copy skill key for ${skill.title}`}
                        className="text-xs font-mono bg-muted hover:bg-muted/80 px-2 py-1 rounded-lg transition-colors border border-border"
                        title="Copy Skill Key"
                    >
                        {copied ? '✓ Copied' : skill.skill_key.slice(-8)}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onSelect(skill); }}
                        aria-label={`${skill.is_sold ? 'View' : 'View details for'} ${skill.title}`}
                        className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                        {skill.is_sold ? 'View' : 'Details'}
                    </button>
                </div>
            </div>
        </div>
    );
}
