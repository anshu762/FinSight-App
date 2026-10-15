import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card } from '../ui';
import { type NewsArticleItem } from '../../api/types';
import { formatRelativeTime, getCategoryTheme } from '../../lib/format';

interface NewsArticleCardProps {
  article: NewsArticleItem;
  onPress: () => void;
}

export const NewsArticleCard: React.FC<NewsArticleCardProps> = ({
  article,
  onPress,
}) => {
  const theme = getCategoryTheme(article.category);
  const timeText = formatRelativeTime(article.publishedAt);

  return (
    <Pressable
      onPress={onPress}
      className="active:opacity-85 mb-3"
      accessibilityRole="button"
      accessibilityLabel={`News article: ${article.title}. ${article.isRead ? 'Already read' : 'Unread'}`}
    >
      <Card className="p-4 bg-surface border-border">
        {/* Top Header: Category Tag + Read Status */}
        <View className="flex-row items-center justify-between mb-2">
          <View
            style={{ backgroundColor: theme.bgLight, borderColor: theme.borderColor }}
            className="flex-row items-center px-2 py-0.5 rounded-full border"
          >
            <Ionicons name={theme.icon} size={11} color={theme.textColor} style={{ marginRight: 4 }} />
            <AppText
              variant="caption"
              style={{ color: theme.textColor }}
              className="font-bold text-[10px] tracking-wide uppercase"
            >
              {theme.label}
            </AppText>
          </View>

          {article.isRead ? (
            <View className="flex-row items-center bg-slate-100 px-2 py-0.5 rounded-full">
              <Ionicons name="checkmark-circle" size={12} color="#64748B" />
              <AppText variant="caption" className="text-muted text-[10px] font-semibold ml-1">
                Read
              </AppText>
            </View>
          ) : (
            <View className="flex-row items-center bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              <View className="w-1.5 h-1.5 rounded-full bg-primary mr-1" />
              <AppText variant="caption" className="text-primary text-[10px] font-bold">
                +25 XP
              </AppText>
            </View>
          )}
        </View>

        {/* Headline: Max 2 lines */}
        <AppText
          variant="body"
          numberOfLines={2}
          className="font-bold text-text text-base leading-5 mb-1.5"
        >
          {article.title}
        </AppText>

        {/* Summary: Max 2 lines */}
        <AppText
          variant="caption"
          numberOfLines={2}
          className="text-muted leading-4 text-xs mb-3"
        >
          {article.summary}
        </AppText>

        {/* Footer: Relative time & read minutes */}
        <View className="flex-row items-center justify-between pt-2 border-t border-slate-100">
          <AppText variant="caption" className="text-muted text-[11px]">
            {timeText} • {article.readMinutes} min read
          </AppText>
          <View className="flex-row items-center">
            <AppText variant="caption" className="text-primary font-semibold text-xs mr-0.5">
              Read Breakdown
            </AppText>
            <Ionicons name="chevron-forward" size={12} color="#4F46E5" />
          </View>
        </View>
      </Card>
    </Pressable>
  );
};
