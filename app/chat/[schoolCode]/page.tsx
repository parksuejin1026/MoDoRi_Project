'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Send, Bot, User, RotateCcw } from 'lucide-react';

interface ChatPageProps {
  params: {
    schoolCode: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const { schoolCode } = params;

  // Vercel AI SDK의 useChat 훅 사용
  // setInput을 추가로 destructuring하여 추천 질문 클릭 시 입력창 제어
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, setInput } = useChat({
    api: `/api/chat/${schoolCode}`,
    initialMessages: [
      { id: 'welcome', role: 'assistant', content: "안녕하세요! 학칙 봇입니다. 궁금한 점을 물어보세요." }
    ],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 채팅 초기화 핸들러
  const handleReset = () => {
    if (confirm('대화 내용을 모두 지우고 처음부터 다시 시작하시겠습니까?')) {
      setMessages([
        { id: 'welcome', role: 'assistant', content: "안녕하세요! 학칙 봇입니다. 궁금한 점을 물어보세요." }
      ]);
    }
  };

  // 추천 질문 목록
  const suggestedQuestions = [
    "휴학은 어떻게 신청해?",
    "장학금 받을 수 있는 조건이 뭐야?",
    "졸업 요건 알려줘",
    "전과하려면 어떻게 해야 해?"
  ];

  // 추천 질문 클릭 핸들러
  const handleSuggestedClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* 챗봇 헤더 */}
      <div className="px-5 py-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md flex flex-col justify-between min-h-[100px]">
        {/* 상단 네비게이션 행 */}
        <div className="flex items-center justify-between mb-2">
          {/* 뒤로가기 버튼 */}
          <Link href="/select-school" className="flex items-center gap-1 text-white/90 hover:text-white transition-colors px-2 py-1 -ml-2 rounded-lg hover:bg-white/10">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">뒤로가기</span>
          </Link>

          {/* 초기화 버튼 */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-white/90 hover:text-white transition-colors px-2 py-1 -mr-2 rounded-lg hover:bg-white/10"
          >
            <RotateCcw size={16} />
            <span className="text-xs font-medium">초기화</span>
          </button>
        </div>

        {/* 타이틀 영역 */}
        <div>
          <h2 className="text-xl font-bold mb-1 uppercase tracking-wide">{schoolCode} 챗봇</h2>
          <p className="text-xs text-blue-100 opacity-90">학칙에 대해 무엇이든 물어보세요</p>
        </div>
      </div>

      {/* 메시지 목록 영역 */}
      {/* pb-48: 입력창과 추천 질문 영역, 탭바 높이를 고려하여 하단 여백을 넉넉히 줍니다. */}
      <div className="flex-1 overflow-y-auto p-5 pb-48 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* 아바타 아이콘 */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-600'
              }`}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>

            {/* 말풍선 */}
            <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
              ? 'bg-blue-600 text-white rounded-tr-none'
              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none text-gray-800 prose-p:my-1 prose-ul:my-2 prose-li:my-0">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {/* 로딩 인디케이터 */}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
              <Bot size={18} />
            </div>
            <div className="bg-white text-gray-500 p-3.5 rounded-2xl rounded-tl-none border border-gray-100 text-sm animate-pulse shadow-sm">
              답변을 생성하고 있습니다...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 영역 (하단 고정) */}
      {/* bottom-[60px]: 탭바(TabBar)의 높이(약 60px)만큼 위로 띄웁니다. */}
      <div className="fixed bottom-[85px] left-0 right-0 max-w-[393px] mx-auto px-4 py-3 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-20 flex flex-col gap-3 transition-all">

        {/* 예시 질문 (초기 상태일 때만 표시) */}
        {messages.length < 3 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedClick(q)}
                className="whitespace-nowrap px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100 hover:bg-blue-100 active:scale-95 transition-all shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            className="flex-1 px-4 py-3 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:bg-blue-700 shadow-md active:scale-95"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}