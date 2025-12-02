// 📁 app/api/user/activity/route.ts

import { NextResponse, NextRequest } from 'next/server';
import dbConnect, { PostModel, CommentModel } from '@/lib/db/mongodb';
import { Types } from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'posts' | 'comments' | 'likes'
    const school = searchParams.get('school');

    if (!userId || !type) {
        return NextResponse.json(
            { success: false, error: 'User ID and type are required' },
            { status: 400 }
        );
    }

    try {
        let data = [];

        if (type === 'posts') {
            // 내가 쓴 글
            const query: any = { userId };
            if (school) query.school = school;

            data = await PostModel.find(query)
                .sort({ createdAt: -1 })
                .select('_id title createdAt views likes') // 필요한 필드만 선택
                .lean();

        } else if (type === 'comments') {
            // 내가 쓴 댓글
            const query: any = { userId };
            if (school) query.school = school;

            // 댓글을 가져오면서 해당 게시글의 제목도 필요할 수 있음 (선택사항)
            // 여기서는 댓글 내용과 게시글 ID를 반환
            const comments = await CommentModel.find(query)
                .sort({ createdAt: -1 })
                .populate({
                    path: 'postId',
                    select: 'title', // 게시글 제목 가져오기
                    model: PostModel
                })
                .lean();

            // 데이터 가공
            data = comments.map((comment: any) => ({
                _id: comment._id,
                postId: comment.postId?._id,
                postTitle: comment.postId?.title || '삭제된 게시글',
                content: comment.content,
                createdAt: comment.createdAt,
            }));

        } else if (type === 'likes') {
            // 내가 좋아요한 글
            const query: any = { likes: userId };
            if (school) query.school = school;

            data = await PostModel.find(query)
                .sort({ createdAt: -1 })
                .select('_id title author createdAt views likes')
                .lean();
        } else {
            return NextResponse.json(
                { success: false, error: 'Invalid type' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            data: JSON.parse(JSON.stringify(data))
        });

    } catch (error) {
        console.error('Error fetching user activity:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user activity' },
            { status: 500 }
        );
    }
}
