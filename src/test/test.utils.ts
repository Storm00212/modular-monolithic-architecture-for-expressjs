import { Request, Response, NextFunction } from 'express';

export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  headers: {},
  body: {},
  params: {},
  query: {},
  ...overrides,
});

export const createMockResponse = (): Partial<Response> => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const createMockNext = (): NextFunction => jest.fn();

export const mockToken = 'mock-jwt-token-for-testing';
export const mockDecodedToken = { id: 'user-123' };