import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card } from '../ui';
import { type AssetItem } from '../../api/types';
import { formatIndianCurrency } from '../../lib/calculators';

interface ExploreAssetCardProps {
  asset: AssetItem;
  onPress: () => void;
}

export const ExploreAssetCard: React.FC<ExploreAssetCardProps> = ({ asset, onPress }) => {
  const isPositive = asset.dayChangePct >= 0;

  return (
    <Pressable
      onPress={onPress}
      className="mb-2.5 active:opacity-85"
      accessibilityRole="button"
      accessibilityLabel={`${asset.symbol}, ${asset.name}`}
    >
      <Card className="p-3.5 bg-surface border-border flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center gap-1.5 mb-0.5">
            <AppText variant="body" className="font-bold text-text text-sm">
              {asset.symbol}
            </AppText>
            <View className="bg-slate-100 px-1.5 py-0.5 rounded">
              <AppText variant="caption" className="text-[10px] text-slate-600 font-semibold uppercase">
                {asset.type}
              </AppText>
            </View>
          </View>
          <AppText variant="caption" numberOfLines={1} className="text-muted text-xs">
            {asset.name}
          </AppText>
        </View>

        <View className="items-end">
          <AppText variant="body" className="font-bold text-text text-sm">
            {formatIndianCurrency(asset.currentPrice)}
          </AppText>
          <View className="flex-row items-center gap-0.5 mt-0.5">
            <Ionicons
              name={isPositive ? 'arrow-up' : 'arrow-down'}
              size={11}
              color={isPositive ? '#10B981' : '#EF4444'}
            />
            <AppText
              variant="caption"
              className={`font-semibold text-xs ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}
            >
              {isPositive ? '+' : ''}{asset.dayChangePct.toFixed(2)}%
            </AppText>
          </View>
        </View>
      </Card>
    </Pressable>
  );
};
