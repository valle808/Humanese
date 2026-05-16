'use client';

import React, { useEffect, useState } from 'react';
import { BrandShader } from '@/components/BrandShader';
import { Activity, Globe, Zap, Database, Shield, Binary } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingState() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-background relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute inset-0 bg-primary/5 blur-[120px] opacity-20 pointer-events-none" />
      
      <div className="text-center space-y-16 max-w-4xl px-8 relative z-10">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-[4rem] overflow-hidden border-2 border-border"
        >
          <BrandShader size="large" />
        </motion.div>

        <div className="space-y-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-6"
            >
                <div className="h-px w-12 bg-primary/40" />
                <h2 className="text-fluid-title font-black italic tracking-tighter uppercase text-foreground leading-none pt-1">
                  Synchronizing{dots}
                </h2>
                <div className="h-px w-12 bg-primary/40" />
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-8"
            >
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/10 italic">
                    <Activity size={12} className="text-primary" /> Core_Linked
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/10 italic">
                    <Database size={12} className="text-muted-foreground/20" /> Matrix_Active
                </div>
            </motion.div>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-2xl mx-auto p-8 rounded-3xl bg-muted/10 border border-border backdrop-blur-3xl shadow-inner"
        >
          <p className="text-[11px] text-muted-foreground/20 font-light italic leading-relaxed uppercase tracking-widest text-center">
            Verification Warning: Accessing sovereign data sharded across the OMEGA network. Some resonance patterns may require additional resolution for full indexed clarity.
          </p>
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}
