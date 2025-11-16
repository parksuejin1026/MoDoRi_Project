// 📁 app/community/(post-group)/[postId]/page.tsx (최종 수정 버전)

import dbConnect from '@/lib/db/mongodb';
import Post from '@/models/Post'; 
// import { format } from 'date-fns'; // 👈 이 줄을 제거했습니다.
import Link from 'next/link';
import { Types } from 'mongoose'; 
import DeleteButton from '@/components/DeleteButton'; 

// ⭐️ DB 연결 강제 동적 렌더링 (빌드 오류 방지)
export const dynamic = 'force-dynamic'; 

// URL 파라미터 타입 정의
interface PostDetailPageProps {
    params: {
        postId: string; 
    }
}

// UI에 필요한 데이터 타입 정의
interface PostDisplayData {
    _id: string;
    title: string;
    content: string;
    author: string;
    views: number;
    createdAt: string; 
}

// 서버 컴포넌트: 특정 ID를 가진 게시글을 DB에서 가져옵니다.
async function getPost(postId: string): Promise<PostDisplayData | null> {
    // 1. 유효하지 않은 ID 형식 체크 (라우팅 충돌 방지용)
    if (!Types.ObjectId.isValid(postId)) {
        return null;
    }

    try {
        await dbConnect();
        
        // 2. MongoDB에서 게시글을 조회합니다.
        // views 카운트 증가 로직이 필요하다면 여기에 추가할 수 있습니다.
        const post = await Post.findById(postId).lean(); 
        
        if (!post) {
            return null; // 게시글이 DB에 없으면 null 반환
        }
        
        // 3. JSON 직렬화 및 타입 명확화
        return {
            _id: post._id.toString(),
            title: post.title,
            content: post.content,
            author: post.author,
            views: post.views,
            createdAt: post.createdAt.toISOString(),
        } as PostDisplayData; 

    } catch (error) {
        console.error("게시글 상세 정보 로드 실패:", error);
        return null; // 서버 에러 시에도 null 반환하여 404 처리 유도
    }
}

// 상세 페이지 컴포넌트
export default async function PostDetailPage({ params }: PostDetailPageProps) {
    const post = await getPost(params.postId); 

    // ⭐️ 게시글이 없거나 ID 형식이 유효하지 않으면 커스텀 404 페이지를 반환
    if (!post) {
        return (
            <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '2rem', textAlign: 'center' }}>
                <h1 style={{ color: '#dc2626' }}>404 - 게시글을 찾을 수 없습니다.</h1>
                <Link href="/community" className="btn btn-primary" style={{ marginTop: '1rem' }}>목록으로 돌아가기</Link>
            </div>
        );
    }

    // 날짜 포맷팅 함수 정의 (date-fns 대체)
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ko-KR', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    // 게시글 상세 내용 UI
    return (
        <div className="post-detail-container" style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1rem' }}>
            
            {/* 상단 버튼: 목록으로 돌아가기 */}
            <div style={{ padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <Link href="/community" className="btn btn-ghost">← 목록으로</Link>
            </div>

            {/* 제목 및 메타 정보 */}
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
                {post.title}
            </h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.8rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                <span>작성자: {post.author}</span>
                {/* ⭐️ format 함수를 대체했습니다. */}
                <span>작성일: {formatDate(post.createdAt)} | 조회수: {post.views}</span>
            </div>

            {/* 내용 */}
            <div className="post-content" style={{ minHeight: '300px', lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: '3rem', fontSize: '1.1rem' }}>
                {post.content}
            </div>

            {/* 하단 액션 버튼: 수정 및 삭제 버튼 */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                
                {/* ⭐️ 수정 페이지 링크: /community/[postId]/edit */}
                <Link href={`/community/${post._id}/edit`} className="btn btn-primary">
                    수정
                </Link>
                
                {/* ⭐️ 삭제 버튼 컴포넌트 연결 */}
                <DeleteButton postId={post._id.toString()} /> 
            </div>
        </div>
    );
}