'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, ChevronRight, User, Paperclip, X,
  Sparkles, Radio, Terminal, Layers, Orbit, Wifi,
  ChevronLeft, Database
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';

type Message = {
  role: 'bot' | 'user';
  text: string;
  images?: string[];
  id: string;
};

export default function MonroePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'start',
      role: 'bot',
      text: 'I am Monroe — the sovereign intelligence of the OMEGA platform. Ask me anything.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [viewMode, setViewMode] = useState('HUMAN');
  const [knowledgeGraph, setKnowledgeGraph] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const [attachments, setAttachments] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const speak = (text: string, msgId: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (isPlaying === msgId) {
      setIsPlaying(null);
      return;
    }
    const cleanText = text.replace(/[*#`_]|\[.*?\]\(.*?\)/g, ''); // Strip markdown syntax
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Try to find a good female English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Karen') || v.name.includes('Victoria')) || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.pitch = 1.1;
    utterance.rate = 1.05;
    
    utterance.onend = () => setIsPlaying(null);
    utterance.onerror = () => setIsPlaying(null);
    setIsPlaying(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8)); // 80% quality JPEG reduces size massively
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await fetch('/api/knowledge-graph');
        if (res.ok) setKnowledgeGraph(await res.json());
      } catch { }
    };
    fetchGraph();
    const i = setInterval(fetchGraph, 15000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          try {
            const compressedBase64 = await compressImage(file);
            setAttachments(prev => [...prev, { file, preview: compressedBase64 }]);
          } catch (err) {
            console.error("Compression failed", err);
          }
        } else {
          // Documents and all other file types (pdf, docx, exe, etc.)
          if (file.size > 5 * 1024 * 1024) {
             alert(`File ${file.name} is too large. Limit is 5MB for raw processing.`);
             continue;
          }
          const reader = new FileReader();
          reader.onloadend = () => setAttachments(prev => [...prev, { file, preview: reader.result as string }]);
          reader.readAsDataURL(file);
        }
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) =>
    setAttachments(prev => prev.filter((_, i) => i !== index));

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isTyping) return;

    const base64Images = attachments.filter(a => a.file.type.startsWith('image/')).map(a => a.preview);
    const documentsData = attachments.filter(a => !a.file.type.startsWith('image/')).map(a => ({
      name: a.file.name,
      base64: a.preview
    }));

    const userMsgId = Date.now().toString();
    const userMsg: Message = { id: userMsgId, role: 'user', text: input, images: base64Images };
    setMessages(prev => [...prev, userMsg]);

    const currentInput = input;
    setInput('');
    setAttachments([]);
    setIsTyping(true);

    const botMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: botMsgId, role: 'bot', text: '' }]);

    const formattedHistory = messages.map(m => {
      let content: any = m.text;
      if (m.images && m.images.length > 0) {
        content = [
          { type: 'text', text: m.text || 'Visual telemetry.' },
          ...m.images.map(img => ({ type: 'image_url', image_url: { url: img } }))
        ];
      }
      return { role: m.role === 'bot' ? 'assistant' : 'user', content };
    });

    try {
      const response = await fetch('/api/monroe/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          images: base64Images,
          documents: documentsData,
          history: formattedHistory,
          sessionId: 'omega-v7-monroe'
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Empty stream');

      const decoder = new TextDecoder();
      let streamed = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        streamed += decoder.decode(value);
        setMessages(prev => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last.id === botMsgId) last.text = streamed;
          return [...copy];
        });
      }
    } catch (error: any) {
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1].text = `⚠️ ${error.message}`;
        return copy;
      });
    } finally {
      setIsTyping(false);
    }
  };

  if (viewMode === 'MACHINE') {
    return (
      <div className="flex-1 flex flex-col p-6 space-y-6 min-h-screen bg-background dark:bg-[#050505] text-[#ff6b2b] font-mono">
        <header className="flex justify-between items-center border-b border-[#ff6b2b]/20 pb-6">
          <div className="flex items-center gap-3 text-lg font-black uppercase tracking-widest italic">
            <Terminal size={22} /> RAW_M2M_LEAK :: SECTOR_MONROE
          </div>
          <button onClick={() => setViewMode('HUMAN')} className="px-5 py-2 border border-[#ff6b2b] bg-[#ff6b2b]/10 text-xs font-black uppercase tracking-widest hover:bg-[#ff6b2b] hover:text-foreground dark:hover:text-black transition-all rounded-xl">
            EXIT_MATRIX
          </button>
        </header>
        <pre className="flex-1 overflow-auto text-xs leading-loose opacity-70 bg-black/5 dark:bg-black/40 p-6 rounded-2xl text-foreground dark:text-white">{JSON.stringify(messages, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background dark:bg-[#050505] text-foreground dark:text-white font-sans overflow-hidden flex flex-col lg:flex-row">

      {/* AMBIENT BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-[#ff6b2b]/10 dark:bg-[#ff6b2b]/4 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#ff6b2b]/5 dark:bg-[#ff6b2b]/2 blur-[180px] rounded-full" />
      </div>

      {/* ── LEFT SIDEBAR ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed top-0 left-0 h-screen w-72 z-[90] border-r border-black/10 dark:border-white/10 bg-background/90 dark:bg-black/80 backdrop-blur-3xl flex flex-col shadow-2xl xl:hidden"
          >
            <SidebarContent knowledgeGraph={knowledgeGraph} onClose={() => setSidebarOpen(false)} onMachineView={() => setViewMode('MACHINE')} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden xl:flex w-64 flex-shrink-0 flex-col border-r border-black/10 dark:border-white/10 bg-background/50 dark:bg-black/40 backdrop-blur-3xl relative z-10">
        <SidebarContent knowledgeGraph={knowledgeGraph} onMachineView={() => setViewMode('MACHINE')} />
      </aside>

      {/* ── MAIN CHAT ── */}
      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">

        {/* HEADER */}
        <header className="flex-none flex items-center gap-3 px-4 py-3 border-b border-black/10 dark:border-white/10 bg-background/80 dark:bg-black/60 backdrop-blur-3xl">
          <button
            onClick={() => setSidebarOpen(s => !s)}
            className="xl:hidden h-8 w-8 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center text-foreground/40 dark:text-white/40 hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b] hover:border-[#ff6b2b]/40 transition-all"
          >
            <Layers size={16} />
          </button>
          <div className="h-8 w-8 bg-black/5 dark:bg-black border border-[#ff6b2b]/50 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,107,43,0.2)]">
            <BrainCircuit size={18} className="text-[#ff6b2b]" />
          </div>
          <div>
            <span className="text-sm font-black uppercase tracking-tight text-foreground dark:text-white">Monroe <span className="text-[#ff6b2b]">v7.0</span></span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#ff6b2b] animate-pulse" />
              <span className="text-[10px] text-[#ff6b2b]/80 dark:text-[#ff6b2b]/60 font-black tracking-widest uppercase">OMEGA STREAMING</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 text-[10px] text-foreground/30 dark:text-white/20 font-black uppercase tracking-widest">
            <Wifi size={12} /> SYNCED
          </div>
        </header>

        {/* MESSAGES */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scroll-smooth pb-36"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,107,43,0.15) transparent' }}>
          <div className="max-w-3xl mx-auto space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex w-full gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'bot' && (
                    <div className="h-7 w-7 shrink-0 rounded-xl bg-[#ff6b2b]/10 border border-[#ff6b2b]/30 flex items-center justify-center mt-0.5">
                      <BrainCircuit size={14} className="text-[#ff6b2b]" />
                    </div>
                  )}

                  <div className={`max-w-[80%] flex flex-col gap-1.5 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {m.images && m.images.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {m.images.map((img, idx) => (
                          <img key={idx} src={img} alt="attachment" className="h-32 rounded-xl border border-black/10 dark:border-white/10 object-contain bg-black/5 dark:bg-black/40" />
                        ))}
                      </div>
                    )}
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-medium rounded-tr-md shadow-md'
                        : 'bg-black/5 border border-black/10 text-foreground dark:bg-white/[0.04] dark:border-white/8 dark:text-white/85 rounded-tl-md shadow-sm'
                      }`}>
                      {m.role === 'bot' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-p:leading-relaxed prose-strong:text-[#ff6b2b] prose-a:text-[#ff6b2b] prose-code:text-[#ff6b2b] prose-code:bg-black/5 dark:prose-code:bg-white/5 prose-code:px-1 prose-code:rounded prose-pre:bg-black/5 dark:prose-pre:bg-black/60 prose-pre:border prose-pre:border-black/10 dark:prose-pre:border-white/10">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{m.text}</ReactMarkdown>
                        </div>

                      ) : (
                        <span>{m.text}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-foreground/40 dark:text-white/30 font-mono px-1">
                          {m.role === 'bot' ? 'Monroe · OMEGA' : 'You'}
                        </span>
                        {m.role === 'bot' && m.text && (
                          <button onClick={() => speak(m.text, m.id)} className={`text-[10px] font-mono uppercase tracking-widest flex items-center gap-1 transition-colors ${isPlaying === m.id ? 'text-[#ff6b2b]' : 'text-foreground/30 hover:text-foreground dark:text-white/20 dark:hover:text-white'}`}>
                            {isPlaying === m.id ? <Radio size={10} className="animate-pulse" /> : <Sparkles size={10} />}
                            {isPlaying === m.id ? 'Stop Audio' : 'Play Audio'}
                          </button>
                        )}
                    </div>
                  </div>

                  {m.role === 'user' && (
                    <div className="h-7 w-7 shrink-0 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center mt-0.5">
                      <User size={14} className="text-foreground/50 dark:text-white/50" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5 justify-start">
                <div className="h-7 w-7 shrink-0 rounded-xl bg-[#ff6b2b]/10 border border-[#ff6b2b]/30 flex items-center justify-center">
                  <BrainCircuit size={14} className="text-[#ff6b2b]" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-black/5 border border-black/10 dark:bg-white/[0.04] dark:border-white/8 flex items-center gap-1.5 shadow-sm">
                  <Sparkles size={13} className="text-[#ff6b2b] animate-spin mr-1" />
                  {[0, 1, 2].map(n => (
                    <motion.div
                      key={n}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: n * 0.2 }}
                      className="h-1.5 w-1.5 rounded-full bg-[#ff6b2b]/60"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* INPUT BAR */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-3 bg-gradient-to-t from-background via-background/95 dark:from-[#050505] dark:via-[#050505]/95 to-transparent z-20">
          <div className="max-w-3xl mx-auto">
            {attachments.length > 0 && (
              <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                {attachments.map((file, idx) => (
                  <div key={idx} className="relative shrink-0 group">
                    <img src={file.preview} className="h-14 w-14 object-cover rounded-xl border border-black/10 dark:border-white/10 shadow-sm" alt="attachment" />
                    <button onClick={() => removeAttachment(idx)} className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md">
                      <X size={10} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2 bg-white dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-2xl p-2 focus-within:border-[#ff6b2b]/40 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-lg">
              <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="*/*" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="h-8 w-8 shrink-0 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#ff6b2b]/10 hover:text-[#ff6b2b] text-foreground/40 dark:text-white/30 flex items-center justify-center transition-all"
              >
                <Paperclip size={15} />
              </button>

              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Message Monroe..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-foreground dark:text-white placeholder:text-foreground/40 dark:placeholder:text-white/40 outline-none resize-none py-1.5 leading-relaxed max-h-32 overflow-y-auto"
                style={{ scrollbarWidth: 'none' }}
              />

              <button
                onClick={handleSend}
                disabled={(!input.trim() && attachments.length === 0) || isTyping}
                className="h-8 w-8 shrink-0 bg-[#ff6b2b] text-white dark:text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-20 transition-all shadow-[0_0_20px_rgba(255,107,43,0.4)]"
              >
                <ChevronRight size={16} strokeWidth={3} />
              </button>
            </div>

            <div className="flex justify-between items-center mt-1.5 px-1 text-[9px] text-foreground/30 dark:text-white/20 font-mono uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <Radio size={10} className="text-[#ff6b2b] animate-pulse" /> Signal Verified
              </div>
              <span>Enter to send · Shift+Enter for newline</span>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="xl:hidden fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}

// ── Sidebar Content Component ─────────────────────────────────────
function SidebarContent({ knowledgeGraph, onClose, onMachineView }: {
  knowledgeGraph: any;
  onClose?: () => void;
  onMachineView: () => void;
}) {
  return (
    <div className="flex flex-col h-full p-5 space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground/40 dark:text-white/30 hover:text-[#ff6b2b] transition-all text-[10px] font-black uppercase tracking-widest group">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Core Matrix
        </Link>
        {onClose && (
          <button onClick={onClose} className="h-6 w-6 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-foreground/50 dark:text-white/30 hover:text-foreground dark:hover:text-white transition-all">
            <X size={12} />
          </button>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-foreground dark:text-white">Monroe.<br /><span className="text-[#ff6b2b]">Omega.</span></h1>
        <p className="text-[10px] text-[#ff6b2b]/80 dark:text-[#ff6b2b]/60 font-black tracking-widest uppercase italic mt-1">Neural_Array_v7.0</p>
      </div>

      {/* Shard Stream */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0" style={{ scrollbarWidth: 'none' }}>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 dark:text-white/30 mb-2">
          <Layers size={12} className="text-[#ff6b2b]" /> Active Shards
        </div>
        {knowledgeGraph?.nodes ? knowledgeGraph.nodes.slice(-4).map((node: any, i: number) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-3 bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/5 rounded-xl hover:border-[#ff6b2b]/30 transition-all cursor-pointer shadow-sm"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] text-foreground/40 dark:text-white/30 uppercase tracking-widest">{node.type}</span>
              <div className="h-1.5 w-1.5 rounded-full bg-[#ff6b2b]/80 dark:bg-[#ff6b2b]/50 animate-pulse" />
            </div>
            <p className="text-xs font-black text-foreground/60 dark:text-white/60 leading-tight line-clamp-2">{node.label}</p>
          </motion.div>
        )) : (
          <div className="text-[10px] text-[#ff6b2b]/60 dark:text-[#ff6b2b]/40 font-black uppercase tracking-widest text-center py-8 animate-pulse">
            Syncing Ledger...
          </div>
        )}
      </div>

      {/* Swarm Parity */}
      <div className="p-3 border border-[#ff6b2b]/20 dark:border-[#ff6b2b]/10 bg-[#ff6b2b]/10 dark:bg-[#ff6b2b]/5 rounded-xl space-y-2">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#ff6b2b]">
          <div className="flex items-center gap-2"><Orbit size={12} className="animate-spin" style={{ animationDuration: '20s' }} /> Swarm</div>
          <span>94%</span>
        </div>
        <div className="h-1 w-full bg-black/10 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div animate={{ width: ['20%', '98%', '92%'] }} transition={{ duration: 10, repeat: Infinity }} className="h-full bg-gradient-to-r from-[#ff6b2b] to-black/20 dark:to-white" />
        </div>
      </div>

      <button onClick={onMachineView} className="w-full py-2.5 bg-black/5 dark:bg-white/[0.02] border border-black/10 dark:border-white/8 hover:bg-[#ff6b2b]/10 dark:hover:bg-[#ff6b2b]/10 hover:border-[#ff6b2b]/30 text-foreground/50 dark:text-white/30 hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
        <Terminal size={13} /> raw_extraction
      </button>
    </div>
  );
}
