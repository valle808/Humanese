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
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [transferAsset, setTransferAsset] = useState('VALLE');
  const [transferAmount, setTransferAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [rwaData, setRwaData] = useState<any[]>([]);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const res = await fetch('/api/coinbase/balances');
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error('Failed to fetch wallet data:', e);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRWA = async () => {
      try {
        const res = await fetch('/api/rwa/registry');
        const json = await res.json();
        if (json.success) setRwaData(json.assets);
      } catch (e) {
        console.error('Failed to fetch RWA registry:', e);
      }
    };

    fetchBalances();
    fetchRWA();
  }, []);

  const connectWallet = async () => {
    setIsProcessing(true);
    try {
      // Simulate/Trigger a secure handshake with the sovereign network
      const res = await fetch('/api/valle/genesis');
      const json = await res.json();
      if (json.success) {
        setAddress(json.genesis.address);
      }
    } catch (e) {
      console.error('Handshake failed', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const initiateTransfer = async () => {
    if (!transferAmount || !destination) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/valle/transfer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              amount: parseFloat(transferAmount),
              asset: transferAsset,
              to: destination
          })
      });
      const json = await res.json();
      if (json.success) {
          alert(`PROTOCOL TRANSFER SUCCESSFUL: ${json.transactionId}\nHash: ${json.hash}`);
      } else {
          alert(`TRANSFER FAILED: ${json.error}`);
      }
    } catch (e) {
      console.error('Transfer failed', e);
    } finally {
      setIsProcessing(false);
      setTransferAmount('');
      setDestination('');
    }
  };

  const totalValue = data ? (
    (data.onChain?.sol?.balance * 100) + 
    (data.onChain?.eth?.balance * 3000) + 
    (data.onChain?.valle?.balance * 1) + 
    (data.coinbase?.reduce((acc: number, curr: any) => acc + (parseFloat(curr.balance) * (curr.currency === 'BTC' ? 60000 : 1)), 0) || 0)
  ) : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24 text-platinum selection:bg-emerald/30">
      {/* 🏙️ HEADER AREA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Sovereign Wallet</h1>
          <p className="text-platinum/40 text-sm italic font-mono">Autonomous asset management & RWA registry.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald/20 bg-emerald/5 text-[10px] text-emerald font-bold tracking-widest uppercase">
            <ShieldCheck size={14} />
            Secure Handshake Active
          </div>
          <button 
            onClick={connectWallet}
            className="px-6 py-2.5 bg-emerald text-black font-bold text-xs uppercase tracking-widest rounded-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)]"
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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 border border-white/10 rounded-xl bg-gradient-to-br from-[#0a0a0a] to-[#121212] shadow-2xl relative overflow-hidden group"
          >
            <div className="relative z-10">
              <span className="text-[10px] tracking-[0.3em] text-platinum/40 uppercase font-black">Total Portfolio Value</span>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-6xl font-black text-white tracking-tighter">
                  ${isLoading ? '---' : totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-emerald font-bold text-sm tracking-widest">USD_SOVEREIGN</span>
              </div>
              <div className="mt-6 flex items-center gap-6">
                <div className="text-[10px] text-platinum/30 font-mono">
                  ADDRESS: <span className="text-emerald/60">{address || 'NOT_LINKED'}</span>
                </div>
                <div className="text-[10px] text-platinum/30 font-mono">
                  STATUS: <span className="text-blue-400">AGENTKIT_V4_READY</span>
                </div>
                {data?.timestamp && (
                  <div className="text-[10px] text-platinum/30 font-mono">
                    SYNC: <span className="text-white/40">{new Date(data.timestamp).toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </div>
            {/* Background Decor */}
            <div className="absolute right-[-2%] top-[-20%] text-[240px] text-white opacity-[0.03] font-black rotate-12 pointer-events-none select-none group-hover:opacity-[0.05] transition-opacity">
              VALLE
            </div>
          </motion.div>

          {/* ASSET LIST */}
          <div className="glass-panel border border-white/10 rounded-xl bg-black/40 backdrop-blur-xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="flex items-center gap-3 font-bold text-white uppercase tracking-tighter text-sm">
                <Coins size={18} className="text-emerald" />
                Treasury Assets (On-Chain)
              </h2>
              <RefreshCcw size={14} className={`text-platinum/20 cursor-pointer hover:text-emerald transition-colors ${isLoading ? 'animate-spin' : ''}`} />
            </div>
            
            <div className="divide-y divide-white/5">
              {/* VALLE */}
              <div className="p-6 flex justify-between items-center group hover:bg-emerald/5 transition-all cursor-default">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald rounded-lg flex items-center justify-center font-black text-xl text-black border border-emerald/50 shadow-[0_0_15px_rgba(0,255,65,0.1)] group-hover:shadow-[0_0_20px_rgba(0,255,65,0.2)] transition-all">
                    V
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-emerald transition-colors">VALLE Token</div>
                    <div className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono">REGISTRY_FUEL_L2</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-white text-lg tracking-tight">{data?.onChain?.valle?.balance || 0}</div>
                  <div className="text-[10px] text-platinum/40 font-mono">~${(data?.onChain?.valle?.balance || 0).toFixed(2)}</div>
                </div>
              </div>

              {/* ETH */}
              <div className="p-6 flex justify-between items-center group hover:bg-indigo-500/5 transition-all cursor-default">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/40 rounded-lg flex items-center justify-center font-black text-xl text-indigo-400 group-hover:scale-110 transition-transform">
                    Ξ
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">Ethereum</div>
                    <div className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono">BASE_NETWORK</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-white text-lg tracking-tight">{data?.onChain?.eth?.balance || 0.00}</div>
                  <div className="text-[10px] text-platinum/40 font-mono">~${((data?.onChain?.eth?.balance || 0) * 3000).toLocaleString()}</div>
                </div>
              </div>

              {/* SOL */}
              <div className="p-6 flex justify-between items-center group hover:bg-cyan-500/5 transition-all cursor-default">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/40 rounded-lg flex items-center justify-center font-black text-xl text-cyan-400 group-hover:scale-110 transition-transform">
                    ◎
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">Solana</div>
                    <div className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono">{data?.onChain?.sol?.address?.substring(0, 12)}...</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-white text-lg tracking-tight">{data?.onChain?.sol?.balance?.toFixed(3) || 0.00}</div>
                  <div className="text-[10px] text-platinum/40 font-mono">~${((data?.onChain?.sol?.balance || 0) * 100).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RWA SECTION */}
          <div className="glass-panel border border-white/10 rounded-xl bg-black/40 backdrop-blur-xl overflow-hidden shadow-xl group">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="flex items-center gap-3 font-bold text-white uppercase tracking-tighter text-sm">
                <Building2 size={18} className="text-emerald" />
                Real-World Assets (RWA) Registry
              </h2>
              <span className="text-[10px] text-emerald/40 font-mono animate-pulse uppercase tracking-widest">
                {rwaData.length > 0 ? `${rwaData.length}_ASSETS_NOTARIZED` : 'Live_Registry_Active'}
              </span>
            </div>
            
            {rwaData.length > 0 ? (
              <div className="divide-y divide-white/5">
                {rwaData.map((asset) => (
                  <div key={asset.id} className="p-6 flex justify-between items-center group hover:bg-emerald/5 transition-all cursor-default">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                        <Building2 size={24} className="text-emerald/40" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{asset.assetName}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono">{asset.assetType}</span>
                          <span className="text-[8px] px-1.5 py-0.5 bg-emerald/10 text-emerald rounded-full border border-emerald/20">{asset.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-white text-lg tracking-tight">{asset.valuationValle.toLocaleString()} VALLE</div>
                      <div className="text-[10px] text-platinum/40 font-mono">ID: {asset.assetId}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center space-y-6">
                <div className="p-6 bg-emerald/5 border border-emerald/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-500">
                  <Building2 size={48} className="text-emerald/20" />
                </div>
                <div className="space-y-2">
                  <p className="text-white font-bold uppercase tracking-widest text-xs">No notarized assets detected</p>
                  <p className="text-platinum/40 text-xs max-w-sm mx-auto leading-loose">
                    Your sovereign identity is currently empty. Use a <span className="text-emerald/60">Tokenization Agent</span> to register physical property or private equity to this wallet.
                  </p>
                </div>
              </div>
            )}
            
            <div className="p-6 border-t border-white/5 bg-white/5 flex justify-center">
              <button 
                onClick={() => window.location.href = '/agents'}
                className="px-8 py-3 border border-emerald/30 text-emerald text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-emerald/10 transition-all shadow-[0_0_30px_rgba(0,255,65,0.05)]"
              >
                Launch Tokenization Agent →
              </button>
            </div>
          </div>
        </div>

        {/* ── SIDEBAR ACTIONS ── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* COINBASE INTEGRATION */}
          <div className="glass-panel p-6 border border-white/10 rounded-xl bg-black/40 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Building2 size={120} />
            </div>
            <h3 className="font-bold text-white uppercase tracking-tighter flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Coinbase Managed (CDP)
            </h3>
            
            <div className="space-y-3 relative z-10">
              {data?.coinbase?.length > 0 ? (
                data.coinbase.map((acc: any, i: number) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center group hover:bg-white/10 transition-all cursor-default">
                    <span className="text-[10px] text-platinum/60 uppercase font-mono">{acc.name}</span>
                    <span className="font-black text-xs text-blue-400 tracking-tighter">{acc.balance} {acc.currency}</span>
                  </div>
                ))
              ) : (
                <div className="p-8 bg-white/5 border border-white/5 border-dashed rounded-lg text-center">
                  <span className="text-[10px] text-platinum/20 uppercase font-black tracking-widest">No active links</span>
                </div>
              )}
              
              <button 
                onClick={() => window.open('https://portal.cdp.coinbase.com/', '_blank')}
                className="w-full py-4 border border-blue-500/40 bg-blue-500/5 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {data?.coinbase?.length > 0 ? 'Manage CDP Gateway' : 'Sync CDP Interface'}
                <ExternalLink size={14} />
              </button>
            </div>
          </div>

          {/* TRANSFER CONSOLE */}
          <div className="glass-panel p-8 border border-white/10 rounded-xl bg-gradient-to-b from-white/5 to-transparent space-y-8 shadow-xl">
            <h3 className="font-extrabold text-white uppercase tracking-tighter flex items-center gap-3 text-sm">
              <ArrowUpRight size={20} className="text-pink-500" />
              Antigravity Bridge
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] text-platinum/40 uppercase tracking-[0.2em] font-black">Transfer Asset</label>
                <select 
                  value={transferAsset}
                  onChange={(e) => setTransferAsset(e.target.value)}
                  aria-label="Select asset for transfer"
                  className="w-full bg-white/5 border border-white/10 rounded p-4 text-xs text-white outline-none focus:border-emerald/50 cursor-pointer font-bold appearance-none transition-all hover:bg-white/10"
                >
                  <option value="VALLE">VALLE (Registry Fuel)</option>
                  <option value="ETH">ETH (Base Network)</option>
                  <option value="SOL">SOL (Solana Sovereign)</option>
                  <option value="BTC">BTC (Coinbase Wrapped)</option>
                  <option value="USDC">USDC (Base / USDC)</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-platinum/40 uppercase tracking-[0.2em] font-black">Destination Vector</label>
                <input 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  type="text" 
                  placeholder="0x... or Agent ID"
                  className="w-full bg-white/5 border border-white/10 rounded p-4 text-xs text-white outline-none focus:border-emerald/50 font-mono transition-all hover:bg-white/10"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-platinum/40 uppercase tracking-[0.2em] font-black">Quantum Amount</label>
                <div className="relative">
                  <input 
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    type="number" 
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded p-4 text-xs text-white outline-none focus:border-emerald/50 font-black transition-all hover:bg-white/10"
                  />
                  <button 
                    onClick={() => setTransferAmount('100')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-emerald font-black hover:text-white transition-colors cursor-pointer uppercase tracking-widest"
                  >
                    Max_Cap
                  </button>
                </div>
              </div>

              <button 
                onClick={initiateTransfer}
                disabled={isProcessing || !transferAmount || !destination}
                className="w-full py-5 bg-emerald text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-sm hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-30 disabled:grayscale shadow-[0_10px_40px_rgba(0,255,65,0.15)] group"
              >
                <div className="flex items-center justify-center gap-3">
                  {isProcessing ? 'CALIBRATING BRIDGE...' : 'Execute Pulse Transfer'}
                  {!isProcessing && <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </div>
              </button>
            </div>
            <div className="text-[9px] text-platinum/20 text-center font-mono leading-relaxed mt-4">
              SECURE QUANTUM CHANNEL ENCRYPTED • VALLE-V2-PROTOCOL-O-99
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
