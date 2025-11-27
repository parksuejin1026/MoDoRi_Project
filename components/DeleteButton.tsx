// 📁 components/DeleteButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGlobalModal } from './GlobalModal';

interface DeleteButtonProps {
    postId: string;
    postUserId: string; // ⭐️ 게시물 작성자의 ID
}

export default function DeleteButton({ postId, postUserId }: DeleteButtonProps) {
    const router = useRouter();
    const { showConfirm, showAlert } = useGlobalModal(); // ⭐️ Modal Hook 사용
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // ⭐️ 클라이언트에서 localStorage에서 현재 사용자 ID를 불러옵니다.
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUserId(localStorage.getItem('userId'));
        }
    }, []);

    // ⭐️ [점검] 현재 사용자가 게시물 작성자가 아니면 버튼을 표시하지 않습니다.
    if (!currentUserId || currentUserId !== postUserId) {
        // 레이아웃을 위해 빈 공간을 반환합니다.
        return <span className="p-3"></span>;
    }


    const handleDelete = async () => {
        const confirmed = await showConfirm('정말로 이 게시물을 삭제하시겠습니까?', '삭제 확인', true);
        if (!confirmed) return;

        try {
            const response = await fetch(`/api/community/${postId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentUserId }), // 서버에 ID를 보내 권한을 다시 확인
            });

            if (response.ok) {
                await showAlert('게시물이 삭제되었습니다.', '삭제 완료');
                router.push('/community');
                router.refresh();
            } else if (response.status === 403) {
                await showAlert('권한이 없습니다. 본인의 게시물만 삭제할 수 있습니다.', '권한 오류');
            }
            else {
                const errorData = await response.json();
                await showAlert(`삭제 실패: ${errorData.error || response.statusText}`, '삭제 오류');
            }
        } catch (error) {
            console.error('삭제 오류:', error);
            await showAlert('삭제 중 서버 오류가 발생했습니다.', '통신 오류');
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
        >
            <Trash size={16} />
            <span>삭제</span>
        </button>
    );
}