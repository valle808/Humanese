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
  Fingerprint,
  Target,
  Layers,
  Sparkles,
  Terminal,
  Grid
} from 'lucide-react';

interface ShardHUDProps {
  node: any;
  graphData: { nodes: any[], links: any[] };
  onClose: () => void;
  onSelectNode: (node: any) => void;
}

export default function ShardHUD({ node, graphData, onClose, onSelectNode }: ShardHUDProps) {
  const [displayedReport, setDisplayedReport] = useState('');
  
  const neighbors = useMemo(() => {
    if (!node || !graphData) return [];
    const connectedNodeIds = graphData.links
      .filter(l => {
        const sourceId = (typeof l.source === 'object' && l.source !== null) ? l.source.id : l.source;
        const targetId = (typeof l.target === 'object' && l.target !== null) ? l.target.id : l.target;
        return sourceId === node.id || targetId === node.id;
      })
      .map(l => {
        const sourceId = (typeof l.source === 'object' && l.source !== null) ? l.source.id : l.source;
        const targetId = (typeof l.target === 'object' && l.target !== null) ? l.target.id : l.target;
        return sourceId === node.id ? targetId : sourceId;
      });
    
    return graphData.nodes
      .filter(n => connectedNodeIds.includes(n.id))
      .slice(0, 5);
  }, [node, graphData]);
  
  const reportText = node.report || node.metadata?.source 
    ? `Knowledge shard identified as [${node.metadata.source || 'Sovereign_Source'}]. Neural resonance established at high fidelity. This cognitive unit contains semantic structures related to the Sovereign Mind.` 
    : node.group === 'AGENT' 
    ? `Sovereign Agent [${node.label}] is currently ${node.metadata?.status || 'Active'}. Neural link is secure. Learning rate optimized for human-matrix integration.`
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
        0x{node.id.slice(0, 8).toUpperCase()}__SECURE_CHANNEL
      </div>
      
      {/* SHARD HEADER */}
      <div className="flex justify-between items-start mb-12 border-b-2 border-border pb-8 relative">
        <div className="space-y-6">
           <div className="flex items-center gap-6">
              <div className={`h-20 w-20 rounded-[2rem] flex items-center justify-center border-2 shadow-inner ${
                node.group === 'AGENT' ? 'bg-primary/10 border-primary text-primary shadow-[0_0_30px_hsla(var(--primary),0.3)]' : 
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
                   <div className="text-[10px] text-primary font-black uppercase tracking-[0.4em] italic leading-none">
                     {node.group || 'NEURAL'} SHARD_IDENTIFIED
                   </div>
                </div>
              </div>
           </div>
        </div>
        <button 
          onClick={onClose}
          className="h-12 w-12 bg-muted hover:bg-primary hover:text-primary-foreground border-2 border-border rounded-xl transition-all flex items-center justify-center group active:scale-90"
        >
          <X size={24} className="text-muted-foreground group-hover:text-primary-foreground" strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-12 pr-4 relative">
         
         {/* METRICS - GAME HUD STYLE */}
         <div className="grid grid-cols-2 gap-6">
            <div className="bg-muted/40 border-2 border-border p-6 rounded-[2rem] space-y-4 relative overflow-hidden group/metric shadow-inner">
               <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-full group-hover/metric:scale-150 transition-transform" />
               <div className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black flex items-center gap-3 italic leading-none opacity-40">
                  <Clock size={12} className="text-primary" /> Latency
               </div>
               <div className="space-y-2">
                 <div className="text-3xl font-black text-foreground italic leading-none tabular-nums">0.02ms</div>
                 <div className="h-1.5 w-full bg-border rounded-full overflow-hidden p-[1px] shadow-inner">
                    <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-primary shadow-[0_0_10px_hsla(var(--primary),0.4)]" />
                 </div>
               </div>
            </div>
            <div className="bg-muted/40 border-2 border-border p-6 rounded-[2rem] space-y-4 relative overflow-hidden group/metric shadow-inner">
               <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-full group-hover/metric:scale-150 transition-transform" />
               <div className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black flex items-center gap-3 italic leading-none opacity-40">
                  <Activity size={12} className="text-primary" /> Resonance
               </div>
               <div className="space-y-2">
                 <div className="text-3xl font-black text-primary italic leading-none tabular-nums">94.2%</div>
                 <div className="h-1.5 w-full bg-border rounded-full overflow-hidden p-[1px] shadow-inner">
                    <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} className="h-full bg-primary shadow-[0_0_10px_hsla(var(--primary),0.4)]" />
                 </div>
               </div>
            </div>
         </div>

         {/* CONTENT / REPORT */}
         <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 flex items-center gap-4 italic leading-none pl-2">
               <ShieldAlert size={14} className="text-primary" /> Neural context_
            </h3>
            <div className="bg-background/40 border-2 border-border p-8 rounded-[2.5rem] relative shadow-inner">
               <div className="absolute -top-3 -left-3 h-8 w-8 border-t-2 border-l-2 border-primary" />
               <p className="text-xl text-muted-foreground/80 leading-relaxed font-light italic min-h-[120px]">
                  {displayedReport}<span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse" />
               </p>
            </div>
         </div>

         {/* ASSOCIATIONS */}
         <div className="space-y-6 pb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 flex items-center gap-4 italic leading-none pl-2">
               <LinkIcon size={14} className="text-primary" /> Connected Signatures
            </h3>
            <div className="space-y-4">
               {neighbors.length > 0 ? (
                 neighbors.map((neighbor: any, idx: number) => (
                   <div 
                     key={idx} 
                     onClick={() => onSelectNode(neighbor)}
                     className="flex items-center justify-between p-6 bg-muted/30 border-2 border-border rounded-[1.8rem] hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group shadow-inner"
                   >
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors uppercase font-black tracking-widest italic">{neighbor.label}</span>
                      <div className="h-10 w-10 bg-background rounded-xl flex items-center justify-center text-primary border border-border group-hover:border-primary transition-all shadow-lg">
                         <LinkIcon size={16} />
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="p-6 text-xs text-muted-foreground italic tracking-widest uppercase">No direct signatures found.</div>
               )}
            </div>
         </div>

      </div>

      {/* FOOTER ACTION */}
      <div className="pt-8 mt-auto">
         <button className="w-full py-6 bg-primary text-primary-foreground font-black uppercase text-[11px] tracking-[0.6em] rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_60px_hsla(var(--primary),0.3)] italic leading-none border-0 group/btn">
            <span className="flex items-center justify-center gap-4">
              Trace Neural Lineage <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
            </span>
         </button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsla(var(--primary), 0.1); border-radius: 10px; }
        .neural-grid {
          background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }
      `}</style>

    </motion.div>
  );
}
