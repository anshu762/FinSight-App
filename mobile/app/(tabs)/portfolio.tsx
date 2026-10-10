import React from 'react';
import { Screen, ScreenHeader, EmptyState } from '../../src/components/ui';

export default function PortfolioTab() {
  return (
    <Screen className="py-2">
      <ScreenHeader title="Virtual Portfolio" showBack={false} />

      <EmptyState
        icon="pie-chart-outline"
        title="Trading Simulator"
        description="Phase 5 will build the virtual trading simulator with ₹10,00,000 virtual cash, live asset quotes, buy/sell orders, and holdings breakdown here."
        className="mt-12"
      />
    </Screen>
  );
}
