import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui';
import { type NewsCategory } from '../../api/types';
import { getCategoryTheme, formatRelativeTime } from '../../lib/format';

interface NewsHeaderBannerProps {
  category: NewsCategory;
  publishedAt: string;
  readMinutes: number;
}

export const NewsHeaderBanner: React.FC<NewsHeaderBannerProps> = ({
  category,
  publishedAt,
  readMinutes,
}) => {
  const theme = getCategoryTheme(category);
  const timeText = formatRelativeTime(publishedAt);

  return (
    <View
      style={{ backgroundColor: theme.bgLight, borderColor: theme.borderColor }}
      className="rounded-card border p-4 mb-4"
    >
      {/* Top Tag Row */}
      <View className="flex-row items-center justify-between mb-3">
        <View
          style={{ backgroundColor: theme.color }}
          className="flex-row items-center px-2.5 py-1 rounded-full"
        >
          <Ionicons name={theme.icon} size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
          <AppText variant="caption" className="text-white font-bold text-[11px] uppercase tracking-wider">
            {theme.label} Hub
          </AppText>
        </View>

        {/* Educational Sample Content Pill */}
        <View className="flex-row items-center bg-slate-100/90 border border-slate-200 px-2 py-0.5 rounded-full">
          <Ionicons name="information-circle-outline" size={11} color="#64748B" />
          <AppText variant="caption" className="text-muted text-[10px] font-semibold ml-1">
            Educational sample content
          </AppText>
        </View>
      </View>

      {/* Meta Row: Reading Time & Date */}
      <View className="flex-row items-center gap-2">
        <Ionicons name="time-outline" size={13} color={theme.color} />
        <AppText variant="caption" style={{ color: theme.textColor }} className="font-medium text-xs">
          {timeText} • {readMinutes} min read breakdown
        </AppText>
      </View>
    </View>
  );
};
