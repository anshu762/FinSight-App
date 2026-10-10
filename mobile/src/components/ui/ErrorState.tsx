import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <View className={`items-center justify-center py-10 px-6 ${className}`}>
      <View className="w-16 h-16 rounded-full bg-rose-50 items-center justify-center mb-4 border border-rose-200">
        <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
      </View>
      <Text className="text-lg font-bold text-text text-center mb-1.5">{title}</Text>
      <Text className="text-sm text-muted text-center leading-5 max-w-[280px]">
        {message}
      </Text>
      {onRetry ? (
        <Button
          title="Try Again"
          onPress={onRetry}
          variant="primary"
          size="sm"
          className="mt-5"
        />
      ) : null}
    </View>
  );
};
