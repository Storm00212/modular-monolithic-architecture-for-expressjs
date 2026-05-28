import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { AppError } from '../../../errors/AppError';

const mockFindById = jest.fn();

jest.mock('../../../modules/auth/auth.repository', () => ({
  findById: () => mockFindById(),
}));
jest.mock('jsonwebtoken');

describe('auth.middleware', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should return 401 when no authorization header is provided', async () => {
      await authenticate(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const errorCall = mockNext.mock.calls[0][0];
      expect(errorCall.message).toBe('No token provided');
      expect(errorCall.statusCode).toBe(401);
    });

    it('should return 401 when authorization header does not start with Bearer', async () => {
      mockRequest.headers = { authorization: 'InvalidFormat token123' };

      await authenticate(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const errorCall = mockNext.mock.calls[0][0];
      expect(errorCall.message).toBe('No token provided');
    });

    it('should return 401 when token is invalid', async () => {
      mockRequest.headers = { authorization: 'Bearer invalid-token' };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authenticate(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const errorCall = mockNext.mock.calls[0][0];
      expect(errorCall.message).toBe('Invalid token');
    });

    it('should return 401 when user is not found', async () => {
      mockRequest.headers = { authorization: 'Bearer valid-token' };
      (jwt.verify as jest.Mock).mockReturnValue({ id: 'user-123' });
      mockFindById.mockResolvedValue(null);

      await authenticate(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const errorCall = mockNext.mock.calls[0][0];
      expect(errorCall.message).toBe('User not found');
    });

    it('should set req.user and call next when authentication succeeds', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'USER',
        password: 'hashed-password',
      };

      mockRequest.headers = { authorization: 'Bearer valid-token' };
      (jwt.verify as jest.Mock).mockReturnValue({ id: 'user-123' });
      mockFindById.mockResolvedValue(mockUser);

      await authenticate(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect((mockRequest as AuthenticatedRequest).user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });
  });
});