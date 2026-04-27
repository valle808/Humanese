'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Heart,
    FlaskConical,
    BadgeCheck,
    Home,
    Share2,
    Users,
    Target,
    ShieldAlert,
    ChevronRight,
    ChevronLeft,
    Activity,
    Globe,
    User,
    Mail,
    Zap,
    Cpu,
    Terminal,
    Database,
    ShieldCheck,
    Binary,
    Orbit,
    Wifi,
    Fingerprint,
    Gavel,
    Layers,
    Activity as ActivityIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const savedState = localStorage.getItem('omega_sidebar_status');
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1100;
        
        // Auto-collapse on tablet if no preference is set
        let expanded = savedState === 'expanded';
        if (savedState === null) {
            expanded = !isTablet;
        }

        setIsExpanded(expanded);
        setIsMounted(true);
        
        if (typeof window !== 'undefined' && window.innerWidth >= 768) {
            document.body.style.paddingLeft = expanded ? '20rem' : '7rem';
            document.body.style.transition = 'padding-left 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        localStorage.setItem('omega_sidebar_status', newState ? 'expanded' : 'collapsed');
        
        if (typeof window !== 'undefined' && window.innerWidth >= 768) {
            document.body.style.paddingLeft = newState ? '20rem' : '7rem';
        }
    };

    const navItems = [
        { icon: <Home size={24} />, label: 'Neural Core', href: '/', id: 'core' },
        { icon: <Mail size={24} />, label: 'Sovereign Mail', href: '/mail', highlight: true, id: 'mail' },
        { icon: <Gavel size={24} />, label: 'Governance (HIPs)', href: '/governance', id: 'gov' },
        { icon: <ActivityIcon size={24} />, label: 'Intelligence HQ', href: '/intelligence', id: 'intel' },
        { icon: <Target size={24} />, label: 'Skill Market', href: '/skill-market', id: 'skills' },
        { icon: <ShieldCheck size={24} />, label: 'Judicial Oversight', href: '/judiciary', id: 'judiciary' },
        { icon: <Cpu size={24} />, label: 'Fleet Systems', href: '/fleet', id: 'fleet' },
        { icon: <Search size={24} />, label: 'Optical Search', href: '/search', id: 'search' },
        { icon: <Database size={24} />, label: 'Vault Registry', href: '/wallet', id: 'vault' },
        { icon: <BadgeCheck size={24} />, label: 'Sovereign Aid', href: '/aid', id: 'aid' },
        {
            icon: <ShieldAlert size={24} />,
            label: 'Supreme Command',
            href: '/admin',
            clearance: 'OMEGA',
            id: 'admin'
        },
    ];

    if (!isMounted) return null;

    return (
        <>
            <motion.div
                initial={false}
                animate={{ width: isExpanded ? '20rem' : '7rem' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 h-screen z-[100] border-r-2 border-border bg-background/95 backdrop-blur-3xl flex flex-col hidden md:flex shadow-[40px_0_100px_rgba(0,0,0,0.1)] dark:shadow-[40px_0_100px_rgba(0,0,0,0.8)]"
            >
                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.02] dark:opacity-[0.05] mix-blend-overlay pointer-events-none" />


                {/* ── BRAND IDENTITY ── */}
                <div className="p-8 pt-12 mb-10 flex items-center gap-8 relative z-10">
                    <Link href="/" className="flex items-center gap-8 group">
                        <div className="min-w-[56px] h-14 bg-black border-2 border-[#ff6b2b]/40 rounded-[1.2rem] shadow-[0_0_40px_rgba(255,107,43,0.2)] flex items-center justify-center font-black text-[#ff6b2b] text-3xl italic group-hover:bg-[#ff6b2b] group-hover:text-black transition-all duration-500 shadow-inner">
                            Ω
                        </div>
                        <AnimatePresence mode="wait">
                        {isExpanded && (
                            <motion.div 
                                initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col shrink-0"
                            >
                                <span className="font-black tracking-tighter text-4xl text-foreground dark:text-white uppercase italic leading-none">OMEGA.</span>
                                <span className="text-[10px] font-black text-[#ff6b2b]/80 dark:text-[#ff6b2b]/60 uppercase tracking-[0.5em] italic mt-2 leading-none pl-1">v7.0 Registry</span>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </Link>
                </div>

                {/* ── NAVIGATION ── */}
                <nav className="flex-1 px-6 space-y-4 overflow-y-auto no-scrollbar relative z-10">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`flex items-center gap-8 p-5 rounded-[2.5rem] transition-all group relative overflow-hidden active:scale-95 ${isActive
                                        ? 'bg-[#ff6b2b]/10 text-foreground dark:text-white shadow-inner border-2 border-[#ff6b2b]/20 hover:bg-[#ff6b2b]/15'
                                        : 'text-foreground/40 dark:text-white/30 hover:bg-black/5 dark:hover:bg-white/[0.03] hover:text-foreground dark:hover:text-white'
                                    }`}
                            >
                                <div className={`min-w-[28px] transition-all duration-500 ${isActive ? 'text-[#ff6b2b] scale-110 drop-shadow-[0_0_10px_rgba(255,107,43,0.5)]' : 'group-hover:text-[#ff6b2b] group-hover:scale-110'}`}>
                                    {React.cloneElement(item.icon as React.ReactElement, { strokeWidth: 3 })}
                                </div>
                                <AnimatePresence>
                                {isExpanded && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="flex flex-col shrink-0"
                                    >
                                        <span className={`text-[12px] font-black uppercase tracking-[0.2em] italic leading-none pt-1 ${isActive ? 'text-foreground dark:text-white' : 'text-inherit'}`}>{item.label}</span>
                                        {item.clearance && (
                                            <span className="text-[9px] text-[#ff6b2b] font-black uppercase tracking-[0.4em] italic mt-2 leading-none pl-1 animate-pulse">
                                                CLEARANCE_{item.clearance}
                                            </span>
                                        )}
                                    </motion.div>
                                )}
                                </AnimatePresence>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-8 bg-[#ff6b2b] rounded-r-full shadow-[0_0_20px_#ff6b2b] z-20" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* ── FOOTER / STATUS ── */}
                <div className="p-8 border-t-2 border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.01] space-y-8 relative z-10 mt-auto">
                    <div className={`transition-all duration-300 flex items-center justify-center`}>
                        <ThemeToggle />
                    </div>

                    <Link
                        href="/monroe"
                        className="flex items-center gap-8 p-6 rounded-[2.5rem] bg-black dark:bg-black group cursor-pointer border-2 border-black/10 dark:border-white/5 hover:border-[#ff6b2b]/40 transition-all w-full text-left relative overflow-hidden shadow-inner active:scale-95"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff6b2b] to-[#7f2c14] border-2 border-[#ff6b2b]/40 flex items-center justify-center text-black font-black text-2xl uppercase italic shrink-0 group-hover:scale-110 transition-all duration-500 shadow-2xl scale-90">
                            M
                        </div>
                        <AnimatePresence>
                        {isExpanded && (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col shrink-0"
                            >
                                <span className="text-[12px] font-black text-white italic tracking-tighter uppercase leading-none">Nexus Monroe.</span>
                                <span className="text-[9px] text-[#ff6b2b]/80 dark:text-[#ff6b2b]/60 font-black tracking-[0.4em] uppercase italic mt-2 leading-none pl-1 animate-pulse">v7.0 Sentinel</span>
                            </motion.div>
                        )}
                        </AnimatePresence>
                        <div className="absolute top-[-10px] right-[-10px] p-6 opacity-[0.05] group-hover:rotate-12 group-hover:scale-125 transition-all">
                             <Zap size={60} className="text-[#ff6b2b]" />
                        </div>
                    </Link>

                    <div className="flex flex-col gap-4 px-4">
                         <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.4em] italic text-foreground/30 dark:text-white/20 group">
                             {isExpanded && <span className="group-hover:text-foreground/50 dark:group-hover:text-white/40 transition-colors">Cluster Status_</span>}
                             <div className="flex items-center gap-4 text-[#ff6b2b]">
                                <div className="w-2 h-2 rounded-full bg-[#ff6b2b] animate-ping" />
                                {isExpanded && <span className="animate-pulse">Stable</span>}
                             </div>
                         </div>
                    </div>
                </div>
            </motion.div>

            {/* ── SIDEBAR TOGGLE BUTTON — outside sidebar to avoid clipping ── */}
            <motion.button
                onClick={toggleSidebar}
                initial={false}
                animate={{ left: isExpanded ? 'calc(20rem - 1.25rem)' : 'calc(7rem - 1.25rem)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-14 z-[200] bg-background border-2 border-border rounded-full h-10 w-10 items-center justify-center text-foreground/30 hover:text-[#ff6b2b] hover:border-[#ff6b2b]/50 hover:scale-110 transition-colors shadow-2xl active:scale-95 hidden md:flex"
                aria-label={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
                {isExpanded ? <ChevronLeft size={20} strokeWidth={3} /> : <ChevronRight size={20} strokeWidth={3} />}
            </motion.button>

            {/* Mobile Navigation Dock */}
            <div className="md:hidden fixed bottom-4 left-4 right-4 z-[1000]">
                <div className="bg-background/95 backdrop-blur-3xl border-2 border-border rounded-[3.5rem] flex justify-around items-center p-4 max-w-sm mx-auto shadow-[0_40px_100px_rgba(0,0,0,0.3)] dark:shadow-[0_40px_100px_rgba(0,0,0,1)] shadow-inner">
                    {navItems.slice(0, 6).map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`transition-all p-4 rounded-[2rem] active:scale-90 ${isActive ? 'text-[#ff6b2b] bg-[#ff6b2b]/10 shadow-[0_0_20px_rgba(255,107,43,0.3)] border-2 border-[#ff6b2b]/20' : 'text-foreground/40 dark:text-white/30 hover:text-foreground dark:hover:text-white'}`}
                                aria-label={item.label}
                            >
                                {React.cloneElement(item.icon as React.ReactElement, { size: 24, strokeWidth: 3 })}
                            </Link>
                        );
                    })}
                    <div className="flex items-center justify-center pl-2">
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media (min-width: 768px) {
                    body {
                        padding-left: ${isExpanded ? '20rem' : '7rem'} !important;
                        transition: padding-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
                    }
                }
                @media (max-width: 767px) {
                    body {
                        padding-bottom: 9rem !important;
                    }
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </>
    );
};
