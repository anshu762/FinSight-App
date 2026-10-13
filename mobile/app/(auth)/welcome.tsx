import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Button, AppText } from '../../src/components/ui';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen paddingHorizontal={false}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Branding Section */}
        <View className="items-center mt-6">
          <View className="w-20 h-20 rounded-2xl bg-primary items-center justify-center shadow-md mb-5">
            <Ionicons name="trending-up" size={44} color="#FFFFFF" />
          </View>

          <AppText variant="title" className="text-3xl font-bold text-text tracking-tight text-center">
            FinSight
          </AppText>
          <AppText variant="h3" className="text-base font-semibold text-primary mt-1 text-center">
            Learn money. Play smart.
          </AppText>

          <AppText variant="body" className="text-sm text-muted text-center mt-3 px-4 leading-5">
            Master real-world financial literacy through bite-sized lessons and trade risk-free with ₹10,00,000 in virtual portfolio cash.
          </AppText>
        </View>

        {/* Feature Highlights Card */}
        <View className="bg-surface border border-border rounded-card p-4 my-5 shadow-sm">
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-full bg-topic-investing/10 items-center justify-center mr-3">
              <Ionicons name="school-outline" size={18} color="#10B981" />
            </View>
            <AppText variant="body" className="text-sm font-semibold text-text flex-1">
              5-step micro lessons tailored for your age
            </AppText>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-full bg-topic-stocks/10 items-center justify-center mr-3">
              <Ionicons name="pie-chart-outline" size={18} color="#3B82F6" />
            </View>
            <AppText variant="body" className="text-sm font-semibold text-text flex-1">
              Simulate real stock & crypto trades with virtual cash
            </AppText>
          </View>

          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-topic-taxes/10 items-center justify-center mr-3">
              <Ionicons name="flame-outline" size={18} color="#F59E0B" />
            </View>
            <AppText variant="body" className="text-sm font-semibold text-text flex-1">
              Build streaks, earn XP, and unlock badges
            </AppText>
          </View>
        </View>

        {/* Bottom Action Buttons */}
        <View className="w-full gap-3 pb-2">
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
      </ScrollView>
    </Screen>
  );
}
