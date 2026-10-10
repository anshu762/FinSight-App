import React from 'react';
import { Screen, ScreenHeader, EmptyState } from '../../src/components/ui';

export default function LearnTab() {
  return (
    <Screen className="py-2">
      <ScreenHeader title="Learn" showBack={false} />

      <EmptyState
        icon="school-outline"
        title="Learning Modules"
        description="Phase 4 will build the 5-step interactive lesson curriculum (Hook, Micro-lesson, Simulation, Quiz, and XP Reward) here."
        className="mt-12"
      />
    </Screen>
  );
}
