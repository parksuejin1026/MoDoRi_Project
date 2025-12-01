// 📁 app/community/page.tsx
'use client';

import Link from 'next/link';
import { MessageSquare, ThumbsUp, Eye, Clock, Plus, Search, Image as ImageIcon } from 'lucide-react'; // ⭐️ [수정] ImageIcon 추가
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PullToRefresh from '@/components/PullToRefresh';

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
    images?: string[]; // ⭐️ [추가] 이미지 배열
    createdAt: string;
    commentCount: number;
    likesCount: number;
}

export default function CommunityPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category') || '전체';
    const currentSearchTerm = searchParams.get('search') || '';

    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [userSchool, setUserSchool] = useState<string>('');
    const [searchTermInput, setSearchTermInput] = useState(currentSearchTerm);

    // ⭐️ [추가] 학교 필터링 상태 ('my': 내 학교, 'all': 전체 학교)
    const [filterType, setFilterType] = useState<'my' | 'all'>('my');

    useEffect(() => {
        setSearchTermInput(currentSearchTerm);
    }, [currentSearchTerm]);

    // ⭐️ [수정] filterType 파라미터 추가
    const fetchPosts = useCallback(async (category: string, school: string | null, search: string, filter: 'my' | 'all') => {
        setLoading(true);
        try {
            let url = `/api/community?category=${category}`;

            // ⭐️ [수정] 필터가 'my'일 때만 학교 파라미터 추가
            if (filter === 'my' && school) {
                url += `&school=${encodeURIComponent(school)}`;
            }

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
    }, []);

    useEffect(() => {
        const storedSchool = localStorage.getItem('userSchool');
        if (storedSchool) {
            setUserSchool(storedSchool);
        }

        // ⭐️ [수정] filterType 의존성 추가 및 전달
        fetchPosts(currentCategory, storedSchool, currentSearchTerm, filterType);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCategory, currentSearchTerm, filterType]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newParams = new URLSearchParams(searchParams.toString());

        if (searchTermInput.trim()) {
            newParams.set('search', searchTermInput.trim());
        } else {
            newParams.delete('search');
        }

        if (currentCategory && currentCategory !== '전체') {
            newParams.set('category', currentCategory);
        } else {
            newParams.delete('category');
        }

        router.push(`/community?${newParams.toString()}`);
    };

    const handleRefresh = async () => {
        await fetchPosts(currentCategory, userSchool, currentSearchTerm, filterType);
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 pb-24 relative min-h-screen bg-background">
            <PullToRefresh onRefresh={handleRefresh}>
                {/* 타이틀 영역 */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">커뮤니티</h2>
                    <p className="text-sm text-muted-foreground">
                        {userSchool ? `${userSchool} 학생들과 소통해보세요` : '학칙에 대한 질문과 정보를 공유해보세요'}
                    </p>
                </div>

                {/* ⭐️ [추가] 학교 필터링 탭 */}
                {userSchool && (
                    <div className="flex gap-6 mb-6 border-b border-border">
                        <button
                            onClick={() => setFilterType('my')}
                            className={`pb-2 text-sm font-medium transition-colors relative ${filterType === 'my' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            내 학교
                            {filterType === 'my' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setFilterType('all')}
                            className={`pb-2 text-sm font-medium transition-colors relative ${filterType === 'all' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            전체 학교
                            {filterType === 'all' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                            )}
                        </button>
                    </div>
                )}

                {/* 검색 입력 필드 UI */}
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

                {/* 카테고리 필터 UI */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {['전체', '질문', '정보공유', '자유'].map((cat) => {
                        const newParams = new URLSearchParams(searchParams.toString());
                        newParams.delete('category');
                        if (cat !== '전체') newParams.set('category', cat);

                        return (
                            <Link
                                key={cat}
                                href={`/community?${newParams.toString()}`}
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
                        // ⭐️ [수정] 로딩 스켈레톤 UI
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="h-5 bg-muted rounded w-12"></div>
                                    <div className="h-4 bg-muted rounded w-20"></div>
                                </div>
                                <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
                                <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
                                <div className="flex justify-between pt-3 border-t border-border">
                                    <div className="h-4 bg-muted rounded w-1/4"></div>
                                    <div className="h-4 bg-muted rounded w-1/6"></div>
                                </div>
                            </div>
                        ))
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

                                {/* ⭐️ [수정] 내용 제거 및 작성자/날짜 표시 개선 */}
                                <div className="text-xs text-muted-foreground mb-3">
                                    {post.author || '익명'} · {new Date(post.createdAt).toLocaleDateString()}
                                </div>

                                {/* 통계 정보 UI */}
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

                                        {/* ⭐️ [추가] 이미지 포함 여부 표시 */}
                                        {post.images && post.images.length > 0 && (
                                            <div className="flex items-center gap-1 text-blue-500">
                                                <ImageIcon size={14} />
                                                <span>{post.images.length}</span>
                                            </div>
                                        )}
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
            </PullToRefresh>

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
