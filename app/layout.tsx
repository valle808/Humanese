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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        {/* Always dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('dark');`,
          }}
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=aeonik@400,700&display=swap"
          rel="stylesheet"
        />
        {/* Tailwind CDN fallback to ensure styles render if local PostCSS fails */}
        <script
          dangerouslySetInnerHTML={{
            __html: `tailwind = { config: { darkMode: 'class', theme: { extend: { colors: { border: 'hsl(var(--border))', input: 'hsl(var(--input))', ring: 'hsl(var(--ring))', background: 'hsl(var(--background))', foreground: 'hsl(var(--foreground))', primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' }, secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' }, destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' }, muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' }, accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' }, popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' }, card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' } }, fontFamily: { sans: ['Aeonik', 'sans-serif'] } } } }`,
          }}
        />
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Google AdSense Script Injected System-Wide */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8867340586657793"
          crossorigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-8867340586657793" />
        <meta name="theme-color" content="#0b0f19" />
      </head>
      <body className="antialiased">
        {children}
        <MonroeAssistant />
        <BackToTop />
      </body>
    </html>
  );
}
