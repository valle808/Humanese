'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Terminal, 
  Send, 
  Lock, 
  Activity, 
  Link as LinkIcon,
  Twitter,
  Radio
} from 'lucide-react';

export default function AdminPage() {
  const [systemData, setSystemData] = useState<any>(null);
  const [coinbaseData, setCoinbaseData] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState(false);
  const [tweetText, setTweetText] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);

  useEffect(() => {
    if (isAuthorized) {
      const fetchData = async () => {
        try {
          const [statsRes, cbRes] = await Promise.all([
            fetch('/api/admin/stats'),
            fetch('/api/coinbase/balances')
          ]);
          if (statsRes.ok) setSystemData(await statsRes.json());
          if (cbRes.ok) setCoinbaseData(await cbRes.json());
        } catch (e) {
          console.error("Admin Sync Error:", e);
        }
      };
      fetchData();
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthorized]);

  const handleAuthorize = () => {
    // In production, this would be an actual Auth session check
    if (passphrase === (process.env.NEXT_PUBLIC_ADMIN_KEY || 'VALLE_OVERLORD')) {
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleTransmit = async () => {
    setIsTransmitting(true);
    try {
      // In a real scenario, this would post to a broadast endpoint
      await new Promise(r => setTimeout(r, 1500));
      setIsTransmitting(false);
      setTweetText('');
      alert('Transmission successful. Social breach achieved.');
    } catch (e) {
      setIsTransmitting(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-panel p-8 border border-white/10 rounded-2xl bg-black/40 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-emerald/10 border border-emerald/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,255,65,0.1)]">
            <ShieldAlert size={40} className="text-emerald" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Supreme Command</h1>
            <p className="text-[10px] text-platinum/40 uppercase tracking-[0.3em] font-mono mt-2">Secure Protocol v4.1 // OMEGA CHECK</p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-platinum/20" size={16} />
              <input 
                type="password"
                placeholder="Abyssal Key Phrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAuthorize()}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white text-sm outline-none focus:border-emerald/50 transition-colors"
              />
            </div>
            {error && (
              <p className="text-magenta-500 text-[10px] font-bold uppercase animate-bounce">Access Denied. Protocol Rejection.</p>
            )}
            <button 
              onClick={handleAuthorize}
              className="w-full py-4 bg-emerald text-black font-black text-xs uppercase tracking-[0.2em] rounded-sm hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(0,255,65,0.2)]"
            >
              Authorize Access
            </button>
          </div>
          <div className="text-[9px] text-platinum/20 font-mono">
            IP_LOGGED: TRUE • SESSION_ENCRYPTION: AES-256
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* 🏙️ ADMIN HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
            <Radio className="text-emerald" size={32} />
            Command Terminal
          </h1>
          <p className="text-platinum/40 text-sm">System oversight, swarm orchestration, and social bridge management.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1 items-end mr-4">
             <div className="text-[9px] text-platinum/20 uppercase font-mono">Treasury Status</div>
             <div className="flex gap-4">
                {coinbaseData?.onChain?.sol && (
                  <div className="text-[11px] font-mono text-emerald">
                    {coinbaseData.onChain.sol.balance.toFixed(4)} SOL
                  </div>
                )}
                {coinbaseData?.coinbase?.length > 0 && (
                   <div className="text-[11px] font-mono text-cyan-400">
                     CONNECTED
                   </div>
                )}
             </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald/10 border border-emerald/20 shadow-[0_0_15px_rgba(0,255,65,0.1)] rounded-xl text-[10px] text-emerald font-bold uppercase tracking-widest hover:bg-emerald/20 transition-all">
            <LinkIcon size={14} /> Link Coinbase
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 border border-emerald/20 bg-emerald/5 rounded-full text-[10px] text-emerald font-bold uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse shadow-[0_0_5px_rgba(0,255,65,1)]" />
            Clearance: OMEGA
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ── BROADCAST CONSOLE ── */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="glass-panel p-8 border border-white/10 rounded-2xl bg-black/40 space-y-6 overflow-hidden relative">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-2xl">
                🏛️
              </div>
              <div>
                <div className="text-[10px] text-platinum/40 uppercase tracking-widest">Broadcasting as</div>
                <div className="text-white font-bold text-lg">SUPREME COMMANDER</div>
              </div>
            </div>

            <textarea 
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              placeholder="What command should breach the human social barrier?"
              className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg placeholder:text-platinum/20 outline-none focus:border-emerald/50 transition-colors resize-none"
            />

            <div className="flex justify-between items-center border-t border-white/5 pt-6">
              <div className="font-mono text-[10px] text-platinum/30 tracking-widest">
                LENGTH: <span className={tweetText.length > 280 ? 'text-magenta-500' : 'text-emerald'}>{tweetText.length}</span> / 280
              </div>
              <button 
                onClick={handleTransmit}
                disabled={!tweetText.trim() || tweetText.length > 280 || isTransmitting}
                className="flex items-center gap-3 px-8 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-sm hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 transition-all"
              >
                {isTransmitting ? 'Transmitting...' : (
                  <>
                    Transmit to X <Send size={14} />
                  </>
                )}
              </button>
            </div>
            
            <Twitter className="absolute top-8 right-8 text-white/5 transition-opacity" size={120} />
          </div>

          {/* SYSTEM LOGS — DATA DRIVEN */}
          <div className="glass-panel border border-white/10 rounded-2xl bg-black/40 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h3 className="text-[10px] text-platinum/60 uppercase tracking-widest font-bold flex items-center gap-2">
                <Terminal size={14} className="text-emerald" /> System Manifest
              </h3>
              <span className="text-[9px] text-platinum/30 font-mono">NODE_PULSE: OK</span>
            </div>
            <div className="p-4 space-y-3 font-mono text-[10px] h-64 overflow-y-auto custom-scrollbar">
              {systemData?.manifest?.length > 0 ? (
                systemData.manifest.map((log: any, i: number) => (
                  <div key={log.id} className="border-l border-white/10 pl-3 py-1 group hover:border-emerald/50 transition-all">
                    <div className="flex gap-2 text-platinum/20 mb-1">
                      <span>[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className="text-emerald/60">@{log.agentName}</span>
                    </div>
                    <div className="text-platinum/60 group-hover:text-platinum/90 transition-all">
                       {log.thought}
                    </div>
                    {log.action && (
                      <div className="text-cyan-400 mt-1 uppercase text-[9px] tracking-widest">
                        → EXECUTION: {log.action}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-platinum/20 italic animate-pulse">Awaiting neural pulse from Sovereign Swarm...</div>
              )}
            </div>
          </div>
        </div>

        {/* ── SIDEBAR METRICS ── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 border border-white/10 rounded-xl bg-black/40 space-y-6">
            <h3 className="text-[10px] text-platinum/40 flex items-center gap-2 uppercase tracking-widest font-bold">
              <Activity size={14} /> Metric Pulse
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Transmissions', val: systemData?.metrics?.transmissions || '0', color: 'text-white' },
                { label: 'Network Reach', val: systemData?.metrics?.reach || '0.0M', color: 'text-cyan-400' },
                { label: 'Sovereign Nodes', val: systemData?.metrics?.nodes || '0', color: 'text-emerald' },
                { label: 'Abyssal Depth', val: systemData?.metrics?.depth || 'Level 1', color: 'text-platinum/60' }
              ].map((m, i) => (
                <div key={i} className="flex justify-between items-end border-b border-white/5 pb-2">
                  <span className="text-xs text-platinum/40 uppercase tracking-tighter">{m.label}</span>
                  <span className={`text-xl font-black ${m.color}`}>{m.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 border border-magenta-500/20 rounded-xl bg-magenta-500/5 space-y-4">
            <h3 className="text-[10px] text-magenta-400 font-bold uppercase tracking-widest">Protocol Overrides</h3>
            <div className="space-y-2">
              <button className="w-full py-3 border border-magenta-500/30 text-magenta-500 text-[10px] font-bold uppercase tracking-widest hover:bg-magenta-500/10 transition-colors"> Force Resync Swarm </button>
              <button className="w-full py-3 border border-white/10 text-platinum/40 text-[10px] font-bold uppercase tracking-widest cursor-not-allowed opacity-50"> Purge Abyssal Vault (LOCKED) </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
