// 📁 app/community/page.tsx
import Link from 'next/link';
import dbConnect from '@/lib/db/mongodb';
import Post from '@/models/Post';
import { MessageSquare, ThumbsUp, Clock, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getPosts() {
    try {
        await dbConnect();
        const posts = await Post.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        return [];
    }
}

export default async function CommunityPage() {
    const posts = await getPosts();

    return (
        <div className="flex-1 overflow-y-auto p-6 pb-24 relative min-h-screen bg-gray-50">

            {/* 타이틀 영역 */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">커뮤니티</h2>
                <p className="text-sm text-gray-500">학칙에 대한 질문과 정보를 공유해보세요</p>
            </div>

            {/* 카테고리 필터 */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {['전체', '질문', '정보공유', '자유'].map((cat, idx) => (
                    <button
                        key={cat}
                        className={`whitespace-nowrap px-3 py-2 rounded-md text-sm border transition-colors shadow-sm ${idx === 0
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* 게시글 목록 */}
            <div className="flex flex-col gap-4">
                {posts.length > 0 ? (
                    posts.map((post: any) => (
                        <Link
                            href={`/community/${post._id}`}
                            key={post._id}
                            className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 rounded text-xs font-medium border bg-blue-50 text-blue-600 border-blue-200">
                                    자유
                                </span>
                                <span className="text-xs text-gray-500">동양미래대학교</span>
                            </div>

                            <h3 className="text-gray-900 font-medium mb-1 truncate">{post.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.content}</p>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <ThumbsUp size={14} />
                                        <span>{post.likes || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageSquare size={14} />
                                        <span>{post.views || 0}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
                        <p>아직 작성된 글이 없습니다</p>
                        <p className="text-sm">첫 번째 글을 작성해보세요!</p>
                    </div>
                )}
            </div>

            {/* ⭐️ [수정] 글쓰기 버튼 (FAB) - Fixed Wrapper 패턴 적용 */}
            {/* 1. Wrapper: Fixed로 뷰포트에 고정하되, App의 max-width에 맞춰 중앙 정렬 */}
            <div className="fixed bottom-0 inset-x-0 max-w-[393px] mx-auto z-50 pointer-events-none">
                <Link
                    href="/community/add"
                    // 2. Button: Absolute로 Wrapper의 오른쪽 하단에 정확히 배치 (bottom-20 유지)
                    className="absolute bottom-20 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-90 pointer-events-auto"
                >
                    <Plus size={24} />
                </Link>
            </div>
        </div>
    );
}