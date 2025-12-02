# 📡 API 명세서 (API Reference)

## 1. AI Chatbot API

### `POST /api/chat/[schoolCode]`
AI 챗봇과 대화를 진행합니다.

- **Parameters**
  - `schoolCode` (path): 학교 코드 (예: `dongyang`)
- **Request Body**
  ```json
  {
    "messages": [
      { "role": "user", "content": "휴학 신청 기간 알려줘" }
    ],
    "sessionId": "optional_session_id"
  }
  ```
- **Response**
  - `Streaming Text`: AI의 응답이 스트리밍으로 전송됩니다.

---

## 2. Community API

### `GET /api/community`
게시글 목록을 조회합니다.

- **Query Parameters**
  - `page`: 페이지 번호 (기본: 1)
  - `limit`: 페이지 당 개수 (기본: 10)
  - `category`: 카테고리 필터
  - `school`: `true`일 경우 내 학교 글만 조회
  - `search`: 검색어
- **Response**
  ```json
  {
    "posts": [ ... ],
    "totalPages": 5,
    "currentPage": 1
  }
  ```

### `POST /api/community`
새로운 게시글을 작성합니다.

- **Request Body**
  ```json
  {
    "title": "게시글 제목",
    "content": "게시글 내용",
    "category": "자유",
    "images": ["base64_string_or_url"]
  }
  ```

### `GET /api/community/[postId]`
게시글 상세 내용을 조회합니다.

---

## 3. Auth API

### `POST /api/auth/login`
사용자 로그인을 처리합니다.

- **Request Body**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### `POST /api/auth/register`
신규 회원가입을 처리합니다.

- **Request Body**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "홍길동",
    "schoolCode": "dongyang"
  }
  ```
