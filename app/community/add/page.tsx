'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<'질문' | '정보공유' | '자유'>('자유');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [currentUserSchool, setCurrentUserSchool] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('userName');
      const storedId = localStorage.getItem('userId');
      const storedEmail = localStorage.getItem('userEmail');
      const storedSchool = localStorage.getItem('userSchool');

      if (storedName) setAuthor(storedName);
      if (storedId) setCurrentUserId(storedId);
      if (storedEmail) setCurrentUserEmail(storedEmail);
      if (storedSchool) setCurrentUserSchool(storedSchool);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const maxImages = 5;

    if (images.length + files.length > maxImages) {
      alert(`최대 ${maxImages}장까지만 업로드할 수 있습니다.`);
      return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

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
          author: isAnonymous ? '' : (author.trim() || '익명'),
          category,
          userId: currentUserId,
          userEmail: currentUserEmail,
          school: currentUserSchool,
          images,
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
    // ⭐️ [수정] pb-[60px] 추가: 글로벌 패딩 제거에 맞춰 하단 탭바 높이만큼 여백 확보
    <div className="flex flex-col h-full bg-card relative pb-[47px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
        <Link href="/community" className="flex items-center gap-2 text-muted-foreground hover:bg-accent px-2 py-1 rounded-md transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">취소</span>
        </Link>
        {/* 상단 완료 버튼 (선택적 유지) */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || !content.trim() || !currentUserId}
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:bg-muted-foreground/50 transition-colors"
        >
          {isSubmitting ? '등록 중...' : '완료'}
        </button>
      </div>

      {/* 작성 폼 */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <h2 className="text-2xl font-bold text-foreground mb-6">글 작성</h2>

        <div className="space-y-6">
          {/* 카테고리 선택 필드 (칩 UI) */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">카테고리</label>
            <div className="flex gap-2">
              {(['자유', '질문', '정보공유'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 border ${category === cat
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-muted-foreground border-border hover:bg-secondary'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">작성자</label>

            <input
              type="text"
              value={isAnonymous ? '익명' : author}
              onChange={(e) => setAuthor(e.target.value)}
              disabled={isAnonymous}
              className="w-full p-3 bg-muted border border-border text-foreground rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="닉네임을 입력하세요 (선택)"
            />

            <div className="flex justify-between items-start">
              {currentUserId && <p className='text-xs text-muted-foreground pt-1'>작성자 ID: {currentUserId.substring(0, 8)}...</p>}

              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors pt-1">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <span>익명으로 작성</span>
              </label>
            </div>
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

          {/* 이미지 업로드 및 미리보기 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                사진 첨부
                <span className="text-xs text-muted-foreground font-normal">
                  ({images.length}/5)
                </span>
              </label>
              <label className="cursor-pointer px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-1">
                <ImageIcon size={14} />
                사진 추가
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`preview-${index}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 하단 고정 완료 버튼 */}
      {/* ⭐️ [수정] py-1, px-2 유지 (버튼 컨테이너 높이 최소화) */}
      <div className="py-3 px-4 border-t border-border bg-card sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-center items-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || !content.trim() || !currentUserId}
          className="w-full py-3 bg-primary text-primary-foreground text-base font-bold rounded-xl hover:bg-primary/90 disabled:bg-muted-foreground/50 transition-all shadow-sm active:scale-[0.98]"
        >
          {isSubmitting ? '등록 중...' : '작성 완료'}
        </button>
      </div>
    </div>
  );
}