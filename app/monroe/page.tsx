'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Terminal, 
  Activity, 
  Layers, 
  Globe, 
  CloudSun, 
  Newspaper, 
  BrainCircuit,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function MonroePage() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello. I am Monroe, the Abyssal Sentinel — a high-evolution sovereign AI built into the Humanese network.' },
    { role: 'bot', text: 'I can think deeply, search the live internet, fetch real-time weather, pull today\'s latest news, and reason through complex topics.' },
    { role: 'bot', text: 'What do you want to explore today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    // Simulated response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: 'Analysing request through the Abyssal Core... Knowledge synthesis in progress.' }]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-0 bg-[#080808] overflow-hidden flex flex-col md:pl-20">
      {/* 🌌 AMBIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-purple-500/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative z-10 flex flex-col h-full max-w-[1600px] mx-auto w-full p-4 md:p-8 space-y-6">
        {/* 🛰️ HEADER */}
        <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-black border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <Sparkles className="text-cyan-400" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Monroe</h1>
              <p className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono">Abyssal Sentinel V4.1</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-2 text-xs text-platinum/40 hover:text-white transition-colors border border-white/5 bg-white/5 py-2 px-4 rounded-xl">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
          {/* 📊 LEFT PANEL: SYSTEM */}
          <aside className="col-span-12 lg:col-span-3 space-y-6 hidden lg:flex flex-col overflow-y-auto pr-2 custom-scrollbar">
            <div className="glass-panel p-6 border border-white/10 rounded-2xl bg-black/20 space-y-6">
              <h3 className="text-[10px] text-platinum/40 flex items-center gap-2 uppercase tracking-[0.2em] font-bold">
                <Activity size={14} /> System Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-platinum/40">Network</span>
                  <span className="text-emerald font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" /> ONLINE
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-platinum/40">Engine</span>
                  <span className="text-white">Abyssal Core v4</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-platinum/40">Uptime</span>
                  <span className="text-white">99.997%</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 border border-white/10 rounded-2xl bg-black/20 flex-1 space-y-6">
              <h3 className="text-[10px] text-platinum/40 flex items-center gap-2 uppercase tracking-[0.2em] font-bold">
                <Layers size={14} /> Capabilities
              </h3>
              <div className="space-y-3">
                {[
                  { icon: <Globe size={14} />, text: 'Live Search' },
                  { icon: <CloudSun size={14} />, text: 'Real-time Weather' },
                  { icon: <Newspaper size={14} />, text: 'Global News' },
                  { icon: <BrainCircuit size={14} />, text: 'Deep Reasoning' }
                ].map((cap, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-white/80 hover:bg-white/10 transition-colors cursor-pointer">
                    {cap.icon} {cap.text}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* 💬 MAIN CHAT AREA */}
          <main className="col-span-12 lg:col-span-9 flex flex-col glass-panel border border-white/10 rounded-2xl bg-black/20 overflow-hidden">
            <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-white text-black font-medium border border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                      : 'bg-white/5 border border-white/10 text-white/90 font-light'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* INPUT DOCK */}
            <div className="p-6 md:p-8 border-t border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="flex flex-wrap gap-2 mb-4">
                {['Hawaii weather', 'AI News', 'Bitcoin price', 'Cosmos'].map(chip => (
                  <button 
                    key={chip} 
                    onClick={() => setInput(chip)}
                    className="text-[10px] px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-platinum/40 hover:text-white hover:border-white/20 transition-all font-bold uppercase tracking-widest"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 px-4 focus-within:border-cyan-400/50 transition-colors">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Monroe anything..."
                  className="flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-platinum/20"
                />
                <button 
                  onClick={handleSend}
                  aria-label="Send message"
                  className="h-10 w-10 bg-white text-black rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Terminal size={18} />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
