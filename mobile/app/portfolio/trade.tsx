import React, { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Screen,
  ScreenHeader,
  Skeleton,
} from '../../src/components/ui';
import {
  useAssetDetail,
  usePortfolio,
  useTrade,
} from '../../src/hooks/usePortfolio';
import {
  TradeSuccessReceipt,
  TradeOrderForm,
} from '../../src/components/portfolio';
import {
  type TransactionSide,
  type TradeResult,
} from '../../src/api/types';
import { useToastStore } from '../../src/stores/toast';

export default function TradeScreen() {
  const { assetId, initialSide } = useLocalSearchParams<{
    assetId: string;
    initialSide?: string;
  }>();
  const router = useRouter();
  const showToast = useToastStore((s) => s.show);

  const [tradeSuccessResult, setTradeSuccessResult] = useState<TradeResult | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: assetDetail, isLoading: isLoadingAsset } = useAssetDetail(assetId || '');
  const { data: portfolio } = usePortfolio();
  const { mutate: executeTradeMutation, isPending: isSubmitting } = useTrade();

  if (isLoadingAsset || !assetDetail) {
    return (
      <Screen>
        <ScreenHeader title="Order Execution" />
        <View className="gap-4 pt-4">
          <Skeleton width="100%" height={120} borderRadius={16} />
          <Skeleton width="100%" height={80} borderRadius={16} />
          <Skeleton width="100%" height={160} borderRadius={16} />
        </View>
      </Screen>
    );
  }

  const { asset, userHolding } = assetDetail;
  const cash = portfolio?.cash ?? 1000000;

  const handleExecuteTrade = (side: TransactionSide, quantity: number) => {
    setServerError(null);
    executeTradeMutation(
      {
        assetId: asset.id,
        side,
        quantity,
      },
      {
        onSuccess: (result) => {
          setTradeSuccessResult(result);
          if (result.xpAwarded > 0) {
            showToast(`🎉 First Trade Complete! +${result.xpAwarded} XP awarded!`, 'success');
          }
          if (result.newBadges && result.newBadges.length > 0) {
            showToast(`🏆 New Badge Unlocked: ${result.newBadges[0].name}!`, 'success');
          }
        },
        onError: (err) => {
          setServerError(err.message || 'Trade execution failed.');
        },
      }
    );
  };

  if (tradeSuccessResult) {
    return (
      <Screen>
        <ScreenHeader title="Order Confirmed" showBack={false} />
        <TradeSuccessReceipt
          result={tradeSuccessResult}
          onDone={() => router.replace('/(tabs)/portfolio')}
          onTradeAgain={() => {
            setTradeSuccessResult(null);
            setServerError(null);
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen paddingHorizontal={false}>
      <View className="px-5">
        <ScreenHeader title={`Trade ${asset.symbol}`} />
      </View>

      <TradeOrderForm
        asset={asset}
        userHolding={userHolding}
        cash={cash}
        initialSide={initialSide === 'SELL' ? 'SELL' : 'BUY'}
        isSubmitting={isSubmitting}
        onSubmit={handleExecuteTrade}
        serverError={serverError}
        onClearServerError={() => setServerError(null)}
      />
    </Screen>
  );
}
