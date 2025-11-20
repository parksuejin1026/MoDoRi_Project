'use client';

import { useEffect, useRef, useState } from 'react';
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
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, setInput } = useChat({
    api: `/api/chat/${schoolCode}`, // ⭐️ 동적 API 경로 설정
    initialMessages: [
      { id: 'welcome', role: 'assistant', content: "안녕하세요! 학칙 봇입니다. 질문하시면 해당 학교의 학칙을 기반으로 답변해 드립니다." }
    ],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // [기능 설명] 메시지 목록이 업데이트될 때마다 자동으로 스크롤을 맨 아래로 이동시킵니다.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // [기능 설명] 입력창 높이 자동 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  // [기능 설명] 채팅 대화 내용을 초기화합니다.
  const handleReset = () => {
    if (confirm('현재 대화 내용을 모두 지우고 새롭게 시작하시겠습니까?')) {
      setMessages([
        { id: 'welcome', role: 'assistant', content: "안녕하세요! 학칙 봇입니다. 질문하시면 해당 학교의 학칙을 기반으로 답변해 드립니다." }
      ]);
    }
  };

  // [기능 설명] 추천 질문 클릭 시 입력창에 자동 입력
  const handleSuggestedClick = (question: string) => {
    setInput(question);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };

  const suggestedQuestions = [
    "휴학은 어떻게 신청해?",
    "장학금 받을 수 있는 조건이 뭐야?",
    "졸업 요건 알려줘",
    "전과하려면 어떻게 해야 해?"
  ];

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
          <div key={msg.id} className={`message-row ${msg.role === 'user' ? 'user-row' : 'bot-row'}`}>
            {msg.role === 'assistant' && <div className="avatar bot-avatar">🤖</div>}

            <div className={`message-bubble ${msg.role === 'user' ? 'user' : 'bot'}`}>
              {/* ⭐️ Markdown 렌더링 적용 */}
              {msg.role === 'assistant' ? (
                <div className="markdown-content">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                  <button
                    className="copy-btn"
                    onClick={() => handleCopy(msg.content, msg.id)}
                    title="답변 복사"
                  >
                    {copiedId === msg.id ? '✅' : '📋'}
                  </button>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {/* 로딩 표시 */}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="message-row bot-row">
            <div className="avatar bot-avatar">🤖</div>
            <div className="message-bubble bot loading">
              <div className="loading-spinner"></div>
              생각 중...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 2. 추천 질문 & 입력창 영역 */}
      <div className="input-section">
        {messages.length < 3 && (
          <div className="suggested-questions">
            {suggestedQuestions.map((q, idx) => (
              <button key={idx} onClick={() => handleSuggestedClick(q)} className="chip">
                {q}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="chat-input-area">
          <textarea
            ref={textareaRef}
            placeholder={`[${schoolCode.toUpperCase()}] 학칙에 대해 질문하세요...`}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn btn-primary send-btn"
          >
            전송
          </button>
        </form>
      </div>

      {/* ⭐️ UI 디자인 개선을 위한 인라인 CSS */}
      <style jsx>{`
        .chat-page-container {
          max-width: 800px;
          margin: 0 auto; 
          background-color: var(--color-white);
          display: flex;
          flex-direction: column;
          height: 100vh; 
          position: relative;
        }
        .chat-actions-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            border-bottom: 1px solid var(--color-border);
            background-color: var(--color-white);
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            z-index: 10;
        }
        .chat-window {
          flex-grow: 1;
          padding: 20px;
          overflow-y: auto;
          background-color: #f9fafb;
        }
        .message-row {
          display: flex;
          margin-bottom: 16px;
          align-items: flex-start;
        }
        .user-row {
          justify-content: flex-end;
        }
        .bot-row {
          justify-content: flex-start;
        }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          margin-right: 10px;
          background-color: #e0e7ff;
          border: 1px solid #c7d2fe;
        }
        .message-bubble {
          max-width: 75%; 
          padding: 14px 18px;
          border-radius: 18px;
          line-height: 1.6;
          font-size: 0.95rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          word-break: break-word;
          position: relative;
        }
        .user {
          background-color: var(--color-primary); 
          color: var(--color-white);
          border-bottom-right-radius: 4px;
        }
        .bot {
          background-color: var(--color-white);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
          border-bottom-left-radius: 4px;
        }
        .loading {
          font-style: italic;
          opacity: 0.8;
          display: flex;
          align-items: center;
          color: #6b7280;
        }
        .input-section {
          background-color: var(--color-white);
          border-top: 1px solid var(--color-border);
          padding: 10px 20px 20px;
        }
        .suggested-questions {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 10px;
          margin-bottom: 5px;
          scrollbar-width: none; /* Firefox */
        }
        .suggested-questions::-webkit-scrollbar {
          display: none; /* Chrome, Safari */
        }
        .chip {
          white-space: nowrap;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 6px 12px;
          font-size: 0.85rem;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
        }
        .chip:hover {
          background-color: #e5e7eb;
          color: #1f2937;
        }
        .chat-input-area {
          display: flex;
          align-items: flex-end;
          background-color: #f9fafb;
          border-radius: 24px;
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
        }
        .chat-input-area:focus-within {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
        }
        .chat-input-area textarea {
          flex-grow: 1;
          padding: 8px 10px;
          border: none;
          background: transparent;
          font-size: 1rem;
          resize: none;
          max-height: 150px;
          outline: none;
          line-height: 1.5;
        }
        .send-btn {
          border-radius: 20px;
          padding: 8px 16px;
          margin-left: 8px;
          height: 40px;
          display: flex;
          align-items: center;
        }
        .loading-spinner {
            border: 2px solid #e5e7eb;
            border-top: 2px solid var(--color-primary);
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }
        /* Markdown 스타일링 */
        .markdown-content {
          position: relative;
        }
        .markdown-content :global(p) {
            margin: 0 0 10px 0;
        }
        .markdown-content :global(p:last-child) {
            margin-bottom: 0;
        }
        .markdown-content :global(strong) {
            font-weight: 600;
            color: var(--color-primary-dark);
        }
        .markdown-content :global(ul), .markdown-content :global(ol) {
            margin: 5px 0 10px 20px;
            padding: 0;
        }
        .markdown-content :global(li) {
            margin-bottom: 4px;
        }
        .copy-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.8rem;
          opacity: 0;
          transition: opacity 0.2s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .message-bubble:hover .copy-btn {
          opacity: 1;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}