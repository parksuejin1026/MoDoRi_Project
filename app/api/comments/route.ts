// 📁 app/api/comments/route.ts

import { NextResponse, NextRequest } from 'next/server';
import dbConnect, { CommentModel } from '@/lib/db/mongodb';
import { Types } from 'mongoose';

export const dynamic = 'force-dynamic';

// 1. 댓글 생성 (POST 요청)
export async function POST(req: NextRequest) {
    // ⭐️ [점검] 요청 전에 DB 연결을 보장합니다.
    await dbConnect();

    try {
        const body = await req.json();
        const { postId, userId, author, content, school } = body;

        // ⭐️ [강화] 필수 필드 누락 검사
        if (!postId || !userId || !author || !content) {
            console.error("댓글 POST 실패: 필수 데이터 누락", { postId, userId, author, content });
            return NextResponse.json(
                { success: false, error: '필수 데이터(게시글 ID, 사용자 ID, 작성자, 내용)가 누락되었습니다.' },
                { status: 400 }
            );
        }

        // ⭐️ [강화] ObjectId 유효성 검사를 시도합니다.
        let validPostId: Types.ObjectId;
        try {
            validPostId = new Types.ObjectId(postId);
        } catch (e) {
            console.error("댓글 POST 실패: 유효하지 않은 게시글 ID 형식", postId);
            return NextResponse.json(
                { success: false, error: '게시글 ID 형식이 올바르지 않습니다. (MongoDB ObjectId 형식 아님)' },
                { status: 400 }
            );
        }

        // Mongoose create 호출
        const newComment = await CommentModel.create({
            postId: validPostId, // 유효성 검사를 통과한 ID 사용
            userId: userId,
            author: author,
            content: content.trim(),
            school: school, // ⭐️ 학교 정보 저장
        });

        // JSON 응답을 위해 Mongoose Document를 순수 객체로 변환
        const commentObject = JSON.parse(JSON.stringify(newComment));

        return NextResponse.json(
            { success: true, data: commentObject },
            { status: 201 }
        );

    } catch (error: any) {
        // ⭐️ [강화] 서버 에러 로그 상세 출력
        console.error('댓글 생성 서버 오류:', error);
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { success: false, error: `유효성 검사 오류: ${error.message}` },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: '댓글 등록 중 서버 내부 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// 2. 댓글 목록 조회 (GET 요청) - 기존 로직 유지
export async function GET(req: NextRequest) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId || !Types.ObjectId.isValid(postId)) {
        return NextResponse.json(
            { success: false, error: '유효한 게시글 ID가 필요합니다.' },
            { status: 400 }
        );
    }

    try {
        const comments = await CommentModel.find({ postId: new Types.ObjectId(postId) }).sort({ createdAt: 1 }).lean();
        const commentsObject = JSON.parse(JSON.stringify(comments));

        return NextResponse.json(
            { success: true, data: commentsObject },
            { status: 200 }
        );
    } catch (error) {
        console.error('댓글 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '댓글 조회 중 서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}