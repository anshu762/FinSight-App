import { Router } from 'express';
import {
  listNewsHandler,
  getNewsArticleHandler,
  readNewsHandler,
} from './news.controller.js';
import { validate } from '../../middleware/validate.js';
import { listNewsSchema, newsIdParamSchema } from './news.schema.js';

export const newsRouter = Router();

newsRouter.get('/', validate(listNewsSchema), listNewsHandler);
newsRouter.get('/:id', validate(newsIdParamSchema), getNewsArticleHandler);
newsRouter.post('/:id/read', validate(newsIdParamSchema), readNewsHandler);
