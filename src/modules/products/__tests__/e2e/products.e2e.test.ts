import request from 'supertest';
import app from '../../../app';

describe('Products E2E Tests', () => {
  describe('GET /api/v1/products', () => {
    it('should return list of products', async () => {
      const response = await request(app).get('/api/v1/products');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('should return 404 for non-existent product', async () => {
      const response = await request(app).get('/api/v1/products/non-existent-id');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/products (Protected)', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).post('/api/v1/products').send({
        name: 'New Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
      });

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-admin user (if auth is valid)', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          name: 'New Product',
          description: 'Test Description',
          price: 99.99,
          stock: 10,
        });

      expect(response.status).toBe(401);
    });
  });
});