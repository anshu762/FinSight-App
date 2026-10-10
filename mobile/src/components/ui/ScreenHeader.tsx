import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export interface ScreenHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBack = true,
  onBack,
  rightAction,
  className = '',
}) => {
  const router = useRouter();

  const handleBack = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }

    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View
      className={`flex-row items-center justify-between h-[52px] mb-2 px-1 ${className}`}
    >
      <View className="w-[44px] h-[44px] items-start justify-center">
        {showBack ? (
          <Pressable
            onPress={handleBack}
            hitSlop={8}
            className="w-[44px] h-[44px] items-center justify-center rounded-full active:bg-slate-100"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </Pressable>
        ) : null}
      </View>

      <View className="flex-1 items-center justify-center">
        {title ? (
          <Text
            numberOfLines={1}
            className="text-lg font-bold text-text text-center"
          >
            {title}
          </Text>
        ) : null}
      </View>

      <View className="w-[44px] h-[44px] items-end justify-center">
        {rightAction ? rightAction : null}
      </View>
    </View>
  );
};
