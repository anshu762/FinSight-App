import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  ScreenHeader,
  Card,
  Button,
  ConfirmDialog,
  Avatar,
  ProgressBar,
} from '../../src/components/ui';
import { useAuthStore } from '../../src/stores/auth';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showLogoutDialog, setShowLogoutDialog] = useState<boolean>(false);

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    await logout();
    router.replace('/(auth)/welcome');
  };

  const level = user?.level ?? 1;
  const progress = user?.progress ?? 0;
  const xp = user?.xp ?? 0;
  const cashBalance = user?.cashBalance ?? 1000000;

  return (
    <Screen className="py-2">
      <ScreenHeader
        title="FinSight"
        showBack={false}
        rightAction={
          <Button
            title="Log Out"
            variant="ghost"
            size="sm"
            onPress={() => setShowLogoutDialog(true)}
          />
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* User Greeting Card */}
        <View className="flex-row items-center justify-between mb-5 mt-2 bg-surface p-4 rounded-card border border-border shadow-sm">
          <View className="flex-row items-center flex-1 mr-3">
            <Avatar name={user?.name || 'Student'} size={48} />
            <View className="ml-3 flex-1">
              <Text className="text-base font-bold text-text" numberOfLines={1}>
                Hi, {user?.name || 'Student'} 👋
              </Text>
              <Text className="text-xs text-muted mt-0.5">
                {user?.ageGroup ? user.ageGroup.replace('_', ' ') : 'Ready to learn'}
              </Text>
            </View>
          </View>

          <View className="bg-primary-soft px-3 py-1.5 rounded-chip border border-primary/20">
            <Text className="text-xs font-bold text-primary">Level {level}</Text>
          </View>
        </View>

        {/* Level & XP Overview */}
        <Card className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-semibold text-text">Level {level} Progress</Text>
            <Text className="text-xs text-muted">{xp} Total XP</Text>
          </View>
          <ProgressBar progress={progress} height={8} className="my-1.5" />
          <View className="flex-row items-center justify-between mt-1">
            <Text className="text-xs text-muted">
              {user?.xpIntoLevel ?? 0} / {user?.xpForNextLevel ?? 200} XP to Level {level + 1}
            </Text>
            <Text className="text-xs font-bold text-primary">
              {Math.round(progress * 100)}%
            </Text>
          </View>
        </Card>

        {/* Virtual Cash Balance Banner */}
        <Card className="mb-5 bg-indigo-900 border-indigo-950">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs text-indigo-200 font-medium">Virtual Portfolio Cash</Text>
              <Text className="text-2xl font-bold text-white mt-1">
                ₹{cashBalance.toLocaleString('en-IN')}
              </Text>
            </View>
            <View className="w-12 h-12 rounded-full bg-indigo-800/80 items-center justify-center">
              <Ionicons name="wallet-outline" size={24} color="#A5B4FC" />
            </View>
          </View>
        </Card>

        {/* Temporary Phase 3 Placeholder */}
        <View className="bg-surface border border-dashed border-border rounded-card p-6 items-center justify-center my-2">
          <View className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center mb-3">
            <Ionicons name="construct-outline" size={24} color="#64748B" />
          </View>
          <Text className="text-base font-bold text-text text-center mb-1">
            Home Dashboard
          </Text>
          <Text className="text-xs text-muted text-center max-w-[260px] leading-4">
            Phase 3 will build daily streaks, continue-learning shortcuts, and live market overview widgets here.
          </Text>
        </View>
      </ScrollView>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        visible={showLogoutDialog}
        title="Log Out"
        message="Are you sure you want to log out of FinSight? Your virtual portfolio and XP progress are securely saved."
        confirmTitle="Log Out"
        destructive
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </Screen>
  );
}
