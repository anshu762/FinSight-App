import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui';
import { type HomeDashboard } from '../../api/types';

interface ContinueLearningCardProps {
  continueLesson: HomeDashboard['continueLesson'];
  onPressLesson: (lessonId: string, slug: string) => void;
  onPressLearnTab: () => void;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  continueLesson,
  onPressLesson,
  onPressLearnTab,
}) => {
  if (!continueLesson) {
    return (
      <View className="bg-primary rounded-card p-5 mb-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <AppText className="text-xl">🎉</AppText>
            <AppText className="text-white font-bold text-base">
              All Lessons Completed!
            </AppText>
          </View>
        </View>
        <AppText className="text-indigo-100 text-sm mb-4 leading-5">
          You have mastered all available topics. Review lessons or practice in the simulator.
        </AppText>
        <Pressable
          onPress={onPressLearnTab}
          className="bg-white rounded-button h-11 items-center justify-center flex-row gap-2 active:bg-slate-100"
          accessibilityLabel="Explore learn tab"
        >
          <AppText className="text-primary font-bold text-sm">Explore Topics</AppText>
          <Ionicons name="arrow-forward" size={16} color="#4F46E5" />
        </Pressable>
      </View>
    );
  }

  const topicTitle = continueLesson.topic?.title || continueLesson.topicTitle || 'Finance Basics';
  const topicIcon = continueLesson.topic?.icon || '🌱';

  return (
    <Pressable
      onPress={() => onPressLesson(continueLesson.id, continueLesson.slug)}
      className="bg-primary rounded-card p-5 mb-4 shadow-sm active:opacity-95"
      accessibilityLabel={`Continue lesson: ${continueLesson.title}`}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-1.5 bg-primary-dark/40 px-2.5 py-1 rounded-full">
          <AppText className="text-xs">{topicIcon}</AppText>
          <AppText className="text-indigo-100 text-xs font-semibold uppercase tracking-wider">
            {topicTitle}
          </AppText>
        </View>
        <AppText className="text-indigo-200 text-xs font-medium">
          Level {continueLesson.order}
        </AppText>
      </View>

      <AppText className="text-white font-bold text-lg mb-1 leading-6">
        {continueLesson.title}
      </AppText>
      <AppText className="text-indigo-100 text-xs mb-4">
        Interactive micro-lesson • 5 minutes
      </AppText>

      <View className="bg-white rounded-button h-11 items-center justify-center flex-row gap-2">
        <AppText className="text-primary font-bold text-sm">Continue Learning</AppText>
        <Ionicons name="play" size={14} color="#4F46E5" />
      </View>
    </Pressable>
  );
};
