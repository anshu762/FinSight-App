import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card, ProgressBar } from '../ui';
import { type BadgeItem } from '../../api/types';
import { BadgeEmblem, BADGE_TIER_CONFIG } from '../badges/BadgeEmblem';

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
  const safeTotal = totalCount > 0 ? totalCount : 12;
  const progressRatio = Math.min(1, Math.max(0, totalEarned / safeTotal));
  const percentComplete = Math.round(progressRatio * 100);

  return (
    <Card className="p-4 bg-surface border-border mb-4 rounded-2xl shadow-xs">
      {/* 1. Header Row */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-full bg-primary-soft items-center justify-center border border-indigo-200">
            <Ionicons name="trophy" size={18} color="#4F46E5" />
          </View>
          <View>
            <AppText variant="h3" className="text-sm font-bold text-text">
              Achievements & Mastery
            </AppText>
            <AppText variant="caption" className="text-muted text-[11px]">
              {totalEarned} of {safeTotal} Badges Unlocked • {percentComplete}%
            </AppText>
          </View>
        </View>

        <Pressable
          onPress={onSeeAllBadges}
          hitSlop={8}
          className="flex-row items-center gap-0.5 bg-primary-soft px-2.5 py-1 rounded-full border border-indigo-100 active:opacity-75"
          accessibilityLabel="View all badges"
        >
          <AppText variant="caption" className="text-primary font-bold text-xs">
            View All
          </AppText>
          <Ionicons name="chevron-forward" size={13} color="#4F46E5" />
        </Pressable>
      </View>

      {/* 2. Progress Bar */}
      <View className="mb-3">
        <ProgressBar progress={progressRatio} color="#4F46E5" height={5} />
      </View>

      {/* 3. Badges Showcase */}
      {recentBadges.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-1 px-1"
        >
          <View className="flex-row gap-2.5 py-1">
            {recentBadges.map((badge) => {
              const tier = BADGE_TIER_CONFIG[badge.rarity] || BADGE_TIER_CONFIG.COMMON;
              return (
                <Pressable
                  key={badge.id}
                  onPress={onSeeAllBadges}
                  className="w-24 bg-slate-50/70 border border-slate-200/80 rounded-xl p-2.5 items-center justify-center active:scale-95 shadow-xs"
                >
                  <BadgeEmblem
                    badgeKey={badge.key}
                    icon={badge.icon}
                    isEarned={badge.isEarned !== false}
                    size="sm"
                    showLock={false}
                  />

                  <AppText
                    variant="caption"
                    numberOfLines={1}
                    className="font-bold text-center text-text text-[11px] mt-1.5"
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
          </View>
        </ScrollView>
      ) : (
        /* Empty State / Next Milestone Preview */
        <Pressable
          onPress={onSeeAllBadges}
          className="flex-row items-center gap-3 bg-slate-50 border border-slate-200/90 rounded-xl p-3 active:bg-slate-100"
          accessibilityLabel="Next milestone badge preview"
        >
          <BadgeEmblem
            badgeKey="first_steps"
            isEarned={false}
            size="sm"
            showLock={true}
          />
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5">
              <AppText variant="body" className="font-bold text-xs text-text">
                Next: First Steps
              </AppText>
              <View className="bg-slate-200/70 px-1.5 py-0.2 rounded border border-slate-300">
                <AppText className="text-[9px] font-bold text-slate-700">BRONZE</AppText>
              </View>
            </View>
            <AppText variant="caption" className="text-muted text-[11px] leading-4 mt-0.5">
              Complete your first lesson to unlock this badge & earn +100 XP!
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
        </Pressable>
      )}
    </Card>
  );
};
