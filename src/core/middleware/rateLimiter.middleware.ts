import rateLimit from 'express-rate-limit';
import { Request } from 'express';

export const rateLimiter = rateLimit({
  windowMs:15*60000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests'
  },
  skip: (req: Request) => {
    return !req.ip;
  }
});