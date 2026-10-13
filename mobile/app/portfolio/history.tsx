import React, { useState } from 'react';
import { View, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Screen,
  ScreenHeader,
  AppText,
  Skeleton,
  ErrorState,
  EmptyState,
} from '../../src/components/ui';
import { useTransactions } from '../../src/hooks/usePortfolio';
import { TransactionHistoryRow } from '../../src/components/portfolio';
import { type AssetType, type TransactionItem } from '../../src/api/types';

type FilterType = 'ALL' | AssetType;

const FILTER_TABS: Array<{ label: string; value: FilterType }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Stocks', value: 'STOCK' },
  { label: 'ETFs', value: 'ETF' },
  { label: 'Mutual Funds', value: 'MUTUAL_FUND' },
  { label: 'Crypto', value: 'CRYPTO' },
];

export default function TransactionsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useTransactions({
    type: activeFilter === 'ALL' ? undefined : activeFilter,
  });

  const transactions = data?.transactions || [];

  // Group transactions by date
  const groupedTransactions: Record<string, TransactionItem[]> = {};
  transactions.forEach((tx) => {
    const txDate = new Date(tx.createdAt);
    const dateKey = txDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    if (!groupedTransactions[dateKey]) {
      groupedTransactions[dateKey] = [];
    }
    groupedTransactions[dateKey].push(tx);
  });

  return (
    <Screen paddingHorizontal={false}>
      <View className="px-5">
        <ScreenHeader title="Trade History" />

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          <View className="flex-row gap-2">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.value;
              return (
                <Pressable
                  key={tab.value}
                  onPress={() => setActiveFilter(tab.value)}
                  className={`px-3.5 py-1.5 rounded-full border active:opacity-80 ${
                    isActive
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border active:bg-slate-100'
                  }`}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter by ${tab.label}`}
                >
                  <AppText
                    variant="caption"
                    className={`font-bold text-xs ${
                      isActive ? 'text-white' : 'text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
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
        {isLoading && !data ? (
          <View className="gap-3">
            <Skeleton width="100%" height={70} borderRadius={16} />
            <Skeleton width="100%" height={70} borderRadius={16} />
            <Skeleton width="100%" height={70} borderRadius={16} />
          </View>
        ) : isError && !data ? (
          <ErrorState
            title="Could not load trades"
            message={error?.message || 'Unable to connect to transaction database.'}
            onRetry={refetch}
          />
        ) : transactions.length > 0 ? (
          <View className="gap-4">
            {Object.entries(groupedTransactions).map(([dateLabel, items]) => (
              <View key={dateLabel}>
                <AppText
                  variant="caption"
                  className="font-bold text-slate-500 uppercase text-[11px] mb-2 px-1 tracking-wider"
                >
                  {dateLabel}
                </AppText>

                <View>
                  {items.map((tx) => (
                    <TransactionHistoryRow key={tx.id} transaction={tx} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            icon="receipt-outline"
            title="No transactions yet"
            description="Your trading log is currently empty. Buy some stocks, ETFs, or crypto to build your investment history."
            actionTitle="Explore Assets"
            onAction={() => router.push('/portfolio/explore')}
            className="mt-12"
          />
        )}
      </ScrollView>
    </Screen>
  );
}
