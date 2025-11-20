// 📁 components/TabBar.tsx (하단 탭 바 - 디자인 강화)

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ⭐️ [기능 설명] 지원하는 탭 목록을 정의합니다.
const tabs = [
    { name: '홈', path: '/', icon: '🏠' },
    { name: '챗봇', path: '/select-school', icon: '🤖' },
    { name: '커뮤니티', path: '/community', icon: '👥' },
];

export default function TabBar() {
    const pathname = usePathname();

    return (
        <nav
            style={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                maxWidth: '500px',
                height: '60px',
                backgroundColor: 'var(--color-white)',
                borderTop: '1px solid var(--color-border)',
                boxShadow: '0 -1px 5px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                justifyContent: 'space-around',
                zIndex: 1000,
            }}
        >
            {tabs.map((tab) => {
                const isActive = pathname === tab.path || (pathname.startsWith('/chat/') && tab.path === '/select-school') || (pathname.startsWith('/community') && tab.path === '/community');

                return (
                    <Link href={tab.path} key={tab.name} passHref legacyBehavior>
                        <a
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 1,
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                fontWeight: isActive ? 700 : 500,
                                fontSize: '0.75rem',
                            }}
                        >
                            <span style={{ fontSize: '1.2rem', marginBottom: '3px' }}>{tab.icon}</span>
                            {tab.name}
                        </a>
                    </Link>
                );
            })}
        </nav>
    );
}