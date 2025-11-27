// 📁 app/select-school/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SchoolSelector from '@/components/SchoolSelector';

function SchoolSelectContent() {
    const searchParams = useSearchParams();
    const from = searchParams.get('from');

    // 프로필에서 왔다면(from=profile) 수정 모드를 꿉니다.
    const isFromProfile = from === 'profile';
    const backUrl = isFromProfile ? '/profile' : '/';

    return <SchoolSelector backUrl={backUrl} isEditMode={isFromProfile} />;
}

export default function SelectSchoolPage() {
    return (
        // ⭐️ [수정] 배경 색상 테마 변수 적용 (bg-background)
        <main className="min-h-screen bg-background flex flex-col">
            {/* ⭐️ [수정] 내부 컨테이너 배경 색상 테마 변수 적용 (bg-card) */}
            <div className="max-w-[393px] mx-auto w-full bg-card min-h-screen flex flex-col shadow-sm">
                {/* ⭐️ [수정] 로딩 텍스트 색상 테마 변수 적용 */}
                <Suspense fallback={<div className="p-6 text-muted-foreground">로딩 중...</div>}>
                    <SchoolSelectContent />
                </Suspense>
            </div>
        </main>
    );
}