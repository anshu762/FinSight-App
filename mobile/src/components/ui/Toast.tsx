import React, { useEffect, useRef } from 'react';
import { Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useToastStore, type ToastType } from '../../stores/toast';

const toastConfig: Record<
  ToastType,
  { bg: string; border: string; icon: keyof typeof Ionicons.glyphMap; iconColor: string }
> = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'checkmark-circle',
    iconColor: '#10B981',
  },
  error: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    icon: 'alert-circle',
    iconColor: '#EF4444',
  },
  info: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: 'information-circle',
    iconColor: '#4F46E5',
  },
};

export const Toast: React.FC = () => {
  const { visible, message, type, hideToast } = useToastStore();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue<number>(-120);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(insets.top + 8, { damping: 14 });
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        hideToast();
      }, 3500);
    } else {
      translateY.value = withTiming(-120, { duration: 250 });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, insets.top, hideToast, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible && translateY.value <= -100) return null;

  const config = toastConfig[type];

  return (
    <Animated.View
      style={[{ position: 'absolute', top: 0, left: 16, right: 16, zIndex: 9999 }, animatedStyle]}
    >
      <Pressable
        onPress={hideToast}
        className={`flex-row items-center p-3.5 rounded-card border shadow-md ${config.bg} ${config.border}`}
      >
        <Ionicons name={config.icon} size={22} color={config.iconColor} />
        <Text className="flex-1 text-sm font-semibold text-text ml-2.5">{message}</Text>
        <Ionicons name="close" size={18} color="#94A3B8" />
      </Pressable>
    </Animated.View>
  );
};
