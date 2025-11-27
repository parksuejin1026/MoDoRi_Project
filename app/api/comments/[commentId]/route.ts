// 📁 app/api/comments/[commentId]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import dbConnect, { CommentModel } from '@/lib/db/mongodb';
import { Types } from 'mongoose';

export const dynamic = 'force-dynamic';

interface RouteParams {
    params: {
        commentId: string;
    };
}

// =======================================================
// 1. 댓글 수정 (PUT 요청)
// =======================================================
export async function PUT(req: NextRequest, { params }: RouteParams) {
    const { commentId } = params;

    if (!Types.ObjectId.isValid(commentId)) {
        return NextResponse.json(
            { success: false, error: '유효하지 않은 댓글 ID 형식입니다.' },
            { status: 400 }
        );
    }

    await dbConnect();

    try {
        const body = await req.json();
        const { content, currentUserId } = body;

        if (!content || !currentUserId) {
            return NextResponse.json(
                { success: false, error: '필수 데이터(내용, 사용자 ID)가 누락되었습니다.' },
                { status: 400 }
            );
        }

        const comment = await CommentModel.findById(commentId);

        if (!comment) {
            return NextResponse.json(
                { success: false, error: '댓글을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // ⭐️ [권한 검증] 작성자 본인만 수정 가능
        if (comment.userId !== currentUserId) {
            return NextResponse.json(
                { success: false, error: '본인의 댓글만 수정할 수 있습니다.' },
                { status: 403 }
            );
        }

        const updatedComment = await CommentModel.findByIdAndUpdate(
            commentId,
            { content: content.trim() },
            { new: true, runValidators: true }
        );

        // JSON 응답을 위해 순수 객체로 변환
        const commentObject = JSON.parse(JSON.stringify(updatedComment));

        return NextResponse.json(
            { success: true, data: commentObject },
            { status: 200 }
        );
    } catch (error) {
        console.error('댓글 수정 오류:', error);
        return NextResponse.json(
            { success: false, error: '댓글 수정 중 서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}


// =======================================================
// 2. 댓글 삭제 (DELETE 요청)
// =======================================================
export async function DELETE(req: NextRequest, { params }: RouteParams) {
    const { commentId } = params;

    if (!Types.ObjectId.isValid(commentId)) {
        return NextResponse.json(
            { success: false, error: '유효하지 않은 댓글 ID 형식입니다.' },
            { status: 400 }
        );
    }

    await dbConnect();

    try {
        const body = await req.json();
        const { currentUserId } = body;

        if (!currentUserId) {
            return NextResponse.json(
                { success: false, error: '사용자 인증 정보가 누락되었습니다.' },
                { status: 400 }
            );
        }

        const comment = await CommentModel.findById(commentId);

        if (!comment) {
            return NextResponse.json(
                { success: false, error: '댓글을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // ⭐️ [권한 검증] 작성자 본인만 삭제 가능
        if (comment.userId !== currentUserId) {
            return NextResponse.json(
                { success: false, error: '본인의 댓글만 삭제할 수 있습니다.' },
                { status: 403 }
            );
        }

        await CommentModel.findByIdAndDelete(commentId);

        return NextResponse.json(
            { success: true, message: '댓글이 성공적으로 삭제되었습니다.' },
            { status: 200 }
        );

    } catch (error) {
        console.error('댓글 삭제 오류:', error);
        return NextResponse.json(
            { success: false, error: '댓글 삭제 중 서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ error: '잘못된 접근입니다. 댓글 목록은 /api/comments 로 조회하세요.' }, { status: 405 });
}