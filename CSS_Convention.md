# 🧭 천호역 음식점 리뷰 서비스 개발 표준 및 컨벤션

본 문서는 **'천호역 음식점 리뷰 서비스'** 개발 시 준수해야 할 기술 스택, 코딩 스타일, 명명 규칙 및 기타 개발 표준을 정의합니다.

---

## 1. 기술 스택 및 환경

| 영역 | 기술 / 표준 | 설명 |
|------|--------------|------|
| **마크업** | HTML5 (시맨틱 태그 활용) | `<header>`, `<main>`, `<section>`, `<footer>` 등 의미에 맞는 태그를 사용하여 접근성을 높인다. |
| **스타일링** | CSS3 (클래스 기반 스타일링) | 표준 CSS3 문법을 사용하며, 구조화를 위해 클래스 명명 규칙을 따른다. |
| **스크립트** | JavaScript (ES6+) | 최신 JavaScript 문법(화살표 함수, const, let, Promise 등)을 사용한다. |
| **백엔드/데이터** | Node.js (Express), MySQL | 서버 로직은 Node.js 기반 Express 프레임워크를 사용하며, 데이터는 MySQL 관계형 데이터베이스에 저장한다. |
| **다국어** | 한국어 (기본) | 변수명, 함수명 등 코어 로직은 영어(camelCase)를 사용하고, 주석 및 UI 텍스트는 한국어를 사용한다. |

---

## 2. CSS 및 스타일링 컨벤션

### 2.1 클래스 명명 규칙 (단일 하이픈 기반)

복잡한 기호( `-`)를 사용하지 않고 단일 하이픈(`-`)만을 사용하여 블록, 요소, 수정자를 구분하는 간결한 명명 방식을 채택한다.

**규칙:** 클래스는 소문자 하이픈(`kebab-case`)을 사용한다.

| 유형 | 컨벤션 | 예시 |
|------|---------|------|
| **블록 (Block)** | 단수 명사 | `.restaurant-list`, `.review-card` |
| **요소 (Element)** | `블록-요소` | `.review-card-author`, `.restaurant-list-item` |
| **수정자 (Modifier)** | `블록-상태` | `.button-active`, `.review-card-admin` |

---

### 2.2 스타일 파일 구조

**구조화:** CSS 파일은 역할별로 분리하고, 주석을 사용하여 가독성을 확보한다.

```
/css/
├── base.css          # 전역 스타일, 리셋, 폰트 정의
├── layout.css        # 전체 레이아웃 (헤더, 푸터, 그리드)
├── components.css    # 재사용 가능한 컴포넌트 (버튼, 카드, 모달)
└── pages/
    ├── home.css
    ├── restaurant-detail.css
    └── review-form.css
```

---

### 2.3 색상 및 폰트

**색상 변수 예시:**
```css
:root {
  --main-color: #ffc107; /* 주요 색상 (Yellow) */
  --info-color: #2196f3; /* 보조 색상 (Blue) */
  --gray-color: #757575; /* 중립 색상 (Gray) */
}
```

**폰트 설정 예시:**
```css
body {
  font-family: 'Noto Sans KR', 'Malgun Gothic', sans-serif;
}
```

---

## 3. JavaScript 코딩 컨벤션 (프론트엔드 및 백엔드 Node.js 공통)

### 3.1 명명 규칙 (Naming Conventions)

| 유형 | 컨벤션 | 예시 |
|------|---------|------|
| **변수 (Variables)** | `camelCase` | `restaurantList`, `userId`, `reviewCount` |
| **함수 (Functions)** | `camelCase + 동사` | `fetchRestaurants()`, `handleMarkerClick()`, `saveReview()` |
| **상수 (Constants)** | `UPPER_SNAKE_CASE` | `MAX_REVIEW_LENGTH`, `API_URL`, `SERVER_PORT` |

---

### 3.2 구조 및 스타일

- **주석:** 복잡한 로직, 함수 정의, 비즈니스 규칙 등에는 반드시 한국어 주석을 달아 코드 이해를 돕는다.  
- **스코프:** `var` 사용을 금지하고, 재할당이 필요한 경우 `let`, 그 외에는 `const`를 사용한다.  
- **비동기 처리:** Promise 기반의 비동기 코드는 `async/await` 구문을 사용하여 가독성을 높인다.  
- **오류 처리:** DB 통신 및 외부 API 호출 시 반드시 `try...catch` 블록을 사용하여 사용자에게 친절한 오류 메시지를 제공하고 콘솔/로그 파일에 로그를 남긴다.  

```js
// 음식점 목록을 가져오는 예시 함수
async function fetchRestaurants() {
  try {
    const response = await fetch(`${API_URL}/restaurants`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('음식점 데이터를 불러오는 중 오류 발생:', error);
    alert('서버와의 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}
```

---

## 4. 데이터베이스 (MySQL) 명명 및 구조

### 4.1 테이블 및 필드 명명

- **테이블 이름:** 복수형의 `snake_case`를 사용한다. (예: `restaurants`, `user_reviews`)  
- **필드 이름 (컬럼):** `camelCase`를 통일하여 사용한다.  
- **Primary Key:** 모든 테이블은 `id (INT, AUTO_INCREMENT)` 필드를 기본 키로 갖는다.  
- **Foreign Key:** 외래 키는 `[테이블명]Id` 형태로 명명한다. (예: `restaurants` 테이블의 외래 키는 `restaurantId`)  

| 테이블 | 필드 이름 (컬럼) | 데이터 타입 | 설명 |
|--------|------------------|--------------|------|
| **restaurants** | `id` | INT | Primary Key |
| | `restaurantName` | VARCHAR | 음식점 이름 |
| | `adminComment` | TEXT | 관리자 경험 기반 코멘트 |
| | `latitude` | DECIMAL(10,7) | 위도 |
| | `isVerified` | BOOLEAN | 관리자 인증 여부 |
| **user_reviews** | `id` | INT | Primary Key |
| | `restaurantId` | INT | 외래 키 (FK to restaurants.id) |
| | `userId` | INT | 작성자 ID (FK to users.id) |
| | `ratingScore` | TINYINT | 평점 (1~5) |
| | `createdAt` | TIMESTAMP | 작성 시간 |

---

### 4.2 데이터 구조 규칙

- **관계 정의:**  
  데이터 간의 관계(1:N, N:M)를 명확히 정의하고 외래 키(Foreign Key) 제약 조건을 사용하여 데이터 무결성을 유지한다.

- **시간 기록:**  
  생성 시간(`createdAt`) 및 수정 시간(`updatedAt`) 필드를 표준화하여 데이터 변경 이력을 관리한다.

- **데이터 타입 선택:**  
  문자열의 길이에 따라 `VARCHAR`와 `TEXT`를 적절히 구분하고, 숫자/좌표는 `INT`, `DECIMAL` 등을 정확히 지정한다.

---

✅ **본 문서는 팀 내 코드 일관성과 협업 효율성 향상을 위해 모든 개발자가 반드시 준수해야 하는 표준입니다.**
✅ **내용 변경을 원하시면 팀장을 통해 요청해주시기 바랍니다.**
