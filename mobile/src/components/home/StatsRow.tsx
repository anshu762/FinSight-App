import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card, ProgressBar } from '../ui';
import { type LevelInfo } from '../../api/types';
import { StatsInfoModal, type StatsInfoType } from './StatsInfoModal';

interface StatsRowProps {
  xp: number;
  streak: number;
  longestStreak: number;
  levelInfo: LevelInfo;
}

export const StatsRow: React.FC<StatsRowProps> = ({
  xp,
  streak,
  longestStreak,
  levelInfo,
}) => {
  const [activeInfo, setActiveInfo] = useState<StatsInfoType>(null);
  const formattedXp = xp.toLocaleString('en-IN');

  return (
    <>
      <View className="mb-4">
        {/* Level Banner Card */}
        <Pressable
          onPress={() => setActiveInfo('level')}
          className="active:opacity-95 mb-2.5"
          accessibilityLabel="View level progression details"
        >
          <Card className="p-4 bg-surface border-border">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-full bg-primary-soft items-center justify-center">
                  <Ionicons name="trophy" size={16} color="#4F46E5" />
                </View>
                <AppText variant="h3">Level {levelInfo.level}</AppText>
              </View>
              <AppText variant="caption" className="text-muted font-medium">
                {levelInfo.xpIntoLevel} / {levelInfo.xpForNextLevel} XP
              </AppText>
            </View>
            <ProgressBar progress={levelInfo.progress} color="#4F46E5" height={6} />
            <AppText variant="caption" className="text-muted mt-2 text-right">
              {levelInfo.xpForNextLevel - levelInfo.xpIntoLevel} XP to Level {levelInfo.level + 1}
            </AppText>
          </Card>
        </Pressable>

        {/* 2-column sub-stats: XP & Streak */}
        <View className="flex-row gap-3">
          {/* XP Card */}
          <Pressable
            onPress={() => setActiveInfo('xp')}
            className="flex-1 active:opacity-95"
            accessibilityLabel="View XP details"
          >
            <Card className="p-3.5 bg-surface border-border">
              <View className="flex-row items-center justify-between mb-1">
                <AppText variant="caption" className="text-muted">Total XP</AppText>
                <Ionicons name="flash" size={14} color="#F59E0B" />
              </View>
              <AppText variant="h2" className="text-amber-500 font-bold">
                {formattedXp}
              </AppText>
              <AppText variant="caption" className="text-muted mt-0.5">
                Earned from lessons
              </AppText>
            </Card>
          </Pressable>

          {/* Streak Card */}
          <Pressable
            onPress={() => setActiveInfo('streak')}
            className="flex-1 active:opacity-95"
            accessibilityLabel="View streak details"
          >
            <Card className="p-3.5 bg-surface border-border">
              <View className="flex-row items-center justify-between mb-1">
                <AppText variant="caption" className="text-muted">Active Streak</AppText>
                <Ionicons name="flame" size={16} color="#EF4444" />
              </View>
              <AppText variant="h2" className="text-rose-500 font-bold">
                {streak} {streak === 1 ? 'day' : 'days'}
              </AppText>
              <AppText variant="caption" className="text-muted mt-0.5">
                Best: {longestStreak} days
              </AppText>
            </Card>
          </Pressable>
        </View>
      </View>

      <StatsInfoModal
        activeInfo={activeInfo}
        onClose={() => setActiveInfo(null)}
        streak={streak}
        longestStreak={longestStreak}
      />
    </>
  );
};
