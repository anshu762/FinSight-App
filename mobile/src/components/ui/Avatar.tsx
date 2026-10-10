import React from 'react';
import { View, Text } from 'react-native';

export interface AvatarProps {
  name?: string;
  size?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = 'User',
  size = 44,
  className = '',
}) => {
  const getInitials = (str: string) => {
    const parts = str.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return 'U';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    const first = parts[0][0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  };

  const initials = getInitials(name);
  const fontSize = Math.round(size * 0.4);

  return (
    <View
      className={`rounded-full bg-primary items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Text
        style={{ fontSize }}
        className="font-bold text-white tracking-wider"
      >
        {initials}
      </Text>
    </View>
  );
};
