'use client';

import React, { useState } from 'react';
import { Search, Loader2, ArrowRight, Zap, Target, Binary, Terminal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  variant?: 'default' | 'nav' | 'hero';
}

export function SearchBar({ onSearch, isLoading = false, variant = 'default' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="w-full relative group">
        <div className="relative rounded-[2.5rem] border-2 border-white/10 bg-[#050505]/40 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] p-2 transition-all group-focus-within:border-[#ff6b2b]/40 shadow-inner">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
          
          <div className="flex items-center gap-6 px-8">
             <Search className="h-8 w-8 text-[#ff6b2b] group-focus-within:animate-pulse transition-all" strokeWidth={3} />
             <input
               type="text"
               placeholder="Search Sovereign Knowledge..."
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               className="h-20 bg-transparent flex-1 text-2xl text-white placeholder:text-white/5 border-0 focus:ring-0 focus:outline-none font-black italic tracking-tighter uppercase pt-2"
               disabled={isLoading}
               maxLength={500}
             />
             <button
               type="submit"
               disabled={isLoading || !query.trim()}
               className="h-16 w-16 grid place-items-center rounded-2xl bg-[#ff6b2b] text-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-[0_20px_40px_rgba(255,107,43,0.3)]"
             >
               {isLoading ? (
                 <Loader2 className="h-8 w-8 animate-spin" strokeWidth={3} />
               ) : (
                 <ArrowRight className="h-8 w-8" strokeWidth={3} />
               )}
             </button>
          </div>
        </div>
      </form>
    );
  }

  if (variant === 'nav') {
    return (
      <form onSubmit={handleSubmit} className="w-full">
         <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/10 group-focus-within:text-[#ff6b2b] transition-colors" strokeWidth={3} />
            <input
              type="text"
              placeholder="Access Registry..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 bg-black border-2 border-white/5 rounded-2xl pl-14 pr-20 text-sm text-white placeholder:text-white/5 focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 outline-none transition-all font-black uppercase tracking-[0.2em] italic shadow-inner"
              disabled={isLoading}
              maxLength={500}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-lg scale-75">
               <span className="text-[10px] font-black text-white/20 italic uppercase pt-0.5">K</span>
            </div>
         </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-[#ff6b2b]/5 blur-[20px] rounded-[2rem] opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="relative flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-white/10 group-focus-within:text-[#ff6b2b] transition-colors" strokeWidth={3} />
            <input
              type="text"
              placeholder="Search Sovereign Knowledge Matrix..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-20 bg-[#050505] border-2 border-white/5 rounded-[2rem] pl-16 pr-10 text-xl text-white placeholder:text-white/5 focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 outline-none transition-all font-black uppercase tracking-tighter italic shadow-inner pt-2"
              disabled={isLoading}
              maxLength={500}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="h-20 px-10 bg-[#ff6b2b] text-black text-xs font-black uppercase tracking-[0.8em] rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,107,43,0.3)] disabled:opacity-50 italic pt-1 leading-none border-0"
          >
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin mx-auto" strokeWidth={3} />
            ) : (
              'Initiate_Sync'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
