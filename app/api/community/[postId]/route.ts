// 📁 app/api/community/[postId]/route.ts (GET, PUT, DELETE 통합)

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb'; 
import Post from '@/models/Post'; 
import { Types } from 'mongoose';

export const dynamic = 'force-dynamic'; 

// URL 파라미터 타입 정의
interface RouteParams {
    params: {
        postId: string;
    };
}

// 1. 게시글 단일 조회 (GET 요청) - 수정 폼 데이터 로딩용
export async function GET(req: Request, { params }: RouteParams) {
    const { postId } = params;

    if (!Types.ObjectId.isValid(postId)) {
        return NextResponse.json(
            { success: false, error: '유효하지 않은 게시글 ID 형식입니다.' }, 
            { status: 400 }
        );
    }
    
    await dbConnect();

    try {
        // lean()을 사용하여 JSON 형태로 데이터를 빠르게 가져옴
        const post = await Post.findById(postId).lean();

        if (!post) {
            return NextResponse.json(
                { success: false, error: '게시글을 찾을 수 없습니다.' }, 
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: { ...post, _id: post._id.toString() } }, 
            { status: 200 }
        );
    } catch (error) {
        console.error('게시글 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '서버 오류로 게시글을 가져오지 못했습니다.' }, 
            { status: 500 }
        );
    }
}


// 2. 게시글 수정 (PUT 요청)
export async function PUT(req: Request, { params }: RouteParams) {
    const { postId } = params;

    if (!Types.ObjectId.isValid(postId)) {
        return NextResponse.json(
            { success: false, error: '유효하지 않은 게시글 ID 형식입니다.' }, 
            { status: 400 }
        );
    }

    await dbConnect();

    try {
        const body = await req.json();
        const { title, content, author } = body;

        if (!title || !content) {
            return NextResponse.json(
                { success: false, error: '제목과 내용은 필수 입력 항목입니다.' }, 
                { status: 400 }
            );
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, content, author, updatedAt: new Date() },
            { new: true, runValidators: true } // new: true는 업데이트된 문서를 반환
        );

        if (!updatedPost) {
            return NextResponse.json(
                { success: false, error: '게시글을 찾을 수 없어 수정에 실패했습니다.' }, 
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: { _id: updatedPost._id.toString() } }, 
            { status: 200 }
        );
    } catch (error) {
        console.error('게시글 수정 오류:', error);
        return NextResponse.json(
            { success: false, error: '게시글 수정 중 서버 오류가 발생했습니다.' }, 
            { status: 500 }
        );
    }
}


// 3. 게시글 삭제 (DELETE 요청)
export async function DELETE(req: Request, { params }: RouteParams) {
    const { postId } = params;
    
    if (!Types.ObjectId.isValid(postId)) {
        return NextResponse.json(
            { success: false, error: '유효하지 않은 게시글 ID 형식입니다.' }, 
            { status: 400 }
        );
    }

    await dbConnect();

    try {
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return NextResponse.json(
                { success: false, error: '게시글을 찾을 수 없어 삭제에 실패했습니다.' }, 
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: '게시글이 성공적으로 삭제되었습니다.' }, 
            { status: 200 }
        );
    } catch (error) {
        console.error('게시글 삭제 오류:', error);
        return NextResponse.json(
            { success: false, error: '게시글 삭제 중 서버 오류가 발생했습니다.' }, 
            { status: 500 }
        );
    }
}