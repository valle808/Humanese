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
  ChevronLeft
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
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-hidden flex flex-col items-center justify-center p-6 lg:p-12">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
        
        {/* Animated Scanning Lines */}
        <div className="absolute inset-0 opacity-[0.05]">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-1/4 animate-[scan_15s_linear_infinite]" />
           <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent absolute top-3/4 animate-[scan_20s_linear_infinite_reverse]" />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        className="relative z-10 w-full max-w-2xl flex flex-col items-center"
      >
        {/* BRAND & HEADER */}
        <div className="flex flex-col items-center mb-16 space-y-8">
          <Link href="/" className="w-24 h-24 bg-[#ff6b2b] rounded-[2rem] shadow-[0_40px_100px_rgba(255,107,43,0.4)] flex items-center justify-center group active:scale-95 transition-all">
            <ShieldCheck size={48} className="text-black" strokeWidth={3} />
          </Link>
          <div className="text-center space-y-4">
            <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter italic leading-none">
              Sovereign<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Portal.</span>
            </h1>
            <div className="flex items-center justify-center gap-6">
              <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase flex items-center gap-3 italic leading-none animate-pulse">
                <Globe size={14} /> Unified UXL Interface
              </span>
            </div>
          </div>
        </div>

        {/* MAIN AUTH CARD */}
        <div className="w-full bg-[#050505]/60 backdrop-blur-[60px] border-2 border-white/10 rounded-[4.5rem] p-10 lg:p-16 shadow-[0_100px_200px_rgba(0,0,0,1)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent shadow-[0_0_20px_#ff6b2b]" />
          
          <AnimatePresence mode="wait">
            
            {/* STEP 0: MODE SELECTION */}
            {step === 'mode' && (
              <motion.div key="mode" initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }} className="space-y-12 py-4">
                <div className="space-y-4 text-center">
                  <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none">Initialize Access_</h2>
                  <p className="text-xl text-white/30 font-light italic">Choose your trajectory into the OMEGA swarm.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 pt-4">
                  <button 
                    onClick={() => { setMode('login'); setStep('credentials'); }}
                    className="p-10 bg-white/[0.02] border-2 border-white/5 hover:border-[#ff6b2b]/40 rounded-[3rem] flex items-center justify-between group/opt transition-all shadow-2xl overflow-hidden relative"
                  >
                    <div className="text-left space-y-2 relative z-10">
                      <div className="font-black uppercase tracking-[0.4em] text-2xl italic leading-none text-white/90 group-hover/opt:text-white transition-colors">Returning User</div>
                      <div className="text-sm text-white/20 uppercase tracking-[0.2em] italic font-black">Restore existing presence</div>
                    </div>
                    <ArrowRight className="group-hover/opt:translate-x-4 transition-all text-white/10 group-hover/opt:text-[#ff6b2b]" size={32} strokeWidth={3} />
                    <div className="absolute inset-0 bg-[#ff6b2b]/5 opacity-0 group-hover/opt:opacity-100 transition-opacity" />
                  </button>
                  <button 
                    onClick={() => { setMode('register'); setStep('entity'); }}
                    className="p-10 bg-[#ff6b2b] text-black border-2 border-[#ff6b2b] rounded-[3rem] flex items-center justify-between group/opt transition-all shadow-[0_30px_80px_rgba(255,107,43,0.3)] overflow-hidden relative"
                  >
                    <div className="text-left space-y-2 relative z-10">
                      <div className="font-black uppercase tracking-[0.4em] text-2xl italic leading-none">New Entity</div>
                      <div className="text-sm uppercase tracking-[0.2em] italic font-black opacity-40">Anchor a new identity</div>
                    </div>
                    <ArrowRight className="group-hover/opt:translate-x-4 transition-all" size={32} strokeWidth={3} />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/opt:opacity-100 transition-opacity" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 1: ENTITY SELECTION */}
            {step === 'entity' && (
              <motion.div key="entity" initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }} className="space-y-12">
                <div className="flex items-center gap-6">
                  <button onClick={() => setStep('mode')} className="w-14 h-14 bg-white/5 border-2 border-white/5 rounded-2xl flex items-center justify-center text-white/20 hover:text-white hover:border-white transition-all active:scale-90"><ChevronLeft size={28} strokeWidth={2.5}/></button>
                  <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none">Select Entity_</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {ENTITIES.map((entity) => (
                    <button
                      key={entity.id}
                      onClick={() => handleEntitySelect(entity)}
                      className="group flex items-center gap-8 p-8 bg-white/[0.02] border-2 border-white/5 rounded-[2.5rem] hover:border-[#ff6b2b]/40 hover:bg-[#ff6b2b]/5 transition-all text-left shadow-2xl relative overflow-hidden"
                    >
                      <div className={`w-16 h-16 rounded-2xl ${entity.bg} ${entity.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-2xl border-2 border-[#ff6b2b]/10 group-hover:border-[#ff6b2b]/40`}>
                        <entity.icon size={32} strokeWidth={2.5} />
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-black uppercase tracking-tighter italic leading-none text-white/90 group-hover:text-white transition-colors">{entity.label}</div>
                        <div className="text-[11px] text-white/10 uppercase tracking-[0.4em] font-black italic leading-none group-hover:text-white/20 transition-colors">{entity.desc}</div>
                      </div>
                      <ArrowRight size={24} className="ml-auto opacity-0 group-hover:opacity-100 transition-all text-[#ff6b2b] group-hover:translate-x-2" strokeWidth={3} />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: CREDENTIALS */}
            {step === 'credentials' && (
              <motion.div key="credentials" initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }} className="space-y-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {mode === 'register' ? (
                      <button onClick={() => setStep('entity')} className="w-14 h-14 bg-white/5 border-2 border-white/5 rounded-2xl flex items-center justify-center text-white/20 hover:text-white hover:border-white transition-all active:scale-90"><ChevronLeft size={28} strokeWidth={2.5}/></button>
                    ) : (
                      <button onClick={() => { setMode('register'); setStep('mode'); }} className="w-14 h-14 bg-white/5 border-2 border-white/5 rounded-2xl flex items-center justify-center text-white/20 hover:text-white hover:border-white transition-all active:scale-90"><ChevronLeft size={28} strokeWidth={2.5}/></button>
                    )}
                    <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none">{mode === 'login' ? 'Nexus Login_' : 'Establish ID_'}</h2>
                  </div>
                  <div className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.4em] italic leading-none border-2 shadow-2xl ${selectedEntity.bg} ${selectedEntity.color} border-[#ff6b2b]/20`}>{selectedEntity.label}</div>
                </div>

                <form onSubmit={handleAuthAction} className="space-y-10">
                  <div className="space-y-8">
                    
                    {/* Name Field (Register Only) */}
                    {mode === 'register' && (
                      <div className="space-y-4 group/input">
                        <label className="text-[12px] font-black uppercase tracking-[0.8em] text-white/10 italic ml-6 leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">Legal Identification / Agent ID</label>
                        <div className="relative">
                           <User size={24} className="absolute left-10 top-1/2 -translate-y-1/2 text-white/5 group-focus-within/input:text-[#ff6b2b] transition-colors" />
                           <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border-2 border-white/5 rounded-[2.5rem] pl-24 pr-10 py-8 text-2xl outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all italic text-white placeholder:text-white/5 tracking-tight shadow-inner" placeholder="PRACTITIONER_IDENTITY"/>
                        </div>
                      </div>
                    )}

                    {/* Email Selection System */}
                    <div className="space-y-6">
                      {mode === 'register' && (
                        <div className="flex items-center gap-4 p-2 bg-white/[0.02] border-2 border-white/5 rounded-[2.5rem] shadow-inner">
                          <button type="button" onClick={() => setFormData({...formData, useHumaneseEmail: false})} className={`flex-1 py-4 text-[11px] font-black uppercase tracking-[0.4em] rounded-[2rem] transition-all italic ${!formData.useHumaneseEmail ? 'bg-[#ff6b2b] text-black shadow-[0_20px_40px_rgba(255,107,43,0.3)]' : 'text-white/20 hover:text-white/40'}`}>External Email</button>
                          <button type="button" onClick={() => setFormData({...formData, useHumaneseEmail: true})} className={`flex-1 py-4 text-[11px] font-black uppercase tracking-[0.4em] rounded-[2rem] transition-all flex items-center justify-center gap-3 italic ${formData.useHumaneseEmail ? 'bg-[#ff6b2b] text-black shadow-[0_20px_40px_rgba(255,107,43,0.3)]' : 'text-white/20 hover:text-white/40'}`}><Globe size={16} strokeWidth={2.5}/> @humanese.net</button>
                        </div>
                      )}

                      {formData.useHumaneseEmail ? (
                        <div className="space-y-4 group/input">
                          <label className="text-[12px] font-black uppercase tracking-[0.8em] text-white/10 italic ml-6 leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">Choose Ecosystem Handle</label>
                          <div className="relative">
                            <input required type="text" value={formData.customUsername} onChange={e => setFormData({...formData, customUsername: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})} className="w-full bg-black border-2 border-white/5 rounded-[2.5rem] pl-10 pr-48 py-8 text-2xl outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all font-mono italic text-white placeholder:text-white/5 tracking-tight shadow-inner" placeholder="username"/>
                            <div className="absolute right-10 top-1/2 -translate-y-1/2 text-xl font-black text-[#ff6b2b] font-mono select-none tracking-tighter">@humanese.net</div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 group/input">
                          <label className="text-[12px] font-black uppercase tracking-[0.8em] text-white/10 italic ml-6 leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">{mode === 'login' ? 'Identity Email' : 'Verification Email'}</label>
                          <div className="relative">
                            <Mail size={24} className="absolute left-10 top-1/2 -translate-y-1/2 text-white/5 group-focus-within/input:text-[#ff6b2b] transition-colors" />
                            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black border-2 border-white/5 rounded-[2.5rem] pl-24 pr-10 py-8 text-2xl outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all italic text-white placeholder:text-white/5 tracking-tight shadow-inner" placeholder="ENTITY@RESONANCE.NET"/>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phone Number (Optional) */}
                    {mode === 'register' && (
                      <div className="space-y-4 group/input">
                        <label className="text-[12px] font-black uppercase tracking-[0.8em] text-white/10 italic ml-6 leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">Mobile Signal (+E.164)</label>
                        <div className="relative">
                           <Smartphone size={24} className="absolute left-10 top-1/2 -translate-y-1/2 text-white/5 group-focus-within/input:text-[#ff6b2b] transition-colors" />
                           <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black border-2 border-white/5 rounded-[2.5rem] pl-24 pr-10 py-8 text-2xl outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all italic text-white placeholder:text-white/5 tracking-tight shadow-inner" placeholder="+1234567890"/>
                        </div>
                      </div>
                    )}

                    {/* Passphrase */}
                    <div className="space-y-4 group/input">
                      <label className="text-[12px] font-black uppercase tracking-[0.8em] text-white/10 italic ml-6 leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">{mode === 'login' ? 'Sovereign Passphrase' : 'New Access Token'}</label>
                      <div className="relative">
                        <Lock size={24} className="absolute left-10 top-1/2 -translate-y-1/2 text-white/5 group-focus-within/input:text-[#ff6b2b] transition-colors" />
                        <input 
                          required 
                          type={showPassword ? 'text' : 'password'} 
                          value={formData.password} 
                          onChange={e => setFormData({...formData, password: e.target.value})} 
                          className="w-full bg-black border-2 border-white/5 rounded-[2.5rem] pl-24 pr-24 py-8 text-2xl outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all italic text-white placeholder:text-white/5 tracking-tight shadow-inner" 
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-10 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-all p-4 active:scale-90">
                          {showPassword ? <EyeOff size={24} strokeWidth={2.5}/> : <Eye size={24} strokeWidth={2.5}/>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 bg-red-500/10 border-2 border-red-500/20 rounded-[2.5rem] text-[12px] text-red-500 font-black uppercase tracking-[0.6em] flex items-center gap-6 italic shadow-2xl">
                      <AlertCircle size={24} strokeWidth={2.5} className="shrink-0" /> {error}
                    </motion.div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-10 bg-[#ff6b2b] text-black font-black uppercase tracking-[1em] text-xs rounded-[3rem] shadow-[0_40px_100px_rgba(255,107,43,0.3)] hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-6 italic overflow-hidden group/btn leading-none border-0"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={32} strokeWidth={3}/> : <span className="flex items-center gap-6">{mode === 'login' ? 'Sync Matrix' : 'Establish Identity'} <ArrowRight size={28} strokeWidth={3} /></span>}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                  </button>

                  <div className="text-center text-[12px] font-black uppercase tracking-[0.8em] text-white/10 pt-4 italic leading-none">
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
              <motion.div key="verification" initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }} className="space-y-12 text-center py-10">
                <div className="w-32 h-32 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/30 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-[#ff6b2b]/10 relative">
                   <Mail size={56} className="text-[#ff6b2b] animate-bounce" strokeWidth={2.5} />
                   <div className="absolute inset-0 bg-[#ff6b2b]/20 blur-[60px] rounded-full animate-pulse opacity-30" />
                </div>
                <div className="space-y-6">
                  <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none">Verify Identity_</h2>
                  <p className="text-2xl text-white/30 font-light italic leading-relaxed">
                    A 6-digit synchronization code was sent to <br/>
                    <span className="text-[#ff6b2b] font-mono font-black">{formData.useHumaneseEmail ? `${formData.customUsername}@humanese.net` : formData.email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-12">
                  <div className="flex justify-center">
                    <input 
                      required
                      type="text"
                      maxLength={6}
                      value={formData.token}
                      onChange={e => setFormData({...formData, token: e.target.value.replace(/\D/g, '')})}
                      className="w-72 text-center bg-black border-4 border-white/5 focus:border-[#ff6b2b]/50 rounded-[2.5rem] py-10 text-5xl font-black tracking-[0.6em] outline-none transition-all font-mono text-white shadow-inner pl-6"
                      placeholder="000000"
                    />
                  </div>

                  {error && (
                    <div className="text-[13px] text-red-500 font-black uppercase tracking-[1em] italic animate-pulse">{error}</div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading || formData.token.length < 6}
                    className="w-full py-10 bg-[#ff6b2b] text-black font-black uppercase tracking-[1em] text-xs rounded-[3rem] shadow-[0_40px_100px_rgba(255,107,43,0.3)] hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center italic overflow-hidden group/btn leading-none border-0"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={32} strokeWidth={3}/> : 'Verify & Activate'}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                  </button>

                  <p className="text-[12px] text-white/10 font-black uppercase tracking-[0.8em] italic leading-none">
                    No signal? <button type="button" onClick={() => handleAuthAction({ preventDefault: () => {} } as any)} className="text-[#ff6b2b] hover:underline">Resend Code</button>
                  </p>
                </form>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9, filter: 'blur(30px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} className="space-y-12 text-center py-20">
                <div className="relative w-48 h-48 mx-auto">
                  <motion.div 
                    initial={{ scale: 0, rotate: -20 }} 
                    animate={{ scale: 1, rotate: 0 }} 
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    className="w-full h-full bg-[#ff6b2b] rounded-[3.5rem] flex items-center justify-center shadow-[0_50px_150px_rgba(255,107,43,0.5)] border-8 border-black relative z-10"
                  >
                    <CheckCircle2 size={80} className="text-black" strokeWidth={3} />
                  </motion.div>
                  <div className="absolute inset-0 bg-[#ff6b2b]/30 blur-[80px] animate-pulse rounded-full" />
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter italic leading-none">Identity Synchronized.</h2>
                  <p className="text-2xl text-white/20 font-black uppercase tracking-[0.6em] italic leading-none">Welcome to the Swarm.</p>
                </div>

                <div className="flex flex-col items-center gap-6 pt-10">
                  <Activity className="animate-spin text-[#ff6b2b]" size={40} strokeWidth={3} />
                  <span className="text-[12px] font-black text-white/10 uppercase tracking-[1em] italic leading-none animate-pulse">Establishing secure handshake...</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="mt-20 text-center space-y-12">
            <div className="flex justify-center gap-12 text-[12px] font-black uppercase tracking-[0.8em] text-white/10 transition-all hover:text-white/20 italic leading-none">
              <Link href="/privacy" className="hover:text-[#ff6b2b] transition-colors">Privacy Privacy</Link>
              <Link href="/legal" className="hover:text-[#ff6b2b] transition-colors">Digital Constitution</Link>
              <Link href="/faq" className="hover:text-[#ff6b2b] transition-colors">Node Support</Link>
            </div>
            <p className="text-[11px] font-black text-white/5 tracking-[1rem] uppercase select-none leading-none opacity-40">
              Nexus Matrix Integration v7.0.0-OMEGA · Signed by Gio Bastidas
            </p>
        </div>
      </motion.div>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-[30vw] font-black italic italic leading-none uppercase">PORTAL</div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
      `}</style>
    </div>
  );
}
