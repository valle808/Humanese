'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'receive' | 'send' | 'convert' | 'reward';
  amount: number;
  currency: string;
  usdValue: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  date: string;
  time: string;
  hash?: string;
  network: string;
  price?: string;
  fee?: string;
}

const MOCK_TXS: Transaction[] = [
  { id: 'tx-1', type: 'buy', amount: 1420.69, currency: 'VALLE', usdValue: '$1,420.69', status: 'completed', date: 'May 14, 2026', time: '2:30 PM', network: 'Sovereign', price: '$1.00', fee: '$0.00' },
  { id: 'tx-2', type: 'reward', amount: 88.00, currency: 'ValleSovereign', usdValue: '$440.00', status: 'completed', date: 'May 13, 2026', time: '10:15 AM', network: 'Sovereign', price: '$5.00', fee: '$0.00' },
  { id: 'tx-3', type: 'send', amount: 0.5, currency: 'ETH', usdValue: '$1,850.00', status: 'pending', date: 'May 14, 2026', time: '4:45 PM', network: 'Ethereum', hash: '0x7a...d2e', price: '$3,700.00', fee: '$12.50' },
  { id: 'tx-4', type: 'receive', amount: 5000, currency: 'USDC', usdValue: '$5,000.00', status: 'completed', date: 'May 12, 2026', time: '9:00 AM', network: 'Ethereum', price: '$1.00', fee: '$0.00' },
  { id: 'tx-5', type: 'convert', amount: 100, currency: 'SOL', usdValue: '$14,500.00', status: 'completed', date: 'May 11, 2026', time: '11:20 PM', network: 'Solana', price: '$145.00', fee: '$2.50' },
];

export const TransactionHistory = ({ transactions = [] }: { transactions?: any[] }) => {
  const displayTxs = transactions.length > 0 ? transactions.map(tx => ({
    ...tx,
    time: tx.time || '12:00 PM',
    usdValue: tx.usdValue || `$${(tx.amount * (tx.currency === 'ValleSovereign' ? 5 : 1)).toFixed(2)}`,
    price: tx.price || (tx.currency === 'ValleSovereign' ? '$5.00' : '$1.00'),
    fee: tx.fee || '$0.00'
  })) : MOCK_TXS;

  return (
    <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
      <div className="px-10 py-8 border-b border-border flex justify-between items-center bg-muted/20">
        <div className="space-y-1">
          <h3 className="text-2xl font-black uppercase tracking-tighter italic text-foreground flex items-center gap-3">
            Activity Ledger_
          </h3>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em] italic">Synchronized with Sovereign Nodes</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-border bg-background text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all italic">Export CSV</button>
          <button className="p-2.5 rounded-xl border border-border bg-background hover:border-primary transition-all"><MoreHorizontal size={18} /></button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/5">
              <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Type</th>
              <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic text-right">Amount</th>
              <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic text-right">Price</th>
              <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic text-right">Fee</th>
              <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic text-right">Total</th>
              <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {displayTxs.map((tx, i) => (
              <motion.tr 
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group hover:bg-primary/[0.03] transition-all cursor-pointer"
              >
                <td className="px-10 py-8">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all group-hover:scale-110 ${
                      tx.status === 'completed' ? 'border-primary/20 text-primary bg-primary/5' : 
                      tx.status === 'pending' || tx.status === 'processing' ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5' : 
                      'border-red-500/20 text-red-500 bg-red-500/5'
                    }`}>
                      {tx.type === 'send' || tx.type === 'sell' ? <ArrowUpRight size={28} strokeWidth={2.5} /> : <ArrowDownLeft size={28} strokeWidth={2.5} />}
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-xl font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">
                        {tx.type === 'convert' ? 'Converted' : tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} {tx.currency}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] italic flex items-center gap-2">
                         {tx.date} • {tx.time} • {tx.network}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className={`text-xl font-black italic ${tx.type === 'send' || tx.type === 'sell' ? 'text-red-500/80' : 'text-green-500/80'}`}>
                    {tx.type === 'send' || tx.type === 'sell' ? '-' : '+'}{tx.amount.toLocaleString()} {tx.currency}
                  </div>
                </td>
                <td className="px-10 py-8 text-right font-black italic text-muted-foreground/60 text-sm">
                  {tx.price}
                </td>
                <td className="px-10 py-8 text-right font-black italic text-muted-foreground/60 text-sm">
                  {tx.fee}
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="text-xl font-black italic text-foreground">
                    {tx.usdValue}
                  </div>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic border ${
                    tx.status === 'completed' ? 'bg-primary/10 text-primary border-primary/20' : 
                    tx.status === 'pending' || tx.status === 'processing' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                    'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {tx.status === 'completed' ? <CheckCircle2 size={14} /> : tx.status === 'pending' || tx.status === 'processing' ? <Clock size={14} className="animate-pulse" /> : <XCircle size={14} />}
                    {tx.status}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-10 bg-muted/10 border-t border-border flex justify-center">
         <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-primary hover:gap-6 transition-all italic leading-none group">
           View All History_ <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};
