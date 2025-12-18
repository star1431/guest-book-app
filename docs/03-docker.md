# Docker 구성 설명

## 1. Docker를 사용하는 이유

- Docker는 작업했던 프로젝트를 다른환경에서도 동일하게 실행하기 위해 사용
- 즉 내 환경과 배포 환경의 차이로 인한 문제를 줄이기 위해서 필요

---

## 2. Backend Dockerfile 설명

```bash
# 기존 도커파일
FROM openjdk:17-jdk-slim
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

- **기존 도커파일 문제점**
  - 소스코드 복사 후 빌드하는 과정이 없음
  - 빌드된 jar 파일이 도커 이미지에 포함되지 않음

```bash
# 수정된 백엔드 도커파일
FROM gradle:8-jdk21 AS builder          # 8-jdk21 버전의 Gradle 이미지 사용
WORKDIR /app                            # 작업 디렉토리 설정
COPY build.gradle settings.gradle ./    # 빌드 설정 파일 복사
COPY gradle ./gradle                    # Gradle 래퍼 복사
COPY src ./src                          # 소스 코드 복사
RUN gradle build -x test --no-daemon    # 테스트 제외 빌드 실행 (데몬 모드 비활성화)

FROM eclipse-temurin:21-jre-alpine                  # 21-jre-alpine : 경량화된 JRE 이미지 사용
WORKDIR /app                                        # 작업 디렉토리 설정
COPY --from=builder /app/build/libs/*.jar app.jar   # 빌드된 JAR 파일 복사
ENTRYPOINT ["java", "-jar", "/app/app.jar"]         # 애플리케이션 실행
```

- **수정된 도커파일 설명**
  - 멀티스테이지 빌드를 사용하여 빌드 환경과 실행 환경을 분리
  - 첫 번째 스테이지에서 Gradle을 사용하여 소스코드를 빌드
  - 두 번째 스테이지에서 빌드된 jar 파일만 이미지로 복사


---

## 3. Frontend Dockerfile 설명

```bash
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]
```

- **기존 도커파일 문제점**
  - Next.js 13버전 이상에서는 node 18버전에서 호환성 문제가 발생 (최소 node 20버전 필요)
  - 호환성 문제로 이미지로 빌드가 안됨


```bash
# 수정된 프론트 도커파일
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]
```

- **수정된 도커파일 설명**
    - Node 20-alpine 이미지 사용으로 Next.js 13버전 이상과 호환성 문제 해결


#### 추가 문제점

- 프론트엔드 `next.config.mjs` 파일에 `output: 'standalone'` 설정이 누락되어 있었음
- 이 설정이 없으면 독립 실행형 빌드가 생성되지 않아 도커 이미지에서 실행 불가
- 해당 설정을 추가하여 문제 해결


---

## 4. docker-compose 역할

```yaml
version: '3.8'
services:
  mysql: # mysql 컨테이너 설정
    image: mysql:8.0    # mysql 8.0 이미지 사용
    environment:        # 환경 변수 설정
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:              # 포트 매핑
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:              # backend 컨테이너 설정
    build: ./backend    # backend 도커파일 위치
    ports:              # 포트 매핑
      - "8080:8080"
    depends_on:         # 의존성 설정 (mysql 컨테이너가 먼저 실행되어야 함)
      - mysql
    restart: always     # 컨테이너 재시작 설정
    environment:        # 환경 변수 설정
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/${MYSQL_DATABASE}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Seoul
      SPRING_DATASOURCE_USERNAME: ${MYSQL_USER}
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_PASSWORD}
      CORS_ALLOWED_ORIGINS: ${CORS_URL}       # 프론트 주소 CORS

  frontend:             # frontend 컨테이너 설정
    build: ./frontend   # frontend 도커파일 위치
    ports:              # 포트 매핑
      - "3000:3000"
    depends_on:         # 의존성 설정 (backend 컨테이너가 먼저 실행되어야 함)
      - backend

volumes:
  mysql_data:
```

- **docker-compose 역할**
  - MySQL, Backend, Frontend 컨테이너를 하나의 네트워크로 묶어서 관리
  - 각 서비스 간의 의존성을 정의하여 올바른 순서로 시작되도록 보장


- **환경 변수 설정**
  - 데이터베이스 접속 정보 등을 `docker-compose.yml` 파일 내 환경 변수로 설정
  - 해당 정보는 `.env` 파일에 저장하여 노출 방지 (.gitignore에 추가)

```bash
# .env 파일 예시
MYSQL_ROOT_PASSWORD=<해당값>
MYSQL_DATABASE=guestdb
MYSQL_USER=<해당값>
MYSQL_PASSWORD=<해당값>
CORS_URL=http://localhost:3000
```


---


## 5. 도커파일 작성 후 실행 과정

- 해당 프로젝트 최상위 경로로 이동 후

```bash
docker-compose up -d --build

#-- 별도로 할 경우
# 백엔드만 재빌드
docker-compose up -d --build backend
# 프론트엔드만 재빌드
docker-compose up -d --build frontend
```

- 빌드 완료시

```bash
[+] Building # ...생략
[+] Running 6/6
 ✔ guest-book-app-backend               Built    0.0s 
 ✔ guest-book-app-frontend              Built    0.0s 
 ✔ Network guest-book-app_default       Created  0.1s 
 ✔ Container guest-book-app-mysql-1     Started  3.1s 
 ✔ Container guest-book-app-backend-1   Started  3.7s 
 ✔ Container guest-book-app-frontend-1  Started  4.5s
 ```

- 도커 컴포즈 상태 확인

```bash
docker-compose ps

NAME                        IMAGE                     COMMAND                  #... 생략
guest-book-app-backend-1    guest-book-app-backend    "java -jar /app/app.…"   #... 생략
guest-book-app-frontend-1   guest-book-app-frontend   "docker-entrypoint.s…"   #... 생략
guest-book-app-mysql-1      mysql:8.0                 "docker-entrypoint.s…"   #... 생략
```

- 브라우저 확인

```bash
# 백엔드 
http://localhost:8080/api/guestbooks

# 프론트 화면
http://localhost:3000
```
