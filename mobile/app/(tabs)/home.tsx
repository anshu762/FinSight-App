import React from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Skeleton, ErrorState } from '../../src/components/ui';
import {
  HomeHeader,
  ContinueLearningCard,
  StatsRow,
  RecentBadgesSection,
  TopicsGrid,
  NewsPreviewCard,
  PortfolioShortcutCard,
} from '../../src/components/home';
import { useHome } from '../../src/hooks/useHome';
import { useCheckIn } from '../../src/hooks/useCheckIn';

export default function HomeScreen() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch, isRefetching } = useHome();

  // Automatic check-in once per day on app foreground
  useCheckIn();

  const handleLessonPress = (lessonId: string, slug: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  const handleTopicPress = (slug: string) => {
    router.push(`/topic/${slug}`);
  };

  if (isLoading && !data) {
    return (
      <Screen className="px-5 pt-3">
        {/* Header Skeleton */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <Skeleton width={46} height={46} borderRadius={23} />
            <View className="gap-1.5">
              <Skeleton width={80} height={12} />
              <Skeleton width={130} height={20} />
            </View>
          </View>
          <Skeleton width={80} height={32} borderRadius={16} />
        </View>

        {/* Continue Learning Skeleton */}
        <Skeleton width="100%" height={140} borderRadius={16} className="mb-4" />

        {/* Stats Row Skeleton */}
        <Skeleton width="100%" height={80} borderRadius={16} className="mb-3" />
        <View className="flex-row gap-3 mb-4">
          <Skeleton width="48%" height={80} borderRadius={16} />
          <Skeleton width="48%" height={80} borderRadius={16} />
        </View>

        {/* Topics Skeleton */}
        <View className="flex-row gap-3 mb-3">
          <Skeleton width="48%" height={120} borderRadius={16} />
          <Skeleton width="48%" height={120} borderRadius={16} />
        </View>
      </Screen>
    );
  }

  if (isError || !data) {
    return (
      <Screen className="px-5">
        <ErrorState
          title="Could not load dashboard"
          message={error?.message || 'Please check your connection and try again.'}
          onRetry={refetch}
        />
      </Screen>
    );
  }

  const { user, continueLesson, topics, badges, latestNews, portfolioValue } = data;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 110 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#4F46E5"
            colors={['#4F46E5']}
          />
        }
      >
        {/* 1. Header with Avatar & Streak Tip */}
        <HomeHeader
          name={user.name}
          streak={user.streak}
          onAvatarPress={() => router.push('/profile')}
        />

        {/* 2. Continue Learning Primary CTA */}
        <ContinueLearningCard
          continueLesson={continueLesson}
          onPressLesson={handleLessonPress}
          onPressLearnTab={() => router.push('/(tabs)/learn')}
        />

        {/* 3. Stats Row (Level Progress Bar, XP, Streak) */}
        <StatsRow
          xp={user.xp}
          streak={user.streak}
          longestStreak={user.longestStreak}
          levelInfo={user.levelInfo}
        />

        {/* 4. Achievement Badges Scroll */}
        <RecentBadgesSection
          recentBadges={badges.recentEarned || badges.recent || []}
          totalEarned={badges.earnedCount}
          totalCount={badges.totalCount}
          onSeeAllBadges={() => router.push('/badges')}
        />

        {/* 5. 2x2 Equal-Height Topics Grid */}
        <TopicsGrid
          topics={topics}
          onPressTopic={handleTopicPress}
        />

        {/* 6. Financial Pulse News Preview */}
        <NewsPreviewCard
          news={latestNews}
          onPressNewsTab={() => router.push('/(tabs)/news')}
        />

        {/* 7. Virtual Portfolio Simulator Shortcut */}
        <PortfolioShortcutCard
          cashBalance={user.cashBalance}
          portfolioValue={portfolioValue}
          onLaunchSimulator={() => router.push('/(tabs)/portfolio')}
        />
      </ScrollView>
    </Screen>
  );
}
