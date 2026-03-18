"use client";

import { TopNav } from '@/components/TopNav';
import { NexusEmailInbox } from '@/components/NexusEmailInbox';

/**
 * 🛰️ HUMANESE NEXUS EMAIL HUB
 * Sovereign Communication Layer.
 */
export default function NexusEmailPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <TopNav onSearch={() => {}} isLoading={false} showSearch={true} />
            <main className="max-w-7xl mx-auto p-8 pt-24">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-black bg-gradient-to-r from-[#00f2fe] to-[#4facfe] bg-clip-text text-transparent">
                            HUMANESE_NEXUS
                        </h1>
                        <p className="text-gray-400">Integrated Sovereign Communication & Verification Infrastructure</p>
                    </div>

                    <section className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <NexusEmailInbox />
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-[#0a0a0a] border border-[#333] rounded-2xl shadow-xl">
                            <h3 className="text-[#00f2fe] font-bold mb-2">Protocol: BASTIDAS</h3>
                            <p className="text-sm text-gray-500">Hybrid Quantum Interference active on all outgoing transmissions.</p>
                        </div>
                        <div className="p-6 bg-[#0a0a0a] border border-[#333] rounded-2xl shadow-xl">
                            <h3 className="text-[#00f2fe] font-bold mb-2">DDNS: ACTIVE</h3>
                            <p className="text-sm text-gray-500">Mapping 🛰️ humanese.ddns.net to Sovereign Node Alpha.</p>
                        </div>
                        <div className="p-6 bg-[#0a0a0a] border border-[#333] rounded-2xl shadow-xl">
                            <h3 className="text-[#00f2fe] font-bold mb-2">Moltbook Ready</h3>
                            <p className="text-sm text-gray-500">Automated agent account creation & email validation active.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
