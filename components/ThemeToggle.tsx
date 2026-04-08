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
    <div className="flex items-center gap-1 p-1 bg-white/5 dark:bg-white/5 light:bg-black/5 rounded-xl border border-white/10 dark:border-white/10 light:border-black/10">
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={`${label} mode`}
          className={`p-2 rounded-lg transition-all ${
            theme === value
              ? 'bg-white/20 dark:bg-white/20 light:bg-black/10 text-white dark:text-white light:text-black'
              : 'text-white/30 dark:text-white/30 light:text-black/30 hover:text-white/60 dark:hover:text-white/60 light:hover:text-black/60'
          }`}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}
