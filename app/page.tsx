// 📁 app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Users, Link as LinkIcon } from 'lucide-react';

const SCHOOL_URL_MAP: Record<string, string> = {
    '동양미래대학교': 'https://www.dongyang.ac.kr',
    '한양대학교': 'https://www.hanyang.ac.kr',
    '서울과학기술대학교': 'https://www.seoultech.ac.kr',
    '안산대학교': 'https://www.ansan.ac.kr',
    '순천향대학교': 'https://www.sch.ac.kr',
};

export default function Home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [userSchool, setUserSchool] = useState<string | null>(null);

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        const storedSchool = localStorage.getItem('userSchool');

        if (!userEmail) {
            router.replace('/login');
        } else {
            setUserSchool(storedSchool);
            setIsLoading(false);
        }
    }, [router]);

    const getSchoolUrl = (schoolName: string | null) => {
        if (!schoolName) return null;
        return SCHOOL_URL_MAP[schoolName] || null;
    };

    const schoolUrl = getSchoolUrl(userSchool);

    if (isLoading) return null;

    return (
        <main className="min-h-screen bg-background pb-24">
            <div className="p-6 max-w-[393px] mx-auto">
                {/* ⭐️ [수정] pt-4 제거하여 프로필 페이지와 상단 여백 통일 */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">안녕하세요!</h2>
                    {/* ⭐️ [수정] 문구 변경: '학칙 정보를 쉽고 빠르게 찾아보세요' */}
                    <p className="text-sm text-muted-foreground">
                        {userSchool
                            ? `${userSchool}의 학교 정보를 쉽고 빠르게 찾아보세요`
                            : '학교 정보를 쉽고 빠르게 찾아보세요'}
                    </p>
                </div>

                <div className="flex flex-col gap-4">

                    {/* Chatbot Card */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-6 flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                <MessageCircle size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground m-0">AI 챗봇</h3>
                                <p className="text-sm text-muted-foreground m-0">학칙과 학교에 대한 정보를 물어보세요</p>
                            </div>
                        </div>
                        <div className="px-6 pb-6">
                            <p className="text-sm text-muted-foreground mb-4">
                                학칙과 학교에 대한 정보를 AI에게 질문하고 즉시 답변을 받아보세요
                            </p>
                            <Link
                                href="/chat"
                                className="block w-full py-3 px-4 text-center rounded-lg text-sm font-semibold border border-primary text-primary bg-card hover:bg-secondary transition-colors"
                            >
                                챗봇 시작하기
                            </Link>
                        </div>
                    </div>

                    {/* Community Card */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-6 flex items-center gap-3">
                            <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground m-0">커뮤니티</h3>
                                <p className="text-sm text-muted-foreground m-0">함께 나누는 공간</p>
                            </div>
                        </div>
                        <div className="px-6 pb-6">
                            <p className="text-sm text-muted-foreground mb-4">
                                학교에 대한 질문과 경험을 커뮤니티와 공유하세요
                            </p>
                            <Link
                                href="/community"
                                className="block w-full py-3 px-4 text-center rounded-lg text-sm font-semibold border border-violet-600 text-violet-600 bg-card hover:bg-violet-50 transition-colors"
                            >
                                커뮤니티 참여
                            </Link>
                        </div>
                    </div>

                    {/* School Link Card */}
                    {schoolUrl && (
                        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6 flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                                    <LinkIcon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground m-0">학교 홈페이지</h3>
                                    <p className="text-sm text-muted-foreground m-0">공식 홈페이지 바로가기</p>
                                </div>
                            </div>
                            <div className="px-6 pb-6">
                                <p className="text-sm text-muted-foreground mb-4">
                                    {userSchool}의 공식 홈페이지를 방문하여 더 많은 정보를 확인하세요.
                                </p>
                                <a
                                    href={schoolUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-3 px-4 text-center rounded-lg text-sm font-semibold border border-primary text-primary bg-card hover:bg-secondary transition-colors"
                                >
                                    {userSchool} 바로가기
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}