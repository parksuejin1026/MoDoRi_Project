// 📁 app/privacy/page.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        // ⭐️ [수정] 배경 색상 테마 변수 적용
        <main className="min-h-screen bg-background pb-100">
            {/* ⭐️ [수정] 배경 색상 테마 변수 적용 */}
            <div className="max-w-[393px] mx-auto bg-card min-h-screen">

                {/* 헤더 */}
                {/* ⭐️ [수정] 헤더 배경/경계/텍스트 색상 테마 변수 적용 */}
                <div className="sticky top-0 bg-card z-10 px-4 py-4 flex items-center gap-3 border-b border-border">
                    <Link href="/profile" className="p-2 -ml-2 hover:bg-accent rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-muted-foreground" />
                    </Link>
                    <h1 className="text-lg font-bold text-foreground">개인정보 처리방침</h1>
                </div>

                <div className="p-6">
                    {/* ⭐️ [수정] 배경/경계/텍스트 색상 다크 모드 지원 클래스 적용 */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 text-sm text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-300">
                        <strong>최종 업데이트:</strong> 2025년 11월 22일
                    </div>

                    {/* ⭐️ [수정] 텍스트 색상 테마 변수 적용 */}
                    <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">

                        <section>
                            {/* ⭐️ [수정] 텍스트 색상 테마 변수 적용 */}
                            <h3 className="text-base font-bold text-foreground mb-3">1. 개인정보의 수집 및 이용 목적</h3>
                            <p className="mb-2">
                                룰룩(Rule-Look)은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>회원 가입 및 관리</li>
                                <li>학칙 챗봇 서비스 제공</li>
                                <li>커뮤니티 서비스 제공</li>
                                <li>고객 문의 및 불만 처리</li>
                            </ul>
                        </section>

                        {/* ⭐️ [수정] 경계선 색상 테마 변수 적용 */}
                        <div className="h-px bg-border" />

                        <section>
                            <h3 className="text-base font-bold text-foreground mb-3">2. 수집하는 개인정보 항목</h3>
                            <div className="mb-3">
                                {/* ⭐️ [수정] 텍스트 색상 테마 변수 적용 */}
                                <strong className="text-foreground">필수 항목:</strong>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>비밀번호 (암호화 저장)</li>
                                    <li>이름</li>
                                    <li>소속 학교</li>
                                </ul>
                            </div>
                            <div>
                                <strong className="text-foreground">자동 수집 항목:</strong>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>서비스 이용 기록, 접속 로그, 기기 정보</li>
                                </ul>
                            </div>
                        </section>

                        <div className="h-px bg-border" />

                        <section>
                            <h3 className="text-base font-bold text-foreground mb-3">3. 개인정보의 보유 및 이용 기간</h3>
                            <p className="mb-2">
                                회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li className='text-foreground'><strong className="text-foreground">회원 정보:</strong> 회원 탈퇴 시까지</li>
                                <li><strong className="text-foreground">서비스 이용 기록:</strong> 3개월</li>
                            </ul>
                        </section>

                        <div className="h-px bg-border" />

                        <section>
                            <h3 className="text-base font-bold text-foreground mb-3">4. 개인정보의 파기</h3>
                            <p className="mb-2">
                                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>전자적 파일 형태: 복구 불가능한 방법으로 영구 삭제</li>
                            </ul>
                        </section>

                        <div className="h-px bg-border" />

                        <section>
                            <h3 className="text-base font-bold text-foreground mb-3">5. 개인정보 보호책임자</h3>
                            <p className="mb-2">
                                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 불만처리 및 피해구제 등을 위하여 아래와 같이 책임자를 지정하고 있습니다.
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>이메일: cjh040602@icloud.com</li>
                            </ul>
                        </section>

                    </div>
                </div>

            </div>
        </main>
    );
}