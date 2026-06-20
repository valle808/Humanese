'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  up: boolean;
}

const DEFAULT_ASSETS: TickerItem[] = [
  { symbol: 'BTC', price: '$---', change: '0.00%', up: true },
  { symbol: 'ETH', price: '$---', change: '0.00%', up: true },
  { symbol: 'SOL', price: '$---', change: '0.00%', up: true },
  { symbol: 'XRP', price: '$---', change: '0.00%', up: true },
  { symbol: 'BNB', price: '$---', change: '0.00%', up: true },
  { symbol: 'VALLE', price: '$1.00', change: '+12.40%', up: true },
];

export function MarketTicker() {
  const [tickers, setTickers] = useState<TickerItem[]>(DEFAULT_ASSETS);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchLivePrices() {
      try {
        const symbols = '["BTCUSDT","ETHUSDT","SOLUSDT","XRPUSDT","BNBUSDT"]';
        const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${symbols}`);
        if (!res.ok) return;
        
        const data = await res.json();
        
        if (isMounted) {
          setTickers(prev => {
            const newTickers = [...prev];
            data.forEach((coin: any) => {
              const baseSymbol = coin.symbol.replace('USDT', '');
              const idx = newTickers.findIndex(t => t.symbol === baseSymbol);
              if (idx !== -1) {
                const price = parseFloat(coin.lastPrice);
                const change = parseFloat(coin.priceChangePercent);
                newTickers[idx] = {
                  symbol: baseSymbol,
                  price: `$${price >= 1000 ? price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : price.toFixed(2)}`,
                  change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
                  up: change >= 0
                };
              }
            });
            // Update VALLE mock data slightly since it's an internal database asset
            const valleIdx = newTickers.findIndex(t => t.symbol === 'VALLE');
            if (valleIdx !== -1) {
              const prevValle = newTickers[valleIdx];
              const currentChange = parseFloat(prevValle.change.replace('%', '').replace('+', ''));
              const delta = (Math.random() - 0.48) * 0.4;
              const newChange = currentChange + delta;
              newTickers[valleIdx] = {
                ...prevValle,
                change: `${newChange >= 0 ? '+' : ''}${newChange.toFixed(2)}%`,
                up: newChange >= 0
              };
            }
            return newTickers;
          });
        }
      } catch (error) {
        console.error('Failed to fetch live market data', error);
      }
    }

    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 10000); // Fetch every 10 seconds
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
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
