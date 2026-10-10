import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/components/ui';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen className="justify-between py-6">
      {/* Top Branding Section */}
      <View className="items-center mt-12">
        <View className="w-20 h-20 rounded-2xl bg-primary items-center justify-center shadow-md mb-6">
          <Ionicons name="trending-up" size={44} color="#FFFFFF" />
        </View>

        <Text className="text-3xl font-bold text-text tracking-tight text-center">
          FinSight
        </Text>
        <Text className="text-lg font-medium text-primary mt-1 text-center">
          Learn money. Play smart.
        </Text>

        <Text className="text-sm text-muted text-center mt-4 px-6 leading-5">
          Master real-world financial literacy through bite-sized lessons and trade risk-free with ₹10,00,000 in virtual portfolio cash.
        </Text>
      </View>

      {/* Feature Highlights Card */}
      <View className="bg-surface border border-border rounded-card p-5 my-6 shadow-sm">
        <View className="flex-row items-center mb-3">
          <View className="w-8 h-8 rounded-full bg-topic-investing/10 items-center justify-center mr-3">
            <Ionicons name="school-outline" size={18} color="#10B981" />
          </View>
          <Text className="text-sm font-semibold text-text flex-1">
            5-step micro lessons tailored for your age
          </Text>
        </View>

        <View className="flex-row items-center mb-3">
          <View className="w-8 h-8 rounded-full bg-topic-stocks/10 items-center justify-center mr-3">
            <Ionicons name="pie-chart-outline" size={18} color="#3B82F6" />
          </View>
          <Text className="text-sm font-semibold text-text flex-1">
            Simulate real stock & crypto trades with virtual cash
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-topic-taxes/10 items-center justify-center mr-3">
            <Ionicons name="flame-outline" size={18} color="#F59E0B" />
          </View>
          <Text className="text-sm font-semibold text-text flex-1">
            Build streaks, earn XP, and unlock badges
          </Text>
        </View>
      </View>

      {/* Bottom Action Buttons */}
      <View className="w-full gap-3 mb-4">
        <Button
          title="Get Started"
          variant="primary"
          onPress={() => router.push('/(auth)/register')}
        />
        <Button
          title="I already have an account"
          variant="secondary"
          onPress={() => router.push('/(auth)/login')}
        />
      </View>
    </Screen>
  );
}
