# 📋 제품 요구사항 정의서 (PRD) - 최종 구현 버전

## 1. 프로젝트 개요 (Project Overview)
* **서비스명:** Rule-Look (학칙 도우미 & 커뮤니티)
* **목적:** 복잡한 대학 학칙 정보를 AI를 통해 쉽고 빠르게 제공하고, 학생 간의 정보 공유를 위한 커뮤니티 공간을 제공함.
* **플랫폼:** 모바일 웹 (Mobile-First Web App)

---

## 2. ⚙️ 기술 스택 (Tech Stack)
| 구분 | 기술 | 구현 내용 |
| :--- | :--- | :--- |
| **풀스택 프레임워크** | Next.js 14 (App Router) | TypeScript 기반으로 구축됨. |
| **Database** | MongoDB Atlas / Mongoose | 커뮤니티 데이터 관리, DB 연결 캐싱 로직 적용. |
| **AI Data Source** | Google Sheets API | 사용자 및 학칙 데이터 관리용 CMS 역할. |
| **AI Engine** | OpenAI API (`gpt-4o-mini`) | RAG 기반 스트리밍 챗봇 답변 제공./route.ts] |
| **CSS** | Tailwind CSS / Custom CSS | 다크 모드(Dark Mode) 지원 및 모바일 최적화 CSS 변수 적용. |

---

## 3. ✨ 핵심 기능 구현 현황 (Core Features)

| 기능 | 상세 내용 | 구현 상태 | 관련 파일 |
| :--- | :--- | :--- | :--- |
| **AI 학칙 챗봇** | Google Sheets 기반 RAG, 동적 학교 코드 라우팅, 스트리밍 응답, 대화 초기화 기능. | **✅ 완료** | `app/api/chat/[schoolCode]/route.ts`, `app/chat/page.tsx` |
| **회원 인증/관리** | 아이디/비밀번호 기반 로그인, 회원가입, 프로필 수정, 계정 탈퇴. **bcryptjs를 사용한 비밀번호 암호화 및 Google Sheets에 저장.** | **✅ 완료** | `app/api/auth/*.ts`, `lib/google-sheet-auth.ts` |
| **프로필/통계** | 사용자 이름, ID, 학교 표시 및 **작성한 글/댓글/좋아요 개수 통계 제공.** | **✅ 완료** | `app/profile/page.tsx`, `app/api/user/stats/route.ts` |
| **게시글 작성 (C)** | 제목, 내용, 작성자(닉네임/ID/학교) 등록, **카테고리 선택 기능 추가됨.** | **✅ 완료** | `app/community/add/page.tsx`, `app/api/community/route.ts` |
| **게시글 조회 (R)** | **최신순 정렬**, 카테고리 필터링, **학교별 필터링**, 상세 조회 시 **조회수 1 증가** 로직 포함. | **✅ 완료** | `app/community/page.tsx`, `app/community/[postId]/page.tsx`, `app/api/community/route.ts` |
| **게시글 수정 (U)** | 작성자 본인만 수정 가능하도록 **권한 검증 로직** (`currentUserId` 비교) 구현. 카테고리 수정 가능. | **✅ 완료** | `app/community/[postId]/edit/page.tsx`, `app/api/community/[postId]/route.ts` |
| **게시글 삭제 (D)** | 작성자 본인만 삭제 가능하도록 **권한 검증 로직** 구현. | **✅ 완료** | `components/DeleteButton.tsx`, `app/api/community/[postId]/route.ts` |
| **댓글 기능** | 게시글 상세 페이지에서 댓글 작성/조회 가능. **댓글 작성 시 학교 정보 저장.** | **✅ 완료** | `app/community/[postId]/ClientPostDetail.tsx`, `app/api/comments/route.ts` |
| **좋아요 기능** | 게시글별 좋아요 수 표시 및 좋아요/취소 (PATCH) 기능 구현. | **✅ 완료** | `app/community/[postId]/ClientPostDetail.tsx`, `app/api/community/[postId]/route.ts` |
| **UI/UX** | 하단 탭 바, **다크 모드**, 전역 알림/확인 모달 (`GlobalModal`) 적용. | **✅ 완료** | `components/TabBar.tsx`, `components/GlobalModal.tsx`, `context/ThemeProvider.tsx` |

---

## 4. 💾 데이터 모델 (MongoDB Schema - `Post` 및 `Comment` 기준)

**Collection: Post (게시글)**

| 필드명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `_id` | ObjectId | 고유 식별자 |
| `title` | String | 게시글 제목 |
| `content` | String | 게시글 본문 |
| `author` | String | 작성자 닉네임 |
| `userId` | String | 작성자 고유 ID (인증키) |
| `userEmail` | String | 작성자 이메일 (인증키) |
| `school` | String | 작성자 학교 |
| `category` | String (Enum) | 게시글 카테고리 (자유/질문/정보공유) |
| `views` | Number | 조회수 (Default: 0) |
| `likes` | [String] | 좋아요 누른 사용자 ID 목록 |
| `createdAt` | Date | 생성 일시 |

**Collection: Comment (댓글)**

| 필드명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `_id` | ObjectId | 고유 식별자 |
| `postId` | ObjectId | 연결된 게시글 ID |
| `userId` | String | 작성자 고유 ID |
| `author` | String | 작성자 닉네임 |
| `content` | String | 댓글 내용 |
| `school` | String | 작성자 학교 |
| `createdAt` | Date | 생성 일시 |
