import { type Request, type Response } from 'express';
import { dailyCheckIn } from './streak.service.js';
import { getAllBadgesForUser } from './badge.service.js';
import { ApiError } from '../../lib/api-error.js';
import { asyncHandler } from '../../utils/async-handler.js';

export const checkInHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
    }
    const result = await dailyCheckIn(req.user.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  }
);

export const getBadgesHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
    }
    const badges = await getAllBadgesForUser(req.user.id);
    res.status(200).json({
      success: true,
      data: badges,
    });
  }
);
