import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Keyboard, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

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
      className="bg-surface border-t border-border flex-row items-center justify-around pt-2 shadow-lg"
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

        const iconName = isFocused ? config.iconFilled : config.iconOutline;
        const color = isFocused ? '#4F46E5' : '#64748B';

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            hitSlop={8}
            className="flex-1 items-center justify-center py-1 active:opacity-70"
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={config.label}
          >
            <View className="items-center justify-center relative">
              <Ionicons name={iconName} size={24} color={color} />
              {isFocused ? (
                <View className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
              ) : (
                <View className="w-1.5 h-1.5 mt-1" />
              )}
            </View>
            <Text
              style={{ color }}
              className={`text-[11px] mt-0.5 ${isFocused ? 'font-bold' : 'font-medium'}`}
            >
              {config.label}
            </Text>
          </Pressable>
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
