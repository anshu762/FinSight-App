import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui';
import { type AssetItem } from '../../api/types';
import { formatIndianCurrency } from '../../lib/calculators';

interface AssetHeaderCardProps {
  asset: AssetItem;
}

export const AssetHeaderCard: React.FC<AssetHeaderCardProps> = ({ asset }) => {
  const isPositive = asset.dayChange >= 0;

  return (
    <View className="mb-4">
      <View className="flex-row items-center gap-2 mb-1">
        <AppText variant="h3" className="text-muted">
          {asset.name}
        </AppText>
        <View className="bg-slate-100 px-2 py-0.5 rounded-full">
          <AppText className="text-[10px] font-bold text-slate-600 uppercase">
            {asset.type.replace('_', ' ')}
          </AppText>
        </View>
      </View>

      <AppText variant="h2" className="text-3xl font-black text-text mb-1">
        {formatIndianCurrency(asset.currentPrice)}
      </AppText>

      <View className="flex-row items-center gap-1.5">
        <Ionicons
          name={isPositive ? 'caret-up' : 'caret-down'}
          size={14}
          color={isPositive ? '#10B981' : '#EF4444'}
        />
        <AppText
          variant="caption"
          className={`font-bold text-sm ${
            isPositive ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {isPositive ? '+' : ''}
          {formatIndianCurrency(asset.dayChange)} ({isPositive ? '+' : ''}
          {asset.dayChangePct}%)
        </AppText>
        <AppText variant="caption" className="text-slate-400 text-xs">
          Past 24 hours
        </AppText>
      </View>
    </View>
  );
};
