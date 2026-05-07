'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
  Grid,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

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
        const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
        const targetId = typeof l.target === 'object' ? l.target.id : l.target;
        return sourceId === node.id || targetId === node.id;
      })
      .map(l => {
        const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
        const targetId = typeof l.target === 'object' ? l.target.id : l.target;
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
    setDisplayedReport('');
    const timer = setInterval(() => {
      setDisplayedReport(reportText.slice(0, i));
      i++;
      if (i > reportText.length) clearInterval(timer);
    }, 15);
    return () => clearInterval(timer);
  }, [reportText, node.id]);

  if (!node) return null;

  return (
    <motion.div 
      initial={{ x: '100%', skewX: 5 }}
      animate={{ x: 0, skewX: 0 }}
      exit={{ x: '100%', skewX: 5 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#050505]/95 border-l-4 border-primary backdrop-blur-3xl z-[100] p-8 lg:p-12 flex flex-col shadow-[-50px_0_100px_rgba(0,0,0,0.9)] overflow-hidden"
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
                node.group === 'USER' ? 'bg-white/5 border-white/20 text-white' : 
                'bg-primary/5 border-primary/20 text-primary/60'
              }`}>
                 {node.group === 'AGENT' ? <Cpu size={40} strokeWidth={2.5} /> : 
                  node.group === 'USER' ? <User size={40} strokeWidth={2.5} /> : 
                  <Database size={40} strokeWidth={2.5} />}
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-white italic leading-none">{node.label}</h2>
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
          className="h-12 w-12 bg-white/5 hover:bg-primary hover:text-primary-foreground border-2 border-white/10 rounded-xl transition-all flex items-center justify-center group active:scale-90"
        >
          <X size={24} className="text-white/40 group-hover:text-primary-foreground" strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-12 pr-4 relative">
         
         {/* METRICS - GAME HUD STYLE */}
         <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 border-2 border-white/10 p-6 rounded-[2rem] space-y-4 relative overflow-hidden group/metric shadow-inner">
               <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-full group-hover/metric:scale-150 transition-transform" />
               <div className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-black flex items-center gap-3 italic leading-none">
                  <Clock size={12} className="text-primary" /> Latency
               </div>
               <div className="space-y-2">
                 <div className="text-3xl font-black text-white italic leading-none tabular-nums">0.02ms</div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] shadow-inner">
                    <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-primary shadow-[0_0_10px_hsla(var(--primary),0.4)]" />
                 </div>
               </div>
            </div>
            <div className="bg-white/5 border-2 border-white/10 p-6 rounded-[2rem] space-y-4 relative overflow-hidden group/metric shadow-inner">
               <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-full group-hover/metric:scale-150 transition-transform" />
               <div className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-black flex items-center gap-3 italic leading-none">
                  <Activity size={12} className="text-primary" /> Resonance
               </div>
               <div className="space-y-2">
                 <div className="text-3xl font-black text-primary italic leading-none tabular-nums">94.2%</div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] shadow-inner">
                    <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} className="h-full bg-primary shadow-[0_0_10px_hsla(var(--primary),0.4)]" />
                 </div>
               </div>
            </div>
         </div>

         {/* CONTENT / REPORT */}
         <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 flex items-center gap-4 italic leading-none pl-2">
               <ShieldAlert size={14} className="text-primary" /> Neural context_
            </h3>
            <div className="bg-white/5 border-2 border-white/10 p-8 rounded-[2.5rem] relative shadow-inner">
               <div className="absolute -top-3 -left-3 h-8 w-8 border-t-2 border-l-2 border-primary" />
               <p className="text-xl text-white/60 leading-relaxed font-light italic min-h-[120px]">
                  {displayedReport}<span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse" />
               </p>
            </div>
         </div>

          {/* ASSOCIATIONS */}
          <div className="space-y-6 pb-8">
             <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 flex items-center gap-4 italic leading-none pl-2">
                <LinkIcon size={14} className="text-primary" /> Connected Signatures
             </h3>
             <div className="space-y-4">
                {neighbors.length > 0 ? neighbors.map((neighbor, i) => (
                  <button 
                    key={i} 
                    onClick={() => onSelectNode(neighbor)}
                    className="w-full flex items-center justify-between p-6 bg-white/5 border-2 border-white/10 rounded-[1.8rem] hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group shadow-inner active:scale-95 text-left"
                  >
                     <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                         {neighbor.group === 'AGENT' ? <Cpu size={14} /> : neighbor.group === 'USER' ? <User size={14} /> : <Database size={14} />}
                       </div>
                       <span className="text-sm text-white/40 group-hover:text-white transition-colors uppercase font-black tracking-widest italic">{neighbor.label}</span>
                     </div>
                     <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center text-primary border border-white/10 group-hover:border-primary transition-all shadow-lg">
                        <ChevronRight size={16} />
                     </div>
                  </button>
                )) : (
                  <div className="p-8 border-2 border-dashed border-white/10 rounded-[2.5rem] text-center text-[10px] text-white/20 uppercase tracking-[0.4em] font-black italic">
                    No local entanglements detected.
                  </div>
                )}
             </div>
          </div>

          {/* LINEAGE TRACE */}
          <button 
            onClick={() => onSelectNode(node)}
            className="w-full p-6 bg-white/5 border-2 border-white/10 rounded-[2rem] flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all italic active:scale-95 group mb-8"
          >
            <Orbit size={18} className="group-hover:rotate-180 transition-transform duration-1000" /> Trace Neural Lineage
          </button>

       </div>

       {/* FOOTER ACTION */}
       <div className="pt-8 mt-auto flex flex-col gap-4">
          <Link 
             href={`/atlas/dossier/${node.id}`}
             className="w-full py-6 bg-primary text-black font-black uppercase text-[11px] tracking-[0.6em] rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_60px_hsla(var(--primary),0.3)] italic leading-none border-0 group/btn flex items-center justify-center gap-4 text-center"
          >
             Access Neural Dossier <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
          </Link>
          <button 
            onClick={onClose}
            className="w-full py-5 border-2 border-white/10 hover:border-white/20 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] italic text-white/20 hover:text-white transition-all leading-none"
          >
            Release Shard
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
