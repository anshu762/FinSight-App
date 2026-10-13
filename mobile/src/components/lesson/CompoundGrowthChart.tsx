import React from 'react';
import { View } from 'react-native';
import { AppText, Card } from '../ui';
import { formatIndianCurrency } from '../../lib/calculators';

interface CompoundGrowthChartProps {
  totalDeposited: number;
  totalGrowth: number;
  futureValue: number;
  years: number;
}

export const CompoundGrowthChart: React.FC<CompoundGrowthChartProps> = ({
  totalDeposited,
  totalGrowth,
  futureValue,
  years,
}) => {
  const depositRatio = futureValue > 0 ? (totalDeposited / futureValue) * 100 : 50;
  const growthRatio = futureValue > 0 ? (totalGrowth / futureValue) * 100 : 50;

  return (
    <Card className="p-4 bg-surface border-border mb-4">
      <AppText variant="caption" className="font-bold text-slate-500 uppercase text-[11px] mb-2">
        Projection After {years} Years
      </AppText>

      <AppText variant="h2" className="text-2xl font-bold text-primary mb-3">
        {formatIndianCurrency(futureValue)}
      </AppText>

      {/* Visual Proportion Bar */}
      <View className="h-4 rounded-full bg-slate-100 flex-row overflow-hidden mb-3">
        <View style={{ width: `${Math.max(5, depositRatio)}%` }} className="bg-slate-400" />
        <View style={{ width: `${Math.max(5, growthRatio)}%` }} className="bg-emerald-500" />
      </View>

      <View className="flex-row justify-between pt-1">
        <View>
          <View className="flex-row items-center gap-1.5">
            <View className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <AppText variant="caption" className="text-muted text-xs">
              Principal Invested
            </AppText>
          </View>
          <AppText variant="body" className="font-bold text-text text-sm mt-0.5">
            {formatIndianCurrency(totalDeposited)}
          </AppText>
        </View>

        <View className="items-end">
          <View className="flex-row items-center gap-1.5">
            <View className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <AppText variant="caption" className="text-muted text-xs">
              Compound Interest
            </AppText>
          </View>
          <AppText variant="body" className="font-bold text-emerald-600 text-sm mt-0.5">
            +{formatIndianCurrency(totalGrowth)}
          </AppText>
        </View>
      </View>
    </Card>
  );
};
