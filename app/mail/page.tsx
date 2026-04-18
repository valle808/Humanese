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
  CheckCircle2,
  ChevronLeft,
  X,
  Radio,
  Wifi,
  Terminal,
  Layers,
  Activity,
  ChevronRight,
  Orbit,
  Grid,
  ShieldHalf,
  Database
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
            setNewSignalAlert('NEW_INBOUND_SIGNAL');
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
      if (res.ok) {
        setIsComposing(false);
        setComposeData({ to: '', subject: '', content: '' });
        fetchInbox(session.accessToken, currentFolder);
      }
    } catch (e) {
      console.error('Send error', e);
    } finally {
      setIsSending(false);
    }
  };

  const triggerAgentDraft = async () => {
    if (!composeData.content) {
       alert("Provide a rough subject and initial content block to initiate synthesis.");
       return;
    }
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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-12">
        <div className="relative">
           <div className="w-24 h-24 border-t-2 border-[#ff6b2b] rounded-full animate-spin shadow-[0_0_30px_#ff6b2b]" />
           <div className="absolute inset-0 bg-[#ff6b2b]/10 blur-[40px] rounded-full animate-pulse" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] animate-pulse italic leading-none">Synchronizing Sovereign Mesh...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col overflow-hidden font-sans selection:bg-[#ff6b2b]/40">
      
      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* 🏙️ TOP COMMAND BAR */}
      <header className="h-24 border-b-2 border-white/5 bg-black/40 backdrop-blur-3xl flex items-center justify-between px-10 z-20 shrink-0 relative">
        <div className="flex items-center gap-12 flex-1">
          <Link href="/" className="group flex items-center gap-6">
             <div className="w-12 h-12 border-2 border-[#ff6b2b]/20 bg-[#ff6b2b]/10 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all group-hover:border-[#ff6b2b]/40">
               <Radio size={24} className="text-[#ff6b2b] animate-pulse" strokeWidth={2.5} />
             </div>
             <span className="text-xl font-black uppercase tracking-[0.4em] italic hidden lg:block text-white/90 group-hover:text-white transition-colors">Sovereign Mail // HSM</span>
          </Link>
          
          <div className="max-w-2xl w-full relative group hidden sm:block">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#ff6b2b] transition-colors" size={20} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search across the abssyal ledger..."
              className="w-full bg-black/40 border-2 border-white/5 rounded-2xl pl-20 pr-8 py-5 text-base outline-none focus:border-[#ff6b2b]/30 focus:bg-[#ff6b2b]/5 transition-all italic shadow-inner tracking-tight"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-10">
          <AnimatePresence>
            {newSignalAlert && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#ff6b2b]/10 border-2 border-[#ff6b2b]/40 px-8 py-3 rounded-full flex items-center gap-5 shadow-[0_0_50px_rgba(255,107,43,0.2)]"
              >
                <div className="w-3 h-3 rounded-full bg-[#ff6b2b] animate-ping" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#ff6b2b] italic animate-pulse leading-none">{newSignalAlert}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => fetchInbox(session.accessToken, currentFolder)}
            className="w-14 h-14 bg-white/5 border-2 border-white/5 rounded-2xl hover:bg-[#ff6b2b]/10 hover:border-[#ff6b2b]/40 text-white/20 hover:text-[#ff6b2b] transition-all group flex items-center justify-center active:scale-90"
            title="Refresh Signal"
          >
            <RefreshCw size={24} strokeWidth={2.5} className={isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'} />
          </button>
          <div className="h-10 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-4 bg-[#ff6b2b]/10 px-8 py-3.5 rounded-full border-2 border-[#ff6b2b]/20 text-[11px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic leading-none animate-pulse">
            <Wifi size={18} strokeWidth={2.5} /> LIVE_NODE_07
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* 📁 SIDEBAR (FOLDERS) */}
        <aside className="w-[380px] border-r-2 border-white/5 bg-black/20 backdrop-blur-3xl shrink-0 hidden md:flex flex-col p-12 space-y-16">
          <button 
            onClick={() => setIsComposing(true)}
            className="w-full py-6 md:py-8 bg-[#ff6b2b] text-black font-black uppercase tracking-[0.6em] text-xs rounded-[2rem] md:rounded-[2.5rem] shadow-[0_40px_100px_rgba(255,107,43,0.3)] flex items-center justify-center gap-6 hover:scale-[1.05] active:scale-95 transition-all italic relative overflow-hidden group shadow-2xl"
          >
            <span className="relative z-10 flex items-center gap-6">
              <Plus size={24} strokeWidth={4} /> Transmit
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>

          <nav className="space-y-4">
            {[
              { id: 'INBOX', label: 'Inbound', icon: Inbox },
              { id: 'SENT', label: 'Transmitted', icon: Send },
              { id: 'ARCHIVED', label: 'Vaulted', icon: Archive },
              { id: 'TRASH', label: 'Purged', icon: Trash2 },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setCurrentFolder(item.id as Folder); fetchInbox(session.accessToken, item.id as Folder); }}
                className={`w-full flex items-center justify-between px-8 py-6 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.4em] transition-all italic group border-2 ${currentFolder === item.id ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-[0_30px_60px_rgba(255,107,43,0.2)]' : 'text-white/20 border-transparent hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-6">
                  <item.icon size={22} strokeWidth={2.5} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'INBOX' && messages.filter(m => !m.readAt).length > 0 && (
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black shadow-2xl ${currentFolder === item.id ? 'bg-black text-[#ff6b2b]' : 'bg-[#ff6b2b] text-black'}`}>{messages.filter(m => !m.readAt).length}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-12">
            <div className="p-10 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[3rem] space-y-6 shadow-[0_40px_80px_rgba(0,0,0,0.5)] group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000">
                <Sparkles size={100} className="text-[#ff6b2b]" />
              </div>
              <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.6em] text-[#ff6b2b] italic leading-none animate-pulse">
                <Sparkles size={18} strokeWidth={2.5} /> Neural_Sync
              </div>
              <p className="text-xl text-white/30 leading-relaxed italic group-hover:text-white/50 transition-colors font-light">
                "HSM protocol active. Filtering for intentionality and high-resonance signal vectors."
              </p>
            </div>
            <button className="w-full flex items-center gap-6 px-4 py-2 text-[11px] font-black text-white/10 uppercase tracking-[0.6em] hover:text-[#ff6b2b] transition-all italic leading-none group">
              <Settings size={20} className="group-hover:rotate-90 transition-transform duration-700" /> NODE_PRIMITIVES
            </button>
          </div>
        </aside>

        {/* 📧 MESSAGE LIST */}
        <main className={`flex-1 flex overflow-hidden transition-all duration-700 ${selectedMessage ? 'md:flex-[0.4] border-r-2 border-white/5' : 'flex-1'}`}>
          <div className="flex-1 flex flex-col bg-[#050505]/60 backdrop-blur-3xl">
            <div className="p-8 border-b-2 border-white/5 flex justify-between items-center bg-white/[0.01] px-10">
               <div className="flex items-center gap-6">
                 <Filter size={18} className="text-white/10" strokeWidth={2.5} />
                 <span className="text-[12px] font-black uppercase tracking-[0.6em] text-white/20 italic leading-none">Sorted_by_Timestamp</span>
               </div>
               <div className="flex items-center gap-6">
                 <button className="p-3 bg-white/5 border-2 border-white/5 rounded-2xl text-white/20 hover:text-white transition-all"><Maximize2 size={20}/></button>
                 <button className="p-3 bg-white/5 border-2 border-white/5 rounded-2xl text-white/20 hover:text-white transition-all"><MoreVertical size={20}/></button>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {messages.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center p-12 lg:p-24 text-center space-y-12 opacity-20">
                    <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center border-4 border-dashed border-white/5 relative">
                       <Inbox size={100} className="text-white/10" />
                       <div className="absolute inset-0 bg-[#ff6b2b]/5 blur-[80px] rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Sector Silence.</h3>
                       <p className="text-[12px] font-black uppercase tracking-[0.8em] italic">No active signals detected in this cluster.</p>
                    </div>
                  </motion.div>
                ) : (
                  messages.map((msg, idx) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.05 } }}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-12 border-b-2 border-white/5 cursor-pointer transition-all relative overflow-hidden group ${selectedMessage?.id === msg.id ? 'bg-[#ff6b2b]/5 border-l-[8px] border-[#ff6b2b]' : 'hover:bg-white/[0.04] border-l-[8px] border-transparent hover:border-[#ff6b2b]/40'}`}
                    >
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-10">
                          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center font-black text-2xl italic shadow-2xl transition-all group-hover:scale-110 border-2 ${selectedMessage?.id === msg.id ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-[0_0_40px_rgba(255,107,43,0.3)]' : 'bg-black border-white/10 text-white/20'}`}>
                            {msg.sender?.name?.charAt(0) || 'U'}
                          </div>
                          <div className="space-y-3">
                            <div className={`text-3xl font-black italic tracking-tighter transition-colors leading-none ${selectedMessage?.id === msg.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{msg.sender?.name || 'Unknown Entity'}</div>
                            <div className="text-[11px] text-white/10 font-black uppercase tracking-[0.3em] italic truncate max-w-[220px] leading-none">{msg.sender?.email || 'unknown@omega.nexus'}</div>
                          </div>
                        </div>
                        <div className="text-right space-y-3 pt-2">
                           <div className="text-[12px] font-black text-white/20 flex items-center gap-4 justify-end italic tracking-[0.4em] leading-none">
                             <Clock size={14}/> {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </div>
                           {msg.priority >= 3 && (
                             <span className="text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic animate-pulse px-4 py-2 bg-[#ff6b2b]/10 rounded-full border-2 border-[#ff6b2b]/20 shadow-2xl leading-none">High Resonance</span>
                           )}
                        </div>
                      </div>
                      <h4 className={`text-xl font-black uppercase tracking-[0.2em] mb-4 italic transition-colors leading-none pl-1 ${!msg.readAt ? 'text-[#ff6b2b]' : 'text-white/40'}`}>{msg.subject}</h4>
                      <p className="text-xl text-white/20 line-clamp-2 leading-relaxed italic group-hover:text-white/50 transition-colors font-light pl-1">
                        {msg.content}
                      </p>
                      <div className="absolute right-12 bottom-12 opacity-0 group-hover:opacity-100 transition-all translate-y-6 group-hover:translate-y-0 flex items-center gap-8">
                         <Star size={24} className="text-white/20 hover:text-[#ff6b2b] cursor-pointer transition-all hover:scale-125" />
                         <Archive size={24} className="text-white/20 hover:text-[#ff6b2b] cursor-pointer transition-all hover:scale-125" />
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* 📖 MESSAGE PREVIEW */}
        <aside className={`flex-[0.6] bg-black/80 backdrop-blur-3xl flex flex-col overflow-hidden transition-all duration-1000 transform ${selectedMessage ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute pointer-events-none'}`}>
          {selectedMessage ? (
            <div className="flex-1 flex flex-col overflow-hidden h-full relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent" />
              
              <div className="p-10 lg:px-16 border-b-2 border-white/5 flex justify-between items-center bg-white/[0.01] relative z-10">
                <button onClick={() => setSelectedMessage(null)} className="p-4 bg-white/5 border-2 border-white/5 rounded-2xl text-white/20 hover:text-[#ff6b2b] transition-all md:hidden">
                   <ArrowLeft size={24} strokeWidth={2.5} />
                </button>
                <div className="flex items-center gap-8">
                  <button className="flex items-center gap-6 px-12 py-5 bg-white shadow-[0_30px_80px_rgba(255,255,255,0.1)] text-black hover:bg-[#ff6b2b] hover:shadow-[0_30px_80px_rgba(255,107,43,0.3)] transition-all rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.6em] italic leading-none active:scale-95 group/btn">
                    <Reply size={20} className="group-hover/btn:-translate-x-1 transition-transform" strokeWidth={3} /> Reply
                  </button>
                  <button className="flex items-center gap-6 px-12 py-5 bg-white/5 border-2 border-white/5 hover:bg-white/10 transition-all rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.6em] italic text-white/20 hover:text-white leading-none active:scale-95 group/btn">
                    <Forward size={20} className="group-hover/btn:translate-x-1 transition-transform" strokeWidth={3} /> Forward
                  </button>
                </div>
                <div className="flex items-center gap-6">
                  <button className="p-4 bg-white/5 border-2 border-white/5 rounded-2xl text-white/10 hover:text-[#ff6b2b] transition-all active:scale-90"><Star size={24} strokeWidth={2.5} /></button>
                  <button className="p-4 bg-white/5 border-2 border-white/5 rounded-2xl text-white/10 hover:text-[#ff6b2b] transition-all active:scale-90"><Archive size={24} strokeWidth={2.5} /></button>
                  <button className="p-4 bg-white/5 border-2 border-white/5 rounded-2xl text-white/10 hover:text-red-500 transition-all active:scale-90"><Trash2 size={24} strokeWidth={2.5} /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-24 space-y-12 md:space-y-24 custom-scrollbar relative z-10 flex flex-col">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                  <div className="space-y-12 w-full">
                    <h2 className="text-6xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] text-white/95 pl-1">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-10 p-12 bg-[#050505] border-2 border-white/5 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group/sender">
                       <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000">
                          <User size={150} className="text-[#ff6b2b]" />
                       </div>
                       <div className="w-24 h-24 bg-[#ff6b2b] rounded-[2.5rem] flex items-center justify-center font-black text-4xl text-black italic shadow-[0_0_50px_rgba(255,107,43,0.4)] shrink-0 border-4 border-black group-hover:scale-105 transition-transform duration-700">
                         {selectedMessage.sender.name.charAt(0)}
                       </div>
                       <div className="space-y-3">
                         <div className="text-4xl font-black italic tracking-tighter text-white/90 leading-none">{selectedMessage.sender.name}</div>
                         <div className="text-[12px] text-white/10 font-black uppercase tracking-[0.5em] italic mt-1 leading-none flex items-center gap-4">
                            <span className="text-[#ff6b2b]/40"><Database size={16} /></span> TARGET_ADDR: {session?.user?.email || 'YOU_SECTOR_7'}
                         </div>
                       </div>
                    </div>
                  </div>
                  <div className="text-right space-y-4 pt-4 shrink-0 px-2 lg:px-0">
                    <div className="text-[12px] font-black text-white/10 uppercase tracking-[0.8em] italic leading-none">{new Date(selectedMessage.createdAt).toLocaleString()}</div>
                    <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 text-[11px] font-black text-[#ff6b2b] uppercase tracking-[0.5em] rounded-full italic shadow-2xl leading-none">
                       <ShieldCheck size={16} strokeWidth={2.5} /> SECURE_RELAY #OMEGA
                    </div>
                  </div>
                </div>

                <div className="relative group/content bg-[#050505] border-2 border-white/5 p-8 md:p-16 lg:p-24 responsive-rounded shadow-[0_80px_150px_rgba(0,0,0,1)] flex-1 min-h-[400px]">
                  <div className="absolute top-0 right-0 p-16 opacity-[0.01] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-[40s]">
                     <Globe size={400} className="text-[#ff6b2b]" />
                  </div>
                  <div className="relative z-10 text-3xl font-light italic leading-relaxed text-white/40 group-hover/content:text-white/70 transition-colors duration-1000 tracking-tight">
                    {selectedMessage.content.split('\n').map((para: string, i: number) => (
                      <p key={i} className="mb-10 last:mb-0">{para}</p>
                    ))}
                  </div>
                </div>

                {selectedMessage.metadata?.agent_summary && (
                  <div className="p-14 bg-[#ff6b2b]/5 border-2 border-[#ff6b2b]/20 rounded-[4.5rem] space-y-10 shadow-[0_50px_100px_rgba(255,107,43,0.1)] relative overflow-hidden group/summary">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000">
                       <Sparkles size={200} className="text-[#ff6b2b]" />
                    </div>
                    <div className="flex items-center gap-6 text-[13px] font-black uppercase tracking-[1em] text-[#ff6b2b] italic leading-none animate-pulse pl-2">
                      <Zap size={24} strokeWidth={2.5}/> Intelligence_Synthesis
                    </div>
                    <p className="text-2xl italic text-white/30 leading-relaxed font-light relative z-10 group-hover/summary:text-white/60 transition-colors duration-700 pl-2">
                      "{selectedMessage.metadata.agent_summary}"
                    </p>
                  </div>
                )}
              </div>

              {/* Backglow decoration */}
              <div className="absolute bottom-0 right-0 p-16 opacity-[0.01] pointer-events-none select-none z-0">
                 <div className="text-[30vw] font-black italic leading-none uppercase">SIGNAL</div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-16 opacity-10">
               <div className="w-64 h-64 bg-white/5 rounded-[4rem] flex items-center justify-center border-2 border-white/5 relative shadow-inner">
                 <Layers size={120} strokeWidth={1.5} />
                 <div className="absolute inset-0 bg-[#ff6b2b]/5 blur-[60px] rounded-full animate-pulse" />
               </div>
               <p className="text-[16px] font-black uppercase tracking-[1.5rem] italic text-center animate-pulse">AWAITING_DECRYPTION...</p>
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
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-8 lg:p-16"
          >
              <motion.div 
                initial={{ scale: 0.9, y: 100, opacity: 0, filter: 'blur(40px)' }}
                animate={{ scale: 1, y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ scale: 0.9, y: 100, opacity: 0, filter: 'blur(40px)' }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="bg-[#050505] border-2 border-white/10 w-full max-w-6xl responsive-rounded shadow-[0_0_200px_rgba(255,107,43,0.2)] overflow-hidden flex flex-col relative"
              >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff6b2b] to-transparent shadow-[0_0_30px_#ff6b2b]" />

              <div className="p-16 lg:px-20 border-b-2 border-white/5 flex justify-between items-center bg-white/[0.02] relative z-10 shrink-0">
                 <div className="space-y-4">
                    <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none flex items-center gap-10">
                      <Terminal size={48} className="text-[#ff6b2b]" strokeWidth={2.5} /> Transmit Signal
                    </h2>
                    <p className="text-[12px] text-white/20 font-black uppercase tracking-[0.8em] italic leading-none pl-1">Encrypting via local HSM cluster</p>
                 </div>
                 <button onClick={() => setIsComposing(false)} className="w-20 h-20 bg-white/5 border-2 border-white/5 rounded-full text-white/10 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center active:scale-90">
                   <X size={40} strokeWidth={2.5} />
                 </button>
              </div>
              
              <form onSubmit={handleSendMessage} className="p-8 md:p-16 lg:p-24 space-y-12 md:space-y-16 flex-1 overflow-y-auto custom-scrollbar relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-6 group/input">
                    <label className="text-[12px] font-black uppercase tracking-[0.8em] text-white/10 italic ml-6 leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">Target_Identity</label>
                    <div className="relative">
                       <User size={24} className="absolute left-10 top-1/2 -translate-y-1/2 text-white/5 group-focus-within/input:text-[#ff6b2b] transition-all duration-500" strokeWidth={2.5} />
                       <input 
                         required
                         type="text" 
                         value={composeData.to}
                         onChange={e => setComposeData({...composeData, to: e.target.value})}
                         placeholder="entity@omega.nexus"
                         className="w-full bg-black border-2 border-white/5 rounded-[3.5rem] pl-24 pr-10 py-10 text-2xl font-light italic outline-none focus:border-[#ff6b2b]/40 focus:bg-[#ff6b2b]/5 transition-all text-white placeholder:text-white/5 tracking-tight shadow-inner"
                       />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="text-[12px] font-black uppercase tracking-[0.8em] text-white/10 italic ml-6 leading-none">Tunnel_Protocol</label>
                    <div className="relative">
                       <ShieldHalf size={24} className="absolute left-10 top-1/2 -translate-y-1/2 text-[#ff6b2b] opacity-40" strokeWidth={2.5} />
                       <input 
                         disabled
                         type="text" 
                         value="SECURE_RESONANCE_V7"
                         className="w-full bg-[#050505] border-2 border-white/5 rounded-[3.5rem] pl-24 pr-10 py-10 text-[12px] font-black uppercase tracking-[0.6em] italic text-white/20 shadow-inner"
                       />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 group/input">
                  <label className="text-[12px] font-black uppercase tracking-[0.8em] text-white/10 italic ml-6 leading-none group-focus-within/input:text-[#ff6b2b] transition-colors">Manifest Subject</label>
                  <input 
                    required
                    type="text" 
                    value={composeData.subject}
                    onChange={e => setComposeData({...composeData, subject: e.target.value})}
                    placeholder="CONSTRUCT_INTENTION_MARKER..."
                    className="w-full bg-black border-2 border-white/5 rounded-[3.5rem] px-12 py-10 text-4xl font-black italic tracking-tighter outline-none focus:border-[#ff6b2b]/50 focus:bg-[#ff6b2b]/5 transition-all uppercase text-white placeholder:text-white/5 shadow-inner"
                  />
                </div>

                <div className="space-y-8 relative group/msg">
                  <div className="flex justify-between items-center px-6">
                    <label className="text-[12px] font-black uppercase tracking-[1em] text-white/10 italic leading-none group-focus-within/msg:text-[#ff6b2b] transition-colors">Broadcasting_Payload</label>
                    <button 
                      type="button" 
                      onClick={triggerAgentDraft}
                      disabled={agentDrafting}
                      className="text-[13px] font-black uppercase tracking-[0.6em] text-[#ff6b2b] flex items-center gap-4 hover:scale-105 transition-all disabled:opacity-20 italic leading-none group/agent animate-pulse"
                    >
                      {agentDrafting ? <Activity className="animate-spin" size={18} strokeWidth={3}/> : <Sparkles size={18} strokeWidth={2.5}/>} 
                      {agentDrafting ? 'SYNTHESIZING...' : 'Intelligence Synthesis'}
                    </button>
                  </div>
                  <textarea 
                    required
                    rows={8}
                    value={composeData.content}
                    onChange={e => setComposeData({...composeData, content: e.target.value})}
                    className="w-full bg-black border-2 border-white/5 rounded-[5rem] px-16 py-16 text-3xl outline-none focus:border-[#ff6b2b]/50 focus:bg-[#ff6b2b]/5 transition-all font-light italic leading-relaxed custom-scrollbar shadow-inner text-white placeholder:text-white/5 tracking-tight min-h-[350px]"
                    placeholder="ANCHOR_TRANSMISSION_DATA_HERE..."
                  />
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-12 pt-8">
                  <button 
                    type="submit" 
                    disabled={isSending}
                    className="flex-1 w-full py-10 bg-[#ff6b2b] text-black font-black uppercase tracking-[1em] text-xs rounded-[3.5rem] shadow-[0_40px_100px_rgba(255,107,43,0.3)] hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-10 italic overflow-hidden group/btn leading-none border-0"
                  >
                    <span className="relative z-10 flex items-center gap-10">
                       {isSending ? <RefreshCw className="animate-spin" size={32} strokeWidth={3}/> : <><Send size={32} strokeWidth={3}/> Transmit Protocol</>}
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                  </button>
                  <div className="flex items-center gap-8 shrink-0">
                     <button type="button" className="w-20 h-20 bg-white/5 border-2 border-white/5 rounded-full text-white/10 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center active:scale-90 shadow-2xl"><Paperclip size={32} strokeWidth={2.5}/></button>
                     <button type="button" className="w-20 h-20 bg-white/5 border-2 border-white/5 rounded-full text-white/10 hover:text-[#ff6b2b] transition-all flex items-center justify-center active:scale-90 shadow-2xl"><Star size={32} strokeWidth={2.5}/></button>
                  </div>
                </div>
              </form>

              {/* Backglow for modal */}
              <div className="absolute bottom-0 right-0 p-24 opacity-[0.01] pointer-events-none select-none z-0">
                 <div className="text-[30vw] font-black italic leading-none uppercase">MANIFEST</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.1); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 107, 43, 0.3); }
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
