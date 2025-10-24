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
├── README.md
│
├── db/
│   └── connection.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── errorHandler.js
│
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