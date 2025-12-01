// 📁 app/api/comments/route.ts

import { NextResponse, NextRequest } from 'next/server';
import dbConnect, { CommentModel, NotificationModel, PostModel } from '@/lib/db/mongodb';
import { Types } from 'mongoose';

export const dynamic = 'force-dynamic';

// 1. 댓글 생성 (POST 요청)
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const { postId, userId, author, content, school } = body;

        // 필수 데이터 확인
        if (!postId || !userId || !author || !content) {
            return NextResponse.json(
                { success: false, error: '필수 데이터(게시글 ID, 사용자 ID, 작성자, 내용)가 누락되었습니다.' },
                { status: 400 }
            );
        }

        // ObjectId 유효성 검사
        let validPostId: Types.ObjectId;
        try {
            validPostId = new Types.ObjectId(postId);
        } catch (e) {
            return NextResponse.json(
                { success: false, error: '게시글 ID 형식이 올바르지 않습니다.' },
                { status: 400 }
            );
        }

        // 1. 댓글 DB 저장
        const newComment = await CommentModel.create({
            postId: validPostId,
            userId: userId,
            author: author,
            content: content.trim(),
            school: school,
        });

        // 2. [알림 생성] 게시글 작성자에게 알림 발송
        const post = await PostModel.findById(validPostId);

        // 게시글이 존재하고, 댓글 작성자가 본인이 아닐 경우에만 알림
        if (post && post.userId !== userId) {
            await NotificationModel.create({
                userId: post.userId, // 수신자: 게시글 작성자
                type: 'comment',
                content: `'${post.title}' 글에 댓글이 달렸습니다: "${content.substring(0, 15)}${content.length > 15 ? '...' : ''}"`,
                isRead: false,
                relatedUrl: `/community/${postId}`, // ⭐️ 이동할 링크 저장
                createdAt: new Date(),
            });
        }

        const commentObject = JSON.parse(JSON.stringify(newComment));

        return NextResponse.json(
            { success: true, data: commentObject },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('댓글 생성 서버 오류:', error);
        return NextResponse.json(
            { success: false, error: '댓글 등록 중 서버 내부 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// 2. 댓글 목록 조회 (GET 요청)
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