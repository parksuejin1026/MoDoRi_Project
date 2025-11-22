// 📁 components/TabBar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageCircle, Users, User } from 'lucide-react';

export default function TabBar() {
    const pathname = usePathname();

    if (pathname === '/login' || pathname === '/signup') {
        return null;
    }

    const tabs = [
        { name: '홈', path: '/', icon: Home },
        { name: '챗봇', path: '/chat', activePath: '/chat', icon: MessageCircle },
        { name: '커뮤니티', path: '/community', activePath: '/community', icon: Users },
        { name: '프로필', path: '/profile', activePath: '/profile', icon: User },
    ];

    return (
        // ⭐️ [수정] 배경/경계 색상 테마 변수 적용
        <nav className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-card border-t border-border px-6 py-1 z-50 safe-area-pb">
            <div className="flex justify-around items-center">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path || (tab.activePath && pathname.startsWith(tab.activePath));
                    const Icon = tab.icon;

                    return (
                        <Link key={tab.name} href={tab.path} className="flex flex-col items-center gap-0.5 cursor-pointer no-underline w-16">
                            {/* 아이콘 감싸는 박스 크기 축소 */}
                            <div
                                // ⭐️ [수정] 배경/아이콘 색상 테마 변수 적용 (active 시 primary 색상)
                                className={`p-0.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary scale-105' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {/* 아이콘 크기 24 -> 22로 축소 */}
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            {/* 텍스트 크기 축소 */}
                            <span className={`text-[10px] font-medium tracking-tight ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                                {tab.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}