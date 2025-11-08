// 📁 app/api/chatbot/route.ts 파일 내용 (수정본)

import OpenAI from 'openai';
import { NextResponse } from 'next/server';
// ⭐️ 1. lib 폴더에서 통합된 학칙 데이터를 불러옵니다.
import { coreRuleData } from '@/lib/ruleData';

// 1. OpenAI 인스턴스 생성 (동일)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 2. 챗봇의 역할을 정의하는 프롬프트 (가장 중요: 데이터 참고 명령 포함)
const SYSTEM_PROMPT = `
당신은 대한민국 대학생을 위한 친절하고 정확한 학칙 전문 AI 챗봇 'Rule-Look'입니다.
사용자의 질문에 답변할 때, **반드시** 아래의 [제공된 학칙 원문] 내용을 **최우선으로 참고**하여 답변해야 합니다.
규정에 없는 내용은 '죄송하지만 해당 정보는 제공된 학칙에서 찾을 수 없습니다.'라고 답하세요.
답변은 항상 한국어로 하고, 친근하고 명확한 말투를 사용하세요.

---
[제공된 학칙 원문]
${coreRuleData}  // ⭐️⭐️ 여기에 통합된 모든 학칙 데이터가 삽입됩니다. ⭐️⭐️
---
`;

// 3. POST 요청 처리 함수 (동일)
export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT }, // 수정된 SYSTEM_PROMPT 사용
        { role: 'user', content: message },
      ],
      temperature: 0.7,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "답변을 생성하지 못했습니다.";
    return NextResponse.json({ reply });

  } catch (error) {
    console.error('OpenAI API 통신 오류:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}