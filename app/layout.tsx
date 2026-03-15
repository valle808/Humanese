import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hpedia - Sovereign Knowledge Matrix",
  description: "Explore the Sovereign Knowledge Matrix with AI-powered personalized learning, mindmaps, and advanced synthesis.",
  icons: {
    icon: '/logo-sovereign.png',
  },
};

import { MonroeAssistant } from "@/components/MonroeAssistant";
import { BackToTop } from "@/components/BackToTop";
import { Sidebar } from "@/components/Sidebar";
import { SovereignReactor } from "@/components/SovereignReactor";
import { CommandPortal } from "@/components/CommandPortal";

export const viewport = {
  themeColor: '#050505',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=aeonik@400,700&display=swap"
          rel="stylesheet"
        />
        {/* AdSense Integrated */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8867340586657793"
          crossOrigin="anonymous"></script>
      </head>
      <body className="antialiased min-h-screen bg-obsidian text-platinum selection:bg-emerald/30">
        <SovereignReactor />
        <CommandPortal />
        
        <div className="relative z-10 flex min-h-screen">
          <Sidebar />
          <main id="root-content" className="flex-1 relative flex flex-col min-h-screen overflow-x-hidden">
            {children}
          </main>
        </div>

        <MonroeAssistant />
        <BackToTop />
      </body>
    </html>
  );
}
