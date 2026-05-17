'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  up: boolean;
}

const ASSETS: TickerItem[] = [
  { symbol: 'BTC', price: '$103,240', change: '+2.14%', up: true },
  { symbol: 'ETH', price: '$2,571', change: '+1.88%', up: true },
  { symbol: 'SOL', price: '$168.40', change: '+3.42%', up: true },
  { symbol: 'XRP', price: '$2.31', change: '-0.77%', up: false },
  { symbol: 'BNB', price: '$648.20', change: '+1.23%', up: true },
  { symbol: 'VALLE', price: '$1.00', change: '+12.40%', up: true },
];

export function MarketTicker() {
  const [tickers, setTickers] = useState<TickerItem[]>(ASSETS);
  const [idx, setIdx] = useState(0);

  // Simulate micro price fluctuations
  useEffect(() => {
    const iv = setInterval(() => {
      setTickers(prev => prev.map(t => {
        const delta = (Math.random() - 0.48) * 0.4;
        const upNow = delta >= 0;
        const sign = upNow ? '+' : '';
        return {
          ...t,
          change: `${sign}${(parseFloat(t.change) + delta).toFixed(2)}%`,
          up: upNow,
        };
      }));
      setIdx(i => (i + 1) % ASSETS.length);
    }, 2500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-background/80 border-b border-primary/10 backdrop-blur-3xl relative z-40">
      {/* Scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
        />
      </div>

      <div className="flex items-center gap-0">
        {/* Label */}
        <div className="shrink-0 flex items-center gap-3 px-6 py-3 bg-primary/10 border-r border-primary/20 h-full">
          <Zap size={14} className="text-primary animate-pulse" strokeWidth={3} />
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-primary italic leading-none">
            LIVE_MKT
          </span>
        </div>

        {/* Scrolling tickers */}
        <div className="flex gap-0 overflow-hidden flex-1">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex items-center gap-0 shrink-0"
          >
            {[...tickers, ...tickers].map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-8 py-3 border-r border-border/30 shrink-0 group hover:bg-primary/5 transition-all cursor-default"
              >
                <span className="text-[11px] font-black text-foreground/80 uppercase tracking-widest italic">
                  {t.symbol}
                </span>
                <span className="text-[11px] font-black text-foreground tabular-nums">
                  {t.price}
                </span>
                <span className={`text-[10px] font-black flex items-center gap-1 ${t.up ? 'text-green-500' : 'text-red-500'}`}>
                  {t.up ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                  {t.change}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
