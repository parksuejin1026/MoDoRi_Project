// 📁 app/profile/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useGlobalModal } from '@/components/GlobalModal';

export default function EditProfilePage() {
    const router = useRouter();
    const { showAlert } = useGlobalModal();

    const [currentUserId, setCurrentUserId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); // ⭐️ 이메일 상태 추가
    const [newUserId, setNewUserId] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('userEmail'); // ⭐️ 이메일 가져오기

        if (storedId) {
            setCurrentUserId(storedId);
            setNewUserId(storedId);
            setName(storedName || '');
            setEmail(storedEmail || storedId); // ⭐️ 이메일 초기화 (없으면 ID 사용)
        } else {
            router.replace('/login');
        }
    }, [router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword) {
            await showAlert('정보를 수정하려면 현재 비밀번호를 입력해야 합니다.');
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            await showAlert('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (newPassword && newPassword.length < 8) {
            await showAlert('새 비밀번호는 최소 8자 이상이어야 합니다.');
            return;
        }

        try {
            const res = await fetch('/api/auth/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentUserId,
                    currentPassword,
                    newUserId,
                    newPassword,
                    newName: name,
                    newEmail: email, // ⭐️ 이메일 전송
                }),
            });

            const data = await res.json();

            if (res.ok) {
                await showAlert('프로필이 성공적으로 수정되었습니다.', '수정 완료');

                localStorage.setItem('userId', data.user.userid);
                localStorage.setItem('userEmail', data.user.email); // ⭐️ 이메일 업데이트
                localStorage.setItem('userName', data.user.name);

                router.push('/profile');
            } else {
                await showAlert(data.error || '수정에 실패했습니다.', '수정 실패');
            }
        } catch (error) {
            console.error(error);
            await showAlert('서버 통신 오류가 발생했습니다.', '오류');
        }
    };

    return (
        <main className="min-h-screen bg-background pb-100">
            <div className="max-w-[393px] mx-auto bg-card min-h-screen">

                {/* 헤더 */}
                <div className="sticky top-0 bg-card z-10 px-4 py-4 flex items-center gap-3 border-b border-border">
                    <Link href="/profile" className="p-2 -ml-2 hover:bg-accent rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-muted-foreground" />
                    </Link>
                    <h1 className="text-lg font-bold text-foreground">프로필 수정</h1>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSave} className="flex flex-col gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-foreground border-l-4 border-primary pl-2">기본 정보</h3>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="text-sm font-semibold text-foreground">이름</label>
                                <input
                                    id="name"
                                    type="text"
                                    className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-muted text-foreground"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="userid" className="text-sm font-semibold text-foreground">아이디</label>
                                <input
                                    id="userid"
                                    type="text"
                                    className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-muted text-foreground"
                                    value={newUserId}
                                    onChange={(e) => setNewUserId(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground pl-1">
                                    * 아이디 변경 시 다시 로그인해야 할 수 있습니다.
                                </p>
                            </div>

                            {/* ⭐️ 이메일 입력 필드 추가 */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-sm font-semibold text-foreground">이메일</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-muted text-foreground"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="이메일을 입력하세요"
                                />
                            </div>
                        </div>

                        <hr className="border-border my-2" />

                        {/* 비밀번호 섹션 */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-foreground border-l-4 border-primary pl-2">보안 설정</h3>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="new-password" className="text-sm font-semibold text-foreground">새 비밀번호 (변경 시 입력)</label>
                                <input
                                    id="new-password"
                                    type="password"
                                    className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-muted text-foreground"
                                    placeholder="변경하려면 입력하세요"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            {newPassword && (
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="confirm-password" className="text-sm font-semibold text-foreground">새 비밀번호 확인</label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-all ${confirmPassword && newPassword !== confirmPassword
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                            : 'border-border focus:border-primary focus:ring-primary/10'
                                            } bg-muted text-foreground`}
                                        placeholder="한 번 더 입력하세요"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    {confirmPassword && newPassword !== confirmPassword && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle size={12} /> 비밀번호가 일치하지 않습니다.
                                        </p>
                                    )}
                                    {confirmPassword && newPassword === confirmPassword && (
                                        <p className="text-xs text-green-600 flex items-center gap-1">
                                            <CheckCircle2 size={12} /> 비밀번호가 일치합니다.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 현재 비밀번호 확인 섹션 */}
                        <div className="bg-yellow-50 dark:bg-yellow-950 px-4 py-3 rounded-xl border border-yellow-100 dark:border-yellow-900 mt-3">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="current-password" className="text-sm font-bold text-yellow-700 dark:text-yellow-400">
                                    현재 비밀번호 확인 (필수)
                                </label>
                                <input
                                    id="current-password"
                                    type="password"
                                    className="w-full px-4 py-3 border border-yellow-100 dark:border-yellow-900 rounded-lg text-sm focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all bg-card text-foreground"
                                    placeholder="본인 확인을 위해 입력해주세요"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-2 w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            변경사항 저장
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}