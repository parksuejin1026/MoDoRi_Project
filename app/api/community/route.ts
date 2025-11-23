// 📁 app/api/community/route.ts

import { NextResponse } from 'next/server';
import dbConnect, { PostModel, IPostData } from '@/lib/db/mongodb';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// 1. 게시글 생성 (POST 요청) - ⭐️ userId, userEmail, category 추가
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const { title, content, author, userId, userEmail, category } = body;

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
            userId, // ⭐️ 저장
            userEmail, // ⭐️ 저장
            category, // ⭐️ 저장
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

// 2. 게시글 목록 조회 (GET 요청) - 기존 코드 유지
export async function GET() {
    // ... 기존 코드는 그대로 유지 ...
    // 다만, 이 GET 요청은 이제 사용하지 않습니다. app/community/page.tsx에서 직접 DB를 쿼리합니다.
}