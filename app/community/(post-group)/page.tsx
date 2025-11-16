// 📁 app/community/page.tsx (최종 수정 버전)

import Link from 'next/link';
import dbConnect from '@/lib/db/mongodb'; 
import Post from '@/models/Post'; 
// import { format } from 'date-fns'; // 👈 제거됨
// import PostDate from '@/components/PostDate'; // 👈 새로 추가됨 (경로는 프로젝트 구조에 맞게 조정 필요)
import PostDate from '../../../components/PostDate';

// [기능 설명] UI에 필요한 데이터 타입 정의
interface PostDisplayData {
    _id: string;
    title: string;
    author: string;
    createdAt: string; 
    views: number;
}

// [기능 설명] MongoDB Document에서 가져오는 실제 데이터 타입
interface MongoPost {
    _id: object; 
    title: string;
    content: string;
    author: string;
    createdAt: Date; 
    views: number;
}

async function getPosts(): Promise<PostDisplayData[]> {
    try {
        await dbConnect();
        
        // 데이터가 없어도 안전하게 처리되도록 .lean() 사용
        const posts: MongoPost[] = await Post.find({}).sort({ createdAt: -1 }).lean() as MongoPost[]; 

        return posts.map(post => ({
            _id: post._id.toString(), 
            title: post.title,
            author: post.author,
            views: post.views,
            // Date 객체를 문자열로 변환하여 클라이언트 컴포넌트에 안전하게 전달
            createdAt: post.createdAt.toISOString(), 
        })) as PostDisplayData[]; 

    } catch (error: unknown) {
        console.error("게시글 로드 실패:", error);
        // DB 연결 실패 시에도 빈 배열 반환하여 사전 렌더링 오류 방지
        return [];
    }
}

export default async function CommunityPage() {
    
    const posts = await getPosts(); 

    return (
        <div className="community-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
            
            {/* ⭐️ 모바일 Navigation Bar 스타일의 제목 */}
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, padding: '10px 0', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>
                학생 커뮤니티 게시판
            </h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    총 게시글 수: {posts.length}개
                </span>
                {/* ⭐️ 글쓰기 버튼 경로: /community/add 로 연결 */}
                <a href="/community/add" className="btn btn-primary btn-small">
                    글쓰기
                </a>
            </div>

            {/* 게시글 목록 UI */}
            <div className="post-list" style={{ borderTop: '2px solid var(--color-primary)' }}>
                {/* 공지사항 (임시) */}
                <div className="post-item notice" style={{ padding: '15px', borderBottom: '1px solid var(--color-border)', backgroundColor: '#f0f4f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>[공지] 커뮤니티 이용 규칙</span>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>관리자 | 2025.01.01</span>
                </div>
                
                {posts.length > 0 ? (
                    posts.map((post) => (
                        // 상세 페이지 경로: /community/[postId] 로 이동
                        <Link 
                            href={`/community/${post._id}`} 
                            key={post._id} 
                            style={{ display: 'block', padding: '15px', borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
                        >
                            <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                {post.title} 
                                <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#dc2626' }}>({post.views})</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '5px' }}>
                                <span>작성자: {post.author}</span>
                                {/* ⭐️ 클라이언트 컴포넌트 사용 */}
                                <PostDate dateString={post.createdAt} />
                            </div>
                        </Link>
                    ))
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                        작성된 게시글이 없습니다. **'글쓰기'** 버튼을 눌러 첫 글을 작성해 보세요!
                    </div>
                )}
            </div>
            
            {/* ⭐️ 모바일 UX: FAB (Floating Action Button) 영역 */}
            <Link href="/community/add" passHref legacyBehavior>
                <a style={{
                    position: 'fixed',
                    bottom: '80px', 
                    right: '20px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-dark)',
                    color: 'var(--color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                    zIndex: 999,
                    fontWeight: 'bold',
                }}>
                    +
                </a>
            </Link>
            
        </div>
    );
}