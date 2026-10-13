import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPortfolio,
  getAssets,
  getAssetDetail,
  executeTrade,
  getTransactions,
  resetPortfolio,
} from '../api/portfolio';
import {
  type AssetType,
  type PortfolioSummary,
  type AssetItem,
  type AssetDetailResponse,
  type TradePayload,
  type TradeResult,
  type TransactionsResponse,
  type AppError,
} from '../api/types';

export const usePortfolio = () => {
  return useQuery<PortfolioSummary, AppError>({
    queryKey: ['portfolio'],
    queryFn: getPortfolio,
  });
};

export const useAssets = (params?: { type?: AssetType; q?: string }) => {
  return useQuery<AssetItem[], AppError>({
    queryKey: ['assets', params?.type, params?.q],
    queryFn: () => getAssets(params),
  });
};

export const useAssetDetail = (id: string, period = '1D') => {
  return useQuery<AssetDetailResponse, AppError>({
    queryKey: ['asset', id, period],
    queryFn: () => getAssetDetail(id, period),
    enabled: Boolean(id),
  });
};

export const useTrade = () => {
  const queryClient = useQueryClient();

  return useMutation<TradeResult, AppError, TradePayload>({
    mutationFn: (payload) => executeTrade(payload),
    onSuccess: () => {
      // Invalidate relevant queries after trade
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['asset'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useTransactions = (params?: {
  type?: AssetType;
  cursor?: string;
  limit?: number;
}) => {
  return useQuery<TransactionsResponse, AppError>({
    queryKey: ['transactions', params?.type, params?.cursor, params?.limit],
    queryFn: () => getTransactions(params),
  });
};

export const useResetPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string; cashBalance: number }, AppError, void>({
    mutationFn: () => resetPortfolio(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['asset'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
