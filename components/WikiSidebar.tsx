'use client';

import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { TocItem } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Globe, Database, Shield, Zap, Target, Binary, Target as TargetIcon } from 'lucide-react';

interface WikiSidebarProps {
  toc: TocItem[];
  title?: string;
  activeSection?: string;
}

export function WikiSidebar({ toc, title, activeSection }: WikiSidebarProps) {
  const [clickedSection, setClickedSection] = useState<string>('');

  useEffect(() => {
    if (activeSection) {
      setClickedSection(activeSection);
    }
  }, [activeSection]);

  const handleTitleClick = () => {
    setClickedSection('top');
    const h1Elements = document.querySelectorAll('h1');
    if (h1Elements.length > 0) {
      h1Elements[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSectionClick = (anchor: string) => {
    setClickedSection(anchor);
  };

  return (
    <div className="h-full w-full bg-[#050505]/40 backdrop-blur-3xl border-l border-white/5 relative group">
      <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
      
      <ScrollArea className="h-screen py-16 px-10">
        <div className="space-y-12">
            {/* ── HEADER ── */}
            <div className="space-y-4">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#ff6b2b] italic">
                   <TargetIcon size={12} strokeWidth={3} /> Contents_
                </div>
                {title && (
                    <button
                      onClick={handleTitleClick}
                      className={cn(
                        'text-2xl font-black italic tracking-tighter uppercase transition-colors text-left leading-none pt-1',
                        clickedSection === 'top' ? 'text-white' : 'text-white/20 hover:text-white'
                      )}
                    >
                      {title}<span className="text-[#ff6b2b]">.</span>
                    </button>
                )}
            </div>

            {/* ── NAVIGATION ── */}
            <nav className="pb-64">
              {toc.length === 0 ? (
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/5 italic">No clusters found_</p>
              ) : (
                <ul className="space-y-2">
                  {toc.map((item) => (
                    <TocItemComponent
                      key={item.anchor}
                      item={item}
                      clickedSection={clickedSection}
                      onSectionClick={handleSectionClick}
                      depth={0}
                    />
                  ))}
                </ul>
              )}
            </nav>
        </div>
      </ScrollArea>
      
      <div className="absolute bottom-10 left-10 flex items-center gap-4">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b2b] animate-ping" />
          <span className="text-[9px] font-black text-white/5 uppercase tracking-[0.4em] italic">Real-Time Sync Stable</span>
      </div>
    </div>
  );
}

interface TocItemComponentProps {
  item: TocItem;
  clickedSection: string;
  onSectionClick: (anchor: string) => void;
  depth?: number;
}

function TocItemComponent({ item, clickedSection, onSectionClick, depth = 0 }: TocItemComponentProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = clickedSection === item.anchor;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSectionClick(item.anchor);
    
    const element = document.getElementById(item.anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <li className="space-y-2">
      <a
        href={`#${item.anchor}`}
        onClick={handleClick}
        className={cn(
          'group flex items-center gap-4 py-2 transition-all relative',
          isActive ? 'text-white' : 'text-white/20 hover:text-white',
          depth > 0 && 'ml-6 border-l border-white/5 pl-6'
        )}
      >
        <AnimatePresence>
        {isActive && (
            <motion.div 
                layoutId="active-indicator"
                className="absolute left-[-2px] w-[3px] h-full bg-[#ff6b2b] shadow-[0_0_10px_#ff6b2b]"
            />
        )}
        </AnimatePresence>
        
        <span className={cn(
            'text-[12px] font-black uppercase tracking-tight italic leading-none pt-0.5 transition-all',
            isActive ? 'scale-110 translate-x-1' : 'group-hover:translate-x-1'
        )}>
            {item.title}
        </span>
      </a>
      
      {hasChildren && (
        <ul className="space-y-2">
          {item.children.map((child) => (
            <TocItemComponent
              key={child.anchor}
              item={child}
              clickedSection={clickedSection}
              onSectionClick={onSectionClick}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
