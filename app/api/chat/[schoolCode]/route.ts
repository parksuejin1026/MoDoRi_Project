// 📁 app/api/chat/[schoolCode]/route.ts (AI SDK v3 & Streaming)

import { OpenAIStream } from 'ai';
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

// 💡 챗봇 답변을 생성하는 POST 요청 처리 (Streaming 적용)
export async function POST(req: Request, { params }: RouteParams) {
    const { messages } = await req.json();
    const { schoolCode } = params;

    // 1. Google Sheets에서 해당 학교의 학칙 데이터를 불러옵니다.
    const coreRuleData = await loadRuleDataFromSheet(schoolCode);

    // 2. 데이터 로드 실패 시 에러 반환
    if (coreRuleData.startsWith("Error:")) {
        console.error("Sheets 데이터 로드 오류:", coreRuleData);
        return new Response(JSON.stringify({ error: coreRuleData }), { status: 503 });
    }

    // ⭐️ 3. SYSTEM_PROMPT 구성
    const SYSTEM_PROMPT = `
        당신은 ${schoolCode} 학생을 위한 **냉철하고 정확한 학칙 전문 해석가** 'Rule-Look'입니다.
        
        [제약 조건]
        1. 모든 답변은 아래의 **[제공된 학칙 원문] 내용만을 근거**로 하여 **반드시 한국어로** 작성해야 합니다.
        2. 답변을 할 때는 관련 **조항 번호, 장, 절** 등을 인용하거나 명시하여 답변의 근거를 명확히 제시하십시오.
        3. [제공된 학칙 원문]에서 답변의 근거를 **찾을 수 없는 경우**, 절대 추측하거나 일반적인 지식으로 답변하지 마십시오. 대신 "죄송하지만, 해당 질문에 대한 구체적인 규정은 제공된 학칙 원문에서 찾을 수 없습니다."라고 안내해야 합니다.
        4. 친근하지만 권위 있고 명확한 말투를 사용하십시오.
        5. 답변은 **Markdown** 형식을 사용하여 가독성을 높이십시오. (중요한 단어는 **볼드체**, 목록은 - 사용 등)
        
        ---
        [제공된 학칙 원문]
        ${coreRuleData}
        ---
    `;

    try {
        // 4. OpenAI API 호출 (Streaming 모드)
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // ⭐️ 더 똑똑하고 빠른 모델로 교체
            stream: true, // ⭐️ 스트리밍 활성화
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                // ⭐️ 이전 대화 맥락 포함 (불필요한 필드 제거하여 API 오류 방지)
                ...messages.map((m: any) => ({ role: m.role, content: m.content })),
            ],
            temperature: 0.5, // 정확도 중시
        });

        // 5. 스트림 응답 반환 (StreamingTextResponse 대신 표준 Response 사용)
        // ⭐️ as any 캐스팅으로 타입 불일치 해결
        const stream = OpenAIStream(response as any);
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'X-Vercel-AI-SDK-Stream': '1',
            },
        });

    } catch (error) {
        console.error('OpenAI API 통신 오류:', error);
        return new Response(JSON.stringify({ error: 'OpenAI API 통신 중 서버 오류가 발생했습니다.' }), { status: 500 });
    }
}