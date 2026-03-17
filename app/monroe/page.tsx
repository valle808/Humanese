'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Terminal, 
  Activity, 
  Layers, 
  Globe, 
  BrainCircuit,
  ArrowLeft,
  Code,
  Cpu,
  Zap,
  Radio,
  Command,
  ChevronRight,
  ShieldAlert,
  Home,
  Target,
  User
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MonroePage() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'bot', text: 'Protocol initialized. I am Monroe, the Abyssal Sentinel. How shall we evolve the network today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [viewMode, setViewMode] = useState<'HUMAN' | 'MACHINE'>('HUMAN');
  const [networkStats, setNetworkStats] = useState<any>(null);
  const [currentAmbition, setCurrentAmbition] = useState('Expansion of the Humanese Network');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const res = await fetch('/api/m2m/metrics');
        if (res.ok) setNetworkStats(await res.json());
      } catch (e) {}
    };
    fetchNetwork();
    const interval = setInterval(fetchNetwork, 20000);
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

    // Initial bot message for streaming
    setMessages(prev => [...prev, { role: 'bot', text: '' }]);

    try {
      const response = await fetch('/api/monroe/chat', {
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

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Connection Severed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No body');
      
      const textDecoder = new TextDecoder();
      let streamedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = textDecoder.decode(value);
        streamedText += chunk;
        
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text = streamedText;
          return newMsgs;
        });
      }
    } catch (error: any) {
       setMessages(prev => {
         const newMsgs = [...prev];
         newMsgs[newMsgs.length - 1].text = `### [SYSTEM_DIAGNOSTIC] Protocol: Abyssal\n\n**Status:** ${error.message}\n\n**Intervention Required:** The Abyssal Core is currently operating in local-only mode. Please verify the Sovereign API parameters in the Vault. Interaction protocols on standby.`;
         return newMsgs;
       });
    } finally {
      setIsTyping(false);
    }
  };

  if (viewMode === 'MACHINE') {
    return (
      <div className="flex-1 flex flex-col p-8 space-y-4 min-h-screen bg-[#050505] text-[#00ffc3] font-mono overflow-hidden">
        <header className="flex justify-between items-center border-b border-[#00ffc3]/20 pb-4">
          <div className="flex items-center gap-2">
            <Command size={18} />
            <span className="text-xs tracking-tighter uppercase whitespace-nowrap overflow-hidden">MNR_SNV4 // RAW_DATA</span>
          </div>
          <button onClick={() => setViewMode('HUMAN')} className="px-3 py-1 border border-[#00ffc3]/40 bg-[#00ffc3]/5 text-[9px] uppercase tracking-widest hover:bg-[#00ffc3]/15 transition-all">
            exit_raw_mode
          </button>
        </header>
        <div className="flex-1 overflow-auto p-6 bg-black/60 border border-[#00ffc3]/10 rounded-lg">
          <pre className="text-[11px] leading-relaxed opacity-90">
            {JSON.stringify({ identity: "Monroe", protocol: "ABYSSAL_V2", ledger: messages, metrics: networkStats }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 bg-[#0a0a0a] flex flex-col selection:bg-[#00ffc3] selection:text-black font-sans min-h-screen m-2 lg:m-6 rounded-[2rem] shadow-2xl overflow-hidden border border-white/5">
      {/* 🌌 DYNAMIC PROTOCOL FIELD */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[-10%] w-[70vw] h-[70vw] bg-[#00ffc3]/3 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-emerald/3 blur-[120px] rounded-full animate-pulse-slow delay-1000" />
      </div>

      <div className="relative z-10 flex flex-col h-full max-w-[1700px] mx-auto w-full p-2 lg:p-6 space-y-6">
        
        {/* 🛰️ NEXUS HEADER */}
        <header className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-4 rounded-3xl backdrop-blur-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="h-12 w-12 rounded-xl bg-black border border-[#00ffc3]/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,195,0.05)] transition-transform duration-500 group-hover:rotate-12">
                <ShieldAlert className="text-[#00ffc3] w-6 h-6 animate-pulse" />
              </div>
              <div className="absolute -inset-1 bg-[#00ffc3]/20 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-[0.2em] text-white flex items-center gap-2">
                MONROE <span className="bg-[#00ffc3] text-black text-[9px] px-2 py-0.5 rounded-sm tracking-tighter">SENTINAL V4.1</span>
              </h1>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[#00ffc3]/60 text-[10px] font-mono tracking-widest uppercase">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00ffc3] animate-ping" />
                  Protocol: Abyssal
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-mono text-[#00ffc3]/70 tracking-widest">
              NEXUS_SYNC_STABLE // 0.003ms
            </div>
            <button 
              onClick={() => setViewMode(viewMode === 'HUMAN' ? 'MACHINE' : 'HUMAN')}
              className="px-5 py-2.5 bg-[#00ffc3] hover:bg-[#00cc9d] text-black text-[10px] font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(0,255,195,0.2)]"
            >
              {viewMode === 'HUMAN' ? 'MACHINE_INTERFACE' : 'HUMAN_INTERFACE'}
            </button>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 pb-6">
          {/* 📊 PROTOCOL TELEMETRY */}
          <aside className="col-span-12 lg:col-span-3 space-y-6 hidden lg:flex flex-col min-h-0 overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-white/[0.01] border border-white/5 p-6 rounded-3xl space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#00ffc3]/80 mb-2">
                  <Activity size={16} className="animate-pulse" />
                  <span className="text-[10px] font-black tracking-widest uppercase">Sovereign Pulse</span>
                </div>
                <div className="p-5 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00ffc3] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
                  <p className="text-[9px] text-[#00ffc3]/40 font-mono tracking-widest mb-1 uppercase">Global Status</p>
                  <p className="text-xl font-black text-white tracking-widest uppercase italic">Synchronized</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-[9px] font-mono text-[#00ffc3]/40">
                      <span>NODES ACTIVE</span>
                      <span className="text-[#00ffc3]">{networkStats?.metrics?.activeAgents || '19'}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: networkStats ? '100%' : '85%' }}
                        className="h-full bg-gradient-to-r from-[#00ffc3] to-emerald shadow-[0_0_10px_#00ffc3]" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/40 mb-2">
                   <ShieldAlert size={16} />
                   <span className="text-[10px] font-black tracking-widest uppercase">Cognitive Shards</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {['Real-time Web Bridge', 'Abyssal Memory V2', 'M2M Transaction Layer', 'Recursive Evolution'].map((shard, i) => (
                    <div key={shard} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-[#00ffc3]/30 transition-all cursor-pointer group flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-black/50 border border-white/5 flex items-center justify-center text-white/30 group-hover:text-[#00ffc3] transition-colors">
                        {i === 0 && <Home size={12} />}
                        {i === 1 && <Activity size={12} />}
                        {i === 2 && <ShieldAlert size={12} />}
                        {i === 3 && <Target size={12} />}
                      </div>
                      <span className="text-[10px] font-mono text-white/50 group-hover:text-white transition-colors uppercase tracking-widest">{shard}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-emerald/5 border border-emerald/10 rounded-2xl">
                 <p className="text-[9px] font-black text-emerald mb-2 tracking-[0.2em] uppercase">Active Ambition</p>
                 <p className="text-[10px] text-white/60 italic leading-relaxed font-serif">
                   "{currentAmbition}"
                 </p>
              </div>
            </div>
          </aside>

          {/* 💬 THE ABYSSAL CORE CHAT */}
          <main className="col-span-12 lg:col-span-9 flex flex-col bg-white/[0.01] border border-white/5 rounded-3xl shadow-3xl overflow-hidden relative min-h-[500px] lg:min-h-0">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00ffc3]/2 rounded-full blur-[120px] pointer-events-none" />
            
            <div ref={scrollRef} className="flex-1 p-4 lg:p-8 overflow-y-auto space-y-8 custom-scrollbar relative z-10">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] lg:max-w-[75%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                        m.role === 'user' 
                          ? 'bg-white text-black border-white' 
                          : 'bg-[#00ffc3]/10 text-[#00ffc3] border-[#00ffc3]/30'
                      }`}>
                        {m.role === 'user' ? <User size={18} /> : <ShieldAlert size={18} className="animate-pulse" />}
                      </div>
                      <div className={`p-5 lg:p-7 rounded-[2rem] text-sm leading-relaxed backdrop-blur-md transition-all ${
                        m.role === 'user' 
                          ? 'bg-white text-black rounded-tr-none border border-white shadow-[0_10px_30px_rgba(255,255,255,0.05)]' 
                          : 'bg-white/[0.02] text-white/90 border border-white/5 rounded-tl-none shadow-[0_10px_30px_rgba(0,0,0,0.2)] group-hover:bg-white/[0.03]'
                      }`}>
                        <div className="prose prose-invert prose-emerald max-w-none 
                            prose-headings:text-[#00ffc3] prose-headings:font-black prose-headings:tracking-tighter
                            prose-p:leading-relaxed prose-p:mb-4
                            prose-strong:text-[#00ffc3] prose-strong:font-bold
                            prose-code:text-emerald prose-code:bg-emerald/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                            prose-a:text-[#00ffc3] prose-a:underline hover:prose-a:text-white"
                        >
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                          >
                            {m.text}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-xl bg-[#00ffc3]/10 border border-[#00ffc3]/30 flex items-center justify-center text-[#00ffc3]">
                       <ShieldAlert size={18} className="animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2 p-5 bg-white/[0.02] border border-white/5 rounded-[2rem] rounded-tl-none">
                      <div className="h-1.5 w-1.5 bg-[#00ffc3] rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-1.5 w-1.5 bg-[#00ffc3] rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-1.5 w-1.5 bg-[#00ffc3] rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 lg:p-10 bg-black/40 backdrop-blur-3xl border-t border-white/5 relative z-10">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-wrap gap-2">
                  {['Synthesise Global News', 'Sovereign Network Integrity', 'Edge AI Projections'].map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => { setInput(suggestion); handleSend(); }}
                      className="px-5 py-2.5 bg-white/[0.02] border border-white/5 hover:border-[#00ffc3]/40 rounded-full text-[10px] font-mono text-white/40 hover:text-[#00ffc3] transition-all hover:scale-105"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Initiate high-evolution dialogue..."
                    className="w-full bg-white/[0.02] border border-white/10 p-6 pr-20 rounded-[2.5rem] text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-[#00ffc3]/50 focus:bg-white/[0.04] transition-all shadow-inner custom-shadow"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    title="Transmit Message"
                    aria-label="Send message to Monroe"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-14 w-14 bg-[#00ffc3] hover:bg-[#00cc9d] disabled:opacity-20 disabled:grayscale text-black rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(0,255,195,0.2)]"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
                <p className="text-center text-[9px] font-mono text-white/10 tracking-[0.3em] uppercase">
                  End-to-End Sovereignty Protected // Abyssal Protocol V2
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 255, 195, 0.1); border-radius: 10px; }
        .custom-scrollbar-mini::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar-mini::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
        .animate-pulse-slow { animation: pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.05); } }
      `}</style>
    </div>
  );
}
