// 📁 components/GlobalModal.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

// 모달 타입 정의
type ModalType = 'alert' | 'confirm';

interface ModalState {
    isOpen: boolean;
    type: ModalType;
    title: string;
    message: string;
    isDanger?: boolean; // 위험한 작업(빨간 버튼) 여부
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface GlobalModalContextType {
    showAlert: (message: string, title?: string) => Promise<void>;
    showConfirm: (message: string, title?: string, isDanger?: boolean) => Promise<boolean>;
}

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(undefined);

export function GlobalModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        type: 'alert',
        title: '',
        message: '',
    });

    // Promise resolver를 저장할 상태
    const [resolver, setResolver] = useState<{ resolve: (value: any) => void } | null>(null);

    const showAlert = useCallback((message: string, title: string = '알림') => {
        return new Promise<void>((resolve) => {
            setModal({ isOpen: true, type: 'alert', title, message });
            setResolver({ resolve });
        });
    }, []);

    const showConfirm = useCallback((message: string, title: string = '확인', isDanger: boolean = false) => {
        return new Promise<boolean>((resolve) => {
            setModal({ isOpen: true, type: 'confirm', title, message, isDanger });
            setResolver({ resolve });
        });
    }, []);

    const handleConfirm = () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
        if (resolver) resolver.resolve(true);
    };

    const handleCancel = () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
        if (resolver) resolver.resolve(false);
    };

    return (
        <GlobalModalContext.Provider value={{ showAlert, showConfirm }}>
            {children}

            {/* 모달 UI (다크 모드 스타일 적용) */}
            {modal.isOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    {/* ⭐️ [수정] 배경 색상 테마 변수 적용 (bg-card) */}
                    <div className="bg-card rounded-2xl w-full max-w-[320px] p-6 shadow-xl animate-in zoom-in-95 duration-200">

                        {/* 헤더 */}
                        <div className="flex justify-between items-start mb-4">
                            {/* ⭐️ [수정] 텍스트 색상 테마 변수 적용 (text-foreground) */}
                            <h3 className={`text-lg font-bold ${modal.isDanger ? 'text-red-600' : 'text-foreground'} flex items-center gap-2`}>
                                {modal.isDanger && <AlertCircle size={20} />}
                                {/* ⭐️ [수정] 알림 아이콘 색상에 primary 변수 적용 */}
                                {!modal.isDanger && modal.type === 'alert' && <CheckCircle2 size={20} className="text-primary" />}
                                {modal.title}
                            </h3>
                            {/* ⭐️ [수정] 닫기 버튼 색상 테마 변수 적용 (text-muted-foreground) */}
                            <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* 본문 */}
                        {/* ⭐️ [수정] 텍스트 색상 테마 변수 적용 (text-muted-foreground) */}
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed whitespace-pre-wrap">
                            {modal.message}
                        </p>

                        {/* 버튼 영역 */}
                        <div className="flex gap-2">
                            {modal.type === 'confirm' && (
                                <button
                                    onClick={handleCancel}
                                    // ⭐️ [수정] 취소 버튼 테마 변수 적용 (bg-muted, text-foreground)
                                    className="flex-1 py-3 text-sm font-medium text-foreground bg-muted rounded-xl hover:bg-muted/70 transition-colors"
                                >
                                    취소
                                </button>
                            )}
                            <button
                                onClick={handleConfirm}
                                // ⭐️ [수정] 확인/경고 버튼 테마 변수 적용 (primary/red)
                                className={`flex-1 py-3 text-sm font-bold text-primary-foreground rounded-xl shadow-lg transition-colors ${modal.isDanger
                                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                    : 'bg-primary hover:bg-primary/90 shadow-primary/20'
                                    }`}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </GlobalModalContext.Provider>
    );
}

// Hook
export function useGlobalModal() {
    const context = useContext(GlobalModalContext);
    if (!context) {
        throw new Error('useGlobalModal must be used within a GlobalModalProvider');
    }
    return context;
}