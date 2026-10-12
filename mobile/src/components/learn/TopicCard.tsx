import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card, ProgressBar } from '../ui';
import { type TopicSummary } from '../../api/types';

interface TopicCardProps {
  topic: TopicSummary;
  onPress: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onPress }) => {
  const isCompleted =
    topic.totalLessons > 0 && topic.completedLessons === topic.totalLessons;
  const isStarted = topic.completedLessons > 0;
  const progressRatio =
    topic.totalLessons > 0 ? topic.completedLessons / topic.totalLessons : 0;

  return (
    <Pressable
      onPress={onPress}
      className="mb-3.5 active:opacity-90 active:scale-[0.99]"
      accessibilityLabel={`Open topic: ${topic.title}`}
    >
      <Card className="p-4 bg-surface border-border shadow-sm">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-3 flex-1 pr-2">
            <View
              style={{ backgroundColor: `${topic.color}18` }}
              className="w-12 h-12 rounded-xl items-center justify-center"
            >
              <AppText className="text-2xl">{topic.icon}</AppText>
            </View>
            <View className="flex-1">
              <AppText variant="h3" numberOfLines={1}>
                {topic.title}
              </AppText>
              <AppText variant="caption" className="text-muted">
                Track {topic.order} • {topic.totalLessons} Levels
              </AppText>
            </View>
          </View>

          {/* Status Badge */}
          <View
            style={{
              backgroundColor: isCompleted
                ? '#ECFDF5'
                : isStarted
                ? '#EEF2FF'
                : '#F1F5F9',
            }}
            className="px-3 py-1 rounded-full flex-row items-center gap-1"
          >
            {isCompleted ? (
              <>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <AppText className="text-xs font-bold text-emerald-700">Done</AppText>
              </>
            ) : isStarted ? (
              <>
                <Ionicons name="play" size={12} color="#4F46E5" />
                <AppText className="text-xs font-bold text-primary">Continue</AppText>
              </>
            ) : (
              <>
                <Ionicons name="arrow-forward" size={12} color="#64748B" />
                <AppText className="text-xs font-bold text-slate-600">Start</AppText>
              </>
            )}
          </View>
        </View>

        <AppText
          variant="body"
          numberOfLines={2}
          className="text-slate-600 text-xs mb-3.5 leading-4"
        >
          {topic.description}
        </AppText>

        {/* Progress Bar & Counter */}
        <View className="gap-1.5">
          <View className="flex-row items-center justify-between">
            <AppText variant="caption" className="text-muted font-medium text-[11px]">
              Mastery Progress
            </AppText>
            <AppText variant="caption" className="font-bold text-[11px] text-text">
              {topic.completedLessons}/{topic.totalLessons} Levels (
              {Math.round(progressRatio * 100)}%)
            </AppText>
          </View>
          <ProgressBar progress={progressRatio} color={topic.color} height={6} />
        </View>
      </Card>
    </Pressable>
  );
};
