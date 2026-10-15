import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card } from '../ui';
import { type BadgeItem } from '../../api/types';

import { BADGE_TIER_CONFIG } from '../badges/BadgeCard';

interface RecentBadgesSectionProps {
  recentBadges?: BadgeItem[];
  totalEarned: number;
  totalCount: number;
  onSeeAllBadges: () => void;
}

export const RecentBadgesSection: React.FC<RecentBadgesSectionProps> = ({
  recentBadges = [],
  totalEarned,
  totalCount,
  onSeeAllBadges,
}) => {
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="flex-row items-center gap-1.5">
          <AppText variant="h3">Badges</AppText>
          <View className="bg-slate-200/80 px-2 py-0.5 rounded-full">
            <AppText variant="caption" className="font-semibold text-slate-700">
              {totalEarned}/{totalCount}
            </AppText>
          </View>
        </View>

        <Pressable
          onPress={onSeeAllBadges}
          hitSlop={8}
          className="flex-row items-center gap-1 active:opacity-70"
          accessibilityLabel="View all badges"
        >
          <AppText variant="caption" className="text-primary font-bold">
            View All
          </AppText>
          <Ionicons name="chevron-forward" size={14} color="#4F46E5" />
        </Pressable>
      </View>

      {recentBadges.length === 0 ? (
        <Card className="p-4 bg-surface border-border flex-row items-center gap-3 rounded-2xl">
          <View className="w-12 h-12 rounded-full bg-indigo-50 items-center justify-center">
            <AppText className="text-2xl">🎯</AppText>
          </View>
          <View className="flex-1">
            <AppText variant="body" className="font-semibold text-text">
              No badges earned yet
            </AppText>
            <AppText variant="caption" className="text-muted mt-0.5 leading-4">
              Complete your first lesson to earn a badge and unlock achievements!
            </AppText>
          </View>
        </Card>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-5 px-5"
        >
          <View className="flex-row gap-3 py-1">
            {recentBadges.map((badge) => {
              const tier = BADGE_TIER_CONFIG[badge.rarity] || BADGE_TIER_CONFIG.COMMON;
              return (
                <Pressable
                  key={badge.id}
                  onPress={onSeeAllBadges}
                  className="w-28 bg-surface border border-border rounded-2xl p-3 items-center justify-center active:scale-95 shadow-xs"
                >
                  <View
                    style={{ backgroundColor: tier.bgSoft, borderColor: tier.border }}
                    className="w-12 h-12 rounded-full border items-center justify-center mb-1.5"
                  >
                    <AppText className="text-2xl">{badge.icon}</AppText>
                  </View>
                  <AppText
                    variant="caption"
                    numberOfLines={1}
                    className="font-bold text-center text-text text-xs"
                  >
                    {badge.name}
                  </AppText>
                  <View
                    style={{ backgroundColor: tier.bgSoft, borderColor: tier.border }}
                    className="px-2 py-0.2 rounded-full border mt-1"
                  >
                    <AppText
                      style={{ color: tier.color }}
                      className="text-[9px] uppercase font-bold tracking-wider"
                    >
                      {tier.label}
                    </AppText>
                  </View>
                </Pressable>
              );
            })}

            {/* "+" Card */}
            <Pressable
              onPress={onSeeAllBadges}
              className="w-20 bg-slate-50 border border-dashed border-border rounded-card p-3 items-center justify-center active:bg-slate-100"
              accessibilityLabel="View more badges"
            >
              <View className="w-10 h-10 rounded-full bg-white border border-border items-center justify-center mb-1">
                <Ionicons name="add" size={20} color="#4F46E5" />
              </View>
              <AppText variant="caption" className="text-[11px] font-bold text-primary">
                More
              </AppText>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </View>
  );
};
