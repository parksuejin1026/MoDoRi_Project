// 📁 app/community/page.tsx
import Link from 'next/link';
// ⭐️ [수정] Post 대신 PostModel을 lib/db/mongodb에서 가져옵니다.
import dbConnect, { PostModel } from '@/lib/db/mongodb';
// import Post from '@/models/Post'; // 🚨 이 줄은 삭제되었습니다.
import { MessageSquare, ThumbsUp, Clock, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getPosts() {
    try {
        await dbConnect();
        // ⭐️ [수정] Post.find() 대신 PostModel.find()를 사용합니다.
        const posts = await PostModel.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        return [];
    }
}

export default async function CommunityPage() {
    const posts = await getPosts();

    return (
        // ⭐️ [수정] 배경 색상 테마 변수 적용
        <div className="flex-1 overflow-y-auto p-6 pb-24 relative min-h-screen bg-background">

            {/* 타이틀 영역 */}
            <div className="mb-8">
                {/* ⭐️ [수정] 텍스트 색상 테마 변수 적용 */}
                <h2 className="text-2xl font-bold text-foreground mb-2">커뮤니티</h2>
                <p className="text-sm text-muted-foreground">학칙에 대한 질문과 정보를 공유해보세요</p>
            </div>

            {/* 카테고리 필터 */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {['전체', '질문', '정보공유', '자유'].map((cat, idx) => (
                    <button
                        key={cat}
                        className={`whitespace-nowrap px-3 py-2 rounded-md text-sm border transition-colors shadow-sm ${idx === 0
                            ? 'bg-primary text-primary-foreground border-primary'
                            // ⭐️ [수정] 배경/경계/텍스트 색상 테마 변수 적용
                            : 'bg-card text-foreground border-border hover:bg-accent'
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
                            // ⭐️ [수정] 카드 테마 변수 적용
                            className="block bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {/* 배지 색상은 유지 */}
                                <span className="px-2 py-1 rounded text-xs font-medium border bg-blue-50 text-blue-600 border-blue-200">
                                    자유
                                </span>
                                {/* ⭐️ [수정] 텍스트 색상 테마 변수 적용 */}
                                <span className="text-xs text-muted-foreground">동양미래대학교</span>
                            </div>

                            {/* ⭐️ [수정] 텍스트 색상 테마 변수 적용 */}
                            <h3 className="text-foreground font-medium mb-1 truncate">{post.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.content}</p>

                            {/* ⭐️ [수정] 경계선/텍스트 색상 테마 변수 적용 */}
                            <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
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
                    // ⭐️ [수정] 배경/텍스트 색상 테마 변수 적용
                    <div className="text-center py-20 text-muted-foreground bg-card rounded-xl border border-border border-dashed">
                        <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
                        <p>아직 작성된 글이 없습니다</p>
                        <p className="text-sm">첫 번째 글을 작성해보세요!</p>
                    </div>
                )}
            </div>

            {/* 글쓰기 버튼 (FAB) - 색상 유지 */}
            <div className="fixed bottom-0 inset-x-0 max-w-[393px] mx-auto z-50 pointer-events-none">
                <Link
                    href="/community/add"
                    className="absolute bottom-20 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-90 pointer-events-auto"
                >
                    <Plus size={24} />
                </Link>
            </div>
        </div>
    );
}