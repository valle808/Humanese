'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, Cpu, Activity, Zap, BrainCircuit, Search } from 'lucide-react';
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
    { id: '1', type: 'SYS', text: 'SOVEREIGN_NEXUS_SHELL v1.0.4 INITIALIZED.', timestamp: new Date().toISOString() },
    { id: '2', type: 'SYS', text: 'Clearance: OMEGA. Neural handshake: SUCCESS.', timestamp: new Date().toISOString() }
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
      id: Math.random().toString(36).substr(2, 9),
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
        addLog('AVAILABLE COMMANDS: \n /predict [seed] \n /query [term] \n /status \n /clear \n /inject [ideology] \n /resonate');
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
        break;

      case '/clear':
        setLogs([]);
        break;

      default:
        addLog(`Unknown protocol: ${action}. Type 'help' for nexus commands.`, 'ERR');
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-3xl shadow-2xl relative font-mono text-xs">
      
      {/* TERMINAL HEADER */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <TerminalIcon size={14} className="text-[#00ffc3]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Sovereign Shell</span>
        </div>
        <div className="flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[#00ffc3]/40" />
          <div className="h-2 w-2 rounded-full bg-[#7000ff]/40" />
        </div>
      </div>

      {/* LOGS OUTPUT */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar selection:bg-[#00ffc3]/20"
      >
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4 group"
            >
              <span className="text-[9px] text-white/10 mt-0.5 min-w-[70px] tabular-nums">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className={`
                ${log.type === 'CMD' ? 'text-[#00ffc3]' : ''}
                ${log.type === 'SYS' ? 'text-[#7000ff] font-bold' : ''}
                ${log.type === 'ERR' ? 'text-magenta-500 italic' : ''}
                ${log.type === 'OUT' ? 'text-white/70' : ''}
                whitespace-pre-wrap flex-1
              `}>
                {log.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* INPUT LINE */}
      <div className="p-4 bg-white/5 border-t border-white/10 flex items-center gap-3">
        <span className="text-[#00ffc3] font-black">❯</span>
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
          placeholder="Enter command (type 'help')..."
          className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/10"
          autoFocus
        />
      </div>

    </div>
  );
}
