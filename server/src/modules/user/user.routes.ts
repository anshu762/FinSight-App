import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { patchMeSchema } from './user.schema.js';
import { patchMeHandler } from './user.controller.js';

export const userRouter = Router();

userRouter.patch('/me', authenticate, validate(patchMeSchema), asyncHandler(patchMeHandler));
