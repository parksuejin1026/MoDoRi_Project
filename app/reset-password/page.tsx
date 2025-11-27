'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LockKeyhole, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useGlobalModal } from '@/components/GlobalModal';

export default function ResetPasswordPage() {
    const router = useRouter();
    const { showAlert } = useGlobalModal();

    // 단계: 'request' (요청) -> 'verify' (인증 및 변경)
    const [step, setStep] = useState<'request' | 'verify'>('request');

    // 폼 데이터
    const [userid, setUserid] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    // 인증코드 발송 요청
    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userid || !email) {
            showAlert('아이디와 이메일을 모두 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/password/request-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid, email }),
            });
            const data = await res.json();

            if (res.ok) {
                await showAlert('인증코드가 이메일로 발송되었습니다.\n(스팸메일함도 확인해주세요)', '전송 완료');
                setStep('verify');
            } else {
                await showAlert(data.error || '요청 실패', '오류');
            }
        } catch (error) {
            await showAlert('서버 통신 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 비밀번호 변경 요청
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!code) {
            showAlert('인증코드를 입력해주세요.');
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*[!@#$%^&*])|(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            showAlert('비밀번호는 8자 이상, 영문/숫자/특수문자 중 2가지 이상 조합이어야 합니다.');
            return;
        }

        if (newPassword !== confirmPassword) {
            showAlert('비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/password/verify-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid, code, newPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                await showAlert('비밀번호가 성공적으로 변경되었습니다.\n로그인해주세요.', '변경 완료');
                router.push('/login');
            } else {
                await showAlert(data.error || '변경 실패', '오류');
            }
        } catch (error) {
            await showAlert('서버 통신 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-background">
            <div className="w-full max-w-[360px] bg-card rounded-xl border border-border shadow-sm p-6 relative">

                {/* 뒤로가기 (상단) */}
                <div className="absolute top-4 left-4">
                    <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                </div>

                <div className="text-center mb-8 pt-4">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                        <LockKeyhole size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-primary mb-1">비밀번호 재설정</h1>
                    <p className="text-sm text-muted-foreground">
                        {step === 'request' ? '가입 시 등록한 정보를 입력하세요' : '인증코드를 입력하고 비밀번호를 변경하세요'}
                    </p>
                </div>

                {step === 'request' ? (
                    <form onSubmit={handleRequestCode} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-foreground">아이디</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-muted text-foreground focus:border-primary focus:outline-none transition-colors"
                                placeholder="아이디 입력"
                                value={userid}
                                onChange={(e) => setUserid(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-foreground">이메일</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-muted text-foreground focus:border-primary focus:outline-none transition-colors"
                                placeholder="가입 시 등록한 이메일"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors mt-2 disabled:opacity-70"
                        >
                            {isLoading ? '전송 중...' : '인증코드 받기'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-foreground">인증코드</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-muted text-foreground focus:border-primary focus:outline-none text-center tracking-widest font-bold"
                                placeholder="6자리 코드 입력"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>

                        <div className="h-px bg-border my-1" />

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-foreground">새 비밀번호</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-muted text-foreground focus:border-primary focus:outline-none"
                                placeholder="새 비밀번호 (8자 이상)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-foreground">새 비밀번호 확인</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-muted text-foreground focus:border-primary focus:outline-none"
                                placeholder="비밀번호 확인"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle size={12} /> 일치하지 않습니다.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors mt-2 disabled:opacity-70"
                        >
                            {isLoading ? '처리 중...' : '비밀번호 변경하기'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}