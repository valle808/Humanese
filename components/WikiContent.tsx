'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import type { WikiSection } from '@/lib/types';
import { processMarkdownWithReferences } from '@/lib/reference-formatter';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Globe, Database, Shield, Zap, Search } from 'lucide-react';

interface WikiContentProps {
  sections: WikiSection[];
  rawMarkdown?: string;
  onSectionChange?: (sectionId: string) => void;
  sourceUrl?: string;
}

export function WikiContent({ sections, rawMarkdown, onSectionChange, sourceUrl }: WikiContentProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], [data-section-id]');
      let currentSection = '';

      headings.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 0) {
          currentSection = element.getAttribute('id') || element.getAttribute('data-section-id') || '';
        }
      });

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
        onSectionChange?.(currentSection);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, onSectionChange]);

  const processedContent = useMemo(() => {
    if (!rawMarkdown) return null;
    const { content } = processMarkdownWithReferences(rawMarkdown);
    return content;
  }, [rawMarkdown]);

  const contentLayout = (
    <div className="max-w-6xl mx-auto px-12 lg:px-20 pt-10 pb-32 relative">
      <div className="absolute left-[-100px] top-0 bottom-0 w-px bg-gradient-to-b from-white/5 via-[#ff6b2b]/5 to-transparent hidden xl:block" />
      
      {processedContent ? (
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="wiki-content"
        >
          <MarkdownRenderer content={processedContent} baseUrl={sourceUrl} />
        </motion.div>
      ) : (
        <div className="space-y-24">
          {sections.length === 0 ? (
            <div className="text-center py-40 space-y-10 group">
              <div className="relative inline-block">
                 <Search className="h-24 w-24 text-white/5 mx-auto group-hover:text-[#ff6b2b]/20 transition-colors" strokeWidth={1} />
                 <div className="absolute inset-0 bg-[#ff6b2b]/5 blur-[40px] rounded-full animate-pulse" />
              </div>
              <div className="space-y-4">
                  <p className="text-2xl font-black uppercase tracking-[0.5em] text-white/10 italic">No resonance clusters found.</p>
                  <p className="text-[10px] text-white/5 font-black uppercase tracking-[0.4em] italic leading-none pl-1">Initiate Registry Sync_</p>
              </div>
            </div>
          ) : (
            <div className="space-y-32">
              {sections.map((section, idx) => (
                <SectionRenderer key={section.id} section={section} index={idx} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full relative overflow-x-hidden">
        {contentLayout}
    </div>
  );
}

interface SectionRendererProps {
  section: WikiSection;
  index: number;
}

function SectionRenderer({ section, index }: SectionRendererProps) {
  const HeadingTag = `h${section.level}` as keyof JSX.IntrinsicElements;

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.1 }}
      data-section-id={section.anchor}
      id={section.anchor}
      className="scroll-mt-40 wiki-content group/section"
    >
      <div className="relative">
          <div className="absolute -left-20 top-2 text-[10px] font-black text-[#ff6b2b]/10 tracking-widest italic group-hover/section:text-[#ff6b2b]/40 transition-colors hidden xl:block">
             0{index + 1}_
          </div>
          <HeadingTag className={`font-black uppercase italic tracking-tighter mb-10 transition-colors ${
            section.level === 2 ? 'text-8xl text-white group-hover/section:text-[#ff6b2b] pt-1 leading-none' : 
            section.level === 3 ? 'text-5xl text-white/60 group-hover/section:text-white pt-1 leading-none' : 
            'text-3xl text-[#ff6b2b] pt-1 leading-none'
          }`}>
            {section.title}
          </HeadingTag>
      </div>

      {section.content && (
        <div className="mb-12">
          <MarkdownRenderer content={section.content} />
        </div>
      )}
      
      {section.subsections && section.subsections.length > 0 && (
        <div className="ml-12 lg:ml-20 space-y-24 border-l-2 border-[#ff6b2b]/5 pl-12 lg:pl-20 mt-20">
          {section.subsections.map((subsection, subIdx) => (
            <SectionRenderer key={subsection.id} section={subsection} index={subIdx} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
