import { type Request, type Response } from 'express';
import { registerUser, loginUser, getUserProfile } from './auth.service.js';
import { ApiError } from '../../lib/api-error.js';

export const registerHandler = async (req: Request, res: Response): Promise<void> => {
  const result = await registerUser(req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
};

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  const result = await loginUser(req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
};

export const getMeHandler = async (req: Request, res: Response): Promise<void> => {
  if (!req.user?.id) {
    throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
  }

  const user = await getUserProfile(req.user.id);
  res.status(200).json({
    success: true,
    data: { user },
  });
};
