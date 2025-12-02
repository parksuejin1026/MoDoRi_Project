# 🏫 UniMate: 학칙 기반 AI 챗봇 및 학생 커뮤니티

[![Deploy with Vercel](https://img.shields.io/badge/Vercel-Project_App-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://mo-do-ri-project.vercel.app/)
[![PRD Docs](https://img.shields.io/badge/Document-PRD-blue?style=for-the-badge&logo=markdown&logoColor=white)](PRD.md)

> **Next.js와 MongoDB를 활용하여 대학 학칙 정보 접근성을 혁신하고 학생 간의 소통을 돕는 풀스택 모바일 웹 서비스입니다.**

---

## 1. 💡 핵심 가치 및 목표

UniMate는 복잡한 대학 학칙을 **생성형 AI (RAG)** 를 통해 쉽고 빠르게 해석하고, 학생들끼리 자유롭게 정보를 공유할 수 있는 **커뮤니티 플랫폼**을 제공하는 것을 목표로 합니다.

---

## 2. ⚙️ 주요 기술 스택

| 분류 | 기술/도구 | 상세 역할 |
| :--- | :--- | :--- |
| **풀스택** | Next.js 14 (App Router) / TypeScript | 모바일 웹 최적화 UI 및 서버리스 API 구축 |
| **Database** | MongoDB Atlas / Mongoose | 커뮤니티 게시글, 댓글, 채팅 세션, 시간표, 알림 데이터 저장 |
| **AI RAG** | OpenAI API (`gpt-4o-mini`) | Google Sheets에서 로드된 학칙 기반 질의응답 엔진 및 스트리밍 응답 |
| **Data Source** | Google Sheets API | 학칙 원문 데이터 로드 및 사용자 계정 정보 저장/관리 (CMS 역할) |
| **인증/보안** | Google Sheets & `bcryptjs` / `nodemailer` | 회원가입, 로그인, 프로필 관리, 비밀번호 재설정 (이메일 인증코드) |
| **스타일링/UX** | Tailwind CSS / Custom Dark Mode | Dark Mode, Global Toast/Confirm 모달, 모바일 최적화 레이아웃 |

---

## 3. ✨ 주요 구현 기능

### 3.1. 🤖 AI 학칙 챗봇 (RAG)
* **다중 학교 지원:** 사용자가 설정한 학교에 따라 해당 학교의 학칙 데이터만 로드하여 답변합니다.
* **채팅 기록 관리:** 대화 세션 및 메시지를 MongoDB에 저장하고, 사이드바를 통해 불러오거나 삭제할 수 있습니다.
* **사용자 경험:** Vercel AI SDK를 활용한 스트리밍 답변과 AI 답변에 대한 피드백 전송 기능이 구현되어 있습니다.

### 3.2. 👥 학생 커뮤니티 (Full CRUD)
* **게시글/댓글 관리:** 글 작성, 수정, 삭제, **이미지 첨부 (최대 5장)**, 댓글 작성/수정/삭제 등 모든 CRUD 기능을 제공합니다.
* **고급 필터링/검색:** 카테고리별 필터링, **로그인한 사용자의 학교 기준 필터링 ('내 학교'/'전체 학교')**, 제목/내용 기반 검색을 지원합니다.
* **반응 및 알림:** 게시글 **좋아요** 기능과 함께, 새로운 댓글/좋아요 발생 시 **게시글 작성자에게 알림**을 생성하고 관련 페이지로 연결합니다.
* **권한 관리:** 게시글/댓글 수정 및 삭제는 작성자 본인만 가능하도록 API 레벨에서 엄격하게 검증합니다.

### 3.3. 👤 사용자 및 개인화
* **비밀번호 재설정:** 이메일로 6자리 인증 코드를 발송하고, 이를 통해 안전하게 비밀번호를 재설정할 수 있습니다.
* **활동 통계:** 프로필 페이지에서 사용자가 작성한 **글 수, 댓글 수, 좋아요 수** 등의 활동 통계를 조회할 수 있습니다.
* **시간표 관리:** 개인 **시간표**를 추가, 수정, 삭제하여 관리할 수 있는 페이지와 API가 구현되어 있습니다.

---

## 4. 🖥️ UI/UX 특징 (Mobile-First Polish)

* **반응형 레이아웃:** 모바일 환경에 최적화된 컨테이너형 레이아웃과 하단 고정 탭 바 (`TabBar`)를 제공합니다.
* **Dark Mode:** 사용자의 OS 설정에 따라 자동으로 테마가 적용되며, 토글 버튼으로 수동 전환이 가능합니다.
* **고도화된 UX 컴포넌트:**
    * **Global Modal & Toast:** `sonner`를 사용한 부드러운 전역 Toast 알림과 `confirm` 모달을 통해 사용자 경험을 개선했습니다.
    * **Pull-to-Refresh:** 커뮤니티 목록에서 화면을 당겨 새로고침하는 모바일 네이티브와 유사한 기능을 지원합니다.
    * **Scroll-to-Top:** 스크롤 시 화면 우측 하단에 '맨 위로' 버튼이 나타나 편리한 이동을 돕습니다.
    * **Error Boundaries:** 예외 발생 시 친절한 에러 메시지와 '다시 시도' 버튼을 제공하는 UI를 구현했습니다.

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
