'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { School, Search, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useGlobalModal } from '@/components/GlobalModal'; // ⭐️ Import

const schools = [
    { code: 'dongyang', name: '동양미래대학교' },
    { code: 'hanyang', name: '한양대학교' },
    { code: 'seoultech', name: '서울과학기술대학교' },
    { code: 'ansan', name: '안산대학교' },
    { code: 'soonchunhyang', name: '순천향대학교' },
];

interface SchoolSelectorProps {
    backUrl?: string;
    isEditMode?: boolean;
}

export default function SchoolSelector({ backUrl = '/', isEditMode = false }: SchoolSelectorProps) {
    const router = useRouter();
    const { showAlert } = useGlobalModal(); // ⭐️ Hook
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSchools = schools.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSchoolClick = async (schoolName: string) => {
        if (isEditMode) {
            const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');

            if (!userId) {
                await showAlert('로그인 정보가 없습니다.', '알림');
                router.push('/login');
                return;
            }

            try {
                const res = await fetch('/api/auth/profile/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        currentUserId: userId,
                        school: schoolName
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem('userSchool', schoolName);
                    await showAlert(`${schoolName}로 변경되었습니다.`, '변경 완료');
                    router.push('/profile');
                } else {
                    await showAlert(data.error || '학교 변경에 실패했습니다.', '오류');
                }
            } catch (error) {
                console.error(error);
                await showAlert('서버 통신 중 오류가 발생했습니다.', '오류');
            }
        }
    };

    return (
        <div className="flex-1 overflow-y-auto pb-24">
            <div className="sticky top-0 bg-white z-10 px-4 py-4 flex items-center gap-3 border-b border-gray-100">
                <Link href={backUrl} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-700" />
                </Link>
                <h1 className="text-lg font-bold text-gray-900">학교 선택</h1>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <p className="text-sm text-gray-500">
                        {isEditMode ? "변경할 학교를 선택해주세요" : "학칙을 조회할 학교를 선택해주세요"}
                    </p>
                </div>

                <div className="relative mb-6">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="학교명을 검색하세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {filteredSchools.map((school) => {
                        const cardClass = "flex flex-col items-center gap-3 p-6 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-blue-600 hover:shadow-md hover:-translate-y-0.5 transition-all text-center decoration-0";

                        const cardContent = (
                            <>
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                    <School size={24} />
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {school.name}
                                </div>
                            </>
                        );

                        return isEditMode ? (
                            <div
                                key={school.code}
                                onClick={() => handleSchoolClick(school.name)}
                                className={cardClass}
                            >
                                {cardContent}
                            </div>
                        ) : (
                            <Link
                                key={school.code}
                                href={`/chat/${school.code}`}
                                className={cardClass}
                            >
                                {cardContent}
                            </Link>
                        );
                    })}

                    {filteredSchools.length === 0 && (
                        <div className="col-span-2 py-12 text-center text-gray-500">
                            <School size={48} className="mx-auto mb-3 opacity-30" />
                            <p>검색 결과가 없습니다</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}