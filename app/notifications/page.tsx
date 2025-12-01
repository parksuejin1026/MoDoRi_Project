// 📁 app/notifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, MessageCircle, Info, ThumbsUp } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Notification {
    _id: string;
    type: 'system' | 'comment' | 'like';
    content: string;
    createdAt: string;
    isRead: boolean;
    relatedUrl?: string; // ⭐️ 링크 필드 추가
}

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const response = await fetch(`/api/notifications?userId=${userId}`);
            const result = await response.json();
            if (result.success) {
                setNotifications(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const response = await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    // ⭐️ 알림 클릭 시 읽음 처리 및 이동
    const handleNotificationClick = async (notification: Notification) => {
        // 이미 읽은 상태가 아니라면 읽음 처리
        if (!notification.isRead) {
            try {
                const userId = localStorage.getItem('userId');
                if (userId) {
                    await fetch('/api/notifications', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId,
                            notificationIds: [notification._id] // 특정 알림만 읽음 처리
                        }),
                    });

                    // UI 업데이트 (읽음 표시)
                    setNotifications(prev =>
                        prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
                    );
                }
            } catch (error) {
                console.error('Failed to mark as read:', error);
            }
        }

        // 관련 링크가 있으면 이동
        if (notification.relatedUrl) {
            router.push(notification.relatedUrl);
        }
    };

    const formatDateSafe = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        try {
            return format(date, 'PPP p', { locale: ko });
        } catch (error) {
            return '';
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'comment': return <MessageCircle size={16} />;
            case 'like': return <ThumbsUp size={16} />;
            default: return <Info size={16} />;
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'comment': return 'bg-blue-100 text-blue-600';
            case 'like': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="flex flex-col h-full bg-background min-h-screen">
            <div className="p-6 pb-4 flex justify-between items-center border-b border-border bg-card sticky top-0 z-10">
                <h2 className="text-2xl font-bold text-foreground">알림</h2>
                <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-primary font-medium hover:underline"
                >
                    모두 읽음
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground animate-pulse">
                        <p>알림을 불러오는 중...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <Bell size={48} className="mb-4 opacity-20" />
                        <p>새로운 알림이 없습니다.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                // ⭐️ onClick 핸들러 연결
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 flex gap-4 transition-colors cursor-pointer ${notification.isRead ? 'bg-background' : 'bg-primary/5 hover:bg-primary/10'
                                    }`}
                            >
                                <div className={`mt-1 p-2 rounded-full shrink-0 h-fit ${getIconColor(notification.type)}`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm leading-snug ${notification.isRead ? 'text-muted-foreground' : 'text-foreground font-medium'
                                        }`}>
                                        {notification.content}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1.5">
                                        {formatDateSafe(notification.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}