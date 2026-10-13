import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui/AppText';
import { Card } from '../ui/Card';
import { type PortfolioHoldingItem } from '../../api/types';
import { formatIndianCurrency } from '../../lib/calculators';

export interface HoldingCardProps {
  holding: PortfolioHoldingItem;
  onPress?: () => void;
}

export const HoldingCard: React.FC<HoldingCardProps> = ({ holding, onPress }) => {
  const router = useRouter();
  const isPositive = holding.gain >= 0;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/portfolio/${holding.assetId}`);
    }
  };

  return (
    <Pressable
      onPress={handlePress}

      className="active:opacity-85 active:scale-[0.99] mb-2.5"
      accessibilityRole="button"
      accessibilityLabel={`Holding: ${holding.asset.symbol}, current value ${formatIndianCurrency(
        holding.value
      )}`}
    >
      <Card className="p-4 bg-surface border-border">
        {/* Top Row: Symbol, Name & Current Value */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1 pr-2">
            <View className="flex-row items-center gap-1.5 mb-0.5">
              <AppText variant="body" className="font-extrabold text-base text-text">
                {holding.asset.symbol}
              </AppText>
              <View className="bg-slate-100 px-1.5 py-0.2 rounded">
                <AppText className="text-[10px] font-bold text-slate-600 uppercase">
                  {holding.asset.type.replace('_', ' ')}
                </AppText>
              </View>
            </View>
            <AppText
              variant="caption"
              className="text-muted text-xs truncate"
              numberOfLines={1}
            >
              {holding.asset.name}
            </AppText>
          </View>

          <View className="items-end">
            <AppText variant="body" className="font-bold text-text text-base">
              {formatIndianCurrency(holding.value)}
            </AppText>
            {/* Gain / Loss with icon and text (never color alone) */}
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
                {formatIndianCurrency(holding.gain)} ({isPositive ? '+' : ''}
                {holding.gainPct}%)
              </AppText>
            </View>
          </View>
        </View>

        {/* Bottom Row: Units @ Avg & Current Price */}
        <View className="pt-2 border-t border-slate-100 flex-row justify-between items-center">
          <AppText variant="caption" className="text-slate-500 text-xs">
            {holding.quantity} units @ {formatIndianCurrency(holding.avgBuyPrice)}
          </AppText>
          <AppText variant="caption" className="text-slate-500 text-xs">
            LTP: {formatIndianCurrency(holding.currentPrice)}
          </AppText>
        </View>
      </Card>
    </Pressable>
  );
};
