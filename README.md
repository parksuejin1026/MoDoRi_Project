# 🏫 UniMate: 학칙 기반 AI 챗봇 및 학생 커뮤니티

[![Deploy with Vercel](https://img.shields.io/badge/Vercel-Project_App-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://mo-do-ri-project.vercel.app/)
[![PRD Docs](https://img.shields.io/badge/Document-PRD-blue?style=for-the-badge&logo=markdown&logoColor=white)](PRD.md)

> **Next.js와 MongoDB를 활용하여 대학 학칙 정보 접근성을 혁신하고 학생 간의 소통을 돕는 풀스택 모바일 웹 서비스입니다.**

---


제공해주신 프로젝트 파일들(PRD, Architecture, Deployment 문서 및 소스 코드)을 바탕으로, **UniMate** 프로젝트의 `README.md`를 전문적이고 상세하게 다시 작성해 드립니다.

이 내용은 깃허브나 포트폴리오에 바로 사용할 수 있도록 **프로젝트 소개, 기술 스택, 주요 기능, 설치 방법, 폴더 구조** 등을 체계적으로 정리했습니다.

-----

# 🎓 UniMate (유니메이트)

[](https://mo-do-ri-project.vercel.app/)
[](https://nextjs.org/)
[](https://www.typescriptlang.org/)
[](https://tailwindcss.com/)
[](https://www.mongodb.com/)

> **대학 생활의 모든 것, 내 손안의 AI 학칙 비서 & 커뮤니티** \> 복잡한 학칙을 AI에게 물어보고, 우리 학교 학생들과 자유롭게 소통하세요.

## 📖 프로젝트 개요

**UniMate**는 대학생들이 겪는 정보 접근성의 어려움을 해결하기 위해 개발된 **모바일 퍼스트 웹 애플리케이션**입니다.  
**RAG(Retrieval-Augmented Generation)** 기술을 활용하여 학교별 학칙 데이터를 기반으로 정확한 답변을 제공하는 **AI 챗봇**과, 학생들 간의 정보 공유를 위한 **익명 커뮤니티**, **시간표 관리** 기능을 통합하여 제공합니다.

-----

## 🛠️ 기술 스택 (Tech Stack)

| 분류 | 기술 / 라이브러리 | 설명 |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14 (App Router)** | React 기반 풀스택 프레임워크 |
| **Language** | **TypeScript** | 정적 타입 지정을 통한 안정적인 개발 환경 |
| **Styling** | **Tailwind CSS** | 유틸리티 퍼스트 CSS 프레임워크 |
| **Database** | **MongoDB Atlas** (Mongoose) | 게시글, 댓글, 채팅 기록, 알림, 시간표 데이터 저장 |
| **CMS / Auth DB** | **Google Sheets API** | 사용자 계정 관리 및 학교별 학칙 데이터 원본 관리 |
| **AI / LLM** | **OpenAI API (GPT-4o-mini)** | Vercel AI SDK를 활용한 스트리밍 챗봇 구현 |
| **Authentication** | `bcryptjs`, `nodemailer` | 비밀번호 암호화 및 이메일 인증 기반 비밀번호 재설정 |
| **Deployment** | **Vercel** | CI/CD 및 호스팅 |

-----

## ✨ 주요 기능 (Key Features)

### 🤖 1. AI 학칙 챗봇 (Rule-Look)

  * **맞춤형 RAG 엔진**: 사용자가 설정한 학교에 따라 Google Sheets에서 해당 학교의 최신 학칙 데이터를 로드하여 답변합니다.
  * **실시간 스트리밍**: Vercel AI SDK를 활용하여 타자기처럼 실시간으로 답변이 생성됩니다.
  * **대화 기록 관리**: 모든 대화 내용은 MongoDB에 저장되며, 사이드바에서 이전 대화를 불러오거나 삭제할 수 있습니다.
  * **피드백 시스템**: 답변에 대해 '좋아요/싫어요' 피드백을 남겨 품질을 개선할 수 있습니다.

### 👥 2. 학생 커뮤니티

  * **게시판 기능**: 게시글 작성(이미지 첨부 최대 5장), 수정, 삭제가 가능하며 카테고리(질문/정보/자유)별로 분류됩니다.
  * **학교 필터링**: '내 학교' 글만 모아보거나 '전체 학교' 글을 탐색할 수 있는 필터를 제공합니다.
  * **소통 기능**: 댓글 및 대댓글(답글) 작성, 게시글 좋아요 기능을 지원합니다.
  * **알림 센터**: 내 글에 댓글이 달리거나 좋아요가 눌리면 실시간에 가까운 알림을 받고 해당 글로 이동할 수 있습니다.

### 👤 3. 사용자 편의 기능

  * **시간표 관리**: 이번 학기 시간표를 시각적으로 추가하고 관리할 수 있습니다.
  * **회원 활동 통계**: 마이페이지에서 내가 쓴 글, 댓글, 받은 좋아요 수를 한눈에 확인할 수 있습니다.
  * **보안 인증**: 이메일 인증 코드를 통한 안전한 비밀번호 재설정 기능을 제공합니다.
  * **다크 모드**: 시스템 설정 또는 사용자 선택에 따라 라이트/다크 모드를 완벽하게 지원합니다.

-----

## 📱 UI/UX 특징

이 프로젝트는 \*\*모바일 사용자 경험(Mobile-First)\*\*에 최적화되어 있습니다.

  * **App-like Layout**: 모바일 화면 꽉 찬 레이아웃과 하단 고정 탭 바(`TabBar`)를 통해 네이티브 앱과 유사한 경험을 제공합니다.
  * **Pull-to-Refresh**: 커뮤니티 목록을 당겨서 새로고침할 수 있습니다.
  * **Toast & Modal**: `sonner`를 활용한 부드러운 토스트 알림과 직관적인 확인 모달을 전역으로 사용합니다.
  * **Interactive Elements**: 스크롤 시 나타나는 '맨 위로 가기' 버튼, 로딩 스켈레톤 UI 등을 적용하여 사용성을 높였습니다.

-----

## 🛠️ 설치 및 실행 방법

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


## 📂 폴더 구조 (Project Structure)

```
.
├── app/                    # Next.js App Router (페이지 및 API)
│   ├── api/                # Backend API (Auth, Chat, Community, etc.)
│   ├── chat/               # 챗봇 페이지
│   ├── community/          # 커뮤니티 페이지 (목록, 상세, 작성)
│   ├── profile/            # 프로필 및 설정 페이지
│   ├── timetable/          # 시간표 페이지
│   └── ...
├── components/             # 재사용 가능한 UI 컴포넌트
│   ├── ChatInterface.tsx   # 챗봇 UI 로직
│   ├── GlobalModal.tsx     # 전역 모달 컨텍스트
│   └── ...
├── context/                # React Context (테마 등)
├── lib/                    # 유틸리티 함수 및 외부 서비스 연동
│   ├── db/                 # MongoDB 연결 및 스키마
│   ├── google-sheet-*.ts   # 구글 시트 인증 및 데이터 로더
│   └── nodemailer.ts       # 이메일 발송 유틸
└── public/                 # 정적 파일 (이미지, 아이콘)
```
