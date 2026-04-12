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
  Globe,
  Paperclip,
  X,
  ImageIcon,
  ChevronLeft,
  Search,
  Database,
  Layers,
  Sparkles,
  Radio,
  ShieldCheck,
  Terminal,
  Orbit,
  Wifi
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import gsap from 'gsap';

type Message = {
  role: 'bot' | 'user';
  text: string;
  images?: string[]; 
  id: string;
};

export default function MonroePage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'start', role: 'bot', text: 'Hello. I am Monroe, the flagship Omni-Model Intelligence of the OMEGA platform. I am currently operating under Intense Orange (#ff6b2b) protocol standards. How shall we accelerate humanity today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [viewMode, setViewMode] = useState('HUMAN');
  const [knowledgeGraph, setKnowledgeGraph] = useState<any>(null);
  
  // File Attachment State
  const [attachments, setAttachments] = useState<{file: File, preview: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await fetch('/api/knowledge-graph');
        if (res.ok) {
          const data = await res.json();
          setKnowledgeGraph(data);
        }
      } catch (err) {
        console.warn('Sovereign Matrix: Graph sync pending.', err);
      }
    };
    fetchGraph();
    const interval = setInterval(fetchGraph, 12000);
    return () => clearInterval(interval);
  }, []);

  // GSAP Entrance
  useEffect(() => {
    if (chatContainerRef.current) {
      gsap.fromTo(".message-bubble", 
        { opacity: 0, y: 40, filter: 'blur(15px)', scale: 0.95 }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 1, stagger: 0.2, ease: "expo.out" }
      );
    }
  }, [messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, attachments]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/') || f.type.includes('pdf') || f.type.includes('text/'));
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachments(prev => [...prev, { file, preview: reader.result as string }]);
        };
        reader.readAsDataURL(file); 
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isTyping) return;
    
    const base64Images = attachments.filter(a => a.file.type.startsWith('image/')).map(a => a.preview);
    const textFilesBase64 = attachments.filter(a => !a.file.type.startsWith('image/')).map(a => a.preview);
    
    const userMsgId = Date.now().toString();
    const userMsg: Message = { id: userMsgId, role: 'user', text: input, images: base64Images };
    setMessages(prev => [...prev, userMsg]);
    
    const currentInput = input;
    const currentAttachments = [...attachments];
    
    setInput('');
    setAttachments([]);
    setIsTyping(true);

    const botMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: botMsgId, role: 'bot', text: '' }]);

    const formattedHistory = messages.map(m => {
        let content: any = m.text;
        if (m.images && m.images.length > 0) {
            content = [
                { type: "text", text: m.text || "Analyzed OMEGA-grade visual telemetry." },
                ...m.images.map(img => ({ type: "image_url", image_url: { url: img } }))
            ];
        }
        return { role: m.role === 'bot' ? 'assistant' : 'user', content: content };
    });

    try {
      const response = await fetch('/api/monroe/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          images: base64Images,
          documents: textFilesBase64,
          history: formattedHistory,
          sessionId: 'omega-v7-monroe'
        })
      });

      if (!response.ok) throw new Error('Neural Connection Severed');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Transmission stream empty');
      
      const textDecoder = new TextDecoder();
      let streamedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = textDecoder.decode(value);
        streamedText += chunk;
        setMessages(prev => {
          const newMsgs = [...prev];
          const last = newMsgs[newMsgs.length - 1];
          if (last.id === botMsgId) {
            last.text = streamedText;
          }
          return [...newMsgs];
        });
      }
    } catch (error: any) {
       setMessages(prev => {
         const newMsgs = [...prev];
         newMsgs[newMsgs.length - 1].text = 'ABORT_IDENTIFIED: ' + error.message;
         return newMsgs;
       });
    } finally {
      setIsTyping(false);
    }
  };

  const toggleView = () => setViewMode(prev => prev === 'HUMAN' ? 'MACHINE' : 'HUMAN');

  if (viewMode === 'MACHINE') {
    return (
      <div className="flex-1 flex flex-col p-8 lg:p-20 space-y-12 min-h-screen bg-[#050505] text-[#ff6b2b] font-mono overflow-hidden">
        <header className="flex justify-between items-center border-b border-[#ff6b2b]/20 pb-12">
          <div className="flex items-center gap-6 text-2xl font-black uppercase tracking-[0.4em] italic leading-none">
            <Terminal size={32} /> RAW_M2M_LEAK :: SECTOR_MONROE
          </div>
          <button onClick={toggleView} className="px-8 py-3.5 border border-[#ff6b2b] bg-[#ff6b2b]/10 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-[#ff6b2b] hover:text-black transition-all italic leading-none rounded-2xl">
            EXIT_ABYSSAL_MATRIX
          </button>
        </header>
        <div className="flex-1 overflow-auto p-12 bg-black/60 border border-white/5 rounded-[4rem] shadow-2xl backdrop-blur-3xl custom-scrollbar border-2">
          <pre className="text-sm leading-loose opacity-80">{JSON.stringify(messages, null, 2)}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-hidden flex flex-col lg:flex-row">
      
      {/* 🌌 AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[120vw] h-[120vw] bg-[#ff6b2b]/5 blur-[300px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[100vw] h-[100vw] bg-[#ff6b2b]/3 blur-[250px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* 🏛️ LEFT SIDEBAR: COGNITIVE HUD */}
      <aside className="hidden xl:flex w-[450px] flex-col space-y-16 p-14 border-r border-white/10 relative z-10 backdrop-blur-3xl bg-black/40 shadow-[50px_0_150px_rgba(0,0,0,0.8)]">
         <div className="space-y-8">
            <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] mb-4 group italic leading-none active:scale-95">
               <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
            </Link>
            <div className="space-y-4">
                <h1 className="text-7xl font-black uppercase tracking-tighter italic leading-none">Monroe.<br /><span className="text-[#ff6b2b]">Omega.</span></h1>
                <p className="text-[11px] text-[#ff6b2b] font-black tracking-[0.5em] uppercase italic animate-pulse">Neural_Array_v7.0_SENTINEL</p>
            </div>
         </div>

         <div className="flex-1 space-y-12 min-h-0 overflow-y-auto custom-scrollbar pr-6">
            <div className="p-12 border border-white/10 bg-white/[0.01] rounded-[4rem] space-y-10 relative overflow-hidden group hover:border-[#ff6b2b]/30 transition-all shadow-inner">
               <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
                  <Database size={240} className="text-[#ff6b2b]" />
               </div>
               <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-white/20 flex items-center gap-4 italic leading-none">
                 <Layers size={20} className="text-[#ff6b2b] animate-spin-slow" /> Active Shard Stream
               </h3>
               <div className="space-y-6 relative z-10">
                  {knowledgeGraph?.nodes ? knowledgeGraph.nodes.slice(-5).map((node: any, i: number) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={node.id} 
                        className="p-8 bg-black/60 border border-white/5 rounded-[2.5rem] flex flex-col gap-4 group/shard hover:border-[#ff6b2b]/40 transition-all cursor-pointer shadow-2xl"
                    >
                       <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-[10px] font-black text-white/10 uppercase tracking-widest italic">{node.type} SHARD</span>
                          <div className="h-2 w-2 rounded-full bg-[#ff6b2b]/40 group-hover/shard:bg-[#ff6b2b] group-hover/shard:shadow-[0_0_15px_rgba(255,107,43,1)] transition-all animate-pulse" />
                       </div>
                       <p className="text-xl font-black text-white/40 leading-tight uppercase italic tracking-tighter group-hover/shard:text-white transition-all transform origin-left group-hover/shard:scale-[1.03] line-clamp-2">{node.label}</p>
                    </motion.div>
                  )) : (
                    <div className="text-[11px] text-[#ff6b2b]/20 font-black uppercase tracking-widest text-center py-24 animate-pulse italic">Synchronizing Abyssal Ledger...</div>
                  )}
               </div>
            </div>

            <div className="p-10 border border-[#ff6b2b]/10 bg-[#ff6b2b]/5 rounded-[3.5rem] space-y-8 shadow-[0_30px_60px_rgba(255,107,43,0.1)] relative overflow-hidden">
               <div className="flex justify-between items-center text-[12px] font-black uppercase tracking-[0.5em] text-[#ff6b2b] italic leading-none">
                 <div className="flex items-center gap-4">
                    <Orbit size={18} className="animate-spin-slow" /> Swarm Parity
                 </div>
                 <span>94%</span>
               </div>
               <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div animate={{ width: ['20%', '98%', '92%'] }} transition={{ duration: 10, repeat: Infinity }} className="h-full bg-gradient-to-r from-[#ff6b2b] via-white to-[#ff6b2b]" />
               </div>
               <p className="text-[10px] text-white/20 font-black leading-relaxed uppercase tracking-[0.3em] italic font-mono">ENCRYPTION: QUANTUM_SSL_ACTIVE</p>
            </div>
         </div>

         <div className="pt-12 border-t border-white/5">
            <button onClick={toggleView} className="w-full py-8 bg-white/[0.02] border border-white/10 hover:bg-[#ff6b2b]/10 hover:border-[#ff6b2b]/40 text-white/20 hover:text-[#ff6b2b] text-[11px] font-black uppercase tracking-[0.6em] rounded-[2.5rem] transition-all flex items-center justify-center gap-6 group italic shadow-2xl">
               <Terminal size={20} className="group-hover:rotate-12 transition-transform" /> raw_machine_extraction
            </button>
         </div>
      </aside>

      {/* 📬 CHAT INTERFACE */}
      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
        
        {/* MOBILE HUD */}
        <header className="xl:hidden flex-none flex justify-between items-center p-8 bg-black/60 border-b border-white/10 backdrop-blur-3xl">
           <div className="flex items-center gap-6">
              <div className="h-12 w-12 bg-black border-2 border-[#ff6b2b] flex items-center justify-center rounded-[1.2rem] shadow-[0_0_30px_rgba(255,107,43,0.3)]">
                 <BrainCircuit size={28} className="text-[#ff6b2b]" />
              </div>
              <div className="flex flex-col">
                  <span className="text-2xl font-black uppercase tracking-tighter italic text-white/95 leading-none">Monroe <span className="text-[#ff6b2b]">v7.0</span></span>
                  <span className="text-[9px] text-[#ff6b2b] font-black tracking-widest uppercase mt-1 italic leading-none pl-0.5">OMEGA_STREAMING</span>
              </div>
           </div>
           <div className="flex items-center gap-4 text-[11px] font-black text-[#ff6b2b] uppercase tracking-widest italic leading-none animate-pulse">
              <Wifi size={16} /> SYNCED
           </div>
        </header>

        {/* MESSAGES VIEW */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto p-10 lg:p-20 space-y-16 custom-scrollbar scroll-smooth pb-64 lg:pb-80"
        >
          <div ref={chatContainerRef} className="max-w-7xl mx-auto space-y-16">
            <AnimatePresence mode="popLayout">
              {messages.map((m, i) => (
                <div
                  key={m.id}
                  className={`message-bubble flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[98%] lg:max-w-[85%] flex gap-8 lg:gap-14 ${m.role === 'user' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                    <div className={`h-14 w-14 lg:h-24 lg:w-24 shrink-0 rounded-[2.5rem] flex items-center justify-center border-2 transition-all shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-[#050505] transform group-hover:scale-110 ${
                      m.role === 'user' ? 'text-white border-white/20' : 'text-[#ff6b2b] border-[#ff6b2b]/30 shadow-[0_0_50px_rgba(255,107,43,0.2)]'
                    }`}>
                      {m.role === 'user' ? <User size={32} /> : <BrainCircuit size={32} strokeWidth={2.5} />}
                    </div>

                    <div className={`space-y-10 flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                       <div className={`p-10 lg:p-16 rounded-[4.5rem] text-xl lg:text-3xl leading-[1.6] border-2 backdrop-blur-3xl shadow-[0_60px_150px_rgba(0,0,0,0.9)] transition-all duration-700 relative overflow-hidden group/text ${
                         m.role === 'user' ? 'bg-white text-black border-white rounded-tr-none font-black italic tracking-tighter uppercase' : 'bg-white/[0.01] text-white/90 border-white/5 rounded-tl-none font-light italic'
                       }`}>
                          {m.images && m.images.length > 0 && (
                            <div className="flex gap-8 mb-12 overflow-x-auto pb-6 custom-scrollbar">
                              {m.images.map((img, idx) => (
                                <img key={idx} src={img} alt="visual telemetry" className="h-56 lg:h-80 rounded-[3rem] border-2 border-white/10 object-contain shadow-2xl bg-black/40" />
                              ))}
                            </div>
                          )}
                          <div className={`prose prose-invert prose-2xl max-w-none prose-p:leading-relaxed prose-p:italic prose-p:font-light prose-strong:text-[#ff6b2b] prose-a:text-[#ff6b2b] ${m.role === 'user' ? 'prose-p:text-black prose-p:not-italic' : 'prose-p:text-white/70'}`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                          </div>
                          {m.role === 'bot' && (
                              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none select-none">
                                 <BrainCircuit size={180} />
                              </div>
                          )}
                       </div>
                       <div className="flex items-center gap-6 px-10 text-[11px] font-black text-white/10 uppercase tracking-[0.5em] italic">
                          {m.role === 'bot' ? (
                              <>
                                <span>OMEGA_SY_DECODER_READY</span>
                                <div className="h-2 w-2 rounded-full bg-[#ff6b2b]/40 animate-pulse" />
                              </>
                          ) : (
                              <>
                                <div className="h-2 w-2 rounded-full bg-white/20" />
                                <span>USER_SIG_VERIFIED</span>
                              </>
                          )}
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </AnimatePresence>
          </div>

          {isTyping && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-start pl-14 lg:pl-40">
               <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-6 bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/30 px-10 py-5 rounded-full text-xs font-black uppercase text-[#ff6b2b] tracking-[0.6em] italic shadow-[0_30px_100px_rgba(255,107,43,0.3)] backdrop-blur-3xl">
                    <Sparkles size={18} className="animate-spin" strokeWidth={3} /> Monroe is synthesizing context...
                  </div>
                  <div className="flex gap-4 px-12">
                    {[0, 1, 2, 3, 4].map(n => (
                        <motion.div 
                          key={n}
                          animate={{ opacity: [0.1, 1, 0.1], scaleY: [0.4, 1, 0.4], translateY: [0, -10, 0] }} 
                          transition={{ duration: 1.5, repeat: Infinity, delay: n * 0.15 }}
                          className="h-3 w-8 bg-[#ff6b2b]/20 rounded-full"
                        />
                    ))}
                  </div>
               </div>
            </motion.div>
          )}
        </div>

        {/* ⌨️ TRANSMISSION BLOCK */}
        <div className="fixed bottom-12 left-0 right-0 lg:left-[450px] lg:bottom-16 flex justify-center z-50 px-10 pointer-events-none">
           <motion.div 
             initial={{ y: 200, opacity: 0 }} 
             animate={{ y: 0, opacity: 1 }}
             transition={{ type: "spring", damping: 35, stiffness: 200 }}
             className="w-full max-w-6xl bg-[#050505]/95 border-2 border-white/10 rounded-[5.5rem] p-6 lg:p-8 backdrop-blur-3xl shadow-[0_80px_200px_rgba(0,0,0,0.95)] pointer-events-auto flex flex-col gap-6 relative overflow-hidden group"
           >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent shadow-[0_0_20px_#ff6b2b]" />
              
              {attachments.length > 0 && (
                <div className="flex gap-6 px-10 pt-8 overflow-x-auto pb-6 custom-scrollbar scroll-smooth">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="relative group shrink-0">
                       <img src={file.preview} className="h-28 w-28 lg:h-36 lg:w-36 object-cover rounded-[2.5rem] border-2 border-white/20 shadow-2xl hover:border-[#ff6b2b] transition-all" alt="visual buffer" />
                       <button onClick={() => removeAttachment(idx)} className="absolute -top-4 -right-4 h-12 w-12 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-2xl hover:scale-110 active:scale-90 border-2 border-black">
                          <X size={20} strokeWidth={3} />
                       </button>
                    </div>
                  ))}
                  <div className="flex-shrink-0 w-10" />
                </div>
              )}

              <div className="flex items-center gap-6">
                 <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="h-20 w-20 lg:h-28 lg:w-28 shrink-0 bg-white/[0.01] border-2 border-white/5 hover:bg-[#ff6b2b]/10 hover:border-[#ff6b2b]/40 rounded-[3rem] flex items-center justify-center text-white/10 hover:text-[#ff6b2b] transition-all shadow-inner group active:scale-90"
                 >
                   <Paperclip size={32} className="group-hover:rotate-12 transition-transform duration-500" strokeWidth={2.5} />
                 </button>

                 <div className="relative flex-1 group/input">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Transmission Interface: Encrypt Signal to Monroe..."
                      className="w-full bg-[#050505] border-2 border-white/5 rounded-[4.5rem] py-10 lg:py-12 px-14 text-2xl lg:text-3xl text-white placeholder:text-white/5 placeholder:italic placeholder:font-light outline-none focus:border-[#ff6b2b]/50 focus:bg-[#ff6b2b]/5 transition-all font-light italic tracking-tight"
                    />
                    <button 
                       onClick={handleSend}
                       disabled={(!input.trim() && attachments.length === 0) || isTyping}
                       className="absolute right-4 top-1/2 -translate-y-1/2 h-20 w-20 lg:h-24 lg:w-24 bg-[#ff6b2b] text-black rounded-full flex items-center justify-center hover:scale-[1.05] active:scale-95 disabled:opacity-10 disabled:grayscale transition-all shadow-[0_30px_100px_rgba(255,107,43,0.5)] group/btn"
                    >
                       <ChevronRight size={44} strokeWidth={3} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                    </button>
                 </div>
              </div>
              
              <div className="px-14 pb-4 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.8em] text-white/5 italic">
                  <div className="flex items-center gap-4">
                     <Radio size={14} className="text-[#ff6b2b] animate-pulse" /> BROADCAST_SIGNAL_VERIFIED
                  </div>
                  <span>SESSION_ID: OMEGA_7_SENTINEL</span>
              </div>
           </motion.div>
        </div>
      </main>

      {/* BACKGROUND DECOR */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none z-0">
          <div className="text-[25vw] font-black italic italic leading-none uppercase">MONROE</div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
