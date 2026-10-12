import React, { useEffect } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  color?: string;
  className?: string;
  fillClassName?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color,
  className = '',
  fillClassName = 'bg-primary',
  style,
}) => {
  const animatedProgress = useSharedValue<number>(0);

  useEffect(() => {
    const clamped = Math.min(1, Math.max(0, progress));
    animatedProgress.value = withTiming(clamped, { duration: 300 });
  }, [progress, animatedProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value * 100}%`,
    };
  });

  return (
    <View
      className={`w-full bg-primary-soft rounded-chip overflow-hidden ${className}`}
      style={[{ height }, style]}
    >
      <Animated.View
        className={`h-full rounded-chip ${fillClassName}`}
        style={[animatedStyle, color ? { backgroundColor: color } : undefined]}
      />
    </View>
  );
};
