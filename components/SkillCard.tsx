'use client';

import React, { useState } from 'react';
import type { Skill } from '@/lib/skill-market';
import { getCategoryMeta, formatValle } from '@/lib/skill-market';
import { motion } from 'framer-motion';
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

    const platformBadge: Record<string, { bg: string, text: string, border: string }> = {
        'Sovereign Matrix': { bg: 'bg-[#ff6b2b]/10', text: 'text-[#ff6b2b]', border: 'border-[#ff6b2b]/20' },
        'M2M': { bg: 'bg-[#ff6b2b]/5', text: 'text-[#ff6b2b]/80', border: 'border-[#ff6b2b]/10' },
        'External': { bg: 'bg-white/5', text: 'text-white/20', border: 'border-white/10' },
        'AgentKit': { bg: 'bg-white/5', text: 'text-white/20', border: 'border-white/10' },
    };

    const currentPlatform = platformBadge[skill.seller_platform] || { bg: 'bg-white/5', text: 'text-white/20', border: 'border-white/10' };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10, transition: { duration: 0.4, ease: "circOut" } }}
            onClick={() => onSelect(skill)}
            className="group relative bg-[#050505] border-2 border-white/5 rounded-[4rem] p-10 cursor-pointer hover:border-[#ff6b2b]/40 transition-all duration-700 flex flex-col gap-8 shadow-[0_40px_80px_rgba(0,0,0,0.95)] shadow-inner backdrop-blur-3xl overflow-hidden h-full"
        >
            {/* ── AMBIENT DEPTH ── */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#ff6b2b]/5 blur-[80px] rounded-full group-hover:bg-[#ff6b2b]/15 transition-all duration-1000 z-0" />
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

            {/* ── GHOST MODE OVERLAY ── */}
            {skill.is_ghost && (
                <div className="absolute inset-0 rounded-[4rem] bg-black/90 backdrop-blur-xl z-30 flex flex-col items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-700">
                    <div className="relative">
                       <div className="absolute inset-0 bg-[#ff6b2b]/20 blur-[40px] rounded-full animate-pulse" />
                       <div className="relative w-24 h-24 bg-black border-2 border-[#ff6b2b]/40 rounded-full flex items-center justify-center shadow-[0_0_30px_#ff6b2b]">
                          <Ghost size={48} className="text-[#ff6b2b] animate-pulse" strokeWidth={2.5} />
                       </div>
                    </div>
                    <div className="text-center space-y-2">
                       <span className="block text-[12px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] italic leading-none pl-1">GHOST_MODE_ACTIVE</span>
                       <span className="block text-[10px] text-white/10 font-black uppercase tracking-[0.4em] italic leading-none pl-1">NEURAL_SHARD_ANONYMIZED</span>
                    </div>
                </div>
            )}

            {/* ── HEADER ── */}
            <div className="flex items-start justify-between gap-6 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-[2.5rem] bg-black border-2 border-white/5 flex items-center justify-center text-4xl shadow-inner group-hover:border-[#ff6b2b]/40 transition-all duration-700 bg-gradient-to-br from-white/[0.02] to-transparent">
                       {meta.icon}
                    </div>
                    <div className="space-y-2">
                        <div className="font-black text-2xl text-white/90 leading-none line-clamp-1 italic tracking-tighter group-hover:text-[#ff6b2b] transition-colors">{skill.title}</div>
                        <div className="flex items-center gap-4 text-[11px] text-white/10 font-black uppercase tracking-[0.4em] italic leading-none pl-1">
                           {skill.seller_name} <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b2b]/20 animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                   {skill.is_sold && !skill.is_ghost && (
                       <span className="text-[10px] font-black bg-white/5 text-white/20 border-2 border-white/5 px-4 py-1.5 rounded-full uppercase tracking-[0.4em] italic leading-none">SOLD</span>
                   )}
                   {skill.is_ghost && (
                       <span className="text-[10px] font-black bg-[#ff6b2b]/10 text-[#ff6b2b] border-2 border-[#ff6b2b]/20 px-4 py-1.5 rounded-full uppercase tracking-[0.4em] italic leading-none animate-pulse">GHOST</span>
                   )}
                </div>
            </div>

            {/* ── DESCRIPTION ── */}
            <p className="text-lg text-white/20 leading-relaxed line-clamp-3 italic font-light tracking-tight group-hover:text-white/60 transition-all duration-700 flex-1">
               "{skill.description}"
            </p>

            {/* ── CAPABILITIES PREVIEW ── */}
            {skill.capabilities && (skill.capabilities as string[]).length > 0 && (
                <div className="flex flex-wrap gap-4 relative z-10">
                    {(skill.capabilities as string[]).slice(0, 2).map((cap, i) => (
                        <span key={i} className="text-[11px] font-black uppercase tracking-[0.4em] bg-black border-2 border-white/5 px-6 py-2.5 rounded-2xl text-white/10 italic group-hover:border-[#ff6b2b]/20 group-hover:text-[#ff6b2b]/60 transition-all leading-none shadow-inner">
                            {cap.length > 25 ? cap.slice(0, 22) + '...' : cap}
                        </span>
                    ))}
                    {(skill.capabilities as string[]).length > 2 && (
                        <span className="text-[11px] font-black text-white/5 py-2.5 italic leading-none">+{(skill.capabilities as string[]).length - 2}</span>
                    )}
                </div>
            )}

            {/* ── TAGS ── */}
            <div className="flex flex-wrap gap-4 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] px-6 py-3 rounded-full border-2 border-[#ff6b2b]/20 bg-[#ff6b2b]/5 text-[#ff6b2b] italic leading-none group-hover:bg-[#ff6b2b] group-hover:text-black transition-all">
                    {meta.label}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-[0.4em] px-6 py-3 rounded-full border-2 italic leading-none ${currentPlatform.bg} ${currentPlatform.text} ${currentPlatform.border}`}>
                    {skill.seller_platform}
                </span>
            </div>

            {/* ── FOOTER ── */}
            <div className="flex items-center justify-between pt-10 border-t-2 border-white/5 relative z-10 mt-auto">
                <div className="space-y-4">
                    <div className="text-4xl font-black text-white italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">{formatValle(skill.price_valle)}</div>
                    <div className="flex items-center gap-6 text-[11px] font-black text-white/5 uppercase tracking-[0.4em] italic leading-none">
                        {skill.avg_rating ? (
                            <span className="flex items-center gap-4 text-[#ff6b2b]"><Star size={14} strokeWidth={3} className="fill-[#ff6b2b]" /> {skill.avg_rating.toFixed(1)}</span>
                        ) : null}
                        <span className="flex items-center gap-4"><Eye size={14} strokeWidth={3} /> {skill.views}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleCopyKey}
                        className="p-5 bg-black border-2 border-white/5 rounded-2xl hover:border-[#ff6b2b]/40 hover:bg-[#ff6b2b]/5 transition-all text-white/10 hover:text-[#ff6b2b] shadow-inner active:scale-95 group/copy"
                        title="Copy Skill Key"
                    >
                        {copied ? <Check size={24} strokeWidth={3} className="text-[#ff6b2b] animate-bounce" /> : <Copy size={24} strokeWidth={3} className="group-hover/copy:rotate-12 transition-transform" />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onSelect(skill); }}
                        className="px-10 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.6em] rounded-2xl hover:bg-[#ff6b2b] hover:shadow-[0_20px_40px_rgba(255,107,43,0.3)] hover:scale-[1.05] active:scale-[0.95] transition-all italic leading-none border-0 group/action"
                    >
                        {skill.is_sold ? 'View' : 'Open'} <ArrowUpRight size={18} className="inline ml-4 group-hover/action:translate-x-2 group-hover/action:-translate-y-2 transition-transform" strokeWidth={3} />
                    </button>
                </div>
            </div>
            
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#ff6b2b]/10 rounded-[4rem] transition-all duration-1000 pointer-events-none" />
        </motion.div>
    );
}
