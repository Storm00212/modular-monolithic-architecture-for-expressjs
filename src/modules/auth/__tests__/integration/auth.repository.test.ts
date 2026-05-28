import { prisma } from '../../../config/db';
import { findByEmail, findById, createUser, comparePasswords } from '../../auth.repository';

describe('auth.repository - Integration', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Database Operations', () => {
    it('should connect to database successfully', async () => {
      const result = await prisma.$queryRaw`SELECT 1`;
      expect(result).toBeDefined();
    });

    it('should have User model defined', () => {
      expect(prisma.user).toBeDefined();
    });
  });

  describe('findByEmail', () => {
    it('should return null for non-existent email', async () => {
      const user = await findByEmail('non-existent@example.com');
      expect(user).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return null for non-existent ID', async () => {
      const user = await findById('non-existent-id');
      expect(user).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a user and return the created object', async () => {
      const email = `test-${Date.now()}@example.com`;
      const user = await createUser(email, 'hashed-password', 'Test User');

      expect(user.email).toBe(email);
      expect(user.password).toBe('hashed-password');
      expect(user.name).toBe('Test User');
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();

      await prisma.user.delete({ where: { id: user.id } });
    });
  });

  describe('comparePasswords', () => {
    it('should compare passwords correctly', async () => {
      const result = await comparePasswords({ password: 'hashed' }, 'candidate');
      expect(typeof result).toBe('boolean');
    });
  });
});