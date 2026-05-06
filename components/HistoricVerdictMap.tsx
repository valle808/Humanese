'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, CheckCircle, XCircle, Clock, ShieldAlert, Scale } from 'lucide-react';

type Verdict = {
  id: string;
  title: string;
  outcome: 'ACCEPTED' | 'REJECTED' | 'DEFERRED';
  resonance: number;
  date: string;
  sector: string;
};

const MOCK_VERDICTS: Verdict[] = [
  { id: 'HIP-001', title: 'Genesis Protocol', outcome: 'ACCEPTED', resonance: 98.4, date: '2026-01-12', sector: 'Core' },
  { id: 'HIP-002', title: 'Neural Mesh Expansion', outcome: 'ACCEPTED', resonance: 92.1, date: '2026-02-05', sector: 'Network' },
  { id: 'HIP-003', title: 'Valle Tokenomics v2', outcome: 'REJECTED', resonance: 34.5, date: '2026-02-18', sector: 'Finance' },
  { id: 'HIP-004', title: 'Autonomous Fleet Sharding', outcome: 'ACCEPTED', resonance: 88.2, date: '2026-03-01', sector: 'Fleet' },
  { id: 'HIP-005', title: 'Cognitive Privacy Layer', outcome: 'DEFERRED', resonance: 55.0, date: '2026-03-15', sector: 'Security' },
  { id: 'HIP-006', title: 'Swarm Intelligence API', outcome: 'ACCEPTED', resonance: 95.6, date: '2026-04-02', sector: 'Core' },
  { id: 'HIP-007', title: 'Predictive Judiciary Engine', outcome: 'ACCEPTED', resonance: 91.2, date: '2026-04-10', sector: 'Judiciary' },
  { id: 'HIP-008', title: 'External Oracle Handshake', outcome: 'REJECTED', resonance: 12.4, date: '2026-04-20', sector: 'Oracle' },
  { id: 'HIP-009', title: 'Synaptic Latency Patch', outcome: 'ACCEPTED', resonance: 99.1, date: '2026-04-25', sector: 'Core' },
];

export function HistoricVerdictMap() {
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center px-4">
        <div className="text-[11px] font-black uppercase tracking-[0.8em] text-primary/40 italic flex items-center gap-4 leading-none">
            <Scale size={18} className="text-primary" /> Historic Verdict Cartography
        </div>
        <div className="text-[10px] text-muted-foreground/20 font-black uppercase tracking-[0.4em] italic leading-none">
            Sector_All // Epoch_07
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {MOCK_VERDICTS.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`relative group bg-background border-2 rounded-[2rem] p-8 space-y-4 hover:scale-[1.05] transition-all cursor-crosshair shadow-xl shadow-inner ${
              v.outcome === 'ACCEPTED' ? 'border-green-500/20 hover:border-green-500/60' :
              v.outcome === 'REJECTED' ? 'border-red-500/20 hover:border-red-500/60' :
              'border-yellow-500/20 hover:border-yellow-500/60'
            }`}
          >
            <div className={`absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity ${
              v.outcome === 'ACCEPTED' ? 'text-green-500' :
              v.outcome === 'REJECTED' ? 'text-red-500' :
              'text-yellow-500'
            }`}>
              {v.outcome === 'ACCEPTED' ? <CheckCircle size={16} /> :
               v.outcome === 'REJECTED' ? <XCircle size={16} /> :
               <Clock size={16} />}
            </div>

            <div className="space-y-2">
                <div className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.3em] italic leading-none">{v.id}</div>
                <h4 className="text-lg font-black text-foreground italic leading-tight uppercase line-clamp-2">{v.title}</h4>
            </div>

            <div className="pt-4 border-t border-border space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] italic leading-none">
                    <span className="text-muted-foreground/40">{v.sector}</span>
                    <span className={
                      v.outcome === 'ACCEPTED' ? 'text-green-500' :
                      v.outcome === 'REJECTED' ? 'text-red-500' :
                      'text-yellow-500'
                    }>{v.resonance}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden p-[0.5px]">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        v.outcome === 'ACCEPTED' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' :
                        v.outcome === 'REJECTED' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' :
                        'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]'
                      }`}
                      style={{ width: `${v.resonance}%` }}
                    />
                </div>
            </div>

            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none" />
          </motion.div>
        ))}
        
        {/* Placeholder for future expansion */}
        <div className="border-2 border-dashed border-border rounded-[2rem] p-8 flex flex-col items-center justify-center opacity-20 hover:opacity-100 transition-opacity group cursor-pointer h-full min-h-[180px]">
           <Plus size={32} className="text-muted-foreground group-hover:text-primary transition-colors group-hover:scale-125 duration-500" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] italic mt-4">Expand Registry</span>
        </div>
      </div>
    </div>
  );
}

function Plus({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
