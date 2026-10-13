import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card } from '../ui';
import { getCategoryTheme } from '../../lib/format';
import { type NewsCategory } from '../../api/types';

interface NewsPreviewCardProps {
  news: null | {
    id?: string;
    title: string;
    summary: string;
    readMinutes: number;
    category?: NewsCategory | string;
    publishedAt?: string;
  };
  onPressNewsTab: () => void;
  onPressArticle?: (id: string) => void;
}

export const NewsPreviewCard: React.FC<NewsPreviewCardProps> = ({
  news,
  onPressNewsTab,
  onPressArticle,
}) => {
  const theme = news?.category ? getCategoryTheme(news.category) : null;

  const handleCardPress = () => {
    if (news?.id && onPressArticle) {
      onPressArticle(news.id);
    } else {
      onPressNewsTab();
    }
  };

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2.5">
        <AppText variant="h3">Financial Pulse</AppText>
        <Pressable
          onPress={onPressNewsTab}
          hitSlop={8}
          className="flex-row items-center gap-1 active:opacity-70"
          accessibilityLabel="Explore finance news tab"
        >
          <AppText variant="caption" className="text-primary font-bold">
            News Tab
          </AppText>
          <Ionicons name="chevron-forward" size={14} color="#4F46E5" />
        </Pressable>
      </View>

      {!news ? (
        <Card className="p-4 bg-surface border-border flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center">
            <Ionicons name="newspaper-outline" size={20} color="#64748B" />
          </View>
          <View className="flex-1">
            <AppText variant="body" className="font-semibold text-text text-sm">
              Daily Digest Coming Soon
            </AppText>
            <AppText variant="caption" className="text-muted mt-0.5 leading-4 text-xs">
              Curated Indian financial news and lesson links will launch in Phase 7.
            </AppText>
          </View>
        </Card>
      ) : (
        <Pressable
          onPress={handleCardPress}
          className="active:opacity-85"
          accessibilityRole="button"
          accessibilityLabel={`Read news: ${news.title}`}
        >
          <Card className="p-4 bg-surface border-border">
            <View className="flex-row items-center gap-2 mb-1.5">
              {theme && (
                <View
                  style={{ backgroundColor: theme.bgLight, borderColor: theme.borderColor }}
                  className="flex-row items-center px-2 py-0.5 rounded-full border"
                >
                  <AppText className="text-[10px] mr-1">{theme.emoji}</AppText>
                  <AppText
                    variant="caption"
                    style={{ color: theme.textColor }}
                    className="text-[10px] font-bold uppercase tracking-wide"
                  >
                    {theme.label}
                  </AppText>
                </View>
              )}
              <AppText variant="caption" className="text-muted text-xs">
                • {news.readMinutes} min read
              </AppText>
            </View>
            <AppText variant="body" numberOfLines={2} className="font-bold text-text mb-1">
              {news.title}
            </AppText>
            <AppText variant="caption" numberOfLines={2} className="text-muted leading-4">
              {news.summary}
            </AppText>
          </Card>
        </Pressable>
      )}
    </View>
  );
};
