-- Mini GrabFood Database Schema (PostgreSQL)
-- Compatible with Supabase and local PostgreSQL
-- Run this to set up your database

-- Drop existing tables in correct order (foreign keys first!)
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS menus CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =========================================
-- 1. Create users table FIRST
-- =========================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  picture VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);

-- =========================================
-- 2. Create restaurants table
-- =========================================
CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_restaurants_name ON restaurants(name);

-- =========================================
-- 3. Create ratings table (with user_id from start)
-- =========================================
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  user_id INT,
  restaurant_id INT NOT NULL,
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE INDEX idx_ratings_user ON ratings(user_id);
CREATE INDEX idx_ratings_restaurant ON ratings(restaurant_id);
CREATE INDEX idx_ratings_created ON ratings(created_at);

-- =========================================
-- 4. Create favorites table
-- =========================================
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, restaurant_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_restaurant ON favorites(restaurant_id);

-- =========================================
-- 5. Create menus table (optional - for future use)
-- =========================================
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  restaurant_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(512),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE INDEX idx_menus_restaurant ON menus(restaurant_id);
CREATE INDEX idx_menus_available ON menus(is_available);

-- =========================================
-- 6. Insert sample data
-- =========================================

-- Insert sample restaurants
INSERT INTO restaurants (name, description, image_url) VALUES
('ครัวป้าแดง', 'อาหารไทยรสจัด เมนูแกงต่างๆ อร่อยถูกปาก', 'https://picsum.photos/seed/rest1/400/300'),
('ข้าวมันไก่เจ๊โอ', 'ข้าวมันไก่ตอนเช้า สูตรต้นตำรับ ไก่นุ่ม น้ำจิ้มเด็ด', 'https://picsum.photos/seed/rest2/400/300'),
('ส้มตำป้าจ๋า', 'ส้มตำตำสด ปลาร้าแซ่บ ทานคู่กับไก่ย่าง', 'https://picsum.photos/seed/rest3/400/300'),
('ตั้งฉัตร เต้าหู้ไข่ใส่ไมโครเวฟ', 'เต้าหู้นุ่ม ไข่ใสใหญ่ สำหรับมื้อเช้า ราคาถูก', 'https://picsum.photos/seed/rest4/400/300'),
('บ้านรสชาติ', 'อาหารจานเดียว ข้าวผัดต่างๆ ราคาเป็นกันเอง', 'https://picsum.photos/seed/rest5/400/300'),
('ศรีวัฒนา', 'ก๋วยเตี๋ยวเนื้อสด ลูกชิ้น หมูกรอบ นึ่งมาทุกวัน', 'https://picsum.photos/seed/rest6/400/300');
('ก๋วยเตี๋ยวเรือลุงเจี๊ยบ', 'ก๋วยเตี๋ยวเรือ น้ำใส น้ำข้น เครื่องแน่น', 'https://picsum.photos/seed/rest4/400/300'),
('ข้าวขาหมูนายเล็ก', 'ข้าวขาหมูสูตรตำรับ หมูนุ่ม ไข่พะโล้หอม', 'https://picsum.photos/seed/rest5/400/300'),
('ชาบูหมูกระทะร้อน', 'ชาบูบุฟเฟ่ต์ หมู เนื้อ ทะเล ผักสด น้ำจิ้มหลากหลาย', 'https://picsum.photos/seed/rest6/400/300'),
('ร้านอาหารญี่ปุ่นซากุระ', 'ซูชิ ซาชิมิ สดใหม่ทุกวัน พร้อมเซ็ตเบนโตะ', 'https://picsum.photos/seed/rest7/400/300'),
('พิซซ่าเตาถ่าน', 'พิซซ่าเตาถ่าน แป้งบาง กรอบนอกนุ่มใน', 'https://picsum.photos/seed/rest8/400/300');

-- Insert sample ratings (user_id = NULL for now, will be filled when users login)
INSERT INTO ratings (user_id, restaurant_id, score, comment) VALUES
(NULL, 1, 5, 'อร่อยมาก! น้ำแกงเข้มข้น ราคาถูก'),
(NULL, 1, 4, 'อาหารอร่อย แต่รอนานหน่อย'),
(NULL, 1, 5, 'ชอบมาก กลับมากินอีกแน่นอน'),
(NULL, 2, 5, 'ข้าวมันไก่อร่อยที่สุดในย่านนี้'),
(NULL, 2, 4, 'อร่อย แต่ที่จอดรถน้อย'),
(NULL, 3, 5, 'ส้มตำแซ่บมาก ไก่ย่างเด็ด'),
(NULL, 3, 5, 'ชอบที่นี่มากๆ เผ็ดถูกปาก'),
(NULL, 3, 4, 'อร่อยดี แต่พริกเยอะไปนิด'),
(NULL, 4, 4, 'ก๋วยเตี๋ยวเรืออร่อย น้ำซุปเข้มข้น'),
(NULL, 5, 5, 'ขาหมูนุ่ม ไข่พะโล้หอม อร่อยมาก'),
(NULL, 5, 5, 'ที่นี่ดีที่สุด! กินทุกสัปดาห์'),
(NULL, 6, 4, 'ชาบูคุ้มค่า เนื้อดี ผักสด'),
(NULL, 7, 5, 'ซูชิสดมาก คุณภาพดี'),
(NULL, 8, 4, 'พิซซ่าอร่อย แต่ราคาค่อนข้างสูง');

-- =========================================
-- 6. Verify data
-- =========================================
SELECT '========== Restaurants ==========' AS Info;
SELECT * FROM restaurants;

SELECT '========== Users ==========' AS Info;
SELECT * FROM users;

SELECT '========== Ratings Summary ==========' AS Info;
SELECT 
  r.name AS restaurant_name,
  COUNT(rt.id) AS total_ratings,
  ROUND(AVG(rt.score), 1) AS avg_rating,
  MAX(rt.score) AS max_rating,
  MIN(rt.score) AS min_rating
FROM restaurants r
LEFT JOIN ratings rt ON r.id = rt.restaurant_id
GROUP BY r.id, r.name
ORDER BY avg_rating DESC, total_ratings DESC;

SELECT 'Database setup completed successfully!' AS Status;