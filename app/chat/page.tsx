// 📁 app/chat/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, RotateCcw, AlertCircle } from 'lucide-react';
import { useGlobalModal } from '@/components/GlobalModal';
// import ThemeToggle from '@/components/ThemeToggle'; // ⭐️ [제거] ThemeToggle 임포트 제거

const SCHOOL_MAP: Record<string, string> = {
    '동양미래대학교': 'dongyang',
    '한양대학교': 'hanyang',
    '서울과학기술대학교': 'seoultech',
    '안산대학교': 'ansan',
    '순천향대학교': 'soonchunhyang',
    '대전대학교': 'daejeon',
    '경기과학기술대학교': 'gtec',
};

export default function ChatPage() {
    const router = useRouter();
    const { showAlert } = useGlobalModal();
    const [schoolCode, setSchoolCode] = useState<string | null>(null);
    const [schoolName, setSchoolName] = useState<string>('');

    useEffect(() => {
        const checkAuth = async () => {
            const storedSchool = localStorage.getItem('userSchool');
            const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');

            if (!userId) {
                await showAlert('로그인이 필요한 서비스입니다.');
                router.replace('/login');
                return;
            }

            if (!storedSchool) {
                await showAlert('학교 정보가 없습니다. 프로필에서 학교를 설정해주세요.');
                router.replace('/profile');
                return;
            }

            const code = SCHOOL_MAP[storedSchool];
            if (!code) {
                await showAlert('지원하지 않는 학교 코드입니다.');
                router.replace('/profile');
                return;
            }

            setSchoolName(storedSchool);
            setSchoolCode(code);
        };

        checkAuth();
    }, [router, showAlert]);

    if (!schoolCode) return null;

    return <ChatInterface schoolCode={schoolCode} schoolName={schoolName} />;
}

function ChatInterface({ schoolCode, schoolName }: { schoolCode: string, schoolName: string }) {
    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, setInput, error } = useChat({
        api: `/api/chat/${schoolCode}`,
        initialMessages: [
            { id: 'welcome', role: 'assistant', content: `안녕하세요! **${schoolName}** 학칙 봇입니다. 무엇을 도와드릴까요?` }
        ],
        onError: (err) => {
            console.error("Chat Error:", err);
        }
    });

    const { showConfirm } = useGlobalModal();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        handleSubmit(e);
    };

    const handleReset = async () => {
        const confirmed = await showConfirm('대화 내용을 초기화하시겠습니까?');
        if (confirmed) {
            setMessages([{ id: 'welcome', role: 'assistant', content: `안녕하세요! **${schoolName}** 학칙 봇입니다.` }]);
        }
    };

    const handleSuggestedClick = (question: string) => {
        setInput(question);
    };

    return (
        <div className="flex flex-col h-full bg-background relative overflow-hidden">

            {/* 헤더 */}
            {/* ⭐️ [수정] ThemeToggle 제거 */}
            <div className="sticky top-0 z-10 px-6 py-2 bg-card dark:bg-background border-b border-border shrink-0 flex justify-between items-start shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-0.5">{schoolName}</h2>
                    <p className="text-xs text-muted-foreground">학칙 기반 AI 답변</p>
                </div>
                {/* ⭐️ [수정] ThemeToggle 제거 */}
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
            <div className="flex-1 overflow-y-auto p-5 pb-40 space-y-5 scroll-smooth bg-gray-100 dark:bg-black">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        {/* 아바타 */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-muted text-muted-foreground' : 'bg-secondary text-secondary-foreground border border-border'}`}>
                            {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                        </div>
                        {/* 말풍선 */}
                        <div className={`max-w-[75%] p-2 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-card text-foreground border border-border rounded-tl-none'}`}>
                            {msg.role === 'assistant' ? (
                                <div className="prose prose-sm max-w-none text-foreground prose-p:my-1">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground border border-border flex items-center justify-center shrink-0 shadow-sm">
                            <Bot size={18} />
                        </div>
                        <div className="bg-card text-muted-foreground p-3.5 rounded-2xl rounded-tl-none border border-border text-sm animate-pulse shadow-sm">
                            답변 생성 중...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 컨테이너 */}
            <div className="fixed bottom-[60px] left-0 right-0 max-w-[393px] mx-auto px-4 py-2 bg-background border-t border-border z-20">

                {/* 추천 질문 */}
                {messages.length < 3 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mb-1">
                        {["휴학 신청 방법", "장학금 기준", "졸업 요건", "전과 신청"].map((q, idx) => (
                            <button key={idx} onClick={() => handleSuggestedClick(q)}
                                className="whitespace-nowrap px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full border border-border shadow-sm hover:bg-secondary/70 transition-all"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                {/* 입력 폼 */}
                <form onSubmit={onSubmit} className="flex gap-2 items-center bg-card p-0.5 rounded-full border border-border shadow-sm">
                    <input
                        className="flex-1 px-2 py-1 bg-transparent text-sm focus:outline-none text-foreground placeholder-muted-foreground"
                        placeholder="질문을 입력하세요..."
                        value={input}
                        onChange={handleInputChange}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:bg-muted-foreground transition-all hover:bg-primary/90 active:scale-95"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}