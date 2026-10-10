import React, { useRef, useCallback } from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  View,
  type PressableProps,
} from 'react-native';
import * as Haptics from 'expo-haptics';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  className?: string;
  onPress?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  className = '',
  onPress,
  ...rest
}) => {
  const lastPressRef = useRef<number>(0);

  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    const now = Date.now();
    if (now - lastPressRef.current < 450) {
      return; // Double-tap protection
    }
    lastPressRef.current = now;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Graceful fallback if haptics fail
    }

    onPress?.();
  }, [disabled, loading, onPress]);

  const heightClass = size === 'sm' ? 'h-[40px] px-4' : 'h-[52px] px-5';

  const variantContainer: Record<ButtonVariant, string> = {
    primary: 'bg-primary border-primary active:bg-primary-dark',
    secondary: 'bg-surface border-border active:bg-slate-100',
    ghost: 'bg-transparent border-transparent active:bg-slate-100',
    danger: 'bg-danger border-danger active:opacity-90',
  };

  const variantText: Record<ButtonVariant, string> = {
    primary: 'text-white',
    secondary: 'text-text',
    ghost: 'text-primary',
    danger: 'text-white',
  };

  const isDisabled = disabled || loading;
  const disabledContainer = isDisabled ? 'opacity-50' : '';

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center rounded-button border ${heightClass} ${variantContainer[variant]} ${disabledContainer} ${className}`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#4F46E5'}
        />
      ) : (
        <>
          {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
          <Text className={`font-semibold text-base ${variantText[variant]}`}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
};
