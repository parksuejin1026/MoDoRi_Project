// 📁 app/community/add/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  // ⭐️ [추가] 카테고리 상태 추가
  const [category, setCategory] = useState<'질문' | '정보공유' | '자유'>('자유');
  const [currentUserId, setCurrentUserId] = useState<string>(''); // ⭐️ 추가
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(''); // ⭐️ 추가
  const [currentUserSchool, setCurrentUserSchool] = useState<string>(''); // ⭐️ 추가: 학교 정보

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('userName');
      const storedId = localStorage.getItem('userId');
      const storedEmail = localStorage.getItem('userEmail');
      const storedSchool = localStorage.getItem('userSchool'); // ⭐️ 학교 정보 가져오기

      if (storedName) setAuthor(storedName);
      if (storedId) setCurrentUserId(storedId); // ⭐️ 저장
      if (storedEmail) setCurrentUserEmail(storedEmail); // ⭐️ 저장
      if (storedSchool) setCurrentUserSchool(storedSchool); // ⭐️ 저장
    }
  }, []);

  // ⭐️ [추가] userId가 없으면 등록 불가
  if (!currentUserId || !currentUserEmail) {
    // 렌더링을 막고 로딩 스피너나 리다이렉트를 고려할 수 있습니다.
    // 현재는 글쓰기 버튼만 비활성화합니다.
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !currentUserId || !currentUserEmail) {
      alert("사용자 인증 정보가 누락되었거나 제목/내용을 입력하지 않았습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          author: author.trim() || '익명',
          category, // ⭐️ 카테고리 추가
          userId: currentUserId, // ⭐️ userId 추가
          userEmail: currentUserEmail, // ⭐️ userEmail 추가
          school: currentUserSchool, // ⭐️ school 추가
        }),
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
    <div className="flex flex-col h-full bg-card">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
        <Link href="/community" className="flex items-center gap-2 text-muted-foreground hover:bg-accent px-2 py-1 rounded-md transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">취소</span>
        </Link>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || !content.trim() || !currentUserId} // ⭐️ userId 조건 추가
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:bg-muted-foreground/50 transition-colors"
        >
          {isSubmitting ? '등록 중...' : '완료'}
        </button>
      </div>

      {/* 작성 폼 */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <h2 className="text-2xl font-bold text-foreground mb-6">글 작성</h2>

        <div className="space-y-6">
          {/* ⭐️ [수정] 카테고리 선택 필드 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as '질문' | '정보공유' | '자유')}
              className="w-full p-3 bg-muted border border-border text-foreground rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
            >
              <option value="자유">자유</option>
              <option value="질문">질문</option>
              <option value="정보공유">정보공유</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">작성자</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-3 bg-muted border border-border text-foreground rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              placeholder="닉네임을 입력하세요 (선택)"
            />
            {currentUserId && <p className='text-xs text-muted-foreground pt-1'>작성자 ID: {currentUserId.substring(0, 8)}...</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-muted border border-border text-foreground rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">본문</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 bg-muted border border-border text-foreground rounded-xl text-sm min-h-[300px] resize-y focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              placeholder="내용을 입력하세요"
            />
          </div>
        </div>
      </div>
    </div>
  );
}