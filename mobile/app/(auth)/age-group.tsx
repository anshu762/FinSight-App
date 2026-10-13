import React, { useState, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Button, AppText } from '../../src/components/ui';
import { AgeGroupCard } from '../../src/components/auth';
import { AGE_GROUP_DEFINITIONS } from '../../src/lib/ageGroups';
import { updateUserAgeGroup } from '../../src/api/user';
import { useAuthStore } from '../../src/stores/auth';
import { type AgeGroup, type AppError } from '../../src/api/types';

export default function AgeGroupScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();

  const defaultOption = useMemo<AgeGroup>(() => {
    if (!user?.dob) return 'TEEN_BEGINNER';
    const birthDate = new Date(user.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

    if (age <= 15) return 'TEEN_BEGINNER';
    if (age <= 18) return 'TEEN_ADVANCED';
    if (age <= 21) return 'YOUNG_ADULT';
    return 'YOUNG_PROFESSIONAL';
  }, [user?.dob]);

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>(defaultOption);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage('');

    try {
      const updated = await updateUserAgeGroup(selectedAgeGroup);
      await updateUser(updated);
      router.replace('/(tabs)');
    } catch (err) {
      const appErr = err as AppError;
      setErrorMessage(appErr.message || 'Failed to update age group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen paddingHorizontal={false}>
      <View className="px-5 pt-3 pb-2 border-b border-border/50">
        <AppText variant="caption" className="text-primary font-bold tracking-wider uppercase text-xs">
          Personalization
        </AppText>
        <AppText variant="h2" className="text-2xl font-bold text-text mt-1">
          Select Your Learning Stage
        </AppText>
        <AppText variant="body" className="text-sm text-muted mt-1 leading-5">
          We tailor your micro lessons and quiz scenarios to match your real-world money stage.
        </AppText>
      </View>

      {Boolean(errorMessage) && (
        <View className="mx-5 my-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
          <AppText variant="caption" className="text-danger text-xs">
            {errorMessage}
          </AppText>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}
      >
        {AGE_GROUP_DEFINITIONS.map((opt) => (
          <AgeGroupCard
            key={opt.key}
            option={opt}
            isSelected={selectedAgeGroup === opt.key}
            onSelect={() => setSelectedAgeGroup(opt.key)}
          />
        ))}
      </ScrollView>

      <View className="p-5 bg-surface border-t border-border">
        <Button
          title="Continue to App"
          variant="primary"
          loading={loading}
          disabled={loading}
          onPress={handleConfirm}
        />
      </View>
    </Screen>
  );
}
