'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Wallet, 
  Bot, 
  LogOut, 
  ChevronUp, 
  ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';

export const UserMenu = ({ isExpanded }: { isExpanded: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in via local storage session or Supabase client
    const checkUser = () => {
      try {
        const session = localStorage.getItem('humanese_session');
        if (session) {
          // For display purposes, we can just grab email/name from session if stored, 
          // or we can fetch from an API. Since we don't know exact session structure, 
          // we'll try to parse it, else fetch from supabase.
          // Fallback:
          setUser({ name: 'Sovereign Entity', email: 'entity@humanese.net' });
        }
      } catch (e) {}
    };

    checkUser();
    
    // Close on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null; // Don't render if not authenticated

  const handleLogout = () => {
    localStorage.removeItem('humanese_session');
    window.location.href = '/auth';
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center p-3 rounded-[2rem] bg-background border-2 border-border hover:border-[#ff6b2b]/40 transition-all active:scale-95 group ${isExpanded ? 'gap-4' : 'justify-center'}`}
      >
        <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground group-hover:text-[#ff6b2b] transition-colors shrink-0">
          <User size={20} />
        </div>
        
        {isExpanded && (
          <div className="flex flex-col items-start overflow-hidden text-left flex-1">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] italic text-foreground truncate w-full">{user.name}</span>
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] italic truncate w-full">{user.email}</span>
          </div>
        )}
        
        {isExpanded && (
          <ChevronUp 
            size={16} 
            className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute bottom-full mb-4 ${isExpanded ? 'left-0 w-full' : 'left-full ml-4 w-56'} bg-background/95 backdrop-blur-xl border border-border rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.2)] p-2 z-[200]`}
          >
            <div className="space-y-1">
              <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-3 rounded-[1.5rem] hover:bg-secondary transition-colors text-foreground group">
                <Settings size={18} className="text-muted-foreground group-hover:text-foreground" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Identity Settings</span>
              </Link>
              <Link href="/wallet" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-3 rounded-[1.5rem] hover:bg-secondary transition-colors text-foreground group">
                <Wallet size={18} className="text-muted-foreground group-hover:text-foreground" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Sovereign Vault</span>
              </Link>
              <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-3 rounded-[1.5rem] hover:bg-secondary transition-colors text-foreground group">
                <Bot size={18} className="text-muted-foreground group-hover:text-foreground" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Personal Agent</span>
              </Link>
              <div className="h-[1px] w-full bg-border my-2" />
              <button onClick={handleLogout} className="w-full flex items-center gap-4 p-3 rounded-[1.5rem] hover:bg-[#ff6b2b]/10 transition-colors text-[#ff6b2b] group">
                <LogOut size={18} className="text-[#ff6b2b]/60 group-hover:text-[#ff6b2b]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Disconnect</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
