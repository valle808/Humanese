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
  Html,
  Sphere,
  MeshDistortMaterial
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
  MessageSquare,
  Terminal,
  Orbit,
  Wifi,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { AbyssalMesh, MeshPeer } from '@/lib/abyssal-mesh';

// ── THREE.JS COMPONENTS ──

function NeuralSwarm({ pacts, shards, meshLogs, onNodeSelect }: { pacts: any[], shards: any[], meshLogs: string[], onNodeSelect: (id: string, label: string) => void }) {
  const points = useMemo(() => {
    const p = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i++) {
      p[i * 3] = (Math.random() - 0.5) * 28;
      p[i * 3 + 1] = (Math.random() - 0.5) * 28;
      p[i * 3 + 2] = (Math.random() - 0.5) * 28;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0003;
      ref.current.rotation.x += 0.0001;
    }
  });

  return (
    <group ref={ref}>
      <Points positions={points} stride={3}>
        <PointMaterial 
          transparent 
          color="#ff6b2b" 
          size={0.05} 
          sizeAttenuation={true} 
          depthWrite={false} 
          blending={THREE.AdditiveBlending} 
          opacity={0.4}
        />
      </Points>
      
      {/* ── ACTIVE SOVEREIGN PACTS ── */}
      {pacts.slice(0, 15).map((pact, i) => (
        <React.Fragment key={pact.id}>
           <NeuralPactLine index={i} />
           <NeuralPactNode index={i} label={pact.title} id={pact.id} onSelect={onNodeSelect} />
        </React.Fragment>
      ))}

      {/* ── MESH SHARDS ── */}
      {shards.slice(0, 12).map((shard, i) => (
        <NeuralShardPulse key={i} index={i} label={shard.label} />
      ))}

      {/* ── BROADCAST RIPPLES ── */}
      {meshLogs.slice(-2).map((log, i) => (
        <MeshBroadcastRipple key={i} index={i} />
      ))}
    </group>
  );
}

function MeshBroadcastRipple({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const s = (state.clock.elapsedTime * 1.2 + index) % 8;
      ref.current.scale.setScalar(s * 2.5);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.3 * (1 - (s / 8)));
    }
  });

  return (
    <mesh ref={ref}>
       <sphereGeometry args={[1, 64, 64]} />
       <meshBasicMaterial color="#ff6b2b" transparent wireframe opacity={0.1} />
    </mesh>
  );
}

function NeuralPactLine({ index }: { index: number }) {
  const curve = useMemo(() => {
    const start = new THREE.Vector3((index % 6) * 4 - 10, (index % 4) * 4 - 8, (index % 5) * 4 - 9);
    const end = new THREE.Vector3(Math.sin(index) * 14, Math.cos(index) * 14, Math.tan(index) * 5);
    return new THREE.QuadraticBezierCurve3(start, new THREE.Vector3(0, 0, 0), end);
  }, [index]);

  const pts = curve.getPoints(60);
  
  return (
     <Line points={pts} color="#ff6b2b" lineWidth={0.5} transparent opacity={0.1} dashed dashScale={10} gapSize={10} />
  );
}

function NeuralPactNode({ index, label, id, onSelect }: { index: number, label: string, id: string, onSelect: (id: string, label: string) => void }) {
  const pos = useMemo(() => new THREE.Vector3(Math.sin(index) * 14, Math.cos(index) * 14, Math.tan(index) * 5), [index]);
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref.current) {
        const targetScale = hovered ? 2.5 : 1;
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
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshBasicMaterial color={hovered ? "#ffffff" : "#ff6b2b"} transparent opacity={0.9} />
          {hovered && (
             <Html distanceFactor={10} position={[0, 0.6, 0]}>
                <div className="bg-[#050505] border border-[#ff6b2b]/40 p-5 rounded-[2rem] whitespace-nowrap text-[11px] font-black tracking-[0.4em] text-[#ff6b2b] backdrop-blur-3xl pointer-events-none uppercase italic shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-2">
                   SHARD_LOCK.extracted
                </div>
             </Html>
          )}
       </mesh>
       <Text position={[0, 0.5, 0]} fontSize={0.15} color="white" anchorX="center" maxWidth={2.2} textAlign="center" fillOpacity={hovered ? 1 : 0.4} font="/fonts/Inter-Black.woff">
          {label.substring(0, 32)}
       </Text>
    </group>
  );
}

function NeuralShardPulse({ index, label }: { index: number, label: string }) {
  const pos = useMemo(() => {
    const phi = Math.acos(-1 + (2 * index) / 15);
    const theta = Math.sqrt(15 * Math.PI) * phi;
    return new THREE.Vector3().setFromSphericalCoords(8, phi, theta);
  }, [index]);

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={3} position={pos}>
       <mesh>
          <octahedronGeometry args={[0.08, 0]} />
          <meshBasicMaterial color="#ff6b2b" transparent opacity={0.3} />
       </mesh>
       <Text position={[0, -0.3, 0]} fontSize={0.1} color="#ff6b2b" anchorX="center" maxWidth={2.5} textAlign="center" opacity={0.3}>
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
  const [swarmStats, setSwarmStats] = useState({ sentiment: 'STABLE', nodes: 0 });

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
      const sources = ['Reddit (r/Humanese)', 'Hacker News Protocol', 'Global X Firehose', 'Secure Ledger'];
      const reactions = ['OPTIMIZING RESONANCE', 'BLOCK_SIG VERIFIED', 'TREASURY REBALANCED', 'NODE_SYMMETRY REACHED'];
      const incoming = `[${sources[Math.floor(Math.random()*sources.length)]}] ${reactions[Math.floor(Math.random()*reactions.length)]}`;
      
      setTelemetry(prev => [incoming, ...prev].slice(0, 8));
      setSwarmStats({
          sentiment: Math.random() > 0.3 ? 'FULLY SYNCED' : 'ALIGNING VECTORS',
          nodes: Math.floor(Math.random() * 850000)
      });
    };

    syncTelemetry();
    const interval = setInterval(syncTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNodeSelect = (id: string, label: string) => {
    setSelectedNode({ id, label });
    setSidebarOpen(true);
  };

  return (
    <div className="relative h-screen w-screen bg-[#050505] text-white selection:bg-[#ff6b2b]/40 font-sans overflow-hidden flex">
      
      {/* 🧊 THREE.JS SCENE */}
      <div className="absolute inset-0 z-0 cursor-move">
        <Canvas shadows gl={{ antialias: true, stencil: false, depth: true }} dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 28]} fov={40} />
          <OrbitControls 
            enablePan={false} 
            maxDistance={50} 
            minDistance={10} 
            autoRotate 
            autoRotateSpeed={0.2} 
            dampingFactor={0.05}
          />
          
          <ambientLight intensity={0.15} />
          <pointLight position={[25, 25, 25]} intensity={2} color="#ff6b2b" />
          <pointLight position={[-25, -25, -25]} intensity={1} color="#ff6b2b" />
          <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={1} color="#ffffff" castShadow />
          
          <NeuralSwarm 
            pacts={activePacts} 
            shards={activeShards} 
            meshLogs={meshLogs} 
            onNodeSelect={handleNodeSelect}
          />

          <gridHelper args={[200, 100, 0x111111, 0x050505]} position={[0, -20, 0]} />
        </Canvas>
      </div>

      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-between p-8 lg:p-14">
        
        {/* TOP HUD */}
        <header className="flex justify-between items-start pointer-events-auto">
           <div className="space-y-8">
              <Link href="/" className="inline-flex items-center gap-4 text-white/20 hover:text-[#ff6b2b] transition-all text-[11px] font-black uppercase tracking-[0.6em] mb-4 group italic">
                 <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Access Matrix
              </Link>
              <div className="space-y-4">
                  <h1 className="text-7xl lg:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8]">
                    Abyssal<br /><span className="text-[#ff6b2b]">Mesh.</span>
                  </h1>
                  <div className="flex gap-12 pt-6">
                     <div className="inline-flex items-center gap-4 text-[11px] font-black text-[#ff6b2b] uppercase tracking-[0.6em] italic">
                       <Orbit size={18} className="animate-spin-slow" /> Network Resonance: 100%
                     </div>
                     <div className="inline-flex items-center gap-4 text-[11px] font-black text-white/10 uppercase tracking-[0.4em] font-mono italic">
                       OMEGA_DECENTRALIZED_ARRAY
                     </div>
                  </div>
              </div>
           </div>

           <div className="flex flex-col items-end space-y-8">
              <div className="bg-[#050505]/95 border border-white/10 p-12 lg:p-16 rounded-[4rem] backdrop-blur-3xl min-w-[350px] lg:min-w-[500px] space-y-12 shadow-[0_40px_100px_rgba(0,0,0,0.8)] transition-all hover:border-[#ff6b2b]/30 group">
                 <div className="flex justify-between items-center">
                    <div className="text-[11px] text-[#ff6b2b] uppercase tracking-[0.6em] flex items-center gap-4 italic font-black">
                        <Share2 size={18} /> P2P Node Cluster
                    </div>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ff6b2b] animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-[#ff6b2b]/40 animate-pulse delay-75" />
                    </div>
                 </div>
                 <div className="space-y-8 max-h-[250px] overflow-y-auto pr-6 custom-scrollbar">
                    {meshPeers.map(peer => (
                      <div key={peer.id} className="flex justify-between items-center group/peer hover:bg-white/[0.02] p-4 rounded-2xl transition-all">
                         <div className="flex flex-col gap-1">
                            <span className="text-lg font-black text-white/80 group-hover/peer:text-white transition-colors italic uppercase tracking-tighter">{peer.name}</span>
                            <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">{peer.url}</span>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="text-right">
                                <span className="text-[11px] font-black text-[#ff6b2b] tabular-nums italic">{peer.resilience}%</span>
                                <div className="text-[8px] font-black text-white/10 uppercase tracking-widest">Stability</div>
                            </div>
                            <div className={`h-4 w-4 rounded-xl ${peer.status === 'ONLINE' ? 'bg-[#ff6b2b] shadow-[0_0_20px_rgba(255,107,43,0.6)]' : 'bg-amber-400 animate-pulse shadow-[0_0_15px_rgba(251,191,36,0.4)]'}`} />
                         </div>
                      </div>
                    ))}
                    {meshPeers.length === 0 && (
                        <div className="py-12 text-center text-[10px] font-black uppercase tracking-[0.5em] text-white/5 italic">Searching for proximal mesh peers...</div>
                    )}
                 </div>
              </div>

              {selectedNode && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9, x: 50 }} animate={{ opacity: 1, scale: 1, x: 0 }}
                   className="bg-[#ff6b2b] text-black p-12 rounded-[3.5rem] backdrop-blur-3xl min-w-[380px] space-y-8 shadow-[0_40px_80px_rgba(255,107,43,0.3)] relative overflow-hidden group border-4 border-white/20"
                 >
                    <div className="absolute top-0 right-0 p-8 transform translate-x-4 translate-y-4 rotate-12 opacity-10 pointer-events-none select-none">
                       <Database size={150} />
                    </div>
                    <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.8em] italic leading-none">
                       <Eye size={16} strokeWidth={3} /> Node Interrogation
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-4xl font-black uppercase italic leading-tight tracking-tighter">{selectedNode.label}</h3>
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 italic">ID_HASH: {selectedNode.id.toUpperCase()}</p>
                    </div>
                    <div className="pt-8 border-t border-black/10 flex justify-between items-center">
                       <button onClick={() => setSelectedNode(null)} className="text-[11px] font-black uppercase tracking-[0.4em] hover:scale-110 transition-all italic leading-none underline decoration-black/20 underline-offset-8">
                          Dismiss_Signal
                       </button>
                       <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center animate-spin-slow">
                          <Radio size={16} />
                       </div>
                    </div>
                 </motion.div>
              )}
           </div>
        </header>

        {/* BOTTOM TELEMETRY */}
        <footer className="flex flex-col lg:flex-row justify-between items-end gap-16 pointer-events-auto">
           <div className="w-full lg:max-w-3xl bg-[#050505]/95 border border-white/5 rounded-[4.5rem] p-12 lg:p-16 backdrop-blur-3xl overflow-hidden relative group shadow-[0_50px_120px_rgba(0,0,0,0.9)] transition-all hover:bg-black group">
              <div className="absolute top-0 right-0 p-16 opacity-[0.02]">
                 <Terminal size={180} className="text-[#ff6b2b] group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-6 text-[12px] font-black uppercase tracking-[0.6em] text-white/20 italic leading-none">
                     <ShieldCheck size={24} className="text-[#ff6b2b] animate-pulse" /> Transmission Ledger (OMEGA_SYNC)
                  </div>
                  <div className="text-[10px] font-mono text-[#ff6b2b]/40 italic">ENCRYPTION: AES-256-Ω</div>
              </div>
              <div className="h-32 overflow-hidden relative">
                 <AnimatePresence mode="popLayout">
                    {telemetry.map((log, i) => (
                      <motion.div 
                        key={log + i}
                        initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        className="font-mono text-[12px] text-[#ff6b2b] mb-4 uppercase italic tracking-[0.2em] flex items-center gap-6"
                      >
                         <span className="opacity-20 flex-shrink-0">[{new Date().toLocaleTimeString()}]</span>
                         <span className="truncate">{log}</span>
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>

           <div className="flex gap-10">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-32 w-32 bg-white/[0.01] border border-white/10 flex items-center justify-center rounded-[3.5rem] text-white/10 hover:text-[#ff6b2b] hover:border-[#ff6b2b]/40 transition-all shadow-2xl active:scale-90 group relative overflow-hidden"
              >
                 <div className="absolute inset-0 bg-[#ff6b2b]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Layers size={48} className="group-hover:rotate-12 transition-transform duration-500 relative z-10" />
              </button>
              <Link href="/admin" className="h-32 px-24 bg-white text-black font-black uppercase tracking-[0.8em] flex items-center gap-8 rounded-[3.5rem] shadow-[0_40px_120px_rgba(255,255,255,0.2)] hover:scale-[1.05] active:scale-95 transition-all text-sm italic group">
                OMEGA ARCHIVE <ArrowUpRight size={40} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" strokeWidth={3} />
              </Link>
           </div>
        </footer>

      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside 
            initial={{ x: 600, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: 600, opacity: 0 }}
            transition={{ type: 'spring', damping: 35, stiffness: 250 }}
            className="fixed right-0 top-0 bottom-0 w-[600px] bg-[#050505]/98 border-l border-white/5 z-50 backdrop-blur-[50px] overflow-y-auto p-20 custom-scrollbar shadow-[-50px_0_150px_rgba(0,0,0,0.9)]"
          >
            <div className="space-y-32">
               <div className="space-y-16">
                  <div className="flex justify-between items-center">
                    <div className="space-y-3">
                        <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-[#ff6b2b] flex items-center gap-6 italic leading-none">
                           <BrainCircuit size={24} strokeWidth={2.5} /> Cognitive Stream
                        </h3>
                        <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em] italic pl-[3rem]">REAL_TIME_FRAGMENT_ANALYSIS</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="text-white/10 hover:text-[#ff6b2b] transition-all bg-white/[0.02] p-4 rounded-2xl hover:scale-110 active:scale-90 border border-white/5">
                       <X size={32} />
                    </button>
                  </div>
                  
                  <div className="space-y-8">
                     {activeShards.length > 0 ? activeShards.map((shard, i) => (
                       <motion.div 
                         key={i} 
                         initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                         className={`p-10 border rounded-[4rem] space-y-8 hover:border-[#ff6b2b]/50 transition-all cursor-pointer group shadow-2xl relative overflow-hidden ${
                           selectedNode?.label === shard.label ? 'bg-[#ff6b2b] text-black border-[#ff6b2b] shadow-[0_20px_60px_rgba(255,107,43,0.4)]' : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03]'
                         }`}
                         onClick={() => handleNodeSelect(shard.id, shard.label)}
                       >
                          <div className={`flex justify-between items-center text-[11px] font-black uppercase tracking-[0.4em] italic leading-none ${selectedNode?.label === shard.label ? 'text-black/40' : 'text-white/20'}`}>
                             <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${selectedNode?.label === shard.label ? 'bg-black animate-pulse' : 'bg-[#ff6b2b] animate-pulse'}`} />
                                <span>FRAGMENT_{i+1}</span>
                             </div>
                             <span className="tabular-nums opacity-60">SYNC: 100%</span>
                          </div>
                          <div className="space-y-4">
                             <p className={`text-2xl font-black italic tracking-tighter uppercase leading-tight ${selectedNode?.label === shard.label ? 'text-black' : 'text-white/80'} group-hover:scale-[1.02] transition-transform origin-left`}>{shard.label}</p>
                             <p className={`text-[10px] font-mono uppercase tracking-widest ${selectedNode?.label === shard.label ? 'text-black/30' : 'text-white/10'}`}>{new Date(shard.timestamp).toISOString()}</p>
                          </div>
                       </motion.div>
                     )) : (
                        <div className="py-24 text-center space-y-8 border border-dashed border-white/5 rounded-[4rem]">
                            <Wifi size={48} className="mx-auto text-white/5 animate-pulse" />
                            <p className="text-[11px] font-black uppercase tracking-[0.8em] text-white/10 italic">AWAITING_NEURAL_RESONANCE</p>
                        </div>
                     )}
                  </div>
               </div>

               <div className="space-y-16 pt-32 border-t border-white/10 relative overflow-hidden group">
                  <motion.div animate={{ x: [-200, 600] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} className="absolute h-1 w-full bg-gradient-to-r from-transparent via-[#ff6b2b]/30 to-transparent top-0" />
                  
                  <div className="flex justify-between items-end">
                      <div className="space-y-4">
                        <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-white/20 flex items-center gap-6 italic leading-none">
                            <Activity size={24} /> Matrix Health
                        </h3>
                        <p className="text-[10px] font-black text-[#ff6b2b] uppercase tracking-[0.4em] italic pl-[3.5rem] animate-pulse">OPTIMIZED_SWARM_STATE</p>
                      </div>
                      <div className="text-right">
                         <div className="text-5xl font-black italic tracking-tighter text-white">99.9%</div>
                         <div className="text-[9px] font-black uppercase tracking-widest text-white/10 mt-1">Uptime Global</div>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-12 pt-8">
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4">
                       <div className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">P2P Latency</div>
                       <div className="text-3xl font-black text-[#ff6b2b] italic tracking-tighter leading-none">8ms</div>
                    </div>
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4 flex flex-col justify-between">
                       <div className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">Grid Sync</div>
                       <div className="flex gap-1.5 items-end h-8">
                          {[0.7, 1, 0.8, 0.95, 0.6, 1, 0.75].map((h, i) => (
                            <motion.div key={i} animate={{ height: [`${h*100}%`, '100%', `${h*60}%`] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15 }} className="w-2 bg-[#ff6b2b]/30 rounded-full" />
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 43, 0.2); border-radius: 20px; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
