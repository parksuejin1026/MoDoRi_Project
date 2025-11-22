// 📁 app/community/[postId]/edit/page.tsx (게시글 수정 폼 - Tailwind 클래스 적용)

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
        return <div className="text-center my-12 text-muted-foreground">데이터 로딩 중...</div>;
    }

    if (error) {
        return (
            <div className="text-center my-12 text-red-600">
                <p>{error}</p>
                <Link href="/community" className="mt-4 inline-block text-primary hover:underline">목록으로 돌아가기</Link>
            </div>
        );
    }

    // ⭐️ [수정] Tailwind 클래스 적용
    return (
        // ⭐️ [수정] 배경색은 layout에서 처리되므로, 컨테이너 너비만 설정
        <div className="max-w-[700px] mx-auto p-6 min-h-screen">

            {/* ⭐️ [수정] 타이틀 클래스 적용 */}
            <h1 className="text-2xl font-bold mb-6 text-foreground">
                게시글 수정: {title}
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* 작성자 입력 필드 (비활성화 상태) */}
                <div className="space-y-2">
                    <label className="block font-semibold text-foreground">작성자</label>
                    <input
                        type="text"
                        value={author}
                        disabled
                        // ⭐️ [수정] 입력 필드 클래스 적용
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-muted text-muted-foreground/80 focus:outline-none cursor-not-allowed"
                        placeholder="작성자"
                    />
                </div>

                {/* 제목 입력 필드 */}
                <div className="space-y-2">
                    <label className="block font-semibold text-foreground">제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isSubmitting}
                        // ⭐️ [수정] 입력 필드 클래스 적용
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-card text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        placeholder="제목을 입력하세요."
                    />
                </div>

                {/* 내용 입력 필드 */}
                <div className="space-y-2">
                    <label className="block font-semibold text-foreground">내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSubmitting}
                        rows={10}
                        // ⭐️ [수정] 입력 필드 클래스 적용
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm min-h-[150px] resize-y bg-card text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        placeholder="게시글 내용을 입력하세요."
                    />
                </div>

                {/* 액션 버튼 */}
                <div className="flex justify-end gap-3 mt-4">
                    <Link
                        href={`/community/${postId}`}
                        // ⭐️ [수정] 버튼 클래스 적용 (취소 버튼)
                        className="py-3 px-6 text-sm font-medium border border-border rounded-xl text-muted-foreground hover:bg-accent transition-colors"
                    >
                        취소
                    </Link>
                    <button
                        type="submit"
                        // ⭐️ [수정] 버튼 클래스 적용 (수정 완료 버튼)
                        className="py-3 px-6 text-sm font-bold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                        disabled={isSubmitting || !title.trim() || !content.trim()}
                    >
                        {isSubmitting ? '수정 중...' : '수정 완료'}
                    </button>
                </div>
            </form>
        </div>
    );
}