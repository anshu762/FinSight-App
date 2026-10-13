export const FIXED_EPOCH = new Date('2024-01-01T00:00:00.000Z').getTime();

export type SeriesPeriod = '1D' | '1W' | '1M' | '3M' | '1Y';

export interface PricePoint {
  timestamp: string;
  price: number;
}

export function round2(num: number): number {
  return Math.round(num * 100) / 100;
}

export function getSymbolPhase(symbol: string): number {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash << 5) - hash + symbol.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash % 1000) / 1000) * 2 * Math.PI;
}

/**
 * Deterministic simulated pricing function.
 * Calculates asset price at any given timestamp without cron or price tables.
 */
export function getPrice(
  asset: { symbol: string; basePrice: number; volatility: number },
  date: Date = new Date()
): number {
  const h = (date.getTime() - FIXED_EPOCH) / (1000 * 60 * 60);
  const phase = getSymbolPhase(asset.symbol);
  const P1 = 40;
  const P2 = 9;

  const wave = 0.6 * Math.sin(h / P1 + phase) + 0.4 * Math.sin(h / P2 + 2 * phase);
  const rawPrice = asset.basePrice * (1 + asset.volatility * wave);

  return round2(Math.max(0.01, rawPrice));
}

/**
 * Calculates current price, price 24h prior, and 24h delta percentage.
 */
export function get24hPriceChange(
  asset: { symbol: string; basePrice: number; volatility: number },
  date: Date = new Date()
): {
  currentPrice: number;
  price24hAgo: number;
  change: number;
  changePct: number;
} {
  const currentPrice = getPrice(asset, date);
  const date24hAgo = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  const price24hAgo = getPrice(asset, date24hAgo);
  const change = round2(currentPrice - price24hAgo);
  const changePct = round2((change / price24hAgo) * 100);

  return {
    currentPrice,
    price24hAgo,
    change,
    changePct,
  };
}

/**
 * Generates historical series for sparklines and period charts.
 * Produces 24-52 points sorted chronologically.
 */
export function getSeries(
  asset: { symbol: string; basePrice: number; volatility: number },
  period: SeriesPeriod = '1D',
  date: Date = new Date()
): PricePoint[] {
  const points: PricePoint[] = [];
  const nowMs = date.getTime();

  let count = 24;
  let intervalMs = 60 * 60 * 1000; // 1 hour for 1D

  switch (period) {
    case '1D':
      count = 24;
      intervalMs = 60 * 60 * 1000; // 1 hour
      break;
    case '1W':
      count = 28;
      intervalMs = 6 * 60 * 60 * 1000; // 6 hours
      break;
    case '1M':
      count = 30;
      intervalMs = 24 * 60 * 60 * 1000; // 1 day
      break;
    case '3M':
      count = 45;
      intervalMs = 2 * 24 * 60 * 60 * 1000; // 2 days
      break;
    case '1Y':
      count = 52;
      intervalMs = 7 * 24 * 60 * 60 * 1000; // 1 week
      break;
  }

  for (let i = count - 1; i >= 0; i--) {
    const pointDate = new Date(nowMs - i * intervalMs);
    points.push({
      timestamp: pointDate.toISOString(),
      price: getPrice(asset, pointDate),
    });
  }

  return points;
}
