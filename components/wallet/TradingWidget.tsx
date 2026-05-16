'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

export const TradingWidget = ({ wallets, onTrade }: { wallets: any[], onTrade: (data: any) => void }) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'convert'>('buy');
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(wallets[0]?.currency || 'VALLE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTrade({ type: activeTab, amount, asset: selectedAsset });
    setAmount('');
  };

  return (
    <div className="bg-card border-2 border-border rounded-[3rem] p-6 md:p-8 lg:p-10 shadow-2xl relative overflow-hidden group backdrop-blur-3xl">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-[0_0_15px_hsl(var(--primary))]" />
      
      {/* Tabs */}
      <div className="flex gap-1.5 p-1.5 bg-muted/40 border border-border rounded-full mb-8 md:mb-10 flex-wrap sm:flex-nowrap">
        {(['buy', 'sell', 'convert'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[80px] py-2.5 md:py-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] rounded-full transition-all italic ${
              activeTab === tab ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic ml-4">
            Amount_
          </label>
          <div className="relative cursor-pointer" onClick={() => document.getElementById('trade-amount')?.focus()}>
            <input 
              id="trade-amount"
              required
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-background border-2 border-border rounded-[2.5rem] px-6 md:px-10 py-6 md:py-8 text-2xl md:text-5xl font-black italic text-foreground outline-none focus:border-primary/40 focus:bg-primary/5 placeholder:text-muted-foreground/10 tracking-tighter cursor-text"
            />
            <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 text-lg md:text-2xl font-black text-muted-foreground/20 italic pointer-events-none">
              USD
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label 
            className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic ml-4 cursor-pointer"
            onClick={() => document.getElementById('trade-asset')?.focus()}
          >
            {activeTab === 'convert' ? 'Convert To' : 'Asset_'}
          </label>
          <div className="relative">
            <select 
              id="trade-asset"
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full bg-background border-2 border-border rounded-[2.5rem] px-6 md:px-10 py-5 md:py-6 text-sm md:text-xl font-black uppercase italic tracking-widest text-foreground outline-none focus:border-primary/40 appearance-none cursor-pointer"
            >
              {wallets.length > 0 ? wallets.map(w => (
                <option key={w.id} value={w.currency}>{w.network} ({w.currency})</option>
              )) : <option value="VALLE">Sovereign (VALLE)</option>}
            </select>
            <ChevronDown size={20} className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-6 md:py-8 bg-primary text-primary-foreground font-black uppercase tracking-[0.4em] md:tracking-[0.4em] md:tracking-[0.8em] text-[10px] md:text-[11px] rounded-[2.5rem] shadow-[0_20px_40px_rgba(var(--primary),0.3)] hover:scale-[1.02] active:scale-95 transition-all group/btn italic relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-4">
            {activeTab.toUpperCase()} {selectedAsset} <ArrowUpRight size={20} className="md:w-6 md:h-6" strokeWidth={3} />
          </span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
        </button>
      </form>

      {/* Stats/Info */}
      <div className="mt-10 p-6 bg-muted/20 border border-border rounded-[2rem] space-y-4">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
          <span>Market Price</span>
          <span className="text-primary">$1,242.42</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
          <span>Fee (Sovereign)</span>
          <span>$0.00</span>
        </div>
      </div>
    </div>
  );
};
