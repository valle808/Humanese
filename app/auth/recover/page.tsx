'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Mail, 
  Smartphone, 
  KeyRound, 
  ArrowRight,
  ChevronLeft,
  AlertCircle,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

type RecoveryMethod = 'email' | 'phone' | 'phrase' | null;

export default function RecoverPage() {
  const [method, setMethod] = useState<RecoveryMethod>(null);
  const [identifier, setIdentifier] = useState('');
  const [phrase, setPhrase] = useState(Array(12).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePhraseChange = (index: number, value: string) => {
    const newPhrase = [...phrase];
    newPhrase[index] = value.toLowerCase().trim();
    setPhrase(newPhrase);
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = method === 'phrase' 
        ? { method: 'phrase', phrase: phrase.join(' ') }
        : { method, identifier };

      const res = await fetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Recovery protocol failed.');
      }
    } catch (err) {
      setError('Connection to Sovereignty Matrix lost.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-[#ff6b2b]/40 font-sans overflow-hidden flex flex-col items-center justify-center p-6 lg:p-12">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        className="relative z-10 w-full max-w-2xl flex flex-col items-center"
      >
        {/* BRAND & HEADER */}
        <div className="flex flex-col items-center mb-12 space-y-6">
          <div className="w-20 h-20 bg-background border border-[#ff6b2b]/40 rounded-[1.5rem] shadow-[0_20px_40px_rgba(255,107,43,0.1)] flex items-center justify-center group">
            <KeyRound size={40} className="text-[#ff6b2b]" strokeWidth={2.5} />
          </div>
          <div className="text-center space-y-3">
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none text-foreground">
              Recovery<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b2b] to-[#ff6b2b]/40">Protocol.</span>
            </h1>
          </div>
        </div>

        {/* MAIN RECOVERY CARD */}
        <div className="w-full bg-secondary/20 backdrop-blur-3xl border border-border rounded-[3rem] p-8 lg:p-12 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent shadow-[0_0_10px_#ff6b2b]" />
          
          <AnimatePresence mode="wait">
            
            {success ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-center py-10">
                <div className="mx-auto w-24 h-24 bg-[#ff6b2b]/10 rounded-full flex items-center justify-center border border-[#ff6b2b]/30">
                  <CheckCircle2 size={40} className="text-[#ff6b2b]" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black italic uppercase tracking-tight">Recovery Initiated</h2>
                  <p className="text-muted-foreground italic">Follow the instructions sent to your recovery channel to restore access to the Swarm.</p>
                </div>
                <Link href="/auth" className="inline-flex items-center gap-3 px-8 py-4 bg-background border border-border rounded-full hover:border-[#ff6b2b]/40 transition-all italic font-black uppercase tracking-[0.3em] text-[10px]">
                  <ChevronLeft size={16} /> Return to Login
                </Link>
              </motion.div>
            ) : method === null ? (
              <motion.div key="select" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8 py-4">
                <div className="flex items-center gap-4">
                  <Link href="/auth" className="w-12 h-12 bg-secondary border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                    <ChevronLeft size={24} />
                  </Link>
                  <h2 className="text-2xl font-black italic uppercase tracking-tight">Select Vector</h2>
                </div>
                
                <div className="grid gap-4">
                  <button onClick={() => setMethod('email')} className="flex items-center p-6 bg-background border border-border rounded-[2rem] hover:border-[#ff6b2b]/40 hover:bg-[#ff6b2b]/5 transition-all text-left gap-6 group">
                    <Mail className="text-muted-foreground group-hover:text-[#ff6b2b] transition-colors" size={28} />
                    <div>
                      <div className="font-black italic uppercase tracking-tight text-lg group-hover:text-[#ff6b2b] transition-colors">Standard Signal</div>
                      <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] italic">Recover via registered email</div>
                    </div>
                  </button>
                  
                  <button onClick={() => setMethod('phone')} className="flex items-center p-6 bg-background border border-border rounded-[2rem] hover:border-[#ff6b2b]/40 hover:bg-[#ff6b2b]/5 transition-all text-left gap-6 group">
                    <Smartphone className="text-muted-foreground group-hover:text-[#ff6b2b] transition-colors" size={28} />
                    <div>
                      <div className="font-black italic uppercase tracking-tight text-lg group-hover:text-[#ff6b2b] transition-colors">Mobile Uplink</div>
                      <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] italic">Recover via SMS OTP</div>
                    </div>
                  </button>

                  <button onClick={() => setMethod('phrase')} className="flex items-center p-6 bg-secondary/50 border border-[#ff6b2b]/20 rounded-[2rem] hover:border-[#ff6b2b]/60 hover:bg-[#ff6b2b]/10 transition-all text-left gap-6 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ff6b2b]" />
                    <ShieldCheck className="text-[#ff6b2b]" size={28} />
                    <div>
                      <div className="font-black italic uppercase tracking-tight text-lg text-[#ff6b2b]">Sovereign Override</div>
                      <div className="text-[10px] text-[#ff6b2b]/60 font-black uppercase tracking-[0.3em] italic">Force recovery via 12-word phrase</div>
                    </div>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                <div className="flex items-center gap-4">
                  <button onClick={() => setMethod(null)} className="w-12 h-12 bg-secondary border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                    <ChevronLeft size={24} />
                  </button>
                  <h2 className="text-2xl font-black italic uppercase tracking-tight">
                    {method === 'email' ? 'Standard Signal' : method === 'phone' ? 'Mobile Uplink' : 'Sovereign Override'}
                  </h2>
                </div>

                <form onSubmit={handleRecover} className="space-y-8">
                  {method === 'phrase' ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground italic mb-6">Enter your 12-word Sovereign Phrase exactly as it was generated during registration. This will forcefully reset your authentication credentials.</p>
                      <div className="grid grid-cols-3 gap-3">
                        {phrase.map((word, i) => (
                          <div key={i} className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-muted-foreground/40">{i + 1}</span>
                            <input 
                              type="text" 
                              required
                              value={word}
                              onChange={(e) => handlePhraseChange(i, e.target.value)}
                              className="w-full bg-background border border-border rounded-xl pl-8 pr-3 py-3 text-sm outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 font-mono text-[#ff6b2b]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground italic ml-4">
                        {method === 'email' ? 'Registered Email Address' : 'Registered Phone (+E.164)'}
                      </label>
                      <input 
                        type={method === 'email' ? 'email' : 'tel'} 
                        required 
                        value={identifier} 
                        onChange={e => setIdentifier(e.target.value)} 
                        className="w-full bg-background border border-border rounded-[2rem] px-6 py-5 text-lg outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 italic" 
                        placeholder={method === 'email' ? 'ENTITY@RESONANCE.NET' : '+1234567890'}
                      />
                    </div>
                  )}

                  {error && (
                    <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-[1.5rem] text-[10px] text-red-500 font-black uppercase tracking-[0.4em] flex items-center gap-4 italic">
                      <AlertCircle size={20} /> {error}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading || (method === 'phrase' && phrase.some(w => !w))}
                    className="w-full py-6 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.6em] text-[10px] rounded-[2rem] shadow-[0_20px_40px_rgba(255,107,43,0.2)] hover:scale-[1.02] transition-all disabled:opacity-30 flex items-center justify-center gap-4 italic"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={24} /> : <>Transmit Request <ArrowRight size={20} /></>}
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
