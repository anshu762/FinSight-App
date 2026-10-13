import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppText } from '../ui';
import { type AssetType } from '../../api/types';

export type FilterType = 'ALL' | AssetType;

export const FILTER_TABS: Array<{ label: string; value: FilterType }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Stocks', value: 'STOCK' },
  { label: 'ETFs', value: 'ETF' },
  { label: 'Mutual Funds', value: 'MUTUAL_FUND' },
  { label: 'Crypto', value: 'CRYPTO' },
];

interface AssetFilterChipsProps {
  selected: FilterType;
  onSelect: (filter: FilterType) => void;
}

export const AssetFilterChips: React.FC<AssetFilterChipsProps> = ({
  selected,
  onSelect,
}) => {
  const handlePress = (val: FilterType) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    onSelect(val);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 10 }}
    >
      {FILTER_TABS.map((tab) => {
        const isSelected = selected === tab.value;
        return (
          <Pressable
            key={tab.value}
            onPress={() => handlePress(tab.value)}
            className={`px-3.5 py-1.5 rounded-chip border min-h-[36px] items-center justify-center active:opacity-80 ${
              isSelected ? 'bg-primary border-primary' : 'bg-surface border-border'
            }`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Filter by ${tab.label}`}
          >
            <AppText
              variant="caption"
              className={`font-semibold text-xs ${isSelected ? 'text-white' : 'text-slate-600'}`}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};
