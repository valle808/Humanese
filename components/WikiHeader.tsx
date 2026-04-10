'use client';

import React from 'react';
import { Calendar, ExternalLink, Activity, Globe, Zap, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface WikiHeaderProps {
  title: string;
  lastUpdated?: string;
  source?: string;
}

export function WikiHeader({ title, lastUpdated, source }: WikiHeaderProps) {
  return (
    <div className="relative overflow-hidden pt-20 pb-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent" />
      <div className="absolute inset-0 bg-[#ff6b2b]/5 blur-[120px] opacity-20 pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-12 lg:px-20 relative z-10 space-y-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
        >
            <div className="h-2 w-20 bg-[#ff6b2b] rounded-full" />
            <span className="text-[12px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] italic leading-none pl-1">Sovereign_Index_Entry</span>
        </motion.div>

        <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.85] text-white"
        >
          {title}<span className="text-[#ff6b2b]">.</span>
        </motion.h1>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-12"
        >
            {lastUpdated && (
                <div className="flex items-center gap-4 group">
                    <Calendar className="h-5 w-5 text-[#ff6b2b]/40 group-hover:text-[#ff6b2b] transition-colors" strokeWidth={3} />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 italic leading-none pt-1">Sync: {lastUpdated}</span>
                </div>
            )}
            
            {source && (
                <button
                  onClick={() => window.open(source, '_blank')}
                  className="flex items-center gap-4 px-10 py-5 bg-[#ff6b2b] text-black text-[11px] font-black uppercase tracking-[0.6em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,107,43,0.3)] italic leading-none group"
                >
                  Access_Source <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={3} />
                </button>
            )}
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
