import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card } from '../ui';

interface LessonTimelineItemProps {
  lesson: {
    id: string;
    slug: string;
    order: number;
    title: string;
    status: 'completed' | 'available' | 'locked';
    xpEarned: number;
  };
  color: string;
  isLast: boolean;
  onPress: () => void;
}

export const LessonTimelineItem: React.FC<LessonTimelineItemProps> = ({
  lesson,
  color,
  isLast,
  onPress,
}) => {
  const isCompleted = lesson.status === 'completed';
  const isAvailable = lesson.status === 'available';
  const isLocked = lesson.status === 'locked';

  return (
    <View className="flex-row">
      {/* Left Timeline Column */}
      <View className="items-center mr-3 w-8">
        <View
          style={{
            backgroundColor: isCompleted ? '#10B981' : isAvailable ? color : '#E2E8F0',
          }}
          className="w-8 h-8 rounded-full items-center justify-center shadow-xs"
        >
          {isCompleted ? (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          ) : isAvailable ? (
            <Ionicons name="play" size={14} color="#FFFFFF" />
          ) : (
            <Ionicons name="lock-closed" size={14} color="#64748B" />
          )}
        </View>

        {!isLast && (
          <View
            style={{ backgroundColor: isCompleted ? '#A7F3D0' : '#E2E8F0' }}
            className="w-0.5 flex-1 my-1"
          />
        )}
      </View>

      {/* Right Content Card */}
      <Pressable
        onPress={onPress}
        className="flex-1 mb-3.5 active:opacity-85"
        accessibilityRole="button"
        accessibilityLabel={`Level ${lesson.order}: ${lesson.title}. Status: ${lesson.status}`}
      >
        <Card
          className={`p-3.5 border ${
            isAvailable
              ? 'bg-surface border-primary/40 shadow-xs'
              : isCompleted
              ? 'bg-surface border-border'
              : 'bg-slate-50/70 border-border/60'
          }`}
        >
          <View className="flex-row items-center justify-between mb-1">
            <AppText variant="caption" className="font-bold text-[11px] text-muted uppercase">
              Level {lesson.order}
            </AppText>

            {isCompleted ? (
              <View className="flex-row items-center bg-primary-soft px-2 py-0.5 rounded-full border border-indigo-200">
                <Ionicons name="checkmark-done" size={11} color="#4F46E5" />
                <AppText variant="caption" className="text-primary font-bold text-[10px] ml-1">
                  +{lesson.xpEarned} XP
                </AppText>
              </View>
            ) : isAvailable ? (
              <View className="flex-row items-center bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                <AppText variant="caption" className="text-primary font-bold text-[10px]">
                  Ready to Start
                </AppText>
              </View>
            ) : (
              <View className="flex-row items-center bg-slate-100 px-2 py-0.5 rounded-full">
                <Ionicons name="lock-closed" size={10} color="#64748B" />
                <AppText variant="caption" className="text-muted font-medium text-[10px] ml-1">
                  Locked
                </AppText>
              </View>
            )}
          </View>

          <AppText
            variant="body"
            className={`font-bold text-sm leading-5 ${isLocked ? 'text-slate-400' : 'text-text'}`}
          >
            {lesson.title}
          </AppText>
        </Card>
      </Pressable>
    </View>
  );
};
