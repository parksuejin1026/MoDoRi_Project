// 📁 app/api/community/[postId]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import dbConnect, { PostModel, NotificationModel } from '@/lib/db/mongodb';
import { Types } from 'mongoose';

export const dynamic = 'force-dynamic';

interface RouteParams {
    params: {
        postId: string;
    };
}

// 1. 게시글 단일 조회 (GET)
export async function GET(req: Request, { params }: RouteParams) {
    const { postId } = params;

    if (!Types.ObjectId.isValid(postId)) {
        return NextResponse.json({ success: false, error: '유효하지 않은 게시글 ID 형식입니다.' }, { status: 400 });
    }

    await dbConnect();

    try {
        const post = await PostModel.findById(postId).lean();
        if (!post) {
            return NextResponse.json({ success: false, error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: { ...post, _id: post._id.toString() } }, { status: 200 });
    } catch (error) {
        console.error('게시글 조회 오류:', error);
        return NextResponse.json({ success: false, error: '서버 오류' }, { status: 500 });
    }
}

// 2. 게시글 수정 (PUT)
export async function PUT(req: NextRequest, { params }: RouteParams) {
    const { postId } = params;
    if (!Types.ObjectId.isValid(postId)) return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });

    await dbConnect();

    try {
        const body = await req.json();
        const { title, content, author, category, currentUserId } = body;

        if (!title || !content || !currentUserId) {
            return NextResponse.json({ success: false, error: '필수 항목 누락' }, { status: 400 });
        }

        const post = await PostModel.findById(postId);
        if (!post) return NextResponse.json({ success: false, error: 'Not Found' }, { status: 404 });

        // 권한 확인
        if (post.userId !== currentUserId) {
            return NextResponse.json({ success: false, error: '권한이 없습니다.' }, { status: 403 });
        }

        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            { title, content, author, category, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        return NextResponse.json({ success: true, data: { _id: updatedPost?._id.toString() } }, { status: 200 });
    } catch (error) {
        console.error('수정 오류:', error);
        return NextResponse.json({ success: false, error: '서버 오류' }, { status: 500 });
    }
}

// 3. 게시글 삭제 (DELETE)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
    const { postId } = params;
    if (!Types.ObjectId.isValid(postId)) return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });

    await dbConnect();

    try {
        const body = await req.json();
        const { currentUserId } = body;

        if (!currentUserId) return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });

        const post = await PostModel.findById(postId);
        if (!post) return NextResponse.json({ success: false, error: 'Not Found' }, { status: 404 });

        // 권한 확인
        if (post.userId !== currentUserId) {
            return NextResponse.json({ success: false, error: '권한이 없습니다.' }, { status: 403 });
        }

        await PostModel.findByIdAndDelete(postId);
        return NextResponse.json({ success: true, message: '삭제되었습니다.' }, { status: 200 });
    } catch (error) {
        console.error('삭제 오류:', error);
        return NextResponse.json({ success: false, error: '서버 오류' }, { status: 500 });
    }
}

// 4. 좋아요 토글 (PATCH) + 알림 기능 포함
export async function PATCH(req: NextRequest, { params }: RouteParams) {
    const { postId } = params;

    if (!Types.ObjectId.isValid(postId)) {
        return NextResponse.json({ success: false, error: '유효하지 않은 ID' }, { status: 400 });
    }

    await dbConnect();

    try {
        const body = await req.json();
        const { currentUserId } = body;

        if (!currentUserId) {
            return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 400 });
        }

        const post = await PostModel.findById(postId);
        if (!post) {
            return NextResponse.json({ success: false, error: '게시글 없음' }, { status: 404 });
        }

        const isLiked = post.likes.includes(currentUserId);
        let updateQuery;

        if (isLiked) {
            // 좋아요 취소
            updateQuery = { $pull: { likes: currentUserId } };
        } else {
            // 좋아요 추가
            updateQuery = { $push: { likes: currentUserId } };

            // [알림 생성] 본인 글이 아닐 때만 알림 발송
            if (post.userId !== currentUserId) {
                await NotificationModel.create({
                    userId: post.userId,
                    type: 'like',
                    content: `'${post.title}' 글에 좋아요가 추가되었습니다.`,
                    isRead: false,
                    relatedUrl: `/community/${postId}`, // ⭐️ 이동할 링크 저장
                    createdAt: new Date(),
                });
            }
        }

        const updatedPost = await PostModel.findByIdAndUpdate(postId, updateQuery, { new: true });

        return NextResponse.json(
            { success: true, isLiked: !isLiked, likesCount: updatedPost?.likes.length },
            { status: 200 }
        );

    } catch (error) {
        console.error('좋아요 처리 오류:', error);
        return NextResponse.json({ success: false, error: '서버 오류' }, { status: 500 });
    }
}