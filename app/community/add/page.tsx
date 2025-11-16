// 📁 app/community/add/page.tsx (글쓰기 페이지 - 최종 안정화)

'use client'; 

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('익명 사용자'); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const router = useRouter();

  // 글 작성 및 API 전송 처리 함수 (POST API 호출)
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault(); 

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/community', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          author,
        }),
      });

      if (response.ok) {
        alert('게시글이 성공적으로 작성되었습니다!');
        router.push('/community'); 
      } else {
        const errorData = await response.json();
        alert(`게시글 작성 실패: ${errorData.error || response.statusText}.`);
      }
    } catch (error) {
      console.error('글쓰기 통신 오류:', error);
      alert('서버와 통신하는 도중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [title, content, author, router]);


  // UI 렌더링
  return (
    <div className="write-container" style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--color-primary)' }}>
        새 글 작성하기
      </h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* 제목 입력 필드 */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
            placeholder="제목을 입력하세요."
          />
        </div>

        {/* 작성자 입력 필드 (임시) */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>작성자</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={isSubmitting}
            style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#f5f5f5' }}
            placeholder="닉네임을 입력하세요."
          />
          <small style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem', display: 'block' }}>
            * 현재는 임시 작성자 정보로 입력됩니다.
          </small>
        </div>

        {/* 내용 입력 필드 */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            rows={10}
            style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '6px', resize: 'vertical' }}
            placeholder="게시글 내용을 입력하세요."
          />
        </div>

        {/* 작성 버튼 */}
        <button
          type="submit"
          className="btn btn-primary btn-large"
          disabled={isSubmitting}
          style={{ 
            marginTop: '1rem', 
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? '작성 중...' : '게시글 작성'}
        </button>
      </form>
    </div>
  );
}