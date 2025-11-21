// app/community/add/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
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
        body: JSON.stringify({ title, content, author: author || '익명' }),
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
    <div className="flex flex-col h-full bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <Link href="/community" className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">취소</span>
        </Link>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
        >
          {isSubmitting ? '등록 중...' : '완료'}
        </button>
      </div>

      {/* 작성 폼 */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">글 작성</h2>

        <div className="space-y-6">
          {/* 카테고리 (UI만) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">카테고리</label>
            <select className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none">
              <option>자유</option>
              <option>질문</option>
              <option>정보공유</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">작성자</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="닉네임을 입력하세요 (선택)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">본문</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm min-h-[300px] resize-y focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="내용을 입력하세요"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
