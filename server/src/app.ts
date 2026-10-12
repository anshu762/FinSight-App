import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authRouter } from './modules/auth/auth.routes.js';
import { userRouter } from './modules/user/user.routes.js';
import { topicsRouter, lessonsRouter } from './modules/learn/learn.routes.js';
import { meRouter, badgeRouter } from './modules/gamification/gamification.routes.js';
import { homeRouter } from './modules/home/home.routes.js';
import { authenticate } from './middleware/auth.js';
import { authRateLimiter } from './middleware/rate-limiter.js';
import { notFoundHandler } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.',
    },
  },
});
app.use(globalLimiter);

// Health check endpoint with standard API envelope
const healthHandler = (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      message: 'Server connected',
      timestamp: new Date().toISOString(),
    },
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// API Modules
app.use('/api/auth', authRateLimiter, authRouter);
app.use('/api/users', userRouter);
app.use('/api/topics', authenticate, topicsRouter);
app.use('/api/lessons', authenticate, lessonsRouter);
app.use('/api/me', authenticate, meRouter);
app.use('/api/badges', authenticate, badgeRouter);
app.use('/api/home', authenticate, homeRouter);

// 404 Handler
app.use(notFoundHandler);

// Central Error Handler (must be last)
app.use(errorHandler);
