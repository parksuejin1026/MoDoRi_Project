'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useGlobalModal } from '@/components/GlobalModal';

// UI에 필요한 데이터 타입 정의 (category 추가)
interface PostData {
    _id: string;
    title: string;
    content: string;
    author: string;
    category: '질문' | '정보공유' | '자유';
    userId: string;
}

interface EditPageProps {
    params: {
        postId: string;
    }
}

export default function EditPage({ params }: EditPageProps) {
    const { postId } = params;
    const router = useRouter();
    const { showAlert } = useGlobalModal();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState<'질문' | '정보공유' | '자유'>('자유');

    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. 게시글 데이터 로딩 및 권한 확인 (GET API 호출)
    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        setCurrentUserId(storedId);

        const fetchPost = async (userId: string | null) => {
            if (!userId) {
                showAlert('로그인이 필요합니다.');
                router.replace('/login');
                return;
            }

            try {
                const response = await fetch(`/api/community/${postId}`, { method: 'GET' });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || '데이터 로드 실패');
                }

                const result = await response.json();
                const post: PostData = result.data;

                if (post.userId !== userId) {
                    showAlert('본인의 게시물만 수정할 수 있습니다.');
                    router.replace(`/community/${postId}`);
                    return;
                }

                setTitle(post.title);
                setContent(post.content);
                setAuthor(post.author);
                setCategory(post.category);

            } catch (err: any) {
                console.error("게시글 로드 오류:", err.message);
                setError('게시글 데이터를 불러오는 데 실패했습니다: ' + err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (storedId !== null) {
            fetchPost(storedId);
        } else {
            setIsLoading(false);
            showAlert('로그인 정보가 없습니다.', '권한 오류');
            router.replace('/login');
        }
    }, [postId, router, showAlert]);


    // 2. 게시글 수정 제출 (PUT API 호출)
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            showAlert('제목과 내용을 모두 입력해 주세요.');
            return;
        }

        if (!currentUserId) {
            showAlert('사용자 인증 정보가 유효하지 않습니다.');
            router.replace('/login');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/community/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    author,
                    category,
                    currentUserId,
                }),
            });

            if (response.ok) {
                showAlert('게시글이 성공적으로 수정되었습니다!', '수정 완료');
                router.push(`/community/${postId}`);
            } else if (response.status === 403) {
                showAlert('본인의 게시물만 수정할 수 있습니다.', '권한 오류');
            } else {
                const errorData = await response.json();
                showAlert(`게시글 수정 실패: ${errorData.error || response.statusText}`, '수정 오류');
            }
        } catch (error) {
            console.error('게시글 수정 통신 오류:', error);
            showAlert('서버와 통신하는 도중 오류가 발생했습니다.', '통신 오류');
        } finally {
            setIsSubmitting(false);
        }
    }, [title, content, author, category, currentUserId, postId, router, showAlert]);

    if (isLoading) {
        return <div className="text-center my-12 text-muted-foreground">데이터 로딩 중...</div>;
    }

    if (error) {
        return (
            <div className="text-center my-12 text-red-600">
                <p className='flex items-center justify-center gap-2'><AlertCircle size={20} /> {error}</p>
                <Link href="/community" className="mt-4 inline-block text-primary hover:underline">목록으로 돌아가기</Link>
            </div>
        );
    }

    return (
        // ⭐️ [수정] min-h-screen 대신 min-h-full 사용, pb-24 추가하여 하단 탭바 공간 확보
        <div className="max-w-[700px] mx-auto p-6 min-h-full pb-24">

            <div className="flex items-center gap-2 mb-6">
                <Link href={`/community/${postId}`} className="text-muted-foreground hover:bg-accent p-1 rounded transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-foreground">
                    게시글 수정
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                <div className="space-y-2">
                    <label className="block font-semibold text-foreground">작성자</label>
                    <input
                        type="text"
                        value={author}
                        disabled
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-muted text-muted-foreground/80 focus:outline-none cursor-not-allowed"
                        placeholder="작성자"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block font-semibold text-foreground">카테고리</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as '질문' | '정보공유' | '자유')}
                        disabled={isSubmitting}
                        className="w-full p-3 bg-muted border border-border text-foreground rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
                    >
                        <option value="자유">자유</option>
                        <option value="질문">질문</option>
                        <option value="정보공유">정보공유</option>
                    </select>
                </div>


                <div className="space-y-2">
                    <label className="block font-semibold text-foreground">제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-card text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        placeholder="제목을 입력하세요."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block font-semibold text-foreground">내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSubmitting}
                        rows={10}
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm min-h-[150px] resize-y bg-card text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        placeholder="게시글 내용을 입력하세요."
                    />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Link
                        href={`/community/${postId}`}
                        className="py-3 px-6 text-sm font-medium border border-border rounded-xl text-muted-foreground hover:bg-accent transition-colors"
                    >
                        취소
                    </Link>
                    <button
                        type="submit"
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