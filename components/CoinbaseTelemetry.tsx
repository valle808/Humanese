"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowRightLeft, ShieldBan } from 'lucide-react';

interface Balance {
    currency: string;
    balance: string;
    id: string;
    name: string;
}

export function CoinbaseTelemetry() {
    const [balances, setBalances] = useState<Balance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBalances() {
            try {
                const res = await fetch('/api/coinbase/balances');
                if (!res.ok) throw new Error('Failed to fetch from Coinbase Array');
                const data = await res.json();
                
                if (data.success && data.balances) {
                    setBalances(data.balances);
                } else {
                    throw new Error(data.error || 'Invalid response schema');
                }
            } catch (err: any) {
                console.error("Coinbase Telemetry Error: ", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchBalances();
        
        // Refresh every 30 seconds
        const interval = setInterval(fetchBalances, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 overflow-hidden relative group p-[1px] rounded-[13px] border border-nd-border-prominent bg-nd-bg text-nd-high-em-text"
        >
            <div className="p-6 relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="nd-heading-m flex items-center">
                        <Wallet className="mr-3 w-6 h-6 text-nd-highlight-blue" />
                        LIVE TREASURY (COINBASE)
                    </h3>
                    
                    {loading && <span className="nd-body-xs animate-pulse text-nd-mid-em-text">SYNCING SDK...</span>}
                    {error && <span className="nd-body-xs text-red-500 flex items-center"><ShieldBan className="w-4 h-4 mr-1"/> SDK OFFLINE</span>}
                </div>
                
                {balances.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {balances.map((b) => (
                            <div key={b.id} className="p-4 rounded-lg bg-white/5 border border-nd-border-light hover:border-nd-highlight-blue transition-colors">
                                <span className="nd-body-xs uppercase text-nd-mid-em-text block mb-2">{b.name}</span>
                                <div className="flex items-end justify-between">
                                    <span className="nd-heading-s font-mono">{b.balance}</span>
                                    <span className="nd-body-s font-mono text-nd-highlight-lavendar">{b.currency}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !loading && (
                    <div className="p-4 rounded border border-nd-border-light bg-black text-center text-nd-mid-em-text nd-body-s font-mono">
                        NO BALANCES DETECTED OR KEYS INVALID
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-nd-border-prominent flex justify-between text-nd-mid-em-text nd-body-xs font-mono uppercase">
                    <span className="flex items-center"><ArrowRightLeft className="w-3 h-3 mr-2" /> Live Market Polling</span>
                    <span>Diplomat/Miner Vault Linked</span>
                </div>
            </div>
        </motion.div>
    );
}
