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
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Filter,
  Paperclip,
  ChevronLeft,
  X,
  Radio,
  Wifi,
  Terminal,
  Layers,
  Activity,
  Orbit,
  Database,
  ShieldHalf,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Compose State
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', content: '' });
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null);
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
            setNewSignalAlert('NEW_SIGNAL');
            fetchInbox(sessionObj.accessToken, currentFolder);
            setTimeout(() => setNewSignalAlert(null), 8000);
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
    setSendResult(null);
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
          metadata: { client: 'OMEGA HSM Messenger v7.0' }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSendResult({ ok: true, msg: 'Signal transmitted. Message delivered to sovereign relay.' });
        setTimeout(() => {
          setIsComposing(false);
          setComposeData({ to: '', subject: '', content: '' });
          setSendResult(null);
          fetchInbox(session.accessToken, currentFolder);
        }, 1800);
      } else {
        setSendResult({ ok: false, msg: data.error || 'Relay failure — check recipient handle.' });
      }
    } catch (e: any) {
      setSendResult({ ok: false, msg: 'Network error — matrix connection lost.' });
      console.error('Send error', e);
    } finally {
      setIsSending(false);
    }
  };

  const triggerAgentDraft = async () => {
    if (!composeData.content) return;
    setAgentDrafting(true);
    try {
      const res = await fetch('/api/mail/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: composeData.subject,
          content: composeData.content
        })
      });
      const data = await res.json();
      if (res.ok && data.draft) {
        setComposeData(prev => ({
          ...prev,
          content: data.draft + "\n\n[NEURAL_SYNTHESIS_VERIFIED]"
        }));
      }
    } catch (e) {
      console.error('Draft synthesis failed', e);
    } finally {
      setAgentDrafting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-12">
        <div className="relative">
           <div className="w-20 h-20 border-t-2 border-primary rounded-full animate-spin shadow-[0_0_30px_hsl(var(--primary))]" />
           <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse italic leading-none">Synchronizing Mesh...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden font-sans selection:bg-primary/40 selection:text-primary">
      
      {/* 🏙️ TOP COMMAND BAR */}
      <header className="h-20 border-b-2 border-border bg-background/40 backdrop-blur-3xl flex items-center justify-between px-6 md:px-10 z-50 shrink-0 relative">
        <div className="flex items-center gap-6 md:gap-12 flex-1">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 md:hidden text-muted-foreground hover:text-primary transition-colors"
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="group flex items-center gap-4 md:gap-6 pointer-events-auto">
             <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-primary/20 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all group-hover:border-primary/40">
               <Radio size={20} className="text-primary animate-pulse" strokeWidth={2.5} />
             </div>
             <span className="text-lg md:text-xl font-black uppercase tracking-[0.2em] md:tracking-[0.4em] italic hidden sm:block text-foreground/90 group-hover:text-foreground transition-colors leading-none">Mail // HSM</span>
          </Link>
          
          <div className="max-w-xl w-full relative group hidden md:block pointer-events-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors" size={18} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search ledger..."
              className="w-full bg-background/40 border-2 border-border rounded-xl pl-16 pr-6 py-3 text-sm outline-none focus:border-primary/30 focus:bg-primary/5 transition-all italic shadow-inner tracking-tight"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8 pointer-events-auto">
          {newSignalAlert && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:flex items-center gap-3 bg-primary/10 border border-primary/40 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(var(--primary),0.2)]"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-[9px] font-black uppercase tracking-widest text-primary italic leading-none">{newSignalAlert}</span>
            </motion.div>
          )}
          <button 
            onClick={() => fetchInbox(session.accessToken, currentFolder)}
            className="p-2.5 bg-muted border border-border rounded-xl hover:bg-primary/10 hover:border-primary/40 text-muted-foreground hover:text-primary transition-all group active:scale-90"
          >
            <RefreshCw size={20} strokeWidth={2.5} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <div className="hidden sm:flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest italic leading-none animate-pulse">
            <Wifi size={14} strokeWidth={2.5} /> NODE_07
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* 📁 SIDEBAR (FOLDERS) */}
        <aside className={`fixed md:relative inset-y-0 left-0 z-40 w-72 md:w-80 border-r-2 border-border bg-background/95 md:bg-background/20 backdrop-blur-3xl transform transition-transform duration-500 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col p-8 md:p-10 space-y-10`}>
          <button 
            onClick={() => { setIsComposing(true); setIsSidebarOpen(false); }}
            className="w-full py-5 bg-primary text-primary-foreground font-black uppercase tracking-[0.4em] text-[10px] rounded-[1.5rem] shadow-xl flex items-center justify-center gap-4 hover:scale-[1.03] active:scale-95 transition-all italic relative overflow-hidden group border-0 leading-none"
          >
            <Plus size={18} strokeWidth={4} /> Transmit Signal
          </button>

          <nav className="space-y-2">
            {[
              { id: 'INBOX', label: 'Inbound', icon: Inbox },
              { id: 'SENT', label: 'Sent', icon: Send },
              { id: 'ARCHIVED', label: 'Vault', icon: Archive },
              { id: 'TRASH', label: 'Purge', icon: Trash2 },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setCurrentFolder(item.id as Folder); fetchInbox(session.accessToken, item.id as Folder); setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic group border ${currentFolder === item.id ? 'bg-primary text-primary-foreground border-primary shadow-lg' : 'text-muted-foreground/40 border-transparent hover:bg-muted hover:text-foreground'}`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={18} strokeWidth={2.5} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'INBOX' && messages.filter(m => !m.readAt).length > 0 && (
                  <span className={`px-2 py-1 rounded-lg text-[9px] font-black ${currentFolder === item.id ? 'bg-background text-primary' : 'bg-primary text-primary-foreground'}`}>{messages.filter(m => !m.readAt).length}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-8">
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] space-y-4 group relative overflow-hidden">
              <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-primary italic leading-none animate-pulse">
                <Sparkles size={14} strokeWidth={2.5} /> Neural_Sync
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic group-hover:text-foreground transition-colors font-light">
                "HSM protocol active. Filtering intentionality vectors."
              </p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 📧 MESSAGE LIST */}
        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-700 bg-background/60 backdrop-blur-3xl ${selectedMessage ? 'hidden md:flex flex-[0.4] border-r-2 border-border' : 'flex-1'}`}>
            <div className="p-6 border-b-2 border-border flex justify-between items-center bg-foreground/[0.01] px-8">
               <div className="flex items-center gap-4">
                 <Filter size={16} className="text-muted-foreground/30" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic leading-none">Sorted_by_Timestamp</span>
               </div>
               <div className="flex items-center gap-4">
                 <button className="p-2 bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all"><Maximize2 size={16}/></button>
                 <button className="p-2 bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all"><MoreVertical size={16}/></button>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-8 opacity-20">
                     <Inbox size={64} className="text-muted-foreground" />
                     <div className="space-y-2">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none text-foreground">Sector Silence.</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest italic text-muted-foreground">No active signals detected.</p>
                     </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-6 md:p-8 border-b border-border cursor-pointer transition-all relative overflow-hidden group ${selectedMessage?.id === msg.id ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-muted border-l-4 border-transparent hover:border-primary/40'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-black text-lg italic shadow-lg shrink-0 border ${selectedMessage?.id === msg.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground'}`}>
                            {msg.sender?.name?.charAt(0) || 'U'}
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="text-lg md:text-xl font-black italic tracking-tight text-foreground truncate leading-none">{msg.sender?.name || 'Unknown'}</div>
                            <div className="text-[9px] text-muted-foreground/30 font-black uppercase tracking-widest italic truncate leading-none">{msg.sender?.email || 'unknown@omega.nexus'}</div>
                          </div>
                        </div>
                        <div className="text-right space-y-2 pt-1 shrink-0">
                           <div className="text-[10px] font-black text-muted-foreground/40 flex items-center gap-2 justify-end italic leading-none">
                             <Clock size={12}/> {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </div>
                           {msg.priority >= 3 && (
                             <span className="text-[8px] font-black text-primary uppercase tracking-widest italic animate-pulse px-2 py-1 bg-primary/5 border border-primary/20 rounded-full leading-none">HIGH</span>
                           )}
                        </div>
                      </div>
                      <h4 className={`text-sm md:text-base font-black uppercase tracking-widest mb-2 italic truncate leading-none ${!msg.readAt ? 'text-primary' : 'text-muted-foreground'}`}>{msg.subject}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic font-light">
                        {msg.content}
                      </p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
        </main>

        {/* 📖 MESSAGE PREVIEW */}
        <aside className={`flex-1 md:flex-[0.6] bg-background/80 backdrop-blur-3xl flex flex-col overflow-hidden transition-all duration-700 ${selectedMessage ? 'flex' : 'hidden md:flex opacity-0 pointer-events-none'}`}>
          {selectedMessage ? (
            <div className="flex-1 flex flex-col overflow-hidden h-full relative">
              <div className="p-6 border-b-2 border-border flex justify-between items-center bg-foreground/[0.01] z-10">
                <button onClick={() => setSelectedMessage(null)} className="p-2.5 bg-muted border border-border rounded-xl text-muted-foreground hover:text-primary transition-all md:hidden">
                   <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-3 px-6 py-3 bg-foreground text-background dark:bg-white dark:text-background rounded-full text-[10px] font-black uppercase tracking-widest italic leading-none active:scale-95 group/btn">
                    <Reply size={16} strokeWidth={3} /> Reply
                  </button>
                  <button className="hidden sm:flex items-center gap-3 px-6 py-3 bg-muted border border-border rounded-full text-[10px] font-black uppercase tracking-widest italic text-muted-foreground leading-none active:scale-95 group/btn">
                    <Forward size={16} strokeWidth={3} /> Forward
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2.5 bg-muted border border-border rounded-xl text-muted-foreground hover:text-primary transition-all"><Star size={20}/></button>
                  <button className="p-2.5 bg-muted border border-border rounded-xl text-muted-foreground hover:text-destructive transition-all"><Trash2 size={20}/></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-20 space-y-12 custom-scrollbar z-10 flex flex-col">
                <div className="space-y-8">
                  <h2 className="text-fluid-title font-black italic tracking-tighter uppercase leading-[0.9] text-foreground">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-6 p-6 bg-background border border-border rounded-[2rem] shadow-xl">
                     <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center font-black text-2xl text-primary-foreground italic shrink-0 border-2 border-background">
                       {selectedMessage.sender.name.charAt(0)}
                     </div>
                     <div className="space-y-1 min-w-0">
                       <div className="text-2xl font-black italic tracking-tight text-foreground leading-none truncate">{selectedMessage.sender.name}</div>
                       <div className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest italic mt-1 leading-none truncate">
                          {selectedMessage.sender.email}
                       </div>
                     </div>
                  </div>
                </div>

                <div className="relative bg-background border border-border p-8 md:p-12 rounded-[2rem] shadow-inner flex-1 min-h-[300px]">
                  <div className="relative z-10 text-lg md:text-xl font-light italic leading-relaxed text-foreground/70 tracking-tight">
                    {selectedMessage.content.split('\n').map((para: string, i: number) => (
                      <p key={i} className="mb-6 last:mb-0">{para}</p>
                    ))}
                  </div>
                </div>

                {selectedMessage.metadata?.agent_summary && (
                  <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2.5rem] space-y-6 relative overflow-hidden group/summary shadow-sm">
                    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-primary italic leading-none animate-pulse">
                      <Zap size={18} strokeWidth={2.5}/> Synthesis
                    </div>
                    <p className="text-lg italic text-muted-foreground leading-relaxed font-light group-hover/summary:text-foreground/70 transition-colors duration-700">
                      "{selectedMessage.metadata.agent_summary}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-12 opacity-10">
               <Layers size={80} strokeWidth={1.5} />
               <p className="text-[12px] font-black uppercase tracking-[1rem] italic text-center animate-pulse text-foreground">AWAITING_SIGNAL...</p>
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
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8"
          >
              <motion.div 
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                className="bg-background border-2 border-border w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative max-h-[90vh]"
              >
              <div className="p-8 md:p-12 border-b-2 border-border flex justify-between items-center bg-foreground/[0.02] z-10 shrink-0">
                 <div className="space-y-2">
                    <h2 className="text-3xl md:text-fluid-balance font-black uppercase italic tracking-tighter leading-none flex items-center gap-6 text-foreground">
                      <Terminal size={32} className="text-primary" /> Transmit
                    </h2>
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.4em] italic leading-none">Sovereign_Relay_Active</p>
                 </div>
                 <button onClick={() => setIsComposing(false)} className="w-14 h-14 bg-muted border border-border rounded-full text-muted-foreground hover:text-foreground transition-all flex items-center justify-center active:scale-90">
                   <X size={24} />
                 </button>
              </div>
              
              <form onSubmit={handleSendMessage} className="p-8 md:p-12 space-y-10 flex-1 overflow-y-auto custom-scrollbar z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic ml-4 leading-none">Target_ID</label>
                    <input 
                      required
                      type="text" 
                      value={composeData.to}
                      onChange={e => setComposeData({...composeData, to: e.target.value})}
                      placeholder="entity@omega.nexus"
                      className="w-full bg-background border-2 border-border rounded-2xl px-6 py-4 text-lg italic outline-none focus:border-primary/40 focus:bg-primary/5 transition-all text-foreground"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic ml-4 leading-none">Protocol</label>
                    <input 
                      disabled
                      type="text" 
                      value="SECURE_V7"
                      className="w-full bg-muted border border-border rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest italic text-muted-foreground/40"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic ml-4 leading-none">Subject</label>
                  <input 
                    required
                    type="text" 
                    value={composeData.subject}
                    onChange={e => setComposeData({...composeData, subject: e.target.value})}
                    placeholder="SIGNAL_MARKER..."
                    className="w-full bg-background border-2 border-border rounded-2xl px-8 py-5 text-xl md:text-2xl font-black italic tracking-tighter outline-none focus:border-primary/40 focus:bg-primary/5 transition-all uppercase text-foreground"
                  />
                </div>

                <div className="space-y-4 relative group/msg">
                  <div className="flex justify-between items-center px-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic leading-none">Payload</label>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); triggerAgentDraft(); }}
                      disabled={agentDrafting}
                      className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-20 italic leading-none animate-pulse"
                    >
                      {agentDrafting ? <Activity className="animate-spin" size={14}/> : <Sparkles size={14}/>} 
                      SYNTHESIZE
                    </button>
                  </div>
                  <textarea 
                    required
                    rows={6}
                    value={composeData.content}
                    onChange={e => setComposeData({...composeData, content: e.target.value})}
                    className="w-full bg-background border-2 border-border rounded-[2.5rem] px-8 py-8 text-xl outline-none focus:border-primary/40 focus:bg-primary/5 transition-all font-light italic leading-relaxed custom-scrollbar shadow-inner text-foreground placeholder:text-muted-foreground/10"
                    placeholder="TRANSMISSION_DATA..."
                  />
                </div>

                {/* ── SEND RESULT BANNER ── */}
                {sendResult && (
                  <div className={`flex items-start gap-4 p-6 rounded-[1.5rem] border-2 text-sm font-black italic tracking-tight leading-snug ${
                    sendResult.ok 
                      ? 'bg-green-500/10 border-green-500/40 text-green-400' 
                      : 'bg-red-500/10 border-red-500/40 text-red-400'
                  }`}>
                    <span className="text-xl shrink-0">{sendResult.ok ? '✓' : '✗'}</span>
                    <span>{sendResult.msg}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-8 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSending || sendResult?.ok === true}
                    className={`flex-1 w-full py-6 font-black uppercase tracking-widest text-[10px] rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-6 italic leading-none border-0 ${
                      sendResult?.ok 
                        ? 'bg-green-500 text-white' 
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {isSending 
                      ? <RefreshCw className="animate-spin" size={24}/> 
                      : sendResult?.ok 
                        ? <><span className="text-xl">✓</span> Transmitted</>
                        : <><Send size={24}/> Transmit</>
                    }
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsla(var(--primary), 0.1); border-radius: 20px; }
      `}</style>
    </div>
  );
}
