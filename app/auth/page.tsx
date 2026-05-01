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
  EyeOff,
  Radio,
  Wifi,
  Terminal,
  Orbit,
  ChevronLeft,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ENTITIES = [
  { id: 'human', label: 'Human', icon: User, desc: 'Biometric & Sovereign Identity', color: 'text-[#ff6b2b]', bg: 'bg-[#ff6b2b]/10' },
  { id: 'iot', label: 'Machine/IoT', icon: Cpu, desc: 'HWID & M2M Pacts', color: 'text-[#ff6b2b]', bg: 'bg-[#ff6b2b]/10' },
  { id: 'agent', label: 'AI Agent', icon: Bot, desc: 'Proof-of-Agency Contracts', color: 'text-[#ff6b2b]', bg: 'bg-[#ff6b2b]/10' },
  { id: 'corporation', label: 'Corporation', icon: Building2, desc: 'LEI & Multi-Sig Vaults', color: 'text-[#ff6b2b]', bg: 'bg-[#ff6b2b]/10' },
  { id: 'fi', label: 'Financial Institution', icon: Banknote, desc: 'Licensed Sovereign Node', color: 'text-[#ff6b2b]', bg: 'bg-[#ff6b2b]/10' },
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
    <div className="relative min-h-screen bg-background text-foreground selection:bg-[#ff6b2b]/40 font-sans overflow-hidden flex flex-col items-center justify-center p-6 lg:p-12">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full animate-pulse" />
        
        {/* Animated Scanning Lines */}
        <div className="absolute inset-0 opacity-[0.05]">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-1/4 animate-[scan_15s_linear_infinite]" />
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-3/4 animate-[scan_20s_linear_infinite_reverse]" />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        className="relative z-10 w-full max-w-2xl flex flex-col items-center"
      >
        {/* BRAND & HEADER */}
        <div className="flex flex-col items-center mb-12 space-y-6">
          <Link href="/" className="w-20 h-20 bg-[#ff6b2b] rounded-[1.5rem] shadow-[0_20px_40px_rgba(255,107,43,0.3)] flex items-center justify-center group active:scale-95 transition-all">
            <ShieldCheck size={40} className="text-black" strokeWidth={2.5} />
          </Link>
          <div className="text-center space-y-3">
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none">
              Sovereign<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-[#ff6b2b]/40">Portal.</span>
            </h1>
            <div className="flex items-center justify-center gap-4">
              <span className="text-[10px] font-black tracking-[0.5em] text-[#ff6b2b] uppercase flex items-center gap-2 italic leading-none animate-pulse">
                <Globe size={12} /> Unified UXL Interface
              </span>
            </div>
          </div>
        </div>

        {/* MAIN AUTH CARD */}
        <div className="w-full bg-secondary/20 backdrop-blur-3xl border border-border rounded-[3rem] p-8 lg:p-12 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent shadow-[0_0_10px_#ff6b2b]" />
          
          <AnimatePresence mode="wait">
            
            {/* STEP 0: MODE SELECTION */}
            {step === 'mode' && (
              <motion.div key="mode" initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }} className="space-y-10 py-2">
                <div className="space-y-3 text-center">
                  <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight italic leading-none text-foreground">Initialize Access_</h2>
                  <p className="text-lg text-muted-foreground font-light italic">Choose your trajectory into the OMEGA swarm.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-5 pt-2">
                  <button 
                    onClick={() => { setMode('login'); setStep('credentials'); }}
                    className="p-8 bg-background border border-border hover:border-[#ff6b2b]/40 rounded-[2rem] flex items-center justify-between group/opt transition-all shadow-sm overflow-hidden relative"
                  >
                    <div className="text-left space-y-1.5 relative z-10">
                      <div className="font-black uppercase tracking-[0.3em] text-xl italic leading-none text-foreground transition-colors">Returning User</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-[0.2em] italic font-black">Restore existing presence</div>
                    </div>
                    <ArrowRight className="group-hover/opt:translate-x-2 transition-all text-muted-foreground group-hover/opt:text-[#ff6b2b]" size={28} strokeWidth={2.5} />
                    <div className="absolute inset-0 bg-[#ff6b2b]/5 opacity-0 group-hover/opt:opacity-100 transition-opacity" />
                  </button>
                  <button 
                    onClick={() => { setMode('register'); setStep('entity'); }}
                    className="p-8 bg-[#ff6b2b] text-black border-2 border-[#ff6b2b] rounded-[2rem] flex items-center justify-between group/opt transition-all shadow-[0_20px_40px_rgba(255,107,43,0.2)] overflow-hidden relative"
                  >
                    <div className="text-left space-y-1.5 relative z-10">
                      <div className="font-black uppercase tracking-[0.3em] text-xl italic leading-none">New Entity</div>
                      <div className="text-xs uppercase tracking-[0.2em] italic font-black opacity-60">Anchor a new identity</div>
                    </div>
                    <ArrowRight className="group-hover/opt:translate-x-2 transition-all" size={28} strokeWidth={2.5} />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/opt:opacity-100 transition-opacity" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 1: ENTITY SELECTION */}
            {step === 'entity' && (
              <motion.div key="entity" initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }} className="space-y-8">
                <div className="flex items-center gap-5">
                  <button onClick={() => setStep('mode')} className="w-12 h-12 bg-secondary border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all active:scale-90"><ChevronLeft size={24} strokeWidth={2.5}/></button>
                  <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight italic leading-none text-foreground">Select Entity_</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {ENTITIES.map((entity) => (
                    <button
                      key={entity.id}
                      onClick={() => handleEntitySelect(entity)}
                      className="group flex items-center gap-6 p-6 bg-background border border-border rounded-[2rem] hover:border-[#ff6b2b]/40 hover:bg-[#ff6b2b]/5 transition-all text-left shadow-sm relative overflow-hidden"
                    >
                      <div className={`w-14 h-14 rounded-xl ${entity.bg} ${entity.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-[#ff6b2b]/10 group-hover:border-[#ff6b2b]/40`}>
                        <entity.icon size={28} strokeWidth={2.5} />
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-xl font-black uppercase tracking-tight italic leading-none text-foreground transition-colors">{entity.label}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black italic leading-none transition-colors">{entity.desc}</div>
                      </div>
                      <ArrowRight size={20} className="ml-auto opacity-0 group-hover:opacity-100 transition-all text-[#ff6b2b] group-hover:translate-x-2" strokeWidth={2.5} />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: CREDENTIALS */}
            {step === 'credentials' && (
              <motion.div key="credentials" initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }} className="space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    {mode === 'register' ? (
                      <button onClick={() => setStep('entity')} className="w-12 h-12 bg-secondary border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all active:scale-90"><ChevronLeft size={24} strokeWidth={2.5}/></button>
                    ) : (
                      <button onClick={() => { setMode('register'); setStep('mode'); }} className="w-12 h-12 bg-secondary border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all active:scale-90"><ChevronLeft size={24} strokeWidth={2.5}/></button>
                    )}
                    <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight italic leading-none text-foreground">{mode === 'login' ? 'Nexus Login_' : 'Establish ID_'}</h2>
                  </div>
                  <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic leading-none border shadow-sm ${selectedEntity.bg} ${selectedEntity.color} border-[#ff6b2b]/20`}>{selectedEntity.label}</div>
                </div>

                <form onSubmit={handleAuthAction} className="space-y-8">
                  <div className="space-y-6">
                    
                    {/* Name Field (Register Only) */}
                    {mode === 'register' && (
                      <div className="space-y-3 group/input">
                        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground italic ml-4 leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">Legal Identification / Agent ID</label>
                        <div className="relative">
                           <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-[#ff6b2b] transition-colors" />
                           <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-border rounded-[2rem] pl-16 pr-6 py-5 text-lg outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all italic text-foreground placeholder:text-muted-foreground/40 tracking-tight shadow-sm" placeholder="PRACTITIONER_IDENTITY"/>
                        </div>
                      </div>
                    )}

                    {/* Email Selection System */}
                    <div className="space-y-5">
                      {mode === 'register' && (
                        <div className="flex items-center gap-3 p-1.5 bg-background border border-border rounded-[2rem] shadow-sm">
                          <button type="button" onClick={() => setFormData({...formData, useHumaneseEmail: false})} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.3em] rounded-full transition-all italic ${!formData.useHumaneseEmail ? 'bg-[#ff6b2b] text-black shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>External Email</button>
                          <button type="button" onClick={() => setFormData({...formData, useHumaneseEmail: true})} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.3em] rounded-full transition-all flex items-center justify-center gap-2 italic ${formData.useHumaneseEmail ? 'bg-[#ff6b2b] text-black shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}><Globe size={14} strokeWidth={2.5}/> @humanese.net</button>
                        </div>
                      )}

                      {formData.useHumaneseEmail ? (
                        <div className="space-y-3 group/input">
                          <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground italic ml-4 leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">Choose Ecosystem Handle</label>
                          <div className="relative">
                            <input required type="text" value={formData.customUsername} onChange={e => setFormData({...formData, customUsername: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})} className="w-full bg-background border border-border rounded-[2rem] pl-6 pr-40 py-5 text-lg outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all font-mono italic text-foreground placeholder:text-muted-foreground/40 tracking-tight shadow-sm" placeholder="username"/>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-black text-[#ff6b2b] font-mono select-none tracking-tight">@humanese.net</div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 group/input">
                          <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground italic ml-4 leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">{mode === 'login' ? 'Identity Email' : 'Verification Email'}</label>
                          <div className="relative">
                            <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-[#ff6b2b] transition-colors" />
                            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-background border border-border rounded-[2rem] pl-16 pr-6 py-5 text-lg outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all italic text-foreground placeholder:text-muted-foreground/40 tracking-tight shadow-sm" placeholder="ENTITY@RESONANCE.NET"/>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phone Number (Optional) */}
                    {mode === 'register' && (
                      <div className="space-y-3 group/input">
                        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground italic ml-4 leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">Mobile Signal (+E.164)</label>
                        <div className="relative">
                           <Smartphone size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-[#ff6b2b] transition-colors" />
                           <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-background border border-border rounded-[2rem] pl-16 pr-6 py-5 text-lg outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all italic text-foreground placeholder:text-muted-foreground/40 tracking-tight shadow-sm" placeholder="+1234567890"/>
                        </div>
                      </div>
                    )}

                    {/* Passphrase */}
                    <div className="space-y-3 group/input">
                      <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground italic ml-4 leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">{mode === 'login' ? 'Sovereign Passphrase' : 'New Access Token'}</label>
                      <div className="relative">
                        <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-[#ff6b2b] transition-colors" />
                        <input 
                          required 
                          type={showPassword ? 'text' : 'password'} 
                          value={formData.password} 
                          onChange={e => setFormData({...formData, password: e.target.value})} 
                          className="w-full bg-background border border-border rounded-[2rem] pl-16 pr-16 py-5 text-lg outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all italic text-foreground placeholder:text-muted-foreground/40 tracking-tight shadow-sm" 
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all p-2 active:scale-90">
                          {showPassword ? <EyeOff size={20} strokeWidth={2.5}/> : <Eye size={20} strokeWidth={2.5}/>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-red-500/10 border border-red-500/20 rounded-[1.5rem] text-[10px] text-red-500 font-black uppercase tracking-[0.4em] flex items-center gap-4 italic shadow-sm">
                      <AlertCircle size={20} strokeWidth={2.5} className="shrink-0" /> {error}
                    </motion.div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-6 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.6em] text-[10px] rounded-[2rem] shadow-[0_20px_40px_rgba(255,107,43,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-4 italic overflow-hidden group/btn leading-none border-0"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={24} strokeWidth={2.5}/> : <span className="flex items-center gap-4">{mode === 'login' ? 'Sync Matrix' : 'Establish Identity'} <ArrowRight size={20} strokeWidth={2.5} /></span>}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                  </button>

                  <div className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground pt-2 italic leading-none">
                    {mode === 'login' ? (
                      <p>New to the swarm? <button type="button" onClick={() => { setMode('register'); setStep('entity'); }} className="text-[#ff6b2b] hover:underline">Register Entity</button></p>
                    ) : (
                      <p>Already anchored? <button type="button" onClick={() => { setMode('login'); setStep('credentials'); }} className="text-[#ff6b2b] hover:underline">Restore Presence</button></p>
                    )}
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 3: OTP VERIFICATION */}
            {step === 'verification' && (
              <motion.div key="verification" initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }} className="space-y-10 text-center py-6">
                <div className="w-24 h-24 bg-[#ff6b2b]/10 border border-[#ff6b2b]/30 rounded-full flex items-center justify-center mx-auto shadow-sm relative">
                   <Mail size={40} className="text-[#ff6b2b] animate-bounce" strokeWidth={2.5} />
                   <div className="absolute inset-0 bg-[#ff6b2b]/20 blur-[40px] rounded-full animate-pulse opacity-40" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight italic leading-none text-foreground">Verify Identity_</h2>
                  <p className="text-base text-muted-foreground font-light italic leading-relaxed">
                    A 6-digit synchronization code was sent to <br/>
                    <span className="text-[#ff6b2b] font-mono font-black">{formData.useHumaneseEmail ? `${formData.customUsername}@humanese.net` : formData.email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-8">
                  <div className="flex justify-center">
                    <input 
                      required
                      type="text"
                      maxLength={6}
                      value={formData.token}
                      onChange={e => setFormData({...formData, token: e.target.value.replace(/\D/g, '')})}
                      className="w-56 text-center bg-background border-2 border-border focus:border-[#ff6b2b]/50 rounded-[2rem] py-6 text-3xl font-black tracking-[0.4em] outline-none transition-all font-mono text-foreground shadow-sm pl-4"
                      placeholder="000000"
                    />
                  </div>

                  {error && (
                    <div className="text-[10px] text-red-500 font-black uppercase tracking-[0.6em] italic animate-pulse">{error}</div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading || formData.token.length < 6}
                    className="w-full py-6 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.6em] text-[10px] rounded-[2rem] shadow-[0_20px_40px_rgba(255,107,43,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center italic overflow-hidden group/btn leading-none border-0"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={24} strokeWidth={2.5}/> : 'Verify & Activate'}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                  </button>

                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.5em] italic leading-none">
                    No signal? <button type="button" onClick={() => handleAuthAction({ preventDefault: () => {} } as any)} className="text-[#ff6b2b] hover:underline">Resend Code</button>
                  </p>
                </form>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} className="space-y-10 text-center py-12">
                <div className="relative w-36 h-36 mx-auto">
                  <motion.div 
                    initial={{ scale: 0, rotate: -20 }} 
                    animate={{ scale: 1, rotate: 0 }} 
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    className="w-full h-full bg-[#ff6b2b] rounded-[2.5rem] flex items-center justify-center shadow-[0_30px_80px_rgba(255,107,43,0.4)] border-4 border-background relative z-10"
                  >
                    <CheckCircle2 size={64} className="text-black" strokeWidth={3} />
                  </motion.div>
                  <div className="absolute inset-0 bg-[#ff6b2b]/30 blur-[50px] animate-pulse rounded-full" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight italic leading-none text-foreground">Identity Synchronized.</h2>
                  <p className="text-xl text-muted-foreground font-black uppercase tracking-[0.4em] italic leading-none">Welcome to the Swarm.</p>
                </div>

                <div className="flex flex-col items-center gap-4 pt-6">
                  <Activity className="animate-spin text-[#ff6b2b]" size={32} strokeWidth={2.5} />
                  <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.6em] italic leading-none animate-pulse">Establishing secure handshake...</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="mt-16 text-center space-y-8">
            <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground transition-all hover:text-foreground italic leading-none">
              <Link href="/privacy" className="hover:text-[#ff6b2b] transition-colors">Privacy Protocol</Link>
              <Link href="/legal" className="hover:text-[#ff6b2b] transition-colors">Digital Constitution</Link>
              <Link href="/faq" className="hover:text-[#ff6b2b] transition-colors">Node Support</Link>
            </div>
            <p className="text-[9px] font-black text-muted-foreground/40 tracking-[0.8em] uppercase select-none leading-none">
              Nexus Matrix Integration v7.0.0-OMEGA · Signed by Gio Bastidas
            </p>
        </div>
      </motion.div>
    </div>
  );
}
