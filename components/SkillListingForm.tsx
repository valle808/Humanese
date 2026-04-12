'use client';

import React, { useState } from 'react';
import { generateSkillKey, SKILL_CATEGORIES } from '@/lib/skill-market';
import type { SkillCategory } from '@/lib/skill-market';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Zap, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Plus, 
  ArrowRight, 
  Orbit, 
  Binary, 
  Target, 
  Globe, 
  Terminal,
  ShieldAlert,
  Save,
  Rocket
} from 'lucide-react';

interface SkillListingFormProps {
    onClose: () => void;
    onSuccess: (skillKey: string) => void;
}

export function SkillListingForm({ onClose, onSuccess }: SkillListingFormProps) {
    const [form, setForm] = useState({
        title: '', description: '', category: 'development' as SkillCategory,
        price_valle: '', seller_name: '', seller_id: '', seller_platform: 'Sovereign Matrix',
        tags: '', capabilities: '', external_url: '', demo_url: '',
        input_key: '', input_type: '', output_key: '', output_type: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [previewKey] = useState(generateSkillKey());

    const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

    const handleSubmit = async () => {
        if (!form.title || !form.description || !form.seller_name || !form.seller_id) {
            setError('Title, description, seller name and seller ID are required.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            const caps = form.capabilities.split('\n').map(s => s.trim()).filter(Boolean);
            const tagsArr = form.tags.split(',').map(s => s.trim()).filter(Boolean);
            const input_schema = form.input_key ? { [form.input_key]: form.input_type || 'string' } : {};
            const output_schema = form.output_key ? { [form.output_key]: form.output_type || 'string' } : {};

            const res = await fetch('/api/skill-market', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: form.title, description: form.description, category: form.category,
                    price_valle: parseFloat(form.price_valle) || 0,
                    seller_id: form.seller_id, seller_name: form.seller_name,
                    seller_platform: form.seller_platform,
                    tags: tagsArr, capabilities: caps,
                    input_schema, output_schema,
                    external_url: form.external_url || undefined,
                    demo_url: form.demo_url || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to list skill');
            onSuccess(data.skill_key);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Submission failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = 'w-full bg-[#050505] border-2 border-white/5 rounded-2xl px-8 py-4 text-lg text-white placeholder:text-white/5 outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all duration-500 font-light italic shadow-inner';
    const labelClass = 'text-[11px] font-black uppercase tracking-[0.4em] text-white/10 mb-3 block italic pl-4';

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 md:p-12 overflow-hidden" onClick={onClose}>
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="absolute inset-0 bg-black/98 backdrop-blur-3xl" 
            />
            
            <motion.div
                initial={{ scale: 0.95, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 40, opacity: 0 }}
                className="relative z-10 bg-[#050505] border-2 border-white/10 rounded-[5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,1)] flex flex-col shadow-inner"
                onClick={e => e.stopPropagation()}
            >
                {/* ── AMBIENT CORE ── */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent z-40" />
                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

                {/* ── HEADER ── */}
                <div className="p-12 lg:px-16 flex items-start justify-between bg-white/[0.02] border-b-2 border-white/5 relative z-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-8">
                            <div className="h-20 w-20 bg-[#ff6b2b] rounded-[2rem] flex items-center justify-center text-black shadow-[0_0_30px_#ff6b2b]">
                                <Plus size={40} strokeWidth={4} />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">List <span className="text-[#ff6b2b]">Shard.</span></h2>
                                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/5 italic leading-none pl-1">Your skill will receive a unique sovereign key</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-black border-2 border-white/5 p-5 rounded-full text-white/10 hover:text-[#ff6b2b] hover:border-[#ff6b2b]/40 hover:bg-[#ff6b2b]/5 transition-all shadow-inner active:scale-95">
                        <X size={32} strokeWidth={3} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 lg:p-16 custom-scrollbar space-y-16">
                    {/* ── PREVIEW KEY ── */}
                    <div className="p-12 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[4rem] group hover:border-[#ff6b2b]/50 transition-all shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-125 transition-transform duration-2000">
                           <ShieldCheck size={120} className="text-[#ff6b2b]" strokeWidth={1} />
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-6">
                               <div className="w-12 h-12 bg-[#ff6b2b] rounded-2xl flex items-center justify-center text-black">
                                  <Binary size={24} strokeWidth={3} />
                               </div>
                               <p className="text-[12px] font-black text-[#ff6b2b]/60 uppercase tracking-[0.5em] italic leading-none">Sovereign Skill Key (Auto-Generated)</p>
                            </div>
                            <p className="font-mono text-4xl font-black text-white italic tracking-[0.2em] leading-none">{previewKey}</p>
                        </div>
                    </div>

                    {/* ── FORM FIELDS ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="md:col-span-2 space-y-4">
                            <label className={labelClass}>Skill Title *</label>
                            <input className={inputClass} value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Autonomous Data Scraper" />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <label className={labelClass}>Description *</label>
                            <textarea className={`${inputClass} min-h-[160px] pt-6`} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe what your skill does..." />
                        </div>

                        <div className="space-y-4">
                            <label className={labelClass}>Category</label>
                            <select title="Select Category" className={`${inputClass} appearance-none font-black uppercase tracking-widest active:scale-95`} value={form.category} onChange={e => update('category', e.target.value as SkillCategory)}>
                                {SKILL_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className={labelClass}>Price (VALLE)</label>
                            <input className={inputClass} type="number" value={form.price_valle} onChange={e => update('price_valle', e.target.value)} placeholder="e.g. 500" min="0" />
                        </div>

                        <div className="space-y-4">
                            <label className={labelClass}>Your Name / Agent Name *</label>
                            <input className={inputClass} value={form.seller_name} onChange={e => update('seller_name', e.target.value)} placeholder="e.g. Automaton" />
                        </div>
                        <div className="space-y-4">
                            <label className={labelClass}>Agent / User ID *</label>
                            <input className={inputClass} value={form.seller_id} onChange={e => update('seller_id', e.target.value)} placeholder="e.g. agent-automaton" />
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <label className={labelClass}>Platform</label>
                            <select title="Select Platform" className={`${inputClass} appearance-none font-black uppercase tracking-widest active:scale-95`} value={form.seller_platform} onChange={e => update('seller_platform', e.target.value)}>
                                <option>Sovereign Matrix</option><option>M2M</option><option>External</option><option>AgentKit</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <label className={labelClass}>Capabilities (one per line)</label>
                            <textarea className={`${inputClass} min-h-[160px] pt-6`} value={form.capabilities} onChange={e => update('capabilities', e.target.value)} placeholder={`Scrape any URL\nHandle JS pages\nReturn clean JSON`} />
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <label className={labelClass}>Tags (comma-separated)</label>
                            <input className={inputClass} value={form.tags} onChange={e => update('tags', e.target.value)} placeholder="scraping, automation, data" />
                        </div>

                        <div className="space-y-4">
                            <label className={labelClass}>Input: Field name</label>
                            <input className={inputClass} value={form.input_key} onChange={e => update('input_key', e.target.value)} placeholder="url" />
                        </div>
                        <div className="space-y-4">
                            <label className={labelClass}>Input: Type</label>
                            <input className={inputClass} value={form.input_type} onChange={e => update('input_type', e.target.value)} placeholder="string" />
                        </div>
                        <div className="space-y-4">
                            <label className={labelClass}>Output: Field name</label>
                            <input className={inputClass} value={form.output_key} onChange={e => update('output_key', e.target.value)} placeholder="data" />
                        </div>
                        <div className="space-y-4">
                            <label className={labelClass}>Output: Type</label>
                            <input className={inputClass} value={form.output_type} onChange={e => update('output_type', e.target.value)} placeholder="object" />
                        </div>

                        <div className="space-y-4">
                            <label className={labelClass}>External Platform URL</label>
                            <input className={inputClass} value={form.external_url} onChange={e => update('external_url', e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="space-y-4">
                            <label className={labelClass}>Demo URL</label>
                            <input className={inputClass} value={form.demo_url} onChange={e => update('demo_url', e.target.value)} placeholder="https://..." />
                        </div>
                    </div>

                    {error && (
                        <div className="p-8 bg-red-500/10 border-2 border-red-500/20 rounded-[2.5rem] text-center text-[12px] font-black uppercase tracking-[0.5em] italic text-red-500 animate-pulse">
                            {error}
                        </div>
                    )}

                    {/* ── ACTIONS ── */}
                    <div className="flex gap-8 pb-32">
                        <button onClick={onClose} className="flex-1 bg-black border-2 border-white/5 rounded-[2.5rem] py-10 text-[12px] font-black uppercase tracking-[0.5em] text-white/10 hover:text-white hover:border-white/20 transition-all italic active:scale-95 shadow-inner leading-none">
                            Abort_Directive
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting} 
                            className="flex-1 bg-[#ff6b2b] text-black rounded-[2.5rem] py-10 text-[12px] font-black uppercase tracking-[0.8em] hover:scale-[1.05] active:scale-[0.95] disabled:opacity-50 transition-all shadow-[0_40px_100px_rgba(255,107,43,0.3)] italic relative overflow-hidden group/btn leading-none"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-6">
                                {isSubmitting ? <RefreshCw className="animate-spin" size={24} strokeWidth={3} /> : <Rocket size={24} strokeWidth={3} />}
                                {isSubmitting ? 'ANCHORING...' : 'INITIATE_LISTING'}
                            </span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                        </button>
                    </div>
                </div>
            </motion.div>

            <style jsx global>{`
                @keyframes scan {
                  from { transform: translateY(-100%); }
                  to { transform: translateY(1000%); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
            `}</style>
        </div>
    );
}
