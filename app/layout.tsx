// 📁 app/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import TabBar from '@/components/TabBar';
import { BookOpen } from 'lucide-react';
import '../styles/globals.css';
import { GlobalModalProvider } from '@/components/GlobalModal';
import { ThemeProvider } from '@/context/ThemeProvider'; // ⭐️ [추가] ThemeProvider 임포트
import ThemeToggle from '@/components/ThemeToggle'; // ⭐️ [추가] ThemeToggle 임포트

export const metadata: Metadata = {
  title: 'Rule-Look - 학칙 도우미',
  description: 'AI 챗봇 및 커뮤니티 통합 서비스',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // ⭐️ [수정] suppressHydrationWarning 및 ThemeProvider로 감싸기
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <GlobalModalProvider>
            <div className="app-container">
              {/* ⭐️ [수정] Header에 테마 변수 및 ThemeToggle 적용 */}
              <header className="bg-card px-6 py-2 flex items-center gap-3 shadow-sm z-30 sticky top-0 border-b border-border">
                <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shrink-0">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-primary m-0 leading-none">룰룩</h1>
                    <p className="text-xs text-muted-foreground m-0 mt-1">Rule-Look</p>
                  </div>
                </Link>

                {/* ⭐️ [추가] 다크 모드 토글 버튼 */}
                <ThemeToggle className="text-foreground" />

              </header>

              {/* ⭐️ [수정] main 태그에 배경 색상 테마 변수 적용 (globals.css에서 변경됨) */}
              <main className="content-area">
                {children}
              </main>

              <TabBar />
            </div>
          </GlobalModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}