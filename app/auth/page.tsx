'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Cpu, 
  Bot, 
  Building2, 
  Banknote, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Mail, 
  Lock, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ENTITIES = [
  { id: 'human', label: 'Human', icon: User, desc: 'Biometric & Sovereign Identity', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'iot', label: 'Machine/IoT', icon: Cpu, desc: 'HWID & M2M Pacts', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'agent', label: 'AI Agent', icon: Bot, desc: 'Proof-of-Agency Contracts', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'corporation', label: 'Corporation', icon: Building2, desc: 'LEI & Multi-Sig Vaults', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'fi', label: 'Financial Institution', icon: Banknote, desc: 'Regulatory Licensed Node', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
];

type AuthMode = 'login' | 'register';
type AuthStep = 'mode' | 'entity' | 'credentials' | 'verification' | 'success';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [step, setStep] = useState<AuthStep>('mode');
  const [selectedEntity, setSelectedEntity] = useState(ENTITIES[0]);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    name: '', 
    phone: '', 
    token: '', 
    useHumaneseEmail: false,
    customUsername: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-switch to credentials step if in login mode
  useEffect(() => {
    if (mode === 'login' && step === 'mode') {
      setStep('credentials');
    }
  }, [mode, step]);

  const handleEntitySelect = (entity: typeof ENTITIES[0]) => {
    setSelectedEntity(entity);
    setStep('credentials');
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const finalEmail = formData.useHumaneseEmail 
      ? `${formData.customUsername}@humanese.net` 
      : formData.email;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          email: finalEmail,
          entityType: selectedEntity.id
        })
      });

      const data = await res.json();
      if (res.ok) {
        if (mode === 'register') {
          setSuccessMsg(data.msg);
          setStep('verification');
        } else {
          // Login success: tokens are in data.session
          localStorage.setItem('humanese_session', JSON.stringify(data.session));
          setStep('success');
          setTimeout(() => router.push('/'), 2000);
        }
      } else {
        setError(data.error);
        if (data.code === 'EMAIL_NOT_CONFIRMED') {
          setStep('verification');
        }
      }
    } catch (err) {
      setError('Connection to Sovereignty Matrix lost. Internal endpoint error.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.useHumaneseEmail ? `${formData.customUsername}@humanese.net` : formData.email,
          token: formData.token,
          type: 'signup'
        })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('humanese_session', JSON.stringify(data.session));
        setStep('success');
        setTimeout(() => router.push('/'), 2000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      
      {/* 🌌 AMBIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay dark:opacity-[0.05]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* BRAND & HEADER */}
        <div className="flex flex-col items-center mb-10 space-y-4">
          <Link href="/" className="w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center group transform transition-transform hover:rotate-6">
            <ShieldCheck size={32} className="text-white dark:text-black" />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-foreground">Sovereign Portal</h1>
            <p className="text-[10px] font-bold tracking-[0.4em] text-muted-foreground uppercase mt-1 flex items-center justify-center gap-2">
              <Globe size={12} className="text-primary animate-pulse" /> Unified UXL Interface
            </p>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-card/50 dark:bg-card/30 backdrop-blur-3xl border border-border/50 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden relative">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 0: MODE SELECTION */}
            {step === 'mode' && (
              <motion.div key="mode" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-6 text-center py-4">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Initialize Access</h2>
                <p className="text-sm text-muted-foreground">Choose your pathway into the Humanese Sovereign Ecosystem.</p>
                
                <div className="grid grid-cols-1 gap-4 pt-4">
                  <button 
                    onClick={() => { setMode('login'); setStep('credentials'); }}
                    className="p-6 bg-white/5 dark:bg-white/5 light:bg-black/5 hover:bg-primary/10 border border-border rounded-2xl flex items-center justify-between group transition-all"
                  >
                    <div className="text-left">
                      <div className="font-black uppercase tracking-widest text-lg">Returning User</div>
                      <div className="text-xs text-muted-foreground">Restore existing identity presence</div>
                    </div>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button 
                    onClick={() => { setMode('register'); setStep('entity'); }}
                    className="p-6 bg-primary/10 border border-primary/30 hover:border-primary/60 rounded-2xl flex items-center justify-between group transition-all"
                  >
                    <div className="text-left">
                      <div className="font-black uppercase tracking-widest text-lg">New Entity</div>
                      <div className="text-xs text-muted-foreground">Anchor a new identity in the ledger</div>
                    </div>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform text-primary" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 1: ENTITY SELECTION */}
            {step === 'entity' && (
              <motion.div key="entity" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex items-center gap-4">
                  <button onClick={() => setStep('mode')} className="p-2 hover:bg-muted rounded-full transition-colors"><ArrowRight className="rotate-180" size={20} /></button>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Select Entity Type</h2>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {ENTITIES.map((entity) => (
                    <button
                      key={entity.id}
                      onClick={() => handleEntitySelect(entity)}
                      className="group flex items-center gap-4 p-4 bg-white/5 dark:bg-black/20 border border-border rounded-2xl hover:border-primary/50 transition-all text-left"
                    >
                      <div className={`p-3 rounded-xl ${entity.bg} ${entity.color} group-hover:scale-110 transition-transform`}><entity.icon size={24} /></div>
                      <div>
                        <div className="text-sm font-bold uppercase tracking-wider">{entity.label}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-mono">{entity.desc}</div>
                      </div>
                      <ArrowRight size={18} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: CREDENTIALS (LOGIN / REGISTER) */}
            {step === 'credentials' && (
              <motion.div key="credentials" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {mode === 'register' ? (
                      <button onClick={() => setStep('entity')} className="p-2 hover:bg-muted rounded-full transition-colors"><ArrowRight className="rotate-180" size={18} /></button>
                    ) : (
                      <button onClick={() => { setMode('register'); setStep('mode'); }} className="p-2 hover:bg-muted rounded-full transition-colors"><ArrowRight className="rotate-180" size={18} /></button>
                    )}
                    <h2 className="text-xl font-black uppercase">{mode === 'login' ? 'Nexus Login' : 'Register Identity'}</h2>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${selectedEntity.bg} ${selectedEntity.color}`}>{selectedEntity.label}</div>
                </div>

                <form onSubmit={handleAuthAction} className="space-y-5">
                  <div className="space-y-4">
                    
                    {/* Name Field (Register Only) */}
                    {mode === 'register' && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><User size={12}/> Legal Name / Agent Identifier</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-input/20 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono" placeholder="e.g. John Doe / Sentinel-01"/>
                      </div>
                    )}

                    {/* Email Selection System */}
                    <div className="space-y-3">
                      {mode === 'register' && (
                        <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-xl">
                          <button type="button" onClick={() => setFormData({...formData, useHumaneseEmail: false})} className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${!formData.useHumaneseEmail ? 'bg-primary text-white dark:text-black shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>External Email</button>
                          <button type="button" onClick={() => setFormData({...formData, useHumaneseEmail: true})} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-2 ${formData.useHumaneseEmail ? 'bg-primary text-white dark:text-black shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}><Globe size={11}/> @humanese.net</button>
                        </div>
                      )}

                      {formData.useHumaneseEmail ? (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Choose Ecosystem Username</label>
                          <div className="relative">
                            <input required type="text" value={formData.customUsername} onChange={e => setFormData({...formData, customUsername: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})} className="w-full bg-input/20 border border-border rounded-xl pl-4 pr-32 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono" placeholder="username"/>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary font-mono select-none">@humanese.net</div>
                          </div>
                          <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">Your sovereign inbox will be provisioned instantly.</p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Mail size={12}/> {mode === 'login' ? 'Identity Email' : 'Verification Email'}</label>
                          <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-input/20 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono" placeholder="user@example.com"/>
                        </div>
                      )}
                    </div>

                    {/* Phone Number (Optional but encouraged for verify) */}
                    {mode === 'register' && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Smartphone size={12}/> Phone Verification (+E.164)</label>
                        <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-input/20 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono" placeholder="+1234567890"/>
                      </div>
                    )}

                    {/* Passphrase */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Lock size={12}/> {mode === 'login' ? 'Sovereign Passphrase' : 'New Access Token'}</label>
                      <div className="relative">
                        <input 
                          required 
                          type={showPassword ? 'text' : 'password'} 
                          value={formData.password} 
                          onChange={e => setFormData({...formData, password: e.target.value})} 
                          className="w-full bg-input/20 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono pr-12" 
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-2">
                      <AlertCircle size={14}/> {error}
                    </motion.div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-primary text-white dark:text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18}/> : mode === 'login' ? 'Sync Matrix' : 'Establish Identity'}
                  </button>

                  <div className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground pt-2">
                    {mode === 'login' ? (
                      <p>New to the network? <button type="button" onClick={() => { setMode('register'); setStep('entity'); }} className="text-primary hover:underline">Register Entity</button></p>
                    ) : (
                      <p>Already anchored? <button type="button" onClick={() => { setMode('login'); setStep('credentials'); }} className="text-primary hover:underline">Restore Presence</button></p>
                    )}
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 3: OTP VERIFICATION */}
            {step === 'verification' && (
              <motion.div key="verification" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                   <Mail size={32} className="text-primary animate-bounce"/>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase">Verify Identity</h2>
                  <p className="text-sm text-muted-foreground">
                    A 6-digit synchronization code was sent to <br/>
                    <span className="text-foreground font-mono font-bold">{formData.useHumaneseEmail ? `${formData.customUsername}@humanese.net` : formData.email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="flex justify-center gap-3">
                    <input 
                      required
                      type="text"
                      maxLength={6}
                      value={formData.token}
                      onChange={e => setFormData({...formData, token: e.target.value.replace(/\D/g, '')})}
                      className="w-48 text-center bg-input/20 border-2 border-border focus:border-primary rounded-xl py-4 text-2xl font-black tracking-[0.3em] outline-none transition-all font-mono"
                      placeholder="000000"
                    />
                  </div>

                  {error && (
                    <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{error}</div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading || formData.token.length < 6}
                    className="w-full py-4 bg-primary text-white dark:text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18}/> : 'Verify & Activate'}
                  </button>

                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    Didn't receive a signal? <button type="button" onClick={() => handleAuthAction({ preventDefault: () => {} } as any)} className="text-primary hover:underline">Resend Code</button>
                  </p>
                </form>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center py-10">
                <div className="relative">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                    className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-primary/40"
                  >
                    <CheckCircle2 size={48} className="text-white dark:text-black" />
                  </motion.div>
                  <div className="absolute inset-0 bg-primary/20 blur-[60px] animate-pulse rounded-full" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl font-black uppercase tracking-tight">Identity Synchronized</h2>
                  <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest">Welcome to the Living Intelligence Network.</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-primary" size={24}/>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Establishing secure workspace...</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center">
            <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 transition-opacity hover:opacity-100">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Privacy</Link>
              <Link href="/legal" className="hover:text-primary transition-colors">Digital Constitution</Link>
              <Link href="/faq" className="hover:text-primary transition-colors">Node Support</Link>
            </div>
            <p className="text-[8px] font-mono text-muted-foreground tracking-widest uppercase opacity-20 mt-6 select-none">
              Nexus Matrix Integration Layer v7.0.0-OMEGA · Signed by Gio Bastidas
            </p>
        </div>
      </motion.div>
    </div>
  );
}
