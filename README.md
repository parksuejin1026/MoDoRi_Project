# 🏫 Rule-Look: 학교 학칙 기반 AI 통합 서비스

> 학칙을 쉽고 빠르게 검색하고, 학생 커뮤니티에서 정보를 공유하세요.

## 🚀 프로젝트 개요 (Project Overview)

Rule-Look은 학교 학칙에 대한 학생들의 접근성을 높이고, 관련된 정보를 손쉽게 검색 및 공유할 수 있도록 돕는 웹 서비스입니다. Next.js의 서버 컴포넌트(Server Components)와 MongoDB를 활용하여 빠르고 안정적인 데이터 처리를 목표로 합니다.

## ✨ 주요 구현 기능 (Key Features)

| 기능 | 내용 | 구현 상태 |
| :--- | :--- | :--- |
| **커뮤니티 CRUD** | 게시글 작성, 목록 조회, 상세 조회, 수정, 삭제 기능 | ✅ 완성 |
| **라우팅 안정화** | Next.js의 동적 경로(Dynamic Routes)와 정적 경로 충돌 문제 해결 | ✅ 완성 |
| **API 구축** | MongoDB 기반의 RESTful API (POST, GET, PUT, DELETE) | ✅ 완성 |
| 학칙 검색 (AI) | 업로드된 학칙 PDF 기반의 질문-응답 기능 | ⏳ 진행 예정 |

## 🛠️ 기술 스택 (Tech Stack)

| 구분 | 기술 스택 | 설명 |
| :--- | :--- | :--- |
| **Frontend/Framework** | Next.js 14 (App Router) | React 기반의 서버/클라이언트 하이브리드 프레임워크 |
| **Language** | TypeScript | 안정적인 타입 관리 및 개발 생산성 향상 |
| **Database** | MongoDB / Mongoose | 유연한 NoSQL 데이터베이스 및 객체 모델링 도구 |
| **Styling** | Custom CSS (or Tailwind CSS) | 반응형 웹 디자인 및 UI 구성 |

## 📁 주요 폴더 구조 및 역할

프로젝트의 핵심 기능인 커뮤니티와 API를 담당하는 폴더의 역할은 다음과 같습니다.
