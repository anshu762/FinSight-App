import React from 'react';
import { Modal, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';

export interface LevelUpModalProps {
  visible: boolean;
  level: number;
  onContinue: () => void;
}

const LEVEL_TITLES: Record<number, string> = {
  1: 'Financial Novice',
  2: 'Smart Saver',
  3: 'Market Explorer',
  4: 'Wealth Apprentice',
  5: 'Portfolio Strategist',
  6: 'Capital Architect',
  7: 'Financial Maverick',
  8: 'Wealth Master',
  9: 'Chief Economist',
  10: 'Financial Legend',
};

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  visible,
  level,
  onContinue,
}) => {
  const levelTitle = LEVEL_TITLES[level] || `Level ${level} Master`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/60 items-center justify-center p-5">
        <View className="w-full max-w-[340px] bg-surface rounded-card p-6 border border-border items-center shadow-xl">
          {/* Badge Glow */}
          <View className="w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-300 items-center justify-center mb-4 shadow-sm">
            <Ionicons name="trophy" size={38} color="#D97706" />
          </View>

          <View className="bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-2">
            <AppText className="text-amber-800 text-xs font-bold uppercase tracking-wider">
              Level Reached
            </AppText>
          </View>

          <AppText variant="h2" className="text-center text-text mb-1">
            Level {level}
          </AppText>

          <AppText variant="h3" className="text-center text-primary font-bold mb-3">
            {levelTitle}
          </AppText>

          <AppText variant="caption" className="text-muted text-center leading-5 mb-6 px-2">
            Incredible dedication! You’ve unlocked new daily challenges, enhanced streak bonuses, and deeper financial simulations.
          </AppText>

          <Button
            title="Continue Learning"
            variant="primary"
            onPress={onContinue}
            className="w-full"
          />
        </View>
      </View>
    </Modal>
  );
};
