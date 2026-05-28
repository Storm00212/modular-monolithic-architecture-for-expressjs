import request from 'supertest';
import app from '../../../app';

describe('Users E2E Tests', () => {
  describe('GET /api/v1/users (Protected)', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/v1/users');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/users/:id (Protected)', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/v1/users/user-123');
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/v1/users/:id (Protected - Admin Only)', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .patch('/api/v1/users/user-123')
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/v1/users/:id (Protected - Admin Only)', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).delete('/api/v1/users/user-123');
      expect(response.status).toBe(401);
    });
  });
});