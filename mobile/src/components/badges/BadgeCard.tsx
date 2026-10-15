import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui';
import { type BadgeItem } from '../../api/types';

interface BadgeCardProps {
  badge: BadgeItem;
  onPress: () => void;
}

export const BADGE_TIER_CONFIG: Record<
  string,
  { label: string; color: string; bgSoft: string; border: string }
> = {
  COMMON: {
    label: 'Bronze',
    color: '#92400E',
    bgSoft: '#FEF3C7',
    border: '#FDE68A',
  },
  UNCOMMON: {
    label: 'Silver',
    color: '#475569',
    bgSoft: '#F1F5F9',
    border: '#CBD5E1',
  },
  RARE: {
    label: 'Gold',
    color: '#D97706',
    bgSoft: '#FFFBEB',
    border: '#FCD34D',
  },
  LEGENDARY: {
    label: 'Diamond',
    color: '#4F46E5',
    bgSoft: '#EEF2FF',
    border: '#C7D2FE',
  },
};

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onPress }) => {
  const isEarned = badge.isEarned;
  const tier = BADGE_TIER_CONFIG[badge.rarity] || BADGE_TIER_CONFIG.COMMON;

  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center justify-between p-3.5 rounded-2xl bg-surface border min-h-[128px] active:scale-95 active:opacity-85 shadow-sm ${
        isEarned ? 'border-border' : 'border-slate-100 bg-slate-50/50'
      }`}
      accessibilityLabel={`Badge: ${badge.name}. ${isEarned ? 'Earned' : 'Locked'}`}
    >
      {/* Icon or Lock */}
      <View
        style={{
          backgroundColor: isEarned ? tier.bgSoft : '#F1F5F9',
          borderColor: isEarned ? tier.border : '#E2E8F0',
        }}
        className="w-13 h-13 rounded-full items-center justify-center border-2 mb-2 relative shadow-xs"
      >
        <AppText className={`text-2xl ${isEarned ? 'opacity-100' : 'opacity-25'}`}>
          {badge.icon}
        </AppText>
        {!isEarned && (
          <View className="absolute bg-slate-700/90 rounded-full p-1 shadow-sm">
            <Ionicons name="lock-closed" size={11} color="#FFFFFF" />
          </View>
        )}
      </View>

      {/* Name */}
      <AppText
        variant="caption"
        numberOfLines={2}
        className={`font-bold text-center text-xs leading-4 ${
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
