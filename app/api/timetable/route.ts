// 📁 app/api/timetable/route.ts
import { NextResponse } from 'next/server';
import dbConnect, { TimetableModel } from '@/lib/db/mongodb';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// GET: 내 시간표 조회
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { success: false, error: '사용자 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const timetable = await TimetableModel.findOne({ userId });

        return NextResponse.json({
            success: true,
            data: timetable ? timetable.courses : []
        });

    } catch (error) {
        console.error('시간표 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '시간표를 불러오는 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// POST: 시간표 저장 (전체 덮어쓰기)
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const { userId, courses } = body;

        if (!userId || !Array.isArray(courses)) {
            return NextResponse.json(
                { success: false, error: '잘못된 요청 데이터입니다.' },
                { status: 400 }
            );
        }

        // upsert: true 옵션으로 없으면 생성, 있으면 업데이트
        const updatedTimetable = await TimetableModel.findOneAndUpdate(
            { userId },
            { $set: { courses, updatedAt: new Date() } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({
            success: true,
            data: updatedTimetable.courses
        });

    } catch (error) {
        console.error('시간표 저장 오류:', error);
        return NextResponse.json(
            { success: false, error: '시간표 저장 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
