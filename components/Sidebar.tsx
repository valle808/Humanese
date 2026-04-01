'use client';

const NAV_MAP: Record<string, string> = {
    court: "/court",
    judiciary: "/judiciary",
    social: "/m2m",
    humanese: "/",
    register: "/auth",
    login: "/auth",
    bridge: "/h2m",
    api: "/h2m",
    hpedia: "/hpedia",
    encyclopedia: "/hpedia",
    admin: "/admin",
    wallet: "/wallet",
    help: "/faq",
};
import React, { useState, useEffect } from 'react';
import {
    Home,
    Share2,
    Users,
    Target,
    ShieldAlert,
    ChevronRight,
    ChevronLeft,
    Activity,
    User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();

    // Load preference from local storage and apply body padding
    useEffect(() => {
        const savedState = localStorage.getItem('sovereign_sidebar_expanded');
        const expanded = savedState === 'true';
        if (savedState !== null) {
            setIsExpanded(expanded);
        }
        setIsMounted(true);
        
        // Initial padding
        if (typeof window !== 'undefined' && window.innerWidth >= 768) {
            document.body.style.paddingLeft = expanded ? '16rem' : '5rem';
            document.body.style.transition = 'padding-left 0.3s ease-in-out';
        }
    }, []);

    // Save preference and update body padding
    const toggleSidebar = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        localStorage.setItem('sovereign_sidebar_expanded', String(newState));
        
        if (typeof window !== 'undefined' && window.innerWidth >= 768) {
            document.body.style.paddingLeft = newState ? '16rem' : '5rem';
        }
    };

    const navItems = [
        { icon: <Home size={22} />, label: 'Neural Core', href: '/' },
        { icon: <Activity size={22} />, label: 'Archive', href: '/hpedia' },
        { icon: <Share2 size={22} />, label: 'M2M Network', href: '/m2m' },
        { icon: <Target size={22} />, label: 'Skill Market', href: '/marketplace' },
        { icon: <User size={22} />, label: 'Wallet', href: '/wallet' },
        {
            icon: <ShieldAlert size={22} className="text-emerald" />,
            label: 'Supreme Command',
            href: '/admin',
            clearance: 'OMEGA'
        },
    ];

    if (!isMounted) return null;

    return (
        <>
            {/* Sidebar Container */}
            <div
                className={`fixed top-0 left-0 h-screen z-[100] transition-all duration-300 ease-in-out border-r border-white/10
          ${isExpanded ? 'w-64' : 'w-20'} 
          bg-[#0a0a0a]/80 backdrop-blur-xl flex flex-col hidden md:flex`}
            >
                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-10 bg-[#0a0a0a] border border-white/20 rounded-full p-1 text-white hover:text-cyan-400 transition-colors z-[110]"
                    aria-label={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>

                {/* Brand Logo Area */}
                <div className="p-6 mb-8 flex items-center gap-4">
                    <div className="min-w-[32px] w-8 h-8 bg-emerald rounded-sm shadow-[0_0_20px_rgba(0,255,65,0.4)] flex items-center justify-center font-bold text-black text-xs">
                        H
                    </div>
                    {isExpanded && (
                        <span className="font-bold tracking-widest text-white uppercase truncate menu-label-enter">
                            Humanese
                        </span>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-4 p-3 rounded-lg transition-all group ${isActive
                                        ? 'bg-emerald/10 text-white shadow-[inset_0_0_10px_rgba(0,255,65,0.1)] border border-emerald/20'
                                        : 'text-platinum/40 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <div className={`min-w-[24px] transition-transform ${isActive ? 'scale-110 text-emerald' : 'group-hover:scale-110 group-hover:text-emerald'}`}>
                                    {item.icon}
                                </div>
                                {isExpanded && (
                                    <div className="flex flex-col menu-label-enter overflow-hidden">
                                        <span className="text-sm font-medium truncate">{item.label}</span>
                                        {item.clearance && (
                                            <span className="text-[10px] text-emerald font-bold uppercase tracking-tighter animate-omega-glow">
                                                Clearance {item.clearance}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* System Status / Monroe Footer */}
                <div className="p-4 border-t border-white/5 bg-black/20 space-y-3">
                    <Link
                        href="/monroe"
                        className="flex items-center gap-3 p-2 rounded-lg bg-white/5 group cursor-pointer border border-white/5 hover:border-emerald/20 transition-all w-full text-left"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald to-obsidian border border-emerald flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                            <User size={16} />
                        </div>
                        {isExpanded && (
                            <div className="flex flex-col menu-label-enter overflow-hidden">
                                <span className="text-xs font-bold text-white truncate">Nexus Monroe</span>
                                <span className="text-[10px] text-emerald truncate tracking-widest uppercase">V4.1 Sentinel</span>
                            </div>
                        )}
                    </Link>

                    <button
                        onClick={() => window.location.href = '/admin'}
                        className="flex items-center gap-3 px-2 w-full text-left group hover:text-emerald transition-colors"
                    >
                        <Activity size={18} className="text-emerald shrink-0 group-hover:animate-pulse" />
                        {isExpanded && (
                            <div className="text-[10px] text-platinum/20 font-mono menu-label-enter group-hover:text-platinum/60">
                                <p className="whitespace-nowrap">UPTIME: 99.997%</p>
                                <p className="whitespace-nowrap">NODES: 8,241 ACTIVE</p>
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Glass Dock (Bottom Navigation) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] p-4">
                <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl flex justify-around items-center p-3 shadow-2xl">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`transition-colors p-2 rounded-lg ${isActive ? 'text-cyan-400 bg-white/5' : 'text-gray-400 hover:text-white'}`}
                                aria-label={item.label}
                            >
                                {item.icon}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Content Adjustment Styles */}
            <style jsx global>{`
        @media (min-width: 768px) {
          body {
            padding-left: ${isExpanded ? '16rem' : '5rem'};
            transition: padding-left 0.3s ease-in-out;
          }
        }
        @media (max-width: 767px) {
          body {
            padding-bottom: 5rem;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
        </>
    );
};
