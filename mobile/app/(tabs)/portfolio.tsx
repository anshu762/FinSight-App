import React, { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Skeleton, ErrorState, EmptyState, ConfirmDialog, AppText, Card } from '../../src/components/ui';
import { usePortfolio, useResetPortfolio } from '../../src/hooks/usePortfolio';
import {
  AllocationBar,
  HoldingCard,
  PerformerChip,
  PortfolioHeroCard,
  PortfolioActionsBar,
} from '../../src/components/portfolio';
import { useToastStore } from '../../src/stores/toast';

export default function PortfolioTab() {
  const router = useRouter();
  const showToast = useToastStore((s) => s.show);

  const { data, isLoading, isError, error, refetch, isRefetching } = usePortfolio();
  const { mutate: doReset, isPending: isResetting } = useResetPortfolio();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleConfirmReset = () => {
    setShowResetConfirm(false);
    doReset(undefined, {
      onSuccess: (res) => showToast(res.message, 'success'),
      onError: (err) => showToast(err.message || 'Failed to reset portfolio', 'error'),
    });
  };

  if (isLoading && !data) {
    return (
      <Screen>
        <View className="pt-2 pb-4"><Skeleton width={140} height={28} borderRadius={8} /></View>
        <View className="gap-4">
          <Skeleton width="100%" height={150} borderRadius={16} />
          <Skeleton width="100%" height={80} borderRadius={16} />
          <Skeleton width="100%" height={70} borderRadius={16} />
        </View>
      </Screen>
    );
  }

  if (isError || !data) {
    return (
      <Screen>
        <View className="flex-1 justify-center">
          <ErrorState title="Portfolio Unavailable" message={error?.message || 'Could not load your portfolio.'} onRetry={refetch} />
        </View>
      </Screen>
    );
  }

  const { totalValue, totalReturn, totalReturnPct, dayChange, dayChangePct, cash, bestPerformer, worstPerformer, allocation, holdings } = data;

  return (
    <Screen paddingHorizontal={false}>
      <View className="px-5 pt-2 pb-2">
        <AppText variant="title" className="text-2xl font-bold text-text">Virtual Portfolio</AppText>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#4F46E5" colors={['#4F46E5']} />}
      >
        <PortfolioHeroCard
          totalValue={totalValue}
          totalReturn={totalReturn}
          totalReturnPct={totalReturnPct}
          dayChange={dayChange}
          dayChangePct={dayChangePct}
          cash={cash}
        />

        <PortfolioActionsBar
          onExplore={() => router.push('/portfolio/explore')}
          onHistory={() => router.push('/portfolio/history')}
          onReset={() => setShowResetConfirm(true)}
        />

        {(bestPerformer || worstPerformer) && (
          <View className="flex-row gap-3 mb-4">
            {bestPerformer && <PerformerChip type="best" holding={bestPerformer} />}
            {worstPerformer && <PerformerChip type="worst" holding={worstPerformer} />}
          </View>
        )}

        <AllocationBar allocation={allocation} totalValue={totalValue} />

        <View className="mt-4 mb-2">
          <AppText variant="h3" className="text-base font-bold text-text mb-2.5">
            Holdings ({holdings.length})
          </AppText>

          {holdings.length === 0 ? (
            <Card className="p-6 bg-surface border-border items-center">
              <EmptyState
                icon="wallet-outline"
                title="No Active Holdings"
                description="Use your ₹10,00,000 virtual balance to buy stocks, ETFs, mutual funds, or crypto."
                actionTitle="Explore Instruments"
                onAction={() => router.push('/portfolio/explore')}
              />
            </Card>
          ) : (
            holdings.map((h) => (
              <HoldingCard key={h.id} holding={h} onPress={() => router.push(`/portfolio/${h.assetId}`)} />
            ))
          )}
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={showResetConfirm}
        title="Reset Portfolio?"
        message="This will reset your cash to ₹10,00,000 and clear all holdings. You can only reset once every 7 days."
        confirmText={isResetting ? 'Resetting...' : 'Yes, Reset to ₹10L'}
        cancelText="Cancel"
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetConfirm(false)}
      />
    </Screen>
  );
}
