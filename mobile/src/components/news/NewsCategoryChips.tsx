import React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AppText } from '../ui';
import { type NewsCategory } from '../../api/types';

export interface CategoryOption {
  key: NewsCategory | 'ALL';
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const CATEGORIES: CategoryOption[] = [
  { key: 'ALL', label: 'All', icon: 'newspaper-outline' },
  { key: 'STOCK_MARKET', label: 'Stocks', icon: 'trending-up-outline' },
  { key: 'INVESTING', label: 'Investing', icon: 'wallet-outline' },
  { key: 'TAXES', label: 'Taxes', icon: 'receipt-outline' },
  { key: 'CRYPTO', label: 'Crypto', icon: 'swap-horizontal-outline' },
];

interface NewsCategoryChipsProps {
  selected: NewsCategory | 'ALL';
  onSelect: (category: NewsCategory | 'ALL') => void;
}

export const NewsCategoryChips: React.FC<NewsCategoryChipsProps> = ({
  selected,
  onSelect,
}) => {
  const handlePress = (key: NewsCategory | 'ALL') => {
    if (key !== selected) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Fallback
      }
      onSelect(key);
    }
  };

  return (
    <View className="py-2.5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selected === cat.key;
          const iconColor = isSelected ? '#FFFFFF' : '#64748B';
          return (
            <Pressable
              key={cat.key}
              onPress={() => handlePress(cat.key)}
              hitSlop={6}
              style={{ height: 36, borderRadius: 18 }}
              className={`flex-row items-center justify-center px-3.5 border active:opacity-85 ${
                isSelected
                  ? 'bg-primary border-primary shadow-xs'
                  : 'bg-slate-100/90 border-slate-200/90'
              }`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Filter by ${cat.label}`}
            >
              <Ionicons name={cat.icon} size={15} color={iconColor} style={{ marginRight: 6 }} />
              <AppText
                variant="caption"
                className={`font-semibold text-xs ${
                  isSelected ? 'text-white' : 'text-slate-700'
                }`}
              >
                {cat.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
