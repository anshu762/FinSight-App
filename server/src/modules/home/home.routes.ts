import { Router } from 'express';
import { getHomeDashboardHandler } from './home.controller.js';

export const homeRouter = Router();
homeRouter.get('/', getHomeDashboardHandler);
