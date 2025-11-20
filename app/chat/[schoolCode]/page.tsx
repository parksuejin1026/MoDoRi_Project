'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';

// [기능 설명] Next.js가 URL 파라미터를 컴포넌트에 전달하기 위한 타입입니다.
interface ChatPageProps {
  params: {
    schoolCode: string; // URL에서 넘어오는 학교 코드 (예: 'dongyang')
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const { schoolCode } = params;

  // ⭐️ [기능 설명] Vercel AI SDK의 useChat 훅 사용
  // - messages: 대화 목록 자동 관리
  // - input, handleInputChange: 입력창 상태 관리
  // - handleSubmit: 메시지 전송 및 스트리밍 처리
  // - isLoading: 응답 생성 중 여부
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: `/api/chat/${schoolCode}`, // ⭐️ 동적 API 경로 설정
    initialMessages: [
      { id: 'welcome', role: 'assistant', content: "안녕하세요! 학칙 봇입니다. 질문하시면 해당 학교의 학칙을 기반으로 답변해 드립니다." }
    ],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // [기능 설명] 메시지 목록이 업데이트될 때마다 자동으로 스크롤을 맨 아래로 이동시킵니다.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // [기능 설명] 채팅 대화 내용을 초기화합니다.
  const handleReset = () => {
    if (confirm('현재 대화 내용을 모두 지우고 새롭게 시작하시겠습니까?')) {
      setMessages([
        { id: 'welcome', role: 'assistant', content: "안녕하세요! 학칙 봇입니다. 질문하시면 해당 학교의 학칙을 기반으로 답변해 드립니다." }
      ]);
    }
  };

  // ********** 화면 렌더링 **********
  return (
    <div className="chat-page-container">
      {/* ⭐️ 상단 Navigation Bar */}
      <div className="chat-actions-bar">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
          {schoolCode.toUpperCase()} 챗봇
        </h2>

        <div className="actions">
          <Link href="/" passHref legacyBehavior>
            <a className="btn btn-ghost btn-small" style={{ marginRight: '10px' }}>
              홈
            </a>
          </Link>
          <button onClick={handleReset} className="btn btn-ghost btn-small">
            초기화
          </button>
        </div>
      </div>

      {/* 1. 채팅창 영역 */}
      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-bubble ${msg.role === 'user' ? 'user' : 'bot'}`}>
            {/* ⭐️ Markdown 렌더링 적용 */}
            {msg.role === 'assistant' ? (
              <div className="markdown-content">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ) : (
              msg.content
            )}
          </div>
        ))}
        {/* 로딩 표시 (스트리밍 중일 때는 텍스트가 나오므로 별도 로딩바 불필요, 다만 응답 대기 중일 때 표시) */}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="message-bubble bot loading">
            <div className="loading-spinner"></div>
            생각 중...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 2. 입력창 영역 */}
      <form onSubmit={handleSubmit} className="chat-input-area">
        <input
          type="text"
          placeholder={`[${schoolCode.toUpperCase()}] 학칙에 대해 질문하세요...`}
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="btn btn-primary"
        >
          전송
        </button>
      </form>

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
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
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
        /* Markdown 스타일링 */
        .markdown-content :global(p) {
            margin: 0 0 10px 0;
        }
        .markdown-content :global(p:last-child) {
            margin-bottom: 0;
        }
        .markdown-content :global(strong) {
            font-weight: 700;
            color: var(--color-primary-dark);
        }
        .markdown-content :global(ul), .markdown-content :global(ol) {
            margin: 5px 0 10px 20px;
            padding: 0;
        }
        .markdown-content :global(li) {
            margin-bottom: 5px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}