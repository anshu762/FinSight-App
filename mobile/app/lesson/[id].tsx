import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, ScreenHeader, AppText, Button, Card } from '../../src/components/ui';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <Screen>
      <ScreenHeader title="Lesson Player" />

      <View className="flex-1 px-5 justify-center items-center">
        <Card className="p-6 bg-surface border-border items-center w-full max-w-[340px]">
          <View className="w-16 h-16 rounded-full bg-indigo-50 items-center justify-center mb-4 border border-indigo-100">
            <AppText className="text-3xl">🚀</AppText>
          </View>

          <AppText variant="h2" className="text-center mb-2">
            Lesson Player
          </AppText>

          <AppText variant="caption" className="text-muted text-center leading-5 mb-5">
            The full 5-step interactive lesson experience (Hook, Micro-lesson Cards, Simulation, Quiz, and Rewards) is scheduled for Phase 5.
          </AppText>

          <View className="w-full gap-2">
            <Button
              title="Return to Track"
              variant="primary"
              onPress={() => router.back()}
            />
          </View>
        </Card>
      </View>
    </Screen>
  );
}
