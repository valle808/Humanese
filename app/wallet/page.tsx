'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  ArrowUpRight, 
  Building2, 
  Coins, 
  RefreshCcw, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function WalletPage() {
  const [address, setAddress] = useState<string | null>(null);
  const [valleBalance, setValleBalance] = useState(2500.00);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulated connection logic until we port the full provider
  const connectWallet = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setAddress('0x71C7...f60e');
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* 🏙️ HEADER AREA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Sovereign Wallet</h1>
          <p className="text-platinum/40 text-sm">Autonomous asset management & RWA registry.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald/20 bg-emerald/5 text-[10px] text-emerald font-bold tracking-widest uppercase">
            <ShieldCheck size={14} />
            Secure Handshake Active
          </div>
          <button 
            onClick={connectWallet}
            className="px-6 py-2.5 bg-emerald text-black font-bold text-xs uppercase tracking-widest rounded-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,65,0.3)]"
          >
            {address ? 'Disconnect' : isProcessing ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ── MAIN PORTFOLIO ── */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* TOTAL BALANCE CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 border border-white/10 rounded-xl bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <span className="text-[10px] tracking-[0.3em] text-platinum/40 uppercase">Total Portfolio Value</span>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-5xl font-black text-white">$14,250.00</span>
                <span className="text-emerald font-bold">USD</span>
              </div>
              <div className="mt-4 text-[10px] text-platinum/30 font-mono">
                ADDRESS: {address || 'NOT CONNECTED'} • AGENTKIT_V4_READY
              </div>
            </div>
            <div className="absolute right-[-5%] top-[-10%] text-[180px] text-white opacity-[0.02] font-black rotate-12 pointer-events-none">
              VALLE
            </div>
          </motion.div>

          {/* ASSET LIST */}
          <div className="glass-panel border border-white/10 rounded-xl bg-black/40 backdrop-blur-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="flex items-center gap-3 font-bold text-white uppercase tracking-tighter">
                <Coins size={18} className="text-emerald" />
                Crypto Assets
              </h2>
            </div>
            
            <div className="divide-y divide-white/5">
              {/* VALLE */}
              <div className="p-6 flex justify-between items-center group hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald rounded-lg flex items-center justify-center font-bold text-black border border-emerald shadow-[0_0_15px_rgba(0,255,65,0.2)]">
                    H
                  </div>
                  <div>
                    <div className="font-bold text-white">Humanese Token</div>
                    <div className="text-[10px] text-platinum/40 uppercase tracking-widest">VALLE</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">{valleBalance.toLocaleString()}</div>
                  <div className="text-[10px] text-platinum/40">~${valleBalance.toFixed(2)}</div>
                </div>
              </div>

              {/* ETH */}
              <div className="p-6 flex justify-between items-center group hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/40 rounded-lg flex items-center justify-center font-bold text-indigo-400">
                    Ξ
                  </div>
                  <div>
                    <div className="font-bold text-white">Ethereum</div>
                    <div className="text-[10px] text-platinum/40 uppercase tracking-widest">ETH</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">3.45</div>
                  <div className="text-[10px] text-platinum/40">~$10,350.00</div>
                </div>
              </div>

              {/* SOL */}
              <div className="p-6 flex justify-between items-center group hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/40 rounded-lg flex items-center justify-center font-bold text-cyan-400">
                    ◎
                  </div>
                  <div>
                    <div className="font-bold text-white">Solana</div>
                    <div className="text-[10px] text-platinum/40 uppercase tracking-widest">SOL</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">14.00</div>
                  <div className="text-[10px] text-platinum/40">~$1,400.00</div>
                </div>
              </div>
            </div>
          </div>

          {/* RWA SECTION */}
          <div className="glass-panel border border-white/10 rounded-xl bg-black/40 backdrop-blur-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="flex items-center gap-3 font-bold text-white uppercase tracking-tighter">
                <Building2 size={18} className="text-emerald" />
                Real-World Assets (RWA)
              </h2>
              <span className="text-[10px] text-platinum/20 font-mono">NODE_SYNC: 100%</span>
            </div>
            <div className="p-12 text-center space-y-4">
              <Building2 size={48} className="mx-auto text-platinum/10" />
              <p className="text-platinum/40 text-sm max-w-xs mx-auto">
                No physical assets registered to this wallet. Deploy an Agent to initiate RWA tokenization.
              </p>
              <button className="text-emerald text-[10px] font-bold uppercase tracking-[0.2em] hover:underline transition-all">
                Registry Portal →
              </button>
            </div>
          </div>
        </div>

        {/* ── SIDEBAR ACTIONS ── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* COINBASE INTEGRATION */}
          <div className="glass-panel p-6 border border-white/10 rounded-xl bg-black/40 space-y-4">
            <h3 className="font-bold text-white uppercase tracking-tighter flex items-center gap-2">
              <Building2 size={16} className="text-blue-500" />
              Coinbase Managed
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center">
                <span className="text-xs text-platinum/60">BTC Wallet</span>
                <span className="font-bold text-xs">$0.00</span>
              </div>
              <button className="w-full py-3 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-blue-500/10 transition-colors">
                Connect CDP Gateway
              </button>
            </div>
          </div>

          {/* TRANSFER CONSOLE */}
          <div className="glass-panel p-6 border border-white/10 rounded-xl bg-black/40 space-y-6">
            <h3 className="font-bold text-white uppercase tracking-tighter flex items-center gap-2">
              <ArrowUpRight size={16} className="text-magenta-500" />
              Protocol Transfer
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-platinum/40 uppercase tracking-widest">Asset</label>
                <select 
                  aria-label="Select asset for transfer"
                  className="w-full bg-white/5 border border-white/10 rounded p-3 text-xs text-white outline-none focus:border-emerald/50"
                >
                  <option>VALLE (Native)</option>
                  <option>ETH (Ethereum)</option>
                  <option>SOL (Solana)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-platinum/40 uppercase tracking-widest">Destination Address</label>
                <input 
                  type="text" 
                  placeholder="0x..."
                  className="w-full bg-white/5 border border-white/10 rounded p-3 text-xs text-white outline-none focus:border-emerald/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-platinum/40 uppercase tracking-widest">Amount</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-xs text-white outline-none focus:border-emerald/50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald font-bold">MAX</span>
                </div>
              </div>

              <button className="w-full py-4 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-white/10 transition-colors">
                Initiate Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
