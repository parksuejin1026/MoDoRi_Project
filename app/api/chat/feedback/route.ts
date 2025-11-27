// 📁 app/api/chat/feedback/route.ts

import { NextResponse, NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * AI 답변 피드백을 기록하는 API 엔드포인트입니다.
 * 실제 서비스에서는 이 데이터를 MongoDB나 전용 로깅 시스템에 저장해야 합니다.
 * 현재는 기능 구현 확인을 위해 서버 콘솔에 정보를 출력합니다.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, messageId, schoolCode, content, feedbackType } = body;

        if (!userId || !messageId || !schoolCode || !feedbackType) {
            return NextResponse.json(
                { success: false, error: '필수 피드백 항목이 누락되었습니다.' },
                { status: 400 }
            );
        }

        // ⭐️ [로깅] 서버 콘솔에 피드백 정보를 출력합니다.
        console.log(`\n--- AI FEEDBACK RECEIVED ---`);
        console.log(`User ID: ${userId}`);
        console.log(`Message ID: ${messageId}`);
        console.log(`School: ${schoolCode}`);
        console.log(`Feedback Type: ${feedbackType === 'up' ? 'Positive (👍)' : 'Negative (👎)'}`);
        console.log(`Content Preview: ${content.substring(0, 50)}...`);
        console.log(`----------------------------\n`);

        return NextResponse.json(
            { success: true, message: '피드백이 성공적으로 기록되었습니다.' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Feedback API Error:', error);
        return NextResponse.json(
            { success: false, error: '피드백 처리 중 서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}