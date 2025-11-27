
// 📁 app/api/community/route.ts

import { NextResponse } from 'next/server';
import dbConnect, { PostModel, CommentModel, IPostData } from '@/lib/db/mongodb';
import { NextRequest } from 'next/server';
import { Types } from 'mongoose';

export const dynamic = 'force-dynamic';

// 1. 게시글 생성 (POST 요청) - ⭐️ userId, userEmail, category, school 추가
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const { title, content, author, userId, userEmail, category, school } = body;

        if (!title || !content || !author || !userId || !userEmail || !category) {
            return NextResponse.json(
                { success: false, error: '필수 입력 항목이 누락되었습니다.' },
                { status: 400 }
            );
        }

        const newPostData: IPostData = {
            title,
            content,
            author,
            userId,
            userEmail,
            category,
            school, // ⭐️ 저장 (없을 수도 있음)
            views: 0,
            likes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const newPost = await PostModel.create(newPostData);

        return NextResponse.json(
            { success: true, data: { _id: newPost._id.toString() } },
            { status: 201 }
        );

    } catch (error) {
        console.error('게시글 생성 오류:', error);
        return NextResponse.json(
            { success: false, error: '게시글 생성 중 서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// 2. 게시글 목록 조회 (GET 요청) - ⭐️ 학교 필터링 추가
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const school = searchParams.get('school'); // ⭐️ 학교 필터

        let query: any = {};

        // 카테고리 필터
        if (category && category !== '전체') {
            query.category = category;
        }

        // ⭐️ 학교 필터: 학교 정보가 있는 경우 해당 학교 게시물만 조회
        // (학교 정보가 없는 레거시 게시물은 보이지 않게 됨. 필요 시 $or 조건으로 처리 가능하나, 여기서는 학교별 분리를 우선함)
        if (school) {
            query.school = school;
        }

        // 1. 게시물 목록 조회
        const posts = await PostModel.find(query)
            .sort({ createdAt: -1 })
            .lean();

        const postObjects = JSON.parse(JSON.stringify(posts));

        // postIds를 Types.ObjectId 배열로 변환
        const postIds = postObjects.map((p: any) => new Types.ObjectId(p._id));

        // 2. 해당 게시물들의 댓글 카운트 조회
        const commentsCount = await CommentModel.aggregate([
            { $match: { postId: { $in: postIds } } },
            { $group: { _id: "$postId", count: { $sum: 1 } } }
        ]);

        // 3. 댓글 카운트를 게시물 데이터에 병합
        const commentsMap = new Map(commentsCount.map(item => [item._id.toString(), item.count]));

        // 4. 최종 데이터 구조 생성
        const finalPosts = postObjects.map((post: any) => ({
            ...post,
            commentCount: commentsMap.get(post._id.toString()) || 0,
            likesCount: (post.likes || []).length
        }));

        return NextResponse.json(finalPosts);

    } catch (error) {
        console.error("게시글 조회 오류:", error);
        return NextResponse.json(
            { success: false, error: '게시글 목록을 불러오는 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
