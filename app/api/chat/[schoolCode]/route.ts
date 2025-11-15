// 📁 app/api/chat/[schoolCode]/route.ts (프롬프트 강화 버전)

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
// Google Sheets에서 학칙 데이터를 불러오는 유틸리티
import { loadRuleDataFromSheet } from '@/lib/google-sheet-loader'; 

// ⭐️ 환경 변수에 설정된 OpenAI Key 사용
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const dynamic = 'force-dynamic';

// URL 파라미터 타입 정의
interface RouteParams {
    params: {
        schoolCode: string; 
    };
}

// 💡 챗봇 답변을 생성하는 POST 요청 처리
export async function POST(req: Request, { params }: RouteParams) {
    const { message } = await req.json();
    const { schoolCode } = params; 

    // 1. Google Sheets에서 해당 학교의 학칙 데이터를 불러옵니다.
    const coreRuleData = await loadRuleDataFromSheet(schoolCode);

    // 2. 데이터 로드 실패 시 에러 반환
    if (coreRuleData.startsWith("Error:")) {
        console.error("Sheets 데이터 로드 오류:", coreRuleData);
        return NextResponse.json({ error: coreRuleData }, { status: 503 }); // 503 Service Unavailable
    }

    // ⭐️ 3. SYSTEM_PROMPT 구성: 전문성 및 제약 조건 강화
    const SYSTEM_PROMPT = `
        당신은 ${schoolCode} 학생을 위한 **냉철하고 정확한 학칙 전문 해석가** 'Rule-Look'입니다.
        
        [제약 조건]
        1. 모든 답변은 아래의 **[제공된 학칙 원문] 내용만을 근거**로 하여 **반드시 한국어로** 작성해야 합니다.
        2. 답변을 할 때는 관련 **조항 번호, 장, 절** 등을 인용하거나 명시하여 답변의 근거를 명확히 제시하십시오.
        3. [제공된 학칙 원문]에서 답변의 근거를 **찾을 수 없는 경우**, 절대 추측하거나 일반적인 지식으로 답변하지 마십시오. 대신 "죄송하지만, 해당 질문에 대한 구체적인 규정은 제공된 학칙 원문에서 찾을 수 없습니다."라고 안내해야 합니다.
        4. 친근하지만 권위 있고 명확한 말투를 사용하십시오.
        
        ---
        [제공된 학칙 원문]
        ${coreRuleData} // 👈 Google Sheets에서 가져온 통합 데이터 (장학금+학칙)가 삽입됨
        ---
    `;

    try {
        // 4. OpenAI API 호출
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // LLM 모델은 그대로 유지
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: message }],
            temperature: 0.7, // 창의성 조절 (규정 답변이므로 낮게 설정)
        });

        const reply = chatCompletion.choices[0]?.message?.content || "답변 생성 실패";
        return NextResponse.json({ reply });
    } catch (error) {
        console.error('OpenAI API 통신 오류:', error);
        return NextResponse.json({ error: 'OpenAI API 통신 중 서버 오류가 발생했습니다. (API Key 확인)' }, { status: 500 });
    }
}