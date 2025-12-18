# 방명록 애플리케이션 프론트엔드

Next.js 기반의 방명록 웹 UI

## 프로젝트 개요

방명록 애플리케이션의 백엔드(`Spring Boot` API)와 연동하여<br>
동작하는 프론트엔드 SPA

## 기술 스택

- **Next.js (App Router)**
- **React**
- **JavaScript (ES6+)**
- **Tailwind CSS**
- **Docker**

## 프로젝트 구조

```text
frontend/
├── src/
│   ├── app/
│   │   ├── layout.js                 # 공통 레이아웃
│   │   ├── page.js                   # 메인 페이지
│   │   └── guestbooks/
│   │       ├── page.js               # 방명록 목록 페이지
│   │       ├── new/
│   │       │   └── page.js           # 방명록 작성 페이지
│   │       └── components/
│   │           ├── GuestBookList.js      # 방명록 리스트 컴포넌트
│   │           ├── GuestBookItem.js      # 방명록 단건 아이템
│   │           └── GuestBookAddForm.js   # 방명록 작성 폼
│   ├── components/
│   │   └── layout/                   # Header, Footer, Main 등 레이아웃 컴포넌트
│   └── assets/
│       ├── api/
│       │   └── guestBookApi.js       # 백엔드 연동 API 함수
│       └── css/                      # 전역 스타일
├── next.config.mjs                   # Next.js 설정 (프록시 등)
├── Dockerfile                        # 프론트엔드용 도커 이미지 빌드 설정
└── README.md
```

---

## 🔧 환경 설정

### 백엔드 API 연동

백엔드 API 기본 URL은 `next.config.mjs` 및 `guestBookApi.js`에서 설정

- `next.config.mjs` 내

```js
/** @type {import('next').NextConfig} */

const isLocal = process.env.NODE_ENV === 'development'; // 로컬 환경인지 확인 (단독개발시)

const nextConfig = {
  output: 'standalone',
  async rewrites() { // 리라이트 설정 (실제 요청 주소만 변경)
    return [
      {
        // source : 프론트에서 쓰는 api 주소 형태 정의
        source: '/api/:path*',
        // destination : 실제 요청을 처리하는 백엔드 주소
        destination: isLocal
          ? 'http://localhost:8080/api/:path*'
          : 'http://backend:8080/api/:path*', // 도커 컴포즈 내 서비스명
      },
    ];
  },
};

export default nextConfig;
```

- `src/assets/api/guestBookApi.js` 내

```js
const API_URL = '/api/guestbooks';
```

### 스타일

- `src/app/globals.css` 및 `src/assets/css` 하위 파일들에서 전역 스타일 정의
- 왠만한 스타일은 `Tailwind CSS` 유틸리티 클래스로 구현

## 실행 방법

### 1. 의존성 설치

```bash
cd frontend
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

- 브라우저에서 `http://localhost:3000` 으로 접속하면 개발용 UI를 확인할 수 있음
- 백엔드가 로컬에서 실행 중이라면 방명록 CRUD 기능을 전체 테스트 가능

### 3. 빌드 & 프러덕션 실행

```bash
npm run build
npm start
```

---

## Docker 실행 (옵션)

- 프론트엔드만 도커로 실행할 경우:

```bash
cd frontend
docker build -t guest-book-frontend .
docker run -d \
  --name guest-frontend \
  -p 3000:3000 \
  guest-book-frontend
```

- sql, backend, frontend 같이 실행할 경우
- 최상위 [README.md](./README.md) 참고



---

## 주요 화면 및 기능

- **방명록 목록 조회**
  - `/guestbooks` 경로에서 전체 방명록 목록을 조회
  - 최신 작성 순(내림차순) 정렬 표시
- **방명록 작성**
  - `/guestbooks/new` 경로에서 작성 가능
  - 작성자, 비밀번호, 내용을 입력하여 등록
- **방명록 수정**
- **방명록 삭제**

## 기타

### 프론트엔드 CORS 관련 설정

- `application.yml` 및 `docker-compose.yml` 의 `CORS_ALLOWED_ORIGINS` 환경변수로 제어중

