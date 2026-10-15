import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  type ViewStyle,
  type ScrollViewProps,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

export interface KeyboardScreenProps extends ScrollViewProps {
  children: React.ReactNode;
  className?: string;
  contentContainerClassName?: string;
  style?: ViewStyle;
  edges?: Edge[];
  paddingHorizontal?: boolean;
}

export const KeyboardScreen: React.FC<KeyboardScreenProps> = ({
  children,
  className = '',
  contentContainerClassName = '',
  style,
  edges = ['top', 'left', 'right', 'bottom'],
  paddingHorizontal = true,
  ...rest
}) => {
  const horizontalPadding = paddingHorizontal ? 'px-5' : '';

  return (
    <SafeAreaView edges={edges} className="flex-1 bg-background" style={style}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
      >
        <ScrollView
          className={`flex-1 ${className}`}
          contentContainerClassName={`flex-grow ${horizontalPadding} pb-16 ${contentContainerClassName}`}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          {...rest}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
