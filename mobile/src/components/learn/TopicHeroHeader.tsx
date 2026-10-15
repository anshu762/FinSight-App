import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card, ProgressBar } from '../ui';

interface TopicHeroHeaderProps {
  icon: string;
  title: string;
  description: string;
  color: string;
  completedCount: number;
  totalCount: number;
}

export const TopicHeroHeader: React.FC<TopicHeroHeaderProps> = ({
  icon,
  title,
  description,
  color,
  completedCount,
  totalCount,
}) => {
  const progress = totalCount > 0 ? completedCount / totalCount : 0;
  const isAllDone = completedCount === totalCount && totalCount > 0;

  return (
    <Card className="p-4 bg-surface border-border mb-4">
      <View className="flex-row items-center gap-3 mb-2">
        <View
          style={{ backgroundColor: `${color}18` }}
          className="w-12 h-12 rounded-2xl items-center justify-center border border-slate-100"
        >
          <AppText className="text-2xl">{icon}</AppText>
        </View>
        <View className="flex-1">
          <AppText variant="h2" className="text-xl font-bold text-text">
            {title}
          </AppText>
          <AppText variant="caption" className="text-muted text-xs">
            {completedCount} of {totalCount} Levels Mastered
          </AppText>
        </View>
      </View>

      <AppText variant="body" className="text-muted text-xs leading-4 mb-3">
        {description}
      </AppText>

      <ProgressBar progress={progress} color={color} height={6} />

      {isAllDone && (
        <View className="mt-2.5 flex-row items-center bg-primary-soft px-2.5 py-1 rounded-lg border border-indigo-200">
          <Ionicons name="school" size={14} color="#4F46E5" style={{ marginRight: 4 }} />
          <AppText variant="caption" className="text-primary font-bold text-[11px]">
            Track Completed! +500 XP Topic Mastery Bonus Earned!
          </AppText>
        </View>
      )}
    </Card>
  );
};
