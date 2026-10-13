import { AssetType } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../lib/api-error.js';
import {
  getPrice,
  get24hPriceChange,
  getSeries,
  round2,
  type SeriesPeriod,
} from './pricing.js';


export interface HoldingDetail {
  id: string;
  assetId: string;
  asset: {
    id: string;
    symbol: string;
    name: string;
    type: AssetType;
    allowFractional: boolean;
    minInvestment: number;
  };
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  value: number;
  gain: number;
  gainPct: number;
}

export interface AllocationItem {
  type: 'CASH' | AssetType;
  label: string;
  value: number;
  pct: number;
}

export interface PortfolioSummary {
  cash: number;
  holdingsValue: number;
  totalValue: number;
  totalReturn: number;
  totalReturnPct: number;
  dayChange: number;
  dayChangePct: number;
  bestPerformer: HoldingDetail | null;
  worstPerformer: HoldingDetail | null;
  allocation: AllocationItem[];
  holdings: HoldingDetail[];
}

export const getAssetsWithPrices = async (type?: AssetType, q?: string) => {
  const whereClause: {
    type?: AssetType;
    OR?: Array<{
      symbol?: { contains: string; mode: 'insensitive' };
      name?: { contains: string; mode: 'insensitive' };
    }>;
  } = {};

  if (type) {
    whereClause.type = type;
  }

  if (q && q.trim().length > 0) {
    const searchTerm = q.trim();
    whereClause.OR = [
      { symbol: { contains: searchTerm, mode: 'insensitive' } },
      { name: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  const assets = await prisma.asset.findMany({
    where: whereClause,
    orderBy: [{ type: 'asc' }, { symbol: 'asc' }],
  });

  return assets.map((asset) => {
    const priceInfo = get24hPriceChange(asset);
    return {
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type,
      basePrice: asset.basePrice,
      volatility: asset.volatility,
      minInvestment: asset.minInvestment,
      allowFractional: asset.allowFractional,
      currentPrice: priceInfo.currentPrice,
      dayChange: priceInfo.change,
      dayChangePct: priceInfo.changePct,
    };
  });
};

export const getAssetDetail = async (
  userId: string,
  assetId: string,
  period: SeriesPeriod = '1D'
) => {
  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });

  if (!asset) {
    throw ApiError.notFound('Asset not found', 'ASSET_NOT_FOUND');
  }

  const priceInfo = get24hPriceChange(asset);
  const series = getSeries(asset, period);

  const holding = await prisma.holding.findUnique({
    where: {
      userId_assetId: {
        userId,
        assetId,
      },
    },
  });

  let userHolding: {
    quantity: number;
    avgBuyPrice: number;
    currentPrice: number;
    value: number;
    gain: number;
    gainPct: number;
  } | null = null;

  if (holding && holding.quantity > 0) {
    const value = round2(holding.quantity * priceInfo.currentPrice);
    const cost = round2(holding.quantity * holding.avgBuyPrice);
    const gain = round2(value - cost);
    const gainPct = cost > 0 ? round2((gain / cost) * 100) : 0;

    userHolding = {
      quantity: holding.quantity,
      avgBuyPrice: holding.avgBuyPrice,
      currentPrice: priceInfo.currentPrice,
      value,
      gain,
      gainPct,
    };
  }

  return {
    asset: {
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type,
      basePrice: asset.basePrice,
      volatility: asset.volatility,
      minInvestment: asset.minInvestment,
      allowFractional: asset.allowFractional,
      currentPrice: priceInfo.currentPrice,
      dayChange: priceInfo.change,
      dayChangePct: priceInfo.changePct,
    },
    series,
    userHolding,
  };
};

export const getPortfolioSummary = async (userId: string): Promise<PortfolioSummary> => {
  const [user, userHoldings] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { cashBalance: true },
    }),
    prisma.holding.findMany({
      where: { userId, quantity: { gt: 0 } },
      include: { asset: true },
    }),
  ]);

  let holdingsValue = 0;
  let totalDayChange = 0;
  const mappedHoldings: HoldingDetail[] = [];

  const allocationMap: Record<'CASH' | AssetType, number> = {
    CASH: round2(user.cashBalance),
    STOCK: 0,
    ETF: 0,
    MUTUAL_FUND: 0,
    CRYPTO: 0,
  };

  for (const h of userHoldings) {
    const currentPrice = getPrice(h.asset);
    const price24hAgo = getPrice(h.asset, new Date(Date.now() - 24 * 3600000));

    const value = round2(h.quantity * currentPrice);
    const cost = round2(h.quantity * h.avgBuyPrice);
    const gain = round2(value - cost);
    const gainPct = cost > 0 ? round2((gain / cost) * 100) : 0;
    const dayGain = round2(h.quantity * (currentPrice - price24hAgo));

    holdingsValue += value;
    totalDayChange += dayGain;
    allocationMap[h.asset.type] += value;

    mappedHoldings.push({
      id: h.id,
      assetId: h.assetId,
      asset: {
        id: h.asset.id,
        symbol: h.asset.symbol,
        name: h.asset.name,
        type: h.asset.type,
        allowFractional: h.asset.allowFractional,
        minInvestment: h.asset.minInvestment,
      },
      quantity: h.quantity,
      avgBuyPrice: h.avgBuyPrice,
      currentPrice,
      value,
      gain,
      gainPct,
    });
  }

  holdingsValue = round2(holdingsValue);
  const totalValue = round2(user.cashBalance + holdingsValue);
  const startingCapital = 1000000;
  const totalReturn = round2(totalValue - startingCapital);
  const totalReturnPct = round2((totalReturn / startingCapital) * 100);

  const prevValue = totalValue - totalDayChange;
  const dayChangePct = prevValue > 0 ? round2((totalDayChange / prevValue) * 100) : 0;

  // Best & worst performers
  let bestPerformer: HoldingDetail | null = null;
  let worstPerformer: HoldingDetail | null = null;

  if (mappedHoldings.length > 0) {
    const sorted = [...mappedHoldings].sort((a, b) => b.gainPct - a.gainPct);
    bestPerformer = sorted[0];
    worstPerformer = sorted[sorted.length - 1];
  }

  // Allocation array with percentage calculation
  const allocationLabels: Record<'CASH' | AssetType, string> = {
    CASH: 'Cash',
    STOCK: 'Stocks',
    ETF: 'ETFs',
    MUTUAL_FUND: 'Mutual Funds',
    CRYPTO: 'Crypto',
  };

  const allocation: AllocationItem[] = (
    ['CASH', 'STOCK', 'ETF', 'MUTUAL_FUND', 'CRYPTO'] as const
  ).map((type) => {
    const val = round2(allocationMap[type]);
    const pct = totalValue > 0 ? round2((val / totalValue) * 100) : 0;
    return {
      type,
      label: allocationLabels[type],
      value: val,
      pct,
    };
  });

  return {
    cash: round2(user.cashBalance),
    holdingsValue,
    totalValue,
    totalReturn,
    totalReturnPct,
    dayChange: round2(totalDayChange),
    dayChangePct,
    bestPerformer,
    worstPerformer,
    allocation,
    holdings: mappedHoldings,
  };
};

export * from './portfolio.trade.js';

