// 📁 components/EditForm.tsx (클라이언트 컴포넌트)

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PostData {
    _id: string;
    title: string;
    content: string;
    author: string;
}

interface EditFormProps {
    initialPost: PostData; // 서버에서 불러온 초기 데이터
}

export default function EditForm({ initialPost }: EditFormProps) {
    const router = useRouter();

    const [title, setTitle] = useState(initialPost.title);
    const [content, setContent] = useState(initialPost.content);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const postId = initialPost._id;

    // 수정 제출 처리 함수 (PATCH API 호출)
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault(); 
        if (!title.trim() || !content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // PATCH API 호출: /api/community/[id]
            const response = await fetch(`/api/community/${postId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
            });

            if (response.ok) {
                alert('게시글이 성공적으로 수정되었습니다!');
                router.push(`/community/${postId}`); // 상세 페이지로 이동
            } else {
                const errorData = await response.json();
                setError(errorData.error || '수정에 실패했습니다.');
            }
        } catch (err) {
            setError('서버 통신 오류로 수정에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    }, [title, content, postId, router, isSubmitting]);

    return (
        <div className="write-container" style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--color-primary)' }}>
                게시글 수정하기
            </h1>
            
            {error && <div style={{ color: '#dc2626', marginBottom: '1rem', border: '1px solid #dc2626', padding: '10px' }}>오류: {error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* 메타 정보 */}
                <div style={{ padding: '10px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#f9fafb' }}>
                    <p>작성자: {initialPost.author}</p>
                </div>
                
                {/* 제목 입력 필드 */}
                <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isSubmitting}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                    />
                </div>

                {/* 내용 입력 필드 */}
                <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSubmitting}
                        rows={10}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '6px', resize: 'vertical' }}
                    />
                </div>

                {/* 버튼 영역 */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <Link href={`/community/${postId}`} className="btn btn-ghost">
                        취소
                    </Link>
                    <button
                        type="submit"
                        className="btn btn-primary btn-large"
                        disabled={isSubmitting}
                        style={{ opacity: isSubmitting ? 0.7 : 1 }}
                    >
                        {isSubmitting ? '수정 중...' : '수정 완료'}
                    </button>
                </div>
            </form>
        </div>
    );
}