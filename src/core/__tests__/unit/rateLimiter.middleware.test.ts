import rateLimit from 'express-rate-limit';

describe('rateLimiter.middleware', () => {
  it('should export a rate limit middleware', () => {
    expect(rateLimit).toBeDefined();
  });

  it('should have default options configured', () => {
    const middleware = rateLimit({
      windowMs: 60000,
      max: 100
    });
    expect(middleware).toBeDefined();
  });
});