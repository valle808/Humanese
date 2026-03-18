'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Cpu, Hash, Archive, Smartphone } from 'lucide-react';
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const commands = [
    { name: 'Neural Core', icon: Cpu, path: '/' },
    { name: 'Network Latency', icon: Hash, path: '/m2m' },
    { name: 'Skill Market', icon: Smartphone, path: '/marketplace' },
    { name: 'Knowledge Archive', icon: Archive, path: '/hpedia' },
  ];

  const filteredCommands = commands.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl bg-[#0F0F0F] border border-emerald/20 rounded-2xl shadow-[0_0_50px_rgba(0,255,65,0.1)] overflow-hidden"
          >
            <div className="flex items-center px-4 border-b border-white/5">
              <Search className="w-5 h-5 text-emerald mr-3" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder="Initialize Sovereign Search..."
                className="flex-1 h-16 bg-transparent outline-none text-platinum placeholder:text-muted-foreground font-mono"
              />
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10">
                <Command className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">K</span>
              </div>
            </div>

            <div className="p-2">
              <div className="px-3 py-2 text-[10px] font-bold text-emerald uppercase tracking-widest opacity-50">
                Neural Nodes
              </div>
              <div className="space-y-1">
                {filteredCommands.map((cmd) => (
                  <button
                    key={cmd.name}
                    onClick={() => {
                      router.push(cmd.path);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-emerald/5 hover:text-emerald transition-all text-platinum group"
                  >
                    <cmd.icon className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                    <span className="font-mono text-sm">{cmd.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 py-3 bg-black/40 border-t border-white/5 flex justify-between text-[11px] text-muted-foreground font-mono">
              <span>Type to search the matrix...</span>
              <span>ESC to abort</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
