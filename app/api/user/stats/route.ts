// 📁 app/api/user/stats/route.ts

import { NextResponse, NextRequest } from 'next/server';
import dbConnect, { PostModel, CommentModel } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const school = searchParams.get('school');

    if (!userId) {
        return NextResponse.json(
            { success: false, error: 'User ID is required' },
            { status: 400 }
        );
    }

    try {
        // 1. 작성한 글 개수 (학교 필터링)
        const postQuery: any = { userId };
        if (school) {
            postQuery.school = school;
        }
        const postCount = await PostModel.countDocuments(postQuery);

        // 2. 작성한 댓글 개수 (학교 필터링)
        const commentQuery: any = { userId };
        if (school) {
            commentQuery.school = school;
        }
        const commentCount = await CommentModel.countDocuments(commentQuery);

        // 3. 좋아요 누른 글 개수 (내가 좋아요한 글)
        // 학교 필터링: 해당 학교에 속한 게시물 중에서 내가 좋아요를 누른 것
        const likeQuery: any = { likes: userId };
        if (school) {
            // 게시물의 학교가 일치해야 함 (PostModel에서 조회하므로 school 필드 사용 가능)
            likeQuery.school = school;
        }
        const likeCount = await PostModel.countDocuments(likeQuery);

        return NextResponse.json({
            success: true,
            data: {
                postCount,
                commentCount,
                likeCount
            }
        });

    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user stats' },
            { status: 500 }
        );
    }
}
