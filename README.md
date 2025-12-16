# 개인 연습 - Guest Book App

Spring Boot와 Next.js를 활용한 풀스택 방명록 CRUD

---

## 프로젝트 개요

- **백엔드**: Spring Boot 기반 RESTful API
- **프론트엔드**: Next.js 기반 웹 인터페이스
- **데이터베이스**: MySQL 8.0

---

## 프로젝트 구조

```
guest-book-app/
├── backend/              # Spring Boot 백엔드
│   ├── src/
│   ├── Dockerfile
│   ├── build.gradle
│   └── README.md
│ 
├── frontend/             # Next.js 프론트엔드
│   ├── app/
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
│ 
├── docker-compose.yml    # Docker Compose 설정
│ 
├── docs/                 # 프로젝트 문서 모음
│   ├── 01-project-design.md
│   ├── 02-api-spec.md
│   ├── 03-docker.md
│   ├── 04-deploy.md
│   ├── 05-cicd.md
│   └── 06-retrospective.md
│ 
└── README.md
```

---

## 관련 기술 스택

### Backend
- Java 21
- Spring Boot 4.0.0
- Spring Data JPA
- MySQL 8.0
- Gradle

### Frontend
- Next.js
- React
- Tailwind CSS

### Infrastructure
- Docker
- Docker Compose

---

## 시작하기

### 백엔드 실행

백엔드 관련 상세 정보는 [backend/README.md](./backend/README.md) 참고

```bash
cd backend
./gradlew bootRun
```

### 프론트엔드 실행

프론트엔드 관련 상세 정보는 [frontend/README.md](./frontend/README.md) 참고

```bash
cd frontend
npm install
npm run dev
```

---

## docs 문서

프로젝트 관련 상세 문서는 `docs/` 폴더를 참고

- **프로젝트 설계**: [docs/01-project-design.md](./docs/01-project-design.md)
- **API 명세서**: [docs/02-api-spec.md](./docs/02-api-spec.md)
- **Docker 구성**: [docs/03-docker.md](./docs/03-docker.md)
- **AWS 배포**: [docs/04-deploy.md](./docs/04-deploy.md)
- **CI/CD 자동화**: [docs/05-cicd.md](./docs/05-cicd.md)
- **회고 문서**: [docs/06-retrospective.md](./docs/06-retrospective.md)

---

## 프로젝트 일정

- **1일차**: 애플리케이션 개발 & 로컬 통합
- **2일차**: 컨테이너화 & AWS 배포
- **3일차**: CI/CD 설정 & 문서 정리

---

## 보안 관련

- `application.yml` 및 민감한 설정 파일은 `.gitignore`에 포함
- 환경 변수 및 비밀번호는 각자의 로컬 환경에서 설정
