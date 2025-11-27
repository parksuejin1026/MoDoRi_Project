// 📁 app/community/[postId]/page.tsx

import Link from 'next/link';
// ⭐️ [점검] 서버 로직에 필요한 DB 모델만 임포트합니다.
import dbConnect, { PostModel, CommentModel } from '@/lib/db/mongodb';
import { Types } from 'mongoose';
// ⭐️ [수정] 클라이언트 컴포넌트를 별도 파일에서 불러옵니다.
import ClientPostDetail from './ClientPostDetail';
// 🚨 이 파일은 순수한 서버 컴포넌트입니다. 클라이언트 훅 임포트 없음.

export const dynamic = 'force-dynamic';

interface PostData {
    _id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    userId: string;
    views: number;
    likes: string[];
    createdAt: string;
}

interface CommentData {
    _id: string;
    postId: string;
    userId: string;
    author: string;
    content: string;
    createdAt: string;
}

// ⭐️ 서버에서 데이터를 직접 패칭합니다. (조회수 증가 및 댓글 조회)
async function getPostAndComments(postId: string) {
    if (!Types.ObjectId.isValid(postId)) return { post: null, comments: [] };

    try {
        await dbConnect();

        // 1. 게시글 조회 및 조회수 증가 (모든 사용자 게시물 조회 가능)
        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            { $inc: { views: 1 } },
            { new: true }
        ).lean();

        // 2. 댓글 목록 조회
        const comments = await CommentModel.find({ postId: new Types.ObjectId(postId) }).sort({ createdAt: 1 }).lean();

        if (!updatedPost) return { post: null, comments: [] };

        return {
            post: JSON.parse(JSON.stringify(updatedPost)) as PostData,
            comments: JSON.parse(JSON.stringify(comments)) as CommentData[],
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { post: null, comments: [] };
    }
}


// ⭐️ 메인 페이지 컴포넌트 (순수 서버 컴포넌트)
export default async function PostDetailPage({ params }: { params: { postId: string } }) {

    const { post: postData, comments } = await getPostAndComments(params.postId);

    if (!postData) {
        return <div className="p-6 text-center text-muted-foreground bg-background min-h-screen">게시글을 찾을 수 없습니다.</div>;
    }

    // 클라이언트 컴포넌트에 초기 데이터를 전달합니다.
    return (
        <ClientPostDetail
            initialPost={postData}
            initialComments={comments}
            postId={params.postId}
        />
    );
}