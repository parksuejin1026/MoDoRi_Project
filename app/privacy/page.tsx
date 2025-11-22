'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-gray-50 pb-24">
            <div className="max-w-[393px] mx-auto bg-white min-h-screen">

                {/* 헤더 */}
                <div className="sticky top-0 bg-white z-10 px-4 py-4 flex items-center gap-3 border-b border-gray-100">
                    <Link href="/profile" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-gray-700" />
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900">개인정보 처리방침</h1>
                </div>

                <div className="p-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 text-sm text-blue-800">
                        <strong>최종 업데이트:</strong> 2025년 11월 22일
                    </div>

                    <div className="space-y-8 text-sm text-gray-600 leading-relaxed">

                        <section>
                            <h3 className="text-base font-bold text-gray-900 mb-3">1. 개인정보의 수집 및 이용 목적</h3>
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

                        <div className="h-px bg-gray-100" />

                        <section>
                            <h3 className="text-base font-bold text-gray-900 mb-3">2. 수집하는 개인정보 항목</h3>
                            <div className="mb-3">
                                <strong className="text-gray-800">필수 항목:</strong>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>비밀번호 (암호화 저장)</li>
                                    <li>이름</li>
                                    <li>소속 학교</li>
                                </ul>
                            </div>
                            <div>
                                <strong className="text-gray-800">자동 수집 항목:</strong>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                    <li>서비스 이용 기록, 접속 로그, 기기 정보</li>
                                </ul>
                            </div>
                        </section>

                        <div className="h-px bg-gray-100" />

                        <section>
                            <h3 className="text-base font-bold text-gray-900 mb-3">3. 개인정보의 보유 및 이용 기간</h3>
                            <p className="mb-2">
                                회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong className="text-gray-800">회원 정보:</strong> 회원 탈퇴 시까지</li>
                                <li><strong className="text-gray-800">서비스 이용 기록:</strong> 3개월</li>
                            </ul>
                        </section>

                        <div className="h-px bg-gray-100" />

                        <section>
                            <h3 className="text-base font-bold text-gray-900 mb-3">4. 개인정보의 파기</h3>
                            <p className="mb-2">
                                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>전자적 파일 형태: 복구 불가능한 방법으로 영구 삭제</li>
                            </ul>
                        </section>

                        <div className="h-px bg-gray-100" />

                        <section>
                            <h3 className="text-base font-bold text-gray-900 mb-3">5. 개인정보 보호책임자</h3>
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