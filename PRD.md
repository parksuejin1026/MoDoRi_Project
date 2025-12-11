# 📋 제품 요구사항 정의서 (PRD) - 최종 구현 버전 (v2.2.0)

## 1. 프로젝트 개요 (Project Overview)
* **서비스명:** UniMate - 학칙 도우미 & 커뮤니티
* **목적:** 복잡한 대학 학칙 정보를 AI를 통해 쉽고 빠르게 제공하고, 학생 간의 정보 공유를 위한 커뮤니티 공간을 제공함.
* **플랫폼:** 모바일 웹 (Mobile-First Web App)

---

## 2. ⚙️ 기술 스택 (Tech Stack)
| 구분 | 기술 | 구현 내용 |
| :--- | :--- | :--- |
| **풀스택 프레임워크** | Next.js 14 (App Router) | TypeScript 기반으로 구축됨. |
| **Database** | MongoDB Atlas / Mongoose | 커뮤니티, 채팅, 시간표, 알림 데이터 관리, DB 연결 캐싱 로직 적용. |
| **AI Data Source** | Google Sheets API | 사용자 인증 정보 및 학교별 학칙 데이터 관리용 CMS 역할. |
| **AI Engine** | OpenAI API (`gpt-4o-mini`) | Google Sheets RAG 기반 스트리밍 챗봇 답변 제공. |
| **인증/보안** | `bcryptjs` / `nodemailer` | 비밀번호 암호화 및 비밀번호 재설정 이메일 인증 구현. |
| **CSS/UX** | Tailwind CSS / `sonner` | 다크 모드(Dark Mode), 전역 Toast 알림 및 모달 적용. |

---

## 3. ✨ 핵심 기능 구현 현황 (Core Features)

| 기능 | 상세 내용 | 구현 상태 | 관련 파일 |
| :--- | :--- | :--- | :--- |
| **AI 학칙 챗봇** | Google Sheets 기반 RAG, 동적 학교 코드 라우팅, **채팅 기록 (세션/메시지)** 저장 및 불러오기, **AI 답변 피드백** 기능. | **✅ 완료** | `app/api/chat/[schoolCode]/route.ts`, `components/ChatInterface.tsx` |
| **회원 인증/관리** | 로그인, 회원가입, 프로필 수정, 계정 탈퇴, **이메일 인증 기반 비밀번호 재설정** 기능. **bcryptjs** 암호화 및 Google Sheets 저장. | **✅ 완료** | `app/api/auth/*.ts`, `app/reset-password/page.tsx` |
| **프로필/통계** | 사용자 이름, ID, 학교 표시 및 **학교 기준 필터링된 글/댓글/좋아요 개수 통계** 제공. | **✅ 완료** | `app/profile/page.tsx`, `app/api/user/stats/route.ts` |
| **게시글 작성 (C)** | 제목, 내용, 카테고리 선택, **이미지 첨부 (최대 5장)**, **익명 작성** 기능 포함. | **✅ 완료** | `app/community/add/page.tsx`, `app/api/community/route.ts` |
| **게시글 조회 (R)** | **최신순 정렬**, 카테고리 필터링, **내 학교/전체 학교 필터링**, 제목/내용 검색, 상세 조회 시 **조회수 1 증가** 로직 포함. | **✅ 완료** | `app/community/page.tsx`, `app/community/[postId]/page.tsx` |
| **게시글 수정 (U)** | 작성자 본인만 수정 가능하도록 **권한 검증 로직** 구현. | **✅ 완료** | `app/community/[postId]/edit/page.tsx` |
| **게시글 삭제 (D)** | 작성자 본인만 삭제 가능하도록 **권한 검증 로직** 구현. | **✅ 완료** | `components/DeleteButton.tsx` |
| **댓글 기능** | 댓글 작성/조회/수정/삭제, **댓글 작성 시 학교 정보** 저장, **댓글 알림** 생성 기능. | **✅ 완료** | `app/community/[postId]/ClientPostDetail.tsx`, `app/api/comments/*.ts` |
| **좋아요 기능** | 게시글별 좋아요 토글 (PATCH) 기능 및 **좋아요 알림** 생성 기능. | **✅ 완료** | `app/api/community/[postId]/route.ts` |
| **UX 개선** | 하단 탭 바, **Dark Mode**, `sonner` **Toast 알림**, **Pull-to-Refresh**, **Scroll-to-Top**, **Error Boundary** 적용. | **✅ 완료** | `app/layout.tsx`, `components/*.tsx` |
| **알림 기능** | 댓글, 좋아요 알림 목록 조회, **읽음 처리**, **관련 페이지로 이동** 기능. | **✅ 완료** | `app/notifications/page.tsx`, `app/api/notifications/route.ts` |
| **시간표** | 개인 시간표 저장 및 조회 (CRUD) | **✅ 완료** | `app/timetable/page.tsx`, `app/api/timetable/route.ts` |

---

## 4. 💾 데이터 모델 (MongoDB Schema 상세)

**1. Post (게시글)**
| 필드명 | 타입 | 필수 | 설명 |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | 고유 식별자 |
| `title` | String | Yes | 게시글 제목 (trim 적용) |
| `content` | String | Yes | 게시글 본문 |
| `author` | String | Yes | 작성자 닉네임 (익명 가능) |
| `userId` | String | Yes | 작성자 고유 ID (Index) |
| `userEmail` | String | Yes | 작성자 이메일 |
| `school` | String | No | 작성자 소속 학교 |
| `category` | String | Yes | 카테고리 ('전체', '질문', '정보공유', '자유') |
| `views` | Number | No | 조회수 (Default: 0) |
| `likes` | [String] | No | 좋아요 누른 사용자 ID 배열 |
| `images` | [String] | No | 첨부된 이미지 (Base64 등) 배열 |
| `createdAt` | Date | Yes | 생성 일시 (Default: Date.now) |
| `updatedAt` | Date | Yes | 수정 일시 |

**2. Comment (댓글)**
| 필드명 | 타입 | 필수 | 설명 |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | 고유 식별자 |
| `postId` | ObjectId | Yes | 연결된 게시글 ID (Ref: Post) |
| `userId` | String | Yes | 작성자 고유 ID (Index) |
| `author` | String | Yes | 작성자 닉네임 |
| `content` | String | Yes | 댓글 내용 |
| `school` | String | No | 작성자 소속 학교 |
| `createdAt` | Date | Yes | 생성 일시 |

**3. ChatSession (채팅 세션)**
| 필드명 | 타입 | 필수 | 설명 |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | 고유 식별자 |
| `userId` | String | Yes | 사용자 고유 ID (Index) |
| `schoolCode` | String | Yes | 학교 코드 (예: 'dongyang') |
| `title` | String | Yes | 채팅방 제목 (첫 질문 내용 등) |
| `createdAt` | Date | Yes | 생성 일시 |
| `updatedAt` | Date | Yes | 수정 일시 (최근 대화 순 정렬용) |

**4. ChatMessage (채팅 메시지)**
| 필드명 | 타입 | 필수 | 설명 |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | 고유 식별자 |
| `sessionId` | ObjectId | Yes | 연결된 세션 ID (Ref: ChatSession) |
| `role` | String | Yes | 화자 ('user' 또는 'assistant') |
| `content` | String | Yes | 메시지 내용 |
| `createdAt` | Date | Yes | 생성 일시 |

**5. Timetable (시간표)**
| 필드명 | 타입 | 필수 | 설명 |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | 고유 식별자 |
| `userId` | String | Yes | 사용자 고유 ID (Unique Index) |
| `courses` | Array | No | 강의 목록 배열 |
| └ `id` | String | Yes | 강의 고유 ID |
| └ `name` | String | Yes | 강의명 |
| └ `day` | String | Yes | 요일 ('월'~'금') |
| └ `startTime` | Number | Yes | 시작 교시 (9~18) |
| └ `endTime` | Number | Yes | 종료 교시 |
| └ `location` | String | No | 강의실 위치 |
| └ `color` | String | Yes | 배경 색상 클래스 |
| `createdAt` | Date | Yes | 생성 일시 |
| `updatedAt` | Date | Yes | 수정 일시 |

**6. Notification (알림)**
| 필드명 | 타입 | 필수 | 설명 |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | 고유 식별자 |
| `userId` | String | Yes | 알림 수신자 ID (Index) |
| `type` | String | Yes | 알림 유형 ('system', 'comment', 'like') |
| `content` | String | Yes | 알림 내용 |
| `isRead` | Boolean | No | 읽음 여부 (Default: false) |
| `relatedUrl` | String | No | 클릭 시 이동할 링크 URL |
| `createdAt` | Date | Yes | 생성 일시 |
