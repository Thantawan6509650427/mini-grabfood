import request from 'supertest';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

// ========================================
// Set environment variables BEFORE any imports
// ========================================
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
process.env.GOOGLE_CALLBACK_URL = 'http://localhost:5000/api/auth/google/callback';
process.env.SESSION_SECRET = 'test-session-secret';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.FRONTEND_URL = 'http://localhost:5173';

// ========================================
// 1. Mock database
// ========================================
const mockQuery = jest.fn();
const mockGetConnection = jest.fn();

jest.unstable_mockModule('../db.js', () => ({
  default: {
    query: mockQuery,
    getConnection: mockGetConnection.mockResolvedValue({
      release: jest.fn(),
    }),
  },
}));

// ========================================
// 2. Mock passport (optional - ถ้าไม่ต้องการทดสอบ OAuth flow)
// ========================================
jest.unstable_mockModule('passport', () => ({
  default: {
    use: jest.fn(),
    initialize: jest.fn(() => (req, res, next) => next()),
    session: jest.fn(() => (req, res, next) => next()),
    authenticate: jest.fn((strategy, options) => (req, res, next) => {
      if (strategy === 'google') {
        // Mock Google OAuth redirect
        return res.redirect('https://accounts.google.com/o/oauth2/auth');
      }
      next();
    }),
    serializeUser: jest.fn(),
    deserializeUser: jest.fn(),
  },
}));

// ========================================
// 3. Import AFTER mocking
// ========================================
const { default: pool } = await import('../db.js');
const { default: app } = await import('../app.js');

// ========================================
// 4. Tests
// ========================================
describe('Authentication API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockClear();
  });

  describe('GET /api/auth/google', () => {
    it('should redirect to Google OAuth', async () => {
      const response = await request(app)
        .get('/api/auth/google')
        .expect(302);

      expect(response.headers.location).toContain('accounts.google.com');
    });
  });

  describe('GET /api/auth/user', () => {
    it('should return user data with valid token', async () => {
      const mockUser = {
        id: 1,
        google_id: '123456789',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/photo.jpg',
      };

      mockQuery.mockResolvedValueOnce([[mockUser]]);

      const token = jwt.sign(
        { id: mockUser.id, email: mockUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = await request(app)
        .get('/api/auth/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/user')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token provided');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/user')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should return 401 if user not found', async () => {
      mockQuery.mockResolvedValueOnce([[]]);

      const token = jwt.sign(
        { id: 999, email: 'notfound@example.com' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = await request(app)
        .get('/api/auth/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully with valid token', async () => {
      mockQuery.mockResolvedValueOnce([[{ id: 1 }]]);

      const token = jwt.sign(
        { id: 1, email: 'test@example.com' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Logged out successfully',
      });
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token provided');
    });
  });
});

describe('Auth Middleware', () => {
  beforeEach(() => {
    mockQuery.mockClear();
  });

  it('should pass through with valid token', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
    };

    mockQuery.mockResolvedValueOnce([[mockUser]]);

    const token = jwt.sign(
      { id: mockUser.id, email: mockUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = await request(app)
      .get('/api/auth/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', mockUser.id);
  });

  it('should reject expired token', async () => {
    const token = jwt.sign(
      { id: 1, email: 'test@example.com' },
      process.env.JWT_SECRET,
      { expiresIn: '-1s' }
    );

    const response = await request(app)
      .get('/api/auth/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);

    expect(response.body).toHaveProperty('message', 'Invalid token');
  });
});