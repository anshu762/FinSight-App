import React from 'react';
import { View } from 'react-native';
import { AppText, Card } from '../ui';
import { formatIndianCurrency } from '../../lib/calculators';

interface AssetKeyMetricsProps {
  type: string;
  minInvestment: number;
  allowFractional: boolean;
  volatility: number;
}

export const AssetKeyMetrics: React.FC<AssetKeyMetricsProps> = ({
  type,
  minInvestment,
  allowFractional,
  volatility,
}) => {
  const getVolatilityLabel = (vol: number) => {
    if (vol <= 0.05) return 'Low (Stable)';
    if (vol <= 0.1) return 'Moderate';
    return 'High (Aggressive)';
  };

  const metrics = [
    { label: 'Asset Class', value: type.replace('_', ' ') },
    { label: 'Minimum Investment', value: formatIndianCurrency(minInvestment) },
    { label: 'Fractional Orders', value: allowFractional ? 'Allowed (up to 4 decimals)' : 'Whole Units Only' },
    { label: 'Volatility Index', value: getVolatilityLabel(volatility) },
  ];

  return (
    <Card className="p-4 bg-surface border-border mb-6">
      <AppText variant="caption" className="font-bold text-slate-700 uppercase text-xs mb-2.5">
        Instrument Details
      </AppText>

      <View className="gap-2">
        {metrics.map((m, idx) => (
          <View key={idx} className="flex-row justify-between items-center">
            <AppText variant="caption" className="text-slate-600">
              {m.label}
            </AppText>
            <AppText variant="caption" className="font-bold text-text">
              {m.value}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
};

