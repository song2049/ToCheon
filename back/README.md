# 디렉토리 구조
``` 
/back/
├── package.json
├── server.js
├── config/
│   ├── db.js               # MySQL 연결 설정
│   └── jwt.js              # JWT 토큰 관련 설정
├── routes/
│   ├── auth.routes.js
│   ├── oauth.routes.js
│   ├── store.routes.js
│   ├── review.routes.js
│   └── admin.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── oauth.controller.js
│   ├── store.controller.js
│   ├── review.controller.js
│   └── admin.controller.js
├── middleware/
│   ├── authMiddleware.js   # JWT 검증 미들웨어
│   └── errorHandler.js     # 공통 에러 핸들러
├── models/
│   ├── User.js
│   ├── Restaurant.js
│   ├── Review.js
│   └── Admin.js
└── utils/
    └── response.js         # 표준 API 응답 포맷
```