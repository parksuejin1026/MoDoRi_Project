# 🏫 Rule-Look: 학칙 기반 AI 챗봇 및 학생 커뮤니티

# <a href="[https://www.example.com](https://www.example.com)" target="_blank">https://mo-do-ri-project.vercel.app/</a>

> **Next.js와 MongoDB를 활용하여 동양미래대학교 학칙 정보 접근성을 혁신하는 풀스택 서비스입니다.**

---

## 1. 💡 프로젝트 개요 및 목표

Rule-Look은 생성형 AI 기술을 활용하여 교내 학칙 및 규정에 대한 학생들의 질문에 실시간으로 답변하고, 학생들이 익명으로 정보를 공유할 수 있는 커뮤니티 공간을 제공합니다.

### 🎯 핵심 가치

* **통합된 정보:** 분산된 학칙 문서 정보를 한 곳에서 제공.
* **신뢰성:** AI 답변의 근거를 **공식 학칙 텍스트**에 기반하여 확보.
* **완전성:** 커뮤니티 게시판의 **CRUD (작성, 조회, 수정, 삭제)** 기능 구현 완료.

---

## 2. 🛠️ 기술 스택 (Tech Stack)

저희 프로젝트는 Node.js 생태계 내에서 프론트엔드와 백엔드를 통합하는 **Next.js 기반의 풀스택 아키텍처**를 사용합니다.

| 구분 | 기술/도구 | 상세 역할 |
| :--- | :--- | :--- |
| **풀스택 프레임워크** | **Next.js 14 (App Router)** | React 기반의 서버/클라이언트 하이브리드 통합 환경 |
| **언어** | **TypeScript** | 코드 안정성 및 유지보수성 향상 |
| **데이터베이스** | **MongoDB Atlas** | 커뮤니티 게시글 데이터 저장 및 관리 (NoSQL) |
| **DB ORM** | **Mongoose** | Node.js 환경에서 MongoDB 데이터 모델링 및 관리 |
| **AI 엔진** | **OpenAI API** | 챗봇 답변 생성 및 **프롬프트 엔지니어링** 수행 |

---

## 3. ✨ 주요 기능 구현 현황 (CRUD 완성)

저희는 **커뮤니티의 모든 기본 CRUD 기능**과 **챗봇의 핵심 로직**을 완성했습니다.

### 3.1. 👥 커뮤니티 게시판 (CRUD)

| 기능 | HTTP 메서드 | 구현 내용 | 상태 |
| :--- | :--- | :--- | :--- |
| **작성 (Create)** | `POST /api/community` | **`/community/add`** 폼 구현 및 MongoDB 저장 로직 연동. | ✅ 완성 |
| **목록 조회 (Read List)** | `GET /community` | MongoDB 데이터를 불러와 **최신순**으로 목록 표시. | ✅ 완성 |
| **상세 조회 (Read Detail)** | `GET /api/community/[postId]` | **동적 라우팅**을 통해 특정 게시글 ID의 데이터를 불러와 상세 페이지 표시. | ✅ 완성 |
| **수정 (Update)** | `PUT/PATCH /api/community/[postId]` | 수정 폼 (`/edit`) 구현 및 **PATCH API**를 통한 DB 데이터 업데이트 로직 연동. | ✅ 완성 |
| **삭제 (Delete)** | `DELETE /api/community/[postId]` | **`DeleteButton.tsx`** 컴포넌트를 통해 **DELETE API**를 호출하여 게시글 삭제. | ✅ 완성 |

### 3.2. 🤖 AI 챗봇 및 UX

| 기능 | 파일/경로 | 구현 내용 |
| :--- | :--- | :--- |
| **챗봇 엔진** | `app/api/chatbot/route.ts` | **통합 학칙 데이터**를 프롬프트에 주입하여 근거 기반 답변 생성. |
| **UX/UI** | `app/chat/page.tsx` | **자동 스크롤**, 로딩 스피너, 대화 초기화 기능 구현. |
| **테마** | `globals.css` | **검정-흰색(B&W)** 모던 테마 적용. |

---

## 4. 📁 폴더 구조 및 역할 지도

| 분류 | 파일/경로 | 역할 |
| :--- | :--- | :--- |
| **API (CRUD)** | `app/api/community/route.ts` | **글 작성(POST)** 및 **목록 조회(GET)** API. |
| | `app/api/community/[postId]/route.ts` | **상세 조회, 수정, 삭제** API (동적 라우팅). |
| **UI (라우팅 그룹)** | `app/community/(post-group)/...` | **라우팅 충돌 방지**를 위해 **상세, 수정, 작성** 페이지를 묶은 폴더 그룹. |
| | `app/community/(post-group)/page.tsx` | **게시글 목록 페이지** (Read List). |
| | `app/community/(post-group)/add/page.tsx` | 게시글 **작성 폼** (Create UI). |
| | `app/community/(post-group)/[postId]/page.tsx` | 게시글 **상세 조회** (Read Detail). |
| **DB & 모델** | `models/Post.ts` | MongoDB **게시글 스키마** 정의. |
| | `lib/db/mongodb.ts` | Mongoose **DB 연결 캐싱 로직** (Next.js 안정화용). |
| **AI 핵심** | `app/chat/page.tsx` | AI 챗봇 대화 화면 UI. |
| | `lib/ruleData.ts` | **3가지 학칙 파일을 통합**한 AI 지식 데이터. |

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
