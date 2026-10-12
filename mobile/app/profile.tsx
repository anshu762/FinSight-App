import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  ScreenHeader,
  Avatar,
  AppText,
  Card,
  Button,
  ConfirmDialog,
  ModalSheet,
} from '../src/components/ui';
import { useAuthStore } from '../src/stores/auth';
import { useProfile } from '../src/hooks/useProfile';
import { queryClient } from '../src/api/query-client';
import { type AgeGroup } from '../src/api/types';

const AGE_GROUPS: Array<{
  id: AgeGroup;
  title: string;
  age: string;
  emoji: string;
  desc: string;
}> = [
  {
    id: 'TEEN_BEGINNER',
    title: 'Teen Beginner',
    age: '13-15 yrs',
    emoji: '🌱',
    desc: 'Pocket money, saving basics, compounding, needs vs wants',
  },
  {
    id: 'TEEN_ADVANCED',
    title: 'Teen Advanced',
    age: '16-18 yrs',
    emoji: '📈',
    desc: 'Stock market, mutual funds, inflation, first bank accounts',
  },
  {
    id: 'YOUNG_ADULT',
    title: 'Young Adult',
    age: '19-21 yrs',
    emoji: '🚀',
    desc: 'College budgeting, SIPs, credit cards, taxes on internships',
  },
  {
    id: 'YOUNG_PROFESSIONAL',
    title: 'Young Professional',
    age: '22-25 yrs',
    emoji: '💼',
    desc: 'Salary slips, CTC vs in-hand, tax regimes, portfolio building',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useProfile();

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showAgeGroupModal, setShowAgeGroupModal] = useState(false);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | undefined>(
    user?.ageGroup || undefined
  );

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    queryClient.clear();
    await logout();
    router.replace('/(auth)/welcome');
  };

  const handleSaveAgeGroup = async () => {
    if (!selectedAgeGroup) return;
    try {
      await updateProfile({ ageGroup: selectedAgeGroup });
      setShowAgeGroupModal(false);
    } catch {
      // Toast handled by hook
    }
  };

  const currentAgeGroupInfo = AGE_GROUPS.find((g) => g.id === user?.ageGroup);

  return (
    <Screen>
      <ScreenHeader title="My Profile" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40 }}
      >
        {/* User Card */}
        <Card className="p-5 bg-surface border-border items-center mb-4">
          <Avatar name={user?.name || 'User'} size={72} />
          <AppText variant="h2" className="mt-3 text-center">
            {user?.name || 'FinSight Explorer'}
          </AppText>
          <AppText variant="caption" className="text-muted text-center mt-0.5">
            {user?.email}
          </AppText>
        </Card>

        {/* Stats Grid */}
        <View className="flex-row gap-3 mb-3">
          <Card className="flex-1 p-3.5 bg-surface border-border">
            <AppText variant="caption" className="text-muted">Level</AppText>
            <AppText variant="h2" className="text-primary font-bold mt-1">
              Level {user?.level ?? 1}
            </AppText>
            <AppText variant="caption" className="text-muted text-xs mt-0.5">
              {(user?.xp ?? 0).toLocaleString('en-IN')} total XP
            </AppText>
          </Card>

          <Card className="flex-1 p-3.5 bg-surface border-border">
            <AppText variant="caption" className="text-muted">Active Streak</AppText>
            <AppText variant="h2" className="text-amber-500 font-bold mt-1">
              🔥 {user?.streak ?? 0}
            </AppText>
            <AppText variant="caption" className="text-muted text-xs mt-0.5">
              Record: {user?.longestStreak ?? 0} days
            </AppText>
          </Card>
        </View>

        {/* Age Group Section */}
        <Card className="p-4 bg-surface border-border mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <AppText variant="h3">Learning Stage</AppText>
            <Pressable
              onPress={() => {
                setSelectedAgeGroup(user?.ageGroup || undefined);
                setShowAgeGroupModal(true);
              }}
              className="bg-primary-soft px-3 py-1 rounded-full active:bg-indigo-100"
              accessibilityLabel="Change learning stage"
            >
              <AppText className="text-primary text-xs font-bold">Edit Stage</AppText>
            </Pressable>
          </View>

          <View className="flex-row items-center gap-3 bg-slate-50 border border-border rounded-xl p-3">
            <AppText className="text-2xl">{currentAgeGroupInfo?.emoji || '🎯'}</AppText>
            <View className="flex-1">
              <AppText variant="body" className="font-bold text-sm">
                {currentAgeGroupInfo?.title || 'Not Selected'} ({currentAgeGroupInfo?.age || ''})
              </AppText>
              <AppText variant="caption" className="text-muted text-xs leading-4 mt-0.5">
                {currentAgeGroupInfo?.desc || 'Select your financial learning track'}
              </AppText>
            </View>
          </View>
        </Card>

        {/* Quick Shortcuts */}
        <Card className="p-2 bg-surface border-border mb-6">
          <Pressable
            onPress={() => router.push('/badges')}
            className="flex-row items-center justify-between p-3 active:bg-slate-50 rounded-xl"
            accessibilityLabel="Open badges screen"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-full bg-amber-50 items-center justify-center border border-amber-200">
                <Ionicons name="trophy" size={16} color="#F59E0B" />
              </View>
              <AppText variant="body" className="font-semibold text-sm">
                Badges & Achievements
              </AppText>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>
        </Card>

        {/* Logout Button */}
        <Button
          title="Log Out"
          variant="danger"
          size="lg"
          onPress={() => setShowLogoutDialog(true)}
        />
      </ScrollView>

      {/* Age Group Edit Modal */}
      <ModalSheet
        visible={showAgeGroupModal}
        onClose={() => setShowAgeGroupModal(false)}
        title="Change Learning Stage"
        subtitle="Tailor lessons and simulations to your stage"
      >
        <View className="gap-2.5 py-1 mb-4">
          {AGE_GROUPS.map((group) => {
            const isSelected = selectedAgeGroup === group.id;
            return (
              <Pressable
                key={group.id}
                onPress={() => setSelectedAgeGroup(group.id)}
                className={`p-3.5 rounded-card border flex-row items-center gap-3 active:opacity-90 ${
                  isSelected
                    ? 'border-primary bg-primary-soft/40'
                    : 'border-border bg-surface'
                }`}
              >
                <AppText className="text-2xl">{group.emoji}</AppText>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <AppText variant="body" className="font-bold text-sm">
                      {group.title}
                    </AppText>
                    <AppText variant="caption" className="text-muted text-xs">
                      {group.age}
                    </AppText>
                  </View>
                  <AppText variant="caption" className="text-muted text-xs mt-0.5">
                    {group.desc}
                  </AppText>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color="#4F46E5" />
                )}
              </Pressable>
            );
          })}
        </View>

        <Button
          title="Save Changes"
          variant="primary"
          loading={isUpdating}
          onPress={handleSaveAgeGroup}
        />
      </ModalSheet>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        visible={showLogoutDialog}
        title="Log Out"
        message="Are you sure you want to log out? Your progress, XP, and streaks are safely stored."
        confirmTitle="Log Out"
        destructive
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </Screen>
  );
}
