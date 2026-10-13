import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui/AppText';
import { type PortfolioHoldingItem } from '../../api/types';

export interface PerformerChipProps {
  type: 'best' | 'worst';
  holding: PortfolioHoldingItem | null;
}

export const PerformerChip: React.FC<PerformerChipProps> = ({ type, holding }) => {
  const router = useRouter();

  if (!holding) return null;

  const isBest = type === 'best';
  const isPositive = holding.gainPct >= 0;

  const handlePress = () => {
    router.push(`/portfolio/${holding.assetId}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`flex-1 p-2.5 rounded-xl border flex-row items-center gap-2 active:opacity-80 ${
        isBest
          ? 'bg-emerald-50/70 border-emerald-200'
          : 'bg-rose-50/70 border-rose-200'
      }`}
      accessibilityRole="button"
      accessibilityLabel={`${isBest ? 'Top performer' : 'Lagging asset'}: ${
        holding.asset.symbol
      }`}
    >
      <View
        className={`w-7 h-7 rounded-full items-center justify-center ${
          isBest ? 'bg-emerald-100' : 'bg-rose-100'
        }`}
      >
        <Ionicons
          name={isBest ? 'trending-up' : 'trending-down'}
          size={16}
          color={isBest ? '#059669' : '#E11D48'}
        />
      </View>

      <View className="flex-1">
        <AppText
          variant="caption"
          className={`text-[10px] font-bold uppercase tracking-wider ${
            isBest ? 'text-emerald-800' : 'text-rose-800'
          }`}
        >
          {isBest ? 'Top Gainer' : 'Top Dip'}
        </AppText>
        <View className="flex-row items-baseline gap-1">
          <AppText variant="body" className="font-extrabold text-xs text-text">
            {holding.asset.symbol}
          </AppText>
          <AppText
            variant="caption"
            className={`font-bold text-[11px] ${
              isPositive ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {isPositive ? '+' : ''}
            {holding.gainPct}%
          </AppText>
        </View>
      </View>
    </Pressable>
  );
};
