import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppText } from '../ui';
import { type AssetType } from '../../api/types';

export type FilterType = 'ALL' | AssetType;

export const FILTER_TABS: Array<{ label: string; value: FilterType; icon: string }> = [
  { label: 'All', value: 'ALL', icon: '⚡' },
  { label: 'Stocks', value: 'STOCK', icon: '📈' },
  { label: 'ETFs', value: 'ETF', icon: '🧺' },
  { label: 'Mutual Funds', value: 'MUTUAL_FUND', icon: '🌱' },
  { label: 'Crypto', value: 'CRYPTO', icon: '🪙' },
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
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 12 }}
    >
      {FILTER_TABS.map((tab) => {
        const isSelected = selected === tab.value;
        return (
          <Pressable
            key={tab.value}
            onPress={() => handlePress(tab.value)}
            className={`flex-row items-center px-4 py-2 rounded-full border min-h-[38px] active:scale-95 shadow-xs ${
              isSelected
                ? 'bg-primary border-primary shadow-sm'
                : 'bg-slate-100/90 border-slate-200/90'
            }`}
            style={{ borderRadius: 9999 }}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Filter by ${tab.label}`}
          >
            <AppText className="text-xs mr-1.5">{tab.icon}</AppText>
            <AppText
              variant="caption"
              className={`font-semibold text-xs ${
                isSelected ? 'text-white' : 'text-slate-700'
              }`}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};
