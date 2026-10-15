import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, ScreenHeader, Skeleton, ErrorState } from '../../src/components/ui';
import { TopicHeroHeader, LessonTimelineItem } from '../../src/components/learn';
import { useTopic } from '../../src/hooks/useTopic';
import { useToastStore } from '../../src/stores/toast';

export default function TopicDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const showToast = useToastStore((s) => s.show);

  const { data, isLoading, isError, error, refetch, isRefetching } = useTopic(slug || '');

  const handleLessonPress = (
    lessonId: string,
    status: 'completed' | 'available' | 'locked',
    order: number
  ) => {
    if (status === 'locked') {
      showToast(`Complete Level ${order - 1} first to unlock this lesson!`, 'warning');
      return;
    }
    router.push(`/lesson/${lessonId}`);
  };

  if (isLoading && !data) {
    return (
      <Screen>
        <ScreenHeader title="Loading Track..." />
        <View className="pt-2 gap-4">
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
        <View className="flex-1 justify-center">
          <ErrorState
            title="Track Not Found"
            message={error?.message || 'Could not load this topic.'}
            onRetry={refetch}
          />
        </View>
      </Screen>
    );
  }

  const { topic, lessons } = data;
  const completedCount = lessons.filter((l) => l.status === 'completed').length;

  return (
    <Screen paddingHorizontal={false}>
      <View className="px-5">
        <ScreenHeader title={topic.title} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#4F46E5"
            colors={['#4F46E5']}
          />
        }
      >
        <TopicHeroHeader
          icon={topic.icon}
          title={topic.title}
          description={topic.description}
          color={topic.color}
          completedCount={completedCount}
          totalCount={lessons.length}
        />

        <View className="mt-2">
          {lessons.map((lesson, index) => (
            <LessonTimelineItem
              key={lesson.id}
              lesson={lesson}
              color={topic.color}
              isLast={index === lessons.length - 1}
              onPress={() => handleLessonPress(lesson.id, lesson.status, lesson.order)}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
