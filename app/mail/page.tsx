'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Inbox, 
  Send, 
  Archive, 
  Trash2, 
  Search, 
  Plus, 
  Settings, 
  ShieldCheck, 
  Zap, 
  Globe, 
  User, 
  Clock, 
  MoreVertical, 
  Reply, 
  Forward, 
  Maximize2, 
  Star,
  Loader2,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Filter,
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Folder = 'INBOX' | 'SENT' | 'ARCHIVED' | 'TRASH' | 'DRAFTS';

export default function MailPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [currentFolder, setCurrentFolder] = useState<Folder>('INBOX');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSignalAlert, setNewSignalAlert] = useState<string | null>(null);
  
  // Compose State
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', content: '' });
  const [isSending, setIsSending] = useState(false);
  const [agentDrafting, setAgentDrafting] = useState(false);

  useEffect(() => {
    const storedSession = localStorage.getItem('humanese_session');
    if (!storedSession) {
      router.push('/auth');
      return;
    }
    const sessionObj = JSON.parse(storedSession);
    setSession(sessionObj);
    fetchInbox(sessionObj.accessToken, 'INBOX');

    // ⚡ REAL-TIME SIGNAL SYNCHRONIZATION
    const client = supabase;
    if (client) {
      const channel = client
        .channel('sovereign_messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'SovereignMessage',
            filter: `recipientId=eq.${sessionObj.user?.id}`
          },
          (payload) => {
            console.log('[RealTime] New signal detected:', payload);
            setNewSignalAlert('A new sovereign signal has been detected in your sector.');
            fetchInbox(sessionObj.accessToken, currentFolder);
            setTimeout(() => setNewSignalAlert(null), 5000);
          }
        )
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    }
  }, [router, currentFolder]);

  const fetchInbox = async (token: string, folder: Folder) => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/mail/inbox?label=${folder}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
      } else if (res.status === 401) {
        localStorage.removeItem('humanese_session');
        router.push('/auth');
      }
    } catch (e) {
      console.error('Relay error', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch('/api/mail/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({
          recipientHandle: composeData.to,
          subject: composeData.subject,
          content: composeData.content,
          metadata: { client: 'Humanese Sovereign Messenger v7.0' }
        })
      });
      if (res.ok) {
        setIsComposing(false);
        setComposeData({ to: '', subject: '', content: '' });
        // Optimistically switch to SENT folder or refresh current
        if (currentFolder === 'SENT') fetchInbox(session.accessToken, 'SENT');
        else fetchInbox(session.accessToken, currentFolder);
      }
    } catch (e) {
      console.error('Send error', e);
    } finally {
      setIsSending(false);
    }
  };

  const triggerAgentDraft = () => {
    setAgentDrafting(true);
    setTimeout(() => {
      setComposeData(prev => ({
        ...prev,
        content: prev.content + "\n\n[Agent Suggestion]: I've reviewed your recent ledger activity and drafted this response to optimize resonance with the recipient's intention markers. Shall we transmit?"
      }));
      setAgentDrafting(false);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <ShieldCheck className="absolute inset-0 m-auto text-primary" size={24} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Synchronizing Sovereign Inbox...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden transition-colors duration-500">
      
      {/* 🏙️ TOP COMMAND BAR */}
      <header className="h-16 border-b border-border bg-card/30 backdrop-blur-3xl flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-6 flex-1">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
               <Globe size={18} className="text-white dark:text-black" />
             </div>
             <span className="text-sm font-black uppercase tracking-widest hidden md:block">Humanese Mail</span>
          </div>
          
          <div className="max-w-xl w-full relative group hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search across the matrix..."
              className="w-full bg-muted/40 border border-border rounded-xl pl-12 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AnimatePresence>
            {newSignalAlert && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-primary/20 border border-primary/40 px-4 py-2 rounded-xl flex items-center gap-3 shadow-[0_0_20px_rgba(var(--primary),0.2)]"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">{newSignalAlert}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => fetchInbox(session.accessToken, currentFolder)}
            className="p-2 hover:bg-muted rounded-xl transition-all"
            title="Refresh Ledger"
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <div className="h-8 w-[1px] bg-border mx-2" />
          <div className="flex items-center gap-3 bg-muted/30 px-3 py-1.5 rounded-xl border border-border">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Live Node Connection</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* 📁 SIDEBAR (FOLDERS) */}
        <aside className="w-64 border-r border-border bg-card/10 shrink-0 hidden md:flex flex-col p-4 space-y-6">
          <button 
            onClick={() => setIsComposing(true)}
            className="w-full py-3.5 bg-primary text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={18} /> Compose Signal
          </button>

          <nav className="space-y-1">
            {[
              { id: 'INBOX', label: 'Inbound', icon: Inbox },
              { id: 'SENT', label: 'Transmitted', icon: Send },
              { id: 'ARCHIVED', label: 'Vaulted', icon: Archive },
              { id: 'TRASH', label: 'Purged', icon: Trash2 },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setCurrentFolder(item.id as Folder); fetchInbox(session.accessToken, item.id as Folder); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all group ${currentFolder === item.id ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className="uppercase tracking-widest text-[10px] font-black">{item.label}</span>
                </div>
                {item.id === 'INBOX' && messages.filter(m => !m.readAt).length > 0 && (
                  <span className="px-2 py-0.5 bg-primary text-white dark:text-black text-[9px] font-black rounded-lg">{messages.filter(m => !m.readAt).length}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="p-4 bg-muted/20 border border-border rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                <Sparkles size={12}/> Agent-Assistant
              </div>
              <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                "Monitor for high-priority signals including AI agency contracts and machine trust requests."
              </p>
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase hover:text-foreground transition-colors">
              <Settings size={14}/> Node configuration
            </button>
          </div>
        </aside>

        {/* 📧 MESSAGE LIST */}
        <main className={`flex-1 flex overflow-hidden transition-all duration-500 ${selectedMessage ? 'md:flex-[0.4]' : 'flex-1'}`}>
          <div className="flex-1 flex flex-col bg-card/5">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
               <div className="flex items-center gap-3">
                 <Filter size={14} className="text-muted-foreground" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sorted by Timestamp</span>
               </div>
               <div className="flex items-center gap-2">
                 <button className="p-1.5 hover:bg-muted rounded-lg transition-colors"><Maximize2 size={14}/></button>
                 <button className="p-1.5 hover:bg-muted rounded-lg transition-colors"><MoreVertical size={14}/></button>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {messages.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-30">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center"><Inbox size={40}/></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">No active signals detected in this sector.</p>
                  </motion.div>
                ) : (
                  messages.map((msg, idx) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.05 } }}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-6 border-b border-border cursor-pointer transition-all relative overflow-hidden group ${selectedMessage?.id === msg.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-muted/30 hover:border-l-4 hover:border-l-primary/30'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${msg.priority === 3 ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-muted/50 text-foreground'}`}>
                            {msg.sender?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-black tracking-tight group-hover:text-primary transition-colors">{msg.sender?.name || 'Unknown Entity'}</div>
                            <div className="text-[9px] text-muted-foreground font-mono uppercase truncate max-w-[140px]">{msg.sender?.email || 'unknown@humanese.net'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                           <div className="text-[9px] font-bold text-muted-foreground flex items-center gap-1.5 justify-end">
                             <Clock size={10}/> {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </div>
                           {msg.priority === 3 && (
                             <span className="text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse">Critical</span>
                           )}
                        </div>
                      </div>
                      <h4 className={`text-xs font-bold mb-1 truncate ${!msg.readAt ? 'text-foreground' : 'text-muted-foreground'}`}>{msg.subject}</h4>
                      <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed opacity-60 font-mono italic">
                        {msg.content}
                      </p>
                      <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                         <Star size={14} className="text-muted-foreground hover:text-yellow-500 cursor-pointer" />
                         <Archive size={14} className="text-muted-foreground hover:text-primary cursor-pointer" />
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* 📖 MESSAGE PREVIEW */}
        <aside className={`flex-[0.6] bg-card/20 backdrop-blur-3xl border-l border-border flex flex-col overflow-hidden transition-all duration-500 ${selectedMessage ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute'}`}>
          {selectedMessage ? (
            <div className="flex-1 flex flex-col overflow-hidden h-full">
              <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                <button onClick={() => setSelectedMessage(null)} className="p-2 hover:bg-muted rounded-xl transition-colors md:hidden">
                   <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-primary/10 hover:text-primary transition-all rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <Reply size={14}/> Reply
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-primary/10 hover:text-primary transition-all rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <Forward size={14}/> Forward
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-muted rounded-xl transition-colors"><Star size={18} /></button>
                  <button className="p-2 hover:bg-muted rounded-xl transition-colors"><Archive size={18}/></button>
                  <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors"><Trash2 size={18}/></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                <div className="flex justify-between items-start">
                  <div className="space-y-4 max-w-2xl">
                    <h2 className="text-3xl font-black tracking-tighter uppercase leading-tight">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-4 p-4 bg-muted/20 border border-border rounded-3xl">
                       <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center font-black text-xl text-primary">
                         {selectedMessage.sender.name.charAt(0)}
                       </div>
                       <div>
                         <div className="font-bold text-lg">{selectedMessage.sender.name}</div>
                         <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono italic">TO: {session?.user?.email || 'you@humanese.net'}</div>
                       </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-xs font-bold text-muted-foreground">{new Date(selectedMessage.createdAt).toLocaleString()}</div>
                    <div className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-muted rounded-md inline-block">SECURE RELAY #921</div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-foreground/80 leading-loose text-lg font-mono bg-card/10 p-8 rounded-3xl border border-border/50 relative">
                  <div className="absolute top-4 right-4 opacity-5">
                     <Globe size={120} />
                  </div>
                  {selectedMessage.content.split('\n').map((para: string, i: number) => (
                    <p key={i} className="mb-4">{para}</p>
                  ))}
                </div>

                {selectedMessage.metadata?.agent_summary && (
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                      <Zap size={14}/> Intelligence Synthesis
                    </div>
                    <p className="text-sm italic text-foreground/70">
                      {selectedMessage.metadata.agent_summary}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-20">
               <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center"><Maximize2 size={64}/></div>
               <p className="text-[10px] font-black uppercase tracking-[0.4em]">Select a signal to decipher its intention.</p>
            </div>
          )}
        </aside>
      </div>

      {/* ✍️ COMPOSE MODAL */}
      <AnimatePresence>
        {isComposing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card/80 border border-border w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-border flex justify-between items-center bg-muted/20">
                 <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                   <Plus size={24} className="text-primary" /> Transmit Signal
                 </h2>
                 <button onClick={() => setIsComposing(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                   <Plus className="rotate-45" size={24} />
                 </button>
              </div>
              
              <form onSubmit={handleSendMessage} className="p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Destination Handle</label>
                    <div className="relative">
                       <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                       <input 
                         required
                         type="text" 
                         value={composeData.to}
                         onChange={e => setComposeData({...composeData, to: e.target.value})}
                         placeholder="entity@humanese.net"
                         className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                       />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Signal Protocol</label>
                    <div className="relative">
                       <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                       <input 
                         disabled
                         type="text" 
                         value="SECURE_OMEGA_RESONANCE"
                         className="w-full bg-muted/50 border border-border rounded-2xl pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-tighter opacity-50"
                       />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Transmission Subject</label>
                  <input 
                    required
                    type="text" 
                    value={composeData.subject}
                    onChange={e => setComposeData({...composeData, subject: e.target.value})}
                    placeholder="Encrypted data header..."
                    className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold tracking-tight"
                  />
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex justify-between items-center">
                    Manifest Content
                    <button 
                      type="button" 
                      onClick={triggerAgentDraft}
                      disabled={agentDrafting}
                      className="text-[10px] text-primary flex items-center gap-1.5 hover:underline disabled:opacity-50"
                    >
                      {agentDrafting ? <Loader2 className="animate-spin" size={12}/> : <Sparkles size={12}/>} 
                      {agentDrafting ? 'Synthesizing...' : 'Agent Assistant'}
                    </button>
                  </label>
                  <textarea 
                    required
                    rows={8}
                    value={composeData.content}
                    onChange={e => setComposeData({...composeData, content: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl px-6 py-6 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono leading-relaxed"
                    placeholder="Construct your message for the ledger..."
                  />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSending}
                    className="flex-1 w-full py-5 bg-primary text-white dark:text-black font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSending ? <Loader2 className="animate-spin" size={20}/> : <><Send size={18}/> Transmit Signal</>}
                  </button>
                  <div className="flex items-center gap-2">
                     <button type="button" className="p-4 hover:bg-muted rounded-2xl border border-border transition-colors"><Paperclip size={20}/></button>
                     <button type="button" className="p-4 hover:bg-muted rounded-2xl border border-border transition-colors"><Star size={20}/></button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--primary), 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--primary), 0.3);
        }
      `}</style>
    </div>
  );
}
