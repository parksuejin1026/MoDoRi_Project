// 📁 app/community/page.tsx
'use client';

import Link from 'next/link';
import { MessageSquare, ThumbsUp, Eye, Clock, Plus, Search } from 'lucide-react'; // ⭐️ Search 아이콘 추가
import { useState, useEffect, useCallback } from 'react'; // ⭐️ useCallback 추가
import { useSearchParams, useRouter } from 'next/navigation'; // ⭐️ useRouter 추가

interface PostData {
    _id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    userId: string;
    school?: string;
    views: number;
    likes: string[];
    createdAt: string;
    commentCount: number;
    likesCount: number;
}

export default function CommunityPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category') || '전체';
    // ⭐️ [추가] URL에서 현재 검색어 가져오기
    const currentSearchTerm = searchParams.get('search') || '';

    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [userSchool, setUserSchool] = useState<string>('');
    // ⭐️ [추가] 입력 필드 상태
    const [searchTermInput, setSearchTermInput] = useState(currentSearchTerm);

    // ⭐️ URL 상태가 변경될 때마다 입력 필드 상태를 동기화
    useEffect(() => {
        setSearchTermInput(currentSearchTerm);
    }, [currentSearchTerm]);


    const fetchPosts = useCallback(async (category: string, school: string | null, search: string) => {
        setLoading(true);
        try {
            let url = `/api/community?category=${category}`;
            if (school) {
                url += `&school=${encodeURIComponent(school)}`;
            }
            // ⭐️ [수정] 검색어 쿼리 파라미터 추가
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch posts');

            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    }, []); // fetchPosts 함수가 한번만 생성되도록 빈 의존성 배열 유지

    useEffect(() => {
        // 1. 로컬 스토리지에서 학교 정보 가져오기
        const storedSchool = localStorage.getItem('userSchool');
        if (storedSchool) {
            setUserSchool(storedSchool);
        }

        // 2. 게시물 데이터 가져오기 (의존성에 currentSearchTerm 추가)
        fetchPosts(currentCategory, storedSchool, currentSearchTerm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCategory, currentSearchTerm]); // ⭐️ [수정] currentSearchTerm 의존성 추가

    // ⭐️ [추가] 검색 제출 핸들러 (URL 업데이트)
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newParams = new URLSearchParams(searchParams.toString());

        if (searchTermInput.trim()) {
            newParams.set('search', searchTermInput.trim());
        } else {
            newParams.delete('search');
        }

        // 카테고리도 유지
        if (currentCategory && currentCategory !== '전체') {
            newParams.set('category', currentCategory);
        } else {
            newParams.delete('category');
        }

        // 페이지 이동 (URL 변경)
        router.push(`/community?${newParams.toString()}`);
    };


    return (
        <div className="flex-1 overflow-y-auto p-6 pb-24 relative min-h-screen bg-background">

            {/* 타이틀 영역 */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">커뮤니티</h2>
                <p className="text-sm text-muted-foreground">
                    {userSchool ? `${userSchool} 학생들과 소통해보세요` : '학칙에 대한 질문과 정보를 공유해보세요'}
                </p>
            </div>

            {/* ⭐️ [추가] 검색 입력 필드 UI */}
            <form onSubmit={handleSearchSubmit} className="relative mb-6">
                <input
                    type="text"
                    placeholder="제목이나 내용을 검색해보세요"
                    value={searchTermInput}
                    onChange={(e) => setSearchTermInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-foreground bg-card focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
                    aria-label="게시글 검색"
                >
                    <Search size={20} />
                </button>
            </form>


            {/* ⭐️ 카테고리 필터 UI (로직 수정) */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {['전체', '질문', '정보공유', '자유'].map((cat) => {
                    const newParams = new URLSearchParams(searchParams.toString());
                    newParams.delete('category');
                    if (cat !== '전체') newParams.set('category', cat);

                    return (
                        <Link
                            key={cat}
                            href={`/community?${newParams.toString()}`} // ⭐️ [수정] 검색어와 함께 카테고리 URL 업데이트
                            className={`whitespace-nowrap px-3 py-2 rounded-md text-sm border transition-colors shadow-sm 
                                ${currentCategory === cat
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-card text-foreground border-border hover:bg-accent'
                                }`
                            }
                        >
                            {cat}
                        </Link>
                    )
                })}
            </div>

            {/* 게시글 목록 */}
            <div className="flex flex-col gap-4">
                {loading ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>게시물을 불러오는 중...</p>
                    </div>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <Link
                            href={`/community/${post._id}`}
                            key={post._id}
                            className="block bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 rounded text-xs font-medium border bg-blue-50 text-blue-600 border-blue-200">
                                    {post.category}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {post.school || '학교 미지정'}
                                </span>
                            </div>

                            <h3 className="text-foreground font-medium mb-1 truncate">{post.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.content}</p>

                            {/* ⭐️ [최종 통계 정보 UI] 좋아요, 댓글, 조회수 표시 */}
                            <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                                <div className="flex items-center gap-4">

                                    {/* 좋아요 개수 */}
                                    <div className="flex items-center gap-1">
                                        <ThumbsUp size={14} />
                                        <span>{post.likesCount}</span>
                                    </div>

                                    {/* 댓글 개수 */}
                                    <div className="flex items-center gap-1">
                                        <MessageSquare size={14} />
                                        <span>{post.commentCount}</span>
                                    </div>

                                    {/* 조회수 */}
                                    <div className="flex items-center gap-1">
                                        <Eye size={14} />
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
                    <div className="text-center py-20 text-muted-foreground bg-card rounded-xl border border-border border-dashed">
                        <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
                        <p>현재 검색어/카테고리에 맞는 글이 없습니다</p>
                        <p className="text-sm">새로운 글을 작성해보세요!</p>
                    </div>
                )}
            </div>

            {/* 글쓰기 버튼 (FAB) */}
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
