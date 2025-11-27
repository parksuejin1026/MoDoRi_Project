# 🏫 Rule-Look: 학칙 기반 AI 챗봇 및 학생 커뮤니티

[![Deploy with Vercel](https://img.shields.io/badge/Vercel-Project_App-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://mo-do-ri-project.vercel.app/)

[![PRD Docs](https://img.shields.io/badge/Document-PRD-blue?style=for-the-badge&logo=markdown&logoColor=white)](PRD.md)

> **Next.js와 MongoDB를 활용하여 대학 학칙 정보 접근성을 혁신하고 학생 간의 소통을 돕는 풀스택 모바일 웹 서비스입니다.**

---

## 1. 💡 핵심 가치 및 목표

Rule-Look은 복잡한 대학 학칙을 **생성형 AI (RAG)** 를 통해 쉽고 빠르게 해석하고, 학생들끼리 자유롭게 정보를 공유할 수 있는 **커뮤니티 플랫폼**을 제공하는 것을 목표로 합니다.

## 2. ⚙️ 주요 기술 스택

| 분류 | 기술/도구 | 상세 역할 |
| :--- | :--- | :--- |
| **풀스택** | Next.js 14 (App Router) / TypeScript | 프론트엔드 및 서버리스 API 구축 |
| **데이터베이스** | MongoDB Atlas / Mongoose | 커뮤니티 게시글, 댓글, 좋아요 데이터 저장 |
| **AI RAG** | OpenAI API (`gpt-4o-mini`) | 학칙 기반 질의응답 엔진 |
| **Data Source** | Google Sheets API | 학칙 데이터 로드 및 사용자 계정 정보 저장 (CMS 역할) |
| **스타일링** | Tailwind CSS / Custom Dark Mode | 모바일 최적화 UI 및 테마 관리 |
| **인증** | Google Sheets & bcryptjs | 회원가입, 로그인, 프로필 관리 및 비밀번호 암호화 |

## 3. ✨ 주요 구현 기능 (CRUD 및 확장)

### 3.1. 🤖 AI 학칙 챗봇 (RAG)
* **다중 학교 지원:** 사용자가 설정한 학교(동양미래대학교 등)에 따라 해당 학교의 학칙만 로드하여 답변합니다.
* **Google Sheets RAG:** 학칙 원문 데이터는 Google Sheets에서 실시간으로 불러와 OpenAI API의 System Prompt에 주입됩니다.
* **스트리밍:** 답변 생성 시 사용자 경험을 개선하기 위해 스트리밍 방식을 적용했습니다.

### 3.2. 👥 학생 커뮤니티 (Fully CRUD)
* **게시글 관리:** 제목, 내용, 카테고리(자유/질문/정보공유)를 포함한 글 작성, 조회, 수정, 삭제 기능을 제공합니다.
* **고급 필터링:** 현재 로그인된 사용자의 **학교 정보**를 기준으로 게시물을 필터링하여 보여줍니다.
* **반응 기능:** 게시글에 **좋아요**를 누르거나 **댓글**을 작성할 수 있습니다.
* **권한 관리:** 게시글 수정/삭제는 **작성자 본인**만 가능하도록 사용자 ID 기반의 권한 검증 로직이 API 레벨에서 구현되었습니다.

### 3.3. 👤 사용자 인증 및 프로필
* **통합 인증:** Google Sheets를 데이터베이스로 사용하여 회원가입, 로그인, 프로필 수정을 처리합니다.
* **보안:** 비밀번호는 **bcryptjs**를 사용하여 안전하게 암호화됩니다.
* **사용자 통계:** 프로필 페이지에서 사용자가 작성한 **글 수, 댓글 수, 좋아요 수** 등의 활동 통계를 제공합니다.
* **테마 기능:** 다크 모드(Dark Mode)를 지원하여 사용자의 선호도에 따라 UI를 변경할 수 있습니다.

## 4. 🖥️ UI/UX 특징 (Mobile-First)

* **반응형 디자인:** Tailwind CSS를 활용하여 모바일 환경에 최적화된 컨테이너형 레이아웃을 제공합니다.
* **전역 탐색:** `TabBar` 컴포넌트를 통해 모든 페이지에서 접근 가능한 하단 고정 탭 바를 구현했습니다.
* **사용자 경험 개선:**
    * **Dark Mode (다크 모드):** 전역적으로 테마 토글이 가능합니다.
    * **Global Modal:** 전역적으로 경고(`alert`) 및 확인(`confirm`) 모달을 사용할 수 있습니다.
    * **FAB:** 커뮤니티 글쓰기 버튼을 우측 하단에 Floating Action Button 형태로 배치하여 접근성을 높였습니다.

---

## 5. 🛠️ 설치 및 실행 방법

1.  **Git 클론:**
    ```bash
    git clone [저장소 주소]
    cd [프로젝트 폴더]
    ```

2.  **의존성 설치:**
    ```bash
    npm install
    ```

3.  **환경 변수 설정:**
    프로젝트 루트에 `.env.local` 파일을 생성하고 필수 변수를 설정합니다.

4.  **개발 서버 실행:**
    ```bash
    npm run dev
    ```
    (브라우저에서 `http://localhost:3000`으로 접속)
