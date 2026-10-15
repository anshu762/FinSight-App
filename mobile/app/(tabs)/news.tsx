import React, { useState, useMemo } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, ScreenHeader, Skeleton, EmptyState, ErrorState, AppText } from '../../src/components/ui';
import { NewsCategoryChips, NewsArticleCard } from '../../src/components/news';
import { useNewsArticles } from '../../src/hooks/useNews';
import { type NewsCategory, type NewsArticleItem } from '../../src/api/types';

export default function NewsTab() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'ALL'>('ALL');

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNewsArticles(selectedCategory);

  const articles = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.articles);
  }, [data]);

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const getEmptyDescription = () => {
    if (selectedCategory === 'ALL') {
      return 'No financial news articles are available right now. Check back soon!';
    }
    return `No ${selectedCategory.toLowerCase().replace('_', ' ')} articles found. Try another category!`;
  };

  return (
    <Screen paddingHorizontal={false}>
      <View className="px-5">
        <ScreenHeader title="Finance News" showBack={false} />
        <View className="flex-row items-center bg-indigo-50/80 px-2.5 py-1 rounded-full border border-indigo-200/60 self-start mb-1">
          <AppText variant="caption" className="text-primary font-bold text-[11px]">
            Educational sample content
          </AppText>
        </View>
      </View>

      <NewsCategoryChips
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {isLoading ? (
        <View className="px-5 pt-3 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <View key={n} className="bg-surface rounded-card p-4 border border-border gap-2">
              <Skeleton width="30%" height={16} />
              <Skeleton width="90%" height={22} />
              <Skeleton width="70%" height={16} />
              <Skeleton width="45%" height={12} />
            </View>
          ))}
        </View>
      ) : isError ? (
        <View className="px-5 pt-10">
          <ErrorState
            message={error?.message || 'Failed to load news articles.'}
            onRetry={refetch}
          />
        </View>
      ) : (
        <FlatList<NewsArticleItem>
          data={articles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 24 }}

          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#4F46E5"
              colors={['#4F46E5']}
            />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => (
            <NewsArticleCard
              article={item}
              onPress={() => router.push(`/news/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="newspaper-outline"
              title="No Articles Found"
              description={getEmptyDescription()}
              className="mt-12"
            />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#4F46E5" />
              </View>
            ) : null
          }
        />
      )}
    </Screen>
  );
}
