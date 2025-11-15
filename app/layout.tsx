// 📁 app/layout.tsx (전역 레이아웃 - 모바일 UX 최종 버전)

import '../styles/globals.css'; 
import type { Metadata } from 'next';
import TabBar from '@/components/TabBar'; 

// [기능 설명] Next.js 앱의 메타데이터를 정의합니다.
export const metadata: Metadata = {
  title: 'Rule-Look - 학칙 도우미',
  description: 'AI 챗봇 및 커뮤니티 통합 서비스',
};

// [기능 설명] 모든 페이지를 감싸는 최상위 레이아웃 컴포넌트입니다.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {/* ⭐️ [UI] 모바일 뷰포트 크기 제한 컨테이너 */}
        <div className="mobile-app-container">
            
            {/* ⭐️ [UI] 메인 콘텐츠 영역: 하단 탭 바 공간 확보 및 스크롤 관리 */}
            <main className="mobile-content-area">
                {children}
            </main>

            {/* ⭐️ [UI] 전역 탐색을 위한 하단 고정 탭 바 */}
            <TabBar /> 
            
        </div>
      </body>
    </html>
  );
}