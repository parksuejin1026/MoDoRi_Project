import { NextResponse } from 'next/server';
import dbConnect, { ChatSessionModel } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const schoolCode = searchParams.get('schoolCode');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await dbConnect();

        const query: any = { userId };
        if (schoolCode) {
            query.schoolCode = schoolCode;
        }

        const sessions = await ChatSessionModel.find(query)
            .sort({ updatedAt: -1 })
            .limit(50); // 최근 50개만

        return NextResponse.json({ sessions });
    } catch (error) {
        console.error('Get Sessions Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId, schoolCode, title } = await req.json();

        if (!userId || !schoolCode) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        const newSession = await ChatSessionModel.create({
            userId,
            schoolCode,
            title: title || '새로운 대화',
        });

        return NextResponse.json({ session: newSession }, { status: 201 });
    } catch (error) {
        console.error('Create Session Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
