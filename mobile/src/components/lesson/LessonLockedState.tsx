import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card, Button } from '../ui';

interface LessonLockedStateProps {
  message?: string;
  onBack: () => void;
}

export const LessonLockedState: React.FC<LessonLockedStateProps> = ({
  message,
  onBack,
}) => {
  return (
    <View className="flex-1 px-5 justify-center items-center">
      <Card className="p-6 bg-surface border-border items-center w-full max-w-[340px]">
        <View className="w-16 h-16 rounded-full bg-amber-50 items-center justify-center mb-4 border border-amber-200">
          <Ionicons name="lock-closed" size={30} color="#D97706" />
        </View>

        <AppText variant="h2" className="text-center text-text mb-2">
          Lesson Locked
        </AppText>

        <AppText variant="body" className="text-muted text-center leading-5 text-sm mb-6">
          {message || 'You must complete the prerequisite lesson first before accessing this module.'}
        </AppText>

        <Button
          title="Back to Track"
          variant="primary"
          onPress={onBack}
          className="w-full"
        />
      </Card>
    </View>
  );
};
