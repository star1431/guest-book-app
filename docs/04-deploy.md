# AWS 배포 설명

## 1. EC2를 선택한 이유

- AWS EC2 통해서 가상서버를 만들고 쉽게 관리할 수 있기 때문에 선택함
- 배포 과정도 간단하고 사이트를 통해서 모니터링 등 다양한 기능을 제공하기 때문에 선택

---

## 2. 보안 그룹 설정 이유

- ssh : 22번 포트 | my ip로 제한 | 해당 인스턴스 ssh 접속을 위해 필요
- http : 80번 포트 | 모두 허용 | 웹 서비스 접속을 위해 필요
- TCP : 8080번 포트 | 모두 허용 | 백엔드 API
- TCP : 3000번 포트 | 모두 허용 | 프론트엔드 SPA

---

## 3. 서버에서 실행한 명령 흐름

- 최초 ssh 접속시

```bash
# 1. 서버 접속
ssh -i <인스턴스키>.pem ec2-user@<퍼블릭IPv4주소>

# 2. 업데이트 및 도커 설치
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user # ec2-user를 도커 그룹에 추가
exit

# 3. 재접속 후 도커 컴포즈 설치
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose # 도커 컴포즈 실행 권한 부여

# 설치 확인
docker-compose --version
```

- 로컬 터미널에서 pc도커 이미지를 hub 에 푸시

```bash
# docker hub 로그인
docker login

# 태그 붙임
docker tag guest-book-app-backend:latest <도커hub계정>/guest-book-app-backend:latest
docker tag guest-book-app-frontend:latest <도커hub계정>/guest-book-app-frontend:latest

# 업로드
docker push <도커hub계정>/guest-book-app-backend:latest
docker push <도커hub계정>/guest-book-app-frontend:latest
```

- EC2 별도 폴더 생성 후 EC2 관련 `.env`, `docker-compose.yml` 파일 작성
- 해당 두 파일을 EC2 서버로 전송

* [ec2 폴더 참고](./../ec2/README.md)

```bash
# 수정된 docker-compose.yml 전송
scp -i <인스턴스키>.pem ec2/docker-compose.yml ec2-user@<퍼블릭IPv4주소>:~/

# .env 파일 전송
scp -i <인스턴스키>.pem ec2/.env ec2-user@<퍼블릭IPv4주소>:~/
```

- EC2에서 이미지 pull 받고 컴포즈 실행

```bash
# 1. 서버 접속
ssh -i <인스턴스키>.pem ec2-user@<퍼블릭IPv4주소>

# 2. docker 로그인
docker login

# 3. 이미지 pull
docker pull <도커hub계정>/guest-book-app-backend:latest
docker pull <도커hub계정>/guest-book-app-frontend:latest

# 4. docker-compose 실행
docker-compose up -d
# 컴포즈가 images 기준으로 컨테이너를 생성 (build 하지 않음)
```

---

## 4. 배포 후 접속 방식

- 접속 전 상태 확인 명령어

```bash
# 컴포즈 상태 확인
docker-compose ps

# 도커 리소스 확인
# --no-stream : 한번만 출력
docker stats --no-stream

# EC2 서버 자원 확인
free -h
```

- 브라우저 접속

```bash
# 백엔드
http://<퍼블릭IPv4주소>:8080/api/guestbooks
# 프론트엔드
http://<퍼블릭IPv4주소>:3000
```