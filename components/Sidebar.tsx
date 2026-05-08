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
import { UserMenu } from './UserMenu';
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
        { icon: <Orbit size={24} />, label: 'Neural Atlas', href: '/atlas', id: 'atlas' },
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
                    {navItems.map((item, index) => {
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
                                {/* Glitch Overlay on Hover */}
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
                    
                    {/* User Profile Menu */}
                    <div className="w-full">
                        <UserMenu isExpanded={isExpanded} />
                    </div>

                    {/* Theme Toggle */}
                    <div className={`flex w-full ${isExpanded ? 'justify-start px-2' : 'justify-center'}`}>
                        <ThemeToggle compact={!isExpanded} />
                    </div>

                    {/* Monroe Card */}
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
                        <div className="absolute top-[-10px] right-[-10px] p-4 opacity-[0.05] group-hover:rotate-12 group-hover:scale-125 transition-all pointer-events-none">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"><path d="m13 2-2 2.5h3L12 7" /><path d="M12 2v10" /><path d="M8.56 2.75c-4.37 1.27-7.39 5.26-7.39 9.96 0 5.52 4.48 10 10 10s10-4.48 10-10c0-4.7-3.02-8.69-7.39-9.96" /></svg>
                        </div>
                    </Link>

                    {/* Cluster status dot */}
                    <div className={`flex items-center gap-3 px-2 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                        {isExpanded && <span className="text-[10px] font-black uppercase tracking-[0.4em] italic text-foreground/30">Cluster Status_</span>}
                        <div className="flex items-center gap-2 text-primary">
                            <div className="w-2 h-2 rounded-full bg-primary animate-ping shrink-0" />
                            {isExpanded && <span className="text-[10px] font-black uppercase tracking-[0.3em] italic animate-pulse">Stable</span>}
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
                className="fixed top-14 z-[200] bg-background border-2 border-border rounded-full h-10 w-10 items-center justify-center text-foreground/30 hover:text-primary hover:border-primary/50 hover:scale-110 transition-colors shadow-2xl active:scale-95 hidden md:flex"
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
                                className={`transition-all p-4 rounded-[2rem] active:scale-90 ${isActive ? 'text-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.3)] border-2 border-primary/20' : 'text-foreground/40 dark:text-muted-foreground/30 hover:text-foreground dark:hover:text-foreground'}`}
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
