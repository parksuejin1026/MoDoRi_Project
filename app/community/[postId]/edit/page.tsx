// 📁 app/community/(post-group)/[postId]/edit/page.tsx (게시글 수정 폼)

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// UI에 필요한 데이터 타입 정의
interface PostData {
    _id: string;
    title: string;
    content: string;
    author: string;
}

// URL 파라미터 타입 정의
interface EditPageProps {
    params: {
        postId: string; 
    }
}

export default function EditPage({ params }: EditPageProps) {
    const { postId } = params;
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const router = useRouter();

    // 1. 게시글 데이터 로딩 (GET API 호출)
    useEffect(() => {
        const fetchPost = async () => {
            try {
                // 동적 API 경로: /api/community/[postId] 로 GET 요청
                const response = await fetch(`/api/community/${postId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || '데이터 로드 실패');
                }

                const result = await response.json();
                const post: PostData = result.data;
                
                setTitle(post.title);
                setContent(post.content);
                setAuthor(post.author);
                
            } catch (err: any) {
                console.error("게시글 로드 오류:", err.message);
                setError('게시글 데이터를 불러오는 데 실패했습니다: ' + err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId]);


    // 2. 게시글 수정 제출 (PUT API 호출)
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault(); 

        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해 주세요.');
            return;
        }

        setIsSubmitting(true);

        try {
            // 동적 API 경로: /api/community/[postId] 로 PUT 요청
            const response = await fetch(`/api/community/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content,
                    author,
                }),
            });

            if (response.ok) {
                alert('게시글이 성공적으로 수정되었습니다!');
                router.push(`/community/${postId}`); // 상세 페이지로 이동
            } else {
                const errorData = await response.json();
                alert(`게시글 수정 실패: ${errorData.error || response.statusText}`);
            }
        } catch (error) {
            console.error('게시글 수정 통신 오류:', error);
            alert('서버와 통신하는 도중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    }, [title, content, author, postId, router]);

    // 로딩 및 에러 상태 처리
    if (isLoading) {
        return <div style={{ textAlign: 'center', margin: '50px 0' }}>데이터 로딩 중...</div>;
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', margin: '50px 0', color: '#dc2626' }}>
                <p>{error}</p>
                <Link href="/community" style={{ marginTop: '10px', display: 'inline-block' }}>목록으로 돌아가기</Link>
            </div>
        );
    }
    
    // UI 렌더링
    return (
        <div className="edit-container" style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--color-primary)' }}>
                게시글 수정: {title}
            </h1>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* 제목 입력 필드 */}
                <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isSubmitting}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                        placeholder="제목을 입력하세요."
                    />
                </div>

                {/* 작성자 입력 필드 (비활성화 상태) */}
                <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>작성자</label>
                    <input
                        type="text"
                        value={author}
                        disabled
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#f5f5f5' }}
                        placeholder="작성자"
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
                        placeholder="게시글 내용을 입력하세요."
                    />
                </div>

                {/* 액션 버튼 */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                    <Link href={`/community/${postId}`} className="btn btn-outline" style={{ border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>
                        취소
                    </Link>
                    <button
                        type="submit"
                        className="btn btn-primary btn-large"
                        disabled={isSubmitting}
                        style={{ 
                            opacity: isSubmitting ? 0.7 : 1,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isSubmitting ? '수정 중...' : '수정 완료'}
                    </button>
                </div>
            </form>
        </div>
    );
}