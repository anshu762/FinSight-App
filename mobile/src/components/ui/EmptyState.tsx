import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'file-tray-outline',
  title,
  description,
  actionTitle,
  onAction,
  className = '',
}) => {
  return (
    <View className={`items-center justify-center py-10 px-6 ${className}`}>
      <View className="w-16 h-16 rounded-full bg-primary-soft items-center justify-center mb-4">
        <Ionicons name={icon} size={32} color="#4F46E5" />
      </View>
      <Text className="text-lg font-bold text-text text-center mb-1.5">{title}</Text>
      <Text className="text-sm text-muted text-center leading-5 max-w-[280px]">
        {description}
      </Text>
      {actionTitle && onAction ? (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          size="sm"
          className="mt-5"
        />
      ) : null}
    </View>
  );
};
