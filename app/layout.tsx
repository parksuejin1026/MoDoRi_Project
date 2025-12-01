// 📁 app/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import TabBar from '@/components/TabBar';
import { GraduationCap } from 'lucide-react';
import '../styles/globals.css';
import { GlobalModalProvider } from '@/components/GlobalModal';
import { ThemeProvider } from '@/context/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import { Toaster } from 'sonner';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: 'UniMate - 대학 생활의 모든 것',
  description: '학칙 AI 비서부터 커뮤니티까지, 유니메이트와 함께하세요.',
  openGraph: {
    title: 'UniMate - 대학 생활의 든든한 친구',
    description: '복잡한 학칙은 AI에게 물어보고, 커뮤니티에서 학우들과 소통하세요!',
    url: 'https://unimate.vercel.app',
    siteName: 'UniMate',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UniMate Preview',
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
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-primary m-0 leading-none">유니메이트</h1>
                    <p className="text-xs text-muted-foreground m-0 mt-1">UniMate</p>
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