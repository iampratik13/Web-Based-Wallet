'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 p-1 rounded-full bg-muted/50 border">
        <button className="p-2 rounded-full">
          <Sun className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-full">
          <Moon className="h-5 w-5" />
        </button>
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-muted/50 border relative">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-full transition-colors z-10 ${
          !isDark ? 'text-foreground' : 'text-muted-foreground'
        }`}
        aria-label="Light mode"
      >
        <Sun className="h-5 w-5" />
      </button>
      
      {/* Sliding background */}
      <div
        className={`absolute top-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] bg-background rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
          isDark ? 'translate-x-[calc(100%+0.25rem)]' : 'translate-x-0'
        }`}
        style={{ left: '0.25rem' }}
      />
      
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-full transition-colors z-10 ${
          isDark ? 'text-foreground' : 'text-muted-foreground'
        }`}
        aria-label="Dark mode"
      >
        <Moon className="h-5 w-5" />
      </button>
    </div>
  );
}
