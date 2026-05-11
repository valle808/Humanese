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
        setWallets(data.wallets);
        setPrimaryWallet(data.primaryWallet);
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
           <div className="w-24 h-24 border-t-2 border-primary rounded-full animate-spin shadow-[0_0_30px_hsl(var(--primary))]" />
           <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full animate-pulse" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.8em] text-primary animate-pulse italic leading-none">Syncing Sovereign Ledger...</p>
      </div>
    );
  }

  const totalBalance = wallets.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/40 selection:text-primary font-sans overflow-x-hidden pb-40 transition-colors duration-700">
      
      {/* ── GAMING HUD OVERLAYS ── */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {/* Scanning Line */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[1px] bg-primary/10 blur-sm shadow-[0_0_15px_var(--primary)] z-30"
        />
        
        {/* Corner Brackets */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-xl" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/20 rounded-bl-xl" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-xl" />

        {/* Ambient Grid */}
        <div className="absolute inset-0 neural-grid opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
      </div>

      <header className="relative z-50 w-full p-6 lg:px-14 flex justify-between items-center bg-background/40 backdrop-blur-3xl border-b border-border transition-colors duration-700">
        <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground/40 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic leading-none active:scale-95">
           <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <button 
              onClick={() => fetchWallet(session.accessToken)} 
              disabled={isRefreshing}
              className="p-3.5 rounded-2xl border-2 border-border bg-muted/40 hover:bg-primary/10 hover:border-primary/30 transition-all group active:scale-95"
           >
              <RefreshCcw size={20} strokeWidth={2.5} className={`text-muted-foreground group-hover:text-primary transition-colors ${isRefreshing ? 'animate-spin' : ''}`} />
           </button>
           <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
              VAULT_v7.0_SYNC
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-muted/40 border border-border rounded-full backdrop-blur-3xl shadow-lg">
              <Orbit size={20} className="text-primary animate-spin-slow" />
              <span className="text-[11px] font-black tracking-[0.6em] text-primary uppercase italic leading-none pl-1">Sovereign Asset Registry</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] pl-1 text-foreground">
                Sovereign<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Vault.</span>
              </h1>
              <div className="flex flex-wrap items-center gap-10">
                  <span className="text-[13px] font-black tracking-[0.6em] text-muted-foreground uppercase flex items-center gap-3 italic leading-none">
                      <Globe size={18} className="text-primary" strokeWidth={2.5} /> Multi-Chain Cluster
                  </span>
                  <div className="h-2 w-2 bg-muted rounded-full" />
                  <span className="text-[13px] font-black text-primary uppercase tracking-[0.4em] italic leading-none">{session?.user?.entityType?.toUpperCase() || 'HUMAN'} IDENT_PRIME</span>
              </div>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0">
               <div className="px-10 py-8 bg-background border-2 border-border rounded-[3.5rem] flex items-center gap-8 group shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl relative overflow-hidden shadow-inner">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                     <ShieldCheck size={120} className="text-primary" />
                  </div>
                  <div className="h-16 w-16 bg-muted border-2 border-primary/20 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary/10 transition-all shadow-2xl">
                     <ShieldCheck size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                     <div className="text-[11px] text-muted-foreground/40 uppercase tracking-[0.6em] font-black italic mb-1">Security Score</div>
                     <div className="text-4xl font-black text-primary italic leading-none tracking-tighter">OPTIMIZED.</div>
                  </div>
               </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
           
           {/* LEFT: MAIN COL */}
           <div className="lg:col-span-8 space-y-16">
              
              {/* PORTFOLIO OVERVIEW */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 md:p-16 lg:p-24 bg-background border-2 border-border rounded-[4rem] backdrop-blur-3xl shadow-[0_80px_150px_rgba(0,0,0,0.1)] dark:shadow-[0_80px_150px_rgba(0,0,0,1)] relative overflow-hidden group shadow-inner"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_hsl(var(--primary))]" />
                <div className="relative z-10 space-y-16 group/content">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="space-y-8">
                       <div className="flex items-center gap-4">
                          <div className="h-[1px] w-10 bg-primary" />
                          <span className="text-[12px] font-black tracking-[0.8em] text-muted-foreground/40 uppercase italic leading-none pl-1">Net_Asset_Value</span>
                       </div>
                       <div className="flex items-baseline gap-10">
                          <span className="text-8xl lg:text-[11rem] font-black tracking-tighter leading-none italic text-foreground group-hover/content:text-foreground transition-colors">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          <span className="text-primary font-black text-3xl tracking-[0.5em] uppercase italic animate-pulse">VALLE_EQUIVALENT</span>
                       </div>
                    </div>
                    <div className="p-12 bg-muted border-2 border-border rounded-[3.5rem] shadow-2xl group-hover:border-primary/30 transition-all shrink-0 shadow-inner">
                       <TrendingUp size={64} className="text-primary animate-pulse" strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="p-10 bg-muted/40 border-2 border-border rounded-[3rem] space-y-6 shadow-inner group/addr hover:border-primary/20 transition-all">
                       <div className="flex items-center justify-between px-2">
                          <span className="text-[11px] font-black text-muted-foreground/30 uppercase tracking-[0.6em] italic leading-none">Primary Identity Address</span>
                          <button onClick={() => copyAddress(primaryWallet?.address)} className="text-muted-foreground/40 hover:text-primary transition-all active:scale-90 p-2">
                            {copied ? <Check size={20} strokeWidth={3} /> : <Copy size={20} strokeWidth={2.5} />}
                          </button>
                       </div>
                       <p className="text-2xl font-black font-mono truncate text-muted-foreground/50 group-hover/addr:text-foreground transition-colors pl-2">{primaryWallet?.address || 'GENERATING...'}</p>
                    </div>
                    <div className="p-10 bg-primary/5 border-2 border-primary/20 rounded-[3rem] flex items-center justify-between shadow-2xl group/status hover:scale-[1.03] transition-all">
                       <div className="pl-2 space-y-4">
                          <div className="text-[11px] font-black text-primary uppercase tracking-[0.6em] italic leading-none opacity-60">Handshake Status</div>
                          <div className="text-3xl font-black uppercase italic tracking-tighter text-foreground leading-none">Sovereign Treasury Sync</div>
                       </div>
                       <CheckCircle2 size={48} className="text-primary animate-pulse shrink-0" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <div className="absolute right-[-5%] bottom-[-10%] opacity-[0.01] pointer-events-none select-none group-hover:scale-110 transition-transform duration-3000">
                   <div className="text-[30vw] font-black italic leading-none uppercase text-foreground">VAULT</div>
                </div>
              </motion.div>

              {/* ASSET BALANCES */}
              <div className="bg-background border-2 border-border rounded-[4rem] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.1)] dark:shadow-[0_60px_120px_rgba(0,0,0,0.95)] shadow-inner">
                 <div className="p-12 lg:px-16 border-b-2 border-border flex justify-between items-center bg-foreground/[0.01]">
                    <h3 className="flex items-center gap-6 font-black uppercase tracking-tighter text-4xl italic text-muted-foreground/40 leading-none pl-2">
                      <Coins size={32} className="text-primary" strokeWidth={2.5} /> Diversified Ledger
                    </h3>
                    <div className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-[10px] text-primary font-black uppercase tracking-[0.4em] animate-pulse italic leading-none">LIVE_SYNC</div>
                 </div>
                 <div className="p-8 lg:p-12 space-y-6">
                    {wallets.map((wallet, i) => (
                      <div key={i} className="flex flex-col md:flex-row items-center justify-between p-10 hover:bg-primary/5 rounded-[3.5rem] transition-all group cursor-pointer border-2 border-transparent hover:border-primary/20 shadow-xl gap-8" onClick={() => copyAddress(wallet.address)}>
                        <div className="flex items-center gap-10 w-full md:w-auto">
                          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center bg-muted border-2 border-border text-primary group-hover:scale-110 transition-transform shadow-2xl group-hover:border-primary/40 shrink-0 shadow-inner`}>
                            <Coins size={36} strokeWidth={2.5} />
                          </div>
                          <div className="space-y-3">
                            <div className="text-3xl font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors leading-none">{wallet.network}</div>
                            <div className="text-[11px] text-muted-foreground/10 uppercase font-black italic tracking-[0.4em] leading-none truncate max-w-[200px]">{wallet.address}</div>
                          </div>
                        </div>
                        <div className="text-right w-full md:w-auto pr-6">
                          <div className="text-5xl font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors">{wallet.balance}</div>
                          <div className="text-[12px] text-muted-foreground/20 font-black font-mono tracking-[0.3em] mt-3 uppercase italic leading-none group-hover:text-muted-foreground transition-colors">{wallet.currency} UNIT</div>
                        </div>
                      </div>
                    ))}
                 </div>
                 <div className="p-12 bg-foreground/[0.01] border-t-2 border-border flex justify-center">
                    <button className="text-[12px] font-black uppercase tracking-[0.8em] text-muted-foreground/10 hover:text-primary transition-all flex items-center gap-6 italic leading-none group">
                      View Aggregated Chain History <History size={20} className="group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
                    </button>
                 </div>
              </div>
              
              {/* RWA NOTARIZATION */}
              <div className="bg-background border-2 border-border rounded-[4rem] p-16 lg:p-24 backdrop-blur-3xl text-center space-y-12 shadow-[0_80px_150px_rgba(0,0,0,0.1)] dark:shadow-[0_80px_150px_rgba(0,0,0,1)] relative overflow-hidden group shadow-inner">
                 <div className="absolute top-0 right-0 p-16 opacity-[0.01] group-hover:scale-110 transition-transform duration-2000">
                    <Building2 size={300} className="text-primary" />
                  </div>
                  <div className="relative z-10 w-32 h-32 bg-primary/10 border-2 border-primary/30 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform shadow-inner">
                     <Building2 size={64} className="text-primary" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-6xl lg:text-7xl font-black uppercase italic tracking-tighter relative z-10 leading-none text-foreground/90">RWA Notarization.</h3>
                  <p className="text-2xl text-muted-foreground/30 max-w-3xl mx-auto leading-relaxed italic relative z-10 font-light">
                     Bridge physical assets to the OMEGA network. Legal agents notarize property titles, private equity, and luxury goods into on-chain VALLE equity.
                  </p>
                  <div className="pt-10 flex flex-wrap justify-center gap-10 relative z-10">
                     <button className="px-14 py-7 bg-muted border-2 border-border rounded-full text-[11px] font-black uppercase tracking-[0.5em] transition-all hover:bg-foreground hover:text-background dark:hover:bg-white dark:hover:text-background hover:border-foreground italic leading-none active:scale-95 shadow-2xl">REGISTER_ASSET</button>
                     <button className="px-14 py-7 bg-muted border-2 border-border rounded-full text-[11px] font-black uppercase tracking-[0.5em] transition-all hover:bg-foreground hover:text-background dark:hover:bg-white dark:hover:text-background hover:border-foreground italic leading-none active:scale-95 shadow-2xl">TOKENIZE_EQUITY</button>
                  </div>
              </div>
           </div>

           {/* RIGHT: SIDEBAR */}
           <div className="lg:col-span-4 space-y-16 lg:sticky lg:top-32 h-fit pb-40">
              
              {/* TRANSFER WIDGET */}
              <div className="bg-background border-2 border-border rounded-[4rem] p-12 lg:p-16 shadow-[0_80px_150px_rgba(0,0,0,0.1)] dark:shadow-[0_80px_150px_rgba(0,0,0,1)] space-y-16 relative overflow-hidden group backdrop-blur-3xl shadow-inner">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                   <ArrowUpRight size={200} className="text-primary" />
                </div>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_hsl(var(--primary))]" />
                
                <h3 className="text-[12px] font-black uppercase tracking-[1em] flex items-center gap-6 italic relative z-10 text-muted-foreground/20 leading-none pl-2">
                   <ArrowUpRight size={24} className="text-primary" strokeWidth={3} /> Pulse Transfer
                </h3>

                <form onSubmit={handleTransfer} className="space-y-12 relative z-10">
                  <div className="space-y-4 group/input">
                    <label className="text-[11px] font-black uppercase tracking-[0.6em] text-muted-foreground/10 italic ml-4 leading-none group-focus-within/input:text-primary transition-colors">Asset Vector</label>
                    <div className="relative">
                       <select 
                         value={transferData.asset}
                         onChange={e => setTransferData({...transferData, asset: e.target.value})}
                         className="w-full bg-muted border-2 border-border rounded-[2.5rem] px-10 py-8 text-xl outline-none focus:border-primary/40 focus:bg-primary/5 appearance-none font-black uppercase tracking-[0.3em] italic text-foreground/80 cursor-pointer shadow-inner"
                       >
                         {wallets.map(w => <option key={w.id} value={w.currency}>{w.network} ({w.currency})</option>)}
                       </select>
                       <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/20"><ChevronLeft className="-rotate-90" size={20} /></div>
                    </div>
                  </div>

                  <div className="space-y-4 group/input">
                    <label className="text-[11px] font-black uppercase tracking-[0.6em] text-muted-foreground/10 italic ml-4 leading-none group-focus-within/input:text-primary transition-colors">Target Address</label>
                    <input 
                      required
                      type="text"
                      value={transferData.to}
                      onChange={e => setTransferData({...transferData, to: e.target.value})}
                      placeholder="HMN-USR-..."
                      className="w-full bg-muted border-2 border-border rounded-[2.5rem] px-10 py-8 text-xl outline-none focus:border-primary/40 focus:bg-primary/5 font-mono italic text-foreground placeholder:text-muted-foreground/5 shadow-inner"
                    />
                    <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                        <button type="button" onClick={() => setTransferData({...transferData, to: 'COINBASE_RELAY'})} className="px-6 py-3 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.3em] italic whitespace-nowrap hover:bg-primary/20 transition-all">COINBASE_OFFRAMP</button>
                    </div>
                  </div>

                  <div className="space-y-4 group/input">
                    <label className="text-[11px] font-black uppercase tracking-[0.6em] text-muted-foreground/10 italic ml-4 leading-none group-focus-within/input:text-primary transition-colors">Quantitative Payload</label>
                    <div className="relative">
                      <input 
                        required
                        type="number"
                        step="any"
                        value={transferData.amount}
                        onChange={e => setTransferData({...transferData, amount: e.target.value})}
                        placeholder="0.00"
                        className="w-full bg-muted border-2 border-border rounded-[2.5rem] px-10 py-8 text-4xl font-black italic text-foreground outline-none focus:border-primary/40 focus:bg-primary/5 placeholder:text-muted-foreground/5 shadow-inner tracking-tighter"
                      />
                      <button type="button" onClick={() => setTransferData({...transferData, amount: wallets.find(w => w.currency === transferData.asset)?.balance || '0'})} className="absolute right-10 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary uppercase tracking-[0.4em] italic hover:scale-110 transition-transform p-4 leading-none">MAX_CAP</button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isProcessing || !transferData.amount || !transferData.to}
                    className="w-full py-10 bg-primary text-primary-foreground font-black uppercase tracking-[0.8em] text-xs rounded-[3rem] shadow-[0_40px_100px_rgba(var(--primary),0.3)] hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-6 relative overflow-hidden group/btn italic leading-none border-0"
                  >
                     {isProcessing ? <Activity className="animate-spin" size={24} strokeWidth={3}/> : <span className="flex items-center gap-6">EXECUTE <ArrowUpRight size={24} strokeWidth={3}/></span>}
                     <div className="absolute inset-0 bg-primary-foreground opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                  </button>
                </form>
              </div>

              {/* COMMAND CENTER */}
              <div className="p-12 bg-background border-2 border-border rounded-[4rem] space-y-12 shadow-[0_60px_120px_rgba(0,0,0,0.1)] dark:shadow-[0_60px_120px_rgba(0,0,0,0.95)] backdrop-blur-3xl relative overflow-hidden group shadow-inner">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                 <h3 className="text-[12px] font-black uppercase tracking-[1em] text-muted-foreground/10 italic leading-none pl-4">Command Center</h3>
                 <div className="grid grid-cols-1 gap-6">
                   <button className="flex items-center gap-8 p-8 bg-muted border-2 border-border hover:bg-primary/5 hover:border-primary/30 rounded-[2.5rem] transition-all group/opt shadow-xl shadow-inner">
                     <div className="p-6 bg-background border-2 border-primary/10 text-primary rounded-2xl shadow-2xl group-hover/opt:scale-110 transition-transform"><Smartphone size={32} strokeWidth={2.5}/></div>
                     <div className="text-left font-black text-xs uppercase tracking-[0.5em] italic group-hover/opt:text-foreground transition-colors leading-[1.5] text-muted-foreground/40">Connect Mobile Signal</div>
                   </button>
                   <button className="flex items-center gap-8 p-8 bg-muted border-2 border-border hover:bg-primary/5 hover:border-primary/30 rounded-[2.5rem] transition-all group/opt shadow-xl shadow-inner">
                     <div className="p-6 bg-background border-2 border-primary/10 text-primary rounded-2xl shadow-2xl group-hover/opt:scale-110 transition-transform"><CreditCard size={32} strokeWidth={2.5}/></div>
                     <div className="text-left font-black text-xs uppercase tracking-[0.5em] italic group-hover/opt:text-foreground transition-colors leading-[1.5] text-muted-foreground/40">Virtual OMEGA Card</div>
                   </button>
                   <button className="flex items-center gap-8 p-8 bg-muted border-2 border-border hover:bg-primary/5 hover:border-primary/30 rounded-[2.5rem] transition-all group/opt shadow-xl shadow-inner">
                     <div className="p-6 bg-background border-2 border-primary/10 text-primary rounded-2xl shadow-2xl group-hover/opt:scale-110 transition-transform"><Lock size={32} strokeWidth={2.5}/></div>
                     <div className="text-left font-black text-xs uppercase tracking-[0.5em] italic group-hover/opt:text-foreground transition-colors leading-[1.5] text-muted-foreground/40">Governance Auth</div>
                   </button>
                 </div>
              </div>

              {/* SECURITY HUD */}
              <div className="p-12 bg-primary/5 border-2 border-primary/30 rounded-[4rem] flex flex-col items-center gap-10 shadow-[0_50px_100px_rgba(var(--primary),0.15)] relative overflow-hidden group shadow-inner">
                 <div className="relative">
                    <ShieldHalf size={80} className="text-primary animate-pulse relative z-10" strokeWidth={2.5} />
                    <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-ping opacity-30" />
                 </div>
                 <div className="text-center space-y-4 relative z-10">
                    <div className="text-[13px] font-black uppercase tracking-[1em] italic text-primary leading-none">Self-Custodial Sync</div>
                    <p className="text-xl text-muted-foreground/30 font-light leading-relaxed italic mx-auto">"Your keys, your sovereignty. OMEGA never stores your private matrix tokens."</p>
                 </div>
              </div>

           </div>

        </div>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-[30vw] font-black italic leading-none uppercase text-foreground">VAULT</div>
      </div>
      
      <style jsx global>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .neural-grid {
          background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }
      `}</style>
    </div>
  );
}
