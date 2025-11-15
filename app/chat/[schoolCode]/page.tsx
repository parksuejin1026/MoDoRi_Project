'use client'; 

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// [기능 설명] 챗봇 대화 메시지의 데이터 타입을 정의합니다.
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot'; 
}

// [기능 설명] Next.js가 URL 파라미터를 컴포넌트에 전달하기 위한 타입입니다.
interface ChatPageProps {
    params: {
        schoolCode: string; // URL에서 넘어오는 학교 코드 (예: 'dongyang')
    };
}

// 챗봇의 초기 인사말
const initialMessages: Message[] = [
    { id: 1, text: "안녕하세요! 학칙 봇입니다. 질문하시면 해당 학교의 학칙을 기반으로 답변해 드립니다.", sender: 'bot' }
];

export default function ChatPage({ params }: ChatPageProps) {
  const { schoolCode } = params; // ⭐️ schoolCode 추출
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // [기능 설명] 메시지 목록이 업데이트될 때마다 자동으로 스크롤을 맨 아래로 이동시킵니다.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); 

  // ⭐️ [기능 설명] API 호출 경로를 동적으로 설정합니다.
  const chatApiUrl = `/api/chat/${schoolCode}`; 

  // [기능 설명] 채팅 대화 내용을 초기화합니다.
  const handleReset = useCallback(() => {
      if (confirm('현재 대화 내용을 모두 지우고 새롭게 시작하시겠습니까?')) {
          setMessages(initialMessages);
          setInput('');
          setIsLoading(false);
      }
  }, []);

  // [기능 설명] 메시지 전송 및 API 호출을 처리합니다.
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
        {/* ⭐️ 상단 Navigation Bar 대체 영역 */}
        <div className="chat-actions-bar">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                {schoolCode.toUpperCase()} 챗봇
            </h2>
            
            {/* 상단 버튼: 홈으로 이동 */}
            <Link href="/" passHref legacyBehavior>
                <a className="btn btn-ghost btn-small" style={{ marginRight: '10px' }}>
                    홈
                </a>
            </Link>
            
            {/* 채팅 초기화 버튼 */}
            <button onClick={handleReset} className="btn btn-ghost btn-small">
                초기화
            </button>
        </div>
      
      {/* 1. 채팅창 영역 */}
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

      {/* 2. 입력창 영역 */}
      <div className="chat-input-area">
        <input
          type="text"
          placeholder={`[${schoolCode.toUpperCase()}] 학칙에 대해 질문하세요...`}
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
      
      {/* ⭐️ UI 디자인 개선을 위한 인라인 CSS */}
      <style jsx>{`
        .chat-page-container {
          max-width: 800px;
          margin: 0 auto; 
          background-color: var(--color-white);
          border-radius: 0; 
          display: flex;
          flex-direction: column;
          height: 100%; 
          min-height: 500px;
        }
        .chat-actions-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            border-bottom: 1px solid var(--color-border);
            background-color: var(--color-white);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .chat-window {
          flex-grow: 1;
          padding: 15px 10px;
          overflow-y: auto;
          background-color: var(--color-background);
        }
        .message-bubble {
          max-width: 85%; 
          padding: 12px 18px;
          border-radius: 20px;
          margin-bottom: 12px;
          line-height: 1.5;
          font-size: 0.95rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); /* 입체감 강화 */
          word-break: break-word;
        }
        .user {
          background-color: var(--color-primary); 
          color: var(--color-white);
          margin-left: auto;
          border-top-right-radius: 5px; 
        }
        .bot {
          background-color: var(--color-white);
          color: var(--color-text-primary);
          margin-right: auto;
          border: 1px solid var(--color-border);
          border-top-left-radius: 5px;
        }
        .loading {
          font-style: italic;
          opacity: 0.7;
          display: flex;
          align-items: center;
        }
        .chat-input-area {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          border-top: 1px solid var(--color-border);
          background-color: var(--color-white);
          position: sticky;
          bottom: 0; 
        }
        .chat-input-area input {
          flex-grow: 1;
          padding: 12px 15px;
          border: 1px solid var(--color-border);
          border-radius: 25px; 
          margin-right: 10px;
          font-size: 1rem;
        }
        .chat-input-area input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 1px var(--color-primary); 
        }
        .loading-spinner {
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-top: 3px solid var(--color-primary);
            border-radius: 50%;
            width: 14px;
            height: 14px;
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