import React, { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import {
  Screen,
  ScreenHeader,
  AppText,
  ProgressBar,
  Skeleton,
  ErrorState,
} from '../src/components/ui';
import { BadgeCard } from '../src/components/badges/BadgeCard';
import { BadgeDetailModal } from '../src/components/badges/BadgeDetailModal';
import { useBadges } from '../src/hooks/useBadges';
import { type BadgeItem } from '../src/api/types';

const CATEGORY_TITLES: Record<string, string> = {
  LEARNING: '📚 Learning & Mastery',
  STREAK: '🔥 Streak & Consistency',
  TRADING: '💼 Portfolio & Trading',
  NEWS: '📰 Market Intelligence',
};

export default function BadgesScreen() {
  const { data: badges, isLoading, isError, error, refetch, isRefetching } = useBadges();
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  if (isLoading && !badges) {
    return (
      <Screen>
        <ScreenHeader title="Achievements" />
        <View className="px-5 pt-3 gap-4">
          <Skeleton width="100%" height={90} borderRadius={16} />
          <View className="flex-row gap-3">
            <Skeleton width="30%" height={120} borderRadius={16} />
            <Skeleton width="30%" height={120} borderRadius={16} />
            <Skeleton width="30%" height={120} borderRadius={16} />
          </View>
        </View>
      </Screen>
    );
  }

  if (isError || !badges) {
    return (
      <Screen>
        <ScreenHeader title="Achievements" />
        <View className="px-5 flex-1 justify-center">
          <ErrorState
            title="Failed to load badges"
            message={error?.message || 'Could not fetch achievement badges.'}
            onRetry={refetch}
          />
        </View>
      </Screen>
    );
  }

  const earnedCount = badges.filter((b) => b.isEarned).length;
  const totalCount = badges.length;
  const progressRatio = totalCount > 0 ? earnedCount / totalCount : 0;

  // Group badges by category
  const categories = Array.from(new Set(badges.map((b) => b.category)));

  return (
    <Screen>
      <ScreenHeader title="Badges & Achievements" />

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
        {/* Progress Banner */}
        <View className="bg-surface border border-border rounded-card p-4 mb-5 shadow-sm">
          <View className="flex-row items-center justify-between mb-2">
            <View>
              <AppText variant="caption" className="text-muted">
                Collection Progress
              </AppText>
              <AppText variant="h2">
                {earnedCount} of {totalCount} Unlocked
              </AppText>
            </View>
            <View className="w-12 h-12 rounded-full bg-amber-50 items-center justify-center border border-amber-200">
              <AppText className="text-2xl">🏆</AppText>
            </View>
          </View>
          <ProgressBar progress={progressRatio} color="#F59E0B" height={6} />
        </View>

        {/* Categories & 3-Column Grids */}
        {categories.map((category) => {
          const categoryBadges = badges.filter((b) => b.category === category);
          const title = CATEGORY_TITLES[category] || category;

          // Split into rows of 3
          const rows: BadgeItem[][] = [];
          for (let i = 0; i < categoryBadges.length; i += 3) {
            rows.push(categoryBadges.slice(i, i + 3));
          }

          return (
            <View key={category} className="mb-6">
              <AppText variant="h3" className="mb-3 text-sm uppercase tracking-wider text-slate-700">
                {title}
              </AppText>

              <View className="gap-3">
                {rows.map((row, rowIndex) => (
                  <View key={`row-${rowIndex}`} className="flex-row gap-3">
                    {row.map((badge) => (
                      <BadgeCard
                        key={badge.id}
                        badge={badge}
                        onPress={() => setSelectedBadge(badge)}
                      />
                    ))}
                    {/* Fill empty cells in incomplete row to preserve grid alignment */}
                    {row.length < 3 &&
                      Array.from({ length: 3 - row.length }).map((_, emptyIdx) => (
                        <View key={`empty-${emptyIdx}`} className="flex-1" />
                      ))}
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Badge Detail Modal */}
      <BadgeDetailModal
        badge={selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />
    </Screen>
  );
}
