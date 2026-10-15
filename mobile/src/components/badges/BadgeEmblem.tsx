import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui';

export const BADGE_ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  first_steps: 'sparkles',
  knowledge_seeker: 'book-outline',
  topic_master: 'school-outline',
  speed_learner: 'flash-outline',
  daily_visitor: 'flame-outline',
  first_investment: 'wallet-outline',
  portfolio_builder: 'pie-chart-outline',
  diversified_investor: 'layers-outline',
  crypto_pioneer: 'cube-outline',
  bull_market_winner: 'trending-up-outline',
  news_reader: 'newspaper-outline',
  informed_investor: 'analytics-outline',
};

export const BADGE_TIER_CONFIG: Record<
  string,
  { label: string; color: string; bgSoft: string; border: string }
> = {
  COMMON: {
    label: 'Bronze',
    color: '#475569',
    bgSoft: '#F8FAFC',
    border: '#E2E8F0',
  },
  UNCOMMON: {
    label: 'Silver',
    color: '#334155',
    bgSoft: '#F1F5F9',
    border: '#CBD5E1',
  },
  RARE: {
    label: 'Gold',
    color: '#4338CA',
    bgSoft: '#EEF2FF',
    border: '#C7D2FE',
  },
  LEGENDARY: {
    label: 'Diamond',
    color: '#4F46E5',
    bgSoft: '#EEF2FF',
    border: '#818CF8',
  },
};

interface BadgeEmblemProps {
  badgeKey?: string;
  icon?: string;
  isEarned?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLock?: boolean;
}

export const BadgeEmblem: React.FC<BadgeEmblemProps> = ({
  badgeKey = '',
  icon = '',
  isEarned = false,
  size = 'md',
  showLock = true,
}) => {
  const vectorIconName = BADGE_ICON_MAP[badgeKey.toLowerCase()];

  const dimensions =
    size === 'lg'
      ? { outer: 76, icon: 34, lockSize: 15, lockPad: 5 }
      : size === 'sm'
      ? { outer: 42, icon: 18, lockSize: 10, lockPad: 3 }
      : { outer: 54, icon: 24, lockSize: 12, lockPad: 4 };

  const bgStyle = isEarned
    ? 'bg-primary-soft border-indigo-200'
    : 'bg-slate-100/90 border-slate-200';

  const iconColor = isEarned ? '#4F46E5' : '#94A3B8';

  return (
    <View
      style={{
        width: dimensions.outer,
        height: dimensions.outer,
        borderRadius: dimensions.outer / 2,
      }}
      className={`items-center justify-center border-2 relative shadow-xs ${bgStyle}`}
    >
      {vectorIconName ? (
        <Ionicons name={vectorIconName} size={dimensions.icon} color={iconColor} />
      ) : icon ? (
        <AppText
          style={{ fontSize: dimensions.icon * 0.95 }}
          className={isEarned ? 'opacity-100' : 'opacity-30'}
        >
          {icon}
        </AppText>
      ) : (
        <Ionicons name="ribbon-outline" size={dimensions.icon} color={iconColor} />
      )}

      {!isEarned && showLock && (
        <View
          style={{ padding: dimensions.lockPad }}
          className="absolute bg-slate-700/90 rounded-full shadow-sm"
        >
          <Ionicons name="lock-closed" size={dimensions.lockSize} color="#FFFFFF" />
        </View>
      )}

      {isEarned && size !== 'sm' && (
        <View className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 border-2 border-white shadow-xs">
          <Ionicons name="checkmark" size={10} color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};
