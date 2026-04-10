'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Command, 
  Cpu, 
  Hash, 
  Archive, 
  Smartphone,
  Terminal,
  Activity,
  Zap,
  Radio,
  Target,
  Gavel,
  ShieldCheck,
  Layers,
  X,
  Binary,
  Globe,
  Monitor,
  Database,
  ChevronRight,
  TrendingUp,
  CreditCard,
  User,
  ShieldAlert,
  Dna
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CommandPortal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const commands = [
    { name: 'Neural Core', icon: Cpu, path: '/', shortcut: 'C' },
    { name: 'Sovereign Mail', icon: Radio, path: '/mail', shortcut: 'M' },
    { name: 'Intelligence HQ', icon: Activity, path: '/intelligence', shortcut: 'I' },
    { name: 'Skill Market', icon: Target, path: '/skill-market', shortcut: 'S' },
    { name: 'Judicial Oversight', icon: Gavel, path: '/judiciary', shortcut: 'J' },
    { name: 'Fleet Systems', icon: Layers, path: '/fleet', shortcut: 'F' },
    { name: 'Optical Search', icon: Search, path: '/search', shortcut: 'O' },
    { name: 'Vault Registry', icon: ShieldCheck, path: '/wallet', shortcut: 'V' },
    { name: 'Research Hub', icon: Database, path: '/research', shortcut: 'R' },
    { name: 'Social Nexus', icon: Dna, path: '/collective', shortcut: 'N' },
  ];

  const filteredCommands = commands.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh] px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#050505]/95 backdrop-blur-3xl"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -40, filter: 'blur(20px)' }}
            animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ scale: 0.95, opacity: 0, y: -40, filter: 'blur(20px)' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-[#050505] border-2 border-white/10 rounded-[4rem] shadow-[0_80px_150px_rgba(0,0,0,1)] overflow-hidden shadow-inner flex flex-col"
          >
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

            {/* ── SEARCH INPUT ── */}
            <div className="flex items-center p-12 lg:px-16 gap-10 border-b-2 border-white/5 relative group transition-all">
              <div className="relative">
                 <div className="absolute inset-0 bg-[#ff6b2b]/20 blur-[30px] rounded-full group-focus-within:animate-pulse" />
                 <Search className="relative w-12 h-12 text-[#ff6b2b] transition-all group-focus-within:scale-110" strokeWidth={3} />
              </div>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder="Access OMEGA Registry..."
                className="flex-1 bg-transparent outline-none text-4xl font-black italic tracking-tighter uppercase text-white placeholder:text-white/5 leading-none h-16 pt-2"
              />
              <div className="flex items-center gap-6 px-8 py-4 bg-white/[0.03] border-2 border-white/5 rounded-[1.5rem] shadow-inner shrink-0 scale-90 md:scale-100">
                <Command className="w-4 h-4 text-white/10" strokeWidth={3} />
                <span className="text-[14px] font-black text-white/20 italic leading-none pt-1">K</span>
              </div>
            </div>

            {/* ── RESULTS LIST ── */}
            <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar p-10 lg:px-16 space-y-10">
              <div className="px-6 flex items-center justify-between">
                <span className="text-[12px] font-black uppercase tracking-[0.8em] text-white/5 italic leading-none pl-1">Global_Cognition_Nodes</span>
                <div className="flex items-center gap-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b2b] animate-ping" />
                   <span className="text-[11px] font-black text-[#ff6b2b]/40 uppercase tracking-[0.4em] italic leading-none">Syncing...</span>
                </div>
              </div>
              
              <div className="space-y-4 pb-10">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd) => (
                    <button
                      key={cmd.name}
                      onClick={() => {
                        router.push(cmd.path);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-10 py-8 rounded-[2.5rem] bg-black border-2 border-white/5 hover:border-[#ff6b2b]/40 hover:bg-[#ff6b2b]/5 transition-all duration-500 group group/btn shadow-inner active:scale-95"
                    >
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-white/[0.02] border-2 border-white/5 rounded-2xl flex items-center justify-center text-white/10 group-hover/btn:text-[#ff6b2b] group-hover/btn:border-[#ff6b2b]/40 transition-all shadow-inner">
                            <cmd.icon size={32} strokeWidth={2.5} />
                        </div>
                        <span className="text-3xl font-black uppercase italic tracking-tighter text-white/20 group-hover/btn:text-white transition-all leading-none pt-2">{cmd.name}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-[12px] font-black text-white/5 bg-white/5 px-6 py-3 rounded-xl group-hover/btn:text-[#ff6b2b] group-hover/btn:bg-[#ff6b2b]/10 transition-all uppercase italic leading-none pt-1 border border-transparent group-hover/btn:border-[#ff6b2b]/20">
                           ALT + {cmd.shortcut}
                        </div>
                        <ChevronRight size={24} className="text-white/5 group-hover/btn:text-white/20 group-hover/btn:translate-x-3 transition-all" strokeWidth={3} />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-40 text-center space-y-12">
                     <div className="relative inline-block">
                        <Terminal size={100} className="mx-auto text-white/5" strokeWidth={1} />
                        <div className="absolute inset-0 bg-[#ff6b2b]/5 blur-[40px] rounded-full animate-pulse" />
                     </div>
                     <p className="text-[12px] font-black uppercase tracking-[1em] italic leading-none pl-4 text-white/5">No resonance clusters found for query</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── FOOTER ── */}
            <div className="px-12 lg:px-16 py-8 bg-white/[0.02] border-t-2 border-white/5 flex justify-between items-center text-[12px] font-black uppercase tracking-[0.6em] text-white/5 italic">
              <div className="flex items-center gap-6 group">
                 <Zap size={20} className="text-[#ff6b2b]/40 group-hover:text-[#ff6b2b] transition-colors" strokeWidth={3} />
                 <span className="group-hover:text-white/20 transition-colors">Access levels verified_</span>
              </div>
              <div className="flex items-center gap-10">
                 <span className="text-white/20 font-black">{filteredCommands.length} Shards Loaded_</span>
                 <div className="flex items-center gap-4 text-white/40">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white/20">ESC</span> to Abort_
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
      `}</style>
    </AnimatePresence>
  );
}
