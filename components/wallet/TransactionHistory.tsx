'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink 
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'receive' | 'send' | 'convert';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  hash?: string;
  network: string;
}

const MOCK_TXS: Transaction[] = [
  { id: '1', type: 'buy', amount: 500, currency: 'VALLE', status: 'completed', date: 'May 14, 2026', network: 'Sovereign' },
  { id: '2', type: 'send', amount: 0.05, currency: 'BTC', status: 'pending', date: 'May 14, 2026', hash: '3C...eujh', network: 'Bitcoin' },
  { id: '3', type: 'receive', amount: 10, currency: 'SOL', status: 'completed', date: 'May 13, 2026', network: 'Solana' },
  { id: '4', type: 'convert', amount: 100, currency: 'USDC', status: 'failed', date: 'May 12, 2026', network: 'Ethereum' },
];

export const TransactionHistory = ({ transactions = [] }: { transactions?: Transaction[] }) => {
  const displayTxs = transactions.length > 0 ? transactions : MOCK_TXS;

  return (
    <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
        <h3 className="text-xl font-black uppercase tracking-tight italic text-foreground flex items-center gap-3">
          Transactions_
        </h3>
      </div>
      <div className="divide-y divide-border">
        {displayTxs.map((tx, i) => (
          <motion.div 
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 hover:bg-primary/5 transition-all group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${
                tx.status === 'completed' ? 'border-primary/20 text-primary' : 
                tx.status === 'pending' ? 'border-yellow-500/20 text-yellow-500' : 
                'border-red-500/20 text-red-500'
              }`}>
                {tx.type === 'send' || tx.type === 'sell' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
              </div>
              <div className="space-y-1">
                <div className="text-lg font-black uppercase italic tracking-tight text-foreground">
                  {tx.type === 'convert' ? 'Converted' : tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} {tx.currency}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
                  {tx.status === 'completed' ? <CheckCircle2 size={12} /> : tx.status === 'pending' ? <Clock size={12} className="animate-pulse" /> : <XCircle size={12} />}
                  {tx.status} • {tx.date}
                </div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-xl font-black text-foreground italic">
                {tx.type === 'send' || tx.type === 'sell' ? '-' : '+'}{tx.amount} {tx.currency}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center justify-end gap-1 group-hover:text-primary transition-colors">
                {tx.network} {tx.hash && <ExternalLink size={10} />}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
