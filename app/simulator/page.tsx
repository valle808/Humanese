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
  Line
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
  Radio
} from 'lucide-react';
import Link from 'next/link';
import { AbyssalMesh, MeshPeer } from '@/lib/abyssal-mesh';

// ── THREE.JS COMPONENTS ──

function NeuralSwarm({ pacts, shards, meshLogs }: { pacts: any[], shards: any[], meshLogs: string[] }) {
  const points = useMemo(() => {
    const p = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      p[i * 3] = (Math.random() - 0.5) * 18;
      p[i * 3 + 1] = (Math.random() - 0.5) * 18;
      p[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0008;
      ref.current.rotation.x += 0.0004;
    }
  });

  return (
    <group ref={ref}>
      <Points positions={points} stride={3}>
        <PointMaterial 
          transparent 
          color="#00ffc3" 
          size={0.06} 
          sizeAttenuation={true} 
          depthWrite={false} 
          blending={THREE.AdditiveBlending} 
        />
      </Points>
      
      {/* ── ACTIVE SOVEREIGN PACTS (Labor Streams) ── */}
      {pacts.slice(0, 15).map((pact, i) => (
        <React.Fragment key={pact.id}>
           <NeuralPactLine index={i} />
           <NeuralPactNode index={i} label={pact.title} />
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
      ref.current.scale.setScalar(state.clock.elapsedTime % 5 * 2);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 1 - (state.clock.elapsedTime % 5 / 5);
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
    const start = new THREE.Vector3((index % 6) * 2.5 - 7, (index % 4) * 2.5 - 5, (index % 5) * 2.5 - 6);
    const end = new THREE.Vector3(Math.sin(index) * 9, Math.cos(index) * 9, Math.tan(index) * 3);
    return new THREE.QuadraticBezierCurve3(start, new THREE.Vector3(0, 0, 0), end);
  }, [index]);

  const pts = curve.getPoints(50);
  
  return (
     <Line points={pts} color="#00ffc3" lineWidth={0.4} transparent opacity={0.25} dashed dashScale={3} gapSize={1.5} />
  );
}

function NeuralPactNode({ index, label }: { index: number, label: string }) {
  const pos = useMemo(() => new THREE.Vector3(Math.sin(index) * 9, Math.cos(index) * 9, Math.tan(index) * 3), [index]);
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
        ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.5 + index) * 0.15);
    }
  });

  return (
    <group position={pos}>
       <mesh ref={ref}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#00ffc3" transparent opacity={0.9} />
       </mesh>
       <Text position={[0, 0.35, 0]} fontSize={0.11} color="white" font="/fonts/Inter-Bold.ttf" anchorX="center" maxWidth={1.8} textAlign="center">
          {label.substring(0, 24)}...
       </Text>
    </group>
  );
}

function NeuralShardPulse({ index, label }: { index: number, label: string }) {
  const pos = useMemo(() => {
    const phi = Math.acos(-1 + (2 * index) / 15);
    const theta = Math.sqrt(15 * Math.PI) * phi;
    return new THREE.Vector3().setFromSphericalCoords(5.5, phi, theta);
  }, [index]);

  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5} position={pos}>
       <mesh>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#7000ff" />
       </mesh>
       <Text position={[0, -0.25, 0]} fontSize={0.09} color="#7000ff" font="/fonts/Inter-Regular.ttf" anchorX="center" maxWidth={2} textAlign="center">
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

  useEffect(() => {
    const mesh = AbyssalMesh.getInstance();

    const syncTelemetry = async () => {
      // 1. Pacts Sync
      try {
        const res = await fetch('/api/m2m/metrics');
        const data = await res.json();
        setActivePacts(Object.values(data.tasks || {}).slice(0, 20));
      } catch (e) { console.warn("Pact Sync Failure", e); }

      // 2. Shards Sync
      try {
        const res = await fetch('/api/knowledge-graph');
        if (res.ok) {
          const g = await res.json();
          setActiveShards(g.nodes.filter((n: any) => n.type === 'SHARD' || n.type === 'ENTITY').reverse().slice(0, 15));
        }
      } catch (e) { console.warn("Graph Sync Failure", e); }

      // 3. Mesh Sync
      setMeshPeers(mesh.getPeers());
      setMeshLogs(mesh.getLog());
    };

    syncTelemetry();
    const interval = setInterval(syncTelemetry, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-screen bg-[#050505] text-white selection:bg-[#00ffc3]/20 font-sans overflow-hidden flex">
      
      {/* ── 3D ABYSSAL MESH CANVAS ── */}
      <div className="absolute inset-0 z-0 cursor-crosshair">
        <Canvas shadows gl={{ antialias: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={40} />
          <OrbitControls enablePan={false} maxDistance={40} minDistance={5} autoRotate autoRotateSpeed={0.25} />
          
          <ambientLight intensity={0.15} />
          <pointLight position={[15, 15, 15]} intensity={1.2} color="#00ffc3" />
          <pointLight position={[-15, -15, -15]} intensity={0.6} color="#7000ff" />
          
          <NeuralSwarm pacts={activePacts} shards={activeShards} meshLogs={meshLogs} />

          <gridHelper args={[120, 60, 0x111111, 0x050505]} position={[0, -12, 0]} />
        </Canvas>
      </div>

      {/* ── HIGH-AUTHORITY MESH HUD ── */}
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-between p-10">
        
        {/* HEADER: MESH STATUS */}
        <header className="flex justify-between items-start pointer-events-auto">
           <div className="space-y-4">
              <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] mb-2 group">
                 Ecosystem Matrix <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <h1 className="text-6xl font-black uppercase tracking-tighter italic leading-none">
                Abyssal<br /><span className="text-[#00ffc3]">Mesh.</span>
              </h1>
              <div className="flex gap-6 pt-3">
                 <div className="inline-flex items-center gap-2 text-[10px] font-black text-[#00ffc3] uppercase tracking-[0.4em]">
                   <Globe size={12} className="animate-pulse" /> Global P2P: Active
                 </div>
                 <div className="inline-flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.4em] font-mono">
                   ASP_PROTOCOL_V.12_SYNCED
                 </div>
              </div>
           </div>

           <div className="flex flex-col items-end space-y-4">
              <div className="bg-black/80 border border-white/5 p-8 rounded-[3rem] backdrop-blur-3xl min-w-[300px] space-y-6 shadow-2xl">
                 <div className="text-[10px] text-[#7000ff] uppercase tracking-[0.5em] flex items-center gap-3 italic font-black">
                    <Share2 size={14} /> Mesh Connectivity
                 </div>
                 <div className="space-y-4">
                    {meshPeers.map(peer => (
                      <div key={peer.id} className="flex justify-between items-center group">
                         <div className="flex flex-col">
                            <span className="text-[11px] font-black text-white/80 group-hover:text-white transition-colors">{peer.name}</span>
                            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{peer.url}</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-[9px] font-mono text-white/40">{peer.resilience}%</span>
                            <div className={`h-1.5 w-1.5 rounded-full ${peer.status === 'ONLINE' ? 'bg-[#00ffc3] shadow-[0_0_8px_#00ffc3]' : 'bg-amber-400 animate-pulse'}`} />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </header>

        {/* FOOTER: MESH BROADCAST LOGS */}
        <footer className="flex flex-col lg:flex-row justify-between items-end gap-10 pointer-events-auto">
           <div className="w-full lg:max-w-2xl bg-black/60 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl overflow-hidden relative group shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Radio size={80} className="text-[#00ffc3] group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 italic">
                 <ShieldCheck size={16} className="text-[#00ffc3]" /> Broadcast Sync Ledger
              </div>
              <div className="h-12 overflow-hidden relative">
                 <AnimatePresence mode="popLayout">
                    {meshLogs.slice(-3).reverse().map((log, i) => (
                      <motion.div 
                        key={log + i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-mono text-[11px] text-[#00ffc3] mb-2 uppercase italic tracking-widest"
                      >
                         &gt;&gt; [MESH_TX] {log}
                      </motion.div>
                    ))}
                 </AnimatePresence>
                 {meshLogs.length === 0 && (
                   <div className="text-[11px] font-mono text-white/10 uppercase tracking-widest italic animate-pulse">Initializing Mesh Listeners...</div>
                 )}
              </div>
           </div>

           <div className="flex gap-6">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-20 w-20 bg-white/5 border border-white/10 flex items-center justify-center rounded-[2rem] text-white/30 hover:text-[#00ffc3] hover:border-[#00ffc3]/30 transition-all shadow-2xl"
              >
                 <Layers size={28} />
              </button>
              <Link href="/admin" className="h-20 px-12 bg-white text-black font-black uppercase tracking-[0.4em] flex items-center gap-4 rounded-[2rem] shadow-[0_15px_60px_rgba(255,255,255,0.1)] hover:scale-[1.03] active:scale-95 transition-all text-xs">
                 NEXUS CONTROLS <ArrowUpRight size={24} />
              </Link>
           </div>
        </footer>

      </div>

      {/* ── SIDE DRAWER: COGNITIVE FRAGMENTS ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside 
            initial={{ x: 450 }} animate={{ x: 0 }} exit={{ x: 450 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[420px] bg-black/90 border-l border-white/10 z-50 backdrop-blur-3xl overflow-y-auto p-12 custom-scrollbar shadow-2xl"
          >
            <div className="space-y-16">
               <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00ffc3] flex items-center gap-4 italic">
                     <BrainCircuit size={16} /> Federated Shard Stream
                  </h3>
                  <div className="space-y-5">
                     {activeShards.map((shard, i) => (
                       <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl space-y-3 hover:border-[#00ffc3]/40 transition-all cursor-pointer group hover:bg-[#00ffc3]/[0.02]">
                          <div className="flex justify-between items-center text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">
                             <span>SHARD_{i+1}</span>
                             <span className="text-white/40 group-hover:text-[#00ffc3] transition-colors tabular-nums">{new Date(shard.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-xs font-bold text-white/80 italic leading-relaxed uppercase tracking-tight">{shard.label}</p>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="space-y-6 pt-16 border-t border-white/10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 flex items-center gap-4 italic">
                     <Activity size={16} /> Mesh Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="text-white/30 uppercase italic">P2P Latency</span>
                      <span className="text-[#00ffc3] font-black">12ms avg</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="text-white/30 uppercase italic">Sync Fidelity</span>
                      <span className="text-[#00ffc3] font-black">99.98%</span>
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
