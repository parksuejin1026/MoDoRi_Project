# 🚀 배포 및 설치 가이드 (Deployment Guide)

## 1. 로컬 개발 환경 설정 (Local Development)

### 필수 요구사항
- Node.js 18.17.0 이상
- npm 또는 yarn, pnpm

### 설치 단계
1. **저장소 클론 (Clone Repository)**
   ```bash
   git clone https://github.com/parksuejin1026/MoDoRi_Project.git
   cd MoDoRi_Project
   ```

2. **패키지 설치 (Install Dependencies)**
   ```bash
   npm install
   ```

3. **환경 변수 설정 (Environment Variables)**
   프로젝트 루트에 `.env.local` 파일을 생성하고 아래 변수들을 설정해야 합니다.
   
   ```env
   # MongoDB
   MONGODB_URI=mongodb+srv://...
   
   # OpenAI
   OPENAI_API_KEY=sk-...
   
   # Google Sheets
   GOOGLE_SERVICE_ACCOUNT_EMAIL=...
   GOOGLE_PRIVATE_KEY=...
   GOOGLE_SHEET_ID=...
   
   # Auth (JWT Secret)
   JWT_SECRET=your_secret_key
   
   # Email (Nodemailer)
   EMAIL_USER=...
   EMAIL_PASS=...
   ```

4. **개발 서버 실행 (Run Dev Server)**
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.

---

## 2. 배포 (Deployment)

### Vercel 배포 (권장)
이 프로젝트는 Next.js로 제작되어 Vercel에 최적화되어 있습니다.

1. GitHub 저장소를 Vercel에 연결합니다.
2. Vercel 대시보드에서 **Environment Variables**에 위에서 설정한 `.env.local` 값들을 모두 입력합니다.
3. **Deploy** 버튼을 눌러 배포를 시작합니다.

### 빌드 및 실행 (Self-Hosting)
```bash
npm run build
npm start
```
