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
        // ⭐️ 경로 변경: /select-school -> /chat
        { name: '챗봇', path: '/chat', activePath: '/chat', icon: MessageCircle },
        { name: '커뮤니티', path: '/community', activePath: '/community', icon: Users },
        { name: '프로필', path: '/profile', activePath: '/profile', icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-white border-t border-border px-6 py-3 z-50">
            <div className="flex justify-around items-center">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path || (tab.activePath && pathname.startsWith(tab.activePath));
                    const Icon = tab.icon;

                    return (
                        <Link key={tab.name} href={tab.path} className="flex flex-col items-center gap-1 cursor-pointer no-underline">
                            <div
                                className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-primary' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <Icon size={24} />
                            </div>
                            <span className={`text-[11px] ${isActive ? 'text-primary font-medium' : 'text-gray-400'}`}>
                                {tab.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}