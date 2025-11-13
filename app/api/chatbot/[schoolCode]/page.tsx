// 📁 app/chat/[schoolCode]/page.tsx (동적 챗봇 페이지)

'use client'; 

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { DeleteButton } from '@/components/DeleteButton'; // (예시 - 현재 삭제 버튼은 커뮤니티용)

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot'; 
}

// ⭐️ 컴포넌트에 필요한 props 타입 정의
interface ChatPageProps {
    params: {
        schoolCode: string; // URL에서 넘어오는 학교 코드
    };
}

// 챗봇의 초기 인사말
const initialMessages: Message[] = [
    { id: 1, text: "안녕하세요! 학칙 봇입니다. 답변을 받을 학교를 선택해주셔서 감사합니다.", sender: 'bot' }
];

export default function ChatPage({ params }: ChatPageProps) { // ⭐️ props로 schoolCode를 받음
  const { schoolCode } = params; // ⭐️ schoolCode 추출
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 자동 스크롤 로직 (이전과 동일)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); 

  // ⭐️ API 호출 URL을 동적으로 설정
  const chatApiUrl = `/api/chat/${schoolCode}`; 

  // 3. 채팅 초기화 함수
  const handleReset = useCallback(() => {
      if (confirm('현재 대화 내용을 모두 지우고 새롭게 시작하시겠습니까?')) {
          setMessages(initialMessages);
          setInput('');
          setIsLoading(false);
      }
  }, []);

  // ********** 핵심 기능: 메시지 전송 처리 함수 **********
  const handleSend = useCallback(async () => {
    if (input.trim() === '' || isLoading) return;

    const newUserMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // ⭐️ API Route로 요청 보내기 (schoolCode가 포함된 동적 경로 사용)
      const response = await fetch(chatApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newUserMessage.text }),
      });

      if (!response.ok) {
        throw new Error('챗봇 API 통신에 실패했습니다.');
      }

      const data = await response.json();
      
      const newBotMessage: Message = { 
        id: Date.now() + 1, 
        text: data.reply || "죄송합니다. 답변을 처리하지 못했습니다.", 
        sender: 'bot' 
      };
      
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);

    } catch (error) {
      console.error("챗봇 API 통신 오류:", error);
      const errorMessage: Message = {
        id: Date.now() + 1, 
        text: "시스템 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", 
        sender: 'bot' 
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, chatApiUrl]);


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  // ********** 화면 렌더링 **********
  return (
    <div className="chat-page-container">
        <div className="chat-actions-bar">
            {/* 상단 표시: 현재 답변 학교 */}
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                {schoolCode.toUpperCase()} 챗봇 서비스
            </h2>
            
            {/* 메인 홈 이동 버튼 */}
            <Link href="/" passHref legacyBehavior>
                <a className="btn btn-ghost btn-small">
                    홈으로
                </a>
            </Link>
            
            {/* 채팅 초기화 버튼 */}
            <button onClick={handleReset} className="btn btn-ghost btn-small">
                대화 초기화
            </button>
        </div>
      
      {/* 1. 채팅창 영역 (UI는 이전과 동일) */}
      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {/* 로딩 표시 */}
        {isLoading && (
          <div className="message-bubble bot loading">
             <div className="loading-spinner"></div>
             답변 생성 중...
          </div>
        )}
        <div ref={messagesEndRef} /> 
      </div>

      {/* 2. 입력창 영역 (UI는 이전과 동일) */}
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="학칙에 대해 질문하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? '전송 중' : '전송'}
        </button>
      </div>
      
      {/* ⭐️ CSS는 globals.css에서 관리되거나, 이전 chat page의 인라인 스타일을 사용합니다. */}
      {/* 인라인 스타일은 가독성을 위해 생략합니다. (이전 chat page.tsx의 style jsx를 그대로 사용해야 합니다) */}
    </div>
  );
}