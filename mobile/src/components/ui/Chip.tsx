import React from 'react';
import { Pressable, Text, View, type PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface ChipProps extends Omit<PressableProps, 'children'> {
  label: string;
  selected?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  icon,
  onPress,
  className = '',
  ...rest
}) => {
  const handlePress = () => {
    if (onPress) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Fallback
      }
      onPress();
    }
  };

  const containerStyle = selected
    ? 'bg-primary text-white border-primary'
    : 'bg-primary-soft text-primary border-primary/20';

  const textStyle = selected ? 'text-white font-semibold' : 'text-primary font-medium';

  return (
    <Pressable
      onPress={onPress ? handlePress : undefined}
      className={`flex-row items-center px-3.5 py-1.5 rounded-chip border ${containerStyle} ${className}`}
      {...rest}
    >
      {icon ? <View className="mr-1.5">{icon}</View> : null}
      <Text className={`text-xs ${textStyle}`}>{label}</Text>
    </Pressable>
  );
};
