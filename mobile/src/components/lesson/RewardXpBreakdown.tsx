import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card } from '../ui';

interface RewardXpBreakdownProps {
  breakdown: Array<{ item: string; xp: number }>;
}

export const RewardXpBreakdown: React.FC<RewardXpBreakdownProps> = ({ breakdown }) => {
  if (!breakdown || breakdown.length === 0) return null;

  return (
    <Card className="p-4 bg-surface border-border mb-4 w-full">
      <AppText variant="caption" className="font-bold text-slate-500 uppercase text-[11px] mb-2.5">
        XP Breakdown
      </AppText>

      <View className="gap-2">
        {breakdown.map((b, idx) => (
          <View key={idx} className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Ionicons
                name={b.xp >= 0 ? 'checkmark-circle' : 'remove-circle'}
                size={16}
                color={b.xp >= 0 ? '#10B981' : '#F59E0B'}
              />
              <AppText variant="body" className="text-sm text-text">
                {b.item}
              </AppText>
            </View>
            <AppText
              variant="caption"
              className={`font-bold text-sm ${b.xp >= 0 ? 'text-primary' : 'text-amber-600'}`}
            >
              {b.xp >= 0 ? `+${b.xp}` : b.xp} XP
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
};
