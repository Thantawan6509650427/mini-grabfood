-- Mini GrabFood Database Schema
-- Run this to set up your database

-- Create database
CREATE DATABASE IF NOT EXISTS mini_grabfood CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mini_grabfood;

-- Drop existing tables (be careful in production!)
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS menus;
DROP TABLE IF EXISTS restaurants;

-- Create restaurants table
CREATE TABLE restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create ratings table
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  score TINYINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_restaurant (restaurant_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create menus table (optional - for future use)
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
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_restaurant (restaurant_id),
  INDEX idx_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample restaurants
INSERT INTO restaurants (name, description, image_url) VALUES
('ครัวป้าแดง', 'อาหารไทยรสจัด เมนูแกงต่างๆ อร่อยถูกปาก', 'https://picsum.photos/seed/rest1/400/300'),
('ข้าวมันไก่เจ๊โอ', 'ข้าวมันไก่ตอนเช้า สูตรต้นตำรับ ไก่นุ่ม น้ำจิ้มเด็ด', 'https://picsum.photos/seed/rest2/400/300'),
('ส้มตำป้าจ๋า', 'ส้มตำตำสด ปลาร้าแซ่บ ทานคู่กับไก่ย่าง', 'https://picsum.photos/seed/rest3/400/300'),
('ก๋วยเตี๋ยวเรือลุงเจี๊ยบ', 'ก๋วยเตี๋ยวเรือ น้ำใส น้ำข้น เครื่องแน่น', 'https://picsum.photos/seed/rest4/400/300'),
('ข้าวขาหมูนายเล็ก', 'ข้าวขาหมูสูตรตำรับ หมูนุ่ม ไข่พะโล้หอม', 'https://picsum.photos/seed/rest5/400/300'),
('ชาบูหมูกระทะร้อน', 'ชาบูบุฟเฟ่ต์ หมู เนื้อ ทะเล ผักสด น้ำจิ้มหลากหลาย', 'https://picsum.photos/seed/rest6/400/300'),
('ร้านอาหารญี่ปุ่นซากุระ', 'ซูชิ ซาชิมิ สดใหม่ทุกวัน พร้อมเซ็ตเบนโตะ', 'https://picsum.photos/seed/rest7/400/300'),
('พิซซ่าเตาถ่าน', 'พิซซ่าเตาถ่าน แป้งบาง กรอบนอกนุ่มใน', 'https://picsum.photos/seed/rest8/400/300');

-- Insert sample ratings
INSERT INTO ratings (restaurant_id, score, comment) VALUES
(1, 5, 'อร่อยมาก! น้ำแกงเข้มข้น ราคาถูก'),
(1, 4, 'อาหารอร่อย แต่รอนานหน่อย'),
(1, 5, 'ชอบมาก กลับมากินอีกแน่นอน'),
(2, 5, 'ข้าวมันไก่อร่อยที่สุดในย่านนี้'),
(2, 4, 'อร่อย แต่ที่จอดรถน้อย'),
(3, 5, 'ส้มตำแซ่บมาก ไก่ย่างเด็ด'),
(3, 5, 'ชอบที่นี่มากๆ เผ็ดถูกปาก'),
(3, 4, 'อร่อยดี แต่พริกเยอะไปนิด'),
(4, 4, 'ก๋วยเตี๋ยวเรืออร่อย น้ำซุปเข้มข้น'),
(5, 5, 'ขาหมูนุ่ม ไข่พะโล้หอม อร่อยมาก'),
(5, 5, 'ที่นี่ดีที่สุด! กินทุกสัปดาห์'),
(6, 4, 'ชาบูคุ้มค่า เนื้อดี ผักสด'),
(7, 5, 'ซูชิสดมาก คุณภาพดี'),
(8, 4, 'พิซซ่าอร่อย แต่ราคาค่อนข้างสูง');

-- Verify data
SELECT 'Restaurants:' AS Info;
SELECT * FROM restaurants;

SELECT 'Ratings Summary:' AS Info;
SELECT 
  r.name,
  COUNT(rt.id) AS rating_count,
  ROUND(AVG(rt.score), 1) AS avg_rating
FROM restaurants r
LEFT JOIN ratings rt ON r.id = rt.restaurant_id
GROUP BY r.id, r.name
ORDER BY avg_rating DESC;