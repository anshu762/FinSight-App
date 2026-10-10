import React from 'react';
import { View, ScrollView, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

export interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  className?: string;
  contentContainerClassName?: string;
  style?: ViewStyle;
  edges?: Edge[];
  paddingHorizontal?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  className = '',
  contentContainerClassName = '',
  style,
  edges = ['top', 'left', 'right', 'bottom'],
  paddingHorizontal = true,
}) => {
  const horizontalClass = paddingHorizontal ? 'px-5' : '';

  return (
    <SafeAreaView
      edges={edges}
      className={`flex-1 bg-background ${className}`}
      style={style}
    >
      {scrollable ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={`${horizontalClass} ${contentContainerClassName}`}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View className={`flex-1 ${horizontalClass} ${contentContainerClassName}`}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};
