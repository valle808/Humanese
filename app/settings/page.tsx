'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings2, 
  Bot, 
  ShieldCheck, 
  Mail, 
  Smartphone, 
  Wallet,
  Activity,
  LogOut,
  Edit3
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // In a real implementation, we would fetch the full profile from `/api/user/profile`
    // For now, we simulate loading the session.
    try {
      const session = localStorage.getItem('humanese_session');
      if (session) {
        setUser({
          name: 'Sovereign Entity',
          handle: '@entity.humanese',
          email: 'entity@humanese.net',
          phone: '+1 800 555 0199',
          agent: {
            name: 'Personal Nexus',
            level: 4,
            xp: 2450,
            status: 'LEARNING'
          },
          wallet: 'HMN-USR-A9B8C7D6'
        });
      }
    } catch(e) {}
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="animate-spin text-[#ff6b2b]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-12 pb-32 max-w-6xl mx-auto space-y-12">
      
      {/* HEADER */}
      <header className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-3xl bg-[#ff6b2b]/10 border border-[#ff6b2b]/30 flex items-center justify-center">
          <Settings2 size={32} className="text-[#ff6b2b]" />
        </div>
        <div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none">
            Ecosystem <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b2b] to-[#ff6b2b]/40">Settings</span>
          </h1>
          <p className="text-muted-foreground font-black uppercase tracking-[0.3em] italic mt-2 text-sm">Identity & Agent Management</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* IDENTITY CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-secondary/30 border border-border rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <User size={200} />
            </div>

            <div className="flex items-center gap-6 mb-8 relative z-10">
              <div className="w-20 h-20 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-lg relative">
                <User size={32} className="text-foreground" />
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-[#ff6b2b] rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform">
                  <Edit3 size={12} />
                </button>
              </div>
              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tight">{user.name}</h2>
                <p className="text-[#ff6b2b] font-black uppercase tracking-[0.2em] italic text-sm">{user.handle}</p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border">
                <div className="flex items-center gap-4">
                  <Mail className="text-muted-foreground" size={20} />
                  <span className="font-mono text-sm">{user.email}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff6b2b] italic bg-[#ff6b2b]/10 px-3 py-1 rounded-full">Primary</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border">
                <div className="flex items-center gap-4">
                  <Smartphone className="text-muted-foreground" size={20} />
                  <span className="font-mono text-sm">{user.phone}</span>
                </div>
                <button className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground italic transition-colors">Update</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border">
                <div className="flex items-center gap-4">
                  <Wallet className="text-muted-foreground" size={20} />
                  <span className="font-mono text-sm text-[#ff6b2b]">{user.wallet}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Sovereign Vault</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AGENT CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="bg-[#ff6b2b]/5 border border-[#ff6b2b]/20 rounded-[2.5rem] p-8 relative overflow-hidden h-full flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-b from-[#ff6b2b]/10 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <Bot size={28} className="text-[#ff6b2b]" />
              <h3 className="text-xl font-black uppercase italic tracking-tight text-[#ff6b2b]">Personal Agent</h3>
            </div>

            <div className="flex-1 space-y-6 relative z-10">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff6b2b]/60 italic mb-1">Designation</div>
                <div className="text-2xl font-black italic">{user.agent.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 p-4 rounded-2xl border border-[#ff6b2b]/10">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic mb-1">Level</div>
                  <div className="text-3xl font-black text-[#ff6b2b]">{user.agent.level}</div>
                </div>
                <div className="bg-background/50 p-4 rounded-2xl border border-[#ff6b2b]/10">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic mb-1">Status</div>
                  <div className="text-sm font-black text-[#ff6b2b] mt-2 animate-pulse">{user.agent.status}</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic mb-2">
                  <span>Experience (XP)</span>
                  <span className="text-[#ff6b2b]">{user.agent.xp} / 5000</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden border border-[#ff6b2b]/10">
                  <div className="h-full bg-[#ff6b2b]" style={{ width: `${(user.agent.xp / 5000) * 100}%` }} />
                </div>
              </div>
            </div>

            <button className="w-full mt-8 py-4 bg-[#ff6b2b]/10 border border-[#ff6b2b]/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-[#ff6b2b] hover:bg-[#ff6b2b] hover:text-black transition-all italic relative z-10">
              Configure Agent
            </button>
          </div>
        </motion.div>

        {/* SECURITY CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="bg-secondary/30 border border-border rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center shrink-0">
                <ShieldCheck size={28} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tight">Security & Protocol</h3>
                <p className="text-sm text-muted-foreground italic max-w-xl mt-1">Manage your recovery vectors, view audit logs, and enforce multi-factor authentication for absolute sovereignty.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
              <Link href="/auth/recover" className="px-6 py-4 bg-background border border-border rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:border-[#ff6b2b]/40 hover:text-[#ff6b2b] transition-all italic text-center">
                Reveal Phrase
              </Link>
              <button onClick={() => { localStorage.removeItem('humanese_session'); window.location.href = '/auth'; }} className="px-6 py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all italic flex items-center justify-center gap-3">
                <LogOut size={16} /> Disconnect
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
