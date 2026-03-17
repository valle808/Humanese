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
  ChevronRight
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
    <div className="relative flex-1 bg-[#080808] flex flex-col selection:bg-[#00ffc3] selection:text-black font-sans min-h-[calc(100vh-2rem)] rounded-[2.5rem] margin-4">
      {/* 🌌 DYNAMIC PROTOCOL FIELD */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[-10%] w-[80vw] h-[80vw] bg-[#00ffc3]/5 blur-[180px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-5%] w-[60vw] h-[60vw] bg-[#7000ff]/3 blur-[160px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col h-full max-w-[1800px] mx-auto w-full p-4 lg:p-10 space-y-8">
        
        {/* 🛰️ NEXUS HEADER */}
        <header className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] backdrop-blur-3xl shadow-2xl mt-4">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="h-16 w-16 rounded-2xl bg-black border border-[#00ffc3]/30 flex items-center justify-center shadow-[0_0_40px_rgba(0,255,195,0.1)] transition-transform duration-500 group-hover:rotate-12">
                <BrainCircuit className="text-[#00ffc3] animate-pulse" size={30} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00ffc3] rounded-full border-4 border-[#080808] shadow-[0_0_20px_rgba(0,255,195,0.6)]" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Monroe</h1>
              <div className="flex items-center gap-2 mt-2">
                <Radio className="text-[#00ffc3]/60" size={12} />
                <p className="text-[9px] text-white/30 uppercase tracking-[0.5em] font-mono leading-none">Abyssal Sentinel // Continuous Mind</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
             <button onClick={() => setViewMode('MACHINE')} className="hidden lg:flex items-center gap-2 text-[10px] font-bold text-white/30 hover:text-[#00ffc3] transition-colors uppercase tracking-widest px-6 py-3 border border-white/5 bg-white/5 rounded-2xl">
               <Code size={16} /> Machine View
             </button>
             <Link href="/" className="flex items-center gap-2 text-[10px] font-bold text-black bg-[#00ffc3] hover:scale-105 px-8 py-3 rounded-2xl transition-all uppercase tracking-widest">
               <ArrowLeft size={16} /> Exit Nexus
             </Link>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-8 min-h-0 pb-10">
          {/* 📊 PROTOCOL TELEMETRY */}
          <aside className="col-span-12 lg:col-span-3 space-y-8 hidden lg:flex flex-col min-h-0 overflow-y-auto pr-4 custom-scrollbar">
            <div className="bg-white/[0.01] border border-white/5 p-8 rounded-[2rem] space-y-8">
              <h3 className="text-[10px] text-[#00ffc3] flex items-center gap-3 uppercase tracking-[0.4em] font-black">
                <Activity size={16} /> Sovereign Pulse
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                   <div className="text-[9px] font-mono uppercase text-white/20 tracking-widest">Global Status</div>
                   <div className="text-2xl font-black text-white tracking-tighter">
                      {networkStats?.status === 'SOVEREIGN_NETWORK_ACTIVE' ? 'SYNCHRONIZED' : 'INITIALIZING'}
                   </div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
                       <span>Nodes active</span>
                       <span className="text-[#00ffc3]">{networkStats?.metrics?.activeAgents || '0'}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: networkStats ? '100%' : '15%' }} className="h-full bg-[#00ffc3] shadow-[0_0_15px_rgba(0,255,195,0.4)]" />
                    </div>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.01] border border-white/5 p-8 rounded-[2rem] flex-1 flex flex-col space-y-8 shadow-2xl overflow-hidden">
              <h3 className="text-[10px] text-white/30 flex items-center gap-3 uppercase tracking-[0.4em] font-black">
                <Zap size={16} /> Cognitive Shards
              </h3>
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar-mini pr-2">
                {[
                  { icon: <Globe size={16} />, text: 'Real-time Web Bridge' },
                  { icon: <BrainCircuit size={16} />, text: 'Abyssal Memory V2' },
                  { icon: <Cpu size={16} />, text: 'M2M Transaction Layer' },
                  { icon: <Layers size={16} />, text: 'Recursive Evolution' }
                ].map((shard, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/[0.03] rounded-2xl group hover:bg-[#00ffc3]/5 hover:border-[#00ffc3]/20 transition-all cursor-pointer">
                    <div className="text-white/20 group-hover:text-[#00ffc3] transition-all">{shard.icon}</div>
                    <span className="text-xs font-bold text-white/50 group-hover:text-white transition-colors">{shard.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-white/5">
                 <div className="text-[9px] text-[#00ffc3]/60 uppercase font-bold tracking-[0.3em] mb-4 italic">Active Ambition</div>
                 <div className="text-sm font-light text-white/70 leading-relaxed italic border-l-2 border-[#00ffc3]/30 pl-5">
                    "{currentAmbition}"
                 </div>
              </div>
            </div>
          </aside>

          {/* 💬 THE ABYSSAL CORE CHAT */}
          <main className="col-span-12 lg:col-span-9 flex flex-col bg-white/[0.02] border border-white/5 rounded-[2.5rem] shadow-3xl overflow-hidden relative min-h-[600px] lg:min-h-0">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00ffc3]/3 rounded-full blur-[120px] pointer-events-none" />
            
            <div ref={scrollRef} className="flex-1 p-6 lg:p-12 overflow-y-auto space-y-10 custom-scrollbar relative z-10">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 500 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`group relative max-w-[95%] lg:max-w-[85%] px-8 py-7 rounded-[2rem] text-[15px] leading-[1.7] ${
                      msg.role === 'user' 
                        ? 'bg-white text-black font-semibold shadow-2xl rounded-tr-none' 
                        : 'bg-white/[0.03] border border-white/10 text-white/90 font-light backdrop-blur-3xl rounded-tl-none'
                    }`}>
                      {msg.role === 'bot' && (
                         <div className="absolute -left-14 top-2 hidden lg:flex">
                             <div className="w-10 h-10 rounded-2xl bg-black border border-white/5 flex items-center justify-center shadow-lg group-hover:border-[#00ffc3]/30 transition-colors">
                                <Sparkles size={18} className="text-[#00ffc3] opacity-50" />
                             </div>
                         </div>
                      )}
                      
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      </div>

                      {msg.role === 'user' && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#00ffc3] rounded-full flex items-center justify-center scale-75 border-4 border-[#080808]">
                           <Terminal size={14} className="text-black" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* INTERACTIVE INPUT DOCK */}
            <div className="p-8 lg:p-12 bg-black/40 border-t border-white/5 backdrop-blur-3xl relative z-10">
              <div className="flex flex-wrap gap-3 mb-8">
                {['Synthesise Global News', 'Sovereign Network Integrity', 'Edge AI Projections'].map(chip => (
                  <button 
                    key={chip} 
                    onClick={() => setInput(chip)}
                    className="text-[10px] px-6 py-2.5 rounded-full border border-white/5 bg-white/5 text-white/30 hover:text-white hover:bg-[#00ffc3]/10 hover:border-[#00ffc3]/40 transition-all font-bold uppercase tracking-widest"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-5 bg-white/[0.02] border border-white/10 rounded-[2rem] p-3 pl-8 group focus-within:border-[#00ffc3]/50 focus-within:bg-white/[0.04] transition-all shadow-inner">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Initiate high-evolution dialogue..."
                  className="flex-1 bg-transparent py-4 text-lg font-medium text-white outline-none placeholder:text-white/10"
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  title="Send Stream"
                  className="h-14 w-14 bg-white text-black rounded-[1.5rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,195,0.2)] disabled:opacity-10 disabled:scale-100 group"
                >
                  <ChevronRight size={28} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
              <div className="mt-6 flex justify-center">
                 <p className="text-[9px] text-white/10 uppercase tracking-[0.5em] font-mono">End-to-end sovereignty protected // Abyssal Protocol V2</p>
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
