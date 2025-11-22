import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero-section" style={{ padding: '2rem 0' }}>
      <div className="hero-container">

        <div className="hero-content" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>

          <div className="hero-text" style={{ marginBottom: '1.5rem' }}>
            <h1 className="hero-title" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>Rule-Look</h1>
            <p className="hero-subtitle" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>학교 규칙을 쉽고 빠르게</p>
            <p className="hero-description" style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
              **생성형 AI를 활용한 학칙 전문 챗봇** 서비스입니다.
            </p>
          </div>

          <div className="hero-actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>

            {/* ⭐️ 챗봇 버튼 경로 변경: /chat */}
            <Link href="/chat" className="btn btn-primary btn-large btn-chatbot" style={{ padding: '1rem 2.5rem', width: '90%' }}>
              **챗봇에게 질문 시작하기**
            </Link>

            <Link href="/community" className="btn btn-outline btn-large btn-community" style={{ padding: '1rem 2.5rem', width: '90%' }}>
              커뮤니티 참여
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}