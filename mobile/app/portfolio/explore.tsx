import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, RefreshControl } from 'react-native';
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
        <View className="flex-row items-center bg-surface border border-border rounded-input px-3 h-[46px] mb-3">
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            className="flex-1 ml-2 text-text text-sm py-0"
            placeholder="Search by name or ticker..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40 }}
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
