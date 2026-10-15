import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui';
import { useAssets } from '../../hooks/usePortfolio';
import { formatIndianCurrency } from '../../lib/calculators';

export const MarketTickerBar: React.FC = () => {
  const router = useRouter();
  const { data: assets } = useAssets({ type: 'STOCK' });

  const stocks = (assets || []).slice(0, 8);

  if (stocks.length === 0) {
    return null;
  }

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-1.5">
          <View className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <AppText variant="caption" className="font-bold text-xs text-text uppercase tracking-wider">
            Markets Today
          </AppText>
        </View>
        <Pressable
          onPress={() => router.push('/portfolio/explore')}
          hitSlop={6}
          className="active:opacity-75"
        >
          <AppText variant="caption" className="text-primary font-bold text-xs">
            See All &rarr;
          </AppText>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingRight: 4 }}
      >
        {stocks.map((item) => {
          const isPositive = (item.dayChange ?? 0) >= 0;
          return (
            <Pressable
              key={item.id}
              onPress={() => router.push(`/portfolio/${item.id}`)}
              className="bg-surface border border-border rounded-2xl p-3 min-w-[130px] active:scale-95 shadow-xs"
            >
              <View className="flex-row items-center justify-between mb-1">
                <AppText className="font-extrabold text-xs text-text">
                  {item.symbol}
                </AppText>
                <View
                  className={`flex-row items-center px-1.5 py-0.5 rounded-full ${
                    isPositive ? 'bg-emerald-50' : 'bg-rose-50'
                  }`}
                >
                  <Ionicons
                    name={isPositive ? 'caret-up' : 'caret-down'}
                    size={10}
                    color={isPositive ? '#10B981' : '#EF4444'}
                  />
                  <AppText
                    className={`text-[10px] font-bold ${
                      isPositive ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {Math.abs(item.dayChangePct ?? 0).toFixed(1)}%
                  </AppText>
                </View>
              </View>

              <AppText variant="caption" className="text-text font-bold text-sm">
                {formatIndianCurrency(item.currentPrice)}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
