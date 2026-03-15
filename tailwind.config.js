/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'emerald': '#00ff41',
        'obsidian': '#0a0a0a',
        'platinum': '#e5e5e5',
        'cyan': {
          400: '#22d3ee',
          500: '#06b6d4',
          800: '#155e75',
          900: '#164e63',
        }
      },
    },
  },
  plugins: [],
}
