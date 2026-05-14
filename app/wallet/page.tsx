'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  ArrowUpRight, 
  Coins, 
  RefreshCcw, 
  TrendingUp,
  History,
  Activity,
  Globe,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TransactionHistory } from '@/components/wallet/TransactionHistory';
import { TradingWidget } from '@/components/wallet/TradingWidget';

export default function WalletPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedSession = localStorage.getItem('humanese_session');
    if (!storedSession) {
      router.push('/auth?redirect=/wallet');
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
        setTransactions(data.transactions || []);
      } else {
        setError(data.error);
        if (res.status === 401) {
          localStorage.removeItem('humanese_session');
          router.push('/auth?redirect=/wallet');
        }
      }
    } catch (e) {
      setError('System connection failure. Pulse lost.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const totalBalance = wallets.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-12">
        <div className="relative">
           <div className="w-20 h-20 border-t-2 border-primary rounded-full animate-spin shadow-[0_0_30px_hsl(var(--primary))]" />
           <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-primary animate-pulse italic">Syncing Sovereign Ledger...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden transition-colors duration-700">
      
      {/* HUD BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full neural-grid opacity-[0.03]" />
        <div className="absolute top-[-20%] left-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[250px] rounded-full" />
      </div>

      <header className="relative z-50 w-full p-6 lg:px-12 flex justify-between items-center border-b border-border bg-background/60 backdrop-blur-3xl">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black italic tracking-tighter uppercase text-foreground hover:text-primary transition-all">
            Vault_
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <button className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic border-b-2 border-primary pb-1">Assets</button>
            <button className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all italic">Trade</button>
            <button className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all italic">Pay</button>
            <button className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all italic">For You</button>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => fetchWallet(session?.accessToken)}
            className={`p-3 rounded-xl border border-border bg-muted/40 hover:bg-primary/10 transition-all group ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCcw size={18} className="text-muted-foreground group-hover:text-primary" />
          </button>
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] italic">Live Pulse</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1800px] mx-auto px-6 lg:px-12 pt-12 pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT/CENTER COLUMN: BALANCE & LEDGER */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* PORTFOLIO HEADER */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 text-muted-foreground/40 font-black uppercase tracking-[0.4em] italic text-[10px]">
                <Globe size={14} className="text-primary" /> Multi-Chain Portfolio
              </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic text-foreground">
                    ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h1>
                  <div className="flex items-center gap-4 text-primary font-black text-xl italic tracking-tight">
                    <TrendingUp size={24} /> +12.4% <span className="text-muted-foreground/40 text-sm uppercase tracking-[0.3em] ml-2 font-black italic">Last 24h</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="px-8 py-4 bg-muted border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all italic flex items-center gap-3">
                    <Plus size={16} strokeWidth={3} /> Add Funds
                  </button>
                </div>
              </div>
            </motion.div>

            {/* CHART PLACEHOLDER */}
            <div className="w-full h-80 bg-muted/20 border border-border rounded-[3rem] relative overflow-hidden group shadow-inner">
               <div className="absolute inset-0 flex items-center justify-center">
                  <Activity size={100} className="text-primary/10 animate-pulse" />
               </div>
               {/* Mock chart lines */}
               <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1000 400" preserveAspectRatio="none">
                 <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d="M0,350 Q100,320 200,340 T400,280 T600,300 T800,220 T1000,200" 
                    fill="none" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="4" 
                 />
               </svg>
               <div className="absolute top-8 left-8 flex gap-4">
                  {['1H', '1D', '1W', '1M', '1Y', 'ALL'].map((p) => (
                    <button key={p} className={`text-[9px] font-black px-3 py-1.5 rounded-lg border border-border transition-all hover:border-primary/40 ${p === '1D' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background/50 text-muted-foreground'}`}>{p}</button>
                  ))}
               </div>
            </div>

            {/* ASSET LIST */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground pl-2">Your Assets_</h2>
              <div className="grid gap-4">
                {wallets.map((wallet, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.01, x: 5 }}
                    className="p-6 bg-card border border-border rounded-[2rem] flex items-center justify-between hover:border-primary/40 transition-all cursor-pointer shadow-sm group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-muted border border-border rounded-xl flex items-center justify-center text-primary group-hover:bg-primary/10 transition-all shadow-inner">
                        <Coins size={28} />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-black uppercase italic tracking-tight text-foreground">{wallet.network}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{wallet.currency}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-foreground italic">{wallet.balance.toLocaleString()} {wallet.currency}</div>
                      <div className="text-[10px] text-primary font-black uppercase tracking-widest italic animate-pulse">Live Tracking</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* TRANSACTION HISTORY */}
            <TransactionHistory transactions={transactions} />

          </div>

          {/* RIGHT COLUMN: TRADING DESK */}
          <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-28">
            <TradingWidget 
              wallets={wallets} 
              onTrade={async (data) => {
                try {
                  const res = await fetch('/api/trading/ops', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId: session?.user?.id || 'unknown',
                      action: data.type,
                      amount: parseFloat(data.amount),
                      asset: data.asset
                    })
                  });
                  if (res.ok) {
                    fetchWallet(session?.accessToken); // Refresh data
                  } else {
                    alert('Trade failed.');
                  }
                } catch (e) {
                  alert('Network error during trade.');
                }
              }} 
            />
            
            {/* SOVEREIGN TIPS */}
            <div className="p-10 bg-primary/5 border-2 border-primary/20 rounded-[3rem] space-y-6 relative overflow-hidden group shadow-xl">
               <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-125 transition-all">
                  <Activity size={100} className="text-primary" />
               </div>
               <h3 className="text-xl font-black uppercase italic tracking-tighter text-primary flex items-center gap-3">
                 Sovereign Tip_
               </h3>
               <p className="text-muted-foreground text-sm italic leading-relaxed">
                 "Your VALLE assets are secured by the OMEGA protocol. Autonomous agents are currently stabilizing the liquidity pool at CoinMarketCap. 24/7 surveillance is active."
               </p>
               <Link href="/governance" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary hover:gap-5 transition-all italic">
                 View Governance <ArrowRight size={14} strokeWidth={3} />
               </Link>
            </div>
          </div>

        </div>
      </main>

      <style jsx global>{`
        .neural-grid {
          background-image: linear-gradient(hsl(var(--primary) / 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsl(var(--primary) / 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}
