// 📁 app/chat/page.tsx 파일 내용 (기능 추가)

'use client'; 

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link'; // ⭐️ Link 컴포넌트 import

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot'; 
}

// 챗봇의 초기 인사말
const initialMessages: Message[] = [
    { id: 1, text: "안녕하세요! Rule-Look 학칙 봇입니다. 무엇이 궁금하신가요? (예: 휴학 신청 기간, 재수강)", sender: 'bot' }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 자동 스크롤 로직 (이전과 동일)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]); 

  // ⭐️ 1. 채팅 초기화 함수 추가
  const handleReset = useCallback(() => {
      if (confirm("현재 대화 내용을 모두 지우고 새롭게 시작하시겠습니까?")) {
          setMessages(initialMessages);
          setInput('');
          setIsLoading(false);
      }
  }, []);

  // ********** 핵심 기능: 메시지 전송 처리 함수 (변화 없음) **********
  const handleSend = useCallback(async () => {
    if (input.trim() === '' || isLoading) return;

    const newUserMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newUserMessage.text }),
      });

      if (!response.ok) {
        throw new Error('API 응답을 받지 못했습니다.');
      }

      const data = await response.json();
      
      const newBotMessage: Message = { 
        id: Date.now() + 1, 
        text: data.reply || "죄송합니다. 답변을 처리하지 못했습니다. (API 통신 실패)", 
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
  }, [input, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  // ********** 화면 렌더링 **********
  return (
    <div className="chat-page-container">
        {/* ⭐️ 상단 액션 바 추가 */}
        <div className="chat-actions-bar">
            {/* ⭐️ 1. 메인으로 돌아가기 버튼 */}
            <Link href="/" passHref legacyBehavior>
                <a className="btn btn-ghost btn-small">
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    메인 홈
                </a>
            </Link>
            {/* ⭐️ 3. 채팅 초기화 버튼 */}
            <button onClick={handleReset} className="btn btn-ghost btn-small">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6"></path>
                    <path d="M22 11.5a10 10 0 0 0-20-3v3M2 12.5a10 10 0 0 0 20 3v-3"></path>
                </svg>
                대화 초기화
            </button>
        </div>
      
      {/* 2. 채팅창 영역 */}
      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {/* 로딩 표시 */}
        {isLoading && (
          <div className="message-bubble bot loading">
             {/* ⭐️ 2. 로딩 스피너와 텍스트 */}
             <div className="loading-spinner"></div>
             답변 생성 중...
          </div>
        )}
        <div ref={messagesEndRef} /> 
      </div>

      {/* 3. 입력창 영역 */}
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
      
      {/* 이 페이지를 위한 CSS 스타일 (새로운 스타일 추가) */}
      <style jsx>{`
        /* 기존 CSS는 그대로 유지 */
        .chat-page-container {
          max-width: 800px;
          margin: 2rem auto;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 70vh;
          min-height: 500px;
        }
        .chat-window {
          flex-grow: 1;
          padding: 20px;
          overflow-y: auto;
          background-color: #f7f9fc;
        }
        .message-bubble {
          max-width: 80%;
          padding: 10px 15px;
          border-radius: 20px;
          margin-bottom: 15px;
          line-height: 1.4;
          display: flex; /* 스피너를 위한 flex 설정 */
          align-items: center;
        }
        .user {
          background-color: var(--color-primary);
          color: white;
          margin-left: auto;
          border-bottom-right-radius: 5px;
        }
        .bot {
          background-color: var(--color-white);
          color: var(--color-text-primary);
          margin-right: auto;
          border: 1px solid var(--color-border);
          border-bottom-left-radius: 5px;
        }
        .loading {
          font-style: italic;
          opacity: 0.8;
          color: var(--color-text-secondary);
        }
        .chat-input-area {
          display: flex;
          padding: 15px;
          border-top: 1px solid var(--color-border);
          background-color: var(--color-white);
        }
        .chat-input-area input {
          flex-grow: 1;
          padding: 10px 15px;
          border: 1px solid var(--color-border);
          border-radius: 20px;
          margin-right: 10px;
          font-size: 1rem;
        }
        .chat-input-area input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        .chat-input-area button {
          padding: 10px 20px;
          border-radius: 20px;
        }

        /* ⭐️ 새로 추가된 스타일 */
        .chat-actions-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            border-bottom: 1px solid var(--color-border);
            background-color: #f0f4f8;
        }

        .btn-small {
            padding: 5px 10px;
            font-size: 0.9rem;
        }
        .btn-small .icon {
            width: 1rem;
            height: 1rem;
            margin-right: 5px;
        }
        
        /* ⭐️ 로딩 스피너 CSS */
        .loading-spinner {
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-top: 3px solid var(--color-primary);
            border-radius: 50%;
            width: 12px;
            height: 12px;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}