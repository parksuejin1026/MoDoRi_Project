'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ChatSession {
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

interface ChatSidebarProps {
    userId: string;
    schoolCode: string;
    currentSessionId: string | null;
    onSelectSession: (sessionId: string) => void;
    onNewChat: () => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function ChatSidebar({
    userId,
    schoolCode,
    currentSessionId,
    onSelectSession,
    onNewChat,
    isOpen,
    onClose
}: ChatSidebarProps) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 세션 목록 불러오기
    const fetchSessions = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/chat/sessions?userId=${userId}&schoolCode=${schoolCode}`);
            const data = await res.json();
            if (data.sessions) {
                setSessions(data.sessions);
            }
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userId && schoolCode) {
            fetchSessions();
        }
    }, [userId, schoolCode, currentSessionId]);

    return (
        <>
            {/* 오버레이 (모바일 및 데스크탑 모두 적용) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* 사이드바 */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out shadow-lg
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-border flex justify-between items-center">
                        <h2 className="font-semibold text-foreground">채팅 기록</h2>
                        <button onClick={onClose} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4">
                        <button
                            onClick={() => {
                                onNewChat();
                                if (window.innerWidth < 768) onClose();
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <Plus size={18} />
                            <span>새 채팅</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {isLoading && sessions.length === 0 ? (
                            <div className="text-center text-muted-foreground py-4 text-sm">로딩 중...</div>
                        ) : sessions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-2">
                                <MessageSquare size={24} className="opacity-20" />
                                <p>새로운 대화를 시작해보세요!</p>
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <button
                                    key={session._id}
                                    onClick={() => {
                                        onSelectSession(session._id);
                                        if (window.innerWidth < 768) onClose();
                                    }}
                                    className={`
                                        w-full text-left p-3 rounded-lg text-sm transition-colors flex flex-col gap-1
                                        ${currentSessionId === session._id
                                            ? 'bg-secondary text-secondary-foreground'
                                            : 'hover:bg-muted text-foreground'}
                                    `}
                                >
                                    <div className="font-medium truncate w-full flex items-center gap-2">
                                        <MessageSquare size={14} className="shrink-0" />
                                        <span className="truncate">{session.title || '새로운 대화'}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground pl-6">
                                        {session.updatedAt ? format(new Date(session.updatedAt), 'MM.dd a h:mm', { locale: ko }) : ''}
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
