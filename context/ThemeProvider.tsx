// 📁 context/ThemeProvider.tsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // 초기 테마 설정 (로컬 스토리지 또는 시스템 설정)
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        // 브라우저의 다크 모드 선호 설정을 확인합니다.
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const initialTheme = storedTheme === 'dark' || (storedTheme === null && prefersDark)
            ? 'dark'
            : 'light';

        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);

    // 테마 토글 함수
    const toggleTheme = useCallback(() => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
            return newTheme;
        });
    }, []);

    // 서버 사이드 렌더링 시 깜빡임을 방지하기 위해, 초기 렌더링 후 클래스를 설정합니다.
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);


    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}