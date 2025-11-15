// 📁 app/select-school/page.tsx (학교 선택 진입 페이지)

// [기능 설명] 이 페이지는 서버 컴포넌트이며, 정적인 데이터 로딩과 SEO 관리에 유리합니다.
// 실제 UI 및 사용자 상호작용은 SchoolSelector.tsx에서 처리합니다.

import SchoolSelector from '@/components/SchoolSelector'; // ⭐️ SchoolSelector 컴포넌트 import

export default function SelectSchoolPage() {
    // [기능 설명] SchoolSelector 컴포넌트를 렌더링합니다.
    return <SchoolSelector />;
}