import React from 'react';
import { View, Pressable, useWindowDimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { AppText } from '../ui/AppText';
import { type PricePoint } from '../../api/types';
import { formatIndianCurrency } from '../../lib/calculators';

export type ChartPeriod = '1D' | '1W' | '1M' | '3M' | '1Y';

export interface SparklineChartProps {
  data: PricePoint[];
  period: ChartPeriod;
  onPeriodChange: (p: ChartPeriod) => void;
  height?: number;
}

const PERIODS: ChartPeriod[] = ['1D', '1W', '1M', '3M', '1Y'];

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  period,
  onPeriodChange,
  height = 160,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = screenWidth - 40; // Screen padding 20 on each side

  if (!data || data.length < 2) {
    return (
      <View
        style={{ height }}
        className="w-full bg-slate-50 rounded-card items-center justify-center border border-border mb-4"
      >
        <AppText variant="caption" className="text-muted">
          Insufficient data to render chart
        </AppText>
      </View>
    );
  }

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const isPositive = lastPrice >= firstPrice;
  const strokeColor = isPositive ? '#10B981' : '#EF4444';

  const paddingTop = 12;
  const paddingBottom = 16;
  const availableHeight = height - paddingTop - paddingBottom;

  // Build SVG path
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const normalizedY = (point.price - minPrice) / priceRange;
    const y = height - paddingBottom - normalizedY * availableHeight;
    return { x, y };
  });

  const linePathD = points.reduce(
    (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`,
    ''
  );

  const fillPathD = `${linePathD} L ${chartWidth},${height} L 0,${height} Z`;

  return (
    <View className="mb-4">
      {/* High / Low markers */}
      <View className="flex-row justify-between items-center mb-1 px-1">
        <AppText variant="caption" className="text-slate-400 text-[11px]">
          Low: {formatIndianCurrency(minPrice)}
        </AppText>
        <AppText variant="caption" className="text-slate-400 text-[11px]">
          High: {formatIndianCurrency(maxPrice)}
        </AppText>
      </View>

      {/* SVG Canvas */}
      <View style={{ height, width: chartWidth }} className="overflow-hidden">
        <Svg width={chartWidth} height={height}>
          <Defs>
            <LinearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
              <Stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </LinearGradient>
          </Defs>

          {/* Area Fill */}
          <Path d={fillPathD} fill="url(#gradientArea)" />

          {/* Line Stroke */}
          <Path
            d={linePathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>

      {/* Period Switcher Tabs */}
      <View className="flex-row items-center justify-between mt-3 bg-slate-100 p-1 rounded-xl">
        {PERIODS.map((p) => {
          const isActive = p === period;
          return (
            <Pressable
              key={p}
              onPress={() => onPeriodChange(p)}
              className={`flex-1 py-1.5 rounded-lg items-center justify-center ${
                isActive ? 'bg-surface shadow-sm' : 'active:opacity-70'
              }`}
              accessibilityRole="button"
              accessibilityLabel={`Select period ${p}`}
            >
              <AppText
                variant="caption"
                className={`text-xs font-bold ${
                  isActive ? 'text-primary' : 'text-slate-500'
                }`}
              >
                {p}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
