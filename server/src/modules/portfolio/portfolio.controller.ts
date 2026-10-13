import { type Request, type Response } from 'express';
import { AssetType } from '@prisma/client';
import { asyncHandler } from '../../utils/async-handler.js';
import { ApiError } from '../../lib/api-error.js';
import {
  getAssetsWithPrices,
  getAssetDetail,
  getPortfolioSummary,
  executeTrade,
  getTransactions,
  resetPortfolio,
} from './portfolio.service.js';
import { type SeriesPeriod } from './pricing.js';

export const getAssetsHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const type = req.query.type as AssetType | undefined;
    const q = req.query.q as string | undefined;

    const assets = await getAssetsWithPrices(type, q);
    res.status(200).json({
      success: true,
      data: assets,
    });
  }
);

export const getAssetDetailHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
    }

    const assetId = req.params.id;
    const period = (req.query.period as SeriesPeriod) || '1D';

    const detail = await getAssetDetail(req.user.id, assetId, period);
    res.status(200).json({
      success: true,
      data: detail,
    });
  }
);

export const getPortfolioSummaryHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
    }

    const summary = await getPortfolioSummary(req.user.id);
    res.status(200).json({
      success: true,
      data: summary,
    });
  }
);

export const executeTradeHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
    }

    const result = await executeTrade(req.user.id, req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  }
);

export const getTransactionsHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
    }

    const type = req.query.type as AssetType | undefined;
    const cursor = req.query.cursor as string | undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const history = await getTransactions(req.user.id, { type, cursor, limit });
    res.status(200).json({
      success: true,
      data: history,
    });
  }
);

export const resetPortfolioHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw ApiError.unauthorized('Authentication required', 'UNAUTHORIZED');
    }

    const result = await resetPortfolio(req.user.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  }
);
