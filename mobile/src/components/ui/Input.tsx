import React, { forwardRef, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  type TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isPassword = false,
      containerClassName = '',
      className = '',
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const borderClass = error
      ? 'border-danger'
      : isFocused
      ? 'border-primary'
      : 'border-border';

    return (
      <View className={`w-full mb-4 ${containerClassName}`}>
        {label ? (
          <Text className="text-sm font-medium text-text mb-1.5">{label}</Text>
        ) : null}

        <View
          className={`flex-row items-center h-[52px] px-3.5 bg-surface border rounded-input ${borderClass}`}
        >
          {leftIcon ? <View className="mr-2.5">{leftIcon}</View> : null}

          <TextInput
            ref={ref}
            className={`flex-1 text-base text-text py-0 h-full ${className}`}
            placeholderTextColor="#94A3B8"
            secureTextEntry={isPassword && !showPassword}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...rest}
          />

          {isPassword ? (
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={12}
              className="p-1"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#64748B"
              />
            </Pressable>
          ) : rightIcon ? (
            <View className="ml-2">{rightIcon}</View>
          ) : null}
        </View>

        {error ? (
          <Text className="text-xs text-danger mt-1 font-medium">{error}</Text>
        ) : helperText ? (
          <Text className="text-xs text-muted mt-1">{helperText}</Text>
        ) : null}
      </View>
    );
  }
);

Input.displayName = 'Input';
