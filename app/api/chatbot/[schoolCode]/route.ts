// 📁 app/api/chat/[schoolCode]/route.ts (다중 학교 챗봇 API)

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
// ⭐️ 이 유틸리티 파일이 Google Sheets에서 데이터를 불러옵니다.
import { loadRuleDataFromSheet } from '@/lib/google-sheet-loader'; 

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const dynamic = 'force-dynamic';

// URL 파라미터 타입 정의
interface RouteParams {
    params: {
        schoolCode: string; // URL에서 넘어오는 학교 코드 (예: 'dongyang', 'hanyang')
    };
}

// 💡 챗봇 답변을 생성하는 POST 요청 처리
export async function POST(req: Request, { params }: RouteParams) {
    const { message } = await req.json();
    const { schoolCode } = params; // ⭐️ URL에서 학교 코드를 받음

    // 1. Google Sheets에서 해당 학교의 학칙 데이터를 불러옵니다.
    const coreRuleData = await loadRuleDataFromSheet(schoolCode);

    // 2. 데이터 로드 실패 시 에러 반환 (loadRuleDataFromSheet 함수에서 에러 메시지를 생성)
    if (coreRuleData.startsWith("Error:")) {
        return NextResponse.json({ error: coreRuleData }, { status: 503 }); // 503 Service Unavailable
    }

    // 3. SYSTEM_PROMPT 구성: 동적 학교 이름과 학칙 데이터를 삽입
    const SYSTEM_PROMPT = `
        당신은 ${schoolCode} 학생을 위한 학칙 전문 AI 챗봇 'Rule-Look'입니다.
        사용자의 질문에 답변할 때, 아래의 [제공된 학칙 원문] 내용을 **최우선으로 참고**하여 답변해야 합니다.
        규정에 없는 내용은 '죄송하지만 해당 정보는 제공된 학칙에서 찾을 수 없습니다.'라고 답하세요.
        답변은 항상 한국어로 하고, 친근하고 명확한 말투를 사용하세요.
        
        ---
        [제공된 학칙 원문]
        ${coreRuleData} // ⭐️ Sheets에서 불러온 해당 학교 데이터가 여기에 삽입됩니다.
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