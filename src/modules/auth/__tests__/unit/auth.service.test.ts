import {
  registerUser,
  loginUser,
  getProfile,
} from '../../services/auth.service';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../shared/utils/jwt';

jest.mock('../../../shared/utils/jwt');
jest.mock('bcryptjs');

const findByEmail = jest.fn();
const createUser = jest.fn();
const comparePasswords = jest.fn();
const findById = jest.fn();

jest.mock('../../auth.repository', () => ({
  findByEmail: () => findByEmail(),
  createUser: () => createUser(),
  comparePasswords: () => comparePasswords(),
  findById: () => findById(),
}));

describe('auth.service', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashed-password',
    name: 'Test User',
    role: 'USER',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    (generateToken as jest.Mock).mockReturnValue('mock-token');
  });

  describe('registerUser', () => {
    it('should throw error if email is invalid', async () => {
      await expect(
        registerUser({ email: 'invalid-email', password: 'password123', name: 'Test' })
      ).rejects.toThrow();
    });

    it('should throw error if password is too short', async () => {
      await expect(
        registerUser({ email: 'test@example.com', password: '12345', name: 'Test' })
      ).rejects.toThrow();
    });

    it('should throw error if user already exists', async () => {
      findByEmail.mockResolvedValue(mockUser);

      await expect(
        registerUser({ email: 'test@example.com', password: 'password123', name: 'Test' })
      ).rejects.toThrow('User already exists');
    });

    it('should create a new user and return token', async () => {
      findByEmail.mockResolvedValue(null);
      createUser.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const result = await registerUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result.token).toBe('mock-token');
      expect(result.user.email).toBe('test@example.com');
    });
  });

  describe('loginUser', () => {
    it('should throw error if email is invalid', async () => {
      await expect(
        loginUser({ email: 'invalid', password: 'password123' })
      ).rejects.toThrow();
    });

    it('should throw error if user not found', async () => {
      findByEmail.mockResolvedValue(null);

      await expect(
        loginUser({ email: 'test@example.com', password: 'password123' })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password is invalid', async () => {
      findByEmail.mockResolvedValue(mockUser);
      comparePasswords.mockResolvedValue(false);

      await expect(
        loginUser({ email: 'test@example.com', password: 'wrong-password' })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should return token and user on successful login', async () => {
      findByEmail.mockResolvedValue(mockUser);
      comparePasswords.mockResolvedValue(true);

      const result = await loginUser({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.token).toBe('mock-token');
      expect(result.user.id).toBe('user-123');
    });
  });

  describe('getProfile', () => {
    it('should throw error if user not found', async () => {
      findById.mockResolvedValue(null);

      await expect(getProfile('user-123')).rejects.toThrow('User not found');
    });

    it('should return user profile without password', async () => {
      findById.mockResolvedValue(mockUser);

      const result = await getProfile('user-123');

      expect(result.email).toBe('test@example.com');
      expect((result as any).password).toBeUndefined();
    });
  });
});