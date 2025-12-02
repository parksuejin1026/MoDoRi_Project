# 🏗️ 시스템 아키텍처 (System Architecture)

## 1. 시스템 개요 (System Overview)
UniMate는 **Next.js 14 (App Router)** 기반의 풀스택 웹 애플리케이션으로, **MongoDB**를 메인 데이터베이스로 사용하고 **OpenAI API**와 **Google Sheets API**를 활용하여 AI 챗봇 서비스를 제공합니다.

### 🏛️ High-Level Architecture
```mermaid
graph TD
    User[사용자 (Mobile Web)]
    
    subgraph "Frontend (Next.js)"
        UI[UI Components]
        State[Client State]
    end
    
    subgraph "Backend (Next.js API Routes)"
        AuthAPI[Auth API]
        ChatAPI[Chat API (RAG)]
        CommunityAPI[Community API]
    end
    
    subgraph "External Services"
        MongoDB[(MongoDB Atlas)]
        OpenAI[OpenAI API (GPT-4o)]
        GSheets[Google Sheets API]
    end

    User --> UI
    UI --> AuthAPI
    UI --> ChatAPI
    UI --> CommunityAPI
    
    AuthAPI --> MongoDB
    AuthAPI --> GSheets
    
    ChatAPI --> OpenAI
    ChatAPI --> GSheets
    ChatAPI --> MongoDB
    
    CommunityAPI --> MongoDB
```

---

## 2. 기술 스택 (Tech Stack)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (via shadcn/ui pattern), Sonner (Toast), Lucide React (Icons)
- **State Management**: React Context API (AuthContext, etc.)

### Backend
- **Runtime**: Node.js (Next.js Server Actions & API Routes)
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: Custom Auth (Bcryptjs + JWT/Session logic), Nodemailer (Email Verification)
- **AI Engine**: OpenAI API (`gpt-4o-mini`)
- **CMS/Data Source**: Google Sheets API (학칙 데이터 및 사용자 계정 관리)

---

## 3. 데이터 흐름 (Data Flow)

### 🤖 AI 챗봇 (RAG Flow)
1. 사용자가 질문을 입력합니다.
2. `ChatAPI`가 요청을 수신하고, 사용자의 학교 정보를 확인합니다.
3. **Google Sheets API**를 통해 해당 학교의 학칙 데이터를 가져옵니다 (Caching 적용).
4. 학칙 데이터와 사용자 질문을 프롬프트로 구성하여 **OpenAI API**에 전송합니다.
5. AI의 응답을 스트리밍(Streaming) 방식으로 사용자에게 전달합니다.
6. 대화 내용은 **MongoDB**에 `ChatSession` 및 `ChatMessage`로 저장됩니다.

### 👥 커뮤니티 (Community Flow)
1. 사용자가 게시글/댓글을 작성합니다.
2. `CommunityAPI`에서 사용자 세션을 검증합니다.
3. **MongoDB**의 `Post` 또는 `Comment` 컬렉션에 데이터를 저장합니다.
4. 필요 시 `Notification` 컬렉션에 알림 데이터를 생성합니다.

---

## 4. 디렉토리 구조 (Directory Structure)
```
MoDoRi_Project/
├── app/                  # Next.js App Router 페이지 및 API
│   ├── api/              # Backend API Routes
│   ├── community/        # 커뮤니티 관련 페이지
│   ├── profile/          # 프로필 페이지
│   └── ...
├── components/           # 재사용 가능한 UI 컴포넌트
├── lib/                  # 유틸리티 함수 및 DB 연결 설정
│   ├── db.ts             # MongoDB 연결
│   ├── googleSheets.ts   # Google Sheets API 연동
│   └── ...
├── models/               # Mongoose 스키마 정의 (Post, User 등)
├── public/               # 정적 파일 (이미지 등)
└── ...
```
