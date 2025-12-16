# 방명록 애플리케이션 백엔드

Spring Boot 기반의 방명록 API

## 프로젝트 개요

사용자가 방명록을 작성, 조회, 수정, 삭제할 수 있는 RESTful API를 제공

## 기술 스택

- **Java 21**
- **Spring Boot 4.0.0**
- **Spring Data JPA**
- **MySQL 8.0**
- **Lombok**
- **Gradle**

## 프로젝트 구조

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── org/example/backend/
│   │   │       ├── BackendApplication.java
│   │   │       ├── controller/
│   │   │       │   └── GuestController.java      # REST API 컨트롤러
│   │   │       ├── service/
│   │   │       │   └── GuestBookService.java     # 비즈니스 로직
│   │   │       ├── repository/
│   │   │       │   └── GuestBookRepository.java  # 데이터 접근 레이어
│   │   │       ├── entity/
│   │   │       │   └── GuestBook.java            # 엔티티
│   │   │       └── dto/
│   │   │           ├── GuestBookRequestDTO.java  # 요청 DTO
│   │   │           └── GuestBookResponseDTO.java # 응답 DTO
│   │   └── resources/
│   │       └── application.yml                   # 설정 파일
│   └── test/
└── build.gradle
```

## 🔧 환경 설정

### application 설정

`application.yml`에서 데이터베이스 연결 및 JPA 설정

```yaml
spring:
  application:
    name: backend

  datasource:
    url: jdbc:mysql://localhost:3306/guestdb?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Seoul
    username: <접속계정id입력>
    password: <접속계정pw입력>
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
      show-sql: true
    properties:
      hibernate:
        format_sql: true

server:
  port: 8080
```

### MySQL 컨테이너 실행 (Docker) - local 기준

```bash
docker run -d \
  --name guest-mysql \
  -e MYSQL_ROOT_PASSWORD=<root비밀번호> \
  -e MYSQL_DATABASE=guestdb \
  -e MYSQL_USER=<user명> \
  -e MYSQL_PASSWORD=<user비밀번호> \
  -p 3306:3306 \
  --restart unless-stopped \
  mysql:8.0
```

## 실행 방법

1. **프로젝트 클론**

```bash
git clone <repository-url>
cd guest-app/backend
```

2. **애플리케이션 실행**

```bash
./gradlew bootRun
```
   
- 또는 IntelliJ에서 `BackendApplication.java`를 실행

3. **서버 접속**
   - 서버 포트: `http://localhost:8080`

## API 엔드포인트

### 기본 URL

```
http://localhost:8080/api/guestbooks
```

### 1. 방명록 전체 조회

- **Method**: `GET`
- **URL**: `/api/guestbooks`
- **Response**: 방명록 목록 (JSON)

### 2. 방명록 등록

- **Method**: `POST`
- **URL**: `/api/guestbooks`
- **Request Body**:
  ```json
  {
    "nickName": "홍길동",
    "password": "1234",
    "content": "방명록 내용입니다."
  }
  ```

### 3. 방명록 수정

- **Method**: `PUT`
- **URL**: `/api/guestbooks/{id}`
- **Request Body**:
  ```json
  {
    "nickName": "홍길동",
    "password": "1234",
    "content": "수정된 내용입니다."
  }
  ```

### 4. 방명록 삭제

- **Method**: `DELETE`
- **URL**: `/api/guestbooks/{id}?password={password}`
- **예시**: `/api/guestbooks/1?password=1234`

## API 테스트 파일

IntelliJ의 HTTP 통한 API 테스트

```bash
# 테스트 파일 위치
backend/guestbook-api-test.http
```

IntelliJ에서 해당 파일 오픈 후 각 요청 옆 (▶) 실행

## 📝 주요 기능

- ✅ 방명록 CRUD 기능
- ✅ 비밀번호 기반 수정/삭제 보안
- ✅ CORS 설정 (프론트엔드 연동 지원)
- ✅ JPA를 통한 데이터베이스 연동

## CORS 

- 현재 CORS는 `http://localhost:3000` (프론트엔드)만 허용중


