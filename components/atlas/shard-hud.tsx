'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Database, 
  Zap, 
  BrainCircuit, 
  Activity, 
  Link as LinkIcon, 
  Clock, 
  ShieldAlert,
  Cpu,
  User,
  Fingerprint
} from 'lucide-react';

interface ShardHUDProps {
  node: any;
  onClose: () => void;
}

export default function ShardHUD({ node, onClose }: ShardHUDProps) {
  const [displayedReport, setDisplayedReport] = useState('');
  
  const reportText = node.report || node.metadata?.source 
    ? `Knowledge shard identified as [${node.metadata.source}]. Neural resonance established at high fidelity. This cognitive unit contains semantic structures related to the Sovereign Mind.` 
    : node.group === 'AGENT' 
    ? `Sovereign Agent [${node.label}] is currently ${node.metadata?.status}. Neural link is secure. Learning rate optimized for human-matrix integration.`
    : `Identity [${node.label}] confirmed. Subject has accumulated ${node.metadata?.xp || 0} XP within the Humanese ecosystem. Presence verified.`;

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedReport(reportText.slice(0, i));
      i++;
      if (i > reportText.length) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [reportText]);

  if (!node) return null;

  return (
    <motion.div 
      initial={{ x: '100%', skewX: 5 }}
      animate={{ x: 0, skewX: 0 }}
      exit={{ x: '100%', skewX: 5 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full max-w-lg bg-background/90 border-l-4 border-primary backdrop-blur-3xl z-[100] p-8 lg:p-12 flex flex-col shadow-[-50px_0_100px_rgba(0,0,0,0.9)] overflow-hidden"
    >
      {/* HUD Scanner Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] neural-grid" />
      <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-primary/40 uppercase tracking-widest leading-none">
        0x{node.id.slice(0, 8)}__SECURE_CHANNEL
      </div>
      
      {/* SHARD HEADER */}
      <div className="flex justify-between items-start mb-12 border-b-2 border-border pb-8 relative">
        <div className="space-y-6">
           <div className="flex items-center gap-6">
              <div className={`h-20 w-20 rounded-[2rem] flex items-center justify-center border-2 ${
                node.group === 'AGENT' ? 'bg-primary/10 border-primary text-primary shadow-[0_0_30px_rgba(255,107,43,0.3)]' : 
                node.group === 'USER' ? 'bg-foreground/5 border-foreground/20 text-foreground' : 
                'bg-primary/5 border-primary/20 text-primary/60'
              }`}>
                 {node.group === 'AGENT' ? <Cpu size={40} strokeWidth={2.5} /> : 
                  node.group === 'USER' ? <User size={40} strokeWidth={2.5} /> : 
                  <Database size={40} strokeWidth={2.5} />}
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-foreground italic leading-none">{node.label}</h2>
                <div className="flex items-center gap-3">
                   <Fingerprint size={12} className="text-primary" />
                   <div className="text-[10px] text-primary font-black uppercase tracking-[0.4em] italic">{node.group} SHARD_IDENTIFIED</div>
                </div>
              </div>
           </div>
        </div>
        <button 
          onClick={onClose}
          className="h-12 w-12 bg-muted hover:bg-primary hover:text-primary-foreground border-2 border-border rounded-xl transition-all flex items-center justify-center group"
        >
          <X size={24} className="text-muted-foreground group-hover:text-primary-foreground" strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-12 pr-4 relative">
         
         {/* METRICS - GAME HUD STYLE */}
         <div className="grid grid-cols-2 gap-6">
            <div className="bg-muted/40 border-2 border-border p-6 rounded-[2rem] space-y-4 relative overflow-hidden group/metric">
               <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-full group-hover/metric:scale-150 transition-transform" />
               <div className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black flex items-center gap-3 italic">
                  <Clock size={12} className="text-primary" /> Latency
               </div>
               <div className="space-y-2">
                 <div className="text-3xl font-black text-foreground italic leading-none">0.02ms</div>
                 <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-primary" />
                 </div>
               </div>
            </div>
            <div className="bg-muted/40 border-2 border-border p-6 rounded-[2rem] space-y-4 relative overflow-hidden group/metric">
               <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-full group-hover/metric:scale-150 transition-transform" />
               <div className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black flex items-center gap-3 italic">
                  <Activity size={12} className="text-primary" /> Resonance
               </div>
               <div className="space-y-2">
                 <div className="text-3xl font-black text-primary italic leading-none">94.2%</div>
                 <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} className="h-full bg-primary" />
                 </div>
               </div>
            </div>
         </div>

         {/* CONTENT / REPORT */}
         <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-4 italic">
               <ShieldAlert size={14} className="text-primary" /> Neural context_
            </h3>
            <div className="bg-background/40 border-2 border-border p-8 rounded-[2.5rem] relative">
               <div className="absolute -top-3 -left-3 h-8 w-8 border-t-2 border-l-2 border-primary" />
               <p className="text-lg text-muted-foreground leading-relaxed font-light italic min-h-[120px]">
                  {displayedReport}<span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse" />
               </p>
            </div>
         </div>

         {/* ASSOCIATIONS */}
         <div className="space-y-6 pb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-4 italic">
               <LinkIcon size={14} className="text-primary" /> Connected Signatures
            </h3>
            <div className="space-y-4">
               {['Central_Identity', 'Matrix_Core', 'Swarm_Node'].map((ass, i) => (
                 <div key={i} className="flex items-center justify-between p-6 bg-muted/30 border-2 border-border rounded-[1.8rem] hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group">
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors uppercase font-black tracking-widest italic">{ass}</span>
                    <div className="h-10 w-10 bg-background rounded-xl flex items-center justify-center text-primary border border-border group-hover:border-primary transition-all">
                       <LinkIcon size={16} />
                    </div>
                 </div>
               ))}
            </div>
         </div>

      </div>

      {/* FOOTER ACTION */}
      <div className="pt-8 mt-auto">
         <button className="w-full py-6 bg-primary text-primary-foreground font-black uppercase text-xs tracking-[0.6em] rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_60px_rgba(255,107,43,0.3)] italic leading-none border-0">
            Trace Neural Lineage
         </button>
      </div>

    </motion.div>
  );
}
