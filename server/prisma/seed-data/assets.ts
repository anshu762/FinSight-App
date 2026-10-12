import { AssetType } from '@prisma/client';

export interface AssetSeed {
  symbol: string;
  name: string;
  type: AssetType;
  basePrice: number;
  volatility: number;
  minInvestment: number;
  allowFractional: boolean;
}

export const assetsSeedData: AssetSeed[] = [
  {
    symbol: 'NIFTYBEES',
    name: 'Nippon India Nifty 50 BeES ETF',
    type: AssetType.ETF,
    basePrice: 265.5,
    volatility: 0.12,
    minInvestment: 265.5,
    allowFractional: true,
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    type: AssetType.STOCK,
    basePrice: 2950.0,
    volatility: 0.18,
    minInvestment: 500.0,
    allowFractional: true,
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd',
    type: AssetType.STOCK,
    basePrice: 4200.0,
    volatility: 0.15,
    minInvestment: 500.0,
    allowFractional: true,
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    type: AssetType.STOCK,
    basePrice: 1680.0,
    volatility: 0.16,
    minInvestment: 500.0,
    allowFractional: true,
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    type: AssetType.STOCK,
    basePrice: 1890.0,
    volatility: 0.2,
    minInvestment: 500.0,
    allowFractional: true,
  },
  {
    symbol: 'GOLDBEES',
    name: 'Nippon India ETF Gold BeES',
    type: AssetType.ETF,
    basePrice: 62.4,
    volatility: 0.08,
    minInvestment: 100.0,
    allowFractional: true,
  },
  {
    symbol: 'PPFAS_FLEXI',
    name: 'Parag Parikh Flexi Cap Fund Direct-Growth',
    type: AssetType.MUTUAL_FUND,
    basePrice: 78.2,
    volatility: 0.14,
    minInvestment: 1000.0,
    allowFractional: true,
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    type: AssetType.CRYPTO,
    basePrice: 5500000.0,
    volatility: 0.45,
    minInvestment: 500.0,
    allowFractional: true,
  },
];
