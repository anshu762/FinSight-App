import React from 'react';
import { View, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  ScreenHeader,
  AppText,
  Card,
  ProgressBar,
  Skeleton,
  ErrorState,
} from '../../src/components/ui';
import { useTopic } from '../../src/hooks/useTopic';
import { useToastStore } from '../../src/stores/toast';

export default function TopicDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const showToast = useToastStore((s) => s.show);

  const { data, isLoading, isError, error, refetch, isRefetching } = useTopic(
    slug || ''
  );

  const handleLessonPress = (
    lessonId: string,
    status: 'completed' | 'available' | 'locked',
    order: number
  ) => {
    if (status === 'locked') {
      showToast(
        `🔒 Complete Level ${order - 1} first to unlock this lesson!`,
        'warning'
      );
      return;
    }
    router.push(`/lesson/${lessonId}`);
  };

  if (isLoading && !data) {
    return (
      <Screen>
        <ScreenHeader title="Loading Track..." />
        <View className="px-5 pt-3 gap-4">
          <Skeleton width="100%" height={140} borderRadius={16} />
          <Skeleton width="100%" height={80} borderRadius={16} />
          <Skeleton width="100%" height={80} borderRadius={16} />
          <Skeleton width="100%" height={80} borderRadius={16} />
        </View>
      </Screen>
    );
  }

  if (isError || !data) {
    return (
      <Screen>
        <ScreenHeader title="Topic" />
        <View className="px-5 flex-1 justify-center">
          <ErrorState
            title="Topic not found"
            message={error?.message || 'Could not load topic details.'}
            onRetry={refetch}
          />
        </View>
      </Screen>
    );
  }

  const { topic, lessons } = data;
  const completedCount = lessons.filter((l) => l.status === 'completed').length;
  const progressRatio = lessons.length > 0 ? completedCount / lessons.length : 0;

  return (
    <Screen>
      <ScreenHeader title={topic.title} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={topic.color}
            colors={[topic.color]}
          />
        }
      >
        {/* Banner with Topic Color & Emoji */}
        <View
          style={{ backgroundColor: `${topic.color}15`, borderColor: `${topic.color}30` }}
          className="border rounded-card p-5 mb-5"
        >
          <View className="flex-row items-center gap-3 mb-2.5">
            <View
              style={{ backgroundColor: `${topic.color}25` }}
              className="w-12 h-12 rounded-xl items-center justify-center"
            >
              <AppText className="text-2xl">{topic.icon}</AppText>
            </View>
            <View className="flex-1">
              <AppText variant="h2">{topic.title}</AppText>
              <AppText variant="caption" className="text-muted">
                Track {topic.order} • {lessons.length} Levels
              </AppText>
            </View>
          </View>

          <AppText variant="caption" className="text-slate-600 leading-5 mb-3.5">
            {topic.description}
          </AppText>

          {/* Overall Progress */}
          <View className="gap-1.5">
            <View className="flex-row justify-between items-center">
              <AppText variant="caption" className="font-semibold text-slate-700 text-xs">
                Topic Mastery
              </AppText>
              <AppText variant="caption" className="font-bold text-slate-800 text-xs">
                {completedCount}/{lessons.length} Completed ({Math.round(progressRatio * 100)}%)
              </AppText>
            </View>
            <ProgressBar progress={progressRatio} color={topic.color} height={6} />
          </View>
        </View>

        {/* Levels List */}
        <View className="mb-3">
          <AppText variant="h3" className="mb-3">
            Lessons & Modules
          </AppText>
          <View className="gap-3">
            {lessons.map((lesson) => {
              const isCompleted = lesson.status === 'completed';
              const isAvailable = lesson.status === 'available';
              const isLocked = lesson.status === 'locked';

              return (
                <Pressable
                  key={lesson.id}
                  onPress={() => handleLessonPress(lesson.id, lesson.status, lesson.order)}
                  className="active:opacity-85 active:scale-[0.99]"
                  accessibilityLabel={`Level ${lesson.order}: ${lesson.title}. Status: ${lesson.status}`}
                >
                  <Card
                    style={{
                      borderColor: isAvailable
                        ? '#4F46E5'
                        : isCompleted
                        ? '#10B98140'
                        : '#E2E8F0',
                      borderWidth: isAvailable ? 1.5 : 1,
                      backgroundColor: isLocked ? '#F8FAFC' : '#FFFFFF',
                    }}
                    className="p-4"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3 flex-1 pr-3">
                        {/* Status Icon */}
                        <View
                          className={`w-10 h-10 rounded-full items-center justify-center ${
                            isCompleted
                              ? 'bg-emerald-100'
                              : isAvailable
                              ? 'bg-indigo-100'
                              : 'bg-slate-200/80'
                          }`}
                        >
                          {isCompleted ? (
                            <Ionicons name="checkmark-sharp" size={20} color="#10B981" />
                          ) : isAvailable ? (
                            <Ionicons name="play" size={16} color="#4F46E5" />
                          ) : (
                            <Ionicons name="lock-closed" size={16} color="#64748B" />
                          )}
                        </View>

                        <View className="flex-1">
                          <View className="flex-row items-center gap-1.5 mb-0.5">
                            <AppText variant="caption" className="text-muted font-bold text-[11px] uppercase">
                              Level {lesson.order}
                            </AppText>
                            {isCompleted && (
                              <View className="bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                <AppText className="text-[10px] font-bold text-emerald-700">
                                  +{lesson.xpEarned} XP
                                </AppText>
                              </View>
                            )}
                          </View>
                          <AppText
                            variant="body"
                            className={`font-bold text-sm ${
                              isLocked ? 'text-slate-400' : 'text-text'
                            }`}
                          >
                            {lesson.title}
                          </AppText>
                          {isLocked && (
                            <AppText variant="caption" className="text-slate-400 text-[11px] mt-0.5">
                              Complete Level {lesson.order - 1} to unlock
                            </AppText>
                          )}
                        </View>
                      </View>

                      {/* Action Chevron / CTA */}
                      {isAvailable ? (
                        <View className="bg-primary px-3 py-1.5 rounded-full">
                          <AppText className="text-white font-bold text-xs">Start</AppText>
                        </View>
                      ) : isCompleted ? (
                        <View className="bg-slate-100 px-2.5 py-1 rounded-full">
                          <AppText className="text-slate-600 font-semibold text-xs">Review</AppText>
                        </View>
                      ) : (
                        <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                      )}
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
