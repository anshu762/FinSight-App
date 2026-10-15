import React from 'react';
import { View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card, Button } from '../ui';
import { type TradeResult } from '../../api/types';
import { formatIndianCurrency } from '../../lib/calculators';

interface TradeSuccessReceiptProps {
  result: TradeResult;
  onDone: () => void;
  onTradeAgain: () => void;
}

export const TradeSuccessReceipt: React.FC<TradeSuccessReceiptProps> = ({
  result,
  onDone,
  onTradeAgain,
}) => {
  const { trade, xpAwarded, learningTip } = result;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingBottom: 24 }}
    >
      <Card className="p-6 bg-surface border-border items-center mb-5">
        <View className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 items-center justify-center mb-3">
          <Ionicons name="checkmark-done" size={32} color="#059669" />
        </View>

        <AppText variant="h2" className="text-center text-text mb-1">
          Order Executed!
        </AppText>
        <AppText variant="caption" className="text-muted text-center text-xs mb-4">
          Your {trade.side} order was filled instantly at simulated market price.
        </AppText>

        <View className="w-full bg-slate-50 rounded-xl p-4 border border-border gap-2 mb-4">
          <View className="flex-row justify-between">
            <AppText variant="caption" className="text-slate-600">Asset</AppText>
            <AppText variant="caption" className="font-bold text-text">
              {trade.asset.symbol} ({trade.asset.name})
            </AppText>
          </View>
          <View className="flex-row justify-between">
            <AppText variant="caption" className="text-slate-600">Side</AppText>
            <AppText
              variant="caption"
              className={`font-bold ${trade.side === 'BUY' ? 'text-emerald-700' : 'text-rose-700'}`}
            >
              {trade.side}
            </AppText>
          </View>
          <View className="flex-row justify-between">
            <AppText variant="caption" className="text-slate-600">Quantity</AppText>
            <AppText variant="caption" className="font-bold text-text">
              {trade.quantity} units
            </AppText>
          </View>
          <View className="flex-row justify-between">
            <AppText variant="caption" className="text-slate-600">Execution Price</AppText>
            <AppText variant="caption" className="font-bold text-text">
              {formatIndianCurrency(trade.price)}
            </AppText>
          </View>
          <View className="flex-row justify-between pt-2 border-t border-slate-200">
            <AppText variant="caption" className="font-bold text-text">Total Value</AppText>
            <AppText variant="body" className="font-extrabold text-primary text-base">
              {formatIndianCurrency(trade.total)}
            </AppText>
          </View>
        </View>

        {xpAwarded > 0 && (
          <View className="w-full bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex-row items-center justify-center gap-1.5 mb-3">
            <Ionicons name="sparkles" size={14} color="#4F46E5" />
            <AppText variant="caption" className="text-primary font-bold text-xs">
              +{xpAwarded} XP Earned for Trading!
            </AppText>
          </View>
        )}

        {learningTip && (
          <View className="w-full bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex-row gap-2">
            <Ionicons name="bulb-outline" size={16} color="#B45309" />
            <AppText variant="caption" className="text-amber-900 text-xs flex-1 leading-4">
              {learningTip}
            </AppText>
          </View>
        )}
      </Card>

      <View className="gap-2.5">
        <Button title="View Portfolio" variant="primary" onPress={onDone} />
        <Button title="Trade Another Instrument" variant="secondary" onPress={onTradeAgain} />
      </View>
    </ScrollView>
  );
};
