'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, MessageCircle, Info } from 'lucide-react';

interface Notification {
    id: string;
    type: 'system' | 'comment' | 'like';
    content: string;
    time: string; // This will now be a date string from DB
    isRead: boolean;
}

export default function NotificationsPage() {
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

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="p-6 pb-4 flex justify-between items-center border-b border-border">
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
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
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
                                key={notification.id}
                                className={`p-4 flex gap-4 ${notification.isRead ? 'bg-background' : 'bg-primary/5'}`}
                            >
                                <div className={`mt-1 p-2 rounded-full shrink-0 ${notification.type === 'system' ? 'bg-blue-100 text-blue-600' :
                                    notification.type === 'comment' ? 'bg-green-100 text-green-600' :
                                        'bg-pink-100 text-pink-600'
                                    }`}>
                                    {notification.type === 'system' ? <Info size={16} /> :
                                        notification.type === 'comment' ? <MessageCircle size={16} /> :
                                            <Bell size={16} />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm ${notification.isRead ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                                        {notification.content}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">{new Date(notification.time).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
