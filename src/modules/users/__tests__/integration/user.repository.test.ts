import { prisma } from '../../../config/db';
import { getUsers, getUserById } from '../../user.repository';

describe('user.repository - Integration', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('getUsers', () => {
    it('should return an array', async () => {
      const users = await getUsers();
      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe('getUserById', () => {
    it('should return null for non-existent user', async () => {
      const user = await getUserById('non-existent-id');
      expect(user).toBeNull();
    });
  });
});