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
  // 1. STOCKS (min 100, no fractional, vol 0.08)
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    type: AssetType.STOCK,
    basePrice: 2450.0,
    volatility: 0.08,
    minInvestment: 100.0,
    allowFractional: false,
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd',
    type: AssetType.STOCK,
    basePrice: 3680.0,
    volatility: 0.08,
    minInvestment: 100.0,
    allowFractional: false,
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    type: AssetType.STOCK,
    basePrice: 1620.0,
    volatility: 0.08,
    minInvestment: 100.0,
    allowFractional: false,
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    type: AssetType.STOCK,
    basePrice: 1540.0,
    volatility: 0.08,
    minInvestment: 100.0,
    allowFractional: false,
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd',
    type: AssetType.STOCK,
    basePrice: 980.0,
    volatility: 0.09,
    minInvestment: 100.0,
    allowFractional: false,
  },
  {
    symbol: 'ITC',
    name: 'ITC Ltd',
    type: AssetType.STOCK,
    basePrice: 460.0,
    volatility: 0.06,
    minInvestment: 100.0,
    allowFractional: false,
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    type: AssetType.STOCK,
    basePrice: 1240.0,
    volatility: 0.07,
    minInvestment: 100.0,
    allowFractional: false,
  },
  {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd',
    type: AssetType.STOCK,
    basePrice: 1480.0,
    volatility: 0.07,
    minInvestment: 100.0,
    allowFractional: false,
  },
  {
    symbol: 'ZOMATO',
    name: 'Zomato Ltd',
    type: AssetType.STOCK,
    basePrice: 215.0,
    volatility: 0.11,
    minInvestment: 100.0,
    allowFractional: false,
  },
  {
    symbol: 'TITAN',
    name: 'Titan Company Ltd',
    type: AssetType.STOCK,
    basePrice: 3550.0,
    volatility: 0.07,
    minInvestment: 100.0,
    allowFractional: false,
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    type: AssetType.STOCK,
    basePrice: 820.0,
    volatility: 0.08,
    minInvestment: 100.0,
    allowFractional: false,
  },
  {
    symbol: 'WIPRO',
    name: 'Wipro Ltd',
    type: AssetType.STOCK,
    basePrice: 490.0,
    volatility: 0.08,
    minInvestment: 100.0,
    allowFractional: false,
  },
  {
    symbol: 'ASIANPAINT',
    name: 'Asian Paints Ltd',
    type: AssetType.STOCK,
    basePrice: 2900.0,
    volatility: 0.07,
    minInvestment: 100.0,
    allowFractional: false,
  },

  // 2. ETFS (min 500, no fractional, vol 0.05)
  {
    symbol: 'NIFTYBEES',
    name: 'Nippon India Nifty 50 BeES ETF',
    type: AssetType.ETF,
    basePrice: 250.0,
    volatility: 0.05,
    minInvestment: 500.0,
    allowFractional: false,
  },
  {
    symbol: 'GOLDBEES',
    name: 'Nippon India ETF Gold BeES',
    type: AssetType.ETF,
    basePrice: 60.0,
    volatility: 0.05,
    minInvestment: 500.0,
    allowFractional: false,
  },
  {
    symbol: 'BANKBEES',
    name: 'Nippon India ETF Bank BeES',
    type: AssetType.ETF,
    basePrice: 520.0,
    volatility: 0.05,
    minInvestment: 500.0,
    allowFractional: false,
  },

  // 3. MUTUAL FUNDS (min 500, fractional allowed, vol 0.04)
  {
    symbol: 'LARGE_CAP_FUND',
    name: 'SBI Bluechip Large Cap Fund Direct-Growth',
    type: AssetType.MUTUAL_FUND,
    basePrice: 85.0,
    volatility: 0.04,
    minInvestment: 500.0,
    allowFractional: true,
  },
  {
    symbol: 'MID_CAP_FUND',
    name: 'HDFC Mid-Cap Opportunities Fund Direct-Growth',
    type: AssetType.MUTUAL_FUND,
    basePrice: 120.0,
    volatility: 0.04,
    minInvestment: 500.0,
    allowFractional: true,
  },
  {
    symbol: 'ELSS_FUND',
    name: 'Mirae Asset ELSS Tax Saver Fund Direct-Growth',
    type: AssetType.MUTUAL_FUND,
    basePrice: 95.0,
    volatility: 0.04,
    minInvestment: 500.0,
    allowFractional: true,
  },

  // 4. CRYPTO (min 100, fractional allowed, vol 0.25)
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    type: AssetType.CRYPTO,
    basePrice: 6000000.0,
    volatility: 0.25,
    minInvestment: 100.0,
    allowFractional: true,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    type: AssetType.CRYPTO,
    basePrice: 250000.0,
    volatility: 0.25,
    minInvestment: 100.0,
    allowFractional: true,
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    type: AssetType.CRYPTO,
    basePrice: 15.0,
    volatility: 0.25,
    minInvestment: 100.0,
    allowFractional: true,
  },
];
