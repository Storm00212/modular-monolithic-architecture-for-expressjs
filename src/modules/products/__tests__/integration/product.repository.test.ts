import { prisma } from '../../../config/db';
import { getProducts, getProductById } from '../../product.repository';

describe('product.repository - Integration', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Database Operations', () => {
    it('should count products in database', async () => {
      const count = await prisma.product.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should count users in database', async () => {
      const count = await prisma.user.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getProducts', () => {
    it('should return an array', async () => {
      const products = await getProducts();
      expect(Array.isArray(products)).toBe(true);
    });
  });

  describe('getProductById', () => {
    it('should return null for non-existent product', async () => {
      const product = await getProductById('non-existent-id');
      expect(product).toBeNull();
    });
  });
});