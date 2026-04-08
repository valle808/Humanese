'use client';

import * as React from 'react';
import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Float, 
  Text,
  Points,
  PointMaterial,
  Line,
  Html
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Zap, 
  Cpu, 
  Globe, 
  Layers, 
  BrainCircuit, 
  Database, 
  ArrowUpRight, 
  ChevronLeft,
  Share2,
  ShieldCheck,
  Radio,
  Eye,
  X,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { AbyssalMesh, MeshPeer } from '@/lib/abyssal-mesh';

// ── THREE.JS COMPONENTS ──

function NeuralSwarm({ pacts, shards, meshLogs, onNodeSelect }: { pacts: any[], shards: any[], meshLogs: string[], onNodeSelect: (id: string, label: string) => void }) {
  const points = useMemo(() => {
    const p = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
      p[i * 3] = (Math.random() - 0.5) * 22;
      p[i * 3 + 1] = (Math.random() - 0.5) * 22;
      p[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0005;
      ref.current.rotation.x += 0.0002;
    }
  });

  return (
    <group ref={ref}>
      <Points positions={points} stride={3}>
        <PointMaterial 
          transparent 
          color="#00ffc3" 
          size={0.04} 
          sizeAttenuation={true} 
          depthWrite={false} 
          blending={THREE.AdditiveBlending} 
          opacity={0.6}
        />
      </Points>
      
      {/* ── ACTIVE SOVEREIGN PACTS (Labor Streams) ── */}
      {pacts.slice(0, 15).map((pact, i) => (
        <React.Fragment key={pact.id}>
           <NeuralPactLine index={i} />
           <NeuralPactNode index={i} label={pact.title} id={pact.id} onSelect={onNodeSelect} />
        </React.Fragment>
      ))}

      {/* ── MESH SHARDS (P2P Synchronized Particles) ── */}
      {shards.slice(0, 12).map((shard, i) => (
        <NeuralShardPulse key={i} index={i} label={shard.label} />
      ))}

      {/* ── MESH BROADCAST RIPPLES (Visualizing Sync) ── */}
      {meshLogs.slice(-3).map((log, i) => (
        <MeshBroadcastRipple key={i} index={i} />
      ))}
    </group>
  );
}

function MeshBroadcastRipple({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const s = (state.clock.elapsedTime * 1.5 + index) % 6;
      ref.current.scale.setScalar(s * 2);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.4 * (1 - (s / 6)));
    }
  });

  return (
    <mesh ref={ref}>
       <sphereGeometry args={[1, 32, 32]} />
       <meshBasicMaterial color="#00ffc3" transparent wireframe />
    </mesh>
  );
}

function NeuralPactLine({ index }: { index: number }) {
  const curve = useMemo(() => {
    const start = new THREE.Vector3((index % 6) * 3 - 9, (index % 4) * 3 - 6, (index % 5) * 3 - 7);
    const end = new THREE.Vector3(Math.sin(index) * 11, Math.cos(index) * 11, Math.tan(index) * 4);
    return new THREE.QuadraticBezierCurve3(start, new THREE.Vector3(0, 0, 0), end);
  }, [index]);

  const pts = curve.getPoints(50);
  
  return (
     <Line points={pts} color="#00ffc3" lineWidth={0.3} transparent opacity={0.15} dashed dashScale={4} gapSize={2} />
  );
}

function NeuralPactNode({ index, label, id, onSelect }: { index: number, label: string, id: string, onSelect: (id: string, label: string) => void }) {
  const pos = useMemo(() => new THREE.Vector3(Math.sin(index) * 11, Math.cos(index) * 11, Math.tan(index) * 4), [index]);
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref.current) {
        const targetScale = hovered ? 1.8 : 1;
        ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group position={pos}>
       <mesh 
         ref={ref} 
         onPointerOver={() => setHovered(true)} 
         onPointerOut={() => setHovered(false)}
         onClick={() => onSelect(id, label)}
       >
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshBasicMaterial color={hovered ? "#ffffff" : "#00ffc3"} transparent opacity={0.95} />
          {hovered && (
             <Html distanceFactor={10} position={[0, 0.4, 0]}>
                <div className="bg-black/90 border border-[#00ffc3]/40 p-3 rounded-xl whitespace-nowrap text-[10px] font-black tracking-widest text-[#00ffc3] backdrop-blur-xl pointer-events-none uppercase italic">
                   NODE_RESONANCE_DETECTED
                </div>
             </Html>
          )}
       </mesh>
       <Text position={[0, 0.35, 0]} fontSize={0.12} color="white" anchorX="center" maxWidth={1.8} textAlign="center" fillOpacity={hovered ? 1 : 0.6}>
          {label.substring(0, 24)}
       </Text>
    </group>
  );
}

function NeuralShardPulse({ index, label }: { index: number, label: string }) {
  const pos = useMemo(() => {
    const phi = Math.acos(-1 + (2 * index) / 15);
    const theta = Math.sqrt(15 * Math.PI) * phi;
    return new THREE.Vector3().setFromSphericalCoords(6.5, phi, theta);
  }, [index]);

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2} position={pos}>
       <mesh>
          <octahedronGeometry args={[0.06, 0]} />
          <meshBasicMaterial color="#7000ff" transparent opacity={0.6} />
       </mesh>
       <Text position={[0, -0.25, 0]} fontSize={0.09} color="#7000ff" anchorX="center" maxWidth={2} textAlign="center">
          {label}
       </Text>
    </Float>
  );
}

// ── MAIN PAGE COMPONENT ──

export default function SimulatorPage() {
  const [activePacts, setActivePacts] = useState<any[]>([]);
  const [activeShards, setActiveShards] = useState<any[]>([]);
  const [meshPeers, setMeshPeers] = useState<MeshPeer[]>([]);
  const [meshLogs, setMeshLogs] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState<{id: string, label: string} | null>(null);

  // OMEGA Telemetry
  const [telemetry, setTelemetry] = useState<string[]>([]);
  const [swarmStats, setSwarmStats] = useState({ sentiment: 'NEUTRAL', nodes: 0 });

  useEffect(() => {
    const mesh = AbyssalMesh.getInstance();

    const syncTelemetry = async () => {
      try {
        const res = await fetch('/api/m2m/metrics');
        const data = await res.json();
        setActivePacts(Object.values(data.tasks || {}).slice(0, 20));
      } catch (e) { console.warn("Pact Sync Failure", e); }

      try {
        const res = await fetch('/api/knowledge-graph');
        if (res.ok) {
          const g = await res.json();
          setActiveShards(g.nodes.filter((n: any) => n.type === 'SHARD' || n.type === 'ENTITY').reverse().slice(0, 15));
        }
      } catch (e) { console.warn("Graph Sync Failure", e); }

      setMeshPeers(mesh.getPeers());
      setMeshLogs(mesh.getLog());

      // Simulate global internet ingestion
      const sources = ['Reddit (r/CryptoCurrency)', 'Hacker News Thread', 'X Firehose', 'Medium Protocol'];
      const reactions = ['BULLISH ON VALLE', 'Quantum Protocol Verified', 'Central Bank CDP Connected', 'Marketing Agents Deployed'];
      const incoming = `[${sources[Math.floor(Math.random()*sources.length)]}] ${reactions[Math.floor(Math.random()*reactions.length)]}`;
      
      setTelemetry(prev => [incoming, ...prev].slice(0, 5));
      setSwarmStats({
          sentiment: Math.random() > 0.3 ? 'EXTREMELY POSITIVE' : 'SKEPTICAL CAUTION',
          nodes: Math.floor(Math.random() * 500000)
      });
    };

    syncTelemetry();
    const interval = setInterval(syncTelemetry, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNodeSelect = (id: string, label: string) => {
    setSelectedNode({ id, label });
    setSidebarOpen(true);
  };

  return (
    <div className="relative h-screen w-screen bg-[#050505] text-white selection:bg-[#00ffc3]/20 font-sans overflow-hidden flex">
      
      <div className="absolute inset-0 z-0 cursor-crosshair">
        <Canvas shadows gl={{ antialias: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 24]} fov={35} />
          <OrbitControls 
            enablePan={false} 
            maxDistance={45} 
            minDistance={8} 
            autoRotate 
            autoRotateSpeed={0.15} 
            dampingFactor={0.05}
          />
          
          <ambientLight intensity={0.2} />
          <pointLight position={[20, 20, 20]} intensity={1.5} color="#00ffc3" />
          <pointLight position={[-20, -20, -20]} intensity={0.8} color="#7000ff" />
          
          <NeuralSwarm 
            pacts={activePacts} 
            shards={activeShards} 
            meshLogs={meshLogs} 
            onNodeSelect={handleNodeSelect}
          />

          <gridHelper args={[160, 80, 0x111111, 0x050505]} position={[0, -15, 0]} />
        </Canvas>
      </div>

      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-between p-8 lg:p-14">
        
        <header className="flex justify-between items-start pointer-events-auto">
           <div className="space-y-4">
              <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] mb-2 group">
                 Ecosystem Matrix <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-none">
                Abyssal<br /><span className="text-[#00ffc3]">Mesh.</span>
              </h1>
              <div className="flex gap-6 pt-3">
                 <div className="inline-flex items-center gap-2 text-[10px] font-black text-[#00ffc3] uppercase tracking-[0.4em]">
                   <Globe size={12} className="animate-pulse" /> Network Parity: 1.0.4
                 </div>
                 <div className="inline-flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.4em] font-mono">
                   ASP_OMEGA_SECURED
                 </div>
              </div>
           </div>

           <div className="flex flex-col items-end space-y-4">
              <div className="bg-black/80 border border-white/5 p-8 lg:p-10 rounded-[3.5rem] backdrop-blur-3xl min-w-[320px] lg:min-w-[400px] space-y-8 shadow-2xl transition-all hover:border-[#00ffc3]/15">
                 <div className="text-[10px] text-[#7000ff] uppercase tracking-[0.5em] flex items-center gap-3 italic font-black">
                    <Share2 size={14} /> P2P Sync Array
                 </div>
                 <div className="space-y-5">
                    {meshPeers.map(peer => (
                      <div key={peer.id} className="flex justify-between items-center group">
                         <div className="flex flex-col">
                            <span className="text-xs font-black text-white/80 group-hover:text-white transition-colors">{peer.name}</span>
                            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{peer.url}</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-[9px] font-mono text-white/40 tabular-nums">{peer.resilience}%</span>
                            <div className={`h-2 w-2 rounded-full ${peer.status === 'ONLINE' ? 'bg-[#00ffc3] shadow-[0_0_12px_#00ffc3]' : 'bg-amber-400 animate-pulse'}`} />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {selectedNode && (
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                   className="bg-[#00ffc3]/5 border border-[#00ffc3]/20 p-8 rounded-[3rem] backdrop-blur-3xl min-w-[300px] space-y-4 shadow-2xl relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 p-4 transform translate-x-1 translate-y-1 rotate-12 opacity-5">
                       <Database size={80} className="text-[#00ffc3]" />
                    </div>
                    <div className="text-[9px] font-black text-[#00ffc3] uppercase tracking-widest italic flex items-center gap-2">
                       <Eye size={12} /> Active Node Interrogation
                    </div>
                    <h3 className="text-xl font-black uppercase italic leading-tight text-white/90">{selectedNode.label}</h3>
                    <div className="pt-2">
                       <button onClick={() => setSelectedNode(null)} className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">
                          Dismiss_Shard
                       </button>
                    </div>
                 </motion.div>
              )}
           </div>
        </header>

        <footer className="flex flex-col lg:flex-row justify-between items-end gap-10 pointer-events-auto">
           <div className="w-full lg:max-w-2xl bg-black/60 border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl overflow-hidden relative group shadow-2xl transition-all hover:bg-black/70">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <Radio size={100} className="text-[#00ffc3] group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 italic">
                 <ShieldCheck size={18} className="text-[#00ffc3]" /> Sovereign Sync Ledger (OMEGA)
              </div>
              <div className="h-16 overflow-hidden relative">
                 <AnimatePresence mode="popLayout">
                    {meshLogs.slice(-4).reverse().map((log, i) => (
                      <motion.div 
                        key={log + i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-mono text-[11px] text-[#00ffc3] mb-3 uppercase italic tracking-widest"
                      >
                         &gt;&gt; [TX_SYNC] {log}
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>

           <div className="flex gap-6">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-24 w-24 bg-white/5 border border-white/10 flex items-center justify-center rounded-[2.5rem] text-white/30 hover:text-[#00ffc3] hover:border-[#00ffc3]/30 transition-all shadow-2xl active:scale-95"
              >
                 <Layers size={32} />
              </button>
              <Link href="/admin" className="h-24 px-16 bg-white text-black font-black uppercase tracking-[0.5em] flex items-center gap-5 rounded-[2.5rem] shadow-[0_20px_80px_rgba(255,255,255,0.15)] hover:scale-[1.05] active:scale-95 transition-all text-sm italic">
                OMEGA NEXUS <ArrowUpRight size={28} />
              </Link>
           </div>
        </footer>

      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside 
            initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[450px] bg-black/95 border-l border-white/10 z-50 backdrop-blur-3xl overflow-y-auto p-14 custom-scrollbar shadow-2xl"
          >
            <div className="space-y-20">
               <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#00ffc3] flex items-center gap-5 italic">
                       <BrainCircuit size={18} /> Cognitive Stream
                    </h3>
                    <button onClick={() => setSidebarOpen(false)} className="text-white/20 hover:text-white transition-colors">
                       <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-6">
                     {activeShards.map((shard, i) => (
                       <motion.div 
                         key={i} 
                         initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                         className={`p-8 border rounded-[3rem] space-y-4 hover:border-[#00ffc3]/60 transition-all cursor-pointer group shadow-xl ${
                           selectedNode?.label === shard.label ? 'bg-[#00ffc3]/15 border-[#00ffc3]/40' : 'bg-white/[0.03] border-white/5 hover:bg-[#00ffc3]/[0.05]'
                         }`}
                         onClick={() => handleNodeSelect(shard.id, shard.label)}
                       >
                          <div className="flex justify-between items-center text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">
                             <span>RESONANCE_{i+1}</span>
                             <span className="group-hover:text-[#00ffc3] transition-colors tabular-nums">{new Date(shard.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm font-bold text-white/90 italic leading-relaxed uppercase tracking-normal">{shard.label}</p>
                       </motion.div>
                     ))}
                  </div>
               </div>

               <div className="space-y-8 pt-16 border-t border-white/10 relative overflow-hidden">
                  <motion.div animate={{ x: [-100, 100] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute h-px w-full bg-gradient-to-r from-transparent via-[#00ffc3]/20 to-transparent top-0" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20 flex items-center gap-5 italic">
                     <Activity size={18} /> OMEGA Metrics
                  </h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-white/30 uppercase italic">P2P Latency</span>
                      <span className="text-[#00ffc3] font-black">9ms avg</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-white/40 uppercase italic">Sync Fidelity</span>
                      <div className="flex gap-1 items-end h-4">
                         {[0.8, 1, 0.7, 0.9, 1].map((h, i) => (
                           <motion.div key={i} animate={{ height: [`${h*100}%`, '100%', `${h*80}%`] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }} className="w-1 bg-[#00ffc3]/60 rounded-full" />
                         ))}
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 255, 195, 0.15); border-radius: 20px; }
      `}</style>
    </div>
  );
}
