import React, { useEffect, useRef, useCallback } from 'react';
import { View, ScrollView, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, ScreenHeader, AppText, Skeleton, ErrorState } from '../../src/components/ui';
import { NewsHeaderBanner, RelatedLessonCard, NewsTakeawayBox } from '../../src/components/news';
import { useNewsArticleDetail, useMarkArticleRead } from '../../src/hooks/useNews';
import { useToastStore } from '../../src/stores/toast';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const showToast = useToastStore((s) => s.show);

  const { data: article, isLoading, isError, error, refetch } = useNewsArticleDetail(id);
  const markRead = useMarkArticleRead();
  const hasTriggeredReadRef = useRef(false);

  const triggerRead = useCallback(() => {
    if (hasTriggeredReadRef.current || !article || article.isRead) return;
    hasTriggeredReadRef.current = true;

    markRead.mutate(id, {
      onSuccess: (res) => {
        if (res.xpEarned > 0) {
          showToast(`🎉 +${res.xpEarned} XP Earned! Finance news read.`, 'success');
        }
        if (res.newBadges?.length) {
          res.newBadges.forEach((b) => {
            showToast(`🏆 Badge Unlocked: ${b.name}!`, 'success');
          });
        }
      },
    });
  }, [article, id, markRead, showToast]);

  // Read timer: triggers after ~5 seconds
  useEffect(() => {
    if (!article || article.isRead) return;
    const timer = setTimeout(() => {
      triggerRead();
    }, 5000);
    return () => clearTimeout(timer);
  }, [article, triggerRead]);

  // Scroll to bottom trigger
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 40;
    if (isCloseToBottom) {
      triggerRead();
    }
  };

  return (
    <Screen>
      <ScreenHeader
        title="News Breakdown"
        onBack={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)/news');
        }}
      />

      {isLoading ? (
        <View className="pt-2 gap-3">
          <Skeleton width="100%" height={90} className="rounded-card" />
          <Skeleton width="90%" height={28} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="80%" height={16} />
          <View className="my-4 gap-2">
            <Skeleton width="40%" height={20} />
            <Skeleton width="100%" height={70} />
          </View>
        </View>
      ) : isError || !article ? (
        <View className="pt-10">
          <ErrorState message={error?.message || 'Article could not be loaded.'} onRetry={refetch} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={400}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <NewsHeaderBanner
            category={article.category}
            publishedAt={article.publishedAt}
            readMinutes={article.readMinutes}
          />

          <AppText variant="h2" className="text-text font-bold text-xl leading-7 mb-2">
            {article.title}
          </AppText>

          <AppText variant="body" className="text-muted text-sm leading-5 mb-5 italic">
            {article.summary}
          </AppText>

          {/* Section: What Happened */}
          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <Ionicons name="newspaper-outline" size={16} color="#0F172A" />
              <AppText variant="h3" className="text-text text-base font-bold ml-1.5">
                What Happened?
              </AppText>
            </View>
            <View className="bg-surface border border-border rounded-card p-4">
              <AppText variant="body" className="text-slate-800 text-sm leading-6">
                {article.whatHappened}
              </AppText>
            </View>
          </View>

          {/* Section: Why It Matters */}
          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <Ionicons name="trending-up-outline" size={16} color="#0F172A" />
              <AppText variant="h3" className="text-text text-base font-bold ml-1.5">
                Why It Matters
              </AppText>
            </View>
            <View className="bg-surface border border-border rounded-card p-4 gap-2.5">
              {article.whyItMatters.map((bullet, idx) => (
                <View key={idx} className="flex-row items-start">
                  <View className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2.5 shrink-0" />
                  <AppText variant="body" className="flex-1 text-slate-800 text-sm leading-5">
                    {bullet}
                  </AppText>
                </View>
              ))}
            </View>
          </View>

          {/* Connected Lesson */}
          <RelatedLessonCard lesson={article.relatedLesson} />

          {/* Key Takeaway */}
          <NewsTakeawayBox takeaway={article.keyTakeaway} />
        </ScrollView>
      )}
    </Screen>
  );
}
