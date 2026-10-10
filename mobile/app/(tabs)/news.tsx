import React from 'react';
import { Screen, ScreenHeader, EmptyState } from '../../src/components/ui';

export default function NewsTab() {
  return (
    <Screen className="py-2">
      <ScreenHeader title="Finance News" showBack={false} />

      <EmptyState
        icon="newspaper-outline"
        title="Market News & Insights"
        description="Phase 6 will build curated daily financial news, 'Why It Matters' takeaways, and links to relevant literacy lessons here."
        className="mt-12"
      />
    </Screen>
  );
}
