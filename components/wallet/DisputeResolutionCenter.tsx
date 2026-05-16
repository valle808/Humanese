'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  X, 
  MessageSquare, 
  Zap, 
  ShieldCheck,
  BrainCircuit,
  Gavel,
  Activity
} from 'lucide-react';

interface DisputeResolutionCenterProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
}

export const DisputeResolutionCenter = ({ isOpen, onClose, transaction }: DisputeResolutionCenterProps) => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(2);
    }, 3000);
  };

  const agents = [
    { name: 'Neural Arbitrator', role: 'Logical Verification', status: 'Active' },
    { name: 'Sovereign Compliance', role: 'Protocol Integrity', status: 'Syncing' },
    { name: 'Omega Watcher', role: 'Anomaly Detection', status: 'Scanning' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/95 backdrop-blur-3xl"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            className="relative w-full max-w-4xl bg-card border-2 border-border rounded-[3rem] shadow-[0_80px_150px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-10 py-10 bg-muted/20 border-b-2 border-border flex justify-between items-center relative">
              <div className="absolute inset-0 bg-primary/5 blur-[40px] rounded-full animate-pulse" />
              <div className="relative z-10 space-y-2">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-foreground flex items-center gap-4">
                  <ShieldAlert className="text-primary" size={32} />
                  Dispute_Resolution_Nexus
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic">Sovereign Judicial Protocol v7.0</p>
              </div>
              <button onClick={onClose} className="relative z-10 p-4 bg-background border-2 border-border rounded-2xl hover:text-primary transition-all active:scale-90">
                <X size={24} strokeWidth={3} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-10 overflow-y-auto custom-scrollbar min-h-[500px]">
              {step === 1 ? (
                <div className="space-y-12">
                  <div className="p-8 bg-muted/10 border-2 border-border rounded-[2rem] space-y-6">
                    <div className="flex items-center justify-between">
                       <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">Case_Reference</span>
                       <span className="text-[11px] font-black uppercase tracking-widest text-primary italic">{transaction?.id}</span>
                    </div>
                    <div className="h-px bg-border/30 w-full" />
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <div className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em]">Transaction Type</div>
                        <div className="text-xl font-black uppercase italic tracking-tighter text-foreground">{transaction?.type} {transaction?.currency}</div>
                      </div>
                      <div className="space-y-1 text-right">
                        <div className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em]">Total Impact</div>
                        <div className="text-xl font-black uppercase italic tracking-tighter text-primary">{transaction?.usdValue}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-[12px] font-black uppercase tracking-[0.6em] text-muted-foreground/40 italic">Assigned_Arbitration_Agents_</h4>
                     <div className="grid sm:grid-cols-3 gap-4">
                        {agents.map((agent, i) => (
                           <div key={i} className="p-6 bg-background border border-border rounded-2xl space-y-3 group hover:border-primary/40 transition-all">
                              <div className="flex justify-between items-start">
                                 <div className="w-10 h-10 bg-muted border border-border rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all">
                                    <BrainCircuit size={20} strokeWidth={2.5} />
                                 </div>
                                 <div className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-[7px] font-black text-primary uppercase tracking-widest animate-pulse">{agent.status}</div>
                              </div>
                              <div className="space-y-0.5">
                                 <div className="text-[11px] font-black uppercase italic tracking-tight text-foreground">{agent.name}</div>
                                 <div className="text-[9px] text-muted-foreground/40 uppercase font-black tracking-widest">{agent.role}</div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <button 
                    onClick={startAnalysis}
                    disabled={isAnalyzing}
                    className="w-full py-8 bg-primary text-background rounded-[2rem] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] italic text-sm shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6"
                  >
                    {isAnalyzing ? (
                      <>Analyzing Evidence <Activity className="animate-spin" size={24} /></>
                    ) : (
                      <>Initialize_Evidence_Scan <Zap size={24} strokeWidth={3} /></>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-10 py-12 text-center">
                   <div className="relative">
                      <div className="w-32 h-32 bg-primary/10 border-4 border-primary rounded-full flex items-center justify-center text-primary shadow-[0_0_60px_rgba(var(--primary),0.4)]">
                         <ShieldCheck size={64} strokeWidth={3} />
                      </div>
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"
                      />
                   </div>
                   <div className="space-y-4 max-w-lg">
                      <h3 className="text-4xl font-black uppercase italic tracking-tighter text-foreground">Verdict_Pending.</h3>
                      <p className="text-muted-foreground italic leading-relaxed text-sm">
                        The specialized agents have successfully scanned the transaction shards on the Sovereign Node. 
                        Initial resonance suggests protocol compliance, but a manual review by the <span className="text-primary">Judicial Oversight Committee</span> has been flagged. 
                        Your case #8824 is now under high-priority arbitration.
                      </p>
                   </div>
                   <button 
                     onClick={onClose}
                     className="px-12 py-5 bg-muted border-2 border-border rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] text-foreground hover:bg-foreground hover:text-background transition-all italic flex items-center gap-4"
                   >
                     Return to Vault <Gavel size={18} strokeWidth={3} />
                   </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-10 py-6 bg-muted/10 border-t-2 border-border flex items-center justify-between text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Sovereign Court Link Established
               </div>
               <span>Syncing_E_2241</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
