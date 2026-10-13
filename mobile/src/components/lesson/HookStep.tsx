import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { type HookContent } from '../../api/types';
import { useLessonMachine } from '../../features/lesson/lessonMachine';

export interface HookStepProps {
  hook: HookContent;
  topicTitle?: string;
  topicColor?: string;
  onContinue: () => void;
}

export const HookStep: React.FC<HookStepProps> = ({
  hook,
  topicTitle,
  topicColor = '#4F46E5',
  onContinue,
}) => {
  const hookCountdown = useLessonMachine((s) => s.hookCountdown);
  const isHookReady = useLessonMachine((s) => s.isHookReady);
  const decrementCountdown = useLessonMachine((s) => s.decrementCountdown);

  useEffect(() => {
    if (isHookReady) return;

    const timer = setInterval(() => {
      decrementCountdown();
    }, 1000);

    return () => clearInterval(timer);
  }, [isHookReady, decrementCountdown]);

  // Haptic trigger once countdown finishes
  useEffect(() => {
    if (isHookReady) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Fallback if unsupported
      }
    }
  }, [isHookReady]);

  const buttonTitle = isHookReady
    ? 'Continue'
    : `Read & Reflect (${hookCountdown}s)`;

  return (
    <View className="flex-1 justify-between px-5 pb-6">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 20 }}
      >
        <Card className="p-6 bg-surface border-border items-center">
          {/* Topic / Hook Chip */}
          <View
            style={{ backgroundColor: `${topicColor}15` }}
            className="px-3 py-1 rounded-full mb-5"
          >
            <AppText
              style={{ color: topicColor }}
              className="text-xs font-bold uppercase tracking-wider"
            >
              {topicTitle || 'Daily Insight'}
            </AppText>
          </View>

          {/* Emoji Illustration */}
          <View
            style={{ backgroundColor: `${topicColor}10` }}
            className="w-24 h-24 rounded-full items-center justify-center mb-6 border border-slate-100 shadow-sm"
          >
            <AppText className="text-5xl">{hook.emoji}</AppText>
          </View>

          {/* Bold Title */}
          <AppText variant="h2" className="text-center text-text mb-3">
            {hook.title}
          </AppText>

          {/* Provocative Question */}
          <View className="bg-slate-50 border border-border rounded-xl p-4 w-full mb-4">
            <AppText
              variant="body"
              className="text-center font-semibold text-slate-800 leading-6 text-base"
            >
              "{hook.question}"
            </AppText>
          </View>

          {/* Context Subtitle */}
          {hook.subtitle ? (
            <AppText
              variant="caption"
              className="text-muted text-center leading-5 text-sm"
            >
              {hook.subtitle}
            </AppText>
          ) : null}
        </Card>
      </ScrollView>

      {/* Bottom Button with Countdown indicator */}
      <View className="gap-2 pt-2">
        {!isHookReady ? (
          <View className="h-1.5 bg-slate-100 rounded-full overflow-hidden w-full mb-1">
            <View
              className="h-full bg-primary"
              style={{
                width: `${((3 - hookCountdown) / 3) * 100}%`,
              }}
            />
          </View>
        ) : null}

        <Button
          title={buttonTitle}
          variant="primary"
          disabled={!isHookReady}
          onPress={onContinue}
          className="w-full"
        />
      </View>
    </View>
  );
};
