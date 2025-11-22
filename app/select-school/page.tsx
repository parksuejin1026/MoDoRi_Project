'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SchoolSelector from '@/components/SchoolSelector';

function SchoolSelectContent() {
    const searchParams = useSearchParams();
    const from = searchParams.get('from');

    // 프로필에서 왔다면(from=profile) 수정 모드를 켭니다.
    const isFromProfile = from === 'profile';
    const backUrl = isFromProfile ? '/profile' : '/';

    return <SchoolSelector backUrl={backUrl} isEditMode={isFromProfile} />;
}

export default function SelectSchoolPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-[393px] mx-auto w-full bg-white min-h-screen flex flex-col shadow-sm">
                <Suspense fallback={<div>로딩 중...</div>}>
                    <SchoolSelectContent />
                </Suspense>
            </div>
        </main>
    );
}