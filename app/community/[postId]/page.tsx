// app/community/[postId]/page.tsx
import Link from 'next/link';
import dbConnect from '@/lib/db/mongodb';
import Post from '@/models/Post';
import { Types } from 'mongoose';
import DeleteButton from '@/components/DeleteButton';
import { ArrowLeft, ThumbsUp, MessageSquare, MoreVertical } from 'lucide-react';

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
        const post = await Post.findById(postId).lean();
        if (!post) return null;

        return {
            ...post,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
        } as PostData;
    } catch (error) {
        return null;
    }
}

export default async function PostDetailPage({ params }: { params: { postId: string } }) {
    const post = await getPost(params.postId);

    if (!post) {
        return <div className="p-6 text-center text-gray-500">게시글을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-24">
            {/* 헤더 */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-10">
                <Link href="/community" className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 w-fit px-2 py-1 rounded-md transition-colors">
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">뒤로가기</span>
                </Link>
            </div>

            {/* 게시글 본문 */}
            <div className="bg-white border-b border-gray-200 p-6 mb-2">
                {/* 카테고리 & 학교 배지 */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 rounded text-xs font-medium border bg-blue-50 text-blue-600 border-blue-100">
                        자유
                    </span>
                    <span className="text-xs text-gray-400">동양미래대학교</span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-4">{post.title}</h2>

                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-6 min-h-[100px]">
                    {post.content}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                    <span className="font-medium text-gray-700">{post.author}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>조회 {post.views}</span>
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
                        <ThumbsUp size={16} />
                        <span>좋아요 0</span>
                    </button>

                    <div className="flex gap-2">
                        <Link href={`/community/${post._id}/edit`} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            수정
                        </Link>
                        <DeleteButton postId={post._id} />
                    </div>
                </div>
            </div>

            {/* 댓글 영역 (UI 예시) */}
            <div className="bg-white p-6 flex-1">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-1">
                    댓글 <span className="text-blue-600">0</span>
                </h3>

                <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                    <MessageSquare size={24} className="mx-auto mb-2 opacity-20" />
                    아직 댓글이 없습니다.
                </div>
            </div>
        </div>
    );
}