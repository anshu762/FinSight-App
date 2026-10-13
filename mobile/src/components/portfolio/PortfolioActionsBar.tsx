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
    { label: 'Explore', icon: 'search-outline' as const, color: '#3B82F6', onPress: onExplore },
    { label: 'History', icon: 'time-outline' as const, color: '#8B5CF6', onPress: onHistory },
    { label: 'Reset ₹10L', icon: 'refresh-outline' as const, color: '#F59E0B', onPress: onReset },
  ];

  return (
    <View className="flex-row gap-3 mb-4">
      {actions.map((act, idx) => (
        <Pressable
          key={idx}
          onPress={act.onPress}
          className="flex-1 bg-surface border border-border rounded-xl p-3 items-center justify-center active:opacity-75 shadow-xs"
          accessibilityRole="button"
          accessibilityLabel={act.label}
        >
          <View className="w-8 h-8 rounded-full items-center justify-center mb-1 bg-slate-50">
            <Ionicons name={act.icon} size={18} color={act.color} />
          </View>
          <AppText variant="caption" className="font-bold text-text text-xs">
            {act.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
};
