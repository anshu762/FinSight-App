import { type Request, type Response } from 'express';
import { updateCurrentUser } from './user.service.js';
import { ApiError } from '../../lib/api-error.js';

export const patchMeHandler = async (req: Request, res: Response): Promise<void> => {
  if (!req.user?.id) {
    throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
  }

  const updatedUser = await updateCurrentUser(req.user.id, req.body);
  res.status(200).json({
    success: true,
    data: { user: updatedUser },
  });
};
