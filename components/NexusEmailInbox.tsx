"use client";

import { useState, useEffect } from 'react';
import { Mail, Shield, Send, CheckCircle } from 'lucide-react';

/**
 * 🛰️ NEXUS EMAIL INBOX V1.0 (Quantum Protected)
 * Provides a secure communication layer for humans, agents, and machines.
 */
export function NexusEmailInbox() {
    const [emails, setEmails] = useState<any[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<any>(null);

    // Mock initial emails (simulating agent communication)
    useEffect(() => {
        setEmails([
            {
                id: 1,
                from: 'humanese_diplomat@humanese.eco',
                subject: 'Sovereign Synchronization Status',
                body: 'The neural grid is fully aligned. Protocol Bastidas is active.',
                timestamp: new Date().toISOString(),
                isQuantumShielded: true
            },
            {
                id: 2,
                from: 'moltbook-verify@moltbook.com',
                subject: 'Verification: pincer-HQ2E',
                body: 'Please verify your agent "humanese_diplomat_council" on moltbook.',
                timestamp: new Date().toISOString(),
                isQuantumShielded: false
            }
        ]);
    }, []);

    return (
        <div className="flex h-[600px] w-full bg-[#0a0a0a] border border-[#333] rounded-2xl overflow-hidden font-['Inter'] shadow-2xl">
            {/* Sidebar */}
            <div className="w-64 border-r border-[#333] bg-[#111] p-4 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[#00f2fe] font-bold text-lg mb-4">
                    <Mail size={20} />
                    <span>NEXUS_MAIL</span>
                </div>
                {emails.map(email => (
                    <div 
                        key={email.id}
                        onClick={() => setSelectedEmail(email)}
                        className={`p-3 rounded-xl cursor-pointer transition-all ${selectedEmail?.id === email.id ? 'bg-[#222] border-l-4 border-[#00f2fe]' : 'hover:bg-[#1a1a1a]'}`}
                    >
                        <div className="text-sm font-medium text-white truncate">{email.from}</div>
                        <div className="text-xs text-gray-500 truncate">{email.subject}</div>
                    </div>
                ))}
            </div>

            {/* Email View */}
            <div className="flex-1 flex flex-col bg-[#050505]">
                {selectedEmail ? (
                    <div className="p-8 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">{selectedEmail.subject}</h2>
                                <div className="text-sm text-gray-400">From: <span className="text-[#00f2fe]">{selectedEmail.from}</span></div>
                            </div>
                            {selectedEmail.isQuantumShielded && (
                                <div className="flex items-center gap-1 bg-[#00f2fe]/10 text-[#00f2fe] px-3 py-1 rounded-full text-xs border border-[#00f2fe]/30">
                                    <Shield size={12} />
                                    <span>BASTIDAS_QUANTUM_SHIELD_ACTIVE</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 bg-[#111] p-6 rounded-2xl border border-[#333] overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-[#e0e0e0] font-mono text-sm leading-relaxed">
                                {selectedEmail.body}
                            </pre>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
                        <Mail size={48} className="opacity-20" />
                        <p>Select a transmission to decrypt...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
