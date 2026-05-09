# 🍽️ Mini GrabFood

ระบบให้คะแนนและรีวิวร้านอาหาร - Restaurant Rating & Review System

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)
![License](https://img.shields.io/badge/License-ISC-blue)

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Features
- ✅ ดูรายการร้านอาหารพร้อมคะแนนเฉลี่ย
- ✅ ค้นหาร้านอาหารตามชื่อ
- ✅ กรองร้านตามประเภท, คะแนนขั้นต่ำ, และร้านที่เปิดอยู่
- ✅ ดูรายละเอียดร้านอาหาร
- ✅ ให้คะแนนร้าน (1-5 ดาว) พร้อม comment และแนบรูปได้
- ✅ ดูประวัติการให้คะแนน
- ✅ Responsive Design (มือถือ/แท็บเล็ต/PC)

### 🔒 Authentication
- ✅ เข้าสู่ระบบด้วย Google OAuth 2.0
- ✅ JWT Token สำหรับ session management
- ✅ Route protection สำหรับ authenticated users
- ✅ Auto-redirect เมื่อ token หมดอายุ

### ❤️ User Features
- ✅ บันทึกร้านอาหารโปรด (Favorites)
- ✅ ดูประวัติรีวิวของตัวเอง
- ✅ ตั้งค่าโปรไฟล์ (เปลี่ยนชื่อ, อัปโหลดรูปโปรไฟล์)
- ✅ ดูสถิติการใช้งานของตัวเอง (จำนวนรีวิว, จำนวนโปรด)

### 🛠️ Admin Features
- ✅ Dashboard สรุปสถิติระบบ (ร้านอาหาร, ผู้ใช้, รีวิว, โปรด)
- ✅ ดูร้านยอดนิยม (รีวิวมากสุด)
- ✅ ดูผู้ใช้ล่าสุด
- ✅ จัดการร้านอาหาร (เพิ่ม / แก้ไข / ลบ)
- ✅ จัดการผู้ใช้ (Ban / Unban, ตั้ง / ถอด Admin)
- ✅ ลบรีวิวที่ไม่เหมาะสม

### 🔧 Technical Features
- ✅ Input Validation
- ✅ Error Handling
- ✅ Loading States
- ✅ Real-time Updates
- ✅ RESTful API
- ✅ Database Indexing
- ✅ File Upload (รูปโปรไฟล์และรูปรีวิว)
- ✅ Pagination

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 19.2
- **Routing:** React Router DOM 7.13
- **Styling:** Tailwind CSS 3.4
- **HTTP Client:** Fetch API
- **Build Tool:** Vite 7.2

### Backend
- **Runtime:** Node.js 16+
- **Framework:** Express.js 4.18
- **Database:** MySQL 8.0
- **ORM:** MySQL2 (Promise-based)
- **Authentication:** Passport.js (Google OAuth 2.0) + JWT
- **File Upload:** Multer
- **Environment:** dotenv

### Development Tools
- **Testing:** Postman
- **Version Control:** Git
- **Package Manager:** npm
- **Dev Server:** Nodemon

---

## 📁 Project Structure

```
mini-grabfood/
├── frontend/                     # React application
│   ├── public/
│   └── src/
│       ├── api/                  # API service layer
│       │   ├── restaurant.api.js
│       │   └── admin.api.js
│       ├── components/           # Reusable components
│       │   ├── Header.jsx
│       │   ├── RestaurantList.jsx
│       │   ├── RestaurantDetail.jsx
│       │   ├── StarRating.jsx
│       │   └── ConfirmDialog.jsx
│       ├── contexts/             # React Context
│       │   └── AuthContext.jsx
│       ├── pages/                # Page components
│       │   ├── AdminPanel.jsx
│       │   ├── Profile.jsx
│       │   └── ProfileSettings.jsx
│       ├── App.jsx               # Main app + routing
│       ├── main.jsx              # Entry point
│       └── index.css             # Global styles
│
├── backend/                      # Node.js API server
│   ├── src/
│   │   ├── controllers/          # Business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── restaurant.controller.js
│   │   │   ├── rating.controller.js
│   │   │   ├── favorite.controller.js
│   │   │   ├── admin.controller.js
│   │   │   └── user.controller.js
│   │   ├── routes/               # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── restaurant.routes.js
│   │   │   └── admin.routes.js
│   │   ├── middleware/           # Express middleware
│   │   │   ├── auth.middleware.js
│   │   │   ├── admin.middleware.js
│   │   │   └── upload.middleware.js
│   │   ├── config/
│   │   │   └── passport.js       # Google OAuth config
│   │   ├── db.js                 # Database connection pool
│   │   ├── app.js                # Express app setup
│   │   └── server.js             # Server entry point
│   ├── database/
│   │   └── schema.sql            # Database schema & seed data
│   ├── uploads/                  # Uploaded files
│   │   └── profiles/             # Profile pictures
│   ├── .env.example
│   └── package.json
│
├── postman/                      # API testing
│   ├── Mini-GrabFood-API.postman_collection.json
│   └── Mini-GrabFood-Local.postman_environment.json
│
├── .gitignore
├── package.json                  # Root package.json (monorepo)
└── README.md
```

---

## 📋 Prerequisites

ก่อนเริ่มต้น ต้องติดตั้งสิ่งเหล่านี้ในเครื่องของคุณ:

- **Node.js** v16.0.0 หรือสูงกว่า ([Download](https://nodejs.org/))
- **MySQL** v8.0.0 หรือสูงกว่า ([Download](https://dev.mysql.com/downloads/))
- **npm** v7.0.0 หรือสูงกว่า (มากับ Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Google Cloud Project** พร้อม OAuth 2.0 credentials ([Google Cloud Console](https://console.cloud.google.com/))

ตรวจสอบเวอร์ชัน:
```bash
node --version
npm --version
mysql --version
git --version
```

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/Thantawan6509650427/mini-grabfood
cd mini-grabfood
```

### 2. Install Dependencies

#### Option A: ติดตั้งทั้งหมดพร้อมกัน (Monorepo)
```bash
npm install
npm run install:all
```

#### Option B: ติดตั้งแยก
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### 1. Setup Database

```bash
# เข้า MySQL
mysql -u root -p

# สร้าง database
CREATE DATABASE mini_grabfood;

# รัน schema (จาก MySQL prompt)
source backend/database/schema.sql

# หรือจาก command line
mysql -u root -p mini_grabfood < backend/database/schema.sql
```

### 2. Configure Environment Variables

สร้างไฟล์ `.env` ใน `backend/`:

```bash
cd backend
cp .env.example .env
```

แก้ไขไฟล์ `.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=mini_grabfood
DB_PORT=3306

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session Configuration
SESSION_SECRET=your_session_secret_here
```

**⚠️ สำคัญ:** แทนที่ค่าทั้งหมดที่มี `your_` ด้วยค่าจริงของคุณ และอย่า commit ไฟล์ `.env` ขึ้น GitHub

### 3. Setup Google OAuth

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้าง Project ใหม่
3. ไปที่ **APIs & Services** → **Enable APIs** → เปิดใช้ **Google+ API**
4. ไปที่ **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. ตั้งค่า Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
7. Copy **Client ID** และ **Client Secret** ใส่ใน `.env`

---

## 🏃 Running the Application

### วิธีที่ 1: รันทั้งหมดพร้อมกัน (แนะนำ)

```bash
# จาก root directory
npm run dev
```

### วิธีที่ 2: รันแยก

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Server จะรันที่: `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend จะรันที่: `http://localhost:5173`

### ✅ เปิดใช้งาน

เปิด browser ไปที่: **http://localhost:5173**

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-01T14:30:00.000Z",
  "environment": "development"
}
```

---

### Authentication Endpoints

#### Login with Google
```http
GET /api/auth/google
```
Redirect ไปยัง Google OAuth consent screen

#### Get Current User
```http
GET /api/auth/user
Authorization: Bearer <token>
```
**Response:**
```json
{
  "id": 1,
  "name": "Thantawan Chitsan",
  "email": "tantawanjittsan@gmail.com",
  "picture": "https://...",
  "is_admin": false,
  "is_banned": false
}
```

#### Update Profile
```http
PUT /api/auth/user/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
**Body:** `name` (text), `picture` (file, optional)

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

---

### Restaurant Endpoints

#### Get All Restaurants
```http
GET /api/restaurants
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | ค้นหาชื่อร้าน |
| `category` | string | กรองตามประเภท |
| `min_rating` | number | คะแนนขั้นต่ำ |
| `open_now` | boolean | เฉพาะร้านที่เปิดอยู่ |
| `page` | number | หน้า (default: 1) |
| `limit` | number | จำนวนต่อหน้า (default: 6) |

**Response:**
```json
{
  "restaurants": [
    {
      "id": 1,
      "name": "ครัวป้าแดง",
      "description": "อาหารไทยรสจัด เมนูแกงต่างๆ อร่อยถูกปาก",
      "image_url": "https://picsum.photos/seed/rest1/400/300",
      "category": "อาหารไทย",
      "opening_time": "08:00",
      "closing_time": "20:00",
      "avg_rating": 4.7,
      "rating_count": 3
    }
  ],
  "total": 10,
  "page": 1,
  "totalPages": 2
}
```

#### Get Restaurant by ID
```http
GET /api/restaurants/:id
```

**Error Response (404):**
```json
{
  "message": "Restaurant not found"
}
```

#### Add Rating
```http
POST /api/restaurants/:id/rating
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**
| Field | Type | Required |
|-------|------|----------|
| `score` | number (1-5) | ✅ |
| `comment` | string | ❌ |
| `image` | file | ❌ |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Rating added successfully",
  "rating_id": 15,
  "restaurant_stats": {
    "avg_rating": 4.8,
    "rating_count": 4
  }
}
```

**Error Response (400):**
```json
{
  "message": "Score must be between 1 and 5"
}
```

#### Get Restaurant Reviews
```http
GET /api/restaurants/:id/reviews
```

**Response:**
```json
[
  {
    "id": 15,
    "score": 5,
    "comment": "อร่อยมาก!",
    "image_url": null,
    "user_name": "Thantawan",
    "user_picture": "https://...",
    "created_at": "2026-05-01T14:30:00.000Z"
  }
]
```

---

### Favorites Endpoints

#### Get My Favorites
```http
GET /api/favorites
Authorization: Bearer <token>
```

#### Add Favorite
```http
POST /api/restaurants/:id/favorite
Authorization: Bearer <token>
```

#### Remove Favorite
```http
DELETE /api/restaurants/:id/favorite
Authorization: Bearer <token>
```

---

### Admin Endpoints

> ⚠️ ทุก endpoint ต้องเป็น Admin เท่านั้น (`is_admin = true`)

#### Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Bearer <token>
```
**Response:**
```json
{
  "stats": {
    "total_restaurants": 10,
    "total_users": 25,
    "total_ratings": 100,
    "total_favorites": 50
  },
  "topRestaurants": [...],
  "recentUsers": [...]
}
```

#### Manage Restaurants
```http
GET    /api/admin/restaurants          # ดูร้านทั้งหมด
POST   /api/admin/restaurants          # เพิ่มร้านใหม่
PUT    /api/admin/restaurants/:id      # แก้ไขร้าน
DELETE /api/admin/restaurants/:id      # ลบร้าน
```

#### Manage Users
```http
GET   /api/admin/users                 # ดูผู้ใช้ทั้งหมด
PATCH /api/admin/users/:id/ban         # Ban / Unban
PATCH /api/admin/users/:id/admin       # ตั้ง / ถอด Admin
```

#### Delete Review
```http
DELETE /api/admin/reviews/:id
Authorization: Bearer <token>
```

---

## 🗄️ Database Schema

### Tables

#### **users**
```sql
CREATE TABLE users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  google_id    VARCHAR(255) UNIQUE NOT NULL,
  email        VARCHAR(255) NOT NULL,
  name         VARCHAR(255),
  picture      VARCHAR(512),
  is_admin     BOOLEAN DEFAULT FALSE,
  is_banned    BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **restaurants**
```sql
CREATE TABLE restaurants (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  description   TEXT,
  image_url     VARCHAR(512),
  category      VARCHAR(100),
  opening_time  TIME,
  closing_time  TIME,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### **ratings**
```sql
CREATE TABLE ratings (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT,
  restaurant_id  INT NOT NULL,
  score          TINYINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment        TEXT,
  image_url      VARCHAR(512),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

#### **favorites**
```sql
CREATE TABLE favorites (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  restaurant_id  INT NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, restaurant_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

### ER Diagram

```
┌──────────┐         ┌─────────────┐         ┌──────────────┐
│  users   │────┬────│   ratings   │────┬────│ restaurants  │
└──────────┘    │    └─────────────┘    │    └──────────────┘
                │                       │
                │    ┌─────────────┐    │
                └────│  favorites  │────┘
                     └─────────────┘
```

---

## 🧪 Testing

### Postman Collection

Import Postman collection จากโฟลเดอร์ `postman/`:

1. เปิด Postman
2. Import ไฟล์ `Mini-GrabFood-API.postman_collection.json`
3. Import ไฟล์ `Mini-GrabFood-Local.postman_environment.json`
4. เลือก Environment: "Mini GrabFood - Local"
5. Run Collection

### Manual Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Get all restaurants
curl http://localhost:5000/api/restaurants

# Search restaurants
curl "http://localhost:5000/api/restaurants?search=ข้าว&category=อาหารไทย"

# Get restaurant by ID
curl http://localhost:5000/api/restaurants/1

# Get reviews
curl http://localhost:5000/api/restaurants/1/reviews

# Get favorites (ต้องมี token)
curl http://localhost:5000/api/favorites \
  -H "Authorization: Bearer <your_token>"

# Add rating (ต้องมี token)
curl -X POST http://localhost:5000/api/restaurants/1/rating \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"score": 5, "comment": "อร่อยมาก!"}'
```

---

## 📸 Screenshots

### หน้าหลัก — รายการร้านอาหาร
![Homepage](https://github.com/user-attachments/assets/62198431-6cc0-4de9-af51-f22bebdfae86)

### หน้ารายละเอียดร้านอาหาร
![Restaurant Detail](https://github.com/user-attachments/assets/14e33502-0e30-48e7-adab-4914fb59e4a6)

### หน้า Admin Panel
![Admin Panel](https://github.com/user-attachments/assets/8ac2a7f5-6909-412e-97c4-4e0e2a411178)

### หน้าตั้งค่าโปรไฟล์
![Profile Settings](https://github.com/user-attachments/assets/7dd648c0-550f-4b25-8299-66cb678c5f7e)

---

## 🚢 Deployment

### Backend (Node.js)

#### Railway / Render (แนะนำ)
1. เชื่อมต่อ GitHub repository
2. เลือก `backend` directory
3. ตั้งค่า environment variables ทั้งหมดใน dashboard
4. Deploy

#### Heroku
```bash
heroku login
heroku create mini-grabfood-api
heroku config:set DB_HOST=your_db_host
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set GOOGLE_CLIENT_ID=your_client_id
heroku config:set GOOGLE_CLIENT_SECRET=your_client_secret
git subtree push --prefix backend heroku main
```

### Frontend (React)

#### Vercel (แนะนำ)
```bash
cd frontend
npm install -g vercel
vercel
```

#### Netlify
```bash
cd frontend
npm run build
# Upload dist/ folder to Netlify
```

### Database (MySQL)

ตัวเลือกที่แนะนำ:
- **PlanetScale** — Serverless MySQL ฟรี
- **AWS RDS** — Production ready
- **DigitalOcean Managed Database**

---

## 🤝 Contributing

เรายินดีรับ contributions! ทำตามขั้นตอนนี้:

1. **Fork the repository**
2. **Create your feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Coding Standards
- ใช้ ESLint configuration ที่มีอยู่
- เขียน commit messages ที่ชัดเจน
- เพิ่ม tests สำหรับ features ใหม่
- อัพเดท documentation

---

## 🐛 Known Issues

- [ ] การค้นหาไม่รองรับ fuzzy search
- [ ] ยังไม่มี rate limiting สำหรับ API

---

## 📝 TODO / Future Improvements

- [ ] เพิ่ม Menu Management (รายการเมนูอาหาร)
- [ ] เพิ่ม Advanced Search (fuzzy search)
- [ ] เพิ่ม Rate Limiting
- [ ] เพิ่ม Unit Tests
- [ ] เพิ่ม E2E Tests (Cypress)
- [ ] เพิ่ม CI/CD Pipeline
- [ ] เพิ่ม Docker Support
- [ ] เพิ่มภาษาอังกฤษ (i18n)
- [ ] เพิ่ม Push Notifications
- [ ] เพิ่ม Map Integration

---

## 📄 License

This project is licensed under the **ISC License**.

```
Copyright (c) 2026 Mini GrabFood

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
```

---

## 👥 Authors

- **Thantawan Chitsan** - *Full Stack Developer* - [GitHub](https://github.com/Thantawan6509650427)

### 🤖 Development Contributions

- **Claude (Anthropic)** - AI-assisted development
  - Code generation, refactoring, and optimization
  - Bug fixing and debugging assistance
  - Feature implementation and improvements
  - Documentation and commit messages

---

## 🙏 Acknowledgments

- React Team สำหรับ React framework
- Express.js Team สำหรับ backend framework
- Tailwind CSS Team สำหรับ styling framework
- MySQL Team สำหรับ database
- Google สำหรับ OAuth 2.0
- Claude (Anthropic) สำหรับ AI-assisted development
- ขอบคุณทุกคนที่ contribute

---

## 📞 Contact

- **Email:** tantawanjittsan@gmail.com
- **GitHub:** [@Thantawan6509650427](https://github.com/Thantawan6509650427)
- **LinkedIn:** [thantawan chitsan](https://www.linkedin.com/in/thantawan-chitsan/)

---

<div align="center">

**⭐ ถ้าชอบโปรเจคนี้ อย่าลืมกด Star ด้วยนะครับ! ⭐**

Made with ❤️ in Thailand 🇹🇭

</div>