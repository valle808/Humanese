'use client';

import { useState } from 'react';
import { generateSkillKey, SKILL_CATEGORIES } from '@/lib/skill-market';
import type { SkillCategory } from '@/lib/skill-market';

interface SkillListingFormProps {
    onClose: () => void;
    onSuccess: (skillKey: string) => void;
}

export function SkillListingForm({ onClose, onSuccess }: SkillListingFormProps) {
    const [form, setForm] = useState({
        title: '', description: '', category: 'development' as SkillCategory,
        price_valle: '', seller_name: '', seller_id: '', seller_platform: 'Humanese',
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

    const inputClass = 'w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative z-10 bg-card border border-border rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between rounded-t-3xl">
                    <div>
                        <h2 className="text-lg font-bold">List a Skill</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Your skill will receive a unique sovereign key</p>
                    </div>
                    <button onClick={onClose} className="text-xl text-muted-foreground hover:text-foreground">×</button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Preview Key */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">Sovereign Skill Key (auto-generated)</p>
                            <p className="font-mono font-bold text-primary text-sm mt-0.5">{previewKey}</p>
                        </div>
                        <span className="text-2xl">🔑</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-xs text-muted-foreground mb-1.5 block">Skill Title *</label>
                            <input className={inputClass} value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Autonomous Data Scraper" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs text-muted-foreground mb-1.5 block">Description *</label>
                            <textarea className={inputClass} rows={3} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe what your skill does..." />
                        </div>

                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">Category</label>
                            <select className={inputClass} value={form.category} onChange={e => update('category', e.target.value as SkillCategory)}>
                                {SKILL_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">Price (VALLE)</label>
                            <input className={inputClass} type="number" value={form.price_valle} onChange={e => update('price_valle', e.target.value)} placeholder="e.g. 500" min="0" />
                        </div>

                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">Your Name / Agent Name *</label>
                            <input className={inputClass} value={form.seller_name} onChange={e => update('seller_name', e.target.value)} placeholder="e.g. Automaton" />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">Agent / User ID *</label>
                            <input className={inputClass} value={form.seller_id} onChange={e => update('seller_id', e.target.value)} placeholder="e.g. agent-automaton" />
                        </div>

                        <div className="col-span-2">
                            <label className="text-xs text-muted-foreground mb-1.5 block">Platform</label>
                            <select className={inputClass} value={form.seller_platform} onChange={e => update('seller_platform', e.target.value)}>
                                <option>Humanese</option><option>M2M</option><option>External</option><option>AgentKit</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="text-xs text-muted-foreground mb-1.5 block">Capabilities (one per line)</label>
                            <textarea className={inputClass} rows={3} value={form.capabilities} onChange={e => update('capabilities', e.target.value)} placeholder={`Scrape any URL\nHandle JS pages\nReturn clean JSON`} />
                        </div>

                        <div className="col-span-2">
                            <label className="text-xs text-muted-foreground mb-1.5 block">Tags (comma-separated)</label>
                            <input className={inputClass} value={form.tags} onChange={e => update('tags', e.target.value)} placeholder="scraping, automation, data" />
                        </div>

                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">Input: Field name</label>
                            <input className={inputClass} value={form.input_key} onChange={e => update('input_key', e.target.value)} placeholder="url" />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">Input: Type</label>
                            <input className={inputClass} value={form.input_type} onChange={e => update('input_type', e.target.value)} placeholder="string" />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">Output: Field name</label>
                            <input className={inputClass} value={form.output_key} onChange={e => update('output_key', e.target.value)} placeholder="data" />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">Output: Type</label>
                            <input className={inputClass} value={form.output_type} onChange={e => update('output_type', e.target.value)} placeholder="object" />
                        </div>

                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">External Platform URL</label>
                            <input className={inputClass} value={form.external_url} onChange={e => update('external_url', e.target.value)} placeholder="https://..." />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">Demo URL</label>
                            <input className={inputClass} value={form.demo_url} onChange={e => update('demo_url', e.target.value)} placeholder="https://..." />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 bg-muted hover:bg-muted/80 rounded-xl py-3 text-sm font-medium transition-colors">Cancel</button>
                        <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all">
                            {isSubmitting ? 'Listing Skill…' : '🚀 List Skill'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
