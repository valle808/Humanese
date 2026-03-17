'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Cpu, 
  Bot, 
  Building2, 
  Banknote, 
  ArrowRight, 
  ShieldCheck, 
  Fingerprint,
  Zap,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ENTITIES = [
  { id: 'human', label: 'Human', icon: User, desc: 'Biometric & Coinbase Identity', color: 'text-emerald', bg: 'bg-emerald/10' },
  { id: 'iot', label: 'Machine/IoT', icon: Cpu, desc: 'HWID & M2M Pacts', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'agent', label: 'AI Agent', icon: Bot, desc: 'Proof-of-Agency Contracts', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'corporation', label: 'Corporation', icon: Building2, desc: 'LEI & Multi-Sig Vaults', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'fi', label: 'Financial Institution', icon: Banknote, desc: 'Regulatory Licensed Node', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
];

export default function AuthPage() {
  const [step, setStep] = useState(1); // 1: Choose Entity, 2: Credentials
  const [selectedEntity, setSelectedEntity] = useState(ENTITIES[0]);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', identityValue: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ msg?: string; error?: string } | null>(null);

  const handleEntitySelect = (entity: typeof ENTITIES[0]) => {
    setSelectedEntity(entity);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const identityData: any = {};
    if (selectedEntity.id === 'human') identityData.oauthProvider = 'coinbase';
    if (selectedEntity.id === 'iot') identityData.hwid = formData.identityValue || 'UXL-HWID-AUTO-' + Date.now();
    if (selectedEntity.id === 'agent') identityData.agencyContract = formData.identityValue || 'POAC-' + Math.random().toString(36).substring(7).toUpperCase();
    if (selectedEntity.id === 'corporation') identityData.legalEntityIdentifier = formData.identityValue || 'LEI-' + Math.random().toString(36).substring(7).toUpperCase();
    if (selectedEntity.id === 'fi') identityData.licenseId = formData.identityValue || 'LIC-' + Math.random().toString(36).substring(7).toUpperCase();

    try {
      const res = await fetch('/api/auth/polymorphic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          entityType: selectedEntity.id,
          identityData
        })
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ msg: data.msg });
        // In a real app, redirect or store token
      } else {
        setResult({ error: data.error });
      }
    } catch (err) {
      setResult({ error: 'Nexus connection failed. Check matrix status.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* 🌌 AMBIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" 
        />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-xl"
      >
        {/* BRAND */}
        <div className="flex flex-col items-center mb-12 space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl shadow-[0_0_40px_rgba(0,255,65,0.2)] flex items-center justify-center font-black text-black text-2xl">
            H
          </div>
          <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-foreground">Nexus Gateway</h1>
          <div className="text-[10px] font-bold tracking-[0.4em] text-muted-foreground uppercase flex items-center gap-2">
            <ShieldCheck size={12} className="text-primary" /> UXL Sovereign Integration
          </div>
        </div>

        <div className="bg-card/40 border border-border rounded-[2.5rem] p-8 md:p-12 backdrop-blur-3xl shadow-2xl relative">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic">Initialize Identity</h2>
                  <p className="text-sm text-muted-foreground font-mono">Select your entity type to anchor in the Sovereign Ledger.</p>
                </div>

                <div className="space-y-3">
                  {ENTITIES.map((entity) => (
                    <button
                      key={entity.id}
                      onClick={() => handleEntitySelect(entity)}
                      className="w-full group flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/40 hover:bg-white/[0.08] transition-all text-left"
                    >
                      <div className={`p-3 rounded-xl ${entity.bg} ${entity.color} group-hover:scale-110 transition-transform`}>
                        <entity.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold uppercase tracking-wider">{entity.label}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{entity.desc}</div>
                      </div>
                      <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-2">
                  <button onClick={() => setStep(1)} className="p-2 hover:bg-white/5 rounded-full transition-colors" title="Back to Entity Selection">
                    <ArrowRight className="rotate-180" size={20} />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedEntity.bg} ${selectedEntity.color}`}>
                      <selectedEntity.icon size={20} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest">{selectedEntity.label} Verification</span>
                  </div>
                </div>

                {result?.msg ? (
                  <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl text-center space-y-4">
                    <Zap className="h-10 w-10 text-primary mx-auto animate-pulse" />
                    <h3 className="text-xl font-bold uppercase tracking-tighter">Identity Anchored</h3>
                    <p className="text-sm text-foreground/70">{result.msg}</p>
                    <Link href="/" className="inline-block mt-4 text-xs font-black uppercase tracking-widest text-primary hover:underline">
                      Enter Neural Core
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sovereign Email</label>
                        <input 
                          required
                          type="email"
                          placeholder="entity@humanese.nexus"
                          className="w-full bg-black/40 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all font-mono"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Passphrase</label>
                        <input 
                          required
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-black/40 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all font-mono"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>
                      {selectedEntity.id !== 'human' && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            {selectedEntity.id === 'iot' ? 'Hardware ID (HWID)' : 
                             selectedEntity.id === 'agent' ? 'Agency Contract Hash' : 
                             selectedEntity.id === 'corporation' ? 'Legal Entity Identifier (LEI)' : 'Regal License ID'}
                          </label>
                          <input 
                            required
                            placeholder="Enter verification value..."
                            className="w-full bg-black/40 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all font-mono"
                            value={formData.identityValue}
                            onChange={(e) => setFormData({ ...formData, identityValue: e.target.value })}
                          />
                        </div>
                      )}
                    </div>

                    {result?.error && (
                      <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">
                        ⚠️ nexus breach: {result.error}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-6 rounded-2xl bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(0,255,65,0.2)] disabled:opacity-50"
                    >
                      {loading ? 'Synthesizing...' : 'Anchor Identity'}
                    </Button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            <Link href="/about" className="hover:text-primary transition-colors">Architecture</Link>
            <Link href="/legal" className="hover:text-primary transition-colors">Legal Framework</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Covenant</Link>
          </div>
          <p className="text-[8px] font-mono text-muted-foreground tracking-widest uppercase opacity-30">
            Sovereign Protocol v4.1 · Universal Exchange Layer (UXL)
          </p>
        </div>
      </motion.div>
    </div>
  );
}
