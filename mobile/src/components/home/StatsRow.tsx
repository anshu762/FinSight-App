import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card, ProgressBar, ModalSheet } from '../ui';
import { type LevelInfo } from '../../api/types';

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
  const [activeInfo, setActiveInfo] = useState<'xp' | 'level' | 'streak' | null>(null);

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

      {/* Info Modal */}
      <ModalSheet
        visible={activeInfo !== null}
        onClose={() => setActiveInfo(null)}
        title={
          activeInfo === 'level'
            ? 'Level Progression 🏆'
            : activeInfo === 'xp'
            ? 'Experience Points (XP) ⚡'
            : 'Login Streaks 🔥'
        }
        subtitle="FinSight Gamification Engine"
      >
        <View className="gap-3 py-2">
          {activeInfo === 'level' && (
            <>
              <AppText variant="body" className="text-slate-700 leading-6">
                Your level measures cumulative financial knowledge. As your XP grows, you level up and unlock higher mastery badges!
              </AppText>
              <View className="bg-slate-50 border border-border rounded-xl p-3.5 gap-1.5">
                <AppText variant="caption" className="text-slate-600">
                  • Cumulative XP formula: 50 × (Level - 1) × (Level + 2)
                </AppText>
                <AppText variant="caption" className="text-slate-600">
                  • Level 2 requires 200 XP
                </AppText>
                <AppText variant="caption" className="text-slate-600">
                  • Level 3 requires 500 XP
                </AppText>
                <AppText variant="caption" className="text-slate-600">
                  • Level 5 requires 1,400 XP
                </AppText>
              </View>
            </>
          )}

          {activeInfo === 'xp' && (
            <>
              <AppText variant="body" className="text-slate-700 leading-6">
                Earn XP by completing micro-lessons, simulations, quizzes, and checking in daily.
              </AppText>
              <View className="bg-slate-50 border border-border rounded-xl p-3.5 gap-1.5">
                <AppText variant="caption" className="text-slate-600">
                  • Micro Lesson completion: +100 XP
                </AppText>
                <AppText variant="caption" className="text-slate-600">
                  • Interactive Simulation: +150 XP
                </AppText>
                <AppText variant="caption" className="text-slate-600">
                  • Quiz (First try): +100 XP (Second try: +50 XP)
                </AppText>
                <AppText variant="caption" className="text-slate-600">
                  • Topic Mastery Bonus: +500 XP
                </AppText>
              </View>
            </>
          )}

          {activeInfo === 'streak' && (
            <>
              <AppText variant="body" className="text-slate-700 leading-6">
                Streaks reward everyday financial discipline. Log in every day before midnight IST to keep your flame burning!
              </AppText>
              <View className="bg-slate-50 border border-border rounded-xl p-3.5 gap-1.5">
                <AppText variant="caption" className="text-slate-600">
                  • Current streak: {streak} days
                </AppText>
                <AppText variant="caption" className="text-slate-600">
                  • All-time record: {longestStreak} days
                </AppText>
                <AppText variant="caption" className="text-slate-600">
                  • 7-day bonus: +200 XP • 30-day bonus: +1,000 XP
                </AppText>
              </View>
            </>
          )}
        </View>
      </ModalSheet>
    </>
  );
};
