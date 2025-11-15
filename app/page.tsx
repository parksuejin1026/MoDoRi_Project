// 📁 app/page.tsx (홈 페이지)

import Hero from '@/components/Hero';
import Link from 'next/link';

export default function Home() {
    return (
        <>
            {/* ⭐️ 모바일 Navigation Bar 스타일의 제목 */}
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, padding: '10px 0', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>
                Rule-Look 홈
            </h1>
            <Hero />
        </>
    );
}