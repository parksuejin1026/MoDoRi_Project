// 📁 components/SchoolSelector.tsx (학교 목록 UI)

'use client'; 

import Link from 'next/link';

// [기능 설명] 지원하는 5개 학교 목록과 코드를 정의합니다.
const schools = [
    { code: 'dongyang', name: '동양미래대학교' },
    { code: 'hanyang', name: '한양대학교' },
    { code: 'seoultech', name: '서울과학기술대학교' },
    { code: 'ansan', name: '안산대학교' },
    { code: 'soonchunhyang', name: '순천향대학교' }, // ⭐️ 건국대 -> 순천향대 변경
];

export default function SchoolSelector() {
    return (
        <div style={{ maxWidth: '600px', margin: '5rem auto', padding: '2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--color-primary-dark)' }}>
                🏫 답변을 받을 학교를 선택하세요
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', justifyContent: 'center' }}>
                {schools.map((school) => (
                    // ⭐️ 선택 시 동적 챗봇 경로로 이동: /chat/[schoolCode]
                    <Link href={`/chat/${school.code}`} key={school.code} passHref legacyBehavior>
                        <a style={{ 
                            padding: '1.5rem', 
                            border: '2px solid var(--color-primary-dark)', 
                            borderRadius: '8px', 
                            fontWeight: 600, 
                            textAlign: 'center', 
                            textDecoration: 'none', 
                            color: 'var(--color-text-primary)',
                            backgroundColor: 'var(--color-white)',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-border)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-white)'}
                        >
                            {school.name}
                        </a>
                    </Link>
                ))}
            </div>
        </div>
    );
}