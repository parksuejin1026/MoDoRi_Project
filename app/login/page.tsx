// 📁 app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { useGlobalModal } from '@/components/GlobalModal';

export default function LoginPage() {
    const router = useRouter();
    const { showAlert } = useGlobalModal();
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userid || !password) {
            await showAlert('아이디와 비밀번호를 입력해주세요.', '입력 확인');
            return;
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('userId', data.user.userid);
                localStorage.setItem('userName', data.user.name);
                localStorage.setItem('userSchool', data.user.school);
                localStorage.setItem('userEmail', data.user.email || data.user.userid); // ⭐️ 이메일 저장 (없으면 ID)

                router.push('/');
            } else {
                await showAlert(data.error || '로그인에 실패했습니다.', '로그인 오류');
            }
        } catch (error) {
            await showAlert('서버 연결 중 오류가 발생했습니다.', '오류');
        }
    };

    return (
        <div className="min-h-full flex flex-col justify-center items-center p-6 bg-background">
            <div className="w-full max-w-[360px] bg-card rounded-xl border border-border shadow-sm p-6 relative">

                <div className="text-center mb-8 pt-4">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-foreground shadow-lg shadow-primary/30">
                        <GraduationCap size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-primary mb-1">유니메이트</h1>
                    <p className="text-sm text-muted-foreground">UniMate</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="userid" className="text-sm font-medium text-foreground">아이디</label>
                        <input
                            id="userid"
                            type="text"
                            className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-all bg-muted text-foreground"
                            placeholder="아이디를 입력하세요"
                            value={userid}
                            onChange={(e) => setUserid(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className="text-sm font-medium text-foreground">비밀번호</label>
                            <Link
                                href="/reset-password"
                                className="text-xs text-primary hover:text-primary/70 hover:underline transition-colors"
                            >
                                비밀번호를 잊으셨나요?
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-all bg-muted text-foreground"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors mt-2">
                        로그인
                    </button>
                </form>

                <div className="text-center mt-6 text-sm text-muted-foreground">
                    아직 계정이 없으신가요? <Link href="/signup" className="text-primary font-semibold hover:underline">회원가입</Link>
                </div>
            </div>
        </div>
    );
}