'use client';

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

    // Load preference from local storage
    useEffect(() => {
        const savedState = localStorage.getItem('sovereign_sidebar_expanded');
        if (savedState !== null) {
            setIsExpanded(savedState === 'true');
        }
        setIsMounted(true);
    }, []);

    // Save preference to local storage
    const toggleSidebar = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        localStorage.setItem('sovereign_sidebar_expanded', String(newState));
    };

    const navItems = [
        { icon: <Home size={22} />, label: 'Core Neural', href: '/' },
        { icon: <Share2 size={22} />, label: 'M2M Network', href: '/m2m.html' },
        { icon: <Users size={22} />, label: 'Swarm Mainframe', href: '/m2m-swarm.html' },
        { icon: <Target size={22} />, label: 'Agent Directory', href: '/agents.html' },
        {
            icon: <ShieldAlert size={22} className="text-red-500" />,
            label: 'Supreme Command',
            href: '/admin.html',
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
                    <div className="min-w-[32px] w-8 h-8 bg-cyan-500 rounded-sm animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)] flex items-center justify-center font-bold text-black text-xs">
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
                        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href.replace('.html', '')));

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-4 p-3 rounded-lg transition-all group ${isActive
                                        ? 'bg-white/10 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <div className={`min-w-[24px] transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </div>
                                {isExpanded && (
                                    <div className="flex flex-col menu-label-enter overflow-hidden">
                                        <span className="text-sm font-medium truncate">{item.label}</span>
                                        {item.clearance && (
                                            <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter animate-omega-glow">
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
                <div className="p-4 border-t border-white/5 bg-black/20">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 mb-3 group cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                            <User size={16} />
                        </div>
                        {isExpanded && (
                            <div className="flex flex-col menu-label-enter overflow-hidden">
                                <span className="text-xs font-bold text-white truncate">Nexus Monroe</span>
                                <span className="text-[10px] text-cyan-400 truncate">V4.0 Sentinel</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 px-2">
                        <Activity size={18} className="text-green-500 shrink-0" />
                        {isExpanded && (
                            <div className="text-[10px] text-gray-500 menu-label-enter">
                                <p className="whitespace-nowrap">UPTIME: 99.9%</p>
                                <p className="whitespace-nowrap">NODES: 8,241 ACTIVE</p>
                            </div>
                        )}
                    </div>
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
