'use client';

import { useEffect, useRef, useState, FormEvent } from 'react';
import { Message } from 'ai';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, RotateCcw, AlertCircle, Menu } from 'lucide-react';
import { useGlobalModal } from '@/components/GlobalModal';
import ChatSidebar from '@/components/ChatSidebar';

interface ChatInterfaceProps {
    schoolCode: string;
    schoolName: string;
    userId: string;
}

export default function ChatInterface({ schoolCode, schoolName, userId }: ChatInterfaceProps) {
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, setInput, append, error } = useChat({
        api: `/api/chat/${schoolCode}`,
        initialMessages: [
            { id: 'welcome', role: 'assistant', content: `안녕하세요! **${schoolName}** 학칙 봇입니다. 무엇을 도와드릴까요?` }
        ],
        body: {
            sessionId: currentSessionId,
        },
        onError: (err: Error) => {
            console.error("Chat Error:", err);
        },
    });

    const { showConfirm, showAlert } = useGlobalModal();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [feedbackStatus, setFeedbackStatus] = useState<Record<string, 'up' | 'down'>>({});

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [input]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e as any);
        }
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        if (!currentSessionId) {
            try {
                const res = await fetch('/api/chat/sessions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, schoolCode, title: input.substring(0, 20) }),
                });
                const data = await res.json();
                if (data.session) {
                    setCurrentSessionId(data.session._id);
                    handleSubmit(e, {
                        body: { sessionId: data.session._id }
                    });
                    return;
                }
            } catch (err) {
                console.error("Session create error", err);
            }
        }

        handleSubmit(e);
    };

    const handleReset = async () => {
        const confirmed = await showConfirm('대화 내용을 초기화하시겠습니까?');
        if (confirmed) {
            setMessages([{ id: 'welcome', role: 'assistant', content: `안녕하세요! **${schoolName}** 학칙 봇입니다.` }]);
            setFeedbackStatus({});
            setCurrentSessionId(null);
        }
    };

    const handleNewChat = () => {
        setMessages([{ id: 'welcome', role: 'assistant', content: `안녕하세요! **${schoolName}** 학칙 봇입니다.` }]);
        setFeedbackStatus({});
        setCurrentSessionId(null);
        setIsSidebarOpen(false);
    };

    const handleSelectSession = async (sessionId: string) => {
        try {
            const res = await fetch(`/api/chat/sessions/${sessionId}`);
            const data = await res.json();

            if (data.messages) {
                const formattedMessages = data.messages.map((m: any) => ({
                    id: m._id,
                    role: m.role,
                    content: m.content,
                    createdAt: new Date(m.createdAt)
                }));

                setMessages([
                    { id: 'welcome', role: 'assistant', content: `안녕하세요! **${schoolName}** 학칙 봇입니다.` },
                    ...formattedMessages
                ]);
                setCurrentSessionId(sessionId);
                setFeedbackStatus({});
                setIsSidebarOpen(false);
            }
        } catch (err) {
            console.error("Load session error", err);
            showAlert("대화 내용을 불러오는데 실패했습니다.");
        }
    };

    const handleSuggestedClick = async (question: string) => {
        if (isLoading) return;

        if (!currentSessionId) {
            try {
                const res = await fetch('/api/chat/sessions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, schoolCode, title: question.substring(0, 20) }),
                });
                const data = await res.json();
                if (data.session) {
                    setCurrentSessionId(data.session._id);
                    await append({
                        role: 'user',
                        content: question,
                    }, {
                        body: { sessionId: data.session._id }
                    });
                    return;
                }
            } catch (err) {
                console.error("Session create error", err);
            }
        }

        await append({
            role: 'user',
            content: question,
        }, {
            body: { sessionId: currentSessionId }
        });
    };

    const handleFeedback = async (messageId: string, messageContent: string, type: 'up' | 'down') => {
        if (feedbackStatus[messageId]) {
            showAlert('이미 피드백을 주셨습니다.', '알림');
            return;
        }

        setFeedbackStatus((prev: Record<string, 'up' | 'down'>) => ({ ...prev, [messageId]: type }));

        try {
            const response = await fetch('/api/chat/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    messageId,
                    schoolCode,
                    content: messageContent,
                    feedbackType: type,
                }),
            });

            if (response.ok) {
                showAlert('소중한 피드백 감사합니다!', '피드백 완료');
            } else {
                setFeedbackStatus((prev: Record<string, 'up' | 'down'>) => {
                    const newState = { ...prev };
                    delete newState[messageId];
                    return newState;
                });
                const errorData = await response.json();
                showAlert(`피드백 전송 실패: ${errorData.error || response.statusText}`, '오류');
            }
        } catch (error) {
            console.error('Feedback send error:', error);
            setFeedbackStatus((prev: Record<string, 'up' | 'down'>) => {
                const newState = { ...prev };
                delete newState[messageId];
                return newState;
            });
            showAlert('서버 통신 오류가 발생했습니다.', '오류');
        }
    };

    return (
        <div className="flex h-full bg-background relative overflow-hidden">
            <ChatSidebar
                userId={userId}
                schoolCode={schoolCode}
                currentSessionId={currentSessionId}
                onSelectSession={handleSelectSession}
                onNewChat={handleNewChat}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col h-full relative w-full pb-[47px]">
                {/* 헤더 */}
                <div className="px-4 py-2 bg-card dark:bg-background border-b border-border shrink-0 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-muted-foreground hover:text-foreground"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-foreground mb-0.5">{schoolName}</h2>
                            <p className="text-xs text-muted-foreground">학칙 기반 AI 답변</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleReset}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                            title="대화 초기화"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 text-xs text-center flex items-center justify-center gap-2 shrink-0">
                        <AlertCircle size={16} />
                        <span>연결 상태가 좋지 않습니다. 다시 시도해주세요.</span>
                    </div>
                )}

                {/* 메시지 목록 */}
                <div className="flex-1 overflow-y-auto p-5 pb-5 space-y-5 scroll-smooth bg-gray-100 dark:bg-black">
                    {messages.map((msg: Message) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-muted text-muted-foreground' : 'bg-secondary text-secondary-foreground border border-border'}`}>
                                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                            </div>
                            <div className={`max-w-[75%] p-2 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-card text-foreground border border-border rounded-tl-none'}`}>
                                {msg.role === 'assistant' ? (
                                    <>
                                        <div className="prose prose-sm max-w-none text-foreground prose-p:my-1 prose-headings:font-bold prose-headings:text-foreground prose-strong:text-primary prose-strong:font-bold prose-ul:my-1 prose-li:my-0.5 prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-pre:bg-muted prose-pre:p-3 prose-pre:rounded-lg">
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                        <div className='flex gap-2 mt-2 pt-2 border-t border-border/50 justify-end'>
                                            <button
                                                onClick={() => handleFeedback(msg.id, msg.content, 'up')}
                                                disabled={!!feedbackStatus[msg.id]}
                                                className={`p-1 rounded-full transition-all active:scale-90 border border-transparent 
                                                    ${feedbackStatus[msg.id] === 'up'
                                                        ? 'bg-green-500 text-white border-green-500'
                                                        : 'text-muted-foreground hover:bg-green-100 hover:text-green-600'}`
                                                }
                                                title="도움이 되었어요"
                                            >
                                                👍
                                            </button>
                                            <button
                                                onClick={() => handleFeedback(msg.id, msg.content, 'down')}
                                                disabled={!!feedbackStatus[msg.id]}
                                                className={`p-1 rounded-full transition-all active:scale-90 border border-transparent
                                                    ${feedbackStatus[msg.id] === 'down'
                                                        ? 'bg-red-500 text-white border-red-500'
                                                        : 'text-muted-foreground hover:bg-red-100 hover:text-red-600'}`
                                                }
                                                title="오류가 있어요"
                                            >
                                                👎
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 animate-fade-in-up">
                            <div className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground border border-border flex items-center justify-center shrink-0 shadow-sm">
                                <Bot size={18} />
                            </div>
                            <div className="bg-card text-muted-foreground p-3.5 rounded-2xl rounded-tl-none border border-border text-sm shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* 입력 영역 컨테이너 */}
                <div className="sticky bottom-0 left-0 right-0 w-full px-4 py-2 bg-background border-t border-border z-20">
                    {messages.length < 3 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mb-1">
                            {["휴학 신청 방법", "장학금 기준", "졸업 요건", "전과 신청"].map((q, idx) => (
                                <button key={idx} onClick={() => handleSuggestedClick(q)}
                                    className="whitespace-nowrap px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-full border border-border shadow-sm hover:bg-secondary/70 transition-all active:scale-95"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="flex gap-2 items-end bg-card p-2 rounded-[20px] border border-border shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all mb-1">
                        <textarea
                            ref={textareaRef}
                            className="flex-1 px-2 py-1.5 bg-transparent text-sm focus:outline-none text-foreground placeholder-muted-foreground min-w-0 resize-none max-h-[120px] overflow-y-auto scrollbar-hide"
                            placeholder="질문을 입력하세요... (Shift+Enter 줄바꿈)"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:bg-muted-foreground transition-all hover:bg-primary/90 active:scale-95 shadow-sm mb-0.5"
                        >
                            <Send size={15} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
