'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
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
                localStorage.setItem('userEmail', data.user.userid);

                router.push('/');
            } else {
                await showAlert(data.error || '로그인에 실패했습니다.', '로그인 오류');
            }
        } catch (error) {
            await showAlert('서버 연결 중 오류가 발생했습니다.', '오류');
        }
    };

    // ⭐️ 비밀번호 찾기 안내 핸들러
    const handleForgotPassword = () => {
        showAlert(
            '비밀번호 재설정은 관리자에게 문의해주세요.\n\n📧 이메일: cjh040602@icloud.com',
            '비밀번호 찾기'
        );
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-blue-600 to-blue-700">
            <div className="w-full max-w-[360px] bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                        <BookOpen size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-blue-600 mb-1">룰룩</h1>
                    <p className="text-sm text-gray-500">Rule-Look</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="userid" className="text-sm font-medium text-gray-700">아이디</label>
                        <input
                            id="userid"
                            type="text"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 transition-all"
                            placeholder="아이디를 입력하세요"
                            value={userid}
                            onChange={(e) => setUserid(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">비밀번호</label>
                            {/* ⭐️ 비밀번호 찾기 버튼 추가 */}
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                                비밀번호를 잊으셨나요?
                            </button>
                        </div>
                        <input
                            id="password"
                            type="password"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 transition-all"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mt-2">
                        로그인
                    </button>
                </form>

                <div className="text-center mt-6 text-sm text-gray-500">
                    아직 계정이 없으신가요? <Link href="/signup" className="text-blue-600 font-semibold hover:underline">회원가입</Link>
                </div>
            </div>
        </div>
    );
}