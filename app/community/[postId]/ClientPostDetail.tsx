// 📁 app/community/[postId]/ClientPostDetail.tsx
'use client';
// ⭐️ [필수] 클라이언트 컴포넌트 선언

import Link from 'next/link';
// ⭐️ [점검] 표준 ES 모듈 임포트 유지
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react'; // ⭐️ useCallback, useEffect 임포트
import { ArrowLeft, ThumbsUp, MessageSquare, Edit, Trash, Check, X } from 'lucide-react'; // ⭐️ Trash, Check, X 아이콘 임포트
import DeleteButton from '@/components/DeleteButton';
import { useGlobalModal } from '@/components/GlobalModal'; // ⭐️ Global Modal Hook 임포트

interface PostData {
    _id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    userId: string;
    views: number;
    likes: string[];
    createdAt: string;
}

interface CommentData {
    _id: string;
    postId: string;
    userId: string;
    author: string;
    content: string;
    createdAt: string;
}


export default function ClientPostDetail({
    initialPost,
    initialComments,
    postId
}: {
    initialPost: PostData,
    initialComments: CommentData[],
    postId: string
}) {
    // ⭐️ 훅들을 안전하게 사용합니다.
    const router = useRouter();
    const { showAlert, showConfirm } = useGlobalModal(); // ⭐️ Global Modal Hook 사용
    const [postData, setPostData] = useState<PostData>(initialPost);
    const [comments, setComments] = useState<CommentData[]>(initialComments);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [userSchool, setUserSchool] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // ⭐️ [추가] 댓글 수정 상태 관리
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState('');


    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUserId(localStorage.getItem('userId'));
            setUserSchool(localStorage.getItem('userSchool'));
        }
    }, []);

    // 좋아요 기능 로직 (기존 유지)
    const handleLike = async () => {
        if (!currentUserId || !postData) {
            showAlert('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await fetch(`/api/community/${postData._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentUserId }),
            });

            if (response.ok) {
                const result = await response.json();
                setPostData((prev: PostData) => ({
                    ...prev,
                    likes: result.isLiked
                        ? [...(prev.likes || []), currentUserId]
                        : (prev.likes || []).filter((id: string) => id !== currentUserId),
                }));
            } else {
                showAlert('좋아요 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('Like error:', error);
        }
    };

    // 댓글 등록 로직 (기존 유지)
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !currentUserId || !postData) {
            showAlert("댓글 내용을 입력하거나 로그인이 필요합니다.");
            return;
        }

        setIsSubmittingComment(true);
        const userName = localStorage.getItem('userName') || '익명';

        const payload = {
            postId: postData._id,
            userId: currentUserId,
            author: userName,
            content: commentText.trim(),
            school: userSchool,
        };

        try {
            const response = await fetch(`/api/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const newComment = await response.json();
                setComments((prev: CommentData[]) => [...prev, newComment.data]);
                setCommentText('');

            } else {
                const errorData = await response.json();
                console.error("Comment API failed. Status:", response.status, "Error:", errorData);
                showAlert(`댓글 작성 실패: ${errorData.error || '알 수 없는 서버 오류'}`);
            }
        } catch (error) {
            console.error('Comment network error:', error);
            showAlert('댓글 작성 중 네트워크 통신 오류가 발생했습니다.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    // ⭐️ [추가] 댓글 수정 모드 시작
    const handleStartEdit = (comment: CommentData) => {
        if (currentUserId !== comment.userId) {
            showAlert('본인의 댓글만 수정할 수 있습니다.');
            return;
        }
        setEditingCommentId(comment._id);
        setEditingContent(comment.content);
    };

    // ⭐️ [추가] 댓글 수정 제출
    const handleEditSubmit = useCallback(async (commentId: string) => {
        if (!editingContent.trim()) {
            showAlert('수정할 내용을 입력해주세요.');
            return;
        }

        const confirmed = await showConfirm('댓글을 수정하시겠습니까?', '수정 확인');
        if (!confirmed) return;

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: editingContent,
                    currentUserId // 권한 검증용 ID
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setComments(prev => prev.map(c => c._id === commentId ? result.data : c));
                setEditingCommentId(null);
                setEditingContent('');
                showAlert('댓글이 수정되었습니다.', '수정 완료');
            } else if (response.status === 403) {
                showAlert('본인의 댓글만 수정할 수 있습니다.', '권한 오류');
            } else {
                const errorData = await response.json();
                showAlert(`댓글 수정 실패: ${errorData.error || response.statusText}`, '수정 오류');
            }
        } catch (error) {
            console.error('댓글 수정 오류:', error);
            showAlert('서버 통신 오류로 댓글 수정에 실패했습니다.');
        }
    }, [editingContent, currentUserId, showAlert, showConfirm]);

    // ⭐️ [추가] 댓글 삭제
    const handleDeleteComment = useCallback(async (commentId: string) => {
        const confirmed = await showConfirm('정말로 이 댓글을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.', '삭제 확인', true);
        if (!confirmed) return;

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentUserId }), // 권한 검증용 ID
            });

            if (response.ok) {
                setComments(prev => prev.filter(c => c._id !== commentId));
                showAlert('댓글이 삭제되었습니다.', '삭제 완료');
            } else if (response.status === 403) {
                showAlert('본인의 댓글만 삭제할 수 있습니다.', '권한 오류');
            } else {
                const errorData = await response.json();
                showAlert(`댓글 삭제 실패: ${errorData.error || response.statusText}`, '삭제 오류');
            }
        } catch (error) {
            console.error('댓글 삭제 오류:', error);
            showAlert('서버 통신 오류로 댓글 삭제에 실패했습니다.');
        }
    }, [currentUserId, showAlert, showConfirm]);


    const isOwner = currentUserId && currentUserId === postData.userId;
    const isLikedByUser = (postData.likes || []).includes(currentUserId || '');

    return (
        <div className="flex flex-col h-full bg-background overflow-y-auto pb-100">
            {/* 헤더 (기존 유지) */}
            <div className="bg-card border-b border-border px-6 py-3 sticky top-0 z-10">
                <Link href="/community" className="flex items-center gap-2 text-muted-foreground hover:bg-accent w-fit px-2 py-1 rounded-md transition-colors">
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">뒤로가기</span>
                </Link>
            </div>

            {/* 게시글 본문 */}
            <div className="bg-card border-b border-border p-6 mb-2">
                {/* 카테고리 & 학교 배지 */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 rounded text-xs font-medium border bg-blue-50 text-blue-600 border-blue-100">
                        {postData.category}
                    </span>
                    <span className="text-xs text-muted-foreground">동양미래대학교</span>
                </div>

                <h2 className="text-xl font-bold text-foreground mb-4">{postData.title}</h2>

                <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap mb-6 min-h-[100px]">
                    {postData.content}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                    <span className="font-medium text-foreground">{postData.author}</span>
                    <span>•</span>
                    <span>{new Date(postData.createdAt).toLocaleDateString()}</span>
                    {/* ⭐️ 조회수 표시 */}
                    <span>•</span>
                    <span>조회 {postData.views}</span>
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    {/* ⭐️ 좋아요 기능 및 개수 표시 */}
                    <button
                        onClick={handleLike}
                        disabled={!currentUserId}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors 
                            ${isLikedByUser
                                ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                                : 'bg-card border-border text-muted-foreground hover:bg-accent'
                            }`
                        }
                    >
                        <ThumbsUp size={16} />
                        <span>좋아요 {(postData.likes || []).length}</span>
                    </button>

                    {/* 수정/삭제 버튼 그룹화 */}
                    <div className="flex gap-2 items-center">
                        {isOwner && (
                            <Link
                                href={`/community/${postData._id}/edit`}
                                className="px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-1"
                            >
                                <Edit size={16} />
                                <span>수정</span>
                            </Link>
                        )}
                        {/* ⭐️ 게시물 삭제 (본인만 가능) */}
                        <DeleteButton postId={postData._id} postUserId={postData.userId} />
                    </div>
                </div>
            </div>

            {/* ⭐️ 댓글 영역 */}
            <div className="bg-card p-6 flex-1">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-1">
                    댓글 <span className="text-primary">{comments.length}</span>
                </h3>

                {/* 댓글 목록 */}
                <div className='space-y-4 mb-6'>
                    {comments.length > 0 ? (
                        comments.map((comment: CommentData) => {
                            const isEditing = editingCommentId === comment._id;
                            const isCommentOwner = currentUserId === comment.userId;

                            return (
                                <div key={comment._id} className='p-3 bg-muted rounded-xl border border-border'>
                                    <div className='flex justify-between items-start mb-1'>
                                        <span className='font-medium text-sm text-foreground'>{comment.author}</span>
                                        {/* ⭐️ 수정/삭제 버튼 */}
                                        {isCommentOwner && (
                                            <div className="flex gap-2 text-xs text-muted-foreground">
                                                {isEditing ? (
                                                    // 수정 중일 때
                                                    <div className='flex gap-1'>
                                                        <button
                                                            onClick={() => handleEditSubmit(comment._id)}
                                                            className='text-primary hover:text-primary/70'
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingCommentId(null)}
                                                            className='text-muted-foreground hover:text-foreground'
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    // 일반 상태일 때
                                                    <div className='flex gap-1'>
                                                        <button
                                                            onClick={() => handleStartEdit(comment)}
                                                            className='text-muted-foreground hover:text-primary'
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            className='text-muted-foreground hover:text-red-500'
                                                        >
                                                            <Trash size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* ⭐️ 댓글 내용 (수정 가능/불가능) - rows={1} 적용 */}
                                    {isEditing ? (
                                        <textarea
                                            value={editingContent}
                                            onChange={(e) => setEditingContent(e.target.value)}
                                            rows={1} // ⭐️ [수정 반영] 한 줄 크기로 줄임
                                            className='w-full p-2 bg-card border border-primary/50 text-foreground rounded-lg text-sm resize-none focus:outline-none'
                                        />
                                    ) : (
                                        <p className='text-sm text-foreground break-words'>{comment.content}</p>
                                    )}

                                    <div className='text-xs text-muted-foreground mt-1'>
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-muted-foreground bg-muted rounded-xl border border-border border-dashed">
                            <MessageSquare size={24} className="mx-auto mb-2 opacity-20" />
                            첫 댓글을 남겨보세요!
                        </div>
                    )}
                </div>

                {/* 댓글 작성 폼 */}
                <form onSubmit={handleCommentSubmit} className='mt-4 pt-4 border-t border-border'>
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={currentUserId ? '댓글을 입력하세요...' : '댓글을 작성하려면 로그인하세요.'}
                        disabled={!currentUserId || isSubmittingComment}
                        rows={1} // ⭐️ [수정 반영] 한 줄 크기로 줄임
                        className='w-full p-3 bg-muted border border-border text-foreground rounded-xl text-sm resize-none focus:outline-none focus:border-primary transition-all'
                    />
                    <button
                        type='submit'
                        disabled={!currentUserId || isSubmittingComment || !commentText.trim()}
                        className="mt-2 w-full px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:bg-muted-foreground/50 transition-colors"
                    >
                        {isSubmittingComment ? '작성 중...' : '댓글 등록'}
                    </button>
                </form>
            </div>
        </div>
    );
}