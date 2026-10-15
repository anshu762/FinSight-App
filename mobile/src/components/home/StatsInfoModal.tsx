import React from 'react';
import { View } from 'react-native';
import { AppText, ModalSheet } from '../ui';

export type StatsInfoType = 'xp' | 'level' | 'streak' | null;

interface StatsInfoModalProps {
  activeInfo: StatsInfoType;
  onClose: () => void;
  streak: number;
  longestStreak: number;
}

export const StatsInfoModal: React.FC<StatsInfoModalProps> = ({
  activeInfo,
  onClose,
  streak,
  longestStreak,
}) => {
  return (
    <ModalSheet
      visible={activeInfo !== null}
      onClose={onClose}
      title={
        activeInfo === 'level'
          ? 'Level Progression'
          : activeInfo === 'xp'
          ? 'Experience Points (XP)'
          : 'Login Streaks'
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
              Earn XP by completing micro-lessons, simulations, quizzes, reading news, and checking in daily.
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
                • Daily News Hub read: +25 XP (max 5/day)
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
  );
};
