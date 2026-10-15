import React from 'react';
import { View, Pressable } from 'react-native';
import { AppText } from '../ui';
import { type BadgeItem } from '../../api/types';
import { BadgeEmblem, BADGE_TIER_CONFIG } from './BadgeEmblem';

export { BADGE_TIER_CONFIG, BADGE_ICON_MAP } from './BadgeEmblem';

interface BadgeCardProps {
  badge: BadgeItem;
  onPress: () => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onPress }) => {
  const isEarned = badge.isEarned;
  const tier = BADGE_TIER_CONFIG[badge.rarity] || BADGE_TIER_CONFIG.COMMON;

  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center justify-between p-3.5 rounded-2xl bg-surface border min-h-[142px] active:scale-95 active:opacity-85 shadow-xs ${
        isEarned ? 'border-indigo-100/80 bg-white' : 'border-slate-100 bg-slate-50/60'
      }`}
      accessibilityLabel={`Badge: ${badge.name}. ${isEarned ? 'Earned' : 'Locked'}`}
    >
      {/* High-Definition Emblem */}
      <BadgeEmblem
        badgeKey={badge.key}
        icon={badge.icon}
        isEarned={isEarned}
        size="md"
        showLock={true}
      />

      {/* Name */}
      <AppText
        variant="caption"
        numberOfLines={2}
        className={`font-bold text-center text-xs leading-4 mt-2 ${
          isEarned ? 'text-text' : 'text-slate-400'
        }`}
      >
        {badge.name}
      </AppText>

      {/* Rarity Tier Tag */}
      <View
        style={{
          backgroundColor: isEarned ? tier.bgSoft : '#F1F5F9',
          borderColor: isEarned ? tier.border : '#E2E8F0',
        }}
        className="px-2.5 py-0.5 rounded-full mt-1.5 border"
      >
        <AppText
          style={{ color: isEarned ? tier.color : '#94A3B8' }}
          className="text-[10px] font-bold uppercase tracking-wider"
        >
          {tier.label}
        </AppText>
      </View>
    </Pressable>
  );
};
