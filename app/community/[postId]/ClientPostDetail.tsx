// 📁 app/community/[postId]/ClientPostDetail.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ThumbsUp, MessageSquare, Edit, Trash, Check, X, CornerDownRight, MessageCircle } from 'lucide-react';
import DeleteButton from '@/components/DeleteButton';
import { useGlobalModal } from '@/components/GlobalModal';

interface PostData {
    _id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    userId: string;
    views: number;
    likes: string[];
    images?: string[];
    createdAt: string;
}

interface CommentData {
    _id: string;
    postId: string;
    userId: string;
    author: string;
    content: string;
    createdAt: string;
    school?: string;
    parentId?: string; // ⭐️ 대댓글 부모 ID
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
    const router = useRouter();
    const { showAlert, showConfirm } = useGlobalModal();
    const [postData, setPostData] = useState<PostData>(initialPost);
    const [comments, setComments] = useState<CommentData[]>(initialComments);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [userSchool, setUserSchool] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    // ⭐️ 대댓글 관련 상태
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUserId(localStorage.getItem('userId'));
            setUserSchool(localStorage.getItem('userSchool'));
        }
    }, []);

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

    // 댓글 작성 (부모 댓글)
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !currentUserId || !postData) {
            showAlert("댓글 내용을 입력하거나 로그인이 필요합니다.");
            return;
        }

        setIsSubmittingComment(true);
        const userName = isAnonymous ? '익명' : (localStorage.getItem('userName') || '익명');

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
                setIsAnonymous(false);
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

    // ⭐️ 대댓글 작성
    const handleReplySubmit = async (parentId: string) => {
        if (!replyContent.trim() || !currentUserId) {
            showAlert("답글 내용을 입력해주세요.");
            return;
        }

        const userName = isAnonymous ? '익명' : (localStorage.getItem('userName') || '익명');

        const payload = {
            postId: postData._id,
            userId: currentUserId,
            author: userName,
            content: replyContent.trim(),
            school: userSchool,
            parentId: parentId, // ⭐️ 부모 ID 포함
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
                setReplyContent('');
                setReplyingToId(null); // 답글 입력창 닫기
                setIsAnonymous(false);
            } else {
                const errorData = await response.json();
                showAlert(`답글 작성 실패: ${errorData.error || '오류가 발생했습니다.'}`);
            }
        } catch (error) {
            console.error('Reply error:', error);
            showAlert('답글 작성 중 오류가 발생했습니다.');
        }
    };

    const handleStartEdit = (comment: CommentData) => {
        if (currentUserId !== comment.userId) {
            showAlert('본인의 댓글만 수정할 수 있습니다.');
            return;
        }
        setEditingCommentId(comment._id);
        setEditingContent(comment.content);
        setReplyingToId(null); // 수정 시 답글 입력창 닫기
    };

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
                    currentUserId
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

    const handleDeleteComment = useCallback(async (commentId: string) => {
        const confirmed = await showConfirm('정말로 이 댓글을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.', '삭제 확인', true);
        if (!confirmed) return;

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentUserId }),
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

    // ⭐️ 댓글 그룹화 (부모-자식)
    const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

    // ⭐️ 재귀적 댓글 렌더링 함수
    const renderCommentTree = (comment: CommentData, depth: number = 0) => {
        const isEditing = editingCommentId === comment._id;
        const isCommentOwner = currentUserId === comment.userId;
        const isReplying = replyingToId === comment._id;
        const replies = getReplies(comment._id);
        const hasParent = !!comment.parentId;

        // ⭐️ 들여쓰기 제한 (최대 5단계까지만 들여쓰기 적용, 그 이후는 평탄하게)
        const maxDepth = 5;
        const shouldIndent = depth < maxDepth;

        return (
            <div key={comment._id} className="flex flex-col">
                <div className={`p-3 rounded-xl border mb-2 ${hasParent ? 'bg-muted/50 border-border/50' : 'bg-muted border-border'}`}>
                    <div className='flex justify-between items-start mb-1'>
                        <div className="flex items-center gap-2">
                            {hasParent && <CornerDownRight size={14} className="text-muted-foreground" />}
                            <span className='font-medium text-sm text-foreground'>{comment.author}</span>
                            {comment.school && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                    {comment.school}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2 text-xs text-muted-foreground items-center">
                            {/* 답글 달기 버튼 (모든 댓글에 표시 - 대댓글의 대댓글 가능) */}
                            {!isEditing && currentUserId && (
                                <button
                                    onClick={() => {
                                        setReplyingToId(isReplying ? null : comment._id);
                                        setReplyContent('');
                                    }}
                                    className={`flex items-center gap-1 hover:text-foreground transition-colors ${isReplying ? 'text-primary' : ''}`}
                                >
                                    <MessageCircle size={14} />
                                    <span>답글</span>
                                </button>
                            )}

                            {isCommentOwner && (
                                <>
                                    <span className="text-border">|</span>
                                    {isEditing ? (
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
                                </>
                            )}
                        </div>
                    </div>

                    {isEditing ? (
                        <textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            rows={1}
                            className='w-full p-2 bg-card border border-primary/50 text-foreground rounded-lg text-sm resize-none focus:outline-none'
                        />
                    ) : (
                        <p className='text-sm text-foreground break-words whitespace-pre-wrap'>{comment.content}</p>
                    )}

                    <div className='text-xs text-muted-foreground mt-1'>
                        {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {/* ⭐️ 답글 작성 폼 */}
                    {isReplying && (
                        <div className="mt-3 pl-4 border-l-2 border-primary/20 animate-in fade-in slide-in-from-top-2">
                            <div className="flex gap-2">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`@${comment.author}님에게 답글 작성...`}
                                    className="flex-1 p-2 bg-card border border-border rounded-lg text-sm resize-none focus:outline-none focus:border-primary"
                                    rows={1}
                                    autoFocus
                                />
                                <button
                                    onClick={() => handleReplySubmit(comment._id)}
                                    className="px-3 py-2 bg-primary text-primary-foreground text-xs rounded-lg hover:bg-primary/90 whitespace-nowrap"
                                >
                                    등록
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                        className="w-3 h-3 rounded border-border text-primary"
                                    />
                                    <span>익명</span>
                                </label>
                                <button
                                    onClick={() => setReplyingToId(null)}
                                    className="text-xs text-muted-foreground hover:text-foreground ml-auto"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ⭐️ 재귀적으로 자식 댓글 렌더링 (들여쓰기 적용) */}
                {replies.length > 0 && (
                    <div className={`${shouldIndent ? 'pl-3 sm:pl-6 border-l border-border/30 ml-1 sm:ml-2' : 'mt-1'}`}>
                        {replies.map(reply => renderCommentTree(reply, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    const rootComments = comments.filter(c => !c.parentId);

    return (
        <div className="flex flex-col min-h-full bg-background pb-24">
            <div className="bg-card border-b border-border px-6 py-3 sticky top-0 z-10">
                <Link href="/community" className="flex items-center gap-2 text-muted-foreground hover:bg-accent w-fit px-2 py-1 rounded-md transition-colors">
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">뒤로가기</span>
                </Link>
            </div>

            <div className="bg-card border-b border-border p-6 mb-2">
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

                {postData.images && postData.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                        {postData.images.map((img, index) => (
                            <div key={index} className="flex-shrink-0 rounded-xl overflow-hidden border border-border">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img}
                                    alt={`post-image-${index}`}
                                    className="h-64 w-auto object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                    <span className="font-medium text-foreground">{postData.author}</span>
                    <span>•</span>
                    <span>{new Date(postData.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>조회 {postData.views}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
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
                        <DeleteButton postId={postData._id} postUserId={postData.userId} />
                    </div>
                </div>
            </div>

            <div className="bg-card p-6 flex-1">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-1">
                    댓글 <span className="text-primary">{comments.length}</span>
                </h3>

                <div className='space-y-4 mb-6'>
                    {rootComments.length > 0 ? (
                        rootComments.map((comment) => renderCommentTree(comment))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground bg-muted rounded-xl border border-border border-dashed">
                            <MessageSquare size={24} className="mx-auto mb-2 opacity-20" />
                            첫 댓글을 남겨보세요!
                        </div>
                    )}
                </div>

                <form onSubmit={handleCommentSubmit} className='mt-4 pt-4 border-t border-border'>
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={currentUserId ? '댓글을 입력하세요...' : '댓글을 작성하려면 로그인하세요.'}
                        disabled={!currentUserId || isSubmittingComment}
                        rows={1}
                        className='w-full p-3 bg-muted border border-border text-foreground rounded-xl text-sm resize-none focus:outline-none focus:border-primary transition-all'
                    />

                    <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                            />
                            <span>익명으로 작성</span>
                        </label>

                        <button
                            type='submit'
                            disabled={!currentUserId || isSubmittingComment || !commentText.trim()}
                            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:bg-muted-foreground/50 transition-colors"
                        >
                            {isSubmittingComment ? '작성 중...' : '댓글 등록'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}