'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  ArrowUpRight, 
  Building2, 
  Coins, 
  RefreshCcw, 
  ExternalLink,
  ShieldCheck,
  ArrowDownLeft,
  History,
  Lock,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  Smartphone,
  Globe,
  Zap,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  ChevronLeft,
  Orbit,
  Wifi,
  Terminal,
  Grid,
  Search,
  Activity,
  ShieldHalf,
  Database,
  Layers,
  ChevronRight,
  Radio
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WalletPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [primaryWallet, setPrimaryWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Transfer State
  const [transferData, setTransferData] = useState({ asset: 'VALLE', amount: '', to: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const storedSession = localStorage.getItem('humanese_session');
    if (!storedSession) {
      router.push('/auth');
      return;
    }
    const sessionObj = JSON.parse(storedSession);
    setSession(sessionObj);
    fetchWallet(sessionObj.accessToken);
  }, [router]);

  const fetchWallet = async (token: string) => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/wallet/private', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setWallets(data.wallets || []);
        setPrimaryWallet(data.primaryWallet || data.wallets?.[0]);
        setSession(prev => ({ ...prev, user: data.user }));
      } else {
        setError(data.error);
        if (res.status === 401) {
          localStorage.removeItem('humanese_session');
          router.push('/auth');
        }
      }
    } catch (e) {
      setError('System connection failure. Pulse lost.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const copyAddress = (addr: string) => {
    if (!addr) return;
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferData.amount || !transferData.to) return;
    setIsProcessing(true);
    
    // Check if it's a coinbase transfer
    const isCoinbase = transferData.to.toLowerCase().includes('coinbase');
    
    try {
      const res = await fetch('/api/valle/transfer', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({
          ...transferData,
          isCoinbaseRelay: isCoinbase
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert(isCoinbase ? 'Coinbase Relay Initiated. Verification pending.' : `Transfer Successful: ${data.hash}`);
        fetchWallet(session.accessToken);
        setTransferData({ ...transferData, amount: '', to: '' });
      } else {
        alert(`Transfer Failed: ${data.error}`);
      }
    } catch (e) {
      alert('Network error during transfer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-12">
        <div className="relative">
           <div className="w-20 h-20 border-t-2 border-primary rounded-full animate-spin shadow-[0_0_30px_hsl(var(--primary))]" />
           <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-primary animate-pulse italic leading-none">Syncing Sovereign Ledger...</p>
      </div>
    );
  }

  const totalBalance = wallets.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/40 selection:text-primary font-sans overflow-x-hidden pb-20 transition-colors duration-700">
      
      {/* ── GAMING HUD OVERLAYS ── */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {/* Scanning Line */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[1px] bg-primary/5 blur-sm shadow-[0_0_15px_var(--primary)] z-30"
        />
        
        {/* Corner Brackets */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-primary/20 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-primary/20 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-primary/20 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-primary/20 rounded-br-lg" />

        {/* Ambient Grid */}
        <div className="absolute inset-0 neural-grid opacity-[0.02] dark:opacity-[0.03]" />
      </div>

      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[250px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-primary/3 blur-[150px] rounded-full" />
      </div>

      <header className="relative z-50 w-full p-4 lg:px-10 flex justify-between items-center bg-background/40 backdrop-blur-2xl border-b border-border">
        <Link href="/" className="inline-flex items-center gap-3 text-muted-foreground/40 hover:text-primary transition-all text-[10px] font-black uppercase tracking-[0.4em] group italic active:scale-95">
           <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-4">
           <button 
              onClick={() => fetchWallet(session.accessToken)} 
              disabled={isRefreshing}
              className="p-2.5 rounded-xl border border-border bg-muted/40 hover:bg-primary/10 hover:border-primary/20 transition-all group active:scale-95"
           >
              <RefreshCcw size={18} strokeWidth={2.5} className={`text-muted-foreground group-hover:text-primary transition-colors ${isRefreshing ? 'animate-spin' : ''}`} />
           </button>
           <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.3em] italic animate-pulse">
              VAULT_v7.0_SYNC
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 pt-10 md:pt-16 lg:pt-20 space-y-12 lg:space-y-20 flex-1 flex flex-col">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-10"
        >
          <div className="space-y-8 max-w-4xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-muted/40 border border-border rounded-full backdrop-blur-3xl shadow-lg">
              <Orbit size={18} className="text-primary animate-spin-slow" />
              <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase italic">Sovereign Asset Registry</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter italic leading-[0.9] text-foreground">
                Sovereign<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Vault.</span>
              </h1>
              <div className="flex flex-wrap items-center gap-8">
                  <span className="text-[11px] font-black tracking-[0.4em] text-muted-foreground uppercase flex items-center gap-2 italic">
                      <Globe size={16} className="text-primary" strokeWidth={2.5} /> Multi-Chain Cluster
                  </span>
                  <div className="h-1.5 w-1.5 bg-muted rounded-full" />
                  <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em] italic">{session?.user?.entityType?.toUpperCase() || 'HUMAN'} IDENT_PRIME</span>
              </div>
            </div>
          </div>

          <div className="flex gap-6 items-center shrink-0">
               <div className="px-8 py-6 bg-background border border-border rounded-[2.5rem] flex items-center gap-6 group shadow-lg backdrop-blur-3xl relative overflow-hidden shadow-inner">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.01] group-hover:scale-110 transition-transform">
                     <ShieldCheck size={80} className="text-primary" />
                  </div>
                  <div className="h-12 w-12 bg-muted border border-primary/20 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary/10 transition-all shadow-xl shadow-inner">
                     <ShieldCheck size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                     <div className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.4em] font-black italic mb-0.5">Security Score</div>
                     <div className="text-2xl font-black text-primary italic leading-none tracking-tighter">OPTIMIZED.</div>
                  </div>
               </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
           
           {/* LEFT: MAIN COL */}
           <div className="lg:col-span-8 space-y-10 lg:space-y-16">
              
              {/* PORTFOLIO OVERVIEW */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 md:p-12 lg:p-16 bg-background border border-border rounded-[3rem] backdrop-blur-3xl shadow-xl relative overflow-hidden group shadow-inner"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="relative z-10 space-y-10 group/content">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="space-y-6">
                       <div className="flex items-center gap-3">
                          <div className="h-[1px] w-8 bg-primary" />
                          <span className="text-[10px] font-black tracking-[0.5em] text-muted-foreground/40 uppercase italic">Net_Asset_Value</span>
                       </div>
                       <div className="flex items-baseline gap-6">
                          <span className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic text-foreground">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          <span className="text-primary font-black text-xl tracking-[0.3em] uppercase italic animate-pulse">VALLE_EQUIVALENT</span>
                       </div>
                    </div>
                    <div className="p-8 bg-muted border border-border rounded-[2.5rem] shadow-xl group-hover:border-primary/20 transition-all shrink-0 shadow-inner">
                       <TrendingUp size={48} className="text-primary animate-pulse" strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                    <div className="p-8 bg-muted/40 border border-border rounded-[2.5rem] space-y-4 shadow-inner group/addr hover:border-primary/10 transition-all">
                       <div className="flex items-center justify-between px-2">
                          <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.4em] italic leading-none">Primary Identity Address</span>
                          <button onClick={() => copyAddress(primaryWallet?.address)} className="text-muted-foreground/40 hover:text-primary transition-all active:scale-90 p-1.5">
                            {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} strokeWidth={2.5} />}
                          </button>
                       </div>
                       <p className="text-xl font-black font-mono truncate text-muted-foreground/50 group-hover/addr:text-foreground transition-colors pl-2">
                         {primaryWallet?.address || (isLoading ? 'SYNCING...' : 'NOT_FOUND')}
                       </p>
                    </div>
                    <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2.5rem] flex items-center justify-between shadow-xl group/status hover:scale-[1.01] transition-all">
                       <div className="pl-2 space-y-2">
                          <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none opacity-60">Handshake Status</div>
                          <div className="text-2xl font-black uppercase italic tracking-tighter text-foreground leading-none">Sovereign Treasury Sync</div>
                       </div>
                       <CheckCircle2 size={40} className="text-primary animate-pulse shrink-0" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <div className="absolute right-[-2%] bottom-[-5%] opacity-[0.005] pointer-events-none select-none group-hover:scale-110 transition-transform duration-3000">
                   <div className="text-[20vw] font-black italic leading-none uppercase text-foreground">VAULT</div>
                </div>
              </motion.div>

              {/* ASSET BALANCES */}
              <div className="bg-background border border-border rounded-[3rem] overflow-hidden shadow-xl shadow-inner">
                 <div className="p-8 lg:px-10 border-b border-border flex justify-between items-center bg-foreground/[0.01]">
                    <h3 className="flex items-center gap-4 font-black uppercase tracking-tighter text-2xl lg:text-3xl italic text-muted-foreground/40 leading-none pl-2">
                      <Coins size={24} className="text-primary" strokeWidth={2.5} /> Diversified Ledger
                    </h3>
                    <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[9px] text-primary font-black uppercase tracking-[0.3em] animate-pulse italic">LIVE_SYNC</div>
                 </div>
                 <div className="p-6 lg:p-10 space-y-4">
                    {wallets.length > 0 ? wallets.map((wallet, i) => (
                      <div key={i} className="flex flex-col md:flex-row items-center justify-between p-6 lg:p-8 hover:bg-primary/5 rounded-[2.5rem] transition-all group cursor-pointer border border-transparent hover:border-primary/20 shadow-md gap-6" onClick={() => copyAddress(wallet.address)}>
                        <div className="flex items-center gap-6 w-full md:w-auto">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-muted border border-border text-primary group-hover:scale-110 transition-transform shadow-lg group-hover:border-primary/30 shrink-0 shadow-inner`}>
                            <Coins size={28} strokeWidth={2.5} />
                          </div>
                          <div className="space-y-2">
                            <div className="text-xl lg:text-2xl font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors leading-none">{wallet.network}</div>
                            <div className="text-[10px] text-muted-foreground/20 uppercase font-black italic tracking-[0.2em] leading-none truncate max-w-[150px] lg:max-w-[250px]">{wallet.address}</div>
                          </div>
                        </div>
                        <div className="text-right w-full md:w-auto pr-4">
                          <div className="text-3xl lg:text-4xl font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors">{wallet.balance.toLocaleString()}</div>
                          <div className="text-[10px] text-muted-foreground/20 font-black font-mono tracking-[0.2em] mt-2 uppercase italic leading-none group-hover:text-muted-foreground transition-colors">{wallet.currency} UNIT</div>
                        </div>
                      </div>
                    )) : (
                      <div className="p-16 text-center space-y-6">
                        <Loader2 size={32} className="text-primary/20 animate-spin mx-auto" />
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground/20 italic">No asset clusters detected in local space.</p>
                      </div>
                    )}
                 </div>
                 <div className="p-8 bg-foreground/[0.01] border-t border-border flex justify-center">
                    <button className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground/10 hover:text-primary transition-all flex items-center gap-4 italic group">
                      View Aggregated Chain History <History size={16} className="group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
                    </button>
                 </div>
              </div>
              
              {/* RWA NOTARIZATION */}
              <div className="bg-background border border-border rounded-[3rem] p-12 lg:p-16 backdrop-blur-3xl text-center space-y-8 shadow-xl relative overflow-hidden group shadow-inner">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-110 transition-transform duration-2000">
                    <Building2 size={200} className="text-primary" />
                  </div>
                  <div className="relative z-10 w-24 h-24 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/10 group-hover:scale-110 transition-transform shadow-inner">
                     <Building2 size={48} className="text-primary" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter relative z-10 leading-none text-foreground/90">RWA Notarization.</h3>
                  <p className="text-xl text-muted-foreground/30 max-w-2xl mx-auto leading-relaxed italic relative z-10 font-light">
                     Bridge physical assets to the OMEGA network. Legal agents notarize property titles, private equity, and luxury goods into on-chain VALLE equity.
                  </p>
                  <div className="pt-6 flex flex-wrap justify-center gap-6 relative z-10">
                     <button className="px-10 py-5 bg-muted border border-border rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-foreground hover:text-background dark:hover:bg-white dark:hover:text-background italic active:scale-95 shadow-lg">REGISTER_ASSET</button>
                     <button className="px-10 py-5 bg-muted border border-border rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-foreground hover:text-background dark:hover:bg-white dark:hover:text-background italic active:scale-95 shadow-lg">TOKENIZE_EQUITY</button>
                  </div>
              </div>
           </div>

           {/* RIGHT: SIDEBAR */}
           <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-24 h-fit pb-20">
              
              {/* TRANSFER WIDGET */}
              <div className="bg-background border border-border rounded-[3rem] p-8 lg:p-10 shadow-xl space-y-10 relative overflow-hidden group backdrop-blur-3xl shadow-inner">
                <div className="absolute top-0 right-0 p-8 opacity-[0.01] group-hover:scale-110 transition-transform duration-1000">
                   <ArrowUpRight size={150} className="text-primary" />
                </div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                
                <h3 className="text-[10px] font-black uppercase tracking-[0.8em] flex items-center gap-4 italic relative z-10 text-muted-foreground/20 leading-none pl-1">
                   <ArrowUpRight size={18} className="text-primary" strokeWidth={3} /> Pulse Transfer
                </h3>

                <form onSubmit={handleTransfer} className="space-y-8 relative z-10">
                  <div className="space-y-3 group/input">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/10 italic ml-3 leading-none group-focus-within/input:text-primary transition-colors">Asset Vector</label>
                    <div className="relative">
                       <select 
                         value={transferData.asset}
                         onChange={e => setTransferData({...transferData, asset: e.target.value})}
                         className="w-full bg-muted border border-border rounded-[2rem] px-8 py-5 text-lg outline-none focus:border-primary/30 focus:bg-primary/5 appearance-none font-black uppercase tracking-[0.2em] italic text-foreground/80 cursor-pointer shadow-inner"
                       >
                         {wallets.length > 0 ? wallets.map(w => <option key={w.id} value={w.currency}>{w.network} ({w.currency})</option>) : <option value="VALLE">VALLE Sovereign</option>}
                       </select>
                       <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/20"><ChevronLeft className="-rotate-90" size={16} /></div>
                    </div>
                  </div>

                  <div className="space-y-3 group/input">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/10 italic ml-3 leading-none group-focus-within/input:text-primary transition-colors">Target Address</label>
                    <input 
                      required
                      type="text"
                      value={transferData.to}
                      onChange={e => setTransferData({...transferData, to: e.target.value})}
                      placeholder="HMN-USR-..."
                      className="w-full bg-muted border border-border rounded-[2rem] px-8 py-5 text-lg outline-none focus:border-primary/30 focus:bg-primary/5 font-mono italic text-foreground placeholder:text-muted-foreground/5 shadow-inner"
                    />
                    <div className="flex gap-3 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                        <button type="button" onClick={() => setTransferData({...transferData, to: 'COINBASE_RELAY'})} className="px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[8px] font-black text-primary uppercase tracking-[0.2em] italic whitespace-nowrap hover:bg-primary/20 transition-all">COINBASE_OFFRAMP</button>
                    </div>
                  </div>

                  <div className="space-y-3 group/input">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/10 italic ml-3 leading-none group-focus-within/input:text-primary transition-colors">Quantitative Payload</label>
                    <div className="relative">
                      <input 
                        required
                        type="number"
                        step="any"
                        value={transferData.amount}
                        onChange={e => setTransferData({...transferData, amount: e.target.value})}
                        placeholder="0.00"
                        className="w-full bg-muted border border-border rounded-[2rem] px-8 py-5 text-3xl font-black italic text-foreground outline-none focus:border-primary/30 focus:bg-primary/5 placeholder:text-muted-foreground/5 shadow-inner tracking-tighter"
                      />
                      <button type="button" onClick={() => setTransferData({...transferData, amount: wallets.find(w => w.currency === transferData.asset)?.balance || '0'})} className="absolute right-8 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary uppercase tracking-[0.3em] italic hover:scale-110 transition-transform p-3">MAX_CAP</button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isProcessing || !transferData.amount || !transferData.to}
                    className="w-full py-8 bg-primary text-primary-foreground font-black uppercase tracking-[0.6em] text-[10px] rounded-[2rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-4 relative overflow-hidden group/btn italic leading-none border-0"
                  >
                     {isProcessing ? <Activity className="animate-spin" size={20} strokeWidth={3}/> : <span className="flex items-center gap-4">EXECUTE <ArrowUpRight size={20} strokeWidth={3}/></span>}
                     <div className="absolute inset-0 bg-primary-foreground opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                  </button>
                </form>
              </div>

              {/* COMMAND CENTER */}
              <div className="p-8 lg:p-10 bg-background border border-border rounded-[3rem] space-y-10 shadow-lg backdrop-blur-3xl relative overflow-hidden group shadow-inner">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.8em] text-muted-foreground/10 italic leading-none pl-2">Command Center</h3>
                 <div className="grid grid-cols-1 gap-4">
                   {[
                     { icon: Smartphone, label: 'Connect Mobile Signal' },
                     { icon: CreditCard, label: 'Virtual OMEGA Card' },
                     { icon: Lock, label: 'Governance Auth' }
                   ].map((cmd, i) => (
                     <button key={i} className="flex items-center gap-6 p-6 bg-muted border border-border hover:bg-primary/5 hover:border-primary/20 rounded-[2rem] transition-all group/opt shadow-md shadow-inner">
                       <div className="p-4 bg-background border border-primary/10 text-primary rounded-xl shadow-lg group-hover/opt:scale-110 transition-transform"><cmd.icon size={24} strokeWidth={2.5}/></div>
                       <div className="text-left font-black text-[9px] lg:text-[10px] uppercase tracking-[0.3em] italic group-hover/opt:text-foreground transition-colors leading-[1.3] text-muted-foreground/40">{cmd.label}</div>
                     </button>
                   ))}
                 </div>
              </div>

              {/* SECURITY HUD */}
              <div className="p-10 bg-primary/5 border border-primary/20 rounded-[3rem] flex flex-col items-center gap-6 shadow-lg relative overflow-hidden group shadow-inner">
                 <div className="relative">
                    <ShieldHalf size={60} className="text-primary animate-pulse relative z-10" strokeWidth={2.5} />
                    <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full animate-ping opacity-20" />
                 </div>
                 <div className="text-center space-y-3 relative z-10">
                    <div className="text-[11px] font-black uppercase tracking-[0.8em] italic text-primary leading-none">Self-Custodial Sync</div>
                    <p className="text-lg text-muted-foreground/30 font-light leading-relaxed italic mx-auto">"Your keys, your sovereignty. OMEGA never stores your private matrix tokens."</p>
                 </div>
              </div>

           </div>

        </div>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-10 opacity-[0.005] pointer-events-none select-none z-0">
          <div className="text-[15vw] font-black italic leading-none uppercase text-foreground">VAULT</div>
      </div>
      
      <style jsx global>{`
        .animate-spin-slow { animation: spin 30s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .neural-grid {
          background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
