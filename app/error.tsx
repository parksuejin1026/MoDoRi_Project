'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
                <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-foreground">오류가 발생했습니다</h2>
            <p className="text-muted-foreground text-sm max-w-xs">
                죄송합니다. 예상치 못한 문제가 발생했습니다.<br />
                잠시 후 다시 시도해주세요.
            </p>
            <button
                onClick={() => reset()}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors active:scale-95"
            >
                <RefreshCw size={16} />
                다시 시도하기
            </button>
        </div>
    );
}
