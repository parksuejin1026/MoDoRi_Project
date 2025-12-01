// 📁 components/TabBar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageCircle, Users, User, Calendar } from 'lucide-react';

export default function TabBar() {
    const pathname = usePathname();

    if (pathname === '/login' || pathname === '/signup' || pathname === '/reset-password') {
        return null;
    }

    const tabs = [
        { name: '홈', path: '/', icon: Home },
        { name: '챗봇', path: '/chat', activePath: '/chat', icon: MessageCircle },
        { name: '시간표', path: '/timetable', activePath: '/timetable', icon: Calendar },
        { name: '커뮤니티', path: '/community', activePath: '/community', icon: Users },
        { name: '프로필', path: '/profile', activePath: '/profile', icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-card border-t border-border px-6 py-1 z-50 safe-area-pb">
            <div className="flex justify-around items-center">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path || (tab.activePath && pathname.startsWith(tab.activePath));
                    const Icon = tab.icon;

                    return (
                        <Link key={tab.name} href={tab.path} className="flex flex-col items-center gap-0.5 cursor-pointer no-underline w-16">
                            <div
                                className={`p-0.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary scale-105' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
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