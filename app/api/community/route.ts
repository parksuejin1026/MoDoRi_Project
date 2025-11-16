// 📁 app/api/community/route.ts (최종 안정화 버전)

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb'; // MongoDB 연결 유틸리티
import mongoose, { Model } from 'mongoose';
import Post, { IPostData, IPost } from '@/models/Post'; // 게시글 모델 (IPostData, IPost 타입은 models/Post.ts에서 정의되었다고 가정)

// ⭐️ DB 연결/데이터 조회 시 캐시되지 않도록 강제 (Vercel Build 오류 우회 목적도 있음)
export const dynamic = 'force-dynamic'; 

// 🚨 모델 안전 참조: Mongoose의 models 객체를 통해 Post 모델을 가져옵니다.
// 이 방식은 Next.js 환경에서 import Post from '@/models/Post'가 실패할 때 안전합니다.
const PostModel: Model<IPost> = (mongoose.models.Post || mongoose.model('Post')) as Model<IPost>;


// 1. 게시글 작성 (Create - POST 요청)
export async function POST(req: Request) {
    // ⭐️ DB 연결을 try 블록 안으로 옮겨, 연결 실패 시 500 오류가 깔끔하게 처리되도록 함.
    try {
        await dbConnect();

        // 2. 요청 본문(body)에서 데이터 추출
        const body = await req.json();
        
        // 3. Mongoose 모델에 전달할 순수 데이터 객체를 생성
        const newPostData: IPostData = { 
            title: body.title,
            content: body.content,
            author: body.author || '익명 사용자', 
            views: 0,
        };
        
        // 4. 새 게시글을 DB에 저장합니다. (안전하게 참조된 PostModel 사용)
        const savedPost = await PostModel.create(newPostData); 

        // 5. 성공 응답 반환 (저장된 ID만 간결하게 반환)
        return NextResponse.json(
            { success: true, data: { _id: savedPost._id.toString() } },
            { status: 201 } // 201 Created
        );

    } catch (error: any) {
        console.error('게시글 저장 오류:', error);

        // ⭐️ Mongoose 유효성 검사 오류(ValidationError) 처리
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
            
            return NextResponse.json(
                { success: false, error: `필수 입력 항목 오류: ${messages.join(', ')}` }, 
                { status: 400 } // 400 Bad Request
            );
        }
        
        // ⭐️ 기타 서버 오류 (DB 연결 오류 등) 처리
        return NextResponse.json(
            { success: false, error: '서버 내부 오류로 게시글 작성에 실패했습니다. (DB 연결 확인 필요)' }, 
            { status: 500 }
        );
    }
}


// 2. 게시글 목록 조회 (Read - GET 요청)
export async function GET() {
    
    try {
        await dbConnect(); // GET 요청에서도 DB 연결 시도
        
        // DB에서 모든 게시글을 조회하고, 최신순(createdAt: -1)으로 정렬 및 lean() 사용
        const posts = await PostModel.find({})
            .sort({ createdAt: -1 })
            .lean(); 
        
        return NextResponse.json({ success: true, data: posts }, { status: 200 });
        
    } catch (error: unknown) {
        console.error('게시글 목록 불러오기 실패:', error);
        
        return NextResponse.json(
            { success: false, error: '게시글 목록을 불러오는 데 실패했습니다. (DB 연결 확인 필요)' }, 
            { status: 500 }
        );
    }
}