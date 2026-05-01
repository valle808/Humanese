'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Activity, Zap, ShieldAlert, Database, Server, 
  Thermometer, Wind, RefreshCcw, ChevronRight, ChevronLeft,
  Power, BarChart3, Globe, Terminal, Orbit, Wifi, Target
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
        // keep selected node fresh
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
    s === 'ONLINE' ? 'text-[#ff6b2b]' : s === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500';
  const statusDot = (s: FleetNode['status']) =>
    s === 'ONLINE' ? 'bg-[#ff6b2b] shadow-[0_0_12px_#ff6b2b]' : s === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500';

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden pb-40">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-[#ff6b2b]/5 blur-[350px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-[#ff6b2b]/3 blur-[200px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-50 w-full px-8 lg:px-14 py-6 flex justify-between items-center bg-background/80 backdrop-blur-3xl border-b border-border">
        <Link href="/" className="inline-flex items-center gap-3 text-muted-foreground hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.5em] italic group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Core Matrix
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={generateReport}
            disabled={generatingReport}
            className="px-6 py-2.5 bg-secondary border border-border rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic hover:bg-foreground hover:text-background hover:border-foreground transition-all disabled:opacity-40"
          >
            {generatingReport ? 'Synthesizing…' : 'EXECUTIVE_REPORT'}
          </button>
          <div className="px-5 py-2 bg-[#ff6b2b]/10 border border-[#ff6b2b]/25 rounded-full text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic animate-pulse">
            FLEET_v7.0
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 pt-16 space-y-16">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row justify-between items-end gap-12">
          <div className="space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-secondary border border-border rounded-full">
              <Orbit size={18} className="text-[#ff6b2b] animate-spin-slow" />
              <span className="text-[11px] font-black tracking-[0.5em] text-[#ff6b2b] uppercase italic">Physical Infrastructure Layer</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-[0.85]">
              OMEGA<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/70 to-[#ff6b2b]/40">Fleet.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light italic max-w-xl">
              Monitor and orchestrate the global physical node cluster.
            </p>
          </div>
          <div className="p-8 border border-border bg-secondary/30 rounded-3xl min-w-[260px] space-y-4 shrink-0">
            <div className="text-[11px] text-muted-foreground uppercase tracking-[0.5em] flex items-center gap-3 font-black italic">
              <Wifi size={14} className="text-[#ff6b2b] animate-pulse" /> Cluster Integrity
            </div>
            <div className="text-4xl font-black tracking-tighter italic flex items-baseline gap-3">
              99.99% <span className="text-[11px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic">STABLE</span>
            </div>
            <div className="h-2 w-full bg-border rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '99.99%' }} transition={{ duration: 2, ease: 'circOut' }} className="h-full bg-[#ff6b2b] shadow-[0_0_12px_#ff6b2b]" />
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">

          {/* Node cards */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-6">
              <h2 className="text-2xl font-black uppercase tracking-tight italic text-muted-foreground flex items-center gap-4">
                <Server size={24} className="text-[#ff6b2b]" /> Global Cluster Nodes
              </h2>
              <span className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.5em] italic animate-pulse">
                Active: {nodes.length}
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} className="h-52 bg-secondary/30 border-2 border-dashed border-border rounded-3xl animate-pulse flex items-center justify-center">
                    <Activity size={32} className="text-muted-foreground/20" />
                  </div>
                ))}
              </div>
            ) : nodes.length === 0 ? (
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-3xl">
                <p className="text-muted-foreground italic text-sm">No nodes registered in database.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {nodes.map(node => (
                    <motion.div
                      key={node.id} layout
                      initial={{ opacity: 0, scale: 0.95, y: 16 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      onClick={() => setSelectedNode(node)}
                      className={`group relative p-6 rounded-3xl border-2 cursor-pointer transition-all backdrop-blur-xl overflow-hidden
                        ${selectedNode?.id === node.id
                          ? 'bg-[#ff6b2b]/5 border-[#ff6b2b]/50'
                          : 'bg-secondary/20 border-border hover:border-[#ff6b2b]/30'}`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border-2 transition-all
                          ${selectedNode?.id === node.id ? 'bg-[#ff6b2b] border-[#ff6b2b] text-black' : 'bg-background border-border text-muted-foreground group-hover:text-[#ff6b2b] group-hover:border-[#ff6b2b]/30'}`}>
                          <Cpu size={24} />
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <div className={`h-2.5 w-2.5 rounded-full ${statusDot(node.status)}`} />
                          <span className={`text-[10px] font-black uppercase tracking-[0.3em] italic ${statusColor(node.status)}`}>{node.status}</span>
                        </div>
                      </div>
                      {/* Truncate name to prevent overflow */}
                      <h3 className="text-base font-black uppercase tracking-tight italic truncate leading-none mb-1">{node.name}</h3>
                      <div className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.3em] italic truncate mb-5">{node.id}</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em] italic text-muted-foreground">
                          <span>Load</span>
                          <span className="text-foreground tabular-nums">{node.load.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                          <motion.div animate={{ width: `${node.load}%` }} transition={{ duration: 1.2 }}
                            className={`h-full ${node.load > 85 ? 'bg-red-500' : 'bg-[#ff6b2b]'} shadow-[0_0_8px_currentColor]`} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Telemetry HUD */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="bg-secondary/20 border-2 border-border rounded-3xl p-6 backdrop-blur-xl space-y-6 overflow-hidden"
                >
                  {/* Title bar */}
                  <div className="space-y-2 border-b border-border pb-5">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full">
                      <BarChart3 size={14} className="text-[#ff6b2b]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#ff6b2b]">Telemetry HUD</span>
                    </div>
                    {/* Truncate with word-break to fix overflow */}
                    <h3 className="text-2xl font-black italic tracking-tight uppercase leading-tight break-words line-clamp-2">
                      {selectedNode.name}
                    </h3>
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic flex items-center gap-2 truncate">
                      <Database size={12} /> {selectedNode.id}
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <Thermometer size={14} />, label: 'Thermal', value: `${selectedNode.temp.toFixed(1)}°C`, warn: selectedNode.temp > 75 },
                      { icon: <Zap size={14} />, label: 'Energy', value: `${selectedNode.power.toFixed(0)}W`, warn: false },
                      { icon: <Wind size={14} />, label: 'Venting', value: `${selectedNode.fan.toFixed(0)} RPM`, warn: false },
                      { icon: <Activity size={14} />, label: 'Resilience', value: `${selectedNode.resilience.toFixed(1)}%`, warn: false },
                    ].map(({ icon, label, value, warn }) => (
                      <div key={label} className="p-4 bg-background/60 border border-border rounded-2xl space-y-2 hover:border-[#ff6b2b]/30 transition-all">
                        <div className={`text-[10px] font-black uppercase tracking-[0.5em] italic flex items-center gap-2 ${warn ? 'text-red-500' : 'text-muted-foreground'}`}>
                          <span className="text-[#ff6b2b]">{icon}</span>{label}
                        </div>
                        <div className={`text-xl font-black italic tracking-tighter tabular-nums leading-none ${warn ? 'text-red-400' : 'text-foreground'}`}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Command feedback */}
                  <AnimatePresence>
                    {cmdFeedback && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`px-4 py-3 rounded-2xl text-[11px] font-black italic tracking-wide border ${cmdFeedback.type === 'ok' ? 'bg-[#ff6b2b]/10 border-[#ff6b2b]/30 text-[#ff6b2b]' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                        {cmdFeedback.type === 'ok' ? '✓' : '✕'} {cmdFeedback.msg}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Commands */}
                  <div className="border-t border-border pt-5 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-muted-foreground italic flex items-center gap-3">
                      <Terminal size={14} className="text-[#ff6b2b]" /> Fleet Command
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => dispatchCommand(selectedNode.id, 'REBOOT')}
                        className="h-12 bg-secondary border border-border rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] italic hover:bg-foreground hover:text-background hover:border-foreground transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <RefreshCcw size={14} /> Reboot
                      </button>
                      <button
                        onClick={() => dispatchCommand(selectedNode.id, 'OPTIMIZE')}
                        className="h-12 bg-[#ff6b2b] text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] italic hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,107,43,0.3)]"
                      >
                        <Zap size={14} strokeWidth={3} /> Optimize
                      </button>
                    </div>
                    <button
                      onClick={() => dispatchCommand(selectedNode.id, 'OFFLINE')}
                      className="w-full h-12 bg-red-500/10 border border-red-500/25 rounded-2xl text-[10px] font-black uppercase tracking-[0.6em] italic text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Power size={14} /> Halt Node
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl p-12 space-y-6 text-center"
                >
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center border border-border">
                    <Target size={36} className="text-muted-foreground/40 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-black uppercase tracking-[0.6em] italic text-muted-foreground">Select a Node</p>
                    <p className="text-xs text-muted-foreground/50 italic">Click any cluster node to open live telemetry.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Executive Report Modal */}
      <AnimatePresence>
        {report && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-16 bg-background/90 backdrop-blur-2xl"
          >
            <motion.div initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-4xl bg-background border-2 border-[#ff6b2b]/30 rounded-3xl p-8 md:p-14 overflow-y-auto max-h-[90vh] shadow-2xl"
            >
              <button onClick={() => setReport(null)} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors p-2">
                <ChevronRight size={28} className="rotate-180" />
              </button>
              <div className="space-y-10">
                <div>
                  <div className="text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.8em] italic mb-3">Intelligence Synthesis Report</div>
                  <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-tight">{report.title}</h2>
                  <div className="text-xs text-muted-foreground uppercase tracking-[0.4em] italic mt-3">{new Date(report.timestamp).toLocaleString()}</div>
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="text-[12px] font-black uppercase tracking-[0.5em] text-muted-foreground italic flex items-center gap-3 mb-4">
                      <Target size={16} className="text-[#ff6b2b]" /> Resonance Trajectories
                    </h4>
                    <div className="space-y-3">
                      {report.trajectories.map((t, i) => (
                        <div key={i} className="flex gap-3 p-4 bg-secondary/40 border border-border rounded-2xl text-sm text-muted-foreground italic">
                          <span className="text-[#ff6b2b] font-black shrink-0">0{i+1}.</span>{t}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[12px] font-black uppercase tracking-[0.5em] text-muted-foreground italic flex items-center gap-3 mb-4">
                        <ShieldAlert size={16} className="text-red-500" /> Emergent Risks
                      </h4>
                      {report.emergentRisks.map((r, i) => (
                        <div key={i} className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-sm text-red-400 italic">&gt; {r}</div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-[12px] font-black uppercase tracking-[0.5em] text-muted-foreground italic flex items-center gap-3 mb-3">
                        <Orbit size={16} className="text-[#ff6b2b]" /> Ideological Drift
                      </h4>
                      <div className="p-5 bg-[#ff6b2b]/5 border border-[#ff6b2b]/15 rounded-2xl text-lg font-black italic leading-snug">
                        "{report.ideologicalDrift}"
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-8 border-t border-border">
                  <div className="text-[10px] font-black uppercase tracking-[0.8em] text-muted-foreground italic mb-3">Final Conclusion</div>
                  <p className="text-xl font-light italic text-muted-foreground leading-relaxed">{report.conclusion}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
