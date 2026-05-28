import { AppError } from '../../core/errors/AppError';

describe('AppError', () => {
  it('should create an error with default status code 400', () => {
    const error = new AppError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
  });

  it('should create an error with custom status code', () => {
    const error = new AppError('Not found', 404);
    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
  });

  it('should be an instance of Error', () => {
    const error = new AppError('Test error');
    expect(error).toBeInstanceOf(Error);
  });
});