import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-wrapper">
          <div className="logo-icon">
            <span className="logo-text">RL</span>
          </div>
          <h1 className="logo-title">Rule-Look</h1>
        </div>

        <nav className="navigation">
                    <Link href="/" className="nav-link">홈</Link>
                    <Link href="/rules" className="nav-link">학칙 찾아보기</Link>
                    {/* ⭐️ 아래 라인을 수정합니다. */}
                    <Link href="/community" className="nav-link">커뮤니티</Link> 
                    <Link href="/notice" className="nav-link">공지사항</Link>
                    <Link href="/contact" className="nav-link">문의하기</Link>
                </nav>

        <div className="header-actions">
          <button className="btn btn-ghost btn-login">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            로그인
          </button>
          <button className="btn btn-primary btn-signup">
            회원가입
          </button>
          <button className="btn btn-ghost btn-mobile-menu">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}