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
        // ⭐️ py-2로 줄여서 탭바를 얇게 만듦 + safe-area-pb 추가
        <nav className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-white border-t border-gray-100 px-6 py-2 z-50 safe-area-pb">
            <div className="flex justify-around items-center">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path || (tab.activePath && pathname.startsWith(tab.activePath));
                    const Icon = tab.icon;

                    return (
                        <Link key={tab.name} href={tab.path} className="flex flex-col items-center gap-0.5 cursor-pointer no-underline w-16">
                            {/* 아이콘 감싸는 박스 크기 축소 */}
                            <div
                                className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-blue-50 text-blue-600 scale-105' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {/* 아이콘 크기 24 -> 22로 축소 */}
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            {/* 텍스트 크기 축소 */}
                            <span className={`text-[10px] font-medium tracking-tight ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                                {tab.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}