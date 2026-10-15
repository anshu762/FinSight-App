import '../global.css';
import React, { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../src/stores/auth';
import { apiClient } from '../src/api/client';
import { queryClient } from '../src/api/query-client';
import { type UserProfile } from '../src/api/types';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { Toast, OfflineBanner } from '../src/components/ui';

// Silence Reanimated strict mode logger warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export { ErrorBoundary } from 'expo-router';

// Prevent native splash screen from hiding automatically
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const { isHydrated, hydrate } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // Hydrate auth state from SecureStore and validate with server
  useEffect(() => {
    const initAuth = async () => {
      try {
        await hydrate();
        const token = useAuthStore.getState().token;
        if (token) {
          try {
            const freshUser = await apiClient.get<unknown, { user: UserProfile }>('/api/auth/me');
            if (freshUser?.user) {
              await useAuthStore.getState().updateUser(freshUser.user);
            }
          } catch {
            // If offline, keep cached user; if 401, apiClient interceptor handles logout
          }
        }
      } finally {
        setAppReady(true);
      }
    };

    initAuth();
  }, [hydrate]);

  useEffect(() => {
    if (fontsLoaded && isHydrated && appReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, isHydrated, appReady]);

  if (!fontsLoaded || !isHydrated || !appReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <View className="flex-1 bg-background">
          <OfflineBanner />
          <Toast />
          <RootLayoutNav />
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const { token, user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleRouteGuard = useCallback(() => {
    const inAuthGroup =
      pathname.startsWith('/(auth)') ||
      pathname === '/welcome' ||
      pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/age-group';
    const isAgeGroupScreen = pathname.includes('age-group');

    const isAuthenticated = Boolean(token && user);

    if (!isAuthenticated && !inAuthGroup) {
      // Unauthenticated user -> redirect to welcome
      router.replace('/(auth)/welcome');
    } else if (isAuthenticated) {
      if (!user?.ageGroup && !isAgeGroupScreen) {
        // Must select age group first
        router.replace('/(auth)/age-group');
      } else if (user?.ageGroup && inAuthGroup) {
        // Authenticated user with ageGroup who lands on auth screen -> redirect to tabs
        router.replace('/(tabs)');
      }
    }
  }, [token, user, pathname, router]);

  useEffect(() => {
    handleRouteGuard();
  }, [handleRouteGuard]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="topic/[slug]" options={{ headerShown: false }} />
      <Stack.Screen name="lesson/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="news/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="badges" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="portfolio/explore" options={{ headerShown: false }} />
      <Stack.Screen name="portfolio/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="portfolio/trade" options={{ headerShown: false }} />
      <Stack.Screen name="portfolio/history" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
    </Stack>
  );
}
