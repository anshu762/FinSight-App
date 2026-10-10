import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/components/ui';
import { apiClient } from '../../src/api/client';
import { useAuthStore } from '../../src/stores/auth';
import { type AgeGroup, type AppError } from '../../src/api/types';

interface AgeOption {
  key: AgeGroup;
  title: string;
  ageRange: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const AGE_OPTIONS: AgeOption[] = [
  {
    key: 'TEEN_BEGINNER',
    title: 'Teen Beginner',
    ageRange: 'Ages 13–15',
    description: 'Master money basics, pocket money saving, smart habits, and budgeting.',
    icon: 'wallet-outline',
    color: '#3B82F6',
  },
  {
    key: 'TEEN_ADVANCED',
    title: 'Teen Advanced',
    ageRange: 'Ages 16–18',
    description: 'Learn stock market fundamentals, compound interest, banking, and digital payments.',
    icon: 'trending-up-outline',
    color: '#10B981',
  },
  {
    key: 'YOUNG_ADULT',
    title: 'Young Adult',
    ageRange: 'Ages 19–21',
    description: 'College money management, mutual funds, ETFs, credit scores, and side hustles.',
    icon: 'school-outline',
    color: '#F59E0B',
  },
  {
    key: 'YOUNG_PROFESSIONAL',
    title: 'Young Professional',
    ageRange: 'Ages 22–25',
    description: 'Salary budgeting, income tax slabs, portfolio asset allocation, and wealth creation.',
    icon: 'briefcase-outline',
    color: '#8B5CF6',
  },
];

export default function AgeGroupScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();

  const defaultOption = useMemo<AgeGroup>(() => {
    if (!user?.dob) return 'TEEN_BEGINNER';
    const birthDate = new Date(user.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age <= 15) return 'TEEN_BEGINNER';
    if (age <= 18) return 'TEEN_ADVANCED';
    if (age <= 21) return 'YOUNG_ADULT';
    return 'YOUNG_PROFESSIONAL';
  }, [user?.dob]);

  const [selected, setSelected] = useState<AgeGroup>(defaultOption);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleContinue = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await apiClient.patch('/api/users/me', {
        ageGroup: selected,
      });

      await updateUser({ ageGroup: selected });
      router.replace('/(tabs)');
    } catch (err) {
      const appErr = err as AppError;
      setErrorMessage(appErr.message || 'Failed to save age group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen className="justify-between py-6">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="mb-6 mt-4">
          <Text className="text-2xl font-bold text-text">Choose Your Path</Text>
          <Text className="text-sm text-muted mt-1.5 leading-5">
            We customize lesson pace, simulation difficulty, and quiz content to match your stage of life.
          </Text>
        </View>

        {errorMessage ? (
          <View className="bg-rose-50 border border-rose-200 rounded-card p-4 mb-4 flex-row items-center">
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text className="text-xs font-semibold text-danger ml-2.5 flex-1">{errorMessage}</Text>
          </View>
        ) : null}

        {/* 4 Cards */}
        <View className="gap-3.5 mb-6">
          {AGE_OPTIONS.map((opt) => {
            const isSelected = selected === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setSelected(opt.key)}
                className={`p-4 rounded-card border transition-all ${
                  isSelected
                    ? 'bg-primary-soft/40 border-primary shadow-sm'
                    : 'bg-surface border-border'
                }`}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: `${opt.color}15` }}
                    >
                      <Ionicons name={opt.icon} size={20} color={opt.color} />
                    </View>
                    <View>
                      <Text className="text-base font-bold text-text">{opt.title}</Text>
                      <Text className="text-xs font-medium text-muted">{opt.ageRange}</Text>
                    </View>
                  </View>

                  <View
                    className={`w-5 h-5 rounded-full border items-center justify-center ${
                      isSelected ? 'border-primary bg-primary' : 'border-slate-300'
                    }`}
                  >
                    {isSelected ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : null}
                  </View>
                </View>

                <Text className="text-xs text-muted leading-4 ml-1">
                  {opt.description}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Continue Action */}
      <View className="pt-2">
        <Button
          title="Continue to FinSight"
          variant="primary"
          loading={loading}
          onPress={handleContinue}
        />
      </View>
    </Screen>
  );
}
