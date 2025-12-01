// 📁 app/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import TabBar from '@/components/TabBar';
import { BookOpen } from 'lucide-react';
import '../styles/globals.css';
import { GlobalModalProvider } from '@/components/GlobalModal';
import { ThemeProvider } from '@/context/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import { Toaster } from 'sonner';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: 'Rule-Look - 학칙 도우미',
  description: 'AI 챗봇 및 커뮤니티 통합 서비스',
  openGraph: {
    title: 'Rule-Look - 우리 학교 학칙을 쉽고 빠르게',
    description: '복잡한 학칙, AI에게 물어보세요! 커뮤니티에서 학우들과 정보도 공유할 수 있습니다.',
    url: 'https://rule-look.vercel.app',
    siteName: 'Rule-Look',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rule-Look Preview',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <GlobalModalProvider>
            <div className="app-container">
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

                <ThemeToggle className="text-foreground" />

              </header>

              <main className="content-area">
                {children}
              </main>

              <ScrollToTop />
              <TabBar />
            </div>
            <Toaster position="top-center" richColors closeButton />
          </GlobalModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}