import type { Metadata } from 'next';
// ⭐️ 이 부분을 수정합니다: ../styles/globals.css 대신 바로 './globals.css'
import './globals.css'; // ⭐️ 현재 app 폴더에 CSS가 있을 때의 올바른 경로

import Header from '../components/Header'; 
import Footer from '../components/Footer'; 

export const metadata: Metadata = {
  title: 'Rule-Look - 학교 규칙을 쉽고 빠르게',
  description: '필요한 학칙을 검색하고, 학생들과 소통하세요',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <div className="app-container">
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}