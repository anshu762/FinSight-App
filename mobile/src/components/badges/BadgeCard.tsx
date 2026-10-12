import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui';
import { type BadgeItem } from '../../api/types';

interface BadgeCardProps {
  badge: BadgeItem;
  onPress: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  COMMON: '#64748B',
  UNCOMMON: '#10B981',
  RARE: '#3B82F6',
  LEGENDARY: '#F59E0B',
};

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onPress }) => {
  const isEarned = badge.isEarned;
  const rarityColor = RARITY_COLORS[badge.rarity] || '#64748B';

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center justify-between p-3 rounded-card bg-surface border border-border min-h-[120px] active:scale-95 active:opacity-80 shadow-sm"
      accessibilityLabel={`Badge: ${badge.name}. ${isEarned ? 'Earned' : 'Locked'}`}
    >
      {/* Icon or Lock */}
      <View
        style={{
          backgroundColor: isEarned ? `${rarityColor}15` : '#F1F5F9',
          borderColor: isEarned ? `${rarityColor}40` : '#E2E8F0',
        }}
        className="w-12 h-12 rounded-full items-center justify-center border mb-1.5 relative"
      >
        <AppText className={`text-2xl ${isEarned ? 'opacity-100' : 'opacity-30'}`}>
          {badge.icon}
        </AppText>
        {!isEarned && (
          <View className="absolute bg-slate-700/80 rounded-full p-1 shadow-sm">
            <Ionicons name="lock-closed" size={12} color="#FFFFFF" />
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

      {/* Rarity Tag */}
      <View
        style={{ backgroundColor: isEarned ? `${rarityColor}20` : '#F1F5F9' }}
        className="px-2 py-0.5 rounded-full mt-1"
      >
        <AppText
          style={{ color: isEarned ? rarityColor : '#94A3B8' }}
          className="text-[9px] font-bold uppercase tracking-wider"
        >
          {badge.rarity}
        </AppText>
      </View>
    </Pressable>
  );
};
