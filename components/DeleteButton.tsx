// 📁 components/DeleteButton.tsx

'use client';

import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
    postId: string;
}

export default function DeleteButton({ postId }: DeleteButtonProps) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            return;
        }

        try {
            // DELETE API 호출: /api/community/[id]
            const response = await fetch(`/api/community/${postId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('게시글이 성공적으로 삭제되었습니다.');
                router.push('/community'); // 목록 페이지로 리다이렉트
            } else {
                const errorData = await response.json();
                alert(`삭제 실패: ${errorData.error || response.statusText}`);
            }

        } catch (error) {
            console.error('삭제 중 통신 오류:', error);
            alert('삭제 중 서버와 통신 오류가 발생했습니다.');
        }
    };

    return (
        <button 
            onClick={handleDelete} 
            className="btn btn-outline" 
            style={{ borderColor: '#dc2626', color: '#dc2626' }}
        >
            삭제
        </button>
    );
}