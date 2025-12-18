# EC2 수동배포용

## 1. 배포 준비

- 이미지를 도커 hub로 배포

```bash
# docker hub 로그인
docker login

# 태그 붙임
# <도커hub계정> : 도커 hub id
docker tag guest-book-app-backend:latest <도커hub계정>/guest-book-app-backend:latest
docker tag guest-book-app-frontend:latest <도커hub계정>/guest-book-app-frontend:latest

# 업로드
docker push <도커hub계정>/guest-book-app-backend:latest
docker push <도커hub계정>/guest-book-app-frontend:latest
```

- 해당 ec2/.env 생성

```bash
MYSQL_ROOT_PASSWORD=<값넣기>
MYSQL_DATABASE=<값넣기>
MYSQL_USER=<값넣기>
MYSQL_PASSWORD=<값넣기>
CORS_URL=http://<퍼블릭IPv4주소>:3000
```

- 해당 ec2/docker-compose.yml (빌드 -> 이미지로 교체함)

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    image: star1431/guest-book-app-backend:latest
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    restart: always                                       # 컨테이너 재시작 설정
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/${MYSQL_DATABASE}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Seoul
      SPRING_DATASOURCE_USERNAME: ${MYSQL_USER}
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_PASSWORD}
      CORS_ALLOWED_ORIGINS: ${CORS_URL}                   # 프론트 주소 CORS

  frontend:
    image: star1431/guest-book-app-frontend:latest
    ports:
      - "3000:3000"
    depends_on:
      - backend


volumes:
  mysql_data:
```

---

## 2. 필요한 파일 EC2로 전송

- 로컬 터미널에서 최상위 루트 접근 후 (pem도 최상위루트에 포함되어있어야함 )

```bash
# 수정된 docker-compose.yml 전송
scp -i <인스턴스키>.pem ec2/docker-compose.yml ec2-user@<퍼블릭IPv4주소>:~/

# .env 파일 전송
scp -i <인스턴스키>.pem ec2/.env ec2-user@<퍼블릭IPv4주소>:~/
```

- 터미널에서 ec2 접속

```bash
ssh -i <인스턴스키>.pem ec2-user@<퍼블릭IPv4주소>

# 최초 접근시 yum 업데이트 및 도커 설치
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user
exit

# 재접속 후 도커 컴포즈 설치
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 설치 확인
docker-compose --version
```

- EC2 도커 이미지 받기

```bash
# 도커 로그인
docker login

# EC2 일때는 도커 허브 사이트들어가서 
# 우측상단 프로필 [account settings] -> [Personal access tokens] 
# -> [Generate new token] -> [Read & Write] 또는 풀만받으니 [read-only] 로 설정
# -> 결과화면의 토큰값 따로 저장해서 pw 대용으로 사용

# 도커 풀
docker pull <도커hub계정>/guest-book-app-backend:latest
docker pull <도커hub계정>/guest-book-app-frontend:latest

# 이미지 확인
docker images

# 파일 확인
ls -la

# Docker Compose 실행 (빌드 없이, 이미지 사용)
docker-compose up -d
```

---

## 3. 브라우저확인

```bash
# 백엔드
http://<퍼블릭IPv4주소>:8080/api/guestbooks
# 프론트엔드
http://<퍼블릭IPv4주소>:3000
```