import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { loadRuleDataFromSheet } from '@/lib/google-sheet-loader';
import dbConnect, { ChatMessageModel, ChatSessionModel } from '@/lib/db/mongodb';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { schoolCode: string } }) {
    try {
        const { messages, sessionId } = await req.json();
        const { schoolCode } = params;

        // 학칙 데이터 로드 (여기서 학칙 시트 ID를 사용함)
        const coreRuleData = await loadRuleDataFromSheet(schoolCode);

        if (coreRuleData.startsWith("Error:")) {
            console.error("Sheets Load Error:", coreRuleData);
            return new Response(JSON.stringify({ error: coreRuleData }), { status: 503 });
        }

        const SYSTEM_PROMPT = `
      당신은 ${schoolCode} 학생을 위한 학칙 전문 AI 비서 'Rule-Look'입니다.
      아래 [학칙 원문]을 근거로 답변하고, 조항 번호를 언급하세요.
      
      [학칙 원문]
      ${coreRuleData}
    `;

        // ⭐️ 사용자 메시지 저장
        if (sessionId) {
            await dbConnect();
            const lastUserMessage = messages[messages.length - 1];
            if (lastUserMessage.role === 'user') {
                await ChatMessageModel.create({
                    sessionId,
                    role: 'user',
                    content: lastUserMessage.content,
                });
            }
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            stream: true,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages,
            ],
            temperature: 0.3,
        });

        const stream = OpenAIStream(response as any, {
            onCompletion: async (completion) => {
                // ⭐️ AI 응답 저장
                if (sessionId) {
                    await dbConnect();
                    await ChatMessageModel.create({
                        sessionId,
                        role: 'assistant',
                        content: completion,
                    });

                    // 세션 업데이트 시간 갱신
                    await ChatSessionModel.findByIdAndUpdate(sessionId, { updatedAt: new Date() });
                }
            },
        });
        return new StreamingTextResponse(stream);

    } catch (error: any) {
        console.error('OpenAI API Error:', error);
        return new Response(JSON.stringify({ error: 'AI 서버 오류 발생' }), { status: 500 });
    }
}