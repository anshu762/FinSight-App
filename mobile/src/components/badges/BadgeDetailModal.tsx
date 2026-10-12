import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, ModalSheet } from '../ui';
import { type BadgeItem } from '../../api/types';

interface BadgeDetailModalProps {
  badge: BadgeItem | null;
  onClose: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  COMMON: '#64748B',
  UNCOMMON: '#10B981',
  RARE: '#3B82F6',
  LEGENDARY: '#F59E0B',
};

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  badge,
  onClose,
}) => {
  if (!badge) return null;

  const isEarned = badge.isEarned;
  const rarityColor = RARITY_COLORS[badge.rarity] || '#64748B';

  const formattedDate = badge.earnedAt
    ? new Date(badge.earnedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <ModalSheet
      visible={Boolean(badge)}
      onClose={onClose}
      title={badge.name}
      subtitle={`Category: ${badge.category}`}
    >
      <View className="items-center py-2 gap-4">
        {/* Big Icon */}
        <View
          style={{
            backgroundColor: isEarned ? `${rarityColor}18` : '#F1F5F9',
            borderColor: isEarned ? `${rarityColor}50` : '#E2E8F0',
          }}
          className="w-20 h-20 rounded-full items-center justify-center border-2 relative"
        >
          <AppText className={`text-4xl ${isEarned ? 'opacity-100' : 'opacity-30'}`}>
            {badge.icon}
          </AppText>
          {!isEarned && (
            <View className="absolute bg-slate-800/80 rounded-full p-2">
              <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Badges Status Banner */}
        <View className="flex-row items-center gap-2">
          <View
            style={{ backgroundColor: `${rarityColor}20` }}
            className="px-3 py-1 rounded-full"
          >
            <AppText
              style={{ color: rarityColor }}
              className="text-xs font-bold uppercase tracking-wider"
            >
              {badge.rarity}
            </AppText>
          </View>
          <View
            className={`px-3 py-1 rounded-full ${
              isEarned ? 'bg-emerald-100' : 'bg-slate-100'
            }`}
          >
            <AppText
              className={`text-xs font-bold ${
                isEarned ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              {isEarned ? '✓ Unlocked' : '🔒 Locked'}
            </AppText>
          </View>
        </View>

        {/* Description & Requirement Card */}
        <View className="w-full bg-slate-50 border border-border rounded-card p-4 gap-3">
          <View>
            <AppText variant="caption" className="font-bold text-slate-800 mb-0.5">
              Description
            </AppText>
            <AppText variant="caption" className="text-slate-600 leading-5">
              {badge.description}
            </AppText>
          </View>

          <View className="border-t border-slate-200 pt-2.5">
            <AppText variant="caption" className="font-bold text-slate-800 mb-0.5">
              How to Earn
            </AppText>
            <AppText variant="caption" className="text-slate-600 leading-5">
              {badge.requirementText}
            </AppText>
          </View>

          {isEarned && formattedDate && (
            <View className="border-t border-slate-200 pt-2.5 flex-row items-center gap-1.5">
              <Ionicons name="calendar-outline" size={14} color="#64748B" />
              <AppText variant="caption" className="text-muted text-xs">
                Earned on {formattedDate}
              </AppText>
            </View>
          )}
        </View>
      </View>
    </ModalSheet>
  );
};
