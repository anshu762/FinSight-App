import { Router } from 'express';
import {
  getTopicsHandler,
  getTopicBySlugHandler,
  getLessonByIdHandler,
  completeLessonHandler,
} from './learn.controller.js';
import { validate } from '../../middleware/validate.js';
import { completeLessonSchema } from './learn.schema.js';

export const topicsRouter = Router();
topicsRouter.get('/', getTopicsHandler);
topicsRouter.get('/:slug', getTopicBySlugHandler);

export const lessonsRouter = Router();
lessonsRouter.get('/:id', getLessonByIdHandler);
lessonsRouter.post('/:id/complete', validate(completeLessonSchema), completeLessonHandler);
