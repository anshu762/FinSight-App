import React from 'react';
import { Pressable, Text, View, type PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface ChipProps extends Omit<PressableProps, 'children'> {
  label: string;
  selected?: boolean;
  variant?: 'primary' | 'warning' | 'success' | 'danger';
  icon?: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  variant,
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

  const getVariantStyles = () => {
    if (variant === 'warning') {
      return {
        container: 'bg-amber-50 border-amber-200',
        text: 'text-amber-800 font-bold',
      };
    }
    if (variant === 'success') {
      return {
        container: 'bg-emerald-50 border-emerald-200',
        text: 'text-emerald-800 font-bold',
      };
    }
    if (variant === 'danger') {
      return {
        container: 'bg-rose-50 border-rose-200',
        text: 'text-rose-800 font-bold',
      };
    }
    if (selected) {
      return {
        container: 'bg-primary border-primary',
        text: 'text-white font-semibold',
      };
    }
    return {
      container: 'bg-primary-soft border-primary/20',
      text: 'text-primary font-medium',
    };
  };

  const { container: containerStyle, text: textStyle } = getVariantStyles();

  return (
    <Pressable
      onPress={onPress ? handlePress : undefined}
      className={`flex-row items-center px-3 py-1.5 rounded-chip border ${containerStyle} ${className}`}
      {...rest}
    >
      {icon ? <View className="mr-1.5">{icon}</View> : null}
      <Text className={`text-xs ${textStyle}`}>{label}</Text>
    </Pressable>
  );
};
