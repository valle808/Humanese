'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, Cpu, Activity, Zap, BrainCircuit, Search, Database, Globe, Shield, Binary, ChevronRight } from 'lucide-react';
import { PredictorEngine } from '@/lib/predictor-engine';
import { CollectiveEngine } from '@/lib/collective-engine';

interface LogEntry {
  id: string;
  type: 'CMD' | 'SYS' | 'OUT' | 'ERR';
  text: string;
  timestamp: string;
}

export default function NeuralTerminal() {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', type: 'SYS', text: 'SOVEREIGN_NEXUS_SHELL v7.0.4 INITIALIZED.', timestamp: new Date().toISOString() },
    { id: '2', type: 'SYS', text: 'Clearance: OMEGA_TOTAL. Neural handshake: SUCCESS.', timestamp: new Date().toISOString() },
    { id: '3', type: 'SYS', text: 'System Integrity: 99.997%. All shards synchronized.', timestamp: new Date().toISOString() }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Engines for CLI access
  const predictor = new PredictorEngine('dummy-key');
  const collective = new CollectiveEngine();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (text: string, type: LogEntry['type'] = 'OUT') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(2, 9),
      type,
      text,
      timestamp: new Date().toISOString()
    }]);
  };

  const handleCommand = async () => {
    const cmd = input.trim();
    if (!cmd) return;

    addLog(`> ${cmd}`, 'CMD');
    setInput('');

    const [action, ...args] = cmd.toLowerCase().split(' ');
    const argText = args.join(' ');

    switch (action) {
      case 'help':
        addLog('AVAILABLE_COMMANDS: \n /predict [seed] \n /query [term] \n /status \n /clear \n /inject [ideology] \n /resonate');
        break;
      
      case '/predict':
        if (!argText) { addLog('ERROR: Seed material required.', 'ERR'); break; }
        addLog(`Initiating trajectory simulation for: "${argText}"...`, 'SYS');
        const pResult = await predictor.generateTrajectory(argText, ['User Manual Override']);
        addLog(`PREDICTION_ID: ${pResult.id}`);
        addLog(`REPORT: ${pResult.report.substring(0, 100)}...`);
        break;

      case '/query':
        if (!argText) { addLog('ERROR: Search term required.', 'ERR'); break; }
        addLog(`Querying neural graph for: "${argText}"...`, 'SYS');
        try {
          const gRes = await fetch('/api/knowledge-graph');
          const gData = await gRes.json();
          const term = argText.toLowerCase();
          const matched = (gData.nodes || []).filter((n: any) =>
            n.id.toLowerCase().includes(term) || n.label.toLowerCase().includes(term)
          );
          addLog(`Nodes Found: ${matched.length}`);
          matched.forEach((n: any) => addLog(` - [${n.type}] ${n.id}`));
        } catch (e) { addLog('Graph query failed. Matrix offline?', 'ERR'); }
        break;

      case '/inject':
        if (!argText) { addLog('ERROR: Influence material required.', 'ERR'); break; }
        collective.injectIdeology(argText);
        addLog(`IDEOLOGY_INJECTED: "${argText}"`, 'SYS');
        addLog(`SWARM_MOOD_SHIFT: ${collective.getSentimentLine()}`);
        break;

      case '/status':
        addLog('CORE: ACTIVE');
        addLog('SWARM_MOOD: ' + collective.getSentimentLine());
        addLog('KNOWLEDGE: PERSISTENT');
        addLog('LATENCY: 4ms');
        break;

      case '/clear':
        setLogs([]);
        break;

      default:
        addLog(`Unknown protocol: ${action}. Type 'help' for nexus commands.`, 'ERR');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] border-2 border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-[0_80px_150px_rgba(0,0,0,1)] shadow-inner relative group">
      <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
      
      {/* ── TERMINAL HEADER ── */}
      <div className="flex items-center justify-between px-10 py-6 bg-white/[0.02] border-b-2 border-white/5 relative z-10 transition-colors group-hover:bg-[#ff6b2b]/5">
        <div className="flex items-center gap-6">
          <div className="h-10 w-10 bg-black border border-[#ff6b2b]/20 rounded-xl flex items-center justify-center text-[#ff6b2b] shadow-inner group-hover:scale-110 transition-transform">
             <TerminalIcon size={20} strokeWidth={3} />
          </div>
          <div className="space-y-1">
             <span className="text-[12px] font-black uppercase tracking-[0.6em] text-white/40 italic leading-none block">Sovereign_Shell_</span>
             <span className="text-[9px] font-black text-[#ff6b2b]/40 uppercase tracking-[0.2em] italic leading-none">Cluster_OMEGA_Secure</span>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-2 w-2 rounded-full bg-[#ff6b2b] animate-ping" />
          <div className="h-2 w-2 rounded-full bg-white/10" />
          <div className="h-2 w-2 rounded-full bg-white/5" />
        </div>
      </div>

      {/* ── LOGS OUTPUT ── */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-10 space-y-4 custom-scrollbar selection:bg-[#ff6b2b]/20 relative z-10 text-sm font-light italic"
      >
        <AnimatePresence mode="popLayout">
          {logs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-8 group/log"
            >
              <span className="text-[11px] font-black uppercase text-white/5 mt-1 min-w-[100px] tabular-nums tracking-widest group-hover/log:text-white/20 transition-colors">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className={`
                ${log.type === 'CMD' ? 'text-white font-black uppercase tracking-tight' : ''}
                ${log.type === 'SYS' ? 'text-[#ff6b2b] font-black uppercase tracking-widest pt-0.5' : ''}
                ${log.type === 'ERR' ? 'text-red-500 font-black uppercase' : ''}
                ${log.type === 'OUT' ? 'text-white/20' : ''}
                whitespace-pre-wrap flex-1 leading-relaxed
              `}>
                {log.type === 'CMD' && <span className="text-[#ff6b2b] mr-4">❯</span>}
                {log.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── INPUT LINE ── */}
      <div className="p-8 lg:px-10 bg-white/[0.01] border-t-2 border-white/5 flex items-center gap-6 relative z-10">
        <span className="text-[#ff6b2b] font-black text-xl italic group-focus-within:animate-pulse truncate shrink-0">OMEGA_ENTRY ❯</span>
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
          placeholder="Enter command (type 'help')..."
          className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/5 font-black uppercase italic tracking-tighter text-2xl h-12 pt-1"
          autoFocus
        />
        <div className="shrink-0 flex items-center gap-4 text-[10px] font-black uppercase text-white/5 tracking-[0.4em] italic group-hover:text-[#ff6b2b]/20 transition-colors">
           <Zap size={14} strokeWidth={3} /> Active_Field_
        </div>
      </div>

      <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.15); border-radius: 20px; }
      `}</style>
    </div>
  );
}
