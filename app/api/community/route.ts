// 📁 app/api/community/route.ts (최종 에러 해결 버전)

import { NextResponse } from 'next/server';
import mongoose, { Model } from 'mongoose'; 
// ⭐️ dbConnect(default), PostModel, IPostData, IPost를 mongodb.ts에서 가져옵니다.
import dbConnect, { PostModel, IPostData, IPost } from '@/lib/db/mongodb'; 
// 🚨 이전의 import { IPostData, IPost } from '@/models/Post'; 줄은 삭제해야 합니다.

export const dynamic = 'force-dynamic'; 

// 1. 게시글 작성 (Create - POST 요청)
export async function POST(req: Request) {
    try {
        await dbConnect(); // 1. DB 연결 (스키마 등록 보장)
        
        // 2. 모델 안전 참조: PostModel이 mongodb.ts에서 이미 정의되었으므로 바로 사용합니다.
        // PostModel이 정의되지 않았다면 에러를 던집니다.
        if (!PostModel) throw new Error("Post Model not found after connect.");

        // 3. 요청 본문(body)에서 데이터 추출
        const body = await req.json();
        const newPostData: IPostData = { 
            title: body.title,
            content: body.content,
            author: body.author || '익명 사용자', 
            views: 0,
        };
        
        const savedPost = await PostModel.create(newPostData); 

        return NextResponse.json({ success: true, data: { _id: savedPost._id.toString() } }, { status: 201 });

    } catch (error: any) {
        console.error('게시글 저장 오류:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
            return NextResponse.json({ success: false, error: `필수 입력 항목 오류: ${messages.join(', ')}` }, { status: 400 }); 
        }
        
        return NextResponse.json({ success: false, error: '서버 내부 오류로 게시글 작성에 실패했습니다.' }, { status: 500 });
    }
}

// 2. 게시글 목록 조회 (Read - GET 요청)
export async function GET() {
    try {
        await dbConnect(); 
        
        // ⭐️ GET 요청에서도 PostModel 사용
        if (!PostModel) throw new Error("Post Model not found after connect.");
        
        // DB에서 모든 게시글을 조회
        const posts = await PostModel.find({}).sort({ createdAt: -1 }).lean(); 
        
        return NextResponse.json({ success: true, data: posts }, { status: 200 });
        
    } catch (error: unknown) {
        console.error('게시글 목록 불러오기 실패:', error);
        
        return NextResponse.json({ success: false, error: '게시글 목록을 불러오는 데 실패했습니다.' }, { status: 500 });
    }
}