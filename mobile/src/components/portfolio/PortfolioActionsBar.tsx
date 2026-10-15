import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui';

interface PortfolioActionsBarProps {
  onExplore: () => void;
  onHistory: () => void;
  onReset: () => void;
}

export const PortfolioActionsBar: React.FC<PortfolioActionsBarProps> = ({
  onExplore,
  onHistory,
  onReset,
}) => {
  const actions = [
    {
      label: 'Explore',
      icon: 'search-outline' as const,
      isPrimary: true,
      onPress: onExplore,
    },
    {
      label: 'History',
      icon: 'time-outline' as const,
      isPrimary: false,
      onPress: onHistory,
    },
    {
      label: 'Reset ₹10L',
      icon: 'refresh-outline' as const,
      isPrimary: false,
      onPress: onReset,
    },
  ];

  return (
    <View className="flex-row gap-3 mb-4">
      {actions.map((act, idx) => (
        <Pressable
          key={idx}
          onPress={act.onPress}
          className={`flex-1 rounded-2xl p-3 items-center justify-center active:scale-98 active:opacity-80 shadow-xs border ${
            act.isPrimary
              ? 'bg-indigo-50/70 border-indigo-200/80'
              : 'bg-surface border-border'
          }`}
          accessibilityRole="button"
          accessibilityLabel={act.label}
        >
          <View
            className={`w-9 h-9 rounded-full items-center justify-center mb-1.5 ${
              act.isPrimary ? 'bg-primary' : 'bg-slate-100'
            }`}
          >
            <Ionicons
              name={act.icon}
              size={18}
              color={act.isPrimary ? '#FFFFFF' : '#4F46E5'}
            />
          </View>
          <AppText
            variant="caption"
            className={`font-bold text-xs ${
              act.isPrimary ? 'text-primary' : 'text-text'
            }`}
          >
            {act.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
};
