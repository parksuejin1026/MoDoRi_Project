// components/DeleteButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteButton({ postId }: { postId: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('정말로 삭제하시겠습니까?')) return;

        try {
            const res = await fetch(`/api/community/${postId}`, { method: 'DELETE' });
            if (res.ok) {
                router.push('/community');
                router.refresh();
            } else {
                alert('삭제 실패');
            }
        } catch (error) {
            console.error(error);
            alert('오류 발생');
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
            <Trash2 size={16} />
            삭제
        </button>
    );
}