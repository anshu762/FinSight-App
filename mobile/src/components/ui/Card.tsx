import React from 'react';
import { View, Pressable, type ViewProps } from 'react-native';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  className = '',
  style,
  ...rest
}) => {
  const baseClasses = `bg-surface border border-border rounded-card p-5 shadow-sm ${className}`;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`${baseClasses} active:opacity-90 active:scale-[0.99]`}
        style={style}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={baseClasses} style={style} {...rest}>
      {children}
    </View>
  );
};
