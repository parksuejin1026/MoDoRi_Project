# 📋 제품 요구사항 정의서 (PRD)

## 1. 프로젝트 개요 (Project Overview)
* **서비스명:** Rule-Look (학칙 도우미 & 커뮤니티)
* **목적:** 복잡하고 찾기 힘든 대학 학칙 정보를 생성형 AI를 통해 쉽고 빠르게 제공하고, 학생 간의 정보 공유를 위한 커뮤니티 공간을 제공함.
* **플랫폼:** 모바일 웹 (Mobile-First Web App)
* **타겟 유저:** 동양미래대학교 등 지원 대상 학교의 재학생 및 예비 신입생

## 2. 문제 정의 및 해결 방안 (Problem & Solution)
* **문제점 (Pain Point):**
    * 학교 홈페이지에 산재된 학칙 규정(PDF, HWP 등)을 학생들이 직접 찾아보기 어려움.
    * 학칙의 용어가 딱딱하고 이해하기 힘들어 실제 상황(휴학, 장학금 등)에 적용하기 어려움.
    * 교내 정보 공유를 위한 접근성 좋은 커뮤니티의 부재.
* **해결 방안 (Solution):**
    * **AI 학칙 챗봇:** 자연어로 질문하면 해당 학교의 학칙 데이터를 검색하여 정확한 근거 조항과 함께 답변 제공.
    * **모바일 최적화 UX:** 앱처럼 느껴지는 모바일 전용 UI/UX로 접근성 강화.
    * **통합 커뮤니티:** 학칙 외의 생활 정보를 공유할 수 있는 게시판 제공.

## 3. 핵심 기능 명세 (Core Features)

### 3.1. 🤖 AI 학칙 챗봇 (RAG 기반)
* **학교 선택:** 사용자가 본인의 학교를 선택하여 진입 (현재 동양미래대, 한양대, 서울과기대, 안산대, 순천향대 지원).
* **실시간 답변 생성:**
    * OpenAI API (`gpt-3.5-turbo`) 활용.
    * Google Sheets API를 연동하여 최신 학칙 데이터를 실시간으로 로드 (RAG 방식).
    * **System Prompt:** 학칙 원문만을 근거로 하며, 조항 번호를 인용하여 답변하도록 제약 설정.
* **대화 UX:**
    * 자동 스크롤(Auto-scroll), 답변 로딩 인디케이터(Spinner).
    * 대화 기록 초기화 기능.

### 3.2. 👥 학생 커뮤니티 (CRUD)
* **게시글 조회 (Read):** 최신순 정렬, 작성일/조회수/작성자 표시.
* **게시글 작성 (Create):** 제목, 내용, 작성자(익명/닉네임) 입력. 우측 하단 FAB(Floating Action Button) 버튼 제공.
* **게시글 상세 및 수정 (Update):** 본인(또는 사용자)이 작성한 글 내용 수정 가능.
* **게시글 삭제 (Delete):** 게시글 영구 삭제 기능 지원.
* **데이터베이스:** MongoDB Atlas 연동 (Mongoose ORM 사용).

### 3.3. 📱 UI/UX 디자인
* **Mobile-First Layout:** `max-width: 500px` 제한을 둔 컨테이너형 레이아웃.
* **Global Navigation:** 하단 고정 탭 바 (홈 / 챗봇 / 커뮤니티) 제공.
* **Theme:** 가독성을 높인 Black & White 모던 테마 적용 (`globals.css` 변수 활용).

## 4. 데이터 구조 및 시스템 아키텍처

### 4.1. 기술 스택 (Tech Stack)
| 구분 | 기술 | 비고 |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14 (App Router) | React 18, TypeScript |
| **Backend** | Next.js API Routes | Serverless Functions |
| **Database** | MongoDB Atlas | Mongoose (Schema & Connection Caching) |
| **AI / External** | OpenAI API | GPT-3.5 Turbo |
| **Data Source** | Google Sheets API | 학칙 데이터 관리용 CMS 역할 |
| **Deployment** | Vercel | CI/CD 파이프라인 구축 |

### 4.2. 데이터 모델 (MongoDB Schema)
**Collection:** `commu` (Posts)

| 필드명 | 타입 | 설명 | 필수 여부 |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | 고유 식별자 (자동 생성) | Yes |
| `title` | String | 게시글 제목 | Yes |
| `content` | String | 게시글 본문 | Yes |
| `author` | String | 작성자 닉네임 | Yes |
| `views` | Number | 조회수 (Default: 0) | No |
| `createdAt` | Date | 생성 일시 (Default: Now) | No |

## 5. 사용자 플로우 (User Flow)
1.  **접속:** 메인 홈 화면 (`/`) 접속 → 서비스 소개 확인.
2.  **학교 선택:** '챗봇' 탭 이동 → 5개 대학 중 하나 선택.
3.  **질문:** 채팅방 입장 (`/chat/[schoolCode]`) → "휴학 언제까지 할 수 있어?" 입력.
4.  **답변:** AI가 Google Sheets의 학칙 데이터를 분석하여 "학칙 제4조에 의거하여..." 답변 제공.
5.  **커뮤니티:** '커뮤니티' 탭 이동 → 게시글 목록 확인 → (+) 버튼으로 글 작성 → 상세 확인 및 수정/삭제.

## 6. 향후 개선 계획 (Backlog)
* **인증 시스템 도입:** NextAuth.js를 활용한 소셜 로그인 및 작성자 본인 인증.
* **댓글 기능:** 게시글에 대한 댓글/대댓글 기능 추가.
* **좋아요/스크랩:** 유용한 학칙 정보나 게시글 저장 기능.
* **이미지 업로드:** 커뮤니티 내 이미지 첨부 기능 (AWS S3 등 연동).
