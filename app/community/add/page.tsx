// 📁 app/community/add/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // ⭐️ [수정] 로컬 스토리지에서 사용자 이름 불러오기 (선택 사항)
  const [author, setAuthor] = useState(localStorage.getItem('userName') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ⭐️ [수정] author가 비어있으면 '익명'으로 처리
        body: JSON.stringify({ title, content, author: author.trim() || '익명' }),
      });

      if (response.ok) {
        router.push('/community');
        router.refresh();
      } else {
        alert('글 작성 실패');
      }
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // ⭐️ [수정] 배경 색상 테마 변수 적용
    <div className="flex flex-col h-full bg-card">
      {/* 헤더 */}
      {/* ⭐️ [수정] 배경/경계/텍스트 색상 테마 변수 적용 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
        <Link href="/community" className="flex items-center gap-2 text-muted-foreground hover:bg-accent px-2 py-1 rounded-md transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">취소</span>
        </Link>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || !content.trim()}
          // ⭐️ [수정] 버튼 테마 변수 적용
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:bg-muted-foreground/50 transition-colors"
        >
          {isSubmitting ? '등록 중...' : '완료'}
        </button>
      </div>

      {/* 작성 폼 */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <h2 className="text-2xl font-bold text-foreground mb-6">글 작성</h2>

        <div className="space-y-6">
          {/* 카테고리 (UI만) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">카테고리</label>
            <select
              // ⭐️ [수정] 입력창 테마 변수 적용
              className="w-full p-3 bg-muted border border-border text-foreground rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
            >
              <option>자유</option>
              <option>질문</option>
              <option>정보공유</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">작성자</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              // ⭐️ [수정] 입력창 테마 변수 적용
              className="w-full p-3 bg-muted border border-border text-foreground rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              placeholder="닉네임을 입력하세요 (선택)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              // ⭐️ [수정] 입력창 테마 변수 적용
              className="w-full p-3 bg-muted border border-border text-foreground rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">본문</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              // ⭐️ [수정] 입력창 테마 변수 적용
              className="w-full p-3 bg-muted border border-border text-foreground rounded-xl text-sm min-h-[300px] resize-y focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              placeholder="내용을 입력하세요"
            />
          </div>
        </div>
      </div>
    </div>
  );
}