import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { CommandPortal } from '@/components/CommandPortal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050505" />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(reg) {
                  console.log('[SOVEREIGN_SW] Matrix Synchronized:', reg.scope);
                }, function(err) {
                  console.log('[SOVEREIGN_SW] Sync Failure:', err);
                });
              });
            }
          `
        }} />
      </head>
      <body className="bg-black text-white font-mono selection:bg-cyan-500/30">
        <Sidebar />
        <CommandPortal />
        <div className="relative min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
