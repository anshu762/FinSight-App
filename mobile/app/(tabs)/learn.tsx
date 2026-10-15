import React from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, AppText, Skeleton, ErrorState, ScreenHeader } from '../../src/components/ui';
import { TopicCard } from '../../src/components/learn/TopicCard';
import { useTopics } from '../../src/hooks/useTopics';

export default function LearnTabScreen() {
  const router = useRouter();
  const { data: topics, isLoading, isError, error, refetch, isRefetching } = useTopics();

  const handleTopicPress = (slug: string) => {
    router.push(`/topic/${slug}`);
  };

  return (
    <Screen paddingHorizontal={false}>
      <View className="px-5">
        <ScreenHeader title="Learn" showBack={false} />
      </View>

      {isLoading && !topics ? (
        <View className="px-5 pt-2 gap-3.5">
          <Skeleton width="100%" height={150} borderRadius={16} />
          <Skeleton width="100%" height={150} borderRadius={16} />
          <Skeleton width="100%" height={150} borderRadius={16} />
          <Skeleton width="100%" height={150} borderRadius={16} />
        </View>
      ) : isError || !topics ? (
        <View className="px-5 flex-1 justify-center">
          <ErrorState
            title="Failed to load topics"
            message={error?.message || 'Please check your connection and try again.'}
            onRetry={refetch}
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#4F46E5"
              colors={['#4F46E5']}
            />
          }
        >
          <View className="mb-4">
            <AppText variant="caption" className="text-muted leading-5">
              4 structured tracks covering stocks, compounding, Indian taxes, and digital assets. Complete levels in sequence to unlock next topics.
            </AppText>
          </View>

          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onPress={() => handleTopicPress(topic.slug)}
            />
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}
