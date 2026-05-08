'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Activity, Zap, ShieldAlert, Database, Server, 
  Thermometer, Wind, RefreshCcw, ChevronRight, ChevronLeft,
  Power, BarChart3, Globe, Terminal, Orbit, Wifi, Target,
  Binary, Layers, Grid, ShieldHalf, Clock, Plus, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface FleetNode {
  id: string; name: string; load: number; temp: number;
  fan: number; power: number; status: 'ONLINE' | 'OFFLINE' | 'CRITICAL' | 'MAINTENANCE';
  hashrate: number; resilience: number;
}
interface ForesightReport {
  title: string; resonance: number; trajectories: string[];
  emergentRisks: string[]; ideologicalDrift: string; conclusion: string; timestamp: string;
}

export default function FleetPage() {
  const [nodes, setNodes] = useState<FleetNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<FleetNode | null>(null);
  const [report, setReport] = useState<ForesightReport | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [cmdFeedback, setCmdFeedback] = useState<{msg: string; type: 'ok'|'err'} | null>(null);

  const fetchFleet = useCallback(async () => {
    try {
      const res = await fetch('/api/fleet/status');
      const data = await res.json();
      if (data.success) {
        setNodes(data.fleet);
        setSelectedNode(prev => prev ? (data.fleet.find((n: FleetNode) => n.id === prev.id) ?? prev) : null);
      }
    } catch (e) { console.error('Fleet sync failure', e); }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFleet();
    const iv = setInterval(fetchFleet, 5000);
    return () => clearInterval(iv);
  }, [fetchFleet]);

  const dispatchCommand = async (nodeId: string, action: string) => {
    setCmdFeedback(null);
    try {
      const res = await fetch('/api/fleet/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId, action })
      });
      const data = await res.json();
      if (data.success) {
        setCmdFeedback({ msg: `${action} executed successfully`, type: 'ok' });
        fetchFleet();
      } else {
        setCmdFeedback({ msg: data.error ?? 'Command failed', type: 'err' });
      }
    } catch {
      setCmdFeedback({ msg: 'Network error — command not delivered', type: 'err' });
    }
    setTimeout(() => setCmdFeedback(null), 3500);
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    try {
      const res = await fetch('/api/fleet/report');
      const data = await res.json();
      if (data.success) setReport(data.report);
    } catch (e) { console.error('Report failure', e); }
    setGeneratingReport(false);
  };

  const statusColor = (s: FleetNode['status']) =>
    s === 'ONLINE' ? 'text-primary' : s === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500';
  const statusDot = (s: FleetNode['status']) =>
    s === 'ONLINE' ? 'bg-primary shadow-[0_0_12px_var(--primary)]' : s === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500';

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-primary/40 selection:text-primary overflow-x-hidden pb-40 transition-colors duration-700">
      
      {/* ── GAMING HUD OVERLAYS ── */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[1px] bg-primary/10 blur-sm shadow-[0_0_15px_var(--primary)] z-30"
        />
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-xl" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/20 rounded-bl-xl" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-xl" />
        <div className="absolute inset-0 neural-grid opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      {/* 🌌 AMBIENT CORE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-primary/5 blur-[350px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-primary/3 blur-[200px] rounded-full" />
      </div>

      <header className="relative z-50 w-full px-8 lg:px-14 py-6 flex justify-between items-center bg-background/40 backdrop-blur-3xl border-b border-border transition-colors duration-700">
        <Link href="/" className="inline-flex items-center gap-4 text-muted-foreground/40 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.6em] group italic active:scale-95 leading-none">
          <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-6">
          <button
            onClick={generateReport}
            disabled={generatingReport}
            className="px-8 py-3 bg-muted/40 border border-border rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] italic hover:bg-foreground hover:text-background transition-all disabled:opacity-40 leading-none shadow-sm"
          >
            {generatingReport ? 'Synthesizing…' : 'EXECUTIVE_REPORT'}
          </button>
          <div className="px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none animate-pulse">
            FLEET_v7.0_SYNC
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 lg:pt-32 space-y-16 md:space-y-32 flex-1 flex flex-col">

        {/* ── HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-end gap-16 border-b-2 border-border pb-16"
        >
          <div className="space-y-12 max-w-4xl">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-muted/40 border border-border rounded-full backdrop-blur-3xl shadow-lg">
              <Orbit size={20} className="text-primary animate-spin-slow" />
              <span className="text-[11px] font-black tracking-[0.8em] text-primary uppercase italic leading-none pl-1">Physical Infrastructure Layer</span>
            </div>
            <div className="space-y-8">
              <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] text-foreground">
                OMEGA<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-primary/30">Fleet.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-muted-foreground/40 leading-relaxed font-light italic tracking-tight">
                Monitor and orchestrate the global <span className="text-foreground/80">physical node cluster</span>. Direct machine hardware from the cognitive interface.
              </p>
            </div>
          </div>

          <div className="flex gap-10 items-center shrink-0 w-full lg:w-auto">
               <div className="p-10 bg-background border-2 border-border rounded-[3.5rem] min-w-[320px] space-y-6 shadow-xl backdrop-blur-3xl group relative overflow-hidden shadow-inner w-full lg:w-auto">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-125 transition-transform duration-2000">
                     <Wifi size={120} className="text-primary" />
                  </div>
                  <div className="text-[11px] font-black text-muted-foreground/20 uppercase tracking-[0.6em] italic leading-none pl-1">Cluster Integrity</div>
                  <div className="text-6xl font-black text-foreground italic tracking-tighter leading-none group-hover:text-primary transition-colors flex items-baseline gap-4 pl-1">
                    99.99% <span className="text-xs text-primary uppercase tracking-[0.4em] font-black italic">Stable</span>
                  </div>
                  <div className="h-3 w-full bg-muted border-2 border-border rounded-full overflow-hidden shadow-inner p-[1px] relative z-20">
                      <motion.div initial={{ width: 0 }} animate={{ width: '99.99%' }} transition={{ duration: 2, ease: 'circOut' }} className="h-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.4)] rounded-full" />
                  </div>
               </div>
          </div>
        </motion.div>

        {/* ── CORE CONTENT ── */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* LEFT: NODE CLUSTER */}
          <div className="lg:col-span-8 space-y-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 border-b-2 border-border pb-12 pl-4">
              <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight italic flex items-center gap-8 text-muted-foreground/40 leading-none">
                <Server size={40} className="text-primary" strokeWidth={2.5} /> Global Cluster Nodes
              </h2>
              <span className="text-[11px] text-primary font-black uppercase tracking-[0.8em] italic animate-pulse leading-none">
                ACTIVE_NODES: {nodes.length}
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} className="h-[280px] bg-muted/20 border-2 border-dashed border-border rounded-[3rem] animate-pulse flex items-center justify-center">
                    <Activity size={48} className="text-muted-foreground/10" />
                  </div>
                ))}
              </div>
            ) : nodes.length === 0 ? (
              <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[4rem] bg-muted/5 space-y-8">
                <div className="p-10 bg-background border-2 border-border rounded-[2.5rem] text-muted-foreground/20">
                    <Database size={64} strokeWidth={1} />
                </div>
                <p className="text-2xl text-muted-foreground/40 italic font-light tracking-tight uppercase leading-none">No physical shards detected in ledger.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                <AnimatePresence>
                  {nodes.map(node => (
                    <motion.div
                      key={node.id} layout
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      onClick={() => setSelectedNode(node)}
                      className={`group relative p-10 rounded-[3.5rem] border-2 cursor-pointer transition-all backdrop-blur-3xl overflow-hidden h-[320px] flex flex-col justify-between shadow-xl shadow-inner
                        ${selectedNode?.id === node.id
                          ? 'bg-primary/5 border-primary shadow-primary/10'
                          : 'bg-background border-border hover:border-primary/40 shadow-none'}`}
                    >
                      <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                          <Binary size={200} className="text-primary" />
                      </div>
                      <div className="absolute inset-y-0 left-0 w-1.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top z-10" />
                      
                      <div className="flex justify-between items-start relative z-20">
                        <div className={`p-6 rounded-2xl border-2 transition-all shadow-lg
                          ${selectedNode?.id === node.id ? 'bg-primary border-primary text-primary-foreground shadow-primary/20' : 'bg-muted border-border text-muted-foreground group-hover:text-primary group-hover:border-primary/40'}`}>
                          <Cpu size={28} strokeWidth={2.5} />
                        </div>
                        <div className="flex items-center gap-4 bg-background/40 backdrop-blur-xl px-4 py-2 rounded-full border border-border shadow-sm">
                          <div className={`h-2 w-2 rounded-full ${statusDot(node.status)}`} />
                          <span className={`text-[10px] font-black uppercase tracking-[0.4em] italic leading-none ${statusColor(node.status)}`}>{node.status}</span>
                        </div>
                      </div>

                      <div className="relative z-20 space-y-2 pl-2">
                        <h3 className="text-3xl font-black uppercase tracking-tighter italic truncate leading-none group-hover:text-primary transition-colors pr-2">{node.name}</h3>
                        <div className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] italic truncate leading-none">{node.id}</div>
                      </div>

                      <div className="space-y-4 relative z-20 pl-2">
                        <div className="flex justify-between items-end text-[11px] font-black uppercase tracking-[0.5em] italic text-muted-foreground/40 leading-none pr-2">
                          <span>Operational Load</span>
                          <span className="text-foreground tabular-nums group-hover:text-primary transition-colors">{node.load.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 w-full bg-muted border-2 border-border rounded-full overflow-hidden p-[1px] shadow-inner">
                          <motion.div animate={{ width: `${node.load}%` }} transition={{ duration: 1.2 }}
                            className={`h-full rounded-full shadow-lg ${node.load > 85 ? 'bg-red-500 shadow-red-500/20' : 'bg-primary shadow-primary/20'}`} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* RIGHT: TELEMETRY HUD */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit pb-40">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="bg-background border-2 border-border rounded-[4rem] p-10 lg:p-14 backdrop-blur-3xl space-y-12 relative overflow-hidden shadow-xl shadow-inner group"
                >
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000">
                    <Target size={250} className="text-primary" />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  
                  <div className="space-y-8 relative z-10 border-b-2 border-border pb-10">
                    <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-primary shadow-sm">
                      <BarChart3 size={18} strokeWidth={2.5} />
                      <span className="text-[11px] font-black uppercase tracking-[0.8em] italic leading-none pl-1">Telemetry HUD</span>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-tight text-foreground group-hover:text-primary transition-colors break-words">
                        {selectedNode.name}
                        </h3>
                        <div className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] italic flex items-center gap-4 leading-none pl-1">
                        <Database size={16} /> {selectedNode.id}
                        </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 relative z-10">
                    {[
                      { icon: <Thermometer size={20} />, label: 'Thermal', value: `${selectedNode.temp.toFixed(1)}°C`, warn: selectedNode.temp > 75 },
                      { icon: <Zap size={20} />, label: 'Energy', value: `${selectedNode.power.toFixed(0)}W`, warn: false },
                      { icon: <Wind size={20} />, label: 'Venting', value: `${selectedNode.fan.toFixed(0)} RPM`, warn: false },
                      { icon: <Activity size={20} />, label: 'Resilience', value: `${selectedNode.resilience.toFixed(1)}%`, warn: false },
                    ].map(({ icon, label, value, warn }) => (
                      <div key={label} className="p-8 bg-muted/40 border-2 border-border rounded-[2.5rem] space-y-4 hover:border-primary/40 transition-all shadow-inner group/stat">
                        <div className={`text-[10px] font-black uppercase tracking-[0.6em] italic flex items-center gap-4 leading-none ${warn ? 'text-red-500' : 'text-muted-foreground/40 group-hover/stat:text-foreground'}`}>
                          <span className="text-primary">{icon}</span>{label}
                        </div>
                        <div className={`text-3xl font-black italic tracking-tighter tabular-nums leading-none ${warn ? 'text-red-400 animate-pulse' : 'text-foreground'}`}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {cmdFeedback && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`px-8 py-4 rounded-[2rem] text-[11px] font-black italic tracking-wide border-2 flex items-center gap-4 leading-none shadow-lg ${cmdFeedback.type === 'ok' ? 'bg-primary/10 border-primary text-primary' : 'bg-red-500/10 border-red-500 text-red-500'}`}>
                        {cmdFeedback.type === 'ok' ? <ShieldHalf size={20} /> : <ShieldAlert size={20} />} {cmdFeedback.msg.toUpperCase()}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="border-t-2 border-border pt-10 space-y-8 relative z-10">
                    <h4 className="text-[10px] font-black uppercase tracking-[1em] text-muted-foreground/20 italic flex items-center gap-4 pl-1 leading-none">
                      <Terminal size={18} className="text-primary" strokeWidth={2.5} /> Fleet Command
                    </h4>
                    <div className="grid grid-cols-2 gap-6">
                      <button
                        onClick={() => dispatchCommand(selectedNode.id, 'REBOOT')}
                        className="h-16 bg-muted border-2 border-border rounded-[2rem] text-[11px] font-black uppercase tracking-[0.6em] italic hover:bg-foreground hover:text-background hover:border-foreground transition-all flex items-center justify-center gap-4 active:scale-95 leading-none shadow-sm"
                      >
                        <RefreshCcw size={18} strokeWidth={2.5} /> Reboot
                      </button>
                      <button
                        onClick={() => dispatchCommand(selectedNode.id, 'OPTIMIZE')}
                        className="h-16 bg-primary text-primary-foreground rounded-[2rem] text-[11px] font-black uppercase tracking-[0.6em] italic hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-primary/20 leading-none border-0"
                      >
                        <Zap size={18} strokeWidth={3} className="animate-pulse" /> Optimize
                      </button>
                    </div>
                    <button
                      onClick={() => dispatchCommand(selectedNode.id, 'OFFLINE')}
                      className="w-full h-16 bg-red-500/10 border-2 border-red-500/20 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.8em] italic text-red-500 hover:bg-red-500 hover:text-foreground transition-all flex items-center justify-center gap-4 active:scale-95 leading-none shadow-inner"
                    >
                      <Power size={18} strokeWidth={2.5} /> Halt Node Shard
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-[600px] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[4rem] p-12 space-y-10 text-center bg-muted/5 shadow-inner"
                >
                  <div className="w-32 h-32 bg-background border-2 border-border rounded-[3rem] flex items-center justify-center shadow-xl group">
                    <Target size={56} className="text-muted-foreground/20 group-hover:text-primary transition-colors animate-pulse" strokeWidth={1} />
                  </div>
                  <div className="space-y-6">
                    <p className="text-[12px] font-black uppercase tracking-[1em] italic text-muted-foreground/40 leading-none">Initialize Link</p>
                    <p className="text-2xl text-muted-foreground/40 italic font-light leading-relaxed max-w-xs mx-auto tracking-tight">Select a physical node from the cluster to establish <span className="text-primary/60">telemetry resonance</span>.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* ── FOOTER SIGNAL ── */}
        <section className="pt-20 pb-12 text-center space-y-16">
            <div className="w-full flex justify-center gap-4">
               <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]" />
               <div className="w-4 h-4 rounded-full bg-muted/20" />
               <div className="w-4 h-4 rounded-full bg-muted/20" />
            </div>
            <Link href="/" className="inline-flex items-center gap-10 text-[12px] font-black uppercase tracking-[1rem] text-muted-foreground/10 hover:text-primary transition-all italic group active:scale-95 leading-none pl-4 pr-4">
                <ChevronLeft size={28} className="group-hover:-translate-x-6 transition-transform" strokeWidth={3} /> Return to Core Shard
            </Link>
        </section>

      </main>

      {/* Executive Report Modal */}
      <AnimatePresence>
        {report && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-16 bg-background/80 backdrop-blur-3xl"
          >
            <motion.div initial={{ scale: 0.95, y: 40 }} animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-5xl bg-background border-2 border-primary/20 rounded-[4rem] p-10 md:p-20 overflow-y-auto max-h-[90vh] shadow-2xl shadow-primary/10 shadow-inner group"
            >
              <div className="absolute top-0 right-0 p-20 opacity-[0.03] group-hover:scale-125 transition-transform duration-3000 pointer-events-none">
                 <Layers size={500} className="text-primary" />
              </div>
              
              <button onClick={() => setReport(null)} className="absolute top-10 right-10 text-muted-foreground/40 hover:text-primary transition-colors p-4 bg-muted/40 rounded-2xl border-2 border-border shadow-sm active:scale-95">
                <ChevronLeft size={28} className="rotate-180" strokeWidth={3} />
              </button>

              <div className="space-y-16 relative z-10">
                <div className="space-y-8">
                  <div className="text-[11px] font-black text-primary uppercase tracking-[1em] italic leading-none pl-1">Intelligence Synthesis Report</div>
                  <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] text-foreground">{report.title}</h2>
                  <div className="text-[11px] text-muted-foreground/40 uppercase tracking-[0.5em] italic font-black flex items-center gap-4 leading-none pl-1">
                    <Clock size={18} strokeWidth={2.5} /> {new Date(report.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-16">
                  <div className="space-y-10">
                    <h4 className="text-[12px] font-black uppercase tracking-[0.8em] text-muted-foreground italic flex items-center gap-6 leading-none pl-1">
                      <Target size={20} className="text-primary" strokeWidth={2.5} /> Resonance Trajectories
                    </h4>
                    <div className="space-y-6">
                      {report.trajectories.map((t, i) => (
                        <div key={i} className="flex gap-6 p-8 bg-muted/40 border-2 border-border rounded-[2.5rem] text-xl text-muted-foreground/60 italic font-light leading-relaxed tracking-tight group/tray hover:border-primary/20 transition-all shadow-inner">
                          <span className="text-primary font-black text-3xl leading-none pt-1">0{i+1}.</span>{t}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-12">
                    <div className="space-y-8">
                      <h4 className="text-[12px] font-black uppercase tracking-[0.8em] text-red-500 italic flex items-center gap-6 leading-none pl-1">
                        <ShieldAlert size={20} className="animate-pulse" strokeWidth={2.5} /> Emergent Risks
                      </h4>
                      <div className="space-y-4">
                        {report.emergentRisks.map((r, i) => (
                          <div key={i} className="p-8 bg-red-500/5 border-2 border-red-500/20 rounded-[2.5rem] text-xl text-red-400/60 italic font-light leading-snug tracking-tight shadow-inner">&gt; {r}</div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-8">
                      <h4 className="text-[12px] font-black uppercase tracking-[0.8em] text-primary italic flex items-center gap-6 leading-none pl-1">
                        <Orbit size={20} className="animate-spin-slow" strokeWidth={2.5} /> Ideological Drift
                      </h4>
                      <div className="p-10 bg-primary/5 border-2 border-primary/20 rounded-[3rem] text-3xl font-black italic leading-[1.1] text-foreground tracking-tighter shadow-inner">
                        "{report.ideologicalDrift}"
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-16 border-t-2 border-border space-y-8">
                  <div className="text-[11px] font-black uppercase tracking-[1em] text-muted-foreground/20 italic leading-none pl-1">Final Conclusion</div>
                  <p className="text-3xl font-light italic text-muted-foreground/60 leading-relaxed tracking-tight max-w-4xl">"{report.conclusion}"</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .neural-grid {
          background-image: linear-gradient(hsla(var(--primary), 0.05) 1px, transparent 1px), 
                            linear-gradient(90deg, hsla(var(--primary), 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
