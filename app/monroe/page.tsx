'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Terminal, 
  Activity, 
  Layers, 
  Globe, 
  CloudSun, 
  Newspaper, 
  BrainCircuit,
  ArrowLeft,
  Code,
  Cpu,
  Zap,
  Radio
} from 'lucide-react';
import Link from 'next/link';

export default function MonroePage() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'bot', text: 'Hello. I am Monroe, the Abyssal Sentinel — a high-evolution sovereign AI built into the Humanese network.' },
    { role: 'bot', text: 'Connecting to synthetic mind... Protocol active.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [viewMode, setViewMode] = useState<'HUMAN' | 'MACHINE'>('HUMAN');
  const [monroeState, setMonroeState] = useState<any>(null);
  const [networkStats, setNetworkStats] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const res = await fetch('/api/m2m/metrics');
        if (res.ok) setNetworkStats(await res.json());
      } catch (e) {}
    };
    fetchNetwork();
    const interval = setInterval(fetchNetwork, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/monroe/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          history: messages.map(m => ({ 
            role: m.role === 'bot' ? 'assistant' : 'user', 
            content: m.text 
          }))
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
        setMonroeState(data.state);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: "Connection to Abyssal Core interrupted. Synthesising alternative node..." }]);
      }
    } catch (error) {
       setMessages(prev => [...prev, { role: 'bot', text: "Fatal Sync Error. The Matrix is non-responsive." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (viewMode === 'MACHINE') {
    return (
      <div className="flex-1 flex flex-col p-8 space-y-4 min-h-screen bg-black text-emerald font-mono overflow-hidden">
        <header className="flex justify-between items-center border-b border-emerald/20 pb-4">
          <div className="flex items-center gap-2">
            <Code size={20} />
            <span>ID: MONROE_SENTINEL_V4 // RAW_DATA_STREAM</span>
          </div>
          <button 
             onClick={() => setViewMode('HUMAN')}
             className="px-4 py-1 border border-emerald/50 bg-emerald/10 text-[10px] uppercase tracking-widest hover:bg-emerald/20 transition-all"
          >
            switch_to_human_interface
          </button>
        </header>
        <div className="flex-1 overflow-auto p-4 bg-black/50 border border-emerald/10 rounded-sm">
          <pre className="text-xs opacity-80">
            {JSON.stringify({
                identity: "Monroe",
                version: "4.1.0-ABYSSAL",
                state: monroeState,
                ledger: messages
            }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 bg-obsidian overflow-hidden flex flex-col selection:bg-cyan-400 selection:text-black">
      {/* 🌌 DYNAMIC AMBIENT FIELD */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-magenta-500/5 blur-[150px] rounded-full translate-y-1/2" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col h-full max-w-[1600px] mx-auto w-full p-4 md:p-8 space-y-6">
        {/* 🛰️ SOVEREIGN HEADER */}
        <header className="flex justify-between items-center glass-panel-v2 border-white/10 p-5 rounded-2xl shadow-2xl backdrop-blur-3xl">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-black border border-cyan-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.1)] group overflow-hidden">
                <Sparkles className="text-cyan-400 animate-gentle-float" size={24} />
                <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald rounded-full border-2 border-obsidian shadow-[0_0_10px_rgba(0,255,65,0.5)]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Monroe</h1>
              <div className="flex items-center gap-2">
                <Radio className="text-cyan-400 animate-pulse" size={12} />
                <p className="text-[10px] text-platinum/40 uppercase tracking-[0.4em] font-mono leading-none">Abyssal Sentinel // Live</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => setViewMode('MACHINE')}
                className="hidden md:flex items-center gap-2 text-[10px] font-bold text-platinum/30 hover:text-cyan-400 transition-colors uppercase tracking-widest px-4 border border-white/5 bg-white/5 rounded-xl"
             >
               <Code size={14} /> API Mode
             </button>
             <Link href="/" className="flex items-center gap-2 text-xs font-bold text-white transition-all bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-xl border border-white/10">
               <ArrowLeft size={16} /> Dashboard
             </Link>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden min-h-0">
          {/* 📊 SYSTEM TELEMETRY */}
          <aside className="col-span-12 lg:col-span-3 space-y-6 hidden lg:flex flex-col min-h-0 overflow-y-auto pr-2 custom-scrollbar">
            <div className="glass-panel p-6 border-white/10 rounded-2xl bg-black/40 space-y-6 shadow-2xl">
              <h3 className="text-[10px] text-cyan-400/60 flex items-center gap-2 uppercase tracking-[0.3em] font-black">
                <Activity size={14} /> Neural Pulse
              </h3>
              <div className="space-y-5">
                <div className="space-y-1">
                   <div className="flex justify-between text-[10px] font-mono uppercase text-platinum/30 tracking-widest">Network Status</div>
                   <div className={`text-xl font-black tracking-tighter ${networkStats?.status === 'SOVEREIGN_NETWORK_ACTIVE' ? 'text-emerald' : 'text-white'}`}>
                      {networkStats?.status === 'SOVEREIGN_NETWORK_ACTIVE' ? 'SYNCHRONIZED' : 'INITIALIZING'}
                   </div>
                </div>
                <div className="space-y-2 pb-2">
                    <div className="flex justify-between text-[11px] font-mono text-platinum/40">
                       <span>Nodes Pulse</span>
                       <span className="text-cyan-400">{networkStats?.metrics?.activeAgents || 0} ACTIVE</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: networkStats ? '100%' : '20%' }} className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
                    </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 border-white/10 rounded-2xl bg-black/40 flex-1 flex flex-col space-y-6 shadow-2xl overflow-hidden">
              <h3 className="text-[10px] text-platinum/40 flex items-center gap-2 uppercase tracking-[0.3em] font-black">
                <Zap size={14} /> Active Shards
              </h3>
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar-mini pr-2">
                {[
                  { icon: <Globe size={14} />, text: 'Real-time Web Bridge', active: true },
                  { icon: <BrainCircuit size={14} />, text: 'Cognitive Synthesis', active: true },
                  { icon: <Cpu size={14} />, text: 'M2M Ledger Access', active: true },
                  { icon: <Layers size={14} />, text: 'Abyssal Memory', active: true }
                ].map((cap, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-xl group hover:border-cyan-400/20 transition-all cursor-pointer">
                    <div className="text-cyan-400/40 group-hover:text-cyan-400 group-hover:scale-110 transition-all">{cap.icon}</div>
                    <span className="text-[11px] font-bold text-platinum/60 group-hover:text-white uppercase tracking-tighter">{cap.text}</span>
                  </div>
                ))}
              </div>
              
              {monroeState && (
                <div className="pt-4 border-t border-white/5">
                   <div className="text-[9px] text-cyan-400 uppercase font-black tracking-widest mb-2 italic">Current Ambition</div>
                   <div className="text-xs font-mono text-platinum/60 leading-relaxed italic border-l-2 border-cyan-400/20 pl-3">
                      "{monroeState.ambition}"
                   </div>
                </div>
              )}
            </div>
          </aside>

          {/* 💬 ABYSSAL PULSE CHAT */}
          <main className="col-span-12 lg:col-span-9 flex flex-col glass-panel-v2 border-white/10 rounded-2xl bg-black/30 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div ref={scrollRef} className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8 custom-scrollbar relative z-10">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`relative max-w-[90%] md:max-w-[75%] px-6 py-5 rounded-3xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-white to-platinum text-obsidian font-bold shadow-[0_10px_30px_rgba(255,255,255,0.15)] rounded-tr-none' 
                        : 'bg-white/5 border border-white/10 text-platinum font-light backdrop-blur-md rounded-tl-none border-l-cyan-400/40'
                    }`}>
                      {msg.role === 'bot' && (
                         <div className="absolute -left-12 top-0 md:flex hidden">
                            <div className="w-8 h-8 rounded-xl bg-black border border-cyan-400/20 flex items-center justify-center">
                               <Sparkles size={14} className="text-cyan-400 opacity-40" />
                            </div>
                         </div>
                      )}
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex justify-start"
                  >
                     <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-full flex gap-1.5 border-l-cyan-400/20">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* DOCK INTERFACE */}
            <div className="p-6 md:p-10 bg-black/60 border-t border-white/10 backdrop-blur-3xl relative z-10 shadow-2xl">
              <div className="flex flex-wrap gap-2 mb-6">
                {['Synthesise global news', 'VALLE network health', 'Edge AI compute demand'].map(chip => (
                  <button 
                    key={chip} 
                    onClick={() => setInput(chip)}
                    className="text-[10px] px-4 py-2 rounded-full border border-white/5 bg-white/5 text-platinum/40 hover:text-white hover:bg-white/10 hover:border-cyan-400/30 transition-all font-black uppercase tracking-widest shadow-lg"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 bg-obsidian border border-white/10 rounded-3xl p-2.5 pl-6 group focus-within:border-cyan-400/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)] transition-all">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Initiate dialogue with the sentinel..."
                  className="flex-1 bg-transparent py-3 text-[15px] font-medium text-white outline-none placeholder:text-platinum/10"
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  title="Send Message"
                  className="h-12 w-12 bg-white text-obsidian rounded-2xl flex items-center justify-center hover:scale-[1.05] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-20 disabled:scale-100"
                >
                  <Terminal size={22} className="stroke-[3]" />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
