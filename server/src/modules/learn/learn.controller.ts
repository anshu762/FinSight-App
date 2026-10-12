import { type Request, type Response } from 'express';
import {
  getTopicsWithProgress,
  getTopicBySlug,
  getLessonById,
  completeLesson,
} from './learn.service.js';
import { ApiError } from '../../lib/api-error.js';
import { asyncHandler } from '../../utils/async-handler.js';

export const getTopicsHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
    }
    const topics = await getTopicsWithProgress(req.user.id);
    res.status(200).json({
      success: true,
      data: topics,
    });
  }
);

export const getTopicBySlugHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
    }
    const topicDetails = await getTopicBySlug(req.user.id, req.params.slug);
    res.status(200).json({
      success: true,
      data: topicDetails,
    });
  }
);

export const getLessonByIdHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
    }
    const lesson = await getLessonById(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      data: lesson,
    });
  }
);

export const completeLessonHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
    }
    const result = await completeLesson(req.user.id, req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  }
);
