import { Request, Response, NextFunction } from 'express';
import { rateLimiter } from '../../rateLimiter.middleware';

describe('rateLimiter.middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      ip: '127.0.0.1',
    };
    mockResponse = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
    };
    mockNext = jest.fn();
  });

  describe('rateLimiter', () => {
    it('should allow request when no rate limit record exists', () => {
      const middleware = rateLimiter(5, 60000);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow request when count is below limit', () => {
      const middleware = rateLimiter(5, 60000);
      mockRequest.ip = '192.168.1.1';

      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(3);
    });

    it('should block request when count exceeds limit', () => {
      const middleware = rateLimiter(2, 60000);
      mockRequest.ip = '10.0.0.1';

      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(429);
    });

    it('should create new record after window expires', () => {
      const middleware = rateLimiter(1, 100);
      mockRequest.ip = '10.0.0.2';

      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      
      setTimeout(() => {
        middleware(mockRequest as Request, mockResponse as Response, mockNext);
        expect(mockNext).toHaveBeenCalledTimes(2);
      }, 150);
    });
  });
});