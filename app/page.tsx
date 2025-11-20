// 📁 app/page.tsx
import Link from 'next/link';
import { MessageCircle, Users } from 'lucide-react';

export default function Home() {
    return (
        <div className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">안녕하세요!</h2>
                <p className="text-sm text-gray-500">학칙을 쉽고 빠르게 확인하세요</p>
            </div>

            {/* Feature Cards */}
            <div className="flex flex-col gap-4">

                {/* Chatbot Card */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                            <MessageCircle size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 m-0">AI 챗봇</h3>
                            <p className="text-sm text-gray-500 m-0">학칙을 물어보세요</p>
                        </div>
                    </div>
                    <div className="px-6 pb-6">
                        <p className="text-sm text-gray-500 mb-4">
                            궁금한 학칙을 AI에게 질문하고 즉시 답변을 받아보세요
                        </p>
                        <Link
                            href="/select-school"
                            className="block w-full py-2 px-4 text-center rounded-md text-sm font-medium border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                        >
                            챗봇 시작하기
                        </Link>
                    </div>
                </div>

                {/* Community Card */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 m-0">커뮤니티</h3>
                            <p className="text-sm text-gray-500 m-0">함께 나누는 공간</p>
                        </div>
                    </div>
                    <div className="px-6 pb-6">
                        <p className="text-sm text-gray-500 mb-4">
                            학칙에 대한 질문과 경험을 커뮤니티와 공유하세요
                        </p>
                        <Link
                            href="/community"
                            className="block w-full py-2 px-4 text-center rounded-md text-sm font-medium border border-violet-600 text-violet-600 bg-white hover:bg-violet-50 transition-colors"
                        >
                            커뮤니티 참여
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}