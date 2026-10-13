import { apiClient } from './client';
import {
  type AssetType,
  type AssetItem,
  type AssetDetailResponse,
  type PortfolioSummary,
  type TradePayload,
  type TradeResult,
  type TransactionsResponse,
} from './types';

export const getAssets = async (params?: {
  type?: AssetType;
  q?: string;
}): Promise<AssetItem[]> => {
  return apiClient.get<unknown, AssetItem[]>('/api/portfolio/assets', {
    params,
  });
};

export const getAssetDetail = async (
  id: string,
  period = '1D'
): Promise<AssetDetailResponse> => {
  return apiClient.get<unknown, AssetDetailResponse>(`/api/portfolio/assets/${id}`, {
    params: { period },
  });
};

export const getPortfolio = async (): Promise<PortfolioSummary> => {
  return apiClient.get<unknown, PortfolioSummary>('/api/portfolio');
};

export const executeTrade = async (payload: TradePayload): Promise<TradeResult> => {
  return apiClient.post<unknown, TradeResult>('/api/portfolio/trade', payload);
};

export const getTransactions = async (params?: {
  type?: AssetType;
  cursor?: string;
  limit?: number;
}): Promise<TransactionsResponse> => {
  return apiClient.get<unknown, TransactionsResponse>('/api/portfolio/transactions', {
    params,
  });
};

export const resetPortfolio = async (): Promise<{
  message: string;
  cashBalance: number;
}> => {
  return apiClient.post<unknown, { message: string; cashBalance: number }>(
    '/api/portfolio/reset'
  );
};
