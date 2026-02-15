import request from 'supertest';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// โหลด test environment
dotenv.config({ path: '.env.test' });

// Import จริงๆ ไม่ mock!
const { default: pool } = await import('../../db.js');
const { default: app } = await import('../../app.js');

describe('Authentication API - Integration Tests', () => {
  let testUserId;
  let testToken;

  // ก่อนเริ่ม test ทำความสะอาด database
  beforeAll(async () => {
    // ลบข้อมูล test user ถ้ามี
    await pool.query('DELETE FROM users WHERE email LIKE ?', ['test-%@example.com']);
  });

  // หลังทุก test ทำความสะอาด
  afterAll(async () => {
    // ลบข้อมูล test user
    if (testUserId) {
      await pool.query('DELETE FROM users WHERE id = ?', [testUserId]);
    }
    // ปิด connection pool
    await pool.end();
  });

  describe('User Authentication Flow', () => {
    it('should create a user and return valid token', async () => {
      // 1. สร้าง test user ใน database
      const [result] = await pool.query(
        'INSERT INTO users (google_id, email, name, picture) VALUES (?, ?, ?, ?)',
        ['test-google-id-123', 'test-user@example.com', 'Test User', 'https://example.com/photo.jpg']
      );

      testUserId = result.insertId;

      // 2. สร้าง JWT token
      testToken = jwt.sign(
        { id: testUserId, email: 'test-user@example.com' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // 3. ทดสอบเรียก API จริงๆ
      const response = await request(app)
        .get('/api/auth/user')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);

      // 4. ตรวจสอบผลลัพธ์
      expect(response.body).toMatchObject({
        id: testUserId,
        email: 'test-user@example.com',
        name: 'Test User',
      });
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/user')
        .set('Authorization', 'Bearer invalid-token-xyz')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });

  describe('Restaurant Ratings Integration', () => {
    let testRestaurantId;

    beforeAll(async () => {
      // สร้าง test restaurant
      const [result] = await pool.query(
        'INSERT INTO restaurants (name, description) VALUES (?, ?)',
        ['Test Restaurant', 'A test restaurant']
      );
      testRestaurantId = result.insertId;
    });

    afterAll(async () => {
      // ลบ test restaurant
      if (testRestaurantId) {
        await pool.query('DELETE FROM restaurants WHERE id = ?', [testRestaurantId]);
      }
    });

    it('should add rating with authenticated user', async () => {
      const response = await request(app)
        .post(`/api/restaurants/${testRestaurantId}/rating`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({ score: 5, comment: 'Excellent!' })
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('rating_id');

      // ตรวจสอบใน database จริง
      const [ratings] = await pool.query(
        'SELECT * FROM ratings WHERE restaurant_id = ? AND user_id = ?',
        [testRestaurantId, testUserId]
      );

      expect(ratings.length).toBeGreaterThan(0);
      expect(ratings[0].score).toBe(5);
    });
  });
});