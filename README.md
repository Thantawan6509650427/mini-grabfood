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
- ✅ เรียงลำดับตามคะแนน
- ✅ ดูรายละเอียดร้านอาหาร
- ✅ ให้คะแนนร้าน (1-5 ดาว)
- ✅ ดูประวัติการให้คะแนน
- ✅ Responsive Design (มือถือ/แท็บเล็ต/PC)

### 🔒 Additional Features
- ✅ Input Validation
- ✅ Error Handling
- ✅ Loading States
- ✅ Real-time Updates
- ✅ RESTful API
- ✅ Database Indexing

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
- **Environment:** dotenv

### Development Tools
- **Testing:** Postman
- **Version Control:** Git
- **Package Manager:** npm

---

## 📁 Project Structure

```
mini-grabfood/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── api/             # API service layer
│   │   │   └── restaurant.api.js
│   │   ├── components/      # React components
│   │   │   ├── RestaurantList.jsx
│   │   │   ├── RestaurantList.css
│   │   │   ├── RestaurantDetail.jsx
│   │   │   ├── StarRating.jsx
│   │   │   └── star.css
│   │   ├── App.jsx          # Main app component
│   │   ├── App.css
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── tailwind.config.js   # Tailwind configuration
│   ├── postcss.config.js    # PostCSS configuration
│   ├── vite.config.js       # Vite configuration
│   └── package.json
│
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   │   ├── restaurant.controller.js
│   │   │   └── rating.controller.js
│   │   ├── routes/          # API routes
│   │   │   └── restaurant.routes.js
│   │   ├── app.js           # Express app setup
│   │   ├── db.js            # Database connection
│   │   └── server.js        # Server entry point
│   ├── database/
│   │   └── schema.sql       # Database schema & seed data
│   ├── .env.example         # Environment variables template
│   ├── .env                 # Environment variables (gitignored)
│   └── package.json
│
├── postman/                  # API testing
│   ├── Mini-GrabFood-API.postman_collection.json
│   ├── Mini-GrabFood-Local.postman_environment.json
│   └── API-Testing-Guide.md
│
├── .gitignore
├── package.json              # Root package.json (monorepo)
└── README.md
```

---

## 📋 Prerequisites

ก่อนเริ่มต้น ต้องติดตั้งสิ่งเหล่านี้ในเครื่องของคุณ:

- **Node.js** v16.0.0 หรือสูงกว่า ([Download](https://nodejs.org/))
- **MySQL** v8.0.0 หรือสูงกว่า ([Download](https://dev.mysql.com/downloads/))
- **npm** v7.0.0 หรือสูงกว่า (มากับ Node.js)
- **Git** ([Download](https://git-scm.com/))

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

# รัน schema (จาก MySQL prompt)
source backend/database/schema.sql

# หรือจาก command line
mysql -u root -p < backend/database/schema.sql
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

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**⚠️ สำคัญ:** แทนที่ `your_mysql_password_here` ด้วยรหัสผ่าน MySQL จริงของคุณ

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

### Endpoints

#### 1. Health Check
```http
GET /health
```
ตรวจสอบสถานะเซิร์ฟเวอร์

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-01T14:30:00.000Z",
  "environment": "development"
}
```

---

#### 2. Get All Restaurants
```http
GET /api/restaurants
```
ดึงรายการร้านอาหารทั้งหมด

**Query Parameters:**
- `search` (optional): ค้นหาชื่อร้าน

**Example:**
```http
GET /api/restaurants?search=ข้าว
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "ครัวป้าแดง",
    "description": "อาหารไทยรสจัด เมนูแกงต่างๆ อร่อยถูกปาก",
    "image_url": "https://picsum.photos/seed/rest1/400/300",
    "avg_rating": 4.7,
    "rating_count": 3,
    "created_at": "2026-02-01T11:58:25.000Z"
  }
]
```

---

#### 3. Get Restaurant by ID
```http
GET /api/restaurants/:id
```
ดึงรายละเอียดร้านเดี่ยว

**Example:**
```http
GET /api/restaurants/1
```

**Response:**
```json
{
  "id": 1,
  "name": "ครัวป้าแดง",
  "description": "อาหารไทยรสจัด เมนูแกงต่างๆ อร่อยถูกปาก",
  "image_url": "https://picsum.photos/seed/rest1/400/300",
  "avg_rating": 4.7,
  "rating_count": 3,
  "created_at": "2026-02-01T11:58:25.000Z"
}
```

**Error Response (404):**
```json
{
  "message": "Restaurant not found"
}
```

---

#### 4. Add Rating
```http
POST /api/restaurants/:id/rating
```
ให้คะแนนร้านอาหาร

**Request Body:**
```json
{
  "score": 5,
  "comment": "อร่อยมาก! บริการดี" // optional
}
```

**Validation:**
- `score`: จำเป็น, ต้องเป็นตัวเลข 1-5 เท่านั้น
- `comment`: ไม่จำเป็น, text

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

---

#### 5. Get Restaurant Ratings
```http
GET /api/restaurants/:id/ratings
```
ดึงประวัติการให้คะแนนของร้าน

**Example:**
```http
GET /api/restaurants/1/ratings
```

**Response:**
```json
[
  {
    "id": 15,
    "score": 5,
    "comment": "อร่อยมาก!",
    "created_at": "2026-02-01T14:30:00.000Z"
  },
  {
    "id": 14,
    "score": 4,
    "comment": "ดีครับ",
    "created_at": "2026-02-01T13:15:00.000Z"
  }
]
```

---

## 🧪 Testing

### Postman Collection

Import Postman collection จากโฟลเดอร์ `postman/`:

1. เปิด Postman
2. Import ไฟล์:
   - `Mini-GrabFood-API.postman_collection.json`
   - `Mini-GrabFood-Local.postman_environment.json`
3. เลือก Environment: "Mini GrabFood - Local"
4. Run Collection

### Test Coverage

- ✅ 14 Test Cases
- ✅ Success Scenarios (6 tests)
- ✅ Error Handling (4 tests)
- ✅ Validation Tests (4 tests)

### Manual Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Get all restaurants
curl http://localhost:5000/api/restaurants

# Search restaurants
curl "http://localhost:5000/api/restaurants?search=ข้าว"

# Get restaurant by ID
curl http://localhost:5000/api/restaurants/1

# Add rating
curl -X POST http://localhost:5000/api/restaurants/1/rating \
  -H "Content-Type: application/json" \
  -d '{"score": 5, "comment": "อร่อยมาก!"}'
```

---

## 📸 Screenshots

### หน้าแรก - รายการร้านอาหาร
![Restaurant List](docs/screenshots/restaurant-list.png)

### หน้ารายละเอียดร้าน
![Restaurant Detail](docs/screenshots/restaurant-detail.png)

### ระบบให้คะแนน
![Rating System](docs/screenshots/rating-system.png)

### Responsive Design
![Mobile View](docs/screenshots/mobile-view.png)

---

## 🗄️ Database Schema

### Tables

#### **restaurants**
```sql
CREATE TABLE restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);
```

#### **ratings**
```sql
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  score TINYINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_restaurant (restaurant_id),
  INDEX idx_created (created_at)
);
```

#### **menus** (สำหรับอนาคต)
```sql
CREATE TABLE menus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(512),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

### ER Diagram

```
┌─────────────┐         ┌──────────┐
│ restaurants │────┬────│ ratings  │
└─────────────┘    │    └──────────┘
                   │
                   │    ┌──────────┐
                   └────│  menus   │
                        └──────────┘
```

---

## 🚢 Deployment

### Backend (Node.js)

#### Heroku
```bash
# Install Heroku CLI
heroku login
heroku create mini-grabfood-api

# Set environment variables
heroku config:set DB_HOST=your_db_host
heroku config:set DB_USER=your_db_user
heroku config:set DB_PASSWORD=your_db_password
heroku config:set DB_NAME=your_db_name

# Deploy
git subtree push --prefix backend heroku main
```

#### Railway / Render
1. เชื่อมต่อ GitHub repository
2. เลือก `backend` directory
3. ตั้งค่า environment variables
4. Deploy

### Frontend (React)

#### Vercel
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

#### GitHub Pages
```bash
cd frontend
npm run build
# Configure GitHub Pages to serve from dist/
```

### Database (MySQL)

#### Options:
- **AWS RDS** - Production ready
- **PlanetScale** - Serverless MySQL
- **DigitalOcean** - Managed database
- **Heroku** - ClearDB add-on

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
- [ ] ยังไม่มีระบบ authentication
- [ ] ไม่มี pagination สำหรับรายการร้าน
- [ ] ยังไม่มีการ upload รูปภาพ

---

## 📝 TODO / Future Improvements

- [ ] เพิ่มระบบ Authentication (JWT)
- [ ] เพิ่ม User Profiles
- [ ] เพิ่มระบบ Upload รูปภาพ
- [ ] เพิ่ม Menu Management
- [ ] เพิ่ม Advanced Search & Filters
- [ ] เพิ่ม Pagination
- [ ] เพิ่ม Rate Limiting
- [ ] เพิ่ม Unit Tests
- [ ] เพิ่ม E2E Tests (Cypress)
- [ ] เพิ่ม CI/CD Pipeline
- [ ] เพิ่ม Docker Support
- [ ] เพิ่มภาษาอังกฤษ (i18n)

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

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- React Team สำหรับ React framework
- Express.js Team สำหรับ backend framework
- Tailwind CSS Team สำหรับ styling framework
- MySQL Team สำหรับ database
- ขอบคุณทุกคนที่ contribute

---

## 📞 Contact

- **Email:** your.email@example.com
- **GitHub:** [@yourusername](https://github.com/yourusername)
- **LinkedIn:** [Your Name](https://linkedin.com/in/yourprofile)

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/mini-grabfood&type=Date)](https://star-history.com/#yourusername/mini-grabfood&Date)

---

<div align="center">

**⭐ ถ้าชอบโปรเจคนี้ อย่าลืมกด Star ด้วยนะครับ! ⭐**

Made with ❤️ in Thailand 🇹🇭

</div>