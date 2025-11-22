'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useGlobalModal } from '@/components/GlobalModal'; // ⭐️ Import

export default function EditProfilePage() {
    const router = useRouter();
    const { showAlert } = useGlobalModal(); // ⭐️ Hook

    const [currentUserId, setCurrentUserId] = useState('');
    const [name, setName] = useState('');
    const [newUserId, setNewUserId] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const storedId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
        const storedName = localStorage.getItem('userName');

        if (storedId) {
            setCurrentUserId(storedId);
            setNewUserId(storedId);
            setName(storedName || '');
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
                }),
            });

            const data = await res.json();

            if (res.ok) {
                await showAlert('프로필이 성공적으로 수정되었습니다.', '수정 완료');

                localStorage.setItem('userId', data.user.userid);
                localStorage.setItem('userEmail', data.user.userid);
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
        <main className="min-h-screen bg-gray-50 pb-24">
            <div className="max-w-[393px] mx-auto bg-white min-h-screen">

                <div className="sticky top-0 bg-white z-10 px-4 py-4 flex items-center gap-3 border-b border-gray-100">
                    <Link href="/profile" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-gray-700" />
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900">프로필 수정</h1>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSave} className="flex flex-col gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 border-l-4 border-blue-500 pl-2">기본 정보</h3>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="text-sm font-semibold text-gray-700">이름</label>
                                <input
                                    id="name"
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="userid" className="text-sm font-semibold text-gray-700">아이디</label>
                                <input
                                    id="userid"
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                                    value={newUserId}
                                    onChange={(e) => setNewUserId(e.target.value)}
                                />
                                <p className="text-xs text-gray-400 pl-1">
                                    * 아이디 변경 시 다시 로그인해야 할 수 있습니다.
                                </p>
                            </div>
                        </div>

                        <hr className="border-gray-100 my-2" />

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 border-l-4 border-blue-500 pl-2">보안 설정</h3>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="new-password" className="text-sm font-semibold text-gray-700">새 비밀번호 (변경 시 입력)</label>
                                <input
                                    id="new-password"
                                    type="password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                                    placeholder="변경하려면 입력하세요"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            {newPassword && (
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700">새 비밀번호 확인</label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-all ${confirmPassword && newPassword !== confirmPassword
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/10'
                                            }`}
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

                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mt-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="current-password" className="text-sm font-bold text-yellow-800">
                                    현재 비밀번호 확인 (필수)
                                </label>
                                <input
                                    id="current-password"
                                    type="password"
                                    className="w-full px-4 py-3 border border-yellow-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all bg-white"
                                    placeholder="본인 확인을 위해 입력해주세요"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-2 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
                        >
                            변경사항 저장
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}