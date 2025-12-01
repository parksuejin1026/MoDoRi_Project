import { NextResponse } from 'next/server';
import dbConnect, { ChatMessageModel } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

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
