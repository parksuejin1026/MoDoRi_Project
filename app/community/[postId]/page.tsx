// 📁 app/community/[postId]/page.tsx
import Link from 'next/link';
import dbConnect from '@/lib/db/mongodb';
import Post from '@/models/Post';
import { Types } from 'mongoose';
import DeleteButton from '@/components/DeleteButton';
import { ArrowLeft, ThumbsUp, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

// 데이터 타입 정의
interface PostData {
    _id: string;
    title: string;
    content: string;
    author: string;
    views: number;
    createdAt: string;
}

async function getPost(postId: string): Promise<PostData | null> {
    if (!Types.ObjectId.isValid(postId)) return null;

    try {
        await dbConnect();
        // ⭐️ 조회수 증가 로직 (옵션)
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $inc: { views: 1 } },
            { new: true }
        ).lean();

        if (!updatedPost) return null;

        return {
            ...updatedPost,
            _id: updatedPost._id.toString(),
            createdAt: updatedPost.createdAt.toISOString(),
        } as PostData;
    } catch (error) {
        console.error("Error fetching or updating post views:", error);
        return null;
    }
}

export default async function PostDetailPage({ params }: { params: { postId: string } }) {
    const post = await getPost(params.postId);

    if (!post) {
        return <div className="p-6 text-center text-muted-foreground bg-background min-h-screen">게시글을 찾을 수 없습니다.</div>;
    }

    return (
        // ⭐️ [수정] 배경 색상 테마 변수 적용
        <div className="flex flex-col h-full bg-background overflow-y-auto pb-100">
            {/* 헤더 */}
            {/* ⭐️ [수정] 배경/경계/텍스트 색상 테마 변수 적용 */}
            <div className="bg-card border-b border-border px-6 py-3 sticky top-0 z-10">
                <Link href="/community" className="flex items-center gap-2 text-muted-foreground hover:bg-accent w-fit px-2 py-1 rounded-md transition-colors">
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">뒤로가기</span>
                </Link>
            </div>

            {/* 게시글 본문 */}
            {/* ⭐️ [수정] 배경/경계/텍스트 색상 테마 변수 적용 */}
            <div className="bg-card border-b border-border p-6 mb-2">
                {/* 카테고리 & 학교 배지 */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 rounded text-xs font-medium border bg-blue-50 text-blue-600 border-blue-100">
                        자유
                    </span>
                    <span className="text-xs text-muted-foreground">동양미래대학교</span>
                </div>

                <h2 className="text-xl font-bold text-foreground mb-4">{post.title}</h2>

                <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap mb-6 min-h-[100px]">
                    {post.content}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                    <span className="font-medium text-foreground">{post.author}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>조회 {post.views}</span>
                </div>

                {/* 액션 버튼 */}
                {/* ⭐️ [수정] 경계/텍스트 색상 테마 변수 적용 */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-muted-foreground text-sm hover:bg-accent transition-colors">
                        <ThumbsUp size={16} />
                        <span>좋아요 0</span>
                    </button>

                    <div className="flex gap-2">
                        <Link href={`/community/${post._id}/edit`} className="px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-lg transition-colors">
                            수정
                        </Link>
                        <DeleteButton postId={post._id} />
                    </div>
                </div>
            </div>

            {/* 댓글 영역 (UI 예시) */}
            {/* ⭐️ [수정] 배경/텍스트 색상 테마 변수 적용 */}
            <div className="bg-card p-6 flex-1">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-1">
                    댓글 <span className="text-primary">0</span>
                </h3>

                {/* ⭐️ [수정] 배경/경계/텍스트 색상 테마 변수 적용 */}
                <div className="text-center py-8 text-muted-foreground bg-muted rounded-xl border border-border border-dashed">
                    <MessageSquare size={24} className="mx-auto mb-2 opacity-20" />
                    아직 댓글이 없습니다.
                </div>
            </div>
        </div>
    );
}