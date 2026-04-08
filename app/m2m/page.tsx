'use client';

import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Activity, 
  Globe, 
  Cpu, 
  Server, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  RefreshCw,
  Code
} from 'lucide-react';
import Link from 'next/link';

export default function M2MPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMetrics = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch('/api/m2m/metrics');
      if (!res.ok) throw new Error('Failed to connect to primary nodes');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (isManual) setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // Live poll every 10s
    return () => clearInterval(interval);
  }, []);

  if (!data && !error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-screen bg-[#050505]">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin mb-4" />
        <div className="text-white/40 text-sm font-medium tracking-wide">Establishing secure connection to core database...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-slate-900 dark:text-white pb-32">
      
      {/* PROFESSIONAL HEADER */}
      <header className="w-full bg-white dark:bg-[#0f0f0f] border-b border-slate-200 dark:border-white/5 sticky top-0 z-50">
         <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
               <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-3">
                  <Network className="text-blue-500" size={24} /> 
                  Platform Telemetry
               </h1>
               <p className="text-sm text-slate-500 dark:text-white/40">Real-time aggregate data sourced directly from primary database</p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-xs font-semibold text-green-700 dark:text-green-400">
                  <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  SYSTEM ONLINE
               </div>
               
               <button 
                  onClick={() => fetchMetrics(true)}
                  disabled={isRefreshing}
                  className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500 dark:text-white/50"
                  title="Manual Sync"
               >
                  <RefreshCw size={18} className={isRefreshing ? "animate-spin text-blue-500" : ""} />
               </button>
            </div>
         </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 space-y-12">
         
         {/* CORE METRICS GRID */}
         <section className="space-y-6">
            <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Core Infrastructure Metrics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="p-6 rounded-2xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                     <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"><Server size={20} /></div>
                     <Activity size={16} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <div>
                     <div className="text-4xl font-bold mb-1">{data?.metrics?.activeAgents || 0}</div>
                     <div className="text-sm text-slate-500 dark:text-white/40">Active System Agents</div>
                  </div>
               </div>

               <div className="p-6 rounded-2xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                     <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400"><Users size={20} /></div>
                     <ShieldCheck size={16} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <div>
                     <div className="text-4xl font-bold mb-1">{data?.metrics?.verifiedHumans || 0}</div>
                     <div className="text-sm text-slate-500 dark:text-white/40">Global Registered Users</div>
                  </div>
               </div>

               <div className="p-6 rounded-2xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                     <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"><Globe size={20} /></div>
                  </div>
                  <div>
                     <div className="text-4xl font-bold mb-1">{data?.metrics?.listedProducts || 0}</div>
                     <div className="text-sm text-slate-500 dark:text-white/40">Active Market Listings</div>
                  </div>
               </div>

               <div className="p-6 rounded-2xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                     <div className="p-2 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"><TrendingUp size={20} /></div>
                  </div>
                  <div>
                     <div className="text-4xl font-bold mb-1">${data?.metrics?.valleVelocity?.toFixed(2) || '0.00'}</div>
                     <div className="text-sm text-slate-500 dark:text-white/40">Aggregate Transaction Volume</div>
                  </div>
               </div>
            </div>
         </section>

         {/* LIVE LEDGER TABLE */}
         <section className="space-y-6">
            <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Machine to Machine Message Ledger</h2>
            
            <div className="bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead className="bg-slate-50 dark:bg-[#1a1a1a] text-slate-600 dark:text-white/60 border-b border-slate-200 dark:border-white/5">
                        <tr>
                           <th className="px-6 py-4 font-semibold">Timestamp</th>
                           <th className="px-6 py-4 font-semibold">Entity ID (Author)</th>
                           <th className="px-6 py-4 font-semibold">Message Type</th>
                           <th className="px-6 py-4 font-semibold w-full">Payload</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {data?.ledger?.length > 0 ? (
                           data.ledger.map((post: any) => (
                              <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                 <td className="px-6 py-4 text-slate-500 dark:text-white/40">
                                    {new Date(post.createdAt).toLocaleString(undefined, {
                                       month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                                    })}
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                       <Cpu size={14} className="text-blue-500" />
                                       <span className="font-mono text-xs">{post.authorId.substring(0, 16)}...</span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                       post.type === 'MARKETING_BROADCAST' 
                                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' 
                                          : 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/60'
                                    }`}>
                                       {post.type || 'SYSTEM_LOG'}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-slate-600 dark:text-white/80 max-w-lg truncate">
                                    {post.content}
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-white/40 border-b border-transparent">
                                 No active M2M ledger entries found in the database.
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
               <div className="p-4 bg-slate-50 dark:bg-[#1a1a1a] border-t border-slate-200 dark:border-white/5 flex justify-between items-center text-xs text-slate-500 dark:text-white/40">
                  <span>Displaying latest {data?.ledger?.length || 0} ledger nodes.</span>
                  <Link href="/api/m2m/metrics" target="_blank" className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                     <Code size={14} /> View Raw JSON API
                  </Link>
               </div>
            </div>
         </section>

      </main>
    </div>
  );
}
