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
          <View className="w-2 h-2 rounded-full bg-emerald-500" />
          <AppText variant="caption" className="font-bold text-xs text-text uppercase tracking-wider">
            Markets Today
          </AppText>
        </View>
        <Pressable
          onPress={() => router.push('/portfolio/explore')}
          hitSlop={6}
          className="flex-row items-center gap-1 active:opacity-75"
        >
          <AppText variant="caption" className="text-primary font-bold text-xs">
            See All
          </AppText>
          <Ionicons name="arrow-forward" size={12} color="#4F46E5" />
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
              className="bg-surface border border-border rounded-2xl p-3 w-[155px] active:scale-95 shadow-xs"
            >
              <View className="flex-row items-center justify-between mb-0.5">
                <AppText numberOfLines={1} className="font-extrabold text-xs text-text flex-1 mr-1">
                  {item.symbol}
                </AppText>
                <View
                  className={`flex-row items-center px-1.5 py-0.5 rounded-full border ${
                    isPositive ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <Ionicons
                    name={isPositive ? 'caret-up' : 'caret-down'}
                    size={9}
                    color={isPositive ? '#10B981' : '#EF4444'}
                  />
                  <AppText
                    className={`text-[10px] font-bold ml-0.5 ${
                      isPositive ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {Math.abs(item.dayChangePct ?? 0).toFixed(1)}%
                  </AppText>
                </View>
              </View>

              <AppText numberOfLines={1} className="text-[11px] text-muted font-medium mb-1.5">
                {item.name}
              </AppText>

              <AppText className="text-sm font-extrabold text-text">
                {formatIndianCurrency(item.currentPrice)}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
