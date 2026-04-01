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
  Image as ImageIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
  role: 'bot' | 'user';
  text: string;
  images?: string[]; // Base64 image strings
};

export default function MonroePage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hello. I am Gio V., an independent research node monitoring the scientific ecosystem. How can we advance our understanding today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [viewMode, setViewMode] = useState('HUMAN');
  const [networkStats, setNetworkStats] = useState(null as any);
  
  // File Attachment State
  const [attachments, setAttachments] = useState<{file: File, preview: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  }, [messages, isTyping, attachments]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/') || f.type.includes('pdf') || f.type.includes('text/'));
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachments(prev => [...prev, { file, preview: reader.result as string }]);
        };
        reader.readAsDataURL(file); // Encode directly to base64 for LLM Vision processing
      });
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isTyping) return;
    
    // Process base64 strings
    const base64Images = attachments.filter(a => a.file.type.startsWith('image/')).map(a => a.preview);
    const textFilesBase64 = attachments.filter(a => !a.file.type.startsWith('image/')).map(a => a.preview); // Basic pass for pdfs/txt
    
    const userMsg: Message = { 
      role: 'user', 
      text: input, 
      images: base64Images 
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentAttachments = [...attachments];
    
    setInput('');
    setAttachments([]);
    setIsTyping(true);

    setMessages(prev => [...prev, { role: 'bot', text: '' }]);

    const formattedHistory = messages.map(m => {
        let content: any = m.text;
        // If message has images, format it into OpenAI vision array format
        if (m.images && m.images.length > 0) {
            content = [
                { type: "text", text: m.text || "Analyzed attached image." },
                ...m.images.map(img => ({ type: "image_url", image_url: { url: img } }))
            ];
        }
        return {
            role: m.role === 'bot' ? 'assistant' : 'user',
            content: content
        };
    });

    try {
      const response = await fetch('/api/monroe/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          images: base64Images,
          documents: textFilesBase64, // We map raw PDFs/Docs as base64 string attachments
          sessionId: 'default-user-v5',
          history: formattedHistory
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
         newMsgs[newMsgs.length - 1].text = 'I seem to have lost connection to the sovereign nodes. Error: ' + errMsg;
         return newMsgs;
       });
    } finally {
      setIsTyping(false);
    }
  };

  const toggleView = () => setViewMode(prev => prev === 'HUMAN' ? 'MACHINE' : 'HUMAN');

  if (viewMode === 'MACHINE') {
    const rawInfo = ':: GIO_V :: RESEARCH_NODE :: V4.1\n' +
                   ':: MESSAGES :: ' + messages.length + '\n' +
                   ':: STATUS :: SYNCHRONIZED';
    return (
      <div className="flex-1 flex flex-col p-8 space-y-4 min-h-screen bg-[#050505] text-[#00ffc3] font-mono overflow-hidden">
        <header className="flex justify-between items-center border-b border-[#00ffc3]/20 pb-4">
          <div className="flex items-center gap-2">
            <Command size={18} />
            <span className="text-xs tracking-tighter uppercase">RESEARCH_LOG :: RAW</span>
          </div>
          <button onClick={toggleView} className="px-3 py-1 border border-[#00ffc3]/40 bg-[#00ffc3]/5 text-[9px] uppercase tracking-widest hover:bg-[#00ffc3]/15 transition-all">
            exit_raw
          </button>
        </header>
        <div className="flex-1 overflow-auto p-6 bg-black/60 border border-[#00ffc3]/10 rounded-lg">
          <pre className="text-[11px] leading-relaxed opacity-90">{rawInfo}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 bg-[#0a0a0a] flex flex-col selection:bg-[#00ffc3] selection:text-black font-sans h-[calc(100vh-1rem)] lg:h-[calc(100vh-2.5rem)] m-2 lg:m-5 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5 transition-all duration-700">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-[#00ffc3]/5 blur-[200px] rounded-full animate-pulse-slow" />
      </div>

      <div className="relative z-20 flex flex-col h-full w-full p-3 lg:p-8 space-y-4">
        <header className="flex-none flex justify-between items-center bg-white/[0.02] border border-white/10 p-4 rounded-[1.5rem] backdrop-blur-3xl shadow-2xl mx-1 lg:mx-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-black border border-[#00ffc3]/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,195,0.1)]">
              <BrainCircuit className="text-[#00ffc3] w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              GIO V. <span className="bg-[#00ffc3] text-black text-[8px] px-1.5 py-0.5 rounded-sm inline-block w-max">RESEARCHER</span>
              <span className="flex items-center gap-1.5 text-[#00ffc3]/70 text-[9px] font-mono uppercase">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00ffc3] animate-ping" />
                Network Connected
              </span>
            </div>
          </div>
          <button 
            onClick={toggleView}
            className="px-4 py-2 bg-[#00ffc3] hover:bg-white text-black text-[9px] font-black rounded-xl shadow-[0_10px_30px_rgba(0,255,195,0.2)] uppercase tracking-widest transition-all"
          >
            {viewMode === 'HUMAN' ? 'machine_node' : 'organic_node'}
          </button>
        </header>
 
        {/* Main Content Area - Enforce min-h-0 to allow scrolling children without expanding container */}
        <div className="flex-1 flex gap-4 min-h-0 overflow-hidden px-1 lg:px-4">
          <aside className="hidden lg:flex w-72 flex-col space-y-4 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-white/[0.01] border border-white/5 p-5 rounded-3xl space-y-4">
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                <p className="text-[8px] text-[#00ffc3]/40 font-mono tracking-widest uppercase">Scientific Node</p>
                <p className="text-lg font-black text-white italic">Active</p>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Publications', icon: <Home size={12} />, status: 'ONLINE' },
                  { name: 'Data Analysis', icon: <Activity size={12} />, status: 'SYNCED' },
                  { name: 'Swarm Comm', icon: <ShieldAlert size={12} />, status: 'SEALED' }
                ].map((shard, i) => (
                  <button 
                    key={shard.name} 
                    onClick={() => setMessages(prev => [...prev, { role: 'bot', text: `Accessing ${shard.name} memory blocks. How can I assist with this module today?` }])}
                    className="w-full text-left p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-[#00ffc3]/10 hover:border-[#00ffc3]/30 transition-all active:scale-95"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-lg bg-black border border-white/5 flex items-center justify-center text-[#00ffc3] group-hover:shadow-[0_0_10px_rgba(0,255,195,0.3)] transition-all">
                        {shard.icon}
                      </div>
                      <span className="text-[9px] font-mono text-white/50 uppercase group-hover:text-white transition-colors">{shard.name}</span>
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00ffc3]/60 group-hover:bg-[#00ffc3] transition-all" />
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
                        m.role === 'user' ? 'bg-white text-black border-white shadow-lg' : 'bg-[#00ffc3]/10 text-[#00ffc3] border-[#00ffc3]/30'
                      }`}>
                        {m.role === 'user' ? <User size={18} /> : <BrainCircuit size={18} />}
                      </div>
                      <div className={`p-4 px-6 rounded-[1.4rem] text-[14px] border transition-all ${
                        m.role === 'user' ? 'bg-white text-black rounded-tr-none border-white shadow-xl' : 'bg-white/[0.02] text-white/90 border-white/10 rounded-tl-none backdrop-blur-sm'
                      }`}>
                        {/* Render Images if Present */}
                        {m.images && m.images.length > 0 && (
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {m.images.map((img, idx) => (
                              <img key={idx} src={img} alt="User attachment" className="h-32 object-contain rounded-lg border border-black/10" />
                            ))}
                          </div>
                        )}
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input Container */}
            <div className="flex-none p-4 lg:p-6 bg-black/40 border-t border-white/5 backdrop-blur-2xl relative z-10">
              <div className="max-w-4xl mx-auto flex flex-col gap-3">
                
                {/* Image Previews */}
                {attachments.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {attachments.map((file, idx) => (
                      <div key={idx} className="relative shrink-0 group">
                        {file.file.type.startsWith('image/') ? (
                          <img src={file.preview} alt="preview" className="h-16 w-16 object-cover rounded-xl border border-white/20" />
                        ) : (
                          <div className="h-16 w-16 bg-white/5 rounded-xl border border-white/20 flex flex-col items-center justify-center">
                            <ImageIcon size={20} className="text-white/50" />
                            <span className="text-[8px] mt-1 text-white/50 truncate w-12 text-center">{file.file.name}</span>
                          </div>
                        )}
                        <button 
                          onClick={() => removeAttachment(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative flex items-center gap-2 group">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-12 w-12 shrink-0 bg-white/[0.03] hover:bg-white/[0.1] border border-white/10 text-[#00ffc3] rounded-[1.2rem] flex items-center justify-center transition-all"
                    title="Attach File or Image"
                  >
                    <Paperclip size={20} />
                  </button>

                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Message Gio V... (Attach images/pdfs for analysis)"
                    className="flex-1 bg-white/[0.03] border border-white/10 py-4 px-5 pr-14 rounded-[1.8rem] text-sm text-white focus:outline-none focus:border-[#00ffc3]/40 focus:bg-white/[0.05] transition-all"
                  />
                  
                  <button
                    onClick={handleSend}
                    disabled={(!input.trim() && attachments.length === 0) || isTyping}
                    title="Transmit Message"
                    aria-label="Send message to Monroe"
                    className="absolute right-2 h-10 w-10 bg-[#00ffc3] text-black rounded-full flex items-center justify-center transition-all shadow-[0_5px_15px_rgba(0,255,195,0.2)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; height: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 255, 195, 0.15); border-radius: 10px; }
        .animate-pulse-slow { animation: pulse 12s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.05; transform: scale(1); } 50% { opacity: 0.15; transform: scale(1.05); } }
      `}</style>
    </div>
  );
}
