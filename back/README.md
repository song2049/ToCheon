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
│   ├── connection.js
│   └── sequelize.js   # 2025.10.25 추가
├── middleware/
│   ├── authMiddleware.js
│   └── errorHandler.js
├── models
│   └── Users.js    # 2025.10.25 추가 (User 포함 총 5개 모델 추가 예정)
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