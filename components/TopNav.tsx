"use client";

import React from "react";
import { SearchBar } from "@/components/SearchBar";
import { BrandShader } from "@/components/BrandShader";
import { Download, Copy, Zap, Terminal, Activity, Globe, Heart, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GitHubStarButton } from "@/components/GitHubStarButton";
import { DiscordButton } from "@/components/DiscordButton";
import Link from "next/link";
import { motion } from "framer-motion";

interface TopNavProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  showSearch?: boolean;
  showExport?: boolean;
  onExport?: () => void;
  onCopyMarkdown?: () => void;
}

export function TopNav({ onSearch, isLoading, showSearch = true, showExport = false, onExport, onCopyMarkdown }: TopNavProps) {
  return (
    <div className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-3xl border-b-2 border-white/5 transition-all duration-500">
      <div className="max-w-[1800px] mx-auto px-8 lg:px-12 py-5">
        <div className="flex items-center justify-between gap-12">
          {/* ── LEFT: BRAND & NAV ── */}
          <div className="flex items-center gap-12 shrink-0">
            <Link
              href="/"
              className="group flex items-center gap-6 hover:opacity-100 transition-all cursor-pointer"
            >
              <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                <BrandShader size="small" />
              </div>
              <span className="font-black tracking-tighter text-4xl leading-none text-white italic group-hover:text-[#ff6b2b] transition-colors uppercase">
                Hpedia<span className="text-[#ff6b2b]">.</span>
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
                <Link
                  href="/skill-market"
                  className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-[#ff6b2b] transition-all bg-white/[0.03] border-2 border-white/5 hover:border-[#ff6b2b]/40 px-6 py-2.5 rounded-full italic leading-none active:scale-95"
                >
                  <Zap size={14} className="group-hover:animate-pulse" strokeWidth={3} /> Skill Market
                </Link>
                <Link
                  href="/research"
                  className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all italic leading-none active:scale-95"
                >
                  Research
                </Link>
                <Link
                  href="/intelligence"
                  className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all italic leading-none active:scale-95"
                >
                  Intelligence
                </Link>
            </nav>
          </div>

          {/* ── CENTER: SEARCH ── */}
          {showSearch && (
            <div className="flex-1 max-w-3xl hidden md:block group">
              <SearchBar onSearch={onSearch} isLoading={isLoading} variant="nav" />
            </div>
          )}

          {/* ── RIGHT: ACTIONS ── */}
          <div className="flex items-center justify-end gap-6 shrink-0">
            {showExport && (
              <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-2 rounded-2xl">
                <div className="hidden lg:flex items-center gap-2">
                   <DiscordButton />
                   <GitHubStarButton />
                </div>
                
                <div className="h-6 w-px bg-white/5 mx-2 hidden lg:block" />
                
                {onCopyMarkdown && (
                  <button
                    aria-label="Copy Shard"
                    onClick={onCopyMarkdown}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/20 hover:text-[#ff6b2b] hover:border-[#ff6b2b]/40 transition-all active:scale-95"
                  >
                    <Copy className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                )}
                {onExport && (
                  <button
                    aria-label="Export Buffer"
                    onClick={onExport}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/20 hover:text-[#ff6b2b] hover:border-[#ff6b2b]/40 transition-all active:scale-95"
                  >
                    <Download className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                )}
              </div>
            )}
            
            <Link href="/wallet" className="h-14 w-14 rounded-2xl bg-black border-2 border-white/5 flex items-center justify-center text-white/10 hover:text-[#ff6b2b] hover:border-[#ff6b2b]/40 transition-all shadow-inner group active:scale-95">
               <ShieldCheck size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* ── SCANNER LINE ── */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff6b2b]/40 to-transparent" />
    </div>
  );
}
