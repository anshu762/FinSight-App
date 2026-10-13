import React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppText } from '../ui';
import { type NewsCategory } from '../../api/types';

export interface CategoryOption {
  key: NewsCategory | 'ALL';
  label: string;
  emoji: string;
}

const CATEGORIES: CategoryOption[] = [
  { key: 'ALL', label: 'All', emoji: '📰' },
  { key: 'STOCK_MARKET', label: 'Stocks', emoji: '📈' },
  { key: 'INVESTING', label: 'Investing', emoji: '🌱' },
  { key: 'TAXES', label: 'Taxes', emoji: '🧾' },
  { key: 'CRYPTO', label: 'Crypto', emoji: '🪙' },
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
          return (
            <Pressable
              key={cat.key}
              onPress={() => handlePress(cat.key)}
              hitSlop={6}
              className={`flex-row items-center px-3.5 py-2 rounded-chip border min-h-[38px] active:opacity-80 ${
                isSelected
                  ? 'bg-primary border-primary'
                  : 'bg-surface border-border'
              }`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Filter by ${cat.label}`}
            >
              <AppText className="text-xs mr-1.5">{cat.emoji}</AppText>
              <AppText
                variant="caption"
                className={`font-semibold text-xs ${
                  isSelected ? 'text-white' : 'text-slate-600'
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
