// 📁 app/api/community/[postId]/route.ts (GET, PUT, DELETE, PATCH 통합)

import { NextResponse, NextRequest } from 'next/server';
import dbConnect, { PostModel } from '@/lib/db/mongodb';
import { Types } from 'mongoose';

export const dynamic = 'force-dynamic';

// URL 파라미터 타입 정의
interface RouteParams {
    params: {
        postId: string;
    };
}

// 1. 게시글 단일 조회 (GET 요청)
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
        const post = await PostModel.findById(postId).lean();

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
export async function PUT(req: NextRequest, { params }: RouteParams) {
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
        const { title, content, author, category, currentUserId } = body;

        if (!title || !content || !currentUserId) {
            return NextResponse.json(
                { success: false, error: '필수 입력 항목이 누락되었습니다.' },
                { status: 400 }
            );
        }

        const post = await PostModel.findById(postId);

        if (!post) {
            return NextResponse.json(
                { success: false, error: '게시글을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // ⭐️ [점검] 권한 확인: 게시물 작성자 ID와 현재 사용자 ID 비교
        if (post.userId !== currentUserId) {
            return NextResponse.json(
                { success: false, error: '본인의 게시물만 수정할 수 있습니다.' },
                { status: 403 } // 권한 없음
            );
        }

        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            { title, content, author, category, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        return NextResponse.json(
            { success: true, data: { _id: updatedPost?._id.toString() } },
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
export async function DELETE(req: NextRequest, { params }: RouteParams) {
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
        const { currentUserId } = body;

        if (!currentUserId) {
            return NextResponse.json(
                { success: false, error: '사용자 인증 정보가 누락되었습니다.' },
                { status: 400 }
            );
        }

        const post = await PostModel.findById(postId);

        if (!post) {
            return NextResponse.json(
                { success: false, error: '게시글을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // ⭐️ [점검] 권한 확인: 게시물 작성자 ID와 현재 사용자 ID 비교 (다른 사람 게시물 삭제 방지)
        if (post.userId !== currentUserId) {
            return NextResponse.json(
                { success: false, error: '본인의 게시물만 삭제할 수 있습니다.' },
                { status: 403 }
            );
        }

        const deletedPost = await PostModel.findByIdAndDelete(postId);

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


// 4. 좋아요 처리 (PATCH 요청)
export async function PATCH(req: NextRequest, { params }: RouteParams) {
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
        const { currentUserId } = body;

        if (!currentUserId) {
            return NextResponse.json(
                { success: false, error: '사용자 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const post = await PostModel.findById(postId);

        if (!post) {
            return NextResponse.json(
                { success: false, error: '게시글을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const isLiked = post.likes.includes(currentUserId);

        let updateQuery;
        if (isLiked) {
            // 좋아요 취소: 배열에서 ID 제거
            updateQuery = { $pull: { likes: currentUserId } };
        } else {
            // 좋아요 추가: 배열에 ID 추가
            updateQuery = { $push: { likes: currentUserId } };
        }

        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            updateQuery,
            { new: true }
        );

        return NextResponse.json(
            { success: true, isLiked: !isLiked, likesCount: updatedPost?.likes.length },
            { status: 200 }
        );

    } catch (error) {
        console.error('좋아요 처리 오류:', error);
        return NextResponse.json(
            { success: false, error: '좋아요 처리 중 서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}