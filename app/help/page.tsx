// 📁 app/help/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CircleHelp, ChevronDown, ChevronUp, MessageCircle, User, Shield } from 'lucide-react';

// 도움말 데이터 (FAQ)
const faqList = [
    {
        id: 1,
        category: 'account',
        question: '로그인은 어떻게 하나요?',
        answer: '메인 화면에서 아이디와 비밀번호를 입력하여 로그인할 수 있습니다. 계정이 없다면 회원가입을 먼저 진행해주세요.'
    },
    {
        id: 2,
        category: 'service',
        question: '어떤 학교의 학칙을 볼 수 있나요?',
        answer: '현재 동양미래대학교, 한양대학교 등 주요 대학의 학칙 데이터를 제공하고 있습니다. 학교 목록은 "학교 선택" 페이지에서 확인하실 수 있습니다.'
    },
    {
        id: 3,
        category: 'service',
        question: '챗봇이 답변을 못해요.',
        answer: '챗봇은 학습된 학칙 데이터 내에서만 답변할 수 있습니다. 질문을 좀 더 구체적으로 입력하거나, 해당 내용이 학칙에 없는 경우일 수 있습니다.'
    },
    {
        id: 4,
        category: 'account',
        question: '비밀번호를 잊어버렸어요.',
        answer: '현재 비밀번호 찾기 기능은 준비 중입니다. 관리자에게 문의해주세요.'
    },
    {
        id: 5,
        category: 'privacy',
        question: '개인정보는 어떻게 관리되나요?',
        answer: '회원님의 개인정보는 안전하게 암호화되어 저장되며, 서비스 이용 목적 외에는 사용되지 않습니다. 자세한 내용은 "개인정보 처리방침"을 참고해주세요.'
    }
];

export default function HelpPage() {
    // 어떤 질문이 열려있는지 관리 (null이면 모두 닫힘)
    const [openId, setOpenId] = useState<number | null>(null);

    const toggleItem = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        // ⭐️ [수정] 배경 색상 테마 변수 적용
        <main className="min-h-screen bg-background pb-100">
            {/* ⭐️ [수정] 배경 색상 테마 변수 적용 */}
            <div className="max-w-[393px] mx-auto bg-card min-h-screen shadow-sm">

                {/* 헤더 */}
                {/* ⭐️ [수정] 헤더 배경/경계/텍스트 색상 테마 변수 적용 */}
                <div className="sticky top-0 bg-card z-10 px-4 py-4 flex items-center gap-3 border-b border-border">
                    <Link href="/profile" className="p-2 -ml-2 hover:bg-accent rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-muted-foreground" />
                    </Link>
                    <h1 className="text-lg font-bold text-foreground">도움말</h1>
                </div>

                {/* 상단 안내 카드 */}
                {/* ⭐️ [수정] 배경/경계/텍스트 색상 테마 변수 적용 */}
                <div className="p-6 bg-secondary m-4 rounded-2xl border border-border">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                            <CircleHelp size={24} />
                        </div>
                        <h2 className="font-bold text-foreground">무엇을 도와드릴까요?</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        자주 묻는 질문들을 모아두었습니다.<br />
                        원하는 내용을 찾을 수 없다면 커뮤니티를 이용해주세요.
                    </p>
                </div>

                {/* FAQ 리스트 */}
                <div className="px-4">
                    {/* ⭐️ [수정] 텍스트 색상 테마 변수 적용 */}
                    <div className="text-sm font-bold text-muted-foreground mb-3 ml-1">자주 묻는 질문</div>

                    <div className="flex flex-col gap-3">
                        {faqList.map((item) => {
                            const isOpen = openId === item.id;

                            return (
                                <div
                                    key={item.id}
                                    // ⭐️ [수정] 배경/경계 색상 테마 변수 적용 (Open 시 강조 색상 적용)
                                    className={`border rounded-xl transition-all duration-200 overflow-hidden ${isOpen ? 'border-primary/50 bg-secondary' : 'border-border bg-card hover:border-primary/50'}`}
                                >
                                    {/* 질문 (클릭 영역) */}
                                    <button
                                        onClick={() => toggleItem(item.id)}
                                        className="w-full flex items-center justify-between p-4 text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* 카테고리 아이콘 */}
                                            {/* ⭐️ [수정] 배경/텍스트 색상 테마 변수 적용 */}
                                            <div className={`p-2 rounded-lg ${isOpen ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                {item.category === 'account' && <User size={18} />}
                                                {item.category === 'service' && <MessageCircle size={18} />}
                                                {item.category === 'privacy' && <Shield size={18} />}
                                            </div>
                                            {/* ⭐️ [수정] 텍스트 색상 테마 변수 적용 */}
                                            <span className={`font-medium ${isOpen ? 'text-primary' : 'text-foreground'}`}>
                                                {item.question}
                                            </span>
                                        </div>
                                        {/* ⭐️ [수정] 아이콘 색상 테마 변수 적용 */}
                                        {isOpen ? (
                                            <ChevronUp size={20} className="text-primary" />
                                        ) : (
                                            <ChevronDown size={20} className="text-muted-foreground" />
                                        )}
                                    </button>

                                    {/* 답변 (열렸을 때만 보임) */}
                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                    >
                                        <div className="overflow-hidden">
                                            {/* ⭐️ [수정] 배경/경계/텍스트 색상 테마 변수 적용 */}
                                            <div className="p-4 pt-0 text-sm text-foreground leading-relaxed border-t border-border/50 bg-card/50 mx-4 mt-2 mb-4 rounded-lg">
                                                <br />
                                                {item.answer}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 하단 문의하기 */}
                {/* ⭐️ [수정] 배경/경계/텍스트 색상 테마 변수 적용 */}
                <div className="mt-8 mx-4 mb-8 p-4 bg-muted rounded-xl text-center border border-border">
                    <p className="text-sm text-muted-foreground mb-3">더 궁금한 점이 있으신가요?</p>
                    <a
                        href="mailto:cjh040602@icloud.com"
                        // ⭐️ [수정] 버튼 테마 변수 적용
                        className="inline-block px-6 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:border-primary/50 transition-colors"
                    >
                        이메일 문의하기
                    </a>
                </div>

            </div>
        </main>
    );
}