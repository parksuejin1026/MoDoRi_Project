// 📁 app/api/community/route.ts (게시글 작성 API - POST 요청 처리)

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb'; 
import Post from '@/models/Post'; 

// Next.js App Router에서 API Route를 캐시하지 않도록 강제
export const dynamic = 'force-dynamic'; 

// 게시글 작성 처리 (POST 요청)
export async function POST(req: Request) {
    
    // 1. DB 연결
    await dbConnect();

    try {
        // 2. 요청 본문(body)에서 데이터 추출
        const body = await req.json();
        const { title, content, author } = body;

        // 3. 유효성 검사
        if (!title || !content) {
            return NextResponse.json(
                { success: false, error: '제목과 내용을 모두 입력해야 합니다.' }, 
                { status: 400 }
            );
        }

        // 4. 새 게시글 인스턴스 생성 및 저장
        const newPost = await Post.create({
            title,
            content,
            author,
            views: 0, 
            createdAt: new Date(),
        });

        // 5. 성공 응답 반환
        return NextResponse.json(
            { success: true, data: { _id: newPost._id.toString() } }, 
            { status: 201 } // 201 Created
        );

    } catch (error: any) {
        console.error("게시글 작성 API 오류:", error);

        // 6. DB 유효성 검사 오류 처리
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { success: false, error: error.message }, 
                { status: 400 }
            );
        }
        
        // 7. 기타 서버 오류 처리
        return NextResponse.json(
            { success: false, error: '서버 내부 오류로 게시글 작성에 실패했습니다.' }, 
            { status: 500 }
        );
    }
}


// 게시글 전체 목록 조회 (GET 요청) - 이 기능은 page.tsx에서 직접 DB를 호출하므로 사용하지 않지만, API Route가 기본적으로 필요합니다.
export async function GET() {
    return NextResponse.json({ message: "API Route is working. Use direct DB access for list page." }, { status: 200 });
}