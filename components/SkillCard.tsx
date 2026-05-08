'use client';

import React, { useState } from 'react';
import type { Skill } from '@/lib/skill-market';
import { getCategoryMeta, formatValle } from '@/lib/skill-market';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink, 
  Eye, 
  Star,
  ShieldCheck,
  ShieldAlert,
  Ghost,
  Cpu,
  Binary,
  Layers,
  Activity,
  ArrowUpRight
} from 'lucide-react';

interface SkillCardProps {
    skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
    const [copied, setCopied] = useState(false);
    const router = useRouter();
    const meta = getCategoryMeta(skill.category);

    const handleCopyKey = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(skill.skill_key);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const platformBadge: Record<string, { bg: string, text: string, border: string }> = {
        'Sovereign Matrix': { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
        'M2M': { bg: 'bg-primary/5', text: 'text-primary/80', border: 'border-primary/10' },
        'External': { bg: 'bg-muted', text: 'text-muted-foreground/40', border: 'border-border' },
        'AgentKit': { bg: 'bg-muted', text: 'text-muted-foreground/40', border: 'border-border' },
    };

    const currentPlatform = platformBadge[skill.seller_platform] || { bg: 'bg-muted', text: 'text-muted-foreground/40', border: 'border-border' };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10, transition: { duration: 0.4, ease: "circOut" } }}
            onClick={() => router.push(`/skill-market/${skill.id}`)}
            className="group relative bg-background border-2 border-border rounded-[3rem] p-6 sm:p-8 cursor-pointer hover:border-primary/40 transition-all duration-700 flex flex-col gap-6 shadow-lg shadow-inner backdrop-blur-3xl overflow-hidden h-full"
        >
            {/* ── AMBIENT DEPTH ── */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/15 transition-all duration-1000 z-0" />
            
            {/* ── GHOST MODE OVERLAY ── */}
            {skill.is_ghost && (
                <div className="absolute inset-0 rounded-[4rem] bg-background/90 backdrop-blur-xl z-30 flex flex-col items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-700">
                    <div className="relative">
                       <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full animate-pulse" />
                       <div className="relative w-24 h-24 bg-background border-2 border-primary/40 rounded-full flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary))]">
                          <Ghost size={48} className="text-primary animate-pulse" strokeWidth={2.5} />
                       </div>
                    </div>
                    <div className="text-center space-y-2">
                       <span className="block text-[12px] font-black uppercase tracking-[0.8em] text-primary italic leading-none pl-1">GHOST_MODE_ACTIVE</span>
                       <span className="block text-[10px] text-muted-foreground/10 font-black uppercase tracking-[0.4em] italic leading-none pl-1">NEURAL_SHARD_ANONYMIZED</span>
                    </div>
                </div>
            )}

            {/* ── HEADER ── */}
            <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4 flex-1">
                    <div className="h-16 w-16 shrink-0 rounded-3xl bg-muted border-2 border-border flex items-center justify-center text-3xl shadow-inner group-hover:border-primary/40 transition-all duration-700">
                       {meta.icon}
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="font-black text-xl text-foreground/90 leading-tight italic tracking-tight group-hover:text-primary transition-colors break-words pr-2">{skill.title}</div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/50 font-black uppercase tracking-widest italic leading-none pl-1">
                           <span className="truncate">{skill.seller_name}</span> <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-primary/60 dark:bg-primary/20 animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                   {skill.is_sold && !skill.is_ghost && (
                       <span className="text-[9px] font-black bg-muted text-muted-foreground/40 border-2 border-border px-3 py-1.5 rounded-full uppercase tracking-widest italic leading-none">SOLD</span>
                   )}
                   {skill.is_ghost && (
                       <span className="text-[9px] font-black bg-primary/10 text-primary border-2 border-primary/20 px-3 py-1.5 rounded-full uppercase tracking-widest italic leading-none animate-pulse">GHOST</span>
                   )}
                </div>
            </div>

            {/* ── DESCRIPTION ── */}
            <p className="text-sm text-muted-foreground/60 leading-relaxed line-clamp-4 italic font-light tracking-normal group-hover:text-foreground transition-all duration-700 flex-1">
               "{skill.description}"
            </p>

            {/* ── CAPABILITIES PREVIEW ── */}
            {skill.capabilities && (skill.capabilities as string[]).length > 0 && (
                <div className="flex flex-wrap gap-2 relative z-10">
                    {(skill.capabilities as string[]).slice(0, 2).map((cap, i) => (
                        <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-muted border-2 border-border px-3 py-1.5 rounded-xl text-muted-foreground/40 italic group-hover:border-primary/20 group-hover:text-primary/80 transition-all leading-none shadow-sm text-center">
                            {cap.length > 25 ? cap.slice(0, 22) + '...' : cap}
                        </span>
                    ))}
                    {(skill.capabilities as string[]).length > 2 && (
                        <span className="text-[9px] font-black text-muted-foreground/30 py-1.5 italic leading-none">+{(skill.capabilities as string[]).length - 2}</span>
                    )}
                </div>
            )}

            {/* ── TAGS ── */}
            <div className="flex flex-wrap gap-2 relative z-10">
                <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border-2 border-primary/20 bg-primary/5 text-primary italic leading-none group-hover:bg-primary group-hover:text-primary-foreground transition-all text-center">
                    {meta.label}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border-2 italic leading-none text-center ${currentPlatform.bg} ${currentPlatform.text} ${currentPlatform.border}`}>
                    {skill.seller_platform}
                </span>
            </div>

            {/* ── FOOTER ── */}
            <div className="flex items-center justify-between pt-6 border-t-2 border-border relative z-10 mt-auto gap-4">
                <div className="space-y-3 shrink min-w-0">
                    <div className="text-2xl font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors truncate">{formatValle(skill.price_valle)}</div>
                    <div className="flex items-center gap-3 text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest italic leading-none">
                        {skill.avg_rating ? (
                            <span className="flex items-center gap-1.5 text-primary"><Star size={12} strokeWidth={3} className="fill-primary" /> {skill.avg_rating.toFixed(1)}</span>
                        ) : null}
                        <span className="flex items-center gap-1.5"><Eye size={12} strokeWidth={3} /> {skill.views}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleCopyKey}
                        className="p-3 bg-muted border-2 border-border rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all text-muted-foreground/40 hover:text-primary shadow-sm active:scale-95 group/copy"
                        title="Copy Skill Key"
                    >
                        {copied ? <Check size={18} strokeWidth={3} className="text-primary animate-bounce" /> : <Copy size={18} strokeWidth={3} className="group-hover/copy:rotate-12 transition-transform" />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/skill-market/${skill.id}`); }}
                        className="px-5 py-3 bg-foreground text-background dark:bg-white dark:text-background text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary dark:hover:bg-primary hover:text-primary-foreground hover:shadow-[0_10px_20px_rgba(var(--primary),0.3)] hover:scale-[1.05] active:scale-[0.95] transition-all italic leading-none border-0 group/action flex items-center"
                    >
                        {skill.is_sold ? 'View' : 'Open'} <ArrowUpRight size={14} className="ml-2 group-hover/action:translate-x-1 group-hover/action:-translate-y-1 transition-transform" strokeWidth={3} />
                    </button>
                </div>
            </div>
            
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/10 rounded-[4rem] transition-all duration-1000 pointer-events-none" />
        </motion.div>
    );
}
