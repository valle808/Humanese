"use client";

import { SearchBar } from "@/components/SearchBar";
import { BrandShader } from "@/components/BrandShader";
import { Download, Copy } from "lucide-react";
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

export function TopNav({ onSearch, isLoading, showSearch = true, showExport = false, onExport, onCopyMarkdown }: TopNavProps) {
  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6 min-w-[220px]">
            <a
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="flex-shrink-0">
                <BrandShader size="small" />
              </div>
              <span className="font-bold tracking-tighter" style={{ fontSize: '180%', lineHeight: '100%', color: 'var(--primary)' }}>Humanese</span>
            </a>
            {/* Hpedia Nav Link */}
            <a
              href="/hpedia"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap border border-border hover:border-primary/50 px-3 py-1.5 rounded-full"
            >
              <span>📚</span> Hpedia
            </a>
            {/* Skill Market Nav Link */}
            <a
              href="/skill-market"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap border border-border hover:border-primary/50 px-3 py-1.5 rounded-full"
            >
              <span>⚡</span> Skill Market
            </a>
          </div>

          {/* Center: Search */}
          {showSearch && (
            <div className="flex-1 max-w-xl">
              <SearchBar onSearch={onSearch} isLoading={isLoading} variant="nav" />
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-2 min-w-[220px]">
            {showExport && (
              <>
                <DiscordButton />
                <GitHubStarButton />
                {onCopyMarkdown && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Copy as Markdown"
                    onClick={onCopyMarkdown}
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                )}
                {onExport && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Export to PDF"
                    onClick={onExport}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
