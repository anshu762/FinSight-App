import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { registerHandler, loginHandler, getMeHandler } from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), asyncHandler(registerHandler));
authRouter.post('/login', validate(loginSchema), asyncHandler(loginHandler));
authRouter.get('/me', authenticate, asyncHandler(getMeHandler));
