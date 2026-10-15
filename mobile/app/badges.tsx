import React, { useState, useMemo } from 'react';
import { View, ScrollView, RefreshControl, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  ScreenHeader,
  AppText,
  Card,
  ProgressBar,
  Skeleton,
  ErrorState,
} from '../src/components/ui';
import { BadgeCard } from '../src/components/badges/BadgeCard';
import { BadgeDetailModal } from '../src/components/badges/BadgeDetailModal';
import { useBadges } from '../src/hooks/useBadges';
import { type BadgeItem } from '../src/api/types';

const CATEGORY_META: Record<
  string,
  { title: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  learn: { title: 'Learning & Mastery', icon: 'school-outline' },
  LEARNING: { title: 'Learning & Mastery', icon: 'school-outline' },
  streak: { title: 'Streaks & Consistency', icon: 'flame-outline' },
  STREAK: { title: 'Streaks & Consistency', icon: 'flame-outline' },
  portfolio: { title: 'Portfolio & Trading', icon: 'pie-chart-outline' },
  trading: { title: 'Portfolio & Trading', icon: 'pie-chart-outline' },
  TRADING: { title: 'Portfolio & Trading', icon: 'pie-chart-outline' },
  news: { title: 'Market Intelligence', icon: 'newspaper-outline' },
  NEWS: { title: 'Market Intelligence', icon: 'newspaper-outline' },
};

export default function BadgesScreen() {
  const { data: badges, isLoading, isError, error, refetch, isRefetching } = useBadges();
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const earnedCount = useMemo(() => badges?.filter((b) => b.isEarned).length || 0, [badges]);
  const totalCount = badges?.length || 0;
  const progressRatio = totalCount > 0 ? earnedCount / totalCount : 0;
  const percentComplete = Math.round(progressRatio * 100);

  // Categories list
  const categoryKeys = useMemo(() => {
    if (!badges) return [];
    return Array.from(new Set(badges.map((b) => b.category)));
  }, [badges]);

  // Filtered badges
  const displayedCategories = useMemo(() => {
    if (!badges) return [];
    if (activeCategory === 'all') return categoryKeys;
    return categoryKeys.filter((c) => c.toLowerCase() === activeCategory.toLowerCase());
  }, [badges, activeCategory, categoryKeys]);

  if (isLoading && !badges) {
    return (
      <Screen>
        <ScreenHeader title="Badges & Achievements" />
        <View className="gap-4 pt-2">
          <Skeleton width="100%" height={110} borderRadius={20} />
          <View className="flex-row gap-2">
            <Skeleton width={70} height={32} borderRadius={16} />
            <Skeleton width={100} height={32} borderRadius={16} />
            <Skeleton width={90} height={32} borderRadius={16} />
          </View>
          <View className="flex-row gap-3">
            <Skeleton width="31%" height={140} borderRadius={18} />
            <Skeleton width="31%" height={140} borderRadius={18} />
            <Skeleton width="31%" height={140} borderRadius={18} />
          </View>
        </View>
      </Screen>
    );
  }

  if (isError || !badges) {
    return (
      <Screen>
        <ScreenHeader title="Badges & Achievements" />
        <View className="flex-1 justify-center">
          <ErrorState
            title="Failed to load achievements"
            message={error?.message || 'Could not fetch your badges. Please try again.'}
            onRetry={refetch}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen paddingHorizontal={false}>
      <View className="px-5">
        <ScreenHeader title="Achievements & Badges" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#4F46E5"
            colors={['#4F46E5']}
          />
        }
      >
        {/* 1. Executive Progress Hero Card */}
        <Card className="p-4 bg-surface border-border rounded-2xl mb-4 shadow-xs">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-2xl bg-primary-soft items-center justify-center border border-indigo-200">
                <Ionicons name="trophy" size={24} color="#4F46E5" />
              </View>
              <View>
                <AppText variant="caption" className="text-muted text-xs">
                  Collection Progression
                </AppText>
                <AppText variant="h2" className="text-lg font-bold text-text">
                  {earnedCount} of {totalCount} Unlocked
                </AppText>
              </View>
            </View>

            <View className="bg-primary-soft px-3 py-1 rounded-full border border-indigo-200">
              <AppText className="text-primary font-bold text-xs">{percentComplete}%</AppText>
            </View>
          </View>

          <ProgressBar progress={progressRatio} color="#4F46E5" height={6} />

          <View className="flex-row items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
            <AppText variant="caption" className="text-muted text-[11px]">
              Earn XP & complete financial milestones
            </AppText>
            <AppText variant="caption" className="text-primary font-bold text-[11px]">
              {totalCount - earnedCount} remaining
            </AppText>
          </View>
        </Card>

        {/* 2. Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-5 px-5 mb-4"
        >
          <View className="flex-row gap-2 py-1">
            <Pressable
              onPress={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-full border ${
                activeCategory === 'all'
                  ? 'bg-primary border-primary'
                  : 'bg-surface border-slate-200'
              }`}
            >
              <AppText
                className={`text-xs font-bold ${
                  activeCategory === 'all' ? 'text-white' : 'text-slate-600'
                }`}
              >
                All ({totalCount})
              </AppText>
            </Pressable>

            {categoryKeys.map((catKey) => {
              const meta = CATEGORY_META[catKey] || { title: catKey, icon: 'ribbon-outline' };
              const count = badges.filter((b) => b.category === catKey).length;
              const isSelected = activeCategory.toLowerCase() === catKey.toLowerCase();

              return (
                <Pressable
                  key={catKey}
                  onPress={() => setActiveCategory(catKey)}
                  className={`flex-row items-center gap-1.5 px-3.5 py-1.5 rounded-full border ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-slate-200'
                  }`}
                >
                  <Ionicons
                    name={meta.icon}
                    size={13}
                    color={isSelected ? '#FFFFFF' : '#64748B'}
                  />
                  <AppText
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-slate-600'
                    }`}
                  >
                    {meta.title.split(' ')[0]} ({count})
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* 3. Badges Grid by Category */}
        {displayedCategories.map((category) => {
          const categoryBadges = badges.filter((b) => b.category === category);
          const meta = CATEGORY_META[category] || {
            title: category.toUpperCase(),
            icon: 'ribbon-outline',
          };
          const categoryEarned = categoryBadges.filter((b) => b.isEarned).length;

          // Split into rows of 3
          const rows: BadgeItem[][] = [];
          for (let i = 0; i < categoryBadges.length; i += 3) {
            rows.push(categoryBadges.slice(i, i + 3));
          }

          return (
            <View key={category} className="mb-6">
              <View className="flex-row items-center justify-between mb-3 px-0.5">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name={meta.icon} size={15} color="#4F46E5" />
                  <AppText variant="h3" className="text-sm font-bold text-text">
                    {meta.title}
                  </AppText>
                </View>
                <AppText variant="caption" className="text-muted text-xs font-semibold">
                  {categoryEarned} / {categoryBadges.length} Earned
                </AppText>
              </View>

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
