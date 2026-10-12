import { Router } from 'express';
import { checkInHandler, getBadgesHandler } from './gamification.controller.js';

export const meRouter = Router();
meRouter.post('/checkin', checkInHandler);

export const badgeRouter = Router();
badgeRouter.get('/', getBadgesHandler);
