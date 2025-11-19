# 🏫 Rule-Look: 학칙 기반 AI 챗봇 및 학생 커뮤니티

[![Deploy with Vercel](https://img.shields.io/badge/Vercel-Project_App-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://mo-do-ri-project.vercel.app/)

> **Next.js와 MongoDB를 활용하여 다양한 학교의 학칙 정보 접근성을 혁신하는 풀스택 서비스입니다.**

---

# 🏫 Rule-Look 프로젝트 개발 명세 (최종 구현 기준)

저희 프로젝트는 **Next.js (App Router)** 기반으로 구축되었으며, **학칙 챗봇(AI)**과 **학생 커뮤니티(MongoDB)**라는 두 가지 핵심 기능을 제공합니다.

## 1. ⚙️ 기술 스택 및 환경 (Tech Stack & Environment)

| 구분 | 기술/도구 | 상세 역할 및 구현 내용 |
| :--- | :--- | :--- |
| **풀스택 프레임워크** | **Next.js 14 (App Router)** | TypeScript 기반, Node.js 환경에서 프론트/백엔드 통합. |
| **데이터베이스** | **MongoDB Atlas / Mongoose** | 커뮤니티 게시글 데이터 저장 및 관리. **DB 연결 캐싱 로직 안정화** 완료. |
| **AI 데이터 소스** | **Google Sheets API** | 학칙 텍스트를 실시간으로 불러와 프롬프트에 동적으로 로드하는 로직 구현. |
| **AI 엔진** | **OpenAI API** | 프롬프트 엔지니어링 기반 답변 생성. |
| **디자인** | **Custom CSS** | **검정-흰색(B&W)** 모던 테마 CSS 변수 적용 완료. |

---

## 2. ✨ 핵심 기능 구현 현황 (CRUD 완성)

### 2.1. 👥 커뮤니티 게시판 (CRUD 완성)

| 기능 | HTTP 메서드 / 경로 | 상세 구현 내용 |
| :--- | :--- | :--- |
| **작성 (Create)** | `POST /api/community` | **`/community/add`** 폼 구현 및 MongoDB 저장 로직 연동 완료. |
| **목록 조회 (Read List)** | `GET /community` | MongoDB 데이터를 불러와 **최신순**으로 표시. |
| **상세 조회 (Read Detail)** | `GET /api/community/[postId]` | **동적 라우팅**을 통해 특정 게시글 ID의 데이터를 불러와 상세 내용 표시. |
| **수정 (Update)** | `PATCH /api/community/[postId]` | 수정 폼 (`/edit`) 구현 및 **PATCH API**를 통한 DB 데이터 업데이트 로직 연동. |
| **삭제 (Delete)** | `DELETE /api/community/[postId]` | **`DeleteButton.tsx`** 컴포넌트를 통한 **DELETE API** 호출 및 목록 리다이렉트 연동 완료. |

### 2.2. 🤖 AI 챗봇 엔진 및 UX

| 기능 | 파일/경로 | 구현 내용 |
| :--- | :--- | :--- |
| **RAG 엔진** | `app/api/chat/[schoolCode]/route.ts` | **OpenAI API** 연동 및 **Google Sheets**에서 학교별 학칙을 동적으로 로드하는 로직 구현. |
| **UX/UI** | `app/chat/page.tsx` | **자동 스크롤**, 로딩 스피너, 대화 초기화 기능 구현 완료. |
| **다중 학교 지원** | `app/select-school/page.tsx` | 사용자가 학교를 선택하면 해당 코드를 챗봇 API에 전달하는 기능 구현 완료. |

---
### 3. 🖥️ 모바일 앱 UI/UX 요구사항 

| 항목 | 요구사항 | 적용 기능 |
| :--- | :--- | :--- |
| **전역 탐색** | **하단 탭 바 (Tab Bar)** | [홈], [챗봇], [커뮤니티] 등 핵심 메뉴로 Header/Footer 대체. |
| **액션** | **FAB (Floating Action Button)** | 커뮤니티 목록 화면에서 글쓰기 버튼을 **`+` 형태의 FAB**로 우측 하단에 고정 배치. |
| **입력 영역** | **키보드 대응** | 챗봇 및 글쓰기 폼의 입력 필드를 **키보드 등장 시** 자동으로 밀어 올리도록 처리. |
| **상세 화면** | **뒤로 가기 버튼** | 상세 페이지 Navigation Bar에 **[뒤로 가기]** 버튼을 배치하여 탐색을 용이하게 함. |

## 4. 📁 최종 폴더 구조 및 역할 지도

| 분류 | 파일/경로 | 역할 |
| :--- | :--- | :--- |
| **API (CRUD)** | `app/api/community/route.ts` | **글 작성(POST)** 및 **목록 조회(GET)** API. |
| | `app/api/community/[postId]/route.ts` | **상세 조회, 수정, 삭제** API (동적 라우팅). |
| **API (챗봇)** | `app/api/chat/[schoolCode]/route.ts` | **다중 학교 학칙**을 기반으로 답변을 생성하는 동적 API. |
| **UI (라우팅 그룹)** | `app/community/(post-group)/...` | **라우팅 충돌 방지**를 위해 **상세, 수정, 작성** 페이지를 묶은 폴더 그룹. |
| | `app/community/(post-group)/add/page.tsx` | 게시글 **작성 폼** (Create UI). |
| | `app/community/(post-group)/[postId]/page.tsx` | 게시글 **상세 조회** (Read Detail). |
| **DB & Util** | `models/Post.ts` | MongoDB **게시글 스키마** 정의. |
| | `lib/db/mongodb.ts` | Mongoose **DB 연결 캐싱 로직** (Next.js 안정화용). |

---
---

## 5. ⚙️ 설치 및 실행 방법

1.  **Git 클론 및 폴더 이동:**
    ```bash
    git clone [깃허브 저장소 주소]
    cd [프로젝트 폴더명]
    ```

2.  **의존성 설치:**
    ```bash
    npm install
    ```

3.  **환경 변수 설정:**
    프로젝트 루트에 **`.env.local`** 파일을 생성하고 `MONGODB_URI` 및 `OPENAI_API_KEY`를 설정합니다. (특수 문자 인코딩 필수)

4.  **개발 서버 실행:**
    ```bash
    npm run dev
    ```
    (브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.)
