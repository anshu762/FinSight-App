import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Button, Card, ProgressBar, Skeleton, ErrorState } from '../ui';
import { Confetti } from './Confetti';
import { LevelUpModal } from './LevelUpModal';
import { RewardXpBreakdown } from './RewardXpBreakdown';
import { RewardBadgesUnlocked } from './RewardBadgesUnlocked';
import { useLessonMachine } from '../../features/lesson/lessonMachine';
import { useCompleteLesson } from '../../hooks/useLesson';

export interface RewardStepProps {
  lessonId: string;
  topicSlug?: string;
  topicColor?: string;
  onNavigateNextLesson?: (nextLessonId: string) => void;
}

export const RewardStep: React.FC<RewardStepProps> = ({
  lessonId,
  topicSlug,
  topicColor = '#4F46E5',
  onNavigateNextLesson,
}) => {
  const router = useRouter();

  const quizAttempts = useLessonMachine((s) => s.quizAttempts);
  const hintsUsed = useLessonMachine((s) => s.hintsUsed);
  const completionResult = useLessonMachine((s) => s.completionResult);
  const isLevelUpModalVisible = useLessonMachine((s) => s.isLevelUpModalVisible);

  const setCompletionResult = useLessonMachine((s) => s.setCompletionResult);
  const setLevelUpModalVisible = useLessonMachine((s) => s.setLevelUpModalVisible);

  const { mutate, isPending, isError, error } = useCompleteLesson(lessonId, topicSlug);
  const [displayedXp, setDisplayedXp] = useState(0);

  const executeCompletion = () => {
    mutate({ quizAttempts, hintsUsed }, { onSuccess: (data) => setCompletionResult(data) });
  };

  useEffect(() => {
    if (!completionResult) executeCompletion();
  }, []);

  useEffect(() => {
    if (completionResult && completionResult.xpEarned > 0) {
      const target = completionResult.xpEarned;
      let step = 0;
      const interval = setInterval(() => {
        step += Math.ceil(target / 15);
        if (step >= target) {
          setDisplayedXp(target);
          clearInterval(interval);
          if (completionResult.leveledUp) setLevelUpModalVisible(true);
        } else {
          setDisplayedXp(step);
        }
      }, 40);
      return () => clearInterval(interval);
    }
  }, [completionResult?.xpEarned]);

  if (isPending && !completionResult) {
    return (
      <View className="flex-1 justify-center items-center px-5 gap-4">
        <Skeleton width={96} height={96} borderRadius={48} />
        <Skeleton width={180} height={28} />
        <Skeleton width="100%" height={140} borderRadius={16} />
      </View>
    );
  }

  if (isError && !completionResult) {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <ErrorState title="Completion Failed" message={error?.message || 'Failed to save lesson progress.'} onRetry={executeCompletion} />
      </View>
    );
  }

  const { xpEarned = 0, breakdown = [], newBadges = [], nextLesson, levelInfo } = completionResult || {};

  return (
    <View className="flex-1 justify-between">
      <Confetti />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, alignItems: 'center' }}>
        <View className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 items-center justify-center mb-3">
          <Ionicons name="checkmark-done" size={40} color="#059669" />
        </View>

        <AppText variant="title" className="text-2xl font-bold text-text text-center mb-1">
          Lesson Completed!
        </AppText>
        <AppText variant="body" className="text-muted text-center text-xs mb-4">
          Great work mastering these financial concepts.
        </AppText>

        <Card className="p-4 bg-primary-soft/50 border-primary/30 mb-4 w-full items-center">
          <AppText variant="caption" className="text-primary font-bold uppercase tracking-wider text-[11px] mb-1">
            Total XP Earned
          </AppText>
          <AppText variant="title" className="text-3xl font-extrabold text-primary">
            +{displayedXp} XP
          </AppText>
        </Card>

        {levelInfo && (
          <Card className="p-4 bg-surface border-border mb-4 w-full">
            <View className="flex-row justify-between mb-1.5">
              <AppText variant="caption" className="font-bold text-text">Level {levelInfo.level}</AppText>
              <AppText variant="caption" className="text-muted">{levelInfo.xpIntoLevel} / {levelInfo.xpForNextLevel} XP</AppText>
            </View>
            <ProgressBar progress={levelInfo.progress} color="#4F46E5" height={6} />
          </Card>
        )}

        <RewardXpBreakdown breakdown={breakdown} />
        <RewardBadgesUnlocked badges={newBadges} />
      </ScrollView>

      <View className="p-5 bg-surface border-t border-border">
        {nextLesson && onNavigateNextLesson ? (
          <Button title={`Next: ${nextLesson.title} →`} variant="primary" onPress={() => onNavigateNextLesson(nextLesson.id)} />
        ) : (
          <Button title="Back to Track" variant="primary" onPress={() => router.back()} />
        )}
      </View>

      {levelInfo && (
        <LevelUpModal
          visible={isLevelUpModalVisible}
          level={levelInfo.level}
          onContinue={() => setLevelUpModalVisible(false)}
        />

      )}
    </View>
  );
};
