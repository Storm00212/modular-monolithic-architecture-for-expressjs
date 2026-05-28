import { prisma } from '../../config/db';

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
  process.env.NODE_ENV = 'test';
});

afterAll(async () => {
  await prisma.$disconnect();
});