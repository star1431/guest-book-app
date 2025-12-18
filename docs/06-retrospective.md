# 프로젝트 회고

## 1. 가장 막혔던 지점

### 1.1 docker hub -> EC2 배포 및 테스트

### 1차 난관: localhost 수정 문제

**문제확인**

- 로컬에서 도커 컴포즈로 실행 후 테스트할 때는 localhost로 잘 되었음
- EC2에 배포할 때 퍼블릭 IP로 수정해야 되는데.. 매번 EC2 보내기전 코드 수정하는 번거로움 발생

**해결방안**

- backend 경우 도커컴포즈에 `CORS_ALLOWED_ORIGINS` 환경변수로 CORS 허용 도메인 설정

```yaml
# 도커컴포즈 내
    environment:
        CORS_ALLOWED_ORIGINS: ${CORS_URL}       # 프론트 주소 CORS
```

```bash
# .env 파일 내
CORS_URL=http://<퍼블릭IPv4주소>:3000
```

```yaml
# application.yml 내
cors:
  allowed-origins: http://localhost:3000
```

```java
// 컨트롤러 내
@CrossOrigin(origins = "${cors.allowed-origins:http://localhost:3000}") // 기본은 로컬, 배포 시 환경변수로 변경
public class GuestBookController { /** ... */ }
```

- frontend 경우 도커컴포즈에 환경변수로 주입할려고 했으나, 빌드시점에서 반영이 안되어서 실패
- 그래서 nextjs의 `next.config.mjs` 파일에서 설정 및 `guestBookApi.js` 수정

```javascript
// next.config.mjs
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
```

```javascript
// guestBookApi.js
// next.config.mjs 에서 설정한 주소 사용
// const API_URL = 'http://localhost:8080/api/guestbooks';
const API_URL = '/api/guestbooks';

export const getGuestBooks = async () => {
    const response = await fetch(API_URL, {});
    if (!response.ok) {}
    return response.json();
};
```

### 2차 난관: 도커 메모리 문제

- EC2 t3.micro 인스턴스는 메모리가 1GB로 부족하여 도커 컴포즈 실행시 메모리 부족으로 죽는 현상 발생
- EC2에서 쓰이는 `docker-compose.yml` 파일에서 MySQL 메모리 제한 및 최적화 옵션 추가로 문제 해결

* [ec2 폴더 참고](./../ec2/README.md)


## 2. 이해가 부족하다고 느낀 부분

1. 백엔드, 프론트 기능 개발시 코드 작성 능력 좋지 않다고 느꼈음
2. 흐름은 이해하지만 `Dockerfile`, `docker-compose.yml` 파일 작성에 대한 이해가 많이 부족
3. 개발과 운영 사이 하드코딩 수정이 아닌 환경변수 주입 등으로 유연하게 대처하는 부분에 대한 스킬이 부족하다고 느낌
4. CI/CD 자동화에서 `deploy.yml` 파일 작성에 대한 이해도 부족

## 3. 팀 프로젝트 전에 보완하고 싶은 기술

- 코드 작성 능력 향상
- 개발과 운영 환경에서 api 주소 등 하드코딩이 아닌 환경변수 주입 등으로 유연하게 대처하는 스킬 향상
- Dockerfile, docker-compose.yml 작성 능력 향상

## 4. 혼자 진행하며 느낀 점

- 처음부터 끝까지 혼자서 다 하려니 힘들었지만, 막히는 부분 있어도 해결하려고 노력하며 많이 배울 수 있었음
- 프로젝트를 많이 해보라는 조언이 이해가 됨

---

## 1일차 체크리스트

- [✅] GitHub 리포지토리 생성 및 코드 Push
- [✅] Backend/Frontend 폴더 분리
- [✅] 로컬에서 데이터 저장/조회 성공 스크린샷
- [✅] API 명세서 작성 (docs/02-api-spec.md)

![image.png](./image.png)

### 작업 history

1. **Rest API 구현할 때 delete 요청 고민**
    - 백엔드 작업 중 메서드 delete 요청시 쿼리파라매터값으로 password를 받을려고 했었는데
    - url에 노출되는거 인지하여, 삭제도 그냥 리퀘스트dto로 받게끔 수정

2. **github 게시 문제**
    - 최초 게시하기전 루트 디렉토리에 .gitignore 파일 미리 작성 후
    - 게시하였으나, frontend 폴더만 게시가 되지 않아 문제를 겪음
    - 원인확인해보니 frontend 내 별도로 .git 폴더가 생성되어 있어서
    - 리포지토리가 분리되어 있었음
    - frontend 폴더 내 .git 폴더 삭제 후 다시 게시하여 해결


---

## 2일차 체크리스트

- [✅] Dockerfile 2개 작성 (Backend, Frontend)
- [✅] docker-compose.yml 작성
- [✅] 로컬에서 docker-compose up 실행 확인
- [✅] AWS EC2에 수동 배포 성공
- [✅] EC2 IP 주소로 서비스 접속 확인


### 작업 history

1. **ec2 배포시 `ec2/docker-compose.yml` 따로 구성**
  - [04-deploy.md 참고](./04-deploy.md)
  - [ec2 폴더 참고](./../ec2/README.md)

2. **ec2 배포시 localhost 퍼블릭주소 교체 처리**
  - **backend** 
    - 도커컴포즈 = `CORS_ALLOWED_ORIGINS` 환경변수 추가
    - .env =  해당 환경변수값 추가
    - application.yml = `cors.allowed-origins` 값 디폴트 로컬호스트 추가
    - GuestBookController.java = `@CrossOrigin` 어노테이션 수정

  - **frontend**
    - next.config.mjs = `async rewrites()` 설정 (source, destination)
    - guestBookApi.js = fetch 주소 `/api/guestbooks` 로 변경

---


## 3일차 체크리스트
- [✅] GitHub Actions 워크플로우 파일 작성
- [✅] 코드 수정 후 Push → 자동 배포 확인
- [✅] 모든 문서 작성 완료
- [✅] 회고 문서 작성

### 작업 history

1. **워크플로우 설정**
  - on.push.paths 부분에 특정폴더 및 deploy.yml 변경시 액션

2. **step 설정**
  - 도커허브 액션 : 프론트,백엔드 빌드 후 푸쉬 실행
  - EC2 배포 액션 : 컴포즈 풀, 업 실행 및 ps 확인


### 참고사항

**Q.** `.gitignore`에 `application.yml` 반영 비활성 했는데 어떻게 배포가 되나?

- 깃허브액션에서는 해당 파일이 이그노어면 모르긴함
- 단 배포시에 EC2 서버에 있는  `docker-compose.yml` 기준으로 `.env` 환경 변수를 찾음
- SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME 등 해당 환경 변수값을 얻어서 대체함

- 즉, `application.yml` 없어도 배포에 문제없음