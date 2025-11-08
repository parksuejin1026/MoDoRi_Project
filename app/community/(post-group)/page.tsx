// 📁 app/community/(post-group)/page.tsx (게시글 목록 화면 - 최종 안정화)

import Link from 'next/link';
import dbConnect from '@/lib/db/mongodb'; 
import Post from '@/models/Post'; 
import { format } from 'date-fns'; 

// 1. 프론트엔드 Display 타입 정의
interface PostDisplayData {
    _id: string;
    title: string;
    author: string;
    createdAt: string; 
    views: number;
}

// 2. 서버에서 데이터를 가져오는 함수
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
        
        const posts: MongoPost[] = await Post.find({}).sort({ createdAt: -1 }).lean() as MongoPost[]; 

        return posts.map(post => ({
            _id: post._id.toString(), 
            title: post.title,
            author: post.author,
            views: post.views,
            createdAt: post.createdAt.toISOString(), 
        })) as PostDisplayData[]; 

    } catch (error: unknown) {
        console.error("게시글 로드 실패:", error);
        return [];
    }
}

export default async function CommunityPage() {
    
    const posts = await getPosts(); 

    return (
        <div className="community-container" style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-primary)' }}>
                학생 커뮤니티 게시판
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                학칙 관련 질문이나 다양한 학교 생활 정보를 공유하세요.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    총 게시글 수: {posts.length}개
                </span>
                {/* ⭐️ 글쓰기 버튼 경로를 'add' 폴더로 연결 */}
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
                                <span>{format(new Date(post.createdAt), 'yy.MM.dd HH:mm')}</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                        작성된 게시글이 없습니다. **"글쓰기"** 버튼을 눌러 첫 글을 작성해 보세요!
                    </div>
                )}
            </div>
            
        </div>
    );
}