# CI/CD 설명

## 1. GitHub Actions를 사용하는 이유

- 보통은 젠킨스를 사용하지만, 간단한 프로젝트이므로 GitHub Actions 사용
- `deploy.yml` 파일을 통해 푸시 이벤트 발생 시 자동으로 빌드 및 배포 수행
- 그리고 민감정보는 GitHub Secrets에 저장하여 보안 유지성이 좋음

## 2. 워크플로우 실행 조건

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: ["main"]
    paths: # push 된 파일이 이 경로에 있을 때만 실행
      - 'backend/**'
      - 'frontend/**'
      - '.github/workflows/deploy.yml'  # 워크플로우 자체 수정 시에도 실행

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps: # 각 작업 단계 정의
      - name: Check out code
        uses: actions/checkout@v4 # 코드 체크아웃 액션 사용

      - name: Login to Docker Hub 
        uses: docker/login-action@v3 # 도커 허브 로그인 액션 사용
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and Push Backend
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/guest-book-app-backend:latest ./backend
          docker push ${{ secrets.DOCKER_USERNAME }}/guest-book-app-backend:latest

      - name: Build and Push Frontend
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/guest-book-app-frontend:latest ./frontend
          docker push ${{ secrets.DOCKER_USERNAME }}/guest-book-app-frontend:latest

      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.0.0 # EC2 접속 액션 사용
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ec2-user
          key: ${{ secrets.EC2_KEY }}
          script: |
            cd ~
            docker-compose pull
            docker-compose up -d
            docker-compose ps
```

- `main` 브랜치에 backend, frontend, deploy.yml 파일이 푸시될 때마다 워크플로우 실행


## 3. 자동화된 단계별 흐름

1. **코드 체크아웃** : 최신 코드를 가져옴
2. **도커 허브 로그인**: GitHub Secrets에 저장된 자격증명으로 로그인
3. **백엔드, 프론트엔드 빌드 및 푸시**
    - 각 폴더 내 Dockerfile을 사용하여 도커 이미지 빌드
    - 도커 허브에 `내계정/앱이름:latest` 태그로 푸시

4. **EC2 접속**
    - SSH 액션을 사용하여 EC2 인스턴스에 접속
    - docker-compose 명령어로 최신 이미지 풀 및 컨테이너 재시작

## 4. (있다면) 실패했을 때 원인과 해결 과정