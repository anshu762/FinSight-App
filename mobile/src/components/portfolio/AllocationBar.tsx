import React from 'react';
import { View } from 'react-native';
import { AppText } from '../ui/AppText';
import { Card } from '../ui/Card';
import { type AllocationItem } from '../../api/types';
import { formatIndianCurrency } from '../../lib/calculators';

export interface AllocationBarProps {
  allocation: AllocationItem[];
  totalValue: number;
}

const ALLOCATION_COLORS: Record<string, string> = {
  CASH: '#64748B', // Slate
  STOCK: '#3B82F6', // Blue
  ETF: '#10B981', // Emerald
  MUTUAL_FUND: '#F59E0B', // Amber
  CRYPTO: '#8B5CF6', // Purple
};

export const AllocationBar: React.FC<AllocationBarProps> = ({
  allocation,
  totalValue,
}) => {
  // Only display items with value > 0 in the legend
  const activeItems = allocation.filter((item) => item.value > 0);

  return (
    <Card className="p-4 bg-surface border-border mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <AppText variant="caption" className="font-bold uppercase text-[11px] text-slate-700 tracking-wider">
          Asset Allocation
        </AppText>
        <AppText variant="caption" className="font-bold text-text text-xs">
          {formatIndianCurrency(totalValue)}
        </AppText>
      </View>

      {/* Horizontal Stacked Bar */}
      <View className="h-3.5 rounded-full flex-row overflow-hidden bg-slate-100 mb-3.5">
        {activeItems.map((item) => {
          const color = ALLOCATION_COLORS[item.type] || '#64748B';
          return (
            <View
              key={item.type}
              style={{
                flex: Math.max(1, item.pct),
                backgroundColor: color,
              }}
            />
          );
        })}
      </View>

      {/* Legend Grid */}
      <View className="flex-row flex-wrap gap-y-2 gap-x-4">
        {activeItems.map((item) => {
          const color = ALLOCATION_COLORS[item.type] || '#64748B';
          return (
            <View key={item.type} className="flex-row items-center gap-1.5 min-w-[40%]">
              <View
                style={{ backgroundColor: color }}
                className="w-2.5 h-2.5 rounded-full"
              />
              <View className="flex-row items-baseline gap-1">
                <AppText variant="caption" className="text-slate-600 text-xs">
                  {item.label}:
                </AppText>
                <AppText variant="caption" className="font-bold text-text text-xs">
                  {item.pct}%
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
};
