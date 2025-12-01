'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Plus, X, GraduationCap, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useGlobalModal } from '@/components/GlobalModal';

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
    const { showConfirm, showAlert } = useGlobalModal();

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

    const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();

        const confirmed = await showConfirm('이 채팅 내역을 삭제하시겠습니까?', '삭제 확인', true);
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/chat/sessions/${sessionId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setSessions((prev) => prev.filter((s) => s._id !== sessionId));

                if (currentSessionId === sessionId) {
                    onNewChat();
                }
                await showAlert('삭제되었습니다.');
            } else {
                await showAlert('삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to delete session:', error);
            await showAlert('오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        if (userId && schoolCode) {
            fetchSessions();
        }
    }, [userId, schoolCode, currentSessionId, isOpen]);

    return (
        <>
            {/* ⭐️ 오버레이: fixed -> absolute (앱 컨테이너 기준) */}
            {isOpen && (
                <div
                    className="absolute inset-0 bg-black/50 z-50 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* ⭐️ 사이드바 패널: fixed -> absolute (앱 컨테이너 기준) */}
            <div className={`
                absolute inset-y-0 left-0 z-[60] w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out shadow-2xl
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* 헤더 */}
                    <div className="p-4 border-b border-border flex justify-between items-center bg-card">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                                <GraduationCap size={18} />
                            </div>
                            <span className="font-bold text-lg text-foreground">채팅 기록</span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* 새 채팅 버튼 */}
                    <div className="p-4 pb-2">
                        <button
                            onClick={() => {
                                onNewChat();
                                if (window.innerWidth < 768) onClose();
                            }}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-sm font-medium"
                        >
                            <Plus size={18} />
                            <span>새로운 대화 시작</span>
                        </button>
                    </div>

                    {/* 목록 영역 */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                        {isLoading && sessions.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8 text-sm animate-pulse">기록을 불러오는 중...</div>
                        ) : sessions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-3">
                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                    <MessageSquare size={20} className="opacity-40" />
                                </div>
                                <p>저장된 대화가 없습니다.</p>
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <div
                                    key={session._id}
                                    onClick={() => {
                                        onSelectSession(session._id);
                                        if (window.innerWidth < 768) onClose();
                                    }}
                                    className={`
                                        group relative w-full text-left p-3 rounded-xl text-sm transition-all cursor-pointer border border-transparent
                                        ${currentSessionId === session._id
                                            ? 'bg-secondary text-foreground border-border/50 shadow-sm'
                                            : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'}
                                    `}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium truncate leading-snug">
                                                {session.title || '새로운 대화'}
                                            </div>
                                            <div className="text-xs text-muted-foreground/70 mt-1.5 flex items-center gap-1">
                                                <span>
                                                    {session.updatedAt ? format(new Date(session.updatedAt), 'MM.dd a h:mm', { locale: ko }) : ''}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 삭제 버튼 */}
                                        <button
                                            onClick={(e) => handleDeleteSession(e, session._id)}
                                            className={`
                                                p-1.5 rounded-lg text-muted-foreground hover:bg-red-100 hover:text-red-500 transition-colors
                                                ${currentSessionId === session._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                                            `}
                                            title="대화 삭제"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}