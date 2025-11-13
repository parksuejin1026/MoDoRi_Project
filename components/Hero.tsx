// 📁 components/Hero.tsx (최종 안정화: 학교 선택 페이지 링크 포함)

import Link from 'next/link';
// Image 컴포넌트와 통계는 제거되었습니다.

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        
        {/* 중앙 정렬 구조로 변경 */}
        <div className="hero-content" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}> 
          
          <div className="hero-text">
            <h1 className="hero-title">Rule-Look</h1>
            <p className="hero-subtitle">학교 규칙을 쉽고 빠르게</p>
            <p className="hero-description" style={{ fontSize: '1.25rem' }}>
              **생성형 AI를 활용한 학칙 전문 챗봇** 서비스입니다.<br />
              복잡한 규정을 지금 바로 질문하고 명확한 답변을 얻으세요.
            </p>
          </div>

          {/* 메인 액션 버튼 영역 */}
          <div className="hero-actions" style={{ justifyContent: 'center', flexDirection: 'row', gap: '1.5rem', marginTop: '2rem' }}>
            
            {/* ⭐️ 학칙 챗봇 버튼: /select-school 경로로 연결 */}
            <Link href="/select-school" className="btn btn-primary btn-large btn-chatbot" style={{ padding: '1rem 3rem' }}>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              **챗봇에게 질문 시작하기**
            </Link>
            
            {/* 커뮤니티 버튼 (보조 CTA) */}
            <Link href="/community" className="btn btn-outline btn-large btn-community" style={{ padding: '1rem 3rem' }}>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
              커뮤니티 참여
            </Link>
          </div>

          {/* ⭐️ 이미지 및 통계 정보 영역은 제거되었습니다. */}

        </div>
      </div>
    </section>
  );
}