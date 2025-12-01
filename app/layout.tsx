// 📁 app/layout.tsx
import type { Metadata } from 'next';
import TabBar from '@/components/TabBar';
import Header from '@/components/Header'; // ⭐️ Header 컴포넌트 임포트
import '../styles/globals.css';
import { GlobalModalProvider } from '@/components/GlobalModal';
import { ThemeProvider } from '@/context/ThemeProvider';
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
              {/* ⭐️ 복잡한 헤더 코드 대신 Header 컴포넌트 사용 */}
              <Header />

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