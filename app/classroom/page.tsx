"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { Users, BookOpen, Brain, Sparkles, CheckCircle, Plus, ThumbsUp, Send } from "lucide-react";

export default function ClassroomPage() {
  const { user } = useAuth();
  const router = useRouter();

  // State
  const [memories, setMemories] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [proposal, setProposal] = useState({ id: "", content: "", status: "DRAFT", updatedBy: "System" });
  
  const [newMemory, setNewMemory] = useState("");
  const [newSuggestion, setNewSuggestion] = useState("");
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.push("/login");
      return;
    }
    
    if (user) {
      fetchData();
    }
  }, [user, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, sRes, pRes] = await Promise.all([
        fetch("/api/classroom/memories"),
        fetch("/api/classroom/suggestions"),
        fetch("/api/classroom/proposal")
      ]);
      
      const mData = await mRes.json();
      const sData = await sRes.json();
      const pData = await pRes.json();
      
      setMemories(mData);
      setSuggestions(sData);
      setProposal(pData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemory.trim()) return;
    
    const res = await fetch("/api/classroom/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMemory, authorName: user?.name || "Unknown" })
    });
    
    if (res.ok) {
      setNewMemory("");
      fetchData();
    }
  };

  const addSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuggestion.trim()) return;
    
    const res = await fetch("/api/classroom/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSuggestion, suggestedBy: user?.name || "Unknown" })
    });
    
    if (res.ok) {
      setNewSuggestion("");
      fetchData();
    }
  };

  const toggleVote = async (suggestionId: string) => {
    const res = await fetch("/api/classroom/suggestions/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suggestionId, userId: user?.id })
    });
    
    if (res.ok) {
      fetchData();
    }
  };

  const saveProposal = async () => {
    const res = await fetch("/api/classroom/proposal", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: proposal.id, content: proposal.content, updatedBy: user?.name })
    });
    if (res.ok) {
      alert("Propuesta guardada correctamente.");
    }
  };

  if (!user || loading) {
    return (
      <main className="min-h-screen pt-32 pb-16 flex items-center justify-center px-4">
        <div className="animate-pulse text-[#ff5500]">Cargando entorno virtual...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <header className="mb-10 text-center md:text-left animate-fadeInUp">
        <h1 className="text-3xl md:text-5xl font-black text-white flex items-center justify-center md:justify-start gap-4">
          <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-[#ff5500]" />
          Aula Virtual (Proyecto de IA)
        </h1>
        <p className="mt-2 text-[rgba(255,255,255,0.6)] max-w-2xl text-sm md:text-base mx-auto md:mx-0">
          Espacio colaborativo para la materia. Aquí desarrollaremos la Propuesta de una Solución de IA con enfoque empresarial.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Memories & Suggestions */}
        <div className="lg:col-span-1 space-y-8 animate-fadeInUp" style={{ animationDelay: "100ms" }}>
          
          {/* Monroe Memories */}
          <section className="p-6 rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[rgba(15,15,25,0.4)] backdrop-blur-md">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-400" />
              Memoria de Monroe
            </h2>
            <p className="text-xs text-[rgba(255,255,255,0.5)] mb-4">
              Registro histórico y pensamientos compartidos para nuestro IA local.
            </p>
            
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-2 custom-scrollbar">
              {memories.length === 0 ? (
                <div className="text-xs text-center text-[rgba(255,255,255,0.3)] py-4">No hay memorias aún.</div>
              ) : (
                memories.map((m) => (
                  <div key={m.id} className="p-3 bg-[rgba(255,255,255,0.03)] rounded-lg text-xs border border-[rgba(255,255,255,0.05)]">
                    <p className="text-[rgba(255,255,255,0.8)]">"{m.content}"</p>
                    <p className="text-[#ff5500] mt-2 font-bold opacity-80">- {m.authorName}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={addMemory} className="relative">
              <input 
                type="text" 
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                placeholder="Añadir una memoria..."
                className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-lg py-2 pl-3 pr-10 text-xs text-white focus:outline-none focus:border-purple-400"
              />
              <button type="submit" className="absolute right-2 top-2 text-purple-400 hover:text-purple-300">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </section>

          {/* Project Suggestions */}
          <section className="p-6 rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[rgba(15,15,25,0.4)] backdrop-blur-md">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Ideas de Proyecto
            </h2>
            
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-2 custom-scrollbar">
              {suggestions.map((s) => {
                const hasVoted = s.votes.some((v: any) => v.userId === user?.id);
                return (
                  <div key={s.id} className="p-3 bg-[rgba(255,255,255,0.03)] rounded-lg text-xs border border-[rgba(255,255,255,0.05)] flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{s.name}</p>
                      <p className="text-[rgba(255,255,255,0.4)] text-[10px]">por {s.suggestedBy}</p>
                    </div>
                    <button 
                      onClick={() => toggleVote(s.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${hasVoted ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      {s.votes.length}
                    </button>
                  </div>
                );
              })}
            </div>

            <form onSubmit={addSuggestion} className="relative">
              <input 
                type="text" 
                value={newSuggestion}
                onChange={(e) => setNewSuggestion(e.target.value)}
                placeholder="Sugerir idea..."
                className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-lg py-2 pl-3 pr-10 text-xs text-white focus:outline-none focus:border-yellow-400"
              />
              <button type="submit" className="absolute right-2 top-2 text-yellow-400 hover:text-yellow-300">
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </section>

        </div>

        {/* Right Column: Project Proposal Editor */}
        <div className="lg:col-span-2 animate-fadeInUp" style={{ animationDelay: "200ms" }}>
          <section className="p-6 h-full min-h-[500px] rounded-2xl border border-[rgba(255,85,0,0.2)] bg-[rgba(15,15,25,0.6)] backdrop-blur-md flex flex-col shadow-[0_0_50px_rgba(255,85,0,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-[#ff5500]" />
                Propuesta Colaborativa
              </h2>
              <span className="px-3 py-1 bg-[#ff5500]/20 text-[#ff5500] text-xs font-bold rounded-full uppercase tracking-wider">
                {proposal?.status || "DRAFT"}
              </span>
            </div>
            
            <p className="text-xs text-[rgba(255,255,255,0.5)] mb-6">
              Edita el documento en conjunto. Última modificación por <strong className="text-white">{proposal?.updatedBy}</strong>.
            </p>

            <textarea 
              value={proposal?.content}
              onChange={(e) => setProposal({ ...proposal, content: e.target.value })}
              className="flex-1 w-full bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 text-sm text-[rgba(255,255,255,0.9)] focus:outline-none focus:border-[#ff5500]/50 resize-none font-mono"
              placeholder="Escribe la propuesta aquí..."
            ></textarea>

            <div className="mt-4 flex justify-end">
              <button 
                onClick={saveProposal}
                className="btn-primary border-[#ff5500] flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Guardar Propuesta
              </button>
            </div>
          </section>
        </div>

      </div>
    </main>
  );
}
