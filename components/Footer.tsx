import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-company-info">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <span className="footer-logo-text">RL</span>
            </div>
            <h3 className="footer-logo-title">Rule-Look</h3>
          </div>
          <p className="footer-description">
            학교 규칙을 쉽고 빠르게 찾을 수 있는 플랫폼
          </p>
          <div className="footer-contact">
            <div className="contact-item">
              <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>cjh040602@icloud.com</span>
              <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>parksuejin1026@naver.com</span>
            </div>
          </div>
        </div>

        <div className="footer-support-links">
          <Link href="/help" className="footer-support-link">도움말</Link>
          <Link href="/contact" className="footer-support-link">문의하기</Link>
          <Link href="/report" className="footer-support-link">신고하기</Link>
          <Link href="/faq" className="footer-support-link">FAQ</Link>
        </div>

        <div className="footer-separator"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 Rule-Look. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link href="/privacy" className="footer-bottom-link">개인정보처리방침</Link>
            <Link href="/terms" className="footer-bottom-link">이용약관</Link>
            <Link href="/cookies" className="footer-bottom-link">쿠키 정책</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}