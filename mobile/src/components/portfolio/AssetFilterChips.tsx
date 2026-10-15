import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AppText } from '../ui';
import { type AssetType } from '../../api/types';

export type FilterType = 'ALL' | AssetType;

export const FILTER_TABS: Array<{
  label: string;
  value: FilterType;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { label: 'All', value: 'ALL', icon: 'layers-outline' },
  { label: 'Stocks', value: 'STOCK', icon: 'trending-up-outline' },
  { label: 'ETFs', value: 'ETF', icon: 'pie-chart-outline' },
  { label: 'Mutual Funds', value: 'MUTUAL_FUND', icon: 'leaf-outline' },
  { label: 'Crypto', value: 'CRYPTO', icon: 'swap-horizontal-outline' },
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
    <View className="shrink-0 mb-1">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 6 }}
        style={{ flexGrow: 0 }}
      >
      {FILTER_TABS.map((tab) => {
        const isSelected = selected === tab.value;
        const iconColor = isSelected ? '#FFFFFF' : '#64748B';
        return (
          <Pressable
            key={tab.value}
            onPress={() => handlePress(tab.value)}
            style={{ height: 36, borderRadius: 18 }}
            className={`flex-row items-center justify-center px-3.5 border active:opacity-85 ${
              isSelected
                ? 'bg-primary border-primary shadow-xs'
                : 'bg-slate-100/90 border-slate-200/90'
            }`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Filter by ${tab.label}`}
          >
            <Ionicons name={tab.icon} size={15} color={iconColor} style={{ marginRight: 6 }} />
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
  </View>
);
};
