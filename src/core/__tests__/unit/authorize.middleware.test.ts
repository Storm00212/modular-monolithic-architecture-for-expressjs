import { Request, Response, NextFunction } from 'express';
import { authorize } from '../../authorize.middleware';
import { AppError } from '../../errors/AppError';
import { AuthenticatedRequest } from '../auth.middleware';

describe('authorize.middleware', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    mockNext = jest.fn();
  });

  describe('authorize', () => {
    it('should return 401 when user is not authenticated', () => {
      const middleware = authorize(['ADMIN', 'USER']);
      middleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const errorCall = mockNext.mock.calls[0][0];
      expect(errorCall.message).toBe('Not authenticated');
      expect(errorCall.statusCode).toBe(401);
    });

    it('should return 403 when user role is not authorized', () => {
      mockRequest.user = { id: '1', email: 'user@test.com', role: 'USER' };
      const middleware = authorize(['ADMIN']);

      middleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const errorCall = mockNext.mock.calls[0][0];
      expect(errorCall.message).toBe('Not authorized to access this resource');
      expect(errorCall.statusCode).toBe(403);
    });

    it('should call next when user role is authorized', () => {
      mockRequest.user = { id: '1', email: 'admin@test.com', role: 'ADMIN' };
      const middleware = authorize(['ADMIN', 'USER']);

      middleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow access when user has one of multiple allowed roles', () => {
      mockRequest.user = { id: '1', email: 'user@test.com', role: 'USER' };
      const middleware = authorize(['ADMIN', 'USER', 'MODERATOR']);

      middleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});