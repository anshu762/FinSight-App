import React from 'react';
import { View } from 'react-native';
import { AppText, Card } from '../ui';
import { formatIndianCurrency } from '../../lib/calculators';

interface AssetPositionCardProps {
  symbol: string;
  holding?: {
    quantity: number;
    avgBuyPrice: number;
    value: number;
    gain: number;
    gainPct: number;
  } | null;
}

export const AssetPositionCard: React.FC<AssetPositionCardProps> = ({
  symbol,
  holding,
}) => {
  if (!holding || holding.quantity <= 0) {
    return (
      <Card className="p-4 bg-surface border-border mb-4">
        <AppText variant="caption" className="font-bold text-slate-700 uppercase text-xs mb-2">
          Your Investment Position
        </AppText>
        <View className="py-2 items-center">
          <AppText variant="caption" className="text-muted text-center text-xs">
            You do not currently hold any shares of {symbol}.
          </AppText>
        </View>
      </Card>
    );
  }

  const isPositive = holding.gain >= 0;

  return (
    <Card className="p-4 bg-surface border-border mb-4">
      <AppText variant="caption" className="font-bold text-slate-700 uppercase text-xs mb-2.5">
        Your Investment Position
      </AppText>

      <View className="gap-2.5">
        <View className="flex-row justify-between items-center">
          <AppText variant="caption" className="text-slate-600">
            Units Owned
          </AppText>
          <AppText variant="body" className="font-bold text-text">
            {holding.quantity} units
          </AppText>
        </View>

        <View className="flex-row justify-between items-center">
          <AppText variant="caption" className="text-slate-600">
            Average Buy Price
          </AppText>
          <AppText variant="body" className="font-bold text-text">
            {formatIndianCurrency(holding.avgBuyPrice)}
          </AppText>
        </View>

        <View className="flex-row justify-between items-center">
          <AppText variant="caption" className="text-slate-600">
            Current Position Value
          </AppText>
          <AppText variant="body" className="font-bold text-text">
            {formatIndianCurrency(holding.value)}
          </AppText>
        </View>

        <View className="h-[1px] bg-slate-100 my-0.5" />

        <View className="flex-row justify-between items-center">
          <AppText variant="caption" className="font-bold text-slate-700">
            Unrealized P&L
          </AppText>
          <AppText
            variant="caption"
            className={`font-bold text-sm ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isPositive ? '+' : ''}
            {formatIndianCurrency(holding.gain)} ({isPositive ? '+' : ''}
            {holding.gainPct}%)
          </AppText>
        </View>
      </View>
    </Card>
  );
};

