'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Bell } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // 클라이언트 사이드에서만 실행: 로컬 스토리지 확인
        const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
        setIsLoggedIn(!!userId);
    }, [pathname]);

    return (
        <header className="bg-card px-6 py-2 flex items-center gap-3 shadow-sm z-30 sticky top-0 border-b border-border">
            <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shrink-0">
                    <GraduationCap size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-primary m-0 leading-none">유니메이트</h1>
                    <p className="text-xs text-muted-foreground m-0 mt-1">UniMate</p>
                </div>
            </Link>

            {/* ⭐️ 로그인 상태일 때만 알림 아이콘 표시 */}
            {isLoggedIn && (
                <Link href="/notifications" className="p-2 text-foreground hover:bg-muted rounded-full transition-colors relative">
                    <Bell size={24} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-card"></span>
                </Link>
            )}

            <ThemeToggle className="text-foreground" />
        </header>
    );
}