'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Database, 
  Zap, 
  BrainCircuit, 
  Activity, 
  Link as LinkIcon, 
  Clock, 
  ShieldAlert 
} from 'lucide-react';

interface ShardHUDProps {
  node: any;
  onClose: () => void;
}

export default function ShardHUD({ node, onClose }: ShardHUDProps) {
  if (!node) return null;

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full max-w-md bg-black/90 border-l border-white/10 backdrop-blur-3xl z-[100] p-8 flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.8)]"
    >
      
      {/* SHARD HEADER */}
      <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${
                node.type === 'PREDICTION' ? 'bg-[#00ffc3]/10 border-[#00ffc3]/30 text-[#00ffc3]' : 
                node.type === 'CONVERSATION' ? 'bg-[#7000ff]/10 border-[#7000ff]/30 text-[#7000ff]' : 
                'bg-white/10 border-white/20 text-white/40'
              }`}>
                 {node.type === 'PREDICTION' ? <Zap size={24} /> : 
                  node.type === 'CONVERSATION' ? <BrainCircuit size={24} /> : 
                  <Database size={24} />}
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-white italic">{node.label || node.id}</h2>
                <div className="text-[10px] text-white/30 font-black uppercase tracking-widest">{node.type} SHARD</div>
              </div>
           </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
        >
          <X size={18} className="text-white/40" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-2">
         
         {/* METRICS */}
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-1">
               <div className="text-[8px] text-white/20 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={10} /> Latency
               </div>
               <div className="text-lg font-black text-white">0.02ms</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-1">
               <div className="text-[8px] text-white/20 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={10} /> Resonance
               </div>
               <div className="text-lg font-black text-[#00ffc3]">94.2%</div>
            </div>
         </div>

         {/* CONTENT / REPORT */}
         <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-3">
               <ShieldAlert size={12} /> Neural context
            </h3>
            <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
               <p className="text-sm text-white/60 leading-relaxed font-light italic">
                  {node.report || "No deeper report extracted for this specific cognitive shard. This entity exists as a permanent node in the Abyssal Knowledge Graph."}
               </p>
            </div>
         </div>

         {/* ASSOCIATIONS */}
         <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-3">
               <LinkIcon size={12} /> Neural Associations
            </h3>
            <div className="space-y-3">
               {/* Simplified association list */}
               {['Central_Identity', 'Economic_Sandbox', 'Swarm_Consensus'].map((ass, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.06] transition-all cursor-pointer group">
                    <span className="text-xs text-white/40 group-hover:text-white transition-colors uppercase font-mono">{ass}</span>
                    <LinkIcon size={12} className="text-white/10 group-hover:text-[#00ffc3] transition-colors" />
                 </div>
               ))}
            </div>
         </div>

      </div>

      {/* FOOTER ACTION */}
      <div className="pt-8 border-t border-white/5">
         <button className="w-full py-4 bg-[#7000ff] text-white font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(112,0,255,0.2)]">
            Trace Full Lineage
         </button>
      </div>

    </motion.div>
  );
}
