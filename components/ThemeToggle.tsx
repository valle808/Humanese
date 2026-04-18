'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';

const OPTIONS = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'system', icon: Monitor, label: 'System' },
  { value: 'dark', icon: Moon, label: 'Dark' },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={`${label} mode`}
          className={`p-2.5 md:p-2 rounded-lg transition-all ${
            theme === value
              ? 'bg-black/10 dark:bg-white/20 text-black dark:text-white'
              : 'text-black/50 dark:text-white/30 hover:text-black/80 dark:hover:text-white/60'
          }`}
        >
          <Icon size={18} className="md:w-3.5 md:h-3.5" />
        </button>
      ))}
    </div>
  );
}
