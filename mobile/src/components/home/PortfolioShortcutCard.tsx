import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card } from '../ui';
import { formatIndianCurrency } from '../../lib/calculators';

interface PortfolioShortcutCardProps {
  cashBalance: number;
  portfolioValue: number | null;
  portfolio?: {
    totalValue: number;
    totalReturn: number;
    returnPct: number;
  } | null;
  onLaunchSimulator: () => void;
}

export const PortfolioShortcutCard: React.FC<PortfolioShortcutCardProps> = ({
  cashBalance,
  portfolioValue,
  portfolio,
  onLaunchSimulator,
}) => {
  const displayAmount =
    portfolio?.totalValue ?? (portfolioValue !== null ? portfolioValue : cashBalance);
  const returnPct = portfolio?.returnPct ?? 0;
  const isPositive = returnPct >= 0;

  return (
    <View className="mb-2">
      <View className="flex-row items-center justify-between mb-2.5">
        <AppText variant="h3">Virtual Portfolio</AppText>
        <View className="bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <AppText variant="caption" className="text-emerald-700 font-bold text-xs">
            Risk-Free Sandbox
          </AppText>
        </View>
      </View>

      <Card className="p-4 bg-surface border-border">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <AppText variant="caption" className="text-muted">
              Total Portfolio Value
            </AppText>
            <AppText variant="h2" className="text-text font-bold mt-0.5">
              {formatIndianCurrency(displayAmount)}
            </AppText>
            {portfolio ? (
              <View className="flex-row items-center gap-1 mt-0.5">
                <Ionicons
                  name={isPositive ? 'caret-up' : 'caret-down'}
                  size={12}
                  color={isPositive ? '#10B981' : '#EF4444'}
                />
                <AppText
                  variant="caption"
                  className={`font-bold text-xs ${
                    isPositive ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {returnPct}% all-time
                </AppText>
              </View>
            ) : null}
          </View>
          <View className="w-12 h-12 rounded-full bg-emerald-100/80 items-center justify-center">
            <Ionicons name="trending-up" size={24} color="#10B981" />
          </View>
        </View>

        <Pressable
          onPress={onLaunchSimulator}
          className="bg-emerald-600 rounded-button h-11 items-center justify-center flex-row gap-2 active:bg-emerald-700"
          accessibilityLabel="Launch virtual trading simulator"
        >
          <Ionicons name="pie-chart" size={16} color="#FFFFFF" />
          <AppText className="text-white font-bold text-sm">Open Simulator</AppText>
        </Pressable>
      </Card>
    </View>
  );
};
