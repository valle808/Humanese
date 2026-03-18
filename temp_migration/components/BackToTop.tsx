'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={cn(
                'fixed bottom-5 right-24 z-[9998] flex h-12 w-12 items-center justify-center rounded-full bg-black/80 border border-white/20 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black hover:scale-110 active:scale-95',
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
            )}
            aria-label="Back to Top"
        >
            <ArrowUp className="h-6 w-6" />
        </button>
    );
}
