import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card, Button } from '../ui';
import { type RelatedLessonInfo } from '../../api/types';

interface RelatedLessonCardProps {
  lesson: RelatedLessonInfo | null;
}

export const RelatedLessonCard: React.FC<RelatedLessonCardProps> = ({ lesson }) => {
  const router = useRouter();

  if (!lesson) {
    return null;
  }

  const handleStartLesson = () => {
    if (lesson.status === 'available' || lesson.status === 'completed') {
      router.push(`/lesson/${lesson.id}`);
    } else if (lesson.status === 'locked' && lesson.requiredLessonId) {
      router.push(`/lesson/${lesson.requiredLessonId}`);
    }
  };

  return (
    <Card className="p-4 bg-indigo-50/60 border-indigo-200 mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View className="w-6 h-6 rounded-full bg-primary/10 items-center justify-center mr-2">
            <Ionicons name="school-outline" size={13} color="#4F46E5" />
          </View>
          <AppText variant="caption" className="text-primary font-bold text-xs uppercase tracking-wider">
            Connected Literacy Lesson
          </AppText>
        </View>

        {lesson.status === 'completed' && (
          <View className="flex-row items-center bg-emerald-100 px-2 py-0.5 rounded-full">
            <Ionicons name="checkmark-done" size={11} color="#059669" />
            <AppText variant="caption" className="text-emerald-700 font-bold text-[10px] ml-1">
              Completed
            </AppText>
          </View>
        )}

        {lesson.status === 'locked' && (
          <View className="flex-row items-center bg-amber-100 px-2 py-0.5 rounded-full">
            <Ionicons name="lock-closed" size={11} color="#B45309" />
            <AppText variant="caption" className="text-amber-800 font-bold text-[10px] ml-1">
              Locked
            </AppText>
          </View>
        )}
      </View>

      <AppText variant="h3" className="text-text text-base font-bold mb-1">
        {lesson.title}
      </AppText>
      <AppText variant="caption" className="text-muted text-xs mb-3">
        Topic: {lesson.topicTitle} • Lesson {lesson.order}
      </AppText>

      {lesson.status === 'locked' ? (
        <View className="bg-amber-50 rounded-xl p-3 border border-amber-200">
          <View className="flex-row items-center mb-1">
            <Ionicons name="alert-circle-outline" size={14} color="#B45309" />
            <AppText variant="caption" className="text-amber-800 font-bold text-xs ml-1.5">
              Prerequisite Required
            </AppText>
          </View>
          <AppText variant="caption" className="text-amber-900 text-xs leading-4">
            Complete "{lesson.requiredLessonTitle || 'the previous lesson'}" first to unlock this lesson.
          </AppText>
          {lesson.requiredLessonId && (
            <Pressable
              onPress={handleStartLesson}
              className="mt-2.5 bg-amber-100/90 py-2 rounded-lg items-center active:opacity-75"
              accessibilityRole="button"
              accessibilityLabel={`Go to prerequisite lesson: ${lesson.requiredLessonTitle}`}
            >
              <AppText variant="caption" className="text-amber-900 font-bold text-xs">
                Go to Required Lesson →
              </AppText>
            </Pressable>
          )}
        </View>
      ) : (
        <Button
          title={lesson.status === 'completed' ? 'Review Lesson' : 'Start Lesson'}
          variant={lesson.status === 'completed' ? 'secondary' : 'primary'}
          onPress={handleStartLesson}
          className="h-10 rounded-button"
        />
      )}
    </Card>
  );
};
