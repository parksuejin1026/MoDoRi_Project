// 📁 app/api/chat/[schoolCode]/route.ts (복구된 코드)

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { loadRuleDataFromSheet } from '@/lib/google-sheet-loader'; 

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const dynamic = 'force-dynamic';

interface RouteParams {
    params: {
        schoolCode: string;
    };
}

// 💡 챗봇 답변을 생성하는 POST 요청 처리 (405 오류 방지)
export async function POST(req: Request, { params }: RouteParams) {
    const { message } = await req.json();
    const { schoolCode } = params; 

    // 1. Google Sheets에서 학칙 데이터를 불러옵니다.
    const coreRuleData = await loadRuleDataFromSheet(schoolCode);

    // 2. 데이터 로드 실패 시 에러 반환 (503 오류 발생 가능)
    if (coreRuleData.startsWith("Error:")) {
        return NextResponse.json({ error: coreRuleData }, { status: 503 });
    }

    // 3. SYSTEM_PROMPT 구성
    const SYSTEM_PROMPT = `
        당신은 ${schoolCode} 학생을 위한 학칙 전문 AI 챗봇 'Rule-Look'입니다.
        사용자의 질문에 답변할 때, 아래의 [제공된 학칙 원문] 내용을 **최우선으로 참고**하여 답변해야 합니다.
        규정에 없는 내용은 '죄송하지만 해당 정보는 제공된 학칙에서 찾을 수 없습니다.'라고 답하세요.
        답변은 항상 한국어로 하고, 친근하고 명확한 말투를 사용하세요.
        ---
        [제공된 학칙 원문]
        ${coreRuleData}
        ---
    `;

    try {
        // 4. OpenAI API 호출
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: message }],
            temperature: 0.7,
        });

        const reply = chatCompletion.choices[0]?.message?.content || "답변 생성 실패";
        return NextResponse.json({ reply });
    } catch (error) {
        console.error('OpenAI API 통신 오류:', error);
        return NextResponse.json({ error: 'OpenAI API 통신 중 서버 오류가 발생했습니다.' }, { status: 500 });
    }
}