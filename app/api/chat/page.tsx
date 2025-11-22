// 📁 app/chat/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Send, Bot, User, RotateCcw } from 'lucide-react';

// 학교 이름 <-> 코드 매핑
const SCHOOL_MAP: Record<string, string> = {
    '동양미래대학교': 'dongyang',
    '한양대학교': 'hanyang',
    '서울과학기술대학교': 'seoultech',
    '안산대학교': 'ansan',
    '순천향대학교': 'soonchunhyang',
};

export default function ChatPage() {
    const router = useRouter();
    const [schoolCode, setSchoolCode] = useState<string | null>(null);
    const [schoolName, setSchoolName] = useState<string>('');

    useEffect(() => {
        // 1. 로컬 스토리지에서 사용자 학교 정보 가져오기
        const storedSchool = localStorage.getItem('userSchool');
        const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail');

        // 로그인이 안 되어 있으면 로그인 페이지로 이동
        if (!userId) {
            alert('로그인이 필요한 서비스입니다.');
            router.replace('/login');
            return;
        }

        // 학교 정보가 없으면 프로필 페이지로 이동 (학교 설정 유도)
        if (!storedSchool) {
            alert('학교 정보가 없습니다. 프로필에서 학교를 설정해주세요.');
            router.replace('/profile');
            return;
        }

        // 2. 학교 코드로 변환
        const code = SCHOOL_MAP[storedSchool];
        if (!code) {
            alert('지원하지 않는 학교이거나 코드를 찾을 수 없습니다.');
            router.replace('/profile');
            return;
        }

        setSchoolName(storedSchool);
        setSchoolCode(code);
    }, [router]);

    // 학교 코드가 준비되면 채팅 인터페이스 렌더링
    if (!schoolCode) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="text-gray-500 text-sm animate-pulse">학교 정보를 불러오는 중...</div>
            </div>
        );
    }

    return <ChatInterface schoolCode={schoolCode} schoolName={schoolName} />;
}

// 실제 채팅 컴포넌트
function ChatInterface({ schoolCode, schoolName }: { schoolCode: string, schoolName: string }) {
    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, setInput } = useChat({
        api: `/api/chat/${schoolCode}`,
        initialMessages: [
            { id: 'welcome', role: 'assistant', content: `안녕하세요! **${schoolName}** 학칙 봇입니다. 무엇을 도와드릴까요?` }
        ],
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleReset = () => {
        if (confirm('대화 내용을 모두 지우고 처음부터 다시 시작하시겠습니까?')) {
            setMessages([
                { id: 'welcome', role: 'assistant', content: `안녕하세요! **${schoolName}** 학칙 봇입니다. 무엇을 도와드릴까요?` }
            ]);
        }
    };

    const suggestedQuestions = [
        "휴학은 어떻게 신청해?",
        "장학금 받을 수 있는 조건이 뭐야?",
        "졸업 요건 알려줘",
        "전과하려면 어떻게 해야 해?"
    ];

    const handleSuggestedClick = (question: string) => {
        setInput(question);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* 챗봇 헤더 */}
            <div className="px-5 py-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md flex flex-col justify-between min-h-[100px] shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <Link href="/" className="flex items-center gap-1 text-white/90 hover:text-white transition-colors px-2 py-1 -ml-2 rounded-lg hover:bg-white/10">
                        <ArrowLeft size={18} />
                        <span className="text-sm font-medium">홈으로</span>
                    </Link>

                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1 text-white/90 hover:text-white transition-colors px-2 py-1 -mr-2 rounded-lg hover:bg-white/10"
                    >
                        <RotateCcw size={16} />
                        <span className="text-xs font-medium">초기화</span>
                    </button>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-1 tracking-wide">{schoolName}</h2>
                    <p className="text-xs text-blue-100 opacity-90">AI가 학칙을 기반으로 답변해드립니다</p>
                </div>
            </div>

            {/* 메시지 목록 영역 */}
            <div className="flex-1 overflow-y-auto p-5 pb-48 space-y-5">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                            {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                        </div>

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

            {/* 입력창 영역 */}
            <div className="fixed bottom-[85px] left-0 right-0 max-w-[393px] mx-auto px-4 py-3 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-20 flex flex-col gap-3 transition-all">
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