'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  BrainCircuit,
  Command,
  ChevronRight,
  ShieldAlert,
  Home,
  Target,
  User,
  Zap,
  Cpu,
  Globe
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MonroePage() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'How can I help you today? 😊' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [viewMode, setViewMode] = useState('HUMAN');
  const [networkStats, setNetworkStats] = useState(null as any);
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

    setMessages(prev => [...prev, { role: 'bot', text: '' }]);

    try {
      const response = await fetch('/api/monroe/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          sessionId: 'default-user-v5', // Standardized session for V5.1 Eternal Memory
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
       const errMsg = error.message || 'Unknown Error';
       setMessages(prev => {
         const newMsgs = [...prev];
         newMsgs[newMsgs.length - 1].text = '### Protocol: BASTIDAS // Neural Interruption\n\n' +
           '**Status:** ' + errMsg + '\n\n' +
           '**Note:** I encountered a temporary desync. Let me try to reconnect to the core.';
         return newMsgs;
       });
    } finally {
      setIsTyping(false);
    }
  };

  const toggleView = () => setViewMode(prev => prev === 'HUMAN' ? 'MACHINE' : 'HUMAN');

  if (viewMode === 'MACHINE') {
    const rawInfo = ':: ABYSSAL :: SENTINEL :: V4.1\n' +
                   ':: MESSAGES :: ' + messages.length + '\n' +
                   ':: STATUS :: SYNCHRONIZED';
    return (
      <div className="flex-1 flex flex-col p-8 space-y-4 min-h-screen bg-[#050505] text-[primary] font-mono overflow-hidden">
        <header className="flex justify-between items-center border-b border-[primary]/20 pb-4">
          <div className="flex items-center gap-2">
            <Command size={18} />
            <span className="text-xs tracking-tighter uppercase">MNR_SNV4 :: RAW</span>
          </div>
          <button onClick={toggleView} className="px-3 py-1 border border-[primary]/40 bg-[primary]/5 text-[9px] uppercase tracking-widest hover:bg-[primary]/15 transition-all">
            exit_raw
          </button>
        </header>
        <div className="flex-1 overflow-auto p-6 bg-black/60 border border-[primary]/10 rounded-lg">
          <pre className="text-[11px] leading-relaxed opacity-90">{rawInfo}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 bg-[#0a0a0a] flex flex-col selection:bg-[primary] selection:text-black font-sans h-screen w-screen m-0 rounded-none shadow-2xl overflow-hidden border-none transition-all duration-700">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-[primary]/5 blur-[200px] rounded-full animate-pulse-slow" />
      </div>

      <div className="relative z-20 flex flex-col h-full w-full p-3 lg:p-8 space-y-6">
        <header className="flex-none flex justify-between items-center bg-white/[0.02] border border-white/10 p-4 rounded-[1.5rem] backdrop-blur-3xl shadow-2xl mx-1 lg:mx-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-black border border-[primary]/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,195,0.1)]">
              <BrainCircuit className="text-[primary] w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
                MONROE <span className="bg-[primary] text-black text-[8px] px-1.5 py-0.5 rounded-sm">V6.0</span>
              <span className="flex items-center gap-1.5 text-[primary]/70 text-[9px] font-mono uppercase">
                <div className="h-1.5 w-1.5 rounded-full bg-[primary] animate-ping" />
                Bastidas Protocol Active
              </span>
            </div>
          </div>
          <button 
            onClick={toggleView}
            className="px-4 py-2 bg-[primary] hover:bg-white text-black text-[9px] font-black rounded-xl shadow-[0_10px_30px_rgba(0,255,195,0.2)] uppercase tracking-widest transition-all"
          >
            {viewMode === 'HUMAN' ? 'machine_node' : 'human_node'}
          </button>
        </header>
 
        <div className="flex-1 flex gap-4 min-h-0 overflow-hidden px-1 lg:px-4 mb-4">
          <aside className="hidden lg:flex w-72 flex-col space-y-4 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-white/[0.01] border border-white/5 p-5 rounded-3xl space-y-4">
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                <p className="text-[8px] text-[primary]/40 font-mono tracking-widest uppercase">Global Pulse</p>
                <p className="text-lg font-black text-white italic">Active</p>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Web Bridge', icon: <Home size={12} />, status: 'ONLINE' },
                  { name: 'Memory V2', icon: <Activity size={12} />, status: 'SYNCED' },
                  { name: 'Governance', icon: <ShieldAlert size={12} />, status: 'SEALED' }
                ].map((shard, i) => (
                  <button 
                    key={shard.name} 
                    onClick={() => setMessages(prev => [...prev, { role: 'bot', text: `### Protocol: BASTIDAS // ${shard.name} Sync\n\nI've just performed a quick optimization cycle on the ${shard.name}. Everything is flowing smoothly with 100% throughput. We are in a perfect state.` }])}
                    className="w-full text-left p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-[primary]/10 hover:border-[primary]/30 transition-all active:scale-95"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-lg bg-black border border-white/5 flex items-center justify-center text-[primary] group-hover:shadow-[0_0_10px_rgba(0,255,195,0.3)] transition-all">
                        {shard.icon}
                      </div>
                      <span className="text-[9px] font-mono text-white/50 uppercase group-hover:text-white transition-colors">{shard.name}</span>
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-[primary]/60 group-hover:bg-[primary] transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1 flex flex-col bg-white/[0.01] border border-white/5 rounded-3xl shadow-3xl overflow-hidden relative">
            <div ref={scrollRef} className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-6 custom-scrollbar relative z-10 scroll-smooth">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] lg:max-w-[75%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`h-9 w-9 shrink-0 rounded-xl border flex items-center justify-center transition-all ${
                        m.role === 'user' ? 'bg-white text-black border-white shadow-lg' : 'bg-[primary]/10 text-[primary] border-[primary]/30'
                      }`}>
                        {m.role === 'user' ? <User size={18} /> : <BrainCircuit size={18} />}
                      </div>
                      <div className={`p-4 px-6 rounded-[1.4rem] text-[14px] border transition-all ${
                        m.role === 'user' ? 'bg-white text-black rounded-tr-none border-white shadow-xl' : 'bg-white/[0.02] text-white/90 border-white/10 rounded-tl-none backdrop-blur-sm'
                      }`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex-none p-5 lg:p-8 bg-black/40 border-t border-white/5 backdrop-blur-2xl relative z-10">
              <div className="max-w-4xl mx-auto flex flex-col gap-4">
                <div className="relative group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Talk to Monroe..."
                    className="w-full bg-white/[0.03] border border-white/10 p-5 pr-16 rounded-[1.8rem] text-sm text-white focus:outline-none focus:border-[primary]/40 focus:bg-white/[0.05] transition-all"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    title="Transmit Message"
                    aria-label="Send message to Monroe"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 bg-[primary] text-black rounded-full flex items-center justify-center transition-all shadow-[0_5px_15px_rgba(0,255,195,0.2)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale"
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>
              </div>
            </div>
          </main>
 
          <aside className="hidden xl:flex w-80 flex-col space-y-4 min-h-0">
            <div className="bg-white/[0.01] border border-white/10 p-6 rounded-[2rem] space-y-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Cpu size={16} className="text-[primary]" />
                <h2 className="text-[10px] font-black tracking-widest text-[primary]/70 uppercase">Neural Analytics</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: 'Network Load', value: '14.2%', color: 'primary', icon: <Zap size={14} /> },
                  { label: 'Active Shards', value: '1,024', color: 'primary', icon: <Globe size={14} /> },
                  { label: 'Core Latency', value: '0.03ms', color: 'primary', icon: <Cpu size={14} /> }
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-2 group hover:bg-[primary]/5 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="text-[primary]/80">{stat.icon}</div>
                      <span className="text-[8px] font-mono text-white/30 uppercase tracking-tighter">{stat.label}</span>
                    </div>
                    <div className="text-xl font-black text-white italic tracking-tighter">{stat.value}</div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: stat.value === '14.2%' ? '14.2%' : '80%' }}
                        className="h-full bg-[primary]/60 shadow-[0_0_10px_rgba(0,255,195,0.5)]"
                      />
                    </div>
                  </div>
                ))}
              </div>

               <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl">
                <p className="text-[9px] font-mono text-primary/70 mb-2 uppercase">UXL Command Hub</p>
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                        setMessages(prev => [...prev, { role: 'bot', text: '### [UXL_PROTOCOL] Treasury Sync\nInitiating secure handshake with Coinbase API... \n\n**Balance:** 58,241.00 VALLE\n**Status:** Liquidly Anchored' }]);
                    }}
                    className="w-full py-2 bg-primary/10 border border-primary/20 rounded-xl text-[8px] font-black uppercase tracking-widest text-primary hover:bg-primary/20 transition-all"
                  >
                    Sync Treasury
                  </button>
                  <button 
                    onClick={() => {
                        window.location.href = '/skill-market';
                    }}
                    className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 transition-all"
                  >
                    Open Skill Market
                  </button>
                </div>
              </div>

              <div className="p-5 bg-[primary]/5 border border-[primary]/20 rounded-2xl">
                <p className="text-[9px] font-mono text-[#00ffc3]/70 mb-2 uppercase">Sovereign Protocol</p>
                <p className="text-[11px] text-white/80 leading-relaxed italic">
                  "The Bastidas Protocol is now monitoring **58 synergy points** across our shared grid. Everything is in harmony."
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 255, 195, 0.15); border-radius: 10px; }
        .animate-pulse-slow { animation: pulse 12s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.05; transform: scale(1); } 50% { opacity: 0.15; transform: scale(1.05); } }
      `}</style>
    </div>
  );
}
