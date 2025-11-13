// 📁 app/select-school/page.tsx (학교 선택 페이지)

'use client'; 

import Link from 'next/link';

interface School {
    code: string;
    name: string;
}

// ⭐️ 지원하는 학교 목록 (Google Sheets의 School_List 탭과 일치해야 함)
const schools: School[] = [
    { code: 'dongyang', name: '동양미래대학교' },
    { code: 'hanyang', name: '한양대학교' }, // ⭐️ 오늘 학칙을 정리한 학교
    // 필요한 다른 학교 코드를 여기에 추가
];

export default function SelectSchoolPage() {
    return (
        <div style={{ maxWidth: '600px', margin: '5rem auto', padding: '2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--color-primary-dark)' }}>
                🏫 답변을 받을 학교를 선택하세요
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', justifyContent: 'center' }}>
                {schools.map((school) => (
                    // ⭐️ 선택 시 동적 챗봇 경로로 이동: /chat/[school_code]
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
            {/* ⭐️ legacyBehavior 사용 시 경고를 피하기 위해 style을 <a>에 적용 */}
            <style jsx>{`
                .btn-school {
                    /* Style for non-hover state */
                }
                .btn-school:hover {
                    /* Style for hover state */
                }
            `}</style>
        </div>
    );
}