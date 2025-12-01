'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalModal } from '@/components/GlobalModal';
import ChatInterface from '@/components/ChatInterface';

const SCHOOL_MAP: Record<string, string> = {
    '동양미래대학교': 'dongyang',
    '한양대학교': 'hanyang',
    '서울과학기술대학교': 'seoultech',
    '안산대학교': 'ansan',
    '순천향대학교': 'soonchunhyang',
    '대전대학교': 'daejeon',
    '경기과학기술대학교': 'gtec',
};

export default function ChatPage() {
    const router = useRouter();
    const { showAlert } = useGlobalModal();
    const [schoolCode, setSchoolCode] = useState<string | null>(null);
    const [schoolName, setSchoolName] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const storedSchool = localStorage.getItem('userSchool');
            const storedId = localStorage.getItem('userId') || localStorage.getItem('userEmail');

            if (!storedId) {
                await showAlert('로그인이 필요한 서비스입니다.');
                router.replace('/login');
                return;
            }

            setUserId(storedId);

            if (!storedSchool) {
                await showAlert('학교 정보가 없습니다. 프로필에서 학교를 설정해주세요.');
                router.replace('/profile');
                return;
            }

            const code = SCHOOL_MAP[storedSchool];
            if (!code) {
                await showAlert('지원하지 않는 학교 코드입니다.');
                router.replace('/profile');
                return;
            }

            setSchoolName(storedSchool);
            setSchoolCode(code);
        };

        checkAuth();
    }, [router, showAlert]);

    if (!schoolCode || !userId) return null;

    return <ChatInterface schoolCode={schoolCode} schoolName={schoolName} userId={userId} />;
}