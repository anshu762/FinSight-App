import React from 'react';
import { View, Pressable } from 'react-native';
import { AppText, ProgressBar } from '../ui';
import { type TopicSummary } from '../../api/types';

interface TopicsGridProps {
  topics: TopicSummary[];
  onPressTopic: (slug: string) => void;
}

export const TopicsGrid: React.FC<TopicsGridProps> = ({
  topics,
  onPressTopic,
}) => {
  // Pair topics into rows of 2 for a clean 2x2 layout
  const rows: TopicSummary[][] = [];
  for (let i = 0; i < topics.length; i += 2) {
    rows.push(topics.slice(i, i + 2));
  }

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2.5">
        <AppText variant="h3">Learning Topics</AppText>
        <AppText variant="caption" className="text-muted">
          {topics.length} Foundation Tracks
        </AppText>
      </View>

      <View className="gap-3">
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} className="flex-row gap-3">
            {row.map((topic) => {
              const progressVal =
                topic.totalLessons > 0
                  ? topic.completedLessons / topic.totalLessons
                  : 0;

              return (
                <Pressable
                  key={topic.id}
                  onPress={() => onPressTopic(topic.slug)}
                  className="flex-1 bg-surface border border-border rounded-card p-4 justify-between active:opacity-90 active:scale-[0.98] shadow-sm min-h-[140px]"
                  accessibilityLabel={`Topic: ${topic.title}`}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View
                      style={{ backgroundColor: `${topic.color}15` }}
                      className="w-10 h-10 rounded-xl items-center justify-center"
                    >
                      <AppText className="text-xl">{topic.icon}</AppText>
                    </View>
                    <View
                      style={{ backgroundColor: topic.color }}
                      className="w-2.5 h-2.5 rounded-full"
                    />
                  </View>

                  <View className="my-1">
                    <AppText
                      variant="body"
                      numberOfLines={1}
                      className="font-bold text-text text-sm"
                    >
                      {topic.title}
                    </AppText>
                    <AppText variant="caption" className="text-muted mt-0.5 text-xs">
                      {topic.completedLessons}/{topic.totalLessons} Levels
                    </AppText>
                  </View>

                  <View className="mt-2">
                    <ProgressBar
                      progress={progressVal}
                      color={topic.color}
                      height={4}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};
