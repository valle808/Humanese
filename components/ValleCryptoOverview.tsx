import { useState, useEffect } from 'react';
import { Database, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function ValleCryptoOverview() {
    const [valleGenesis, setValleGenesis] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchValleData() {
            try {
                const res = await fetch('/api/valle/genesis');
                if (res.ok) {
                    const data = await res.json();
                    setValleGenesis(data.genesis);
                }
            } catch (error) {
                console.error('Failed to fetch Valle configuration', error);
            } finally {
                setLoading(false);
            }
        }
        fetchValleData();
    }, []);

    if (loading || !valleGenesis) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 md:col-span-2 mt-6 overflow-hidden relative group p-[1px] rounded-[13px] solana-border"
        >
            <div className="bg-nd-bg p-6 rounded-xl w-full h-full relative z-10 text-nd-high-em-text">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Database className="w-32 h-32" />
                </div>
                
                <h3 className="nd-heading-m flex items-center mb-6">
                    <Zap className="mr-3 w-6 h-6 text-nd-highlight-green" /> 
                    VALLE CRYPTO: SOVEREIGN GENESIS
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-20">
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="nd-body-xs uppercase tracking-widest text-nd-mid-em-text mb-1">Core Architecture</span>
                            <span className="font-mono text-nd-highlight-blue bg-nd-highlight-blue/10 px-2 py-1 rounded w-fit">Base58Check + Double SHA256</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="nd-body-xs uppercase tracking-widest text-nd-mid-em-text mb-1">Genesis Address (V-Prefixed)</span>
                            <span className="font-mono text-nd-highlight-lime break-all">{valleGenesis.address}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="nd-body-xs uppercase tracking-widest text-nd-mid-em-text mb-1">Block Hash</span>
                            <span className="font-mono text-nd-mid-em-text break-all border border-nd-border-light p-2 rounded bg-white/5">{valleGenesis.hash}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="nd-body-xs uppercase tracking-widest text-nd-mid-em-text mb-1">Timestamp</span>
                            <span className="font-mono text-nd-high-em-text">{valleGenesis.timestamp}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-nd-border-prominent flex flex-col md:flex-row justify-between items-start md:items-center nd-body-xs font-mono text-nd-mid-em-text uppercase gap-2">
                    <span className="flex items-center"><Activity className="w-3 h-3 mr-2 text-nd-highlight-green animate-pulse" /> Miner Orchestration Active (Target: 3CJreF7LD...)</span>
                    <span className="flex items-center border border-nd-border-light px-2 py-1 rounded">Diplomat Council: Moltbook Heartbeat Synced</span>
                </div>
            </div>
        </motion.div>
    );
}
