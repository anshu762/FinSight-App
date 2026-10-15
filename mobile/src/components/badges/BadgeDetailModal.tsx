import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, ModalSheet } from '../ui';
import { type BadgeItem } from '../../api/types';

import { BADGE_TIER_CONFIG } from './BadgeCard';

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
        {/* Big Icon */}
        <View
          style={{
            backgroundColor: isEarned ? tier.bgSoft : '#F1F5F9',
            borderColor: isEarned ? tier.border : '#E2E8F0',
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
            className={`flex-row items-center gap-1 px-3 py-1 rounded-full border ${
              isEarned
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            <Ionicons
              name={isEarned ? 'checkmark-circle' : 'lock-closed'}
              size={12}
              color={isEarned ? '#047857' : '#64748B'}
            />
            <AppText
              className={`text-xs font-bold ${
                isEarned ? 'text-emerald-700' : 'text-slate-500'
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
