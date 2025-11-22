// 📁 app/chat/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Send, Bot, User, RotateCcw, AlertCircle } from 'lucide-react';
import { useGlobalModal } from '@/components/GlobalModal'; // ⭐️ Import

const SCHOOL_MAP: Record<string, string> = {
    '동양미래대학교': 'dongyang',
    '한양대학교': 'hanyang',
    '서울과학기술대학교': 'seoultech',
    '안산대학교': 'ansan',
    '순천향대학교': 'soonchunhyang',
};

export default function ChatPage() {
    const router = useRouter();
    const { showAlert } = useGlobalModal(); // ⭐️ Hook
    const [schoolCode, setSchoolCode] = useState<string | null>(null);
    const [schoolName, setSchoolName] = useState<string>('');

    useEffect(() => {
        const checkAuth = async () => {
            const storedSchool = localStorage.getItem('userSchool');
            const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');

            if (!userId) {
                // ⭐️ alert 대신 showAlert 사용 (비동기 처리 주의)
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
            // 여기서는 useGlobalModal을 못 쓸 수도 있으므로(컴포넌트 분리됨) 일단 기본 에러 UI 사용
        }
    });

    const { showConfirm } = useGlobalModal(); // ⭐️ Hook

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
        // ⭐️ confirm 대신 showConfirm 사용
        const confirmed = await showConfirm('대화 내용을 초기화하시겠습니까?');
        if (confirmed) {
            setMessages([{ id: 'welcome', role: 'assistant', content: `안녕하세요! **${schoolName}** 학칙 봇입니다.` }]);
        }
    };

    const handleSuggestedClick = (question: string) => {
        setInput(question);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden">

            <div className="sticky top-0 z-10 px-5 py-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <Link href="/" className="flex items-center gap-1 text-white/90 hover:text-white transition-colors px-2 py-1 -ml-2 rounded-lg hover:bg-white/10">
                        <ArrowLeft size={18} />
                        <span className="text-sm font-medium">홈으로</span>
                    </Link>
                    <button onClick={handleReset} className="flex items-center gap-1 text-white/90 hover:text-white px-2 py-1 -mr-2 rounded-lg hover:bg-white/10">
                        <RotateCcw size={16} />
                        <span className="text-xs font-medium">초기화</span>
                    </button>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-1 tracking-wide">{schoolName}</h2>
                    <p className="text-xs text-blue-100 opacity-90">학칙 기반 AI 답변</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 text-xs text-center flex items-center justify-center gap-2 shrink-0">
                    <AlertCircle size={16} />
                    <span>연결 상태가 좋지 않습니다. 다시 시도해주세요.</span>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-5 scroll-smooth">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-600'}`}>
                            {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                        </div>
                        <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                            {msg.role === 'assistant' ? (
                                <div className="prose prose-sm max-w-none text-gray-800 prose-p:my-1">
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
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                            <Bot size={18} />
                        </div>
                        <div className="bg-white text-gray-500 p-3.5 rounded-2xl rounded-tl-none border border-gray-100 text-sm animate-pulse shadow-sm">
                            답변 생성 중...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="fixed bottom-[80px] left-0 right-0 max-w-[393px] mx-auto px-4 py-3 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent z-20">
                {messages.length < 3 && (
                    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-2">
                        {["휴학 신청 방법", "장학금 기준", "졸업 요건", "전과 신청"].map((q, idx) => (
                            <button key={idx} onClick={() => handleSuggestedClick(q)} className="whitespace-nowrap px-3 py-1.5 bg-white text-blue-600 text-xs font-medium rounded-full border border-blue-100 shadow-sm hover:bg-blue-50 transition-all">
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={onSubmit} className="flex gap-2 items-center bg-white p-1.5 rounded-full border border-gray-200 shadow-sm">
                    <input
                        className="flex-1 px-4 py-2 bg-transparent text-sm focus:outline-none"
                        placeholder="질문을 입력하세요..."
                        value={input}
                        onChange={handleInputChange}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 disabled:bg-gray-300 transition-all hover:bg-blue-700 active:scale-95"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}