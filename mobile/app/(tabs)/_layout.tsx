import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Keyboard, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type TabRouteName = 'index' | 'learn' | 'portfolio' | 'news';

const TAB_CONFIG: Record<
  TabRouteName,
  { label: string; iconOutline: keyof typeof Ionicons.glyphMap; iconFilled: keyof typeof Ionicons.glyphMap }
> = {
  index: {
    label: 'Home',
    iconOutline: 'home-outline',
    iconFilled: 'home',
  },
  learn: {
    label: 'Learn',
    iconOutline: 'school-outline',
    iconFilled: 'school',
  },
  portfolio: {
    label: 'Portfolio',
    iconOutline: 'pie-chart-outline',
    iconFilled: 'pie-chart',
  },
  news: {
    label: 'News',
    iconOutline: 'newspaper-outline',
    iconFilled: 'newspaper',
  },
};

const TabItemButton: React.FC<{
  isFocused: boolean;
  config: { label: string; iconOutline: keyof typeof Ionicons.glyphMap; iconFilled: keyof typeof Ionicons.glyphMap };
  onPress: () => void;
}> = ({ isFocused, config, onPress }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isFocused) {
      scale.value = withSequence(
        withTiming(0.85, { duration: 70 }),
        withSpring(1.18, { damping: 10, stiffness: 240 }),
        withSpring(1, { damping: 14, stiffness: 180 })
      );
    } else {
      scale.value = withTiming(1, { duration: 150 });
    }
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconName = isFocused ? config.iconFilled : config.iconOutline;
  const color = isFocused ? '#4F46E5' : '#64748B';

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className="flex-1 items-center justify-center py-1 active:opacity-75"
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={config.label}
    >
      <Animated.View style={animatedIconStyle} className="items-center justify-center">
        <View
          style={{ height: 32, minWidth: 44, borderRadius: 16 }}
          className={`items-center justify-center px-3.5 ${
            isFocused ? 'bg-indigo-50/90' : 'bg-transparent'
          }`}
        >
          <Ionicons name={iconName} size={22} color={color} />
        </View>
      </Animated.View>
      <Text
        style={{ color }}
        className={`text-[11px] mt-0.5 tracking-tight ${
          isFocused ? 'font-bold' : 'font-medium'
        }`}
      >
        {config.label}
      </Text>
    </Pressable>
  );
};

const CustomTabBar = ({ state, navigation }: { state: any; navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (isKeyboardVisible) return null;

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
      className="bg-surface border-t border-border flex-row items-center justify-around pt-1.5 shadow-lg"
    >
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const config = TAB_CONFIG[route.name as TabRouteName];

        if (!config) return null;

        const onPress = () => {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch {
            // Haptic fallback
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabItemButton
            key={route.key}
            isFocused={isFocused}
            config={config}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="learn" options={{ title: 'Learn' }} />
      <Tabs.Screen name="portfolio" options={{ title: 'Portfolio' }} />
      <Tabs.Screen name="news" options={{ title: 'News' }} />
    </Tabs>
  );
}
