'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  RefreshCcw, 
  TrendingUp,
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
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/auth?redirect=${encodeURIComponent(currentPath)}`);
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
        const baseWallets = data.wallets || [];
        const hasValle = baseWallets.some((w: any) => w.currency === 'VALLE');
        if (!hasValle) {
          baseWallets.push({ network: 'Sovereign', currency: 'VALLE', balance: 1420.69, usdValue: 1420.69 });
          baseWallets.push({ network: 'Sovereign', currency: 'ValleSovereign', balance: 88.00, usdValue: 440.00 });
        }
        setWallets(baseWallets);
        
        const baseTxs = data.transactions || [];
        if (baseTxs.length === 0) {
          baseTxs.push(
            { id: 'tx-1', type: 'receive', amount: 1420.69, currency: 'VALLE', status: 'completed', date: 'May 14, 2026', network: 'Sovereign' },
            { id: 'tx-2', type: 'buy', amount: 88.0, currency: 'ValleSovereign', status: 'completed', date: 'May 13, 2026', network: 'Sovereign' }
          );
        }
        setTransactions(baseTxs);
      } else {
        setError(data.error);
        if (res.status === 401) {
          localStorage.removeItem('humanese_session');
          router.push(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
        }
      }
    } catch (e) {
      setError('System connection failure. Pulse lost.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const totalBalance = wallets.reduce((acc, curr) => acc + (curr.usdValue || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-12">
        <div className="relative">
           <div className="w-16 h-16 md:w-20 md:h-20 border-t-2 border-primary rounded-full animate-spin shadow-[0_0_30px_hsl(var(--primary))]" />
           <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse italic">Syncing Ledger...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden transition-colors duration-700">
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full neural-grid opacity-[0.03]" />
        <div className="absolute top-[-20%] left-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[250px] rounded-full" />
      </div>

      <header className="relative z-50 w-full p-4 md:p-6 lg:px-12 flex justify-between items-center border-b border-border bg-background/60 backdrop-blur-3xl lg:sticky lg:top-0">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="text-xl md:text-2xl font-black italic tracking-tighter uppercase text-foreground hover:text-primary transition-all flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center text-background shadow-lg shadow-primary/20">Ω</div>
            <span className="hidden xs:inline">Vault_</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8 pointer-events-auto">
            <Link href="/wallet" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic border-b-2 border-primary pb-1">Assets</Link>
            <Link href="/skill-market" className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-foreground transition-all italic">Trade</Link>
            <button className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-foreground transition-all italic">Pay</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => fetchWallet(session?.accessToken)}
            className={`p-2.5 md:p-3 rounded-xl border border-border bg-muted/40 hover:bg-primary/10 transition-all group ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCcw size={18} className="text-muted-foreground group-hover:text-primary" />
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-[1800px] mx-auto px-4 md:px-12 pt-8 md:pt-12 pb-32">
        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          <div className="lg:col-span-8 space-y-8 md:space-y-12">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group p-6 md:p-10 bg-card/40 backdrop-blur-3xl border border-border rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-all duration-1000" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 md:mb-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] italic text-[9px] md:text-[10px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                    Live Pulse Integration
                  </div>
                  <h1 className="text-fluid-balance font-black tracking-tighter leading-none italic text-foreground group-hover:text-primary transition-colors break-words max-w-full">
                    ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h1>
                  <div className="flex items-center gap-3 text-green-500 font-black text-lg md:text-xl italic tracking-tight flex-wrap">
                    <TrendingUp size={20} md:size={24} strokeWidth={3} /> +12.4% <span className="text-muted-foreground/40 text-[9px] md:text-sm uppercase tracking-[0.2em] font-black italic">Resonance</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-8 py-4 bg-primary text-background rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all italic flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
                    <Plus size={18} strokeWidth={3} /> Add Resonance
                  </button>
                  <button className="px-8 py-4 bg-muted border border-border rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-foreground hover:bg-muted/80 transition-all italic flex items-center justify-center gap-3">
                    <ArrowRight size={18} strokeWidth={3} /> Send Shards
                  </button>
                </div>
              </div>

              <div className="h-32 md:h-48 w-full relative z-10 mt-6 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                    d="M0 180 Q 150 160, 250 120 T 450 140 T 650 80 T 850 60 L 1000 40"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    className="drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]"
                  />
                  <path
                    d="M0 180 Q 150 160, 250 120 T 450 140 T 650 80 T 850 60 L 1000 40 L 1000 200 L 0 200 Z"
                    fill="url(#graphGradient)"
                    className="opacity-10"
                  />
                </svg>
                <motion.div 
                  animate={{ x: [0, 1000], opacity: [0, 1, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 bottom-0 w-px bg-primary/40 pointer-events-none"
                />
              </div>

              <div className="flex justify-between mt-6 text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
                {['Genesis', 'Sync_01', 'Sync_02', 'Sync_03', 'Terminal'].map(t => <span key={t}>{t}</span>)}
              </div>
            </motion.div>

            <div className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-foreground">My Assets_</h2>
                <button className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-primary/80 transition-all italic">View All</button>
              </div>
              <div className="grid gap-4 md:gap-6">
                {wallets.map((wallet, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="p-6 md:p-8 bg-card/40 backdrop-blur-3xl border border-border rounded-[2rem] md:rounded-[2.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-primary/40 transition-all cursor-pointer shadow-2xl group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-muted border-2 border-border rounded-xl md:rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all shadow-inner">
                        <Coins size={24} md:size={32} strokeWidth={2.5} />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors leading-none">{wallet.currency}</div>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">{wallet.network}</span>
                           <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                           <span className="text-[9px] text-green-500 font-black tracking-widest uppercase italic">+2.4%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right relative z-10">
                      <div className="text-2xl md:text-3xl font-black text-foreground italic tracking-tight">{wallet.balance.toLocaleString()} <span className="text-xs text-muted-foreground/40">{wallet.currency}</span></div>
                      <div className="text-[10px] text-primary font-black uppercase tracking-[0.2em] italic mt-1 flex items-center sm:justify-end gap-2">
                        ≈ ${wallet.usdValue?.toLocaleString() || '0.00'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="pt-8">
               <TransactionHistory transactions={transactions} />
            </div>

          </div>

          <div className="lg:col-span-4 space-y-8 md:space-y-12 lg:sticky lg:top-28">
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
                  if (res.ok) fetchWallet(session?.accessToken);
                } catch (e) { alert('Trade failed.'); }
              }} 
            />
            
            <div className="p-8 md:p-10 bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] md:rounded-[3rem] space-y-6 relative overflow-hidden group shadow-xl">
               <h3 className="text-xl font-black uppercase italic tracking-tighter text-primary flex items-center gap-3">Sovereign Tip_</h3>
               <p className="text-muted-foreground text-sm italic leading-relaxed">
                 &quot;Your VALLE assets are secured by the OMEGA protocol. Autonomous agents are currently stabilizing the liquidity pool.&quot;
               </p>
            </div>
          </div>

        </div>
      </main>

      <style jsx global>{`
        .neural-grid {
          background-image: linear-gradient(hsl(var(--primary) / 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsl(var(--primary) / 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
