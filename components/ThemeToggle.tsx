// 📁 components/ThemeToggle.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';

export default function ThemeToggle({ className }: { className?: string }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-2 rounded-full transition-colors ${isDark
                ? 'text-yellow-400 hover:bg-gray-700'
                : 'text-gray-500 hover:bg-gray-100'
                } ${className}`}
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}