import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, ModalSheet } from '../ui';
import { type BadgeItem } from '../../api/types';

import { BADGE_TIER_CONFIG, BadgeEmblem } from './BadgeEmblem';

interface BadgeDetailModalProps {
  badge: BadgeItem | null;
  onClose: () => void;
}

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  badge,
  onClose,
}) => {
  if (!badge) return null;

  const isEarned = badge.isEarned;
  const tier = BADGE_TIER_CONFIG[badge.rarity] || BADGE_TIER_CONFIG.COMMON;

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
        {/* Big High-Definition Emblem */}
        <BadgeEmblem
          badgeKey={badge.key}
          icon={badge.icon}
          isEarned={isEarned}
          size="lg"
          showLock={true}
        />

        {/* Badges Status Banner */}
        <View className="flex-row items-center gap-2">
          <View
            style={{
              backgroundColor: isEarned ? tier.bgSoft : '#F1F5F9',
              borderColor: isEarned ? tier.border : '#E2E8F0',
            }}
            className="px-3 py-1 rounded-full border"
          >
            <AppText
              style={{ color: isEarned ? tier.color : '#94A3B8' }}
              className="text-xs font-bold uppercase tracking-wider"
            >
              {tier.label}
            </AppText>
          </View>
          <View
            className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full border ${
              isEarned
                ? 'bg-primary-soft border-indigo-200'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            <Ionicons
              name={isEarned ? 'checkmark-circle' : 'lock-closed'}
              size={13}
              color={isEarned ? '#4F46E5' : '#64748B'}
            />
            <AppText
              className={`text-xs font-bold ${
                isEarned ? 'text-primary' : 'text-slate-500'
              }`}
            >
              {isEarned ? 'Unlocked' : 'Locked'}
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
