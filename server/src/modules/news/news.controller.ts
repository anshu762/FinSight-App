import { type Request, type Response } from 'express';
import {
  getNewsArticles,
  getNewsArticleById,
  markArticleAsRead,
} from './news.service.js';
import { ApiError } from '../../lib/api-error.js';
import { asyncHandler } from '../../utils/async-handler.js';

export const listNewsHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
    }

    const { category, cursor, limit } = req.query as {
      category?: string;
      cursor?: string;
      limit?: string;
    };

    const parsedLimit = limit ? parseInt(limit, 10) : undefined;

    const result = await getNewsArticles({
      userId: req.user.id,
      category,
      cursor,
      limit: parsedLimit,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);

export const getNewsArticleHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
    }

    const article = await getNewsArticleById(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      data: article,
    });
  }
);

export const readNewsHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
    }

    const result = await markArticleAsRead(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);
