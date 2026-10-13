import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card } from '../ui';
import { formatIndianCurrency } from '../../lib/calculators';

interface PortfolioHeroCardProps {
  totalValue: number;
  totalReturn: number;
  totalReturnPct: number;
  dayChange: number;
  dayChangePct: number;
  cash: number;
}

export const PortfolioHeroCard: React.FC<PortfolioHeroCardProps> = ({
  totalValue,
  totalReturn,
  totalReturnPct,
  dayChange,
  dayChangePct,
  cash,
}) => {
  const isOverallPositive = totalReturn >= 0;
  const isDayPositive = dayChange >= 0;

  return (
    <Card className="p-5 bg-surface border-border mb-4">
      <View className="flex-row items-center justify-between mb-1">
        <AppText variant="caption" className="text-muted text-xs font-semibold uppercase tracking-wider">
          Total Portfolio Value
        </AppText>
        <View className="flex-row items-center bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
          <Ionicons name="cash-outline" size={12} color="#4F46E5" />
          <AppText variant="caption" className="text-primary font-bold text-[11px] ml-1">
            Cash: {formatIndianCurrency(cash)}
          </AppText>
        </View>
      </View>

      <AppText variant="title" className="text-3xl font-extrabold text-text mb-3">
        {formatIndianCurrency(totalValue)}
      </AppText>

      <View className="flex-row items-center justify-between pt-3 border-t border-slate-100">
        {/* Total Returns */}
        <View>
          <AppText variant="caption" className="text-muted text-[11px]">Overall P&L</AppText>
          <View className="flex-row items-center gap-1 mt-0.5">
            <Ionicons
              name={isOverallPositive ? 'arrow-up' : 'arrow-down'}
              size={13}
              color={isOverallPositive ? '#10B981' : '#EF4444'}
            />
            <AppText
              variant="body"
              className={`font-bold text-sm ${isOverallPositive ? 'text-emerald-600' : 'text-rose-600'}`}
            >
              {isOverallPositive ? '+' : ''}{formatIndianCurrency(totalReturn)} ({isOverallPositive ? '+' : ''}{totalReturnPct.toFixed(2)}%)
            </AppText>
          </View>
        </View>

        {/* 24h Day Change */}
        <View className="items-end">
          <AppText variant="caption" className="text-muted text-[11px]">24h Change</AppText>
          <AppText
            variant="body"
            className={`font-bold text-sm mt-0.5 ${isDayPositive ? 'text-emerald-600' : 'text-rose-600'}`}
          >
            {isDayPositive ? '+' : ''}{formatIndianCurrency(dayChange)} ({isDayPositive ? '+' : ''}{dayChangePct.toFixed(2)}%)
          </AppText>
        </View>
      </View>
    </Card>
  );
};
