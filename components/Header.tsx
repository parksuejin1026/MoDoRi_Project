'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Bell } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasUnread, setHasUnread] = useState(false); // ⭐️ 안 읽은 알림 상태 추가
    const pathname = usePathname();

    useEffect(() => {
        const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
        setIsLoggedIn(!!userId);

        // ⭐️ 알림 상태 확인 함수
        const checkUnreadNotifications = async () => {
            if (!userId) return;
            try {
                // 알림 목록을 가져와서 확인
                const res = await fetch(`/api/notifications?userId=${userId}`);
                const result = await res.json();

                if (result.success && Array.isArray(result.data)) {
                    // 안 읽은(isRead: false) 알림이 하나라도 있는지 체크
                    const unreadExists = result.data.some((n: any) => !n.isRead);
                    setHasUnread(unreadExists);
                }
            } catch (error) {
                console.error("Failed to check notifications:", error);
            }
        };

        if (userId) {
            checkUnreadNotifications();
        }
    }, [pathname]); // 페이지 이동 시마다 알림 상태 재확인

    return (
        <header className="bg-card px-6 py-2 flex items-center gap-3 shadow-sm z-30 sticky top-0 border-b border-border">
            <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shrink-0">
                    <GraduationCap size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-primary m-0 leading-none">유니메이트</h1>
                    <p className="text-xs text-muted-foreground m-0 mt-1">UniMate</p>
                </div>
            </Link>

            <div className="flex-1" />

            {isLoggedIn && (
                <Link
                    href="/notifications"
                    className="p-2 rounded-full transition-colors relative text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                    <Bell size={24} />
                    {/* ⭐️ 조건부 렌더링: 안 읽은 알림이 있을 때(hasUnread)만 빨간 점 표시 */}
                    {hasUnread && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-card"></span>
                    )}
                </Link>
            )}

            <ThemeToggle className="text-foreground" />
        </header>
    );
}