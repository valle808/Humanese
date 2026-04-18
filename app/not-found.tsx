'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Terminal, 
  AlertTriangle,
  Activity,
  Orbit,
  Wifi,
  Radio,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-hidden flex flex-col items-center justify-center p-8 relative">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <main className="relative z-10 w-full max-w-4xl text-center space-y-20">
        
        {/* ── ERROR HUD ── */}
        <div className="space-y-12">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               className="inline-flex items-center gap-6 px-8 py-3 bg-[#ff6b2b]/10 border border-[#ff6b2b]/30 rounded-full backdrop-blur-3xl shadow-[0_30px_60px_rgba(255,107,43,0.1)]"
            >
                <AlertTriangle size={24} className="text-[#ff6b2b] animate-pulse" strokeWidth={2.5} />
                <span className="text-[12px] font-black tracking-[0.6em] text-[#ff6b2b] uppercase italic leading-none">Status: 404_NULL_COGNITION</span>
            </motion.div>

            <div className="space-y-8">
                <h1 className="text-[12rem] lg:text-[22rem] font-black uppercase tracking-tighter italic leading-[0.7] italic">
                   Void.<br />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#ff6b2b]/30">Null.</span>
                </h1>
                <p className="text-2xl md:text-3xl text-white/40 max-w-2xl mx-auto leading-relaxed font-light italic">
                   The requested neural node does not exist within the OMEGA index. Either the shard has been purged or the coordinates are invalid.
                </p>
            </div>
        </div>

        {/* ── TERMINAL TELEMETRY ── */}
        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="p-8 lg:p-14 bg-black/60 border border-white/10 responsive-rounded text-left space-y-8 backdrop-blur-3xl shadow-[0_80px_150px_rgba(0,0,0,1)] relative overflow-hidden group"
        >
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent" />
           <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-white/20 italic leading-none">
                 <Terminal size={16} className="text-[#ff6b2b]" /> Diagnostic_Extraction
              </div>
              <div className="h-2 w-2 rounded-full bg-[#ff6b2b]/40 animate-pulse" />
           </div>
           
           <div className="space-y-4 font-mono text-[11px] lg:text-[13px] text-white/30 uppercase tracking-widest leading-loose italic">
              <div>[00.00] initializing_void_sweep...</div>
              <div>[00.04] tracing_coordinate_path: <span className="text-[#ff6b2b]">FAILED</span></div>
              <div>[00.12] abyssal_mesh_scan: <span className="text-[#ff6b2b]">NO_RESULTS_MATCH</span></div>
              <div>[00.18] cognitive_index_status: <span className="text-[#ff6b2b]">UNREACHABLE</span></div>
              <div className="text-white/60 animate-pulse pt-4">ALERT: SECTOR_RESTRICTED_OR_PURGED</div>
           </div>
        </motion.div>

        {/* ── ACTIONS ── */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8 }}
           className="flex flex-col md:flex-row items-center justify-center gap-10"
        >
            <Link href="/" className="w-full md:w-auto px-16 py-8 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.8em] text-[11px] rounded-[2.5rem] hover:scale-[1.05] active:scale-95 transition-all shadow-[0_40px_100px_rgba(255,107,43,0.3)] flex items-center justify-center gap-6 italic leading-none group">
               <ChevronLeft size={20} className="group-hover:-translate-x-2 transition-transform" strokeWidth={3} /> Return to Matrix
            </Link>
            <Link href="/search" className="w-full md:w-auto px-16 py-8 bg-white/[0.02] border border-white/10 text-white/30 hover:text-[#ff6b2b] hover:border-[#ff6b2b]/30 font-black uppercase tracking-[0.8em] text-[11px] rounded-[2.5rem] transition-all flex items-center justify-center gap-6 italic leading-none shadow-2xl">
               <Orbit size={20} className="animate-spin-slow" /> Re-Scan Index
            </Link>
        </motion.div>

      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="text-[30vw] font-black italic italic leading-none uppercase">404</div>
      </div>
      
      <style jsx global>{`
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

