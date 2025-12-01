'use client';

import ReactSimplePullToRefresh from 'react-simple-pull-to-refresh';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
    onRefresh: () => Promise<any>;
    children: React.ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
    return (
        <ReactSimplePullToRefresh
            onRefresh={onRefresh}
            pullingContent={
                <div className="flex items-center justify-center p-4 text-muted-foreground gap-2">
                    <RefreshCw size={20} className="animate-spin" />
                    <span className="text-sm font-medium">당겨서 새로고침</span>
                </div>
            }
            refreshingContent={
                <div className="flex items-center justify-center p-4 text-primary gap-2">
                    <RefreshCw size={20} className="animate-spin" />
                    <span className="text-sm font-bold">새로고침 중...</span>
                </div>
            }
            className="h-full"
        >
            <div className="min-h-full">
                {children}
            </div>
        </ReactSimplePullToRefresh>
    );
}
