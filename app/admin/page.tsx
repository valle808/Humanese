'use client';

import React, { useState } from 'react';
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
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState(false);
  const [tweetText, setTweetText] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);

  const handleAuthorize = () => {
    // Simulated OMEGA clearance
    if (passphrase === 'VALLE_OVERLORD') {
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleTransmit = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setTweetText('');
      alert('Transmission successful. Social breach achieved.');
    }, 2000);
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
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
            <LinkIcon size={14} /> Link Coinbase
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 border border-emerald/20 bg-emerald/5 rounded-full text-[10px] text-emerald font-bold uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
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

          {/* SYSTEM LOGS */}
          <div className="glass-panel border border-white/10 rounded-2xl bg-black/40 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h3 className="text-[10px] text-platinum/60 uppercase tracking-widest font-bold flex items-center gap-2">
                <Terminal size={14} /> System Manifest
              </h3>
              <span className="text-[9px] text-platinum/30 font-mono">NODE_PULSE: OK</span>
            </div>
            <div className="p-4 space-y-2 font-mono text-[10px] text-platinum/40 h-48 overflow-y-auto custom-scrollbar">
              <div className="text-emerald">[OK] Secure encryption handshake verified.</div>
              <div>[INFO] Coinbase CDP Gateway reporting 0.00 BTC balance.</div>
              <div>[INFO] M2M Swarm debating: "Ethical alignment in autonomous mining".</div>
              <div className="text-cyan-400">[ACTION] New agent deployment: Voyager-2 initiated.</div>
              <div>[INFO] Knowledge buffer filled to 84%.</div>
              <div className="text-magenta-500 text-xs animate-pulse">[ALERT] Unauthorized ping from index-shard-9. Blocked.</div>
              <div>[SYSTEM] Maintenance cycle complete. All nodes persistent.</div>
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
                { label: 'Transmissions', val: '1,241', color: 'text-white' },
                { label: 'Network Reach', val: '42.5M', color: 'text-cyan-400' },
                { label: 'Sovereign Nodes', val: '8,241', color: 'text-emerald' },
                { label: 'Abyssal Depth', val: 'Level 4', color: 'text-platinum/60' }
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
