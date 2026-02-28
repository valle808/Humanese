"use client";

import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { BrandShader } from "@/components/BrandShader";
import { Download, Copy, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GitHubStarButton } from "@/components/GitHubStarButton";
import { DiscordButton } from "@/components/DiscordButton";

interface TopNavProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  showSearch?: boolean;
  showExport?: boolean;
  onExport?: () => void;
  onCopyMarkdown?: () => void;
}

export function TopNav({
  onSearch,
  isLoading,
  showSearch = true,
  showExport = false,
  onExport,
  onCopyMarkdown
}: TopNavProps) {
  return (
    <div className="sticky top-0 z-40 w-full bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-sm bg-primary/40 animate-pulse" />
            </div>
            <span className="font-bold text-xl tracking-tighter uppercase text-white">Humanese</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/hpedia"
              className="text-white/50 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span className="opacity-50 text-xs">📚</span> HPEDIA
            </Link>
            <Link
              href="/skill-market"
              className="text-white/50 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span className="opacity-50 text-xs">⚡</span> SKILL MARKET
            </Link>
          </nav>
        </div>

        {/* Center: Search (Conditionally shown) */}
        {showSearch && (
          <div className="flex-1 max-w-xl">
            <SearchBar onSearch={onSearch} isLoading={isLoading} variant="nav" />
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <DiscordButton />
            <GitHubStarButton />
          </div>

          {showExport && (
            <div className="flex items-center gap-2 pl-4 border-l border-white/10">
              {onCopyMarkdown && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-white/40 hover:text-white hover:bg-white/10"
                  onClick={onCopyMarkdown}
                  title="Copy Markdown"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
              {onExport && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-white/40 hover:text-white hover:bg-white/10"
                  onClick={onExport}
                  title="Export PDF"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
