// 📁 components/Hero.tsx 파일 내용 (이미지/통계 제거 및 CTA 강화)

import Link from 'next/link';
// import Image from 'next/image'; // ⭐️ Image 컴포넌트 더 이상 사용 안 함

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* hero-grid 대신 중앙 정렬 구조로 변경 */}
        <div className="hero-content" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}> 
          
          <div className="hero-text">
            <h1 className="hero-title">Rule-Look</h1>
            <p className="hero-subtitle">학교 규칙을 쉽고 빠르게</p>
            <p className="hero-description" style={{ fontSize: '1.25rem' }}>
              **생성형 AI를 활용한 동양미래대학교 학칙 전문 챗봇**입니다.<br />
              복잡하고 어려운 규정을 지금 바로 질문하고 명확한 답변을 얻으세요.
            </p>
          </div>

          {/* 메인 액션 버튼 영역 */}
          <div className="hero-actions" style={{ justifyContent: 'center', flexDirection: 'row', gap: '1.5rem', marginTop: '2rem' }}>
            
            {/* ⭐️ 학칙 챗봇 버튼 (가장 강조) */}
            <Link href="/chat" className="btn btn-primary btn-large btn-chatbot" style={{ padding: '1rem 3rem' }}>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="7" width="14" height="12" rx="3" ry="3"></rect>
                <line x1="9" y1="7" x2="9" y2="4"></line>
                <line x1="15" y1="7" x2="15" y2="4"></line>
                <circle cx="9" cy="3" r="1" fill="currentColor"></circle>
                <circle cx="15" cy="3" r="1" fill="currentColor"></circle>
                <circle cx="9" cy="11" r="1.5" fill="currentColor"></circle>
                <circle cx="15" cy="11" r="1.5" fill="currentColor"></circle>
                <path d="M9 15 Q12 17 15 15" fill="none"></path>
              </svg>
              **챗봇에게 질문 시작하기**
            </Link>
            
            {/* 커뮤니티 버튼 (보조 CTA) */}
            {/* ⭐️ Link 컴포넌트로 교체합니다. */}
            <Link href="/community" className="btn btn-outline btn-large btn-community" style={{ padding: '1rem 3rem' }}>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              커뮤니티 참여
            </Link>
          </div>
          
          {/* ⭐️ 통계 정보 제거 */}
          {/* ⭐️ hero-image-wrapper 제거 */}

        </div>
      </div>
    </section>
  );
}