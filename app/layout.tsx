// 📁 app/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import TabBar from '@/components/TabBar';
import { BookOpen } from 'lucide-react';
import '../styles/globals.css';
import { GlobalModalProvider } from '@/components/GlobalModal';

export const metadata: Metadata = {
  title: 'Rule-Look - 학칙 도우미',
  description: 'AI 챗봇 및 커뮤니티 통합 서비스',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <GlobalModalProvider>
          <div className="app-container">
            {/* ⭐️ [수정] border-b 제거하고 shadow-sm 추가 / z-30으로 높임 */}
            <header className="bg-white px-6 py-4 flex items-center gap-3 shadow-sm z-30 sticky top-0">
              <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-primary m-0 leading-none">룰룩</h1>
                  <p className="text-xs text-gray-500 m-0 mt-1">Rule-Look</p>
                </div>
              </Link>
            </header>

            <main className="content-area">
              {children}
            </main>

            <TabBar />
          </div>
        </GlobalModalProvider>
      </body>
    </html>
  );
}