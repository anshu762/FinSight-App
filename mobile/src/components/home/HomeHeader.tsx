import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, AppText, Chip, ModalSheet } from '../ui';

interface HomeHeaderProps {
  name: string;
  streak: number;
  onAvatarPress: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  name,
  streak,
  onAvatarPress,
}) => {
  const [showStreakModal, setShowStreakModal] = useState(false);
  const firstName = name.trim().split(' ')[0] || 'Friend';

  return (
    <>
      <View className="flex-row items-center justify-between py-3 mb-2">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={onAvatarPress}
            hitSlop={6}
            accessibilityLabel="Open user profile"
            className="active:opacity-80"
          >
            <Avatar name={name} size={46} />
          </Pressable>
          <View>
            <AppText variant="caption" className="text-muted">
              Welcome back
            </AppText>
            <AppText variant="h2" numberOfLines={1}>
              Hi, {firstName} 👋
            </AppText>
          </View>
        </View>

        <Pressable
          onPress={() => setShowStreakModal(true)}
          hitSlop={6}
          accessibilityLabel="Streak information"
          className="active:opacity-80"
        >
          <Chip
            label={`${streak} day${streak === 1 ? '' : 's'}`}
            variant="warning"
            icon={<Ionicons name="flame" size={16} color="#F59E0B" />}
          />
        </Pressable>
      </View>

      <ModalSheet
        visible={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        title="Daily Learning Streak 🔥"
        subtitle="Consistency is the key to mastering money"
      >
        <View className="gap-3 py-2">
          <AppText variant="body" className="text-slate-700 leading-6">
            Log in every day (in Indian Standard Time) to build your streak and earn valuable XP rewards!
          </AppText>
          <View className="bg-slate-50 border border-border rounded-xl p-3.5 gap-2">
            <AppText variant="caption" className="font-bold text-slate-800">
              Streak Milestone Rewards:
            </AppText>
            <AppText variant="caption" className="text-slate-600">
              • Daily check-in: +25 XP every day
            </AppText>
            <AppText variant="caption" className="text-slate-600">
              • 7-Day streak bonus: +200 XP
            </AppText>
            <AppText variant="caption" className="text-slate-600">
              • 30-Day streak bonus: +1,000 XP
            </AppText>
          </View>
          <AppText variant="caption" className="text-muted leading-5">
            If you miss a calendar day, your streak resets to 1, but your longest streak is always preserved on your profile.
          </AppText>
        </View>
      </ModalSheet>
    </>
  );
};
