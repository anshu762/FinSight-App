import { type Request, type Response } from 'express';
import { getHomeDashboard } from './home.service.js';
import { ApiError } from '../../lib/api-error.js';
import { asyncHandler } from '../../utils/async-handler.js';

export const getHomeDashboardHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
    }
    const dashboard = await getHomeDashboard(req.user.id);
    res.status(200).json({
      success: true,
      data: dashboard,
    });
  }
);
