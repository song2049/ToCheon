# 디렉토리 구조
``` 
back/
│
├── .env (.gitignore)
├── node_modules (.gitignore)
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
├── README.md           # 현재 파일
│
├── db/
│   ├── connection.js  # 2025.10.25 : ORM 시퀄라이저로 변경 후 삭제 가능성 있음
│   └── sequelize.js   # 2025.10.25 추가
├── middleware/
│   ├── authMiddleware.js
│   └── errorHandler.js
├── models/
│   ├ index.js              
│   ├ user.js
│   ├ store.js
│   ├ review.js
│   ├ menu.js
│   └ picture.js
├── controllers/
│   ├── admin.controller.js
│   ├── auth.controller.js
│   ├── oauth.controller.js
│   ├── review.controller.js
│   └── store.controller.js
│
└── routes/
    ├── admin.routes.js
    ├── auth.routes.js
    ├── oauth.routes.js
    ├── review.routes.js
    └── store.routes.js

```

# 백엔드 인수인계 
## 필수 설치사항
``` bash
npm install express cors dotenv mysql2 bcrypt jsonwebtoken cookie-parser
```

- ORM 시퀄라이저 방식을 사용한다 해도 mySql은 수동으로 설치하고 database 생성까지 해 둬야함
- 그 후에 ORM으로 **await sequelize.sync({ alter: true });** 코드로 스키마 설계대로 테이블 생성이 가능함.
- 관리자 계정 데이터 초기화 및 테스트
``` bash
node db/init-loginData.js
npm start
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"email@email.com","password":"admin"}'
```
## 테스트 결과 ##
``` bash 
 curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"email@email.com","password":"admin"}'

{"message":"로그인 성공","user":{"id":1,"email":"email@email.com","name":"관리자","role":"ADMIN"},"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJBRE1JTiIsImVtYWlsIjoiZW1haWxAZW1haWwuY29tIiwiaWF0IjoxNzYxNDA3NTU2LCJleHAiOjE3NjE0MTExNTZ9.BJou40eN6dOVzmrqPdscSk1GglBexLsUpjc1zuniros"}% 
```
