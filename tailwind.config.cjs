/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "nd-bg": "#000000",
        "nd-cta": "#FFFFFF",
        "nd-high-em-text": "#FFFFFF",
        "nd-mid-em-text": "#ABABBA",
        "nd-primary": "#FFFFFF",
        "nd-border-light": "#ECE4FD1F",
        "nd-border-prominent": "#ECE4FD33",
        "nd-highlight-lavendar": "#CA9FF5",
        "nd-highlight-blue": "#6693F7",
        "nd-highlight-gold": "#FFC526",
        "nd-highlight-orange": "#F48252",
        "nd-highlight-green": "#55E9AB",
        "nd-highlight-lime": "#CFF15E",
      },
    },
  },
  plugins: [],
};
