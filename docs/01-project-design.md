# 프로젝트 설계

## 1. 서비스 설명

- 사용자가 방명록을 작성, 조회, 수정, 삭제할 수 있는 웹 애플리케이션
- Docker Compose를 통한 컨테이너 기반 배포
- GitHub Actions를 통한 CI/CD 자동화

---

## 2. 전체 흐름

```bash
사용자 요청
    ↓
[프론트엔드] Next.js (포트 3000)
    ├─ UI 렌더링 및 사용자 인터랙션 처리
    ├─ API 요청 생성 (GET/POST/PUT/DELETE)
    └─ next.config.mjs의 rewrites를 통해 백엔드로 프록시
    ↓
[백엔드] Spring Boot (포트 8080)
    ├─ REST API 엔드포인트 처리 (/api/guestbooks)
    ├─ 비즈니스 로직 실행 (GuestBookService)
    ├─ 데이터 검증 및 보안 처리 (비밀번호 검증)
    └─ JPA를 통한 데이터베이스 접근
    ↓
[데이터베이스] MySQL (포트 3306)
    └─ 방명록 데이터 영구 저장
    ↓
응답 반환
    ↓
[프론트엔드] 데이터 표시 및 UI 업데이트
```

1. **방명록 조회**
   - 접속 → 백엔드 API (`[GET] /api/guestbooks`) 
   - → mysql 조회 → 응답 반환 → 화면 목록 표시

2. **방명록 등록**
   - 사용자 입력 → 프론트엔드 검증 → 백엔드 API (`[POST] /api/guestbooks`) 
   - → mysql 저장 → 성공 응답 → 화면 목록 갱신

3. **방명록 수정/삭제**
   - 버튼 액션 → 비밀번호 입력 → 백엔드 API (`[PUT] [DELETE] /api/guestbooks/{id}`) 
   - → 비밀번호 검증 → mysql 업데이트/삭제 → 응답 반환 → 화면 목록 갱신

---

## 3. 프론트엔드 역할

### UI/UX 담당

- **화면 렌더링**: Next.js App Router를 통한 페이지 렌더링
- **사용자 인터랙션**: 버튼 클릭, 폼 입력, 수정/삭제 모달 처리
- **스타일링**: Tailwind CSS를 통한 디자인 구현 (support: cursor AI)

### 데이터 처리

- **API 통신**: `guestBookApi.js`를 통한 백엔드 API 호출
- **상태 관리**: React `useState`를 통한 방명록 목록 및 로딩/에러 상태 관리
- **데이터 정렬**: 프론트엔드에서 `createdAt` 기준 내림차순 정렬 (최신순 표시)

### 프록시 및 라우팅

- **API 프록시**: `next.config.mjs`의 `rewrites`를 통해 `/api/*` 요청을 백엔드로 전달
  - 로컬: `http://localhost:8080/api/*`
  - Docker: `http://backend:8080/api/*` (docker 컴포즈 내 서비스명)

### 데이터 검증

- **입력값 검증**: 작성자명, 비밀번호, 내용의 필수값 및 길이 제한 검증
- **에러 처리**: API 에러 메시지를 사용자 친화적으로 표시

---

## 4. 백엔드 역할

### API 엔드포인트 제공
- **RESTful API**:
  - `/api/guestbooks` 경로로 CRUD 엔드포인트 제공
  - `GET /api/guestbooks`: 전체 조회
  - `POST /api/guestbooks`: 등록
  - `PUT /api/guestbooks/{id}`: 수정
  - `DELETE /api/guestbooks/{id}`: 삭제

### 비즈니스 로직 처리
- **데이터 검증**: 요청 데이터의 유효성 검사
- **보안 처리**: 수정/삭제 시 비밀번호 검증
- **트랜잭션 관리**: `@Transactional`을 통한 관리

### 데이터베이스 연동
- **JPA**: 엔티티와 데이터베이스 테이블 매핑
- **데이터 처리**: 방명록 데이터의 CRUD 처리
- **생성시간 데이터**: `created_at` 컬럼 추가하여 생성시 `localDateTime.now()` 기록
    - 컴포즈 내 `TZ: Asia/Seoul` 환경변수 추가하여 서울시간 대 지정함

### CORS 설정
- **크로스 오리진 허용**: 프론트엔드 도메인에 대한 CORS 설정
  - 로컬: `http://localhost:3000`
  - 배포: 환경변수 `CORS_ALLOWED_ORIGINS`로 제어

### 응답 데이터 변환
- **DTO 변환**: 엔티티를 `GuestBookResponseDTO`로 변환하여 클라이언트에 전달
- **날짜 포맷팅**: `createdAt`을 `yyyy-MM-dd HH:mm:ss` 형식으로 변환

---

## 5. 배포 구조 요약

### 로컬 환경

```bash
PC
├─ Docker Desktop (Windows)
│   ├─ MySQL 컨테이너 (포트 3306)
│   ├─ Backend 컨테이너 (포트 8080)
│   └─ Frontend 컨테이너 (포트 3000)
│   
├─ docker-compose.yml (로컬용)
└─ .env (로컬용 환경변수)
```

**구조 요약**
- `docker-compose.yml`에서 `build: ./backend`, `build: ./frontend`로 로컬 빌드
- `.env` 파일로 환경변수 관리 (로컬 전용)
- 프론트엔드 `next.config.mjs`에서 `isLocal` 플래그로 로컬/도커 구분
- 백엔드 `application.yml`에 로컬 DB 연결 정보 포함

### 배포 환경 (EC2)

```bash
AWS EC2
├─ Docker & Docker Compose
│   ├─ MySQL 컨테이너 (포트 3306)
│   ├─ Backend 컨테이너 (포트 8080) ← Docker Hub 이미지 
│   └─ Frontend 컨테이너 (포트 3000) ← Docker Hub 이미지
│   
└─ ec2/docker-compose.yml (배포용)
└─ ec2/.env (배포용 환경변수)
```

**구조 요약**
- `ec2/docker-compose.yml`에서 `image: <계정>/<이미지명>:latest` 형태로 이미지 사용
- 빌드는 GitHub Actions에서 수행 후 Docker Hub에 푸시
- EC2에서는 `docker-compose pull`로 최신 이미지 다운로드
- `ec2/.env` 파일로 배포 환경변수 관리 (EC2 서버에 직접 배치)
- 백엔드는 환경변수(`SPRING_DATASOURCE_URL` 등)로 DB 연결 정보 주입
- `application.yml`은 `.gitignore`에 포함되어 Git에 커밋되지 않음

### CI/CD 파이프라인

```bash
GitHub Repository (main 브랜치 push)
    ↓
GitHub Actions 워크플로우 실행
    ├─ Backend Docker 이미지 빌드
    ├─ Frontend Docker 이미지 빌드
    ├─ Docker Hub에 이미지 푸시
    └─ EC2 서버에 SSH 접속
        ├─ docker-compose pull (최신 이미지 다운로드)
        └─ docker-compose up -d (컨테이너 재시작)
```

**차이점 요약**

| 항목 | 로컬 환경 | 배포 환경 (EC2) |
|------|----------|----------------|
| **이미지 빌드** | 로컬에서 `docker-compose up -d --build` | GitHub Actions에서 빌드 후 Docker Hub 푸시 |
| **이미지 사용** | 로컬 빌드 이미지 | Docker Hub에서 `pull`한 이미지 |
| **설정 파일** | `application.yml` 사용 가능 | 환경변수로만 설정 (`.gitignore`로 보호된 상태) |
| **접속 주소** | `localhost:3000` | `http://<퍼블릭IP주소>:3000` |
| **CORS 설정** | `http://localhost:3000` | 환경변수 `CORS_URL`로 동적 설정 |


**Q.** `.gitignore`에 `application.yml` 보호상태인데 CI/CD 가능한 이유

- 깃허브 액션 시 해당 파일이 `.gitignore`에 등록된 상태면 알 수 없지만
- 배포 시에 EC2 서버에 있는 `docker-compose.yml` 기준으로 `.env` 환경 변수를 찾음
- SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME 등 해당 환경 변수값을 얻어서 대체
- 즉, 배포 시 `application.yml` 없어도 가능