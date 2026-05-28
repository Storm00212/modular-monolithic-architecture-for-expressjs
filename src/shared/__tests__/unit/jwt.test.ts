import { generateToken } from '../../utils/jwt';
import jwt from 'jsonwebtoken';

describe('JWT Utils', () => {
  const testSecret = 'test-secret-key-for-testing-only';
  const testUserId = 'user-123';

  beforeAll(() => {
    process.env.JWT_SECRET = testSecret;
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(testUserId);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should create a token that can be verified', () => {
      const token = generateToken(testUserId);
      const decoded = jwt.verify(token, testSecret) as { id: string };
      expect(decoded.id).toBe(testUserId);
    });

    it('should set token expiration to 7 days', () => {
      const token = generateToken(testUserId);
      const decoded = jwt.decode(token) as { exp: number };
      const expectedExp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
      expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
      expect(decoded.exp).toBeCloseTo(expectedExp, -2);
    });

    it('should generate different tokens for different user IDs', () => {
      const token1 = generateToken('user-1');
      const token2 = generateToken('user-2');
      expect(token1).not.toBe(token2);
    });
  });
});