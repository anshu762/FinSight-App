import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, RefreshControl, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, ScreenHeader, Skeleton, ErrorState, EmptyState } from '../../src/components/ui';
import { useAssets } from '../../src/hooks/usePortfolio';
import { ExploreAssetCard, AssetFilterChips, type FilterType } from '../../src/components/portfolio';

export default function ExploreAssetsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedQuery(searchQuery); }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: assets, isLoading, isError, error, refetch, isRefetching } = useAssets({
    type: activeFilter === 'ALL' ? undefined : activeFilter,
    q: debouncedQuery,
  });

  return (
    <Screen paddingHorizontal={false}>
      <View className="px-5">
        <ScreenHeader title="Explore Instruments" />
        <View
          style={{ borderRadius: 9999 }}
          className="flex-row items-center bg-slate-100/90 border border-slate-200/90 px-3.5 h-[46px] mb-3 shadow-xs"
        >
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput
            className="flex-1 ml-2 text-text text-sm py-0"
            placeholder="Search stocks, ETFs, crypto..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8} className="p-1">
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      </View>

      <AssetFilterChips selected={activeFilter} onSelect={setActiveFilter} />

      {isLoading && !assets ? (
        <View className="px-5 pt-2 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} width="100%" height={68} borderRadius={16} />
          ))}
        </View>
      ) : isError || !assets ? (
        <View className="flex-1 justify-center px-5">
          <ErrorState title="Failed to Load" message={error?.message || 'Could not fetch asset catalog.'} onRetry={refetch} />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#4F46E5" colors={['#4F46E5']} />}
        >
          {assets.length === 0 ? (
            <EmptyState
              icon="search-outline"
              title="No Instruments Found"
              description="Try adjusting your filter or search terms."
              className="mt-12"
            />
          ) : (
            assets.map((asset) => (
              <ExploreAssetCard
                key={asset.id}
                asset={asset}
                onPress={() => router.push(`/portfolio/${asset.id}`)}
              />
            ))
          )}
        </ScrollView>
      )}
    </Screen>
  );
}
