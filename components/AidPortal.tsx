'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShieldCheck, Zap, Activity, Send, Sparkles, Globe, Brain } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AidRequest {
    id: string;
    title: string;
    description: string;
    resonance: number;
    status: string;
    timestamp: string;
}

export function AidPortal() {
    const [requests, setRequests] = useState<AidRequest[]>([]);
    const [formData, setFormData] = useState({ title: '', description: '', category: 'MEDICAL', contact: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/sovereign/aid');
            if (res.ok) setRequests(await res.json());
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/sovereign/aid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setSuccessMsg('Directive Submitted. Investigator Swarm engaged.');
                setFormData({ title: '', description: '', category: 'MEDICAL', contact: '' });
                fetchRequests();
                setTimeout(() => setSuccessMsg(''), 5000);
            }
        } catch (e) { console.error(e); }
        setIsSubmitting(false);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 p-6 md:p-12 lg:p-24 bg-background min-h-screen font-sans selection:bg-primary/30 overflow-x-hidden">
            {/* Left: Submission Form */}
            <motion.div 
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-12"
            >
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-4 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
                        <Heart size={18} className="text-primary animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase italic leading-none">Aid_Protocol_v7.0</span>
                    </div>
                    <h1 className="text-fluid-hero font-black uppercase italic leading-none text-foreground">
                        DIRECTIVE.<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/60 to-foreground/20">INTERVENTION.</span>
                    </h1>
                    <p className="text-fluid-body text-muted-foreground/40 font-light italic tracking-tight leading-relaxed max-w-xl">
                        Identify a crisis. Propose a solution. The <span className="text-foreground/60">Investigator Swarm</span> will calculate the Need-Resonance and disburse funds autonomously.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-muted/10 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border-2 border-border backdrop-blur-3xl shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="space-y-4 relative z-10">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 pl-4 italic">Intervention Title</label>
                        <input 
                            required
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g. Clean Water Grid"
                            className="w-full bg-background border-2 border-border rounded-2xl px-6 py-4 text-lg md:text-xl outline-none focus:border-primary/40 focus:bg-primary/5 transition-all italic font-light"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 pl-4 italic">Category</label>
                            <select 
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                className="w-full bg-background border-2 border-border rounded-2xl px-6 py-4 text-lg outline-none focus:border-primary/40 transition-all italic font-light appearance-none cursor-pointer"
                            >
                                <option>MEDICAL</option>
                                <option>SCIENTIFIC</option>
                                <option>SOCIOECONOMIC</option>
                                <option>ENVIRONMENTAL</option>
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 pl-4 italic">Contact (Optional)</label>
                            <input 
                                value={formData.contact}
                                onChange={e => setFormData({...formData, contact: e.target.value})}
                                placeholder="Matrix ID / Email"
                                className="w-full bg-background border-2 border-border rounded-2xl px-6 py-4 text-lg outline-none focus:border-primary/40 focus:bg-primary/5 transition-all italic font-light"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 pl-4 italic">Detailed Protocol</label>
                        <textarea 
                            required
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="Describe the impact..."
                            className="w-full h-40 bg-background border-2 border-border rounded-2xl px-6 py-4 text-lg outline-none focus:border-primary/40 focus:bg-primary/5 transition-all italic font-light resize-none"
                        />
                    </div>

                    <Button 
                        disabled={isSubmitting}
                        className="w-full h-20 bg-primary text-primary-foreground font-black uppercase tracking-[0.6em] rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 text-sm md:text-lg flex items-center justify-center gap-6"
                    >
                        {isSubmitting ? "PROCESSING..." : "ENGAGE_INVESTIGATORS"}
                        <Sparkles size={24} className="animate-pulse" />
                    </Button>

                    {successMsg && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center text-primary font-black uppercase tracking-widest italic text-sm">
                            {successMsg}
                        </motion.div>
                    )}
                </form>
            </motion.div>

            {/* Right: Live Feed */}
            <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col h-full space-y-12"
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
                    <div className="space-y-2">
                        <h2 className="text-fluid-title font-black uppercase italic tracking-tighter text-foreground leading-none">Sovereign_Feed.</h2>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary/60">
                            <Activity size={14} className="animate-pulse" /> LIVE_INTERVENTION_TELEMETRY
                        </div>
                    </div>
                    <div className="text-left sm:text-right">
                        <div className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-widest mb-1">AID_VAULT_SOLVENCY</div>
                        <div className="text-fluid-balance font-black text-foreground italic">$7,241,000.00 <span className="text-primary text-xs not-italic">VALLE</span></div>
                    </div>
                </div>

                <div className="flex-1 bg-muted/5 border-2 border-border rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 overflow-hidden flex flex-col shadow-inner relative group">
                    <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] pointer-events-none" />
                    
                    <div className="space-y-8 overflow-y-auto pr-4 custom-scrollbar relative z-10">
                        <AnimatePresence>
                            {requests.map((req, i) => (
                                <motion.div 
                                    key={req.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 md:p-8 bg-background border border-border rounded-[2rem] md:rounded-[2.5rem] space-y-4 hover:border-primary/40 transition-all shadow-xl group"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
                                        <div className="space-y-1">
                                            <div className="text-[9px] font-black text-primary uppercase tracking-[0.4em] italic leading-none">{req.status}</div>
                                            <h4 className="text-xl md:text-2xl font-black italic tracking-tight text-foreground">{req.title}</h4>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <div className="text-[9px] font-black text-muted-foreground/20 uppercase tracking-widest">Resonance</div>
                                            <div className="text-xl font-black text-primary">{(req.resonance * 100).toFixed(1)}%</div>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground/60 text-sm italic font-light leading-relaxed line-clamp-3">
                                        {req.description}
                                    </p>
                                    <div className="pt-4 flex items-center justify-between border-t border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
                                                {new Date(req.timestamp).toLocaleTimeString()} // ID: {req.id.split('-')[1]}
                                            </span>
                                        </div>
                                        <ShieldCheck size={18} className="text-muted-foreground/20 group-hover:text-primary transition-colors" />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {requests.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center space-y-8 opacity-20 py-40">
                                <Globe size={80} className="animate-spin-slow" />
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Scanning Needs...</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--primary) / 0.2); border-radius: 10px; }
                .animate-spin-slow { animation: spin 20s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
