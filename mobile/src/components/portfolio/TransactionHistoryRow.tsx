import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card } from '../ui';
import { type TransactionItem } from '../../api/types';
import { formatIndianCurrency } from '../../lib/calculators';

interface TransactionHistoryRowProps {
  transaction: TransactionItem;
}

export const TransactionHistoryRow: React.FC<TransactionHistoryRowProps> = ({ transaction }) => {
  const isBuy = transaction.side === 'BUY';
  const timeStr = new Date(transaction.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="p-3.5 bg-surface border-border mb-2.5 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3 flex-1 mr-2">
        <View
          style={{ backgroundColor: isBuy ? '#ECFDF5' : '#FFF1F2' }}
          className="w-9 h-9 rounded-full items-center justify-center border border-slate-100"
        >
          <Ionicons
            name={isBuy ? 'arrow-down' : 'arrow-up'}
            size={16}
            color={isBuy ? '#059669' : '#E11D48'}
          />

        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <AppText variant="body" className="font-bold text-text text-sm">
              {transaction.asset.symbol}
            </AppText>
            <View className={`px-1.5 py-0.2 rounded ${isBuy ? 'bg-emerald-100' : 'bg-rose-100'}`}>
              <AppText
                variant="caption"
                className={`text-[10px] font-bold ${isBuy ? 'text-emerald-800' : 'text-rose-800'}`}
              >
                {transaction.side}
              </AppText>
            </View>
          </View>
          <AppText variant="caption" className="text-muted text-xs">
            {transaction.quantity} units @ {formatIndianCurrency(transaction.price)} • {timeStr}
          </AppText>
        </View>
      </View>

      <View className="items-end">
        <AppText
          variant="body"
          className={`font-bold text-sm ${isBuy ? 'text-rose-600' : 'text-emerald-600'}`}
        >
          {isBuy ? '-' : '+'}{formatIndianCurrency(transaction.total)}
        </AppText>
      </View>
    </Card>
  );
};
