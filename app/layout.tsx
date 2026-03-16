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
      <body className="bg-black text-white font-mono selection:bg-cyan-500/30">
        <Sidebar />
        <CommandPortal />
        <div className="relative min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
