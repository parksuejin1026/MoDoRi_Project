// 📁 app/api/community/route.ts

import { NextResponse } from 'next/server';
import dbConnect, { PostModel, CommentModel, IPostData } from '@/lib/db/mongodb';
import { NextRequest } from 'next/server';
import { Types } from 'mongoose';

export const dynamic = 'force-dynamic';

// ⭐️ [추가된 헬퍼 함수] 정규식 특수 문자를 이스케이프하는 함수
function escapeRegExp(string: string): string {
    // [ \ ^ $ . | ? * + ( ) ] 문자를 찾아 앞에 \를 붙여 이스케이프합니다.
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 1. 게시글 생성 (POST 요청) - 기존 유지
export async function POST(req: NextRequest) {
    await dbConnect();
    // ... (기존 POST 로직 유지)
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
            school,
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

// 2. 게시글 목록 조회 (GET 요청) - ⭐️ 검색어 이스케이프 로직 추가
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const school = searchParams.get('school');
        const search = searchParams.get('search');

        let query: any = {};

        // 1. 카테고리 필터
        if (category && category !== '전체') {
            query.category = category;
        }

        // 2. 학교 필터
        if (school) {
            query.school = school;
        }

        // ⭐️ [핵심 수정] 검색어 필터 (제목 또는 내용) - 검색어 이스케이프 적용
        if (search) {
            const escapedSearch = escapeRegExp(search);

            // 이스케이프된 검색어로 정규 표현식 생성 (대소문자 구분 없음)
            const searchRegex = { $regex: escapedSearch, $options: 'i' };
            query.$or = [
                { title: searchRegex },
                { content: searchRegex }
            ];
        }


        // 3. 게시물 목록 조회
        const posts = await PostModel.find(query)
            .sort({ createdAt: -1 })
            .lean();

        const postObjects = JSON.parse(JSON.stringify(posts));

        // postIds를 Types.ObjectId 배열로 변환
        const postIds = postObjects.map((p: any) => new Types.ObjectId(p._id));

        // 4. 해당 게시물들의 댓글 카운트 조회
        const commentsCount = await CommentModel.aggregate([
            { $match: { postId: { $in: postIds } } },
            { $group: { _id: "$postId", count: { $sum: 1 } } }
        ]);

        // 5. 댓글 카운트를 게시물 데이터에 병합
        const commentsMap = new Map(commentsCount.map(item => [item._id.toString(), item.count]));

        // 6. 최종 데이터 구조 생성
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