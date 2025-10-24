#!/bin/bash
# -------------------------------------
# ToCheon Backend 자동 실행 스크립트 (날짜별 로그 버전)
# -------------------------------------

# 1. 환경변수 로드 (.env가 존재할 경우)
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

# 2. 프로젝트 디렉토리로 이동
cd /home/user01/ToCheon/back || exit 1

# 3. npm 패키지 확인 (없으면 자동 설치)
if [ ! -d "node_modules" ]; then
  echo "node_modules 미존재 → npm install 실행"
  npm install
fi

# 4. 로그 파일명: startup-YYYY-MM-DD.log
LOG_DATE=$(date +"%Y-%m-%d")
LOG_FILE="/home/user01/ToCheon/back/startup-$LOG_DATE.log"

# 5. 서버 실행 (로그 파일로 출력)
echo "ToCheon Backend Server Starting at $(date)" >> "$LOG_FILE" 2>&1
npm start >> "$LOG_FILE" 2>&1
