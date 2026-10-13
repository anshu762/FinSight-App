import React from 'react';
import { View } from 'react-native';
import { AppText, Card } from '../ui';
import { formatIndianCurrency } from '../../lib/calculators';

interface SalaryBreakdownCardProps {
  grossMonthly: number;
  epfDeduction: number;
  taxDeduction: number;
  inHandMonthly: number;
}

export const SalaryBreakdownCard: React.FC<SalaryBreakdownCardProps> = ({
  grossMonthly,
  epfDeduction,
  taxDeduction,
  inHandMonthly,
}) => {
  return (
    <Card className="p-4 bg-surface border-border mb-4">
      <AppText variant="caption" className="font-bold text-slate-500 uppercase text-[11px] mb-2">
        Estimated Monthly In-Hand
      </AppText>

      <AppText variant="h2" className="text-2xl font-bold text-emerald-600 mb-3">
        {formatIndianCurrency(inHandMonthly)} / mo
      </AppText>

      <View className="bg-slate-50 rounded-xl p-3 border border-border gap-2">
        <View className="flex-row justify-between">
          <AppText variant="caption" className="text-muted">Gross Monthly</AppText>
          <AppText variant="caption" className="font-semibold text-text">
            {formatIndianCurrency(grossMonthly)}
          </AppText>
        </View>

        <View className="flex-row justify-between">
          <AppText variant="caption" className="text-rose-600">- EPF (Provident Fund)</AppText>
          <AppText variant="caption" className="font-semibold text-rose-600">
            -{formatIndianCurrency(epfDeduction)}
          </AppText>
        </View>

        <View className="flex-row justify-between">
          <AppText variant="caption" className="text-rose-600">- Income Tax (TDS)</AppText>
          <AppText variant="caption" className="font-semibold text-rose-600">
            -{formatIndianCurrency(taxDeduction)}
          </AppText>
        </View>
      </View>
    </Card>
  );
};
