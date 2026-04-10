'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Minimize2, MessageCircle, X, Zap, Terminal, Activity, ChevronRight, Sparkles, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBoxProps {
  pageContext: string;
  pageTitle: string;
}

export function ChatBox({ pageContext, pageTitle }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cmd+I to toggle chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        setIsMinimized((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessageIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: pageContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;

                setMessages((prev) => {
                  const updated = [...prev];
                  updated[assistantMessageIndex] = {
                    role: 'assistant',
                    content: accumulatedContent,
                  };
                  return updated;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[assistantMessageIndex] = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-10 right-10 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMinimized(false)}
          className="rounded-full h-20 w-20 shadow-[0_20px_50px_rgba(255,107,43,0.3)] bg-black border-2 border-[#ff6b2b]/40 flex items-center justify-center text-[#ff6b2b] hover:bg-[#ff6b2b] hover:text-black transition-all group"
        >
          <MessageCircle className="h-8 w-8 group-hover:scale-110 transition-transform" strokeWidth={3} />
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      className="fixed bottom-10 right-10 z-[1000] w-[450px] bg-[#050505] border-2 border-white/10 rounded-[3rem] shadow-[0_80px_150px_rgba(0,0,0,1)] shadow-inner backdrop-blur-3xl overflow-hidden flex flex-col h-[650px]"
    >
      <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

      {/* ── HEADER ── */}
      <div className="border-b-2 border-white/5 p-10 flex items-center justify-between bg-white/[0.02] relative z-10">
        <div className="flex items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-black border-2 border-[#ff6b2b]/40 flex items-center justify-center text-[#ff6b2b] shadow-inner">
                <Brain className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Context_Node.</h3>
                <p className="text-[10px] text-white/5 font-black uppercase tracking-[0.4em] italic leading-none pl-1 truncate max-w-[200px]">{pageTitle}</p>
            </div>
        </div>
        <button
          className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/10 hover:text-[#ff6b2b] hover:border-[#ff6b2b]/40 transition-all active:scale-95"
          onClick={() => setIsMinimized(true)}
        >
          <Minimize2 className="h-5 w-5" strokeWidth={3} />
        </button>
      </div>

      {/* ── MESSAGES ── */}
      <ScrollArea className="flex-1 p-10 custom-scrollbar relative z-10" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="text-center py-20 space-y-8">
            <div className="relative inline-block">
               <Sparkles className="h-16 w-16 text-white/5 mx-auto" />
               <div className="absolute inset-0 bg-[#ff6b2b]/5 blur-[20px] rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/5 italic">No active resonance.</p>
                <p className="text-[10px] text-white/5 font-light italic leading-relaxed uppercase tracking-widest">Ask anything about this page context.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 pb-10">
            {messages.map((msg, idx) => (
              <motion.div
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-[2rem] px-8 py-5 text-lg leading-relaxed shadow-inner ${msg.role === 'user'
                      ? 'bg-[#ff6b2b] text-black font-black italic tracking-tight rounded-br-lg'
                      : 'bg-white/[0.03] border-2 border-white/5 text-white/40 italic font-light tracking-tight rounded-bl-lg backdrop-blur-3xl'
                    }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border-2 border-white/5 rounded-[2rem] rounded-bl-lg px-8 py-5">
                  <Loader2 className="h-6 w-6 animate-spin text-[#ff6b2b]" strokeWidth={3} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* ── INPUT ── */}
      <div className="border-t-2 border-white/5 p-10 bg-white/[0.01] relative z-10">
        <div className="flex gap-4">
          <div className="relative flex-1 group">
             <input
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyPress={handleKeyPress}
               placeholder="Inquire..."
               className="w-full h-16 bg-black border-2 border-white/5 rounded-2xl px-6 text-xl text-white placeholder:text-white/5 outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all font-light italic shadow-inner"
               disabled={isLoading}
               maxLength={500}
             />
             <Terminal className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/5 group-focus-within:text-[#ff6b2b] transition-colors" strokeWidth={3} />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-16 w-16 bg-[#ff6b2b] text-black rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,107,43,0.3)] disabled:opacity-50"
            aria-label="Send Directive"
          >
            <Send className="h-6 w-6" strokeWidth={3} />
          </button>
        </div>
      </div>
      
      <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
      `}</style>
    </motion.div>
  );
}
