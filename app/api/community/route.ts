// 📁 app/api/community/route.ts (게시글 작성 및 목록 조회 API)

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb'; // MongoDB 연결 유틸리티
import Post, { IPostData } from '@/models/Post'; // 게시글 모델 및 데이터 타입

// GET 요청이 캐시되지 않도록 강제합니다. (최신 데이터 보장)
export const dynamic = 'force-dynamic'; 

// 1. 게시글 작성 (Create - POST 요청)
export async function POST(req: Request) {
    // 1. DB 연결
    await dbConnect();

    try {
        // 2. 요청 본문(body)에서 데이터 추출
        const body = await req.json();
        
        // 3. Mongoose 모델에 전달할 순수 데이터 객체를 생성
        const newPostData: IPostData = { 
            title: body.title,
            content: body.content,
            author: body.author || '익명 사용자', // 작성자 정보 없으면 기본값
            views: 0,
        };
        
        // 4. 새 게시글을 DB에 저장합니다. (Mongoose 표준)
        const savedPost = await Post.create(newPostData); 

        // 5. 성공 응답 반환 (저장된 ID만 간결하게 반환)
        return NextResponse.json(
            { success: true, data: { _id: savedPost._id.toString() } },
            { status: 201 } // 201 Created
        );

    } catch (error: any) {
        console.error('게시글 저장 오류:', error);

        // ⭐️ Mongoose 유효성 검사 오류(ValidationError) 처리
        if (error.name === 'ValidationError') {
            // 상세 오류 메시지들을 추출하여 브라우저에 전달
            const messages = Object.values(error.errors).map((val: any) => val.message);
            
            return NextResponse.json(
                { success: false, error: `필수 입력 항목 오류: ${messages.join(', ')}` }, 
                { status: 400 } // 400 Bad Request
            );
        }
        
        // ⭐️ 기타 서버 오류 처리
        return NextResponse.json(
            { success: false, error: '서버 내부 오류로 게시글 작성에 실패했습니다.' }, 
            { status: 500 }
        );
    }
}


// 2. 게시글 목록 조회 (Read - GET 요청)
export async function GET() {
    await dbConnect();
    
    try {
        // DB에서 모든 게시글을 조회하고, 최신순(createdAt: -1)으로 정렬 및 lean() 사용
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .lean(); 
        
        return NextResponse.json({ success: true, data: posts }, { status: 200 });
        
    } catch (error: unknown) {
        console.error('게시글 목록 불러오기 실패:', error);
        
        return NextResponse.json(
            { success: false, error: '게시글 목록을 불러오는 데 실패했습니다.' }, 
            { status: 500 }
        );
    }
}