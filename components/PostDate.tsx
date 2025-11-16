// 📁 components/PostDate.tsx (새 파일)
'use client'; // 👈 클라이언트 컴포넌트로 명시

import { format } from 'date-fns'; 

interface PostDateProps {
    dateString: string;
}

export default function PostDate({ dateString }: PostDateProps) {
    // 이제 format 함수는 클라이언트 환경에서만 실행됩니다.
    return (
        <span>{format(new Date(dateString), 'yy.MM.dd HH:mm')}</span>
    );
}