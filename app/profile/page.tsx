// 📁 app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, School, CircleHelp, Shield, LogOut, Trash2, ChevronRight, X } from 'lucide-react';
import { useGlobalModal } from '@/components/GlobalModal';

export default function ProfilePage() {
    const router = useRouter();
    const { showConfirm, showAlert } = useGlobalModal();
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('Guest');
    const [userSchool, setUserSchool] = useState('');
    const [stats, setStats] = useState({ postCount: 0, commentCount: 0, likeCount: 0 });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');

    useEffect(() => {
        const storedId = localStorage.getItem('userId') || localStorage.getItem('userEmail');
        const storedName = localStorage.getItem('userName');
        const storedSchool = localStorage.getItem('userSchool');

        if (storedId) {
            setUserId(storedId);
            setUserName(storedName || storedId);
            if (storedSchool) setUserSchool(storedSchool);

            fetchStats(storedId, storedSchool);
        } else {
            router.replace('/login');
        }
    }, [router]);

    const fetchStats = async (id: string, school: string | null) => {
        try {
            let url = `/api/user/stats?userId=${id}`;
            if (school) {
                url += `&school=${encodeURIComponent(school)}`;
            }
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setStats(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    const avatarLetter = userName.charAt(0).toUpperCase();

    const handleLogout = async () => {
        const confirmed = await showConfirm('로그아웃 하시겠습니까?', '로그아웃');
        if (confirmed) {
            localStorage.clear();
            window.location.href = '/login';
        }
    };

    const onClickDelete = () => {
        setDeletePassword('');
        setIsDeleteModalOpen(true);
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            await showAlert('비밀번호를 입력해주세요.');
            return;
        }

        const confirmed = await showConfirm('정말로 탈퇴하시겠습니까?\n이 작업은 되돌릴 수 없습니다.', '탈퇴 확인', true);
        if (!confirmed) return;

        try {
            const res = await fetch('/api/auth/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userid: userId,
                    password: deletePassword
                }),
            });

            const data = await res.json();

            if (res.ok) {
                await showAlert('계정이 성공적으로 삭제되었습니다.', '탈퇴 완료');
                localStorage.clear();
                window.location.href = '/login';
            } else {
                await showAlert(data.error || '탈퇴 처리에 실패했습니다.', '오류');
            }
        } catch (error) {
            console.error(error);
            await showAlert('서버 오류가 발생했습니다.', '오류');
        }
    };

    const MenuSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="mb-6">
            <div className="text-sm font-semibold text-muted-foreground mb-3 pl-2">{title}</div>
            <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
                {children}
            </div>
        </div>
    );

    const MenuItem = ({ icon: Icon, text, onClick, isDanger = false }: any) => (
        <div
            onClick={onClick}
            className={`flex items-center justify-between p-4 border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-accent active:bg-accent/50`}
        >
            <div className="flex items-center gap-3">
                <Icon size={20} className={isDanger ? "text-red-500" : "text-muted-foreground"} />
                <span className={`text-sm font-medium ${isDanger ? "text-red-500" : "text-foreground"}`}>{text}</span>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
        </div>
    );

    return (
        <main className="flex-1 p-6 pb-24 bg-background min-h-screen relative">
            <div className="max-w-[393px] mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">프로필</h2>
                    <p className="text-sm text-muted-foreground">계정 정보 및 설정을 관리하세요</p>
                </div>

                <div className="bg-card rounded-xl p-6 mb-6 shadow-sm border border-border">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-2xl font-semibold shadow-md">
                            {avatarLetter}
                        </div>
                        <div>
                            <div className="text-xl font-bold text-foreground mb-1">{userName}</div>
                            <div className="text-sm text-muted-foreground">{userId}</div>
                            <div className="text-xs text-blue-600 mt-1 font-medium">{userSchool}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary mb-1">{stats.postCount}</div>
                            <div className="text-xs text-muted-foreground">작성한 글</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary mb-1">{stats.commentCount}</div>
                            <div className="text-xs text-muted-foreground">댓글</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary mb-1">{stats.likeCount}</div>
                            <div className="text-xs text-muted-foreground">좋아요</div>
                        </div>
                    </div>
                </div>

                <MenuSection title="계정 설정">
                    <MenuItem icon={User} text="프로필 수정" onClick={() => router.push('/profile/edit')} />
                    <MenuItem
                        icon={School}
                        text="학교 변경"
                        onClick={() => router.push('/select-school?from=profile')}
                    />
                </MenuSection>

                <MenuSection title="기타">
                    <MenuItem icon={CircleHelp} text="도움말" onClick={() => router.push('/help')} />
                    <MenuItem icon={Shield} text="개인정보 처리방침" onClick={() => router.push('/privacy')} />
                </MenuSection>

                <div className="mt-8">
                    <div className="text-sm font-semibold text-red-500 mb-3 pl-2">위험 영역</div>
                    <div className="bg-card rounded-xl overflow-hidden border border-red-100 shadow-sm">
                        <MenuItem icon={LogOut} text="로그아웃" onClick={handleLogout} isDanger />
                        <MenuItem icon={Trash2} text="계정 탈퇴" onClick={onClickDelete} isDanger />
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-muted-foreground">
                        유니메이트 UniMate v2.0.0
                    </p>
                </div>
            </div>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-card rounded-2xl w-full max-w-[320px] p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-foreground">계정 탈퇴</h3>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.<br />
                            본인 확인을 위해 비밀번호를 입력해주세요.
                        </p>

                        <div className="space-y-4">
                            <input
                                type="password"
                                placeholder="비밀번호 입력"
                                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all bg-muted text-foreground"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                            />

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 py-3 text-sm font-medium text-foreground bg-muted rounded-xl hover:bg-muted/70 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                                >
                                    탈퇴하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}