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
            className="col-span-1 md:col-span-2 mt-6 overflow-hidden relative group p-1 rounded-xl bg-gradient-to-r from-emerald-500/20 via-neon-blue/20 to-purple-500/20"
        >
            <div className="bg-neural-950 p-6 rounded-lg w-full h-full relative z-10">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Database className="w-24 h-24" />
                </div>
                
                <h3 className="text-xl font-bold font-mono text-white flex items-center mb-4">
                    <Zap className="mr-2 w-5 h-5 text-emerald" /> 
                    VALLE CRYPTO: SOVEREIGN GENESIS
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
                    <div className="space-y-3">
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-widest text-platinum/40">Core Architecture</span>
                            <span className="font-mono text-sm text-emerald">Base58Check + Double SHA256</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-widest text-platinum/40">Genesis Address (V-Prefixed)</span>
                            <span className="font-mono text-sm text-neon-cyan break-all">{valleGenesis.address}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-widest text-platinum/40">Block Hash</span>
                            <span className="font-mono text-xs text-platinum/70 break-all">{valleGenesis.hash}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-widest text-platinum/40">Timestamp</span>
                            <span className="font-mono text-sm text-platinum/90">{valleGenesis.timestamp}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-glass-white/10 flex justify-between items-center text-xs font-mono text-platinum/50 uppercase">
                    <span className="flex items-center"><Activity className="w-3 h-3 mr-1 text-neon-green" /> Miner Orchestration Active (Target: 3CJreF7LD...)</span>
                    <span>Diplomat Council: Moltbook Heartbeat Synced</span>
                </div>
            </div>
        </motion.div>
    );
}
