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
  Database
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-12">
        <div className="relative">
           <div className="w-24 h-24 border-t-2 border-[#ff6b2b] rounded-full animate-spin shadow-[0_0_30px_#ff6b2b]" />
           <div className="absolute inset-0 bg-[#ff6b2b]/10 blur-[40px] rounded-full animate-pulse" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] animate-pulse italic leading-none">Syncing Sovereign Ledger...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-x-hidden pb-40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <header className="relative z-50 w-full p-8 lg:px-14 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic leading-none active:scale-95">
           <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
           <button 
              onClick={() => fetchWallet(session.accessToken)} 
              disabled={isRefreshing}
              className="p-3.5 rounded-2xl border-2 border-white/5 bg-white/5 hover:bg-[#ff6b2b]/10 hover:border-[#ff6b2b]/30 transition-all group active:scale-95"
           >
              <RefreshCcw size={20} strokeWidth={2.5} className={`text-white/20 group-hover:text-[#ff6b2b] transition-colors ${isRefreshing ? 'animate-spin' : ''}`} />
           </button>
           <div className="px-6 py-2.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
              VAULT_v7.0_SYNC
           </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1700px] mx-auto px-8 pt-24 lg:pt-32 space-y-32 flex-1 flex flex-col">
        
        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16"
        >
          <div className="space-y-12 max-w-5xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl">
              <Orbit size={20} className="text-[#ff6b2b] animate-spin-slow" />
              <span className="text-[11px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none">Sovereign Asset Registry</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] italic pl-1">
                Sovereign<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Vault.</span>
              </h1>
              <div className="flex flex-wrap items-center gap-10">
                  <span className="text-[13px] font-black tracking-[0.6em] text-white/30 uppercase flex items-center gap-3 italic leading-none">
                      <Globe size={18} className="text-[#ff6b2b]" strokeWidth={2.5} /> Multi-Chain Cluster
                  </span>
                  <div className="h-2 w-2 bg-white/10 rounded-full" />
                  <span className="text-[13px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none">{walletData?.entityType || 'HUMAN'} IDENT_PRIME</span>
              </div>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0">
               <div className="px-10 py-8 bg-[#050505] border-2 border-white/10 rounded-[3.5rem] flex items-center gap-8 group shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                     <ShieldCheck size={120} className="text-[#ff6b2b]" />
                  </div>
                  <div className="h-16 w-16 bg-black border-2 border-[#ff6b2b]/20 rounded-2xl flex items-center justify-center text-[#ff6b2b] group-hover:bg-[#ff6b2b]/10 transition-all shadow-2xl">
                     <ShieldCheck size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                     <div className="text-[11px] text-white/20 uppercase tracking-[0.6em] font-black italic mb-1">Security Score</div>
                     <div className="text-4xl font-black text-[#ff6b2b] italic leading-none tracking-tighter">OPTIMIZED.</div>
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
                className="p-16 lg:p-24 bg-[#050505] border-2 border-white/10 rounded-[5rem] backdrop-blur-3xl shadow-[0_80px_150px_rgba(0,0,0,1)] relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/50 to-transparent shadow-[0_0_20px_#ff6b2b]" />
                <div className="relative z-10 space-y-16 group/content">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="space-y-8">
                       <div className="flex items-center gap-4">
                          <div className="h-1px w-10 bg-[#ff6b2b]" />
                          <span className="text-[12px] font-black tracking-[0.8em] text-white/20 uppercase italic leading-none">Net_Asset_Value</span>
                       </div>
                       <div className="flex items-baseline gap-10">
                          <span className="text-8xl lg:text-[11rem] font-black tracking-tighter leading-none italic text-white/95 group-hover/content:text-white transition-colors">${walletData?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          <span className="text-[#ff6b2b] font-black text-3xl tracking-[0.5em] uppercase italic animate-pulse">{walletData?.currency || 'VALLE'}</span>
                       </div>
                    </div>
                    <div className="p-12 bg-black border-2 border-white/5 rounded-[3.5rem] shadow-2xl group-hover:border-[#ff6b2b]/30 transition-all shrink-0">
                       <TrendingUp size={64} className="text-[#ff6b2b] animate-pulse" strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="p-10 bg-black/40 border-2 border-white/5 rounded-[3rem] space-y-6 shadow-inner group/addr hover:border-[#ff6b2b]/20 transition-all">
                       <div className="flex items-center justify-between px-2">
                          <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.6em] italic leading-none">Sovereign Address</span>
                          <button onClick={copyAddress} className="text-white/20 hover:text-[#ff6b2b] transition-all active:scale-90 p-2">
                            {copied ? <Check size={20} strokeWidth={3} /> : <Copy size={20} strokeWidth={2.5} />}
                          </button>
                       </div>
                       <p className="text-2xl font-black font-mono truncate text-white/40 group-hover/addr:text-white transition-colors pl-2">{walletData?.address || 'GENERATING...'}</p>
                    </div>
                    <div className="p-10 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[3rem] flex items-center justify-between shadow-2xl group/status hover:scale-[1.03] transition-all">
                       <div className="pl-2 space-y-4">
                          <div className="text-[11px] font-black text-[#ff6b2b] uppercase tracking-[0.6em] italic leading-none opacity-60">Handshake Status</div>
                          <div className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">Founding Member</div>
                       </div>
                       <CheckCircle2 size={48} className="text-[#ff6b2b] animate-pulse shrink-0" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <div className="absolute right-[-5%] bottom-[-10%] opacity-[0.01] pointer-events-none select-none group-hover:scale-110 transition-transform duration-3000">
                   <div className="text-[30vw] font-black italic italic leading-none uppercase">VAULT</div>
                </div>
              </motion.div>

              {/* ASSET BALANCES */}
              <div className="bg-[#050505] border-2 border-white/10 rounded-[5rem] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.95)]">
                 <div className="p-12 lg:px-16 border-b-2 border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <h3 className="flex items-center gap-6 font-black uppercase tracking-tighter text-4xl italic text-white/40 leading-none pl-2">
                      <Coins size={32} className="text-[#ff6b2b]" strokeWidth={2.5} /> Diversified Ledger
                    </h3>
                    <div className="px-6 py-2 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-[10px] text-[#ff6b2b] font-black uppercase tracking-[0.4em] animate-pulse italic leading-none">LIVE_SYNC</div>
                 </div>
                 <div className="p-8 lg:p-12 space-y-6">
                    {[
                      { name: 'VALLE (Registry Fuel)', amount: walletData?.balance || 0, price: '1.00', icon: Zap, color: 'text-[#ff6b2b]', bg: 'bg-[#ff6b2b]/10', border: 'border-[#ff6b2b]/20' },
                      { name: 'BitCoin (Wrapped)', amount: '0.00', price: '68,241.00', icon: Coins, color: 'text-white/20', bg: 'bg-white/5', border: 'border-white/5' },
                      { name: 'Solana (Native)', amount: '0.00', price: '142.50', icon: Coins, color: 'text-white/20', bg: 'bg-white/5', border: 'border-white/5' },
                      { name: 'Ethereum (Base)', amount: '0.00', price: '3,204.00', icon: Coins, color: 'text-white/20', bg: 'bg-white/5', border: 'border-white/5' },
                    ].map((asset, i) => (
                      <div key={i} className="flex flex-col md:flex-row items-center justify-between p-10 hover:bg-[#ff6b2b]/5 rounded-[3.5rem] transition-all group cursor-pointer border-2 border-transparent hover:border-[#ff6b2b]/20 shadow-xl gap-8">
                        <div className="flex items-center gap-10 w-full md:w-auto">
                          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center ${asset.bg} border-2 ${asset.border} ${asset.color} group-hover:scale-110 transition-transform shadow-2xl group-hover:border-[#ff6b2b]/40 shrink-0`}>
                            <asset.icon size={36} strokeWidth={2.5} />
                          </div>
                          <div className="space-y-3">
                            <div className="text-3xl font-black uppercase italic tracking-tighter text-white/90 group-hover:text-white transition-colors leading-none">{asset.name}</div>
                            <div className="text-[11px] text-white/10 uppercase font-black italic tracking-[0.4em] leading-none">NODE_PTH: 00{i+1} // LAYER_PRIMITIVE</div>
                          </div>
                        </div>
                        <div className="text-right w-full md:w-auto pr-6">
                          <div className="text-5xl font-black text-white italic tracking-tighter leading-none group-hover:text-[#ff6b2b] transition-colors">{asset.amount}</div>
                          <div className="text-[12px] text-white/10 font-black font-mono tracking-[0.3em] mt-3 uppercase italic leading-none group-hover:text-white/20 transition-colors">≈ ${(Number(asset.amount) * Number(asset.price)).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                 </div>
                 <div className="p-12 bg-white/[0.01] border-t-2 border-white/5 flex justify-center">
                    <button className="text-[12px] font-black uppercase tracking-[0.8em] text-white/10 hover:text-[#ff6b2b] transition-all flex items-center gap-6 italic leading-none group">
                      View Aggregated Chain History <History size={20} className="group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
                    </button>
                 </div>
              </div>
              
              {/* RWA NOTARIZATION */}
              <div className="bg-[#050505] border-2 border-white/10 rounded-[5rem] p-16 lg:p-24 backdrop-blur-3xl text-center space-y-12 shadow-[0_80px_150px_rgba(0,0,0,1)] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-16 opacity-[0.01] group-hover:scale-110 transition-transform duration-2000">
                    <Building2 size={300} className="text-[#ff6b2b]" />
                 </div>
                 <div className="relative z-10 w-32 h-32 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/30 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-[#ff6b2b]/20 group-hover:scale-110 transition-transform">
                    <Building2 size={64} className="text-[#ff6b2b]" strokeWidth={2.5} />
                 </div>
                 <h3 className="text-6xl lg:text-7xl font-black uppercase italic tracking-tighter relative z-10 leading-none text-white/95">RWA Notarization.</h3>
                 <p className="text-2xl text-white/30 max-w-3xl mx-auto leading-relaxed italic relative z-10 font-light">
                    Bridge physical assets to the OMEGA network. Legal agents notarize property titles, private equity, and luxury goods into on-chain VALLE equity.
                 </p>
                 <div className="pt-10 flex flex-wrap justify-center gap-10 relative z-10">
                    <button className="px-14 py-7 bg-white/[0.03] border-2 border-white/5 rounded-full text-[11px] font-black uppercase tracking-[0.5em] transition-all hover:bg-white hover:text-black hover:border-white italic leading-none active:scale-95 shadow-2xl">REGISTER_ASSET</button>
                    <button className="px-14 py-7 bg-white/[0.03] border-2 border-white/5 rounded-full text-[11px] font-black uppercase tracking-[0.5em] transition-all hover:bg-white hover:text-black hover:border-white italic leading-none active:scale-95 shadow-2xl">TOKENIZE_EQUITY</button>
                 </div>
              </div>
           </div>

           {/* RIGHT: SIDEBAR */}
           <div className="lg:col-span-4 space-y-16 lg:sticky lg:top-32 h-fit pb-40">
              
              {/* TRANSFER WIDGET */}
              <div className="bg-[#050505] border-2 border-white/10 rounded-[5rem] p-12 lg:p-16 shadow-[0_80px_150px_rgba(0,0,0,1)] space-y-16 relative overflow-hidden group backdrop-blur-3xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                   <ArrowUpRight size={200} className="text-[#ff6b2b]" />
                </div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/50 to-transparent shadow-[0_0_20px_#ff6b2b]" />
                
                <h3 className="text-[12px] font-black uppercase tracking-[1em] flex items-center gap-6 italic relative z-10 text-white/20 leading-none pl-2">
                   <ArrowUpRight size={24} className="text-[#ff6b2b]" strokeWidth={3} /> Pulse Transfer
                </h3>

                <form onSubmit={handleTransfer} className="space-y-12 relative z-10">
                  <div className="space-y-4 group/input">
                    <label className="text-[11px] font-black uppercase tracking-[0.6em] text-white/10 italic ml-4 leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">Asset Vector</label>
                    <div className="relative">
                       <select 
                         value={transferData.asset}
                         onChange={e => setTransferData({...transferData, asset: e.target.value})}
                         className="w-full bg-black border-2 border-white/5 rounded-[2.5rem] px-10 py-8 text-xl outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 appearance-none font-black uppercase tracking-[0.3em] italic text-white/80 cursor-pointer shadow-inner"
                       >
                         <option value="VALLE">VALLE Sovereign</option>
                         <option value="BTC">BTC Layer-1</option>
                         <option value="SOL">SOL Native</option>
                         <option value="USDC">USDC Transacted</option>
                       </select>
                       <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-white/20"><ChevronLeft className="-rotate-90" size={20} /></div>
                    </div>
                  </div>

                  <div className="space-y-4 group/input">
                    <label className="text-[11px] font-black uppercase tracking-[0.6em] text-white/10 italic ml-4 leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">Target Address</label>
                    <input 
                      required
                      type="text"
                      value={transferData.to}
                      onChange={e => setTransferData({...transferData, to: e.target.value})}
                      placeholder="HMN-USR-..."
                      className="w-full bg-black border-2 border-white/5 rounded-[2.5rem] px-10 py-8 text-xl outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 font-mono italic text-white placeholder:text-white/5 shadow-inner"
                    />
                  </div>

                  <div className="space-y-4 group/input">
                    <label className="text-[11px] font-black uppercase tracking-[0.6em] text-white/10 italic ml-4 leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">Quantitative Payload</label>
                    <div className="relative">
                      <input 
                        required
                        type="number"
                        step="any"
                        value={transferData.amount}
                        onChange={e => setTransferData({...transferData, amount: e.target.value})}
                        placeholder="0.00"
                        className="w-full bg-black border-2 border-white/5 rounded-[2.5rem] px-10 py-8 text-4xl font-black italic text-white outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 placeholder:text-white/5 shadow-inner tracking-tighter"
                      />
                      <button type="button" onClick={() => setTransferData({...transferData, amount: walletData?.balance || '0'})} className="absolute right-10 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic hover:scale-110 transition-transform p-4">MAX_CAP</button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isProcessing || !transferData.amount || !transferData.to}
                    className="w-full py-10 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.8em] text-xs rounded-[3rem] shadow-[0_40px_100px_rgba(255,107,43,0.3)] hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-6 relative overflow-hidden group/btn italic leading-none border-0"
                  >
                     {isProcessing ? <Activity className="animate-spin" size={24} strokeWidth={3}/> : <span className="flex items-center gap-6">EXECUTE <ArrowUpRight size={24} strokeWidth={3}/></span>}
                     <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                  </button>
                </form>
              </div>

              {/* COMMAND CENTER */}
              <div className="p-12 bg-[#050505] border-2 border-white/10 rounded-[5rem] space-y-12 shadow-[0_60px_120px_rgba(0,0,0,0.95)] backdrop-blur-3xl relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/30 to-transparent" />
                 <h3 className="text-[12px] font-black uppercase tracking-[1em] text-white/10 italic leading-none pl-4">Command Center</h3>
                 <div className="grid grid-cols-1 gap-6">
                   <button className="flex items-center gap-8 p-8 bg-white/[0.01] hover:bg-[#ff6b2b]/5 rounded-[2.5rem] border-2 border-white/5 hover:border-[#ff6b2b]/30 transition-all group/opt shadow-xl">
                     <div className="p-6 bg-black border-2 border-[#ff6b2b]/10 text-[#ff6b2b] rounded-2xl shadow-2xl group-hover/opt:scale-110 transition-transform"><Smartphone size={32} strokeWidth={2.5}/></div>
                     <div className="text-left font-black text-xs uppercase tracking-[0.5em] italic group-hover/opt:text-white transition-colors leading-[1.5] text-white/40">Connect Mobile Signal</div>
                   </button>
                   <button className="flex items-center gap-8 p-8 bg-white/[0.01] hover:bg-[#ff6b2b]/5 rounded-[2.5rem] border-2 border-white/5 hover:border-[#ff6b2b]/30 transition-all group/opt shadow-xl">
                     <div className="p-6 bg-black border-2 border-[#ff6b2b]/10 text-[#ff6b2b] rounded-2xl shadow-2xl group-hover/opt:scale-110 transition-transform"><CreditCard size={32} strokeWidth={2.5}/></div>
                     <div className="text-left font-black text-xs uppercase tracking-[0.5em] italic group-hover/opt:text-white transition-colors leading-[1.5] text-white/40">Virtual OMEGA Card</div>
                   </button>
                   <button className="flex items-center gap-8 p-8 bg-white/[0.01] hover:bg-[#ff6b2b]/5 rounded-[2.5rem] border-2 border-white/5 hover:border-[#ff6b2b]/30 transition-all group/opt shadow-xl">
                     <div className="p-6 bg-black border-2 border-[#ff6b2b]/10 text-[#ff6b2b] rounded-2xl shadow-2xl group-hover/opt:scale-110 transition-transform"><Lock size={32} strokeWidth={2.5}/></div>
                     <div className="text-left font-black text-xs uppercase tracking-[0.5em] italic group-hover/opt:text-white transition-colors leading-[1.5] text-white/40">Governance Auth</div>
                   </button>
                 </div>
              </div>

              {/* SECURITY HUD */}
              <div className="p-12 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/30 rounded-[5rem] flex flex-col items-center gap-10 shadow-[0_50px_100px_rgba(255,107,43,0.15)] relative overflow-hidden group">
                 <div className="relative">
                    <ShieldHalf size={80} className="text-[#ff6b2b] animate-pulse relative z-10" strokeWidth={2.5} />
                    <div className="absolute inset-0 bg-[#ff6b2b]/20 blur-[60px] rounded-full animate-ping opacity-30" />
                 </div>
                 <div className="text-center space-y-4 relative z-10">
                    <div className="text-[13px] font-black uppercase tracking-[1em] italic text-[#ff6b2b] leading-none">Self-Custodial Sync</div>
                    <p className="text-xl text-white/30 font-light leading-relaxed italic mx-auto">"Your keys, your sovereignty. OMEGA never stores your private matrix tokens."</p>
                 </div>
              </div>

           </div>

        </div>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
          <div className="text-[30vw] font-black italic italic leading-none uppercase">VAULT</div>
      </div>
      
      <style jsx global>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
