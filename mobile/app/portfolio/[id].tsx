import React, { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Screen,
  ScreenHeader,
  AppText,
  Button,
  Skeleton,
  ErrorState,
} from '../../src/components/ui';
import { useAssetDetail } from '../../src/hooks/usePortfolio';
import {
  SparklineChart,
  AssetHeaderCard,
  AssetPositionCard,
  AssetKeyMetrics,
  type ChartPeriod,
} from '../../src/components/portfolio';

export default function AssetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [period, setPeriod] = useState<ChartPeriod>('1D');

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useAssetDetail(id || '', period);

  if (isLoading && !data) {
    return (
      <Screen>
        <ScreenHeader title="Loading Asset..." />
        <View className="gap-4 pt-2">
          <Skeleton width={180} height={32} borderRadius={8} />
          <Skeleton width={120} height={20} borderRadius={6} />
          <Skeleton width="100%" height={200} borderRadius={16} />
          <Skeleton width="100%" height={90} borderRadius={16} />
        </View>
      </Screen>
    );
  }

  if (isError || !data) {
    return (
      <Screen>
        <ScreenHeader title="Instrument" />
        <View className="flex-1 justify-center">
          <ErrorState
            title="Instrument Not Found"
            message={error?.message || 'Could not retrieve live asset data.'}
            onRetry={refetch}
          />
        </View>
      </Screen>
    );
  }

  const { asset, series, userHolding } = data;
  const canSell = Boolean(userHolding && userHolding.quantity > 0);

  const handleBuyPress = () => {
    router.push({
      pathname: '/portfolio/trade',
      params: { assetId: asset.id, initialSide: 'BUY' },
    });
  };

  const handleSellPress = () => {
    router.push({
      pathname: '/portfolio/trade',
      params: { assetId: asset.id, initialSide: 'SELL' },
    });
  };

  return (
    <Screen paddingHorizontal={false}>
      <View className="px-5">
        <ScreenHeader title={asset.symbol} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#4F46E5"
            colors={['#4F46E5']}
          />
        }
      >
        <AssetHeaderCard asset={asset} />

        <SparklineChart
          data={series}
          period={period}
          onPeriodChange={setPeriod}
          height={180}
        />

        <AssetPositionCard symbol={asset.symbol} holding={userHolding} />

        <AssetKeyMetrics
          type={asset.type}
          minInvestment={asset.minInvestment}
          allowFractional={asset.allowFractional}
          volatility={asset.volatility}
        />

        <View className="items-center pb-3">
          <AppText variant="caption" className="text-slate-400 text-[11px] text-center italic">
            Simulated prices for learning. Not real market data.
          </AppText>
        </View>

        <View className="flex-row gap-3">
          <Button
            title="Buy"
            variant="primary"
            onPress={handleBuyPress}
            className="flex-1"
          />

          <View className="flex-1">
            <Button
              title="Sell"
              variant="secondary"
              disabled={!canSell}
              onPress={handleSellPress}
              className="w-full border-primary/30"
            />
            {!canSell ? (
              <AppText variant="caption" className="text-muted text-[10px] text-center mt-1">
                No units available to sell
              </AppText>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
