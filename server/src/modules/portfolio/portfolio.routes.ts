import { Router } from 'express';
import {
  getAssetsHandler,
  getAssetDetailHandler,
  getPortfolioSummaryHandler,
  executeTradeHandler,
  getTransactionsHandler,
  resetPortfolioHandler,
} from './portfolio.controller.js';
import { validate } from '../../middleware/validate.js';
import {
  tradeSchema,
  assetQuerySchema,
  assetDetailQuerySchema,
  transactionsQuerySchema,
} from './portfolio.schema.js';

export const portfolioRouter = Router();

portfolioRouter.get('/assets', validate(assetQuerySchema), getAssetsHandler);
portfolioRouter.get('/assets/:id', validate(assetDetailQuerySchema), getAssetDetailHandler);
portfolioRouter.get('/', getPortfolioSummaryHandler);
portfolioRouter.post('/trade', validate(tradeSchema), executeTradeHandler);
portfolioRouter.get('/transactions', validate(transactionsQuerySchema), getTransactionsHandler);
portfolioRouter.post('/reset', resetPortfolioHandler);
