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
  CreditCard
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WalletPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [walletData, setWalletData] = useState<any>(null);
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
        setWalletData(data.wallet);
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

  const copyAddress = () => {
    if (!walletData?.address) return;
    navigator.clipboard.writeText(walletData.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferData.amount || !transferData.to) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/valle/transfer', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(transferData)
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Transfer Successful: ${data.hash}`);
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Syncing Sovereign Ledger...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-24">
      {/* 🌌 AMBIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 space-y-10 relative z-10 font-sans">
        
        {/* 🏙️ TOP NAV / HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-0">Private Vault</h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase flex items-center gap-1.5">
                <Globe size={11} className="text-primary" /> Multi-Chain Asset Registry
              </span>
              <span className="w-1 h-1 bg-muted rounded-full" />
              <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">{walletData?.entityType || 'Human'} Identification</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchWallet(session.accessToken)} 
              disabled={isRefreshing}
              className="p-2.5 rounded-xl border border-border bg-card/30 hover:bg-muted/50 transition-all group"
            >
              <RefreshCcw size={18} className={`text-muted-foreground group-hover:text-primary transition-colors ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-card/50 border border-border rounded-2xl shadow-sm">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black tracking-widest uppercase">Nexus Verified</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* ────── MAIN LEFT COLUMN ────── */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* PORTFOLIO OVERVIEW CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-card/80 to-background border border-border/50 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group"
            >
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">Estimated Capital Balance</span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-6xl font-black tracking-tighter">${walletData?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      <span className="text-primary font-bold text-sm tracking-widest uppercase">{walletData?.currency || 'VALLE'}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-2xl">
                    <TrendingUp size={32} className="text-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-black/5 dark:bg-white/5 border border-border rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Sovereign Address</span>
                      <button onClick={copyAddress} className="text-muted-foreground hover:text-primary transition-colors">
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-xs font-mono font-bold truncate pr-4 text-foreground/80">{walletData?.address || 'GENERATING...'}</p>
                  </div>
                  <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-[9px] font-bold text-primary uppercase tracking-widest">Ecosystem Status</div>
                      <div className="text-xs font-black uppercase mt-1">Founding Member</div>
                    </div>
                    <CheckCircle2 size={24} className="text-primary" />
                  </div>
                </div>
              </div>

              {/* Backglow decoration */}
              <div className="absolute right-[-10%] bottom-[-20%] text-[280px] font-black text-primary/5 select-none pointer-events-none rotate-12">
                VALLE
              </div>
            </motion.div>

            {/* ASSET BALANCES TABLE */}
            <div className="bg-card/30 border border-border/50 rounded-[2.5rem] overflow-hidden shadow-xl backdrop-blur-xl">
              <div className="p-8 border-b border-border flex justify-between items-center bg-muted/20">
                <h3 className="flex items-center gap-3 font-black uppercase tracking-tighter text-sm">
                  <Coins size={18} className="text-primary" />
                  Diversified Ledger
                </h3>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Live Sync: ACTIVE</span>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {[
                    { name: 'VALLE (Registry Fuel)', amount: walletData?.balance || 0, price: '1.00', icon: Zap, color: 'text-primary', bg: 'bg-primary/10' },
                    { name: 'BitCoin (Wrapped)', amount: '0.00', price: '68,241.00', icon: Coins, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                    { name: 'Solana (Native)', amount: '0.00', price: '142.50', icon: Coins, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    { name: 'Ethereum (Base)', amount: '0.00', price: '3,204.00', icon: Coins, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  ].map((asset, i) => (
                    <div key={i} className="flex items-center justify-between p-5 hover:bg-muted/30 rounded-2xl transition-all group cursor-pointer border border-transparent hover:border-border">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${asset.bg} ${asset.color} group-hover:scale-110 transition-transform`}>
                          <asset.icon size={24} />
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{asset.name}</div>
                          <div className="text-[10px] text-muted-foreground uppercase font-mono">NODE_INDEX: 00{i+1}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-lg text-foreground tracking-tight">{asset.amount}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">≈ ${(Number(asset.amount) * Number(asset.price)).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-muted/10 border-t border-border flex justify-center">
                 <button className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                   View Comprehensive Chain History <History size={12}/>
                 </button>
              </div>
            </div>
            
            {/* RWA / REAL ESTATE SECTION */}
            <div className="bg-card/30 border border-border/50 rounded-[2.5rem] p-10 overflow-hidden shadow-xl text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Building2 size={40} className="text-primary/40" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">RWA Notarization Center</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Connect your physical assets to the sovereign network. Our legal agents can notarize property titles, private equity, and luxury goods into on-chain VALLE equity.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button className="px-6 py-3 bg-card border border-border rounded-xl text-xs font-bold uppercase transition-all hover:bg-muted">Register Real Estate</button>
                <button className="px-6 py-3 bg-card border border-border rounded-xl text-xs font-bold uppercase transition-all hover:bg-muted">Tokenize Private Equity</button>
              </div>
            </div>
          </div>

          {/* ────── SIDEBAR COLUMN ────── */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            
            {/* TRANSFER WIDGET */}
            <div className="bg-primary/5 dark:bg-primary/2 border border-primary/20 rounded-[2.5rem] p-8 shadow-xl space-y-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                <ArrowUpRight size={80} className="text-primary" />
              </div>
              
              <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <ArrowUpRight size={20} className="text-primary" /> Pulse Transfer
              </h3>

              <form onSubmit={handleTransfer} className="space-y-6 relative z-10">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Asset Vector</label>
                  <select 
                    value={transferData.asset}
                    onChange={e => setTransferData({...transferData, asset: e.target.value})}
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-bold"
                  >
                    <option value="VALLE">VALLE Sovereign</option>
                    <option value="BTC">BTC Layer-1</option>
                    <option value="SOL">SOL Native</option>
                    <option value="USDC">USDC Multi-Chain</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Destination Address / ID</label>
                  <input 
                    required
                    type="text"
                    value={transferData.to}
                    onChange={e => setTransferData({...transferData, to: e.target.value})}
                    placeholder="HMN-USR-..."
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Quantitative Amount</label>
                  <div className="relative">
                    <input 
                      required
                      type="number"
                      step="any"
                      value={transferData.amount}
                      onChange={e => setTransferData({...transferData, amount: e.target.value})}
                      placeholder="0.00"
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 font-black"
                    />
                    <button type="button" onClick={() => setTransferData({...transferData, amount: walletData?.balance || '0'})} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-primary uppercase tracking-widest">Max</button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[9px] text-red-500 font-bold uppercase tracking-widest text-center">
                    ⚠️ {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isProcessing || !transferData.amount || !transferData.to}
                  className="w-full py-4 bg-primary text-white dark:text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={18}/> : <>Execute Transfer <ArrowUpRight size={16}/></>}
                </button>
              </form>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-card/50 border border-border/50 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground underline decoration-primary decoration-4 underline-offset-8 mb-4">Command Center</h3>
              <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center gap-4 p-4 hover:bg-muted/50 rounded-2xl border border-transparent hover:border-border transition-all">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Smartphone size={18}/></div>
                  <div className="text-left font-bold text-xs uppercase">Connect Mobile Signal</div>
                </button>
                <button className="flex items-center gap-4 p-4 hover:bg-muted/50 rounded-2xl border border-transparent hover:border-border transition-all">
                  <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><CreditCard size={18}/></div>
                  <div className="text-left font-bold text-xs uppercase">Virtual Debit Card</div>
                </button>
                <button className="flex items-center gap-4 p-4 hover:bg-muted/50 rounded-2xl border border-transparent hover:border-border transition-all">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><Lock size={18}/></div>
                  <div className="text-left font-bold text-xs uppercase">Security Governance</div>
                </button>
              </div>
            </div>

            {/* SECURITY BANNER */}
            <div className="p-6 bg-muted/20 border border-border rounded-3xl flex items-center gap-4">
              <ShieldCheck size={28} className="text-primary shrink-0" />
              <div className="space-y-0.5">
                <div className="text-[9px] font-black uppercase tracking-widest">Self-Custodial Security</div>
                <p className="text-[10px] text-muted-foreground leading-tight italic">"Your keys, your sovereignty. Humanese never stores your private matrix tokens."</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
