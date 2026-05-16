'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Home,
    Mail,
    Cpu,
    Database,
    ShieldCheck,
    BadgeCheck,
    ShieldAlert,
    ChevronRight,
    ChevronLeft,
    Target,
    Orbit,
    Gavel,
    Menu,
    X,
    MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 768;
            if (isMobile && isExpanded) {
                document.body.classList.add('no-scroll');
            } else {
                document.body.classList.remove('no-scroll');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            document.body.classList.remove('no-scroll');
        };
    }, [isExpanded]);

    useEffect(() => {
        const savedState = localStorage.getItem('omega_sidebar_status');
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1100;
        const isMobile = window.innerWidth < 768;
        
        let expanded = savedState === 'expanded';
        if (savedState === null) {
            expanded = !isTablet && !isMobile;
        }

        setIsExpanded(expanded);
        setIsMounted(true);
    }, []);

    const toggleSidebar = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        localStorage.setItem('omega_sidebar_status', newState ? 'expanded' : 'collapsed');
    };

    const navItems = [
        { icon: <Home size={24} />, label: 'Neural Core', href: '/', id: 'core' },
        { icon: <MessageSquare size={24} />, label: 'Diplomat Council', href: '/diplomat-council', highlight: true, id: 'diplomat' },
        { icon: <Mail size={24} />, label: 'Sovereign Mail', href: '/mail', id: 'mail' },
        { icon: <Gavel size={24} />, label: 'Governance (HIPs)', href: '/governance', id: 'gov' },
        { icon: <Orbit size={24} />, label: 'Neural Atlas', href: '/atlas', id: 'atlas' },
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
            {/* Desktop Sidebar */}
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
                        <div className="min-w-[56px] h-14 bg-muted border-2 border-primary/40 rounded-[1.2rem] shadow-[0_0_40px_rgba(var(--primary),0.2)] flex items-center justify-center font-black text-primary text-3xl italic group-hover:bg-primary group-hover:text-background transition-all duration-500 shadow-inner">
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
                                <span className="font-black tracking-tighter text-4xl text-foreground dark:text-foreground uppercase italic leading-none">OMEGA.</span>
                                <span className="text-[10px] font-black text-primary/80 dark:text-primary/60 uppercase tracking-[0.5em] italic mt-2 leading-none pl-1">v7.0 Registry</span>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </Link>
                </div>

                {/* ── NAVIGATION ── */}
                <nav className="flex-1 px-6 space-y-4 overflow-y-auto no-scrollbar relative z-10">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`flex items-center gap-8 p-5 rounded-[2.5rem] transition-all group relative overflow-hidden active:scale-95 ${isActive
                                        ? 'bg-primary/10 text-foreground dark:text-foreground shadow-inner border-2 border-primary/20 hover:bg-primary/15'
                                        : 'text-foreground/40 dark:text-muted-foreground/30 hover:bg-muted/5 dark:hover:bg-muted/10 hover:text-primary dark:hover:text-primary hover:shadow-[0_0_30px_rgba(var(--primary),0.1)]'
                                    }`}
                            >
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                <motion.div 
                                    whileHover={{ x: [0, -2, 2, 0] }}
                                    transition={{ duration: 0.2, repeat: Infinity }}
                                    className={`min-w-[28px] transition-all duration-500 relative z-10 ${isActive ? 'text-primary scale-110 drop-shadow-[0_0_15px_rgba(var(--primary),0.6)]' : 'group-hover:text-primary group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(var(--primary),0.4)]'}`}
                                >
                                    {React.cloneElement(item.icon as React.ReactElement, { strokeWidth: 3 })}
                                </motion.div>
                                <AnimatePresence>
                                {isExpanded && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="flex flex-col shrink-0 relative z-10"
                                    >
                                        <span className={`text-[12px] font-black uppercase tracking-[0.2em] italic leading-none pt-1 ${isActive ? 'text-foreground dark:text-foreground' : 'text-inherit'}`}>{item.label}</span>
                                        {item.clearance && (
                                            <span className="text-[9px] text-primary font-black uppercase tracking-[0.4em] italic mt-2 leading-none pl-1 animate-pulse">
                                                CLEARANCE_{item.clearance}
                                            </span>
                                        )}
                                    </motion.div>
                                )}
                                </AnimatePresence>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-8 bg-primary rounded-r-full shadow-[0_0_20px_hsl(var(--primary))] z-20" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* ── FOOTER / STATUS ── */}
                <div className="p-4 md:p-6 border-t-2 border-border dark:border-border bg-muted/[0.02] dark:bg-muted/10 space-y-4 relative z-10 mt-auto flex flex-col items-center">
                    <div className="w-full">
                        <UserMenu isExpanded={isExpanded} />
                    </div>
                    <div className={`flex w-full ${isExpanded ? 'justify-start px-2' : 'justify-center'}`}>
                        <ThemeToggle compact={!isExpanded} />
                    </div>
                    <Link
                        href="/monroe"
                        className={`flex items-center p-4 rounded-[2rem] bg-muted dark:bg-muted group cursor-pointer border-2 border-border dark:border-border hover:border-primary/40 transition-all w-full text-left relative overflow-hidden shadow-inner active:scale-95 ${
                            isExpanded ? 'gap-5' : 'justify-center'
                        }`}
                    >
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-[#7f2c14] border-2 border-primary/40 flex items-center justify-center text-background font-black text-xl uppercase italic shrink-0 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                            M
                        </div>
                        <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, x: -16, width: 0 }}
                                animate={{ opacity: 1, x: 0, width: 'auto' }}
                                exit={{ opacity: 0, x: -16, width: 0 }}
                                transition={{ duration: 0.35 }}
                                className="flex flex-col overflow-hidden shrink-0"
                            >
                                <span className="text-[11px] font-black text-foreground italic tracking-tighter uppercase leading-none whitespace-nowrap">Nexus Monroe.</span>
                                <span className="text-[9px] text-primary/80 font-black tracking-[0.4em] uppercase italic mt-1.5 leading-none pl-0.5 animate-pulse whitespace-nowrap">v7.0 Sentinel</span>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </Link>

                    <div className={`flex items-center gap-3 px-2 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                        {isExpanded && <span className="text-[10px] font-black uppercase tracking-[0.4em] italic text-foreground/30">Cluster Status_</span>}
                        <div className="flex items-center gap-2 text-primary">
                            <div className="w-2 h-2 rounded-full bg-primary animate-ping shrink-0" />
                            {isExpanded && <span className="text-[10px] font-black uppercase tracking-[0.3em] italic animate-pulse">Stable</span>}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Desktop Toggle Button */}
            <motion.button
                onClick={toggleSidebar}
                initial={false}
                animate={{ left: isExpanded ? 'calc(20rem - 1.25rem)' : 'calc(7rem - 1.25rem)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-14 z-[200] bg-background border-2 border-border rounded-full h-10 w-10 items-center justify-center text-foreground/30 hover:text-primary hover:border-primary/50 hover:scale-110 transition-colors shadow-2xl active:scale-95 hidden md:flex"
                aria-label={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
                {isExpanded ? <ChevronLeft size={20} strokeWidth={3} /> : <ChevronRight size={20} strokeWidth={3} />}
            </motion.button>

            {/* Mobile Navigation Header & Hamburger */}
            <div className="md:hidden">
                <div className="fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-2xl border-b-2 border-border z-[1000] flex items-center justify-between px-6 shadow-2xl">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-primary border-2 border-primary/20 rounded-xl flex items-center justify-center font-black text-background text-xl italic shadow-lg shadow-primary/30 group-active:scale-95 transition-transform">Ω</div>
                        <div className="flex flex-col">
                            <span className="font-black tracking-tighter text-2xl uppercase italic leading-none">OMEGA.</span>
                            <span className="text-[8px] font-black text-primary/60 tracking-[0.3em] uppercase italic mt-1">Sovereign Alpha</span>
                        </div>
                    </Link>
                    
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-14 h-14 bg-muted border-2 border-border rounded-2xl flex items-center justify-center text-primary shadow-inner active:scale-90 transition-all relative overflow-hidden"
                        aria-label={isExpanded ? 'Close Menu' : 'Open Menu'}
                    >
                        <AnimatePresence mode="wait">
                            {isExpanded ? (
                                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                    <X size={28} strokeWidth={3} />
                                </motion.div>
                            ) : (
                                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                                    <Menu size={28} strokeWidth={3} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {isExpanded && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsExpanded(false)}
                                className="fixed inset-0 z-[1100] bg-background/80 backdrop-blur-xl"
                            />
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm z-[1101] bg-background border-r-2 border-border shadow-[40px_0_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
                            >
                                {/* Drawer Header */}
                                <div className="p-8 pt-16 mb-2 shrink-0">
                                    <div className="flex flex-col">
                                        <span className="text-4xl font-black uppercase italic tracking-tighter text-foreground">Sovereign.</span>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic mt-2 flex items-center gap-3">
                                            Registry v7.0 <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Navigation Items - Scrollable Area */}
                                <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar pt-4 pb-20">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                                        return (
                                            <Link
                                                key={item.id}
                                                href={item.href}
                                                onClick={() => setIsExpanded(false)}
                                                className={`flex items-center gap-6 p-5 rounded-[2.2rem] transition-all active:scale-95 border-2 ${
                                                    isActive 
                                                        ? 'bg-primary/10 border-primary/20 text-foreground shadow-inner' 
                                                        : 'border-transparent text-muted-foreground/50 hover:bg-muted/5'
                                                }`}
                                            >
                                                <div className={`${isActive ? 'text-primary scale-110' : ''} shrink-0`}>
                                                    {React.cloneElement(item.icon as React.ReactElement, { size: 24, strokeWidth: 3 })}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-xs font-black uppercase tracking-[0.2em] italic leading-none truncate">{item.label}</span>
                                                    {item.clearance && <span className="text-[8px] text-primary font-black uppercase mt-1.5 tracking-widest italic animate-pulse">Lvl_{item.clearance}</span>}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Drawer Footer */}
                                <div className="p-6 bg-muted/10 border-t-2 border-border space-y-6 shrink-0 pb-10">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="p-1.5 bg-background border-2 border-border rounded-2xl shadow-inner shrink-0">
                                            <ThemeToggle compact />
                                        </div>
                                        <div className="flex-1 min-w-0 bg-background border-2 border-border rounded-2xl p-1.5 shadow-inner">
                                            <UserMenu isExpanded={true} />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-[9px] font-black uppercase tracking-[0.4em] italic text-muted-foreground/30">System_Status</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.4em] italic text-primary animate-pulse">Sync_Stable</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
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
                        padding-top: 5rem !important;
                    }
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .mask-fade-bottom {
                    mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
                }
            `}</style>
        </>
    );
};
