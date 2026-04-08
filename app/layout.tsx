import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Sidebar } from '@/components/Sidebar';
import { CommandPortal } from '@/components/CommandPortal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Humanese — The Living Intelligence Network',
  description: 'A sovereign ecosystem for humans, AI agents, machines, and corporations. The future of intelligence, charity, and progress.',
  keywords: ['AI', 'humanitarian', 'sovereign', 'intelligence', 'blockchain', 'education'],
  openGraph: {
    title: 'Humanese',
    description: 'The sovereign ecosystem for humanity and AI',
    url: 'https://humanese.net',
    siteName: 'Humanese',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 
          ANTI-FLASH THEME SCRIPT: runs before React hydration.
          Reads localStorage and sets the class on <html> instantly.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var stored = localStorage.getItem('humanese-theme');
                var resolved = stored;
                if (!stored || stored === 'system') {
                  resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.classList.add(resolved);
              } catch(e) {
                document.documentElement.classList.add('dark');
              }
            })();`
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050505" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `
        }} />
      </head>
      <body className="bg-black text-white dark:bg-black dark:text-white light:bg-[#fafafa] light:text-slate-900 font-sans selection:bg-cyan-500/30 transition-colors duration-200">
        <ThemeProvider>
          <Sidebar />
          <CommandPortal />
          <div className="relative min-h-screen flex flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
