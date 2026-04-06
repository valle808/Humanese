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
  Pulse
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
    { id: 'start', role: 'bot', text: 'Hello. I am Monroe, an Omni-Model Intelligence. How can we advance our understanding today?' }
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
    const interval = setInterval(fetchGraph, 10000);
    return () => clearInterval(interval);
  }, []);

  // GSAP Entrance
  useEffect(() => {
    if (chatContainerRef.current) {
      gsap.fromTo(".message-bubble", 
        { opacity: 0, y: 30, filter: 'blur(10px)' }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.15, ease: "expo.out" }
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
                { type: "text", text: m.text || "Analyzed attached image." },
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
          sessionId: 'omega-v6'
        })
      });

      if (!response.ok) throw new Error('Connection Severed');

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
         newMsgs[newMsgs.length - 1].text = 'Connection failure. Error: ' + error.message;
         return newMsgs;
       });
    } finally {
      setIsTyping(false);
    }
  };

  const toggleView = () => setViewMode(prev => prev === 'HUMAN' ? 'MACHINE' : 'HUMAN');

  if (viewMode === 'MACHINE') {
    return (
      <div className="flex-1 flex flex-col p-4 lg:p-12 space-y-4 min-h-screen bg-[#050505] text-[#00ffc3] font-mono overflow-hidden">
        <header className="flex justify-between items-center border-b border-[#00ffc3]/20 pb-4">
          <div className="flex items-center gap-2 uppercase tracking-tighter">
            <Command size={18} /> RESEARCH_LOG :: RAW
          </div>
          <button onClick={toggleView} className="px-4 py-1.5 border border-[#00ffc3]/40 bg-[#00ffc3]/5 text-[9px] uppercase tracking-widest hover:bg-[#00ffc3]/15 transition-all">
            exit_raw
          </button>
        </header>
        <div className="flex-1 overflow-auto p-6 bg-black/60 border border-[#00ffc3]/10 rounded-lg">
          <pre className="text-[11px] leading-relaxed opacity-90">{JSON.stringify(messages, null, 2)}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00ffc3]/20 font-sans overflow-hidden flex flex-col lg:flex-row">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[100vw] h-[100vw] bg-[#00ffc3]/3 blur-[250px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[100vw] h-[100vw] bg-[#7000ff]/3 blur-[250px] rounded-full" />
      </div>

      <aside className="hidden xl:flex w-80 flex-col space-y-6 p-10 border-r border-white/5 relative z-10 backdrop-blur-3xl bg-black/20">
         <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] mb-4 group">
               Matrix Root <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Monroe.<br /><span className="text-[#00ffc3]">Omega.</span></h1>
            <p className="text-[10px] text-white/20 font-mono tracking-[0.4em] uppercase">Neural Array 6.1.0</p>
         </div>

         <div className="flex-1 space-y-8 min-h-0 overflow-y-auto custom-scrollbar pr-2 pt-8">
            <div className="bg-white/[0.02] border border-white/10 p-6 rounded-3xl space-y-6 relative overflow-hidden group">
               <Database size={40} className="absolute -bottom-4 -right-4 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 flex items-center gap-3 italic">
                 <Layers size={14} /> Cognitive Shards
               </h3>
               <div className="space-y-2">
                  {knowledgeGraph?.nodes ? knowledgeGraph.nodes.slice(-4).map((node: any, i: number) => (
                    <div key={node.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-2 group/shard hover:border-[#00ffc3]/30 transition-all cursor-pointer">
                       <div className="flex justify-between items-center">
                          <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{node.type}</span>
                          <div className="h-1 w-1 rounded-full bg-[#00ffc3]/40 group-hover/shard:bg-[#00ffc3] transition-colors" />
                       </div>
                       <p className="text-[11px] font-bold text-white/70 line-clamp-2 leading-tight uppercase italic">{node.label}</p>
                    </div>
                  )) : (
                    <div className="text-[10px] text-white/10 italic text-center py-10">Syncing Knowledge...</div>
                  )}
               </div>
            </div>

            <div className="bg-[#00ffc3]/5 border border-[#00ffc3]/20 p-6 rounded-3xl space-y-4 shadow-[0_0_40px_rgba(0,255,195,0.05)]">
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#00ffc3]">
                 <Activity size={12} /> Neural Pulse
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div animate={{ width: ['20%', '90%', '75%'] }} transition={{ duration: 10, repeat: Infinity }} className="h-full bg-gradient-to-r from-[#00ffc3] to-[#7000ff]" />
               </div>
               <p className="text-[10px] text-white/30 font-mono leading-relaxed uppercase">Status: OMEGA SYNC ACTIVE.</p>
            </div>
         </div>

         <div className="pt-6 border-t border-white/5">
            <button onClick={toggleView} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all flex items-center justify-center gap-3">
               <Zap size={14} /> machine_mode
            </button>
         </div>
      </aside>

      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
        <header className="xl:hidden flex-none flex justify-between items-center p-6 bg-black/40 border-b border-white/5 backdrop-blur-3xl">
           <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-black border border-[#00ffc3]/40 flex items-center justify-center rounded-xl">
                 <BrainCircuit size={16} className="text-[#00ffc3]" />
              </div>
              <span className="text-sm font-black uppercase tracking-tighter italic">Monroe Omega</span>
           </div>
           <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#00ffc3] uppercase">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00ffc3] animate-ping" />
              Direct
           </div>
        </header>

        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto p-4 lg:p-12 space-y-10 custom-scrollbar scroll-smooth pb-40 lg:pb-56"
        >
          <div ref={chatContainerRef} className="space-y-10">
            <AnimatePresence mode="popLayout">
              {messages.map((m, i) => (
                <div
                  key={m.id}
                  className={`message-bubble flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] lg:max-w-[70%] flex gap-4 lg:gap-8 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`h-10 w-10 lg:h-12 lg:w-12 shrink-0 rounded-2xl flex items-center justify-center border transition-all ${
                      m.role === 'user' ? 'bg-white text-black border-white shadow-2xl' : 'bg-[#00ffc3]/15 text-[#00ffc3] border-[#00ffc3]/30'
                    }`}>
                      {m.role === 'user' ? <User size={20} /> : <BrainCircuit size={20} />}
                    </div>

                    <div className={`space-y-4 lg:space-y-6 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                       <div className={`p-6 lg:p-10 rounded-[2.5rem] text-sm lg:text-lg leading-relaxed border backdrop-blur-3xl shadow-2xl transition-all duration-500 ${
                         m.role === 'user' ? 'bg-white text-black border-white rounded-tr-none' : 'bg-white/[0.03] text-white/90 border-white/10 rounded-tl-none font-light italic'
                       }`}>
                          {m.images && m.images.length > 0 && (
                            <div className="flex gap-4 mb-6 overflow-x-auto pb-2 custom-scrollbar">
                              {m.images.map((img, idx) => (
                                <img key={idx} src={img} alt="attachment" className="h-40 rounded-2xl border border-black/10 object-contain shadow-md" />
                              ))}
                            </div>
                          )}
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </AnimatePresence>
          </div>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4 bg-[#00ffc3]/10 border border-[#00ffc3]/20 px-6 py-3 rounded-full text-[10px] font-black uppercase text-[#00ffc3] tracking-widest italic shadow-[0_0_20px_rgba(0,255,195,0.1)]">
                    <Sparkles size={12} className="animate-spin" /> Neural Sequencing...
                  </div>
                  <div className="flex gap-1.5 px-6">
                    {[0, 1, 2].map(n => (
                        <motion.div 
                          key={n}
                          animate={{ opacity: [0.2, 1, 0.2] }} 
                          transition={{ duration: 1.5, repeat: Infinity, delay: n * 0.2 }}
                          className="h-1 w-4 bg-[#00ffc3]/40 rounded-full"
                        />
                    ))}
                  </div>
               </div>
            </motion.div>
          )}
        </div>

        <div className="fixed bottom-8 left-0 right-0 lg:left-80 lg:bottom-12 flex justify-center z-50 px-4 pointer-events-none">
           <motion.div 
             initial={{ y: 100 }} animate={{ y: 0 }}
             className="w-full max-w-4xl bg-black/60 border border-white/10 rounded-[2.5rem] p-3 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] pointer-events-auto flex flex-col gap-3"
           >
              {attachments.length > 0 && (
                <div className="flex gap-3 px-4 pt-4 overflow-x-auto pb-2 custom-scrollbar">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="relative group shrink-0">
                       <img src={file.preview} className="h-16 w-16 object-cover rounded-2xl border border-white/10 shadow-lg" alt="preview" />
                       <button onClick={() => removeAttachment(idx)} className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={12} />
                       </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3">
                 <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="h-12 w-12 lg:h-14 lg:w-14 shrink-0 bg-white/5 border border-white/5 hover:bg-white/10 rounded-[1.5rem] flex items-center justify-center text-white/40 hover:text-[#00ffc3] transition-all"
                 >
                   <Paperclip size={20} />
                 </button>

                 <div className="relative flex-1 group">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Access Monroe Omega..."
                      className="w-full bg-white/[0.03] border border-white/5 rounded-[1.8rem] py-4 lg:py-5 px-6 text-sm lg:text-base text-white placeholder:text-white/20 outline-none focus:border-[#00ffc3]/40 focus:bg-white/[0.05] transition-all"
                    />
                    <button 
                       onClick={handleSend}
                       disabled={(!input.trim() && attachments.length === 0) || isTyping}
                       className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 lg:h-11 lg:w-11 bg-[#00ffc3] text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all shadow-[0_10px_30px_rgba(0,255,195,0.3)]"
                    >
                       <ChevronRight size={22} strokeWidth={2.5} />
                    </button>
                 </div>
              </div>
           </motion.div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 255, 195, 0.1); border-radius: 20px; }
      `}</style>
    </div>
  );
}
