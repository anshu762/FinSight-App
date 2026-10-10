import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';

interface HealthData {
  status: string;
  message: string;
  timestamp: string;
}

interface ApiResponse {
  success: boolean;
  data?: HealthData;
  error?: {
    code: string;
    message: string;
  };
}

export default function TestScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [connected, setConnected] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState<string>('');
  const [serverTime, setServerTime] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [pressCount, setPressCount] = useState<number>(0);

  const rawApiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
  const apiUrl = rawApiUrl.replace(/\/$/, '');

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const endpoint = `${apiUrl}/health`;
      const response = await fetch(endpoint, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json: ApiResponse = await response.json();

      if (json.success && json.data) {
        setConnected(true);
        setServerMessage(json.data.message || json.data.status);
        setServerTime(json.data.timestamp);
      } else {
        setConnected(false);
        setErrorMessage(json.error?.message || 'Server returned unsuccessful envelope');
      }
    } catch (err) {
      setConnected(false);
      const message = err instanceof Error ? err.message : 'Unknown network error';
      setErrorMessage(
        `${message}. Ensure your backend server is running and your device is on the same Wi-Fi network.`
      );
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-5 pb-10">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-text">FinSight Setup</Text>
          <Text className="text-sm text-muted mt-1">Phase 0: Environment & NativeWind Verification</Text>
        </View>

        {/* Server Connection Status Card */}
        <View className="bg-surface p-5 rounded-card border border-border mb-5 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-semibold text-text">Backend Status</Text>
            {loading ? (
              <View className="flex-row items-center bg-primary-soft px-3 py-1 rounded-chip">
                <ActivityIndicator size="small" color="#4F46E5" />
                <Text className="text-xs text-primary font-medium ml-1.5">Checking...</Text>
              </View>
            ) : connected ? (
              <View className="bg-emerald-50 px-3 py-1 rounded-chip border border-emerald-200">
                <Text className="text-xs text-success font-semibold">● Connected</Text>
              </View>
            ) : (
              <View className="bg-rose-50 px-3 py-1 rounded-chip border border-rose-200">
                <Text className="text-xs text-danger font-semibold">● Offline</Text>
              </View>
            )}
          </View>

          <Text className="text-xs text-muted mb-1 font-mono">Target: {apiUrl}/health</Text>

          {connected ? (
            <View className="bg-emerald-50/50 p-3.5 rounded-button border border-emerald-100 mt-2">
              <Text className="text-sm font-bold text-success">✓ {serverMessage || 'Server connected'}</Text>
              {serverTime ? (
                <Text className="text-xs text-muted mt-1">Server Time: {new Date(serverTime).toLocaleTimeString()}</Text>
              ) : null}
            </View>
          ) : errorMessage ? (
            <View className="bg-rose-50 p-3.5 rounded-button border border-rose-100 mt-2">
              <Text className="text-sm font-semibold text-danger">Connection Error</Text>
              <Text className="text-xs text-muted mt-1 leading-4">{errorMessage}</Text>
            </View>
          ) : null}

          {/* Retry Button */}
          <Pressable
            onPress={checkHealth}
            disabled={loading}
            className="mt-4 bg-primary h-[52px] rounded-button items-center justify-center active:opacity-80 active:scale-[0.99]"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white font-semibold text-base">Re-check Server</Text>
            )}
          </Pressable>
        </View>

        {/* NativeWind Styling Demonstration Card */}
        <View className="bg-surface p-5 rounded-card border border-border mb-5 shadow-sm">
          <Text className="text-base font-semibold text-text mb-2">NativeWind v4 Design Tokens</Text>
          <Text className="text-xs text-muted mb-4">
            Proves Tailwind 3.4.x classes (colors, borders, radius, spacing, pressed state) are compiling:
          </Text>

          {/* Topic Color Swatches */}
          <Text className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Topic Tokens</Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            <View className="bg-topic-stocks px-3 py-1.5 rounded-chip">
              <Text className="text-white text-xs font-medium">Stocks #3B82F6</Text>
            </View>
            <View className="bg-topic-investing px-3 py-1.5 rounded-chip">
              <Text className="text-white text-xs font-medium">Investing #10B981</Text>
            </View>
            <View className="bg-topic-taxes px-3 py-1.5 rounded-chip">
              <Text className="text-white text-xs font-medium">Taxes #F59E0B</Text>
            </View>
            <View className="bg-topic-crypto px-3 py-1.5 rounded-chip">
              <Text className="text-white text-xs font-medium">Crypto #8B5CF6</Text>
            </View>
          </View>

          {/* Interactive Button to prove pressed state */}
          <Text className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Touch Feedback Test</Text>
          <Pressable
            onPress={() => setPressCount((prev) => prev + 1)}
            className="bg-primary-soft border border-primary/20 h-[52px] rounded-button items-center justify-center active:bg-primary active:opacity-90"
          >
            {({ pressed }) => (
              <Text
                className={`font-semibold text-sm ${
                  pressed ? 'text-white font-bold' : 'text-primary'
                }`}
              >
                {pressed ? 'Holding Down! (Active State)' : `Tapped ${pressCount} times — Tap Me`}
              </Text>
            )}
          </Pressable>
        </View>

        {/* Footer Note */}
        <View className="items-center py-2">
          <Text className="text-xs text-muted text-center">
            FinSight Architecture • Light Theme • Strict Mode
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
