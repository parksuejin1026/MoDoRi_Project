import { NextResponse } from 'next/server';
import dbConnect, { ChatMessageModel, ChatSessionModel } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

// 1. 특정 세션의 메시지 가져오기
export async function GET(req: Request, { params }: { params: { sessionId: string } }) {
    try {
        const { sessionId } = params;

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        await dbConnect();

        const messages = await ChatMessageModel.find({ sessionId })
            .sort({ createdAt: 1 }); // 오래된 순으로 정렬

        return NextResponse.json({ messages });
    } catch (error) {
        console.error('Get Messages Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// ⭐️ 2. [추가] 채팅 세션 삭제하기 (DELETE)
export async function DELETE(req: Request, { params }: { params: { sessionId: string } }) {
    try {
        const { sessionId } = params;

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        await dbConnect();

        // 1. 세션 삭제
        const sessionResult = await ChatSessionModel.findByIdAndDelete(sessionId);

        if (!sessionResult) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // 2. 해당 세션의 모든 메시지 삭제
        await ChatMessageModel.deleteMany({ sessionId });

        return NextResponse.json({ success: true, message: 'Session deleted successfully' });

    } catch (error) {
        console.error('Delete Session Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}