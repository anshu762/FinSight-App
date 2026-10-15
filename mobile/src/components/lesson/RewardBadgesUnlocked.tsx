import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card } from '../ui';
export interface UnlockedBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity?: string;
  category?: string;
  requirementText?: string;
  earnedAt?: string;
}

interface RewardBadgesUnlockedProps {
  badges: UnlockedBadge[];
}

export const RewardBadgesUnlocked: React.FC<RewardBadgesUnlockedProps> = ({ badges }) => {

  if (!badges || badges.length === 0) return null;

  return (
    <Card className="p-4 bg-primary-soft/60 border-indigo-200 mb-4 w-full">
      <View className="flex-row items-center gap-1.5 mb-2.5">
        <Ionicons name="ribbon-outline" size={16} color="#4F46E5" />
        <AppText variant="caption" className="font-bold text-primary uppercase text-[11px]">
          New Badges Unlocked!
        </AppText>
      </View>

      <View className="gap-2">
        {badges.map((badge) => (
          <View key={badge.id} className="flex-row items-center gap-3 bg-surface p-2.5 rounded-xl border border-indigo-100">
            <AppText className="text-2xl">{badge.icon}</AppText>
            <View className="flex-1">
              <AppText variant="body" className="font-bold text-text text-sm">
                {badge.name}
              </AppText>
              <AppText variant="caption" className="text-muted text-xs leading-4">
                {badge.description}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
};
