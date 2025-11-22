import Link from 'next/link';

export default function Features() {
  return (
    <section className="features-section">
      <div className="features-container">

        <div className="section-header">
          <h2 className="section-title">주요 기능</h2>
          <p className="section-description">
            Rule-Look이 제공하는 핵심 기능들을 확인하세요
          </p>
        </div>

        <div className="main-features-grid">

          <div className="feature-card" style={{ backgroundColor: '#e0f2fe' }}>
            <div className="feature-card-content" style={{ paddingTop: '2rem' }}>
              <div className="feature-icon-badge feature-icon-blue" style={{ position: 'relative', margin: '0 auto 1.5rem', left: '0', bottom: '0' }}>
                <svg className="icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="7" width="14" height="12" rx="3" ry="3"></rect>
                  <line x1="9" y1="7" x2="9" y2="4"></line>
                  <line x1="15" y1="7" x2="15" y2="4"></line>
                  <circle cx="9" cy="3" r="1" fill="currentColor"></circle>
                  <circle cx="15" cy="3" r="1" fill="currentColor"></circle>
                  <circle cx="9" cy="11" r="1.5" fill="currentColor"></circle>
                  <circle cx="15" cy="11" r="1.5" fill="currentColor"></circle>
                  <path d="M9 15 Q12 17 15 15" fill="none"></path>
                </svg>
              </div>
              <h3 className="feature-title">AI 기반 학칙 Q&A</h3>
              <p className="feature-description">
                제공된 동양미래대학교 학칙 및 시행세칙을 기반으로<br />
                정확하고 신속한 답변을 즉시 받아보세요.
              </p>
              {/* ⭐️ 챗봇 링크: /chat */}
              <Link href="/chat" className="btn btn-primary btn-full-width btn-feature-chatbot">
                챗봇으로 질문하기
              </Link>
            </div>
          </div>

          <div className="feature-card" style={{ backgroundColor: '#d1fae5' }}>
            <div className="feature-card-content" style={{ paddingTop: '2rem' }}>
              <h3 className="feature-title">학생 커뮤니티 (개발 예정)</h3>
              <p className="feature-description">
                학칙 관련 질문이나 학교 생활에 대한 다양한 정보를 <br />
                다른 학생들과 자유롭게 공유하고 토론하세요.
              </p>

              <Link href="/community" className="btn btn-primary btn-full-width btn-feature-community">
                커뮤니티 바로가기
              </Link>

            </div>
          </div>
        </div>

        {/* ... 추가 기능 그리드는 그대로 유지 ... */}
        <div className="additional-features-grid">
          <div className="additional-feature-card">
            <div className="additional-feature-icon">
              <svg className="icon-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <h3 className="additional-feature-title">학칙 가이드</h3>
            <p className="additional-feature-description">복잡한 학칙을 쉽게 이해할 수 있는 가이드를 제공합니다</p>
          </div>
          <div className="additional-feature-card">
            <div className="additional-feature-icon">
              <svg className="icon-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="additional-feature-title">Q&A</h3>
            <p className="additional-feature-description">학칙에 대한 궁금한 점을 질문하고 답변을 받으세요</p>
          </div>
          <div className="additional-feature-card">
            <div className="additional-feature-icon">
              <svg className="icon-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3 className="additional-feature-title">업데이트 알림</h3>
            <p className="additional-feature-description">학칙 변경사항을 실시간으로 알려드립니다</p>
          </div>
          <div className="additional-feature-card">
            <div className="additional-feature-icon">
              <svg className="icon-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="additional-feature-title">신뢰성 보장</h3>
            <p className="additional-feature-description">공식 학칙 데이터를 기반으로 정확한 정보를 제공합니다</p>
          </div>
        </div>

        <div className="cta-section">
          <h3 className="cta-title">지금 시작해보세요</h3>
          <p className="cta-description">
            무료로 가입하고 모든 기능을 이용해보세요
          </p>
          <Link href="/signup" className="btn btn-primary btn-large btn-cta-signup">
            무료 시작하기
          </Link>
        </div>
      </div>
    </section>
  );
}